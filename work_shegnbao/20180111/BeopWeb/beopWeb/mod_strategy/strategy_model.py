"""策略组态 数据处理层"""
import logging
from datetime import datetime
from beopWeb.MongoConnManager import MongoConnManager
from bson.objectid import ObjectId
import time
import re

#define table names
TABLE_STRATEGY_ITEM = 'Strategy_Item'
TABLE_STRATEGY_MODULE = 'Strategy_Module'
TABLE_STRATEGY_TEMPALTE = 'Strategy_Template'
TABLE_STRATEGY_TEMPLATE_MODULE = 'Strategy_Template_Module'
TABLE_STRATEGY_LOG = 'Strategy_Log'
TABLE_STRATEGY_PROJECT_CONFIG = 'Strategy_ProjectConfig'

class StrategyModel:
    ''' 策略组态 数据处理类 '''

    @classmethod
    def detect(cls, value, inverse):
        ''' 检测 '''
        if inverse:
            return ObjectId.is_valid(value)
        else:
            return isinstance(value, ObjectId)

    @classmethod
    def object_id_to_str(cls, item, inverse=False):
        ''' object id 转换成 str '''

        ignore_list = ['nodeId']

        if item is None:
            return
        func = str if inverse is False else ObjectId

        if isinstance(item, list):
            for key, value in enumerate(item):
                if cls.detect(value, inverse):
                    item[key] = func(value)
                else:
                    cls.object_id_to_str(value, inverse)
        elif isinstance(item, dict):
            for key, value in item.items():
                if key in ignore_list:
                    continue
                if cls.detect(value, inverse):
                    item.update({key: func(value)})
                else:
                    cls.object_id_to_str(value, inverse)


    @classmethod
    def log(cls, user_id, op_type, data):
        ''' 写入日志 '''
        result = None
        try:
            result = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_LOG].insert_one({
                'userId': user_id,
                'type': op_type.value,
                'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'data': str(data)
            })
            if not result.inserted_id is None:
                result = result.inserted_id
        except Exception as expt:
            print('strategy log error:' + expt.__str__())
            logging.error('strategy log error:' + expt.__str__())
            return None
        return result

    @classmethod
    def get_items_by_node_id(cls, node_id):
        ''' 根据 node id 获取策略列表 '''
        result = None
        cursor = None
        query = {}

        if ObjectId.is_valid(node_id):
            query['nodeId'] = ObjectId(node_id)
        else:
            query['nodeId'] = ''

        try:
            cursor = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_ITEM]\
                        .find(query)
            result = list(cursor)
            cls.object_id_to_str(result)
        except Exception as expt:
            print('get_items_by_node_id error:' + expt.__str__())
            logging.error('get_items_by_node_id error:' + expt.__str__())
            return None
        finally:
            if not cursor is None:
                cursor.close()
        return result

    @classmethod
    def get_items_by_node_ids(cls, node_ids):
        ''' 根据 node ids 获取策略列表 '''
        result = None
        cursor = None

        try:
            cursor = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_ITEM]\
                        .find({'nodeId': {'$in': node_ids}})
            result = list(cursor)
            cls.object_id_to_str(result)
        except Exception as expt:
            print('get_items_by_node_ids error:' + expt.__str__())
            logging.error('get_items_by_node_ids error:' + expt.__str__())
            return None
        finally:
            if not cursor is None:
                cursor.close()
        return result

    @classmethod
    def get_item_by_id(cls, item_id):
        ''' 根据策略 id 获取策略信息 '''
        result = None
        modules = None
        item_obj_id = ObjectId(item_id)
        cursor = None
        try:
            conn = MongoConnManager.getConfigConn()
            result = conn.mdbBb[TABLE_STRATEGY_ITEM]\
                        .find_one({'_id': item_obj_id})

            if result is None:
                return None

            cursor = conn.mdbBb[TABLE_STRATEGY_MODULE]\
                        .find({'strategyId': item_obj_id})
            modules = list(cursor)

            cls.object_id_to_str(result)
            cls.object_id_to_str(modules)
        except Exception as expt:
            print('get_item_by_id error:' + expt.__str__())
            logging.error('get_item_by_id error:' + expt.__str__())
            return None
        finally:
            if not cursor is None:
                cursor.close()
        return {'strategy': result, 'modules': modules}

    @classmethod
    def get_full_items_by_ids(cls, item_ids):
        ''' 根据策略 id 数组获取完整的策略信息（包括模块数据） '''
        result = None
        cursor = None
        ob_item_ids = [ObjectId(x) for x in item_ids]
        try:
            conn = MongoConnManager.getConfigConn()
            result = conn.mdbBb[TABLE_STRATEGY_ITEM]\
                        .find({'_id': {'$in': ob_item_ids}})

            if result is None:
                return None

            result = list(result)
            cls.object_id_to_str(result)
            result_map = {}
            for strategy in result:
                result_map[strategy['_id']] = strategy

            modules_group = cls.get_modules_by_strategy_ids(item_ids)
            for group in modules_group:
                strategy = result_map[group['_id']]
                if strategy:
                    strategy['modules'] = group['items']

        except Exception as expt:
            print('get_item_by_id error:' + expt.__str__())
            logging.error('get_item_by_id error:' + expt.__str__())
            return None
        finally:
            if not cursor is None:
                cursor.close()
        return result

    @classmethod
    def get_modules_by_ids(cls, module_ids):
        ''' 根据 id 数组返回查找到的模块列表 '''
        result = None
        cursor = None
        try:
            cursor = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_MODULE]\
                        .find({'_id': {'$in': [ObjectId(x) for x in module_ids]}})
            result = list(cursor)
            cls.object_id_to_str(result)
        except Exception as expt:
            print('get_modules_by_ids error:' + expt.__str__())
            logging.error('get_modules_by_ids error:' + expt.__str__())
            return None
        finally:
            if not cursor is None:
                cursor.close()
        return result

    @classmethod
    def get_modules_by_strategy_ids(cls, strategy_ids):
        ''' 根据策略 id 数组返回查找到的模块列表 '''
        result = None
        cursor = None
        try:
            cursor = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_MODULE]\
                        .aggregate([
                            {'$match': {'strategyId': {'$in':[ObjectId(x) for x in strategy_ids]}}},
                            {'$group': {'_id': '$strategyId', 'items': {'$push': '$$ROOT'}}}
                        ])
            result = list(cursor)
            cls.object_id_to_str(result)
        except Exception as expt:
            print('get_modules_by_strategy_ids error:' + expt.__str__())
            logging.error('get_modules_by_strategy_ids error:' + expt.__str__())
            return None
        finally:
            if not cursor is None:
                cursor.close()
        return result

    @classmethod
    def get_templates_by_group(cls, group_id):
        ''' 获取某个组的模板列表 '''
        result = None
        cursor = None
        query = {}

        if ObjectId.is_valid(group_id):
            query['group'] = ObjectId(group_id)
        else:
            query['group'] = ''
        try:
            cursor = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_TEMPALTE]\
                        .find(query)
            result = list(cursor)
            cls.object_id_to_str(result)
        except Exception as expt:
            print('get_templates_by_group error:' + expt.__str__())
            logging.error('get_templates_by_group error:' + expt.__str__())
            return None
        finally:
            if not cursor is None:
                cursor.close()
        return result

    @classmethod
    def get_templates_by_key(cls, key):
        ''' 获取包含关键字的模板列表 '''
        result = None
        cursor = None
        rexExp = re.compile('.*'+key+'.*', re.IGNORECASE)
        query = {'name':rexExp,'isGroup':0}
        try:
            cursor = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_TEMPALTE]\
                        .find(query)
            result = list(cursor)
            cls.object_id_to_str(result)
        except Exception as expt:
            print('get_templates_by_group error:' + expt.__str__())
            logging.error('get_templates_by_group error:' + expt.__str__())
            return None
        finally:
            if not cursor is None:
                cursor.close()
        return result

    @classmethod
    def get_template_by_id(cls, tpl_id):
        ''' 根据模板 id 获取模板信息 '''
        result = None
        modules = None
        cursor = None
        tpl_obj_id = ObjectId(tpl_id)
        try:
            conn = MongoConnManager.getConfigConn()
            result = conn.mdbBb[TABLE_STRATEGY_TEMPALTE]\
                        .find_one({'_id': tpl_obj_id})
            cls.object_id_to_str(result)

            if result is None:
                return None

            cursor = conn.mdbBb[TABLE_STRATEGY_TEMPLATE_MODULE]\
                        .find({'strategyId': tpl_obj_id})

            modules = list(cursor)
            cls.object_id_to_str(modules)
        except Exception as expt:
            print('get_item_by_id error:' + expt.__str__())
            logging.error('get_item_by_id error:' + expt.__str__())
            return None
        finally:
            if not cursor is None:
                cursor.close()
        return {'strategy': result, 'modules': modules}

    @classmethod
    def get_template_children_by_group(cls, groups):
        ''' 根据group id 获取所有子文件'''
        try:
            conn = MongoConnManager.getConfigConn()
            result = []
            result.extend(groups)
            for _id in groups:
                cursor = conn.mdbBb[TABLE_STRATEGY_TEMPALTE]\
                        .find({'group': ObjectId(_id)})
                resultOther = list(cursor)
                cls.object_id_to_str(resultOther)
                childrenIds = []
                for child in resultOther:
                    if child.get('isTransformedFromFiles') == 1:
                        return [None]
                    childrenIds.append(child.get('_id'))
                result.extend(cls.get_template_children_by_group(childrenIds))
        except Exception as expt:
            print('get_template_children_by_group error:' + expt.__str__())
            logging.error('get_template_children_by_group error:' + expt.__str__())
            return None
        return result

    @classmethod
    def remove_template_by_ids(cls, ids):
        ''' 根据模板 id 删除模板 '''
        result = []
        ids = cls.get_template_children_by_group(ids)
        if None in ids:
            return [None, 'TransformedFromFiles']
        temp_ids = set(ids)
        ids = [i for i in temp_ids]
        try:
            conn = MongoConnManager.getConfigConn()
            for strategyId in ids:
                tpl_obj_id = ObjectId(strategyId)
                resultItem = conn.mdbBb[TABLE_STRATEGY_TEMPALTE]\
                            .remove({'_id': tpl_obj_id})
                result.append(resultItem)
                conn.mdbBb[TABLE_STRATEGY_TEMPLATE_MODULE].remove({
                    'strategyId': tpl_obj_id
                })
        except Exception as expt:
            print('remove_template_by_ids error:' + expt.__str__())
            logging.error('remove_template_by_ids error:' + expt.__str__())
            return [None, 'Error']
        return result
        
    @classmethod
    def rename_template_by_id(cls, _id, name):
        ''' 根据模板 id 重命名模板 '''
        result = None
        tpl_obj_id = ObjectId(_id)
        try:
            conn = MongoConnManager.getConfigConn()
            result = conn.mdbBb[TABLE_STRATEGY_TEMPALTE]\
                            .update({"_id":tpl_obj_id},{'$set':{"name":name}})  
        except Exception as expt:
            print('rename_template_by_id error:' + expt.__str__())
            logging.error('rename_template_by_id error:' + expt.__str__())
            return None
        return result

    @classmethod
    def change_template_group(cls, group, ids):
        ''' 改变模板的group '''
        result = []
        if group != '':
            group = ObjectId(group)

        try:
            conn = MongoConnManager.getConfigConn()
            for _id in ids:
                tpl_obj_id = ObjectId(_id)
                resultItem = conn.mdbBb[TABLE_STRATEGY_TEMPALTE]\
                                .update({"_id":tpl_obj_id},{'$set':{"group":group}})  
                result.append(resultItem)
        except Exception as expt:
            print('rename_template_by_id error:' + expt.__str__())
            logging.error('rename_template_by_id error:' + expt.__str__())
            return None
        return result

    @classmethod
    def add_template_group(cls, name,group,userId):
        ''' 新增模板的group '''
        result = None
        if group != '':
            group = ObjectId(group)
        lastTime = time.strftime( '%Y-%m-%d %X', time.localtime() )
        try:
            objId = ObjectId()
            conn = MongoConnManager.getConfigConn()
            conn.mdbBb[TABLE_STRATEGY_TEMPALTE].insert_one({
                                            '_id': objId,
                                            'group': group,
                                            'name': name,
                                            'userId': userId,
                                            'lastTime': lastTime,
                                            'isGroup': 1,
                                            'isTransformedFromFiles': 0
                                        })
            result = conn.mdbBb[TABLE_STRATEGY_TEMPALTE].find_one({
                                            '_id': objId,
                                        })
            cls.object_id_to_str(result)
            if result is None:
                return None
        except Exception as expt:
            print('rename_template_by_id error:' + expt.__str__())
            logging.error('rename_template_by_id error:' + expt.__str__())
            return None
        return result

    @classmethod
    def add_items(cls, data):
        ''' 新增策略数据 '''
        result = None

        if not isinstance(data, list):
            data = [data]

        try:
            cls.object_id_to_str(data, True)
            result = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_ITEM]\
                        .insert_many(data)
            result = [str(x) for x in result.inserted_ids]
            result = result[0] if len(result) == 0 else result
        except Exception as expt:
            print('add_item error:' + expt.__str__())
            logging.error('add_item error:' + expt.__str__())
            return None
        return result

    @classmethod
    def update_items_by_ids(cls, ids, data):
        ''' 更新策略数据 '''
        result = None
        if not isinstance(ids, list):
            ids = [ids]

        try:
            cls.object_id_to_str(data, True)
            result = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_ITEM]\
                        .update_many({'_id': {'$in': [ObjectId(x) for x in ids]}},\
                         {'$set': data}, True)
            if result.modified_count > 0:
                result = result.modified_count
            elif not result.upserted_id is None:
                result = str(result.upserted_id)
            else:
                result = 'no_items_modified'
        except Exception as expt:
            print('update_items_by_ids error:' + expt.__str__())
            logging.error('update_items_by_ids error:' + expt.__str__())
            return None
        return result

    @classmethod
    def del_items_by_ids(cls, ids):
        ''' 删除策略数据 '''
        result = None
        if not isinstance(ids, list):
            ids = [ids]

        try:
            result = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_ITEM]\
                        .delete_many({'_id': {'$in': [ObjectId(x) for x in ids]}})
            if result.deleted_count > 0:
                result = result.deleted_count
            else:
                result = 'no_items_deleted'
        except Exception as expt:
            print('del_items_by_ids error:' + expt.__str__())
            logging.error('del_items_by_ids error:' + expt.__str__())
            return None
        return result

    @classmethod
    def add_modules(cls, data):
        ''' 批量新增模块数据 '''
        result = None

        if not isinstance(data, list):
            data = [data]

        try:
            cls.object_id_to_str(data, True)
            result = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_MODULE]\
                        .insert_many(data)
            result = [str(x) for x in result.inserted_ids]
            result = result[0] if len(result) == 0 else result
        except Exception as expt:
            print('add_modules error:' + expt.__str__())
            logging.error('add_modules error:' + expt.__str__())
            return None
        return result

    @classmethod
    def update_module_by_id(cls, module_id, data):
        ''' 根据 id 修改策略的模块数据 '''
        result = None
        try:
            cls.object_id_to_str(data, True)
            result = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_MODULE]\
                        .update_one({'_id': ObjectId(module_id)}, {'$set': data}, True)
            if result.modified_count > 0:
                result = result.modified_count
            elif not result.upserted_id is None:
                result = str(result.upserted_id)
            else:
                result = 'no_items_modified'
        except Exception as expt:
            print('update_module_by_id error:' + expt.__str__())
            logging.error('update_module_by_id error:' + expt.__str__())
            return None
        return result

    @classmethod
    def del_modules_by_ids(cls, ids):
        ''' 删除策略的模块数据 '''
        result = None
        if not isinstance(ids, list):
            ids = [ids]

        try:
            result = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_MODULE]\
                        .delete_many({'_id': {'$in': [ObjectId(x) for x in ids]}})
            if result.deleted_count > 0:
                result = result.deleted_count
            else:
                result = 'no_items_deleted'
        except Exception as expt:
            print('del_modules_by_ids error:' + expt.__str__())
            logging.error('del_modules_by_ids error:' + expt.__str__())
            return None
        return result

    @classmethod
    def doSomething(cls, src_node_id, dest_node_id):
        ''' 自定义测试接口 '''
        result = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_ITEM]\
                    .update_many({'nodeId': src_node_id}, {'$set': {'nodeId': dest_node_id}})
        if result.modified_count > 0:
            return True
        else:
            return False

    @classmethod
    def save_proj_config(cls, proj_id, data):
        ''' 保存项目配置信息 '''
        try:
            result = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_PROJECT_CONFIG]\
                .update_one({'projId': proj_id}, {'$set': {'config': data}}, True)
            if result.modified_count > 0:
                result = result.modified_count
            elif not result.upserted_id is None:
                result = str(result.upserted_id)
            else:
                result = 'no_items_modified'
        except Exception as expt:
            print('save_proj_config error:' + expt.__str__())
            logging.error('save_proj_config error:' + expt.__str__())
            return None
        return result

    @classmethod
    def get_proj_config(cls, proj_id):
        ''' 获取项目配置信息 '''
        try:
            result = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_PROJECT_CONFIG]\
                .find_one({'projId': proj_id})
            if result is None:
                MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_PROJECT_CONFIG].insert_one({
                    'projId': proj_id,
                    'config': {
                        "timeBetweenFDDCycles": 300,
                        "timeBetweenDataCycles": 300,
                        "EnableSensorCheck": 1,
                        "RunCommand": 1,
                        "Language": "zh",
                        "WarningRatio": 0.6,
                        "RelativeId": 0,
                        "SensorSequenceNum": 12,
                        "DeadSequenceNum": 60,
                        "server_tz": "Asia/Shanghai",
                        "proj_tz": "Asia/Shanghai",
                        "FaultCheckNum": 6
                    }
                })
                result = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_PROJECT_CONFIG]\
                .find_one({'projId': proj_id})
            if result:
                result.pop('_id')
        except Exception as expt:
            print('get_proj_config error:' + expt.__str__())
            logging.error('get_proj_config error:' + expt.__str__())
            result = None
        return result

    @classmethod
    def export_strategy_template(cls, data):
        group = data.get('group')
        name = data.get('name')
        userId = data.get('userId')
        modules = data.get('modules',[])
        lastTime = time.strftime( '%Y-%m-%d %X', time.localtime() )
        result = True
        if len(modules)==0:
            return False
        try:
            strategyId = ObjectId(modules[0]['strategyId'])
            cls.remove_template_by_ids([strategyId])
            MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_TEMPALTE].insert_one({
                '_id': strategyId,
                'group': ObjectId(group),
                'name': name,
                'userId': userId,
                'lastTime': lastTime,
                'isGroup': 0,
                'isTransformedFromFiles': 0
            })
            for module in modules:
                moduleId = module.get('_id')
                info=dict(module, **{
                    '_id': ObjectId(moduleId),
                    'isTransformedFromFiles': 0,
                    'strategyId': ObjectId(strategyId)
                })
                MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_TEMPLATE_MODULE].insert_one(info)
            
        except Exception as expt:
            result = False
            print('strategy log error:' + expt.__str__())
            logging.error('strategy log error:' + expt.__str__())
            return None
        return result

