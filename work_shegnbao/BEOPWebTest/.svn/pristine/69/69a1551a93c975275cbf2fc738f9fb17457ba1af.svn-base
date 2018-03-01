# -*- coding: utf-8 -*-
"""
Routes and views for the flask application.
"""

from beopWeb import app
from beopWeb.BEOPDataAccess import *
from beopWeb.BEOPDataBufferManager import BEOPDataBufferManager
from beopWeb.BEOPSqliteAccess import *
from flask import Flask, request, session, g, make_response, redirect, url_for, abort, render_template, send_file, \
    flash, json, jsonify, escape
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
from beopWeb.views import g_userAddress
from beopWeb.MongoConnManager import MongoConnManager



DLLSERVER_ADDRESS = app.config['DLLSERVER_ADDRESS']

@app.route('/observer')
def home():
    """Renders the home page."""
    return render_template('indexObserver.html',
                           title='BEOP Energy Leader')


@app.route('/temperature')
def app_temperature():
    """Renders the temperature page."""
    return render_template('indexTemperature.html',
                           title='BEOP Energy Leader')


@app.route('/temperature/admin')
def app_temperature_admin():
    """Renders the temperature configure page."""
    return render_template('indexTemperature_admin.html',
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


# mango added 2014-11-26
@app.route('/observer/account/removeMember/<userId>/<projectId>')
def remove_member(userId, projectId):
    return json.dumps(BEOPDataAccess.getInstance().remove_member(userId, projectId), ensure_ascii=False)


# mango added 2014-11-27
@app.route('/observer/account/resetLevel/<memberId>/<roleId>/<projectId>')
def reset_level(memberId, roleId, projectId):
    return json.dumps(BEOPDataAccess.getInstance().reset_level(memberId, roleId, projectId), ensure_ascii=False)


@app.route('/observersq')
def homeSQ():
    """Renders the home page."""
    return render_template('indexObserver_SQ.html',
                           title='Home Page',
                           year=datetime.now().year, )


# mango added 2014-11-27
@app.route('/observer/account/resetPassword', methods=['POST'])
def reset_password():
    print('reset_password')
    rdata = request.get_json()
    return BEOPDataAccess.getInstance().reset_password(rdata)


# mango added 2014-11-27
@app.route('/observer/account/getDetails/<userId>')
def get_details(userId):
    return BEOPDataAccess.getInstance().get_details(userId)


# mango added 2014-11-27
@app.route('/observer/account/resetUserInfo', methods=['POST'])
def reset_user_info():
    print('reset_user_info')
    rdata = request.get_json()
    user_id = rdata.get('id')
    user_name = rdata.get('name')
    user_mail = rdata.get('mail')
    return BEOPDataAccess.getInstance().reset_user_info(user_id.user_name, user_mail)


# mango added 2014-11-27
@app.route('/observer/account/forgetPassword/<userId>')
def forget_pass(userId):
    return BEOPDataAccess.getInstance().forget_pass(userId)


@app.route('/get_plant/<proj>')
@app.route('/get_plant/<proj>/<pageid>')
@app.route('/get_plant/<proj>/<pageid>/<userId>')
def get_plant(proj=1, pageid=10000158, userId=0):
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
    nav, funcNav, benchmark = MongoConnManager.getMongoConnByName().getCustomNavAllByRoleAndProject(proj, roles)
    return jsonify(observerPages=rv, navItems=nav, funcNavItems=funcNav, benchmark=benchmark)


@app.route('/get_s3db_pages/<proj>/<userID>')
def get_s3db_pages(proj, userID):
    s3dbname = BEOPDataAccess.getInstance().getProjS3db(proj)
    rv = BEOPSqliteAccess.getInstance().getPlantPageDetails(s3dbname, False)
    return jsonify(pages=rv)


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
    ptList = []
    typeList = None
    custom = None
    if s3dbname != None:
        try:
            s3dbptList, ptListFroms3db = BEOPSqliteAccess.getInstance().getPointListFromS3dbEx(s3dbname)
            if s3dbptList != None:
                ptList = s3dbptList
            custom = BEOPSqliteAccess.getInstance().getCustomNameInPtListFromS3dbEx(s3dbname)
            mysqlRv = BEOPDataAccess.getInstance().get_pointList_from_rtTable(int(projectId))
            sets3db = set()
            if ptListFroms3db != None:
                sets3db = set(ptListFroms3db)
            setmysql = set(mysqlRv)
            mysqlpluss3db = setmysql - sets3db
            mysqlpluss3db_list = list(mysqlpluss3db)
            if len(mysqlpluss3db_list) > 0:
                for item in mysqlpluss3db_list:
                    ptList.append({'name': item, 'description': ''})
        except Exception as e:
            logging.error(e.__str__())
            logging.exception(e)
    return jsonify({'pointList': ptList if ptList != None else [],
                    'customName': custom if custom != None else []
                   })


@app.route('/analysis/generalRegressor', methods=['POST'])
def generalRegressor():
    # request.(http://114.215..../analysis/generalRegressor, post=)
    #dll = cdll.LoadLibrary(dllname)
    #dll.GeneralRegressor.restype = c_char_p
    #szPara = create_string_buffer(json.dumps(request.get_json()).encode(encoding="utf-8"))
    #strResult = dll.GeneralRegressor(szPara)
    try:
        headers = {'content-type': 'application/json'}
        data = request.get_json()
        rt = requests.post('%s/analysis/generalRegressor'%DLLSERVER_ADDRESS, data=json.dumps(data) , headers=headers)
    except Exception as e:
        logging.error(e.__str__())
        logging.exception(e)
    return rt.text


@app.route('/analysis/generalPredictor', methods=['POST'])
def generalPredictor():
    #dll = cdll.LoadLibrary(dllname)
    #dll.GeneralPredictor.restype = c_char_p
    #szPara = create_string_buffer(json.dumps(request.get_json()).encode(encoding="utf-8"))
    #strResult = dll.GeneralPredictor(szPara)
    try:
        headers = {'content-type': 'application/json'}
        data = request.get_json()
        rt = requests.post('%s/analysis/generalPredictor'%DLLSERVER_ADDRESS, data=json.dumps(data), headers=headers)
    except Exception as e:
        logging.error(e.__str__())
        logging.exception(e)
    return rt.text


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
    dataSourceItemInfo = MongoConnManager.getMongoConnByName().getDataSourceItemInfoById(itemId)
    if dataSourceItemInfo != None:
        strEquation = ''
        type = dataSourceItemInfo.get('type')
        if type != None:
            if type != 1:
                pointList = []
                valueData = []
                ptName = dataSourceItemInfo['value']
                pointList.append(ptName)
                projId = dataSourceItemInfo['projId']
                data = BEOPDataBufferManager.getInstance().getDataByProj(projId, pointList)
                return data.get(ptName, '0.0')
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
                itemInfo = MongoConnManager.getMongoConnByName().getDataSourceItemInfoById(rp)
                if itemInfo != None:
                    realParamData[rp] = getOneItemDataRealtime(dataSourceId, itemInfo['id'].__str__())
            strEquation = ConvertLatexToNumpy(strEquation)
            for rp in realParamList:
                bNum = True
                temp = 0.0
                try:
                    temp = float(realParamData[rp])
                except Exception as e:
                    bNum = False
                if bNum:
                    locals()[rp] = float('%.2f' % temp)
                else:
                    locals()[rp] = temp
            result = eval(strEquation)
            return result


def getOneItemData(dataSourceId, itemId, timeStart, timeEnd, timeFormat):
    dataSourceItemInfo = MongoConnManager.getMongoConnByName().getDataSourceItemInfoById(itemId)
    ttList = []
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
                data = BEOPDataAccess.getInstance().get_history_data_padded_reduce(projId, pointList, timeStart,
                                                                                   timeEnd, timeFormat)
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
            for rp in realParamList:
                itemInfo = MongoConnManager.getMongoConnByName().getDataSourceItemInfoById(rp)
                if itemInfo != None:
                    rece = getOneItemData(dataSourceId, itemInfo['id'].__str__(), timeStart, timeEnd, timeFormat)
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
                bNum = True
                temp = 0.0
                try:
                    temp = float(realParamData[rp][tt]['value'])
                except Exception as e:
                    bNum = False
                if bNum:
                    locals()[rp] = float('%.2f' % temp)
                else:
                    locals()[rp] = temp
            try:
                result = eval(strEquation)
            except Exception as e:
                result = 0
            rvdata.append(dict(time=ttList[tt], value='%.2f' % result))
    return rvdata


# TODO
def ConvertLatexToNumpy(str):
    return str.replace('\\cdot', '*')\
        .replace('^', '**')\
        .replace('\\left', '')\
        .replace('\\right', '')\
        .replace('\\frac','')\
        .replace('}{', '}/{')\
        .replace('}', ')')\
        .replace('{', '(')


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
        if not (isinstance(data, dict) and 'error' in data.keys()):
            valueData = []
            for i in data:
                bNum = True
                temp = 0.0
                try:
                    temp = float(i['value'])
                except Exception as e:
                    bNum = False
                if bNum:
                    valueData.append(float('%.2f' % temp))
                else:
                    valueData.append(temp)
            arrHistory.append(dict(dsItemId=item, data=valueData))
            if len(timeRvList) == 0:
                for item in data:
                    timeRvList.append(item['time'])
        else:
            arrHistory.append(dict(dsItemId=item, data=[]))
    return json.dumps({"list": arrHistory, "timeShaft": timeRvList})


@app.route('/analysis/startWorkspaceDataGenPieChart', methods=['POST'])
def startWorkspaceDataGenPieChart():
    data = request.get_json()

    dataSouceId = data.get('dataSourceId')
    itemVarIdList = data.get('dsItemIds', [])

    arrRealtime = []
    for item in itemVarIdList:
        data = getOneItemDataRealtime(dataSouceId, item)
        arrRealtime.append(dict(dsItemId=item, data=data))
    return json.dumps({'dsItemList': arrRealtime})


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
        if not (isinstance(data, dict) and 'error' in data.keys()):
            valueData = []
            for i in data:
                try:
                    valueData.append('%.2f' % float(i['value']))
                except Exception as e:
                    print(e.__str__())
            arrHistory.append(dict(dsItemId=item, data=valueData))
        else:
            arrHistory.append(dict(dsItemId=item, data=[]))
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

    pMax = data.get('patternMax','')
    pMin = data.get('patternMin','')
    pNums = data.get('patternNum','')

    if len(itemVarIdList) == 0:
        return json.dumps({"error": "need one item at least."})

    itemVarId = itemVarIdList[0]

    bAutoPattern = False
    if pMax == '' or pMin == '' or pNums == '' or pMax is None or pMin is None or pNums is None:
        bAutoPattern = True

    arrHistory = []
    data = getOneItemData(dataSouceId, itemVarId, timeStart, timeEnd, timeFormat)
    if not (isinstance(data, dict) and 'error' in data.keys()):
        valueData = []
        for i in data:
            bNum = True
            temp = 0.0
            try:
                temp = float(i['value'])
            except Exception as e:
                bNum = False
            if bNum:
                valueData.append(float('%.2f' % temp))
            else:
                valueData.append(temp)
        if bAutoPattern:
            if len(valueData) > 0:
                pMax = max(valueData) * 1.01
                pMin = min(valueData) * 0.99
            else:
                pMax = 0
                pMin = 0
            pNums = 10
        else:
            try: pMax = float(pMax)
            except: pMax = 0
            try: pMin = float(pMin)
            except: pMin = 0
            try: pNums = int(pNums)
            except: pNums = 10
        fStep = (pMax - pMin) / pNums
        for i in range(0, pNums):
            arrHistory.append(dict(data='%.2f' % (pMin + i * fStep),
                                   pattern=countPattern(pMin + i * fStep, pMin + (i + 1) * fStep, valueData)))
        if len(arrHistory) > 0:
            arrHistory = sorted(arrHistory, key=lambda x: float(x['data']))
    else:
        arrHistory.append({})
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
        if not (isinstance(rece, dict) and 'error' in rece.keys()):
            history.append(rece)

    if len(history) <= 1:  # and 'error' in history[0].keys()
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
            arrHistoryForDLL.append(str(itemHistory['value']))

        if data.get('pointType')[0] == 'X':
            type = ''
        else:
            if data.get('pointType') != None:
                if index < len(data.get('pointType')):
                    type = data.get('pointType')[index]
                else:
                    type = ''
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

    #dll = cdll.LoadLibrary(dllname)
    #dll.DataAnalysis.restype = c_char_p
    #szPara = create_string_buffer(json.dumps(options).encode(encoding="utf-8"))
    #strResult = dll.DataAnalysis(szPara)
    #dataAnalysis = json.loads(c_char_p(strResult).value.decode())
    try:
        headers = {'content-type': 'application/json'}
        data = {'options':options}
        rt = requests.post('%s/analysis/startWorkspaceDataGenCluster'%DLLSERVER_ADDRESS, data=json.dumps(data), headers=headers)
    except Exception as e:
        logging.error(e.__str__())
        logging.exception(e)
    dataAnalysis = json.loads(rt.text)
    return json.dumps({"timeShaft": arrTimeLabels, "dataAnalysisResult": dataAnalysis})


# warning api
@app.route('/warning/getConfig/<projId>', methods=['GET'])
def getWarningConfig(projId):
    projId = int(projId)
    result = BEOPDataAccess.getInstance().getWarningConfig(projId)
    return json.dumps(result)


@app.route('/warning/getRecord/<projId>', methods=['POST'])
def getWarningRecoed(projId):
    projId = int(projId)
    result = []
    try:
        data = request.get_json()
        strStartTime = data.get('startTime')
        strEndTime = data.get('endTime')
        confirm = data.get('unconfirmed')
        if confirm != 0:
            result = BEOPDataAccess.getInstance().getWarningRecord(projId, strStartTime, strEndTime, confirm)
        else:
            result = BEOPDataAccess.getInstance().getWarningRecord(projId, strStartTime, strEndTime)
    except Exception as e:
        print(e.__str__())
    return json.dumps(result)


@app.route('/warning/modifyWarningConfig/<projId>', methods=['POST'])
def modifyWarningConfig(projId):
    result = {'status': 0, 'msg': 'edit rule success!'}
    projId = int(projId)
    data = request.form
    try:
        if not BEOPDataAccess.getInstance().modifyWarningConfig(projId, data):
            result = {'status': -1, 'msg': 'edit rule failed!'}
    except Exception as e:
        print(e.__str__())
    return json.dumps(result)


@app.route('/warning/addWarningConfig/<projId>', methods=['POST'])
def addWarningConfig(projId):
    result = {'status': 0, 'msg': 'add rule success!'}
    projId = int(projId)
    data = request.form
    try:
        if not BEOPDataAccess.getInstance().addWarningConfig(projId, data):
            result = {'status': -1, 'msg': 'add rule failed!'}
    except Exception as e:
        print(e.__str__())
    return json.dumps(result)


@app.route('/warning/deleteWarningConfig/<projId>', methods=['POST'])
def deleteWarningConfig(projId):
    result = {'status': 0, 'msg': 'delete rule success!'}
    projId = int(projId)
    data = request.form
    try:
        if not BEOPDataAccess.getInstance().deleteWarningConfig(projId, data.get('pointNames')):
            result = {'status': -1, 'msg': 'delete rule failed!'}
    except Exception as e:
        print(e.__str__())
    return json.dumps(result)


@app.route('/warning/confirmWarning/<projId>', methods=['POST'])
def confirmWarning(projId):
    result = {'error': False}
    projId = int(projId)
    data = request.get_json()
    try:
        confirmed = data.get('confirmed')
        pointName = data.get('pointName')
        userName = data.get('userName')
        if not BEOPDataAccess.getInstance().confirmWarning(projId, confirmed, pointName, userName):
            result = {'error': True}
    except Exception as e:
        print(e.__str__())
    return json.dumps(result)

@app.route('/analysis/get_pointList_from_rtTable/<projectId>')
def get_pointList_from_rtTable(projectId):
    projectId = int(projectId)
    result = {}
    name_des_array = []
    rv = BEOPDataAccess.getInstance().get_pointList_from_rtTable(projectId)
    return json.dumps(rv)


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
                    if not (isinstance(data, dict) and 'error' in data.keys()):
                        valueData = []
                        for i in data:
                            bNum = True
                            temp = 0.0
                            try:
                                temp = float(i['value'])
                            except Exception as e:
                                bNum = False
                            if bNum:
                                valueData.append(float('%.2f' % temp))
                            else:
                                valueData.append(temp)
                        arrHistory.append(dict(dsItemId=item, data=valueData))
                        if len(timeRvList) == 0:
                            for item in data:
                                timeRvList.append(item['time'])
                    else:
                        arrHistory.append(dict(dsItemId=item, data=[]))
                result.append({"list": arrHistory, "timeShaft": timeRvList})
    return json.dumps(result)

@app.route('/projectMap/update')
def updateProjectLocateMap():
    if BEOPDataAccess.getInstance().UpdateProjectLocateMap():
        return json.dumps(True, ensure_ascii = False)
    return json.dumps(False, ensure_ascii = False)

@app.route('/expressAnalysis/calc', methods=['POST'])
def expressCalc():
    data = request.get_json()
    if data:
        strExpress = data.get('express', '')
        strExpress = ConvertLatexToNumpy(strExpress)
        dictParams = data.get('params', {})
        targetName = data.get('target', '')
        keyNameList = []
        keyValueList = []
        paramListLen = 0
        if not strExpress or not dictParams or not targetName:
            return json.dumps({'error':'invalid params'}, ensure_ascii = False)
        if targetName not in dictParams.keys():
            return json.dumps({'error':'params should include target'}, ensure_ascii = False)
        for key in dictParams.keys():
            if key not in strExpress:
                return json.dumps({'error':'express should include key which is in params'}, ensure_ascii = False)
            if not key:
                return json.dumps({'error':'key in params is invalid'}, ensure_ascii = False)
            if not dictParams[key]:
                return json.dumps({'error':'value of key in params is zero'}, ensure_ascii = False)
            keyNameList.append(key)
            keyValueList.append(dictParams[key])

        resValueList = []

        if len(keyValueList) == 1 and len(keyNameList) == 1:
            try:
                for index in range(len(keyValueList[0])):
                    strExpressBase = strExpress
                    strExpressBase = strExpressBase.replace(keyNameList[0], str(keyValueList[0][index]))
                    strExpressBase = strExpressBase.replace('\\&', ' and ')
                    strExpressBase = strExpressBase.replace('\\mid', ' or ')
                    strExpressBase = strExpressBase.replace('!=', '$')
                    strExpressBase = strExpressBase.replace('!', ' not ')
                    strExpressBase = strExpressBase.replace('$', ' != ')
                    res = eval(strExpressBase)
                    if isinstance(res, bool):
                        if res:
                            resValueList.append(dictParams[targetName][index])
                        else:
                            resValueList.append(None)
                    else:
                        resValueList.append(res)
            except Exception as e:
                print(e)
                logging.error(e)
            return json.dumps({'name':targetName, 'data':resValueList}, ensure_ascii = False)

        for index in range(len(keyValueList)-1):
            if len(keyValueList[index]) != len(keyValueList[index+1]):
                return json.dumps({'error':'lengths of params are different'}, ensure_ascii = False)
            else:
                paramListLen = len(keyValueList[index])

        try:
            for j in range(paramListLen):
                strExpressBase = strExpress
                for i in range(len(keyNameList)):
                    strExpressBase = strExpressBase.replace(keyNameList[i], str(keyValueList[i][j]))
                strExpressBase = strExpressBase.replace('\\&', ' and ')
                strExpressBase = strExpressBase.replace('\\mid', ' or ')
                strExpressBase = strExpressBase.replace('!=', '$')
                strExpressBase = strExpressBase.replace('!', ' not ')
                strExpressBase = strExpressBase.replace('$', ' != ')
                res = eval(strExpressBase)
                if isinstance(res, bool):
                    if res:
                        resValueList.append(dictParams[targetName][j])
                    else:
                        resValueList.append(None)
                else:
                    resValueList.append(res)
        except Exception as e:
            print(e)
            logging.error(e)
        return json.dumps({'name':targetName, 'data':resValueList}, ensure_ascii = False)

    return json.dumps({'error':'post params invalid'}, ensure_ascii = False)