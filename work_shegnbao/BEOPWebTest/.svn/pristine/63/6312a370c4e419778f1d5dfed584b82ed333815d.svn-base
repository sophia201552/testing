__author__ = 'yan'

from beopWeb.BEOPMongoDataAccess import *
from beopWeb import app

class MongoConnManager:

    _connList = []

    @staticmethod
    def getMongoConnByName(locateMap={}, name = '', timeFormat = 'm1', assignAddr = '', localAllowed = app.config['LOCAL_ALLOWED']):
        coonAddrList = []
        #把现有的地址都加入临时列表
        for coon in MongoConnManager._connList:
            coonAddrList.append(coon.getHostAddr())
        if locateMap:#历史数据的查询
            if isinstance(app.config['Condition'], str):#如果是上线的版本
                addrList = locateMap.get('internalAddrList') if not localAllowed else locateMap.get('internetAddrList')#获取从mysql读出来的地址列表
                for ip in list(set(addrList)-set(coonAddrList)):#把新的地址加入到类的对象列表
                    MongoConnManager._connList.append(BEOPMongoDataAccess(ip))#构造mongo操作的对象，并加入到列表
            else:
                if app.config['Condition'] < 2:
                    if app.config['MONGO_SERVER_HOST'] not in coonAddrList:
                        MongoConnManager._connList.append(BEOPMongoDataAccess(app.config['MONGO_SERVER_HOST']))
                else:
                    addrList = locateMap.get('internalAddrList') if not localAllowed else locateMap.get('internetAddrList')
                    for ip in list(set(addrList)-set(coonAddrList)):
                        MongoConnManager._connList.append(BEOPMongoDataAccess(ip))
        else:#配置数据的查询
            analysisIP = None
            if isinstance(app.config['Condition'], str):
                analysisIP = '10.173.229.118' if not localAllowed else '121.43.199.208'
            else:
                if app.config['Condition'] < 2:
                    analysisIP = app.config['MONGO_SERVER_HOST']
                else:
                    analysisIP = '10.173.229.118' if not localAllowed else '121.43.199.208'
            if analysisIP not in coonAddrList:
                MongoConnManager._connList.append(BEOPMongoDataAccess(analysisIP))

        return MongoConnManager.getMongoCoonByAddr(MongoConnManager.getAddrFromLocateMap(locateMap, name, timeFormat, assignAddr, localAllowed))

    @staticmethod
    def getAddrFromLocateMap(locateMap, name, timeFormat, assignAddr, localAllowed):
        addr = ''
        if isinstance(app.config['Condition'], str):
            convertName = ''
            if 'beopdata_' in name:#历史表
                if timeFormat != '':
                    if timeFormat == 'M1':
                        convertName = 'month' + '_data_beopdata_' + name[len('beopdata_'):]
                    else:
                        convertName = timeFormat + '_data_beopdata_' + name[len('beopdata_'):]
                    if len(assignAddr) == 0:
                        key = MongoConnManager.getLocateMapKey(locateMap, convertName)
                        if key:
                            addr = locateMap[key][2] if not localAllowed else locateMap[key][1]
                    else:
                        addr = assignAddr
            else:#配置表
                addr = '10.173.229.118' if not localAllowed else '121.43.199.208'
        else:
            if app.config['Condition'] < 2:
                addr = app.config['MONGO_SERVER_HOST']
            else:
                convertName = ''
                if 'beopdata_' in name:#历史表
                    if timeFormat != '':
                        if timeFormat == 'M1':
                            convertName = 'month' + '_data_beopdata_' + name[len('beopdata_'):]
                        else:
                            convertName = timeFormat + '_data_beopdata_' + name[len('beopdata_'):]
                        if len(assignAddr) == 0:
                            key = MongoConnManager.getLocateMapKey(locateMap, convertName)
                            if key:
                                addr = locateMap[key][2] if not localAllowed else locateMap[key][1]
                        else:
                            addr = assignAddr
                else:#配置表
                    addr = '10.173.229.118' if not localAllowed else '121.43.199.208'
        return addr

    @staticmethod
    def getLocateMapKey(locateMap, collectionName):
        timeNow = datetime.now()
        keyList = locateMap['keyList']
        for key in keyList:
            cn = key[0]
            st = datetime.strptime(key[1], '%Y-%m-%d %H:%M:%S') if key[1] else None
            et = datetime.strptime(key[2], '%Y-%m-%d %H:%M:%S') if key[2] else None
            if collectionName==cn:
                if st == None and et == None:
                    return key
                elif timeNow>=st and timeNow<=et:
                        return key
        return None

    @staticmethod
    def getMongoCoonByAddr(addr):
        for item in MongoConnManager._connList:
            if item.getHostAddr() == addr:
                return item
        return None


