__author__ = 'win7'
import logging
import re

from bson.objectid import ObjectId

from beopWeb.BEOPMongoDataAccess import g_tableDataSource
from beopWeb.MongoConnManager import MongoConnManager
from datetime import datetime
from beopWeb.mod_common.Utils import Utils


class PointTableSourceType:
    TYPE_ENGINE = 3  # 现场点表配置
    TYPE_CLOUD = 4  # 云端组态配置


class PointTable:
    POINT_SEARCH_SPLIT = re.compile('\s+')
    STANDARD_POINT_SYS_REX = re.compile('(\w{1,})(\d{1})(\d{2})')
    STANDARD_POINT_SYS_INFO = '#{NUM}{SYS}'
    STANDARD_POINT_NUM_REX = re.compile('\d{2}')

    def __init__(self, project_id):
        self.db = MongoConnManager.getConfigConn().mdbBb[g_tableDataSource]
        self.project_id = project_id

    def import_data_to_db(self, data, source_type):
        try:
            self.db.delete_many({'projId': self.project_id, 'type': source_type})
            self.db.insert_many(data)
            return self.get_point_table(source_type)
        except Exception:
            logging.error('点表更新错误,项目:' + self.project_id)

    def batch_point_mapping(self, mapping_dict, operator=1):
        try:
            engine_points_map = self.get_point_map(PointTableSourceType.TYPE_ENGINE)
            cloud_points_map = self.get_point_map(PointTableSourceType.TYPE_CLOUD)
            change_list = []
            for item in mapping_dict:
                cloud_point_value = item.get('cloud point').strip()
                engine_point_value = item.get('engine point').strip()
                cloud_point = cloud_points_map.get(cloud_point_value)
                engine_point = engine_points_map.get(engine_point_value)
                if not engine_point or not cloud_point:
                    continue
                params = cloud_point.get('params')
                if not params.get('mapping', None):
                    params['mapping'] = {}
                params['mapping'].update({
                    'point_id': str(engine_point.get('_id')),
                    'point': engine_point_value,
                    'time': datetime.now().strftime(Utils.datetime_format_full),
                    'by': operator
                })
                change_list.append(cloud_point)

            return self.update_many(change_list)
        except Exception:
            logging.error('映射更新错误,项目:' + self.project_id)

    def get_point_table(self, source_type, start_num=None, page_size=None, mapped='all'):
        query = {'projId': self.project_id, 'type': source_type}

        if mapped == 'noMapped':
            query['params.mapping.point'] = {'$exists': False}
        elif mapped == 'mapped':
            query['params.mapping.point'] = {'$exists': True, "$ne": ""}

        cursor = self.db.find(query, projection={'groupId': False, 'type': False}, sort=[('value', 1)])
        total = cursor.count()
        if start_num is not None and page_size is not None:
            cursor = cursor.skip(start_num).limit(page_size)
        result = []
        for item in cursor:
            item['_id'] = str(item.get('_id'))
            result.append(item)
        return result, total

    def search_point(self, source_type, text, start_num=None, page_size=None, mapped='all'):
        if text:
            text_list = PointTable.POINT_SEARCH_SPLIT.split(text)
            chinese_regex = re.compile('[\u4e00-\u9fff]+')
            en_list = []  # 英文单词集合
            cn_list = []  # 中文集合用来查找注释
            for term in text_list:
                if chinese_regex.match(term):
                    cn_list.append(term)
                else:
                    en_list.append(term)
            query = {'projId': self.project_id, 'type': source_type}

            if en_list and not cn_list:
                query.update({'value': re.compile('.*'.join(en_list), re.IGNORECASE)})
            elif not en_list and cn_list:
                query.update({'params.remark': re.compile('.*'.join(cn_list), re.IGNORECASE)})
            elif en_list and cn_list:
                query['$and'] = [{'value': re.compile('.*'.join(en_list), re.IGNORECASE)},
                                 {'params.remark': re.compile('.*'.join(cn_list), re.IGNORECASE)}]
        else:
            query = {'projId': self.project_id, 'type': source_type}

        if mapped == 'noMapped':
            query['params.mapping.point'] = {'$exists': False}
        elif mapped == 'mapped':
            query['params.mapping.point'] = {'$exists': True, "$ne": ""}

        cursor = self.db.find(query, projection={'groupId': False, 'type': False},
                              sort=[('value', 1), ('params.remark', 1)])
        total = cursor.count()
        if start_num is not None and page_size is not None:
            cursor = cursor.skip(start_num).limit(page_size)
        result = []
        for item in cursor:
            item['_id'] = str(item.get('_id'))
            result.append(item)
        return result, total

    def get_point_map(self, source_type):
        cursor = self.db.find({'projId': self.project_id, 'type': source_type},
                              projection={'groupId': False, 'type': False})

        return {item.get('value'): item for item in cursor}

    def get_some_points_map(self, source_type, point_list):
        cursor = self.db.find({'projId': self.project_id, 'type': source_type, 'value': {'$in': point_list}},
                              projection={'groupId': False, 'type': False})

        return {item.get('value'): item for item in cursor}

    def get_point_remark_map(self, source_type):
        cursor = self.db.find({'projId': self.project_id, 'type': source_type},
                              projection={'groupId': False, 'type': False})
        result = {}
        for item in cursor:
            item['_id'] = str(item.get('_id'))
            if item.get('params'):
                result[item.get('params').get('remark')] = item
        return result

    def get_points_count(self, source_type):
        return self.db.count({'projId': self.project_id, 'type': source_type})

    def is_exists(self, point_value):
        return self.db.find_one({'projId': self.project_id, 'value': point_value})

    def add_point(self, model):
        result = self.db.insert_one(model)
        if result.inserted_id:
            return result.inserted_id
        else:
            return False

    def edit_point(self, point_id, model):
        return self.db.update_one({'_id': ObjectId(point_id)}, {'$set': model})

    def delete_points(self, point_list, type):
        result = self.db.delete_many({'projId': self.project_id, 'value': {'$in': point_list}, 'type': type})
        return result.deleted_count

    def delete_all(self, type):
        return self.db.delete_many({'projId': self.project_id, 'type': type})

    def update_many(self, data_list):
        try:
            for item in data_list:
                item['_id'] = ObjectId(item.get('_id'))
                self.db.update_one({'_id': item.get('_id')}, {'$set': item})
            return True
        except Exception as e:
            logging.error('point table auto save error' + str(e))
            return False

    def add_many_points(self, points):
        if points:
            return self.db.insert_many(points)

    def camel_case_split(self, text):
        return re.compile('[^a-zA-Z0-9\u4e00-\u9fff]+').split(
            re.sub('((?<=[a-z0-9])[A-Z]|(?<=\D)\d|(?!^)[A-Z](?=[a-z])|(?!^)[\u4e00-\u9fff]+)', r'_\1', text))

    def convert_engine_point_to_cloud_point(self, user_id, type):
        if str(type) == '0':  # 覆盖
            self.delete_all(PointTableSourceType.TYPE_CLOUD)
            points_map = self.get_point_map(PointTableSourceType.TYPE_ENGINE)
            for key, item in points_map.items():
                item['params'] = {
                    'system': '',
                    'remark': item.get('params').get('remark'),
                    'device': '',
                    'type': '',
                    'mapping': {"point": item.get('value').strip(),
                                "by": user_id,
                                "id": str(item.get('_id')),
                                "time": datetime.now().strftime(Utils.datetime_format_full)}
                }
                item['alias'] = item.get('value')
                item['type'] = PointTableSourceType.TYPE_CLOUD
                item['modify_by'] = user_id
                item['modify_time'] = datetime.now().strftime(Utils.datetime_format_full)
                del item['_id']
            result = self.add_many_points(list(points_map.values()))
            if result:
                return len(result.inserted_ids)
            else:
                return 0
        elif str(type) == '1':  # merge
            cloud_map = self.get_point_map(PointTableSourceType.TYPE_CLOUD)
            engine_map = self.get_point_map(PointTableSourceType.TYPE_ENGINE)
            add_point_list = []
            for key, item in engine_map.items():
                if key not in cloud_map:
                    item['type'] = PointTableSourceType.TYPE_CLOUD
                    del item['_id']
                    item['params'] = {
                        'remark': item.get('params').get('remark'),
                        'mapping': {"point": item.get('value').strip(),
                                    "by": user_id,
                                    "id": str(item.get('_id')),
                                    "time": Utils.get_now_full_str()}
                    }
                    item['alias'] = item.get('value').strip()
                    add_point_list.append(item)
            result = self.add_many_points(add_point_list)
            if result:
                return len(result.inserted_ids)
            else:
                return 0
