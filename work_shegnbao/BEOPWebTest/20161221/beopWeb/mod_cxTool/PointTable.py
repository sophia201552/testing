__author__ = 'win7'
import logging
import re
from datetime import datetime

from bson.objectid import ObjectId

from beopWeb.BEOPMongoDataAccess import g_tableDataSource
from beopWeb.MongoConnManager import MongoConnManager
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_admin.User import User
from beopWeb.mod_admin.RealTimeData import RealTimeData
from beopWeb.mod_tag.Tag import TagThing


class PointTableSourceType:
    TYPE_ENGINE = 3  # 现场点表配置
    TYPE_CLOUD = 4  # 云端组态配置


class CloudPointType:
    MAPPING_POINT = 0  # 映射点
    VIRTUAL_POINT = 1  # 算法点
    CALC_POINT = 2  # 计算点


class StorageSourceType:
    RAW = 1
    BUFFER = 2


class PointTable:
    def __init__(self, project_id):
        self.db = MongoConnManager.getConfigConn().mdbBb[g_tableDataSource]
        self.tag_things_collection = 'ThingsTree_' + str(project_id)
        self.tag_db = MongoConnManager.getConfigConn().mdbBb[self.tag_things_collection]
        self.project_id = int(project_id)

    def handle_project_id(self, point):
        if point and point.get('projId') and not isinstance(point.get('projId'), int):
            point['projId'] = int(point.get('projId'))

    def import_data_to_db(self, data, source_type):
        existed_points_map = self.get_point_map(source_type)
        update_list = []
        insert_list = []
        try:
            for data_item in data:
                self.handle_project_id(data_item)
                if existed_points_map.get(data_item.get('value')):
                    existed_point = existed_points_map.get(data_item.get('value'))
                    existed_point_params = existed_point.get('params')
                    data_item_params = data_item.get('params')
                    existed_point_params.update(data_item_params)
                    existed_point.update(data_item)
                    existed_point['params'] = existed_point_params
                    update_list.append(existed_point)
                else:
                    insert_list.append(data_item)
            if update_list:
                self.update_many(update_list)
                logging.info('点表更新:' + str(update_list))
            if insert_list:
                self.db.insert_many(insert_list)
                logging.info('点表新增:' + str(insert_list))
            return True
        except Exception as e:
            logging.error('点表更新错误,项目:' + str(self.project_id) + ' ' + str(e))
            return False

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
            logging.error('映射更新错误,项目:' + str(self.project_id))

    def get_point_table(self, source_type, start_num=None, page_size=None, mapped='all', flag=None):

        query = {'projId': self.project_id, 'type': source_type}
        if flag is not None:
            if int(flag) == CloudPointType.MAPPING_POINT:
                query.update({'$or': [{'params.flag': int(flag)}, {'params.flag': {'$exists': False}}]})
            else:
                query.update({'params.flag': int(flag)})

        if mapped == 'noMapped':
            query['params.mapping.point'] = {'$exists': False}
        elif mapped == 'mapped':
            query['params.mapping.point'] = {'$exists': True, "$ne": ""}

        cursor = self.db.find(query, projection={'groupId': False, 'type': False}, sort=[('value', 1)])
        total = cursor.count()
        if start_num is not None and page_size is not None:
            cursor = cursor.skip(start_num).limit(page_size)
        result = []
        user_map = User().get_all_user_map()
        for item in cursor:
            item['_id'] = str(item.get('_id'))
            item['modify_by'] = user_map.get(item.get('modify_by')).get('userfullname') if user_map.get(
                item.get('modify_by')) else ''
            result.append(item)
        return result, total

    def _get_real_time_data_flag(self, item):
        flag = item.get('flag', CloudPointType.MAPPING_POINT)
        if flag is None:
            flag = CloudPointType.MAPPING_POINT
        else:
            flag = int(flag)
        return flag

    # 从实时表里获取云点
    def get_real_time_points(self, search_text=None, point_type_list=None, storage_source=StorageSourceType.BUFFER):
        data = RealTimeData(self.project_id).getBufferRTDataListWithFlagByProj()
        data_list = []
        if point_type_list:
            for item in data:
                flag = self._get_real_time_data_flag(item)
                if flag in point_type_list:
                    data_list.append(dict(name=item.get('pointname'), flag=flag, params={}))
        else:
            for item in data:
                flag = self._get_real_time_data_flag(item)
                data_list.append(dict(name=item.get('pointname'), flag=flag, params={}))

        search_result_list = []
        if search_text:
            if not search_text.endswith('.*') or not search_text.endswith('$'):
                search_text += '.*'
            search_re = re.compile(search_text, re.IGNORECASE)
            for data_item in data_list:
                if search_re.match(data_item.get('name').strip()):
                    search_result_list.append(data_item)
        else:
            search_result_list = data_list
        return search_result_list, len(data_list)

    def search_point_in_remark(self, source_type, search_text, start_num=None, page_size=None):
        query = {'projId': self.project_id, 'type': source_type,
                 'alias': Utils.handle_search_text(search_text)}
        cursor = self.db.find(query, projection={'value': True}, sort=[('alias', 1)])
        total = cursor.count()
        if start_num is not None and page_size is not None:
            cursor = cursor.skip(start_num).limit(page_size)

        result = []
        for item in cursor:
            result.append(item)
        return result, total

    def search_point(self, source_type, search_text,
                     start_num=None, page_size=None, mapped='all',
                     point_flag=None, order=None):

        begin_time = datetime.now()
        if search_text:
            # flask会将\改成/
            # 防止第一个字符是*的情况
            search_text = re.sub('^\\*', '.*', search_text)
            search_text = re.sub('\\^(\\*)', '^.*', search_text)

            search_regex = Utils.handle_search_text(search_text)
            query = {'projId': self.project_id,
                     'type': source_type,
                     '$or': [{'value': {'$regex': search_regex}}, {'alias': {'$regex': search_regex}}]}
        else:
            query = {'projId': self.project_id, 'type': source_type}

        if point_flag is not None:
            query['params.flag'] = int(point_flag)

        if mapped == 'noMapped':
            query['params.mapping.point'] = {'$exists': False}
        elif mapped == 'mapped':
            query['params.mapping.point'] = {'$exists': True, "$ne": ""}

        query_order = [('_id', -1)]
        if order:
            query_order = [tuple(o) for o in order if isinstance(order, list)]
        cursor = self.db.find(query, projection={'groupId': False, 'type': False}, sort=query_order)

        total = cursor.count()
        if not total:
            return [], 0
        if start_num is not None and page_size is not None:
            cursor = cursor.skip(start_num).limit(page_size)

        result = []
        for item in cursor:
            result.append(item)
        end_time = datetime.now()
        logging.info('cloud points search time in mongo ' + str(end_time - begin_time) + '\n' + str(query))
        return result, total

    def get_point_map(self, source_type=None):
        query = {'projId': self.project_id}
        if source_type:
            query['type'] = source_type

        cursor = self.db.find(query, projection={'groupId': False, 'type': False})

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
                result[item.get('alias')] = item
        return result

    def get_points_count(self, source_type):
        return self.db.count({'projId': self.project_id, 'type': source_type})

    def is_exists(self, point_value, point_type, point_id):
        if not point_value or not point_type:
            return False
        if point_id:
            return self.db.find_one({'projId': self.project_id, 'value': re.compile('^' + point_value + '$', re.IGNORECASE), 'type': point_type, '_id': re.compile('^(?!(' + point_id + ')$)')})
        else:
            return self.db.find_one(
                {'projId': self.project_id, 'value': re.compile('^' + point_value + '$', re.IGNORECASE), 'type': point_type})

    def add_point(self, model):
        if model:
            self.handle_project_id(model)
        result = self.db.insert_one(model)
        if result.inserted_id:
            self.tag_db.insert_one(
                {'_id': ObjectId(result.inserted_id), 'name': model.get('value'), 'Prt': None,
                 'type': 'thing', 'keywords': TagThing.split_point_name(model.get('value')),
                 'tag': {}, 'attrP': {}})
            return result.inserted_id
        else:
            return False

    def edit_point(self, point_id, model):
        self.handle_project_id(model)
        if 'value' in model.keys():
            self.tag_db.update_one({'_id': ObjectId(point_id)}, {'$set': {'name': model.get('value'),
                                                                          'keywords': TagThing.split_point_name(model.get('value'))}}, False)
        return self.db.update_one({'_id': ObjectId(point_id)}, {'$set': model})

    def get_point_by_id(self, point_id):
        return self.db.find_one({'_id': ObjectId(point_id)})

    def delete_points(self, pointId_list, point_type):
        #result = self.db.delete_many({'projId': self.project_id, 'value': {'$in': point_list}, 'type': point_type})
        result = self.db.delete_many({'projId': self.project_id, '_id': {'$in': pointId_list}, 'type': point_type})
        if int(point_type) == 4:
            self.tag_db.delete_many({'_id':{'$in':pointId_list}})
        return result.deleted_count

    def delete_all_scene(self):
        result= self.db.delete_many({'projId': self.project_id, 'type': 4,'params.flag':0})
        return result.deleted_count

    def delete_all(self, type):
        return self.db.delete_many({'projId': self.project_id, 'type': type})

    def update_many(self, data_list):
        try:
            for item in data_list:
                item['_id'] = ObjectId(item.get('_id'))
                self.handle_project_id(item)
                self.db.update_one({'_id': item.get('_id')}, {'$set': item}, upsert=True)
            return True
        except Exception as e:
            logging.error('point table auto save error' + str(e))
            return False

    def add_many_points(self, points):
        if points:
            for point in points:
                self.handle_project_id(point)
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
                    'device': '',
                    'type': '',
                    'note': '',
                    'mapping': {"point": item.get('value').strip(),
                                "by": user_id,
                                "id": str(item.get('_id')),
                                "time": datetime.now().strftime(Utils.datetime_format_full)}
                }
                item['alias'] = item.get('alias')
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
                        'mapping': {"point": item.get('value').strip(),
                                    "by": user_id,
                                    "id": str(item.get('_id')),
                                    "time": Utils.get_now_full_str()}
                    }
                    item['alias'] = item.get('alias').strip()
                    add_point_list.append(item)
            result = self.add_many_points(add_point_list)
            if result:
                return len(result.inserted_ids)
            else:
                return 0

    def sync_cloud_points(self, user_id):
        real_time_points, total = self.get_real_time_points(point_type_list=[CloudPointType.VIRTUAL_POINT,
                                                                             CloudPointType.MAPPING_POINT],
                                                            storage_source=StorageSourceType.RAW)
        now = datetime.now().strftime(Utils.datetime_format_full)
        cloud_insert = []

        cloud_update_map = {}

        exists_cloud_points = self.get_point_map(PointTableSourceType.TYPE_CLOUD)

        for point in real_time_points:
            if point.get('flag') == CloudPointType.CALC_POINT:
                continue
            point_name = point.get('name', '').strip()
            point_name_cloud = point_name
            if not point_name:
                continue

            if not Utils.CLOUD_POINT_NAME_VALID.match(point_name):
                point_name_cloud = point_name_cloud.replace('.', '__')
                if not Utils.CLOUD_POINT_NAME_VALID.match(point_name_cloud):
                    if Utils.CLOUD_POINT_NAME_START_WITH_NUM.match(point_name_cloud[0]):
                        point_name_cloud='P_'+point_name_cloud
                        if not Utils.CLOUD_POINT_NAME_VALID.match(point_name_cloud):
                            continue
                    else:
                        continue
                

            # 存在该云点
            if exists_cloud_points.get(point_name_cloud):
                existed_point = exists_cloud_points.get(point_name_cloud)
                if not existed_point.get('params'):
                    existed_point['params'] = {'mapping': {}}

                if existed_point.get('params').get('mapping') \
                        and existed_point.get('params').get('mapping').get('point') == point_name:
                    continue

                existed_point.get('params')['mapping'] = {
                    'point': point_name,
                    'by': user_id,
                    'time': now
                }
                if existed_point.get('params').get('flag') != CloudPointType.CALC_POINT:
                    existed_point.get('params')['flag'] = int(point.get('flag'))
                cloud_update_map[existed_point.get('value')] = existed_point
            else:
                cloud_insert.append({
                    'projId': self.project_id,
                    'value': point_name_cloud,
                    'type': PointTableSourceType.TYPE_CLOUD,
                    'params': {
                        'mapping': {
                            'point': point_name,
                            'by': user_id,
                            'time': now
                        },
                        'flag': int(point.get('flag')) if point.get('flag') is not None else 0
                    },
                    'modify_by': user_id,
                    'modify_time': now,
                    'note': '',
                    'alias': point_name})
        total = 0

        if cloud_insert:
            insert_obj = self.db.insert_many(cloud_insert)
            total += len(insert_obj.inserted_ids)

        if cloud_update_map:
            for point_name in cloud_update_map:
                point = cloud_update_map.get(point_name)
                update_obj = self.db.update_one({'_id': point.get('_id')}, {'$set': point})
                total += update_obj.modified_count

        return total

    def clear_cloud_points(self, flag):
        if int(flag) == 0:
            return self.db.delete_many(
                {'projId': self.project_id, 'type': PointTableSourceType.TYPE_CLOUD,
                 'params.flag': {'$in': [0, None]}})
        else:
            return self.db.delete_many(
                {'projId': self.project_id, 'type': PointTableSourceType.TYPE_CLOUD, 'params.flag': int(flag)})

    def clear_engine_points(self):
        return self.db.delete_many({'projId': self.project_id, 'type': PointTableSourceType.TYPE_ENGINE})

    def get_points_by_tag(self, tag_ids):
        cursor = self.db.find({'projId': self.project_id, 'tags': [ObjectId(tag_id) for tag_id in tag_ids]})
        return [item for item in cursor]
