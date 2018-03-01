# -*- encoding=utf-8 -*-

__author__ = 'golding'

import pymongo
from ExpertContainer.api.utils import *
from datetime import datetime
from ExpertContainer.api.ArchiveManager import ArchiveManager
from threading import Timer
import logging
import traceback

class ErrorLogMongoDataAccess:

    _logger = LogOperator()

    def __init__(self, addr, port):
        try:
            self.hostAddr = addr
            self.hostPort = port
            self.connection = None
            self.db = None
            self.bConnected = False

            self.connection = pymongo.MongoClient(host=self.hostAddr, port=self.hostPort, socketKeepAlive=True)
            self.db = self.connection.beopdata
            bOk = self.db.authenticate('beopweb', 'RNB.beop-2013')
            self._heartbeater = None
            self._heartbeat()
        except Exception as e:
            strMsg = '%s:' % (get_current_func_name()) + e.__str__()
            ErrorLogMongoDataAccess._logger.writeLog(strMsg, True)
        if not bOk:
            ErrorLogMongoDataAccess._logger.writeLog('%s:' % (get_current_func_name()) + 'mongodb authenticate failed', True)
            self.bConnected = False
        else:
            self.bConnected = True

    def __del__(self):
        if self.connection:
            self.connection.close()
        if self._heartbeater is not None:
            self._heartbeater.cancel()

    def _heartbeat(self):
        heartbeat_required = app.config['MONGO_HEARTBEAT_REQUIRED']
        if not heartbeat_required:
            return

        try:
            collection_count = len(self.db.collection_names())
            logging.debug("%s heartbeated with %d collections" % (self.hostAddr, collection_count))
        except:
            logging.error("Failed to heartbeat %s due to error: %s" % (self.hostAddr, traceback.format_exc()))

        try:
            interval = app.config['MONGO_HEARTBEAT_INTERVAL']
            self._heartbeater = Timer(interval, self._heartbeat, [])
            self._heartbeater.start()
        except:
            logging.error("Failed to setup next heartbeat! %s" % traceback.format_exc())

    # added by 'Eric'
    def flush_logData_into_db(self, projId, type=''):
        try:
            if isinstance(projId, int):
                rt = ArchiveManager.read_error_log(projId, type)
                tableName_str = 'ErrorLog'
                if type == 'diag':
                    tableName_str = 'ErrorLog_Diag'
                if rt:
                    self.db[tableName_str].insert_many(rt)
                # if(self.db['ErrorLog'].find_one({"_id":projId}) is  None):
                    # self.db['ErrorLog'].save({"_id":projId})
                # self.db['ErrorLog'].update({"_id":projId},{'$push':{"data":{"errorlog":errorStr,'logtime':datetime.now()}}})              
        except Exception as e:
            ErrorLogMongoDataAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)

    def insertPointLog(self, projId, pointName, strContent):
        try:
            if isinstance(projId, int):
                logList = [{'projId':projId, 'data':strContent, 'logtime': datetime.now(), 'pointName':pointName}]
                self.db['ErrorLog'].insert_many(logList)
        except Exception as e:
            ErrorLogMongoDataAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
            
    

    def get_logData(self, projId, timefrom, timeto):
        '''
        db.teacher.find("$elemMatch":{"students.age":"15","students.hobby":"football"})  
        '''
        rt = []

        try:
            if isinstance(projId, int):
                # temp=self.db['ErrorLog'].find({"_id":200})
                temp = self.db['ErrorLog'].find({"projId":projId, 'logtime':{'$gt':timefrom}, 'logtime':{'$lt':timeto}})
                # temp=self.db['ErrorLog'].find({"data.logtime":{'$gt':timefrom}})
                for rttemp in temp:
                    rt.append(rttemp)
        except Exception as e:
            ErrorLogMongoDataAccess._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt
