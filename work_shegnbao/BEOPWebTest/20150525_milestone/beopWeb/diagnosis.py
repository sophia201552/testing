"""
Routes and views for the flask application.
"""

from beopWeb import app
from beopWeb.BEOPDataAccess import *
from flask import request, url_for, redirect, render_template, json
from datetime import datetime, timedelta
import time
import subprocess


@app.route('/diagnosis/notice/add/<projectId>', methods=['POST'])
def addDiagnosisNotice(projectId):
    data = request.get_json()
    dbAccess = BEOPDataAccess.getInstance()
    dbname = dbAccess.getProjMysqldb(projectId)
    if (dbname is None): dbname = dbAccess.getProjMysqldbByName(projectId)

    strSQL = 'INSERT INTO diagnosis_notices (FaultId, Time, OrderId, Detail, `Status`, Project) \
            VALUES("%s","%s","%s","%s","%s","%s")' % (data.get('faultId'), data.get('time'),data.get('orderId'),data.get('detail'),data.get('status'),data.get('project'))
    return json.dumps(dbAccess._mysqlDBContainer.op_db_update(dbname, strSQL,()), ensure_ascii=False)

@app.route('/diagnosis/notice/get/<projectId>')
def getDiagnosisNotices(projectId):
    dbAccess = BEOPDataAccess.getInstance()
    dbname = dbAccess.getProjMysqldb(projectId)
    if (dbname is None):
        dbname = dbAccess.getProjMysqldbByName(projectId)

    strSQL = 'SELECT * FROM (SELECT * FROM diagnosis_notices ORDER BY Time desc) GROUP BY FaultId ORDER BY Time desc'
    rv = dbAccess._mysqlDBContainer.op_db_query(dbname, strSQL,())

    data = [{ 'id': x[0], 'faultId': x[1], 'time': x[2].timestamp(), 'orderId': x[3], 'status': x[4], 'detail': x[5], 'project':x[6]} for x in rv]
    return json.dumps(data, ensure_ascii=False)

#Get all notices
@app.route('/diagnosis/notice/getAll/<projectId>')
def getDiagnosisAllNotices(projectId):
    dbAccess = BEOPDataAccess.getInstance()
    dbname = dbAccess.getProjMysqldb(projectId)
    if (dbname is None): dbname = dbAccess.getProjMysqldbByName(projectId)

    strSQL = 'SELECT * FROM diagnosis_notices ORDER BY Time desc'
    rv = dbAccess._mysqlDBContainer.op_db_query(dbname, strSQL,())
    data = [{ 'id': x[0], 'faultId': x[1], 'time': x[2].timestamp(), 'orderId': x[3], 'status': x[4], 'detail': x[5], 'project':x[6]} for x in rv]
    return json.dumps(data, ensure_ascii=False)

#SetConfigInfo
@app.route('/diagnosis/fault/add/<projectId>', methods=['POST'])
def addFault(projectId):
    data = request.get_json()
    dbAccess = BEOPDataAccess.getInstance()
    dbname = dbAccess.getProjMysqldb(projectId)
    if (dbname is None): dbname = dbAccess.getProjMysqldbByName(projectId)
    
    strSQL = 'INSERT INTO diagnosis_faults (Id,ParentId,`Name`,Description,Points,EquipmentId,DefaultGrade,IsUserDefined,UserId,UserFaultGrade,UserFaultDelay,UserModifyTime,UserEnable,Project)\
            VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s, NOW())'
    param = (data.get('id'),data.get('parentId'),data.get('name'),data.get('description'),data.get('points'),data.get('equipmentId'),data.get('defaultGrade'),
            data.get('isUserDefined'),data.get('userId'),data.get('userFaultGrade'),data.get('userFaultDelay'),data.get('userEnable'),data.get('project'))
    return json.dumps(dbAccess._mysqlDBContainer.op_db_update(dbname, strSQL, param), ensure_ascii=False)

#GetConfigInfo
@app.route('/diagnosis/fault/get/<projectId>')
def getFaults(projectId):
    dbAccess = BEOPDataAccess.getInstance()
    dbname = dbAccess.getProjMysqldb(projectId)
    if (dbname is None): dbname = dbAccess.getProjMysqldbByName(projectId)

    strSQL = 'SELECT a.Id,ParentId,`Name`,Description,Points,EquipmentId,DefaultGrade,IsUserDefined,UserId,b.username,UserFaultGrade,UserFaultDelay,UserModifyTime,UserEnable,Project\
                     FROM diagnosis_faults as a LEFT JOIN beopdoengine.`user` as b on a.UserId = b.id'
    rv = dbAccess._mysqlDBContainer.op_db_query(dbname, strSQL, ())
    data = [{ 'id': x[0], 'parentId': x[1], 'name': x[2], 'description': x[3], 'points':x[4], 'equipmentId': x[5],
            'defaultGrade': x[6], 'isUserDefined': x[7], 'userId': x[8], 'userName': x[9], 'userFaultGrade': x[10], 'userFaultDelay': x[11], 'userModifyTime': x[12].timestamp(), 'userEnable':x[13], 'project':x[14] } for x in rv]
    return json.dumps(data, ensure_ascii=False)

@app.route('/diagnosis/fault/getInNotices/<projectId>')
def getFaultsInNotices(projectId):
    dbAccess = BEOPDataAccess.getInstance()
    dbname = dbAccess.getProjMysqldb(projectId)
    if (dbname is None): dbname = dbAccess.getProjMysqldbByName(projectId)

    strSQL = 'SELECT Id,ParentId,`Name`,Description,Points,EquipmentId,DefaultGrade,IsUserDefined,UserId,UserFaultGrade,UserFaultDelay,UserModifyTime,UserEnable,Project\
            FROM diagnosis_faults WHERE Id IN (SELECT FaultId FROM diagnosis_notices)'
    rv = dbAccess._mysqlDBContainer.op_db_query(dbname, strSQL,())
    data = [{ 'id': x[0], 'parentId': x[1], 'name': x[2], 'description': x[3], 'points':x[4], 'equipmentId': x[5],
            'defaultGrade': x[6], 'isUserDefined': x[7], 'userId': x[8], 'userName': x[9], 'userFaultGrade': x[10], 'userFaultDelay': x[11], 'userModifyTime': x[12].timestamp(), 'userEnable':x[13], 'project':x[14] } for x in rv]
    return json.dumps(data, ensure_ascii=False)

#GetSystemInfo
@app.route('/diagnosis/equipment/get/<projectId>')
def getEquipments(projectId):
    dbAccess = BEOPDataAccess.getInstance()
    dbname = dbAccess.getProjMysqldb(projectId)
    if (dbname is None): dbname = dbAccess.getProjMysqldbByName(projectId)

    strSQL = 'SELECT Id, `Name`, PageId, ZoneId, SystemId, SubSystemId, SystemName, SubSystemName, Project FROM diagnosis_equipments'
    rv = dbAccess._mysqlDBContainer.op_db_query(dbname, strSQL,())
    data = [{ 'id': x[0], 'name': x[1], 'pageId': x[2], 'zoneId': x[3], 'systemId': x[4], 'subSystemId': x[5], 
            'systemName': x[6], 'subSystemName': x[7], 'project':x[8] } for x in rv]
    return json.dumps(data, ensure_ascii=False)

#GetLocationInfo
@app.route('/diagnosis/zone/get/<projectId>')
def getZones(projectId):
    dbAccess = BEOPDataAccess.getInstance()
    dbname = dbAccess.getProjMysqldb(projectId)
    if (dbname is None): dbname = dbAccess.getProjMysqldbByName(projectId)

    strSQL = 'SELECT Id, PageId, CampusId, BuildingId, SubBuildingId, CampusName, BuildingName, SubBuildingName, Image, Project FROM diagnosis_zones'
    rv = dbAccess._mysqlDBContainer.op_db_query(dbname, strSQL,())
    data = [{ 'id': x[0], 'pageId': x[1], 'campusId': x[2], 'buildingId': x[3], 'subBuildingId': x[4], 
                 'campusName': x[5], 'buildingName': x[6], 'subBuildingName': x[7], 'image': x[8], 'project':x[9] } for x in rv]
    return json.dumps(data, ensure_ascii=False)

@app.route('/diagnosis/getAll/<projectId>')
def getDiagnosisAll(projectId):
    return json.dumps({
        'zones': json.loads(getZones(projectId)),
        'equipments': json.loads(getEquipments(projectId)),
        'faults': json.loads(getFaults(projectId)),
        'notices': json.loads(getDiagnosisNoticesLimit(projectId))
    }, ensure_ascii=False)

@app.route('/diagnosis/fault/customUpdate/<projectId>', methods=['POST'])
def updateCustomOption(projectId):
    data = request.get_json()
    dbAccess = BEOPDataAccess.getInstance()
    dbname = dbAccess.getProjMysqldb(projectId)

    strSQL = 'UPDATE diagnosis_faults SET IsUserDefined = %s, UserId = %s, UserFaultGrade = %s, UserFaultDelay = %s, UserModifyTime = NOW() \
            WHERE Id = %s'
    param  = (data.get('isUserDefined'), data.get('userId'), data.get('userFaultGrade'), data.get('userFaultDelay'), data.get('id'))
    bSuccess = dbAccess._mysqlDBContainer.op_db_update(dbname, strSQL, param)
    return json.dumps(bSuccess, ensure_ascii=False)

@app.route('/diagnosis/notice/get/<projectId>/<startTime>/<endTime>')
def getDiagnosisNoticeByTimeSpan(projectId, startTime, endTime):
    projectId = int(projectId)
    data = None
    if isinstance(startTime, str) and isinstance(endTime, str):
        if len(startTime) > 0 and len(endTime) > 0:
            dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
            if (dbname is None):
                dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)

            strSQL = "SELECT * FROM (SELECT * FROM diagnosis_notices where Time >= \'%s\' and Time <= \'%s\' ORDER BY Time desc) pcc GROUP BY FaultId ORDER BY Time desc" % (startTime, endTime)
            rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query(dbname, strSQL,())

            data = [{ 'id': x[0], 'faultId': x[1], 'time': x[2].timestamp(), 'orderId': x[3], 'status': x[4], 'detail': x[5], 'project':x[6] } for x in rv]
        else:
            data = {'error':"length of startTime and endTime should not be 0"}
    else:
        data = {'error':"startTime and endTime must be str"}
    return json.dumps(data, ensure_ascii=False)

@app.route('/diagnosis/notice/getLimit/<projectId>')
def getDiagnosisNoticesLimit(projectId):
    dbAccess = BEOPDataAccess.getInstance()
    dbname = dbAccess.getProjMysqldb(projectId)
    if (dbname is None):
        dbname = dbAccess.getProjMysqldbByName(projectId)

    strSQL = 'SELECT * FROM (SELECT * FROM diagnosis_notices ORDER BY Time desc limit 0,20) pcc GROUP BY FaultId ORDER BY Time desc'
    rv = dbAccess._mysqlDBContainer.op_db_query(dbname, strSQL,())

    data = [{ 'id': x[0], 'faultId': x[1], 'time': x[2].timestamp(), 'orderId': x[3], 'status': x[4], 'detail': x[5], 'project':x[6] } for x in rv]
    return json.dumps(data, ensure_ascii=False)

@app.route('/diagnosis/notice/makesure/<projectId>/<noticeId>')
def setNoticeToSure(projectId, noticeId):
    projectId = int(projectId)
    noticeId = int(noticeId)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if (dbname is None):
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    strSQL = "update diagnosis_notices set status=\'%s\' where Id=%d" % (-1, noticeId)
    return json.dumps(BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update(dbname, strSQL,()), ensure_ascii=False)

@app.route('/diagnosis/limit/get/<projectId>')
def getDiagnosisLimit(projectId):
    projectId = int(projectId)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if (dbname is None):
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    strSQL = 'SELECT * FROM diagnosis_limit ORDER BY ID'
    rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query(dbname, strSQL,())
    data = [{ 'id': x[0], 'name': x[1], 'building': x[2], 'subBuilding': x[3], 'systemType': x[4], 'fault': x[5], 'alert': x[6], 'notice': x[7], 'modifyTime': x[8].timestamp(), 'project':x[9] } for x in rv]
    return json.dumps(data, ensure_ascii=False)

@app.route('/diagnosis/order/get/<projectId>')
def getDiagnosisOrder(projectId):
    projectId = int(projectId)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    strSQL = 'select * from diagnosis_order order by ProjectID'
    rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query(dbname, strSQL,())
    data = [{ 'projectId': x[0], 'name': x[1], 'operatorId': x[2], 'group': x[3], 'faultGrade': x[4], 'equipList': x[5], 'modifyTime': x[6].timestamp(), 'project':x[7]} for x in rv]
    return json.dumps(data, ensure_ascii=False)

@app.route('/diagnosis/enable/get/<projectId>')
def getDiagnosisEnable(projectId):
    projectId = int(projectId)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    strSQL = 'select * from diagnosis_enable order by ID'
    rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query(dbname, strSQL,())
    data = [{ 'id': x[0], 'name': x[1], 'startTime': x[2], 'endTime': x[3], 'equipList': x[4], 'modifyTime': x[5], 'project':x[6]} for x in rv]
    return json.dumps(data, ensure_ascii=False)

@app.route('/diagnosis/limit/add/<projectId>', methods=['POST'])
def addDiagnosisLimit(projectId):
    projectId = int(projectId)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    post = request.get_json()
    name = post.get('name')
    building = post.get('building')
    subBuilding = post.get('subBuilding')
    systemType = post.get('systemType')
    fault = post.get('fault')
    alert = post.get('alert')
    notice = post.get('notice')
    project = post.get('project')
    strSQL = "insert into diagnosis_limit(`Name`, Building, SubBuilding, SystemType, Fault, Alert, Notice, ModifyTime, Project) values(%s, %s, %s, %s, %s, %s, %s, now(), %s)" % (name, building, subBuilding, systemType, fault, alert, notice, project)
    return json.dumps(BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update(dbname, strSQL,()), ensure_ascii=False)

@app.route('/diagnosis/order/add/<projectId>', methods=['POST'])
def addDiagnosisOrder(projectId):
    projectId = int(projectId)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    post = request.get_json()
    name.post.get('name')
    operatorId = post.get('operatorId')
    group = post.get('group')
    faultGrade = post.get('faultGrade')
    equipList = post.get('equipList')
    project = post.get('project')
    strSQL = "insert into diagnosis_order(ProjectID, `Name`, OperatorID, GroupID, FaultGrade, EquipList, ModifyTime, Project) values(%s, %s, %s, %s, %s, %s, now(), %s)" % (projectId, name, operatorId, group, faultGrade, equipList, project)
    return json.dumps(BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update(dbname, strSQL,()), ensure_ascii=False)

@app.route('/diagnosis/enable/add/<projectId>', methods=['POST'])
def addDiagnosisEanble(projectId):
    projectId = int(projectId)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    post = request.get_json()
    name = post.get('name')
    startTime = post.get('startTime')
    endTime = post.get('endTime')
    equipList = post.get('equipList')
    project = post.get('project')
    strSQL = "insert into diagnosis_enable(`Name`, StartTime, EndTime, EquipList, ModifyTime, Project) values(%s, %s, %s, %s, now(), %s)" % (name, startTime, endTime, equipList, project)
    return json.dumps(BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update(dbname, strSQL,()), ensure_ascii=False)

@app.route('/diagnosis/fault/get/<projectId>/<startTime>/<endTime>')
def getFaultsByTimeSpan(projectId,startTime,endTime):
    dbAccess = BEOPDataAccess.getInstance()
    dbname = dbAccess.getProjMysqldb(projectId)
    if (dbname is None):
        dbname = dbAccess.getProjMysqldbByName(projectId)
    strSQL = 'SELECT a.Id,ParentId,`Name`,Description,Points,EquipmentId,DefaultGrade,IsUserDefined,UserId,b.username,UserFaultGrade,UserFaultDelay,UserModifyTime,UserEnable,Project\
                     FROM diagnosis_faults as a LEFT JOIN beopdoengine.`user` as b on a.UserId = b.id where a.UserModifyTime >= \"%s\" and a.UserModifyTime <= \"%s\"' % (startTime, endTime)
    rv = dbAccess._mysqlDBContainer.op_db_query(dbname, strSQL, ())
    data = [{ 'id': x[0], 'parentId': x[1], 'name': x[2], 'description': x[3], 'points':x[4], 'equipmentId': x[5],
            'defaultGrade': x[6], 'isUserDefined': x[7], 'userId': x[8], 'userName': x[9], 'userFaultGrade': x[10], 'userFaultDelay': x[11], 'userModifyTime': x[12].timestamp(), 'userEnable':x[13], 'project':x[14] } for x in rv]
    return json.dumps(data, ensure_ascii=False)

@app.route('/diagnosis/order/get/<projectId>/<startTime>/<endTime>')
def getDiagnosisOrderByTimeSpan(projectId,startTime,endTime):
    projectId = int(projectId)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    strSQL = 'select * from diagnosis_order where ModifyTime >= \"%s\" and ModifyTime <= \"%s\" order by ProjectID' % (startTime,endTime)
    rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query(dbname, strSQL,())
    data = [{ 'projectId': x[0], 'name': x[1], 'operatorId': x[2], 'group': x[3], 'faultGrade': x[4], 'equipList': x[5], 'modifyTime': x[6].timestamp(), 'project':x[7]} for x in rv]
    return json.dumps(data, ensure_ascii=False)

@app.route('/diagnosis/limit/get/<projectId>/<startTime>/<endTime>')
def getDiagnosisLimitByTimeSpan(projectId,startTime,endTime):
    projectId = int(projectId)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if (dbname is None):
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    strSQL = 'SELECT * FROM diagnosis_limit where ModifyTime >= \"%s\" and ModifyTime <= \"%s\" ORDER BY ID' % (startTime,endTime)
    rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query(dbname, strSQL,())
    data = [{ 'id': x[0], 'name': x[1], 'building': x[2], 'subBuilding': x[3], 'systemType': x[4], 'fault': x[5], 'alert': x[6], 'notice': x[7], 'modifyTime': x[8].timestamp(), 'project':x[9] } for x in rv]
    return json.dumps(data, ensure_ascii=False)

@app.route('/diagnosis/enable/get/<projectId>/<startTime>/<endTime>')
def getDiagnosisEnableByTimeSpan(projectId,startTime,endTime):
    projectId = int(projectId)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    strSQL = 'select * from diagnosis_enable where ModifyTime >= \"%s\" and ModifyTime <= \"%s\" order by ID' % (startTime,endTime)
    rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query(dbname, strSQL,())
    data = [{ 'id': x[0], 'name': x[1], 'startTime': x[2], 'endTime': x[3], 'equipList': x[4], 'modifyTime': x[5], 'project':x[6]} for x in rv]
    return json.dumps(data, ensure_ascii=False)

@app.route('/diagnosis/equipment/add/<projectId>', methods=['POST'])
def addDiagnosisEquipment(projectId):
    projectId = int(projectId)
    post = request.get_json()
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    strSQL = 'insert into diagnosis_equipments (Id, `Name`, PageId, ZoneId, SystemId, SubSystemId, SystemName, SubSystemName, Project) values(%d,%s,%d,%d,%d,%d,%s,%s,%s)' % \
             (post.get('id'), post.get('name'), post.get('pageId'), post.get('zoneId'), post.get('systemId'), post.get('subSystemId'),post.get('systemName'), post.get('subSystemName'), post.get('project'))
    return json.dumps(BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query(dbname, strSQL,()), ensure_ascii=False)

@app.route('/diagnosis/zone/add/<projectId>', methods=['POST'])
def addDiagnosisZone(projectId):
    projectId = int(projectId)
    post = request.get_json()
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    strSQL = 'insert into diagnosis_zones (Id, PageId, CampusId, BuildingId, SubBuildingId, CampusName, BuildingName, SubBuildingName, Image, Project) values(%d,%d,%d,%d,%d,%s,%s,%s,%s,%s)' % \
             (post.get('id'),post.get('pageId'),post.get('campusId'),post.get('buildingId'),post.get('subBuildingId'),post.get('campusName'),post.get('buildingName'),post.get('subBuildingName'),post.get('image'),post.get('project'))
    return json.dumps(BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query(dbname, strSQL,()), ensure_ascii=False)