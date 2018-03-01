__author__ = 'yan'
from beopWeb.MongoConnManager import MongoConnManager
from beopWeb.BEOPMongoDataAccess import *
from datetime import timedelta, datetime

import logging, copy

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
            #missionlog_list = cls.get_missionlog_list_by_pathId(projId, data.get('_id'))
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
                elif key == 'timeRange':
                    time_list = value.split(' ')
                    time_up = int(time_list[1])
                    time_down = int(time_list[0])
                    #data.update({'time_up':time_up, 'time_down':time_down})
                data.update({key:value})
            if 'timeRange' in data.keys():
                del data['timeRange']
                data.update({'time_up':time_up, 'time_down':time_down})
            dbrv = Patrol._collection_path.update({'_id':data.get('_id')}, {'$set':data}, True)
            if dbrv.get('ok'):
                pathId = data.get('_id').__str__()
        except Exception as e:
            print('Patrol.savePath failed:'+e.__str__())
            logging.error('Patrol.savePath failed:'+e.__str__())
        return pathId

    @classmethod
    def get_missionlog_list_by_pathId(cls, projId, pathId):
        rt = []
        cursor = None
        try:
            cursor = cls._collection_missionlog.find({'pathId':ObjectId(pathId), 'projId':int(projId)})
            for item in cursor:
                rt.append(item)
        except Exception as e:
            print('get_missionlog_list_by_pathId error:' + e.__str__())
            logging.error('get_missionlog_list_by_pathId error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def removePath(cls, projId, pathId):
        rt = False
        # missionId = []
        try:
            # missionId = cls.get_patrol_mission_by_path(projId, pathId)
            # if len(missionId)==0:
            if ObjectId.is_valid(pathId):
                # data.update({'_id':ObjectId(pathId)})
                dbrv = Patrol._collection_path.update({'_id':ObjectId(pathId), 'projId':int(projId)}, {'$set':{'status':0}}, True)
                if dbrv.get('ok'):
                    rt = True
        except Exception as e:
            print('Patrol.savePath failed:'+e.__str__())
            logging.error('Patrol.savePath failed:'+e.__str__())
        return rt

    @classmethod
    def savePoint(cls, projId, data):
        pointId = ''
        try:
            if ObjectId.is_valid(data.get('_id')):
                data.update({'_id':ObjectId(data.get('_id')), 'updateTime':datetime.now(),
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
            # data.update({'_id':ObjectId(pointId)})
            if ObjectId.is_valid(pointId):
                dbrv = Patrol._collection_point.update({'_id':ObjectId(pointId), 'projId':int(projId)}, {'$set':{'status':0}}, True)
                if dbrv.get('ok'):
                    rt = True
        except Exception as e:
            print('Patrol.savePoint failed:'+e.__str__())
            logging.error('Patrol.savePoint failed:'+e.__str__())
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
        # missionId = []
        try:
            if ObjectId.is_valid(executorId):
                # missionId = cls.get_patrol_mission_by_executor(projId, executorId)
                # if len(missionId) == 0:
                # data.update({'_id':ObjectId(executorId)})
                dbrv = Patrol._collection_executor.update({'_id':ObjectId(executorId), 'projId':int(projId)}, {'$set':{'status':0}}, True)
                if dbrv.get('ok'):
                    rt = True
        except Exception as e:
            print('Patrol.saveExecutor failed:'+e.__str__())
            logging.error('Patrol.saveExecutor failed:'+e.__str__())
        return rt

    @classmethod
    def get_patrol_mission_by_executor(cls, projId, executorId):
        rt = []
        try:
            pTime = datetime.now().strftime('%Y-%m-%d')
            mission_list = cls.get_patrol_mission_list_by_projId(projId, pTime, pTime)
            for mission in mission_list:
                option = mission.get('option')
                c = datetime.strptime(pTime, '%Y-%m-%d') - datetime.strptime(mission.get('startTime'), '%Y-%m-%d %H:%M:%S')
                if option:
                    for pathId in option.keys():
                        plandata = option.get(pathId)
                        for planTime in plandata.keys():
                            elist = plandata.get(planTime)
                            if executorId.__str__() in elist[c.days:]:
                                rt.append(mission.get('_id').__str__())
        except Exception as e:
            print('get_patrol_path_by_executor error:' + e.__str__())
            logging.error('get_patrol_path_by_executor error:' + e.__str__())
        return rt

    @classmethod
    def get_patrol_mission_by_path(cls, projId, pathId):
        rt = []
        try:
            pTime = datetime.now().strftime('%Y-%m-%d')
            mission_list = cls.get_patrol_mission_list_by_projId(projId, pTime, pTime)
            for mission in mission_list:
                option = mission.get('option')
                if option:
                    if pathId.__str__() in option.keys():
                        rt.append(mission.get('_id').__str__())
        except Exception as e:
            print('get_patrol_mission_by_path error:' + e.__str__())
            logging.error('get_patrol_mission_by_path error:' + e.__str__())
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
                try:
                    cursor_2 = Patrol._collection_path.find({'path':item.get('_id').__str__(), 'projId':projId})
                    item.update({'arrPaths':[]})
                    for i in cursor_2:
                        item.get('arrPaths').append({'_id':i.get('_id').__str__(), 'name':i.get('name')})
                    if isinstance(item.get('lastTime'), datetime):
                        rt.append({'_id':item.get('_id').__str__(), 'name':item.get('name'), 'codeQR':item.get('codeQR'),
                               'type':item.get('type'), 'content':item.get('content'),
                               'lastTime':item.get('lastTime').strftime('%Y-%m-%d %H:%M:%S'), 'status':item.get('status'),
                               'arrPaths':item.get('arrPaths')})
                    else:
                        rt.append({'_id':item.get('_id').__str__(), 'name':item.get('name'), 'codeQR':item.get('codeQR'),
                                   'type':item.get('type'), 'content':item.get('content'),
                                   'lastTime':'', 'status':item.get('status'),
                                   'arrPaths':item.get('arrPaths')})
                except Exception as e:
                    print('get_patrol_point_list error:' + e.__str__())
                    print(item)
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
            cursor_1 = Patrol._collection_path.find({'projId':projId, 'path':pointId})
            list_1 = list(cursor_1)
            for item in list_1:
                cursor_2 = Patrol._collection_point.find({'_id':{'$in':[ObjectId(x) for x in item.get('path')]}})
                list_2 = list(cursor_2)
                path = []
                for p in item.get('path'):
                    for i in list_2:
                        if p == i.get('_id').__str__():
                            path.append({'_id':i.get('_id').__str__(), 'name':i.get('name')})
                rt.append({'_id':item.get('_id').__str__(), 'name':item.get('name'), 'elapse':item.get('elapse'),
                           'path':path, 'timeRange':'%i %+i'%(item.get('time_down', -30), item.get('time_up', 30))})
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
                try:
                    cursor_2 = Patrol._collection_point.find({'_id':{'$in':[ObjectId(x) for x in item.get('path') if ObjectId.is_valid(x)]}})
                    point_dict = {}
                    for i in cursor_2:
                        point_dict.update({i.get('_id').__str__():i.get('name')})
                    rt.append({'_id':item.get('_id').__str__(), 'name':item.get('name'), 'elapse':item.get('elapse'),
                               'path':[{'_id':x, 'name':point_dict.get(x)} for x in item.get('path')],
                               'status':item.get('status'),
                               'timeRange':'%i %+i'%(item.get('time_down', -30), item.get('time_up', 30))})
                except Exception as e:
                    print('get_patrol_path_by_projId error:' + e.__str__())
                    print(item)
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
                try:
                    rt.append({'_id':item.get('_id').__str__(), 'code':item.get('code'), 'name':item.get('name'),
                               'status':item.get('status'),
                               'sex':item.get('sex'), 'department':item.get('department'), 'projId':item.get('projId')})
                except Exception as e:
                    print('get_patrol_executor_by_projId error:' + e.__str__())
                    print(item)
        except Exception as e:
            print('get_patrol_executor_by_projId error:' + e.__str__())
            logging.error('get_patrol_executor_by_projId error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def get_patrol_mission_list_by_projId(cls, projId, startTime, endTime):
        rt = []
        cursor = None
        try:
            if isinstance(startTime, str):
                startTime = datetime.strptime(startTime, '%Y-%m-%d')
            if isinstance(endTime, str):
                endTime = datetime.strptime(endTime, '%Y-%m-%d')
            if not isinstance(projId, int):
                projId = int(projId)
            n = 0
            limit = 100
            while n >= 0:
                cursor = Patrol._collection_mission.find({'projId':projId, 'startTime':{'$lte':endTime}}, skip = n * limit, limit = limit, sort = [('startTime', -1)])
                list_1 = list(cursor)
                for item in list_1:
                    if item.get('startTime') < startTime:
                        if item.get('startTime') + timedelta(days = int(item.get('interval'))) <= startTime:
                            if startTime - timedelta(days = int(item.get('interval'))) < datetime.now():
                                n = -1
                                if len(rt) == 0:
                                    c = startTime - item.get('startTime')
                                    s = c.days // int(item.get('interval'))
                                    st = item.get('startTime') + timedelta(days = s * int(item.get('interval')))
                                    new_mission = {'_id':ObjectId(), 'projId':item.get('projId'), 'startTime':st,
                                                   'interval':item.get('interval'), 'option':item.get('option'), 'lastModified': datetime.now(), 'lastModifiedUser': request.cookies.get('userId', None)}
                                    dbrv = Patrol._collection_mission.update({'_id':new_mission.get('_id')}, {'$set':new_mission}, True)
                                    if dbrv.get('ok'):
                                        new_mission.update({'_id':new_mission.get('_id').__str__(),
                                                            'startTime':new_mission.get('startTime').strftime('%Y-%m-%d %H:%M:%S')})
                                        rt.append(new_mission)
                            break
                    rt.append({'_id':item.get('_id').__str__(), 'projId':item.get('projId'),
                               'startTime':item.get('startTime').strftime('%Y-%m-%d %H:%M:%S'), 'interval':item.get('interval'),
                               'option':item.get('option')})
                if len(list_1) == 0:
                    n = -1
                if n >= 0:
                    n = n + 1
                if cursor:
                    cursor.close()
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
            data = cls.get_patrol_mission_cycle(projId, data)
            data.update({'lastModified': datetime.now(), 'lastModifiedUser': request.cookies.get('userId', None)})

            if data is not None:
                dbrv = Patrol._collection_mission.update({'_id':data.get('_id')}, {'$set':data}, True)
                if dbrv.get('ok'):
                    rt = data.get('_id').__str__()
        except Exception as e:
            print('save_patrol_mission error:' + e.__str__())
            logging.error('save_patrol_mission error:' + e.__str__())
        return rt

    @classmethod
    def get_patrol_mission_cycle(cls, projId, data):
        rt = None
        try:
            if isinstance(data.get('startTime'), datetime):
                dbrv = Patrol._collection_mission.find_one({'projId':int(projId), 'startTime':{'$lte':data.get('startTime')}}, sort = [('startTime', -1)])
                if dbrv is not None:
                    c = data.get('startTime') - dbrv.get('startTime')
                    if c.days < int(dbrv.get('interval')):
                        data.update({'_id':dbrv.get('_id'), 'startTime':dbrv.get('startTime')})
                    elif c.days >= int(dbrv.get('interval')):
                        s = c.days // int(dbrv.get('interval'))
                        data.update({'_id':ObjectId(), 'startTime':dbrv.get('startTime')+(timedelta(days=s)*int(dbrv.get('interval')))})
                rt = data
        except Exception as e:
            print('get_patrol_mission_cycle error:' + e.__str__())
            logging.error('get_patrol_mission_cycle error:' + e.__str__())
        return rt

    @classmethod
    def save_patrol_missionlog(cls, data):
        rt = ''
        initial = True
        #如果获取到planDate则不进行初始化操作
        if data.get('planDate') and isinstance(data.get('planDate'), str):
            initial = False
            try:
                if len(data.get('planDate')) > 20:
                    print("planDate is a ISODate")
                    planDate = data.get('planDate')
                    plan_date = planDate.split('T')[0]
                    plan_time = planDate.split('T')[1].split('.')[0]
                    planDate = plan_date + ' ' + plan_time
                    data.update({'planDate':planDate})
            except Exception as e:
                logging.error('save_patrol_missionlog error: translate ISODate' + e.__str__())
        try:
            data.update({'_id':ObjectId(data.get('_id')) if ObjectId.is_valid(data.get('_id')) else ObjectId(),
                         'executorId':ObjectId(data.get('executorId')) if ObjectId.is_valid(data.get('executorId')) else None,
                         'pathId':ObjectId(data.get('pathId')) if ObjectId.is_valid(data.get('pathId')) else None,
                         'missionId':ObjectId(data.get('missionId')) if ObjectId.is_valid(data.get('missionId')) else None,
                         'startTime':datetime.strptime(data.get('startTime'), '%Y-%m-%d %H:%M:%S') if isinstance(data.get('startTime'), str) else datetime.now(),
                         'endTime':datetime.strptime(data.get('endTime'), '%Y-%m-%d %H:%M:%S') if isinstance(data.get('endTime'), str) else datetime.now(),
                         'submitTime':datetime.now(),
                         'state':int(data.get('state')) if data.get('state') is not None else 0,
                         'projId':int(data.get('projId')) if data.get('projId') is not None else None,
                         'planDate':datetime.strptime(data.get('planDate'), '%Y-%m-%d %H:%M:%S') if isinstance(data.get('planDate'), str) else datetime.now()})
            if initial:
                try:
                    temp_startTime = datetime.strftime(data.get('startTime'), "%Y-%m-%d %H:%M:%S")
                    temp_startTime = temp_startTime.split(" ")[0] + " " + data.get('planTime', "00:00") + ":00"
                    temp_startTime = datetime.strptime(temp_startTime, '%Y-%m-%d %H:%M:%S')
                    data.update({'planDate': temp_startTime})
                except Exception as e:
                    logging.error('save_patrol_missionlog error:' + e.__str__())
            dbrv = Patrol._collection_missionlog.update({'_id':data.get('_id')}, {'$set':data}, True)
            if dbrv.get('ok'):
                rt = data.get('_id').__str__()
        except Exception as e:
            print('save_patrol_missionlog error:' + e.__str__())
            logging.error('save_patrol_missionlog error:' + e.__str__())
        return rt


    @classmethod
    def save_patrol_missionlog_cache(cls, data):
        rt = ''
        try:
            data.update({'_id':ObjectId(data.get('_id')) if ObjectId.is_valid(data.get('_id')) else ObjectId(),
                        'projId':-1})
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
            b = list.count(0) + list.count(1) + list.count(2)
            if b != 0:
                rt = "%.2f%%"%(a/b*100)
        except Exception as e:
            print('calculate_the_percentage error:' + e.__str__())
            logging.error('calculate_the_percentage error:' + e.__str__())
        return rt

    @classmethod
    def get_patrol_report_baseon_man(cls, projId, startTime, endTime):
        '''
        David 20160914 rewrite
        :param projId:
        :param startTime:
        :param endTime:
        :return:
        '''
        rt = {'time':[], 'data':[]}
        cursor = None
        try:
            startTime = datetime.strptime(startTime, '%Y-%m-%d')
            endTime = datetime.strptime(endTime, '%Y-%m-%d')
            if endTime >= datetime.now():
                endTime = datetime.strptime(datetime.now().strftime('%Y-%m-%d'), '%Y-%m-%d')
            #获取段时间内的mission列表
            mission_list = cls.get_patrol_mission_list_by_projId(projId, startTime, endTime)
            mission_list.reverse()
            cursor = cls._collection_missionlog.find({'missionId':{'$in':[ObjectId(x.get('_id')) for x in mission_list
                                                                          if ObjectId.is_valid(x.get('_id'))]}})
            #段时间内所有的日志列表
            missionlog_list = list(cursor)
            #段时间内mission中涉及的人员信息
            executor_data = {}  #记录排班计划中所有人员信息
            for mission in mission_list:
                #option： 排班计划中的排班内容  {'pathId':{'09:00': ['executorId'],'16:00': ['executorId']}}
                option = mission.get('option')
                if option:
                    #pathId
                    for pathId in option.keys():
                        #pd {'09:00': ['executorId'],'16:00': ['executorId']}
                        pd = option.get(pathId)
                        for pt in pd.keys():
                            elist = pd.get(pt)
                            for executorId in elist:
                                if executorId not in executor_data.keys():
                                    executor_data.update({executorId:{'name':None, 'data':[], 'log':[]}})
            ptime = startTime
            while ptime <= endTime:
                rt.get('time').append(ptime.strftime('%Y-%m-%d'))
                #p executorId
                for p in executor_data:
                    executor_data.get(p).get('data').append(None)
                for mission in mission_list:
                    option = mission.get('option')
                    #判断当天需要巡更的人员
                    x = rt.get('time').index(ptime.strftime('%Y-%m-%d'))
                    if datetime.strptime(mission.get('startTime'), '%Y-%m-%d %H:%M:%S') <= ptime:
                        if option:
                            c = ptime - datetime.strptime(mission.get('startTime'), '%Y-%m-%d %H:%M:%S')
                            n = c.days % mission.get('interval')
                            #对missionlog进行分类
                            for missionlog in missionlog_list:
                                planDate = missionlog.get('planDate', missionlog.get('startTime'))
                                if not isinstance(planDate, datetime):
                                    planDate = datetime.strptime(planDate, '%Y-%m-%d %H:%M:%S')
                                #找到当天的missionlog
                                if ptime.date() == planDate.date():
                                    executor_data.get(missionlog.get('executorId').__str__()).get('data')[x] = 2
                                    missionlog_path = missionlog.get('path')
                                    if cls.judge_missionlog_path(missionlog_path):
                                        pt = ptime.strftime('%Y-%m-%d') + missionlog.get('planTime') + missionlog.get('pathId').__str__()
                                        if pt not in executor_data.get(missionlog.get('executorId').__str__()).get('log'):
                                            executor_data.get(missionlog.get('executorId').__str__()).get('log').append(pt)
                            #当天人员完成的巡更路线数量
                            for e in executor_data.keys():
                                #executor_data.get(e).get('data') ： None 当天没有巡更任务，0 没有巡更，1 巡更完成， 2 巡更部分完成
                                if executor_data.get(e).get('data')[x] == 2:    #存在missionlog  区分 巡更完成和巡更部分完成
                                    k = 0
                                    for pathId in option:
                                        plandata = option.get(pathId)
                                        for planTime in plandata:
                                            if plandata.get(planTime)[n] == e.__str__():
                                                k = 1
                                                if ptime.strftime('%Y-%m-%d') + planTime + pathId not in executor_data.get(e).get('log'):
                                                    #计划中存在没有完成的路线，当天的报表记为 部分完成 跳出循环，计算下一个人员
                                                    executor_data.get(e).get('data')[x] = 2
                                                    k = 2
                                                    break
                                        if k == 2:
                                            break
                                    if k == 0:
                                        executor_data.get(e).get('data')[x] = 2
                                    elif k == 1:
                                        executor_data.get(e).get('data')[x] = 1
                                elif executor_data.get(e).get('data')[x] == None:   #不存在missionlog 区分 没有巡更任务和没有巡更
                                    k = None
                                    for pathId in option:
                                        plandata  = option.get(pathId)
                                        for planTime in plandata:
                                            if plandata.get(planTime)[n] == e.__str__():
                                                executor_data.get(e).get('data')[x] = 0
                                                k = 0
                                                break
                                        if k == 0:
                                            break
                ptime = ptime + timedelta(days=1)
            if cursor:
                cursor.close()
            #获取人员信息
            cursor = cls._collection_executor.find({'_id':{'$in':[ObjectId(t) for t in executor_data.keys() if ObjectId.is_valid(t)]}},
                                                   sort=[('name', 1)])
            executor_list = list(cursor)
            for item in executor_list:
                if item.get('_id').__str__() in executor_data.keys():
                    rt.get('data').append({'exectorId':item.get('_id').__str__(), 'name':item.get('name'), 'partment':item.get('department'),
                                           'data':executor_data.get(item.get('_id').__str__()).get('data'), 'status':item.get('status'),
                                           'percent':cls.calculate_the_percentage_from_list(executor_data.get(item.get('_id').__str__()).get('data'))})
        except Exception as e:
            print('get_patrol_report_baseon_man error:' + e.__str__())
            logging.error(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt


    @classmethod
    def judge_missionlog_path(cls, missionlog_path):
        '''
        David 20160917
        :param missionlog_path:
        :return: rt = 0 表示存在跳过的节点
                 rt = 1 表示全部按计划完成
        '''
        rt = 0
        try:
            for point in missionlog_path:
                if point.get('error') == 2:
                    rt = 0
                    break
                rt = 1
        except Exception as e:
            print('judge_missionlog_path error:' + e.__str__())
            logging.error(e.__str__())
        return rt

    @classmethod
    def get_patrol_report_baseon_path(cls, projId, startTime, endTime):
        '''
        David 20160918 rewrite
        :param projId:
        :param startTime:
        :param endTime:
        :return:
        '''
        rt = {'time':[], 'data':[]}
        cursor = None
        try:
            startTime = datetime.strptime(startTime, '%Y-%m-%d')
            endTime = datetime.strptime(endTime, '%Y-%m-%d')
            if endTime >= datetime.now():
                endTime = datetime.strptime(datetime.now().strftime('%Y-%m-%d'), '%Y-%m-%d')
            #获取段时间内所有的mission列表
            mission_list = cls.get_patrol_mission_list_by_projId(projId, startTime, endTime)
            mission_list.reverse()
            cursor = cls._collection_missionlog.find({'missionId':{'$in':[ObjectId(x.get('_id')) for x in mission_list if ObjectId.is_valid(x.get('_id'))]}})
            #段时间内的missionlog列表
            missionlog_list = list(cursor)
            #获取mission中涉及到的巡更path
            path_data = {}
            for mission in mission_list:
                #option： 排班计划中的排班内容  {'pathId':{'09:00': ['executorId'],'16:00': ['executorId']}}
                option  = mission.get('option')
                if option:
                    for pathId in option:
                        if pathId not in path_data.keys():
                            path_data.update({pathId:{'name':None, 'data':[], 'log':[]}})
            ptime = startTime
            while ptime <= endTime:
                rt.get('time').append(ptime.strftime('%Y-%m-%d'))
                for p in path_data:
                    path_data.get(p).get('data').append(None)
                for mission in mission_list:
                    option = mission.get('option')
                    x = rt.get('time').index(ptime.strftime('%Y-%m-%d'))
                    if datetime.strptime(mission.get('startTime'), '%Y-%m-%d %H:%M:%S') <= ptime:
                        if option:
                            #将mission中的option逐个和当天的日志进行比对，当planTime相同时，path_data【log】.append(ptime)
                            for missionlog in missionlog_list:
                                planDate = missionlog.get('planDate', missionlog.get('startTime'))
                                if not isinstance(planDate, datetime):
                                    planDate = datetime.strptime(planDate, '%Y-%m-%d %H:%M:%S')
                                #找到当天的missionlog
                                if planDate.date() == ptime.date():
                                    #pid  pathId in missionlog
                                    pid = missionlog.get('pathId')
                                    path_data.get(pid.__str__()).get('data')[x] = 2
                                    if pid.__str__() in option:
                                        #pot  {'09:00': ['executorId'], '16:00': ['executorId']}
                                        pot = option.get(pid.__str__())
                                        if missionlog.get('planTime') in pot.keys():
                                            missionlog_path = missionlog.get('path')
                                            if cls.judge_missionlog_path(missionlog_path):
                                                pt = ptime.strftime('%Y-%m-%d') + missionlog.get('planTime')
                                                path_data.get(pid.__str__()).get('log').append(pt)
                            #计算当天每条路线巡更的次数，和option中每条路线计划巡更的次数进行比对
                            c = ptime - datetime.strptime(mission.get('startTime'), '%Y-%m-%d %H:%M:%S')
                            n = c.days % mission.get('interval')
                            for pathId in option:
                                pdata = option.get(pathId)
                                if path_data.get(pathId).get('data')[x] == 2:
                                    k = None
                                    for pl in pdata.keys():
                                        if pdata.get(pl)[n] is not None:
                                            k = 1
                                            if ptime.strftime('%Y-%m-%d') + pl not in path_data.get(pathId).get('log'):
                                                path_data.get(pathId).get('data')[x] = 2
                                                k = 2
                                                break
                                    if k == 1:
                                        path_data.get(pathId).get('data')[x] = 1
                                    if k == None:
                                        path_data.get(pathId).get('data')[x] = None
                                elif path_data.get(pathId).get('data')[x] == None:
                                    for pl in pdata.keys():
                                        if pdata.get(pl)[n] is not None:
                                            path_data.get(pathId).get('data')[x] = 0
                ptime = ptime + timedelta(days = 1)
            if cursor:
                cursor.close()
            #获取报表中每条路线的路线名
            cursor = cls._collection_path.find({'_id':{'$in':[ObjectId(p) for p in path_data.keys() if ObjectId.is_valid(p)]}},
                                               sort=[('name', 1)])
            for item in cursor:
                if item.get('_id').__str__() in path_data.keys():
                    rt.get('data').append({'pathId':item.get('_id').__str__(), 'name':item.get('name'), 'status':item.get('status'),
                                           'data':path_data.get(item.get('_id').__str__()).get('data')})
        except Exception as e:
            print('get_patrol_report_baseon_path error:' + e.__str__())
            logging.error(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def get_patrol_log_by_pathId(cls, projId, pathId, pTime):
        rt = []
        cursor = None
        try:
            pTime = datetime.strptime(pTime, '%Y-%m-%d')
            path = cls._collection_path.find_one({'_id':ObjectId(pathId)})
            #获取段时间内的mission
            mission_list = cls.get_patrol_mission_list_by_projId(int(projId), pTime, pTime)
            cursor = cls._collection_missionlog.find({'projId':int(projId), 'pathId':ObjectId(pathId),
                                                      'missionId':{'$in':[ObjectId(m.get('_id')) for m in mission_list if ObjectId.is_valid(m.get('_id'))]},
                                                      '$or':[{'planDate':{'$gte':pTime, '$lt':pTime + timedelta(days = 1)}},{'startTime':{'$gte':pTime, '$lt':pTime + timedelta(days = 1)}}]})
            #段时间内的mission涉及到的missionlog列表
            missionlog_list = list(cursor)
            if cursor:
                cursor.close()
            #
            point_data = {}
            cursor = cls._collection_point.find({'_id':{'$in':[ObjectId(po) for po in path.get('path') if ObjectId.is_valid(po)]}})
            for item in cursor:
                point_data.update({item.get('_id').__str__():item.get('name')})
            data = [{'point':point_data.get(pp), 'time':None, 'error':None, 'msg':None, 'arrPic':None, 'step':0} for pp in path.get('path')]
            if cursor:
                cursor.close()
            executor_data = {}
            cursor = cls._collection_executor.find({'projId':int(projId)})
            for ei in cursor:
                executor_data.update({ei.get('_id').__str__():ei.get('name')})
            for mission in mission_list:
                option = mission.get('option')
                if option:
                    if pathId in option.keys():
                        pdata = option.get(pathId)
                        for p in pdata.keys():
                            c = pTime - datetime.strptime(mission.get('startTime'), '%Y-%m-%d %H:%M:%S')
                            x = c.days % mission.get('interval')
                            if pdata.get(p)[x] is not None:
                                rt.append({'path':{pathId:path.get('name')}, 'executor':{pdata.get(p)[x]:executor_data.get(pdata.get(p)[x])},
                                           'startTime':None, 'endTime':None, 'planTime':p, 'data':data, 'state':None,
                                           'submitTime':None, 'isOnline':None, 'gps':None})
                            for missionlog in missionlog_list:
                                try:
                                    if not missionlog.get('planDate'):
                                        missionlog.update({'planDate':missionlog.get('startTime')})
                                    if missionlog.get('planDate').date() == pTime.date():
                                        if missionlog.get('missionId').__str__() == mission.get('_id') and missionlog.get('planTime') == p:
                                            data_1 = copy.deepcopy(data)
                                            for n in range(len(missionlog.get('path'))):
                                                if missionlog.get('path')[n].get('error') != -1:
                                                    if data[n].get('point') == missionlog.get('path')[n].get('name'):
                                                        data_1[n].update({'time':missionlog.get('path')[n].get('time'),
                                                                        'error':missionlog.get('path')[n].get('error'),
                                                                        'msg':missionlog.get('path')[n].get('msg'),
                                                                        'arrPic':missionlog.get('path')[n].get('arrPic'),
                                                                        'gps':missionlog.get('path')[n].get('gps'),
                                                                        'step':missionlog.get('path')[n].get('step') if isinstance(missionlog.get('path')[n].get('step'), int) else 0})
                                                else:
                                                    data_1[n].update({'point':missionlog.get('path')[n].get('name'),
                                                                      'time':missionlog.get('path')[n].get('time'),
                                                                      'error':missionlog.get('path')[n].get('error'),
                                                                      'msg':missionlog.get('path')[n].get('msg'),
                                                                      'arrPic':missionlog.get('path')[n].get('arrPic'),
                                                                      'gps':missionlog.get('path')[n].get('gps'),
                                                                      'step':missionlog.get('path')[n].get('step') if isinstance(missionlog.get('path')[n].get('step'), int) else 0})
                                            rt[-1].update({'path':{pathId:path.get('name')}, 'executor':{missionlog.get('executorId').__str__():executor_data.get(missionlog.get('executorId').__str__())},
                                                           'planTime':p, 'startTime':missionlog.get('startTime').strftime('%Y-%m-%d %H:%M:%S') if isinstance(missionlog.get('startTime'), datetime) else None,
                                                           'endTime':missionlog.get('endTime').strftime('%Y-%m-%d %H:%M:%S') if isinstance(missionlog.get('endTime'), datetime) else None,
                                                           'data':data_1, 'state':missionlog.get('state'),
                                                           'submitTime':missionlog.get('submitTime').strftime('%Y-%m-%d %H:%M:%S') if isinstance(missionlog.get('submitTime'), datetime) else None,
                                                           'isOnline':missionlog.get('isOnline'), 'missionId':missionlog.get('missionId').__str__(),
                                                           'gps':missionlog.get('gps'),
                                                           'step':sum([s.get('step') for s in data_1 if isinstance(s, dict)])})
                                except Exception as e:
                                    pass
            if len(rt) > 0:
                rv = copy.deepcopy(rt)
                rt = []
                l = list(set([plt.get('planTime') for plt in rv]))
                l.sort()
                for n in l:
                    for lr in rv:
                        if lr.get('planTime') == n:
                            rt.append(lr)
        except Exception as e:
            print('get_patrol_log_by_pathId error:' + e.__str__())
            logging.error('get_patrol_log_by_pathId error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def get_patrol_executorName_by_idlist(cls, idlist):
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
                path.update({'path':point, 'timeRange':'%i %+i'%(path.get('time_down', -30), path.get('time_up', 30))})
                rt.update(path)
        except Exception as e:
            print('get_patrol_path_by_pathid error:' + e.__str__())
            logging.error('get_patrol_path_by_pathid error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def get_patrol_log_by_executorId(cls, projId, executorId, pTime):
        rt = []
        cursor = None
        try:
            pTime = datetime.strptime(pTime, '%Y-%m-%d')
            #人员信息
            executor = cls._collection_executor.find_one({'_id':ObjectId(executorId)})
            #mission信息
            mission_list = cls.get_patrol_mission_list_by_projId(projId, pTime, pTime)
            cursor = cls._collection_missionlog.find({'projId':int(projId), 'executorId':ObjectId(executorId),
                                                      'missionId':{'$in':[ObjectId(m.get('_id')) for m in mission_list if ObjectId.is_valid(m.get('_id'))]},
                                                      '$or':[{'planDate':{'$gte':pTime, '$lt':pTime + timedelta(days = 1)}},{'startTime':{'$gte':pTime, '$lt':pTime + timedelta(days = 1)}}]})
            #日志列表
            missionlog_list = list(cursor)
            if cursor:
                cursor.close()
            #巡更路线信息
            path_dict = {}
            cursor = cls._collection_path.find({'projId':int(projId)})
            for p in cursor:
                path_dict.update({p.get('_id').__str__():{'name':p.get('name'), 'point':p.get('path')}})
            if cursor:
                cursor.close()
            #巡更点信息
            point_dict = {}
            cursor = cls._collection_point.find({'projId':int(projId)})
            for pp in cursor:
                point_dict.update({pp.get('_id').__str__():pp.get('name')})
            for mission in mission_list:
                option = mission.get('option')
                if option:
                    c = pTime - datetime.strptime(mission.get('startTime'), '%Y-%m-%d %H:%M:%S')
                    n = c.days % mission.get('interval')
                    for pathId in option.keys():
                        pathdata = option.get(pathId)
                        for planTime in pathdata:
                            elist = pathdata.get(planTime)
                            #将mission中涉及到的人员和当天的日志逐个比对
                            if executorId == elist[n]:
                                rt.append({'executor':{executorId:executor.get('name')}, 'path':{pathId:path_dict.get(pathId).get('name')},
                                           'startTime':None, 'endTime':None, 'partment':executor.get('department'),
                                           'planTime':planTime,'state':None,
                                           'data':[{'point':point_dict.get(poid), 'time':None, 'msg':None, 'error':None,
                                                    'arrPic':None, 'step':0} for poid in path_dict.get(pathId).get('point')],
                                           'submitTime':None, 'isOnline':None, 'gps':None})
                                for missionlog in missionlog_list:
                                    try:
                                        if not missionlog.get('planDate'):
                                            missionlog.update({'planDate':missionlog.get('startTime')})
                                        if missionlog.get('planDate').date() == pTime.date():
                                            if missionlog.get('pathId').__str__() == pathId and missionlog.get('planTime') == planTime:
                                                data = copy.deepcopy(rt[-1].get('data'))
                                                for x in range(len(missionlog.get('path'))):
                                                    if missionlog.get('path')[x].get('error') != -1:
                                                        if data[x].get('point') == missionlog.get('path')[x].get('name'):
                                                            data[x].update({'point':point_dict.get(missionlog.get('path')[x].get('_id')),
                                                                            'time':missionlog.get('path')[x].get('time'),
                                                                            'msg':missionlog.get('path')[x].get('msg'),
                                                                            'error':missionlog.get('path')[x].get('error'),
                                                                            'arrPic':missionlog.get('path')[x].get('arrPic'),
                                                                            'gps':missionlog.get('path')[x].get('gps'),
                                                                            'step':missionlog.get('path')[x].get('step') if isinstance(missionlog.get('path')[x].get('step'), int) else 0})
                                                    else:
                                                        data[x].update({'point':missionlog.get('path')[x].get('name'),
                                                                      'time':missionlog.get('path')[x].get('time'),
                                                                      'error':missionlog.get('path')[x].get('error'),
                                                                      'msg':missionlog.get('path')[x].get('msg'),
                                                                      'arrPic':missionlog.get('path')[x].get('arrPic'),
                                                                      'gps':missionlog.get('path')[x].get('gps'),
                                                                      'step':missionlog.get('path')[x].get('step') if isinstance(missionlog.get('path')[x].get('step'), int) else 0})
                                                rt[-1].update({'startTime':missionlog.get('startTime').strftime('%Y-%m-%d %H:%M:%S'),
                                                               'endTime':missionlog.get('endTime').strftime('%Y-%m-%d %H:%M:%S'),
                                                               'data':data, 'state':missionlog.get('state'),
                                                               'submitTime':missionlog.get('submitTime').strftime('%Y-%m-%d %H:%M:%S') if isinstance(missionlog.get('submitTime'), datetime) else None,
                                                               'isOnline':missionlog.get('isOnline'), 'missionId':missionlog.get('missionId').__str__(),
                                                               'gps':missionlog.get('gps'),
                                                               'step':sum([s.get('step') for s in data if isinstance(s, dict)])})
                                    except Exception as e:
                                        pass
            if len(rt) > 0:
                rv = copy.deepcopy(rt)
                rt = []
                l = list(set([plt.get('planTime') for plt in rv]))
                l.sort()
                #for lr in rv:
                    #n = l.index(lr.get('planTime'))
                    #rt[n] = lr
                    #l[n] = None
                for n in l:
                    for r in rv:
                        if r.get('planTime') == n:
                            rt.append(r)
        except Exception as e:
            print('get_patrol_log_by_executorId error:' + e.__str__())
            logging.error('get_patrol_log_by_executorId error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def get_patrol_abnormity(cls, projId, startTime, endTime):
        rt = []
        cursor = None
        try:
            projId = int(projId)
            if startTime is None or len(startTime) == 0:
                cursor = cls._collection_missionlog.find({'projId':projId})
            else:
                startTime = datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S')
                endTime = datetime.strptime(endTime, '%Y-%m-%d %H:%M:%S')
                cursor = cls._collection_missionlog.find({'projId':projId, 'startTime':{'$gte':endTime, '$lte':startTime}})
            for item in cursor:
                try:
                    if item.get('state') == 2:
                        rt.append({'_id':item.get('_id').__str__(),
                                   'submitTime':item.get('submitTime').strftime('%Y-%m-%d %H:%M:%S') if isinstance(item.get('submitTime'), datetime) else None,
                                   'executorId':item.get('executorId').__str__(), 'pathId':item.get('pathId').__str__(),'isOnline':item.get('isOnline'),
                                   'startTime':item.get('startTime').strftime('%Y-%m-%d %H:%M:%S') if isinstance(item.get('startTime'), datetime) else None,
                                   'endTime':item.get('endTime').strftime('%Y-%m-%d %H:%M:%S') if isinstance(item.get('endTime'), datetime) else None,
                                   'state':item.get('state'), 'gps':item.get('gps'),
                                   'missionId':item.get('missionId').__str__(), 'planTime':item.get('planTime'), 'path':item.get('path'),
                                   'projId':item.get('projId')})
                    else:
                        path = item.get('path')
                        for p in path:
                            msg = p.get('msg', '') if p.get('msg') is not None else ''
                            arrPic = p.get('arrPic', []) if isinstance(p.get('arrPic'), list) else []
                            if len(msg) > 0 or len(arrPic) > 0:
                                rt.append({'_id':item.get('_id').__str__(),
                                   'submitTime':item.get('submitTime').strftime('%Y-%m-%d %H:%M:%S') if isinstance(item.get('submitTime'), datetime) else None,
                                   'executorId':item.get('executorId').__str__(), 'pathId':item.get('pathId').__str__(),'isOnline':item.get('isOnline'),
                                   'startTime':item.get('startTime').strftime('%Y-%m-%d %H:%M:%S') if isinstance(item.get('startTime'), datetime) else None,
                                   'endTime':item.get('endTime').strftime('%Y-%m-%d %H:%M:%S') if isinstance(item.get('endTime'), datetime) else None,
                                   'state':item.get('state'), 'gps':item.get('gps'),
                                   'missionId':item.get('missionId').__str__(), 'planTime':item.get('planTime'), 'path':item.get('path'),
                                   'projId':item.get('projId')})
                                break
                except Exception as e:
                    pass
        except Exception as e:
            print('get_patrol_abnormity error:' + e.__str__())
            logging.error('get_patrol_abnormity error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt


    @classmethod
    def get_patrol_num_of_log(cls, projId, pathId, date = datetime.now()):
        Total_Qty = 0
        Complete_Qty = 0
        cursor = None
        try:
            if isinstance(date, datetime):
                ptime = datetime.strptime(date.strftime('%Y-%m-%d'), '%Y-%m-%d')
            elif isinstance(date, str):
                ptime = datetime.strptime(date, '%Y-%m-%d')
            else:
                raise Exception('datetime error')
            mission_list = cls.get_patrol_mission_list_by_projId(projId, ptime, ptime)
            plantTime_list = []
            for mission in mission_list:
                mis_star = mission.get('startTime')
                if not isinstance(mis_star, datetime):
                    mis_star = datetime.strptime(mis_star, "%Y-%m-%d %H:%M:%S")
                c = ptime - mis_star
                x = c.days % int(mission.get('interval'))
                option = mission.get('option')
                for key in option.keys():
                    if key == pathId.__str__():
                        pathdata = option.get(key)
                        for item in pathdata:
                            if pathdata.get(item)[x] is not None:
                                Total_Qty = Total_Qty + 1
                                plantTime_list.append(item)
            cursor = cls._collection_missionlog.find({'projId':int(projId), 'pathId':ObjectId(pathId),
                                                      'planTime':{'$in':plantTime_list},
                                                      'startTime':{'$gte':ptime, '$lt':ptime + timedelta(days=1)}})
            for item in cursor:
                if item.get('pathId').__str__() == pathId:
                    Complete_Qty = Complete_Qty + 1
        except Exception as e:
            print('get_patrol_num_of_log error:' + e.__str__())
            logging.error('get_patrol_num_of_log error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return Complete_Qty, Total_Qty

    @classmethod
    def get_patrol_path_complete_num(cls, projId, date = datetime.now()):
        rt = []
        cursor = None
        try:
            if isinstance(date, datetime):
                ptime = datetime.strptime(date.strftime('%Y-%m-%d'), '%Y-%m-%d')
            elif isinstance(date, str):
                ptime = datetime.strptime(date, '%Y-%m-%d')
            else:
                raise Exception('datetime error')
            #get missionlist
            mission_list = cls.get_patrol_mission_list_by_projId(projId, ptime, ptime)
            path_info = {}
            for mission in mission_list:
                mis_star = mission.get('startTime')
                if not isinstance(mis_star, datetime):
                    mis_star = datetime.strptime(mis_star, "%Y-%m-%d %H:%M:%S")
                c = ptime - mis_star
                x = c.days % int(mission.get('interval'))
                option = mission.get('option')
                for key in option.keys():
                    Total_Qty = 0
                    pathdata = option.get(key)
                    path_info.update({key.__str__():{'name':None, 'Total_Qty':None, 'Complete_Qty':0, 'plan_list':[]}})
                    for item in pathdata:
                        if pathdata.get(item)[x] is not None:
                            Total_Qty = Total_Qty + 1
                            path_info.get(key.__str__()).get('plan_list').append(item)
                    path_info.get(key.__str__()).update({'Total_Qty':Total_Qty})
            cursor = cls._collection_missionlog.find({'projId':int(projId),
                                                      'missionId':{'$in':[ObjectId(y.get('_id')) for y in mission_list]},
                                                      '$or':[{'planDate':ptime},{'startTime':{'$gte':ptime, '$lt':ptime + timedelta(days=1)}}]},
                                                     sort=[('startTime',-1)])
            for item in cursor:
                try:
                    if item.get('pathId').__str__() in path_info.keys():
                        if item.get('planTime') in path_info.get(item.get('pathId').__str__()).get('plan_list'):
                            if isinstance(path_info.get(item.get('pathId').__str__()).get('Total_Qty'), int):
                                if path_info.get(item.get('pathId').__str__()).get('Total_Qty') > 0:
                                    path_info.get(item.get('pathId').__str__()).update({'Complete_Qty':path_info.get(item.get('pathId').__str__()).get('Complete_Qty') + 1})
                                    path_info.get(item.get('pathId').__str__()).get('plan_list').remove(item.get('planTime'))
                except Exception as e:
                    pass
            if cursor:
                cursor.close()
            dict_path = {}
            cursor = cls._collection_path.find({'_id':{'$in':[ObjectId(x) for x in path_info.keys()]}})
            for item in cursor:
                dict_path.update({item.get('_id').__str__():item.get('name')})
            for p in path_info.keys():
                if isinstance(path_info.get(p).get('Total_Qty'), int):
                    if path_info.get(p).get('Total_Qty') > 0:
                        rt.append({'_id':p, 'name':dict_path.get(p), 'Total_Qty':path_info.get(p).get('Total_Qty'),
                                   'Complete_Qty':path_info.get(p).get('Complete_Qty'), 'projId':int(projId)})
        except Exception as e:
            print('get_patrol_path_complete_num error:' + e.__str__())
            logging.error('get_patrol_path_complete_num error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt
