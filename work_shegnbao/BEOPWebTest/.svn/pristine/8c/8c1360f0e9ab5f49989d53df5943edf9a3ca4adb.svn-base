"""
Routes and views for the flask application.
"""

from beopWeb import app
from beopWeb.BEOPDataAccess import *
from beopWeb.BEOPSqliteAccess import *
import sys
import os
import re
import copy
from math import floor, ceil
from flask import Flask,request,session,g,make_response,redirect,url_for,abort,render_template,send_file,flash,json,jsonify
import mysql.connector
from datetime import datetime,timedelta
from flask.ext.mail import Mail, Message
from email import charset
import time
import calendar
import subprocess
from beopWeb.sqlite_op import sqlite3
import hashlib
import codecs
from beopWeb.BEOPDataAccess import *
from beopWeb.BEOPDataBufferManager import BEOPDataBufferManager
from os import environ, listdir, path, unlink, remove, makedirs
import csv
import requests
from beopWeb.BEOPMongoDataAccess import BEOPMongoDataAccess
from .mod_admin.Records import Records
from beopWeb.models import *

g_insertData = []
g_insertPoint = []
g_insertTimeSpan = []
g_insertDBName = ''

_mailSendTimestamp = datetime.now() - timedelta(1)
charset.add_charset('utf-8', charset.SHORTEST, charset.BASE64, 'utf-8')

@app.route('/',methods=['GET'])
def main():
    rv = redirect(url_for('home'))
    return  rv


@app.route('/login', methods=['POST'])
def login():
    print('login')
    rv = loginTask(request.get_json())
    if rv and rv.get('id') is not None:
        Records.record_login(rv.get('id'), request.remote_addr)
    return json.dumps(rv, ensure_ascii=False)
    

@app.route('/getProjectByUserId/<userId>')
def getProjectByUserId(userId):
    return json.dumps(BEOPDataAccess.getInstance().getProject(userId), ensure_ascii=False)


@app.route('/reset_pwd', methods=['POST'])
def reset_pwd():
    print('reset_pwd')
    return json.dumps(BEOPDataAccess.getInstance().resetPwd(request.get_json()), ensure_ascii=False)


@app.route('/mail',methods=['POST'])
def send_mail():
    global _mailSendTimestamp
    reciepent = request.form['reciepent']
    title = request.form['title']
    body = request.form['body']
    now = datetime.now()
    if (now - _mailSendTimestamp).total_seconds() > 5:
        rv = sendmail([reciepent],title,body)
        #_mailSendTimestamp = now
    else:
        print('error: sending mail too frequently')
        rv = 'error: you should wait a while before sending more mails'
    return  json.dumps(rv , ensure_ascii=False)


@app.route('/beopversion',methods=['POST'])
def get_beopversion():
    name = request.form['name']
    os.chdir(app.config['FTP_PATH'])
    fl = os.listdir()
    for f in fl:
        r = re.search(name, f)
        if r:
            return f[r.span()[1] + 1:-4]
    rv = 'failure: software not found'
    return json.dumps(rv , ensure_ascii=False)


def sendmail(reciepents,title,body=None):
    print('sendmail')
    mail = Mail(app)
    msg = Message(title,reciepents)
    msg.body = body.encode('utf-8')
    msg.charset = 'utf-8'
    try:
        mail.send(msg)
        rv = 'success'
    except Exception as e:
        rv = 'error: sending mail failed. {}'.format(e)
    return json.dumps(rv , ensure_ascii=False)


@app.route('/getrealtimedata_old',methods=['POST'])
def getRealtimedata_old():
    rdata = request.get_json()
    data = BEOPDataBufferManager.getInstance().getData_Old(rdata.get('db'))
    dj = [dict(time=x[0], name=x[1],value=x[2]) for x in data]
    return json.dumps(dj, ensure_ascii=False)



@app.route('/getrealtimedata',methods=['POST'])
def getRealtimedata():
    dbname = request.form['db']
    j = request.form['data']
    pointList = json.loads(j).get('pointList')
    data = BEOPDataBufferManager.getInstance().getData(dbname,pointList)
    dj = [dict(name=x[0],value=x[1]) for x in data]
    return json.dumps(dj, ensure_ascii=False)


@app.route('/get_realtimedata',methods=['POST'])
def get_realtimedata():
    args = request.form
    rdata = request.get_json()

    if rdata.get('proj') is None:
        proj = app.config['PROJECT_DATABASE']
    else:
        proj = rdata.get('proj')
    pointList = rdata.get('pointList')
    data = BEOPDataBufferManager.getInstance().getDataByProj(proj,pointList)

    dj = [dict(name=k,value=v) for k,v in data.items()]
    return json.dumps(dj, ensure_ascii=False)

@app.route('/get_realtimedata_multi_proj',methods=['POST'])
def get_realtimedata_multi_proj():
    dumps = {}
    rdata = request.get_json()
    project_list = rdata.get('projectList')
    if len(project_list) > 0:
        proj = rdata.get('proj')
        pointList = rdata.get('pointList')
        data = BEOPDataBufferManager.getInstance().getDataByProj(proj,pointList)
        dj = [dict(name=k,value=v) for k,v in data.items()]
        dumps[str(proj)] = dj
    return json.dumps(dumps, ensure_ascii=False)

@app.route('/get_realtimedata_by_projname',methods=['POST'])
def get_realtimedata_by_projname():
    args = request.form
    rdata = request.get_json()

    if rdata.get('proj') is None:
        projName = app.config['PROJECT_DATABASE']
    else:
        projName = rdata.get('proj')

    projId = BEOPDataAccess.getInstance().getProjIdByName(projName)
    data = BEOPDataBufferManager.getInstance().getDataByProj(projId)

    dj = [dict(name=k,value=v) for k,v in data.items()]
    return json.dumps(dj, ensure_ascii=False)


@app.route('/set_realtimedata',methods=['POST'])
def set_realtimedata():
    data = request.get_json()
    proj = data.get('db')
    point = data.get('point')
    value = data.get('value')
    rv = BEOPDataBufferManager.getInstance().setDataByProj(proj,point,value)
    return json.dumps(rv , ensure_ascii=False)


#golding added
@app.route('/get_realtimedata_with_description_by_projname',methods=['POST'])
def get_realtimedata_with_description_by_projname():
    rdata = request.get_json()
    projID = rdata.get('projid')
    projName = BEOPDataAccess.getInstance().getProjNameById(projID)
    projdbName = ''
    if(projID is None): projdbName = app.config['PROJECT_DATABASE']
    else:
        projdbName = BEOPDataAccess.getInstance().getProjMysqldb(projID)

    pointList = rdata.get('pointList')
    data = BEOPDataBufferManager.getInstance().getDataByProj(projID,pointList)

    s3dbname = BEOPDataAccess.getInstance().getProjS3db(projID)
    pointInfoList = BEOPSqliteAccess.getInstance().getPointMapsFromS3db(s3dbname)

    if not isinstance(data, list):
        return json.dumps(data, ensure_ascii=False)

    dj = []
    for x in data:
        desp = ''
        if x[0] in pointInfoList:
            desp = pointInfoList[x[0]]
        dj.append(dict(name=x[0], value=x[1], desc=desp))
    return json.dumps(dj, ensure_ascii=False)


@app.route('/set_to_site_by_projname',methods=['POST'])
def set_to_site_by_projname():
    #print('set_realtimedata_by_projname')
    data = request.get_json()
    projEName = data.get('db')
    point = data.get('point')
    value = data.get('value')
    rv = BEOPDataBufferManager.getInstance().setDataToSite(projEName,point,value)
    return json.dumps(rv , ensure_ascii=False)

@app.route('/set_mutile_to_site_by_projname',methods=['POST'])
def set_mutile_to_site_by_projname():
    #print('set_mutile_to_site_by_projname')
    data = request.get_json()
    projName = data.get('db')
    point = data.get('point')
    value = data.get('value')
    rv = BEOPDataBufferManager.getInstance().setMutilDataToSite(projName,point,value)
    return json.dumps(rv , ensure_ascii=False)

@app.route('/set_realtimedata_by_projname',methods=['POST'])
def set_realtimedata_by_projname():
    #print('set_realtimedata_by_projname')
    data = request.get_json()
    projName = data.get('db')
    point = data.get('point')
    value = data.get('value')
    rv = BEOPDataBufferManager.getInstance().setData(projName,point,value)
    return json.dumps(rv , ensure_ascii=False)

@app.route('/set_realtimedata_by_projid',methods=['POST'])
def set_realtimedata_by_projid():
    #print('set_realtimedata_by_projname')
    data = request.get_json()
    projId = data.get('projid')
    projName = BEOPDataAccess.getInstance().getProjNameById(projId)
    point = data.get('point')
    value = data.get('value')
    rv = BEOPDataBufferManager.getInstance().setData(projName,point,value)
    return json.dumps(rv , ensure_ascii=False)

@app.route('/set_mutile_realtimedata_by_projname',methods=['POST'])
def set_mutile_realtimedata_by_projname():
    #print('set_mutile_realtimedata_by_projname')
    data = request.get_json()
    projName = data.get('db')
    pointList = data.get('point')
    valueList = data.get('value')
    if projName is None or pointList is None or valueList is None:
        rv = 'json post data not good'
    else:
        rv = BEOPDataBufferManager.getInstance().setMutilData(projName,pointList,valueList)
    return json.dumps(rv , ensure_ascii=False)

@app.route('/set_mutile_realtimedata_by_projid',methods=['POST'])
def set_mutile_realtimedata_by_projId():
    #print('set_mutile_realtimedata_by_projname')
    data = request.get_json()
    projId = data.get('projId')
    pointList = data.get('point')
    valueList = data.get('value')
    if projId is None or pointList is None or valueList is None:
        rv = 'json post data not good'
    else:
        projName = BEOPDataAccess.getInstance().getProjNameById(projId)
        rv = BEOPDataBufferManager.getInstance().setMutilData(projName,pointList,valueList)
    return json.dumps(rv , ensure_ascii=False)

@app.route('/get_operation_log', methods=['POST'])
def get_operation_log():
    data = request.get_json()
    proj = data.get('proj')
    date = data.get('date')
    timeStart = datetime.strptime(date,'%Y-%m-%d')
    timeEnd = timeStart + timedelta(1)
    return json.dumps(BEOPDataAccess.getInstance().readOperationLog(BEOPDataAccess.getInstance().getProjMysqldb(proj),timeStart,timeEnd))


@app.route('/get_sqlitedb_size')
@app.route('/get_sqlitedb_size/<dbname>')
def get_sqlitedb_size(dbname=None):
    print('get_sqlitedb_size')
    return json.dumps(getSqlitedbSize(dbname), ensure_ascii=False)


@app.route('/get_sqlitedb_name')
@app.route('/get_sqlitedb_name/<dbname>')
def get_sqlitedb_name(dbname=None):
    print('get_sqlitedb_name')
    return json.dumps(getSqlitedbName(dbname), ensure_ascii=False)


@app.route('/get_history_data/single', methods=['POST'])
def get_history_data_single():
    data = request.get_json()
    rtn = BEOPDataBufferManager.getInstance().getHistoryDataSingleByProjname(data.get('project'), data.get('pointName'), data.get('time'), data.get('timeFormat'))
    return json.dumps(rtn, ensure_ascii=False)


@app.route('/get_history_data', methods=['POST'])
def get_history_data():
    #print('get_history_data')
    data = request.get_json()
    rtn = BEOPDataBufferManager.getInstance().getHistoryDataByProjname(data.get('project'), data.get('pointName'), data.get('timeStart'), data.get('timeEnd'), data.get('timeFormat'))
    return json.dumps(rtn, ensure_ascii=False)


@app.route('/get_history_data_padded', methods=['POST'])
def get_history_data_padded():
    data = request.get_json()
    projId = int(data.get('projectId'))
    pointList = data.get('pointList')

    # invalid query filter:
    strTimeStart = data.get('timeStart')
    strTimeEnd =  data.get('timeEnd')
    strTimeFormat = data.get('timeFormat')
    result = BEOPDataAccess.getInstance().get_history_data_padded(projId, pointList, strTimeStart, strTimeEnd, strTimeFormat)
    return json.dumps(result, ensure_ascii=False)

@app.route('/get_history_data_padded_reduce', methods=['POST'])
def get_history_data_padded_reduce():
    data = request.get_json()
    projId = int(data.get('projectId'))
    pointList = data.get('pointList')

    # invalid query filter:
    strTimeStart = data.get('timeStart')
    strTimeEnd =  data.get('timeEnd')
    strTimeFormat = data.get('timeFormat')
    result = BEOPDataAccess.getInstance().get_history_data_padded_reduce(projId, pointList, strTimeStart, strTimeEnd, strTimeFormat)
    return json.dumps(result, ensure_ascii=False)

@app.route('/get_history_data_padded_multi_proj', methods=['POST'])
def get_history_data_padded_multi_proj():
    dumps = {}
    data = request.get_json()
    strTimeStart = data.get('timeStart')
    strTimeEnd =  data.get('timeEnd')
    strTimeFormat = data.get('timeFormat')
    project_list = data.get('projectList')
    if len(project_list) > 0:
        for item in project_list:
            projId = item.get('projectId')
            pointList = data.get('pointList')
            result = BEOPDataAccess.getInstance().get_history_data_padded(projId, pointList, strTimeStart, strTimeEnd, strTimeFormat)
            dumps[str(projId)] = result
    return json.dumps(dumps, ensure_ascii=False)

@app.route('/join_point', methods=['POST'])
def join_point():
    data = request.get_json()
    name = BEOPDataAccess.getInstance().getProjMysqldb(data.get('proj'))
    rv = BEOPDataAccess.getInstance().joinPointsToDb(name, data.get('startTime'), data.get('endTime'),data.get('timeFormat'),data.get('pointList'))
    return json.dumps(rv)


def loginTask(login):
    print('loginTask')
    id = BEOPDataAccess.getInstance().validate_user(login)
    if id is None:
        return dict(status=False)
    user_profile = BEOPDataAccess.getInstance().getUserProfileById(id)
    return dict(status=True, id=id, projects=BEOPDataAccess.getInstance().getProject(id), userProfile=user_profile)

@app.route('/project/update',methods = ['post'])
def newProUpdate():
    print('newProUpdate')
    data = request.get_json()
    id = data.get('userId')
    if id is None:
        rv = { 'error': 'projects update fail'}
        return rv
    rv = BEOPDataAccess.getInstance().getProject(id)
    return json.dumps(rv, ensure_ascii = False)


def get_s3dbpath_cloud(dbname):
    print('get_s3dbpath_cloud')
    s3dbDir = app.config.get('S3DB_DIR_CLOUD')
    filepath = os.path.join(s3dbDir,dbname)
    if os.path.isfile(filepath):
        return filepath
    return None


def getSqlitedbSize(dbname=None):
    print('getSqlitedbSize')
    filepath = BEOPDataAccess.getInstance().get_s3dbpath_local()
    if filepath:
        return os.path.getsize(filepath)
    else:
        return 'error: file not found'


def getSqlitedbName(dbname=None):
    print('getSqliteName')
    filepath = BEOPDataAccess.getInstance().get_s3dbpath_local()
    if filepath:
        return os.path.basename(filepath)
    else:
        return 'error: file not found'


@app.route('/workflow_get_user_statics', methods=['POST'])
def get_workflow_get_user_statics():
    user_id = request.get_json().get('user_id')
    groupStatics = BEOPDataAccess.getInstance().getWorkflowTransactionGroupStatics(user_id)
    userStatics = BEOPDataAccess.getInstance().getWorkflowTransactionUserStatics(user_id)
    return json.dumps(dict(groupStatics=groupStatics, userStatics=userStatics))


@app.route('/getTransactionOperationRecordByUserId/<userId>/<rownumber>')
def getTransactionOperationRecordByUserId(userId, rownumber):
    return json.dumps(BEOPDataAccess.getInstance().getOperationRecordByUserId(userId, rownumber), ensure_ascii=False)

@app.route('/getTransactionGroupUser')
def getTransactionGroupUser():
    return json.dumps(BEOPDataAccess.getInstance().getGroupUser(), ensure_ascii=False)


@app.route('/getMyfavorite/<userId>')
def getMyFavorite(userId):
    return json.dumps(BEOPDataAccess.getInstance().getMyFavorite(userId), ensure_ascii=False)

@app.route('/workflow_get_week_report_statics', methods=['POST'])
def get_workflow_get_week_report_statics():
    rdata = request.get_json()
    proj_data = BEOPDataAccess.getInstance().get_workflow_weekreport_projdata(rdata.get('projid'), rdata.get('userid'),
                                                                              rdata.get('weekbefore'))
    return json.dumps(dict(projdata=proj_data[1], transaction=proj_data[0], user_data=proj_data[2]), ensure_ascii=False)

@app.route('/save_file', methods=['POST'])
def save_file_in_server():
    data = request.get_json()
    filename = data.get('filename')
    filefolder = data.get('filefolder')
    filecontent = data.get('filecontent')
    ucode = data.get('ucode')
    folder = path.join('beopWeb/', filefolder)
    fileDir = path.join(folder,filename)
    makedirs(folder, exist_ok=True)
    rv = 'unknown'
    if filecontent:
        try:
            file = codecs.open(fileDir,'w',ucode)
            '''filecontent = filecontent.decode('utf-8')'''
            file.write(filecontent)
            file.close()
            rv =  'success'
        except Exception as e:
            print(e)
            logging.error(e)
            rv =  'failed for file open or close wrong.'
    return json.dumps(rv, ensure_ascii=False)


@app.route('/get_history_data_ex', methods=['POST'])
def get_history_data_ex():
    #print('get_history_data_ex')
    data = request.get_json()
    rtn = getHistoryDataByProjnameEx(data.get('project'), data.get('listPtName'), data.get('timeStart'), data.get('timeEnd'), data.get('timeFormat'))
    return rtn


def getHistoryDataByProjnameEx(proj, listPtName, timeStart, timeEnd, timeFormat):
    #print('getHistoryData')
    dbname = BEOPDataAccess.getInstance().getProjMysqldbByName(proj)
    print(dbname)
    if dbname is None:
        return 'error: finding project database failed'
    if timeFormat == 'm5':
        return BEOPDataAccess.getInstance().getHistoryDataFromm5Ex(dbname, listPtName, timeStart, timeEnd)
    rv =  'error: data format not found'
    return json.dumps(rv, ensure_ascii=False)


@app.route('/get_csv_data', methods=['POST'])
def get_csv_data():
    upload_file = request.files.getlist("cvsFile")
    tmpfilename = ''
    for file in upload_file:
        file.save(file.filename)
        tmpfilename = file.filename
        break

    json_file = []
    csvReader = csv.reader(open(tmpfilename, 'r'))
    for row in csvReader:
        parameterStr = ','.join(row)
        param = parameterStr.split(',')
        obj = [{'name': param[0]}, {'value': [param[1], param[2], param[3]]}]
        json_file.append(obj)

    return json.dumps(json_file)

@app.route('/get_config_data/<userId>', methods=['POST'])
def get_config_data(userId):
    global g_insertData
    global g_insertPoint
    global g_insertTimeSpan
    rt = {'error':'successful'}
    upload_file = request.files.getlist("config-file")
    for file in upload_file:
        try:
            dirPath = os.path.abspath('.')+'/temp'
            if not os.path.exists(dirPath):
                os.makedirs(dirPath)
            if not os.path.exists(dirPath+'/'+str(userId)):
                os.makedirs(dirPath+'/'+str(userId))
            fullFilePath = dirPath+'/'+str(userId)+'/'+file.filename
            file.save(fullFilePath)
            checkResult = checkUploadFile(fullFilePath)
            rt['error'] = checkResult[0].get('error')
            if len(checkResult[1]) > 0:
                g_insertData = checkResult[1]
            if len(checkResult[2]) > 0:
                g_insertPoint = checkResult[2]
            if len(checkResult[3]) > 0:
                g_insertTimeSpan = checkResult[3]
            break
        except Exception as e:
            rt = {'error':e.__str__()}
            print('create_project:save config_data failed')
    return json.dumps(rt, ensure_ascii=False)

@app.route('/project/create', methods=['POST'])
def project_create():
    global g_insertData
    global g_insertPoint
    global g_insertTimeSpan
    global g_insertDBName
    rv = {'error':'successful'}
    data =  request.form

    latlng = data.get('latlng')
    address = data.get('address')
    weatherStationId = data.get('weatherStationId')
    dataFileName = data.get('dataFileName')
    projName = data.get('projName')
    createUserName = data.get('userName')
    createUserId = data.get('userId')
    datafileDir = os.path.abspath('.')+'/temp/'+str(createUserId)+'/'+dataFileName
    assert(os.path.exists(datafileDir))

    upload_file = request.files.getlist("pro-pic-file")
    if len(upload_file) > 0:
        for file in upload_file:
            try:
                file.save('beopWeb/static/images/project_img/'+projName+'.jpg')
            except Exception as e:
                print('save pic %s failed' % (projName+'.jpg',))
            break

    dbName = 'beopdata_%s'% ( projName,)
    g_insertDBName = dbName
    beopDBList = BEOPDataAccess.getInstance().GetAllDBNames()
    assert(len(beopDBList) > 0)
    nameList = []
    if dbName in beopDBList:
        rv = {'error':'db is already exist'}
    else:
        nameList = []
        insertData = g_insertData
        for pointName in g_insertPoint:
            nameList.append((pointName, ''))
        if len(nameList) > 0:
            bRes = BEOPDataAccess.getInstance().createRTTable(dbName)
            if bRes:
                if len(insertData) > 0:
                    BEOPSqliteAccess.getInstance().createUserS3db(nameList, projName+'.s3db')
                    mongoDBOperator = BEOPMongoDataAccess.getInstance()
                    l = mongoDBOperator.InsertTableDataUser(insertData, dbName, 1)
                    if l == 0:
                        rv = {'error':'failed'}
                    try:
                        os.remove(datafileDir)
                    except Exception as e:
                        print('remove file:%s failed' % (datafileDir,))
                newProjId = BEOPDataAccess.getInstance().createProject(projName, projName, projName+'.s3db', dbName, latlng, address, projName, createUserId, int(weatherStationId))
                if newProjId > 0:
                    rv = newProjId
                    for name in g_insertPoint:
                        BEOPDataAccess.getInstance().updateRealtimeInputData(int(newProjId), name, getValueByPointName(name, g_insertData))
                else:
                    rv = { 'error': 'insert into table project incorrectly.'}
            else:
                rv = { 'error': 'createRTTable failed.'}
    return json.dumps(rv, ensure_ascii=False)

@app.route('/project/import_user_data/<userId>', methods=['POST'])
def importUserData(userId):
    global g_insertData
    global g_insertPoint
    global g_insertTimeSpan
    global g_insertDBName
    rt = {'error':'successful'}
    data = request.get_json()
    dataFileName = data.get('dataFileName')

    dirPath = os.path.abspath('.')+'/temp'
    datafileDir = dirPath+'/'+str(userId)+'/'+dataFileName
    if os.path.exists(datafileDir):
        ProjId = data.get('projId')
        dbName = BEOPDataAccess.getInstance().getProjMysqldb(ProjId)
        g_insertDBName = dbName
        beopDBList = BEOPDataAccess.getInstance().GetAllDBNames()
        assert(len(beopDBList) > 0)
        nameList = []
        #insertData = record
        for pointName in g_insertPoint:
            nameList.append((pointName, ''))
        if len(g_insertData) > 0:
            mongoDBOperator = BEOPMongoDataAccess.getInstance()
            rv = BEOPDataAccess.getInstance().get_pointList_from_rtTable(ProjId)
            for name in g_insertPoint:
                bFind = False
                for item in rv:
                    if len(item) > 0:
                        if item[0] == name:
                            bFind = True
                            break
                if not bFind:
                    BEOPDataAccess.getInstance().updateRealtimeInputData(ProjId, name, getValueByPointName(name, g_insertData))
            rv = mongoDBOperator.InsertTableDataUser(g_insertData, dbName)
            if rv == 0:
                rt = {'error':'failed'}
            try:
                os.remove(datafileDir)
            except Exception as e:
                print('remove file:%s failed' % (datafileDir,))
    return json.dumps(rt, ensure_ascii=False)

@app.route('/update_realtimedata_input_value', methods=['POST'])
def update_realtimedata_input_value():
    data =  request.get_json()
    listInfo = data.get('listInfo')
    BEOPDataAccess.getInstance().update_realtimedata_input_value(listInfo)

    return '1'

@app.route('/load_history_config_value/<userName>', methods=['GET'])
def load_history_config_value(userName):
    return BEOPDataAccess.getInstance().LoadHistoryConfig(userName)


@app.route('/save_history_config_value', methods=['POST'])
def save_history_config_value():
    data = request.get_json()
    BEOPDataAccess.getInstance().SaveHistoryConfig(data['userName'], data['configName'], data['startTime'], data['endTime'], data['projectList'])
    rv =  'success'
    return json.dumps(rv, ensure_ascii=False)


@app.route('/observer/update/<s3dbname>', methods=['GET'])
def prepareResource(s3dbname, clean=True):
    print('prepareResouce')
    # TODO: force remove *.dec
    nameList = BEOPDataAccess.getInstance().getProjectNameList()
    for name, s3db, updatetime in nameList:
        if name is None:
            continue
        if name != s3dbname:
            continue
        mtime = BEOPSqliteAccess.getInstance().prepareResouceFromS3db(name, s3db, updatetime, clean)
        if mtime != None:
            BEOPDataAccess.getInstance().updateProjectUpdateTime(name, mtime)
    rv = 'success'
    return json.dumps(rv, ensure_ascii=False)


@app.route('/observer/update_project_by_user', methods=['POST'])
def update_project_by_user():
    print('prepareResouce')
    request_json = request.get_json()
    user_id = request_json.get('user_id')
    if user_id is None:
        return 'error:user id is empty'
    clean = request_json.get('clean') if request_json.get('clean') is not None else True
    name_list = BEOPDataAccess.getInstance().getAdminProjectNameListByUser(user_id)
    result = []
    for project_code, s3db, update_time, project_name in name_list:
        if project_code is None:
            continue
        mtime = BEOPSqliteAccess.getInstance().prepareResouceFromS3db(project_code, s3db, update_time, clean)
        if mtime is not None:
            BEOPDataAccess.getInstance().updateProjectUpdateTime(project_code, mtime)
            result.append({project_name: True})
        else:
            result.append({project_name: False})
    return json.dumps(result, ensure_ascii=False)


@app.route('/observer/setuprealtimedb', methods=['GET'])
def setuprealtimedb():
    rv = ''
    pList = BEOPDataAccess.getInstance().getProjectTableNameList()
    for proj in pList:
        if proj is None or len(proj)==0:
            continue
        if not BEOPDataAccess.getInstance().checkTableExist('beopdoengine', 'rtdata_%s'% proj):
            BEOPDataAccess.getInstance().createMysqlTable('rtdata_%s'% proj)
            rv += 'rtdata_%s table established.\n' % proj
    if len(rv)==0:
        rv = 'no project realtime table established.'
    return json.dumps(rv, ensure_ascii=False)

@app.route('/clearrtdata', methods=['POST'])
def clearrtdata():
    rv = ''
    data = request.get_json()
    projName = data['projName']
    rv = BEOPDataAccess.getInstance().clearRealtimeInputData(projName)
    return json.dumps(rv, ensure_ascii=False)

@app.route('/dashboard/get_weather/<projId>', methods=['GET'])
def dashboard_get_weather(projId):
    rv = {}

    citykey = BEOPDataAccess.getInstance().getWeatherIdOfProject(projId)
    url='http://wthrcdn.etouch.cn/weather_mini?citykey=%d'%citykey
    response = requests.get(url)
    html = response.text
    tNow = datetime.now()
    tStart = tNow - timedelta(1)
    weatherInfo = json.loads(html)

    if weatherInfo['status']==1002:
        return json.dumps('no data', ensure_ascii=False)

    if 'data' in weatherInfo.keys():
        rv['data'] = weatherInfo['data']
    else:
        rv['data'] = 'no data'

    strTimeStart = tStart.strftime('%Y-%m-%d %H:%M:%S')
    strTimeEnd = tNow.strftime('%Y-%m-%d %H:%M:%S')


    rv['tempHistory'] = BEOPMongoDataAccess.getInstance().getWeatherTempList(citykey, strTimeStart, strTimeEnd)
    #print(weatherInfo)
    return json.dumps(rv, ensure_ascii=False)

#mango add for analysis
@app.route('/analysis/datasource/saveMulti/<userId>', methods=['POST'])
def analysisDataSourceSaveMulti(userId):
    rt = {}
    data = request.get_json()
    userId = int(userId)
    assert(isinstance(data, dict))
    if isinstance(data, dict):
        rt = BEOPMongoDataAccess.getInstance().analysisDataSourceSaveMulti(userId, data)
    return json.dumps(rt)

@app.route('/analysis/datasource/saveLayout/<userId>', methods=['POST'])
def analysisDataSourceSaveLayout(userId):
    rt = {}
    data = request.get_json()
    userId = int(userId)
    assert(isinstance(data, dict))
    if isinstance(data, dict):
        rt = BEOPMongoDataAccess.getInstance().analysisDataSourceSaveLayout(userId, data)
    return json.dumps(rt)

@app.route('/analysis/datasource/removeSingle/<datasourceId>/<datasourceItemId>/<userId>', methods=['GET'])
def analysisDataSourceRemoveSingle(datasourceId, datasourceItemId, userId):
    rt = {}
    datasourceId = str(datasourceId)
    datasourceItemId = str(datasourceItemId)
    userId = int(userId)
    rt = BEOPMongoDataAccess.getInstance().analysisDataSourceRemoveSingle(datasourceId, datasourceItemId, userId)
    return json.dumps(rt)

@app.route('/analysis/modal/save/<userId>', methods=['POST'])
def analysisModalSave(userId):
    rt = {}
    userId = int(userId)
    data = request.get_json()
    assert(isinstance(data, dict))
    if isinstance(data, dict):
        rt = BEOPMongoDataAccess.getInstance().analysisModalSave(userId, data)
    return json.dumps(rt)

@app.route('/analysis/modal/remove/<userId>/<workspaceId>/<modalId>', methods=['GET'])
def analysisModalRemove(userId, workspaceId, modalId):
    rt = {}
    userId = int(userId)
    assert(isinstance(workspaceId, str))
    assert(isinstance(modalId, str))
    rt = BEOPMongoDataAccess.getInstance().analysisModalRemove(userId, workspaceId, modalId)
    return json.dumps(rt)

@app.route('/analysis/datasource/get/<userId>', methods=['GET'])
def analysisDataSourceGet(userId):
    userId = int(userId)
    rt = BEOPMongoDataAccess.getInstance().analysisDataSourceGet(userId)
    return json.dumps(rt)

@app.route('/analysis/workspace/get/<userId>', methods=['GET'])
def analysisWorkspaceGet(userId):
    userId = int(userId)
    rt = BEOPMongoDataAccess.getInstance().analysisModalGet(userId)
    return json.dumps(rt)

@app.route('/analysis/template/save/<userId>', methods=['POST'])
def analysisTemplateSave(userId):
    rt = {}
    userId = int(userId)
    data = request.get_json()
    assert(isinstance(data, dict))
    if isinstance(data, dict):
        rt = BEOPMongoDataAccess.getInstance().analysisTemplateSave(userId, data)
    return json.dumps(rt)

@app.route('/analysis/template/remove/<userId>', methods=['GET'])
def analysisTemplateRemove(userId):
    userId = int(userId)
    rt = BEOPMongoDataAccess.getInstance().analysisTemplateRemove(userId)
    return json.dumps(rt)

@app.route('/analysis/template/get/<userId>', methods=['GET'])
def analysisTemplateGet(userId):
    userId = int(userId)
    rt = BEOPMongoDataAccess.getInstance().analysisTemplateGet(userId)
    return json.dumps(rt)

@app.route('/analysis/getAll/<userId>/<thumbPic>', methods=['GET'])
def analysisGetAll(userId,thumbPic=1):
    userId = int(userId)
    thumbPic = int(thumbPic)
    rtDataSource = []
    rtModal = BEOPMongoDataAccess.getInstance().analysisModalGet(userId,thumbPic)
    rt = []
    dsNullGroup = []
    groupList = BEOPMongoDataAccess.getInstance().getDataSourceGroupInfo(userId)
    datasourceList = BEOPMongoDataAccess.getInstance().analysisDataSourceGet(userId)
    for group in groupList:
        ds = []
        groupId = group.get('groupId')
        groupName = group.get('groupName')
        parantId = group.get('parentId')
        if ObjectId.is_valid(groupId):
            for datasource in datasourceList:
                dsl = datasource.get('list')
                for item in dsl:
                    parentId =  item.get('groupId')
                    if ObjectId.is_valid(parentId):
                        if parentId == groupId:
                            ds.append(item)
        rt.append({'groupId':groupId, 'groupName':groupName, 'parentId':parantId, 'datasourceList':ds})
    for datasource in datasourceList:
        dsl = datasource.get('list')
        for item in dsl:
            parentId =  item.get('groupId')
            if not ObjectId.is_valid(parentId):
                dsNullGroup.append(item)
    if len(dsNullGroup) > 0:
        rt.append({'groupId':'', 'groupName':'unassigned', 'parentId':'', 'datasourceList':dsNullGroup})
    return json.dumps({'workspaces':rtModal, 'group':rt})

@app.route('/analysis/workspace/saveLayout/<userId>', methods = ['POST'])
def analysisWorkspaceSaveLayout(userId):
    userId = int(userId)
    data = request.get_json()

    assert(isinstance(data, dict))
    keys = data.keys()
    assert('workspaceId' in keys and 'modalList' in keys)
    workspaceId = data['workspaceId']
    modalList = data['modalList']
    rt = BEOPMongoDataAccess.getInstance().analysisWorkspaceSaveLayout(userId, workspaceId, modalList)
    return json.dumps(rt)

@app.route('/analysis/workspace/remove/<workspaceId>', methods = ['GET'])
def analysisWorkspaceRemove(workspaceId):
    assert(isinstance(workspaceId, str))
    rt = BEOPMongoDataAccess.getInstance().analysisWorkspaceRemove(workspaceId)
    return json.dumps(rt)

@app.route('/proj_name/check', methods=['POST'])
def projNameCheck():
    rv = ''
    data =  request.get_json()
    projName = data.get('proName')

    rv = BEOPDataAccess.getInstance().checkProName(projName)
    return rv

@app.route('/datasource/get/<userId>', methods=['GET'])
def getDataSource(userId):
    userId = int(userId)
    rt = []
    dsNullGroup = []
    groupList = BEOPMongoDataAccess.getInstance().getDataSourceGroupInfo(userId)
    datasourceList = BEOPMongoDataAccess.getInstance().analysisDataSourceGet(userId)
    for group in groupList:
        ds = []
        groupId = group.get('groupId')
        groupName = group.get('groupName')
        parantId = group.get('parentId')
        if ObjectId.is_valid(groupId):
            for datasource in datasourceList:
                dsl = datasource.get('list')
                for item in dsl:
                    parentId =  item.get('groupId')
                    if ObjectId.is_valid(parentId):
                        if parentId == groupId:
                            ds.append(item)
        rt.append({'groupId':groupId, 'groupName':groupName, 'parentId':parantId, 'datasourceList':ds})
    for datasource in datasourceList:
        dsl = datasource.get('list')
        for item in dsl:
            parentId =  item.get('groupId')
            if not ObjectId.is_valid(parentId):
                dsNullGroup.append(item)
    if len(dsNullGroup) > 0:
        rt.append({'groupId':'', 'groupName':'unassigned', 'parentId':'', 'datasourceList':dsNullGroup})
    return json.dumps({ 'group':rt})

@app.route('/datasource/getDirect', methods=['POST'])
def getDataSourceDirect(datasourcelist = []):
    dsList = []
    if len(datasourcelist) == 0:
        data = request.get_json()
        dsList = data.get('datasourceIdList')
    else:
        dsList = datasourcelist
    rtList = BEOPMongoDataAccess.getInstance().analysisDataSourceGetByIdList(dsList)
    return json.dumps(rtList)

#2015-5-8 mango added
@app.route('/datasource/saveDataSourceGroup', methods=['POST'])
def saveDataSourceGroup():
    result = {'error':'successful'}

    data = request.get_json()
    groupId = data.get('groupId')
    groupName = data.get('name')
    parentId = data.get('parent')
    userId = data.get('userId')

    if not isinstance(parentId, str):
        result = {'error':'parent id is not string'}
        return result
    result = BEOPMongoDataAccess.getInstance().saveDataSourceGroup(userId, groupName, groupId, parentId)
    return json.dumps(result)

@app.route('/datasource/deleteDataSourceGroup/<userId>/<groupId>', methods=['GET'])
def deleteDataSourceGroup(userId, groupId):
    result = {'error':'successful'}
    userId = int(userId)
    groupId = str(groupId)

    result = BEOPMongoDataAccess.getInstance().deleteDataSourceGroup(userId, groupId)
    datasourceList = BEOPMongoDataAccess.getInstance().analysisDataSourceGet(userId)
    if ObjectId.is_valid(groupId):
        for datasource in datasourceList:
            dsl = datasource.get('list')
            for item in dsl:
                parentId =  item.get('groupId')
                if ObjectId.is_valid(parentId):
                    if parentId == groupId:
                        rt = BEOPMongoDataAccess.getInstance().analysisDataSourceRemoveSingle('',item.get('id'),userId)
                        if not rt.get('success'):
                            result = {'error':'failed'}
    else:
        if len(groupId) == 0:
            for datasource in datasourceList:
                dsl = datasource.get('list')
                for item in dsl:
                    parentId =  item.get('groupId')
                    if not ObjectId.is_valid(parentId):
                        rt = BEOPMongoDataAccess.getInstance().analysisDataSourceRemoveSingle('',item.get('id'),userId)
                        if not rt.get('success'):
                            result = {'error':'failed'}
    return json.dumps(result)

@app.route('/datasource/saveDataSourceGroupLayout/<userId>', methods=['POST'])
def saveDataSourceGroupLayout(userId):
    userId = int(userId)

    result = {'error':'successful'}
    data = request.get_json()
    newGroupIdList = data.get('groupIdList')
    result = BEOPMongoDataAccess.getInstance().saveDataSourceGroupLayout(userId, newGroupIdList)
    return json.dumps(result)

@app.route('/get_history_data/getMinPeriod/<projId>', methods=['GET'])
def getMinPeriod(projId):
    projId = int(projId)

    result = {'minPeriod':''}
    dbName = BEOPDataAccess.getInstance().getProjMysqldb(projId)
    if dbName != None:
        if len(dbName) > 0:
            rt = BEOPMongoDataAccess.getInstance().getMinPeriod(dbName)
            result['minPeriod'] = rt
    return json.dumps(result)

@app.route('/project/get_insert_percent', methods=['GET'])
def get_insert_percent():
    global g_insertData
    insertLength = BEOPMongoDataAccess.getInstance().getInsertLength()
    totalLength = len(g_insertData)
    if totalLength == 0:
        return json.dumps(0)
    return json.dumps(insertLength/totalLength)

@app.route('/project/rollback_insert_data', methods=['GET'])
def rollback_insert_data():
    global g_insertDBName
    global g_insertPoint
    global g_insertTimeSpan
    result = {'error':'successful'}
    if len(g_insertDBName)>0 and len(g_insertPoint)>0 and len(g_insertTimeSpan)>0:
        rt = BEOPMongoDataAccess.getInstance().rollback_insert_data(g_insertDBName, g_insertPoint, g_insertTimeSpan[0], g_insertTimeSpan[1])
        if rt:
            g_insertData = []
            g_insertPoint = []
            g_insertTimeSpan = []
            g_insertDBName = ''
        else:
            result = {'error':'failed'}
    return json.dumps(result)
