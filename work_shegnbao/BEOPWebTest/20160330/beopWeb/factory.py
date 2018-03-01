"""
Routes and views for the flask application.
"""

from beopWeb import app
from beopWeb.BEOPDataAccess import *
from flask import request, url_for, redirect, render_template, json, jsonify
from datetime import datetime, timedelta
import time
import subprocess
import mysql.connector
from beopWeb.MongoConnManager import MongoConnManager
from beopWeb.mod_memcache.MemcacheManager import MemcacheManager
from beopWeb.BEOPMySqlDBContainer import *
from beopWeb.BEOPMySqlDBReadOnlyContainer import *
from beopWeb.mod_admin import ProjectPermission, MenuConfigure
import copy

wmysql = BEOPMySqlDBContainer()
rmysql = BEOPMySqlDBReadOnlyContainer()

def getDumpStringByBool(b, msg=''):
    if b:
        return {"status": 'OK', "msg": msg}
    else:
        return {"status": 'ERROR', "msg": msg}

def factorCheckProjName(projName):
    try:
        projectInfoList = MemcacheManager.get('projectInfoList')
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
        print('interface factorCheckProjName error:'+e.__str__())
        logging.error('interface factorCheckProjName error:'+e.__str__())
    return True

@app.route('/factory')
def factory():
    token = None
    if app.config.get('URL_CHECK'):
        # 拿到 token
        token = request.cookies.get('token')
    if token:
        return render_template('indexFactory.html',
        title='Factory Page', token=token)
    else:
        return render_template('indexFactory.html',
        title='Factory Page')

@app.route('/factory/preview/<templateId>', methods=['POST'])
def factoryTemplatePreview(templateId):
    # import pdb; pdb.set_trace()
    params = request.form['params']
    return render_template('indexFactoryPreview.html',
        pageInfo=json.dumps({"params": params, "templateId": templateId, "type": "PageScreen"}))

@app.route('/factory/preview/<pageId>', methods=['GET'])
def factoryPreview(pageId):
    page = MongoConnManager.getConfigConn().GetPageInfoByIds([pageId])[0]
    if page is None:
        return ''
    page.update({'_id': page.get('_id').__str__()})
    
    return render_template('indexFactoryPreview.html',
        pageInfo=json.dumps(page))

@app.route('/factory/publish', methods=['POST'])
def factoryPublish():
    rt = True

    data = request.get_json()
    sourceId = data.get('sourceId')
    targetId = data.get('targetId')
    type = data.get('type')
    projId = data.get('projId')
    userId = data.get('userId', 1)
    pwd = data.get('password')
    projName = data.get('projName')

    projectInfoList = MemcacheManager.get('projectInfoList')

    # 验证用户权限
    validate = BEOPDataAccess.getInstance().validate_user_byID({"id": userId, "pwd": pwd})
    if validate is None:
        return jsonify(getDumpStringByBool(False, '密码错误'))

    is_new_project = False
    inserted_project_role = None

    if int(type) == 0:
        if not factorCheckProjName(projName):
            return jsonify(getDumpStringByBool(False, '项目名称已存在'))#error='projName=%s is already exists.'%(projName,)
        if ObjectId.is_valid(sourceId):
            sourceProjDetailList = MongoConnManager.getConfigConn().GetProjectFromIdLists([sourceId])
            detail = {}
            if sourceProjDetailList:
                detail = sourceProjDetailList[0]
            for item in projectInfoList:
                if int(item.get('id')) == int(targetId):
                    sql = "update project set update_time='%s' where id=%d"%\
                          (detail.get('update_time', datetime.now()).strftime('%Y-%m-%d %H:%M:%S'),int(targetId))
                    if not wmysql.op_db_update(app.config.get('DATABASE'), sql, ()):
                        return jsonify(getDumpStringByBool(False))
                    else:
                        MongoConnManager.UpdateProjectInfo()
                    break
            else:
                sql = "insert into project(name_en, name_cn, s3dbname, mysqlname,update_time,latlng," \
                      "address,name_english,weather_station_id,pic,collectionname) values " \
                      "('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', %d, '%s','%s')" % \
                      (projName, projName, detail.get('s3dbname',''), detail.get('mysqlname',''),
                       detail.get('update_time', datetime.now()).strftime('%Y-%m-%d %H:%M:%S'),
                       detail.get('latlnt','0.0,0.0'), detail.get('address',''), detail.get('name_english',''), detail.get('weather_station_id',0),
                       detail.get('pic',''), detail.get('collectionname',''))
                targetId = wmysql.op_db_update_with_id(app.config.get('DATABASE'), 'project', sql)
                is_new_project = True

            if is_new_project:
                if targetId and targetId != -1:
                    MongoConnManager.UpdateProjectInfo()
                    success, inserted_project_role = ProjectPermission.insert_project_role(targetId, 'Project Creator')
                    if success:
                        ProjectPermission.insert_role_user(userId, inserted_project_role.get('id'))
                else:
                    return jsonify(getDumpStringByBool(False))
            mc = MenuConfigure()
            if is_new_project:
                all_project_roles = [inserted_project_role.get('id')]
            else:
                all_project_roles = mc.get_project_roles(targetId)

            if MongoConnManager.getConfigConn().RemoveProjectPublish(int(targetId)):
                pageList = MongoConnManager.getConfigConn().factoryGetPageList(sourceId, 1)
                page_id_list = [x.get('_id') for x in pageList]
                if MongoConnManager.getConfigConn().SaveToObNavigation(int(targetId), page_id_list):
                    mc.update_page_menu(targetId, all_project_roles, page_id_list)
                else:
                    return jsonify(getDumpStringByBool(False))
                insertPageList = []
                for item in pageList:
                    item.update({'_id':ObjectId(item.get('_id'))})
                    insertPageList.append(item)
                if not MongoConnManager.getConfigConn().SaveToObPage(insertPageList):
                    return jsonify(getDumpStringByBool(False))
                for page in pageList:
                    pageDetail = MongoConnManager.getConfigConn().factoryGetPageDetail(page.get('_id'), 1)
                    if not MongoConnManager.getConfigConn().SaveToObLayer(pageDetail.get('layers', [])):
                        return jsonify(getDumpStringByBool(False))
                    if not MongoConnManager.getConfigConn().SaveToObWidget(pageDetail.get('widgets', [])):
                        return jsonify(getDumpStringByBool(False))
        else:
            rt = False
    elif int(type) == 1:
        # import pdb;pdb.set_trace();
        if projId:
            pageList = MongoConnManager.getConfigConn().GetPageInfoByIds([sourceId])
            if pageList:
                if len(pageList) == 1:
                    if not MongoConnManager.getConfigConn().SaveToObNavigation(int(projId), [targetId]):
                        return jsonify(getDumpStringByBool(False))
                    insertPageList = []
                    pageList[0].update({'_id':ObjectId(targetId)})
                    insertPageList.append(pageList[0])
                    if not MongoConnManager.getConfigConn().SaveToObPage(insertPageList):
                        return jsonify(getDumpStringByBool(False))
                    pageDetail = MongoConnManager.getConfigConn().factoryGetPageDetail(sourceId, 1)
                    if not MongoConnManager.getConfigConn().SaveToObLayer(pageDetail.get('layers', [])):
                        return jsonify(getDumpStringByBool(False))
                    if not MongoConnManager.getConfigConn().SaveToObWidget(pageDetail.get('widgets', [])):
                        return jsonify(getDumpStringByBool(False))
    return jsonify(getDumpStringByBool(rt))


@app.route('/factory/getProjectList/<userId>', methods=['GET'])
def factoryGetProjectList(userId):
    data =  MongoConnManager.getConfigConn().factoryGetProjectList(int(userId))
    return jsonify({"data":data})

@app.route('/factory/getProjectUser/<projId>', methods=['GET'])
def factoryGetProjectUser(projId):
    data =  MongoConnManager.getConfigConn().factoryGetProjectUser(projId)
    return jsonify({"data":data})

@app.route('/factory/updateProjectAuth', methods=['POST'])
def factoryUpdateProjectAuth():
    rt = False
    data = request.get_json()
    rt = MongoConnManager.getConfigConn().factoryUpdateProjectAuth( data.get('projId'), data.get('userIds') )
    return jsonify(getDumpStringByBool(rt))

@app.route('/factory/getPageList/<projId>', methods=['GET'])
@app.route('/factory/getPageList/<projId>/<isFactory>', methods=['GET'])
def factoryGetPageList(projId, isFactory=0):
    data = MongoConnManager.getConfigConn().factoryGetPageList(projId, int(isFactory))
    return jsonify({"data":data})

@app.route('/factory/getPageDetail/<pageId>', methods=['GET'])
@app.route('/factory/getPageDetail/<pageId>/<isFactory>', methods=['GET'])
def factoryGetPageDetail(pageId, isFactory=0):
    isFactory = int(isFactory)
    page = MongoConnManager.getConfigConn().GetPageInfoByIds([pageId], isFactory)[0]
    if page:
        page.update({'_id': page.get('_id').__str__()})
    data = MongoConnManager.getConfigConn().factoryGetPageDetail(pageId, isFactory)
    return jsonify({'page': page, 'data': data})


@app.route('/factory/historyShot/save', methods=['POST'])
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

@app.route('/factory/historyShot/edit', methods=['POST'])
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
    return jsonify(getDumpStringByBool(data))

@app.route('/factory/historyShot/getDetail/<historyShotid>', methods=['GET'])
def factoryHistoryShotGetDetail(historyShotid):
    data = MongoConnManager.getConfigConn().factoryHistoryShotGetDetail(historyShotid)
    return jsonify(data)

@app.route('/factory/projSprite/add/<projId>', methods=['POST'])
def factoryAddProjSprite(projId):
    rt = False
    rec = request.get_json()
    if rec:
        spriteIdList = MongoConnManager.getConfigConn().AddToSprite(rec)
        rt = MongoConnManager.getConfigConn().AddProjSprite(projId, spriteIdList)
    return jsonify(getDumpStringByBool(rt))

@app.route('/factory/projSprite/remove/<projId>', methods=['POST'])
def factoryRemoveProjSprite(projId):
    rt = False
    rec = request.get_json()
    if rec:
        rt = MongoConnManager.getConfigConn().RemoveProjSprite(projId, rec)
    return jsonify(getDumpStringByBool(rt))

@app.route('/factory/projSprite/get/<projId>', methods=['GET'])
def factoryGetProjSprite(projId):
    data = MongoConnManager.getConfigConn().GetProjSprite(projId)
    return json.dumps(data,ensure_ascii=False)

@app.route('/factory/save/<projId>', methods=['POST'])
def factorySave(projId):
    rt = False
    data = request.get_json()
    if data:
        rt = MongoConnManager.getConfigConn().factorySave(projId, data)
    return jsonify(getDumpStringByBool(rt))

@app.route('/factory/material/save', methods=['POST'])
def factoryMaterialSave():
    rt = False
    data = request.get_json()
    if data.get('type') == 'page':
        pageId = data.get('pageId')
        del data['pageId']
        if not('template' in data['content']):
            template = MongoConnManager.getConfigConn().factoryGetPageDetail(pageId, 1)
            data['content'].update({ 'template': json.dumps({'layers': template.get('layers'), 'widgets': template.get('widgets')}, ensure_ascii=False) })
    rt = MongoConnManager.getConfigConn().factoryMaterialSave(data)
    return jsonify(getDumpStringByBool(rt))

@app.route('/factory/material/saveform', methods=['POST'])
def factoryMaterialSaveForm():
    rt = ''
    fp = None
    data = {}
    file = request.files.getlist("image")
    rv = request.form
    for key in rv.keys():
        data[key] = rv.get(key)
    if 'content' in data:
        data['content'] = json.loads(data['content'])
    if data and file:
        if len(file) == 1:
            fp = file[0]
            id = data.get('_id')
            name = data.get('name')
            content = data.get('content')
            oss = OssAPI('oss.aliyuncs.com', 'iIDKdO6hyMbZVYzp', 'YFiyioy9kgizMChIfHMWtVvNnvsjVM')
            uploadpath = 'static/images/factory/widgets/' + id + name[name.find('.'):]
            uploadtooss = oss.put_object_from_fp('beopweb', uploadpath, fp, content_type=fp.content_type)
            if uploadtooss.status == 200:
                content.update({'url':'http://images.rnbtech.com.hk/'+uploadpath})
                data.update({'content':content})
                if MongoConnManager.getConfigConn().factoryMaterialSave(data):
                    rt = uploadpath
    return json.dumps(rt, ensure_ascii=False)

@app.route('/factory/material/edit', methods=['POST'])
def factoryMaterialEdit():
    rt = False
    data = request.get_json()
    if data:
        rt = MongoConnManager.getConfigConn().factoryMaterialEdit(data)
    return jsonify(getDumpStringByBool(rt))

@app.route('/factory/material/get', methods=['GET'])
@app.route('/factory/material/get/<type>', methods=['GET'])
def factoryMaterialGet(type=None):
    data = MongoConnManager.getConfigConn().factoryMaterialGet(type)
    return json.dumps(data, ensure_ascii=False)

@app.route('/factory/template/<templateId>', methods=['GET'])
def factoryMaterialTemplateGet(templateId):
    # import pdb;pdb.set_trace()
    data = MongoConnManager.getConfigConn().factoryMaterialTemplateGet(templateId)
    return jsonify(data)

@app.route('/factory/material/remove', methods=['POST'])
def factoryMaterialRemove():
    rt = False
    data = request.get_json()
    ids = data.get('ids')
    if ids:
        oss = OssAPI('oss.aliyuncs.com', 'iIDKdO6hyMbZVYzp', 'YFiyioy9kgizMChIfHMWtVvNnvsjVM')
        url_dict = MongoConnManager.getConfigConn().getfactoryMaterialURLByIds(ids)
        if url_dict:
            for key in url_dict:
                url = url_dict.get(key)
                if url:
                    oss.delete_object('beopweb', url_dict.get(key))
        rt = MongoConnManager.getConfigConn().factoryMaterialRemove(ids)
    return jsonify(getDumpStringByBool(rt))

@app.route('/factory/historyShot/remove/<shotId>', methods=['GET'])
def factoryHistoryShotRemove(shotId):
    rt = MongoConnManager.getConfigConn().factoryHistoryShotRemove(shotId)
    return jsonify(getDumpStringByBool(rt))

@app.route('/factory/addProject/save', methods=['POST'])
def factoryAddProjectSave():
    result=''
    data = request.get_json()
    userId = data.get('userId')
    proName = data.get('proName')
    proZhName = data.get('proZhName')
    proEnName = data.get('proEnName')
    msg = '新增项目失败'

    # 判断项目名称是否存在
    isExist = MongoConnManager.getConfigConn().FacIsProjectExist(proName,proZhName,proEnName);
    if isExist:
        msg = '项目名称已存在'
    else:
        if data:
            result = MongoConnManager.getConfigConn().AddNewProject(userId,proName,proZhName,proEnName)
            if result:
                return jsonify({'status': 'OK', "msg": '新增项目成功', 'data': {'_id': result}})

    return jsonify({'status': 'ERROR', "msg": msg})

@app.route('/factory/removeProject/remove', methods=['POST'])
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
            msg = '删除项目成功'
        else:
            msg = '删除项目失败'
    else:
        msg = '密码错误！'
    return jsonify(getDumpStringByBool(rt, msg))

@app.route('/factory/modifyPageList/<projId>', methods=['POST'])
def factoryModifyProject(projId):
    rt = False
    data = request.get_json()
    if 'pageList' in data:
        rt = MongoConnManager.getConfigConn().ModifyPageList(projId, data.get('pageList'))
    return jsonify(getDumpStringByBool(rt))

@app.route('/factory/importOnlineProject', methods=['POST'])
def factoryImportOnlineProject():
    rt = None
    data = request.get_json()
    projId = data.get('projectId')
    userId = data.get('userId')
    newProjName = data.get('newProjName')

    # 获取项目信息
    project = BEOPDataAccess.getInstance().getProjectNameById(projId)
    project['name_en'] = newProjName
    project['name_cn'] = newProjName
    project['name_english'] = newProjName

    # 判断新的项目名称是否存在
    isExist = MongoConnManager.getConfigConn().FacIsProjectExist(project.get('name_en'), project.get('name_cn'), project.get('name_english'))

    if isExist:
        return jsonify({'status': 'ERROR', 'msg': '新的项目名称已存在！'})

    # 获取菜单列表
    # import pdb; pdb.set_trace();
    navs = MongoConnManager.getConfigConn().getCustomNavByProjectId(projId)
    # 将获取到的菜单插入到 Factory 相关表中
    newProjId = MongoConnManager.getConfigConn().FacImportProject(userId, project, navs)
    if newProjId:
        project.update({'id': str(newProjId)})
        rt = {'status': 'OK', 'data': project}
    else:
        rt = {'status': 'ERROR', 'msg': '导入失败，请稍后重试！'}
    return jsonify(rt)