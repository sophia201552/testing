# -*- coding: utf-8 -*-
"""
Routes and views for the flask application.
"""

from beopWeb import app
from beopWeb.BEOPDataAccess import *
from beopWeb.BEOPDataBufferManager import BEOPDataBufferManager
from beopWeb.BEOPSqliteAccess import *
from flask import Flask, request, session, g, make_response, redirect, url_for, abort, render_template, send_file, \
    flash, json, jsonify
import mysql.connector
from datetime import datetime
import os
import json
import re
import time
import hashlib
from beopWeb.sqlite_op import sqlite3
from ctypes import *
from beopWeb.ReportParser import *
from beopWeb.BEOPMongoDataAccess import BEOPMongoDataAccess

@app.route('/observer')
def home():
    """Renders the home page."""
    return render_template('indexObserver.html',
                           title='BEOP Energy Leader')

# TEST: /share/db/262/3/5509098a199d840b00de824e
@app.route('/share/db/<userId>/<menuId>')
def share_analysis(userId, menuId):
    """Renders the share dashboard page."""
    return render_template('shareDashBoard.html',
                           title='Share',
                           userId=userId,
                           menuId=menuId)

# mango added 2014-11-26
@app.route('/observer/account/addMember/<userId>/<roleId>/<projectId>')
def addMember(userId, roleId, projectId):
    return json.dumps(BEOPDataAccess.getInstance().add_member(userId, roleId, projectId), ensure_ascii=False)


#mango added 2014-11-26
@app.route('/observer/account/removeMember/<userId>/<projectId>')
def remove_member(userId, projectId):
    return json.dumps(BEOPDataAccess.getInstance().remove_member(userId, projectId), ensure_ascii=False)


#mango added 2014-11-27
@app.route('/observer/account/resetLevel/<memberId>/<roleId>/<projectId>')
def reset_level(memberId, roleId, projectId):
    return json.dumps(BEOPDataAccess.getInstance().reset_level(memberId, roleId, projectId), ensure_ascii=False)


@app.route('/observersq')
def homeSQ():
    """Renders the home page."""
    return render_template('indexObserver_SQ.html',
                           title='Home Page',
                           year=datetime.now().year, )


#mango added 2014-11-27
@app.route('/observer/account/resetPassword', methods=['POST'])
def reset_password():
    print('reset_password')
    rdata = request.get_json()
    return BEOPDataAccess.getInstance().reset_password(rdata)


#mango added 2014-11-27
@app.route('/observer/account/getDetails/<userId>')
def get_details(userId):
    return BEOPDataAccess.getInstance().get_details(userId)


#mango added 2014-11-27
@app.route('/observer/account/resetUserInfo', methods=['POST'])
def reset_user_info():
    print('reset_user_info')
    rdata = request.get_json()
    user_id = rdata.get('id')
    user_name = rdata.get('name')
    user_mail = rdata.get('mail')
    return BEOPDataAccess.getInstance().reset_user_info(user_id.user_name, user_mail)


#mango added 2014-11-27
@app.route('/observer/account/forgetPassword/<userId>')
def forget_pass(userId):
    return BEOPDataAccess.getInstance().forget_pass(userId)


#mango added 2014-11-28 @todo
@app.route('/observer/account/logout')
def logout():
    return None


@app.route('/get_plant/<proj>')
@app.route('/get_plant/<proj>/<pageid>')
def get_plant(proj=1, pageid=10000158):
    s3dbname = BEOPDataAccess.getInstance().getProjS3db(proj)
    rv = BEOPSqliteAccess.getInstance().getPlant(s3dbname, pageid)
    return json.dumps(rv)


@app.route('/get_plant_dynamic')
@app.route('/get_plant_dynamic/<pageid>')
def get_plant_dynamic(pageid=10000158):
    rv = BEOPSqliteAccess.getInstance().getPlantDynamic(pageid)
    return json.dumps(rv)


@app.route('/get_plant_pagedetails/<proj>/<userID>')
def get_plant_pagedetailsPlus(proj, userID):
    s3dbname = BEOPDataAccess.getInstance().getProjS3db(proj)
    rv = BEOPSqliteAccess.getInstance().getPlantPageDetails(s3dbname)
    roles = BEOPDataAccess.getInstance().getUserRolesInProject(userID, proj)
    nav, funcNav = BEOPMongoDataAccess.getInstance().getCustomNavAllByRoleAndProject(proj, roles)
    return jsonify(observerPages=rv, navItems=nav, funcNavItems=funcNav)

@app.route('/observer/account/sendInvitation', methods=['POST'])
def sendInvitation():
    req_data = request.get_json()
    mail = req_data.get('mail')
    prj_id = req_data['projectID']
    level = req_data['level']
    url = req_data['serverURL']
    sender_id = req_data['senderId']
    return BEOPDataAccess.getInstance().sendInvitation(mail, prj_id, level, url, sender_id)


def ProcessMail(inputMail):
    isMatch = bool(
        re.match(r"^[a-zA-Z](([a-zA-Z0-9]*\.[a-zA-Z0-9]*)|[a-zA-Z0-9]*)[a-zA-Z]@([a-z0-9A-Z]+\.)+[a-zA-Z]{2,}$",
                 inputMail, re.VERBOSE))
    return isMatch


@app.route('/observer/account/login', methods=['POST'])
def login_():
    return json.dumps(BEOPDataAccess.getInstance().loginTask_(request.get_json()), ensure_ascii=False)


@app.route('/register', methods=['POST'])
def regist():
    data = request.get_json()

    if not data.get("name"):
        return json.dumps({'status': False, 'error': 'user name is empty'})

    if not data.get("password"):
        return json.dumps({'status': False, 'error': 'password is empty'})

    if not data.get("token"):
        return json.dumps({'status': False, 'error': 'token is empty'})

    if data.get("type") is None:
        return json.dumps({'status': False, 'error': 'register type is empty'})

    return BEOPDataAccess.getInstance().regist(data.get("name"), data.get("password"), data.get("token"),
                                               data.get("type"))


@app.route('/register_new_user', methods=['POST'])
def register_new_user():
    data = request.get_json()
    username = data["username"]
    password = data["password"]

    res = BEOPDataAccess.getInstance().register_new_user(username, password)
    return res


@app.route('/apply_for_registration', methods=['POST'])
def apply_for_registration():
    data = request.get_json()
    email = data.get('email')
    server_url = data.get('server_url')
    return BEOPDataAccess.getInstance().applyForRegistration(email, server_url)


@app.route('/send_reset_pwd_email', methods=['POST'])
def send_reset_pwd_email():
    data = request.get_json()
    email = data.get('email')
    server_url = data.get('serverURL')
    if not email:
        return 'email is empty'
    if not server_url:
        return 'server url is empty'
    return BEOPDataAccess.getInstance().send_reset_pwd_email(server_url, email)


@app.route('/is_user_exist', methods=['POST'])
def is_user_exist():
    data = request.get_json()
    return json.dumps({'result': BEOPDataAccess.getInstance().is_user_exist(data.get('userName'))})


@app.route('/invite_to_register/<token>')
def invite_to_register(token):
    if not BEOPDataAccess.getInstance().checkTokenValid(token):
        render_template('page_not_found.html'), 404

    user_profile = BEOPDataAccess.getInstance().getUserProfileByToken(token, 0)
    if user_profile.get('status') == 'registered':
        return render_template('page_not_found.html'), 404

    if not user_profile.get('name'):
        return render_template('page_not_found.html'), 404
    else:
        return render_template('register.html', user=user_profile, token=token, register_type=0)


@app.route('/apply_for_register/<token>')
def apply_for_register(token):
    if not BEOPDataAccess.getInstance().checkTokenValid(token):
        render_template('page_not_found.html'), 404

    user_profile = BEOPDataAccess.getInstance().getUserProfileByToken(token, 3)
    if user_profile.get('status') == 'registered':
        return render_template('page_not_found.html'), 404

    if not user_profile.get('name'):
        return render_template('page_not_found.html'), 404
    else:
        return render_template('register.html', user=user_profile, token=token, register_type=3)


@app.route('/reset_pwd_email/<token>')
def reset_pwd_email(token):
    if not BEOPDataAccess.getInstance().checkTokenValid(token):
        render_template('page_not_found.html'), 404

    user_profile = BEOPDataAccess.getInstance().getUserProfileByToken(token, 1)
    if not user_profile:
        return render_template('page_not_found.html'), 404

    return render_template('resetPassword.html', user=user_profile, token=token)


@app.route('/reset_password', methods=['POST'])
def forget_password_reset_password():
    request_data = request.get_json()
    password = request_data.get('password')
    token = request_data.get('token')
    user_profile = BEOPDataAccess.getInstance().getUserProfileByToken(token, 1)
    if not user_profile:
        return 'token not exists'
    if user_profile.get('status') != 'registered':
        return 'account not activated!'
    if BEOPDataAccess.getInstance().forget_password_reset_password(user_profile.get('id'), password):
        return 'success'
    else:
        return 'fail'


@app.route('/analysis/get_pointList_from_s3db/<projectId>')
def get_pointList_from_s3db(projectId):
    s3dbname = BEOPDataAccess.getInstance().getProjS3db(projectId)

    dll = cdll.LoadLibrary('beopWeb/lib/DataAnalysis.dll')
    dll.SystemAndPointConfig.restype = c_char_p
    szPara = create_string_buffer(
        json.dumps({"pathConfig": app.config.get('DLL_CONFIG_PATH')}).encode(encoding="utf-8"))
    strResult = dll.SystemAndPointConfig(szPara)
    typeList = json.loads(c_char_p(strResult).value.decode())

    return json.dumps({
                          'pointList': BEOPSqliteAccess.getInstance().getPointListFromS3db(s3dbname),
                          'typeList': typeList
                      }, ensure_ascii=False)


@app.route('/analysis/generalRegressor', methods=['POST'])
def generalRegressor():
    dll = cdll.LoadLibrary('beopWeb/lib/DataAnalysis.dll')
    dll.GeneralRegressor.restype = c_char_p
    szPara = create_string_buffer(json.dumps(request.get_json()).encode(encoding="utf-8"))
    strResult = dll.GeneralRegressor(szPara)
    return c_char_p(strResult).value.decode()


@app.route('/analysis/generalPredictor', methods=['POST'])
def generalPredictor():
    dll = cdll.LoadLibrary('beopWeb/lib/DataAnalysis.dll')
    dll.GeneralPredictor.restype = c_char_p
    szPara = create_string_buffer(json.dumps(request.get_json()).encode(encoding="utf-8"))
    strResult = dll.GeneralPredictor(szPara)
    return c_char_p(strResult).value.decode()


@app.route('/observer/report/check/<project>/<project_id>/<version>')
def checkReport(project, project_id, version):
    current_path = os.getcwd()
    report_dir = '\\beopWeb\\static\\projectReports\\'
    report_full_path = current_path + report_dir + 'reports\\' + project + '\\' + version + '.html'
    config_file_path = current_path + report_dir + 'config\\' + project + '.ini'

    if os.path.exists(os.path.dirname(report_full_path)) is False:
        os.mkdir(os.path.dirname(report_full_path))

    if os.path.exists(report_full_path) is False:
        report_json = ReportConfgJson().GetReportJson(version, project_id, config_file_path)
        report = render_template('report/template1.html', report=report_json)
        fp = open(report_full_path, 'wb')
        fp.write(report.encode('utf-8'))
        fp.close()

    return report_full_path[report_full_path.find('\\static'):]


@app.errorhandler(404)
def page_not_found(error):
    return render_template('page_not_found.html'), 404


def getOneItemDataRealtime(dataSourceId, itemId):
    dataSourceItemInfo = BEOPMongoDataAccess.getInstance().getDataSourceItemInfoById(itemId)
    strEquation = ''
    type =  dataSourceItemInfo.get('type')
    if type != None:
        if type != 1:
            pointList = []
            valueData = []
            ptName = dataSourceItemInfo['value']
            pointList.append(ptName)
            projId = dataSourceItemInfo['projId']
            data = BEOPDataBufferManager.getInstance().getDataByProj(projId, pointList)
            return data[ptName]
        else:
            strEquation = dataSourceItemInfo.get('value')
            if strEquation != None:
                paramList = []
                p = re.compile('<%')
                list1 = p.split(strEquation)
                q = re.compile('%>')
                for item1 in list1:
                    list2 = q.split(item1)
                    for item2 in list2:
                        if ObjectId.is_valid(item2):
                            paramList.append(item2)
                realParamList = []
                for param in paramList:
                    strVar = param.strip()
                    if strVar != '' and not strVar in realParamList:
                        if ObjectId.is_valid(strVar):
                            realParamList.append('tempvar' + strVar)
                            strEquation = strEquation.replace('<%' + strVar + '%>', 'tempvar' + strVar)
                        else:
                            bNum = True
                            try:
                                val = float(strVar)
                            except Exception as e:
                                bNum = False
                            if not bNum:
                                realParamList.append(strVar)
        realParamData = {}
        for rp in realParamList:
            itemInfo = BEOPMongoDataAccess.getInstance().getDataSourceItemInfoById(rp)
            if itemInfo != None:
                realParamData[rp] = getOneItemDataRealtime(dataSourceId, itemInfo['id'].__str__())
        strEquation = ConvertLatexToNumpy(strEquation)
        for rp in realParamList:
            try:
                locals()[rp] = '%.2f' % float(realParamData[rp])
            except Exception as e:
                print('Error: size wrong')
        result = eval(strEquation)
        return result


def getOneItemData(dataSourceId, itemId, timeStart, timeEnd, timeFormat):
    dataSourceItemInfo = BEOPMongoDataAccess.getInstance().getDataSourceItemInfoById(itemId)
    rvdata = []
    if dataSourceItemInfo != None:
        strEquation = ''
        type = dataSourceItemInfo.get('type')
        if type != None:
            if type != 1:
                pointList = []
                valueData = []
                pointList.append(dataSourceItemInfo['value'])
                projId = dataSourceItemInfo['projId']
                data = BEOPDataAccess.getInstance().get_history_data_padded_reduce(projId, pointList, timeStart, timeEnd, timeFormat)
                rtdata = []
                if 'error' not in data.keys():
                    key = ''
                    if len(data.get('data')) == 1:
                        for keys in locals()['data']['data'].keys():
                            key = keys
                            break
                    for index, time in enumerate(data.get('timeStamp')):
                        rtdata.append({'time': time, 'value': data.get('data')[key][index]})
                else:
                    return data
                return rtdata
            else:
                strEquation = dataSourceItemInfo.get('value')
                if strEquation != None:
                    paramList = []
                    p = re.compile('<%')
                    list1 = p.split(strEquation)
                    q = re.compile('%>')
                    for item1 in list1:
                        list2 = q.split(item1)
                        for item2 in list2:
                            if ObjectId.is_valid(item2):
                                paramList.append(item2)
                    realParamList = []
                    for param in paramList:
                        strVar = param.strip()
                        if strVar != '' and not strVar in realParamList:
                            if ObjectId.is_valid(strVar):
                                realParamList.append('tempvar' + strVar)
                                strEquation = strEquation.replace('<%' + strVar + '%>', 'tempvar' + strVar)
                            else:
                                bNum = True
                                try:
                                    val = float(strVar)
                                except Exception as e:
                                    bNum = False
                                if not bNum:
                                    realParamList.append(strVar)
            realParamData = {}
            ttList = []
            for rp in realParamList:
                itemInfo = BEOPMongoDataAccess.getInstance().getDataSourceItemInfoById(rp)
                if itemInfo != None:
                    rece = getOneItemData(dataSourceId, itemInfo['id'].__str__(), timeStart, timeEnd,timeFormat)
                    if isinstance(rece, dict) and 'error' in rece.keys():
                        return rece
                    else:
                        realParamData[rp] = rece
                    if len(ttList) == 0:
                        for tt in realParamData[rp]:
                            ttList.append(tt['time'])
        strEquation = ConvertLatexToNumpy(strEquation)
        for tt in range(0, len(ttList)):
            for rp in realParamList:
                try:
                    locals()[rp] = float(realParamData[rp][tt]['value'])
                except Exception as e:
                    print('Error: size wrong')
            result = eval(strEquation)
            rvdata.append(dict(time=ttList[tt], value='%.2f' % result))
    return rvdata


#TODO
def ConvertLatexToNumpy(str):
    return str.replace('\\cdot', '*').replace('^', '**').replace('\\left', '').replace('\\right', '').replace('\\frac',
                                                                                                              '').replace(
        '}{', '}/{').replace('}', ')').replace('{', '(')


@app.route('/analysis/startWorkspaceDataGenHistogram', methods=['POST'])
def startWorkspaceDataGenHistogram():
    data = request.get_json()

    dataSouceId = data.get('dataSourceId')
    itemVarIdList = data.get('dsItemIds')
    timeStart = data.get('timeStart')
    timeEnd = data.get('timeEnd')
    timeFormat = data.get('timeFormat')

    arrHistory = []
    timeRvList = []
    for item in itemVarIdList:
        data = getOneItemData(dataSouceId, item, timeStart, timeEnd, timeFormat)
        if isinstance(data, dict) and 'error' in data.keys():
            return json.dumps(data)
        else:
            valueData = []
            for i in data:
                try:
                    valueData.append('%.2f' % float(i['value']))
                except Exception as e:
                    print(e.__str__())
            arrHistory.append(dict(dsItemId=item, data=valueData))
            if len(timeRvList) == 0:
                for item in data:
                    timeRvList.append(item['time'])
    return json.dumps({"list": arrHistory, "timeShaft": timeRvList})


@app.route('/analysis/startWorkspaceDataGenPieChart', methods=['POST'])
def startWorkspaceDataGenPieChart():
    data = request.get_json()

    dataSouceId = data.get('dataSourceId')
    itemVarIdList = data.get('dsItemIds')

    arrRealtime = []
    for item in itemVarIdList:
        data = getOneItemDataRealtime(dataSouceId, item)
        arrRealtime.append(dict(dsItemId=item, data=data))
    return json.dumps(arrRealtime)


@app.route('/analysis/startWorkspaceDataGenScatterChart', methods=['POST'])
def startWorkspaceDataGenScatterChart():
    data = request.get_json()

    dataSouceId = data.get('dataSourceId')
    itemVarIdList = data.get('dsItemIds')
    timeStart = data.get('timeStart')
    timeEnd = data.get('timeEnd')
    timeFormat = data.get('timeFormat')

    arrHistory = []
    for item in itemVarIdList:
        data = getOneItemData(dataSouceId, item, timeStart, timeEnd, timeFormat)
        if isinstance(data, dict) and 'error' in data.keys():
            return json.dumps(data)
        else:
            valueData = []
            for i in data:
                try:
                    valueData.append('%.2f' % float(i['value']))
                except Exception as e:
                    print(e.__str__())
            arrHistory.append(dict(dsItemId=item, data=valueData))
    return json.dumps({"list": arrHistory})


def countPattern(fMin, fMax, fVList):
    ncount = 0
    for item in fVList:
        if item >= fMin and item < fMax:
            ncount += 1

    return ncount


@app.route('/analysis/startWorkspaceDataGenPattern', methods=['POST'])
def startWorkspaceDataGenPattern():
    data = request.get_json()

    dataSouceId = data.get('dataSourceId')
    itemVarIdList = data.get('dsItemIds')

    timeStart = data.get('timeStart')
    timeEnd = data.get('timeEnd')
    timeFormat = data.get('timeFormat')

    pMax = ''
    if 'patternMax' in data.keys():
        pMax = data.get('patternMax')

    pMin = ''
    if 'patternMin' in data.keys():
        pMin = data.get('patternMin')

    pNums = ''
    if 'patternNum' in data.keys():
        pNums = data.get('patternNum')

    if len(itemVarIdList) == 0:
        return json.dumps({"error": "need one item at least."})

    itemVarId = itemVarIdList[0]

    bAutoPattern = False
    if pMax == '' or pMin == '' or pNums == '' or pMax is None or pMin is None or pNums is None:
        bAutoPattern = True

    arrHistory = []
    data = getOneItemData(dataSouceId, itemVarId, timeStart, timeEnd, timeFormat)
    if isinstance(data, dict) and 'error' in data.keys():
        return json.dumps(data)
    else:
        valueData = []
        for i in data:
            valueData.append(float(str(i['value'])))

        if bAutoPattern:
            if len(valueData) > 0:
                pMax = max(valueData) * 1.01
                pMin = min(valueData) * 0.99
                pNums = 10

        fStep = (pMax - pMin) / pNums
        for i in range(0, pNums):
            arrHistory.append(dict(data='%.2f' % (pMin + i * fStep),
                                   pattern=countPattern(pMin + i * fStep, pMin + (i + 1) * fStep, valueData)))
        if len(arrHistory) > 0:
            arrHistory = sorted(arrHistory, key=lambda x: float(x['data']))
    return json.dumps({"list": arrHistory})


@app.route('/analysis/startWorkspaceDataGenCluster', methods=['POST'])
def startWorkspaceDataGenCluster():
    data = request.get_json()

    dataSouceId = data.get('dataSourceId')
    itemVarIdList = data.get('dsItemIds')
    timeStart = data.get('timeStart')
    timeEnd = data.get('timeEnd')
    timeFormat = data.get('timeFormat')

    history = []
    for item in itemVarIdList:
        rece = getOneItemData(dataSouceId, item, timeStart, timeEnd, timeFormat)
        if isinstance(rece, dict) and 'error' in rece.keys():
            return json.dumps(rece)
        else:
            history.append(rece)

    if len(history) == 1 and 'error' in history[0].keys():
        return json.dumps(history)

    arrTimeLabels = []
    for item in history[0]:
        if isinstance(item['time'], datetime):
            arrTimeLabels.append(item['time'].strftime('%Y-%m-%d %H:%M:%S'))
        elif isinstance(item['time'], str):
            arrTimeLabels.append(item['time'])

    arrPoints = []
    for index, name in enumerate(itemVarIdList):
        arrHistoryForDLL = []

        for itemHistory in history[index]:
            arrHistoryForDLL.append(itemHistory['value'])

        if data.get('pointType')[0] == 'X':
            type = ''
        else:
            type = data.get('pointType')[index]
        arrPoints.append({
            "name": name,
            "type": type,
            "history": arrHistoryForDLL
        })

    options = {
        "timeStart": data.get('timeStart'),
        "timeEnd": data.get('timeEnd'),
        "timeList": arrTimeLabels,
        "pathConfig": app.config.get('DLL_CONFIG_PATH'),
        "systemType": data.get('systemType'),
        "pointList": arrPoints
    }

    dll = cdll.LoadLibrary('beopWeb/lib/DataAnalysis.dll')
    dll.DataAnalysis.restype = c_char_p
    szPara = create_string_buffer(json.dumps(options).encode(encoding="utf-8"))
    strResult = dll.DataAnalysis(szPara)
    dataAnalysis = json.loads(c_char_p(strResult).value.decode())

    return json.dumps({"timeShaft": arrTimeLabels, "dataAnalysisResult": dataAnalysis})

#warning api
@app.route('/warning/getConfig/<projId>', methods=['GET'])
def getWarningConfig(projId):
    projId = int(projId)
    result = BEOPDataAccess.getInstance().getWarningConfig(projId)
    return json.dumps(result)

@app.route('/warning/getRecord/<projId>', methods=['GET'])
def getWarningRecoed(projId):
    projId = int(projId)
    result = []
    try:
        strStartTime = request.args.get('startTime')
        strEndTime = request.args.get('endTime')
        confirm = request.args.get('unconfirmed')
        if confirm != 0:
            result = BEOPDataAccess.getInstance().getWarningRecord(projId, strStartTime, strEndTime, confirm)
        else:
            result = BEOPDataAccess.getInstance().getWarningRecord(projId, strStartTime, strEndTime)
    except Exception as e:
        print(e.__str__())
    return json.dumps(result)

@app.route('/warning/modifyWarningConfig/<projId>', methods=['POST'])
def modifyWarningConfig(projId):
    result = {'status':0, 'msg':'edit rule success!'}
    projId = int(projId)
    data = request.form
    try:
        if not BEOPDataAccess.getInstance().modifyWarningConfig(projId, data):
            result = {'status':-1, 'msg':'edit rule failed!'}
    except Exception as e:
        print(e.__str__())
    return json.dumps(result)

@app.route('/warning/addWarningConfig/<projId>', methods=['POST'])
def addWarningConfig(projId):
    result = {'status':0, 'msg':'add rule success!'}
    projId = int(projId)
    data = request.form
    try:
        if not BEOPDataAccess.getInstance().addWarningConfig(projId, data):
            result = {'status':-1, 'msg':'add rule failed!'}
    except Exception as e:
        print(e.__str__())
    return json.dumps(result)

@app.route('/warning/deleteWarningConfig/<projId>', methods=['POST'])
def deleteWarningConfig(projId):
    result = {'status':0, 'msg':'delete rule success!'}
    projId = int(projId)
    data = request.form
    try:
        if not BEOPDataAccess.getInstance().deleteWarningConfig(projId, data.get('pointNames')):
            result = {'status':-1, 'msg':'delete rule failed!'}
    except Exception as e:
        print(e.__str__())
    return json.dumps(result)

@app.route('/warning/confirmWarning/<projId>',methods=['POST'])
def confirmWarning(projId):
    result = {'error':False}
    projId = int(projId)
    data = request.get_json()
    try:
        confirmed = data.get('confirmed')
        pointName = data.get('pointName')
        userName = data.get('userName')
        if not BEOPDataAccess.getInstance().confirmWarning(projId, confirmed, pointName, userName):
            result = {'error':True}
    except Exception as e:
        print(e.__str__())
    return json.dumps(result)

@app.route('/save/insertRTDataToHistory/<projId>', methods=['POST'])
def rtDataToHistory(projId):
    result = {'error':False}
    projId = int(projId)
    data = request.get_json()
    try:
        timeFormat = data.get('timeFormat')
        record = data.get('record')
        dbname = BEOPDataAccess.getInstance().getProjMysqldb(projId)
        insertData = []
        for item in record:
            assert(isinstance(item ,dict))
            inserttime = item.get('time')
            if isinstance(inserttime, str):
                inserttime = datetime.strptime(inserttime,'%Y-%m-%d %H:%M:%S')
            insertname = str(item.get('name'))
            insertvalue = str(item.get('value'))
            insertData.append((inserttime, insertname, insertvalue))
        if len(insertData) > 0:
            dbNameMongo = timeFormat+'_data_beopdata_'+dbname[len('beopdata_'):]
            rt = BEOPMongoDataAccess.getInstance().InsertTableData(insertData, dbNameMongo)
            if rt == len(insertData):
                result = {'error':False}
            else:
                result = {'error':True}
    except Exception as e:
        print(e.__str__())
        result = {'error':True}
    return json.dumps(result)

@app.route('/save/setHistoryData', methods=['POST'])
def setHistoryData():
    data = request.get_json()
    rt = {}
    try:
        projId = int(data.get('projId'))
        timeFormat = data.get('timeFormat')
        pointName = data.get('pointName')
        pointValue = data.get('pointValue')
        pointTime = data.get('timeAt')
        if isinstance(pointTime, str):
            pointTime = datetime.strptime(pointTime,'%Y-%m-%d %H:%M:%S')
        if timeFormat == 'm1':
            pointTime = pointTime.replace(second = 0)
        elif timeFormat == 'm5':
            pointTime = pointTime.replace(second = 0)
            nMinute = pointTime.minute
            nFormatMinute = int(5*(ceil(nMinute/5)))
            if nFormatMinute >= 60:
                pointTime = pointTime.replace(hour=pointTime.hour+1,minute=0)
            else:
                pointTime = pointTime.replace(minute = nFormatMinute)
        elif timeFormat == 'h1':
            pointTime = pointTime.replace(second = 0)
            pointTime = pointTime.replace(minute = 0)
        elif timeFormat == 'd1':
            pointTime = pointTime.replace(second = 0)
            pointTime = pointTime.replace(minute = 0)
            pointTime = pointTime.replace(hour = 0)
        elif timeFormat == 'M1':
            pointTime = pointTime.replace(second = 0)
            pointTime = pointTime.replace(minute = 0)
            pointTime = pointTime.replace(hour = 0)
            pointTime = pointTime.replace(day = 1)
        dbname = BEOPDataAccess.getInstance().getProjMysqldb(projId)
        dbNameMongo = timeFormat+'_data_beopdata_'+dbname[len('beopdata_'):]
        res = BEOPMongoDataAccess.getInstance().saveHistoryData(pointName, pointValue, pointTime, dbNameMongo)
        rt = {'result':res}
    except Exception as e:
        print(e.__str__())
    return json.dumps(rt)

@app.route('/save/setHistoryDataMul', methods=['POST'])
def setHistoryDataMul():
    data = request.get_json()
    rt = []
    try:
        dataList = data.get('setList')
        for item in dataList:
            projId = int(item.get('projId'))
            timeFormat = item.get('timeFormat')
            pointName = item.get('pointName')
            pointValue = item.get('pointValue')
            pointTime = item.get('timeAt')
            if isinstance(pointTime, str):
                pointTime = datetime.strptime(pointTime,'%Y-%m-%d %H:%M:%S')
            if timeFormat == 'm1':
                pointTime = pointTime.replace(second = 0)
            elif timeFormat == 'm5':
                pointTime = pointTime.replace(second = 0)
                nMinute = pointTime.minute
                nFormatMinute = int(5*(ceil(nMinute/5)))
                if nFormatMinute >= 60:
                    pointTime = pointTime.replace(hour=pointTime.hour+1,minute=0)
                else:
                    pointTime = pointTime.replace(minute = nFormatMinute)
            elif timeFormat == 'h1':
                pointTime = pointTime.replace(second = 0)
                pointTime = pointTime.replace(minute = 0)
            elif timeFormat == 'd1':
                pointTime = pointTime.replace(second = 0)
                pointTime = pointTime.replace(minute = 0)
                pointTime = pointTime.replace(hour = 0)
            elif timeFormat == 'M1':
                pointTime = pointTime.replace(second = 0)
                pointTime = pointTime.replace(minute = 0)
                pointTime = pointTime.replace(hour = 0)
                pointTime = pointTime.replace(day = 1)
            dbname = BEOPDataAccess.getInstance().getProjMysqldb(projId)
            dbNameMongo = timeFormat+'_data_beopdata_'+dbname[len('beopdata_'):]
            res = BEOPMongoDataAccess.getInstance().saveHistoryData(pointName, pointValue, pointTime, dbNameMongo)
            rt.append({'result':res})
    except Exception as e:
        print(e.__str__())
    return json.dumps(rt)

@app.route('/save/saveDataToMongodb', methods=['POST'])
def saveDataToMongodb():
    data = request.get_json()
    rt = []
    try:
        dataList = data.get('saveList')
        for item in dataList:
            projId = int(item.get('projId'))
            pointName = item.get('pointName')
            pointValue = item.get('pointValue')
            pointTime = item.get('timeAt')
            if isinstance(pointTime, str):
                pointTime = datetime.strptime(pointTime,'%Y-%m-%d %H:%M:%S')
            for timeFormat in ['m1','m5','h1','d1','M1']:
                if timeFormat == 'm1':
                    pointTime = pointTime.replace(second = 0)
                elif timeFormat == 'm5':
                    pointTime = pointTime.replace(second = 0)
                    nMinute = pointTime.minute
                    nFormatMinute = int(5*(ceil(nMinute/5)))
                    if nFormatMinute >= 60:
                        pointTime = pointTime.replace(hour=pointTime.hour+1,minute=0)
                    else:
                        pointTime = pointTime.replace(minute = nFormatMinute)
                elif timeFormat == 'h1':
                    pointTime = pointTime.replace(second = 0)
                    pointTime = pointTime.replace(minute = 0)
                elif timeFormat == 'd1':
                    pointTime = pointTime.replace(second = 0)
                    pointTime = pointTime.replace(minute = 0)
                    pointTime = pointTime.replace(hour = 0)
                elif timeFormat == 'M1':
                    pointTime = pointTime.replace(second = 0)
                    pointTime = pointTime.replace(minute = 0)
                    pointTime = pointTime.replace(hour = 0)
                    pointTime = pointTime.replace(day = 1)
                dbname = BEOPDataAccess.getInstance().getProjMysqldb(projId)
                dbNameMongo = timeFormat+'_data_beopdata_'+dbname[len('beopdata_'):]
                res = BEOPMongoDataAccess.getInstance().saveHistoryData(pointName, pointValue, pointTime, dbNameMongo)
                rt.append({'result':res})
    except Exception as e:
        print(e.__str__())
    return json.dumps(rt)

@app.route('/analysis/get_pointList_from_rtTable/<projectId>')
def get_pointList_from_rtTable(projectId):
    projectId = int(projectId)
    result = {}
    name_des_array = []
    rv = BEOPDataAccess.getInstance().get_pointList_from_rtTable(projectId)
    for item in rv:
        if len(item) > 0:
            name_des_array.append({'name': item[0], 'description': ''})
    result = {'pointList': name_des_array}
    return json.dumps(result)

@app.route('/analysis/startWorkspaceDataGenHistogramMulti', methods=['POST'])
def startWorkspaceDataGenHistogramMulti():
    result = []
    requestList = request.get_json()
    if requestList != None:
        if len(requestList) > 0:
            for sub in requestList:
                dataSouceId = sub.get('dataSourceId')
                itemVarIdList = sub.get('dsItemIds')
                timeStart = sub.get('timeStart')
                timeEnd = sub.get('timeEnd')
                timeFormat = sub.get('timeFormat')

                arrHistory = []
                timeRvList = []
                for item in itemVarIdList:
                    data = getOneItemData(dataSouceId, item, timeStart, timeEnd, timeFormat)
                    if isinstance(data, dict) and 'error' in data.keys():
                        return json.dumps(data)
                    else:
                        valueData = []
                        for i in data:
                            try:
                                valueData.append('%.2f' % float(i['value']))
                            except Exception as e:
                                print(e.__str__())
                        arrHistory.append(dict(dsItemId=item, data=valueData))
                        if len(timeRvList) == 0:
                            for item in data:
                                timeRvList.append(item['time'])
                result.append({"list": arrHistory, "timeShaft": timeRvList})
    return json.dumps(result)
