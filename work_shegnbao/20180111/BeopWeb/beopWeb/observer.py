# -*- coding: utf-8 -*-
"""
Routes and views for the flask application.
"""
import threading
import pika
import sys
import logging
import numpy
import os
import json
import re
import time
import hashlib
from ctypes import *
from datetime import datetime
import mysql.connector
from flask_cors import cross_origin
from flask import Flask, request, g, make_response, redirect, url_for, abort, render_template, send_file, \
    flash, json, jsonify, escape, current_app

from beopWeb import app
from beopWeb.BEOPDataAccess import *
from beopWeb.BEOPSqliteAccess import *
from beopWeb.sqlite_op import sqlite3
from beopWeb.ReportParser import *
from beopWeb.BEOPMongoDataAccess import BEOPMongoDataAccess
from beopWeb.MongoConnManager import MongoConnManager
from beopWeb.AuthManager import AuthManager
from beopWeb.mod_admin.BeOPPermission import BeOPPermission
from beopWeb.mod_workflow.VerisionHistory import VersionHistory
from beopWeb.models import checkPassword, effect_num
from beopWeb.mod_cxTool.PointTable import CloudPointType
from beopWeb.mod_common.BrowserUtils import BrowserUtils
from beopWeb.mod_common import i18n
from beopWeb.mod_common.RequestCenter import RequestCenter
from beopWeb.mod_admin import Management as Management
from beopWeb.models import isAllCloudPointName


DLLSERVER_ADDRESS = app.config['DLLSERVER_ADDRESS']


def login_after(userId, project_code=None):
    userProfile = BEOPDataAccess.getInstance().getUserProfileById(userId)
    rv = dict(status=True, id=userId, projects=BEOPDataAccess.getInstance().getProject(userId, project_code),
              userProfile=userProfile)
    # 返回访问IP用来判断地图
    rv['ip'] = request.remote_addr if request.remote_addr else None

    config = MongoConnManager.getConfigConn().getUserConfig(userId)
    rv['config'] = config
    # 返回版本号
    vh = VersionHistory()
    result = vh.get_code_version()
    if result:
        rv["version"] = result[0]
    try:
        vn = vh.get_version_history(rv.get('id'))
        rv["versionNotification"] = vn[0] if len(vn) else None
    except Exception as e:
        pass

    if rv and rv.get('id') is not None:
        try:
            rv['permission'] = BeOPPermission.get_permissions_by_user_id(rv.get('id'))
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
            rv['permission'] = {}

    user = User()
    rv['userinfo'] = user.query_user_by_id(userId, 'userfullname')
    return json.dumps(rv, ensure_ascii=False)


@app.route('/observer')
def home():
    # 检查浏览器版本
    if not BrowserUtils.is_support_browser(request.user_agent):
        language = BrowserUtils.get_browser_accept_language(request.accept_languages)
        i18n.set_lang(language)
        browser, version = BrowserUtils.get_browser_info(request.user_agent)
        config_map = {'version': version, 'browser': browser,
                      'language': language}
        return render_template('errors/not_support_browser.html', config_map=config_map)

    """Renders the home page."""
    rt = AuthManager.check_token(AuthManager.secret_key)
    user_id = request.cookies.get('userId', None)
    if rt.get('status') != AuthManager.token_valid:
        return render_template('indexObserver.html', icon='favicon', title='BeOP')
    else:
        rv = login_after(user_id)
        return render_template('indexObserverLoad.html', title='BeOP', AppConfig=rv)


@app.route('/temperature')
def app_temperature():
    """Renders the temperature page."""
    return render_template('indexTemperature.html',
                           title='BeOP')


@app.route('/temperature/admin')
def app_temperature_admin():
    """Renders the temperature configure page."""
    return render_template('indexTemperature_admin.html',
                           title='BeOP')


@app.route('/dashboard')
def app_dashboard():
    """Renders the temperature configure page."""
    return render_template('indexDashboard.html',
                           title='BEOP DashBoard')


@app.route('/inputApp')
def app_inputApp():
    """Renders the temperature configure page."""
    return render_template('indexInputApp.html',
                           title='BEOP Input')


# TEST: /share/db/262/3/5509098a199d840b00de824e
@app.route('/share/db/<userId>/<menuId>')
def share_analysis(userId, menuId):
    """Renders the share dashboard page."""
    return render_template('shareDashBoard.html',
                           title='Share',
                           userId=userId,
                           menuId=menuId)


@app.route('/contact')
def page_contact():
    """Renders the temperature page."""
    return render_template('contact.html',
                           title='Contact R&B')

@app.route('/contact/v2')
def page_contact_v2():
    """Renders the temperature page."""
    return render_template('contactV2.html',
                           title='Contact R&B')



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


@app.route('/get_plant_pagedetails/<int:proj>/<userID>')
@app.route('/get_plant_pagedetails/<int:proj>/<userID>/<i18n>')
def get_plant_pagedetailsPlus(proj, userID, i18n='default'):
    # 由于这个函数会在切换项目时被调用，所以在这里检查目标项目是不是在当前集群，若否，返回一个特殊的goToCluster消息给前端去做页面跳转
    if app.config.get('CROSS_CLUSTER_REDIRECT'):
        project_cluster = RequestCenter.get_cluster_by_proj_id(proj)
        if project_cluster and project_cluster["clusterName"] != app.config.get("BEOPCLUSTER"):
            return jsonify(goToCluster=project_cluster['beopwebHttp'])

    if userID != 'all':
        s3dbname = BEOPDataAccess.getInstance().getProjS3db(proj)
        rv = BEOPSqliteAccess.getInstance().getPlantPageDetails(s3dbname)
        roles = BEOPDataAccess.getInstance().getUserRolesInProject(userID, proj)
        group = BEOPSqliteAccess.getInstance().getPlantGroupDetails(s3dbname)
        nav, funcNav, benchmark = MongoConnManager.getConfigConn().getCustomNavAllByRoleAndProject(proj, roles, i18n)
        for x in nav:
            if x['type'] == 'PageScreen':
                x.pop('layerList', None)
                x.pop('option', None)

        return jsonify(observerPages=rv, navItems=nav, funcNavItems=funcNav, benchmark=benchmark, groupInfo=group)
    else:
        nav = MongoConnManager.getConfigConn().getCustomNavByProjectId(proj)
        for x in nav:
            x['id'] = x['_id']
            if x['type'] == 'PageScreen':
                x.pop('layerList', None)
                x.pop('option', None)
        return jsonify(navItems=nav)


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

    newPwd = data.get("password")
    check_code = checkPassword(data.get("name"), newPwd)
    if 0 != check_code:
        return json.dumps({'status': False, 'error': check_code})

    return BEOPDataAccess.getInstance().regist(data.get("name"), newPwd, data.get("token"),
                                               data.get("type"))


@app.route('/register_new_user', methods=['POST'])
def register_new_user():
    '''
    注册新用户接口
    :return:
    '''
    data = request.get_json()
    # 验证码
    captcha = str(data["captcha"]).strip()
    account = data["account"]

    code_key = 'new@' + str(account)
    # 判断验证码是否正确
    if not RedisManager.get(code_key):
        return Utils.beop_response_error(code='EXPIRED_CAPTCHA')

    if not captcha or captcha != str(RedisManager.get(code_key)):
        return Utils.beop_response_error(code='INVALID_CAPTCHA')

    if not account or not account.strip():
        return Utils.beop_response_error(code='EMPTY_ACCOUNT')
    account = account.strip()
    phone = None
    mail = None
    # 判断帐号是手机号码还是邮箱地址
    if Utils.is_phone(account):
        phone = account
    elif Utils.is_email(account):
        mail = account

    password = data["password"]
    if not password or not password.strip():
        return Utils.beop_response_error(code='EMPTY_PASSWORD')
    password = password.strip()

    if checkPassword(account, password):
        return Utils.beop_response_error(code='INVALID_PASSWORD')

    if BEOPDataAccess.getInstance().is_user_existed(mail, phone):
        return Utils.beop_response_error(code='EXISTED_USER')
    #判断是手机号还是邮箱地址，邮箱地址则username为mail,手机号则username为phone
    try:
        user_id = BEOPDataAccess.getInstance().register_new_user(username=account, phone=phone, password=password)
        return Utils.beop_response_success(user_id)
    except Exception as e:
        return Utils.beop_response_error(code='REGISTER_FAILED', msg=str(e))


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
    host_url = request.host_url
    if not email:
        return 'email is empty'
    return BEOPDataAccess.getInstance().send_reset_pwd_email(host_url, email)


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
    if True:
        args = {
            'user': user_profile,
            'token': token,
            'register_type': 0,
            'platform': 'BeOP'
        }
        if user_profile.get('management'):
            if i18n.get_lang() == 'en-US':
                name_key = 'name_en'
            else:
                name_key = 'name_cn'
            management_info = Management.get_management_detail(user_profile.get('management'))
            args.update({'platform':management_info.get(name_key)})
        return render_template('register.html', **args)


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
        return json.dumps({'status': False, 'error': 'token not exists'})

    if user_profile.get('status') != 'registered':
        return json.dumps({'status': False, 'error': 'account not activated!'})

    check_code = checkPassword(user_profile.get('fullname'), password)
    if 0 != check_code:
        return json.dumps({'status': False, 'error': check_code})
    if BEOPDataAccess.getInstance().forget_password_reset_password(user_profile.get('id'), password):
        return json.dumps({'status': True})
    else:
        return json.dumps({'status': False, 'error': check_code})


@app.route('/analysis/get_pointList_from_s3db/<_projectId>/<_curPageCnt>/<_pageEachNum>')
def get_pointList_from_s3db(_projectId, _curPageCnt, _pageEachNum):
    projectId = int(_projectId)
    s3dbname = BEOPDataAccess.getInstance().getProjS3db(projectId)
    ptList = []
    custom = None
    curPageCnt = int(_curPageCnt)
    pageEachNum = int(_pageEachNum)
    if s3dbname != None:
        try:
            lenS3db = BEOPSqliteAccess.getInstance().getLengthInPtListFromS3dbEx(s3dbname)
            countS3db = math.ceil(float(lenS3db) / pageEachNum)
            lenMysql = BEOPDataAccess.getInstance().get_length_in_pointList_from_rtTable(projectId)
            countMysql = math.ceil(float(lenMysql) / pageEachNum)

            sets3db = set()
            if lenS3db > 0:
                s3dbptList, ptListFroms3db = BEOPSqliteAccess.getInstance().getPointListFromS3dbEx(s3dbname,
                                                                                                   curPageCnt * pageEachNum,
                                                                                                   pageEachNum)
                if s3dbptList != None:
                    ptList = s3dbptList
                custom = BEOPSqliteAccess.getInstance().getCustomNameInPtListFromS3dbEx(s3dbname)
                if ptListFroms3db != None:
                    sets3db = set(ptListFroms3db)
            if 0 == len(ptList) or -1 == pageEachNum:
                mysqlRv = BEOPDataAccess.getInstance().get_pointList_from_rtTable_ex(projectId, (
                    curPageCnt - countS3db) * pageEachNum, pageEachNum)
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
                    'customName': custom if custom != None else [],
                    'pageAllNum': (countS3db + countMysql)
                    })


@app.route('/analysis/generalRegressor', methods=['POST'])
def generalRegressor():
    # request.(http://114.215..../analysis/generalRegressor, post=)
    # dll = cdll.LoadLibrary(dllname)
    # dll.GeneralRegressor.restype = c_char_p
    # szPara = create_string_buffer(json.dumps(request.get_json()).encode(encoding="utf-8"))
    # strResult = dll.GeneralRegressor(szPara)
    try:
        headers = {'content-type': 'application/json'}
        data = request.get_json()
        rt = requests.post('%s/analysis/generalRegressor' % DLLSERVER_ADDRESS, data=json.dumps(data), headers=headers)
    except Exception as e:
        logging.error(e.__str__())
        logging.exception(e)
    return rt.text


@app.route('/analysis/generalPredictor', methods=['POST'])
def generalPredictor():
    # dll = cdll.LoadLibrary(dllname)
    # dll.GeneralPredictor.restype = c_char_p
    # szPara = create_string_buffer(json.dumps(request.get_json()).encode(encoding="utf-8"))
    # strResult = dll.GeneralPredictor(szPara)
    try:
        headers = {'content-type': 'application/json'}
        data = request.get_json()
        rt = requests.post('%s/analysis/generalPredictor' % DLLSERVER_ADDRESS, data=json.dumps(data), headers=headers)
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


# 在云点中获取真实点名, 映射点返回映射的现场点, 虚拟点及计算点返回该点点名
def get_real_pt_name_in_cloud_point(point):
    if not point or not point.get('params'):
        return point.get('value')
    flags = point.get('params').get('flag')
    ret = None
    if flags == CloudPointType.MAPPING_POINT:
        mapping = point.get('params').get('mapping')
        if mapping:
            ret = mapping.get('point')
    else:
        ret = point.get('value')
    return ret


def getItemsDataPointName(dataSouceId, itemVarIdList):
    rt = []
    if itemVarIdList:
        dataSourceItemInfos = []
        objectIdList = [x for x in itemVarIdList if ObjectId.is_valid(x)]
        atIdList = list(set(itemVarIdList) - set(objectIdList))
        dataSourceItemInfos.extend(MongoConnManager.getConfigConn().getDataSourceItemInfoByIds(objectIdList))
        dataSourceItemInfos.extend(MongoConnManager.getConfigConn().get_DataSource_MappingPoint_by_values(atIdList))
        for dataSourceItemInfo in dataSourceItemInfos:
            if dataSourceItemInfo != None:
                _id = str(dataSourceItemInfo.get('_id'))
                strEquation = ''
                realParamList = []
                type = dataSourceItemInfo.get('type')
                if type != None:
                    if type == 0:  # site
                        projId = dataSourceItemInfo['projId']
                        ptName = dataSourceItemInfo['value']
                        if projId is None or ptName is None:
                            rt.append((None, _id))
                        else:
                            rt.append(((int(projId), ptName), _id))
                    elif type == 1:
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
                    elif type == 4:
                        projId = dataSourceItemInfo['projId']
                        ptName = get_real_pt_name_in_cloud_point(dataSourceItemInfo)
                        if projId is None or ptName is None:
                            rt.append((None, _id))
                        else:
                            rt.append(((int(projId), ptName), _id))
    m = set(itemVarIdList) - set([x[1] for x in rt])
    rt.extend([(None, x) for x in m])
    return rt


# add golding
def getOneItemDataPointName(dataSourceId, itemId):
    dataSourceItemInfo = {}
    result = None
    if ObjectId.is_valid(itemId):
        dataSourceItemInfo = MongoConnManager.getConfigConn().getDataSourceItemInfoById(itemId)
    else:
        dataSourceItemInfo = MongoConnManager.getConfigConn().get_DataSource_MappingPoint_by_value(itemId)
    if dataSourceItemInfo != None:
        strEquation = ''
        realParamList = []
        type = dataSourceItemInfo.get('type')
        if type != None:
            if type == 0:  # site
                projId = dataSourceItemInfo['projId']
                ptName = dataSourceItemInfo['value']
                if projId is None or ptName is None:
                    return None
                return (int(projId), ptName)
            elif type == 1:
                logging.error("error in getOneItemDataPointName: enter equation!!!!")
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
            elif type == 4:
                projId = dataSourceItemInfo['projId']
                ptName = get_real_pt_name_in_cloud_point(dataSourceItemInfo)
                if projId is None or ptName is None:
                    return None
                return (int(projId), ptName)

    return None


def getOneItemDataRealtime(dataSourceId, itemId):
    dataSourceItemInfo = {}
    result = None
    if ObjectId.is_valid(itemId):
        dataSourceItemInfo = MongoConnManager.getConfigConn().getDataSourceItemInfoById(itemId)
    else:
        dataSourceItemInfo = MongoConnManager.getConfigConn().get_DataSource_MappingPoint_by_value(itemId)
    if dataSourceItemInfo != None:
        strEquation = ''
        realParamList = []
        type = dataSourceItemInfo.get('type')
        if type != None:
            if type == 0:
                pointList = []
                ptName = dataSourceItemInfo['value']
                pointList.append(ptName)
                projId = dataSourceItemInfo['projId']
                data = BEOPDataAccess.getInstance().getBufferRTDataByProj(projId,
                                                                          pointList)  # BEOPDataBufferManager.getInstance().getDataByProj(projId, pointList)
                return data.get(ptName, '0.0')
            elif type == 1:
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
            elif type == 4:
                pointList = []
                ptName = get_real_pt_name_in_cloud_point(dataSourceItemInfo)
                if ptName:
                    pointList.append(ptName)
                projId = dataSourceItemInfo['projId']
                data = BEOPDataAccess.getInstance().getBufferRTDataByProj(projId,
                                                                          pointList)  # BEOPDataBufferManager.getInstance().getDataByProj(projId, pointList)
                return data.get(ptName, '0.0')
            realParamData = {}
            for rp in realParamList:
                itemInfo = MongoConnManager.getConfigConn().getDataSourceItemInfoById(rp)
                if itemInfo != None:
                    realParamData[rp] = getOneItemDataRealtime(dataSourceId, itemInfo['_id'].__str__())
            strEquation = ConvertLatexToNumpy(strEquation)
            for rp in realParamList:
                bNum = True
                temp = 0.0
                try:
                    temp = float(realParamData[rp])
                except Exception as e:
                    bNum = False
                if bNum:
                    locals()[rp] = effect_num(temp, 2)
                else:
                    locals()[rp] = temp
            result = 0
            try:
                result = eval(strEquation)
            except Exception as e:
                print(e)
    return result


def checkTime(strTimeStart, strTimeEnd, strTimeFormat):
    startTime = None
    endTime = None

    try:
        startTime = datetime.strptime(strTimeStart, '%Y-%m-%d %H:%M:%S')
        endTime = datetime.strptime(strTimeEnd, '%Y-%m-%d %H:%M:%S')
    except Exception:
        logging.error("Invalid time string! strTimeStart=%s, strTimeEnd=%s, strTimeFormat=%s",
                      strTimeStart, strTimeEnd, strTimeFormat, stack_info=True)
        return {'error': 'historyData', 'msg': 'invalid time string'}

    if startTime > endTime:
        return {'error': 'historyData', 'msg': 'startTime > endTime'}

    if strTimeFormat == 'm1':
        if (endTime - startTime).days > 7:
            print('error: time range too long for m1 period data query')
            return {'error': 'historyData', 'msg': 'time range too long for m1 period data query'}
    elif strTimeFormat == 'm5':
        if (endTime - startTime).days > 14:
            print('error: time range too long for m5 period data query :' + strTimeStart + strTimeEnd)
            return {'error': 'historyData', 'msg': 'time range too long for m5 period data query'}
    elif strTimeFormat == 'h1':
        if (endTime - startTime).days > 60:
            print('error: time range too long for h1 period data query ')
            return {'error': 'historyData', 'msg': 'time range too long for h1 period data query'}
    elif strTimeFormat == 'd1':
        if (endTime - startTime).days > 365 * 2:
            print('error: time range too long for d1 period data query ')
            return {'error': 'historyData', 'msg': 'time range too long for d1 period data query'}
    elif strTimeFormat == 'M1':
        pass
    else:
        return {'error': 'historyData', 'msg': 'time period format not supported'}
    return None


def getOneItemData(dataSourceId, itemId, timeStart, timeEnd, timeFormat, bSearchNearest=False):
    dataSourceItemInfo = {}
    if ObjectId.is_valid(itemId):
        dataSourceItemInfo = MongoConnManager.getConfigConn().getDataSourceItemInfoById(itemId)
    else:
        dataSourceItemInfo = MongoConnManager.getConfigConn().get_DataSource_MappingPoint_by_value(itemId)
    ttList = []
    rvdata = []
    if dataSourceItemInfo != None:
        strEquation = ''
        realParamList = []
        type = dataSourceItemInfo.get('type')
        if type != None:
            if type == 0:
                pointList = []
                pointList.append(dataSourceItemInfo['value'])
                projId = dataSourceItemInfo['projId']
                data = BEOPDataAccess.getInstance().get_history_data_padded_reduce(projId, pointList, timeStart,
                                                                                   timeEnd, timeFormat, bSearchNearest)
                rtdata = []
                if 'error' not in data.keys():
                    key = ''
                    if len(data.get('data')) == 1:
                        for keys in locals()['data']['data'].keys():
                            key = keys
                            break
                    for index, time in enumerate(data.get('timeStamp')):
                        rtdata.append({'time': time, 'value': data.get('data')[key][index], 'attr': data.get('attr')[key][index]})
                else:
                    return data
                return rtdata
            elif type == 1:
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
            elif type == 4:#点名为ID
                pointList = []
                ptName = get_real_pt_name_in_cloud_point(dataSourceItemInfo)
                if ptName:
                    pointList.append(ptName)
                projId = dataSourceItemInfo['projId']
                data = BEOPDataAccess.getInstance().get_history_data_padded_reduce(projId, pointList, timeStart,
                                                                                   timeEnd, timeFormat, bSearchNearest)
                rtdata = []
                if 'error' not in data.keys():
                    key = ''
                    if len(data.get('data')) == 1:
                        for keys in locals()['data']['data'].keys():
                            key = keys
                            break
                    for index, time in enumerate(data.get('timeStamp')):
                        rtdata.append({'time': time, 'value': data.get('data')[key][index], 'attr': data.get('attr')[key][index]})
                else:
                    return data
                return rtdata
            realParamData = {}
            for rp in realParamList:
                itemInfo = MongoConnManager.getConfigConn().getDataSourceItemInfoById(rp)
                if itemInfo != None:
                    rece = getOneItemData(dataSourceId, itemInfo['_id'].__str__(), timeStart, timeEnd, timeFormat,
                                          bSearchNearest)
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
                    locals()[rp] = effect_num(temp, 2)
                else:
                    locals()[rp] = temp
            try:
                result = eval(strEquation)
            except Exception as e:
                result = 0
                logging.error(e.__str__())
            rvdata.append(dict(time=ttList[tt], value=str(effect_num(result, 2))))
    return rvdata


# TODO
def ConvertLatexToNumpy(str):
    return str.replace('\\cdot', '*') \
        .replace('^', '**') \
        .replace('\\left', '') \
        .replace('\\right', '') \
        .replace('\\frac', '') \
        .replace('}{', '}/{') \
        .replace('}', ')') \
        .replace('{', '(')


def trimArrayToFloat(valueList):
    rtList = []
    for i in valueList:
        bNum = True
        temp = 0.0
        try:
            temp = float(i['value'])
        except Exception as e:
            bNum = False
        if bNum:
            rtList.append(effect_num(temp, 2))
        else:
            rtList.append(temp)
    return rtList


@app.route('/analysis/startWorkspaceDataGenHistogram', methods=['POST'])
def startWorkspaceDataGenHistogram():
    data = request.get_json()
    return do_startWorkspaceDataGenHistogram(data)


def do_startWorkspaceDataGenHistogram(data):
    readCache = data.get('readCache', False)
    dataSouceId = data.get('dataSourceId')
    itemVarIdList = data.get('dsItemIds')
    timeStart = data.get('timeStart')
    timeEnd = data.get('timeEnd')
    timeFormat = data.get('timeFormat')
    bSearchNearest = data.get('searchNearest', False)

    check = checkTime(timeStart, timeEnd, timeFormat)
    if check:
        return json.dumps(check)

    arrHistory = []
    timeRvList = []
    preFilterInfo = isAllCloudPointName(itemVarIdList)
    if preFilterInfo is not None and len(preFilterInfo) >= 2:  # all new cloud points and only one project
        projId = preFilterInfo[0]
        pointNameList = preFilterInfo[1]
        tStart = time.time()
        if pointNameList is not None:
            (realPointList, requestSiteToCloudMaps) = BEOPDataAccess.genCloudSiteMap(projId, pointNameList)
            pointNameList = realPointList
        data = BEOPDataAccess.getInstance().get_history_data_padded_reduce(projId, pointNameList, timeStart, timeEnd,
                                                                           timeFormat, bSearchNearest)
        logging.debug('startWorkspaceDataGenHistogram cost: %.1f' % (time.time() - tStart))
        rtdata = []
        tempPVDict = {}
        if 'error' not in data.keys():
            key = ''
            if len(data.get('data')) == 1:
                for keys in locals()['data']['data'].keys():
                    key = keys
                    break
            ptDataList = data.get('data')
            for ptName, ptValueList in ptDataList.items():
                ptFloatValueList = trimArrayToFloat(ptValueList)
                if requestSiteToCloudMaps is not None:
                    ptOrgName = requestSiteToCloudMaps.get(ptName, None)
                    if ptOrgName:
                        ptName = ptOrgName
                tempPVDict['@%s|%s' % (projId, ptName)] = ptValueList
            timeRvList = data.get('timeStamp')
        for itemvar in itemVarIdList:
            value_array = tempPVDict.get(itemvar, [])
            if len(value_array) > 0:  # 保留两位有效数字
                value_array = [effect_num(x, 2) if x is not None else None for x in value_array]
            arrHistory.append(dict(dsItemId=itemvar, data=value_array))
    else:
        for item in itemVarIdList:
            data = None
            if readCache:
                data = _tryGetValueFromPlatformCache(timeStart, timeEnd, timeFormat, item)
            if data is None:
                data = getOneItemData(dataSouceId, item, timeStart, timeEnd, timeFormat, bSearchNearest)
            if not (isinstance(data, dict) and 'error' in data.keys()):
                valueData = []
                for i in data:
                    bNum = True
                    temp = 0.0
                    try:
                        temp = float(i['value'])
                    except Exception:
                        bNum = False
                    if bNum:
                        valueData.append(effect_num(temp, 2))
                    else:
                        valueData.append(temp)
                arrHistory.append(dict(dsItemId=item, data=valueData))
                if len(timeRvList) == 0:
                    for data_item in data:
                        if not isinstance(data_item, dict):
                            logging.error('Invalid data_item: %s', data_item)
                        else:
                            timeRvList.append(data_item['time'])
            else:
                arrHistory.append(dict(dsItemId=item, data=[]))
    if arrHistory:
        return json.dumps({"list": arrHistory, "timeShaft": timeRvList})
    else:
        return json.dumps({'error': 'historyData', 'msg': 'no history data'})

'''需求：
increment和increment/v2接口有一个bug需要处理。（会返回负值、会返回位数很多的小数）
1.返回数据在 差值和时间戳 的基础上，增加一个错误标记位（0正常，1异常）。
2.并对返回能耗进行过滤。假定为A=B-C
2.1检验B是否为null，如果是，则A=0，返回异常标记位。
2.2检验C是否为null，如果是，则A=0，返回异常标记位。
2.3检验A是否小于零，如果是，则A=0，返回异常标记位。
3.对返回的差值进行过滤，保留2位小数。
'''
@app.route('/analysis/startWorkspaceDataGenHistogram/increment', methods=['POST'])#求差值
def startWorkspaceDataGenHistogramIncrement():
    errMsg = ''
    data = None
    try:
        data = request.get_json()

        dataSouceId = data.get('dataSourceId')
        itemVarIdList = data.get('dsItemIds')
        timeStart = data.get('timeStart')
        timeEnd = data.get('timeEnd')
        timeFormat = data.get('timeFormat')
        bSearchNearest = data.get('searchNearest', False)

        check = checkTime(timeStart, timeEnd, timeFormat)
        if check:
            return json.dumps(check)

        arrHistory = []
        timeRvList = []
        preFilterInfo = isAllCloudPointName(itemVarIdList)
        if preFilterInfo is not None and len(preFilterInfo) >= 2:  # all new cloud points and only one project
            projId = preFilterInfo[0]
            pointNameList = preFilterInfo[1]
            tStart = time.time()
            if pointNameList is not None:
                (realPointList, requestSiteToCloudMaps) = BEOPDataAccess.genCloudSiteMap(projId, pointNameList)
                pointNameList = realPointList
            data = BEOPDataAccess.getInstance().get_history_data_padded_reduce(projId, pointNameList, timeStart,
                                                                               timeEnd, timeFormat, bSearchNearest)
            logging.debug('get_history_data_padded_reduce cost: %.1f' % (time.time() - tStart))
            rtdata = []
            tempPVDict = {}
            errorDict = {}
            flag = []
            if 'error' not in data.keys():
                key = ''
                if len(data.get('data')) == 1:
                    for keys in locals()['data']['data'].keys():
                        key = keys
                        break
                ptDataList = data.get('data')
                ptAttrList = data.get('attr')
                for ptName, ptValueList in ptDataList.items():
                    ptFloatValueList = trimArrayToFloat(ptValueList)
                    if requestSiteToCloudMaps is not None:
                        ptOrgName = requestSiteToCloudMaps.get(ptName, None)
                        if ptOrgName:
                            ptName = ptOrgName
                    tempPVDict['@%s|%s' % (projId, ptName)] = ptValueList
                try:
                    for ptName,ptErrorList in ptAttrList.items():
                        if len(ptErrorList) is not None:
                            ptOrgName = requestSiteToCloudMaps.get(ptName, None)
                            if ptOrgName:
                                ptName = ptOrgName
                            errorDict['@%s|%s' % (projId, ptName)] = ptErrorList
                except Exception as e:
                    print(e)
                    tempPVDict['@%s|%s' % (projId, ptName)] = ptValueList
                timeRvList = data.get('timeStamp')
            for itemvar in itemVarIdList:
                value_array = tempPVDict.get(itemvar, [])
                error_array = errorDict.get(itemvar, [])
                arrHistory.append(dict(dsItemId=itemvar, data=value_array, error = error_array))
        else:#用id计算点名差值
            for item in itemVarIdList:
                data = getOneItemData(dataSouceId, item, timeStart, timeEnd, timeFormat, bSearchNearest)
                if not (isinstance(data, dict) and 'error' in data.keys()):
                    valueData = []
                    errorList = []
                    for i in data:
                        valueData.append(i['value'])
                        errorList.append(i['attr'])
                    arrHistory.append(dict(dsItemId=item, data=valueData, error = errorList))
                    if len(timeRvList) == 0:
                        for item in data:
                            timeRvList.append(item['time'])
        if arrHistory:
            for item in arrHistory:
                d_l = item.get('data')
                e_1 = item.get('error')
                if d_l and e_1:
                    data_new = []
                    flag = []
                    for index in range(1, len(d_l), 1):
                        try:
                            #判断相减是否为负数，是的话则标记flag为1，否则为0
                            differ = float(d_l[index] - d_l[index - 1])
                            if (not e_1[index]) and (not e_1[index - 1]):#判断原始数据是否为真实值，false为真实值

                                if differ < 0.001 and differ >= 0:#为0-0.001之间都处理为0，默认为相等
                                    data_new.append(0)
                                    flag.append(0)
                                else:
                                    if differ < 0:
                                        data_new.append(0)
                                        flag.append(1)
                                    else:
                                        differ_new = effect_num(differ, 2) if differ is not None else None  # 保留两位有效数字
                                        data_new.append(differ_new)
                                        flag.append(0)
                            else:
                                flag.append(1)
                                data_new.append(0)
                        except:
                            data_new.append(0)
                            flag.append(0)
                    item.update({'data': data_new, 'errorFlag': flag})
                    del item['error']
            return json.dumps({"list": arrHistory, "timeShaft": timeRvList})
        else:
            return json.dumps({'error': 'historyData', 'msg': 'no history data'})
    except Exception as e:
        logging.error('Unhandled exception! data=%s', data)
        errMsg = e.__str__()
    return json.dumps(errMsg, ensure_ascii=False)


def getNumOfDaysOfLastMonth(timeNow):
    import calendar

    year = timeNow.year
    month = timeNow.month

    if month == 1:
        month = 12
        year -= 1
    else:
        month -= 1
    return calendar.monthrange(year, month)[1]


@app.route('/analysis/startWorkspaceDataGenHistogram/increment/v2', methods=['POST'])
def startWorkspaceDataGenHistogramIncrement_v2():
    data = None
    try:
        data = request.get_json()
        return do_startWorkspaceDataGenHistogramIncrement_v2(data)
    except Exception:
        logging.error("Unhandled exception! data=%s.", data, exc_info=True, stack_info=True)
        err_msg = 'startWorkspaceDataGenHistogramIncrement error: ' + e.__str__()
    return json.dumps({'error': 'historyData', 'msg': err_msg}, ensure_ascii=False )


# noinspection PyTypeChecker
def _tryGetValueFromPlatformCache(timeStart, timeEnd, timeFormat, itemVarId):
    # 临时解决平台加载页面较慢的问题
    timeStartObj = datetime.strptime(timeStart, '%Y-%m-%d %H:%M:%S')
    timeEndObj = datetime.strptime(timeEnd, '%Y-%m-%d %H:%M:%S')
    cacheWeekStartTime = (datetime.now() + timedelta(days=-6)).replace(
        hour=0, minute=0, second=0, microsecond=0)
    cacheWeekEndTime = (datetime.now() + timedelta(days=1)).replace(
        hour=0, minute=0, second=0, microsecond=0)
    cacheMonthStart = (datetime.now()).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    cacheMonthEnd = (datetime.now() + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
    numOfDaysOfLastMonth = getNumOfDaysOfLastMonth(datetime.now())
    cacheLastMonthStartTime = cacheMonthStart + timedelta(days=-numOfDaysOfLastMonth)
    cacheLastMonthEndTime = cacheMonthEnd + timedelta(days=-numOfDaysOfLastMonth)
    cacheLastMonthVeryEndTime = cacheMonthStart - timedelta(minutes=5)
    # 平台读缓存时考虑到登录服务器时电脑时区和服务器时区不一致，前后各放宽一天
    dayBack = timedelta(days=-1)
    dayAhead = timedelta(days=1)
    hitWeekCache = (cacheWeekStartTime + dayBack) <= timeStartObj <= (cacheWeekStartTime + dayAhead) and (
                    cacheWeekEndTime + dayBack) <= timeEndObj <= (cacheWeekEndTime + dayAhead)
    hitMonthCache = (cacheMonthStart + dayBack) <= timeStartObj <= (cacheMonthStart + dayAhead) and (
                     cacheMonthEnd + dayBack) <= timeEndObj <= (cacheMonthEnd + dayAhead)
    hitLastMonthCache = \
        (cacheLastMonthStartTime + dayBack) <= timeStartObj <= (cacheLastMonthStartTime + dayAhead) and (
         cacheLastMonthEndTime + dayBack) <= timeEndObj <= (cacheLastMonthEndTime + dayAhead)
    hitLastMonthVeryEndCache = \
        (cacheLastMonthVeryEndTime + dayBack) <= timeStartObj <= (cacheLastMonthVeryEndTime + dayAhead) and (
         cacheLastMonthVeryEndTime + dayBack) <= timeEndObj <= (cacheLastMonthVeryEndTime + dayAhead)
    itemData = None
    if hitWeekCache:
        redis_key = str(itemVarId) + '_' + timeFormat + '_' + 'week'
        itemData = RedisManager.get_platform_point_history(redis_key)
        if itemData is None:
            logging.warning('Week cache missed! Locals: %s', locals())
    elif hitMonthCache:
        redis_key = str(itemVarId) + '_' + timeFormat + '_' + 'month'
        itemData = RedisManager.get_platform_point_history(redis_key)
        if itemData is None:
            logging.warning('Month cache missed! Locals: %s', locals())
    elif hitLastMonthCache:
        redis_key = str(itemVarId) + '_' + timeFormat + '_' + 'lastMonth'
        itemData = RedisManager.get_platform_point_history(redis_key)
        if itemData is None:
            logging.warning('LastMonth cache missed! Locals: %s', locals())
    elif hitLastMonthVeryEndCache:
        # Here, we should use timeFormat instead of hardcoded "m5". Change it after frontend team changes it.
        redis_key = str(itemVarId) + '_' + timeFormat + '_' + 'lastMonthVeryEnd'
        itemData = RedisManager.get_platform_point_history(redis_key)
        if itemData is None:
            logging.warning('LastMonthVeryEnd cache missed! Locals: %s', locals())
    else:
        logging.warning('Cache missed! Time not in cache range! Locals: %s', locals())
    return itemData


def do_startWorkspaceDataGenHistogramIncrement_v2(data):
    dataSouceId = data.get('dataSourceId')
    itemVarIdList = data.get('dsItemIds')
    timeStart = data.get('timeStart')
    timeEnd = data.get('timeEnd')
    timeFormat = data.get('timeFormat')
    bSearchNearest = data.get('searchNearest', False)
    bAutoFix = data.get('autoFix', True)
    readCache = data.get('readCache', False)

    check = checkTime(timeStart, timeEnd, timeFormat)
    if check:
        return json.dumps(check)
    arrHistory = []
    timeRvList = []
    preFilterInfo = isAllCloudPointName(itemVarIdList)
    if preFilterInfo is not None and len(preFilterInfo) >= 2:  # all new cloud points and only one project
        projId = preFilterInfo[0]
        pointNameList = preFilterInfo[1]
        tStart = time.time()
        if pointNameList is not None:
            (realPointList, requestSiteToCloudMaps) = BEOPDataAccess.genCloudSiteMap(projId, pointNameList)
            pointNameList = realPointList
        data = BEOPDataAccess.getInstance().get_history_data_padded_reduce(projId, pointNameList, timeStart,
                                                                           timeEnd, timeFormat, bSearchNearest)
        logging.debug('get_history_data_padded_reduce cost: %.1f' % (time.time() - tStart))
        rtdata = []
        tempPVDict = {}
        errorDict = {}
        flag = []
        if 'error' not in data.keys():
            key = ''
            if len(data.get('data')) == 1:
                for keys in locals()['data']['data'].keys():
                    key = keys
                    break
            ptDataList = data.get('data')
            ptAttrList = data.get('attr')
            for ptName, ptValueList in ptDataList.items():
                ptFloatValueList = trimArrayToFloat(ptValueList)
                if requestSiteToCloudMaps is not None:
                    ptOrgName = requestSiteToCloudMaps.get(ptName, None)
                    if ptOrgName:
                        ptName = ptOrgName
                tempPVDict['@%s|%s' % (projId, ptName)] = ptValueList
            try:
                for ptName,ptErrorList in ptAttrList.items():
                    if len(ptErrorList) is not None:
                        ptOrgName = requestSiteToCloudMaps.get(ptName, None)
                        if ptOrgName:
                            ptName = ptOrgName
                        errorDict['@%s|%s' % (projId, ptName)] = ptErrorList
            except Exception as e:
                print(e)
                tempPVDict['@%s|%s' % (projId, ptName)] = ptValueList
            timeRvList = data.get('timeStamp')
        for itemvar in itemVarIdList:
            value_array = tempPVDict.get(itemvar, [])
            error_array = errorDict.get(itemvar, [])
            arrHistory.append(dict(dsItemId=itemvar, data=value_array, error = error_array))
    else:   # 用id计算点名差值
        for item in itemVarIdList:
            itemData = None
            redis_key = None
            if readCache:
                itemData = _tryGetValueFromPlatformCache(timeStart, timeEnd, timeFormat, item)
            if itemData is None:
                itemData = getOneItemData(dataSouceId, item, timeStart, timeEnd, timeFormat, bSearchNearest)
            if itemData is not None and not (isinstance(itemData, dict) and 'error' in itemData.keys()):
                valueData = []
                errorList = []
                for i in itemData:
                    valueData.append(i['value'])
                    errorList.append(i['attr'])
                arrHistory.append(dict(dsItemId=item, data=valueData, error = errorList))
                if len(timeRvList) == 0:
                    for item in itemData:
                        timeRvList.append(item['time'])
            else:
                arrHistory.append(dict(dsItemId=item, data=[]))
    if arrHistory:
        if bAutoFix:
            time_now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            for index in range(1, len(timeRvList), 1):
                if timeRvList[index -1] < time_now and timeRvList[index] >= time_now:
                    index_use = index
                    break
                else:
                    index_use = -1   # 时间小于当前时间则给时间戳为一个负值
            for item in arrHistory:
                d_l = item.get('data')
                n_l = item.get('dsItemId')
                e_1 = item.get('error')
                # 用于处理负数的累积量的标记，如果全部的数字小于0，就要特别的处理
                special_flag = (len([x for x in d_l if x < 0]) == len(d_l))
                if d_l and e_1:
                    data_new = []
                    flag = []
                    for index in range(1, len(d_l), 1):
                        try:
                            if index_use > 0:
                                if index == index_use:
                                    preFilterInfo = isAllCloudPointName([n_l])
                                    if preFilterInfo is not None and len(
                                            preFilterInfo) >= 2:  # all new cloud points and only one project
                                        projId = preFilterInfo[0]
                                        pointNameList = preFilterInfo[1]
                                        tStart = time.time()
                                        if pointNameList is not None:
                                            (realPointList, requestSiteToCloudMaps) = BEOPDataAccess.genCloudSiteMap(
                                                projId, pointNameList)
                                            pointNameList = realPointList
                                    rt = BEOPDataAccess.getInstance().get_realtime_data(projId, pointNameList)
                                    d_l[index] = float(rt[0].get('value'))
                                    e_1[index] = False

                            # 判断相减是否为负数，是的话则标记flag为1，否则为0；如果特殊标记为真，就要取绝对值再相减
                            differ = float(d_l[index] - d_l[index - 1]) if not special_flag else float(abs(d_l[index]) - abs(d_l[index-1]))
                            if (not e_1[index]) and (not e_1[index - 1]):    # 判断原始数据是否为真实值，false为真实值
                                if 0.001 > differ >= 0:    # 为0-0.001之间都处理为0，默认为相等
                                    data_new.append(0)
                                    flag.append(0)
                                else:
                                    if differ < 0:
                                        data_new.append(0)
                                        flag.append(1)
                                    else:
                                        differ_new = effect_num(differ, 2) if differ is not None else None  # 保留两位有效数字
                                        data_new.append(differ_new)
                                        flag.append(0)
                            else:
                                flag.append(1)
                                data_new.append(0)
                        except Exception:
                            data_new.append(0)
                            flag.append(0)
                    item.update({'data': data_new, 'errorFlag': flag})
                    del item['error']
        return json.dumps({"list": arrHistory, "timeShaft": timeRvList})
    else:
        return json.dumps({'error': 'historyData', 'msg': 'no history data'})


@app.route('/update/platformPointRealtimeCache', methods=['POST'])
def updatePlatformPointRealtimeCache():
    data = request.get_json()
    projId = data.get('projId')
    if not projId:
        raise Exception('No projId provided!')
    pointList = data.get('pointList')
    if not pointList or not isinstance(pointList, list):
        raise Exception('pointList must be a non-empty list!')
    data = {"proj": projId, "pointList": pointList}
    realtimeData = Utils.post_json(request.host_url + 'v1/data/get_realtime', data)
    if not realtimeData or len(realtimeData) == 0:
        return json.dumps({'success': False, 'msg': 'no realtime data'})
    for i in range(len(pointList)):
        pointName = pointList[i]
        dsItemId = "@%s|%s" % (projId, pointName)
        RedisManager.set_platform_point_history(dsItemId, realtimeData[i].get('value'))
    return json.dumps({'success': True, 'msg': ''})


@app.route('/update/platformPointHistoryCache', methods=['POST'])
def updatePlatformPointHistoryCache():
    rt = {"success": False, "msg": ""}
    data = request.get_json()
    dsItemId = data.get('dsItemId')
    timeFormat = data.get('timeFormat')
    cacheWeekStartTime = (datetime.now() + timedelta(days=-6)).replace(hour=0, minute=0, second=0,
                                                                       microsecond=0).strftime('%Y-%m-%d %H:%M:%S')
    cacheWeekEndTime = (datetime.now() + timedelta(days=1)).replace(hour=0, minute=0, second=0,
                                                                    microsecond=0).strftime('%Y-%m-%d %H:%M:%S')
    cacheMonthStartObj = (datetime.now()).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    cacheMonthStartTime = cacheMonthStartObj.strftime('%Y-%m-%d %H:%M:%S')
    cacheMonthEndObj = (datetime.now() + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
    cacheMonthEndTime = cacheMonthEndObj.strftime('%Y-%m-%d %H:%M:%S')
    numOfDaysOfLastMonth = getNumOfDaysOfLastMonth(datetime.now())
    cacheLastMonthStartTime = (cacheMonthStartObj + timedelta(days=-numOfDaysOfLastMonth)).strftime(
        '%Y-%m-%d %H:%M:%S')
    cacheLastMonthEndObj = cacheMonthEndObj + timedelta(days=-numOfDaysOfLastMonth)
    cacheLastMonthEndTime = cacheLastMonthEndObj.strftime('%Y-%m-%d %H:%M:%S')
    cacheLastMonthVeryEndObj = cacheMonthStartObj - timedelta(minutes=5)
    cacheLastMonthVeryEndTime = cacheLastMonthVeryEndObj.strftime('%Y-%m-%d %H:%M:%S')
    redis_key = str(dsItemId) + '_' + timeFormat + '_' + 'week'
    RedisManager.set_platform_point_history(
        redis_key, getOneItemData(None, dsItemId, cacheWeekStartTime, cacheWeekEndTime, timeFormat, False))

    redis_key = str(dsItemId) + '_' + timeFormat + '_' + 'month'
    RedisManager.set_platform_point_history(
        redis_key, getOneItemData(None, dsItemId, cacheMonthStartTime, cacheMonthEndTime, timeFormat, False))
    redis_key = str(dsItemId) + '_' + timeFormat + '_' + 'lastMonth'
    RedisManager.set_platform_point_history(
        redis_key, getOneItemData(None, dsItemId, cacheLastMonthStartTime, cacheLastMonthEndTime, timeFormat, False))
    # Here, we should use timeFormat instead of hardcoded "m5". Change it after frontend team changes it.
    redis_key = str(dsItemId) + '_' + timeFormat + '_' + 'lastMonthVeryEnd'
    RedisManager.set_platform_point_history(redis_key, getOneItemData(
        None, dsItemId, cacheLastMonthVeryEndTime, cacheLastMonthVeryEndTime, timeFormat, False))
    projId, pointName = Utils.parse_ds_item_id(dsItemId)
    data = {"proj": projId, "pointList": [pointName]}
    realtimeData = Utils.post_json(request.host_url + 'v1/data/get_realtime', data)
    redis_key = str(dsItemId)
    RedisManager.set_platform_point_history(redis_key, realtimeData[0].get('value'))

    rt['success'] = True
    return json.dumps(rt)


@app.route('/analysis/startWorkspaceDataGenPieChart', methods=['POST'])
@cross_origin(origins='*')
def startWorkspaceDataGenPieChart():
    data = request.get_json()
    return do_startWorkspaceDataGenPieChart(data)


def do_startWorkspaceDataGenPieChart(data):
    import copy
    dataSouceId = data.get('dataSourceId')
    originalItemVarIdList = data.get('dsItemIds', [])
    itemVarIdList = copy.deepcopy(originalItemVarIdList)
    if not isinstance(itemVarIdList, list):
        itemVarIdList = [itemVarIdList] if isinstance(itemVarIdList, str) else []
    if itemVarIdList is None:
        itemVarIdList = []
    arrRealtime = []

    # Platform overview page requires cross-project statistic information.
    # BEOPTask periodically save values of those information in Redis.
    # Check Redis for cached value first.
    itemVarIdsInCache = []
    for itemVarId in itemVarIdList:
        cacheValue = RedisManager.get_platform_point_history(itemVarId)
        if cacheValue is not None:
            arrRealtime.append({"data": cacheValue, "dsItemId": itemVarId})
            itemVarIdsInCache.append(itemVarId)
    for itemVarIdInCache in itemVarIdsInCache:
        itemVarIdList.remove(itemVarIdInCache)

    preFilterInfo = isAllCloudPointName(itemVarIdList)
    if preFilterInfo is not None and len(preFilterInfo) >= 2:  # all new cloud points and only one project
        projId = preFilterInfo[0]
        pointNameList = preFilterInfo[1]
        try:
            rt = BEOPDataAccess.getInstance().get_realtime_data(projId, pointNameList)
            rt_dic = {x.get('name'): x.get('value') for x in rt}
            for index, input_name in enumerate(pointNameList):
                real_name = pointNameList[index]
                pvalue = rt_dic.get(real_name)
                arrRealtime.append(dict(dsItemId=itemVarIdList[index], data=pvalue))
        except Exception:
            logging.error('Cannot get realtime data! itemVarIdList=%s, preFilterInfo=%s, projId=%s, pointNameList=%s',
                          itemVarIdList, preFilterInfo, projId, pointNameList, exc_info=True, stack_info=True)

        if arrRealtime:
            # Fetching value from cache may break the order of the output. Re-sort it before return
            arrRealtime.sort(key=lambda rt_data: originalItemVarIdList.index(rt_data.get('dsItemId')))
            return json.dumps({'dsItemList': arrRealtime})
        else:
            return json.dumps({'error': 'historyData', 'msg': 'no history data'})

    # old IDs
    requestProj = {}
    ptNameToID = {}

    rtInfos = getItemsDataPointName(dataSouceId, itemVarIdList)
    for rtInfo_item in rtInfos:
        rtInfo = rtInfo_item[0]
        item = rtInfo_item[1]
        if rtInfo is None:
            arrRealtime.append(dict(dsItemId=item, data='EquationCalculationNotSupoorted'))
            continue
        (projId, ptName) = rtInfo
        if projId in requestProj.keys():
            requestProj[projId].append(ptName)
        else:
            requestProj[projId] = [ptName]

        strKey = '%d_%s' % (int(projId), ptName)
        if strKey in ptNameToID:
            ptNameToID[strKey].append(item)
        else:
            ptNameToID[strKey] = [item]

    # 集中查询
    for k, v in requestProj.items():
        rvdata = BEOPDataAccess.getInstance().getBufferRTDataByProj(k, v)
        for rvk, rvv in rvdata.items():
            strKey = ('%d_%s' % (int(k), rvk)).strip()
            if strKey.strip() in ptNameToID.keys():
                for idItem in ptNameToID.get(strKey):
                    arrRealtime.append(dict(dsItemId=idItem, data=rvv))

    if arrRealtime:
        # Fetching value from cache may break the order of the output. Re-sort it before return
        arrRealtime.sort(key=lambda rt_data: originalItemVarIdList.index(rt_data.get('dsItemId')))
        return json.dumps({'dsItemList': arrRealtime})
    else:
        return json.dumps({'error': 'historyData', 'msg': 'no history data'})


@app.route('/analysis/startWorkspaceDataGenScatterChart', methods=['POST'])
def startWorkspaceDataGenScatterChart():
    data = request.get_json()

    dataSouceId = data.get('dataSourceId')
    itemVarIdList = data.get('dsItemIds')
    timeStart = data.get('timeStart')
    timeEnd = data.get('timeEnd')
    timeFormat = data.get('timeFormat')
    bSearchNearest = data.get('searchNearest', False)

    check = checkTime(timeStart, timeEnd, timeFormat)
    if check:
        return json.dumps(check)

    arrHistory = []
    for item in itemVarIdList:
        data = getOneItemData(dataSouceId, item, timeStart, timeEnd, timeFormat, bSearchNearest)
        if not (isinstance(data, dict) and 'error' in data.keys()):
            valueData = []
            for i in data:
                try:
                    valueData.append(effect_num(float(i['value']), 2))
                except Exception as ex:
                    logging.error('%s Invalid value: %s', ex.__str__(), i.get('value'))
            arrHistory.append(dict(dsItemId=item, data=valueData))
        else:
            arrHistory.append(dict(dsItemId=item, data=[]))
    if arrHistory:
        return json.dumps({"list": arrHistory})
    else:
        return json.dumps({'error': 'historyData', 'msg': 'no history data'})


def countPattern(fMin, fMax, fVList):
    ncount = 0
    for item in fVList:
        if fMin <= item < fMax:
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

    pMax = data.get('patternMax', '')
    pMin = data.get('patternMin', '')
    pNums = data.get('patternNum', '')
    bSearchNearest = data.get('searchNearest', False)

    if len(itemVarIdList) == 0:
        return json.dumps({"error": "need one item at least."})

    check = checkTime(timeStart, timeEnd, timeFormat)
    if check:
        return json.dumps(check)

    itemVarId = itemVarIdList[0]

    bAutoPattern = False
    if pMax == '' or pMin == '' or pNums == '' or pMax is None or pMin is None or pNums is None:
        bAutoPattern = True

    arrHistory = []
    data = getOneItemData(dataSouceId, itemVarId, timeStart, timeEnd, timeFormat, bSearchNearest)
    if not (isinstance(data, dict) and 'error' in data.keys()):
        valueData = []
        for i in data:
            bNum = True
            temp = 0.0
            try:
                temp = float(i['value'])
            except Exception:
                bNum = False
            if bNum:
                valueData.append(effect_num(temp, 2))
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
            try:
                pMax = float(pMax)
            except:
                pMax = 0
            try:
                pMin = float(pMin)
            except:
                pMin = 0
            try:
                pNums = int(pNums)
            except:
                pNums = 10
        fStep = (pMax - pMin) / pNums
        for i in range(0, pNums):
            arrHistory.append(dict(data=str(effect_num(pMin + i * fStep, 2)),
                                   pattern=countPattern(pMin + i * fStep, pMin + (i + 1) * fStep, valueData)))
        if len(arrHistory) > 0:
            arrHistory = sorted(arrHistory, key=lambda x: float(x['data']))
    if arrHistory:
        return json.dumps({"list": arrHistory})
    else:
        return json.dumps({'error': 'historyData', 'msg': 'no history data'})


@app.route('/analysis/startWorkspaceDataGenCluster', methods=['POST'])
def startWorkspaceDataGenCluster():
    rt = None

    data = request.get_json()

    dataSouceId = data.get('dataSourceId')
    itemVarIdList = data.get('dsItemIds')
    timeStart = data.get('timeStart')
    timeEnd = data.get('timeEnd')
    timeFormat = data.get('timeFormat')
    bSearchNearest = data.get('searchNearest', False)

    check = checkTime(timeStart, timeEnd, timeFormat)
    if check:
        return json.dumps(check)

    history = []
    for item in itemVarIdList:
        rece = getOneItemData(dataSouceId, item, timeStart, timeEnd, timeFormat, bSearchNearest)
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
    for index, item_name in enumerate(itemVarIdList):
        arrHistoryForDLL = []

        for itemHistory in history[index]:
            arrHistoryForDLL.append(str(itemHistory['value']))

        if data.get('pointType')[0] == 'X':
            point_type = ''
        else:
            if data.get('pointType') is not None:
                if index < len(data.get('pointType')):
                    point_type = data.get('pointType')[index]
                else:
                    point_type = ''
            else:
                point_type = ''
        arrPoints.append({
            "name": item_name,
            "type": point_type,
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

    try:
        headers = {'content-type': 'application/json'}
        data = {'options': options}
        rt = requests.post('%s/analysis/startWorkspaceDataGenCluster' % DLLSERVER_ADDRESS, data=json.dumps(data),
                           headers=headers)
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
    dataAnalysis = {}
    try:
        if rt:
            dataAnalysis = json.loads(rt.text)
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
    if dataAnalysis:
        return json.dumps({"timeShaft": arrTimeLabels, "dataAnalysisResult": dataAnalysis})
    else:
        return json.dumps({'error': 'historyData', 'msg': 'no history data'})


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
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
    return json.dumps(result)


@app.route('/warning/modifyWarningConfig/<projId>', methods=['POST'])
def modifyWarningConfig(projId):
    result = {'status': 0, 'msg': 'edit rule success!'}
    projId = int(projId)
    data = request.form
    try:
        if not BEOPDataAccess.getInstance().modifyWarningConfig(projId, data):
            result = {'status': -1, 'msg': 'edit rule failed!'}
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
    return json.dumps(result)


@app.route('/warning/addWarningConfig/<projId>', methods=['POST'])
def addWarningConfig(projId):
    result = {'status': 0, 'msg': 'add rule success!'}
    projId = int(projId)
    data = request.form
    try:
        if not BEOPDataAccess.getInstance().addWarningConfig(projId, data):
            result = {'status': -1, 'msg': 'add rule failed!'}
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
    return json.dumps(result)


@app.route('/warning/deleteWarningConfig/<projId>', methods=['POST'])
def deleteWarningConfig(projId):
    result = {'status': 0, 'msg': 'delete rule success!'}
    projId = int(projId)
    data = request.form
    try:
        if not BEOPDataAccess.getInstance().deleteWarningConfig(projId, data.get('pointNames')):
            result = {'status': -1, 'msg': 'delete rule failed!'}
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
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
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
    return json.dumps(result)


@app.route('/analysis/get_pointList_from_rtTable/<projectId>')
def get_pointList_from_rtTable(projectId):
    projectId = int(projectId)
    rv = BEOPDataAccess.getInstance().get_pointList_from_rtTable(projectId)
    return json.dumps(rv)


@app.route('/analysis/startWorkspaceDataGenHistogramMulti', methods=['POST'])
def startWorkspaceDataGenHistogramMulti():
    requestList = request.get_json()
    return do_startworkspaceDataGenHistogramMulti(requestList)


def do_startworkspaceDataGenHistogramMulti(requestList):
    result = []
    if requestList is not None:
        if len(requestList) > 0:
            for sub in requestList:
                dataSouceId = sub.get('dataSourceId')
                itemVarIdList = sub.get('dsItemIds')
                timeStart = sub.get('timeStart')
                timeEnd = sub.get('timeEnd')
                timeFormat = sub.get('timeFormat')
                bSearchNearest = sub.get('searchNearest', False)

                check = checkTime(timeStart, timeEnd, timeFormat)
                if check:
                    return json.dumps(check)

                arrHistory = []
                timeRvList = []
                for item in itemVarIdList:
                    data = getOneItemData(dataSouceId, item, timeStart, timeEnd, timeFormat, bSearchNearest)
                    if not (isinstance(data, dict) and 'error' in data.keys()):
                        valueData = []
                        for i in data:
                            bNum = True
                            temp = 0.0
                            try:
                                temp = float(i['value'])
                            except Exception:
                                bNum = False
                            if bNum:
                                valueData.append(effect_num(temp, 2))
                            else:
                                valueData.append(temp)
                        arrHistory.append(dict(dsItemId=item, data=valueData))
                        if len(timeRvList) == 0:
                            for data_item in data:
                                timeRvList.append(data_item['time'])
                    else:
                        arrHistory.append(dict(dsItemId=item, data=[]))
                result.append({"list": arrHistory, "timeShaft": timeRvList})
    if result:
        return json.dumps(result)
    else:
        return json.dumps({'error': 'historyData', 'msg': 'no history data'})


@app.route('/projectMap/update')
def updateProjectLocateMap():
    if MongoConnManager.UpdateProjectLocateMap():
        return json.dumps(True, ensure_ascii=False)
    return json.dumps(False, ensure_ascii=False)


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
            return json.dumps({'error': 'invalid params'}, ensure_ascii=False)
        if targetName not in dictParams.keys():
            return json.dumps({'error': 'params should include target'}, ensure_ascii=False)
        for param_key in dictParams.keys():
            if param_key not in strExpress:
                return json.dumps({'error': 'express should include key which is in params'}, ensure_ascii=False)
            if not param_key:
                return json.dumps({'error': 'key in params is invalid'}, ensure_ascii=False)
            if not dictParams[param_key]:
                return json.dumps({'error': 'value of key in params is zero'}, ensure_ascii=False)
            keyNameList.append(param_key)
            keyValueList.append(dictParams[param_key])

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
            except Exception:
                logging.error('Unhandled exception!', exc_info=True, stack_info=True)
            return json.dumps({'name': targetName, 'data': resValueList}, ensure_ascii=False)

        for index in range(len(keyValueList) - 1):
            if len(keyValueList[index]) != len(keyValueList[index + 1]):
                return json.dumps({'error': 'lengths of params are different'}, ensure_ascii=False)
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
        except Exception:
            logging.error('Unhandled exception!', exc_info=True, stack_info=True)
        return json.dumps({'name': targetName, 'data': resValueList}, ensure_ascii=False)

    return json.dumps({'error': 'post params invalid'}, ensure_ascii=False)


@app.route('/s3db/get_pageid_by_name/<projid>/<pagename>', methods=['GET'])
def s3db_get_pageid_by_name(projid, pagename):
    s3dbname = BEOPDataAccess.getInstance().getProjS3db(projid)
    rv = BEOPSqliteAccess.getInstance().getPageIdByName(s3dbname, pagename)
    return jsonify(pageid=rv)


@app.route('/save/saveDataToMongodb', methods=['POST'])
def saveDataToMongodb():
    rt = []
    try:
        data = request.get_json()
        dataList = data.get('saveList')
        for item in dataList:
            projId = int(item.get('projId'))
            pointName = item.get('pointName')
            pointValue = item.get('pointValue')
            pointTime = item.get('timeAt')
            if isinstance(pointTime, str):
                pointTime = datetime.strptime(pointTime, '%Y-%m-%d %H:%M:%S')
            else:
                raise Exception('timeAt should be a str, but got %s' % type(pointTime))
            dbname = BEOPDataAccess.getInstance().getCollectionNameById(projId)
            collectionName = 'm5_data_' + dbname
            connList = MongoConnManager.getHisConn(projId)
            res = BEOPDataAccess.getInstance().mergesetHisData(
                projId, connList, pointName, pointValue, pointTime, collectionName)
            rt.append({'result': res})
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
    return json.dumps(rt)


@app.route('/v1/data/get_history_at_time', methods=['POST'])
def get_history_at_time_api():
    try:
        request_data = request.get_json()
        if request_data:
            r = requests.post("%s/v1/data/get_history_at_time" % (app.config.get('BEOP_SERVICE_ADDRESS'),),
                              data=json.dumps(request_data), headers={'content-type': 'application/json'})
            if r.status_code == 200:
                rt = json.loads(r.text)
                return json.dumps(rt, ensure_ascii=False)
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
    return json.dumps('failed to get history data', ensure_ascii=False)


@app.route('/v1/data/get_history', methods=['POST'])
def get_history_api():
    data = request.get_json()

    dataSouceId = data.get('dataSourceId')
    itemVarIdList = data.get('dsItemIds')
    timeStart = data.get('timeStart')
    timeEnd = data.get('timeEnd')
    timeFormat = data.get('timeFormat')
    bSearchNearest = data.get('searchNearest', False)

    check = checkTime(timeStart, timeEnd, timeFormat)
    if check:
        return json.dumps(check)

    arrHistory = []
    timeRvList = []
    for item in itemVarIdList:
        data = getOneItemData(dataSouceId, item, timeStart, timeEnd, timeFormat, bSearchNearest)
        if not (isinstance(data, dict) and 'error' in data.keys()):
            valueData = []
            for i in data:
                bNum = True
                temp = 0.0
                try:
                    temp = float(i['value'])
                except Exception:
                    bNum = False
                if bNum:
                    valueData.append(effect_num(temp, 2))
                else:
                    valueData.append(temp)
            arrHistory.append(dict(dsItemId=item, data=valueData))
            if len(timeRvList) == 0:
                for data_item in data:
                    timeRvList.append(data_item['time'])
        else:
            arrHistory.append(dict(dsItemId=item, data=[]))
    if arrHistory:
        return json.dumps({"list": arrHistory, "timeShaft": timeRvList})
    else:
        return json.dumps({'error': 'historyData', 'msg': 'no history data'})


@app.route('/v1/data/get_realtime', methods=['POST'])
def get_realtime_api():
    try:
        rdata = request.get_json()

        projId = rdata.get('proj')
        pointList = rdata.get('pointList')
        data = BEOPDataAccess.getInstance().getBufferRTDataByProj(projId, pointList)
        dj = [dict(name=k, value=v) for k, v in data.items()]
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        dj = {}
    return json.dumps(dj, ensure_ascii=False)


@app.route('/v1/data/set_realtimedata_from_site', methods=['POST'])
def set_realtimedata_from_site_api():
    data = request.get_json()
    headers = {'content-type': 'application/json'}
    try:
        rt = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/set_realtimedata_from_site',
                           headers=headers, data=json.dumps(data))
        return rt.text
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return ""


@app.route('/data/get_history/at_moment', methods=['post'])
def get_history_data_at_moment():
    rt = []
    try:
        request_data = request.get_json()
        for rd in request_data:
            temp = {}
            bSearchNearest = rd.get('bSearchNearest', False)
            ids = rd.get('arrDs', [])
            tms = rd.get('arrMoment', [])
            time_format = rd.get('format')
            temp['arrMoment'] = tms
            point_value = {}
            temp['list'] = []
            group_info = MongoConnManager.getConfigConn().group_source(ids)
            for tm in tms:
                timeStart = tm
                timeEnd = timeStart
                for group_info_key in group_info:
                    l = group_info.get(group_info_key)
                    pointNameList = [x.get('point_name') for x in group_info.get(group_info_key)]
                    rt_his = BEOPDataAccess.getInstance().get_history_data_padded(
                        group_info_key, pointNameList, timeStart, timeEnd, time_format, bSearchNearest)
                    if isinstance(rt_his, list):
                        # 修复bug, rt_his可能取的不完整 fixed by woody
                        if len(rt_his) != len(pointNameList):
                            hisPoints = [x.get('name') for x in rt_his]
                            for item in pointNameList:
                                # 说明该点未取到历史数据
                                if item not in hisPoints:
                                    # 调用严工方法取到s_name即云点名字
                                    for n in l:
                                        if n.get('point_name') == item:
                                            s_name = n.get('post_id')
                                            break
                                    if not point_value.get(s_name):
                                        point_value[s_name] = []
                                    point_value[s_name].append(None)

                        for item in rt_his:
                            his_point_name = item.get('name')
                            s_name = None
                            if his_point_name:
                                his_data = item.get('history')
                                for n in l:
                                    if n.get('point_name') == his_point_name:
                                        s_name = n.get('post_id')
                                        break
                                if s_name:
                                    if not point_value.get(s_name):
                                        point_value[s_name] = []
                                    v = his_data[0].get('value')
                                    try:
                                        v = effect_num(v, 2)
                                    except:
                                        pass
                                    point_value[s_name].append(v)
                    else:
                        for point_name in pointNameList:
                            s_name = None
                            for n in l:
                                if n.get('point_name') == point_name:
                                    s_name = n.get('post_id')
                                    break
                            if s_name:
                                if not point_value.get(s_name):
                                    point_value[s_name] = []
                                point_value[s_name].append(None)
            if point_value:
                for k in point_value:
                    temp['list'].append({'ds': k, 'data': point_value.get(k)})
            temp['list'].sort(key=lambda list_item: ids.index(list_item.get('ds')))
            rt.append(temp)
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/get_history_data_raw/', methods=['POST'])
def get_history_data_raw():
    rt = None
    try:
        data = request.get_json()
        if data:
            projId = data.get('projId')
            pointList = data.get('pointList')
            timeStart = data.get('timeStart')
            timeEnd = data.get('timeEnd')
            timeFormat = data.get('timeFormat')
            bSearchNearest = data.get('searchNearest', False)
            rt = BEOPDataAccess.getInstance().getHistoryData(projId, pointList, timeStart, timeEnd, timeFormat,
                                                             bSearchNearest)
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/analysis/startWorkspaceDataGenHistogram_temp', methods=['POST'])
def startWorkspaceDataGenHistogram_temp():
    data = request.get_json()
    cursor = None
    _ = data.get('dataSourceId')
    itemVarIdList = data.get('dsItemIds')
    timeStart = data.get('timeStart')
    timeEnd = data.get('timeEnd')
    timeFormat = data.get('timeFormat')
    bSearchNearest = data.get('searchNearest', False)
    arrHistory = []
    timeRvList = []
    try:
        check = checkTime(timeStart, timeEnd, timeFormat)
        if check:
            return json.dumps(check)
        item_group = {}
        if itemVarIdList:
            for item in itemVarIdList:
                if item[0] == '@':
                    pointlist = item[1:].rsplit('|', 1)
                    if pointlist[0] in item_group.keys():
                        item_group.get(pointlist[0]).append(pointlist[1])
                    else:
                        item_group.update({pointlist[0]: [pointlist[1]]})
            for keys in item_group:
                cursor = MongoConnManager.getConfigConn().mdbBb[g_tableDataSource].find({
                    'projId': int(keys), 'type': 4, 'value': {'$in': item_group.get(keys)}})
                pname_list = []
                point_cloud = {}
                for item in cursor:
                    if item.get('params'):
                        params = item.get('params')
                        flags = params.get('flag')
                        ret = None
                        if flags == CloudPointType.MAPPING_POINT:
                            mapping = params.get('mapping')
                            if mapping:
                                ret = mapping.get('point')
                        else:
                            ret = item.get('value')
                        pname_list.append(ret)
                        point_cloud.update({ret: '@' + str(keys) + '|' + item.get('value')})
                data = BEOPDataAccess.getInstance().get_history_data_padded_reduce(int(keys), pname_list, timeStart,
                                                                                   timeEnd, timeFormat, bSearchNearest)
                if not (isinstance(data, list) and 'error' in data.keys()):
                    for i in data.get('data').keys():
                        valueData = []
                        vl = data.get('data').get(i)
                        for v in vl:
                            bNum = True
                            temp = 0.0
                            try:
                                temp = float(v)
                            except Exception:
                                bNum = False
                            if bNum:
                                valueData.append(effect_num(temp, 2))
                            else:
                                valueData.append(temp)
                        arrHistory.append(dict(dsItemId=point_cloud.get(i), data=valueData))
                    if len(timeRvList) == 0:
                        for ti in data.get('timeStamp'):
                            timeRvList.append(ti)
                else:
                    for c in itemVarIdList:
                        arrHistory.append(dict(dsItemId=c, data=[]))
    except Exception:
        logging.error('Unhandled exception! data=%s', data, exc_info=True, stack_info=True)
    finally:
        if cursor:
            cursor.close()
    if arrHistory:
        return json.dumps({"list": arrHistory, "timeShaft": timeRvList})
    else:
        return json.dumps({'error': 'historyData', 'msg': 'no history data'})


def startWorkspaceDataGenHistogram_fuc(timeStart, timeEnd, timeFormat, dataSouceId=None, itemVarIdList=None,
                                       bSearchNearest=False):
    if dataSouceId is None:
        dataSourceId = []
    if itemVarIdList is None:
        itemVarIdList = []
    check = checkTime(timeStart, timeEnd, timeFormat)
    if check:
        return json.dumps(check)

    arrHistory = []
    timeRvList = []
    preFilterInfo = isAllCloudPointName(itemVarIdList)
    if preFilterInfo is not None and len(preFilterInfo) >= 2:  # all new cloud points and only one project
        projId = preFilterInfo[0]
        pointNameList = preFilterInfo[1]
        tStart = time.time()
        requestSiteToCloudMaps = None
        if pointNameList is not None:
            (realPointList, requestSiteToCloudMaps) = BEOPDataAccess.genCloudSiteMap(projId, pointNameList)
            pointNameList = realPointList
        data = BEOPDataAccess.getInstance().get_history_data_padded_reduce(projId, pointNameList, timeStart, timeEnd,
                                                                           timeFormat, bSearchNearest)
        logging.debug('get_history_data_padded_reduce cost: %.1f' % (time.time() - tStart))
        rtdata = []
        tempPVDict = {}
        if 'error' not in data.keys():
            data_key = ''
            if len(data.get('data')) == 1:
                for keys in locals()['data']['data'].keys():
                    data_key = keys
                    break
            ptDataList = data.get('data')
            for ptName, ptValueList in ptDataList.items():
                ptFloatValueList = trimArrayToFloat(ptValueList)
                if requestSiteToCloudMaps is not None:
                    ptOrgName = requestSiteToCloudMaps.get(ptName, None)
                    if ptOrgName:
                        ptName = ptOrgName
                tempPVDict['@%s|%s' % (projId, ptName)] = ptValueList
            timeRvList = data.get('timeStamp')
        for itemvar in itemVarIdList:
            value_array = tempPVDict.get(itemvar, [])
            if len(value_array) > 0:  # 保留两位有效数字
                value_array = [effect_num(x, 2) if x is not None else None for x in value_array]
            arrHistory.append(dict(dsItemId=itemvar, data=value_array))
    else:
        for item in itemVarIdList:
            data = getOneItemData(dataSouceId, item, timeStart, timeEnd, timeFormat, bSearchNearest)
            if not (isinstance(data, dict) and 'error' in data.keys()):
                valueData = []
                for i in data:
                    bNum = True
                    temp = 0.0
                    try:
                        temp = float(i['value'])
                    except Exception:
                        bNum = False
                    if bNum:
                        valueData.append(effect_num(temp, 2))
                    else:
                        valueData.append(temp)
                arrHistory.append(dict(dsItemId=item, data=valueData))
                if len(timeRvList) == 0:
                    for inner_item in data:
                        timeRvList.append(inner_item['time'])
            else:
                arrHistory.append(dict(dsItemId=item, data=[]))
    if arrHistory:
        return {"list": arrHistory, "timeShaft": timeRvList}
    else:
        return None


@app.route('/setUserConfig', methods=['POST'])
def setUserConfig():
    data = request.get_json()
    userId = data.get('userId')
    option = data.get('option')
    rt = MongoConnManager.getConfigConn().setUserConfig(userId, option)
    return json.dumps(rt)


@app.route('/getUserConfig', methods=['POST'])
def getUserConfig():
    data = request.get_json()
    userId = data.get('userId')
    rt = MongoConnManager.getConfigConn().getUserConfig(userId)
    return json.dumps({'data': rt})


@app.route('/sendReport', methods=['POST'])
def sendFactoryReport():
    data = request.get_json()
    url = data.get('url')
    option = {
        'pageId': 1,
        'projectId': 293,
        'logo': '293_logo.png',
        'title': 'Workflow Summary',
        'project': '梅赛德斯奔驰',
        'url': url,
        'time': '2017-06-20',
        'lang': 'zh'
    }
    from beopWeb.mod_common.mail.ReportMail import sendFactoryPreviewToEmailQueue
    sendFactoryPreviewToEmailQueue(option, ['rfb-notify@rnbtech.com.hk'])
    return 'ok'


@app.route('/mqSendTask', methods=['POST'])
def mqSendTask():
    try:
        data = request.get_json()
        if data:
            queue_name = data.get('name')
            value = data.get('value')
            if not RabbitMqWorkQueueSend(queue_name, value):
                return jsonify(error='failed')
    except Exception:
        logging.error('Unhandled exception! locals: %s', locals(), exc_info=True, stack_info=True)
    return jsonify(error='ok')


def RabbitMqWorkQueueSend(queueName, sendVal):
    try:
        credentials = pika.PlainCredentials('may', 'linlin')
        connection = pika.BlockingConnection(pika.ConnectionParameters(host='192.168.1.18', credentials=credentials))
        channel = connection.channel()
        channel.queue_declare(queue=queueName, durable=True)
        channel.basic_publish(exchange='',
                              routing_key=queueName,
                              body=str(sendVal),
                              properties=pika.BasicProperties(
                                  delivery_mode=2,  # make message persistent
                              ))
        connection.close()
        return True
    except Exception:
        logging.error('Unhandled exception! locals: %s', locals(), exc_info=True, stack_info=True)
        return False
