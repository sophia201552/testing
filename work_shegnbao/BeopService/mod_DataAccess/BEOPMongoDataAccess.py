﻿__author__ = 'David'

from mainService import app
import logging, pymongo
from datetime import datetime, timedelta
from bson.objectid import ObjectId
from bson import son
import traceback
import copy
import re
from mod_Common.Utils import Utils
from pymongo import UpdateOne
import math
import time
import calendar
from mod_DataAccess.RedisManager import RedisManager
from itertools import zip_longest
import ssl
from threading import Timer

# define table names
if app.config.get('DEV_ENVIRONMENT'):
    g_tableCustomNav = 'CustomNav_copy_Dev'
    g_tableCustomNavItem = 'CustomNavItem_copy_Dev'
    g_tableSpringLayout = 'SpringLayout_Dev'
    g_tableWeather = 'WeatherStation'
    g_tableWeatherData = 'WeatherStationData'
    g_tableDataSource = 'DataSource_Dev'
    g_tableWorkspace = 'WorkSpace_Dev'
    g_tableTemplate = 'Template_Dev'
    g_tableDataSourceGroup = 'DataSourceGroup_Dev'
    g_tableShareLog = 'ShareLog_Dev'
    g_tableOperationRecord = 'OperationRecord_Dev'
    g_tableBenchmark = 'Benchmark_Dev'
    g_tableWiki = 'Wiki_Dev'
else:
    g_tableCustomNav = 'CustomNav_copy'
    g_tableCustomNavItem = 'CustomNavItem_copy'
    g_tableSpringLayout = 'SpringLayout'
    g_tableWeather = 'WeatherStation'
    g_tableWeatherData = 'WeatherStationData'
    g_tableDataSource = 'DataSourceAdditional'
    g_tableWorkspace = 'WorkSpace'
    g_tableTemplate = 'Template'
    g_tableDataSourceGroup = 'DataSourceGroup'
    g_tableShareLog = 'ShareLog'
    g_tableOperationRecord = 'OperationRecord'
    g_tableBenchmark = 'Benchmark'
    g_tableWiki = 'Wiki'

g_tablePageMapping = 'PageTypeMapping'
g_tableRawFileFromDTU = 'DTURawData'
g_tableDTUOperation = 'DTUOperation'
g_tableModbusSourceAdditional = 'ModbusSourceAdditional'
g_tableModbusLog = 'ModbusDataLog'
g_tableDTUOrder = 'DTUOrder'


class VpointsHistoryDataMode:
    no_save = 'no_save'
    on_set = 'on_set'
    m1 = 'm1'
    m5 = 'm5'
    h1 = 'h1'
    M1 = 'M1'


timeFlag = datetime.strptime("2217-03-21 00:00:00", "%Y-%m-%d %H:%M:%S")
_leapMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
_NonLeapMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

def isLeap(nYear):
    return (nYear % 4 == 0 and nYear % 100 != 0) or (nYear % 400 == 0)

def getTimeNum(num, factor, type):
    if type == 'minute':
        for i in range(num, 60):
            if i % factor == 0:
                return i
    elif type == 'hour':
        for i in range(num, 24):
            if i % factor == 0:
                return i
    return -1

def getCountBySpan(timeFrom, timeTo, timeFormat):
    rt = 0
    try:
        timeFromObj = None
        timeToObj = None
        if isinstance(timeFrom, str):
            timeFromObj = datetime.strptime(timeFrom, '%Y-%m-%d %H:%M:%S')
        elif isinstance(timeFrom, datetime):
            timeFromObj = timeFrom
        if isinstance(timeTo, str):
            timeToObj = datetime.strptime(timeTo, '%Y-%m-%d %H:%M:%S')
        elif isinstance(timeTo, datetime):
            timeToObj = timeTo
        if timeFromObj and timeToObj:
            if timeFormat == 'm1':
                span = timeToObj - timeFromObj
                rt = (span.seconds // 60) + 1
            elif timeFormat == 'm5':
                while(True):
                    if timeFromObj.minute % 5 == 0:
                        break
                    timeFromObj += timedelta(minutes=1)
                while(True):
                    if timeToObj.minute % 5 == 0:
                        break
                    timeToObj -= timedelta(minutes=1)
                span = timeToObj - timeFromObj
                rt = (span.seconds // 300) + 1
    except Exception as e:
        app.logger.error('getCountByTimeSpan:' + e.__str__())
    return rt, timeFromObj, timeToObj


class BEOPMongoDataAccess:
    def __init__(self, addr, is_ssl=False, dbname='beopdata'):
        bOk = False
        logging.info("Connecting to MongoDB %s with is_ssl = %s and dbname = %s...", addr, is_ssl, dbname)
        try:
            if ':' in addr:
                addrArr = addr.split(':')
                bOk = False
                if len(addrArr) == 2:
                    self._st = None
                    self._et = None
                    hostAddr = str(addrArr[0])
                    port = int(addrArr[1])
                    self.mdbConnection = None
                    self._hostAddr = addr
                    self.mdbConnection = pymongo.MongoClient(
                        host=hostAddr, port=port, socketKeepAlive=True, maxPoolSize=300,
                        waitQueueTimeoutMS=20000, ssl=is_ssl, ssl_cert_reqs=ssl.CERT_NONE)
                    self.mdbBb = self.mdbConnection[dbname]
                    if not is_ssl:
                        bOk = self.mdbBb.authenticate('beopweb', 'RNB.beop-2013')
                    else:
                        bOk = self.mdbBb.authenticate(
                            'rnbtech',
                            'bGbRZxeHL9jsEM8xGgL0CrlsTGKOnSpnMlzn8QiGHEYIMxuiT2qgU94OLLGCQEzoNvkzeEsEapsyayJXBZR6QA==')
        except Exception:
            logging.error("Cannot connect to MongoDB %s with is_ssl = %s and dbname = %s!",
                          addr, is_ssl, dbname, exc_info=True, stack_info=True)

        if not bOk:
            logging.error("Cannot connect to MongoDB %s with is_ssl = %s and dbname = %s!", addr, is_ssl, dbname)
        else:
            logging.info("Successfully connected to %s with is_ssl = %s and dbname = %s", addr, is_ssl, dbname)

    def __del__(self):
        if self.mdbConnection is not None:
            self.mdbConnection.close()

    def getHostAddr(self):
        return self._hostAddr

    def setTimeAttrStart(self, st):
        self._st = st

    def setTimeAttrEnd(self, et):
        self._et = et

    def getTimeAttrStart(self):
        return self._st

    def getTimeAttrEnd(self):
        return self._et

    def getAllCollections(self):
        rt = []
        try:
            rt = self.mdbBb.collection_names()
        except Exception as e:
            print('getAllCollections failed' + e.__str__())
            app.logger.error('getAllCollections failed' + e.__str__())
        return rt

    def chunks(self, l, n):
        for i in range(0, len(l), n):
            yield l[i:i + n]

    def getHistoryDataByFormat(self, dbname, pointList, timeStart, timeEnd, timeFormat, bSearchNearest=False):
        if pointList is not None:
            pointList = list(set(pointList))
        startObject = datetime.strptime(timeStart, '%Y-%m-%d %H:%M:%S')
        endObject = datetime.strptime(timeEnd, '%Y-%m-%d %H:%M:%S')
        collectionName = 'm5' + '_data_' + dbname
        data = []
        point_list = []
        propDict = {}
        tl = []
        nTimeTypeBase = -1
        if isinstance(pointList, list):
            result_name_list = []
            for pn in pointList:
                if isinstance(pn, dict):
                    propDict.update(**pn)
                else:
                    point_list.append(pn)
            length = len(point_list)
            if length > 0:
                post = {}
                if timeFormat == 'm1':
                    post = {'pointname':{'$in':point_list},'time':{'$gte':startObject,'$lte':endObject},"value":{'$nin':[None, 'Null', 'None']}}
                else:
                    if timeFormat == 'h1':
                        nTimeTypeBase = 3
                        curTime = self.get_nearest_start_m5_obj(startObject)
                        while curTime <= endObject:
                            tl.append(curTime)
                            curTime += timedelta(hours=1)
                    elif timeFormat == 'd1':
                        nTimeTypeBase = 4
                        curTime = self.get_nearest_start_m5_obj(startObject)
                        while curTime <= endObject:
                            tl.append(curTime)
                            curTime += timedelta(days=1)
                    elif timeFormat == 'M1':
                        nTimeTypeBase = 5
                        start_m = startObject.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                        end_m = endObject.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                        t_cur = start_m
                        while t_cur <= end_m:
                            tl.append(t_cur)
                            range = calendar.monthrange(t_cur.year, t_cur.month)
                            t_cur += timedelta(days=range[1])
                    elif timeFormat == 'm5':
                        nTimeTypeBase = 2
                        curTime = self.get_nearest_start_m5_obj(startObject)
                        while curTime <= endObject:
                            tl.append(curTime)
                            curTime += timedelta(minutes=5)
                    if False: #startObject>= datetime(2016,12,15,0,0,0,0):
                        post = {'pointname': {'$in': point_list},
                            'time': {'$in': tl, '$gte': startObject, '$lte': endObject},
                            'value': {'$nin': [None, 'Null', 'None']}, 'tt': {'$gte': nTimeTypeBase}}
                    else:
                        post = {'pointname': {'$in': point_list},
                            'time': {'$in': tl, '$gte': startObject, '$lte': endObject},
                            'value': {'$nin': [None, 'Null', 'None']}}
                nameLast = ""
                temp = []
                try:
                    cursor = self.mdbBb[collectionName].find(post).sort([('pointname',pymongo.ASCENDING), ('time',pymongo.ASCENDING)])#pay attention to index
                    timeLast = None
                    for item in cursor.batch_size(1000):
                        findTime = item['time']
                        strfindTime = findTime.strftime('%Y-%m-%d %H:%M:%S')
                        findName = item['pointname']
                        if isinstance(findName, list):
                            if len(findName) == 1:
                                findName = findName[0]
                        findValue = item['value']
                        if findName != nameLast:
                            if len(temp) > 0:
                                data.append(dict(pointname=nameLast, record=temp))
                                timeLast = None
                                result_name_list.append(nameLast)
                                temp = []
                            nameLast = str(findName)
                        bNum = True
                        try:
                            valueConvertToFloat = float(findValue)
                        except Exception as e:
                            bNum = False
                        if timeLast != findTime:
                            if bNum:
                                temp.append(dict(time=findTime.strftime('%Y-%m-%d %H:%M:%S'), value=str(valueConvertToFloat)))
                            else:
                                temp.append(dict(time=findTime.strftime('%Y-%m-%d %H:%M:%S'), value=str(findValue)))
                            timeLast = findTime
                    if len(temp) > 0:
                        data.append(dict(pointname=nameLast, record=temp))
                        result_name_list.append(nameLast)
                except Exception as e:
                    print('getHistoryDataByFormat failed')
                    print(e.__str__())
                    logging.error(e.__str__())
                    logging.exception(e)
                finally:
                    if cursor is not None:
                        cursor.close()
            if bSearchNearest:
                if timeFormat == 'M1':
                    f_qs = startObject.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                    f_qe = endObject.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                    f_l = self.get_query_month_time_list(f_qs, f_qe)
                    for pt in pointList:
                        bFound = False
                        nIndex = 0
                        for f_item in data:
                            f_name = f_item.get('pointname')
                            if f_name==pt:
                                bFound = True
                                break
                            nIndex+=1
                        if not bFound:
                            #补全部时间
                            tDataRecord = []
                            for f_t_m in f_l:
                                v = self.get_nearest_data_from_table(dbname, f_t_m, pt, 60*24*5)
                                tDataRecord.append({'value': str(v), 'time':f_t_m})
                            data.append(dict(pointname=pt, record=tDataRecord))
                        else:
                            f_item = data[nIndex]
                            i_record = []
                            f_record = f_item.get('record', [])
                            if len(f_record) != len(f_l):
                                for f_t_m in f_l:
                                    r = self.get_record_by_time(f_record, f_t_m)
                                    v = r if r is not None else self.get_nearest_data_from_table(dbname, f_t_m, pt, 60*24*5)
                                    if v is not None:
                                        i_record.append({'value': str(v), 'time':f_t_m})
                                f_item['record'] = i_record
                elif timeFormat == 'd1':
                    f_qs = startObject
                    f_qe = endObject
                    f_l = self.get_query_day_time_list(f_qs, f_qe)
                    for pt in pointList:
                        bFound = False
                        nIndex = 0
                        for f_item in data:
                            f_name = f_item.get('pointname')
                            if f_name==pt:
                                bFound = True
                                break
                            nIndex+=1
                        if not bFound:
                            #补全部时间
                            tDataRecord = []
                            for f_t_m in f_l:
                                v = self.get_nearest_data_from_table(dbname, f_t_m, pt, 60*24*2)
                                tDataRecord.append({'value': str(v), 'time':f_t_m})
                            data.append(dict(pointname=pt, record=tDataRecord))
                        else:
                            f_item = data[nIndex]
                            i_record = []
                            f_record = f_item.get('record', [])
                            if len(f_record) != len(f_l):
                                for f_t_m in f_l:
                                    r = self.get_record_by_time(f_record, f_t_m)
                                    v = r if r is not None else self.get_nearest_data_from_table(dbname, f_t_m, pt, 60*24*2)
                                    if v is not None:
                                        i_record.append({'value': str(v), 'time':f_t_m})
                                f_item['record'] = i_record
                elif timeFormat == 'h1':
                    f_qs = startObject
                    f_qe = endObject
                    f_l = self.get_query_hour_time_list(f_qs, f_qe)
                    for pt in pointList:
                        bFound = False
                        nIndex = 0
                        for f_item in data:
                            f_name = f_item.get('pointname')
                            if f_name == pt:
                                bFound = True
                                break
                            nIndex += 1
                        if not bFound:
                            # 补全部时间
                            tDataRecord = []
                            for f_t_m in f_l:
                                v = self.get_nearest_data_from_table(dbname, f_t_m, pt, 60*24*2)
                                tDataRecord.append({'value': str(v), 'time': f_t_m})
                            data.append(dict(pointname=pt, record=tDataRecord))
                        else:
                            f_item = data[nIndex]
                            i_record = []
                            f_record = f_item.get('record', [])
                            if len(f_record) != len(f_l):
                                for f_t_m in f_l:
                                    r = self.get_record_by_time(f_record, f_t_m)
                                    v = r if r is not None else self.get_nearest_data_from_table(dbname, f_t_m, pt, 60*24*2)
                                    if v is not None:
                                        i_record.append({'value': str(v), 'time': f_t_m})
                                f_item['record'] = i_record
                elif timeFormat == 'm5':
                    f_qs = startObject
                    f_qe = endObject
                    f_l = self.get_query_m5_time_list(f_qs, f_qe)
                    for pt in pointList:
                        bFound = False
                        nIndex = 0
                        for f_item in data:
                            f_name = f_item.get('pointname')
                            if f_name == pt:
                                bFound = True
                                break
                            nIndex += 1
                        if not bFound:
                            # 补全部时间
                            tDataRecord = []
                            for f_t_m in f_l:
                                v = self.get_nearest_data_from_table(dbname, f_t_m, pt, 60*24*2)
                                tDataRecord.append({'value': str(v), 'time': f_t_m})
                            data.append(dict(pointname=pt, record=tDataRecord))
                        else:
                            f_item = data[nIndex]
                            i_record = []
                            f_record = f_item.get('record', [])
                            if len(f_record) != len(f_l):
                                for f_t_m in f_l:
                                    r = self.get_record_by_time(f_record, f_t_m)
                                    v = r if r is not None else self.get_nearest_data_from_table(dbname, f_t_m, pt, 60*24*2)
                                    if v is not None:
                                        i_record.append({'value': str(v), 'time': f_t_m})
                                f_item['record'] = i_record
            for key in propDict:
                temp_record = []
                for index, item in enumerate(data):
                    if item.get('pointname') == key:
                        temp_record = item.get('record')
                        data.pop(index)
                        break
                prop_list = propDict.get(key)
                for prop in prop_list:
                    prop_record = []
                    for r in temp_record:
                        t = r.get('time')
                        v = None
                        str_v = r.get('value')
                        if prop in str_v:
                            v_r = eval(str_v)
                            v = v_r.get(prop) if v_r else None
                        prop_record.append({'time':t, 'value':v})
                    data.append({'pointname':'%s.%s'%(key, prop), 'record':prop_record})
        return data

    def get_nearest_start_m5_obj(self, tmObj):
        rt = None
        try:
            curTime = tmObj
            while True:
                if curTime.minute % 5 == 0:
                    rt = curTime
                    break
                curTime += timedelta(minutes=1)
        except Exception as e:
            print('get_nearest_start_m5_obj failed')
            print(e.__str__())
        return rt

    def get_time_limit_from_table(self, pointname, dbname, format):
        st = None
        et = None
        try:
            collectionName = '%s_data_' % (format,) + dbname
            st_r = self.mdbBb[collectionName].find_one({'pointname':pointname}, sort=[('time', pymongo.ASCENDING)])
            if st_r:
                st = st_r.get('time')
            et_r = self.mdbBb[collectionName].find_one({'pointname':pointname}, sort=[('time', pymongo.DESCENDING)])
            if et_r:
                et = et_r.get('time')
        except Exception as e:
            print('get_time_limit_from_table failed')
            print(e.__str__())
        return (st, et)

    def get_record_by_time(self, record, strtime):
        try:
            for item in record:
                if item.get('time') == strtime:
                    return item.get('value')
        except Exception as e:
            return None
        return None

    def get_query_month_time_list(self, start, end):
        rt = []
        try:
            cur = start
            while(cur <= end):
                bleap = isLeap(cur.year)
                rt.append(cur.strftime('%Y-%m-%d %H:%M:%S'))
                cur += timedelta(days=_leapMonth[cur.month - 1] if bleap else _NonLeapMonth[cur.month - 1])
        except Exception as e:
            print('get_query_month_time_list failed')
            print(e.__str__())
        return rt

    def get_query_day_time_list(self, start, end):
        rt = []
        try:
            cur = start
            while(cur <= end):
                rt.append(cur.strftime('%Y-%m-%d %H:%M:%S'))
                cur += timedelta(days=1)
        except Exception as e:
            print('get_query_day_time_list failed')
            print(e.__str__())
        return rt

    def get_query_hour_time_list(self, start, end):
        rt = []
        try:
            cur = start
            while(cur <= end):
                rt.append(cur.strftime('%Y-%m-%d %H:%M:%S'))
                cur += timedelta(hours=1)
        except Exception as e:
            print('get_query_hour_time_list failed')
            print(e.__str__())
        return rt

    def get_query_m5_time_list(self, start, end):
        rt = []
        try:
            cur = start
            while(cur <= end):
                rt.append(cur.strftime('%Y-%m-%d %H:%M:%S'))
                cur += timedelta(minutes=5)
        except Exception as e:
            print('get_query_day_time_list failed')
            print(e.__str__())
        return rt

    def get_query_day_start(self, timeobj):
        rt = None
        try:
            rt = datetime(year=timeobj.year, month=timeobj.month, day=timeobj.day)
        except Exception as e:
            print('get_query_day_start failed')
            print(e.__str__())
        return rt

    def get_query_day_end(self, timeobj):
        rt = None
        try:
            rt = datetime(year=timeobj.year, month=timeobj.month, day=timeobj.day)
        except Exception as e:
            print('get_query_day_end failed')
            print(e.__str__())
        return rt

    def get_query_month_end(self, timeobj):
        rt = None
        try:
            rt = datetime(year=timeobj.year, month=timeobj.month, day=1)
        except Exception as e:
            print('get_query_month_end failed')
            print(e.__str__())
        return rt

    def get_query_month_start(self, timeobj):
        rt = None
        try:
            rt = datetime(year=timeobj.year, month=timeobj.month, day=1)
        except Exception as e:
            print('get_query_month_start failed')
            print(e.__str__())
        return rt

    def get_nearest_data_from_table(self, _dbname, _time, _point_name, tDistanceMinutesLimit):
        rt = None
        try:
            collectionName = 'm5_data_' + _dbname
            timeEnd = datetime.strptime(_time, "%Y-%m-%d %H:%M:%S") if isinstance(_time, str) else _time
            timeStart = timeEnd - timedelta(minutes=tDistanceMinutesLimit)
            ret = self.mdbBb[collectionName].find_one({'pointname':_point_name, 'time':{'$lte':timeEnd, '$gte': timeStart}, "value":{'$nin':[None, 'Null', 'None']}}, sort=[('time', pymongo.DESCENDING)])
            rt = ret.get('value') if ret else None
        except Exception as e:
            print('get_nearest_data_from_table failed')
            print(e.__str__())
        return rt

    def saveHistoryData(self, projId, pointName, pointValue, pointTime, dbNameMongo):
        result = False
        data, v2Data = self.filterData(projId, [(pointTime, pointName, pointValue)])
        if v2Data:
            self.saveHistoryData_v2(v2Data, dbNameMongo)
            result = True
        if data:
            if len(pointName) > 0 and isinstance(pointTime, datetime):
                try:
                    nTimeType = Utils.getTimeType(pointTime)
                    self.mdbBb[dbNameMongo].update_many({'time':pointTime, 'pointname':pointName}, {'$set':{'time':pointTime, 'pointname':pointName, 'value':pointValue, 'tt':nTimeType}}, True)
                    result = True
                except Exception as e:
                    print('saveHistoryData error:' + e.__str__())
                    app.logger.error('saveHistoryData error:' + e.__str__())
        return result


    def saveHistoryData_v2(self, dataList, dbNameMongo):
        return self.updateHistoryDataMultiEx(dataList, dbNameMongo)


    def upsertHistoryDataMul(self, projId, dataList, dbNameMongo):
        result = False
        dataList, v2Data = self.filterData(projId, dataList)
        if v2Data:
            self.updateHistoryDataMultiEx(v2Data, dbNameMongo)
            result = True
        if dataList:
            try:
                for item in dataList:
                    pointName = item[1]
                    pointValue = item[2]
                    pointTime = datetime.strptime(item[0], '%Y-%m-%d %H:%M:%S')
                    if len(pointName) > 0 and isinstance(pointTime, datetime):
                        nTimeType = Utils.getTimeType(pointTime)
                        self.mdbBb[dbNameMongo].update_many({'time':pointTime, 'pointname':pointName}, {'$set':{'time':pointTime, 'pointname':pointName, 'value':pointValue, 'updateDBTime': datetime.now(), 'tt':nTimeType}}, True)
                        result = True
            except Exception as e:
                print('upsertHistoryDataMul error:' + e.__str__())
                app.logger.error('upsertHistoryDataMul error:' + e.__str__())
        return result

    def InsertTableData_v2(self, data, mongoDBTableName):
        return self.updateHistoryDataMultiEx(data, mongoDBTableName)


    def filterData(self, projId, dataList):
        v2_time = self.get_v2_struct_seperate_time(projId)
        oldData, v2Data = [], []
        if v2_time:
            v2_time = datetime.strptime(v2_time, "%Y-%m-%d %H:%M:%S") if isinstance(v2_time, str) else v2_time
        else:
            return dataList, []
        for d in dataList:
            t = datetime.strptime(d[0], "%Y-%m-%d %H:%M:%S") if isinstance(d[0], str) else d[0]
            if t >= v2_time:
                v2Data.append(d)
            else:
                oldData.append(d)
        return oldData, v2Data

    def InsertTableData(self, projId, data, mongoDBTableName):
        total = 0
        data, v2Data = self.filterData(projId, data)
        if v2Data:
           total += self.InsertTableData_v2(v2Data, mongoDBTableName)
        try:
            rt = []
            constMaxRowsPerOperation = 30000
            length = len(data)
            table = self.mdbBb[mongoDBTableName]
            if length > 0:
                block = length // constMaxRowsPerOperation
                for count in range(block + 1):
                    postList = []
                    for index in range(count * constMaxRowsPerOperation, (count + 1) * constMaxRowsPerOperation):
                        if index >= length:
                            break
                        if len(data[index]) == 3:
                            bNumber = True
                            try:
                                convert = float(data[index][2])
                            except Exception as e:
                                bNumber = False

                            tTime = datetime.strptime(data[index][0], '%Y-%m-%d %H:%M:%S')
                            nTimeType = Utils.getTimeType(tTime)
                            if bNumber:
                                postList.append(son.SON(data={'time':tTime, 'pointname':data[index][1], 'value':convert, 'tt':nTimeType}))
                            else:
                                postList.append(son.SON(data={'time':tTime, 'pointname':data[index][1], 'value':data[index][2], 'tt':nTimeType}))
                        else:
                            app.logger.error('data format is invalid')
                    if len(postList) > 0:
                        b_i = datetime.now()
                        rt = table.insert(postList)
                        a_i = datetime.now()
                        total += len(rt)
                        # print('insert into mongo_collection %s,num is %s,span is %s seconds'%(mongoDBTableName, len(rt), str((a_i-b_i).total_seconds())))
                        # logging.info('insert into mongo_collection %s,num is %s,span is %s seconds'%(mongoDBTableName, len(rt), str((a_i-b_i).total_seconds())))
                        table.create_index([('time', pymongo.ASCENDING), ('pointname', pymongo.ASCENDING)])
        except Exception as e:
            print('InsertTableData failed batch_size=30000:' + e.__str__())
            app.logger.error('InsertTableData failed batch_size=30000:' + e.__str__())
        return total

    def UpdateTableData(self, projId, data, mongoDBTableName):
        rt = True
        try:
            constMaxRowsPerOperation = 30000
            length = len(data)
            table = self.mdbBb[mongoDBTableName]
            if length > 0:
                block = length // constMaxRowsPerOperation
                for count in range(block + 1):
                    postList = []
                    for index in range(count * constMaxRowsPerOperation, (count + 1) * constMaxRowsPerOperation):
                        if index >= length:
                            break
                        if len(data[index]) == 3:
                            bNumber = True
                            try:
                                convert = float(data[index][2])
                            except Exception as e:
                                bNumber = False
                            if bNumber:
                                postList.append([data[index][0], data[index][1], convert])
                            else:
                                postList.append([data[index][0], data[index][1], data[index][2]])
                        else:
                            app.logger.error('data format is invalid')
                    if len(postList) > 0:
                        self.upsertHistoryDataMul(projId, postList, mongoDBTableName)
                        table.create_index([('time', pymongo.ASCENDING), ('pointname', pymongo.ASCENDING)])
        except Exception as e:
            print('InsertTableData failed batch_size=30000:' + e.__str__())
            app.logger.error('InsertTableData failed batch_size=30000:' + e.__str__())
            rt = False
        return rt


    def GetAllHisCollections(self):
        collections = []
        try:
            temp = self.mdbBb.collection_names(False)
            for item in temp:
                collections.append(item)
        except Exception as e:
            strErr = "GetAllHisCollections error:%s" % (e.__str__(),)
            print(strErr)
            app.logger.error(strErr)
        return collections

    def getDataSourceItemInfoById(self, itemId):
        rt = {}
        if isinstance(itemId, str):
            if  itemId.startswith('tempvar'):
                itemId = itemId[len('tempvar'):]
            try:
                if ObjectId.is_valid(itemId):
                    rt = self.mdbBb[g_tableDataSource].find_one({'_id':ObjectId(itemId)})
            except Exception as e:
                print('getListContentByIdAndProjId failed')
                print(e.__str__())
                app.logger.error(e.__str__())
                logging.exception(e)
        return rt

    def deletePoints(self, collectionname, ptList, startTime, endTime):
        rt = False
        try:
            sto = datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S')
            eto = datetime.strptime(endTime, '%Y-%m-%d %H:%M:%S')
            self.mdbBb[collectionname].remove({'time':{'$gte':sto, '$lte':eto}, 'pointname':{'$in':ptList}})
            rt = True
        except Exception as e:
            print('deletePoints failed')
            print(e.__str__())
            app.logger.error(e.__str__())
            logging.exception(e)
        return rt

    def deleteOnePoint(self, collectionname, pointName):
        rt = False
        try:
            endObject = datetime.now()
            startObject = endObject - timedelta(days=7)
            self.mdbBb[collectionname].remove({'pointname':pointName, 'time':{'$gte':startObject, '$lte':endObject}})
            rt = True
        except Exception as e:
            print('deleteOnePoint failed')
            print(e.__str__())
            app.logger.error(e.__str__())
            logging.exception(e)
        return rt

    def saveRawData(self, dtuname, rawtime, rawdata):
        rt = False
        try:
            timeObj = None
            if isinstance(rawtime, str):
                timeObj = datetime.strptime(rawtime, '%Y-%m-%d %H:%M:%S')
            elif isinstance(rawtime, datetime):
                timeObj = rawtime
            if timeObj:
                self.mdbBb[g_tableRawFileFromDTU].save({'_id':timeObj, 'dtuname':dtuname, 'data':rawdata})
                self.mdbBb[g_tableRawFileFromDTU].create_index([('_id', pymongo.ASCENDING), ('dtuname', pymongo.ASCENDING)])
                rt = True
        except Exception as e:
            app.logger.error('saveRawData error:' + e.__str__())
        return rt

    def getLostList(self, dtuname, timeFrom, timeTo):
        timeFromObj = None
        timeToObj = None
        rt = []
        if isinstance(timeFrom, str):
            timeFromObj = datetime.strptime(timeFrom, '%Y-%m-%d %H:%M:%S')
        elif isinstance(timeFrom, datetime):
            timeFromObj = timeFrom
        if isinstance(timeTo, str):
            timeToObj = datetime.strptime(timeTo, '%Y-%m-%d %H:%M:%S')
        elif isinstance(timeTo, datetime):
            timeToObj = timeTo
        m5Count, m5FromObj, m5ToObj = getCountBySpan(timeFrom, timeTo, 'm5')
        cursor = None
        try:
            cursor = self.mdbBb[g_tableRawFileFromDTU].find({'_id':{'$gte':timeFromObj, '$lte':timeToObj}, 'dtuname':dtuname},
                                                            {'dtuname':0, 'data':0}).sort([('_id', pymongo.ASCENDING)])
            count = cursor.count()
            if count < m5Count:
                cursor_set = set()
                for item in cursor:
                    tmobj = item.get('_id')
                    if tmobj.minute % 5 == 0:
                        cursor_set.add(tmobj.strftime('%Y-%m-%d %H:%M:%S'))
                original_set = set()
                for index in range(m5Count):
                    tmobj = m5FromObj + timedelta(minutes=5 * index)
                    original_set.add(tmobj.strftime('%Y-%m-%d %H:%M:%S'))
                rt = list(original_set - cursor_set)
        except Exception as e:
            app.logger.error('getLostList:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    def insert_dtuOrder(self, dtuname, time, cmdType, content, cmdId, mode):
        try:
            self.mdbBb[g_tableDTUOrder].create_index([('cmdId', pymongo.ASCENDING)])
            return self.mdbBb[g_tableDTUOrder].insert_one(
                {"mode": mode, "cmdId": cmdId, 'time': time, 'cmdType': cmdType, 'content': content, 'dtuname': dtuname})
        except Exception as e:
            print('insert_dtuOrder error:' + e.__str__())
            app.logger.error('insert_dtuOrder error:' + e.__str__())
            return False

    def insert_dtulog(self, userName, dtuName, Operation, type=0, ack=''):
        rt = False
        try:
            dbrv = self.mdbBb[g_tableDTUOperation].insert_one({'_id':ObjectId(), 'userName':userName, 'DTUName':dtuName,
                                                               'Operation':Operation, 'updateTime':datetime.now(),
                                                               'type':int(type), 'ack':ack})
            rt = True
        except Exception as e:
            print('insert_dtulog error:' + e.__str__())
            app.logger.error('insert_dtulog error:' + e.__str__())
        return rt

    def get_dtulog_by_time(self, dtuName, startTime, endTime):
        rt = []
        cursor = None
        try:
            startTime = datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S')
            endTime = datetime.strptime(endTime, '%Y-%m-%d %H:%M:%S')
            if dtuName is None:
                cursor = self.mdbBb[g_tableDTUOperation].find({'updateTime':{'$lte':startTime, '$gte':endTime}}, sort=[('updateTime', -1)])
            else:
                cursor = self.mdbBb[g_tableDTUOperation].find({'updateTime':{'$lte':startTime, '$gte':endTime}, 'DTUName':dtuName}, sort=[('updateTime', -1)])
            for item in cursor:
                try:
                    rt.append({'_id':item.get('_id').__str__(), 'userName':item.get('userName'), 'DTUName':item.get('DTUName'),
                               'Operation':item.get('Operation'), 'updateTime':item.get('updateTime').strftime('%Y-%m-%d %H:%M:%S')})
                except Exception as e:
                    print('get_dtulog_by_time error:' + e.__str__())
                    app.logger.error('get_dtulog_by_time error:' + e.__str__())
        except Exception as e:
            print('get_dtulog_by_time error:' + e.__str__())
            app.logger.error('get_dtulog_by_time error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    def get_dtulog_by_limit(self, dtuName, limit):
        rt = []
        cursor = None
        try:
            limit = int(limit)
            cursor = self.mdbBb[g_tableDTUOperation].find({'DTUName':dtuName}, sort=[('updateTime', -1)], limit=limit)
            for item in cursor:
                try:
                    rt.append({'_id':item.get('_id').__str__(), 'userName':item.get('userName'), 'DTUName':item.get('DTUName'),
                               'Operation':item.get('Operation'), 'updateTime':item.get('updateTime').strftime('%Y-%m-%d %H:%M:%S')})
                except Exception as e:
                    print('get_dtulog_by_limit error:' + e.__str__())
                    app.logger.error('get_dtulog_by_limit error:' + e.__str__())
        except Exception as e:
            print('get_dtulog_by_limit error:' + e.__str__())
            app.logger.error('get_dtulog_by_limit error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt


    def getFaultRealtimeData(self, projId, moduleName):
        rt = []
        cursor = None
        try:
            collection_name = "fault_data_{0}".format(projId)
            now_time = datetime.now()
            matchCondition = {}
            if moduleName is None:
                matchCondition = {'time':{'$gte':now_time - timedelta(days=7), '$lte':now_time}}
            else:
                matchCondition = {'time':{'$gte':now_time - timedelta(days=7), '$lte':now_time}, 'name':moduleName}
            cursor = self.mdbBb[collection_name].aggregate(
                [{'$match': matchCondition},
                 {'$sort':{'name':pymongo.ASCENDING, 'time':pymongo.DESCENDING}},
                 {'$group':{'_id':"$name",
                            'time':{'$first':"$time"},
                            'mTime':{'$first':'$mTime'},
                            'grade':{'$first':'$grade'},
                            'value':{'$first':'$value'},
                            'energy':{'$first':'$energy'},
                            'bindPoints':{'$first':'$bindPoints'},
                            'suggestion':{'$first':'$suggestion'},
                            'problem':{'$first':'$problem'},
                            'affect':{'$first':'$affect'},
                            'analysis':{'$first':'$analysis'}}
                  }
                ], allowDiskUse=True)
            for item in cursor:
                item.update({'time':item.get('time').strftime('%Y-%m-%d %H:%M:%S'),
                             'mTime':item.get('mTime').strftime('%Y-%m-%d %H:%M:%S')})
                rt.append(item)
        except Exception as e:
            print('getFaultRealtimeData error:' + e.__str__())
            app.logger.error('getFaultRealtimeData error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    def getFaultHistoryData(self, projId, strTimeFrom, strTimeTo):
        rt = []
        cursor = None
        try:
            collection_name = "fault_data_{0}".format(projId)
            startObj = datetime.strptime(strTimeFrom, '%Y-%m-%d %H:%M:%S')
            endObj = datetime.strptime(strTimeTo, '%Y-%m-%d %H:%M:%S')
            cursor = self.mdbBb[collection_name].aggregate(
                [{'$match':{'time':{'$gte':startObj, '$lte':endObj}}},
                 {'$project':{'name':1, 'time':1, 'value':1, 'problem':1, 'grade':1}},
                 {'$sort':{'name':pymongo.ASCENDING, 'time':pymongo.DESCENDING}},
                 {'$group':{'_id':"$name", 'statistics':{'$push':{'time':'$time', 'value':'$value', 'problem':'$problem', 'grade':'$grade'}}}}
                ])
            for item in cursor:
                s_l = []
                o = {'_id':item.get('_id'), 'problem':None, 'grade':None, 'statistics':s_l}
                l = item.get('statistics', [])
                temp_l = {}
                for i in l:
                    v = i.get('value')
                    t = i.get('time')
                    g = i.get('grade')
                    p = i.get('problem')
                    if v == 1:
                        if o['problem'] == None:
                            o.update({'problem':p})
                        if o['grade'] == None:
                            o.update({'grade':g})
                        if not temp_l:
                            temp_l.update({'to':t.strftime('%Y-%m-%d %H:%M:%S')})
                        else:
                            temp_l.update({'from':t.strftime('%Y-%m-%d %H:%M:%S'), 'problem':p, 'grade':g})
                    elif v == 0:
                        if temp_l:
                            s_l.append(copy.deepcopy(temp_l))
                            temp_l.clear()
                if temp_l:
                    s_l.append(temp_l)
                if s_l:
                    rt.append(o)
        except Exception as e:
            print('getFaultHistoryData error:' + e.__str__())
            app.logger.error('getFaultHistoryData error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    def getCloudPointSiteType(self, projId):
        rt = {}
        try:
            query = {'projId': projId, 'type': 4}
            query['params.flag'] = 0
            query_order = [('_id', -1)]
            cursor = self.mdbBb[g_tableDataSource].find(query, projection={'groupId': False, 'type': False}, sort=query_order)
            result = []
            failedPoints = []
            for item in cursor:
                ptCloudName = item.get('value')
                logging.debug('Checking ptCloudName: %s', ptCloudName)
                if ptCloudName is None or len(ptCloudName) == 0:
                    logging.debug('ptCloudName is empty. Ignore!')
                    continue
                if item.get('params') is None:
                    logging.debug('params is None. Ignore!')
                    continue
                if item.get('params').get('mapping') is None:
                    logging.debug('params.mapping is None. Ignore!')
                    continue
                siteName = item.get('params').get('mapping').get('point')
                logging.debug('siteName = %s', siteName)
                if siteName is None or len(siteName) == 0:
                    logging.debug('params.mapping.point is None. Ignore!')
                    continue

                if not re.match('^[_\-0-9a-zA-Z]+$', ptCloudName):
                    logging.debug('ptCloudName is not valid!')
                    failedPoints.append(ptCloudName)
                elif ptCloudName != siteName:
                    logging.debug('ptCloudName does not equal to siteName. Add to site point map!')
                    rt[ptCloudName] = siteName
                else:
                    logging.debug('ptCloudName equals to siteName. Ignore!')
            if len(failedPoints) > 0:
                logging.error('Failed to get cloud point site type for project %s: %s', projId, failedPoints)
        except Exception:
            logging.error('Failed to get cloud point site type for project %s!', projId, exc_info=True, stack_info=True)
        return rt

    def diagnosisGetModuleNameById(self, id):
        rt = None
        try:
            ret = self.mdbBb['cloudDiagnosis'].find_one({'_id':ObjectId(id)})
            if ret:
                rt = ret.get('moduleName')
        except Exception as e:
            print('diagnosisGetModuleNameById' + e.__str__())
            app.logger.error('diagnosisGetModuleNameById' + e.__str__())
        return rt


    def updateHistoryDataMultiEx(self, dataList, dbNameMongo):
        dbName = dbNameMongo
        if dbName.startswith('m5_data') or dbName.startswith('m1_data') or \
                dbName.startswith('h1_data') or dbName.startswith('d1_data'):
            dbName = 'v2_data_' + dbName.split('_data_')[-1]
        nUpdateSrcLen = len(dataList)
        if nUpdateSrcLen <= 0:
            return 0
        try:
            constMaxRowsPerOperation = 30000
            length = len(dataList)
            if length > 0:
                block = length // constMaxRowsPerOperation
                for count in range(block + 1):
                    arrReq = []
                    for index in range(count * constMaxRowsPerOperation, (count + 1) * constMaxRowsPerOperation):
                        if index >= length:
                            break
                        pointTime = datetime.strptime(dataList[index][0], '%Y-%m-%d %H:%M:%S') if isinstance(dataList[index][0], str) else dataList[index][0]
                        tmDate = pointTime.replace(hour=0, minute=0, second=0, microsecond=0)
                        hour = str(pointTime.hour)
                        min = str(pointTime.minute)
                        pointName = dataList[index][1]
                        pointValue = dataList[index][2]
                        if len(str(pointValue)) > 10000:
                            continue
                        arrReq.append(UpdateOne({'pointname': pointName, 'time': tmDate},
                                                {'$set': {'value.' + hour + '.' + min: pointValue}}, True))
                    if arrReq:
                        tStart = time.time()
                        self.mdbBb[dbName].bulk_write(arrReq)
                        tCost = time.time() - tStart
                        if tCost > 20:
                            print('====bulk_write %s group %d cost :%.1f' % (dbName, count, tCost))
                        self.mdbBb[dbName].create_index([('time', pymongo.ASCENDING), ('pointname', pymongo.ASCENDING)])
        except Exception as e:
            nUpdateSrcLen = 0
            print('updateHistoryDataMultiEx error:' + e.__str__())
            app.logger.error('updateHistoryDataMultiEx error:' + e.__str__())
        return nUpdateSrcLen

    def getHistoryDataByFormat_v2(self, dbname, pointList, timeStart, timeEnd, timeFormat, bSearchNearest=False, noSearchBeforeStartTime=None):
        startObject = datetime.strptime(timeStart, '%Y-%m-%d %H:%M:%S')
        endObject = datetime.strptime(timeEnd, '%Y-%m-%d %H:%M:%S')
        if not noSearchBeforeStartTime:
            fixSpan = timedelta(days=5) if timeFormat == 'M1' else timedelta(days=2)
            dayStartQueryObject = startObject.replace(hour=0, minute=0, second=0, microsecond=0) - fixSpan
        else:
            dayStartQueryObject = startObject.replace(hour=0, minute=0, second=0, microsecond=0)
        dayEndQueryObject = endObject.replace(hour=0, minute=0, second=0, microsecond=0)

        collectionName = 'v2_data_' + dbname
        data = []
        point_list = []
        propDict = {}
        if isinstance(pointList, list):
            for pn in pointList:
                if isinstance(pn, dict):propDict.update(**pn)
                else:point_list.append(pn)
            length = len(point_list)
            if length > 0:
                try:
                    self.getHisDataFromDB(collectionName, timeFormat, dayStartQueryObject, dayEndQueryObject, startObject,
                                     endObject, point_list, data, bSearchNearest)
                except Exception as e:
                    app.logger.error("Failed to get history data from DB!", exc_info=True, stack_info=True)
            for key in propDict:
                temp_record = []
                for index, item in enumerate(data):
                    if item.get('pointname') == key:
                        temp_record = item.get('record')
                        data.pop(index)
                        break
                prop_list = propDict.get(key)
                for prop in prop_list:
                    prop_record = []
                    for r in temp_record:
                        t = r.get('time')
                        v = None
                        str_v = r.get('value')
                        if prop in str_v:
                            v_r = eval(str_v)
                            v = v_r.get(prop) if v_r else None
                        prop_record.append({'time':t, 'value':v})
                    data.append({'pointname':'%s.%s' % (key, prop), 'record':prop_record})
        return data

    def getTimeListByFormat(self, timeFormat, startObject, endObject, tl):
        if timeFormat in ['m1', 'm5', 'h1', 'd1', 'M1']:
            if timeFormat == 'm1':
                curTime = startObject
                while curTime <= endObject:
                    tl.append(curTime)
                    curTime += timedelta(minutes=1)
            elif timeFormat == 'm5':
                curTime = self.get_nearest_start_m5_obj(startObject)
                while curTime <= endObject:
                    tl.append(curTime)
                    curTime += timedelta(minutes=5)
            elif timeFormat == 'h1':
                curTime = self.get_nearest_start_m5_obj(startObject)
                while curTime <= endObject:
                    tl.append(curTime)
                    curTime += timedelta(hours=1)
            elif timeFormat == 'd1':
                curTime = self.get_nearest_start_m5_obj(startObject)
                while curTime <= endObject:
                    tl.append(curTime)
                    curTime += timedelta(days=1)
            elif timeFormat == 'M1':
                start_m = startObject.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                end_m = endObject.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                t_cur = start_m
                while t_cur <= end_m:
                    tl.append(t_cur)
                    range = calendar.monthrange(t_cur.year, t_cur.month)
                    t_cur += timedelta(days=range[1])

    def getHisDataFromDB(self, collectionName, timeFormat, dayStartQueryObject, dayEndQueryObject, startObject, endObject, point_list, data, bSearchNearest=False):
        try:
            point_list = list(set(point_list))
            timeDict = {}
            tl = []
            self.getTimeListByFormat(timeFormat, startObject, endObject, tl)
            for tl_item in tl:
                year_month_day = tl_item.strftime('%Y-%m-%d')
                h = tl_item.hour
                m = tl_item.minute
                if year_month_day not in timeDict:
                    timeDict[year_month_day] = {}
                if h not in timeDict[year_month_day]:
                    timeDict[year_month_day][h] = []
                if m not in timeDict[year_month_day][h]:
                    timeDict[year_month_day][h].append(m)
            for pts in self.chunks(point_list, 300):
                if timeFormat != 'M1':
                    query = {'time': {'$gte': dayStartQueryObject, '$lte': dayEndQueryObject}, 'pointname': {'$in': pts}}
                else:
                    query = {'time': {'$in': tl}, 'pointname': {'$in': pts}}
                cursor = self.mdbBb[collectionName].find(query, {'time': 1, 'pointname': 1, 'value': 1, '_id': 0}).sort([('pointname', pymongo.ASCENDING), ('time', pymongo.ASCENDING)])

                tndict = {}
                timeLast = None
                nameLast = ""
                temp = []
                fixTime = []
                for item in cursor:
                    item_time = item.get('time')
                    findName = item.get('pointname')
                    item_value = item.get('value')
                    year_month_day = item_time.strftime('%Y-%m-%d')
                    if timeFormat == 'M1':
                        startObject = tl[0] if tl else startObject
                        endObject = tl[-1] if tl else endObject
                    if bSearchNearest:
                        for h, h_item in item_value.items():
                            for m, findValue in h_item.items():
                                h = int(h)
                                try:
                                    m = int(m)
                                except:
                                    continue
                                t = item_time.replace(hour=h, minute=m)
                                fixTime.append({'n': findName, 't': t, 'v': findValue})
                    if year_month_day in timeDict:
                        h_m = timeDict[year_month_day]
                        for h in h_m:
                            item_value_h = item_value.get(str(h))
                            if item_value_h:
                                for m in h_m[h]:
                                    findValue = item_value_h.get(str(m))
                                    t = item_time.replace(hour=h, minute=m)
                                    if t >= startObject and t <= endObject:
                                        findTime = t
                                        if findValue not in [None, 'Null', 'None']:
                                            tndict.update({(findTime, findName): findValue})
                                            if isinstance(findName, list):
                                                if len(findName) == 1:
                                                    findName = findName[0]
                                            if findName != nameLast:
                                                if len(temp) > 0:
                                                    data.append(dict(pointname=nameLast, record=temp))
                                                    timeLast = None
                                                    temp = []
                                                nameLast = str(findName)
                                            bNum = True
                                            try:
                                                valueConvertToFloat = float(findValue)
                                            except:
                                                bNum = False
                                            if timeLast != findTime:
                                                if bNum:
                                                    temp.append(dict(time=findTime.strftime('%Y-%m-%d %H:%M:%S'),
                                                                     value=valueConvertToFloat))
                                                else:
                                                    temp.append(
                                                        dict(time=findTime.strftime('%Y-%m-%d %H:%M:%S'),
                                                             value=findValue))
                                                timeLast = findTime
                if len(temp) > 0:
                    data.append(dict(pointname=nameLast, record=temp))
                if bSearchNearest:
                    if timeFormat == 'M1':
                        cursor = self.mdbBb[collectionName].find({'time': {'$gte': dayStartQueryObject, '$lte': startObject}, 'pointname': {'$in': pts}},
                                                                 {'time': 1, 'pointname': 1, 'value': 1, '_id': 0}).sort(
                            [('pointname', pymongo.ASCENDING), ('time', pymongo.ASCENDING)])
                        for item in cursor.batch_size(100):
                            item_time = item.get('time')
                            findName = item.get('pointname')
                            item_value = item.get('value')
                            for h, h_item in item_value.items():
                                for m, findValue in h_item.items():
                                    h = int(h)
                                    m = int(m)
                                    t = item_time.replace(hour=h, minute=m)
                                    if t >= dayStartQueryObject and t <= startObject:
                                        fixTime.append({'n': findName, 't': t, 'v': findValue})
                    if fixTime:
                        fixTime.sort(key=lambda x: x.get('t'), reverse=True)
                    self.searchNearest(tl, pts, tndict, fixTime, data)
        except Exception:
            logging.error(
                'Failed to get history data from DB! collectionName=%s, timeFormat=%s, dayStartQueryObject=%s, '
                'dayEndQueryObject=%s, startObject=%s, endObject=%s, point_list=%s, data=%s, bSearchNearest=%s',
                collectionName, timeFormat, dayStartQueryObject, dayEndQueryObject, startObject, endObject, point_list,
                data, bSearchNearest, exc_info=True, stack_info=True)
        finally:
            if cursor:
                cursor.close()

    def searchNearest(self, tl, point_list, tndict, fixTime, data):
        for pt in point_list:
            for nIndex, f_item in enumerate(data):
                f_name = f_item.get('pointname')
                if f_name == pt:
                    f_item = data[nIndex]
                    i_record = []
                    f_record = f_item.get('record', [])
                    if len(f_record) != len(tl):
                        for f_t_m in tl:
                            r = tndict.get((f_t_m, f_name), None)
                            v = r if r is not None else self.get_nearest_data_from_prefetch(f_t_m, pt, fixTime)
                            if v is not None:
                                i_record.append({'value': v, 'time': f_t_m.strftime('%Y-%m-%d %H:%M:%S')})
                        f_item['record'] = i_record
                    break
            else:
                tDataRecord = []
                for f_t_m in tl:
                    v = self.get_nearest_data_from_prefetch(f_t_m, pt, fixTime)
                    if v is not None:
                        tDataRecord.append({'value': v, 'time': f_t_m.strftime('%Y-%m-%d %H:%M:%S')})
                data.append(dict(pointname=pt, record=tDataRecord))

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

    def get_nearest_data_from_prefetch(slef, f_t_m, pt, fixTime):
        for item in fixTime:
            if item.get('n') == pt:
                if item.get('t') < f_t_m:
                    return item.get('v')
        return None

    def getModbusPointTableByDtuName(self, dtuName):  # 通过dtuId获取modbus点表
        datalsit = []
        try:
            cursor = self.mdbBb[g_tableModbusSourceAdditional].find({'dtuName':dtuName})  # 查找
            total = cursor.count()
            if total > 0:
                for item in cursor:
                    if item:
                        data = {}
                        data['projId'] = item.get('projId')
                        data['pointName'] = item.get('pointName')
                        data['create_by'] = item.get('create_by')
                        data['create_time'] = item.get('create_time')
                        data['modfiy_by'] = item.get('modfiy_by')
                        data['modify_tiem'] = item.get('modify_tiem')
                        data['type'] = item.get('type')
                        data['params'] = item.get('params')
                        datalsit.append(data)
            else:
                strErr = "getModbusPointTableByDtuId Error :find({'dtuId':dtuId}) failed!"
                app.logger.error(strErr)
                print(strErr)
        except Exception as e:
            print('getModbusPointTableByDtuId Error: ' + e.__str__())
            app.logger.error('getModbusPointTableByDtuId Error: ' + e.__str__())
        return datalsit

    def insertDataToModbusPointTable(self, data):  # 插入数据Mongo表中
        rt = False
        try:
            if data:
                for item in data:
                    self.handleProjectId(item)
                self.mdbBb[g_tableModbusSourceAdditional].insert_many(data)
                rt = True
        except Exception as e:
            print('insertDataToModbusPointTable Error: ' + e.__str__())
            app.logger.error('insertDataToModbusPointTable Error: ' + e.__str__())
        return rt

    def deleteModbusPointByPointIdAndDtuName(self, dtuName, pointId_list):  # 通过dtuId，点名匹配，删除相应的点
        rt = False
        try:
            objectId_list = [ObjectId(item) for item in pointId_list]
            query = {'dtuName':dtuName, '_id': {'$in': objectId_list}}
            self.mdbBb[g_tableModbusSourceAdditional].delete_many(query)
            rt = True
        except Exception as e:
            print('insertDataToModbusPointTable Error: ' + e.__str__())
            app.logger.error('insertDataToModbusPointTable Error: ' + e.__str__())
        return rt

    def updateManyModbusPoint(self, data_list):  # 更新多条同一dtu下的点表
        rt = False
        try:
            for item in data_list:
                item['_id'] = ObjectId(item.get('_id'))
                self.handleProjectId(item)
                self.mdbBb[g_tableModbusSourceAdditional].update_one({'_id': item.get('_id')}, {'$set': item}, upsert=True)
                rt = True
        except Exception as e:
            print(' updateManyModbusPoint Error: ' + e.__str__())
            app.logger.error(' updateManyModbusPoint Error: ' + e.__str__())
        return rt

    def importPointToMongoDB(self, dict_list, source_type=None):
        if not source_type:
            source_type = 5
        dtuName = dict_list[0].get('dtuName')
        existed_points_map = self.getPointMap(dtuName, source_type)  # 找到已经存在的点表
        update_list = []
        insert_list = []
        try:
            for data_item in dict_list:
                if not data_item.get('pointName'):
                    continue
                self.handleProjectId(data_item)
                data_item['pointName'] = self.replaceInvalidCharsInpointName(data_item.get('pointName'))
                if existed_points_map.get(data_item.get('pointName')):
                    existed_point = existed_points_map.get(data_item.get('pointName'))
                    existed_point_params = existed_point.get('params')
                    data_item_params = data_item.get('params')
                    existed_point_params.update(data_item_params)
                    existed_point.update(data_item)
                    existed_point['params'] = existed_point_params
                    update_list.append(existed_point)
                else:
                    insert_list.append(data_item)
                    existed_points_map[data_item.get('pointName')] = data_item
            if update_list:
                self.updateManyModbusPoint(update_list)
                logging.info('Modbus点表更新:' + str(update_list))
            if insert_list:
                self.mdbBb[g_tableModbusSourceAdditional].insert_many(insert_list)
                logging.info('Modbus点表新增:' + str(insert_list))
            return True
        except Exception as e:
            print('Modbus点表更新错误,DTU:' + str(dtuName) + ' ' + str(e))
            app.logger.error('Modbus点表更新错误,DTU:' + str(dtuName) + ' ' + str(e))
            return False

    def replaceInvalidCharsInpointName(self, point_name):
        if not point_name:
            return None
        CLOUD_POINT_NAME_START_WITH_NUM = re.compile('^\d')  # 点名是否以数字开头
        CLOUD_POINT_NAME_REFILL = '_'  # 点名不合法字符替换
        CLOUD_POINT_NAME_NUMBER_PREFIX = 'P_'  # 点名不合法字符替换
        CLOUD_POINT_NAME_NOT_VALID_CHAR = re.compile('[^a-zA-Z_0-9]')  # 不合法字符
        point_name = point_name.strip()
        if CLOUD_POINT_NAME_START_WITH_NUM.match(point_name):
            point_name = CLOUD_POINT_NAME_NUMBER_PREFIX + point_name
        # 将不合法字符进行替换
        handled_name = re.sub(CLOUD_POINT_NAME_NOT_VALID_CHAR, CLOUD_POINT_NAME_REFILL, point_name)
        # 处理多个不合法字符被转化时候连续出现过多的下划线
        more_pattern = re.compile(CLOUD_POINT_NAME_REFILL + '{2,}')
        return re.sub(more_pattern, CLOUD_POINT_NAME_REFILL, handled_name)

    def getPointMap(self, dtuName, source_type=None):
        query = {'dtuName':dtuName}
        if source_type:
            query['type'] = source_type
        cursor = self.mdbBb[g_tableModbusSourceAdditional].find(query, projection={'dtuName': False, 'type': False})
        return {item.get('pointName'): item for item in cursor}

    def insertNewPointToMongoDB(self, data):  # 插入单个新点到数据库中
        rt = False
        try:
            if data:
                self.handleProjectId(data)
                self.mdbBb[g_tableModbusSourceAdditional].insert(data)
                rt = True
        except Exception as e:
            print('insertNewPointToMongoDB Error: ' + e.__str__())
            app.logger.error('insertNewPointToMongoDB Error: ' + e.__str__())
        return rt

    def insertManyPointToMongoDB(self, dataList):  # 插入多个新点到数据库中
        rt = False
        try:
            self.mdbBb[g_tableModbusSourceAdditional].insert_many(dataList)
            rt = True
        except Exception as e:
            print('insertNewPointToMongoDB Error: ' + e.__str__())
            app.logger.error('insertNewPointToMongoDB Error: ' + e.__str__())
        return rt

    def getPointBySarchText(self, searchText, projId, dtuName, perfix=''):  # 根据名字中含有的关键字来查找dtu点,并且按时间先后顺序得到数据
        projId = projId if isinstance(projId, int) else int(projId)
        datalist = []
        try:
            if searchText:
                query = {'projId':projId, 'dtuName':dtuName, 'pointName': {'$regex': searchText, '$options': 'i'}}
            else:
                query = {'projId':projId, 'dtuName':dtuName}
            cur = self.mdbBb[g_tableModbusSourceAdditional].find(query, sort=[('modify_time', -1)])
            for item in cur:
                data = {}
                params = item.get('params')
                data['name'] = item.get('pointName')
                data['pointName'] = str(perfix) + '_' + str(item.get('pointName'))
                data['dataLength'] = params.get('dataLength')
                data['dataType'] = params.get('dataType')
                data['functionCode'] = params.get('functionCode')
                data['pointType'] = params.get('pointType')
                data['address'] = params.get('address')
                data['note'] = params.get('note')
                data['refreshCycle'] = params.get('refreshCycle')
                data['slaveId'] = params.get('slaveId')
                data['multiple'] = params.get('multiple')
                data['pointId'] = str(item.get('_id'))
                datalist.append(data)
        except Exception as e:
            print('getPointBySarchText Error: ' + e.__str__())
            app.logger.error('getPointBySarchText Error: ' + e.__str__())
        return datalist

    def getPointByDtuName(self, dtuName,perfix):
        datalist = []
        try:
            query = { 'dtuName': dtuName}
            cur = self.mdbBb[g_tableModbusSourceAdditional].find(query, sort=[('modify_time', -1)])
            for item in cur:
                data = {}
                params = item.get('params')
                data['pointName'] = perfix + '_' + item.get('pointName')
                data['dataLength'] = params.get('dataLength')
                data['dataType'] = params.get('dataType')
                data['functionCode'] = params.get('functionCode')
                data['pointType'] = params.get('pointType')
                data['address'] = params.get('address')
                data['note'] = params.get('note')
                data['refreshCycle'] = params.get('refreshCycle')
                data['slaveId'] = params.get('slaveId')
                data['multiple'] = params.get('multiple')
                data['pointId'] = str(item.get('_id'))
                datalist.append(data)
        except Exception as e:
            print('getPointBySarchText Error: ' + e.__str__())
            app.logger.error('getPointBySarchText Error: ' + e.__str__())
        return datalist

    def getPointByDtuNameNoPerfix(self, dtuName):
        datalist = []
        try:
            query = { 'dtuName': dtuName}
            cur = self.mdbBb[g_tableModbusSourceAdditional].find(query, sort=[('modify_time', -1)])
            for item in cur:
                data = {}
                params = item.get('params')
                data['pointName'] = item.get('pointName')
                data['dataLength'] = params.get('dataLength')
                data['dataType'] = params.get('dataType')
                data['functionCode'] = params.get('functionCode')
                data['pointType'] = params.get('pointType')
                data['address'] = params.get('address')
                data['note'] = params.get('note')
                data['refreshCycle'] = params.get('refreshCycle')
                data['slaveId'] = params.get('slaveId')
                data['multiple'] = params.get('multiple')
                data['pointId'] = str(item.get('_id'))
                datalist.append(data)
        except Exception as e:
            print('getPointBySarchText Error: ' + e.__str__())
            app.logger.error('getPointBySarchText Error: ' + e.__str__())
        return datalist
    
    def getPointNameByDtuName(self, dtuName, perfix):
        datalist = []
        try:
            query = { 'dtuName': dtuName}
            cur = self.mdbBb[g_tableModbusSourceAdditional].find(query)
            for item in cur:
                datalist.append(perfix + '_' + str(item.get('pointName')))
        except Exception as e:
            print('getPointBySarchText Error: ' + e.__str__())
            app.logger.error('getPointBySarchText Error: ' + e.__str__())
        return datalist

    def checkExistPointNameInDtu(self, dtuName, pointName):  # 检测dtu设备下是否已经存在点名
        rt = False
        pointName = pointName if isinstance(pointName, str) else str(pointName)
        query = {'pointName': pointName, 'dtuName': dtuName}
        try:
            cur = self.mdbBb[g_tableModbusSourceAdditional].find(query)
            if cur.count() > 0:
                rt = True
        except Exception as e:
            print('checkExistPointNameInDtu Error: ' + e.__str__())
            app.logger.error('checkExistPointNameInDtu Error: ' + e.__str__())
        return rt

    def checkExistSameDtuParams(self, projId, params,pointId = None):  # 检测dtu属性相同
        rt = False
        #slaveId,address,functionCode,dataType,dataLength
        pointType = str(params['pointType'])
        query = {'projId': projId}
        if pointType == 'modbus':
            query = {'projId': projId, 'params.slaveId': params['slaveId'],'params.address': params['address']
                     ,'params.functionCode': params['functionCode'],'params.dataType': params['dataType']
                     ,'params.dataLength': params['dataLength'],'params.pointType':pointType}
        elif pointType == 'obix':
            query = {'projId': projId,'params.address': params['address'],'params.pointType':pointType}
        if pointId:
            query['_id'] = {'$nin':[ObjectId(pointId)]}
        try:
            cur = self.mdbBb[g_tableModbusSourceAdditional].find(query)
            if cur.count() > 0:
                rt = True
        except Exception as e:
            print('checkExistSameDtuParams Error: ' + e.__str__())
            app.logger.error('checkExistSameDtuParams Error: ' + e.__str__())
        return rt

    def updatePointToMongo(self,data,pointId):
        rt = False
        query = {'_id':ObjectId(pointId)}
        params = data['params']
        pointType = params['pointType']
        up = {}
        if pointType == 'modbus':
            up = {'$set':{'modify_by':data['modify_by'],'modify_time':data['modify_time'],'pointName':data['pointName']
                          ,'params.dataType':params['dataType']
                          ,'params.dataLength':params['dataLength'],'params.functionCode':params['functionCode']
                          ,'params.address':params['address'],'params.slaveId':params['slaveId'],'params.multiple':params['multiple']
                          ,'params.refreshCycle':params['refreshCycle'],'params.note':params['note']}}
        elif pointType == 'obix':
            up = {'$set':{'modify_by':data['modify_by'],'modify_time':data['modify_time'],'pointName':data['pointName']
                          ,'params.address':params['address'],'params.note':params['note']}}
        else:
            return False
        try:
            self.mdbBb[g_tableModbusSourceAdditional].update(query, up, True)
            rt = True
        except Exception as e:
            app.logger.error('updatePointToMongo Error: ' + e.__str__())
            return False
        return rt
    
    
    def deletePointByObjId(self, dtuName, pointId_list):  # 根据点ID删除集合。
        rt = False
        try:
            objectId_list = [ObjectId(item) for item in pointId_list]
            query = {'dtuName':dtuName, '_id': {'$in': objectId_list}}
            self.mdbBb[g_tableModbusSourceAdditional].delete_many(query)
            rt = True
        except Exception as e:
            print('checkExistPointNameInDtu Error: ' + e.__str__())
            app.logger.error('checkExistPointNameInDtu Error: ' + e.__str__())
        return rt

    def deleteAllPointByDtuName(self, dtuName):  # 删除dtu下的所有点
        rt = False
        try:
            query = {'dtuName':dtuName}
            print("QUery:", query)
            self.mdbBb[g_tableModbusSourceAdditional].delete_many(query)
            rt = True
        except Exception as e:
            print('checkExistPointNameInDtu Error: ' + e.__str__())
            app.logger.error('checkExistPointNameInDtu Error: ' + e.__str__())
        return rt

    def checkEmptyDtuByDtuName(self, dtuName):  # 检测数据库是否为空
        query = {'dtuName': dtuName}
        cur = self.mdbBb[g_tableModbusSourceAdditional].find(query)
        if cur.count() > 0:
            return True
        return False

    def handleProjectId(self, point):
        if point and point.get('projId') and not isinstance(point.get('projId'), int):
            point['projId'] = int(point.get('projId'))

    def getLogByDtuIdAndSearchText(self, dtuName, s_time=None, e_time=None):  # 多个筛选条件获取log
        rdataList = []
        query = {}
        try:
            if s_time is None and e_time is None:
                now = datetime.now()
                e_time = datetime.strftime(now, '%Y-%m-%d %H:%M:%S')
                s_time = datetime.strftime(now - timedelta(seconds=60), '%Y-%m-%d %H:%M:%S')
            query['dtuName'] = dtuName
            if s_time:
                query['time'] = {'$gte': s_time}
            if e_time:
                if query.get('time'):
                    query['time']['$lte'] = e_time
                else:
                    query['time'] = {'$lte': e_time}
            cur = self.mdbBb[g_tableModbusLog].find(query, sort=[('time', -1)])
            if cur.count() > 0:
                for item in cur:
                    rdata = {}
                    rdata['dtuName'] = dtuName
                    rdata['user'] = item.get('user')
                    rdata['time'] = item.get('time')
                    rdata['log'] = item.get('log')
                    rdata['type'] = item.get('type')
                    rdataList.append(rdata)
        except Exception as e:
            strErr = "getLogByDtuIdAndSearchText Error :" + e.__str__()
            app.logger.error(strErr)
            print(strErr)
        return rdataList

    def deleteLogByDtuName(self, dtuName):  # 删除dtuId的对应的所有log
        rt = False
        try:
            query = {'dtuName': dtuName}
            self.mdbBb[g_tableModbusLog].delete_many(query)
            rt = True
        except Exception as e:
            strErr = "deleteLogByDtuId Error :" + e.__str__()
            app.logger.error(strErr)
            print(strErr)
        return rt

    def getHistoryOperationMessage(self, dtuName, s_time, e_time):  # 获取历史操作信息
        rdataList = []
        query = {}
        try:
            if s_time:
                query['time'] = {'$gte': s_time}
            if e_time:
                if query.get('time'):
                    query['time']['$lte'] = e_time
                else:
                    query['time'] = {'$lte':e_time}
            query['dtuName'] = dtuName
            query['type'] = {'$gte':3}
            print("Query:", query)
            cur = self.mdbBb[g_tableModbusLog].find(query, sort=[('time', -1)])
            if cur.count() > 0:
                for item in cur:
                    rdata = {}
                    rdata['time'] = item.get('time')
                    rdata['type'] = item.get('type')
                    rdata['username'] = item.get('user')
                    rdataList.append(rdata)
            else:
                strErr = "getHistoryOperationMessage Error : self.mdbBb[g_tableModbusLog].find(query,sort = [('time',-1)]) return None"
                print(strErr)
        except Exception as e:
            strErr = "getHistoryOperationMessage Error :" + e.__str__()
            app.logger.error(strErr)
            print(strErr)
        return rdataList

    def insertManyLog(self, logdata, dtuName):  # 插入多条log
        rt = False
        try:
            insertList = []
            if logdata:
                for item in logdata:
                    # noinspection PyDictCreation
                    data = {}
                    data['log'] = item['log']
                    log_time_text = item['time']
                    log_time = datetime.strptime(log_time_text, '%Y-%m-%d %H:%M:%S')
                    data['time'] = log_time
                    data['dtuName'] = dtuName
                    data['user'] = item.get('userName')
                    data['type'] = item.get('type')
                    insertList.append(data)
                self.mdbBb[g_tableModbusLog].insert_many(insertList)
                rt = True
        except Exception:
            logging.error('Failed to insert many logs! logdata=%s, dtuName=%s', logdata, dtuName, exc_info=True,
                          stack_info=True)
        return rt

    def insertSingleLog(self, logdata, dtuName):  # 插入单条log
        rt = False
        try:
            if logdata:
                logdata['dtuName'] = dtuName
                log_time = logdata['time']
                if isinstance(log_time, str):
                    logdata['time'] = datetime.strptime(log_time, '%Y-%m-%d %H:%M:%S')
                self.mdbBb[g_tableModbusLog].insert(logdata)
                rt = True
        except Exception:
            logging.error('Failed to insert single log! logdata=%s, dtuName=%s', logdata, dtuName, exc_info=True,
                          stack_info=True)
        return rt

    def deleteLogByDtuId(self, dtuName):
        try:
            query = {'dtuName': dtuName}
            self.mdbBb[g_tableModbusLog].delete_many(query)
            return True
        except Exception as e:
            print(e.__str__())
            return False

    def saveWeatherData(self, data, pointTime, stationId):
        try:
            tmDate = pointTime.replace(hour=0, minute=0, second=0, microsecond=0)
            hour = str(pointTime.hour)
            min = str(pointTime.minute)
            query = {'utc_time': tmDate}
            update = {'$set': {'value.' + hour + '.' + min: data}}
            self.mdbBb[stationId].update(query, update, True)
            self.mdbBb[stationId].create_index([('utc_time', pymongo.ASCENDING)])
        except Exception as e:
            print(e.__str__())
            strErr = "saveWeatherData Error :" + e.__str__()
            app.logger.error(strErr)
            return False
        return True

    def saveWeatherCityInfo(self, data):
        try:
            dbname = 'Weather_CityMetaInfo'
            self.mdbBb[dbname].insert(data)
            return True
        except Exception as e:
            strErr = "saveWeatherCityInfo Error :" + e.__str__()
            app.logger.error(strErr)
            print(e.__str__())
            return False

    def getCityInfoById(self, id):
        cursor = None
        rt = None
        try:
            dbname = 'Weather_CityMetaInfo'
            cursor = self.mdbBb[dbname].find({'_id':id})
            for item in cursor:
                rt = item
        except Exception as e:
            print(e.__str__())
            return False
        finally:
            if cursor:
                cursor.close()
        return rt

    def getAllWeatherCityInfo(self):
        cursor = None
        rt = []
        try:
            dbname = 'Weather_CityMetaInfo'
            cursor = self.mdbBb[dbname].find({})
            for item in cursor:
                rt.append(item)
        except Exception as e:
            print(e.__str__())
            return False
        finally:
            if cursor:
                cursor.close()
        return rt

    def getOpenIdByHeFengId(self, openId):
        cursor = None
        rt = None
        try:
            dbname = 'Weather_CityMetaInfo'
            cursor = self.mdbBb[dbname].find({"openStationId": openId})
            for item in cursor:
                rt = item
        except Exception as e:
            print(e.__str__())
            return False
        finally:
            if cursor:
                cursor.close()
        return rt

    def InsertEmailLogIntoMongo(self, subject, recipients, cc, bcc):
        try:
            insert_data = dict(subject=subject, time=datetime.now())
            if recipients:
                insert_data.update(**dict(recipients=recipients))
            if cc:
                insert_data.update(**dict(cc=cc))
            if bcc:
                insert_data.update(**dict(bcc=bcc))
            result = self.mdbBb['EmailLog'].insert_one(insert_data)
            if result:
                if ObjectId.is_valid(result.inserted_id):
                    return True
        except Exception:
            logging.error('Failed to insert email log into mongo', exc_info=True, stack_info=True)
        return False

    def getVpointsForProjByHisDataModes(self, projId, hisDataModes):
        cursor = self.mdbBb[g_tableDataSource].find(
            {'projId': projId, 'params.flag': 1, 'params.his_data_mode': {'$in': hisDataModes}},
            {'value': 1, 'params.his_data_mode': 1, '_id': 0})
        result = []
        try:
            for item in cursor:
                point_name = item.get('value')
                if item.get('params') is None or item.get('params').get('his_data_mode') is None:
                    his_data_mode = VpointsHistoryDataMode.m5
                else:
                    his_data_mode = item.get('params').get('his_data_mode')
                result.append(dict(point_name=point_name, his_data_mode=his_data_mode))
        finally:
            cursor.close()
        return result
