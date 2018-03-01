__author__ = 'yan'

from ExpertContainer.api.utils import *
from ExpertContainer.api.LogOperator import LogOperator
from ExpertContainer.dbAccess import mongo_operator
from ExpertContainer.api.utils import *
from ExpertContainer.api.ArchiveManager import ArchiveManager
from ExpertContainer.dbAccess.ConfigMongoDBAccess import ConfigMongoDBAccess
from ExpertContainer.api.cacheProfile import DataManager
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from ExpertContainer.dbAccess.MongoConnManager import MongoConnManager
from ExpertContainer.api.CalPointManager import CalPointManager
from ExpertContainer.mqAccess.MQManager import MQManager
from ExpertContainer.api.LogOperatorListen import LogOperatorListen
from ExpertContainer.logic.LogicBase import LogicBase
from ExpertContainer.dbAccess.RedisManager import RedisManager
import socket
import traceback
import sys, time, copy, threading
from itertools import zip_longest

_logger = None


class ExportHistoryDataTask:
    def __init__(self, strTaskObjId):
        self.strTaskObjId = strTaskObjId
        self.projId = -1
        self.taskStartTime = None
        self.taskEndTime = None
        self.points = []
        self.format = None
        self.userName = None
        self.flag = None
        self.startTime = None
        self.endTime = None
        self.status = None
        self.progress = 0
        self.stop = 0
        self.file = None
        self.bInited = True


        self.initTask()
        self._logger = LogOperatorListen('exportTask')

    def initTask(self, ):
        taskInfo = RedisManager.hash_get(self.strTaskObjId)
        if taskInfo:
            self.projId = taskInfo.get('projId')
            self.taskStartTime = taskInfo.get('taskStartTime')
            self.taskEndTime = taskInfo.get('taskEndTime')
            self.points = taskInfo.get('points')
            self.format = taskInfo.get('format')
            self.userName = taskInfo.get('userName')
            self.userId = taskInfo.get('userId')
            self.flag = taskInfo.get('flag')
            self.startTime = taskInfo.get('startTime')
            self.endTime = taskInfo.get('endTime')
            self.status = taskInfo.get('status')
            self.progress = taskInfo.get('progress')
            self.stop = taskInfo.get('stop')
            self.file = taskInfo.get('file')
            self.bInited = True
        else:
            self._logger.writeLog('init failed for key not exist(%s, %s)'(self.strProjectId, self.strCalcObjId), True)

    def dealTask(self,):
        projId = None
        try:

            taskId = self.strTaskObjId
            projId = self.projId
            points = self.points
            flag = self.flag
            startTime = self.startTime
            endTime = self.endTime
            format = self.format
            userId = self.userId
            orgnames = []
            name_mapping = {}
            if userId:
                export_points = points if points else []
                orgnames.extend(export_points)
                (realPointList, requestSiteToCloudMaps) = BEOPDataAccess.getInstance().genCloudSiteMap(projId,
                                                                                                       export_points)
                export_points = realPointList
                name_mapping = dict(zip(realPointList, orgnames))
                if not export_points:
                    if flag != -1:
                        export_points = BEOPDataAccess.getInstance().get_point_list_by_flag(projId, flag)
                        orgnames.extend(export_points)
                        (realPointList, requestSiteToCloudMaps) = BEOPDataAccess.getInstance().genCloudSiteMap(projId,
                                                                                                               export_points)
                        name_mapping = dict(zip(realPointList, export_points))
                        export_points = realPointList
                    else:
                        for f in [0,1,2]:
                            temp = BEOPDataAccess.getInstance().get_point_list_by_flag(projId, f)
                            if temp:
                                orgnames.extend(temp)
                                (realPointList, requestSiteToCloudMaps) = BEOPDataAccess.getInstance().genCloudSiteMap(
                                    projId,
                                    temp)
                                name_mapping.update(dict(zip(realPointList, temp)))
                                temp = realPointList
                                export_points.extend(temp)

                #取数据
                startTimeObj = datetime.strptime(startTime, '%Y-%m-%d %H:%M')
                endTimeObj = datetime.strptime(endTime, '%Y-%m-%d %H:%M')
                span = endTimeObj - startTimeObj

                span_seconds = span.total_seconds()
                circle = min(timedelta(hours=1), span)
                if format=='d1':
                    circle = min(timedelta(days=30), span)
                elif format=='h1':
                    circle = min(timedelta(days=1), span)
                connList = MongoConnManager.getHisConnTuple(projId)
                timeObjStartStr = startTime if len(startTime) > 16 else startTime+':00'
                timeobjStr = endTime if len(endTime) > 16 else endTime+':00'
                find_list = BEOPDataAccess.getInstance().analysisHisConnection(connList, timeObjStartStr, timeobjStr)
                find_list = BEOPDataAccess.getInstance().filterConnection(projId, find_list)
                conn = None
                zip_list = []
                for connItem in find_list:
                    conn = connItem.get('conn')
                    flag = connItem.get('flag', 1)
                    if conn:
                        dbname = BEOPDataAccess.getInstance().GetCollectionNameById(int(projId))
                        if dbname:
                            if flag == 2:
                                dbname = app.config['V2FORMAT'] + dbname
                            else:
                                dbname = app.config['M5FORMAT'] + dbname
                            begin_time = startTimeObj
                            cur_begin_time = copy.deepcopy(begin_time)
                            start_time = copy.deepcopy(begin_time)
                            end_time = endTimeObj
                            cur_time = begin_time + circle
                            lte_flag = True if cur_time >= end_time else False
                            prefix = 'new_' if flag == 2 else 'old_'
                            csvFileName = prefix + taskId[-4:]+'_'+startTime.replace('-','').replace(':','').replace(' ','')+\
                                        '_'+endTime.replace('-', '').replace(':', '').replace(' ', '')+'_'+format+'.csv'
                            csvFullPathName = get_current_directory()
                            csvFullPathName = os.path.join(csvFullPathName, 'ExpertContainer')
                            csvFullPathName = os.path.join(csvFullPathName, 'ExportData')
                            if not os.path.exists(csvFullPathName):
                                os.mkdir(csvFullPathName)
                            zipFileName = csvFileName.replace('.csv','.zip')
                            zip_list.append(zipFileName)
                            csvFullPathName = os.path.join(csvFullPathName, csvFileName)
                            if os.path.exists(csvFullPathName):
                                os.remove(csvFullPathName)
                            zipFullPathName = csvFullPathName.replace('.csv','.zip')
                            if os.path.exists(zipFullPathName):
                                time.sleep(2)
                                RedisManager.hash_set(taskId, None, 'progress', 100)
                                time.sleep(2)
                                RedisManager.hash_set(taskId, None, 'status', 1)
                                time.sleep(2)
                                RedisManager.hash_set(taskId, None, 'taskEndTime',
                                                      datetime.now().strftime(standard_time_format))
                                time.sleep(2)
                                raise Exception('file is already exists')
                            RedisManager.hash_set(taskId, None, 'taskStartTime', datetime.now().strftime(standard_time_format))
                            self._logger.writeLog('%s:' % (get_current_func_name()) + 'sonsume start[projId:%s,taskId:%s,startTime:%s,endTime:%s,format:%s,userId:%s, flag:%s]'%\
                                             (projId, taskId, startTime, endTime, format, userId, flag), True)
                            count = 0
                            old = True
                            while (True):
                                stopFlag = RedisManager.hash_get(taskId, 'stop')
                                if stopFlag == None:
                                    stopFlag = 0
                                if stopFlag == 0:
                                    csv_list = []
                                    if len(export_points) > 600:
                                        chunk_list = lambda a_list, n: zip_longest(*[iter(a_list)] * n)
                                        points = list(chunk_list([x for x in export_points], 600))
                                    else:
                                        points = [export_points]
                                    old = True if len(points) == 1 else False
                                    not_found = False
                                    for index, pt in enumerate(points):
                                        if index + 1 == len(points):
                                            pt = filter(lambda x: True if x is not None else False, pt)
                                        pt = list(pt)
                                        csv_name = csvFullPathName[:-4] + "_{}.csv".format(index) if not old else csvFullPathName
                                        csv_list.append(csv_name)
                                        if lte_flag:
                                            cur_end_time = copy.deepcopy(end_time)

                                        else:
                                            cur_end_time = copy.deepcopy(cur_time)
                                        tl, nl, tndict = conn.get_data_str(dbname, pt,
                                                                           cur_begin_time.strftime(
                                                                               standard_time_format),
                                                                           cur_end_time.strftime(standard_time_format),
                                                                           format, lte_flag)
                                        # time.sleep(1)
                                        if tndict and nl and tl:
                                            if count == 0:
                                                data = ['time']
                                                data.extend([name_mapping.get(x) for x in orgnames])
                                                writeHisTupleCSV(csv_name, data)
                                            RedisManager.hash_set(taskId, None, 'file', {'name':zipFileName,'link':os.path.join('/ExportData', zipFileName)})
                                            for t in tl:
                                                data = [t]
                                                for n in pt:
                                                    val = tndict.get((t, n), 'null')
                                                    if '\r' in val:
                                                        val = val.replace('\r','')
                                                    if '\n' in val:
                                                        val = val.replace('\n','')
                                                    if ',' in val:
                                                        val = '"%s"'%(val, )
                                                    data.append(val)
                                                writeHisTupleCSV(csv_name, data)
                                        else:
                                            not_found = True
                                    if not not_found:
                                        count += 1
                                    if int(span_seconds) == 0:
                                        percent = 100
                                    else:
                                        percent = int((cur_time - start_time).total_seconds() / span_seconds * 100)
                                    print('progress is %s'%(percent,))
                                    RedisManager.hash_set(taskId, None, 'progress', percent)
                                    begin_time += circle
                                    cur_begin_time = conn.getNextTimeByFormat(copy.deepcopy(begin_time), format)
                                    if cur_time < end_time:
                                        if cur_time + circle >= end_time:
                                            cur_time = end_time
                                            lte_flag = True
                                        else:
                                            cur_time += circle
                                    else:
                                        if old:
                                            if not os.path.exists(csvFullPathName):
                                                RedisManager.hash_set(taskId, None, 'file', {'name': 'no history data','link': 'null'})
                                        time.sleep(2)
                                        RedisManager.hash_set(taskId, None, 'progress', 100)
                                        time.sleep(2)
                                        RedisManager.hash_set(taskId, None, 'status', 1)
                                        time.sleep(2)
                                        RedisManager.hash_set(taskId, None, 'taskEndTime', datetime.now().strftime(standard_time_format))
                                        self._logger.writeLog('%s:' % (
                                        get_current_func_name()) + 'consume finish[projId:%s,taskId:%s,startTime:%s,endTime:%s,format:%s,userId:%s, flag:%s]' % \
                                                         (projId, taskId, startTime, endTime, format, userId, flag),
                                                         True)
                                        break
                                else:
                                    self._logger.writeLog('%s:' % (
                                    get_current_func_name()) + 'consume stop[projId:%s,taskId:%s,startTime:%s,endTime:%s,format:%s,userId:%s, flag:%s]' % \
                                                     (projId, taskId, startTime, endTime, format, userId, flag), True)
                                    if os.path.exists(csvFullPathName):
                                        os.remove(csvFullPathName)
                                    RedisManager.hash_delete_task(taskId)
                                    break
                            if old:
                                if os.path.exists(csvFullPathName):
                                    if zipFile(csvFullPathName):
                                        os.remove(csvFullPathName)
                                else:
                                    RedisManager.hash_set(taskId, None, 'file', None)
                            else:
                                if zipFileList(csv_list, zipFullPathName):
                                    for x in csv_list:
                                        if os.path.exists(x):
                                            os.remove(x)
                if zip_list:
                    csvFullPathName = get_current_directory()
                    csvFullPathName = os.path.join(csvFullPathName, 'ExpertContainer')
                    csvFullPathName = os.path.join(csvFullPathName, 'ExportData')
                    zipname = "data_seperate_" + taskId[-4:]+'_'+startTime.replace('-','').replace(':','').replace(' ','')+\
                                        '_'+endTime.replace('-', '').replace(':', '').replace(' ', '')+'_'+format+'.zip'
                    zipFull = os.path.join(csvFullPathName, zipname)
                    zip_list = [os.path.join(csvFullPathName, x) for x in zip_list]
                    if zipFileList(zip_list, zipFull):
                        for x in zip_list:
                            if os.path.exists(os.path.join(csvFullPathName, x)):
                                os.remove(os.path.join(csvFullPathName, x))
                        RedisManager.hash_set(taskId, None, 'file',
                                              {'name': zipname, 'link': os.path.join('/ExportData', zipname)})
        except Exception as e:
            self._logger.writeLog('%s:' % (
            get_current_func_name()) + 'consume exception[projId:%s,taskId:%s,startTime:%s,endTime:%s,format:%s,userId:%s, flag:%s]' % \
                                     (projId, taskId, startTime, endTime, format, userId, flag) + '  ' + e.__str__(), True)
            if os.path.exists(csvFullPathName):
                os.remove(csvFullPathName)

        return True


if __name__ == '__main__':
    if len(sys.argv)==2:
        taskobj = ExportHistoryDataTask(sys.argv[1])
        taskobj.dealTask()
    else:
        print('args need be two: projId and exportTaskId')