"""
Routes and views for the flask application.
"""

from beopWeb import app
from beopWeb.BEOPDataAccess import *
from flask import request, url_for, redirect, render_template, json
from datetime import datetime, timedelta
import time
import subprocess
from beopWeb.mod_workflow import StaticRelate


@app.route('/diagnosis/notice/add/<projectId>', methods=['POST'])
def addDiagnosisNotice(projectId):
    data = request.get_json()
    dbAccess = BEOPDataAccess.getInstance()
    dbname = dbAccess.getProjMysqldb(projectId)
    if (dbname is None): dbname = dbAccess.getProjMysqldbByName(projectId)

    strSQL = 'INSERT INTO diagnosis_notices (FaultId, Time, OrderId, Energy, Detail, `Status`, Project) VALUES(%d,"%s",%d,"%s","%s",%d,"%s")' % \
             (int(data.get('faultId')) if data.get('faultId')!=None else 0, data.get('time') if data.get('time')!=None else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
              int(data.get('orderId')) if data.get('orderId')!=None else 0,data.get('energy') if data.get('energy')!=None else '',
              data.get('detail') if data.get('detail')!=None else '',int(data.get('status')) if data.get('status')!=None else 0,data.get('project') if data.get('project')!=None else '')
    return json.dumps(dbAccess._mysqlDBContainer.op_db_update(dbname, strSQL,()), ensure_ascii=False)

@app.route('/diagnosis/notice/addMulti/<projectId>', methods=['POST'])
def addDiagnosisNoticeMulti(projectId):
    post = request.get_json()
    dbAccess = BEOPDataAccess.getInstance()
    dbname = dbAccess.getProjMysqldb(projectId)
    if dbname is None:
        dbname = dbAccess.getProjMysqldbByName(projectId)
    insertList = post.get('addList')
    strInsert = 'INSERT INTO diagnosis_notices (FaultId, Time, OrderId, Energy, Detail, `Status`, Project) VALUES'
    if len(insertList) == 0:
        return json.dumps(True, ensure_ascii=False)
    for data in insertList:
        strValues = "("
        strValues += "%d,'%s',%d,'%s','%s',%d,'%s'" % \
            (int(data.get('faultId')) if data.get('faultId')!=None else 0, data.get('time') if data.get('time')!=None else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
             int(data.get('orderId')) if data.get('orderId')!=None else 0,data.get('energy') if data.get('energy')!=None else '',
             data.get('detail') if data.get('detail')!=None else '',int(data.get('status')) if data.get('status')!=None else 0,data.get('project') if data.get('project')!=None else '')
        strValues += ")"
        strInsert += strValues
        strInsert += ","
    if strInsert[-1] == ",":
        strInsert = strInsert[0:len(strInsert)-1]
    return json.dumps(dbAccess._mysqlDBContainer.op_db_update(dbname, strInsert,()), ensure_ascii=False)

@app.route('/diagnosis/notice/get/<projectId>')
def getDiagnosisNotices(projectId):
    dbAccess = BEOPDataAccess.getInstance()
    dbname = dbAccess.getProjMysqldb(projectId)
    if (dbname is None):
        dbname = dbAccess.getProjMysqldbByName(projectId)

    strSQL = 'SELECT * FROM (SELECT ID,FaultId,Time,OrderId,Energy,Detail,Status,Project FROM diagnosis_notices ORDER BY Time desc) as t GROUP BY FaultId ORDER BY Time desc'
    rv = dbAccess._mysqlDBContainer.op_db_query(dbname, strSQL,())

    data = [{ 'id': x[0], 'faultId': x[1], 'time': x[2].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[2], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
              'orderId': x[3], 'energy': x[4], 'detail': x[5], 'status':x[6], 'project':x[7]} for x in rv]
    return json.dumps(data, ensure_ascii=False)

#Get all notices
@app.route('/diagnosis/notice/getAll/<projectId>')
def getDiagnosisAllNotices(projectId):
    dbAccess = BEOPDataAccess.getInstance()
    dbname = dbAccess.getProjMysqldb(projectId)
    if (dbname is None): dbname = dbAccess.getProjMysqldbByName(projectId)

    strSQL = 'SELECT ID,FaultId,Time,OrderId,Energy,Detail,Status,Project FROM diagnosis_notices ORDER BY Time desc'
    rv = dbAccess._mysqlDBContainer.op_db_query(dbname, strSQL,())
    data = [{ 'id': x[0], 'faultId': x[1], 'time': x[2].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[2], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
              'orderId': x[3], 'energy':x[4], 'detail':x[5], 'status':x[6], 'project':x[7]} for x in rv]
    return json.dumps(data, ensure_ascii=False)

@app.route('/diagnosis/fault/add/<projectId>', methods=['POST'])
def addFault(projectId):
    data = request.get_json()
    dbAccess = BEOPDataAccess.getInstance()
    dbname = dbAccess.getProjMysqldb(projectId)
    if (dbname is None): dbname = dbAccess.getProjMysqldbByName(projectId)
    
    strSQL = 'INSERT INTO diagnosis_faults (Id,ParentId,`Name`,Description,Points,EquipmentId,DefaultGrade,IsUserDefined,UserId,UserFaultGrade,UserFaultDelay,UserModifyTime,UserEnable,Project)\
            VALUES(%d,%d,"%s","%s","%s",%d,%d,%d,%d,%d,"%s",NOW(),%d,"%s")' % \
             (int(data.get('id')) if data.get('id')!=None else 0,int(data.get('parentId')) if data.get('parentId')!=None else 0,data.get('name') if data.get('name')!=None else '',
              data.get('description') if data.get('description')!=None else '',data.get('points') if data.get('points')!=None else '',
              int(data.get('equipmentId')) if data.get('equipmentId')!=None else 0,int(data.get('defaultGrade')) if data.get('defaultGrade')!=None else 0,
              int(data.get('isUserDefined')) if data.get('isUserDefined')!=None else 0,int(data.get('userId')) if data.get('userId')!=None else 0,
              int(data.get('userFaultGrade')) if data.get('userFaultGrade')!=None else 0,data.get('userFaultDelay') if data.get('userFaultDelay')!=None else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
              int(data.get('userEnable')) if data.get('userEnable')!=None else 0,data.get('project') if data.get('project')!=None else '')
    return json.dumps(dbAccess._mysqlDBContainer.op_db_update(dbname, strSQL, ()), ensure_ascii=False)

@app.route('/diagnosis/fault/addMulti/<projectId>', methods=['POST'])
def addFaultMulti(projectId):
    post = request.get_json()
    insertList = post.get('addList')
    dbAccess = BEOPDataAccess.getInstance()
    dbname = dbAccess.getProjMysqldb(projectId)
    if (dbname is None): 
        dbname = dbAccess.getProjMysqldbByName(projectId)
    strInsert = 'INSERT INTO diagnosis_faults (Id,ParentId,`Name`,Description,Points,EquipmentId,DefaultGrade,IsUserDefined,UserId,UserFaultGrade,UserFaultDelay,UserModifyTime,UserEnable,Project) VALUES'
    if len(insertList) == 0:
        return json.dumps(True, ensure_ascii=False)
    for data in insertList:
        strValues = "("
        strValues += "%d,%d,'%s','%s','%s',%d,%d,%d,%d,%d,'%s',NOW(),%d,'%s'" % \
             (int(data.get('id')) if data.get('id')!=None else 0,int(data.get('parentId')) if data.get('parentId')!=None else 0,data.get('name') if data.get('name')!=None else '',
              data.get('description') if data.get('description')!=None else '',data.get('points') if data.get('points')!=None else '',
              int(data.get('equipmentId')) if data.get('equipmentId')!=None else 0,int(data.get('defaultGrade')) if data.get('defaultGrade')!=None else 0,
              int(data.get('isUserDefined')) if data.get('isUserDefined')!=None else 0,int(data.get('userId')) if data.get('userId')!=None else 0,
              int(data.get('userFaultGrade')) if data.get('userFaultGrade')!=None else 0,data.get('userFaultDelay') if data.get('userFaultDelay')!=None else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
              int(data.get('userEnable')) if data.get('userEnable')!=None else 0,data.get('project') if data.get('project')!=None else '')
        strValues += ")"
        strInsert += strValues
        strInsert += ","
    if strInsert[-1] == ",":
        strInsert = strInsert[0:len(strInsert)-1]
    return json.dumps(dbAccess._mysqlDBContainer.op_db_update(dbname, strInsert,()), ensure_ascii=False)

@app.route('/diagnosis/fault/get/<projectId>')
def getFaults(projectId):
    dbAccess = BEOPDataAccess.getInstance()
    dbname = dbAccess.getProjMysqldb(projectId)
    if (dbname is None): dbname = dbAccess.getProjMysqldbByName(projectId)

    strSQL = 'SELECT a.Id,ParentId,`Name`,Description,Points,EquipmentId,DefaultGrade,IsUserDefined,UserId,b.username,UserFaultGrade,UserFaultDelay,UserModifyTime,UserEnable,Project\
                     FROM diagnosis_faults as a LEFT JOIN beopdoengine.`user` as b on a.UserId = b.id'
    rv = dbAccess._mysqlDBContainer.op_db_query(dbname, strSQL, ())
    data = [{ 'id': x[0], 'parentId': x[1], 'name': x[2], 'description': x[3], 'points':x[4], 'equipmentId': x[5],
            'defaultGrade': x[6], 'isUserDefined': x[7], 'userId': x[8], 'userName': x[9], 'userFaultGrade': x[10],
            'userFaultDelay': x[11].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[11], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'userModifyTime': x[12].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[12], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'userEnable':x[13], 'project':x[14] } for x in rv]
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
            'defaultGrade': x[6], 'isUserDefined': x[7], 'userId': x[8], 'userFaultGrade': x[9],
            'userFaultDelay':x[10].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[10], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'userModifyTime': x[11].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[11], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'userEnable':x[12], 'project':x[13] } for x in rv]
    return json.dumps(data, ensure_ascii=False)

#GetSystemInfo
@app.route('/diagnosis/equipment/get/<projectId>')
def getEquipments(projectId):
    dbAccess = BEOPDataAccess.getInstance()
    dbname = dbAccess.getProjMysqldb(projectId)
    if (dbname is None): dbname = dbAccess.getProjMysqldbByName(projectId)

    strSQL = 'SELECT Id, `Name`, PageId, ZoneId, SystemId, SubSystemId, SystemName, SubSystemName, Project, ModalTextId FROM diagnosis_equipments'
    rv = dbAccess._mysqlDBContainer.op_db_query(dbname, strSQL,())
    data = [{ 'id': x[0], 'name': x[1], 'pageId': x[2], 'zoneId': x[3], 'systemId': x[4], 'subSystemId': x[5], 
            'systemName': x[6], 'subSystemName': x[7], 'project':x[8], 'modalTextId':x[9] } for x in rv]
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
        'notices': json.loads(getDiagnosisNotices(projectId))
    }, ensure_ascii=False)

@app.route('/diagnosis/fault/customUpdate/<projectId>', methods=['POST'])
def updateCustomOption(projectId):
    projectId = int(projectId)
    data = request.get_json()
    dbAccess = BEOPDataAccess.getInstance()
    dbname = dbAccess.getProjMysqldb(projectId)

    strSQL = 'UPDATE diagnosis_faults SET IsUserDefined = %d, UserId = %d, UserFaultGrade = %d, UserFaultDelay = \"%s\", UserModifyTime = NOW() WHERE Id = %d' % \
             (int(data.get('isUserDefined')) if data.get('isUserDefined')!=None else 0, int(data.get('userId')) if data.get('userId')!=None else 0,
              int(data.get('userFaultGrade')) if data.get('userFaultGrade')!=None else 0,
              data.get('userFaultDelay') if data.get('userFaultDelay')!=None else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
              int(data.get('id')) if data.get('id')!=None else 0)
    bSuccess = dbAccess._mysqlDBContainer.op_db_update(dbname, strSQL, ())
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

            strSQL = "SELECT * FROM (SELECT ID,FaultId,Time,OrderId,Energy,Detail,Status,Project FROM diagnosis_notices where Time >= \'%s\' and Time <= \'%s\' ORDER BY Time desc) pcc GROUP BY FaultId ORDER BY Time desc" % (startTime, endTime)
            rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query(dbname, strSQL,())

            data = [{ 'id': x[0], 'faultId': x[1], 'time': x[2].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[2], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                      'orderId': x[3], 'energy': x[4], 'detail': x[5], 'status':x[6], 'project':x[7] } for x in rv]
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

    strSQL = 'SELECT * FROM (SELECT ID,FaultId,Time,OrderId,Energy,Detail,Status,Project FROM diagnosis_notices ORDER BY Time desc limit 0,20) as t GROUP BY FaultId ORDER BY Time desc'
    rv = dbAccess._mysqlDBContainer.op_db_query(dbname, strSQL,())

    data = [{ 'id': x[0], 'faultId': x[1], 'time': x[2].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[2], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
              'orderId': x[3], 'energy': x[4], 'detail': x[5], 'status':x[6], 'project':x[7] } for x in rv]
    return json.dumps(data, ensure_ascii=False)

@app.route('/diagnosis/notice/makesure/<projectId>/<noticeId>')
def setNoticeToSure(projectId, noticeId):
    projectId = int(projectId)
    noticeId = int(noticeId)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if (dbname is None):
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    strSQL = "update diagnosis_notices set status=\'%s\' where ID=%d" % (-1, noticeId)
    return json.dumps(BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update(dbname, strSQL,()), ensure_ascii=False)

@app.route('/diagnosis/limit/get/<projectId>')
def getDiagnosisLimit(projectId):
    projectId = int(projectId)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if (dbname is None):
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    strSQL = 'SELECT ID,`Name`, EquipList, Fault, Alert, Notice, ModifyTime, Project, Enable FROM diagnosis_limit ORDER BY ID'
    rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query(dbname, strSQL,())
    data = [{ 'id': x[0], 'name': x[1], 'equipList':x[2], 'fault': x[3], 'alert': x[4], 'notice': x[5],
              'modifyTime': x[6].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[6], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
              'project':x[7], 'enable':x[8]} for x in rv]
    return json.dumps(data, ensure_ascii=False)

@app.route('/diagnosis/order/get/<projectId>')
def getDiagnosisOrder(projectId):
    projectId = int(projectId)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    strSQL = 'select ID,`Name`, OperatorID, GroupID, FaultGrade, EquipList, ModifyTime, Project, Enable from diagnosis_order order by Project'
    rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query(dbname, strSQL,())
    data = [{'id':x[0], 'name': x[1], 'operatorId': x[2], 'groupId': x[3], 'faultGrade': x[4], 'equipList': x[5],
             'modifyTime': x[6].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[6], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
             'project':x[7], 'enable':x[8]} for x in rv]
    return json.dumps(data, ensure_ascii=False)

@app.route('/diagnosis/enable/get/<projectId>')
def getDiagnosisEnable(projectId):
    projectId = int(projectId)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    strSQL = 'select ID,`Name`, StartTime, EndTime, EquipList, ModifyTime, Project, Enable from diagnosis_enable order by ID'
    rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query(dbname, strSQL,())
    data = [{ 'id': x[0], 'name': x[1], 'startTime': x[2].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[2], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
              'endTime': x[3].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[3], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'), 'equipList': x[4],
              'modifyTime': x[5].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[5], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'), 'project':x[6], 'enable':x[7]} for x in rv]
    return json.dumps(data, ensure_ascii=False)

@app.route('/diagnosis/limit/add/<projectId>', methods=['POST'])
def addDiagnosisLimit(projectId):
    projectId = int(projectId)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    post = request.get_json()
    name = post.get('name') if post.get('name')!=None else ''
    equipList = post.get('equipList') if post.get('equipList')!=None else ''
    fault = int(post.get('fault')) if post.get('fault')!=None else 0
    alert = int(post.get('alert')) if post.get('alert')!=None else 0
    notice = int(post.get('notice')) if post.get('notice')!=None else 0
    project = post.get('project') if post.get('project')!=None else ''
    enable = int(post.get('enable')) if post.get('enable')!=None else 0
    strSQL = "insert into diagnosis_limit(`Name`, EquipList, Fault, Alert, Notice, ModifyTime, Project, Enable) values(\'%s\', \'%s\', %d, %d, %d, now(), \'%s\', %d)" % \
             (name, equipList, fault, alert, notice, project, enable)
    return json.dumps(BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update_with_id(dbname,'diagnosis_limit', strSQL,()), ensure_ascii=False)

@app.route('/diagnosis/order/add/<projectId>', methods=['POST'])
def addDiagnosisOrder(projectId):
    projectId = int(projectId)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    post = request.get_json()
    name = post.get('name') if post.get('name')!=None else ''
    operatorId = int(post.get('operatorId')) if post.get('operatorId')!=None else 0
    group = int(post.get('group')) if post.get('group')!=None else 0
    faultGrade = int(post.get('faultGrade')) if post.get('faultGrade')!=None else 0
    equipList = post.get('equipList') if post.get('equipList')!=None else ''
    project = post.get('project') if post.get('project')!=None else ''
    enable = int(post.get('enable')) if post.get('enable')!=None else 0
    strSQL = "insert into diagnosis_order(`Name`, OperatorID, GroupID, FaultGrade, EquipList, ModifyTime, Project, Enable) values(\'%s\', %d, %d, %d, \'%s\', now(), \'%s\', %d)" % \
             (name, operatorId, group, faultGrade, equipList, project, enable)
    return json.dumps(BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update_with_id(dbname,'diagnosis_order', strSQL,()), ensure_ascii=False)

@app.route('/diagnosis/enable/add/<projectId>', methods=['POST'])
def addDiagnosisEanble(projectId):
    projectId = int(projectId)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    post = request.get_json()
    name = post.get('name') if post.get('name')!=None else ''
    #startTime = post.get('startTime')
    endTime = post.get('endTime') if post.get('endTime')!=None else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    equipList = post.get('equipList') if post.get('equipList')!=None else ''
    project = post.get('project') if post.get('project')!=None else ''
    enable = int(post.get('enable')) if post.get('enable')!=None else 0
    strSQL = "insert into diagnosis_enable(`Name`, StartTime, EndTime, EquipList, ModifyTime, Project, Enable) values(\'%s\', now(), \'%s\', \'%s\', now(), \'%s\', %d)" \
             % (name, endTime, equipList, project, enable)
    return json.dumps(BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update_with_id(dbname,'diagnosis_enable', strSQL,()), ensure_ascii=False)

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
            'defaultGrade': x[6], 'isUserDefined': x[7], 'userId': x[8], 'userName': x[9], 'userFaultGrade': x[10],
            'userFaultDelay': x[11].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[11], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'userModifyTime': x[12].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[12], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'userEnable':x[13], 'project':x[14] } for x in rv]
    return json.dumps(data, ensure_ascii=False)

@app.route('/diagnosis/order/get/<projectId>/<startTime>/<endTime>')
def getDiagnosisOrderByTimeSpan(projectId,startTime,endTime):
    projectId = int(projectId)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    strSQL = 'select ID,`Name`, OperatorID, GroupID, FaultGrade, EquipList, ModifyTime, Project, Enable from diagnosis_order where ModifyTime >= \"%s\" and ModifyTime <= \"%s\"' % (startTime,endTime)
    rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query(dbname, strSQL,())
    data = [{'id':x[0], 'name': x[1], 'operatorId': x[2], 'groupId': x[3], 'faultGrade': x[4], 'equipList': x[5],
             'modifyTime': x[6].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[6], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
             'project':x[7], 'enable':x[8]} for x in rv]
    return json.dumps(data, ensure_ascii=False)

@app.route('/diagnosis/limit/get/<projectId>/<startTime>/<endTime>')
def getDiagnosisLimitByTimeSpan(projectId,startTime,endTime):
    projectId = int(projectId)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if (dbname is None):
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    strSQL = 'SELECT ID,`Name`, EquipList, Fault, Alert, Notice, ModifyTime, Project, Enable FROM diagnosis_limit where ModifyTime >= \"%s\" and ModifyTime <= \"%s\" ORDER BY ID' % (startTime,endTime)
    rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query(dbname, strSQL,())
    data = [{ 'id': x[0], 'name': x[1], 'equipList': x[2], 'fault': x[3], 'alert': x[4], 'notice': x[5],
              'modifyTime': x[6].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[6], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
              'project':x[7], 'enable':x[8]} for x in rv]
    return json.dumps(data, ensure_ascii=False)

@app.route('/diagnosis/enable/get/<projectId>/<startTime>/<endTime>')
def getDiagnosisEnableByTimeSpan(projectId,startTime,endTime):
    projectId = int(projectId)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    strSQL = 'select ID,`Name`, StartTime, EndTime, EquipList, ModifyTime, Project, Enable from diagnosis_enable where ModifyTime >= \"%s\" and ModifyTime <= \"%s\" order by ID' % (startTime,endTime)
    rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query(dbname, strSQL,())
    data = [{ 'id': x[0], 'name': x[1], 'startTime': x[2].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[2], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
              'endTime': x[3].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[3], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
              'equipList': x[4], 'modifyTime': x[5].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[5], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
              'project':x[6], 'enable':x[7]} for x in rv]
    return json.dumps(data, ensure_ascii=False)

@app.route('/diagnosis/equipment/add/<projectId>', methods=['POST'])
def addDiagnosisEquipment(projectId):
    projectId = int(projectId)
    post = request.get_json()
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    strSQL = 'insert into diagnosis_equipments (Id, `Name`, PageId, ZoneId, SystemId, SubSystemId, SystemName, SubSystemName, Project) values(%d,"%s",%d,%d,%d,%d,"%s","%s","%s")' % \
             (int(post.get('id')) if post.get('id')!=None else 0, post.get('name') if post.get('name')!=None else '',
              int(post.get('pageId')) if post.get('pageId')!=None else 0, int(post.get('zoneId')) if post.get('zoneId')!=None else 0,
              int(post.get('systemId')) if post.get('systemId')!=None else 0, int(post.get('subSystemId')) if post.get('subSystemId')!=None else 0,
              post.get('systemName') if post.get('systemName')!=None else '', post.get('subSystemName') if post.get('subSystemName')!=None else '',
              post.get('project') if post.get('project')!=None else '')
    return json.dumps(BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update(dbname, strSQL,()), ensure_ascii=False)

@app.route('/diagnosis/equipment/addMulti/<projectId>', methods=['POST'])
def addDiagnosisEquipmentMulti(projectId):
    projectId = int(projectId)
    post = request.get_json()
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    insertList = post.get('addList')
    strInsert = 'insert into diagnosis_equipments (Id, `Name`, PageId, ZoneId, SystemId, SubSystemId, SystemName, SubSystemName, Project) values'
    if len(insertList) == 0:
        return json.dumps(True, ensure_ascii=False)
    for data in insertList:
        strValues = "("
        strValues += "%d,'%s',%d,%d,%d,%d,'%s','%s','%s'" % \
                     (int(data.get('id')) if data.get('id')!=None else 0, data.get('name') if data.get('name')!=None else '',
                    int(data.get('pageId')) if data.get('pageId')!=None else 0, int(data.get('zoneId')) if data.get('zoneId')!=None else 0,
                    int(data.get('systemId')) if data.get('systemId')!=None else 0, int(data.get('subSystemId')) if data.get('subSystemId')!=None else 0,
                    data.get('systemName') if data.get('systemName')!=None else '', data.get('subSystemName') if data.get('subSystemName')!=None else '',
                    data.get('project') if data.get('project')!=None else '0')
        strValues += ")"
        strInsert += strValues
        strInsert += ","
    if strInsert[-1] == ",":
        strInsert = strInsert[0:len(strInsert)-1]
    return json.dumps(BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update(dbname, strInsert,()), ensure_ascii=False)

@app.route('/diagnosis/zone/add/<projectId>', methods=['POST'])
def addDiagnosisZone(projectId):
    projectId = int(projectId)
    post = request.get_json()
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    strSQL = 'insert into diagnosis_zones (Id, PageId, CampusId, BuildingId, SubBuildingId, CampusName, BuildingName, SubBuildingName, Image, Project) values(%d,%d,%d,%d,%d,"%s","%s","%s","%s","%s")' % \
             (int(post.get('id')) if post.get('id')!=None else 0,int(post.get('pageId')) if post.get('pageId')!=None else 0,
              int(post.get('campusId')) if post.get('campusId')!=None else 0,int(post.get('buildingId')) if post.get('buildingId')!=None else 0,
              int(post.get('subBuildingId')) if post.get('subBuildingId')!=None else 0,post.get('campusName') if post.get('campusName')!=None else '',
              post.get('buildingName') if post.get('buildingName')!=None else '',post.get('subBuildingName') if post.get('subBuildingName')!=None else '',
              post.get('image') if post.get('image')!=None else '',post.get('project') if post.get('project')!=None else '')
    return json.dumps(BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update(dbname, strSQL,()), ensure_ascii=False)

@app.route('/diagnosis/zone/addMulti/<projectId>', methods=['POST'])
def addDiagnosisZoneMulti(projectId):
    projectId = int(projectId)
    post = request.get_json()
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    insertList = post.get('addList')
    strInsert = 'insert into diagnosis_zones (Id, PageId, CampusId, BuildingId, SubBuildingId, CampusName, BuildingName, SubBuildingName, Image, Project) values'
    if len(insertList) == 0:
        return json.dumps(True, ensure_ascii=False)
    for data in insertList:
        strValues = "("
        strValues += "%d,%d,%d,%d,%d,'%s','%s','%s','%s','%s'" % \
             (int(post.get('id')) if post.get('id')!=None else 0,int(post.get('pageId')) if post.get('pageId')!=None else 0,
              int(post.get('campusId')) if post.get('campusId')!=None else 0,int(post.get('buildingId')) if post.get('buildingId')!=None else 0,
              int(post.get('subBuildingId')) if post.get('subBuildingId')!=None else 0,post.get('campusName') if post.get('campusName')!=None else '',
              post.get('buildingName') if post.get('buildingName')!=None else '',post.get('subBuildingName') if post.get('subBuildingName')!=None else '',
              post.get('image') if post.get('image')!=None else '',post.get('project') if post.get('project')!=None else '')
        strValues += ")"
        strInsert += strValues
        strInsert += ","
    if strInsert[-1] == ",":
        strInsert = strInsert[0:len(strInsert)-1]
    return json.dumps(BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update(dbname, strInsert,()), ensure_ascii=False)


@app.route('/diagnosis/order/getByEquipId/<projectId>/<EquipId>')
def getDiagnosisOrderByEquipId(projectId, EquipId):
    projectId = int(projectId)
    data = {}
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    strSQL = 'SELECT * FROM diagnosis_order where EquipList like \"%%%s%%\" order by ModifyTime desc' % (str(EquipId))
    rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query(dbname, strSQL,())
    if rv != None:
        if len(rv) > 0:
            data = {'id':rv[0][0], 'name': rv[0][1], 'operatorId': rv[0][2], 'groupId': rv[0][3], 'faultGrade': rv[0][4], 'equipList': rv[0][5],
                    'modifyTime': rv[0][6].strftime('%Y-%m-%d %H:%M:%S') if isinstance(rv[0][6], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    'project':rv[0][7], 'enable':rv[0][8]}
    return json.dumps(data, ensure_ascii=False)

# postdata:{
#     ids:[..,  .., ..],
#     grade: ,
#     delay: ,
#     modifyTime: ,
# }
@app.route('/diagnosis/fault/updpateMulti/<projectId>', methods=['POST'])
def updateDiagnosisFaultMulti(projectId):
    result = True
    projectId = int(projectId)
    post = request.get_json()
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    postData = post.get('postdata')
    if postData != None:
        idList = postData.get('Ids') if postData.get('Ids')!=None else []
        if len(idList) > 0:
            grade = int(postData.get('Grade')) if postData.get('Grade')!=None else 0
            delay = postData.get('Delay') if postData.get('Delay')!=None else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            modifyTime = postData.get('ModifyTime') if postData.get('ModifyTime')!=None else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            faults = json.loads(getFaults(projectId))
            strDelete = "delete from diagnosis_faults where Id IN({0})".format(str(idList))
            strDelete = strDelete.replace('[','')
            strDelete = strDelete.replace(']','')
            rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update(dbname, strDelete,())
            if rv:
                strInsert = "insert into diagnosis_faults(Id,ParentId,`Name`,Description,Points,EquipmentId,DefaultGrade,IsUserDefined,UserId,UserFaultGrade,UserFaultDelay,UserModifyTime,UserEnable,Project) values"
                for id in idList:
                    for item in faults:
                        if item.get('id') == int(id):
                            strValues = "("
                            strValues += "%d,%d,\'%s\',\'%s\',\'%s\',%d,%d,%d,%d,%d,\'%s\',\'%s\',%d,\'%s\'" % \
                                         (int(item.get('id')) if item.get('id')!=None else 0, int(item.get('parentId')) if item.get('parentId')!=None else 0,
                                          item.get('name') if item.get('name')!=None else '', item.get('description') if item.get('description')!=None else '',
                                          item.get('points') if item.get('points')!=None else '', int(item.get('equipmentId')) if item.get('equipmentId')!=None else 0,
                                          int(item.get('defaultGrade')) if item.get('defaultGrade')!=None else 0, int(item.get('isUserDefined')) if item.get('isUserDefined')!=None else 0,
                                          int(item.get('userId')) if item.get('userId')!=None else 0, grade, delay,
                                          modifyTime, int(item.get('userEnable')) if item.get('userEnable')!=None else 0, item.get('project') if item.get('project')!=None else '')
                            strValues += ")"
                            strInsert += strValues
                            strInsert += ","
                if strInsert[-1] == ",":
                    strInsert = strInsert[0:len(strInsert)-1]
                result = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update(dbname, strInsert,())
            else:
                result = False
        else:
            result = False
    else:
        result = False
    return json.dumps(result, ensure_ascii=False)

# postdata:{
#     id:,
#     range: 'fault', //'equipment', 'subbuilding', 'building'
#     grade: ,
#     delay: ,
#     modifyTime: ,
# }
@app.route('/diagnosis/fault/updpateByRange/<projectId>', methods=['POST'])
def updateDiagnosisByRange(projectId):
    result = True
    projectId = int(projectId)
    post = request.get_json()
    postData = post.get('postdata')
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    if postData != None:
        faultId = int(postData.get('id')) if postData.get('id')!=None else 0
        range = postData.get('range') if postData.get('range')!=None else 'fault'
        grade = int(postData.get('grade')) if postData.get('grade')!=None else 0
        delay = postData.get('delay') if postData.get('delay')!=None else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        modifyTime = postData.get('modifyTime') if postData.get('modifyTime')!=None else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        if range == 'fault':
            strSQL = "update diagnosis_faults set UserFaultGrade=%d,UserFaultDelay=\'%s\',UserModifyTime=\'%s\'" % (grade, delay, modifyTime)
            result = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update(dbname, strSQL,())
        elif range == 'equipment':
            faults = json.loads(getFaults(projectId))
            strSQL = "select EquipmentId from diagnosis_faults where Id = %d" % (faultId,)
            rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query(dbname, strSQL,())
            if len(rv) > 0:
                strDelete = "delete from diagnosis_faults where EquipmentId=" % (rv[0][0])
                if BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query(dbname, strDelete,()):
                    strInsert = "insert into diagnosis_faults(Id,ParentId,`Name`,Description,Points,EquipmentId,DefaultGrade,IsUserDefined,UserId,UserFaultGrade,UserFaultDelay,UserModifyTime,UserEnable,Project) values"
                    for item in faults:
                        if item.get('equipmentId') == int(rv[0][0]):
                            strValues = "("
                            strValues += "%d,%d,\'%s\',\'%s\',\'%s\',%d,%d,%d,%d,%d,\'%s\',\'%s\',%d,\'%s\'" % \
                                         (int(item.get('id')) if item.get('id')!=None else 0, int(item.get('parentId')) if item.get('parentId')!=None else 0,
                                          item.get('name') if item.get('name')!=None else '', item.get('description') if item.get('description')!=None else '',
                                          item.get('points') if item.get('points')!=None else '', int(item.get('equipmentId')) if item.get('equipmentId')!=None else 0,
                                          int(item.get('defaultGrade')) if item.get('defaultGrade')!=None else 0, int(item.get('isUserDefined')) if item.get('isUserDefined')!=None else 0,
                                          int(item.get('userId')) if item.get('userId')!=None else 0, grade, delay,
                                          modifyTime, int(item.get('userEnable')) if item.get('userEnable')!=None else 0, item.get('project') if item.get('project')!=None else '')
                            strValues += ")"
                            strInsert += strValues
                            strInsert += ","
                    if strInsert[-1] == ",":
                        strInsert = strInsert[0:len(strInsert)-1]
                    result = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update(dbname, strInsert,())
                else:
                    result = False
            else:
                result = False
        elif range == 'subbuilding' or range == 'building':
            faults = json.loads(getFaults(projectId))
            strSQL = "select Id from diagnosis_faults as t3 where EquipmentId in\
                     (select Id from diagnosis_equipments as t2 where t2.ZoneId=\
                     (select ZoneId from diagnosis_equipments as t1 where t1.Id=\
                     (select EquipmentId from diagnosis_faults where Id=%d)))" % (faultId,)
            rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query(dbname, strSQL,())
            if len(rv) > 0:
                faultIdList = []
                for i in rv:
                    faultIdList.append(i[0])
                if len(faultIdList) > 0:
                    strDelete = "delete from diagnosis_faults where Id IN({0})".format(str(faultIdList))
                    strDelete = strDelete.replace('[','')
                    strDelete = strDelete.replace(']','')
                    rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update(dbname, strDelete,())
                    if rv:
                        strInsert = "insert into diagnosis_faults(Id,ParentId,`Name`,Description,Points,EquipmentId,DefaultGrade,IsUserDefined,UserId,UserFaultGrade,UserFaultDelay,UserModifyTime,UserEnable,Project) values"
                        for id in faultIdList:
                            for item in faults:
                                if item.get('id') == int(id):
                                    strValues = "("
                                    strValues += "%d,%d,\'%s\',\'%s\',\'%s\',%d,%d,%d,%d,%d,\'%s\',\'%s\',%d,\'%s\'" % \
                                                 (int(item.get('id')) if item.get('id')!=None else 0, int(item.get('parentId')) if item.get('parentId')!=None else 0,
                                                  item.get('name') if item.get('name')!=None else '', item.get('description') if item.get('description')!=None else '',
                                                  item.get('points') if item.get('points')!=None else '', int(item.get('equipmentId')) if item.get('equipmentId')!=None else 0,
                                                  int(item.get('defaultGrade')) if item.get('defaultGrade')!=None else 0, int(item.get('isUserDefined')) if item.get('isUserDefined')!=None else 0,
                                                  int(item.get('userId')) if item.get('userId')!=None else 0, grade, delay,
                                                  modifyTime, int(item.get('userEnable')) if item.get('userEnable')!=None else 0, item.get('project') if item.get('project')!=None else '')
                                    strValues += ")"
                                    strInsert += strValues
                                    strInsert += ","
                        if strInsert[-1] == ",":
                            strInsert = strInsert[0:len(strInsert)-1]
                        result = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update(dbname, strInsert,())
                    else:
                        result = False
                else:
                    result = False
            else:
                result = False
        else:
            print('%s is not valid parameter' % (range,))
            result = False
    return json.dumps(result, ensure_ascii=False)

@app.route('/diagnosis/getGroupsMembers/<userId>', methods=['GET'])
def getGroupsMembers(userId):
    group_members_list = []
    groups = StaticRelate.get_group_by_user_id(userId, 'id', 'name')
    if groups:
        for index in groups:
            group_members = StaticRelate.get_user_in_group(index.get('id'), 'userid', 'userfullname', 'username')
            group_members_list.append(group_members)
        data = {'groups': groups, 'groupMembers': group_members_list}
        return json.dumps(data, ensure_ascii=False)
    else:
        return json.dumps({'error': 'user has no group data'},  ensure_ascii=False)

@app.route('/diagnosis/order/enable/<projectId>/<enable>')
def diagnosisOrderEnable(projectId, enable):
    projectId = int(projectId)
    enable = int(enable)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    strSQL = "update diagnosis_order set Enable=%d where Project='%s'" % (enable, projectId)
    return json.dumps(BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update(dbname, strSQL,()), ensure_ascii=False)

@app.route('/diagnosis/enable/enable/<projectId>/<enable>')
def diagnosisEnableEnable(projectId, enable):
    projectId = int(projectId)
    enable = int(enable)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    strSQL = "update diagnosis_enable set Enable=%d where Project='%s'" % (enable, projectId)
    return json.dumps(BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update(dbname, strSQL,()), ensure_ascii=False)

@app.route('/diagnosis/limit/enable/<projectId>/<enable>')
def diagnosisLimitEnable(projectId, enable):
    projectId = int(projectId)
    enable = int(enable)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    strSQL = "update diagnosis_limit set 8Enable=%d where Project='%s'" % (enable, projectId)
    return json.dumps(BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update(dbname, strSQL,()), ensure_ascii=False)

@app.route('/diagnosis/order/delete/<projectId>/<Id>')
def diagnosisOrderDelete(projectId, Id):
    projectId = int(projectId)
    Id = int(Id)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    strSQL = "delete from diagnosis_order where ID=%d" % (Id,)
    return json.dumps(BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update(dbname, strSQL,()), ensure_ascii=False)

@app.route('/diagnosis/enable/delete/<projectId>/<Id>')
def diagnosisEnableDelete(projectId, Id):
    projectId = int(projectId)
    Id = int(Id)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    strSQL = "delete from diagnosis_enable where ID=%d" % (Id,)
    return json.dumps(BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update(dbname, strSQL,()), ensure_ascii=False)

@app.route('/diagnosis/limit/delete/<projectId>/<Id>')
def diagnosisLimitDelete(projectId, Id):
    projectId = int(projectId)
    Id = int(Id)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    strSQL = "delete from diagnosis_limit where ID=%d" % (Id,)
    return json.dumps(BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update(dbname, strSQL,()), ensure_ascii=False)

@app.route('/diagnosis/order/update/<projectId>/<Id>', methods=['POST'])
def diagnosisOrderUpdate(projectId, Id):
    projectId = int(projectId)
    Id = int(Id)
    post = request.get_json()
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    name = post.get('name') if post.get('name')!=None else ''
    operatorId = int(post.get('operatorId')) if post.get('operatorId')!=None else 0
    group = int(post.get('group')) if post.get('group')!=None else 0
    faultGrade = int(post.get('faultGrade')) if post.get('faultGrade')!=None else 0
    equipList = post.get('equipList') if post.get('equipList')!=None else ''
    project = post.get('project') if post.get('project')!=None else ''
    enable = int(post.get('enable')) if post.get('enable')!=None else 0
    strSQL = "update diagnosis_order set `Name`=\'%s\', OperatorID=%d, GroupID=%d, FaultGrade=%d, EquipList=\'%s\', ModifyTime=now(), Project=\'%s\', Enable=%d where ID=%d" % \
             (name, operatorId, group, faultGrade, equipList, project, enable, Id)
    return json.dumps(BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update(dbname, strSQL,()), ensure_ascii=False)

@app.route('/diagnosis/enable/update/<projectId>/<Id>', methods=['POST'])
def diagnosisEnableUpdate(projectId, Id):
    projectId = int(projectId)
    Id = int(Id)
    post = request.get_json()
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    name = post.get('name') if post.get('name')!=None else ''
    #startTime = post.get('startTime')
    endTime = post.get('endTime') if post.get('endTime')!=None else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    equipList = post.get('equipList') if post.get('equipList')!=None else ''
    project = post.get('project') if post.get('project')!=None else ''
    enable = int(post.get('enable')) if post.get('enable')!=None else 0
    strSQL = "update diagnosis_enable set `Name`=\'%s\', StartTime=now(), EndTime=\'%s\', EquipList=\'%s\', ModifyTime=now(), Project=\'%s\', Enable=%d where ID=%d" % (name, endTime, equipList, project, enable, Id)
    return json.dumps(BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update(dbname, strSQL,()), ensure_ascii=False)

@app.route('/diagnosis/limit/update/<projectId>/<Id>', methods=['POST'])
def diagnosisLimitUpdate(projectId, Id):
    projectId = int(projectId)
    Id = int(Id)
    post = request.get_json()
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    name = post.get('name') if post.get('name')!=None else ''
    equipList = post.get('equipList') if post.get('equipList')!=None else ''
    fault = int(post.get('fault')) if post.get('fault')!=None else 0
    alert = int(post.get('alert')) if post.get('alert')!=None else 0
    notice = int(post.get('notice')) if post.get('notice')!=None else 0
    project = post.get('project') if post.get('project')!=None else ''
    enable = int(post.get('enable')) if post.get('enable')!=None else 0
    strSQL = "update diagnosis_limit set `Name`=\'%s\', EquipList=\'%s\', Fault=%d, Alert=%d, Notice=%d, ModifyTime=now(), Project=\'%s\', Enable=%d where ID=%d" % (name, equipList, fault, alert, notice, project, enable, Id)
    return json.dumps(BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update(dbname, strSQL,()), ensure_ascii=False)

#useless
@app.route('/diagnosis/getLastInsertedId/<projectId>', methods=['POST'])
def getLastInsertedId(projectId):
    projectId = int(projectId)
    data = request.get_json()
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    nLastID = -1
    tableName = data.get('tableName') if data.get('tableName')!=None else ''
    if len(tableName) > 0:
       strSQL = "select id from %s order by id desc limit 0,1" % (tableName,)
       rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query(dbname, strSQL,())
       if len(rv) > 0:
           nLastID = rv[0][0]
    return json.dumps(nLastID, ensure_ascii=False)