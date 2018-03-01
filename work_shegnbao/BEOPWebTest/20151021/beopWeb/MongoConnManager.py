__author__ = 'yan'

from beopWeb.BEOPMongoDataAccess import *
from beopWeb import app

class MongoConnManager:

    _connList = []

    @staticmethod
    def getMongoConnByName(locateMap={}, name = '', timeFormat = 'm1', assignAddr = '', localAllowed = app.config['LOCAL_ALLOWED']):
        coonAddrList = []
        for coon in MongoConnManager._connList:
            coonAddrList.append(coon.getHostAddr())
        if locateMap:
            if isinstance(app.config['Condition'], str):
                addrList = locateMap.get('internalAddrList') if not localAllowed else locateMap.get('internetAddrList')
                for ip in list(set(addrList)-set(coonAddrList)):
                    MongoConnManager._connList.append(BEOPMongoDataAccess(ip))
            else:
                if app.config['Condition'] < 2:
                    if app.config['MONGO_SERVER_HOST'] not in coonAddrList:
                        MongoConnManager._connList.append(BEOPMongoDataAccess(app.config['MONGO_SERVER_HOST']))
                else:
                    addrList = locateMap.get('internalAddrList') if not localAllowed else locateMap.get('internetAddrList')
                    for ip in list(set(addrList)-set(coonAddrList)):
                        MongoConnManager._connList.append(BEOPMongoDataAccess(ip))
            # if app.config['Condition'] < 2:
            #     if app.config['MONGO_SERVER_HOST'] not in coonAddrList:
            #         MongoConnManager._connList.append(BEOPMongoDataAccess(app.config['MONGO_SERVER_HOST']))
            # else:
            #     addrList = locateMap.get('internalAddrList') if not localAllowed else locateMap.get('internetAddrList')
            #     for ip in list(set(addrList)-set(coonAddrList)):
            #         MongoConnManager._connList.append(BEOPMongoDataAccess(ip))
        else:
            analysisIP = None
            if isinstance(app.config['Condition'], str):
                analysisIP = '10.173.229.118' if not localAllowed else '121.43.199.208'
            else:
                if app.config['Condition'] < 2:
                    analysisIP = app.config['MONGO_SERVER_HOST']
                else:
                    analysisIP = '10.173.229.118' if not localAllowed else '121.43.199.208'
            # if app.config['Condition'] < 2:
            #     analysisIP = app.config['MONGO_SERVER_HOST']
            # else:
            #     analysisIP = '10.173.229.118' if not localAllowed else '121.43.199.208'
            if analysisIP not in coonAddrList:
                MongoConnManager._connList.append(BEOPMongoDataAccess(analysisIP))

        return MongoConnManager.getMongoCoonByAddr(MongoConnManager.getAddrFromLocateMap(locateMap, name, timeFormat, assignAddr, localAllowed))

    @staticmethod
    def getAddrFromLocateMap(locateMap, name, timeFormat, assignAddr, localAllowed):
        addr = ''
        if isinstance(app.config['Condition'], str):
            convertName = ''
            if 'beopdata_' in name:#��ʷ��
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
            else:#���ñ�
                addr = '10.173.229.118' if not localAllowed else '121.43.199.208'
        else:
            if app.config['Condition'] < 2:
                addr = app.config['MONGO_SERVER_HOST']
            else:
                convertName = ''
                if 'beopdata_' in name:#��ʷ��
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
                else:#���ñ�
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


