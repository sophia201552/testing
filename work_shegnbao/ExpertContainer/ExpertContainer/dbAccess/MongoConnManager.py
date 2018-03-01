__author__ = 'yan'

from ExpertContainer.dbAccess.BEOPMongoDataAccess import *
from ExpertContainer import app
import logging
from ExpertContainer.dbAccess.RedisManager import RedisManager
from ExpertContainer.api.LogOperator import LogOperator


class MongoConnManager:
    """
    mongo数据库的连接管理类，主要提供生成连接的列表，
    通过项目的ID号获取历史数据库连接以及直接获取配置数据库连接的方法
    """
    # mongo连接的列表，模块的成员
    _connDict = {}
    _logger = LogOperator()

    @staticmethod
    def getConnByAddress(addr, ssl=False, replica_set=None, read_preference=None):
        conn = MongoConnManager._connDict.get(addr)
        if conn:
            return conn
        else:
            try:
                conn = BEOPMongoDataAccess(addr, ssl, replica_set=replica_set, read_preference=read_preference)
                MongoConnManager._connDict.update({addr: conn})
            except:
                return None
            return MongoConnManager._connDict.get(addr)

    # 通过ID获取历史数据的链接
    @staticmethod
    def getHisConn(projId):
        rt = []
        try:
            if not MongoConnManager._connDict:
                MongoConnManager.genMongoConnMember()
            locateMap = RedisManager.get(app.config['MEMCACHE_KEY_PREFIX']+ 'projectLocateMap')
            if locateMap:
                projectLocate = locateMap.get('projectLocate')
                mongoInstance = locateMap.get('mongoInstance')
                clusterName = app.config.get('BEOPCLUSTER')
                if projectLocate:
                    locateList = projectLocate.get(str(projId))
                    if locateList:
                        for l in locateList:
                            mongo_server_id = l.get('mongo_server_id')
                            if mongoInstance.get(str(mongo_server_id), {}).get('clusterName') != clusterName:
                                addr = l.get('internet_addr')
                            else:
                                addr = l.get('internal_addr')
                            ssl = True if mongoInstance.get(str(mongo_server_id), {}).get('is_ssl') else False
                            if addr is None:
                                MongoConnManager._logger.writeLog('locateList get addr return None', True)
                                return []
                            conn = MongoConnManager.getConnByAddress(addr, ssl)
                            if conn:
                                st = l.get('start_time')
                                if isinstance(st, str):
                                    st = datetime.strptime(st, "%Y-%m-%d %H:%M:%S")
                                et = l.get('end_time')
                                if isinstance(et, str):
                                    et = datetime.strptime(et, "%Y-%m-%d %H:%M:%S")
                                conn.setTimeAttrStart(st)
                                conn.setTimeAttrEnd(et)
                                rt.append(conn)
                            else:
                                MongoConnManager._logger.writeLog('MongoConnManager._connDict.get(addr:%s) return None:'%(addr), True)
                    else:
                        MongoConnManager._logger.writeLog('getHisConn locateList get None of project:%d, locateMap is not None'%(int(projId)), True)
                    if rt:
                        rt.sort(key=lambda x:x.getTimeAttrStart())
                    if len(rt)==0:
                        MongoConnManager._logger.writeLog('getHisConn conn List is Empty,read locateList is: %s'%(str(locateList)), True)
                else:
                    MongoConnManager._logger.writeLog('getHisConn conn List is Empty', True)
            else:
                MongoConnManager._logger.writeLog('getHisConn projectLocate get is None', True)
        except Exception as e:
            MongoConnManager._logger.writeLog('getHisConn failed:%s'%(e.__str__(),), True)
        return rt

    # 通过ID获取历史数据的链接
    @staticmethod
    def getHisConnTuple(projId):
        rt = []
        try:
            if not MongoConnManager._connDict:
                MongoConnManager.genMongoConnMember()
            locateMap = RedisManager.get(app.config['MEMCACHE_KEY_PREFIX']+ 'projectLocateMap')
            if locateMap:
                projectLocate = locateMap.get('projectLocate')
                mongoInstance = locateMap.get('mongoInstance')
                clusterName = app.config.get('BEOPCLUSTER')
                if projectLocate:
                    locateList = projectLocate.get(str(projId))
                    if locateList:
                        for l in locateList:
                            mongo_server_id = l.get('mongo_server_id')
                            if mongoInstance.get(str(mongo_server_id), {}).get('clusterName') != clusterName \
                                    or app.config.get('IS_DEV_ENV'):
                                addr = l.get('internet_addr')
                            else:
                                addr = l.get('internal_addr')
                            ssl = True if mongoInstance.get(str(mongo_server_id), {}).get('is_ssl') else False
                            if addr is None:
                                MongoConnManager._logger.writeLog('locateList get addr return None', True)
                                return []
                            conn = MongoConnManager.getConnByAddress(addr, ssl)
                            if conn:
                                st = l.get('start_time')
                                if isinstance(st, str):
                                    st = datetime.strptime(st, "%Y-%m-%d %H:%M:%S")
                                et = l.get('end_time')
                                if isinstance(et, str):
                                    et = datetime.strptime(et, "%Y-%m-%d %H:%M:%S")
                                rt.append((conn, st, et))
                            else:
                                MongoConnManager._logger.writeLog(
                                    'MongoConnManager._connDict.get(addr:%s) return None:' % addr, True)
                    else:
                        MongoConnManager._logger.writeLog(
                            'getHisConn locateList get None of project:%d, locateMap is not None' % (int(projId)), True)
                    if rt:
                        rt.sort(key=lambda x: x[1])
                    if len(rt) == 0:
                        MongoConnManager._logger.writeLog(
                            'getHisConn conn List is Empty,read locateList is: %s' % locateList, True)
                else:
                    MongoConnManager._logger.writeLog('getHisConn conn List is Empty', True)
            else:
                MongoConnManager._logger.writeLog('getHisConn projectLocate get is None', True)
        except Exception as e:
            MongoConnManager._logger.writeLog('getHisConn failed:%s' % (e.__str__(),), True)
        return rt

    # 获取写数据的mongodb连接
    @staticmethod
    def getHisConnWrite(projId, mintime, maxtime):
        rt = (None,None)
        try:
            # useAliPublic = app.config['USE_ALI_PUBLIC']
            if not MongoConnManager._connDict:
                MongoConnManager.genMongoConnMember()
            if MongoConnManager.isLocalEnv():
                rt = MongoConnManager.getConnByAddress(app.config.get('MONGO_SERVER_HOST')), -1
            else:
                locateMap = RedisManager.get(app.config['MEMCACHE_KEY_PREFIX']+'projectLocateMap')
                clusterName = app.config.get('BEOPCLUSTER')
                if locateMap:
                    mi = locateMap.get('mongoInstance')
                    if projId:
                        if projId != -1:
                            projectLocate = locateMap.get('projectLocate')
                            if projectLocate:
                                locateList = projectLocate.get(str(projId))
                                if locateList:
                                    for l in locateList:
                                        server_id = l.get('mongo_server_id')
                                        if mi.get(str(server_id), {}).get('clusterName') != clusterName:
                                            addr = l.get('internet_addr') 
                                        else:
                                            addr = l.get('internal_addr')
                                        st = l.get('start_time')
                                        if isinstance(st, str):
                                            st = datetime.strptime(st, "%Y-%m-%d %H:%M:%S")
                                        et = l.get('end_time')
                                        if isinstance(et, str):
                                            et = datetime.strptime(et, "%Y-%m-%d %H:%M:%S")
                                        ssl = True if mi.get(str(server_id), {}).get('is_ssl') else False
                                        if st <= mintime <= et and st <= maxtime <= et:
                                            rt = MongoConnManager.getConnByAddress(addr, ssl), server_id
                        else:
                            if mi:
                                for key in mi:
                                    inscont = mi.get(key)
                                    if inscont:
                                        if inscont.get('is_default'):
                                            ssl = True if inscont.get('is_ssl') else False
                                            if inscont.get('clusterName') != clusterName or app.config.get('IS_DEV_ENV'):
                                                addr = inscont.get('internet_addr') 
                                            else:
                                                addr = inscont.get('internal_addr')
                                            rt = MongoConnManager.getConnByAddress(addr, ssl), key
                    else:
                        if mi:
                            for key in mi:
                                inscont = mi.get(key)
                                if inscont:
                                    if inscont.get('is_default'):
                                        ssl = True if inscont.get('is_ssl') else False
                                        if inscont.get('clusterName') != clusterName or app.config.get('IS_DEV_ENV'):
                                            addr = inscont.get('internet_addr') 
                                        else:
                                            addr = inscont.get('internal_addr')
                                        rt = MongoConnManager.getConnByAddress(addr, ssl), key
        except Exception as e:
            MongoConnManager._logger.writeLog('getHisConnWrite failed:%s'%(e.__str__(),), True)
        return rt

    # 获取配置数据库的链接
    @staticmethod
    def getConfigConn():
        configIP = ''
        try:
            if not MongoConnManager._connDict:
                MongoConnManager.genMongoConnMember()
            # useAliPublic = app.config['USE_ALI_PUBLIC']
            if MongoConnManager.isLocalEnv():
                configIP = app.config['MONGO_SERVER_HOST']
            else:
                if app.config.get('BEOPCLUSTER') != 'aliyun_cn' or app.config.get('IS_DEV_ENV'):
                    configIP = app.config['INTERNET_CONFIG_ADDR'] 
                else:
                    configIP = app.config['INTERNAL_CONFIG_ADDR']
        except Exception as e:
            MongoConnManager._logger.writeLog('getConfigConn failed:%s'%(e.__str__(),), True)
        replica_set = app.config.get("MONGO_CONFIG_REPLICA_SET")
        read_preference = app.config.get("MONGO_CONFIG_READ_PREFERENCE")
        return MongoConnManager.getConnByAddress(configIP, replica_set, read_preference)

    # 是否是本地环境
    @staticmethod
    def isLocalEnv():
        rt = app.config.get('MONGO_SERVER_HOST', None)
        return True if rt != None else False

    #生成全部数据库链接的列表
    @staticmethod
    def genMongoConnMember():
        try:
            locateMap = RedisManager.get(app.config['MEMCACHE_KEY_PREFIX']+'projectLocateMap')
            if locateMap:
                if MongoConnManager._connDict:
                    MongoConnManager._connDict.clear()
                addrList = locateMap.get('addrList')
                for addr in addrList:
                    MongoConnManager._connDict.update({addr[0]:None})
            mongo_local = app.config.get('MONGO_SERVER_HOST', None)
            if mongo_local:
                MongoConnManager._connDict.update({mongo_local:BEOPMongoDataAccess(mongo_local)})
        except Exception as e:
            MongoConnManager._logger.writeLog('genMongoConnMember failed:%s'%(e.__str__(),), True)

    @staticmethod
    def getProjectIdByName(dbname):
        rt = set()
        try:
            projectInfoList = RedisManager.get(app.config['MEMCACHE_KEY_PREFIX']+'projectInfoList')
            for item in projectInfoList:
                mysqlname = item.get('mysqlname')
                id = item .get('id')
                if dbname == mysqlname:
                    rt.add(int(id))
        except Exception as e:
            MongoConnManager._logger.writeLog('getProjectIdByName failed:%s'%(e.__str__(),), True)
        return list(rt) if rt else []

    @staticmethod
    def checkProjectLocate(projectList):
        """ 检查projectList中的projId在locate_map中是否对应一样的server_id """
        last_server_id = None
        try:
            # useAliPublic = app.config['USE_ALI_PUBLIC']
            if not MongoConnManager._connDict:
                MongoConnManager.genMongoConnMember()
            locateMap = RedisManager.get(app.config['MEMCACHE_KEY_PREFIX']+'projectLocateMap')
            if locateMap:
                for projId in projectList:
                    projectLocate = locateMap.get('projectLocate')
                    if projectLocate:
                        locateList = projectLocate.get(str(projId))
                        if locateList:
                            for l in locateList:
                                server_id = l.get('mongo_server_id')
                                if last_server_id:
                                    if server_id != last_server_id:
                                        return projId
                                last_server_id = server_id
        except Exception as e:
            MongoConnManager._logger.writeLog('checkProjectLocate failed:%s'%(e.__str__(),), True)
        return -1


