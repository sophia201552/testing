#-*- encoding=utf-8 -*-

__author__ = 'yan'

import socket, pika
import traceback
import sys, time, copy, threading
from datetime import datetime
from flask import json
from ExpertContainer.dbAccess.BEOPDataBufferManager import BEOPDataBufferManager
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from ExpertContainer.dbAccess.RedisManager import RedisManager
from ExpertContainer.dbAccess.MongoConnManager import MongoConnManager
from ExpertContainer import app
from ExpertContainer.api.LogOperatorListen import LogOperatorListen
from ExpertContainer.api.views import triggerOneCalculation

_logger = None
strProcessName = 'updateThirdDataRealAndHistory'

def checkOnOffLine_router():
    try:
        while True:
            t_now = datetime.now()
            dbins = BEOPDataAccess.getInstance()
            dtu_proj = dbins.get_third_dtu_project()
            ids = [x for x in dtu_proj]
            info = dbins.get_third_dtu_info(ids)
            for item in info:
                id = item.get('id')
                online = item.get('online')
                #LastOnlineTime = item.get('LastOnlineTime')
                LastReceivedTime = item.get('LastReceivedTime')
                #objLastOnlineTime = datetime.strptime(LastOnlineTime, '%Y-%m-%d %H:%M:%S')
                objLastReceivedTime = datetime.strptime(LastReceivedTime, '%Y-%m-%d %H:%M:%S')
                if (t_now - objLastReceivedTime).total_seconds() > 30*60:
                    if online == 'Online':
                        dbins.insert_into_dtuserver_on_off_line(t_now.strftime('%Y-%m-%d %H:%M:%S'),
                                                                dtu_proj.get(id), 0)
                    dbins.update_dtuserver_prj_info_offline(id, t_now.strftime('%Y-%m-%d %H:%M:%S'))
            time.sleep(60)
    except Exception as e:
        print(e)

def sync_data_to_mongodb_by_tbname(dbName, timeAt, hisdata):
    cn = None
    projId = None
    length = 0
    try:
        if dbName:
            projId = BEOPDataAccess.getInstance().getProjIdBydbName(dbName)
            if projId < 0:
                print('sync_data_to_mongodb_by_tbname warning:mysqlname=%s is not in project'%(dbName, ))
            mintimeObj = timeAt
            maxtimeObj = timeAt
            if hisdata:
                conn, server_id = MongoConnManager.getHisConnWrite(projId, mintimeObj, maxtimeObj)
                if not conn:
                    raise Exception('conn is none, mysqlname=%s, projId=%s'%(dbName, projId))
                if not server_id:
                    raise Exception('server_id is none, mysqlname=%s, projId=%s' % (dbName, projId))
                strCollectionName = ''
                if projId < 0:
                    strCollectionName = dbName
                else:
                    strCollectionName = BEOPDataAccess.getInstance().GetCollectionNameById(int(projId))
                cn = 'm5_data_{0}'.format(strCollectionName)
                if MongoConnManager.isLocalEnv():
                    length = conn.InsertTableData(projId, hisdata, cn)
                    print('save hisdata into %s, num=%d'%(cn, length))
                else:
                    if conn and server_id:
                        plm = RedisManager.get_project_locate_map()
                        if plm:
                            mi = plm.get('mongoInstance')
                            if mi:
                                serverInfo = mi.get(str(server_id))
                                if serverInfo:
                                    if serverInfo.get('writable'):
                                        length = conn.InsertTableData(projId, hisdata, cn)
                                        print('save hisdata into %s, num=%d'%(cn, length))
                                else:
                                    raise Exception('serverInfo in mongoInstance is none')
                            else:
                                raise Exception('mongoInstance in memcache is none')
                        else:
                            raise Exception('projectLocateMap in memcache is none')
    except Exception as e:
        _logger.writeLog('sync_data_to_mongodb_by_tbname failed:'+e.__str__(), True)
    return length





def callback(ch, method, properties, body):
    try:
        msgb = body.decode(encoding='utf-8')
        msg = json.loads(msgb)
        cunsume_result = True
        if msg:
            if msg.get('remark') == 'updateThirdDataRealAndHistory':
                tbname = msg.get('tbName')
                time = msg.get('time')
                point_name_list = msg.get('pointNameList')
                point_value_list = msg.get('pointValueList')
                length = msg.get('length')
                source = msg.get('source')#todo
                type = msg.get('type')
                timeobj = datetime.strptime(time, '%Y-%m-%d %H:%M:%S')
                projId = BEOPDataAccess.getInstance().getProjIdByRTTableName('rtdata_'+tbname)
                BEOPDataAccess.getInstance().createTableIfNotExist('rtdata_'+tbname)
                if type == 0:#实时历史
                    rt = BEOPDataBufferManager.getInstance().setMutiData_by_TableName_v2('rtdata_'+tbname, point_name_list, point_value_list, 0, time)

                    if projId is not None:
                        triggerOneCalculation(projId, None, False)
                    if rt:
                        if rt.get('state') != 1 or rt.get('length') != length:
                            raise Exception('save into rtdata failed')
                    hisdata = []
                    for index in range(length):
                        hisdata.append((time, point_name_list[index], point_value_list[index]))
                    if hisdata:
                        sync_data_to_mongodb_by_tbname(tbname, timeobj, hisdata)
                elif type == 1:#实时
                    rt = BEOPDataBufferManager.getInstance().setMutiData_by_TableName_v2('rtdata_'+tbname, point_name_list, point_value_list, 0, time)
                    if projId is not None:
                        triggerOneCalculation(projId, None, False)
                    if rt:
                        if rt.get('state') != 1 or rt.get('length') != length:
                            raise Exception('save into rtdata failed')
                elif type == 2:#历史
                    hisdata = []
                    for index in range(length):
                        hisdata.append((time, point_name_list[index], point_value_list[index]))
                    if hisdata:
                        sync_data_to_mongodb_by_tbname(tbname, timeobj, hisdata)
                else:
                    raise Exception('invalid type')
            elif msg.get('remark') == 'updateThirdData':
                dtuName = msg.get('dtuName')
                time = msg.get('time')
                type = msg.get('type')
                pointNameList = msg.get('pointNameList')
                pointValueList = msg.get('pointValueList')
                length = msg.get('length')
                source = msg.get('source')#todo
                timeobj = datetime.strptime(time, '%Y-%m-%d %H:%M:%S')
                id, dbName, newCreate = BEOPDataAccess.getInstance().get_id_dbname_by_dtuname(dtuName)
                projId = BEOPDataAccess.getInstance().getProjIdByRTTableName('rtdata_' + dbName)
                dtu_proj = BEOPDataAccess.getInstance().get_third_dtu_project()
                BEOPDataAccess.getInstance().createTableIfNotExist('rtdata_'+dbName)
                fields = BEOPDataAccess.getInstance().getTableFields('rtdata_'+dbName)
                if 'dtuname' not in fields:
                    BEOPDataAccess.getInstance().AddFieldDTUName('rtdata_'+dbName)
                if newCreate:
                    BEOPDataAccess.getInstance().insert_into_dtuserver_on_off_line(datetime.now().strftime('%Y-%m-%d %H:%M:%S'),dtu_proj.get(id), 1)
                else:
                    ids = [x for x in dtu_proj]
                    info = BEOPDataAccess.getInstance().get_third_dtu_info(ids)
                    for item in info:
                        if item.get('id') == id:
                            if item.get('online') == 'Offline':
                                BEOPDataAccess.getInstance().insert_into_dtuserver_on_off_line(datetime.now().strftime('%Y-%m-%d %H:%M:%S'),dtu_proj.get(id), 1)
                            break
                BEOPDataAccess.getInstance().update_dtuserver_prj_info_online(id, datetime.now().strftime('%Y-%m-%d %H:%M:%S'), length)
                if type == 0:#实时历史
                    rt = BEOPDataBufferManager.getInstance().setMutiData_by_TableName_v2('rtdata_'+dbName, pointNameList, pointValueList, 0, time, dtuName)
                    if projId is not None:
                        triggerOneCalculation(projId, None, False)
                    if rt:
                        if rt.get('state') != 1 or rt.get('length') != length:
                            raise Exception('save into rtdata failed')
                    hisdata = []
                    for index in range(length):
                        hisdata.append((time, pointNameList[index], pointValueList[index]))
                    if hisdata:
                        sync_data_to_mongodb_by_tbname(dbName, timeobj, hisdata)
                elif type == 1:#实时
                    rt = BEOPDataBufferManager.getInstance().setMutiData_by_TableName_v2('rtdata_'+dbName, pointNameList, pointValueList, 0, time, dtuName)
                    if projId is not None:
                        triggerOneCalculation(projId, None, False)
                    if rt:
                        if rt.get('state') != 1 or rt.get('length') != length:
                            raise Exception('save into rtdata failed')
                elif type == 2:#历史
                    hisdata = []
                    for index in range(length):
                        hisdata.append((time, pointNameList[index], pointValueList[index]))
                    if hisdata:
                        sync_data_to_mongodb_by_tbname(dbName, timeobj, hisdata)
                else:
                    raise Exception('invalid type')
    except Exception as e:
        errmsg = 'updateThirdDataRealAndHistory consume exception:'+str(e)
        _logger.writeLog(errmsg, True)
        cunsume_result = False
        ch.basic_nack(delivery_tag=method.delivery_tag)
    finally:
        if cunsume_result:
            ch.basic_ack(delivery_tag = method.delivery_tag)
    return True

def runConsume():
    try:
        print('%s:'%('runConsume')+'updateThirdDataRealAndHistory listen start')
        credentials = pika.PlainCredentials(app.config['MQ_USERNAME'],app.config['MQ_PASSWORD'])
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=app.config['MQ_ADDRESS'],credentials = credentials))
        channel = connection.channel()
        queue_name = 'updateThirdDataRealAndHistory' if app.config['BEOPCLUSTER'] != 'development_unittest' else 'test_updateThirdDataRealAndHistory'
        channel.queue_declare(queue=queue_name, durable=True)

        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(callback, queue=queue_name)
        channel.start_consuming()
    except Exception as e:
        errmsg = 'updateThirdDataRealAndHistory runConsume except occurs, quit:' + str(e)
        _logger.writeLog(errmsg, True)
        exit(0)

if __name__ == '__main__':
    strProcessName = sys.argv[1] if len(sys.argv)>1 else 'updateThirdDataRealAndHistory_1'
    if strProcessName == 'test':
        strProcessName = 'updateThirdDataRealAndHistory-test'
    myname = socket.getfqdn(socket.gethostname())
    _logger = LogOperatorListen(strProcessName + '_' + myname)
    t = threading.Thread(target=checkOnOffLine_router, name='checkOnOffLineStatus', daemon=True)
    t.start()
    runConsume()
