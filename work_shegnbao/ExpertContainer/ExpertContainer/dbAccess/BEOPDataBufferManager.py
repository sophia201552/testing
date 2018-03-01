__author__ = 'David'

from math import floor, ceil
import os, sys
from datetime import datetime,timedelta
import time, logging, threading
from ExpertContainer.dbAccess.BEOPDataAccess import *
from ExpertContainer.dbAccess.BEOPDataBuffer import *

class BEOPDataBufferManager:
    _dataRealtime = dict()
    __instance = None
    _projectDataList = {}
    _dataBenchmark = []
    def __init__(self):
        pass

    @classmethod
    def getInstance(self):
        if(self.__instance == None):
            self.__instance = BEOPDataBufferManager()
        return self.__instance

    def getData(self, projId, pointList=None):
        #print('getData')
        vList = {}
        pdbuffer = self.getProjectDataBuffer(projId)
        if pdbuffer!=None:
            if pointList is None:
                for k,v in pdbuffer._dataRealtime.items():
                    vList[k] = v[1]
            else:
                for pt in pointList:
                    vList[pt] = (pdbuffer.getValue(pt))
        return vList

    def getProjectDataBuffer(self, projId):
        buf = None
        if not self.getProjNeedUpdated(projId):
            buf = self._projectDataList[projId]
        else:
            projName = BEOPDataAccess.getInstance().getProjNameById(projId)
            if projName != None:
                rv = BEOPDataAccess.getInstance().getInputTable(projName)
                buf = BEOPDataBuffer(projId)
                buf._lastUpdateTime = datetime.now()
                for item in rv:
                    buf._dataRealtime[item[1]] = [item[0], item[2]]
                self._projectDataList[projId] = buf
        return buf

    def getProjNeedUpdated(self, projId):
        if projId not in self._projectDataList.keys():
            return True
        if self._projectDataList[projId]._lastUpdateTime is None:
            return True
        tNow = datetime.now()
        tDelta = tNow - self._projectDataList[projId]._lastUpdateTime
        if tDelta.total_seconds()>180:
            return True
        return False

    def getDataByProjName(self, proj, pointList=None):
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(proj)
        if dbname is None:
            dbname = proj
        rv = BEOPDataAccess.getInstance().getData(dbname, pointList)
        return rv

    def getDataByProj(self, projId, pointList=None):
        if projId is None:
            return 'error: finding project database failed'
        return self.getData(projId, pointList)

    def setMutilDataToBufferTable(self, projName, pointList, valueList, strTimeList, pointTypeFlag):
        rv = ''
        if isinstance(pointList, list) and isinstance(valueList, list):
            try:
                projId = BEOPDataAccess.getInstance().getProjIdByName(projName)
                nPointCount = len(pointList)
                nValueCount = len(valueList)
                nTimeCount = len(strTimeList)
                if nPointCount <= 0 or nPointCount != nValueCount or nValueCount != nTimeCount:
                    return 'failed for count not right'
                if nPointCount != nValueCount:
                    return 'failed'
                rv = BEOPDataAccess.getInstance().updateRealtimeDataBufferMul_by_projid(projId, pointList, valueList,
                                                                                        strTimeList, pointTypeFlag)
            except Exception:
                logging.error('Failed to set mutil data! projName=%s, pointTypeFlag=%s', exc_info=True, stack_info=True)
        else:
            rv = 'setMutilData error:pointList=%s valueList=%s' % (str(pointList), str(valueList))
        return rv

    def setData(self, projName,pointname, updatedValue):
        #print('setData')

        rv = "error: point modification failed."
        projId = BEOPDataAccess.getInstance().getProjIdByName(projName)
        ppBufer = self.getProjectDataBuffer(projId)
        if ppBufer != None:
            pv = ppBufer.getValue(pointname)
            if pv is not None and pv != updatedValue:
                ppBufer.setValue(pointname, updatedValue)
            rowCount = BEOPDataAccess.getInstance().updateRealtimeInputData(projId, pointname,updatedValue )
            if not (rowCount == 'failed'):
                rv = "succeeded sending command for updating point value."
        return rv

    def setDataToSite(self, projEName, pointname, updatedValue):
        #print('setData')
        projId = BEOPDataAccess.getInstance().getProjIdByName(projEName)
        if projId is None:
            rv = "error: projId is None in setDataToSite"
            return rv
        ppBufer = self.getProjectDataBuffer(projId)
        if ppBufer != None:
            pv = ppBufer.getValue(pointname)
            if pv is not None and pv != updatedValue:
                ppBufer.setValue(pointname, updatedValue)

        rowCount = BEOPDataAccess.getInstance().appendOutputToSiteTable(projId, pointname ,updatedValue)
        if rowCount > 0:
            rv = "succeeded sending command for updating point value."
            #appendOperationLog(dbname,pointname,originalValue,updatedValue)
            #appendLog(dbname,pointname,originalValue,updatedValue)
        else:
            rv = "error: point modification failed."
        return rv

    def setMutiData_by_TableName_v2(self, tableName, pointList, valueList, pointTypeFlag, timeStamp, dtuname=""):
        rt = {'state' : 0}
        try:
            nPointCount = len(pointList)
            nValueCount = len(valueList)
            if nPointCount <= 0 or nPointCount != nValueCount:
                rt.update({'state':415, 'message':'The data format error'})
                return rt
            rt = BEOPDataAccess.getInstance().updateRealtimeInputDataMul_by_tableName_v2(tableName, pointList, valueList, pointTypeFlag, timeStamp, dtuname)
        except Exception as e:
            print('setMutiData_by_TableName_v2 error:' + e.__str__())
        return rt
