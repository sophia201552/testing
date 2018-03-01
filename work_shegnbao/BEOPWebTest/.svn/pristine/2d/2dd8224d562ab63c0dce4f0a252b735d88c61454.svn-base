__author__ = 'yan'
from beopWeb.MongoConnManager import MongoConnManager
from beopWeb.BEOPMongoDataAccess import *
from datetime import timedelta, datetime
import logging

class Patrol(object):
    _collection_path = MongoConnManager.getConfigConn().mdbBb[g_table_patrol_path]
    _collection_point = MongoConnManager.getConfigConn().mdbBb[g_table_patrol_point]
    _collection_executor = MongoConnManager.getConfigConn().mdbBb[g_table_patrol_executor]
    _collection_mission = MongoConnManager.getConfigConn().mdbBb[g_table_patrol_mission]
    _collection_missionlog = MongoConnManager.getConfigConn().mdbBb[g_table_patrol_missionlog]

    @classmethod
    def savePath(cls, projId, data):
        pathId = ''
        try:
            if ObjectId.is_valid(data.get('_id')):
                data.update({'_id':ObjectId(data.get('_id')), 'updateTime':datetime.now(), 'projId':int(projId)})
            else:
                data.update({'_id':ObjectId(), 'updateTime':datetime.now(), 'projId':int(projId)})
            for key in data:
                value = data.get(key)
                if key == 'elapse' or key == 'status' or key == 'projId':
                    if not isinstance(value, int):
                        value = int(value)
                elif key == 'userId':
                    value = ObjectId(value)
                elif key == 'path':
                    if not isinstance(value, list):
                        value = [value]
                data.update({key:value})
            dbrv = Patrol._collection_path.update({'_id':data.get('_id')}, {'$set':data}, True)
            if dbrv.get('ok'):
                pathId = data.get('_id').__str__()
        except Exception as e:
            print('Patrol.savePath failed:'+e.__str__())
            logging.error('Patrol.savePath failed:'+e.__str__())
        return pathId

    @classmethod
    def removePath(cls, projId, pathId):
        rt = False
        try:
            if ObjectId.is_valid(pathId):
                dbrv = Patrol._collection_path.delete_one({'_id':ObjectId(pathId), 'projId':int(projId)})
                if dbrv.raw_result.get('ok') == 1:
                    rt = True
        except Exception as e:
            print('Patrol.removePath failed:'+e.__str__())
            logging.error('Patrol.removePath failed:'+e.__str__())
        return rt

    @classmethod
    def savePoint(cls, projId, data):
        pointId = ''
        try:
            if ObjectId.is_valid(data.get('_id')):
                data.update({'_id':ObjectId(data.get('_id')), 'updateTime':datetime.now(), 'lastTime':datetime.now(),
                             'projId':int(projId)})
            else:
                data.update({'_id':ObjectId(), 'updateTime':datetime.now(), 'projId':int(projId)})
            for key in data:
                value = data.get(key)
                if key == 'type' or key == 'projId':
                    if not isinstance(value, int):
                        value = int(value)
                elif key == 'userId':
                    value = ObjectId(value)
                data.update({key:value})
            dbrv = Patrol._collection_point.update({'_id':data.get('_id')}, {'$set':data}, True)
            if dbrv.get('ok'):
                pointId = data.get('_id').__str__()
        except Exception as e:
            print('Patrol.savePoint failed:'+e.__str__())
            logging.error('Patrol.savePoint failed:'+e.__str__())
        return pointId

    @classmethod
    def removePoint(cls, projId, pointId):
        rt = False
        try:
            if ObjectId.is_valid(pointId):
                dbrv = Patrol._collection_point.delete_one({'_id':ObjectId(pointId), 'projId':int(projId)})
                if dbrv.raw_result.get('ok') == 1:
                    rt = True
        except Exception as e:
            print('Patrol.removePoint failed:'+e.__str__())
            logging.error('Patrol.removePoint failed:'+e.__str__())
        return rt

    @classmethod
    def saveExecutor(cls, projId, data):
        executorId = ''
        try:
            if ObjectId.is_valid(data.get('_id')):
                data.update({'_id':ObjectId(data.get('_id')), 'projId':int(projId)})
            else:
                data.update({'_id':ObjectId(), 'projId':int(projId)})
            for key in data:
                value = data.get(key)
                if key == 'sex' or key == 'status' or key == 'projId':
                    if not isinstance(value, int):
                        value = int(value)
                elif key.endswith('Time'):
                    value = datetime.strptime(value, '%Y-%m-%d %H:%M:%S')
                data.update({key:value})
            dbrv = Patrol._collection_executor.update({'_id':data.get('_id')}, {'$set':data}, True)
            if dbrv.get('ok'):
                executorId = data.get('_id').__str__()
        except Exception as e:
            print('Patrol.saveExecutor failed:'+e.__str__())
            logging.error('Patrol.saveExecutor failed:'+e.__str__())
        return executorId

    @classmethod
    def removeExecutor(cls, projId, executorId):
        rt = False
        try:
            if ObjectId.is_valid(executorId):
                dbrv = Patrol._collection_executor.delete_one({'_id':ObjectId(executorId), 'projId':int(projId)})
                if dbrv.raw_result.get('ok') == 1:
                    rt = True
        except Exception as e:
            print('Patrol.removeExecutor failed:'+e.__str__())
            logging.error('Patrol.removeExecutor failed:'+e.__str__())
        return rt

    @classmethod
    def get_patrol_point_list(cls, projId):
        rt = []
        cursor_1 = None
        cursor_2 = None
        try:
            if not isinstance(projId, int):
                projId = int(projId)
            cursor_1 = Patrol._collection_point.find({'projId':projId})
            for item in cursor_1:
                cursor_2 = Patrol._collection_path.find({'path':item.get('_id').__str__(), 'projId':projId, 'status':1})
                item.update({'arrPaths':[]})
                for i in cursor_2:
                    item.get('arrPaths').append({'_id':i.get('_id').__str__(), 'name':i.get('name')})
                rt.append({'_id':item.get('_id').__str__(), 'name':item.get('name'), 'codeQR':item.get('codeQR'),
                           'type':item.get('type'), 'content':item.get('content'),
                           'lastTime':item.get('lastTime').strftime('%Y-%m-%d %H:%M:%S') if item.get('lastTime') is not None else '',
                           'arrPaths':item.get('arrPaths')})
        except Exception as e:
            print('get_patrol_point_list error:' + e.__str__())
            logging.error('get_patrol_point_list error:' + e.__str__())
        finally:
            if cursor_1:
                cursor_1.close()
            if cursor_2:
                cursor_2.close()
        return rt

    @classmethod
    def get_patrol_path_by_pointId(cls, projId, pointId):
        rt = []
        cursor_1 = None
        cursor_2 = None
        try:
            if not isinstance(projId, int):
               projId = int(projId)
            if ObjectId.is_valid(pointId):
                pointId = pointId.__str__()
            cursor_1 = Patrol._collection_path.find({'projId':projId, 'path':pointId, 'status':1})
            for item in cursor_1:
                cursor_2 = Patrol._collection_point.find({'_id':{'$in':[ObjectId(x) for x in item.get('path')]}})
                path = []
                for i in cursor_2:
                    path.append({'_id':i.get('_id').__str__(), 'name':i.get('name')})
                rt.append({'_id':item.get('_id').__str__(), 'name':item.get('name'), 'elapse':item.get('elapse'),
                           'status':item.get('status'), 'path':path})
        except Exception as e:
            print('get_patrol_path_by_pointid error:' + e.__str__())
            logging.error('get_patrol_path_by_pointid error:' + e.__str__())
        finally:
            if cursor_1:
                cursor_1.close()
            if cursor_2:
                cursor_2.close()
        return rt

    @classmethod
    def get_patrol_path_by_projId(cls, projId):
        rt = []
        cursor_1 = None
        cursor_2 = None
        try:
            if not  isinstance(projId, int):
                projId = int(projId)
            cursor_1 = Patrol._collection_path.find({'projId':projId})
            for item in cursor_1:
                cursor_2 = Patrol._collection_point.find({'_id':{'$in':[ObjectId(x) for x in item.get('path')]}})
                path = []
                for i in cursor_2:
                    path.append({'_id':i.get('_id').__str__(), 'name':i.get('name')})
                rt.append({'_id':item.get('_id').__str__(), 'name':item.get('name'), 'elapse':item.get('elapse'),
                           'status':item.get('status'), 'path':path})
        except Exception as e:
            print('get_patrol_path_by_projId error:' + e.__str__())
            logging.error('get_patrol_path_by_projId error:' + e.__str__())
        finally:
            if cursor_1:
                cursor_1.close()
            if cursor_2:
                cursor_2.close()
        return rt

    @classmethod
    def get_patrol_executor_list_by_projId(cls, projId):
        rt = []
        cursor = None
        try:
            if not isinstance(projId, int):
                projId = int(projId)
            cursor = Patrol._collection_executor.find({'projId':projId})
            for item in cursor:
                rt.append({'_id':item.get('_id').__str__(), 'code':item.get('code'), 'name':item.get('name'),
                           'sex':item.get('sex'), 'department':item.get('department'), 'status':item.get('status'),
                           'projId':item.get('projId')})
        except Exception as e:
            print('get_patrol_executor_by_projId error:' + e.__str__())
            logging.error('get_patrol_executor_by_projId error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def get_patrol_mission_list_by_projId(cls, projId):
        rt = []
        cursor = None
        try:
            if not isinstance(projId, int):
                projId = int(projId)
            cursor = Patrol._collection_mission.find({'projId':projId})
            for item in cursor:
                rt.append({'_id':item.get('_id').__str__(), 'projId':item.get('projId'),
                           'startTime':item.get('startTime').strftime('%Y-%m-%d %H:%M:%S'), 'interval':item.get('interval'),
                           'option':item.get('option')})
        except Exception as e:
            print('get_patrol_mission_list_by_projId error:' + e.__str__())
            logging.error('get_patrol_mission_list_by_projId error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def save_patrol_mission(cls, projId, data):
        rt = ''
        try:
            if ObjectId.is_valid(data.get('_id')):
                data.update({'_id':ObjectId(data.get('_id')), 'projId':int(projId)})
            else:
                data.update({'_id':ObjectId(), 'projId':int(projId)})
            for key in data:
                value = data.get(key)
                if key == 'interval' or key == 'projId':
                    value = int(value)
                elif key == 'startTime':
                    value = datetime.strptime(value, '%Y-%m-%d')
                data.update({key:value})
            dbrv = Patrol._collection_mission.update({'_id':data.get('_id')}, {'$set':data}, True)
            if dbrv.get('ok'):
                rt = data.get('_id')
        except Exception as e:
            print('save_patrol_mission error:' + e.__str__())
            logging.error('save_patrol_mission error:' + e.__str__())
        return rt

    @classmethod
    def save_patrol_missionlog(cls, data):
        rt = ''
        try:
            if ObjectId.is_valid(data.get('_id')):
                data.update({'_id':ObjectId(data.get('_id'))})
            else:
                data.update({'_id':ObjectId()})
            for key in data:
                value = data.get(key)
                if key == 'executorId' or key == 'pathId':
                    value = ObjectId(value)
                elif key == 'startTime' or key == 'endTime':
                    value = datetime.strptime(value, '%Y-%m-%d %H:%M:%S')
                elif key == 'state' or key == 'projId':
                    value = int(value)
                data.update({key:value})
                dbrv = Patrol._collection_missionlog.update({'_id':data.get('_id')}, {'$set':data}, True)
                if dbrv.get('ok'):
                    rt = data.get('_id').__str__()
        except Exception as e:
            print('save_patrol_missionlog error:' + e.__str__())
            logging.error('save_patrol_missionlog error:' + e.__str__())
        return rt

    @classmethod
    def calculate_the_percentage_from_list(cls, list):
        rt = ''
        try:
            a = list.count(1)
            b = len(list)
            rt = "%.2f%%"%(a/b*100)
        except Exception as e:
            print('calculate_the_percentage error:' + e.__str__())
            logging.error('calculate_the_percentage error:' + e.__str__())
        return rt

    @classmethod
    def get_patrol_report_baseon_man(cls, projId, startTime, endTime):
        rt = {'time':[], 'data':[]}
        cursor_1 = None
        cursor_2 = None
        try:
            projId = int(projId)
            startTime = datetime.strptime(startTime, '%Y-%m-%d').replace(day=1)
            endTime = datetime.strptime(endTime, '%Y-%m-%d').replace(month=startTime.month + 1, day=1)
            if endTime >= datetime.now():
                endTime = datetime(datetime.now().year, datetime.now().month, datetime.now().day)
            userdict ={}
            cursor_1 = Patrol._collection_executor.find({'projId':projId, 'status':1})
            for item in cursor_1:
                userdict.update({item.get('_id').__str__():{'name':item.get('name'), 'count':[], 'state':[]}})
            cursor_1 = Patrol._collection_mission.find({'projId':projId})
            list_1 = list(cursor_1)
            ptime = startTime
            while ptime <= endTime:
                rt.get('time').append(ptime.strftime('%Y-%m-%d'))
                for item in list_1:
                    if item.get('startTime') <= ptime:
                        c = ptime - item.get('startTime')
                        if c.days % item.get('interval') == 0:
                            option = item.get('option')
                            for pathid in option:
                                pathinfo = option.get(pathid)
                                for plantime in pathinfo:
                                    executorlist = pathinfo.get(plantime)
                                    for executorId in executorlist:
                                        if executorId in userdict:
                                            userdict.get(executorId).get('count').append(ptime.strftime('%Y-%m-%d'))
                cursor_2 = Patrol._collection_missionlog.find({'projId':projId, 'startTime':{'$gte':ptime, '$lt':ptime + timedelta(days = 1)}})
                list_2 = list(cursor_2)
                statecount = []
                for i in list_2:
                    if i.get('state') == 1:
                        statecount.append(i.get('executorId').__str__())
                for userId in userdict:
                    if userdict.get(userId).get('count').count(ptime.strftime('%Y-%m-%d')) == statecount.count(userId) and userdict.get(userId).get('count').count(ptime.strftime('%Y-%m-%d')) != 0:
                        userdict.get(userId).get('state').append(1)
                    elif userdict.get(userId).get('count').count(ptime.strftime('%Y-%m-%d')) != statecount.count(userId) and userdict.get(userId).get('count').count(ptime.strftime('%Y-%m-%d')) != 0:
                        userdict.get(userId).get('state').append(0)
                    else:
                        userdict.get(userId).get('state').append(None)
                ptime = ptime + timedelta(days = 1)
            for userId in userdict:
                rt.get('data').append({'userId':userId, 'name':userdict.get(userId).get('name'),
                                       'data':userdict.get(userId).get('state'),
                                       'percent':Patrol.calculate_the_percentage_from_list(userdict.get(userId).get('state'))})
        except Exception as e:
            print('get_patrol_mission_count_by_man error:' + e.__str__())
            logging.error('get_patrol_mission_count_by_man error:' + e.__str__())
        finally:
            if cursor_1:
                cursor_1.close()
            if cursor_2:
                cursor_2.close()
        return rt

    @classmethod
    def get_patrol_report_baseon_path(cls, projId, startTime, endTime):
        rt = {'time':[], 'data':[]}
        cursor_1 = None
        cursor_2 = None
        try:
            projId = int(projId)
            startTime = datetime.strptime(startTime, '%Y-%m-%d').replace(day=1)
            endTime = datetime.strptime(endTime, '%Y-%m-%d').replace(month=startTime.month + 1, day=1)
            if endTime >= datetime.now():
                endTime = datetime(datetime.now().year, datetime.now().month, datetime.now().day)
            pathdict = {}
            cursor_1 = Patrol._collection_path.find({'projId':projId, 'status':1})
            for item in cursor_1:
                pathdict.update({item.get('_id').__str__():{'name':item.get('name'), 'count':[], 'state':[]}})
            cursor_1 = Patrol._collection_mission.find({'projId':projId})
            list_1 = list(cursor_1)
            ptime = startTime
            while ptime <= endTime:
                rt.get('time').append(ptime.strftime('%Y-%m-%d'))
                for item in list_1:
                    if item.get('startTime') <= ptime:
                        c = ptime - item.get('startTime')
                        if c.days % item.get('interval') == 0:
                            option = item.get('option')
                            for pathId in option:
                                for n in option.get(pathId):
                                    pathdict.get(pathId).get('count').append(ptime.strftime('%Y-%m-%d'))
                cursor_2 = Patrol._collection_missionlog.find({'projId':projId, 'startTime':{'$gte':ptime, '$lt':ptime + timedelta(days = 1)}})
                statecount = []
                for i in cursor_2:
                    if i.get('state') == 1:
                        statecount.append(i.get('pathId').__str__())
                for pathId in pathdict:
                    if pathdict.get(pathId).get('count').count(ptime.strftime('%Y-%m-%d')) == statecount.count(pathId) and pathdict.get(pathId).get('count').count(ptime.strftime('%Y-%m-%d')) != 0:
                        pathdict.get(pathId).get('state').append(1)
                    elif pathdict.get(pathId).get('count').count(ptime.strftime('%Y-%m-%d')) != statecount.count(pathId) and pathdict.get(pathId).get('count').count(ptime.strftime('%Y-%m-%d')) != 0:
                        pathdict.get(pathId).get('state').append(0)
                    else:
                        pathdict.get(pathId).get('state').append(None)
                ptime = ptime + timedelta(days = 1)
            for pathId in pathdict:
                rt.get('data').append({'pathId':pathId, 'name':pathdict.get(pathId).get('name'),
                                       'data':pathdict.get(pathId).get('state')})
        except Exception as e:
            print('get_patrol_report_baseon_path error:' + e.__str__())
            logging.error('get_patrol_report_baseon_path error:' + e.__str__())
        finally:
            if cursor_1:
                cursor_1.close()
            if cursor_2:
                cursor_2.close()
        return rt

    @classmethod
    def get_patrol_report_baseon_path_new(cls, projId, startTime, endTime):
        data = {
            'time':[],
            'data':[{'pathId':'','name':'', 'data':''}]
        }
        rt = {'time':[], 'data':[]}
        cursor = None
        try:
            startTime = datetime.strptime(startTime, '%Y-%m-%d')
            endTime = datetime.strptime(endTime, '%Y-%m-%d')
            if endTime >= datetime.now():
                endTime = datetime.strptime(datetime.now().strftime('%Y-%m-%d'), '%Y-%m-%d')
            cursor = Patrol._collection_path.find({'projId':int(projId), 'status':1})
            path_dict = {}
            for path in cursor:
                path_dict.update({path.get('_id').__str__():{'name':path.get('name'), 'path':path.get('path')}})
            if cursor:
                cursor.close()
            mission_dict = Patrol._collection_mission.find_one({'projId':int(projId), 'startTime':{'$lte':endTime}})
        except Exception as e:
            print('get_patrol_report_baseon_path_new error:' + e.__str__())
            logging.error('get_patrol_report_baseon_path_new error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def get_patrol_log_by_pathId(cls, projId, pathId, startTime, endTime):
        rt = []
        cursor = None
        try:
            projId = int(projId)
            startTime = datetime.strptime(startTime, '%Y-%m-%d')
            endTime = datetime.strptime(endTime, '%Y-%m-%d')
            if endTime >= datetime.now():
                endTime = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)
            if not ObjectId.is_valid(pathId):
                raise Exception('pathId error')
            pathdate = Patrol._collection_path.find_one({'_id':ObjectId(pathId), 'status':1, 'projId':projId})
            pathlist = []
            for pointid in pathdate.get('path'):
                pointdata = Patrol._collection_point.find_one({'_id':ObjectId(pointid)})
                pathlist.append(pointdata.get('name'))
            pathdate.update({'path':pathlist})
            if pathdate is None or len(pathdate) == 0:
                raise Exception('No valid path info')
            cursor = Patrol._collection_mission.find({'projId':projId})
            list_1 = list(cursor)
            ptime = startTime.replace(hour=0, minute=0, second=0)
            while ptime < endTime:
                for item in list_1:
                    if pathdate.get('_id').__str__() in item.get('option'):
                        if item.get('startTime') <= ptime:
                            c = ptime - item.get('startTime')
                            if c.days % item.get('interval') == 0:
                                for ep in item.get('option').get(pathdate.get('_id').__str__()):
                                    rt.append({'path':{pathdate.get('_id').__str__():pathdate.get('name')},
                                               #'exector':Patrol.get_patrol_executorName_by_idlist(item.get('option').get(pathdate.get('_id').__str__()).get(ep)),
                                               'startTime':ptime, 'planTime':ep, 'data':[{'point':p, 'time':None, 'error':None,
                                                                                          'msg':None, 'arrPic':None} for p in pathdate.get('path')]})
                ptime = ptime + timedelta(days = 1)
            if cursor:
                cursor.close()
            cursor = Patrol._collection_missionlog.find({'projId':projId, 'pathId':pathdate.get('_id'),
                                                           'startTime':{'$gte':startTime, '$lt':endTime}})
            list_1 = list(cursor)
            for x in rt:
                for i in list_1:
                    if i.get('startTime') >= x.get('startTime') and i.get('startTime') <= x.get('startTime') + timedelta(days =1):
                        if i.get('planTime') == x.get('planTime'):
                            for pp in x.get('data'):
                                for path in i.get('path'):
                                    if path.get('name') == pp.get('point'):
                                        pp.update({'point':path.get('name'), 'time':path.get('time'), 'error':path.get('error'), 'msg':path.get('msg'),
                                                   'arrPic':path.get('arrPic')})
                            x.update({'startTime':i.get('startTime'), 'endTime':i.get('endTime').strftime('%Y-%m-%d %H:%M:%S'),
                                      'executor':Patrol.get_patrol_executorName_by_idlist([i.get('executorId')])})
                if not isinstance(x.get('startTime'), str):
                    x.update({'startTime':x.get('startTime').strftime('%Y-%m-%d %H:%M:%S')})
                if x.get('endTime') == None:
                    x.update({'endTime':None})
        except Exception as e:
            print('get_patrol_log_by_pathId error:' + e.__str__())
            logging.error('get_patrol_log_by_pathId error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def  get_patrol_executorName_by_idlist(cls, idlist):
        rt = {}
        cursor = None
        try:
            cursor = Patrol._collection_executor.find({'_id':{'$in':[ObjectId(i) for i in idlist if ObjectId.is_valid(i)]}})
            for item in cursor:
                rt.update({item.get('_id').__str__():item.get('name')})
        except Exception as e:
            print('get_patrol_executorName_by_idlist error:' + e.__str__())
            logging.error('get_patrol_executorName_by_idlist error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def get_patrol_path_by_pathid(cls, pathid):
        rt = {}
        cursor = None
        try:
            if not ObjectId.is_valid(pathid):
                raise Exception('pathid error')
            path = Patrol._collection_path.find_one({'_id':ObjectId(pathid)})
            if path:
                cursor = Patrol._collection_point.find({'_id':{'$in':[ObjectId(i) for i in path.get('path') if ObjectId.is_valid(i)]}})
                point = []
                for item in cursor:
                    point.append((item.get('_id').__str__(),item.get('name')))
                path.update({'path':point})
                rt.update(path)
        except Exception as e:
            print('get_patrol_path_by_pathid error:' + e.__str__())
            logging.error('get_patrol_path_by_pathid error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def get_patrol_log_by_executorId(cls, projId, executorId, startTime, endTime):
        rt = []
        cursor = None
        try:
            projId = int(projId)
            startTime = datetime.strptime(startTime, '%Y-%m-%d')
            endTime = datetime.strptime(endTime, '%Y-%m-%d')
            if endTime >= datetime.now():
                endTime = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)
            if not ObjectId.is_valid(executorId):
                raise Exception('executorId error')
            executordata = Patrol._collection_executor.find_one({'_id':ObjectId(executorId), 'status':1, 'projId':projId})
            if executordata is None or len(executordata) == 0:
                raise Exception('No valid executor info')
            cursor = Patrol._collection_mission.find({'projId':projId})
            list_1 = list(cursor)
            ptime = startTime.replace(hour=0, minute=0, second=0)
            while ptime < endTime:
                for item in list_1:
                    if item.get('startTime') <= ptime:
                        c = ptime - item.get('startTime')
                        if c.days % item.get('interval') == 0:
                            option = item.get('option')
                            for pathid in option:
                                pathdata = Patrol.get_patrol_path_by_pathid(pathid)
                                for plantime in option.get(pathid):
                                    if executordata.get('_id').__str__() in option.get(pathid).get(plantime):
                                        rt.append({'path':{pathdata.get('_id').__str__():pathdata.get('name')},
                                                   'executor':{executordata.get('_id').__str__():executordata.get('name')},
                                                   'startTime':ptime,
                                                   'planTime':plantime, 'data':[{'point':p[1], 'time':None, 'error':None,
                                                                                 'msg':None, 'arrPic':None} for p in pathdata.get('path')]})
                ptime = ptime + timedelta(days=1)
            if cursor:
                cursor.close()
            if len(rt) > 0:
                cursor = Patrol._collection_missionlog.find({'projId':projId, 'executorId':executordata.get('_id'),
                                                         'startTime':{'$gte':startTime, '$lt':endTime}})
                list_1 = list(cursor)
                for x in rt:
                    for i in list_1:
                        if i.get('startTime') >= x.get('startTime') and i.get('startTime') <= x.get('startTime') + timedelta(days =1):
                            if i.get('planTime') == x.get('planTime'):
                                for pp in x.get('data'):
                                    for path in i.get('path'):
                                        if path.get('name') == pp.get('point'):
                                            pp.update({'point':path.get('name'), 'time':path.get('time'), 'error':path.get('error'),
                                                       'msg':path.get('msg'), 'arrPic':path.get('arrPic')})
                                x.update({'startTime':i.get('startTime'), 'endTime':i.get('endTime').strftime('%Y-%m-%d %H:%M:%S')})
                    if not isinstance(x.get('startTime'), str):
                        x.update({'startTime':x.get('startTime').strftime('%Y-%m-%d %H:%M:%S')})
                    if x.get('endTime') == None:
                        x.update({'endTime':None})
        except Exception as e:
            print('get_patrol_log_by_executorId error:' + e.__str__())
            logging.error('get_patrol_log_by_executorId error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt