__author__ = 'David'

from ExpertContainer import app
import logging, pymongo
from datetime import datetime, timedelta
from bson.objectid import ObjectId
from bson import son
import traceback
from ExpertContainer.api.LogOperator import LogOperator
from ExpertContainer.api.utils import getTimeType
from ExpertContainer.dbAccess.RedisManager import RedisManager
from ExpertContainer.api.utils import *
from pymongo import UpdateOne
import math
import time
import ssl
from threading import Timer
import calendar

_leapMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
_NonLeapMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
timeFlag = datetime.strptime("2217-03-21 00:00:00", "%Y-%m-%d %H:%M:%S")


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
                while (True):
                    if timeFromObj.minute % 5 == 0:
                        break
                    timeFromObj += timedelta(minutes=1)
                while (True):
                    if timeToObj.minute % 5 == 0:
                        break
                    timeToObj -= timedelta(minutes=1)
                span = timeToObj - timeFromObj
                rt = (span.seconds // 300) + 1
    except Exception as e:
        BEOPMongoDataAccess._logger.writeLog('getCountByTimeSpan:' + e.__str__(), True)
    return rt, timeFromObj, timeToObj


class BEOPMongoDataAccess:
    _logger = LogOperator()

    def __init__(self, addr, is_ssl=None, dbname='beopdata', replica_set=None, read_preference=None):
        bOk = False
        logging.info(
            "Connecting to MongoDB %s with is_ssl = %s, dbname = %s, replica_set = %s, read_preference = %s...", addr,
            is_ssl, dbname, replica_set, read_preference)
        try:
            if is_ssl is None:
                is_ssl = False
            if ':' in addr:
                addrArr = addr.split(':')
                if len(addrArr) == 2:
                    self._st = None
                    self._et = None
                    hostAddr = str(addrArr[0])
                    port = int(addrArr[1])
                    self.mdbConnection = None
                    self._hostAddr = addr
                    if replica_set is None or read_preference is None:
                        self.mdbConnection = pymongo.MongoClient(
                            host=hostAddr, port=port, socketKeepAlive=True, maxPoolSize=300, #maxIdleTimeMS=60000,
                            waitQueueTimeoutMS=20000, ssl=is_ssl, ssl_cert_reqs=ssl.CERT_NONE)
                    else:
                        self.mdbConnection = pymongo.MongoClient(
                            host=hostAddr, port=port, socketKeepAlive=True, maxPoolSize=300, #maxIdleTimeMS=60000,
                            replicaset=replica_set, readPreference=read_preference,
                            waitQueueTimeoutMS=20000, ssl=is_ssl, ssl_cert_reqs=ssl.CERT_NONE)
                    self.mdbBb = self.mdbConnection[dbname]
                    if is_ssl:
                        bOk = self.mdbBb.authenticate(
                            'rnbtech',
                            'bGbRZxeHL9jsEM8xGgL0CrlsTGKOnSpnMlzn8QiGHEYIMxuiT2qgU94OLLGCQEzoNvkzeEsEapsyayJXBZR6QA==')
                    else:
                        bOk = self.mdbBb.authenticate('beopweb', 'RNB.beop-2013')
            else:
                logging.error("addr does not contain ':'! addr = %s, is_ssl = %s, dbname = %s",
                              addr, is_ssl, dbname, stack_info=True)

        except Exception as e:
            logging.error("Cannot connect to MongoDB %s with is_ssl = %s and dbname = %s!, e=%s",
                          addr, is_ssl, dbname, str(e), exc_info=True, stack_info=True)

        if not bOk:
            logging.error("Cannot connect to MongoDB %s with is_ssl = %s and dbname = %s!", addr, is_ssl, dbname)
        else:
            logging.info("Successfully connected to %s with is_ssl = %s and dbname = %s", addr, is_ssl, dbname)

    def __del__(self):
        logging.warning('!!!SOMEONE IS TRYING TO DELETE ME!!!')
        if self.mdbConnection is not None:
            self.mdbConnection.close()

    def getHostAddr(self):
        return self._hostAddr

    def setTimeAttrStart(self, st):
        if isinstance(st, str):
            self._st = datetime.strptime(st, '%Y-%m-%d %H:%M:%S')
        else:
            self._st = st

    def setTimeAttrEnd(self, et):
        if isinstance(et, str):
            self._et = datetime.strptime(et, '%Y-%m-%d %H:%M:%S')
        else:
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
            BEOPMongoDataAccess._logger.writeLog('getAllCollections failed' + e.__str__(), True)
        return rt

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
                    post = {'pointname': {'$in': point_list}, 'time': {'$gte': startObject, '$lte': endObject},
                            "value": {'$nin': [None, 'Null', 'None']}}
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
                    if False:  # startObject>= datetime(2016,12,15,0,0,0,0):
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
                    cursor = self.mdbBb[collectionName].find(post).sort(
                        [('pointname', pymongo.ASCENDING), ('time', pymongo.ASCENDING)])  # pay attention to index
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
                                temp.append(
                                    dict(time=findTime.strftime('%Y-%m-%d %H:%M:%S'), value=str(valueConvertToFloat)))
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
                            if f_name == pt:
                                bFound = True
                                break
                            nIndex += 1
                        if not bFound:
                            # 补全部时间
                            tDataRecord = []
                            for f_t_m in f_l:
                                v = self.get_nearest_data_from_table(dbname, f_t_m, pt, 60 * 24 * 5)
                                if v is not None:
                                    tDataRecord.append({'value': str(v), 'time': f_t_m})
                            data.append(dict(pointname=pt, record=tDataRecord))
                        else:
                            f_item = data[nIndex]
                            i_record = []
                            f_record = f_item.get('record', [])
                            if len(f_record) != len(f_l):
                                for f_t_m in f_l:
                                    r = self.get_record_by_time(f_record, f_t_m)
                                    v = r if r is not None else self.get_nearest_data_from_table(dbname, f_t_m, pt,
                                                                                                 60 * 24 * 5)
                                    if v is not None:
                                        i_record.append({'value': str(v), 'time': f_t_m})
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
                            if f_name == pt:
                                bFound = True
                                break
                            nIndex += 1
                        if not bFound:
                            # 补全部时间
                            tDataRecord = []
                            for f_t_m in f_l:
                                v = self.get_nearest_data_from_table(dbname, f_t_m, pt, 60 * 24 * 2)
                                if v is not None:
                                    tDataRecord.append({'value': str(v), 'time': f_t_m})
                            data.append(dict(pointname=pt, record=tDataRecord))
                        else:
                            f_item = data[nIndex]
                            i_record = []
                            f_record = f_item.get('record', [])
                            if len(f_record) != len(f_l):
                                for f_t_m in f_l:
                                    r = self.get_record_by_time(f_record, f_t_m)
                                    v = r if r is not None else self.get_nearest_data_from_table(dbname, f_t_m, pt,
                                                                                                 60 * 24 * 2)
                                    if v is not None:
                                        i_record.append({'value': str(v), 'time': f_t_m})
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
                                v = self.get_nearest_data_from_table(dbname, f_t_m, pt, 60 * 24 * 2)
                                if v is not None:
                                    tDataRecord.append({'value': str(v), 'time': f_t_m})
                            data.append(dict(pointname=pt, record=tDataRecord))
                        else:
                            f_item = data[nIndex]
                            i_record = []
                            f_record = f_item.get('record', [])
                            if len(f_record) != len(f_l):
                                for f_t_m in f_l:
                                    r = self.get_record_by_time(f_record, f_t_m)
                                    v = r if r is not None else self.get_nearest_data_from_table(dbname, f_t_m, pt,
                                                                                                 60 * 24 * 2)
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
                                v = self.get_nearest_data_from_table(dbname, f_t_m, pt, 60 * 24 * 2)
                                if v is not None:
                                    tDataRecord.append({'value': str(v), 'time': f_t_m})
                            data.append(dict(pointname=pt, record=tDataRecord))
                        else:
                            f_item = data[nIndex]
                            i_record = []
                            f_record = f_item.get('record', [])
                            if len(f_record) != len(f_l):
                                for f_t_m in f_l:
                                    r = self.get_record_by_time(f_record, f_t_m)
                                    v = r if r is not None else self.get_nearest_data_from_table(dbname, f_t_m, pt,
                                                                                                 60 * 24 * 2)
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
                        prop_record.append({'time': t, 'value': v})
                    data.append({'pointname': '%s.%s' % (key, prop), 'record': prop_record})
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

    def getHistoryDataAtTime(self, collectionNameBase, timeAt, timeFormat):
        try:
            timeAtObject = datetime.strptime(timeAt, '%Y-%m-%d %H:%M:%S')
            timeList = []
            nameList = []
            valueList = []

            post = {'time': timeAtObject, "value": {'$nin': [None, 'Null', 'None']}}

            collectionName = 'm5' + '_data_' + collectionNameBase

            cursor = self.mdbBb[collectionName].find(post).sort(
                [('pointname', pymongo.ASCENDING), ('time', pymongo.ASCENDING)])  # pay attention to index

            for item in cursor.batch_size(600):
                timeList.append(item['time'])
                nameList.append(item['pointname'])
                valueList.append(item['value'])

        except Exception as e:
            BEOPMongoDataAccess._logger.writeLog('getHistoryDataByFormat failed' + e.__str__(), True)
        finally:
            if cursor:
                cursor.close()
        return dict(timeList=timeList, nameList=nameList, valueList=valueList)

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
            while (cur <= end):
                bleap = isLeap(cur.year)
                rt.append(cur.strftime('%Y-%m-%d %H:%M:%S'))
                cur += timedelta(days=_leapMonth[cur.month - 1] if bleap else _NonLeapMonth[cur.month - 1])
        except Exception as e:
            BEOPMongoDataAccess._logger.writeLog('get_query_month_time_list failed' + e.__str__(), True)
        return rt

    def get_query_day_time_list(self, start, end):
        rt = []
        try:
            cur = start
            while (cur <= end):
                rt.append(cur.strftime('%Y-%m-%d %H:%M:%S'))
                cur += timedelta(days=1)
        except Exception as e:
            BEOPMongoDataAccess._logger.writeLog('get_query_day_time_list failed:' + e.__str__(), True)
        return rt

    def get_query_day_start(self, timeobj):
        rt = None
        try:
            rt = datetime(year=timeobj.year, month=timeobj.month, day=timeobj.day)
        except Exception as e:
            BEOPMongoDataAccess._logger.writeLog('get_query_day_start failed:' + e.__str__(), True)
        return rt

    def get_query_day_end(self, timeobj):
        rt = None
        try:
            rt = datetime(year=timeobj.year, month=timeobj.month, day=timeobj.day)
        except Exception as e:
            BEOPMongoDataAccess._logger.writeLog('get_query_day_end failed:' + e.__str__(), True)
        return rt

    def get_query_month_end(self, timeobj):
        rt = None
        try:
            rt = datetime(year=timeobj.year, month=timeobj.month, day=1)
        except Exception as e:
            BEOPMongoDataAccess._logger.writeLog('get_query_month_end failed:' + e.__str__(), True)
        return rt

    def get_query_month_start(self, timeobj):
        rt = None
        try:
            rt = datetime(year=timeobj.year, month=timeobj.month, day=1)
        except Exception as e:
            BEOPMongoDataAccess._logger.writeLog('get_query_month_start failed:' + e.__str__(), True)
        return rt

    def get_nearest_data_from_table(self, _dbname, _time, _point_name, tDistanceMinutesLimit):
        rt = None
        try:
            collectionName = 'm5_data_' + _dbname
            timeEnd = datetime.strptime(_time, "%Y-%m-%d %H:%M:%S") if isinstance(_time, str) else _time
            timeStart = timeEnd - timedelta(minutes=tDistanceMinutesLimit)
            ret = self.mdbBb[collectionName].find_one(
                {'pointname': _point_name, 'time': {'$lte': timeEnd, '$gte': timeStart},
                 "value": {'$nin': [None, 'Null', 'None']}}, sort=[('time', pymongo.DESCENDING)])
            rt = ret.get('value') if ret else None
        except Exception as e:
            print('get_nearest_data_from_table failed')
            print(e.__str__())
        return rt

    def saveHistoryData_v2(self, dataList, dbNameMongo, runMode=1):
        return self.updateHistoryDataMultiEx(dataList, dbNameMongo, runMode=runMode)

    def saveHistoryData(self, projId, pointName, pointValue, pointTime, dbNameMongo, runMode=1):
        result = False
        data, v2Data = self.filterData(projId, [(pointTime, pointName, pointValue)])
        if v2Data:
            self.saveHistoryData_v2(v2Data, dbNameMongo, runMode=runMode)
            result = True
        if data:
            if len(pointName) > 0 and isinstance(pointTime, datetime):
                try:
                    nTimeType = getTimeType(pointTime)
                    # if runMode != 0:
                    self.mdbBb[dbNameMongo].update_many({'time': pointTime, 'pointname': pointName},
                                                        {'$set': {'time': pointTime, 'pointname': pointName,
                                                                  'value': pointValue, 'updateDBTime': datetime.now(),
                                                                  'tt': nTimeType}}, True)
                    # else:
                    #     r = self.mdbBb[dbNameMongo].find_one({'time':pointTime, 'pointname':pointName})
                    #     if r is None:
                    #         self.mdbBb[dbNameMongo].update_many({'time':pointTime, 'pointname':pointName},
                    #                                             {'$set':{'time':pointTime, 'pointname':pointName,
                    #                                                      'value':pointValue, 'updateDBTime':datetime.now(),'tt':nTimeType}}, True)
                    result = True
                except Exception as e:
                    traceback.print_exc()
                    BEOPMongoDataAccess._logger.writeLog('saveHistoryData error:' + e.__str__(), True)
        return result

    def saveFaultHistoryData(self, faultName, aTime, faultNotice, dbNameMongo):
        result = False
        if len(faultName) > 0 and isinstance(aTime, datetime):
            try:
                if faultNotice is None or faultNotice == 'None':
                    self.mdbBb[dbNameMongo].insert(
                        {'time': aTime, 'name': faultName, 'value': -1, 'mTime': datetime.now()})
                elif isinstance(faultNotice, bool) or isinstance(faultNotice, int):
                    self.mdbBb[dbNameMongo].insert(
                        {'time': aTime, 'name': faultName, 'value': 0, 'mTime': datetime.now()})
                else:
                    self.mdbBb[dbNameMongo].insert({'time': aTime, 'name': faultName, 'value': 1,
                                                    'problem': faultNotice.problem,
                                                    'analysis': faultNotice.analysis, 'affect': faultNotice.affect,
                                                    'suggestion': faultNotice.suggestion, 'energy': faultNotice.energy,
                                                    'risk': faultNotice.risk, 'riskType': faultNotice.riskType,
                                                    'grade': faultNotice.grade, 'bindPoints': faultNotice.bindPoints,
                                                    'mTime': datetime.now()})
                self.mdbBb[dbNameMongo].create_index([('time', pymongo.ASCENDING), ('name', pymongo.ASCENDING)])
                result = True
            except Exception as e:
                BEOPMongoDataAccess._logger.writeLog('saveFaultHistoryData error:' + e.__str__(), True)
        return result

    def saveFaultHistoryData_v2(self, faultName, aTime, faultNotice, dbNameMongo):
        updated_v1 = False
        if datetime.now() < timeFlag + timedelta(days=14):
            updated_v1 = self.saveFaultHistoryData(faultName, aTime, faultNotice, dbNameMongo)
        updated_v2 = self.insertFaultHistoryData([(faultName, aTime, faultNotice)], dbNameMongo)
        updated_v2 = True if updated_v2 > 0 else False
        return updated_v1 if updated_v2 == updated_v1 else updated_v2

    def insertFaultHistoryData(self, faultList, dbNameMongo):
        dbName = dbNameMongo
        if dbName.startswith('fault_data'):
            dbName = 'v2_' + dbName
        nUpdateSrcLen = len(faultList)
        if nUpdateSrcLen <= 0:
            return 0
        maxBulkLen = 30000
        try:
            for i in range(0, math.ceil(nUpdateSrcLen / maxBulkLen)):
                arrTemp = faultList[i * maxBulkLen: i * maxBulkLen + maxBulkLen]
                arrReq = []
                for item in arrTemp:
                    mTime = datetime.now()
                    faultName = item[0]
                    faultNotice = item[2]
                    if faultNotice is None or faultNotice == 'None':
                        value = -1
                    elif isinstance(faultNotice, bool) or isinstance(faultNotice, int):
                        value = 0
                    else:
                        value = 1
                    faultTime = datetime.strptime(item[1], '%Y-%m-%d %H:%M:%S') if isinstance(item[0], str) else item[1]
                    tmDate = faultTime.replace(hour=0, minute=0, second=0, microsecond=0)
                    hour = str(faultTime.hour)
                    min = str(faultTime.minute)
                    if value == 1:
                        faultContent = {
                            'mTime': mTime,
                            'problem': faultNotice.problem,
                            'analysis': faultNotice.analysis,
                            'affect': faultNotice.affect,
                            'suggestion': faultNotice.suggestion,
                            'energy': faultNotice.energy,
                            'risk': faultNotice.risk,
                            'riskType': faultNotice.riskType,
                            'grade': faultNotice.grade,
                            'bindPoints': faultNotice.bindPoints,
                            'value': value
                        }
                    else:
                        faultContent = {'value': value}
                    arrReq.append(UpdateOne({'name': faultName, 'time': tmDate},
                                            {'$set': {'value.' + hour + '.' + min: faultContent}}, True))
                self.mdbBb[dbName].bulk_write(arrReq)
                self.mdbBb[dbName].create_index([('time', pymongo.ASCENDING), ('pointname', pymongo.ASCENDING)])
        except Exception as e:
            nUpdateSrcLen = 0
            print('insertFaultHistoryData error:' + e.__str__())
            logging.error('insertFaultHistoryData error:' + e.__str__())
        return nUpdateSrcLen

    def InsertTableData_v2(self, data, mongoDBTableName):
        return self.updateHistoryDataMultiEx(data, mongoDBTableName)

    def InsertTableData(self, projId, data, mongoDBTableName):
        data, v2Data = self.filterData(projId, data)
        if v2Data:
            self.InsertTableData_v2(v2Data, mongoDBTableName)
        total = 0
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
                            nTimeType = getTimeType(tTime)
                            if bNumber:
                                postList.append(son.SON(
                                    data={'time': tTime, 'pointname': data[index][1], 'value': convert,
                                          'tt': nTimeType}))
                            else:
                                postList.append(son.SON(
                                    data={'time': tTime, 'pointname': data[index][1], 'value': data[index][2],
                                          'tt': nTimeType}))
                        else:
                            BEOPMongoDataAccess._logger.writeLog('data format is invalid', True)
                    if len(postList) > 0:
                        b_i = datetime.now()
                        rt = table.insert(postList)
                        a_i = datetime.now()
                        total += len(rt)
                        BEOPMongoDataAccess._logger.writeLog(
                            'insert into mongo_collection %s,num is %s,span is %s seconds' % (
                            mongoDBTableName, len(rt), str((a_i - b_i).total_seconds())), True)
                        table.create_index([('time', pymongo.ASCENDING), ('pointname', pymongo.ASCENDING)])
        except Exception as e:
            BEOPMongoDataAccess._logger.writeLog('InsertTableData failed batch_size=30000:' + e.__str__(), True)
        return total

    def GetAllHisCollections(self):
        collections = []
        try:
            temp = self.mdbBb.collection_names(False)
            for item in temp:
                collections.append(item)
        except Exception as e:
            BEOPMongoDataAccess._logger.writeLog("GetAllHisCollections error:%s" % (e.__str__(),), True)
        return collections

    def deletePoints(self, collectionname, ptList, startTime, endTime, bOnlyDelPatched):
        rt = -1
        try:
            sto = datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S')
            eto = datetime.strptime(endTime, '%Y-%m-%d %H:%M:%S')
            if eto < sto:
                return rt
            if isinstance(ptList, list) and len(ptList) == 1:
                if bOnlyDelPatched:  # 只删除人工数（点计算或补齐或诊断写的）的
                    rtCount = self.mdbBb[collectionname].remove(
                        {'time': {'$gte': sto, '$lte': eto}, 'pointname': ptList[0], 'updateDBTime': {'$exists': True}})
                else:
                    rtCount = self.mdbBb[collectionname].remove(
                        {'time': {'$gte': sto, '$lte': eto}, 'pointname': ptList[0]})
            elif isinstance(ptList, list):
                if bOnlyDelPatched:  # 只删除人工数（点计算或补齐或诊断写的）的
                    rtCount = self.mdbBb[collectionname].remove(
                        {'time': {'$gte': sto, '$lte': eto}, 'pointname': {'$in': ptList},
                         'updateDBTime': {'$exists': True}})
                else:
                    rtCount = self.mdbBb[collectionname].remove(
                        {'time': {'$gte': sto, '$lte': eto}, 'pointname': {'$in': ptList}})
            else:
                if (eto - sto).total_seconds() > 3600 * 24:
                    BEOPMongoDataAccess._logger.writeLog(
                        'ERROR in deletePoints because time rang too large(%s-%s) in del all points' % (
                        startTime, endTime), True)
                    return rt
                if bOnlyDelPatched:  # 只删除人工数（点计算或补齐或诊断写的）的
                    rtCount = self.mdbBb[collectionname].remove(
                        {'time': {'$gte': sto, '$lte': eto, 'updateDBTime': {'$exists': True}}})
                else:
                    rtCount = self.mdbBb[collectionname].remove({'time': {'$gte': sto, '$lte': eto}})
            bok = rtCount.get('ok', 0)
            if bok >= 1:
                rt = rtCount.get('n', -1)
                BEOPMongoDataAccess._logger.writeLog(
                    "Removed Data Count:%d,point:%s, from %s to %s" % (rt, str(ptList), sto, eto), True)
        except Exception as e:
            BEOPMongoDataAccess._logger.writeLog(e.__str__(), True)
        return rt

    def updateHistoryDataReplaceValue(self, collectionname, strTimeFrom, strTimeTo, valueBefore, valueAfter):
        rt = -1
        if not isinstance(strTimeFrom, str) or not isinstance(strTimeTo, str):
            return rt
        try:
            tFrom = datetime.strptime(strTimeFrom, '%Y-%m-%d %H:%M:%S')
            tTo = datetime.strptime(strTimeTo, '%Y-%m-%d %H:%M:%S')

            dictCondition = {'value': valueBefore, 'time': {'$gte': tFrom, '$lt': tTo}}
            dictSet = {'value': valueAfter}
            rtCount = self.mdbBb[collectionname].update(dictCondition, {"$set": dictSet}, multi=True)

            bok = rtCount.get('ok', 0)
            if bok >= 1:
                rt = rtCount.get('n', -1)
                BEOPMongoDataAccess._logger.writeLog('success replace point count %d,  timeFrom:%s, timeTo:%s' %
                                                     (rt, strTimeFrom, strTimeTo), True)
        except Exception as e:
            BEOPMongoDataAccess._logger.writeLog(e.__str__(), True)
        return rt

    def replacePointNameInTimeRange(self, collectionname, strPointName, strTimeFrom, strTimeTo, strPointNameNew):
        rt = -1
        if not isinstance(strTimeFrom, str) or not isinstance(strTimeTo, str):
            return rt
        try:
            tFrom = datetime.strptime(strTimeFrom, '%Y-%m-%d %H:%M:%S')
            tTo = datetime.strptime(strTimeTo, '%Y-%m-%d %H:%M:%S')

            dictCondition = {'pointname': strPointName, 'time': {'$gte': tFrom, '$lt': tTo}}
            dictSet = {'pointname': strPointNameNew}
            rtCount = self.mdbBb[collectionname].update(dictCondition, {"$set": dictSet}, multi=True)

            bok = rtCount.get('ok', 0)
            if bok >= 1:
                rt = rtCount.get('n', -1)
                BEOPMongoDataAccess._logger.writeLog('success replace point count %d,  timeFrom:%s, timeTo:%s' %
                                                     (rt, strTimeFrom, strTimeTo), True)
        except Exception as e:
            BEOPMongoDataAccess._logger.writeLog(e.__str__(), True)
        return rt

    def deletePointByPTVCondition(self, collectionname, strPointName, strTimeFrom, strTimeTo, strValueCondition):
        rt = -1
        if strPointName is None or not isinstance(strTimeFrom, str) or not isinstance(strTimeTo, str):
            return rt
        try:
            tFrom = datetime.strptime(strTimeFrom, '%Y-%m-%d %H:%M:%S')
            tTo = datetime.strptime(strTimeTo, '%Y-%m-%d %H:%M:%S')

            rtCount = self.mdbBb[collectionname].remove({'time': {'$gt': tFrom, '$lt': tTo},
                                                         'pointname': strPointName, 'value': strValueCondition})

            bok = rtCount.get('ok', 0)
            if bok >= 1:
                rt = rtCount.get('n', -1)
                BEOPMongoDataAccess._logger.writeLog(
                    'success remove point count %d, name:%s, timeFrom:%s, timeTo:%s,value:%s' %
                    (rt, strPointName, strTimeFrom, strTimeTo, strValueCondition), True)
        except Exception as e:
            BEOPMongoDataAccess._logger.writeLog(e.__str__(), True)
        return rt

    def deletePointByPTV(self, collectionname, strPointName, strTime, strPointValue=None, bPatched=False,
                         dbversion='v2'):
        rt = -1
        if strPointName is None or not isinstance(strTime, str):
            return rt
        try:
            tDel = datetime.strptime(strTime, '%Y-%m-%d %H:%M:%S')
            if dbversion == 'm5':
                if strPointValue:
                    if bPatched:
                        rtCount = self.mdbBb[collectionname].remove(
                            {'time': tDel, 'pointname': strPointName, 'value': strPointValue,
                             'updateDBTime': {'$exists': True}})
                    else:
                        rtCount = self.mdbBb[collectionname].remove(
                            {'time': tDel, 'pointname': strPointName, 'value': strPointValue})
                else:
                    if bPatched:
                        rtCount = self.mdbBb[collectionname].remove(
                            {'time': tDel, 'pointname': strPointName, 'updateDBTime': {'$exists': True}})
                    else:
                        rtCount = self.mdbBb[collectionname].remove({'time': tDel, 'pointname': strPointName})
                bok = rtCount.get('ok', 0)
                if bok >= 1:
                    rt = rtCount.get('n', -1)
                    BEOPMongoDataAccess._logger.writeLog('success remove point count %d, name:%s, time:%s, value:%s' % (
                    rt, strPointName, strTime, strPointValue), True)
            else:
                tDelDay = datetime(year=tDel.year, month=tDel.month, day=tDel.day)
                fieldString = 'value.%s.%s' % (tDel.hour, tDel.minute)
                if strPointValue:
                    if bPatched:
                        a = self.mdbBb[collectionname].update_one(
                            {'time': tDelDay, 'pointname': strPointName, fieldString: strPointValue},
                            {'$unset': {fieldString: 1}})
                    else:
                        a = self.mdbBb[collectionname].update_one({'time': tDelDay, 'pointname': strPointName},
                                                                  {'$unset': {fieldString: 1}})
                else:
                    a = self.mdbBb[collectionname].update_one({'time': tDelDay, 'pointname': strPointName},
                                                              {'$unset': {fieldString: 1}})
                rtCount = 1
        except Exception as e:
            BEOPMongoDataAccess._logger.writeLog(e.__str__(), True)
        return rt

    def deleteFromMongoHistory(self, projId, collectionname, strPointName, strTime):
        rt = True
        try:
            v2_time = self.get_v2_struct_seperate_time(projId)
            tDel = datetime.strptime(strTime, '%Y-%m-%d %H:%M:%S')
            if v2_time:
                v2_time = datetime.strptime(v2_time, "%Y-%m-%d %H:%M:%S") if isinstance(v2_time, str) else v2_time
                dbversion = 'v2' if tDel >= v2_time else 'm5'
            else:
                dbversion = 'm5'
            if dbversion == 'm5':
                self.mdbBb['m5_data_' + collectionname].remove({'time': tDel, 'pointname': strPointName})
            else:
                tDelDay = datetime(year=tDel.year, month=tDel.month, day=tDel.day)
                fieldString = 'value.%s.%s' % (tDel.hour, tDel.minute)
                self.mdbBb['v2_data_' + collectionname].update_one({'time': tDelDay, 'pointname': strPointName},
                                                                   {'$unset': {fieldString: 1}})
        except Exception as e:
            BEOPMongoDataAccess._logger.writeLog(e.__str__(), True)
            rt = False
        return rt

    def deleteOnePoint(self, collectionname, pointName):
        rt = False
        try:
            endObject = datetime.now()
            startObject = endObject - timedelta(days=7)
            self.mdbBb[collectionname].remove(
                {'pointname': pointName, 'time': {'$gte': startObject, '$lte': endObject}})
            rt = True
        except Exception as e:
            BEOPMongoDataAccess._logger.writeLog('deleteOnePoint failed:' + e.__str__(), True)
        return rt

    def getFaultClassify(self, projId, module_name_list):
        rt = {}
        cursor = None
        projId = int(projId)
        try:
            if module_name_list:
                collection_name = "fault_data_{0}".format(projId)
                cursor = self.mdbBb[collection_name].aggregate(
                    [{'$match': {'name': {'$in': module_name_list}}},
                     {'$project': {'name': 1, 'value': 1, 'time': 1}},
                     {'$sort': {'name': pymongo.ASCENDING, 'time': pymongo.DESCENDING}},
                     {'$group': {'_id': "$name",
                                 # 'time':{'$first':"$time"},
                                 # 'mTime':{'$first':'$mTime'},
                                 # 'grade':{'$first':'$grade'},
                                 'value': {'$first': '$value'},
                                 # 'energy':{'$first':'$energy'},
                                 # 'bindPoints':{'$first':'$bindPoints'},
                                 # 'suggestion':{'$first':'$suggestion'},
                                 # 'problem':{'$first':'$problem'},
                                 # 'affect':{'$first':'$affect'},
                                 # 'analysis':{'$first':'$analysis'},
                                 # 'risk':{'$first':'$risk'},
                                 # 'riskType':{'$first':'$riskType'},
                                 'statistcs': {'$push': '$value'}
                                 }
                      }
                     ], allowDiskUse=True)
                for item in cursor.batch_size(600):
                    statistcs = item.get('statistcs', [])
                    count = 0
                    for s in statistcs:
                        if s == 1: count += 1
                    rt[item.get('_id')] = {'value': item.get('value'),
                                           # 'time':item.get('time').strftime('%Y-%m-%d %H:%M:%S'),
                                           # 'mTime': item.get('mTime').strftime('%Y-%m-%d %H:%M:%S'),
                                           # 'grade': item.get('grade'),
                                           # 'energy': item.get('energy'),
                                           # 'bindPoints': item.get('bindPoints'),
                                           # 'suggestion': item.get('suggestion'),
                                           # 'affect': item.get('affect'),
                                           # 'analysis': item.get('analysis'),
                                           # 'risk': item.get('risk'),
                                           # 'riskType': item.get('riskType'),
                                           'count': count
                                           }
        except Exception as e:
            print('getFaultClassify error:' + e.__str__())
            logging.error('getFaultClassify error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    def getHisFault_by_name(self, projId, name, s_time, e_time):
        projId = int(projId)
        try:
            collection_name = "fault_data_{0}".format(projId)
            cursor = self.mdbBb[collection_name].find({'name': name, 'time': {'$gte': s_time, '$lte': e_time}})
            if cursor:
                total = cursor.count()
                records = []
                for item in cursor:
                    item['_id'] = str(item.get('_id'))
                    item['time'] = item.get('time').strftime('%Y-%m-%d %H:%M:%S')
                    item['mTime'] = item.get('mTime').strftime('%Y-%m-%d %H:%M:%S')
                    records.append(item)
        except Exception as e:
            print('getHisFault_by_name error:' + e.__str__())
            logging.error('getHisFault_by_name error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return {'total': total, 'records': records}

    def patch_data_sharp_clock(self, cn, pointList, tmObj, strSource='', nQueryDays=1):
        rt = []
        rtCount = 0
        cursor = None
        try:
            # 获取最后数据时间
            cursor = self.mdbBb[cn].find_one({'time': {'$gt': tmObj}, 'value': {'$nin': [None, 'Null', 'None']}})
            if not cursor and tmObj > datetime.now():
                # 补数出现未来数据（后面找不到更新时间）
                if cursor:
                    cursor.close()
                return (None, 0)

            cursor = self.mdbBb[cn].find_one({'time': {'$lt': tmObj}, 'value': {'$nin': [None, 'Null', 'None']}})
            if not cursor:
                if cursor:
                    cursor.close()
                return (None, 0)

            insert_list = []
            exist_list = set()
            before_tmObj = tmObj - timedelta(days=nQueryDays)
            # get exist points
            cursor = self.mdbBb[cn].find({'pointname': {'$in': pointList}, 'time': tmObj,
                                          'value': {'$nin': [None, 'Null', 'None']}})
            for item in cursor:
                exist_list.add(item.get('pointname'))
            # calc lost points
            lost_list = set(pointList) - exist_list
            if len(lost_list) == 0:
                return (None, 0)
            # use query to get data at nearest data
            find_list = set()
            t1 = datetime.now()
            for pt in lost_list:
                item = self.mdbBb[cn].find_one({'pointname': pt, 'time': {'$gte': before_tmObj, '$lt': tmObj},
                                                'value': {'$nin': [None, 'Null', 'None']}},
                                               sort=[('pointname', pymongo.ASCENDING), ('time', pymongo.DESCENDING)])
                if item:
                    name = item.get('pointname')
                    if isinstance(name, list):
                        if len(name) == 1:
                            name = name[0]
                    nTimeType = getTimeType(tmObj)
                    insert_list.append(son.SON(data={'time': tmObj, 'pointname': name, 'value': item.get('value'),
                                                     'updateDBTime': datetime.now(), 'tt': nTimeType,
                                                     'source': strSource}))
                    find_list.add(name)
            t2 = datetime.now()
            sec = int((t2 - t1).total_seconds())
            if sec > 10:
                BEOPMongoDataAccess._logger.writeLog(
                    'patch_data cost %s seconds,lost_point=%s,time=%s' % (sec, str(lost_list), str(tmObj)), True)
            # cursor = self.mdbBb[cn].aggregate(
            #     [{
            #         '$match': {
            #                   'pointname': {'$in':list(lost_list)},
            #                   'time': {'$gte':before_tmObj, '$lt':tmObj},
            #                   'value':{'$nin':[None, 'Null', 'None']}
            #                  }
            #      },
            #      {'$sort': {'pointname': pymongo.ASCENDING, 'time': pymongo.DESCENDING}},
            #      {'$group': {'_id': "$pointname",
            #                  'time': {'$first': "$time"},
            #                  'value': {'$first': '$value'}
            #                  }
            #       }
            #      ], allowDiskUse=True)
            # find_list = set()
            # for item in cursor:
            #     name = item.get('_id')
            #     if isinstance(name, list):
            #         if len(name) == 1:
            #             name = name[0]
            #     nTimeType = getTimeType(tmObj)
            #     insert_list.append(son.SON(data={'time':tmObj, 'pointname':name, 'value':item.get('value'), 'updateDBTime':datetime.now(),'tt':nTimeType}))
            #     find_list.add(name)
            rt = list(lost_list - find_list)
            if insert_list:
                self.mdbBb[cn].delete_many(
                    {'pointname': {'$in': [x.get('pointname') for x in insert_list]}, 'time': tmObj,
                     'value': {'$nin': [None, 'Null', 'None']}})
                self.mdbBb[cn].insert(insert_list)
                rtCount = len(insert_list)

        except Exception as e:
            print('patch_data_sharp_clock error:' + e.__str__())
            logging.error('patch_data_sharp_clock error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return (rt, rtCount)

    def patch_data_sharp_clock_with_value(self, cn, pointList, tmObj):
        rt = []
        rtCount = 0
        cursor = None
        rt_mapping = []
        pointListFilter = []
        try:
            b_t = tmObj - timedelta(days=2)
            a_t = tmObj + timedelta(days=2)
            for p in pointList:
                if tmObj >= datetime.now() - timedelta(hours=24):
                    continue
                r_b_t = self.mdbBb[cn].find_one({'pointname': p, 'time': {'$gte': b_t, '$lte': tmObj},
                                                 'value': {'$nin': [None, 'Null', 'None']}})
                if r_b_t is None:
                    continue
                r_a_t = self.mdbBb[cn].find_one({'pointname': p, 'time': {'$gte': tmObj, '$lte': a_t},
                                                 'value': {'$nin': [None, 'Null', 'None']}})
                if r_b_t and r_a_t and tmObj <= datetime.now():
                    pointListFilter.append(p)
            if pointListFilter:
                insert_list = []
                exist_list = set()
                before_tmObj = tmObj - timedelta(days=1)
                cursor = self.mdbBb[cn].find({'pointname': {'$in': pointListFilter}, 'time': tmObj,
                                              'value': {'$nin': [None, 'Null', 'None']}})
                for item in cursor:
                    exist_list.add(item.get('pointname'))
                lost_list = set(pointListFilter) - exist_list
                if len(lost_list) == 0:
                    return (None, 0)
                t1 = datetime.now()
                for pt in lost_list:
                    item = self.mdbBb[cn].find_one({'pointname': pt, 'time': {'$gte': before_tmObj, '$lt': tmObj},
                                                    'value': {'$nin': [None, 'Null', 'None']}},
                                                   sort=[('pointname', pymongo.ASCENDING),
                                                         ('time', pymongo.DESCENDING)])
                    if item:
                        name = item.get('pointname')
                        if isinstance(name, list):
                            if len(name) == 1:
                                name = name[0]
                        nTimeType = getTimeType(tmObj)
                        insert_list.append(son.SON(data={'time': tmObj, 'pointname': name, 'value': item.get('value'),
                                                         'updateDBTime': datetime.now(), 'tt': nTimeType,
                                                         'source': 'queryPatch'}))
                        rt_mapping.append((name, item.get('value')))
                t2 = datetime.now()
                sec = int((t2 - t1).total_seconds())
                if sec > 10:
                    BEOPMongoDataAccess._logger.writeLog(
                        'patch_data cost %s seconds,lost_point=%s,time=%s' % (sec, str(lost_list), str(tmObj)), True)
                if insert_list:
                    self.mdbBb[cn].delete_many(
                        {'pointname': {'$in': [x.get('pointname') for x in insert_list]}, 'time': tmObj,
                         'value': {'$nin': [None, 'Null', 'None']}})
                    self.mdbBb[cn].insert(insert_list)
                    rtCount = len(insert_list)

        except Exception as e:
            print('patch_data_sharp_clock_with_value error:' + e.__str__())
            logging.error('patch_data_sharp_clock_with_value error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rtCount, rt_mapping

    def get_fault_last_update_time_status(self, cn, name):
        rt = {}
        try:
            ret = self.mdbBb[cn].find_one({'name': name, 'value': {'$in': [0, 1]}}, {'_id': 0},
                                          sort=[('time', pymongo.DESCENDING)])
            if ret:
                rt.update(**ret)
        except Exception as e:
            print('get_fault_last_update_time_status error:' + e.__str__())
            logging.error('get_fault_last_update_time_status error:' + e.__str__())
        return rt

    def updateAlarmHistoryData(self, alarm_id, pointName, alarm_time, alarm_result, alarm_type, dbNameMongo):
        result = False
        try:
            if len(alarm_id) > 0 and isinstance(alarm_time, datetime):
                if alarm_result != 1:
                    self.mdbBb[dbNameMongo].update_many({'alarm_id': alarm_id, 'alarm_time': alarm_time}
                                                        , {'$set': {'alarm_id': alarm_id, 'alarm_time': alarm_time
                            , 'pointName': pointName, 'alarm_result': alarm_result
                            , 'mTime': datetime.now(), 'alarm_type': alarm_type}}, True)
                    # self.mdbBb[dbNameMongo].create_index([('alarm_id',pymongo.ASCENDING),('alarm_time',pymongo.ASCENDING)])
                    result = True
        except Exception as e:
            BEOPMongoDataAccess._logger.writeLog('saveFaultHistoryData error:' + e.__str__(), True)
        return result

    def insertAlarmHistoryData(self, alarm_result_list, dbNameMongo):
        result = False
        try:
            if len(alarm_result_list) > 0:
                self.mdbBb[dbNameMongo].insert_many(alarm_result_list)
                self.mdbBb[dbNameMongo].create_index(
                    [('alarm_id', pymongo.ASCENDING), ('alarm_time', pymongo.ASCENDING)])
                result = True
        except Exception as e:
            BEOPMongoDataAccess._logger.writeLog('saveFaultHistoryData error:' + e.__str__(), True)
        return result

    def getAlarmHistoryData(self, alarm_id_list, startObject, endObject, dbNameMongo):
        result = {}
        cursor = []
        try:
            if len(alarm_id_list) > 0 and isinstance(startObject, datetime) and isinstance(endObject, datetime):
                cursor = self.mdbBb[dbNameMongo].find(
                    {'alarm_id': {'$in': alarm_id_list}, 'alarm_time': {'$gte': startObject, '$lte': endObject}})
                result = [item for item in cursor]
        except Exception as e:
            BEOPMongoDataAccess._logger.writeLog('getAlarmHistoryData error:' + e.__str__(), True)
        if cursor:
            cursor.close()
        return result

    def get_data_str(self, dbname, pointList, timeStart, timeEnd, timeFormat, lteFlag):
        if dbname.startswith(app.config['M5FORMAT']):
            startObject = datetime.strptime(timeStart, '%Y-%m-%d %H:%M:%S')
            endObject = datetime.strptime(timeEnd, '%Y-%m-%d %H:%M:%S')
            tl = []
            tl_str = []
            tl_rt = []
            nl = []
            tndict = {}
            if isinstance(pointList, list):
                post = {}
                if timeFormat == 'm1':
                    if lteFlag:
                        if pointList:
                            post = {'pointname': {'$in': pointList}, 'time': {'$gte': startObject, '$lte': endObject}}
                        else:
                            post = {'time': {'$gte': startObject, '$lte': endObject}}
                    else:
                        if pointList:
                            post = {'pointname': {'$in': pointList}, 'time': {'$gte': startObject, '$lt': endObject}}
                        else:
                            post = {'time': {'$gte': startObject, '$lt': endObject}}
                else:
                    if timeFormat == 'h1':
                        curTime = self.get_nearest_start_m5_obj(startObject)
                        while curTime <= endObject:
                            tl.append(curTime)
                            curTime += timedelta(hours=1)
                            if (not lteFlag) and curTime >= endObject:
                                break
                    elif timeFormat == 'd1':
                        curTime = self.get_nearest_start_m5_obj(startObject)
                        while curTime <= endObject:
                            tl.append(curTime)
                            curTime += timedelta(days=1)
                            if (not lteFlag) and curTime >= endObject:
                                break
                    elif timeFormat == 'M1':
                        curTime = self.get_nearest_start_m5_obj(startObject)
                        while curTime <= endObject:
                            tl.append(curTime)
                            days = None
                            if isLeap(curTime.year):
                                days = _leapMonth[curTime.month - 1]
                            else:
                                days = _NonLeapMonth[curTime.month - 1]
                            curTime += timedelta(days=days)
                            if (not lteFlag) and curTime >= endObject:
                                break
                    elif timeFormat == 'm5':
                        curTime = self.get_nearest_start_m5_obj(startObject)
                        while curTime <= endObject:
                            tl.append(curTime)
                            curTime += timedelta(minutes=5)
                            if (not lteFlag) and curTime >= endObject:
                                break
                    if lteFlag:
                        if pointList:
                            post = {'pointname': {'$in': pointList},
                                    'time': {'$in': tl, '$gte': startObject, '$lte': endObject}}
                        else:
                            post = {'time': {'$in': tl, '$gte': startObject, '$lte': endObject}}
                    else:
                        if pointList:
                            post = {'pointname': {'$in': pointList},
                                    'time': {'$in': tl, '$gte': startObject, '$lt': endObject}}
                        else:
                            post = {'time': {'$in': tl, '$gte': startObject, '$lt': endObject}}
                    collectionName = dbname
                    try:
                        cursor = self.mdbBb[collectionName].find(post).sort(
                            [('time', pymongo.ASCENDING), ('pointname', pymongo.ASCENDING)])
                        for item in cursor.batch_size(600):
                            t = item.get('time').strftime('%Y-%m-%d %H:%M:%S')
                            n = item.get('pointname')
                            if isinstance(n, list):
                                if len(n) == 1:
                                    n = n[0]
                            v = str(item.get('value'))
                            if n not in nl:
                                nl.append(n)
                            tndict.update({(t, n): v})
                            if t not in tl_rt:
                                tl_rt.append(t)
                    except Exception as e:
                        BEOPMongoDataAccess._logger.writeLog('get_data error:' + e.__str__(), True)
                    finally:
                        if cursor:
                            cursor.close()
                if tl:
                    tl_str = [x.strftime('%Y-%m-%d %H:%M:%S') for x in tl]
            return tl_str, nl, tndict
        # 新的v2格式
        else:
            tl, tl_str, tl_rt, nl, tndict = [], [], [], [], {}
            f = lambda x: True if datetime.strptime(timeStart, '%Y-%m-%d %H:%M:%S') <= x <= datetime.strptime(timeEnd,
                                                                                                              '%Y-%m-%d %H:%M:%S') else False
            startObject = datetime.strptime(timeStart, '%Y-%m-%d %H:%M:%S').replace(hour=0, minute=0, second=0,
                                                                                    microsecond=0)
            endObject = datetime.strptime(timeEnd, '%Y-%m-%d %H:%M:%S').replace(hour=0, minute=0, second=0,
                                                                                microsecond=0)
            self.getTimeListByFormat(timeFormat, datetime.strptime(timeStart, '%Y-%m-%d %H:%M:%S')
                                     , datetime.strptime(timeEnd, '%Y-%m-%d %H:%M:%S'), tl)
            fixSpan = timedelta(days=5) if timeFormat == 'M1' else timedelta(days=2)
            dayStartQueryObject = startObject - fixSpan
            dayEndQueryObject = endObject
            if isinstance(pointList, list):
                if timeFormat != 'M1':
                    query = {'time': {'$gte': dayStartQueryObject, '$lte': dayEndQueryObject},
                             'pointname': {'$in': pointList}}
                else:
                    query = {'time': {'$in': tl}, 'pointname': {'$in': pointList}}
                # post = {'pointname': {'$in': pointList}, 'time': startObject}
                cursor = self.mdbBb[dbname].find(query).sort(
                    [('time', pymongo.ASCENDING), ('pointname', pymongo.ASCENDING)])
                for item in cursor:
                    t = item.get('time')
                    t = datetime.strptime(t, '%Y-%m-%d %H:%M:%S') if isinstance(t, str) else t
                    pt = item.get('pointname')
                    pt = pt[0] if isinstance(pt, list) and len(pt) == 1 else pt
                    valueDict = item.get('value')
                    for h, v in valueDict.items():
                        for m, value in v.items():
                            if int(m) % 5 == 0:
                                pt_time = t.replace(hour=int(h), minute=int(m))
                                if f(pt_time) and pt_time in tl:
                                    tndict.update({(pt_time.strftime('%Y-%m-%d %H:%M:%S'), pt): str(value)})
                                    if pt_time not in tl_rt:
                                        tl_rt.append(pt_time)
                    if pt not in nl:
                        nl.append(pt)
                tl_rt = sorted(tl_rt)
                tl_str = [x.strftime('%Y-%m-%d %H:%M:%S') for x in tl_rt]
            return tl_str, nl, tndict

    def get_latest_time(self, collectionname):
        rt = self.mdbBb[collectionname].find_one(sort=[('time', pymongo.DESCENDING)])
        return rt.get('time') if rt else None

    def getHistoryDataByFormat_v2(self, dbname, pointList, timeStart, timeEnd, timeFormat, bSearchNearest=False,
                                  noSearchBeforeStartTime=None, nearestDays=None):
        startObject = datetime.strptime(timeStart, '%Y-%m-%d %H:%M:%S')
        endObject = datetime.strptime(timeEnd, '%Y-%m-%d %H:%M:%S')
        nearestDays = 2 if nearestDays is None else nearestDays
        if not noSearchBeforeStartTime:
            fixSpan = timedelta(days=5) if timeFormat == 'M1' else timedelta(days=nearestDays)
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
                if isinstance(pn, dict):
                    propDict.update(**pn)
                else:
                    point_list.append(pn)
            length = len(point_list)
            if length > 0:
                try:
                    self.getHisDataFromDB(collectionName, timeFormat, dayStartQueryObject, dayEndQueryObject,
                                          startObject,
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
                        prop_record.append({'time': t, 'value': v})
                    data.append({'pointname': '%s.%s' % (key, prop), 'record': prop_record})
        return data

    def getNextTimeByFormat(self, timeObject, timeFormat):
        timeObject = self.get_nearest_start_m5_obj(timeObject)
        if timeFormat in ['m1', 'm5', 'h1', 'd1', 'M1']:
            if timeFormat == 'm1':
                timeObject += timedelta(minutes=1)
            elif timeFormat == 'm5':
                timeObject += timedelta(minutes=5)
            elif timeFormat == 'h1':
                timeObject += timedelta(hours=1)
            elif timeFormat == 'd1':
                timeObject += timedelta(days=1)
            elif timeFormat == 'M1':
                if isLeap(timeObject.year):
                    days = _leapMonth[timeObject.month - 1]
                else:
                    days = _NonLeapMonth[timeObject.month - 1]
                timeObject += timedelta(days=days)
            return timeObject
        return False

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
                curTime = start_m
                while curTime <= end_m:
                    tl.append(curTime)
                    range = calendar.monthrange(curTime.year, curTime.month)
                    curTime += timedelta(days=range[1])

    def getHisDataFromDB(self, collectionName, timeFormat, dayStartQueryObject, dayEndQueryObject, startObject,
                         endObject, point_list, data, bSearchNearest=False):
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
                    query = {'time': {'$gte': dayStartQueryObject, '$lte': dayEndQueryObject},
                             'pointname': {'$in': pts}}
                else:
                    query = {'time': {'$in': tl}, 'pointname': {'$in': pts}}
                cursor = self.mdbBb[collectionName].find(query, {'time': 1, 'pointname': 1, 'value': 1, '_id': 0}).sort(
                    [('pointname', pymongo.ASCENDING), ('time', pymongo.ASCENDING)])

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
                                        if findValue not in [None, 'Null', 'None', 'NaN'] and \
                                                (not isinstance(findValue, float) or not math.isnan(findValue)):
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
                        cursor = self.mdbBb[collectionName].find(
                            {'time': {'$gte': dayStartQueryObject, '$lte': startObject}, 'pointname': {'$in': pts}},
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
        except Exception as e:
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

    def get_nearest_data_from_table_v2(self, collectionName, tmObject, ptName, minutesBefore):
        startObj = tmObject - timedelta(minutes=minutesBefore)
        endObj = tmObject

        startQueryObj = startObj.replace(hour=0, minute=0, second=0, microsecond=0)
        endQueryObj = endObj.replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)

        try:
            cursor = self.mdbBb[collectionName].find(
                {'time': {'$gte': startQueryObj, '$lt': endQueryObj}, 'pointname': ptName}) \
                .sort([('time', pymongo.DESCENDING)])
            for item in cursor.batch_size(1000):
                item_time = item.get('time')
                item_value = item.get('value')
                for h in range(23, -1, -1):
                    h_item = item_value.get(str(h))
                    if h_item:
                        for m in range(59, -1, -1):
                            t = item_time.replace(hour=int(h), minute=int(m))
                            if t >= startObj and t <= endObj:
                                v = h_item.get(str(m))
                                if v is not None:
                                    return v
        except Exception as e:
            print(e)
        finally:
            if cursor:
                cursor.close()
        return None

    def get_v2_struct_seperate_time(self, id):
        try:
            id = int(id)
            projectInfoList = RedisManager.get_project_info_list()
            if projectInfoList is None or type(projectInfoList) is not list:
                return None
            for item in projectInfoList:
                if int(item['id']) == int(id):
                    return item.get('v2_time')
        except Exception as e:
            print(e.__str__())
            logging.error('get_v2_struct_seperate_time error:' + e.__str__())
        return None

    def updateHistoryDataMultiEx(self, dataList, dbNameMongo, runMode=1):
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
                        pointTime = datetime.strptime(dataList[index][0], '%Y-%m-%d %H:%M:%S') if isinstance(
                            dataList[index][0], str) else dataList[index][0]
                        tmDate = pointTime.replace(hour=0, minute=0, second=0, microsecond=0)
                        hour = str(pointTime.hour)
                        min = str(pointTime.minute)
                        pointName = dataList[index][1]
                        pointValue = dataList[index][2]
                        # if len(str(pointValue)) > 1000:
                        #     continue
                        # if runMode != 0:
                        arrReq.append(UpdateOne({'pointname': pointName, 'time': tmDate},
                                                {'$set': {'value.' + hour + '.' + min: pointValue}}, True))
                        # else:
                        #     r = self.mdbBb[dbName].find_one({'pointname':pointName,'value.' + hour + '.' + min:{'$exists':True}, 'time':tmDate})
                        #     if r is None:
                        #         arrReq.append(UpdateOne({'pointname': pointName, 'time': tmDate},
                        #                             {'$set': {'value.' + hour + '.' + min: pointValue}}, True))
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
            logging.error('updateHistoryDataMultiEx error:' + e.__str__())
        return nUpdateSrcLen

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

    def get_work_order_state(self, ids):
        collection = 'WorkflowTask'
        cursor = None
        rt = []
        try:
            cursor = self.mdbBb[collection].find({'_id': {'$in': ids}}, projection={'_id': 1, 'status': 1})
            rt.extend(list(cursor))
        except Exception as e:
            print('get_work_order_state error:' + e.__str__())
            logging.error(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    def get_weather_data(self, stationId, searchTime):
        cursor = None
        rv = None
        try:
            cursor = self.mdbBb[stationId].find({'utc_time': get_time_thisday_start(searchTime[1])[0]})
            for item in cursor:
                item_value = item.get('value')
                hour = searchTime[0].hour
                rv = item_value.get(str(hour))
                if rv:
                    rv = rv.get('0')
                    if rv:
                        return rv
        except Exception as e:
            print(e.__str__())
            logging.error(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return None

    def getWeatherCondByOpenId(self, openId):
        cursor = None
        rv = None
        try:
            dbname = 'Weather_kindsInfo'
            cursor = self.mdbBb[dbname].find({"_id": openId})
            for item in cursor:
                return item
        except Exception as e:
            print(e.__str__())
            logging.error(e.__str__())
            rv = False
        finally:
            if cursor:
                cursor.close()
        return rv

    # todo david
    def mayiping(self):
        pass

    def chunks(self, l, n):
        for i in range(0, len(l), n):
            yield l[i:i + n]

    def get_nearest_data_from_prefetch(slef, f_t_m, pt, fixTime):
        for item in fixTime:
            if item.get('n') == pt:
                if item.get('t') < f_t_m:
                    return item.get('v')
        return None

    def get_query_m5_time_list(self, start, end):
        rt = []
        try:
            cur = start
            while (cur <= end):
                rt.append(cur.strftime('%Y-%m-%d %H:%M:%S'))
                cur += timedelta(minutes=5)
        except Exception as e:
            print('get_query_day_time_list failed')
            print(e.__str__())
        return rt

    def get_time_limit_from_table(self, pointname, dbname, format):
        st = None
        et = None
        try:
            collectionName = '%s_data_' % (format,) + dbname
            st_r = self.mdbBb[collectionName].find_one({'pointname': pointname}, sort=[('time', pymongo.ASCENDING)])
            if st_r:
                st = st_r.get('time')
            et_r = self.mdbBb[collectionName].find_one({'pointname': pointname}, sort=[('time', pymongo.DESCENDING)])
            if et_r:
                et = et_r.get('time')
        except Exception as e:
            print('get_time_limit_from_table failed')
            print(e.__str__())
        return (st, et)

    def get_query_hour_time_list(self, start, end):
        rt = []
        try:
            cur = start
            while (cur <= end):
                rt.append(cur.strftime('%Y-%m-%d %H:%M:%S'))
                cur += timedelta(hours=1)
        except Exception as e:
            print('get_query_hour_time_list failed')
            print(e.__str__())
        return rt


