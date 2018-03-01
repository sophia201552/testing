__author__ = 'David'

import logging
import time
import base64
from datetime import datetime, timedelta
import requests
from bson import ObjectId
from flask import json, jsonify, request
from flask.ext.cors import cross_origin

from mainService import app
from mod_DataAccess.BEOPDataAccess import BEOPDataAccess
from mod_DataAccess.MongoConnManager import MongoConnManager
from mod_DataAccess.RedisManager import RedisManager
from mod_Workflow.StaticRelate import StaticRelate
from mod_MsgQueue.mqServer import RabbitMqWorkQueueSend
from mod_Common.Utils import Utils
from mod_Common.echart.Echart import generate_echart_to_disk


def checkInvalidNoticeEndTime(dbname):
    if dbname is None:
        logging.error('dbname is None!')
        return
    if 'Demo' in dbname:
        return
    sql = '''SELECT FaultId, EndTime, COUNT(*) FROM %s_diagnosis_notices ''' \
          '''WHERE EndTime IS NOT NULL AND EndTime > '2017-12-01' ''' \
          '''GROUP BY FaultId, EndTime HAVING COUNT(*) > 1''' % dbname
    logging.info('Checking invalid notice end time with SQL: %s', sql)
    try:
        result_set = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.op_db_query('diagnosis', sql)
        if len(result_set) > 0:
            logging.error('Invalid notice end times found! %s', result_set)
        else:
            logging.info('[ SUCCESS ] All notice end times are valid!')
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)


@app.route('/diagnosis/notice/add/<projectId>', methods=['POST'])
def addDiagnosisNotice(projectId):
    rv = False
    dbname = None
    try:
        data = request.get_json()
        logging.info('projectId=%s, data=%s', projectId, data)
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        if dbname is None:
            dbname = dbAccess.getProjMysqldbByName(projectId)
        if dbname is not None:
            if data.get('chectTime') is not None:
                strSQL = 'INSERT INTO %s_' % dbname + 'diagnosis_notices (FaultId, Time, OrderId, Energy, Detail, '\
                         '`Status`, Project, CheckTime, Operator) ' \
                         'VALUES(%d,"%s",%d,"%s","%s",%d,"%s","%s",%s)' % \
                         (int(data.get('faultId')) if data.get('faultId')is not None else 0,
                          data.get('time') if data.get('time') is not None else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                          int(data.get('orderId')) if data.get('orderId')is not None else 0,
                          data.get('energy') if data.get('energy') is not None else '',
                          data.get('detail') if data.get('detail') is not None else '',
                          int(data.get('status')) if data.get('status') is not None else 0,
                          data.get('projectId') if data.get('projectId')is not None else '',
                          data.get('chectTime'), data.get('operator') if data.get('operator') is not None else 'NULL')
            else:
                strSQL = 'INSERT INTO %s_' % dbname + 'diagnosis_notices (FaultId, Time, OrderId, Energy, Detail, '\
                         '`Status`, Project, Operator) ' \
                         'VALUES(%d,"%s",%d,"%s","%s",%d,"%s",%s)' % \
                         (int(data.get('faultId')) if data.get('faultId') is not None else 0,
                          data.get('time') if data.get('time') is not None else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                          int(data.get('orderId')) if data.get('orderId') is not None else 0,
                          data.get('energy') if data.get('energy') is not None else '',
                          data.get('detail') if data.get('detail') is not None else '',
                          int(data.get('status')) if data.get('status') is not None else 0,
                          data.get('projectId') if data.get('projectId') is not None else '',
                          data.get('operator') if data.get('operator') is not None else 'NULL')
            rt = dbAccess._mysqlDBContainer.op_db_update_return_id('diagnosis', strSQL, ())
            if rt.get('bSuccess'):
                noticeId_list = []
                noticeId = int(rt.get('id')) if rt.get('id') is not None else 0
                faultId = int(data.get('faultId')) if data.get('faultId') is not None else 0
                nId = get_diagnosis_noticeId_before(dbname, faultId)
                if nId and int(noticeId) != int(nId):
                    noticeId_list.append(nId)
                strSQL = 'update %s_' % dbname + 'diagnosis_faults set NoticeId = %d where Id = %d' % (noticeId, faultId)
                rv = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL, ())
                if noticeId_list:
                    set_diagnosis_notices_endTime(dbname, noticeId_list, projectId)
                # push app message
                push_user_list = is_fault_need_push(int(projectId), int(data.get('faultId')))
                if push_user_list:
                    send_noice_to_app(push_user_list, data, dbname)
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
    finally:
        checkInvalidNoticeEndTime(dbname)
    return json.dumps(rv, ensure_ascii=False)


@app.route('/diagnosis/notice/addMulti/<projectId>', methods=['POST'])
def addDiagnosisNoticeMulti(projectId):
    rv = False
    dbname = None
    try:
        rt = False
        post = request.get_json()
        logging.info('projectId=%s, post=%s', projectId, post)
        dbAccess = BEOPDataAccess.getInstance()
        sqlList = []
        dbname = dbAccess.getProjMysqldb(projectId)
        if dbname is None:
            dbname = dbAccess.getProjMysqldbByName(projectId)
        if dbname is not None:
            insertList = post.get('addList')
            if len(insertList) == 0:
                return json.dumps(True, ensure_ascii=False)
            faultId_list = []
            for data in insertList:
                if data.get('checkTime') is not None:
                    strInsert = 'INSERT INTO  %s_' % dbname + 'diagnosis_notices (FaultId, Time, OrderId, Energy, '\
                                'Detail, `Status`, Project, CheckTime, Operator) VALUES'
                    strValues = "("
                    strValues += "%d,'%s',%d,'%s','%s',%d,'%s','%s',%s" % \
                        (int(data.get('faultId')) if data.get('faultId') is not None else 0,
                         data.get('time') if data.get('time') is not None else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                         int(data.get('orderId')) if data.get('orderId') is not None else 0,
                         data.get('energy') if data.get('energy') is not None else '',
                         data.get('detail') if data.get('detail') is not None else '',
                         int(data.get('status')) if data.get('status') is not None else 0,
                         data.get('project') if data.get('project') is not None else '',
                         data.get('checkTime'), data.get('operator') if data.get('operator') is not None else 'NULL')
                    strValues += ")"
                    strInsert += strValues
                    strInsert += " ON DUPLICATE KEY UPDATE "
                    strSet = "FaultId=%d, Time='%s', OrderId=%d, Energy='%s', Detail='%s', `Status`=%d, Project='%s', "\
                             "CheckTime='%s', Operator=%s" %\
                        (int(data.get('faultId')) if data.get('faultId') is not None else 0,
                         data.get('time') if data.get('time') is not None else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                         int(data.get('orderId')) if data.get('orderId') is not None else 0,
                         data.get('energy') if data.get('energy') is not None else '',
                         data.get('detail') if data.get('detail') is not None else '',
                         int(data.get('status')) if data.get('status') is not None else 0,
                         data.get('project') if data.get('project') is not None else '',
                         data.get('checkTime') if data.get('checkTime') is not None else 'NULL',
                         data.get('operator') if int(data.get('operator')) is not None else 'NULL')
                    strInsert += strSet
                else:
                    strInsert = 'INSERT INTO  %s_' % dbname + 'diagnosis_notices (FaultId, Time, OrderId, Energy, '\
                                'Detail, `Status`, Project, Operator) VALUES'
                    strValues = "("
                    strValues += "%d,'%s',%d,'%s','%s',%d,'%s',%s" % \
                        (int(data.get('faultId')) if data.get('faultId') is not None else 0,
                         data.get('time') if data.get('time') is not None else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                         int(data.get('orderId')) if data.get('orderId') is not None else 0,
                         data.get('energy') if data.get('energy') is not None else '',
                         data.get('detail') if data.get('detail') is not None else '',
                         int(data.get('status')) if data.get('status') is not None else 0,
                         data.get('project') if data.get('project') is not None else '',
                         int(data.get('operator')) if data.get('operator') is not None else 'NULL')
                    strValues += ")"
                    strInsert += strValues
                    strInsert += " ON DUPLICATE KEY UPDATE "
                    strSet = "FaultId=%d, Time='%s', OrderId=%d, Energy='%s', Detail='%s', `Status`=%d, "\
                             "Project='%s', Operator=%s" % \
                        (int(data.get('faultId')) if data.get('faultId') is not None else 0,
                         data.get('time') if data.get('time') is not None else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                         int(data.get('orderId')) if data.get('orderId') is not None else 0,
                         data.get('energy') if data.get('energy') is not None else '',
                         data.get('detail') if data.get('detail') is not None else '',
                         int(data.get('status')) if data.get('status') is not None else 0,
                         data.get('project') if data.get('project') is not None else '',
                         int(data.get('operator')) if data.get('operator') is not None else 'NULL')
                    strInsert += strSet
                sqlList.append(strInsert)
                faultId_list.append(int(data.get('faultId')))
            rt = dbAccess._mysqlDBContainer.op_db_update_by_transaction_return_id('diagnosis', sqlList)
            if rt.get('bSuccess'):
                sqlList = []
                noticeId_list = []
                for index, data in enumerate(insertList):
                    faultId = int(data.get('faultId')) if data.get('faultId') is not None else 0
                    nId = get_diagnosis_noticeId_before(dbname, faultId)
                    noticeId = int(rt.get('id')[index]) if rt.get('id')[index] is not None else 0
                    if nId and int(noticeId) != int(nId):
                        noticeId_list.append(nId)
                    strUpdate = 'update %s_' % dbname + 'diagnosis_faults set NoticeId = %d '\
                                'where Id = %d' % (noticeId, faultId)
                    sqlList.append(strUpdate)
                    ###### push app message ######
                    push_user_list = is_fault_need_push(int(projectId), int(data.get('faultId')))
                    if push_user_list:
                        send_noice_to_app(push_user_list, data, dbname)
                    ###### push app message ######
                rv = dbAccess._mysqlDBContainer.op_db_update_by_transaction('diagnosis', sqlList)
                if noticeId_list:
                    set_diagnosis_notices_endTime(dbname, noticeId_list, projectId)
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    finally:
        checkInvalidNoticeEndTime(dbname)
    return json.dumps(rv, ensure_ascii=False)


@app.route('/diagnosis/fault/updateNoticeId/<projectId>', methods=['POST'])
def updatefaultNoticeId(projectId):
    """
    { "postdata": { "<FaultId1>: <int>, "<FaultId2>": <int> } }
    :param projectId:
    :return:
    """
    rt = False
    dbname = None
    try:
        projectId = int(projectId)
        post = request.get_json()
        logging.info('projectid=%s, post=%s', projectId, post)
        data = post.get('postdata')
        updateList = []
        dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
        if dbname is not None:
            noticeId_list = []
            for item in data.keys():
                # item is fault ID
                nId = get_diagnosis_noticeId_before(dbname, item)
                noticeId = int(data.get(item)) if data.get(item) is not None else 0
                if nId and int(noticeId) != int(nId):
                    noticeId_list.append(nId)
                strSQL = 'update %s_' % dbname + 'diagnosis_faults '\
                         'set NoticeId = %d where Id = %d' % (noticeId, int(item))
                updateList.append(strSQL)
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update_by_transaction('diagnosis', updateList)
            if noticeId_list:
                set_diagnosis_notices_endTime(dbname, noticeId_list, projectId)
        else:
            raise Exception("Failed to get dbname from projectId %s" % projectId)
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    finally:
        checkInvalidNoticeEndTime(dbname)
    return json.dumps(rt, ensure_ascii=False)


def get_diagnosis_noticeId_before(dbname, faultId):
    rt = None
    try:
        strSQL = 'SELECT NoticeId FROM %s_diagnosis_faults WHERE Id = %s' % (dbname, faultId)
        dbrv = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL)
        if dbrv:
            rt = dbrv[0][0]
        else:
            raise Exception("Nothing returned from MySQL!")
    except Exception:
        logging.error("Unhandled exception! Locals: %s", locals(), exc_info=True, stack_info=True)
    return rt


def set_diagnosis_notices_endTime(dbname, noticeId_list, projId):
    rt = False
    try:
        endTime = get_projLocal_time(projId)
        if endTime:
            endTime = endTime.strftime('%Y-%m-%d %H:%M:%S')
        noticeId_list = str(noticeId_list).replace('[', '(').replace(']', ')')
        strSQL = 'UPDATE %s_diagnosis_notices SET EndTime = "%s", `Status` = 10 WHERE Id in %s' % (dbname, endTime, noticeId_list)
        rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL, ())
    except Exception:
        logging.error("Unhandled exception! Locals: %s", locals(), exc_info=True, stack_info=True)
    return rt


def set_previous_diagnosis_notices_endTime(dbname, noticeId_list, projId):
    rt = False
    try:
        noticeId_list = str(noticeId_list).replace('[', '(').replace(']', ')')
        strSQL = 'UPDATE %s_diagnosis_notices SET EndTime = DATE_ADD(`Time`, INTERVAL 1 HOUR), `Status` = 10 WHERE Id in %s' % (dbname, noticeId_list)
        rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL, ())
    except Exception:
        logging.error("Unhandled exception! Locals: %s", locals(), exc_info=True, stack_info=True)
    return rt


def get_realTime_by_time_zone(dbname):
    rt = None
    try:
        strSQL = 'SELECT time from rtdata_%s ORDER BY time DESC' % dbname
        dbrv = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.op_db_query_one(app.config.get('DATABASE'), strSQL, ())
        if dbrv:
            rt = dbrv[0]
        if isinstance(rt, datetime):
            rt = rt.strftime('%Y-%m-%d %H:%M:%S')
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return rt


@app.route('/diagnosis/notice/get/<projectId>')
def getDiagnosisNotices(projectId):
    try:
        data = []
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        if (dbname is None):
            dbname = dbAccess.getProjMysqldbByName(projectId)
        if dbname is not None:
            now_time_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            hours72_before_now = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d %H:%M:%S')
            strSQL = 'SELECT * FROM (SELECT ID,FaultId,Time,OrderId,Energy,Detail,Status,Project,CheckTime,Operator '\
                     'FROM  %s_' % dbname + 'diagnosis_notices WHERE Status > 0 '\
                     'and Time>="%s" and Time<="%s"' % (hours72_before_now, now_time_str) + ' ORDER BY Time desc) '\
                     'as t GROUP BY FaultId ORDER BY Time desc'
            rv = dbAccess._mysqlDBContainer.op_db_query('diagnosis', strSQL, ())
            data = [{'id': x[0], 'faultId': x[1],
                     'time': x[2].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[2], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                     'orderId': x[3], 'energy': x[4], 'detail': x[5], 'status':x[6], 'project':x[7],
                     'checkTime':x[8], 'operator':x[9]} for x in rv]
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(data, ensure_ascii=False)


# Get all notices
@app.route('/diagnosis/notice/getAll/<projectId>')
def getDiagnosisAllNotices(projectId):
    try:
        data = []
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        if (dbname is None):
            dbname = dbAccess.getProjMysqldbByName(projectId)
        if dbname is not None:
            strSQL = 'SELECT ID,FaultId,Time,OrderId,Energy,Detail,Status,Project, CheckTime, Operator '\
                     'FROM  %s_' % dbname + 'diagnosis_notices ORDER BY Time desc'
            rv = dbAccess._mysqlDBContainer.op_db_query('diagnosis', strSQL, ())
            data = [{'id': x[0], 'faultId': x[1],
                     'time': x[2].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[2], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                     'orderId': x[3], 'energy':x[4], 'detail':x[5], 'status':x[6], 'project':x[7],
                     'checkTime':x[8], 'operator':x[9]} for x in rv]
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(data, ensure_ascii=False)


@app.route('/diagnosis/fault/add/<projectId>', methods=['POST'])
def addFault(projectId):
    try:
        rt = False
        data = request.get_json()
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        if (dbname is None):
            dbname = dbAccess.getProjMysqldbByName(projectId)
        if dbname is not None:
            strSQL = 'INSERT INTO  %s_' % dbname + 'diagnosis_faults (Id,ParentId,`Name`,Description,Points,'\
                     'EquipmentId,DefaultGrade,IsUserDefined,UserId,UserFaultGrade,UserFaultDelay,UserModifyTime,'\
                     'UserEnable,Project,NoticeId,TargetGroup, TargetExecutor, FaultType,'\
                     'RunTimeDay, RunTimeWeek, RunTimeMonth, RunTimeYear, Unit, RunMode)'\
                     'VALUES(%d,%d,"%s","%s","%s",%d,%d,%d,%d,%d,"%s",NOW(),%d,"%s",%d, "%s", "%s", '\
                     '%f, "%s", "%s", "%s", "%s", "%s", "%s")' % \
                     (int(data.get('id')) if data.get('id') is not None else 0,
                      int(data.get('parentId')) if data.get('parentId') is not None else 0,
                      data.get('name') if data.get('name') is not None else '',
                      data.get('description') if data.get('description') is not None else '',
                      data.get('points') if data.get('points') is not None else '',
                      int(data.get('equipmentId')) if data.get('equipmentId') is not None else 0,
                      int(data.get('defaultGrade')) if data.get('defaultGrade') is not None else 0,
                      int(data.get('isUserDefined')) if data.get('isUserDefined') is not None else 0,
                      int(data.get('userId')) if data.get('userId') is not None else 0,
                      int(data.get('userFaultGrade')) if data.get('userFaultGrade') is not None else 0,
                      data.get('userFaultDelay') if data.get('userFaultDelay') is not None else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                      int(data.get('userEnable')) if data.get('userEnable') is not None else 0,
                      data.get('project') if data.get('project') is not None else '',
                      int(data.get('noticeId')) if data.get('noticeId') is not None else 0,
                      int(data.get('targetGroup')) if data.get('targetGroup') is not None else None,
                      int(data.get('targetExecutor')) if data.get('targetExecutor') is not None else None,
                      float(data.get('faultType')) if data.get('faultType') is not None else 0,
                      int(data.get('runTimeDay')) if data.get('runTimeDay') is not None else None,
                      int(data.get('runTimeWeek')) if data.get('runTimeWeek') is not None else None,
                      int(data.get('runTimeMonth')) if data.get('runTimeMonth') is not None else None,
                      int(data.get('runTimeYear')) if data.get('runTimeYear') is not None else None,
                      data.get('unit'), data.get('runMode'))
            rt = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL, ())
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/diagnosis/fault/addMulti/<projectId>', methods=['POST'])
def addFaultMulti(projectId):
    try:
        rt = False
        post = request.get_json()
        insertList = post.get('addList')
        sqlList = []
        if int(projectId) <= 0:
            strErr = 'diagnosis/fault/addMulti request recved(from %s), '\
                     'but projectId is wrong(%s) in request' % (request.remote_addr, projectId,)
            print(strErr)
            app.logger.error(strErr)
            return json.dumps(dict(state=0, message='projectId must >0'), ensure_ascii=False)
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        if (dbname is None):
            dbname = dbAccess.getProjMysqldbByName(projectId)
        if dbname is not None:
            if len(insertList) == 0:
                return json.dumps(True, ensure_ascii=False)
            for data in insertList:
                strInsert = 'INSERT INTO  %s_' % dbname + 'diagnosis_faults (Id,ParentId,`Name`,'\
                            'Description,Points,EquipmentId,DefaultGrade,IsUserDefined,UserId,'\
                            'UserFaultGrade,UserFaultDelay,UserModifyTime,UserEnable,'\
                            'Project,NoticeId, TargetGroup, TargetExecutor, FaultType, RunTimeDay, RunTimeWeek, '\
                            'RunTimeMonth, RunTimeYear, Unit, RunMode) VALUES'
                strValues = "("
                strValues += "%d, %d,'%s','%s','%s',%d, %d, %d, %d, %d,'%s',NOW(),%d,'%s',%d, '%s', '%s', %f, "\
                             "'%s', '%s', '%s', '%s', '%s', '%s'" % \
                             (int(data.get('id')) if data.get('id') is not None else 0,
                              int(data.get('parentId')) if data.get('parentId') is not None else 0,
                              data.get('name') if data.get('name') is not None else '',
                              data.get('description') if data.get('description') is not None else '',
                              data.get('points') if data.get('points') is not None else '',
                              int(data.get('equipmentId')) if data.get('equipmentId') is not None else 0,
                              int(data.get('defaultGrade')) if data.get('defaultGrade') is not None else 0,
                              int(data.get('isUserDefined')) if data.get('isUserDefined') is not None else 0,
                              int(data.get('userId')) if data.get('userId') is not None else 0,
                              int(data.get('userFaultGrade')) if data.get('userFaultGrade') is not None else 0,
                              data.get('userFaultDelay') if data.get('userFaultDelay') is not None else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                              int(data.get('userEnable')) if data.get('userEnable') is not None else 0,
                              data.get('project') if data.get('project') is not None else '',
                              int(data.get('noticeId')) if data.get('noticeId') is not None else 0,
                              int(data.get('targetGroup')) if data.get('targetGroup') is not None else None,
                              int(data.get('targetExecutor')) if data.get('targetExecutor') is not None else None,
                              float(data.get('faultType')) if data.get('faultType') is not None else 0,
                              int(data.get('runTimeDay')) if data.get('runTimeDay') is not None else None,
                              int(data.get('runTimeWeek')) if data.get('runTimeWeek') is not None else None,
                              int(data.get('runTimeMonth')) if data.get('runTimeMonth') is not None else None,
                              int(data.get('runTimeYear')) if data.get('runTimeYear') is not None else None,
                              data.get('unit'), data.get('runMode'))
                strValues += ")"
                strInsert += strValues
                strInsert += " ON DUPLICATE KEY UPDATE "
                strSet = "ParentId=%d,`Name`='%s',Description='%s',Points='%s',EquipmentId=%d,DefaultGrade=%d,IsUserDefined=%d,UserId=%d,UserFaultGrade=%d," \
                         "UserFaultDelay='%s',UserModifyTime=NOW(),UserEnable=%d,Project='%s',NoticeId=%d, TargetGroup=%d, TargetExecutor=%d, FaultType=%f," \
                         "RunTimeDay='%s', RunTimeWeek='%s', RunTimeMonth='%s', RunTimeYear='%s', Unit='%s', RunMode='%s'" % \
                         (int(data.get('parentId')) if data.get('parentId') is not None else 0,data.get('name') if data.get('name') is not None else '',
                         data.get('description') if data.get('description') is not None else '',data.get('points') if data.get('points') is not None else '',
                         int(data.get('equipmentId')) if data.get('equipmentId') is not None else 0,int(data.get('defaultGrade')) if data.get('defaultGrade') is not None else 0,
                         int(data.get('isUserDefined')) if data.get('isUserDefined') is not None else 0,int(data.get('userId')) if data.get('userId') is not None else 0,
                         int(data.get('userFaultGrade')) if data.get('userFaultGrade') is not None else 0,data.get('userFaultDelay') if data.get('userFaultDelay') is not None else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                         int(data.get('userEnable')) if data.get('userEnable') is not None else 0,data.get('project') if data.get('project') is not None else '',
                         int(data.get('noticeId')) if data.get('noticeId') is not None else 0, int(data.get('targetGroup')) if data.get('targetGroup') is not None else None,
                         int(data.get('targetExecutor')) if data.get('targetExecutor') is not None else None, float(data.get('faultType')) if data.get('faultType') is not None else 0,
                         int(data.get('runTimeDay')) if data.get('runTimeDay') is not None else None, int(data.get('runTimeWeek')) if data.get('runTimeWeek') is not None else None,
                         int(data.get('runTimeMonth')) if data.get('runTimeMonth') is not None else None, int(data.get('runTimeYear')) if data.get('runTimeYear') is not None else None,
                         data.get('unit'), data.get('runMode'))
                strInsert += strSet
                sqlList.append(strInsert)
            rt = dbAccess._mysqlDBContainer.op_db_update_by_transaction('diagnosis', sqlList)
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(rt, ensure_ascii=False)

@app.route('/diagnosis/fault/get/<projectId>')
@app.route('/diagnosis/fault/get/<projectId>/<limit>')
@app.route('/diagnosis/fault/get/<projectId>/<limit>/<num>')
def getFaults(projectId, limit = 0, num=0):
    try:
        data = []
        try:
            limit = int(limit)
            num = int(num)
        except Exception as e:
            limit = 0
            num = 0
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        if (dbname is None):
            dbname = dbAccess.getProjMysqldbByName(projectId)
        if dbname is not None:
            if limit == 0:
                strSQL = 'SELECT a.Id,ParentId,`Name`,Description,Points,EquipmentId,DefaultGrade,IsUserDefined,UserId,' \
                         'b.username,UserFaultGrade,UserFaultDelay,UserModifyTime,UserEnable,Project,NoticeId,TargetGroup,'\
                         'TargetExecutor, FaultType, RunTimeDay, RunTimeWeek, RunTimeMonth, RunTimeYear, Unit, RunMode ' \
                         'FROM  %s_'%dbname +'diagnosis_faults as a LEFT JOIN beopdoengine.`user` as b on a.UserId = b.id'
            elif limit > 0:
                if num == 0:
                    strSQL = 'SELECT a.Id,ParentId,`Name`,Description,Points,EquipmentId,DefaultGrade,IsUserDefined,UserId,' \
                             'b.username,UserFaultGrade,UserFaultDelay,UserModifyTime,UserEnable,Project,NoticeId,TargetGroup,'\
                             'TargetExecutor, FaultType, RunTimeDay, RunTimeWeek, RunTimeMonth, RunTimeYear, Unit, RunMode ' \
                             'FROM  %s_'%dbname +'diagnosis_faults as a LEFT JOIN beopdoengine.`user` as b on a.UserId = b.id LIMIT %d'%int(limit)
                elif num > 0:
                    limit_1 = limit * (num - 1)
                    strSQL = 'SELECT a.Id,ParentId,`Name`,Description,Points,EquipmentId,DefaultGrade,IsUserDefined,UserId,' \
                             'b.username,UserFaultGrade,UserFaultDelay,UserModifyTime,UserEnable,Project,NoticeId,TargetGroup,'\
                             'TargetExecutor, FaultType, RunTimeDay, RunTimeWeek, RunTimeMonth, RunTimeYear, Unit, RunMode ' \
                             'FROM  %s_'%dbname +'diagnosis_faults as a LEFT JOIN beopdoengine.`user` as b on a.UserId = b.id LIMIT %d, %d'%(limit_1, limit)
            rv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
            data = [{ 'id': x[0], 'parentId': x[1], 'name': x[2], 'description': x[3], 'points':x[4], 'equipmentId': x[5],
                    'defaultGrade': x[6], 'isUserDefined': x[7], 'userId': x[8], 'userName': x[9], 'userFaultGrade': x[10],
                    'userFaultDelay': x[11].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[11], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    'userModifyTime': x[12].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[12], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    'userEnable':x[13], 'project':x[14], 'noticeId':x[15], 'TargetGroup': x[16], 'TargetExecutor': x[17], 'FaultType':x[18],
                    'RunTimeDay': x[19], 'RunTimeWeek': x[20], 'RunTimeMonth': x[21], 'RunTimeYear': x[22], 'Unit': x[23], 'RunMode': x[24]} for x in rv]
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(data, ensure_ascii=False)


@app.route('/diagnosis/fault/getInNotices/<projectId>')
def getFaultsInNotices(projectId):
    try:
        data = []
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        if (dbname is None):
            dbname = dbAccess.getProjMysqldbByName(projectId)
        if dbname is not None:
            strSQL = 'SELECT Id,ParentId,`Name`,Description,Points,EquipmentId,DefaultGrade,IsUserDefined,UserId,UserFaultGrade,UserFaultDelay,UserModifyTime,UserEnable,Project\
                    FROM  %s_'%dbname +'diagnosis_faults WHERE Id IN (SELECT FaultId FROM  %s_'%dbname +'diagnosis_notices)'
            rv = dbAccess._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
            data = [{ 'id': x[0], 'parentId': x[1], 'name': x[2], 'description': x[3], 'points':x[4], 'equipmentId': x[5],
                    'defaultGrade': x[6], 'isUserDefined': x[7], 'userId': x[8], 'userFaultGrade': x[9],
                    'userFaultDelay':x[10].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[10], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    'userModifyTime': x[11].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[11], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    'userEnable':x[12], 'project':x[13] } for x in rv]
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(data, ensure_ascii=False)


@app.route('/diagnosis/equipment/get/<projectId>')
def getEquipments(projectId):
    try:
        data = []
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        if (dbname is None):
            dbname = dbAccess.getProjMysqldbByName(projectId)
        if dbname is not None:
            strSQL = 'SELECT Id, `Name`, PageId, ZoneId, SystemId, SubSystemId, SystemName, SubSystemName, Project, ModalTextId FROM  %s_'%dbname +'diagnosis_equipments'
            rv = dbAccess._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
            data = [{ 'id': x[0], 'name': x[1], 'pageId': x[2], 'zoneId': x[3], 'systemId': x[4], 'subSystemId': x[5],
                    'systemName': x[6], 'subSystemName': x[7], 'project':x[8], 'modalTextId':x[9] } for x in rv]
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(data, ensure_ascii=False)


@app.route('/diagnosis/zone/get/<projectId>')
def getZones(projectId):
    data = []
    try:
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        if (dbname is None):
            dbname = dbAccess.getProjMysqldbByName(projectId)
        if dbname is not None:
            strSQL = 'SELECT Id, PageId, CampusId, BuildingId, SubBuildingId, CampusName, BuildingName, SubBuildingName, Image, Project, `Count` FROM  %s_'%dbname +'diagnosis_zones ORDER BY `Count`'
            rv = dbAccess._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
            data = [{ 'id': x[0], 'pageId': x[1], 'campusId': x[2], 'buildingId': x[3], 'subBuildingId': x[4],
                         'campusName': x[5], 'buildingName': x[6], 'subBuildingName': x[7], 'image': x[8], 'project':x[9], 'Count':x[10]} for x in rv]
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(data, ensure_ascii=False)


def readDiagnosisAllInfo(projectId):
    try:
        dataAll = {}
        dataZones = []

        memDiagnosisUpdateeLastValue =  RedisManager.get_diagnosis_lastupdated_time(projectId)

        if  memDiagnosisUpdateeLastValue is not None:
            tDelta = time.time() - memDiagnosisUpdateeLastValue
            if tDelta < 60.0:
                memZonesData =  RedisManager.get_diagnosis_zones(projectId)
                memEquipmentsData = RedisManager.get_diagnosis_equipments(projectId)
                memFaultsData = RedisManager.get_diagnosis_faults(projectId)
                memNoticesData = RedisManager.get_diagnosis_notices(projectId)
                if memZonesData is not None and memEquipmentsData  is not None and memFaultsData is not None and memNoticesData is not None:
                    return dict(zones=memZonesData, equipments=memEquipmentsData, faults = memFaultsData, notices = memNoticesData)

        tCodeStart = time.time()
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        if (dbname is None):
            dbname = dbAccess.getProjMysqldbByName(projectId)

        if dbname is not None:
            memZonesData = RedisManager.get_diagnosis_zones(projectId)
            if memZonesData is None:
                strSQL = 'SELECT Id, PageId, CampusId, BuildingId, SubBuildingId, CampusName, BuildingName, SubBuildingName, Image, Project, `Count` FROM  %s_'%dbname +'diagnosis_zones ORDER BY `Count`'
                rv = dbAccess._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
                dataZones = [{ 'id': x[0], 'pageId': x[1], 'campusId': x[2], 'buildingId': x[3], 'subBuildingId': x[4],
                         'campusName': x[5], 'buildingName': x[6], 'subBuildingName': x[7], 'image': x[8], 'project':x[9], 'Count':x[10]} for x in rv]
                RedisManager.set_diagnosis_zones(projectId, dataZones)
            else:
                dataZones = memZonesData

            memEquipmentsData = RedisManager.get_diagnosis_equipments(projectId)
            if memEquipmentsData is None:
                strSQL = 'SELECT Id, `Name`, PageId, ZoneId, SystemId, SubSystemId, SystemName, SubSystemName, Project, ModalTextId FROM  %s_'%dbname +'diagnosis_equipments'
                rv = dbAccess._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
                dataEquipments = [{ 'id': x[0], 'name': x[1], 'pageId': x[2], 'zoneId': x[3], 'systemId': x[4], 'subSystemId': x[5],
                    'systemName': x[6], 'subSystemName': x[7], 'project':x[8], 'modalTextId':x[9] } for x in rv]
                RedisManager.set_diagnosis_equipments(projectId , dataEquipments)
            else:
                dataEquipments = memEquipmentsData

            strSQL = 'SELECT a.Id,ParentId,`Name`,Description,Points,EquipmentId,DefaultGrade,IsUserDefined,UserId,b.username,UserFaultGrade,UserFaultDelay,UserModifyTime,UserEnable,Project,NoticeId\
                             FROM  %s_'%dbname +'diagnosis_faults as a LEFT JOIN beopdoengine.`user` as b on a.UserId = b.id where NoticeId <> 0'
            rv = dbAccess._mysqlDBContainer.op_db_query('diagnosis', strSQL, ())
            dataFaults = [{ 'id': x[0], 'parentId': x[1], 'name': x[2], 'description': x[3], 'points':x[4], 'equipmentId': x[5],
                    'defaultGrade': x[6], 'isUserDefined': x[7], 'userId': x[8], 'userName': x[9], 'userFaultGrade': x[10],
                    'userFaultDelay': x[11].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[11], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    'userModifyTime': x[12].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[12], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    'userEnable':x[13], 'project':x[14], 'noticeId':x[15] } for x in rv]
            RedisManager.set_diagnosis_faults(projectId, dataFaults)

            now_time_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            hours72_before_now = (datetime.now()-timedelta(days=1)).strftime('%Y-%m-%d %H:%M:%S')
            strSQL = 'SELECT ID,FaultId,Time,OrderId,Energy,Detail,Status,Project, CheckTime, Operator FROM  %s_'%dbname \
                     +'diagnosis_notices WHERE Status = 1 and ID in "%s" and Time>="%s" and Time<="%s"'%(tuple(dataFaults[x]['noticeId'] for x in range(len(dataFaults))), hours72_before_now, now_time_str)\
                     +' ORDER BY Time desc'
            rv = dbAccess._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
            dataNotices = [{ 'id': x[0], 'faultId': x[1], 'time': x[2].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[2], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
              'orderId': x[3], 'energy': x[4], 'detail': x[5], 'status':x[6], 'project':x[7], 'checkTime':[8], 'operator':x['9']} for x in rv]
            RedisManager.set_diagnosis_notices(projectId, dataNotices)

        RedisManager.set_diagnosis_lastupdated_time(projectId, time.time())
        dataAll = dict(zones=dataZones, equipments=dataEquipments, faults = dataFaults, notices = dataNotices)
        tCodeEnd  = time.time()
        print('diagnosis/getAll cost time: ' + str(round(tCodeEnd-tCodeStart,1)) +' seconds')
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return dataAll


@app.route('/diagnosis/getAll/EquipmentsAndZones/<projectId>')
def getEquipmentsAndZones(projectId):
    dataZones=[]
    dataEquipments = []
    try:
        memDiagnosisUpdateeLastValue = RedisManager.get_diagnosis_lastupdated_time(projectId)

        if memDiagnosisUpdateeLastValue is not None:
            tDelta = time.time() - memDiagnosisUpdateeLastValue
            if False:
                memZonesData = RedisManager.get_diagnosis_zones(projectId)
                memEquipmentsData = RedisManager.get_diagnosis_equipments(projectId)
                if memZonesData is not None and memEquipmentsData  is not None:
                    dataZones = memZonesData
                    dataEquipments = memEquipmentsData
            else:
                dbAccess = BEOPDataAccess.getInstance()
                dbname = dbAccess.getProjMysqldb(projectId)
                if (dbname is None):
                    dbname = dbAccess.getProjMysqldbByName(projectId)
                if dbname is not None:
                    dbAccess.createTableDiagnosisZonesIfNotExist(dbname +'_diagnosis_zones')
                    strSQL = 'SELECT Id, PageId, CampusId, BuildingId, SubBuildingId, CampusName, BuildingName, SubBuildingName, Image, Project, Count FROM  %s_'%dbname +'diagnosis_zones ORDER BY Count'
                    rv = dbAccess._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
                    dataZones = [{ 'id': x[0], 'pageId': x[1], 'campusId': x[2], 'buildingId': x[3], 'subBuildingId': x[4],
                                   'campusName': x[5], 'buildingName': x[6], 'subBuildingName': x[7], 'image': x[8], 'project':x[9], 'count':x[10] } for x in rv]
                    dbAccess.createTableDiagnosisEquipmentsIfNotExist(dbname +'_diagnosis_equipments')
                    strSQL = 'SELECT Id, `Name`, PageId, ZoneId, SystemId, SubSystemId, SystemName, SubSystemName, Project, ModalTextId FROM  %s_'%dbname +'diagnosis_equipments'
                    rv = dbAccess._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
                    dataEquipments = [{ 'id': x[0], 'name': x[1], 'pageId': x[2], 'zoneId': x[3], 'systemId': x[4], 'subSystemId': x[5],
                                        'systemName': x[6], 'subSystemName': x[7], 'project':x[8], 'modalTextId':x[9] } for x in rv]
                    RedisManager.set_diagnosis_zones(projectId, dataZones)
                    RedisManager.set_diagnosis_equipments(projectId, dataEquipments)
                    RedisManager.set_diagnosis_lastupdated_time(projectId, time.time())
        else:
            RedisManager.set_diagnosis_lastupdated_time(projectId, 0)
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps({'zones':dataZones,'equipments':dataEquipments}, ensure_ascii=False)


@app.route('/diagnosis/updateZoneFaultCount/<projectId>', methods=['POST'])
def updateZoneFaultCount(projectId):
    rv = {'state':0}
    try:
        strsql = ''
        data = request.get_json()
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        if (dbname is None):
            dbname = dbAccess.getProjMysqldbByName(projectId)
        if dbname is not None:
            dbAccess.createTableDiagnosisZonesIfNotExist(dbname+'_diagnosis_zones')
            #strsql='replace into %s_diagnosis_zones'%dbname + '(Id, Count) values'
            #for zoneId in data.keys():
            #    strsql += '(%d, %d),'%( int(zoneId), int(data.get(zoneId)))
            #strsql = strsql[:-1]
            strsql = 'UPDATE %s_diagnosis_zones'%dbname + ' set Count = %s where Id = %s'
            parameter = [(data.get(zoneId), zoneId) for zoneId in data.keys()]
            bSuccess = dbAccess._mysqlDBContainer.op_db_update_many('diagnosis', strsql, parameter)
            if bSuccess:
                rv.update({'state':1})
            else:
                rv.update({'state':0, 'info':'manipulating database failed'})
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(rv, ensure_ascii=False)


@app.route('/diagnosis/getAll/NoticesAndFaults/<projectId>')
def getNoticesAndFaults(projectId):
    dataFaults = []
    dataNotices = []
    try:
        memDiagnosisUpdateeLastValue = RedisManager.get_diagnosis_lastupdated_time(projectId)

        if memDiagnosisUpdateeLastValue is not None:
            tDelta = time.time() - memDiagnosisUpdateeLastValue
            if tDelta < 60.0:
                memFaultsData = RedisManager.get_diagnosis_faults(projectId)
                memNoticesData = RedisManager.get_diagnosis_notices(projectId)
                if memFaultsData is not None and memNoticesData is not None:
                    dataFaults = memFaultsData
                    dataNotices = memNoticesData
            else:
                dbAccess = BEOPDataAccess.getInstance()
                dbname = dbAccess.getProjMysqldb(projectId)
                if (dbname is None):
                    dbname = dbAccess.getProjMysqldbByName(projectId)
                if dbname is not None:
                    strSQL = 'SELECT n.Id,n.FaultId,n.Time,n.OrderId,n.Energy,n.Detail,n.Status,n.Project,n.CheckTime,n.Operator,' \
                             'f.Id,f.ParentId,f.Name,f.Description,f.Points,f.EquipmentId,f.DefaultGrade,f.IsUserDefined,f.UserId,'\
                             'f.UserFaultGrade,f.UserFaultDelay,f.UserModifyTime,f.UserEnable,f.Project,f.NoticeId,f.TargetGroup,'\
                             'f.TargetExecutor, f.FaultType, f.RunTimeDay, f.RunTimeWeek, f.RunTimeMonth, f.RunTimeYear, f.Unit, f.RunMode ' \
                             'FROM %s_'%dbname +'diagnosis_notices AS n, %s_'%dbname +'diagnosis_faults AS f ' \
                             'where f.NoticeId=n.Id and f.NoticeId <> 0 and n.Status = 1 ORDER BY Time desc'
                    rv = dbAccess._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
                    dataNotices = []
                    dataFaults = []
                    for x in rv:
                        dataNotices.append({'id': x[0], 'faultId': x[1],
                                            'time': x[2].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[2], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                                            'orderId': x[3], 'energy': x[4], 'detail': x[5], 'status':x[6], 'project':x[7], 'checkTime':[8], 'operator':x[9]})
                        dataFaults.append({'id': x[10], 'parentId': x[11], 'name': x[12], 'description': x[13], 'points':x[14], 'equipmentId': x[15],
                                           'defaultGrade': x[16], 'isUserDefined': x[17], 'userId': x[18], 'userFaultGrade': x[19],
                                           'userFaultDelay': x[20].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[20], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                                           'userModifyTime': x[21].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[21], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                                           'userEnable':x[22], 'project':x[23], 'noticeId':x[24], 'TargetGroup':x[25], 'TargetExecutor':x[26], 'FaultType':x[27],
                                           'RunTimeDay':x[28], 'RunTimeWeek':x[29], 'RunTimeMonth': x[30], 'RunTimeYear': x[31], 'Unit': x[32], 'RunMode': x[33]})
                    RedisManager.set_diagnosis_faults(projectId, dataFaults)
                    RedisManager.set_diagnosis_notices(projectId, dataNotices)
                    RedisManager.set_diagnosis_lastupdated_time(projectId, time.time())
        else:
            RedisManager.set_diagnosis_lastupdated_time(projectId, time.time())
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps({'faults':dataFaults,'notices':dataNotices}, ensure_ascii=False)


@app.route('/diagnosis/getAll/<projectId>')
@app.route('/diagnosis/getAll/<projectId>/<userId>')
def getDiagnosisAll(projectId, userId=0):
    try:
        tCodeStart = time.time()

        memDiagnosisUpdateeLastValue = RedisManager.get_diagnosis_lastupdated_time(projectId)

        projDiagnosisAllInfo = {}
        if memDiagnosisUpdateeLastValue is not None:
            tDelta = time.time() - memDiagnosisUpdateeLastValue
            if tDelta < 60.0:
                memZonesData =  RedisManager.get_diagnosis_zones(projectId)
                memEquipmentsData =  RedisManager.get_diagnosis_equipments(projectId)
                memFaultsData = RedisManager.get_diagnosis_faults(projectId)
                memNoticesData = RedisManager.get_diagnosis_notices(projectId)
                if memZonesData is not None and memEquipmentsData  is not None and memFaultsData is not None and memNoticesData is not None:
                    projDiagnosisAllInfo = dict(zones = memZonesData, equipments = memEquipmentsData, faults = memFaultsData, notices = memNoticesData)
            else:
                memZonesData =  RedisManager.get_diagnosis_zones(projectId)
                memEquipmentsData =  RedisManager.get_diagnosis_equipments(projectId)
                memFaultsData =  RedisManager.get_diagnosis_faults(projectId)
                memNoticesData =  RedisManager.get_diagnosis_notices(projectId)
                if memZonesData is None or memEquipmentsData is None or len(memZonesData) == 0 or len(memEquipmentsData) == 0:
                    projDiagnosisAllInfo.update(json.loads(getEquipmentsAndZones(projectId)))
                    RedisManager.set_diagnosis_zones(projectId, projDiagnosisAllInfo['zones'])
                    RedisManager.set_diagnosis_equipments(projectId, projDiagnosisAllInfo['equipments'])
                projDiagnosisAllInfo.update(json.loads(getNoticesAndFaults(projectId)))
                RedisManager.set_diagnosis_faults(projectId, projDiagnosisAllInfo['faults'])
                RedisManager.set_diagnosis_notices(projectId, projDiagnosisAllInfo['notices'])
            RedisManager.set_diagnosis_lastupdated_time(projectId, time.time())
        else:
            RedisManager.set_diagnosis_lastupdated_time(projectId, time.time())
        tCodeEnd  = time.time()
        print('diagnosis/getAll cost time: ' + str(round(tCodeEnd-tCodeStart,1)) +' seconds')
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps({
        'zones': projDiagnosisAllInfo.get('zones',[]),
        'equipments': projDiagnosisAllInfo.get('equipments',[]),
        'faults': projDiagnosisAllInfo.get('faults',[]),
        'notices': projDiagnosisAllInfo.get('notices',[])
    }, ensure_ascii=False)


@app.route('/diagnosis/fault/customUpdate/<projectId>', methods=['POST'])
def updateCustomOption(projectId):
    bSuccess = False
    try:
        projectId = int(projectId)
        data = request.get_json()
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        if dbname is not None:
            strSQL = 'UPDATE  %s_'%dbname +'diagnosis_faults SET IsUserDefined = %d, UserId = %d, UserFaultGrade = %d, UserFaultDelay = \"%s\", UserModifyTime = NOW() WHERE Id = %d' % \
                     (int(data.get('isUserDefined')) if data.get('isUserDefined') is not None else 0, int(data.get('userId')) if data.get('userId') is not None else 0,
                      int(data.get('userFaultGrade')) if data.get('userFaultGrade') is not None else 0,
                      data.get('userFaultDelay') if data.get('userFaultDelay') is not None else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                      int(data.get('id')) if data.get('id') is not None else 0)
            bSuccess = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL, ())
            if data.get('status') == 0:
                strSQL = 'UPDATE  %s_'%dbname +'diagnosis_notices SET Status = 0 WHERE FaultId = %d' % (int(data.get('id')) if data.get('id') is not None else 0)
                bSuccess = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL, ())
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(bSuccess, ensure_ascii=False)


@app.route('/diagnosis/notice/get/<projectId>/<startTime>/<endTime>')
def getDiagnosisNoticeByTimeSpan(projectId, startTime, endTime):
    data = []
    try:
        projectId = int(projectId)
        data = None
        if isinstance(startTime, str) and isinstance(endTime, str):
            if len(startTime) > 0 and len(endTime) > 0:
                dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
                if (dbname is None):
                    dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
                if dbname is not None:
                    strSQL = "SELECT * FROM (SELECT ID,FaultId,Time,OrderId,Energy,Detail,Status,Project,CheckTime,Operator FROM  %s_"%dbname +"diagnosis_notices where " \
                             "Time >= \'%s\' and Time <= \'%s\' ORDER BY Time desc) pcc GROUP BY FaultId ORDER BY Time desc" % (startTime, endTime)
                    rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
                    data = [{ 'id': x[0], 'faultId': x[1], 'time': x[2].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[2], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                              'orderId': x[3], 'energy': x[4], 'detail': x[5], 'status':x[6], 'project':x[7], 'checkTime':x[8], 'operator':x[9] } for x in rv]
            else:
                data = {'error':"length of startTime and endTime should not be 0"}
        else:
            data = {'error':"startTime and endTime must be str"}
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(data, ensure_ascii=False)


@app.route('/diagnosis/notice/getLimit/<projectId>')
def getDiagnosisNoticesLimit(projectId):
    data = []
    try:
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        if (dbname is None):
            dbname = dbAccess.getProjMysqldbByName(projectId)
        if dbname is not None:
            strSQL = 'SELECT * FROM (SELECT ID,FaultId,Time,OrderId,Energy,Detail,Status,Project,CheckTime,Operator FROM  %s_'%dbname +'diagnosis_notices ORDER BY Time desc limit 0,20) as t GROUP BY FaultId ORDER BY Time desc'
            rv = dbAccess._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
            data = [{ 'id': x[0], 'faultId': x[1], 'time': x[2].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[2], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                      'orderId': x[3], 'energy': x[4], 'detail': x[5], 'status':x[6], 'project':x[7], 'checkTime':x[8], 'operator':x[9] } for x in rv]
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(data, ensure_ascii=False)


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
        if dbname is not None:
            strSQL = 'update  %s_'%dbname +'diagnosis_faults set NoticeId=NULL where NoticeId = %s; \
            update  %s_'%dbname +'diagnosis_notices set status=%s, Operator=%s, CheckTime=NOW() where NoticeId = %s;'
            rt = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL, (noticeId, 0, userId, noticeId))
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/diagnosis/limit/get/<projectId>')
def getDiagnosisLimit(projectId):
    data = []
    projectId = int(projectId)
    dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
    if (dbname is None):
        dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
    if dbname is not None:
        strSQL = 'SELECT ID,`Name`, EquipList, Fault, Alert, Notice, ModifyTime, Project, Enable FROM  %s_'%dbname +'diagnosis_limit ORDER BY ID'
        rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
        data = [{ 'id': x[0], 'name': x[1], 'equipList':x[2], 'fault': x[3], 'alert': x[4], 'notice': x[5],
                  'modifyTime': x[6].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[6], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                  'project':x[7], 'enable':x[8]} for x in rv]
    return json.dumps(data, ensure_ascii=False)


@app.route('/diagnosis/order/get/<projectId>')
def getDiagnosisOrder(projectId):
    data = []
    try:
        projectId = int(projectId)
        dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
        if dbname is None:
            dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
        if dbname is not None:
            strSQL = 'select ID,`Name`, OperatorID, GroupID, FaultGrade, EquipList, ModifyTime, Project, Enable from  %s_'%dbname +'diagnosis_order order by Project'
            rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
            data = [{'id':x[0], 'name': x[1], 'operatorId': x[2], 'groupId': x[3], 'faultGrade': x[4], 'equipList': x[5],
                     'modifyTime': x[6].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[6], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                     'project':x[7], 'enable':x[8]} for x in rv]
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(data, ensure_ascii=False)


@app.route('/diagnosis/enable/get/<projectId>')
def getDiagnosisEnable(projectId):
    data = []
    try:
        projectId = int(projectId)
        dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
        if dbname is None:
            dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
        if dbname is not None:
            strSQL = 'select ID,`Name`, StartTime, EndTime, EquipList, ModifyTime, Project, Enable from  %s_'%dbname +'diagnosis_enable order by ID'
            rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
            data = [{ 'id': x[0], 'name': x[1], 'startTime': x[2].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[2], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                      'endTime': x[3].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[3], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'), 'equipList': x[4],
                      'modifyTime': x[5].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[5], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'), 'project':x[6], 'enable':x[7]} for x in rv]
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(data, ensure_ascii=False)


@app.route('/diagnosis/config/get/<projectId>')
def getDiagnosisConfig(projectId):
    data = {}
    try:
        projectId = int(projectId)
        dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
        if (dbname is None):
            dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
        if dbname is not None:
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
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(data, ensure_ascii=False)


@app.route('/diagnosis/limit/add/<projectId>', methods=['POST'])
def addDiagnosisLimit(projectId):
    rt = False
    try:
        projectId = int(projectId)
        dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
        if dbname is None:
            dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
        if dbname is not None:
            post = request.get_json()
            name = post.get('name') if post.get('name') is not None else ''
            equipList = post.get('equipList') if post.get('equipList') is not None else ''
            fault = int(post.get('fault')) if post.get('fault') is not None else 0
            alert = int(post.get('alert')) if post.get('alert') is not None else 0
            notice = int(post.get('notice')) if post.get('notice') is not None else 0
            project = post.get('project') if post.get('project') is not None else ''
            enable = int(post.get('enable')) if post.get('enable') is not None else 0
            strSQL = "insert into   %s_'%dbname +'diagnosis_limit(`Name`, EquipList, Fault, Alert, Notice, ModifyTime, Project, Enable) values(\'%s\', \'%s\', %d, %d, %d, now(), \'%s\', %d)" % \
                     (name, equipList, fault, alert, notice, project, enable)
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update_with_id('diagnosis','diagnosis_limit', strSQL,())
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/diagnosis/order/add/<projectId>', methods=['POST'])
def addDiagnosisOrder(projectId):
    rt = False
    try:
        projectId = int(projectId)
        dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
        if dbname is None:
            dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
        if dbname is not None:
            post = request.get_json()
            name = post.get('name') if post.get('name') is not None else ''
            operatorId = int(post.get('operatorId')) if post.get('operatorId') is not None else 0
            group = int(post.get('group')) if post.get('group') is not None else 0
            faultGrade = int(post.get('faultGrade')) if post.get('faultGrade') is not None else 0
            equipList = post.get('equipList') if post.get('equipList') is not None else ''
            project = post.get('project') if post.get('project') is not None else ''
            enable = int(post.get('enable')) if post.get('enable') is not None else 0
            strSQL = "insert into   %s_'%dbname +'diagnosis_order(`Name`, OperatorID, GroupID, FaultGrade, EquipList, ModifyTime, Project, Enable) values(\'%s\', %d, %d, %d, \'%s\', now(), \'%s\', %d)" % \
                     (name, operatorId, group, faultGrade, equipList, project, enable)
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update_with_id('diagnosis','diagnosis_order', strSQL,())
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/diagnosis/enable/add/<projectId>', methods=['POST'])
def addDiagnosisEanble(projectId):
    rt = False
    try:
        projectId = int(projectId)
        dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
        if dbname is None:
            dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
        if dbname is not None:
            post = request.get_json()
            name = post.get('name') if post.get('name') is not None else ''
            #startTime = post.get('startTime')
            endTime = post.get('endTime') if post.get('endTime') is not None else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            equipList = post.get('equipList') if post.get('equipList') is not None else ''
            project = post.get('project') if post.get('project') is not None else ''
            enable = int(post.get('enable')) if post.get('enable') is not None else 0
            strSQL = 'insert into   %s_'%dbname +'diagnosis_enable(`Name`, StartTime, EndTime, EquipList, ModifyTime, Project, Enable) values("%s", now(), "%s", "%s", now(), "%s", %d)' \
                     % (name, endTime, equipList, project, enable)
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update_with_id('diagnosis','diagnosis_enable', strSQL,())
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/diagnosis/fault/getByTimeSpan/<projectId>/<startTime>/<endTime>')
def getFaultsByTimeSpan(projectId,startTime,endTime):
    data = []
    try:
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        if (dbname is None):
            dbname = dbAccess.getProjMysqldbByName(projectId)
        if dbname is not None:
            strSQL = 'SELECT a.Id,ParentId,`Name`,Description,Points,EquipmentId,DefaultGrade,IsUserDefined,UserId,b.username,UserFaultGrade,UserFaultDelay,UserModifyTime,UserEnable,Project,NoticeId\
                             FROM   %s_'%dbname +'diagnosis_faults as a LEFT JOIN beopdoengine.`user` as b on a.UserId = b.id where a.UserModifyTime >= \"%s\" and a.UserModifyTime <= \"%s\"' % (startTime, endTime)
            rv = dbAccess._mysqlDBContainer.op_db_query('diagnosis', strSQL, ())
            data = [{ 'id': x[0], 'parentId': x[1], 'name': x[2], 'description': x[3], 'points':x[4], 'equipmentId': x[5],
                    'defaultGrade': x[6], 'isUserDefined': x[7], 'userId': x[8], 'userName': x[9], 'userFaultGrade': x[10],
                    'userFaultDelay': x[11].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[11], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    'userModifyTime': x[12].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[12], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    'userEnable':x[13], 'project':x[14], 'noticeId':x[15] } for x in rv]
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(data, ensure_ascii=False)


@app.route('/diagnosis/order/get/<projectId>/<startTime>/<endTime>')
def getDiagnosisOrderByTimeSpan(projectId,startTime,endTime):
    data = []
    try:
        projectId = int(projectId)
        dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
        if dbname is None:
            dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
        if dbname is not None:
            strSQL = 'select ID,`Name`, OperatorID, GroupID, FaultGrade, EquipList, ModifyTime, Project, Enable from   %s_'%dbname +'diagnosis_order where ModifyTime >= \"%s\" and ModifyTime <= \"%s\"' % (startTime,endTime)
            rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
            data = [{'id':x[0], 'name': x[1], 'operatorId': x[2], 'groupId': x[3], 'faultGrade': x[4], 'equipList': x[5],
                     'modifyTime': x[6].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[6], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                     'project':x[7], 'enable':x[8]} for x in rv]
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(data, ensure_ascii=False)


@app.route('/diagnosis/limit/get/<projectId>/<startTime>/<endTime>')
def getDiagnosisLimitByTimeSpan(projectId,startTime,endTime):
    data = []
    try:
        projectId = int(projectId)
        dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
        if (dbname is None):
            dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
        if dbname is not None:
            strSQL = 'SELECT ID,`Name`, EquipList, Fault, Alert, Notice, ModifyTime, Project, Enable FROM   %s_'%dbname +'diagnosis_limit where ModifyTime >= \"%s\" and ModifyTime <= \"%s\" ORDER BY ID' % (startTime,endTime)
            rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
            data = [{ 'id': x[0], 'name': x[1], 'equipList': x[2], 'fault': x[3], 'alert': x[4], 'notice': x[5],
                      'modifyTime': x[6].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[6], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                      'project':x[7], 'enable':x[8]} for x in rv]
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(data, ensure_ascii=False)


@app.route('/diagnosis/enable/get/<projectId>/<startTime>/<endTime>')
def getDiagnosisEnableByTimeSpan(projectId,startTime,endTime):
    data = []
    try:
        projectId = int(projectId)
        dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
        if dbname is None:
            dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
        if dbname is not None:
            strSQL = 'select ID,`Name`, StartTime, EndTime, EquipList, ModifyTime, Project, Enable from   %s_'%dbname +'diagnosis_enable where ModifyTime >= \"%s\" and ModifyTime <= \"%s\" order by ID' % (startTime,endTime)
            rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
            data = [{ 'id': x[0], 'name': x[1], 'startTime': x[2].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[2], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                      'endTime': x[3].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[3], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                      'equipList': x[4], 'modifyTime': x[5].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[5], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                      'project':x[6], 'enable':x[7]} for x in rv]
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(data, ensure_ascii=False)


@app.route('/diagnosis/equipment/add/<projectId>', methods=['POST'])
def addDiagnosisEquipment(projectId):
    rt = False
    try:
        projectId = int(projectId)
        post = request.get_json()
        dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
        if dbname is None:
            dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
        if dbname is not None:
            strSQL = 'insert into   %s_'%dbname +'diagnosis_equipments (Id, `Name`, PageId, ZoneId, SystemId, SubSystemId, '\
                     'SystemName, SubSystemName, Project, ModalTextId, LocationInfo) values(%d,"%s",%d,%d,%d,%d,"%s","%s","%s",%d, "%s")' % \
                     (int(post.get('id')) if post.get('id') is not None else 0, post.get('name') if post.get('name') is not None else '',
                      int(post.get('pageId')) if post.get('pageId') is not None else 0, int(post.get('zoneId')) if post.get('zoneId') is not None else 0,
                      int(post.get('systemId')) if post.get('systemId') is not None else 0, int(post.get('subSystemId')) if post.get('subSystemId') is not None else 0,
                      post.get('systemName') if post.get('systemName') is not None else '', post.get('subSystemName') if post.get('subSystemName') is not None else '',
                      post.get('project') if post.get('project') is not None else '', post.get('modalTextId') if post.get('modalTextId') is not None else 0,
                      post.get('locationInfo') if post.get('locationInfo') is not None else '')
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/diagnosis/equipment/addMulti/<projectId>', methods=['POST'])
def addDiagnosisEquipmentMulti(projectId):
    rt = False
    try:
        projectId = int(projectId)
        post = request.get_json()
        sqlList = []
        dbAccess = BEOPDataAccess.getInstance()
        dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
        if dbname is None:
            dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
        if dbname is not None:
            insertList = post.get('addList')
            if len(insertList) == 0:
                return json.dumps(True, ensure_ascii=False)
            for data in insertList:
                strInsert = 'insert into   %s_'%dbname +'diagnosis_equipments (Id, `Name`, PageId, ZoneId, SystemId, '\
                            'SubSystemId, SystemName, SubSystemName, Project, ModalTextId, LocationInfo) values'
                strValues = "("
                strValues += "%d,'%s',%d,%d,%d,%d,'%s','%s','%s',%d, '%s'" % \
                             (int(data.get('id')) if data.get('id') is not None else 0, data.get('name') if data.get('name') is not None else '',
                             int(data.get('pageId')) if data.get('pageId') is not None else 0, int(data.get('zoneId')) if data.get('zoneId') is not None else 0,
                             int(data.get('systemId')) if data.get('systemId') is not None else 0, int(data.get('subSystemId')) if data.get('subSystemId') is not None else 0,
                             data.get('systemName') if data.get('systemName') is not None else '', data.get('subSystemName') if data.get('subSystemName') is not None else '',
                             data.get('project') if data.get('project') is not None else '0', data.get('modalTextId') if data.get('modalTextId') is not None else 0,
                             data.get('locationInfo') if data.get('locationInfo') is not None else '')
                strValues += ")"
                strInsert += strValues
                strInsert += " ON DUPLICATE KEY UPDATE "
                strSet = "`Name`='%s', PageId=%d, ZoneId=%d, SystemId=%d, SubSystemId=%d, SystemName='%s', SubSystemName='%s', Project='%s', "\
                         "ModalTextId=%d, LocationInfo='%s'" %\
                            (data.get('name') if data.get('name') is not None else '',
                            int(data.get('pageId')) if data.get('pageId') is not None else 0, int(data.get('zoneId')) if data.get('zoneId') is not None else 0,
                            int(data.get('systemId')) if data.get('systemId') is not None else 0, int(data.get('subSystemId')) if data.get('subSystemId') is not None else 0,
                            data.get('systemName') if data.get('systemName') is not None else '', data.get('subSystemName') if data.get('subSystemName') is not None else '',
                            data.get('project') if data.get('project') is not None else '0', data.get('modalTextId') if data.get('modalTextId') is not None else 0,
                            data.get('locationInfo') if data.get('locationInfo') is not None else '')
                strInsert += strSet
                sqlList.append(strInsert)
            rt = dbAccess._mysqlDBContainer.op_db_update_by_transaction('diagnosis', sqlList)
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/diagnosis/zone/add/<projectId>', methods=['POST'])
def addDiagnosisZone(projectId):
    rt = False
    try:
        projectId = int(projectId)
        post = request.get_json()
        dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
        if dbname is None:
            dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
        if dbname is not None:
            strSQL = 'insert into   %s_'%dbname +'diagnosis_zones (Id, PageId, CampusId, BuildingId, SubBuildingId, CampusName, BuildingName, SubBuildingName, Image, Project, Count) values(%d,%d,%d,%d,%d,"%s","%s","%s","%s","%s",%d)' % \
                     (int(post.get('id')) if post.get('id') is not None else 0, int(post.get('pageId')) if post.get('pageId') is not None else 0,
                      int(post.get('campusId')) if post.get('campusId') is not None else 0,int(post.get('buildingId')) if post.get('buildingId') is not None else 0,
                      int(post.get('subBuildingId')) if post.get('subBuildingId') is not None else 0,post.get('campusName') if post.get('campusName') is not None else '',
                      post.get('buildingName') if post.get('buildingName') is not None else '',post.get('subBuildingName') if post.get('subBuildingName') is not None else '',
                      post.get('image') if post.get('image') is not None else '',post.get('project') if post.get('project') is not None else '',
                      int(post.get('count')) if post.get('count') is not None else 0)
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/diagnosis/zone/addMulti/<projectId>', methods=['POST'])
def addDiagnosisZoneMulti(projectId):
    rt = False
    try:
        projectId = int(projectId)
        post = request.get_json()
        sqlList = []
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        if dbname is None:
            dbname = dbAccess.getProjMysqldbByName(projectId)
        if dbname is not None:
            insertList = post.get('addList')
            if len(insertList) == 0:
                return json.dumps(True, ensure_ascii=False)
            for data in insertList:
                strInsert = 'insert into   %s_'%dbname +'diagnosis_zones (Id, PageId, CampusId, BuildingId, SubBuildingId, CampusName, BuildingName, SubBuildingName, Image, Project, Count) values'
                strValues = "("
                strValues += "%d,%d,%d,%d,%d,'%s','%s','%s','%s','%s',%d" % \
                     (int(data.get('id')) if data.get('id') is not None else 0,int(data.get('pageId')) if data.get('pageId') is not None else 0,
                      int(data.get('campusId')) if data.get('campusId') is not None else 0,int(data.get('buildingId')) if data.get('buildingId') is not None else 0,
                      int(data.get('subBuildingId')) if data.get('subBuildingId') is not None else 0,data.get('campusName') if data.get('campusName') is not None else '',
                      data.get('buildingName') if data.get('buildingName') is not None else '',data.get('subBuildingName') if data.get('subBuildingName') is not None else '',
                      data.get('image') if data.get('image') is not None else '',data.get('project') if data.get('project') is not None else '',int(data.get('count')) if data.get('count') is not None else 0)
                strValues += ")"
                strInsert += strValues
                strInsert += " ON DUPLICATE KEY UPDATE "
                strSet = "PageId=%d, CampusId=%d, BuildingId=%d, SubBuildingId=%d, CampusName='%s', BuildingName='%s', SubBuildingName='%s', Image='%s', Project='%s', Count=%d" %\
                        (int(data.get('pageId')) if data.get('pageId') is not None else 0,
                         int(data.get('campusId')) if data.get('campusId') is not None else 0,int(data.get('buildingId')) if data.get('buildingId') is not None else 0,
                         int(data.get('subBuildingId')) if data.get('subBuildingId') is not None else 0,data.get('campusName') if data.get('campusName') is not None else '',
                         data.get('buildingName') if data.get('buildingName') is not None else '',data.get('subBuildingName') if data.get('subBuildingName') is not None else '',
                         data.get('image') if data.get('image') is not None else '',data.get('project') if data.get('project') is not None else '',
                         int(data.get('count')) if data.get('count') is not None else 0)
                strInsert += strSet
                sqlList.append(strInsert)
            rt = dbAccess._mysqlDBContainer.op_db_update_by_transaction('diagnosis', sqlList)
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/diagnosis/order/getByEquipId/<projectId>/<EquipId>')
def getDiagnosisOrderByEquipId(projectId, EquipId):
    data = {}
    try:
        projectId = int(projectId)
        dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
        if dbname is None:
            dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
        if dbname is not None:
            strSQL = 'SELECT * FROM   %s_'%dbname +'diagnosis_order where EquipList like \"%%%s%%\" order by ModifyTime desc' % (str(EquipId))
            rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
            if rv is not None:
                if len(rv) > 0:
                    data = {'id':rv[0][0], 'name': rv[0][1], 'operatorId': rv[0][2], 'groupId': rv[0][3], 'faultGrade': rv[0][4], 'equipList': rv[0][5],
                            'modifyTime': rv[0][6].strftime('%Y-%m-%d %H:%M:%S') if isinstance(rv[0][6], datetime) else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                            'project':rv[0][7], 'enable':rv[0][8]}
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
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
        if dbname is not None:
            postData = post.get('postdata')
            if postData is not None:
                idList = postData.get('Ids') if postData.get('Ids') is not None else []
                if len(idList) > 0:
                    grade = int(postData.get('Grade')) if postData.get('Grade') is not None else 0
                    delay = postData.get('Delay') if postData.get('Delay') is not None else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    modifyTime = postData.get('ModifyTime') if postData.get('ModifyTime') is not None else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    faults = json.loads(getFaults(projectId))
                    strDelete = "delete from   %s_"%dbname +"diagnosis_faults where Id IN({0})".format(str(idList))
                    strDelete = strDelete.replace('[','')
                    strDelete = strDelete.replace(']','')
                    rv = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strDelete,())
                    if rv:
                        strInsert = "insert into   %s_"%dbname +"diagnosis_faults(Id,ParentId,`Name`,Description,Points,EquipmentId,DefaultGrade,IsUserDefined,UserId,UserFaultGrade,UserFaultDelay,UserModifyTime,UserEnable,Project,NoticeId) values"
                        for id in idList:
                            for item in faults:
                                if item.get('id') == int(id):
                                    strValues = "("
                                    strValues += "%d,%d,\'%s\',\'%s\',\'%s\',%d,%d,%d,%d,%d,\'%s\',\'%s\',%d,\'%s\',%d" % \
                                                 (int(item.get('id')) if item.get('id') is not None else 0, int(item.get('parentId')) if item.get('parentId') is not None else 0,
                                                  item.get('name') if item.get('name') is not None else '', item.get('description') if item.get('description') is not None else '',
                                                  item.get('points') if item.get('points') is not None else '', int(item.get('equipmentId')) if item.get('equipmentId') is not None else 0,
                                                  int(item.get('defaultGrade')) if item.get('defaultGrade') is not None else 0, int(item.get('isUserDefined')) if item.get('isUserDefined') is not None else 0,
                                                  int(item.get('userId')) if item.get('userId') is not None else 0, grade, delay,
                                                  modifyTime, int(item.get('userEnable')) if item.get('userEnable') is not None else 0, item.get('project') if item.get('project') is not None else '',
                                                  int(item.get('noticeId')) if item.get('noticeId') is not None else 0)
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
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
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
        if dbname is not None:
            if postData is not None:
                faultId = int(postData.get('id')) if postData.get('id') is not None else 0
                range = postData.get('range') if postData.get('range') is not None else 'fault'
                grade = int(postData.get('grade')) if postData.get('grade') is not None else 0
                delay = postData.get('delay') if postData.get('delay') is not None else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                modifyTime = postData.get('modifyTime') if postData.get('modifyTime') is not None else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
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
                            strInsert = "insert into diagnosis_faults(Id,ParentId,`Name`,Description,Points,EquipmentId,DefaultGrade,IsUserDefined,UserId,UserFaultGrade,UserFaultDelay,UserModifyTime,UserEnable,Project,NoticeId) values"
                            for item in faults:
                                if item.get('equipmentId') == int(rv[0][0]):
                                    strValues = "("
                                    strValues += "%d,%d,\'%s\',\'%s\',\'%s\',%d,%d,%d,%d,%d,\'%s\',\'%s\',%d,\'%s\',%d" % \
                                                 (int(item.get('id')) if item.get('id') is not None else 0, int(item.get('parentId')) if item.get('parentId') is not None else 0,
                                                  item.get('name') if item.get('name') is not None else '', item.get('description') if item.get('description') is not None else '',
                                                  item.get('points') if item.get('points') is not None else '', int(item.get('equipmentId')) if item.get('equipmentId') is not None else 0,
                                                  int(item.get('defaultGrade')) if item.get('defaultGrade') is not None else 0, int(item.get('isUserDefined')) if item.get('isUserDefined') is not None else 0,
                                                  int(item.get('userId')) if item.get('userId') is not None else 0, grade, delay,
                                                  modifyTime, int(item.get('userEnable')) if item.get('userEnable') is not None else 0, item.get('project') if item.get('project') is not None else '',
                                                  int(item.get('noticeId')) if item.get('noticeId') is not None else 0)
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
                                strInsert = "insert into %s_"%dbname +"diagnosis_faults(Id,ParentId,`Name`,Description,Points,EquipmentId,DefaultGrade,IsUserDefined,UserId,UserFaultGrade,UserFaultDelay,UserModifyTime,UserEnable,Project,NoticeId) values"
                                for id in faultIdList:
                                    for item in faults:
                                        if item.get('id') == int(id):
                                            strValues = "("
                                            strValues += "%d,%d,\'%s\',\'%s\',\'%s\',%d,%d,%d,%d,%d,\'%s\',\'%s\',%d,\'%s\',%d" % \
                                                         (int(item.get('id')) if item.get('id') is not None else 0, int(item.get('parentId')) if item.get('parentId') is not None else 0,
                                                          item.get('name') if item.get('name') is not None else '', item.get('description') if item.get('description') is not None else '',
                                                          item.get('points') if item.get('points') is not None else '', int(item.get('equipmentId')) if item.get('equipmentId') is not None else 0,
                                                          int(item.get('defaultGrade')) if item.get('defaultGrade') is not None else 0, int(item.get('isUserDefined')) if item.get('isUserDefined') is not None else 0,
                                                          int(item.get('userId')) if item.get('userId') is not None else 0, grade, delay,
                                                          modifyTime, int(item.get('userEnable')) if item.get('userEnable') is not None else 0, item.get('project') if item.get('project') is not None else '',
                                                          int(item.get('noticeId')) if item.get('noticeId') is not None else 0)
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
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
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
    try:
        projectId = int(projectId)
        enable = int(enable)
        dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
        if dbname is None:
            dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
        if dbname is not None:
            strSQL = "update %s_"%dbname +"diagnosis_order set Enable=%d where Project='%s'" % (enable, projectId)
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
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
        if dbname is not None:
            strSQL = "update %s_"%dbname +"diagnosis_enable set Enable=%d where Project='%s'" % (enable, projectId)
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
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
        if dbname is not None:
            strSQL = "update %s_"%dbname +"diagnosis_limit set 8Enable=%d where Project='%s'" % (enable, projectId)
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
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
        if dbname is not None:
            strSQL = "delete from %s_"%dbname +"diagnosis_order where ID=%d" % (Id,)
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
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
        if dbname is not None:
            strSQL = "delete from %s_"%dbname +"diagnosis_enable where ID=%d" % (Id,)
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
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
        if dbname is not None:
            strSQL = "delete from %s_"%dbname +"diagnosis_limit where ID=%d" % (Id,)
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    except Exception as e:
        print('diagnosisLimitDelete error:' + e.__str__())
        app.logger.error(e)
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
        if dbname is not None:
            name = post.get('name') if post.get('name') is not None else ''
            operatorId = int(post.get('operatorId')) if post.get('operatorId') is not None else 0
            group = int(post.get('group')) if post.get('group') is not None else 0
            faultGrade = int(post.get('faultGrade')) if post.get('faultGrade') is not None else 0
            equipList = post.get('equipList') if post.get('equipList') is not None else ''
            project = post.get('project') if post.get('project') is not None else ''
            enable = int(post.get('enable')) if post.get('enable') is not None else 0
            strSQL = "update %s_"%dbname +"diagnosis_order set `Name`=\'%s\', OperatorID=%d, GroupID=%d, FaultGrade=%d, EquipList=\'%s\', ModifyTime=now(), Project=\'%s\', Enable=%d where ID=%d" % \
                     (name, operatorId, group, faultGrade, equipList, project, enable, Id)
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/diagnosis/enable/update/<projectId>/<Id>', methods=['POST'])
def diagnosisEnableUpdate(projectId, Id):
    rt = False
    dbname = None
    try:
        projectId = int(projectId)
        Id = int(Id)
        post = request.get_json()
        logging.info('projectId=%s, Id=%s, post=%s', projectId, Id, post)
        dbname = BEOPDataAccess.getInstance().getProjMysqldb(projectId)
        if dbname is None:
            dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(projectId)
        if dbname is not None:
            name = post.get('name') if post.get('name') is not None else ''
            #startTime = post.get('startTime')
            endTime = post.get('endTime') if post.get('endTime') is not None else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            equipList = post.get('equipList') if post.get('equipList') is not None else ''
            project = post.get('project') if post.get('project') is not None else ''
            enable = int(post.get('enable')) if post.get('enable') is not None else 0
            strSQL = "update %s_"%dbname +"diagnosis_enable set `Name`=\'%s\', StartTime=now(), EndTime=\'%s\', EquipList=\'%s\', ModifyTime=now(), Project=\'%s\', Enable=%d where ID=%d" \
                     % (name, endTime, equipList, project, enable, Id)
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    finally:
        checkInvalidNoticeEndTime(dbname)
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
        if dbname is not None:
            name = post.get('name') if post.get('name') is not None else ''
            equipList = post.get('equipList') if post.get('equipList') is not None else ''
            fault = int(post.get('fault')) if post.get('fault') is not None else 0
            alert = int(post.get('alert')) if post.get('alert') is not None else 0
            notice = int(post.get('notice')) if post.get('notice') is not None else 0
            project = post.get('project') if post.get('project') is not None else ''
            enable = int(post.get('enable')) if post.get('enable') is not None else 0
            strSQL = "update %s_"%dbname +"diagnosis_limit set `Name`=\'%s\', EquipList=\'%s\', Fault=%d, Alert=%d, Notice=%d, ModifyTime=now(), Project=\'%s\', Enable=%d where ID=%d" \
                     % (name, equipList, fault, alert, notice, project, enable, Id)
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/diagnosis/resetTable/<projId>/<suffix>', methods=['GET'])
def resetDiagnosisTable(projId, suffix):
    rt = False
    try:
        projId = int(projId)
        rt = BEOPDataAccess.getInstance().resetDiagnosisTable(projId, suffix)
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/diagnosis/initAllTables/<projId>', methods=['GET'])
def initAllDiagnosisTables(projId):
    rt = False
    try:
        projId = int(projId)
        rt = BEOPDataAccess.getInstance().initAllDiagnosisTables(projId)
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/diagnosis/notice/add/new/<projId>', methods=['POST'])
def addDiagnosisNoticeNew(projId):
    rv = None
    try:
        data = request.get_json()
        if data:
            subBuildingName = data.get('subBuildingName')
            buildingName = data.get('buildingName')
            try:
                pageId = int(data.get('pageId'))
            except:
                pageId = data.get('pageId')
            faultName = data.get('faultName')
            timeInterval = data.get('timeInterval')
            faultDescription = data.get('faultDescription')
            grade = int(data.get('alarmGrade'))
            energy = data.get('energy','0.0')
            bindPoints = data.get('bindPoints','')
            dbAccess = BEOPDataAccess.getInstance()
            dbname = dbAccess.getProjMysqldb(projId)
            if (dbname is None):
                dbname = dbAccess.getProjMysqldbByName(projId)
            if dbname is not None:
                rtStep1 = dbAccess.addNoticeCheckZone(projId, buildingName, subBuildingName, pageId)
                if rtStep1:
                    if len(rtStep1) == 3:
                        equipmentId = dbAccess.addNoticeCheckEquipment(projId, buildingName+'-'+subBuildingName, rtStep1[0])
                        if equipmentId:
                            faultId = dbAccess.addNoticeCheckFault(projId, faultName, faultDescription, equipmentId, grade, bindPoints)
                            if faultId:
                                noticeId = dbAccess.addNoticeUpdateFault(projId, faultId, faultDescription, energy, timeInterval)
                                if noticeId:
                                    rv = rtStep1[1], rtStep1[2], equipmentId, faultId, noticeId
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(rv, ensure_ascii=False)


@app.route('/diagnosis/kpi/addFaultToKPI/<projId>', methods=['POST'])
def addFaultToKPI(projId):
    rv = None
    try:
        data = request.get_json()
        if data:
            projId = int(projId)
            faultId = data.get('faultId',0)
            kpiName1 = data.get('kpiName1','')
            kpiName2 = data.get('kpiName2','')
            kpiName3 = data.get('kpiName3','')
            dbAccess = BEOPDataAccess.getInstance()
            dbname = dbAccess.getProjMysqldb(projId)
            if dbname is not None:
                rv = dbAccess.addFaultToKPI(projId, faultId, kpiName1, kpiName2, kpiName3)
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(rv, ensure_ascii=False)


@app.route('/diagnosis/kpi/getkpiName/<projId>/<parentId>', methods=['GET'])
def get_kpi_name_by_parentId(projId, parentId):
    rt = []
    try:
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projId)
        if dbname is not None:
            tableNameKPIStructure = dbname + "_diagnosis_kpi_structure"
            BEOPDataAccess.getInstance().createDiagnosisTableKPIStructureIfNotExist(tableNameKPIStructure)
            if int(parentId) == -1:
                strSQL = 'select id, projId, parentKPIId, name, remark, period from %s_diagnosis_kpi_structure '%dbname
            else:
                strSQL = 'select id, projId, parentKPIId, name, remark, period from %s_diagnosis_kpi_structure '%dbname + 'where parentKPIId = %s'%int(parentId)
            dbrv = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL,())
            if dbrv:
                if len(dbrv) > 0:
                    for x in dbrv:
                        rt.append({'id':x[0], 'projId':x[1], 'parentKPIId':x[2], 'name':x[3], 'remark':x[4], 'period':x[5]})
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(rt, ensure_ascii=False)


def check_kpi_name_uniqueness(dbname, kpiName):
    rt = False
    try:
        strSQL = 'select * from %s_diagnosis_kpi_structure where `name` = "%s"'%(dbname, kpiName)
        dbrv = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL,())
        if len(dbrv) > 0:
            rt = True
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return rt


@app.route('/diagnosis/kpi/updatekpi', methods=['POST'])
def update_kpi_by_kpiId():
    rt = False
    try:
        data = request.get_json()
        kpiId = data.get('Id')
        name = data.get('name')
        parentKPIId = data.get('parentKPIId')
        projId = data.get('projId')
        remark = data.get('remark', '')
        period = data.get('period', '')
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projId)
        if dbname is not None:
            if not check_kpi_name_uniqueness(dbname, name):
                strSQL = 'update %s_diagnosis_kpi_structure '%dbname + 'set parentKPIId = %s, name = "%s", remark = "%s", ' \
                                                                       'period = "%s" where id=%d'%(parentKPIId, name, remark, period, int(kpiId))
                rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
            else:
                rt = 'The KPI name already exists'
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/diagnosis/kpi/removekpi', methods=['POST'])
def remove_kpi_by_kpiId():
    rt = False
    try:
        data = request.get_json()
        kpiId = data.get('Id')
        projId = data.get('projId')
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projId)
        if dbname is not None:
            strId = '('
            nLen = len(kpiId)
            cnt = 0
            flag = ''
            for id in kpiId:
                if cnt == nLen -1:
                    flag = ''
                else:
                    flag = ','
                strId += str(id) + flag
                cnt += 1
            strId += ')'
            strSQL = 'delete from %s_diagnosis_kpi_structure '%dbname + 'where id in %s'% (strId)
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/diagnosis/kpi/addkpi', methods=['POST'])
def add_kpi_by_projId():
    rt = None
    try:
        data = request.get_json()
        name = data.get('name')
        parentKPIId = data.get('parentKPIId')
        projId = data.get('projId')
        remark = data.get('remark', '')
        period = data.get('period', '')
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projId)
        if dbname is not None:
            tableNameKPIStructure = dbname + "_diagnosis_kpi_structure"
            BEOPDataAccess.getInstance().createDiagnosisTableKPIStructureIfNotExist(tableNameKPIStructure)
            if not check_kpi_name_uniqueness(dbname, name):
                strSQL = 'insert into %s_'%dbname + 'diagnosis_kpi_structure (projId, parentKPIId, name, remark, period) ' \
                                                    'VALUES (%s, %s, "%s", "%s", "%s")'%(projId, parentKPIId, name, remark, period)
                rt = dbAccess._mysqlDBContainer.op_db_update_return_id('diagnosis', strSQL,())
            else:
                rt = 'The KPI name already exists'
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/diagnosis/kpi/updatewiki', methods=['POST'])
def add_kpi_content_by_kpiId():
    rt = None
    data = request.get_json()
    faultId = data.get('faultId', None)
    content = data.get('content', '')
    title = data.get('title', '')
    userId = data.get('userId', None)
    projId = data.get('projId', None)
    wikiId = data.get('wikiId', ObjectId())
    try:
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projId)
        if dbname:
            Mongodb = MongoConnManager.getConfigConn().mdbBb['Wiki']
            insert_data = {'creatorId':int(userId), 'title':title, 'modifyTime':datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                           'content':content, 'enable':1}
            dbrv = Mongodb.update({'_id':ObjectId(wikiId)}, insert_data, True)
            if dbrv.get('ok'):
                BEOPDataAccess.getInstance().createDiagnosisTableKPIToWikiIfNotExist(str(dbname) + '_diagnosis_fault_to_wiki')
                strSQL = 'INSERT INTO %s_diagnosis_fault_to_wiki SET faultId = %s, wikiId = "%s"'%(dbname, faultId, wikiId)
                rv = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL, ())
                if rv:
                    rt = wikiId.__str__()
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/diagnosis/kpi/getFaultWiki/<projId>/<kpiId>')
def get_diagnosis_kpi_fault(projId, kpiId):
    rt = []
    projId = int(projId)
    kpiId = int(kpiId)
    cursor = None
    try:
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projId)
        if dbname:
            BEOPDataAccess.getInstance().createDiagnosisTableKPIToWikiIfNotExist(str(dbname) + '_diagnosis_fault_to_wiki')
            strSQL = 'SELECT wikiId FROM %s_diagnosis_fault_to_wiki WHERE faultId = "%s"'%(dbname, kpiId)
            dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL,())
            Mongodb = MongoConnManager.getConfigConn().mdbBb['Wiki']
            cursor = Mongodb.find({'_id':{'$in':[ObjectId(x[0]) for x in dbrv if ObjectId.is_valid(x[0])]}})
            for item in cursor:
                try:
                    rt.append({'_id':item.get('_id').__str__(), 'title':item.get('title'), 'content':item.get('content')})
                except Exception as e:
                    pass
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    finally:
        if cursor:
            cursor.close()
    return json.dumps(rt, ensure_ascii=False)


@app.route('/diagnosis/kpi/getFault/<projId>', methods=['GET'])
def get_kpi_fault_by_projId(projId):
    rt = []
    try:
        projId = int(projId)
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projId)
        if dbname is not None:
            BEOPDataAccess.getInstance().createDiagnosisTableKPIToFaultIfNotExist(str(dbname) + '_diagnosis_kpi_to_fault')
            strSQL = 'SELECT s.id, s.projId, s.parentKPIId, s.`name`, s.remark, s.period, t.faultId, t.faultWeight, ' \
                     'f.`Name`, f.Description, f.UserId, f.UserFaultDelay, f.UserModifyTime ' \
                     'FROM %s_diagnosis_kpi_structure as s ' \
                     'LEFT JOIN %s_diagnosis_kpi_to_fault as t ON s.id = t.kpiId ' \
                     'LEFT JOIN %s_diagnosis_faults as f on t.faultId = f.Id ORDER BY s.id'%(dbname, dbname, dbname)
            dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL,())
            kpiId = None
            for item in dbrv:
                if item[0] == kpiId:
                    if item[6] is not None:
                        rt[-1].get('Fault').append({'faultId':item[6], 'faultWeight':item[7], 'faultName':item[8],
                                                    'fultDescription':item[9], 'UserId':item[10],
                                                    'UserFaultDelay':item[11], 'UserModifyTime':item[12]})
                else:
                    if item[6] is not None:
                        rt.append({'kpiId':item[0], 'projId':item[1], 'parentKPIId':item[2], 'kpiName':item[3],
                                   'kpiremark':item[4], 'Fault':[{'faultId':item[6], 'faultWeight':item[7], 'faultName':item[8],
                                                                  'fultDescription':item[9], 'UserId':item[10],
                                                                  'UserFaultDelay':item[11], 'UserModifyTime':item[12]}]})
                    else:
                        rt.append({'kpiId':item[0], 'projId':item[1], 'parentKPIId':item[2], 'kpiName':item[3],
                                   'kpiremark':item[4], 'Fault':[]})
                    kpiId = item[0]
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/diagnosis/notice/getbytime/<projectId>/<timefrom>/<timeto>')
@cross_origin(origins='*')
def get_diagnosis_notices_by_time(projectId, timefrom, timeto):
    data = []
    try:
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        if dbname is not None:
            timefrom = datetime.strptime(timefrom, '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%d %H:%M:%S')
            timeto = datetime.strptime(timeto, '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%d %H:%M:%S')
            strSQL = 'SELECT n.ID, n.FaultId, f.`Name` as fName, n.Time, n.OrderId, n.Energy, n.Detail, n.STATUS, n.Project, ' \
                     'n.CheckTime, n.Operator, f.DefaultGrade, e.Name as eName, z.BuildingName, z.SubBuildingName FROM ( SELECT * FROM ' \
                     '%s_diagnosis_notices WHERE STATUS = 1 AND Time <= "%s" AND Time >= "%s" ' \
                     'ORDER BY Time DESC ) AS n ' \
                     'LEFT JOIN %s_diagnosis_faults as f on n.FaultId = f.Id ' \
                     'LEFT JOIN %s_diagnosis_equipments as e on f.EquipmentId = e.Id ' \
                     'LEFT JOIN %s_diagnosis_zones as z on e.ZoneId = z.Id ' \
                     'GROUP BY n.FaultId ORDER BY n.Time DESC'%(dbname, timeto, timefrom, dbname, dbname, dbname)
            rv = dbAccess._mysqlDBContainer.op_db_query('diagnosis', strSQL,())
            data = [{ 'noticeId': x[0], 'faultId': x[1], 'faultName':x[2], 'time': x[3].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[3], datetime) else x[3],
                      'orderId': x[4], 'energy': x[5], 'detail': x[6], 'status':x[7], 'project':x[8],
                      'checkTime':x[9].strftime('%Y-%m-%d %H:%M:%S') if isinstance(x[9], datetime) else x[9], 'operator':x[10],
                      'faultDefaultGrade':x[11], 'equipmentName':x[12], 'zoneBuildingName':x[13],
                      'zoneSubBuildingName':x[14]} for x in rv]
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(data, ensure_ascii=False)


@app.route('/diagnosis/kpi/removefault', methods=['POST'])
def remove_diagnosis_fault_from_kpi():
    rt = None
    data = request.get_json()
    projId = data.get('projId', None)
    kpiId = data.get('kpiId', None)
    faultId = data.get('faultId', [])
    try:
        if projId:
            if kpiId:
                if isinstance(faultId, str):
                    faultId = [faultId]
                if isinstance(faultId, int):
                    faultId = [faultId]
                if isinstance(faultId, list):
                    dbAccess = BEOPDataAccess.getInstance()
                    dbname = dbAccess.getProjMysqldb(projId)
                    if dbname is not None:
                        for f in faultId:
                            strSql = 'DELETE FROM %s_diagnosis_kpi_to_fault WHERE kpiId = %s AND faultId = %s'%(dbname, kpiId, f)
                            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update('diagnosis', strSql,())
            else:
                rt = 'No KPIId'
        else:
            rt = 'No Project'
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/v2/fault/getRealtime', methods=['POST'])
def v2_fault_get_realtime():
    rt = None
    data = request.get_json()
    projId = data.get('projId', None)
    moduleId = data.get('moduleId', None)
    moduleName = data.get('moduleName')
    try:
        if projId:
            conn, server_id = MongoConnManager.getHisConnWrite(projId, datetime.now(), datetime.now())
            if conn and server_id:
                if not moduleName:
                    if moduleId:
                        moduleName = MongoConnManager.getConfigConn().diagnosisGetModuleNameById(moduleId)
                allInfo = RedisManager.getProjectDiagnosisStatus(int(projId))
                moduleStatus = allInfo.get('moduleStatus')
                if moduleStatus:
                    rt = moduleStatus.get(moduleName)
                #rt = conn.getFaultRealtimeData(projId, moduleName)
        else:
            rt = dict(error=1, msg= 'projId is None in post interface.')
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/v2/fault/getHistory', methods=['POST'])
def v2_fault_get_history():
    rt = None
    data = request.get_json()
    projId = data.get('projId', None)
    strTimeFrom = data.get('timeFrom', None)
    strTimeTo = data.get('timeTo', [])
    try:
        conn, server_id = MongoConnManager.getHisConnWrite(projId,
                                                           datetime.strptime(strTimeFrom, '%Y-%m-%d %H:%M:%S'),
                                                           datetime.strptime(strTimeTo, '%Y-%m-%d %H:%M:%S'))
        if conn and server_id:
            rt = conn.getFaultHistoryData(projId, strTimeFrom, strTimeTo)
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/diagnosis/notice/updateOrderId/<projId>', methods=['POST'])
def update_diagnosis_notices_orderId(projId):
    rt = {'status': 0, 'message':None}
    post_data = request.get_json()
    try:
        if post_data:
            dbAccess = BEOPDataAccess.getInstance()
            dbname = dbAccess.getProjMysqldb(projId)
            if dbname:
                for data in post_data:
                    faultName = data.get('faultname', '')
                    startTime = data.get('selctStartTime', '')
                    endTime = data.get('selctEndTime', '')
                    orderId = data.get('orderid', 0)
                    checkTime = data.get('checkTime', datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
                    try:
                        strSQL = 'UPDATE %s_diagnosis_notices as n SET OrderId = "%s", CheckTime = "%s"'\
                                 'WHERE n.FaultId IN (SELECT Id FROM %s_diagnosis_faults as f '\
                                 'WHERE f.NAME = "%s") AND n.Time >= "%s" '\
                                 'AND n.Time <= "%s"' % (dbname, orderId, checkTime, dbname, faultName, startTime, endTime)
                        dbrv = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL,())
                        if dbrv:
                            rt.update({'status': 1})
                        else:
                            raise Exception('error')
                    except Exception as e:
                        if rt.get('message'):
                            rt.update({'message': rt.get('message') + 'Update Failed when FaultName:%s, startTime:%s, endTime:%s. ' % (faultName, startTime, endTime)})
                        else:
                            rt.update({'message': 'Update Failed when FaultName:%s, startTime:%s, endTime:%s. ' % (faultName, startTime, endTime)})              
        else:
            rt.update({'status': 0, 'message': 'Invalid parameter'})
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
        rt.update({'status': 0, 'message': e.__str__()})
    return jsonify(rt)


def is_fault_need_push(projId, FaultId):
    rt = []
    dbAccess = BEOPDataAccess.getInstance()
    strSQL = 'SELECT FaultId, ProjId, Users From diagnosispush '\
             'WHERE FaultId = %s AND ProjId = %s' % (FaultId, projId)
    dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
    for item in dbrv:
        if item[2]:
            rt.extend([int(i)for i in item[2].split(',')])
    return rt


def is_fualts_need_push(projId, FaultIds):
    rt = []
    dbAccess = BEOPDataAccess.getInstance()
    strSQL = 'SELECT FaultId, ProjId, Users From diagnosispush '\
             'WHERE ProjId = %s AND FaultId in %s' % (projId, str(FaultIds).replace('[', '(').replace(']', ')'))
    dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
    for item in dbrv:
        if item[2]:
            rt.append({'FaultId': int(item[0]), 'ProjId': int(item[1]),
                       'Users': [int(i)for i in item[2].split(',')]})
    return rt 


def send_noice_to_app(userIdList, notice, mysqlName):
    push_message = {}
    message = {}
    title = ''
    alert = ''
    res = False
    faultId = notice.get('faultId')
    BTime = notice.get('time') if notice.get('time') is not None else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
    strSQL = 'SELECT f.`Name`, f.Description, e.`Name` as EquipmentName, '\
             'z.SubBuildingName FROM %s_diagnosis_faults AS f '\
             'LEFT JOIN %s_diagnosis_equipments as e ON f.EquipmentId = e.Id '\
             'LEFT JOIN %s_diagnosis_zones as z ON e.ZoneId = z.Id '\
             'WHERE f.Id = %s' % (mysqlName, mysqlName, mysqlName, faultId)
    dbAccess = BEOPDataAccess.getInstance()
    dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query_one('diagnosis', strSQL, ()) 
    if dbrv:
        title = dbrv[0]
        if dbrv[3] and dbrv[2]:
            alert = '%s|%s|%s' % (dbrv[3], dbrv[2], dbrv[1])
            message.update({'FaultName': dbrv[0], 'FaultDesc': dbrv[1], 'EquipmentName': dbrv[2],
                            'SubBuildingName': dbrv[3], 'time': BTime, 'type': 'diagnosis'})
    if title and message and alert:
        queue_name = 'notify'
        push_message.update({'notification':{'ios':{'alert':alert, 'extras':{'message':message}},
                                             'android':{'alert':alert, 'extras':{'message':message}, 'title':title}},
                             'message':{'msg_content':message, 'title':alert},
                             'audience':{'alias':userIdList},
                             'type':'app'})
        res = RabbitMqWorkQueueSend(queue_name, str(push_message))
    return res


def send_app_message(userIdList, title, message, alert):
    push_message = {'notification':{'ios':{'alert':alert, 'extras':{'message':message}},
                                         'android':{'alert':alert, 'extras':{'message':message}, 'title':title}},
                         'message':{'msg_content':message, 'title':alert},
                         'audience':{'alias':userIdList},
                         'type':'app'}
    queue_name = 'notify'
    return RabbitMqWorkQueueSend(queue_name, str(push_message))  


@app.route('/diagnosis/notice/add_2', methods=['POST'])
def addDiagnosisNotice_2():
    post_data = request.get_json()
    logging.info('post_data: %s', post_data)
    rt = False
    dbname = None
    try:
        if post_data:
            projId = post_data.get('projId')
            dbAccess = BEOPDataAccess.getInstance()
            dbname = dbAccess.getProjMysqldb(projId)
            insert_data = post_data.get('addList')
            if dbname:
                for data in insert_data:
                    faultId = data.get('faultId')
                    strSQL = 'INSERT INTO %s_' % dbname + 'diagnosis_notices (FaultId, Time, OrderId, Energy, Detail, '\
                             '`Status`, Project, CheckTime, Operator) ' \
                             'VALUES(%d, "%s", "%s", "%s", "%s", %d, "%s", %s, %s)' % \
                            (int(data.get('faultId')) if data.get('faultId') else 0,
                             data.get('time') if data.get('time') else datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                             data.get('orderId') if data.get('orderId') else '0',
                             data.get('energy') if data.get('energy') else '',
                             data.get('detail') if data.get('detail') else '',
                             int(data.get('status')) if data.get('status') else 0,
                             data.get('project') if data.get('project') else '',
                             data.get('chectTime') if data.get('chectTime') else 'NULL',
                             data.get('operator') if data.get('operator') else 'NULL')
                    fault_info = get_fault_by_id(faultId, dbname)
                    if fault_info.get('Enable'):
                        BTime = data.get('time') if data.get('time') else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                        dbrv = dbAccess._mysqlDBContainer.op_db_update_return_id('diagnosis', strSQL, ())
                        if dbrv.get('bSuccess'):
                            # 更新Fault表
                            strSQL = 'UPDATE %s_' % dbname + 'diagnosis_faults SET NoticeId = %d WHERE Id = %d' % (
                                dbrv.get('id'), faultId)
                            rv = dbAccess._mysqlDBContainer.op_db_update('diagnosis', strSQL, ())
                            if fault_info.get('NoticeId') and int(fault_info.get('NoticeId')) != int(dbrv.get('id')):
                                set_previous_diagnosis_notices_endTime(dbname, [fault_info.get('NoticeId')], projId)
                            rt = True
                        # 推送APP
                        if fault_info.get('IsPush'):
                            # push_user_list = is_fault_need_push(int(projId), int(data.get('faultId')))
                            push_info_list = get_fault_push_info(int(projId), int(data.get('faultId')))
                            if push_info_list:
                                for p in push_info_list:
                                    alert = "Hello, a new fault has been detected."
                                    message = {'FaultName': fault_info.get('FaultName'),
                                               'FaultDesc': fault_info.get('FaultDesc'),
                                               'EquipmentName': fault_info.get('EquipmentName'),
                                               'SubBuildingName': fault_info.get('SubBuildingName'),
                                               'level': fault_info.get('DefaultGrade'),
                                               'points': fault_info.get('Points'),
                                               'time': BTime,
                                               'FaultId': faultId,
                                               'type': 'diagnosis',}
                                    if int(p.get('type')) == 1: # app推送
                                        userList = p.get('user', [])
                                        send_app_message(userList, fault_info.get('FaultName'), message, alert)
                                        # 放入消息中心
                                        postData(url="http://beop.rnbtech.com.hk/appCommon/pushNotification/insertMessage", data=message)
                                    elif int(p.get('type')) == 0:  # 邮件推送
                                        userList = p.get('user', [])
                                        mail_list = []
                                        userInfo = BEOPDataAccess.getInstance().getUserInfoByIds(userList)
                                        levelnotice = message.get('level')
                                        level = 'Fault'
                                        if levelnotice == 1:  # 判断是故障还是报警
                                            level = 'Alert'
                                        if levelnotice == 2:
                                            level = 'Fault'
                                        for info in userInfo.values():
                                            mail_list.append(info[1])
                                        html = generateHtml(message, level, projId)
                                        Utils.EmailTool.send_email(alert, mail_list, html)
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    finally:
        checkInvalidNoticeEndTime(dbname)
    return jsonify(data=rt)


def postData(url, data):
    info = {"name": app.config.get('BEOPWEB_LOGIN_USERNAME'), "pwd": app.config.get('BEOPWEB_LOGIN_PASSWORD'),
            "agent": {"screen": "1920 x 1080", "browser": "Chrome", "browserVersion": "52.0.2729.4", "mobile": False,
                      "os": "Windows", "osVersion": "NT 4.0", "cookies": True}, "loginCode": "", 'noRecord': 1}
    headersJson = {'content-type': 'application/json', 'token': app.config.get('BEOPWEB_SECRET_TOKEN') }
    login = requests.post("http://beop.rnbtech.com.hk/login", data=json.dumps(info), headers=headersJson)
    status = json.loads(login.text)
    if status.get('status') == True:
        token = login.cookies._cookies['beop.rnbtech.com.hk']['/']['token'].value
        cookies = {'userId': '2265', 'token': token}
    else:
        cookies = {}
    try:
        r = requests.post(url, headers=headersJson, data=json.dumps(data), timeout=30, cookies=cookies)
        return json.loads(r.text)
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
        return None

def get_fault_by_id(FaultId, mysqlName):
    rt = {}
    try:
        dbAccess = BEOPDataAccess.getInstance()
        strSQL = 'SELECT f.`Name`, f.Description, e.`Name` as EquipmentName, '\
                 'z.SubBuildingName, f.IsPush, f.NoticeId, f.Enable, f.Points FROM %s_diagnosis_faults AS f '\
                 'LEFT JOIN %s_diagnosis_equipments as e ON f.EquipmentId = e.Id '\
                 'LEFT JOIN %s_diagnosis_zones as z ON e.ZoneId = z.Id '\
                 'WHERE f.Id = %s' % (mysqlName, mysqlName, mysqlName, FaultId)
        dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query_one('diagnosis', strSQL, ())
        if dbrv:
            rt.update({'FaultId': FaultId, 'FaultName': dbrv[0], 'FaultDesc': dbrv[1],
                       'EquipmentName': dbrv[2], 'SubBuildingName': dbrv[3], 'IsPush': int(dbrv[4]),
                       'NoticeId': dbrv[5], 'Enable': int(dbrv[6]), 'Points': dbrv[7]})
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)
    return rt


def get_fault_push_info(projId, FaultId):
    push_list = []
    # _type为0的时候是邮件 1是app
    dbAccess = BEOPDataAccess.getInstance()
    strSQL = 'select Users, Type from `diagnosispush` where ProjId={} and FaultId={}'.format(projId, FaultId)
    dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
    if dbrv:
        for item in dbrv:
            userList = list(map(int, item[0].replace(" ", "").split(',')))
            _type = item[1]
            push_list.append(dict(user=userList, type=_type))
    return push_list

def get_projLocal_time(projId):
    rt = None
    dbAccess = BEOPDataAccess.getInstance()
    strSQL = 'SELECT data_time_zone FROM project WHERE `id` = {0}'.format(int(projId))
    dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query_one(app.config.get('DATABASE'), strSQL, ())
    if dbrv:
        time_zone = dbrv[0]
        rt = datetime.utcnow() + timedelta(hours=int(time_zone))
    return rt

def get_diagnosisCurveData(message, projId):#获取邮件中历史曲线的图片地址
    #获取数据
    pointList = []
    faultId = message.get('FaultId')
    points = message.get('points')
    try:
        pointAttrList = points.split('|')
        for pointAttr in pointAttrList:
            point = pointAttr.split(',')[0]
            pointSt = '@'+ str(projId) + '|'+ point
            pointList.append(pointSt)
        occurTime_src = message.get('time')
        occurTime = datetime.strptime(occurTime_src, '%Y-%m-%d %H:%M:%S')
        timeStart = occurTime + timedelta(hours = -3)#开始时间和结束时间为发生时间的前后三小时
        timeEnd = occurTime + timedelta(hours = 3)
        data = {
            'dsItemIds': pointList,
            'points': points,
            'projectId': projId,
            'timeEnd': str(timeEnd),
            'timeFormat': 'm5',
            'timeStart': str(timeStart)
        }
        url = 'http://beop.rnbtech.com.hk/analysis/startWorkspaceDataGenHistogram'
        headersJson = {'content-type': 'application/json', 'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
        r = requests.post(url, headers = headersJson, data=json.dumps(data))
        if r.status_code == 200:
            rt = json.loads(r.text)
        list = rt.get('list')
        series = []
        nameList = []
        arrXAxis = rt.get('timeShaft')
        for item in list:
            name = item.get('dsItemId').split('|')[1]
            data = item.get('data')
            nameList.append(name)
            series.append({
                'name':name,
                'type':'line',
                'itemStyle':{
                    'normal':{
                        'lineStyel':{
                            'type': 'solid'
                        }
                    }
                },
                'data':data
            })
        option = {
            'formatTime':False,
            'color':['#03d5c6', '#288add', '#fdbf05', '#f34704', '#f903d9', '#6d23dd', '#c088f9', '#2d05fb'],
            'tooltip': {
                'trigger': 'axis'
            },
            'toolbox': {
                'show': True,
                'feature': {
                    'dataZoom': {
                        'show': True,
                        'title': {
                            'zoom': 'zoom',
                            'back': 'back'
                        }
                    }
                }
            },
            'legend': {
                'data': nameList,
                'x': 'center',
                'width': '90%',
                'show': True
            },
            'dataZoom': {
                'show': True,
                'type': 'slider',
                'textStyle': { 'color': '#000' },
                'start': 0,
                'end': 100,
                'bottom': -3
            },
            'xAxis': {
                'type': 'category',
                'boundaryGap': False,
                'axisLine': { 'onZero': False },
                'data': arrXAxis
            },
            'yAxis': {
                'type': 'value',
                'scale': True
            },
            'series': series
        }
        img_path = generate_echart_to_disk(option)
        with open(img_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read())
        img_data_url = 'data:image/png;base64,' + encoded_string.decode()
        return img_data_url
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), stack_info=True, exc_info=True)


def generateHtml(message, level, projId):
    html = '''
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ configMap.subject }}</title>
    <style type="text/css">
        body {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            -webkit-text-size-adjust: 100% !important;
            -ms-text-size-adjust: 100% !important;
            -webkit-font-smoothing: antialiased !important;
            font-family: "Microsoft YaHei", "微软雅黑", "arial", "sans-serif";
        }

        .tableContent img {
            border: 0 !important;
            display: block !important;
            outline: none !important;
        }

        a {
            color: #382F2E;
        }

        p, h1 {
            color: #382F2E;
            margin: 0;
        }

        p {
            text-align: left;
            font-size: 14px;
            font-weight: normal;
            line-height: 19px;
        }

        a.link1 {
            color: #382F2E;
        }

        a.link2 {
            font-size: 16px;
            text-decoration: none;
            color: #ffffff;
        }

        h2 {
            text-align: left;
            color: #222222;
            font-size: 19px;
            font-weight: normal;
        }

        div, p, ul, h1 {
            margin: 0;
        }

        .bgBody {
            background: #ffffff;
        }

        .bgItem {
            background: #ffffff;
        }

        .logo {
            margin-top: 30px;
            max-width: 200px;
            position: relative;
        }

        .orderTable {
            border-spacing: 0 5px;
            border-collapse: separate;
            font-size: 14px;
        }

        .orderTable tr {
            border-radius: 3px;
            margin-bottom: 10px;
            font-size: 14px;

            background: #e9e9e9;
        }

        .orderTable th {
            display: block;
            font-weight: normal;
            color: #696969;
            width: 120px;
            vertical-align: middle;
            padding: 6px 0;
            position: relative;
        }

        .orderTable th div {
            position: absolute;
            top: 6px;
            right: 0;
            width: 100%;
            text-align: right;
        }

        .orderTable td {
            padding: 6px 0 6px 10px;
            word-wrap: break-word;
            color: #000000;
        }

        .copyrightInfo {
            position: relative;
            text-align: center;
            padding: 10px 0;
            font-size: 14px;
        }

        .copyrightInfo .contentEditableContainer {
            background: #fff;
            z-index: 25;
            position: absolute;
            top: 0;
            right: 0;
            margin: 0 auto;
            left: 0;
            width: 400px;
        }

        .copyrightInfo, .copyrightInfo a {
            text-decoration: none;
        }

        .copyrightInfo:hover, .copyrightInfo a:hover {
            color: #529541;
            text-decoration: underline;
        }

    </style>
</head>
<body paddingwidth="0" paddingheight="0"
      style="padding-top: 0; padding-bottom: 0; padding-top: 0; padding-bottom: 0; background-repeat: repeat; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased;"
      offset="0" toppadding="0" leftpadding="0">
<table style="height: 700px;" width="100%" border="0" cellspacing="0" cellpadding="0" class="tableContent bgBody"
       align="center">

    <tr>
        <td>
            <table width="800" border="0" cellspacing="0" cellpadding="0" align="center" class='bgItem'>
                <tr>
                    <td width='40'></td>
                    <td width='680'>
                        <table width="680" border="0" cellspacing="0" cellpadding="0" align="center">

                            <!-- =============================== Body ====================================== -->
                            <tr>
                                <td class='movableContentContainer' valign='top'>

                                    <div class='movableContent' style="margin-top: 20px;margin-bottom: 5px;">
                                        <table width="680" border="0" cellspacing="0" cellpadding="0" align="center">
                                            <tr>
                                                <td colspan="2">
                                                    <div class="contentEditableContainer contentTextEditable">
                                                        <div class="contentEditable" align='center'>
                                                            <p style='text-align:left;font-size:18px;font-weight:normal;line-height:19px;margin-bottom: 10px;'>

                                                                Fault : '''
    html +=  message.get('FaultName')
    html += '''                                               </p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td valign="top" align="center">
                                                    <div class="contentEditableContainer contentImageEditable">
                                                        <div class="contentEditable"
                                                             style="position: relative;text-align: left;">
                                                            <img src="https://beopweb.oss-cn-hangzhou.aliyuncs.com/static/images/logo_beop.png"
                                                                 class="logo" alt="" data-default="placeholder"
                                                                 data-max-width="560">
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="contentEditableContainer contentTextEditable"
                                                         style="text-align: right;padding-top: 50px;font-size: 12px;">
                                                        <div class="contentEditable">
                                                            <div style="font-size: 14px;">
                                                                Type: Diagnosis
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>

                                    <div class='movableContent' style="border-top: 2px solid #529541;">
                                        <p style="text-indent: 10px;font-size: 25px;margin: 20px 0;">
                                            <a class="copyrightInfo"

                                        </p>
                                        <table width="680" border="0" cellspacing="0" cellpadding="0" align="center">
                                            <tr>
                                                <td>
                                                    <div class="contentEditableContainer contentImageEditable">
                                                        <table class="orderTable" cellspacing="0" cellpadding="0"
                                                               style="width: 100%;">
                                                            <tr>
                                                                <th>
                                                                    <div>Detected : </div>
                                                                </th>
                                                                <td>'''
    html += message.get("time")
    html += '''                                                   </td>
                                                            </tr>
                                                            <tr>
                                                                <th>
                                                                    <div>Equipment : </div>
                                                                </th>
                                                                <td>'''
    html +=  message.get('EquipmentName')
    html += '''                                                    </td>
                                                            </tr>
                                                            <tr>
                                                                <th>
                                                                    <div>System : </div>
                                                                </th>
                                                                <td>'''
    html +=  message.get('SubBuildingName')
    html += '''                                                    </td>

                                                            </tr>
                                                            <tr>
                                                                <th>
                                                                    <div>Fault : </div>
                                                                </th>
                                                                <td>'''
    html +=  message.get('FaultName')
    html += '''                                                    </td>
                                                            </tr>
                                                            <tr>
                                                                <th>
                                                                    <div>Level : </div>
                                                                </th>
                                                                <td>'''
    html +=  level
    html += '''                                                    </td>
                                                            </tr>
                                                            <tr>
                                                                <th>
                                                                    <div>Detail : </div>
                                                                </th>
                                                                <td>'''
    html +=  message.get('FaultDesc')
    html += '''                                                    </td>

                                                            </tr>
                                                            <tr>
                                                                <th>
                                                                    <div>Consequence : </div>
                                                                </th>
                                                                <td>Energy Waste</td>
                                                            </tr>
                                                            <tr style="background: #fff !important;">
                                                                <th>
                                                                    <div>Snapshot : </div>
                                                                </th>
                                                                <td>
                                                                </td>
                                                            </tr>
                                                            <tr style="background: #fff !important;">
                                                                <td colspan="2">
                                                                <img src= "'''
    html += get_diagnosisCurveData(message, projId)
    html += '''"                                                  />

                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td height='55'>

                                                </td>
                                            </tr>

                                            <tr>
                                                <td>
                                                    <table width="680" border="0">
                                                        <tr>
                                                            <td class="copyrightInfo pr">
                                                                <div class="contentEditableContainer contentTextEditable">
                                                                    <div class="contentEditable">

                                                                    </div>
                                                                    <div class="contentEditable">

                                                                    </div>
                                                                </div>
                                                                <div class="pa"
                                                                     style="border-bottom: 2px solid #529541;position: relative;z-index: 22">
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>

                                </td>
                            </tr>

                            <!-- =============================== footer ====================================== -->

                        </table>
                    </td>
                    <td width='40'></td>
                </tr>
            </table>
        </td>
    </tr>

    <tr>
        <td height='88'></td>
    </tr>
</table>
</body>
</html>
'''
    return html
