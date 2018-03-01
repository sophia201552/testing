﻿from beopWeb.MongoConnManager import MongoConnManager
from beopWeb.BEOPMongoDataAccess import g_table_patrol_missionlog, g_table_patrol_path, g_table_patrol_point
from beopWeb.BEOPMongoDataAccess import g_table_patrol_executor, g_table_patrol_mission

from datetime import timedelta, datetime, date
from bson import ObjectId
from flask import request
import logging
import copy


class Patrol(object):
    configConn = MongoConnManager.getConfigConn()
    _collection_path = configConn.mdbBb[g_table_patrol_path]
    _collection_point = configConn.mdbBb[g_table_patrol_point]
    _collection_executor = configConn.mdbBb[g_table_patrol_executor]
    _collection_mission = configConn.mdbBb[g_table_patrol_mission]
    _collection_missionlog = configConn.mdbBb[g_table_patrol_missionlog]

    @classmethod
    def savePath(cls, projId, data):
        pathId = ''
        try:
            if ObjectId.is_valid(data.get('_id')):
                data.update({'_id': ObjectId(data.get('_id')), 'updateTime': datetime.now(), 'projId': int(projId)})
            else:
                data.update({'_id': ObjectId(), 'updateTime': datetime.now(), 'projId': int(projId)})
            # missionlog_list = cls.get_missionlog_list_by_pathId(projId, data.get('_id'))
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
                    # data.update({'time_up':time_up, 'time_down':time_down})
                data.update({key: value})
            if 'timeRange' in data.keys():
                del data['timeRange']
                data.update({'time_up': time_up, 'time_down': time_down})
            dbrv = Patrol._collection_path.update({'_id': data.get('_id')}, {'$set': data}, True)
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
            cursor = cls._collection_missionlog.find({'pathId': ObjectId(pathId), 'projId': int(projId)})
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
                dbrv = Patrol._collection_path.update({'_id': ObjectId(pathId),
                                                       'projId': int(projId)}, {'$set': {'status': 0}}, True)
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
                data.update({'_id': ObjectId(data.get('_id')), 'updateTime': datetime.now(),
                             'projId': int(projId)})
            else:
                data.update({'_id': ObjectId(), 'updateTime': datetime.now(), 'projId': int(projId)})
            for key in data:
                value = data.get(key)
                if key == 'type' or key == 'projId':
                    if not isinstance(value, int):
                        value = int(value)
                elif key == 'userId':
                    value = ObjectId(value)
                data.update({key: value})
            dbrv = Patrol._collection_point.update({'_id': data.get('_id')}, {'$set': data}, True)
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
                dbrv = Patrol._collection_point.update({'_id': ObjectId(pointId),
                                                        'projId': int(projId)}, {'$set': {'status': 0}}, True)
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
                data.update({'_id': ObjectId(data.get('_id')), 'projId': int(projId)})
            else:
                data.update({'_id': ObjectId(), 'projId': int(projId)})
            for key in data:
                value = data.get(key)
                if key == 'sex' or key == 'status' or key == 'projId':
                    if not isinstance(value, int):
                        value = int(value)
                elif key.endswith('Time'):
                    value = datetime.strptime(value, '%Y-%m-%d %H:%M:%S')
                data.update({key: value})
            dbrv = Patrol._collection_executor.update({'_id': data.get('_id')}, {'$set': data}, True)
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
                dbrv = Patrol._collection_executor.update({'_id': ObjectId(executorId),
                                                           'projId': int(projId)}, {'$set': {'status': 0}}, True)
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
            cursor_1 = Patrol._collection_point.find({'projId': projId})
            for item in cursor_1:
                try:
                    cursor_2 = Patrol._collection_path.find({'path': item.get('_id').__str__(), 'projId': projId})
                    item.update({'arrPaths': []})
                    for i in cursor_2:
                        item.get('arrPaths').append({'_id': i.get('_id').__str__(), 'name': i.get('name')})
                    if isinstance(item.get('lastTime'), datetime):
                        rt.append({'_id': item.get('_id').__str__(), 'name': item.get('name'),
                                   'codeQR': item.get('codeQR'),
                                   'type': item.get('type'), 'content': item.get('content'),
                                   'lastTime': item.get('lastTime').strftime('%Y-%m-%d %H:%M:%S'),
                                   'status': item.get('status'),
                                   'arrPaths': item.get('arrPaths')})
                    else:
                        rt.append({'_id': item.get('_id').__str__(), 'name': item.get('name'),
                                   'codeQR': item.get('codeQR'),
                                   'type': item.get('type'), 'content': item.get('content'),
                                   'lastTime': '', 'status': item.get('status'),
                                   'arrPaths': item.get('arrPaths')})
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
            cursor_1 = Patrol._collection_path.find({'projId': projId, 'path': pointId})
            list_1 = list(cursor_1)
            for item in list_1:
                cursor_2 = Patrol._collection_point.find({'_id': {'$in': [ObjectId(x) for x in item.get('path')]}})
                list_2 = list(cursor_2)
                path = []
                for p in item.get('path'):
                    for i in list_2:
                        if p == i.get('_id').__str__():
                            path.append({'_id': i.get('_id').__str__(), 'name': i.get('name')})
                rt.append({'_id': item.get('_id').__str__(), 'name': item.get('name'), 'elapse': item.get('elapse'),
                           'path': path, 'timeRange': '%i %+i' % (item.get('time_down', -30), item.get('time_up', 30))})
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
            if not isinstance(projId, int):
                projId = int(projId)
            cursor_1 = Patrol._collection_path.find({'projId': projId}, sort=[('sort', 1)])
            for item in cursor_1:
                try:
                    cursor_2 = Patrol._collection_point.find({'_id': {'$in': [ObjectId(x) for x in item.get('path') if ObjectId.is_valid(x)]}})
                    point_dict = {}
                    for i in cursor_2:
                        point_dict.update({i.get('_id').__str__(): i.get('name')})
                    rt.append({'_id': item.get('_id').__str__(), 'name': item.get('name'), 'elapse': item.get('elapse'),
                               'path': [{'_id': x, 'name': point_dict.get(x)} for x in item.get('path')],
                               'status': item.get('status'), 'sort': item.get('sort'),
                               'timeRange': '%i %+i' % (item.get('time_down', -30), item.get('time_up', 30))})
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
            cursor = Patrol._collection_executor.find({'projId': projId})
            for item in cursor:
                try:
                    rt.append({'_id': item.get('_id').__str__(), 'code': item.get('code'), 'name': item.get('name'),
                               'status': item.get('status'), 'sex': item.get('sex'),
                               'department': item.get('department'), 'projId': item.get('projId')})
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
                cursor = Patrol._collection_mission.find({'projId': projId, 'startTime': {'$lte': endTime}},
                                                         skip=n * limit, limit=limit, sort=[('startTime', -1)])
                list_1 = list(cursor)
                for item in list_1:
                    if item.get('startTime') < startTime:
                        if item.get('startTime') + timedelta(days=int(item.get('interval'))) <= startTime:
                            if startTime - timedelta(days=int(item.get('interval'))) < datetime.now():
                                n = -1
                                if not rt:
                                    c = startTime - item.get('startTime')
                                    s = c.days // int(item.get('interval'))
                                    st = item.get('startTime') + timedelta(days=s * int(item.get('interval')))
                                    new_mission = {'_id': ObjectId(), 'projId': item.get('projId'), 'startTime': st,
                                                   'interval': item.get('interval'), 'option': item.get('option'),
                                                   'lastModified': datetime.now(),
                                                   'lastModifiedUser': request.cookies.get('userId', None)}
                                    dbrv = Patrol._collection_mission.update({'_id': new_mission.get('_id')},
                                                                             {'$set': new_mission}, True)
                                    if dbrv.get('ok'):
                                        logging.error('get_patrol_mission_list_by_projId debug missionId: ' + new_mission.get("_id").__str__())
                                        logging.error('get_patrol_mission_list_by_projId debug startTime: ' + startTime.strftime('%Y-%m-%d %H:%M:%S'))
                                        logging.error('get_patrol_mission_list_by_projId debug endTime: ' + endTime.strftime('%Y-%m-%d %H:%M:%S'))
                                        new_mission.update({'_id': new_mission.get('_id').__str__(),
                                                            'startTime': new_mission.get('startTime').strftime('%Y-%m-%d %H:%M:%S')})
                                        rt.append(new_mission)
                            break
                    rt.append({'_id': item.get('_id').__str__(), 'projId': item.get('projId'),
                               'startTime': item.get('startTime').strftime('%Y-%m-%d %H:%M:%S'),
                               'interval': item.get('interval'), 'option': item.get('option')})
                if not list_1:
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
        p_i = data.get('_id').__str__()
        try:
            for key in data:
                value = data.get(key)
                if key == 'interval' or key == 'projId':
                    value = int(value)
                elif key == 'startTime':
                    value = datetime.strptime(value, '%Y-%m-%d')
                elif key == 'projId':
                    value = int(value)
                data.update({key: value})
            if ObjectId.is_valid(p_i):
                data.update(
                    {
                        '_id': ObjectId(p_i)
                    }
                )
            else:
                iiiiiid = cls.get_patrol_mission_id(projId, data)
                if iiiiiid:
                    data.update(
                        {
                            '_id': ObjectId(iiiiiid)
                        }
                    )
                else:
                    rt = '开始时间选择错误'
                    raise Exception(rt)
            data.update({'lastModified': datetime.now(), 'lastModifiedUser': request.cookies.get('userId', None)})

            if data is not None:
                dbrv = Patrol._collection_mission.update({'_id': data.get('_id')}, {'$set': data}, True)
                if dbrv.get('ok'):
                    logging.info('Post mission ID: %s, Updat mission ID: %s', p_i, data.get("_id"))
                    rt = data.get('_id').__str__()
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    @classmethod
    def get_patrol_mission_id(cls, projId, data):
        """
        David 20180123
        """
        rt = None
        cursor = None
        try:
            n = 0
            limit = 100
            while n >= 0:
                cursor = Patrol._collection_mission.find(
                    {
                        'projId': int(projId)
                    },
                    skip = n * limit,
                    limit = limit,
                    sort = [
                        ('startTime', -1)
                    ]
                )
                list_1 = list(cursor)
                for item in list_1:
                    s_t = item.get('startTime')
                    interval = item.get('interval')
                    if s_t == data.get('startTime'):
                        rt = item.get('_id')
                        break
                    elif s_t > data.get('startTime'):
                        if s_t < data.get('startTime') + timedelta(days=int(data.get('interval'))):
                            n = -1
                            break
                        else:
                            continue
                    elif s_t < data.get('startTime'):
                        c = data.get('startTime') - s_t
                        if c.days >= int(interval):
                            rt = ObjectId()
                            break
                        else:
                            n = -1
                            break
                if rt:
                    n = -1
                if not list_1:
                    n = -1
                if n >= 0:
                    n = n + 1
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def save_patrol_missionlog(cls, data):
        rt = ''
        initial = True
        # 如果获取到planDate则不进行初始化操作
        if data.get('planDate') and isinstance(data.get('planDate'), str):
            initial = False
            try:
                if len(data.get('planDate')) > 20:
                    print("planDate is a ISODate")
                    planDate = data.get('planDate')
                    plan_date = planDate.split('T')[0]
                    plan_time = planDate.split('T')[1].split('.')[0]
                    planDate = plan_date + ' ' + plan_time
                    data.update({'planDate': planDate})
            except Exception as e:
                logging.error('save_patrol_missionlog error: translate ISODate' + e.__str__())
        try:
            data.update({'_id': ObjectId(data.get('_id')) if ObjectId.is_valid(data.get('_id')) else ObjectId(),
                         'executorId': ObjectId(data.get('executorId')) if ObjectId.is_valid(data.get('executorId')) else None,
                         'pathId': ObjectId(data.get('pathId')) if ObjectId.is_valid(data.get('pathId')) else None,
                         'missionId': ObjectId(data.get('missionId')) if ObjectId.is_valid(data.get('missionId')) else None,
                         'startTime': datetime.strptime(data.get('startTime'), '%Y-%m-%d %H:%M:%S') if isinstance(data.get('startTime'), str) \
                                                                                                    else datetime.now(),
                         'endTime': datetime.strptime(data.get('endTime'), '%Y-%m-%d %H:%M:%S') if isinstance(data.get('endTime'), str) \
                                                                                                else datetime.now(),
                         'submitTime': datetime.now(),
                         'state': int(data.get('state')) if data.get('state') is not None else 0,
                         'projId': int(data.get('projId')) if data.get('projId') is not None else None,
                         'planDate': datetime.strptime(data.get('planDate'), '%Y-%m-%d %H:%M:%S') if isinstance(data.get('planDate'), str) \
                                                                                                  else datetime.now()})
            if initial:
                try:
                    temp_startTime = datetime.strftime(data.get('startTime'), "%Y-%m-%d %H:%M:%S")
                    temp_startTime = temp_startTime.split(" ")[0] + " " + data.get('planTime', "00:00") + ":00"
                    temp_startTime = datetime.strptime(temp_startTime, '%Y-%m-%d %H:%M:%S')
                    data.update({'planDate': temp_startTime})
                except Exception as e:
                    logging.error('save_patrol_missionlog error:' + e.__str__())
            dbrv = Patrol._collection_missionlog.update({'_id': data.get('_id')}, {'$set': data}, True)
            if dbrv.get('ok'):
                rt = data.get('_id').__str__()
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    @classmethod
    def save_patrol_missionlog_cache(cls, data):
        rt = ''
        try:
            data.update({'_id': ObjectId(data.get('_id')) if ObjectId.is_valid(data.get('_id')) else ObjectId(),
                         'projId': -1})
            dbrv = Patrol._collection_missionlog.update({'_id': data.get('_id')}, {'$set': data}, True)
            if dbrv.get('ok'):
                rt = data.get('_id').__str__()
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    @classmethod
    def calculate_the_percentage_from_list(cls, lis):
        rt = ''
        try:
            a = lis.count(1)
            b = lis.count(0) + lis.count(1) + lis.count(2)
            if b != 0:
                rt = "%.2f%%" % (a/b*100)
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    @classmethod
    def calculate_the_percentage_from_list_for_kaineng(cls, lis, pointNum):
        rt = ''
        try:
            a = lis.count(1) * int(pointNum)
            b = (lis.count(0) + lis.count(1) + lis.count(2)) * int(pointNum)
            if b != 0:
                rt = "%.2f%%" % (a/b*100)
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    @classmethod
    def get_patrol_report_baseon_man(cls, projId, startTime, endTime):
        """
        David 20160914 rewrite
        :param projId:
        :param startTime:
        :param endTime:
        :return:
        """
        rt = {'time': [], 'data': []}
        cursor = None
        try:
            startTime = datetime.strptime(startTime, '%Y-%m-%d')
            endTime = datetime.strptime(endTime, '%Y-%m-%d')
            if endTime >= datetime.now():
                endTime = datetime.strptime(datetime.now().strftime('%Y-%m-%d'), '%Y-%m-%d')
            # 获取段时间内的mission列表
            mission_list = cls.get_patrol_mission_list_by_projId(projId, startTime, endTime)
            mission_list.reverse()
            cursor = cls._collection_missionlog.find({'missionId': {'$in': [ObjectId(x.get('_id')) for x in mission_list if ObjectId.is_valid(x.get('_id'))]}})
            # 段时间内所有的日志列表
            missionlog_list = list(cursor)
            # 段时间内mission中涉及的人员信息
            executor_data = {}  # 记录排班计划中所有人员信息
            for mission in mission_list:
                # option： 排班计划中的排班内容  {'pathId':{'09:00': ['executorId'],'16:00': ['executorId']}}
                option = mission.get('option')
                if option:
                    # pathId
                    for pathId in option.keys():
                        # pd {'09:00': ['executorId'],'16:00': ['executorId']}
                        pd = option.get(pathId)
                        for pt in pd.keys():
                            elist = pd.get(pt)
                            for executorId in elist:
                                if executorId not in executor_data.keys():
                                    executor_data.update({executorId: {'name': None, 'data': [], 'log': []}})
            ptime = startTime
            while ptime <= endTime:
                rt.get('time').append(ptime.strftime('%Y-%m-%d'))
                # p executorId
                for p in executor_data:
                    executor_data.get(p).get('data').append(None)
                for mission in mission_list:
                    option = mission.get('option')
                    # 判断当天需要巡更的人员
                    x = rt.get('time').index(ptime.strftime('%Y-%m-%d'))
                    if datetime.strptime(mission.get('startTime'), '%Y-%m-%d %H:%M:%S') <= ptime:
                        if option:
                            c = ptime - datetime.strptime(mission.get('startTime'), '%Y-%m-%d %H:%M:%S')
                            n = c.days % mission.get('interval')
                            # 对missionlog进行分类
                            for missionlog in missionlog_list:
                                planDate = missionlog.get('planDate', missionlog.get('startTime'))
                                if not isinstance(planDate, datetime):
                                    planDate = datetime.strptime(planDate, '%Y-%m-%d %H:%M:%S')
                                # 找到当天的missionlog
                                if ptime.date() == planDate.date():
                                    executor_data.get(missionlog.get('executorId').__str__()).get('data')[x] = 2
                                    missionlog_path = missionlog.get('path')
                                    if cls.judge_missionlog_path(missionlog_path):
                                        pt = ptime.strftime('%Y-%m-%d') + missionlog.get('planTime') + missionlog.get('pathId').__str__()
                                        if pt not in executor_data.get(missionlog.get('executorId').__str__()).get('log'):
                                            executor_data.get(missionlog.get('executorId').__str__()).get('log').append(pt)
                            # 当天人员完成的巡更路线数量
                            for e in executor_data.keys():
                                # executor_data.get(e).get('data') ： None 当天没有巡更任务，0 没有巡更，1 巡更完成， 2 巡更部分完成
                                if executor_data.get(e).get('data')[x] == 2:    # 存在missionlog  区分 巡更完成和巡更部分完成
                                    k = 0
                                    for pathId in option:
                                        plandata = option.get(pathId)
                                        for planTime in plandata:
                                            if plandata.get(planTime)[n] == e.__str__():
                                                k = 1
                                                if ptime.strftime('%Y-%m-%d') + planTime + pathId not in executor_data.get(e).get('log'):
                                                    # 计划中存在没有完成的路线，当天的报表记为 部分完成 跳出循环，计算下一个人员
                                                    executor_data.get(e).get('data')[x] = 2
                                                    k = 2
                                                    break
                                        if k == 2:
                                            break
                                    if k == 0:
                                        executor_data.get(e).get('data')[x] = 2
                                    elif k == 1:
                                        executor_data.get(e).get('data')[x] = 1
                                elif executor_data.get(e).get('data')[x] is None:   # 不存在missionlog 区分 没有巡更任务和没有巡更
                                    k = None
                                    for pathId in option:
                                        plandata = option.get(pathId)
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
            # 获取人员信息
            cursor = cls._collection_executor.find({'_id': {'$in': [ObjectId(t) for t in executor_data.keys() if ObjectId.is_valid(t)]}},
                                                   sort=[('sort', 1), ('name', 1)])
            executor_list = list(cursor)
            for item in executor_list:
                if item.get('_id').__str__() in executor_data.keys():
                    rt.get('data').append({'exectorId': item.get('_id').__str__(), 'name': item.get('name'),
                                           'partment': item.get('department'),
                                           'data': executor_data.get(item.get('_id').__str__()).get('data'),
                                           'status': item.get('status'),
                                           'percent': cls.calculate_the_percentage_from_list(executor_data.get(item.get('_id').__str__()).get('data'))})
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def judge_missionlog_path(cls, missionlog_path):
        """
        David 20160917
        :param missionlog_path:
        :return: rt = 0 表示存在跳过的节点
                 rt = 1 表示全部按计划完成
        """
        rt = 0
        try:
            for point in missionlog_path:
                if point.get('error') == 2:
                    rt = 0
                    break
                rt = 1
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    @classmethod
    def get_patrol_report_baseon_path(cls, projId, startTime, endTime):
        """
        David 20160918 rewrite
        :param projId:
        :param startTime:
        :param endTime:
        :return:
        """
        rt = {'time': [], 'data': []}
        cursor = None
        try:
            startTime = datetime.strptime(startTime, '%Y-%m-%d')
            endTime = datetime.strptime(endTime, '%Y-%m-%d')
            if endTime >= datetime.now():
                endTime = datetime.strptime(datetime.now().strftime('%Y-%m-%d'), '%Y-%m-%d')
            # 获取段时间内所有的mission列表
            mission_list = cls.get_patrol_mission_list_by_projId(projId, startTime, endTime)
            mission_list.reverse()
            cursor = cls._collection_missionlog.find({'missionId': {'$in': [ObjectId(x.get('_id')) for x in mission_list if ObjectId.is_valid(x.get('_id'))]}})
            # 段时间内的missionlog列表
            missionlog_list = list(cursor)
            # 获取mission中涉及到的巡更path
            path_data = {}
            for mission in mission_list:
                # option： 排班计划中的排班内容  {'pathId':{'09:00': ['executorId'],'16:00': ['executorId']}}
                option = mission.get('option')
                if option:
                    for pathId in option:
                        if pathId not in path_data.keys():
                            path_data.update({pathId: {'name': None, 'data': [], 'log': []}})
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
                            # 将mission中的option逐个和当天的日志进行比对，当planTime相同时，path_data【log】.append(ptime)
                            for missionlog in missionlog_list:
                                planDate = missionlog.get('planDate', missionlog.get('startTime'))
                                if not isinstance(planDate, datetime):
                                    planDate = datetime.strptime(planDate, '%Y-%m-%d %H:%M:%S')
                                # 找到当天的missionlog
                                if planDate.date() == ptime.date():
                                    # pid  pathId in missionlog
                                    pid = missionlog.get('pathId')
                                    path_data.get(pid.__str__()).get('data')[x] = 2
                                    if pid.__str__() in option:
                                        # pot  {'09:00': ['executorId'], '16:00': ['executorId']}
                                        pot = option.get(pid.__str__())
                                        if missionlog.get('planTime') in pot.keys():
                                            missionlog_path = missionlog.get('path')
                                            if cls.judge_missionlog_path(missionlog_path):
                                                pt = ptime.strftime('%Y-%m-%d') + missionlog.get('planTime')
                                                path_data.get(pid.__str__()).get('log').append(pt)
                            # 计算当天每条路线巡更的次数，和option中每条路线计划巡更的次数进行比对
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
                                    if k is None:
                                        path_data.get(pathId).get('data')[x] = None
                                elif path_data.get(pathId).get('data')[x] is None:
                                    for pl in pdata.keys():
                                        if pdata.get(pl)[n] is not None:
                                            path_data.get(pathId).get('data')[x] = 0
                ptime = ptime + timedelta(days=1)
            if cursor:
                cursor.close()
            # 获取报表中每条路线的路线名
            cursor = cls._collection_path.find({'_id': {'$in': [ObjectId(p) for p in path_data.keys() if ObjectId.is_valid(p)]}},
                                               sort=[('sort', 1), ('name', 1)])
            for item in cursor:
                if item.get('_id').__str__() in path_data.keys():
                    rt.get('data').append({'pathId': item.get('_id').__str__(), 'name': item.get('name'),
                                           'status': item.get('status'),
                                           'data': path_data.get(item.get('_id').__str__()).get('data')})
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
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
            path = cls._collection_path.find_one({'_id': ObjectId(pathId)})
            # 获取段时间内的mission
            mission_list = cls.get_patrol_mission_list_by_projId(int(projId), pTime, pTime)
            cursor = cls._collection_missionlog.find({'projId': int(projId), 'pathId': ObjectId(pathId),
                                                      'missionId': {'$in': [ObjectId(m.get('_id')) for m in mission_list if ObjectId.is_valid(m.get('_id'))]},
                                                      '$or': [{'planDate': {'$gte': pTime, '$lt': pTime + timedelta(days=1)}},
                                                              {'startTime': {'$gte': pTime, '$lt': pTime + timedelta(days=1)}}]})
            # 段时间内的mission涉及到的missionlog列表
            missionlog_list = list(cursor)
            if cursor:
                cursor.close()
            #
            point_data = {}
            cursor = cls._collection_point.find({'_id': {'$in': [ObjectId(po) for po in path.get('path') if ObjectId.is_valid(po)]}})
            for item in cursor:
                point_data.update({item.get('_id').__str__(): item.get('name')})
            data = [{'point': point_data.get(pp), 'time': None, 'error': -2, 'msg': None,
                     'arrPic': None, 'step': 0} for pp in path.get('path')]
            if cursor:
                cursor.close()
            executor_data = {}
            cursor = cls._collection_executor.find({'projId': int(projId)})
            for ei in cursor:
                executor_data.update({ei.get('_id').__str__(): ei.get('name')})
            for mission in mission_list:
                option = mission.get('option')
                if option:
                    if pathId in option.keys():
                        pdata = option.get(pathId)
                        for p in pdata.keys():
                            c = pTime - datetime.strptime(mission.get('startTime'), '%Y-%m-%d %H:%M:%S')
                            x = c.days % mission.get('interval')
                            if pdata.get(p)[x] is not None:
                                rt.append({'path': {pathId: path.get('name')}, 'executor': {pdata.get(p)[x]: executor_data.get(pdata.get(p)[x])},
                                           'startTime': None, 'endTime': None, 'planTime': p, 'data': data, 'state': None,
                                           'submitTime': None, 'isOnline': None, 'gps': None})
                            for missionlog in missionlog_list:
                                try:
                                    if not missionlog.get('planDate'):
                                        missionlog.update({'planDate': missionlog.get('startTime')})
                                    if missionlog.get('planDate').date() == pTime.date():
                                        if missionlog.get('missionId').__str__() == mission.get('_id') and missionlog.get('planTime') == p:
                                            data_1 = copy.deepcopy(data)
                                            for n in range(len(missionlog.get('path'))):
                                                if missionlog.get('path')[n].get('error') != -1:
                                                    if data[n].get('point') == missionlog.get('path')[n].get('name'):
                                                        data_1[n].update({'time': missionlog.get('path')[n].get('time'),
                                                                          'error': missionlog.get('path')[n].get('error'),
                                                                          'msg': missionlog.get('path')[n].get('msg'),
                                                                          'arrPic': missionlog.get('path')[n].get('arrPic'),
                                                                          'gps': missionlog.get('path')[n].get('gps'),
                                                                          'step': missionlog.get('path')[n].get('step') if isinstance(missionlog.get('path')[n].get('step'), int) else 0})
                                                else:
                                                    data_1[n].update({'point': missionlog.get('path')[n].get('name'),
                                                                      'time': missionlog.get('path')[n].get('time'),
                                                                      'error': missionlog.get('path')[n].get('error'),
                                                                      'msg': missionlog.get('path')[n].get('msg'),
                                                                      'arrPic': missionlog.get('path')[n].get('arrPic'),
                                                                      'gps': missionlog.get('path')[n].get('gps'),
                                                                      'step': missionlog.get('path')[n].get('step') if isinstance(missionlog.get('path')[n].get('step'), int) else 0})
                                            rt[-1].update({'path': {pathId: path.get('name')}, 'executor': {missionlog.get('executorId').__str__(): executor_data.get(missionlog.get('executorId').__str__())},
                                                           'planTime': p, 'startTime': missionlog.get('startTime').strftime('%Y-%m-%d %H:%M:%S') if isinstance(missionlog.get('startTime'), datetime) else None,
                                                           'endTime': missionlog.get('endTime').strftime('%Y-%m-%d %H:%M:%S') if isinstance(missionlog.get('endTime'), datetime) else None,
                                                           'data': data_1, 'state': missionlog.get('state'),
                                                           'submitTime': missionlog.get('submitTime').strftime('%Y-%m-%d %H:%M:%S') if isinstance(missionlog.get('submitTime'), datetime) else None,
                                                           'isOnline': missionlog.get('isOnline'), 'missionId': missionlog.get('missionId').__str__(),
                                                           'gps': missionlog.get('gps'),
                                                           'step': sum([s.get('step') for s in data_1 if isinstance(s, dict)])})
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
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def get_patrol_executorName_by_idlist(cls, idlist):
        rt = {}
        cursor = None
        try:
            cursor = Patrol._collection_executor.find({'_id': {'$in': [ObjectId(i) for i in idlist if ObjectId.is_valid(i)]}})
            for item in cursor:
                rt.update({item.get('_id').__str__(): item.get('name')})
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
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
            path = Patrol._collection_path.find_one({'_id': ObjectId(pathid)})
            if path:
                cursor = Patrol._collection_point.find({'_id': {'$in': [ObjectId(i) for i in path.get('path') if ObjectId.is_valid(i)]}})
                point = []
                for item in cursor:
                    point.append((item.get('_id').__str__(), item.get('name')))
                path.update({'path': point, 'timeRange': '%i %+i' % (path.get('time_down', -30), path.get('time_up', 30))})
                rt.update(path)
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
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
            # 人员信息
            executor = cls._collection_executor.find_one({'_id': ObjectId(executorId)})
            # mission信息
            mission_list = cls.get_patrol_mission_list_by_projId(projId, pTime, pTime)
            cursor = cls._collection_missionlog.find({'projId': int(projId), 'executorId': ObjectId(executorId),
                                                      'missionId': {'$in': [ObjectId(m.get('_id')) for m in mission_list if ObjectId.is_valid(m.get('_id'))]},
                                                      '$or': [{'planDate': {'$gte': pTime, '$lt': pTime + timedelta(days=1)}},
                                                              {'startTime': {'$gte': pTime, '$lt': pTime + timedelta(days=1)}}]})
            # 日志列表
            missionlog_list = list(cursor)
            if cursor:
                cursor.close()
            # 巡更路线信息
            path_dict = {}
            cursor = cls._collection_path.find({'projId': int(projId)})
            for p in cursor:
                path_dict.update({p.get('_id').__str__(): {'name': p.get('name'), 'point': p.get('path')}})
            if cursor:
                cursor.close()
            # 巡更点信息
            point_dict = {}
            cursor = cls._collection_point.find({'projId': int(projId)})
            for pp in cursor:
                point_dict.update({pp.get('_id').__str__(): pp.get('name')})
            for mission in mission_list:
                option = mission.get('option')
                if option:
                    c = pTime - datetime.strptime(mission.get('startTime'), '%Y-%m-%d %H:%M:%S')
                    n = c.days % mission.get('interval')
                    for pathId in option.keys():
                        pathdata = option.get(pathId)
                        for planTime in pathdata:
                            elist = pathdata.get(planTime)
                            # 将mission中涉及到的人员和当天的日志逐个比对
                            if executorId == elist[n]:
                                rt.append({'executor': {executorId: executor.get('name')}, 'path': {pathId: path_dict.get(pathId).get('name')},
                                           'startTime': None, 'endTime': None, 'partment': executor.get('department'),
                                           'planTime': planTime, 'state': None,
                                           'data': [{'point': point_dict.get(poid), 'time': None, 'msg': None, 'error': -2,
                                                     'arrPic': None, 'step': 0} for poid in path_dict.get(pathId).get('point')],
                                           'submitTime': None, 'isOnline': None, 'gps': None})
                                for missionlog in missionlog_list:
                                    try:
                                        if not missionlog.get('planDate'):
                                            missionlog.update({'planDate': missionlog.get('startTime')})
                                        if missionlog.get('planDate').date() == pTime.date():
                                            if missionlog.get('pathId').__str__() == pathId and missionlog.get('planTime') == planTime:
                                                data = copy.deepcopy(rt[-1].get('data'))
                                                for x in range(len(missionlog.get('path'))):
                                                    if missionlog.get('path')[x].get('error') != -1:
                                                        if data[x].get('point') == missionlog.get('path')[x].get('name'):
                                                            data[x].update({'point': point_dict.get(missionlog.get('path')[x].get('_id')),
                                                                            'time': missionlog.get('path')[x].get('time'),
                                                                            'msg': missionlog.get('path')[x].get('msg'),
                                                                            'error': missionlog.get('path')[x].get('error'),
                                                                            'arrPic': missionlog.get('path')[x].get('arrPic'),
                                                                            'gps': missionlog.get('path')[x].get('gps'),
                                                                            'step': missionlog.get('path')[x].get('step') if isinstance(missionlog.get('path')[x].get('step'), int) else 0})
                                                    else:
                                                        data[x].update({'point': missionlog.get('path')[x].get('name'),
                                                                        'time': missionlog.get('path')[x].get('time'),
                                                                        'error': missionlog.get('path')[x].get('error'),
                                                                        'msg': missionlog.get('path')[x].get('msg'),
                                                                        'arrPic': missionlog.get('path')[x].get('arrPic'),
                                                                        'gps': missionlog.get('path')[x].get('gps'),
                                                                        'step': missionlog.get('path')[x].get('step') if isinstance(missionlog.get('path')[x].get('step'), int) else 0})
                                                rt[-1].update({'startTime': missionlog.get('startTime').strftime('%Y-%m-%d %H:%M:%S'),
                                                               'endTime': missionlog.get('endTime').strftime('%Y-%m-%d %H:%M:%S'),
                                                               'data': data, 'state': missionlog.get('state'),
                                                               'submitTime': missionlog.get('submitTime').strftime('%Y-%m-%d %H:%M:%S') if isinstance(missionlog.get('submitTime'), datetime) else None,
                                                               'isOnline': missionlog.get('isOnline'), 'missionId': missionlog.get('missionId').__str__(),
                                                               'gps': missionlog.get('gps'),
                                                               'step': sum([s.get('step') for s in data if isinstance(s, dict)])})
                                    except Exception as e:
                                        pass
            if len(rt) > 0:
                rv = copy.deepcopy(rt)
                rt = []
                l = list(set([plt.get('planTime') for plt in rv]))
                l.sort()
                # for lr in rv:
                #    n = l.index(lr.get('planTime'))
                #    rt[n] = lr
                #    l[n] = None
                for n in l:
                    for r in rv:
                        if r.get('planTime') == n:
                            rt.append(r)
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
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
                cursor = cls._collection_missionlog.find({'projId': projId})
            else:
                startTime = datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S')
                endTime = datetime.strptime(endTime, '%Y-%m-%d %H:%M:%S')
                cursor = cls._collection_missionlog.find({'projId': projId, 'startTime': {'$gte': endTime,
                                                                                          '$lte': startTime}})
            for item in cursor:
                try:
                    if item.get('state') == 2:
                        rt.append({'_id': item.get('_id').__str__(),
                                   'submitTime': item.get('submitTime').strftime('%Y-%m-%d %H:%M:%S') if isinstance(item.get('submitTime'), datetime) else None,
                                   'executorId': item.get('executorId').__str__(), 'isOnline': item.get('isOnline'),
                                   'pathId': item.get('pathId').__str__(),
                                   'startTime': item.get('startTime').strftime('%Y-%m-%d %H:%M:%S') if isinstance(item.get('startTime'), datetime) else None,
                                   'endTime': item.get('endTime').strftime('%Y-%m-%d %H:%M:%S') if isinstance(item.get('endTime'), datetime) else None,
                                   'state': item.get('state'), 'gps': item.get('gps'),
                                   'missionId': item.get('missionId').__str__(), 'planTime': item.get('planTime'),
                                   'path': item.get('path'),
                                   'projId': item.get('projId')})
                    else:
                        path = item.get('path')
                        for p in path:
                            msg = p.get('msg', '') if p.get('msg') is not None else ''
                            arrPic = p.get('arrPic', []) if isinstance(p.get('arrPic'), list) else []
                            if len(msg) > 0 or len(arrPic) > 0:
                                rt.append({'_id': item.get('_id').__str__(),
                                           'submitTime': item.get('submitTime').strftime('%Y-%m-%d %H:%M:%S') if isinstance(item.get('submitTime'), datetime) else None,
                                           'executorId': item.get('executorId').__str__(),
                                           'pathId': item.get('pathId').__str__(), 'isOnline': item.get('isOnline'),
                                           'startTime': item.get('startTime').strftime('%Y-%m-%d %H:%M:%S') if isinstance(item.get('startTime'), datetime) else None,
                                           'endTime': item.get('endTime').strftime('%Y-%m-%d %H:%M:%S') if isinstance(item.get('endTime'), datetime) else None,
                                           'state': item.get('state'), 'gps': item.get('gps'),
                                           'missionId': item.get('missionId').__str__(),
                                           'planTime': item.get('planTime'), 'path': item.get('path'),
                                           'projId': item.get('projId')})
                                break
                except Exception:
                    logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def get_patrol_num_of_log(cls, projId, pathId, pdate=datetime.now()):
        Total_Qty = 0
        Complete_Qty = 0
        cursor = None
        try:
            if isinstance(pdate, datetime):
                ptime = datetime.strptime(pdate.strftime('%Y-%m-%d'), '%Y-%m-%d')
            elif isinstance(pdate, str):
                ptime = datetime.strptime(pdate, '%Y-%m-%d')
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
            cursor = cls._collection_missionlog.find({'projId': int(projId), 'pathId': ObjectId(pathId),
                                                      'planTime': {'$in': plantTime_list},
                                                      'startTime': {'$gte': ptime, '$lt': ptime + timedelta(days=1)}})
            for item in cursor:
                if item.get('pathId').__str__() == pathId:
                    Complete_Qty = Complete_Qty + 1
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        finally:
            if cursor:
                cursor.close()
        return Complete_Qty, Total_Qty

    @classmethod
    def get_patrol_path_complete_num(cls, projId, pdate=datetime.now()):
        rt = []
        cursor = None
        try:
            if isinstance(pdate, datetime):
                ptime = datetime.strptime(pdate.strftime('%Y-%m-%d'), '%Y-%m-%d')
            elif isinstance(pdate, str):
                ptime = datetime.strptime(pdate, '%Y-%m-%d')
            else:
                raise Exception('datetime error')
            # get missionlist
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
                    path_info.update({key.__str__(): {'name': None, 'Total_Qty': None, 'Complete_Qty': 0,
                                                      'plan_list': []}})
                    for item in pathdata:
                        if pathdata.get(item)[x] is not None:
                            Total_Qty = Total_Qty + 1
                            path_info.get(key.__str__()).get('plan_list').append(item)
                    path_info.get(key.__str__()).update({'Total_Qty': Total_Qty})
            cursor = cls._collection_missionlog.find({'projId': int(projId),
                                                      'missionId': {'$in': [ObjectId(y.get('_id')) for y in mission_list]},
                                                      '$or': [{'planDate': ptime},
                                                              {'startTime': {'$gte': ptime, '$lt': ptime + timedelta(days=1)}}]},
                                                     sort=[('startTime', -1)])
            for item in cursor:
                try:
                    if item.get('pathId').__str__() in path_info.keys():
                        if item.get('planTime') in path_info.get(item.get('pathId').__str__()).get('plan_list'):
                            if isinstance(path_info.get(item.get('pathId').__str__()).get('Total_Qty'), int):
                                if path_info.get(item.get('pathId').__str__()).get('Total_Qty') > 0:
                                    path_info.get(item.get('pathId').__str__()).update({
                                        'Complete_Qty': path_info.get(item.get('pathId').__str__()).get('Complete_Qty') + 1})
                                    path_info.get(item.get('pathId').__str__()).get('plan_list').remove(item.get('planTime'))
                except Exception:
                    logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
            if cursor:
                cursor.close()
            dict_path = {}
            cursor = cls._collection_path.find({'_id': {'$in': [ObjectId(x) for x in path_info.keys()]}})
            for item in cursor:
                dict_path.update({item.get('_id').__str__(): item.get('name')})
            for p in path_info.keys():
                if isinstance(path_info.get(p).get('Total_Qty'), int):
                    if path_info.get(p).get('Total_Qty') > 0:
                        rt.append({'_id': p, 'name': dict_path.get(p), 'Total_Qty': path_info.get(p).get('Total_Qty'),
                                   'Complete_Qty': path_info.get(p).get('Complete_Qty'), 'projId': int(projId)})
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def getMissionInfo(cls, projId, dt):
        cursor = None
        try:
            if isinstance(dt, str):
                start = datetime.strptime(dt, '%Y-%m')
            elif isinstance(dt, datetime):
                start = dt
            else:
                raise Exception('datetime error')
            if start > datetime.now():
                return None
            elif start.year == datetime.now().year and start.month == datetime.now().month:
                # 说明当月还没过去
                end = datetime.strptime(datetime.now().strftime("%Y-%m-%d 00:00:00"), "%Y-%m-%d 00:00:00")
            else:
                month = int(start.month)
                if month != 12:
                    yearEnd = start.year
                    monthEnd = month + 1
                else:
                    yearEnd = int(start.year) + 1
                    monthEnd = 1
                end = datetime.strptime(date(year=yearEnd, month=monthEnd, day=1).strftime("%Y-%m-%d 00:00:00"), "%Y-%m-%d 00:00:00")
            rt = cls.get_patrol_mission_list_by_projId(int(projId), start, end)
            new_rt = []
            for info in rt:
                proj = info.get('projId')
                startTime = info.get('startTime')
                interval = info.get('interval')
                option = info.get('option')
                for path, task in option.items():
                    pathId = ObjectId(path)
                    for k, v in task.items():
                        taskTime = k
                        for index, i in enumerate(v):
                            if i is not None and i != '':
                                taskDate = datetime.strptime(startTime, '%Y-%m-%d 00:00:00') + timedelta(days=index)
                                if start <= taskDate < end:
                                    new_rt.append((
                                        ObjectId(i),
                                        pathId,
                                        datetime.strptime((taskDate.strftime('%Y-%m-%d %H:%M:%S').split(' ')[0] + ' ' + taskTime + ':00'),
                                                          '%Y-%m-%d %H:%M:%S'),
                                        proj,
                                    ))

            cursor = Patrol._collection_missionlog.find({'projId': int(projId),
                                                         '$or': [{'planDate': {'$lt': end, '$gte': start}},
                                                                 {'planDate': {'$exists': False},
                                                                  'startTime': {'$lt': end, '$gte': start}}
                                                                ]},
                                                                {'projId': 1,
                                                                 'pathId': 1,
                                                                 'executorId': 1,
                                                                 'planDate': 1,
                                                                 'startTime': 1})
            missionLog_rt = []
            for lg in cursor:
                if lg.get('planDate'):
                    planDate = lg.get('planDate')
                else:
                    startTime = lg.get('startTime').date()
                    planDate = datetime.strptime(str(startTime) + ' ' + lg.get('planTime') + ':00', '%Y-%m-%d %H:%M:%S')

                missionLog_rt.append(
                    (lg.get('executorId'),
                     lg.get('pathId'),
                     planDate,
                     lg.get('projId'))
                )
            # miss, missItem = 0, []
            # for item in new_rt:
            #     if item not in missionLog_rt:
            #         miss += 1
            #         missItem.append(
            #             dict(
            #                 executorId=item[0],
            #                 pathId=item[1],
            #                 planDate=item[2],
            #                 projId=item[3]
            #             )
            #         )
            total_mission = len(set(new_rt))
            # completed = total_mission - miss
            completed = len(
                set(new_rt).intersection(missionLog_rt)
            )
            return total_mission, completed, []
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        finally:
            if cursor:
                cursor.close()

    @classmethod
    def getMonthMissionRate(cls, projId, start, end):
        rt = {}
        dtList = []
        st = start
        ed = end
        if isinstance(st, str):
            startYear = st.split('-')[0]
            startMonth = st.split('-')[1]
            endYear = ed.split('-')[0]
            endMonth = ed.split('-')[1]
            deltaMonth = (int(endYear) - int(startYear))*12 + int(endMonth) - int(startMonth)
            st = datetime.strptime(st, '%Y-%m')
        elif isinstance(st, datetime):
            deltaMonth = int((ed - st).days / 30)
        else:
            raise Exception('getMonthMissionRate error: wrong params!')
        try:
            for i in range(0, deltaMonth+1):
                dt = st + timedelta(days=i*31)
                dtList.append(dt.strftime('%Y-%m'))
            dtList = dtList[:dtList.index(ed)+1]
            for dt in dtList:
                total, complete, info = cls.getMissionInfo(projId, dt)
                rate = int(complete / total * 100) if total != 0 else 0
                rt.update(
                    {
                        dt: {
                            "taskNum": total,
                            "finished": complete,
                            "rate": rate
                        }
                    }
                )
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    @classmethod
    def getSingleMonthMissionRate(cls, projId, dt):
        rt = {}
        try:
            total, complete, info = cls.getMissionInfo(projId, dt)
            rate = int(complete / total * 100) if total != 0 else 0
            rt.update(
                    {
                        "projId": projId,
                        "date": dt,
                        "taskNum": total,
                        "finished": complete,
                        "rate": rate
                    }
            )
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    @classmethod
    def save_log_for_kaineng(cls, projId, post_data):
        insert_data = {'executorName': post_data.get('executorName'),
                       'projId': post_data.get('projId'),
                       'executorId': post_data.get('executorId'),
                       'executorSn': post_data.get('executorSn'),
                       'path': post_data.get('path'),
                       'pathId': ObjectId(post_data.get('pathId')) if ObjectId.is_valid(post_data.get('pathId')) else ObjectId('57fcb487833c972bef140d3e'),
                       'submitTime': datetime.now()}
        if len(post_data.get('path')) > 0:
            startTime = datetime.strptime(post_data.get('path')[0].get('time'), '%Y-%m-%d %H:%M:%S')
            endTime = datetime.strptime(post_data.get('path')[-1].get('time'), '%Y-%m-%d %H:%M:%S')
            insert_data.update({'startTime': startTime, 'endTime': endTime})
            dbrv = MongoConnManager.getConfigConn().mdbBb['Patrol_MissionLog_kaineng'].insert(insert_data)
        if dbrv:
            return post_data.get('ResId')
        return []

    @classmethod
    def kaineng_get_report_baseOnPath(cls, projId, startTime, endTime):
        rt = {'time': [], 'data': []}
        cursor = None
        try:
            startTime = datetime.strptime(startTime, '%Y-%m-%d')
            endTime = datetime.strptime(endTime, '%Y-%m-%d')
            if endTime >= datetime.now():
                endTime = datetime.strptime(datetime.now().strftime('%Y-%m-%d'), '%Y-%m-%d')
            mission_list = cls.get_patrol_mission_list_by_projId(projId, startTime, endTime)
            mission_list.reverse()
            path_data = cls.get_path_for_kaineng(projId)
            conn = MongoConnManager.getConfigConn().mdbBb['Patrol_MissionLog_kaineng']
            cursor = conn.find({'startTime': {'$gt': startTime + timedelta(hours=12)},
                                'endTime': {'$lt': endTime + timedelta(hours=36)},
                                'projId': int(projId),
                                'pathId': {'$in': [ObjectId(x) for x in path_data.keys() if ObjectId.is_valid(x)]}},
                                sort=[('startTime', 1)])
            missionlog_list = list(cursor)
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
                            rt.get('data')
                            for missionlog in missionlog_list:
                                planDate = missionlog.get('planDate', missionlog.get('startTime'))
                                if planDate >= ptime + timedelta(hours=12) and planDate <= ptime + timedelta(hours=36):
                                    pid = missionlog.get('pathId').__str__()
                                    path_data.get(pid.__str__()).get('data')[x] = 2
                                    if pid in option:
                                        pot = option.get(pid.__str__())
                                        plantime = missionlog.get('startTime')
                                        log_path = copy.deepcopy(missionlog.get('path'))
                                        index = missionlog_list.index(missionlog)
                                        if index + 1 < len(missionlog_list):
                                            if missionlog_list[index + 1].get('executorName').rstrip() == missionlog.get('executorName').rstrip():
                                                if missionlog_list[index + 1].get('startTime') <= missionlog.get('endTime') + timedelta(seconds=60 * 60):
                                                    log_path.extend(missionlog_list[index + 1].get('path'))
                                                    missionlog_list[index + 1].update({'path': log_path,
                                                                                       'startTime': missionlog.get('startTime')})
                                                    continue
                                        if plantime.minute > 45:
                                            plantime += timedelta(hours=1)
                                            plantime = plantime.replace(minute=0, second=0, microsecond=0)
                                        elif plantime.minute < 15:
                                            plantime = plantime.replace(hour=plantime.hour, minute=0,
                                                                        second=0, microsecond=0)
                                        else:
                                            plantime = plantime.replace(hour=plantime.hour, minute=0,
                                                                        second=0, microsecond=0)
                                        if plantime.strftime('%H:%M') in pot.keys():
                                            point_names = [i.get('pointName').rstrip() for i in missionlog.get('path')
                                                           if i.get('pointName')]
                                            if cls.judge_log_and_path(path_data.get(pid, {}).get('point'), point_names):
                                                pt = ptime.strftime('%Y-%m-%d') + plantime.strftime('%H:%M')
                                                path_data.get(pid.__str__()).get('log').append(pt)
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
                                    if k is None:
                                        path_data.get(pathId).get('data')[x] = None
                                elif path_data.get(pathId).get('data')[x] is None:
                                    for pl in pdata.keys():
                                        if pdata.get(pl)[n] is not None:
                                            path_data.get(pathId).get('data')[x] = 0
                ptime = ptime + timedelta(days=1)
            for key in path_data.keys():
                value = path_data.get(key)
                rt.get('data').append({'pathId': value.get('pathId'), 'name': value.get('name'),
                                       'data': value.get('data'), 'status': value.get('status')})
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def judge_log_and_path(cls, path_list, log_path):
        rt = False
        ok_num = 0
        for item in path_list:
            if item in log_path:
                ok_num += 1
        if ok_num == len(path_list):
            rt = True
        return rt

    @classmethod
    def get_path_for_kaineng(cls, projId):
        rt = {}
        point_dict = {}
        cursor = None
        try:
            cursor = cls._collection_point.find({'projId': int(projId)})
            for item in cursor:
                point_dict.update({item.get('_id').__str__(): item.get('name')})
            if cursor:
                cursor.close()
            cursor = cls._collection_path.find({'projId': int(projId)})
            for item in cursor:
                pathId = item.get('_id').__str__()
                rt.update({pathId: {'name': item.get('name'),
                                    'pathId': pathId, 'status': item.get('status'),
                                    'point': [point_dict.get(x) for x in item.get('path')],
                                    'data': [], 'log': []}})
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def get_executor_for_kaineng(cls, projId):
        rt = {}
        cursor = None
        try:
            cursor = cls._collection_executor.find({'projId': int(projId)})
            for item in cursor:
                rt.update({item.get('_id').__str__(): {'name': item.get('name'), 'status': item.get('status'),
                                                       'code': item.get('code'), 'department': item.get('department')}})
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def kaineng_get_report_baseOnMan(cls, projId, startTime, endTime):
        rt = {'time': [], 'data': []}
        cursor = None
        try:
            startTime = datetime.strptime(startTime, '%Y-%m-%d')
            endTime = datetime.strptime(endTime, '%Y-%m-%d')
            if endTime >= datetime.now():
                endTime = datetime.strptime(datetime.now().strftime('%Y-%m-%d'), '%Y-%m-%d')
            mission_list = cls.get_patrol_mission_list_by_projId(projId, startTime, endTime)
            mission_list.reverse()
            path_data = cls.get_path_for_kaineng(projId)
            conn = MongoConnManager.getConfigConn().mdbBb['Patrol_MissionLog_kaineng']
            cursor = conn.find({'startTime': {'$gt': startTime + timedelta(hours=12)},
                                'endTime': {'$lt': endTime + timedelta(hours=36)},
                                'projId': int(projId),
                                'pathId': {'$in': [ObjectId(x) for x in path_data.keys() if ObjectId.is_valid(x)]}},
                               sort = [('startTime', 1)])
            missionlog_list = list(cursor)
            executor_data = {}
            user_data = cls.get_executor_for_kaineng(projId)
            for mission in mission_list:
                option = mission.get('option')
                if option:
                    for pathId in option.keys():
                        pd = option.get(pathId)
                        for pt in pd.keys():
                            elist = pd.get(pt)
                            for executorId in elist:
                                if executorId not in executor_data.keys() and executorId:
                                    executor_data.update({user_data.get(executorId, {}).get('name'): {'name': user_data.get(executorId, {}).get('name'),
                                                                                                      'id': executorId,
                                                                                                      'partment': user_data.get(executorId, {}).get('department'),
                                                                                                      'data': [],
                                                                                                      'log': [],
                                                                                                      'status': user_data.get(executorId, {}).get('status'),
                                                                                                      'point': path_data.get(pathId, {}).get('point'),
                                                                                                      'TotalNum': 0,
                                                                                                      'OkNum': 0}})
            ptime = startTime
            while ptime <= endTime:
                rt.get('time').append(ptime.strftime('%Y-%m-%d'))
                for p in executor_data:
                    executor_data.get(p).get('data').append(None)
                for mission in mission_list:
                    option = mission.get('option')
                    x = rt.get('time').index(ptime.strftime('%Y-%m-%d'))
                    c = ptime - datetime.strptime(mission.get('startTime'), '%Y-%m-%d %H:%M:%S')
                    if datetime.strptime(mission.get('startTime'), '%Y-%m-%d %H:%M:%S') <= ptime and c.days < 7:
                        if option:
                            n = c.days % mission.get('interval')
                            for missionlog in missionlog_list:
                                planDate = missionlog.get('planDate', missionlog.get('startTime'))
                                if planDate >= ptime + timedelta(hours=12) and planDate <= ptime + timedelta(hours=36):
                                    executorName = missionlog.get('executorName').rstrip()
                                    pid = missionlog.get('pathId').__str__()
                                    if pid in option:
                                        pot = option.get(pid.__str__())
                                        index = missionlog_list.index(missionlog)
                                        plantime = missionlog.get('startTime')
                                        log_path = copy.deepcopy(missionlog.get('path'))
                                        if index + 1 < len(missionlog_list):
                                            if missionlog_list[index + 1].get('executorName').rstrip() == missionlog.get('executorName').rstrip():
                                                if missionlog_list[index + 1].get('startTime') <= missionlog.get('endTime') + timedelta(seconds=60 * 60):
                                                    log_path.extend(missionlog_list[index + 1].get('path'))
                                                    missionlog_list[index + 1].update({'path': log_path,
                                                                                       'startTime': missionlog.get('startTime')})
                                                    continue
                                        if plantime.minute > 45:
                                            plantime += timedelta(hours=1)
                                            plantime = plantime.replace(minute=0, second=0, microsecond=0)
                                        elif plantime.minute < 15:
                                            plantime = plantime.replace(hour=plantime.hour, minute=0,
                                                                        second=0, microsecond=0)
                                        else:
                                            plantime = plantime.replace(hour=plantime.hour, minute=0,
                                                                        second=0, microsecond=0)
                                        if plantime.strftime('%H:%M') in pot.keys():
                                            ul = pot.get(plantime.strftime('%H:%M'))[n]
                                            if ul is not None:
                                                if executorName == user_data.get(ul).get('name'):
                                                    executor_data.get(executorName).get('data')[x] = 2
                                                    is_ok, is_num = cls.judge_log_and_path_kaineng(executor_data.get(executorName).get('point'),
                                                                              [i.get('pointName').rstrip() for i in missionlog.get('path') if i.get('pointName')])
                                                    TotalNum = len(executor_data.get(executorName).get('point'))
                                                    executor_data.get(executorName)['TotalNum'] += TotalNum
                                                    executor_data.get(executorName)['OkNum'] += is_num
                                                    if is_ok:
                                                        pt = ptime.strftime('%Y-%m-%d') + plantime.strftime('%H:%M') + missionlog.get('pathId').__str__()
                                                        executor_data.get(executorName).get('log').append(pt)
                            for e in executor_data.keys():
                                if executor_data.get(e).get('data')[x] == 2:
                                    k = 0
                                    for pathId in option:
                                        plandata = option.get(pathId)
                                        for planTime in plandata:
                                            ei = plandata.get(planTime)[n]
                                            if ei:
                                                if user_data.get(ei).get('name') == e.__str__():
                                                    if k != 2:
                                                        k = 1
                                                    if ptime.strftime('%Y-%m-%d') + planTime + pathId not in executor_data.get(e).get('log'):
                                                        executor_data.get(e).get('data')[x] = 2
                                                        k = 2
                                                        tpn = path_data.get(pathId, {}).get('point', [])
                                                        executor_data.get(e)['TotalNum'] += len(tpn)
                                        if k == 2:
                                            break
                                    if k == 0:
                                        executor_data.get(e).get('data')[x] = 2
                                    elif k == 1:
                                        executor_data.get(e).get('data')[x] = 1
                                elif executor_data.get(e).get('data')[x] is None:
                                    k = None
                                    for pathId in option:
                                        plandata = option.get(pathId)
                                        for planTime in plandata:
                                            ei = plandata.get(planTime)[n]
                                            if ei:
                                                if user_data.get(ei).get('name') == e.__str__():
                                                    executor_data.get(e).get('data')[x] = 0
                                                    tpn = path_data.get(pathId, {}).get('point', [])
                                                    executor_data.get(e)['TotalNum'] += len(tpn)
                                                    k = 0
                                        if k == 0:
                                            break
                ptime = ptime + timedelta(days=1)
            for key in executor_data:
                value = executor_data.get(key)
                OkNum = value.get('OkNum', 0) if value.get('TotalNum') else 0
                TNum = value.get('TotalNum') if value.get('TotalNum') else 1
                rt.get('data').append({'exectorId': value.get('id'), 'name': value.get('name'),
                                       'status': value.get('status'), 'data': value.get('data'),
                                       'partment': value.get('partment'),
                                       'percent': "%.2f%%" % (OkNum/TNum*100),
                                       'finishPoint': OkNum,
                                       'totalPoint': TNum if value.get('TotalNum') else 0})
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def kaineng_get_log_by_pathId(cls, projId, pathId, pTime):
        rt = []
        rv = []
        cursor = None
        try:
            pTime = datetime.strptime(pTime, '%Y-%m-%d')
            path_dict = cls.get_path_for_kaineng(projId).get(pathId)
            user_data = cls.get_executor_for_kaineng(projId)
            Sn_id_dict = {}
            for us in user_data.keys():
                va = user_data.get(us)
                Sn_id_dict.update({va.get('code'): us})
            if path_dict:
                mission_list = cls.get_patrol_mission_list_by_projId(int(projId), pTime, pTime)
                conn = MongoConnManager.getConfigConn().mdbBb['Patrol_MissionLog_kaineng']
                cursor = conn.find({'startTime': {'$gt': pTime + timedelta(hours=12)},
                                    'endTime': {'$lt': pTime + timedelta(hours=36)},
                                    'projId': int(projId),
                                    'pathId': ObjectId(pathId) if ObjectId.is_valid(pathId) else pathId},
                                    sort=[('startTime', 1)])
                missionlog_list = list(cursor)
                for mission in mission_list:
                    option = mission.get('option')
                    if option:
                        if pathId in option:
                            pdata = option.get(pathId)
                            c = pTime - datetime.strptime(mission.get('startTime'), '%Y-%m-%d %H:%M:%S')
                            x = c.days % mission.get('interval')
                            for p in pdata:
                                eId = pdata.get(p)[x]
                                if eId is not None:
                                    if user_data.get(eId):
                                        rt.append({'path': {pathId: path_dict.get('name')},
                                                   'executor': {pdata.get(p)[x]: user_data.get(eId).get('name')},
                                                   'startTime': None, 'endTime': None, 'planTime': p,
                                                   'data': [{'point': pn, 'time': None, 'error': 2, 'msg': None,
                                                             'arrPic': None, 'step': 0} for pn in path_dict.get('point')],
                                                   'state': None, 'submitTime': None, 'isOnline': None, 'gps': None})
                                for index, missionlog in enumerate(missionlog_list):
                                    try:
                                        plantime = missionlog.get('startTime')
                                        if index + 1 < len(missionlog_list):
                                            missionlog_next = missionlog_list[index + 1]
                                            if missionlog_next.get('executorName').rstrip() == missionlog.get('executorName').rstrip():
                                                if missionlog_next.get('startTime') <= missionlog.get('endTime') + timedelta(seconds=60 * 60):
                                                    l_p = missionlog.get('path', [])
                                                    l_p_next = copy.deepcopy(missionlog_next.get('path', []))
                                                    l_p.extend(l_p_next)
                                                    missionlog_next.update({
                                                        'path': l_p,
                                                        'startTime': missionlog.get('startTime')
                                                    })
                                                    missionlog_list[index] = None
                                                    continue
                                        if plantime.minute > 45:
                                            plantime += timedelta(hours=1)
                                            plantime = plantime.replace(minute=0, second=0, microsecond=0)
                                        elif plantime.minute < 15:
                                            plantime = plantime.replace(hour=plantime.hour, minute=0,
                                                                        second=0, microsecond=0)
                                        else:
                                            plantime = plantime.replace(hour=plantime.hour, minute=0,
                                                                        second=0, microsecond=0)
                                        if plantime.strftime('%H:%M') == p:
                                            pnum = 0
                                            for point in rt[-1].get('data'):
                                                pointName = point.get('point')
                                                log_path = missionlog.get('path')
                                                for log in log_path:
                                                    if log.get('pointName'):
                                                        if pointName == log.get('pointName').rstrip():
                                                            point.update({'time': log.get('time'), 'error': 0})
                                                            pnum += 1
                                                            break
                                            if pnum == len(rt[-1].get('data')):
                                                state = 1
                                            elif pnum < len(rt[-1].get('data')):
                                                state = 2
                                            elif pnum == 0:
                                                state = 0
                                            else:
                                                state = None
                                            rt[-1].update({'startTime': missionlog.get('startTime').strftime('%Y-%m-%d %H:%M:%S'),
                                                           'endTime': missionlog.get('endTime').strftime('%Y-%m-%d %H:%M:%S'),
                                                           'submitTime': missionlog.get('submitTime').strftime('%Y-%m-%d %H:%M:%S'),
                                                           'Sn': missionlog.get('executorSn').rstrip(), 'state': state,
                                                           'executor': {Sn_id_dict.get(missionlog.get('executorSn').rstrip()): missionlog.get('executorName')}})
                                    except Exception as e:
                                        pass
                                while None in missionlog_list:
                                    missionlog_list.remove(None)
            sort_list = ['21:00', '22:00', '23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00']
            if len(rt) > 0:
                for s in sort_list:
                    for r in rt:
                        if r.get('planTime') == s:
                            rv.append(r)
                            break
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        finally:
            if cursor:
                cursor.close()
        return rv

    @classmethod
    def kaineng_get_log_by_executorId(cls, projId, executorId, pTime):
        rt = []
        cursor = None
        try:
            pTime = datetime.strptime(pTime, '%Y-%m-%d')
            path_dict = cls.get_path_for_kaineng(projId)
            user_data = cls.get_executor_for_kaineng(projId).get(executorId)
            if path_dict:
                mission_list = cls.get_patrol_mission_list_by_projId(int(projId), pTime, pTime)
                conn = MongoConnManager.getConfigConn().mdbBb['Patrol_MissionLog_kaineng']
                cursor = conn.find({'startTime': {'$gt': pTime + timedelta(hours=12)},
                                    'endTime': {'$lt': pTime + timedelta(hours=36)},
                                    'projId': int(projId)},
                                   sort = [('startTime', 1)])
                missionlog_list = list(cursor)
                for mission in mission_list:
                    option = mission.get('option')
                    if option:
                        for pathId in option.keys():
                            pdata = option.get(pathId)
                            c = pTime - datetime.strptime(mission.get('startTime'), '%Y-%m-%d %H:%M:%S')
                            x = c.days % mission.get('interval')
                            for p in pdata.keys():
                                eId = pdata.get(p)[x]
                                if eId == executorId:
                                    userName = user_data.get('name')
                                    rt.append({'executor': {executorId: userName},
                                               'path': {pathId: path_dict.get(pathId).get('name')},
                                               'startTime': None, 'endTime': None, 'planTime': p, 'state': None,
                                               'data': [{'point': pn, 'time': None, 'error': 2, 'msg': None,
                                                         'arrPic': None,
                                                         'step': 0} for pn in path_dict.get(pathId).get('point')],
                                               'submitTime': None, 'isOnline': None, 'gps': None})
                                    for missionlog in missionlog_list:
                                        try:
                                            executorName = missionlog.get('executorName').rstrip()
                                            if userName == executorName:
                                                index = missionlog_list.index(missionlog)
                                                plantime = missionlog.get('startTime')
                                                log_path = missionlog.get('path')
                                                if index + 1 < len(missionlog_list):
                                                    if missionlog_list[index + 1].get('executorName').rstrip() == missionlog.get('executorName').rstrip():
                                                        if missionlog_list[index + 1].get('startTime') <= missionlog.get('endTime') + timedelta(seconds=60 * 60):
                                                            log_path.extend(missionlog_list[index + 1].get('path'))
                                                            missionlog_list[index + 1].update({'path': log_path,
                                                                                               'startTime': missionlog.get('startTime')})
                                                            continue
                                                if plantime.minute > 45:
                                                    plantime += timedelta(hours=1)
                                                    plantime = plantime.replace(minute=0, second=0, microsecond=0)
                                                elif plantime.minute < 15:
                                                    plantime = plantime.replace(hour=plantime.hour, minute=0,
                                                                                second=0, microsecond=0)
                                                else:
                                                    plantime = plantime.replace(hour=plantime.hour, minute=0,
                                                                                second=0, microsecond=0)
                                                if plantime.strftime('%H:%M') == p:
                                                    pnum = 0
                                                    for point in rt[-1].get('data'):
                                                        pointName = point.get('point')
                                                        log_path = missionlog.get('path')
                                                        for log in log_path:
                                                            if log.get('pointName'):
                                                                if pointName == log.get('pointName').rstrip():
                                                                    point.update({'time': log.get('time'), 'error': 0})
                                                                    pnum += 1
                                                                    break
                                                    if pnum == len(rt[-1].get('data')):
                                                        state = 1
                                                    elif pnum < len(rt[-1].get('data')):
                                                        state = 2
                                                    elif pnum == 0:
                                                        state = 0
                                                    else:
                                                        state = None
                                                    rt[-1].update({'startTime': missionlog.get('startTime').strftime('%Y-%m-%d %H:%M:%S'),
                                                                   'endTime': missionlog.get('endTime').strftime('%Y-%m-%d %H:%M:%S'),
                                                                   'submitTime': missionlog.get('submitTime').strftime('%Y-%m-%d %H:%M:%S'),
                                                                   'Sn': missionlog.get('executorSn').rstrip(),
                                                                   'state': state})
                                        except Exception as e:
                                            pass
            sort_list = ['21:00', '22:00', '23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00']
            rv = []
            if len(rt) > 0:
                for s in sort_list:
                    for r in rt:
                        if r.get('planTime') == s:
                            rv.append(r)
                            break
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rv

    @classmethod
    def kaineng_get_report_baseOnMan_v2(cls, projId, startTime, endTime):
        rt = {'time': [], 'data': []}
        try:
            startTime = datetime.strptime(startTime, '%Y-%m-%d')
            endTime = datetime.strptime(endTime, '%Y-%m-%d')
            if endTime >= datetime.now():
                endTime = datetime.strptime(datetime.now().strftime('%Y-%m-%d'), '%Y-%m-%d')
            # 获取任务列表
            mission_list = cls.get_patrol_mission_list_by_projId(projId, startTime, endTime)
            mission_list.reverse()  # 反向排序
            # 获取路线信息
            path_data = cls.get_path_for_kaineng(projId)
            ptime = startTime
            while ptime <= endTime:
                rt.get('time').append(ptime.strftime('%Y-%m-%d'))
                ptime += timedelta(days=1)
            time_list = rt.get('time')
            executor_data = {}
            user_data = cls.get_executor_for_kaineng(projId)
            # 生成报表模板
            if time_list:
                for i in time_list:
                    index, mission = cls.get_index_from_mission_by_ptime(mission_list, datetime.strptime(i, '%Y-%m-%d'))
                    option = mission.get('option')
                    for pathId_mission in option.keys():
                        m_p_data = option.get(pathId_mission)
                        for plan_time in m_p_data.keys():
                            e_list = m_p_data.get(plan_time)
                            e = e_list[index]
                            if e:
                                ii = time_list.index(i)
                                if e in executor_data.keys():
                                    executor_data.get(e).get('plan').append(i + ' ' + plan_time + '|' + pathId_mission)
                                else:
                                    executor_data.update({e: {'exectorId': e, 'name': user_data.get(e, {}).get('name'),
                                                              'partment': user_data.get(e, {}).get('partment'),
                                                              'percent': 0, 'status': user_data.get(e, {}).get('status'),
                                                              'executorSn': user_data.get(e, {}).get('code'),
                                                              'data': [None] * len(time_list), 'plan': [i + ' ' +plan_time + '|' + pathId_mission]}})
                                executor_data.get(e).get('data')[ii] = 0
                for ei in executor_data:
                    try:
                        rep_e_data = executor_data.get(ei)
                        executorSn = rep_e_data.get('executorSn')
                        plan = rep_e_data.get('plan')
                        missionLog_list = cls.get_missionlog_by_exectorId_kaineng(executorSn, startTime, endTime, path_data)
                        day_data_dict, point_dict = cls.get_dayData_for_kaineng(plan, path_data)
                        day_data_complete = {}
                        for mis in missionLog_list:
                            mis_startTime = mis.get('startTime')
                            mis_planDate, mis_planTime = cls.get_planTime_from_startTime(mis_startTime)
                            if mis_planDate not in day_data_complete:
                                day_data_complete.update({mis_planDate: 0})
                            if mis_planDate + ' ' + mis_planTime in day_data_dict.get(mis_planDate, []):
                                day_data_complete[mis_planDate] += mis.get('completeNum')
                        for day in day_data_complete:
                            total = point_dict.get(day, 0)
                            complete = day_data_complete.get(day)
                            if total:
                                if total == complete:
                                    rep_e_data['data'][time_list.index(day)] = 1
                                elif total > complete:
                                    rep_e_data['data'][time_list.index(day)] = 2
                                if 'complete' in rep_e_data:
                                    rep_e_data['complete'] += complete
                                else:
                                    rep_e_data.update({'complete': complete})
                        rep_e_data['percent'] = "%.2f%%" % (rep_e_data.get('complete', 0) / sum(point_dict.values()) * 100)
                        rt.get('data').append({'exectorId': rep_e_data.get('id'), 'name': rep_e_data.get('name'),
                                               'status': rep_e_data.get('status'), 'data': rep_e_data.get('data'),
                                               'partment': rep_e_data.get('partment'),
                                               'percent': rep_e_data.get('percent')})
                    except Exception as e:
                        logging.error(e.__str__())
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    @classmethod
    def get_index_from_mission_by_ptime(cls, missionlist, ptime):
        n = None
        m = None
        for mission in missionlist:
            interval = mission.get('interval')
            startTime = datetime.strptime(mission.get('startTime'), '%Y-%m-%d %H:%M:%S')
            if ptime <= startTime + timedelta(days=interval-1):
                n = (ptime - startTime).days
                m = mission
                break
        return n, m

    @classmethod
    def get_missionlog_by_exectorId_kaineng(cls, executorSn, startTime, endTime, path_data):
        cursor = None
        rt = []
        query = {'executorSn': {'$regex': '^' + executorSn + '.*'},
                 'startTime': {'$gt': startTime + timedelta(hours=12), '$lt': endTime + timedelta(hours=36)}}
        sort = [('startTime', 1)]
        try:
            curosr = MongoConnManager.getConfigConn().mdbBb['Patrol_MissionLog_kaineng'].find(query, sort=sort)
            for item in curosr:
                if rt:
                    befor_item = rt[-1]
                    befor_startTime = datetime.strptime(befor_item.get('startTime'), '%Y-%m-%d %H:%M:%S')
                    if item.get('startTime') - befor_startTime < timedelta(hours=1):
                        rt[-1].get('path').extend(item.get('path'))
                        rt[-1].update({'endTime': item.get('endTime').strftime('%Y-%m-%d %H:%M:%S')})
                    else:
                        rt.append({'_id': item.get('_id').__str__(), 'executorName': item.get('executorName').rstrip(),
                                   'pathId': item.get('pathId').__str__(), 'path': item.get('path'),
                                   'startTime':item.get('startTime').strftime('%Y-%m-%d %H:%M:%S'),
                                   'endTime': item.get('endTime').strftime('%Y-%m-%d %H:%M:%S')})
                else:
                    rt.append({'_id': item.get('_id').__str__(), 'executorName': item.get('executorName').rstrip(),
                               'pathId': item.get('pathId').__str__(), 'path': item.get('path'),
                               'startTime':item.get('startTime').strftime('%Y-%m-%d %H:%M:%S'),
                               'endTime': item.get('endTime').strftime('%Y-%m-%d %H:%M:%S')})
                is_complete, ok_num = cls.judge_log_and_path_kaineng(path_data.get(rt[-1].get('pathId')).get('point'),
                                                                     [i.get('pointName').rstrip() for i in rt[-1].get('path') if i.get('pointName')])
                if is_complete:
                    rt[-1].update({'state': 1, 'completeNum': ok_num})
                else:
                    rt[-1].update({'state': 0, 'completeNum': ok_num})
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def judge_log_and_path_kaineng(cls, path_list, log_path):
        rt = False
        ok_num = 0
        for item in path_list:
            if item in log_path:
                ok_num += 1
        if ok_num == len(path_list):
            rt = True
        return rt, ok_num

    @classmethod
    def get_planTime_from_startTime(cls, startTime):
        planTime = ''
        startTime = datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S')
        startHour = startTime.hour
        startMintutes = startTime.minute
        if startHour >= 0 and startHour < 12:
            startTime -= timedelta(days=1)
        if startMintutes >= 45 and startMintutes <= 59:
            planTime = (startTime + timedelta(hours=1)).strftime('%H:00')
        elif startMintutes <= 15:
            planTime = startTime.strftime('%H:00')
        return startTime.strftime('%Y-%m-%d'), planTime

    @classmethod
    def get_dayData_for_kaineng(cls, plan_list, path_data):
        rt = {}
        res = {}
        for p in plan_list:
            p_list = p.split('|')
            p_h = datetime.strptime(p_list[0], '%Y-%m-%d %H:%M').strftime('%Y-%m-%d')
            path = p_list[1]
            total_num = len(path_data.get(path, {}).get('point', []))
            if p_h in rt:
                rt.get(p_h).append(p_list[0])
                res[p_h] += total_num
            else:
                rt.update({p_h: [p_list[0]]})
                res.update({p_h: total_num})
        return rt, res