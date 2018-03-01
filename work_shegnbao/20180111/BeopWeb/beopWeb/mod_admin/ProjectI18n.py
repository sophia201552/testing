from beopWeb import app
import logging
from flask import json, jsonify
from datetime import datetime, timedelta
from beopWeb.BEOPDataAccess import BEOPDataAccess
from flask import request
from beopWeb.MongoConnManager import MongoConnManager, g_table_workflow_task
from beopWeb.mod_common.Utils import *


db = MongoConnManager.getConfigConn().mdbBb['I18n_Project']


@app.route('/getProjectI18n/<id>', methods=['GET'])
def get_project_i18n(id):
    rt = False
    try:
        cursor = db.find_one({'projectId':int(id)})
        if cursor:
            rt = {
                'projectId':cursor.get('projectId'),
                'resource':cursor.get('resource')
            }
    except Exception as e:
        print('get project i18n failed')
        print(e.__str__())
        logging.error(e.__str__())
        logging.exception(e)
        return Utils.beop_response_error(msg='get project i18n failed:' + e.__str__())
    if (not rt) :
        return Utils.beop_response_error(msg='get project i18n failed: no data')
    return Utils.beop_response_success(rt)


# 设置针对项目的国际化语言
# POST
# param:
# {
#       'id':int -- projectId
#       'resource':dict --resource
#       'lang':str --language  可省略，省略则将resource整体替换，不省略则单独替换某种语言
#  }
@app.route('/setpRrojectI18n', methods=['POST'])
def set_project_i18n():
    data = request.get_json()
    return do_set_project_i18n(data)

def do_set_project_i18n(data):
    resource = data.get('resource')
    id = data.get('id')
    lang = data.get('lang')
    key = "resource"
    if (lang):
        key = 'resource.' + lang
    rt = False
    if (id and resource):
        try:
            cursor = db.update_one({'projectId': int(id)}, {'$set': {'projectId': int(id), key: resource}}, True)
            if cursor:
                rt = True
        except Exception as e:
            print('set project i18n failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)

            return Utils.beop_response_error(msg='set project i18n failed:' + e.__str__())
    else:
        return Utils.beop_response_error(msg='set project i18n failed: not valid id and resource get')
    return Utils.beop_response_success(rt)