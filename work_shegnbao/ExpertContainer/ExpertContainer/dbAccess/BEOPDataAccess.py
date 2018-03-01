__author__ = 'David'

from ExpertContainer import app
import logging, math
from bson import ObjectId
from ExpertContainer.dbEntery.BEOPMySqlDBReadOnlyContainer import *
from ExpertContainer.dbAccess.BEOPMongoDataAccess import *
from ExpertContainer.dbEntery.BEOPMySqlDBContainer import *
from math import floor as math_floor, ceil as math_ceil
from numpy import average, median, std, int16
from ExpertContainer.dbAccess.MongoConnManager import *
from ExpertContainer.api.ArchiveManager import ArchiveManager
from ExpertContainer.api.LogOperator import LogOperator
from ExpertContainer.api.utils import *
from ExpertContainer.dbAccess.RedisManager import RedisManager

g_leapMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
g_NonLeapMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]


def isLeap(nYear):
    return (nYear % 4 == 0 and nYear % 100 != 0) or (nYear % 400 == 0)


class BEOPDataAccess:
    __instance = None
    _mysqlDBContainer = BEOPMySqlDBContainer()
    _mysqlDBContainerReadOnly = BEOPMySqlDBReadOnlyContainer()
    _projectInfoList = []
    _projectLocateMap = {}
    _logger = LogOperator()

    def __init__(self):
        pass

    @classmethod
    def getInstance(cls):
        if (cls.__instance == None):
            cls.__instance = BEOPDataAccess()
        return cls.__instance

    def crossClusterUpdate(self, write_action):
        BEOPDataAccess._mysqlDBContainer.op_db_cross_cluster_update(write_action)

    def getProjMysqldb(self, id):
        rt = None
        try:
            ret = self.findProjectInfoItemById(id)
            if ret:
                rt = ret['mysqlname']
            else:
                BEOPDataAccess._logger.writeLog(
                    'getProjMysqldb:projId=%s is not in memcache,get info from mysql,and insert into memcache' % (id,),
                    True)
                dbname = app.config.get('DATABASE')
                strQ = 'select mysqlname, name_en, s3dbname, collectionname from project where id=%s'
                dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strQ, (id,))
                if not dbrv:
                    BEOPDataAccess._logger.writeLog('getProjMysqldb:projId=%s is not in mysql' % (id,), True)
                    rt = None
                else:
                    if dbrv[0]:
                        projectInfoList = RedisManager.get_project_info_list()
                        if not projectInfoList:
                            self.UpdateProjectInfo()
                            projectInfoList = RedisManager.get_project_info_list()
                        if projectInfoList:
                            projectInfoList.append(
                                dict(name_en=dbrv[0][1], s3dbname=dbrv[0][2], mysqlname=dbrv[0][0], id=id,
                                     collectionname=dbrv[0][3]))
                            RedisManager.set_project_info_list(projectInfoList)
                            rt = dbrv[0][0]
                        else:
                            BEOPDataAccess._logger.writeLog('getProjMysqldb:projectInfoList is not in memcache', True)
                    else:
                        BEOPDataAccess._logger.writeLog('getProjMysqldb:projId=%s is not in mysql' % (id,), True)
                        rt = None
        except Exception as e:
            BEOPDataAccess._logger.writeLog('getProjMysqldb:getProjMysqldb error:' + e.__str__(), True)
        return rt

    def get_fault_notice_count(self, projId, actTimeStr):
        try:
            dbname = 'diagnosis'
            sql = '''SELECT table_name FROM information_schema.TABLES WHERE table_name LIKE "diagnosis_%_notice" OR table_name LIKE "%diagnosis_notices"'''
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql)
            if dbrv:
                allNoticeDict = {item[0].lower() for item in dbrv}
                table_name = "diagnosis_%s_notice" % str(projId)
                if not table_name in allNoticeDict:
                    mysqlName = self.getProjMysqldb(projId).lower()
                    if mysqlName:
                        table_name = mysqlName + '_diagnosis_notices'
                if table_name in allNoticeDict:
                    curStrSql = 'select count(case when endTime is Null or (endTime > "%s" and Time < "%s") then 1 else null end) as number_cur from %s' % (
                        actTimeStr, actTimeStr, table_name)
                    curNoticerv = self._mysqlDBContainerReadOnly.op_db_query(dbname, curStrSql)
                    return curNoticerv[0][0]
        except Exception as e:
            BEOPDataAccess._logger.writeLog('get_fault_notice_count error:' + e.__str__(), True)
        return None

    def GetCollectionNameById(self, id):
        projectInfoList = RedisManager.get_project_info_list()
        if not projectInfoList:
            self.UpdateProjectInfo()
            projectInfoList = RedisManager.get_project_info_list()
        if projectInfoList:
            for item in projectInfoList:
                if item.get('id') == id:
                    return item.get('collectionname', '')
        else:
            BEOPDataAccess._logger.writeLog('GetCollectionNameById:projectInfoList is not in memcache', True)
        return ''

    def findProjectInfoItemById(self, id):
        try:
            projectInfoList = RedisManager.get_project_info_list()
            if not projectInfoList:
                self.UpdateProjectInfo()
                projectInfoList = RedisManager.get_project_info_list()
                if not projectInfoList:
                    print('findProjectInfoItemById:projectInfoList in memcache is None')
                    BEOPDataAccess._logger.writeLog('findProjectInfoItemById:projectInfoList in memcache is None', True)
                    return None
            for item in projectInfoList:
                if item['id'] == id:
                    return item
        except Exception as e:
            strErr = 'findProjectInfoItemById error:' + e.__str__()
            print(strErr)
            BEOPDataAccess._logger.writeLog(strErr, True)
        return None

    def get_history_data_padded(self, projectId, pointList, strTimeStart, strTimeEnd, strTimeFormat,
                                bSearchNearest=True, nearestDays=None):
        result = []
        # invalid query filter:
        now_time = datetime.now()
        if strTimeStart is None or strTimeEnd is None or strTimeFormat is None:
            BEOPDataAccess._logger.writeLog('get_history_data_padded:invalid params', True)
            result.append(dict(error='time'))
            return result

        startTime = None
        endTime = None
        try:
            startTime = datetime.strptime(strTimeStart, '%Y-%m-%d %H:%M:%S')
            endTime = datetime.strptime(strTimeEnd, '%Y-%m-%d %H:%M:%S')
        except:

            BEOPDataAccess._logger.writeLog('get_history_data_padded:invalid time string', True)
            result.append(dict(error='invalid time string'))
            return result

        if startTime > endTime:
            return [dict(error='error: startTime > endTime ')]
        if endTime > now_time:
            endTime = now_time
        if strTimeFormat == 'm1':
            if (endTime - startTime).days > 7:
                BEOPDataAccess._logger.writeLog(
                    'get_history_data_padded: time range too long for m1 period data query ', True)
                return {'error': 'historyData', 'msg': 'time range is 7 days for m1'}
        elif strTimeFormat == 'm5':
            if (endTime - startTime).days > 14:
                BEOPDataAccess._logger.writeLog(
                    'get_history_data_padded: time range too long for m5 period data query :' + strTimeStart + strTimeEnd,
                    True)
                return {'error': 'historyData', 'msg': 'time range is 14 days for m5'}
        elif strTimeFormat == 'h1':
            if (endTime - startTime).days > 60:
                BEOPDataAccess._logger.writeLog(
                    'get_history_data_padded: time range too long for h1 period data query ', True)
                return {'error': 'historyData', 'msg': 'time range is 60 days for h1'}
        elif strTimeFormat == 'd1':
            if (endTime - startTime).days > 365 * 2:
                BEOPDataAccess._logger.writeLog(
                    'get_history_data_padded: time range too long for d1 period data query ', True)
                return {'error': 'historyData', 'msg': 'time range is 365*2 days for d1'}
        elif strTimeFormat == 'M1':
            pass
        else:

            BEOPDataAccess._logger.writeLog('get_history_data_padded: time period format not supported', True)
            return [dict(error='time period format not supported')]

        rv = self.getHistoryData(projectId, pointList, strTimeStart, strTimeEnd, strTimeFormat, bSearchNearest,
                                 nearestDays)
        if len(rv) == 0:
            return [dict(error='no data history')]
        # mango added to prevent exception
        if type(rv) == type('123'):
            return [dict(error=rv)]
        hisDataDicList = self.padData(rv, strTimeStart, strTimeEnd, strTimeFormat)
        statics = self.staticsData(hisDataDicList)
        try:
            if len(hisDataDicList) == len(statics):
                for i in range(len(hisDataDicList)):
                    result.append({'name': hisDataDicList[i].get('name'), 'history': hisDataDicList[i].get('record'),
                                   'avg': statics[i]['statics']['avgvalue'], 'max': statics[i]['statics']['maxvalue'],
                                   'min': statics[i]['statics']['minvalue'],
                                   'median': statics[i]['statics']['medianvalue'],
                                   'std': statics[i]['statics']['stdvalue']})
        except Exception as e:
            BEOPDataAccess._logger.writeLog(e.__str__(), True)
        return result

    def getHistoryData(self, proj, pointName, timeStart, timeEnd, timeFormat, bSearchNearest=False, nearestDays=None):
        # print('getHistoryData')
        if isinstance(timeStart, str) and isinstance(timeEnd, str):
            start_object = datetime.strptime(timeStart, '%Y-%m-%d %H:%M:%S')
            end_object = datetime.strptime(timeEnd, '%Y-%m-%d %H:%M:%S')
            if start_object > end_object:
                BEOPDataAccess._logger.writeLog('getHistoryData:query time is invalid', True)
                return 'query time is invalid'
        elif isinstance(timeStart, datetime) and isinstance(timeEnd, datetime):
            if timeStart > timeEnd:
                BEOPDataAccess._logger.writeLog('getHistoryData:query time is invalid', True)
                return 'query time is invalid'
        dbname = ''
        try:
            dbname = BEOPDataAccess.getInstance().GetCollectionNameById(int(proj))
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getHistoryData:proj in getHistoryData is not int', True)
        if dbname is None:
            BEOPDataAccess._logger.writeLog('getHistoryData:finding project database failed', True)
            return 'error: finding project database failed'
        connList = MongoConnManager.getHisConnTuple(int(proj))
        return self.mergeHisData(connList, int(proj), pointName, timeStart, timeEnd, timeFormat, bSearchNearest,
                                 nearestDays)

    def mergeHisData(self, connList, projId, pointName, timeStart, timeEnd, timeFormat, bSearchNearest=False,
                     nearestDays=None):
        rt = []
        try:
            def get_minutes(timeObject, timeFormat):
                if timeFormat == 'h1':
                    return timeObject.minute
                if timeFormat == 'd1':
                    return timeObject.hour * 60 + timeObject.minute
                if timeFormat == 'M1':
                    return timeObject.day * 24 * 60 + timeObject.hour * 60 + timeObject.minute
                return None

            dbname = self.getCollectionNameById(projId)
            if dbname:
                if isinstance(connList, list):
                    timeStartObject = datetime.strptime(timeStart, '%Y-%m-%d %H:%M:%S')
                    if timeFormat in ('m5', 'h1', 'd1', 'M1'):
                        if timeStartObject.minute % 5:
                            timeStartObject += timedelta(minutes=(5 - timeStartObject.minute % 5))
                    minutes = get_minutes(timeStartObject, timeFormat)
                    if len(connList) > 0:
                        find_list = self.analysisHisConnection(connList, timeStart, timeEnd)
                        find_list = self.filterConnection(projId, find_list)
                        for item in find_list:
                            if item.get('st') and item.get('et'):
                                conn = item.get('conn')
                                st = item.get('st')
                                if timeFormat in ('m5', 'h1', 'd1', 'M1'):
                                    if st.minute % 5:
                                        st += timedelta(minutes=(5 - st.minute % 5))
                                st_minutes = get_minutes(st, timeFormat)
                                # 防止跨数据库时时间错误
                                if timeFormat in ('h1', 'd1', 'M1'):
                                    if timeFormat == 'h1':
                                        total = 60
                                    elif timeFormat == 'd1':
                                        total = 24 * 60
                                    elif timeFormat == 'M1':
                                        total = calendar.monthrange(st.year, st.month)[1] * 24 * 60
                                    addMinutes = None
                                    if minutes is not None and st_minutes is not None:
                                        if minutes > st_minutes:
                                            addMinutes = minutes - st_minutes
                                        elif minutes < st_minutes:
                                            addMinutes = total + minutes - st_minutes
                                    if addMinutes:
                                        st += timedelta(minutes=(addMinutes))
                                et = item.get('et')
                                flag = item.get('flag', 1)
                                if conn:
                                    item_rt = []
                                    if flag == 1:
                                        item_rt = conn.getHistoryDataByFormat(dbname, pointName,
                                                                              st.strftime('%Y-%m-%d %H:%M:%S'),
                                                                              et.strftime('%Y-%m-%d %H:%M:%S'),
                                                                              timeFormat, bSearchNearest)
                                    elif flag == 2:
                                        item_rt = conn.getHistoryDataByFormat_v2(dbname, pointName,
                                                                                 st.strftime('%Y-%m-%d %H:%M:%S'),
                                                                                 et.strftime('%Y-%m-%d %H:%M:%S'),
                                                                                 timeFormat, bSearchNearest,
                                                                                 nearestDays=nearestDays)
                                    rt = self.mergeReturnData(item_rt, rt)
                else:
                    if connList:
                        rt = connList.getHistoryDataByFormat(dbname, pointName, timeStart, timeEnd, timeFormat,
                                                             bSearchNearest)
        except Exception as e:
            print('mergeHisData error:%s' % (e.__str__(),))
            logging.error('mergeHisData error:%s' % (e.__str__(),))
        return rt

    def filterConnection(self, projId, findConnList):
        seperate_time = self.get_v2_struct_seperate_time(projId)
        if seperate_time:
            seperate_time = datetime.strptime(seperate_time, '%Y-%m-%d %H:%M:%S')
            rt = []
            for item in findConnList:
                st = item.get('st')
                et = item.get('et')
                if st and et:
                    if et < seperate_time:
                        item.update({'flag': 1})
                        rt.append(item)
                    else:
                        if st >= seperate_time:
                            item.update({'flag': 2})
                            rt.append(item)
                        else:
                            rt.append({'conn': item['conn'], 'flag': 1, 'st': item['st'], 'et': seperate_time})
                            rt.append({'conn': item['conn'], 'flag': 2, 'st': seperate_time, 'et': item['et']})
            return rt
        return findConnList

    def mergeReturnData(self, rtData, sourceData):
        if rtData:
            if not sourceData:
                sourceData = rtData
            else:
                for k in rtData:
                    for l in sourceData:
                        if l.get('pointname') == k.get('pointname'):
                            l.get('record').extend(k.get('record'))
                            break
                    else:
                        sourceData.append(k)
        return sourceData

    def analysisHisConnection(self, connList, timeStart, timeEnd):
        q_st = datetime.strptime(timeStart, '%Y-%m-%d %H:%M:%S')
        q_et = datetime.strptime(timeEnd, '%Y-%m-%d %H:%M:%S')
        find_list = []
        for index, conn in enumerate(connList):
            st = conn[1]
            et = conn[2]
            find_dict = {}
            if index > 0:
                # 对前一个对象进行修正，如果有起始时间，没有结束时间的情况，将前一个数据库实例的
                # 结束时间直接赋值给前一个对象
                if find_list[index - 1].get('st') and not find_list[index - 1].get('et'):
                    find_list[index - 1]['et'] = connList[index - 1][2]
            find_dict['conn'] = conn[0]
            if q_st >= st and q_st <= et:  # 查询的起始时间落在该数据库实例的时间区间
                find_dict['st'] = q_st
            if q_et >= st and q_et <= et:  # 查询的结束时间落在该数据库实例的时间区间
                find_dict['et'] = q_et
            if q_st < st and q_et > et:  # 查询的区间要大于数据库实例的时间区间
                find_dict['st'] = st
                find_dict['et'] = et
            if not find_dict.get('st') and find_dict.get('et'):  # 如果没有找到起始时间，可以直接将数据库时间赋值给它
                find_dict['st'] = st
            find_list.append(find_dict)
        return find_list

    def padData(self, data, timeStart, timeEnd, timeFormat):
        rv = []
        tS = datetime.strptime(timeStart, '%Y-%m-%d %H:%M:%S')
        tE = datetime.strptime(timeEnd, '%Y-%m-%d %H:%M:%S')
        tS = tS.replace(second=0)
        tE = tE.replace(second=0)
        if len(data) > 0:
            r = data[0].get('record')
            if r:
                t0 = datetime.strptime(r[0].get('time'), '%Y-%m-%d %H:%M:%S')
                tS = t0 if (t0 - tS).total_seconds() < 0 else tS
                if tE >= tS:
                    if timeFormat == 's5':
                        ts = tS
                        te = tE
                        l = floor((te - ts).total_seconds() / 5) + 1
                        rv = []
                        for index in range(len(data)):
                            temp = []
                            tv = [None] * l
                            vv = [None] * l
                            ev = [False] * l
                            rec = data[index].get('record')
                            if rec:
                                for i in rec:
                                    t = datetime.strptime(i.get('time'), '%Y-%m-%d %H:%M:%S')
                                    if (t - te).total_seconds() <= 0:
                                        s = floor((t - tS).total_seconds() / 5)
                                        if s < l:
                                            tv[s] = t
                                            vv[s] = i.get('value')
                                for i in range(1, l):
                                    if tv[i] is None:
                                        if tv[i - 1] is not None:
                                            tv[i] = tv[i - 1] + timedelta(seconds=5)
                                            vv[i] = vv[i - 1]
                                            ev[i] = True
                                for i in range(l - 1, 0, -1):
                                    if tv[i - 1] is None:
                                        tv[i - 1] = tv[i] - timedelta(seconds=5)
                                        vv[i - 1] = vv[i]
                                        ev[i - 1] = True
                                for x in range(l):
                                    temp.append(
                                        dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S'), value=vv[x], error=ev[x]))
                                rv.append(dict(name=data[index].get('pointname'), record=temp))
                    if timeFormat == 'm1':
                        ts = tS
                        te = tE
                        l = floor((te - ts).total_seconds() / 1 / 60) + 1
                        rv = []
                        for index in range(len(data)):
                            temp = []
                            tv = [None] * l
                            vv = [None] * l
                            ev = [False] * l
                            rec = data[index].get('record')
                            if rec:
                                for i in rec:
                                    t = datetime.strptime(i.get('time'), '%Y-%m-%d %H:%M:%S')
                                    if (t - te).total_seconds() <= 0:
                                        s = floor((t - tS).total_seconds() / 1 / 60)
                                        if s < l:
                                            tv[s] = t
                                            vv[s] = i.get('value')
                                for i in range(1, l):
                                    if tv[i] is None:
                                        if tv[i - 1] is not None:
                                            tv[i] = tv[i - 1] + timedelta(seconds=60 * 1)
                                            vv[i] = vv[i - 1]
                                            ev[i] = True
                                for i in range(l - 1, 0, -1):
                                    if tv[i - 1] is None:
                                        tv[i - 1] = tv[i] - timedelta(seconds=60 * 1)
                                        vv[i - 1] = vv[i]
                                        ev[i - 1] = True
                                for x in range(l):
                                    temp.append(
                                        dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S'), value=vv[x], error=ev[x]))
                                rv.append(dict(name=data[index].get('pointname'), record=temp))
                    if timeFormat == 'm5':
                        ts = tS
                        te = tE
                        l = (int)(floor((te - ts).total_seconds() / 5 / 60) + 1)
                        rv = []
                        for index in range(len(data)):
                            temp = []
                            tv = [None] * l
                            vv = [None] * l
                            ev = [False] * l
                            rec = data[index].get('record')
                            if rec:
                                for i in rec:
                                    t = datetime.strptime(i.get('time'), '%Y-%m-%d %H:%M:%S')
                                    if (t - te).total_seconds() <= 0:
                                        sTemp = (int16)(floor((t - tS).total_seconds() / 5 / 60))
                                        if sTemp < l:
                                            tv[sTemp] = t
                                            vv[sTemp] = i.get('value')
                                for i in range(1, l):
                                    if tv[i] is None:
                                        if tv[i - 1] is not None:
                                            tv[i] = tv[i - 1] + timedelta(seconds=60 * 5)
                                            vv[i] = vv[i - 1]
                                            ev[i] = True
                                for i in range(l - 1, 0, -1):
                                    if tv[i - 1] is None:
                                        tv[i - 1] = tv[i] - timedelta(seconds=60 * 5)
                                        vv[i - 1] = vv[i]
                                        ev[i - 1] = True
                                for x in range(l):
                                    temp.append(
                                        dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S'), value=vv[x], error=ev[x]))
                                rv.append(dict(name=data[index].get('pointname'), record=temp))
                    if timeFormat == 'h1':
                        ts = tS
                        te = tE
                        l = floor((te - ts).total_seconds() / 60 / 60) + 1
                        rv = []
                        for index in range(len(data)):
                            temp = []
                            tv = [None] * l
                            vv = [None] * l
                            ev = [False] * l
                            rec = data[index].get('record')
                            if rec:
                                for i in rec:
                                    t = datetime.strptime(i.get('time'), '%Y-%m-%d %H:%M:%S')
                                    if (t - te).total_seconds() <= 0:
                                        s = floor((t - tS).total_seconds() / 60 / 60)
                                        if s < l:
                                            tv[s] = t
                                            vv[s] = i.get('value')
                                for i in range(1, l):
                                    if tv[i] is None:
                                        if tv[i - 1] is not None:
                                            tv[i] = tv[i - 1] + timedelta(seconds=60 * 60)
                                            vv[i] = vv[i - 1]
                                            ev[i] = True
                                for i in range(l - 1, 0, -1):
                                    if tv[i - 1] is None:
                                        tv[i - 1] = tv[i] - timedelta(seconds=60 * 60)
                                        vv[i - 1] = vv[i]
                                        ev[i - 1] = True
                                for x in range(l):
                                    temp.append(
                                        dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S'), value=vv[x], error=ev[x]))
                                rv.append(dict(name=data[index].get('pointname'), record=temp))
                    if timeFormat == 'd1':
                        ts = tS
                        te = tE
                        l = (te - ts).days + 1
                        rv = []
                        for index in range(len(data)):
                            temp = []
                            tv = [None] * l
                            vv = [None] * l
                            ev = [False] * l
                            rec = data[index].get('record')
                            if rec:
                                for i in rec:
                                    t = datetime.strptime(i.get('time'), '%Y-%m-%d %H:%M:%S')
                                    if (t - te).total_seconds() <= 0:
                                        s = (t - tS).days
                                        if s < l:
                                            tv[s] = t
                                            vv[s] = i.get('value')
                                for i in range(1, l):
                                    if tv[i] is None:
                                        if tv[i - 1] is not None:
                                            tv[i] = tv[i - 1] + timedelta(1)
                                            vv[i] = vv[i - 1]
                                            ev[i] = True
                                for i in range(l - 1, 0, -1):
                                    if tv[i - 1] is None:
                                        tv[i - 1] = tv[i] - timedelta(1)
                                        vv[i - 1] = vv[i]
                                        ev[i - 1] = True
                                for x in range(l):
                                    temp.append(
                                        dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S'), value=vv[x], error=ev[x]))
                                rv.append(dict(name=data[index].get('pointname'), record=temp))
                    if timeFormat == 'M1':
                        ts = tS
                        te = tE
                        l = (te.year - ts.year) * 12 + (te.month - ts.month) + 1
                        # l = (te - ts).days/30 + 1
                        rv = []
                        for index in range(len(data)):
                            temp = []
                            tv = [None] * l
                            vv = [None] * l
                            ev = [False] * l
                            rec = data[index].get('record')
                            if rec:
                                for i in rec:
                                    t = datetime.strptime(i.get('time'), '%Y-%m-%d %H:%M:%S')
                                    if (t - te).total_seconds() <= 0:
                                        s = (t.year - tS.year) * 12 + (t.month - tS.month)
                                        if s < l:
                                            tv[s] = t
                                            vv[s] = i.get('value')
                                for i in range(1, l):
                                    if tv[i] is None:
                                        if tv[i - 1] is not None:
                                            nDay = 30
                                            if tv[i - 1].month >= 1 and tv[i - 1].month <= 11:
                                                if isLeap(tv[i - 1].year):
                                                    nDays = g_leapMonth[tv[i - 1].month - 1]
                                                else:
                                                    nDays = g_NonLeapMonth[tv[i - 1].month - 1]
                                            else:
                                                nDays = 31
                                            tv[i] = tv[i - 1] + timedelta(nDays)
                                            vv[i] = vv[i - 1]
                                            ev[i] = True
                                for i in range(l - 1, 0, -1):
                                    if tv[i - 1] is None:
                                        nDay = 30
                                        if tv[i].month >= 2 and tv[i].month <= 12:
                                            if isLeap(tv[i].year):
                                                nDays = g_leapMonth[tv[i].month - 2]
                                            else:
                                                nDays = g_NonLeapMonth[tv[i].month - 2]
                                        else:
                                            nDays = 31
                                        tv[i - 1] = tv[i] - timedelta(nDays)
                                        vv[i - 1] = vv[i]
                                        ev[i - 1] = True
                                for x in range(l):
                                    temp.append(
                                        dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S'), value=vv[x], error=ev[x]))
                                rv.append(dict(name=data[index].get('pointname'), record=temp))
                else:
                    for item in data:
                        temp = []
                        if len(item.get('record')) == 1:
                            temp.append(
                                dict(time=item.get('record')[0].get('time'),
                                     value=str(item.get('record')[0].get('value')),
                                     error=False))
                        else:
                            temp.append(dict(time=timeStart, value=str(0), error=True))
                        rv.append(dict(name=item.get('pointname'), record=temp))
                        # print('padData end')
        return rv

    def padDataFloat(self, data, timeStart, timeEnd, timeFormat):
        # print('padData start')
        rv = []
        tS = datetime.strptime(timeStart, '%Y-%m-%d %H:%M:%S')
        tE = datetime.strptime(timeEnd, '%Y-%m-%d %H:%M:%S')
        tS = tS.replace(second=0)
        tE = tE.replace(second=0)
        if len(data) > 0:
            r = data[0].get('record')
            if r:
                t0 = datetime.strptime(r[0].get('time'), '%Y-%m-%d %H:%M:%S')
                tS = t0 if (t0 - tS).total_seconds() < 0 else tS
                if tE >= tS:
                    if timeFormat == 's5':
                        ts = tS
                        te = tE
                        l = floor((te - ts).total_seconds() / 5) + 1
                        rv = []
                        for index in range(len(data)):
                            temp = []
                            tv = [None] * l
                            vv = [None] * l
                            ev = [False] * l
                            rec = data[index].get('record')
                            if rec:
                                for i in rec:
                                    t = datetime.strptime(i.get('time'), '%Y-%m-%d %H:%M:%S')
                                    if (t - te).total_seconds() <= 0:
                                        s = floor((t - tS).total_seconds() / 5)
                                        if s < l:
                                            tv[s] = t
                                            try:
                                                vv[s] = float(i.get('value'))
                                            except Exception as e:
                                                vv[s] = 0.0
                                for i in range(1, l):
                                    if tv[i] is None:
                                        if tv[i - 1] is not None:
                                            tv[i] = tv[i - 1] + timedelta(seconds=5)
                                            vv[i] = vv[i - 1]
                                            ev[i] = True
                                for i in range(l - 1, 0, -1):
                                    if tv[i - 1] is None:
                                        tv[i - 1] = tv[i] - timedelta(seconds=5)
                                        vv[i - 1] = vv[i]
                                        ev[i - 1] = True
                                for x in range(l):
                                    temp.append(
                                        dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S'), value=vv[x], error=ev[x]))
                                rv.append(dict(name=data[index].get('pointname'), record=temp))
                    if timeFormat == 'm1':
                        ts = tS
                        te = tE
                        l = floor((te - ts).total_seconds() / 1 / 60) + 1
                        rv = []
                        for index in range(len(data)):
                            temp = []
                            tv = [None] * l
                            vv = [None] * l
                            ev = [False] * l
                            rec = data[index].get('record')
                            if rec:
                                for i in rec:
                                    t = datetime.strptime(i.get('time'), '%Y-%m-%d %H:%M:%S')
                                    if (t - te).total_seconds() <= 0:
                                        s = floor((t - tS).total_seconds() / 1 / 60)
                                        if s < l:
                                            tv[s] = t
                                            try:
                                                vv[s] = float(i.get('value'))
                                            except Exception as e:
                                                vv[s] = 0.0
                                for i in range(1, l):
                                    if tv[i] is None:
                                        if tv[i - 1] is not None:
                                            tv[i] = tv[i - 1] + timedelta(seconds=60 * 1)
                                            vv[i] = vv[i - 1]
                                            ev[i] = True
                                for i in range(l - 1, 0, -1):
                                    if tv[i - 1] is None:
                                        tv[i - 1] = tv[i] - timedelta(seconds=60 * 1)
                                        vv[i - 1] = vv[i]
                                        ev[i - 1] = True
                                for x in range(l):
                                    temp.append(
                                        dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S'), value=vv[x], error=ev[x]))
                                rv.append(dict(name=data[index].get('pointname'), record=temp))
                    if timeFormat == 'm5':
                        ts = tS
                        te = tE
                        l = (int16)(floor((te - ts).total_seconds() / 5 / 60) + 1)
                        rv = []
                        for index in range(len(data)):
                            temp = []
                            tv = [None] * l
                            vv = [None] * l
                            ev = [False] * l
                            rec = data[index].get('record')
                            if rec:
                                for i in rec:
                                    t = datetime.strptime(i.get('time'), '%Y-%m-%d %H:%M:%S')
                                    if (t - te).total_seconds() <= 0:
                                        sTemp = (int16)(floor((t - tS).total_seconds() / 5 / 60))
                                        if sTemp < l:
                                            tv[sTemp] = t
                                            try:
                                                vv[sTemp] = float(i.get('value'))
                                            except Exception as e:
                                                vv[sTemp] = 0.0
                                for i in range(1, l):
                                    if tv[i] is None:
                                        if tv[i - 1] is not None:
                                            tv[i] = tv[i - 1] + timedelta(seconds=60 * 5)
                                            vv[i] = vv[i - 1]
                                            ev[i] = True
                                for i in range(l - 1, 0, -1):
                                    if tv[i - 1] is None:
                                        tv[i - 1] = tv[i] - timedelta(seconds=60 * 5)
                                        vv[i - 1] = vv[i]
                                        ev[i - 1] = True
                                for x in range(l):
                                    temp.append(
                                        dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S'), value=vv[x], error=ev[x]))
                                rv.append(dict(name=data[index].get('pointname'), record=temp))
                    if timeFormat == 'h1':
                        ts = tS
                        te = tE
                        l = floor((te - ts).total_seconds() / 60 / 60) + 1
                        rv = []
                        for index in range(len(data)):
                            temp = []
                            tv = [None] * l
                            vv = [None] * l
                            ev = [False] * l
                            rec = data[index].get('record')
                            if rec:
                                for i in rec:
                                    t = datetime.strptime(i.get('time'), '%Y-%m-%d %H:%M:%S')
                                    if (t - te).total_seconds() <= 0:
                                        s = floor((t - tS).total_seconds() / 60 / 60)
                                        if s < l:
                                            tv[s] = t
                                            try:
                                                vv[s] = float(i.get('value'))
                                            except Exception as e:
                                                vv[s] = 0.0
                                for i in range(1, l):
                                    if tv[i] is None:
                                        if tv[i - 1] is not None:
                                            tv[i] = tv[i - 1] + timedelta(seconds=60 * 60)
                                            vv[i] = vv[i - 1]
                                            ev[i] = True
                                for i in range(l - 1, 0, -1):
                                    if tv[i - 1] is None:
                                        tv[i - 1] = tv[i] - timedelta(seconds=60 * 60)
                                        vv[i - 1] = vv[i]
                                        ev[i - 1] = True
                                for x in range(l):
                                    temp.append(
                                        dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S'), value=vv[x], error=ev[x]))
                                rv.append(dict(name=data[index].get('pointname'), record=temp))
                    if timeFormat == 'd1':
                        ts = tS
                        te = tE
                        l = (te - ts).days + 1
                        rv = []
                        for index in range(len(data)):
                            temp = []
                            tv = [None] * l
                            vv = [None] * l
                            ev = [False] * l
                            rec = data[index].get('record')
                            if rec:
                                for i in rec:
                                    t = datetime.strptime(i.get('time'), '%Y-%m-%d %H:%M:%S')
                                    if (t - te).total_seconds() <= 0:
                                        s = (t - tS).days
                                        if s < l:
                                            tv[s] = t
                                            try:
                                                vv[s] = float(i.get('value'))
                                            except Exception as e:
                                                vv[s] = 0.0
                                for i in range(1, l):
                                    if tv[i] is None:
                                        if tv[i - 1] is not None:
                                            tv[i] = tv[i - 1] + timedelta(1)
                                            vv[i] = vv[i - 1]
                                            ev[i] = True
                                for i in range(l - 1, 0, -1):
                                    if tv[i - 1] is None:
                                        tv[i - 1] = tv[i] - timedelta(1)
                                        vv[i - 1] = vv[i]
                                        ev[i - 1] = True
                                for x in range(l):
                                    temp.append(
                                        dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S'), value=vv[x], error=ev[x]))
                                rv.append(dict(name=data[index].get('pointname'), record=temp))
                    if timeFormat == 'M1':
                        ts = tS
                        te = tE
                        l = (te.year - ts.year) * 12 + (te.month - ts.month) + 1
                        # l = (te - ts).days/30 + 1
                        rv = []
                        for index in range(len(data)):
                            temp = []
                            tv = [None] * l
                            vv = [None] * l
                            ev = [False] * l
                            rec = data[index].get('record')
                            if rec:
                                for i in rec:
                                    t = datetime.strptime(i.get('time'), '%Y-%m-%d %H:%M:%S')
                                    if (t - te).total_seconds() <= 0:
                                        s = (t.year - tS.year) * 12 + (t.month - tS.month)
                                        if s < l:
                                            tv[s] = t
                                            try:
                                                vv[s] = float(i.get('value'))
                                            except Exception as e:
                                                vv[s] = 0.0
                                for i in range(1, l):
                                    if tv[i] is None:
                                        if tv[i - 1] is not None:
                                            nDay = 30
                                            if tv[i - 1].month >= 1 and tv[i - 1].month <= 11:
                                                if isLeap(tv[i - 1].year):
                                                    nDays = g_leapMonth[tv[i - 1].month - 1]
                                                else:
                                                    nDays = g_NonLeapMonth[tv[i - 1].month - 1]
                                            else:
                                                nDays = 31
                                            tv[i] = tv[i - 1] + timedelta(nDays)
                                            vv[i] = vv[i - 1]
                                            ev[i] = True
                                for i in range(l - 1, 0, -1):
                                    if tv[i - 1] is None:
                                        nDay = 30
                                        if tv[i].month >= 2 and tv[i].month <= 12:
                                            if isLeap(tv[i].year):
                                                nDays = g_leapMonth[tv[i].month - 2]
                                            else:
                                                nDays = g_NonLeapMonth[tv[i].month - 2]
                                        else:
                                            nDays = 31
                                        tv[i - 1] = tv[i] - timedelta(nDays)
                                        vv[i - 1] = vv[i]
                                        ev[i - 1] = True
                                for x in range(l):
                                    temp.append(
                                        dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S'), value=vv[x], error=ev[x]))
                                rv.append(dict(name=data[index].get('pointname'), record=temp))
                else:
                    for item in data:
                        temp = []
                        if len(item.get('record')) == 1:
                            try:
                                temp.append(dict(time=item.get('record')[0].get('time'),
                                                 value=float(item.get('record')[0].get('value')), error=False))
                            except Exception as e:
                                temp.append(dict(time=item.get('record')[0].get('time'), value=0.0, error=False))
                                print('padDataFloat error: ' + e.__str__())
                                logging.error('padDataFloat error: ' + e.__str__())
                        else:
                            temp.append(dict(time=timeStart, value=0.0, error=True))
                        rv.append(dict(name=item.get('pointname'), record=temp))
        # print('padData end')
        return rv

    def staticsData(self, DataDicList):
        if len(DataDicList) == 0 or DataDicList == '[]':
            BEOPDataAccess._logger.writeLog('staticsData error:DataDicList is invalid', True)
            return None

        nameLast = ""
        ret = []
        fNumberList = []
        try:
            for i in range(len(DataDicList)):
                name = DataDicList[i].get('name')
                if name != nameLast:
                    if len(fNumberList) > 0:
                        ret.append(dict(pointname=nameLast,
                                        statics=dict(avgvalue=average(fNumberList), maxvalue=max(fNumberList),
                                                     minvalue=min(fNumberList), medianvalue=median(fNumberList),
                                                     stdvalue=std(fNumberList))))
                        fNumberList = []
                    nameLast = name
                for j in DataDicList[i].get('record'):
                    bNumber = True
                    try:
                        convert = float(j.get('value'))
                    except Exception as e:
                        bNumber = False
                    if bNumber:
                        fNumberList.append(convert)
                    else:
                        fNumberList.append(0.0)
                if i == len(DataDicList) - 1:
                    if len(fNumberList) > 0:
                        ret.append(dict(pointname=nameLast,
                                        statics=dict(avgvalue=average(fNumberList), maxvalue=max(fNumberList),
                                                     minvalue=min(fNumberList), medianvalue=median(fNumberList),
                                                     stdvalue=std(fNumberList))))
        except Exception as e:

            BEOPDataAccess._logger.writeLog('staticsData failed:' + e.__str__(), True)
        return ret

    def getProjProperties(self, projId):
        dictRet = {}
        try:
            sql = 'select prop_name, prop_value from project_properties where proj_id = %s;' % (int(projId))
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(app.config.get('DATABASE'), sql)
            for item in dbrv:
                dictRet[item[0]] = item[1]
            dictRet['proj_id'] = projId
        except Exception:
            logging.error("Failed to get properties for project %s", projId, exc_info=True, stack_info=True)
        return dictRet

    def getCountryCodeByProjId(self, projId):
        proj_properties = BEOPDataAccess.getInstance().getProjProperties(projId)
        proj_country_code = proj_properties.get('country_name_twoletter')
        if proj_country_code is None:
            proj_country_code = 'WW'
        return proj_country_code

    def getCountryConfigByProjId(self, projId):
        proj_properties = BEOPDataAccess.getInstance().getProjProperties(projId)
        proj_country_code = proj_properties.get('country_name_twoletter')
        if proj_country_code is None:
            proj_country_code = 'WW'
        globalization = app.config.get('GLOBALIZATION')
        countryConfig = globalization.get(proj_country_code)
        if countryConfig is None:
            countryConfig = globalization.get('WW')
        return countryConfig

    def getProjMysqldbByName(self, name_en):
        rt = None
        try:
            ret = self.findProjectInfoItemByNameEn(name_en)
            if ret:
                rt = ret['mysqlname']
            else:

                BEOPDataAccess._logger.writeLog(
                    'getProjMysqldbByName:%s is not in memcache,so get info from mysql' % (name_en,), True)
                dbname = app.config.get('DATABASE')
                strQ = 'select s3dbname, mysqlname, id, collectionname from project where name_en=%s'
                dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strQ, (name_en,))
                if len(dbrv) == 0:

                    BEOPDataAccess._logger.writeLog('getProjMysqldbByName:%s in mot in table project' % (name_en,),
                                                    True)
                    return None
                elif len(dbrv[0]) == 0:

                    BEOPDataAccess._logger.writeLog('getProjMysqldbByName:%s in mot in table project' % (name_en,),
                                                    True)
                    return None
                else:
                    projectInfoList = RedisManager.get_project_info_list() if RedisManager.get_project_info_list() != None else []
                    if not projectInfoList:
                        self.UpdateProjectInfo()
                        projectInfoList = RedisManager.get_project_info_list()
                    if projectInfoList:
                        projectInfoList.append(
                            dict(name_en=name_en, s3dbname=dbrv[0][0], mysqlname=dbrv[0][1], id=dbrv[0][2],
                                 collectionname=dbrv[0][3]))
                        RedisManager.set_project_info_list(projectInfoList)
                        rt = dbrv[0][1]
                    else:

                        BEOPDataAccess._logger.writeLog('getProjMysqldbByName:projectInfoList is not in memcache', True)
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getProjMysqldbByName error:' + e.__str__(), True)
        return rt

    def findProjectInfoItemByNameEn(self, name_en):
        try:
            projectInfoList = RedisManager.get_project_info_list()
            if not projectInfoList:
                self.UpdateProjectInfo()
                projectInfoList = RedisManager.get_project_info_list()
            if projectInfoList:
                for index, item in enumerate(projectInfoList):
                    if item['name_en'] == name_en:
                        return item
            else:

                BEOPDataAccess._logger.writeLog('findProjectInfoItemByNameEn:projectInfoList is not in memcache', True)
        except Exception as e:

            BEOPDataAccess._logger.writeLog('findProjectInfoItemByNameEn error:' + e.__str__(), True)
        return None

    def getProjNameById(self, id):
        rt = None
        try:
            ret = self.findProjectInfoItemById(id)
            if ret:
                rt = ret['name_en']
            else:

                BEOPDataAccess._logger.writeLog(
                    'getProjNameById:projId=%s is not in memcache,so get info from mysql' % (id,), True)
                dbname = app.config.get('DATABASE')
                strQ = 'select name_en, s3dbname,mysqlname,collectionname from project where id=%s'
                dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strQ, (id,))
                if len(dbrv) == 0:

                    BEOPDataAccess._logger.writeLog('getProjNameById:projId=%s is not in table project' % (id,), True)
                    rt = None
                elif len(dbrv[0]) == 0:

                    BEOPDataAccess._logger.writeLog('getProjNameById:projId=%s is not in table project' % (id,), True)
                    rt = None
                else:
                    projectInfoList = RedisManager.get_project_info_list() if RedisManager.get_project_info_list() != None else []
                    if not projectInfoList:
                        self.UpdateProjectInfo()
                        projectInfoList = RedisManager.get_project_info_list()
                    if projectInfoList:
                        projectInfoList.append(
                            dict(name_en=dbrv[0][0], s3dbname=dbrv[0][1], mysqlname=dbrv[0][2], id=id,
                                 collectionname=dbrv[0][3]))
                        RedisManager.set_project_info_list(projectInfoList)
                        rt = dbrv[0][0]
                    else:

                        BEOPDataAccess._logger.writeLog('getProjNameById:projectInfoList is not in memcache', True)
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getProjNameById error:' + e.__str__(), True)
        return rt

    def getProjNameEnglishById(self, id):
        rt = None
        try:
            ret = self.findProjectInfoItemById(id)
            if ret:
                rt = ret['name_english']
            else:
                BEOPDataAccess._logger.writeLog(
                    'getProjNameEnglishById:projId=%s is not in memcache,so get info from mysql' % (id,), True)
                dbname = app.config.get('DATABASE')
                strQ = 'select name_english from project where id=%s'
                dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strQ, (id,))
                if dbrv and dbrv[0] and dbrv[0][0]:
                    return dbrv[0][0]
        except Exception as e:
            BEOPDataAccess._logger.writeLog('getProjNameEnglishById error:' + e.__str__(), True)
        return rt

    def getInputTable(self, projName):
        # print('getInputTable')
        rvQuery = []
        try:
            rtTableName = self.getProjMysqldbByName(projName)
            dbname = app.config['DATABASE']
            tableName = 'rtdata_' + rtTableName
            self.createRTTableIfNotExist(tableName)
            q = 'select time, pointname, pointvalue from %s' % tableName
            rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, ())
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getInputTable error:' + e.__str__(), True)
        return rvQuery

    def getInputTableContainer(self, projName):
        # print('getInputTable')
        rvQuery = {}
        try:
            rtTableName = self.getProjMysqldbByName(projName)
            dbname = app.config['DATABASE']
            tableName = 'rtdata_' + rtTableName
            self.createRTTableIfNotExist(tableName)
            q = 'select time, pointname, pointvalue, flag from %s' % tableName
            rv = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, ())
            for item in rv:
                rvQuery[item[1]] = {'time': item[0].strftime('%Y-%m-%d %H:%M:%S'), 'value': item[2],
                                    'flag': item[3] if item[3] is not None else 0}
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getInputTableContainer error:' + e.__str__(), True)
        return rvQuery

    def getProjS3db(self, id):
        rt = None
        try:
            ret = self.findProjectInfoItemById(id)
            if ret:
                rt = ret['s3dbname']
            else:

                BEOPDataAccess._logger.writeLog('getProjS3db:projId=%s is not in memcache, get info from mysql' % (id,),
                                                True)
                dbname = app.config.get('DATABASE')
                q = ('select s3dbname, mysqlname, name_en, collectionname from project where id=%s')
                dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, (id,))
                if dbrv == None or len(dbrv) < 1:

                    BEOPDataAccess._logger.writeLog('getProjS3db:projId=%s is not in table project' % (id,), True)
                    rt = None
                else:
                    projectInfoList = RedisManager.get_project_info_list() if RedisManager.get_project_info_list() != None else []
                    if not projectInfoList:
                        self.UpdateProjectInfo()
                        projectInfoList = RedisManager.get_project_info_list()
                    if projectInfoList:
                        projectInfoList.append(
                            dict(name_en=dbrv[0][2], s3dbname=dbrv[0][0], mysqlname=dbrv[0][1], id=id,
                                 collectionname=dbrv[0][3]))
                        RedisManager.set_project_info_list(projectInfoList)
                        rt = dbrv[0][0]
                    else:

                        BEOPDataAccess._logger.writeLog('getProjS3db:projectInfoList is not in memcache', True)
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getProjS3db error:' + e.__str__(), True)
        return rt

    def getProjIdByName(self, name_en):
        rt = None
        try:
            ret = self.findProjectInfoItemByNameEn(name_en)
            if ret:
                rt = ret['id']
            else:

                BEOPDataAccess._logger.writeLog(
                    'getProjIdByName:%s is not in memcache, so get info from mysql' % (name_en,), True)
                dbname = app.config.get('DATABASE')
                strQ = 'select mysqlname, id, s3dbname, collectionname from project where name_en=%s'
                dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strQ, (name_en,))
                if not dbrv:

                    BEOPDataAccess._logger.writeLog('getProjIdByName:%s is not in table project' % (name_en,), True)
                    rt = None
                else:
                    if dbrv[0]:
                        projectInfoList = RedisManager.get_project_info_list() if RedisManager.get_project_info_list() != None else []
                        if not projectInfoList:
                            self.UpdateProjectInfo()
                            projectInfoList = RedisManager.get_project_info_list()
                        if projectInfoList:
                            projectInfoList.append(
                                dict(name_en=name_en, id=dbrv[0][1], s3dbname=dbrv[0][2], mysqlname=dbrv[0][0],
                                     collectionname=[0][3]))
                            RedisManager.set_project_info_list(projectInfoList)
                            rt = dbrv[0][1]
                        else:

                            BEOPDataAccess._logger.writeLog('getProjIdByName:projectInfoList is not in memcache', True)
                    else:
                        rt = None
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getProjIdByName error:' + e.__str__(), True)
        return rt

    def appendMutilOutputToSiteTable(self, projId, pointList, valueList):
        # print('appendOutputTable')
        bSuccess = False
        try:
            nPointCount = len(pointList)
            nValueCount = len(valueList)
            if nPointCount <= 0:
                BEOPDataAccess._logger.writeLog('appendMutilOutputToSiteTable:len(pointList)<=0', True)
                return 'failed'
            if nPointCount != nValueCount:
                BEOPDataAccess._logger.writeLog('appendMutilOutputToSiteTable:len(pointList)!=len(valueList)', True)
                return 'failed'
            sql = 'delete from `realtimedata_output_to_site` where pointname IN ('
            for index in range(nPointCount):
                sql += "'" + pointList[index] + "',"
            sql = sql[:-1]
            sql += ")"
            bSuccess = self._mysqlDBContainer.op_db_update(app.config['DATABASE'], sql, ())
            if not bSuccess:
                BEOPDataAccess._logger.writeLog(
                    'appendMutilOutputToSiteTable:delete from realtimedata_output_to_site failed, pointList=%s' % (
                    str(pointList), True))
            sql = 'insert into `realtimedata_output_to_site` (projectid, pointname,pointvalue) values '
            for index2 in range(nPointCount):
                sql += ("(%s,'" % projId) + pointList[index2] + "','" + str(valueList[index2]) + "'),"
            sql = sql[:-1]
            bSuccess = self._mysqlDBContainer.op_db_update(app.config['DATABASE'], sql, ())
            if not bSuccess:
                BEOPDataAccess._logger.writeLog(
                    'appendMutilOutputToSiteTable:insert into realtimedata_output_to_site failed, pointList=%s, valusList=%s' % (
                    str(pointList), str(valueList)), True)
        except Exception as e:

            BEOPDataAccess._logger.writeLog('appendMutilOutputToSiteTable error:' + e.__str__(), True)
        return bSuccess

    def updateRealtimeInputData(self, projId, pointName, pointValue):
        bSuccess = False
        q = ''
        try:
            rtTableName = self.getProjMysqldb(projId)
            dbname = app.config['DATABASE']
            if not (isinstance(pointValue, str) or isinstance(pointValue, float) or isinstance(pointValue, int)):
                pointValue = '0.0'
            q = "replace into rtdata_%s" % rtTableName + "(time, pointname, pointvalue) values(now(), %s,%s)"
            params = (pointName, str(pointValue))
            bSuccess = self._mysqlDBContainer.op_db_update(dbname, q, params)
        except Exception as e:

            BEOPDataAccess._logger.writeLog('updateRealtimeInputData error:' + e.__str__(), True)
        if bSuccess:
            return 'success'
        else:

            BEOPDataAccess._logger.writeLog('updateRealtimeInputData:sql=%s execute failed' % (q,), True)
            return 'error: manipulating database failed'
        return bSuccess

    def appendOutputToSiteTable(self, projectId, pointname, pointvalue):
        bSuccess = False
        try:
            dbname = app.config['DATABASE']
            q = 'delete from `realtimedata_output_to_site` where projectid = %s and pointname = %s'
            bSuccess = self._mysqlDBContainer.op_db_update(dbname, q, (projectId, pointname))
            if not bSuccess:
                BEOPDataAccess._logger.writeLog('appendOutputToSiteTable:sql=%s execute failed' % (q,), True)
            q = 'insert into `realtimedata_output_to_site` (projectid, pointname,pointvalue) values (%s, %s,%s)'
            bSuccess = self._mysqlDBContainer.op_db_update(dbname, q, (projectId, pointname, pointvalue))
            if not bSuccess:
                BEOPDataAccess._logger.writeLog('appendOutputToSiteTable:sql=%s execute failed' % (q,), True)
        except Exception as e:

            BEOPDataAccess._logger.writeLog('appendOutputToSiteTable error:' + e.__str__(), True)
        return bSuccess

    def updateRealtimeInputDataMul_by_tableName(self, tableName, pointNameList, pointValueList, pointTypeFlag):
        rt = {'state': 0, 'length': 0}
        try:
            dbname = app.config.get('DATABASE')
            constMaxRowsPerOperation = 5000
            length = len(pointNameList) if pointNameList else 0
            if length > 0:
                block = length // constMaxRowsPerOperation
                for count in range(block + 1):
                    pointList = []
                    valueList = []
                    for index in range(count * constMaxRowsPerOperation, (count + 1) * constMaxRowsPerOperation):
                        if index >= length:
                            break
                        pointList.append(pointNameList[index])
                        valueList.append(pointValueList[index])
                    self.createRTTableIfNotExist(tableName)
                    params = []
                    strsql = 'replace into %s' % tableName + '(time, pointname, pointvalue, flag) values'
                    for index, pointname in enumerate(pointList):
                        strsql += '(now(), %s, %s, %s),'
                        params.extend([pointname, str(valueList[index]), pointTypeFlag])
                    strsql = strsql[:-1]

                    bSuccess = self._mysqlDBContainer.op_db_update(dbname, strsql, tuple(params))
                    if bSuccess:
                        rt.update({'state': 1, 'length': length})
                    else:

                        BEOPDataAccess._logger.writeLog(
                            'updateRealtimeInputDataMul_by_tableName:sql=%s execute failed' % (strsql,), True)
                        rt.update({'state': 403, 'message': 'manipulating database failed'})

        except Exception as e:

            BEOPDataAccess._logger.writeLog('updateRealtimeInputDataMul_by_tableName error:' + e.__str__(), True)
        return rt

    # 删除修改后的计算点/虚拟点后更新buffer表
    def updateRealtimeDataBufferMini(self, projId, orignName, newName, flag):
        rt = {"state": 0}
        try:
            dbname = app.config.get('DATABASE_BUFFER')
            tableName = None
            if flag == 1:
                self.createTableBufferRTTableIfNotExist(projId)
                tableName = "rtdata_%s_vpoint" % (projId,)
            elif flag == 2 or flag == 0:
                self.createTableBufferRTTableIfNotExist(projId)
                tableName = "rtdata_%s" % (projId,)
            if tableName:
                strSql = "UPDATE %s SET pointname='%s' WHERE pointname='%s' AND flag='%s'" % (
                tableName, newName, orignName, flag)
                bSuccess = self._mysqlDBContainer.op_db_update(dbname, strSql, ())
                if bSuccess:
                    rt.update({'state': 1})
                else:
                    BEOPDataAccess._logger.writeLog('updateRealtimeDataBufferMini:sql=%s execute failed' % (strSql,),
                                                    True)
                    rt.update({'state': 403, 'message': 'manipulating database failed'})
        except Exception as e:
            BEOPDataAccess._logger.writeLog('updateRealtimeDataBufferMini error:' + e.__str__(), True)
        return rt

    def updateRealtimeDataBufferMul_by_projid(self, projId, pointNameList, pointValueList, pointTimeList,
                                              pointTypeFlag):
        rt = {'state': 0}
        try:
            dbname = app.config.get('DATABASE_BUFFER')
            constMaxRowsPerOperation = 5000
            length = len(pointNameList) if pointNameList else 0
            tableName = None
            if length > 0:
                block = length // constMaxRowsPerOperation
                for count in range(block + 1):
                    pointList = []
                    valueList = []
                    timeList = []

                    for index in range(count * constMaxRowsPerOperation, (count + 1) * constMaxRowsPerOperation):
                        if index >= length:
                            break
                        pointList.append(pointNameList[index])
                        valueList.append(pointValueList[index])
                        timeList.append(pointTimeList[index])
                    if pointTypeFlag == 1:
                        self.createTableBufferRTTableIfNotExist(projId)
                        tableName = "rtdata_%s_vpoint" % (projId,)
                    elif pointTypeFlag == 2 or pointTypeFlag == 0:
                        self.createTableBufferRTTableIfNotExist(projId)
                        tableName = "rtdata_%s" % (projId,)
                    params = []
                    if tableName:
                        strsql = 'replace into %s' % tableName + '(time, pointname, pointvalue, flag) values'
                        for index, pointname in enumerate(pointList):
                            strsql += '(%s, %s, %s, %s),'
                            params.extend([timeList[index], pointname, str(valueList[index]), pointTypeFlag])
                        strsql = strsql[:-1]
                        if params:
                            bSuccess = self._mysqlDBContainer.op_db_update(dbname, strsql, tuple(params))
                            if bSuccess:
                                rt.update({'state': 1})
                            else:
                                BEOPDataAccess._logger.writeLog(
                                    'updateRealtimeDataBufferMul_by_projid:sql=%s execute failed' % (strsql,), True)
                                rt.update({'state': 403, 'message': 'manipulating database failed'})

        except Exception as e:

            BEOPDataAccess._logger.writeLog('updateRealtimeDataBufferMul_by_projid error:' + e.__str__(), True)
        return rt

    def genMemProjectLocateMap(self):
        try:
            dbname = app.config.get('DATABASE')
            strQInstance = 'select mongo_server_id, internet_addr, internal_addr, writable, space_used, is_default, cluster_id from mongo_instance'
            dbrvInstance = self._mysqlDBContainerReadOnly.op_db_query(dbname, strQInstance, )
            mongo_Instance = {}
            for item in dbrvInstance:
                mongo_Instance[item[0]] = {'internet_addr': item[1], 'internal_addr': item[2], 'writable': item[3],
                                           'space_used': item[4], 'is_default': item[5], 'cluster_id': item[6]}
            projectLocateMap = {'projectLocate': {}}
            strQ = 'select proj_id, mongo_server_id, start_time, end_time from locate_map'
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strQ, )
            # 获取每个项目对应的信息
            addrSet = set()
            for item in dbrv:
                if self.GetCollectionNameById(item[0]):
                    if not projectLocateMap['projectLocate'].get(item[0]):
                        projectLocateMap['projectLocate'][item[0]] = []
                    projectLocateMap['projectLocate'][item[0]].append(
                        {'mongo_server_id': item[1], 'internet_addr': mongo_Instance[item[1]].get('internet_addr'),
                         'internal_addr': mongo_Instance[item[1]].get('internal_addr'),
                         'start_time': item[2], 'end_time': item[3]})
                if MongoConnManager.isLocalEnv():
                    addrSet.add(app.config['MONGO_SERVER_HOST'])
                else:
                    if app.config['USE_ALI_PUBLIC']:
                        addrSet.add(mongo_Instance[item[1]].get('internet_addr'))
                    else:
                        addrSet.add(mongo_Instance[item[1]].get('internal_addr'))
            # 配置数据库放到地址列表
            if MongoConnManager.isLocalEnv():
                addrSet.add(app.config['MONGO_SERVER_HOST'])
            else:
                addrSet.add(app.config['CONFIG_MONGO_ADDR'] + ':' + str(app.config['CONFIG_MONGO_PORT']))
            projectLocateMap['addrList'] = list(addrSet)
            projectLocateMap['mongoInstance'] = mongo_Instance
            RedisManager.set_project_locate_map(projectLocateMap)
            MongoConnManager.genMongoConnMember()
        except Exception as e:

            BEOPDataAccess._logger.writeLog('genMemProjectLocateMap error:' + e.__str__(), True)

    def getProjectLocateMap(self):
        projectLocateMap = {}
        try:
            if isinstance(app.config['Condition'], str) or not MongoConnManager.isLocalEnv():
                projectLocateMap = RedisManager.get_project_locate_map()
                if not projectLocateMap or type(projectLocateMap) is not dict:
                    self.genMemProjectLocateMap()
            if (not projectLocateMap) and (not MongoConnManager.isLocalEnv()):
                BEOPDataAccess._logger.writeLog('getProjectLocateMap:projectLocateMap is non_local!!!', True)
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getProjectLocateMap failed:' + e.__str__(), True)
        return projectLocateMap

    def UpdateProjectLocateMap(self):
        try:
            self.genMemProjectLocateMap()
            projectLocateMap = RedisManager.get_project_locate_map()
            if projectLocateMap:
                return True
            else:

                BEOPDataAccess._logger.writeLog('UpdateProjectLocateMap failed:projectLocateMap is not in memcache',
                                                True)
        except Exception as e:

            BEOPDataAccess._logger.writeLog('UpdateProjectLocateMap failed:' + e.__str__(), True)
        return False

    def addPointIntoRTDataTable(self, projId, pointNameList, pointValueList):
        rt = []
        try:
            rtTableName = self.getProjMysqldb(projId)
            dbname = app.config['DATABASE']
            flagType = 1  # algorithm
            if len(pointNameList) == len(pointValueList):
                for index in range(len(pointNameList)):
                    if not (isinstance(pointNameList[index], str)):
                        rt.append(pointNameList[index])
                    tableName = 'rtdata_' + rtTableName
                    self.createRTTableIfNotExist(tableName)
                    q = "insert into %s " % tableName + "(time, pointname,pointvalue,flag) values(now(), '%s', '%s',%d)" % (
                    pointNameList[index], pointValueList[index], flagType)
                    bSuccess = self._mysqlDBContainer.op_db_update(dbname, q, ())
                    if not bSuccess:
                        BEOPDataAccess._logger.writeLog('addPointIntoRTDataTable:sql=%s execute failed' % (q,), True)
                        rt.append(pointNameList[index])
            else:
                rt = pointNameList
        except Exception as e:

            BEOPDataAccess._logger.writeLog('addPointIntoRTDataTable failed:' + e.__str__(), True)
        return rt

    def copy_realtimedata_between_project(self, projIdCopyFrom, projIdCopyTo):
        rt = []
        try:
            rtTableNameFrom = self.getProjMysqldb(projIdCopyFrom)
            rtTableNameTo = self.getProjMysqldb(projIdCopyTo)
            dbname = app.config['DATABASE']

            qDel = "delete from rtdata_%s" % rtTableNameTo
            qSet = "set names gb2312"
            qIns = "replace into rtdata_%s " % rtTableNameTo + "(time,pointname,pointvalue) select time,pointname,pointvalue from rtdata_%s" % rtTableNameFrom
            bSuccess = self._mysqlDBContainer.op_db_update_by_transaction(dbname, [qDel, qSet, qIns])

            if not bSuccess:

                BEOPDataAccess._logger.writeLog(
                    'copy_realtimedata_between_project:sqlList=["%s","%s"] execute failed' % (qDel, qIns), True)
                rt = dict(info='Fail')
            else:
                rt = dict(info='Success')
        except Exception as e:

            BEOPDataAccess._logger.writeLog('copy_realtimedata_between_project failed:' + e.__str__(), True)
        return rt

    def getSVRPointValueList(self, projId, timeObject):
        insertDataList = []
        try:
            tableName = "rtdata_%s_vpoint" % (projId,)
            self.createTableBufferRTTableIfNotExist(projId)
            sql = "select time,pointname,pointvalue from %s" % (tableName,)
            rvQuery = self._mysqlDBContainerReadOnly.op_db_query(app.config.get('DATABASE_BUFFER'), sql)
            if rvQuery != None:
                if len(rvQuery) > 0:
                    for i in range(len(rvQuery)):
                        insertDataList.append((timeObject, rvQuery[i][1], rvQuery[i][2]))
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getSVRPointValueList failed:' + e.__str__(), True)
        return insertDataList

    def getFlag2PointValueList(self, strMysqlTableName, timeObject, pointList):
        insertDataList = []
        try:
            tableName = 'rtdata_' + strMysqlTableName
            self.createRTTableIfNotExist(tableName)
            sql = "select time,pointname,pointvalue from %s where flag=2 and pointname in (%s)" % (
            tableName, str(pointList).replace('[', '').replace(']', ''))
            rvQuery = self._mysqlDBContainerReadOnly.op_db_query('beopdoengine', sql)
            if rvQuery != None:
                if len(rvQuery) > 0:
                    for i in range(len(rvQuery)):
                        insertDataList.append((timeObject, rvQuery[i][1], rvQuery[i][2]))
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getFlag2PointValueList failed:' + e.__str__(), True)
        return insertDataList

    def get_hisdata_pv_list(self, strMysqlTableName, timeObject, pointList):
        insertDataList = []
        try:
            sql = "select time,pointname,pointvalue from %s where time='%s' pointname in (%s)" % (
            strMysqlTableName, timeObject, str(pointList).replace('[', '').replace(']', ''))
            rvQuery = self._mysqlDBContainerReadOnly.op_db_query(app.config().get('DATABASE_BUFFER'), sql)
            if rvQuery != None:
                if len(rvQuery) > 0:
                    for i in range(len(rvQuery)):
                        insertDataList.append((timeObject, rvQuery[i][1], rvQuery[i][2]))
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getFlag2PointValueList failed:' + e.__str__(), True)
        return insertDataList

    def get_history_data_padded_reduce(self, projectId, pointList, strTimeStart, strTimeEnd, strTimeFormat,
                                       bSearchNearest=False):
        result = []
        # invalid query filter:
        now_time = datetime.now()
        try:
            if strTimeStart is None or strTimeEnd is None or strTimeFormat is None:
                BEOPDataAccess._logger.writeLog('get_history_data_padded_reduce:invalid params', True)
                return {'error': 'historyData', 'msg': 'one of query condition is None'}

            startTime = None
            endTime = None
            try:
                startTime = datetime.strptime(strTimeStart, '%Y-%m-%d %H:%M:%S')
                endTime = datetime.strptime(strTimeEnd, '%Y-%m-%d %H:%M:%S')
            except:

                BEOPDataAccess._logger.writeLog('get_history_data_padded_reduce:invalid time string', True)
                return {'error': 'historyData', 'msg': 'invalid time string'}

            if startTime > endTime:
                BEOPDataAccess._logger.writeLog(
                    'error params get_history_data_padded_reduce:[startTime:%s],[endTime:%s],[timeFormat:%s],[projectId:%d],[pointList:%s]' % (
                    strTimeStart, strTimeEnd, strTimeFormat, int(projectId)), str(pointList), True)
                return {'error': 'historyData', 'msg': 'startTime > endTime'}
            if endTime > now_time:
                endTime = now_time
            if strTimeFormat == 'm1':
                if (endTime - startTime).days > 7:
                    BEOPDataAccess._logger.writeLog(
                        'get_history_data_padded_reduce error: time range too long for m1 period data query', True)
                    return {'error': 'historyData', 'msg': 'time range is 7 days for m1'}
            elif strTimeFormat == 'm5':
                if (endTime - startTime).days > 14:
                    BEOPDataAccess._logger.writeLog(
                        'get_history_data_padded_reduce error: time range too long for m5 period data query :' + strTimeStart + strTimeEnd,
                        True)
                    return {'error': 'historyData', 'msg': 'time range is 14 days for m5'}
            elif strTimeFormat == 'h1':
                if (endTime - startTime).days > 60:
                    BEOPDataAccess._logger.writeLog(
                        'get_history_data_padded_reduce error: time range too long for h1 period data query ', True)
                    return {'error': 'historyData', 'msg': 'time range is 60 days for h1'}
            elif strTimeFormat == 'd1':
                if (endTime - startTime).days > 365 * 2:
                    BEOPDataAccess._logger.writeLog(
                        'get_history_data_padded_reduce error: time range too long for d1 period data query ', True)
                    return {'error': 'historyData', 'msg': 'time range is 365*2 days for d1'}
            elif strTimeFormat == 'M1':
                pass
            else:

                BEOPDataAccess._logger.writeLog(
                    'get_history_data_padded_reduce error: time period format not supported', True)
                return {'error': 'historyData', 'msg': 'time period format not supported'}

            rv = self.getHistoryData(projectId, pointList, strTimeStart, strTimeEnd, strTimeFormat, bSearchNearest)
            if len(rv) == 0:
                BEOPDataAccess._logger.writeLog('get_history_data_padded_reduce:no history data', True)
                return {'error': 'historyData', 'msg': 'no history data'}
            # mango added to prevent exception
            if type(rv) == type('123'):
                BEOPDataAccess._logger.writeLog('get_history_data_padded_reduce:no history data', True)
                return {'error': 'historyData', 'msg': 'no history data'}
            hisDataDicList = self.padDataFloat(rv, strTimeStart, strTimeEnd, strTimeFormat)
            listTime = []
            data = {}
            for item in hisDataDicList:
                record = []
                name = item.get('name')
                history = item.get('record')
                if len(listTime) == 0:
                    for subItem in history:
                        listTime.append(subItem.get('time'))
                for subItem in history:
                    record.append(subItem.get('value'))
                data[name] = record
            result = {'timeStamp': listTime, 'data': data}
        except Exception as e:

            BEOPDataAccess._logger.writeLog('get_history_data_padded_reduce failed:' + e.__str__(), True)
        return result

    def getProjDTUList(self, projIdList):
        dbname = app.config.get('DATABASE')
        rt = []
        try:
            if projIdList:
                strIdAll = ''
                for proj in projIdList:
                    strIdAll += str(proj)
                    strIdAll += ','

                strIdAll = strIdAll[:-1]
                q = 'select dtuname from dtuserver_prj where dbname in (select mysqlname from project where id in (%s))' % strIdAll
                dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, ())
                if dbrv is not None:
                    for item in dbrv:
                        rt.append(item[0])
                else:

                    BEOPDataAccess._logger.writeLog('getProjDTUList:sql=%s return none' % (q,), True)
            else:

                BEOPDataAccess._logger.writeLog('getProjDTUList:projIdList is none or []', True)
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getProjDTUList failed:' + e.__str__(), True)
        return rt

    def getIsProjNeedSaveHistory(self, projId):
        dbname = app.config.get('DATABASE')
        rt = False
        try:
            q = 'select SaveSvrHistory from project where id = %d' % (int(projId))
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, ())
            if dbrv is not None:
                rt = (dbrv[0][0] == 1)
        except Exception as e:
            rt = False
        return rt

    def getSaveSvrProjIdList(self):
        dbname = app.config.get('DATABASE')
        rt = []
        try:
            q = 'select id,name_cn,mysqlname,collectionname,SaveSvrHistory from project'
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, ())
            if dbrv is not None:
                for item in dbrv:
                    rt.append({'id': item[0], 'name_cn': item[1], 'mysqlname': item[2], 'collectionname': item[3],
                               'SaveSvrHistory': item[4]})
            if not rt:
                BEOPDataAccess._logger.writeLog('getSaveSvrProjIdList:sql=%s return none' % (q,), True)
        except Exception as e:
            pass
        return rt

    def setSaveSvrById(self, projId):
        rt = False
        try:
            dbname = app.config.get('DATABASE')
            sql = "update project set SaveSvrHistory=1 where id=%s" % (projId,)
            rt = self._mysqlDBContainer.op_db_update(dbname, sql, ())
            if not rt:
                BEOPDataAccess._logger.writeLog('setSaveSvrById:sql=%s failed' % (sql,), True)
        except Exception as e:

            BEOPDataAccess._logger.writeLog('setSaveSvrById:' + e.__str__(), True)
        return rt

    def getOutputToSiteTable(self, needInDtuNameList):
        # print('appendOutputTable')
        needWriteDataList = []
        try:
            dbname = app.config.get('DATABASE')
            sql = 'select projectid, pointname,pointvalue from `realtimedata_output_to_site` order by projectid'
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, ())
            writeDataList = []
            nLastProjId = -1
            writeDataListOneItem = {}
            if dbrv is not None:
                for item in dbrv:
                    nCurProjId = int(item[0])
                    if nCurProjId != nLastProjId:
                        dtuInfoList = self.getDTUNameListByProjId(nCurProjId)
                        dtuNameList = dtuInfoList['dtuNameList']
                        dtuTypeList = dtuInfoList['dtuComTypeList']
                        writeDataListOneItem = dict(dtuName=dtuNameList, pointNameList=[], pointValueList=[],
                                                    dtuType=dtuTypeList)
                        writeDataListOneItem['pointNameList'].append(item[1])
                        writeDataListOneItem['pointValueList'].append(item[2])
                        writeDataList.append(writeDataListOneItem)
                        nLastProjId = nCurProjId
                    else:
                        writeDataListOneItem['pointNameList'].append(item[1])
                        writeDataListOneItem['pointValueList'].append(item[2])

            for item in writeDataList:
                bInNeed = False
                for i in item['dtuName']:
                    for j in needInDtuNameList:
                        if i == j:
                            bInNeed = True
                            break
                if bInNeed:
                    needWriteDataList.append(item)
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getOutputToSiteTable:' + e.__str__(), True)
        return needWriteDataList

    def getProjIdByDTUName(self, strDTUName):
        dbname = app.config.get('DATABASE')
        rt = -1
        try:
            q = 'select projectid from dtusert_to_project where dtuprojectid in (select id from dtuserver_prj where dtuname = "%s")' % (
            strDTUName,)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, ())
            if dbrv:
                for item in dbrv:
                    rt = int(item[0])
            else:

                BEOPDataAccess._logger.writeLog('getProjIdByDTUName:sql=%s return none' % (q,), True)
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getProjIdByDTUName failed:' + e.__str__(), True)
        return rt

    def getMysqlNameById(self, nProjId):
        name = ''
        try:
            projList = RedisManager.get_project_info_list()
            if projList:
                for item in projList:
                    if item.get('id') == nProjId:
                        name = item.get('mysqlname')
                        break
            else:

                BEOPDataAccess._logger.writeLog('getMysqlNameById:projectInfoList is not in memcache', True)
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getMysqlNameById failed:' + e.__str__(), True)
        return name

    def getDTUNameListByMysqlName(self, name):
        rtName = []
        rtBDTUProject = []
        try:
            projList = RedisManager.get_dtuserver_list()
            if projList:
                for item in projList:
                    if item.get('dbname') == name:
                        rtName.append(item.get('dtuname'))
                        rtBDTUProject.append(item.get('bDTUProject'))
            else:

                BEOPDataAccess._logger.writeLog('getDTUNameListByMysqlName:dtuserverList is not in memcahce', True)
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getDTUNameListByMysqlName failed:' + e.__str__(), True)
        return rtName, rtBDTUProject

    def getDTUNameListByProjId(self, nProjId):
        dtuNameList = []
        dtuComTypeList = []
        try:
            mysqlname = self.getMysqlNameById(nProjId)
            if mysqlname:
                dtuNameList, dtuComTypeList = self.getDTUNameListByMysqlName(mysqlname)
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getDTUNameListByProjId failed:' + e.__str__(), True)
        return dict(dtuNameList=dtuNameList, dtuComTypeList=dtuComTypeList)

    def deleteOutputToSiteTable(self, writeDataList):
        bSuccess = False
        try:
            for item in writeDataList:
                dtuName = item['dtuName']
                pointNameList = item['pointNameList']
                nProjId = self.getProjIdByDTUName(dtuName)

                sql = 'delete from `realtimedata_output_to_site` where projectid = %d ' % nProjId + ' and pointname IN ('
                for ptName in pointNameList:
                    sql += "'" + ptName + "',"
                sql = sql[:-1]
                sql += ")"
            bSuccess = self._mysqlDBContainer.op_db_update(app.config['DATABASE'], sql, ())
            if not bSuccess:
                BEOPDataAccess._logger.writeLog('deleteOutputToSiteTable:sql=%s execute failed' % (sql,), True)
        except Exception as e:

            BEOPDataAccess._logger.writeLog('deleteOutputToSiteTable failed:' + e.__str__(), True)
        return bSuccess

    def saveWarningRecord(self, dtuName, warningList):
        bSuccess = False
        try:
            mysqlname = self.get_dbname_by_dtuname(dtuName)
            if mysqlname:
                strWarningTableName = 'warningrd_' + mysqlname
                self.createWarningrdTableIfNotExist(strWarningTableName)
                for warningItem in warningList:
                    strInfo = warningItem['strInfo']
                    bUpdate = warningItem['bUpdate']
                    nConfirmed = warningItem['nConfirmed']
                    nLevel = warningItem['nLevel']
                    strHappenTime = warningItem['strHappenTime']
                    strPointName = warningItem['strPointName']
                    strTime = warningItem['strTime']
                    strConfirmedUser = warningItem['strConfirmedUser']

                    # 先删除
                    strSQL = 'delete from %s' % strWarningTableName + ' where info="%s"' % strInfo + ' and time= "%s"' % strHappenTime
                    bSuccess = self._mysqlDBContainer.op_db_update(app.config['DATABASE'], strSQL, ())
                    if not bSuccess:
                        BEOPDataAccess._logger.writeLog('saveWarningRecord:sql=%s execute failed' % (strSQL,), True)
                    # 再插入
                    strSQL = 'insert into %s' % strWarningTableName + ' value("%s",0, "%s",%d,"%s", %d,"%s", "%s")' % (
                    strHappenTime, strInfo, nLevel, strTime, nConfirmed, strConfirmedUser, strPointName)
                    bSuccess = self._mysqlDBContainer.op_db_update(app.config['DATABASE'], strSQL, ())
                    if not bSuccess:
                        BEOPDataAccess._logger.writeLog('saveWarningRecord:sql=%s execute failed' % (strSQL,), True)
        except Exception as e:

            BEOPDataAccess._logger.writeLog('saveWarningRecord failed:' + e.__str__(), True)
        return bSuccess

    def saveConfigList(self, dtuName, configList):
        bSuccess = False
        try:
            mysqlname = self.get_dbname_by_dtuname(dtuName)
            if mysqlname:
                strConfigTableName = 'config_' + mysqlname
                self.createConfigTableIfNotExist(strConfigTableName)
                strSQL = 'replace into %s' % strConfigTableName + '(paramname, paramvalue) values'
                for configItem in configList:
                    strParam = configItem['strparamname']
                    strValue = configItem['strparamvalue']
                    strSQL += '("%s", "%s"),' % (strParam, strValue)
                strSQL = strSQL[:-1]
                bSuccess = self._mysqlDBContainer.op_db_update(app.config['DATABASE'], strSQL, ())
                if not bSuccess:
                    BEOPDataAccess._logger.writeLog('saveConfigList:sql=%s execute failed' % (strSQL,), True)
        except Exception as e:

            BEOPDataAccess._logger.writeLog('saveConfigList failed:' + e.__str__(), True)
        return bSuccess

    def saveOperationList(self, dtuName, operationList):
        bSuccess = False
        try:
            mysqlname = self.get_dbname_by_dtuname(dtuName)
            if mysqlname:
                strOPrecordTableName = 'oprecord_' + mysqlname
                self.createOprecordTableIfNotExist(strOPrecordTableName)
                for configItem in operationList:
                    strTime = configItem['strTime']
                    strUser = configItem['strUser']
                    strOperation = configItem['strOperation']
                    strSQL = 'insert into %s' % strOPrecordTableName + ' value("%s", "%s", "%s") ' % (
                    strTime, strUser, strOperation)
                    bSuccess = self._mysqlDBContainer.op_db_update(app.config['DATABASE'], strSQL, ())
                    if not bSuccess:
                        BEOPDataAccess._logger.writeLog('saveOperationList:sql=%s execute failed' % (strSQL,), True)
            else:

                BEOPDataAccess._logger.writeLog('saveOperationList:get_dbname_by_dtuname return ""', True)
        except Exception as e:

            BEOPDataAccess._logger.writeLog('saveOperationList failed:' + e.__str__(), True)
        return bSuccess

    def get_dbname_by_dtuname(self, dtuname):
        confdb = app.config.get('DATABASE')
        rt = ''
        prjList = RedisManager.get_dtuserver_list()
        try:
            if not prjList:
                RedisManager.set_dtuserver_list(BEOPDataAccess.getInstance().getDTUProjectList())
                prjList = RedisManager.get_dtuserver_list()
            if prjList:
                for item in prjList:
                    if item.get('dtuname') == dtuname:
                        rt = item.get('dbname')
                        break
                else:
                    sql = 'insert into dtuserver_prj(dtuname, dbname) values("%s", "%s")' % (
                    dtuname, 'beopdata_' + dtuname)
                    rt = 'beopdata_' + dtuname
                    if self._mysqlDBContainer.op_db_update(confdb, sql, ()):
                        sql_query = "select id from dtuserver_prj where dtuname='%s'" % (dtuname,)
                        ret = self._mysqlDBContainer.op_db_query(confdb, sql_query, ())
                        if ret:
                            insert_id = ret[0][0]
                            prjList.append({'id': insert_id, 'dtuname': dtuname, 'dbname': rt})
                            RedisManager.set_dtuserver_list(prjList)
            else:

                BEOPDataAccess._logger.writeLog('get_dbname_by_dtuname:dtuserverList is not in memcache', True)
        except Exception as e:

            BEOPDataAccess._logger.writeLog('get_dbname_by_dtuname failed:' + e.__str__(), True)
        return rt

    def getTableListInRedis(self):
        tableList = RedisManager.get_table_list()
        if not tableList:
            allNames = self.getAllMysqlTableNames()
            if allNames:
                RedisManager.set_table_list(allNames)
                tableList = RedisManager.get_table_list()
        return tableList

    def createRepairHisTempTableIfNotExist(self, tableName):
        tableList = self.getTableListInRedis()
        dbName = app.config.get('DATABASE_BUFFER')
        if tableList:
            if tableName in tableList:
                return True

            try:
                if isinstance(tableName, str):
                    if len(tableName) > 0:
                        sql = "CREATE TABLE IF NOT EXISTS %s (\
                                `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\
                                `pointname` varchar(128) NOT NULL DEFAULT '',\
                                `timeformat` varchar(16) NOT NULL DEFAULT '',\
                                `pointvalue` text,\
                                PRIMARY KEY (`time`,`pointname`,`timeformat`)\
                           ) ENGINE=InnoDB DEFAULT CHARSET=utf8" % (tableName,)
                        result = self._mysqlDBContainer.op_db_update(dbName, sql, ())
                        if result:
                            tableList.append(tableName)
                            RedisManager.set_table_list(tableList)
                            return True
                        else:

                            BEOPDataAccess._logger.writeLog('auto create table %s failed' % (tableName,), True)
            except Exception as e:

                BEOPDataAccess._logger.writeLog('createRepairHisTempTableIfNotExist error:' + e.__str__(), True)
                return False
        return False

    def getTableFields(self, rtTableName):
        rt = []
        confdb = app.config.get('DATABASE')
        try:
            sql = "select COLUMN_NAME from information_schema.COLUMNS where table_name = '%s';" % (rtTableName,)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(confdb, sql, ())
            for item in dbrv:
                rt.append(item[0])
        except Exception as e:
            print(e)
        return rt

    def AddFieldDTUName(self, rtTableName):
        rt = True
        confdb = app.config.get('DATABASE')
        try:
            sql = "alter table %s add dtuname varchar(256) NOT NULL DEFAULT ''" % (rtTableName,)
            rt = self._mysqlDBContainer.op_db_update(confdb, sql, ())
        except Exception as e:
            rt = False
            print(e)
        return rt

    def createRTTableIfNotExist(self, rtTableName):
        result = True
        tableList = self.getTableListInRedis()
        if tableList:
            if rtTableName not in tableList:
                confdb = app.config.get('DATABASE')
                try:
                    if isinstance(rtTableName, str):
                        if len(rtTableName) > 0:
                            sql = "CREATE TABLE IF NOT EXISTS %s (`time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,pointname varchar(128) NOT NULL DEFAULT '',\
                                pointvalue varchar(256) NOT NULL DEFAULT '',flag int(11) DEFAULT NULL,PRIMARY KEY (pointname)) ENGINE=InnoDB DEFAULT CHARSET=utf8;" % (
                            rtTableName,)
                            result = self._mysqlDBContainer.op_db_update(confdb, sql, ())
                            if result:
                                BEOPDataAccess._logger.writeLog('auto create table %s' % (rtTableName,), True)
                                tableList.append(rtTableName)
                                RedisManager.set_table_list(tableList)
                except Exception as e:
                    result = False

                    BEOPDataAccess._logger.writeLog('createRTTableIfNotExist failed:' + e.__str__(), True)
        return result

    def createWarningrdTableIfNotExist(self, WarningrdTableName):
        result = True
        tableList = self.getTableListInRedis()
        if tableList:
            if WarningrdTableName not in tableList:
                confdb = app.config.get('DATABASE')
                try:
                    if isinstance(WarningrdTableName, str):
                        if len(WarningrdTableName) > 0:
                            sql = "CREATE TABLE IF NOT EXISTS %s (\
                                  `time` timestamp NOT NULL DEFAULT '2000-01-01 00:00:00',\
                                  code int(10) unsigned NOT NULL DEFAULT '0',\
                                  info varchar(1024) NOT NULL DEFAULT '',\
                                  `level` int(10) unsigned NOT NULL DEFAULT '0',\
                                  endtime timestamp NOT NULL DEFAULT '2000-01-01 00:00:00',\
                                  confirmed int(10) unsigned NOT NULL DEFAULT '0',\
                                  confirmeduser varchar(2000) NOT NULL DEFAULT '',\
                                  bindpointname varchar(255) DEFAULT NULL\
                                ) ENGINE=InnoDB DEFAULT CHARSET=utf8;" % (WarningrdTableName,)
                            result = self._mysqlDBContainer.op_db_update(confdb, sql, ())
                            if result:
                                BEOPDataAccess._logger.writeLog('auto create table %s' % (WarningrdTableName,), True)
                                tableList.append(WarningrdTableName)
                                RedisManager.set_table_list(tableList)
                except Exception as e:
                    result = False

                    BEOPDataAccess._logger.writeLog('createWarningrdTableIfNotExist failed:' + e.__str__(), True)
        return result

    def createConfigTableIfNotExist(self, ConfigTableName):
        result = True
        tableList = self.getTableListInRedis()
        if tableList:
            if ConfigTableName not in tableList:
                confdb = app.config.get('DATABASE')
                try:
                    if isinstance(ConfigTableName, str):
                        if len(ConfigTableName) > 0:
                            sql = "CREATE TABLE IF NOT EXISTS %s (\
                                   paramname varchar(255) DEFAULT NULL,\
                                   paramvalue varchar(255) DEFAULT NULL\
                                ) ENGINE=InnoDB DEFAULT CHARSET=utf8;" % (ConfigTableName,)
                            result = self._mysqlDBContainer.op_db_update(confdb, sql, ())
                            if result:
                                BEOPDataAccess._logger.writeLog('auto create table %s' % (ConfigTableName,), True)
                                tableList.append(ConfigTableName)
                                RedisManager.set_table_list(tableList)
                except Exception as e:
                    result = False

                    BEOPDataAccess._logger.writeLog('createConfigTableIfNotExist failed:' + e.__str__(), True)
        return result

    def createOprecordTableIfNotExist(self, OprecordTableName):
        result = True
        tableList = self.getTableListInRedis()
        if tableList:
            if OprecordTableName not in tableList:
                confdb = app.config.get('DATABASE')
                try:
                    if isinstance(OprecordTableName, str):
                        if len(OprecordTableName) > 0:
                            sql = "CREATE TABLE IF NOT EXISTS %s (\
                                  RecordTime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\
                                  `user` varchar(128) NOT NULL DEFAULT '',\
                                  OptRemark varchar(256) NOT NULL DEFAULT ''\
                                ) ENGINE=InnoDB DEFAULT CHARSET=utf8;" % (OprecordTableName,)
                            result = self._mysqlDBContainer.op_db_update(confdb, sql, ())
                            if result:
                                BEOPDataAccess._logger.writeLog('auto create table %s' % (OprecordTableName,), True)
                                tableList.append(OprecordTableName)
                                RedisManager.set_table_list(tableList)
                except Exception as e:
                    result = False

                    BEOPDataAccess._logger.writeLog('createOprecordTable failed:' + e.__str__(), True)
        return result

    def updateDTUProjectInfo(self, data):
        confdb = app.config.get('DATABASE')
        rt = True
        try:
            strSQL = "update dtuserver_prj_info set "
            if 'id' in data:
                for index, key in enumerate(data):
                    if key == 'id':
                        continue
                    strSQL += key
                    strSQL += "="
                    if isinstance(data.get(key), str):
                        strSQL += "'" + data.get(key) + "'"
                    else:
                        strSQL += str(data.get(key))
                    if index != len(data) - 1:
                        strSQL += ","
                strSQL += " where id=" + str(data.get('id'))
                rt = self._mysqlDBContainer.op_db_update(confdb, strSQL, ())
                if rt:
                    dtuserverInfoList = RedisManager.get_dtuserver_list()
                    if dtuserverInfoList:
                        for item in dtuserverInfoList:
                            if item.get('id') == data.get('id'):
                                item.update(**data)
                                RedisManager.set_dtuserver_list(dtuserverInfoList)
                                break
            else:
                rt = False
        except Exception as e:
            rt = False

            BEOPDataAccess._logger.writeLog('updateDTUProjectInfo failed:' + e.__str__(), True)
        return rt

    def updateDTUProject(self, data):
        confdb = app.config.get('DATABASE')
        rt = True
        try:
            strSQL = "update dtuserver_prj set "
            if 'id' in data:
                for index, key in enumerate(data):
                    if key == 'id':
                        continue
                    strSQL += key
                    strSQL += "="
                    if isinstance(data.get(key), str):
                        strSQL += "'" + data.get(key) + "'"
                    else:
                        strSQL += str(data.get(key))
                    if index != len(data) - 1:
                        strSQL += ","
                strSQL += " where id=" + str(data.get('id'))
                rt = self._mysqlDBContainer.op_db_update(confdb, strSQL, ())
                if rt:
                    dtuserverList = RedisManager.get_dtuserver_list()
                    if dtuserverList:
                        for item in dtuserverList:
                            if item.get('id') == data.get('id'):
                                item.update(**data)
                                RedisManager.set_dtuserver_list(dtuserverList)
                                break
            else:
                rt = False
        except Exception as e:
            rt = False

            BEOPDataAccess._logger.writeLog('updateDTUProject failed:' + e.__str__(), True)
        return rt

    def getDTUProjectInfoList(self):
        confdb = app.config.get('DATABASE')
        rt = []
        try:
            sql = "select id,online,dberr,LostCount,LostMinute,UnReceiveMinute,ReceivePointCount,LostPackageCount," \
                  "StartTime,LastOnlineTime,LastReceivedTime,FileRec,FileSend,RecHistoryCount,NeedHistroyCount,remark from dtuserver_prj_info"
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(confdb, sql, ())
            if dbrv:
                for item in dbrv:
                    rt.append({'id': item[0], 'online': item[1], 'dberr': item[2], 'LostCount': item[3],
                               'LostMinute': item[4],
                               'UnReceiveMinute': item[5], 'ReceivePointCount': item[6], 'LostPackageCount': item[7],
                               'StartTime': item[8], 'LastOnlineTime': item[9], 'LastReceivedTime': item[10],
                               'FileRec': item[11],
                               'FileSend': item[12], 'RecHistoryCount': item[13], 'NeedHistroyCount': item[14],
                               'remark': item[15]})
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getDTUProjectInfoList failed:' + e.__str__(), True)
        return rt

    def getDTUProjectList(self):
        confdb = app.config.get('DATABASE')
        rt = []
        try:
            sql = "select id,dtuname,dbip,dbuser,dbname,dbpsw,dtuRemark,bSendData,nSendType," \
                  "nSendDataInterval,bSendEmail,nLastSendHour,nReSendType,synRealTable,bDTUProject from dtuserver_prj"

            dbrv = self._mysqlDBContainerReadOnly.op_db_query(confdb, sql, ())
            if dbrv:
                for item in dbrv:
                    rt.append({'id': item[0], 'dtuname': item[1], 'dbip': item[2], 'dbuser': item[3], 'dbname': item[4],
                               'dbpsw': item[5], 'dtuRemark': item[6], 'bSendData': item[7], 'nSendType': item[8],
                               'nSendDataInterval': item[9],
                               'bSendEmail': item[10], 'nLastSendHour': item[11], 'nReSendType': item[12],
                               'synRealTable': item[13], 'bDTUProject': item[14]})
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getDTUProjectList failed:' + e.__str__(), True)
        return rt

    def removeDTUProjectInfo(self, id):
        confdb = app.config.get('DATABASE')
        rt = True
        try:
            sql = 'delete from dtuserver_prj_info where id=%d' % (id,)
            rt = self._mysqlDBContainer.op_db_update(confdb, sql, ())
            if rt:
                dtuserverInfoList = RedisManager.get_dtuserver_list()
                if dtuserverInfoList:
                    for index, item in enumerate(dtuserverInfoList):
                        if item.get('id') == id:
                            re = dtuserverInfoList.pop(index)
                            assert re == item
                            RedisManager.set_dtuserver_list(dtuserverInfoList)
                            break
            else:

                BEOPDataAccess._logger.writeLog('removeDTUProjectInfo:sql=%s execute failed' % (sql,), True)
        except Exception as e:
            rt = False

            BEOPDataAccess._logger.writeLog('removeDTUProjectInfo failed:' + e.__str__(), True)
        return rt

    def removeDTUProject(self, id):
        confdb = app.config.get('DATABASE')
        rt = True
        try:
            sql = 'delete from dtuserver_prj where id=%d' % (id,)
            rt = self._mysqlDBContainer.op_db_update(confdb, sql, ())
            if rt:
                dtuserverList = RedisManager.get_dtuserver_list()
                if dtuserverList:
                    for index, item in enumerate(dtuserverList):
                        if item.get('id') == id:
                            re = dtuserverList.pop(index)
                            assert re == item
                            RedisManager.set_dtuserver_list(dtuserverList)
                            break
            else:

                BEOPDataAccess._logger.writeLog('removeDTUProject:sql=%s execute failed' % (sql,), True)
        except Exception as e:
            rt = False

            BEOPDataAccess._logger.writeLog('removeDTUProject failed:' + e.__str__(), True)
        return rt

    def insertDTUProjectInfo(self, data):
        confdb = app.config.get('DATABASE')
        rt = True
        try:
            strSQL = "insert into dtuserver_prj_info("
            if 'id' not in data:
                for index, key in enumerate(data):
                    strSQL += key
                    if index != len(data) - 1:
                        strSQL += ","
                strSQL += ") values("
                for index, key in enumerate(data):
                    if isinstance(data.get(key), str):
                        strSQL += "'" + data.get(key) + "'"
                    else:
                        strSQL += str(data.get(key))
                    if index != len(data) - 1:
                        strSQL += ","
                strSQL += ")"
                rt = self._mysqlDBContainer.op_db_update(confdb, strSQL, ())
                if rt:
                    dtuserverInfoList = RedisManager.get_dtuserver_list()
                    if dtuserverInfoList:
                        dtuserverInfoList.append(data)
                        RedisManager.set_dtuserver_list(dtuserverInfoList)
            else:

                BEOPDataAccess._logger.writeLog('insertDTUProjectInfo:id not in data', True)
                rt = False
        except Exception as e:
            rt = False

            BEOPDataAccess._logger.writeLog('insertDTUProjectInfo failed:' + e.__str__(), True)
        return rt

    def insertDTUProject(self, data):
        confdb = app.config.get('DATABASE')
        rt = True
        try:
            strSQL = "insert into dtuserver_prj("
            if 'id' not in data:
                for index, key in enumerate(data):
                    strSQL += key
                    if index != len(data) - 1:
                        strSQL += ","
                strSQL += ") values("
                for index, key in enumerate(data):
                    if isinstance(data.get(key), str):
                        strSQL += "'" + data.get(key) + "'"
                    else:
                        strSQL += str(data.get(key))
                    if index != len(data) - 1:
                        strSQL += ","
                strSQL += ")"
                rt = self._mysqlDBContainer.op_db_update(confdb, strSQL, ())
                if rt:
                    dtuserverList = RedisManager.get_dtuserver_list()
                    if dtuserverList:
                        dtuserverList.append(data)
                        RedisManager.set_dtuserver_list(dtuserverList)
            else:

                BEOPDataAccess._logger.writeLog('insertDTUProject:id not in data', True)
                rt = False
        except Exception as e:
            rt = False

            BEOPDataAccess._logger.writeLog('updateDTUProjectInfo failed:' + e.__str__(), True)
        return rt

    def multiUpdateDTUProjectInfo(self, data):
        # {'dtuname':['sh01','sh02',...],'field':['online', 'LastOnlineTime', 'LastReceivedTime'],'value':[['1','','3'],['4','5','6'],...]}
        rt = True
        try:
            confdb = app.config.get('DATABASE')
            dtunameList = data.get('dtuname', [])
            fieldList = data.get('field', [])
            valueList = data.get('value', [])
            dtuIdList = list(map(self.getIdByDUTNameInMemcache, dtunameList))
            if dtuIdList and fieldList and valueList:
                if len(dtuIdList) == len(valueList):
                    for index, id in enumerate(dtuIdList):
                        sql_insert = "insert into dtuserver_prj_info(id,"
                        for item in fieldList:
                            sql_insert += item + ","
                        sql_insert = sql_insert[:-1]
                        sql_insert += ") values(" + str(id) + ","
                        sql_update = "update dtuserver_prj_info set "
                        for index_sub in range(len(fieldList)):
                            sql_insert += "'" + valueList[index][index_sub] + "'" + ","
                            if valueList[index][index_sub]:
                                sql_update += fieldList[index_sub] + "=" + "'" + valueList[index][index_sub] + "'" + ","
                        sql_insert = sql_insert[:-1]
                        sql_insert += ")"
                        sql_update = sql_update[:-1]
                        sql_update += " where id=%d" % (id,)
                        sql_select = "select * from dtuserver_prj_info where id=%d" % (id,)
                        if not self._mysqlDBContainerReadOnly.op_db_query(confdb, sql_select):
                            rt = self._mysqlDBContainer.op_db_update(confdb, sql_insert, ())
                        else:
                            rt = self._mysqlDBContainer.op_db_update(confdb, sql_update, ())
        except Exception as e:
            rt = False

            BEOPDataAccess._logger.writeLog('multiUpdateDTUProjectInfo failed:' + e.__str__(), True)
        return rt

    def getIdByDUTNameInMemcache(self, name):
        try:
            dtuserverList = RedisManager.get_dtuserver_list()
            if dtuserverList:
                for item in dtuserverList:
                    if item.get('dtuname') == name:
                        return item.get('id')
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getIdByDUTNameInMemcache failed:' + e.__str__(), True)

        BEOPDataAccess._logger.writeLog('getIdByDUTNameInMemcache:return id=0, when dtuname=%s' % (name,), True)
        return 0

    def createTableDiagnosisZonesIfNotExist(self, DiagnosisZonesTableName):
        result = True
        tableList = self.getTableListInRedis()
        if tableList:
            if DiagnosisZonesTableName not in tableList:
                try:
                    if isinstance(DiagnosisZonesTableName, str):
                        if len(DiagnosisZonesTableName) > 0:
                            sql = "CREATE TABLE IF NOT EXISTS %s (\
                                  Id int(10) unsigned NOT NULL,\
                                  PageId int(10) unsigned NOT NULL,\
                                  CampusId int(10) unsigned NOT NULL,\
                                  BuildingId int(10) unsigned NOT NULL,\
                                  SubBuildingId int(10) unsigned NOT NULL,\
                                  CampusName varchar(45) NOT NULL,\
                                  BuildingName varchar(45) NOT NULL,\
                                  SubBuildingName varchar(45) NOT NULL,\
                                  Image varchar(45) DEFAULT NULL,\
                                  Project text,\
                                  `Count` int(11) NOT NULL DEFAULT '0',\
                                  PRIMARY KEY (Id)\
                                ) ENGINE=InnoDB DEFAULT CHARSET=utf8;" % (DiagnosisZonesTableName,)
                            result = self._mysqlDBContainer.op_db_update('diagnosis', sql, ())
                            if result:
                                BEOPDataAccess._logger.writeLog('auto create table %s' % (DiagnosisZonesTableName,),
                                                                True)
                                tableList.append(DiagnosisZonesTableName)
                                RedisManager.set_table_list(tableList)
                except Exception as e:
                    result = False

                    BEOPDataAccess._logger.writeLog('createTableDiagnosisZonesIfNotExist failed:' + e.__str__(), True)
        else:

            BEOPDataAccess._logger.writeLog('createTableDiagnosisZonesIfNotExist:tableList is not in memcache', True)
        return result

    def createTableDiagnosisZonesIfNotExistFactory(self, DiagnosisZonesTableName):
        result = True
        tableList = self.getTableListInRedis()
        if tableList:
            if DiagnosisZonesTableName not in tableList:
                try:
                    if isinstance(DiagnosisZonesTableName, str):
                        if len(DiagnosisZonesTableName) > 0:
                            sql = "CREATE TABLE IF NOT EXISTS %s (\
                                  Id int(10) unsigned NOT NULL,\
                                  PageId varchar(45) NOT NULL,\
                                  CampusId int(10) unsigned NOT NULL,\
                                  BuildingId int(10) unsigned NOT NULL,\
                                  SubBuildingId int(10) unsigned NOT NULL,\
                                  CampusName varchar(45) NOT NULL,\
                                  BuildingName varchar(45) NOT NULL,\
                                  SubBuildingName varchar(45) NOT NULL,\
                                  Image varchar(45) DEFAULT NULL,\
                                  Project text,\
                                  `Count` int(11) NOT NULL DEFAULT '0',\
                                  PRIMARY KEY (Id)\
                                ) ENGINE=InnoDB DEFAULT CHARSET=utf8;" % (DiagnosisZonesTableName,)
                            result = self._mysqlDBContainer.op_db_update('diagnosis', sql, ())
                            if result:
                                BEOPDataAccess._logger.writeLog('auto create table %s' % (DiagnosisZonesTableName,),
                                                                True)
                                tableList.append(DiagnosisZonesTableName)
                                RedisManager.set_table_list(tableList)
                except Exception as e:
                    result = False

                    BEOPDataAccess._logger.writeLog('createTableDiagnosisZonesIfNotExistFactory failed:' + e.__str__(),
                                                    True)
        else:

            BEOPDataAccess._logger.writeLog('createTableDiagnosisZonesIfNotExistFactory:tableList is not in memcache',
                                            True)
        return result

    def createTableDiagnosisEquipmentsIfNotExist(self, DiagnosisEquipmentsTableName):
        result = True
        tableList = self.getTableListInRedis()
        if tableList:
            if DiagnosisEquipmentsTableName not in tableList:
                try:
                    if isinstance(DiagnosisEquipmentsTableName, str):
                        if len(DiagnosisEquipmentsTableName) > 0:
                            sql = "CREATE TABLE IF NOT EXISTS %s (\
                                  Id int(10) unsigned NOT NULL AUTO_INCREMENT,\
                                  Name varchar(45) NOT NULL,\
                                  PageId varchar(45) DEFAULT NULL,\
                                  ZoneId int(10) unsigned DEFAULT NULL,\
                                  SystemId int(10) unsigned DEFAULT NULL,\
                                  SubSystemId int(10) unsigned DEFAULT NULL,\
                                  SystemName varchar(45) DEFAULT NULL,\
                                  SubSystemName varchar(45) DEFAULT NULL,\
                                  Project text,\
                                  ModalTextId int(10) unsigned DEFAULT NULL,\
                                  PRIMARY KEY (Id)\
                                ) ENGINE=InnoDB DEFAULT CHARSET=utf8;" % (DiagnosisEquipmentsTableName,)
                            result = self._mysqlDBContainer.op_db_update('diagnosis', sql, ())
                            if result:
                                BEOPDataAccess._logger.writeLog(
                                    'auto create table %s' % (DiagnosisEquipmentsTableName,), True)
                                tableList.append(DiagnosisEquipmentsTableName)
                                RedisManager.set_table_list(tableList)
                except Exception as e:
                    result = False

                    BEOPDataAccess._logger.writeLog('createTableDiagnosisEquipmentsIfNotExist failed:' + e.__str__(),
                                                    True)
        else:

            BEOPDataAccess._logger.writeLog('createTableDiagnosisEquipmentsIfNotExist:tableList is not in memcache',
                                            True)
        return result

    def createTableDiagnosisFaultsIfNotExist(self, DiagnosisFaultsTableName):
        result = True
        tableList = self.getTableListInRedis()
        if tableList:
            if DiagnosisFaultsTableName not in tableList:
                try:
                    if isinstance(DiagnosisFaultsTableName, str):
                        if len(DiagnosisFaultsTableName) > 0:
                            sql = "CREATE TABLE IF NOT EXISTS %s (\
                                  Id bigint(20) unsigned NOT NULL,\
                                  ParentId int(10) DEFAULT NULL,\
                                  Name varchar(100) NOT NULL,\
                                  Description text,\
                                  Points text,\
                                  EquipmentId int(10) unsigned DEFAULT NULL,\
                                  DefaultGrade int(10) unsigned NOT NULL,\
                                  IsUserDefined tinyint(1) DEFAULT NULL,\
                                  UserId int(10) unsigned DEFAULT NULL,\
                                  UserFaultGrade int(11) unsigned DEFAULT NULL,\
                                  UserFaultDelay datetime DEFAULT NULL,\
                                  UserModifyTime datetime DEFAULT NULL,\
                                  UserEnable tinyint(1) DEFAULT NULL,\
                                  Project text,\
                                  NoticeId bigint(20) unsigned DEFAULT NULL,\
                                  PRIMARY KEY (Id)\
                                ) ENGINE=InnoDB DEFAULT CHARSET=utf8;" % (DiagnosisFaultsTableName,)
                            result = self._mysqlDBContainer.op_db_update('diagnosis', sql, ())
                            if result:
                                BEOPDataAccess._logger.writeLog('auto create table %s' % (DiagnosisFaultsTableName,),
                                                                True)
                                tableList.append(DiagnosisFaultsTableName)
                                RedisManager.set_table_list(tableList)
                except Exception as e:
                    result = False

                    BEOPDataAccess._logger.writeLog('createTableDiagnosisFaultsIfNotExist failed:' + e.__str__(), True)
        else:

            BEOPDataAccess._logger.writeLog('createTableDiagnosisFaultsIfNotExist:tableList is not in memcache', True)
        return result

    def createTableDiagnosisEnableIfNotExist(self, DiagnosisEnableTableName):
        result = True
        tableList = self.getTableListInRedis()
        if tableList:
            if DiagnosisEnableTableName not in tableList:
                try:
                    if isinstance(DiagnosisEnableTableName, str):
                        if len(DiagnosisEnableTableName) > 0:
                            sql = "CREATE TABLE IF NOT EXISTS %s (\
                                  ID int(11) NOT NULL AUTO_INCREMENT,\
                                  Name text,\
                                  StartTime datetime DEFAULT NULL,\
                                  EndTime datetime DEFAULT NULL,\
                                  EquipList text,\
                                  ModifyTime datetime DEFAULT NULL,\
                                  Project text,\
                                  Enable int(11) DEFAULT NULL,\
                                  PRIMARY KEY (ID),\
                                  UNIQUE KEY ID (ID)\
                                ) ENGINE=InnoDB DEFAULT CHARSET=utf8;" % (DiagnosisEnableTableName,)
                            result = self._mysqlDBContainer.op_db_update('diagnosis', sql, ())
                            if result:
                                BEOPDataAccess._logger.writeLog('auto create table %s' % (DiagnosisEnableTableName,),
                                                                True)
                                tableList.append(DiagnosisEnableTableName)
                                RedisManager.set_table_list(tableList)
                except Exception as e:
                    result = False

                    BEOPDataAccess._logger.writeLog('createTableDiagnosisEnableIfNotExist failed:' + e.__str__(), True)
        else:

            BEOPDataAccess._logger.writeLog('createTableDiagnosisEnableIfNotExist:tableList is not in memcache', True)
        return result

    def createTableDiagnosisLimitIfNotExist(self, DiagnosisLimitTableName):
        result = True
        tableList = self.getTableListInRedis()
        if tableList:
            if DiagnosisLimitTableName not in tableList:
                try:
                    if isinstance(DiagnosisLimitTableName, str):
                        if len(DiagnosisLimitTableName) > 0:
                            sql = "CREATE TABLE IF NOT EXISTS %s (\
                                  ID int(11) NOT NULL AUTO_INCREMENT,\
                                  Name text,\
                                  StartTime datetime DEFAULT NULL,\
                                  EndTime datetime DEFAULT NULL,\
                                  EquipList text,\
                                  ModifyTime datetime DEFAULT NULL,\
                                  Project text,\
                                  Enable int(11) DEFAULT NULL,\
                                  PRIMARY KEY (ID),\
                                  UNIQUE KEY ID (ID)\
                                ) ENGINE=InnoDB DEFAULT CHARSET=utf8;" % (DiagnosisLimitTableName,)
                            result = self._mysqlDBContainer.op_db_update('diagnosis', sql, ())
                            if result:
                                BEOPDataAccess._logger.writeLog('auto create table %s' % (DiagnosisLimitTableName,),
                                                                True)
                                tableList.append(DiagnosisLimitTableName)
                                RedisManager.set_table_list(tableList)
                except Exception as e:
                    result = False

                    BEOPDataAccess._logger.writeLog('createTableDiagnosisLimitIfNotExist failed:' + e.__str__(), True)
        else:

            BEOPDataAccess._logger.writeLog('createTableDiagnosisLimitIfNotExist:tableList is not in memcache', True)
        return result

    def createTableDiagnosisNoticesIfNotExist(self, DiagnosisNoticesTableName):
        result = True
        tableList = self.getTableListInRedis()
        if tableList:
            if DiagnosisNoticesTableName not in tableList:
                try:
                    if isinstance(DiagnosisNoticesTableName, str):
                        if len(DiagnosisNoticesTableName) > 0:
                            sql = "CREATE TABLE IF NOT EXISTS %s (\
                                  Id int(10) unsigned NOT NULL AUTO_INCREMENT,\
                                  FaultId bigint(10) unsigned NOT NULL,\
                                  Time datetime NOT NULL,\
                                  OrderId int(10) unsigned DEFAULT NULL,\
                                  Energy text,\
                                  Detail text,\
                                  Status varchar(50) DEFAULT NULL,\
                                  Project text,\
                                  CheckTime datetime DEFAULT NULL,\
                                  Operator int(11) DEFAULT NULL,\
                                  `EndTime` datetime DEFAULT NULL,\
                                  PRIMARY KEY (Id),\
                                  KEY time (Time) USING BTREE\
                                ) ENGINE=InnoDB DEFAULT CHARSET=utf8;" % (DiagnosisNoticesTableName,)
                            result = self._mysqlDBContainer.op_db_update('diagnosis', sql, ())
                            if result:
                                BEOPDataAccess._logger.writeLog('auto create table %s' % (DiagnosisNoticesTableName,),
                                                                True)
                                tableList.append(DiagnosisNoticesTableName)
                                RedisManager.set_table_list(tableList)
                except Exception as e:
                    result = False

                    BEOPDataAccess._logger.writeLog('createTableDiagnosisNoticesIfNotExist failed:' + e.__str__(), True)
        else:

            BEOPDataAccess._logger.writeLog('createTableDiagnosisNoticesIfNotExist:tableList is not in memcache', True)
        return result

    def createTableDiagnosisOrderIfNotExist(self, DiagnosisOrderTableName):
        result = True
        tableList = self.getTableListInRedis()
        if tableList:
            if DiagnosisOrderTableName not in tableList:
                try:
                    if isinstance(DiagnosisOrderTableName, str):
                        if len(DiagnosisOrderTableName) > 0:
                            sql = "CREATE TABLE IF NOT EXISTS %s (\
                                  ID int(11) NOT NULL AUTO_INCREMENT,\
                                  Name text,\
                                  OperatorID int(11) DEFAULT NULL,\
                                  GroupID int(11) DEFAULT NULL,\
                                  FaultGrade int(11) DEFAULT NULL,\
                                  EquipList text,\
                                  ModifyTime datetime DEFAULT NULL,\
                                  Project text,\
                                  Enable int(11) DEFAULT NULL,\
                                  PRIMARY KEY (ID)\
                                ) ENGINE=InnoDB DEFAULT CHARSET=utf8;" % (DiagnosisOrderTableName,)
                            result = self._mysqlDBContainer.op_db_update('diagnosis', sql, ())
                            if result:
                                BEOPDataAccess._logger.writeLog('auto create table %s' % (DiagnosisOrderTableName,),
                                                                True)
                                tableList.append(DiagnosisOrderTableName)
                                RedisManager.set_table_list(tableList)
                except Exception as e:
                    result = False

                    BEOPDataAccess._logger.writeLog('createTableDiagnosisOrderIfNotExist failed:' + e.__str__(), True)
        else:

            BEOPDataAccess._logger.writeLog('createTableDiagnosisOrderIfNotExist:tableList is not in memcache', True)
        return result

    def getAllRTTableNames(self):
        rt = []
        try:
            sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'beopdoengine' and TABLE_NAME like 'rtdata_beopdata_%%'"
            ret = self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)
            if ret:
                rt = [x[0] for x in ret]
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getAllRTTableNames failed:' + e.__str__(), True)
        return rt

    # yan add 2016-7-6
    def getAllHisdataTableNamesFromBuffer(self):
        rt = []
        try:
            sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'beopdatabuffer' and TABLE_NAME like 'hisdata_%%'"
            ret = self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)
            if ret:
                rt = [x[0] for x in ret]
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getAllHisdataTableNamesFromBuffer failed:' + e.__str__(), True)
        return rt

    def getAllRTdataTableNamesFromBuffer(self):
        rt = []
        try:
            sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'beopdatabuffer' and TABLE_NAME like 'rtdata_%%'"
            ret = self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)
            if ret:
                rt = [x[0] for x in ret]
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getAllRTdataTableNamesFromBuffer failed:' + e.__str__(), True)
        return rt

    def getAllConfigTableNames(self):
        rt = []
        try:
            sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'beopdoengine' and TABLE_NAME like 'config_beopdata_%%'"
            ret = self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)
            if ret:
                rt = [x[0] for x in ret]
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getAllConfigTableNames failed:' + e.__str__(), True)
        return rt

    def getAllOpRecordTableNames(self):
        rt = []
        try:
            sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'beopdoengine' and TABLE_NAME like 'oprecord_beopdata_%%'"
            ret = self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)
            if ret:
                rt = [x[0] for x in ret]
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getAllOpRecordTableNames failed:' + e.__str__(), True)
        return rt

    def getAllWarningTableNames(self):
        rt = []
        try:
            sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'beopdoengine' and TABLE_NAME like 'warningrd_beopdata_%%'"
            ret = self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)
            if ret:
                rt = [x[0] for x in ret]
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getAllWarningTableNames failed:' + e.__str__(), True)
        return rt

    def getAllDiagnosisZonesTableNames(self):
        rt = []
        try:
            sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'diagnosis' and TABLE_NAME like 'beopdata_%%_diagnosis_zones'"
            ret = self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)
            if ret:
                rt = [x[0] for x in ret]
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getAllDiagnosisZonesTableNames failed:' + e.__str__(), True)
        return rt

    def getAllDiagnosisEquipmentsTableNames(self):
        rt = []
        try:
            sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'diagnosis' and TABLE_NAME like 'beopdata_%%_diagnosis_equipments'"
            ret = self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)
            if ret:
                rt = [x[0] for x in ret]
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getAllDiagnosisEquipmentsTableNames failed:' + e.__str__(), True)
        return rt

    def getAllDiagnosisFaultsTableNames(self):
        rt = []
        try:
            sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'diagnosis' and TABLE_NAME like 'beopdata_%%_diagnosis_faults'"
            ret = self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)
            if ret:
                rt = [x[0] for x in ret]
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getAllDiagnosisFaultsTableNames failed:' + e.__str__(), True)
        return rt

    def getAllDiagnosisEnableTableNames(self):
        rt = []
        try:
            sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'diagnosis' and TABLE_NAME like 'beopdata_%%_diagnosis_enable'"
            ret = self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)
            if ret:
                rt = [x[0] for x in ret]
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getAllDiagnosisEnableTableNames failed:' + e.__str__(), True)
        return rt

    def getAllDiagnosisLimitTableNames(self):
        rt = []
        try:
            sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'diagnosis' and TABLE_NAME like 'beopdata_%%_diagnosis_limit'"
            ret = self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)
            if ret:
                rt = [x[0] for x in ret]
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getAllDiagnosisLimitTableNames failed:' + e.__str__(), True)
        return rt

    def getAllDiagnosisNoticesTableNames(self):
        rt = []
        try:
            sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'diagnosis' and TABLE_NAME like 'beopdata_%%_diagnosis_notices'"
            ret = self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)
            if ret:
                rt = [x[0] for x in ret]
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getAllDiagnosisNoticesTableNames failed:' + e.__str__(), True)
        return rt

    def getAllDiagnosisOrderTableNames(self):
        rt = []
        try:
            sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'diagnosis' and TABLE_NAME like 'beopdata_%%_diagnosis_order'"
            ret = self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)
            if ret:
                rt = [x[0] for x in ret]
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getAllDiagnosisOrderTableNames failed:' + e.__str__(), True)
        return rt

    def getAllDiagnosisKPITableNames(self):
        rt = []
        try:
            sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'diagnosis' and TABLE_NAME like 'beopdata_%%_diagnosis_kpi_%%'"
            ret = self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)
            if ret:
                rt = [x[0] for x in ret]
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getAllDiagnosisKPITableNames failed:' + e.__str__(), True)
        return rt

    def getAllMysqlTableNames(self):
        rt = []
        try:
            rt.extend(self.getAllRTTableNames())
            rt.extend(self.getAllConfigTableNames())
            rt.extend(self.getAllOpRecordTableNames())
            rt.extend(self.getAllWarningTableNames())
            rt.extend(self.getAllDiagnosisZonesTableNames())
            rt.extend(self.getAllDiagnosisEquipmentsTableNames())
            rt.extend(self.getAllDiagnosisFaultsTableNames())
            rt.extend(self.getAllDiagnosisEnableTableNames())
            rt.extend(self.getAllDiagnosisLimitTableNames())
            rt.extend(self.getAllDiagnosisNoticesTableNames())
            rt.extend(self.getAllDiagnosisOrderTableNames())
            rt.extend(self.getAllDiagnosisKPITableNames())
            rt.extend(self.getAllHisdataTableNamesFromBuffer())
            rt.extend(self.getAllRTdataTableNamesFromBuffer())
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getAllMysqlTableNames failed:' + e.__str__(), True)
        return rt

    def getRealtimeOutputByProjId(self, projId):
        rt = []
        try:
            confdb = app.config.get('DATABASE')
            sql = 'select `time`, pointname, pointvalue from realtimedata_output_to_site where projectid=%s order by `time`' % (
            projId,)
            ret = self._mysqlDBContainerReadOnly.op_db_query(confdb, sql)
            if ret:
                for item in ret:
                    rt.append(
                        {'time': item[0].strftime('%Y-%m-%d %H:%M:%S'), 'pointname': item[1], 'pointvalue': item[2]})
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getRealtimeOutputByProjId failed:' + e.__str__(), True)
        return rt

    def resetDiagnosisTable(self, projId, suffix):
        rt = False
        try:
            tableName = ''
            if suffix in ['enable', 'equipments', 'faults', 'limit', 'notices', 'order', 'zones']:
                mysqlname = self.getMysqlNameById(projId)
                if mysqlname:
                    tableName = mysqlname + '_diagnosis_' + suffix
                    sql = 'delete from %s' % (tableName)
                    if self._mysqlDBContainer.op_db_update('diagnosis', sql, ()):
                        rt = True
        except Exception as e:

            BEOPDataAccess._logger.writeLog('resetDiagnosisTable failed:' + e.__str__(), True)
        return rt

    def initAllDiagnosisTables(self, projId):
        rt = False
        try:
            mysqlname = self.getMysqlNameById(projId)
            if mysqlname:
                self.createTableDiagnosisEnableIfNotExist(mysqlname + '_diagnosis_' + 'enable')
                self.resetDiagnosisTable(projId, 'enable')
                self.createTableDiagnosisFaultsIfNotExist(mysqlname + '_diagnosis_' + 'faults')
                self.resetDiagnosisTable(projId, 'faults')
                self.createTableDiagnosisEquipmentsIfNotExist(mysqlname + '_diagnosis_' + 'equipments')
                self.resetDiagnosisTable(projId, 'equipments')
                self.createTableDiagnosisLimitIfNotExist(mysqlname + '_diagnosis_' + 'limit')
                self.resetDiagnosisTable(projId, 'limit')
                self.createTableDiagnosisNoticesIfNotExist(mysqlname + '_diagnosis_' + 'notices')
                self.resetDiagnosisTable(projId, 'notices')
                self.createTableDiagnosisOrderIfNotExist(mysqlname + '_diagnosis_' + 'order')
                self.resetDiagnosisTable(projId, 'order')
                self.createTableDiagnosisZonesIfNotExist(mysqlname + '_diagnosis_' + 'zones')
                self.resetDiagnosisTable(projId, 'zones')
                rt = True
        except Exception as e:

            BEOPDataAccess._logger.writeLog('initAllDiagnosisTables failed:' + e.__str__(), True)
        return rt

    def getMaxId(self, tableName):
        rt = 0
        try:
            sql = "select max(Id) from %s" % (tableName,)
            ret = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', sql, ())
            if ret:
                if ret[0][0]:
                    rt = int(ret[0][0])
                else:
                    rt = 1
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getMaxId failed:' + e.__str__(), True)
        return rt

    def getZoneMaxCampusId(self, tableName):
        rt = 0
        try:
            sql = "select max(CampusId) from %s" % (tableName,)
            ret = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', sql, ())
            if ret:
                if ret[0][0]:
                    rt = int(ret[0][0])
                else:
                    rt = 1
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getZoneMaxCampusId failed:' + e.__str__(), True)
        return rt

    def getZoneMaxBuildingId(self, tableName):
        rt = 0
        try:
            sql = "select max(BuildingId) from %s" % (tableName,)
            ret = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', sql, ())
            if ret:
                if ret[0][0]:
                    rt = int(ret[0][0])
                else:
                    rt = 1
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getZoneMaxBuildingId failed:' + e.__str__(), True)
        return rt

    def getZoneMaxSubBuildingId(self, tableName):
        rt = 0
        try:
            sql = "select max(SubBuildingId) from %s" % (tableName,)
            ret = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', sql, ())
            if ret:
                if ret[0][0]:
                    rt = int(ret[0][0])
                else:
                    rt = 1
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getZoneMaxSubBuildingId failed:' + e.__str__(), True)
        return rt

    def addNoticeCheckZone(self, projId, buildingName, subBuildingName, pageId):
        # zondId,buildingId,subBuildingId
        rt = None
        try:
            CampusId = 1
            BuildingId = 1
            id = 1
            mysqlname = self.getMysqlNameById(projId)
            if mysqlname:
                tableName = mysqlname + '_diagnosis_' + 'zones'
                if isinstance(pageId, int):
                    self.createTableDiagnosisZonesIfNotExist(tableName)
                else:
                    self.createTableDiagnosisZonesIfNotExistFactory(tableName)
                if isinstance(pageId, int):
                    sql = "select Id,BuildingId,SubBuildingId from %s where BuildingName='%s' and SubBuildingName='%s' and PageId=%s and Project='%s'" % (
                    tableName, buildingName, subBuildingName, pageId, str(
                        projId))  # ,PageId,CampusId,BuildingId,SubBuildingId,CampusName,BuildingName,SubBuildingName,Image,Project,`Count`
                else:
                    sql = "select Id,BuildingId,SubBuildingId from %s where BuildingName='%s' and SubBuildingName='%s' and PageId='%s' and Project='%s'" % (
                    tableName, buildingName, subBuildingName, pageId, str(
                        projId))  # ,PageId,CampusId,BuildingId,SubBuildingId,CampusName,BuildingName,SubBuildingName,Image,Project,`Count`
                rv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', sql, ())
                if not rv:
                    id = self.getMaxId(tableName) + 1
                    sql = "select distinct CampusId, BuildingId, BuildingName from %s where BuildingName='%s'" % (
                    tableName, buildingName)
                    temprv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', sql, ())
                    if temprv:
                        CampusId = temprv[0][0]
                        BuildingId = temprv[0][1]
                    else:
                        CampusId = self.getZoneMaxCampusId(tableName) + 1
                        BuildingId = self.getZoneMaxBuildingId(tableName) + 1
                    if isinstance(pageId, int):
                        sql = "insert into %s(Id,PageId,CampusId,BuildingId,SubBuildingId,CampusName,BuildingName,SubBuildingName,Image,Project,`Count`) values(%s,%s,%s,%s,%s,'%s','%s','%s',NULL,'%s',0)" % (
                        tableName, id, pageId, CampusId, BuildingId, id, '', buildingName, subBuildingName, str(projId))
                    else:
                        sql = "insert into %s(Id,PageId,CampusId,BuildingId,SubBuildingId,CampusName,BuildingName,SubBuildingName,Image,Project,`Count`) values(%s,'%s',%s,%s,%s,'%s','%s','%s',NULL,'%s',0)" % (
                        tableName, id, pageId, CampusId, BuildingId, id, '', buildingName, subBuildingName, str(projId))
                    if self._mysqlDBContainer.op_db_update('diagnosis', sql, ()):
                        rt = id, BuildingId, id
                    else:
                        raise Exception('excute sql=%s failed' % (sql,))
                else:
                    rt = rv[0][0], rv[0][1], rv[0][2]
        except Exception as e:

            BEOPDataAccess._logger.writeLog('addNoticeCheckZone failed:' + e.__str__(), True)
        return rt

    def addNoticeCheckEquipment(self, projId, equipmentName, zoneId):
        rt = None
        try:
            mysqlname = self.getMysqlNameById(projId)
            if mysqlname:
                tableName = mysqlname + '_diagnosis_' + 'equipments'
                self.createTableDiagnosisEquipmentsIfNotExist(tableName)
                sql = "select Id from %s where Name='%s' and ZoneId=%s" % (tableName, equipmentName, zoneId)
                rv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', sql, ())
                if not rv:
                    sql = "insert into %s(Name,PageId,ZoneId,SystemId,SubSystemId,SystemName,SubSystemName,Project,ModalTextId) values('%s',0,%s,NULL,0,'','','%s',0)" % (
                    tableName, equipmentName, zoneId, str(projId))
                    if self._mysqlDBContainer.op_db_update('diagnosis', sql, ()):
                        id = self.getMaxId(tableName)
                        sql = "update %s set SystemId=%d where Id=%d" % (tableName, id, id)
                        if self._mysqlDBContainer.op_db_update('diagnosis', sql, ()):
                            rt = id
                    else:
                        raise Exception('excute sql=%s failed' % (sql,))
                else:
                    rt = rv[0][0]
        except Exception as e:

            BEOPDataAccess._logger.writeLog('addNoticeCheckEquipment failed:' + e.__str__(), True)
        return rt

    def addNoticeCheckFault(self, projId, faultName, faultDescription, equipmentId, grade, bindPoints):
        rt = None
        try:
            mysqlname = self.getMysqlNameById(projId)
            if mysqlname:
                point_str = ""
                if bindPoints:
                    for index, item in enumerate(bindPoints):
                        point_str += item + ','
                        if index != len(bindPoints) - 1:
                            point_str += "|"
                tableName = mysqlname + '_diagnosis_' + 'faults'
                self.createTableDiagnosisFaultsIfNotExist(tableName)
                sql = "select Id from %s where Name='%s' and EquipmentId=%s" % (tableName, faultName, equipmentId)
                rv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', sql, ())
                if not rv:
                    id = self.getMaxId(tableName) + 1
                    sql = "insert into %s(Id,ParentId,Name,Description,Points,EquipmentId,DefaultGrade,IsUserDefined,UserId,UserFaultGrade,UserFaultDelay,UserModifyTime,UserEnable,Project,NoticeId) VALUES" \
                          "(%s,%s,'%s','%s','%s',%s,%s,0,0,1,NOW(),NOW(),1,'%s',0)" % (
                          tableName, id, equipmentId, faultName, faultDescription, point_str, equipmentId, grade,
                          str(projId))
                    if self._mysqlDBContainer.op_db_update('diagnosis', sql, ()):
                        rt = self.getMaxId(tableName)
                    else:
                        raise Exception('excute sql=%s failed' % (sql,))
                else:
                    sql = "update %s set Description='%s', DefaultGrade=%d, Points='%s' where Name='%s' and EquipmentId=%s" % (
                    tableName, faultDescription, grade, point_str, faultName, equipmentId)
                    if not self._mysqlDBContainer.op_db_update('diagnosis', sql, ()):
                        raise Exception('excute sql=%s failed' % (sql,))
                    rt = rv[0][0]
        except Exception as e:
            BEOPDataAccess._logger.writeLog('addNoticeCheckFault failed:' + e.__str__(), True)
        return rt

    def addNoticeUpdateFault(self, projId, faultId, faultDescription, energy):
        rt = None
        try:
            mysqlname = self.getMysqlNameById(projId)
            if mysqlname:
                tableName = mysqlname + '_diagnosis_' + 'notices'
                self.createTableDiagnosisNoticesIfNotExist(tableName)
                tableNameFault = mysqlname + '_diagnosis_' + 'faults'
                self.createTableDiagnosisFaultsIfNotExist(tableNameFault)
                sql = "insert into %s(FaultId,Time,OrderId,Energy,Detail,Status,Project,CheckTime,Operator) VALUES" \
                      "(%d,NOW(),0,'%s','%s',1,'%s',NULL,NULL)" % (
                      tableName, faultId, energy, faultDescription, str(projId))
                if self._mysqlDBContainer.op_db_update('diagnosis', sql, ()):
                    id = self.getMaxId(tableName)
                    if id:
                        sql = "update %s set Description='%s', NoticeId=%d where Id=%d" % (
                        tableNameFault, faultDescription, id, faultId)
                        if self._mysqlDBContainer.op_db_update('diagnosis', sql, ()):
                            rt = id
        except Exception as e:

            BEOPDataAccess._logger.writeLog('addNotice failed:' + e.__str__(), True)
        return rt

    def createDiagnosisTableKPIStructureIfNotExist(self, tableName):
        result = True
        tableList = self.getTableListInRedis()
        if tableList:
            if tableName not in tableList:
                try:
                    if isinstance(tableName, str):
                        if len(tableName) > 0:
                            sql = "CREATE TABLE IF NOT EXISTS %s (\
                                  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,\
                                  `projId` int(10) NOT NULL DEFAULT '0',\
                                  `parentKPIId` int(10) NOT NULL DEFAULT '-1',\
                                  `name` varchar(255) NOT NULL DEFAULT '""',\
                                  `remark` varchar(255) NOT NULL DEFAULT '""',\
                                  `period` varchar(255) NOT NULL DEFAULT '""',\
                                  PRIMARY KEY (`id`)\
                                ) ENGINE=InnoDB DEFAULT CHARSET=utf8" % (tableName,)
                            result = self._mysqlDBContainer.op_db_update('diagnosis', sql, ())
                            if result:
                                BEOPDataAccess._logger.writeLog('auto create table %s' % (tableName,), True)
                                tableList.append(tableName)
                                RedisManager.set_table_list(tableList)
                except Exception as e:
                    result = False

                    BEOPDataAccess._logger.writeLog('createDiagnosisTableKPIStructureIfNotExist failed:' + e.__str__(),
                                                    True)
        return result

    def createDiagnosisTableKPIValueIfNotExist(self, tableName):
        result = True
        tableList = self.getTableListInRedis()
        if tableList:
            if tableName not in tableList:
                try:
                    if isinstance(tableName, str):
                        if len(tableName) > 0:
                            sql = "CREATE TABLE IF NOT EXISTS %s (\
                                 `kpiId` int(11) unsigned NOT NULL DEFAULT '0',\
                                 `kpiResult` varchar(255) NOT NULL DEFAULT '',\
                                 `periodTimeFrom` datetime DEFAULT NULL,\
                                 `periodTimeTo` datetime DEFAULT NULL\
                                ) ENGINE=InnoDB DEFAULT CHARSET=utf8" % (tableName,)
                            result = self._mysqlDBContainer.op_db_update('diagnosis', sql, ())
                            if result:
                                BEOPDataAccess._logger.writeLog('auto create table %s' % (tableName,), True)
                                tableList.append(tableName)
                                RedisManager.set_table_list(tableList)
                except Exception as e:
                    result = False

                    BEOPDataAccess._logger.writeLog('createDiagnosisTableKPIValueIfNotExist failed:' + e.__str__(),
                                                    True)
        return result

    def createDiagnosisTableKPIToFaultIfNotExist(self, tableName):
        result = True
        tableList = self.getTableListInRedis()
        if tableList:
            if tableName not in tableList:
                try:
                    if isinstance(tableName, str):
                        if len(tableName) > 0:
                            sql = "CREATE TABLE IF NOT EXISTS %s (\
                                 `kpiId` int(11) unsigned NOT NULL DEFAULT '0',\
                                 `faultId` bigint(20) unsigned NOT NULL DEFAULT '0',\
                                 `faultWeight` float NOT NULL DEFAULT '0'\
                                ) ENGINE=InnoDB DEFAULT CHARSET=utf8" % (tableName,)
                            result = self._mysqlDBContainer.op_db_update('diagnosis', sql, ())
                            if result:
                                BEOPDataAccess._logger.writeLog('auto create table %s' % (tableName,), True)
                                tableList.append(tableName)
                                RedisManager.set_table_list(tableList)
                except Exception as e:
                    result = False

                    BEOPDataAccess._logger.writeLog('createDiagnosisTableKPIToFaultIfNotExist failed:' + e.__str__(),
                                                    True)
        return result

    def createDiagnosisTableKPIToWikiIfNotExist(self, tableName):
        result = True
        tableList = self.getTableListInRedis()
        if tableList:
            if tableName not in tableList:
                try:
                    if isinstance(tableName, str):
                        if len(tableName) > 0:
                            sql = "CREATE TABLE IF NOT EXISTS %s (" \
                                  "`faultId`  bigint(20) NULL ," \
                                  "`wikiId`  varchar(255) NULL ) " \
                                  "ENGINE=InnoDB DEFAULT CHARSET=utf8" % (tableName,)
                            result = self._mysqlDBContainer.op_db_update('diagnosis', sql, ())
                            if result:
                                BEOPDataAccess._logger.writeLog('auto create table %s' % (tableName,), True)
                                tableList.append(tableName)
                                RedisManager.set_table_list(tableList)
                except Exception as e:
                    result = False

                    BEOPDataAccess._logger.writeLog('createDiagnosisTableKPIToWikiIfNotExist error:' + e.__str__(),
                                                    True)
        return result

    def addFaultToKPI(self, projId, faultId, kpiName1, kpiName2, kpiName3):
        rt = None
        try:
            mysqlname = self.getMysqlNameById(projId)
            if mysqlname:
                tableNameKPIStructure = mysqlname + "_diagnosis_kpi_structure"
                self.createDiagnosisTableKPIStructureIfNotExist(tableNameKPIStructure)
                kpiName1Id = 'root'
                # sql = "select id,name from %s where name='%s'"%(tableNameKPIStructure, kpiName1)
                # q = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', sql, ())
                # if q:
                #     kpiName1Id = q[0][0]
                # else:
                #     sql = "insert into %s(projId,name) values(%d,'%s')"%(tableNameKPIStructure,projId,kpiName1)
                #     u = self._mysqlDBContainer.op_db_update_with_id('diagnosis', tableNameKPIStructure, sql, ())
                #     if u > -1:
                #         kpiName1Id = u
                #     else:
                #         raise Exception('excute sql=%s failed'%(sql,))
                # if kpiName1Id is not None:
                kpiName2Id = None
                sql = "select id,name from %s where name='%s'" % (tableNameKPIStructure, kpiName2)
                q = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', sql, ())
                if q:
                    kpiName2Id = q[0][0]
                else:
                    sql = "insert into %s(projId,parentKPIId,name) values(%d,%d,'%s')" % (
                    tableNameKPIStructure, projId, kpiName1Id, kpiName2)
                    u = self._mysqlDBContainer.op_db_update_with_id('diagnosis', tableNameKPIStructure, sql, ())
                    if u > -1:
                        kpiName2Id = u
                    else:
                        raise Exception('excute sql=%s failed' % (sql,))
                if kpiName2Id is not None:
                    kpiName3Id = None
                    sql = "select id,name from %s where name='%s'" % (tableNameKPIStructure, kpiName3)
                    q = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', sql, ())
                    if q:
                        kpiName3Id = q[0][0]
                    else:
                        sql = "insert into %s(projId,parentKPIId,name) values(%d,%d,'%s')" % (
                        tableNameKPIStructure, projId, kpiName2Id, kpiName3)
                        u = self._mysqlDBContainer.op_db_update_with_id('diagnosis', tableNameKPIStructure, sql, ())
                        if u > -1:
                            kpiName3Id = u
                        else:
                            raise Exception('excute sql=%s failed' % (sql,))
                    if kpiName3Id:
                        tableNameKPIToFault = mysqlname + "_diagnosis_kpi_to_fault"
                        self.createDiagnosisTableKPIToFaultIfNotExist(tableNameKPIToFault)
                        sql = "insert into %s(kpiId, faultId) values(%d,%d)" % (
                        tableNameKPIToFault, kpiName3Id, faultId)
                        if self._mysqlDBContainer.op_db_update('diagnosis', sql, ()):
                            rt = kpiName1Id, kpiName2Id, kpiName3Id
                        else:
                            raise Exception('excute sql=%s failed' % (sql,))
        except Exception as e:

            BEOPDataAccess._logger.writeLog('addFaultToKPI failed:' + e.__str__(), True)
        return rt

    def deletePointFromMysql(self, projId, pointList):
        rt = False
        try:
            mysqlname = self.getMysqlNameById(projId)
            if mysqlname:
                rtTableName = 'rtdata_' + mysqlname
                sql = "delete from %s where pointname in (%s)" % (
                rtTableName, str(pointList).replace('[', '').replace(']', ''),)
                rt = self._mysqlDBContainer.op_db_update(app.config.get('DATABASE'), sql, ())
        except Exception as e:

            BEOPDataAccess._logger.writeLog('deletePointFromMysql failed:' + e.__str__(), True)
        return rt

    def deletePointFromBufferData(self, projId, pointList, tableType='site'):
        """

        :param projId:
        :param pointList:
        :param tableType: 'site':rtdata_xx;'vpoint':rtdata_xxx_vpoint
        :return:
        """
        rt = False
        try:
            if tableType == 'site':
                rtTableName = 'rtdata_%s' % (projId,)
            elif tableType == 'vpoint':
                rtTableName = 'rtdata_%s_vpoint' % (projId,)
            sql = "delete from %s where pointname in (%s)" % (
            rtTableName, str(pointList).replace('[', '').replace(']', ''),)
            rt = self._mysqlDBContainer.op_db_update('beopdatabuffer', sql, ())
        except Exception as e:
            BEOPDataAccess._logger.writeLog('deletePointFromBufferData failed:' + e.__str__(), True)
        return rt

    def getUserInfoByIds(self, userIdList):
        rt = {}
        try:
            if userIdList:
                userIdList = [str(x) for x in userIdList]
                sql = "select id,usermobile,useremail from user where id in (%s)" % (",".join(userIdList))
                ret = self._mysqlDBContainerReadOnly.op_db_query(app.config.get('DATABASE'), sql, ())
                if ret:
                    rt = {x[0]: (x[1] if x[1] else '', x[2] if x[2] else '') for x in ret}
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getUserInfoByIds failed:' + e.__str__(), True)
        return rt

    def getUserIdByName(self, userName):
        rt = -1
        try:
            sql = "select id from user where username='%s'" % (userName,)
            ret = self._mysqlDBContainerReadOnly.op_db_query(app.config.get('DATABASE'), sql, ())
            if ret:
                rt = int(ret[0][0])
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getUserInfoByIds failed:' + e.__str__(), True)
        return rt

    def getUserNameById(self, userId):
        rt = ''
        try:
            sql = "select userfullname from user where id=%s" % (userId,)
            ret = self._mysqlDBContainerReadOnly.op_db_query(app.config.get('DATABASE'), sql, ())
            if ret:
                rt = ret[0][0]
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getUserInfoByIds failed:' + e.__str__(), True)
        return rt

    def getDUTLastUpdatetime(self):
        rt = {}
        try:
            sql = "select p.id,i.LastReceivedTime from dtusert_to_project t,dtuserver_prj_info i, project p where t.dtuprojectid = i.id and t.projectid = p.id"
            ret = self._mysqlDBContainerReadOnly.op_db_query(app.config.get('DATABASE'), sql, ())
            if ret:
                rt = {x[0]: x[1] for x in ret}
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getDUTLastUpdatetime failed:' + e.__str__(), True)
        return rt

    def getProjIdByRTTableName(self, rtTableName):
        rt = None
        try:
            projList = RedisManager.get_project_info_list()
            if projList:
                for item in projList:
                    if not isinstance(item.get('mysqlname'), str):
                        continue
                    if ("rtdata_" + item.get('mysqlname')) == rtTableName:
                        return item.get('id')
        except Exception as e:
            BEOPDataAccess._logger.writeLog('getDUTLastUpdatetime failed:' + e.__str__(), True)
        return rt

    # yan add 2016-7-6
    def createTableBufferHisdataIfNotExist(self, projId):
        tableList = self.getTableListInRedis()
        dbName = app.config.get('DATABASE_BUFFER')
        tableName = 'hisdata_%s' % (projId,)
        if tableList:
            if tableName not in tableList:
                try:
                    if isinstance(tableName, str):
                        if len(tableName) > 0:
                            sql = "CREATE TABLE IF NOT EXISTS %s (\
                                    `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\
                                    `pointname` varchar(128) NOT NULL DEFAULT '',\
                                    `pointvalue` text,\
                                    PRIMARY KEY (`time`,pointname)\
                               ) ENGINE=InnoDB DEFAULT CHARSET=utf8" % (tableName,)
                            result = self._mysqlDBContainer.op_db_update(dbName, sql, ())
                            if result:
                                tableList.append(tableName)
                                RedisManager.set_table_list(tableList)
                                return True
                            else:

                                BEOPDataAccess._logger.writeLog('auto create table %s failed' % (tableName,), True)
                except Exception as e:

                    BEOPDataAccess._logger.writeLog('createTableBufferHisdataIfNotExist error:' + e.__str__(), True)
        return False

    def createTableBufferRTTableIfNotExist(self, projId):
        try:
            tableList = self.getTableListInRedis()
            dbName = app.config.get('DATABASE_BUFFER')

            if tableList:
                tableName = 'rtdata_%s' % (projId,)

                if tableName not in tableList:

                    if isinstance(tableName, str):
                        if len(tableName) > 0:
                            BEOPDataAccess._logger.writeLog('start auto create table %s' % (tableName,), True)
                            sql = "CREATE TABLE IF NOT EXISTS %s (\
                                    `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\
                                    `pointname` varchar(128) NOT NULL DEFAULT '',\
                                    `pointvalue` text,\
                                    `flag` INT(10) NOT NULL DEFAULT 0,\
                                    PRIMARY KEY (`pointname`)\
                               ) ENGINE=InnoDB DEFAULT CHARSET=utf8" % (tableName,)
                            result = self._mysqlDBContainer.op_db_update(dbName, sql, ())
                            if result:
                                tableList.append(tableName)
                                RedisManager.set_table_list(tableList)
                            else:
                                BEOPDataAccess._logger.writeLog('auto create table %s failed' % (tableName,), True)

                tableName = 'rtdata_%s_vpoint' % (projId,)

                if tableName not in tableList:
                    if isinstance(tableName, str):
                        if len(tableName) > 0:
                            BEOPDataAccess._logger.writeLog('start auto create table %s' % (tableName,), True)
                            sql = "CREATE TABLE IF NOT EXISTS %s (\
                                    `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\
                                    `pointname` varchar(128) NOT NULL DEFAULT '',\
                                    `pointvalue` text,\
                                    `flag` INT(10) NOT NULL DEFAULT 1,\
                                    PRIMARY KEY (`pointname`)\
                               ) ENGINE=InnoDB DEFAULT CHARSET=utf8" % (
                            tableName,)  # `flag` INT(10) NOT NULL DEFAULT 1,\
                            result = self._mysqlDBContainer.op_db_update(dbName, sql, ())
                            if result:
                                tableList.append(tableName)
                                RedisManager.set_table_list(tableList)
                            else:
                                BEOPDataAccess._logger.writeLog('auto create table %s failed' % (tableName,), True)
        except Exception as e:
            BEOPDataAccess._logger.writeLog('createTableBufferRTTableIfNotExist error:' + e.__str__(), True)
        return False

    def InsertHisDataToMysql(self, hisdata, projId):
        rt = {}
        try:
            if hisdata:
                if projId is not None:
                    if int(projId) >= 0:
                        tableName = "hisdata_%s" % (projId,)
                        self.createTableBufferHisdataIfNotExist(projId)
                        self.clearBufferHisdata(projId)
                        dbname = app.config.get('DATABASE_BUFFER')
                        constMaxRowsPerOperation = 5000
                        pointTimeList = []
                        pointNameList = []
                        pointValueList = []
                        length = len(hisdata)
                        for index in range(length):
                            pointTimeList.append(hisdata[index][0])
                            pointNameList.append(hisdata[index][1])
                            pointValueList.append(hisdata[index][2])
                        if length > 0:
                            block = length // constMaxRowsPerOperation
                            for count in range(block + 1):
                                timeList = []
                                pointList = []
                                valueList = []
                                for index in range(count * constMaxRowsPerOperation,
                                                   (count + 1) * constMaxRowsPerOperation):
                                    if index >= length:
                                        break
                                    timeList.append(pointTimeList[index])
                                    pointList.append(pointNameList[index])
                                    valueList.append(pointValueList[index])
                                params = []
                                if tableName:
                                    strsql = 'replace into %s' % tableName + '(time, pointname, pointvalue) values'
                                    for index, pointname in enumerate(pointList):
                                        strsql += '(%s, %s, %s),'
                                        params.extend([str(timeList[index]), pointname, str(valueList[index])])
                                    strsql = strsql[:-1]
                                    if params:
                                        bSuccess = self._mysqlDBContainer.op_db_update(dbname, strsql, tuple(params))
                                        if bSuccess:
                                            rt.update({'state': 1})
                                        else:

                                            BEOPDataAccess._logger.writeLog(
                                                'InsertHisDataToMysql:sql=%s execute failed' % (strsql,), True)
                                            rt.update({'state': 403, 'message': 'manipulating database failed'})

        except Exception as e:

            BEOPDataAccess._logger.writeLog('InsertHisDataToMysql error:' + e.__str__(), True)
        return rt

    def clearBufferHisdata(self, projId):
        rt = False
        try:
            tableName = "hisdata_%s" % (projId,)
            dbname = app.config.get('DATABASE_BUFFER')
            t_now = datetime.now()
            t_end = t_now - timedelta(hours=2)
            str_t_end = t_end.strftime('%Y-%m-%d %H:%M:%S')
            sql = "delete from %s where `time` < '%s'" % (tableName, str_t_end)
            rt = self._mysqlDBContainer.op_db_update(dbname, sql, ())
        except Exception as e:

            BEOPDataAccess._logger.writeLog('clearBufferHisdata error:' + e.__str__(), True)
        return rt

    def getFlag0PointValueList(self, projId):
        insertDataList = {}
        projName = ''
        try:
            ret = self.findProjectInfoItemById(projId)
            if ret:
                projName = ret['name_en']
            rtTableName = self.getProjMysqldbByName(projName)
            dbname = app.config['DATABASE']
            tableName = 'rtdata_' + rtTableName
            sql = "select time,pointname,pointvalue from %s where flag=0" % (tableName,)
            rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql)
            if rvQuery != None:
                if len(rvQuery) > 0:
                    insertDataList = {item[1]: item[2] for item in rvQuery}
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getFlag0PointValueList error:' + e.__str__(), True)
        return insertDataList

    def getFlag0and1PointTimeValueListInBufferTable(self, projId, pointNameList=None):
        self.createTableBufferRTTableIfNotExist(projId)  # add by golding,for here will need vpoint table
        insertDataList = {}
        projName = ''
        timeList = []
        nameList = []
        valueList = []
        try:
            ret = self.findProjectInfoItemById(projId)
            if ret:
                projName = ret['name_en']
            rtTableName = self.getProjMysqldbByName(projName)
            dbname = app.config['DATABASE']
            tableName = 'beopdatabuffer.rtdata_%d' % (int(projId))
            tableName_vpoint = 'beopdatabuffer.rtdata_%d_vpoint' % (int(projId))
            if pointNameList is None:
                sql = "select time,pointname,pointvalue from %s UNION all select time,pointname, pointvalue from %s where flag=1" % (
                tableName, tableName_vpoint)
                # else:
                # sql = "select time,pointname,pointvalue from %s where flag=0 and pointname in (%s)" %(tableName,  str(pointNameList).replace('[','').replace(']',''))
            else:
                sql = 'select time,pointname, pointvalue from (select time,pointname, pointvalue from %s UNION all select time,pointname, pointvalue from %s) a where pointname in (%s)' % (
                tableName, tableName_vpoint, str(pointNameList).replace('[', '').replace(']', ''))

            rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql)
            if rvQuery != None:
                if len(rvQuery) > 0:
                    for item in rvQuery:
                        if pointNameList is None or (
                                pointNameList is not None and item[1] in pointNameList):  # 防止空格点名问题，这里需要再做一次检查
                            tt = None
                            try:
                                tt = item[0].strftime('%Y-%m-%d %H:%M:%S')
                            except:
                                continue
                            if tt is None:
                                continue
                            timeList.append(tt)
                            nameList.append(item[1])
                            valueList.append(item[2])
                    insertDataList = dict(nameList=nameList, timeList=timeList, valueList=valueList)
        except Exception as e:
            BEOPDataAccess._logger.writeLog('getFlag0PointValueList error:' + e.__str__(), True)
        return insertDataList

    def getOrginalPointTimeValueList(self, projId, pointNameList=None):
        self.createTableBufferRTTableIfNotExist(projId)  # add by golding,for here will need vpoint table
        insertDataList = {}
        projName = ''
        timeList = []
        nameList = []
        valueList = []
        try:
            ret = self.findProjectInfoItemById(projId)
            if ret:
                projName = ret['name_en']
            rtTableName = self.getProjMysqldbByName(projName)
            dbname = app.config['DATABASE']
            tableName = 'beopdoengine.rtdata_' + rtTableName
            if pointNameList is None:
                sql = "select time,pointname,pointvalue from %s where flag=0" % (tableName,)
            else:
                sql = 'select time,pointname, pointvalue from %s where pointname in (%s)' % (
                tableName, str(pointNameList).replace('[', '').replace(']', ''))

            rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql)
            if rvQuery != None:
                if len(rvQuery) > 0:
                    for item in rvQuery:
                        if pointNameList is None or (
                                pointNameList is not None and item[1] in pointNameList):  # 防止空格点名问题，这里需要再做一次检查
                            timeList.append(item[0].strftime('%Y-%m-%d %H:%M:%S'))
                            nameList.append(item[1])
                            valueList.append(item[2])
                    insertDataList = dict(nameList=nameList, timeList=timeList, valueList=valueList)
        except Exception as e:
            BEOPDataAccess._logger.writeLog('getOrginalPointTimeValueList error:' + e.__str__(), True)
        return insertDataList

    def getMaxTimeInSitePoints(self, projId):
        tReturn = None
        try:
            ret = self.findProjectInfoItemById(projId)
            if ret:
                projName = ret['name_en']
            rtTableName = self.getProjMysqldbByName(projName)
            dbname = app.config['DATABASE']
            tableName = 'beopdoengine.rtdata_' + rtTableName

            sql = "select max(time) from %s where flag=0" % (tableName,)

            rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql)
            if rvQuery != None:
                if len(rvQuery) > 0:
                    tReturn = (rvQuery[0][0])
        except Exception as e:
            BEOPDataAccess._logger.writeLog('getMaxTimeInSitePoints error:' + e.__str__(), True)
        return tReturn

    def getAllPointTimeValueList(self, projId):
        self.createTableBufferRTTableIfNotExist(projId)  # add by golding,for here will need vpoint table
        insertDataList = {}
        projName = ''
        timeList = []
        nameList = []
        valueList = []
        flagList = []
        try:
            ret = self.findProjectInfoItemById(projId)
            if ret:
                projName = ret['name_en']
            rtTableName = self.getProjMysqldbByName(projName)
            dbname = app.config['DATABASE']
            tableName = 'beopdoengine.rtdata_' + rtTableName
            tableName_calcpoint = 'beopdatabuffer.rtdata_%d' % (int(projId))
            tableName_vpoint = 'beopdatabuffer.rtdata_%d_vpoint' % (int(projId))

            sql = "select time,pointname,pointvalue,flag from %s where flag=0 UNION all select time,pointname, pointvalue,flag from %s where flag=1 " \
                  "UNION all select time,pointname, pointvalue,flag from %s where flag=2" % (
                  tableName, tableName_vpoint, tableName_calcpoint)

            rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql)
            if rvQuery != None:
                if len(rvQuery) > 0:
                    for item in rvQuery:
                        try:
                            tt = item[0].strftime('%Y-%m-%d %H:%M:%S')
                            timeList.append(tt)
                        except:
                            continue
                        nameList.append(item[1])
                        valueList.append(item[2])
                        flagList.append(item[3])
                    insertDataList = dict(nameList=nameList, timeList=timeList, valueList=valueList, flagList=flagList)
        except Exception as e:
            BEOPDataAccess._logger.writeLog('getFlag0PointValueList error:' + e.__str__(), True)
        return insertDataList

    def get_hisdata_mysql_buffer(self, projId, t_time):
        insertDataList = []
        projName = ''
        try:
            dbname = app.config['DATABASE_BUFFER']
            tableName = 'hisdata_%s' % (projId,)
            # sql = "select time,pointname,pointvalue from %s where time='%s' and pointname in (%s) " % (tableName,t_time,str(pointList).replace('[','').replace(']',''))
            sql = "select time,pointname,pointvalue from %s where time='%s' " % (tableName, t_time,)

            rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql)
            if rvQuery != None:
                if len(rvQuery) > 0:
                    for i in range(len(rvQuery)):
                        insertDataList.append((rvQuery[i][0], rvQuery[i][1], rvQuery[i][2]))
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getFlag0PointValueList error:' + e.__str__(), True)
        return insertDataList

    def genMongoFlag2PointValueListFromBuffer(self, projId, timeData):
        insertDataList = []
        try:
            tableName = 'rtdata_%d' % (int(projId),)
            self.createRTTableIfNotExist(tableName)
            sql = "select time,pointname,pointvalue from %s where flag=2" % (tableName,)
            rvQuery = self._mysqlDBContainerReadOnly.op_db_query('beopdatabuffer', sql)

            if len(rvQuery) > 0:
                for i in range(len(rvQuery)):
                    pv = rvQuery[i][2]
                    if isinstance(pv, str):
                        strTemp = pv.lower()
                        if strTemp == "null" or strTemp == "none":
                            pv = None
                    insertDataList.append((timeData, rvQuery[i][1], pv))
        except Exception as e:

            BEOPDataAccess._logger.writeLog('getFlag2PointValueList failed:' + e.__str__(), True)
        return insertDataList

    def getBufferRTDataByProj(self, projId, pointList=None):
        rt = {}
        try:
            dbname = 'beopdatabuffer'
            tableName = 'rtdata_%s' % (projId,)
            tableName_vpoint = 'rtdata_%s_vpoint' % (projId,)
            tableList = self.getTableListInRedis()
            if tableList:
                if tableName in tableList and tableName_vpoint in tableList:
                    # q = 'select time, pointname, pointvalue from %s UNION all select time, pointname, pointvalue from %s' % (tableName, tableName_vpoint)
                    # rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, ())
                    # for item in rvQuery:
                    #     if pointList is None:
                    #         rt[item[1]] =  item[2]
                    #     elif item[1] in pointList:
                    #         rt[item[1]] =  item[2]
                    if pointList:
                        q = 'select pointname, pointvalue from (select pointname, pointvalue from %s UNION all select pointname, pointvalue from %s) a where pointname in (%s)' % (
                        tableName, tableName_vpoint, str(pointList).replace('[', '').replace(']', ''))
                    else:
                        q = 'select pointname, pointvalue from %s UNION all select pointname, pointvalue from %s' % (
                        tableName, tableName_vpoint)
                    rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, ())
                    rt = {x[0]: x[1] for x in rvQuery}
        except Exception as e:

            BEOPDataAccess._logger.writeLog(e.__str__(), True)
        return rt

    def getBufferRTData0and2NameListByProj(self, projId):
        rt = []
        try:
            dbname = 'beopdatabuffer'
            tableName = 'rtdata_%s' % (projId,)
            if tableName:
                q = 'select pointname from %s' % (tableName)
                rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, ())
                rt = [x[0] for x in rvQuery]
        except Exception as e:
            BEOPDataAccess._logger.writeLog(e.__str__(), True)
        return rt

    def getBufferRTDataWithTimeByProj(self, projId, pointList=None):
        rt = {}
        try:
            dbname = 'beopdatabuffer'
            tableName = 'rtdata_%s' % (projId,)
            tableName_vpoint = 'rtdata_%s_vpoint' % (projId,)
            tableList = self.getTableListInRedis()
            if tableList:
                if tableName in tableList and tableName_vpoint in tableList:
                    # q = 'select time, pointname, pointvalue from %s UNION all select time, pointname, pointvalue from %s' % (tableName, tableName_vpoint)
                    # rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, ())
                    # for item in rvQuery:
                    #     if pointList is None:
                    #         rt[item[1]] = [item[0], item[2]]
                    #     elif item[1] in pointList:
                    #         rt[item[1]] = [item[0], item[2]]
                    if pointList:
                        q = 'select time, pointname, pointvalue from (select time, pointname, pointvalue from %s UNION all select time, pointname, pointvalue from %s) a where pointname in (%s)' % (
                        tableName, tableName_vpoint, str(pointList).replace('[', '').replace(']', ''))
                    else:
                        q = 'select time, pointname, pointvalue from %s UNION all select time, pointname, pointvalue from %s' % (
                        tableName, tableName_vpoint)
                    rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, ())
                    rt = {x[1]: [x[0], x[2]] for x in rvQuery}
        except Exception as e:

            BEOPDataAccess._logger.writeLog(e.__str__(), True)
        return rt

    def setRTDataVirtualByProj(self, projId, pointName, pointValue):
        # print('setData')
        rv = "error: point modification failed."

        self.createTableBufferRTTableIfNotExist(projId)

        dbname = 'beopdatabuffer'
        if not (isinstance(pointValue, str) or isinstance(pointValue, float) or isinstance(pointValue, int)):
            pointValue = 'None'
        q = 'insert into rtdata_%d_vpoint' % (
        projId,) + '(time,pointname, pointvalue) values(now(), %s, %s) on duplicate key update time=now(), pointvalue=%s'
        parameters = (pointName, pointValue, pointValue)
        bSuccess = self._mysqlDBContainer.op_db_update(dbname, q, parameters)
        if bSuccess:
            return 'success'
        else:
            errInf = 'error: manipulating database failed'
            BEOPDataAccess._logger.writeLog(errInf, True)
            return errInf

        if not (rowCount == 'failed'):
            rv = "succeeded sending command for updating point value."
        return rv

    def setRTDataMulVirtualByProj(self, projId, pointNameList, pointValueList):
        # print('setData')
        result = "error: point modification failed."
        self.createTableBufferRTTableIfNotExist(projId)

        dbname = 'beopdatabuffer'
        try:
            tableName = 'rtdata_%d' % (projId)
            bSuccess = self._mysqlDBContainer.op_db_update_rttable_by_transaction(dbname, tableName, pointNameList,
                                                                                  pointValueList)
            if bSuccess:
                result = 'success'
            else:
                result = 'error: manipulating database failed'
        except Exception as e:
            BEOPDataAccess._logger.writeLog(e.__str__(), True)
            result = 'error: %s' % (e.__str__(),)

        return result

    def saveHistoryDataIntoBuffer(self, dataList, projId, obId):
        try:
            tablename = 'temprepair_%d_%s_buffer' % (int(projId), obId,)
            if not self.createRepairHisTempTableIfNotExist(tablename):
                return False
            sql = 'insert into ' + tablename + ' (time, pointname,timeformat,pointvalue) values '
            for index2 in range(len(dataList)):
                sql += "('" + dataList[index2]['timeAt'] + "','" + dataList[index2]['pointName'] + "','" \
                       + dataList[index2]['timeFormat'] + "','" + str(dataList[index2]['pointValue']) + "'),"
            sql = sql[:-1]
            bSuccess = self._mysqlDBContainer.op_db_update(app.config['DATABASE_BUFFER'], sql, ())
            if not bSuccess:
                BEOPDataAccess._logger.writeLog('saveHistoryDataIntoBuffer  failed', True)
        except Exception as e:
            BEOPDataAccess._logger.writeLog('saveHistoryDataIntoBuffer error:' + e.__str__(), True)

    def diagnosis_rank_this_day(self, projId):
        rt = {}
        try:
            projId = int(projId)
            mysqlname = self.getMysqlNameById(projId)
            if mysqlname:
                t_now = datetime.now()
                t_start = t_now.strftime("%Y-%m-%d 00:00:00")
                t_end = t_now.strftime("%Y-%m-%d 23:59:59")
                fault_table_name = mysqlname + '_diagnosis_' + 'faults'
                equipment_table_name = mysqlname + '_diagnosis_' + 'equipments'
                notice_table_name = mysqlname + '_diagnosis_' + 'notices'
                self.createTableDiagnosisFaultsIfNotExist(fault_table_name)
                self.createTableDiagnosisEquipmentsIfNotExist(equipment_table_name)
                self.createTableDiagnosisNoticesIfNotExist(notice_table_name)
                # self.createTableDiagnosisLimitIfNotExist(mysqlname+'_diagnosis_'+'limit')
                # self.createTableDiagnosisEnableIfNotExist(mysqlname+'_diagnosis_'+'enable')
                # self.createTableDiagnosisOrderIfNotExist(mysqlname+'_diagnosis_'+'order')
                # self.createTableDiagnosisZonesIfNotExist(mysqlname+'_diagnosis_'+'zones')
                sql = "select f.Name as fault_name,f.DefaultGrade as default_grade,e.Name as equipment_name,n.Energy as notice_energy, " \
                      "n.Time as notice_time from %s f,%s n,%s e where f.EquipmentId<=>e.id and n.FaultId=f.id and n.Time between '%s' and '%s' order by n.Time" \
                      % (fault_table_name, notice_table_name, equipment_table_name, t_start, t_end)
                dbrv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', sql, ())
                if dbrv:
                    for item in dbrv:
                        fault_name = item[0]
                        default_grade = item[1]
                        equipment_name = item[2]
                        try:
                            notice_energy = float(item[3])
                        except:
                            notice_energy = 0
                        notice_time = item[4]
                        if fault_name not in rt:
                            rt[fault_name] = {'default_grade': default_grade, 'equipment_name': equipment_name,
                                              'notice_energy': notice_energy, 'accumulate_time': 0,
                                              'min_time': notice_time, 'max_time': notice_time}
                        else:
                            c = rt.get(fault_name)
                            energy = c.get('notice_energy', 0)
                            c.update({'notice_energy': energy + notice_energy, 'max_time': notice_time})
                if rt:
                    for key in rt:
                        c = rt.get(key)
                        maxt = c.get('max_time')
                        mint = c.get('min_time')
                        if maxt and mint:
                            c.update({'accumulate_time': (maxt - mint).total_seconds()})
                            c.pop('min_time')
                            c.pop('max_time')
        except Exception as e:
            BEOPDataAccess._logger.writeLog('diagnosis_rank_this_day error:' + e.__str__(), True)
        return rt

    def diagnosis_rank_this_week(self, projId):
        rt = {}
        try:
            projId = int(projId)
            mysqlname = self.getMysqlNameById(projId)
            if mysqlname:
                t_now = datetime.now()
                n = t_now.weekday()
                t_start = t_now
                t_end = t_now
                t_start = t_start.replace(day=t_start.day - n)
                t_end = t_end.replace(day=t_end.day + 6 - n)
                t_start = t_start.strftime("%Y-%m-%d 00:00:00")
                t_end = t_end.strftime("%Y-%m-%d 23:59:59")
                fault_table_name = mysqlname + '_diagnosis_' + 'faults'
                equipment_table_name = mysqlname + '_diagnosis_' + 'equipments'
                notice_table_name = mysqlname + '_diagnosis_' + 'notices'
                self.createTableDiagnosisFaultsIfNotExist(fault_table_name)
                self.createTableDiagnosisEquipmentsIfNotExist(equipment_table_name)
                self.createTableDiagnosisNoticesIfNotExist(notice_table_name)
                # self.createTableDiagnosisLimitIfNotExist(mysqlname+'_diagnosis_'+'limit')
                # self.createTableDiagnosisEnableIfNotExist(mysqlname+'_diagnosis_'+'enable')
                # self.createTableDiagnosisOrderIfNotExist(mysqlname+'_diagnosis_'+'order')
                # self.createTableDiagnosisZonesIfNotExist(mysqlname+'_diagnosis_'+'zones')
                sql = "select f.Name as fault_name,f.DefaultGrade as default_grade,e.Name as equipment_name,n.Energy as notice_energy, " \
                      "n.Time as notice_time from %s f,%s n,%s e where f.EquipmentId<=>e.id and n.FaultId=f.id and n.Time between '%s' and '%s' order by n.Time" \
                      % (fault_table_name, notice_table_name, equipment_table_name, t_start, t_end)
                dbrv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', sql, ())
                if dbrv:
                    for item in dbrv:
                        fault_name = item[0]
                        default_grade = item[1]
                        equipment_name = item[2]
                        notice_energy = float(item[3])
                        notice_time = item[4]
                        if fault_name not in rt:
                            rt[fault_name] = {'default_grade': default_grade, 'equipment_name': equipment_name,
                                              'notice_energy': notice_energy, 'accumulate_time': 0,
                                              'min_time': notice_time,
                                              'max_time': notice_time}
                        else:
                            c = rt.get(fault_name)
                            energy = c.get('notice_energy', 0)
                            c.update({'notice_energy': energy + notice_energy, 'max_time': notice_time})
                if rt:
                    for key in rt:
                        c = rt.get(key)
                        maxt = c.get('max_time')
                        mint = c.get('min_time')
                        if maxt and mint:
                            c.update({'accumulate_time': (maxt - mint).total_seconds()})
                            c.pop('min_time')
                            c.pop('max_time')
        except Exception as e:
            BEOPDataAccess._logger.writeLog('diagnosis_rank_this_week error:' + e.__str__(), True)
        return rt

    def diagnosis_rank_in_time_range(self, projId, timeFrom, timeTo):
        rt = {}
        try:
            projId = int(projId)
            mysqlname = self.getMysqlNameById(projId)
            if mysqlname:
                if isinstance(timeFrom, str) and isinstance(timeTo, str):
                    try:
                        datetime.strptime(timeFrom, standard_time_format)
                        datetime.strptime(timeTo, standard_time_format)
                    except:
                        return rt
                    t_start = timeFrom
                    t_end = timeTo
                    fault_table_name = mysqlname + '_diagnosis_' + 'faults'
                    equipment_table_name = mysqlname + '_diagnosis_' + 'equipments'
                    notice_table_name = mysqlname + '_diagnosis_' + 'notices'
                    self.createTableDiagnosisFaultsIfNotExist(fault_table_name)
                    self.createTableDiagnosisEquipmentsIfNotExist(equipment_table_name)
                    self.createTableDiagnosisNoticesIfNotExist(notice_table_name)
                    # self.createTableDiagnosisLimitIfNotExist(mysqlname+'_diagnosis_'+'limit')
                    # self.createTableDiagnosisEnableIfNotExist(mysqlname+'_diagnosis_'+'enable')
                    # self.createTableDiagnosisOrderIfNotExist(mysqlname+'_diagnosis_'+'order')
                    # self.createTableDiagnosisZonesIfNotExist(mysqlname+'_diagnosis_'+'zones')
                    sql = "select f.Name as fault_name,f.DefaultGrade as default_grade,e.Name as equipment_name,n.Energy as notice_energy, " \
                          "n.Time as notice_time from %s f,%s n,%s e where f.EquipmentId<=>e.id and n.FaultId=f.id and n.Time between '%s' and '%s' order by n.Time" \
                          % (fault_table_name, notice_table_name, equipment_table_name, t_start, t_end)
                    dbrv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', sql, ())
                    if dbrv:
                        for item in dbrv:
                            fault_name = item[0]
                            default_grade = item[1]
                            equipment_name = item[2]
                            notice_energy = float(item[3])
                            notice_time = item[4]
                            if fault_name not in rt:
                                rt[fault_name] = {'default_grade': default_grade, 'equipment_name': equipment_name,
                                                  'notice_energy': notice_energy, 'accumulate_time': 0,
                                                  'min_time': notice_time,
                                                  'max_time': notice_time}
                            else:
                                c = rt.get(fault_name)
                                energy = c.get('notice_energy', 0)
                                c.update({'notice_energy': energy + notice_energy, 'max_time': notice_time})
                    if rt:
                        for key in rt:
                            c = rt.get(key)
                            maxt = c.get('max_time')
                            mint = c.get('min_time')
                            if maxt and mint:
                                c.update({'accumulate_time': (maxt - mint).total_seconds()})
                                c.pop('min_time')
                                c.pop('max_time')
        except Exception as e:
            BEOPDataAccess._logger.writeLog('diagnosis_rank_in_time_range error:' + e.__str__(), True)

        return rt

    def get_project_time_zone_by_id(self, projId):
        projId = int(projId)
        dbname = app.config.get('DATABASE')
        strSQL = 'SELECT data_time_zone FROM project WHERE id = {0}'.format(projId)
        dbrv = self._mysqlDBContainerReadOnly.op_db_query_one(dbname, strSQL)
        if dbrv:
            return dbrv[0]
        return None

    def getStationIdByProjId(self, projId):
        dbname = app.config.get('DATABASE')
        q = 'select weather_station_id from project where id = %s' % (projId)
        dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, q)
        if not dbrv or len(dbrv) < 1:
            return None
        return dbrv[0][0]

    def getLatlngOfPriject(self, projId):
        dbname = app.config.get('DATABASE')
        q = 'select latlng from project where id = %s'
        dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, (projId,))
        if dbrv == None or len(dbrv) < 1:
            return None
        return dbrv[0][0]

    def UpdateProjectLocateMap(self):
        try:
            dbname = app.config.get('DATABASE')
            strQInstance = 'select mongo_server_id, internet_addr, internal_addr, writable, space_used, is_default from mongo_instance'
            dbrvInstance = self._mysqlDBContainerReadOnly.op_db_query(dbname, strQInstance, )
            mongo_Instance = {}
            for item in dbrvInstance:
                mongo_Instance[item[0]] = {'internet_addr': item[1], 'internal_addr': item[2], 'writable': item[3],
                                           'space_used': item[4], 'is_default': item[5]}
            projectLocateMap = {'projectLocate': {}}
            strQ = 'select proj_id, mongo_server_id, start_time, end_time from locate_map'
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strQ, )
            # 获取每个项目对应的信息
            addrSet = set()
            for item in dbrv:
                if self.GetCollectionNameById(item[0]):
                    if not projectLocateMap['projectLocate'].get(item[0]):
                        projectLocateMap['projectLocate'][item[0]] = []
                    projectLocateMap['projectLocate'][item[0]].append(
                        {'mongo_server_id': item[1], 'internet_addr': mongo_Instance[item[1]].get('internet_addr'),
                         'internal_addr': mongo_Instance[item[1]].get('internal_addr'),
                         'start_time': item[2], 'end_time': item[3]})
                if MongoConnManager.isLocalEnv():
                    addrSet.add(app.config['MONGO_SERVER_HOST'])
                else:
                    if app.config['USE_ALI_PUBLIC']:
                        addrSet.add(mongo_Instance[item[1]].get('internet_addr'))
                    else:
                        addrSet.add(mongo_Instance[item[1]].get('internal_addr'))
            # 配置数据库放到地址列表
            if MongoConnManager.isLocalEnv():
                addrSet.add(app.config['MONGO_SERVER_HOST'])
            else:
                addrSet.add(app.config['CONFIG_MONGO_ADDR'] + ':' + str(app.config['CONFIG_MONGO_PORT']))
            projectLocateMap['addrList'] = list(addrSet)
            projectLocateMap['mongoInstance'] = mongo_Instance
            RedisManager.set(app.config['MEMCACHE_KEY_PREFIX'] + 'projectLocateMap', projectLocateMap)
        except Exception as e:
            print(e.__str__())
            logging.error('genMemProjectLocateMap error:' + e.__str__())
        return RedisManager.get(app.config['MEMCACHE_KEY_PREFIX'] + 'projectLocateMap')

    def GenerateMemcache(self):
        self.UpdateProjectInfo()
        self.UpdateProjectLocateMap()

    def UpdateProjectInfo(self):
        rt = False
        try:
            projectInfoList = []
            dbname = app.config.get('DATABASE')
            q = 'select id, s3dbname, mysqlname, name_en, collectionname, name_cn, name_english, hisdata_structure_v2_from_time from project'
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, ())
            if dbrv == None:
                rt = False
            else:
                for item in dbrv:
                    projectInfoList.append(
                        dict(name_en=item[3], s3dbname=item[1], mysqlname=item[2], id=item[0], collectionname=item[4],
                             name_cn=item[5], name_english=item[6], v2_time=item[7]))
                RedisManager.set(app.config['MEMCACHE_KEY_PREFIX'] + 'projectInfoList', projectInfoList)
            if RedisManager.get(app.config['MEMCACHE_KEY_PREFIX'] + 'projectInfoList'):
                rt = True
        except Exception as e:
            print(e.__str__())
            logging.error('UpdateProjectInfo error:' + e.__str__())
        return rt

    def clearOverdueDataInBufferTable(self, projId):
        try:
            dbname = 'beopdatabuffer'
            tableName = 'beopdatabuffer.rtdata_%d' % (int(projId))
            tNow = datetime.now()
            tOverdue = tNow - timedelta(days=1)
            sql = "delete from %s where time < '%s'" % (tableName, tOverdue.strftime(standard_time_format))

            bSuccess = self._mysqlDBContainer.op_db_update(dbname, sql, ())
            return bSuccess
        except Exception as e:
            BEOPDataAccess._logger.writeLog('clearOverdueDataInBufferTable error:' + e.__str__(), True)
            return False

    def get_third_party_data(self, projId, pointName):
        rvData = None
        try:

            tableName = 'beopdatabuffer.rtdata_%d_thirdparty' % (int(projId))
            tNow = datetime.now()
            tOverdue = tNow - timedelta(days=1)
            sql = "select time,pointname,pointvalue from %s where pointname = '%s' and flag=1" % (tableName, pointName)

            rvQuery = self._mysqlDBContainerReadOnly.op_db_query(app.config.get('DATABASE_BUFFER'), sql)
            if rvQuery != None:
                if len(rvQuery) > 0:
                    rvData = rvQuery[0][2]

            return rvData
        except Exception as e:
            BEOPDataAccess._logger.writeLog('clearOverdueDataInBufferTable error:' + e.__str__(), True)
            return False

    def getUserIdByName(self, userName):
        '''
        David 20161011
        :param userName:
        :return:
        '''
        rt = None
        try:
            dbname = app.config.get('DATABASE')
            strSQL = 'SELECT id FROM `user` WHERE username = "%s"' % userName
            dbrv = self._mysqlDBContainerReadOnly.op_db_query_one(dbname, strSQL)
            if dbrv:
                rt = dbrv[0]
        except Exception as e:
            return None
        return rt

    def getWorkflowGroupIdByName(self, WorkflowGroupName, userId):
        '''
        David 20161011
        :param WorkflowGroupName:
        :return:
        '''
        rt = None
        try:
            dbname = 'workflow'
            strSQL = 'SELECT id FROM transaction_group WHERE `name` = "%s" AND id IN (' \
                     'SELECT groupId FROM transaction_group_user WHERE userId = %s) ' \
                     'OR creatorId = %s AND `name` = "%s"' % (WorkflowGroupName, userId, userId, WorkflowGroupName)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query_one(dbname, strSQL)
            if dbrv:
                rt = dbrv[0][0]
        except Exception as e:
            raise Exception(e.__str__())
        return rt

    def get_fualt_equipment_zone_by_Ids(self, projId, ids):
        '''
        David 20161013
        :param ids:
        :return:
        '''
        rt = {}
        try:
            if ids:
                if isinstance(ids, list):
                    ids = str(ids).replace('[', '(').replace(']', ')')
                    dbname = self.getProjMysqldb(projId)
                    strSQL = 'SELECT n.Id, f.Id as FaultId, f.`Name` as FaultName, f.EquipmentId, e.`Name` as EquipmentName, ' \
                             'e.ZoneId, z.SubBuildingName FROM %s_diagnosis_notices AS n ' \
                             'LEFT JOIN %s_diagnosis_faults as f ON n.FaultId = f.Id ' \
                             'LEFT JOIN %s_diagnosis_equipments as e ON e.Id = f.EquipmentId ' \
                             'LEFT JOIN %s_diagnosis_zones as z ON z.Id = e.ZoneId ' \
                             'WHERE n.Id IN %s' % (dbname, dbname, dbname, dbname, ids)
                    dbrv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL)
                    if dbrv:
                        for item in dbrv:
                            rt.update({item[0]: {'NoticeId': item[0], 'FaultId': item[1], 'FaultName': item[2],
                                                 'EquipmentId': item[3], 'EquipmentName': item[4], 'ZoneId': item[5],
                                                 'SubBuildingName': item[6]}})
        except Exception as e:
            raise Exception(e.__str__())
        return rt

    def get_work_order_id(self, title, executorID, createUserId, status):
        rt = None
        try:
            sql = "select id,statusId,createTime,dueDate from transaction where title like '%%%s%%'" % (title,)
            sql += " and creatorID=%s and executorID=%s and statusId in (%s)" % (
            createUserId, executorID, str(status).replace('[', '').replace(']', ''))
            rt = self._mysqlDBContainerReadOnly.op_db_query('workflow', sql, ())
        except Exception as e:
            BEOPDataAccess._logger.writeLog('get_work_order_id error:' + e.__str__(), True)
        return rt

    def createTableAlarmRtDataIfNotExist(self, projId):
        '''
                                alarm_result.update({'alarm_id':alarm_1.get('alarm_id')
                                             , 'pointName':str(alarm_1.get('point'))
                                             , 'alarm_result':result_temp
                                             ,'alarm_time':data_temp.get('timeAt')
                                             ,'alarm_type':1})
        '''
        try:
            tableList = self.getTableListInRedis()
            dbName = app.config.get('DATABASE_BUFFER')

            if tableList:
                tableName = 'alarm_rtdata_%s' % (projId,)

                if tableName not in tableList:

                    if isinstance(tableName, str):
                        if len(tableName) > 0:
                            BEOPDataAccess._logger.writeLog('start auto create table %s' % (tableName,), True)
                            sql = "CREATE TABLE IF NOT EXISTS %s (\
                                    `alarm_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\
                                    `alarm_id` varchar(64) NOT NULL DEFAULT '',\
                                    `pointName` varchar(128) NOT NULL DEFAULT '',\
                                    `alarm_result` INT(10) NOT NULL DEFAULT 0,\
                                    `alarm_type` INT(10) NOT NULL DEFAULT 0,\
                                    `send_flag` INT(10)  NULL DEFAULT 0,\
                                    PRIMARY KEY (`alarm_id`)\
                               ) ENGINE=InnoDB DEFAULT CHARSET=utf8" % (tableName,)
                            result = self._mysqlDBContainer.op_db_update(dbName, sql, ())
                            if result:
                                tableList.append(tableName)
                                RedisManager.set_table_list(tableList)
                            else:
                                BEOPDataAccess._logger.writeLog('auto create table %s failed' % (tableName,), True)
        except Exception as e:
            BEOPDataAccess._logger.writeLog('createTableBufferRTTableIfNotExist error:' + e.__str__(), True)
        return False

    def updateAlarm_RtData_by_projid(self, projId, alarm_result_list):
        rt = {'state': 0}
        try:
            dbname = app.config.get('DATABASE_BUFFER')
            constMaxRowsPerOperation = 5000
            length = len(alarm_result_list) if alarm_result_list else 0
            tableName = None
            if length > 0:
                block = length // constMaxRowsPerOperation
                for count in range(block + 1):
                    idList = []
                    nameList = []
                    resultList = []
                    timeList = []
                    typeList = []

                    for index in range(count * constMaxRowsPerOperation, (count + 1) * constMaxRowsPerOperation):
                        if index >= length:
                            break
                        idList.append(alarm_result_list[index].get('alarm_id'))
                        nameList.append(alarm_result_list[index].get('pointName'))
                        resultList.append(alarm_result_list[index].get('alarm_result'))
                        timeList.append(alarm_result_list[index].get('alarm_time'))
                        typeList.append(alarm_result_list[index].get('alarm_type'))

                    self.createTableAlarmRtDataIfNotExist(projId)
                    tableName = 'alarm_rtdata_%s' % (projId,)
                    params = []
                    if tableName:
                        strsql = 'replace into %s' % tableName + '(alarm_id, pointName, alarm_result,alarm_time,alarm_type) values'
                        for index, alarmid in enumerate(idList):
                            strsql += '(%s, %s, %s, %s,%s),'
                            params.extend([str(alarmid), str(nameList[index]), str(resultList[index]), timeList[index],
                                           typeList[index]])
                        strsql = strsql[:-1]
                        if params:
                            bSuccess = self._mysqlDBContainer.op_db_update(dbname, strsql, tuple(params))
                            if bSuccess:
                                rt.update({'state': 1})
                            else:
                                BEOPDataAccess._logger.writeLog(
                                    'updateAlarm_RtData_by_projid:sql=%s execute failed' % (strsql,), True)
                                rt.update({'state': 403, 'message': 'manipulating database failed'})
        except Exception as e:
            BEOPDataAccess._logger.writeLog('updateRealtimeDataBufferMul_by_projid error:' + e.__str__(), True)
        return rt

    def get_alarm_real_info(self, projId):
        rt = []
        try:
            dbname = app.config.get('DATABASE_BUFFER')
            tableName = 'alarm_rtdata_%s' % (projId,)
            strsql = 'select alarm_id from %s' % tableName + ' where send_flag = 0'
            idlist = self._mysqlDBContainerReadOnly.op_db_query_one(dbname, strsql)
            rt = [str(item) for item in idlist]
            return rt
        except Exception as e:
            BEOPDataAccess._logger.writeLog('get_alarm_real_info error:' + e.__str__(), True)
        return rt

    def update_alarm_send_flag(self, projId, alarm_id_list=None):
        rt = False
        try:
            dbname = app.config.get('DATABASE_BUFFER')
            tableName = 'alarm_rtdata_%s' % (projId,)
            strsql = None
            if alarm_id_list:
                strsql = 'update %s' % tableName + ' set send_flag = 1 where alarm_id in ('
                for item in alarm_id_list:
                    pass
            else:
                strsql = 'update %s' % tableName + ' set send_flag = 1 where send_flag =0'
            if strsql:
                result = self._mysqlDBContainer.op_db_update(dbname, strsql, ())
            rt = True
        except Exception as e:
            BEOPDataAccess._logger.writeLog('update_alarm_send_flag error:' + e.__str__(), True)
        return rt

    def get_alarm_history(self, projId, alarm_id_list, s_time, e_time):
        rt = False
        try:
            if s_time is not None and e_time is not None:
                startTime = datetime.strptime(s_time, '%Y-%m-%d %H:%M:%S')
                endTime = datetime.strptime(e_time, '%Y-%m-%d %H:%M:%S')
                tStart = time.time()
                aTime = datetime.now().replace(second=0)
                connList = MongoConnManager.getHisConnTuple(projId)
                conn = None
                for connItem in connList:
                    st = connItem[1]
                    et = connItem[2]
                    if aTime <= et and aTime >= st:
                        conn = connItem[0]
                        break
                dbName = 'alarm_data_%d' % (int(projId))
                rt = conn.getAlarmHistoryData(alarm_id_list, startTime, endTime, dbName)
        except Exception as e:
            BEOPDataAccess._logger.writeLog('get_alarm_history error:' + e.__str__(), True)
        return rt

    def get_point_list_by_flag(self, projId, flag):
        rt = []
        try:
            tableName = ''
            if flag == 0:
                tableName = 'rtdata_' + str(projId)
            elif flag == 1:
                tableName = 'rtdata_%s_vpoint' % (projId,)
            elif flag == 2:
                tableName = 'rtdata_' + str(projId)
            sql = "select pointname from %s where flag=%s" % (tableName, flag)
            rvQuery = self._mysqlDBContainerReadOnly.op_db_query('beopdatabuffer', sql)
            if rvQuery != None:
                rt = [x[0] for x in rvQuery]
        except Exception as e:
            BEOPDataAccess._logger.writeLog('get_point_list_by_flag error:' + e.__str__(), True)
        return rt

    def getProjNameCnById(self, id):
        rt = None
        try:
            dbname = app.config.get('DATABASE')
            strQ = 'select name_cn from project where id=%s'
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strQ, (id,))
            rt = dbrv[0][0]
        except Exception as e:
            BEOPDataAccess._logger.writeLog('getProjNameCnById error:' + e.__str__(), True)
        return rt

    def get_failure_number_and_failure_time_of_statistics(self, projId):
        rt = []
        try:
            projId = int(projId)
            mysqlname = self.getMysqlNameById(projId)
            if mysqlname:
                startTime = datetime.now().strftime("%Y-%m-01 00:00:00")
                endTime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                self.make_diagnosis_table_ready(mysqlname)
                strSQL = 'SELECT df.`Name` AS FaultName, TIMESTAMPDIFF(SECOND, dn.Time, dn.EndTime) ' \
                         'FROM %s_diagnosis_notices AS dn LEFT JOIN %s_diagnosis_faults AS df ON df.Id = dn.FaultId ' \
                         'WHERE dn.Time >= "%s" AND dn.Time <= "%s" AND dn.EndTime IS NOT NULL ' \
                         'ORDER BY df.`Name`' % (mysqlname, mysqlname, startTime, endTime)
                dbrv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
                if dbrv:
                    faultname_duration = {}
                    for item in dbrv:
                        faultname = item[0]
                        duration = item[1]
                        if faultname in faultname_duration.keys():
                            faultname_duration.update({faultname: faultname_duration.get(faultname) + int(duration)})
                        else:
                            faultname_duration.update({faultname: int(duration)})
                strSQL = 'SELECT FaultName, count(*) as eNum, SUM(selectTable.fNum) as fNum ' \
                         'FROM (SELECT df.`Name` AS FaultName, COUNT(*) as fNum ' \
                         'FROM %s_diagnosis_notices AS dn ' \
                         'LEFT JOIN %s_diagnosis_faults AS df ON df.Id = dn.FaultId ' \
                         'LEFT JOIN %s_diagnosis_equipments AS de ON de.Id = df.EquipmentId ' \
                         'WHERE dn.Time >= "%s" AND dn.Time < "%s" ' \
                         'GROUP BY concat(df.`Name`, de.`Name`)) AS selectTable ' \
                         'GROUP BY selectTable.FaultName ' \
                         'ORDER BY eNum DESC' % (mysqlname, mysqlname, mysqlname, startTime, endTime)
                dbrv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
                if dbrv:
                    for item in dbrv:
                        if item[0] in faultname_duration.keys():
                            d = math.ceil(
                                faultname_duration.get(item[0]) / int(item[2]) / (60 * 60))  # 故障总时长除以诊断条数，单位小时
                        else:
                            d = None
                        rt.append({'FaultName': item[0], 'EquipmentNum': int(item[1]), 'duration': d})
        except Exception as e:
            self._logger.writeLog('get_failure_number_and_failure_time_of_statistics error:' + e.__str__(), True)
        return rt

    def genCloudSiteMap(self, proj, pointList):
        realPointList = []
        allCloudToSitePoints = RedisManager.get_cloudpoints_site(proj)

        requestSiteToCloudMaps = {}
        if allCloudToSitePoints:
            for pt in pointList:
                ptRealName = allCloudToSitePoints.get(pt)
                if ptRealName:
                    requestSiteToCloudMaps[ptRealName] = pt
                    realPointList.append(ptRealName)
                else:
                    requestSiteToCloudMaps[pt] = pt
                    realPointList.append(pt)
        else:
            realPointList = pointList
        return (realPointList, requestSiteToCloudMaps)

    def make_diagnosis_table_ready(self, mysqlname):
        fault_table_name = mysqlname + '_diagnosis_' + 'faults'
        equipment_table_name = mysqlname + '_diagnosis_' + 'equipments'
        notice_table_name = mysqlname + '_diagnosis_' + 'notices'
        zone_table_name = mysqlname + '_diagnosis_' + 'zones'
        self.createTableDiagnosisFaultsIfNotExist(fault_table_name)
        self.createTableDiagnosisEquipmentsIfNotExist(equipment_table_name)
        self.createTableDiagnosisNoticesIfNotExist(notice_table_name)
        self.createTableDiagnosisZonesIfNotExist(zone_table_name)

    def stat_fault_by_faultname(self, projId, starTime, endTime):
        rt = []
        try:
            projId = int(projId)
            mysqlname = self.getMysqlNameById(projId)
            if mysqlname:
                self.make_diagnosis_table_ready(mysqlname)
                strSQL = 'SELECT FaultName, SUM(nf.t) as duration FROM (' \
                         'SELECT df.`Name` AS FaultName, TIMESTAMPDIFF(SECOND, dn.Time, dn.EndTime) as t ' \
                         'FROM %s_diagnosis_notices AS dn ' \
                         'LEFT JOIN %s_diagnosis_faults AS df ON df.Id = dn.FaultId WHERE dn.Time >= "%s" ' \
                         'AND dn.Time <= "%s" AND dn.EndTime IS NOT NULL ORDER BY df.`Name`) as nf ' \
                         'GROUP BY FaultName' % (mysqlname, mysqlname, starTime, endTime)
                dbrv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
                if dbrv:
                    faultname_duration = {}
                    for item in dbrv:
                        faultname = item[0]
                        duration = item[1]
                        if faultname in faultname_duration.keys():
                            faultname_duration.update({faultname: faultname_duration.get(faultname) + int(duration)})
                        else:
                            faultname_duration.update({faultname: int(duration)})
                strSQL = 'SELECT FaultName, count(*) AS eNum, SUM(selectTable.fNum) AS fNum FROM (' \
                         'SELECT df.`Name` AS FaultName, COUNT(*) AS fNum FROM %s_diagnosis_notices AS dn ' \
                         'LEFT JOIN %s_diagnosis_faults AS df ON df.Id = dn.FaultId ' \
                         'LEFT JOIN %s_diagnosis_equipments AS de ON de.Id = df.EquipmentId WHERE ' \
                         'dn.Time >= "%s" AND dn.Time < "%s" GROUP BY concat(df.`Name`, de.`Name`)) AS selectTable ' \
                         'GROUP BY selectTable.FaultName ORDER BY eNum DESC' % (
                         mysqlname, mysqlname, mysqlname, starTime, endTime)
                dbrv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
                if dbrv:
                    for item in dbrv:
                        if item[0] in faultname_duration.keys():
                            d = math.ceil(
                                faultname_duration.get(item[0]) / int(item[2]) / (60 * 60))  # 故障总时长除以诊断条数，单位小时
                        else:
                            d = None
                        rt.append({'name': item[0], 'count': int(item[1]), 'timespan': d})
        except Exception as e:
            print('stat_fault_by_faultname error:' + e.__str__())
            logging.error(e.__str__())
        return rt

    def stat_fault_by_faultname_time(self, projId, selectstarttime, selectendtime, startHour, endhour):
        rt = []
        try:
            projId = int(projId)
            mysqlname = self.getMysqlNameById(projId)
            if mysqlname:
                self.make_diagnosis_table_ready(mysqlname)
                timeLimit = diagnosis_get_workHours(selectstarttime, selectendtime, startHour, endhour)
                if timeLimit:
                    strWhere = ''
                    for item in timeLimit:
                        strWhere += 'dn.Time >= "%s" AND dn.Time <= "%s" OR ' % (
                        item[0].strftime('%Y-%m-%d %H:%M:%S'), item[1].strftime('%Y-%m-%d %H:%M:%S'))
                    if strWhere:
                        strWhere = strWhere[:-4]
                    strSQL = 'SELECT FaultName, SUM(nf.t) as duration FROM (' \
                             'SELECT df.`Name` AS FaultName, TIMESTAMPDIFF(SECOND, dn.Time, dn.EndTime) as t ' \
                             'FROM %s_diagnosis_notices AS dn ' \
                             'LEFT JOIN %s_diagnosis_faults AS df ON df.Id = dn.FaultId WHERE (%s) ' \
                             'AND dn.EndTime IS NOT NULL ORDER BY df.`Name`) as nf ' \
                             'GROUP BY FaultName' % (mysqlname, mysqlname, strWhere)
                    dbrv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
                    if dbrv:
                        faultname_duration = {}
                        for item in dbrv:
                            faultname = item[0]
                            duration = item[1]
                            if faultname in faultname_duration.keys():
                                faultname_duration.update(
                                    {faultname: faultname_duration.get(faultname) + int(duration)})
                            else:
                                faultname_duration.update({faultname: int(duration)})
                    strSQL = 'SELECT FaultName, count(*) AS eNum, SUM(selectTable.fNum) AS fNum FROM (' \
                             'SELECT df.`Name` AS FaultName, COUNT(*) AS fNum FROM %s_diagnosis_notices AS dn ' \
                             'LEFT JOIN %s_diagnosis_faults AS df ON df.Id = dn.FaultId ' \
                             'LEFT JOIN %s_diagnosis_equipments AS de ON de.Id = df.EquipmentId WHERE ' \
                             '%s GROUP BY concat(df.`Name`, de.`Name`)) AS selectTable ' \
                             'GROUP BY selectTable.FaultName ORDER BY eNum DESC' % (
                             mysqlname, mysqlname, mysqlname, strWhere)
                    dbrv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
                    if dbrv:
                        for item in dbrv:
                            if item[0] in faultname_duration.keys():
                                d = math.ceil(
                                    faultname_duration.get(item[0]) / int(item[2]) / (60 * 60))  # 故障总时长除以诊断条数，单位小时
                            else:
                                d = None
                            rt.append({'name': item[0], 'count': int(item[1]), 'timespan': d})
        except Exception as e:
            print('stat_fault_by_faultname_time error:' + e.__str__())
            logging.error(e.__str__())
        return rt

    def stat_fault_by_buildingId(self, projId, startTime, endTime):
        rt = []
        try:
            projId = int(projId)
            mysqlname = self.getMysqlNameById(projId)
            if mysqlname:
                self.make_diagnosis_table_ready(mysqlname)
                strSQL = 'SELECT BuildingName, SUM(nf.t) as duration FROM (SELECT dz.BuildingId, dz.BuildingName, ' \
                         'TIMESTAMPDIFF(SECOND, dn.Time, dn.EndTime) as t FROM %s_diagnosis_notices AS dn ' \
                         'LEFT JOIN %s_diagnosis_faults AS df ON df.Id = dn.FaultId ' \
                         'LEFT JOIN %s_diagnosis_equipments AS de ON de.Id = df.EquipmentId ' \
                         'LEFT JOIN %s_diagnosis_zones AS dz ON dz.Id = de.ZoneId WHERE dn.Time >= "%s" ' \
                         'AND dn.Time <= "%s" AND dn.EndTime IS NOT NULL ORDER BY dz.BuildingId) AS nf ' \
                         'GROUP BY BuildingId' % (mysqlname, mysqlname, mysqlname, mysqlname, startTime, endTime)
                dbrv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
                if dbrv:
                    buildingname_duration = {}
                    for item in dbrv:
                        buildingname = item[0]
                        duration = item[1]
                        if buildingname in buildingname_duration.keys():
                            buildingname_duration.update(
                                {buildingname: buildingname_duration.get(buildingname) + int(duration)})
                        else:
                            buildingname_duration.update({buildingname: int(duration)})
                strSQL = 'SELECT BuildingName, count(*) AS number, SUM(selectTable.fNum) AS fNum FROM (SELECT lz.BuildingId AS BuildingId, ' \
                         'lz.BuildingName AS BuildingName, COUNT(*) AS fNum FROM ' \
                         '`%s_diagnosis_notices` AS dn LEFT JOIN `%s_diagnosis_faults` AS lf ON dn.FaultId = lf.Id ' \
                         'LEFT JOIN `%s_diagnosis_equipments` AS le ON le.Id = lf.EquipmentId ' \
                         'LEFT JOIN %s_diagnosis_zones AS lz ON lz.Id = le.ZoneId ' \
                         'WHERE dn.Time >= "%s" AND dn.Time <= "%s" GROUP BY concat(lf.`Name`, le.`Name`)) AS selectTable ' \
                         'GROUP BY BuildingId ORDER BY count(*) DESC' % (
                         mysqlname, mysqlname, mysqlname, mysqlname, startTime, endTime)
                dbrv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
                if dbrv:
                    for item in dbrv:
                        if item[0] in buildingname_duration.keys():
                            d = math.ceil(
                                buildingname_duration.get(item[0]) / int(item[2]) / (60 * 60))  # 故障总时长除以诊断条数，单位小时
                        else:
                            d = None
                        rt.append({'name': item[0], 'count': int(item[1]), 'timespan': d})
        except Exception as e:
            self._logger.writeLog('stat_fault_by_buildingId error:' + e.__str__(), True)
        return rt

    def stat_fault_by_zoneId(self, projId, startTime, endTime):
        rt = []
        try:
            projId = int(projId)
            mysqlname = self.getMysqlNameById(projId)
            if mysqlname:
                self.make_diagnosis_table_ready(mysqlname)
                strSQL = 'SELECT SubBuildingName, SUM(nf.t) as duration FROM (SELECT dz.Id, dz.SubBuildingName, ' \
                         'TIMESTAMPDIFF(SECOND, dn.Time, dn.EndTime) as t FROM %s_diagnosis_notices AS dn ' \
                         'LEFT JOIN %s_diagnosis_faults AS df ON df.Id = dn.FaultId ' \
                         'LEFT JOIN %s_diagnosis_equipments AS de ON de.Id = df.EquipmentId ' \
                         'LEFT JOIN %s_diagnosis_zones AS dz ON dz.Id = de.ZoneId WHERE dn.Time >= "%s" ' \
                         'AND dn.Time <= "%s" AND dn.EndTime IS NOT NULL ORDER BY dz.Id) as nf ' \
                         'GROUP BY Id' % (mysqlname, mysqlname, mysqlname, mysqlname, startTime, endTime)
                dbrv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
                if dbrv:
                    zone_duration = {}
                    for item in dbrv:
                        subbuildingname = item[0]
                        duration = item[1]
                        if subbuildingname in zone_duration.keys():
                            zone_duration.update({subbuildingname: zone_duration.get(subbuildingname) + int(duration)})
                        else:
                            zone_duration.update({subbuildingname: int(duration)})
                strSQL = 'SELECT SubBuildingName, count(*) AS number, SUM(selectTable.fNum) AS fNum FROM (SELECT lz.Id, lz.SubBuildingName, ' \
                         'COUNT(*) AS fNum FROM `%s_diagnosis_notices` AS dn ' \
                         'LEFT JOIN `%s_diagnosis_faults` AS lf ON dn.FaultId = lf.Id ' \
                         'LEFT JOIN `%s_diagnosis_equipments` AS le ON le.Id = lf.EquipmentId ' \
                         'LEFT JOIN %s_diagnosis_zones AS lz ON lz.Id = le.ZoneId WHERE dn.Time >= "%s" ' \
                         'AND dn.Time <= "%s" GROUP BY concat(lf.`Name`, le.`Name`)) AS selectTable ' \
                         'GROUP BY Id ORDER BY count(*) DESC' % (
                         mysqlname, mysqlname, mysqlname, mysqlname, startTime, endTime)
                dbrv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
                if dbrv:
                    for item in dbrv:
                        if item[0] in zone_duration.keys():
                            d = math.ceil(zone_duration.get(item[0]) / int(item[2]) / (60 * 60))  # 故障总时长除以诊断条数，单位小时
                        else:
                            d = None
                        rt.append({'name': item[0], 'count': int(item[1]), 'timespan': d})
        except Exception as e:
            self._logger.writeLog('stat_fault_by_zoneId error:' + e.__str__(), True)
        return rt

    def updateRealtimeInputDataMul_by_tableName_v2(self, tableName, pointNameList, pointValueList, pointTypeFlag,
                                                   timeStamp, dtuname=""):
        rt = {'state': 0, 'length': 0}
        try:
            dbname = app.config.get('DATABASE')
            constMaxRowsPerOperation = 5000
            length = len(pointNameList) if pointNameList else 0
            if length > 0:
                block = length // constMaxRowsPerOperation
                for count in range(block + 1):
                    pointList = []
                    valueList = []
                    for index in range(count * constMaxRowsPerOperation, (count + 1) * constMaxRowsPerOperation):
                        if index >= length:
                            break
                        pointList.append(pointNameList[index])
                        valueList.append(pointValueList[index])
                    self.createRTTableIfNotExist(tableName)
                    params = []
                    strsql = 'replace into %s' % tableName + '(time, pointname, pointvalue, flag, dtuname) values'
                    for index, pointname in enumerate(pointList):
                        strsql += "(%s, %s, %s, %s, %s),"
                        params.extend([timeStamp, pointname, str(valueList[index]), pointTypeFlag, dtuname])
                    strsql = strsql[:-1]

                    bSuccess = self._mysqlDBContainer.op_db_update(dbname, strsql, tuple(params))
                    if bSuccess:
                        rt.update({'state': 1, 'length': length})
                    else:
                        logging.error('Failed to update 3rd realtime data by tableName: %s. '
                                      'pointTypeFlag: %s, timeStamp: %s, dtuname: %s',
                                      tableName, pointTypeFlag, timeStamp, dtuname)
                        rt.update({'state': 403, 'message': 'manipulating database failed'})
        except Exception as e:
            self._logger.writeLog('updateRealtimeInputDataMul_by_tableName_v2 error:' + e.__str__(), True)
        return rt

    def getProjIdBydbName(self, dbname):
        try:
            projectInfoList = RedisManager.get_project_info_list()
            if projectInfoList:
                for item in projectInfoList:
                    if item['mysqlname'] == dbname:
                        return item['id']
        except Exception as e:
            self._logger.writeLog('getProjIdBydbName error:' + e.__str__(), True)
        return -1

    def checkPointNameConflict(self, projId):
        try:
            projId = int(projId)
            mysqlname = self.getMysqlNameById(projId)
            sqlCheck1 = 'select pointname FROM beopdatabuffer.rtdata_%d_vpoint where pointname in (select pointname from beopdatabuffer.rtdata_%d)' % (
            projId, projId)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query('beopdatabuffer', sqlCheck1, ())
            rt = {}
            ConflictList12 = []
            if dbrv:
                for item in dbrv:
                    ConflictList12.append(item[0])
            if ConflictList12:
                rt['conflict1to2'] = ConflictList12

            sqlCheck2 = 'select pointname FROM beopdatabuffer.rtdata_%d_vpoint where pointname in (select pointname from beopdoengine.rtdata_%s)' % (
            projId, mysqlname)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query('beopdatabuffer', sqlCheck2, ())

            ConflictList10 = []
            if dbrv:
                for item in dbrv:
                    ConflictList10.append(item[0])
            if ConflictList10:
                rt['conflict1to0'] = ConflictList10

            sqlCheck2 = 'select pointname FROM beopdatabuffer.rtdata_%d where flag=2 and pointname in (select pointname from beopdoengine.rtdata_%s)' % (
            projId, mysqlname)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query('beopdatabuffer', sqlCheck2, ())

            ConflictList20 = []
            if dbrv:
                for item in dbrv:
                    ConflictList20.append(item[0])
            if ConflictList20:
                rt['conflict2to0'] = ConflictList20

            return rt

        except Exception as e:
            self._logger.writeLog('updateRealtimeInputDataMul_by_tableName_v2 error:' + e.__str__(), True)
        return rt

    def diagnosis_get_energyAve_by_equipmentId(self, projId, faultName, startTime, endTime, interval):
        rt = {faultName: None}
        projId = int(projId)
        mysqlname = self.getMysqlNameById(projId)
        if mysqlname:
            self.make_diagnosis_table_ready(mysqlname)
            strSQL = 'SELECT AVG(n.Energy), f.`Name`, u.Factor, f.RunTimeDay, ' \
                     'f.RunTimeWeek, f.RunTimeMonth, f.RunTimeYear ' \
                     'FROM %s_diagnosis_notices AS n ' \
                     'LEFT JOIN %s_diagnosis_faults AS f ON n.FaultId = f.Id ' \
                     'LEFT JOIN unitconversion as u ON f.Unit = u.NewUnit ' \
                     'WHERE n.Time <= "%s" AND n.Time >= "%s" AND n.Energy <> 0 ' \
                     'AND f.`Name` = "%s" GROUP BY f.EquipmentId' % (
                     mysqlname, mysqlname, endTime, startTime, faultName)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
            if dbrv:
                if interval == 'Day':
                    energy = sum([x[0] * x[2] * x[3] for x in dbrv])
                elif interval == 'Week':
                    energy = sum([x[0] * x[2] * x[4] for x in dbrv])
                elif interval == 'Month':
                    energy = sum([x[0] * x[2] * x[5] for x in dbrv])
                elif interval == 'Year':
                    energy = sum([x[0] * x[2] * x[6] for x in dbrv])
                else:
                    energy = None
                rt.update({faultName: energy})
        return rt

    def get_id_dbname_by_dtuname(self, strDTUName):
        dbname = app.config.get('DATABASE')
        rt = None
        try:
            q = 'select id,dbname from dtuserver_prj where dtuname="%s"' % (strDTUName,)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, (), True)
            if dbrv:
                rt = dbrv[0], dbrv[1], False
            else:
                q = "insert into dtuserver_prj(dtuname,dbname,dtuRemark,synRealTable,serverCode) " \
                    "SELECT '%s', '%s', 'Auto Create', '%s', 5  " \
                    "FROM  dual where not exists (select dtuname from dtuserver_prj where dtuname = '%s')" % \
                    (strDTUName, 'beopdata_' + strDTUName, 'rtdata_beopdata_' + strDTUName, strDTUName)
                id = self._mysqlDBContainer.op_db_update_with_id(dbname, 'dtuserver_prj', q, ())
                if id >= 0:
                    rt = id, 'beopdata_' + strDTUName, True
        except Exception as e:
            BEOPDataAccess._logger.writeLog('get_id_dbname_by_dtuname failed:' + e.__str__(), True)
        return rt

    def update_dtuserver_prj_info_online(self, id, strTime, count):
        dbname = app.config.get('DATABASE')
        rt = None
        try:
            q = "insert into dtuserver_prj_info(id,online,LastOnlineTime,LastReceivedTime,ReceivePointCount) values(%s,'Online','%s','%s',%s) on " \
                "duplicate key update online='Online',LastOnlineTime='%s',LastReceivedTime='%s',ReceivePointCount=%s" % (
                    id, strTime, strTime, count, strTime, strTime, count)
            rt = self._mysqlDBContainer.op_db_update(dbname, q, ())
        except Exception as e:
            BEOPDataAccess._logger.writeLog('update_dtuserver_prj_info_online failed:' + e.__str__(), True)
        return rt

    def update_dtuserver_prj_info_offline(self, id, strTime):
        dbname = app.config.get('DATABASE')
        rt = None
        try:
            q = "insert into dtuserver_prj_info(id,online,LastOnlineTime) values(%s,'Offline','%s') on " \
                "duplicate key update online='Offline',LastOnlineTime='%s'" % (id, strTime, strTime)
            rt = self._mysqlDBContainer.op_db_update(dbname, q, ())
        except Exception as e:
            BEOPDataAccess._logger.writeLog('update_dtuserver_prj_info_offline failed:' + e.__str__(), True)
        return rt

    def get_third_dtu_project(self):
        rt = {}
        try:
            dbname = app.config.get('DATABASE')
            strQ = 'select id,dtuname from dtuserver_prj where serverCode=5'
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strQ, ())
            if dbrv:
                for item in dbrv:
                    rt.update({item[0]: item[1]})
        except Exception as e:
            BEOPDataAccess._logger.writeLog('get_third_dtu_project error:' + e.__str__(), True)
        return rt

    def get_third_dtu_info(self, ids):
        rt = []
        try:
            if ids:
                dbname = app.config.get('DATABASE')
                strQ = 'select id,online,LastOnlineTime,LastReceivedTime from dtuserver_prj_info where id in %s' % (
                str(ids).replace('[', '(').replace(']', ')'))
                dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strQ, ())
                for item in dbrv:
                    rt.append(dict(id=item[0], online=item[1], LastOnlineTime=item[2], LastReceivedTime=item[3]))
        except Exception as e:
            BEOPDataAccess._logger.writeLog('get_third_dtu_info error:' + e.__str__(), True)
        return rt

    def insert_into_dtuserver_on_off_line(self, strTime, strDTUName, state):
        rt = False
        try:
            dbname = app.config.get('DATABASE')
            q = "insert into dtuserver_on_offline(time,dtuname, state) values('%s','%s',%s)" % (
            strTime, strDTUName, state)
            rt = self._mysqlDBContainer.op_db_update(dbname, q, ())
        except Exception as e:
            BEOPDataAccess._logger.writeLog('insert_into_dtuserver_on_off_line error:' + e.__str__(), True)
        return rt

    def getCollectionNameById(self, id):
        rt = None
        try:
            ret = self.findProjectInfoItemById(id)
            if ret:
                rt = ret['collectionname']
            else:
                dbname = app.config.get('DATABASE')
                strQ = 'select name_en, s3dbname,mysqlname,collectionname from project where id=%s'
                dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strQ, (id,))
                if len(dbrv) == 0:
                    rt = None
                elif len(dbrv[0]) == 0:
                    rt = None
                else:
                    pInfoList = RedisManager.get_project_info_list()
                    projectInfoList = pInfoList if pInfoList != None else []
                    projectInfoList.append(dict(name_en=dbrv[0][0], s3dbname=dbrv[0][1], mysqlname=dbrv[0][2], id=id,
                                                collectionname=dbrv[0][3]))
                    RedisManager.set_project_info_list(projectInfoList)
                    rt = dbrv[0][3]
        except Exception as e:
            print(e.__str__())
            logging.error('getCollectionNameById error:' + e.__str__())
        return rt

    def get_v2_struct_seperate_time(self, id):
        try:
            id = int(id)
            projectInfoList = RedisManager.get_project_info_list()
            if projectInfoList is None or type(projectInfoList) is not list:
                return None
            for item in projectInfoList:
                if item['id'] == id:
                    return item.get('v2_time')
        except Exception as e:
            print(e.__str__())
            logging.error('get_v2_struct_seperate_time error:' + e.__str__())
        return None

    def get_energy_all_by_time(self, projId, startTime, endTime):
        rt = {}
        try:
            mysqlName = self.getMysqlNameById(projId)
            strSQL = 'SELECT SUM(1), SUM(n.Energy * timestampdiff(SECOND, n.Time, n.EndTime) / (60 * 60)), ' \
                     'if (f.UserFaultGrade is NOT NULL, f.UserFaultGrade, f.DefaultGrade) AS grade ' \
                     'FROM %s_diagnosis_notices AS n LEFT JOIN %s_diagnosis_faults AS f ON n.FaultId = f.Id ' \
                     'WHERE n.Time <= "%s" AND n.Time >= "%s" ' \
                     'GROUP BY grade ORDER BY grade' % (mysqlName, mysqlName, endTime, startTime)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
            n = 0
            rt.update({'faultnum': 0, 'energy': 0})
            for item in dbrv:
                while n < int(item[2]):
                    rt.update({
                        'fault_level' + str(n) + '_num': 0,
                        'fault_level' + str(n) + '_energy': 0
                    })
                    n += 1
                num = int(item[0]) if item[0] else 0
                energy = float(item[1]) if item[1] else 0
                rt.update({
                    'fault_level' + str(n) + '_num': num,
                    'fault_level' + str(n) + '_energy': energy
                })
                rt['faultnum'] += num
                rt['energy'] += energy
                n += 1
        except Exception as e:
            print('get_energy_all_by_time error:' + e.__str__())
            logging.error(e.__str__())
        return rt

    def get_energy_by_systemName(self, projId, startTime, endTime):
        rt = {}
        try:
            mysqlName = self.getMysqlNameById(projId)
            strSQL = 'SELECT e.SystemName, COUNT(n.Id), ' \
                     'SUM(n.Energy * timestampdiff(SECOND, n.Time, n.EndTime) / (60 * 60)) ' \
                     'FROM %s_diagnosis_notices AS n ' \
                     'LEFT JOIN %s_diagnosis_faults AS f ON f.Id = n.FaultId ' \
                     'LEFT JOIN %s_diagnosis_equipments AS e ON f.EquipmentId = e.Id ' \
                     'WHERE n.Time <= "%s" AND n.Time >= "%s" ' \
                     'GROUP BY e.SystemName' % (mysqlName, mysqlName, mysqlName, endTime, startTime)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
            if dbrv:
                for item in dbrv:
                    rt.update({item[0]: {'faultnum': item[1], 'energy': item[2]}})
        except Exception as e:
            print('get_energy_by_systemName error:' + e.__str__())
            logging.error(e.__str__())
        return rt

    def get_energylist_by_faultName_order_by_energy(self, projId, startTime, endTime):
        rt = {}
        try:
            mysqlName = self.getMysqlNameById(projId)
            strSQL = 'SELECT c.`Name`,COUNT(c.`Name`),SUM(c.enery) AS enery ' \
                     'FROM (SELECT f.`Name` AS  `Name`, COUNT(n.Id), ' \
                     'SUM(n.Energy * timestampdiff(SECOND, n.Time, n.EndTime) / (60 * 60)) AS enery ' \
                     'FROM %s_diagnosis_notices AS n LEFT JOIN %s_diagnosis_faults AS f ON f.Id=n.FaultId ' \
                     'WHERE n.Time <= "%s" AND n.Time >= "%s" GROUP BY f.`Name`,f.ParentId ' \
                     'ORDER BY enery DESC) AS c GROUP BY c.`Name` ' \
                     'ORDER BY enery DESC' % (mysqlName, mysqlName, endTime, startTime)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
            if dbrv:
                FaultNameList = []
                energy = []
                OccurTimes = []
                for item in dbrv:
                    FaultNameList.append(item[0])
                    energy.append(item[2])
                    OccurTimes.append(item[1])
                rt.update({'FaultName': FaultNameList, 'energy': energy,
                           'OccurTimes': OccurTimes})
        except Exception as e:
            print('get_energylist_by_faultName_order_by_energy error:' + e.__str__())
            logging.error(e.__str__())
        return rt

    def get_new_order_num(self, projId, startTime, endTime):
        rt = 0
        try:
            mysqlName = self.getMysqlNameById(projId)
            strSQL = 'SELECT OrderId FROM %s_diagnosis_notices ' \
                     'WHERE Time <= "%s" AND Time >= "%s" ' \
                     'AND OrderId <> "0" ' \
                     'GROUP BY OrderId' % (mysqlName, endTime, startTime)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
            rt = len(dbrv)
        except Exception as e:
            print('get_new_order_num error:' + e.__str__())
            logging.error(e.__str__())
        return rt

    def get_finished_orderId(self, projId, startTime, endTime):
        rt = []
        try:
            mysqlName = self.getMysqlNameById(projId)
            strSQL = 'SELECT OrderId FROM %s_diagnosis_notices ' \
                     'WHERE OrderId <> "0" AND Time <= "%s" ' \
                     'AND Time >= "%s" ' \
                     'AND OrderId <> "0" GROUP BY OrderId' % (mysqlName, endTime, startTime)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
            rt = [ObjectId(x[0]) for x in dbrv if ObjectId.is_valid(x[0])]
        except Exception as e:
            print('get_finished_order_num error:' + e.__str__())
            logging.error(e.__str__())
        return rt

    def get_response_time_avg(self, projId, startTime, endTime):
        rt = 0
        mysqlName = self.getMysqlNameById(projId)
        strSQL = 'SELECT TIMESTAMPDIFF(SECOND, Time, CheckTime) ' \
                 'FROM %s_diagnosis_notices ' \
                 'WHERE Time <= "%s" AND Time >= "%s" AND OrderId <> "0" ' \
                 'GROUP BY OrderId' % (mysqlName, endTime, startTime)
        dbrv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
        if dbrv:
            res_list = [x[0] for x in dbrv if x[0]]
            if res_list:
                rt = float(sum(res_list)) / len(res_list)
        return rt

    # 开始清洗
    # TODO 数据清洗主功能函数，并写入清洗数量至Redis
    def wash_data(self, projId, points, methods, filter_method, pulse):
        connList = MongoConnManager.getHisConnTuple(projId)
        if connList:
            rt = self.get_conn_db(projId, connList)
            for item in rt:
                conn = item['conn']
                dbList = item['dbname']
                for db in dbList:
                    self.wash_operator(projId, conn, db, points, methods, filter_method, pulse)
            ArchiveManager.set_wash_status(projId, 2)

    def wash_operator(self, projId, conn, db, points, methods, filter_method, pulse):
        # 1电表过滤 2脉冲过滤 3负数过滤
        for pt in points:
            for m in methods:
                wash_num = self.wash_db_data(projId, conn, db, pt, m, filter_method, pulse)
                logging.info("wash_operator: projId: {} filter_method: {} "
                             "method: {} point: {} wash count: {}".format(projId, filter_method, m, pt, wash_num))

    def get_first_value(self, data):
        if data:
            value = data.get('value')
            if value:
                min_hour = str(min(value.keys(), key=lambda x: int(x)))
                min_minute = str(min(value[min_hour].keys(), key=lambda x: int(x)))
                last_value = data['value'][min_hour][min_minute]
                return min_hour, min_minute, last_value
        return None, None, None

    def wash_db_data(self, projId, conn, db, pt, method, filter_method, pulse):
        wash_num = 0
        if db.startswith('v2'):
            # v2格式 最开始一天的数据
            oldest_data = conn.mdbBb[db].find_one({'pointname': pt})
            if oldest_data:
                # 求出最小的hour和minute以及最早的1个数据
                hour, minute, last_value = self.get_first_value(oldest_data)
                oldest_time = oldest_data.get('time').strptime(oldest_data.get('time'), "%Y-%m-%d %H:%M:%S") \
                    if isinstance(oldest_data.get('time'), str) else oldest_data.get('time')
                days = (datetime.now() - oldest_time).days
                for i in range(0, days + 1):
                    et = oldest_time + timedelta(days=i)
                    cursor = conn.mdbBb[db].find_one({'pointname': pt, 'time': et})
                    value = cursor.get('value', {})
                    day_data = []
                    for h in sorted(value.keys(), key=lambda x: int(x)):
                        for m in sorted(value[h].keys(), key=lambda x: int(x)):
                            # day_data的item为一个元祖，包含时间、分钟、点值
                            day_data.append((h, m, value[h][m]))
                    for index, item in enumerate(day_data):
                        now_value, next_value = item[-1], None
                        if filter_method == 3:
                            if index + 1 != len(day_data):
                                next_value = day_data[index + 1][-1]
                            else:
                                next_day_data = conn.mdbBb[db].find_one(
                                    {'pointname': pt, 'time': et + timedelta(days=1)})
                                next_value = self.get_first_value(next_day_data)[-1]
                        try:
                            if method == 1:
                                # 说明需要大于等于上一个值
                                if float(now_value) < float(last_value):
                                    last_value = self.wash_with_filter_v2(last_value, pt, now_value, et, item[0],
                                                                          item[1], next_value, filter_method, conn, db)
                                    wash_num += 1
                                    print("projId: {} point: {} time: {} {}:{} wash succeed!".format(projId, pt,
                                                                                                     str(et.date()),
                                                                                                     item[0], item[1]))
                                else:
                                    print("projId: {} point: {} time: {} {}:{} data normal!".format(projId, pt,
                                                                                                    str(et.date()),
                                                                                                    item[0], item[1]))
                                    last_value = now_value
                            elif method == 2:
                                # 说明需要处理脉冲的值
                                if abs(float(now_value) - float(last_value)) > float(pulse):
                                    last_value = self.wash_with_filter_v2(last_value, pt, now_value, et, item[0],
                                                                          item[1], next_value, filter_method, conn, db)
                                    wash_num += 1
                                    print("projId: {} point: {} time: {} {}:{} wash succeed!".format(projId, pt,
                                                                                                     str(et.date()),
                                                                                                     item[0], item[1]))
                                else:
                                    print("projId: {} point: {} time: {} {}:{} data normal!".format(projId, pt,
                                                                                                    str(et.date()),
                                                                                                    item[0], item[1]))
                                    last_value = now_value
                            elif method == 3:
                                # 说明是小于0过滤
                                if now_value <= 0:
                                    last_value = self.wash_with_filter_v2(last_value, pt, now_value, et, item[0],
                                                                          item[1], next_value, filter_method, conn, db)
                                    wash_num += 1
                                    print("projId: {} point: {} time: {} {}:{} wash succeed!".format(projId, pt,
                                                                                                     str(et.date()),
                                                                                                     item[0], item[1]))
                                else:
                                    print("projId: {} point: {} time: {} {}:{} data normal!".format(projId, pt,
                                                                                                    str(et.date()),
                                                                                                    item[0], item[1]))
                                    last_value = now_value
                        except Exception as err:
                            print("projId: {} point: {} error: {}".format(projId, pt, str(err)))
                            logging.info("projId: {} point: {} error: {}".format(projId, pt, str(err)))
                        ArchiveManager.write_complete_num(projId)
        else:
            # return
            # 老的格式
            oldest_data = conn.mdbBb[db].find_one(
                {'pointname': pt, 'time': datetime(year=2017, month=4, day=15)})  # TODO 测试用
            if oldest_data:
                oldest_time = oldest_data.get('time').strptime(oldest_data.get('time'), "%Y-%m-%d %H:%M:%S") \
                    if isinstance(oldest_data.get('time'), str) else oldest_data.get('time')
                last_value = oldest_data.get('value')
                days = (datetime.now() - oldest_time).days
                for i in range(1, days + 1):
                    et = oldest_time + timedelta(days=1)
                    cursor = conn.mdbBb[db].find({'time': {"$gt": oldest_time, "$lte": et}, "pointname": pt})
                    for item in cursor:
                        now_value = item.get('value')
                        try:
                            now_value = float(now_value)
                            last_value = float(last_value)
                            if method == 1:
                                # 说明需要大于等于上一个值
                                if now_value < last_value:
                                    last_value = self.wash_with_filter(last_value, pt, item, filter_method, conn, db)
                                    wash_num += 1
                                    print("projId: {} point: {} time: {} wash succeed!".format(projId, pt,
                                                                                               str(item.get('time'))))
                                else:
                                    print("projId: {} point: {} time: {} data normal!".format(projId, pt,
                                                                                              str(item.get('time'))))
                                    last_value = now_value
                            elif method == 2:
                                # 说明需要处理脉冲的值
                                # if pulse:
                                if abs(now_value - last_value) > float(pulse):
                                    wash_num += 1
                                    last_value = self.wash_with_filter(last_value, pt, item, filter_method, conn, db)
                                    print("projId: {} point: {} time: {} wash succeed!".format(projId, pt,
                                                                                               str(item.get('time'))))
                                else:
                                    print("projId: {} point: {} time: {} data normal!".format(projId, pt,
                                                                                              str(item.get('time'))))
                                    last_value = now_value
                            elif method == 3:
                                # 说明是小于0过滤
                                if now_value <= 0:
                                    last_value = self.wash_with_filter(last_value, pt, item, filter_method, conn, db)
                                    wash_num += 1
                                    print("projId: {} point: {} time: {} wash succeed!".format(projId, pt,
                                                                                               str(item.get('time'))))
                                else:
                                    print("projId: {} point: {} time: {} data normal!".format(projId, pt,
                                                                                              str(item.get('time'))))
                                    last_value = now_value
                        except Exception as err:
                            print("projId: {} point: {} error: {}".format(projId, pt, str(err)))
                            logging.info("projId: {} point: {} error: {}".format(projId, pt, str(err)))
                        ArchiveManager.write_complete_num(projId)
                    oldest_time = et
        return wash_num

    def wash_with_filter(self, last_value, pt, item, filter_method, conn, db):
        item_time = item.get('time')
        if filter_method == 1:
            conn.mdbBb[db].delete_one({'time': item_time, 'pointname': pt})
            conn.mdbBb[db + '_wash'].update_one({'time': item_time, 'pointname': pt},
                                                {"$set": item}, upsert=True)
        elif filter_method == 2:
            conn.mdbBb[db].update_one({'time': item_time, 'pointname': pt},
                                      {"$set": {'value': last_value}})
            conn.mdbBb[db + '_wash'].update_one({'time': item_time, 'pointname': pt},
                                                {"$set": item}, upsert=True)
        elif filter_method == 3:
            next_item = conn.mdbBb[db].find_one({'time': {"$gt": item_time}, 'pointname': pt})
            if next_item and next_item.get('value'):
                dis_value = (float(next_item.get('value')) + last_value) / 2
                conn.mdbBb[db].update_one({'time': item_time, 'pointname': pt},
                                          {"$set": {'value': dis_value}})
                conn.mdbBb[db + '_wash'].update_one({'time': item_time, 'pointname': pt},
                                                    {"$set": item}, upsert=True)
                return dis_value
        return last_value

    def wash_with_filter_v2(self, last_value, pt, now_value, item_time, hour, minute, next_value, filter_method, conn,
                            db):
        if filter_method == 1:
            conn.mdbBb[db].update_one({'time': item_time, 'pointname': pt},
                                      {'$unset': {'value.{}.{}'.format(hour, minute): now_value}})
            conn.mdbBb[db + '_wash'].update_one({'time': item_time, 'pointname': pt},
                                                {"$set": {'value.{}.{}'.format(hour, minute): now_value}}, upsert=True)
        elif filter_method == 2:
            conn.mdbBb[db].update_one({'time': item_time, 'pointname': pt},
                                      {"$set": {'value.{}.{}'.format(hour, minute): last_value}})
            conn.mdbBb[db + '_wash'].update_one({'time': item_time, 'pointname': pt},
                                                {"$set": {'value.{}.{}'.format(hour, minute): now_value}}, upsert=True)
        elif filter_method == 3:
            if next_value:
                dis_value = (float(next_value) + float(last_value)) / 2
                conn.mdbBb[db].update_one({'time': item_time, 'pointname': pt},
                                          {"$set": {'value.{}.{}'.format(hour, minute): dis_value}})
                conn.mdbBb[db + '_wash'].update_one({'time': item_time, 'pointname': pt},
                                                    {"$set": {'value.{}.{}'.format(hour, minute): now_value}},
                                                    upsert=True)
                return dis_value
        return last_value

    def get_total_wash(self, projId, points):
        total = 0
        connList = MongoConnManager.getHisConnTuple(projId)
        if connList:
            rt = self.get_conn_db(projId, connList)
            for item in rt:
                ptNum = 0
                conn = item['conn']
                dbList = item['dbname']
                for db in dbList:
                    for pt in points:
                        first_item = conn.mdbBb[db].find_one({'pointname': pt})
                        last_item = list(conn.mdbBb[db].find({'pointname': pt}).sort([('time', -1)]).limit(1))
                        if first_item and last_item:
                            last_item = last_item[0]
                            newest = last_item['time'] if isinstance(last_item['time'],
                                                                     datetime) else datetime.strptime(last_item['time'],
                                                                                                      "%Y-%m-%d %H:%M:%S")
                            oldest = first_item['time'] if isinstance(first_item['time'],
                                                                      datetime) else datetime.strptime(
                                first_item['time'], "%Y-%m-%d %H:%M:%S")
                            # 由于此处用count会导致mongo巨慢无比，所以改为推算
                            if db.startswith('m5'):
                                ptNum = int((newest - oldest).total_seconds() / 60)
                            elif db.startswith('v2'):
                                ptNum = int((newest - oldest).days) * 60 * 24
                            total += ptNum
        return total

    def get_conn_db(self, projId, connList):
        dbName = self.getCollectionNameById(projId)
        if dbName:
            v2_db = "v2_data_" + dbName
            db = "m5_data_" + dbName
            seperate_time = "2017-05-22 14:40:00"
            # seperate_time = self.get_v2_struct_seperate_time(projId)
            seperate_time = datetime.strptime(seperate_time, '%Y-%m-%d %H:%M:%S') if seperate_time else None
            rt = []
            for item in connList:
                st = item[1]
                et = item[2]
                if seperate_time:
                    if st < seperate_time < et:
                        dbList = [v2_db, db]
                        rt.append({'conn': item[0], 'dbname': dbList})
                    elif seperate_time <= st:
                        rt.append({'conn': item[0], 'dbname': [v2_db]})
                    elif seperate_time >= et:
                        rt.append({'conn': item[0], 'dbname': [db]})
                else:
                    rt.append({'conn': item[0], 'dbname': [db]})
            return rt
        else:
            return []

    def get_userId_by_name(self, name):
        dbname = ('beopdoengine')
        q = ('select id from user where userfullname = %s')
        rv = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, (name,))
        if len(rv) == 0:
            return ''
        else:
            return rv[0][0]

    def getMongoConnWithTime(self, projId, timeStr):
        '''
        :param projId:
        :return: a list contains conn and dbName
        '''
        rt = []
        connList = MongoConnManager.getHisConnTuple(int(projId))
        dbname = self.getCollectionNameById(projId)
        if dbname:
            if isinstance(connList, list):
                if len(connList) > 0:
                    find_list = self.analysisHisConnection(connList, timeStr, timeStr)
                    find_list = self.filterConnection(projId, find_list)
                    for item in find_list:
                        if item.get('st') and item.get('et'):
                            conn = item.get('conn')
                            flag = item.get('flag', 1)
                            if conn:
                                if flag == 1:
                                    # old format
                                    db = app.config['M5FORMAT'] + dbname
                                elif flag == 2:
                                    # new format
                                    db = app.config['V2FORMAT'] + dbname
                                else:
                                    continue
                                rt.append({'conn': conn, 'dbName': db})
                    return rt

    # 获取项目某个时刻的历史数据conn和dbName
    def getHistoryDataAtTime(self, projId, timeAt):
        timeList = []
        nameList = []
        valueList = []
        cursor = None
        try:
            find_list = self.getMongoConnWithTime(projId, timeAt)
            for item in find_list:
                conn = item.get('conn')
                db = item.get('dbName')
                if db.startswith(app.config['V2FORMAT']):
                    timeAtObject = datetime.strptime(timeAt, '%Y-%m-%d %H:%M:%S').replace(hour=0, minute=0)
                    hour = str(datetime.strptime(timeAt, '%Y-%m-%d %H:%M:%S').hour)
                    minute = str(datetime.strptime(timeAt, '%Y-%m-%d %H:%M:%S').minute)
                    query = {'time': timeAtObject, "value.{}.{}".format(hour, minute): {'$nin': [None, 'Null', 'None']}}
                    cursor = conn.mdbBb[db].find(query, {"value.{}.{}".format(hour, minute): 1, "pointname": 1})
                    for item in cursor:
                        timeList.append(datetime.strptime(timeAt, '%Y-%m-%d %H:%M:%S'))
                        nameList.append(item['pointname'])
                        valueList.append(item['value'].get(hour, {}).get(minute))
                else:
                    timeAtObject = datetime.strptime(timeAt, '%Y-%m-%d %H:%M:%S')
                    post = {'time': timeAtObject, "value": {'$nin': [None, 'Null', 'None', 'null']}}
                    cursor = conn.mdbBb[db].find(post).sort(
                        [('pointname', pymongo.ASCENDING), ('time', pymongo.ASCENDING)])  # pay attention to index
                    for item in cursor.batch_size(600):
                        timeList.append(item['time'])
                        nameList.append(item['pointname'])
                        valueList.append(item['value'])
        except Exception as e:
            BEOPMongoDataAccess._logger.writeLog('getHistoryDataAtTime failed' + e.__str__(), True)
        finally:
            if cursor:
                cursor.close()
        return dict(timeList=timeList, nameList=nameList, valueList=valueList)

    def createTableIfNotExist(self, tableName):
        rt = False
        try:
            dbname = app.config.get('DATABASE')
            sql = '''CREATE TABLE IF NOT EXISTS `%s` (
                  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  `pointname` varchar(128) NOT NULL DEFAULT '',
                  `pointvalue` varchar(256) NOT NULL DEFAULT '',
                  `flag` int(11) DEFAULT NULL,
                  PRIMARY KEY (`pointname`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8''' % (tableName,)
            rt = self._mysqlDBContainer.op_db_update(dbname, sql, ())

        except Exception as e:
            BEOPDataAccess._logger.writeLog('createTableIfNotExist error:' + e.__str__(), True)
        return rt

    def getTakenakaPointName(self, topicStr):
        rt = ''
        try:
            dbname = app.config.get('DATABASE')
            sql = "select pointName from takenaka_topic_config where topic='%s'" % (topicStr,)
            # sqlinsert = "insert into a_temp_topic (topic) values ('%s') ON DUPLICATE KEY UPDATE topic = '%s'"%(topicStr,topicStr,)
            # self._mysqlDBContainer.op_db_update(dbname, sqlinsert, ())
            dataList = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql)
            for item in dataList:
                rt = item[0]
        except Exception as e:
            BEOPDataAccess._logger.writeLog('getTakenakaPointName error:' + e.__str__(), True)
        return rt

    @classmethod
    def is_belong_to_local_cluster(cls, projId):
        rt = False
        clusterName = app.config.get('BEOPCLUSTER')
        cluster_project_map = RedisManager.get_cluster_project_map()
        if cluster_project_map:
            if int(projId) in cluster_project_map.get(clusterName, []):
                rt = True
        return rt

    def get_energy_all_by_time_v2(self, projId, startTime, endTime):
        rt = {}
        try:
            strSQL = 'SELECT SUM(1), SUM(energy * timestampdiff(SECOND, time, endTime) / (60 * 60)), ' \
                     'grade FROM diagnosis_%s_notice WHERE time <= "%s" AND time >= "%s" ' \
                     'GROUP BY grade ORDER BY grade' % (projId, endTime, startTime)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
            n = 0
            rt.update({'faultnum': 0, 'energy': 0})
            for item in dbrv:
                while n < int(item[2]):
                    rt.update({
                        'fault_level' + str(n) + '_num': 0,
                        'fault_level' + str(n) + '_energy': 0
                    })
                    n += 1
                num = int(item[0]) if item[0] else 0
                energy = float(item[1]) if item[1] else 0
                rt.update({
                    'fault_level' + str(n) + '_num': num,
                    'fault_level' + str(n) + '_energy': energy
                })
                rt['faultnum'] += num
                rt['energy'] += energy
                n += 1
        except Exception as e:
            print('get_energy_all_by_time_v2 error:' + e.__str__())
            logging.error(e.__str__())
        return rt

    def get_energy_by_systemName_v2(self, projId, startTime, endTime):
        rt = {}
        try:
            strSQL = 'SELECT e.className, COUNT(n.Id), SUM(n.Energy * timestampdiff(SECOND, n.time, n.EndTime) / (60 * 60)) ' \
                     'FROM diagnosis_%s_notice AS n LEFT JOIN diagnosis_entity AS e ON n.entityId=e.id ' \
                     'WHERE n.time <= "%s" AND n.time >= "%s" GROUP BY e.className' % (projId, endTime, startTime)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
            if dbrv:
                for item in dbrv:
                    rt.update({item[0]: {'faultnum': item[1], 'energy': item[2]}})
        except Exception as e:
            print('get_energy_by_systemName_v2 error:' + e.__str__())
            logging.error(e.__str__())
        return rt

    def get_response_time_avg_v2(self, projId, startTime, endTime):
        rt = 0
        strSQL = 'SELECT TIMESTAMPDIFF(SECOND, Time, CheckTime) ' \
                 'FROM diagnosis_%s_notice ' \
                 'WHERE Time <= "%s" AND Time >= "%s" AND OrderId <> "0" ' \
                 'GROUP BY OrderId' % (projId, endTime, startTime)
        dbrv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
        if dbrv:
            res_list = [x[0] for x in dbrv if x[0]]
            if res_list:
                rt = float(sum(res_list)) / len(res_list)
        return rt

    def get_energylist_by_faultName_order_by_energy_v2(self, projId, startTime, endTime, lang):
        rt = {}
        try:
            if lang == 'zh':
                fault_table = 'diagnosis_fault_zh'
            else:
                fault_table = 'diagnosis_fault'
            strSQL = 'SELECT c.`Name`, COUNT(c.`Name`), SUM(c.enery) AS enery ' \
                     'FROM (SELECT f.`Name` AS `Name`, COUNT(n.Id), ' \
                     'SUM(n.Energy * timestampdiff(SECOND, n.Time, n.EndTime) / (60 * 60)) AS enery ' \
                     'FROM diagnosis_%s_notice AS n LEFT JOIN %s AS f ON f.id = n.faultId ' \
                     'WHERE n.Time <= "%s" AND n.Time >= "%s" GROUP BY f.`Name`, n.entityId ' \
                     'ORDER BY enery DESC) AS c GROUP BY c.`Name` ' \
                     'ORDER BY enery DESC' % (projId, fault_table, endTime, startTime)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
            if dbrv:
                FaultNameList = []
                energy = []
                OccurTimes = []
                for item in dbrv:
                    FaultNameList.append(item[0])
                    energy.append(item[2])
                    OccurTimes.append(item[1])
                rt.update({'FaultName': FaultNameList, 'energy': energy,
                           'OccurTimes': OccurTimes})
        except Exception as e:
            print('get_energylist_by_faultName_order_by_energy_v2 error:' + e.__str__())
            logging.error(e.__str__())
        return rt

    def get_finished_orderId_v2(self, projId, startTime, endTime):
        rt = []
        try:
            strSQL = 'SELECT OrderId FROM diagnosis_%s_notice ' \
                     'WHERE OrderId <> "0" AND Time <= "%s" ' \
                     'AND Time >= "%s" ' \
                     'AND OrderId <> "0" GROUP BY OrderId' % (projId, endTime, startTime)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
            rt = [ObjectId(x[0]) for x in dbrv if ObjectId.is_valid(x[0])]
        except Exception as e:
            print('get_finished_orderId_v2 error:' + e.__str__())
            logging.error(e.__str__())
        return rt

    def get_new_order_num_v2(self, projId, startTime, endTime):
        rt = 0
        try:
            mysqlName = self.getMysqlNameById(projId)
            strSQL = 'SELECT OrderId FROM diagnosis_%s_notice ' \
                     'WHERE Time <= "%s" AND Time >= "%s" ' \
                     'AND OrderId <> "0" ' \
                     'GROUP BY OrderId' % (projId, endTime, startTime)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
            rt = len(dbrv)
        except Exception as e:
            print('get_new_order_num_v2 error:' + e.__str__())
            logging.error(e.__str__())
        return rt
