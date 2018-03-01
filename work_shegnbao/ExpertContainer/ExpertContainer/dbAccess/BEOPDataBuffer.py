__author__ = 'David'

from math import floor, ceil
from datetime import datetime
import os, sys, time, logging, threading
from ExpertContainer.dbAccess.BEOPDataAccess import *
from ExpertContainer.api.LogOperator import LogOperator

class BEOPDataBuffer:

    _logger = LogOperator()

    def __init__(self, projId):
        self._dataRealtime = dict()
        self._lock = threading.Lock()
        self._pointList = []
        self._projectId = None
        self._lastUpdateTime = None

        if projId is None:
            self._pointList = []
            return

        self._lock = threading.Lock()

        self._projectId =  projId
        s3dbname = BEOPDataAccess.getInstance().getProjS3db(self._projectId)

    def setValue(self, pointName, pointValue):
        if self._lock.acquire():
            try:
                self._dataRealtime[pointName] = [datetime.now(), pointValue]
            except Exception as e:
                strErr = "setValue error:%s, pointName:%s, pointValue:%s"%(e.__str__(), pointName, pointValue)

                BEOPDataBuffer._logger.writeLog(strErr, True)
            finally:
                self._lock.release()
        else:
            strError = 'ERROR: wait lock timeout'
            BEOPDataBuffer._logger.writeLog(strError, True)
            return False

    def getValue(self, pointName):
        rv = None
        if self._lock.acquire():
            try:
                if pointName in self._dataRealtime.keys():
                    rv = self._dataRealtime[pointName][1]
            except Exception as e:
                strErr = "getValue error:%s, pointName:%s"%(e.__str__(), pointName)
                BEOPDataBuffer._logger.writeLog(strErr)
            finally:
                self._lock.release()
        else:
            strError = 'ERROR: wait lock timeout'
            BEOPDataBuffer._logger.writeLog(strError, True)
        return rv

    def getValues(self):
        rv = None
        if self._lock.acquire():
            try:
                rv = self._dataRealtime
            except Exception as e:
                strErr = "getValue error:%s"%(e.__str__(),)
                BEOPDataBuffer._logger.writeLog(strErr)
            finally:
                self._lock.release()
        else:
            strError = 'ERROR: wait lock timeout'
            BEOPDataBuffer._logger.writeLog(strError, True)

        return rv

    def isThirdPartySetValueEnabled(self):
        if 'ThirdPartyWriteEnable' in self._dataRealtime.keys():
            if self._dataRealtime['ThirdPartyWriteEnable'] =='1':
                return True
        return False