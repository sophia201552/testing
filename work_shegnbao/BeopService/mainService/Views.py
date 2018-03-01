__author__ = 'David'

from mainService import app
import logging
from flask import url_for, redirect, json, jsonify
from flask import request
#from mod_UnitTest.testData import *
from mod_DataAccess.BEOPDataAccess import *
from mod_Common import svn
from mod_Common.BackupandRecovery import *
from mod_Common.StringMatch_group_new import *
from mod_UnitTest.MongoLogSlice import MongoDBLogSlice
from mod_DataAccess.BEOPDataBufferManager import *


@app.route('/')
def index():
    return "service working!"


@app.route('/revision')
def revision():
    """
    Get the revision information of the service
    :return: { current_rev: INT, latest_rev: INT }
    """
    try:
        rev_info = svn.get_local_revision_info(app.config.get('SVN_REPO_URL'))
        return jsonify(dict(
            current_rev=int(rev_info.get('current_rev')),
            latest_rev=int(rev_info.get('latest_rev'))))
    except Exception:
        logging.error('Failed to get local revision info!', exc_info=True, stack_info=True)
        return jsonify(dict(current_rev=None, latest_rev=None))


@app.route('/dtu/getDTUNameList', methods=['POST'])
def getDTUList():
    dtuNameList = []
    try:
        data = request.get_json()
        projIdList = data.get('projIdList')
        dtuNameList = BEOPDataAccess.getInstance().getProjDTUList(projIdList)
    except Exception as e:
        print('interface /dtu/getDTUNameList failed:'+e.__str__())
        app.logger.error('interface /dtu/getDTUNameList failed:'+e.__str__())
    return jsonify(dict(dtuNameList = dtuNameList))


@app.route('/getSaveSvrProjIdList', methods=['GET'])
def getSaveSvrProjIdList():
    rt = []
    try:
        rt = BEOPDataAccess.getInstance().getSaveSvrProjIdList()
    except Exception as e:
        print('getSaveSvrProjIdList failed:'+e.__str__())
        app.logger.error('getSaveSvrProjIdList failed:'+e.__str__())
    return json.dumps(rt,ensure_ascii=False)


@app.route('/user/getuseridbyusername', methods=['POST'])
def get_userId_by_userName():
    rt = {'state': 0, 'data': [], 'error': ''}
    try:
        pass
    except Exception as e:
        print('get_userId_by_userName error:' + e.__str__())
        app.logger.error(e.__str__())
    return jsonify(rt)


@app.route('/v1/data/get_history_at_time', methods=['POST'])
def get_history_at_time():
    """
    域名/v1/data/get_history_at_time
    define: 获取某个时刻的点值（点以点名数组方式传递）
    sample:
    {
        "projId": 374,
        "pointList":["gas_05_accH", "Accum_jixiufuzhu_ElecUseM"],
        "bSearchNearest": true,
        "time":"2017-04-06 00:05:00"
    }
    其中 bSearchNearest参数的意义是：
       true: 如果该时刻直接获取不到，是否进一步全库向前搜索一个月内的数据找时间最相近的
       false: 只取确定的该时刻的准确数据，如果没有就返回

       time: 支持任意时刻，根据请求需求自定需要什么时间

    返回：
      [0.0, 7969.9]
      数组里第几个元素对应的就是第几个点名的该时刻的值
    """
    rt = []
    try:
        data = request.get_json()
        if data:
            rt = do_get_history_at_time(data)
    except Exception as e:
        strMsg = 'get_history_at_time:'+e.__str__()
        app.logger.error(strMsg)
        return json.dumps(strMsg, ensure_ascii = False)
    return json.dumps(rt, ensure_ascii = False)


def do_get_history_at_time(data):
    rt = []
    projId = data.get('projId', None)
    if not projId:
        return json.dumps('param projId is invalid', ensure_ascii=False)
    projId = int(projId)
    pointList = data.get('pointList', [])
    if not pointList or not isinstance(pointList, list) or len(pointList) <= 0:
        return json.dumps('param pointList is invalid', ensure_ascii=False)
    strTime = data.get('time', '')
    bSearchNearest = data.get('bSearchNearest', False)
    timeObj = None
    if not strTime:
        return json.dumps('param time is invalid', ensure_ascii=False)
    try:
        timeObj = datetime.strptime(strTime, '%Y-%m-%d %H:%M:%S')
    except Exception:
        return json.dumps('time format should be "%Y-%m-%d %H:%M:%S"', ensure_ascii=False)
    timeFormat = 'm5'
    if timeObj.day == 1 and timeObj.hour == 0 and timeObj.minute == 0 and timeObj.second == 0:
        timeFormat = 'M1'
    elif timeObj.hour == 0 and timeObj.minute == 0 and timeObj.second == 0:
        timeFormat = 'd1'
    elif timeObj.minute == 0 and timeObj.second == 0:
        timeFormat = 'h1'
    elif timeObj.minute % 5 == 0 and timeObj.second == 0:
        timeFormat = 'm5'
    elif timeObj.second == 0:
        timeFormat = 'm1'
    his = BEOPDataAccess.getInstance().get_history_data_padded(projId, pointList, strTime, strTime, timeFormat,
                                                               bSearchNearest)
    if isinstance(his, list) and len(his) > 0 and ('error' not in his[0]):
        for name in pointList:
            for item in his:
                h = item.get('history', [])
                n = item.get('name')
                if name == n:
                    if 'error' in item:
                        rt = None
                    else:
                        if 'history' in item:
                            if h and len(h) > 0:
                                try:
                                    rt.append(float(h[0].get('value')))
                                except Exception:
                                    rt.append(h[0].get('value'))
                            else:
                                rt.append(None)
                    break
            else:
                rt.append(None)
    return rt


@app.route('/tag/analysisTags', methods=['POST'])
def analysisTags():
    rt = {'msg': 'ok', 'tag': []}
    try:
        data = request.get_json()
        if data:
            pointList = data.get('pointList', [])
            group = data.get('group','')
            if not pointList:
                raise Exception('pointList is Empty')
            if not group:
                raise Exception('group is Empty')
            CSMatch = CStringMatch()
            CSMatch.ReadAllGroupPointFromList(pointList)
            tagNum, tagList = CSMatch.GroupEquipment()
            if tagNum and tagList:
                rt['tag'] = []
                for key in tagNum.keys():
                    rt['tag'].append({'num':tagNum.get(key, 0), 'list':tagList.get(key, [])})
    except Exception as e:
        rt['msg'] = str(e)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/table/createBufferTable/<int:projId>', methods=['GET'])
def createBufferTable(projId):
    rt = True
    try:
        BEOPDataAccess.getInstance().createTableBufferRTTableIfNotExist(projId)
        BEOPDataAccess.getInstance().createTableBufferRTTableVPointIfNotExist(projId)
    except Exception:
        rt = False
    return json.dumps(rt, ensure_ascii=False)


@app.route('/logRotate', methods=['GET'])
def mongo_log_slice():
    rt = {}
    try:
        obj = MongoDBLogSlice()
        rt = obj.run()
        del obj
    except Exception as err:
        app.logger.error("mongo_log_slice error: {}".format(str(err)))
    return json.dumps(rt, ensure_ascii=False)

@app.route('/getProjIdWithCloudPoints')
def getProjIdWithCloudPoints():
    """
    获取donegine中project表mysqlname不为空且buffer中存在rtdata_id的项目
    """
    rt = []
    try:
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
                rt.append(rd_item[0])
    except Exception as e:
        print('getProjIdWithCloudPoints error:' + e.__str__())
        logging.error(e.__str__())
    return jsonify({'data':rt})


@app.route('/maintenance/getLongValueDetailFromRealData')
def getLongValueDetailFromRealData():
    """
    内容长度超过200个字符的项目和点名清单
    :return: {data:[{'id':project表对应的id,'name':project表中的mysqlname字段,'points':[{'name':实时表中的pointname，'value':实时表中的pointvalue}]}]}
    """
    rt = {'data': []}
    try:
        allRealDataTable = BEOPDataAccess.getInstance().get_valid_mysqlName()
        allRTTableName = BEOPDataAccess.getInstance().all_rt_table()

        rt_map = {}
        for rt_item in allRTTableName:
            project_id = int(re.search('(\d+)', rt_item[0]).group())
            if not rt_map.get(project_id):
                rt_map[project_id] = []
            rt_map.get(project_id).append(rt_item[0])

        tables_map = {}
        mysql_map = {}
        for rd_item in allRealDataTable:
            if rt_map.get(rd_item[0]):
                tables_map[rd_item[0]] = rt_map.get(rd_item[0])
                mysql_map[rd_item[0]] = rd_item[1]

        for key in tables_map:
            item = tables_map.get(key)
            for tableName in item:
                allRealPoints = BEOPDataAccess.getInstance().get_all_real_data(tableName)
                if allRealPoints:
                    points = []
                    for real_point in allRealPoints:
                        points.append({'name': real_point[0], 'value': real_point[1], 'table': tableName})
                    rt['data'].append({'id': int(key), 'name': mysql_map.get(key), 'points': points})

    except Exception as e:
        print('getLongValueDetailFromRealData error:' + e.__str__())
        app.logger.error(e.__str__())
    return jsonify(rt)


@app.route('/updateManulData', methods=['POST'])
def updateManulData():
    """
    更新指定点在实时表中的时间
    参数：项目的id，更新时间（目前id只可能是396）
    :return:{time}
    """
    try:
        data = request.get_json()
        client_ip = request.remote_addr
        logging.info('updateManulData called from %s with %s!', client_ip, data)
    except Exception:
        logging.error('Failed to log caller info!', exc_info=True, stack_info=True)

    rt = {}
    try:
        data = request.get_json()
        if data:
            pointsDict = {396: ['WQMonit001_Temp', 'WQMonit001_PH', 'WQMonit001_TDS', 'WQMonit001_COD', 'WQMonit001_ZD',
                                'WQMonit001_SD', 'WQMonit001_TP', 'WQMonit001_TN', 'WQMonit001_DO', 'WQMonit001_NH3-N',
                                'WQMonit002_Temp', 'WQMonit002_PH', 'WQMonit002_TDS', 'WQMonit002_COD', 'WQMonit002_ZD',
                                'WQMonit002_SD', 'WQMonit002_TP', 'WQMonit002_TN', 'WQMonit002_DO', 'WQMonit002_NH3-N',
                                'WQMonit003_Temp', 'WQMonit003_PH', 'WQMonit003_TDS', 'WQMonit003_COD', 'WQMonit003_ZD',
                                'WQMonit003_SD', 'WQMonit003_TP', 'WQMonit003_TN', 'WQMonit003_DO', 'WQMonit003_NH3-N',
                                'WQMonit004_Temp', 'WQMonit004_PH', 'WQMonit004_TDS', 'WQMonit004_COD', 'WQMonit004_ZD',
                                'WQMonit004_SD', 'WQMonit004_TP', 'WQMonit004_TN', 'WQMonit004_DO', 'WQMonit004_NH3-N',
                                'WQMonit004_Temp', 'WQMonit004_PH', 'WQMonit004_TDS', 'WQMonit004_COD', 'WQMonit004_ZD',
                                'WQMonit004_SD', 'WQMonit004_TP', 'WQMonit004_TN', 'WQMonit004_DO', 'WQMonit004_NH3-N',
                                'WQMonit005_Temp', 'WQMonit005_PH', 'WQMonit005_TDS', 'WQMonit005_COD', 'WQMonit005_ZD',
                                'WQMonit005_SD', 'WQMonit005_TP', 'WQMonit005_TN', 'WQMonit005_DO', 'WQMonit005_NH3-N',
                                'WQMonit006_Temp', 'WQMonit006_PH', 'WQMonit006_TDS', 'WQMonit006_COD', 'WQMonit006_ZD',
                                'WQMonit006_SD', 'WQMonit006_TP', 'WQMonit006_TN', 'WQMonit006_DO', 'WQMonit006_NH3-N',
                                'WQMonit007_Temp', 'WQMonit007_PH', 'WQMonit007_TDS', 'WQMonit007_COD', 'WQMonit007_ZD',
                                'WQMonit007_SD', 'WQMonit007_TP', 'WQMonit007_TN', 'WQMonit007_DO', 'WQMonit007_NH3-N',
                                'WQMonit008_Temp', 'WQMonit008_PH', 'WQMonit008_TDS', 'WQMonit008_COD', 'WQMonit008_ZD',
                                'WQMonit008_SD', 'WQMonit008_TP', 'WQMonit008_TN', 'WQMonit008_DO', 'WQMonit008_NH3-N']}
            time = datetime.strptime(data.get('time', None), '%Y-%m-%d %H:%M:%S')
            id = data.get('id', None)
            rt = {}
            points = pointsDict.get(int(id))
            realDataTable = 'rtdata_' + BEOPDataAccess.getInstance().getMysqlNameById(id)
            strSQL = 'UPDATE %s set time="%s" WHERE pointname in (%s)' % (
                realDataTable, time, str(pointsDict.get(id)).replace('[', '').replace(']', ''))
            dbrv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('beopdoengine', strSQL, ())
            if not dbrv:
                raise Exception('update beopdoengine failed')
            realDataBufferTable = 'rtdata_' + str(id)
            stringSQL = 'UPDATE %s set time="%s" WHERE pointname in (%s)' % (
                realDataBufferTable, time, str(pointsDict.get(id)).replace('[', '').replace(']', ''))
            bufferRV = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('beopdatabuffer', stringSQL, ())
            if not bufferRV:
                raise Exception('update beopdatabuffer failed')
            selectSQL = 'SELECT pointname, pointvalue from %s WHERE pointname in (%s)' % (
                realDataBufferTable, str(pointsDict.get(id)).replace('[', '').replace(']', ''))
            selectDBRV = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.op_db_query('beopdatabuffer', selectSQL,
                                                                                            ())
            rt = dict(selectDBRV)
    except Exception as e:
        print('updateManulData' + e.__str__())
        app.logger.error(e.__str__())
    return jsonify(rt)


@app.route('/get_history_data_at_time', methods=['POST'])
def get_history_data_at_time():
    rt = {'error': 1}
    try:
        data = request.get_json()
        pointList = data.get('pointList', [])
        projId = data.get('projId')
        timeStr = data.get('timeStr')
        if timeStr and projId:
            rv = BEOPDataAccess.getInstance().get_history_data_at_time(projId, pointList, timeStr)
            rt.update(dict(data=rv, error=0))
    except Exception as e:
        rt.update(dict(msg=e.__str__()))
    return json.dumps(rt)


@app.route('/setMutilDataToBufferTable', methods=['POST'])
def setMutilDataToBufferTable():
    rt = {"state": 0}
    try:
        data = request.get_json()
        projId = data.get('projId')
        pointList = data.get('pointList')
        valueList = data.get('valueList')
        strTimeList = data.get('strTimeList')
        pointTypeFlag = data.get('pointTypeFlag')
        rt = BEOPDataBufferManager.getInstance().setMutilDataToBufferTable(projId, pointList, valueList, strTimeList,
                                                                      pointTypeFlag)
    except Exception as e:
        print('updateManulData' + e.__str__())
        app.logger.error(e.__str__())
    return jsonify(rt)


@app.route('/project/dtu/getAllDtuIsOffline/<int:projId>/<startTime>/<endTime>', methods=['GET'])
def getAllDtuIsOffline(projId, startTime, endTime):
    """
    查询起止时间内是否全部掉线
    :return:
    """
    try:
        rt = BEOPDataAccess.getInstance().getAllDtuIsOffline(projId, startTime, endTime)
        response = jsonify({"data": rt})
    except Exception as e:
        print('getAllDtuOfflineInfo' + e.__str__())
        app.logger.error(e.__str__())
        response = jsonify({"error": True})
        response.status_code = 500
    return response


@app.route('/email/sendlog', methods=['POST'])
def InsertIntoMongoLog():
    try:
        data = request.get_json()
        if data:
            subject = data.get('subject')
            recipients = data.get('recipients')
            cc = data.get('cc')
            bcc = data.get('bcc')
            if MongoConnManager.getConfigConn().InsertEmailLogIntoMongo(subject, recipients, cc, bcc):
                response = jsonify({"error":False})
    except Exception as e:
        app.logger.error(e.__str__())
        response = jsonify({"error":True})
        response.status_code = 500
    return response


@app.route('/task/setHeartbeat/<threadName>/<time>', methods=['GET'])
def setTaskHeartbeat(threadName, time):
    return json.dumps(RedisManager.set_task_heartbeat_time(threadName, time), ensure_ascii=False)


@app.route('/task/getHeartbeat/<threadName>', methods=['GET'])
def getTaskHeartbeat(threadName):
    rt = RedisManager.get_task_heartbeat_time(threadName)
    if isinstance(rt, datetime):
        rt = rt.strftime('%Y-%m-%d %H:%M:%S')
    return json.dumps(rt, ensure_ascii=False)
