__author__ = 'golding'

from math import floor, ceil
import os, sys
from math import floor, ceil
from datetime import datetime,timedelta
import time
import logging
import threading
from beopWeb.BEOPDataAccess import BEOPDataAccess
from beopWeb.BEOPSqliteAccess import BEOPSqliteAccess
from beopWeb.BEOPDataBuffer import BEOPDataBuffer
from beopWeb.BEOPMongoDataAccess import BEOPMongoDataAccess

class BEOPDataBufferManager:
    _dataRealtime = dict()
    _lock = threading.Lock()
    __instance = None
    _projectDataList = {}

    def __init__(self):
        pass

    @classmethod
    def getInstance(self):
        if(self.__instance == None):
            self.__instance = BEOPDataBufferManager()
        return self.__instance

    def getData_Old(self, projId, pointList=None):
        #print('getData')
        projName = BEOPDataAccess.getInstance().getProjNameById(projId)


        rv = BEOPDataAccess.getInstance().getInputTable_Old(projName)

        return rv

    def getData(self, projId, pointList=None):
        #print('getData')
        pdbuffer = self.getProjectDataBuffer(projId)

        vList = {}
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

    def setData(self, projName,pointname, updatedValue):
        #print('setData')

        projId = BEOPDataAccess.getInstance().getProjIdByName(projName)
        ppBufer = self.getProjectDataBuffer(projId)
        pv = ppBufer.getValue(pointname)
        if pv is not None and pv != updatedValue:
            ppBufer.setValue(pointname, updatedValue)
        rowCount = BEOPDataAccess.getInstance().updateRealtimeInputData(projId, pointname,updatedValue )
        if not (rowCount == 'failed'):
            rv = "succeeded sending command for updating point value."
        else:
            rv = "error: point modification failed."
        return rv

    #set data to site with dtu received
    def setDataToSite(self, projEName, pointname, updatedValue):
        #print('setData')
        projId = BEOPDataAccess.getInstance().getProjIdByName(projEName)
        if projId is None:
            rv = "error: projId is None in setDataToSite"
            return rv
        ppBufer = self.getProjectDataBuffer(projId)
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

    def getDataByProjName(self, proj, pointList=None):
        print('getDataByProj')
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(proj)
        if dbname is None:
            #return 'error: finding project database failed'
            dbname = proj
        rv = BEOPDataAccess.getInstance().getData(dbname, pointList)
        return rv

    def setDataByProj(self, proj, point, value):
        print('setDataByProj')
        dbname = BEOPDataAccess.getInstance().getProjMysqldb(proj)
        if dbname is None:
            return 'error: finding project database failed'
        return self.setData(dbname, point, value)

    def getHistoryDataByProjname(self, proj, pointName, timeStart, timeEnd, timeFormat):
        #print('getHistoryData')
        projId = BEOPDataAccess.getInstance().getProjIdByName(proj)
        return BEOPDataAccess.getInstance().getHistoryData(projId, pointName, timeStart, timeEnd, timeFormat)

    def getHistoryDataSingleByProjname(self, proj, pointName, time, timeFormat):
        #print('getHistoryData')
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(proj)
        if dbname is None:
            return 'error: finding project database failed'
        return BEOPMongoDataAccess.getInstance().getHistoryDataSingleByFormat(dbname, pointName, time, timeFormat)

    def getDataByProj(self, projId, pointList=None):
        #print('getDataByProj')
        if projId is None:
            return 'error: finding project database failed'
        return self.getData(projId, pointList)

    def setMutilData(self, projName,pointList, valueList):
        #print('setMutilData')
        projId = BEOPDataAccess.getInstance().getProjIdByName(projName)
        nPointCount = len(pointList)
        nValueCount = len(valueList)
        if nPointCount <= 0 or nPointCount!=nValueCount:
            return 'failed for count not right'
        if nPointCount != nValueCount:
            return 'failed'

        ppBufer = self.getProjectDataBuffer(projId)
        for index in range(nPointCount):
            pointname = pointList[index]
            updatedValue = valueList[index]

            pv = ppBufer.getValue(pointname)
            if pv is None or pv != updatedValue:
                ppBufer.setValue(pointname, updatedValue)
        rv = BEOPDataAccess.getInstance().updateRealtimeInputDataMul(projId, pointList, valueList)
        return rv

    def setMutilDataToSite(self, projName,pointnameList, updatedValueList):
        #print('setDatas')
        projId = BEOPDataAccess.getInstance().getProjIdByName(projName)
        ppBufer = self.getProjectDataBuffer(projId)
        nPointCount = len(pointnameList)
        for index in range(nPointCount):
            pointname = pointnameList[index]
            updatedValue = updatedValueList[index]

            pv = ppBufer.getValue(pointname)
            if pv is not None and pv != updatedValue:
                ppBufer.setValue(pointname, updatedValue)

        rowCount = BEOPDataAccess.getInstance().appendMutilOutputToSiteTable(projId,pointnameList, updatedValueList)
        if rowCount > 0:
            rv = "succeeded sending command for updating point value."
            #appendOperationLog(dbname,pointname,originalValue,updatedValue)
            #appendLog(dbname,pointname,originalValue,updatedValue)
        else:
            rv = "error: point modification failed."
        return rv
