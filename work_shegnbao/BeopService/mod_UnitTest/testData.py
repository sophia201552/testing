__author__ = 'rdg'

from flask import request,json
import requests
import logging
from mod_DataAccess.MongoConnManager import *
from datetime import datetime
import random
from mod_DataAccess.RedisManager import RedisManager

def testInsertManyIntoMongodb():
    try:
        bSuccess = False
        oneInsertData = dict(timeFormat = "m5",projId = 72,pointName = "testforservice01",pointValue = "88.0",timeAt =  "2015-12-15 09:00:00")
        oneInsertData2 = dict(timeFormat = "m5",projId = 72,pointName = "testforservice02",pointValue = "98.0",timeAt =  "2015-12-15 09:00:00")
        dataPost = dict(setList = [oneInsertData, oneInsertData2])
        headers = {'content-type': 'application/json'}
        r = requests.post('http://localhost:5000/save/setHistoryDataMul', data=json.dumps(dataPost), headers=headers)
        rvData = json.loads(r.content)
        bSuccess = (rvData[0]['result']=='success')
    except Exception as e:
        strErr = "testInsertManyIntoMongodb error:%s"%(e.__str__(), )
        print(strErr)
        app.logger.error(strErr)
        bSuccess = False

    return bSuccess


def testAllCases():
    rv = []
    if not testInsertManyIntoMongodb():
        rv.append('testInsertManyIntoMongodb failed')

    return rv

def interface_sync_data_to_mongodb_test(mysqlname, mintime, maxtime, timeformat, insertdata):
    rt = "interface is ok"
    try:
        headers = {'content-type': 'application/json'}
        post_data = {}
        post_data.update({'dbname':mysqlname,
                          'timeformat':timeformat,
                          'mintime':mintime,
                          'maxtime':maxtime,
                          'hisdata':insertdata
                          })
        #插入测试数据
        r = requests.post('http://localhost:5000/sync_data_to_mongodb', data=json.dumps(post_data), headers=headers)
        rvData = json.loads(r.content)
        if rvData and rvData.get('error') == 'ok':
            idList = MongoConnManager.getProjectIdByName(mysqlname)
            projectId = MongoConnManager.checkProjectLocate(idList)
            if projectId > 0:
                return "locate_map error:id is %s"%(projectId,)
            projectId = random.choice(idList)
            conn, server_id = MongoConnManager.getHisConnWrite(projectId, datetime.strptime(mintime, '%Y-%m-%d %H:%M:%S'), datetime.strptime(maxtime, '%Y-%m-%d %H:%M:%S'))
            if conn and isinstance(server_id, int):
                cn = '{0}_data_{1}'.format(timeformat, mysqlname)
                plm = RedisManager.get_project_locate_map()
                if plm:
                    mi = plm.get('mongoInstance')
                    if mi:
                        serverInfo = mi.get(server_id)
                        if serverInfo:
                            if serverInfo.get('writable'):
                                ptList = [x[1] for x in insertdata]
                                #把插入的读出来看看
                                ret = conn.getHistoryDataByFormat(mysqlname, ptList, mintime, maxtime, timeformat)
                                ret = [x.get('pointname') for x in ret]
                                for pt in ptList:
                                    if pt not in ret:
                                        return "%s can not be found"%(pt,)
                                #读完就删除掉
                                if not conn.deletePoints(cn, ptList, mintime, maxtime):
                                    return "delete test data failed"
                            else:
                                'server_id=%s is readonly'%(server_id,)
                    else:
                        return 'mongoInstance in memcache is none'
                else:
                    return 'projectLocateMap in memcache is none'
        else:
            return "failed to insert test data"
    except Exception as e:
        print(e)
        app.logger.error(e.__str__())
    return rt