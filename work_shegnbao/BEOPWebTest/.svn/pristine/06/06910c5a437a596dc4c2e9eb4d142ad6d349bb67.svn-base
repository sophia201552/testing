__author__ = 'yan'

from beopWeb.BEOPMongoDataAccess import *
from beopWeb.MongoConnManager import MongoConnManager
from bson import ObjectId
from datetime import datetime
import logging


class ProcessAction:
    action_not_pass = 0
    action_pass = 1
    action_terminate = 2


class Process:
    _mongo_collection_template = MongoConnManager.getConfigConn().mdbBb[g_table_workflow_template]
    _mongo_collection_process = MongoConnManager.getConfigConn().mdbBb[g_table_workflow_process]

    @classmethod
    def workflowProcessUpdate(cls, data):
        insert_data = {}
        rt = 'Failed'
        try:
            if ObjectId.is_valid(data.get('_id')):
                data.update({'_id': ObjectId(data.get('_id'))})
            else:
                data.update({'_id': ObjectId()})
            for key in data:
                value = data.get(key)
                if key == 'template_id':
                    if ObjectId.is_valid(value):
                        value = ObjectId(value)
                if key == 'createTime':
                    if isinstance(value, str):
                        value = datetime.strptime(value, '%Y-%m-%d %H:%M:%S')
                insert_data.update({key: value})
            dbrv = Process._mongo_collection_process.update({'_id': insert_data.get('_id')}, {'$set': insert_data},
                                                            True)
            if dbrv.get('ok'):
                rt = dbrv.get('upserted').__str__()
        except Exception as e:
            print('workflowProcessUpdate failed:' + e.__str__())
            logging.error('workflowProcessUpdate failed:' + e.__str__())
        return rt

    @classmethod
    def workflowProcessRemove(cls, processId):
        rt = False
        try:
            if ObjectId.is_valid(processId):
                dbrv = Process._mongo_collection_process.delete_one({'_id': ObjectId(processId)})
            else:
                raise Exception('data formatting error')
            if dbrv.raw_result.get('ok') == 1:
                rt = True
        except Exception as e:
            print('workflowProcessRemove failed:' + e.__str__())
            logging.error('workflowProcessRemove failed:' + e.__str__())
        return rt

    @classmethod
    def workflowProcessGetById(cls, processId):
        rt = {}
        try:
            if ObjectId.is_valid(processId):
                dbrv = Process._mongo_collection_process.find_one({'_id': ObjectId(processId)})
            else:
                raise Exception('data formatting error')
            dbrv.update({'_id': dbrv.get('_id').__str__(), 'template_id': dbrv.get('template_id').__str__(),
                         'createTime': dbrv.get('crreatTime').strftime('%Y-%m-%d %H:%M:%S') if dbrv.get(
                             'creatTime') is not None else None})
            rt.update(dbrv)
        except Exception as e:
            print('workflowProcessGetById error:' + e.__str__())
            logging.error('workflowProcessGetById error:' + e.__str__())
        return rt

    @classmethod
    def workflowProcessGetAll(cls):
        rt = []
        cursor = None
        try:
            cursor = Process._mongo_collection_process.find({}).sort([('_id', pymongo.ASCENDING)])
            for item in cursor:
                item.update({'_id': item.get('_id').__str__(), 'template_id': item.get('template_id').__str__(),
                             'createTime': item.get('crreatTime').strftime('%Y-%m-%d %H:%M:%S') if item.get(
                                 'creatTime') is not None else None})
                rt.append(item)
        except Exception as e:
            print('workflowProcessGetAll failed:' + e.__str__())
            logging.error('workflowProcessGetAll failed:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def workflowProcessGetTemplate(cls, processId):
        rt = {}
        try:
            if ObjectId.is_valid(processId):
                res = Process._mongo_collection_process.find_one({'_id': ObjectId(processId)})
            else:
                raise Exception('data formatting error')
            if res.get('template_id'):
                tid = res.get('template_id')
                if ObjectId.is_valid(tid):
                    rt = Process._mongo_collection_template.find_one({'_id': ObjectId(tid)})
                else:
                    raise Exception('mongodb data error')
                rt.update({'_id': rt.get('_id').__str__()})
        except Exception as e:
            print('workflowProcessGetTemplate error:' + e.__str__())
            logging.error('workflowProcessGetTemplate error:' + e.__str__())
        return rt

    @classmethod
    def workflowProcessBindTemplate(cls, processId, templateId):
        rt = 'Failed'
        try:
            if ObjectId.is_valid(templateId):
                templateId = ObjectId(templateId)
                if ObjectId.is_valid(processId):
                    dbrv = Process._mongo_collection_process.update({'_id': ObjectId(processId)},
                                                                    {'$set': {'template_id': ObjectId(templateId)}},
                                                                    True)
                    if dbrv.get('ok'):
                        rt = dbrv.get('upserted').__str__()
        except Exception as e:
            print('workflowProcessBindTemplate error:' + e.__str__())
            logging.error('workflowProcessBindTemplate error:' + e.__str__())
        return rt

    @classmethod
    def workflowProcessChangeTemplate(cls, processId, templateId):
        rt = 'Failed'
        try:
            if ObjectId.is_valid(templateId):
                templateId = ObjectId(templateId)
                if ObjectId.is_valid(processId):
                    dbrv = Process._mongo_collection_process.update({'_id': ObjectId(processId)},
                                                                    {'$set': {'template_id': ObjectId(templateId)}},
                                                                    True)
                    if dbrv.get('ok'):
                        rt = dbrv.get('upserted').__str__()
        except Exception as e:
            print('workflowProcessChangeTemplate error:' + e.__str__())
            logging.error('workflowProcessChangeTemplate error:' + e.__str__())
        return rt
