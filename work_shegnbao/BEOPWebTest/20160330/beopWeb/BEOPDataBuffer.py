__author__ = 'golding'

from math import floor, ceil
import os, sys
from math import floor, ceil
from datetime import datetime,timedelta
import time
import logging
import threading
from beopWeb.BEOPDataAccess import *
from beopWeb.BEOPSqliteAccess import *

class BEOPDataBuffer:
    def __init__(self, projId):
        self._dataRealtime = dict()
        self._lock = threading.Lock()
        self._pointList = []
        self._projectId = None
        self._lastUpdateTime = None

        if projId is None:
            print("error in BEOPDataBuffer::initPointList param : None")
            self._pointList = []
            return

        self._lock = threading.Lock()

        self._projectId =  projId
        s3dbname = BEOPDataAccess.getInstance().getProjS3db(self._projectId)
        self._pointList = BEOPSqliteAccess.getInstance().getPointListFromS3db(s3dbname)

    def setValue(self, pointName, pointValue):
        if self._lock.acquire():
            try:
                self._dataRealtime[pointName] = [datetime.now(), pointValue]
            except Exception as e:
                print(e)
                logging.error(e)
            finally:
                self._lock.release()
        else:
            strError = 'ERROR: wait lock timeout'
            logging.error(strError)
            return False

    def getValue(self, pointName):
        rv = None
        if self._lock.acquire():
            try:
                if pointName in self._dataRealtime.keys():
                    rv = self._dataRealtime[pointName][1]
            except Exception as e:
                print(e)
                logging.error(e)
            finally:
                self._lock.release()
        else:
            strError = 'ERROR: wait lock timeout'
            logging.error(strError)
        return rv

    def getValues(self):
        rv = None
        if self._lock.acquire():
            try:
                rv = self._dataRealtime
            except Exception as e:
                print(e)
                logging.error(e)
            finally:
                self._lock.release()
        else:
            strError = 'ERROR: wait lock timeout'
            logging.error(strError)

        return rv

    def isThirdPartySetValueEnabled(self):
        if 'ThirdPartyWriteEnable' in self._dataRealtime.keys():
            if self._dataRealtime['ThirdPartyWriteEnable'] =='1':
                return True
        return False
