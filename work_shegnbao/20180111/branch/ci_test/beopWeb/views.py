﻿"""
Routes and views for the flask application.
"""
import io
import gzip
import pickle
import zipfile
import xlrd
from email import charset
import codecs
from os import path, makedirs
import shutil
import csv
import re
import logging
from flask import request, redirect, url_for, abort, make_response, render_template
import requests
from flask import jsonify
from bson import ObjectId
from beopWeb import app
from beopWeb.mod_admin.User import User
from beopWeb.BEOPSqliteAccess import *
from beopWeb.BEOPDataAccess import BEOPDataAccess
from .mod_admin.Records import Records
from beopWeb.models import *
from beopWeb import app
from beopWeb.AuthManager import AuthManager
from beopWeb.mod_admin.SendMessage import *
from beopWeb.mod_oss.ossapi import OssAPI
from beopWeb.MongoConnManager import MongoConnManager
from beopWeb.mod_workflow.VerisionHistory import *
from beopWeb.mod_cxTool.PointTable import PointTable, PointTableSourceType
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_admin.BeOPPermission import BeOPPermission
from beopWeb.mod_common.Exceptions import *
from beopWeb.mod_admin.Upload import Upload
from beopWeb.mod_admin.Project import Project
from beopWeb.mod_admin.MenuConfigure import MenuConfigure
from beopWeb.BEOPDataBufferManager import BEOPDataBufferManager
from beopWeb.mod_memcache.RedisManager import RedisManager
from beopWeb.mod_common import i18n
from beopWeb.mod_common.BrowserUtils import BrowserUtils
from beopWeb.mod_admin.RealTimeData import RealTimeData
from beopWeb.mod_cxTool.dtuserver_prj import DtuServerProject
import base64
from flask import session
from beopWeb.mod_cxTool.pointSettingControllers import *

_mailSendTimestamp = datetime.now() - timedelta(1)
charset.add_charset('utf-8', charset.SHORTEST, charset.BASE64, 'utf-8')

if app.config.get('URL_CHECK'):
    @app.before_request
    def before_request():
        endpoint = request.endpoint
        if endpoint:
            if AuthManager.is_url_need_check(endpoint):
                rt = AuthManager.check_token(AuthManager.secret_key)
                if rt.get('status') != AuthManager.token_valid:
                    if not AuthManager.endpoint_in_checkless_list(endpoint):
                        co = request.cookies.get('ext_route', '')
                        if not co:
                            if request.is_xhr:
                                return jsonify({'error': 'token_invalid', 'msg': AuthManager.get_result(rt.get('status'))})
                            else:
                                return render_template('loginValidate.html', title='登录验证')
                # 设置后台语言
                try:
                    if request.cookies.get('language') and session.get('language') != request.cookies.get('language'):
                        session['language'] = request.cookies.get('language')
                except Exception as e:
                    logging.error('设置session语言错误' + str(e))

if app.config.get('URL_CHECK'):
    @app.after_request
    def after_request(response):
        if app.config.get('URL_CHECK'):
            endpoint = request.endpoint
            if endpoint and AuthManager.is_url_need_check(endpoint):
                userId = AuthManager.get_userId()
                if userId != None:
                    token = AuthManager.generate_auth_token(userId=int(userId), secretKey=AuthManager.secret_key)
                    response.set_cookie('token', token)
                    response.set_cookie('userId', str(userId))
            if AuthManager.endpoint_in_checkless_list(endpoint):
                response.set_cookie('ext_route', "1")
            return response


@app.route('/', methods=['GET'])
def main():
    rv = redirect(url_for('home'))
    return rv


@app.route('/codePreview', methods=['POST'])
def codePreview():
    form = request.form
    return render_template('codePreview.html',
                           html=form['codeHtml'], css=form['codeCss'], js=form['codeJs'])

@app.route('/platform', methods=['get'])
def platform_view():
    return render_template('indexPlatform.html',AppConfig=login_after(AuthManager.get_userId()))


@app.route('/company/<code>')
def company_index(code):
    project_db = Project()

    rt = AuthManager.check_token(AuthManager.secret_key)
    project = project_db.get_project_by_code(code)
    logo_id = None
    title = 'BeOP'
    icon = 'favicon'

    # from beopWeb.mod_admin import Management
    # info = Management.get_management_detail_by_param({'code_name':code.lower()})
    if project:
        logo_id = project.get('id')
    if rt.get('status') == AuthManager.token_valid:
        if code.lower() == 'hzbt':
            title = 'Tricyclic'
            icon = 'project_img/tricyclic'
        if code.lower() == 'cbre':
            logo_id = 80
        if code.lower() == 'pgjn':
            logo_id = 429
        if code.lower() == 'capitaland':
            logo_id = 528
        if code.lower() == 'yfbe':
            logo_id = 1024
        if code.lower() == 'huadenengyuan':
            logo_id = 203
        return render_template('indexObserverLoad.html', logoID=logo_id, icon=icon, title=title,
                               AppConfig=login_after(AuthManager.get_userId()), code=code)

    if code.lower() == 'pgjn':
        return render_template('login/PGJN.html', logoID=429, code=code, title='BeOP')
    if code.lower() == 'cbre':
        return render_template('login/CBRE.html', logoID=80)
    if code.lower() == 'hzbt':
        title = 'Tricyclic'
        return render_template('login/HZBT.html', logoID=186, icon='project_img/tricyclic', title=title)
    if code.lower() == 'capitaland':
        return render_template('login/capitaland.html', logoID=528,code=code)
    if code.lower() == 'yfbe':
        return render_template('login/YFBE.html', logoID=1024,code=code)
    if code.lower() == 'huadenengyuan':
        return render_template('login/huadenengyuan.html', logoID=203,code=code)
    if not project:
        return render_template('indexObserver.html')

    try:
        return render_template('login/' + code + '.html', logoID=logo_id, code=code, title='BeOP')
    except:
        return render_template('indexObserver.html')


@app.route('/privateGarden')
@app.route('/privateGarden/<target>')
def privateGarden(target=None):
    rt = AuthManager.check_token(AuthManager.secret_key)
    target = request.cookies.get('userId', None)
    sourceId = request.cookies.get('sourceId', 2)
    if int(sourceId) == 1 and rt.get('status') == AuthManager.token_valid:
        if target is None:
            return 'False'
        elif int(target) not in [1]:
            if(BEOPDataAccess.getInstance().validate_user_project_for_privateGarden(sourceId, target)):
                rv = login_after(target)
                resp = make_response(render_template('indexObserverLoad.html', title='BeOP', AppConfig=rv))
                return resp
    return 'False'


def login_after(userId, project_code=None):
    userProfile = BEOPDataAccess.getInstance().getUserProfileById(userId)
    rv = dict(status=True, id=userId, projects=BEOPDataAccess.getInstance().getProject(userId, project_code),
              userProfile=userProfile)
    # 返回访问IP用来判断地图
    rv['ip'] = request.remote_addr if request.remote_addr else None
    config = MongoConnManager.getConfigConn().getUserConfig(userId)
    rv['config'] = config
    if rv and rv.get('id') is not None:
        try:
            rv['permission'] = BeOPPermission().get_permissions_by_user_id(rv.get('id'))
        except Exception as e:
            rv['permission'] = {}

    user = User()
    rv['userinfo'] = user.query_user_by_id(userId, 'userfullname')
    return json.dumps(rv, ensure_ascii=False)


@app.route('/login', methods=['POST'])
@app.route('/login/<type>', methods=['POST'])
#type=:0 PC端普通登录  1：移动端登录（取消一些不必要权限参数） 2：无项目用户无法登陆
def login(type=0):
    rq_data = request.get_json()
    type = int(type)
    try:
        if rq_data:
            rv = loginTask(rq_data,type)
        else:
            return json.dumps({'status': False, 'code': 1})
    except NamePwdFailed:
        return json.dumps({'status': False, 'code': 1}, ensure_ascii=False)
    except AccountExpired:
        return json.dumps({'status': False, 'code': 2}, ensure_ascii=False)

    if type == 2:
        if not rv.get('projects'):
            return json.dumps({'status': False, 'code': 3}, ensure_ascii=False)

    # 返回访问IP用来判断地图
    rv['ip'] = request.access_route[0]

    if rv and rv.get('id') is not None:
        if type != 1:
            try:
                rv['permission'] = BeOPPermission().get_permissions_by_user_id(rv.get('id'))
            except Exception as e:
                rv['permission'] = {}

        # 排除开发人员的大量的登录信息, 自动化测试的登录信息
        if request.access_route[0] != '127.0.0.1' and int(rv.get('id')) not in [404, 2265]:
            logging.info('login ip:' + request.access_route[0])
            if not rv.get('noRecord'):
                Records.record_login(rv.get('id'), request.access_route[0], rq_data.get('agent'))
        userId = int(rv.get('id'))
        #privateGarden
        try:
            arrUrl = request.referrer.split('privateGarden/')
            if arrUrl[1]:
                if userId == 1:
                    userId = int(arrUrl[1])
                    token = AuthManager.generate_auth_token(userId=userId, secretKey=AuthManager.secret_key)
                    rp = AuthManager.set_cookie('token', token, userId, json.dumps(rv, ensure_ascii=False))
                    rp.set_cookie('sourceId', str(rv.get('id')))
                    return rp
                else:
                    return 'False'
        except Exception as e:
            None

        if app.config.get('URL_CHECK'):
            token = AuthManager.generate_auth_token(userId=userId, secretKey=AuthManager.secret_key)
            return AuthManager.set_cookie('token', token, userId, json.dumps(rv, ensure_ascii=False))
    return json.dumps(rv, ensure_ascii=False)

@app.route('/project_status', methods=['POST'])
def get_project_status():
    rq_data = request.get_json()
    user_id = rq_data.get("userId")
    if not user_id:
        return Utils.beop_response_error({'status': False})
    return Utils.beop_response_success({'status': True,
                                        'projects': BEOPDataAccess.getInstance().get_project_status(user_id)})


# temporary use
@app.route('/logout/<userId>')
def logout(userId):
    rv = True
    return AuthManager.remove_cookie(json.dumps(rv, ensure_ascii=False))


@app.route('/getProjectByUserId/<userId>')
def getProjectByUserId(userId):
    return json.dumps(BEOPDataAccess.getInstance().getProject(userId), ensure_ascii=False)


@app.route('/reset_pwd', methods=['POST'])
def reset_pwd():
    print('reset_pwd')
    return json.dumps(BEOPDataAccess.getInstance().resetPwd(request.get_json()), ensure_ascii=False)


@app.route('/mail', methods=['POST'])
def send_mail():
    global _mailSendTimestamp
    reciepent = request.form['reciepent']
    title = request.form['title']
    body = request.form['body']
    now = datetime.now()
    if (now - _mailSendTimestamp).total_seconds() > 5:
        rv = sendmail([reciepent], title, body)
        # _mailSendTimestamp = now
    else:
        print('error: sending mail too frequently')
        rv = 'error: you should wait a while before sending more mails'
    return json.dumps(rv, ensure_ascii=False)


@app.route('/beopversion', methods=['POST'])
def get_beopversion():
    name = request.form['name']
    os.chdir(app.config['FTP_PATH'])
    fl = os.listdir()
    for f in fl:
        r = re.search(name, f)
        if r:
            return f[r.span()[1] + 1:-4]
    rv = 'failure: software not found'
    return json.dumps(rv, ensure_ascii=False)


def sendmail(reciepents, title, body=None):
    print('sendmail')
    mail = Mail(app)
    msg = Message(title, reciepents)
    msg.body = body.encode('utf-8')
    msg.charset = 'utf-8'
    try:
        mail.send(msg)
        rv = 'success'
    except Exception as e:
        rv = 'error: sending mail failed. {}'.format(e)
        logging.error(rv)
    return json.dumps(rv, ensure_ascii=False)


@app.route('/get_realtimedata', methods=['POST'])
def get_realtimedata():
    try:
        dj = dict(info='none')
        timeb = time.time()
        rdata = request.get_json()
        if rdata.get('proj') is None:
            return json.dumps("error param:proj is none", ensure_ascii=False)
        else:
            proj = rdata.get('proj')
        pointList = rdata.get('pointList')
        requestSiteToCloudMaps = None
        #filter requests
        if pointList is not None and isinstance(pointList, list):
            pointList = [item for item in pointList if len(item)>0 ]
            if len(pointList)==0:
                return json.dumps(dict(error=1, msg='pointList is array but every item content is all empty.'), ensure_ascii=False)
        #如果点列表不为空，则需要进行现场点的映射处理
        if pointList is not None:
            (realPointList,requestSiteToCloudMaps) =  BEOPDataAccess.getInstance().genCloudSiteMap(proj, pointList)
            pointList = realPointList

        data = BEOPDataAccess.getInstance().getBufferRTDataByProj(proj,pointList)
        dj = []
        for k,v in data.items():
            if requestSiteToCloudMaps and pointList:
                rtName = requestSiteToCloudMaps.get(k)
                if rtName is None:
                    rtName = k
            else:
                rtName = k
            dj.append(dict(name=rtName, value=v))
        timee = time.time()
    except Exception as e:
        print('get_realtimedata error:' + e.__str__())
        logging.error('get_realtimedata error:' + e.__str__())
        dj = dict(error = e.__str__())
    return json.dumps(dj, ensure_ascii=False)


def updateCloudSiteMap(proj):
    allCloudToSitePoints = MongoConnManager.getConfigConn().getCloudPointSiteType(int(proj))
    RedisManager.set_cloudpoints_site(proj, allCloudToSitePoints)
    xx = RedisManager.get_cloudpoints_site(proj)
    if allCloudToSitePoints:
        return len(allCloudToSitePoints)
    else:
        return 0



@app.route('/cloudpoint/update',methods=['POST'])
def cloudpoint_update():
    try:
        dj = dict(info='none')
        rdata = request.get_json()
        if rdata.get('proj') is None:
            return json.dumps("error param:proj is none", ensure_ascii=False)
        else:
            proj = rdata.get('proj')

        rvCount = updateCloudSiteMap(proj)
        dj = dict(error=0, msg='', count = rvCount)

    except Exception as e:
        print('cloudpoint_update error:' + e.__str__())
        logging.error('cloudpoint_update error:' + e.__str__())
        dj = dict(error = e.__str__())
    return json.dumps(dj, ensure_ascii=False)


@app.route('/get_realtimedata_time', methods=['POST'])
def get_realtimedata_time():
    rt = {}
    try:
        rdata = request.get_json()
        if rdata:
            proj = rdata.get('proj')
            if proj is None:
                rt = 'error: get_realtimedata_time proj in post parameters is None'
            else:
                pointList = rdata.get('pointList')
                data = BEOPDataAccess.getInstance().getBufferRTDataWithTimeByProj(
                    proj)  # BEOPDataBufferManager.getInstance().getDataWithTimeByProj(proj, None)
                for k, v in data.items():
                    if k in pointList:
                        rt[k] = v[0].strftime('%Y-%m-%d %H:%M:%S')
    except Exception as e:
        rt = 'error: get_realtimedata_time. {}'.format(e)
        logging.error(rt)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/get_realtimedata_with_time', methods=['POST'])
def get_realtimedata_with_time():
    rdata = request.get_json()
    search_text = rdata.get('search_text').strip()
    page_size = int(rdata.get('page_size'))
    start_num = (int(rdata.get('current_page')) - 1) * page_size
    end_num = start_num + page_size

    if rdata.get('proj') is None:
        proj = app.config['PROJECT_DATABASE']
    else:
        proj = rdata.get('proj')

    data = BEOPDataAccess.getInstance().getBufferRTDataWithTimeByProj(proj)

    data_list = [dict(name=k, time=v[0].strftime('%Y-%m-%d %H:%M:%S'), value=v[1]) for k, v in data.items()]
    search_result_list = []

    if search_text:
        try:
            search_re = Utils.handle_search_text(search_text)
        except:
            return Utils.beop_response_error(msg='please check your search text')
        for data_item in data_list:
            if search_re.match(data_item.get('name').strip()):
                search_result_list.append(data_item)
    else:
        search_result_list = data_list

    ret_list = search_result_list[start_num:end_num]
    pt = PointTable(proj)
    points_map = pt.get_some_points_map(PointTableSourceType.TYPE_ENGINE, [item.get('name') for item in ret_list])
    for point in ret_list:
        if points_map.get(point.get('name')) and points_map.get(point.get('name')).get('alias'):
            point['alias'] = points_map.get(point.get('name')).get('alias')
    result = {
        'total': len(search_result_list),
        'list': ret_list
    }
    return json.dumps(result, ensure_ascii=False)


@app.route('/get_realtimedata_by_projname', methods=['POST'])
def get_realtimedata_by_projname():
    args = request.form
    rdata = request.get_json()
    dj = []
    if rdata.get('proj') is None:
        projName = app.config['PROJECT_DATABASE']
    else:
        projName = rdata.get('proj')

    projId = BEOPDataAccess.getInstance().getProjIdByName(projName)
    data = BEOPDataAccess.getInstance().getBufferRTDataByProj(projId)
    if isinstance(data, dict):
        dj = [dict(name=k, value=v) for k, v in data.items()]
    return json.dumps(dj, ensure_ascii=False)


@app.route('/set_realtimedata', methods=['POST'])
def set_realtimedata():
    rv = None

    data = request.get_json()
    headers = {'content-type': 'application/json'}
    try:
        rv = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/set_realtimedata',
                           headers=headers, data=json.dumps(data))
    except Exception as e:
        print('set_realtimedata error:' + e.__str__())
        logging.error('set_realtimedata error:' + e.__str__())
    return json.dumps(rv.text, ensure_ascii=False)


# golding added
@app.route('/get_realtimedata_with_description_by_projname', methods=['POST'])
def get_realtimedata_with_description_by_projname():
    dj = []
    try:
        rdata = request.get_json()
        projID = rdata.get('projid')

        pointList = rdata.get('pointList')
        data = BEOPDataAccess.getInstance().getBufferRTDataByProj(projID,
                                                                  pointList)  # BEOPDataBufferManager.getInstance().getDataByProj(projID, pointList)

        s3dbname = BEOPDataAccess.getInstance().getProjS3db(projID)
        pointInfoList = BEOPSqliteAccess.getInstance().getPointMapsFromS3db(s3dbname)

        if not isinstance(data, list):
            return json.dumps(data, ensure_ascii=False)

        for x in data:
            desp = ''
            if x[0] in pointInfoList:
                desp = pointInfoList[x[0]]
            dj.append(dict(name=x[0], value=x[1], desc=desp))
    except Exception as e:
        print('set_realtimedata error:' + e.__str__())
        logging.error('set_realtimedata error:' + e.__str__())

    return json.dumps(dj, ensure_ascii=False)


@app.route('/set_to_site_by_projname', methods=['POST'])
def set_to_site_by_projname():
    # print('set_realtimedata_by_projname')
    data = request.get_json()
    projEName = data.get('db')
    point = data.get('point')
    value = data.get('value')
    rv = BEOPDataBufferManager.getInstance().setDataToSite(projEName, point, value)
    return json.dumps(rv, ensure_ascii=False)


@app.route('/set_mutile_to_site_by_projname', methods=['POST'])
def set_mutile_to_site_by_projname():
    # print('set_mutile_to_site_by_projname')
    data = request.get_json()
    projName = data.get('db')
    point = data.get('point')
    value = data.get('value')
    rv = BEOPDataBufferManager.getInstance().setMutilDataToSite(projName, point, value)
    return json.dumps(rv, ensure_ascii=False)


@app.route('/set_realtimedata_by_projname', methods=['POST'])
def set_realtimedata_by_projname():
    # print('set_realtimedata_by_projname')

    rv = None

    data = request.get_json()
    headers = {'content-type': 'application/json'}
    try:
        rtPost = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/set_realtimedata_by_projname',
                               headers=headers, data=json.dumps(data))
        rv = rtPost.text
    except Exception as e:
        print('set_realtimedata error:' + e.__str__())
        logging.error('set_realtimedata error:' + e.__str__())
    return json.dumps(rv, ensure_ascii=False)


@app.route('/set_realtimedata_by_projid', methods=['POST'])
def set_realtimedata_by_projid():
    # print('set_realtimedata_by_projname')
    rv = None

    data = request.get_json()
    headers = {'content-type': 'application/json'}
    try:
        rtPost = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/set_realtimedata_by_projid',
                               headers=headers, data=json.dumps(data))
        rv = rtPost.text
    except Exception as e:
        print('set_realtimedata error:' + e.__str__())
        logging.error('set_realtimedata error:' + e.__str__())
    return json.dumps(rv, ensure_ascii=False)


@app.route('/set_realtimedata_from_site', methods=['POST'])
def set_realtimedata_from_site():
    # print('set_mutile_realtimedata_by_projname')
    data = request.get_json()
    headers = {'content-type': 'application/json'}
    try:
        rt = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/set_realtimedata_from_site',
                           headers=headers, data=json.dumps(data))
    except Exception as e:
        print('set_realtimedata_from_site error:' + e.__str__())
        logging.error('set_realtimedata_from_site error:' + e.__str__())
    return rt.text


@app.route('/set_mutile_realtimedata_by_projname', methods=['POST'])
def set_mutile_realtimedata_by_projname():
    # print('set_mutile_realtimedata_by_projname')
    rv = None
    try:
        data = request.get_json()
        projName = data.get('db')
        pointList = data.get('point')
        valueList = data.get('value')
        headers = {'content-type': 'application/json'}
        if projName is None or pointList is None or valueList is None:
            rv = 'json post data not good'
        else:
            projId = BEOPDataAccess.getInstance().getProjIdByName(projName)
            dataNew = dict(projId=projId, point=data.get('point'), value=data.get('value'), flag=1)
            rv = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/set_mutile_realtimedata_by_projid',
                               headers=headers, data=json.dumps(dataNew))
    except Exception as e:
        print('set_mutile_realtimedata_by_projname error:' + e.__str__())
        logging.error('set_mutile_realtimedata_by_projname error:' + e.__str__())
    return json.dumps(rv, ensure_ascii=False)


@app.route('/set_mutile_realtimedata_by_projid', methods=['POST'])
def set_mutile_realtimedata_by_projId():
    # print('set_mutile_realtimedata_by_projname')
    data = request.get_json()
    headers = {'content-type': 'application/json'}
    try:
        rt = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/set_mutile_realtimedata_by_projid',
                           headers=headers, data=json.dumps(data))
    except Exception as e:
        print('set_mutile_realtimedata_by_projId error:' + e.__str__())
        logging.error('set_mutile_realtimedata_by_projId error:' + e.__str__())
    return rt.text


@app.route('/save_operation_log', methods=['POST'])
def save_operation_log():
    rt = None
    post_data = request.get_json()
    if post_data:
        rt = MongoConnManager.getConfigConn().save_operation_log(post_data)
    return jsonify(data=rt)


@app.route('/get_operation_log', methods=['POST'])
def get_operation_log():
    data = request.get_json()
    proj = data.get('proj')
    date = data.get('date')
    rt = []
    try:
        timeStart = datetime.strptime(date, '%Y-%m-%d')
        timeEnd = timeStart + timedelta(1)
        rt = MongoConnManager.getConfigConn().get_operation_log(proj, timeStart, timeEnd)
        name_dict = BEOPDataAccess.getInstance().get_user_name_dict_by_id(list(set([x.get('userId') for x in rt])))
        for item in rt:
            item.update({'username': name_dict.get(int(item.get('userId')))})
    except Exception as e:
        print('get_operation_log error:' + e.__str__())
        logging.error('get_operation_log error:' + e.__str__())
    return json.dumps(rt)


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


@app.route('/get_history_data', methods=['POST'])
def get_history_data():
    # print('get_history_data')
    data = request.get_json()
    projId = BEOPDataAccess.getInstance().getProjIdByName(data.get('project'))
    rtn = BEOPDataAccess.getInstance().getHistoryData(projId, data.get('pointName'), data.get('timeStart'),
                                                      data.get('timeEnd'), data.get('timeFormat'))

    # rtn = BEOPDataBufferManager.getInstance().getHistoryDataByProjname(data.get('project'), data.get('pointName'),
    #                                                                   data.get('timeStart'), data.get('timeEnd'),
    #                                                                   data.get('timeFormat'))
    return json.dumps(rtn, ensure_ascii=False)


@app.route('/get_history_data_padded', methods=['POST'])
def get_history_data_padded():
    data = request.get_json()
    projId = int(data.get('projectId'))
    pointList = data.get('pointList')

    # invalid query filter:
    strTimeStart = data.get('timeStart')
    strTimeEnd = data.get('timeEnd')
    strTimeFormat = data.get('timeFormat')
    bSearchNearest = data.get('searchNearest', False)
    result = BEOPDataAccess.getInstance().get_history_data_padded(projId, pointList, strTimeStart, strTimeEnd,
                                                                  strTimeFormat, bSearchNearest)
    return json.dumps(result, ensure_ascii=False)


@app.route('/get_history_data_padded_reduce', methods=['POST'])
def get_history_data_padded_reduce():
    data = request.get_json()
    result = []
    if data:
        projId = int(data.get('projectId'))
        pointList = data.get('pointList')

        # invalid query filter:
        strTimeStart = data.get('timeStart')
        strTimeEnd = data.get('timeEnd')
        strTimeFormat = data.get('timeFormat')
        bSearchNearest = data.get('searchNearest', False)
        prop = data.get('prop')
        if prop:
            for key in prop:
                if key not in pointList:
                    pointList.append(key)
                pointList.append({key:prop.get(key)})
        result = BEOPDataAccess.getInstance().get_history_data_padded_reduce(projId, pointList, strTimeStart,
                                                                             strTimeEnd,
                                                                             strTimeFormat, bSearchNearest)
    return json.dumps(result, ensure_ascii=False)


@app.route('/join_point', methods=['POST'])
def join_point():
    data = request.get_json()
    name = BEOPDataAccess.getInstance().getProjMysqldb(data.get('proj'))
    rv = BEOPDataAccess.getInstance().joinPointsToDb(name, data.get('startTime'), data.get('endTime'),
                                                     data.get('timeFormat'), data.get('pointList'))
    return json.dumps(rv, ensure_ascii=False)


def loginTask(login,requestType=0):
    token = login.get('token', None)

    if token:
        userId = AuthManager.get_userId()
    else:
        userId = BEOPDataAccess.getInstance().validate_user(login)

    if userId is None:
        return dict(status=False)
    userId = int(userId)

    userConfig = MongoConnManager.getConfigConn().getUserConfig(userId)
    userProfile = BEOPDataAccess.getInstance().getUserProfileById(userId)

    return dict(status=True, id=userId, userProfile=userProfile,
                projects=BEOPDataAccess.getInstance().getProject(userId, login.get('loginCode', None),requestType), userConfig = userConfig)


@app.route('/project/update', methods=['post'])
def newProUpdate():
    print('newProUpdate')
    data = request.get_json()
    id = data.get('userId')
    if id is None:
        rv = {'error': 'projects update fail'}
        return rv
    rv = BEOPDataAccess.getInstance().getProject(id)
    return json.dumps(rv, ensure_ascii=False)


def get_s3dbpath_cloud(dbname):
    print('get_s3dbpath_cloud')
    s3dbDir = app.config.get('S3DB_DIR_CLOUD')
    filepath = os.path.join(s3dbDir, dbname)
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
    return json.dumps(dict(groupStatics=groupStatics, userStatics=userStatics), ensure_ascii=False)


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
    fileDir = path.join(folder, filename)
    makedirs(folder, exist_ok=True)
    rv = 'unknown'
    if filecontent:
        try:
            file = codecs.open(fileDir, 'w', ucode)
            '''filecontent = filecontent.decode('utf-8')'''
            file.write(filecontent)
            file.close()
            rv = 'success'
        except Exception as e:
            print(e)
            logging.error(e)
            rv = 'failed for file open or close wrong.'
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

    return json.dumps(json_file, ensure_ascii=False)


@app.route('/get_config_data/<userId>', methods=['POST'])
def get_config_data(userId):
    rt = {'error': 'successful'}
    upload_file = request.files.getlist("config-file")
    for file in upload_file:
        try:
            dirPath = os.path.join(os.getcwd(), 'temp')
            if not os.path.exists(dirPath):
                os.makedirs(dirPath)
            dirPath = os.path.join(dirPath, str(userId))
            if not os.path.exists(dirPath):
                os.makedirs(dirPath)
            fullFilePath = os.path.join(dirPath, file.filename)
            file.save(fullFilePath)
        except Exception as e:
            rt = {'error': e.__str__()}
            logging.error(e.__str__())
    return json.dumps(rt, ensure_ascii=False)

@app.route('/project/create', methods=['POST'])
def project_create():
    rv = {}
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(msg='not login')
    project_img = None
    data = request.form
    projId = data.get('projId')
    latlng = data.get('latlng')
    address = data.get('address')
    weatherStationId = data.get('weatherStationId')
    if not weatherStationId:
        if latlng:
            latLonlist = (latlng).split(',')
            lonLat = latLonlist[1] + ',' + latLonlist[0]
            url_get_city = 'https://api.heweather.com/v5/search?city=%s&key=72c3d7b460624692959fc0e250ad33f8' % (
                lonLat,)
            req = requests.get(url_get_city)
            if req.status_code == 200:
                result = json.loads(req.text)
                cityDict = result.get('HeWeather5')[0]
                status = cityDict.get('status')
                if status == 'ok':
                    basic = cityDict.get('basic')
                    if basic and 'id' in basic:
                        weatherStationId = basic.get('id')
                else:
                    print(status)
                    rv = {'error': False, 'msg': status}
            else:
                raise Exception('The weather service is not available')
        else:
            raise Exception('经纬度不可为空')
    getAllStaionIdURL = app.config['BEOP_SERVICE_ADDRESS'] + '/weather/get_weather_stations'
    getStationReq = requests.get(url=getAllStaionIdURL, headers={"content-type": "application/json"})
    if getStationReq.status_code == 200:
        stationResult = json.loads(getStationReq.text)
        stationIds = stationResult.get('data')
        if weatherStationId not in stationIds:
            setStationIdURL = '%s/weather/set/weatherCityInfo/%s' % (
            app.config['BEOP_SERVICE_ADDRESS'], weatherStationId)
            setStationIdReq = requests.get(url=setStationIdURL, headers={"content-type": "application/json"})
            if setStationIdReq.status_code == 200:
                setStationIdResult = json.loads(setStationIdReq.text)
                if setStationIdResult.get('error'):
                    raise Exception('Set station id failed')
            else:
                raise Exception('Set station id failed')
    else:
        raise Exception('Get station id failed')
    projCode = data.get('projCode')
    if not projCode:
        projCode = data.get('name')

    projNameZh = data.get('projNameZh')
    if not projNameZh:
        projNameZh = data.get('name')
    projNameEn = data.get('projNameEn')
    if not projNameEn:
        projNameEn = data.get('name')

    createUserId = data.get('userId')
    is_advance = data.get('isAdvance', 0)
    projDateFormat = 0 if data.get('projDateFormat') is None else data.get('projDateFormat')

    # realityMarkValue == db=>project=>column(mysqlname)
    try:
        is_advance = int(is_advance)
    except:
        is_advance = 0

    dbName = data.get('dbName')  # 项目标识
    real_time_db = data.get('realTimeDS')  # 实时数据库名称
    history_db = data.get('historyDS')  # 历史数据库名称

    upload_file = request.files.getlist("pro-pic-file")
    if upload_file and upload_file[0]:
        project_img = projCode + '.jpg'
        Upload.upload_file_to_oss('static/images/project_img/', project_img, upload_file[0])

    logo_img = None

    if dbName:  # 实际项目
        real_time_db = dbName
        history_db = dbName

    if not real_time_db:
        real_time_db = 'beopdata_' + projCode

    if not history_db:
        history_db = 'beopdata_' + projCode

    if projId is not None:
        BEOPDataAccess.getInstance().updateProject(int(projId), projCode, projNameZh, latlng, address, projNameEn,
                                                   project_img, int(projDateFormat), real_time_db_name=real_time_db,
                                                   history_db_name=history_db, is_advance=is_advance,
                                                   logo_img=logo_img)

        log_str = '\n***** MODIFY PROJECT：user id=' + str(user_id) \
                  + ',\n project id=' + str(projId) \
                  + ',\n projCode=' + str(projCode) \
                  + ',\n projNameZh=' + str(projNameZh) \
                  + ',\n project_img=' + str(project_img) \
                  + ',\n dbName=' + str(dbName) \
                  + ',\n mysql=' + str(real_time_db) \
                  + ',\n collection=' + str(history_db) \
                  + ',\n is_advance=' + str(is_advance) \
                  + ',\n logo_img=' + str(logo_img) \
                  + ',\n modify time=' + str(datetime.now().strftime(Utils.datetime_format_full)) \
                  + ',\n projDateFormat=' + str(projDateFormat)
        logging.info(log_str)
        rv = {'status': 'OK', 'msg': 'Modify project success, please relogin!', 'projectId': projId}
    else:
        beopDBList = BEOPDataAccess.getInstance().GetAllDBNames()
        if beopDBList is None:
            beopDBList = []

        if dbName in beopDBList:
            return {'status': 'ERROR', 'msg': 'db is already exist'}
        else:
            projId, newRoleId = BEOPDataAccess.getInstance().createProject(projCode, projNameZh, projCode + '.s3db',
                                                                              real_time_db, history_db,
                                                                              latlng, address, projNameEn, createUserId,
                                                                              project_img,int(projDateFormat),
                                                                              weatherStationId, is_advance,
                                                                              logo_img)
            if projId:
                mc = MenuConfigure()
                mc.create_project_nav(projId, newRoleId)

            # should update memcache after project setup
            if projId > 0:
                MongoConnManager.UpdateProjectLocateMap()
                MongoConnManager.UpdateProjectInfo()
            log_str = '\n***** CREATE PROJECT：user id=' + str(user_id) \
                      + ',\n project id=' + str(projId) \
                      + ',\n projCode=' + str(projCode) \
                      + ',\n projNameZh=' + str(projNameZh) \
                      + ',\n project_img=' + str(project_img) \
                      + ',\n dbName=' + str(dbName) \
                      + ',\n mysql=' + str(real_time_db) \
                      + ',\n collection=' + str(history_db) \
                      + ',\n is_advance=' + str(is_advance) \
                      + ',\n logo_img=' + str(logo_img) \
                      + ',\n create time=' + str(datetime.now().strftime(Utils.datetime_format_full)) \
                      + ',\n projDateFormat=' + str(projDateFormat)
            logging.info(log_str)
            rv = {'status': 'OK', 'projectId': projId}

    if request.files.getlist("pro-pic-logo") and projId:
        upload_logo = request.files.getlist("pro-pic-logo")
        if upload_logo and upload_logo[0]:
            logo_name = str(projId) + '_logo' + '.png'
            Upload.upload_file_to_oss('custom/project_img/', logo_name, upload_logo[0])

    MongoConnManager.UpdateProjectInfo()
    MongoConnManager.UpdateProjectLocateMap()
    rv['projects'] = BEOPDataAccess.getInstance().getProject(user_id)
    return json.dumps(rv, ensure_ascii=False)


@app.route('/project/edit', methods=['POST'])
def project_edit():
    rt = {'msg': None, 'error': 1}
    user_id = AuthManager.get_userId()
    try:
        form = request.form
        projId = int(form.get('projId'))
        defaultRv = BEOPDataAccess.getInstance().get_project_info_by_projId(projId)
        if defaultRv is None:
            raise Exception('Wrong projId!')
        # 更新之前项目信息
        dtDict = {
            'address': defaultRv.get('address'),
            'historyDS': defaultRv.get('collectionname'),
            'realTimeDS': defaultRv.get('datadb'),
            'latlng': defaultRv.get('latlng'),
            'projCode': defaultRv.get('name_en'),
            'projDateFormat': defaultRv.get('time_format'),
            'projNameEn': defaultRv.get('name_english'),
            'projNameZh': defaultRv.get('name_cn'),
            'isAdvance': defaultRv.get('is_advance')
        }
        # 更新之后项目信息
        disDict = {
            'address': form.get('address'),
            'historyDS': form.get('historyDS') if form.get('historyDS') else form.get('dbName'),
            'realTimeDS': form.get('realTimeDS') if form.get('realTimeDS') else form.get('dbName'),
            'latlng': form.get('latlng'),
            'projCode': form.get('projCode'),
            'projDateFormat': int(form.get('projDateFormat')),
            'projNameEn': form.get('projNameEn'),
            'projNameZh': form.get('projNameZh'),
            'isAdvance': int(form.get('isAdvance')) if form.get('isAdvance') else defaultRv.get('is_advance')
        }
        project_img = None
        upload_file = request.files.getlist("pro-pic-file")
        if upload_file and upload_file[0]:
            project_img = form.get('projCode') + '.jpg'
            Upload.upload_file_to_oss('static/images/project_img/', project_img, upload_file[0])

        logo_name = None
        if request.files.getlist("pro-pic-logo") and projId:
            upload_logo = request.files.getlist("pro-pic-logo")
            if upload_logo and upload_logo[0]:
                logo_name = str(projId) + '_logo' + '.png'
                Upload.upload_file_to_oss('custom/project_img/', logo_name, upload_logo[0])

        rv = BEOPDataAccess.getInstance().editProject(dtDict, disDict, projId, project_img, logo_name)
        if rv:
            rt.update({'error': 0})
        MongoConnManager.UpdateProjectInfo()
        MongoConnManager.UpdateProjectLocateMap()
        rt.update({'status': 'OK', 'projectId': projId})
        rt['projects'] = BEOPDataAccess.getInstance().getProject(user_id)
    except Exception as e:
        rt.update({'msg': e.__str__()})
        logging.error("project_edit error: {}".format(str(e)))
    return json.dumps(rt, ensure_ascii=False)


def traverseFile(ProjId, data_count, row_count, row, timeList, valueList, pointList, insert_data_list, dbName):
    if row_count == 0:
        pointList.extend(row.split(',')[1:])
        pointList = [x.strip() for x in pointList]
        rv = BEOPDataAccess.getInstance().get_pointList_from_rtTable(ProjId)
        setrv = set(rv)
        setgpointlist = set(pointList)
        more = setgpointlist - setrv
        if len(more) > 0:
            BEOPDataAccess.getInstance().insert_into_realtime_inputdata(ProjId, list(more))
        rv1 = BEOPDataAccess.getInstance().get_pointList_from_bufTable(ProjId)
        setrv1 = set(rv1)
        more1 = setgpointlist - setrv1
        if len(more1) > 0:
            BEOPDataAccess.getInstance().insert_into_realtime_bufferdata(ProjId, list(more1))
    else:
        d = row.split(',')
        if d:
            if d[0]:
                d[0] = d[0].strip()
                try:
                    t = datetime.strptime(d[0], '%Y-%m-%d %H:%M:%S')
                except:
                    try:
                        t = datetime.strptime(d[0], '%Y/%m/%d %H:%M')
                    except:
                        try:
                            t = datetime.strptime(d[0], '%Y/%m/%d %H:%M:%S')
                        except:
                            t = datetime.strptime(d[0], '%Y-%m-%d %H:%M')
                timeList.append(t)
                valueList.append(d[1:])
                data_count += 1
    row_count += 1
    if data_count > 0 and data_count % 100 == 0:
        if timeList and valueList:
            max_time = timeList[-1]
            min_time = timeList[0]
            for index, t in enumerate(timeList):
                if len(valueList[index]) == len(pointList):
                    for index1, v in enumerate(valueList[index]):
                        if v != 'null':
                            insert_data_list.append(
                                (t.strftime('%Y-%m-%d %H:%M:%S'), pointList[index1].strip(), v.strip()))
                            if len(insert_data_list) > 0 and len(insert_data_list) % 30000 == 0:
                                ret = requests.post(
                                    url=app.config.get('BEOP_SERVICE_ADDRESS') + '/sync_data_to_mongodb/smart',
                                    # app.config.get('BEOP_SERVICE_ADDRESS')
                                    headers={'content-type': 'application/json'},
                                    data=json.dumps({'dbname': dbName,
                                                     'mintime': min_time.strftime('%Y-%m-%d %H:%M:%S'),
                                                     'maxtime': max_time.strftime('%Y-%m-%d %H:%M:%S'),
                                                     'hisdata': insert_data_list}))
                                if ret.status_code != 200:
                                    raise Exception('insert into mongo failed')
                                else:
                                    insert_data_list.clear()
            if len(insert_data_list) > 0:
                ret = requests.post(url=app.config.get('BEOP_SERVICE_ADDRESS') + '/sync_data_to_mongodb/smart',
                                    headers={'content-type': 'application/json'},
                                    data=json.dumps({'dbname': dbName,
                                                     'mintime': min_time.strftime(
                                                         '%Y-%m-%d %H:%M:%S'),
                                                     'maxtime': max_time.strftime(
                                                         '%Y-%m-%d %H:%M:%S'),
                                                     'hisdata': insert_data_list}))
                if ret.status_code != 200:
                    raise Exception('insert into mongo failed')
                else:
                    insert_data_list.clear()
            timeList.clear()
            valueList.clear()
    return data_count, row_count


def processFileData(timeList, valueList, pointList, insert_data_list, dbName, ProjId, userId):
    if timeList and valueList:
        max_time = timeList[-1]
        min_time = timeList[0]
        for index, t in enumerate(timeList):
            if len(valueList[index]) == len(pointList):
                for index1, v in enumerate(valueList[index]):
                    if v != 'null':
                        insert_data_list.append((t.strftime('%Y-%m-%d %H:%M:%S'),
                                                 pointList[index1].strip(), v.strip()))
                        if len(insert_data_list) > 0 and len(insert_data_list) % 30000 == 0:
                            ret = requests.post(
                                url=app.config.get(
                                    'BEOP_SERVICE_ADDRESS') + '/sync_data_to_mongodb/smart',
                                headers={'content-type': 'application/json'},
                                data=json.dumps({'dbname': dbName,
                                                 'mintime': min_time.strftime(
                                                     '%Y-%m-%d %H:%M:%S'),
                                                 'maxtime': max_time.strftime(
                                                     '%Y-%m-%d %H:%M:%S'),
                                                 'hisdata': insert_data_list}))
                            if ret.status_code != 200:
                                raise Exception('insert into mongo failed')
                            else:
                                insert_data_list.clear()
        if len(insert_data_list) > 0:
            ret = requests.post(
                url=app.config.get('BEOP_SERVICE_ADDRESS') + '/sync_data_to_mongodb/smart',
                headers={'content-type': 'application/json'},
                data=json.dumps({'dbname': dbName,
                                 'mintime': min_time.strftime(
                                     '%Y-%m-%d %H:%M:%S'),
                                 'maxtime': max_time.strftime(
                                     '%Y-%m-%d %H:%M:%S'),
                                 'hisdata': insert_data_list}))
            if ret.status_code != 200:
                raise Exception('insert into mongo failed')
            else:
                insert_data_list.clear()
        timeList.clear()
        valueList.clear()
    pt = PointTable(ProjId)
    pt.sync_cloud_points(int(userId))
    allCloudToSitePoints = MongoConnManager.getConfigConn().getCloudPointSiteType(int(ProjId))
    RedisManager.set_cloudpoints_site(int(ProjId), allCloudToSitePoints)

@app.route('/project/import_user_data/<userId>', methods=['POST'])
def importUserData(userId):
    rt = {'error': 'successful'}
    try:
        data = request.get_json()
        dataFileList = data.get('dataFileName')
        for fileName in dataFileList:
            dirPath = os.path.join(os.getcwd(), 'temp')
            if not os.path.exists(dirPath):
                raise Exception('file %s is not exist'%(fileName,))
            dirPath = os.path.join(dirPath, str(userId))
            if not os.path.exists(dirPath):
                raise Exception('file %s is not exist'%(fileName,))
            fullFilePath = os.path.join(dirPath, fileName)
            ProjId = data.get('projId')
            dbName = BEOPDataAccess.getInstance().getProjMysqldb(ProjId)
            bRes1 = BEOPDataAccess.getInstance().createRTTable('rtdata_' + dbName)
            bRes2 = BEOPDataAccess.getInstance().createWarningTable(dbName)
            if bRes1 and bRes2:
                row_count = 0
                data_count = 0
                pointList = []
                timeList = []
                valueList = []
                insert_data_list = []
                filenameExtension = fileName.split('.')[-1]
                if (filenameExtension == 'csv'):
                    with open(fullFilePath, 'rt', encoding='utf8') as importFile:
                        for row in importFile:
                            data_count, row_count = traverseFile(ProjId, data_count, row_count, row, timeList,
                                                                 valueList, pointList, insert_data_list, dbName)
                        processFileData(timeList, valueList, pointList, insert_data_list, dbName, ProjId,
                                        userId)
                elif (filenameExtension == 'xlsx' or filenameExtension == 'xls'):
                    importFile = xlrd.open_workbook(fullFilePath)
                    tables = importFile.sheets()
                    for table in tables:
                        row_count = 0
                        data_count = 0
                        pointList = []
                        timeList = []
                        valueList = []
                        insert_data_list = []
                        nrows = table.nrows
                        for i in range(nrows):
                            row_excel = table.row_values(i)
                            if i != 0:
                                row_excel[0] = xlrd.xldate.xldate_as_datetime(table.cell(i, 0).value, 0)
                                if row_excel[0].second == 59 and row_excel[0].second > 0:
                                    row_excel[0] += timedelta(seconds=1)
                                row_excel[0] = row_excel[0].strftime('%Y-%m-%d %H:%M:%S')
                            row_excel = [str(x) for x in row_excel]
                            row_value = (',').join(row_excel)
                            data_count, row_count = traverseFile(ProjId, data_count, row_count, row_value, timeList,
                                                                    valueList, pointList,insert_data_list, dbName)
                        processFileData(timeList, valueList, pointList, insert_data_list, dbName, ProjId, userId)
    except Exception as e:
        print('importUserData failed:' + e.__str__())
        logging.error('importUserData failed:' + e.__str__())
        return json.dumps({'error': e.__str__()}, ensure_ascii=False)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/load_history_config_value/<userName>', methods=['GET'])
def load_history_config_value(userName):
    return BEOPDataAccess.getInstance().LoadHistoryConfig(userName)


@app.route('/save_history_config_value', methods=['POST'])
def save_history_config_value():
    data = request.get_json()
    BEOPDataAccess.getInstance().SaveHistoryConfig(data['userName'], data['configName'], data['startTime'],
                                                   data['endTime'], data['projectList'])
    rv = 'success'
    return json.dumps(rv, ensure_ascii=False)


@app.route('/observer/update/<prjName>', methods=['GET'])
def prepareResource(prjName, clean=True):
    print('prepareResouce')
    # TODO: force remove *.dec
    rv = {}
    bFoundProject = False
    updateInfo = None
    checkSuccess = {}
    nameList = BEOPDataAccess.getInstance().getProjectNameList()
    for name, s3db, updatetime in nameList:
        if name is None:
            continue
        if name != prjName:
            continue
        bFoundProject = True
        updateInfo = BEOPSqliteAccess.getInstance().prepareResouceFromS3db(name, s3db, updatetime, clean)
        checkSuccess = BEOPSqliteAccess.getInstance().checkResoueceFroms3db(s3db)

    if bFoundProject and updateInfo is not None and updateInfo['success']:
        rv['update'] = 'success'
        rv['check'] = checkSuccess
    else:
        rv = 'project(%s) not found, please input project name correctly.' % name
    return json.dumps(rv, ensure_ascii=False)


@app.route('/observer/update/<s3dbName>', methods=['GET'])
def prepareResourceByS3dbName(s3dbName, clean=True):
    print('prepareResouce')
    # TODO: force remove *.dec
    rv = {}
    bFoundProject = False
    updateInfo = None
    checkSuccess = {}
    nameList = BEOPDataAccess.getInstance().getProjectNameList()
    for name, s3db, updatetime in nameList:
        if s3db is None:
            continue
        if s3db.lower() != s3dbName.lower():
            continue
        bFoundProject = True
        updateInfo = BEOPSqliteAccess.getInstance().prepareResouceFromS3db(name, s3db, updatetime, clean)
        checkSuccess = BEOPSqliteAccess.getInstance().checkResoueceFroms3db(s3db)

    if bFoundProject and updateInfo is not None and updateInfo['success']:
        rv['update'] = 'success'
        rv['check'] = checkSuccess
    else:
        rv['error'] = 'project(%s) not found, please input project name correctly.' % s3dbName
    return json.dumps(rv, ensure_ascii=False)


@app.route('/observer/update_project_by_user', methods=['POST'])
def update_project_by_user():
    print('prepareResouce')
    request_json = request.get_json()
    user_id = request_json.get('user_id')
    checkSuccess = {}
    if user_id is None:
        return 'error:user id is empty'
    clean = request_json.get('clean') if request_json.get('clean') is not None else True
    name_list = BEOPDataAccess.getInstance().getAdminProjectNameListByUser(user_id)
    result = []
    for project_code, s3db, update_time, project_name in name_list:
        if project_code is None:
            continue
        updateInfo = BEOPSqliteAccess.getInstance().prepareResouceFromS3db(project_code, s3db, update_time, clean)
        checkSuccess = BEOPSqliteAccess.getInstance().checkResoueceFroms3db(s3db)
        if updateInfo is not None and updateInfo['success']:
            result.append(dict({project_name: True}, **checkSuccess))
        else:
            result.append(dict({project_name: False}, **checkSuccess))
    return json.dumps(result, ensure_ascii=False)


@app.route('/observer/setuprealtimedb', methods=['GET'])
def setuprealtimedb():
    rv = ''
    pList = BEOPDataAccess.getInstance().getProjectTableNameList()
    for proj in pList:
        if proj is None or len(proj) == 0:
            continue
        if not BEOPDataAccess.getInstance().checkTableExist('beopdoengine', 'rtdata_%s' % proj):
            BEOPDataAccess.getInstance().createMysqlTable('rtdata_%s' % proj)
            rv += 'rtdata_%s table established.\n' % proj
    if len(rv) == 0:
        rv = 'no project realtime table established.'
    return json.dumps(rv, ensure_ascii=False)


@app.route('/clearrtdata', methods=['POST'])
def clearrtdata():
    rv = ''
    data = request.get_json()
    projName = data['projName']
    rv = BEOPDataAccess.getInstance().clearRealtimeInputData(projName)
    return json.dumps(rv, ensure_ascii=False)

@app.route('/updateCityIdByLatLon/<projId>', methods=['GET'])
def updateCityIdByLatLon(projId):
    rv = {'error': True, 'msg': ''}
    try:
        dbaccess = BEOPDataAccess.getInstance()
        latLon = dbaccess.getLatlngOfPriject(projId)
        if latLon is None:
            raise Exception('latLon is None')
        else:
            latLonlist = (latLon).split(',')
            lonLat = latLonlist[1] + ',' + latLonlist[0]
            url_get_city = 'https://api.heweather.com/v5/search?city=%s&key=72c3d7b460624692959fc0e250ad33f8' % (
            lonLat,)
            req = requests.get(url_get_city)
            if req.status_code == 200:
                result = json.loads(req.text)
                cityDict = result.get('HeWeather5')[0]
                status = cityDict.get('status')
                if status == 'ok':
                    basic = cityDict.get('basic')
                    if basic and 'id' in basic:
                        dbaccess.updateWeatherStation(projId, basic.get('id'))
                else:
                    print(status)
                    rv = {'error': False, 'msg': status}
            else:
                raise Exception('The weather service is not available')

    except Exception as e:
        print('dashboard_get_weather error:' + e.__str__())
        logging.error(e.__str__())
    return json.dumps(rv, ensure_ascii=False)

@app.route('/dashboard/get_weather/<projId>', methods=['GET'])
def dashboard_get_weather(projId):
    rv = {}
    try:
        latlng = BEOPDataAccess.getInstance().getLatlngOfPriject(projId)
        url_get_cityname = 'https://api.map.baidu.com/geocoder/v2/?ak=VNzhKjCMIdfr8FrHP4ys2jha&coordtype=gcj02ll&location=%s&output=json&pois=0' % latlng
        res = requests.get(url_get_cityname)
        html = res.text
        map = json.loads(html)
        if map.get('status') == 0:
            city = map.get('result').get('addressComponent').get('city')
        else:
            city = '上海'
        if '市' in city:
            cityname = city[:-1]
        elif '特别行政区' in city:
            cityname = city[:-5]
        else:
            cityname = city
        if cityname:
            rv = get_weather(cityname).get('now')
    except Exception as e:
        print('dashboard_get_weather error:' + e.__str__())
        logging.error(e.__str__())
    return json.dumps(rv, ensure_ascii=False)


@app.route('/dashboard/get_future_weather/<projId>/<days>', methods=['GET'])
def dashboard_get_future_weather(projId, days):
    rv = {}
    days = int(days)
    date = str((datetime.now() + timedelta(days=days)).date())
    try:
        latlng = BEOPDataAccess.getInstance().getLatlngOfPriject(projId)
        url_get_cityname = 'https://api.map.baidu.com/geocoder/v2/?ak=VNzhKjCMIdfr8FrHP4ys2jha&coordtype=gcj02ll&location=%s&output=json&pois=0' % latlng
        res = requests.get(url_get_cityname)
        html = res.text
        map = json.loads(html)
        if map.get('status') == 0:
            city = map.get('result').get('addressComponent').get('city')
        else:
            city = '上海'
        if '市' in city:
            cityname = city[:-1]
        elif '特别行政区' in city:
            cityname = city[:-5]
        else:
            cityname = city
        rt = get_weather(cityname)
        for info in rt.get('daily_forecast'):
            if info.get('date') == date:
                rv.update(dict(date=info))
                break
        # 如果是香港项目，projId=457，则从weather.com获取tmp
        if int(projId) == 457 and days == 1:
            next_day = (datetime.now() + timedelta(days=days)).date()
            year, month, day = next_day.year, next_day.month, next_day.day
            api_url = 'http://api.wunderground.com/api/51f62c4b5da17527/hourly/lang:CN/q/HK/HongKong.json'
            r = requests.get(api_url)
            data = json.loads(r.text)
            forecast = data.get('hourly_forecast', [])
            if forecast:
                tmpList = []
                for f in forecast:
                    FCTTIME = f.get('FCTTIME', {})
                    n_day = int(FCTTIME.get('mday'))
                    n_year = int(FCTTIME.get('year'))
                    n_month = int(FCTTIME.get('mon'))
                    if day == n_day and n_year == year and n_month == month:
                        tmpList.append(float(f.get('temp', {}).get('metric')))
                avg = "{:.1f}".format(sum(tmpList) // len(tmpList))
                if rv.get('date'):
                    rv['date'].update(dict(tmp=avg))
    except Exception as e:
        print('dashboard_get_future_weather error:' + e.__str__())
        logging.error(e.__str__())
    return json.dumps(rv, ensure_ascii=False)


@app.route('/dashboard/get_weather_by_cityname/<cityname>', methods=['GET'])
def dashboard_get_weather_by_cityname(cityname):
    rt = {}
    try:
        rt = get_weather(cityname).get('now')
    except Exception as e:
        print('dashboard_get_weather_by_cityname error:' + e.__str__())
        logging.error('dashboard_get_weather_by_cityname error:' + e.__str__())
    return jsonify(rt)

@app.route('/dashboard/get_weather_service_by_cityname/<cityname>', methods=['GET'])
def dashboard_get_weather_service_by_cityname(cityname):
    rt = {}
    try:
        rt = get_weather(cityname)
    except Exception as e:
        print('dashboard_get_weather_service_by_cityname error:' + e.__str__())
        logging.error(e.__str__())
    return jsonify(rt)

def get_weather(cityname, i=0):
    rt = {}
    apiKey_list = ['f407c9e0c18eeedb380fe3f090b8da24', 'f9c373eebf65ee1ea7a6608ec9bcbe43']
    apiKey = apiKey_list[int(random.randint(0,99)) % 2]
    url = 'https://way.jd.com/he/freeweather?city=%s&appkey=%s' % (cityname, apiKey)
    rv = get_weather_info_by_cityname(cityname)
    if rv is None or len(rv) == 0:
        res = requests.get(url)
        if res.status_code == 200:
            html = json.loads(res.text)
            if html.get('code') == '10000':
                res = html.get('result')
                if res.get('HeWeather5')[0].get('status') == 'ok':
                    rt.update(res.get('HeWeather5')[0])
                update_weather_info_by_cityname(cityname, rt)
            else:
                if html.get('code') in ['10040', '10001'] and i <= 5:
                    rt = get_weather(cityname, i=i+1)
                else:
                    raise Exception(html.get('msg'))
        else:
            raise Exception('The weather service is not available')
    else:
        rt = rv
    return rt


@app.route('/analysis/anlySync/<userId>', methods=['POST'])
def anlySync(userId):
    rt = {}
    data = request.get_json()
    userId = int(userId)
    rt = MongoConnManager.getConfigConn().anlySync(userId, data)
    return json.dumps(rt, ensure_ascii=False)


# mango add for analysis
@app.route('/analysis/datasource/saveMulti', methods=['POST'])
def analysisDataSourceSaveMulti():
    rt = {}
    data = request.get_json()
    rt = MongoConnManager.getConfigConn().analysisDataSourceSaveMulti(data)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/analysis/datasource/saveLayout/<userId>', methods=['POST'])
def analysisDataSourceSaveLayout(userId):
    rt = {}
    data = request.get_json()
    userId = int(userId)
    if isinstance(data, dict):
        rt = MongoConnManager.getConfigConn().analysisDataSourceSaveLayout(userId, data)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/analysis/datasource/removeSingle/<datasourceId>', methods=['GET'])
def analysisDataSourceRemoveSingle(datasourceId):
    rt = {}
    datasourceId = str(datasourceId)
    rt = MongoConnManager.getConfigConn().analysisDataSourceRemoveSingle(datasourceId)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/analysis/datasource/get/<userId>', methods=['GET'])
def analysisDataSourceGet(userId):
    userId = int(userId)
    rt = MongoConnManager.getConfigConn().analysisDataSourceGet(userId)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/analysis/template/get/<userId>', methods=['POST'])
def analysisTemplateGet(userId):
    rt = {'status': 'OK', 'msg': 'success'}
    userId = int(userId)
    data = request.get_json()
    projIdList = data.get('projectIds')
    if projIdList != None:
        projIdList = [int(x) for x in projIdList]
        rt = MongoConnManager.getConfigConn().analysisTemplateGet(userId, projIdList)
        preTemplateList = rt.get('preTemplate')
        for itemPre in preTemplateList:
            itemPre.update({'creatorName': BEOPDataAccess.getInstance().getUserNameById(itemPre.get('creatorId'))})
        userTemplateList = rt.get('userTemplate')
        for itemUser in userTemplateList:
            itemUser.update({'creatorName': BEOPDataAccess.getInstance().getUserNameById(itemUser.get('creatorId'))})
    return json.dumps(rt, ensure_ascii=False)


@app.route('/analysis/workspace/saveOrder/<userId>', methods=['POST'])
def analysisWorkspaceSaveOrder(userId):
    rv = False
    userId = int(userId)
    data = request.get_json()
    idList = data.get('idList')
    if idList != None:
        if len(idList) > 0:
            rv = MongoConnManager.getConfigConn().analysisWorkspaceSaveOrder(userId, idList)
    return json.dumps(rv, ensure_ascii=False)


@app.route('/analysis/modal/saveOrder/<userId>/<isTemplate>', methods=['POST'])
def analysisModalSaveOrder(userId, isTemplate=0):
    userId = int(userId)
    data = request.get_json()
    rt = {'success': False}
    isTemplate = int(isTemplate)
    if isinstance(data, dict):
        keys = data.keys()
        if isTemplate == 0:
            if 'workspaceId' in keys and 'idList' in keys:
                workspaceId = data['workspaceId']
                idList = data['idList']
                rt = MongoConnManager.getConfigConn().analysisModalSaveOrder(userId, workspaceId, idList,
                                                                             isTemplate)
        else:
            if 'templateId' in keys and 'idList' in keys:
                templateId = data['templateId']
                idList = data['idList']
                rt = MongoConnManager.getConfigConn().analysisModalSaveOrder(userId, templateId, idList,
                                                                             isTemplate)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/analysis/getDsList/<userId>', methods=['POST'])
def analysisGetDsList(userId, isTemplate=0):
    userId = int(userId)
    data = request.get_json()
    idList = data.get('idList')
    dsList = MongoConnManager.getConfigConn().analysisGetDataSourceByIdList(userId, idList)

    return json.dumps({'dsInfoList': dsList}, ensure_ascii=False)


@app.route('/analysis/modalMove/<userId>', methods=['POST'])
def analysisModalMove(userId):
    rt = True
    userId = int(userId)
    data = request.get_json()
    if data != None:
        srcWsId = data.get('srcWsId')
        destWsId = data.get('destWsId')
        moveModalIdList = data.get('moveModalIdList')
        if srcWsId == None or destWsId == None or moveModalIdList == None:
            rt = {'status': 'ERROR', 'msg': '参数错误'}
        else:
            rt = MongoConnManager.getConfigConn().analysisModalMove(userId, srcWsId, destWsId, moveModalIdList)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/analysis/getWorkspaces/<userId>/<wsId>')
def analysisGetWorkspaces(userId, wsId):
    userId = int(userId)

    # import pdb; pdb.set_trace();
    if wsId == '0':
        wsId = None

    rtDataSource = []
    rtModal, rtdsLsit = MongoConnManager.getConfigConn().analysisGetWorkspaces(userId, wsId)
    rt = MongoConnManager.getConfigConn().getDataSourceGroupInfoRoot(userId)
    return json.dumps({'workspaces': rtModal, 'group': rt, 'dsInfoList': rtdsLsit}, ensure_ascii=False)


@app.route('/analysis/getModals', methods=['POST'])
def analysisGetModals():
    data = request.get_json()
    wsIdList = data.get('idList', [])
    rs = MongoConnManager.getConfigConn().analysisGetMultiModals(wsIdList)

    return json.dumps(rs);


@app.route('/proj_name/check', methods=['POST'])
def projNameCheck():
    rv = {'status': 'ERROR', 'msg': '参数不可为空！'}
    data = request.get_json()
    projName = data.get('proName')
    if projName != '':
        rv = BEOPDataAccess.getInstance().checkProName(projName)
    return json.dumps(rv, ensure_ascii=False)


# yanguanwei modified 2015-12-29
@app.route('/datasource/get/<userId>', methods=['GET'])
@app.route('/datasource/get/<userId>/<groupId>', methods=['GET'])
def getDataSource(userId, groupId=None):
    rt = []
    if groupId == None:
        userId = int(userId)
        dsNullGroup = []
        groupList = MongoConnManager.getConfigConn().getDataSourceGroupInfo(userId)
        datasourceList = MongoConnManager.getConfigConn().analysisDataSourceGet(userId)
        for group in groupList:
            ds = []
            groupId = group.get('groupId')
            groupName = group.get('groupName')
            parantId = group.get('parentId')
            isdefault = group.get('isDefault', False)
            if ObjectId.is_valid(groupId):
                for id in group.get('itemList', []):
                    temp = MongoConnManager.getConfigConn().getDataSourceItemInResult(id, datasourceList)
                    if temp:
                        ds.append(temp)
            rt.append({'isDefault': isdefault, 'groupId': groupId, 'groupName': groupName, 'parentId': parantId,
                       'datasourceList': ds})
    else:
        pass
    return json.dumps({'group': rt}, ensure_ascii=False)


@app.route('/datasource/getGroupInfo/<userId>', methods=['GET'])
def getGroupInfo(userId):
    userId = int(userId)
    rt = []
    groupList = MongoConnManager.getConfigConn().getDataSourceGroupInfo(userId)
    for item in groupList:
        groupId = item.get('groupId')
        groupName = item.get('groupName')
        parantId = item.get('parentId')
        isDefault = item.get('isDefault', False)
        rt.append({'isDefault': isDefault, 'groupId': groupId, 'groupName': groupName, 'parentId': parantId})
    return json.dumps(rt, ensure_ascii=False)


# 2015-5-8 mango added
@app.route('/datasource/saveDataSourceGroup', methods=['POST'])
def saveDataSourceGroup():
    result = {'error': 'successful'}

    data = request.get_json()
    groupId = data.get('groupId')
    groupName = data.get('name')
    parentId = data.get('parent')
    userId = data.get('userId')

    if not isinstance(parentId, str):
        result = {'error': 'parent id is not string'}
        return result
    result = MongoConnManager.getConfigConn().saveDataSourceGroup(userId, groupName, groupId, parentId)
    return json.dumps(result, ensure_ascii=False)


@app.route('/datasource/deleteDataSourceGroup/<userId>/<groupId>', methods=['GET'])
def deleteDataSourceGroup(userId, groupId):
    result = {'error': 'successful'}
    userId = int(userId)
    groupId = str(groupId)

    result = MongoConnManager.getConfigConn().deleteDataSourceGroup(userId, groupId)
    datasourceList = MongoConnManager.getConfigConn().analysisDataSourceGet(userId)
    if ObjectId.is_valid(groupId):
        for datasource in datasourceList:
            parentId = datasource.get('groupId')
            if ObjectId.is_valid(parentId):
                if parentId == groupId:
                    rt = MongoConnManager.getConfigConn().analysisDataSourceRemoveSingle(datasource.get('id'))
                    if not rt.get('success'):
                        result = {'error': 'failed'}
    else:
        if len(groupId) == 0:
            for datasource in datasourceList:
                parentId = datasource.get('groupId')
                if not ObjectId.is_valid(parentId):
                    rt = MongoConnManager.getConfigConn().analysisDataSourceRemoveSingle(datasource.get('id'))
                    if not rt.get('success'):
                        result = {'error': 'failed'}
    return json.dumps(result, ensure_ascii=False)


@app.route('/datasource/saveDataSourceGroupLayout/<userId>', methods=['POST'])
def saveDataSourceGroupLayout(userId):
    userId = int(userId)

    result = {'error': 'successful'}
    data = request.get_json()
    newGroupIdList = data.get('groupIdList')
    result = MongoConnManager.getConfigConn().saveDataSourceGroupLayout(userId, newGroupIdList)
    return json.dumps(result, ensure_ascii=False)


@app.route('/get_history_data/getMinPeriod/<projId>', methods=['GET'])
def getMinPeriod(projId):
    projId = int(projId)

    result = {'minPeriod': ''}
    dbName = BEOPDataAccess.getInstance().getProjMysqldb(projId)
    if dbName != None:
        if len(dbName) > 0:
            res_list = set()
            connList = MongoConnManager.getHisConn(projId)
            for conn in connList:
                res_list.add(conn.getMinPeriod(dbName))
            if 'm1' in res_list:
                result['minPeriod'] = 'm1'
            elif 'm5' in res_list:
                result['minPeriod'] = 'm5'
            elif 'h1' in res_list:
                result['minPeriod'] = 'h1'
            elif 'd1' in res_list:
                result['minPeriod'] = 'd1'
            elif 'month' in res_list:
                result['minPeriod'] = 'M1'
    return json.dumps(result)


@app.route('/analysis/save/modalOrder/<userId>', methods=['POST'])
def saveModalOrder(userId):
    userId = int(userId)
    data = request.get_json()
    workspaceId = data.get('workspaceId')
    orderList = data.get('modalOrderList')
    rt = MongoConnManager.getConfigConn().saveWorkspaceModalOrderList(workspaceId, orderList)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/analysis/getShareLog/<userId>', methods=['GET'])
def shareLogGet(userId):
    userId = int(userId)
    rt = MongoConnManager.getConfigConn().shareLogGet(userId)
    return json.dumps({'shareLogList': rt}, ensure_ascii=False)


@app.route('/analysis/saveShareLog/<userId>', methods=['POST'])
def shareLogSave(userId):
    rt = {}
    data = request.get_json()
    menuItemId = data.get('menuId')
    # url = data.get('shareURL')
    userId = int(userId)
    if isinstance(menuItemId, str):
        rt = MongoConnManager.getConfigConn().shareLogSave(userId, menuItemId, data)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/analysis/editShareLog/<editMode>', methods=['POST'])
def shareLogEdit(editMode):
    result = {'error': 'successful'}
    editMode = int(editMode)
    data = request.get_json()
    # shareId = data.get('shareId')
    # menuItemId = data.get('menuItemId')
    result = MongoConnManager.getConfigConn().shareLogEdit(data, editMode)
    return json.dumps(result, ensure_ascii=False)


@app.route('/analysis/checkDatasourceBeforeDelete/<datasourceId>/<userId>')
def checkDatasourceBeforeDelete(datasourceId, userId):
    if ObjectId.is_valid(datasourceId):
        userId = int(userId)
        return json.dumps(MongoConnManager.getConfigConn().checkDatasourceBeforeDelete(datasourceId, userId),
                          ensure_ascii=False)
    return json.dumps('datasourceId is invalid', ensure_ascii=False)


@app.route('/uploadNotify', methods=['POST'])
def uploadNotify():
    rt = False
    data = request.get_json()
    fileList = data.get('files')
    cwdpath = os.getcwd()
    successCount = 0
    for file in fileList:
        sourceFile = cwdpath + '/uploadS3db/' + file
        destFile = cwdpath + '/s3db/' + file
        copySuccess = False
        try:
            shutil.copyfile(sourceFile, destFile)
            copySuccess = True
        except Exception as e:
            logging.error('copy %s from uploads3db dir to s3db dir failed' % (file,))
        if copySuccess:
            removeSuccess = False
            try:
                os.remove(sourceFile)
                removeSuccess = True
            except Exception as e:
                logging.error('remove %s failed' % (sourceFile,))
            if removeSuccess:
                successCount += 1
    if successCount > 0 and successCount == len(fileList):
        updateCount = 0
        for name in fileList:
            res = prepareResourceByS3dbName(name[0:name.rfind('.')])
            res = json.loads(res)
            if res.get('update') == 'success':
                updateCount += 1
        if updateCount == successCount:
            rt = True
    return json.dumps(rt, ensure_ascii=False)


@app.route('/sendEmail', methods=['POST'])
def sendEmail():
    rt = False
    data = request.form
    recipients = data.get('recipients')
    subject = data.get('subject')
    body = data.get('body')
    userId = data.get('userId')
    userInfo = BEOPDataAccess.getInstance().getUserProfileById(userId)
    if userInfo['email'] is None:
        userInfo['email'] = ''
    else:
        userInfo['email'] = '(%s)' % userInfo['email']
    body = body % (userInfo['fullname'], userInfo['email'])

    rt = Utils.EmailTool.send_email(subject, recipients, body);
    if rt == True:
        rt = {'status': 'OK', 'msg': 'send email success!'}
    else:
        rt = {'status': 'ERROR', 'msg': 'send email faild!'}
    return json.dumps(rt, ensure_ascii=False)


# 2015-07-08 benchmark
@app.route('/benchmark/saveMenu', methods=['POST'])
def benchmarkSaveMenu():
    data = request.get_json()
    rt = MongoConnManager.getConfigConn().benchmarkSaveMenu(data)
    return jsonify(rt)


@app.route('/benchmark/getBaseMenu/<groupId>', methods=['GET'])
def benchmarkGetBaseMenu(groupId):
    rt = {}
    if ObjectId.is_valid(groupId):
        rt = MongoConnManager.getConfigConn().benchmarkGetBaseMenu(groupId)
    return jsonify(rt)


@app.route('/benchmark/saveBaseMenu', methods=['POST'])
def benchmarkSaveBaseMenu():
    data = request.get_json()
    rt = MongoConnManager.getConfigConn().benchmarkSaveBaseMenu(data)
    return jsonify(rt)


@app.route('/benchmark/getAll', methods=['POST'])
def benchmarkGetAll():
    projectIds = request.get_json()
    dictPointData = {}
    rv = []
    arrBenchmarks, arrPoints = MongoConnManager.getConfigConn().benchmarkGetAll()

    for projectId in projectIds:
        data = BEOPDataBufferManager.getInstance().getDataByProjBenchmark(projectId, arrPoints)
        for key in data:
            if (dictPointData.get(key) is None): dictPointData[key] = []
            if isinstance(data, dict):
                if data.get(key) is None:
                    data[key] = -1
                try:
                    dictPointData[key].append({'projectId': projectId, 'name': key, 'value': float(data[key])})
                except Exception as e:
                    dictPointData[key].append({'projectId': projectId, 'name': key, 'value': 0})

    for benchmark in arrBenchmarks:
        list = []
        points = benchmark.get('points')
        id = benchmark.get('_id').__str__() if isinstance(benchmark.get('_id'), ObjectId) else ''
        benchmark.update({'id': id})
        benchmark.pop('_id')
        for point in points:
            list.extend(dictPointData[point])

        list = sorted(list, key=lambda x: x['value'], reverse=benchmark.get('desc'));

        # move the project without data to the end
        if (benchmark.get('desc') is not 1):
            for item in list:
                if (list[0]['value'] == -1):
                    data = list.pop(0)
                    list.append(data)
                else:
                    break

        benchmark['list'] = list
        rv.append(benchmark)
    return json.dumps(rv, ensure_ascii=False)


@app.route('/benchmark/getListByPointsAndProjectIds', methods=['POST'])
def getListByPointsAndProjectIds():
    dictPointData = {}
    data = request.get_json()
    projectIds = data.get('projectIds')
    arrPoints = data.get('points')
    desc = data.get('desc')

    for projectId in projectIds:
        data = BEOPDataBufferManager.getInstance().getDataByProj(projectId, arrPoints)
        for key in data:
            if (dictPointData.get(key) is None): dictPointData[key] = []
            if isinstance(data, dict):
                if data.get(key) is None:
                    data[key] = -1
                dictPointData[key].append({'projectId': projectId, 'name': key, 'value': float(data[key])})

    list = []
    for point in arrPoints:
        list.extend(dictPointData[point])

    rv = sorted(list, key=lambda x: x['value'], reverse=desc)

    return jsonify({'list': rv})


@app.route('/get_registered_user_info')
def get_registered_user_info():
    return json.dumps(BEOPDataAccess.getInstance().get_registered_user_info(), ensure_ascii=False)


@app.route('/realtime_visitor', methods=['GET'])
def realtime_visitor():
    mysqldb = BEOPDataAccess.getInstance()
    mongodb = MongoConnManager.getConfigConn()
    s3db = BEOPSqliteAccess.getInstance()
    userid_name = mysqldb.id_name_mapping('user')
    projectid_name = mysqldb.id_name_mapping('project')
    rv = mongodb.get_realtime_records()

    for record in rv:
        record['time'] = record['time'].strftime('%Y-%m-%d %H:%M')
        record['userId'] = userid_name.get(record['userId'], record['userId'])
        if 'projId' in record['remarks']:
            if 'pageid' in record['remarks']:
                projs3dbname = mysqldb.getProjS3db(record['remarks']['projId'])
                pagename = s3db.get_pagename_by_pageid(projs3dbname, record['remarks']['pageid'])
                record['remarks']['pageid'] = pagename.decode('gb2312') if pagename else ''
            record['remarks']['projId'] = projectid_name.get(record['remarks']['projId'], '')

    # return json.dumps(rv, ensure_ascii=False)
    return render_template('temp/realtime_visitor.html', rv=rv)


# mongo write for art
@app.route('/benchmark/update/', methods=['POST'])
def benchmarkUpdate():
    projectIds = request.get_json()
    dictPointData = {}
    rv = []
    arrBenchmarks, arrPoints = MongoConnManager.getConfigConn().benchmarkGetAll()
    for projectId in projectIds:
        data = BEOPDataBufferManager.getInstance().getDataByProjBenchmark(projectId, arrPoints, True)
        if len(data) > 0:
            rv.append(data)
    return json.dumps(len(rv) == 0, ensure_ascii=False)


@app.route('/analysis/getThumbnails', methods=['POST'])
def getThumbnails():
    rv = {}
    # import pdb; pdb.set_trace()
    data = request.get_json()
    modalIdList = data.get('modalIdList')
    rv = MongoConnManager.getConfigConn().getThumbnails(modalIdList)
    return json.dumps(rv, ensure_ascii=False)


# david compare s3dbname 2015-7-30
@app.route('/compares3dbname', methods=['GET'])
def compares3dbname():
    rv = {}
    fileList = os.listdir(r'E:\beop\BEOPWeb\BeopWeb\uploadS3db')
    fileList.pop(0)
    for file in fileList:
        sqls3dbname = BEOPDataAccess.getInstance().get_proj_name(file[0:-4])
        if sqls3dbname != []:
            if file[0:-4] != sqls3dbname[0][0]:
                rv[file] = sqls3dbname[0][0]
        else:
            rv[file] = 'None'
    return json.dumps(rv, ensure_ascii=False)


# vicky wiki
@app.route('/getWikiById/<wikiId>', methods=['GET'])
def getWikiById(wikiId):
    rv = MongoConnManager.getConfigConn().getWikiById(wikiId)
    return json.dumps(rv, ensure_ascii=False)


@app.route('/createWiki', methods=['POST'])
def createWiki():
    wiki = request.get_json()
    rv = MongoConnManager.getConfigConn().insertIntoWiki(wiki)
    return json.dumps({'wikiId': rv.__str__()}, ensure_ascii=False)


@app.route('/updateWiki', methods=['POST'])
def updateWiki():
    wiki = request.get_json()
    rv = MongoConnManager.getConfigConn().updateWiki(wiki)
    return json.dumps({'wikiId': rv.__str__()}, ensure_ascii=False)


@app.route('/deleteWiki/<wikiId>', methods=['GET'])
def deleteWiki(wikiId):
    rv = MongoConnManager.getConfigConn().deleteWiki(wikiId)
    return json.dumps({'wikiId': rv.__str__()}, ensure_ascii=False)


@app.route('/getWikiByKeywordsAndProjectId', methods=['POST'])
def getWikiByKeywordsAndProjectId():
    data = request.get_json()
    rv = MongoConnManager.getConfigConn().getWikiByKeywordsAndProjectId(data.get('keywords'),
                                                                        data.get('projectId'))
    return json.dumps(rv, ensure_ascii=False)


@app.route('/getAllWiki', methods=['POST'])
def getAllWiki():
    data = request.get_json()
    rv = MongoConnManager.getConfigConn().getAllWiki(data.get('projectIds'))
    return json.dumps(rv, ensure_ascii=False)


@app.route('/getVersion')
def getVersion():
    ret = 'version:'
    Ver = app.config.get('VERSION', 'dev')
    ret += Ver

    return json.dumps(ret, ensure_ascii=False)


@app.route('/updateProjectInfo')
def updateProjectInfo():
    return json.dumps(MongoConnManager.UpdateProjectInfo(), ensure_ascii=False)


@app.route('/get_realtimedata_delay', methods=['POST'])
def get_realtimedata_delay():
    rdata = request.get_json()
    projId = rdata.get('projId')

    delayInfo = BEOPDataAccess.getInstance().getRealtimeDataDelay(projId)

    return json.dumps(delayInfo, ensure_ascii=False)


@app.route('/memcache/getMemValue/<key>')
def getMemValue(key):
    try:
        rv = RedisManager.get(key)
    except Exception as e:
        print('getMemValue error:' + e.__str__())
        logging.error('getMemValue error:' + e.__str__())
    return json.dumps(rv, ensure_ascii=False)


@app.route('/memcache/show')
def getAllMemValue():
    try:
        rv = {}
        rt = RedisManager.get_project_info_list()
        rv.update({'projectInfoList': rt})
        rt = RedisManager.get_project_locate_map()
        rv.update({'projectLocateMap': rt})
    except Exception as e:
        print('getAllMemValue error:' + e.__str__())
        logging.error('getAllMemValue error:' + e.__str__())
    return json.dumps(rv, ensure_ascii=False)


@app.route('/analysis/datasource/getDsItemInfo/<userId>/<groupId>')
def getDsItemInfo(userId, groupId):
    userId = int(userId)
    rt = ''
    if groupId.lower() != 'null':
        rt = MongoConnManager.getConfigConn().getDataSourceGroupInfoByUserIdAndGroupId(userId, groupId)
    else:
        rt = MongoConnManager.getConfigConn().getDataSourceGroupInfoRoot(userId)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/analysis/datasource/searchDsItemInfo/<userId>/<searchName>')
def searchDsItemInfo(userId, searchName):
    userId = int(userId)
    rt = []
    if len(searchName) > 0:
        rt = MongoConnManager.getConfigConn().searchDsItemInfo(userId, searchName)
    return json.dumps(rt, ensure_ascii=False)


@app.route('/analysis/datasource/getDsItemsById', methods=['POST'])
def getDsItemsById():
    rt = {}
    dsList = request.get_json()
    if isinstance(dsList, list):
        rt = MongoConnManager.getConfigConn().getDsItemsById2(dsList)
    # 对数据中含有ObjectId字段进行转换,否则无法序列化成json格式
    from beopWeb.mod_common.Utils import Encoder
    return json.dumps(rt, ensure_ascii=False, cls=Encoder)


@app.route('/user/bindingphone', methods=['POST'])
def binding_phone_number():
    rt = False
    try:
        data = request.get_json()
        userId = data.get('userId')
        phoneNum = data.get('phone')
        verify_code = data.get('code')
        key = str(userId) + '@' + str(phoneNum)
        rt = SendMessage.verify_message(key, verify_code)
    except Exception as e:
        print('binding_phone_number error:' + e.__str__())
        logging.error('binding_phone_number error:' + e.__str__())
    return jsonify(data=rt)


@app.route('/user/sendverifymessage', methods=['POST'])
def send_verify_message():
    rt = 2  # failed
    try:
        data = request.get_json()
        userId = data.get('userId')
        phoneNum = data.get('phone')
        check = SendMessage.check_phonenum_is_used(phoneNum)
        if check:
            key = str(userId) + '@' + str(phoneNum)
            if SendMessage.set_verify_message(key):
                rt = 0  # success
        else:
            rt = 1  # phone exist
    except Exception as e:
        print('send_verify_message error:' + e.__str__())
        logging.error('send_verify_message error:' + e.__str__())
    return jsonify(data=rt)


@app.route('/user/checknewphone', methods=['POST'])
def check_user_by_phone():
    rt = False
    try:
        data = request.get_json()
        phonenum = data.get('phone')
        if isinstance(phonenum, str) and len(phonenum) == 11:
            rt = SendMessage.check_phonenum_is_used(phonenum)
            if rt:
                key = 'new@' + str(phonenum)
                SendMessage.set_verify_message(key)
    except Exception as e:
        print('add_user_by_phone error:' + e.__str__())
        logging.error('add_user_by_phone error:' + e.__str__())
    return jsonify(data=rt)


@app.route('/user/adduserbyphone', methods=['POST'])
def add_user_by_phone():
    rt = False
    userId = -1
    try:
        data = request.get_json()
        phonenum = data.get('phone')
        password = data.get('password')
        verify_code = data.get('code')
        sex = data.get('sex') if data.get('sex') is not None else 0
        key = 'new@' + str(phonenum)
        rt, userId = SendMessage.add_user_by_phone(key, verify_code, password, sex)
    except Exception as e:
        print('add_user_by_phone error:' + e.__str__())
        logging.error('add_user_by_phone error:' + e.__str__())
    return jsonify(data=rt, userId=userId)


@app.route('/user/forgetpasswordbyphone', methods=['POST'])
def forget_pwd_by_phone():
    '''
    David 20160727
    :return:
    '''
    rt = {'status': 0, 'message': None}
    post_data = request.get_json()
    try:
        if post_data:
            phonenum = post_data.get('phone')
            password = post_data.get('password')
            verify_code = post_data.get('code')
            userId = post_data.get('userId')
            key = str(userId) + '@' + str(phonenum)
            if SendMessage.verify_message(key, verify_code):
                if BEOPDataAccess.getInstance().forget_password_reset_password(userId, password):
                    rt.update({'status': 1})
                else:
                    rt.update({'message': 'Reset password failed'})
            else:
                rt.update({'message': 'Verification code error'})
    except Exception as e:
        print('forget_pwd_by_phone error:' + e.__str__())
        logging.error(e.__str__())
        rt.update({'message': e.__str__()})
    return jsonify(rt)


@app.route('/user/sendverifymessage/forgetpwd', methods=['POST'])
def send_verify_message_for_forgetpwd():
    '''
    David 20160801
    :return:
    '''
    post_data = request.get_json()
    rt = {'status': 0, 'message': None, 'userId': None}
    try:
        if post_data:
            phonenum = post_data.get('phone')
            if isinstance(phonenum, str) and len(phonenum) == 11:
                rv = BEOPDataAccess.getInstance().get_user_by_phonenum(phonenum)
                if rv:
                    key = str(rv[0]) + '@' + str(phonenum)
                    res = SendMessage.set_verify_message(key)
                    if res:
                        rt.update({'status': 1, 'message': None, 'userId': rv[0]})
                    else:
                        rt.update({'status': 0, 'message': 'Failed to send verification message'})
                else:
                    rt.update({'status': 0, 'message': 'The number is not registered'})

            else:
                rt.update({'status': 0, 'message': 'Cell phone number wrong'})
    except Exception as e:
        print('send_verify_message_for_forgetpwd error:' + e.__str__())
        logging.error(e.__str__())
        rt.update({'status': 0, 'message': e.__str__()})
    return jsonify(rt)


@app.route('/user/update_user_phone', methods=['POST'])
def update_user_phone():
    return json.dumps(BEOPDataAccess.getInstance().updateUserPhone(request.get_json()), ensure_ascii=False)

@app.route('/user/unbind_user_phone', methods=['POST'])
def unbind_user_phone():
    rt = {'status': 0, 'message': None}
    try:
        userId = AuthManager.get_userId()
        if userId:
            res = BEOPDataAccess.getInstance().updateUserPhone({'id':int(userId), 'phone':'NULL'})
            if res:
                rt.update({'status':1})
        else:
            rt.update({'status':0, 'message':'Please log in'})
    except Exception as e:
        print('unbind_user_phone error:' + e.__str__())
        logging.error(e.__str__())
        rt.update({'status':0, 'message':e.__str__()})
    return jsonify(rt)

@app.route('/getExpertContainerUrl', methods=['GET'])
def get_expert_container_url():
    return Utils.beop_response_success(app.config.get('EXPERT_CONTAINER_URL'))


@app.route('/getPointListFromS3db/<projId>')
def get_point_list_from_s3db(projId):
    s3dbname = BEOPDataAccess.getInstance().getProjS3db(int(projId))
    rt = BEOPSqliteAccess.getInstance().getPointListFromS3db(s3dbname)
    return jsonify(data=rt)


@app.route('/submit/contactus', methods=['POST'])
def insert_into_contactus():
    rt = False
    data = request.get_json()
    if data:
        recipients = 'angelia.chen@rnbtech.com.hk;irene.shen@rnbtech.com.hk;Kirry.gao@rnbtech.com.hk;kingsley.he@rnbtech.com.hk'
        rt = BEOPDataAccess.getInstance().insert_into_contactus(data)
        config_map = {
            "time": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            "title": 'contact',
            'name': data.get('name'),
            'company': data.get('company'),
            'mail': data.get('mail'),
            'phone': data.get('phone'),
            "detail": data.get('msg'),
            "domain": app.config.get('SITE_DOMAIN'),
            'trans_info': {}
        }
        email_html = render_template('email/contectusEmail.html', configMap=config_map)
        Utils.EmailTool.send_email('contact', recipients, email_html)
    return jsonify(data=rt)


# 错误日志
@app.route('/api/errorlog', methods=['POST'])
def getLogData():
    rt = {}
    try:
        # data = request.form
        data = request.get_json()
        if data:
            timeFrom = data.get('timeFrom')
            if not timeFrom:
                raise Exception('param timeFrom is none')
            timeTo = data.get('timeTo')
            if not timeTo:
                raise Exception('param timeTo is none')
            projId = data.get('projId')
            if not projId:
                raise Exception('param projId is none')

            type = data.get('type')
            if not type:
                type = ''

            page_size = int(data.get('pageSize'))
            current_page = int(data.get('pageNum'))

            offset = (current_page - 1) * page_size
            timeFromObj = datetime.strptime(timeFrom, Utils.datetime_format_full)
            timeToObj = datetime.strptime(timeTo, Utils.datetime_format_full)
            rt = MongoConnManager.getConfigConn().get_logData(int(projId), timeFromObj, timeToObj, offset, page_size,
                                                              type)
    except Exception as e:
        logging.error('%s:' % ('getLogData') + e.__str__(), True)
    if rt:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_success({'total': 0, 'records': []})


# 单个点的错误日志
@app.route('/api/errorlog/onepoint', methods=['POST'])
def getLogData_OnePoint():
    rt = {}
    try:
        # data = request.form
        data = request.get_json()
        if data:
            timeFrom = data.get('timeFrom')
            if not timeFrom:
                timeFrom = None
            timeTo = data.get('timeTo')
            if not timeTo:
                timeTo = None
            projId = data.get('projId')
            if not projId:
                raise Exception('param projId is none')
            pointname = data.get('pointname')
            if not pointname:
                raise Exception('param pointname is none')
            page_size = int(data.get('pageSize'))
            current_page = int(data.get('pageNum'))

            type = data.get('type')
            if not type:
                type = ''

            offset = (current_page - 1) * page_size
            if timeFrom is not None and timeTo is not None:
                timeFromObj = datetime.strptime(timeFrom, Utils.datetime_format_full)
                timeToObj = datetime.strptime(timeTo, Utils.datetime_format_full)
            else:
                timeFromObj = None
                timeToObj = None
            rt = MongoConnManager.getConfigConn().get_logData_onePoint(int(projId), pointname, timeFromObj, timeToObj,
                                                                       offset, page_size, type)
    except Exception as e:
        logging.error('%s:' % ('getLogData_OnePoint') + e.__str__(), True)
    if rt:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_success({'total': 0, 'records': []})


# 各点错误数量
@app.route('/api/errorlog/countoflog', methods=['POST'])
def getLogData_CountOfLog():
    rt = []
    try:
        data = request.get_json()
        if data:
            projId = data.get('projId')
            if not projId:
                raise Exception('param projId is none')

            type = data.get('type')
            if not type:
                type = ''
            rt = MongoConnManager.getConfigConn().get_logcount_eachpoint(projId, type)
    except Exception as e:
        logging.error('getLogData_CountOfLog:' + e.__str__(), True)
        return Utils.beop_response_error(rt)
    return Utils.beop_response_success(rt)


@app.route('/api/errorlog/dellog', methods=['POST'])
def delLogData_Condition():
    try:
        data = request.get_json()
        if data:
            # t_time = data.get('t_time')
            # if not t_time:
            # raise Exception('param t_time is none')
            projId = data.get('projId')
            if not projId:
                raise Exception('param projId is none')
            pointname = data.get('pointname')
            if not pointname:
                pointname = ''
            type = data.get('type')
            if not type:
                type = ''
            # timeObj = datetime.strptime(t_time, Utils.datetime_format_full)
            rt = MongoConnManager.getConfigConn().del_errorlog_condition(projId, pointname, type)
    except Exception as e:
        logging.error('%s:' % ('delLogData_Condition') + e.__str__(), True)
    if rt:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(rt)


@app.route('/oss/uploadtocustom', methods=['POST'])
def upload_pic_to_oss_by_custom():
    path = request.form["path"]
    name_list = request.form.getlist("name_list[]")  # 中括号不是必须的,只是为了标明是数组
    post_file = request.files.getlist("file_list[]")
    try:
        if path[:7] == 'custom/':
            for file in post_file:
                try:
                    file_name = name_list[post_file.index(file)]
                except Exception as e:
                    file_name = file.filename
                if '.' in file_name:
                    if file_name[file_name.index('.'):] in ('.jpg', '.gif', '.jpeg', '.png', '.bmp', '.swf'):
                        Upload.upload_file_to_oss(path, file_name, file)
                        return Utils.beop_response_success()
    except Exception as e:
        print('upload_pic_to_oss_by_custom error:' + e.__str__())
        logging.error(e)
    return Utils.beop_response_error()


@app.route('/sitedata/clear', methods=['POST'])
def clear_sitedata():
    rt = False
    try:
        data = request.get_json()
        if data:
            db_name = data.get('dbname')
            startTime = data.get('startTime')
            endTime = data.get('endTime')
            startTimeObj = datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S')
            endTimeObj = datetime.strptime(endTime, '%Y-%m-%d %H:%M:%S')
            now_time = datetime.now()
            if startTimeObj < now_time and endTimeObj < now_time:
                if db_name and startTime and endTime:
                    delete_site = BEOPDataAccess.getInstance().clear_sitedata(db_name, startTime, endTime)
                    delete_buffer = BEOPDataAccess.getInstance().clear_bufferdata(db_name, startTime, endTime)
                    if delete_site or delete_buffer:
                        rt = True
    except Exception as e:
        print('clear_sitedata error:' + e.__str__())
        logging.error(e)
    if rt:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(rt)


@app.route('/user/updateinfo', methods=['POST'])
def update_user_info_by_Id():
    '''
    David 20160907
    :return:
    '''
    rt = {'status': 0, 'message': None}
    post_data = request.get_json()
    try:
        if post_data:
            userfullName = post_data.get('userfullName')
            usersex = post_data.get('usersex')
            useremail = post_data.get('useremail')
            userId = post_data.get('userId', AuthManager.get_userId())
            res = BEOPDataAccess.getInstance().update_user_by_userId(userId, userfullname=userfullName, usersex=usersex, useremail=useremail)
            if res:
                rt.update({'status': 1})
            else:
                rt.update({'status': 0, 'message': 'Update failed'})
        else:
            rt.update({'status': 0, 'message': 'Invalid parameter'})
    except Exception as e:
        print('update_user_info_by_Id error:' + e.__str__())
        logging.error(e.__str__())
        rt.update({'status': 0, 'message': 'Invalid parameter'})
    return jsonify(rt)


@app.route('/user/del', methods=['POST'])
def del_user():
    '''
    David 20160907
    :return:
    '''
    rt = {'status': 0, 'message': None}
    post_data = request.get_json()
    try:
        if post_data:
            userId = post_data.get('userId')
            ed = datetime.now().date().strftime('%Y-%m-%d')
            res = BEOPDataAccess.getInstance().update_user_by_userId(userId, expiryDate=ed)
            if res:
                rt.update({'status': 1})
            else:
                rt.update({'status': 0, 'message': 'Update failed'})
        else:
            rt.update({'status': 0, 'message': 'Invalid parameter'})
    except Exception as e:
        print('del_user error:' + e.__str__())
        logging.error(e.__str__())
    return jsonify(rt)


@app.route('/externalChainPage/<pageId>', methods=['GET'])
def externalChainPage(pageId):
    rt = None
    try:
        if ObjectId.is_valid(pageId):
            rt = MongoConnManager.getConfigConn().get_params_from_ext_chain(pageId)
    except Exception as e:
        print('externalChainPage error:' + e.__str__())
        logging.error('externalChainPage error:' + e.__str__())

    resp = make_response(render_template('externalChainPage.html', title='BeOP'))
    resp.set_cookie('params', json.dumps(rt, ensure_ascii=False))
    return resp

@app.route('/project/getinfo/<int:projId>')
def get_proj_info_by_projId(projId):
    rt = {'status':0, 'message':None, 'projectinfo':None}
    try:
        res = BEOPDataAccess.getInstance().get_project_info_by_projId(projId)
        if res:
            rt.update({'status':1, 'projectinfo':res})
        else:
            rt.update({'status':0, 'message':'Project inexistence'})
    except Exception as e:
        print('get_proj_info_by_projId error:' + e.__str__())
        logging.error(e.__str__())
        rt.update({'status':0, 'message':e.__str__()})
    return jsonify(rt)

@app.route('/project/unitconfig/save', methods=['POST'])
def project_unit_info():
    rt = False
    try:
        data = request.get_json()
        id = data.get('proId')
        unit_system = data.get('unit_system')
        unit_currency = data.get('unit_currency')
        cursor = BEOPDataAccess.getInstance().updateProjectUnitsystem(id,unit_currency,unit_system)
        rt = True
    except Exception as e:
        print('ProjectSaveUnitConfig error:' + e.__str__())
        logging.error('ProjectSaveUnitConfig error:' + e.__str__())
    return json.dumps(rt)

@app.route('/alarm/add', methods=['POST'])
def alarm_add():
    '''
                projectId:'',
            type: '',        // 报警类型1:布尔量报警; 2:高低限报警
            threshold: {     // 如果报警类型是高低限报警,有这一项
                highhigh: { type: 1:数值类型;2:点类型, value: number|点名 }
                high: { type: 1:数值类型;2:点类型, value: number|点名 }
                low: { type: 1:数值类型;2:点类型, value: number|点名 }
                lowlow: { type: 1:数值类型;2:点类型, value: number|点名 }
            }
            points: []
    '''
    try:
        rt = []
        data = request.get_json()
        user_id = AuthManager.get_userId()
        if not user_id:
            return redirect(url_for('login'))
        user = User.query_user_by_id(user_id, 'userfullname')
        data.update({'user_id':str(user.get('userfullname'))})
        projId = data.get('projectId')
        if not projId:
            raise Exception("no projId")
        type = data.get('type')

        points = data.get('points')
        issuccess = False
        import copy
        if points:
            data.pop('points')
            for point in points:
                data.update({'point':str(point)})
                if not data.get('threshold'):
                    data.update({'threshold':{'high':{'advice':'建议进行高限处理','msg':'报警信息测试:当前值高于高限'}
                                              ,'low':{'advice':'建议进行低限处理','msg':'报警信息测试:当前值低于低限'}
                                              }
                                 })
                data_temp = copy.deepcopy(data)
                issuccess = MongoConnManager.getConfigConn().save_alarm(data_temp)
                rt.append(data_temp)
        else:
            issuccess = MongoConnManager.getConfigConn().save_alarm(data)
            rt.append(data)
    except Exception as e:
        print('alarm_add error:' + e.__str__())
        logging.error('alarm_add error:' + e.__str__())
    if issuccess:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(rt)


@app.route("/alarm/edit", methods=['POST'])
def alarm_edit():
    state = False
    rt = []
    try:
        data = request.get_json()
        user_id = AuthManager.get_userId()
        if not user_id:
            return redirect(url_for('login'))
        user = User.query_user_by_id(user_id, 'userfullname')
        data.update({'user_id': str(user.get('userfullname'))})
        if not data.get('_id'):
            raise Exception("alarm edit error: no point exists.")
        state = MongoConnManager.getConfigConn().save_alarm(data)
        rt.append(data)
    except Exception as e:
        print('alarm_edit error:' + e.__str__())
        logging.error('alarm_edit error:' + e.__str__())
    if state:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(rt)


@app.route("/alarm/enable", methods=['POST'])
def alarm_enable():
    '''
    json_data = {"_id": 报警项的id，"enable": True/False表示启用禁用该报警}
    :return:
    '''
    state = False
    try:
        data = request.get_json()
        if data.get('_id'):
            # 防止_id非ObjectId
            _id = ObjectId(str(data.get('_id')))
            status = data.get('enable')
            # 防止status非布尔值
            if status is True or status is False:
                state = MongoConnManager.getConfigConn().alarm_enable(_id, status)
    except Exception as e:
        logging.error('alarm_enable error:' + e.__str__())
    if state:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


@app.route('/alarm/list', methods=['POST'])
def get_alarm_list():
    '''
    {
             projectId:'',   //项目Id
             searchText:'',  //搜索Text.如果没有,返回全部
             pageSize:'',    //每页多少项,用于分页
             pageNum:'',     //第几页,用于分页
             status:''       //报警的状态,用于页面筛选
         }

    '''
    try:
        rt = []
        data = request.get_json()
        projectId = data.get('projectId')
        if not projectId:
            raise Exception("get_alarm_list has no projectId")
        search_text = data.get('searchText')
        if search_text:
            # flask会将\改成/
            # 防止第一个字符是*的情况
            search_text = re.sub('^\\*', '.*', search_text)
            search_text = re.sub('\\^(\\*)', '^.*', search_text)
            search_text = re.sub('//', '\/', search_text)
            search_text = re.sub('/', r'\\', search_text)
            search_regex = Utils.handle_search_text(search_text)
        else:
            search_regex=''
        status = data.get('status')
        page_size = int(data.get('pageSize'))
        current_page = int(data.get('pageNum'))
        offset = (current_page - 1) * page_size

        #获取报警列表
        rt = MongoConnManager.getConfigConn().get_alarm(projectId, search_regex, offset, page_size)
        alarm_id_list = [str(item.get('_id')) for item in rt.get('records')]
        pointList = [str(item.get('point')) for item in rt.get('records')]

        #获取点名注释
        remark_dict = MongoConnManager.getConfigConn().get_point_remark(projectId,pointList)
        if remark_dict:
            for rt_temp in rt.get('records'):
                if rt_temp.get('point') in remark_dict.keys():
                    rt_temp.update({'remark':remark_dict.get(rt_temp.get('point'))})


        #实时库连接
        #rtd = RealTimeData(projectId)
        rt_real = RedisManager.get_alarm_real_result(projectId)
        rt_beused = []

        if alarm_id_list:
            #rt_real = rtd.get_alarm_data(alarm_id_list)
            for rt_temp in rt.get('records'):
                if rt_real:
                    alarm_result = rt_real.get(str(rt_temp.get('_id')))
                    if alarm_result is not None:
                        rt_temp.update({'alarm_result':alarm_result.get('alarm_result')
                                        ,'alarmTime':alarm_result.get('alarm_time')})
                        if rt_temp.get('beused'):
                            #筛选有结果的报警
                            rt_beused.append(rt_temp)
                    else:
                        if rt_temp.get('beused'):
                            rt_temp.update({'alarm_result':1})
                            #rt_beused.append(rt_temp)
                        else:
                            rt_temp.update({'alarm_result':None})

        if status:
            if len(rt_beused) > 0 :
                rt = {"total":len(rt_beused),"records":rt_beused}
            else:
                rt = {"total":0,"records":[]}
    except Exception as e:
        print('get_alarm_list error:' + e.__str__())
        logging.error(e)
    if rt:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(rt)


@app.route('/alarm/delete', methods=['POST'])
def alarm_delete():
    try:
        data=request.get_json()
        pid_list=data.get('_id')

        obid = [ObjectId(item) for item in pid_list]
        rt = MongoConnManager.getConfigConn().del_alarm(obid)
    except Exception as e:
        print('alarm_delete error:' + e.__str__())
        logging.error(e)
    if rt:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(rt)

#rtd = RealTimeData(project_id)


@app.route('/getCalcSettings/<projId>',methods=['POST'])
def getCalcSettings(projId):
    rt={}
    try:
        rt = MongoConnManager.getConfigConn().get_manage_settings(projId)
        if not rt:
            rt = dict(triggerReal={'fixed_time': 0,'raw_data':1},triggerDiagnosis={'fixed_time': 0,'raw_data':1})
    except Exception as e:
        print('getCalcSettings error:' + e.__str__())
        logging.error(e)
        return Utils.beop_response_error()
    return Utils.beop_response_success(rt)

@app.route('/setCalcSettings/<projId>',methods=['POST'])
def setCalcSettings(projId):
    try:
        data = request.get_json()

        triggerReal = data.get("triggerReal")
        triggerDiagnosis = data.get("triggerDiagnosis")

        if triggerReal or triggerDiagnosis:
            rt=MongoConnManager.getConfigConn().save_manage_settings(projId,data)
        else:
            raise Exception("has no calc settings info")
    except Exception as e:
        print('setCalcSettings error:' + e.__str__())
        logging.error(e)
        return Utils.beop_response_error()
    return Utils.beop_response_success(rt)

@app.route('/alarm/status/<projId>', methods=['POST'])
def getAlarmStatus(projId):
    try:
        data = request.get_json()
        alarm_id_list = data.get('alarm_id_list')
        rtd = RealTimeData(projId)
        rt=rtd.get_alarm_data(alarm_id_list)
    except Exception as e:
        print('alarm status error:' + e.__str__())
        logging.error(e)
        return Utils.beop_response_error()
    if rt:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(rt)

'''
@app.route('/alarm/send_flag/<projId>', methods=['POST']) 
def getAlarmStatus(projId):
    try:
        rt = False
        RedisManager.set_alarm_flag(projId, [])
        rt = True
    except Exception as e:
        print('alarm status error:' + e.__str__())
        logging.error(e)
        return Utils.beop_response_error() 
    return Utils.beop_response_success(rt)
'''


@app.route('/oss/delete', methods=['POST'])
def delete_file_from_oss():
    rt = {'status':0, 'message':None}
    post_data = request.get_json()
    allow_path = ['assets', 'custom', 'workflow']
    try:
        if post_data:
            userId = AuthManager.get_userId()
            if userId:
                file_path = post_data.get('file_path[]')
                oss = OssAPI('oss.aliyuncs.com', 'iIDKdO6hyMbZVYzp', 'YFiyioy9kgizMChIfHMWtVvNnvsjVM')
                if not isinstance(file_path, list):
                    file_path = [file_path]
                for file in file_path:
                    if isinstance(file, str):
                        path = file.split('/')
                        if '' == path[0]:
                            path = path[1:]
                            file = file[1:]
                        if path[0] in allow_path:
                            oss.delete_object('beopweb', file)
                            rt.update({'status': 1})
                        else:
                            if rt.get('message'):
                                rt.update({'message': rt.get('message') + "You don't have permission to delete the file: " + file + '. '})
                            else:
                                rt.update({'message': "You don't have permission to delete the file: " + file + '. '})
            else:
                rt.update({'status': 0, 'message': 'You must be login'})
        else:
            rt.update({'status': 0, 'message': 'Invalid parameter'})
    except Exception as e:
        print('delete_file_from_oss error:' + e.__str__())
        logging.error(e.__str__())
        rt.update({'status': 0, 'message': e.__str__()})
    return jsonify(rt)

###
# Sample:  http://beop.rnbtech.com.hk/static/projectReports/reports/shhuawei/RunReport/2016-49-w.pdf
#        http://beop.rnbtech.com.hk/static/projectReports/reports/shhuawei/RunReport/2016-11-29.pdf
#       http://beop.rnbtech.com.hk/static/projectReports/reports/shhuawei/RunReport/2016-11.pdf
###
@app.route('/report/staticfile', methods=['GET'])
def get_report_statfile():
    rt = {}
    token = request.args.get('token')
    if token is None:
        raise Exception('token is not valid')
    date = request.args.get('date')
    if date is None:
        raise Exception('data is not valid')
    period = request.args.get('period')
    if period is None:
        raise Exception('period is not valid')
    period = int(period)
    name = request.args.get('name')
    if name is None:
        raise Exception('name is not valid')
    filename = date
    try:
        encodestr = decrypt_base64(token)
        if encodestr:
            username = encodestr[0]
            projname = encodestr[1]
            #user auth: 验证用户名是否具有该项目的权限
            userprofile = BEOPDataAccess.getInstance().getUserProfileByUserName(username)
            if userprofile:
                userId = userprofile.get('id', 0)
                if userId > 0:
                    projs = BEOPDataAccess.getInstance().getProject(userId)
                    if projs:
                        for item in projs:
                            if item.get('name_en').lower() == projname:
                                break
                        else:
                            raise Exception('user auth failed,please check.')
                        if period==0: #日报
                            filename = date
                        elif period==1:#周报
                            t = datetime.strptime(date, '%Y-%m-%d').isocalendar()
                            filename = '%04d-%02d-w'%(t[0], t[1])
                        elif period==2:#月报
                            filename = date[:date.rfind('-')]
                        strPath = 'projectReports/reports/%s/%s/%s.pdf' % (projname, name, filename)
                        static_path = app.static_folder
                        full_path = os.path.join(static_path, strPath)
                        full_path = os.path.normpath(full_path)
                        if os.path.exists(full_path):
                            return app.send_static_file(strPath)
                        else:
                            raise Exception('no report file is found')
                    else:
                        raise Exception('no projects is found by %s' % (username,))
                else:
                    raise Exception('%s is not found' % (username,))
            else:
                raise Exception('%s is not found'%(username,))
    except Exception as e:
        print('get_report_statfile error:' + e.__str__())
        logging.error('get_report_statfile error:' + e.__str__())
        rt['status'] = 0
        rt['message'] = e.__str__()
    return jsonify(rt)

@app.route('/kaide')
def kaide():
    return render_template('indexKaide.html', title='BEOP Kaide')

@app.route('/fileManagement')
def file():
    return render_template('indexFileManagement.html', title='BEOP file')

@app.route('/project/getUnitSystem', methods=['POST'])
def getProjectUnitSystem():
    rt = dict()
    try:
        data = request.get_json()
        if data:
            projId = data.get('projId')
            if projId:
                projId = int(projId)
                rt = BEOPDataAccess.getInstance().getProjectUnitSystem(projId)
            else:
                raise Exception('projId is needed')
        else:
            raise Exception('method should be json')
    except Exception as e:
        print('getProjectUnitSystem error:' + e.__str__())
        logging.error('getProjectUnitSystem error:' + e.__str__())
        rt['status'] = 0
        rt['message'] = e.__str__()
    return json.dumps(rt, ensure_ascii=False)

@app.route('/project/setUnitSystem', methods=['POST'])
def setProjectUnitSystem():
    rt = False
    try:
        data = request.get_json()
        if data:
            projId = data.get('projId')
            unit = data.get('unit')
            if projId and unit is not None:
                projId = int(projId)
                unit = int(unit)
                rt = BEOPDataAccess.getInstance().setProjectUnitSystem(projId, unit)
            else:
                raise Exception('projId is needed')
        else:
            raise Exception('method should be json')
    except Exception as e:
        print('setProjectUnitSystem error:' + e.__str__())
        logging.error('setProjectUnitSystem error:' + e.__str__())
        rt['status'] = 0
        rt['message'] = e.__str__()
    return json.dumps(rt, ensure_ascii=False)

@app.route('/project/status/<int:projectId>', methods=['GET'])
def get_project_dtu_status(projectId):
    rt = {}
    try:
        info = BEOPDataAccess.getInstance().getProjectDTUById(projectId)
        if info:
            rt['type'] = info.get('projType')
            rt['dtuTotal'] = len(info.get('dtuNameList'))
            rt['dtuOff'] = len(info.get('dtuOffNameList'))
            rt['lastUpdateTime'] = info.get('lastUpdateTime')
            #rt['offTotal'] = info.get('OfflineCountMonthly')
            rt['detail'] = info.get('detail')
        else:
            raise Exception('projId=%s is not found'%(projectId,))
    except Exception as e:
        print('get_project_status error:' + e.__str__())
        logging.error(e)
        return Utils.beop_response_error(e)
    return Utils.beop_response_success(rt)

@app.route('/project/status/history/',methods=['post'])
def get_project_dtu_history():
    """
    {'projectId':int,
     'dtu':['x','y','z']#如果是None或者[]则返回全部dtu
     'startTime':string#不传的话就是本月
     'endTime':string#不传的话就是本月
    }
    :return:
    [
        {
            'dtu':string,
            'history':
            [
                {
                    'time':string
                    'status':int
                }
            ]
        }
    ]
    """
    rt = []
    try:
        data = request.get_json()
        if data:
            projectId = int(data.get('projectId'))
            dtu_list = data.get('dtu')
            startTime = data.get('startTime')
            endTime = data.get('endTime')
            rt = BEOPDataAccess.getInstance().getDTUHistory(projectId, dtu_list, startTime, endTime)
    except Exception as e:
        print('get_project_dtu_history error:' + e.__str__())
        logging.error(e)
        return Utils.beop_response_error(e)
    return Utils.beop_response_success(rt)

@app.route('/workflow/uploadReport/<projId>/<reportName>', methods=['POST'])
def uploadReport(projId, reportName):
    rt = "successful"

    projName = BEOPDataAccess.getInstance().getProjNameById(projId)
    assert (len(projName) > 0)
    dirPath = 'beopWeb/static/projectReports/reports/' + projName + '/' + reportName
    bPathExist = os.path.exists(dirPath)
    try:
        if not bPathExist:
            os.makedirs(dirPath)
        keys = request.files.keys()
        if 'reportFile' in keys:
            f = request.files['reportFile']
            f.save(dirPath + '/' + f.filename)
    except Exception as e:
        rt = "failed"
    return rt

@app.route('/beopWeb/autotest/uploadReport/<fname>', methods=['GET', 'POST'])
def autotestupload(fname):
    '''autotest_upload'''
    rt = "successful"
    dirPath = 'beopWeb/autotest/' + fname
    bPathExist = os.path.exists(dirPath)
    if request.method == 'POST':
        try:
            if not bPathExist:
                os.makedirs(dirPath)
            keys = request.files.keys()
            if 'file' in keys:
                f = request.files['file']
                f.save(dirPath + '/' + f.filename)
        except Exception as e:
            rt = "failed"
        return rt,
    return render_template('temp/autotest_upload.html', fname=fname)


def gzip_compress(raw_data):
    buf = io.BytesIO()
    try:
        f = gzip.GzipFile(mode='wb', fileobj=buf)
        f.write(raw_data)
    except Exception as e:
        print(e.__str__())
    finally:
        f.close()
    return buf.getvalue()

#尝试导入点表接口
@app.route('/project/<projectId>/try_upload_point_list', methods=['POST'])
def tryUploadPointList(projectId):
    '''
        Requirement: http://192.168.1.208:8888/redmine/issues/367
        Request
            Content-Type: multipart/form-data
            Post Data: {
                'pointListFile': 点表文件
            }
            return:
                正确时: status 200
                {
                    "currentPointCount": 目前的点数
                    "newPointCount": 文件里的点数
                    "addedPointCount": 需要被新增加的点数
                    "removedPointCount": 需要被移除的点数
                    "pointListFileId": 文件ID，用来确认点表upload
                }
                错误时: status 非200
                { error: "<具体的错误>" }
    '''
    try:
        fileId = None
        file = request.files.get('config-file')
        if not file:
            raise Exception('there is no upload file')
        user_id = AuthManager.get_userId()
        if not user_id:
            raise Exception('not login')
        file.filename = datetime.now().strftime(Utils.datetime_format_full_file_name) + os.path.splitext(file.filename)[1]
        #临时保存点表
        file_path = os.path.join(os.path.abspath('.') + '/temp','mappingPointTable', str(user_id), str(projectId))
        if not os.path.exists(file_path):
            os.makedirs(file_path, exist_ok=True)
        full_path = os.path.join(file_path, file.filename)
        file.save(full_path)
        try:
            newPointCount = 0
            new_dict_list = []
            newPointNameDict = []
            content = 'Point Name,Point Value,Update Time,Remark\n'
            # 解析csv
            if file.filename.endswith('csv'):
                with open(full_path, 'r', encoding='utf8') as csvfile:
                    readers = csv.reader(csvfile)
                    lines = []
                    for line in readers:
                        if line:
                            lines.append(line)
                            if len(lines) == 1:
                                if not set(['Point Name','Point Value','Update Time','Remark']).issubset(set(line)):
                                    raise Exception('csv文件第一行必须包括"Point Name","Point Value","Update Time","Remark"')
                    if len(lines) == 0:
                        raise Exception('传入文件不可为空')
                    new_dict_list = convert_csv_to_point_dict(lines, projectId, PointTableSourceType.TYPE_CLOUD,
                                                                      user_id)
                    emptyPointnameIndex = []
                    for new_point in new_dict_list:
                        params = new_point.get('params')
                        if params:
                            pointname = params.get('Point Name')
                            if pointname:
                                newPointNameDict.append(pointname)
                                content += params.get('Point Name') + ',' + params.get(
                                    'Point Value') + ',' + params.get(
                                    'Update Time') + ',' + params.get('Remark') + '\n'
                            else:
                                emptyPointnameIndex.append(str(len(newPointNameDict) + 2))

                    if len(emptyPointnameIndex) > 0:
                        raise Exception('第' + ','.join(emptyPointnameIndex) + '行点名为空')

            # 解析xlsx
            if file.filename.endswith('xlsx') or file.filename.endswith('xls'):
                workbook = open_workbook(full_path)
                sheet = workbook.sheet_by_index(0)
                sheetKeys = [sheet.cell(0, col_index).value for col_index in range(sheet.ncols)]
                if not set(['physicalid', 'remark']).issubset(set(sheetKeys)):
                    raise Exception('excel文件第一行必须包括"physicalid","remark"')
                new_dict_list = convert_sheet_to_point_dict(sheet, projectId, PointTableSourceType.TYPE_CLOUD, user_id)
                for index, new_point in enumerate(new_dict_list):
                    pointName = new_point.get('value')
                    if not pointName:
                        raise Exception('第' + index + '行点名为空')
                    alias = new_point.get('alias')
                    newPointNameDict.append(pointName)
                    content += pointName + ',  ,' + datetime.now().strftime('%Y-%m-%d %H:%M:%S') + ',' + alias + '\n'
            out_data = gzip_compress(pickle.dumps(content))
            if new_dict_list:
                newPointCount = len(new_dict_list)
            point_name_set = set(newPointNameDict)
            duplicatePoint = {point_name:newPointNameDict.count(point_name) for point_name in point_name_set if newPointNameDict.count(point_name) > 1}
            if len(duplicatePoint) > 0:
                errorMsg = ''
                for duplicatePointname in duplicatePoint:
                    errorMsg += '点 ' + duplicatePointname + ' 出现了' + str(duplicatePoint[duplicatePointname]) + '次;'
                raise Exception(errorMsg)
            fileId = ObjectId().__str__()
            if not BEOPDataAccess.getInstance().saveRtdataUpload(out_data, user_id, projectId, fileId, 1):
                raise Exception('save to mysql failed')

        #存文件到mysql
        except InvalidPointsExcel as e:
            fail_list = e
            msg = ''
            if fail_list.args[0].get('empty'):
                msg += '\npointname or physicalid is empty row:No.' + ','.join([str(int(row)+2) for row in fail_list.args[0].get('empty')]) + '\n'
            if fail_list.args[0].get('duplicated'):
                msg += '\nthere is duplicated row:\n' + '\n'.join([row for row in fail_list.args[0].get('duplicated')]) + '\n'
            raise Exception(msg)
        #比较新加入点和之前点的区别
        rtd = RealTimeData(projectId)
        old_list, old_total_count = rtd.search_raw('', 0, 0, 100000, 'pointname asc')
        addedPointCount = 0
        removedPointCount = 0
        oldPointNameDict = []
        for oldPoint in old_list:
            oldPointName = oldPoint.get('pointname')
            if oldPointName:
                oldPointNameDict.append(oldPointName)
                if oldPointName not in newPointNameDict:
                    removedPointCount += 1
        for newPointName in newPointNameDict:
            if newPointName not in oldPointNameDict:
                addedPointCount += 1
        response = jsonify({
            "currentPointCount": old_total_count,
            "newPointCount": newPointCount,
            "addedPointCount": addedPointCount,
            "removedPointCount": removedPointCount,
            "pointListFileId": fileId
        })
    except Exception as e:
        print(e.__str__())
        response = jsonify({"error": e.__str__()})
        response.status_code = 500
    return response

def getExportPointRtdata(projectId):
    rtd = RealTimeData(projectId)
    pt = PointTable(projectId)
    search_list, total_count = rtd.search_raw('', 0, 0, 100000, 'pointname asc')
    points_map = pt.get_original_points_map(PointTableSourceType.TYPE_CLOUD,
                                        [item.get('pointname') for item in search_list])

    for point in search_list:
        if points_map.get(point.get('pointname')) and points_map.get(point.get('pointname')).get('alias'):
            point['alias'] = points_map.get(point.get('pointname')).get('alias')
    content = 'Point Name,Point Value,Update Time,Remark\n'
    for item in search_list:
        try:
            content += item.get("pointname", '')
            content += ','
            if item.get('pointvalue', ''):
                content += item.get('pointvalue', '').replace('\n', ' ')
            content += ','
            if item.get('time'):
                content += item.get('time', '')
            content += ','
            if item.get('alias'):
                content += item.get('alias', '')
            content += '\n'
        except Exception as e:
            print(e.__str__())
    return content
#导出点表和实时数据接口
@app.route('/project/<projectId>/export_point_rtdata', methods=['GET'])
def exportPointRtdata(projectId):
    try:
        content = getExportPointRtdata(projectId)
        response = make_response(content)
        response.mimetype = 'text/csv'
        response.headers["Content-Disposition"] = "attachment; filename=" + projectId + "rtdata.csv"
        response.headers["Content-Type"] = "text/plain;"
    except Exception as e:
        print(e.__str__())
        response = jsonify({"error": e.__str__()})
        response.status_code = 500
    return response


def gzip_uncompress(c_data):
    buf = io.BytesIO(c_data)
    f = gzip.GzipFile(mode='rb', fileobj=buf)
    r_data = None
    try:
        r_data = f.read()
    except Exception as e:
        print(e.__str__())
    finally:
        f.close()
    return r_data

#上传列表某一文件下载
@app.route('/project/<projectId>/point_list_uploaded_file/<fileId>', methods=['GET'])
def getPointListUploadedFile(projectId, fileId):
    response = None
    try:
        records = BEOPDataAccess.getInstance().getRtdataUploadDetail(fileId)
        for item in records:
            zipContent = item[1]
            content = gzip_uncompress(zipContent)
            response = make_response(pickle.loads(content))
            response.headers["Content-Disposition"] = "attachment; filename=" + fileId + '.csv'
            response.headers["Content-Type"] = "text/plain"
    except Exception as e:
        print(e.__str__())
        response = jsonify({"error": e.__str__()})
        response.status_code = 500
    return response

#确认导入点表接口
@app.route('/project/<projectId>/confirm_upload_point_list', methods=['POST'])
def confirmUploadPointList(projectId):
    '''
    Requirement: http://192.168.1.208:8888/redmine/issues/367
    Request
        Content-Type: multipart/form-data
        Post Data: {
            'pointListFileId': 文件Id
        }
        Return: {
            'error': 'success'
        }
    '''
    response = None
    try:
        user_id = AuthManager.get_userId()
        if not user_id:
            raise Exception('not login')
        data = request.get_json()
        if data:
            pointListFileId = data.get('pointListFileId')
            if not pointListFileId:
                raise Exception('pointListFileId is null')
            #删除数据库之前先进行备份
            content = getExportPointRtdata(projectId)
            out_data = gzip_compress(pickle.dumps(content))
            newFileId = ObjectId().__str__()
            if not BEOPDataAccess.getInstance().saveRtdataUpload(out_data, user_id, projectId, newFileId):
                raise Exception('点表备份失败')
            #mysql写入新点，删除不存在的点
            records = BEOPDataAccess.getInstance().getRtdataUploadDetail(pointListFileId)
            newPointDict = {}
            newPointNameList = [] #同步现场点用
            newPointValueList = [] #同步现场点用
            for item in records:
                #将新传入的点由csv形式转成dict形式
                zipContent = item[1]
                content = gzip_uncompress(zipContent)
                pythonObj = pickle.loads(content)
                newPoint = pythonObj.split('\n')
                for pointStr in newPoint[1:]:
                    onePointList = pointStr.split(',')
                    if onePointList and onePointList[0]:
                        point_value = ''
                        for point_value_item in range(1, len(onePointList) - 2):
                            point_value += onePointList[point_value_item]
                        newPointDict[onePointList[0]] = {"pointValue": point_value, 'time': onePointList[-2],
                                                         "remark": onePointList[-1], "pointName": onePointList[0]}
                        newPointNameList.append(onePointList[0])
                        newPointValueList.append(onePointList[1] if onePointList[1] else '')
            rtd = RealTimeData(projectId)
            old_list, old_total_count = rtd.search_raw('', 0, 0, 100000, 'pointname asc')

            # 删除的点
            deletePointNameList = []
            oldPointNameDict = {}
            for oldPointInfo in old_list:
                oldPointName = oldPointInfo.get('pointname')
                if oldPointName not in newPointDict:
                    deletePointNameList.append(oldPointName)
                oldPointNameDict[oldPointName] = oldPointInfo

            # 新增的点
            addPointInfoList = []
            for pointname, newPointInfo in newPointDict.items():
                if pointname not in oldPointNameDict:
                    addPointInfoList.append(newPointInfo)

            # mysql删除点和新增点
            if not BEOPDataAccess.getInstance().cleanRtdataBeopdata(projectId, deletePointNameList, addPointInfoList):
                raise Exception('mysql删除点,新增点出错，请立即重试')

            # 更新现场点buffer表的实时数据
            strTimeList = []
            for i in range(len(newPointNameList)):
                strTimeList.append(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
            postData = {"projId": projectId, "pointList": newPointNameList, "valueList": newPointValueList,
                        "strTimeList": strTimeList, "pointTypeFlag": 0}
            headers = {'content-type': 'application/json'}
            req = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/setMutilDataToBufferTable',
                                headers=headers,data=json.dumps(postData))
            if req.status_code == 200:
                result = json.loads(req.text)
                if not result.get('state'):
                    raise Exception('同步现场点错误')
            else:
                raise Exception('同步现场点错误')
            # 更新现场点buffer表到mongo表
            pt = PointTable(projectId)
            pt.sync_cloud_points(user_id)
            allCloudToSitePoints = MongoConnManager.getConfigConn().getCloudPointSiteType(int(projectId))
            RedisManager.set_cloudpoints_site(int(projectId), allCloudToSitePoints)
            # mongo更新现场点remark，原始点取remark取的对应现场点的remark
            MongoConnManager.getConfigConn().updateMappingPointRemark(projectId, newPointDict)
            response = jsonify({"error": "success"})
            response.status_code = 200
    except Exception as e:
        print(e.__str__())
        response = jsonify({"error": e.__str__()})
        response.status_code = 500
    return response

#获取点表导入操作记录的接口
@app.route('/project/<projectId>/point_list_upload_records', methods=['GET'])
def pointListUploadRecords(projectId):
    try:
        rt = []
        dbaccess = BEOPDataAccess.getInstance()
        records = dbaccess.getRtdataUploadList(projectId)
        for item in records:
            operator = {}
            timeStamp = item[0].strftime('%Y-%m-%dT%H:%M:%S.000Z')
            fileId = item[5]
            userId = item[2]
            userInfo = dbaccess.getUserProfileById(userId)
            if userInfo:
                operator = {"username": userInfo.get('name'), 'userFullName': userInfo.get('fullname')}
            fileUrl = "/project/" + str(projectId) + "/point_list_uploaded_file/" + fileId
            rt.append({"operator": operator, "timeStamp": timeStamp, 'fileUrl': fileUrl})
            rt = sorted(rt, key=lambda x: x['timeStamp'], reverse=1)
        response = jsonify({"data": rt})
    except Exception as e:
        print(e.__str__())
        response = jsonify({"error": e.__str__()})
        response.status_code = 500
    return response
