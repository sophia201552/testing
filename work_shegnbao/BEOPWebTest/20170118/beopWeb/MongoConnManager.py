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
                    useAliPublic = app.config['USE_ALI_PUBLIC']
                    projectLocate = locateMap.get('projectLocate')
                    if projectLocate:
                        locateList = projectLocate.get(str(projId))
                        if locateList:
                            for l in locateList:
                                addr = l.get('internet_addr') if useAliPublic else l.get('internal_addr')
                                st = l.get('start_time')
                                if isinstance(st, str):
                                    st = datetime.strptime(st, "%Y-%m-%d %H:%M:%S")
                                et = l.get('end_time')
                                if isinstance(et, str):
                                    et = datetime.strptime(et, "%Y-%m-%d %H:%M:%S")
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
            useAliPublic = app.config['USE_ALI_PUBLIC']
            if MongoConnManager.useMongoServerOffline():
                configIP = app.config['MONGO_SERVER_HOST']
            else:
                configIP = app.config['INTERNET_CONFIG_ADDR'] if useAliPublic else app.config['INTERNAL_CONFIG_ADDR']
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
                        MongoConnManager._connDict.update({addr:BEOPMongoDataAccess(addr)})
        except Exception as e:
            print('genMongoConnMember failed:%s'%(e.__str__(),))
            logging.error('genMongoConnMember failed:%s'%(e.__str__(),))

    @staticmethod
    def UpdateProjectInfo():
        rt = False
        try:
            projectInfoList = []
            dbname = app.config.get('DATABASE')
            q = 'select id, s3dbname, mysqlname, name_en, collectionname, name_cn, name_english from project'
            dbrv = MongoConnManager._mysqlDBContainerReadOnly.op_db_query(dbname, q, ())
            if dbrv == None:
                rt = False
            else:
                for item in dbrv:
                    projectInfoList.append(dict(name_en=item[3], s3dbname=item[1], mysqlname=item[2], id=item[0], collectionname=item[4], name_cn=item[5], name_english=item[6]))
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
            strQInstance = 'select mongo_server_id, internet_addr, internal_addr, writable, space_used, is_default from mongo_instance'
            dbrvInstance = MongoConnManager._mysqlDBContainerReadOnly.op_db_query(dbname, strQInstance, )
            mongo_Instance = {}
            for item in dbrvInstance:
                mongo_Instance[item[0]] = {'internet_addr': item[1], 'internal_addr': item[2], 'writable': item[3],
                                           'space_used': item[4], 'is_default': item[5]}
            projectLocateMap = {'projectLocate': {}}
            strQ = 'select proj_id, mongo_server_id, start_time, end_time from locate_map'
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
                    addrSet.add(app.config['MONGO_SERVER_HOST'])
                else:
                    if app.config['USE_ALI_PUBLIC']:
                        addrSet.add(mongo_Instance[item[1]].get('internet_addr'))
                    else:
                        addrSet.add(mongo_Instance[item[1]].get('internal_addr'))
            # 配置数据库放到地址列表
            if MongoConnManager.useMongoServerOffline():
                addrSet.add(app.config['MONGO_SERVER_HOST'])
            else:
                if app.config['USE_ALI_PUBLIC']:
                    addrSet.add(app.config['INTERNET_CONFIG_ADDR'])
                else:
                    addrSet.add(app.config['INTERNAL_CONFIG_ADDR'])
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


