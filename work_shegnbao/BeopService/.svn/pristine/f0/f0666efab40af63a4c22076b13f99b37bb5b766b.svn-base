__author__ = 'David'

from mainService import app
import logging
from datetime import datetime,timedelta
from mod_DataAccess.BEOPMySqlDBReadOnlyContainer import *
from mod_DataAccess.BEOPMongoDataAccess import *
from mod_DataAccess.BEOPMySqlDBContainer import *
from math import floor as math_floor, ceil as math_ceil
from numpy import average, median, std, int16
from mod_DataAccess.MongoConnManager import *
from mod_DataAccess.RedisManager import RedisManager

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

    def __init__(self):
        pass

    @classmethod
    def getInstance(cls):
        if cls.__instance is None:
            cls.__instance = BEOPDataAccess()
        return cls.__instance

    @classmethod
    def getSqlReadConn(cls):
        return cls._mysqlDBContainerReadOnly

    @classmethod
    def getSqlWriteConn(cls):
        return cls._mysqlDBContainer

    def getProjMysqldb(self, id):
        rt = None
        try:
            ret = self.findProjectInfoItemById(id)
            if ret:
                rt = ret['mysqlname']
            else:
                strErr = 'getProjMysqldb:projId=%s is not in memcache,get info from mysql,and insert into memcache'%(id,)
                logging.info(strErr)
                dbname = app.config.get('DATABASE')
                strQ = 'select mysqlname, name_en, s3dbname, collectionname from project where id=%s'
                dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strQ, (id,))
                if not dbrv:
                    strErr = 'tried in memcache and mysql, both nothing, getProjMysqldb:projId=%s is not in mysql'%(id,)
                    logging.error(strErr)
                    rt = None
                else:
                    if dbrv[0]:
                        projectInfoList = RedisManager.get_project_info_list()
                        if not projectInfoList:
                            self.UpdateProjectInfo()
                            projectInfoList = RedisManager.get_project_info_list()
                        if projectInfoList:
                            projectInfoList.append(dict(name_en= dbrv[0][1],  s3dbname= dbrv[0][2],  mysqlname=dbrv[0][0], id = id, collectionname=dbrv[0][3]))
                            RedisManager.set_project_info_list( projectInfoList)
                            rt = dbrv[0][0]
                        else:
                            logging.info('getProjMysqldb:projectInfoList is not in memcache')
                    else:
                        logging.info('getProjMysqldb:projId=%s is not in mysql', id)
                        rt = None
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def GetCollectionNameById(self, id):
        projectInfoList = RedisManager.get_project_info_list()
        if not projectInfoList:
            self.UpdateProjectInfo()
            projectInfoList = RedisManager.get_project_info_list()
        if projectInfoList:
            for item in projectInfoList:
                if item.get('id') == id:
                    return item.get('collectionname','')
        else:
            print('GetCollectionNameById:projectInfoList is not in memcache')
            logging.info('GetCollectionNameById:projectInfoList is not in memcache')
        return ''

    def UpdateProjectInfo(self):
        rt = False
        print('UpdateProjectInfo Once!')
        logging.warning('UpdateProjectInfo Once!')
        try:
            projectInfoList = []
            dbname = app.config.get('DATABASE')
            q = 'select id, s3dbname, mysqlname, name_en, collectionname, name_cn, name_english, hisdata_structure_v2_from_time from project'
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, ())
            if dbrv == None:
                print('UpdateProjectInfo:select xxx from project failed,return none')
                logging.info('UpdateProjectInfo:select xxx from project failed,return none')
                rt = False
            else:
                for item in dbrv:
                    projectInfoList.append(dict(name_en=item[3], s3dbname=item[1], mysqlname=item[2], id=item[0], collectionname=item[4], name_cn=item[5], name_english=item[6], v2_time=item[7]))
                bSet = RedisManager.set_project_info_list( projectInfoList)
            if projectInfoList:
                rt = True
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def setDTUFlag(self, dtuName, flag):
        rt = True
        try:
            dbBase = app.config.get('DATABASE')
            sql = 'update dtuserver_prj set bSendData = %s where dtuname = "%s"'%(flag, dtuName)
            rt = self._mysqlDBContainer.op_db_update(dbBase, sql, ())
        except Exception as e:
            print(e.__str__())
            rt = False
        return rt

    def findProjectInfoItemById(self, id):
        try:
            projectInfoList =RedisManager.get_project_info_list()
            if not projectInfoList:
                self.UpdateProjectInfo()
                projectInfoList = RedisManager.get_project_info_list()
                if not projectInfoList:
                    print('findProjectInfoItemById:projectInfoList in memcache is None')
                    logging.info('findProjectInfoItemById:projectInfoList in memcache is None')
                    return None
            for item in projectInfoList:
                if int(item['id']) == int(id):
                    return item
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return None

    def getProjIdBydbName(self, dbname):
        try:
            projectInfoList =RedisManager.get_project_info_list()
            if projectInfoList:
                for item in projectInfoList:
                    if item['mysqlname'] == dbname:
                        return item['id']
        except Exception as e:
            app.logger.error('getProjIdBydbName error:' + e.__str__())
        return -1

    def get_history_data_padded(self, projectId,  pointList, strTimeStart, strTimeEnd, strTimeFormat, bSearchNearest=False, collectionName=None, noSearchBeforeStartTime=None):
        result = []
        # invalid query filter:
        now_time = datetime.now()
        if strTimeStart is None or strTimeEnd is None or strTimeFormat is None:
            logging.info('get_history_data_padded:invalid params')
            result.append(dict(error='time'))
            return result
        pointList = [x for x in pointList if len(x) > 0]
        startTime = None
        endTime = None
        try:
            startTime = datetime.strptime(strTimeStart,'%Y-%m-%d %H:%M:%S')
            startTime = startTime.replace(second=0)
            strTimeStart = startTime.strftime('%Y-%m-%d %H:%M:%S')
            endTime = datetime.strptime(strTimeEnd,'%Y-%m-%d %H:%M:%S')
        except:
            logging.info('get_history_data_padded:invalid time string')
            result.append(dict(error='invalid time string'))
            return result

        if startTime > endTime:
            print('get_history_data_padded:error params get_history_data_padded:[startTime:%s],[endTime:%s]'%(strTimeStart,strTimeEnd))
            app.logger.error('get_history_data_padded:error params get_history_data_padded:[startTime:%s],[endTime:%s]'%(strTimeStart,strTimeEnd))
            return [dict(error='error: startTime > endTime ')]
        if endTime > now_time:
            endTime = now_time
        if strTimeFormat == 'm1':
            if (endTime-startTime).days > 7:
                logging.info('get_history_data_padded: time range too long for m1 period data query ')
                return [{'error': 'historyData', 'msg': 'time range is 7 days for m1'}]
        elif strTimeFormat == 'm5':
            if (endTime-startTime).days > 30:
                logging.info('get_history_data_padded: time range too long for m5 period data query :' + strTimeStart + strTimeEnd)
                return [{'error': 'historyData', 'msg': 'time range is 30 days for m5'}]
        elif strTimeFormat == 'h1':
            if (endTime-startTime).days > 60:
                logging.info('get_history_data_padded: time range too long for h1 period data query ')
                return [{'error': 'historyData', 'msg': 'time range is 60 days for h1'}]
        elif strTimeFormat == 'd1':
            if (endTime-startTime).days > 365:
                logging.info('get_history_data_padded: time range too long for d1 period data query ')
                return [{'error': 'historyData', 'msg': 'time range is 365 days for d1'}]
        elif strTimeFormat == 'M1':
            pass
        else:
            logging.info('get_history_data_padded: time period format not supported')
            return [dict(error='time period format not supported')]
        nCount = Utils.get_timepoint_count(strTimeStart, strTimeEnd, strTimeFormat)
        if len(pointList) * nCount > 100000:
            return [dict(error='pointList length * time point count >50000, too much points.')]
        rv = self.getHistoryData(projectId, pointList, strTimeStart, strTimeEnd, strTimeFormat, bSearchNearest, collectionName, noSearchBeforeStartTime)
        if len(rv) == 0:
            return [dict(error='no data history')]
        # mango added to prevent exception
        if type(rv) == type('123'):
            return [dict(error=rv)]
        hisDataDicList = self.padData(rv, strTimeStart, strTimeEnd, strTimeFormat)
        hisDataDicList = [] if hisDataDicList is None else hisDataDicList
        statics = self.staticsData(hisDataDicList)
        statics = [] if statics is None else statics
        try:
            if len(hisDataDicList) == len(statics):
                for i in range(len(hisDataDicList)):
                    result.append({
                        'name': hisDataDicList[i].get('name'), 'history': hisDataDicList[i].get('record'),
                        'avg': statics[i]['statics']['avgvalue'], 'max': statics[i]['statics']['maxvalue'],
                        'min': statics[i]['statics']['minvalue'], 'median': statics[i]['statics']['medianvalue'],
                        'std': statics[i]['statics']['stdvalue']})
        except Exception:
            logging.error('Unhandled exception!', exc_info=True, stack_info=True)
        return result

    def get_history_data_at_time(self, projId, pointList, timeStr):
        rt = []
        try:
            if isinstance(timeStr, str) and isinstance(pointList, list) and pointList:
                connList = MongoConnManager.getHisConn(int(projId))
                find_list = self.analysisHisConnection(connList, timeStr, timeStr)
                find_list = self.filterConnection(projId, find_list)
                for item in find_list:
                    if item.get('st') and item.get('et'):
                        conn = item.get('conn')
                        flag = item.get('flag', 1)
                        if conn:
                            if flag == 1:
                                continue
                            else:
                                time_point = datetime.strptime(timeStr, '%Y-%m-%d %H:%M:%S')
                                hour, minute = str(time_point.hour), str(time_point.minute)
                                day_point = time_point.replace(hour=0, minute=0, second=0)
                                query = {'time': day_point,
                                         'pointname': {'$in': pointList},
                                         }
                                dbname = app.config['V2FORMAT'] + BEOPDataAccess.getInstance().getCollectionNameById(int(projId))
                                cursor = conn.mdbBb[dbname].find(query, {'value.{}.{}'.format(hour, minute): 1, 'pointname': 1, '_id': 0})
                                valueDict = {}
                                for item in cursor:
                                    pointname = item.get('pointname')
                                    value = item.get('value', {}).get(hour, {}).get(minute)
                                    valueDict.update({pointname: value})
                                rt.extend(sorted([{'pointname': pt, 'value': valueDict.get(pt)} for pt in pointList], key=lambda x: x['pointname']))
            else:
                raise Exception("wrong params! please check it!")
        except Exception as e:
            app.logger.error('get_history_data_at_time error: %s' % (e.__str__(),))
            raise Exception('get_history_data_at_time error: %s' % (e.__str__(),))
        return rt

    def getHistoryData(self, proj, pointName, timeStart, timeEnd, timeFormat, bSearchNearest=False, collectionName=None, noSearchBeforeStartTime=None):
        if isinstance(timeStart, str) and isinstance(timeEnd,str):
            start_object = datetime.strptime(timeStart, '%Y-%m-%d %H:%M:%S')
            end_object = datetime.strptime(timeEnd, '%Y-%m-%d %H:%M:%S')
            if start_object > end_object:
                logging.info('getHistoryData:query time is invalid')
                return 'query time is invalid'
        elif isinstance(timeStart,datetime) and isinstance(timeEnd,datetime):
            if timeStart > timeEnd:
                start_object = timeStart
                end_object = timeEnd
                logging.info('getHistoryData:query time is invalid')
                return 'query time is invalid'
        start_object = start_object.replace(second=0)
        end_object = end_object.replace(second=0)
        dbname = ''
        try:
            dbname = BEOPDataAccess.getInstance().GetCollectionNameById(int(proj))
        except Exception as e:
            app.logger.error('getHistoryData:proj in getHistoryData is not int')
        if dbname is None:
            app.logger.error('getHistoryData:finding project database failed')
            return 'error: finding project database failed'
        if proj is None or proj == -1:
            connList = MongoConnManager.getHisConn(-1)
        else:
            connList = MongoConnManager.getHisConn(int(proj))
        return self.mergeHisData(connList, int(proj), pointName, start_object.strftime('%Y-%m-%d %H:%M:%S'),
                                 end_object.strftime('%Y-%m-%d %H:%M:%S'), timeFormat, bSearchNearest, collectionName, noSearchBeforeStartTime)

    def mergeHisData(self, connList, projId, pointName, timeStart, timeEnd, timeFormat, bSearchNearest=False, collectionName=None, noSearchBeforeStartTime=None):
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
            dbname = self.getCollectionNameById(projId) if projId != -1 else collectionName
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
                                                                              et.strftime('%Y-%m-%d %H:%M:%S'), timeFormat, bSearchNearest)
                                    elif flag == 2:
                                        item_rt = conn.getHistoryDataByFormat_v2(dbname, pointName,
                                                                              st.strftime('%Y-%m-%d %H:%M:%S'),
                                                                              et.strftime('%Y-%m-%d %H:%M:%S'), timeFormat, bSearchNearest, noSearchBeforeStartTime)
                                    rt = self.mergeReturnData(item_rt, rt)
                else:
                    if connList:
                        rt = connList.getHistoryDataByFormat(dbname, pointName, timeStart, timeEnd, timeFormat, bSearchNearest)
        except Exception as e:
            print('mergeHisData error:%s' % (e.__str__(),))
            app.logger.error('mergeHisData error:%s' % (e.__str__(),))
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

    def mergesetHisData(self, projId, connList, pointName, pointValue, pointTime, collectionName,):
        rt = False
        try:
            if isinstance(connList, list):
                if len(connList) > 0:
                    for conn in connList:
                        st = conn[1]
                        et = conn[2]
                        if pointTime <= et and pointTime >= st:
                            rt = conn[0].saveHistoryData(projId, pointName, pointValue, pointTime, collectionName)
                            break
            else:
                if connList:
                    rt = connList.saveHistoryData(projId, pointName, pointValue, pointTime, collectionName)
        except Exception as e:
            app.logger.error('mergesetHisData error with projId=%s, connList=%s, pointName=%s, pointValue=%s, pointTime=%s, collectionName=%s', projId, connList, pointName, pointValue, pointTime, collectionName, exc_info=True, stack_info=True)
        return rt


    def staticsData(self, DataDicList):
        if len(DataDicList)==0 or DataDicList=='[]':
            print('staticsData error:DataDicList is invalid')
            app.logger.error('staticsData error:DataDicList is invalid')
            return None

        nameLast = ""
        ret = []
        fNumberList = []
        try:
            for i in range(len(DataDicList)):
                name = DataDicList[i].get('name')
                if name != nameLast:
                    if len(fNumberList) > 0:
                        ret.append(dict(pointname=nameLast, statics=dict(avgvalue= average(fNumberList), maxvalue=max(fNumberList), minvalue=min(fNumberList), medianvalue= median(fNumberList), stdvalue= std(fNumberList))))
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
                if i == len(DataDicList)-1:
                    if len(fNumberList) > 0:
                        ret.append(dict(pointname=nameLast, statics=dict(avgvalue= average(fNumberList), maxvalue=max(fNumberList), minvalue=min(fNumberList), medianvalue= median(fNumberList), stdvalue= std(fNumberList))))
        except Exception as e:
            print('staticsData failed:'+e.__str__())
            app.logger.error('staticsData failed:'+e.__str__())
        return ret

    def getProjMysqldbByName(self, name_en):
        rt = None
        try:
            ret = self.findProjectInfoItemByNameEn(name_en)
            if ret:
                rt = ret['mysqlname']
            else:
                print('getProjMysqldbByName:%s is not in memcache,so get info from mysql'%(name_en,))
                app.logger.error('getProjMysqldbByName:%s is not in memcache,so get info from mysql'%(name_en,))

                dbname = app.config.get('DATABASE')
                strQ = 'select s3dbname, mysqlname, id, collectionname from project where name_en=%s'
                dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strQ, (name_en,))
                if len(dbrv)==0:
                    print('getProjMysqldbByName:%s in mot in table project'%(name_en,))
                    logging.info('getProjMysqldbByName:%s in mot in table project'%(name_en,))
                    return None
                elif len(dbrv[0])==0:
                    print('getProjMysqldbByName:%s in mot in table project'%(name_en,))
                    logging.info('getProjMysqldbByName:%s in mot in table project'%(name_en,))
                    return None
                else:
                    projectInfoList = RedisManager.get_project_info_list() if RedisManager.get_project_info_list() != None else []
                    if not projectInfoList:
                        self.UpdateProjectInfo()
                        projectInfoList = RedisManager.get_project_info_list()
                    if projectInfoList:
                        projectInfoList.append(dict(name_en= name_en,  s3dbname= dbrv[0][0],  mysqlname=dbrv[0][1], id = dbrv[0][2], collectionname = dbrv[0][3]))
                        RedisManager.set_project_info_list( projectInfoList)
                        rt = dbrv[0][1]
                    else:
                        print('getProjMysqldbByName:projectInfoList is not in memcache')
                        logging.info('getProjMysqldbByName:projectInfoList is not in memcache')
        except Exception:
            logging.error('Failed to get project MySQL by English name %s!', name_en, exc_info=True, stack_info=True)
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
                print('findProjectInfoItemByNameEn:projectInfoList is not in memcache')
                app.logger.error('findProjectInfoItemByNameEn:projectInfoList is not in memcache')
        except Exception as e:
            print('findProjectInfoItemByNameEn error:' + e.__str__())
            app.logger.error('findProjectInfoItemByNameEn error:' + e.__str__())
        return None

    def getProjNameById(self, id):
        rt = None
        try:
            ret = self.findProjectInfoItemById(id)
            if ret:
                rt = ret['name_en']
            else:
                print('getProjNameById:projId=%s is not in memcache,so get info from mysql'%(id,))
                logging.info('getProjNameById:projId=%s is not in memcache,so get info from mysql'%(id,))
                dbname = app.config.get('DATABASE')
                strQ = 'select name_en, s3dbname,mysqlname,collectionname from project where id=%s'
                dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname,strQ, (id,))
                if len(dbrv)==0:
                    print('getProjNameById:projId=%s is not in table project'%(id,))
                    logging.info('getProjNameById:projId=%s is not in table project'%(id,))
                    rt = None
                elif len(dbrv[0])==0:
                    print('getProjNameById:projId=%s is not in table project'%(id,))
                    logging.info('getProjNameById:projId=%s is not in table project'%(id,))
                    rt = None
                else:
                    projectInfoList = RedisManager.get_project_info_list() if RedisManager.get_project_info_list() != None else []
                    if not projectInfoList:
                        self.UpdateProjectInfo()
                        projectInfoList = RedisManager.get_project_info_list()
                    if projectInfoList:
                        projectInfoList.append(dict(name_en= dbrv[0][0],  s3dbname= dbrv[0][1],  mysqlname=dbrv[0][2], id = id, collectionname=dbrv[0][3]))
                        RedisManager.set_project_info_list( projectInfoList)
                        rt = dbrv[0][0]
                    else:
                        print('getProjNameById:projectInfoList is not in memcache')
                        logging.info('getProjNameById:projectInfoList is not in memcache')
        except Exception as e:
            print('getProjNameById error:' + e.__str__())
            app.logger.error('getProjNameById error:' + e.__str__())
        return rt

    def getInputTable(self,projName):
        #print('getInputTable')
        rvQuery = []
        try:
            rtTableName = self.getProjMysqldbByName(projName)
            dbname = app.config['DATABASE']
            tableName = 'rtdata_' + rtTableName
            self.createRTTableIfNotExist(tableName)
            q = 'select time, pointname, pointvalue from %s' % tableName
            rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, q,  ())
        except Exception as e:
            print('getInputTable error:' + e.__str__())
            app.logger.error('getInputTable error:' + e.__str__())
        return rvQuery

    def getInputTableContainer(self,projName, pointList=[]):
        #print('getInputTable')
        rvQuery = {}
        try:
            rtTableName = self.getProjMysqldbByName(projName)
            dbname = app.config['DATABASE']
            tableName = 'rtdata_' + rtTableName
            self.createRTTableIfNotExist(tableName)
            if pointList:
                q = 'select time, pointname, pointvalue, flag from %s where pointname in (' % tableName + ','.join(list(map(lambda x: '"'+ x + '"', pointList))) + ')'
            else:
                q = 'select time, pointname, pointvalue, flag from %s' % tableName
            rv = self._mysqlDBContainerReadOnly.op_db_query(dbname, q,  ())
            for item in rv:
                rvQuery[item[1]] = {'time':item[0].strftime('%Y-%m-%d %H:%M:%S'), 'value':item[2], 'flag':item[3] if item[3] is not None else 0}
        except Exception as e:
            print('getInputTableContainer error:' + e.__str__())
            app.logger.error('getInputTableContainer error:' + e.__str__())
        return rvQuery

    def getProjS3db(self,id):
        rt = None
        try:
            ret = self.findProjectInfoItemById(id)
            if ret:
                rt = ret['s3dbname']
            else:
                print('getProjS3db:projId=%s is not in memcache, so get info from mysql'%(id,))
                logging.info('getProjS3db:projId=%s is not in memcache, get info from mysql'%(id,))
                dbname = app.config.get('DATABASE')
                q = ('select s3dbname, mysqlname, name_en, collectionname from project where id=%s' )
                dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, (id,) )
                if dbrv == None or len(dbrv)<1:
                    print('getProjS3db:projId=%s is not in table project'%(id,))
                    logging.info('getProjS3db:projId=%s is not in table project'%(id,))
                    rt = None
                else:
                    projectInfoList = RedisManager.get_project_info_list() if RedisManager.get_project_info_list() != None else []
                    if not projectInfoList:
                        self.UpdateProjectInfo()
                        projectInfoList = RedisManager.get_project_info_list()
                    if projectInfoList:
                        projectInfoList.append(dict(name_en= dbrv[0][2],  s3dbname= dbrv[0][0],  mysqlname=dbrv[0][1], id = id, collectionname=dbrv[0][3]))
                        RedisManager.set_project_info_list( projectInfoList)
                        rt = dbrv[0][0]
                    else:
                        print('getProjS3db:projectInfoList is not in memcache')
                        logging.info('getProjS3db:projectInfoList is not in memcache')
        except Exception as e:
            print('getProjS3db error:' + e.__str__())
            app.logger.error('getProjS3db error:' + e.__str__())
        return rt


    def getProjIdByName(self,name_en):
        rt = None
        try:
            ret = self.findProjectInfoItemByNameEn(name_en)
            if ret:
                rt = ret['id']
            else:
                print('getProjIdByName:%s is not in memcache, so get info from mysql'%(name_en,))
                logging.info('getProjIdByName:%s is not in memcache, so get info from mysql'%(name_en,))
                dbname = app.config.get('DATABASE')
                strQ = 'select mysqlname, id, s3dbname, collectionname from project where name_en=%s'
                dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname,strQ, (name_en,))
                if not dbrv:
                    print('getProjIdByName:%s is not in table project'%(name_en,))
                    logging.info('getProjIdByName:%s is not in table project'%(name_en,))
                    rt = None
                else:
                    if dbrv[0]:
                        projectInfoList = RedisManager.get_project_info_list() if RedisManager.get_project_info_list() != None else []
                        if not projectInfoList:
                            self.UpdateProjectInfo()
                            projectInfoList = RedisManager.get_project_info_list()
                        if projectInfoList:
                            projectInfoList.append(dict(name_en= name_en, id = dbrv[0][1],  s3dbname= dbrv[0][2],  mysqlname=dbrv[0][0], collectionname=[0][3]))
                            RedisManager.set_project_info_list( projectInfoList)
                            rt = dbrv[0][1]
                        else:
                            print('getProjIdByName:projectInfoList is not in memcache')
                            logging.info('getProjIdByName:projectInfoList is not in memcache')
                    else:
                        rt = None
        except Exception as e:
            print('getProjIdByName error:' + e.__str__())
            app.logger.error('getProjIdByName error:' + e.__str__())
        return rt

    def appendMutilOutputToSiteTable(self, projId, pointList,valueList ):
        #print('appendOutputTable')
        bSuccess = False
        try:
            nPointCount = len(pointList)
            nValueCount = len(valueList)
            if nPointCount <= 0:
                print('appendMutilOutputToSiteTable:len(pointList)<=0')
                logging.info('appendMutilOutputToSiteTable:len(pointList)<=0')
                return 'failed'
            if nPointCount != nValueCount:
                print('appendMutilOutputToSiteTable:len(pointList)!=len(valueList)')
                logging.info('appendMutilOutputToSiteTable:len(pointList)!=len(valueList)')
                return 'failed'
            sql = 'delete from `realtimedata_output_to_site` where pointname IN ('
            for index in range(nPointCount):
                sql += "'" + pointList[index] + "',"
            sql = sql[:-1]
            sql += ")"
            bSuccess = self._mysqlDBContainer.op_db_update(app.config['DATABASE'], sql, ())
            if not bSuccess:
                print('appendMutilOutputToSiteTable:delete from realtimedata_output_to_site failed, pointList=%s'%(str(pointList),))
                logging.info('appendMutilOutputToSiteTable:delete from realtimedata_output_to_site failed, pointList=%s'%(str(pointList),))
            sql = 'insert into `realtimedata_output_to_site` (time, projectid, pointname,pointvalue) values '
            for index2 in range(nPointCount):
                sql += ("(now(), %s,'"%projId) + pointList[index2] + "','" + str(valueList[index2]) + "'),"
            sql = sql[:-1]
            bSuccess = self._mysqlDBContainer.op_db_update(app.config['DATABASE'], sql, ())
            if not bSuccess:
                print('appendMutilOutputToSiteTable:insert into realtimedata_output_to_site failed, pointList=%s, valusList=%s'%(str(pointList), str(valueList)))
                logging.info('appendMutilOutputToSiteTable:insert into realtimedata_output_to_site failed, pointList=%s, valusList=%s'%(str(pointList), str(valueList)))
        except Exception as e:
            print('appendMutilOutputToSiteTable error:' + e.__str__())
            app.logger.error('appendMutilOutputToSiteTable error:' + e.__str__())
        return bSuccess

    def updateRealtimeInputData(self, projId, pointName, pointValue):
        bSuccess = False
        q = ''
        try:
            rtTableName = self.getProjMysqldb(projId)
            dbname = app.config['DATABASE']
            if not (isinstance(pointValue,str) or isinstance(pointValue,float) or isinstance(pointValue,int)):
                pointValue = '0.0'
            q = "replace into rtdata_%s"%rtTableName + "(time, pointname, pointvalue) values(now(), %s,%s)"
            params = ( pointName, str(pointValue) )
            bSuccess = self._mysqlDBContainer.op_db_update(dbname, q, params)
        except Exception as e:
            print('updateRealtimeInputData error:' + e.__str__())
            app.logger.error('updateRealtimeInputData error:' + e.__str__())
        if bSuccess:
            return 'success'
        else:
            logging.info('updateRealtimeInputData:sql=%s execute failed', q)
            return 'error: manipulating database failed'

    def appendOutputToSiteTable(self, projectId, pointname, pointvalue):
        bSuccess = False
        try:
            dbname = app.config['DATABASE']
            q = 'delete from `realtimedata_output_to_site` where projectid = %s and pointname = %s'
            bSuccess = self._mysqlDBContainer.op_db_update(dbname, q,  (projectId, pointname))
            if not bSuccess:
                logging.info('appendOutputToSiteTable:sql=%s execute failed', q)
            q = 'insert into `realtimedata_output_to_site` (projectid, pointname, pointvalue) values (%s, %s, %s)'
            bSuccess = self._mysqlDBContainer.op_db_update(dbname, q, (projectId, pointname, pointvalue))
            if not bSuccess:
                logging.info('appendOutputToSiteTable:sql=%s execute failed', q)
        except Exception as e:
            print('appendOutputToSiteTable error:' + e.__str__())
            app.logger.error('appendOutputToSiteTable error:' + e.__str__())
        return bSuccess

    def updateRealtimeInputDataMul(self, projId, pointNameList, pointValueList, pointTypeFlag):
        result = ''
        try:
            result = self.updateRealtimeDataBufferMul_by_projid(projId, pointNameList, pointValueList ,pointTypeFlag)
        except Exception as e:
            print('updateRealtimeInputDataMul failed:'+e.__str__())
            app.logger.error('updateRealtimeInputDataMul failed:'+e.__str__())
        return result

    def updateRealtimeInputDataMul_by_tableName(
            self, tableName, pointNameList, pointValueList, pointTypeFlag, dtuname=''):
        rt = {'state':0, 'length':0}
        try:
            dbname = app.config.get('DATABASE')
            constMaxRowsPerOperation = 5000
            length = len(pointNameList) if pointNameList else 0
            if length > 0:
                block = length//constMaxRowsPerOperation
                for count in range(block+1):
                    pointList = []
                    valueList = []
                    for index in range(count*constMaxRowsPerOperation,(count+1)*constMaxRowsPerOperation):
                        if index >= length:
                            break
                        pointList.append(pointNameList[index])
                        valueList.append(pointValueList[index])
                    self.createRTTableIfNotExist(tableName)
                    params = []
                    strsql = 'replace into %s' % tableName + '(time, pointname, pointvalue, flag, dtuname) values'
                    for index, pointname in enumerate(pointList):
                        strsql += '(now(), %s, %s, %s, %s),'
                        params.extend([pointname, str(valueList[index]), pointTypeFlag, dtuname])
                    strsql = strsql[:-1]

                    bSuccess = self._mysqlDBContainer.op_db_update(dbname, strsql, tuple(params))
                    if bSuccess:
                        rt.update({'state': 1,'length': length})
                    else:
                        print('updateRealtimeInputDataMul_by_tableName:sql=%s execute failed' % (strsql,))
                        app.logger.error('updateRealtimeInputDataMul_by_tableName:sql=%s execute failed' % (strsql,))
                        rt.update({'state': 403, 'message': 'manipulating database failed'})
                logging.debug('update table %s, length = %s', tableName, length)
        except Exception:
            logging.error("Failed to update realtime data by table name with "
                          "tableName=%s, pointNameList=%s, pointValueList=%s, pointTypeFlag=%s, dtuname=%s",
                          tableName, pointNameList, pointValueList, pointTypeFlag, dtuname,
                          exc_info=True, stack_info=True)
        return rt

    def updateRealtimeInputDataMul_by_tableName_v2(
            self, tableName, pointNameList, pointValueList, pointTypeFlag, timeStamp, dtuname=''):
        rt = {'state': 0, 'length': 0}
        try:
            dbname = app.config.get('DATABASE')
            constMaxRowsPerOperation = 5000
            length = len(pointNameList) if pointNameList else 0
            if length > 0:
                block = length//constMaxRowsPerOperation
                for count in range(block+1):
                    pointList = []
                    valueList = []
                    for index in range(count*constMaxRowsPerOperation,(count+1)*constMaxRowsPerOperation):
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
                        logging.error('updateRealtimeInputDataMul_by_tableName_v2:sql=%s execute failed', strsql)
                        rt.update({'state': 403, 'message': 'manipulating database failed'})
                logging.debug('update table %s, length=%s', tableName, length)
        except Exception:
            logging.error(
                'Failed to update realtime data by table name (v2) with '
                'tableName=%s, pointNameList=%s, pointValueList=%s, pointTypeFlag=%s, timeStamp=%s, dtuname=%s',
                tableName, pointNameList, pointValueList, pointTypeFlag, timeStamp, dtuname,
                exc_info=True, stack_info=True
            )
        return rt

    def updateSiteDataInBufferMul(self, projId, pointNameList, pointValueList):
        rt = {'state': 0}
        try:
            dbname = app.config.get('DATABASE_BUFFER')
            constMaxRowsPerOperation = 5000
            length = len(pointNameList) if pointNameList else 0
            tableName = None
            if length > 0:
                block = length//constMaxRowsPerOperation
                for count in range(block+1):
                    pointList = []
                    valueList = []
                    for index in range(count*constMaxRowsPerOperation,(count+1)*constMaxRowsPerOperation):
                        if index >= length:
                            break
                        pointList.append(pointNameList[index])
                        valueList.append(pointValueList[index])

                    self.createTableBufferRTTableIfNotExist(projId)
                    tableName = "rtdata_%s" % (projId,)

                    params=[]
                    if tableName:
                        strsql = 'replace into %s'%tableName + '(time, pointname, pointvalue, flag) values'
                        for index, pointname in enumerate(pointList):
                            strsql += '(now(), %s, %s, %s),'
                            params.extend([pointname, str(valueList[index]), 0])
                        strsql = strsql[:-1]
                        if params:
                            bSuccess = self._mysqlDBContainer.op_db_update(dbname, strsql, tuple(params))
                            if bSuccess:
                                rt.update({'state': 1})
                            else:
                                logging.error('updateSiteDataInBufferMul:sql=%s execute failed', strsql)
                                rt.update({'state': 403, 'message': 'manipulating database failed'})
                logging.debug('updateSiteDataInBufferMul update table %s, length=%s', tableName, length)
        except Exception:
            logging.error('Failed to update site data in buffer with projId=%s, pointNameList=%s, pointValueList=%s',
                          projId, pointNameList, pointValueList, exc_info=True, stack_info=True)
        return rt

    def update_thirdparty_pool_by_projid(self, projId, pointNameList, pointValueList):
        rt = {'state': 0}
        try:
            dbname = app.config.get('DATABASE_BUFFER')
            constMaxRowsPerOperation = 5000
            length = len(pointNameList) if pointNameList else 0
            tableName = None
            if length > 0:
                block = length//constMaxRowsPerOperation
                for count in range(block+1):
                    pointList = []
                    valueList = []
                    for index in range(count*constMaxRowsPerOperation,(count+1)*constMaxRowsPerOperation):
                        if index >= length:
                            break
                        pointList.append(pointNameList[index])
                        valueList.append(pointValueList[index])

                    self.createTableThirdpartyIfNotExist(projId)
                    tableName = "rtdata_%s_thirdparty" % (projId,)

                    params = []
                    if tableName:
                        strsql = 'replace into %s'%tableName + '(time, pointname, pointvalue, flag) values'
                        for index, pointname in enumerate(pointList):
                            strsql += '(now(), %s, %s, %s),'
                            params.extend([pointname, str(valueList[index]), 1])
                        strsql = strsql[:-1]
                        if params:
                            bSuccess = self._mysqlDBContainer.op_db_update(dbname, strsql, tuple(params))
                            if bSuccess:
                                rt.update({'state': 1})
                            else:
                                logging.error('update_thirdparty_pool_by_projid:sql=%s execute failed', strsql)
                                rt.update({'state': 403, 'message':'manipulating database failed'})
                logging.debug('update table %s, length=%s', tableName, length)
        except Exception:
            logging.error('Failed to update thirdparty pool by projid with '
                          'projId=%s, pointNameList=%s, pointValueList=%s',
                          projId, pointNameList, pointValueList, exc_info=True, stack_info=True)
        return rt

    def updateRealtimeDataBufferMultiple_by_projid(self, projId, pointNameList, pointValueList, pointTimeList, pointTypeFlag):
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
                                app.logger.writeLog(
                                    'updateRealtimeDataBufferMultiple_by_projid:sql=%s execute failed' % (strsql,), True)
                                rt.update({'state': 403, 'message': 'manipulating database failed'})

        except Exception as e:

            app.logger.writeLog('updateRealtimeDataBufferMultiple_by_projid error:' + e.__str__(), True)
        return rt

    def updateRealtimeDataBufferMul_by_projid(self, projId, pointNameList, pointValueList ,pointTypeFlag):
        rt = {'state': 0}
        try:
            dbname = app.config.get('DATABASE_BUFFER')
            constMaxRowsPerOperation = 5000
            length = len(pointNameList) if pointNameList else 0
            tableName = None
            if length > 0:
                block = length//constMaxRowsPerOperation
                for count in range(block+1):
                    pointList = []
                    valueList = []
                    for index in range(count*constMaxRowsPerOperation,(count+1)*constMaxRowsPerOperation):
                        if index >= length:
                            break
                        pointList.append(pointNameList[index])
                        valueList.append(pointValueList[index])
                    if pointTypeFlag == 1:
                        self.createTableBufferRTTableVPointIfNotExist(projId)
                        tableName = "rtdata_%s_vpoint" % (projId,)
                    elif pointTypeFlag == 2:
                        self.createTableBufferRTTableIfNotExist(projId)
                        tableName = "rtdata_%s" % (projId,)
                    elif pointTypeFlag == 0:
                        dbname = app.config.get('DATABASE')
                        mysqlname = self.getMysqlNameById(projId)
                        if mysqlname:
                            tableName = 'rtdata_' + mysqlname
                            self.createRTTableIfNotExist(tableName)
                    params = []
                    if tableName:
                        strsql = 'replace into %s' % tableName + '(time, pointname, pointvalue, flag) values'
                        for index, pointname in enumerate(pointList):
                            strsql += '(now(), %s, %s, %s),'
                            params.extend([pointname, str(valueList[index]), pointTypeFlag])
                        strsql = strsql[:-1]
                        if params:
                            bSuccess = self._mysqlDBContainer.op_db_update(dbname, strsql, tuple(params))
                            if bSuccess:
                                rt.update({'state': 1})
                            else:
                                logging.error('updateRealtimeDataBufferMul_by_projid:sql=%s execute failed', strsql)
                                rt.update({'state':403, 'message': 'manipulating database failed'})
                logging.debug('update table %s, length=%s', tableName, length)
        except Exception:
            logging.error('Failed to update realtime data buffer by projid with '
                          'projId=%s, pointNameList=%s, pointValueList=%s, pointTypeFlag=%s',
                          projId, pointNameList, pointValueList, pointTypeFlag, exc_info=True, stack_info=True)
        return rt

    def getProjectLocateMap(self):
        projectLocateMap = {}
        try:
            if isinstance(app.config['Condition'], str) or not MongoConnManager.isLocalEnv():
                projectLocateMap = RedisManager.get_project_locate_map()
            if (not projectLocateMap) and (not MongoConnManager.isLocalEnv()):
                print('getProjectLocateMap:projectLocateMap is None for non_local!!!')
                app.logger.error('getProjectLocateMap:projectLocateMap is non_local!!!')
        except Exception as e:
            print('getProjectLocateMap failed:'+e.__str__())
            app.logger.error('getProjectLocateMap failed:'+e.__str__())
        return projectLocateMap

    def addPointIntoRTDataTable(self, projId, pointNameList, pointValueList):
        rt = []
        try:
            rtTableName = self.getProjMysqldb(projId)
            dbname = app.config['DATABASE']
            flagType = 1 #algorithm
            if len(pointNameList) == len(pointValueList):
                for index in range(len(pointNameList)):
                    if not (isinstance(pointNameList[index],str)):
                        rt.append(pointNameList[index])
                    tableName = 'rtdata_' + rtTableName
                    self.createRTTableIfNotExist(tableName)
                    q =  "insert into %s " % tableName + "(time, pointname,pointvalue,flag) values(now(), '%s', '%s',%d)"%(pointNameList[index], pointValueList[index], flagType)
                    bSuccess = self._mysqlDBContainer.op_db_update(dbname, q,  ())
                    if not bSuccess:
                        logging.error('Failed to add point into RT table. SQL=%s', q, stack_info=True)
                        rt.append(pointNameList[index])
            else:
                rt = pointNameList
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def copy_realtimedata_between_project(self, projIdCopyFrom, projIdCopyTo):
        rt = []
        try:
            rtTableNameFrom = self.getProjMysqldb(projIdCopyFrom)
            rtTableNameTo = self.getProjMysqldb(projIdCopyTo)
            dbname = app.config['DATABASE']
            dbnameBuffer = app.config['DATABASE_BUFFER']

            self.createRTTableIfNotExist('rtdata_'+rtTableNameTo)

            qDel= "delete from %s.rtdata_%s"%(app.config['DATABASE'], rtTableNameTo)
            qSet = "ALTER TABLE %s.rtdata_%s MODIFY pointvalue LONGTEXT" % (app.config['DATABASE'], rtTableNameTo)
            qIns =  "replace into %s.rtdata_%s " % (app.config['DATABASE'], rtTableNameTo) + "(time,pointname,pointvalue,flag) select time,pointname,pointvalue,flag from %s.rtdata_%d"%(dbnameBuffer, int(projIdCopyFrom))
            qUpdateFlag = "update %s.rtdata_%s set flag=0" % (app.config['DATABASE'], rtTableNameTo)
            bSuccess = self._mysqlDBContainer.op_db_update_by_transaction(dbname, [qDel, qSet, qIns, qUpdateFlag])

            qInsVpoint =  "replace into %s.rtdata_%s " % (app.config['DATABASE'], rtTableNameTo) + "(time,pointname,pointvalue,flag) select time,pointname,pointvalue,flag from %s.rtdata_%d_vpoint"%(dbnameBuffer, int(projIdCopyFrom))
            bSuccess2 = self._mysqlDBContainer.op_db_update_by_transaction(dbname, [qInsVpoint, qUpdateFlag])

            if not bSuccess or not bSuccess2:
                print('copy_realtimedata_between_project:sqlList=["%s","%s"] execute failed'%(qDel, qIns))
                app.logger.error('copy_realtimedata_between_project:sqlList=["%s","%s"] execute failed'%(qDel, qIns))
                rt = dict(info='Fail')
            else:
                rt = dict(info='Success')
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def getSVRPointValueList(self, projId, timeObject):
        insertDataList = []
        try:
            mongo_config_conn = MongoConnManager.getConfigConn()
            no_his_data_points = mongo_config_conn.getVpointsForProjByHisDataModes(projId, [
                VpointsHistoryDataMode.on_set, VpointsHistoryDataMode.no_save])

            tableName = "rtdata_%s_vpoint" % (projId,)
            self.createTableBufferRTTableVPointIfNotExist(projId)
            sql = "select time, pointname, pointvalue from %s" % (tableName,)
            rvQuery = self._mysqlDBContainerReadOnly.op_db_query(app.config.get('DATABASE_BUFFER'), sql)

            if rvQuery is not None and len(rvQuery) > 0:
                for i in range(len(rvQuery)):
                    point_name = rvQuery[i][1]
                    if point_name in no_his_data_points:
                        logging.debug('%s is not saved for history data!', point_name)
                    else:
                        insertDataList.append((timeObject, point_name, rvQuery[i][2]))
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return insertDataList

    def getFlag2PointValueList(self, strMysqlTableName, timeObject, pointList):
        insertDataList = []
        try:
            tableName = 'rtdata_'+ strMysqlTableName
            self.createRTTableIfNotExist(tableName)
            sql = "select time,pointname,pointvalue from %s where flag=2 and pointname in (%s)" % (tableName,str(pointList).replace('[','').replace(']',''))
            rvQuery = self._mysqlDBContainerReadOnly.op_db_query('beopdoengine', sql)
            if rvQuery != None:
                if len(rvQuery) > 0:
                    for i in range(len(rvQuery)):
                        insertDataList.append((timeObject, rvQuery[i][1], rvQuery[i][2]))
        except Exception as e:
            print('getFlag2PointValueList failed:'+e.__str__())
            app.logger.error('getFlag2PointValueList failed:'+e.__str__())
        return insertDataList


    def get_hisdata_pv_list(self, strMysqlTableName, timeObject, pointList):
        insertDataList = []
        try:
            sql = "select time,pointname,pointvalue from %s where time='%s' pointname in (%s)" % (strMysqlTableName,timeObject,str(pointList).replace('[','').replace(']',''))
            rvQuery = self._mysqlDBContainerReadOnly.op_db_query(app.config().get('DATABASE_BUFFER'), sql)
            if rvQuery != None:
                if len(rvQuery) > 0:
                    for i in range(len(rvQuery)):
                        insertDataList.append((timeObject, rvQuery[i][1], rvQuery[i][2]))
        except Exception as e:
            print('getFlag2PointValueList failed:'+e.__str__())
            app.logger.error('getFlag2PointValueList failed:'+e.__str__())
        return insertDataList

    def get_history_data_padded_reduce(self, projectId,  pointList, strTimeStart, strTimeEnd, strTimeFormat, bSearchNearest=False, collectionName=None):
        result = []
        # invalid query filter:
        now_time = datetime.now()
        try:
            if strTimeStart is None or strTimeEnd is None or strTimeFormat is None:
                print('get_history_data_padded_reduce:invalid params')
                logging.info('get_history_data_padded_reduce:invalid params')
                return {'error': 'historyData', 'msg': 'one of query condition is None'}

            startTime = None
            endTime = None
            try:
                startTime = datetime.strptime(strTimeStart,'%Y-%m-%d %H:%M:%S')
                endTime = datetime.strptime(strTimeEnd,'%Y-%m-%d %H:%M:%S')
            except:
                print('get_history_data_padded_reduce:invalid time string')
                logging('get_history_data_padded_reduce:invalid time string')
                return {'error': 'historyData', 'msg': 'invalid time string'}

            if startTime >endTime:
                print('error params get_history_data_padded_reduce:[startTime:%s],[endTime:%s],[timeFormat:%s],[projectId:%d],[pointList:%s]'%(strTimeStart,strTimeEnd,strTimeFormat,int(projectId)),str(pointList))
                app.logger.error('error params get_history_data_padded_reduce:[startTime:%s],[endTime:%s],[timeFormat:%s],[projectId:%d],[pointList:%s]'%(strTimeStart,strTimeEnd,strTimeFormat,int(projectId)),str(pointList))
                return {'error': 'historyData', 'msg': 'startTime > endTime'}
            if endTime > now_time:
                endTime = now_time
            if strTimeFormat == 'm1':
                if (endTime-startTime).days >7:
                    print('get_history_data_padded_reduce error: time range too long for m1 period data query')
                    logging.info('get_history_data_padded_reduce error: time range too long for m1 period data query')
                    return {'error': 'historyData', 'msg': 'time range is 7 days for m1'}
            elif strTimeFormat == 'm5':
                if (endTime-startTime).days >30:
                    print('get_history_data_padded_reduce error: time range too long for m5 period data query :' + strTimeStart + strTimeEnd)
                    logging.info('get_history_data_padded_reduce error: time range too long for m5 period data query :' + strTimeStart + strTimeEnd)
                    return {'error': 'historyData', 'msg': 'time range is 30 days for m5'}
            elif strTimeFormat == 'h1':
                if (endTime-startTime).days >60:
                    print('get_history_data_padded_reduce error: time range too long for h1 period data query ')
                    logging.info('get_history_data_padded_reduce error: time range too long for h1 period data query ')
                    return {'error': 'historyData', 'msg': 'time range is 60 days for h1'}
            elif strTimeFormat == 'd1':
                if (endTime-startTime).days >365:
                    print('get_history_data_padded_reduce error: time range too long for d1 period data query ')
                    logging.info('get_history_data_padded_reduce error: time range too long for d1 period data query ')
                    return {'error': 'historyData', 'msg': 'time range is 365 days for d1'}
            elif strTimeFormat == 'M1':
                pass
            else:
                print('get_history_data_padded_reduce error: time period format not supported')
                logging.info('get_history_data_padded_reduce error: time period format not supported')
                return {'error': 'historyData', 'msg': 'time period format not supported'}

            rv = self.getHistoryData(projectId, pointList, strTimeStart, strTimeEnd, strTimeFormat, bSearchNearest)
            if len(rv)==0:
                print('get_history_data_padded_reduce:no history data')
                logging.info('get_history_data_padded_reduce:no history data')
                return {'error': 'historyData', 'msg': 'no history data'}
            #mango added to prevent exception
            if type(rv) == type('123'):
                print('get_history_data_padded_reduce:no history data')
                logging.info('get_history_data_padded_reduce:no history data')
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
            result = {'timeStamp':listTime, 'data':data}
        except Exception as e:
            print('get_history_data_padded_reduce failed:'+e.__str__())
            app.logger.error('get_history_data_padded_reduce failed:'+e.__str__())
        return result

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
                                    temp.append(dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S'), value=vv[x], error=ev[x]))
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
                                    temp.append(dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S'), value=vv[x], error=ev[x]))
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
                                    temp.append(dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S'), value=vv[x], error=ev[x]))
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
                                    temp.append(dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S'), value=vv[x], error=ev[x]))
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
                                    temp.append(dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S'), value=vv[x], error=ev[x]))
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
                                    temp.append(dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S'), value=vv[x], error=ev[x]))
                                rv.append(dict(name=data[index].get('pointname'), record=temp))
                else:
                    for item in data:
                        temp = []
                        if len(item.get('record')) == 1:
                            temp.append(
                                    dict(time=item.get('record')[0].get('time'), value=str(item.get('record')[0].get('value')),
                                         error=False))
                        else:
                            temp.append(dict(time=timeStart, value=str(0), error=True))
                        rv.append(dict(name=item.get('pointname'), record=temp))
        return rv

    def padDataFloat(self, data, timeStart, timeEnd, timeFormat):
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
                                            except Exception:
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
                                    temp.append(dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S'), value=vv[x], error=ev[x]))
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
                                            except Exception:
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
                                    temp.append(dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S'), value=vv[x], error=ev[x]))
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
                                                vv[sTemp] =  float(i.get('value'))
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
                                    temp.append(dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S'), value=vv[x], error=ev[x]))
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
                                    temp.append(dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S'), value=vv[x], error=ev[x]))
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
                                    temp.append(dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S'), value=vv[x], error=ev[x]))
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
                                    temp.append(dict(time=tv[x].strftime('%Y-%m-%d %H:%M:%S'), value=vv[x], error=ev[x]))
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

    def getAllDtuIsOffline(self, projId, startTimeStr, endTimeStr):
        rt = []
        try:
            endTime = datetime.strptime(endTimeStr, '%Y-%m-%d %H:%M:%S')
            if projId == 376:
                AMonthBefore = endTime + timedelta(days=-200)
            else:
                AMonthBefore = endTime + timedelta(days=-30)
            AMonthBeforeStr = datetime.strftime(AMonthBefore, '%Y-%m-%d %H:%M:%S')
            dbname = app.config.get('DATABASE')
            dtuList = self.getProjDTUList([projId])
            sql = 'select `time`, dtuname, state from dtuserver_on_offline '\
                  'where dtuname in %s and `time` between "%s" and "%s" '\
                  'order by dtuname ASC, `time` ASC' % (str(dtuList).replace('[', '(').replace(']', ')'), AMonthBeforeStr, endTimeStr)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, ())
            dtuname = None
            lastOfflineTimeStr = None
            lastTimeStr = None
            for item in dbrv:
                if dtuname and dtuname != item[1] and lastTimeStr:
                    if not lastOfflineTimeStr:
                        lastOfflineTimeStr = lastTimeStr
                    else:
                        lastTime = datetime.strptime(lastTimeStr, '%Y-%m-%d %H:%M:%S')
                        lastOfflineTime = datetime.strptime(lastOfflineTimeStr, '%Y-%m-%d %H:%M:%S')
                        if lastTime > lastOfflineTime:
                            lastOfflineTimeStr = lastTimeStr
                dtuname = item[1]
                if item[2]:
                    lastTimeStr = None
                else:
                    lastTimeStr = item[0]
            if lastTimeStr:
                lastOfflineTimeStr = lastTimeStr
            if not lastOfflineTimeStr:
                return False
            else:
                startTime = datetime.strptime(startTimeStr, '%Y-%m-%d %H:%M:%S')
                lastOfflineTime = datetime.strptime(lastOfflineTimeStr, '%Y-%m-%d %H:%M:%S')
                if lastOfflineTime > startTime:
                    return False
                else:
                    return True
        except Exception as e:
            print('getAllDtuIsOffline failed' + e.__str__())
            app.logger.error('getAllDtuIsOffline failed:' + e.__str__())
        return rt

    def getProjDTUList(self, projIdList):
        dbname = app.config.get('DATABASE')
        rt = []
        try:
            if projIdList:
                strIdAll = ''
                for proj in projIdList:
                    strIdAll += str(proj)
                    strIdAll +=','

                strIdAll = strIdAll[:-1]
                q = 'select dtuname from dtuserver_prj where dbname in (select mysqlname from project where id in (%s))'% strIdAll
                dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, ())
                if dbrv is not None:
                    for item in dbrv:
                        rt.append(item[0])
                else:
                    print('getProjDTUList:sql=%s return none'%(q,))
                    logging.info('getProjDTUList:sql=%s return none'%(q,))
            else:
                print('getProjDTUList:projIdList is none or []')
                logging.info('getProjDTUList:projIdList is none or []')
        except Exception as e:
            print('getProjDTUList failed:'+e.__str__())
            app.logger.error('getProjDTUList failed:'+e.__str__())
        return rt

    def getSaveSvrProjIdList(self):
        dbname = app.config.get('DATABASE')
        rt = []
        try:
            sql = 'select p.id, name_cn, mysqlname, collectionname, SaveSvrHistory from project as p ' + \
                  'left join project_cluster as pc on p.id = pc.project_id ' + \
                  'left join cluster_config as cc on pc.cluster_config_id = cc.id ' + \
                  'where cc.clusterName = \'%s\'' % app.config.get('BEOPCLUSTER')
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, ())
            if dbrv is not None:
                for item in dbrv:
                    projId = item[0]
                    if BEOPDataAccess.is_belong_to_local_cluster(projId):
                        rt.append({'id': projId,
                                   'name_cn': item[1],
                                   'mysqlname': item[2],
                                   'collectionname': item[3],
                                   'SaveSvrHistory': item[4]})
            if not rt:
                logging.error('getSaveSvrProjIdList:sql=%s return none', sql)
        except Exception:
            logging.error('Failed to getSaveSvrProjIdList!', exc_info=True, stack_info=True)
        return rt

    def setSaveSvrById(self, projId):
        rt = False
        try:
            dbname = app.config.get('DATABASE')
            sql = "update project set SaveSvrHistory=1 where id=%s"%(projId,)
            rt = self._mysqlDBContainer.op_db_update(dbname, sql, ())
            if not rt:
                print('setSaveSvrById:sql=%s failed'%(sql,))
                logging.info('setSaveSvrById:sql=%s failed'%(sql,))
        except Exception as e:
            print('setSaveSvrById:'+e.__str__())
            logging.info('setSaveSvrById:'+e.__str__())
        return rt

    def getOutputToSiteTable(self, needInDtuNameList):
        #print('appendOutputTable')
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
                    if nCurProjId !=nLastProjId:
                        dtuInfoList = self.getDTUNameListByProjId(nCurProjId)
                        dtuNameList =  dtuInfoList['dtuNameList']
                        dtuTypeList = dtuInfoList['dtuComTypeList']
                        writeDataListOneItem = dict(dtuName = dtuNameList,pointNameList=[], pointValueList=[], dtuType=dtuTypeList)
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
                        if i==j:
                            bInNeed = True
                            break
                if bInNeed:
                    needWriteDataList.append(item)
        except Exception as e:
            print('getOutputToSiteTable:'+e.__str__())
            app.logger.error('getOutputToSiteTable:'+e.__str__())
        return needWriteDataList

    def getProjIdByDTUName(self, strDTUName):
        dbname = app.config.get('DATABASE')
        rt = -1
        try:
            q = 'select projectid from dtusert_to_project where dtuprojectid in (select id from dtuserver_prj where dtuname = "%s")'% (strDTUName,)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, ())
            if dbrv:
                for item in dbrv:
                    rt = int(item[0])
            else:
                print('getProjIdByDTUName:sql=%s return none'%(q,))
                logging.info('getProjIdByDTUName:sql=%s return none'%(q,))
        except Exception as e:
            print('getProjIdByDTUName failed:'+e.__str__())
            app.logger.error('getProjIdByDTUName failed:'+e.__str__())
        return rt

    def getMysqlNameById(self, nProjId):
        name = ''
        try:
            projList = RedisManager.get_project_info_list()
            if projList:
                for item in projList:
                    if item.get('id') == int(nProjId):
                        name = item.get('mysqlname')
                        break
            else:
                print('getMysqlNameById:projectInfoList is not in memcache')
                logging.info('getMysqlNameById:projectInfoList is not in memcache')
        except Exception as e:
            print('getMysqlNameById failed:'+e.__str__())
            app.logger.error('getMysqlNameById failed:'+e.__str__())
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
                print('getDTUNameListByMysqlName:dtuserverList is not in memcahce')
                logging.info('getDTUNameListByMysqlName:dtuserverList is not in memcahce')
        except Exception as e:
            print('getDTUNameListByMysqlName failed:'+e.__str__())
            app.logger.error('getDTUNameListByMysqlName failed:'+e.__str__())
        return rtName, rtBDTUProject

    def getDTUNameListByProjId(self, nProjId):
        dtuNameList = []
        dtuComTypeList = []
        try:
            mysqlname = self.getMysqlNameById(nProjId)
            if mysqlname:
                dtuNameList, dtuComTypeList = self.getDTUNameListByMysqlName(mysqlname)
        except Exception as e:
            print('getDTUNameListByProjId failed:'+e.__str__())
            app.logger.error('getDTUNameListByProjId failed:'+e.__str__())
        return dict(dtuNameList = dtuNameList, dtuComTypeList =dtuComTypeList)

    def deleteOutputToSiteTable(self, writeDataList):
        bSuccess = False
        try:
            for item in writeDataList:
                dtuName = item['dtuName']
                pointNameList = item['pointNameList']
                nProjId = self.getProjIdByDTUName(dtuName)

                sql = 'delete from `realtimedata_output_to_site` where projectid = %d '%nProjId  + ' and pointname IN ('
                for ptName in pointNameList:
                    sql += "'" + ptName + "',"
                sql = sql[:-1]
                sql += ")"
            bSuccess = self._mysqlDBContainer.op_db_update(app.config['DATABASE'], sql, ())
            if not bSuccess:
                print('deleteOutputToSiteTable:sql=%s execute failed'%(sql,))
                logging.info('deleteOutputToSiteTable:sql=%s execute failed'%(sql,))
        except Exception as e:
            print('deleteOutputToSiteTable failed:'+e.__str__())
            app.logger.error('deleteOutputToSiteTable failed:'+e.__str__())
        return bSuccess

    def saveWarningRecord(self, dtuName, warningList):
        bSuccess = False
        try:
            mysqlname = self.get_dbname_by_dtuname(dtuName)
            if mysqlname:
                strWarningTableName = 'warningrd_'+ mysqlname
                self.createWarningrdTableIfNotExist(strWarningTableName)
                for warningItem in warningList:
                    strInfo = warningItem['strInfo']
                    nConfirmed = warningItem['nConfirmed']
                    nLevel = warningItem['nLevel']
                    strHappenTime = warningItem['strHappenTime']
                    strPointName = warningItem['strPointName']
                    strTime = warningItem['strTime']
                    strConfirmedUser = warningItem['strConfirmedUser']

                    #先删除
                    strSQL = 'delete from %s'% strWarningTableName +' where info="%s"'%strInfo + ' and time= "%s"'%strHappenTime
                    bSuccess = self._mysqlDBContainer.op_db_update(app.config['DATABASE'], strSQL, ())
                    if not bSuccess:
                        print('saveWarningRecord:sql=%s execute failed'%(strSQL,))
                        logging.info('saveWarningRecord:sql=%s execute failed'%(strSQL,))
                    #再插入
                    strSQL = 'insert into %s'%strWarningTableName + ' value("%s",0, "%s",%d,"%s", %d,"%s", "%s")'%(strHappenTime,strInfo,nLevel,strTime,nConfirmed, strConfirmedUser, strPointName)
                    bSuccess = self._mysqlDBContainer.op_db_update(app.config['DATABASE'], strSQL, ())
                    if not bSuccess:
                        print('saveWarningRecord:sql=%s execute failed'%(strSQL,))
                        logging.info('saveWarningRecord:sql=%s execute failed'%(strSQL,))
        except Exception as e:
            print('saveWarningRecord failed:'+e.__str__())
            app.logger.error('saveWarningRecord failed:'+e.__str__())
        return bSuccess

    def saveConfigList(self, dtuName, configList):
        bSuccess = False
        try:
            mysqlname = self.get_dbname_by_dtuname(dtuName)
            if mysqlname:
                strConfigTableName = 'config_'+ mysqlname
                self.createConfigTableIfNotExist(strConfigTableName)
                strSQL = 'replace into %s'% strConfigTableName +  '(paramname, paramvalue) values'
                for configItem in configList:
                    strParam = configItem['strparamname']
                    strValue = configItem['strparamvalue']
                    strSQL += '("%s", "%s"),'%(strParam, strValue)
                strSQL = strSQL[:-1]
                bSuccess = self._mysqlDBContainer.op_db_update(app.config['DATABASE'], strSQL, ())
                if not bSuccess:
                    print('saveConfigList:sql=%s execute failed'%(strSQL,))
                    logging.info('saveConfigList:sql=%s execute failed'%(strSQL,))
        except Exception as e:
            print('saveConfigList failed:'+e.__str__())
            app.logger.error('saveConfigList failed:'+e.__str__())
        return bSuccess

    def saveOperationList(self, dtuName, operationList):
        bSuccess = False
        try:
            mysqlname = self.get_dbname_by_dtuname(dtuName)
            if mysqlname:
                strOPrecordTableName = 'oprecord_'+ mysqlname
                self.createOprecordTableIfNotExist(strOPrecordTableName)
                for configItem in operationList:
                    strTime = configItem['strTime']
                    strUser = configItem['strUser']
                    strOperation = configItem['strOperation']
                    strSQL = 'insert into %s'% strOPrecordTableName +  ' value("%s", "%s", "%s") '%(strTime, strUser, strOperation)
                    bSuccess = self._mysqlDBContainer.op_db_update(app.config['DATABASE'], strSQL, ())
                    if not bSuccess:
                        print('saveOperationList:sql=%s execute failed'%(strSQL,))
                        logging.info('saveOperationList:sql=%s execute failed'%(strSQL,))
            else:
                print('saveOperationList:get_dbname_by_dtuname return ""')
                logging.info('saveOperationList:get_dbname_by_dtuname return ""')
        except Exception as e:
            print('saveOperationList failed:'+e.__str__())
            app.logger.error('saveOperationList failed:'+e.__str__())
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
                    sql = 'insert into dtuserver_prj(dtuname, dbname) values("%s", "%s")'%(dtuname, 'beopdata_'+dtuname)
                    rt = 'beopdata_'+dtuname
                    if self._mysqlDBContainer.op_db_update(confdb, sql, ()):
                        sql_query = "select id from dtuserver_prj where dtuname='%s'"%(dtuname,)
                        ret = self._mysqlDBContainer.op_db_query(confdb, sql_query, ())
                        if ret:
                            insert_id = ret[0][0]
                            prjList.append({'id':insert_id, 'dtuname':dtuname, 'dbname':rt})
                            RedisManager.set_dtuserver_list( prjList)
            else:
                print('get_dbname_by_dtuname:dtuserverList is not in memcache')
                logging.info('get_dbname_by_dtuname:dtuserverList is not in memcache')
        except Exception as e:
            print('get_dbname_by_dtuname failed:'+e.__str__())
            app.logger.error('get_dbname_by_dtuname failed:'+e.__str__())
        return rt

    def getTableListInMemcache(self):
        tableList = RedisManager.get_table_list()
        if not tableList:
            allNames = self.getAllMysqlTableNames()
            if allNames:
                RedisManager.set_table_list(allNames)
                tableList = RedisManager.get_table_list()
        return tableList

    def createRTTableIfNotExist(self, rtTableName):
        result = True
        tableList = self.getTableListInMemcache()
        if tableList:
                confdb = app.config.get('DATABASE')
                try:
                    if isinstance(rtTableName, str):
                        if len(rtTableName) > 0:
                            sql = ''
                            if rtTableName.lower() not in tableList:
                                sql = "CREATE TABLE IF NOT EXISTS %s (`time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP " \
                                      "ON UPDATE CURRENT_TIMESTAMP,pointname varchar(128) NOT NULL DEFAULT '', pointvalue TEXT," \
                                      "flag int(11) DEFAULT NULL, dtuname varchar(256) NOT NULL DEFAULT '', " \
                                      "PRIMARY KEY (pointname)) ENGINE=InnoDB DEFAULT CHARSET=utf8;" % (rtTableName,)
                                result = self._mysqlDBContainer.op_db_update(confdb, sql, ())
                                if result:
                                    print('auto create table %s' % (rtTableName,))
                                    logging.info('auto create table %s' % (rtTableName,))
                                tableList.append(rtTableName)
                                RedisManager.set_table_list(tableList)
                            else:
                                fields = self.getTableFields(rtTableName)
                                if 'dtuname' not in fields:
                                    sql = "alter table %s add dtuname varchar(256) NOT NULL DEFAULT ''"%(rtTableName,)
                                if len(sql) > 0:
                                    result = self._mysqlDBContainer.op_db_update(confdb, sql, ())
                except Exception as e:
                    result = False
                    print('createRTTableIfNotExist failed:'+e.__str__())
                    app.logger.error('createRTTableIfNotExist failed:'+e.__str__())
        return result

    def getTableFields(self, rtTableName):
        rt = []
        confdb = app.config.get('DATABASE')
        try:
            sql = "select COLUMN_NAME from information_schema.COLUMNS where table_name = '%s';"%(rtTableName,)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(confdb, sql, ())
            for item in dbrv:
                rt.append(item[0])
        except Exception as e:
            print(e)
        return rt

    def createWarningrdTableIfNotExist(self, WarningrdTableName):
        result = True
        tableList = self.getTableListInMemcache()
        if tableList:
            if WarningrdTableName.lower() not in tableList:
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
                                print('auto create table %s'%(WarningrdTableName,))
                                logging.info('auto create table %s'%(WarningrdTableName,))
                                tableList.append(WarningrdTableName)
                                RedisManager.set_table_list( tableList)
                except Exception as e:
                    result = False
                    print('createWarningrdTableIfNotExist failed:'+e.__str__())
                    app.logger.error('createWarningrdTableIfNotExist failed:'+e.__str__())
        return result

    def createConfigTableIfNotExist(self, ConfigTableName):
        result = True
        tableList = self.getTableListInMemcache()
        if tableList:
            if ConfigTableName.lower() not in tableList:
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
                                print('auto create table %s'%(ConfigTableName,))
                                logging.info('auto create table %s'%(ConfigTableName,))
                                tableList.append(ConfigTableName)
                                RedisManager.set_table_list( tableList)
                except Exception as e:
                    result = False
                    print('createConfigTableIfNotExist failed:'+e.__str__())
                    app.logger.error('createConfigTableIfNotExist failed:'+e.__str__())
        return result

    def createOprecordTableIfNotExist(self, OprecordTableName):
        result = True
        tableList = self.getTableListInMemcache()
        if tableList:
            if OprecordTableName.lower() not in tableList:
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
                                print('auto create table %s'%(OprecordTableName,))
                                logging.info('auto create table %s'%(OprecordTableName,))
                                tableList.append(OprecordTableName)
                                RedisManager.set_table_list( tableList)
                except Exception as e:
                    result = False
                    print('createOprecordTable failed:'+e.__str__())
                    app.logger.error('createOprecordTable failed:'+e.__str__())
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
                        strSQL += "'"+data.get(key)+"'"
                    else:
                        strSQL += str(data.get(key))
                    if index != len(data)-1:
                        strSQL += ","
                strSQL += " where id="+str(data.get('id'))
                rt = self._mysqlDBContainer.op_db_update(confdb, strSQL, ())
                if rt:
                    dtuserverInfoList = RedisManager.get_dtuserver_info_list()
                    if dtuserverInfoList:
                        for item in dtuserverInfoList:
                            if item.get('id') == data.get('id'):
                                item.update(**data)
                                RedisManager.set_dtuserver_sinfo_list(dtuserverInfoList)
                                break
            else:
                rt = False
        except Exception as e:
            rt = False
            print('updateDTUProjectInfo failed:'+e.__str__())
            app.logger.error('updateDTUProjectInfo failed:'+e.__str__())
        return rt

    def updateDTUProjectInfoById(self, data):
        confdb = app.config.get('DATABASE')
        rt = True
        try:
            strSQL = "update dtuserver_prj_info set LastOnlineTime='%s',online='%s' where id=%s"%(str(data['LastOnlineTime'])
                                                                                                  ,str(data['online']),str(data['id']),)
            rt = self._mysqlDBContainer.op_db_update(confdb, strSQL, ())
        except Exception as e:
            rt = False
            print('updateDTUProjectInfoById failed:'+e.__str__())
            app.logger.error('updateDTUProjectInfoById failed:'+e.__str__())
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
                        strSQL += "'"+data.get(key)+"'"
                    else:
                        strSQL += str(data.get(key))
                    if index != len(data)-1:
                        strSQL += ","
                strSQL += " where id="+str(data.get('id'))
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
            print('updateDTUProject failed:'+e.__str__())
            app.logger.error('updateDTUProject failed:'+e.__str__())
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
                    rt.append({'id':item[0],'online':item[1],'dberr':item[2],'LostCount':item[3],'LostMinute':item[4],
                               'UnReceiveMinute':item[5],'ReceivePointCount':item[6],'LostPackageCount':item[7],
                               'StartTime':item[8],'LastOnlineTime':item[9],'LastReceivedTime':item[10],'FileRec':item[11],
                               'FileSend':item[12],'RecHistoryCount':item[13],'NeedHistroyCount':item[14],'remark':item[15]})
        except Exception as e:
            print('getDTUProjectInfoList failed:'+e.__str__())
            app.logger.error('getDTUProjectInfoList failed:'+e.__str__())
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
                    rt.append({'id':item[0],'dtuname':item[1],'dbip':item[2],'dbuser':item[3],'dbname':item[4],
                               'dbpsw':item[5],'dtuRemark':item[6],'bSendData':item[7],'nSendType':item[8],'nSendDataInterval':item[9],
                               'bSendEmail':item[10],'nLastSendHour':item[11],'nReSendType':item[12],'synRealTable':item[13],'bDTUProject':item[14]})
        except Exception as e:
            print('getDTUProjectList failed:'+e.__str__())
            app.logger.error('getDTUProjectList failed:'+e.__str__())
        return rt

    def removeDTUProjectInfo(self, id):
        confdb = app.config.get('DATABASE')
        rt = True
        try:
            sql = 'delete from dtuserver_prj_info where id=%d'%(id,)
            rt = self._mysqlDBContainer.op_db_update(confdb, sql, ())
            if rt:
                dtuserverInfoList = RedisManager.get_dtuserver_info_list()
                if dtuserverInfoList:
                    for index, item in enumerate(dtuserverInfoList):
                        if item.get('id') == id:
                            re = dtuserverInfoList.pop(index)
                            assert re == item
                            RedisManager.set_dtuserver_info_list(dtuserverInfoList)
                            break
            else:
                print('removeDTUProjectInfo:sql=%s execute failed'%(sql,))
                logging.info('removeDTUProjectInfo:sql=%s execute failed'%(sql,))
        except Exception as e:
            rt = False
            print('removeDTUProjectInfo failed:'+e.__str__())
            app.logger.error('removeDTUProjectInfo failed:'+e.__str__())
        return rt

    def removeDTUProject(self, id):
        confdb = app.config.get('DATABASE')
        rt = True
        try:
            sql = 'delete from dtuserver_prj where id=%d'%(id,)
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
                print('removeDTUProject:sql=%s execute failed'%(sql,))
                logging.info('removeDTUProject:sql=%s execute failed'%(sql,))
        except Exception as e:
            rt = False
            print('removeDTUProject failed:'+e.__str__())
            app.logger.error('removeDTUProject failed:'+e.__str__())
        return rt

    def insertDTUProjectInfo(self, data):
        confdb = app.config.get('DATABASE')
        rt = True
        try:
            strSQL = "insert into dtuserver_prj_info("
            if 'id' not in data:
                for index, key in enumerate(data):
                    strSQL += key
                    if index != len(data)-1:
                        strSQL += ","
                strSQL += ") values("
                for index, key in enumerate(data):
                    if isinstance(data.get(key), str):
                        strSQL += "'"+data.get(key)+"'"
                    else:
                        strSQL += str(data.get(key))
                    if index != len(data)-1:
                        strSQL += ","
                strSQL += ")"
                rt = self._mysqlDBContainer.op_db_update(confdb, strSQL, ())
                if rt:
                    dtuserverInfoList = RedisManager.get_dtuserver_info_list()
                    if dtuserverInfoList:
                        dtuserverInfoList.append(data)
                        RedisManager.set_dtuserver_info_list(dtuserverInfoList)
            else:
                print('insertDTUProjectInfo:id not in data')
                logging.info('insertDTUProjectInfo:id not in data')
                rt = False
        except Exception as e:
            rt = False
            print('insertDTUProjectInfo failed:'+e.__str__())
            app.logger.error('insertDTUProjectInfo failed:'+e.__str__())
        return rt

    def insertDTUProject(self, data):
        confdb = app.config.get('DATABASE')
        rt = True
        try:
            strSQL = "insert into dtuserver_prj("
            if 'id' not in data:
                for index, key in enumerate(data):
                    strSQL += key
                    if index != len(data)-1:
                        strSQL += ","
                strSQL += ") values("
                for index, key in enumerate(data):
                    if isinstance(data.get(key), str):
                        strSQL += "'"+data.get(key)+"'"
                    else:
                        strSQL += str(data.get(key))
                    if index != len(data)-1:
                        strSQL += ","
                strSQL += ")"
                rt = self._mysqlDBContainer.op_db_update(confdb, strSQL, ())
                if rt:
                    dtuserverList = RedisManager.get_dtuserver_list()
                    if dtuserverList:
                        dtuserverList.append(data)
                        RedisManager.set_dtuserver_list(dtuserverList)
            else:
                print('insertDTUProject:id not in data')
                logging.info('insertDTUProject:id not in data')
                rt = False
        except Exception as e:
            rt = False
            print('updateDTUProjectInfo failed:'+e.__str__())
            app.logger.error('updateDTUProjectInfo failed:'+e.__str__())
        return rt

    def multiUpdateDTUProjectInfo(self, data):
        #{'dtuname':['sh01','sh02',...],'field':['online', 'LastOnlineTime', 'LastReceivedTime'],'value':[['1','','3'],['4','5','6'],...]}
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
                            sql_insert += item+","
                        sql_insert = sql_insert[:-1]
                        sql_insert += ") values("+str(id)+","
                        sql_update = "update dtuserver_prj_info set "
                        for index_sub in range(len(fieldList)):
                            sql_insert += "'"+valueList[index][index_sub]+"'"+","
                            if valueList[index][index_sub]:
                                sql_update += fieldList[index_sub]+"="+"'"+valueList[index][index_sub]+"'"+","
                        sql_insert = sql_insert[:-1]
                        sql_insert += ")"
                        sql_update = sql_update[:-1]
                        sql_update += " where id=%d"%(id,)
                        sql_select = "select * from dtuserver_prj_info where id=%d"%(id,)
                        if not self._mysqlDBContainerReadOnly.op_db_query(confdb, sql_select):
                            rt = self._mysqlDBContainer.op_db_update(confdb, sql_insert, ())
                        else:
                            rt = self._mysqlDBContainer.op_db_update(confdb, sql_update, ())
        except Exception as e:
            rt = False
            print('multiUpdateDTUProjectInfo failed:'+e.__str__())
            app.logger.error('multiUpdateDTUProjectInfo failed:'+e.__str__())
        return rt

    def getIdByDUTNameInMemcache(self, name):
        try:
            dtuserverList = RedisManager.get_dtuserver_list()
            if dtuserverList:
                for item in dtuserverList:
                    if item.get('dtuname') == name:
                        return item.get('id')
        except Exception as e:
            print('getIdByDUTNameInMemcache failed:'+e.__str__())
            app.logger.error('getIdByDUTNameInMemcache failed:'+e.__str__())
        print('getIdByDUTNameInMemcache:return id=0, when dtuname=%s'%(name,))
        logging.info('getIdByDUTNameInMemcache:return id=0, when dtuname=%s'%(name,))
        return 0

    def createTableDiagnosisZonesIfNotExist(self, DiagnosisZonesTableName):
        result = True
        tableList = self.getTableListInMemcache()
        if tableList:
            if DiagnosisZonesTableName.lower() not in tableList:
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
                                print('auto create table %s'%(DiagnosisZonesTableName,))
                                logging.info('auto create table %s'%(DiagnosisZonesTableName,))
                                tableList.append(DiagnosisZonesTableName)
                                RedisManager.set_table_list( tableList)
                except Exception as e:
                    result = False
                    print('createTableDiagnosisZonesIfNotExist failed:'+e.__str__())
                    app.logger.error('createTableDiagnosisZonesIfNotExist failed:'+e.__str__())
        else:
            print('createTableDiagnosisZonesIfNotExist:tableList is not in memcache')
            logging.info('createTableDiagnosisZonesIfNotExist:tableList is not in memcache')
        return result

    def createTableDiagnosisZonesIfNotExistFactory(self, DiagnosisZonesTableName):
        result = True
        tableList = self.getTableListInMemcache()
        if tableList:
            if DiagnosisZonesTableName.lower() not in tableList:
                try:
                    if isinstance(DiagnosisZonesTableName, str):
                        if len(DiagnosisZonesTableName) > 0:
                            sql = "CREATE TABLE IF NOT EXISTS %s (\
                                  Id int(10) unsigned NOT NULL,\
                                  PageId varchar(45) DEFAULT NULL,\
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
                                print('auto create table %s'%(DiagnosisZonesTableName,))
                                logging.info('auto create table %s'%(DiagnosisZonesTableName,))
                                tableList.append(DiagnosisZonesTableName)
                                RedisManager.set_table_list( tableList)
                except Exception as e:
                    result = False
                    print('createTableDiagnosisZonesIfNotExistFactory failed:'+e.__str__())
                    app.logger.error('createTableDiagnosisZonesIfNotExistFactory failed:'+e.__str__())
        else:
            print('createTableDiagnosisZonesIfNotExistFactory:tableList is not in memcache')
            logging.info('createTableDiagnosisZonesIfNotExistFactory:tableList is not in memcache')
        return result

    def createTableDiagnosisEquipmentsIfNotExist(self, DiagnosisEquipmentsTableName):
        result = True
        tableList = self.getTableListInMemcache()
        if tableList:
            if DiagnosisEquipmentsTableName.lower() not in tableList:
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
                                print('auto create table %s'%(DiagnosisEquipmentsTableName,))
                                logging.info('auto create table %s'%(DiagnosisEquipmentsTableName,))
                                tableList.append(DiagnosisEquipmentsTableName)
                                RedisManager.set_table_list( tableList)
                except Exception as e:
                    result = False
                    print('createTableDiagnosisEquipmentsIfNotExist failed:'+e.__str__())
                    app.logger.error('createTableDiagnosisEquipmentsIfNotExist failed:'+e.__str__())
        else:
            print('createTableDiagnosisEquipmentsIfNotExist:tableList is not in memcache')
            logging.info('createTableDiagnosisEquipmentsIfNotExist:tableList is not in memcache')
        return result

    def createTableDiagnosisFaultsIfNotExist(self, DiagnosisFaultsTableName):
        result = True
        tableList = self.getTableListInMemcache()
        if tableList:
            if DiagnosisFaultsTableName.lower() not in tableList:
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
                                print('auto create table %s'%(DiagnosisFaultsTableName,))
                                logging.info('auto create table %s'%(DiagnosisFaultsTableName,))
                                tableList.append(DiagnosisFaultsTableName)
                                RedisManager.set_table_list( tableList)
                except Exception as e:
                    result = False
                    print('createTableDiagnosisFaultsIfNotExist failed:'+e.__str__())
                    app.logger.error('createTableDiagnosisFaultsIfNotExist failed:'+e.__str__())
        else:
            print('createTableDiagnosisFaultsIfNotExist:tableList is not in memcache')
            logging.info('createTableDiagnosisFaultsIfNotExist:tableList is not in memcache')
        return result

    def createTableDiagnosisEnableIfNotExist(self, DiagnosisEnableTableName):
        result = True
        tableList = self.getTableListInMemcache()
        if tableList:
            if DiagnosisEnableTableName.lower() not in tableList:
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
                                print('auto create table %s'%(DiagnosisEnableTableName,))
                                logging.info('auto create table %s'%(DiagnosisEnableTableName,))
                                tableList.append(DiagnosisEnableTableName)
                                RedisManager.set_table_list( tableList)
                except Exception:
                    result = False
                    logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        else:
            logging.info('createTableDiagnosisEnableIfNotExist:tableList is not in memcache')
        return result

    def createTableDiagnosisLimitIfNotExist(self, DiagnosisLimitTableName):
        result = True
        tableList = self.getTableListInMemcache()
        if tableList:
            if DiagnosisLimitTableName.lower() not in tableList:
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
                                print('auto create table %s'%(DiagnosisLimitTableName,))
                                logging.info('auto create table %s'%(DiagnosisLimitTableName,))
                                tableList.append(DiagnosisLimitTableName)
                                RedisManager.set_table_list( tableList)
                except Exception:
                    result = False
                    logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        else:
            logging.info('createTableDiagnosisLimitIfNotExist:tableList is not in memcache')
        return result

    def createTableDiagnosisNoticesIfNotExist(self, DiagnosisNoticesTableName):
        result = True
        tableList = self.getTableListInMemcache()
        if tableList:
            if DiagnosisNoticesTableName.lower() not in tableList:
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
                                  `EndTime`  datetime DEFAULT NULL,\
                                  PRIMARY KEY (Id),\
                                  KEY time (Time) USING BTREE\
                                ) ENGINE=InnoDB DEFAULT CHARSET=utf8;" % (DiagnosisNoticesTableName,)
                            result = self._mysqlDBContainer.op_db_update('diagnosis', sql, ())
                            if result:
                                logging.info('auto create table %s'%(DiagnosisNoticesTableName,))
                                tableList.append(DiagnosisNoticesTableName)
                                RedisManager.set_table_list( tableList)
                except Exception:
                    result = False
                    logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        else:
             logging.info('createTableDiagnosisNoticesIfNotExist:tableList is not in memcache')
        return result

    def createTableDiagnosisOrderIfNotExist(self, DiagnosisOrderTableName):
        result = True
        tableList = self.getTableListInMemcache()
        if tableList:
            if DiagnosisOrderTableName.lower() not in tableList:
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
                                print('auto create table %s'%(DiagnosisOrderTableName,))
                                logging.info('auto create table %s'%(DiagnosisOrderTableName,))
                                tableList.append(DiagnosisOrderTableName)
                                RedisManager.set_table_list( tableList)
                except Exception as e:
                    result = False
                    print('createTableDiagnosisOrderIfNotExist failed:'+e.__str__())
                    app.logger.error('createTableDiagnosisOrderIfNotExist failed:'+e.__str__())
        else:
            print('createTableDiagnosisOrderIfNotExist:tableList is not in memcache')
            logging.info('createTableDiagnosisOrderIfNotExist:tableList is not in memcache')
        return result

    def getAllRTTableNames(self):
        rt = []
        try:
            sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'beopdoengine' and TABLE_NAME like 'rtdata_%%'"
            ret = self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)
            if ret:
                rt = [x[0] for x in ret]
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    #yan add 2016-7-6
    def getAllHisdataTableNamesFromBuffer(self):
        rt = []
        try:
            sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'beopdatabuffer' and TABLE_NAME like 'hisdata_%%'"
            ret = self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)
            if ret:
                rt = [x[0] for x in ret]
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def getAllRTdataTableNamesFromBuffer(self):
        rt = []
        try:
            sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'beopdatabuffer' and TABLE_NAME like 'rtdata_%%'"
            ret = self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)
            if ret:
                rt = [x[0] for x in ret]
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def getAllConfigTableNames(self):
        rt = []
        try:
            sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'beopdoengine' and TABLE_NAME like 'config_beopdata_%%'"
            ret = self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)
            if ret:
                rt = [x[0] for x in ret]
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def getAllOpRecordTableNames(self):
        rt = []
        try:
            sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'beopdoengine' and TABLE_NAME like 'oprecord_beopdata_%%'"
            ret = self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)
            if ret:
                rt = [x[0] for x in ret]
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def getAllWarningTableNames(self):
        rt = []
        try:
            sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'beopdoengine' and TABLE_NAME like 'warningrd_beopdata_%%'"
            ret = self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)
            if ret:
                rt = [x[0] for x in ret]
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def getAllDiagnosisZonesTableNames(self):
        rt = []
        try:
            sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'diagnosis' and TABLE_NAME like 'beopdata_%%_diagnosis_zones'"
            ret = self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)
            if ret:
                rt = [x[0] for x in ret]
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def getAllDiagnosisEquipmentsTableNames(self):
        rt = []
        try:
            sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'diagnosis' and TABLE_NAME like 'beopdata_%%_diagnosis_equipments'"
            ret = self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)
            if ret:
                rt = [x[0] for x in ret]
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def getAllDiagnosisFaultsTableNames(self):
        rt = []
        try:
            sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'diagnosis' and TABLE_NAME like 'beopdata_%%_diagnosis_faults'"
            ret = self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)
            if ret:
                rt = [x[0] for x in ret]
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def getAllDiagnosisEnableTableNames(self):
        rt = []
        try:
            sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'diagnosis' and TABLE_NAME like 'beopdata_%%_diagnosis_enable'"
            ret = self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)
            if ret:
                rt = [x[0] for x in ret]
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def getAllDiagnosisLimitTableNames(self):
        rt = []
        try:
            sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'diagnosis' and TABLE_NAME like 'beopdata_%%_diagnosis_limit'"
            ret = self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)
            if ret:
                rt = [x[0] for x in ret]
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def getAllDiagnosisNoticesTableNames(self):
        rt = []
        try:
            sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'diagnosis' and TABLE_NAME like 'beopdata_%%_diagnosis_notices'"
            ret = self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)
            if ret:
                rt = [x[0] for x in ret]
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def getAllDiagnosisOrderTableNames(self):
        rt = []
        try:
            sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'diagnosis' and TABLE_NAME like 'beopdata_%%_diagnosis_order'"
            ret = self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)
            if ret:
                rt = [x[0] for x in ret]
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def getAllDiagnosisKPITableNames(self):
        rt = []
        try:
            sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'diagnosis' and TABLE_NAME like 'beopdata_%%_diagnosis_kpi_%%'"
            ret = self._mysqlDBContainerReadOnly.op_db_query('INFORMATION_SCHEMA', sql)
            if ret:
                rt = [x[0] for x in ret]
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def getAllMysqlTableNames(self):
        rt = []
        try:
            rt.extend(self.getAllRTTableNames())
            # for item in rt:
            #     self.createRTTableIfNotExist(item)
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
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def getRealtimeOutputByProjId(self, projId):
        rt = []
        try:
            confdb = app.config.get('DATABASE')
            sql = 'select `time`, pointname, pointvalue from realtimedata_output_to_site where projectid=%s order by `time`'%(projId,)
            ret = self._mysqlDBContainerReadOnly.op_db_query(confdb, sql)
            if ret:
                for item in ret:
                    rt.append({'time':item[0].strftime('%Y-%m-%d %H:%M:%S'), 'pointname':item[1], 'pointvalue':item[2]})
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def resetDiagnosisTable(self, projId, suffix):
        rt = False
        try:
            tableName = ''
            if suffix in ['enable', 'equipments', 'faults', 'limit', 'notices', 'order', 'zones']:
                mysqlname = self.getMysqlNameById(projId)
                if mysqlname:
                    tableName = mysqlname + '_diagnosis_' + suffix
                    sql = 'delete from %s'%(tableName)
                    if self._mysqlDBContainer.op_db_update('diagnosis', sql, ()):
                        rt = True
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def initAllDiagnosisTables(self, projId):
        rt = False
        try:
            mysqlname = self.getMysqlNameById(projId)
            if mysqlname:
                self.createTableDiagnosisEnableIfNotExist(mysqlname+'_diagnosis_'+'enable')
                self.resetDiagnosisTable(projId, 'enable')
                self.createTableDiagnosisFaultsIfNotExist(mysqlname+'_diagnosis_'+'faults')
                self.resetDiagnosisTable(projId, 'faults')
                self.createTableDiagnosisEquipmentsIfNotExist(mysqlname+'_diagnosis_'+'equipments')
                self.resetDiagnosisTable(projId, 'equipments')
                self.createTableDiagnosisLimitIfNotExist(mysqlname+'_diagnosis_'+'limit')
                self.resetDiagnosisTable(projId, 'limit')
                self.createTableDiagnosisNoticesIfNotExist(mysqlname+'_diagnosis_'+'notices')
                self.resetDiagnosisTable(projId, 'notices')
                self.createTableDiagnosisOrderIfNotExist(mysqlname+'_diagnosis_'+'order')
                self.resetDiagnosisTable(projId, 'order')
                self.createTableDiagnosisZonesIfNotExist(mysqlname+'_diagnosis_'+'zones')
                self.resetDiagnosisTable(projId, 'zones')
                rt = True
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def getMaxId(self, tableName):
        rt = 0
        try:
            sql = "select max(Id) from %s"%(tableName,)
            ret = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', sql, ())
            if ret:
                if ret[0][0]:
                    rt = int(ret[0][0])
                else:
                    rt = 1
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def getZoneMaxCampusId(self, tableName):
        rt = 0
        try:
            sql = "select max(CampusId) from %s"%(tableName,)
            ret = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', sql, ())
            if ret:
                if ret[0][0]:
                    rt = int(ret[0][0])
                else:
                    rt = 1
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def getZoneMaxBuildingId(self, tableName):
        rt = 0
        try:
            sql = "select max(BuildingId) from %s"%(tableName,)
            ret = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', sql, ())
            if ret:
                if ret[0][0]:
                    rt = int(ret[0][0])
                else:
                    rt = 1
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def getZoneMaxSubBuildingId(self, tableName):
        rt = 0
        try:
            sql = "select max(SubBuildingId) from %s"%(tableName,)
            ret = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', sql, ())
            if ret:
                if ret[0][0]:
                    rt = int(ret[0][0])
                else:
                    rt = 1
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def addNoticeCheckZone(self, projId, buildingName, subBuildingName, pageId):
        #zondId,buildingId,subBuildingId
        rt = None
        try:
            CampusId = 1
            BuildingId = 1
            id = 1
            mysqlname = self.getMysqlNameById(projId)
            if mysqlname:
                tableName = mysqlname+'_diagnosis_'+'zones'
                if isinstance(pageId, int):
                    self.createTableDiagnosisZonesIfNotExist(tableName)
                else:
                    self.createTableDiagnosisZonesIfNotExistFactory(tableName)
                if isinstance(pageId, int):
                    sql = "select Id,BuildingId,SubBuildingId from %s where BuildingName='%s' and SubBuildingName='%s' and PageId=%s and Project='%s'"%(tableName, buildingName, subBuildingName, pageId, str(projId))#,PageId,CampusId,BuildingId,SubBuildingId,CampusName,BuildingName,SubBuildingName,Image,Project,`Count`
                else:
                    sql = "select Id,BuildingId,SubBuildingId from %s where BuildingName='%s' and SubBuildingName='%s' and PageId='%s' and Project='%s'"%(tableName, buildingName, subBuildingName, pageId, str(projId))#,PageId,CampusId,BuildingId,SubBuildingId,CampusName,BuildingName,SubBuildingName,Image,Project,`Count`
                rv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', sql, ())
                if not rv:
                    id = self.getMaxId(tableName)+1
                    sql = "select distinct CampusId, BuildingId, BuildingName from %s where BuildingName='%s'"%(tableName, buildingName)
                    temprv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', sql, ())
                    if temprv:
                        CampusId = temprv[0][0]
                        BuildingId = temprv[0][1]
                    else:
                        CampusId = self.getZoneMaxCampusId(tableName) + 1
                        BuildingId = self.getZoneMaxBuildingId(tableName) + 1
                    if isinstance(pageId, int):
                        sql = "insert into %s(Id,PageId,CampusId,BuildingId,SubBuildingId,CampusName,BuildingName,SubBuildingName,Image,Project,`Count`) values(%s,%s,%s,%s,%s,'%s','%s','%s',NULL,'%s',0)"%(tableName,id,pageId,CampusId,BuildingId,id,'',buildingName,subBuildingName,str(projId))
                    else:
                        sql = "insert into %s(Id,PageId,CampusId,BuildingId,SubBuildingId,CampusName,BuildingName,SubBuildingName,Image,Project,`Count`) values(%s,'%s',%s,%s,%s,'%s','%s','%s',NULL,'%s',0)"%(tableName,id,pageId,CampusId,BuildingId,id,'',buildingName,subBuildingName,str(projId))
                    if self._mysqlDBContainer.op_db_update('diagnosis', sql, ()):
                        rt = id, BuildingId, id
                    else:
                        raise Exception('excute sql=%s failed'%(sql,))
                else:
                    rt = rv[0][0], rv[0][1], rv[0][2]
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def addNoticeCheckEquipment(self, projId, equipmentName, zoneId):
        rt = None
        try:
            mysqlname = self.getMysqlNameById(projId)
            if mysqlname:
                tableName = mysqlname+'_diagnosis_'+'equipments'
                self.createTableDiagnosisEquipmentsIfNotExist(tableName)
                sql = "select Id from %s where Name='%s' and ZoneId=%s"%(tableName, equipmentName, zoneId)
                rv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', sql, ())
                if not rv:
                    sql = "insert into %s(Name,PageId,ZoneId,SystemId,SubSystemId,SystemName,SubSystemName,Project,ModalTextId) values('%s',0,%s,NULL,0,'','','%s',0)"%(tableName,equipmentName,zoneId,str(projId))
                    if self._mysqlDBContainer.op_db_update('diagnosis', sql, ()):
                        id = self.getMaxId(tableName)
                        sql = "update %s set SystemId=%d where Id=%d"%(tableName,id,id)
                        if self._mysqlDBContainer.op_db_update('diagnosis', sql, ()):
                            rt = id
                    else:
                        raise Exception('excute sql=%s failed'%(sql,))
                else:
                    rt = rv[0][0]
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def addNoticeCheckFault(self, projId, faultName, faultDescription, equipmentId, grade, bindPoints):
        rt = None
        try:
            mysqlname = self.getMysqlNameById(projId)
            if mysqlname:
                point_str = bindPoints
                tableName = mysqlname+'_diagnosis_'+'faults'
                self.createTableDiagnosisFaultsIfNotExist(tableName)
                sql = "select Id from %s where Name='%s' and EquipmentId=%s"%(tableName, faultName, equipmentId)
                rv = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', sql, ())
                if not rv:
                    id = self.getMaxId(tableName)+1
                    sql = "insert into %s(Id,ParentId,Name,Description,Points,EquipmentId,DefaultGrade,IsUserDefined,UserId,UserFaultGrade,UserFaultDelay,UserModifyTime,UserEnable,Project,NoticeId) VALUES" \
                          "(%s,%s,'%s','%s','%s',%s,%s,0,0,1,NOW(),NOW(),1,'%s',0)"%(tableName,id,equipmentId,faultName,faultDescription,point_str,equipmentId,grade,str(projId))
                    if self._mysqlDBContainer.op_db_update('diagnosis', sql, ()):
                        rt = self.getMaxId(tableName)
                    else:
                        raise Exception('excute sql=%s failed'%(sql,))
                else:
                    sql = "update %s set Description='%s', DefaultGrade=%d, Points='%s' where Name='%s' and EquipmentId=%s"%(tableName, faultDescription, grade, point_str, faultName, equipmentId)
                    if not self._mysqlDBContainer.op_db_update('diagnosis', sql, ()):
                        raise Exception('excute sql=%s failed'%(sql,))
                    rt = rv[0][0]
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def addNoticeUpdateFault(self, projId, faultId, faultDescription, energy, timeInterval=None):
        rt = None
        try:
            withInTimeInterval = True
            mysqlname = self.getMysqlNameById(projId)
            if mysqlname:
                tableName = mysqlname+'_diagnosis_'+'notices'
                self.createTableDiagnosisNoticesIfNotExist(tableName)
                tableNameFault = mysqlname+'_diagnosis_'+'faults'
                self.createTableDiagnosisFaultsIfNotExist(tableNameFault)
                if timeInterval:
                    check_sql = "select max(Time),Id from %s where FaultId=%s AND Energy=%s AND Project=%s" % (
                        tableName, faultId, energy, str(projId))
                    if faultDescription:
                        check_sql += ' AND Detail=\'%s\'' % (faultDescription,)
                    else:
                        check_sql += ' AND Detail=\'\''
                    check_result = self._mysqlDBContainer.op_db_query('diagnosis', check_sql, ())
                    if check_result and check_result[0] and check_result[0][0] and check_result[0][1]:
                        last_time = check_result[0][0]
                        if (last_time + timedelta(hours=timeInterval)) > datetime.now():
                            withInTimeInterval = False
                            rt = check_result[0][1]
                if withInTimeInterval:
                    sql = "insert into %s(FaultId,Time,OrderId,Energy,Detail,Status,Project,CheckTime,Operator) VALUES" \
                          "(%d,NOW(),0,'%s','%s',1,'%s',NULL,NULL)"%(tableName,faultId,energy,faultDescription,str(projId))
                    if self._mysqlDBContainer.op_db_update('diagnosis', sql, ()):
                        id = self.getMaxId(tableName)
                        if id:
                            sql = "update %s set Description='%s', NoticeId=%d where Id=%d"%(tableNameFault,faultDescription,id,faultId)
                            if self._mysqlDBContainer.op_db_update('diagnosis', sql, ()):
                                rt = id
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def createDiagnosisTableKPIStructureIfNotExist(self, tableName):
        result = True
        tableList = self.getTableListInMemcache()
        if tableList:
            if tableName.lower() not in tableList:
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
                                print('auto create table %s'%(tableName,))
                                logging.info('auto create table %s'%(tableName,))
                                tableList.append(tableName)
                                RedisManager.set_table_list( tableList)
                except Exception as e:
                    result = False
                    logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return result

    def createDiagnosisTableKPIValueIfNotExist(self, tableName):
        result = True
        tableList = self.getTableListInMemcache()
        if tableList:
            if tableName.lower() not in tableList:
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
                                print('auto create table %s'%(tableName,))
                                logging.info('auto create table %s'%(tableName,))
                                tableList.append(tableName)
                                RedisManager.set_table_list( tableList)
                except Exception as e:
                    result = False
                    print('createDiagnosisTableKPIValueIfNotExist failed:'+e.__str__())
                    app.logger.error('createDiagnosisTableKPIValueIfNotExist failed:'+e.__str__())
        return result

    def createDiagnosisTableKPIToFaultIfNotExist(self, tableName):
        result = True
        tableList = self.getTableListInMemcache()
        if tableList:
            if tableName.lower() not in tableList:
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
                                print('auto create table %s'%(tableName,))
                                logging.info('auto create table %s'%(tableName,))
                                tableList.append(tableName)
                                RedisManager.set_table_list( tableList)
                except Exception as e:
                    result = False
                    print('createDiagnosisTableKPIToFaultIfNotExist failed:'+e.__str__())
                    app.logger.error('createDiagnosisTableKPIToFaultIfNotExist failed:'+e.__str__())
        return result

    def createDiagnosisTableKPIToWikiIfNotExist(self, tableName):
        result = True
        tableList = self.getTableListInMemcache()
        if tableList:
            if tableName.lower() not in tableList:
                try:
                    if isinstance(tableName, str):
                        if len(tableName) > 0:
                            sql = "CREATE TABLE IF NOT EXISTS %s (" \
                                  "`faultId`  bigint(20) NULL ," \
                                  "`wikiId`  varchar(255) NULL ) " \
                                  "ENGINE=InnoDB DEFAULT CHARSET=utf8" % (tableName,)
                            result = self._mysqlDBContainer.op_db_update('diagnosis', sql, ())
                            if result:
                                print('auto create table %s'%(tableName,))
                                logging.info('auto create table %s'%(tableName,))
                                tableList.append(tableName)
                                RedisManager.set_table_list( tableList)
                except Exception as e:
                    result = False
                    print('createDiagnosisTableKPIToWikiIfNotExist error:'+e.__str__())
                    app.logger.error('createDiagnosisTableKPIToWikiIfNotExist error:'+e.__str__())
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
                sql = "select id,name from %s where name='%s'"%(tableNameKPIStructure, kpiName2)
                q = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', sql, ())
                if q:
                    kpiName2Id = q[0][0]
                else:
                    sql = "insert into %s(projId,parentKPIId,name) values(%d,%d,'%s')"%(tableNameKPIStructure,projId,kpiName1Id,kpiName2)
                    u = self._mysqlDBContainer.op_db_update_with_id('diagnosis', tableNameKPIStructure, sql, ())
                    if u > -1:
                        kpiName2Id = u
                    else:
                        raise Exception('excute sql=%s failed'%(sql,))
                if kpiName2Id is not None:
                    kpiName3Id = None
                    sql = "select id,name from %s where name='%s'"%(tableNameKPIStructure, kpiName3)
                    q = self._mysqlDBContainerReadOnly.op_db_query('diagnosis', sql, ())
                    if q:
                        kpiName3Id = q[0][0]
                    else:
                        sql = "insert into %s(projId,parentKPIId,name) values(%d,%d,'%s')"%(tableNameKPIStructure,projId,kpiName2Id,kpiName3)
                        u = self._mysqlDBContainer.op_db_update_with_id('diagnosis', tableNameKPIStructure, sql, ())
                        if u > -1:
                            kpiName3Id = u
                        else:
                            raise Exception('excute sql=%s failed'%(sql,))
                    if kpiName3Id:
                        tableNameKPIToFault = mysqlname + "_diagnosis_kpi_to_fault"
                        self.createDiagnosisTableKPIToFaultIfNotExist(tableNameKPIToFault)
                        sql = "insert into %s(kpiId, faultId) values(%d,%d)"%(tableNameKPIToFault,kpiName3Id,faultId)
                        if self._mysqlDBContainer.op_db_update('diagnosis', sql, ()):
                            rt = kpiName1Id, kpiName2Id, kpiName3Id
                        else:
                            raise Exception('excute sql=%s failed'%(sql,))
        except Exception as e:
            print('addFaultToKPI failed:'+e.__str__())
            app.logger.error('addFaultToKPI failed:'+e.__str__())
        return rt

    def deletePointFromMysql(self, projId, pointList):
        rt = False
        try:
            mysqlname = self.getMysqlNameById(projId)
            if mysqlname:
                rtTableName = 'rtdata_'+mysqlname
                sql = "delete from %s where pointname in (%s)"%(rtTableName,str(pointList).replace('[', '').replace(']', ''),)
                rt = self._mysqlDBContainer.op_db_update(app.config.get('DATABASE'), sql, ())
        except Exception as e:
            print('deletePointFromMysql failed:'+e.__str__())
            app.logger.error('deletePointFromMysql failed:'+e.__str__())
        return rt

    def deletePointFromMysql_All(self, projId):
        rt = False
        try:
            mysqlname = self.getMysqlNameById(projId)
            if mysqlname:
                rtTableName = 'rtdata_'+mysqlname
                sql = "delete from %s where flag=0 "%(rtTableName,)
                rt = self._mysqlDBContainer.op_db_update(app.config.get('DATABASE'), sql, ())
        except Exception as e:
            print('deletePointFromMysql_All failed:'+e.__str__())
            app.logger.error('deletePointFromMysql_All failed:'+e.__str__())
        return rt

    def getUserInfoByIds(self, userIdList):
        rt = {}
        try:
            if userIdList:
                userIdList = [str(x) for x in userIdList]
                sql = "select id,usermobile,useremail from user where id in (%s)"%(",".join(userIdList))
                ret = self._mysqlDBContainerReadOnly.op_db_query(app.config.get('DATABASE'), sql, ())
                if ret:
                    rt = {x[0]:(x[1] if x[1] else '', x[2] if x[2] else '') for x in ret}
        except Exception as e:
            print('getUserInfoByIds failed:'+e.__str__())
            app.logger.error('getUserInfoByIds failed:'+e.__str__())
        return rt

    def getDUTLastUpdatetime(self):
        rt = {}
        try:
            sql = "select p.id,i.LastReceivedTime from dtusert_to_project t,dtuserver_prj_info i, project p where t.dtuprojectid = i.id and t.projectid = p.id"
            ret = self._mysqlDBContainerReadOnly.op_db_query(app.config.get('DATABASE'), sql, ())
            if ret:
                rt = {x[0]:x[1] for x in ret}
        except Exception as e:
            print('getDUTLastUpdatetime failed:'+e.__str__())
            app.logger.error('getDUTLastUpdatetime failed:'+e.__str__())
        return rt

    def getProjIdListByRTTableName(self, rtTableName):
        rt = []
        try:
            projList = RedisManager.get_project_info_list()
            if projList:
                for item in projList:
                    strMysqlName = item.get('mysqlname')
                    if strMysqlName is not None:
                        if ("rtdata_"+strMysqlName).lower() == rtTableName.lower():
                            rt.append( item.get('id'))
        except Exception as e:
            print('getDUTLastUpdatetime failed: when query rtTablename:%s'%(rtTableName,) +e.__str__())
            app.logger.error('getDUTLastUpdatetime failed: when query rtTablename:%s'%(rtTableName,)+e.__str__())
        return rt

    #yan add 2016-7-6
    def createTableBufferHisdataIfNotExist(self, projId):
        tableList = self.getTableListInMemcache()
        dbName = app.config.get('DATABASE_BUFFER')
        tableName = 'hisdata_%s'%(projId,)
        if tableList:
            if tableName.lower() not in tableList:
                try:
                    if isinstance(tableName, str):
                        if len(tableName) > 0:
                            sql = "CREATE TABLE IF NOT EXISTS %s (`time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP," \
                                  "`pointname` varchar(128) NOT NULL DEFAULT '', " \
                                  "`pointvalue` text NOT NULL, PRIMARY KEY (`time`,pointname)) " \
                                  "ENGINE=InnoDB DEFAULT CHARSET=utf8"%(tableName,)
                            result = self._mysqlDBContainer.op_db_update(dbName, sql, ())
                            if result:
                                tableList.append(tableName)
                                RedisManager.set_table_list( tableList)
                                return True
                            else:
                                print('auto create table %s failed'%(tableName,))
                                logging.info('auto create table %s failed'%(tableName,))
                except Exception as e:
                    print('createTableBufferHisdataIfNotExist error:'+e.__str__())
                    app.logger.error('createTableBufferHisdataIfNotExist error:'+e.__str__())
        return False

    def createTableBufferRTTableIfNotExist(self, projId):
        tableList = self.getTableListInMemcache()
        dbName = app.config.get('DATABASE_BUFFER')
        tableName = 'rtdata_%s'%(projId,)
        if tableList:
            if tableName.lower() not in tableList:
                try:
                    if isinstance(tableName, str):
                        if len(tableName) > 0:
                            sql = "CREATE TABLE IF NOT EXISTS %s (\
                                    `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\
                                    `pointname` varchar(128) NOT NULL DEFAULT '',\
                                    `pointvalue` text NOT NULL,\
                                    `flag` INT(10) NOT NULL DEFAULT 0,\
                                    PRIMARY KEY (`pointname`)\
                               ) ENGINE=InnoDB DEFAULT CHARSET=utf8"%(tableName,)
                            result = self._mysqlDBContainer.op_db_update(dbName, sql, ())
                            if result:
                                tableList.append(tableName)
                                RedisManager.set_table_list( tableList)
                                return True
                            else:
                                print('auto create table %s failed'%(tableName,))
                                logging.info('auto create table %s failed'%(tableName,))
                except Exception as e:
                    print('createTableBufferRTTableIfNotExist error:'+e.__str__())
                    app.logger.error('createTableBufferRTTableIfNotExist error:'+e.__str__())
        return False

    def createTableBufferRTTableVPointIfNotExist(self, projId):
        tableList = self.getTableListInMemcache()
        dbName = app.config.get('DATABASE_BUFFER')
        tableName = 'rtdata_%s_vpoint'%(projId,)
        if tableList:
            if tableName.lower() not in tableList:
                try:
                    if isinstance(tableName, str):
                        if len(tableName) > 0:
                            sql = "CREATE TABLE IF NOT EXISTS %s (\
                                    `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\
                                    `pointname` varchar(128) NOT NULL DEFAULT '',\
                                    `pointvalue` text,\
                                    `flag` INT(10) NOT NULL DEFAULT 1,\
                                    PRIMARY KEY (`pointname`)\
                               ) ENGINE=InnoDB DEFAULT CHARSET=utf8"%(tableName,)#`flag` INT(10) NOT NULL DEFAULT 1,\
                            result = self._mysqlDBContainer.op_db_update(dbName, sql, ())
                            if result:
                                tableList.append(tableName)
                                RedisManager.set_table_list( tableList)
                                return True
                            else:
                                logging.error('auto create table %s failed'%(tableName,))
                except Exception:
                    logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return False

    def createTableThirdpartyIfNotExist(self, projId):
        tableList = self.getTableListInMemcache()
        dbName = app.config.get('DATABASE_BUFFER')
        tableName = 'rtdata_%s_thirdparty'%(projId,)
        if tableList:
            if tableName.lower() not in tableList:
                try:
                    if isinstance(tableName, str):
                        if len(tableName) > 0:
                            sql = "CREATE TABLE IF NOT EXISTS %s (\
                                    `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\
                                    `pointname` varchar(128) NOT NULL DEFAULT '',\
                                    `pointvalue` text,\
                                    `flag` INT(10) NOT NULL DEFAULT 1,\
                                    PRIMARY KEY (`pointname`)\
                               ) ENGINE=InnoDB DEFAULT CHARSET=utf8"%(tableName,)#`flag` INT(10) NOT NULL DEFAULT 1,\
                            result = self._mysqlDBContainer.op_db_update(dbName, sql, ())
                            if result:
                                tableList.append(tableName)
                                RedisManager.set_table_list( tableList)
                                return True
                            else:
                                logging.error('auto create table %s failed'%(tableName,))
                except Exception:
                    logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
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
                            block = length//constMaxRowsPerOperation
                            for count in range(block+1):
                                timeList = []
                                pointList = []
                                valueList = []
                                for index in range(count*constMaxRowsPerOperation,(count+1)*constMaxRowsPerOperation):
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
                                            logging.error('InsertHisDataToMysql:sql=%s execute failed', strsql)
                                            rt.update({'state': 403, 'message': 'manipulating database failed'})
                            logging.debug('update table %s, length=%s', tableName, length)
        except Exception:
            logging.error('Failed to insert history data to MySQL with hisdata=%s, projId=%s',
                          hisdata, projId, exc_info=True, stack_info=True)
        return rt

    def clearBufferHisdata(self, projId):
        rt = False
        try:
            tableName = "hisdata_%s"%(projId,)
            dbname = app.config.get('DATABASE_BUFFER')
            t_now = datetime.now()
            t_end = t_now - timedelta(hours=2)
            str_t_end = t_end.strftime('%Y-%m-%d %H:%M:%S')
            sql = "delete from %s where `time` < '%s'"%(tableName,str_t_end)
            rt = self._mysqlDBContainer.op_db_update(dbname, sql, ())
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def getFlag0PointValueList(self,projId):
        insertDataList={}
        projName=''
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
                    insertDataList = {item[1]:item[2] for item in rvQuery}
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return insertDataList

    def get_hisdata_mysql_buffer(self,projId,t_time,pointList):
        insertDataList=[]
        projName=''
        try:
            dbname = app.config['DATABUFFER']
            tableName = 'hisdata_%s'%(projId,)
            sql = "select time,pointname,pointvalue from %s where time='%s' and pointname in (%s) " % (tableName,t_time,str(pointList).replace('[', '').replace(']', ''),)
            print('dbname:%s'%(dbname,))
            print(sql)
            rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql)
            if rvQuery != None:
                if len(rvQuery) > 0:
                    insertDataList = {item[1]:item[2] for item in rvQuery}
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return insertDataList

    def getBufferRTDataByProj(self, projId, pointList=None, type = -1):
        rt = {}
        try:
            dbname = 'beopdatabuffer'
            tableName = 'rtdata_%s'%(projId,)
            tableName_vpoint = 'rtdata_%s_vpoint'%(projId,)
            tableList = self.getTableListInMemcache()
            if tableList:
                if tableName in tableList and tableName_vpoint in tableList:
                    if pointList:
                        q = 'select pointname, pointvalue from (select pointname, pointvalue from %s UNION all select pointname, pointvalue from %s) a where pointname in (%s)'%(tableName, tableName_vpoint, str(pointList).replace('[','').replace(']',''))
                    else:
                        if type < 0:
                            q = 'select pointname, pointvalue from %s UNION all select pointname, pointvalue from %s' % (tableName, tableName_vpoint)
                        else:
                            if type == 0 or type == 2:
                                q = 'select pointname, pointvalue from %s where flag=%s' % (tableName, type)
                            elif type == 1:
                                q = 'select pointname, pointvalue from %s where flag=%s' % (tableName_vpoint, type)
                    rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, ())
                    rt = {x[0]:x[1] for x in rvQuery}
                else:
                    rt = {'error': 1, 'msg': 'no realtime data'}
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def getBufferRTDataWithTimeByProj(self, projId, pointList=None):
        rt = {}
        try:
            dbname = 'beopdatabuffer'
            tableName = 'rtdata_%s'%(projId,)
            tableName_vpoint = 'rtdata_%s_vpoint'%(projId,)
            tableList = self.getTableListInMemcache()
            if tableList:
                if tableName in tableList and tableName_vpoint in tableList:
                    if pointList:
                        q = 'select pointname, pointvalue, time from (select pointname, pointvalue, time from %s '\
                            'UNION all select pointname, pointvalue, time from %s) a where pointname in (%s)'%(tableName, tableName_vpoint, str(pointList).replace('[','').replace(']',''))
                    else:
                        q = 'select pointname, pointvalue, time from %s UNION all select pointname, pointvalue, time from %s' % (tableName, tableName_vpoint)
                    rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, ())
                    #rt = {x[1]:[x[0], x[2]] for x in rvQuery}
                    rt = rvQuery
        except Exception as e:
            print('getBufferRTDataWithTimeByProj error:' + e.__str__())
            app.logger.error(e)
            raise Exception(e.__str__())
        return rt

    def getBufferRTDataWithTimeByProjRaw(self, projId, pointList=None):
        rt = {}
        try:
            dbname = 'beopdoengine'
            mysqlname = self.getMysqlNameById(projId)
            tableName = 'rtdata_%s'%(mysqlname,)
            if pointList:
                q = 'select pointname, pointvalue, time from %s where pointname in (%s)'%(tableName, str(pointList).replace('[','').replace(']',''))
            else:
                q = 'select pointname, pointvalue, time from %s' % (tableName,)
            rvQuery = self._mysqlDBContainerReadOnly.op_db_query(dbname, q, ())
            rt = rvQuery
        except Exception as e:
            print('getBufferRTDataWithTimeByProjRaw error:' + e.__str__())
            app.logger.error(e)
            raise Exception(e.__str__())
        return rt

    def setRTDataVirtualByProj(self, projId, pointName, pointValue):
        #print('setData')
        if not isinstance(pointName, str):
            return 'failed: pointName is not string'

        rv = "error: point modification failed."

        self.createTableBufferRTTableVPointIfNotExist(projId)

        dbname = 'beopdatabuffer'
        if not (isinstance(pointValue, str) or isinstance(pointValue, float) or isinstance(pointValue, int)):
            pointValue = 'None'
        q = 'insert into rtdata_%d_vpoint' % (projId,) + '(time,pointname, pointvalue) values(now(), %s, %s) on duplicate key update time=now(), pointvalue=%s'
        parameters = (pointName, pointValue, pointValue)
        bSuccess = self._mysqlDBContainer.op_db_update(dbname, q, parameters)
        if bSuccess:
            return 'success'
        else:
            errInf = 'error: manipulating database failed'
            print(errInf)
            app.logger.error(errInf)
            return errInf

        if not (rowCount == 'failed'):
            rv = "succeeded sending command for updating point value."
        return rv


    def setRTDataMulVirtualByProj(self, projId, pointNameList, pointValueList):
        #print('setData')
        result = "error: point modification failed."
        self.createTableBufferRTTableVPointIfNotExist(projId)

        dbname = 'beopdatabuffer'
        try:
            tableName = 'rtdata_%d'%(projId)
            bSuccess = self._mysqlDBContainer.op_db_update_rttable_by_transaction(dbname, tableName, pointNameList, pointValueList)
            if bSuccess:
                result = 'success'
            else:
                result = 'error: manipulating database failed'
        except Exception as e:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
            result = 'error: %s' % (e.__str__(),)
        return result

    def create_rttable_by_project(self):
        rt = []
        try:
            projList = RedisManager.get_project_info_list()
            if projList:
                for item in projList:
                    id = item.get('id')
                    if self.createTableBufferHisdataIfNotExist(id):
                        rt.append("hisdata_%s"%(id))
                    if self.createTableBufferRTTableVPointIfNotExist(id):
                        rt.append("rtdata_%s_vpoint"%(id))
                    if self.createTableBufferRTTableIfNotExist(id):
                        rt.append("rtdata_%s"%(id))
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def updateDtuConfig(self, dtuName, time, configList):
        try:
            dbname = app.config['DATABASE']
            params = []
            strSQL = 'replace into dtu_config (dtuname, time, configName, configValue) values'
            for config in configList:
                strSQL += '(%s, %s, %s, %s),'
                params.extend([dtuName, time, config.get('name'), config.get('value')])
            strSQL = strSQL[:-1]
            if params:
                return self._mysqlDBContainer.op_db_update(dbname, strSQL, tuple(params))
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return False

    def get_dbname_from_dtuserver_prj_by_dtuname(self, dtuname):
        rt = None
        try:
            dbname = app.config['DATABASE']
            strSQL = 'SELECT dbname from dtuserver_prj where dtuname = "%s"'%dtuname
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strSQL, ())
            if dbrv:
                rt = dbrv[0][0]
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def get_dtuProject_by_serverCode(self, serverCode):
        rt = []
        try:
            dbname  = app.config['DATABASE']
            strSQL = 'SELECT dtuname, dbname, timeZone, serverCode from dtuserver_prj where serverCode = %s'%serverCode
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strSQL, ())
            for item in dbrv:
                rt.append({'dtuName':item[0], 'RTBName':item[1], 'timeZone':item[2], 'serverCode':item[3]})
        except Exception as e:
            print('get_dtuProject_by_serverCode error:' + e.__str__())
            app.logger.error(e.__str__())
        return rt

    def update_dtuProject_by_dtuName(self, dtuName, RTBName, serverCode, timeZone):
        rt = False
        try:
            dbname = app.config['DATABASE']
            if dtuName and RTBName:
                strSQL = 'SELECT dtuname, dbname, timeZone, serverCode FROM dtuserver_prj WHERE dtuname = "%s"'%(dtuName,)
                dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strSQL, ())
                if dbrv:
                    strSQL = 'UPDATE dtuserver_prj SET dbname = "%s", timeZone = "%s", serverCode = %s WHERE dtuname = "%s"'%(RTBName, timeZone, serverCode, dtuName)
                    dr = self._mysqlDBContainer.op_db_update(dbname, strSQL, ())
                    if dr:
                        rt = True
                else:
                    strSQL = 'INSERT INTO dtuserver_prj(dtuname, dbname, timeZone, serverCode) VALUES("%s", "%s", "%s", %s)'%(dtuName, RTBName, timeZone, serverCode)
                    drv = self._mysqlDBContainer.op_db_update(dbname, strSQL, ())
                    if drv:
                        rt = True
            else:
                raise Exception('Missing Parameters')
        except Exception as e:
            print('update_dtuProject_by_dtuName error:' + e.__str__())
            app.logger.error(e.__str__())
            raise Exception(e.__str__())
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
                    projectInfoList = pInfoList if pInfoList!= None else []
                    projectInfoList.append(dict(name_en=dbrv[0][0], s3dbname=dbrv[0][1], mysqlname=dbrv[0][2], id=id,
                                                collectionname=dbrv[0][3]))
                    RedisManager.set_project_info_list(projectInfoList)
                    rt = dbrv[0][3]
        except Exception as e:
            print(e.__str__())
            app.logger.error('getCollectionNameById error:' + e.__str__())
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
            app.logger.error('get_v2_struct_seperate_time error:' + e.__str__())
        return None

    def get_valid_mysqlName(self):
        rt = []
        strSQL = 'SELECT id, mysqlname FROM project where mysqlname<>null or mysqlname<>""'
        try:
            rt = self._mysqlDBContainerReadOnly.op_db_query('beopdoengine', strSQL, ())
        except Exception as e:
            print('get_valid_mysqlName error:' + e.__str__())
            app.logger.error(e.__str__())
        return rt

    def all_rt_table(self):
        rt = False
        try:
            strSQL = 'SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = "beopdatabuffer" and TABLE_NAME like "rtdata_%%"'
            rt = self._mysqlDBContainerReadOnly.op_db_query('beopdatabuffer', strSQL, ())
        except Exception as e:
            print('get_all_real_data error:' + e.__str__())
            app.logger.error(e.__str__())
        return rt

    def get_all_real_data(self, tableName):
        rt = []
        try:
            strSQL = 'SELECT pointname,pointvalue FROM %s where char_length(pointvalue) >= 200'% (tableName)
            rt = self._mysqlDBContainerReadOnly.op_db_query('beopdatabuffer', strSQL,())
        except Exception as e:
            print('get_all_real_data error:' + e.__str__())
            app.logger.error(e.__str__())
        return rt

    def getNewCreateDtuNameByNameKey(self,NameKey):       #获取最新创建的dtu名
        try:
            NameKey = '%' + NameKey + '%'
            strQuery = "select dtuname from dtuserver_prj where dtuname like '%s' order by dtuname desc limit 0,1;" % (NameKey,)
            dbname = app.config['DATABASE']
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname,strQuery,())
            if dbrv:
                return dbrv[0][0] if dbrv[0][0] else None         #如果存在返回
        except Exception as e:
            print('get_dbname_by_dtuname error:' + e.__str__())
            app.logger.error(e.__str__())
            return None

    def getNamecnByProjId(self,projId):                   #获取项目中文名
        try:
            dbname = app.config.get('DATABASE')
            strQ = 'select name_cn from project where id=%s'
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strQ, (projId,))
            if not dbrv:
                strErr = 'getNamecnByProjId Error :projId=%s is not in mysql' % (projId,)
                print(strErr)
                logging.info(strErr)
                rt = None
            else:
                if dbrv[0]:
                    rt = dbrv[0][0]
                else:
                    strErr = 'getNamecnByProjId Error :projId=%s is not in mysql' % (projId,)
                    print(strErr)
                    logging.info(strErr)
                    rt = None
        except Exception as e:
            print('get_dbname_by_dtuname error:' + e.__str__())
            app.logger.error(e.__str__())
            rt = None
        return rt

    def getProByPrefix(self, Prefix, dbname, dtuId=''):    #根据项目前缀（dbuser）获取项目
        try:
            strQ = "select id from dtuserver_prj where dbuser = '%s' and dbname = '%s' and id <> '%s'" % (Prefix, dbname, dtuId)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(app.config.get('DATABASE'),strQ, ())
            if dbrv:
                return 1
            else:
                return 0
        except Exception as e:
            print("getProByPrefix Error:" + e.__str__())
            app.logger.error(e.__str__())
        return 0

    def insertDataToDbByDBname(self,data):      #通过数据名匹配数据插入数据
        try:
            keys = ",".join(data.keys())
            vals = ",".join(["%s" for k in data])             #list(data.values()
            dbname = app.config.get('DATABASE')
            sql = "INSERT INTO dtuserver_prj (%s) VALUES(%s)" % (keys, vals)
            if self._mysqlDBContainer.op_db_update(dbname,sql, list(data.values())):
                return True
            else:
                strErr = "insertDataToDbByDbname Error: %s Failed." % (sql)
                logging.error(strErr)
                print(strErr)
                return False
        except Exception as e:
            strErr = "insertDataToDbByDbname Error:" + e.__str__()
            app.logger.error(strErr)
            print(strErr)
            return False

    def getDtuIdByDtuName(self,dtuName):    #通过dtu名获取dtuId
        try:
            dbname = app.config.get('DATABASE')
            strQ = "SELECT id FROM dtuserver_prj WHERE dtuname = '%s'" % (dtuName,)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strQ, ())
            if not dbrv:
                strErr = 'getDtuIdByDtuName Error :dtuName =%s is not in mysql' % (dtuName,)
                print(strErr)
                logging.info(strErr)
                rt = None
            else:
                if dbrv[0]:
                    rt = dbrv[0][0]
                else:
                    strErr = 'getDtuIdByDtuName Error :dtuName =%s is not in mysql' % (dtuName,)
                    print(strErr)
                    logging.info(strErr)
                    rt = None
        except Exception as e:
            print('getDtuIdByDtuName error:' + e.__str__())
            app.logger.error(e.__str__())
            rt = None
        return rt

    def getAllDtuByServercode(self,serverCode = None): #通过serverCode获取dtu的dtu名，项目标识，
        datalist = []
        serverCode = serverCode if serverCode else 3
        try:
            serverCode = serverCode if isinstance(serverCode, int) else int(serverCode)
            dbname = app.config.get('DATABASE')
            #strQ = "SELECT dtuname,dbname,bSendData FROM dtuserver_prj WHERE serverCode = %d " % (serverCode,)
            strQ = '''SELECT dtuname,dbname,bSendData,id,dbip,dbuser,dbpsw,dtuRemark
            ,nSendType,nSendDataInterval,bSendEmail,nLastSendHour,nReSendType,synRealTable
            ,bDTUProject,timeZone,serverCode,equipName FROM dtuserver_prj WHERE serverCode = %d ''' % (serverCode,)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strQ, ())
            if dbrv:
                for item in dbrv:
                    data = {}
                    data['name'] = item[0]
                    data['dbname'] = item[1]
                    data['run'] = item[2]
                    data['id'] = item[3]
                    data['dbip'] = item[4]
                    data['dbuser'] = item[5]
                    data['dbpsw'] = item[6]
                    data['dtuRemark'] = item[7]
                    data['nSendType'] = item[8]
                    data['nSendDataInterval'] = item[9]
                    data['bSendEmail'] = item[10]
                    data['nLastSendHour'] = item[11]
                    data['nReSendType'] = item[12]
                    data['synRealTable'] = item[13]
                    data['bDTUProject'] = item[14]
                    data['timeZone'] = item[15]
                    data['serverCode'] = item[16]
                    data['equipName'] = item[17]
                    datalist.append(data)
            else:
                strErr = 'getAllDtuByServercode Error :serverCode = %d is not in mysql' % (serverCode,)
                #logging.info(strErr)
                #print(strErr)
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return datalist

    def getDtuPrefixByDtuId(self,dtuId):
        try:
            dtuId = dtuId if isinstance(dtuId, int) else int(dtuId)
            dbname = app.config.get('DATABASE')
            strQ = "SELECT dbuser FROM dtuserver_prj WHERE id = %d " % (dtuId,)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strQ, ())
            if dbrv:
                rt = dbrv[0][0]
            else:
                strErr = 'getDtuPrefixByDtuId Error :SELECT dbuser FROM dtuserver_prj WHERE id = %d return None ' % (dtuId,)
                print(strErr)
                logging.info(strErr)
                rt = None
        except Exception as e:
            strErr = 'getDtuPrefixByDtuId Error :' + e.__str__()
            app.logger.error(strErr)
            print(strErr)
            rt = None
        return rt

    def getDtuPrefixByDtuName(self,dtuName):
        rt = ''
        try:
            dbname = app.config.get('DATABASE')
            strQ = "SELECT dbuser FROM dtuserver_prj WHERE dtuname = '%s' " % (dtuName,)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strQ, ())
            if dbrv:
                rt = dbrv[0][0]
            else:
                strErr = 'getDtuPrefixByDtuName Error :SELECT dbuser FROM dtuserver_prj WHERE dtuname = %s return None ' % (dtuName,)
                print(strErr)
                logging.info(strErr)
                rt = None
        except Exception as e:
            strErr = 'getDtuPrefixByDtuName Error :' + e.__str__()
            app.logger.error(strErr)
            print(strErr)
            rt = None
        return rt

    def deleteDtuByDtuId(self,dtuId):
        rt = False
        try:
            dbname = app.config.get('DATABASE')
            sql = "delete from dtuserver_prj where id = %d " % (dtuId,)
            rt = self._mysqlDBContainer.op_db_update(dbname, sql, ())
            if rt == False:
                strErr = 'deleteDtuByDtuId Error : %s execute Failed! ' % (sql)
                logging.info(strErr)
                print(strErr)
        except Exception as e:
            strErr = 'deleteDtuByDtuId Error :' + e.__str__()
            app.logger.error(strErr)
            print(strErr)
        return rt


    # 更新DTU信息
    def modfiyDtuPrefixByDtuId(self, dtuId, prefix, equipName, dbpsw, serverCode):
        rt = False
        try:
            dbname = app.config.get('DATABASE')
            sql = "UPDATE dtuserver_prj SET dbuser = '%s', equipName = '%s', "\
                  "serverCode = '%s', dbpsw = '%s' WHERE id = %d " % (prefix, equipName, serverCode, dbpsw, dtuId)
            rt = self._mysqlDBContainer.op_db_update(dbname, sql,())
            if rt == False:
                strErr = 'replaceDtuPrefixByDtuId : %s execute Failed! ' % (sql)
                logging.info(strErr)
                print(strErr)
        except Exception as e:
            strErr = 'deleteDtuByDtuId Error :' + e.__str__()
            app.logger.error(strErr)
            print(strErr)
        return rt

    def getDbNmaeAndDtunameListByProId(self,projId):
        rt = None
        try:
            dbname = app.config.get('DATABASE')
            sql = "SELECT d.id,d.dtuname,d.dbname,d.dbuser,d.equipName,d.serverCode,d.dbpsw FROM  project p,dtuserver_prj d where p.mysqlname = d.dbname and d.serverCode in (3,4) and p.id = %d" % (int(projId))
            rt = self._mysqlDBContainer.op_db_query(dbname,sql, ())
            if not rt:
                strErr = 'getDbNmaeAndDtunameListByProId : %s execute Failed! ' % (sql)
                logging.info(strErr)
                print(strErr)
        except Exception as e:
            strErr = 'getDbNmaeAndDtunameListByProId Error :' + e.__str__()
            app.logger.error(strErr)
            print(strErr)
        return rt

    def getDtuNameByDtuId(self,dtuId):
        try:
            dtuId = dtuId if isinstance(dtuId, int) else int(dtuId)
            dbname = app.config.get('DATABASE')
            strQ = "SELECT dtuname FROM dtuserver_prj WHERE id = %d " % (dtuId,)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname,strQ, ())
            if dbrv:
                rt = dbrv[0][0]
            else:
                strErr = 'getDtuNameByDtuId Error :SELECT dbuser FROM dtuserver_prj WHERE id = %d return None ' % (dtuId,)
                print(strErr)
                logging.info(strErr)
                rt = None
        except Exception as e:
            strErr = 'getDtuNameByDtuId Error :' + e.__str__()
            app.logger.error(strErr)
            print(strErr)
            rt = None
        return rt

    def getDtuPwdByDtuId(self,dtuId):
        try:
            dtuId = dtuId if isinstance(dtuId, int) else int(dtuId)
            dbname = app.config.get('DATABASE')
            strQ = "SELECT dbpsw FROM dtuserver_prj WHERE id = %d " % (dtuId,)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname,strQ, ())
            if dbrv:
                rt = dbrv[0][0]
            else:
                strErr = 'getDtuNameByDtuId Error :SELECT dbuser FROM dtuserver_prj WHERE id = %d return None ' % (dtuId,)
                logging.error(strErr)
                rt = None
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
            rt = None
        return rt

    def getServerCodeByDtuId(self,dtuId):
        try:
            dtuId = dtuId if isinstance(dtuId, int) else int(dtuId)
            dbname = app.config.get('DATABASE')
            strQ = "SELECT serverCode FROM dtuserver_prj WHERE id = %d " % (dtuId,)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname,strQ, ())
            if dbrv:
                rt = dbrv[0][0]
            else:
                strErr = 'getServerCodeByDtuId Error :SELECT serverCode FROM dtuserver_prj WHERE id = %d return None ' % (dtuId,)
                logging.error(strErr)
                rt = None
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
            rt = None
        return rt

    def UpdateProjectLocateMap(self):
        try:
            dbname = app.config.get('DATABASE')
            strQInstance = 'SELECT m.mongo_server_id, m.internet_addr, m.internal_addr, m.writable, m.space_used, '\
                           'm.is_default, m.is_ssl, c.clusterName, c.id FROM mongo_instance AS m '\
                           'LEFT JOIN cluster_config as c ON m.cluster_id = c.id'
            dbrvInstance = self._mysqlDBContainerReadOnly.op_db_query(dbname, strQInstance, )
            mongo_Instance = {}
            for item in dbrvInstance:
                mongo_Instance[item[0]] = {'internet_addr': item[1], 'internal_addr': item[2], 'writable': item[3],
                                           'space_used': item[4], 'is_default': item[5], 'is_ssl': int(item[6]),
                                           'clusterName': item[7], 'cluster_id': item[8]}
            projectLocateMap = {'projectLocate': {}}
            strQ = 'select proj_id, mongo_server_id, start_time, end_time from locate_map order by proj_id, start_time'
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, strQ, )
            # 获取每个项目对应的信息
            addrSet = set()
            for item in dbrv:
                if not projectLocateMap['projectLocate'].get(item[0]):
                    projectLocateMap['projectLocate'][item[0]] = []
                projectLocateMap['projectLocate'][item[0]].append(
                    {'mongo_server_id': item[1], 'internet_addr': mongo_Instance[item[1]].get('internet_addr'),
                     'internal_addr': mongo_Instance[item[1]].get('internal_addr'),
                     'start_time': item[2], 'end_time': item[3]})

                if MongoConnManager.isLocalEnv():
                    addrSet.add((app.config['MONGO_SERVER_HOST'], 0))
                else:
                    # if app.config['USE_ALI_PUBLIC']:
                    if app.config.get('BEOPCLUSTER') != mongo_Instance[item[1]].get('clusterName'):
                        addrSet.add((mongo_Instance[item[1]].get('internet_addr'), mongo_Instance[item[1]].get('is_ssl')))
                    else:
                        addrSet.add((mongo_Instance[item[1]].get('internal_addr'), mongo_Instance[item[1]].get('is_ssl')))
            # 配置数据库放到地址列表

            if MongoConnManager.isLocalEnv():
                addrSet.add((app.config['MONGO_SERVER_HOST'], 0))
            else:
                # if app.config['USE_ALI_PUBLIC']:
                if app.config.get('BEOPCLUSTER') != 'aliyun_cn':
                    addrSet.add((app.config['INTERNET_CONFIG_ADDR'], 0))
                else:
                    addrSet.add((app.config['INTERNAL_CONFIG_ADDR'], 0))
            projectLocateMap['addrList'] = list(addrSet)
            projectLocateMap['mongoInstance'] = mongo_Instance
            RedisManager.set_project_locate_map(projectLocateMap)
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return RedisManager.get_project_locate_map()

    def getWeatherstationIds(self):
        rt = []
        try:
            dbname = app.config.get('DATABASE')
            sql = 'SELECT distinct weather_station_id FROM project'
            dbrvInstance = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, ())
            for item in dbrvInstance:
                id = item[0]
                if id == '' or id == None:
                    continue
                if ord('0') <= ord(id[0]) <= ord('9'):
                    continue
                rt.append(item[0])
        except Exception as e:
            print(e.__str__())
        return rt

    def getStatusOfDtuByProjId(self,projId):
        rt = {}
        try:
            dbName = app.config.get('DATABASE')
            sql = '''SELECT a.id,a.bSendData,b.online from dtuserver_prj a 
                        LEFT JOIN dtuserver_prj_info b on a.id = b.id 
                        where a.dbname =  (select mysqlname from project t where t.id = %s)
                     ''' % (projId,)
            dtuRt = self._mysqlDBContainer.op_db_query(dbName, sql, ())
            for item in dtuRt:
                isOnline = item[2]
                if isOnline == None:
                    isOnline = 'Offline'
                rt[str(item[0])] = {"isOnline":isOnline,"isRun":str(item[1])}
        except Exception as e:
            print(e.__str__())
        return rt

    def getStatusOfPointByDtuId(self,dtuId,pointNameList):
        rt = {}
        try:
            dbBase = app.config.get('DATABASE')
            dbName = self.getDbNameByDtu(dtuId)
            if dbName:
                sql = 'select pointname,pointvalue,time from rtdata_%s where pointname in (%s) '%(dbName,str(pointNameList).replace('[','').replace(']',''),)
                dtuRt = self._mysqlDBContainer.op_db_query(dbBase, sql, ())
                for item in dtuRt:
                    rt[str(item[0])] = {"value":item[1],"updateTime":str(item[2])}
        except Exception as e:
            print(e.__str__())
        return rt

    def getDbNameByDtu(self,dtuId):
        rt = None
        dtuName = None
        try:
            dbBase = app.config.get('DATABASE')
            sql = 'select dbname from  dtuserver_prj where id = %s'%(dtuId,)
            dtrt = self._mysqlDBContainer.op_db_query(dbBase, sql, ())
            for item in dtrt:
                rt = str(item[0])
        except Exception as e:
            print(e.__str__())
        return rt

    def getRTDataRealTimeAll(self, tableName, pointNameList):
        rt = {}
        try:
            pointStr = ""
            for index, pt in enumerate(pointNameList):
                pointStr += "'"
                pointStr += pt
                pointStr += "'"
                if index != len(pointNameList) - 1:
                    pointStr += ","
            dbname = app.config.get('DATABASE')
            sql = "select pointname, time, pointvalue, dtuname from %s where pointname in (%s)"%(tableName, pointStr)
            dbrv = self._mysqlDBContainerReadOnly.op_db_query(dbname, sql, ())
            for item in dbrv:
                rt[item[0]] = {'time':item[1].strftime('%Y-%m-%d %H:%M:%S'), 'value':item[2], 'dtuname':item[3]}
        except:
            pass
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

    def getDtuTableInfo(self,dtuname):
        rt = None
        try:
            dbBase = app.config.get('DATABASE')
            sql = 'select * from %s '% ('rtdata_beopdata_'+dtuname)
            rt = self._mysqlDBContainer.op_db_query(dbBase, sql, ())
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def getAllDtuForOnlineOffline(self,dtuname):
        rt = None
        try:
            dbBase = app.config.get('DATABASE')
            sql = "select * from dtuserver_on_offline where dtuname='%s'"%(dtuname)
            rt = self._mysqlDBContainer.op_db_query(dbBase, sql, ())
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def deleteRTtable(self, dtuname,flag=True):
        rt = False
        try:
            rtTableName = 'rtdata_beopdata_'+dtuname.lower()
            if flag:
                sql = "delete from %s"%(rtTableName,)
                rt = self._mysqlDBContainer.op_db_update(app.config.get('DATABASE'), sql, ())
            else:
                sql = "DROP TABLE IF EXISTS %s"%(rtTableName,)
                rt = self._mysqlDBContainer.op_db_update(app.config.get('DATABASE'), sql, ())
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt

    def deleteDtuserverOnOffline(self, dtuname):
        rt = False
        try:
            sql = "delete from  dtuserver_on_offline where dtuname=%s"%(dtuname,)
            rt = self._mysqlDBContainer.op_db_update(app.config.get('DATABASE'), sql, ())
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rt
