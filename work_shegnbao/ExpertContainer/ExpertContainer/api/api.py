# -*- encoding=utf-8 -*-
import json
import random
import time
import base64
from builtins import staticmethod
from math import ceil, floor

import pymongo
import requests
from bson import ObjectId
from selenium import webdriver

from ExpertContainer import app
from ExpertContainer.api.errorLog import errorLog
from ExpertContainer.api.utils import *
from ExpertContainer.dbAccess import mongo_operator
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from ExpertContainer.dbAccess.BEOPDataBufferManager import BEOPDataBufferManager
from ExpertContainer.dbAccess.ConfigMongoDBAccess import ConfigMongoDBAccess
from ExpertContainer.dbAccess.MongoConnManager import MongoConnManager
from ExpertContainer.dbAccess.RedisManager import RedisManager
from copy import deepcopy

__author__ = 'yan'


class DiagnosisEnum:
    ENABLE = 'enable'
    EQUIPMENT = 'equipments'
    FAULT = 'faults'
    LIMIT = 'limit'
    NOTICE = 'notices'
    ORDER = 'order'
    ZONE = 'zones'


def getweatherinfo(projId):
    rt = None
    try:
        memkey = 'weatherinfo' + str(projId)
        update_permit = RedisManager.get_weather_updatetime(projId)
        if update_permit is not None or isinstance(update_permit, int) or isinstance(update_permit, float):
            if time.time() - update_permit <= 60 * 60 * 2:
                rt = RedisManager.get_weather_info(projId)
        else:
            RedisManager.set_weather_updatetime(projId, 0)
    except Exception as e:
        errorLog.writeLog(projId, '%s:' % (get_current_func_name()) + e.__str__(), True)
    return rt


def updateweatherinfo(projId, info):
    rt = False
    try:
        if RedisManager.set_weather_info(projId, info):
            RedisManager.set_weather_updatetime(projId, time.time())
            rt = True
    except Exception as e:
        errorLog.writeLog(projId, '%s:' % (get_current_func_name()) + e.__str__(), True)
    return rt


def get_weather_info_by_cityname(city):
    rt = None
    try:
        update_permit = RedisManager.get_weather_updatetime(city)
        if update_permit is not None or isinstance(update_permit, int) or isinstance(update_permit, float):
            if time.time() - update_permit <= 60 * 60 * 0.5:
                rt = RedisManager.get_weather_info(city)
        else:
            RedisManager.set_weather_updatetime(city, 0)
    except Exception as e:
        pass
    return rt


def get_weather_info_by_cityid(city):
    rt = None
    try:
        update_permit = RedisManager.get_weather_updatetime_by_cityid(city)
        if update_permit is not None or isinstance(update_permit, int) or isinstance(update_permit, float):
            if time.time() - update_permit <= 60 * 60 * 1:
                rt = RedisManager.get_weather_info_by_cityid(city)
        else:
            RedisManager.set_weather_updatetime_by_cityid(city, 0)
    except Exception as e:
        pass
    return rt


def update_weather_info_by_cityname(city, info):
    rt = False
    try:
        if RedisManager.set_weather_info(city, info):
            RedisManager.set_weather_updatetime(city, time.time())
            rt = True
    except Exception as e:
        pass
    return rt


def update_weather_info_by_cityid(city, info):
    rt = False
    try:
        if RedisManager.set_weather_info_by_cityid(city, info):
            RedisManager.set_weather_updatetime_by_cityid(city, time.time())
            rt = True
    except Exception as e:
        pass
    return rt


def get_weather(cityname, i=0):
    rt = {}
    apiKey_list = ['f407c9e0c18eeedb380fe3f090b8da24', 'f9c373eebf65ee1ea7a6608ec9bcbe43']
    apiKey = apiKey_list[int(random.randint(0, 99)) % 2]
    url = 'https://way.jd.com/he/freeweather?city=%s&appkey=%s' % (cityname, apiKey)
    rv = get_weather_info_by_cityname(cityname)
    if rv is None or len(rv) == 0:
        res = requests.get(url)
        if res.status_code == 200:
            html = json.loads(res.text)
            if html.get('code') == '10000':
                res = html.get('result')
                if res.get('HeWeather5')[0].get('status') == 'ok':
                    rt.update(res.get('HeWeather5')[0])
                update_weather_info_by_cityname(cityname, rt)
            else:
                if html.get('code') in ['10040', '10001'] and i <= 5:
                    rt = get_weather(cityname, i=i + 1)
                else:
                    raise Exception(html.get('msg'))
        else:
            raise Exception('The weather service is not available')
    else:
        rt = rv
    return rt


class ToolsMethods:
    _logger = LogOperator()

    @staticmethod
    def get_svr_project_list():
        rt = []
        try:
            r = requests.get('http://%s/getSaveSvrProjIdList' % (app.config['BEOP_SERVER_ADDR'],))
            if r.status_code == 200:
                ret = json.loads(r.text)
                if ret:
                    rt = [x.get('id') for x in ret]
            else:
                ToolsMethods._logger.writeLog(
                    '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            ToolsMethods._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def get_last_update_time():
        rt = {}
        try:
            r = requests.get('http://%s/get_last_update_time' % (app.config['BEOP_SERVER_ADDR'],))
            if r.status_code == 200:
                rt = json.loads(r.text)
                if rt:
                    projList = mongo_operator.get_distinct_projects()
                    rt = {
                    int(id): datetime.strptime(rt[str(id)], standard_time_format) if str(id) in rt else datetime.now()
                    for id in projList}
            else:
                ToolsMethods._logger.writeLog(
                    '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            ToolsMethods._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def weather_get_by_id(projId):
        rv = {}
        try:
            latlng = BEOPDataAccess.getInstance().getLatlngOfPriject(projId)
            url_get_cityname = 'http://api.map.baidu.com/geocoder/v2/?ak=VNzhKjCMIdfr8FrHP4ys2jha&coordtype=gcj02ll&location=%s&output=json&pois=0' % latlng
            res = requests.get(url_get_cityname, timeout=30)
            html = res.text
            map = json.loads(html)
            if map.get('status') == 0:
                city = map.get('result').get('addressComponent').get('city')
            else:
                city = '上海'
            if '市' in city:
                cityname = city[:-1]
            elif '特别行政区' in city:
                cityname = city[:-5]
            else:
                cityname = city
            if cityname == '':
                rv = dict(error=1, msg='no city name found.')
            if cityname:
                rv = get_weather(cityname).get('now')
        except Exception as e:
            errorLog.writeLog(projId, '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rv

    @staticmethod
    def weather_get_by_cityname(cityname):
        rt = {}
        try:
            rt = get_weather(cityname).get('now')
        except Exception as e:
            pass
        return rt

    @staticmethod
    def weather_get_from_weather_com(strCityAddress):
        '''
        woody add 2016/12/15
        :param : strCityAddress
        :return: dict
        '''
        infoCache = get_weather_info_by_cityid(strCityAddress)
        if infoCache is not None:
            return infoCache

        rv = {}
        weatherUrl = 'https://weather.com/zh-CN/weather/today/l/' + strCityAddress
        driver = None
        try:
            driver = webdriver.PhantomJS()
            driver.set_page_load_timeout(60)
            driver.set_script_timeout(60)
            driver.get(weatherUrl)
            time.sleep(2)
            temp = driver.find_elements_by_css_selector('.today_nowcard-temp')
            if not temp:
                return {'error': 1, 'msg': 'wrong strCityAddress'}
            location = driver.find_element_by_css_selector('.h4.today_nowcard-location').text
            cityName = location.split(',')[0]
            countryName = location.split(',')[1]
            updateTime = driver.find_element_by_css_selector('.wx-dsxdate').text
            temp = driver.find_element_by_css_selector('.today_nowcard-temp .dir-ltr').text
            amount = driver.find_element_by_css_selector('.today_nowcard-temp .deg.dir-ltr').text
            temperature = temp + amount
            status = driver.find_element_by_css_selector('.today_nowcard-phrase').text
            wet = driver.find_element_by_css_selector('span[data-gm-wx-percentage="::todayWxcardVm.obs.humidity"]').text
            wInfo = dict(tmp=temperature, weather=status, updateTime=updateTime, country=countryName, city=cityName,
                         hum=wet)
            rv.update(wInfo)
            rv.update({'error': 0})
            update_weather_info_by_cityid(strCityAddress, wInfo)
        except Exception as e:
            rv = {'error': 1, 'msg': 'Maybe css elements have been changed! Please contact with Woody.'}
            logging.error('weather_get_from_weather_com error:' + e.__str__())
            # raise Exception('function: weather_get_from_weather_com error: %s' % e.__str__())
        finally:
            if driver:
                driver.quit()
        return rv

    @staticmethod
    def weather_get_by_cityid(cityid):
        rt = {}
        try:
            res = get_weather(cityid)
            rt = res.get('now')
            rt.update({'update': res.get('basic').get('update')})
        except Exception as e:
            pass
        return rt

    def aq_get_by_cityname(cityName):
        rt = {}
        try:
            apikey = '5c5197c7627e15b7d975159bac46e2e4'
            headers = {'apikey': apikey}
            url = 'http://www.pm25.in/api/querys/pm2_5.json?city=%s&token=5j1znBVAsnSf5xQyNQyq&avg' % (cityName)

            res = requests.get(url, headers=headers)
            html = res.text
            res = json.loads(html)
            return res
        except Exception as e:
            pass
        return rt


class HistoryDataMethods:
    """
    这个类提供与历史数据相关的基础操作
    """
    _logger = LogOperator()

    @staticmethod
    def getLastUpdateTimeOfPoint(projId, pointName, strTimeEnd, strPeriod, days=30):
        rt = None
        cursor = None
        try:
            timeobj = datetime.strptime(strTimeEnd, standard_time_format)
            timeObjStart = timeobj - timedelta(days=days)
            collectionName = BEOPDataAccess.getInstance().GetCollectionNameById(projId)
            conMongodb = MongoConnManager.getHisConnTuple(int(projId))
            timeObjStartStr = timeObjStart.strftime('%Y-%m-%d %H:%M:%S')
            timeobjStr = timeobj.strftime('%Y-%m-%d %H:%M:%S')
            find_list = BEOPDataAccess.getInstance().analysisHisConnection(conMongodb, timeObjStartStr, timeobjStr)
            find_list = BEOPDataAccess.getInstance().filterConnection(projId, find_list)
            for item in find_list:
                if item.get('st') and item.get('et'):
                    conn = item.get('conn')
                    flag = item.get('flag', 1)
                    if conn:
                        if flag == 1:
                            collectionName = strPeriod + '_data_' + collectionName if strPeriod != 'M1' else 'month_data_' + collectionName
                            cursor = conn.mdbBb[collectionName].find(
                                {'pointname': pointName, 'time': {'$gte': timeObjStart, '$lte': timeobj},
                                 "value": {'$nin': [None, 'Null', 'None']}}).sort(
                                [('time', pymongo.DESCENDING)]).limit(1)
                            for item in cursor:
                                rt = item.get('time')
                                break
                        elif flag == 2:
                            collectionName = app.config['V2FORMAT'] + collectionName
                            cursor = conn.mdbBb[collectionName].find(
                                {'pointname': pointName, 'time': {'$gte': timeObjStart, '$lte': timeobj}}).sort(
                                [('time', pymongo.DESCENDING)]).limit(5)
                            for item in cursor:
                                value = item.get('value')
                                temp = deepcopy(value)
                                hour, minute, isFind = None, None, False
                                for h in range(len(value.keys())):
                                    hour = max(map(lambda x: int(x), temp.keys()))
                                    for m in range(len(value[str(hour)].keys())):
                                        minute = max(map(lambda x: int(x), temp[str(hour)].keys()))
                                        now_time = item.get('time').replace(hour=int(hour), minute=int(minute))
                                        if temp[str(hour)][str(minute)] is not None and temp[str(hour)][
                                            str(minute)] != 'null' and temp[str(hour)][
                                            str(minute)] != 'None' and now_time <= timeobj:
                                            isFind = True
                                            break
                                        else:
                                            temp[str(hour)].pop(str(minute))
                                    if isFind:
                                        break
                                    temp.pop(str(hour))
                                if hour and minute and temp:
                                    rt = item.get('time').replace(hour=int(hour), minute=int(minute))
                                    break
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        finally:
            if cursor:
                cursor.close()
        return rt

    @staticmethod
    def get_last_update_time_value(projId, pointName, beforeTime, nSearchDays=30):
        res_list_time = []
        res_list_value = []
        try:
            projId = int(projId)
            collectionName = BEOPDataAccess.getInstance().GetCollectionNameById(projId)
            conMongodb = MongoConnManager.getHisConnTuple(projId)
            startTime = beforeTime - timedelta(days=nSearchDays)
            if collectionName and conMongodb:
                for conn in conMongodb:
                    conn = conn[0]
                    conlist = conn.mdbBb.collection_names(False)
                    for cn in conlist:
                        bFind = False
                        if collectionName in cn:
                            try:
                                cursor = None
                                if cn.startswith('m5_data'):
                                    cursor = conn.mdbBb[cn].find(
                                        {'pointname': pointName, 'time': {'$lt': beforeTime, '$gt': startTime},
                                         'value': {'$nin': [None, 'Null', 'None']}}).sort(
                                        [('time', pymongo.DESCENDING)]).limit(1)
                                    for item in cursor:
                                        res_list_time.append(item.get('time'))
                                        res_list_value.append(item.get('value'))
                                        break
                                elif cn.startswith('v2_data'):
                                    cursor = conn.mdbBb[cn].find(
                                        {'pointname': pointName, 'time': {'$lte': beforeTime, '$gte': startTime}}).sort(
                                        [('time', pymongo.DESCENDING)])
                                    for item in cursor:
                                        value = item.get('value')
                                        for h in range(23, -1, -1):
                                            if bFind:
                                                break
                                            h_item = value.get(str(h))
                                            if h_item is not None:
                                                for m in range(59, -1, -1):
                                                    m_item = h_item.get(str(m))
                                                    if m_item not in [None, 'None', 'Null', 'null']:
                                                        t = item.get('time')
                                                        t = t.replace(hour=int(h), minute=int(m))
                                                        if t < beforeTime:
                                                            v = m_item
                                                            res_list_time.append(t)
                                                            res_list_value.append(v)
                                                            bFind = True
                                                            break
                            except Exception as e:
                                errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(),
                                                  True)
                            finally:
                                if cursor:
                                    cursor.close()
            if len(res_list_time) == 0:
                return None, None
            tm = max(res_list_time)
            for item in list(enumerate(res_list_time)):
                if item[1] == tm:
                    if isinstance(res_list_value[item[0]], str):
                        try:
                            res_list_value[item[0]] = float(res_list_value[item[0]])
                        except:
                            pass
                    return tm, res_list_value[item[0]]
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return None, None

    @staticmethod
    def sync_history_data(projId, strTimeAt, timeFormat, pointList):
        rt = False
        try:
            r = requests.post(
                'http://%s/sync_data_to_mongodb/' % (app.config['BEOP_SERVER_ADDR'],) + str(timeFormat) + "/" + str(
                    projId) + "/" + str(strTimeAt), data=json.dumps(pointList), headers=app.config['POST_HEADER'])
            if r.status_code == 200:
                ret = json.loads(r.text)
                if ret and ret.get('error') == "ok":
                    rt = True
            else:
                HistoryDataMethods._logger.writeLog(
                    '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def saveHistoryData(dataList, connBase=None, collectionNameBase=None, runMode=1):
        rt = []
        try:
            for item in dataList:
                tStart = time.time()
                timeFormat = item.get('timeFormat')
                projId = int(item.get('projId'))
                conMongodb = MongoConnManager.getHisConnTuple(projId) if connBase is None else connBase
                collectionName = BEOPDataAccess.getInstance().GetCollectionNameById(
                    projId) if collectionNameBase is None else collectionNameBase
                tCost1 = time.time() - tStart
                if not collectionName:
                    rt.append({'result': 'failed, collectionname is none, projId=%d' % (projId,)})
                else:
                    collectionName = 'm5_data_' + collectionName
                    pointName = item.get('pointName')
                    pointValue = item.get('pointValue')
                    pointTime = item.get('timeAt')
                    if isinstance(pointTime, str):
                        pointTime = datetime.strptime(pointTime, '%Y-%m-%d %H:%M:%S')
                    if timeFormat == 'm1':
                        pointTime = pointTime.replace(second=0)
                    elif timeFormat == 'm5':
                        pointTime = pointTime.replace(second=0)
                        nMinute = pointTime.minute
                        nFormatMinute = int(5 * (floor(nMinute / 5)))
                        if nFormatMinute >= 60:
                            pointTime = pointTime + timedelta(hours=1)
                            pointTime = pointTime.replace(minute=0)
                        else:
                            pointTime = pointTime.replace(minute=nFormatMinute)
                    elif timeFormat == 'h1':
                        pointTime = pointTime.replace(second=0)
                        pointTime = pointTime.replace(minute=0)
                    elif timeFormat == 'd1':
                        pointTime = pointTime.replace(second=0)
                        pointTime = pointTime.replace(minute=0)
                        pointTime = pointTime.replace(hour=0)
                    elif timeFormat == 'month' or timeFormat == 'M1':
                        pointTime = pointTime.replace(second=0)
                        pointTime = pointTime.replace(minute=0)
                        pointTime = pointTime.replace(hour=0)
                        pointTime = pointTime.replace(day=1)
                    resMongoUpdated = False
                    if isinstance(conMongodb, list):
                        if len(conMongodb) > 0:
                            for conn in conMongodb:
                                st = conn[1]
                                et = conn[2]
                                if pointTime <= et and pointTime >= st:
                                    tCost2 = time.time() - tStart
                                    resMongoUpdated = conn[0].saveHistoryData(projId, pointName, pointValue, pointTime,
                                                                              collectionName, runMode=runMode)
                                    tCost3 = time.time() - tStart
                                    break
                    else:
                        if conMongodb:
                            tCost2 = time.time() - tStart
                            resMongoUpdated = conMongodb.saveHistoryData(projId, pointName, pointValue, pointTime,
                                                                         collectionName, runMode=runMode)
                            tCost3 = time.time() - tStart

                    if not resMongoUpdated:
                        rt.append({'result': 'write point to history failed, pointname=%s' % (pointName,)})
                        errorLog.writeLog(int(projId), 'write point to history failed, pointname=%s' % (pointName,),
                                          True)
                    else:
                        rt.append({'result': 'write point to history successful, pointname=%s' % (pointName,)})
                    tCost4 = time.time() - tStart
                    if tCost4 > 1.0:
                        errorLog.writeLog(int(projId),
                                          'ERROR:save one data tomongo cost more than 1 second time:%.1f,%.1f,%.1f,%.1f' % (
                                          tCost1, tCost2, tCost3, tCost4), True)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def get_history_data(projId, pointList, timeStart, timeEnd, timeFormat, nearestDays=None):
        """
        获取历史数据

        projId:项目ID,整形
        pointList:要获取的点的列表
        timeStart:起始时间戳，字符串
        timeEnd:结束时间戳，字符串
        timeFormat:m1,m5,h1,d1,M1，字符串

        return:list
        sample:
        [
        {'history': [
                    {'error': False, 'value': '5.01', 'time': '2016-01-08 09:00:00'},
                    {'error': False, 'value': '6.31', 'time': '2016-01-08 10:00:00'},
                    {'error': False, 'value': '6.89', 'time': '2016-01-08 11:00:00'},
                    {'error': False, 'value': '9.42', 'time': '2016-01-08 12:00:00'},
                    {'error': False, 'value': '9.85', 'time': '2016-01-08 13:00:00'},
                    {'error': False, 'value': '9.52', 'time': '2016-01-08 14:00:00'},
                    {'error': True, 'value': '9.52', 'time': '2016-01-08 15:00:00'},
                    {'error': True, 'value': '9.52', 'time': '2016-01-08 16:00:00'},
                    {'error': True, 'value': '9.52', 'time': '2016-01-08 17:00:00'},
                    {'error': True, 'value': '9.52', 'time': '2016-01-08 18:00:00'}
                    ],
         'avg': 8.508,
         'name': 'OUTDOOR_TEMP',
         'median': 9.52,
         'max': 9.85,
         'min': 5.01,
         'std': 1.6564588736216783
         }...
        ]

        """
        result = []
        try:
            result = BEOPDataAccess.getInstance().get_history_data_padded(projId, pointList, timeStart, timeEnd,
                                                                          timeFormat, nearestDays=nearestDays)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return result

    @staticmethod
    def set_history_data(data, runMode=1):
        """
        写历史数据

        data = {'setList':setDataList}
        setDataList = [dictData]
        dictData:{
              'timeFormat':m1,m5,h1,d1,M1，字符串
              'projId':项目ID，整形
              'pointName':点名，字符串
              'pointValue':点值，字符串、整形或者浮点型,
              'timeAt':时间戳，字符串
              }

        return:Boolean
        sample:True/False
        """
        rt = False
        try:
            dataList = data.get('setList')
            if len(dataList) == 0:
                rt.append({'result': 'dataList is empty'})
                rt = False
            else:
                res = HistoryDataMethods.saveHistoryData(dataList, runMode=runMode)
                if 'failed' not in res[0].get('result', ''):
                    rt = True
        except Exception:
            logging.error('Failed to set history data: %s!', data, exc_info=True, stack_info=True)
        return rt

    @staticmethod
    def get_history_data_of_last_hour_float(projId, pointList):
        """
        过去1小时的历史数据
        projId:项目的Id
        pointList:'xxx'
        timeFormat:m1 or m5

        return:如果查不到，返回None，否则返回一个列表，代表每个查询时刻的历史数据
        """
        rt = []
        try:
            if not isinstance(pointList, str):
                raise Exception('type of pointList is str, not list')
            t_end = datetime.now().replace(second=0)
            minute = t_end.minute
            for i in range(minute, -1, -1):
                if i % 5 == 0:
                    t_end = t_end.replace(minute=i)
                    break
            t_start = t_end - timedelta(hours=1)
            his = HistoryDataMethods.get_history_data(projId, [pointList], t_start.strftime(standard_time_format),
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
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def get_avg_data_of_last_hour_float(projId, pointName):
        try:
            rtData = HistoryDataMethods.get_history_data_of_last_hour_float(projId, pointName)
            if rtData is None or len(rtData) == 0:
                return None
            return sum(rtData) / len(rtData)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return None

    @staticmethod
    def get_status_timeratio_of_last_hour_int(projId, pointName, nStatus):
        try:
            rtData = HistoryDataMethods.get_history_data_of_last_hour_float(projId, pointName)
            if rtData is None or len(rtData) == 0:
                return None
            rtData.reverse()
            nStatusCount = 0;
            for item in rtData:
                if int(item) == nStatus:
                    nStatusCount += 1
                else:
                    break
            return nStatusCount / len(rtData)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return None


class RealtimeDataMethods:
    """
    这个类提供与实时数据相关的基础操作
    """
    _logger = LogOperator()

    @staticmethod
    def get_realtime_data(projId, pointList):
        rt = {}
        try:
            rv = BEOPDataAccess.getInstance().getFlag0PointValueList(projId)
            if rv:
                for key in rv:
                    try:
                        rt[key] = float(rv.get(key))
                    except:
                        rt[key] = rv.get(key)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def get_all_realtime_data(projId):
        rt = {}
        data = dict(projId=projId)
        try:
            r = requests.post(app.config['get_realtime_data_url'], data=json.dumps(data),
                              headers=app.config['POST_HEADER'])
            if r.status_code == 200:
                rv = json.loads(r.text)
                if rv:
                    for key in rv:
                        try:
                            rt[key] = float(rv.get(key))
                        except:
                            rt[key] = rv.get(key)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def set_realtime_data(projId, pointNameList, pointValueList, flag, strTimeList):
        """
        写实时数据

        projId:项目ID，整形
        pointNameList:即将写入的点名的列表
        pointValueList:与点名的列表对应的点值的列表
        flag:0,1,2      1是算法，2是计算点

        return:Boolean
        sample:True/False
        """
        try:
            rt = False
            if isinstance(pointNameList, str):
                pointNameList = [pointNameList]
                pointValueList = [pointValueList]

            if isinstance(pointNameList, list) and isinstance(pointValueList, list):
                if len(pointNameList) == len(pointValueList):
                    projName = BEOPDataAccess.getInstance().getProjNameById(projId)
                    if projName:
                        rv = BEOPDataBufferManager.getInstance().setMutilDataToBufferTable(
                            projName, pointNameList, pointValueList, strTimeList, flag)
                        if isinstance(rv, dict) and rv.get('state') == 1:
                            rt = True
                    else:
                        rt = False
        except Exception:
            logging.error('Failed to set realtime data! projId=%s, flag=%s',
                          projId, flag, exc_info=True, stack_info=True)
            rt = False
        return rt

    @staticmethod
    def delete_point_from_mysql(projId, pointList):
        rt = None
        try:
            if pointList:
                r = requests.post('http://%s/remove/realtime_data/' % (app.config['BEOP_SERVER_ADDR'],) + str(projId),
                                  data=json.dumps(pointList), headers=app.config['POST_HEADER'])
                if r.status_code == 200:
                    strJson = r.text
                    rt = json.loads(strJson)
                else:
                    RealtimeDataMethods._logger.writeLog(
                        '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def delete_point_from_mysql_all(projId):
        rt = None
        try:
            r = requests.post('http://%s/remove/realtime_data_all/' % (app.config['BEOP_SERVER_ADDR'],) + str(projId),
                              headers=app.config['POST_HEADER'])
            if r.status_code == 200:
                strJson = r.text
                rt = json.loads(strJson)
            else:
                RealtimeDataMethods._logger.writeLog(
                    '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def get_alarm_name_list(projId, alarmId_list):
        rt = mongo_operator.get_alarm_send_info(projId, alarmId_list)
        return rt

    @staticmethod
    def get_alarm_real_info(projId):
        rt = BEOPDataAccess.getInstance().get_alarm_real_info(projId)
        return rt

    @staticmethod
    def set_alarm_send_flag(projId):
        rt = BEOPDataAccess.getInstance().update_alarm_send_flag(projId)
        return rt

    @staticmethod
    def set_alarm_real_result(projId, alarm_result_list):
        RedisManager.set_alarm_real_result(projId, alarm_result_list)


class DiagnosisDataMethods:
    """
    该类处理与诊断相关的数据操作
    """
    _logger = LogOperator()
    # _errorLog=errorLog()
    _sentDiagnosisEmailToday = []
    _sentToday = None

    class Grade:
        info = 0
        warning = 1
        error = 2

    @staticmethod
    def get_active_enable(projId, starttime, endtime):
        """
        參數示例：
        projId: 1
        starttime: '2015-01-01 12:12:12'
        endtime: '2016-01-01 12:12:12'
        """
        rt = None
        try:
            r = requests.get('http://%s/diagnosis/enable/get/' % (app.config['BEOP_SERVER_ADDR'],) + str(
                projId) + '/' + starttime + '/' + endtime, headers=app.config['POST_HEADER'], timeout=300)
            if r.status_code == 200:
                strJson = r.text
                rt = json.loads(strJson)
            else:
                DiagnosisDataMethods._logger.writeLog(
                    '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def get_active_fault(projId, starttime, endtime):
        """
        參數示例：
        projId: 1
        starttime: '2015-01-01 12:12:12'
        endtime: '2016-01-01 12:12:12'
        """
        rt = None
        try:
            r = requests.get('http://%s/diagnosis/fault/get/' % (app.config['BEOP_SERVER_ADDR'],) + str(
                projId) + '/' + starttime + '/' + endtime, headers=app.config['POST_HEADER'], timeout=300)
            if r.status_code == 200:
                strJson = r.text
                rt = json.loads(strJson)
            else:
                DiagnosisDataMethods._logger.writeLog(
                    '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def get_active_limit(projId, starttime, endtime):
        """
        參數示例：
        projId: 1
        starttime: '2015-01-01 12:12:12'
        endtime: '2016-01-01 12:12:12'
        """
        rt = None
        try:
            r = requests.get('http://%s/diagnosis/limit/get/' % (app.config['BEOP_SERVER_ADDR'],) + str(
                projId) + '/' + starttime + '/' + endtime, headers=app.config['POST_HEADER'], timeout=300)
            if r.status_code == 200:
                strJson = r.text
                rt = json.loads(strJson)
            else:
                DiagnosisDataMethods._logger.writeLog(
                    '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def get_active_order(projId, starttime, endtime):
        """
        參數示例：
        projId: 1
        starttime: '2015-01-01 12:12:12'
        endtime: '2016-01-01 12:12:12'
        """
        rt = None
        try:
            r = requests.get('http://%s/diagnosis/order/get/' % (app.config['BEOP_SERVER_ADDR'],) + str(
                projId) + '/' + starttime + '/' + endtime, headers=app.config['POST_HEADER'], timeout=300)
            if r.status_code == 200:
                strJson = r.text
                rt = json.loads(strJson)
            else:
                DiagnosisDataMethods._logger.writeLog(
                    '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def get_diagnosis_all(projId):
        """
        參數示例：
        projId:1 or '1'
        """
        rt = None
        try:
            r = requests.get('http://%s/diagnosis/getAll/' % (app.config['BEOP_SERVER_ADDR'],) + str(projId),
                             headers=app.config['POST_HEADER'], timeout=300)
            if r.status_code == 200:
                strJson = r.text
                rt = json.loads(strJson)
            else:
                DiagnosisDataMethods._logger.writeLog(
                    '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def get_diagnosis_notice(projId):
        """
        參數示例：
        projId:1 or '1'
        """
        rt = None
        try:
            r = requests.get('http://%s/diagnosis/notice/get/' % (app.config['BEOP_SERVER_ADDR'],) + str(projId),
                             headers=app.config['POST_HEADER'], timeout=300)
            if r.status_code == 200:
                strJson = r.text
                rt = json.loads(strJson)
            else:
                DiagnosisDataMethods._logger.writeLog(
                    '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def get_diagnosis_fault(projId):
        """
        參數示例：
        projId:1 or '1'
        """
        rt = None
        try:
            r = requests.get('http://%s/diagnosis/fault/get/' % (app.config['BEOP_SERVER_ADDR'],) + str(projId),
                             headers=app.config['POST_HEADER'], timeout=300)
            if r.status_code == 200:
                strJson = r.text
                rt = json.loads(strJson)
            else:
                DiagnosisDataMethods._logger.writeLog(
                    '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def get_diagnosis_equipment(projId):
        """
        參數示例：
        projId:1 or '1'
        """
        rt = None
        try:
            r = requests.get('http://%s/diagnosis/equipment/get/' % (app.config['BEOP_SERVER_ADDR'],) + str(projId),
                             headers=app.config['POST_HEADER'], timeout=300)
            if r.status_code == 200:
                strJson = r.text
                rt = json.loads(strJson)
            else:
                DiagnosisDataMethods._logger.writeLog(
                    '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def get_diagnosis_zone(projId):
        """
        參數示例：
        projId:1 or '1'
        """
        rt = None
        try:
            r = requests.get('http://%s/diagnosis/zone/get/' % (app.config['BEOP_SERVER_ADDR'],) + str(projId),
                             headers=app.config['POST_HEADER'], timeout=300)
            if r.status_code == 200:
                strJson = r.text
                rt = json.loads(strJson)
            else:
                DiagnosisDataMethods._logger.writeLog(
                    '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def add_diagnosis_equipment(projId, modalTextId, subSystemName, systemId, zoneId, name, systemName, pageId, id):
        """
        參數示例：
        modalTextId: 50019508,
        subSystemName: '',
        systemId: 101,
        zoneId: 1,
        name: '泵组001',
        systemName: 'BranchMain_test',
        pageId: 0,
        id: 101,
        projId: '101'
        """
        rt = None
        dic = dict(modalTextId=modalTextId, subSystemName=subSystemName, systemId=systemId, id=id,
                   zoneId=zoneId, name=name, systemName=systemName, pageId=pageId, project=projId)
        try:
            if dic:
                r = requests.post(
                    'http://%s/diagnosis/equipment/add/' % (app.config['BEOP_SERVER_ADDR'],) + str(projId),
                    data=json.dumps(dic), headers=app.config['POST_HEADER'], timeout=300)
                if r.status_code == 200:
                    strJson = r.text
                    rt = json.loads(strJson)
                else:
                    DiagnosisDataMethods._logger.writeLog(
                        '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def add_diagnosis_zone(projId, campusId, buildingId, subBuildingName, subBuildingId, pageId, id, buildingName,
                           campusName):
        """
        參數示例：
        campusId: 4,
        buildingId: 1,
        subBuildingName: '二次泵供水',
        subBuildingId: 1,
        pageId: 50000015,
        id: 1,
        buildingName: '机房',
        projId: 101,
        campusName: '算法测试'
        """
        rt = None
        dic = dict(campusId=campusId, buildingId=buildingId, subBuildingName=subBuildingName, buildingName=buildingName,
                   subBuildingId=subBuildingId, pageId=pageId, id=id, project=projId, campusName=campusName)
        try:
            if dic:
                r = requests.post('http://%s/diagnosis/zone/add/' % (app.config['BEOP_SERVER_ADDR'],) + str(projId),
                                  data=json.dumps(dic), headers=app.config['POST_HEADER'], timeout=300)
                if r.status_code == 200:
                    strJson = r.text
                    rt = json.loads(strJson)
                else:
                    DiagnosisDataMethods._logger.writeLog(
                        '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def add_diagnosis_notice(projId, FaultID, issueTime, Detail):
        """
        參數示例：
        projId: 101
        FaultID: 1000
        issueTime: '2016-03-21 00:00:00'
        OrderID: 1
        Energy: 0
        Detail: 'test'
        Status: 0
        """
        rt = None
        OrderID = 0
        Energy = 0
        Status = 1
        dic = dict(faultId=FaultID, time=issueTime, orderID=OrderID, energy=Energy, detail=Detail, status=Status,
                   projectId=projId)
        try:
            if dic:
                r = requests.post('http://%s/diagnosis/notice/add/' % (app.config['BEOP_SERVER_ADDR'],) + str(projId),
                                  data=json.dumps(dic), headers=app.config['POST_HEADER'], timeout=300)
                if r.status_code == 200:
                    strJson = r.text
                    rt = json.loads(strJson)
                else:
                    DiagnosisDataMethods._logger.writeLog(
                        '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def add_diagnosis_notice(projId, buildingName, subBuildingName, pageId, faultName, faultDescription, energy=0,
                             alarmGrade=Grade.warning, bindPoints='', timeInterval=None):
        """
        参数示例：
        projId: 72
        subBuildingName: '59层'
        buildingName: '高区'
        pageId: 100001
        faultName: '湿度异常偏高'
        faultDiscription: '原因分析为新风控制偏差'
        alarmGrade: DiagnosisAlarmGrade.NORMAL
        """
        rt = None
        dic = dict(subBuildingName=subBuildingName, buildingName=buildingName, pageId=pageId, faultName=faultName,
                   faultDescription=faultDescription, energy=energy, alarmGrade=alarmGrade, bindPoints=bindPoints,
                   timeInterval=timeInterval)
        try:
            if dic:
                r = requests.post(
                    'http://%s/diagnosis/notice/add/new/' % (app.config['BEOP_SERVER_ADDR'],) + str(projId),
                    data=json.dumps(dic), headers=app.config['POST_HEADER'], timeout=300)
                if r.status_code == 200:
                    strJson = r.text
                    rt = json.loads(strJson)
                else:
                    DiagnosisDataMethods._logger.writeLog(
                        '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)

                    # send mail
                    # tNow = datetime.now()
                    # if DiagnosisDataMethods._sentToday is None or tNow.day != DiagnosisDataMethods._sentToday.day:
                    #     DiagnosisDataMethods._sentDiagnosisEmailToday.clear()
                    #     DiagnosisDataMethods._sentToday = tNow
                    #
                    # if faultName not in DiagnosisDataMethods._sentDiagnosisEmailToday:
                    #     strSubject = '项目id=%s,(%s)%s 问题提示:%s' % (projId, buildingName, subBuildingName, faultName)
                    #     strMsg = faultDescription
                    #     PostMessageQueueMethods.sendToEmailQueue(strMsg, strSubject)
                    #     DiagnosisDataMethods._sentDiagnosisEmailToday.append(faultName)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def add_diagnosis_notice_multi(projId, noticeList=[]):
        """
        參數示例：
        projId: 1
        noticeList: [{'FaultID':123,
                     'issueTime':'2016-03-21 00:00:00',
                     'OrderID':1,
                     'Energy':0,
                     'Detail':'fortest',
                     'Status':1,
                     'ProjectID':101}...]
        """
        rt = None
        dic = {'addList': noticeList}
        try:
            if dic:
                r = requests.post(
                    'http://%s/diagnosis/notice/addMulti/' % (app.config['BEOP_SERVER_ADDR'],) + str(projId),
                    data=json.dumps(dic), headers=app.config['POST_HEADER'], timeout=300)
                if r.status_code == 200:
                    strJson = r.text
                    rt = json.loads(strJson)
                else:
                    DiagnosisDataMethods._logger.writeLog(
                        '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def add_diagnosis_fault(projId, userModifyTime, userFaultGrade, id, userFaultDelay, parentId, description,
                            equipmentId, userEnable, points, name, defaultGrade):
        """
        參數示例：
        userModifyTime: '2016-03-21 17:42:11',
        userFaultGrade: 1,
        id: 10100201001,
        userFaultDelay: '2016-03-21 17:42:11',
        parentId: 201,
        description: '总管温度读数较长时间未变化,可能是传感器故障, 请检查相应传感器',
        equipmentId: 201,
        userEnable: 1,
        points: 'CHW001_ChWSupplyT,总管温度',
        name: '总管温度未变动',
        defaultGrade: 1
        """
        rt = None
        dic = {'userModifyTime': userModifyTime, 'userFaultGrade': userFaultGrade,
               'id': id, 'userFaultDelay': userFaultDelay, 'parentId': parentId,
               'project': projId, 'description': description, 'equipmentId': equipmentId,
               'userEnable': userEnable, 'points': points, 'name': name, 'defaultGrade': defaultGrade}
        try:
            if dic:
                r = requests.post('http://%s/diagnosis/fault/add/' % (app.config['BEOP_SERVER_ADDR'],) + str(projId),
                                  data=json.dumps(dic), headers=app.config['POST_HEADER'], timeout=300)
                if r.status_code == 200:
                    strJson = r.text
                    rt = json.loads(strJson)
                else:
                    DiagnosisDataMethods._logger.writeLog(
                        '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def add_diagnosis_fault_multi(projId, faultList=[]):
        """
        參數示例：
        projId: 1
        faultList: [{'userModifyTime': '2016-03-21 17:42:11',
                    'userFaultGrade': 1,
                    'id': 10100201001,
                    'userFaultDelay': '2016-03-21 17:42:11',
                    'parentId': 201,
                    'project': '101',
                    'description': '总管温度读数较长时间未变化,可能是传感器故障, 请检查相应传感器',
                    'equipmentId': 201,
                    'userEnable': 1,
                    'points': 'CHW001_ChWSupplyT,总管温度',
                    'name': '总管温度未变动',
                    'defaultGrade': 1},
        ...
        {'userModifyTime': '2016-03-21 17:42:11',
        'userFaultGrade': 1,
        'id': 10100202001,
        'userFaultDelay': '2016-03-21 17:42:11',
        'parentId': 202,
        'project': '101',
        'description': '总管温度读数较长时间未变化,可能是传感器故障, 请检查相应传感器',
        'equipmentId': 202,
        'userEnable': 1,
        'points': 'CHW001_ChWSupplyT,总管温度',
        'name': '总管温度未变动',
        'defaultGrade': 1}...]
        """
        rt = None
        dic = {'addList': faultList}
        try:
            if dic:
                r = requests.post(
                    'http://%s/diagnosis/fault/addMulti/' % (app.config['BEOP_SERVER_ADDR'],) + str(projId),
                    data=json.dumps(dic), headers=app.config['POST_HEADER'], timeout=300)
                if r.status_code == 200:
                    strJson = r.text
                    rt = json.loads(strJson)
                else:
                    DiagnosisDataMethods._logger.writeLog(
                        '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def add_diagnosis_equipment_multi(projId, equipmentList=[]):
        """
        參數示例：
        projId: 1
        equipmentList: [{'modalTextId': 50019508,
                        'subSystemName': '',
                        'systemId': 101,
                        'zoneId': 1,
                        'name': '泵组001',
                        'systemName': 'BranchMain_test',
                        'pageId': 0,
                        'id': 101,
                        'project': '101'}...]
        """
        rt = None
        dic = {'addList': equipmentList}
        try:
            if dic:
                r = requests.post(
                    'http://%s/diagnosis/equipment/addMulti/' % (app.config['BEOP_SERVER_ADDR'],) + str(projId),
                    data=json.dumps(dic), headers=app.config['POST_HEADER'], timeout=300)
                if r.status_code == 200:
                    strJson = r.text
                    rt = json.loads(strJson)
                else:
                    DiagnosisDataMethods._logger.writeLog(
                        '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def add_diagnosis_zone_multi(projId, zoneList=[]):
        """
        參數示例：
        projId: 1
        zoneList: [{'campusId': 4,
                    'buildingId': 1,
                    'subBuildingName': '二次泵供水',
                    'subBuildingId': 1,
                    'pageId': 50000015,
                    'id': 1,
                    'buildingName': '机房',
                    'project': 101,
                    'campusName': '算法测试'}...]
        """
        rt = None
        dic = {'addList': zoneList}
        try:
            if dic:
                r = requests.post(
                    'http://%s/diagnosis/zone/addMulti/' % (app.config['BEOP_SERVER_ADDR'],) + str(projId),
                    data=json.dumps(dic), headers=app.config['POST_HEADER'], timeout=300)
                if r.status_code == 200:
                    strJson = r.text
                    rt = json.loads(strJson)
                else:
                    DiagnosisDataMethods._logger.writeLog(
                        '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def update_fault_noticeId(projId, dic={}):
        """
        參數示例：
        projId: 1
        dic: {faultid1:noticeid1}
        其中所有的faultid和noticeid都是整形
        """
        rt = None
        dic = {'postdata': dic}
        try:
            if dic:
                r = requests.post(
                    'http://%s/diagnosis/fault/updateNoticeId/' % (app.config['BEOP_SERVER_ADDR'],) + str(projId),
                    data=json.dumps(dic), headers=app.config['POST_HEADER'], timeout=300)
                if r.status_code == 200:
                    strJson = r.text
                    rt = json.loads(strJson)
                else:
                    DiagnosisDataMethods._logger.writeLog(
                        '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def reset_diagnosis_table(projId, suffix):
        """
        示例参数：
        projId: 4
        suffix: DiagnosisEnum.ZONE
        """
        rt = None
        try:
            r = requests.get(
                'http://%s/diagnosis/resetTable/' % (app.config['BEOP_SERVER_ADDR'],) + str(projId) + '/' + suffix,
                headers=app.config['POST_HEADER'], timeout=300)
            if r.status_code == 200:
                strJson = r.text
                rt = json.loads(strJson)
            else:
                DiagnosisDataMethods._logger.writeLog(
                    '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def init_all_diagnosis_tables(projId):
        """
        示例参数：
        projId: 4
        """
        rt = None
        try:
            r = requests.get('http://%s/diagnosis/initAllTables/' % (app.config['BEOP_SERVER_ADDR'],) + str(projId),
                             headers=app.config['POST_HEADER'], timeout=300)
            if r.status_code == 200:
                strJson = r.text
                rt = json.loads(strJson)
            else:
                DiagnosisDataMethods._logger.writeLog(
                    '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def diagnosis_add_fault_to_kpi(projId, faultId, faultMoney, kpiName1, kpiName2, kpiName3):
        """
        示例参数：
        projId: 4
        faultId: 121
        faultMoney: 6.8
        kpiName1: 'kpiName1'
        kpiName2: 'kpiName2'
        kpiName3: 'kpiName3'
        return: (kpiName1Id, kpiName2Id, kpiName3Id)
        """
        rt = None
        try:
            dic = dict(faultId=faultId, faultMoney=faultMoney, kpiName1=kpiName1, kpiName2=kpiName2, kpiName3=kpiName3)
            r = requests.post(
                'http://%s/diagnosis/kpi/addFaultToKPI/' % (app.config['BEOP_SERVER_ADDR'],) + str(projId),
                data=json.dumps(dic), headers=app.config['POST_HEADER'], timeout=300)
            if r.status_code == 200:
                strJson = r.text
                rt = json.loads(strJson)
            else:
                DiagnosisDataMethods._logger.writeLog(
                    '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    # 发邮件
    @staticmethod
    def send_message_by_email(userIdList, strSubject, strContent, countryCode='WW', strategy='v1'):
        rt = False
        try:
            if userIdList and strSubject and strContent:
                r = requests.post('http://%s/get_user_info' % (app.config['BEOP_SERVER_ADDR'],),
                                  headers={'content-type': 'application/json'}, data=json.dumps(userIdList))
                if r.status_code == 200:
                    strJson = r.text
                    ret = json.loads(strJson)
                    if ret:
                        content = {}
                        content.update({'msgId': ObjectId().__str__()})
                        content.update({'type': 'email'})
                        content.update({'countryCode': countryCode})
                        content.update({'strategy': strategy})
                        content.update({'subject': strSubject})
                        content.update({'recipients': [ret[x][1] for x in ret if ret[x][1]]})
                        content.update({'html': '<body>%s</body>' % (strContent,)})

                        post_data = {'value': str(content), 'name': 'email'}
                        r = requests.post('http://%s/mq/mqSendTask' % (app.config['BEOP_SERVER_ADDR'],),
                                          headers=app.config['POST_HEADER'], data=json.dumps(post_data), timeout=300)
                        if r.status_code == 200:
                            strJson = r.text
                            ret = json.loads(strJson)
                            if ret:
                                if ret.get('error', '') == 'ok':
                                    rt = True
                                else:
                                    logging.error('Failed to send email! %s', ret);
                        else:
                            logging.error('Failed to send email! status_code=%s', r.status_code)
        except Exception:
            logging.error('Unhandled exception! userIdList=%s, strSubject=%s, countryCode=%s, strategy=%s',
                          userIdList, strSubject, countryCode, strategy, exc_info=True, stack_info=True)
        return rt

    # 发app消息
    @staticmethod
    def send_message_by_app(userIdList, strSubject, strContent):
        rt = False
        try:
            if userIdList and strSubject and strContent:
                content = {}
                content.update({'msgId': ObjectId().__str__()})
                content.update({'type': 'app'})
                if isinstance(userIdList, list):
                    if len(userIdList) > 0:
                        content.update({'audience': {'alias': userIdList}})
                content.update({'notification': {'ios': {"alert": strSubject, 'extras': {'message': strContent}},
                                                 'android': {'alert': strSubject, 'extras': {'message': strContent}}}})
                content.update({'message': {'msg_content': strContent, 'title': strSubject}})

                post_data = {'value': str(content), 'name': 'notify'}
                msg = {
                    'title': strSubject,
                    'alert': strContent,
                    'userId': userIdList,
                    'option': {}
                }
                insertReq = requests.post(
                    url='http://%s/appCommon/pushNotification/insertMessage' % (app.config['BEOPWEB_ADDR'],),
                    headers={'content-type': 'application/json',
                             'token': app.config.get('BEOPWEB_SECRET_TOKEN')}, data=json.dumps(msg))
                if insertReq.status_code == 200:
                    result = json.loads(insertReq.text)
                    print(result)
                r = requests.post(url='http://%s/mq/mqSendTask' % (app.config['BEOP_SERVER_ADDR'],),
                                  headers=app.config['POST_HEADER'], data=json.dumps(post_data), timeout=300)
                if r.status_code == 200:
                    strJson = r.text
                    ret = json.loads(strJson)
                    if ret:
                        if ret.get('error', '') == 'ok':
                            rt = True
                        else:
                            DiagnosisDataMethods._logger.writeLog(
                                '%s:' % (get_current_func_name()) + ' send_message error', True)
                else:
                    DiagnosisDataMethods._logger.writeLog(
                        '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            DiagnosisDataMethods._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    # 发短信给手机号
    @staticmethod
    def send_message_by_mobile_number(phoneNumList, strContent):
        rt = False
        try:
            if phoneNumList and strContent:
                content = {}
                content.update({'msgId': ObjectId().__str__()})
                content.update({'type': 'message'})
                content.update({'message': strContent})
                content.update({'phone': phoneNumList})

                post_data = {'value': str(content), 'name': 'message'}
                r = requests.post('http://%s/mq/mqSendTask' % (app.config['BEOP_SERVER_ADDR'],),
                                  headers=app.config['POST_HEADER'], data=json.dumps(post_data), timeout=300)
                if r.status_code == 200:
                    strJson = r.text
                    ret = json.loads(strJson)
                    if ret:
                        if ret.get('error', '') == 'ok':
                            rt = True
                        else:
                            DiagnosisDataMethods._logger.writeLog(
                                '%s:' % (get_current_func_name()) + ' send_message error', True)
                else:
                    DiagnosisDataMethods._logger.writeLog(
                        '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            DiagnosisDataMethods._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    # 发短信
    @staticmethod
    def send_message_by_mobile(userIdList, strContent):
        rt = False
        try:
            if userIdList and strContent:
                r = requests.post('http://%s/get_user_info' % (app.config['BEOP_SERVER_ADDR'],),
                                  headers={'content-type': 'application/json'}, data=json.dumps(userIdList))
                if r.status_code == 200:
                    strJson = r.text
                    ret = json.loads(strJson)
                    if ret:
                        content = {}
                        content.update({'msgId': ObjectId().__str__()})
                        content.update({'type': 'message'})
                        content.update({'message': strContent})
                        content.update({'phone': [ret[x][0] for x in ret if ret[x][0]]})
                        # content.update({'phone': ['18516600716']})

                        post_data = {'value': str(content), 'name': 'message'}
                        r = requests.post('http://%s/mq/mqSendTask' % (app.config['BEOP_SERVER_ADDR'],),
                                          headers=app.config['POST_HEADER'], data=json.dumps(post_data), timeout=300)
                        if r.status_code == 200:
                            strJson = r.text
                            ret = json.loads(strJson)
                            if ret:
                                if ret.get('error', '') == 'ok':
                                    rt = True
                                else:
                                    DiagnosisDataMethods._logger.writeLog(
                                        '%s:' % (get_current_func_name()) + ' send_message error', True)
                        else:
                            DiagnosisDataMethods._logger.writeLog(
                                '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            DiagnosisDataMethods._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def send_message_by_email_by_name(userNameList, strSubject, strContent):
        rt = False
        try:
            if userNameList and strSubject and strContent:
                content = {}
                content.update({'msgId': ObjectId().__str__()})
                content.update({'type': 'email'})
                content.update({'subject': strSubject})
                content.update({'recipients': userNameList})
                content.update({'html': '<body>%s</body>' % (strContent,)})

                post_data = {'value': str(content), 'name': 'email'}
                r = requests.post('http://%s/mq/mqSendTask' % (app.config['BEOP_SERVER_ADDR'],),
                                  headers=app.config['POST_HEADER'], data=json.dumps(post_data), timeout=300)
                if r.status_code == 200:
                    strJson = r.text
                    ret = json.loads(strJson)
                    if ret:
                        if ret.get('error', '') == 'ok':
                            rt = True

                        else:
                            DiagnosisDataMethods._logger.writeLog(
                                '%s:' % (get_current_func_name()) + ' send_email error', True)
                else:
                    DiagnosisDataMethods._logger.writeLog(
                        '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            DiagnosisDataMethods._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    # 发短信
    @staticmethod
    def send_message_by_mobile_by_num(phoneNumList, strContent):
        rt = False
        try:
            if phoneNumList and strContent:
                content = {}
                content.update({'msgId': ObjectId().__str__()})
                content.update({'type': 'message'})
                content.update({'message': strContent})
                content.update({'phone': phoneNumList})

                post_data = {'value': str(content), 'name': 'message'}
                r = requests.post('http://%s/mq/mqSendTask' % (app.config['BEOP_SERVER_ADDR'],),
                                  headers=app.config['POST_HEADER'], data=json.dumps(post_data), timeout=300)
                if r.status_code == 200:
                    strJson = r.text
                    ret = json.loads(strJson)
                    if ret:
                        if ret.get('error', '') == 'ok':
                            rt = True
                        else:
                            DiagnosisDataMethods._logger.writeLog(
                                '%s:' % (get_current_func_name()) + ' send_message error', True)
                else:
                    DiagnosisDataMethods._logger.writeLog(
                        '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            DiagnosisDataMethods._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt


class PostMessageQueueMethods:
    @staticmethod
    def sendToEmailQueue(strBody, subject):
        rt = False
        try:
            if strBody and subject:
                content = {}
                content.update({'msgId': ObjectId().__str__()})
                content.update({'type': 'email'})
                content.update({'subject': subject})
                content.update({'recipients': app.config['RECIPIENTS_LIST']})
                content.update({'html': '<body>%s</body>' % (strBody,)})

                post_data = {'value': str(content), 'name': 'email'}
                r = requests.post('http://%s/mq/mqSendTask' % (app.config['BEOP_SERVER_ADDR'],),
                                  headers=app.config['POST_HEADER'], data=json.dumps(post_data), timeout=300)
                if r.status_code == 200:
                    strJson = r.text
                    ret = json.loads(strJson)
                    if ret:
                        if ret.get('error', '') == 'ok':
                            rt = True
                        else:
                            DiagnosisDataMethods._logger.writeLog(
                                '%s:' % (get_current_func_name()) + ' request send_email_mq return not ok', True)
                else:
                    DiagnosisDataMethods._logger.writeLog(
                        '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            DiagnosisDataMethods._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)

        return rt

    @staticmethod
    def sendToNotifyQueue(userIdList, subject, content):
        rt = False
        try:
            if userIdList and subject and content:
                value_content = {}
                value_content.update({'msgId': ObjectId().__str__()})
                value_content.update({'type': 'app'})
                if isinstance(userIdList, list):
                    if len(userIdList) > 0:
                        value_content.update({'audience': {'alias': userIdList}})
                value_content.update({'notification': {'ios': {"alert": 'BeOP', 'extras': {'message': subject}},
                                                       'android': {'alert': 'BeOP', 'extras': {'message': subject}}}})
                value_content.update({'message': {'msg_content': content, 'title': subject}})

                post_data = {'value': str(value_content), 'name': 'notify'}
                r = requests.post('http://%s/mq/mqSendTask' % (app.config['BEOP_SERVER_ADDR'],),
                                  headers=app.config['POST_HEADER'], data=json.dumps(post_data), timeout=300)
                if r.status_code == 200:
                    strJson = r.text
                    ret = json.loads(strJson)
                    if ret:
                        if ret.get('error', '') == 'ok':
                            rt = True
                        else:
                            DiagnosisDataMethods._logger.writeLog(
                                '%s:' % (get_current_func_name()) + ' request send_notify_mq return not ok', True)
                else:
                    DiagnosisDataMethods._logger.writeLog(
                        '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:

            DiagnosisDataMethods._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)

        return rt

    @staticmethod
    def sendToMobileMessageQueueCN(strContent, phoneNumList):
        rt = False
        try:
            url = 'http://%s/mq/mqSendTask' % (app.config['BEOP_SERVER_ADDR'],)
            va = str({'type': 'message', 'message': strContent, 'phone': phoneNumList})
            data = {'name': 'message', 'value': va}
            r = requests.post(url, headers=app.config['POST_HEADER'], data=json.dumps(data), timeout=600)
            if r.status_code == 200:
                strJson = r.text
                ret = json.loads(strJson)
                if ret:
                    if ret.get('error', '') == 'ok':
                        rt = True
                    else:
                        DiagnosisDataMethods._logger.writeLog(
                            '%s:' % (get_current_func_name()) + ' request send_message_mq return not ok', True)
            else:
                DiagnosisDataMethods._logger.writeLog(
                    '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:

            DiagnosisDataMethods._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)

        return rt

    @staticmethod
    def sendToDiagnosisNoticeQueue(**kwargs):
        rt = False
        try:
            url = 'http://%s/mq/mqSendTask' % (app.config['BEOP_SERVER_ADDR'],)
            va = str(kwargs)
            data = {'name': 'diagnosis_notice', 'value': va}
            r = requests.post(url, headers=app.config['POST_HEADER'], data=json.dumps(data), timeout=300)
            if r.status_code == 200:
                strJson = r.text
                ret = json.loads(strJson)
                if ret:
                    if ret.get('error', '') == 'ok':
                        rt = True
                    else:
                        DiagnosisDataMethods._logger.writeLog(
                            '%s:' % (get_current_func_name()) + ' request send_message_mq return not ok', True)
            else:
                DiagnosisDataMethods._logger.writeLog(
                    '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:

            DiagnosisDataMethods._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)

        return rt

    @staticmethod
    def sendFactoryPreviewToEmailQueue(option, userInfoList):
        rt = False
        try:
            if isinstance(option, dict):
                url = option.get('url')
                lang = option.get('lang', 'zh')
                title = option.get('title', '')
                if not url:
                    raise Exception('url is not available')
            else:
                raise Exception('param option error: not a dict')
            stdout, stderr = getContentFromFactoryPreview(url, option.get('projectId'))
            # print(stdout)
            # print(stderr)
            # stdout = 'test'
            if stdout:
                countryConfig = BEOPDataAccess.getInstance().getCountryConfigByProjId(option.get('projectId', ''))
                html = makeEmailContentbyHTML(stdout, option, countryConfig, url, False)
                # contentHTML = makeEmailContentbyHTML(stdout, option, True)
                if html:
                    # userEmailAddrList = [v[1] for k,v in userInfoList.items()]
                    # attachment = generatePdfAttachment(stdout)
                    if len(stdout) < 100:
                        print('pdf not data')
                        return False
                    attachment = stdout
                    attachment = attachment[:-1]
                    attachmentNew = base64.b64decode(attachment)
                    if not attachmentNew:
                        attachmentNew = ''
                    content = {}
                    content.update({'msgId': ObjectId().__str__()})
                    content.update({'type': 'email'})
                    content.update(
                        {'countryCode': BEOPDataAccess.getInstance().getCountryCodeByProjId(option.get('projectId'))})
                    if lang == 'zh':
                        content.update({'subject': '您收到一份关于' + title + '的报表'})
                    elif lang == 'en':
                        content.update({'subject': 'Your ' + title + ' is ready'})
                    content.update({'recipients': userInfoList})
                    content.update({'strategy': 'v2'})
                    content.update({'html': html})
                    content.update({
                        'attachments': [{
                            'filename': title,
                            'content_type': 'application/pdf',
                            'data': attachmentNew
                        }]
                    })
                    credentials = pika.PlainCredentials(app.config['MQ_USERNAME'], app.config['MQ_PASSWORD'])
                    connection = pika.BlockingConnection(
                        pika.ConnectionParameters(host=app.config['MQ_ADDRESS'], credentials=credentials))
                    channel = connection.channel()
                    channel.queue_declare(queue='email', durable=True)
                    channel.basic_publish(exchange='',
                                          routing_key='email',
                                          body=str(content),
                                          properties=pika.BasicProperties(
                                              delivery_mode=2,  # make message persistent
                                          ))
                    connection.close()
                    rt = True
        except Exception as e:
            # DiagnosisDataMethods._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
            print('error')
        return rt

    @staticmethod
    def createnewworkflow(userId, verifyUserId, watcherId, workGroupId, strSubject, strContent, nDay):
        rt = False
        try:
            nDay = int(nDay)
            dueDate = (datetime.now() + timedelta(days=nDay)).date().strftime('%Y-%m-%d')
            url = 'http://%s/workflow/transaction/new/' % app.config['BEOPWEB_ADDR']
            post_data = {"title": strSubject, "dueDate": dueDate, "groupId": workGroupId, "critical": "0",
                         "detail": strContent, "collection": "false", "executor[]": [str(userId)],
                         "verifiers[]": [str(verifyUserId)],
                         "watchers[]": [str(watcherId)], "pendingFiles": [], "userId": int(userId)}
            headers = {'content-type': 'application/json', 'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
            res = requests.post(url, data=json.dumps(post_data), headers=headers)
            if res.status_code == 200:
                strJson = res.text
                ret = json.loads(strJson)
                if ret:
                    rt = ret.get('success')
            else:
                DiagnosisDataMethods._logger.writeLog(
                    '%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
        except Exception as e:
            DiagnosisDataMethods._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt


class DataAlarmInfo:
    @staticmethod
    def saveSysMsgSentUserData(projId, uidOrName, nMsgType, nMsgWayType, strName, dictContent, actTime, strLog):
        rt = None
        try:
            rt = mongo_operator.saveSysMsgSentUserData(projId, uidOrName, nMsgType, nMsgWayType
                                                       , strName, dictContent, actTime, strLog)
        except Exception as e:
            DiagnosisDataMethods._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def getLastSysMsgSentUserTime(projId, uIdOrName, nMsgType, nMsgWayType, strName):
        rt = None
        try:
            rt = mongo_operator.getLastSysMsgSentUserTime(projId, uIdOrName, nMsgType, nMsgWayType, strName)
        except Exception as e:
            DiagnosisDataMethods._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @staticmethod
    def get_projInfo_by_id(projId):
        rt = BEOPDataAccess.getInstance().getProjNameCnById(projId)
        return rt
