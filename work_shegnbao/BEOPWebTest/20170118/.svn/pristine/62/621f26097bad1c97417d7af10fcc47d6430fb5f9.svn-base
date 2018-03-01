#coding=utf-8
from flask import request, json, jsonify
import logging, requests

from beopWeb import app
from beopWeb.mod_appCommon import bp_appCommon
from beopWeb.BEOPDataAccess import  *


@bp_appCommon.route('/getVersion/<name>/<version>', methods=['GET'])
def getVersion(name, version):
    dbAccess = BEOPDataAccess.getInstance()
    strSQL = 'SELECT * FROM version WHERE name="%s" and version<>"%s"'%(name, version)
    rt = dbAccess._mysqlDBContainerReadOnly.op_db_query_one('beopdoengine', strSQL, ())
    data = {}
    if len(rt) > 0:
        data = {
                'name': rt[0],
                'version': rt[1],
                'time': rt[2],
                'url': rt[3],
                'detail': rt[4]
            }

    return jsonify(data)

@bp_appCommon.route('/sendMessage', methods=['POST'])
def sendMessage():
    '''
    post_data = {'message':'', 'title':'', 'alert':None
                 'userId_list':[], 'projId_list':[], 'registration_id':[]}
    '''
    rt = {'state':0, 'error':None}
    post_data = request.get_json()
    send_data = {}
    try:
        if post_data:
            message = post_data.get('message', '')
            title = post_data.get('title', '')
            alert = post_data.get('alert', '')
            userId_list = post_data.get('userId_list', [])
            projId_list = post_data.get('projId_list', [])
            registration_id_list = post_data.get('registration_id', [])
            if isinstance(userId_list, list):
                if len(userId_list) > 0:
                    send_data.update({'audience':{'alias':userId_list}})
            if isinstance(projId_list, list):
                if len(projId_list) > 0:
                    send_data.update({'audience':{'tag':projId_list}})
            if isinstance(registration_id_list, list):
                if len(registration_id_list) > 0:
                    send_data.update({'audience':{'registration_id':registration_id_list}})
            if title is None:
                send_data.update({'message':{'msg_content':message, 'title':alert},
                                  'notification':{'ios':{'alert':alert, 'extras':{'message':message}},
                                                  'android':{'alert':alert, 'extras':{'message':message}}},
                                  'type':'app'})
            else:
                send_data.update({'notification':{'ios':{'alert':alert, 'extras':{'message':message}, 'title':title},
                                                  'android':{'alert':alert, 'extras':{'message':message}, 'title':title}},
                                  'message':{'msg_content':message, 'title':alert},
                                  'type':'app'})
            url = app.config.get('BEOP_SERVICE_ADDRESS') + '/mq/mqSendTask'
            data = {'name':'notify', 'value':str(send_data)}
            headers = {'content-type': 'application/json', 'token': 'eyJhbGciOiJIUzI1NiIsImV4cCI6MT'}
            res = requests.post(url, headers=headers, data=json.dumps(data), timeout=600)
            if res.status_code == 200:
                if json.loads(res.text).get('error') == 'ok':
                    rt.update({'state':1})
    except Exception as e:
        print('mod_appCommon.sendMessage error:' + e.__str__())
        logging.error(e.__str__())
        rt.update({'error':e.__str__()})
    return jsonify(rt)


