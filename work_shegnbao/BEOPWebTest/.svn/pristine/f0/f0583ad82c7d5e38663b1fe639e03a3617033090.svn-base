from bson import ObjectId
import logging
from beopWeb.MongoConnManager import MongoConnManager
from beopWeb.BEOPMongoDataAccess import *
from beopWeb.BEOPDataAccess import *
from datetime import timedelta, datetime
import requests

class diagnosisEngine:

    @classmethod
    def update_diagengine_thing(cls, data):
        rt = None
        try:
            if '_id' in data.keys():
                if ObjectId.is_valid(data.get('_id')):
                    data.update({'_id':ObjectId(data.get('_id'))})
                else:
                    rt = "'_id' is error"
                    raise Exception("'_id' is error")
            else:
                data.update({'_id':ObjectId()})
            for key in data:
                value = data.get(key)
                if key == 'projId':
                    value = int(value)
                elif key == 'dictVariable':
                    if not isinstance(value, dict):
                        rt = "'dictVariable' must be a dict"
                        raise Exception("'dictVariable' is error")
                elif key == 'dictAlgorithm':
                    if not isinstance(value, dict):
                        rt = "'dictAlgorithm' must be a dict"
                elif key == 'equipmentId':
                    value = int(value)
                data.update({key:value})
            dbrv = MongoConnManager.getConfigConn().mdbBb[g_table_diagengine_thing].update({'_id':data.get('_id')}, {'$set':data}, True)
            if dbrv.get('ok'):
                rt = data.get('_id').__str__()
        except Exception as e:
            print('update_diagengine_thing error:' + e.__str__())
            logging.error('update_diagengine_thing error:' + e.__str__())
        return rt

    @classmethod
    def update_dictVariable_in_diagEngine_thing(cls, thingId, dictVariable):
        rt = False
        try:
            if ObjectId.is_valid(thingId):
                confdata = MongoConnManager.getConfigConn().mdbBb[g_table_diagengine_thing].find_one({'_id':ObjectId(thingId)})
                if isinstance(confdata, dict):
                    confdata.get('dictVariable', {}).update(dictVariable)
                    dbrv = MongoConnManager.getConfigConn().mdbBb[g_table_diagengine_thing].update({'_id':ObjectId(thingId)}, {'$set':confdata})
                    if dbrv.get('ok'):
                        rt = True
        except Exception as e:
            print('update_dictVariable_in_diagEngine_thing error:' + e.__str__())
            logging.error('update_dictVariable_in_diagEngine_thing error:' + e.__str__())
        return rt

    @classmethod
    def set_diagengine_thing_into_equipment(cls, name, pageId, projId):
        rt = None
        try:
            dbAccess = BEOPDataAccess.getInstance()
            dbname = dbAccess.getProjMysqldb(projId)
            if dbname:
                strSQL = 'INSERT INTO %s_diagnosis_equipments (`NAME`, PageId, ZoneId, SystemId, SubSystemId, Project, ' \
                         'ModalTextId) VALUES ("%s", "%s", 0, 0, 0, %d, 0)'%(dbname, name, pageId, int(projId))
                equipmentId = dbAccess._mysqlDBContainer.op_db_update_with_id('diagnosis', strSQL, ())
                if equipmentId > 0:
                    rt = equipmentId
        except Exception as e:
            print('set_diagengine_thing_into_equipment error:' + e.__str__())
            logging.error('set_diagengine_thing_into_equipment error:' + e.__str__())
        return rt

    @classmethod
    def remove_diagengine_thing(cls, IdList):
        rt = False
        try:
            MongoConnManager.getConfigConn().mdbBb[g_table_diagengine_thing].delete_many({'_id':{'$in':[ObjectId(i) for i in IdList if ObjectId.is_valid(i)]}})
            rt = True
        except Exception as e:
            print('remove_diagengine_thing error:' + e.__str__())
            logging.error('remove_diagengine_thing error:' + e.__str__())
        return rt

    @classmethod
    def get_diagengine_thing(cls, projId):
        rt = []
        cursor = None
        try:
            cursor = MongoConnManager.getConfigConn().mdbBb[g_table_diagengine_thing].find({'projId':int(projId)})
            for item in cursor:
                try:
                    rt.append({'_id':item.get('_id').__str__(), 'name':item.get('name'), 'type':item.get('type'),
                               'srcPageId':item.get('srcPageId'), 'dictVariable':item.get('dictVariable'),
                               'dictAlgorithm':item.get('dictAlgorithm'), 'projId':item.get('projId')})
                except Exception as e:
                    print('get_diagengine_thing dataerror:')
                    print(item)
        except Exception as e:
            print('get_diagengine_thing error:' + e.__str__())
            logging.error('get_diagengine_thing error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def update_diagengine_template(cls, data):
        rt = None
        try:
            if '_id' in data.keys():
                if ObjectId.is_valid(data.get('_id')):
                    data.update({'_id':ObjectId(data.get('_id'))})
                else:
                    rt = "'_id' is error"
                    raise Exception("'_id' is error")
            else:
                data.update({'_id':ObjectId()})
            for key in data:
                value = data.get()
                if key == 'creatorId':
                    value = int(value)
                elif key == 'timeLastModify':
                    value = datetime.now()
                elif key == 'dictVariable':
                    if not isinstance(value, dict):
                        rt =  "'dictVariable' is error"
                        raise Exception("'dictVariable' is error")
                elif key == 'dictAlgorithm':
                    if not isinstance(value, dict):
                        rt =  "'dictAlgorithm' is error"
                        raise Exception("'dictAlgorithm' is error")
                data.update({key:value})
            dbrv = MongoConnManager.getConfigConn().mdbBb[g_table_diagengine_template].update({'_id':data.get('_id')}, {'$set':data}, True)
            if dbrv.get('ok'):
                rt = data.get('_id').__str__()
        except Exception as e:
            print('update_diagengine_template error:' + e.__str__())
            logging.error('update_diagengine_template error:' + e.__str__())
        return rt

    @classmethod
    def remove_diagengine_template(cls, IdList):
        rt = False
        try:
            MongoConnManager.getConfigConn().mdbBb[g_table_diagengine_template].delete_many({'_id':{'$in':[ObjectId(i) for i in IdList if ObjectId.is_valid(i)]}})
            rt = True
        except Exception as e:
            print('remove_diagengine_template error:' + e.__str__())
            logging.error('remove_diagengine_template error:' + e.__str__())
        return rt


    @classmethod
    def get_diagengine_template(cls):
        rt = []
        cursor = None
        try:
            cursor = MongoConnManager.getConfigConn().mdbBb[g_table_diagengine_template].find({})
            for item in cursor:
                try:
                    rt.append({'_id':item.get('_id').__str__(), 'name':item.get('name'), 'type':item.get('type'),
                               'srcPageId':item.get('srcPageId'), 'dictVariable':item.get('dictVariable'),
                               'dictAlgorithm':item.get('dictAlgorithm'), 'creatorId':item.get('creatorId'),
                               'timeLastModify':item.get('timeLastModify').strftime('%Y-%m-%d %H:%M:%S') if isinstance(item.get('timeLastModify'), datetime) else None})
                except Exception as e:
                    pass
        except Exception as e:
            print('get_diagengine_template error:' + e.__str__())
            logging.error('get_diagengine_template error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def update_diagengine_Algorithm(cls, data):
        rt = None
        try:
            data.update({'_id':ObjectId(data.get('_id')) if ObjectId.is_valid(data.get('_id')) else ObjectId(),
                         'creatorId':int(data.get('creatorId', -1)), 'timeLastModify':datetime.now(),
                         'status':int(data.get('status', 1))})
            dbrv = MongoConnManager.getConfigConn().mdbBb[g_table_diagengine_template].update({'_id':data.get('_id')}, {'$set':data}, True)
            if dbrv.get('ok'):
                rt = data.get('_id').__str__()
        except Exception as e:
            print('save_diagengine_Algorithm error:' + e.__str__())
            logging.error('save_diagengine_Algorithm error:' + e.__str__())
        return rt

    @classmethod
    def remove_diagengine_Algorithm(cls, IdList):
        rt = None
        try:
            dbrv = MongoConnManager.getConfigConn().mdbBb[g_table_diagengine_template].update({'_id':{'$in':[ObjectId(x) for x in IdList if ObjectId.is_valid(x)]}}, {'$set':{'status':0}}, False)
            if dbrv.get('ok'):
                rt = True
        except Exception as e:
            print('remove_diagengine_Algorithm error:' + e.__str__())
            logging.error('remove_diagengine_Algorithm error:' + e.__str__())
        return rt

    @classmethod
    def get_diagengine_Algorithm_by_IdList(cls, IdList):
        rt = []
        cursor = None
        try:
            cursor = MongoConnManager.getConfigConn().mdbBb[g_table_diagengine_template].find({'_id':{'$in':[ObjectId(x) for x in IdList if ObjectId.is_valid(x)]},
                                                     'status':1})
            for item in cursor:
                try:
                    rt.append({'_id':item.get('_id').__str__(), 'creatorId':item.get('creatorId'),
                               'timeLastModify':item.get('timeLastModify').strftime('%Y-%m-%d %H:%M:%S') if isinstance(item.get('timeLastModify'), datetime) else None,
                               'content':item.get('content'), 'src':item.get('src', '') if len(item.get('src', '')) != 0 else item.get('content'),
                               'status':item.get('status')})
                except Exception as e:
                    pass
        except Exception as e:
            print('get_diagengine_Algorithm_by_IdList error:' + e.__str__())
            logging.error('get_diagengine_Algorithm_by_IdList error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def switch_algorithm_status_of_thing(cls, thingId, algorithmId, status, data):
        rt = None
        try:
            if ObjectId.is_valid(thingId):
                dbrv = MongoConnManager.getConfigConn().mdbBb[g_table_diagengine_thing].update({'_id':ObjectId(thingId)}, {'$set':{'dictAlgorithm':{algorithmId.__str__():int(status)}}})
                if dbrv.get('ok'):
                    if isinstance(data, dict):
                        if 'templateId' in data.keys() and 'dictVariable' in data.keys():
                            data = json.dumps(data)
                            headers = {'content-type': 'application/json'}
                            res = requests.post('/diagnosisEngine/switchAlgorithmStatusOfThing/' + str(thingId) + '/' + str(algorithmId) + '/' + str(status),
                                               headers = headers, data = data)
                            rt = json.load(res.text)
        except Exception as e:
            print('switch_algorithm_status_of_thing error:' + e.__str__())
            logging.error('switch_algorithm_status_of_thing error:' + e.__str__())
        return rt

    @classmethod
    def get_notice_occurrence_statistics(cls, thingId, startTime, endTime, format):
        rt = []
        try:
            if ObjectId.is_valid(thingId):
                startTime = datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%d %H:%M:%S')
                endTime = datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%d %H:%M:%S')
                dbrv = MongoConnManager.getConfigConn().mdbBb[g_table_diagengine_thing].find_one({'_id':ObjectId(thingId)})
                projId = dbrv.get('projId')
                equipmentId = dbrv.get('equipmentId')
                dbAccess = BEOPDataAccess.getInstance()
                dbname = dbAccess.getProjMysqldb(projId)
                if dbname:
                    strSQL = 'SELECT Id, Time FROM %s_diagnosis_notices WHERE Time <= "%s" ' \
                             'AND Time >= "%s" AND `Status` = 1 AND FaultId IN ' \
                             '(SELECT Id FROM %s_diagnosis_faults WHERE EquipmentId = %d) ' \
                             'ORDER BY Time'%(dbname, endTime, startTime, dbname, int(equipmentId))
                    res = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
                    rt = cls.get_occurrence_statistics_baseon_format(startTime, endTime, format, res)
        except Exception as e:
            print('get_notice_occurrence_statistics error:' + e.__str__())
            logging.error('get_notice_occurrence_statistics error:' + e.__str__())
        return rt

    @classmethod
    def get_occurrence_statistics_baseon_format(cls, startTime, endTime, format, data):
        rt = []
        rv = {}
        try:
            startObj = datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S').replace(minute = 0, second = 0, microsecond = 0)
            endObj = datetime.strptime(endTime, '%Y-%m-%d %H:%M:%S').replace(minute = 0, second = 0, microsecond = 0)
            if startObj < datetime.strptime(endTime, '%Y-%m-%d %H:%M:%S'):
                startObj.replace(hour = endObj.hour + 1)
            interval = timedelta(minutes = 60)
            if isinstance(format, str):
                if format.lower() == 'h1':
                    interval = timedelta(minutes = 60)
                elif format.lower() == 'm5':
                    interval = timedelta(minutes = 5)
                elif format.lower() == 'm1':
                    interval = timedelta(minutes = 1)
                ptime = startObj
                while ptime <= endObj:
                    rv.update({ptime.strftime('%Y-%m-%d %H:%M:%S'):[]})
                    for item in data:
                        if datetime.strptime(item[1], '%Y-%m-%d %H:%M:%S') >= ptime and datetime.strptime(item[1], '%Y-%m-%d %H:%M:%S') < ptime + interval:
                            rv.get(ptime.strftime('%Y-%m-%d %H:%M:%S')).append(item[0])
                    rt.append(len(rv.get(ptime.strftime('%Y-%m-%d %H:%M:%S'))))
                    ptime = ptime + interval
        except Exception as e:
            print('get_timeList_baseon_format error:' + e.__str__())
            logging.error('get_timeList_baseon_format error:' + e.__str__())
        return rt