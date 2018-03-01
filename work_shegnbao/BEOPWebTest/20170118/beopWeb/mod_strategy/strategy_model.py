"""策略组态 数据处理层"""

import logging
from datetime import datetime
from beopWeb.MongoConnManager import MongoConnManager
from bson.objectid import ObjectId
from bson.code import Code

#define table names
TABLE_STRATEGY_ITEM = 'Strategy_Item'
TABLE_STRATEGY_MODULE = 'Strategy_Module'
TABLE_STRATEGY_TEMPALTE = 'Strategy_Template'
TABLE_STRATEGY_TEMPLATE_MODULE = 'Strategy_Template_Module'
TABLE_STRATEGY_LOG = 'Strategy_Log'

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
                'data': data
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
                result = None
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
                result = None
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
                result = None
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
                result = None
        except Exception as expt:
            print('del_modules_by_ids error:' + expt.__str__())
            logging.error('del_modules_by_ids error:' + expt.__str__())
            return None
        return result

    @classmethod
    def doSomething(cls, src_node_id, dest_node_id):
        result = MongoConnManager.getConfigConn().mdbBb[TABLE_STRATEGY_ITEM]\
                    .update_many({'nodeId': src_node_id}, {'$set': {'nodeId': dest_node_id}})
        if result.modified_count > 0:
            return True
        else:
            return False
