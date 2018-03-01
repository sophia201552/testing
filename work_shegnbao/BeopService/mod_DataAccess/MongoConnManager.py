from mod_DataAccess.BEOPMongoDataAccess import *
from mainService import app
from mod_DataAccess.RedisManager import RedisManager
from mod_DataAccess.BEOPMySqlDBReadOnlyContainer import BEOPMySqlDBReadOnlyContainer

__author__ = 'mango'


class MongoConnManager:
    """
    mongo数据库的连接管理类，主要提供生成连接的列表，
    通过项目的ID号获取历史数据库连接以及直接获取配置数据库连接的方法
    """
    # mongo连接的列表，模块的成员
    _connDict = {}
    _mysqlDBContainerReadOnly = BEOPMySqlDBReadOnlyContainer()

    @staticmethod
    def _getConnByAddr(addr, **kwargs):
        conn = MongoConnManager._connDict.get(addr)
        if conn is None:
            app.logger.info("Initializing connection to %s with %s...", addr, kwargs)
            is_ssl_arg = kwargs.get("is_ssl", False)
            is_ssl = (is_ssl_arg is True or is_ssl_arg == "1" or is_ssl_arg == 1)
            conn = BEOPMongoDataAccess(addr, is_ssl=is_ssl)
            MongoConnManager._connDict[addr] = conn
        return conn

    # 是否是本地环境
    @staticmethod
    def isLocalEnv():
        rt = app.config.get('MONGO_SERVER_HOST', None)
        return True if rt is not None else False

    # 获取写数据的mongodb连接
    @staticmethod
    def getHisConnWrite(projId, mintime, maxtime):
        rt = (None, None)
        try:
            if MongoConnManager.isLocalEnv():
                rt = MongoConnManager._getConnByAddr(app.config.get('MONGO_SERVER_HOST')), -1
            else:
                locateMap = RedisManager.get_project_locate_map()
                clusterName = app.config.get('BEOPCLUSTER')
                if locateMap:
                    if projId is not None and projId != -1:
                        projectLocate = locateMap.get('projectLocate')
                        mi = locateMap.get('mongoInstance')
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

                                    if st <= mintime <= et and st <= maxtime <= et:
                                        is_ssl = mi.get(str(server_id), {}).get('is_ssl')
                                        conn = MongoConnManager._getConnByAddr(addr, is_ssl=is_ssl)
                                        rt = conn, server_id
                    else:
                        rt = MongoConnManager.get_default_mongo_conn(clusterName)
        except:
            app.logger.error('getHisConnWrite failed!', exc_info=True, stack_info=True)
        return rt

    # 通过ID获取历史数据的链接
    @staticmethod
    def getHisConn(projId):
        rt = []
        default_start_time = datetime(year=2014, month=1, day=1, hour=0, minute=0, second=0)
        default_end_time = datetime(year=2099, month=1, day=1, hour=0, minute=0, second=0)
        try:
            locateMap = RedisManager.get_project_locate_map()
            if not locateMap:
                MongoConnManager.GenerateMemcache()
            if MongoConnManager.useMongoServerOffline():
                configIP = app.config['MONGO_SERVER_HOST']
                conn = MongoConnManager._getConnByAddr(configIP)
                rt.append((conn, default_start_time, default_end_time))
            else:
                if locateMap:
                    cluster_name = app.config.get("BEOPCLUSTER")
                    if projId is not None and projId != -1:
                        projectLocate = locateMap.get('projectLocate')
                        mongoInstance = locateMap.get('mongoInstance')
                        if projectLocate:
                            locateList = projectLocate.get(str(projId))
                            if locateList:
                                for l in locateList:
                                    mongo_server_id = l.get('mongo_server_id')
                                    server_cluster_name = mongoInstance.get(str(mongo_server_id), {}).get('clusterName')
                                    if cluster_name != server_cluster_name or app.config.get('IS_DEV_CONFIG'):
                                        addr = l.get('internet_addr')
                                    else:
                                        addr = l.get('internal_addr')
                                    is_ssl = mongoInstance.get(str(mongo_server_id), {}).get('is_ssl')
                                    st = l.get('start_time')
                                    if isinstance(st, str):
                                        st = datetime.strptime(st, "%Y-%m-%d %H:%M:%S")
                                    et = l.get('end_time')
                                    if isinstance(et, str):
                                        et = datetime.strptime(et, "%Y-%m-%d %H:%M:%S")
                                    conn = MongoConnManager._getConnByAddr(addr, is_ssl=is_ssl)
                                    rt.append((conn, st, et))
                            if rt:
                                rt.sort(key=lambda x: x[1])
                    else:
                        rt = MongoConnManager.get_default_mongo_conn(cluster_name)
        except:
            app.logger.error("Failed to get Mongo hisdata connection!", exc_info=True, stack_info=True)
        return rt

    # 获取配置数据库的链接
    @staticmethod
    def getConfigConn():
        rt = None
        try:
            locateMap = RedisManager.get_project_locate_map()
            if not locateMap:
                MongoConnManager.GenerateMemcache()
            if MongoConnManager.useMongoServerOffline():
                configIP = app.config['MONGO_SERVER_HOST']
            else:
                if app.config.get('BEOPCLUSTER') != 'aliyun_cn' or app.config.get('IS_DEV_CONFIG'):
                    configIP = app.config['INTERNET_CONFIG_ADDR']
                else:
                    configIP = app.config['INTERNAL_CONFIG_ADDR']
            rt = MongoConnManager._getConnByAddr(configIP)
        except:
            app.logger.error("Failed to get Mongo config connection!", exc_info=True, stack_info=True)
        return rt

    # 是否是本地环境
    @staticmethod
    def useMongoServerOffline():
        rt = app.config.get('MONGO_USE_ONLINE')
        return (not rt) if rt is not None else False

    @staticmethod
    def UpdateProjectInfo():
        rt = False
        try:
            projectInfoList = []
            dbname = app.config.get('DATABASE')
            q = 'SELECT id, s3dbname, mysqlname, name_en, collectionname, name_cn, name_english, ' \
                'hisdata_structure_v2_from_time FROM project'
            dbrv = MongoConnManager._mysqlDBContainerReadOnly.op_db_query(dbname, q, ())
            if dbrv is None:
                rt = False
            else:
                for item in dbrv:
                    projectInfoList.append(
                        dict(name_en=item[3], s3dbname=item[1], mysqlname=item[2], id=item[0], collectionname=item[4],
                             name_cn=item[5], name_english=item[6], v2_time=item[7]))
                RedisManager.set_project_info_list(projectInfoList)
            if RedisManager.get_project_info_list():
                rt = True
        except:
            app.logger.error("Failed to update project info!", exc_info=True, stack_info=True)
        return rt

    @staticmethod
    def UpdateProjectLocateMap():
        try:
            dbname = app.config.get('DATABASE')
            strQInstance = 'SELECT m.mongo_server_id, m.internet_addr, m.internal_addr, m.writable, m.space_used, ' \
                           'm.is_default, m.is_ssl, c.clusterName FROM mongo_instance AS m ' \
                           'LEFT JOIN cluster_config as c ON m.cluster_id = c.id'
            dbrvInstance = MongoConnManager._mysqlDBContainerReadOnly.op_db_query(dbname, strQInstance, )
            mongo_Instance = {}
            for item in dbrvInstance:
                mongo_Instance[item[0]] = {'internet_addr': item[1], 'internal_addr': item[2], 'writable': item[3],
                                           'space_used': item[4], 'is_default': item[5], 'is_ssl': int(item[6]),
                                           'clusterName': item[7]}
            projectLocateMap = {'projectLocate': {}}
            strQ = 'select proj_id, mongo_server_id, start_time, end_time from locate_map order by proj_id, start_time'
            dbrv = MongoConnManager._mysqlDBContainerReadOnly.op_db_query(dbname, strQ, )
            # 获取每个项目对应的信息
            addrSet = set()
            for item in dbrv:
                if item[1] in mongo_Instance:
                    if not projectLocateMap['projectLocate'].get(item[0]):
                        projectLocateMap['projectLocate'][item[0]] = []
                    projectLocateMap.get('projectLocate').get(item[0]).append(
                        {'mongo_server_id': item[1], 'internet_addr': mongo_Instance[item[1]].get('internet_addr'),
                         'internal_addr': mongo_Instance[item[1]].get('internal_addr'),
                         'start_time': item[2], 'end_time': item[3]})
                    if MongoConnManager.useMongoServerOffline():
                        addrSet.add((app.config['MONGO_SERVER_HOST'], 0))
                    else:
                        if app.config.get('BEOPCLUSTER') != mongo_Instance[item[1]].get('clusterName') or \
                           app.config.get('IS_DEV_CONFIG'):
                            addrSet.add(
                                (mongo_Instance[item[1]].get('internet_addr'), mongo_Instance[item[1]].get('is_ssl')))
                        else:
                            addrSet.add(
                                (mongo_Instance[item[1]].get('internal_addr'), mongo_Instance[item[1]].get('is_ssl')))
            # 配置数据库放到地址列表
            if MongoConnManager.useMongoServerOffline():
                addrSet.add((app.config['MONGO_SERVER_HOST'], 0))
            else:
                if app.config.get('BEOPCLUSTER') != 'aliyun_cn':
                    addrSet.add((app.config['INTERNET_CONFIG_ADDR'], 0))
                else:
                    addrSet.add((app.config['INTERNAL_CONFIG_ADDR'], 0))
            projectLocateMap['addrList'] = list(addrSet)
            projectLocateMap['mongoInstance'] = mongo_Instance
            RedisManager.set_project_locate_map(projectLocateMap)
        except Exception:
            app.logger.error("Failed to update project locate map!", exc_info=True, stack_info=True)
        rt = RedisManager.get_project_locate_map()
        return rt

    @staticmethod
    def GetCollectionNameById(proj_id):
        projectInfoList = RedisManager.get_project_info_list()
        for item in projectInfoList:
            if item.get('id') == proj_id:
                return item.get('collectionname', '')

    @staticmethod
    def GenerateMemcache():
        MongoConnManager.UpdateProjectInfo()
        MongoConnManager.UpdateProjectLocateMap()

    @staticmethod
    def get_default_mongo_conn(clusterName):
        locateMap = RedisManager.get_project_locate_map()
        mi = locateMap.get('mongoInstance')
        if mi is None:
            return None, None
        # Try to find the default mongo instance in the same cluster
        for key in mi:
            inscont = mi.get(key)
            if inscont and inscont.get('is_default'):
                if inscont.get('clusterName') == clusterName:
                    if app.config.get('IS_DEV_CONFIG'):
                        addr = inscont.get('internet_addr')
                    else:
                        addr = inscont.get('internal_addr')
                    return MongoConnManager._getConnByAddr(addr, is_ssl=inscont.get('is_ssl')),  int(key)
        return None, None
