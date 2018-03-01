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
        if isinstance(parentlist, list):
            if len(parentlist) == 0:
                rtProjects = MongoConnManager.getConfigConn().get_iot_project()
            else:
                for parent in parentlist:
                    if parent.get('type') == 'projects':
                        rtGroups = MongoConnManager.getConfigConn().get_iot_group(parent.get('id'))
                    elif parent.get('type') == 'groups':
                        rtGroups = MongoConnManager.getConfigConn().get_iot_group_by_prtid(parent.get('id'))
                        rtThings = MongoConnManager.getConfigConn().get_iot_things(parent.get('id'))

        i18n = I18n('cn')

        resProjects = parseIotToJson("projects", rtProjects, dictClass, i18n)
        resGroups = parseIotToJson("groups", rtGroups, dictClass, i18n)
        resThings = parseIotToJson("things", rtThings, dictClass, i18n)
    except Exception as e:
        print('search error:' + e.__str__())
        logging.error('search error:' + e.__str__())
    return jsonify({"class": dictClass, "projects": resProjects, "groups": resGroups, "things": resThings})


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