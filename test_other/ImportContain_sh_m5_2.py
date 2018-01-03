# encoding:utf=8
from pymongo import MongoClient, InsertOne, UpdateOne
import time, logging
from datetime import datetime, timedelta

# server list
serverIp_1 = '120.55.113.116'
serverIp_2 = '120.55.185.72'
serverIp_4 = '120.26.121.79'  # GMRY
serverIp_5 = '101.37.90.188'
serverIp_6 = '101.37.37.192'
serverIp_208 = '192.168.1.208'
serverIp_local = '192.168.1.222'
port_1 = 27021
port_2 = 27018
port_4 = 27024
port_5 = 27025
port_6 = 27026
port_def = 27017

# config fix
g_ipDst = serverIp_local
g_user = 'beopweb'
g_pwd = 'RNB.beop-2013'
g_nPortSrc = port_def
g_nPortDst = port_2

# config set
g_ipSrc = serverIp_2
g_start = datetime(2017, 1, 1)
g_end = datetime(2017, 7, 21)
g_arrTableMerge = ['m5_data_beopdata_shhuawei']
pointname=''

def LogInfo(str, nFlag):
    if 0 == nFlag:
        logging.error(str)
    elif 1 == nFlag:
        logging.info(str)
    elif 2 == nFlag:
        logging.debug(str)
    else:
        logging.error('Log flag error!')

def ImportOperation(start, end, collectionSrc, collectionDst):
    strTmStart = start.strftime('%Y-%m-%d %H:%M')
    strTmEnd = end.strftime('%Y-%m-%d %H:%M')
    strTable = collectionSrc.name
    eachSize = 100000

    try:
        rt = collectionSrc.find({'pointname':'A14AHU_A_24_VFSA','time':{'$gte':start, '$lt':end}})
        if rt is None:
            return

        arrReq = []
        eachCnt = 0
        for item in rt:
            filter = {'_id':item['_id']}
            arrReq.append(UpdateOne(filter, {'$set':item}, True))
            eachCnt += 1
            if eachCnt >= eachSize:
                collectionDst.bulk_write(arrReq)
                strShow = 'Update %s->%s, %d' % (strTmStart, strTmEnd, eachCnt)
                LogInfo(strShow, 1)
                arrReq.clear()
                eachCnt = 0

        if len(arrReq) <= 0:
            return
        collectionDst.bulk_write(arrReq)
        strShow = 'Update %s->%s, %d' % (strTmStart, strTmEnd, eachCnt)
        LogInfo(strShow, 1)
        #print(strShow)
        #time.sleep(1)
    except Exception as e:
        LogInfo('Error, table: %s, %s->%s %s' % (strTable, strTmStart, strTmEnd, e.__str__()), 0)
    return

def ParseConnections(db):
    return db.collection_names()
    #arrTableOrg =[]
    #arrTable = []
    #arrTableOrg = db.collection_names()
    #for i in range(len(arrTableOrg)):
    #    item = arrTableOrg[i]
    #    pre = item[0:3]
    #    if 'm1_' == pre or 'm5_' == pre:
    #        arrTable.append(item)
    #return arrTable

def DeleteArrayElement(arrSrc, strDel):
    for i in range(len(arrSrc)):
        if arrSrc[i] == strDel:
            del arrSrc[i]
            break
    return  arrSrc

def InitLogConfig():
    #logFileName = './ImportLog_%s.txt' % (datetime.now().strftime('%Y%m%d'))
    logFileName = './ImportLog_%s_201707.txt' % (g_arrTableMerge[0])
    logging.basicConfig(filename=logFileName,
                        level=logging.INFO,
                        format='%(asctime)s --- Level:%(levelname)s, Msg: %(message)s',
                        datefmt='[%Y-%m-%d %H:%M:%S]')
    console = logging.StreamHandler()
    console.setLevel(logging.INFO)
    formatter = logging.Formatter('%(levelname)-8s: %(message)s')
    console.setFormatter(formatter)
    logging.getLogger('').addHandler(console)

def EnterOperation():
    if len(g_arrTableMerge) <= 0:
        LogInfo('Table length is zero!', 0)
        return

    InitLogConfig()

    connectionSrc = MongoClient(g_ipSrc, g_nPortSrc)
    dbSrc = connectionSrc['beopdata']
    dbSrc.authenticate(g_user, g_pwd)

    connectionDst = MongoClient(g_ipDst, g_nPortDst)
    dbDst = connectionDst['beopdata']
    #dbDst.authenticate(g_user, g_pwd)

    for i in range(len(g_arrTableMerge)):
        startEx = g_start
        endEx = g_start
        bFlag = False

        tableSrc = g_arrTableMerge[i]
        tableDst = tableSrc
        collectionSrc = dbSrc[tableSrc]
        collectionDst = dbDst[tableDst]
        while True:
            if bFlag:
                break
            endEx = endEx + timedelta(days=1)
            if endEx >= g_end:
                endEx = g_end
                bFlag = True
            ImportOperation(startEx, endEx, collectionSrc, collectionDst)
            startEx = startEx + timedelta(days=1)
            #time.sleep(1)
        time.sleep(2)


# ==>enterance<==
EnterOperation()
