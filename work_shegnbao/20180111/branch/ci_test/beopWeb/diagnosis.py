"""
Routes and views for the flask application.
"""

import logging
import os
import time
from datetime import datetime, timedelta

import requests
from bson import ObjectId
from flask import json, jsonify, make_response, request, send_file

from beopWeb import app
from beopWeb.BEOPDataAccess import BEOPDataAccess
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_common.DateUtils import DateUtils
from beopWeb.models import ExcelFile
from beopWeb.observer import startWorkspaceDataGenHistogram_fuc


@app.route('/diagnosis/notice/makesure/<projectId>/<noticeId>/<userId>')
def setNoticeToSure(projectId, noticeId, userId):
    rt = False
    try:
        projectId = int(projectId)
        noticeId = int(noticeId)
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        if dbname is not None:
            strSQL = 'update ' + dbname + '_diagnosis_faults set NoticeId=NULL where NoticeId=%s;'
            rt = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL, (noticeId))
            strSQL = 'update  ' + dbname + '_diagnosis_notices set status=%s, Operator=%s, CheckTime=NOW() where Id=%s;'
            rt = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL, (0, userId, noticeId))
    except Exception as e:
        print('setNoticeToSure error:' + e.__str__())
        logging.error(e.__str__())
    return json.dumps(rt, ensure_ascii=False)


@app.route('/diagnosis/getStruct/<projectId>')
def GetEquipmentsAndZones(projectId):
    rt = None
    try:
        headers = {'content-type': 'application/json'}
        rt = requests.get(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/getAll/EquipmentsAndZones/' + str(projectId),
                          headers=headers, timeout=600)
    except Exception as e:
        print('GetEquipmentsAndZones error:' + e.__str__())
        logging.error(e.__str__())
    return rt.text


@app.route('/diagnosis/getEquipments/<projectId>')
def GetEquipments(projectId):
    rt = None
    try:
        projectId = int(projectId)
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        if dbname is not None:
            strSQL = 'SELECT * ' \
                     'FROM %s_diagnosis_equipments ' \
                     'WHERE Project=%d ' \
                     'ORDER BY Id' % (dbname, projectId)
        rt = dbAccess._mysqlDBContainer.op_db_query('diagnosis', strSQL)
    except Exception as e:
        print('GetEquipments error:' + e.__str__())
        logging.exception(e)
    return preprocessEquipmentsData(rt)


def preprocessEquipmentsData(rt):
    try:
        dataEquipments = []
        for x in rt:
            dataEquipments.append({'id': x[0], 'name': x[1],
                                   'pageId': x[2], 'zoneId': x[3],
                                   'systemId': x[4], 'subSystemId': x[5],
                                   'systemName': x[6], 'subSystemName': x[7],
                                   'project': x[8], 'modalTextId': x[9]})
    except Exception as e:
        print('preprocessEquipmentsData error:' + e.__str__())
        logging.error('preprocessEquipmentsData error:' + e.__str__())
    return json.dumps(dataEquipments)


@app.route('/diagnosis/setModalTextId/<projectId>', methods=['POST'])
def setModalTextId(projectId):
    rt = None
    try:
        projectId = int(projectId)
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        data = request.get_json()
        arrStr = ','.join(str(i) for i in data.get('equipmentsIds'))
        if dbname is not None:
            strSQL = 'UPDATE %s_diagnosis_equipments ' \
                     'SET ModalTextId=%d ' \
                     'WHERE Id in %s'\
                     % (dbname, int(data.get('textId')), arrStr)
        rt = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL)
    except Exception as e:
        print('setModalTextId error:' + e.__str__())
        logging.exception(e)
    return rt


@app.route('/diagnosis/updateZoneFaultCount/<projectId>', methods=['POST'])
def updateZoneFaultCount(projectId):
    rt = None
    try:
        # data = request.get_json()
        # headers = {'content-type': 'application/json'}
        # rt = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/updateZoneFaultCount/' + str(projectId),
        #                    headers=headers, data=json.dumps(data), timeout=600)
        pass
    except Exception as e:
        print('updateZoneFaultCount error:' + e.__str__())
        logging.error('updateZoneFaultCount error:' + e.__str__())
    return rt


@app.route('/diagnosis/getRealtimeFault/<int:projectId>')
@app.route('/diagnosis/getRealtimeFault/<int:projectId>/<zoneId>')
def getRealTImeFault(projectId, zoneId=None):
    try:
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        time_zone = dbAccess.get_project_time_zone_by_id(projectId)
        if dbname:
            if time_zone:
                tNow = DateUtils.get_projLocal_date(time_zone)
            else:
                tNow = datetime.now()
            tStart = tNow - timedelta(minutes=60 * 12)  # only get the notiice of  recent 12 hours
            if zoneId is not None:
                strSQL = 'SELECT n.Id, n.FaultId, n.Time, n.OrderId, n.Energy, n.Detail, n.`Status`, n.Project, n.CheckTime, ' \
                         'n.Operator, f.Id, f.ParentId, f.`Name`, f.Description, f.Points, f.EquipmentId, f.DefaultGrade,'\
                         'f.IsUserDefined, ' \
                         'f.UserId, f.UserFaultGrade, f.UserFaultDelay, f.UserModifyTime, f.UserEnable, n.EndTime, n.FeedBack, '\
                         'n.FeedBackId ' \
                         'FROM %s_diagnosis_faults AS f ' \
                         'LEFT JOIN %s_diagnosis_notices AS n ON n.Id = f.NoticeId ' \
                         'LEFT JOIN %s_diagnosis_equipments AS e ON e.Id = f.EquipmentId ' \
                         'WHERE f.NoticeId <> 0 AND n.`Status` = 1 AND e.ZoneId = %d and n.Time>"%s"' \
                         'ORDER BY n.Time DESC' % (dbname, dbname, dbname, int(zoneId), tStart.strftime('%Y-%m-%d %H:%M:%S'))
            else:
                strSQL = 'SELECT n.ID,n.FaultId,n.Time,n.OrderId,n.Energy,n.Detail,n.Status,n.Project, n.CheckTime, n.Operator, ' \
                         'f.Id, f.ParentId,f.Name,f.Description,f.Points,f.EquipmentId,f.DefaultGrade,f.IsUserDefined,f.UserId,' \
                         'f.UserFaultGrade,f.UserFaultDelay,f.UserModifyTime,f.UserEnable, n.EndTime, n.FeedBack, n.FeedBackId ' \
                         'FROM %s_diagnosis_faults AS f ' \
                         'LEFT JOIN %s_diagnosis_notices AS n ON n.ID=f.noticeId ' \
                         'WHERE f.NoticeId <> 0 AND n.`Status` = 1 AND n.Time>"%s" '\
                         'ORDER BY n.Time desc;' % (dbname, dbname, tStart.strftime('%Y-%m-%d %H:%M:%S'))
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

        if dbname is None:
            dbname = dbAccess.getProjMysqldbByName(projectId)
        if dbname is not None:
            strSQL = 'SELECT n.ID,n.FaultId,n.Time,n.OrderId,n.Energy,n.Detail,n.Status,n.Project, n.CheckTime, n.Operator, ' \
                     'f.Id, f.ParentId,f.Name,f.Description,f.Points,f.EquipmentId,f.DefaultGrade,f.IsUserDefined,f.UserId,' \
                     'f.UserFaultGrade,f.UserFaultDelay,f.UserModifyTime,f.UserEnable, n.EndTime, n.FeedBack, n.FeedBackId ' \
                     'FROM %s_diagnosis_faults AS f ' \
                     'LEFT JOIN %s_diagnosis_notices AS n ON n.ID=f.noticeId ' \
                     'WHERE f.NoticeId <> 0 %s AND n.`Status` = 1 ORDER BY n.Time desc;' % (dbname, dbname, condition)

    except Exception as e:
        print('getRealTImeFault error:' + e.__str__())
        logging.error('getRealTImeFault error:' + e.__str__())
    return preprocessFaultDataInfo(strSQL, user_level, start_num, end_num)


@app.route('/diagnosis/getZoneFaultCount/<int:projectId>')
def getZoneFaultCount(projectId):
    rv = []
    try:
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        time_zone = dbAccess.get_project_time_zone_by_id(projectId)
        if dbname:
            if time_zone:
                tNow = DateUtils.get_projLocal_date(time_zone)
            else:
                tNow = datetime.now()
            tStart = tNow - timedelta(minutes=60 * 12)  # only get the notiice of  recent 12 hours
            strSQL = 'SELECT e.ZoneId, COUNT(*) as Num, ' \
                     'COUNT(IF(f.DefaultGrade=1, TRUE, NULL)) as Num1, ' \
                     'COUNT(IF(f.DefaultGrade=2, TRUE, NULL)) as Num2 FROM %s_diagnosis_faults AS f ' \
                     'LEFT JOIN %s_diagnosis_notices AS n ON n.Id = f.NoticeId ' \
                     'LEFT JOIN %s_diagnosis_equipments AS e ON e.Id = f.EquipmentId ' \
                     'WHERE f.NoticeId <> 0 AND n.`Status` = 1 and n.Time>"%s" '\
                     'GROUP BY e.ZoneId ORDER BY e.ZoneId ' % (dbname, dbname, dbname, tStart.strftime('%Y-%m-%d %H:%M:%S'))
            dbrv = dbAccess._mysqlDBContainer.op_db_query('diagnosis', strSQL)
            rv = [{str(x[0]):{'warning': x[2], 'alert': x[3]}} for x in dbrv]
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
        if dbname is not None:
            strSQL = 'SELECT n.ID,n.FaultId,n.Time,n.OrderId,n.Energy,n.Detail,n.Status,n.Project, n.CheckTime, n.Operator, ' \
                     'f.Id, f.ParentId,f.Name,f.Description,f.Points,f.EquipmentId,f.DefaultGrade,f.IsUserDefined,f.UserId,' \
                     'f.UserFaultGrade,f.UserFaultDelay,f.UserModifyTime,f.UserEnable, n.EndTime, n.FeedBack, FeedBackId, f.Consequence ' \
                     ' FROM %s_diagnosis_notices' % dbname + ' AS n LEFT JOIN %s_diagnosis_faults' % dbname + ' AS f ON n.FaultId=f.ID ' \
                     ' WHERE Time >= \'' + startTime + '\' and Time <= \''+endTime+'\' ORDER BY Time desc'
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
            if(isUserDefined == 1):
                grade = x[19]
            else:
                grade = x[16]
            try:
                consequence = x[26]
            except Exception as e:
                consequence = None
            dataFaults.append({'id': x[0], 'faultId': x[1],
                               'time': x[2].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[2], datetime) \
                               else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                               'orderId': x[3], 'energy': x[4], 'detail': x[5], 'Consequence': consequence, 'status': x[6],
                               'project': x[7], 'checkTime': x[8], 'operator': x[9],
                               'parentId': x[11], 'name': x[12], 'description': x[13], 'points': x[14], 'equipmentId': x[15],
                               'userEnable': x[22], 'grade': grade,
                               'EndTime': x[23].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[23], datetime) \
                               else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                               'FeedBack': x[24], 'FeedBackId': x[25]})
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
                                   'time': x[2].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[2], datetime) \
                                   else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                                   'orderId': x[3], 'energy': x[4], 'detail': x[5], 'status': x[6], 'project': x[7],
                                   'checkTime': [8], 'operator': x[9],
                                   'parentId': x[11], 'name': x[12], 'description': x[13], 'points': x[14],
                                   'equipmentId': x[15],
                                   'userEnable': x[22], 'grade': grade,
                                   'EndTime': x[23].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[23], datetime) \
                                   else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                                   'FeedBack': x[24], 'FeedBackId': x[25]})
            else:
                if grade == int(user_level):
                    dataFaults.append({'id': x[0], 'faultId': x[1],
                                       'time': x[2].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[2], datetime) \
                                       else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                                       'orderId': x[3], 'energy': x[4], 'detail': x[5], 'status': x[6], 'project': x[7],
                                       'checkTime': [8], 'operator': x[9],
                                       'parentId': x[11], 'name': x[12], 'description': x[13], 'points': x[14],
                                       'equipmentId': x[15],
                                       'userEnable': x[22], 'grade': grade,
                                       'EndTime': x[23].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[23], datetime) \
                                       else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                                       'FeedBack': x[24], 'FeedBackId': x[25]})

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
        rt = requests.get(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/notice/get/' + str(projectId) + '/' + startTime + '/' + endTime,
                          headers=headers, timeout=600)
    except Exception as e:
        print('getDiagnosisNoticeByTimeSpan error:' + e.__str__())
        logging.error(e.__str__())
    return rt.text


@app.route('/diagnosis/notice/add/<projectId>', methods=['POST'])
def addDiagnosisNotice(projectId):
    rt = None
    try:
        data = request.get_json()
        headers = {'content-type': 'application/json'}
        rt = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/notice/add/' + str(projectId), data=json.dumps(data),
                           headers=headers, timeout=600)
    except Exception as e:
        print('addDiagnosisNotice error:' + e.__str__())
        logging.error(e.__str__())
    return json.dumps(rt, ensure_ascii=False)


@app.route('/diagnosis/notice/addMulti/<projectId>', methods=['POST'])
def addDiagnosisNoticeMulti(projectId):
    rt = None
    try:
        data = request.get_json()
        headers = {'content-type': 'application/json'}
        rt = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/notice/addMulti/' + str(projectId), data=json.dumps(data),
                           headers=headers, timeout=600)
    except Exception as e:
        print('addDiagnosisNoticeMulti error:' + e.__str__())
        logging.error(e.__str__())
    return rt.text


@app.route('/diagnosis/fault/add/<projectId>', methods=['POST'])
def addFault(projectId):
    rt = None
    try:
        data = request.get_json()
        headers = {'content-type': 'application/json'}
        rt = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/fault/add/' + str(projectId), data=json.dumps(data),
                           headers=headers, timeout=600)
    except Exception as e:
        print('addFault error:' + e.__str__())
        logging.error(e.__str__())
    return rt.text


@app.route('/diagnosis/fault/addMulti/<projectId>', methods=['POST'])
def addFaultMulti(projectId):
    rt = None
    try:
        data = request.get_json()
        headers = {'content-type': 'application/json'}
        rt = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/fault/addMulti/' + str(projectId), data=json.dumps(data),
                           headers=headers, timeout=600)
    except Exception as e:
        print('addFaultMulti error:' + e.__str__())
        logging.error(e.__str__())
    return rt.text


@app.route('/diagnosis/fault/get/<projectId>')
@app.route('/diagnosis/fault/get/<projectId>/<limit>')
@app.route('/diagnosis/fault/get/<projectId>/<limit>/<num>')
def getFaults(projectId, limit=0, num=0):
    rt = None
    try:
        headers = {'content-type': 'application/json'}
        rt = requests.get(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/fault/get/' + str(projectId) + '/' + str(limit) + '/' + str(num),
                          headers=headers, timeout=600)
    except Exception as e:
        print('getFaults error:' + e.__str__())
        logging.error(e.__str__())
    return rt.text


@app.route('/diagnosis/fault/customUpdate/<projectId>', methods=['POST'])
def updateCustomOption(projectId):
    bSuccess = False
    try:
        projectId = int(projectId)
        data = request.get_json()
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        if dbname != None:
            strSQL = 'UPDATE  %s_' % dbname + 'diagnosis_faults SET IsUserDefined = %d, UserId = %d, UserFaultGrade = %d, '\
                     'UserFaultDelay = \"%s\", UserModifyTime = NOW() WHERE Id = %d' % \
                     (int(data.get('isUserDefined')) if data.get('isUserDefined') is not None else 0,
                      int(data.get('userId')) if data.get('userId') != None else 0,
                      int(data.get('userFaultGrade')) if data.get('userFaultGrade') != None else 0,
                      data.get('userFaultDelay') if data.get('userFaultDelay') != None else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                      int(data.get('id')) if data.get('id') != None else 0)
            bSuccess = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL, ())
            if data.get('status') == 0:
                strSQL = 'UPDATE  %s_' % dbname + 'diagnosis_notices SET Status = 0 '\
                         'WHERE FaultId = %d' % (int(data.get('id')) if data.get('id') != None else 0)
                bSuccess = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL, ())
    except Exception as e:
        print('updateCustomOption error:' + e.__str__())
        logging.error(e.__str__())
    return json.dumps(bSuccess, ensure_ascii=False)


@app.route('/diagnosis/config/get/<projectId>')
def getDiagnosisConfig(projectId):
    data = {}
    try:
        projectId = int(projectId)
        dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
        if (dbname is None):
            dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
        if dbname != None:
            strSQL = 'SELECT ID,`Name`, EquipList, Fault, Alert, Notice, ModifyTime, Project, Enable '\
                     'FROM  %s_' % dbname + 'diagnosis_limit ORDER BY ID'
            rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query('diagnosis', strSQL, ())
            limit = [{'id': x[0], 'name': x[1], 'equipList':x[2], 'fault': x[3], 'alert': x[4], 'notice': x[5],
                      'modifyTime': x[6].strftime('%Y-%m-%d %H:%M:%S') \
                      if isinstance(x[6], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                      'project':x[7], 'enable':x[8]} for x in rv]

            strSQL = 'select ID,`Name`, OperatorID, GroupID, FaultGrade, EquipList, ModifyTime, Project, Enable '\
                     'from %s_' % dbname + 'diagnosis_order order by Project'
            rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query('diagnosis', strSQL, ())
            order = [{'id': x[0], 'name': x[1], 'operatorId': x[2], 'groupId': x[3], 'faultGrade': x[4], 'equipList': x[5],
                      'modifyTime': x[6].strftime('%Y-%m-%d %H:%M:%S') \
                      if isinstance(x[6], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                      'project': x[7], 'enable': x[8]} for x in rv]

            strSQL = 'select ID,`Name`, StartTime, EndTime, EquipList, ModifyTime, Project, '\
                     'Enable from %s_' % dbname + 'diagnosis_enable order by ID'
            rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query('diagnosis', strSQL, ())
            enable = [{'id': x[0], 'name': x[1],
                       'startTime': x[2].strftime('%Y-%m-%d %H:%M:%S') \
                       if isinstance(x[2], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                       'endTime': x[3].strftime('%Y-%m-%d %H:%M:%S') \
                       if isinstance(x[3], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                       'equipList': x[4],
                       'modifyTime': x[5].strftime('%Y-%m-%d %H:%M:%S') \
                       if isinstance(x[5], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                       'project':x[6], 'enable':x[7]} for x in rv]
            data = {'limit': limit, 'order': order, 'enable': enable}
    except Exception as e:
        print('getDiagnosisConfig error:' + e.__str__())
        logging.error(e.__str__())
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
            strSQL = "insert into   %s_" % dbname + "diagnosis_limit(`Name`, EquipList, Fault, Alert, Notice, ModifyTime, Project, Enable) "\
                     "values(\'%s\', \'%s\', %d, %d, %d, now(), \'%s\', %d)" % \
                     (name, equipList, fault, alert, notice, project, enable)
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update_with_id('diagnosis', strSQL, ())
    except Exception as e:
        print('addDiagnosisLimit error:' + e.__str__())
        logging.error(e.__str__())
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
            strSQL = "insert into   %s_" % dbname + "diagnosis_order(`Name`, OperatorID, GroupID, FaultGrade, EquipList, ModifyTime, "\
                     "Project, Enable) values(\'%s\', %d, %d, %d, \'%s\', now(), \'%s\', %d)" % \
                     (name, operatorId, group, faultGrade, equipList, project, enable)
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update_with_id('diagnosis', strSQL, ())
    except Exception as e:
        print('addDiagnosisOrder error:' + e.__str__())
        logging.error(e.__str__())
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
            # startTime = post.get('startTime')
            endTime = post.get('endTime') if post.get('endTime')!=None else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            equipList = post.get('equipList') if post.get('equipList')!=None else ''
            project = post.get('project') if post.get('project')!=None else ''
            enable = int(post.get('enable')) if post.get('enable')!=None else 0
            strSQL = "insert into   %s_" % dbname + "diagnosis_enable(`Name`, StartTime, EndTime, EquipList, ModifyTime, "\
                     "Project, Enable) values(\'%s\', now(), \'%s\', \'%s\', now(), \'%s\', %d)" \
                     % (name, endTime, equipList, project, enable)
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update_with_id('diagnosis', strSQL, ())
    except Exception as e:
        print('addDiagnosisEanble error:' + e.__str__())
        logging.error(e.__str__())
    return json.dumps(rt, ensure_ascii=False)


@app.route('/diagnosis/equipment/add/<projectId>', methods=['POST'])
def addDiagnosisEquipment(projectId):
    rt = None
    try:
        data = request.get_json()
        headers = {'content-type': 'application/json'}
        rt = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/equipment/add/' + str(projectId), data=json.dumps(data),
                           headers=headers, timeout=600)
    except Exception as e:
        print('addDiagnosisEquipment' + e.__str__())
        logging.error(e.__str__())
    return rt.text


@app.route('/diagnosis/equipment/addMulti/<projectId>', methods=['POST'])
def addDiagnosisEquipmentMulti(projectId):
    rt = None
    try:
        data = request.get_json()
        headers = {'content-type': 'application/json'}
        rt = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/equipment/addMulti/' + str(projectId), data=json.dumps(data),
                           headers=headers, timeout=600)
    except Exception as e:
        print('addDiagnosisEquipmentMulti error:' + e.__str__())
        logging.error(e.__str__())
    return rt.text


@app.route('/diagnosis/zone/add/<projectId>', methods=['POST'])
def addDiagnosisZone(projectId):
    rt = None
    try:
        data = request.get_json()
        headers = {'content-type': 'application/json'}
        rt = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/zone/add/' + str(projectId), data=json.dumps(data),
                           headers=headers, timeout=600)
    except Exception as e:
        print('addDiagnosisZone error:' + e.__str__())
        logging.error(e.__str__())
    return rt.text


@app.route('/diagnosis/zone/addMulti/<projectId>', methods=['POST'])
def addDiagnosisZoneMulti(projectId):
    rt = None
    try:
        data = request.get_json()
        headers = {'content-type': 'application/json'}
        rt = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/zone/addMulti/' + str(projectId), data=json.dumps(data),
                           headers=headers, timeout=600)
    except Exception as e:
        print('addDiagnosisZoneMulti error:' + e.__str__())
        logging.error(e.__str__())
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
            strSQL = 'SELECT * FROM   %s_' % dbname +'diagnosis_order where EquipList like \"%%%s%%\" '\
                     'order by ModifyTime desc' % (str(EquipId))
            rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query('diagnosis', strSQL, ())
            if rv != None:
                if rv:
                    data = {'id': rv[0][0], 'name': rv[0][1], 'operatorId': rv[0][2], 'groupId': rv[0][3], 'faultGrade': rv[0][4],
                            'equipList': rv[0][5],
                            'modifyTime': rv[0][6].strftime('%Y-%m-%d %H:%M:%S') if isinstance(rv[0][6], datetime) \
                            else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                            'project': rv[0][7], 'enable': rv[0][8]}
    except Exception as e:
        print('getDiagnosisOrderByEquipId error:' + e.__str__())
        logging.error(e.__str__())
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
                idList = postData.get('Ids') if postData.get('Ids') != None else []
                if idList:
                    grade = int(postData.get('Grade')) if postData.get('Grade')!=None else 0
                    delay = postData.get('Delay') if postData.get('Delay')!=None else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    modifyTime = postData.get('ModifyTime') if postData.get('ModifyTime')!=None else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    faults = json.loads(getFaults(projectId))
                    strDelete = "delete from   %s_" % dbname +"diagnosis_faults where Id IN({0})".format(str(idList))
                    strDelete = strDelete.replace('[', '')
                    strDelete = strDelete.replace(']', '')
                    rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strDelete, ())
                    if rv:
                        strInsert = "insert into   %s_" % dbname +"diagnosis_faults(Id,ParentId,`Name`,Description,Points,EquipmentId,"\
                                    "DefaultGrade,IsUserDefined,UserId,UserFaultGrade,UserFaultDelay,UserModifyTime,UserEnable,Project) "\
                                    "values"
                        for id in idList:
                            for item in faults:
                                if item.get('id') == int(id):
                                    strValues = "("
                                    strValues += "%d,%d,\'%s\',\'%s\',\'%s\',%d,%d,%d,%d,%d,\'%s\',\'%s\',%d,\'%s\'" % \
                                                 (int(item.get('id')) if item.get('id') != None else 0,
                                                  int(item.get('parentId')) if item.get('parentId') != None else 0,
                                                  item.get('name') if item.get('name') != None else '',
                                                  item.get('description') if item.get('description') != None else '',
                                                  item.get('points') if item.get('points') != None else '',
                                                  int(item.get('equipmentId')) if item.get('equipmentId') != None else 0,
                                                  int(item.get('defaultGrade')) if item.get('defaultGrade') != None else 0,
                                                  int(item.get('isUserDefined')) if item.get('isUserDefined') != None else 0,
                                                  int(item.get('userId')) if item.get('userId') != None else 0, grade, delay,
                                                  modifyTime, int(item.get('userEnable')) if item.get('userEnable') != None else 0,
                                                  item.get('project') if item.get('project') != None else '')
                                    strValues += ")"
                                    strInsert += strValues
                                    strInsert += ","
                        if strInsert[-1] == ",":
                            strInsert = strInsert[0:len(strInsert)-1]
                        result = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strInsert, ())
                    else:
                        result = False
                else:
                    result = False
            else:
                result = False
    except Exception as e:
        print('updateDiagnosisFaultMulti error:' + e.__str__())
        logging.error(e.__str__())
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
                faultId = int(postData.get('id')) if postData.get('id') != None else 0
                range = postData.get('range') if postData.get('range') != None else 'fault'
                grade = int(postData.get('grade')) if postData.get('grade') != None else 0
                delay = postData.get('delay') if postData.get('delay') != None else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                modifyTime = postData.get('modifyTime') if postData.get('modifyTime') != None else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                if range == 'fault':
                    strSQL = "update   %s_" % dbname + "diagnosis_faults set UserFaultGrade=%d,UserFaultDelay=\'%s\',"\
                             "UserModifyTime=\'%s\'"  % (grade, delay, modifyTime)
                    result = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL, ())
                elif range == 'equipment':
                    faults = json.loads(getFaults(projectId))
                    strSQL = "select EquipmentId from   %s_"%dbname +"diagnosis_faults where Id = %d" % (faultId,)
                    rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query('diagnosis', strSQL, ())
                    if rv:
                        strDelete = "delete from   %s_"%dbname +"diagnosis_faults where EquipmentId=" % (rv[0][0])
                        if BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query('diagnosis', strDelete, ()):
                            strInsert = "insert into diagnosis_faults(Id,ParentId,`Name`,Description,Points,EquipmentId,"\
                                        "DefaultGrade,IsUserDefined,UserId,UserFaultGrade,UserFaultDelay,UserModifyTime,"\
                                        "UserEnable,Project) values"
                            for item in faults:
                                if item.get('equipmentId') == int(rv[0][0]):
                                    strValues = "("
                                    strValues += "%d,%d,\'%s\',\'%s\',\'%s\',%d,%d,%d,%d,%d,\'%s\',\'%s\',%d,\'%s\'" % \
                                                 (int(item.get('id')) if item.get('id')!=None else 0,
                                                  int(item.get('parentId')) if item.get('parentId')!=None else 0,
                                                  item.get('name') if item.get('name')!=None else '',
                                                  item.get('description') if item.get('description')!=None else '',
                                                  item.get('points') if item.get('points')!=None else '',
                                                  int(item.get('equipmentId')) if item.get('equipmentId')!=None else 0,
                                                  int(item.get('defaultGrade')) if item.get('defaultGrade')!=None else 0,
                                                  int(item.get('isUserDefined')) if item.get('isUserDefined')!=None else 0,
                                                  int(item.get('userId')) if item.get('userId')!=None else 0, grade, delay,
                                                  modifyTime, int(item.get('userEnable')) if item.get('userEnable')!=None else 0,
                                                  item.get('project') if item.get('project')!=None else '')
                                    strValues += ")"
                                    strInsert += strValues
                                    strInsert += ","
                            if strInsert[-1] == ",":
                                strInsert = strInsert[0:len(strInsert)-1]
                            result = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strInsert, ())
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
                    if rv:
                        faultIdList = []
                        for i in rv:
                            faultIdList.append(i[0])
                        if faultIdList:
                            strDelete = "delete from %s_"%dbname +"diagnosis_faults where Id IN({0})".format(str(faultIdList))
                            strDelete = strDelete.replace('[','')
                            strDelete = strDelete.replace(']','')
                            rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strDelete,())
                            if rv:
                                strInsert = "insert into %s_"%dbname +"diagnosis_faults(Id,ParentId,`Name`,Description,"\
                                            "Points,EquipmentId,DefaultGrade,IsUserDefined,UserId,UserFaultGrade,"\
                                            "UserFaultDelay,UserModifyTime,UserEnable,Project) values"
                                for id in faultIdList:
                                    for item in faults:
                                        if item.get('id') == int(id):
                                            strValues = "("
                                            strValues += "%d,%d,\'%s\',\'%s\',\'%s\',%d,%d,%d,%d,%d,\'%s\',\'%s\',%d,\'%s\'" % \
                                                         (int(item.get('id')) if item.get('id')!=None else 0,
                                                          int(item.get('parentId')) if item.get('parentId')!=None else 0,
                                                          item.get('name') if item.get('name')!=None else '',
                                                          item.get('description') if item.get('description')!=None else '',
                                                          item.get('points') if item.get('points')!=None else '',
                                                          int(item.get('equipmentId')) if item.get('equipmentId')!=None else 0,
                                                          int(item.get('defaultGrade')) if item.get('defaultGrade')!=None else 0,
                                                          int(item.get('isUserDefined')) if item.get('isUserDefined')!=None else 0,
                                                          int(item.get('userId')) if item.get('userId')!=None else 0, grade, delay,
                                                          modifyTime, int(item.get('userEnable')) if item.get('userEnable')!=None else 0,
                                                          item.get('project') if item.get('project')!=None else '')
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
        print('updateDiagnosisByRange error:' + e.__str__())
        logging.error(e.__str__())
    return json.dumps(result, ensure_ascii=False)

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
        print('diagnosisOrderEnable error:' + e.__str__())
        logging.error(e.__str__())
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
        print('diagnosisEnableEnable error:' + e.__str__())
        logging.error(e.__str__())
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
        print('diagnosisEnableEnable error:' + e.__str__())
        logging.error(e.__str__())
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
        print('diagnosisOrderDelete error:' + e.__str__())
        logging.error(e.__str__())
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
        print('diagnosisEnableDelete error:' + e.__str__())
        logging.error(e.__str__())
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
        print('diagnosisLimitDelete error:' + e.__str__())
        logging.error(e.__str__())
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
            strSQL = "update %s_"%dbname +"diagnosis_order set `Name`=\'%s\', OperatorID=%d, GroupID=%d, "\
                     "FaultGrade=%d, EquipList=\'%s\', ModifyTime=now(), Project=\'%s\', Enable=%d where ID=%d" % \
                     (name, operatorId, group, faultGrade, equipList, project, enable, Id)
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL, ())
    except Exception as e:
        print('diagnosisOrderUpdate error:' + e.__str__())
        logging.error(e.__str__())
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
            strSQL = "update %s_"%dbname +"diagnosis_enable set `Name`=\'%s\', StartTime=now(), EndTime=\'%s\', "\
                     "EquipList=\'%s\', ModifyTime=now(), Project=\'%s\', Enable=%d where ID=%d" \
                     % (name, endTime, equipList, project, enable, Id)
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    except Exception as e:
        print('diagnosisEnableUpdate error:' + e.__str__())
        logging.error(e.__str__())
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
            strSQL = "update %s_"%dbname +"diagnosis_limit set `Name`=\'%s\', EquipList=\'%s\', Fault=%d, "\
                     "Alert=%d, Notice=%d, ModifyTime=now(), Project=\'%s\', Enable=%d where ID=%d" \
                     % (name, equipList, fault, alert, notice, project, enable, Id)
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    except Exception as e:
        print('diagnosisLimitUpdate error:' + e.__str__())
        logging.error(e.__str__())
    return json.dumps(rt, ensure_ascii=False)


@app.route('/diagnosis/kpi/addkpi', methods=['POST'])
def add_kpi_by_projId():
    rt = None
    try:
        data = request.get_json()
        headers = {'content-type': 'application/json'}
        rt = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/kpi/addkpi', data=json.dumps(data),
                           headers=headers,timeout = 600)
    except Exception as e:
        print('add_kpi_by_projId error:' + e.__str__())
        logging.error(e.__str__())
    return rt.text


@app.route('/diagnosis/kpi/removekpi', methods=['POST'])
def remove_kpi_by_kpiId():
    rt = None
    try:
        data = request.get_json()
        headers = {'content-type': 'application/json'}
        rt = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/kpi/removekpi', data=json.dumps(data),
                           headers=headers,timeout = 600)
    except Exception as e:
        print('remove_kpi_by_kpiId error:' + e.__str__())
        logging.error(e.__str__())
    return rt.text


@app.route('/diagnosis/kpi/updatekpi', methods=['POST'])
def update_kpi_by_kpiId():
    rt = None
    try:
        data = request.get_json()
        headers = {'content-type': 'application/json'}
        rt = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/kpi/updatekpi', data=json.dumps(data),
                           headers=headers,timeout = 600)
    except Exception as e:
        print('update_kpi_by_kpiId error:' + e.__str__())
        logging.error(e.__str__())
    return rt.text

@app.route('/diagnosis/kpi/getkpiName/<projId>/<parentId>', methods=['GET'])
def get_kpi_name_by_parentId(projId, parentId):
    rt = None
    try:
        rt = requests.get(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/kpi/getkpiName/' + str(projId) + '/' + str(parentId),)
    except Exception as e:
        print('get_kpi_name_by_parentId error:' + e.__str__())
        logging.error(e.__str__())
    return rt.text

@app.route('/diagnosis/kpi/addFaultToKPI/<projId>', methods=['POST'])
def addFaultToKPI(projId):
    rt = None
    try:
        data = request.get_json()
        headers = {'content-type': 'application/json'}
        rt = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/kpi/addFaultToKPI/' + str(projId), data=json.dumps(data),
                           headers=headers,timeout = 600)
    except Exception as e:
        print('addFaultToKPI error:' + e.__str__())
        logging.error(e.__str__())
    return rt.text

@app.route('/diagnosis/kpi/getFault/<projId>', methods=['GET'])
def get_kpi_fault_by_projId(projId):
    rt = None
    try:
        rt = requests.get(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/kpi/getFault/' + str(projId))
    except Exception as e:
        print("get_kpi_fault_by_projId error:" + e.__str__())
        logging.error(e.__str__())
    return rt.text

def getDiagnosisNotice(projId):
    temp = (datetime.datetime.now() - datetime.timedelta(seconds = 10))
    timeFrom = temp.strftime("%Y-%m-%d %H:%M:%S")
    timeTo = time.strftime('%Y-%m-%d %X',time.localtime())
    url = app.config['BEOP_SERVICE_ADDRESS'] + '/diagnosis/notice/getbytime/%s/%s/%s' % (projId, timeFrom, timeTo)
    post_file_headers = {'content-type': 'application/octet-stream'}
    post_json_headers = {'content-type': 'application/json'}
    r = None
    try:
        r = requests.get(url, headers=post_file_headers)
        if r:
            if r.status_code == 200:
                return r.text
    except Exception as e:
        print('download_table error:' + e.__str__())
        logging.error(e.__str__())
    return None

@app.route('/diagnosis/kpi/removefault', methods=['POST'])
def remove_diagnosis_fault_from_kpi():
    rt = None
    try:
        data = request.get_json()
        headers = {'content-type': 'application/json'}
        rt = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/kpi/removefault', headers = headers, data = json.dumps(data))
    except Exception as e:
        print('remove_diagnosis_fault_from_kpi error:' + e.__str__())
        logging.error(e.__str__())
    return rt.text


@app.route('/diagnosis/kpi/getFaultWiki/<projId>/<kpiId>')
def get_diagnosis_kpi_fault(projId, kpiId):
    rt = None
    try:
        rt = requests.get(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/kpi/getFaultWiki/' + str(projId) + '/' + str(kpiId))
    except Exception as e:
        print("get_diagnosis_kpi_fault error:" + e.__str__())
        logging.error(e.__str__())
    return rt.text


@app.route('/diagnosis/kpi/updatewiki', methods=['POST'])
def add_kpi_content_by_kpiId():
    rt = None
    try:
        data = request.get_json()
        headers = {'content-type': 'application/json'}
        rt = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/diagnosis/kpi/updatewiki', headers = headers, data = json.dumps(data))
    except Exception as e:
        print('remove_diagnosis_fault_from_kpi error:' + e.__str__())
        logging.error(e.__str__())
    return rt.text


@app.route('/diagnosis/faultInfoWithZoneAndEquipments/<projId>')
@app.route('/diagnosis/faultInfoWithZoneAndEquipments/<projId>/<zoneId>')
def get_fault_with_zone_and_equipments(projId, zoneId = None):
    rt = []
    try:
        dbname = BEOPDataAccess.getInstance().getProjMysqldb(projId)
        if dbname != None:
            if zoneId is None:
                strSQL = 'SELECT f.Id, f.`Name`, f.DefaultGrade, f.EquipmentId, e.ZoneId, f.UserFaultDelay ' \
                         'from %s_diagnosis_faults as f LEFT JOIN %s_diagnosis_equipments as e on f.EquipmentId = e.Id ' \
                         'WHERE f.DefaultGrade = 2'%(dbname, dbname)
            else:
                strSQL = 'SELECT f.Id, f.`Name`, f.DefaultGrade, f.EquipmentId, e.ZoneId, f.UserFaultDelay ' \
                         'from %s_diagnosis_faults as f LEFT JOIN %s_diagnosis_equipments as e on f.EquipmentId = e.Id ' \
                         'WHERE f.DefaultGrade = 2 AND e.ZoneId = "%s"'%(dbname, dbname, str(zoneId))
            dbrv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query('diagnosis', strSQL)
            if dbrv:
                for item in dbrv:
                    try:
                        rt.append({'FaultId':item[0], 'FaultName':item[1], 'DefaultGrade':item[2], 'EquipmentId':item[3],
                                   'ZoneId':item[4], 'UserFaultDelay':item[5].strftime('%Y-%m-%d %H:%M:%S')})
                    except Exception as e:
                        pass
    except Exception as e:
        print('get_fault_with_zone_and_equipments error:' + e.__str__())
        logging.error(e.__str__())
    return jsonify(data = rt)

@app.route('/diagnosis/faultInfoWithZoneAndEquipmentsByTime/<projId>/<startTime>')
def get_fault_with_zone_and_equipments_by_time(projId, startTime):
    rt = []
    try:
        pass
    except Exception as e:
        print('get_fault_with_zone_and_equipments_by_time error:' + e.__str__())
        logging.error(e.__str__())
    return jsonify(data = rt)


@app.route('/v2/fault/getRealtime', methods=['POST'])
def v2_fault_get_realtime():
    rv = None
    data = request.get_json()
    headers = {'content-type': 'application/json'}
    try:
        rv = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/v2/fault/getRealtime',
                           headers=headers, data=json.dumps(data))
    except Exception as e:
        print('v2_fault_get_realtime error:' + e.__str__())
        logging.error(e.__str__())
    return Utils.beop_response_success(json.loads(rv.text))

@app.route('/v2/fault/getHistory', methods=['POST'])
def v2_fault_get_history():
    rv = None
    data = request.get_json()
    headers = {'content-type': 'application/json'}
    try:
        rv = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/v2/fault/getHistory',
                           headers=headers, data=json.dumps(data))
    except Exception as e:
        print('v2_fault_get_history error:' + e.__str__())
        logging.error(e.__str__())
    return json.dumps(rv.text, ensure_ascii=False)


@app.route('/diagnosis/downloadHistoryFault/<projectId>/<startTime>/<endTime>/<language>')
def download_file_of_historyFault(projectId, startTime, endTime,language):
    rt = {'status':0, 'message':None}
    grade_dict = {1:'Alert', 2:'Fault'}
    status_dict = {0:'Disable', 1:'Delayed', 2:'Realtime'}
    try:
        hisFault = get_historyFault(projectId, startTime, endTime)
        if hisFault:
            if language == 'zh':
                excelData = ExcelFile('时间', '级别', '设备', '区域', '故障', '后果',' 状态', '处理人', '响应时间')
            else:
                excelData = ExcelFile('Time', 'Grade', 'Equipment', 'Zone', 'Fault', 'Consequence', 'Status', 'Executor', 'Response Time')
            for item in hisFault:
                isUserDefined = item[7]  #f.IsUserDefined
                if isUserDefined == 1:
                    grade = item[8] #f.UserFaultGrade
                else:
                    grade = item[6] #f.DefaultGrade
                gradeName = grade_dict.get(int(grade))
                status = status_dict.get(int(item[1]))
                checkTime = item[2]
                resTime = None
                if checkTime:
                    if isinstance(checkTime, datetime):
                        resTime = checkTime - item[0]
                if language == 'en':
                    pTime = item[0].strftime('%b %d, %Y %H:%M:%S')
                else:
                    pTime  = item[0].strftime('%Y-%m-%d %H:%M:%S')
                excelData.append_row([pTime, gradeName, item[9], item[10], item[5], item[13], status, item[3], resTime])
            filepath = make_excel_file(excelData)
            if filepath:
                filename = make_file_name(projectId, startTime, endTime)
                rt = make_response(send_file(filepath))
                rt.headers["Content-Disposition"] = "attachment; filename=%s;"%filename
        else:
            rt = {'status':0, 'message':'Invalid parameter'}
    except Exception as e:
        print('download_file_of_historyFault error:' + e.__str__())
        logging.error(e.__str__())
        rt = {'status':0, 'message':e.__str__()}
    return rt

def get_historyFault(projectId, startTime, endTime):
    rt = []
    try:
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        if dbname != None:
            strSQL = 'SELECT n.Time, n.`Status`, n.EndTime, n.Operator, f.Id, f.NAME, f.DefaultGrade, '\
                     'f.IsUserDefined, f.UserFaultGrade, e.`Name`, ' \
                     'z.SubBuildingName, n.FeedBack, n.FeedBackId, f.Consequence FROM %s_diagnosis_notices AS n ' \
                     'INNER JOIN %s_diagnosis_faults AS f ON n.FaultId = f.ID ' \
                     'LEFT JOIN %s_diagnosis_equipments AS e on f.EquipmentId = e.Id ' \
                     'LEFT JOIN %s_diagnosis_zones AS z on e.ZoneId = z.Id ' \
                     'WHERE n.Time >= "%s" and n.Time <= "%s" ORDER BY n.Time desc'%(dbname, dbname, dbname, dbname, startTime, endTime)
            rt = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL)
    except Exception as e:
        print('getHistoryFault error:' + e.__str__())
        logging.error(e.__str__())
    return rt

def make_excel_file(excelData):
    rt = None
    file = None
    try:
        path = os.getcwd()
        filepath = path + '/temp'
        if not os.path.exists(filepath):
            os.makedirs(filepath)
        file_name = ObjectId().__str__() + '.xlsx'
        filepath = filepath + '/' + file_name.__str__()
        file = open(filepath, 'xb')
        file.write(excelData.data.xlsx)
        rt = filepath
    except Exception as e:
        print('make_excel_file error:' + e.__str__())
        logging.error(e.__str__())
    finally:
        if file:
            file.close()
    return rt

def make_file_name(projId, startTime, endTime):
    rt = None
    try:
        startTime = datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S')
        endTime = datetime.strptime(endTime, '%Y-%m-%d %H:%M:%S')
        if startTime < datetime.now():
            startTime = startTime.strftime('%Y-%m-%d')
            endTime = endTime.strftime('%Y-%m-%d')
            rt = "{}-{} ~ {}.xlsx".format(projId, startTime, endTime)
            #rt = str(projId) + '-' + startTime + '.xlsx'
    except Exception as e:
        print('make_file_name error:' + e.__str__())
        logging.error(e.__str__())
    return rt

@app.route('/diagnosis/getFaultDetailsbyFaultName', methods=['POST'])
def get_faultDetails_by_faultName():
    rt = {'status':0, 'message':None, 'data':[]}
    post_data = request.get_json()
    try:
        if post_data:
            faultName = post_data.get('faultName')
            startTime = post_data.get('startTime')
            endTime = post_data.get('endTime')
            projId = post_data.get('projId')
            dbAccess = BEOPDataAccess.getInstance()
            dbname = dbAccess.getProjMysqldb(projId)
            if dbname:
                strSQL = 'SELECT f.Id, f.`Name`, f.EquipmentId, e.`Name` AS EquipmentName, e.ZoneId, ' \
                         'z.SubBuildingName, n.Id, n.Time, n.Num, n.EndTime FROM %s_diagnosis_faults AS f INNER JOIN (' \
                         'SELECT Id, FaultId, `Time`, COUNT(*) as Num, EndTime FROM %s_diagnosis_notices WHERE Time <= "%s" AND Time >= "%s" ' \
                         'GROUP BY FaultId) as n ON n.FaultId = f.Id LEFT JOIN %s_diagnosis_equipments AS e ON f.EquipmentId = e.Id ' \
                         'LEFT JOIN %s_diagnosis_zones AS z ON e.ZoneId = z.Id ' \
                         'WHERE f.`Name` = "%s" ORDER BY n.Num DESC'%(dbname, dbname, endTime, startTime, dbname, dbname, faultName)
                dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL)
                if dbrv:
                    fault_dict = {}
                    for item in dbrv:
                        try:
                            if item[0] in fault_dict.keys():
                                fault_dict.get(item[0]).get('arrNoticeTime').append({'NoticeId': item[6],
                                                                                     'EndTime': item[9].strftime('%Y-%m-%d %H:%M:%S') \
                                                                                     if isinstance(item[9], datetime) else item[9],
                                                                                     'Time':item[7].strftime('%Y-%m-%d %H:%M:%S')})
                            else:
                                fault_dict.update({item[0]:{'FaultId':item[0], 'FaultName':item[1], 'EquipmentId':item[2],
                                                            'EquipmentName':item[3], 'ZoneId':item[4], 'SubBuildingName':item[5],
                                                            'arrNoticeTime':[{'NoticeId': item[6],
                                                                              'EndTime': item[9].strftime('%Y-%m-%d %H:%M:%S') \
                                                                              if isinstance(item[9], datetime) else item[9],
                                                                              'Time':item[7].strftime('%Y-%m-%d %H:%M:%S')}]}})
                        except Exception as e:
                            pass
                    for i in fault_dict.keys():
                        rt.get('data').append(fault_dict.get(i))
                rt.update({'status':1, 'message':None})
            else:
                rt.update({'status':0, 'message':'Invalid parameter'})
        else:
            rt.update({'status':0, 'message':'Invalid parameter'})
    except Exception as e:
        print('get_faultDetails_by_faultName error:' + e.__str__())
        logging.error(e.__str__())
        rt.update({'status':0, 'message':e.__str__()})
    return jsonify(rt)

#获取ROI信息
@app.route('/diagnosis/getFaultROIbyFaultName', methods=['POST'])
def get_faultROI_by_faultName():
    rt = {'status':0, 'message':None, 'data':[]}
    post_data = request.get_json()
    try:
        if post_data:
            faultName = post_data.get('faultName')
            startTime = post_data.get('startTime')
            endTime = post_data.get('endTime')
            projId = post_data.get('projId')
            dbAccess = BEOPDataAccess.getInstance()
            dbname = dbAccess.getProjMysqldb(projId)
            if dbname:
                strSQL = ' SELECT f.Id, n.Time, f.Group, f.IsUserDefined, f.DefaultGrade, f.UserFaultGrade, f.`Name`,'\
                         ' e.ZoneId, f.EquipmentId, e.`Name` AS EquipmentName, '\
	                     ' z.SubBuildingName, f.RuntimeDay, f.RuntimeWeek, f.RuntimeMonth, f.RuntimeYear, f.HrPrice,'\
                         ' f.Hr, f.LaborCost, f.Unit, u.Factor, n.Energy,f.ElecPrice '\
                         ' FROM %s_diagnosis_faults AS f '\
                         ' LEFT JOIN ( SELECT Id, FaultId, avg(IF( Energy<>0, Energy, Null ))  as Energy, `Time`, COUNT(*) AS Num, CheckTime '\
	                     ' FROM %s_diagnosis_notices WHERE Time <= "%s" AND Time >= "%s" GROUP BY FaultId ) '\
                         ' AS n ON n.FaultId = f.Id '\
                         ' LEFT JOIN %s_diagnosis_equipments AS e ON f.EquipmentId = e.Id '\
                         ' LEFT JOIN %s_diagnosis_zones AS z ON e.ZoneId = z.Id '\
                         ' LEFT JOIN unitconversion AS u ON f.Unit = u.NewUnit '\
                         ' WHERE f.`Name` = "%s" AND n.Time > 0 GROUP BY f.Id '\
                         ' ORDER BY n.Num DESC'%(dbname, dbname, endTime, startTime, dbname, dbname, faultName)

                dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL)
                if dbrv:
                    for item in dbrv:
                        fault_dict = {}
                        try:
                            fault_dict.update({'FaultId':item[0], 'Time': item[1].strftime('%Y-%m-%d %H:%M:%S'), 'Group': item[2],
                                               'Grade': item[5] if item[3]==1 else item[4],  'FaultName':item[6],
                                               'ZoneId': item[7], 'EquipmentId':item[8],
                                               'EquipmentName':item[9], 'SubBuildingName': item[10], 'RuntimeDay':item[11],
                                               'RuntimeWeek':item[12], 'RuntimeMonth':item[13], 'RuntimeYear':item[14],
                                               'HrPrice':float(item[15]) if item[15] else item[15],
                                               'Hr':float(item[16]) if item[16] else item[16], 'LaborCost':float(item[17]) if item[17] else item[17],
                                               'Unit':item[18], 'Factor': item[19], 'Energy': item[20],'ElecPrice':item[21]})
                        except Exception as e:
                            pass
                        rt.get('data').append(fault_dict)
                rt.update({'status':1, 'message':None})
            else:
                rt.update({'status':0, 'message':'Invalid parameter'})
        else:
            rt.update({'status':0, 'message':'Invalid parameter'})
    except Exception as e:
        print('get_faultROI_by_faultName error:' + e.__str__())
        logging.error(e.__str__())
        rt.update({'status':0, 'message':e.__str__()})
    return jsonify(rt)


# 保存ROI
@app.route('/diagnosis/saveFaultROIbyFaultName', methods=['POST'])
def saveFaultROIbyFaultName():
    rt = False
    post_data = request.get_json()
    projId = post_data.get('projId')
    arrData = post_data.get('arrData')
    try:
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projId)
        if dbname and arrData:
            for item in arrData:
                rt = False
                HrPrice = item.get('hrPrice')
                Hr = item.get('hr')
                LaborCost = item.get('laborCost')
                Name = item.get('faultName')
                FaultId = item.get('faultId')
                powerPrice = item.get('powerPrice')
                strSQL = '''UPDATE {dbname}_diagnosis_faults SET HrPrice = {HrPrice}, Hr = {Hr},
                            LaborCost = {LaborCost},ElecPrice = {ElecPrice} WHERE Name = "{Name}" AND id = {FaultId} ''' \
                    .format(dbname=dbname,HrPrice=HrPrice,Hr=Hr,LaborCost=LaborCost,ElecPrice=powerPrice,Name=Name,FaultId=FaultId)
                # strSQL = '''UPDATE {dbname}_diagnosis_faults SET HrPrice = %s, Hr = %s, LaborCost = %s WHERE Name = %s AND FaultId = %s ''' \
                #     .format(dbname=dbname)
                # params = [HrPrice,Hr, LaborCost,Name,FaultId]
                dbrv = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL)
                if dbrv:
                    rt = True
        rt = {'data': rt}
    except Exception as e:
        print('saveFaultROIbyFaultName error:' + e.__str__())
        logging.error(e.__str__())
    return jsonify(rt)


# 下载ROI表格
@app.route('/diagnosis/downloadFaultROI/<projectId>/<startTime>/<endTime>/<faultName>/<cycle>/<powerPrice>/<language>/<unit_currency>')
def download_file_of_FaultROI(projectId, startTime, endTime, faultName, cycle, powerPrice, language, unit_currency):
    rt = {'status':0, 'message':None}
    powerPrice = float(powerPrice)
    if language == 'en':
        grade_dict = {1:'Alert', 2:'Fault'}
    else:
        grade_dict = {1:'警告', 2:'故障'}
    cycle_dict = {
        'zh': {
            'day': '日',
            'week': '周',
            'month': '月',
            'year': '年',
        },
        'en': {
            'day': 'day',
            'week': 'week',
            'month': 'month',
            'year': 'year',
        }
    }
    timeFormat = None
    try:
        faultROI = get_faultROI_by_params(projectId, startTime, endTime, faultName)
        if faultROI:
            unit = faultROI[0][18]
            if cycle == 'year':
                selIndex = 14
            elif cycle == 'month':
                selIndex = 13
            elif cycle == 'week':
                selIndex = 12
            elif cycle == 'day':
                selIndex = 11
            if language == 'zh':
                excelData = ExcelFile('编号', '时间', '级别', '分组', '故障', '区域', '设备', 'ROI(年)',
                                      '节能量/' + cycle_dict.get(language).get(cycle) + '(' + unit + ')',
                                      '电费单价('+unit_currency +'/'+unit+')','节省费用('+unit_currency+')',
                                      '人工单价('+unit_currency+'/时)', '人工耗时(时)', '人工成本('+unit_currency+')')
            else:
                excelData = ExcelFile('No.', 'Time', 'Grade', 'Group', 'Fault', 'Zone', 'Equipment',
                                      'ROI(yr)', 'Saving per ' + cycle_dict.get(language).get(cycle) + '(' + unit + ')',
                                      'Elc.Price('+ unit_currency +'/'+unit+')', 'Saving('+unit_currency+')',
                                      'Labor Price('+unit_currency +'/hr)', 'Work hour(hr)', 'Labor Cost('+unit_currency + ')')
            for index in range(len(faultROI)):
                item = faultROI[index]
                # 计算ROI,runTime按年算
                ROI = '--'
                saveMoney = item[14]*powerPrice*item[19]*(item[20] if item[20] else 0) #RuntimeYear*price*Energy*Factor
                laborCost = item[17]
                hrPrice = item[15] if item[15] else 0
                hr = item[16] if item[16] else 0
                # 节能量
                savingEnergy = item[selIndex]*item[19]*(item[20] if item[20] else 0) #Runtime[year|month|week|day]*Energy*Factor
                # 节省费用(周期)
                saveMoneyP = item[selIndex]*powerPrice*item[19]*(item[20] if item[20] else 0)
                if not laborCost:
                    laborCost = hrPrice * hr

                if laborCost and laborCost > 0:
                    if saveMoney == 0:
                        ROI = '--'
                    elif laborCost == 0:
                        ROI = 0;
                    elif not laborCost:
                        ROI = '--';
                    else:
                        ROI = float( '%.1f' %  (laborCost/saveMoney))

                # 格式化数据,保留2位小数
                if saveMoney:
                    saveMoney = float( '%.2f' %  saveMoney)
                if savingEnergy:
                    savingEnergy = float( '%.2f' %  savingEnergy)
                if saveMoneyP:
                    saveMoneyP = float( '%.2f' %  saveMoneyP)
                dbAccess = BEOPDataAccess.getInstance()
                query = "select time_format from project where id=%s" % projectId
                timeFormat = dbAccess._mysqlDBContainerReadOnly.op_db_query(app.config['DATABASE'],query)[0][0]
                newTime = getFormatTime(int(timeFormat), str(item[1]))
                excelData.append_row([index+1, newTime, grade_dict.get(int(item[5])), item[2], item[6], item[10], item[9], ROI,
                                      savingEnergy, powerPrice, unit_currency + saveMoneyP.__str__(),
                                      item[15] if item[15] else '--', item[16] if item[16] else '--',
                                      laborCost if laborCost and laborCost else '--'])
            filepath = make_excel_file(excelData)
            if filepath:
                filename = getXlsxNameWithFormat(timeFormat, projectId, startTime, endTime)
                #filename = make_file_name(projectId, startTime, endTime)
                rt = make_response(send_file(filepath))
                rt.headers["Content-Disposition"] = "attachment; filename='%s';" % filename
        else:
            rt = {'status':0, 'message':'Invalid parameter'}
    except Exception as e:
        print('download_file_of_FaultROI error:' + e.__str__())
        logging.error(e.__str__())
        rt = {'status':0, 'message':e.__str__()}
    return rt

def getFormatTime(type, strTime, year=None):
    if type == 1:
        timeStamp = time.mktime(time.strptime(strTime, "%Y-%m-%d %H:%M:%S"))
        if not year:
            return time.strftime("%b %d, %H:%M:%S", time.localtime(timeStamp))[:-3]
        else:
            return time.strftime("%b %d, %Y %H:%M:%S", time.localtime(timeStamp))[:-3]
    else:
        return strTime

#通过时间格式匹配filename
def getXlsxNameWithFormat(type, projId, startTime, endTime):
    stTime = getFormatTime(type, str(startTime), 1)
    edTime = getFormatTime(type, str(endTime), 1)
    if type == 1:
        stTime = stTime[:-6]
        edTime = edTime[:-6]
        return "{}-{} - {}.xlsx".format(projId, stTime, edTime)
    else:
        return make_file_name(projId, startTime, endTime)

# sql语句与get_faultROI_by_faultName方法逻辑一致,因为get_faultROI_by_faultName不需要参数只好重写一个方法
def get_faultROI_by_params(projectId, startTime, endTime, faultName):
    rt = {'status':0, 'message':None, 'data':[]}
    try:
        faultName = faultName
        startTime = startTime
        endTime = endTime
        projId = projectId
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projId)
        if dbname:
            strSQL = ' SELECT f.Id, n.Time, f.Group, f.IsUserDefined, f.DefaultGrade, f.UserFaultGrade, f.`Name`, '\
                     ' e.ZoneId, f.EquipmentId, e.`Name` AS EquipmentName, '\
                     ' z.SubBuildingName, f.RuntimeDay, f.RuntimeWeek, f.RuntimeMonth, f.RuntimeYear, f.HrPrice, '\
                     ' f.Hr, f.LaborCost, f.Unit, u.Factor, n.Energy '\
                     ' FROM %s_diagnosis_faults AS f '\
                     ' LEFT JOIN ( SELECT Id, FaultId, avg(IF( Energy<>0, Energy, Null ))  as Energy, `Time`, COUNT(*) AS Num, CheckTime '\
                     ' FROM %s_diagnosis_notices WHERE Time <= "%s" AND Time >= "%s" GROUP BY FaultId ) '\
                     ' AS n ON n.FaultId = f.Id '\
                     ' LEFT JOIN %s_diagnosis_equipments AS e ON f.EquipmentId = e.Id '\
                     ' LEFT JOIN %s_diagnosis_zones AS z ON e.ZoneId = z.Id '\
                     ' LEFT JOIN unitconversion AS u ON f.Unit = u.NewUnit '\
                     ' WHERE f.`Name` = "%s" AND n.Time > 0 GROUP BY f.Id '\
                     'ORDER BY n.Num DESC'%(dbname, dbname, endTime, startTime, dbname, dbname, faultName)

            dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL)
            if dbrv:
                return dbrv
            rt.update({'status':1, 'message':None})
        else:
            rt.update({'status':0, 'message':'Invalid parameter'})
    except Exception as e:
        print('get_faultROI_by_params error:' + e.__str__())
        logging.error(e.__str__())
        rt.update({'status':0, 'message':e.__str__()})
    return rt


@app.route('/diagnosis/getFaultDetails', methods=['POST'])
def get_faultDetails():
    rt = {'status':0, 'message':None, 'data':[]}
    type_index = {'fault':0, 'workhours':0, 'equipment':3, 'zone':5}
    type_key = {'fault':('FaultId', 'FaultName', 'Description', 'EquipmentId', 'EquipmentName', 'ZoneId', 'SubBuildingName'),
                'workhours':('FaultId', 'FaultName', 'Description','EquipmentId', 'EquipmentName', 'ZoneId', 'SubBuildingName'),
                'equipment':('EquipmentId', 'EquipmentName', 'ZoneId', 'SubBuildingName'),
                'zone':('ZoneId', 'SubBuildingName')}
    post_data = request.get_json()
    try:
        if post_data:
            value = post_data.get('value')
            type = post_data.get('type')  #fault/workhours/equipment/zone
            startTime = post_data.get('startTime')
            endTime = post_data.get('endTime')
            projId = post_data.get('projId')
            dbAccess = BEOPDataAccess.getInstance()
            dbname = dbAccess.getProjMysqldb(projId)
            if dbname:
                strSQL = make_sql_for_get_faultDetails(type, value, dbname, startTime, endTime)
                dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL)
                if dbrv:
                    fault_dict = {}
                    n = type_index.get(type)
                    keys = type_key.get(type)
                    energy_dict = {}
                    for item in dbrv:
                        try:
                            energy = float(item[11]) if item[11] else 0
                            if item[n] in fault_dict.keys():
                                fault_dict.get(item[n]).get('arrNoticeTime').append({'NoticeId': item[7], 'FaultId': item[0],
                                                                                     'FaultName': item[1], 'EquipmentId': item[3],
                                                                                     'EquipmentName': item[4], 'Points': item[10],
                                                                                     'Description': item[2],
                                                                                     'EndTime': item[9].strftime('%Y-%m-%d %H:%M:%S') \
                                                                                     if isinstance(item[9], datetime) else item[9],
                                                                                     'Time': item[8].strftime('%Y-%m-%d %H:%M:%S')})
                                # 不要管字段名，字段名 什么的 都是浮云
                                # 计算节能量
                                if energy > 0:
                                    energy_dict.get(item[n]).append(energy)
                                if energy_dict.get(item[n]):
                                    sumEnergy = sum(energy_dict.get(item[n])) / len(energy_dict.get(item[n]))
                                else:
                                    sumEnergy = 0
                                fault_dict.get(item[n]).update({'sumEnergy': sumEnergy})
                            else:
                                fault_dict.update({item[n]:{'arrNoticeTime':[{'NoticeId': item[7], 'FaultId': item[0],
                                                                              'FaultName': item[1], 'EquipmentId': item[3],
                                                                              'EquipmentName': item[4], 'Points': item[10],
                                                                              'Description': item[2],
                                                                              'EndTime': item[9].strftime('%Y-%m-%d %H:%M:%S') \
                                                                              if isinstance(item[9], datetime) else item[9],
                                                                              'Time': item[8].strftime('%Y-%m-%d %H:%M:%S')}], 'sumEnergy': energy}})
                                if energy == 0:
                                    energy_dict.update({item[n]: []})
                                else:
                                    energy_dict.update({item[n]: [energy]})
                                k = n
                                for i in keys:
                                    fault_dict.get(item[n]).update({i:item[k]})
                                    k = k + 1
                        except Exception as e:
                            pass
                    flist = list(fault_dict.keys())
                    flist.sort()
                    for i in flist:
                        rt.get('data').append(fault_dict.get(i))
                rt.update({'status':1, 'message':None})
            else:
                rt.update({'status':0, 'message':'Invalid parameter'})
        else:
            rt.update({'status':0, 'message':'Invalid parameter'})
    except Exception as e:
        print('get_faultDetails error:' + e.__str__())
        logging.error(e.__str__())
        rt.update({'status':0, 'message':e.__str__()})
    return jsonify(rt)

def make_sql_for_get_faultDetails(type, value, dbname, startTime, endTime):
    rt = None
    type_value = {'fault':'f.`Name`', 'workhours':'f.`Name`', 'equipment':'z.BuildingName', 'zone':'z.SubBuildingName'}
    if type_value.get(type):
        if type == 'workhours':
            work_times = get_work_hours(startTime, endTime)
            strTime_list = []
            for item in work_times:
                strTime_list.append('(n.Time >= "%s" AND n.Time <= "%s")' % (item[0].strftime('%Y-%m-%d %H:%M:%S'),
                                                                             item[1].strftime('%Y-%m-%d %H:%M:%S')))
            if strTime_list:
                rt = 'SELECT f.Id, f.`Name`, f.Description, f.EquipmentId, e.`Name` AS EquipmentName, e.ZoneId, z.SubBuildingName, '\
                     'n.Id AS Id2, n.Time, n.EndTime, f.Points, n.Energy * f.RunTimeYear * u.Factor FROM %s_diagnosis_faults AS f '\
                     'LEFT JOIN %s_diagnosis_notices AS n ON n.FaultId = f.Id '\
                     'LEFT JOIN %s_diagnosis_equipments AS e ON f.EquipmentId = e.Id '\
                     'LEFT JOIN %s_diagnosis_zones AS z ON e.ZoneId = z.Id '\
                     'LEFT JOIN unitconversion AS u ON f.Unit = u.NewUnit '\
                     'WHERE %s = "%s" AND (' % (dbname, dbname, dbname, dbname, type_value.get(type), value)
                for strTime in strTime_list:
                    rt = rt + strTime + ' OR '
                rt = rt[:-3] + ') ORDER BY f.Id'
        else:
            rt = 'SELECT f.Id, f.`Name`, f.Description, f.EquipmentId, e.`Name` AS EquipmentName, e.ZoneId, z.SubBuildingName, '\
                 'n.Id AS Id2, n.Time, n.EndTime, f.Points, n.Energy * f.RunTimeYear * u.Factor FROM %s_diagnosis_faults AS f '\
                 'LEFT JOIN %s_diagnosis_notices AS n ON n.FaultId = f.Id '\
                 'LEFT JOIN %s_diagnosis_equipments AS e ON f.EquipmentId = e.Id '\
                 'LEFT JOIN %s_diagnosis_zones AS z ON e.ZoneId = z.Id '\
                 'LEFT JOIN unitconversion AS u ON f.Unit = u.NewUnit WHERE %s = "%s" '\
                 'AND n.Time <= "%s" AND n.Time >= "%s" '\
                 'ORDER BY f.Id'%(dbname, dbname, dbname, dbname, type_value.get(type), value, endTime, startTime)
    else:
        raise Exception('Invalid parameter')
    return rt

def get_work_hours(startTime, endTime):
    rt = []
    try:
        startTime = datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S')
        endTime = datetime.strptime(endTime, '%Y-%m-%d %H:%M:%S')
        bdate = startTime.date()
        strbdate = bdate.strftime('%Y-%m-%d')
        btime = datetime.strptime(strbdate + ' 08:00:00', '%Y-%m-%d %H:%M:%S')
        etime = datetime.strptime(strbdate + ' 18:00:00', '%Y-%m-%d %H:%M:%S')
        if btime<= startTime:
            btime = startTime
        while etime <= endTime:
            rt.append((btime, etime))
            bdate = bdate + timedelta(days = 1)
            strbdate = bdate.strftime('%Y-%m-%d')
            btime = datetime.strptime(strbdate + ' 08:00:00', '%Y-%m-%d %H:%M:%S')
            etime = datetime.strptime(strbdate + ' 18:00:00', '%Y-%m-%d %H:%M:%S')
        if btime <= endTime:
            rt.append((btime, endTime))
    except Exception as e:
        print('get_work_hours error:' + e.__str__())
        logging.error(e.__str__())
    return rt



@app.route('/diagnosis/getFaultReportGroupByGroup', methods=['POST'])
@app.route('/diagnosis/getFaultReportGroupByGroup/<type>', methods=['POST'])
def get_faultReport_group_by_group(type = None):
    '''
    David 20161017
    :return:
    '''
    rt = {'status':0, 'message':None, 'data':[]}
    post_data = request.get_json()
    try:
        if post_data:
            projId = post_data.get('projId')
            startTime = post_data.get('startTime')
            endTime = post_data.get('endTime')
            dbAccess = BEOPDataAccess.getInstance()
            dbname = dbAccess.getProjMysqldb(projId)
            if dbname:
                strGroupBy = "GROUP BY f.Name"
                strSort = ''
                if type == "consequence":
                    strGroupBy = "GROUP BY f.Consequence, f.name"
                    strSort = 'ORDER BY f.FaultType DESC,n.Energy DESC'
                strSQL = 'SELECT f.`Name` as FaultName, f.Description, group_concat(f.EquipmentId) as EquipmentId, ' \
                         'group_concat(e.`Name`) AS EquipmentName, ' \
                         'f.TargetGroup, f.TargetExecutor, u.userfullname, g.`name` AS GroupName, ' \
                         'f.DefaultGrade, f.IsUserDefined, f.UserFaultGrade, f.Consequence, n.OrderId, ' \
                         'SUM(IF(`OrderId` <> "0", 1, 0)) AS CLOSED, SUM(IF(`OrderId` = "0", 1, 0)) AS WIP, Time, '\
                         'f.FaultType, n.Energy, f.RunTimeYear, n.Energy * f.RunTimeYear ' \
                         'FROM diagnosis.%s_diagnosis_notices as n ' \
                         'LEFT JOIN diagnosis.%s_diagnosis_faults as f ON f.Id = n.FaultId ' \
                         'LEFT JOIN diagnosis.%s_diagnosis_equipments as e ON e.Id = f.EquipmentId ' \
                         'LEFT JOIN beopdoengine.`user` AS u ON u.id = f.TargetExecutor ' \
                         'LEFT JOIN workflow.transaction_group AS g ON g.id = f.TargetGroup ' \
                         'WHERE Time <= "%s" AND Time >= "%s" %s %s'%(dbname, dbname, dbname, endTime, startTime, strGroupBy, strSort)
                dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL)
                if dbrv:
                    group_dict = {}
                    for item in dbrv:
                        strGroupName, strGroupId = item[7], item[4]
                        if type == "consequence":
                            strGroupName = item[11]
                            strGroupId = item[11]
                        try:
                            isUserDefined = item[9]  #f.IsUserDefined
                            if(isUserDefined == 1):
                                grade = item[10] #f.UserFaultGrade
                            else:
                                grade = item[8] #f.DefaultGrade
                            if strGroupId in group_dict.keys():
                                group_dict.get(strGroupId).get('list').append({'OrderId': item[12], 'FaultName':item[0], 'Grade':grade,
                                                                               'Desc':item[1],'EquipmentName':item[3],
                                                                               'Status':[int(item[13]),int(item[14])], 'ExecuterId':item[5],
                                                                               'ExecuterName':item[6], 'EquipmentId':item[2],
                                                                               'Target':get_target_by_equipment(item[3], item[2]),
                                                                               'Consequence':item[11], 'FaultType':item[16], 'Energy':item[17],
                                                                               'YearEnergy': float(item[19])})
                                group_dict.get(strGroupId).update({'YearEnergy': group_dict.get(strGroupId).get('YearEnergy') + float(item[19])})
                            else:
                                if strGroupName != 'Other':
                                    group_dict.update({strGroupId:{'GroupName':strGroupName, 'GroupId':strGroupId, 'YearEnergy': float(item[19]),
                                                                   'list':[{'OrderId': item[12],'FaultName':item[0], 'Grade':grade, 'Desc':item[1],
                                                                            'Status':[int(item[13]),int(item[14])], 'ExecuterId':item[5],
                                                                            'ExecuterName':item[6], 'EquipmentId':item[2],
                                                                            'EquipmentName':item[3],
                                                                            'Target':get_target_by_equipment(item[3], item[2]),
                                                                            'Consequence':item[11], 'FaultType':item[16], 'Energy':item[17],
                                                                            'YearEnergy': float(item[19])}]}})
                        except Exception as e:
                            pass
                    if group_dict:

                        for key in group_dict.keys():
                            rt.get('data').append(group_dict.get(key))
                    rt.update({'status':1})
            else:
                rt.update({'status':0, 'message':'Invalid parameter'})
        else:
            rt.update({'status':0, 'message':'Invalid parameter'})
    except Exception as e:
        print('get_faultReport_group_by_group error:' + e.__str__())
        logging.error(e.__str__())
    return jsonify(rt)

def get_target_by_equipment(EquipmentName, EquipmentId):
    rt = ''
    headers = {'content-type': 'application/json'}
    url = 'http://121.40.140.32:5111/equipmentTarget/getTarget'
    try:
        if isinstance(EquipmentId, str) and isinstance(EquipmentName, str):
            EquipmentId_list = EquipmentId.split(',')
            EquipmentName_list = EquipmentName.split(',')
        else:
            EquipmentId_list = [int(EquipmentId)]
            EquipmentName_list = [EquipmentName]
        post_data = {'target':{}}
        for i in range(len(EquipmentId)):
            try:
                post_data.get('target').update({EquipmentName_list[i]:EquipmentId_list[i]})
            except Exception as e:
                pass
        if post_data.get('target'):
            res = requests.post(url, json.dumps(post_data), headers=headers, timeout=30)
            if res.status_code == 200:
                rt = json.loads(res.text).get('target')
    except Exception as e:
        raise Exception(e.__str__())
    return rt

@app.route('/diagnosis/notice/getTop5/<projectId>', methods=['GET'])
def updateDiagnosisFaultMulti111(projectId):
    rv = []
    try:
        projectId = int(projectId)
        post = request.get_json()
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        if dbname is None:
            dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
        if dbname != None:
            startTime = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d 00:00:00')
            strSQL = 'SELECT n.Id, min(n.Time), f.Name, GROUP_CONCAT(distinct e.Name) as EquipName, \
                      f.Description, min(n.OrderId), n.Status, n.CheckTime \
                      FROM %s_diagnosis_notices AS n \
                      LEFT JOIN %s_diagnosis_faults AS f ON n.FaultId = f.Id \
                      LEFT JOIN %s_diagnosis_equipments AS e on e.Id = f.EquipmentId \
                      WHERE f.DefaultGrade = 2 and n.Time > "%s" \
                      GROUP BY f.Name \
                      ORDER BY n.Time DESC \
                      limit 5' % (dbname, dbname, dbname, startTime)
            dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
            for item in dbrv:
                rv.append({'NoticeId':item[0], 'Time':item[1].strftime('%Y-%m-%d %H:%M'), 'Fault':item[2],
                           'Equipment':item[3], 'Desc': item[4], 'OrderId':item[5], 'Status':item[6],
                           'CheckTime':item[7]})
    except Exception as e:
        print('updateDiagnosisFaultMulti111 error:' + e.__str__())
        logging.error(e.__str__())
    return json.dumps({'data': rv}, ensure_ascii=False)


def set_diagnosis_feedBack(projId, FaultId, taskId, FeedBack, startTime, endTime):
    '''
    David 20161202 FeedBack 0: 未反馈 1: 等待处理 2: 执行中 3: 完成
    '''
    rt = False
    id_list = FaultId
    if not isinstance(id_list, list):
        id_list = [str(FaultId)]
    try:
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projId)
        if dbname:
            strSQL = 'UPDATE {dbname}_diagnosis_notices SET FeedBack = %s, FeedBackId = %s '\
                     'WHERE FaultId IN ({ids}) AND Time <= %s AND Time >= %s'.format(dbname=dbname, ids=','.join(['%s'] * len(id_list)))
            params = [int(FeedBack), str(taskId)] + id_list + [endTime, startTime]
            dbrv = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL, params)
            if dbrv:
                rt = True
    except Exception as e:
        print('update_diagnosis_feedBack error:' + e.__str__())
        logging.error(e.__str__())
    return rt

#notice表的OrderId字段更新为工单id
def set_diagnosis_orderId(projId, NoticeId, OrderId):
    '''
    vicky 20170214
    '''
    rt = False
    try:
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projId)
        if dbname:
            strSQL = '''UPDATE {dbname}_diagnosis_notices SET OrderId = %s WHERE Id = %s''' \
                .format(dbname=dbname)
            params = [OrderId, NoticeId]
            dbrv = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL, params)
            if dbrv:
                rt = True
    except Exception as e:
        print('update_diagnosis_feedBack error:' + e.__str__())
        logging.error(e.__str__())
    return rt


# 获取faultId对应的point对应的历史数据
@app.route('/diagnosis/getFaultHisDataById', methods=['POST'])
def getFaultHisData():
    '''
    vicky 20170217
    '''
    rt = {}
    fault = {}
    try:
        post = request.get_json()
        projectId = int(post.get('projId'))
        faultId = post.get('faultId')
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        arrPoint = []
        dsItemIds = []
        if dbname is None:
            dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
        if dbname != None:
            strSQL = 'SELECT f.Points, f.Name, f.Description FROM %s_diagnosis_faults AS f WHERE f.Id=%s' % (dbname, faultId)
            dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
            for item in dbrv:
                arrPoint = item[0].split('|')
                fault.update({'name': item[1], 'description': item[2], 'arrPoint': arrPoint})
                for i in arrPoint:
                    dsItemIds.append('@'+projectId.__str__()+'|'+i.split(',')[0])
            rslt = startWorkspaceDataGenHistogram_fuc(post.get('timeStart'), post.get('timeEnd'), post.get('timeFormat'),
                                                      itemVarIdList=dsItemIds)
            if rslt:
                rt.update({'data':rslt, 'fault': fault})
    except Exception as e:
        print('getFaultHisData error:' + e.__str__())
        logging.error(e.__str__())
    return json.dumps({'data': rt}, ensure_ascii=False)


# 根据过滤条件，获取fault列表
@app.route('/diagnosis/fault/filter', methods=['POST'])
# postData = {
#     "type": "equipment",  # "equipment"/"zone" 影响ID字段的结果，从diagnosis_equipments向下查找，还是从diagnosis_zone向下查找
#     "id": "123123",  # 根据type字段，对应diagnosis_equipments.id 或 diagnosis_zone.id
#     "status": "True",  # 对应diagnosis_faults中的 enable 字段, 不传则不安该条件筛选
#     "keyword": "", #搜索关键字，设备名、故障名中的一部分， 最好支持空格分割的多关键字
#     "projId": 293
# }
# return_ = {
#     "data": [
#         {
#             "FaultId": "",
#             "Name": "",
#             "Grade": "",
#             "Desc": "",
#             "Enable": True,
#             "EquipId": "",
#             "EquipName": "",
#             "Consequence": ""
#         }
#     ]
# }
def diagnosisFaultFilter():
    rt = []
    post = request.get_json()
    try:
        if post:
            projId = post.get('projId')
            dbAccess = BEOPDataAccess.getInstance()
            dbname = dbAccess.getProjMysqldb(projId)
            if dbname:
                strSQL = 'SELECT f.Id, f.`Name`, f.Description, f.DefaultGrade, '\
                         'f.`Enable`, f.EquipmentId, e.`Name`, f.Consequence, f.IsPush '\
                         'FROM %s_diagnosis_faults AS f '\
                         'LEFT JOIN %s_diagnosis_equipments as e '\
                         'ON f.EquipmentId = e.Id ' % (dbname, dbname)
                strWHERE = 'WHERE Points IS NOT NULL AND Points <> "" '
                for key in post.keys():
                    value = post.get(key)
                    if key == 'status':
                        if len(strWHERE) == 6:
                            strWHERE += 'f.`Enable` = %s ' % value
                        else:
                            strWHERE += 'AND f.`Enable` = %s ' % value
                    elif key == 'keyword':
                        value_list = value.split(' ')
                        for v in value_list:
                            if len(strWHERE) == 6:
                                strWHERE += '(f.`Name` like "%{0}%" OR e.`Name` like "%{0}%") '.format(v)
                            else:
                                strWHERE += 'AND (f.`Name` like "%{0}%" OR e.`Name` like "%{0}%") '.format(v)
                    elif key == 'type':
                        if 'id' in post.keys():
                            if value == 'zone':
                                sql = 'SELECT Id FROM %s_diagnosis_equipments WHERE ZoneId = "%s"' % (dbname, post.get('id'))
                                dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', sql, ())
                                eIds = [x[0] for x in dbrv]
                            elif value == 'equipment':
                                eIds = [post.get('id')]
                            if len(strWHERE) == 6:
                                strWHERE += 'f.EquipmentId in %s ' % str(eIds).replace('[', '(').replace(']', ')')
                            else:
                                strWHERE += 'AND f.EquipmentId in %s ' % str(eIds).replace('[', '(').replace(']', ')')
                if len(strWHERE) != 6:
                    strSQL += strWHERE
                dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
                for item in dbrv:
                    rt.append({"FaultId": item[0], "Name": item[1], "Grade": item[3], "Desc": item[2],
                               "Enable": True if item[4] else False, "EquipId": item[5], "EquipName": item[6],
                               "Consequence": item[7], "IsPush": item[8]})
    except Exception as e:
        print('diagnosisFaultFilter error:' + e.__str__())
        logging.error(e.__str__())
    return json.dumps({'data': rt}, ensure_ascii=False)


# 根据faultID字符串，得出关联人物id数组
# postData = {
#     "faultIdStr": "123123"
#     "projId": 293
# }
# return = True / False
@app.route('/diagnosis/faults/relatedUsers', methods=['POST'])
def diagnosisFaultRelatedUsers():
    rt = False
    try:
        post = request.get_json()
        faultIdStr = post.get('faultIdStr')
        projId = post.get('projId')
        type = post.get('type')
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projId)
        if dbname:
            strSQL = 'SELECT Users FROM diagnosispush WHERE Type = %s and FaultId = %s' % (type, faultIdStr)
            rt = dbAccess._mysqlDBContainer.op_db_query('diagnosis', strSQL, ())
    except Exception as e:
        print('diagnosisFaultRelatedUsers error:' + e.__str__())
        logging.error(e.__str__())
    return json.dumps({'data': rt}, ensure_ascii=False)


@app.route('/diagnosis/faults/deleteAllRelated', methods=['POST'])
def diagnosisFaultDeleteAllRelated():
    rt = False
    try:
        post = request.get_json()
        projId = post.get('projId')
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projId)
        if dbname:
            strSQL = 'DELETE FROM diagnosispush '\
                         'WHERE ProjId = %s' % (projId)
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    except Exception as e:
        print('diagnosisFaultDeleteAllRelated error:' + e.__str__())
        logging.error(e.__str__())
    return json.dumps({'data': rt}, ensure_ascii=False)


# 根据faultID数组，启停诊断
# postData = {
#     "status": True, # 开启：True  关闭：False
#     "arrFaultId": ["123123", "124234"] #diagnosis_faults.Id
#     "projId": 293
# }
# return = True / False
@app.route('/diagnosis/faults/changeStatus', methods=['POST'])
def diagnosisFaultChangeStatus():
    rt = False
    try:
        post = request.get_json()
        arrFaultId = post.get('arrFaultId')
        enable = post.get('status')
        projId = post.get('projId')
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projId)
        if dbname:
            strSQL = 'UPDATE %s_diagnosis_faults SET `Enable` = %s '\
                     'WHERE Id in %s' % (dbname, enable, str(arrFaultId).replace('[', '(').replace(']', ')'))
            rt = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL, ())
    except Exception as e:
        print('diagnosisFaultChangeStatus error:' + e.__str__())
        logging.error(e.__str__())
    return json.dumps({'data': rt}, ensure_ascii=False)


# 根据faultID数组，启停推送
# postData = {
#     "isPush": True, # 开启：True  关闭：False
#     "arrFaultId": ["123123", "124234"] #diagnosis_faults.Id
#     "projId": 293
# }
# return = True / False
@app.route('/diagnosis/faults/pushStatus', methods=['POST'])
def diagnosisFaultPushStatus():
    rt = False
    try:
        post = request.get_json()
        arrFaultId = post.get('arrFaultId')
        enable = post.get('Push')
        projId = post.get('projId')
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projId)
        if dbname:
            strSQL = 'UPDATE %s_diagnosis_faults SET `IsPush` = %s '\
                     'WHERE Id in %s' % (dbname, enable, str(arrFaultId).replace('[', '(').replace(']', ')'))
            rt = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL, ())
    except Exception as e:
        print('diagnosisFaultPushStatus error:' + e.__str__())
        logging.error(e.__str__())
    return json.dumps({'data': rt}, ensure_ascii=False)


# 根据faultID数组，发送推送任务关系
# postData = {
#     "UserIds": 用户id数组
#     "arrFaultId": ["123123", "124234"] #diagnosis_faults.Id
#     "ProjId": 293
# }
# return = True / False
@app.route('/diagnosis/faults/pushRelated', methods=['POST'])
def diagnosisFaultPushRelated():
    rt = False
    try:
        post = request.get_json()
        arrFaultId = post.get('arrFaultId')
        userIds = post.get('UserIds')
        projId = str(post.get('projId'))
        type = str(post.get('type'))
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projId)
        if dbname:
            strSQL = 'SELECT * FROM diagnosispush '\
                     'WHERE Type = %s and FaultId in %s and ProjId = %s' % (type, str(arrFaultId).replace('[', '(').replace(']', ')'), projId)
            dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL)
            if dbrv:
                strSQL = 'DELETE FROM diagnosispush '\
                         'WHERE Type = %s and FaultId in %s and ProjId = %s' % (type, str(arrFaultId).replace('[', '(').replace(']', ')'), projId)
                BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
            strSQL = 'INSERT INTO diagnosispush (`FaultId`, `ProjId`, `Users`, `Type`) VALUES'
            for i in range(len(arrFaultId)):
                userIdsStr = '"'
                for j in range(len(userIds)):
                    userIdsStr += str(userIds[j])
                    if j != len(userIds) - 1:
                        userIdsStr += ','
                    else:
                        userIdsStr += '"'
                strSQL += '(' + str(arrFaultId[i]) + ',' + str(projId) + ',' + userIdsStr + ',' + type + ')'
                if i != len(arrFaultId) - 1:
                    strSQL += ','
            rt = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL, ())
    except Exception as e:
        print('diagnosisFaultPushRelated error:' + e.__str__())
        logging.error(e.__str__())
    return json.dumps({'data': rt}, ensure_ascii=False)


# 根据类型，获取各分类的故障排名，
# 若needDetail为True， 则返回结果增加字段，
# postData = {
#     "arrConsquence": ["Waste Energy", "xxx"], # diagnosis_faults.consquence 字段的内容
#     "startTime": '2017-04-18 00:00:00',
#     "endTime": '2017-04-16 00:00:00',
# }
# return_ = {
#     "data": {
#         "Waste aaaa": [  #postData.arrConsquence中有几个，此处便有几个key
#             {
#                 'Fault':'',
#                 'Equipment':'',
#                 'Desc': '',
#                 'Detail': [     #needDetail特有字段
#                     {
#                         "NoticeId": '',
#                         "Time": '',
#                         "Points": "",   #faults.Points
#                         "Grade": ""    #faults.Grade
#                         "EndTime": ""
#                         "Energy": ""
#                     }
#                 ]
#             }
#         ]
#     },
# }
@app.route('/diagnosis/notice/getRank/<projectId>', methods=['POST'])
@app.route('/diagnosis/notice/getRank/<projectId>/<needDetail>', methods=['POST'])
def getDiagnosisNoticeRank(projectId, needDetail=False):
    rt = {}
    try:
        projectId = int(projectId)
        post = request.get_json()
        arrConsquence = post.get('arrConsquence')
        startTime = post.get('startTime')
        endTime = post.get('endTime')
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        if dbname:
            strSQL = "SELECT f.Consequence, f.`Name`, f.Description, f.Points, "\
                     "f.DefaultGrade, e.`Name`, "\
                     "GROUP_CONCAT(f.Id), SUM(n.Energy * TIMESTAMPDIFF(SECOND,n.Time,CASE WHEN n.EndTime is NULL THEN TIME('%s') ELSE n.EndTime END)) "\
                     "FROM %s_diagnosis_notices AS n "\
                     "LEFT JOIN %s_diagnosis_faults AS f ON n.FaultId = f.Id "\
                     "LEFT JOIN %s_diagnosis_equipments AS e ON e.Id = f.EquipmentId "\
                     "WHERE n.Time <= '%s' AND n.Time >= '%s' "\
                     "AND f.Consequence in %s GROUP BY f.`Name`, e.`Name`"\
                     "ORDER BY f.DefaultGrade DESC, n.Energy DESC, "\
                     "n.Time DESC" % (endTime, dbname, dbname, dbname, endTime, startTime, str(arrConsquence).replace('[', '(').replace(']', ')'))
            dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
            fault_dict = {}
            for item in dbrv:
                faultId_list = list(set(item[6].split(',')))
                if item[0] in rt.keys():
                    rt.get(item[0]).append({'Fault': item[1], 'Equipment': item[5], 'Desc': item[2], 'FaultId': faultId_list, 'Energy': item[7] / (60 * 60)})
                else:
                    rt.update({item[0]: [{'Fault': item[1], 'Equipment': item[5], 'Desc': item[2], 'FaultId': faultId_list, 'Energy': item[7] / (60 * 60)}]})
                for i in faultId_list:
                    fault_dict.update({i: []})
            if needDetail and dbrv:
                strSQL = 'SELECT f.Id, n.Id, n.Time, f.Points, f.DefaultGrade, n.EndTime, n.Energy, '\
                         'TIMESTAMPDIFF(SECOND, n.Time, CASE WHEN n.EndTime is NULL THEN DATE("%s") ELSE n.EndTime END) '\
                         'FROM %s_diagnosis_notices AS n '\
                         'LEFT JOIN %s_diagnosis_faults AS f ON n.FaultId = f.Id '\
                         'WHERE n.Time <= "%s" AND n.Time >= "%s" AND f.Id in %s '\
                         'ORDER BY f.DefaultGrade DESC, n.Energy DESC, '\
                         'n.Time DESC' % (endTime, dbname, dbname, endTime, startTime, str(list(fault_dict.keys())).replace('[', '(').replace(']', ')'))
                dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
                for item in dbrv:
                    fault_dict.get(str(item[0])).append({'NoticeId': item[1], 'Time': item[2].strftime('%Y-%m-%d %H:%M') if item[2] else None,
                                                         'Points': item[3], 'Grade': item[4],
                                                         'EndTime': item[5].strftime('%Y-%m-%d %H:%M') if item[5] else None,
                                                         'Energy': (float(item[6]) * item[7]) / (60 * 60)})
                for key in rt.keys():
                    value = rt.get(key)
                    for v in value:
                        f_list = v.get('FaultId')
                        v.update({'Detail': []})
                        for f in f_list:
                            v.get('Detail').extend(fault_dict.get(f))
    except Exception as e:
        print('getDiagnosisNoticeRank error:' + e.__str__())
        logging.error(e.__str__())
    return json.dumps({'data': rt}, ensure_ascii=False)

@app.route('/diagnosis/makesure', methods=['POST'])
def makeSure_diagnosis_table():
    post_data = request.get_json()
    rt = {'success': []}
    try:
        if post_data:
            projId = post_data.get('projId')
            dbAccess = BEOPDataAccess.getInstance()
            dbname = dbAccess.getProjMysqldb(projId)
            if dbname:
                enable_table_name = '%s_diagnosis_enable' % dbname
                equipments_table_name = '%s_diagnosis_equipments' % dbname
                faults_table_name = '%s_diagnosis_faults' % dbname
                limit_table_name = '%s_diagnosis_limit' % dbname
                notice_table_name = '%s_diagnosis_notices' % dbname
                order_table_name = '%s_diagnosis_order' % dbname
                zones_table_name = '%s_diagnosis_zones' % dbname
                strSQL = 'SHOW TABLES'
                dbrv =dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
                table_list = [x[0] for x in dbrv]
                sql_list = []
                name_list = []
                if enable_table_name not in table_list:
                    sql = get_create_table_sql(enable_table_name, dbname)
                    if sql:
                        dbrv = dbAccess._mysqlDBContainer.op_db_update('diagnosis', sql)
                        if dbrv:
                            rt.get('success').append(enable_table_name)
                if equipments_table_name not in table_list:
                    sql = get_create_table_sql(equipments_table_name, dbname)
                    if sql:
                        dbrv = dbAccess._mysqlDBContainer.op_db_update('diagnosis', sql)
                        if dbrv:
                            rt.get('success').append(equipments_table_name)
                if faults_table_name not in table_list:
                    sql = get_create_table_sql(faults_table_name, dbname)
                    if sql:
                        dbrv = dbAccess._mysqlDBContainer.op_db_update('diagnosis', sql)
                        if dbrv:
                            rt.get('success').append(faults_table_name)
                if limit_table_name not in table_list:
                    sql = get_create_table_sql(limit_table_name, dbname)
                    if sql:
                        dbrv = dbAccess._mysqlDBContainer.op_db_update('diagnosis', sql)
                        if dbrv:
                            rt.get('success').append(limit_table_name)
                if notice_table_name not in table_list:
                    sql = get_create_table_sql(notice_table_name, dbname)
                    if sql:
                        dbrv = dbAccess._mysqlDBContainer.op_db_update('diagnosis', sql)
                        if dbrv:
                            rt.get('success').append(notice_table_name)
                if order_table_name not in table_list:
                    sql = get_create_table_sql(order_table_name, dbname)
                    if sql:
                        dbrv = dbAccess._mysqlDBContainer.op_db_update('diagnosis', sql)
                        if dbrv:
                            rt.get('success').append(order_table_name)
                if zones_table_name not in table_list:
                    sql = get_create_table_sql(zones_table_name, dbname)
                    if sql:
                        dbrv = dbAccess._mysqlDBContainer.op_db_update('diagnosis', sql)
                        if dbrv:
                            rt.get('success').append(order_table_name)
    except Exception as e:
        print('makeSure_diagnosis_table error:' + e.__str__())
        logging.error(e.__str__())
    return json.dumps(rt, ensure_ascii=False)

def get_create_table_sql(tableName, dbname):
    rt = None
    simple_table_name = tableName.replace(dbname, 'beopdata_101')
    dbAccess = BEOPDataAccess.getInstance()
    strSQL = 'SHOW CREATE TABLE %s' % simple_table_name
    dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
    if dbrv:
        simple_SQL = dbrv[0][1]
        rt = simple_SQL.replace(simple_table_name, tableName)
    return rt


@app.route('/diagnosis/noticepush/config/<int:projId>', methods=['POST'])
@app.route('/diagnosis/noticepush/config/<int:projId>/<int:limit>/<int:pagination>', methods=['GET'])
def notice_push_config(projId, limit=None, pagination=None):
    '''
    David 20170503
    method = GET   获取当前项目的所有故障的推送信息
        limit: 分页的数量
        pagination： 当前页数
    method = POST  编辑当前项目的推送故障
        UserIdList 当UserIdList为[]时，删除当前故障的推送配置
        FaultId
    '''
    rt = []
    dbAccess = BEOPDataAccess.getInstance()
    dbname = dbAccess.getProjMysqldb(projId)
    if dbname:
        if request.method == 'GET':
            startlimit = limit * (pagination - 1)
            strSQL = 'SELECT f.Id, f.`Name`, f.Description, f.DefaultGrade, f.IsUserDefined, f.UserFaultGrade, '\
                     'f.Consequence, e.Id, e.`Name`, f.IsPush, d.Users FROM %s_diagnosis_faults AS f '\
                     'LEFT JOIN %s_diagnosis_equipments AS e ON f.EquipmentId = e.Id '\
                     'LEFT JOIN diagnosispush AS d ON f.Id = d.FaultId '\
                     'WHERE e.`Name` IS NOT NULL ORDER BY f.Id LIMIT %s, %s' % (dbname, dbname, startlimit, limit)
            dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
            for item in dbrv:
                try:
                    rt.append({'FaultId': item[0], 'FaultName': item[1], 'Description': item[2], 'Consquence': item[6],
                               'EquipmentId': item[7], 'EquipmentName': item[8], 'isPush': int(item[9]),
                               'PushUsers': [int(i) for i in item[9].split(',')] if item[9] else item[9]})
                except Exception as e:
                    print('notice_push_config GET method error:' + e.__str__(), item)
                    logging.error(e.__str__())
        elif request.method == 'POST':
            post_data = request.get_json()
            UserIdList = post_data.get('UserIdList', [])
            FaultId = post_data.get('FaultId')
            if UserIdList and isinstance(UserIdList, list):
                Users = str(UserIdList)[1:-1]
                strSQL = 'REPLACE diagnosispush(FaultId, ProjId, Users) VALUES(%s, %s, "%s")' % (FaultId, projId, Users)
                strSQL_f = 'UPDATE %s_diagnosis_faults SET IsPush = 1 WHERE Id = %s' % (dbname, FaultId)
            else:
                strSQL = 'DELETE FROM DiagnosisPush WHERE FaultId = %s' % FaultId
                strSQL_f = 'UPDATE %s_diagnosis_faults SET IsPush = 0 WHERE Id = %s' % (dbname, FaultId)
            rt = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL, ())
            if rt:
                rt = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL_f, ())
    return jsonify({'data': rt})
