"""
Routes and views for the flask application.
"""

from beopWeb import app
from beopWeb.BEOPDataAccess import *
from flask import request, url_for, redirect, render_template, json, jsonify
import requests
from datetime import datetime, timedelta
import time
import subprocess
from beopWeb.mod_workflow.StaticRelate import StaticRelate
from beopWeb.BEOPMongoDataAccess import BEOPMongoDataAccess
from beopWeb.views import g_userAddress
import logging


@app.route('/diagnosis/notice/makesure/<projectId>/<noticeId>/<userId>')
def setNoticeToSure(projectId, noticeId, userId):
    rt = False
    try:
        projectId = int(projectId)
        noticeId = int(noticeId)
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        if (dbname is None):
            dbname = dbAccess.getProjMysqldbByName(projectId)
        if dbname != None:
            strSQL = 'update ' + dbname +'_diagnosis_faults set NoticeId=NULL where NoticeId = %s;'
            rt = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL, (noticeId))
            strSQL = 'update  ' + dbname +'_diagnosis_notices set status=%s, Operator=%s, CheckTime=NOW() where Id = %s;'
            rt = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL, (0, userId, noticeId))
    except Exception as e:
        print(e)
        logging.error("setNoticeToSure:%s"%(e.__str__(),))
        logging.exception(e)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/diagnosis/getStruct/<projectId>')
def GetEquipmentsAndZones(projectId):
    rt = None
    try:
        headers = {'content-type': 'application/json'}
        rt = requests.get(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/getAll/EquipmentsAndZones/' + str(projectId), headers=headers,timeout = 600)
    except Exception as e:
        print('GetEquipmentsAndZones error:' + e.__str__())
        logging.error("/diagnosis/getAll/EquipmentsAndZones:%s"%(e.__str__(),))
        logging.exception(e)
    return rt.text

@app.route('/diagnosis/updateZoneFaultCount/<projectId>', methods=['POST'])
def updateZoneFaultCount(projectId):
    rt = None
    try:
        #data = request.get_json()
        #headers = {'content-type': 'application/json'}
        #rt = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/updateZoneFaultCount/' + str(projectId), headers = headers, data = json.dumps(data), timeout = 600)
        pass
    except Exception as e:
        print('updateZoneFaultCount error:' + e.__str__())
        logging.error('updateZoneFaultCount error:' + e.__str__())
    return rt

@app.route('/diagnosis/getRealtimeFault/<projectId>')
@app.route('/diagnosis/getRealtimeFault/<projectId>/<zoneId>')
def getRealTImeFault(projectId, zoneId = None):
    try:
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        if (dbname is None):
            dbname = dbAccess.getProjMysqldbByName(projectId)
        if dbname != None:
            if zoneId is not None:
                strSQL = 'SELECT n.Id, n.FaultId, n.Time, n.OrderId, n.Energy, n.Detail, n.`Status`, n.Project, n.CheckTime, ' \
                         'n.Operator, f.Id, f.ParentId, f.`Name`, f.Description, f.Points, f.EquipmentId, f.DefaultGrade, f.IsUserDefined, ' \
                         'f.UserId, f.UserFaultGrade, f.UserFaultDelay, f.UserModifyTime, f.UserEnable ' \
                         'FROM %s_diagnosis_faults AS f ' \
                         'LEFT JOIN %s_diagnosis_notices AS n ON n.Id = f.NoticeId ' \
                         'LEFT JOIN %s_diagnosis_equipments AS e ON e.Id = f.EquipmentId ' \
                         'WHERE f.NoticeId <> 0 AND n.`Status` = 1 AND e.ZoneId = %d ' \
                         'ORDER BY n.Time DESC'%(dbname,dbname,dbname,int(zoneId))
            else:
                strSQL = 'SELECT n.ID,n.FaultId,n.Time,n.OrderId,n.Energy,n.Detail,n.Status,n.Project, n.CheckTime, n.Operator, ' \
                         'f.Id, f.ParentId,f.Name,f.Description,f.Points,f.EquipmentId,f.DefaultGrade,f.IsUserDefined,f.UserId,' \
                         'f.UserFaultGrade,f.UserFaultDelay,f.UserModifyTime,f.UserEnable ' \
                         'FROM %s_diagnosis_faults AS f ' \
                         'LEFT JOIN %s_diagnosis_notices AS n ON n.ID=f.noticeId ' \
                         'WHERE f.NoticeId <> 0 AND n.`Status` = 1 ORDER BY n.Time desc;'%(dbname,dbname)
    except Exception as e:
        print('getRealTImeFault error:' + e.__str__())
        logging.error('getRealTImeFault error:' + e.__str__())
    return preprocessFaultData(strSQL)

@app.route('/diagnosis/getRealtimeFaultPoints/<projectId>/<overdue_type>/<user_level>'
           '/<fault_time_type>/<int:current_page>/<int:page_size>/')
def getRealTImeFaultPoints(projectId, overdue_type, user_level, fault_time_type, current_page, page_size):
    try:
        dbAccess = BEOPDataAccess.getInstance()
        start_num = (current_page - 1) * page_size
        end_num = start_num + page_size
        dbname = dbAccess.getProjMysqldb(projectId)
        today = datetime.now()
        condition = ''
        if overdue_type != "all":
            end_time = ''
            if overdue_type == 'one-month':
                end_time = (today - timedelta(days=30)).strftime('%Y-%m-%d')
            if overdue_type == 'two-month':
                end_time = (today - timedelta(days=60)).strftime('%Y-%m-%d')
            if overdue_type == 'three-month':
                end_time = (today - timedelta(days=90)).strftime('%Y-%m-%d')
            if overdue_type == 'half-year':
                end_time = (today - timedelta(days=180)).strftime('%Y-%m-%d')
            condition += 'AND Time <= "' + end_time + '"'

        if fault_time_type != "all":
            start_time = ''
            end_time = ''
            if fault_time_type == 'today':
                start_time = today.strftime('%Y-%m-%d 00:00:00')
                end_time = today.strftime('%Y-%m-%d %H:%M:%S')
            if fault_time_type == 'yesterday':
                yesterday = today - timedelta(days=1)
                start_time = yesterday.strftime('%Y-%m-%d 00:00:00')
                end_time = yesterday.strftime('%Y-%m-%d 23:59:59')
            if fault_time_type == 'week':
                start_time = (today - timedelta(days=today.weekday())).strftime('%Y-%m-%d 00:00:00')
                end_time = today.strftime('%Y-%m-%d %H:%M:%S')
            if fault_time_type == 'month':
                start_time = (today + timedelta(days=-(today.day - 1))).strftime('%Y-%m-%d 00:00:00')
                end_time = today.strftime('%Y-%m-%d %H:%M:%S')
            if fault_time_type == 'season':
                y = int(today.year)
                m = today.month
                if m in (1, 2, 3):
                    start_time = datetime(y, 1, 1).strftime('%Y-%m-%d 00:00:00')
                    end_time = today.strftime('%Y-%m-%d %H:%M:%S')
                elif m in (4, 5, 6):
                    start_time = datetime(y, 4, 1).strftime('%Y-%m-%d 00:00:00')
                    end_time = today.strftime('%Y-%m-%d %H:%M:%S')
                elif m in (7, 8, 9):
                    start_time = datetime(y, 7, 1).strftime('%Y-%m-%d 00:00:00')
                    end_time = today.strftime('%Y-%m-%d %H:%M:%S')
                else:
                    start_time = datetime(y, 10, 1).strftime('%Y-%m-%d 00:00:00')
                    end_time = today.strftime('%Y-%m-%d %H:%M:%S')
            condition += ' AND Time >= "' + start_time + '" AND Time <= "' + end_time + '"'

        if (dbname is None):
            dbname = dbAccess.getProjMysqldbByName(projectId)
        if dbname != None:
            strSQL = 'SELECT n.ID,n.FaultId,n.Time,n.OrderId,n.Energy,n.Detail,n.Status,n.Project, n.CheckTime, n.Operator, ' \
                     'f.Id, f.ParentId,f.Name,f.Description,f.Points,f.EquipmentId,f.DefaultGrade,f.IsUserDefined,f.UserId,' \
                     'f.UserFaultGrade,f.UserFaultDelay,f.UserModifyTime,f.UserEnable ' \
                     'FROM %s_diagnosis_faults AS f ' \
                     'LEFT JOIN %s_diagnosis_notices AS n ON n.ID=f.noticeId ' \
                     'WHERE f.NoticeId <> 0 %s AND n.`Status` = 1 ORDER BY n.Time desc;' % (dbname, dbname, condition)

    except Exception as e:
        print('getRealTImeFault error:' + e.__str__())
        logging.error('getRealTImeFault error:' + e.__str__())
    return preprocessFaultDataInfo(strSQL, user_level, start_num, end_num)


@app.route('/diagnosis/getZoneFaultCount/<projectId>')
def getZoneFaultCount(projectId):
    rv = []
    try:
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        if (dbname is None):
            dbname = dbAccess.getProjMysqldbByName(projectId)
        if dbname != None:
            strSQL = 'SELECT e.ZoneId, COUNT(*) as Num FROM %s_diagnosis_faults AS f ' \
                     'LEFT JOIN %s_diagnosis_notices AS n ON n.Id = f.NoticeId ' \
                     'LEFT JOIN %s_diagnosis_equipments AS e ON e.Id = f.EquipmentId ' \
                     'WHERE f.NoticeId <> 0 AND n.`Status` = 1 GROUP BY e.ZoneId ORDER BY e.ZoneId '%(dbname,dbname,dbname)
            dbrv = dbAccess._mysqlDBContainer.op_db_query('diagnosis', strSQL)
            rv = [{str(x[0]):x[1]} for x in dbrv]
    except Exception as e:
        print('getZoneFaultCount error:' + e.__str__())
        logging.error('getZoneFaultCount error:' + e.__str__())
    return json.dumps(rv, ensure_ascii=False)

@app.route('/diagnosis/getHistoryFault/<projectId>/<startTime>/<endTime>')
def getHistoryFault(projectId, startTime, endTime):
    try:
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        if (dbname is None):
            dbname = dbAccess.getProjMysqldbByName(projectId)
        if dbname != None:
            strSQL = 'SELECT n.ID,n.FaultId,n.Time,n.OrderId,n.Energy,n.Detail,n.Status,n.Project, n.CheckTime, n.Operator, ' \
                     'f.Id, f.ParentId,f.Name,f.Description,f.Points,f.EquipmentId,f.DefaultGrade,f.IsUserDefined,f.UserId,' \
                     'f.UserFaultGrade,f.UserFaultDelay,f.UserModifyTime,f.UserEnable ' \
                     ' FROM %s_diagnosis_notices'%dbname + ' AS n LEFT JOIN %s_diagnosis_faults'%dbname + ' AS f ON n.FaultId=f.ID ' \
                     ' WHERE Time >= \''+ startTime +'\' and Time <= \''+endTime+'\' ORDER BY Time desc'
    except Exception as e:
        print('getHistoryFault error:' + e.__str__())
        logging.error('getHistoryFault error:' + e.__str__())
    return preprocessFaultData(strSQL)


def preprocessFaultData(strSQL):
    try:
        dbAccess = BEOPDataAccess.getInstance()
        rv = dbAccess._mysqlDBContainer.op_db_query('diagnosis', strSQL)
        dataFaults = []
        for x in rv:
            isUserDefined = x[17]
            if(isUserDefined == 1): grade = x[19]
            else: grade = x[16]
            dataFaults.append({'id': x[0], 'faultId': x[1],
                                'time': x[2].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[2], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                                'orderId': x[3], 'energy': x[4], 'detail': x[5], 'status':x[6], 'project':x[7], 'checkTime':[8], 'operator':x[9],
                                'parentId': x[11], 'name': x[12], 'description': x[13], 'points':x[14], 'equipmentId': x[15],
                                'userEnable':x[22], 'grade': grade })
    except Exception as e:
        print('getNoticesAndFaults error:' + e.__str__())
        logging.error('getNoticesAndFaults error:' + e.__str__())
    return json.dumps(dataFaults, ensure_ascii=False)


def preprocessFaultDataInfo(strSQL, user_level, start_num, end_num):
    try:
        dbAccess = BEOPDataAccess.getInstance()
        rv = dbAccess._mysqlDBContainer.op_db_query('diagnosis', strSQL)
        dataFaults = []
        for x in rv:
            isUserDefined = x[17]
            if (isUserDefined == 1):
                grade = x[19]
            else:
                grade = x[16]
            if user_level == 'all':
                dataFaults.append({'id': x[0], 'faultId': x[1],
                                   'time': x[2].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[2], datetime) else
                                   datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                                   'orderId': x[3], 'energy': x[4], 'detail': x[5], 'status': x[6], 'project': x[7],
                                   'checkTime': [8], 'operator': x[9],
                                   'parentId': x[11], 'name': x[12], 'description': x[13], 'points': x[14],
                                   'equipmentId': x[15],
                                   'userEnable': x[22], 'grade': grade})
            else:
                if grade == int(user_level):
                    dataFaults.append({'id': x[0], 'faultId': x[1],
                                       'time': x[2].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[2], datetime) else
                                       datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                                       'orderId': x[3], 'energy': x[4], 'detail': x[5], 'status': x[6], 'project': x[7],
                                       'checkTime': [8], 'operator': x[9],
                                       'parentId': x[11], 'name': x[12], 'description': x[13], 'points': x[14],
                                       'equipmentId': x[15],
                                       'userEnable': x[22], 'grade': grade})

        fault_info = {
            'dataFaults': dataFaults[start_num:end_num],
            'total': len(dataFaults)
        }
    except Exception as e:
        print('getNoticesAndFaults error:' + e.__str__())
        logging.error('getNoticesAndFaults error:' + e.__str__())
    return json.dumps(fault_info, ensure_ascii=False)


@app.route('/diagnosis/notice/get/<projectId>/<startTime>/<endTime>')
def getDiagnosisNoticeByTimeSpan(projectId, startTime, endTime):
    rt = None
    try:
        headers = {'content-type': 'application/json'}
        rt = requests.get(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/notice/get/' + str(projectId)+ '/' + startTime + '/' + endTime,
                                 headers=headers,timeout = 600)
    except Exception as e:
        print(e)
        logging.error("getDiagnosisNoticeByTimeSpan:%s"%(e.__str__(),))
        logging.exception(e)
    return rt.text



@app.route('/diagnosis/notice/add/<projectId>', methods=['POST'])
def addDiagnosisNotice(projectId):
    rt = None
    try:
        data = request.get_json()
        headers = {'content-type': 'application/json'}
        rt = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/notice/add/' + str(projectId), data=json.dumps(data),
                                  headers=headers,timeout = 600)
    except Exception as e:
        print(e)
        logging.error("addDiagnosisNotice:%s"%(e.__str__(),))
        logging.exception(e)
    return json.dumps(rt, ensure_ascii=False)

@app.route('/diagnosis/notice/addMulti/<projectId>', methods=['POST'])
def addDiagnosisNoticeMulti(projectId):
    rt = None
    try:
        data = request.get_json()
        headers = {'content-type': 'application/json'}
        rt = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/notice/addMulti/' + str(projectId), data=json.dumps(data),
                                  headers=headers,timeout = 600)
    except Exception as e:
        print(e)
        logging.error("addDiagnosisNoticeMulti:%s"%(e.__str__(),))
        logging.exception(e)
    return rt.text

#@app.route('/diagnosis/notice/get/<projectId>')
#@app.route('/diagnosis/notice/get/<projectId>/<time_delta>')
#def getDiagnosisNotices(projectId, time_delta=30):
#    rt = None
#    try:
#        headers = {'content-type': 'application/json'}
#        rt = requests.get(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/notice/get/' + str(projectId), headers=headers,timeout = 600)
#    except Exception as e:
#        print(e)
#        logging.error("getDiagnosisNotices:%s"%(e.__str__(),))
#        logging.exception(e)
#    return rt.text

##Get all notices
#@app.route('/diagnosis/notice/getAll/<projectId>')
#def getDiagnosisAllNotices(projectId):
#    data = []
#    try:
#        dbAccess = BEOPDataAccess.getInstance()
#        dbname = dbAccess.getProjMysqldb(projectId)
#        if (dbname is None):
#            dbname = dbAccess.getProjMysqldbByName(projectId)
#        if dbname != None:
#            strSQL = 'SELECT ID,FaultId,Time,OrderId,Energy,Detail,Status,Project FROM  %s_'%dbname +'diagnosis_notices ORDER BY Time desc'
#            rv = dbAccess._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
#            data = [{ 'id': x[0], 'faultId': x[1], 'time': x[2].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[2], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
#              'orderId': x[3], 'energy':x[4], 'detail':x[5], 'status':x[6], 'project':x[7]} for x in rv]
#    except Exception as e:
#        print(e)
#        logging.error("getDiagnosisAllNotices:%s"%(e.__str__(),))
#        logging.exception(e)
#    return json.dumps(data, ensure_ascii=False)

@app.route('/diagnosis/fault/add/<projectId>', methods=['POST'])
def addFault(projectId):
    rt = None
    try:
        data = request.get_json()
        headers = {'content-type': 'application/json'}
        rt = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/fault/add/' + str(projectId), data=json.dumps(data),
                                  headers=headers,timeout = 600)
    except Exception as e:
        print(e)
        logging.error("addFault:%s"%(e.__str__(),))
        logging.exception(e)
    return rt.text

@app.route('/diagnosis/fault/addMulti/<projectId>', methods=['POST'])
def addFaultMulti(projectId):
    rt = None
    try:
        data = request.get_json()
        headers = {'content-type': 'application/json'}
        rt = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/fault/addMulti/' + str(projectId), data=json.dumps(data),
                                  headers=headers,timeout = 600)
    except Exception as e:
        print(e)
        logging.error("addFaultMulti:%s"%(e.__str__(),))
        logging.exception(e)
    return rt.text

@app.route('/diagnosis/fault/get/<projectId>')
def getFaults(projectId):
    rt = None
    try:
        headers = {'content-type': 'application/json'}
        rt = requests.get(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/fault/get/' + str(projectId), headers=headers,timeout = 600)
    except Exception as e:
        print(e)
        logging.error("getFaults:%s"%(e.__str__(),))
        logging.exception(e)
    return rt.text

#@app.route('/diagnosis/fault/getInNotices/<projectId>')
#def getFaultsInNotices(projectId):
#    data = []
#    try:
#        dbAccess = BEOPDataAccess.getInstance()
#        dbname = dbAccess.getProjMysqldb(projectId)
#        if (dbname is None):
#            dbname = dbAccess.getProjMysqldbByName(projectId)
#        if dbname != None:
#            strSQL = 'SELECT Id,ParentId,`Name`,Description,Points,EquipmentId,DefaultGrade,IsUserDefined,UserId,UserFaultGrade,UserFaultDelay,UserModifyTime,UserEnable,Project\
#                    FROM  %s_'%dbname +'diagnosis_faults WHERE Id IN (SELECT FaultId FROM  %s_'%dbname +'diagnosis_notices)'
#            rv = dbAccess._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
#            data = [{ 'id': x[0], 'parentId': x[1], 'name': x[2], 'description': x[3], 'points':x[4], 'equipmentId': x[5],
#                    'defaultGrade': x[6], 'isUserDefined': x[7], 'userId': x[8], 'userFaultGrade': x[9],
#                    'userFaultDelay':x[10].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[10], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
#                    'userModifyTime': x[11].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[11], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
#                    'userEnable':x[12], 'project':x[13] } for x in rv]
#    except Exception as e:
#        print(e)
#        logging.error("getFaultsInNotices:%s"%(e.__str__(),))
#        logging.exception(e)
#    return json.dumps(data, ensure_ascii=False)

#@app.route('/diagnosis/equipment/get/<projectId>')
#def getEquipments(projectId):
#    rt = None
#    try:
#        headers = {'content-type': 'application/json'}
#        rt = requests.get(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/equipment/get/' + str(projectId), headers=headers,timeout = 600)
#    except Exception as e:
#        print(e)
#        logging.error("getEquipments:%s"%(e.__str__(),))
#        logging.exception(e)
#    return rt.text

#@app.route('/diagnosis/zone/get/<projectId>')
#def getZones(projectId):
#    rt = None
#    try:
#        headers = {'content-type': 'application/json'}
#        rt = requests.get(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/zone/get/' + str(projectId), headers=headers,timeout = 600)
#    except Exception as e:
#        print(e)
#        logging.error("getZones:%s"%(e.__str__(),))
#        logging.exception(e)
#    return rt.text

#@app.route('/diagnosis/getAll/<projectId>')
#@app.route('/diagnosis/getAll/<projectId>/<userId>')
#def getDiagnosisAll(projectId, userId=0):
#    rt = None
#    try:
#        headers = {'content-type': 'application/json'}
#        rt = requests.get(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/getAll/' + str(projectId), headers=headers,timeout = 600)
#    except Exception as e:
#        print(e)
#        logging.error("getDiagnosisAll:%s"%(e.__str__(),))
#        logging.exception(e)
#    return rt.text





@app.route('/diagnosis/fault/customUpdate/<projectId>', methods=['POST'])
def updateCustomOption(projectId):
    bSuccess = False
    try:
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
    except Exception as e:
        print(e)
        logging.error("updateCustomOption:%s"%(e.__str__(),))
        logging.exception(e)
    return json.dumps(bSuccess, ensure_ascii=False)



#@app.route('/diagnosis/notice/getLimit/<projectId>')
#def getDiagnosisNoticesLimit(projectId):
#    data = []
#    try:
#        dbAccess = BEOPDataAccess.getInstance()
#        dbname = dbAccess.getProjMysqldb(projectId)
#        if (dbname is None):
#            dbname = dbAccess.getProjMysqldbByName(projectId)
#        if dbname != None:
#            strSQL = 'SELECT * FROM (SELECT ID,FaultId,Time,OrderId,Energy,Detail,Status,Project FROM  %s_'%dbname +'diagnosis_notices ORDER BY Time desc limit 0,20) as t GROUP BY FaultId ORDER BY Time desc'
#            rv = dbAccess._mysqlDBContainer.op_db_query('diagnosis', strSQL,())

#            data = [{ 'id': x[0], 'faultId': x[1], 'time': x[2].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[2], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
#                      'orderId': x[3], 'energy': x[4], 'detail': x[5], 'status':x[6], 'project':x[7] } for x in rv]
#    except Exception as e:
#        print(e)
#        logging.error("getDiagnosisNoticesLimit:%s"%(e.__str__(),))
#        logging.exception(e)
#    return json.dumps(data, ensure_ascii=False)


#@app.route('/diagnosis/limit/get/<projectId>')
#def getDiagnosisLimit(projectId):
#    rt = None
#    try:
#        headers = {'content-type': 'application/json'}
#        rt = requests.get(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/limit/get/' + str(projectId),
#                                 headers=headers,timeout = 600)
#    except Exception as e:
#        print(e)
#        logging.error("getDiagnosisLimit:%s"%(e.__str__(),))
#        logging.exception(e)
#    return rt.text

#@app.route('/diagnosis/order/get/<projectId>')
#def getDiagnosisOrder(projectId):
#    rt = None
#    try:
#        headers = {'content-type': 'application/json'}
#        rt = requests.get(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/order/get/' + str(projectId),
#                                 headers=headers,timeout = 600)
#    except Exception as e:
#        print(e)
#        logging.error("getDiagnosisOrder:%s"%(e.__str__(),))
#        logging.exception(e)
#    return rt.text

#@app.route('/diagnosis/enable/get/<projectId>')
#def getDiagnosisEnable(projectId):
#    rt = None
#    try:
#        headers = {'content-type': 'application/json'}
#        rt = requests.get(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/enable/get/' + str(projectId),
#                     headers=headers,timeout = 600)
#    except Exception as e:
#        print(e)
#        logging.error("getDiagnosisEnable:%s"%(e.__str__(),))
#        logging.exception(e)
#    return rt.text

@app.route('/diagnosis/config/get/<projectId>')
def getDiagnosisConfig(projectId):
    data = {}
    try:
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
    except Exception as e:
        print(e)
        logging.error("getDiagnosisConfig:%s"%(e.__str__(),))
        logging.exception(e)
    return json.dumps(data, ensure_ascii=False)

@app.route('/diagnosis/limit/add/<projectId>', methods=['POST'])
def addDiagnosisLimit(projectId):
    rt = False
    try:
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
    except Exception as e:
        print(e)
        logging.error("addDiagnosisLimit:%s"%(e.__str__(),))
        logging.exception(e)
    return json.dumps(rt, ensure_ascii=False)

@app.route('/diagnosis/order/add/<projectId>', methods=['POST'])
def addDiagnosisOrder(projectId):
    rt = False
    try:
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
    except Exception as e:
        print(e)
        logging.error("addDiagnosisOrder:%s"%(e.__str__(),))
        logging.exception(e)
    return json.dumps(rt, ensure_ascii=False)

@app.route('/diagnosis/enable/add/<projectId>', methods=['POST'])
def addDiagnosisEanble(projectId):
    rt = False
    try:
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
    except Exception as e:
        print(e)
        logging.error("addDiagnosisEanble:%s"%(e.__str__(),))
        logging.exception(e)
    return json.dumps(rt, ensure_ascii=False)

#@app.route('/diagnosis/fault/get/<projectId>/<startTime>/<endTime>')
#def getFaultsByTimeSpan(projectId,startTime,endTime):
#    rt = None
#    try:
#        headers = {'content-type': 'application/json'}
#        rt = requests.get(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/fault/get/' + str(projectId) + '/' + startTime + '/' + endTime,
#                                 headers=headers,timeout = 600)
#    except Exception as e:
#        print(e)
#        logging.error("getFaultsByTimeSpan:%s"%(e.__str__(),))
#        logging.exception(e)
#    return rt.text

#@app.route('/diagnosis/order/get/<projectId>/<startTime>/<endTime>')
#def getDiagnosisOrderByTimeSpan(projectId,startTime,endTime):
#    rt = None
#    try:
#        headers = {'content-type': 'application/json'}
#        rt = requests.get(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/order/get/' + str(projectId) + '/' + startTime + '/' + endTime,
#                                 headers=headers,timeout = 600)
#    except Exception as e:
#        print(e)
#        logging.error("getDiagnosisOrderByTimeSpan:%s"%(e.__str__(),))
#        logging.exception(e)
#    return rt.text

#@app.route('/diagnosis/limit/get/<projectId>/<startTime>/<endTime>')
#def getDiagnosisLimitByTimeSpan(projectId,startTime,endTime):
#    rt = None
#    try:
#        headers = {'content-type': 'application/json'}
#        rt = requests.get(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/limit/get/' + str(projectId) + '/' + startTime + '/' + endTime,
#                                 headers=headers,timeout = 600)
#    except Exception as e:
#        print(e)
#        logging.error("getDiagnosisLimitByTimeSpan:%s"%(e.__str__(),))
#        logging.exception(e)
#    return rt.text

#@app.route('/diagnosis/enable/get/<projectId>/<startTime>/<endTime>')
#def getDiagnosisEnableByTimeSpan(projectId,startTime,endTime):
#    rt = None
#    try:
#        headers = {'content-type': 'application/json'}
#        rt = requests.get(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/enable/get/' + str(projectId) + '/' + startTime + '/' + endTime,
#                     headers=headers,timeout = 600)
#    except Exception as e:
#        print(e)
#        logging.error("getDiagnosisEnableByTimeSpan:%s"%(e.__str__(),))
#        logging.exception(e)
#    return rt.text

@app.route('/diagnosis/equipment/add/<projectId>', methods=['POST'])
def addDiagnosisEquipment(projectId):
    rt = None
    try:
        data = request.get_json()
        headers = {'content-type': 'application/json'}
        rt = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/equipment/add/' + str(projectId), data=json.dumps(data),
                                  headers=headers,timeout = 600)
    except Exception as e:
        print(e)
        logging.error("addDiagnosisEquipment:%s"%(e.__str__(),))
        logging.exception(e)
    return rt.text

@app.route('/diagnosis/equipment/addMulti/<projectId>', methods=['POST'])
def addDiagnosisEquipmentMulti(projectId):
    rt = None
    try:
        data = request.get_json()
        headers = {'content-type': 'application/json'}
        rt = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/equipment/addMulti/' + str(projectId), data=json.dumps(data),
                                  headers=headers,timeout = 600)
    except Exception as e:
        print(e)
        logging.error("addDiagnosisEquipmentMulti:%s"%(e.__str__(),))
        logging.exception(e)
    return rt.text

@app.route('/diagnosis/zone/add/<projectId>', methods=['POST'])
def addDiagnosisZone(projectId):
    rt = None
    try:
        data = request.get_json()
        headers = {'content-type': 'application/json'}
        rt = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/zone/add/' + str(projectId), data=json.dumps(data),
                                  headers=headers,timeout = 600)
    except Exception as e:
        print(e)
        logging.error("addDiagnosisZone:%s"%(e.__str__(),))
        logging.exception(e)
    return rt.text

@app.route('/diagnosis/zone/addMulti/<projectId>', methods=['POST'])
def addDiagnosisZoneMulti(projectId):
    rt = None
    try:
        data = request.get_json()
        headers = {'content-type': 'application/json'}
        rt = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/zone/addMulti/' + str(projectId), data=json.dumps(data),
                                  headers=headers,timeout = 600)
    except Exception as e:
        print(e)
        logging.error("addDiagnosisZoneMulti:%s"%(e.__str__(),))
        logging.exception(e)
    return rt.text

@app.route('/diagnosis/order/getByEquipId/<projectId>/<EquipId>')
def getDiagnosisOrderByEquipId(projectId, EquipId):
    data = {}
    try:
        projectId = int(projectId)
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
    except Exception as e:
        print(e)
        logging.error("getDiagnosisOrderByEquipId:%s"%(e.__str__(),))
        logging.exception(e)
    return json.dumps(data, ensure_ascii=False)

@app.route('/diagnosis/fault/updpateMulti/<projectId>', methods=['POST'])
def updateDiagnosisFaultMulti(projectId):
    result = True
    try:
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
    except Exception as e:
        print(e)
        logging.error("updateDiagnosisFaultMulti:%s"%(e.__str__(),))
        logging.exception(e)
    return json.dumps(result, ensure_ascii=False)

@app.route('/diagnosis/fault/updpateByRange/<projectId>', methods=['POST'])
def updateDiagnosisByRange(projectId):
    result = True
    try:
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
    except Exception as e:
        print(e)
        logging.error("updateDiagnosisByRange:%s"%(e.__str__(),))
        logging.exception(e)
    return json.dumps(result, ensure_ascii=False)

@app.route('/diagnosis/getGroupsMembers/<userId>', methods=['GET'])
def getGroupsMembers(userId):
    try:
        group_members_list = []
        groups = StaticRelate.get_group_by_user_id(userId, 'groupid', 'name')
        if groups:
            for index in groups:
                group_members = StaticRelate.get_user_in_group(index.get('id'), 'userid', 'userfullname', 'username')
                group_members_list.append(group_members)
            data = {'groups': groups, 'groupMembers': group_members_list}
            return json.dumps(data, ensure_ascii=False)
    except Exception as e:
        print(e)
        logging.error("getGroupsMembers:%s"%(e.__str__(),))
        logging.exception(e)
    return json.dumps({'error': 'user has no group data'},  ensure_ascii=False)

@app.route('/diagnosis/order/enable/<projectId>/<enable>')
def diagnosisOrderEnable(projectId, enable):
    rt = False
    try:
        projectId = int(projectId)
        enable = int(enable)
        dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
        if dbname is None:
            dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
        if dbname != None:
            strSQL = "update %s_"%dbname +"diagnosis_order set Enable=%d where Project='%s'" % (enable, projectId)
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    except Exception as e:
        print(e)
        logging.error("diagnosisOrderEnable:%s"%(e.__str__(),))
        logging.exception(e)
    return json.dumps(rt, ensure_ascii=False)

@app.route('/diagnosis/enable/enable/<projectId>/<enable>')
def diagnosisEnableEnable(projectId, enable):
    rt = False
    try:
        projectId = int(projectId)
        enable = int(enable)
        dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
        if dbname is None:
            dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
        if dbname != None:
            strSQL = "update %s_"%dbname +"diagnosis_enable set Enable=%d where Project='%s'" % (enable, projectId)
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    except Exception as e:
        print(e)
        logging.error("diagnosisEnableEnable:%s"%(e.__str__(),))
        logging.exception(e)
    return json.dumps(rt, ensure_ascii=False)

@app.route('/diagnosis/limit/enable/<projectId>/<enable>')
def diagnosisLimitEnable(projectId, enable):
    rt = False
    try:
        projectId = int(projectId)
        enable = int(enable)
        dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
        if dbname is None:
            dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
        if dbname != None:
            strSQL = "update %s_"%dbname +"diagnosis_limit set 8Enable=%d where Project='%s'" % (enable, projectId)
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    except Exception as e:
        print(e)
        logging.error("diagnosisLimitEnable:%s"%(e.__str__(),))
        logging.exception(e)
    return json.dumps(rt, ensure_ascii=False)

@app.route('/diagnosis/order/delete/<projectId>/<Id>')
def diagnosisOrderDelete(projectId, Id):
    rt = False
    try:
        projectId = int(projectId)
        Id = int(Id)
        dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
        if dbname is None:
            dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
        if dbname != None:
            strSQL = "delete from %s_"%dbname +"diagnosis_order where ID=%d" % (Id,)
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    except Exception as e:
        print(e)
        logging.error("diagnosisOrderDelete:%s"%(e.__str__(),))
        logging.exception(e)
    return json.dumps(rt, ensure_ascii=False)

@app.route('/diagnosis/enable/delete/<projectId>/<Id>')
def diagnosisEnableDelete(projectId, Id):
    rt = False
    try:
        projectId = int(projectId)
        Id = int(Id)
        dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
        if dbname is None:
            dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
        if dbname != None:
            strSQL = "delete from %s_"%dbname +"diagnosis_enable where ID=%d" % (Id,)
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    except Exception as e:
        print(e)
        logging.error("diagnosisEnableDelete:%s"%(e.__str__(),))
        logging.exception(e)
    return json.dumps(rt, ensure_ascii=False)

@app.route('/diagnosis/limit/delete/<projectId>/<Id>')
def diagnosisLimitDelete(projectId, Id):
    rt = False
    try:
        projectId = int(projectId)
        Id = int(Id)
        dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
        if dbname is None:
            dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
        if dbname != None:
            strSQL = "delete from %s_"%dbname +"diagnosis_limit where ID=%d" % (Id,)
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    except Exception as e:
        print(e)
        logging.error("diagnosisLimitDelete:%s"%(e.__str__(),))
        logging.exception(e)
    return json.dumps(rt, ensure_ascii=False)

@app.route('/diagnosis/order/update/<projectId>/<Id>', methods=['POST'])
def diagnosisOrderUpdate(projectId, Id):
    rt = False
    try:
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
    except Exception as e:
        print(e)
        logging.error("diagnosisOrderUpdate:%s"%(e.__str__(),))
        logging.exception(e)
    return json.dumps(rt, ensure_ascii=False)

@app.route('/diagnosis/enable/update/<projectId>/<Id>', methods=['POST'])
def diagnosisEnableUpdate(projectId, Id):
    rt = False
    try:
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
    except Exception as e:
        print(e)
        logging.error("diagnosisEnableUpdate:%s"%(e.__str__(),))
        logging.exception(e)
    return json.dumps(rt, ensure_ascii=False)

@app.route('/diagnosis/limit/update/<projectId>/<Id>', methods=['POST'])
def diagnosisLimitUpdate(projectId, Id):
    rt = False
    try:
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
    except Exception as e:
        print(e)
        logging.error("diagnosisLimitUpdate:%s"%(e.__str__(),))
        logging.exception(e)
    return json.dumps(rt, ensure_ascii=False)
