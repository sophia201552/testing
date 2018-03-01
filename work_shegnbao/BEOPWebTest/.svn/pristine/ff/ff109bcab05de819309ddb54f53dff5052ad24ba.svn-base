"""
Routes and views for the flask application.
"""

from beopWeb import app
from beopWeb.BEOPDataAccess import *
from flask import request, url_for, redirect, render_template, json
import requests
from datetime import datetime, timedelta
import time
import subprocess
from beopWeb.mod_workflow.StaticRelate import StaticRelate
from beopWeb.BEOPMongoDataAccess import BEOPMongoDataAccess
from beopWeb.views import g_userAddress

BEOP_SERVICE_ADDRESS = 'http://beop.rnbtech.com.hk:5000'

@app.route('/diagnosis/notice/add/<projectId>', methods=['POST'])
def addDiagnosisNotice(projectId):
    data = request.get_json()
    headers = {'content-type': 'application/json'}
    rt = requests.post(BEOP_SERVICE_ADDRESS + '/diagnosis/notice/add/' + str(projectId), data=json.dumps(data),
                              headers=headers,timeout = 600)
    return json.dumps(rt, ensure_ascii=False)

@app.route('/diagnosis/notice/addMulti/<projectId>', methods=['POST'])
def addDiagnosisNoticeMulti(projectId):
    data = request.get_json()
    headers = {'content-type': 'application/json'}
    rt = requests.post(BEOP_SERVICE_ADDRESS + '/diagnosis/notice/addMulti/' + str(projectId), data=json.dumps(data),
                              headers=headers,timeout = 600)
    return rt.text

@app.route('/diagnosis/notice/get/<projectId>')
@app.route('/diagnosis/notice/get/<projectId>/<time_delta>')
def getDiagnosisNotices(projectId, time_delta=30):
    headers = {'content-type': 'application/json'}
    rt = requests.get(BEOP_SERVICE_ADDRESS + '/diagnosis/notice/get/' + str(projectId), headers=headers,timeout = 600)
    return rt.text

#Get all notices
@app.route('/diagnosis/notice/getAll/<projectId>')
def getDiagnosisAllNotices(projectId):
    data = []
    dbAccess = BEOPDataAccess.getInstance()
    dbname = dbAccess.getProjMysqldb(projectId)
    if (dbname is None):
        dbname = dbAccess.getProjMysqldbByName(projectId)
    if dbname != None:
        strSQL = 'SELECT ID,FaultId,Time,OrderId,Energy,Detail,Status,Project FROM  %s_'%dbname +'diagnosis_notices ORDER BY Time desc'
        rv = dbAccess._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
        data = [{ 'id': x[0], 'faultId': x[1], 'time': x[2].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[2], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
          'orderId': x[3], 'energy':x[4], 'detail':x[5], 'status':x[6], 'project':x[7]} for x in rv]
    return json.dumps(data, ensure_ascii=False)

@app.route('/diagnosis/fault/add/<projectId>', methods=['POST'])
def addFault(projectId):
    data = request.get_json()
    headers = {'content-type': 'application/json'}
    rt = requests.post(BEOP_SERVICE_ADDRESS + '/diagnosis/fault/add/' + str(projectId), data=json.dumps(data),
                              headers=headers,timeout = 600)
    return rt.text

@app.route('/diagnosis/fault/addMulti/<projectId>', methods=['POST'])
def addFaultMulti(projectId):
    data = request.get_json()
    headers = {'content-type': 'application/json'}
    rt = requests.post(BEOP_SERVICE_ADDRESS + '/diagnosis/fault/addMulti/' + str(projectId), data=json.dumps(data),
                              headers=headers,timeout = 600)
    return rt.text

@app.route('/diagnosis/fault/get/<projectId>')
def getFaults(projectId):
    headers = {'content-type': 'application/json'}
    rt = requests.get(BEOP_SERVICE_ADDRESS + '/diagnosis/fault/get/' + str(projectId), headers=headers,timeout = 600)
    return rt.text

@app.route('/diagnosis/fault/getInNotices/<projectId>')
def getFaultsInNotices(projectId):
    data = []
    dbAccess = BEOPDataAccess.getInstance()
    dbname = dbAccess.getProjMysqldb(projectId)
    if (dbname is None):
        dbname = dbAccess.getProjMysqldbByName(projectId)
    if dbname != None:
        strSQL = 'SELECT Id,ParentId,`Name`,Description,Points,EquipmentId,DefaultGrade,IsUserDefined,UserId,UserFaultGrade,UserFaultDelay,UserModifyTime,UserEnable,Project\
                FROM  %s_'%dbname +'diagnosis_faults WHERE Id IN (SELECT FaultId FROM  %s_'%dbname +'diagnosis_notices)'
        rv = dbAccess._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
        data = [{ 'id': x[0], 'parentId': x[1], 'name': x[2], 'description': x[3], 'points':x[4], 'equipmentId': x[5],
                'defaultGrade': x[6], 'isUserDefined': x[7], 'userId': x[8], 'userFaultGrade': x[9],
                'userFaultDelay':x[10].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[10], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'userModifyTime': x[11].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[11], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'userEnable':x[12], 'project':x[13] } for x in rv]
    return json.dumps(data, ensure_ascii=False)

@app.route('/diagnosis/equipment/get/<projectId>')
def getEquipments(projectId):
    headers = {'content-type': 'application/json'}
    rt = requests.get(BEOP_SERVICE_ADDRESS + '/diagnosis/equipment/get/' + str(projectId), headers=headers,timeout = 600)
    return rt.text

@app.route('/diagnosis/zone/get/<projectId>')
def getZones(projectId):
    headers = {'content-type': 'application/json'}
    rt = requests.get(BEOP_SERVICE_ADDRESS + '/diagnosis/zone/get/' + str(projectId), headers=headers,timeout = 600)
    return rt.text

@app.route('/diagnosis/getAll/<projectId>')
@app.route('/diagnosis/getAll/<projectId>/<userId>')
def getDiagnosisAll(projectId, userId=0):
    headers = {'content-type': 'application/json'}
    rt = requests.get(BEOP_SERVICE_ADDRESS + '/diagnosis/getAll/' + str(projectId), headers=headers,timeout = 600)
    return rt.text

@app.route('/diagnosis/fault/customUpdate/<projectId>', methods=['POST'])
def updateCustomOption(projectId):
    bSuccess = False
    projectId = int(projectId)
    data = request.get_json()
    dbAccess = BEOPDataAccess.getInstance()
    dbname = dbAccess.getProjMysqldb(projectId)
    if dbname != None:
        strSQL = 'UPDATE  %s_'%dbname +'diagnosis_faults SET IsUserDefined = %d, UserId = %d, UserFaultGrade = %d, UserFaultDelay = \"%s\", UserModifyTime = NOW() WHERE Id = %d' % \
                 (int(data.get('isUserDefined')) if data.get('isUserDefined')!=None else 0, int(data.get('userId')) if data.get('userId')!=None else 0,
                  int(data.get('userFaultGrade')) if data.get('userFaultGrade')!=None else 0,
                  data.get('userFaultDelay') if data.get('userFaultDelay')!=None else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                  int(data.get('id')) if data.get('id')!=None else 0)
        bSuccess = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL, ())
        if data.get('status') == 0:
            strSQL = 'UPDATE  %s_'%dbname +'diagnosis_notices SET Status = 0 WHERE FaultId = %d' % (int(data.get('id')) if data.get('id')!=None else 0)
            bSuccess = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL, ())
    return json.dumps(bSuccess, ensure_ascii=False)

@app.route('/diagnosis/notice/get/<projectId>/<startTime>/<endTime>')
def getDiagnosisNoticeByTimeSpan(projectId, startTime, endTime):
    headers = {'content-type': 'application/json'}
    rt = requests.get(BEOP_SERVICE_ADDRESS + '/diagnosis/notice/get/' + str(projectId)+ '/' + startTime + '/' + endTime,
                             headers=headers,timeout = 600)
    return rt.text

@app.route('/diagnosis/notice/getLimit/<projectId>')
def getDiagnosisNoticesLimit(projectId):
    data = []
    dbAccess = BEOPDataAccess.getInstance()
    dbname = dbAccess.getProjMysqldb(projectId)
    if (dbname is None):
        dbname = dbAccess.getProjMysqldbByName(projectId)
    if dbname != None:
        strSQL = 'SELECT * FROM (SELECT ID,FaultId,Time,OrderId,Energy,Detail,Status,Project FROM  %s_'%dbname +'diagnosis_notices ORDER BY Time desc limit 0,20) as t GROUP BY FaultId ORDER BY Time desc'
        rv = dbAccess._mysqlDBContainer.op_db_query('diagnosis', strSQL,())

        data = [{ 'id': x[0], 'faultId': x[1], 'time': x[2].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[2], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                  'orderId': x[3], 'energy': x[4], 'detail': x[5], 'status':x[6], 'project':x[7] } for x in rv]
    return json.dumps(data, ensure_ascii=False)


@app.route('/diagnosis/notice/makesure/<projectId>/<noticeId>')
def setNoticeToSure(projectId, noticeId):
    rt = False
    projectId = int(projectId)
    noticeId = int(noticeId)
    dbAccess = BEOPDataAccess.getInstance()
    dbname = dbAccess.getProjMysqldb(projectId)
    if (dbname is None):
        dbname = dbAccess.getProjMysqldbByName(projectId)
    if dbname != None:
        strSQL = 'SELECT FaultId FROM  %s_'%dbname +'diagnosis_notices WHERE ID=%s'%noticeId
        rv = dbAccess._mysqlDBContainer.op_db_query('diagnosis', strSQL, ())
        if (len(rv) > 0):
            strSQL = 'update  %s_'%dbname +'diagnosis_notices set status=%s where FaultId = %s'%(0,rv[0][0])
            rt = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL, ())
    return json.dumps(rt, ensure_ascii=False)

@app.route('/diagnosis/limit/get/<projectId>')
def getDiagnosisLimit(projectId):
    headers = {'content-type': 'application/json'}
    rt = requests.get(BEOP_SERVICE_ADDRESS + '/diagnosis/limit/get/' + str(projectId),
                             headers=headers,timeout = 600)
    return rt.text

@app.route('/diagnosis/order/get/<projectId>')
def getDiagnosisOrder(projectId):
    headers = {'content-type': 'application/json'}
    rt = requests.get(BEOP_SERVICE_ADDRESS + '/diagnosis/order/get/' + str(projectId),
                             headers=headers,timeout = 600)
    return rt.text

@app.route('/diagnosis/enable/get/<projectId>')
def getDiagnosisEnable(projectId):
    headers = {'content-type': 'application/json'}
    rt = requests.get(BEOP_SERVICE_ADDRESS + '/diagnosis/enable/get/' + str(projectId),
				 headers=headers,timeout = 600)
    return rt.text

@app.route('/diagnosis/config/get/<projectId>')
def getDiagnosisConfig(projectId):
    data = {}
    projectId = int(projectId)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if (dbname is None):
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    if dbname != None:
        strSQL = 'SELECT ID,`Name`, EquipList, Fault, Alert, Notice, ModifyTime, Project, Enable FROM  %s_'%dbname +'diagnosis_limit ORDER BY ID'
        rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
        limit = [{ 'id': x[0], 'name': x[1], 'equipList':x[2], 'fault': x[3], 'alert': x[4], 'notice': x[5],
                  'modifyTime': x[6].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[6], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                  'project':x[7], 'enable':x[8]} for x in rv]

        strSQL = 'select ID,`Name`, OperatorID, GroupID, FaultGrade, EquipList, ModifyTime, Project, Enable from   %s_'%dbname +'diagnosis_order order by Project'
        rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
        order = [{'id':x[0], 'name': x[1], 'operatorId': x[2], 'groupId': x[3], 'faultGrade': x[4], 'equipList': x[5],
                 'modifyTime': x[6].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[6], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                 'project':x[7], 'enable':x[8]} for x in rv]

        strSQL = 'select ID,`Name`, StartTime, EndTime, EquipList, ModifyTime, Project, Enable from   %s_'%dbname +'diagnosis_enable order by ID'
        rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
        enable = [{ 'id': x[0], 'name': x[1], 'startTime': x[2].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[2], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                  'endTime': x[3].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[3], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'), 'equipList': x[4],
                  'modifyTime': x[5].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[5], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'), 'project':x[6], 'enable':x[7]} for x in rv]
        data = {'limit': limit, 'order': order, 'enable': enable}
    return json.dumps(data, ensure_ascii=False)

@app.route('/diagnosis/limit/add/<projectId>', methods=['POST'])
def addDiagnosisLimit(projectId):
    rt = False
    projectId = int(projectId)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    if dbname != None:
        post = request.get_json()
        name = post.get('name') if post.get('name')!=None else ''
        equipList = post.get('equipList') if post.get('equipList')!=None else ''
        fault = int(post.get('fault')) if post.get('fault')!=None else 0
        alert = int(post.get('alert')) if post.get('alert')!=None else 0
        notice = int(post.get('notice')) if post.get('notice')!=None else 0
        project = post.get('project') if post.get('project')!=None else ''
        enable = int(post.get('enable')) if post.get('enable')!=None else 0
        strSQL = "insert into   %s_'%dbname +'diagnosis_limit(`Name`, EquipList, Fault, Alert, Notice, ModifyTime, Project, Enable) values(\'%s\', \'%s\', %d, %d, %d, now(), \'%s\', %d)" % \
                 (name, equipList, fault, alert, notice, project, enable)
        rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update_with_id('diagnosis','diagnosis_limit', strSQL,())
    return json.dumps(rt, ensure_ascii=False)

@app.route('/diagnosis/order/add/<projectId>', methods=['POST'])
def addDiagnosisOrder(projectId):
    rt = False
    projectId = int(projectId)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    if dbname != None:
        post = request.get_json()
        name = post.get('name') if post.get('name')!=None else ''
        operatorId = int(post.get('operatorId')) if post.get('operatorId')!=None else 0
        group = int(post.get('group')) if post.get('group')!=None else 0
        faultGrade = int(post.get('faultGrade')) if post.get('faultGrade')!=None else 0
        equipList = post.get('equipList') if post.get('equipList')!=None else ''
        project = post.get('project') if post.get('project')!=None else ''
        enable = int(post.get('enable')) if post.get('enable')!=None else 0
        strSQL = "insert into   %s_'%dbname +'diagnosis_order(`Name`, OperatorID, GroupID, FaultGrade, EquipList, ModifyTime, Project, Enable) values(\'%s\', %d, %d, %d, \'%s\', now(), \'%s\', %d)" % \
                 (name, operatorId, group, faultGrade, equipList, project, enable)
        rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update_with_id('diagnosis','diagnosis_order', strSQL,())
    return json.dumps(rt, ensure_ascii=False)

@app.route('/diagnosis/enable/add/<projectId>', methods=['POST'])
def addDiagnosisEanble(projectId):
    rt = False
    projectId = int(projectId)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    if dbname != None:
        post = request.get_json()
        name = post.get('name') if post.get('name')!=None else ''
        #startTime = post.get('startTime')
        endTime = post.get('endTime') if post.get('endTime')!=None else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        equipList = post.get('equipList') if post.get('equipList')!=None else ''
        project = post.get('project') if post.get('project')!=None else ''
        enable = int(post.get('enable')) if post.get('enable')!=None else 0
        strSQL = "insert into   %s_'%dbname +'diagnosis_enable(`Name`, StartTime, EndTime, EquipList, ModifyTime, Project, Enable) values(\'%s\', now(), \'%s\', \'%s\', now(), \'%s\', %d)" \
                 % (name, endTime, equipList, project, enable)
        rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update_with_id('diagnosis','diagnosis_enable', strSQL,())
    return json.dumps(rt, ensure_ascii=False)

@app.route('/diagnosis/fault/get/<projectId>/<startTime>/<endTime>')
def getFaultsByTimeSpan(projectId,startTime,endTime):
    headers = {'content-type': 'application/json'}
    rt = requests.get(BEOP_SERVICE_ADDRESS + '/diagnosis/fault/get/' + str(projectId) + '/' + startTime + '/' + endTime,
                             headers=headers,timeout = 600)
    return rt.text

@app.route('/diagnosis/order/get/<projectId>/<startTime>/<endTime>')
def getDiagnosisOrderByTimeSpan(projectId,startTime,endTime):
    headers = {'content-type': 'application/json'}
    rt = requests.get(BEOP_SERVICE_ADDRESS + '/diagnosis/order/get/' + str(projectId) + '/' + startTime + '/' + endTime,
                             headers=headers,timeout = 600)
    return rt.text

@app.route('/diagnosis/limit/get/<projectId>/<startTime>/<endTime>')
def getDiagnosisLimitByTimeSpan(projectId,startTime,endTime):
    headers = {'content-type': 'application/json'}
    rt = requests.get(BEOP_SERVICE_ADDRESS + '/diagnosis/limit/get/' + str(projectId) + '/' + startTime + '/' + endTime,
                             headers=headers,timeout = 600)
    return rt.text

@app.route('/diagnosis/enable/get/<projectId>/<startTime>/<endTime>')
def getDiagnosisEnableByTimeSpan(projectId,startTime,endTime):
    headers = {'content-type': 'application/json'}
    rt = requests.get(BEOP_SERVICE_ADDRESS + '/diagnosis/enable/get/' + str(projectId) + '/' + startTime + '/' + endTime,
				 headers=headers,timeout = 600)
    return rt.text

@app.route('/diagnosis/equipment/add/<projectId>', methods=['POST'])
def addDiagnosisEquipment(projectId):
    data = request.get_json()
    headers = {'content-type': 'application/json'}
    rt = requests.post(BEOP_SERVICE_ADDRESS + '/diagnosis/equipment/add/' + str(projectId), data=json.dumps(data),
                              headers=headers,timeout = 600)
    return rt.text

@app.route('/diagnosis/equipment/addMulti/<projectId>', methods=['POST'])
def addDiagnosisEquipmentMulti(projectId):
    data = request.get_json()
    headers = {'content-type': 'application/json'}
    rt = requests.post(BEOP_SERVICE_ADDRESS + '/diagnosis/equipment/addMulti/' + str(projectId), data=json.dumps(data),
                              headers=headers,timeout = 600)
    return rt.text

@app.route('/diagnosis/zone/add/<projectId>', methods=['POST'])
def addDiagnosisZone(projectId):
    data = request.get_json()
    headers = {'content-type': 'application/json'}
    rt = requests.post(BEOP_SERVICE_ADDRESS + '/diagnosis/zone/add/' + str(projectId), data=json.dumps(data),
                              headers=headers,timeout = 600)
    return rt.text

@app.route('/diagnosis/zone/addMulti/<projectId>', methods=['POST'])
def addDiagnosisZoneMulti(projectId):
    data = request.get_json()
    headers = {'content-type': 'application/json'}
    rt = requests.post(BEOP_SERVICE_ADDRESS + '/diagnosis/zone/addMulti/' + str(projectId), data=json.dumps(data),
                              headers=headers,timeout = 600)
    return rt.text

@app.route('/diagnosis/order/getByEquipId/<projectId>/<EquipId>')
def getDiagnosisOrderByEquipId(projectId, EquipId):
    projectId = int(projectId)
    data = {}
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    if dbname != None:
        strSQL = 'SELECT * FROM   %s_'%dbname +'diagnosis_order where EquipList like \"%%%s%%\" order by ModifyTime desc' % (str(EquipId))
        rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
        if rv != None:
            if len(rv) > 0:
                data = {'id':rv[0][0], 'name': rv[0][1], 'operatorId': rv[0][2], 'groupId': rv[0][3], 'faultGrade': rv[0][4], 'equipList': rv[0][5],
                        'modifyTime': rv[0][6].strftime('%Y-%m-%d %H:%M:%S') if isinstance(rv[0][6], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                        'project':rv[0][7], 'enable':rv[0][8]}
    return json.dumps(data, ensure_ascii=False)

@app.route('/diagnosis/fault/updpateMulti/<projectId>', methods=['POST'])
def updateDiagnosisFaultMulti(projectId):
    result = True
    projectId = int(projectId)
    post = request.get_json()
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    if dbname != None:
        postData = post.get('postdata')
        if postData != None:
            idList = postData.get('Ids') if postData.get('Ids')!=None else []
            if len(idList) > 0:
                grade = int(postData.get('Grade')) if postData.get('Grade')!=None else 0
                delay = postData.get('Delay') if postData.get('Delay')!=None else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                modifyTime = postData.get('ModifyTime') if postData.get('ModifyTime')!=None else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                faults = json.loads(getFaults(projectId))
                strDelete = "delete from   %s_"%dbname +"diagnosis_faults where Id IN({0})".format(str(idList))
                strDelete = strDelete.replace('[','')
                strDelete = strDelete.replace(']','')
                rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strDelete,())
                if rv:
                    strInsert = "insert into   %s_"%dbname +"diagnosis_faults(Id,ParentId,`Name`,Description,Points,EquipmentId,DefaultGrade,IsUserDefined,UserId,UserFaultGrade,UserFaultDelay,UserModifyTime,UserEnable,Project) values"
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
                    result = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strInsert,())
                else:
                    result = False
            else:
                result = False
        else:
            result = False
    return json.dumps(result, ensure_ascii=False)

@app.route('/diagnosis/fault/updpateByRange/<projectId>', methods=['POST'])
def updateDiagnosisByRange(projectId):
    result = True
    projectId = int(projectId)
    post = request.get_json()
    postData = post.get('postdata')
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    if dbname != None:
        if postData != None:
            faultId = int(postData.get('id')) if postData.get('id')!=None else 0
            range = postData.get('range') if postData.get('range')!=None else 'fault'
            grade = int(postData.get('grade')) if postData.get('grade')!=None else 0
            delay = postData.get('delay') if postData.get('delay')!=None else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            modifyTime = postData.get('modifyTime') if postData.get('modifyTime')!=None else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            if range == 'fault':
                strSQL = "update   %s_"%dbname +"diagnosis_faults set UserFaultGrade=%d,UserFaultDelay=\'%s\',UserModifyTime=\'%s\'" % (grade, delay, modifyTime)
                result = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
            elif range == 'equipment':
                faults = json.loads(getFaults(projectId))
                strSQL = "select EquipmentId from   %s_"%dbname +"diagnosis_faults where Id = %d" % (faultId,)
                rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
                if len(rv) > 0:
                    strDelete = "delete from   %s_"%dbname +"diagnosis_faults where EquipmentId=" % (rv[0][0])
                    if BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query('diagnosis', strDelete,()):
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
                        result = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strInsert,())
                    else:
                        result = False
                else:
                    result = False
            elif range == 'subbuilding' or range == 'building':
                faults = json.loads(getFaults(projectId))
                strSQL = "select Id from %s_"%dbname +"diagnosis_faults as t3 where EquipmentId in\
                         (select Id from %s_"%dbname +"diagnosis_equipments as t2 where t2.ZoneId=\
                         (select ZoneId from %s_"%dbname +"diagnosis_equipments as t1 where t1.Id=\
                         (select EquipmentId from %s_"%dbname +"diagnosis_faults where Id=%d)))" % (faultId,)
                rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
                if len(rv) > 0:
                    faultIdList = []
                    for i in rv:
                        faultIdList.append(i[0])
                    if len(faultIdList) > 0:
                        strDelete = "delete from %s_"%dbname +"diagnosis_faults where Id IN({0})".format(str(faultIdList))
                        strDelete = strDelete.replace('[','')
                        strDelete = strDelete.replace(']','')
                        rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strDelete,())
                        if rv:
                            strInsert = "insert into %s_"%dbname +"diagnosis_faults(Id,ParentId,`Name`,Description,Points,EquipmentId,DefaultGrade,IsUserDefined,UserId,UserFaultGrade,UserFaultDelay,UserModifyTime,UserEnable,Project) values"
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
                            result = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strInsert,())
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
    rt = False
    projectId = int(projectId)
    enable = int(enable)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    if dbname != None:
        strSQL = "update %s_"%dbname +"diagnosis_order set Enable=%d where Project='%s'" % (enable, projectId)
        rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    return json.dumps(rt, ensure_ascii=False)

@app.route('/diagnosis/enable/enable/<projectId>/<enable>')
def diagnosisEnableEnable(projectId, enable):
    rt = False
    projectId = int(projectId)
    enable = int(enable)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    if dbname != None:
        strSQL = "update %s_"%dbname +"diagnosis_enable set Enable=%d where Project='%s'" % (enable, projectId)
        rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    return json.dumps(rt, ensure_ascii=False)

@app.route('/diagnosis/limit/enable/<projectId>/<enable>')
def diagnosisLimitEnable(projectId, enable):
    rt = False
    projectId = int(projectId)
    enable = int(enable)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    if dbname != None:
        strSQL = "update %s_"%dbname +"diagnosis_limit set 8Enable=%d where Project='%s'" % (enable, projectId)
        rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    return json.dumps(rt, ensure_ascii=False)

@app.route('/diagnosis/order/delete/<projectId>/<Id>')
def diagnosisOrderDelete(projectId, Id):
    rt = False
    projectId = int(projectId)
    Id = int(Id)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    if dbname != None:
        strSQL = "delete from %s_"%dbname +"diagnosis_order where ID=%d" % (Id,)
        rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    return json.dumps(rt, ensure_ascii=False)

@app.route('/diagnosis/enable/delete/<projectId>/<Id>')
def diagnosisEnableDelete(projectId, Id):
    rt = False
    projectId = int(projectId)
    Id = int(Id)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    if dbname != None:
        strSQL = "delete from %s_"%dbname +"diagnosis_enable where ID=%d" % (Id,)
        rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    return json.dumps(rt, ensure_ascii=False)

@app.route('/diagnosis/limit/delete/<projectId>/<Id>')
def diagnosisLimitDelete(projectId, Id):
    rt = False
    projectId = int(projectId)
    Id = int(Id)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    if dbname != None:
        strSQL = "delete from %s_"%dbname +"diagnosis_limit where ID=%d" % (Id,)
        rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    return json.dumps(rt, ensure_ascii=False)

@app.route('/diagnosis/order/update/<projectId>/<Id>', methods=['POST'])
def diagnosisOrderUpdate(projectId, Id):
    rt = False
    projectId = int(projectId)
    Id = int(Id)
    post = request.get_json()
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    if dbname != None:
        name = post.get('name') if post.get('name')!=None else ''
        operatorId = int(post.get('operatorId')) if post.get('operatorId')!=None else 0
        group = int(post.get('group')) if post.get('group')!=None else 0
        faultGrade = int(post.get('faultGrade')) if post.get('faultGrade')!=None else 0
        equipList = post.get('equipList') if post.get('equipList')!=None else ''
        project = post.get('project') if post.get('project')!=None else ''
        enable = int(post.get('enable')) if post.get('enable')!=None else 0
        strSQL = "update %s_"%dbname +"diagnosis_order set `Name`=\'%s\', OperatorID=%d, GroupID=%d, FaultGrade=%d, EquipList=\'%s\', ModifyTime=now(), Project=\'%s\', Enable=%d where ID=%d" % \
                 (name, operatorId, group, faultGrade, equipList, project, enable, Id)
        rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    return json.dumps(rt, ensure_ascii=False)

@app.route('/diagnosis/enable/update/<projectId>/<Id>', methods=['POST'])
def diagnosisEnableUpdate(projectId, Id):
    rt = False
    projectId = int(projectId)
    Id = int(Id)
    post = request.get_json()
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    if dbname != None:
        name = post.get('name') if post.get('name')!=None else ''
        #startTime = post.get('startTime')
        endTime = post.get('endTime') if post.get('endTime')!=None else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        equipList = post.get('equipList') if post.get('equipList')!=None else ''
        project = post.get('project') if post.get('project')!=None else ''
        enable = int(post.get('enable')) if post.get('enable')!=None else 0
        strSQL = "update %s_"%dbname +"diagnosis_enable set `Name`=\'%s\', StartTime=now(), EndTime=\'%s\', EquipList=\'%s\', ModifyTime=now(), Project=\'%s\', Enable=%d where ID=%d" \
                 % (name, endTime, equipList, project, enable, Id)
        rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    return json.dumps(rt, ensure_ascii=False)

@app.route('/diagnosis/limit/update/<projectId>/<Id>', methods=['POST'])
def diagnosisLimitUpdate(projectId, Id):
    rt = False
    projectId = int(projectId)
    Id = int(Id)
    post = request.get_json()
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if dbname is None:
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    if dbname != None:
        name = post.get('name') if post.get('name')!=None else ''
        equipList = post.get('equipList') if post.get('equipList')!=None else ''
        fault = int(post.get('fault')) if post.get('fault')!=None else 0
        alert = int(post.get('alert')) if post.get('alert')!=None else 0
        notice = int(post.get('notice')) if post.get('notice')!=None else 0
        project = post.get('project') if post.get('project')!=None else ''
        enable = int(post.get('enable')) if post.get('enable')!=None else 0
        strSQL = "update %s_"%dbname +"diagnosis_limit set `Name`=\'%s\', EquipList=\'%s\', Fault=%d, Alert=%d, Notice=%d, ModifyTime=now(), Project=\'%s\', Enable=%d where ID=%d" \
                 % (name, equipList, fault, alert, notice, project, enable, Id)
        rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    return json.dumps(rt, ensure_ascii=False)
