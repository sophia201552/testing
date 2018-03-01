# -*- encoding=utf-8 -*-
__author__ = 'yan'

import threading
from ExpertContainer.api.api import HistoryDataMethods, RealtimeDataMethods
from ExpertContainer.api.utils import *
from ExpertContainer.dbAccess import mongo_operator
from ExpertContainer.api.errorLog import errorLog
from ExpertContainer.api.ArchiveManager import ArchiveManager
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
import traceback


class DataManager(object):
    _logger = LogOperator()
    _mem_rtdata = {}

    @classmethod
    def get_realtime_data(cls, projId, pointList):
        rt = {}
        notExistingPointList = []
        rtdata = cls.get_realtime_data_cache(projId)
        if rtdata:
            for point in pointList:
                value = rtdata.get(point)
                if value is not None:
                    rt[point] = value
                else:
                    notExistingPointList.append(point)
        else:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name(),) + '获取项目ID=%s的数据在缓存中不存在' % (projId,), True)

        if len(notExistingPointList) > 0:
            strErrInfo = '获取这些点%s的实时数据失败' % (str(notExistingPointList),)
            raise Exception(strErrInfo)
        return rt

    @classmethod
    def set_realtime_data(cls, projId, pointNameList, pointValueList, flag, strTimeList):
        if RealtimeDataMethods.set_realtime_data(projId, pointNameList, pointValueList, flag, strTimeList):
            rtdata_dic = dict(zip(pointNameList, pointValueList))
            if rtdata_dic:
                cls.set_realtime_data_cache(projId, rtdata_dic)

    @classmethod
    def set_realdata_flag_0(cls, projId):
        needValues = {}
        try:
            logging.debug('读取项目原始数据:getFlag0and1PointTimeValueList 开始')
            needValues = BEOPDataAccess.getInstance().getAllPointTimeValueList(projId)
            logging.debug('读取项目原始数据:getFlag0and1PointTimeValueList 结束')
            if needValues:
                logging.debug('将项目原始数据写入buffer:set_realtime_data 开始')
                orgNameList = []
                orgValueList = []
                orgTimeList = []
                for i in range(len(needValues['flagList'])):
                    if needValues['flagList'][i] == 0:
                        orgNameList.append(needValues['nameList'][i])
                        orgValueList.append(needValues['valueList'][i])
                        orgTimeList.append(needValues['timeList'][i])
                cls.set_realtime_data(projId, orgNameList, orgValueList, 0, orgTimeList)
                logging.debug('将项目原始数据写入buffer:set_realtime_data 结束')
        except Exception:
            logging.error('Failed to set realtime data with flag0 for project %s',
                          projId, exc_info=True, stack_info=True)
        return needValues

    @classmethod
    def set_realdata_all_cache(cls, projId):
        try:
            rtdata = RealtimeDataMethods.get_all_realtime_data(projId)
            if rtdata:
                cls.set_realtime_data_cache(projId, rtdata)
        except Exception as e:
            cls._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)

    @classmethod
    def update_realtime_cache(cls, projId, pointNameList, pointValueList):
        if pointNameList and pointValueList:
            rtdata_dic = dict(zip(pointNameList, pointValueList))
            if rtdata_dic:
                cls.set_realtime_data_cache(projId, rtdata_dic)

    @classmethod
    def set_history_data(cls, data, runMode=1):
        return HistoryDataMethods.set_history_data(data, runMode=runMode)

    @classmethod
    def get_history_data(cls, projId, pointList, timeStart, timeEnd, timeFormat, nearestDays=None):
        return HistoryDataMethods.get_history_data(projId, pointList, timeStart, timeEnd, timeFormat, nearestDays)

    @classmethod
    def set_realtime_data_cache(cls, projId, rt_data_dic):
        # print('set_realtime_data_cache  %s'%(projId,))
        rt = False
        try:
            # with g_lock_update_cache.get(projId):
            rtdata = cls._mem_rtdata.get(projId)
            if rtdata:
                rtdata.update(**rt_data_dic)
            else:
                rtdata = rt_data_dic
            cls._mem_rtdata.update({projId: rtdata})
            rt = True
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @classmethod
    def get_realtime_data_cache(cls, projId):
        rt = {}
        try:
            rt = cls._mem_rtdata.get(projId)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @classmethod
    def updateCache(cls):
        try:
            rt = mongo_operator.get_distinct_projects()
            if rt:
                for projId in rt:
                    projId = int(projId)
                    ArchiveManager.add_group(str(projId))
                    rtdata = RealtimeDataMethods.get_all_realtime_data(projId)
                    if rtdata:
                        cls.set_realtime_data_cache(projId, rtdata)
        except Exception as e:
            cls._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)

    @classmethod
    def updateProjectCache(cls, projId):
        try:
            rtdata = RealtimeDataMethods.get_realtime_data(projId, None)
            if rtdata:
                cls.set_realtime_data_cache(projId, rtdata)
        except Exception as e:
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)

    @classmethod
    def get_projects_info(cls, format):
        return mongo_operator.make_calcpoint_py_file(format)

    @classmethod
    def get_real_values_flag0(cls, projId):
        needValues = {}
        orgNameList = []
        orgValueList = []
        nLoggerLevel = app.config['LOGGING_LEVEL']
        try:
            if nLoggerLevel <= 0:
                cls._logger.writeLog('读取项目原始数据:getFlag0and1PointTimeValueList 开始', True)
            needValues = BEOPDataAccess.getInstance().getAllPointTimeValueList(projId)
            if nLoggerLevel <= 0:
                cls._logger.writeLog('读取项目原始数据:getFlag0and1PointTimeValueList 结束', True)
            if needValues:
                orgNameList = []
                orgValueList = []
                orgTimeList = []
                for i in range(len(needValues['flagList'])):
                    if needValues['flagList'][i] == 0:
                        temp_value = needValues['valueList'][i]
                        if temp_value is not None and temp_value != 'None':
                            try:
                                float_value = float(temp_value)
                            except ValueError:
                                continue
                            orgNameList.append(needValues['nameList'][i])
                            orgValueList.append(float_value)
                            orgTimeList.append(needValues['timeList'][i])
        except Exception as e:
            cls._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return orgNameList, orgValueList

        # DataManager.updateCache()