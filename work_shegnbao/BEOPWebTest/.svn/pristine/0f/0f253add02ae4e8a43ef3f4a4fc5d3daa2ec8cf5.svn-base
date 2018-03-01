from flask import request, json, jsonify
from beopWeb import app
from beopWeb.mod_iot import bp_iot
from datetime import datetime
from beopWeb.MongoConnManager import *
import logging
import pymongo
from bson.objectid import ObjectId
from .i18n import I18n


@bp_iot.route('/search', methods=['POST'])
def search():
    dictClass = {"projects": {}, "groups": {}, "things": {}}
    rtProjects = []
    rtGroups = []
    rtThings = []
    try:
        data = request.get_json()
        parentlist = data.get('parent')
        projIdlist = data.get('projId', [])
        if isinstance(parentlist, list) and isinstance(projIdlist, list):
            if len(parentlist) == 0:
                rtProjects = MongoConnManager.getConfigConn().get_iot_project(projIdlist)
            else:
                for parent in parentlist:
                    if parent.get('type') == 'projects':
                        rtGroups = MongoConnManager.getConfigConn().get_iot_group(parent.get('id'), projIdlist)
                    elif parent.get('type') == 'groups':
                        rtGroups = MongoConnManager.getConfigConn().get_iot_group_by_prtid(parent.get('id'), projIdlist)
                        rtThings = MongoConnManager.getConfigConn().get_iot_things(parent.get('id'), projIdlist)
        i18n = I18n('cn')

        resProjects = parseIotToJson("projects", rtProjects, dictClass, i18n)
        resGroups = parseIotToJson("groups", rtGroups, dictClass, i18n)
        resThings = parseIotToJson("things", rtThings, dictClass, i18n)
    except Exception as e:
        print('search error:' + e.__str__())
        logging.error('search error:' + e.__str__())
    return jsonify({"class": dictClass, "projects": resProjects, "groups": resGroups, "things": resThings})

@bp_iot.route('/search/byid', methods=['POST'])
def search_by_id():
    dictClass = {"projects": {}, "groups": {}, "things": {}}
    rtProjects = []
    rtGroups = []
    rtThings = []
    try:
        data = request.get_json()
        idlist = data.get('id', [])
        baseType = data.get('baseType', [])
        if len(baseType) == 0:
            rtThings = MongoConnManager.getConfigConn().get_iot_things_by_id(idlist)
            rtGroups = MongoConnManager.getConfigConn().get_iot_groups_by_id(idlist)
            rtProjects = MongoConnManager.getConfigConn().get_iot_projects_by_id(idlist)
        else:
            for type in baseType:
                if type == 'projects':
                    rtProjects = MongoConnManager.getConfigConn().get_iot_projects_by_id(idlist)
                elif type == 'groups':
                    rtGroups = MongoConnManager.getConfigConn().get_iot_groups_by_id(idlist)
                elif type == 'things':
                    rtThings = MongoConnManager.getConfigConn().get_iot_things_by_id(idlist)
        i18n = I18n('cn')

        resProjects = parseIotToJson("projects", rtProjects, dictClass, i18n)
        resGroups = parseIotToJson("groups", rtGroups, dictClass, i18n)
        resThings = parseIotToJson("things", rtThings, dictClass, i18n)
    except Exception as e:
        print('search_by_id error:' + e.__str__())
        logging.error('search_by_id error:' + e.__str__())
    return jsonify({"class": dictClass, "projects": resProjects, "groups": resGroups, "things": resThings})

def screen_by_idlist(list_1, list_2):
    rt = []
    try:
        if isinstance(list_1, list) and isinstance(list_2, list):
            for x in list_1:
                if x.get('_id').__str__() in list_2:
                    rt.append(x)
    except Exception as e:
        print('screen_by_idlist error:' + e.__str__())
        logging.error('screen_by_idlist error:' + e.__str__())
    return rt

def parseIotToJson(strType, arr, dictClass, i18n):
    arrResult = []
    try:
        for params in arr:
            className = params.get('type')
            cls = app.fac.new(className)
            if(cls == {}): continue
            else: cls =cls(params)

            arrResult.append(cls.toJson())

            if(dictClass[strType].get(className) == None):
                dictClass[strType][className] = cls.getClass(i18n)
    except Exception as e:
        print('parseIotToJson error:' + e.__str__())
        logging.error('parseIotToJson error:' + e.__str__())
    return arrResult


@bp_iot.route('/getClassFamily/<type>/<lang>', methods=['GET'])
def getClassFamily(type, lang): 
    i18n = I18n(lang)
    dict = app.fac.getClassFamily(type)

    dictClass = {}
    for clsName in dict:
        dictClass[clsName] = dict[clsName]({}).getClass(i18n)
    return jsonify(dictClass)


@bp_iot.route('/getClassDetail/<type>/<lang>', methods=['GET'])
def getClassDetail(type, lang):
    i18n = I18n(lang)
    dictDetail = {}
    cls = app.fac.getClassDetail(type)({})
    dictDetail['config'] = cls.getClass(i18n)
    if (cls.getSkin(i18n) is not None):
        dictDetail['skin'] = cls.getSkin(i18n)
    return jsonify(dictDetail)

@bp_iot.route('/setIotInfo', methods=['POST'])
def setIotInfo():
    rt = []
    data = request.get_json()
    try:
        if isinstance(data, list):
            for x in data:
                if x.get('baseType') == 'things':
                    item = {'_id':x.get('_id'), 'projId':int(x.get('projId')) if x.get('projId') is not None else None,
                            'arrIdGrp':x.get('pId') if isinstance(x.get('pId'), list) else [x.get('pId')],
                            'prefix':x.get('prefix'), 'arrP':x.get('arrP') if isinstance(x.get('arrP'), dict) else {},
                            'path':x.get('path'), 'name':x.get('name'), 'type':x.get('type'),
                            'params':x.get('params') if not x.get('params') is None else None}
                    res = MongoConnManager.getConfigConn().set_iot_things(item)
                    rt.append(res)
                elif x.get('baseType') == 'groups':
                    item = {'_id':x.get('_id'), 'projId':int(x.get('projId')) if x.get('projId') is not None else None,
                            '_idProj':x.get('_idProj'), '_idPrt':x.get('pId'),
                            'prefix':x.get('prefix'), 'arrP':x.get('arrP') if isinstance(x.get('arrP'), dict) else {},
                            'name':x.get('name'), 'type':x.get('type'), 'weight':x.get('weight'),
                            'params':x.get('params') if not x.get('params') is None else None}
                    res = MongoConnManager.getConfigConn().set_iot_groups(item)
                    rt.append(res)
    except Exception as e:
        print('setIotInfo error:' + e.__str__())
        logging.error('setIotInfo error:' + e.__str__())
    return jsonify(data = rt)

@bp_iot.route('/delIotInfo', methods = ['POST'])
def delIotInfo():
    rt = False
    data = request.get_json()
    try:
        for item in data:
            if item.get('id'):
                if item.get('type') == 'things':
                    rt = MongoConnManager.getConfigConn().del_iot_things(item.get('id'))
                elif item.get('type') == 'groups':
                    rt = MongoConnManager.getConfigConn().del_iot_groups(item.get('id'))
                elif item.get('type') == 'ThingPart':
                    rt =MongoConnManager.getConfigConn().del_asset_part(item.get('id'))
                else:
                    raise Exception('The data format error')
    except Exception as e:
        print('delIotInfo error:' + e.__str__())
        logging.error('delIotInfo error:' + e.__str__())
    return jsonify(data = rt)

@bp_iot.route('/fuzzysearch', methods = ['POST'])
def fuzzysearch():
    rt = []
    data = request.get_json()
    searchName = data.get('searchName')
    projId = data.get('projId')
    try:
        rt = MongoConnManager.getConfigConn().get_iot_groups_things_fuzzy(projId, searchName)
    except Exception as e:
        print('fuzzysearch error:' + e.__str__())
        logging.error('fuzzysearch error:' + e.__str__())
    return jsonify(data = rt)


#20160606 从Asset_ProjectConfig表中获取项目对应的class列表
#return 同/getClassFamily/<type>/<lang>
@bp_iot.route('/getClassFamilyByProjId/<projId>/<type>/<lang>', methods=['GET'])
def getClassFamilyByProjId(projId, type, lang): 
    #i18n = I18n(lang)
    #dict = app.fac.getClassFamily(type)
    #dictClass = {}
    #for clsName in dict:
    #    dictClass[clsName] = dict[clsName]({}).getClass(i18n)
    #Todo 筛选分类
    dictClass = {}
    try:
        i18n = I18n(lang)
        dictTypeClass = app.fac.getClassFamily(type)
        projConfig = MongoConnManager.getConfigConn().get_iot_projconfig_by_id(projId)
        if 'dictClass' in projConfig.keys():
            dict = projConfig.get('dictClass')
            for clsName in dict.keys():
                try:
                    dictClass[clsName] = dictTypeClass[clsName]({}).getClass(i18n)
                except: continue;
    except Exception as e:
        print('mod_iot.getClassFamilyByProjId error:' + e.__str__())
        logging.error('mod_iot.getClassFamilyByProjId error:' + e.__str__())
    return jsonify(dictClass)


#20160606 向Asset_ProjectConfig表中增改数据
#"_id"为空插入，不为空根据"_id"更新
@bp_iot.route('/saveProjectConfig/<projId>', methods=['POST'])
def saveClassByProjId(projId):
    rt = ''
    data = request.get_json()
    if data:
        try:
            rt = MongoConnManager.getConfigConn().update_iot_projconfig_by_projId(projId, data)
        except Exception as e:
            print('mod_iot.saveClassByProjId error:' + e.__str__())
            logging.error('mod_iot.saveClassByProjId error:' + e.__str__())
    return jsonify(data = rt)

#20160606 获取项目配置 projId为IOT中的projectId,ObjectId类型
@bp_iot.route('/getProjectConfig/<iotProjId>', methods=['GET'])
def getProjectConfig(iotProjId):
    try:
        rt = MongoConnManager.getConfigConn().get_iot_projconfig_by_id(iotProjId)
    except Exception as e:
        print('mod_iot.getProjectConfig error:' + e.__str__())
        logging.error('mod_iot.getProjectConfig error:' + e.__str__())
    return jsonify(data = rt)


#20160919 设置iot项目节点对象
@bp_iot.route('/setIotProject', methods=['POST'])
def setIotProject():
    data = request.get_json()
    rt = {'status':'fail'}
    try:
        rt = MongoConnManager.getConfigConn().set_iot_project(data)
    except Exception as e:
        print('mod_iot.setIotProject error:' + e.__str__())
        logging.error('mod_iot.setIotProject error:' + e.__str__())
    return jsonify(rt)