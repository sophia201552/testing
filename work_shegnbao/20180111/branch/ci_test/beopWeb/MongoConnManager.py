__author__ = 'yan'

from beopWeb.BEOPMongoDataAccess import *
from beopWeb import app
import logging
from beopWeb.mod_memcache.RedisManager import RedisManager
from beopWeb.BEOPMySqlDBReadOnlyContainer import BEOPMySqlDBReadOnlyContainer

class MongoConnManager:
    """
    mongo数据库的连接管理类，主要提供生成连接的列表，
    通过项目的ID号获取历史数据库连接以及直接获取配置数据库连接的方法
    """
    #mongo连接的列表，模块的成员
    _connDict = {}
    _mysqlDBContainerReadOnly = BEOPMySqlDBReadOnlyContainer()
    #通过ID获取历史数据的链接
    @staticmethod
    def getHisConn(projId):
        rt = []
        try:
            locateMap = RedisManager.get_project_locate_map()
            if (not locateMap) or (not MongoConnManager._connDict):
                MongoConnManager.GenerateMemcache()
                MongoConnManager.genMongoConnMember()
            if MongoConnManager.useMongoServerOffline():
                configIP = app.config['MONGO_SERVER_HOST']
                MongoConnManager._connDict.get(configIP).setTimeAttrStart(datetime(year=2014, month=1, day=1, hour=0, minute=0, second=0))
                MongoConnManager._connDict.get(configIP).setTimeAttrEnd(datetime(year=2018, month=1, day=1, hour=0, minute=0, second=0))
                rt.append(MongoConnManager._connDict.get(configIP))
            else:
                if locateMap:
                    # useAliPublic = app.config['USE_ALI_PUBLIC']
                    projectLocate = locateMap.get('projectLocate')
                    mongoInstance = locateMap.get('mongoInstance')
                    if projectLocate:
                        locateList = projectLocate.get(str(projId))
#                        if projId == 179:
#                            locateList = [{"end_time": "2017-03-24 18:59:59", "internal_addr": "10.168.154.6:27017", "internet_addr": "120.55.113.116:27017", "mongo_server_id": 1, "start_time": "2014-01-01 00:00:00"},
#                                          {"end_time": "2018-03-23 09:52:40", "internal_addr": "10.30.202.244:27017", "internet_addr": "101.37.90.188:27017", "mongo_server_id": 1, "start_time": "2017-03-24 19:00:00"}]
                        if locateList:
                            for l in locateList:
                                mongo_server_id = l.get('mongo_server_id')
                                clusterName = mongoInstance.get(mongo_server_id, {}).get('clusterName')
                                if app.config.get('BEOPCLUSTER') != clusterName:
                                    addr = l.get('internet_addr') 
                                else:
                                    addr = l.get('internal_addr')
                                is_ssl = True if mongoInstance.get(str(mongo_server_id), {}).get('is_ssl') else False
                                st = l.get('start_time')
                                if isinstance(st, str):
                                    st = datetime.strptime(st, "%Y-%m-%d %H:%M:%S")
                                et = l.get('end_time')
                                if isinstance(et, str):
                                    et = datetime.strptime(et, "%Y-%m-%d %H:%M:%S")
                                if addr not in MongoConnManager._connDict:
                                    MongoConnManager._connDict.update({addr: BEOPMongoDataAccess(addr, is_ssl=is_ssl)})
                                MongoConnManager._connDict.get(addr).setTimeAttrStart(st)
                                MongoConnManager._connDict.get(addr).setTimeAttrEnd(et)
                                rt.append(MongoConnManager._connDict.get(addr))
                        if rt:
                            rt.sort(key=lambda x:x.getTimeAttrStart())
        except Exception as e:
            print('getHisConn failed:%s'%(e.__str__(),))
            logging.error('getHisConn failed:%s'%(e.__str__(),))
        return rt

    #获取配置数据库的链接
    @staticmethod
    def getConfigConn():
        rt = None
        try:
            configIP = ''
            locateMap = RedisManager.get_project_locate_map()
            if not locateMap:
                MongoConnManager.GenerateMemcache()
            if  not MongoConnManager._connDict:
                MongoConnManager.genMongoConnMember()
            # useAliPublic = app.config['USE_ALI_PUBLIC']
            if MongoConnManager.useMongoServerOffline():
                configIP = app.config['MONGO_SERVER_HOST']
            else:
                if app.config.get('BEOPCLUSTER') != 'aliyun_cn':
                    configIP = app.config['INTERNET_CONFIG_ADDR'] 
                else:
                    configIP = app.config['INTERNAL_CONFIG_ADDR']
            rt = MongoConnManager._connDict.get(configIP)
        except Exception as e:
            print('getConfigConn failed:%s'%(e.__str__(),))
            logging.error('getConfigConn failed:%s'%(e.__str__(),))
        return rt

    #是否是本地环境
    @staticmethod
    def useMongoServerOffline():
        rt = app.config.get('MONGO_USE_ONLINE')
        return (not rt) if rt != None else False

    #生成全部数据库链接的列表
    @staticmethod
    def genMongoConnMember():
        try:
            if MongoConnManager.useMongoServerOffline():
                if MongoConnManager._connDict:
                    MongoConnManager._connDict.clear()
                configIP = app.config['MONGO_SERVER_HOST']
                MongoConnManager._connDict.update({configIP:BEOPMongoDataAccess(configIP)})
            else:
                locateMap = RedisManager.get_project_locate_map()
                if locateMap:
                    if MongoConnManager._connDict:
                        MongoConnManager._connDict.clear()
                    addrList = locateMap.get('addrList')
                    for addr in addrList:
                        if isinstance(addr, list):
                            if addr[1]:
                                MongoConnManager._connDict.update({addr[0]:BEOPMongoDataAccess(addr[0], is_ssl=True)})
                            else:
                                MongoConnManager._connDict.update({addr[0]:BEOPMongoDataAccess(addr[0])})
                        elif isinstance(addr, str):
                            MongoConnManager._connDict.update({addr:BEOPMongoDataAccess(addr)})
#                    MongoConnManager._connDict.update({"101.37.90.188:27017": BEOPMongoDataAccess("101.37.90.188:27017")})
        except Exception as e:
            print('genMongoConnMember failed:%s'%(e.__str__(),))
            logging.error('genMongoConnMember failed:%s'%(e.__str__(),))

    @staticmethod
    def UpdateProjectInfo():
        rt = False
        try:
            projectInfoList = []
            dbname = app.config.get('DATABASE')
            q = 'select id, s3dbname, mysqlname, name_en, collectionname, name_cn, name_english, hisdata_structure_v2_from_time from project'
            dbrv = MongoConnManager._mysqlDBContainerReadOnly.op_db_query(dbname, q, ())
            if dbrv == None:
                rt = False
            else:
                for item in dbrv:
                    projectInfoList.append(dict(name_en=item[3], s3dbname=item[1], mysqlname=item[2], id=item[0], collectionname=item[4], name_cn=item[5], name_english=item[6], v2_time=item[7]))
                RedisManager.set_project_info_list(projectInfoList)
            if RedisManager.get_project_info_list():
                rt = True
        except Exception as e:
            print(e.__str__())
            logging.error('UpdateProjectInfo error:' + e.__str__())
        return rt

    @staticmethod
    def UpdateProjectLocateMap():
        try:
            dbname = app.config.get('DATABASE')
            strQInstance = 'SELECT m.mongo_server_id, m.internet_addr, m.internal_addr, m.writable, m.space_used, '\
                           'm.is_default, m.is_ssl, c.clusterName FROM mongo_instance AS m '\
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
                if not projectLocateMap['projectLocate'].get(item[0]):
                    projectLocateMap['projectLocate'][item[0]] = []
                projectLocateMap['projectLocate'][item[0]].append(
                    {'mongo_server_id': item[1], 'internet_addr': mongo_Instance[item[1]].get('internet_addr'),
                     'internal_addr': mongo_Instance[item[1]].get('internal_addr'),
                     'start_time': item[2], 'end_time': item[3]})
                if MongoConnManager.useMongoServerOffline():
                    addrSet.add((app.config['MONGO_SERVER_HOST'], 0))
                else:
                    # if app.config['USE_ALI_PUBLIC']:
                    if app.config.get('BEOPCLUSTER') != mongo_Instance[item[1]].get('clusterName'):
                        addrSet.add((mongo_Instance[item[1]].get('internet_addr'), mongo_Instance[item[1]].get('is_ssl')))
                    else:
                        addrSet.add((mongo_Instance[item[1]].get('internal_addr'), mongo_Instance[item[1]].get('is_ssl')))
            # 配置数据库放到地址列表
            if MongoConnManager.useMongoServerOffline():
                addrSet.add((app.config['MONGO_SERVER_HOST'], 0))
            else:
                # if app.config['USE_ALI_PUBLIC']:
                if app.config.get('BEOPCLUSTER') != 'aliyun_cn':
                    addrSet.add((app.config['INTERNET_CONFIG_ADDR'], 0))
                else:
                    addrSet.add((app.config['INTERNAL_CONFIG_ADDR'], 0))
            projectLocateMap['addrList'] = list(addrSet)
            projectLocateMap['mongoInstance'] = mongo_Instance
            RedisManager.set_project_locate_map(projectLocateMap)
        except Exception as e:
            print(e.__str__())
            logging.error('genMemProjectLocateMap error:' + e.__str__())
        return RedisManager.get_project_locate_map()

    @staticmethod
    def GetCollectionNameById(id):
        projectInfoList = RedisManager.get_project_info_list()
        for item in projectInfoList:
            if item.get('id') == id:
                return item.get('collectionname', '')

    @staticmethod
    def GenerateMemcache():
        MongoConnManager.UpdateProjectInfo()
        MongoConnManager.UpdateProjectLocateMap()

