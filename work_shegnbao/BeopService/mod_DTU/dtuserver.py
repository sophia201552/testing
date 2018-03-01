__author__ = 'yan'

from mod_DTU import bp_dtu
import json, threading
from flask import request, jsonify

from mod_DataAccess.BEOPDataAccess import *
from mod_DataAccess.BEOPMongoDataAccess import *
from mod_DataAccess.BEOPDataBufferManager import *
import logging
from mainService.DataServer import triggerOneCalculation
from mod_MsgQueue import mqServer

def sync_data_to_mongodb(dtuName, timeAt, hisdata, timeformat):
    logging.info('dtuName=%s, timeAt=%s', dtuName, timeAt)
    cn = None
    projId = None
    length = 0
    timeformat = 'm5' #ignore other
    try:
        if dtuName:
            projId = BEOPDataAccess.getInstance().getProjIdByDTUName(dtuName)
            if projId <0:
                strError = 'sync_data_to_mongodb error: getProjIdByDTUName of %s return wrong projId:%d'%(dtuName, projId)
                print(strError)
                app.logger.error(strError)
            mintimeObj = timeAt
            maxtimeObj = timeAt
            if hisdata:
                conn, server_id = MongoConnManager.getHisConnWrite(projId, mintimeObj, maxtimeObj)
                if not conn:
                    strError = 'sync_data_to_mongodb error:conn is none, dtuname="%s", projId="%s"'%(dtuName, projId)
                    print(strError)
                    app.logger.error(strError)
                if not server_id:
                    strError = 'sync_data_to_mongodb error:server_id is none, dtuname="%s", projId="%s"'%(dtuName, projId)
                    print(strError)
                    app.logger.error(strError)
                strCollectionName = ''
                if not projId:
                    strCollectionName = 'beopdata_' + dtuName
                else:
                    strCollectionName = BEOPDataAccess.getInstance().GetCollectionNameById(int(projId))
                if not strCollectionName:
                    strCollectionName = 'beopdata_' + dtuName
                cn = '{0}_data_{1}'.format(timeformat, strCollectionName)
                strTableNameV2 = 'v2_data_{0}'.format(strCollectionName)
                if MongoConnManager.isLocalEnv():
                    length = conn.InsertTableData(projId, hisdata, cn)

                    print('save hisdata into %s, projId:%d, num=%d'%(cn, projId, length))
                else:
                    if conn and isinstance(server_id, int):
                        plm = RedisManager.get_project_locate_map()
                        if plm:
                            mi = plm.get('mongoInstance')
                            if mi:
                                serverInfo = mi.get(str(server_id))
                                if serverInfo:
                                    if serverInfo.get('writable'):
                                        length = conn.InsertTableData(projId, hisdata, cn)
                                        # nLength2 = conn.updateHistoryDataMultiEx(hisdata, strTableNameV2)

                                        print('save hisdata into %s, projId:%d, num=%d'%(cn, projId, length))
                                else:
                                    strError = 'sync_data_to_mongodb error:serverInfo in mongoInstance is none'
                                    print(strError)
                                    app.logger.error(strError)
                            else:
                                strError = 'sync_data_to_mongodb error:mongoInstance in memcache is none'
                                print(strError)
                                app.logger.error(strError)
                        else:
                            strError = 'sync_data_to_mongodb error:projectLocateMap in memcache is none'
                            print(strError)
                            app.logger.error(strError)
    except Exception as e:
        logging.error('Failed to sync data to mongo!', stack_info=True, exc_info=True)
    return length

@bp_dtu.route('/recvDataZipFile', methods=['POST'])
def recvDataZipFile():
    rt = {'message':'ok', 'status':1}
    data = request.get_json()
    if data:
        try:
            dtuName = data.get('dtuName', '')
            protocol = data.get('protocol', '')#'beop', 'huawei', 'powerlink', 'unknown', ...
            pointNameList = data.get('pointNameList', [])
            pointValueList = data.get('pointValueList', [])
            RawDataList = bytes((data.get('RawDataList', [])).encode())
            fileName = data.get('fileName', '')#databackup_201507221450
            nStoreType = data.get('nStoreType', 0)#Ĭ�� 0:ʵʱ����ʷ 1��ʵʱ 2����ʷ
            nStoreType = int(nStoreType)
            length = int(data.get('length', 0))#��ĸ���
            if not dtuName:
                print('recvDataZipFile failed:dtuName is null')
                app.logger.error('recvDataZipFile failed:dtuName is null')
                rt = {'message':'dtuName is null', 'status':0}
                return json.dumps(rt, ensure_ascii=False)
            else:
                if protocol.lower() == 'beop':
                    if not pointNameList:
                        print('recvDataZipFile failed:pointNameList is null')
                        app.logger.error('recvDataZipFile failed:pointNameList is null')
                        rt = {'message':'pointNameList is null', 'status':0}
                        return json.dumps(rt, ensure_ascii=False)
                    if not pointValueList:
                        print('recvDataZipFile failed:pointValueList is null')
                        app.logger.error('recvDataZipFile failed:pointValueList is null')
                        rt = {'message':'pointValueList is null', 'status':0}
                        return json.dumps(rt, ensure_ascii=False)
                    if not RawDataList:
                        print('recvDataZipFile failed:RawDataList is null')
                        app.logger.error('recvDataZipFile failed:RawDataList is null')
                        rt = {'message':'RawDataList is null', 'status':0}
                        return json.dumps(rt, ensure_ascii=False)
                    if not fileName:
                        print('recvDataZipFile failed:fileName is null')
                        app.logger.error('recvDataZipFile failed:fileName is null')
                        rt = {'message':'fileName is null', 'status':0}
                        return json.dumps(rt, ensure_ascii=False)
                    if not length:
                        print('recvDataZipFile failed:length is null')
                        app.logger.error('recvDataZipFile failed:length is null')
                        rt = {'message':'length is null', 'status':0}
                        return json.dumps(rt, ensure_ascii=False)
                    if not (nStoreType in [0,1,2]):
                        print('recvDataZipFile failed:nStoreType is invalid')
                        app.logger.error('recvDataZipFile failed:nStoreType is invalid')
                        rt = {'message':'nStoreType is invalid', 'status':0}
                        return json.dumps(rt, ensure_ascii=False)
                    dbname = ''
                    try:
                        dbname = BEOPDataAccess.getInstance().get_dbname_by_dtuname(dtuName)
                    except Exception as e:
                        print('_mysql_access.get_dbname_by_dtuname:'+e.__str__())
                        app.logger.error('_mysql_access.get_dbname_by_dtuname:'+e.__str__())
                    rt_dbname = 'rtdata_beopdata_' + dtuName
                    if not BEOPDataAccess.getInstance().createRTTableIfNotExist(rt_dbname):
                        rt = {'message':'failed to create rttable %s'%(rt_dbname,), 'status':0}
                        return json.dumps(rt, ensure_ascii=False)
                    try:
                        timestring = fileName[fileName.find('_')+1:]
                        year = int(timestring[0:4])
                        month = int(timestring[4:6])
                        day = int(timestring[6:8])
                        hour = int(timestring[8:10])
                        minute = int(timestring[10:])
                        rawtime = datetime(year=year, month=month, day=day, hour=hour, minute=minute)
                        strrawtime = rawtime.strftime('%Y-%m-%d %H:%M:%S')
                        formatList = ['m1']
                        if minute % 5 == 0:
                            formatList.append('m5')
                        if minute == 0:
                            formatList.append('h1')
                        if hour == 0 and minute == 0:
                            formatList.append('d1')
                        if day == 1 and hour == 0 and minute == 0:
                            formatList.append('month')
                        insert_data = []
                        for index in range(length):
                            insert_data.append((strrawtime, pointNameList[index], pointValueList[index]))
                        #if _mongo_access.saveRawData(dtuName, rawtime, RawDataList):
                        if nStoreType == 0:
                            BEOPDataBufferManager.getInstance().setMutiData_by_TableName(rt_dbname, pointNameList, pointValueList, 0)
                            for tformat in formatList:
                                if not sync_data_to_mongodb(dtuName, rawtime, insert_data, tformat):
                                    print('recvDataZipFile failed:failed to save history mongo data')
                                    app.logger.error('recvDataZipFile failed:failed to save history mongo data')
                                    rt = {'message':'failed to save history mongo data', 'status':0}

                            projIdList = BEOPDataAccess.getInstance().getProjIdListByRTTableName(rt_dbname)
                            for projId in projIdList:
                                triggerOneCalculation(projId,pointNameList, False, 'recvDataZipFile')
                            if len(projIdList)==0:
                                strErr = 'recvDataZipFile: no project id for tablename:%s'%(rt_dbname)
                                print(strErr)
                                app.logger.error(strErr)
                        elif nStoreType == 1:
                            BEOPDataBufferManager.getInstance().setMutiData_by_TableName(rt_dbname, pointNameList, pointValueList, 0)
                        elif nStoreType == 2:
                            for tformat in formatList:
                                if not sync_data_to_mongodb(dtuName, rawtime, insert_data, tformat):
                                    print('recvDataZipFile failed:failed to save history mongo data')
                                    app.logger.error('recvDataZipFile failed:failed to save history mongo data')
                                    rt = {'message':'failed to save history mongo data', 'status':0}
                        else:
                            print('recvDataZipFile failed:failed to save rawdata')
                            app.logger.error('recvDataZipFile failed:failed to save rawdata')
                            rt = {'message':'failed to save rawdata', 'status':0}
                    except Exception as e:
                        print('recvDataZipFile failed:'+str(e))
                        app.logger.error('recvDataZipFile failed:'+str(e))
        except Exception as e:
            print('recvDataZipFile failed:'+str(e))
            app.logger.error('recvDataZipFile failed:'+str(e))
    return json.dumps(rt, ensure_ascii=False)

@bp_dtu.route('/update/dtuConfig',methods=['POST'])
def updateDtuConfig():
    '''
    更新dtu的配置信息
    postData: {
        "dtuname":"testDtu","time":"2017-01-01 00:00:00",
        "configList":[
            {"name":"name3","value":"value3"},
            {"name":"name2","value":"value2"}
        ]}
    :return:
    {"msg": "", "success": true}
    '''
    rv = {"success": False, "msg": ''}
    try:
        data = request.get_json()
        if data:
            dtuname = data.get('dtuname')
            if not dtuname:
                raise Exception('dtuname is necessary')
            time = data.get('time')
            configList = data.get('configList')
            rv["success"] = BEOPDataAccess.getInstance().updateDtuConfig(dtuname, time, configList)
    except Exception as e:
        rv["msg"] = e.__str__()
        print('updateDtuConfig error' + e.__str__())
    return json.dumps(rv)

@bp_dtu.route('/recvConfig', methods=['POST'])
def recvConfig():
    try:
        data = request.get_json()
        if data:
            dtuName = data.get('dtuName')
            configList = data.get('configList')
            if not isinstance(configList, list):
                print('recvConfig failed:configList must be a list')
                app.logger.error('recvConfig failed:configList must be a list')
                return json.dumps(dict(status=0, message='configList must be a list'), ensure_ascii=False)
            if len(configList)==0:
                print('recvConfig failed:configList is empty')
                app.logger.error('recvConfig failed:configList is empty')
                return json.dumps(dict(status=0, message='configList is empty'), ensure_ascii=False)

            bSuccess =  BEOPDataAccess.getInstance().saveConfigList(dtuName, configList)

            if bSuccess:
                return json.dumps(dict(status=1, message='ok'), ensure_ascii=False)
            else:
                print('recvConfig failed:BEOPDataAccess.getInstance().saveConfigList return False')
                app.logger.error('recvConfig failed:BEOPDataAccess.getInstance().saveConfigList return False')
                return json.dumps(dict(status=0, message='BEOPDataAccess.getInstance().saveConfigList return False'), ensure_ascii=False)
        else:
            print('recvConfig failed:data is not json type')
            app.logger.error('recvConfig failed:data is not json type')
            return json.dumps(dict(status=0, message='data is not json type'), ensure_ascii=False)
    except Exception as e:
        print('recvConfig failed:'+str(e))
        app.logger.error('recvConfig failed:'+str(e))
        return json.dumps(dict(status=0, message= ( 'beopservice exception in recvConfig: '+ e.__str__())), ensure_ascii=False)
    return json.dumps(dict(status=1, message='ok'), ensure_ascii=False)

@bp_dtu.route('/recvWarningRecord', methods=['POST'])
def recvWarningRecord():
    '''
        存储报警数据历史
        postData: {
        "dtuName":"0",
        "warningList":[
            {"strTime":"2017-01-01 01:00:00",
            "strInfo":"aaadd",
            "nConfirmed":0,
            "nLevel":0,
            "strHappenTime":"2017-01-01 00:00:00",
            "strPointName":"aaaa",
            "strConfirmedUser":"may"
            }
        ]}
        :return:
        {"message": "ok", "status": 1}
        '''
    try:
        data = request.get_json()
        if data:
            dtuName = data.get('dtuName')
            warningList = data.get('warningList')
            if not isinstance(warningList, list):
                print('warningList must be a list')
                app.logger.error('warningList must be a list')
                return json.dumps(dict(status=0, message='warningList must be a list'), ensure_ascii=False)
            if len(warningList)==0:
                print('recvWarningRecord failed:warningList must be a list')
                app.logger.error('recvWarningRecord failed:warningList must be a list')
                return json.dumps(dict(status=0, message='warningList is empty'), ensure_ascii=False)

            bSuccess =  BEOPDataAccess.getInstance().saveWarningRecord(dtuName, warningList)

            if bSuccess:
                return json.dumps(dict(status=1, message='ok'), ensure_ascii=False)
            else:
                print('BEOPDataAccess.getInstance().saveWarningRecord return False')
                app.logger.error('BEOPDataAccess.getInstance().saveWarningRecord return False')
                return json.dumps(dict(status=0, message='BEOPDataAccess.getInstance().saveWarningRecord return False'), ensure_ascii=False)
        else:
            print('recvWarningRecord failed:data is not json type')
            app.logger.error('recvWarningRecord failed:data is not json type')
            return json.dumps(dict(status=0, message='data is not json type'), ensure_ascii=False)
    except Exception as e:
        print('recvWarningRecord failed:'+str(e))
        app.logger.error('recvWarningRecord failed:'+str(e))
        return json.dumps(dict(status=0, message= ( 'beopservice exception in recvWarningRecord: '+ e.__str__())), ensure_ascii=False)
    return json.dumps(dict(status=1, message='ok'), ensure_ascii=False)



@bp_dtu.route('/recvOperationRecord', methods=['POST'])
def recvOperationRecord():
    '''
    存储操作记录
    {
        "dtuName":"0",
        "operationList":[
            {"strTime":"2017-01-01 00:00:00",
            "strUser":"may",
            "strOperation":"开空调"}
    ]}
    :return: {"message": "ok", "status": 1}
    '''
    try:
        data = request.get_json()
        if data:
            dtuName = data.get('dtuName')
            operationList = data.get('operationList')
            if not isinstance(operationList, list):
                print('recvOperationRecord failed:operationList must be a list')
                app.logger.error('recvOperationRecord failed:operationList must be a list')
                return json.dumps(dict(status=0, message='operationList must be a list'), ensure_ascii=False)
            if len(operationList)==0:
                print('recvOperationRecord failed:operationList is empty')
                app.logger.error('recvOperationRecord failed:operationList is empty')
                return json.dumps(dict(status=0, message='operationList is empty'), ensure_ascii=False)

            bSuccess =  BEOPDataAccess.getInstance().saveOperationList(dtuName, operationList)

            if bSuccess:
                return json.dumps(dict(status=1, message='ok'), ensure_ascii=False)
            else:
                print('recvOperationRecord failed:BEOPDataAccess.getInstance().saveOpeartionList return False')
                app.logger.error('recvOperationRecord failed:BEOPDataAccess.getInstance().saveOpeartionList return False')
                return json.dumps(dict(status=0, message='BEOPDataAccess.getInstance().saveOpeartionList return False'), ensure_ascii=False)
        else:
            print('recvOperationRecord failed:data is not json type')
            app.logger.error('recvOperationRecord failed:data is not json type')
            return json.dumps(dict(status=0, message='data is not json type'), ensure_ascii=False)
    except Exception as e:
        print('beopservice exception in recvOperationRecord: '+ e.__str__())
        app.logger.error('beopservice exception in recvOperationRecord: '+ e.__str__())
        return json.dumps(dict(status=0, message= ( 'beopservice exception in recvOperationRecord: '+ e.__str__())), ensure_ascii=False)

    return json.dumps(dict(status=1, message='ok'), ensure_ascii=False)

@bp_dtu.route('/getWriteToSiteData', methods=['POST'])
def getWriteToSiteData():
    rtInfo = {}
    try:
        data = request.get_json()
        if data:
            dtuNameList = data.get('dtuNameList')
            if not isinstance(dtuNameList, list):
                print('getWriteToSiteData failed:dtuNameList must be a list')
                app.logger.error('getWriteToSiteData failed:dtuNameList must be a list')
                return json.dumps(dict(status=0, message='dtuNameList must be a list'), ensure_ascii=False)
            if len(dtuNameList)==0:
                print('getWriteToSiteData failed:dtuNameList is empty')
                app.logger.error('getWriteToSiteData failed:dtuNameList is empty')
                return json.dumps(dict(status=0, message='dtuNameList is empty'), ensure_ascii=False)

            writeDataList = BEOPDataAccess.getInstance().getOutputToSiteTable(dtuNameList)
            rtInfo = dict(status=1, message='ok', writeDataList = writeDataList)
            return json.dumps(rtInfo, ensure_ascii=False)
        else:
            print('getWriteToSiteData failed:data is not json type')
            app.logger.error('getWriteToSiteData failed:data is not json type')
            return json.dumps(dict(status=0, message='data is not json type'), ensure_ascii=False)
    except Exception as e:
        print('beopservice exception in getWriteToSiteData: '+ e.__str__())
        app.logger.error('beopservice exception in getWriteToSiteData: '+ e.__str__())
        return json.dumps(dict(status=0, message= ( 'beopservice exception in getWriteToSiteData: '+ e.__str__())), ensure_ascii=False)

    return json.dumps(rtInfo, ensure_ascii=False)

@bp_dtu.route('/getRealtimeOutputByProjId/<projId>', methods=['GET'])
def getRealtimeOutputByProjId(projId):
    rt = []
    try:
        rt = BEOPDataAccess.getInstance().getRealtimeOutputByProjId(projId)
    except Exception as e:
        print('interface getRealtimeOutputByProjId failed:'+e.__str__())
        app.logger.error('interface getRealtimeOutputByProjId failed:'+e.__str__())
    return json.dumps(rt, ensure_ascii=False)

@bp_dtu.route('/delWriteToSiteData', methods=['POST'])
def delWriteToSiteData():
    try:
        data = request.get_json()
        if data:
            writeDataList = data.get('writeDataList')
            if not isinstance(writeDataList, list):
                print('delWriteToSiteData failed:writeDataList must be a list')
                app.logger.error('delWriteToSiteData failed:writeDataList must be a list')
                return json.dumps(dict(status=0, message='writeDataList must be a list'), ensure_ascii=False)
            if len(writeDataList)==0:
                print('delWriteToSiteData failed:writeDataList is empty')
                app.logger.error('delWriteToSiteData failed:writeDataList is empty')
                return json.dumps(dict(status=0, message='writeDataList is empty'), ensure_ascii=False)

            bSuccess =  BEOPDataAccess.getInstance().deleteOutputToSiteTable(writeDataList)
            if bSuccess:
                return json.dumps(dict(status=1, message='ok'), ensure_ascii=False)
            else:
                print('delWriteToSiteData failed:BEOPDataAccess.getInstance().deleteOutputToSiteTable return False')
                app.logger.error('delWriteToSiteData failed:BEOPDataAccess.getInstance().deleteOutputToSiteTable return False')
                return json.dumps(dict(status=0, message='BEOPDataAccess.getInstance().deleteOutputToSiteTable return False'), ensure_ascii=False)
        else:
            print('delWriteToSiteData failed:data is not json type')
            app.logger.error('delWriteToSiteData failed:data is not json type')
            return json.dumps(dict(status=0, message='data is not json type'), ensure_ascii=False)
    except Exception as e:
        print('beopservice exception in delWriteToSiteData: '+ e.__str__())
        app.logger.error('beopservice exception in delWriteToSiteData: '+ e.__str__())
        return json.dumps(dict(status=0, message= ( 'beopservice exception in delWriteToSiteData: '+ e.__str__())), ensure_ascii=False)

    return json.dumps(rtInfo, ensure_ascii=False)

@bp_dtu.route('/getLostFileList', methods=['POST'])
def getLostFileList():
    rt = {'message':'ok', 'status':1, 'lostFileList':[]}
    data = request.get_json()
    if data:
        dtuNameList = data.get('dtuNameList', [])
        timeFrom = data.get('timeFrom')
        timeTo = data.get('timeTo')
        if dtuNameList:
            if timeFrom and timeTo:
                try:
                    lostFileList = rt.get('lostFileList')
                    for name in dtuNameList:
                        ret = None#=ngo_access.getLostList(name, timeFrom, timeTo)
                        lostFileList.append({'dtuname':name, 'lostFileList':ret})
                except Exception as e:
                    print('getLostFileList failed:'+e.__str__())
                    app.logger.error('getLostFileList failed:'+e.__str__())
            else:
                if not timeFrom:
                    print('getLostFileList failed:timeFrom is null')
                    app.logger.error('getLostFileList failed:timeFrom is null')
                    rt = {'message':'timeFrom is null', 'status':0}
                if not timeTo:
                    print('getLostFileList failed:timeTo is null')
                    app.logger.error('getLostFileList failed:timeTo is null')
                    rt = {'message':'timeTo is null', 'status':0}
                if (not timeFrom) and (not timeTo):
                    print('getLostFileList failed:timeTo and timeFrom are null')
                    app.logger.error('getLostFileList failed:timeTo and timeFrom are null')
                    rt = {'message':'timeTo and timeFrom are null', 'status':0}
        else:
            print('getLostFileList failed:dtuNameList is null')
            app.logger.error('getLostFileList failed:dtuNameList is null')
            rt = {'message':'dtuNameList is null', 'status':0}
    else:
        print('getLostFileList failed:request is not json')
        app.logger.error('getLostFileList failed:request is not json')
        rt = {'message':'request is not json', 'status':0}
    return json.dumps(rt, ensure_ascii=False)

@bp_dtu.route('/multiUpdateDTUProjectInfo', methods=['POST'])
def multiUpdateDTUProjectInfo():
    rt = {'message':'ok', 'status':1}
    data = request.get_json()
    if data:
        try:
            if not BEOPDataAccess.getInstance().multiUpdateDTUProjectInfo(data):
                rt = {'message':'multi update dtuserver_prj_info failed', 'status':0}
        except Exception as e:
            print('interface multiUpdateDTUProjectInfo failed:'+e.__str__())
            app.logger.error('interface multiUpdateDTUProjectInfo failed:'+e.__str__())
            rt = {'message':e.__str__(), 'status':0}
    else:
        print('interface multiUpdateDTUProjectInfo:post param is invalid')
        logging.info('interface multiUpdateDTUProjectInfo:post param is invalid')
        rt = {'message':'request data is null', 'status':0}
    return json.dumps(rt, ensure_ascii=False)

@bp_dtu.route('/updateDTUProjectInfo', methods=['POST'])
def updateDTUProjectInfo():
    rt = {'message':'ok', 'status':1}
    data = request.get_json()
    if data:
        try:
            if not BEOPDataAccess.getInstance().updateDTUProjectInfo(data):
                rt = {'message':'update dtuserver_prj_info failed', 'status':0}
        except Exception as e:
            print('interface updateDTUProjectInfo failed:'+e.__str__())
            app.logger.error('interface updateDTUProjectInfo failed:'+e.__str__())
            rt = {'message':e.__str__(), 'status':0}
    else:
        print('interface updateDTUProjectInfo:post param is invalid')
        logging.info('interface updateDTUProjectInfo:post param is invalid')
        rt = {'message':'request data is null', 'status':0}
    return json.dumps(rt, ensure_ascii=False)

@bp_dtu.route('/updateDTUProject', methods=['POST'])
def updateDTUProject():
    rt = {'message':'ok', 'status':1}
    data = request.get_json()
    if data:
        try:
            if not BEOPDataAccess.getInstance().updateDTUProject(data):
                rt = {'message':'update dtuserver_prj failed', 'status':0}
        except Exception as e:
            print('interface updateDTUProject failed:'+e.__str__())
            app.logger.error('interface updateDTUProject failed:'+e.__str__())
            rt = {'message':e.__str__(), 'status':0}
    else:
        print('interface updateDTUProject:post param is invalid')
        logging.info('interface updateDTUProject:post param is invalid')
        rt = {'message':'request data is null', 'status':0}
    return json.dumps(rt, ensure_ascii=False)

@bp_dtu.route('/removwDTUProjectInfo/<id>', methods=['GET'])
def removeDTUProjectInfo(id):
    rt = {'message':'ok', 'status':1}
    try:
        if not BEOPDataAccess.getInstance().removeDTUProjectInfo(int(id)):
            rt = {'message':'remove dtuserver_prj_info failed', 'status':0}
    except Exception as e:
        print('interface removeDTUProjectInfo failed:'+e.__str__())
        app.logger.error('interface removeDTUProjectInfo failed:'+e.__str__())
        rt = {'message':e.__str__(), 'status':0}
    return json.dumps(rt, ensure_ascii=False)

@bp_dtu.route('/removwDTUProject/<id>', methods=['GET'])
def removeDTUProject(id):
    rt = {'message':'ok', 'status':1}
    try:
        if not BEOPDataAccess.getInstance().removeDTUProject(int(id)):
            rt = {'message':'remove dtuserver_prj failed', 'status':0}
    except Exception as e:
        print('interface removwDTUProject failed:'+e.__str__())
        app.logger.error('interface removwDTUProject failed:'+e.__str__())
        rt = {'message':e.__str__(), 'status':0}
    return json.dumps(rt, ensure_ascii=False)

@bp_dtu.route('/getDTUProjectInfoList', methods=['GET'])
def getDTUProjectInfoList():
    rt = BEOPDataAccess.getInstance().getDTUProjectInfoList()
    if not rt:
        print('interface getDTUProjectInfoList:return none or []')
        logging.info('interface getDTUProjectInfoList:return none or []')
    return json.dumps(rt, ensure_ascii=False)

@bp_dtu.route('/getDTUProjectList', methods=['GET'])
def getDTUProjectList():
    rt = BEOPDataAccess.getInstance().getDTUProjectList()
    if not rt:
        print('interface getDTUProjectList:return none or []')
        logging.info('interface getDTUProjectList:return none or []')
    return json.dumps(rt, ensure_ascii=False)

@bp_dtu.route('/insertDTUProjectInfo', methods=['POST'])
def insertDTUProjectInfo():
    rt = {'message':'ok', 'status':1}
    data = request.get_json()
    if data:
        try:
            if not BEOPDataAccess.getInstance().insertDTUProjectInfo(data):
                rt = {'message':'insert dtuserver_prj_info failed', 'status':0}
        except Exception as e:
            print('interface insertDTUProjectInfo failed:'+e.__str__())
            app.logger.error('interface insertDTUProjectInfo failed:'+e.__str__())
            rt = {'message':e.__str__(), 'status':0}
    else:
        print('interface insertDTUProjectInfo:invalid params')
        logging.info('interface insertDTUProjectInfo:invalid params')
        rt = {'message':'request data is null', 'status':0}
    return json.dumps(rt, ensure_ascii=False)

@bp_dtu.route('/insertDTUProject', methods=['POST'])
def insertDTUProject():
    rt = {'message':'ok', 'status':1}
    data = request.get_json()
    if data:
        try:
            if not BEOPDataAccess.getInstance().insertDTUProject(data):
                rt = {'message':'insert dtuserver_prj failed', 'status':0}
        except Exception as e:
            print('interface insertDTUProject failed:'+e.__str__())
            app.logger.error('interface insertDTUProject failed:'+e.__str__())
            rt = {'message':e.__str__(), 'status':0}
    else:
        print('interface insertDTUProject:invalid params')
        logging.info('interface insertDTUProject:invalid params')
        rt = {'message':'request data is null', 'status':0}
    return json.dumps(rt, ensure_ascii=False)

@bp_dtu.route('/insert/DTUOrder', methods=['POST'])
def insert_dtuOrder():
    '''
    {
        "dtuname":"testDtu",
        "time":"2017-01-01 00:00:00",
        "content":"开空调",
        "cmdType":1，
        "mode": 1,#1：发送到现场  2：现场回复
        "cmdId":'57fc58459cf55a159ca5170d'
    }
    :return:
    { "msg": "", "success": true }
    '''
    rt = {"success": False, "msg": ''}
    try:
        data = request.get_json()
        dtuname = data.get('dtuname')
        if not dtuname:
            raise Exception('dtuname is necessary')
        time = data.get('time')
        content = data.get('content')
        cmdType = data.get('cmdType')
        mode = data.get('mode')
        cmdId = data.get('cmdId')
        if not cmdId:
            raise Exception('cmdId is necessary')
        if data:
            if MongoConnManager.getConfigConn().insert_dtuOrder(dtuname, time, cmdType, content, cmdId, mode):
                rt['success'] = True
    except Exception as e:
        rt['msg'] = e.__str__()
        print('insert_dtuOrder error:' + e.__str__())
        app.logger.error('insert_dtuOrder error:' + e.__str__())
    return jsonify(rt)

@bp_dtu.route('/DTULog/insert', methods=['POST'])
def insert_dtulog():
    rt = False
    try:
        data = request.get_json()
        if data:
            rt = MongoConnManager.getConfigConn().insert_dtulog(data.get('userName', 'unknown'), data.get('dtuName', 'unknown'),
                                                                data.get('Operation', ''), data.get('type', 0), data.get('ack', ''))
    except Exception as e:
        print('insert_dtulog error:' + e.__str__())
        app.logger.error('insert_dtulog error:' + e.__str__())
    return jsonify(data=rt)

@bp_dtu.route('/DTULog/get', methods=['POST'])
def get_dtulog():
    rt = []
    try:
        data = request.get_json()
        startTime = data.get('startTime')
        endTime = data.get('endTime')
        dtuName = data.get('dtuName')
        if startTime is not None and endTime is not None:
            rt = MongoConnManager.getConfigConn().get_dtulog_by_time(dtuName, startTime, endTime)
        elif data.get('limit') is not None:
            rt = MongoConnManager.getConfigConn().get_dtulog_by_limit(dtuName, data.get('limit'))
    except Exception as e:
        print('get_dtulog error:' + e.__str__())
        app.logger.error('get_dtulog error:' + e.__str__())
    return rt

@bp_dtu.route('/sendHistoryDataToMongo', methods=['POST'])
def sendHistoryDataToMongo():
    #dtuName: '',              //dtu标识，根据这个找到相应的dbname和mongodb
    #protocol: '', //'beop', 'modbus', 'powerlink', 'unknown'
    #pointNameList: [ '','',''],
    #pointValueList:['','',''],
    #time:'',             //时间戳
    #timeForamat:'m1',    //最小存储类型
    #length: 整数,        //点个数

    #status: 1，整形，表示成功,0表示失败
    #message:'失败原因'
    rt = {'status':0, 'message':None}
    post_data = request.get_json()
    try:
        if post_data:
            pointNameList = post_data.get('pointNameList', [])
            pointValueList = post_data.get('pointValueList', [])
            length = post_data.get('length', 0)
            timeFormat = post_data.get('timeFormat')
            if len(pointNameList) == len(pointValueList) == int(length):
                if timeFormat in ('s5','m1','m5','h1','d1','month'):
                    threading._start_new_thread(set_histtory_data, (post_data.get('dtuName'), pointNameList, pointValueList,
                                                                    timeFormat, post_data.get('time'), length))
                    rt.update({'status':1})
                else:
                    raise Exception("timeFormat must be in ('s5','m1','m5','h1','d1','M1')")
            else:
                raise Exception('Please check the parameters')
        else:
            raise Exception('Missing Parameters')
    except Exception as e:
        print('sendHistoryDataToMongo error:' + e.__str__())
        app.logger.error('sendHistoryDataToMongo error:' + e.__str__())
        rt.update({'status':0, 'message':e.__str__()})
    return jsonify(rt)

def set_histtory_data(dtuName, pointNameList, pointValueList, timeformat, timeAt, length):
    try:
        hisdata = []
        RTBName = BEOPDataAccess.getInstance().get_dbname_from_dtuserver_prj_by_dtuname(dtuName)
        for i in range(length):
            hisdata.append((timeAt, pointNameList[i], pointValueList[i]))
        if hisdata:
            setHistoryDataToMongo(RTBName, hisdata, timeformat, timeAt)
    except Exception as e:
        print('set_histtory_data error:' + e.__str__())
        app.logger.error(e.__str__())


def setHistoryDataToMongo(dbname, hisdata, timeformat, timeAt):
    try:
        formatlist = ['s5','m1','m5','h1','d1','month']
        projId = -1 #不能改！！！
        projectInfoList = RedisManager.get_project_info_list()
        if not projectInfoList:
            BEOPDataAccess.getInstance().UpdateProjectInfo()
            projectInfoList = RedisManager.get_project_info_list()
        if projectInfoList:
            for item in projectInfoList:
                mysqlname = item.get('mysqlname')
                id = item.get('id')
                if dbname == mysqlname:
                    projId = int(id)
                    break
            try:
                mintimeObj = datetime.strptime(timeAt, '%Y-%m-%d %H:%M:%S')
                maxtimeObj = datetime.strptime(timeAt, '%Y-%m-%d %H:%M:%S')
            except Exception as e:
                raise Exception(e.__str__())
            try:
                conn, server_id = MongoConnManager.getHisConnWrite(int(projId), mintimeObj, maxtimeObj)
                strCollectionName = BEOPDataAccess.getInstance().GetCollectionNameById(int(projId))
                if not strCollectionName:
                    strCollectionName = dbname
                    print('setHistoryDataToMongo:mysqlname name %s can not be found,auto set name to %s'%(dbname,strCollectionName,))
                    app.logger.error('setHistoryDataToMongo:mysqlname name %s can not be found,auto set name to %s'%(dbname,strCollectionName,))
            except Exception as e:
                strError = 'setHistoryDataToMongo error of dbname: %s:'%dbname + e.__str__()
                print(strError)
                app.logger.error(strError)
                raise Exception('cannot find the proj id of name:%s'%dbname)
            if conn and isinstance(server_id, int):
                plm = RedisManager.get_project_locate_map()
                if plm:
                    mi = plm.get('mongoInstance')
                    if mi:
                        serverInfo = mi.get(str(server_id))
                        if serverInfo:
                            if serverInfo.get('writable'):
                                index = formatlist.index(timeformat)
                                for tformat in formatlist[index:]:
                                    cn = '{0}_data_{1}'.format(tformat, strCollectionName)
                                    length = conn.InsertTableData(projId, hisdata, cn)
                                r = BEOPDataAccess.getInstance().InsertHisDataToMysql(hisdata, projId)
                                if r.get('state') != 1:
                                    strErr = 'insert into table %s failed'%("hisdata_%s by dbname: %s"%(projId, dbname),)
                                    print(strErr)
                                    app.logger.error(strErr)
                                return True
                            else:
                                print('interface /setHistoryDataToMongo:mongoserver is readonly')
                                logging.info('interface /setHistoryDataToMongo:mongoserver is readonly')
                                raise Exception('mongoserver is readonly')
                    else:
                        print('interface /setHistoryDataToMongo:mongoInstance in memcache is none')
                        logging.info('interface /setHistoryDataToMongo:mongoInstance in memcache is none')
                        raise Exception('mongoInstance in memcache is none')
                else:
                    print('interface /setHistoryDataToMongo:projectLocateMap in memcache is none')
                    logging.info('interface /setHistoryDataToMongo:projectLocateMap in memcache is none')
                    raise Exception('projectLocateMap in memcache is none')
            else:
                if not conn:
                    print('interface /setHistoryDataToMongo:projId = %s, mongo conn is none, check locate_map table'%(projId,))
                    logging.info('interface /setHistoryDataToMongo:projId = %s, mongo conn is none, check locate_map table'%(projId,))
                    raise Exception('Can not connect to the database')
                if not server_id:
                    print('interface /setHistoryDataToMongo:projId = %s, server_id is none, check locate_map table'%(projId,))
                    logging.info('interface /setHistoryDataToMongo:projId = %s, server_id is none, check locate_map table'%(projId,))
                    raise Exception('Can not connect to the database')
        else:
            print('interface /setHistoryDataToMongo:projectInfoList in memcache is none')
            logging.info('interface /setHistoryDataToMongo:projectInfoList in memcache is none')
            raise Exception('Memcached is None')
    except Exception as e:
        print('interface /setHistoryDataToMongo failed:'+e.__str__())
        app.logger.error('interface /setHistoryDataToMongo failed:'+e.__str__())
        raise Exception(e.__str__())

@bp_dtu.route('/getDTUProjectByServerCode', methods=['POST'])
def getDTUProjectByServerCode():
    #serverCode: 整数,    //数据中心ID，
    rt = {"status":0, "message":None, "dtuList":[]}
    post_data = request.get_json()
    try:
        if post_data:
            serverCode = post_data.get('serverCode')
            dtulist = BEOPDataAccess.getInstance().get_dtuProject_by_serverCode(serverCode)
            rt.update({'status':1, 'dtuList':dtulist})
        else:
            raise Exception('Missing Parameters')
    except Exception as e:
        print('getDTUProjectByServerCode error:' + e.__str__())
        app.logger.error(e.__str__())
        rt.update({"status":0, "message":e.__str__()})
    return jsonify(rt)

@bp_dtu.route('/updateDTUProjectByName', methods=['POST'])
def updateDTUProjectByName():
    #dtuName: '',      //dtu标识，根据这个找到相应的dbname和mongodb
    #RTBName:'',      //实时数据名 如beopdata_XXXX
    #timeZone:'',     //时区
    #serverCode: 整数,     //数据中心ID
    rt = {'status':0, 'message':None}
    post_data = request.get_json()
    try:
        if post_data:
            dbrv = BEOPDataAccess.getInstance().update_dtuProject_by_dtuName(post_data.get('dtuName'), post_data.get('RTBName'),
                                                                             post_data.get('serverCode'), post_data.get('timeZone'))
            if dbrv:
                rt.update({'status':1})
        else:
            raise Exception('Missing Parameters')
    except Exception as e:
        print('updateDTUProjectByName error:' + e.__str__())
        app.logger.error(e.__str__())
        rt.update({'status':0, 'message':e.__str__()})
    return jsonify(rt)

@bp_dtu.route('/updateThirdDataRealAndHistory', methods=['post'])
def updateThirdDataRealAndHistory():
    rt = {'error':0, 'message':'ok'}
    try:
        data = request.get_json()
        if data:
            tbname = data.get('tbName')
            if not tbname:
                raise Exception('tbName is not valid')
            time = data.get('time')
            if not time:
                raise Exception('time is not valid')
            point_name_list = data.get('pointNameList')
            if not point_name_list:
                raise Exception('pointNameList is not valid')
            point_value_list = data.get('pointValueList')
            if not point_value_list:
                raise Exception('pointValueList is not valid')
            length = data.get('length')
            if not length:
                raise Exception('length is not valid')
            source = data.get('source')
            if not source:
                raise Exception('source is not valid')
            type = data.get('type')
            if type not in (0,1,2):
                raise Exception('type is not valid')
            if len(point_name_list) != len(point_value_list):
                raise Exception('length of pointNameList and pointValueList is different')
            if length != len(point_name_list):
                raise Exception('param length is not equal to namelist and valuelist')
            mq_name = 'updateThirdDataRealAndHistory' if app.config['BEOPCLUSTER'] != 'development_unittest' else 'test_updateThirdDataRealAndHistory'
            data.update({'remark':'updateThirdDataRealAndHistory'})
            jsonData = json.dumps(data, ensure_ascii=False)
            if not mqServer.RabbitMqWorkQueueSend(mq_name, jsonData):
                raise Exception('put into mq failed')
    except Exception as e:
        print('updateThirdDataRealAndHitory error:' + e.__str__())
        app.logger.error('updateThirdDataRealAndHitory error:' + e.__str__())
        rt = {'error': 1, 'message': str(e)}
    return json.dumps(rt, ensure_ascii=False)

@bp_dtu.route('/updateThirdData', methods=['post'])
def updateThirdData():
    data = request.get_json()
    rt=do_updateThirdData(data)
    return json.dumps(rt, ensure_ascii=False)

def do_updateThirdData(data):
    try:
        rt = {'error':0, 'message':'ok'}
        if data:
            dtu_name = data.get('dtuName')
            if dtu_name is None:
                raise Exception('dtuName is None')
            time = data.get('time')
            if time is None:
                raise Exception('time is None')
            type = data.get('type')
            if type is None:
                raise Exception('type is None')
            if type not in (0,1,2):
                raise Exception('type is not valid')
            pointNameList = data.get('pointNameList')
            if pointNameList is None:
                raise Exception('pointNameList is None')
            pointValueList = data.get('pointValueList')
            if pointValueList is None:
                raise Exception('pointValueList is None')
            length = data.get('length')
            if length is None:
                raise Exception('length is None')
            if length != len(pointNameList):
                raise Exception('param length is not equal to namelist and valuelist')
            source = data.get('source')
            if source is None:
                raise Exception('source is None')
            mq_name = 'updateThirdDataRealAndHistory' if app.config['BEOPCLUSTER'] != 'development_unittest' else 'test_updateThirdDataRealAndHistory'
            data.update({'remark': 'updateThirdData'})
            jsonData = json.dumps(data, ensure_ascii=False)
            if not mqServer.RabbitMqWorkQueueSend(mq_name, jsonData):
                raise Exception('put into mq failed')
        else:
            raise Exception('request is invalid')
        return rt
    except Exception as e:
        print('updateThirdData error:' + e.__str__())
        app.logger.error('updateThirdData error:' + e.__str__())
