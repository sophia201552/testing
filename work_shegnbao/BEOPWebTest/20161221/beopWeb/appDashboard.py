from beopWeb import app
import logging
from flask import json, jsonify
from datetime import datetime, timedelta
from beopWeb.BEOPDataAccess import BEOPDataAccess
from beopWeb.mod_workflow import Task


@app.route('/appDashboard/project/summary/<projectId>', methods=['GET'])
def getSummary(projectId):
    rt = False
    try:
        dbname = 'diagnosis'

        if len(projectId) > 0:
            sql = ('select topic, dashboard from app where projectId=%s' )
            rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query(dbname, sql, (projectId,))
            for topic, dashboard in rv:
                rt = {'dashboardList': dashboard.replace('\r', '').replace('\n', '').replace('\'', '\"'), 
                      'summaryList': topic.replace('\r', '').replace('\n', '').replace('\'', '\"')}
    except Exception as e:
        print('appDbGetSummary failed')
        print(e.__str__())
        logging.error(e.__str__())
        logging.exception(e)

    return json.dumps(rt, ensure_ascii=False)


@app.route('/Dashboard/EquipmentIntactRate/<int:projId>', methods=['GET'])
def get_equipmentIntactRate_old(projId):
    '''
    David 20161124
    SQL写的不忍直视，在一些不可描述的项目里，Equipment统计可能不准确。
    '''
    data = [{'BuildingId': 6, 'BuildingName': '机房', 'IntactRate': '45%',
             'Detail': [{'SubBuildingId': 4, 'SubBuildingName': '冷水机房',
                         'IntactRate': '30%',
                         'Detail': [{'EquipmentId': 435345, 'EquipmentName': '冷机1',
                                    'State': 1}]}]}]  # 0：异常， 1：正常
    rt = {'status': 0, 'message': None, 'data': []}
    try:
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projId)
        if dbname:
            nowTime = datetime.now()
            startTime = (nowTime - timedelta(days=30)).strftime('%Y-%m-%d 00:00:00')
            endTime = nowTime.strftime('%Y-%m-%d %H:%M:%S')
            strSQL = 'SELECT ez.Id, ez.NAME, ez.BuildingId, ez.BuildingName, '\
                     'ez.SubBuildingId, ez.SubBuildingName, nf.EquipmentId '\
                     'FROM (SELECT e.Id, e.`Name`, '\
                     'z.BuildingId, z.BuildingName, '\
                     'z.SubBuildingId, z.SubBuildingName '\
                     'FROM %s_diagnosis_equipments AS e '\
                     'INNER JOIN %s_diagnosis_zones AS z ON e.ZoneId = z.Id '\
                     'WHERE e.`Name` REGEXP "[0-9]" GROUP BY e.Id ) AS ez '\
                     'LEFT JOIN (SELECT f.EquipmentId FROM %s_diagnosis_notices AS n '\
                     'LEFT JOIN %s_diagnosis_faults AS f ON n.FaultId = f.Id '\
                     'WHERE n.Time <= "%s" AND n.Time >= "%s" GROUP BY f.EquipmentId) '\
                     'AS nf ON ez.Id = nf.EquipmentId' % (dbname, dbname, dbname, dbname, endTime, startTime)
            dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
            zone_dict = {}
            for item in dbrv:
                buildingId = item[2]
                subBuildingId = item[4]
                if buildingId in zone_dict.keys():
                    if subBuildingId in zone_dict.get(buildingId).get('Detail').keys():
                        zone_dict.get(buildingId).get('Detail').get(subBuildingId).get('Detail').append({'EquipmentId': item[0],
                                                                                                         'EquipmentName': item[1],
                                                                                                         'State': 0 if item[6] else 1})
                    else:
                        zone_dict.get(buildingId).get('Detail').update({subBuildingId: {'SubBuildingId': subBuildingId,
                                                                                        'SubBuildingName': item[5],
                                                                                        'Detail': [{'EquipmentId': item[0],
                                                                                                    'EquipmentName': item[1],
                                                                                                    'State': 0 if item[6] else 1}]}})
                else:
                    zone_dict.update({buildingId: {'BuildingId': buildingId, 'BuildingName': item[3],
                                                   'Detail': {subBuildingId: {'SubBuildingId': subBuildingId,
                                                                              'SubBuildingName': item[5],
                                                                              'Detail': [{'EquipmentId': item[0],
                                                                                          'EquipmentName': item[1],
                                                                                          'State': 0 if item[6] else 1}]}}}})
            if zone_dict:
                for buildingId in zone_dict.keys():
                    building_temp = zone_dict.get(buildingId)
                    building = {'BuildingId': building_temp.get('BuildingId'),
                                'BuildingName': building_temp.get('BuildingName'),
                                'IntactRate': computing_equipment_intact_rate(building_temp.get('Detail')),
                                'Detail': []}
                    for subBuildingId in building_temp.get('Detail').keys():
                        subBuilding_temp = building_temp.get('Detail').get(subBuildingId)
                        subBuilding = {'SubBuildingId': subBuilding_temp.get('SubBuildingId'),
                                       'SubBuildingName': subBuilding_temp.get('SubBuildingName'),
                                       'IntactRate': computing_equipment_intact_rate(subBuilding_temp.get('Detail')),
                                       'Detail': subBuilding_temp.get('Detail')}
                        building.get('Detail').append(subBuilding)
                    rt.get('data').append(building)
        else:
            rt.update({'status': 0, 'message': 'Invalid parameter'})
    except Exception as e:
        print('get_equipmentIntactRate error:' + e.__str__())
        logging.error(e.__str__)
        rt.update({'status': 0, 'message': e.__str__()})
    return jsonify(rt)


def computing_equipment_intact_rate(data):
    rt = None
    if isinstance(data, dict):
        good_equipment = 0
        total_number = 0
        for key in data.keys():
            item = data.get(key)
            total_number = total_number + len(item.get('Detail'))
            for i in item.get('Detail'):
                if i.get('State'):
                    good_equipment = good_equipment + 1
        rt = '%0.2f' % ((good_equipment / total_number) * 100,) + '%'
    elif isinstance(data, list):
        rt = computing_equipment_intact_rate_for_pandect(data)
    return rt


@app.route('/Dashboard/workOrderStatistics/<int:projId>', methods=['GET'])
def get_workOrderStatistics(projId):
    '''
    David 20161124
    接口返回各人新增工单的数量，各人平均响应的时间，各人完成工单的数量
    select TargetExecutor from beopdata_101_diagnosis_faults where TargetExecutor is not NULL GROUP BY TargetExecutor
    '''
    data = {'NewOrder': {'Kobe': 9, 'Allen': 2},
            'ResponseTime': {'Kobe': 3600000, 'Allen': 7200000},
            'FinishingOrder': {'Kobe': 8, 'Allen': 1}}
    rt = {'status': 0, 'message': None, 'data': {}}
    try:
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projId)
        if dbname:
            strSQL = 'SELECT TargetExecutor FROM %s_diagnosis_faults '\
                     'WHERE TargetExecutor IS NOT NULL '\
                     'GROUP BY TargetExecutor' % dbname
            dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
            userId_userName = {}
            for item in dbrv:
                userId_userName.update({item[0]: dbAccess.getUserNameById(item[0])})
            nowTime = datetime.now()
            startTime = (nowTime - timedelta(days=30)).strftime('%Y-%m-%d 00:00:00')
            endTime = nowTime.strftime('%Y-%m-%d %H:%M:%S')
            strSQL = 'SELECT f.TargetExecutor, n.OrderId, TIMESTAMPDIFF(SECOND,n.Time,n.CheckTime), n.`Status` '\
                     'FROM %s_diagnosis_notices as n '\
                     'LEFT JOIN %s_diagnosis_faults as f ON f.Id = n.FaultId '\
                     'WHERE n.Time <= "%s" AND n.Time >= "%s" '\
                     'AND n.OrderId <> "0" GROUP BY n.OrderId' % (dbname, dbname, endTime, startTime)
            dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
            executorId_orderId = {}
            responseTime_orderId = {}
            finishingOrder_orderId = {}
            data = {'NewOrder': {}, 'ResponseTime': {}, 'FinishingOrder': {}}
            for item in dbrv:
                try:
                    executor = item[0]
                    orderId = item[1]
                    responseTime = item[2]
                    if executor in executorId_orderId.keys():
                        executorId_orderId.get(executor).append(orderId)
                        if int(item[3]) == 2:
                            finishingOrder_orderId.get(executor).append(orderId)
                        if responseTime:
                            responseTime_orderId.get(executor).append(responseTime)
                    else:
                        executorId_orderId.update({executor: [orderId]})
                        if int(item[3]) == 2:
                            finishingOrder_orderId.update({executor: [orderId]})
                        else:
                            finishingOrder_orderId.update({executor: []})
                        if responseTime:
                            responseTime_orderId.update({executor: [responseTime]})
                        else:
                            responseTime_orderId.update({executor: []})
                except Exception as e:
                    pass
            if userId_userName:
                for userId in userId_userName.keys():
                    username = userId_userName.get(userId)
                    if username:
                        if executorId_orderId.get(userId):
                            data.get('NewOrder').update({username: len(executorId_orderId.get(userId))})
                            data.get('FinishingOrder').update({username: len(finishingOrder_orderId.get(userId))})
                        else:
                            data.get('NewOrder').update({username: 0})
                            data.get('FinishingOrder').update({username: 0})
                        if responseTime_orderId.get(userId):
                            data.get('ResponseTime').update({username: sum(responseTime_orderId.get(userId)) // len(responseTime_orderId.get(userId))})
                        else:
                            data.get('ResponseTime').update({username: None})
                rt.update({'data': data})
        else:
            rt.update({'status': 0, 'message': 'Invalid parameter'})
    except Exception as e:
        print('get_workOrderStatistics error:' + e.__str__())
        logging.error(e.__str__)
        rt.update({'status': 0, 'message': e.__str__()})
    return jsonify(rt)


def get_order_state_by_orderId(orderId):
    rt = None
    task = Task(orderId)
    workflowTask = task.get_raw_task()
    if workflowTask:
        rt = int(workflowTask.get('status'))
    return rt


def get_orderId(orderId):
    return Task(orderId).task_id


@app.route('/Dashboard/EquipmentIntactRate/pandect/<int:projId>', methods=['GET'])
def get_equipmentIntactRate_pandect_old(projId):
    '''
    David 20161128
    '''
    data = [{'BuildingId': 6, 'BuildingName': '机房', 'IntactRate': '45%'}]
    rt = {'status': 0, 'message': None, 'data': []}
    try:
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projId)
        if dbname:
            nowTime = datetime.now()
            startTime = (nowTime - timedelta(days=30)).strftime('%Y-%m-%d 00:00:00')
            endTime = nowTime.strftime('%Y-%m-%d %H:%M:%S')
            strSQL = 'SELECT ez.Id, ez.NAME, ez.BuildingId, ez.BuildingName, '\
                     'nf.EquipmentId FROM (SELECT e.Id, e.`Name`, z.BuildingId, '\
                     'z.BuildingName FROM %s_diagnosis_equipments AS e '\
                     'INNER JOIN %s_diagnosis_zones AS z ON e.ZoneId = z.Id '\
                     'WHERE e.`Name` REGEXP "[0-9]" GROUP BY e.Id) AS ez '\
                     'LEFT JOIN (SELECT f.EquipmentId FROM %s_diagnosis_notices AS n '\
                     'LEFT JOIN %s_diagnosis_faults AS f ON n.FaultId = f.Id '\
                     'WHERE n.Time <= "%s" AND n.Time >= "%s" '\
                     'GROUP BY f.EquipmentId) AS nf '\
                     'ON ez.Id = nf.EquipmentId' % (dbname, dbname, dbname, dbname, endTime, startTime)
            dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
            building_dict = {}
            for item in dbrv:
                buildingId = item[2]
                if buildingId in building_dict.keys():
                    building_dict.get(buildingId).append({'BuildingId': buildingId,
                                                          'BuildingName': item[3],
                                                          'State': 0 if item[4] else 1})
                else:
                    building_dict.update({buildingId: [{'BuildingId': buildingId,
                                                        'BuildingName': item[3],
                                                        'State': 0 if item[4] else 1}]})
            if building_dict:
                for building in building_dict.keys():
                    rt.get('data').append({'BuildingId': building_dict.get(building)[0].get('BuildingId'),
                                           'BuildingName': building_dict.get(building)[0].get('BuildingName'),
                                           'IntactRate': computing_equipment_intact_rate_for_pandect(building_dict.get(building))})
        else:
            rt.update({'status': 0, 'message': 'Invalid parameter'})
    except Exception as e:
        print('get_equipmentIntactRate_pandect error:' + e.__str__())
        logging.error(e.__str__())
        rt.update({'status': 0, 'message': e.__str__()})
    return jsonify(rt)


def computing_equipment_intact_rate_for_pandect(dict_list):
    rt = None
    good_equipment = 0
    total_number = len(dict_list)
    for item in dict_list:
        state = item.get('State')
        if state:
            good_equipment = good_equipment + 1
    rt = '%0.2f' % ((good_equipment / total_number) * 100,) + '%'
    return rt


@app.route('/appDashboard/EquipmentIntactRate/pandect/<int:projId>', methods=['GET'])
@app.route('/appDashboard/EquipmentIntactRate/pandect/<int:projId>/<lang>', methods=['GET'])
def get_equipmentIntactRate_pandect(projId, lang='zh-CN'):
    '''
    David 20161130
    '''
    rt = {'status': 0, 'message': None, 'data': []}
    try:
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projId)
        lang = select_the_language(lang)
        if projId in [421]:
            sensor = 'Sensor'
        sensor = 'Sensor' if lang == 'en-US' else '传感器'
        if dbname:
            nowTime = datetime.now()
            startTime = (nowTime - timedelta(days=30)).strftime('%Y-%m-%d 00:00:00')
            endTime = nowTime.strftime('%Y-%m-%d %H:%M:%S')
            system_dict, equipmentId_systemId = get_equipment_all(projId, dbname)
            if system_dict:
                strSQL = 'SELECT n.Id, f.EquipmentId, f.FaultType, e.`Name` FROM %s_diagnosis_faults AS f '\
                         'LEFT JOIN %s_diagnosis_notices AS n ON n.FaultId = f.Id '\
                         'LEFT JOIN %s_diagnosis_equipments AS e ON f.EquipmentId = e.Id '\
                         'WHERE n.Time <= "%s" AND n.Time >= "%s" '\
                         'GROUP BY e.`Name`' % (dbname, dbname, dbname, endTime, startTime)
                dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
                if dbrv:
                    for item in dbrv:
                        if int(item[2]) == 1:
                            subSysName = equipmentId_systemId.get(item[3])
                            if subSysName is not None:
                                system_dict.get(subSysName).update({'AbnormalNum': system_dict.get(subSysName).get('AbnormalNum') + 1})
                        elif int(item[2]) == 2:
                            if sensor not in system_dict.keys():
                                n = get_realpoint_count(dbname)
                                system_dict.update({sensor: {'AbnormalNum': 0, 'SubSystemName': sensor,
                                                             'Equipments': [1] * n}})
                            system_dict.get(sensor).update({'AbnormalNum': system_dict.get(sensor).get('AbnormalNum') + 1})
                    l = list(system_dict.keys())
                    l.sort()
                    for keys in l:
                        sys = system_dict.get(keys)
                        totalNum = len(sys.get('Equipments'))
                        goodNum = len(sys.get('Equipments')) - sys.get('AbnormalNum')
                        rt.get('data').append({'SubSystemName': sys.get('SubSystemName'),
                                               'IntactRate': computing_intact_rate(goodNum, totalNum),
                                               'GoodNum': goodNum, 'TotalNum': totalNum})
            else:
                rt.update({'status': 0, 'message': 'The project no diagnostic information'})
        else:
            rt.update({'status': 0, 'message': 'Invalid parameter'})
    except Exception as e:
        print('get_equipmentIntactRate_pandect error:' + e.__str__())
        logging.error(e.__str__())
    return jsonify(rt)


def get_equipment_all(projId, mysqlName):
    '''
    David 20161130
    '''
    system_dict = {}
    equipmentId_systemId = {}
    try:
        dbAccess = BEOPDataAccess.getInstance()
        strSQL = 'SELECT Id, `Name`, SystemId, SystemName, SubSystemName, LocationInfo '\
                 'FROM %s_diagnosis_equipments '\
                 'WHERE SubSystemName IS NOT NULL AND SubSystemName <> "传感器" '\
                 'AND SubSystemName <> "Sensor" '\
                 'GROUP BY `Name`' % mysqlName
        dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
        if dbrv:
            for item in dbrv:
                subSystemName = item[4]
                equipmentName = item[1]
                equipmentId_systemId.update({equipmentName: subSystemName})
                if subSystemName in system_dict.keys():
                    if item[5] in system_dict.get(subSystemName).get('Subitem').keys() and item[5]:
                        num = system_dict.get(subSystemName).get('Subitem').get(item[5]).get('TotalNum')
                        system_dict.get(subSystemName).get('Subitem').get(item[5]).update({'TotalNum': num + 1})
                    elif item[5]:
                        system_dict.get(subSystemName).get('Subitem').update({item[5]: {'TotalNum': 1,
                                                                                        'LocationInfo': item[5],
                                                                                        'Detail': []}})
                    system_dict.get(subSystemName).get('Equipments').append({'EquipmentId': item[0],
                                                                             'EquipmentName': item[1],
                                                                             'LocationInfo': item[5]})
                else:
                    system_dict.update({subSystemName: {'SystemId': item[2], 'SystemName': item[3], 'Detail': [],
                                                        'AbnormalNum': 0, 'SubSystemName': subSystemName,
                                                        'Subitem': {item[5]: {'LocationInfo': item[5],
                                                                              'Detail': [],
                                                                              'TotalNum': 1}} if item[5] else {},
                                                        'Equipments': [{'EquipmentId': item[0],
                                                                        'EquipmentName': item[1],
                                                                        'LocationInfo': item[5]}]}})
    except Exception as e:
        print('get_equipment_all error:' + e.__str__())
        logging.error(e.__str__())
    return system_dict, equipmentId_systemId


def computing_intact_rate(goodNum, totalNum):
    return '%0.2f' % ((goodNum / totalNum) * 100,) + '%'


def get_realpoint_count(mysqlname):
    rt = None
    try:
        dbAccess = BEOPDataAccess.getInstance()
        strSQL = 'SELECT COUNT(*) FROM rtdata_%s where flag = 0'%mysqlname
        dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query_one(app.config['DATABASE'], strSQL, ())
        if dbrv:
            rt = int(dbrv[0])
    except Exception as e:
        print('get_realpoint_count error:' + e.__str__())
        logging.error(e.__str__())
    return rt


@app.route('/appDashboard/EquipmentIntactRate/<int:projId>', methods=['GET'])
@app.route('/appDashboard/EquipmentIntactRate/<int:projId>/<lang>', methods=['GET'])
def get_equipmentIntactRate(projId, lang='zh-CN'):
    '''
    David 20161130
    '''
    rt = {'status': 0, 'message': None, 'data': []}
    try:
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projId)
        lang = select_the_language(lang)
        sensor = 'Sensor' if lang == 'en-US' else '传感器'
        if projId in [421]:
            sensor = 'Sensor'
        if dbname:
            nowTime = datetime.now()
            startTime = (nowTime - timedelta(days=30)).strftime('%Y-%m-%d 00:00:00')
            endTime = nowTime.strftime('%Y-%m-%d %H:%M:%S')
            system_dict, equipmentId_systemId = get_equipment_all(projId, dbname)
            if system_dict:
                strSQL = 'SELECT n.Id, n.Time, f.`Name`, f.Description, f.Points, '\
                         'f.DefaultGrade, f.EquipmentId, f.FaultType, e.`Name`, e.LocationInfo '\
                         'FROM %s_diagnosis_faults AS f '\
                         'LEFT JOIN %s_diagnosis_notices AS n ON n.FaultId = f.Id '\
                         'LEFT JOIN %s_diagnosis_equipments AS e ON f.EquipmentId = e.Id '\
                         'WHERE n.Time <= "%s" AND n.Time >= "%s" '\
                         'GROUP BY e.`Name`' % (dbname, dbname, dbname, endTime, startTime)
                dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
                if dbrv:
                    for item in dbrv:
                        if int(item[7]) == 1:
                            subSysName = equipmentId_systemId.get(item[8])
                            if subSysName is not None:
                                subSys = system_dict.get(subSysName)
                                subSys.update({'AbnormalNum': system_dict.get(subSysName).get('AbnormalNum') + 1})
                                if len(subSys.get('Subitem')) > 1 and item[9]:
                                    if item[9] in subSys.get('Subitem').keys():
                                        subSys.get('Subitem').get(item[9]).get('Detail').append({'FaultName': item[2], 'FaultDescription': item[3],
                                                                                                 'FaultPoints': item[4], 'FaultDefaultGrade': item[5],
                                                                                                 'NoticeId': item[0],
                                                                                                 'NoticeTime': item[1].strftime('%Y-%m-%d %H:%M:%S'),
                                                                                                 'EquipmentId': item[6], 'EquipmentName': item[8]})
                                else:
                                    subSys.get('Detail').append({'FaultName': item[2], 'FaultDescription': item[3],
                                                                 'FaultPoints': item[4], 'FaultDefaultGrade': item[5],
                                                                 'NoticeId': item[0],
                                                                 'NoticeTime': item[1].strftime('%Y-%m-%d %H:%M:%S'),
                                                                 'EquipmentId': item[6], 'EquipmentName': item[8]})
                        elif int(item[7]) == 2:
                            if sensor not in system_dict.keys():
                                n = get_realpoint_count(dbname)
                                system_dict.update({sensor: {'AbnormalNum': 0, 'SubSystemName': sensor,
                                                             'Subitem': {}, 'Detail': [], 'Equipments': [1] * n}})
                            subSys = system_dict.get(sensor)
                            if item[9] and len(subSys.get('Subitem')) > 1:
                                if item[9] in subSys.get('Subitem').keys():
                                    subSys.get('Subitem').get(item[9]).get('Detail').append({'FaultName': item[2], 'FaultDescription': item[3],
                                                                                             'FaultPoints': item[4], 'FaultDefaultGrade': item[5],
                                                                                             'NoticeId': item[0], 'NoticeTime': item[1].strftime('%Y-%m-%d %H:%M:%S'),
                                                                                             'EquipmentId': item[6], 'EquipmentName': item[8]})
                                else:
                                    subSys.get('Subitem').update({item[9]: {'LocationInfo': item[9],
                                                                            'Detail': [{'FaultName': item[2], 'FaultDescription': item[3],
                                                                                        'FaultPoints': item[4], 'FaultDefaultGrade': item[5],
                                                                                        'NoticeId': item[0], 'NoticeTime': item[1].strftime('%Y-%m-%d %H:%M:%S'),
                                                                                        'EquipmentId': item[6], 'EquipmentName': item[8]}]}})
                            else:
                                subSys.get('Detail').append({'FaultName': item[2], 'FaultDescription': item[3],
                                                             'FaultPoints': item[4], 'FaultDefaultGrade': item[5],
                                                             'NoticeId': item[0], 'NoticeTime': item[1].strftime('%Y-%m-%d %H:%M:%S'),
                                                             'EquipmentId': item[6], 'EquipmentName': item[8]})
                            subSys.update({'AbnormalNum': system_dict.get(sensor).get('AbnormalNum') + 1})
                    l = list(system_dict.keys())
                    l.sort()
                    for keys in l:
                        sys = system_dict.get(keys)
                        totalNum = len(sys.get('Equipments'))
                        goodNum = len(sys.get('Equipments')) - sys.get('AbnormalNum')
                        rt.get('data').append({'SubSystemName': sys.get('SubSystemName'),
                                               'Detail': sys.get('Detail'), 'Subitem': [],
                                               'GoodNum': goodNum, 'TotalNum': totalNum,
                                               'IntactRate': computing_intact_rate(goodNum, totalNum)})
                        if len(sys.get('Subitem')) > 1:
                            i = list(sys.get('Subitem').keys())
                            i.sort()
                            for k in i:
                                rt.get('data')[-1].get('Subitem').append({'LocationInfo': sys.get('Subitem').get(k).get('LocationInfo'),
                                                                          'Detail': sys.get('Subitem').get(k).get('Detail')})
                                if keys != sensor:
                                    tNum = sys.get('Subitem').get(k).get('TotalNum')
                                    gNum = tNum - len(sys.get('Subitem').get(k).get('Detail'))
                                    rt.get('data')[-1].get('Subitem')[-1].update({'GoodNum': gNum, 'TotalNum': tNum,
                                                                                  'IntactRate': computing_intact_rate(gNum, tNum)})
            else:
                rt.update({'status': 0, 'message': 'The project no diagnostic information'})
        else:
            rt.update({'status': 0, 'message': 'Invalid parameter'})
    except Exception as e:
        print('get_equipmentIntactRate_pandect error:' + e.__str__())
        logging.error(e.__str__())
    return jsonify(rt)


def select_the_language(lang):
    rt = 'zh-CN'
    if isinstance(lang, str):
        if 'zh' in lang.lower() or 'CN' in lang.upper() or 'CH' in lang.upper():
            rt = 'zh-CN'
        elif 'en' in lang.lower() or 'US' in lang.upper():
            rt = 'en-US'
    return rt
