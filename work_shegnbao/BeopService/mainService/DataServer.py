__author__ = 'David'

from mainService import app
from datetime import datetime
from flask import request, json, abort,jsonify
from math import *
import logging, time
from mainService.Models import *
from mod_DataAccess.BEOPDataAccess import *
from mod_DataAccess.BEOPMongoDataAccess import *
from mod_DataAccess.MongoConnManager import *
from mod_DataAccess.BEOPDataBufferManager import *
import re
from mod_MsgQueue.mqServer import *
from mod_Common.Utils import Utils
from mod_DataAccess.RedisManager import RedisManager


@app.route('/get_history_data_padded', methods=['POST'])
def get_history_data_padded():
    data = None
    resultRev = []
    try:
        timeb = time.time()
        data = request.get_json()
        resultRev = do_get_history_data_padded(data)
    except Exception:
        logging.error('Failed to get history data!', exc_info=True, stack_info=True)
    timee = time.time()
    judgement_RequestTime(timeb, timee, data.get('token'))
    try:
        rt = json.dumps(resultRev, ensure_ascii=False)
    except MemoryError as e:
        print('get_history_data_padded MemoryError:' + e.__str__())
        app.logger.error(e.__str__())
        app.logger.error(data)
    return rt


@app.route('/get_history_data_padded_notSearchBeforeStartDate', methods=['POST'])
def get_history_data_padded_notSearchBeforeStartDate():
    data = None
    resultRev = []
    try:
        timeb = time.time()
        data = request.get_json()
        noSearchBeforeStartTime = True
        resultRev = do_get_history_data_padded(data, noSearchBeforeStartTime)
    except Exception:
        logging.error('Failed to get history data!', exc_info=True, stack_info=True)
    timee = time.time()
    judgement_RequestTime(timeb, timee, data.get('token'))
    try:
        rt = json.dumps(resultRev, ensure_ascii=False)
    except MemoryError as e:
        print('get_history_data_padded MemoryError:' + e.__str__())
        app.logger.error(e.__str__())
        app.logger.error(data)
    return rt


def do_get_history_data_padded(data, noSearchBeforeStartTime=None):
    resultRev = []

    if data.get('projectId') is None or data.get('projectId') == '':
        return [dict(error='projectId is empty ')]
    else:
        projId = int(data.get('projectId'))
    pointList = data.get('pointList')
    # invalid query filter:
    strTimeStart = data.get('timeStart')
    strTimeEnd = data.get('timeEnd')
    strTimeFormat = data.get('timeFormat')
    bSearchNearest = data.get('bSearchNearest', False)
    if pointList is None or not isinstance(pointList, list):
        return json.dumps(dict(error=1, msg='pointList format wrong, must be list'), ensure_ascii=False)

    if strTimeStart is None or strTimeEnd is None:
        return json.dumps(dict(error=1, msg='time start and end need'), ensure_ascii=False)

    # nCount = Utils.get_timepoint_count(strTimeStart, strTimeEnd, strTimeFormat)
    # if len(pointList) * nCount > 100000:
    #     return json.dumps(dict(error=1, msg='pointList length * time point count >50000, too much points.'),
    #                       ensure_ascii=False)

    (realPointList, requestSiteToCloudMaps) = genCloudSiteMap(projId, pointList)
    result = BEOPDataAccess.getInstance().get_history_data_padded(projId, realPointList, strTimeStart, strTimeEnd,
                                                                  strTimeFormat, bSearchNearest, noSearchBeforeStartTime=noSearchBeforeStartTime)
    if 'error' not in result:
        for item in result:
            reName = item.get('name')
            if reName:
                if requestSiteToCloudMaps:
                    realName = requestSiteToCloudMaps.get(reName)
                    item['name'] = realName
            resultRev.append(item)
    else:
        resultRev = result
    return resultRev


@app.route('/get_realtimedata/<projId>',methods=['GET','POST'])
def get_realtimedata_container(projId):
    pointList = []
    try:
        if request.method == 'POST':
            data = request.get_json()
            if data:
                pointList = data.get('pointList', [])
        projName = BEOPDataAccess.getInstance().getProjNameById(projId)
        if projName != None:
            rv = BEOPDataAccess.getInstance().getInputTableContainer(projName, pointList)
            dj = rv
    except Exception as e:
        print('get_realtimedata_container error:' + e.__str__())
        app.logger.error('get_realtimedata_container error:' + e.__str__())
        dj = dict(error = e.__str__())
    return json.dumps(dj, ensure_ascii=False)

def updateCloudSiteMap(proj):
    RedisManager.set_cloudpoints_site(proj, {})
    allCloudToSitePoints = MongoConnManager.getConfigConn().getCloudPointSiteType(int(proj))
    logging.debug('allCloudToSitePoints = %s', allCloudToSitePoints)
    RedisManager.set_cloudpoints_site(proj, allCloudToSitePoints)
    rt = RedisManager.get_cloudpoints_site(proj)
    if rt:
        if allCloudToSitePoints:
            return len(allCloudToSitePoints)
        else:
            return 0
    else:
        return 0

def genCloudSiteMap(proj, pointList):
    realPointList = []
    allCloudToSitePoints = RedisManager.get_cloudpoints_site(proj)

    requestSiteToCloudMaps = {}
    if allCloudToSitePoints:
        for pt in pointList:
            ptRealName = allCloudToSitePoints.get(pt)
            if ptRealName:
                requestSiteToCloudMaps[ptRealName] = pt
                realPointList.append(ptRealName)
            else:
                requestSiteToCloudMaps[pt] = pt
                realPointList.append(pt)
    else:
        realPointList = pointList
    return (realPointList, requestSiteToCloudMaps)

@app.route('/cloudpoint/get',methods=['POST'])
def cloudpoint_get():
    rdata = None
    try:
        dj = dict(info='none')
        rdata = request.get_json()
        if rdata.get('proj') is None:
            return json.dumps("error param:proj is none", ensure_ascii=False)
        else:
            proj = rdata.get('proj')

        xx = RedisManager.get_cloudpoints_site(proj)
        dj = dict(error=0, msg='', data = xx)
    except Exception as e:
        logging.error('Failed to get cloudpoint with request: %s', rdata, exc_info=True, stack_info=True)
        dj = dict(error = e.__str__())
    return json.dumps(dj, ensure_ascii=False)

@app.route('/cloudpoint/update',methods=['POST'])
def cloudpoint_update():
    rdata = None
    try:
        dj = dict(info='none')
        rdata = request.get_json()
        if rdata.get('proj') is None:
            return json.dumps("error param:proj is none", ensure_ascii=False)
        else:
            proj = rdata.get('proj')

        if isinstance(proj, list):
            updateRv = {}
            if not proj:
                allRealDataTable = BEOPDataAccess.getInstance().get_valid_mysqlName()
                allRTTableName = BEOPDataAccess.getInstance().all_rt_table()
                ids = []
                for rt_item in allRTTableName:
                    if '_vpoint' not in rt_item[0]:
                        id = int(re.search('(\d+)', rt_item[0]).group())
                        if id not in ids:
                            ids.append(id)
                for rd_item in allRealDataTable:
                    if rd_item[0] in ids:
                        proj.append(rd_item[0])
            for item in proj:
                rvCount = updateCloudSiteMap(item)
                updateRv[str(item)] = rvCount
            dj = dict(error=0, msg='', info=updateRv)
        else:
            rvCount = updateCloudSiteMap(proj)
            dj = dict(error=0, msg='', count = rvCount)

    except Exception as e:
        logging.error('Failed to update cloudpoint with rdata = %s', rdata, exc_info=True, stack_info=True)
        dj = dict(error = e.__str__())
    return json.dumps(dj, ensure_ascii=False)


@app.route('/get_realtimedata',methods=['POST'])
def get_realtimedata():
    rdata = None
    data = {}
    try:
        dj = dict(info='none')
        timeb = time.time()
        rdata = request.get_json()
        data = do_get_realtimedata(rdata)
        timee = time.time()
        judgement_RequestTime(timeb, timee, rdata.get('token'))
    except Exception as e:
        print('get_realtimedata error:' + e.__str__())
        app.logger.error('get_realtimedata error:' + e.__str__())
        data = dict(error = e.__str__())
    return json.dumps(data, ensure_ascii=False)

def do_get_realtimedata(rdata):
        nSourceType = rdata.get('queryType') #None,0: by projId, 1: by tableName
        rt = {}
        if nSourceType is None:
            nSourceType = 0
        else:
            xx=0
        type = int(rdata.get('type', -1))
        if rdata.get('proj') is None or rdata.get('proj') == '':
            rt = dict(error=1, msg='proj is necessary but content is empty.')
            return rt
        else:
            proj = rdata.get('proj')
        if nSourceType==1:
            tableName = proj #这里是tablename
            proj = BEOPDataAccess.getInstance().getProjIdBydbName(tableName)
        pointList = rdata.get('pointList')
        requestSiteToCloudMaps = None
        #filter requests
        if pointList is not None and isinstance(pointList, list):
            pointList = [item.strip() for item in pointList]
            pointList = [item for item in pointList if len(item)>0 ]
            if len(pointList)==0:
                rt = dict(error=1, msg='pointList is array but every item content is all empty.')
                return rt
        #如果点列表不为空，则需要进行现场点的映射处理
        if pointList is not None:
            (realPointList,requestSiteToCloudMaps) =  genCloudSiteMap(proj, pointList)
            pointList = realPointList

        data = BEOPDataAccess.getInstance().getBufferRTDataByProj(proj,pointList, type)
        if len(data) == 0:
            rt = [{'error': 1, 'msg': 'no realtime data'}]
            return rt
        else:
            if 'error' in data.keys():
                return [data]
            else:
                dj = []
                for k,v in data.items():
                    if requestSiteToCloudMaps and pointList:
                        rtName = requestSiteToCloudMaps.get(k)
                        if rtName is None:
                            rtName = k
                    else:
                        rtName = k
                    dj.append(dict(name=rtName, value=v))
                return dj


@app.route('/get_realtimedata_with_time', methods=['POST'])
def get_realtimedata_with_time():
    '''
    David:2016-07-25
    :post_data: {'proj':int(), 'pointList':[]}
    :return: [(pointname, pointvalue, updatetime)]
    '''
    rt = {'status':0, 'message':'', 'data':[]}
    post_data = request.get_json()
    try:
        if post_data:
            if post_data.get('projId') is None or post_data.get('projId') == '':
                rt.update({'message':'Need projId'})
            else:
                rt = do_get_realtimedata_with_time(post_data)
    except Exception as e:
        print('get_realtimedata_with_time error:' + e.__str__())
        app.logger.error(e.__str__())
        rt.update({'message':e.__str__()})
    return jsonify(rt)

def do_get_realtimedata_with_time(post_data):
    rt = {'status':0, 'message':'', 'data':[]}
    projId = post_data.get('projId')
    pointList = post_data.get('pointList', [])
    requestSiteToCloudMaps = None
    #filter requests
    if pointList is not None and isinstance(pointList, list):
        pointList = [item.strip() for item in pointList]
        pointList = [item for item in pointList if len(item)>0 ]
        if len(pointList)==0:
            rt.update({'message':'pointList is empty'})
            return rt
    #如果点列表不为空，则需要进行现场点的映射处理
    if pointList is not None:
        (realPointList,requestSiteToCloudMaps) =  genCloudSiteMap(projId, pointList)
        pointList = realPointList

    data = BEOPDataAccess.getInstance().getBufferRTDataWithTimeByProj(projId, pointList)
    if len(data) == 0:
        rt.update({'message': 'no realtime data'})
    else:
        res = []
        for item in data:
            k = item[0]
            v = item[1]
            if requestSiteToCloudMaps and pointList:
                rtName = requestSiteToCloudMaps.get(k)
                if rtName is None:
                    rtName = k
            else:
                rtName = k
            res.append([rtName, v, item[2].strftime('%Y-%m-%d %H:%M:%S')])
        rt.update({'status':1, 'data':res})
    return rt

def do_get_realtimedata_with_time_raw(post_data):
    rt = {'status':0, 'message':'', 'data':[]}
    projId = post_data.get('projId')
    pointList = post_data.get('pointList', [])

    if pointList is not None and isinstance(pointList, list):
        pointList = [item.strip() for item in pointList]
        pointList = [item for item in pointList if len(item)>0 ]
        if len(pointList)==0:
            rt.update({'message':'pointList is empty'})
            return rt

    data = BEOPDataAccess.getInstance().getBufferRTDataWithTimeByProjRaw(projId, pointList)
    if len(data) == 0:
        rt.update({'message': 'no realtime data'})
    else:
        res = []
        for item in data:
            res.append([item[0], item[1], item[2].strftime('%Y-%m-%d %H:%M:%S')])
        rt.update({'status':1, 'data':res})
    return rt

@app.route('/calculation/clearQueueStatus', methods=['POST'])
def calculaton_clear_queue_status():

    rt = {'status':0, 'message':None, 'data':[]}
    post_data = request.get_json()
    try:
        if post_data:
            projIdList = post_data.get('projIdList')
            if projIdList:
                for projId in projIdList:
                    RedisManager.set_calc_trigger_queued(projId, False)
                    RedisManager.set_calc_trigger_busy(projId, False)
                rt.update({'status':1})
            else:
                rt.update({'message':'Need projId'})
    except Exception as e:
        print('get_realtimedata_with_time error:' + e.__str__())
        app.logger.error(e.__str__())
        rt.update({'message':e.__str__()})
    return jsonify(rt)


def triggerOneCalculation(projId, pointList, bWaitForFinish, dataTime=None, strSource=''):
    #eric.wang pointList: ['strPointName', 'strPointName','strPointName','strPointName']

    (bQueued, strQueuedTime) = RedisManager.get_calc_trigger_queued(projId)
    try:
        tQueued = datetime.strptime(strQueuedTime, '%Y-%m-%d %H:%M:%S')
    except Exception as e:
        tQueued = datetime.now()- timedelta(days=1)
    try:
        bBusy = RedisManager.get_calc_trigger_busy(projId)
        tTriggered =  RedisManager.get_calc_trigger_timeUpdate(projId)
        tInRange = ((datetime.now() - tTriggered)<timedelta(seconds=60*15))
        tQueueInRange = ((datetime.now() - tQueued)<timedelta(seconds=60*15))
        if bBusy and tInRange:
            app.logger.warning('Project %s is busy with point calculation. Ignore this calculation request.', projId)
            return False
        elif bQueued and tQueueInRange:
            app.logger.warning('Calculation request for project %s is already queued. Ignore this request.', projId)
            return False

        RedisManager.set_calc_trigger_queued(int(projId), True)  # Enqueue successfully
        logging.debug('triggerOneCalculation for projId: %s', projId)
        bCalculationFinishSuccess = False
        strMessageQueueName = 'calculationTrigger0' if app.config['BEOPCLUSTER'] != 'development_unittest' else 'test_calculationTrigger0'
        if dataTime is None:
            dataTime = datetime.now()
            strTimeUpdate = dataTime.strftime('%Y-%m-%d %H:%M:%S')
        else:
            try:
                strTimeUpdate = dataTime.strftime('%Y-%m-%d %H:%M:%S')
            except:
                strTimeUpdate= datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        data = dict(projId = projId, pointList = None, bWaitForFinish = bWaitForFinish, timeUpdate= strTimeUpdate,source=strSource )
        strKey = 'calculationTrigger_%d'%(int(projId))
        RedisManager.set_calculation_trigger_flag(projId, '1')
        jsonData = json.dumps(data,ensure_ascii=False)
        if not RabbitMqWorkQueueSend(strMessageQueueName,jsonData):  #消息发送成功后才进去等待
            return False


        if not bWaitForFinish:
            return True

        nCount = 0

        while nCount<20:
            time.sleep(3)
            if RedisManager.get_calculation_trigger_flag(projId)=='0':
                bCalculationFinishSuccess = True
                break
            nCount +=1

        if not bCalculationFinishSuccess:
            RedisManager.set_calculation_trigger_flag(projId, '0') #恢复memcache键,防止由于后台意外导致永远死锁不计算
        return bCalculationFinishSuccess

    except Exception as e:
        print('triggerOneCalculation error:' + e.__str__())
        app.logger.error('triggerOneCalculation error:' + e.__str__())
        return False
    return bCalculationFinishSuccess


def triggerOneCalculation_site(projId, pointList, bWaitForFinish, dataTime=None, strSource=''):
    try:
        logging.debug('ForceCalculation for projId: %s', projId)
        bCalculationFinishSuccess = False
        strMessageQueueName = 'ForceCalculation'
        if dataTime is None:
            dataTime = datetime.now()
        data = dict(projId = projId, pointList = pointList, bWaitForFinish = bWaitForFinish, timeUpdate= dataTime.strftime('%Y-%m-%d %H:%M:%S'), source=strSource )
        strKey = 'ForceCalculation_%d'%(int(projId))
        RedisManager.set_calculation_force_flag(projId, '1')
        jsonData = json.dumps(data,ensure_ascii=False)
        if not RabbitMqWorkQueueSend(strMessageQueueName,jsonData):  #消息发送成功后才进去等待
            return False

        if not bWaitForFinish:
            return True
        nCount = 0
        while nCount<5:
            time.sleep(2)
            if RedisManager.get_calculation_force_flag(projId)=='0':
                bCalculationFinishSuccess = True
                break
            nCount +=1
        if not bCalculationFinishSuccess:
            RedisManager.set_calculation_force_flag(projId, '0') #恢复memcache键,防止由于后台意外导致永远死锁不计算
        return bCalculationFinishSuccess
    except Exception as e:
        print('triggerOneCalculation error:' + e.__str__())
        app.logger.error('triggerOneCalculation error:' + e.__str__())
        return False
    return bCalculationFinishSuccess


'''
def triggerAlarmData(projId,bWaitForFinish=True):
    try:
        bCalculationFinishSuccess = False
        strMessageQueueName='AlarmDataQueue0'
        if bWaitForFinish:
            nCount = 0       
            while nCount<5:
                if RedisManager.get_calculation_force_flag(projId)=='0':
                    bCalculationFinishSuccess = True
                    break
                nCount +=1
                time.sleep(2)
        else:
            bCalculationFinishSuccess = True
        if bCalculationFinishSuccess:
            data = dict(projId = projId, bWaitForFinish = bWaitForFinish, timeUpdate= dataTime.strftime('%Y-%m-%d %H:%M:%S') )
            jsonData = json.dumps(data,ensure_ascii=False)
            RabbitMqWorkQueueSend(strMessageQueueName,jsonData)
    except Exception as e:
        print('triggerAlarmData error:' + e.__str__())
        app.logger.error('triggerAlarmData error:' + e.__str__())
        return False
'''


def saveDataIntoHisBuffer(projId, insertDataList):
    # 严观微 insertDataList: [
    # (strTime,strPointName, strValue),
    # (strTime,strPointName, strValue),
    # (strTime,strPointName, strValue), ]
    try:
        BEOPDataAccess.getInstance().InsertHisDataToMysql(insertDataList, projId)
    except Exception as e:
        print('saveDataIntoHisBuffer error:' + e.__str__())
        app.logger.error('saveDataIntoHisBuffer error:' + e.__str__())
        return False
    return True


@app.route('/set_realtimedata_from_site',methods=['POST'])
def set_realtimedata_from_site():    # interface for algorithm
    try:
        rv = dict(info='none')
        timeb = time.time()
        data = request.get_json()
        projId = data.get('projId')
        pointList = data.get('point')
        valueList = data.get('value')
        timeHappen = data.get('time')
        if timeHappen is None:
            timeHappen = datetime.now()
        else:
            timeHappen = datetime.strptime(timeHappen,  '%Y-%m-%d %H:%M:%S')
        onlyInsertHistory = data.get('onlyInsertHistory')
        bOnlyInsert = False
        if onlyInsertHistory is not None and onlyInsertHistory==1:
            bOnlyInsert = True

        strTimePeriod = data.get('timePeriod')
        if strTimePeriod not in ['m1','m5','h1','d1','M1']:
            strTimePeriod = 'm1'
        waitForFinish = data.get('waitForFinish')  # 0表示送完数据就返回，1表示等待后台执行计算保存全部完成
        token = data.get('token')
        bAuthorized = False
        if token is None or token in app.config['TOKEN_WHITE_LIST']:
            bAuthorized = True

        if not bAuthorized:
            return json.dumps(dict(state='0', message='token not valid') , ensure_ascii=False)

        bWaitForFinish = False
        if waitForFinish is not None and waitForFinish =='1':
            bWaitForFinish = True
        flag = 0      #算法存点，默认为1.
        if projId is None or pointList is None or valueList is None:
            rv = 'json post data error for some param in projId,point,value is none'
        elif len(pointList)!=len(valueList):
            rv = 'size of point list and data list not the same'
        else:
            projName = BEOPDataAccess.getInstance().getProjNameById(projId)
            if projName:
                #if int(flag) > 0:
                    #BEOPDataAccess.getInstance().setSaveSvrById(projId)
                rv = BEOPDataBufferManager.getInstance().setMutilData(projName,pointList,valueList, flag)

                #update buffer data right now
                rv = BEOPDataAccess.getInstance().updateSiteDataInBufferMul(projId,pointList,valueList)

                #触发一次点计算请求
                triggerOneCalculation_site(projId, pointList, bWaitForFinish, timeHappen, 'set_realtimedata_from_site')
                

                #save into mongo
                mintimeObj = datetime.now()
                if timeHappen is not None:
                    mintimeObj = timeHappen

                mintimeObj.replace(second=0)
                strCollectionName = BEOPDataAccess.getInstance().GetCollectionNameById(int(projId))
                conn, server_id = MongoConnManager.getHisConnWrite(int(projId), mintimeObj, mintimeObj)



                #write to mongodb
                strTimePointSaveList = ['m5']

                for strTimePoint in strTimePointSaveList:
                    cn = 'm5_data_{0}'.format(strCollectionName)

                    insertDataList = []

                    tWithFormat = Utils.TimeTool.trimTime(mintimeObj, 'm1')
                    strTimeWithFormat = tWithFormat.strftime('%Y-%m-%d %H:%M:%S')
                    for i in range(len(pointList)):
                        insertDataList.append((strTimeWithFormat, pointList[i], valueList[i],))
                    conn.InsertTableData(projId, insertDataList, cn)

                #保存进缓存历史hisdata
                #saveDataIntoHisBuffer(projId, insertDataList)

            else:
                rv = 'projId=%s is not exist in memcache'%(projId)
        timee = time.time()
        nCostSeconds = judgement_RequestTime(timeb, timee, data.get('token'))
        if nCostSeconds>10:
            print('set_mutile_realtimedata_by_projId cost too long, set to proj:%s by points count: %d' %(projId, len(pointList)))
    except Exception as e:
        print('set_mutile_realtimedata_by_projId error:' + e.__str__())
        app.logger.error('set_mutile_realtimedata_by_projId error:' + e.__str__())
    return json.dumps(rv , ensure_ascii=False)


@app.route('/set_mutile_realtimedata_by_projid',methods=['POST'])
def set_mutile_realtimedata_by_projId():#interface for algorithm
    try:
        rv = dict(info='none')
        timeb = time.time()
        data = request.get_json()
        projId = data.get('projId')
        pointList = data.get('point')
        valueList = data.get('value')
        flag = data.get('flag', 1)       #算法存点，默认为1.
        if projId is None or pointList is None or valueList is None:
            rv = 'json post data not good'
        else:
            projName = BEOPDataAccess.getInstance().getProjNameById(projId)
            if projName:
                #if int(flag) > 0:
                    #BEOPDataAccess.getInstance().setSaveSvrById(projId)
                rv = BEOPDataBufferManager.getInstance().setMutilData(projName,pointList,valueList, flag)
                #rv = BEOPDataAccess.getInstance().setRTDataMulVirtualByProj(projId,pointList,valueList)
            else:
                rv = 'projId=%s is not exist in memcache'%(projId)
        timee = time.time()
        nCostSeconds = judgement_RequestTime(timeb, timee, data.get('token'))
        if nCostSeconds>10:
            print('set_mutile_realtimedata_by_projId cost too long, set to proj:%s by points count: %d' %(projId, len(pointList)))
    except Exception as e:
        print('set_mutile_realtimedata_by_projId error:' + e.__str__())
        app.logger.error('set_mutile_realtimedata_by_projId error:' + e.__str__())
    return json.dumps(rv , ensure_ascii=False)

@app.route('/set_mutile_to_site_by_projname',methods=['POST'])
def set_mutile_to_site_by_projname():
    rv = dict(info='none')
    try:
        timeb = time.time()
        data = request.get_json()
        projName = data.get('db')
        point = data.get('point')
        value = data.get('value')
        rv = BEOPDataBufferManager.getInstance().setMutilDataToSite(projName,point,value)
        timee = time.time()
        judgement_RequestTime(timeb, timee, data.get('token'))
    except Exception as e:
        print('set_mutile_to_site_by_projname error:' + e.__str__())
        app.logger.error('set_mutile_to_site_by_projname error:' + e.__str__())
    return json.dumps(rv , ensure_ascii=False)


'''
  for Robert dtu server update realtime data
'''
@app.route('/set_mutile_realtimedata_by_tablename', methods=['POST'])
def set_mutile_realtimedata_by_tablename():#comefrom site of robert
    rv = None
    try:
        data = request.get_json()
        tableName = data.get('tname')
        pointList = data.get('point')
        valueList = data.get('value')
        dtuname = data.get('dtuname', '')
        pointTypeFlag = 0

        rv = BEOPDataBufferManager.getInstance().setMutiData_by_TableName(tableName, pointList, valueList, pointTypeFlag, dtuname)

        projIdList = BEOPDataAccess.getInstance().getProjIdListByRTTableName(tableName)
        for projId in projIdList:
            triggerOneCalculation(projId,pointList, False,None, 'set_mutile_realtimedata_by_tablename')
            #触发一次数据报警
            #triggerAlarmData(projId)

        if len(projIdList)==0:
            strErr = 'set_mutile_realtimedata_by_tablename: no project id for tablename:%s'%(tableName)
            print(strErr)
            app.logger.error(strErr)
    except Exception as e:
        print('set_mutile_realtimedata_by_tablename error:' + e.__str__())
        app.logger.error('set_mutile_realtimedata_by_tablename error:' + e.__str__())
    if rv is None:
        rv=dict(state=0, message='none rv when set multidata by table name')

    return json.dumps(rv, ensure_ascii=False)


@app.route('/v2/set_mutile_realtimedata_by_tablename', methods=['POST'])
def set_mutile_realtimedata_by_tablename_v2():
    rv = None
    try:
        data = request.get_json()
        tableName = data.get('tname')
        pointList = data.get('point')
        valueList = data.get('value')
        timeStamp = data.get('timeStamp')
        dtuname = data.get('dtuname','')
        if timeStamp is None:
            timeStamp = datetime.now()
        else:
            timeStamp = datetime.strptime(timeStamp,  '%Y-%m-%d %H:%M:%S')
        pointTypeFlag = 0
        rv = BEOPDataBufferManager.getInstance().setMutiData_by_TableName_v2(tableName, pointList, valueList, pointTypeFlag, timeStamp, dtuname)
        projIdList = BEOPDataAccess.getInstance().getProjIdListByRTTableName(tableName)
        for projId in projIdList:
            triggerOneCalculation(projId,pointList, False, timeStamp, '/v2/set_mutile_realtimedata_by_tablename')
        if len(projIdList)==0:
            strErr = 'set_mutile_realtimedata_by_tablename_v2: no project id for tablename:%s'%(tableName)
            print(strErr)
            app.logger.error(strErr)
    except Exception as e:
        print('set_mutile_realtimedata_by_tablename_v2 error:' + e.__str__())
        app.logger.error('set_mutile_realtimedata_by_tablename_v2 error:' + e.__str__())
    if rv is None:
        rv=dict(state=0, message='none rv when set multidata by table name')

    return json.dumps(rv, ensure_ascii=False)

@app.route('/save/saveDataToMongodb', methods=['POST'])
def saveDataToMongodb():
    rt = []
    try:
        data = request.get_json()
        dataList = data.get('saveList')
        rt = do_saveDataToMongodb(dataList)
    except Exception as e:
        print('saveDataToMongodb error:' + e.__str__())
        app.logger.error('saveDataToMongodb error:' + e.__str__())
    return json.dumps(rt)

def do_saveDataToMongodb(dataList):
    rt = []
    for item in dataList:
        projId = int(item.get('projId'))
        pointName = item.get('pointName')
        pointValue = item.get('pointValue')
        pointTime = item.get('timeAt')
        if isinstance(pointTime, str):
            try:
                pointTime = datetime.strptime(pointTime, '%Y-%m-%d %H:%M:%S')
            except Exception as e:
                print('timeAt in saveDataToMongodb params is %s:,' % (pointTime,) + e.__str__())
                app.logger.error('timeAt in saveDataToMongodb params is %s:,' % (pointTime,) + e.__str__())
            dbname = BEOPDataAccess.getInstance().getCollectionNameById(projId)
            collectionName = 'm5_data_' + dbname
            connList = MongoConnManager.getHisConn(projId)
            res = BEOPDataAccess.getInstance().mergesetHisData(projId, connList, pointName, pointValue, pointTime,
                                                               collectionName)
            rt.append({'result': res})
    return rt

@app.route('/set_realtimedata_by_projname',methods=['POST'])
def set_realtimedata_by_projname():

    data = request.get_json()
    rv=do_set_realtimedata_by_projname(data)
    return json.dumps(rv , ensure_ascii=False)


def do_set_realtimedata_by_projname(data):
    try:
        rv = "error"
        timeb = time.time()
        projName = data.get('db')
        point = data.get('point')
        value = data.get('value')
        projId = BEOPDataAccess.getInstance().getProjIdByName(projName)
        if projId:
            rv = BEOPDataAccess.getInstance().setRTDataVirtualByProj(projId, point,value) #BEOPDataBufferManager.getInstance().setData(projName,point,value)
        else:
            rv = "set_realtimedata_by_projname error:projId=%s"%(projId,)
        timee = time.time()
        judgement_RequestTime(timeb, timee, data.get('token'))
        return rv
    except Exception as e:
        print('set_realtimedata_by_projname error:' + e.__str__())
        app.logger.error('set_realtimedata_by_projname error:' + e.__str__())

@app.route('/set_realtimedata_by_projid',methods=['POST'])
def set_realtimedata_by_projid():
    try:
        data = request.get_json()
        rv = do_set_realtimedata_by_projid(data)
    except Exception as e:
        print('set_realtimedata_by_projid error:' + e.__str__())
        app.logger.error('set_realtimedata_by_projid error:' + e.__str__())
    return json.dumps(rv , ensure_ascii=False)

def do_set_realtimedata_by_projid(data):
    rv = ""
    projId = data.get('proj')
    point = data.get('point')
    value = data.get('value')
    if projId:
        rv = BEOPDataAccess.getInstance().setRTDataVirtualByProj(projId, point,value)
        # for tf in ['m1', 'm5', 'h1', 'd1','M1']:
        #     saveToMongo(projId, point, value, datetime.now(), tf)
    else:
        rv = "set_realtimedata_by_projid error:projId=%s"%(projId,)
    return rv



def saveToMongo(projId, point, pointValue, pointTime, timeFormat):
    if not pointTime:
        return json.dumps({'result':'pointTime is not in params'}, ensure_ascii = False)
    if isinstance(pointTime, str):
        pointTime = datetime.strptime(pointTime, '%Y-%m-%d %H:%M:%S')
    if timeFormat == 'm1':
        pointTime = pointTime.replace(second=0)
    elif timeFormat == 'm5':
        pointTime = pointTime.replace(second=0)
        nMinute = pointTime.minute
        nFormatMinute = int(5 * (floor(nMinute / 5)))
        if nFormatMinute >= 60:
            pointTime = pointTime + timedelta(hours=1)
            pointTime = pointTime.replace(minute=0)
        else:
            pointTime = pointTime.replace(minute=nFormatMinute)
    elif timeFormat == 'h1':
        pointTime = pointTime.replace(second=0)
        pointTime = pointTime.replace(minute=0)
    elif timeFormat == 'd1':
        pointTime = pointTime.replace(second=0)
        pointTime = pointTime.replace(minute=0)
        pointTime = pointTime.replace(hour=0)
    elif timeFormat == 'M1':
        pointTime = pointTime.replace(second=0)
        pointTime = pointTime.replace(minute=0)
        pointTime = pointTime.replace(hour=0)
        pointTime = pointTime.replace(day=1)
    collectionName = BEOPDataAccess.getInstance().GetCollectionNameById(projId)
    if not collectionName:
        return json.dumps({'result': 'collectionname is none, projId=%d'%(projId,)}, ensure_ascii = False)

    collectionName = 'm5_data_' + collectionName
    connList = MongoConnManager.getHisConn(projId)
    if not connList:
        return json.dumps({'result': 'connList is none, projId=%d'%(projId,)}, ensure_ascii = False)

    res = BEOPDataAccess.getInstance().mergesetHisData(projId, connList, point, pointValue, pointTime, collectionName)
    return res

#算法补数时调用
@app.route('/save/setHistoryDataMul', methods=['POST'])
def setHistoryDataMul():
    rt = []
    try:
        timeb = time.time()
        data = request.get_json()
        dataList = data.get('setList')
        if len(dataList)==0:
            rt.append({'result': 'dataList is empty'})
            return json.dumps(rt, ensure_ascii = False)

        for item in dataList:
            timeFormat = item.get('timeFormat')#useless
            projId = int(item.get('projId'))
            conMongodb = MongoConnManager.getHisConn(projId)
            collectionName = BEOPDataAccess.getInstance().GetCollectionNameById(projId)
            if not collectionName:
                rt.append({'result': 'collectionname is none, projId=%d'%(projId,)})
            else:
                collectionName = 'm5_data_' + collectionName
                pointName = item.get('pointName')
                pointValue = item.get('pointValue')
                pointTime = item.get('timeAt')
                if isinstance(pointTime, str):
                    pointTime = datetime.strptime(pointTime, '%Y-%m-%d %H:%M:%S')
                res = BEOPDataAccess.getInstance().mergesetHisData(projId, conMongodb, pointName, pointValue, pointTime, collectionName)
                if not res:
                    rt.append({'result':'write point to history failed, pointname=%s'%(pointName,)})
                else:
                    rt.append({'result': 'write point to history successful, pointname=%s'%(pointName,)})
        timee = time.time()
        rtDT = judgement_RequestTime(timeb, timee, data.get('token'))
        if rtDT > 50:
            print('setHistoryDataMul cost too long time.')
            app.logger.error('setHistoryDataMul cost too long time.')
    except Exception as e:
        print('setHistoryDataMul error:' + e.__str__())
        app.logger.error('setHistoryDataMul error:' + e.__str__())
    return json.dumps(rt, ensure_ascii = False)

@app.route('/save/setHistoryData', methods=['POST'])
def setHistoryData():
    try:
        rt = {'result':'failed'}
        timeb = time.time()
        data = request.get_json()
        projId = int(data.get('projId'))
        if not projId:
            return json.dumps({'result':'projId is not in params'}, ensure_ascii = False)
        timeFormat = data.get('timeFormat')
        if not timeFormat:
            return json.dumps({'result':'timeFormat is not in params'}, ensure_ascii = False)
        pointName = data.get('pointName')
        if not pointName:
            return json.dumps({'result':'pointName is not in params'}, ensure_ascii = False)
        pointValue = data.get('pointValue')
        if not pointValue:
            return json.dumps({'result':'pointValue is not in params'}, ensure_ascii = False)
        pointTime = data.get('timeAt')
        if not pointTime:
            return json.dumps({'result':'pointTime is not in params'}, ensure_ascii = False)
        if isinstance(pointTime, str):
            pointTime = datetime.strptime(pointTime, '%Y-%m-%d %H:%M:%S')
        if timeFormat == 'm1':
            pointTime = pointTime.replace(second=0)
        elif timeFormat == 'm5':
            pointTime = pointTime.replace(second=0)
            nMinute = pointTime.minute
            nFormatMinute = int(5 * (floor(nMinute / 5)))
            if nFormatMinute >= 60:
                pointTime = pointTime + timedelta(hours=1)
                pointTime = pointTime.replace(minute=0)
            else:
                pointTime = pointTime.replace(minute=nFormatMinute)
        elif timeFormat == 'h1':
            pointTime = pointTime.replace(second=0)
            pointTime = pointTime.replace(minute=0)
        elif timeFormat == 'd1':
            pointTime = pointTime.replace(second=0)
            pointTime = pointTime.replace(minute=0)
            pointTime = pointTime.replace(hour=0)
        elif timeFormat == 'M1':
            pointTime = pointTime.replace(second=0)
            pointTime = pointTime.replace(minute=0)
            pointTime = pointTime.replace(hour=0)
            pointTime = pointTime.replace(day=1)
        collectionName = BEOPDataAccess.getInstance().GetCollectionNameById(projId)
        if not collectionName:
            return json.dumps({'result': 'collectionname is none, projId=%d'%(projId,)}, ensure_ascii = False)

        collectionName = 'm5_data_' + collectionName

        connList = MongoConnManager.getHisConn(projId)
        if not connList:
            return json.dumps({'result': 'connList is none, projId=%d'%(projId,)}, ensure_ascii = False)
        res = BEOPDataAccess.getInstance().mergesetHisData(projId, connList, pointName, pointValue, pointTime, collectionName)
        rt = {'result': 'successful' if res else 'failed'}
        timee = time.time()
        judgement_RequestTime(timeb, timee, data.get('token'))
    except Exception as e:
        print('setHistoryData error:' + e.__str__())
        app.logger.error('setHistoryData error:' + e.__str__())
    return json.dumps(rt, ensure_ascii = False)

@app.route('/set_to_site_by_projname',methods=['POST'])
def set_to_site_by_projname():
    try:
        data = request.get_json()
        projEName = data.get('db')
        point = data.get('point')
        value = data.get('value')
        rv = BEOPDataBufferManager.getInstance().setDataToSite(projEName,point,value)
    except Exception as e:
        print('set_to_site_by_projname error:' + e.__str__())
        app.logger.error('set_to_site_by_projname error:' + e.__str__())
    return json.dumps(rv , ensure_ascii=False)

@app.route('/algorithm/addPointIntoRTDataTable',methods=['POST'])
def addPointName():
    try:
        data = request.get_json()
        projId = data.get('projId')
        pointNameList = data.get('point')
        pointValueList = data.get('value')
        rt = BEOPDataAccess.getInstance().addPointIntoRTDataTable(projId, pointNameList, pointValueList)
    except Exception as e:
        print('addPointName error:' + e.__str__())
        app.logger.error('addPointName error:' + e.__str__())
    if len(rt) != 0 or len(rt) == len(pointNameList):
        print('interface /algorithm/addPointIntoRTDataTable failed:rt=%s'%(str(rt),))
        logging.info('interface /algorithm/addPointIntoRTDataTable failed:rt=%s'%(str(rt),))
        return json.dumps({'result': 'fail', 'errorlist': rt},ensure_ascii=False)
    return json.dumps({'result': 'success'},ensure_ascii=False)


@app.route('/copy_realtimedata_between_project',methods=['POST'])
def copy_realtimedata_between_project():
    try:
        rv = None
        data = request.get_json()
        if data:
            rv = do_copy_realtimedata_between_project(data)
    except Exception as e:
        print('copy_realtimedata_between_project error:' + e.__str__())
        app.logger.error('copy_realtimedata_between_project error:' + e.__str__())
    return json.dumps(rv , ensure_ascii=False)

def do_copy_realtimedata_between_project(data):
    rv = None
    if isinstance(data, dict):
        projIdCopyFrom = data.get('projIdCopyFrom')
        projIdCopyTo = data.get('projIdCopyTo')
        rv = BEOPDataAccess.getInstance().copy_realtimedata_between_project(projIdCopyFrom, projIdCopyTo)

        # 触发点计算
        triggerOneCalculation(projIdCopyTo, None, False, None, 'copy_realtimedata_between_project')
    return rv

'''
  Robert send data save interface
'''
@app.route('/sync_data_to_mongodb',methods=['POST'])
def sync_data_to_mongodb():
    data = request.get_json()
    return do_sync_data_to_mongodb(data)

def do_sync_data_to_mongodb(data):
    try:
        if data:
            cn = None
            projId = -1 #不能改！！！
            dbname = data.get('dbname')
            if dbname:
                projectInfoList = RedisManager.get_project_info_list()
                if not projectInfoList:
                    BEOPDataAccess.getInstance().UpdateProjectInfo()
                    projectInfoList = RedisManager.get_project_info_list()
                if projectInfoList:
                    for item in projectInfoList:
                        mysqlname = item.get('mysqlname')
                        id = item .get('id')
                        if dbname and mysqlname:
                            if dbname.lower() == mysqlname.lower():
                                projId = int(id)
                                break

                    # if projId==-1:
                    #     strErr = 'sync_data_to_mongodb request recved(from %s), but cannot get right projectId by dbname(%s) in request'%(request.remote_addr,dbname,)
                    #     print(strErr)
                    #     app.logger.error(strErr)
                    #     return json.dumps({'error':'1','msg': strErr} , ensure_ascii=False)
                    timeformat = data.get('timeformat')
                    if timeformat not in ['m1','m5','h1','d1','month']:
                        return json.dumps({'error':'timeformat','msg':'timeformat must in [\'m1\',\'m5\',\'h1\',\'d1\',\'month\']'} , ensure_ascii=False)
                    hisdata = data.get('hisdata')
                    min_time = data.get('mintime')
                    mintimeObj = None
                    if min_time:
                        try:
                            mintimeObj = datetime.strptime(min_time, '%Y-%m-%d %H:%M:%S')
                        except Exception as e:
                            return json.dumps({'error':'mintime','msg':'%s'%(e.__str__(),)} , ensure_ascii=False)
                    max_time = data.get('maxtime')
                    maxtimeObj = None
                    if max_time:
                        try:
                            maxtimeObj = datetime.strptime(max_time, '%Y-%m-%d %H:%M:%S')
                        except Exception as e:
                            return json.dumps({'error':'maxtime','msg':'%s'%(e.__str__(),)} , ensure_ascii=False)
                    if hisdata:
                        try:
                            conn, server_id = MongoConnManager.getHisConnWrite(int(projId), mintimeObj, maxtimeObj)
                            strCollectionName = BEOPDataAccess.getInstance().GetCollectionNameById(int(projId))
                            if not strCollectionName:
                                strCollectionName = dbname
                                print('sync_data_to_mongodb:mysqlname name %s can not be found,auto set name to %s'%(dbname,strCollectionName,))
                                app.logger.error('sync_data_to_mongodb:mysqlname name %s can not be found,auto set name to %s'%(dbname,strCollectionName,))
                        except Exception as e:
                            strError = 'sync_data_to_mongodb error of dbname: %s:'%dbname + e.__str__()
                            print(strError)
                            app.logger.error(strError)
                            return json.dumps({'error':'proj name wrong','msg':'cannot find the proj id of name:%s, e:%s'%(dbname, str(e))} , ensure_ascii=False)
                        if conn and isinstance(server_id, int):
                            cn = 'm5_data_{0}'.format( strCollectionName)
                            strTableNameV2 = 'v2_data_{0}'.format( strCollectionName)
                            plm = RedisManager.get_project_locate_map()
                            if plm:
                                mi = plm.get('mongoInstance')
                                if mi:
                                    serverInfo = mi.get(str(server_id))
                                    if serverInfo:
                                        if serverInfo.get('writable'):
                                            length = conn.InsertTableData(projId, hisdata, cn)
                                            #nLength2 = conn.InsertTableData_v2(hisdata, strTableNameV2)
                                            #nLength2 = conn.updateHistoryDataMultiEx(hisdata, strTableNameV2)
                                            if length == 0:
                                                return json.dumps({'error':'error','msg':'insert into collection {0}, length is {1}'.format(cn, length)} , ensure_ascii=False)
                                            return json.dumps({'error':'ok','msg':'insert into collection {0}, length is {1}'.format(cn, length)} , ensure_ascii=False)
                                        else:
                                            print('interface /sync_data_to_mongodb:mongoserver is readonly')
                                            logging.info('interface /sync_data_to_mongodb:mongoserver is readonly')
                                            return json.dumps({'error':'mongoserver','msg':'mongoserver is readonly'} , ensure_ascii=False)
                                else:
                                    print('interface /sync_data_to_mongodb:mongoInstance in memcache is none')
                                    logging.info('interface /sync_data_to_mongodb:mongoInstance in memcache is none')
                                    return json.dumps({'error':'memcache','msg':'mongoInstance in memcache is none'} , ensure_ascii=False)
                            else:
                                print('interface /sync_data_to_mongodb:projectLocateMap in memcache is none')
                                logging.info('interface /sync_data_to_mongodb:projectLocateMap in memcache is none')
                                return json.dumps({'error':'memcache','msg':'projectLocateMap in memcache is none'} , ensure_ascii=False)
                        else:
                            if not conn:
                                print('interface /sync_data_to_mongodb:projId = %s, mongo conn is none, check locate_map table'%(projId,))
                                logging.info('interface /sync_data_to_mongodb:projId = %s, mongo conn is none, check locate_map table'%(projId,))
                                return json.dumps({'error':'hisdata','msg':'projId = %s, mongo conn is none, check locate_map table'%(projId,)} , ensure_ascii=False)
                            if not isinstance( server_id, int):
                                print('interface /sync_data_to_mongodb:projId = %s, server_id is none, check locate_map table'%(projId,))
                                logging.info('interface /sync_data_to_mongodb:projId = %s, server_id is none, check locate_map table'%(projId,))
                                return json.dumps({'error':'server_id','msg':'projId = %s, server_id is none, check locate_map table'%(projId,)} , ensure_ascii=False)
                    else:
                        print('interface /sync_data_to_mongodb:hisdata is none')
                        logging.info('interface /sync_data_to_mongodb:hisdata is none')
                        return json.dumps({'error':'hisdata','msg':'hisdata is none'} , ensure_ascii=False)
                else:
                    print('interface /sync_data_to_mongodb:projectInfoList in memcache is none')
                    logging.info('interface /sync_data_to_mongodb:projectInfoList in memcache is none')
                    return json.dumps({'error':'memcache','msg':'memcache is none'} , ensure_ascii=False)
            else:
                print('interface /sync_data_to_mongodb:param dbname is none')
                logging.info('interface /sync_data_to_mongodb:param dbname is none')
                return json.dumps({'error':'dbname','msg':'dbname is none'} , ensure_ascii=False)
    except Exception as e:
        strError = 'interface /sync_data_to_mongodb failed:'+e.__str__()
        print(strError)
        app.logger.error(strError)
        return json.dumps({'error':'interface','msg': strError} , ensure_ascii=False)

@app.route('/sync_data_to_mongodb_test',methods=['POST'])
def sync_data_to_mongodb_test():
    try:
        data = request.get_json()
        if data:
            cn = None
            projId = -1 #不能改！！！

            dbname = data.get('dbname')
            if dbname:
                projectInfoList = RedisManager.get_project_info_list()
                if not projectInfoList:
                    BEOPDataAccess.getInstance().UpdateProjectInfo()
                    projectInfoList = RedisManager.get_project_info_list()
                if projectInfoList:
                    for item in projectInfoList:
                        mysqlname = item.get('mysqlname')
                        id = item .get('id')
                        if dbname == mysqlname:
                            projId = int(id)
                            break

                    # if projId==-1:
                    #     strErr = 'sync_data_to_mongodb request recved(from %s), but cannot get right projectId by dbname(%s) in request'%(request.remote_addr,dbname,)
                    #     print(strErr)
                    #     app.logger.error(strErr)
                    #     return json.dumps({'error':'1','msg': strErr} , ensure_ascii=False)
                    timeformat = data.get('timeformat')
                    if timeformat not in ['m1','m5','h1','d1','month']:
                        return json.dumps({'error':'timeformat','msg':'timeformat must in [\'m1\',\'m5\',\'h1\',\'d1\',\'month\']'} , ensure_ascii=False)
                    hisdata = data.get('hisdata')
                    min_time = data.get('mintime')
                    mintimeObj = None
                    if min_time:
                        try:
                            mintimeObj = datetime.strptime(min_time, '%Y-%m-%d %H:%M:%S')
                        except Exception as e:
                            return json.dumps({'error':'mintime','msg':'%s'%(e.__str__(),)} , ensure_ascii=False)
                    max_time = data.get('maxtime')
                    maxtimeObj = None
                    if max_time:
                        try:
                            maxtimeObj = datetime.strptime(max_time, '%Y-%m-%d %H:%M:%S')
                        except Exception as e:
                            return json.dumps({'error':'maxtime','msg':'%s'%(e.__str__(),)} , ensure_ascii=False)
                    if hisdata:
                        try:
                            conn, server_id = MongoConnManager.getHisConnWriteTest(int(projId), mintimeObj, maxtimeObj)
                            strCollectionName = BEOPDataAccess.getInstance().GetCollectionNameById(int(projId))
                            if not strCollectionName:
                                strCollectionName = dbname
                                print('sync_data_to_mongodb:mysqlname name %s can not be found,auto set name to %s'%(dbname,strCollectionName,))
                                app.logger.error('sync_data_to_mongodb:mysqlname name %s can not be found,auto set name to %s'%(dbname,strCollectionName,))
                        except Exception as e:
                            strError = 'sync_data_to_mongodb error of dbname: %s:'%dbname + e.__str__()
                            print(strError)
                            app.logger.error(strError)
                            return json.dumps({'error':'proj name wrong','msg':'cannot find the proj id of name:%s'%dbname} , ensure_ascii=False)
                        if conn and isinstance(server_id, int):
                            cn = 'm5_data_{0}'.format( strCollectionName)
                            strTableNameV2 = 'v2_data_{0}'.format( strCollectionName)
                            plm = RedisManager.get_project_locate_map()
                            if plm:
                                mi = plm.get('mongoInstance')
                                if mi:
                                    serverInfo = mi.get(str(server_id))
                                    if serverInfo:
                                        if serverInfo.get('writable'):
                                            length = conn.InsertTableData(projId, hisdata, cn)
                                            #nLength2 = conn.InsertTableData_v2(hisdata, strTableNameV2)
                                            #nLength2 = conn.updateHistoryDataMultiEx(hisdata, strTableNameV2)
                                            return json.dumps({'error':'ok','msg':'insert into collection {0}, length is {1}'.format(cn, length)} , ensure_ascii=False)
                                        else:
                                            print('interface /sync_data_to_mongodb:mongoserver is readonly')
                                            logging.info('interface /sync_data_to_mongodb:mongoserver is readonly')
                                            return json.dumps({'error':'mongoserver','msg':'mongoserver is readonly'} , ensure_ascii=False)
                                else:
                                    print('interface /sync_data_to_mongodb:mongoInstance in memcache is none')
                                    logging.info('interface /sync_data_to_mongodb:mongoInstance in memcache is none')
                                    return json.dumps({'error':'memcache','msg':'mongoInstance in memcache is none'} , ensure_ascii=False)
                            else:
                                print('interface /sync_data_to_mongodb:projectLocateMap in memcache is none')
                                logging.info('interface /sync_data_to_mongodb:projectLocateMap in memcache is none')
                                return json.dumps({'error':'memcache','msg':'projectLocateMap in memcache is none'} , ensure_ascii=False)
                        else:
                            if not conn:
                                print('interface /sync_data_to_mongodb:projId = %s, mongo conn is none, check locate_map table'%(projId,))
                                logging.info('interface /sync_data_to_mongodb:projId = %s, mongo conn is none, check locate_map table'%(projId,))
                                return json.dumps({'error':'hisdata','msg':'projId = %s, mongo conn is none, check locate_map table'%(projId,)} , ensure_ascii=False)
                            if not isinstance( server_id, int):
                                print('interface /sync_data_to_mongodb:projId = %s, server_id is none, check locate_map table'%(projId,))
                                logging.info('interface /sync_data_to_mongodb:projId = %s, server_id is none, check locate_map table'%(projId,))
                                return json.dumps({'error':'server_id','msg':'projId = %s, server_id is none, check locate_map table'%(projId,)} , ensure_ascii=False)
                    else:
                        print('interface /sync_data_to_mongodb:hisdata is none')
                        logging.info('interface /sync_data_to_mongodb:hisdata is none')
                        return json.dumps({'error':'hisdata','msg':'hisdata is none'} , ensure_ascii=False)
                else:
                    print('interface /sync_data_to_mongodb:projectInfoList in memcache is none')
                    logging.info('interface /sync_data_to_mongodb:projectInfoList in memcache is none')
                    return json.dumps({'error':'memcache','msg':'memcache is none'} , ensure_ascii=False)
            else:
                print('interface /sync_data_to_mongodb:param dbname is none')
                logging.info('interface /sync_data_to_mongodb:param dbname is none')
                return json.dumps({'error':'dbname','msg':'dbname is none'} , ensure_ascii=False)
    except Exception as e:
        strError = 'interface /sync_data_to_mongodb failed:'+e.__str__()
        print(strError)
        app.logger.error(strError)
        return json.dumps({'error':'interface','msg': strError} , ensure_ascii=False)
    return json.dumps({'error':'interface','msg':'exception occurs'} , ensure_ascii=False)

@app.route('/sync_data_to_mongodb_by_projId',methods=['POST'])
def sync_data_to_mongodb_by_projId():
    try:
        data = request.get_json()
        if data:
            projId = data.get('projId')
            if projId:
                projId = int(projId)
                projectInfoList = RedisManager.get_project_info_list()
                if not projectInfoList:
                    BEOPDataAccess.getInstance().UpdateProjectInfo()
                    projectInfoList = RedisManager.get_project_info_list()
                bFound = False
                if projectInfoList:
                    for item in projectInfoList:
                        id = item .get('id')
                        if projId == int(id):
                            bFound = True
                            break
                    if not bFound:
                        strErr = 'sync_data_to_mongodb_by_projId request(from %s) recved, but projId=%d is not found in project List'%(request.remote_addr, projId,)
                        print(strErr)
                        app.logger.error(strErr)
                        return json.dumps({'error':'projId','msg': strErr} , ensure_ascii=False)
                    timeformat = data.get('timeformat')
                    if timeformat not in ['m1','m5','h1','d1','month']:
                        return json.dumps({'error':'timeformat','msg':'timeformat must in [\'m1\',\'m5\',\'h1\',\'d1\',\'month\']'} , ensure_ascii=False)
                    hisdata = data.get('hisdata')
                    min_time = data.get('mintime')
                    mintimeObj = None
                    if min_time:
                        try:
                            mintimeObj = datetime.strptime(min_time, '%Y-%m-%d %H:%M:%S')
                        except Exception as e:
                            return json.dumps({'error':'mintime','msg':'%s'%(e.__str__(),)} , ensure_ascii=False)
                    max_time = data.get('maxtime')
                    maxtimeObj = None
                    if max_time:
                        try:
                            maxtimeObj = datetime.strptime(max_time, '%Y-%m-%d %H:%M:%S')
                        except Exception as e:
                            return json.dumps({'error':'maxtime','msg':'%s'%(e.__str__(),)} , ensure_ascii=False)
                    if hisdata:
                        try:
                            conn, server_id = MongoConnManager.getHisConnWrite(projId, mintimeObj, maxtimeObj)
                            strCollectionName = BEOPDataAccess.getInstance().GetCollectionNameById(projId)
                        except Exception as e:
                            strError = 'sync_data_to_mongodb error of projId: %d:'%(projId) + e.__str__()
                            print(strError)
                            app.logger.error(strError)
                            return json.dumps({'error':'proj name wrong','msg':'cannot find the projId of %d'%(projId,)} , ensure_ascii=False)
                        if conn and isinstance(server_id, int):
                            cn = '{0}_data_{1}'.format('m5', strCollectionName)
                            plm = RedisManager.get_project_locate_map()
                            if plm:
                                mi = plm.get('mongoInstance')
                                if mi:
                                    serverInfo = mi.get(str(server_id))
                                    if serverInfo:
                                        if serverInfo.get('writable'):
                                            length = conn.InsertTableData(projId, hisdata, cn)
                                            # strTableNameV2 = 'v2_data_{0}'.format( strCollectionName)
                                            # nLength2 = conn.updateHistoryDataMultiEx(hisdata, strTableNameV2)

                                            return json.dumps({'error':'ok','msg':'insert into collection {0}, length is {1}'.format(cn, length)} , ensure_ascii=False)
                                        else:
                                            print('interface /sync_data_to_mongodb_by_projId:mongoserver is readonly')
                                            logging.info('interface /sync_data_to_mongodb_by_projId:mongoserver is readonly')
                                            return json.dumps({'error':'mongoserver','msg':'mongoserver is readonly'} , ensure_ascii=False)
                                else:
                                    print('interface /sync_data_to_mongodb_by_projId:mongoInstance in memcache is none')
                                    logging.info('interface /sync_data_to_mongodb_by_projId:mongoInstance in memcache is none')
                                    return json.dumps({'error':'memcache','msg':'mongoInstance in memcache is none'} , ensure_ascii=False)
                            else:
                                print('interface /sync_data_to_mongodb_by_projId:projectLocateMap in memcache is none')
                                logging.info('interface /sync_data_to_mongodb_by_projId:projectLocateMap in memcache is none')
                                return json.dumps({'error':'memcache','msg':'projectLocateMap in memcache is none'} , ensure_ascii=False)
                        else:
                            if not conn:
                                print('interface /sync_data_to_mongodb_by_projId:projId = %s, mongo conn is none, check locate_map table'%(projId,))
                                logging.info('interface /sync_data_to_mongodb_by_projId:projId = %s, mongo conn is none, check locate_map table'%(projId,))
                                return json.dumps({'error':'hisdata','msg':'projId = %s, mongo conn is none, check locate_map table'%(projId,)} , ensure_ascii=False)
                            if not server_id:
                                print('interface /sync_data_to_mongodb_by_projId:projId = %s, server_id is none, check locate_map table'%(projId,))
                                logging.info('interface /sync_data_to_mongodb_by_projId:projId = %s, server_id is none, check locate_map table'%(projId,))
                                return json.dumps({'error':'server_id','msg':'projId = %s, server_id is none, check locate_map table'%(projId,)} , ensure_ascii=False)
                    else:
                        print('interface /sync_data_to_mongodb_by_projId:hisdata is none')
                        logging.info('interface /sync_data_to_mongodb_by_projId:hisdata is none')
                        return json.dumps({'error':'hisdata','msg':'hisdata is none'} , ensure_ascii=False)
                else:
                    print('interface /sync_data_to_mongodb_by_projId:projectInfoList in memcache is none')
                    logging.info('interface /sync_data_to_mongodb_by_projId:projectInfoList in memcache is none')
                    return json.dumps({'error':'memcache','msg':'memcache is none'} , ensure_ascii=False)
            else:
                print('interface /sync_data_to_mongodb_by_projId:param dbname is none')
                logging.info('interface /sync_data_to_mongodb_by_projId:param dbname is none')
                return json.dumps({'error':'dbname','msg':'dbname is none'} , ensure_ascii=False)
    except Exception as e:
        print('interface /sync_data_to_mongodb_by_projId failed:'+e.__str__())
        app.logger.error('interface /sync_data_to_mongodb_by_projId failed:'+e.__str__())
    return json.dumps({'error':'interface','msg':'exception occurs'} , ensure_ascii=False)


@app.route('/sync_data_to_mongodb/<strTimePoint>/<projId>',methods=['GET'])
def synAllDBSvrDataOnce(strTimePoint, projId):       # strTimePoint: 'h1','d1','M1'
    if BEOPDataAccess.is_belong_to_local_cluster(projId):
        if projId and strTimePoint:
            return UpdateHistoryDataSvr(strTimePoint, projId)
    logging.warning('Project %s is not on current cluster with time point = %s!', projId, strTimePoint)
    return json.dumps({'error': 'interface', 'msg': 'Project %s is not on current cluster' % projId})


def UpdateHistoryDataSvr( strTimePoint, projId):
    try:
        strCollectionName = BEOPDataAccess.getInstance().GetCollectionNameById(int(projId))
        timeObject =  datetime.now()
        nYear = timeObject.year
        nMonth = timeObject.month
        nDay = timeObject.day
        nHour = timeObject.hour
        nMinute = timeObject.minute
        nSecond = timeObject.second

        if strTimePoint == 'm1':
            nSecond = 0
        elif strTimePoint == 'm5':
            nSecond = 0
            nMinute = 5*(floor(nMinute/5))
            if nMinute >= 60:
                nHour = nHour + 1
                nMinute = nMinute - 60
        elif strTimePoint == 'h1':
            nSecond = 0
            nMinute = 0
        elif strTimePoint == 'd1':
            nSecond = 0
            nMinute = 0
            nHour = 0
        elif strTimePoint == 'M1':
            nDay = 1
            nSecond = 0
            nMinute = 0
            nHour = 0
        else:
            print('unkonwn timeFormat')
        timeObject = datetime(nYear, nMonth, nDay, nHour, nMinute, nSecond)
        insertDataList = BEOPDataAccess.getInstance().getSVRPointValueList(projId, timeObject.strftime('%Y-%m-%d %H:%M:%S'))

        if len(insertDataList)==0:
             return json.dumps({'error':'ok','msg':'svr data in realtime table is none'} , ensure_ascii=False)

        conn, server_id = MongoConnManager.getHisConnWrite(int(projId), timeObject, timeObject)
        if conn and isinstance(server_id, int):
            cn = '{0}_data_{1}'.format('m5', strCollectionName)
            plm = RedisManager.get_project_locate_map()
            if plm:
                mi = plm.get('mongoInstance')
                if mi:
                    serverInfo = mi.get(str(server_id))
                    if serverInfo:
                        if serverInfo.get('writable'):
                            length = conn.InsertTableData(projId, insertDataList, cn)
                            # strTableNameV2 = 'v2_data_{0}'.format( strCollectionName)
                            # nLength2 = conn.updateHistoryDataMultiEx(insertDataList, strTableNameV2)

                            return json.dumps({'error':'ok','msg':'insert into collection {0}, length is {1}'.format(cn, length)} , ensure_ascii=False)
                        else:
                            print('UpdateHistoryDataSvr:mongoserver is readonly')
                            logging.info('UpdateHistoryDataSvr:mongoserver is readonly')
                            return json.dumps({'error':'mongoserver','msg':'mongoserver is readonly'} , ensure_ascii=False)
                else:
                    print('UpdateHistoryDataSvr:mongoInstance in memcache is none')
                    logging.info('UpdateHistoryDataSvr:mongoInstance in memcache is none')
                    return json.dumps({'error':'memcache','msg':'mongoInstance in memcache is none'} , ensure_ascii=False)
            else:
                print('UpdateHistoryDataSvr:projectLocateMap in memcache is none')
                logging.info('UpdateHistoryDataSvr:projectLocateMap in memcache is none')
                return json.dumps({'error':'memcache','msg':'projectLocateMap in memcache is none'} , ensure_ascii=False)
        else:
            print('UpdateHistoryDataSvr:mongo conn of project is None')
            logging.info('UpdateHistoryDataSvr:mongo conn of project is None')
            return json.dumps({'error':'mongodb','msg':'mongo conn of project is None'} , ensure_ascii=False)
    except Exception as e:
        print('UpdateHistoryDataSvr failed:'+e.__str__())
        app.logger.error('UpdateHistoryDataSvr failed:'+e.__str__())
    return json.dumps({'error':'UpdateHistoryDataSvr','msg':'exception occurs'} , ensure_ascii=False)

@app.route('/sync_data_to_mongodb/<timeFormat>/<projId>/<timeAt>',methods=['POST'])
def synAllDBFlag2DataOnce(timeFormat, projId, timeAt):
    data = request.get_json()
    return UpdateHistoryDataFlag2(timeFormat, projId, timeAt, data)

def UpdateHistoryDataFlag2( strTimePoint, projId, strTime, pointList):
    try:
        strCollectionName = BEOPDataAccess.getInstance().GetCollectionNameById(int(projId))
        strMysqlTableName = BEOPDataAccess.getInstance().getProjMysqldb(int(projId))
        timeObject = datetime.strptime(strTime, '%Y-%m-%d %H:%M:%S')
        insertDataList = BEOPDataAccess.getInstance().getFlag2PointValueList(strMysqlTableName,  timeObject.strftime('%Y-%m-%d %H:%M:%S'), pointList)
        if len(insertDataList)==0:
             return json.dumps({'error':'ok','msg':'svr data in realtime table is none'} , ensure_ascii=False)
        conn, server_id = MongoConnManager.getHisConnWrite(int(projId), timeObject, timeObject)
        if conn and isinstance(server_id, int):
            cn = '{0}_data_{1}'.format('m5', strCollectionName)
            plm = RedisManager.get_project_locate_map()
            if plm:
                mi = plm.get('mongoInstance')
                if mi:
                    serverInfo = mi.get(str(server_id))
                    if serverInfo:
                        if serverInfo.get('writable'):
                            length = conn.InsertTableData(projId, insertDataList, cn)
                            strTableNameV2 = 'v2_data_{0}'.format( strCollectionName)
                            # nLength2 = conn.updateHistoryDataMultiEx(insertDataList, strTableNameV2)

                            return json.dumps({'error':'ok','msg':'insert into collection {0}, length is {1}'.format(cn, length)} , ensure_ascii=False)
                        else:
                            print('UpdateHistoryDataFlag2:mongoserver is readonly')
                            logging.info('UpdateHistoryDataFlag2:mongoserver is readonly')
                            return json.dumps({'error':'mongoserver','msg':'mongoserver is readonly'} , ensure_ascii=False)
                else:
                    print('UpdateHistoryDataFlag2:mongoInstance in memcache is none')
                    logging.info('UpdateHistoryDataFlag2:mongoInstance in memcache is none')
                    return json.dumps({'error':'memcache','msg':'mongoInstance in memcache is none'} , ensure_ascii=False)
            else:
                print('UpdateHistoryDataFlag2:projectLocateMap in memcache is none')
                logging.info('UpdateHistoryDataFlag2:projectLocateMap in memcache is none')
                return json.dumps({'error':'memcache','msg':'projectLocateMap in memcache is none'} , ensure_ascii=False)
        else:
            print('UpdateHistoryDataFlag2:mongo conn of project is None')
            logging.info('UpdateHistoryDataFlag2:mongo conn of project is None')
            return json.dumps({'error':'mongodb','msg':'mongo conn of project is None'} , ensure_ascii=False)
    except Exception as e:
        print('UpdateHistoryDataFlag2 failed:'+e.__str__())
        app.logger.error('UpdateHistoryDataFlag2 failed:'+e.__str__())
    return json.dumps({'error':'UpdateHistoryDataFlag2','msg':'exception occurs'} , ensure_ascii=False)

@app.route('/getProjIdList', methods=['GET'])
def get_projidlist():
    idList = []
    try:
        projectInfoList = RedisManager.get_project_info_list()
        if projectInfoList:
            for item in projectInfoList:
                id = item .get('id')
                idList.append(id)
    except Exception as e:
        print('interface getProjIdList failed:'+e.__str__())
        app.logger.error('interface getProjIdList failed:'+e.__str__())
    return json.dumps(dict(error='ok', rv=idList) , ensure_ascii=False)

@app.route('/file/uploadFile/<fileName>', methods=['POST'])
def uploadFile(fileName):
    rt = "failed"
    try:
        dirPath = sys.path[0] + '/' + 'files'
        if not os.path.exists(dirPath):
            os.makedirs(dirPath)
        if request.data:
            filePath = dirPath + '/' + fileName
            with open(filePath, 'wb') as f:
                count = f.write(request.data)
                if count > 0:
                    rt = "successful"
    except Exception as e:
        print('interface uploadFile error:'+e.__str__())
        app.logger.error('interface uploadFile error:'+e.__str__())
        rt = "failed"
    return json.dumps(rt , ensure_ascii=False)

@app.route('/file/downloadFile/<fileName>', methods=['GET'])
def downloadFile(fileName):
    rt = None
    try:
        dirPath = sys.path[0] + '/' + 'files'
        filePath = dirPath + '/' + fileName
        with open(filePath, 'rb') as f:
            all_content = f.read()
            if all_content:
                rt = all_content
    except Exception as e:
        print('interface uploadFile error:'+e.__str__())
        app.logger.error('interface uploadFile error:'+e.__str__())
        return json.dumps(e.__str__(), ensure_ascii= False)
    return rt

@app.route('/sync_data_to_mongodb/smart',methods=['POST'])
def sync_data_to_mongodb_smart():
    try:
        data = request.get_json()
        if data:
            cn = None
            projId = -1 #不能改！！！

            dbname = data.get('dbname')
            if dbname:
                projectInfoList =  RedisManager.get_project_info_list()
                if not projectInfoList:
                    BEOPDataAccess.getInstance().UpdateProjectInfo()
                    projectInfoList = RedisManager.get_project_info_list()
                if projectInfoList:
                    for item in projectInfoList:
                        mysqlname = item.get('mysqlname')
                        id = item .get('id')
                        if dbname == mysqlname:
                            projId = int(id)
                            break
                    hisdata = data.get('hisdata')
                    min_time = data.get('mintime')
                    mintimeObj = None
                    if min_time:
                        try:
                            mintimeObj = datetime.strptime(min_time, '%Y-%m-%d %H:%M:%S')
                        except Exception as e:
                            return json.dumps({'error':'mintime','msg':'%s'%(e.__str__(),)} , ensure_ascii=False)
                    max_time = data.get('maxtime')
                    maxtimeObj = None
                    if max_time:
                        try:
                            maxtimeObj = datetime.strptime(max_time, '%Y-%m-%d %H:%M:%S')
                        except Exception as e:
                            return json.dumps({'error':'maxtime','msg':'%s'%(e.__str__(),)} , ensure_ascii=False)
                    if hisdata:
                        try:
                            conn, server_id = MongoConnManager.getHisConnWrite(int(projId), mintimeObj, maxtimeObj)
                            strCollectionName = BEOPDataAccess.getInstance().GetCollectionNameById(int(projId))
                            if not strCollectionName:
                                strCollectionName = dbname
                                print('sync_data_to_mongodb_smart:mysqlname name %s can not be found,auto set name to %s'%(dbname,strCollectionName,))
                                app.logger.error('sync_data_to_mongodb_smart:mysqlname name %s can not be found,auto set name to %s'%(dbname,strCollectionName,))
                        except Exception as e:
                            strError = 'sync_data_to_mongodb_smart error of dbname: %s:'%dbname + e.__str__()
                            print(strError)
                            app.logger.error(strError)
                            return json.dumps({'error':'proj name wrong','msg':'cannot find the proj id of name:%s'%dbname} , ensure_ascii=False)
                        if conn and isinstance(server_id, int):
                            cn = '{0}_data_{1}'.format('m5', strCollectionName)
                            plm = RedisManager.get_project_locate_map()
                            if plm:
                                mi = plm.get('mongoInstance')
                                if mi:
                                    serverInfo = mi.get(str(server_id))
                                    if serverInfo:
                                        if serverInfo.get('writable'):
                                            conn.UpdateTableData(int(projId), hisdata, cn)
                                        else:
                                            print('interface /sync_data_to_mongodb_smart:mongoserver is readonly')
                                            logging.info('interface /sync_data_to_mongodb_smart:mongoserver is readonly')
                                            return json.dumps({'error':'mongoserver','msg':'mongoserver is readonly'} , ensure_ascii=False)
                                else:
                                    print('interface /sync_data_to_mongodb_smart:mongoInstance in memcache is none')
                                    logging.info('interface /sync_data_to_mongodb_smart:mongoInstance in memcache is none')
                                    return json.dumps({'error':'memcache','msg':'mongoInstance in memcache is none'} , ensure_ascii=False)
                            else:
                                print('interface /sync_data_to_mongodb_smart:projectLocateMap in memcache is none')
                                logging.info('interface /sync_data_to_mongodb_smart:projectLocateMap in memcache is none')
                                return json.dumps({'error':'memcache','msg':'projectLocateMap in memcache is none'} , ensure_ascii=False)
                            return json.dumps({'error':'ok'} , ensure_ascii=False)
                        else:
                            if not conn:
                                print('interface /sync_data_to_mongodb:projId = %s, mongo conn is none, check locate_map table'%(projId,))
                                logging.info('interface /sync_data_to_mongodb:projId = %s, mongo conn is none, check locate_map table'%(projId,))
                                return json.dumps({'error':'hisdata','msg':'projId = %s, mongo conn is none, check locate_map table'%(projId,)} , ensure_ascii=False)
                            if not server_id:
                                print('interface /sync_data_to_mongodb_smart:projId = %s, server_id is none, check locate_map table'%(projId,))
                                logging.info('interface /sync_data_to_mongodb_smart:projId = %s, server_id is none, check locate_map table'%(projId,))
                                return json.dumps({'error':'server_id','msg':'projId = %s, server_id is none, check locate_map table'%(projId,)} , ensure_ascii=False)
                    else:
                        print('interface /sync_data_to_mongodb_smart:hisdata is none')
                        logging.info('interface /sync_data_to_mongodb_smart:hisdata is none')
                        return json.dumps({'error':'hisdata','msg':'hisdata is none'} , ensure_ascii=False)
                else:
                    print('interface /sync_data_to_mongodb_smart:projectInfoList in memcache is none')
                    logging.info('interface /sync_data_to_mongodb_smart:projectInfoList in memcache is none')
                    return json.dumps({'error':'memcache','msg':'memcache is none'} , ensure_ascii=False)
            else:
                print('interface /sync_data_to_mongodb_smart:param dbname is none')
                logging.info('interface /sync_data_to_mongodb_smart:param dbname is none')
                return json.dumps({'error':'dbname','msg':'dbname is none'} , ensure_ascii=False)
    except Exception as e:
        print('interface /sync_data_to_mongodb_smart failed:'+e.__str__())
        app.logger.error('interface /sync_data_to_mongodb_smart failed:'+e.__str__())
    return json.dumps({'error':'interface','msg':'exception occurs'} , ensure_ascii=False)

def get_timeformat_by_string(strTime):
    timeformatList = ['m1']
    try:
        timeObj = datetime.strptime(strTime, '%Y-%m-%d %H:%M:%S')
        if timeObj.minute % 5 == 0:
            timeformatList.append('m5')
        if timeObj.minute == 0:
            timeformatList.append('h1')
        if timeObj.minute == 0 and timeObj.hour == 0:
            timeformatList.append('d1')
        if timeObj.minute == 0 and timeObj.hour == 0 and timeObj.day == 1:
            timeformatList.append('month')
    except Exception as e:
        print('get_timeformat_by_string failed:'+e.__str__())
        app.logger.error('get_timeformat_by_string failed:'+e.__str__())
    return timeformatList

@app.route('/remove/history_data/<projId>/<pointName>/<format>', methods=['GET'])
def removeHistoryData(projId,pointName,format):
    rt = False
    try:
        if not MongoConnManager._connDict:
            MongoConnManager.genMongoConnMember()
        strCollectionName = BEOPDataAccess.getInstance().GetCollectionNameById(int(projId))
        if strCollectionName:
            cnList = ['m5_data_{0}'.format(strCollectionName)]
            for cn in cnList:
                for connAddr in MongoConnManager._connDict:
                    conn = MongoConnManager._connDict.get(connAddr)
                    if conn:
                        conn.deleteOnePoint(cn, pointName)
            rt = True
    except Exception as e:
        print('interface removeHistoryData failed:'+e.__str__())
        app.logger.error('interface removeHistoryData failed:'+e.__str__())
    return json.dumps(rt , ensure_ascii=False)

@app.route('/remove/realtime_data/<projId>', methods=['post'])
def removeRealtimeData(projId):
    rt = False
    try:
        pointList=request.get_json()
        if projId and pointList:
            rt = BEOPDataAccess.getInstance().deletePointFromMysql(int(projId), pointList)
    except Exception as e:
        print('interface removeRealtimeData failed:'+e.__str__())
        app.logger.error('interface removeRealtimeData failed:'+e.__str__())
    return json.dumps(rt , ensure_ascii=False)

@app.route('/remove/realtime_data_all/<int:projId>', methods=['post'])
def removeRealtimeData_All(projId):
    rt = False
    try:
        rt = BEOPDataAccess.getInstance().deletePointFromMysql_All(projId)
    except Exception as e:
        print('interface removeRealtimeData failed:'+e.__str__())
        app.logger.error('interface removeRealtimeData failed:'+e.__str__())
    return json.dumps(rt , ensure_ascii=False)

@app.route('/get_user_info', methods=['POST'])
def getUserInfoByIds():
    rt = {}
    try:
        data = request.get_json()
        if data:
            rt = BEOPDataAccess.getInstance().getUserInfoByIds(data)
    except Exception as e:
        print('interface getMobileByIds failed:'+e.__str__())
        app.logger.error('interface getMobileByIds failed:'+e.__str__())
    return json.dumps(rt , ensure_ascii=False)

@app.route('/get_last_update_time', methods=['GET'])
def getDUTLastUpdatetime():
    rt = {}
    try:
        rt = BEOPDataAccess.getInstance().getDUTLastUpdatetime()
    except Exception as e:
        print('interface getDUTLastUpdatetime failed:'+e.__str__())
        app.logger.error('interface getDUTLastUpdatetime failed:'+e.__str__())
    return json.dumps(rt , ensure_ascii=False)

@app.route('/get_rtdata_flag_0', methods=['post'])
def getFlag0PointValueList():
    try:
        rt={}
        data = request.get_json()
        if data:
            projId=data.get('projId')
            rt=BEOPDataAccess.getInstance().getFlag0PointValueList(projId)
    except Exception as e:
        print('getFlag0PointValueList failed:'+e.__str__())
        app.logger.error('getFlag0PointValueList failed:'+e.__str__())
    return json.dumps(rt , ensure_ascii=False)


@app.route('/get_hisdata_mysql_buffer', methods=['post'])
def get_hisdata_mysql_buffer():
    try:
        rt={}
        data = request.get_json()
        if data:
            projId=data.get('projId')
            t_time=data.get('t_time')
            pointList=data.get('pointList')
            rt=BEOPDataAccess.getInstance().get_hisdata_mysql_buffer(projId,t_time,pointList)
            print(rt)
    except Exception as e:
        print('getFlag0PointValueList failed:'+e.__str__())
        app.logger.error('getFlag0PointValueList failed:'+e.__str__())
    return json.dumps(rt , ensure_ascii=False)


@app.route('/create_rttable_all', methods=['GET'])
def create_rttable_by_project():
    rt = []
    try:
        rt = BEOPDataAccess.getInstance().create_rttable_by_project()
    except Exception as e:
        print('create_rttable_by_project failed:'+e.__str__())
        app.logger.error('create_rttable_by_project failed:'+e.__str__())
    return json.dumps(rt , ensure_ascii=False)


@app.route('/set_history_data_ex_to_mongodb',methods=['POST'])
def set_history_data_ex_to_mongodb():
    """
    {
        "dbname":"beopdata_rcscarrier", "mintime": "2017-05-31 00:00:00", "maxtime": "2017-05-31 00:00:00",
        "hisdata": [
            ["2017-05-31 00:00:00", "projKpiTree", "Hello World"]
        ]
    }
    :return:
    """
    try:
        data = request.get_json()
        if data is None:
            return json.dumps({'error': 'Data is none.'}, ensure_ascii=False)

        cn = None
        projId = -1
        mintimeObj = None
        maxtimeObj = None
        dbname = data.get('dbname')
        min_time = data.get('mintime')
        max_time = data.get('maxtime')
        hisdata = data.get('hisdata')

        if hisdata is None:
            return json.dumps({'error': 'History data is none.'}, ensure_ascii=False)

        if dbname is None:
            return json.dumps({'error': 'Db name is none.'}, ensure_ascii=False)
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


        if min_time:
            mintimeObj = datetime.strptime(min_time, '%Y-%m-%d %H:%M:%S')
        if max_time:
            maxtimeObj = datetime.strptime(max_time, '%Y-%m-%d %H:%M:%S')
        conn, server_id = MongoConnManager.getHisConnWrite(int(projId), mintimeObj, maxtimeObj)
        if conn and isinstance(server_id, int):
            conn, server_id = MongoConnManager.getHisConnWrite(int(projId), mintimeObj, maxtimeObj)
            strCollectionName = BEOPDataAccess.getInstance().GetCollectionNameById(int(projId))
            if not strCollectionName:
                strCollectionName = dbname
                print('set_history_data_ex_to_mongodb:mysqlname name %s can not be found,auto set name to %s' % (dbname, strCollectionName,))
                app.logger.error('set_history_data_ex_to_mongodb:mysqlname name %s can not be found,auto set name to %s' % (dbname, strCollectionName,))
                return

            if conn and isinstance(server_id, int):
                cn = 'v2_data_{0}'.format(strCollectionName)
                plm = RedisManager.get_project_locate_map()
                if plm:
                    mi = plm.get('mongoInstance')
                    if mi:
                        serverInfo = mi.get(str(server_id))
                        if serverInfo:
                            if serverInfo.get('writable'):
                                length = conn.updateHistoryDataMultiEx(hisdata, cn)
                                return json.dumps({'error': 'ok', 'msg': 'insert into collection {0}, length is {1}'.format(cn, length)}, ensure_ascii=False)
                            else:
                                print('interface /set_history_data_ex_to_mongodb:mongoserver is readonly')
                                logging.info('interface /set_history_data_ex_to_mongodb:mongoserver is readonly')
                                return json.dumps({'error': 'mongoserver', 'msg': 'mongoserver is readonly'}, ensure_ascii=False)
                    else:
                        print('interface /set_history_data_ex_to_mongodb:mongoInstance in memcache is none')
                        logging.info('interface /set_history_data_ex_to_mongodb:mongoInstance in memcache is none')
                        return json.dumps({'error': 'memcache', 'msg': 'mongoInstance in memcache is none'}, ensure_ascii=False)
                else:
                    print('interface /set_history_data_ex_to_mongodb:projectLocateMap in memcache is none')
                    logging.info('interface /set_history_data_ex_to_mongodb:projectLocateMap in memcache is none')
                    return json.dumps({'error': 'memcache', 'msg': 'projectLocateMap in memcache is none'}, ensure_ascii=False)
            else:
                if not conn:
                    print('interface /set_history_data_ex_to_mongodb:projId = %s, mongo conn is none, check locate_map table' % (projId,))
                    logging.info('interface /set_history_data_ex_to_mongodb:projId = %s, mongo conn is none, check locate_map table' % (projId,))
                    return json.dumps({'error': 'hisdata', 'msg': 'projId = %s, mongo conn is none, check locate_map table' % (projId,)}, ensure_ascii=False)
                if not isinstance(server_id, int):
                    print('interface /set_history_data_ex_to_mongodb:projId = %s, server_id is none, check locate_map table' % (projId,))
                    logging.info('interface /set_history_data_ex_to_mongodb:projId = %s, server_id is none, check locate_map table' % (projId,))
                    return json.dumps({'error': 'server_id', 'msg': 'projId = %s, server_id is none, check locate_map table' % (projId,)}, ensure_ascii=False)
    except Exception as e:
        strError = 'set_history_data_ex_to_mongodb error:' + e.__str__()
        print(strError)
        app.logger.error(strError)
        return json.dumps({'error': 'set_history_data_ex_to_mongodb', 'msg': strError}, ensure_ascii=False)
    return json.dumps({'error': 'set_history_data_ex_to_mongodb', 'msg': 'exception occurs'}, ensure_ascii=False)

@app.route('/copy_from_points', methods=['POST'])
def CopyFromPoints():
    """
    针对bacnet点的拷贝
    :return: True if successful else  False
    """
    rt = False
    try:
        data = request.get_json()
        if data:
            for key, value in data.items():
                projId = key
                copyItem = value
                mysqlName = BEOPDataAccess.getInstance().getProjMysqldb(projId)
                if mysqlName:
                    rtTableName = 'rtdata_' + mysqlName
                    if copyItem:
                        for sourcePt, destinationPtArr in copyItem.items():
                            rtdata = BEOPDataAccess.getInstance().getRTDataRealTimeAll(rtTableName, [sourcePt])
                            if rtdata:
                                getItem = rtdata.get(sourcePt)
                                if getItem:
                                    timeStamp = getItem.get('time')
                                    value = getItem.get('value')
                                    dtuName = getItem.get('dtuname')
                                    rt_1 = BEOPDataAccess.getInstance().updateRealtimeInputDataMul_by_tableName_v2(rtTableName,
                                                                                                            destinationPtArr,
                                                                                                            [value]*len(destinationPtArr),
                                                                                                            0,
                                                                                                            timeStamp,
                                                                                                            dtuName)
                                    rt_2 = BEOPDataAccess.getInstance().updateRealtimeDataBufferMultiple_by_projid(projId,
                                                                                                            destinationPtArr,
                                                                                                            [value] * len(destinationPtArr),
                                                                                                            [timeStamp] * len(destinationPtArr),
                                                                                                            0)
                                    rt = rt_1.get('state') == 1 and rt_2.get('state') == 1
    except Exception as e:
        print(e)
        return json.dumps(False, ensure_ascii = False)
    return json.dumps(rt, ensure_ascii = True)
