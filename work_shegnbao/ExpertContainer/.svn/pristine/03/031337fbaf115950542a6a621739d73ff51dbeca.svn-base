# -*- encoding=utf-8 -*-
__author__ = 'yan'

import sys
sys.path.append("..")
import requests, json
from bson import ObjectId
from ExpertContainer.api.utils import isAllCloudPointName
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from ExpertContainer.mqAccess.MQManager import MQManager
from ExpertContainer import app


class Interface:
    host = 'http://%s' % app.config['BEOPWEB_ADDR']
    headers = {'content-type': 'application/json', 'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
    mq_name = 'strategy_queue'

    #todo
    @staticmethod
    def get_project_list():
        return [293]

    @staticmethod
    def is_item_valid(object, interval):
        if object:
            if object.get('status') == 1:
                if object.get('type') == 0:
                    if int(object.get('interval', 0)) == interval:
                        return True
        return False

    @staticmethod
    def get_valid_items(projId, interval=60):
        valid_items = list()
        rt = Interface.get_strategy_item_list(projId)
        if rt.get('status').lower() == 'ok':
            data = rt.get('data', [])
            if data:
                valid_items = [i for i in data if Interface.is_item_valid(i, interval)]
        return valid_items

    @staticmethod
    def get_strategy_item_list(projId, nodeId=None):
        if nodeId:
            url = Interface.host + '/strategy/item/getList/%s/%s'%(projId, nodeId)
        else:
            url = Interface.host + '/strategy/item/getList/%s'%(projId,)
        r = requests.get(url, headers = Interface.headers)
        if r.status_code == 200:
            return json.loads(r.text)
        return None

    @staticmethod
    def get_strategy_all_list(projId, nodeId=None):
        if nodeId:
            url = Interface.host + '/strategy/item/getAllList/%s/%s'%(projId, nodeId)
        else:
            url = Interface.host + '/strategy/item/getAllList/%s'%(projId,)
        r = requests.get(url, headers=Interface.headers)
        if r.status_code == 200:
            return json.loads(r.text)
        return None

    @staticmethod
    def get_strategy_item_modules(itemId):
        if ObjectId.is_valid(itemId):
            url = Interface.host + '/strategy/item/get/%s'%(itemId,)
            r = requests.get(url, headers = Interface.headers)
            if r.status_code == 200:
                content = json.loads(r.text)
                return content if content else None


    @staticmethod
    def genCloudSiteMap(itemVarIdList):
        preFilterInfo = isAllCloudPointName(itemVarIdList)
        if preFilterInfo is not None and len(preFilterInfo) >= 2:
            projId = preFilterInfo[0]
            pointNameList = preFilterInfo[1]
            if pointNameList is not None:
                (realPointList, requestSiteToCloudMaps) = BEOPDataAccess.getInstance().genCloudSiteMap(projId, pointNameList)
                pointNameList = realPointList
        return projId, pointNameList

    @staticmethod
    def put_strategy_into_message_queue(content):
        if content:
            jsonData = json.dumps(content, ensure_ascii=False)
            if jsonData:
                if MQManager.RabbitMqWorkQueueSend(Interface.mq_name, jsonData):
                    return True
        return False