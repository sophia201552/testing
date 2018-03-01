__author__ = 'golding'

from datetime import datetime
import logging
import threading

from beopWeb.BEOPDataAccess import BEOPDataAccess
from beopWeb.BEOPDataBuffer import BEOPDataBuffer


class BEOPDataBufferManager:
    _dataRealtime = dict()
    _lock = threading.Lock()
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

    def getDataWithDataTime(self, projId, pointList=None):
        vList = {}
        pdbuffer = self.getProjectDataBuffer(projId)
        if pdbuffer:
            if pointList:
                for pt in pointList:
                    vList[pt] = (pdbuffer.getValue(pt))
            else:
                for k, v in pdbuffer._dataRealtime.items():
                    vList[k] = v
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
        if int(projId) == 86:
            if tDelta.total_seconds()>10:
                return True
        else:
            if tDelta.total_seconds()>180:
                return True

        return False

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

    #set data to site with dtu received
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

    def getDataByProj(self, projId, pointList=None):
        #print('getDataByProj')
        if projId is None:
            return 'error: finding project database failed'
        return self.getData(projId, pointList)

    def getDataWithTimeByProj(self, projId, pointList=None):
        if projId:
            return self.getDataWithDataTime(projId, pointList)
        else:
            return 'error: finding project database failed'

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
            if ppBufer != None:
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
            if ppBufer != None:
                pv = ppBufer.getValue(pointname)
                if pv is not None and pv != updatedValue:
                    ppBufer.setValue(pointname, updatedValue)

        rowCount = BEOPDataAccess.getInstance().appendMutilOutputToSiteTable(projId,pointnameList, updatedValueList)
        if rowCount > 0:
            rv = "succeeded sending command for updating point value."
        else:
            rv = "error: point modification failed."
        return rv

    def setMutilDataToSiteById(self, projId,pointnameList, updatedValueList):
        #print('setDatas')
        ppBufer = self.getProjectDataBuffer(projId)
        nPointCount = len(pointnameList)
        for index in range(nPointCount):
            pointname = pointnameList[index]
            updatedValue = updatedValueList[index]
            if ppBufer != None:
                pv = ppBufer.getValue(pointname)
                if pv is not None and pv != updatedValue:
                    ppBufer.setValue(pointname, updatedValue)

        rowCount = BEOPDataAccess.getInstance().appendMutilOutputToSiteTable(projId,pointnameList, updatedValueList)
        if rowCount > 0:
            rv = "succeeded sending command for updating point value."
        else:
            rv = "error: point modification failed."
        return rv


    def setBenchmarkValue(self, projId, pointName, pointValue):
        rt = False
        if self._lock.acquire():
            try:
                bProjExist = False
                arrIndex = -1
                for index, item in enumerate(self._dataBenchmark):
                    if item.get('projId', -1) == projId:
                        bProjExist = True
                        arrIndex = index
                        break
                if bProjExist:
                    self._dataBenchmark[arrIndex][pointName] = pointValue
                else:
                    mapping = dict()
                    mapping[pointName] = pointValue
                    mapping['projId'] = projId
                    self._dataBenchmark.append(mapping)
                rt = True
            except Exception as e:
                print(e)
                logging.error(e)
            finally:
                self._lock.release()
        return rt

    def getBenchmarkValue(self, projId, pointName):
        rt = None
        if self._lock.acquire():
            try:
                for item in self._dataBenchmark:
                    if item.get('projId', -1) == projId:
                        rt = item.get(pointName, '')
                        break
            except Exception as e:
                print(e)
                logging.error(e)
            finally:
                self._lock.release()
        return rt

    def getNeedUpdateBenchmarkTime(self, projId, update=False):
        if update:
            return True
        else:
            bFindProj = False
            for item in self._dataBenchmark:
                if item.get('projId',-1) == projId:
                    bFindProj = True
                    break
            return not bFindProj
        return False

    def getDataByProjBenchmark(self, projectId, arrPoints, update=False):
        rt = {}
        if not self.getNeedUpdateBenchmarkTime(projectId, update):
            for item in self._dataBenchmark:
                if item.get('projId') == projectId:
                    if not update:
                        for pt in arrPoints:
                            rt[pt] = item.get(pt,0.0)
                    break
        else:
            projName = BEOPDataAccess.getInstance().getProjNameById(projectId)
            if projName != None:
                rv = BEOPDataAccess.getInstance().getInputTable(projName)
                for pt in arrPoints:
                    bPointIn = False
                    for item in rv:
                        if item[1] == pt:
                            self.setBenchmarkValue(projectId, pt, item[2])
                            if not update:
                                rt[pt] = item[2]
                            bPointIn = True
                            break
                    if not bPointIn:
                        self.setBenchmarkValue(projectId, pt, None)
                        if not update:
                            rt[pt] = None
        return rt

    def getRealtimeDataDelay(self, projId):
        return BEOPDataAccess.getInstance().getRealtimeDataDelay(projId)
