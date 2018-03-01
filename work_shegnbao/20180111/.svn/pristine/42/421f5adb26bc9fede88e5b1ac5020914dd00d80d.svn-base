import logging
import re
from datetime import datetime
import json
import urllib

from bson.objectid import ObjectId
import requests

from beopWeb.BEOPDataAccess import BEOPDataAccess
from beopWeb.BEOPMongoDataAccess import g_tableDataSource, g_table_clouddiagnosis
from beopWeb.MongoConnManager import MongoConnManager
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_admin.User import User
from beopWeb.mod_admin.RealTimeData import RealTimeData
from beopWeb.mod_tag.Tag import TagThing
from beopWeb.mod_tag.pointTag import pointTag
from beopWeb import app


class VoteType:
    """
    点质量评价类型
    """
    UP_VOTE = 1  # 赞同
    DOWN_VOTE = 2  # 反对


class PointTableSourceType:
    TYPE_ENGINE = 3  # 现场点表配置
    TYPE_CLOUD = 4  # 云端组态配置
    TYPE_MODBUS = 5  # modbus点表配置


class CloudPointType:
    MAPPING_POINT = 0  # 现场点
    VIRTUAL_POINT = 1  # 虚拟点
    CALC_POINT = 2  # 计算点


class StorageSourceType:
    RAW = 1
    BUFFER = 2


class PointTable:
    VERSION_KEYS = ['modify_time', 'modify_by', 'value', 'note', 'alias', 'params', 'pointValue']

    def __init__(self, project_id=None):
        self.db = MongoConnManager.getConfigConn().mdbBb[g_tableDataSource]
        self.tag_things_collection = 'cloudPoint'
        self.alarm_things_collection = 'Alarm_moudle'
        self.springLayout_collection = 'SpringLayout'
        self.menu_proj = 'CustomNav_copy'
        self.menu_info = 'CustomNavItem_copy'
        self.fac_spring = "Fac_SpringLayout"
        self.fac_wrap = "Fac_ReportWrap"
        self.fac_proj = "Fac_Project"
        self.tag_db = MongoConnManager.getConfigConn().mdbBb[self.tag_things_collection]
        self.diag_db = MongoConnManager.getConfigConn().mdbBb[g_table_clouddiagnosis]
        self.alarm_db = MongoConnManager.getConfigConn().mdbBb[self.alarm_things_collection]
        self.dash_db = MongoConnManager.getConfigConn().mdbBb[self.springLayout_collection]
        self.menu_proj_db = MongoConnManager.getConfigConn().mdbBb[self.menu_proj]
        self.menu_info_db = MongoConnManager.getConfigConn().mdbBb[self.menu_info]
        self.facSpring_db = MongoConnManager.getConfigConn().mdbBb[self.fac_spring]
        self.report_db = MongoConnManager.getConfigConn().mdbBb[self.fac_wrap]
        self.fac_proj_db = MongoConnManager.getConfigConn().mdbBb[self.fac_proj]
        self.project_id = int(project_id) if project_id else None

    @staticmethod
    def _handle_project_id(point):
        if point and point.get('projId') and not isinstance(point.get('projId'), int):
            point['projId'] = int(point.get('projId'))

    def import_data_to_db(self, data, source_type):
        existed_points_map = self.get_point_map(source_type)
        update_list = []
        insert_list = []
        try:
            for data_item in data:
                if not data_item.get('value'):
                    continue
                PointTable._handle_project_id(data_item)
                data_item['value'] = PointTable._replace_invalid_chars_in_point_name(data_item.get('value'))

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
                    existed_points_map[data_item.get('value')] = data_item
            if update_list:
                self.update_many(update_list)
                logging.info('点表更新:' + str(update_list))
            if insert_list:
                self.db.insert_many(insert_list)
                logging.info('点表新增:' + str(insert_list))
                # David 20171017 导入点表时 跟新tag表
                pointTag.sync_cloud_point_to_thingTree(self.project_id)
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

    @staticmethod
    def _get_real_time_data_flag(item):
        flag = item.get('flag', CloudPointType.MAPPING_POINT)
        if flag is None:
            flag = CloudPointType.MAPPING_POINT
        else:
            flag = int(flag)
        return flag

    # 从实时表里获取云点
    def get_real_time_points(self, search_text=None, point_type_list=None):
        data = RealTimeData(self.project_id).getBufferRTDataListWithFlagByProj()
        data_list = []
        if point_type_list:
            for item in data:
                flag = PointTable._get_real_time_data_flag(item)
                if flag in point_type_list:
                    data_list.append(dict(name=item.get('pointname'), flag=flag, params={}))
        else:
            for item in data:
                flag = PointTable._get_real_time_data_flag(item)
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

    def get_site_count(self, projIdList):
        # 根据projIdList获取现场点的数量
        rt1 = 0
        for i in projIdList:
            site_query = {'projId': int(i), 'type': PointTableSourceType.TYPE_CLOUD, 'params.flag': 0,
                          'groupId': {'$in': ["", None]}}
            rt1 += self.db.count(site_query)
        return rt1

    def get_virtual_count(self, projIdList):
        # 根据projIdList获取现场点的数量
        virtual_query = {'projId': {"$in": projIdList}, 'type': PointTableSourceType.TYPE_CLOUD, 'params.flag': 1,
                         'groupId': {'$in': ["", None]}}
        return self.db.find(virtual_query, projection={'groupId': False, 'type': False}).count()

    def get_calc_count(self, projIdList):
        # 根据projIdList获取现场点的数量
        calc_query = {'projId': {"$in": projIdList}, 'type': PointTableSourceType.TYPE_CLOUD, 'params.flag': 2,
                      'groupId': {'$in': ["", None]}}
        return self.db.find(calc_query, projection={'groupId': False, 'type': False}).count()

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
                     '$or': [{'value': {'$regex': search_regex}}, {'alias': {'$regex': search_regex}},
                             {'params.mapping.point': search_regex}]}
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
        fields = {
            "create_by": 1,
            "alias": 1,
            "modify_by": 1,
            "modify_time": 1,
            "value": 1,
            "note": 1,
            "create_time": 1,
            "projId": 1,
            "param": 1,
            "vote": 1,
            "comments": 1,
            "params": 1
        }
        # fix:云点在dashboard页面加入数据源会导致查询的时候把这样点查询出来.
        query['groupId'] = {'$in': ["", None]}

        if query_order[0][0] == 'vote':
            total = self.db.count(query, projection={'groupId': False, 'type': False})
            if not total:
                return [], 0

            fields['voteLength'] = {"$size": {"$ifNull": ["$vote", []]}}
            mongo_project = {
                '$project': fields
            }
            cursor = self.db.aggregate([{'$match': query}, mongo_project,
                                        {'$skip': start_num}, {'$limit': page_size},
                                        {'$sort': {'voteLength': -1}}])

        elif query_order[0][0] == 'comments':
            total = self.db.count(query, projection={'groupId': False, 'type': False})
            if not total:
                return [], 0
            mongo_project = {'$project': {'commentCount': {'$size': {"$ifNull": ["$comments", []]}}}}
            mongo_project['$project'].update(fields)
            cursor = self.db.aggregate([{'$match': query}, mongo_project,
                                        {'$skip': start_num}, {'$limit': page_size},
                                        {'$sort': {'commentCount': -1}}])

        else:
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
        logging.debug('cloud points search time in mongo ' + str(end_time - begin_time) + '\n' + str(query))
        return result, total

    def get_point_map(self, source_type=None):
        query = {'projId': self.project_id}
        if source_type:
            query['type'] = source_type
            if source_type == PointTableSourceType.TYPE_CLOUD:
                query['params'] = {'$exists': 1}

        cursor = self.db.find(query, projection={'groupId': False, 'type': False})

        return {item.get('value'): item for item in cursor}

    def get_some_points_map(self, source_type, point_list):
        cursor = self.db.find({'projId': self.project_id, 'type': source_type, 'value': {'$in': point_list}},
                              projection={'groupId': False, 'type': False})
        return {item.get('value'): item for item in cursor}

    def get_original_points_map(self, source_type, point_list):
        rt = {}
        cursor = None
        try:
            cursor = self.db.find(
                {'projId': self.project_id, 'type': source_type, 'params.mapping.point': {'$in': point_list}},
                projection={'groupId': False, 'type': False})
            rt = {item.get('params').get('mapping').get('point'): item for item in cursor}
        except Exception:
            pass
        finally:
            if cursor:
                cursor.close()
        return rt

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
            return self.db.find_one(
                {'projId': self.project_id, 'value': re.compile('^' + point_value + '$', re.IGNORECASE),
                 'type': point_type, '_id': {'$ne': ObjectId(point_id)}})
        else:
            return self.db.find_one(
                {'projId': self.project_id, 'value': re.compile('^' + point_value + '$', re.IGNORECASE),
                 'type': point_type})

    @classmethod
    def get_api_name_list(cls):
        rt = []
        try:
            r = requests.get("{}apiTree?lang=zh".format(app.config['EXPERT_CONTAINER_URL']))
            rtList = json.loads(r.text)
            rt = [api.get('name').strip() for api in rtList if api.get('name')]
        except Exception as e:
            logging.error("getApiNameList error: {}".format(e.__str__()))
        return rt

    @classmethod
    def is_conflict(cls, ptName):
        apiList = cls.get_api_name_list()
        if isinstance(ptName, list):
            return list(map(lambda x: True if x in apiList else False, ptName))
        else:
            return True if ptName in apiList else False

    def add_point(self, model):
        if model:
            PointTable._handle_project_id(model)
        result = self.db.insert_one(model)
        if result.inserted_id:
            self.tag_db.insert_one(
                {'_id': ObjectId(result.inserted_id), 'name': model.get('value'), 'prt': '',
                 'type': 'thing', 'keywords': TagThing.split_point_name(model.get('value')),
                 'tag': [], 'attrP': {}, 'projId': self.project_id, 'note': model.get('alias')})
            return result.inserted_id
        else:
            return False

    def _record_version(self, point_id, new_model):
        old_model = self.db.find_one({'_id': ObjectId(point_id)})
        versions = old_model.get('versions')
        if not versions:
            versions = []
        version_model = {}
        for key in self.VERSION_KEYS:
            if old_model.get(key):
                version_model[key] = old_model[key]
        versions.append(version_model)
        new_model['versions'] = versions

    def edit_point(self, point_id, model):
        old_name = self.db.find_one({'_id': ObjectId(point_id)}).get('value')
        PointTable._handle_project_id(model)
        if 'value' in model.keys():
            self.tag_db.update_one({'_id': ObjectId(point_id)}, {'$set': {'name': model.get('value'),
                                                                          'keywords': TagThing.split_point_name(
                                                                              model.get('value'))}}, False)
        if 'alias' in model.keys():
            self.tag_db.update_one({'_id': ObjectId(point_id)}, {'$set': {'note': model.get('alias')}}, False)
        self._record_version(point_id, model)
        if int(model['params']['flag']) == 2:
            PointTable._updateRtBufferCalcPointInfo(
                model.get('projId'), old_name, model.get('value'), model['params']['flag'])
        return self.db.update_one({'_id': ObjectId(point_id)}, {'$set': model})

    @staticmethod
    def _updateRtBufferCalcPointInfo(projId, oldName, newName, flag):
        json_data = {
            'orginName': oldName,
            'projId': projId,
            "newName": newName,
            "flag": flag
        }
        container_url = app.config['EXPERT_CONTAINER_URL']
        try:
            r = requests.post(container_url + "api/renameCalcRealTimeData", json=json_data, timeout=1000)
            rt = json.loads(r.text)
            if not rt.get('state'):
                logging.error("pt_edit_cloud_point error: sync calc realtime data to buffer collection failed")
        except Exception as e:
            logging.error("updateRtBufferCalcPointInfo error: {}".format(str(e)))

    def get_point_by_id(self, point_id):
        return self.db.find_one({'_id': ObjectId(point_id)})

    def get_point_by_name(self, name, pt_type):
        query = {
        }
        if name:
            query.update({'value': name})
        if pt_type:
            query.update({'type': pt_type})
        if not query:
            return None
        return self.db.find_one(query)

    def delete_points(self, pointId_list, point_type):
        # result = self.db.delete_many({'projId': self.project_id, 'value': {'$in': point_list}, 'type': point_type})
        result = self.db.delete_many({'projId': self.project_id, '_id': {'$in': pointId_list}, 'type': point_type})
        if int(point_type) == 4:
            self.tag_db.delete_many({'_id': {'$in': pointId_list}})
        return result.deleted_count

    def delete_all_scene(self):
        result = self.db.delete_many({'projId': self.project_id, 'type': 4, 'params.flag': 0})
        return result.deleted_count

    def delete_all(self, point_type):
        return self.db.delete_many({'projId': self.project_id, 'type': point_type})

    def update_many(self, data_list):
        try:
            for item in data_list:
                item['_id'] = ObjectId(item.get('_id'))
                PointTable._handle_project_id(item)
                self.db.update_one({'_id': item.get('_id')}, {'$set': item}, upsert=True)
                # David 20171017 现场点导入电表，将数据更新到tag表中
                self.tag_db.update_one({'_id': item.get('_id')}, {'$set': {'note': item.get('alias')}})
            return True
        except Exception as e:
            logging.error('point table auto save error' + str(e))
            return False

    def add_many_points(self, points):
        if points:
            for point in points:
                PointTable._handle_project_id(point)
            return self.db.insert_many(points)

    @staticmethod
    def camel_case_split(text):
        return re.compile('[^a-zA-Z0-9\u4e00-\u9fff]+').split(
            re.sub('((?<=[a-z0-9])[A-Z]|(?<=\D)\d|(?!^)[A-Z](?=[a-z])|(?!^)[\u4e00-\u9fff]+)', r'_\1', text))

    def convert_engine_point_to_cloud_point(self, user_id, point_type):
        if str(point_type) == '0':  # 覆盖
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
        elif str(point_type) == '1':  # merge
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

    @staticmethod
    def _replace_invalid_chars_in_point_name(point_name):
        if not point_name:
            return None
        point_name = point_name.strip()
        # if Utils.CLOUD_POINT_NAME_START_WITH_NUM.match(point_name):
        #     point_name = Utils.CLOUD_POINT_NAME_NUMBER_PREFIX + point_name
        # 将不合法字符进行替换
        handled_name = re.sub(Utils.CLOUD_POINT_NAME_NOT_VALID_CHAR, Utils.CLOUD_POINT_NAME_REFILL, point_name)
        # 处理多个不合法字符被转化时候连续出现过多的下划线
        more_pattern = re.compile(Utils.CLOUD_POINT_NAME_REFILL + '{2,}')
        return re.sub(more_pattern, Utils.CLOUD_POINT_NAME_REFILL, handled_name)

    def sync_cloud_points(self, user_id):
        real_time_points, total = self.get_real_time_points(
            point_type_list=[CloudPointType.VIRTUAL_POINT, CloudPointType.MAPPING_POINT])
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
                point_name_cloud = PointTable._replace_invalid_chars_in_point_name(point_name_cloud)
                if not Utils.CLOUD_POINT_NAME_VALID.match(point_name_cloud):
                    if Utils.CLOUD_POINT_NAME_START_WITH_NUM.match(point_name_cloud[0]):
                        # point_name_cloud = Utils.CLOUD_POINT_NAME_NUMBER_PREFIX + point_name_cloud
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
                    'alias': point_name_cloud})
        total = 0

        if cloud_insert:
            insert_obj = self.db.insert_many(cloud_insert)
            total += len(insert_obj.inserted_ids)

        if cloud_update_map:
            for point_name in cloud_update_map:
                point = cloud_update_map.get(point_name)
                update_obj = self.db.update_one({'_id': point.get('_id')}, {'$set': point})
                total += update_obj.modified_count

        # 同步Tag表 David add
        pointTag.sync_cloud_point_to_thingTree(self.project_id)

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

    def up_vote_point(self, user_id, point_ids):
        if isinstance(point_ids, str):
            point_ids = [point_ids]
        self.cancel_vote_point(user_id, point_ids)
        self.cancel_vote_point(user_id, point_ids)
        return self.db.update_many({'_id': {'$in': [Utils.get_object_id(point_id) for point_id in point_ids]}},
                                   {
                                       '$push': {'vote': {
                                           "type": VoteType.UP_VOTE,
                                           "userId": user_id,
                                           "time": datetime.now()
                                       }}
                                   })

    def down_vote_point(self, user_id, point_ids):
        if isinstance(point_ids, str):
            point_ids = [point_ids]
        self.cancel_vote_point(user_id, point_ids)
        return self.db.update_many({'_id': {'$in': [Utils.get_object_id(point_id) for point_id in point_ids]}},
                                   {
                                       '$push': {'vote': {
                                           "type": VoteType.DOWN_VOTE,
                                           "userId": user_id,
                                           "time": datetime.now()
                                       }}
                                   })

    def cancel_vote_point(self, user_id, point_ids):
        if isinstance(point_ids, str):
            point_ids = [point_ids]
        self.db.update_many({'_id': {'$in': [Utils.get_object_id(point_id) for point_id in point_ids]}},
                            {
                                '$pull': {'vote': {
                                    "userId": user_id
                                }}
                            })

    def get_point_comments(self, point_id):
        point = self.get_point_by_id(point_id)
        comments = []
        if not point:
            return comments
        user_map = User().get_all_user_map()
        for comment in point.get('comments', []):
            user = user_map.get(comment.get('userId'))
            comment.update({
                "userName": user.get('userfullname'),
                "userPic": user.get('userpic')
            })
            comments.append(comment)
        return comments

    def add_comments(self, point_id, user_id, content):
        return self.db.update_one({'_id': Utils.get_object_id(point_id)}, {'$push': {
            'comments': {
                '_id': ObjectId(),
                'userId': user_id,
                'content': content,
                'time': datetime.now()
            }
        }})

    def delete_comments(self, point_id, comment_id):
        return self.db.update_one({'_id': Utils.get_object_id(point_id)}, {'$pull': {
            'comments': {
                '_id': Utils.get_object_id(comment_id)
            }
        }})

    def get_versions(self, point_id):
        result = self.db.find_one({'_id': Utils.get_object_id(point_id)})
        user_map = User().get_all_user_map()
        if not result:
            return []
        if not result.get('versions'):
            result['versions'] = []
        # 将最新的加入到版本数组中
        result['versions'].append({key: result.get(key) for key in self.VERSION_KEYS})
        for version in result.get('versions'):
            version['modify_by'] = user_map.get(version.get('modify_by'), {})
        return result.get('versions')

    def get_point_reference(self, projId, pointname):
        rt = {}
        # 计算点
        calcData, calcNum = self.find_calc_point(projId, pointname)
        # 诊断引擎模块
        diagData, diagNum = self.find_diag_point(projId, pointname)
        # 数据报警模块
        alarmData, alarmNum = self.find_point_in_alarm(projId, pointname)
        # dashboard layout
        dashData, dashNum = self.find_point_in_dashboard(projId, pointname)
        # factory report
        facData, facNum = self.find_point_in_fac_report(projId, pointname)
        rt.update(
            {
                'calc': {
                    'data': calcData,
                    'num': calcNum
                },
                'diagnosis': {
                    'data': diagData,
                    'num': diagNum
                },
                'alarm': {
                    'data': alarmData,
                    'num': alarmNum
                },
                'dashboard': {
                    'data': dashData,
                    'num': dashNum
                },
                'factoryReport': {
                    'data': facData,
                    'num': facNum
                }
            }
        )
        return rt

    def find_calc_point(self, projId, pointname):
        rt = []
        cursor = None
        total = 0
        try:
            # 获取所有项目里包含pointname的数据
            cursor = self.db.find(
                {'params.logic': {'$regex': "['\"]%s['\"]" % pointname}, 'params.isDelete': False, 'projId': projId,
                 'params.flag': 2})
            for item in cursor:
                _id = item.get('_id')
                value = item.get('value')
                projId = item.get('projId')
                count = 1
                total += count
                rt.append(
                    {
                        'pointId': str(_id),
                        'count': count,
                        'projId': projId,
                        'pointname': value
                    }
                )
        except Exception as e:
            logging.error('find_calc_point error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt, total

    # get diagnosis module tree name for joining as string
    def getModuleName(self, parentId):
        item = self.diag_db.find_one({'_id': ObjectId(parentId.__str__())})
        while 1:
            yield item.get('moduleName'), str(item.get('_id'))
            if item.get('Parent') != -1:
                item = self.diag_db.find_one({'_id': ObjectId(item.get('Parent').__str__())})
            else:
                return

    def find_diag_point(self, projId, pointname):
        rt = []
        cursor = None
        total = 0
        try:
            # 获取项目诊断引擎里包含pointname的数据
            cursor = self.diag_db.find(
                {'logic': {'$regex': "['\"]%s['\"]" % pointname}, 'isDelete': False, 'projId': projId})
            for item in cursor:
                _id = str(item.get('_id'))
                tempModule, moduleTree, idTree = [], [], []
                parent = item.get('Parent')
                if parent != -1:
                    tree = list(self.getModuleName(parent))
                    for x in tree:
                        moduleTree.append(x[0])
                        idTree.append(x[1])
                    idTree.reverse()
                    moduleTree.reverse()
                moduleName = item.get('moduleName')
                projId = item.get('projId')
                count = 1
                total += count
                rt.append(
                    {
                        'moduleId': "/".join(idTree) + "/" + _id if len(idTree) != 0 else _id,
                        'count': count,
                        'projId': projId,
                        'moduleName': "/".join(moduleTree) + "/" + moduleName if len(moduleTree) != 0 else moduleName
                    }
                )
        except Exception as e:
            logging.error('find_diag_point error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt, total

    def find_point_in_alarm(self, projId, pointname):
        rt = []
        cursor = None
        total = 0
        try:
            # 获取项目alarm里包含pointname的数据
            cursor = self.alarm_db.find(
                {'point': pointname, 'projectId': projId})
            for item in cursor:
                name = item.get('point')
                projectId = item.get('projectId')
                total += 1
                rt.append(
                    {
                        'projId': projectId,
                        'point': name,
                        'createTime': item.get('createtime'),
                        'userId': item.get('user_id')
                    }
                )
        except Exception as e:
            logging.error('find_diag_point error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt, total

    def searchPointId(self, projId, pointname):
        cursor = list(self.db.find({'value': pointname, 'projId': projId}))
        if not cursor:
            cursor = self.db.find({'value': pointname})
        return [str(item.get('_id')) for item in cursor]

    # 获取factory项目ObjectId
    def get_fac_report(self, projId):
        return self.fac_proj_db.find_one({'bindId': int(projId)}).get("_id")

    # 在factory报表中查询点
    def find_point_in_fac_report(self, projId, pointname):
        # get proj pages first
        cursor = self.menu_proj_db.find_one({'projectId': projId})
        pages = cursor.get('list', [])
        pages = list(map(lambda x: ObjectId(x) if isinstance(x, str) else x, pages))
        reportPageInfo = []
        if pages:
            query = {"_id": {"$in": pages}, "type": "FacReportWrapScreen"}
            cursor = self.menu_info_db.find(query)
            for item in cursor:
                reportPageInfo.append((str(item.get('_id')), item.get('text'), item.get('parent')))
        # get reportPages from reportPageInfo
        reportPageList = [item[0] for item in reportPageInfo]
        # search Pages html
        rt = []
        num = 0
        if reportPageList:
            pointList = self.searchPointId(projId, pointname)
            query = {"pageId": {"$in": reportPageList}}
            reportList = list(self.report_db.find(query))
            reportMenu = [(item['pageId'], item['list']) for item in reportList]
            report = []
            for menuItem in reportMenu:
                reportIds = [x.get('reportId') for x in menuItem[-1] if x.get('reportId')]
                reportName = [x.get('reportName') for x in menuItem[-1] if x.get('reportName')]
                reportPageId = list(self.facSpring_db.find({'menuItemId': {"$in": reportIds}}))
                report.append(
                    {'layout': reportPageId, 'reportId': reportIds, 'pageId': menuItem[0], 'reportName': reportName})

            # 整合成report，其中包含report的pageId，以及每个report的name和menuItemId
            for item in report:
                # k为报表的pageId, v为报表页面下的每块报表的具体信息
                reportIds = item.get('reportId')
                pageId = item.get('pageId')
                layout = item.get('layout')
                reportName = item.get('reportName')
                rv, total = self.filterFacReport(reportIds, layout, projId, pointList, pointname, reportName, pageId)
                rt.extend(rv)
                num += total
        return rt, num

    # 过滤掉未出现查询点的报表章节
    def filterFacReport(self, _, springLayout, projId, pointList, pointname, reportName, pageId):
        from urllib import parse
        rt = []
        total = 0
        projName = PointTable._getProjNameCn(projId)
        for index, springLayout in enumerate(springLayout):
            rv_str = str(springLayout)
            num = rv_str.count(pointname)
            for p in pointList:
                num += rv_str.count(p)
            total += num
            if num:
                pageName = self.menu_info_db.find_one({"_id": ObjectId(str(pageId))}).get('text')
                rt.append({
                    'reportName': "{}/{}/{}".format(projName, pageName, reportName[index]),
                    'url': '/observer#page=FacReportWrapScreen&options=' + parse.quote(
                        '{"id":"%s"}' % str(pageId)) + '&container=' + parse.quote(
                        "indexMain") + '&projectId=%d' % (int(projId),)
                })
        return rt, total

    @staticmethod
    def _getContentAndPoints(item, points, js, html):
        if item.get('html'):
            html.append(item.get('html'))
        if item.get('js'):
            js.append(item.get('js'))
        if item.get('points'):
            points.append(item.get('points'))

    def getComplexContent(self, layout, points, js, html):
        if isinstance(layout, dict):
            for k, v in layout.items():
                if isinstance(v, dict):
                    PointTable._getContentAndPoints(v, points, js, html)
                if isinstance(v, list) or isinstance(v, dict):
                    self.getComplexContent(v, points, js, html)
        elif isinstance(layout, list):
            for item in layout:
                if isinstance(item, dict):
                    PointTable._getContentAndPoints(item, points, js, html)
                if isinstance(item, list) or isinstance(item, dict):
                    self.getComplexContent(item, points, js, html)
        else:
            pass

    # 寻找dashboard中的point
    def find_point_in_dashboard(self, projId, pointname):
        pointList = self.searchPointId(projId, pointname)
        query = [{
            "$match": {
                "$or":
                    [
                        {
                            "layout": {
                                "$elemMatch": {
                                    "$elemMatch": {
                                        "modal.points": {"$in": pointList}
                                    }
                                }
                            }
                        },
                        {
                            "layout": {
                                "$elemMatch": {
                                    "$elemMatch": {
                                        '$or': [{"modal.option.html": {"$regex": "|".join(pointList)}},
                                                {"modal.option.html": {"$regex": pointname}}]
                                    }
                                }
                            }
                        }
                    ]
            }},
            {
                "$project": {
                    '_id': 0,
                    'layout': 1,
                    'menuItemId': 1
                }
            }
        ]
        if not pointList:
            springLayout = []
        else:
            springLayout = list(self.dash_db.aggregate(query))
            fac_springLayout = list(self.facSpring_db.aggregate(query))
            springLayout.extend(fac_springLayout)
        return self.filterDash(springLayout, projId, pointList, pointname)

    def getMenuInfo(self, menuItemId, L, menuDict):
        cursor = None
        try:
            cursor = self.menu_info_db.find_one({'_id': ObjectId(menuItemId.__str__())})
        except:
            pass
        if cursor:
            parent = cursor.get('parent')
            text = cursor.get('text')
            menuType = cursor.get('type')
            menuDict.update({menuItemId: menuType})
            L.append(text)
            if parent:
                return self.getMenuInfo(parent, L, menuDict)
            return L, parent or menuItemId, menuDict
        else:
            return None, None, None

    @staticmethod
    def _getProjNameCn(projId):
        return BEOPDataAccess.getInstance().findProjectInfoItemById(projId).get('name_cn')

    def filterDash(self, springLayout, projId, pointList, pointname):
        rt = []
        total = 0
        projName = PointTable._getProjNameCn(projId)
        for item in springLayout:
            menuId = item.get('menuItemId')
            temp, tempDict = [], {}
            menu_content, indexId, menuTypeDict = self.getMenuInfo(menuId, temp, tempDict)
            if menu_content and indexId:
                if menuId not in [x.get('menuItemId') for x in rt]:
                    menuType = menuTypeDict[menuId]
                    menu_content.reverse()
                    menuInfo = "/".join(menu_content)
                    rv = self.searchProjIdWithMenuId(projId, indexId)
                    layout = item.get('layout')
                    for lay in layout:
                        pos = {}
                        if rv:
                            for index, modals in enumerate(lay):
                                modal = modals.get('modal', {})
                                option = modal.get('option', {})
                                numId = sum(option.get('html').count(pointId) for pointId in pointList) if option.get(
                                    'html') else 0
                                numName = option.get('html').count(pointname) if option.get('html') else 0
                                numPoints = sum(
                                    modal.get('points').count(pointId) for pointId in pointList) if modal.get(
                                    'points') else 0
                                if numId or numName:
                                    pos.update({'modal%d_html' % (index + 1): numId + numName})
                                    total = total + numId + numName
                                if numPoints:
                                    pos.update({'modal%d_points' % (index + 1): numPoints})
                                    total = total + numPoints
                        if pos:
                            if menuType != 'DropDownList':
                                rt.append(
                                    {
                                        'menuType': menuType,
                                        'menuItemId': menuId,
                                        'menuInfo': "%s/%s" % (projName, menuInfo),
                                        'pos': pos,
                                        'pointname': pointname
                                    }
                                )
        return rt, total

    def searchProjIdWithMenuId(self, projId, menuId):
        projs = []
        try:
            projs = [p.get('projectId') for p in self.menu_proj_db.find({'list': ObjectId(menuId.__str__())})]
        except:
            pass
        if projId not in projs:
            return False
        else:
            return True

    def findSubString(self, apiPosList, parentString, sonString, pos=0):
        p = parentString.find(sonString, pos)
        if p != -1:
            apiPosList.append(p + 1)
            return self.findSubString(apiPosList, parentString, sonString, p + len(sonString))
        else:
            return apiPosList
