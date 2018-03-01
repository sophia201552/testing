# -*- encoding=utf-8 -*-

import calendar
from ExpertContainer import app
from ExpertContainer.api.errorLog import errorLog
from ExpertContainer.api.cacheProfile import DataManager
from ExpertContainer.api.CacheManager import CacheManager
from ExpertContainer.api.utils import *
from ExpertContainer.logic.DiagnosisBase import DiagnosisBase
from ExpertContainer.api.api import PostMessageQueueMethods
from ExpertContainer.api.api import RealtimeDataMethods, DataAlarmInfo
from ExpertContainer.api.ArchiveManager import ArchiveManager
import traceback
from shelve import Shelf
import random
from ExpertContainer.api.CacheManager import CacheManager
from ExpertContainer.api.cacheProfile import HistoryDataMethods
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from ExpertContainer.dbAccess.BEOPMongoDataAccess import BEOPMongoDataAccess
from ExpertContainer.dbAccess.MongoConnManager import MongoConnManager
from datetime import datetime, timedelta
import requests, json
from ExpertContainer.logic.FaultNotice import FaultNotice
import numpy
from ExpertContainer.api.api import ToolsMethods
from ExpertContainer.api.BeopTools import BeopTools
from ExpertContainer.dbAccess import mongo_operator
from ExpertContainer.dbAccess.RedisManager import RedisManager
import paho.mqtt.client as mqtt
from ExpertContainer.api.HttpTestTool import HttpTestTool
from ExpertContainer.api.Air import Air
from selenium import webdriver
from ExpertContainer.mqAccess.MQManager import MQManager
from bs4 import BeautifulSoup
from ExpertContainer.mod_log.FileLogger import FileLogger
from ExpertContainer.diagnosis.service import DiagnosisService

g_weather_conn = BEOPMongoDataAccess(app.config.get('WEATHER_DB_IP'), False, 'weatherdata')
testDiagStaticsAll_logger = FileLogger('testDiagStaticsAll.log')


class LogicBase:
    REALTIME = 0
    REPAIR_HISTORY = 1
    ONLINE_TEST_REALTIME = 2
    ONLINE_TEST_HISTORY = 3
    _logger = LogOperator()

    # _errorLog =errorLog()

    def __init__(self, projId, acttime, period=None, nMode=0, ):
        self._actTime = acttime
        self._period = period
        self._obid = None
        self._nMode = nMode  # 0:realtime,1:history, add by golding
        self.cacheManager = CacheManager()
        self._connList = None
        self._collectionNameBase = None
        self._projId = projId
        self.debugInfo = []
        self.curCalName = None
        self.ptCloudSitePoints = None  # 云点中现场点的映射关系
        self._lastDay = None
        self.message_mapping = {}

    def sys_get_mq_count(self, strQueneName):
        return MQManager.getMessageCount(strQueneName)

    def get_act_time(self):
        return self._actTime

    def time_to_string(self, actTime):
        tmStr = None
        try:
            if isinstance(actTime, datetime):
                tmStr = actTime.strftime(standard_time_format)
        except Exception as e:
            self.writeFileLog(0, '%s:' % (get_current_func_name()) + e.__str__())
        return tmStr

    def time_from_string(self, actTime):
        tmObj = None
        try:
            if isinstance(actTime, str):
                tmObj = datetime.strptime(actTime, standard_time_format)
        except Exception as e:
            self.writeFileLog(0, '%s:' % (get_current_func_name()) + e.__str__())
        return tmObj

    def set_act_time(self, actTime):
        self._actTime = actTime

    def set_period(self, period):
        self._period = period

    def set_obid(self, obid):
        self._obid = obid

    def get_period(self):
        return self._period

    def set_mongo_conn(self, connList, collectionnameBase):
        self._connList = connList
        self._collectionNameBase = collectionnameBase

    def before_actlogic(self):
        self.initDataCacheFromRealtimeData()

    def before_actlogic_diagnosis(self):
        self.initDataCacheDiagnosis()

    def after_actlogic(self):
        self.cacheManager.remove_history_cache()

    def actlogic(self):
        pass

    def filterPoint(self, projId, pointName):
        try:
            bSameProject = (int(self._projId) == int(projId))
            ptNewName = None
            if not bSameProject:
                ptCloud = mongo_operator.getCloudPointSiteType(projId)
                ptNewName = ptCloud.get(pointName)
            else:
                ptNewName = self.ptCloudSitePoints.get(pointName)

            if ptNewName is not None and len(ptNewName) > 0:
                return ptNewName
            else:
                return pointName
        except Exception as e:
            return pointName

    def filterPointList(self, projId, pointNameList):
        rvList = []
        ptCloud = None
        bSameProject = (int(self._projId) == int(projId))
        if not bSameProject:
            ptCloud = mongo_operator.getCloudPointSiteType(projId)

        for pointName in pointNameList:
            try:
                ptNewName = None
                if not bSameProject:
                    ptNewName = ptCloud.get(pointName)
                else:
                    ptNewName = self.ptCloudSitePoints.get(pointName)

                if ptNewName is not None and len(ptNewName) > 0:
                    rvList.append(ptNewName)
                else:
                    rvList.append(pointName)
            except Exception as e:
                rvList.append(pointName)
        return rvList

    def get_data_time_range(self, projId, pointList, timeStart, timeEnd, timePeriod, nearestDays=None):
        pointList = self.filterPointList(projId, pointList)
        return DataManager.get_history_data(projId, pointList, timeStart, timeEnd, timePeriod, nearestDays)

    def set_data_time_range(self, projId, timeFormat, pointNameList, pointValueList, pointTimeLabelList):
        insert_data = []
        if len(pointNameList) == len(pointValueList) == len(pointTimeLabelList):
            for index in range(len(pointTimeLabelList)):
                insert_data.append({'timeFormat': timeFormat, 'projId': projId, 'pointName': pointNameList[index],
                                    'pointValue': pointValueList[index],
                                    'timeAt': pointTimeLabelList[index].strftime(standard_time_format) if isinstance(
                                        pointTimeLabelList[index], datetime) else pointTimeLabelList[index]})
        if insert_data:
            return DataManager.set_history_data({'setList': insert_data}, runMode=self._nMode)
        return False

    def get_weather_data(self):
        rv = None
        time_zone = BEOPDataAccess.getInstance().get_project_time_zone_by_id(self._projId)
        if not time_zone:
            return None
        searchTimeObj = self.get_act_time() + timedelta(hours=-time_zone)
        searchTime = get_time_thishour_start(searchTimeObj.strftime(standard_time_format))
        stationId = BEOPDataAccess.getInstance().getStationIdByProjId(self._projId)
        if not stationId:
            raise Exception('StationId is None')
        weatherDict = g_weather_conn.get_weather_data(stationId, searchTime)
        if weatherDict:
            rv = weatherDict.get('heFeng')
            if not rv:
                openWeather = weatherDict.get('open')
                if openWeather:
                    main = openWeather.get('main')
                    tem = None
                    hum = None
                    heFengCode = None
                    heCh = None
                    if main:
                        temp = main.get('temp')
                        if temp:
                            tem = temp - 273
                        hum = main.get('humidity')
                    openCondList = openWeather.get('weather')
                    if openCondList:
                        if openCondList[0]:
                            openId = openCondList[0].get('id')
                            if openId:
                                kindsMapping = MongoConnManager.getConfigConn().getWeatherCondByOpenId(openId)
                                if kindsMapping:
                                    heFengCode = kindsMapping.get('heFengCode')
                                    heCh = kindsMapping.get('heCh')
                    rv = {'tmp': int(float(tem) + 0.5), "hum": hum, "cond": {"code": heFengCode, "txt": heCh}}
        return rv

    def get_data(self, projId, pointList):
        # no need try catch to let exception upflow
        return self.get_data_float(projId, pointList)

    def initDataCacheByValueLists(self, dataAll):
        if dataAll:
            for i in range(len(dataAll['nameList'])):
                self.cacheManager.write_cache(dataAll['timeList'][i], dataAll['nameList'][i], dataAll['valueList'][i])

    def initCloudSitePoints(self, cloudSitePointsAll):
        self.ptCloudSitePoints = cloudSitePointsAll

    def initDataCacheFromRealtimeData(self, ):
        if self._nMode == LogicBase.REALTIME:  # 读取实时数据表
            if self.cacheManager.isEmpty():
                rt = BEOPDataAccess.getInstance().getAllPointTimeValueList(self._projId)
                if rt:
                    for i in range(len(rt['nameList'])):
                        self.cacheManager.write_cache(rt['timeList'][i], rt['nameList'][i], rt['valueList'][i])
        elif self._nMode == LogicBase.ONLINE_TEST_REALTIME:
            pass
        else:  # 读取mongo # TODO 此处不兼容v2格式数据导致补数异常，有待解决
            rt = BEOPDataAccess.getInstance().getHistoryDataAtTime(self._projId,
                                                                   self._actTime.strftime(standard_time_format))
            for i in range(len(rt['nameList'])):
                self.cacheManager.write_cache(rt['timeList'][i], rt['nameList'][i], rt['valueList'][i])

    def initDataCacheDiagnosis(self, ):
        try:
            rt = BEOPDataAccess.getInstance().getBufferRTDataByProj(self._projId)
            # print(rt)
            if rt:
                for key in rt:
                    self.cacheManager.write_cache(None, key, rt.get(key))
        except Exception as e:
            self.writeFileLog(self._projId, '%s:' % (get_current_func_name()) + e.__str__())

    def get_data_at_lasttime(self, projId, pointName, timeout=60 * 60):
        rt = None
        try:
            rt = self.get_data(projId, pointName)
            if self._nMode == LogicBase.REALTIME or self._nMode == LogicBase.ONLINE_TEST_REALTIME:
                spak = datetime.now() - self._actTime
                if spak.seconds > timeout:
                    return None
        except Exception as e:
            self.writeFileLog(projId, '%s:' % (get_current_func_name()) + e.__str__())
        return rt

    def get_data_at_time(self, projId, pointList, timeStr, days=30, nearestDays=None):
        rt = None
        try:
            if isinstance(pointList, str):
                his = self.get_data_time_range(projId, [pointList], timeStr, timeStr, 'm5', nearestDays)
                if isinstance(his, list) and len(his) > 0 and ('error' in his[0]):
                    # retry
                    strLastUpdateTime = HistoryDataMethods.getLastUpdateTimeOfPoint(projId, pointList, timeStr, 'm5',
                                                                                    days)
                    if strLastUpdateTime is not None:
                        his = self.get_data_time_range(projId, [pointList],
                                                       strLastUpdateTime.strftime(standard_time_format),
                                                       strLastUpdateTime.strftime(standard_time_format), 'm5')
                if his:
                    for item in his:
                        if 'error' in item:
                            rt = None
                        else:
                            if 'history' in item:
                                h = item.get('history', [])
                                if h and len(h) > 0:
                                    if not isinstance(h[0].get('value'), dict):
                                        try:
                                            rt = float(h[0].get('value'))
                                        except:
                                            rt = h[0].get('value')
                                    else:
                                        rt = h[0].get('value')
                                else:
                                    rt = None
            elif isinstance(pointList, list):
                rt = [None] * len(pointList)
                his = self.get_data_time_range(projId, pointList, timeStr, timeStr, 'm5')
                if isinstance(his, list) and len(his) > 0 and ('error' in his[0]):
                    # retry
                    strLastUpdateTime = HistoryDataMethods.getLastUpdateTimeOfPoint(projId, pointList, timeStr, 'm5',
                                                                                    days)
                    his = self.get_data_time_range(projId, [pointList],
                                                   strLastUpdateTime.strftime(standard_time_format),
                                                   strLastUpdateTime.strftime(standard_time_format), 'm5', nearestDays)
                if his:
                    # for item in his:
                    #     if 'error' in item:
                    #         rt = None
                    #     else:
                    #         if 'history' in item:
                    #             h = item.get('history', [])
                    #             n = item.get('name')
                    #             ind = pointList.index(n)
                    #             if h and len(h) > 0:
                    #                 try:
                    #                     rt = float(h[0].get('value'))
                    #                 except:
                    #                     rt = h[0].get('value')
                    #             else:
                    #                 rt[ind] = None
                    for index, n in enumerate(pointList):
                        for item in his:
                            name = item.get('name')
                            if name == n:
                                if 'history' in item:
                                    data = item.get('history', [])
                                    try:
                                        rt[index] = float(data[0].get('value'))
                                    except:
                                        rt[index] = data[0].get('value')
                                break
        except Exception as e:
            self.writeFileLog(projId, '%s:' % (get_current_func_name()) + e.__str__())

        if self._nMode == LogicBase.ONLINE_TEST_REALTIME or self._nMode == LogicBase.ONLINE_TEST_HISTORY:
            self.debugInfo.append('get_data ( %s ) at_time (%s) = %s' % (str(pointList), timeStr, str(rt)))
        return rt

    def get_lost_time_ratio_of_today(self, projId, pointName):
        rt = 1.0
        try:
            tEnd = self.time_to_string(self._actTime)
            tBegin = self.time_get_day_begin()
            his = self.get_data_time_range(projId, [pointName], tBegin, tEnd, 'h1')
            if his:
                for item in his:
                    if 'error' in item:
                        rt = 1.0
                    else:
                        if 'history' in item:
                            h = item.get('history', [])
                            if h:
                                nFail = 0
                                for i in h:
                                    if i.get('error') is True:
                                        nFail += 1
                                if len(h) > 0:
                                    rt = float(nFail) / len(h)
                                else:
                                    rt = 1.0
                            else:
                                rt = None

        except Exception as e:
            self.writeFileLog(projId, '%s:' % (get_current_func_name()) + e.__str__())
        return rt

    def get_his_data_time_range(self, projId, pointList, t_start, t_end, timeFormat):
        rt = []
        try:
            if isinstance(pointList, str):
                his = self.get_data_time_range(projId, [pointList], t_start, t_end, timeFormat)
                if his:
                    for item in his:
                        if 'error' in item:
                            rt = None
                        else:
                            if 'history' in item:
                                h = item.get('history', [])
                                if h:
                                    for i in h:
                                        try:
                                            rt.append(float(i.get('value')))
                                        except:
                                            try:
                                                rt.append(i.get('value'))
                                            except:
                                                rt.append('None')
                                else:
                                    rt = None
            elif isinstance(pointList, list):
                his = self.get_data_time_range(projId, pointList, t_start, t_end, timeFormat)
                for l in pointList:
                    rt.append(l)
                if his:
                    for item in his:
                        temp = []
                        if 'error' in item:
                            rt = None
                        else:
                            if 'history' in item:
                                h = item.get('history', [])
                                n = item.get('name')
                                ind = pointList.index(n)
                                if h:
                                    for i in h:
                                        try:
                                            temp.append(float(i.get('value')))
                                        except:
                                            try:
                                                temp.append(i.get('value'))
                                            except:
                                                temp.append('None')
                                    rt[ind] = temp
                                else:
                                    rt = None
        except Exception as e:
            self.writeFileLog(projId, '%s:' % (get_current_func_name()) + e.__str__())
        return rt

    def get_data_float(self, projId, pointList):
        rt = []

        if isinstance(pointList, str):
            pointList = self.filterPoint(projId, pointList)
        else:
            pointList = self.filterPointList(projId, pointList)

        ret = self.get_data_original(projId, pointList)
        if isinstance(pointList, str):

            value = ret.get(pointList)
            if value is None:
                print("data(projId:%d, point:%s, time:%s) return None in mode: %d" %
                      (int(projId), str(pointList), self._actTime.strftime(standard_time_format), self._nMode))
            try:
                rt = None
                if value is not None:
                    if isinstance(value, str):
                        value = value.replace(',', '')
                    rt = float(value)
            except Exception as e:
                self.debugInfo.append(e.__str__())
                rt = None
        else:
            for pt in pointList:
                value = ret.get(pt, None)
                if value is None:
                    print("data(projId:%d, point:%s, time:%s) return None in mode: %d" %
                          (int(projId), str(pointList), self._actTime.strftime(standard_time_format), self._nMode))
                try:
                    rt.append(float(value) if value is not None else None)
                except Exception as e:
                    rt.append(None)

        if self._nMode == LogicBase.ONLINE_TEST_REALTIME or self._nMode == LogicBase.ONLINE_TEST_HISTORY:
            self.debugInfo.append('get_data(%s) = %s' % (str(pointList), str(rt)))
        return rt

    def get_data_int(self, projId, pointList):
        rt = []
        if isinstance(pointList, str):
            pointList = self.filterPoint(projId, pointList)
        else:
            pointList = self.filterPointList(projId, pointList)

        ret = self.get_data_original(projId, pointList)
        if isinstance(pointList, str):
            value = ret.get(pointList)
            rt = round(float(value)) if value is not None else None
        else:
            for pt in pointList:
                value = ret.get(pt, None)
                if value is None:
                    print("data(projId:%d, point:%s, time:%s) return None in mode: %d" %
                          (int(projId), str(pointList), self._actTime.strftime(standard_time_format), self._nMode))
                rt.append(round(float(value)) if value is not None else None)

        return rt

    def get_data_json(self, projId, pointList):
        rt = []
        if isinstance(pointList, str):
            pointList = self.filterPoint(projId, pointList)
        else:
            pointList = self.filterPointList(projId, pointList)

        ret = self.get_data_original(projId, pointList)
        if isinstance(pointList, str):
            value = ret.get(pointList)
            rt = self.json_to_data(str(value)) if value is not None else None
        else:
            for pt in pointList:
                value = ret.get(pt, None)
                if value is None:
                    print("data(projId:%d, point:%s, time:%s) return None in mode: %d" %
                          (int(projId), str(pointList), self._actTime.strftime(standard_time_format), self._nMode))
                rt.append(self.json_to_data(str(value)) if value is not None else None)

        return rt

    def get_data_string(self, projId, pointList):
        rt = []
        if isinstance(pointList, str):
            pointList = self.filterPoint(projId, pointList)
        else:
            pointList = self.filterPointList(projId, pointList)

        ret = self.get_data_original(projId, pointList)
        if isinstance(pointList, str):
            value = ret.get(pointList)
            rt = str(value) if value is not None else None
        else:
            for pt in pointList:
                value = ret.get(pt, None)
                if value is None:
                    print("data(projId:%d, point:%s, time:%s) return None in mode: %d" %
                          (int(projId), str(pointList), self._actTime.strftime(standard_time_format), self._nMode))
                rt.append(str(value) if value is not None else None)

        return rt

    def get_data_original(self, projId, pointList):

        rt = {}

        if self._actTime:
            if self._nMode == LogicBase.REALTIME or self._nMode == LogicBase.ONLINE_TEST_REALTIME:  # realtime mode
                if isinstance(pointList, str):
                    val = None
                    if projId != int(self._projId):  # 跨项目
                        rtQuery = BEOPDataAccess.getInstance().getBufferRTDataByProj(projId, [pointList])
                        val = rtQuery[pointList]
                    else:
                        val = self.cacheManager.read_cache(self.get_act_time().strftime(standard_time_format),
                                                           pointList)
                        if self._nMode == LogicBase.ONLINE_TEST_REALTIME and val is None:  # 实时测试时cache并不是全部点位
                            newDataInfo = BEOPDataAccess.getInstance().getFlag0and1PointTimeValueListInBufferTable(
                                projId, [pointList])  # 再去现场数据里补充取一次
                            newDataList = newDataInfo.get('valueList')
                            if newDataList and len(newDataList) > 0:
                                val = newDataList[0]
                    rt.update({pointList: val})
                    return rt
                elif isinstance(pointList, list):  # array for some apis
                    if projId != int(self._projId):  # 跨项目
                        for pt in pointList:
                            val = self.get_data_at_time(projId, pt, self.get_act_time().strftime(standard_time_format))
                            rt.update({pt: val})
                    else:
                        for pt in pointList:
                            val = self.cacheManager.read_cache(self.get_act_time().strftime(standard_time_format), pt)
                            if self._nMode == LogicBase.ONLINE_TEST_REALTIME and val is None:  # 实时测试时cache并不是全部点位
                                newDataInfo = BEOPDataAccess.getInstance().getFlag0and1PointTimeValueListInBufferTable(
                                    projId, [pt])  # 再去现场数据里补充取一次
                                newDataList = newDataInfo.get('valueList')
                                if newDataList and len(newDataList) > 0:
                                    val = newDataList[0]
                            rt.update({pt: val})
                    return rt
                    # rt=RealtimeDataMethods.get_realtime_data(projId,pointList)
            else:  # histroy from mongo
                if isinstance(pointList, str):
                    val = self.cacheManager.read_cache(self.get_act_time().strftime(standard_time_format), pointList)
                    if val is not None:
                        rt.update({pointList: val})
                        return rt
                elif isinstance(pointList, list):  # array for some apis
                    for pt in pointList:
                        val = self.cacheManager.read_cache(self.get_act_time().strftime(standard_time_format), pt)
                        if val is not None:
                            rt.update({pt: val})
                    if len(rt) == len(pointList):
                        return rt

                actTime = self._actTime.replace(second=0)
                timeformat, timeStr = get_timeformat_by_act_time(actTime)
                his_rt = DataManager.get_history_data(projId, pointList if isinstance(pointList, list) else [pointList],
                                                      timeStr, timeStr, timeformat)
                if his_rt:
                    for item in his_rt:
                        if 'error' not in item:
                            name = item.get('name')
                            his_data = item.get('history')
                            if name and his_data:
                                if len(his_data) == 1:
                                    rt.update({name: his_data[0].get('value')})
        else:
            if isinstance(pointList, str):
                pointList = [pointList]
            rt = DataManager.get_realtime_data(projId, pointList)

        return rt

    def set_data_history(self, strPointName, strTime, strValue):
        try:
            insert_data = []
            insert_data.append({'timeFormat': 'm5', 'projId': self._projId, 'pointName': strPointName,
                                'pointValue': str(strValue), 'timeAt': strTime})
            rt = DataManager.set_history_data({'setList': insert_data}, runMode=self._nMode)
            if not rt:
                raise Exception("call DataManager.set_history_data failed.")
        except Exception as e:
            logging.error('Failed to set history data!e=%s, strPointName=%s, strTime=%s, strValue=%s',
                          e.__str__(), strPointName, strTime, strValue, exc_info=True, stack_info=True)
            return False
        return True

    def set_data_history_of_this_point(self, strTime, strValue):
        try:
            insert_data = []
            insert_data.append({'timeFormat': 'm5', 'projId': self._projId, 'pointName': self.curCalName,
                                'pointValue': str(strValue), 'timeAt': strTime})
            rt = DataManager.set_history_data({'setList': insert_data}, runMode=self._nMode)
            if not rt:
                raise Exception("call DataManager.set_history_data failed.")
        except Exception as e:
            logging.error('Failed to set data history of this point!e=%s,  strTime=%s, strValue=%s',
                          e.__str__(), strTime, strValue, exc_info=True, stack_info=True)
            return False
        return True

    def set_data(self, projId, pointList, valueList, flag):
        rt = False
        try:
            if self._actTime:
                timeformat, timeStr = get_timeformat_by_act_time(self._actTime)
                if self._nMode == LogicBase.REALTIME or self._nMode == LogicBase.ONLINE_TEST_REALTIME:
                    if isinstance(pointList, str):
                        pointList = [pointList]
                        valueList = [valueList]
                    rt = DataManager.set_realtime_data(projId, pointList, valueList, flag,
                                                       [self._actTime] * len(pointList))

                if isinstance(pointList, str):
                    pointList = [pointList]
                if isinstance(valueList, str):
                    valueList = [valueList]
                if len(pointList) == len(valueList):
                    timeLabelList = [timeStr] * len(pointList)
                    formatList = ['m5']
                    for format in formatList:
                        insert_data = []
                        for index in range(len(pointList)):
                            insert_data.append({'timeFormat': format, 'projId': projId, 'pointName': pointList[index],
                                                'pointValue': valueList[index], 'timeAt': timeLabelList[index]})
                        if insert_data:
                            rt = DataManager.set_history_data({'setList': insert_data}, runMode=self._nMode)
                            logging.debug('write data into mongodb: %s', insert_data)
        except Exception:
            logging.error('Failed to set data! projId=%s, pointList=%s, valueList=%s, flag=%s',
                          projId, pointList, valueList, flag, exc_info=True, stack_info=True)
        return rt

    def set_data_virtual(self, projId, pointList, valueList):
        return self.set_data(projId, pointList, valueList, 1)

    def set_data_algorithm(self, projId, pointList, valueList):
        return self.set_data(projId, pointList, valueList, 1)

    def set_data_calcpoint(self, projId, pointList, valueList):
        rt = False
        try:
            tStart = time.time()
            tCostSecondsList = []
            if self._actTime:
                # 把计算点结果刷入实时buffer
                if self._nMode == LogicBase.REALTIME or self._nMode == LogicBase.ONLINE_TEST_REALTIME:
                    rt = RealtimeDataMethods.set_realtime_data(projId, pointList, valueList, 2,
                                                               [self._actTime] * len(pointList))
                    tCostSecondsList.append(time.time() - tStart)

                timeformat, timeStr = get_timeformat_by_act_time(self._actTime)

                if isinstance(pointList, str):
                    pointList = [pointList]
                if isinstance(valueList, str):
                    valueList = [valueList]
                if len(pointList) == len(valueList):
                    timeLabelList = [timeStr] * len(pointList)
                    formatList = ['m5']
                    if self._connList is None:
                        self._connList = MongoConnManager.getHisConnTuple(projId)
                    if self._collectionNameBase is None:
                        self._collectionNameBase = BEOPDataAccess.getInstance().GetCollectionNameById(projId)
                    for format in formatList:
                        insert_data = []
                        tempKeyList = []
                        for index in range(len(pointList)):
                            strKey = "%d_%s" % (int(projId), pointList[index])
                            if strKey in tempKeyList:
                                continue
                            tempKeyList.append(strKey)
                            insert_data.append({'timeFormat': format, 'projId': projId, 'pointName': pointList[index],
                                                'pointValue': valueList[index], 'timeAt': timeLabelList[index]})

                        if insert_data and len(insert_data) > 0:
                            HistoryDataMethods.saveHistoryData(insert_data, None, self._collectionNameBase,
                                                               runMode=self._nMode)
                            tCostSecondsList.append(time.time() - tStart)
                            logging.debug('repair write data into mongo(%s):%s', self._collectionNameBase, insert_data)

                if len(tCostSecondsList) > 0 and max(tCostSecondsList) > len(pointList) * 0.1:
                    logging.warning(
                        'set_data_calcpoint cost: %s, projId: %s, len(pointList): %s, pointList: %s, valueList: %s',
                        tCostSecondsList, projId, len(pointList), pointList, valueList)
        except Exception:
            logging.error('Failed to set data calcpoint! projId=%s, pointList=%s, valueList=%s',
                          projId, pointList, valueList, exc_info=True, stack_info=True)
        return rt

    def writeFileLog(self, projId, strLog):
        errorLog.writeLog(int(projId), strLog, True)

    def writeLog(self, projId, strLog):
        errorLog.writeLog(int(projId), strLog, True)

    # 发送网页报表到指定邮箱的api
    def send_web_report_to_mailbox(self, strReportAddress, emailList=[]):
        # first call phantomjs.exe


        # send content
        pass

    # 发送通知
    def send_beopmsg(self, userIdList, subject, content):
        return PostMessageQueueMethods.sendToNotifyQueue(userIdList, subject, content)

    # 算法的api接口
    def send_diagnosis_notice(self, projId, buildingName, subBuildingName, faultName, faultDescription, energy,
                              alarmGrade, bindPoints=""):
        rt = False
        try:
            print('send one diagnosis notice: 项目%d, %s' % (int(projId), faultName))
            ins = DiagnosisBase(projId, buildingName, subBuildingName)
            # amy提出该api写notice表的时候判断,最近10小时有没有相同的记录 readmine:1807
            timeInterval = 10
            if ins:
                ret = ins.add_diagnosis_notice(faultName, faultDescription, energy, alarmGrade, bindPoints,
                                               timeInterval)
                rt = True if ret else False
        except Exception as e:
            self.writeFileLog(projId, '%s:' % (get_current_func_name()) + e.__str__())
        return rt

    def send_diagnosis_notice_by_object(self, projId, buildingName, subBuildingName, faultName, faultNoticeObject):
        rt = False
        try:

            print('send one diagnosis notice: 项目%d, %s' % (int(projId), faultName))
            ins = DiagnosisBase(projId, buildingName, subBuildingName)
            if ins:
                strDescription = faultNoticeObject.str()
                ret = ins.add_diagnosis_notice(faultName, strDescription, faultNoticeObject.getEnergy(),
                                               faultNoticeObject.getGrade(), faultNoticeObject.getBindPoints())
                rt = True if ret else False
        except Exception as e:
            self.writeFileLog(projId, '%s:' % (get_current_func_name()) + e.__str__())
        return rt

    # 算法的api接口,simple
    def send_alarm_simple(self, projId, strAlarmName, strAlarmDetail):
        rt = False
        try:
            ins = DiagnosisBase(projId, 'unknown', 'unknown')
            if ins:
                ret = ins.send_alarm_simple(strAlarmName, strAlarmDetail)
                rt = True if ret else False
        except Exception as e:
            self.writeFileLog(projId, '%s:' % (get_current_func_name()) + e.__str__())
        return rt

    def send_fault_notice_by_email(self, userIdList, faultNotice):
        rt = False
        if self._nMode == LogicBase.REALTIME or self._nMode == LogicBase.ONLINE_TEST_REALTIME:
            try:
                for userId in userIdList:
                    # saveUserFaultNoticed(userId, faultNotice)
                    connList = MongoConnManager.getHisConnTuple(self._projId)
                    conn = None
                    for connItem in connList:
                        st = connItem[1]
                        et = connItem[2]
                        if self._actTime <= et and self._actTime >= st:
                            conn = connItem[0]
                            break
                    dbName = 'fault_sent_user'
                    mongo_operator.saveSysMsgSentUserData(self._projId, userId, SysMsgType.FAULT, SysMsgWayType.EMAIL,
                                                          self.curCalName, None, self._actTime, 'ExpertContainer')

                    strContent = faultNotice.genEmailContent(userId)
                    self.debugInfo.append(
                        'sendmail to %s, Title: %s, Content:%s' % (userId, faultNotice.problem, strContent))
                    self.send_message_by_email([userId], faultNotice.problem, strContent)
            except Exception as e:
                self.writeFileLog(self._projId, '%s:' % (get_current_func_name()) + e.__str__())
        return rt

    def send_message_by_email(self, userIdList, strSubject, strContent):
        bResult = DiagnosisBase.send_message_by_email(userIdList, strSubject, strContent)
        if bResult and self._nMode == LogicBase.ONLINE_TEST_REALTIME:
            self.debugInfo.append('mail sent to %s' % (str(userIdList)))
        return bResult

    def send_message_by_app(self, userIdList, strSubject, strContent):
        return DiagnosisBase.send_message_by_app(userIdList, strSubject, strContent)

    def send_message_by_mobile(self, userIdList, strContent):
        bResult = DiagnosisBase.send_message_by_mobile(userIdList, strContent)
        if bResult and self._nMode == LogicBase.ONLINE_TEST_REALTIME:
            self.debugInfo.append('mobile message sent to %s' % (str(userIdList)))
        return bResult

    def send_message_by_phonenum(self, phoneNumList, strContent):
        return DiagnosisBase.send_message_by_phonenum(phoneNumList, strContent)

    def get_history_data_of_today(self, projId, pointList):
        rt = []
        try:
            if not isinstance(pointList, str):
                raise Exception('type of pointList is str, not list')
            cur_time = self.get_act_time()
            if cur_time:
                t_end = cur_time.replace(second=0)
                minute = t_end.minute
                strTStart = self.time_get_day_begin()
                his = self.get_data_time_range(projId, [pointList], strTStart, t_end.strftime(standard_time_format),
                                               'h1')
                if his:
                    for item in his:
                        if 'error' in item:
                            rt = None
                        else:
                            if 'history' in item:
                                h = item.get('history', [])
                                if h:
                                    for i in h:
                                        rt.append(float(i.get('value')))
                                else:
                                    rt = None
        except Exception as e:
            self.writeLog(projId, get_current_func_name() + e.__str__())
        return rt

    def get_history_data_of_last_hour(self, projId, pointList):
        rt = []
        try:
            if not isinstance(pointList, str):
                raise Exception('type of pointList is str, not list')
            cur_time = self.get_act_time()
            if cur_time:
                t_end = cur_time.replace(second=0)
                minute = t_end.minute
                for i in range(minute, -1, -1):
                    if i % 5 == 0:
                        t_end = t_end.replace(minute=i)
                        break
                t_start = t_end - timedelta(hours=1)
                his = self.get_data_time_range(projId, [pointList], t_start.strftime(standard_time_format),
                                               t_end.strftime(standard_time_format), 'm5')
                if his:
                    for item in his:
                        if 'error' in item:
                            rt = None
                        else:
                            if 'history' in item:
                                h = item.get('history', [])
                                if h:
                                    for i in h:
                                        rt.append(float(i.get('value')))
                                else:
                                    rt = None
        except Exception as e:
            self.writeLog(projId, '%s:' % (get_current_func_name()) + e.__str__())
        if projId == 396 and ('powermeter06_000_energy' == pointList):
            self._logger.writeLog('important get_history_of_last_hour: ' + str(rt), True)
        return rt

    def get_avg_data_of_last_hour(self, projId, pointName):
        try:
            rtData = self.get_history_data_of_last_hour(projId, pointName)
            if rtData is None or len(rtData) == 0:
                return None
            return sum(rtData) / len(rtData)
        except Exception as e:
            self.writeLog(projId, '%s:' % (get_current_func_name()) + e.__str__(), True, pointName)
        return None

    def get_status_timeratio_of_last_hour(self, projId, pointName, nStatus):
        try:
            rtData = self.get_history_data_of_last_hour(projId, pointName)
            if rtData is None or len(rtData) == 0:
                return None
            rtData.reverse()
            nStatusCount = 0
            for item in rtData:
                if int(item) == nStatus:
                    nStatusCount += 1
            return nStatusCount / len(rtData)
        except Exception as e:
            self.writeLog(projId, '%s:' % (get_current_func_name()) + e.__str__(), True, pointName)
        return None

    def get_status_change_of_last_hour(self, projId, pointName, ):
        nStatusChangeCount = 0
        try:
            rtData = self.get_history_data_of_last_hour(projId, pointName)
            if rtData is None or len(rtData) == 0:
                return None
            rtData.reverse()

            nCurStatus = None
            for item in rtData:
                if nCurStatus is None:
                    nCurStatus = int(item)
                    continue
                if nCurStatus != int(item):
                    nStatusChangeCount += 1
                    nCurStatus = int(item)
        except Exception as e:
            self.writeLog(projId, '%s:' % (get_current_func_name()) + e.__str__())
        return nStatusChangeCount

    def calc_power_by_run(self, projId, point_name, rated_power):
        rt = None
        try:
            ret = self.get_data_float(projId, point_name)

            if ret is not None:
                if isinstance(ret, list):
                    if ("onoff" in point_name.lower()):
                        if (ret.get(point_name) == 0.0 or ret.get(point_name) == 1.0):
                            rt = rated_power * float(ret.get(point_name))
                        else:
                            self.writeLog(projId, 'PointName: %s Value: %s CalcTime:%s' % (
                            point_name, str(ret.get(point_name)), self.get_act_time().strftime(standard_time_format)), )
                    else:
                        rt = rated_power * float(ret.get(point_name))
                if isinstance(ret, float):
                    if ("onoff" in point_name.lower()):
                        if (ret == 0.0 or ret == 1.0):
                            rt = rated_power * float(ret)
                        else:
                            self.writeLog(projId, 'PointName: %s Value: %s CalcTime:%s' % (
                            point_name, str(ret), self.get_act_time().strftime(standard_time_format)), )
                    else:
                        rt = rated_power * float(ret)
        except Exception as e:
            self.writeLog(projId,
                          '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__(), )
        return rt

    def calc_power_by_vsd_run(self, projId, point_name, coefficient, rated_power):
        # 状态点point_name：0/1；频率点point_name：0~50HZ
        rt = None
        try:
            ret = self.get_data_float(projId, point_name)

            if ret is not None:
                # if isinstance(ret, list):
                # rt = (float(ret.get(point_name)) / 50) ** float(coefficient) * float(rated_power)
                if isinstance(ret, float):
                    if ("onoff" in point_name.lower()):
                        if (ret == 0.0 or ret == 1.0):
                            rt = (float(ret) / 50) ** float(coefficient) * float(rated_power)
                        else:
                            self.writeLog(projId, 'PointName: %s Value: %s CalcTime:%s' % (
                            point_name, str(ret.get(point_name)), self.get_act_time().strftime(standard_time_format)))
                    elif ("freq" in point_name.lower()):
                        if (ret >= 0.0 and ret <= 50):
                            rt = (float(ret) / 50) ** float(coefficient) * float(rated_power)
                        else:
                            self.writeLog(projId, 'PointName: %s Value: %s CalcTime:%s' % (
                            point_name, str(ret), self.get_act_time().strftime(standard_time_format)))
                    else:
                        rt = (float(ret) / 50) ** float(coefficient) * float(rated_power)
        except Exception as e:
            self.writeLog(projId,
                          '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def calc_power_by_amp(self, projId, point_name, rated_power):
        # 状态点point_name：0/1；电流百分比点point_name：0~110%
        rt = None
        try:
            ret = self.get_data_float(projId, point_name)

            if ret is not None:
                # if isinstance(ret, list):
                # rt = float(ret.get(point_name)) * float(rated_power) / 100
                if isinstance(ret, float):
                    if ("onoff" in point_name.lower()):
                        if (ret == 0.0 or ret == 1.0):
                            rt = float(ret) * float(rated_power) / 100
                        else:
                            self.writeLog(projId, 'PointName: %s Value: %s CalcTime:%s' % (
                            point_name, str(ret.get(point_name)), self.get_act_time().strftime(standard_time_format)))
                    elif ("champs" in point_name.lower() or "loadratio" in point_name.lower()):
                        if (ret >= 0.0 and ret <= 110.0):
                            rt = float(ret) * float(rated_power) / 100
                        else:
                            self.writeLog(projId, 'PointName: %s Value: %s CalcTime:%s' % (
                            point_name, str(ret), self.get_act_time().strftime(standard_time_format)))
                    else:
                        rt = float(ret) * float(rated_power) / 100
        except Exception as e:
            self.writeLog(projId,
                          '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def calc_delta_if_run(self, projId, a_point_name, b_point_name, run_point_name):
        rt = None
        try:
            ret = self.get_data_float(projId, [a_point_name, b_point_name, run_point_name])
            if ret:
                if len(ret) == 3:
                    if ("onoff" in run_point_name.lower()):
                        if (float(ret[2]) == 0.0 or float(ret[2]) == 1.0):
                            rt = (float(ret[0]) - float(ret[1])) * float(ret[2])
                        else:
                            self.writeLog(projId, 'PointName: %s Value: %s CalcTime:%s' % (
                            run_point_name, str(float(ret[2])), self.get_act_time().strftime(standard_time_format)))
                    else:
                        rt = (float(ret[0]) - float(ret[1])) * float(ret[2])
        except Exception as e:
            self.writeLog(projId,
                          '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def calc_max_in_points(self, projId, point_name_list):
        '''
        获取同一时刻多个点的最大值
        :param projId:
        :param point_name_list:
        :return: 最大值
        '''
        rt = None
        try:
            if isinstance(point_name_list, list):
                ret = self.get_data_float(projId, point_name_list)
                if ret is not None:
                    rt = max(ret)
            else:
                raise Exception('Parameters must be a list')
        except Exception as e:
            self.writeFileLog(projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def calc_min_in_points(self, projId, point_name_list):
        '''
        获取同一时刻多个点的最小值
        :param projId:
        :param point_name_list: list
        :return: 最小值
        '''
        rt = None
        try:
            if isinstance(point_name_list, list):
                ret = self.get_data_float(projId, point_name_list)
                if ret is not None:
                    rt = min(ret)
            else:
                raise Exception('Parameters must be a list')
        except Exception as e:
            self.writeFileLog(projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def calc_sum_in_points(self, projId, point_name_list, bAbs=False):
        '''
        求同一时刻多个点的和
        :param projId:
        :param point_name_list:
        :return:
        '''
        rt = None
        canbecalc = True
        try:
            if isinstance(point_name_list, list):
                ret = self.get_data_float(projId, point_name_list)
                if ret is not None:
                    for point_name in point_name_list:
                        v = ret[point_name_list.index(point_name)]
                        if v is not None:
                            canbecalc = True
                        else:
                            canbecalc = False
                            self.writeLog(projId, 'PointName: %s Value: %s CalcTime:%s' % (
                            point_name, str(v), self.get_act_time().strftime(standard_time_format)), point_name)
                            break
                    # 将ret中的NaN过滤掉
                    ret = [v for v in ret if v == v and v is not None]
                    if canbecalc:
                        if not bAbs:
                            rt = sum(ret)
                        else:
                            absret = [abs(item) for item in ret]
                            rt = sum(absret)
            else:
                raise Exception('Parameters must be a list')
        except Exception as e:
            self.writeFileLog(projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def calc_avg_if_run(self, projId, point_name_list, condition='', run_name_list=[]):
        '''
        求同一时刻多个点的满足条件的平均值
        :param projId:
        :param point_name_list:
        :param condition:
        :param run_name_list:
        :return:
        '''
        rt = None
        try:
            if isinstance(point_name_list, list) and isinstance(run_name_list, list):
                ret_1 = self.get_data_float(projId, point_name_list)
                ret_2 = self.get_data_float(projId, run_name_list)
                value_list = []
                if len(condition) == 0:
                    value_list = ret_1
                else:
                    if len(ret_1) == len(ret_2):
                        for index, value in enumerate(ret_2):
                            if eval(str(value) + str(condition)):
                                value_list.append(float(ret_1[index]))
                    else:
                        raise Exception('point list error')
                if len(value_list) > 0:
                    rt = float(sum(value_list)) / len(value_list)
                else:
                    rt = 0
            else:
                raise Exception('The format of the parameter error')
        except Exception as e:
            self.writeFileLog(projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def calc_load_wo_flow(self, projId, EnterEvapPointName, LeaveEvapPointName, RatedCapacity, OnOffPointName):
        '''
        冷机冷量计算
        :param projId:
        :param EnterEvapPointName:
        :param LeaveEvapPointName:
        :param RatedCapacity:
        :param OnOffPointName:
        :return:
        '''
        # EnterEvapPointName:-10~30；LeaveEvapPointName：-10~30；EnterEvapPointName>LeaveEvapPointName；OnOffPointName：0/1
        rt = None
        try:
            ret = self.get_data_float(projId, [EnterEvapPointName, LeaveEvapPointName, OnOffPointName])
            if ret:
                if len(ret) == 3:
                    if (float(ret[2]) == 0.0 or float(ret[2]) == 1.0):
                        if (float(ret[0]) >= -10 and float(ret[0]) <= 30):
                            if (float(ret[1]) >= -10 and float(ret[1]) <= 30):
                                if (float(ret[0]) > float(ret[1])):
                                    rt = (float(ret[0]) - float(ret[1])) * RatedCapacity * float(
                                        ret[2]) * 4.2 / 3.6 / 3.516

                                else:
                                    self.writeLog(projId, 'EnterEvapPointName<=LeaveEvapPointName  CalcTime:%s' % (
                                    self.get_act_time().strftime(standard_time_format), EnterEvapPointName))
                            else:
                                self.writeLog(projId, 'PointName: %s Value: %s CalcTime:%s' % (
                                LeaveEvapPointName, str(float(ret[1])),
                                self.get_act_time().strftime(standard_time_format), LeaveEvapPointName))
                        else:
                            self.writeLog(projId, 'PointName: %s Value: %s CalcTime:%s' % (
                            EnterEvapPointName, str(float(ret[0])), self.get_act_time().strftime(standard_time_format),
                            EnterEvapPointName))
                    else:
                        self.writeLog(projId, 'PointName: %s Value: %s CalcTime:%s' % (
                        OnOffPointName, str(float(ret[2])), self.get_act_time().strftime(standard_time_format),
                        OnOffPointName))
        except Exception as e:
            self.writeFileLog(projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def calc_load_w_flow(self, projId, EnterEvapPointName, LeaveEvapPointName, flowPointName, OnOffPointName):
        '''
        冷机冷量计算
        :param projId:
        :param EnterEvapPointName:
        :param LeaveEvapPointName:
        :param flowPointName:
        :param OnOffPointName:
        :return:
        '''
        # EnterEvapPointName:-10~30；LeaveEvapPointName：-10~30；EnterEvapPointName>LeaveEvapPointName；OnOffPointName：0/1；flowPointName：≥0
        rt = None
        try:
            ret = self.get_data_float(projId, [EnterEvapPointName, LeaveEvapPointName, flowPointName, OnOffPointName])
            if ret:
                if len(ret) == 4:
                    if (float(ret[3]) == 0.0 or float(ret[3]) == 1.0):
                        if (float(ret[0]) >= -10 and float(ret[0]) <= 30):
                            if (float(ret[1]) >= -10 and float(ret[1]) <= 30):
                                if (float(ret[0]) > float(ret[1])):
                                    if (float(ret[2]) >= 0):
                                        rt = (float(ret[0]) - float(ret[1])) * float(ret[2]) * float(
                                            ret[3]) * 4.2 / 3.6 / 3.516
                                        if rt:
                                            rt = rt
                                    else:
                                        self.writeLog(projId, 'PointName: %s Value: %s CalcTime:%s' % (
                                        flowPointName, str(float(ret[2])),
                                        self.get_act_time().strftime(standard_time_format), flowPointName))
                                else:
                                    self.writeLog(projId, 'EnterEvapPointName<=LeaveEvapPointName  CalcTime:%s' % (
                                    self.get_act_time().strftime(standard_time_format), EnterEvapPointName))
                            else:
                                self.writeLog(projId, 'PointName: %s Value: %s CalcTime:%s' % (
                                LeaveEvapPointName, str(float(ret[1])),
                                self.get_act_time().strftime(standard_time_format), LeaveEvapPointName))
                        else:
                            self.writeLog(projId, 'PointName: %s Value: %s CalcTime:%s' % (
                            EnterEvapPointName, str(float(ret[0])), self.get_act_time().strftime(standard_time_format),
                            EnterEvapPointName))
                    else:
                        self.writeLog(projId, 'PointName: %s Value: %s CalcTime:%s' % (
                        OnOffPointName, str(float(ret[2])), self.get_act_time().strftime(standard_time_format),
                        OnOffPointName))
        except Exception as e:
            self.writeFileLog(projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def calc_hourly_delta_of_accum(self, strAccumPointName):
        val = None
        try:
            t1 = self.time_get_hour_begin()

            # 根据电表读数求用电量
            r1 = self.get_data(self._projId, strAccumPointName)
            if r1 is None:
                return None
            r2 = self.get_data_at_time(self._projId, strAccumPointName, t1)
            if r2 is None:
                return None
            val = r1 - r2
            if val < 0:
                return 0

            self.set_data_history_of_this_point(t1, val)  # 每次计算时额外将计算结果覆盖本小时初的值
            return val
        except Exception as e:
            self.writeFileLog(self._projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return val

    def calc_daily_delta_of_accum(self, strAccumPointName):
        val = None
        try:
            t1 = self.time_get_day_begin()

            # 根据电表读数求用电量
            r1 = self.get_data(self._projId, strAccumPointName)
            if r1 is None:
                return None
            r2 = self.get_data_at_time(self._projId, strAccumPointName, t1)
            if r2 is None:
                return None
            val = r1 - r2
            if val < 0:
                return 0

            self.set_data_history_of_this_point(t1, val)  # 每次计算时额外将计算结果覆盖本小时初的值
            return val
        except Exception as e:
            self.writeFileLog(self._projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return val

    def calc_weekly_delta_of_accum(self, strAccumPointName):
        val = None
        try:
            t1 = self.time_get_week_begin()

            # 根据电表读数求用电量
            r1 = self.get_data(self._projId, strAccumPointName)
            if r1 is None:
                return None
            r2 = self.get_data_at_time(self._projId, strAccumPointName, t1)
            if r2 is None:
                return None
            val = r1 - r2
            if val < 0:
                return 0

            self.set_data_history_of_this_point(t1, val)  # 每次计算时额外将计算结果覆盖本小时初的值
            return val
        except Exception as e:
            self.writeFileLog(self._projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return val

    def calc_monthly_delta_of_accum(self, strAccumPointName):
        val = None
        try:
            t1 = self.time_get_month_begin()

            # 根据电表读数求用电量
            r1 = self.get_data(self._projId, strAccumPointName)
            if r1 is None:
                return None
            r2 = self.get_data_at_time(self._projId, strAccumPointName, t1)
            if r2 is None:
                return None
            val = r1 - r2
            if val < 0:
                return 0

            self.set_data_history_of_this_point(t1, val)  # 每次计算时额外将计算结果覆盖本小时初的值
            return val
        except Exception as e:
            self.writeFileLog(self._projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return val

    def calc_eff_smooth(self, projId, LoadPointName, powerPointName):
        '''
        计算比值,效率,cop等,注意分母为零的情况
        :param projId:
        :param LoadPointName:
        :param powerPointName:
        :return:
        '''
        # LoadPointName：≥0；powerPointName：＞0
        rt = None
        try:
            ret = self.get_data_float(projId, [LoadPointName, powerPointName])
            if len(ret) == 2:
                if (float(ret[1]) >= 0):
                    if (float(ret[0]) > 0):
                        rt = float(ret[1]) / float(ret[0])

                    else:
                        self.writeLog(projId, 'PointName: %s Value: %s CalcTime:%s' % (
                        LoadPointName, str(float(ret[0])), self.get_act_time().strftime(standard_time_format),
                        LoadPointName))
                else:
                    self.writeLog(projId, 'PointName: %s Value: %s CalcTime:%s' % (
                    powerPointName, str(float(ret[1])), self.get_act_time().strftime(standard_time_format),
                    powerPointName))

        except Exception as e:
            self.writeFileLog(projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def calc_sum_hour(self, projId, pointName, constant, timeFormat):
        '''
        求小时用电量,小时费用
        :param projId:
        :param pointNameList
        :param constant
        :param timeFormat
        :return:{pointname1:value1,pointname2:value2,...}
        '''
        rt = None
        try:
            pointNameList = []
            cur_time = self.get_act_time()
            if cur_time:
                t_temp = cur_time.replace(second=0, minute=0)
                t_start = t_temp - timedelta(hours=1)
                t_end = t_start.replace(second=0, minute=59)
                pointNameList.append(pointName)
                his = self.get_data_time_range(projId, pointNameList, t_start.strftime(standard_time_format),
                                               t_end.strftime(standard_time_format), timeFormat)
                ret = get_history_date_of_sum_SomePointName(his)
                if ret is not None:
                    rt = ret * constant

        except Exception as e:
            strError = '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__()
            self.writeLog(projId, strError, pointName)
        return rt

    def calc_sum_day(self, projId, pointName, constant, timeFormat):
        """
        求当天天用电量
        :param projId:
        :param pointName
        :param constant
        :param timeFormat
        :return:{pointname1:value1,pointname2:value2,...}
        """
        try:
            pointNameList = []
            cur_time = self.get_act_time()
            rt = None
            if cur_time:
                t_end = cur_time.replace(second=0)
                realData = None
                if self._nMode == LogicBase.REALTIME or self._nMode == LogicBase.ONLINE_TEST_REALTIME:
                    t_end += timedelta(minutes=-5)
                    realDataList = self.get_data(projId, [pointName])
                    if realDataList and realDataList[0] is not None:
                        realData = realDataList[0] * constant
                    if realData is None:
                        return None
                    if cur_time.hour == 0 and 0 <= cur_time.minute < 5:
                        return realData
                t_start = cur_time.replace(second=0, minute=0, hour=0)
                pointNameList.append(pointName)
                his = self.get_data_time_range(projId,
                                               pointNameList,
                                               t_start.strftime(standard_time_format),
                                               t_end.strftime(standard_time_format),
                                               timeFormat)
                ret = get_history_date_of_sum_SomePointName(his)
                if ret is not None:
                    rt = ret * constant
                if realData is None and rt is None:
                    return None
                elif realData is not None and rt:
                    return rt
                else:
                    return rt + realData
        except Exception:
            logging.error('Failed to calc sum day! projId=%s, pointName=%s, constant=%s, timeFormat=%s',
                          projId, pointName, constant, timeFormat, exc_info=True, stack_info=True)
        return rt

    def calc_sum_cost_day(self, projId, pointName, strPricePointName, constant, timeFormat):
        """
        求当天天用电量费用
        :param projId:
        :param pointName
        :param strPricePointName
        :param constant
        :param timeFormat
        :return:{pointname1:value1,pointname2:value2,...}
        """
        rt = None
        try:
            cur_time = self.get_act_time()
            if cur_time:
                t_end = cur_time.replace(second=0)
                realData = None
                if self._nMode == LogicBase.REALTIME or self._nMode == LogicBase.ONLINE_TEST_REALTIME:
                    t_end += timedelta(minutes=-5)
                    realDataList = self.get_data(projId, [pointName])
                    realPriceList = self.get_data(projId, [strPricePointName])
                    if realDataList and realPriceList and realDataList[0] and realPriceList[0]:
                        realData = realDataList[0] * realPriceList[0] * constant
                    if realData is None:
                        return None
                    if cur_time.hour == 0 and 0 <= cur_time.minute < 5:
                        return realData
                t_start = cur_time.replace(second=0, minute=0, hour=0)
                his1 = self.get_his_data_time_range(projId, pointName, t_start.strftime(standard_time_format),
                                                    t_end.strftime(standard_time_format), timeFormat)
                his2 = self.get_his_data_time_range(projId, strPricePointName, t_start.strftime(standard_time_format),
                                                    t_end.strftime(standard_time_format), timeFormat)
                if len(his1) != len(his2):
                    self.writeLog(projId, 'point and costpoint hisdata not same length', )
                    return None
                fSum = 0.0
                for i in range(len(his1)):
                    fSum += his1[i] * his2[i]
                if realData:
                    rt = fSum * constant + realData
                else:
                    rt = fSum * constant
        except Exception as e:
            self.writeLog(projId,
                          '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__(), )
        return rt

    def calc_sum_last_day(self, projId, pointName, constant, timeFormat):
        '''
        求昨天天用电量
        :param projId:
        :param pointNameList
        :param constant
        :param timeFormat
        :return:{pointname1:value1,pointname2:value2,...}
        '''
        rt = None
        try:
            pointNameList = []
            thisTime = self.get_act_time()
            last_time = thisTime - timedelta(days=1)
            if last_time:
                t_end = last_time.replace(second=0, minute=59, hour=23)
                t_start = last_time.replace(second=0, minute=0, hour=0)
                pointNameList.append(pointName)
                his = self.get_data_time_range(projId, pointNameList, t_start.strftime(standard_time_format),
                                               t_end.strftime(standard_time_format), timeFormat)
                ret = get_history_date_of_sum_SomePointName(his)
                if ret is not None:
                    rt = ret * constant

        except Exception as e:
            self.writeLog(projId,
                          '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__(),
                          pointName)
        return rt

    def calc_sum_cost_last_day(self, projId, pointName, pricePointName, constant, timeFormat):
        '''
        求昨天天用电量费用
        :param projId:
        :param pointNameList
        :param constant
        :param timeFormat
        :return:{pointname1:value1,pointname2:value2,...}
        '''
        rt = None
        try:
            thisTime = self.get_act_time()
            last_time = thisTime - timedelta(days=1)

            t_end = last_time.replace(second=0, minute=59, hour=23)
            t_start = last_time.replace(second=0, minute=0, hour=0)

            his1 = self.get_his_data_time_range(projId, pointName, t_start.strftime(standard_time_format),
                                                t_end.strftime(standard_time_format), timeFormat)
            his2 = self.get_his_data_time_range(projId, pricePointName, t_start.strftime(standard_time_format),
                                                t_end.strftime(standard_time_format), timeFormat)
            if len(his1) != len(his2):
                self.writeLog(projId, 'point and costpoint hisdata not same length', pointName)
                return None
            fSum = 0.0
            for i in range(len(his1)):
                fSum += his1[i] * his2[i]
            rt = fSum * constant

        except Exception as e:
            self.writeLog(projId,
                          '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__(), )
        return rt

    def calc_sum_one_day(self, projId, pointName, constant, timeFormat, t_time):
        '''
        求某天用电量,小时费用
        :param projId:
        :param pointNameList
        :param constant
        :param timeFormat
        :t_time timeThatDay
        :return:{pointname1:value1,pointname2:value2,...}
        '''
        rt = None
        try:
            pointNameList = []
            cur_time = datetime.strptime(t_time, standard_time_format)
            if cur_time:
                t_end = cur_time.replace(second=0, minute=59, hour=23)
                t_start = cur_time.replace(second=0, minute=0, hour=0)
                pointNameList.append(pointName)
                his = self.get_data_time_range(projId, pointNameList, t_start.strftime(standard_time_format),
                                               t_end.strftime(standard_time_format), timeFormat)
                ret = get_history_date_of_sum_SomePointName(his)
                if ret is not None:
                    rt = ret * constant

        except Exception as e:
            self.writeLog(projId,
                          '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__(),
                          pointName)
        return rt

    def calc_sum_cost_certain_time(self, projId, pointName, constant, timeFormat, timeFormStr, timeToStr,
                                   pricePointName):
        '''
        求给定时间内的用电量费用
        :param projId:
        :param pointName
        :param constant
        :param timeFormat
        :param timeFormStr
        :param timeToStr
        :param pricePointName
        :return:{pointname1:value1,pointname2:value2,...}
        '''
        rt = None
        try:
            his1 = self.get_his_data_time_range(projId, pointName, timeFormStr, timeToStr, timeFormat)
            his2 = self.get_his_data_time_range(projId, pricePointName, timeFormStr, timeToStr, timeFormat)
            if len(his1) != len(his2):
                self.writeLog(projId, 'point and costpoint hisdata not same length')
                return None
            fSum = 0.0
            for i in range(len(his1)):
                fSum += his1[i] * his2[i]
            rt = fSum * constant
        except Exception as e:
            self.writeLog(projId,
                          '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def calc_sum_certain_time(self, projId, pointName, constant, timeFormat, timeFormStr, timeToStr):
        '''
        求给定时间内的用电量
        :param projId:
        :param pointName
        :param constant
        :param timeFormat
        :t_time timeThatDay
        :return:{pointname1:value1,pointname2:value2,...}
        '''
        rt = None
        try:
            pointNameList = []
            if timeFormStr and timeToStr:
                pointNameList.append(pointName)
                his = self.get_data_time_range(projId, pointNameList, timeFormStr, timeToStr, timeFormat)
                ret = get_history_date_of_sum_SomePointName(his)
                if ret is not None:
                    rt = ret * constant

        except Exception as e:
            self.writeLog(projId,
                          '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__(),
                          pointName)
        return rt

    def calc_compare_same_time_diff_day(self, projId, pointName, timeFormat):
        '''
        求变化率
        :param projId:
        :param pointNameList:
        :param timeFormat
        :return:{pointname1:value1,pointname2:value2,...}
        '''
        rt = None
        try:
            pointNameList = []
            pointNameList.append(pointName)
            cur_time = self.get_act_time()
            if cur_time:
                t_today = None
                if timeFormat == 'm1':
                    t_today = cur_time.replace(second=0)
                elif timeFormat == 'm5':
                    t_today = cur_time.replace(second=0)
                    minute = t_today.minute
                    for i in range(minute, -1, -1):
                        if i % 5 == 0:
                            t_today = t_today.replace(minute=i)
                            break
                elif timeFormat == 'h1':
                    t_today = cur_time.replace(second=0, minute=0)
                elif timeFormat == 'd1':
                    t_today = cur_time.replace(second=0, minute=0, hour=0)

                if t_today is not None:
                    t_yesterday = t_today - timedelta(days=1)
                    valueNow = self.get_data(projId, pointName)

                    valueYesterday = self.get_data_at_time(projId, pointName,
                                                           t_yesterday.strftime(standard_time_format))

                    if valueNow is None:
                        self.debugInfo.append(
                            "calc_compare_same_time_diff_day: There's no data at this timer point today")
                        raise Exception("There's no data at this timer point today")
                    elif valueYesterday is None:
                        self.debugInfo.append(
                            "calc_compare_same_time_diff_day: There's no data at this timer point yesterday")
                        raise Exception("There's no data at this timer point yesterday")
                    else:
                        if valueYesterday == 0.0:
                            rt = 0.0
                        else:
                            rt = (valueNow - valueYesterday) / valueYesterday * 100

        except Exception as e:
            self.writeFileLog(projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def calc_max_in_day(self, projId, pointName, timeFormat):
        '''
        最大蓄冰量等
        :param projId:
        :param pointNameList:
        :param timeFormat
        :param datetimeStr:"2016-5-1 0:0:0"
        :return:{pointname1:value1,pointname2:value2,...}
        '''
        rt = None
        try:
            pointNameList = []
            cur_time = self.get_act_time()
            if cur_time:
                pointNameList.append(pointName)
                t_end = cur_time.replace(second=0, minute=59, hour=23)
                t_start = cur_time.replace(second=0, minute=0, hour=0)
                his = self.get_data_time_range(projId, pointNameList, t_start.strftime(standard_time_format),
                                               t_end.strftime(standard_time_format), timeFormat)
                rt = get_history_date_of_max_SomePointName(his)
        except Exception as e:
            self.writeFileLog(projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def calc_max_in_month(self, projId, pointName, timeFormat):
        '''
        某个点一个月内最大值
        requirement: #2794
        Args:
            projId:
            pointName:
            timeFormat:

        Returns:

        '''
        rt = None
        try:
            pointNameList = []
            cur_time = self.get_act_time()
            if cur_time:
                pointNameList.append(pointName)
                t_start = '%d-%02d-01 00:00:00' % (cur_time.year, cur_time.month,)
                monthRange = calendar.monthrange(cur_time.year, cur_time.month)
                t_end = '%d-%02d-%02d 23:59:59' % (cur_time.year, cur_time.month, monthRange,)
                his = self.get_data_time_range(projId, pointNameList, t_start, t_end, timeFormat)
                rt = get_history_date_of_max_SomePointName(his)
        except Exception as e:
            self.writeFileLog(projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def calc_count_in_day(self, projId, pointName, timeFormat, intervalHours):
        '''
        求设备开启次数
        :param projId:
        :param pointNameList
        :param timeFormat
        :return:{pointname1:countvalue1,pointname2:countvalue2,...}
        '''
        rt = 0
        try:
            pointNameList = []
            cur_time = self.get_act_time()
            if cur_time:
                cur_time_temp = cur_time + timedelta(hours=intervalHours)
                pointNameList.append(pointName)
                if (intervalHours >= 0):
                    t_start = cur_time
                    t_end = cur_time_temp
                else:
                    t_start = cur_time_temp
                    t_end = cur_time
                his = self.get_data_time_range(projId, pointNameList, t_start.strftime(standard_time_format),
                                               t_end.strftime(standard_time_format), timeFormat)
                if his:
                    rt = get_history_date_of_count_SomePointName(his)
        except Exception as e:
            self.writeFileLog(projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def calc_sum_this_week(self, projId, pointName, constant, timeFormat):
        '''
        统计本周的数据
        :param projId:
        :param pointNameList
        :param constant
        :param timeFormat
        :return:统计本周一00:00到当前某个点的和乘以某个常数
        '''
        rt = None
        try:
            pointNameList = []
            cur_time = self.get_act_time()
            if cur_time:
                pointNameList.append(pointName)
                t_end = cur_time.replace(second=0)
                t_start = get_time_thisweek_start(t_end)[1]
                his = self.get_data_time_range(projId, pointNameList, t_start, t_end.strftime(standard_time_format),
                                               timeFormat)
                ret = get_history_date_of_sum_SomePointName(his)
                if ret is not None:
                    rt = ret * constant

        except Exception as e:
            self.writeLog(projId,
                          '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__(),
                          pointName)
        return rt

    def calc_sum_one_week(self, projId, pointName, constant, timeFormat, iWeek):
        '''
        统计本周的数据
        :param projId:
        :param pointNameList
        :param constant
        :param timeFormat
        :param iMouth
        :param iWeek
        :return:统计某个周一00:00到周末23:59某个点的和乘以某个常数
        '''
        rt = None
        try:
            pointNameList = []
            cur_time = self.get_act_time()
            if cur_time:
                pointNameList.append(pointName)
                t_temp = cur_time.replace(second=0) + timedelta(weeks=iWeek)
                t_end = get_time_thisweek_end(t_temp)[1]
                t_start = get_time_thisweek_start(t_temp)[1]
                his = self.get_data_time_range(projId, pointNameList, t_start, t_end, timeFormat)
                ret = get_history_date_of_sum_SomePointName(his)
                if ret is not None:
                    rt = ret * constant

        except Exception as e:
            self.writeLog(projId,'%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def calc_sum_this_month(self, projId, pointName, constant, timeFormat):
        '''
        统计本月的数据
        :param projId:
        :param pointNameList
        :param constant
        :param timeFormat
        :return:统计本月1号00:00到当前某个点的和乘以某个常数
        '''
        rt = None
        try:
            if timeFormat == 'h1' or timeFormat == 'd1':
                pointNameList = []
                cur_time = self.get_act_time()
                if cur_time:
                    pointNameList.append(pointName)
                    t_end = cur_time.replace(second=0)
                    t_start = get_time_thismonth_start(t_end)[1]
                    his = self.get_data_time_range(projId, pointNameList, t_start, t_end.strftime(standard_time_format),
                                                   timeFormat)
                    ret = get_history_date_of_sum_SomePointName(his)
                    if ret is not None:
                        rt = ret * constant

            else:
                raise Exception('时间格式只能为d1或h1')
        except Exception as e:
            self.writeLog(projId, '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def calc_sum_one_month(self, projId, pointName, constant, timeFormat, iMonth):
        '''
        统计本月的数据
        :param projId:
        :param pointNameList
        :param constant
        :param timeFormat
        :param iMonth
        :return:统计某月1号00:00到当前某个点的和乘以某个常数
        '''
        rt = None
        try:
            if timeFormat == 'h1' or timeFormat == 'd1':
                pointNameList = []
                cur_time = self.get_act_time()
                if cur_time:
                    pointNameList.append(pointName)
                    t_end = cur_time.replace(month=iMonth, second=0)
                    t_start = get_time_thismonth_start(t_end)[1]
                    t_end = get_time_thismonth_end(t_end)[1]
                    his = self.get_data_time_range(projId, pointNameList, t_start, t_end, timeFormat)
                    ret = get_history_date_of_sum_SomePointName(his)
                    if ret is not None:
                        rt = ret * constant

            else:
                raise Exception('时间格式只能为d1或h1')
        except Exception as e:
            self.writeLog(projId, '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def calc_sum_this_year(self, projId, pointName, constant):
        '''
        统计本年的数据
        :param projId:
        :param pointNameList
        :param constant
        :param timeFormat
        :return:统计本年1月1号00:00到当前某个点的和乘以某个常数
        '''
        rt = None
        try:
            pointNameList = []
            cur_time = self.get_act_time()
            if cur_time:
                pointNameList.append(pointName)
                t_end = cur_time.replace(second=0)
                t_start = cur_time.replace(second=0, minute=55, hour=23, day=1, month=1)
                his = self.get_data_time_range(projId, pointNameList, t_start.strftime(standard_time_format),
                                               t_end.strftime(standard_time_format), "d1")
                ret = get_history_date_of_sum_SomePointName(his)
                if ret is not None:
                    rt = ret * constant

        except Exception as e:
            self.writeLog(projId,
                          '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__(),
                          pointName)
        return rt

    def calc_sum_last_year(self, projId, pointName, constant):
        '''
        统计去年的数据
        :param projId:
        :param pointNameList
        :param constant
        :param timeFormat
        :return:统计去年1月1号00:00到当前某个点的和乘以某个常数
        '''
        rt = None
        try:
            pointNameList = []
            cur_time = self.get_act_time()
            if cur_time:
                pointNameList.append(pointName)
                iyear = cur_time.year - 1
                t_end = cur_time.replace(second=0, minute=59, hour=23, day=31, month=12, year=iyear)
                t_start = cur_time.replace(second=0, minute=0, hour=0, day=1, month=1, year=iyear)
                his = self.get_data_time_range(projId, pointNameList, t_start.strftime(standard_time_format),
                                               t_end.strftime(standard_time_format), "d1")
                ret = get_history_date_of_sum_SomePointName(his)
                if ret is not None:
                    rt = ret * constant

        except Exception as e:
            self.writeLog(projId,
                          '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__(),
                          pointName)
        return rt

    def calc_sum_year(self, projId, pointName, constant, iyear):
        '''
        统计某一年的数据
        :param projId:
        :param pointNameList
        :param constant
        :param timeFormat
        :return:统计往年1月1号00:00到12月31日23:59的和乘以某个常数
        '''
        rt = None
        try:
            pointNameList = []
            cur_time = self.get_act_time()
            if cur_time:
                pointNameList.append(pointName)
                t_end = cur_time.replace(second=0, minute=59, hour=23, day=31, month=12, year=iyear)
                t_start = cur_time.replace(second=0, minute=0, hour=0, day=1, month=1, year=iyear)
                his = self.get_data_time_range(projId, pointNameList, t_start.strftime(standard_time_format),
                                               t_end.strftime(standard_time_format), "d1")
                ret = get_history_date_of_sum_SomePointName(his)
                if ret is not None:
                    rt = ret * constant

        except Exception as e:
            self.writeLog(projId,
                          '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__(), )
        return rt

    def time_get_day_begin(self):
        try:
            cur_time = self.get_act_time()
            return get_time_thisday_start(cur_time)[1]
        except Exception as e:
            self.writeLog(0, '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return None

    def time_get_last_day_begin(self):
        try:
            cur_time = self.get_act_time()
            return get_time_previousday_start(cur_time)[1]
        except Exception as e:
            self.writeLog(0, '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return None

    def time_get_week_begin(self):
        try:
            cur_time = self.get_act_time()
            return get_time_thisweek_start(cur_time)[1]
        except Exception as e:
            self.writeLog(0, '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return None

    def time_get_last_week_begin(self):
        try:
            cur_time = self.get_act_time()
            return get_time_thisweek_start(cur_time - timedelta(days=7))[1]
        except Exception as e:
            self.writeLog(0, '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return None

    def time_get_year_begin(self):
        try:
            cur_time = self.get_act_time()
            return get_time_thisyear_start(cur_time)[1]
        except Exception as e:
            self.writeLog(0, '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return None

    def time_get_month_begin(self):
        try:
            cur_time = self.get_act_time()
            return get_time_thismonth_start(cur_time)[1]
        except Exception as e:
            self.writeLog(0, '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return None

    def time_get_hour_begin(self):
        try:
            cur_time = self.get_act_time()
            return get_time_thishour_start(cur_time)[1]
        except Exception as e:
            self.writeLog(0, '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return None

    def calc_subtraction_for_given_time(self, projId, pointName, t_time):
        try:
            vr = None
            cur_time = self.get_act_time().replace(second=0).strftime(standard_time_format)
            if cur_time == t_time:
                return 0
            data1 = self.get_data_at_time(projId, pointName, t_time)
            data2 = self.get_data(projId, pointName)
            if data1 is not None and data2 is not None:
                vr = data2 - data1
                return vr
            else:
                return None
        except Exception as e:
            self.writeLog(projId,
                          '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__(),
                          pointName)
        return None

    def calc_accumulate(self, projId, strAccumPointName, pointName, strBirthTime, strPeriod='m5', fMul=1.0,
                        strPricePointName=''):
        tAct = self.get_act_time()
        tBirth = datetime.strptime(strBirthTime, '%Y-%m-%d %H:%M:%S')
        realData = 0
        # 规定起点时间前不做计算
        if tAct < tBirth:
            return 0
        # 如果是实时计算或者实时在线测试，历史取到tAct前5分钟，tAct取实时值
        if self._nMode == LogicBase.REALTIME or self._nMode == LogicBase.ONLINE_TEST_REALTIME:
            historyTAct = tAct - timedelta(minutes=5)
            realDataList = self.get_data(projId, [pointName])
            realData = realDataList[0]
            if strPricePointName is not None and len(strPricePointName) > 0:
                realPriceList = self.get_data(projId, [strPricePointName])
                realData = realData * realPriceList[0]
            realData = realData * fMul
        else:
            historyTAct = tAct
        historyTActDayBegin = historyTAct.replace(second=0, minute=0, hour=0)
        historyTActStr = datetime.strftime(historyTAct, '%Y-%m-%d %H:%M:%S')
        historyTActDayBeginStr = datetime.strftime(historyTActDayBegin, '%Y-%m-%d %H:%M:%S')
        # 是否需要取历史
        if historyTAct < tBirth:
            return realData
        # 如果strBirthTime和historyTAct都在同一天
        if historyTAct.day == tBirth.day and historyTAct.month == tBirth.month and historyTAct.year == tBirth.year:
            if strPricePointName is not None and len(strPricePointName) > 0:
                fSumTodayTillNow = self.calc_sum_cost_certain_time(projId, pointName, fMul, strPeriod, strBirthTime,
                                                                   historyTActStr, strPricePointName)
            else:
                fSumTodayTillNow = self.calc_sum_certain_time(projId, pointName, fMul, strPeriod, strBirthTime,
                                                              historyTActStr)
            return fSumTodayTillNow + realData

        # 首先，处理除第一天以外的零点
        if tAct.hour == 0 and 0 <= tAct.minute < 5:
            lastDayStr = self.time_get_last_day_begin()
            lastDay = datetime.strptime(lastDayStr, '%Y-%m-%d %H:%M:%S')
            fBaseValue = self.get_data_at_time(projId, strAccumPointName, lastDayStr)
            if fBaseValue is None:
                #防止出现掉线几天的情况，如readmine#2452所示，往前查找30天
                fBaseValue = self.get_data_at_time(projId, strAccumPointName, lastDayStr, nearestDays=30)
            if fBaseValue is None:
                fBaseValue = 0
            # 判断前一天是否为strBirthTime
            if lastDay.year == tBirth.year and lastDay.day == tBirth.day and lastDay.month == tBirth.month:
                if strPricePointName is not None and len(strPricePointName) > 0:
                    fSumTodayTillNow = self.calc_sum_cost_certain_time(projId, pointName, fMul, strPeriod, strBirthTime,
                                                                       historyTActStr, strPricePointName)
                else:
                    fSumTodayTillNow = self.calc_sum_certain_time(projId, pointName, fMul, strPeriod, strBirthTime,
                                                                  historyTActStr)
            else:
                if strPricePointName is not None and len(strPricePointName) > 0:
                    fSumTodayTillNow = self.calc_sum_cost_last_day(projId, pointName, strPricePointName, fMul,
                                                                   strPeriod)
                else:
                    fSumTodayTillNow = self.calc_sum_last_day(projId, pointName, fMul, strPeriod)
            if fSumTodayTillNow is None:  # 如果没数据，这里就不累加，=0
                fSumTodayTillNow = 0
            return fBaseValue + fSumTodayTillNow + realData
        else:
            # 其次，处理正常时刻的值
            strTodayBegin = self.time_get_day_begin()
            tDayBegin = datetime.strptime(strTodayBegin, '%Y-%m-%d %H:%M:%S')
            if tDayBegin <= tBirth:
                fBaseValue = 0
            else:
                fBaseValue = self.get_data_at_time(projId, strAccumPointName, strTodayBegin)
            if fBaseValue is None:
                #防止出现掉线几天的情况，如readmine#2452所示，往前查找30天
                fBaseValue = self.get_data_at_time(projId, strAccumPointName, strTodayBegin, nearestDays=30)
            if fBaseValue is None:
                # raise Exception('base value at today start not found')
                return None

            if strPricePointName is not None and len(strPricePointName) > 0:
                fSumTodayTillNow = self.calc_sum_cost_certain_time(projId, pointName, fMul, strPeriod,
                                                                   historyTActDayBeginStr,
                                                                   historyTActStr, strPricePointName)
            else:
                fSumTodayTillNow = self.calc_sum_certain_time(projId, pointName, fMul, strPeriod,
                                                              historyTActDayBeginStr, historyTActStr)
            if fSumTodayTillNow is None:  # 如果没数据，这里就不累加，=0
                fSumTodayTillNow = 0
            return fBaseValue + fSumTodayTillNow + realData

    def log_str(self, strContent):
        if self._nMode == LogicBase.ONLINE_TEST_REALTIME or self._nMode == LogicBase.ONLINE_TEST_HISTORY:
            if strContent is None:
                self.debugInfo.append("None")
            elif isinstance(strContent, str):
                self.debugInfo.append(strContent)
            elif isinstance(strContent, int):
                self.debugInfo.append('%d' % (strContent,))
            elif isinstance(strContent, float):
                self.debugInfo.append('%f' % (strContent,))
            elif isinstance(strContent, list):
                self.debugInfo.append('%s' % (str(strContent)))
            elif isinstance(strContent, dict):
                self.debugInfo.append('%s' % (str(strContent)))

    def diagnosis_equipment_chiller(self, strGroupName, strPageName, strLabel, equipTag, pointMap):
        hisdataDict = {}
        rtdataDict = {}
        rtFaultList = []
        try:
            for k, v in pointMap.items():
                hisdataDict[v] = self.get_history_data_of_last_hour(self._projId, v)
                rtdataDict[v] = self.get_data(self._projId, v)
            data = {'projectID': self._projId,
                    'language': 'zh',
                    'equipDict': {
                        strLabel: {'equipType': equipTag,
                                   'pointMap': pointMap},
                    },
                    'hisdataDict': hisdataDict,
                    'rtdataDict': rtdataDict
                    }

            headers = {"Content-Type": "application/json"}
            rvAlgorithm = requests.post('http://%s/equipments/diagnosis' % app.config.get('ALGOSVC2_ADDRESS'),
                                        data=json.dumps(data), headers=headers, timeout=3000)

            diagResults = json.loads(rvAlgorithm.text)

            for k, v in diagResults.items():
                for ditem in v:
                    rtFaultList.append(ditem)
                    if ditem['Status'] == 'normal':
                        continue
                    else:
                        itemDetail = ditem['FaultDetail']
                        fnObj = FaultNotice(itemDetail['fixedDescription'], itemDetail['analysis'],
                                            itemDetail['affect'], itemDetail['suggestion'],
                                            itemDetail['energy'], itemDetail['grade'], itemDetail['blindPoints'])
                        self.send_diagnosis_notice_by_object(self._projId, strGroupName, strPageName,
                                                             strLabel + ditem['FaultName'], fnObj)
        except Exception as e:
            print('%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return True

    def diagnosis_equipment_valve(self, strGroupName, strPageName, strLabel, equipTag, pointMap):
        pass

    def diagnosis_equipment_ahu(self, strGroupName, strPageName, strLabel, equipTag, pointMap):
        pass

    def diagnosis_equipment_sensor_t(self, strGroupName, strPageName, strLabel, equipTag, pointMap):
        pass

    def diagnosis_equipment_sensor_p(self, strGroupName, strPageName, strLabel, equipTag, pointMap):
        pass

    def diagnosis_equipment_sensor_common(self, strGroupName, strPageName, strLabel, equipTag, pointMap, fMinLimit,
                                          fMaxLimit):
        hisdataDict = {}
        rtdataDict = {}
        dataRange = {}
        rtFaultList = []
        try:
            for k, v in pointMap.items():
                hisdataDict[v] = self.get_history_data_of_last_hour(self._projId, v)
                rtdataDict[v] = self.get_data(self._projId, v)
                dataRange[v] = {'max': fMaxLimit, 'min': fMinLimit, 'type': 'continue'}
            data = {'projectID': self._projId,
                    'language': 'zh',
                    'equipDict': {
                        strLabel: {'equipType': equipTag,
                                   'pointMap': pointMap},
                    },
                    'hisdataDict': hisdataDict,
                    'rtdataDict': rtdataDict,
                    'dataRange': dataRange,
                    }

            headers = {"Content-Type": "application/json"}
            rvAlgorithm = requests.post('http://%s/equipments/diagnosis' % app.config.get('ALGOSVC2_ADDRESS'),
                                        data=json.dumps(data), headers=headers, timeout=3000)

            diagResults = json.loads(rvAlgorithm.text)

            for k, v in diagResults.items():
                for ditem in v:
                    rtFaultList.append(ditem)
                    if ditem['Status'] == 'normal':
                        continue
                    else:
                        itemDetail = ditem['FaultDetail']
                        fnObj = FaultNotice(itemDetail['fixedDescription'], itemDetail['analysis'],
                                            itemDetail['affect'], itemDetail['suggestion'],
                                            itemDetail['energy'], itemDetail['grade'], itemDetail['blindPoints'])
                        self.send_diagnosis_notice_by_object(self._projId, strGroupName, strPageName,
                                                             strLabel + ditem['FaultName'], fnObj)
        except Exception as e:
            print('%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return True

    def get_last_update_time_value(self, projId, pointname, nSearchDays=30):
        pointname = self.filterPoint(projId, pointname)
        return HistoryDataMethods.get_last_update_time_value(projId, pointname, self.get_act_time(), nSearchDays)

    def get_last_update_delta_minutes_of_this_point(self, pointName=None):
        if pointName is None:
            pointName = self.curCalName
        rv = HistoryDataMethods.get_last_update_time_value(self._projId, pointName, self.get_act_time())
        try:
            if rv is not None and isinstance(rv, tuple) and len(rv) >= 2 and rv[0] is not None:
                return (self.get_act_time() - rv[0]).total_seconds() / 60.0
            else:
                return 100000000
        except Exception as e:
            print('%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return None

    def get_hours_ago_web_report_sent_user(self, userName, pageId):
        try:
            userId = BEOPDataAccess.getInstance().getUserIdByName(userName)
            if userId < 0:
                return 8760.0

            tLast = DataAlarmInfo.getLastSysMsgSentUserTime(self._projId, userId, SysMsgType.WEBREPORT,
                                                            SysMsgWayType.EMAIL, pageId)
            if tLast is None:
                return 8760.0
            else:
                return (datetime.now() - tLast).total_seconds() / 60.0 / 60.0
        except Exception as e:
            print('%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return True

    def get_server_time(self, nGMT=8):
        tServer = None
        if self._nMode == LogicBase.ONLINE_TEST_HISTORY or self._nMode == LogicBase.REPAIR_HISTORY:
            tServer = self._actTime
        else:
            tServer = datetime.now() + timedelta(hours=(nGMT - 8))
        return tServer

    def get_hours_ago_fault_sent_user(self, userId):
        try:

            tLast = DataAlarmInfo.getLastSysMsgSentUserTime(self._projId, userId, SysMsgType.FAULT, SysMsgWayType.EMAIL,
                                                            self.curCalName)
            if tLast is None:
                return None
            else:
                return (datetime.now() - tLast).total_seconds() / 60.0 / 60.0
        except Exception as e:
            print('%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return True

    def get_last_value(self, projId=None, pointname=None, nSearchDays=30):
        if projId is None:
            projId = self._projId
        if pointname is None:
            pointname = self.curCalName
        timeValue = HistoryDataMethods.get_last_update_time_value(projId, pointname, self.get_act_time(), nSearchDays)
        if timeValue and isinstance(timeValue, tuple):
            return timeValue[1]

        return None

    def diagnosis_rank_this_day(self, projId):
        return BEOPDataAccess.getInstance().diagnosis_rank_this_day(projId)

    def diagnosis_rank_this_week(self, projId):
        return BEOPDataAccess.getInstance().diagnosis_rank_this_week(projId)

    def diagnosis_rank_in_time_range(self, projId, timeFrom, timeTo):
        return BEOPDataAccess.getInstance().diagnosis_rank_in_time_range(projId, timeFrom, timeTo)

    def json_from_data(self, data):
        rt = ""
        try:
            if isinstance(data, dict):
                rt = json.dumps(data, ensure_ascii=False)
            else:
                rt = "param should be json format"
        except Exception as e:
            rt = e.__str__()
        return rt

    def json_to_data(self, data):
        rt = {}
        try:
            if isinstance(data, str):
                data = data.replace('\r\n', '')
                data = data.replace('\n', '')
                rt = json.loads(data)
            else:
                rt = "param should be string format"
        except Exception as e:
            rt = None
        return rt

    def aq_get_by_cityname(self, cityName):
        if not (self._nMode == LogicBase.REALTIME or self._nMode == LogicBase.ONLINE_TEST_REALTIME):
            return False
        return ToolsMethods.aq_get_by_cityname(cityName)

    def weather_get_by_id(self, projId):
        if not (self._nMode == LogicBase.REALTIME or self._nMode == LogicBase.ONLINE_TEST_REALTIME):
            return False
        return ToolsMethods.weather_get_by_id(projId)

    def weather_get_by_cityname(self, cityname):
        return ToolsMethods.weather_get_by_cityname(cityname)

    def weather_get_from_weather_com(self, strCityAddress):
        return ToolsMethods.weather_get_from_weather_com(strCityAddress)

    def weather_get_by_cityid(self, cityId):
        return ToolsMethods.weather_get_by_cityid(cityId)

    def copy_data_to_other_project(self, projIdToList):
        rt = False
        if projIdToList is None:
            return rt
        try:
            if isinstance(projIdToList, list):
                for projIdTo in projIdToList:
                    self.copy_realtimedata_between_project(self._projId, projIdTo)
            elif isinstance(projIdToList, int):
                projIdTo = projIdToList
                self.copy_realtimedata_between_project(self._projId, projIdTo)
            elif isinstance(projIdToList, str):
                projIdTo = int(projIdToList)
                self.copy_realtimedata_between_project(self._projId, projIdTo)
            rt = True
        except Exception as e:
            self.writeFileLog(self._projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def get_data_all_of_project(self, projId):
        return BEOPDataAccess.getInstance().getBufferRTDataByProj(projId)

    def copy_realtimedata_between_project(self, fromId, destinationId, ):
        rt = False
        try:
            nFromId = int(fromId)
            nDestinationId = int(destinationId)
            post_url = 'http://' + app.config['BEOP_SERVER_ADDR'] + '/copy_realtimedata_between_project'
            post_data = {"projIdCopyFrom": nFromId, "projIdCopyTo": nDestinationId, }
            r = requests.post(post_url, data=json.dumps(post_data), headers={'content-type': 'application/json'})
            if r.status_code == 200:
                rv = json.loads(r.text)
                if rv is None or rv['info'] != 'Success':
                    rt = False
                    self.writeFileLog(self._projId, '%s in %s:' % (
                    get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + 'Failed ')
                else:
                    rt = True
        except Exception as e:
            self.writeFileLog(self._projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def set_clear_data_from_site(self, destinationId, nameList, valueList):
        rt = False
        try:
            destinationId = int(destinationId)
            post_url = 'http://' + app.config['BEOP_SERVER_ADDR'] + '/set_realtimedata_from_site'

            post_data = {"projId": destinationId, "point": nameList, "value": valueList,
                         'time': datetime.now().strftime(standard_time_format),
                         'timePeriod': 'm5', 'waitForFinish': '0', 'onlyInsertHistory': 1}
            r = requests.post(post_url, data=json.dumps(post_data), headers={'content-type': 'application/json'})
            if r.status_code == 200:
                rt = True
        except Exception as e:
            self.writeLog(self._projId,
                          '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def set_data_from_site(self, destinationId, nameList, valueList):
        rt = False
        try:
            destinationId = int(destinationId)

            post_url = 'http://' + app.config['BEOP_SERVER_ADDR'] + '/set_realtimedata_from_site'
            post_data = {"projId": destinationId, "point": nameList, "value": valueList,
                         'time': datetime.now().strftime(standard_time_format),
                         'timePeriod': 'm5', 'waitForFinish': '0'}
            r = requests.post(post_url, data=json.dumps(post_data), headers={'content-type': 'application/json'})
            if r.status_code == 200:
                rt = True
        except Exception as e:
            self.writeFileLog(self._projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__(),
                              nameList)
        return rt

    def calc_avg_of_last_hour_nozero(self, projId, pointNameList):
        rt = None
        try:
            fGoodValueList = []
            for i in range(len(pointNameList)):
                valueHisData = self.get_history_data_of_last_hour(projId, pointNameList[i])

                for j in range(len(valueHisData)):
                    if valueHisData[j] <= 0.0:
                        continue
                    fGoodValueList.append(valueHisData[j])
            if len(fGoodValueList) > 0:
                return sum(fGoodValueList) / len(fGoodValueList)
            else:
                return 0.0
        except Exception as e:
            self.writeFileLog(self._projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def save_fault_result(self, projId, faultNameList, faultNoticeList, timeActList, timeCostList):
        moduleStatusInfo = {}
        rt = True
        try:
            tProjectCost = (datetime.now() - self._actTime).total_seconds()
            tStart = time.time()
            if self._actTime:
                faultDbName = "cloudDiagnosis"
                ObjDict = {}
                curosr = mongo_operator.db[faultDbName].find({'moduleName': {"$in": faultNameList}})
                for item in curosr:
                    ObjDict.update({item.get('moduleName'): item.get("_id")})
                aTime = self._actTime.replace(second=0)
                connList = MongoConnManager.getHisConnTuple(projId)
                conn = None
                for connItem in connList:
                    st = connItem[1]
                    et = connItem[2]
                    if aTime <= et and aTime >= st:
                        conn = connItem[0]
                        break
                dbName = 'fault_data_%d' % (int(projId))

                for index in range(len(faultNameList)):
                    fn = faultNoticeList[index]
                    if isinstance(fn, FaultNotice):
                        fn = fn.toDict()
                    timeAct = timeActList[index]
                    timeCost = timeCostList[index]
                    resMongoUpdated = conn.saveFaultHistoryData(faultNameList[index], aTime, faultNoticeList[index],
                                                                dbName)
                    moduleStatusInfo[faultNameList[index]] = dict(value=fn, timeCost=timeCost,
                                                                  timeAct=self.time_to_string(timeAct),
                                                                  id=ObjDict.get(faultNameList[index]).__str__())
                    tCostSeconds = time.time() - tStart
                    if tCostSeconds > 10.0:
                        self._logger.writeLog('save fault data into mongo(%s) cost %.1f, data nums:%d' % (
                        self._collectionNameBase, tCostSeconds, len(faultNameList)), True)
                    if app.config['LOGGING_LEVEL'] <= 0:
                        self._logger.writeLog(
                            'write fault data into mongo(%s):%d条' % (self._collectionNameBase, len(faultNameList)),
                            True)
                if self._nMode == LogicBase.ONLINE_TEST_REALTIME:
                    RedisManager.setProjectDiagnosisStatusOnlyModules(self._projId, moduleStatusInfo)
                else:
                    RedisManager.setProjectDiagnosisStatus(self._projId, dict(projectActTime=self._actTime,
                                                                              projectActCostSeconds=tProjectCost,
                                                                              moduleStatus=moduleStatusInfo))
        except Exception as e:
            self.writeFileLog(self._projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def get_fault_data(self, projId, strFaultName):
        rt = {}
        try:
            tStart = time.time()
            if self._actTime:
                aTime = self._actTime.replace(second=0)
                connList = MongoConnManager.getHisConnTuple(projId)
                conn = None
                for connItem in connList:
                    st = connItem[1]
                    et = connItem[2]
                    if aTime <= et and aTime >= st:
                        conn = connItem[0]
                        break
                if conn:
                    rt = conn.getFaultClassify(projId, [strFaultName])
                    if rt is not None and isinstance(rt, dict):
                        rt = rt.get(strFaultName)
        except Exception as e:
            self.writeFileLog(self._projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def kpi_calc_from_fault(self, faultNameList, riskRuleDict=None):
        try:
            fDisCountScore = 0.0
            strRemarkList = []
            for fname in faultNameList:
                fs = self.get_fault_data(self._projId, fname)
                if fs is None:
                    continue
                if fs['value'] == 1:
                    fRisk = fs['risk']
                    nRiskType = fs['riskType']
                    riskValue = riskRuleDict
                    if riskValue is None:
                        fDisCountScore -= 1.0
                        strRemarkList.append('诊断%s中扣去1分' % (fname,))
                    else:
                        fDisCountScore += fRisk * riskValue[str(nRiskType)]
                        strRemarkList.append('诊断%s中扣去分值:%.2f' % (fname, fDisCountScore,))

            fScore = 100.0 - fDisCountScore
            rv = dict(score=fScore, detail=strRemarkList)
            return self.json_from_data(rv)
        except Exception as e:
            self.writeFileLog(self._projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return None

    def kpi_sum(self, kpiName, kpiStruct):
        try:
            fDisCountScore = 0.0
            strRemarkList = []
            if kpiStruct is None or ('KPIList' not in kpiStruct.keys()) or len(kpiStruct['KPIList']) == 0:
                return -1

            children = []
            for item in kpiStruct['KPIList']:
                if item['point'] == kpiName:
                    children = item['children']
                    break

            if len(children) == 0:
                return -1

            fSum = 0
            fSumWeight = 0
            for item in children:
                ptName = item['point']
                kpiItemInfo = self.get_data_json(self._projId, ptName)
                if kpiItemInfo is None or not isinstance(kpiItemInfo, dict):
                    continue
                if 'score' not in kpiItemInfo.keys():
                    continue
                score = kpiItemInfo['score']
                weight = item['weight']
                fSum += float(score) * float(weight)
                fSumWeight += float(weight)

            if fSumWeight > 0:
                return round(fSum / fSumWeight, 1)
            else:
                return -1

        except Exception as e:
            self.writeFileLog(self._projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return None

    def kpi_sum_root(self, kpiStruct):
        try:
            if kpiStruct is None or ('KPIList' not in kpiStruct.keys()) or len(kpiStruct['KPIList']) == 0:
                return -1

            fSum = 0.0
            fSumWeight = 0.0
            for item in kpiStruct['KPIList']:
                ptName = item['point']
                score = self.get_data(self._projId, ptName)
                if score is None:
                    continue
                if float(score) < 0:
                    continue

                weight = item['weight']
                fSum += float(score) * float(weight)
                fSumWeight += float(weight)

            if fSumWeight > 0:
                return int(fSum / fSumWeight)
            else:
                return -1

        except Exception as e:
            self.writeFileLog(self._projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return None

    def send_web_report(self, userNameList, title, url, lang='en'):
        # david add
        userIds = []

        for username in userNameList:
            userId = BEOPDataAccess.getInstance().getUserIdByName(username)

            if userId < 0:
                self.debugInfo.append('user %s not exist, ignored' % (username))
                continue

            userIds.append(userId)

        userInfoList = BEOPDataAccess.getInstance().getUserInfoByIds(userIds)

        self.debugInfo.append(
            'send web report mail to %s, Title: %s, Content url:%s' % (str(userNameList), title, str(url)))
        project = BEOPDataAccess.getInstance().getProjNameEnglishById(
            self._projId) if lang == 'en' else BEOPDataAccess.getInstance().getProjNameCnById(self._projId)
        option = {
            'projectId': self._projId,
            'title': title,
            'project': project,
            'time': datetime.now().strftime('%Y-%m-%d'),
            'lang': lang,
            'url': url
        }
        if self._projId == 293:
            option['logo'] = '293_logo.png'
        elif self._projId == 491:
            option['logo'] = '421_logo.png'
        if PostMessageQueueMethods.sendFactoryPreviewToEmailQueue(option,
                                                                  [value[1] for key, value in userInfoList.items()]):
            mongo_operator.saveSysMsgSentUserData(self._projId, userId, SysMsgType.WEBREPORT, SysMsgWayType.EMAIL, url,
                                                  None, self._actTime, 'ExpertContainer')
            return True
        else:
            return False

    def send_data_to_mqtt(self, userName, userPwd, topicName, projName, dataNameList, dataContentList):
        if not (self._nMode == LogicBase.REALTIME or self._nMode == LogicBase.ONLINE_TEST_REALTIME):
            return False
        ptInfoList = []
        for i in range(len(dataNameList)):
            ptInfoList.append(dict(pointName=dataNameList[i], pointValue=dataContentList[i],
                                   pointTime=self.time_to_string(self._actTime)))

        bSent = sendDataToMQTT(userName, userPwd, topicName, projName, ptInfoList)
        if self._nMode == LogicBase.ONLINE_TEST_REALTIME:
            if bSent:
                self.debugInfo.append('MQTT Value Sent Success')
            else:
                self.debugInfo.append('MQTT Value Sent Failed')

    def send_points_to_mqtt(self, userName, userPwd, topicName, projName, pointNameList):
        if not (self._nMode == LogicBase.REALTIME or self._nMode == LogicBase.ONLINE_TEST_REALTIME):
            return False
        # get realtime data:
        rtDataList = BEOPDataAccess.getInstance().getFlag0and1PointTimeValueListInBufferTable(self._projId,
                                                                                              pointNameList)  # 再去现场数据里补充取一次
        if rtDataList is None or rtDataList.get('timeList') is None:
            return False

        if len(rtDataList.get('timeList')) == 0:
            return False

        ptInfoList = []
        nameList = rtDataList.get('nameList')
        valueList = rtDataList.get('valueList')
        timeList = rtDataList.get('timeList')

        for i in range(len(rtDataList.get('timeList'))):
            ptInfoList.append(dict(pointName=nameList[i], pointValue=valueList[i], pointTime=timeList[i]))

        bSent = sendDataToMQTT(userName, userPwd, topicName, projName, ptInfoList)
        if self._nMode == LogicBase.ONLINE_TEST_REALTIME:
            if bSent:
                self.debugInfo.append('MQTT Value Sent Success')
            else:
                self.debugInfo.append('MQTT Value Sent Failed')
        else:
            if not bSent:
                self.writeFileLog(self._projId, 'sendDataToMQTT Failed')

    def patch_data_sharp_clock_every_hour(self, projId=None, pointList=None, nMinute=15, nQueryDays=1):
        if projId is None:
            projId = self._projId
        rv = self.get_fault_last_update_time_status()
        tNeedAct = self.get_act_time()
        tNeedAct = tNeedAct.replace(minute=nMinute, second=0, microsecond=0)
        bNeed = False
        if not rv:
            bNeed = True
        elif rv['time'] < tNeedAct and self.get_act_time() >= tNeedAct:
            bNeed = True

        if bNeed:
            self.patch_data_sharp_clock(projId, pointList, self.time_get_hour_begin(), nQueryDays)
        return

    def patch_data_sharp_clock_every_day(self, projId, pointList=None, nHour=0, nMinute=30, nQueryDays=1):
        rv = self.get_fault_last_update_time_status()
        tNeedAct = self.get_act_time()
        tNeedAct = tNeedAct.replace(hour=nHour, minute=nMinute, second=0, microsecond=0)
        if rv['time'] < tNeedAct and self.get_act_time() >= tNeedAct:
            self.patch_data_sharp_clock(projId, pointList, self.time_get_day_begin(), nQueryDays)
        return

    def patch_data_sharp_clock_in_time_range(self, projId, pointList, strTimeStart, strTimeEnd, nQueryDays=1):
        tStart = self.time_from_string(strTimeStart)
        tStart.replace(minute=0, second=0)
        tEnd = self.time_from_string(strTimeEnd)
        tCur = tStart
        errorPointsAll = []
        while tCur < tEnd:
            errorList = self.patch_data_sharp_clock(projId, pointList, tCur.strftime('%Y-%m-%d %H:%M:%S'), nQueryDays)
            if errorList:
                errorPointsAll.extend(errorList)
            time.sleep(1)
            tCur += timedelta(hours=1)

    def patch_data_sharp_clock(self, projId, pointList, strTimePatch, nQueryDays=1):
        rt = None
        try:
            tmObj = datetime.strptime(strTimePatch, '%Y-%m-%d %H:%M:%S')
            if tmObj.minute % 5 == 0 and tmObj.second == 0:
                connList = MongoConnManager.getHisConnTuple(projId)
                conn = None
                for connItem in connList:
                    st = connItem[1]
                    et = connItem[2]
                    if self._actTime <= et and self._actTime >= st:
                        conn = connItem[0]
                        break
                if conn:
                    if pointList == None:
                        pointList = BEOPDataAccess.getInstance().getBufferRTData0and2NameListByProj(projId)
                    cn = BEOPDataAccess.getInstance().GetCollectionNameById(projId)
                    if cn and pointList:
                        strSource = 'diag_%d_%s' % (int(self._projId), self.curCalName)
                        rvAll = conn.patch_data_sharp_clock('m5_data_' + cn, pointList, tmObj, strSource, nQueryDays)
                        rv = rvAll[0]
                        rvCount = rvAll[1]
                        if self._nMode == LogicBase.ONLINE_TEST_REALTIME:
                            self.debugInfo.append('patched data %d count at time %s.' % (rvCount, strTimePatch))
                        if rv is not None and isinstance(rv, list) and len(rv) > 0:
                            return rv
                        else:
                            return None
                    else:
                        return None
        except Exception as e:
            self.writeFileLog(projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def http_post_json(self, url, data, t=30):
        rv = HttpTestTool.postJson(url, data, t)
        return rv

    def http_get_json(self, url, timeout=30):
        return HttpTestTool.getJson(url, timeout)

    def http_post_form(self, url, data, t=30):
        return HttpTestTool.postForm(url, data, t)

    def http_post_json_with_cookie(self, url, data, t=30):
        return HttpTestTool.postJsonWithCookie(url, data, t)

    def http_get_with_cookie(self, url, timeout):
        return HttpTestTool.getWithCookie(url, timeout)

    def http_get_data_text(self, url, timeout):
        return HttpTestTool.getDataText(url, timeout)

    def http_get_directly_text(self, url, timeout):
        return HttpTestTool.getDataText(url, timeout)

    def http_post_data_files(self, url, files, timeout):
        return HttpTestTool.postDataFiles(url, files, timeout)

    def get_third_party_data(self, projId, pointName=None):
        if pointName is None:
            pointName = self.curCalName
        return BEOPDataAccess.getInstance().get_third_party_data(projId, pointName)

    # def send_work_order(self, strOrderName, strUserName, strVerifyUserName, strContent, nDayLeft):
    #     pass

    # def get_work_order_status(self, strOrderName, strUserName):
    #     pass

    def get_work_order_status(self, strOrderName, executorName):
        rt = None
        createUserId = 2265
        try:
            executorID = BEOPDataAccess.getInstance().getUserIdByName(executorName)
            content = {"text": strOrderName, "userId": createUserId}
            url = "http://%s/workflow/transaction/search/1/500" % app.config['BEOPWEB_ADDR']
            post_headers = {'content-type': 'application/json', 'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
            r = requests.post(url=url, data=json.dumps(content), headers=post_headers)
            if r.status_code == 200:
                robj = json.loads(r.text)
                if robj:
                    if robj.get('success'):
                        data = robj.get('data')
                        if data:
                            records = data.get('records', [])
                            for item in records:
                                if item.get('creatorID') == createUserId \
                                        and item.get('title') == strOrderName \
                                        and item.get('executorID') == executorID:
                                    rt = item.get('statusId')
                                    break
        except Exception as e:
            self.writeFileLog(self._projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def get_work_order_create_time(self, strOrderName, executorName):
        rt = None
        createUserId = 2265
        try:
            executorID = BEOPDataAccess.getInstance().getUserIdByName(executorName)
            content = {"text": strOrderName, "userId": createUserId}
            url = "http://%s/workflow/transaction/search/1/500" % app.config['BEOPWEB_ADDR']
            post_headers = {'content-type': 'application/json', 'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
            r = requests.post(url=url, data=json.dumps(content), headers=post_headers)
            if r.status_code == 200:
                robj = json.loads(r.text)
                if robj:
                    if robj.get('success'):
                        data = robj.get('data')
                        if data:
                            records = data.get('records', [])
                            for item in records:
                                if item.get('creatorID') == createUserId \
                                        and item.get('title') == strOrderName \
                                        and item.get('executorID') == executorID:
                                    rt = item.get('createTime')
                                    break
        except Exception as e:
            self.writeFileLog(self._projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def getLoginCookies(self):
        info = {"name": "projecttest@rnbtech.com.hk", "pwd": "Rnbtech1103",
                "agent": {"screen": "1920 x 1080", "browser": "Chrome", "browserVersion": "52.0.2729.4",
                          "mobile": False, "os": "Windows", "osVersion": "NT 4.0", "cookies": True}, "loginCode": ""}
        headersJson = {'content-type': 'application/json', 'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
        cookies = {}
        try:
            login = requests.post("http://%s/login" % app.config['BEOPWEB_ADDR'], data=json.dumps(info),
                                  headers=headersJson)
            status = json.loads(login.text)
            if status.get('status') == True:
                token = login.cookies._cookies['%s' % app.config['BEOPWEB_ADDR']]['/']['token'].value
                cookies = {'userId': '2265', 'token': token}
        except Exception as e:
            self.writeFileLog(self._projId, 'getLoginCookies Error: {}'.format(e.__str__()))
        return cookies

    def send_work_order(self, strOrderName, strContent, executorName, nDays=0, verifiersName=None):
        try:
            createUserId = 2265
            executorID = BEOPDataAccess.getInstance().getUserIdByName(executorName)
            if executorID < 0 and self._nMode == LogicBase.ONLINE_TEST_REALTIME:
                self.debugInfo.append('user with executorName not found')
                return False
            # verifiersID = ''
            # if verifiersName:
            #    verifiersID = BEOPDataAccess.getInstance().getUserIdByName(verifiersName)

            dueDate = self._actTime + timedelta(days=nDays)
            content = {
                "fields": {
                    "taskGroup": "5850be42833c972bd757f732",
                    "title": strOrderName,
                    "dueDate": dueDate.strftime("%Y-%m-%d"),
                    "critical": "2",
                    "detail": strContent
                },
                "processMember": {
                    "0": [executorID],
                    "1": [executorID]},
                "watchers": [],
                "tags": [],
                "attachment": []
            }
            """
            content = {"title": strOrderName, "dueDate": dueDate.strftime("%Y-%m-%d"), "groupId": '645', "critical": "0",
                       "detail": strContent, "collection": "false",
                       "executor[]": [str(executorID)],
                       "verifiers[]": [str(verifiersID)], "pendingFiles": [], "userId": createUserId}
            """
            post_headers = {'content-type': 'application/json', 'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
            cookies = self.getLoginCookies()
            r = requests.post(url='http://%s/workflow/task/save/' % app.config['BEOPWEB_ADDR'],
                              data=json.dumps(content), headers=post_headers, cookies=cookies)
            if r.status_code == 200:
                rvData = json.loads(r.text)
                if rvData.get('success'):
                    if self._nMode == LogicBase.ONLINE_TEST_REALTIME:
                        self.debugInfo.append('workorder sent, ObjectId is %s' % (rvData.get('data', -1)))
                    return True
        except Exception as e:
            self.writeFileLog(self._projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return False

    # 统计当前的实时诊断结果的汇总(老版数据结构)，结构体
    def send_work_order_smart(self, strWorkOrderName, fn, executeNameList, nDelayLimitMinutes, nSolveMinutes,
                              boom=False, CaseID=None):
        rvList = []
        workOrderList = None
        try:
            # 先获取执行者们是否有该条工单
            for index, executor in enumerate(executeNameList):
                workOrderList = self.get_work_order_by_title(strWorkOrderName, executor)
                if workOrderList is None:
                    self.writeFileLog(self._projId, '%s in %s:' % (
                        get_current_func_name(),
                        __name__[__name__.rfind('/') + 1:]) + "maybe mongoDB for workflow failed to connect")
                    return
                elif workOrderList == []:
                    # print("没有获取到该用户正在处理的工单!")
                    pass
                else:
                    recent = workOrderList[-1]
                    rvList.append(recent)
            if len(rvList) == 0:
                # 这时候双方都没有工单, 这时候发给第一个人
                if CaseID:
                    self.setCaseNoticeTime(CaseID)
                self.send_work_order(strWorkOrderName, fn.str(), executeNameList[0], 0)
            elif len(rvList) == 1:
                # 此时可能发送给第一个人也可能发送给了第二个人
                executor = rvList[0].get('executor')
                userIdList = [BEOPDataAccess.getInstance().getUserIdByName(x) for x in executeNameList]
                if userIdList.index(executor):
                    # 说明这时候是发送给到了第二个人, 不需要继续转发了,但是每五分钟轰炸一次邮件
                    if CaseID:
                        self.setCaseNoticeTime(CaseID)
                    if boom:
                        self.send_message_by_email([executeNameList[-1]], '请您及时处理工单--%s' % strWorkOrderName,
                                                   '由于工单已转发到你，请尽快处理！否则邮件会继续轰炸！')
                else:
                    # 发给过第一个人了，判断时间
                    delay = datetime.now() - rvList[0].get('createTime')
                    delayTime = int(delay.seconds / 60) + delay.days * 24 * 60
                    if delayTime > int(nDelayLimitMinutes):
                        status = rvList[0].get('status')
                        workOrderId = rvList[0].get('_id')
                        if status == 0:
                            # 说明工单还没开始进行, 转发给第二个人
                            self.transfer_work_order(userIdList[1], workOrderId)
                        if status == 1:
                            # 说明工单开始了，但是仍然没有完成
                            if delayTime > int(nSolveMinutes):
                                # 虽然工单开始了，但是拖得太久了，也转发给第二个人
                                self.transfer_work_order(userIdList[1], workOrderId)
            else:
                # 可能有bug
                self.writeFileLog(self._projId,
                                  '%s in %s:' % (
                                      get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + "出现了意外的情况!")
        except Exception as e:
            self.writeFileLog(self._projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())

    def reset_work_order_if_open(self, strWorkOrderName, strExecutorList):
        rtList = []
        try:
            for executorName in strExecutorList:
                rtList = self.get_work_order_by_title(strWorkOrderName, executorName)
                for workOrder in rtList:
                    executor = workOrder.get('executor')
                    orderId = str(workOrder.get("_id"))
                    self.send_message_by_email([executor], '%s故障解决通知' % (strWorkOrderName),
                                               '系统自动检测到该故障已经消除，该工单将被自动关闭完成.')
                    self.finish_work_order(orderId)
        except Exception as e:
            self.writeFileLog(self._projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())

    # 统计当前的实时诊断结果的汇总(老版数据结构)，结构体
    def statistics_realtime_fault_algorithm(self):
        rt = []
        try:
            url = 'http://%s/diagnosis/getRealtimeFault/%d' % (app.config['BEOPWEB_ADDR'], int(self._projId))
            rv = HttpTestTool.getJson(url)
            # 调用
            # url_getstruct = 'http://%s/diagnosis/getStruct/%d'%(app.config['BEOPWEB_ADDR'], int(self._projId))
            # rv_getstruct = HttpTestTool.getJson(url_getstruct)
            ids = [x.get('id') for x in rv]
            relation = BEOPDataAccess.getInstance().get_fualt_equipment_zone_by_Ids(int(self._projId), ids)
            statisticsAll = []
            if isinstance(rv, list):
                for item in rv:
                    item_relation = relation.get(item.get('id'))
                    statisticsAll.append(dict(id=item.get('id'),
                                              name=item['name'], time=item['time'],
                                              grade=item['grade'], description=item['description'],
                                              equipmentName=item_relation.get('EquipmentName'),
                                              zoneName=item_relation.get('SubBuildingName')
                                              ))
            rt = statisticsAll

        except Exception as e:
            rt = []
        return rt

    # 统计当前的实时诊断结果的汇总(新数据结构)，结构体
    def statistics_realtime_fault(self):
        rt = {}
        try:
            pass
        except:
            pass
        return rt

    def air_calc_ts_by_t_rh(self, t, rh):
        return Air.CalTsByTRH(t, rh)

    def air_calc_tl_by_t_rh(self, t, rh):
        x = Air.CalXByTFai(t, rh)
        Pq = x * 101325 / (622 + x)
        return Air.CalTLByPq(Pq) - 273.15

    def air_calc_h(self, t, rh):
        x = Air.CalXByTFai(t, rh)
        return Air.CalH(t, x)

    def air_calc_x(self, t, rh):
        return Air.CalXByTFai(t, rh)

    # @classmethod
    def checkCaseStatus(self, CaseID, delay=30):
        try:
            r = requests.post('http://' + app.config.get('ONLINE_TEST_ADDRESS') + '/checkCaseNeedSend/',
                              headers={'content-type': 'application/json'},
                              data=json.dumps({'CaseID': CaseID, 'delay': delay})
                              )
            rvData = json.loads(r.text)
            if rvData.get('rt'):
                return True
            else:
                return False
        except Exception as e:
            self.writeFileLog(self._projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
            return False

    # @classmethod
    def setCaseNoticeTime(self, CaseID):
        try:
            r = requests.get('http://121.40.197.63:9001/setCase/{}'.format(CaseID),
                             headers={'content-type': 'application/json'}, timeout=10
                             )
            rvData = json.loads(r.text)
            if rvData.get('rt'):
                return True
            else:
                return False
        except Exception as e:
            self.writeFileLog(self._projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
            return False

    def get_work_order_by_title(self, title, executorName):
        '''
            This function is working for user who wanna get some information about workflow from mongoDB and
            it will return a list for developers.

            Edited by Woody at 2016/12/14 15:00.

        '''
        orderList = []
        MONGO_ADDR = str(app.config['CONFIG_MONGO_ADDR']) + ":" + str(app.config['CONFIG_MONGO_PORT'])
        try:
            executorID = BEOPDataAccess.getInstance().getUserIdByName(executorName)
            if executorID != -1:
                mongoConn = BEOPMongoDataAccess(MONGO_ADDR).mdbBb
                orderList = list(mongoConn['WorkflowTask'].find(
                    {"fields.title": title, "executor": executorID, "status": {"$lt": 2}}).sort('createTime'))
        except Exception as e:
            self.writeFileLog(self._projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
            return None
        return orderList

    def close_work_order(self, orderId):
        rt = False
        try:
            createUserId = 2265
            url = "http://%s/workflow/transaction/close_task/%s/%s" % (
            app.config['BEOPWEB_ADDR'], createUserId, orderId)
            post_headers = {'content-type': 'application/json', 'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
            r = requests.post(url=url, data=json.dumps({}), headers=post_headers)
            if r.status_code == 200:
                ret = json.loads(r.text)
                if ret.get('success'):
                    return True
        except Exception as e:
            self.writeFileLog(self._projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def transfer_work_order(self, exeuctorId, orderId):
        rt = False
        try:
            headersJson = {'content-type': 'application/json', 'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
            url = "http://%s/workflow/changeCurrentNode/" % app.config['BEOPWEB_ADDR']
            cookies = self.getLoginCookies()
            params = {"taskId": str(orderId), "members": [exeuctorId]}
            r = requests.post(url=url, data=json.dumps(params), headers=headersJson, cookies=cookies)
            if r.status_code == 200:
                ret = json.loads(r.text)
                if ret.get('success'):
                    return True
        except Exception as e:
            self.writeFileLog(self._projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def finish_work_order(self, orderId):
        rt = False
        try:
            url = "http://%s/workflow/task/finish/" % app.config['BEOPWEB_ADDR']
            post_headers = {'content-type': 'application/json', 'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
            cookies = self.getLoginCookies()
            r = requests.post(url=url, data=json.dumps({'taskId': orderId}), headers=post_headers, cookies=cookies)
            if r.status_code == 200:
                ret = json.loads(r.text)
                if ret.get('success'):
                    if self._nMode == LogicBase.ONLINE_TEST_REALTIME:
                        self.debugInfo.append('workorder(%s) finished and automaticlly closed.' % (str(orderId)))
                    return True
        except Exception as e:
            self.writeFileLog(self._projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def get_fault_last_update_time_status(self):
        rt = None
        try:
            if self.curCalName and self._projId:
                collection_name = 'fault_data_' + str(self._projId)
                connList = MongoConnManager.getHisConnTuple(self._projId)
                conn = None
                for connItem in connList:
                    st = connItem[1]
                    et = connItem[2]
                    if self._actTime <= et and self._actTime >= st:
                        conn = connItem[0]
                        break
                if conn:
                    rt = conn.get_fault_last_update_time_status(collection_name, self.curCalName)
        except Exception as e:
            self.writeFileLog(self._projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def fault_need_check(self, nextCheckMinutesIfWrong=60, nextCheckMinutesIfSuccess=60):
        bNeedProcess = False
        try:
            lastResult = self.get_fault_last_update_time_status()
            if lastResult:
                nDeltaMinutes = (self.get_act_time() - lastResult['time']).total_seconds() / 60.0
                if lastResult['value'] == 1:  # 代表最近一次诊断有故障,那么超过---分钟后要复查一次
                    if nDeltaMinutes >= nextCheckMinutesIfWrong:
                        bNeedProcess = True
                elif nDeltaMinutes > nextCheckMinutesIfSuccess:  # 如果最近诊断是正常，那么至少---执行一次
                    bNeedProcess = True
            else:
                bNeedProcess = True
        except Exception as e:
            self.writeFileLog(self._projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return bNeedProcess

    def alarm_data_realvalues(self, projId):
        rt = False
        try:
            if self._nMode == LogicBase.REALTIME:
                rt1, rt2 = mongo_operator.get_alarm_data_config(projId)
                timeformat, timeStr = get_timeformat_by_act_time(self._actTime)

                alarm_result_list, alarm_result_info, alarm_result_real = self.check_alarm_data(projId, rt1, rt2)
                # 更新实时库
                # BEOPDataAccess.getInstance().updateAlarm_RtData_by_projid(projId, alarm_result_list)
                if alarm_result_real:
                    RealtimeDataMethods.set_alarm_real_result(projId, alarm_result_real)
                    print(alarm_result_real)
                # 发送Alarm推送消息
                if alarm_result_info:
                    self.triggerAlarm(projId, alarm_result_info)
                # 更新历史库
                if alarm_result_list:
                    self.save_alarm_result(projId, alarm_result_list)


        except Exception as e:
            self.writeFileLog(projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def filter_point_energy_consumption(self, projId, pointName, limitChangeNum):
        # 获取点的当前值
        vNow = self.get_data(projId, pointName)

        # 获取点的距离现在最近一个时间点和对应的值，返回(时间,值)
        tv = self.get_last_update_time_value(projId, pointName)
        if vNow is None:
            if tv[1] is None:
                return None
            else:
                return tv[1]
        else:
            if tv[1] is None:
                return vNow
            else:
                if vNow >= tv[1] and vNow < (tv[1] + limitChangeNum):
                    return vNow
                else:
                    return tv[1]
        return None

    def filter_point_only_increase(self, projId, pointName):
        # 获取点的当前值
        vNow = self.get_data(projId, pointName)
        # 获取点的距离现在最近一个时间点和对应的值，返回(时间,值)
        tv = self.get_last_update_time_value(projId, pointName)
        if vNow is None:
            if tv[1] is None:
                return None
            else:
                return tv[1]
        else:
            if tv[1] is None:
                return vNow
            else:
                if vNow < tv[1]:
                    return tv[1]
                else:
                    return vNow
        return None

    def filter_point_gt_zero(self, projId, pointName):
        # 获取点的当前值
        vNow = self.get_data(projId, pointName)

        if vNow > 0:
            return vNow
        else:
            return None

    def filter_point_change_limit_ratio(self, projId, pointName, fLimitPerHour):
        fLimitPerHour = float(fLimitPerHour)
        # 获取点的当前值
        vNow = self.get_data(projId, pointName)

        # 获取点的距离现在最近一个时间点和对应的值，返回(时间,值)
        tv = self.get_last_update_time_value(projId, pointName)

        if vNow is None:
            if tv[1] is None:
                return None
            else:
                return tv[1]
        else:
            if tv[1] is None:
                return vNow
            else:
                if (tv[1] - fLimitPerHour) <= vNow <= (tv[1] + fLimitPerHour):
                    return vNow
                else:
                    return tv[1]
        return None

    def check_alarm_data(self, projId, alarm_data_type_1, alarm_data_type_2):
        from copy import deepcopy
        try:
            alarm_total = []
            alarm_total_info = []
            alarm_result_real = {}

            # 报警类型1
            # 报警结果 0正常 1异常
            if alarm_data_type_1:
                for alarm_1 in alarm_data_type_1:
                    alarm_result = {}
                    alarm_result_info = {}
                    data_temp = self.cacheManager.get_real(str(alarm_1.get('point')))
                    result_temp = 1
                    if data_temp is not None:
                        if data_temp == alarm_1.get('value_temp'):
                            result_temp = 0
                        if result_temp == 0:
                            alarm_result.update({'alarm_id': alarm_1.get('alarm_id')
                                                    , 'pointName': str(alarm_1.get('point'))
                                                    , 'alarm_result': result_temp
                                                    , 'alarm_time': self._actTime
                                                    , 'alarm_type': 1})
                            alarm_result_temp_1 = deepcopy(alarm_result)
                            alarm_total.append(alarm_result_temp_1)

                            alarm_result_info.update({'alarm_id': alarm_1.get('alarm_id')
                                                         , 'pointName': str(alarm_1.get('point'))
                                                         , 'alarm_result': result_temp
                                                         , 'alarm_time': self._actTime
                                                         , 'alarm_type': 1, 'pointValue': data_temp})
                            if alarm_1.get('isSilent'):
                                alarm_result_info.update({'silentTime_s': alarm_1.get('silentTime_s')
                                                             , 'silentTime_e': alarm_1.get('silentTime_e')
                                                             , 'isSilent': 1})
                            if alarm_1.get('interval'):
                                alarm_result_info.update({'interval': alarm_1.get('interval')})
                            if alarm_1.get('duration'):
                                alarm_result_info.update({'duration': alarm_1.get('duration')})
                            alarm_result_info_temp_1 = deepcopy(alarm_result_info)
                            alarm_total_info.append(alarm_result_info_temp_1)

                            alarm_result_real.update({alarm_1.get('alarm_id'): {'alarm_id': alarm_1.get('alarm_id')
                                , 'pointName': str(alarm_1.get('point'))
                                , 'alarm_result': result_temp
                                , 'alarm_time': self._actTime
                                , 'alarm_type': 1}})
            # 报警类型2
            # 报警结果 ： 1正常 0低于低限 -1 低于低低限 2高于高限 3 高于高高限
            if alarm_data_type_2:
                for alarm_2 in alarm_data_type_2:
                    alarm_result = {}
                    alarm_result_info = {}
                    data_temp = self.cacheManager.get_real(str(alarm_2.get('point')))
                    # data_temp = 180
                    higher = alarm_2.get('value_higher')
                    high = alarm_2.get('value_high')
                    low = alarm_2.get('value_low')
                    lower = alarm_2.get('value_lower')
                    result_temp = 0
                    if data_temp is not None:
                        value_temp = data_temp
                        try:
                            value_temp = float(value_temp)
                        except:
                            continue

                        # 如果高高限的类型是2，根据对应点判断。以下其他限值同逻辑
                        '''
                        if alarm_2.get('type_higher') == 2:
                            if isinstance(higher, str):
                                higher_temp = self.cacheManager.get_real(higher)
                            else:
                                higher_temp = float(higher)
                            if higher_temp is not None:
                                if isinstance(higher_temp, dict):
                                    higher = higher_temp.get('pointValue')
                                else:
                                    higher = higher_temp
                            else:
                                higher = 99999
                        '''
                        if alarm_2.get('type_higher') == 2:
                            higher_temp = self.cacheManager.get_real(str(higher))
                            if higher_temp is not None:
                                higher = higher_temp.get('pointValue')
                            else:
                                higher = 99999

                        if alarm_2.get('type_high') == 2:
                            high_temp = self.cacheManager.get_real(str(high))
                            if high_temp is not None:
                                high = high_temp.get('pointValue')
                            else:
                                high = 99999

                        if alarm_2.get('type_low') == 2:
                            low_temp = self.cacheManager.get_real(str(low))
                            if low_temp is not None:
                                low = low_temp.get('pointValue')
                            else:
                                low = -99999

                        if alarm_2.get('type_lower') == 2:
                            lower_temp = self.cacheManager.get_real(str(lower))
                            if lower_temp is not None:
                                lower = lower_temp.get('pointValue')
                            else:
                                lower = -99999

                        if high is None:
                            high = 99999
                        if higher is None:
                            higher = 99999
                        if low is None:
                            low = -99999
                        if lower is None:
                            lower = -99999

                        if value_temp >= low and value_temp <= high:
                            result_temp = 1
                        elif value_temp >= lower and value_temp < low:
                            result_temp = 0
                            alarm_result_info.update({'advice': alarm_2.get('advice_low')
                                                         , 'msg': alarm_2.get('msg_low'),
                                                      'grade': alarm_2.get('grade_low')})
                        elif value_temp > high and value_temp <= higher:
                            result_temp = 2
                            alarm_result_info.update({'advice': alarm_2.get('advice_high')
                                                         , 'msg': alarm_2.get('msg_high'),
                                                      'grade': alarm_2.get('grade_high')})
                        elif value_temp < lower:
                            result_temp = -1
                            alarm_result_info.update({'advice': alarm_2.get('advice_lower')
                                                         , 'msg': alarm_2.get('msg_lower'),
                                                      'grade': alarm_2.get('grade_lower')})
                        elif value_temp > higher:
                            result_temp = 3
                            alarm_result_info.update({'advice': alarm_2.get('advice_higher')
                                                         , 'msg': alarm_2.get('msg_higher'),
                                                      'grade': alarm_2.get('grade_higher')})

                        # 如果诊断结果异常
                        if result_temp != 1:
                            alarm_result.update({'alarm_id': alarm_2.get('alarm_id')
                                                    , 'pointName': str(alarm_2.get('point'))
                                                    , 'alarm_result': result_temp
                                                    , 'alarm_time': self._actTime
                                                    , 'alarm_type': 2})
                            alarm_result_temp_2 = deepcopy(alarm_result)
                            alarm_total.append(alarm_result_temp_2)

                            alarm_result_info.update({'alarm_id': alarm_2.get('alarm_id')
                                                         , 'pointName': str(alarm_2.get('point'))
                                                         , 'alarm_result': result_temp
                                                         , 'alarm_time': self._actTime
                                                         , 'alarm_type': 2, 'pointValue': value_temp})
                            if higher != 99999:
                                alarm_result_info.update({'highhigh': higher})
                            if high != 99999:
                                alarm_result_info.update({'high': high})
                            if low != -99999:
                                alarm_result_info.update({'low': low})
                            if lower != -99999:
                                alarm_result_info.update({'lowlow': lower})
                            if alarm_2.get('isSilent'):
                                alarm_result_info.update({'silentTime_s': alarm_2.get('silentTime_s')
                                                             , 'silentTime_e': alarm_2.get('silentTime_e')
                                                             , 'isSilent': 1})
                            if alarm_2.get('interval'):
                                alarm_result_info.update({'interval': alarm_2.get('interval')})
                            if alarm_2.get('duration'):
                                alarm_result_info.update({'duration': alarm_2.get('duration')})
                            alarm_result_info_temp_2 = deepcopy(alarm_result_info)
                            alarm_total_info.append(alarm_result_info_temp_2)

                            alarm_result_real.update({alarm_2.get('alarm_id'): {'alarm_id': alarm_2.get('alarm_id')
                                , 'pointName': str(alarm_2.get('point'))
                                , 'alarm_result': result_temp
                                , 'alarm_time': self._actTime
                                , 'alarm_type': 2}})
            return alarm_total, alarm_total_info, alarm_result_real
        except Exception as e:
            self.writeFileLog(projId, '%s in %s: (%s, %s)' % (
            get_current_func_name(), __name__[__name__.rfind('/') + 1:], str(alarm_data_type_1),
            str(alarm_data_type_2)) + e.__str__())
            return None, None, None

    def save_alarm_result(self, projId, alarm_result_list):
        rt = False
        try:
            tStart = time.time()
            if self._actTime:
                aTime = self._actTime.replace(second=0)
                connList = MongoConnManager.getHisConnTuple(projId)
                conn = None
                for connItem in connList:
                    st = connItem[1]
                    et = connItem[2]
                    if aTime <= et and aTime >= st:
                        conn = connItem[0]
                        break
                dbName = 'alarm_data_%d' % (int(projId))
                for item in alarm_result_list:
                    item.update({'mTime': datetime.now()})
                    if isinstance(item.get('alarm_time'), str):
                        item.update({'alarm_time': datetime.strptime(item.get('alarm_time'), standard_time_format)})
                        # resMongoUpdated = conn.updateAlarmHistoryData(str(item.get('alarm_id')), str(item.get('pointName'))
                        # , item.get('alarm_time'),item.get('alarm_result')
                        # ,item.get('alarm_type'), dbName)
                resMongoUpdated = conn.insertAlarmHistoryData(alarm_result_list, dbName)
        except Exception as e:
            self.writeFileLog(projId,
                              '%s in %s:' % (get_current_func_name(), __name__[__name__.rfind('/') + 1:]) + e.__str__())
        return rt

    def triggerAlarm(self, projId, alarm_result_list):
        try:
            if app.config['LOGGING_LEVEL'] <= 0:
                strLog = 'triggerAlarm for projId:%d' % (int(projId),)
                print(strLog)
                logging.info(strLog)
            alarm_result = {}
            # .strftime(standard_time_format)
            for item in alarm_result_list:
                item.update({'alarm_time': item.get('alarm_time').strftime(standard_time_format), '_id': 0, 'mTime': 0})
                alarm_result[item.get('pointName')] = item
            data = dict(projId=projId, alarm_result_list=alarm_result)
            jsonData = json.dumps(data, ensure_ascii=False)

            if not MQManager.RabbitMqWorkQueueSend(app.config['MQ_RECEIVE_ALARM_NAME'], jsonData):
                return False
        except Exception as e:
            print('triggerAlarm error:' + e.__str__())
            logging.error('triggerAlarm error:' + e.__str__())
            return False
        return True

    def calibration_by_baseline(self, ptName, calibrationInfo):

        fValue = self.get_data(self._projId, ptName)
        if fValue is None:
            return None

        fA = 1.0
        fB = 0.0
        try:
            dictCalibration = calibrationInfo
            if dictCalibration is None:
                return fValue

            ts = dictCalibration.keys()
            items = list(dictCalibration.items())
            if len(ts) == 0:
                return fValue
            elif len(ts) == 1:
                fv = [0][1]
                return fValue + fv
            elif len(ts) == 2:
                fA = (float(items[1][1]) - float(items[0][1])) / (float(items[1][0]) - float(items[0][0]))
                fB = float(items[0][1]) - fA * float(items[0][0])
                fDelta = fA * fValue + fB
                return fDelta + fValue
        except Exception as e:
            self.debugInfo.append('calibration_temp error:' + e.__str__())
            logging.error('calibration_temp error:' + e.__str__())
            return fValue
        return fValue

    def get_failure_number_and_failure_time_of_statistics(self, projId):
        '''
        David add 20161118
        '''
        return BEOPDataAccess.getInstance().get_failure_number_and_failure_time_of_statistics(projId)

    def get_pm25_from_web(self, cityName, area=None):
        '''
        edited at 20161211
        woody add 20161121
        :param cityName:
        :return:
        '''
        rv = {}
        pm_url = 'http://www.pm25.in/' + cityName
        driver = None
        try:
            driver = webdriver.PhantomJS()
            driver.get(pm_url)
            time.sleep(2)
            temp = driver.find_element_by_css_selector('.span12.data')
            spans = temp.find_elements_by_class_name('span1')
            last_update_time = driver.find_element_by_css_selector('.live_data_time p').text
            last_update_time = last_update_time[-19:]
            # 如果传入区域参数
            if area:
                pmIndex = {
                    2: 'AQI',
                    3: 'Air_condition',
                    5: 'PM25_1h',
                    6: 'PM10_1h',
                    7: 'CO_1h',
                    8: 'NO2_1h',
                    9: 'O3_1h',
                    10: 'O3_8h',
                    11: 'SO2_1h'

                }
                trs = driver.find_elements_by_css_selector("#detail-data tbody tr")
                for index, line in enumerate(trs):
                    if line.find_element_by_css_selector('td:nth-child(1)').text == area:
                        print(index)
                        for key, value in pmIndex.items():
                            v = line.find_element_by_css_selector('td:nth-child(%s)' % key).text
                            if v == '_':
                                v = 'null'
                            if key == 10:
                                v = driver.execute_script('return $(".O3_8h_dn")[%d].innerText' % (index + 1))
                            rv.update({value: v})
                        rv.update({"updateTime": last_update_time, 'error': 0})
                        return rv
            for span in spans[:-1]:
                s = span.find_elements_by_tag_name('div')
                value = s[0].text
                key = s[1].text.replace('/', '_')
                key = key.replace('.', '')
                rv.update({key: value})
            rv.update(Air_condition=driver.find_element_by_css_selector('.level').text)
            rv.update({"updateTime": last_update_time, 'error': 0})
        except Exception as e:
            rv = {'error': 1, 'msg': 'unexpected city name'}
            logging.error('get_pm25_from_web error:' + e.__str__())
            # raise Exception('function: get_pm25_from_web error: %s' % e.__str__())
        finally:
            if driver:
                driver.quit()
        return rv

    def get_pm25_from_web_v2(self, cityName, area=None):
        '''
        new API added by woody at 20161223
        :param cityName:
        :return:
        '''
        pm_url = 'http://www.pm25.com/{}.html'.format(cityName)
        rv = {}
        default = '选择监测点'
        try:
            r = requests.get(pm_url, timeout=30)
            html = r.content
            soup = BeautifulSoup(html, 'html5lib')
            if not area:
                area = default
            rt = soup.find_all('a', mon=area)
            if rt:
                AQI = rt[0].get('aqi')
                Air_condition = rt[0].get('qua')
                PM25_1h = rt[0].get('pm25')
                rv.update(AQI=AQI, Air_condition=Air_condition, PM25_1h=PM25_1h)
                rv.update(error=0)
                return rv
            else:
                return {'error': 1, 'msg': 'unexpected city or area name'}
        except Exception as e:
            rv = {'error': 1, 'msg': 'unexpected city name'}
            logging.error('get_pm25_from_web_v2 error:' + e.__str__())
            return rv

    def num_join_int64(self, intHH, intH, intL, intLL):
        '''

        :param intHH: 高高位电表(int类型)
        :param intH: 高位电表(int类型)
        :param intL: 低位电表(int类型)
        :param intLL: 低低位电表(int类型)
        :return:
        '''
        dataList = [intHH, intH, intL, intLL]
        try:
            data = [int(x) for x in dataList]
            int_64 = [hex(x)[2:] for x in data]
            patched_int_list = []
            for dd in int_64:
                if len(dd) == 1:
                    patched_int_list.append('000' + dd)
                elif len(dd) == 2:
                    patched_int_list.append('00' + dd)
                elif len(dd) == 3:
                    patched_int_list.append('0' + dd)
                else:
                    patched_int_list.append(dd)
            return int(''.join(patched_int_list), 16)
        except Exception as e:
            logging.error('num_join_int64 error:' + e.__str__())
            return None

    def set_data_to_site(self, pointNameList, pointValueList):
        if isinstance(pointNameList, str):
            pointNameList = [pointNameList]
            pointValueList = [pointValueList]

        projName = BEOPDataAccess.getInstance().getProjNameById(self._projId)
        headers = {'content-type': 'application/json', 'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
        data = dict(point=pointNameList, value=pointValueList, db=projName)
        rv = requests.post('http://%s/set_mutile_to_site_by_projname' % (app.config['BEOPWEB_ADDR']),
                           data=json.dumps(data), headers=headers, timeout=3000)
        dictRv = json.loads(rv.text)
        return True

    def get_global_storage(self, key):
        return RedisManager.get(key)

    def set_global_storage(self, key, strValue):
        RedisManager.set(key, strValue)

    def stat_fault_by_faultname(self, projId):
        '''
        David 20161206
        '''
        startTime = datetime.now().strftime("%Y-%m-01 00:00:00")
        endTime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return BEOPDataAccess.getInstance().stat_fault_by_faultname(projId, startTime, endTime)

    def stat_fault_worktime_by_faultname(self, projId, startTime, endTime):
        '''
        David 20161206
        '''
        return BEOPDataAccess.getInstance().stat_fault_by_faultname(projId, startTime, endTime)

    def stat_fault_by_buildingId(self, projId):
        '''
        David 20161206
        '''
        startTime = datetime.now().strftime("%Y-%m-01 00:00:00")
        endTime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return BEOPDataAccess.getInstance().stat_fault_by_buildingId(projId, startTime, endTime)

    def stat_fault_by_zoneId(self, projId):
        '''
        David 20161206
        '''
        startTime = datetime.now().strftime("%Y-%m-01 00:00:00")
        endTime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return BEOPDataAccess.getInstance().stat_fault_by_zoneId(projId, startTime, endTime)

    def stat_fault_by_faultname_time(self, projId, selectstarttime, selectendtime, startHour, endhour):
        '''
        David 20170104
        '''
        return BEOPDataAccess.getInstance().stat_fault_by_faultname_time(projId, selectstarttime, selectendtime,
                                                                         startHour, endhour)

    def get_storage_by_projId(self):
        '''
        获取该项目存储空间
        Returns:
            空间大小，单位
        '''
        Storage = 0
        dbAccess = BEOPDataAccess.getInstance()
        locateMap = RedisManager.get_project_locate_map()
        if not locateMap:
            dbAccess.GenerateMemcache()
            MongoConnManager.genMongoConnMember()
        if locateMap:
            projectLocate = locateMap.get('projectLocate')
            mongoInstance = locateMap.get('mongoInstance')
            projId = self._projId
            CollectionName = dbAccess.getCollectionNameById(projId)
            if not CollectionName:
                return 0
            v2_seperate_time = dbAccess.get_v2_struct_seperate_time(projId)
            locateList = projectLocate.get(str(projId), [])
            for l in locateList:
                prefix_sec = ''
                if v2_seperate_time:
                    v2 = datetime.strptime(v2_seperate_time, '%Y-%m-%d %H:%M:%S')
                    start_time = datetime.strptime(l.get('start_time'), '%Y-%m-%d %H:%M:%S')
                    end_time = datetime.strptime(l.get('end_time'), '%Y-%m-%d %H:%M:%S')
                    if v2 >= end_time:
                        prefix = 'm5_data_'
                    elif start_time >= v2:
                        prefix = 'v2_data_'
                    else:
                        prefix = 'm5_data_'
                        prefix_sec = 'v2_data_'
                else:
                    prefix = 'm5_data_'
                table_name = prefix + CollectionName
                table_name_sec = ''
                if prefix_sec:
                    table_name_sec = prefix_sec + CollectionName
                mongo_server_id = l.get('mongo_server_id')
                clusterName = mongoInstance.get(str(mongo_server_id), {}).get('clusterName')
                if app.config.get('BEOPCLUSTER') != clusterName:
                    addr = l.get('internet_addr')
                else:
                    addr = l.get('internal_addr')
                conn = BEOPMongoDataAccess(addr)
                Storage += conn.mdbBb.command('collstats', table_name)['storageSize']
                if table_name_sec:
                    Storage += conn.mdbBb.command('collstats', table_name_sec)['storageSize']
        return Storage

    def get_fault_notice_count(self):
        return BEOPDataAccess.getInstance().get_fault_notice_count(self._projId, datetime.strftime(self._actTime,
                                                                                                   '%Y-%m-%d %H:%M:%S'))

    def cloudpoint_exist(self, ptName):
        data = {"projectId": self._projId, "currentPage": 1, "pointType": 1, "searchText": ptName, "t_time": "",
                "pageSize": 100}

        headers = {"Content-Type": "application/json",
                   "charset": "UTF-8",
                   "token": app.config.get('BEOPWEB_SECRET_TOKEN')}

        try:
            cookies = self.getLoginCookies()
            rv = requests.post(url='http://%s/point_tool/getCloudPointTable/' % (app.config['BEOPWEB_ADDR']),
                               data=json.dumps(data), headers=headers, cookies=cookies, timeout=3000)

            info = json.loads(rv.text)
            # {"msg": "", "code": "1", "data": {"pointTable": [], "pointTotal": 0}, "success": true}
            if info.get('data'):
                ptCount = info.get('data').get('pointTotal')
                if ptCount and ptCount > 0:
                    return True
        except Exception as e:
            return False
        return False

    def cloudpoint_create_virtual(self, ptName, ptDescription, strDefaultValue):

        data = {'id': '',
                'oldName': '',
                'flag': 1,
                'value': ptName,
                'alias': ptDescription,
                'point_value': strDefaultValue
                }

        headers = {"Content-Type": "application/x-www-form-urlencoded",
                   "charset": "UTF-8",
                   "token": app.config.get('BEOPWEB_SECRET_TOKEN')}
        try:
            cookies = self.getLoginCookies()
            rv = requests.post(
                url='http://%s/point_tool/addCloudPoint/%d/' % (app.config['BEOPWEB_ADDR'], int(self._projId)),
                data=data, headers=headers, cookies=cookies, timeout=3000)

            diagResults = json.loads(rv.text)
            return True
        except Exception as e:
            return False
        return False

    def hisdata_op_replace_pointname(self, strToken, strPointName, strTimeFrom, strTimeTo, strPointNameNew):
        try:
            if strToken != 'DOM-OP.9399':
                self.debugInfo.append('not authorized.')
                return

            connList = MongoConnManager.getHisConnTuple(self._projId)
            conn = None
            for connItem in connList:
                st = connItem[1]
                et = connItem[2]
                if self._actTime <= et and self._actTime >= st:
                    conn = connItem[0]
                    break
            dbName = BEOPDataAccess.getInstance().GetCollectionNameById(self._projId)
            collectionname = 'm5_data_' + dbName
            if conn:
                rmCount = 0
                rmCount += conn.replacePointNameInTimeRange(collectionname, strPointName, strTimeFrom, strTimeTo,
                                                            strPointNameNew)
                self.debugInfo.append('updated data count: %d for point: %s' % (rmCount, strPointName))
        except Exception as e:
            return False
        return False

    def hisdata_op_remove_data_by_value(self, strToken, strPointName, strTimeFrom, strTimeTo, strCondition):
        try:
            if strToken != 'RNBbeop2013':
                self.debugInfo.append('not authorized.')
                return

            connList = MongoConnManager.getHisConnTuple(self._projId)
            conn = None
            for connItem in connList:
                st = connItem[1]
                et = connItem[2]
                if self._actTime <= et and self._actTime >= st:
                    conn = connItem[0]
                    break
            dbName = BEOPDataAccess.getInstance().GetCollectionNameById(self._projId)
            collectionname = 'm5_data_' + dbName
            if conn:
                rmCount = 0
                rmCount += conn.deletePointByPTVCondition(collectionname, strPointName, strTimeFrom, strTimeTo,
                                                          strCondition)
                self.debugInfo.append('removed data count: %d' % (rmCount))
        except Exception as e:
            return False
        return False

    def remove_mutation_data(self, strToken, strPointName, strTimeFrom, strTimeTo, fMutationLimit):
        try:
            if strToken != 'RNBbeop2013':
                self.debugInfo.append('not authorized.')
                return

            pointList = self.filterPointList(self._projId, [strPointName])
            strPointName = pointList[0]
            allHisData = BEOPDataAccess.getInstance().getHistoryData(self._projId, pointList, strTimeFrom, strTimeTo,
                                                                     'm1')
            dataRecords = allHisData[0]['record']
            dataRecords.sort(key=lambda x: x.get('time'))
            if len(dataRecords) <= 3:
                self.debugInfo.append(
                    '%s point data in timerange(%s to %s) count <3, no deal' % (strPointName, strTimeFrom, strTimeTo))
                return True

            strNeedRemovedTimeList = []
            fCommanValue = None
            for i in range(len(dataRecords) - 2):

                fData0 = float(dataRecords[i]['value'])
                if fCommanValue is None:
                    fCommanValue = fData0
                fData1 = float(dataRecords[i + 1]['value'])
                bPulse = False
                if fData1 > fCommanValue + fMutationLimit:
                    nIndexFind = i
                    while nIndexFind < len(dataRecords) - 1:
                        if float(dataRecords[nIndexFind]['value']) < (fData1 - fMutationLimit):
                            bPulse = True
                            break
                        nIndexFind += 1

                elif fData1 < fCommanValue - fMutationLimit:
                    nIndexFind = i
                    while nIndexFind < len(dataRecords) - 1:
                        if float(dataRecords[nIndexFind]['value']) > (fData1 + fMutationLimit):
                            bPulse = True
                            break
                        nIndexFind += 1
                if bPulse:
                    strNeedRemovedTimeList.append(dataRecords[i + 1]['time'])
                else:
                    fCommanValue = fData1

            if len(strNeedRemovedTimeList) <= 0:
                self.debugInfo.append('all data have no mutation')
                return True

            connList = MongoConnManager.getHisConnTuple(self._projId)
            conn = None
            for connItem in connList:
                st = connItem[1]
                et = connItem[2]
                if self._actTime <= et and self._actTime >= st:
                    conn = connItem[0]
                    break
            dbName = BEOPDataAccess.getInstance().GetCollectionNameById(self._projId)
            if conn:
                rmCount = 0
                for strTime in strNeedRemovedTimeList:
                    seperate_time = BEOPDataAccess.getInstance().get_v2_struct_seperate_time(self._projId)
                    version = 'v2'
                    if seperate_time is None:
                        version = 'm5'
                    else:
                        if datetime.strptime(strTime, '%Y-%m-%d %H:%M:%S') < datetime.strptime(seperate_time,
                                                                                               '%Y-%m-%d %H:%M:%S'):
                            version = 'm5'
                        else:
                            version = 'v2'
                    collectionname = 'm5_data_' + dbName if version == 'm5' else 'v2_data_' + dbName
                    rmCount += conn.deletePointByPTV(collectionname, strPointName, strTime, None, False, version)
                self.debugInfo.append('removed data count: %d' % (rmCount))
        except Exception as e:
            return False
        return False

    def update_history_data_replace_value(self, strToken, strTimeFrom, strTimeTo, valueBefore, valueAfter):
        try:
            if strToken != 'RNBbeop2013':
                self.debugInfo.append('not authorized.')
                return
            connList = MongoConnManager.getHisConnTuple(self._projId)
            conn = None
            for connItem in connList:
                st = connItem[1]
                et = connItem[2]
                if self._actTime <= et and self._actTime >= st:
                    conn = connItem[0]
                    break
            dbName = BEOPDataAccess.getInstance().GetCollectionNameById(self._projId)
            collectionname = 'm5_data_' + dbName
            if conn:
                rmCount = conn.updateHistoryDataReplaceValue(collectionname, strTimeFrom, strTimeTo, valueBefore,
                                                             valueAfter)
                self.debugInfo.append('replaced data count: %d' % (rmCount))
        except Exception as e:
            return False
        return False

    def hisdata_op_remove_history_data(self, strToken, strTime, strPointName, strPointValue=None, bOnlyDelPatched=True):
        try:
            if strToken != 'RNBbeop2013':
                self.debugInfo.append('not authorized.')
                return
            connList = MongoConnManager.getHisConnTuple(self._projId)
            conn = None
            for connItem in connList:
                st = connItem[1]
                et = connItem[2]
                if self._actTime <= et and self._actTime >= st:
                    conn = connItem[0]
                    break
            dbName = BEOPDataAccess.getInstance().GetCollectionNameById(self._projId)
            collectionname = 'm5_data_' + dbName
            if conn:
                rmCount = conn.deletePointByPTV(collectionname, strPointName, strTime, strPointValue, bOnlyDelPatched)
                self.debugInfo.append('removed data count: %d' % (rmCount))
        except Exception as e:
            return False
        return False

    def hisdata_op_remove_history_data_in_timerange(self, strToken, strTimeFrom, strTimeTo, pointList,
                                                    bOnlyDelPatched=False):
        try:
            if strToken != 'RandomPwd.43288834':
                self.debugInfo.append('not authorized.')
                return
            connList = MongoConnManager.getHisConnTuple(self._projId)
            conn = None
            tFrom = datetime.strptime(strTimeFrom, standard_time_format)
            for connItem in connList:
                st = connItem[1]
                et = connItem[2]
                if tFrom <= et and tFrom >= st:
                    conn = connItem[0]
                    break
            dbName = BEOPDataAccess.getInstance().GetCollectionNameById(self._projId)
            collectionname = 'm5_data_' + dbName
            if conn:
                rmCount = conn.deletePoints(collectionname, pointList, strTimeFrom, strTimeTo, bOnlyDelPatched)
                self.debugInfo.append('removed data count: %d' % (rmCount))
        except Exception as e:
            return False
        return False

    def get_latest_time(self, projId):
        rt = None
        try:
            connList = MongoConnManager.getHisConnTuple(projId)
            conn = None
            for connItem in connList:
                st = connItem[1]
                et = connItem[2]
                if self._actTime <= et and self._actTime >= st:
                    conn = connItem[0]
                    break
            if conn:
                dbName = BEOPDataAccess.getInstance().GetCollectionNameById(projId)
                collectionname = 'm5_data_' + dbName
                rt = conn.get_latest_time(collectionname)
            else:
                raise Exception('project %s not in locatemap' % (projId,))
        except Exception as e:
            rt = str(e)
        return rt

    def get_cloudpoints_list(self, projId, nPointType=0):
        sitePointsList = mongo_operator.getCloudPointSiteType(projId)
        return sitePointsList

    def get_rawpoints_list(self, projId):
        return BEOPDataAccess.getInstance().getFlag0PointValueList(projId)

    def autotest_check_name_conflict(self, projId):
        return BEOPDataAccess.getInstance().checkPointNameConflict(projId)

    def get_energy_by_faultNames(self, projId, faultNameList, startTime, endTime, interval='Year'):
        '''
        interval 统计时间的间隔 Day, Week, Month, Year
        '''
        rt = {}
        for faultName in faultNameList:
            rt.update(BEOPDataAccess.getInstance().diagnosis_get_energyAve_by_equipmentId(projId, faultName, startTime,
                                                                                          endTime, interval))
        return rt

    def patrol_complete_rate(self, projId, stratTime='2017-01'):
        # 获取2017-01月开始的巡更记录
        url = 'http://' + app.config['BEOPWEB_ADDR'] + '/patrol/mercedes/getCompleteRate/'
        endDate = datetime.now().strftime('%Y-%m')
        try:
            rt = HttpTestTool.postJsonWithCookie(url,
                                                 data={'projId': projId, 'startDate': stratTime, 'endDate': endDate},
                                                 t=1200)
            return rt
        except Exception as e:
            logging.error('patrol_complete_rate error:' + e.__str__())
            return None

    def get_energy_all_by_time(self, projId, startTime, endTime):
        '''
        David 20170411
        统计给定时间段内 故障总条数 、能耗浪费
        '''
        return BEOPDataAccess.getInstance().get_energy_all_by_time(projId, startTime, endTime)

    def get_energy_by_systemName(self, projId, startTime, endTime):
        '''
        David 20170411
        统计给定时间段内 按systemname统计的故障条数、能耗浪费
        '''
        return BEOPDataAccess.getInstance().get_energy_by_systemName(projId, startTime, endTime)

    def get_energylist_by_faultName_order_by_energy(self, projId, startTime, endTime):
        '''
        David 20170411
        按节能量降序排列的能耗浪费信息
        '''
        return BEOPDataAccess.getInstance().get_energylist_by_faultName_order_by_energy(projId, startTime, endTime)

    def get_new_order_num(self, projId, startTime, endTime):
        '''
        David 20170411
        新增工单总条数
        '''
        return BEOPDataAccess.getInstance().get_new_order_num(projId, startTime, endTime)

    def get_finished_order_num(self, projId, startTime, endTime):
        '''
        David 20170412
        完成工单的条数
        '''
        orderId_list = BEOPDataAccess.getInstance().get_finished_orderId(projId, startTime, endTime)
        orderstatue_list = MongoConnManager.getConfigConn().get_work_order_state(orderId_list)
        rt = 0
        for item in orderstatue_list:
            if int(item.get('status')) == 2:
                rt += 1
        return rt

    def get_response_time_avg(self, projId, startTime, endTime):
        '''
        David 20170412
        工单平均响应时间
        '''
        return BEOPDataAccess.getInstance().get_response_time_avg(projId, startTime, endTime)

    def create_all_energy_standard_point_by_tag(self, projId):
        rt = True
        try:
            array = {
                "proj": [
                    {
                        "projID": int(projId)
                    }],
                "main": [{
                    "CHWSupplyT": "CHW_SupplyT",
                    "CHWReturnT": None,
                    "CHWFlow": None,
                    "HWSupplyT": "HW_SupplyT",
                    "HWReturnT": None,
                    "HWFlow": "HW_Flow"
                }],
                "Equipment": [{
                    "EquipType": "Chiller",  # tag: Chiller
                    "Equip": "Chiller1",  # tag: Chiller, EquipSeq1(?)
                    "Status": "L13_Chiller1_Status",  # 设备状态     tag: Chiller, EquipSeq1(?), Status
                    "LoadRatio": "L13_Chiller1_Demand",  # 电流百分比    tag: Chiller, EquipSeq1(?), AmpRatio
                    "RatedPower": None,  # 额定功率  tag: Chiller, EquipSeq1(?), Rated(?), Power
                    "PowerInput": "L13_Chiller1_TotalInputPower",  # 当前功率   tag: Chiller, EquipSeq1(?),Power
                    "WaterFlow": "L13_Chiller1_CHWFlow",  # 水流量     tag: Chiller, EquipSeq1(?), Water, Flow
                    "WaterLeaveT": "L13_Chiller1_CHWLeaveTemp",
                # 供水温度   tag: Chiller, EquipSeq1(?), Supply, Temperature
                    "WaterEnterT": "L13_Chiller1_CHWEnterTemp",
                # 回水温度   tag: Chiller, EquipSeq1(?), Return, Temperature
                    "kWhCounter": None,  # 用电量（电表）    tag: Chiller, EquipSeq1(?), Energy
                    "Freq": None  # 频率   tag: Chiller, EquipSeq1(?), Frequent
                }, {
                    "EquipType": "PCHWP",  # tag:   Primary, CHWP
                    "Equip": "PCHWP1",  # tag:   Primary, CHWP, EquipSeq1(?)
                    "Status": "L13_PCHWP1_Status",  # tag:   Primary, CHWP, EquipSeq1(?), Status
                    "LoadRatio": None,  # tag:   Primary, CHWP, EquipSeq1(?), AmpRatio
                    "RatedPower": "L13_PCHWP1_RatedPower",  # tag:   Primary, CHWP, EquipSeq1(?), Rated(?), Power
                    "PowerInput": None,  # tag:   Primary, CHWP, EquipSeq1(?), Power
                    "WaterFlow": None,  # tag:   Primary, CHWP, Water, Flow
                    "WaterLeaveT": None,  # tag:   Primary, CHWP, Supply, Temperature
                    "WaterEnterT": None,  # tag:   Primary, CHWP, Return, Temperature
                    "kWhCounter": None,  # tag:   Primary, CHWP, Energy
                    "Freq": "L13_PCHWP1_VSDFreq"  # tag:   Primary, CHWP,  Frequent
                }, {
                    "EquipType": "PCHWP",  # tag:   Primary, CHWP
                    "Equip": "PCHWP2",  # tag:   Primary, CHWP, EquipSeq1(?)
                    "Status": "L13_PCHWP2_Status",  # tag:   Primary, CHWP, EquipSeq1(?), Status
                    "LoadRatio": None,  # tag:   Primary, CHWP, EquipSeq1(?), AmpRatio
                    "RatedPower": "L13_PCHWP2_RatedPower",  # tag:   Primary, CHWP, EquipSeq1(?), Rated(?), Power
                    "PowerInput": "L13_PCHWP2_Power",  # tag:   Primary, CHWP, EquipSeq1(?), Power
                    "WaterFlow": None,  # tag:   Primary, CHWP, Water, Flow
                    "WaterLeaveT": None,  # tag:   Primary, CHWP, Supply, Temperature
                    "WaterEnterT": None,  # tag:   Primary, CHWP, Return, Temperature
                    "kWhCounter": None,  # tag:   Primary, CHWP, Energy
                    "Freq": "L13_PCHWP2_VSDFreq"  # tag:   Primary, CHWP,  Frequent
                }, {
                    "EquipType": "SCHWP",  # tag: Secondary, CHWP
                    "Equip": "SCHWP1",  # tag: Secondary, CHWP, EquipSeq1(?)
                    "Status": "L13_SCHWP1_Status",  # tag: Secondary, CHWP, EquipSeq1(?), Status
                    "LoadRatio": None,  # tag: Secondary, CHWP, AmpRatio
                    "RatedPower": "L13_SCHWP1_RatedPower",  # tag: Secondary, CHWP, Rated(?), Power
                    "PowerInput": None,  # tag: Secondary, CHWP, Power
                    "WaterFlow": None,  # tag: Secondary, CHWP, Flow
                    "WaterLeaveT": None,  # tag: Secondary, CHWP, Supply, Temperature
                    "WaterEnterT": None,  # tag: Secondary, CHWP, Return, Temperature
                    "kWhCounter": None,  # tag: Secondary, CHWP, Energy
                    "Freq": "L13_SCHWP1_VSDFreq"  # tag: Secondary, CHWP, Frequent
                }, {
                    "EquipType": "SCHWP",  # tag: Secondary, CHWP
                    "Equip": "SCHWP2",  # tag: Secondary, CHWP, EquipSeq1(?)
                    "Status": "L13_SCHWP2_Status",  # tag: Secondary, CHWP, EquipSeq1(?), Status
                    "LoadRatio": None,  # tag: Secondary, CHWP, AmpRatio
                    "RatedPower": "L13_SCHWP2_RatedPower",  # tag: Secondary, CHWP, Rated(?), Power
                    "PowerInput": None,  # tag: Secondary, CHWP, Power
                    "WaterFlow": None,  # tag: Secondary, CHWP, Flow
                    "WaterLeaveT": None,  # tag: Secondary, CHWP, Supply, Temperature
                    "WaterEnterT": None,  # tag: Secondary, CHWP, Return, Temperature
                    "kWhCounter": None,  # tag: Secondary, CHWP, Energy
                    "Freq": "L13_SCHWP2_VSDFreq"  # tag: Secondary, CHWP, Frequent
                }, {
                    "EquipType": "CWP",  # tag: CWP
                    "Equip": "CWP1",  # tag: CWP, EquipSeq1(?)
                    "Status": "L13_CWP1_Status",  # tag: CWP, EquipSeq1(?), Status
                    "LoadRatio": None,  # tag: CWP, EquipSeq1(?), AmpRatio
                    "RatedPower": None,  # tag: CWP, EquipSeq1(?), Rated(?), Power
                    "PowerInput": "L13_CWP1_VSDPower",  # tag: CWP, EquipSeq1(?),  Power
                    "WaterFlow": None,  # tag: CWP, EquipSeq1(?), Flow
                    "WaterLeaveT": None,  # tag: CWP, EquipSeq1(?), Supply, Temperature
                    "WaterEnterT": None,  # tag: CWP, EquipSeq1(?), Return, Temperature
                    "kWhCounter": None,  # tag: CWP, EquipSeq1(?), Energy
                    "Freq": "L13_CWP1_VSDFreq"  # tag: CWP, EquipSeq1(?), Frequent
                }, {
                    "EquipType": "CWP",  # tag: CWP
                    "Equip": "CWP2",  # tag: CWP, EquipSeq1(?)
                    "Status": "L13_CWP2_Status",  # tag: CWP, EquipSeq1(?), Status
                    "LoadRatio": None,  # tag: CWP, EquipSeq1(?), AmpRatio
                    "RatedPower": None,  # tag: CWP, EquipSeq1(?), Rated(?), Power
                    "PowerInput": "L13_CWP2_VSDPower",  # tag: CWP, EquipSeq1(?),  Power
                    "WaterFlow": None,  # tag: CWP, EquipSeq1(?), Flow
                    "WaterLeaveT": None,  # tag: CWP, EquipSeq1(?), Supply, Temperature
                    "WaterEnterT": None,  # tag: CWP, EquipSeq1(?), Return, Temperature
                    "kWhCounter": None,  # tag: CWP, EquipSeq1(?), Energy
                    "Freq": "L13_CWP2_VSDFreq"  # tag: CWP, EquipSeq1(?), Frequent
                }, {
                    "EquipType": "CT",  # tag: CT
                    "Equip": "CT1",  # tag: CT, EquipSeq1(?)
                    "Status": "Roof_CT1_Status",  # tag: CT, EquipSeq1(?), Status
                    "LoadRatio": None,  # tag: CT, EquipSeq1(?), AmpRatio
                    "RatedPower": None,  # tag: CT, EquipSeq1(?),  Rated(?), Power
                    "PowerInput": "Roof_CT1_VSDPower",  # tag: CT, EquipSeq1(?), Power
                    "WaterFlow": None,  # tag: CT, EquipSeq1(?), Flow
                    "WaterLeaveT": None,  # tag: CT, EquipSeq1(?), Supply, Temperature
                    "WaterEnterT": None,  # tag: CT, EquipSeq1(?), Return, Temperature
                    "kWhCounter": None,  # tag: CT, EquipSeq1(?), Energy
                    "Freq": "Roof_CT2_VSDFreq"  # tag: CT, EquipSeq1(?), Frequent
                }, {
                    "EquipType": "CT",  # tag: CT
                    "Equip": "CT2",  # tag: CT, EquipSeq1(?)
                    "Status": "Roof_CT2_Status",  # tag: CT, EquipSeq1(?), Status
                    "LoadRatio": None,  # tag: CT, EquipSeq1(?), AmpRatio
                    "RatedPower": "Roof_CT2_RatedPower",  # tag: CT, EquipSeq1(?),  Rated(?), Power
                    "PowerInput": None,  # tag: CT, EquipSeq1(?), Power
                    "WaterFlow": None,  # tag: CT, EquipSeq1(?), Flow
                    "WaterLeaveT": None,  # tag: CT, EquipSeq1(?), Supply, Temperature
                    "WaterEnterT": None,  # tag: CT, EquipSeq1(?), Return, Temperature
                    "kWhCounter": None,  # tag: CT, EquipSeq1(?), Energy
                    "Freq": "Roof_CT2_VSDFreq"  # tag: CT, EquipSeq1(?), Frequent
                }, {
                    "EquipType": "Boiler",  # tag: Boiler, EquipSeq1(?)
                    "Equip": "Boiler1",  # tag: Boiler, EquipSeq1(?)
                    "Status": "L13_Boiler1_Status",  # tag: Boiler, EquipSeq1(?), Status
                    "LoadRatio": None,  # tag: Boiler, EquipSeq1(?), AmpRatio
                    "RatedPower": None,  # tag: Boiler, EquipSeq1(?),  Rated(?), Power
                    "PowerInput": None,  # tag: Boiler, EquipSeq1(?), Power
                    "WaterFlow": "L13_Boiler1_HWFlow",  # tag: Boiler, EquipSeq1(?), Flow
                    "WaterLeaveT": "L13_Boiler1_HWSupplyTemp",  # tag: Boiler, EquipSeq1(?), Supply, Temperature
                    "WaterEnterT": "L13_HW_FieldReturnTemp",  # tag: Boiler, EquipSeq1(?),  Return, Temperature
                    "kWhCounter": None,  # tag: Boiler, EquipSeq1(?), Energy
                    "Freq": None  # tag: Boiler, EquipSeq1(?), Frequent
                }, {
                    "EquipType": "Boiler",  # tag: Boiler, EquipSeq1(?)
                    "Equip": "Boiler2",  # tag: Boiler, EquipSeq1(?)
                    "Status": "L13_Boiler2_Status",  # tag: Boiler, EquipSeq1(?), Status
                    "LoadRatio": None,  # tag: Boiler, EquipSeq1(?), AmpRatio
                    "RatedPower": None,  # tag: Boiler, EquipSeq1(?),  Rated(?), Power
                    "PowerInput": None,  # tag: Boiler, EquipSeq1(?), Power
                    "WaterFlow": "L13_Boiler2_HWFlow",  # tag: Boiler, EquipSeq1(?), Flow
                    "WaterLeaveT": "L13_Boiler2_HWSupplyTemp",  # tag: Boiler, EquipSeq1(?), Supply, Temperature
                    "WaterEnterT": "L13_HW_FieldReturnTemp",  # tag: Boiler, EquipSeq1(?),  Return, Temperature
                    "kWhCounter": None,  # tag: Boiler, EquipSeq1(?), Energy
                    "Freq": None  # tag: Boiler, EquipSeq1(?), Frequent
                }, {
                    "EquipType": "HWP",  # tag: HWP(?)
                    "Equip": "HWP1",  # tag: HWP(?), EquipSeq1(?)
                    "Status": "L13_HWP1_Status",  # tag: HWP(?), EquipSeq1(?), Status
                    "LoadRatio": None,  # tag: HWP(?), EquipSeq1(?), AmpRatio
                    "RatedPower": "L13_HWP1_RatedPower",  # tag: HWP(?), EquipSeq1(?),  Rated(?), Power
                    "PowerInput": "L13_HWP1_VSDPower",  # tag: HWP(?), EquipSeq1(?), Power
                    "WaterFlow": None,  # tag: HWP(?), EquipSeq1(?), Flow
                    "WaterLeaveT": None,  # tag: HWP(?), EquipSeq1(?), Supply, Temperature
                    "WaterEnterT": None,  # tag: HWP(?), EquipSeq1(?), Return, Temperature
                    "kWhCounter": "Accum_HWP1_PumpEnergy",  # tag: HWP(?), EquipSeq1(?), Energy
                    "Freq": "L13_HWP1_VSDFreq"  # tag: HWP(?), EquipSeq1(?), Frequent
                }, {
                    "EquipType": "HWP",  # tag: HWP(?)
                    "Equip": "HWP2",  # tag: HWP(?), EquipSeq1(?)
                    "Status": "L13_HWP2_Status",  # tag: HWP(?), EquipSeq1(?), Status
                    "LoadRatio": None,  # tag: HWP(?), EquipSeq1(?), AmpRatio
                    "RatedPower": "L13_HWP2_RatedPower",  # tag: HWP(?), EquipSeq1(?),  Rated(?), Power
                    "PowerInput": "L13_HWP2_VSDPower",  # tag: HWP(?), EquipSeq1(?), Power
                    "WaterFlow": None,  # tag: HWP(?), EquipSeq1(?), Flow
                    "WaterLeaveT": None,  # tag: HWP(?), EquipSeq1(?), Supply, Temperature
                    "WaterEnterT": None,  # tag: HWP(?), EquipSeq1(?), Return, Temperature
                    "kWhCounter": "Accum_HWP2_PumpEnergy",  # tag: HWP(?), EquipSeq1(?), Energy
                    "Freq": "L13_HWP1_VSDFreq"  # tag: HWP(?), EquipSeq1(?), Frequent
                }]
            }
        except Exception as e:
            rt = False
        try:
            projID = array["proj"][0]["projID"]
            equip = array["Equipment"]
            strTab = "    "
            equipType = []  # 为做功率点进行设备类型分类 START
            for i in range(0, len(equip)):
                if equip[i]["EquipType"] not in equipType and equip[i]["EquipType"] != "Boiler":
                    equipType.append(equip[i]["EquipType"])
            equipCtnr = []
            for i in range(0, len(equipType)):
                tmp = []
                for j in range(0, len(equip)):
                    if equip[j]["EquipType"] == equipType[i]:
                        tmp.append(equip[j])
                equipCtnr.append(tmp)  # 为做功率点进行设备类型分类 END

            powerSuffix = "Power"
            energySuffix = "Energy"
            dailySuffix = "daily"
            weeklySuffix = "weekly"
            monthlySuffix = 'monthly'

            def power_points_creator(equipCtnr):
                pointsCtnr = []
                for i in range(0, len(equipCtnr)):
                    tmp = []
                    for j in range(0, len(equipCtnr[i])):
                        if equipCtnr[i][j]["EquipType"] == "Chiller":
                            equipStr = "Ch"
                        elif equipCtnr[i][j]["EquipType"] == "CT":
                            equipStr = "CT"
                        else:
                            equipStr = "Pump"
                        if equipCtnr[i][j]["PowerInput"] == None:  # 如果设备功率点不存在
                            if equipCtnr[i][j]["RatedPower"] != None:  # 如果额定功率点存在
                                if equipCtnr[i][j]["EquipType"] == "Chiller" and equipCtnr[i][j][
                                    "LoadRatio"] != None:  # loadRatio存在
                                    item = {
                                        "name": equipCtnr[i][j]["Equip"] + "_" + equipStr + "Power",
                                        "content": '''def main():\n''' + strTab + '''rs = get_data(\'''' + str(
                                            equipCtnr[i][j][
                                                "RatedPower"]) + '''\')*get_data(\'''' + str(equipCtnr[i][j][
                                                                                                 "LoadRatio"]) + '''\')*0.01\n''' + strTab + '''return round(rs,1)'''

                                    }
                                    tmp.append(item)
                                elif equipCtnr[i][j]["EquipType"] == "Chiller" and equipCtnr[i][j][
                                    "LoadRatio"] == None and \
                                                equipCtnr[i][j]["Status"] != None:  # chiller loadratio不存在，status存在
                                    item = {
                                        "name": equipCtnr[i][j]["Equip"] + "_" + equipStr + "Power",
                                        "content": '''def main():\n''' + strTab + '''rs = get_data(\'''' + str(
                                            equipCtnr[i][j][
                                                "Status"]) + '''\')*get_data(\'''' + str(equipCtnr[i][j][
                                                                                             "RatedPower"]) + '''\')\n''' + strTab + '''return round(rs,1)'''
                                    }
                                    tmp.append(item)
                                elif equipCtnr[i][j]["EquipType"] != "Chiller" and equipCtnr[i][j][
                                    "Freq"] != None:  # 其它设备，频率存在
                                    item = {
                                        "name": equipCtnr[i][j]["Equip"] + "_" + equipStr + "Power",
                                        "content": '''def main():\n''' + strTab + '''rs = get_data(\'''' + str(
                                            equipCtnr[i][j][
                                                "RatedPower"]) + '''\')*(get_data(\'''' + str(equipCtnr[i][j][
                                                                                                  "Freq"]) + '''\')/50)**2\n''' + strTab + '''return round(rs,1)'''
                                    }
                                    tmp.append(item)
                                elif equipCtnr[i][j]["EquipType"] != "Chiller" and equipCtnr[i][j]["Freq"] == None and \
                                                equipCtnr[i][j]["Status"] != None:  # 其它设备，频率不存在，status存在
                                    item = {
                                        "name": equipCtnr[i][j]["Equip"] + "_" + equipStr + "Power",
                                        "content": '''def main():\n''' + strTab + '''rs = get_data(\'''' + str(
                                            equipCtnr[i][j][
                                                "Status"]) + '''\')*get_data(\'''' + str(equipCtnr[i][j][
                                                                                             "RatedPower"]) + '''\')\n''' + strTab + '''return round(rs,1)'''
                                    }
                                    tmp.append(item)
                        else:  # 设备功率点存在
                            item = {
                                "name": equipCtnr[i][j]["Equip"] + "_" + equipStr + "Power",
                                "content": '''def main():\n''' + strTab + '''rs = get_data(\'''' + str(equipCtnr[i][j][
                                                                                                           "PowerInput"]) + '''\')\n''' + strTab + '''return round(rs,1)'''
                            }
                            tmp.append(item)
                    if len(tmp) > 0:
                        pointsCtnr.append(tmp)
                return pointsCtnr

            def group_points_creator(equipPrPts, suffix):
                ptsCtnr = []
                if len(equipPrPts) > 0:
                    for i in range(0, len(equipPrPts)):
                        points = []
                        for j in range(0, len(equipPrPts[i])):
                            points.append(equipPrPts[i][j]["name"])
                            if len(points) > 0:
                                if suffix == "Power":
                                    prefix = re.findall("[A-Z,a-z]+", points[0].split('_')[0])[0]
                                elif suffix == "Energy":
                                    prefix = "Accum_" + re.findall("[A-Z,a-z]+", points[0].split('_')[1])[0]
                        if len(points) > 0:
                            item = {
                                "name": prefix + "Group_Group" + suffix,
                                "content": '''def main():\n''' + strTab + '''rs = calc_sum_in_points(''' + str(
                                    points) + ''')\n''' + strTab + '''return round(rs,1)'''
                            }
                        ptsCtnr.append(item)
                return ptsCtnr

            def energy_points_creator(powerArray, equipArray):
                ptsCtnr = []
                for i in range(0, len(powerArray)):
                    if len(powerArray) > 0:
                        tmp = []
                        for j in range(0, len(powerArray[i])):
                            if len(powerArray[i][j]) > 0:
                                equip = powerArray[i][j]["name"].split('_')[0]
                                equipType = re.findall("[A-Z,a-z]+", powerArray[i][j]["name"].split('_')[0])[0]
                                if equipType == "Chiller":
                                    equipStr = "Ch"
                                elif equipType == "CT":
                                    equipStr = "CT"
                                else:
                                    equipStr = "Pump"
                                pointNameStr = "Accum_" + equip + "_" + equipStr + "Energy"
                                timeStr = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                                for n in range(0, len(equipArray)):
                                    if equipArray[n]["Equip"] == equip:
                                        equipNeed = equipArray[n]
                                        if equipNeed["kWhCounter"] == None:
                                            contentStr = '''def main():\n''' + strTab + '''rs = calc_accumulate(\'''' + str(
                                                pointNameStr) + '''\',\'''' + \
                                                         str(powerArray[i][j][
                                                                 "name"]) + '''\',''' + '''\'''' + timeStr + '''\'''' + ''','m5',''' + str( \
                                                1 / 12.0) + ''')\n''' + strTab + '''return round(rs,1)'''
                                        else:
                                            contentStr = '''def main():\n''' + strTab + '''rs = get_data(\'''' + str(
                                                equipNeed[ \
                                                    "kWhCounter"]) + '''\')\n''' + strTab + '''return round(rs,1)'''
                                        item = {
                                            "name": pointNameStr,
                                            "content": contentStr
                                        }
                                        tmp.append(item)
                    ptsCtnr.append(tmp)
                return ptsCtnr

            def group_usage_points_creator(grpEgyArray, suffix):
                ptsCtnr = []
                if len(grpEgyArray) > 0:
                    for i in range(0, len(grpEgyArray)):
                        item = {
                            "name": grpEgyArray[i]['name'] + suffix[:1].upper(),
                            "content": '''def main():\n''' + strTab + '''rs = calc_''' + suffix + '''_delta_of_accum(\'''' + \
                                       str(grpEgyArray[i]["name"]) + '''\')\n''' + strTab + '''return round(rs,1)'''
                        }
                        ptsCtnr.append(item)
                return ptsCtnr

            def equip_usage_points_creator(equipEgyArray, suffix):
                ptsCtnr = []
                if len(equipEgyArray) > 0:
                    for i in range(0, len(equipEgyArray)):
                        if len(equipEgyArray[i]) > 0:
                            tmp = []
                            for j in range(0, len(equipEgyArray[i])):
                                item = {
                                    "name": equipEgyArray[i][j]["name"] + suffix[:1].upper(),
                                    "content": '''def main():\n''' + strTab + '''rs = calc_''' + suffix + '''_delta_of_accum(\'''' + \
                                               str(equipEgyArray[i][j][
                                                       "name"]) + '''\')\n''' + strTab + '''return round(rs,1)'''
                                }
                                tmp.append(item)
                            ptsCtnr.append(tmp)
                return ptsCtnr

            def ave_temp_points_creator(array, tempStr, direction, equipStr):
                ptsCtnr = []
                tempCtnr = []
                statusCtnr = []
                if array["main"][0][tempStr] == None:
                    if len(array["Equipment"]) > 0:
                        for i in range(0, len(array["Equipment"])):
                            if array["Equipment"][i]["EquipType"] == equipStr and array["Equipment"][i][
                                direction] != None and array["Equipment"][i]["Status"] != None:
                                tempCtnr.append(array["Equipment"][i][direction])
                                statusCtnr.append(array["Equipment"][i]["Status"])
                        if len(tempCtnr) > 0:
                            content = '''def main():\n''' + strTab + '''status=''' + str(
                                statusCtnr) + '''\n''' + strTab + '''temp=''' + str(
                                tempCtnr) + '''\n''' + strTab + '''numOn=0\n''' + strTab + '''tempSum=0\n''' + strTab + '''for i in range(0, len(temp)):\n''' + 2 * strTab + '''if get_data(status[i])>0:\n''' + 3 * strTab + '''tempSum=tempSum+get_data(temp[i])\n''' + 3 * strTab + '''numOn=numOn+1\n''' + strTab + '''if numOn>0:\n''' + 2 * strTab + '''aveTemp=tempSum/numOn\n''' + strTab + '''else:\n''' + 2 * strTab + '''for i in range(0, len(temp)):\n''' + 3 * strTab + '''tempSum=tempSum+get_data(temp[i])\n''' + 2 * strTab + '''aveTemp=tempSum/len(temp)\n''' + strTab + '''return round(aveTemp,1)'''
                            item = {
                                "name": "main_" + tempStr,
                                "content": content
                            }
                            ptsCtnr.append(item)
                else:
                    content = '''def main():\n''' + strTab + '''rs = get_data(\'''' + str(array["main"][0][
                                                                                              tempStr]) + '''\')\n''' + strTab + '''return round(rs,1)'''
                    item = {
                        "name": "main_" + tempStr,
                        "content": content
                    }
                    ptsCtnr.append(item)
                return ptsCtnr

            def sum_flow_points_creator(array, flowStr, equipStr):
                ptsCtnr = []
                flowCtnr = []
                statusCtnr = []
                if array["main"][0][flowStr] == None:
                    if len(array["Equipment"]) > 0:
                        for i in range(0, len(array["Equipment"])):
                            if array["Equipment"][i]["EquipType"] == equipStr and array["Equipment"][i][
                                "WaterFlow"] != None and array["Equipment"][i]["Status"] != None:
                                flowCtnr.append(array["Equipment"][i]["WaterFlow"])
                                statusCtnr.append(array["Equipment"][i]["Status"])
                        if len(flowCtnr) > 0:
                            item = {
                                "name": "main_" + flowStr,
                                "content": '''def main():\n''' + strTab + '''flow=''' + str(
                                    flowCtnr) + '''\n''' + strTab + '''status=''' + str(
                                    statusCtnr) + '''\n''' + strTab + '''totFlow=0\n''' + strTab + '''for i in range(0,len(flow)):\n''' + 2 * strTab + '''if get_data(status[i])>0:\n''' + 3 * strTab + '''totFlow=totFlow+get_data(flow[i])\n''' + strTab + '''return round(totFlow,1)'''
                            }
                            ptsCtnr.append(item)
                else:
                    item = {
                        "name": "main_" + flowStr,
                        "content": '''def main():\n''' + strTab + '''rs = get_data(\'''' + str(array["main"][0][
                                                                                                   flowStr]) + '''\')\n''' + strTab + '''return round(rs,1)'''
                    }
                    ptsCtnr.append(item)
                return ptsCtnr

            def load_points_creator(leaveT, enterT, flow, flowStr):
                ptsCtnr = []
                if len(leaveT) > 0 and len(enterT) > 0 and len(flow) > 0:
                    item = {
                        "name": flowStr[:-4] + "Plant_Load",
                        "content": '''def main():\n''' + strTab + '''deltaT=abs(get_data(\'''' + str(leaveT[0][
                                                                                                         "name"]) + '''\')-get_data(\'''' + str(
                            enterT[0]["name"]) + '''\'))\n''' + strTab + '''rs=4.2*get_data(\'''' + \
                                   str(flow[0]["name"]) + '''\')*deltaT\n''' + strTab + '''return round(rs,1)'''
                    }
                    ptsCtnr.append(item)
                return ptsCtnr

            def runnum_points_creator(equip):
                equipType = []
                equipCtnr = []
                ptsCtnr = []
                if len(equip) > 0:
                    for i in range(0, len(equip)):
                        if equip[i]["EquipType"] not in equipType:
                            equipType.append(equip[i]["EquipType"])
                    for i in range(0, len(equipType)):
                        tmp = []
                        for j in range(0, len(equip)):
                            if equip[j]["EquipType"] == equipType[i] and equip[j]["Status"] != None:
                                tmp.append(equip[j])
                        if len(tmp) > 0:
                            equipCtnr.append(tmp)
                    if len(equipCtnr) > 0:
                        for i in range(0, len(equipCtnr)):
                            statusCtnr = []
                            for j in range(0, len(equipCtnr[i])):
                                statusCtnr.append(equipCtnr[i][j]["Status"])
                            item = {
                                "name": equipCtnr[i][0]["EquipType"] + "Group_RunNum",
                                "content": '''def main():\n''' + strTab + '''rs = calc_sum_in_points(''' + str( \
                                    statusCtnr) + ''')\n''' + strTab + '''return rs'''
                            }
                            ptsCtnr.append(item)
                return ptsCtnr

            def chwplant_group_power_point_creator(grpPrPts):
                ptsCtnr = []
                tmp = []
                if len(grpPrPts) > 0:
                    for i in range(0, len(grpPrPts)):
                        if grpPrPts[i]['name'].split('_')[0][:3] != 'HWP':
                            tmp.append(grpPrPts[i]['name'])
                    if len(tmp) > 0:
                        item = {
                            "name": "CHWPlant_GroupPower",
                            "content": '''def main():\n''' + strTab + '''rs = calc_sum_in_points(''' + str( \
                                tmp) + ''')\n''' + strTab + '''return(rs,1)'''
                        }
                        ptsCtnr.append(item)
                return ptsCtnr

            def chiller_group_power_point_creator(grpPrPts):
                ptsCtnr = []
                if len(grpPrPts) > 0:
                    for i in range(0, len(grpPrPts)):
                        if grpPrPts[i]["name"][:7] == "Chiller":
                            ptsCtnr.append(grpPrPts[i])
                return ptsCtnr

            def cop_points_creator(load, power):
                ptsCtnr = []
                if len(load) > 0 and len(power) > 0:
                    item = {
                        "name": power[0]["name"].split('_')[0] + "_COP",
                        "content": '''def main():\n''' + strTab + '''load=get_data(\'''' + str(load[0][ \
                                                                                                   "name"]) + '''\')\n''' + strTab + '''power=get_data(\'''' + str(
                            power[0][ \
                                "name"]) + '''\')\n''' + strTab + '''if power>0:\n''' + 2 * strTab + '''COP=load/power\n''' + strTab + '''else:\n''' + 2 * strTab + '''COP=0\n''' + strTab + '''return round(COP,1)'''
                    }
                    ptsCtnr.append(item)
                return ptsCtnr

            def points_gather(ptsGrp):
                result = []
                for i in range(0, len(ptsGrp)):
                    if len(ptsGrp[i]) > 0:
                        if isinstance(ptsGrp[i][0], dict):
                            call = 1
                            for j in range(0, len(ptsGrp[i])):
                                result.append(ptsGrp[i][j])
                        elif isinstance(ptsGrp[i][0][0], dict):
                            for j in range(0, len(ptsGrp[i])):
                                for k in range(0, len(ptsGrp[i][j])):
                                    result.append(ptsGrp[i][j][k])
                return result

            CHWSupplyTempStr = "CHWSupplyT"
            CHWReturnTempStr = "CHWReturnT"
            WaterSupplyDire = "WaterLeaveT"
            WaterReturnDire = "WaterEnterT"
            HWSupplyTempStr = "HWSupplyT"
            HWReturnTempStr = "HWReturnT"
            ChillerStr = "Chiller"
            BoilerStr = "Boiler"
            CHWFlowStr = "CHWFlow"
            HWFlowStr = "HWFlow"

            equipPowerPoints = power_points_creator(equipCtnr)  # 设备功率（equipPower）  [[{},{}],[{},{}],[{},{}]]
            groupPowerPoints = group_points_creator(equipPowerPoints, powerSuffix)  # 设备组功率（GroupPower）  [{},{}]
            equipEnergyPoints = energy_points_creator(equipPowerPoints,
                                                      equip)  # 设备能耗累积量（EquipEnergy）  [[{},{}],[{},{}],[{},{}]]
            groupEnergyPoints = group_points_creator(equipEnergyPoints, energySuffix)  # 设备组能耗累积量（GroupEnergy）   [{},{}]

            dailyEquipEnergyPoints = equip_usage_points_creator(equipEnergyPoints,
                                                                dailySuffix)  # 设备日用电量 （DailyEquipEnergy）  [[{},{}],[{},{}],[{},{}]]
            weeklyEquipEnergyPoints = equip_usage_points_creator(equipEnergyPoints,
                                                                 weeklySuffix)  # 设备周用电量 （WeeklyEquipEnergy）  [[{},{}],[{},{}],[{},{}]]
            monthlyEquipEnergyPoints = equip_usage_points_creator(equipEnergyPoints,
                                                                  monthlySuffix)  # 设备月用电量 （MonthlyEquipEnergy） [[{},{}],[{},{}],[{},{}]]

            dailyGroupEnergyPoints = group_usage_points_creator(groupEnergyPoints,
                                                                dailySuffix)  # 设备组日用电量（dailyGroupEnergy）   [{},{}]
            weeklyGroupEnergyPoints = group_usage_points_creator(groupEnergyPoints,
                                                                 weeklySuffix)  # 设备组周用电量 （WeeklyGroupEnergy）  [{},{}]
            monthlyGroupEnergyPoints = group_usage_points_creator(groupEnergyPoints,
                                                                  monthlySuffix)  # 设备组月用电量 （MonthlyGroupEnergy）  [{},{}]

            CHWPlantGrpPrPoints = chwplant_group_power_point_creator(groupPowerPoints)  # 制冷设备组总功率  [{}]
            ChillerPrPoints = chiller_group_power_point_creator(groupPowerPoints)  # 冷机组总功率 [{}]

            MainCHWSupplyTempPoint = ave_temp_points_creator(array, CHWSupplyTempStr, WaterSupplyDire,
                                                             ChillerStr)  # 总管冷冻水供水温度 （SysCHWSupplyT）   [{}]
            MainCHWReturnTempPoint = ave_temp_points_creator(array, CHWReturnTempStr, WaterReturnDire,
                                                             ChillerStr)  # 总管冷冻水回水温度  （SysCHWReturnT）   [{}]
            MainHWSupplyTempPoint = ave_temp_points_creator(array, HWSupplyTempStr, WaterSupplyDire,
                                                            BoilerStr)  # 总管热水供水温度  （SySHWSupplyT）  [{}]
            MainHWReturnTempPoint = ave_temp_points_creator(array, HWReturnTempStr, WaterReturnDire,
                                                            BoilerStr)  # 总管热水回水温度  （SysHWReturnT）  [{}]
            MainCHWFlowPoint = sum_flow_points_creator(array, CHWFlowStr, ChillerStr)  # 总管冷冻水流量 （SysCHWFlow） [{}]
            MainHWFlowPoint = sum_flow_points_creator(array, HWFlowStr, BoilerStr)  # 总管热水流量 （SysHWFlow）  [{}]

            CoolingLoadPoint = load_points_creator(MainCHWSupplyTempPoint, MainCHWReturnTempPoint, MainCHWFlowPoint,
                                                   CHWFlowStr)  # 冷负荷     [{}]
            HeatingLoadPoint = load_points_creator(MainHWSupplyTempPoint, MainHWReturnTempPoint, MainHWFlowPoint,
                                                   HWFlowStr)  # 热负荷    [{}]

            RunNumPoints = runnum_points_creator(equip)  # 设备运行数量  [{},{}]

            CHWPlantCOP = cop_points_creator(CoolingLoadPoint, CHWPlantGrpPrPoints)  # 冷冻水系统COP  [{}]
            ChillerCOP = cop_points_creator(CoolingLoadPoint, ChillerPrPoints)  # 冷机COP  [{}]

            ptsGrpRdy = [equipPowerPoints, groupPowerPoints, equipEnergyPoints, groupEnergyPoints,
                         dailyEquipEnergyPoints,
                         weeklyEquipEnergyPoints, monthlyEquipEnergyPoints, dailyGroupEnergyPoints,
                         weeklyGroupEnergyPoints,
                         monthlyGroupEnergyPoints, CHWPlantGrpPrPoints, ChillerPrPoints, MainCHWSupplyTempPoint,
                         MainCHWReturnTempPoint, MainHWSupplyTempPoint, MainHWReturnTempPoint, MainCHWFlowPoint,
                         MainHWFlowPoint, CoolingLoadPoint, HeatingLoadPoint, RunNumPoints, CHWPlantCOP, ChillerCOP]
            paramList = points_gather(ptsGrpRdy)
        except Exception as e:
            rt = False
        try:
            mongo_operator.generate_calcpoint(projID, paramList)
        except Exception as e:
            rt = False
        return rt

    def statistics_equipment_intact_rate_pandect(self, projId, lang='zh-CN'):
        '''
        David 20170831
        '''
        rt = {'status': 1, 'message': None, 'data': []}
        try:
            dbAccess = BEOPDataAccess.getInstance()
            dbname = dbAccess.getProjMysqldb(projId)
            lang = self.select_the_language(lang)
            sensor = 'Sensor' if lang == 'en-US' else '传感器'
            if projId in [421, 175]:
                sensor = 'Sensor'
            if projId in [72] and lang != 'en-US':
                sensor = '传感器和执行器'
            if dbname:
                nowTime = self._actTime
                startTime = (nowTime - timedelta(hours=24)).strftime('%Y-%m-%d %H:%M:%S')
                endTime = nowTime.strftime('%Y-%m-%d %H:' + self.get_dateTime_now_accurate_to_5m() + ':00')
                system_dict, equipmentId_systemId = self.get_equipment_all(projId, dbname)
                if system_dict:
                    strSQL = 'SELECT n.Id, f.EquipmentId, MAX(f.FaultType) as st, ' \
                             'MAX(CASE f.FaultType WHEN 2 THEN 0 ELSE f.FaultType END) AS et, ' \
                             'e.`Name` FROM %s_diagnosis_faults AS f ' \
                             'LEFT JOIN %s_diagnosis_notices AS n ON n.FaultId = f.Id ' \
                             'LEFT JOIN %s_diagnosis_equipments AS e ON f.EquipmentId = e.Id ' \
                             'WHERE n.Time <= "%s" AND n.Time >= "%s" ' \
                             'GROUP BY e.`Name`, f.`Name`' % (dbname, dbname, dbname, endTime, startTime)
                    dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
                    if dbrv:
                        sensor_dict = {}
                        for item in dbrv:
                            if int(item[2]) == 2:
                                if sensor not in sensor_dict.keys():
                                    n = self.get_realpoint_count(dbname)
                                    sensor_dict.update({sensor: {'AbnormalNum': 0, 'SubSystemName': sensor,
                                                                 'Equipments': [1] * n}})
                                sensor_dict.get(sensor).update(
                                    {'AbnormalNum': sensor_dict.get(sensor).get('AbnormalNum') + 1})
                            if float(item[3]) <= 1 and float(item[3]) > 0:
                                subSysName = equipmentId_systemId.get(item[4])
                                if subSysName is not None:
                                    system_dict.get(subSysName).update({'AbnormalNum': system_dict.get(subSysName).get(
                                        'AbnormalNum') + float(item[3])})
                                    Equipment_faultType = system_dict.get(subSysName).get('Equipment_faultType')
                                    if item[4] in Equipment_faultType.keys():
                                        if float(item[3]) > Equipment_faultType.get(item[4]):
                                            Equipment_faultType.update({item[4]: float(item[3])})
                                    else:
                                        Equipment_faultType.update({item[4]: float(item[3])})
                        system_dict.update(sensor_dict)
                        l = list(system_dict.keys())
                        l.sort()
                        for keys in l:
                            sys = system_dict.get(keys)
                            Equipment_faultType = sys.get('Equipment_faultType')
                            totalNum = len(sys.get('Equipments'))
                            if keys == sensor:
                                goodNum = len(sys.get('Equipments')) - sys.get('AbnormalNum')
                            else:
                                goodNum = len(sys.get('Equipments')) - sum(
                                    [Equipment_faultType.get(x) for x in Equipment_faultType.keys()])
                            rt.get('data').append({'SubSystemName': sys.get('SubSystemName'),
                                                   'IntactRate': self.computing_intact_rate(goodNum, totalNum),
                                                   'GoodNum': goodNum, 'TotalNum': totalNum})
                    else:
                        l = list(system_dict.keys())
                        l.sort()
                        for keys in l:
                            sys = system_dict.get(keys)
                            Equipment_faultType = sys.get('Equipment_faultType')
                            totalNum = len(sys.get('Equipments'))
                            goodNum = totalNum
                            rt.get('data').append({'SubSystemName': sys.get('SubSystemName'),
                                                   'IntactRate': self.computing_intact_rate(goodNum, totalNum),
                                                   'GoodNum': goodNum, 'TotalNum': totalNum})
                else:
                    rt.update({'status': 0, 'message': 'The project no diagnostic information'})
            else:
                rt.update({'status': 0, 'message': 'Invalid parameter'})
        except Exception as e:
            self.writeFileLog(projId, '%s:' % get_current_func_name() + e.__str__())
        return rt

    def get_equipment_all(self, projId, mysqlName):
        '''
        David 20161130
        '''
        system_dict = {}
        equipmentId_systemId = {}
        try:
            dbAccess = BEOPDataAccess.getInstance()
            strSQL = 'SELECT Id, `Name`, SystemId, SystemName, SubSystemName, LocationInfo ' \
                     'FROM %s_diagnosis_equipments ' \
                     'WHERE SubSystemName IS NOT NULL AND SubSystemName <> "传感器" ' \
                     'AND SubSystemName <> "Sensor" ' \
                     'GROUP BY `Name`' % mysqlName
            dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
            if dbrv:
                for item in dbrv:
                    subSystemName = item[4]
                    equipmentName = item[1]
                    equipmentId_systemId.update({equipmentName: subSystemName})
                    if subSystemName in system_dict.keys():
                        if item[5] in system_dict.get(subSystemName).get('Subitem').keys() and item[5]:
                            num = system_dict.get(subSystemName).get('Subitem').get(item[5]).get('TotalNum')
                            system_dict.get(subSystemName).get('Subitem').get(item[5]).update({'TotalNum': num + 1})
                        elif item[5]:
                            system_dict.get(subSystemName).get('Subitem').update({item[5]: {'TotalNum': 1,
                                                                                            'LocationInfo': item[5],
                                                                                            'Detail': []}})
                        system_dict.get(subSystemName).get('Equipments').append({'EquipmentId': item[0],
                                                                                 'EquipmentName': item[1],
                                                                                 'LocationInfo': item[5]})
                    else:
                        system_dict.update({subSystemName: {'SystemId': item[2], 'SystemName': item[3], 'Detail': [],
                                                            'AbnormalNum': 0, 'SubSystemName': subSystemName,
                                                            'Subitem': {item[5]: {'LocationInfo': item[5],
                                                                                  'Detail': [],
                                                                                  'TotalNum': 1}} if item[5] else {},
                                                            'Equipment_faultType': {}, 'LocationInfo_EquipmentName': {},
                                                            'Equipments': [{'EquipmentId': item[0],
                                                                            'EquipmentName': item[1],
                                                                            'LocationInfo': item[5]}]}})
        except Exception as e:
            self.writeFileLog(projId, '%s:' % get_current_func_name() + e.__str__())
        return system_dict, equipmentId_systemId

    def computing_intact_rate(self, goodNum, totalNum):
        if totalNum:
            return '%0.2f' % ((goodNum / totalNum) * 100,) + '%'
        else:
            return '0.00%'

    def get_realpoint_count(self, mysqlname):
        rt = 0
        dbAccess = BEOPDataAccess.getInstance()
        strSQL = 'SELECT COUNT(*) FROM rtdata_%s where flag = 0' % mysqlname
        dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query_one(app.config['DATABASE'], strSQL, ())
        if dbrv:
            rt = int(dbrv[0])
        return rt

    def select_the_language(self, lang):
        rt = 'zh-CN'
        if isinstance(lang, str):
            if 'zh' in lang.lower() or 'CN' in lang.upper() or 'CH' in lang.upper():
                rt = 'zh-CN'
            elif 'en' in lang.lower() or 'US' in lang.upper():
                rt = 'en-US'
        return rt

    def get_dateTime_now_accurate_to_5m(self):
        datetime_now = self._actTime
        min_now = datetime_now.minute
        min_format = str(min_now // 5 * 5)
        if len(min_format) == 1:
            min_format = '0' + min_format
        return min_format

    def get_energy_all_by_time_v2(self, projId, startTime, endTime):
        '''
        David 20170919
        统计给定时间段内 故障总条数 、能耗浪费(新版诊断)
        '''
        return BEOPDataAccess.getInstance().get_energy_all_by_time_v2(projId, startTime, endTime)

    def get_energy_by_systemName_v2(self, projId, startTime, endTime):
        '''
        David 20170920
        统计给定时间段内 按systemname统计的故障条数、能耗浪费(新版诊断)
        '''
        return BEOPDataAccess.getInstance().get_energy_by_systemName_v2(projId, startTime, endTime)

    def get_response_time_avg_v2(self, projId, startTime, endTime):
        '''
        David 20170920
        工单平均响应时间（新版诊断）
        '''
        return BEOPDataAccess.getInstance().get_response_time_avg_v2(projId, startTime, endTime)

    def get_energylist_by_faultName_order_by_energy_v2(self, projId, startTime, endTime, lang='zh'):
        '''
        David 20170920
        按节能量降序排列的能耗浪费信息(新版诊断)
        '''
        return BEOPDataAccess.getInstance().get_energylist_by_faultName_order_by_energy_v2(projId, startTime, endTime, lang)

    def get_finished_order_num_v2(self, projId, startTime, endTime):
        '''
        David 20170920
        完成工单的条数(新版诊断)
        '''
        orderId_list = BEOPDataAccess.getInstance().get_finished_orderId_v2(projId, startTime, endTime)
        orderstatue_list = MongoConnManager.getConfigConn().get_work_order_state(orderId_list)
        rt = 0
        for item in orderstatue_list:
            if int(item.get('status')) == 2:
                rt += 1
        return rt

    def get_new_order_num_v2(self, projId, startTime, endTime):
        '''
        David 20170920
        新增工单总条数（新版诊断）
        '''
        return BEOPDataAccess.getInstance().get_new_order_num_v2(projId, startTime, endTime)

    def statistics_equipment_intact_rate_pandect_v2(self, projId, start_time=None, end_time=None, entity_ids=[],
                                                    class_names=[], fault_ids=[]):
        '''
        David 20170922
        '''
        nowTime = self._actTime
        if end_time is None:
            end_time = nowTime.strftime('%Y-%m-%d %H:' + self.get_dateTime_now_accurate_to_5m() + ':00')
        if start_time is None:
            start_time = (nowTime - timedelta(hours=24)).strftime('%Y-%m-%d %H:%M:%S')
        return DiagnosisService.statistics_equipment_intact_rate_pandect_v2(projId, start_time, end_time, entity_ids,
                                                                            class_names, fault_ids)

    def invoke_web_service(self, url, method, params):
        '''
        David 20171016
        '''
        error = None
        try:
            rt = HttpTestTool.invoke_web_service(url, method, params)
        except Exception as e:
            error = e.__str__()
        if error:
            return {'status': 0, 'data': None, 'message': error}
        else:
            return {'status': 1, 'data': rt, 'message': None}

    def get_web_service_info(self, url):
        '''
        David 20171016
        '''
        error = None
        try:
            rt = HttpTestTool.get_web_service_info(url)
        except Exception as e:
            error = e.__str__()
        if error:
            return {'status': 0, 'data': None, 'message': error}
        else:
            return {'status': 1, 'data': rt, 'message': None}

    def ack_recent_message(self, mqName):
        return MQManager.ackRecentMessage(mqName)

    def delete_one_record(self, projId, pointname, strTime):
        rt = True
        try:
            collectionname = BEOPDataAccess.getInstance().getCollectionNameById(projId)
            if collectionname:
                conMongodb = MongoConnManager.getHisConnTuple(projId)
                if conMongodb:
                    pointTime = datetime.strptime(strTime, '%Y-%m-%d %H:%M:%S')
                    for conn in conMongodb:
                        st = conn[1]
                        et = conn[2]
                        if pointTime <= et and pointTime >= st:
                            conn[0].deleteFromMongoHistory(projId, collectionname, pointname, strTime)
                            break
            else:
                raise Exception("collectionname is not exist.")
        except Exception as e:
            print(e)
            rt = False
        return rt

    def delete_points_from_buffer_data(self, projId, pointList):
        return BEOPDataAccess.getInstance().deletePointFromBufferData(projId, pointList)

