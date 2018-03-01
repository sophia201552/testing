"""
Routes and views for the flask application.
"""

from beopWeb import socketio
from flask_socketio import emit, join_room, leave_room
from beopWeb.mod_factory import bp_factory
from beopWeb.BEOPDataAccess import *
from flask import request, url_for, redirect, render_template, json, jsonify
from datetime import datetime, timedelta
import time
import subprocess
import mysql.connector
from beopWeb.MongoConnManager import MongoConnManager
from beopWeb.mod_memcache.RedisManager import RedisManager
from beopWeb.BEOPMySqlDBContainer import *
from beopWeb.BEOPMySqlDBReadOnlyContainer import *
from beopWeb.mod_admin import ProjectPermission, MenuConfigure
import copy

wmysql = BEOPMySqlDBContainer()
rmysql = BEOPMySqlDBReadOnlyContainer()

onlineUsers = {}

def formatResult(b, msg='', data=None):
    if b:
        rt = {"status": 'OK'}
    else:
        rt = {"status": 'ERROR'}
    if msg:
        rt['msg'] = msg
    if data != None:
        rt['data'] = data
    return rt

def facCheckProjName(projName):
    try:
        projectInfoList = RedisManager.get_project_info_list()
        if projectInfoList:
            for item in projectInfoList:
                if item.get('name_en') == projName or \
                   item.get('name_cn') == projName or \
                   item.get('name_english') == projName:
                    return False
        else:
            print('factoryPublish error:projectInfoList is not in memcache!')
            logging.error('factoryPublish error:projectInfoList is not in memcache!')
    except Exception as e:
        print('interface facCheckProjName error:'+e.__str__())
        logging.error('interface facCheckProjName error:'+e.__str__())
    return True

# 将离线项目发布到新项目
def facPublishToNewProject():
    rt = False
    data = request.get_json()
    sourceId = data.get('sourceId')
    userId = data.get('userId')
    projName = data.get('projName')
    targetId = None

    # 如果传入了 projName，说明是要发布到新项目，需要判断线上是否已经有同名项目
    if facCheckProjName(projName) == False:
        return jsonify(formatResult(False, 'Project name exited'))
    if sourceId:
        # 获取离线项目数据
        sourceProjDetailList = MongoConnManager.getConfigConn().GetProjectFromIdLists([sourceId])
        if len(sourceProjDetailList) == 0:
            return jsonify(formatResult(False, 'failed to get offline project data'))
        detail = sourceProjDetailList[0]

        sql = "insert into project(name_en, name_cn, s3dbname, mysqlname,update_time,latlng," \
              "address,name_english,weather_station_id,pic,collectionname) values " \
              "('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', %d, '%s','%s')" % \
              (projName, projName, detail.get('s3dbname',''), detail.get('mysqlname',''),
               detail.get('update_time', datetime.now()).strftime('%Y-%m-%d %H:%M:%S'),
               detail.get('latlnt','0.0,0.0'), detail.get('address',''), detail.get('name_english',''), detail.get('weather_station_id',0),
               detail.get('pic',''), detail.get('collectionname',''))
        # 插入新项目，并获取到新项目返回的 id
        targetId = wmysql.op_db_update_with_id(app.config.get('DATABASE'), sql)
        targetId = int(targetId)

        # 插入项目权限
        if targetId:
            MongoConnManager.UpdateProjectInfo()
            success, inserted_project_role = ProjectPermission.insert_project_role(targetId, 'Project Creator')
            if success:
                ProjectPermission.insert_role_user(userId, inserted_project_role.get('id'), userId)
        else:
            return jsonify(formatResult(False, 'error occurs when inserting new project'))
        
        mc = MenuConfigure()
        all_project_roles = [inserted_project_role.get('id')]

        # 在 Factory 的发布信息表中将该离线项目的数据先清空，因为这个离线项目以前可能被发布过
        if MongoConnManager.getConfigConn().RemoveProjectPublish(targetId):
            # 拿到离线项目的页面列表
            pageList = MongoConnManager.getConfigConn().factoryGetPageList(sourceId, 1)
            page_id_list = []
            for x in pageList:
                if (x.get('isHide') == None) or (x.get('isHide') == 0):
                 page_id_list.append(x.get('_id'))

            # 将页面列表保存到线上
            if MongoConnManager.getConfigConn().SaveToObNavigation(targetId, page_id_list):
                mc.update_page_menu(targetId, all_project_roles, page_id_list)
            else:
                return jsonify(formatResult(False, 'failed to save offline project page list to online list'))
            # 将 id 转换成 ObjectId
            for item in pageList:
                item.update({'_id':ObjectId(item.get('_id'))})

            if not MongoConnManager.getConfigConn().SaveToObPage(pageList):
                return jsonify(formatResult(False, 'failed to save Factory page data'))

            # 绑定关联项目
            if not MongoConnManager.getConfigConn().factoryBindOnlineProject(sourceId, targetId):
                return jsonify(formatResult(False, 'failed to match online project ID'))
        else:
            return jsonify(formatResult(False, 'error occurs when clearing existing project data'))
    else:
        return jsonify(formatResult(False, 'offline project ID can not be blank'))

    return jsonify(formatResult(True, 'publish project and match to online project successfully', {'bindId': targetId}))

@socketio.on('disconnect')
def ws_disconnect():
    global onlineUsers

@socketio.on('send_notice_to_one_member')
def ws_member_notice(data):
    emit('get_notice', data['message'], room=data['sid'])

@socketio.on('member_join')
def ws_member_enter(data):
    global onlineUsers
    pageId = data['pageId']
    join_room(pageId)
    if not pageId in onlineUsers:
        onlineUsers[pageId] = {}
    data['user']['ip'] = request.remote_addr
    data['user']['sid'] = request.sid

    onlineUsers[pageId][request.sid] = data['user']
    emit('update_online_users', onlineUsers[pageId], room=pageId)

@socketio.on('member_leave')
def ws_member_leave(data):
    global onlineUsers
    pageId = data['pageId']
    leave_room(pageId)
    if pageId in onlineUsers:
        if request.sid in onlineUsers[pageId]:
            del onlineUsers[pageId][request.sid]
            emit('update_online_users', onlineUsers[pageId], room=pageId)

@bp_factory.route('')
def factory():
    token = None
    if app.config.get('URL_CHECK'):
        # 拿到 token
        token = request.cookies.get('token')
    if token:
        return render_template('mod_factory/indexFactory.html',
                               title='Factory Page', token=token)
    else:
        return render_template('mod_factory/indexFactory.html',
                               title='Factory Page')

@bp_factory.route('/previewProject/<userId>/<projectId>', methods=['GET'])
def factoryProjectPreview(userId,projectId):
    return render_template('mod_factory/previewProject.html',
                           pageInfo=json.dumps({"userId": userId, "projectId": projectId}))

@bp_factory.route('/preview/<templateId>', methods=['POST'])
def factoryTemplatePreview(templateId):
    # import pdb; pdb.set_trace()
    params = request.form['params']
    return render_template('mod_factory/indexFactoryPreview.html',
                           pageInfo=json.dumps({
                               "params": params,
                               "templateId": templateId,
                               "type": "PageScreen"
                           })
                          )

@bp_factory.route('/preview/page/<pageId>', methods=['GET'])
@bp_factory.route('/preview/page/<pageId>/<int:isFactory>', methods=['GET'])
def factoryPagePreview(pageId, isFactory=1):
    page = MongoConnManager.getConfigConn().GetPageInfoByIds([pageId], isFactory)
    page = page[0] if len(page) > 0 else None
    
    if page is None:
        return ''
    page.update({'_id': page.get('_id').__str__()})
    bindId = ''
    if 'projId' in page:
        bindId = MongoConnManager.getConfigConn().factoryGetBindProjId(page.get('projId'))
        page.update({'onlineProjId': bindId})
    return render_template('mod_factory/pagePreview.html',
                           pageInfo=json.dumps(page), isFactory=isFactory)

@bp_factory.route('/preview/dashboard/<pageId>', methods=['GET'])
@bp_factory.route('/preview/dashboard/<pageId>/<int:isFactory>', methods=['GET'])
def factoryDashboardPreview(pageId, isFactory=1):
    page = MongoConnManager.getConfigConn().GetPageInfoByIds([pageId], isFactory)
    page = page[0] if len(page) > 0 else None

    if page is None:
        return ''
    bindId = ''
    if 'projId' in page:
        bindId = MongoConnManager.getConfigConn().factoryGetBindProjId(page.get('projId'))
    return render_template('mod_factory/dashboardPreview.html',
        pageInfo=json.dumps({
            '_id': pageId, 
            'type': page.get('type'), 
            'onlineProjId': bindId
        }), isFactory=isFactory)

@bp_factory.route('/previewMaterial/report/<pageId>', methods=['GET'])
def factoryReportMaterialPreview(pageId, isFactory=1):
    return render_template('mod_factory/reportPreview.html',
        pageInfo=json.dumps({'_id': pageId, 'type': 'FacReportScreen','material': 1}))

@bp_factory.route('/preview/report/<pageId>', methods=['GET'])
@bp_factory.route('/preview/report/<pageId>/<int:isFactory>', methods=['GET'])
def factoryReportPreview(pageId, isFactory=1):
    projectId = request.args.get('projectId', '')
    return render_template('mod_factory/reportPreview.html',
        pageInfo=json.dumps({
            '_id': pageId, 
            'type': 'FacReportScreen', 
            'onlineProjId': projectId
        }), isFactory=isFactory)

@bp_factory.route('/preview/reportWrap/<pageId>', methods=['GET'])
@bp_factory.route('/preview/reportWrap/<pageId>/<int:isFactory>', methods=['GET'])
def factoryReportWrapPreview(pageId, isFactory=1):
    page = MongoConnManager.getConfigConn().GetPageInfoByIds([pageId], isFactory)
    page = page[0] if len(page) > 0 else None

    if page is None:
        return ''
    bindId = ''
    if 'projId' in page:
        bindId = MongoConnManager.getConfigConn().factoryGetBindProjId(page.get('projId'))
    return render_template('mod_factory/reportWrapPreview.html',
        pageInfo=json.dumps({
            '_id': pageId, 
            'type': 'FacReportWrapScreen', 
            'onlineProjId': bindId
        }), isFactory=isFactory)

@bp_factory.route('/page/<pageId>', methods=['GET'])
def factoryGetPageInfo(pageId):
    page = MongoConnManager.getConfigConn().GetPageInfoByIds([pageId])
    page = page[0] if len(page) > 0 else None

    if page is None:
        return jsonify(formatResult(False, 'failed to get page data'))
    page.update({'_id': page.get('_id').__str__()})

    return jsonify(formatResult(True, '', page))

@bp_factory.route('/publishWithMerging', methods=['POST'])
def factoryPublishWithMerging():
    rt = False

    data = request.get_json()
    #type = int(data.get('type'))
    userId = data.get('userId')
    pwd = data.get('password')

    # 验证用户权限
    validate = BEOPDataAccess.getInstance().validate_user_byID({"id": userId, "pwd": pwd})
    if validate is None:
        return jsonify(formatResult(False, 'Wrong password!'))
    
    sourceId = data.get('sourceId')
    targetId = data.get('targetId')
    navIdOnline = data.get('navIdOnline')
    navIdOffline = data.get('navIdOffline')
    navIdResult = data.get('navIdResult')
    msg = data.get('msg')

    #projectInfoList = MemcacheManager.get('projectInfoList')

    #若没有目标项目，则发布为新项目
    if targetId == None or targetId == '':
        #return faPcublishToNewProject()
        return jsonify(formatResult(False, 'Target online project is not exist'))
    else: targetId = int(targetId)

    if sourceId:
        mc = MenuConfigure()

        # 取 level 为 30 的权限组
        roleIds = BEOPDataAccess.getInstance().getProjectRoleByLevel(targetId, 30)
        if roleIds is None:
            return jsonify(formatResult(False, 'There isn\'t a "factory publish role group" in target online project!'))

        # 拿到离线项目的用户角色列表
        sourceProjectUsers = MongoConnManager.getConfigConn().GetUserListByProjectId(sourceId)
        
        # 离线项目的用户角色加入到线上项目的用户权限组中
        rt = BEOPDataAccess.getInstance().addUserRoles(roleIds, sourceProjectUsers)
        if rt == False:
            return jsonify(formatResult(False, 'Occur an error when add users to online project role group.'))

        #TODO: 目录顺序

        ## 在 Factory 的发布信息表中将该离线项目的数据先清空，因为这个离线项目以前可能被发布过
        #MongoConnManager.getConfigConn().RemoveProjectPublish(targetId):

        # 拿到离线项目的页面列表
        pageSrcList = MongoConnManager.getConfigConn().factoryGetPageList(sourceId, 1)
        pageList = []
        arrRoleNavId = copy.copy(navIdResult)
        for item in pageSrcList:
            if item.get('_id') in navIdOffline:
                #隐藏菜单，则不添加到导航栏中
                if item.get('isHide', None) == 1:
                    arrRoleNavId.remove(item.get('_id'))

                item.update({'_id':ObjectId(item.get('_id'))})
                pageList.append(item)

        # 将页面列表保存到线上
        if MongoConnManager.getConfigConn().SaveToObNavigation(targetId, navIdResult):
            mc.update_page_menu(targetId, roleIds, arrRoleNavId)
        else:
            return jsonify(formatResult(False, 'failed to save offline project page list to online list'))

        if not MongoConnManager.getConfigConn().SaveToObPage(pageList):
            return jsonify(formatResult(False, 'failed to save Factory page data'))
    else:
        return jsonify(formatResult(False, 'offline project ID can not be blank'))

    # 发布成功后，记录到发布日志
    MongoConnManager.getConfigConn().mdbBb['Ob_Publish_Log'].insert({
        'projectId': targetId,
        'userId': userId,
        'msg': msg,
        'time': datetime.now(),
        'type':0, 
        'content': data
    })

    return jsonify(formatResult(True, 'publish project and match to online project successfully', {'bindId': targetId}))


@bp_factory.route('/getProjectList/<userId>', methods=['GET'])
def factoryGetProjectList(userId):
    data =  MongoConnManager.getConfigConn().factoryGetProjectList(int(userId))
    return jsonify({"data":data})

@bp_factory.route('/getProjectUser/<projId>', methods=['GET'])
def factoryGetProjectUser(projId):
    data =  MongoConnManager.getConfigConn().factoryGetProjectUser(projId)
    return jsonify({"data":data})

@bp_factory.route('/updateProjectAuth', methods=['POST'])
def factoryUpdateProjectAuth():
    rt = False
    data = request.get_json()
    rt = MongoConnManager.getConfigConn().factoryUpdateProjectAuth( data.get('projId'), data.get('userIds') )
    return jsonify(formatResult(rt))

@bp_factory.route('/getPageList/<projId>', methods=['GET'])
@bp_factory.route('/getPageList/<projId>/<isFactory>', methods=['GET'])
def factoryGetPageList(projId, isFactory=0):
    rt = False
    msg = ''
    data = MongoConnManager.getConfigConn().factoryGetPageList(projId, int(isFactory))
    if data != None:
        rt = True
    else:
        msg = '获取数据失败，继续操作可能造成数据丢失，请刷新重试！'
    return jsonify(formatResult(rt, msg, data))

@bp_factory.route('/getPageDetail/<pageId>', methods=['GET'])
@bp_factory.route('/getPageDetail/<pageId>/<isFactory>', methods=['GET'])
def factoryGetPageDetail(pageId, isFactory=0):
    isFactory = int(isFactory)
    page = MongoConnManager.getConfigConn().GetPageInfoByIds([pageId], isFactory)
    page = page[0] if len(page) > 0 else None

    if page:
        page.update({'_id': page.get('_id').__str__()})
    data = MongoConnManager.getConfigConn().factoryGetPageDetail(pageId, isFactory)

    MongoConnManager.getConfigConn().factoryPageWidgetsTransform(page.get('projId'), data.get('widgets'))
    return jsonify({'page': page, 'data': data})


@bp_factory.route('/historyShot/save', methods=['POST'])
def factoryHistoryShotSave():
    data = request.get_json()
    pageId = data.get('pageId')
    userId = data.get('userId')
    time = data.get('time')
    name = data.get('name')
    content = data.get('content')
    rt = MongoConnManager.getConfigConn().factoryHistoryShotSave(pageId, int(userId),
                            datetime.strptime(time,'%Y-%m-%d %H:%M:%S'), name, content)
    return jsonify({"_id": rt})

@bp_factory.route('/historyShot/edit', methods=['POST'])
def factoryHistoryShotEdit():
    data = request.get_json()
    shotId = data.get('_id')
    pageId = data.get('pageId')
    userId = data.get('userId')
    time = data.get('time')
    name = data.get('name')
    content = data.get('content')
    data = MongoConnManager.getConfigConn().factoryHistoryShotEdit(shotId, pageId if pageId else None, int(userId) if userId else None,
                            datetime.strptime(time,'%Y-%m-%d %H:%M:%S') if time else None, name if name else None, content if content else None)
    return jsonify(formatResult(data))

@bp_factory.route('/historyShot/getDetail/<historyShotid>', methods=['GET'])
def factoryHistoryShotGetDetail(historyShotid):
    data = MongoConnManager.getConfigConn().factoryHistoryShotGetDetail(historyShotid)
    return jsonify(data)

@bp_factory.route('/projSprite/add/<projId>', methods=['POST'])
def factoryAddProjSprite(projId):
    rt = False
    rec = request.get_json()
    if rec:
        spriteIdList = MongoConnManager.getConfigConn().AddToSprite(rec)
        rt = MongoConnManager.getConfigConn().AddProjSprite(projId, spriteIdList)
    return jsonify(formatResult(rt))

@bp_factory.route('/projSprite/remove/<projId>', methods=['POST'])
def factoryRemoveProjSprite(projId):
    rt = False
    rec = request.get_json()
    if rec:
        rt = MongoConnManager.getConfigConn().RemoveProjSprite(projId, rec)
    return jsonify(formatResult(rt))

@bp_factory.route('/projSprite/get/<projId>', methods=['GET'])
def factoryGetProjSprite(projId):
    data = MongoConnManager.getConfigConn().GetProjSprite(projId)
    return json.dumps(data,ensure_ascii=False)

@bp_factory.route('/save/<projId>', methods=['POST'])
def factorySave(projId):
    rt = False
    data = request.get_json()
    if data:
        rt = MongoConnManager.getConfigConn().factorySave(projId, data)
    return jsonify(formatResult(rt))

@bp_factory.route('/page/save/<projId>', methods=['POST'])
def factoryPageSave(projId):
    rt = False
    data = request.get_json()
    if data:
        rt = MongoConnManager.getConfigConn().factoryPageSave(projId, data)
    return jsonify(formatResult(rt))

@bp_factory.route('/page/edit/<projId>', methods=['POST'])
def factoryPageEdit(projId):
    rt = False
    data = request.get_json()
    if data:
        rt = MongoConnManager.getConfigConn().factoryPageEdit(projId, data)
    return jsonify(formatResult(rt))

@bp_factory.route('/page/delete/<projId>', methods=['POST'])
def factoryPageDelete(projId):
    rt = False
    data = request.get_json()
    if data:
        rt = MongoConnManager.getConfigConn().factoryPageDelete(projId, data)
    return jsonify(formatResult(rt))

@bp_factory.route('/material/save', methods=['POST'])
def factoryMaterialSave():
    rt = False
    data = request.get_json()
    type = data.get('type', '')
    pageType = 'PageScreen'

    if type.find('.') > -1:
        arr = data.get('type').split('.')
        type = arr[0]
        pageType = arr[1]

    # if type != 'report':
    #     findList = MongoConnManager.getConfigConn().factoryMaterialGetByInfo({'type': type, 'name': data.get('name')})
    #     if len(findList) > 0:
    #         return jsonify(formatResult(False, 'Template name already exists'))

    if type == 'page':
        pageId = data.get('pageId')
        del data['pageId']
        if not('template' in data['content']):
            if pageType == 'PageScreen':
                template = MongoConnManager.getConfigConn().factoryGetPageDetail(pageId, 1)
                data['content'].update({ 'template': json.dumps({'layers': template.get('layers'), 'widgets': template.get('widgets')}, ensure_ascii=False) })
            elif pageType == 'EnergyScreen':
                rs = MongoConnManager.getConfigConn().springGetMenu(pageId, 1)
                data['content'].update({ 'template': json.dumps( rs.get('layout', []) ) })

    rt = MongoConnManager.getConfigConn().factoryMaterialSave(data)
    return jsonify(formatResult(rt))

@bp_factory.route('/material/saveform', methods=['POST'])
def factoryMaterialSaveForm():
    rt = []
    fp = None
    dataArr = []
    files = request.files.getlist("image")

    form = request.form
    keys = form.keys()
    dataArr = [{} for i in range(len(form.getlist('_id')))]

    for key in keys:
        arr = form.getlist(key)
        for k,v in enumerate(arr):
            dataArr[k][key] = v

    for data in dataArr:

        index = dataArr.index(data)
        fp = files[index]
        id = data.get('_id')
        name = data.get('name')
        content = json.loads(data.get('content'))
        oss = OssAPI('oss.aliyuncs.com', 'iIDKdO6hyMbZVYzp', 'YFiyioy9kgizMChIfHMWtVvNnvsjVM')
        uploadpath = 'static/images/factory/widgets/' + id + name[name.find('.'):]
        uploadtooss = oss.put_object_from_fp('beopweb', uploadpath, fp, content_type=fp.content_type)
        if uploadtooss.status == 200:
            content.update({'url':'http://images.rnbtech.com.hk/'+uploadpath})
            data.update({'content':content})
            if MongoConnManager.getConfigConn().factoryMaterialSave(data):
                rt.append(uploadpath)
   
    return json.dumps(rt, ensure_ascii=False)

@bp_factory.route('/material/saveTemplateImage', methods=['POST'])
def factoryMaterialSaveTemplateImage():
    rt = False
    data = {}
    fp = None
    files = request.files.getlist("image")
    form = request.form

    fp = files[0]
    id = form.get('_id')
    name = form.get('name')
    oss = OssAPI('oss.aliyuncs.com', 'iIDKdO6hyMbZVYzp', 'YFiyioy9kgizMChIfHMWtVvNnvsjVM')
    uploadpath = 'custom/factory/material/preview/' + id + name
    uploadtooss = oss.put_object_from_fp('beopweb', uploadpath, fp, content_type=fp.content_type)
    if uploadtooss.status == 200:
        query ={
            '_id':ObjectId(form.get('_id')),
            'previewUrl':uploadpath
        }
        rt = MongoConnManager.getConfigConn().factoryMaterialEdit(query)
        if rt:
            data.update({'previewUrl':uploadpath})
    return jsonify(formatResult(rt, msg='', data = data))

@bp_factory.route('/material/showInfo', methods=['POST'])
def factoryMaterialShowInfo():
    rt = {}
    params = request.get_json()
    userId = params.get('userId')
    id = params.get('id')
    if userId and userId.isdigit():
        userName=BEOPDataAccess.getInstance().getUserNameByIdOrEmail(int(userId))
    else:
        userName=BEOPDataAccess.getInstance().getUserNameByIdOrEmail(userId)
    if userName=='':
        rt['userName'] = userId
    else:
        rt['userName'] = userName
    materialInfo = MongoConnManager.getConfigConn().factoryMaterialShowContent(id)
    rt['materialInfo'] = materialInfo

    return json.dumps(rt, ensure_ascii=False)

@bp_factory.route('/material/edit', methods=['POST'])
def factoryMaterialEdit():
    rt = False
    data = request.get_json()
    #如果data为数组类型，批量处理
    if isinstance(data,list):
        for rs in data:
            rt = MongoConnManager.getConfigConn().factoryMaterialEdit(rs)
    #如果data为对象，则保留原逻辑
    else:
        rt = MongoConnManager.getConfigConn().factoryMaterialEdit(data)
    return jsonify(formatResult(rt))

@bp_factory.route('/material/get', methods=['GET'])
@bp_factory.route('/material/get/<type>', methods=['GET'])
def factoryMaterialGet(type=None):
    data = MongoConnManager.getConfigConn().factoryMaterialGet(type)
    return json.dumps(data, ensure_ascii=False)

@bp_factory.route('/material/getByIds', methods=['POST'])
def factoryMaterialGetById():
    params = request.get_json()
    ids = params.get('ids', [])
    data = MongoConnManager.getConfigConn().factoryMaterialGetByInfo({'_id': {'$in': [ObjectId(x) for x in ids if ObjectId.is_valid(x)] }})
    return json.dumps(data, ensure_ascii=False)

@bp_factory.route('/material/group/<type>', methods=['GET'])
@bp_factory.route('/material/group/<type>/<groupId>', methods=['GET'])
def factoryMaterialGetByGroupId(type=None, groupId=None):
    cond = {}
    if type != None:
        cond['type'] = {'$regex': '^'+type+'.*$'}
    if groupId != None:
        cond['group'] = groupId
    else:
        cond['group'] = ''
    if type == 'image':
        data = MongoConnManager.getConfigConn().factoryMaterialGetByInfo(cond)
    else:
        data = MongoConnManager.getConfigConn().factoryMaterialGetByInfo(cond, {'content': 0})
    return jsonify(formatResult(True, '', data))

@bp_factory.route('/material/remove', methods=['POST'])
def factoryMaterialRemove():
    rt = False
    params = request.get_json()
    ids = params.get('ids', [])
    files = []
    filesId = []
    folders = []
    foldersId = []
    data = MongoConnManager.getConfigConn().factoryMaterialGetByInfo({'_id': {'$in': [ObjectId(x) for x in ids if ObjectId.is_valid(x)] }})
    for item in data:
        if item.get('isFolder'):
            if item.get('isFolder') == 1:
                folders.append(item)
            else:
                files.append(item)
        else:
            files.append(item)
    for item in folders:
        cond = {}
        cond['group'] = item['_id']
        groupData = MongoConnManager.getConfigConn().factoryMaterialGetByInfo(cond)
        for key in groupData:
            if key['isFolder'] == 1:
                folders.append(key)
            else:
                files.append(key)
    if files:
        imgArr = []
        for f in files:
            filesId.append(f.get('_id'))
            if f['type'] == 'image':
                imgArr.append(f.get('_id'))
        if imgArr:
            oss = OssAPI('oss.aliyuncs.com', 'iIDKdO6hyMbZVYzp', 'YFiyioy9kgizMChIfHMWtVvNnvsjVM')
            url_dict = MongoConnManager.getConfigConn().getfactoryMaterialURLByIds(imgArr)
            if url_dict:
                for key in url_dict:
                    url = url_dict.get(key)
                    if url:
                        oss.delete_object('beopweb', url_dict.get(key))
    if folders:
        foldersId = [f.get('_id') for f in folders]
    allId = filesId + foldersId
    rt = MongoConnManager.getConfigConn().factoryMaterialRemove(allId)
    return jsonify(formatResult(rt))

@bp_factory.route('/material/search', methods=['POST'])
def factoryMaterialSearch():
    cond = {}
    data = request.get_json()

    if data.get('type') != None:
        cond['type'] = {'$regex': '.*' + data.get('type') + '.*'}
    if data.get('name') != None:
        nameArr = []
        for name in data.get('name').split(' '):
            nameArr.append('(' + name + ')')
        cond['name'] = {'$regex': '.*' + '|'.join(nameArr) + '.*'}
    if data.get('id') != None:
        cond['id'] = {'$regex': '.*' + data.get('id') + '.*'}
    rs = MongoConnManager.getConfigConn().factoryMaterialGetByInfo(cond);
    return jsonify(formatResult(True, '', rs))

@bp_factory.route('/recycle',methods=['GET'])
@bp_factory.route('/recycle/<status>',methods=['GET'])
def factoryRecycleGet(status=1):
    rt = False
    status = int(status)
    data = MongoConnManager.getConfigConn().factoryRecycleGet(status)
    if data:
        rt = True
    return jsonify(formatResult(rt, 'get recycle success!', data))

@bp_factory.route('/projectRecycle',methods=['GET'])
@bp_factory.route('/projectRecycle/<status>',methods=['GET'])
def factoryProjectRecycleGet(status=1):
    rt = False
    status = int(status)
    data = MongoConnManager.getConfigConn().factoryProjectRecycleGet(status)
    if data:
        rt = True
    return jsonify(formatResult(rt, 'get projectRecycle success!', data))

@bp_factory.route('/recycle/delete',methods=['POST'])
def factoryRecycleDelete():
    data = request.get_json()
    rt = MongoConnManager.getConfigConn().factoryRecycleDelete(data)
    return jsonify(formatResult(rt))

@bp_factory.route('/projectRecycle/delete',methods=['POST'])
def factoryProjectRecycleDelete():
    data = request.get_json()
    rt = MongoConnManager.getConfigConn().factoryProjectRecycleDelete(data)
    return jsonify(formatResult(rt))

@bp_factory.route('/recycle/restore',methods=['POST'])
def factoryRecycleRestore():
    data = request.get_json()
    rt = MongoConnManager.getConfigConn().factoryRecycleRestore(data)
    return jsonify(formatResult(rt))

@bp_factory.route('/projectRecycle/restore',methods=['POST'])
def factoryProjectRecycleRestore():
    data = request.get_json()
    rt = MongoConnManager.getConfigConn().factoryProjectRecycleRestore(data)
    return jsonify(formatResult(rt))

@bp_factory.route('/template/<templateId>', methods=['GET'])
def factoryMaterialTemplateGet(templateId):
    data = MongoConnManager.getConfigConn().factoryMaterialTemplateGet(templateId)
    return jsonify(data)

@bp_factory.route('/historyShot/remove/<shotId>', methods=['GET'])
def factoryHistoryShotRemove(shotId):
    rt = MongoConnManager.getConfigConn().factoryHistoryShotRemove(shotId)
    return jsonify(formatResult(rt))

@bp_factory.route('/addProject/save', methods=['POST'])
def factoryAddProjectSave():
    data = request.get_json()
    proName = data.get('proName')
    proZhName = data.get('proZhName')
    proEnName = data.get('proEnName')
    projId = data.get('projId')
    bindId = data.get('bindId')
    userId = data.get('userId')
    timeFormat = data.get('timeFormat')
    result = ''
    msg = 'failed'
    try:
        bExist = MongoConnManager.getConfigConn().FacIsProjectExist(proName, proZhName, proEnName)
        if bExist:
            if bindId ==None:
                return jsonify({'status': 'ERROR', "msg": "project name exists"})
        rt = MongoConnManager.getConfigConn().FacIsProjectExistById(projId)
        if ObjectId.is_valid(rt):
            projId = rt
        else:
            projId = str(ObjectId())
        result = MongoConnManager.getConfigConn().EditProject(userId,projId,proName,proZhName,proEnName,bindId,timeFormat)
        return jsonify({'status': 'OK', "msg": 'successfully', 'data': {'_id': result}})
    except Exception as e:
        print('factoryAddProjectSave failed:%s'%(e.__str__(),))
        logging.error('factoryAddProjectSave failed:%s'%(e.__str__(),))
    return jsonify({'status': 'ERROR', "msg": msg})

    
@bp_factory.route('/removeProject/remove', methods=['POST'])
def factoryRemoveProject():
    rt = False
    msg = ''
    data = request.get_json()
    userId = data.get('userId')
    projId = data.get('projId')
    proPass = data.get('proPass')

    # 验证用户身份
    validate = BEOPDataAccess.getInstance().validate_user_byID({"id": userId, "pwd": proPass})
    if validate:
        rt = MongoConnManager.getConfigConn().RemoveProject(userId,projId)
        if rt == True:
            msg = 'delete project successfully'
        else:
            msg = 'failed to delete project'
    else:
        msg = 'Wrong password!'
    return jsonify(formatResult(rt, msg))

@bp_factory.route('/modifyPageList/<projId>', methods=['POST'])
def factoryModifyProject(projId):
    rt = False
    data = request.get_json()
    if 'pageList' in data:
        rt = MongoConnManager.getConfigConn().ModifyPageList(projId, data.get('pageList'))
    return jsonify(formatResult(rt))

@bp_factory.route('/importOnlineProject', methods=['POST'])
def factoryImportOnlineProject():
    rt = None
    data = request.get_json()
    projId = int(data.get('projectId'))
    userId = data.get('userId')
    newProjName = data.get('newProjName')

    # 获取项目信息
    project = BEOPDataAccess.getInstance().getProjectNameById(projId)
    project['name_en'] = newProjName
    project['name_cn'] = newProjName
    project['name_english'] = newProjName
    project['bindId'] = projId

    # 判断新的项目名称是否存在
    idExistProject = MongoConnManager.getConfigConn().FacIsProjectExist(project.get('name_en'), project.get('name_cn'), project.get('name_english'))

    if idExistProject:
        # 如果存在，isExistProject 指向的是 project id
        result = MongoConnManager.getConfigConn().factoryGetPermission(idExistProject, int(userId))
        if result.get('permission') == 0:
            userData = []
            userId = result.get('data')
            #import pdb;pdb.set_trace();
            for item in userId:
                username = BEOPDataAccess.getInstance().getUserNameById(int(item.get('userId')))
                userData.append(username)
            return jsonify({'status': 'Duplicated', 'username': userData, 'permission': result.get('permission')})
        else:
            return jsonify({'status': 'Duplicated', 'id': idExistProject, 'permission': result.get('permission')})
    
    # 获取线上项目 roleId 为 30 的用户 ID 列表
    onlineUserIds = BEOPDataAccess.getInstance().getUserIdsByProjIdAndLevel(projId, 30)
    onlineUserIds = list(set(onlineUserIds))

    # 获取菜单列表
    # import pdb; pdb.set_trace();
    navs = MongoConnManager.getConfigConn().getCustomNavByProjectId(projId)
    # 将获取到的菜单插入到 Factory 相关表中
    newProjId = MongoConnManager.getConfigConn().FacImportProject(onlineUserIds, project, navs)
    if newProjId:
        project.update({'id': str(newProjId)})
        rt = {'status': 'OK', 'data': project, 'msg': 'Import online project successfully!'}
    else:
        rt = {'status': 'ERROR', 'msg': 'failed to import, please try again later！'}
    return jsonify(rt)

@bp_factory.route('/importOnlineProjectWithMerging', methods=['POST'])
def factoryimportOnlineProjectWithMerging():
    rt = None
    data = request.get_json()
    projIdSource = int(data.get('sourceId'))
    projIdTarget = data.get('targetId')
    navIdOnline = data.get('navIdOnline')
    navIdOffline = data.get('navIdOffline')
    navIdResult = data.get('navIdResult')
    # 获取菜单列表
    navOnline = MongoConnManager.getConfigConn().getCustomNavByProjectId(projIdSource)
    navs = []
    for item in navOnline:
        if(item.get('_id') in navIdOnline):
            navs.append(item)

    # 将获取到的菜单插入到 Factory 相关表中
    ProjId = MongoConnManager.getConfigConn().FacImportProject(None, None, navs, projIdTarget, navIdOffline)
    return jsonify({'status': 'OK', 'data': ProjId})

@bp_factory.route('/reportWrap/<isFactory>', methods=['POST'])
def factorySaveReportWrap(isFactory = 1):
    rt = None
    data = request.get_json()
    pageId = data.get('pageId')
    if 'list' in data:
        reportList = data.get('list')
        if reportList:
            rt = MongoConnManager.getConfigConn().SaveToFactoryReportWrap(pageId, reportList, int(isFactory) )
    if 'data' in data:
        currentReportData = data.get('data')
        if currentReportData:
            MongoConnManager.getConfigConn().saveSpringLayout(currentReportData)
            rt = True
    if 'removeData' in data:
        removeReportData = data.get('removeData')
        if removeReportData:
            menuItemId = removeReportData.get('menuItemId')
            rt = MongoConnManager.getConfigConn().RemoveFactoryReport(menuItemId)
    return jsonify(formatResult(rt))

@bp_factory.route('/reportWrap/<isFactory>/<pageId>', methods=['GET'])
def factoryGetReportWrapInfo(pageId, isFactory = 1):
    rt = None
    # 获取报表包裹页信息
    rt = MongoConnManager.getConfigConn().GetFacrotyReportWrap(pageId, int(isFactory) )
    # 如果没有相关信息，则说明需要重新建立
    if rt == None:
        rt = {'pageId': pageId, 'list': []}
    return jsonify(rt)

@bp_factory.route('/reportData', methods=['GET'])
def factoryGetReportDataList():
    rt = None
    # 获取报表数据列表
    rt = MongoConnManager.getConfigConn().FacGetReportDataList()
    return jsonify(formatResult(True, '', rt))

@bp_factory.route('/reportData/<dataId>/<date>', methods=['GET'])
def factoryGetReportDataById(dataId, date):
    rt = None
    # 获取报表 JSON 数据
    rt = MongoConnManager.getConfigConn().FacGetReportDataByIdAndDate(dataId, date)
    if rt:
        return jsonify(formatResult(True, '', rt))
    return jsonify(formatResult(False, 'failed to acquire data！'))

@bp_factory.route('/reportDataByName', methods=['GET'])
def factoryGetReportDataByName():
    rt = None
    # 获取报表 JSON 数据
    name = request.args.get('name')
    date = request.args.get('date')
    rt = MongoConnManager.getConfigConn().FacGetReportDataByName(name,date)
    if rt:
        return jsonify(formatResult(True, '', rt))
    return jsonify(formatResult(False, 'failed to acquire data！'))

@bp_factory.route('/getReportData', methods=['GET'])
def factoryGetReportData():
    rt = None
    # 获取报表 name 和 dataId
    rt = MongoConnManager.getConfigConn().FacGetReportData()
    if rt:
        return jsonify(formatResult(True, '', rt))
    return jsonify({'data': rt})

@bp_factory.route("/get_pageid_by_name/<projId>/<pageName>", methods=["GET"])
def get_pageid_by_name(projId, pageName):
    rt = MongoConnManager.getConfigConn().GetNavIdsByName(projId, pageName)
    return jsonify({'data': rt})


@bp_factory.route('/reportData/save', methods=['POST'])
def factorySaveReportData():
    rt = None
    data = request.get_json()
    #import pdb;pdb.set_trace()
    # 参数检测
    if not ('dataId' in data):
        return jsonify(formatResult(False, '存储报表数据失败：缺少 dataId'))
    if not ('creator' in data):
        return jsonify(formatResult(False, '存储报表数据失败：缺少 creator'))
    if not ('date' in data):
        return jsonify(formatResult(False, '存储报表数据失败：缺少 date'))
    
    if not ObjectId.is_valid( data.get('dataId') ):
        return jsonify(formatResult(False, '存储报表数据失败：dataId 不是有效的 ObjectId 类型'))

    # 保存动态报表数据
    rt = MongoConnManager.getConfigConn().FacSaveReportData(data)
    if rt:
        return jsonify(formatResult(True, '存储报表数据成功', rt))
    return jsonify(formatResult(False, '存储报表数据失败：存入数据库时发生错误'))


#获取项目的所有报表包裹页
@bp_factory.route('/getFirstLevelReports/<projectId>', methods=['GET'])
def factoryGetFirstLevelReports(projectId):
    rt = None
    # 获取报表包裹页信息
    rt = MongoConnManager.getConfigConn().GetFirstLevelReports(projectId)
    # 如果没有相关信息，则说明需要重新建立
    if rt == None:
        rt = {'pageId': pageId, 'list': []}
    return jsonify({'data': rt})


@bp_factory.route('/test', methods=['GET'])
def factoryTest():
   #rt = MongoConnManager.getConfigConn().Do3()
   return jsonify(formatResult(True))


#20160704 勿删 升级数据结构
#@bp_factory.route('/updateWeightAndLayerStruct', methods=['GET'])
#def updateWeightAndLayerStruct():
#    projects = MongoConnManager.getConfigConn().mdbBb['Fac_Navigation'].find({})
#    for project in projects:
#        idProj = project.get('_id')
#        idPages = project.get('list')
#        for idPage in idPages:
#            page = MongoConnManager.getConfigConn().mdbBb['Fac_Page'].find_one({'_id': ObjectId(idPage)})
#            if page is None: continue
#            idLayers = page.get('layerList')

#            ##升级page, 增加projId属性  
#            #MongoConnManager.getConfigConn().mdbBb['Fac_Page'].update({
#            #    '_id': ObjectId(idPage)
#            #}, {   "$set" : {     
#            #    "projId": str(idProj),                #20160704, 新增, 所在页面ID
#            #}})

#            if idLayers is None: continue
#            for idLayer in idLayers:
#                layer = MongoConnManager.getConfigConn().mdbBb['Fac_Layer'].find_one({'_id': ObjectId(idLayer)})
#                if layer is None: continue
#                idWidgets = layer.get('list')

#                ##转移背景图层设置Fac_layer.option到Fac_Page.option.background中
#                ##typeLayer = layer.get('type')
#                ##if(typeLayer == 'bg'):
#                ##    optionLayer = layer.get('option')
#                ##    #升级page, bg属性
#                ##    MongoConnManager.getConfigConn().mdbBb['Fac_Page'].update({
#                ##        '_id': ObjectId(idPage)
#                ##    }, {   "$set" : {     
#                ##        "option": {'background': optionLayer}
#                ##    }})

#                ##升级layer
#                #MongoConnManager.getConfigConn().mdbBb['Fac_Layer'].update({
#                #    '_id': ObjectId(idLayer)
#                #}, {   "$set" : {     
#                #    "parentId" : "",             #20160704, 新增, 父元素ID, 为空则为根目录显示
#                #    "pageId": idPage,                #20160704, 新增, 所在页面ID
#                #}})

#                #if idWidgets is None: continue
#                #for idWidget in idWidgets:
#                #    #升级widget
#                #    MongoConnManager.getConfigConn().mdbBb['Fac_Widget'].update({
#                #        '_id': ObjectId(idWidget)
#                #    }, { "$set" : {
#                #        "layerId" : idLayer,              #20160704, 修改, 父元素ID, 为空则为根目录显示
#                #        "pageId": idPage,                #20160704, 新增, 所在页面ID
#                #    }})
        
#    #rt = MongoConnManager.getConfigConn().updateWeightAndLayerStruct();
#    return jsonify({'data': True})

#导出某项目的所有s3db页面到指定webfactory项目中
@bp_factory.route('/transformS3dbIntoPageScreen/<srcProjId>/<tarProjId>', methods=['GET'])
def transformS3dbIntoPageScreen(srcProjId, tarProjId):
    rt = BEOPDataAccess.getInstance().transformS3dbIntoPageScreen(srcProjId, tarProjId);
    return jsonify({'data': rt}) 