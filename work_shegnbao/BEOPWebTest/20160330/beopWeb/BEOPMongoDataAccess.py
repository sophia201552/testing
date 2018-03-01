﻿__author__ = 'mango'

from datetime import datetime,timedelta
import time
import pymongo
from bson import son
import logging
from bson.objectid import ObjectId
from flask import json
import re
from beopWeb import app
import traceback

#define table names
if app.config.get('DEV_ENVIRONMENT'):
    g_tableCustomNav = 'CustomNav_copy_Dev'
    g_tableCustomNavItem = 'CustomNavItem_copy_Dev'
    g_tableSpringLayout = 'SpringLayout_Dev'
    g_tableWeather = 'WeatherStation'
    g_tableWeatherData = 'WeatherStationData'
    g_tableDataSource = 'DataSourceAdditional_Dev'
    g_tableWorkspace = 'WorkSpace_Dev'
    g_tableTemplate = 'Template_Dev'
    g_tableShareLog = 'ShareLog_Dev'
    g_tableBenchmark = 'Benchmark_Dev'
    g_tableWiki = 'Wiki_Dev'

    g_tableDataSourceGroupList = 'DataSourceGroupList_Dev'
    g_tableDataSourceGroupItem = 'DataSourceGroupItem_Dev'

    g_tableModal = 'modal_Dev'
    g_tableWorkspaceItem = 'WorkSpaceItem_Dev'
    g_tableWorkspaceAdditional = 'WorkSpaceAdditional_Dev'
    g_tableTemplateAdditional = 'TemplateAdditional_Dev'

    g_reportData = 'ReportData_Dev'

    # 温控 app 相关表
    #g_tableBuilding = 'Building_Dev'
    #g_tableAppTempRoom = 'AppTemp_Room_Dev'
    #g_tableAppTempSpace = 'AppTemp_Space_Dev'
    #g_tableAppTempSensor = 'AppTemp_Sensor_Dev'
    #g_tableAppTempWall = 'AppTemp_Wall_Dev'
    #g_tableAppTempController = 'AppTemp_Controller_Dev'
    #g_tableAppTempGateway = 'AppTemp_Gateway_Dev'
    g_tableAppTempToken = 'AppTemp_Token_Dev'
    g_tableAppTempSchedule = 'AppTemp_Schedule_Dev'
    g_tableAppTempMessage = 'AppTemp_Message_Dev'
    g_tableAppTempUserRoom = 'APPTemp_UserRoom_Dev'
    g_tableAppTempHistoryOperation = 'AppTemp_History_Operation_Dev'

    # 点表
    g_pointSourceType = 'PointSourceType_Dev'
    g_pointTableFields = 'PointTableFields_Dev'

    #DashboardApp相关表
    g_tableDbDashboard = 'AppDb_Dashboard_Dev'
    g_tableDbSummary = 'AppDb_Summary_Dev'

    #factory
    g_table_fac_project = 'Fac_Project_Dev'
    g_table_fac_user_project = 'Fac_User_Project_Dev'
    g_table_fac_page = 'Fac_Page_Dev'
    g_table_fac_sprite = 'Fac_Sprite_Dev'
    g_table_fac_layer = 'Fac_Layer_Dev'
    g_table_fac_widget = 'Fac_Widget_Dev'
    g_table_fac_historyshot = 'Fac_HistoryShot_Dev'
    g_table_fac_template = 'Fac_Template_Dev'
    g_table_fac_log = 'Fac_Log_Dev'
    g_table_fac_pagebak = 'Fac_PageBak_Dev'
    g_table_fac_configuration = 'Fac_Configuration_Dev'
    g_table_fac_proj_sprite = 'Fac_ProjSprite_Dev'
    g_table_fac_navigation = 'Fac_Navigation_Dev'
    g_table_fac_material = 'Fac_Material_Dev'
    g_table_fac_spring_layout = 'Fac_SpringLayout_Dev'

    g_table_ob_layer = 'Ob_Layer_Dev'
    g_table_ob_widget = 'Ob_Widget_Dev'
    g_table_ob_page = 'CustomNavItem_copy_Dev'
    g_table_ob_navigation = 'CustomNav_copy_Dev'

    g_PointType = 'PointTable'

    #asset
    g_table_asset_things = 'Asset_Things_Dev'
    g_table_asset_model = 'Asset_Model_Dev'
    g_table_asset_maintain = 'Asset_Maintain_Dev'
    #iot
    g_table_iot_things = 'IOT_Thing_Dev'
    g_table_iot_group = 'IOT_Group_Dev'
    g_table_iot_project = 'IOT_Project_Dev'

    #workflow
    g_table_workflow_template = 'WorkflowTemplate_Dev'
    g_table_workflow_process = 'WorkflowProcess_Dev'
    g_table_workflow_task = 'WorkflowTask_Dev'
    g_table_workflow_team = 'WorkflowTeam_Dev'
    g_table_workflow_task_group = 'WorkflowTaskGroup_Dev'
    g_table_workflow_message='message_Dev'
    g_table_workflow_message_user="messageUser_Dev"

    #patrol
    g_table_patrol_path = 'Patrol_Path_Dev'
    g_table_patrol_point = 'Patrol_Point_Dev'
    g_table_patrol_executor = 'Patrol_Executor_Dev'
    g_table_patrol_mission = 'Patrol_Mission_Dev'
    g_table_patrol_missionlog = 'Patrol_MissionLog_Dev'

else:
    g_tableCustomNav = 'CustomNav_copy'
    g_tableCustomNavItem = 'CustomNavItem_copy'
    g_tableSpringLayout = 'SpringLayout'
    g_tableWeather = 'WeatherStation'
    g_tableWeatherData = 'WeatherStationData'
    g_tableDataSource = 'DataSourceAdditional'
    g_tableWorkspace = 'WorkSpace'
    g_tableTemplate = 'Template'
    g_tableShareLog = 'ShareLog'
    g_tableBenchmark = 'Benchmark'
    g_tableWiki = 'Wiki'

    g_tableDataSourceGroupList = 'DataSourceGroupList'
    g_tableDataSourceGroupItem = 'DataSourceGroupItem'

    g_tableModal = 'modal'
    g_tableWorkspaceItem = 'WorkSpaceItem'
    g_tableWorkspaceAdditional = 'WorkSpaceAdditional'
    g_tableTemplateAdditional = 'TemplateAdditional'

    g_reportData = 'ReportData'

    # 温控 app 相关表
    #g_tableBuilding = 'Building'
    #g_tableAppTempRoom = 'AppTemp_Room'
    #g_tableAppTempSpace = 'AppTemp_Space'
    #g_tableAppTempSensor = 'AppTemp_Sensor'
    #g_tableAppTempWall = 'AppTemp_Wall'
    #g_tableAppTempController = 'AppTemp_Controller'
    #g_tableAppTempGateway = 'AppTemp_Gateway'
    g_tableAppTempToken = 'AppTemp_Token'
    g_tableAppTempSchedule = 'AppTemp_Schedule'
    g_tableAppTempMessage = 'AppTemp_Message'
    g_tableAppTempUserRoom = 'APPTemp_UserRoom'
    g_tableAppTempHistoryOperation = 'AppTemp_History_Operation'

    # 调试工具点表
    # 点类型来源
    g_pointSourceType = 'PointSourceType'
    # 从点里抽取的元素
    g_pointTableFields = 'PointTableFields'

    #DashboardApp相关表
    g_tableDbDashboard = 'AppDb_Dashboard'
    g_tableDbSummary = 'AppDb_Summary'

    #factory
    g_table_fac_project = 'Fac_Project'
    g_table_fac_user_project = 'Fac_User_Project'
    g_table_fac_page = 'Fac_Page'
    g_table_fac_sprite = 'Fac_Sprite'
    g_table_fac_layer = 'Fac_Layer'
    g_table_fac_widget = 'Fac_Widget'
    g_table_fac_historyshot = 'Fac_HistoryShot'
    g_table_fac_template = 'Fac_Template'
    g_table_fac_log = 'Fac_Log'
    g_table_fac_pagebak = 'Fac_PageBak'
    g_table_fac_configuration = 'Fac_Configuration'
    g_table_fac_proj_sprite = 'Fac_ProjSprite'
    g_table_fac_navigation = 'Fac_Navigation'
    g_table_fac_material = 'Fac_Material'
    g_table_fac_spring_layout = 'Fac_SpringLayout'

    g_table_ob_layer = 'Ob_Layer'
    g_table_ob_widget = 'Ob_Widget'
    g_table_ob_page = 'CustomNavItem_copy'
    g_table_ob_navigation = 'CustomNav_copy'

    g_PointType = 'PointTable'

    #asset
    g_table_asset_things = 'Asset_Things'
    g_table_asset_model = 'Asset_Model'
    g_table_asset_maintain = 'Asset_Maintain'

    #iot
    g_table_iot_things = 'IOT_Thing'
    g_table_iot_group = 'IOT_Group'
    g_table_iot_project = 'IOT_Project'

    #workflow
    g_table_workflow_template = 'WorkflowTemplate'
    g_table_workflow_process = 'WorkflowProcess'
    g_table_workflow_task = 'WorkflowTask'
    g_table_workflow_team = 'WorkflowTeam'
    g_table_workflow_task_group = 'WorkflowTaskGroup'
    g_table_workflow_message='message'
    g_table_workflow_message_user="messageUser"

    #patrol
    g_table_patrol_path = 'Patrol_Path'
    g_table_patrol_point = 'Patrol_Point'
    g_table_patrol_executor = 'Patrol_Executor'
    g_table_patrol_mission = 'Patrol_Mission'
    g_table_patrol_missionlog = 'Patrol_MissionLog'

def getNearestIntByNum(num, factor):
    for i in range(num, -1, -1):
        if i%factor == 0:
            return i
    return -1

def getTimeNum(num,factor,type):
    if type == 'minute':
        for i in range(num, 60):
            if i%factor == 0:
                return i
    elif type == 'hour':
        for i in range(num, 24):
            if i%factor == 0:
                return i
    return -1

class BEOPMongoDataAccess:

    def __init__(self, addr, st=None, et=None):
        bOk = False
        try:
            self._st = st
            self._et = et
            self._hostAddr = ''
            self.mdbConnection = None
            self.mdbBb = None
            if ':' in addr:
                addrArr = addr.split(':')
                if len(addrArr) == 2:
                    hostAddr = str(addrArr[0])
                    port = int(addrArr[1])
                    self._hostAddr = addr
                    self.mdbConnection = pymongo.MongoClient(host=hostAddr,port=port,socketKeepAlive=True)
                    self.mdbBb = self.mdbConnection.beopdata
                    bOk = self.mdbBb.authenticate('beopweb','RNB.beop-2013')
        except Exception as e:
            print('init mongodb connection failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
        if not bOk:
            logging.error('init mongodb connection failed')

    def __del__(self):
        if self.mdbConnection is not None:
            self.mdbConnection.close()

    def getHostAddr(self):
        return self._hostAddr

    def setTimeAttrStart(self, st):
        self._st = st

    def setTimeAttrEnd(self, et):
        self._et = et

    def getTimeAttrStart(self):
        return self._st

    def getTimeAttrEnd(self):
        return self._et

    #mango get all collections from beopdata
    def getAllCollections(self):
        rt = []
        try:
            rt = self.mdbBb.collection_names()
        except Exception as e:
            print('get all collection names failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
        return rt

    def InsertTableData(self, data, mongoDBTableName):
        total = 0
        try:
            rt = []
            constMaxRowsPerOperation = 30000  #docs num for each insert
            length = len(data)
            table = self.mdbBb[mongoDBTableName]
            if length > 0:
                block = length//constMaxRowsPerOperation
                for count in range(block+1):
                    postList = []
                    for index in range(count*constMaxRowsPerOperation,(count+1)*constMaxRowsPerOperation):
                        if index>=length:
                            break
                        if len(data[index]) == 3:
                            bNumber = True
                            try:
                                convert = float(data[index][2])
                            except Exception as e:
                                bNumber = False
                            if bNumber:
                                postList.append(son.SON(data={'time':data[index][0],  'pointname':data[index][1], 'value':convert}))
                            else:
                                postList.append(son.SON(data={'time':data[index][0],  'pointname':data[index][1], 'value':data[index][2]}))
                        else:
                            logging.error('data format is invalid')
                    if len(postList) > 0:
                        rt = table.insert(postList)
                        total += len(rt)
                        info = table.index_information()
                        bFind = False
                        indexKey = 'time_1_pointname_1'
                        if indexKey in info.keys():
                            bFind = True
                        if not bFind:
                            table.create_index([('time',pymongo.ASCENDING),('pointname',pymongo.ASCENDING)])
        except Exception as e:
            print('BatchInsertTableData failed batch_size=30000')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
        return total

    #insert user data
    def InsertTableDataUser(self, data, dbName, removeExist=0):
        result = 0
        try:
            if len(dbName) > 0:
                rt = []
                constMaxRowsPerOperation = 30000
                length = len(data)
                if length > 0:
                    mongoCollectionName = 'm1_data_' + dbName
                    if removeExist == 1:
                        self.clearCollectionDocs(mongoCollectionName)
                    table = self.mdbBb[mongoCollectionName]
                    rtData = self.standardizeUserDataByFormat(data, format)
                    block = len(rtData)//constMaxRowsPerOperation
                    for count in range(block+1):
                        postList = []
                        for index in range(count*constMaxRowsPerOperation,(count+1)*constMaxRowsPerOperation):
                            length = len(rtData)
                            if index>=length:
                                break
                            if len(rtData[index]) == 3:
                                bNumber = True
                                try:
                                    convert = float(rtData[index][2])
                                except Exception as e:
                                    bNumber = False
                                if bNumber:
                                    postList.append(son.SON(data={'time':rtData[index][0],  'pointname':rtData[index][1], 'value':convert}))
                                else:
                                    postList.append(son.SON(data={'time':rtData[index][0],  'pointname':rtData[index][1], 'value':rtData[index][2]}))
                            else:
                                logging.error('data format is invalid')
                        if len(postList) > 0:
                            rv = table.insert(postList)
                            result += len(rv)
                            self._insertLength = result
                            info = table.index_information()
                            bFind = False
                            indexKey = 'time_1_pointname_1'
                            if indexKey in info.keys():
                                bFind = True
                            if not bFind:
                                table.create_index([('time',pymongo.ASCENDING),('pointname',pymongo.ASCENDING)])
        except Exception as e:
            print('BatchInsertTableDataUser failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
        return result

    def getHistoryDataByFormat(self,dbname, pointList, timeStart, timeEnd, timeFormat):
        startObject = datetime.strptime(timeStart, '%Y-%m-%d %H:%M:%S')
        endObject = datetime.strptime(timeEnd, '%Y-%m-%d %H:%M:%S')
        data = []
        if isinstance(pointList, list):
            length = len(pointList)
            result_name_list = []
            if length > 0:
                post = {'pointname':{'$in':pointList},'time':{'$gte':startObject,'$lte':endObject}}
                collectionName = ''

                if timeFormat == 'M1':
                    collectionName = 'month' + '_data_' + dbname
                else:
                    collectionName = timeFormat + '_data_' + dbname
                data = []
                nameLast = ""
                temp = []
                try:
                    cursor = self.mdbBb[collectionName].find(post).sort([('pointname',pymongo.ASCENDING), ('time',pymongo.ASCENDING)])#pay attention to index
                    timeLast = None
                    valueLast = None
                    for item in cursor.batch_size(600):
                        findTime = item['time']
                        findName = item['pointname']
                        findValue = item['value']
                        if findName != nameLast:
                            if len(temp) > 0:
                                data.append(dict(pointname=nameLast, record=temp))
                                timeLast = None
                                valueLast = None
                                result_name_list.append(nameLast)
                                temp = []
                            nameLast = str(findName)
                        bNum = True
                        try:
                            valueConvertToFloat = float(findValue)
                        except Exception as e:
                            bNum = False
                        if timeLast != findTime and valueLast != findValue:
                            if bNum:
                                temp.append(dict(time=findTime.strftime('%Y-%m-%d %H:%M:%S'), value='%.2f'%float(valueConvertToFloat)))
                            else:
                                temp.append(dict(time=findTime.strftime('%Y-%m-%d %H:%M:%S'), value=findValue))
                            timeLast = findTime
                            valueLast = findValue
                    if len(temp) > 0:
                        data.append(dict(pointname=nameLast, record=temp))
                        result_name_list.append(nameLast)
                except Exception as e:
                    print('getHistoryDataByFormat failed')
                    print(e.__str__())
                    logging.error(e.__str__())
                    logging.exception(e)
        return data

    def getCustomNavAllByRoleAndProject(self, project_id, role_ids):
        top_nav = []
        func_nav = []
        benchmarks = []
        try:
            rv = self.mdbBb[g_tableCustomNav].find_one({'projectId': int(project_id)}, {'roleNav': 1, 'benchmark': 1})
            if not rv:
                return [], [], []
            role_nav = rv.get('roleNav')
            if not role_nav:
                return [], [], []
            top_nav = self._getNavAllByType(role_nav, role_ids, 'nav')
            func_nav = self._getNavAllByType(role_nav, role_ids, 'funcNav')

            benchmarks = []
            benchmark_nav = rv.get('benchmark')
            if benchmark_nav is not None:
                for item in benchmark_nav:
                    benchmarks.append(str(item))
        except Exception as e:
            print('getCustomNavAllByRoleAndProject failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
        return top_nav, func_nav, benchmarks

    def getCustomNavByProjectId(self, projectId):
        ret = []
        indexed_ids_list = []
        try:
            rs = self.mdbBb[g_tableCustomNav].find_one({'projectId': int(projectId)}, {'list': 1})
            if rs is None:
                return []
            seen = set()
            seen_add = seen.add
            nav_id_list = [ObjectId(x) for x in rs.get('list') if not (x in seen or seen_add(x))]
            nav_item_list = self.mdbBb[g_tableCustomNavItem].find({'_id': {'$in': nav_id_list}})
            for ret_item in nav_item_list:
                ret_item['_id'] = str(ret_item.get('_id'))
                if ret_item.get('parent'):
                    ret_item['parent'] = str(ret_item.get('parent'))
                ret.append(ret_item)
            # 还原顺序
            for nav_id in nav_id_list:
                for ret_item in ret:
                    if str(ret_item.get('_id')) == str(nav_id):
                        indexed_ids_list.append(ret_item)
        except Exception as e:
            print('getCustomNavByProjectId failed')
            print(str(e))
            logging.error(str(e))
        return indexed_ids_list

    def _getNavAllByType(self, role_nav, role_ids, type):
        ret = []
        try:
            nav_id_list = []
            for role_id in role_ids:
                role_obj = role_nav.get(str(role_id))
                if role_obj:
                    nav = role_obj.get(type)
                    if nav:
                        nav_id_list += nav
            seen = set()
            seen_add = seen.add
            nav_id_list = [x for x in nav_id_list if not (x in seen or seen_add(x))]
            nav_item_list = self.mdbBb[g_tableCustomNavItem].find({'_id': {'$in': nav_id_list}})
            for ret_item in nav_item_list:
                ret_item['id'] = str(ret_item.get('_id'))
                del ret_item['_id']
                if ret_item.get('parent'):
                    ret_item['parent'] = str(ret_item.get('parent'))
                ret.append(ret_item)
            # 还原顺序
            indexed_ids_list = []
            for nav_id in nav_id_list:
                for ret_item in ret:
                    if str(ret_item.get('id')) == str(nav_id):
                        indexed_ids_list.append(ret_item)
        except Exception as e:
            print('_getNavAllByType failed')
            print(str(e))
            logging.error(str(e))
        return indexed_ids_list

    def saveSpringLayout(self, data):
        post = {}
        isFactory = data.get('isFactory', None)
        table = g_table_fac_spring_layout if isFactory == 1 else g_tableSpringLayout
        if isinstance(data, dict):
            id = data.get('id')
            creatorId = data.get('creatorId')
            menuItemId = data.get('menuItemId')
            layoutArray = data.get('layout')
            if id is None:
                post = {'creatorId':creatorId, 'menuItemId': menuItemId, 'layout':layoutArray}
            else:
                post = {'_id':ObjectId(id), 'creatorId':creatorId, 'menuItemId': menuItemId, 'layout':layoutArray}
            try:
                self.mdbBb[table].save(post)
            except Exception as e:
                print('saveSpringLayout failed')
                print(e.__str__())
                logging.error(e.__str__())
                logging.exception(e)
        else:
            print('data is not dict')

    def springGetMenu(self, menuId, isFactory):
        rv = {}
        table = g_table_fac_spring_layout if isFactory == 1 else g_tableSpringLayout
        if isinstance(menuId, str):
            post = {}
            layout_item = []
            dsInfoSet = set()
            rv['dsInfoList'] = []
            rv['layout'] = []
            post = {'menuItemId':menuId}
            try:
                ret = self.mdbBb[table].find_one(post)
                if ret is not None:
                    id = ret['_id'].__str__()
                    rv['id'] = id
                    menuItemId = ret['menuItemId']
                    rv['menuItemId'] = menuItemId
                    container_list = ret['layout']
                    layout_item_list = []
                    for container in container_list:
                        layout_item = []
                        for item in container:
                            container_id = item['id'].__str__()
                            spanR = item.get('spanR')
                            spanC = item.get('spanC')
                            modal = item.get('modal')
                            isNotRender = item.get('isNotRender')
                            if modal != None:
                                option = modal.get('option')
                                type = modal.get('type')
                                interval = modal.get('interval')
                                title = modal.get('title')
                                points = modal.get('points')
                                modalText = modal.get('modalText')
                                modalTextUrl = modal.get('modalTextUrl')
                                link = modal.get('link')
                                wikiId = modal.get('wikiId')
                                popId = modal.get('popId')
                                dsChartCog = modal.get('dsChartCog')
                                desc = modal.get('desc')
                                if points != None:
                                    if len(points) > 0:
                                        dsInfoSet |= set(points)
                                layout_item.append({'id':container_id, 'spanR':spanR, 'spanC':spanC, 'modal':{'interval':interval, 'type':type, 'dsChartCog':dsChartCog, 'points':points, 'title':title, 'desc':desc, 'option':option, 'modalText':modalText, 'modalTextUrl':modalTextUrl, 'link':link, 'wikiId':wikiId, 'popId':popId}, 'isNotRender': isNotRender})
                        layout_item_list.append(layout_item)
                    rv['layout'] = layout_item_list
                    dsl = list(dsInfoSet)
                    dsInfoList = self.analysisDataSourceGetByIdList(dsl)
                    if len(dsInfoList) > 0:
                        rv['dsInfoList'] = dsInfoList
            except Exception as e:
                print('springGetMenu failed')
                print(e.__str__())
                logging.error(e.__str__())
                logging.exception(e)
        return rv

    def getWeatherTempList(self, weaId, timeStart, timeEnd):
        startObject = datetime.strptime(timeStart, '%Y-%m-%d %H:%M:%S')
        endObject = datetime.strptime(timeEnd, '%Y-%m-%d %H:%M:%S')
        rvdata = []

        post = {'$query':{'id': weaId ,'time':{'$gte':startObject,'$lte':endObject}},'$orderby':{'time':1}}
        try:
            cursor = self.mdbBb[g_tableWeatherData].find(post).sort([('time',pymongo.ASCENDING)])
            for item in cursor:
                rvdata.append(dict(time= item['time'], temp=item['temp']))
        except Exception as e:
            print('getWeatherTempList failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
        return rvdata

    def analysisDataSourceSaveMulti(self, data):
        itemIdList = []
        if isinstance(data, dict) and len(list(data.keys())) > 0:
            try:
                for item in data['itemList']:
                    geneId = ObjectId() if 'id' not in item.keys() else ObjectId(item['id'])
                    insertDict = {'_id':geneId, 'projId':int(item['projId']) if 'projId' in item.keys() else -1, 'type':int(item['type']),
                                  'alias':str(item['alias']), 'value':str(item['value']), 'note':str(item['note']), 'groupId':str(item['groupId'])}
                    itemIdList.append({'alias':str(item['alias']), 'id':geneId.__str__(), 'value':item['value'], 'note':str(item['note']),
                                       'groupId':str(item['groupId']), 'projId':item['projId'], 'type':item['type']})
                    self.mdbBb[g_tableDataSource].update({'_id':geneId}, {'$set':insertDict}, True)
                    if ObjectId.is_valid(item.get('groupId')):
                        self.mdbBb[g_tableDataSourceGroupItem].update({'_id':ObjectId(item.get('groupId'))}, {'$addToSet':{'dsList':geneId.__str__()}})
            except Exception as e:
                print('analysisDataSourceSaveMulti failed')
                print(e.__str__())
                logging.error(e.__str__())
                logging.exception(e)
        return {'itemIdList':itemIdList}

    def analysisDataSourceSaveLayout(self, userId, data):
        rt = {'success':False}
        try:
            userId = int(userId)
            if isinstance(data, dict):
                for key in data.keys():
                    if ObjectId.is_valid(key):
                        self.mdbBb[g_tableDataSourceGroupItem].update({'_id':ObjectId(key)}, {'$set':{'dsList':data.get(key, [])}})
                rt = {'success':True}
        except Exception as e:
            print('analysisDataSourceSaveLayout failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
            rt['success'] = False
        return rt

    def analysisDataSourceRemoveSingle(self, datasourceId):
        rt = {'success':False}
        if ObjectId.is_valid(datasourceId):
            try:
                self.mdbBb[g_tableDataSource].remove({'_id':ObjectId(datasourceId)})
                self.mdbBb[g_tableDataSourceGroupItem].update({'dsList.id':datasourceId}, {'$pull':{'dsList':datasourceId}})
                rt['success'] = True
            except Exception as e:
                print('analysisDataSourceRemoveSingle failed')
                print(e.__str__())
                logging.error(e.__str__())
                logging.exception(e)
        return rt

    def analysisDataSourceGet(self, userId):
        rt = []
        try:
            userId = int(userId)
            rv = self.mdbBb[g_tableDataSourceGroupList].find_one({'userId':userId})
            if rv:
                groupList = rv.get('groupList', [])
                for item in groupList:
                    rv2 = self.mdbBb[g_tableDataSourceGroupItem].find_one({'_id':ObjectId(item)})
                    if rv2:
                        cursor = None
                        dsList = rv2.get('dsList', [])
                        dsObjectList = [ObjectId(x) for x in dsList if ObjectId.is_valid(x)]
                        cursor = self.mdbBb[g_tableDataSource].find({'_id':{'$in':dsObjectList}})
                        for ds in cursor:
                            val = ds['value']
                            strNote = ds['note'] if 'note' in ds.keys() else ''
                            strGroupId = ds['groupId'] if 'groupId' in ds.keys() else ''
                            rt.append({'type': ds['type'], 'projId':ds['projId'], 'alias': ds['alias'], 'id': ds['_id'].__str__(), 'value':val, 'note':strNote, 'groupId':strGroupId})
                        if cursor:
                            cursor.close()
        except Exception as e:
            print('analysisDataSourceGet failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
        return rt

    #yan add 2016-1-5
    def getDataSourceGroupInfoByUserIdAndGroupId(self, userId, groupId):
        rt = []
        cursor1 = None
        try:
            if ObjectId.is_valid(groupId):
                cursor1 = self.mdbBb[g_tableDataSourceGroupItem].find({'parentId':groupId})
                if cursor1:
                    for item in cursor1:
                        id = item.get('_id').__str__()
                        parent = item.get('parentId')
                        name = item.get('groupName')
                        dsList = item.get('dsList', [])
                        count = 0
                        cursor2 = None
                        try:
                            cursor2 = self.mdbBb[g_tableDataSourceGroupItem].find({'parentId':id})
                            if cursor2:
                                count = cursor2.count()
                        except:
                            pass
                        finally:
                            if cursor2:
                                cursor2.close()
                        cursor3 = None
                        if dsList:
                            try:
                                cursor3 = self.mdbBb[g_tableDataSource].find({'_id':{'$in':[ObjectId(x) for x in dsList]}})
                                count += cursor3.count()
                            except:
                                pass
                            finally:
                                if cursor3:
                                    cursor3.close()
                        rt.append({ 'id': id, 'type':0, 'projId': 0, 'alias': name, 'note': '','value': name,
                                    'isParent': True, 'parentId':parent, 'num': count})
                    groupItem = self.mdbBb[g_tableDataSourceGroupItem].find_one({'_id':ObjectId(groupId)})
                    if groupItem:
                        dsList = groupItem.get('dsList', [])
                        cursor4 = None
                        if dsList:
                            try:
                                cursor4 = self.mdbBb[g_tableDataSource].find({'_id':{'$in':[ObjectId(x) for x in dsList]}})
                                arrFind = {}
                                for r in cursor4:
                                    arrFind.update({r.get('_id').__str__():{'id': r.get('_id').__str__(), 'type':r.get('type'), 'projId': r.get('projId'),
                                                'alias': r.get('alias'), 'note': r.get('note'),'value': r.get('value'),
                                                'isParent': False, 'parentId':groupId, 'num': 0}})
                                for item in dsList:
                                    if arrFind:
                                        rt.append(arrFind.get(item))
                            except:
                                pass
                            finally:
                                if cursor4:
                                    cursor4.close()
        except Exception as e:
            print('getDataSourceGroupInfoByUserIdAndGroupId failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
        finally:
            if cursor1:
                cursor1.close()
        return rt

    def getDataSourceGroupInfoRoot(self, userId):
        rt = []
        try:
            retGroup = self.mdbBb[g_tableDataSourceGroupList].find_one({'userId':userId})
            if retGroup:
                groupList = retGroup.get('groupList', [])
                cursor = None
                try:
                    cursor = self.mdbBb[g_tableDataSourceGroupItem].find({'_id':{'$in':[ObjectId(x) for x in groupList]}})
                    arrTemp = {}
                    for retItem in cursor:
                        if retItem:
                            id = retItem.get('_id').__str__()
                            parent = retItem.get('parentId')
                            name = retItem.get('groupName')
                            dsList = retItem.get('dsList', [])
                            if not ObjectId.is_valid(parent):
                                count = 0
                                cursor2 = None
                                try:
                                    cursor2 = self.mdbBb[g_tableDataSourceGroupItem].find({'parentId':id})
                                    if cursor2:
                                        count = cursor2.count()
                                except:
                                    pass
                                finally:
                                    if cursor2:
                                        cursor2.close()
                                cursor3 = None
                                if dsList:
                                    try:
                                        cursor3 = self.mdbBb[g_tableDataSource].find({'_id':{'$in':[ObjectId(x) for x in dsList]}})
                                        count += cursor3.count()
                                    except:
                                        pass
                                    finally:
                                        if cursor3:
                                            cursor3.close()
                                arrTemp[id] = { 'id': id, 'type':0, 'projId': 0, 'alias': name, 'note': '','value': name,
                                            'isParent': True, 'parentId':parent, 'num': count}
                    for item in groupList:
                        row = arrTemp.get(item)
                        if row:
                            rt.append(row)
                except:
                    pass
                finally:
                    if cursor:
                        cursor.close()
        except Exception as e:
            print('getDataSourceGroupInfoRoot failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
        return rt

    def getDataSourceItemInResult(self, dsId, result):
        for dic1 in result:
            if dsId == dic1.get('id'):
                return dic1
        return None

    def analysisTemplateGet(self, userId, projIdList=[]):
        tmList = []
        preList = []
        post = {}
        cursor = None
        postList = []
        if len(projIdList) > 0:
            postList.append({'projectId':{'$in':projIdList}})
        else:
            postList.append({'creatorId':userId})
        postList.append({'projectId':''})
        try:
            for index, post in enumerate(postList):
                cursor = self.mdbBb[g_tableTemplateAdditional].find(post)
                for item in cursor:
                    item.update({'id':item.get('_id').__str__()})
                    item.update({'creatorName':''})
                    item.pop('_id')
                    modalOrder = item.get('modalOrder',[])
                    if 'modalOrder' in item.keys():
                        item.pop('modalOrder')
                    modalList = []
                    post = {'_id':{'$in':[ObjectId(x) for x in modalOrder]}}
                    cur = None
                    cur = self.mdbBb[g_tableModal].find(post)
                    for sub_item in cur:
                        sub_item.update({'id':sub_item['_id'].__str__()})
                        sub_item.pop('_id')
                        if 'imagebin' in sub_item.keys():
                            imagebin = sub_item.get('imagebin', bytes())
                            sub_item.update({'imagebin':str(imagebin.decode())})
                        else:
                            sub_item.update({'imagebin':''})

                        modalList.append(sub_item)
                    if cur != None:
                        cur.close()
                    modalListDict = {'modalList':modalList}
                    if index == 0:
                        tmList.append(dict(item, **modalListDict))
                    else:
                        preList.append(dict(item, **modalListDict))
        except Exception as e:
            print('analysisTemplateGet:%s post:%s' % (e.__str__(),str(post)))
            print(e.__str__())
            logging.error(e.__str__())
        finally:
            if cursor != None:
                cursor.close()
        return {'preTemplate':preList, 'userTemplate':tmList}

    def getDataSourceItemInfoById(self, itemId):
        rt = {}
        if isinstance(itemId, str):
            if  itemId.startswith('tempvar'):
                itemId = itemId[len('tempvar'):]
            try:
                if ObjectId.is_valid(itemId):
                    rt = self.mdbBb[g_tableDataSource].find_one({'_id':ObjectId(itemId)})
            except Exception as e:
                print('getListContentByIdAndProjId failed')
                print(e.__str__())
                logging.error(e.__str__())
                logging.exception(e)
        return rt

    def clearCollectionDocs(self, collectionName):
        opReturn = True
        if len(collectionName) > 0:
            try:
                self.mdbBb[collectionName].remove({})
            except Exception as e:
                opReturn = False
        return opReturn

    def standardizeUserDataByFormat(self, data):
        retData = []
        try:
            if len(data) > 0:
                for item in data:
                    if len(item) == 3:
                        insertName = item[1]
                        insertValue = item[2]
                        insertTime = item[0].replace(second=0)
                        strTime = insertTime.strftime("%Y-%m-%d %H:%M:%S")
                        for i in retData:
                            if strTime == i.get('time'):
                                i.get('value').append(tuple((insertName, str(insertValue))))
                                break
                        else:
                            retData.append({'time':strTime,'value':[tuple((insertName, str(insertValue)))]})
        except Exception as e:
            print("standardizeUserDataByFormat:%s"%(e.__str__(),))
        return retData

    def saveHistoryData(self, pointName, pointValue, pointTime, dbNameMongo):
        result = True
        if len(pointName) > 0 and isinstance(pointTime, datetime):
            try:
                self.mdbBb[dbNameMongo].update({'time':pointTime, 'pointname':pointName},{'$set':{'time':pointTime, 'pointname':pointName, 'value':pointValue}},True)
            except Exception as e:
                result = False
        return result

    #yan modified
    def saveDataSourceGroup(self, userId, groupName, groupId, parentId):
        result = {'error':'successful'}
        try:
            userId = int(userId)
            IdObject = ObjectId() if not ObjectId.is_valid(groupId) else ObjectId(groupId)
            self.mdbBb[g_tableDataSourceGroupItem].update({'_id':IdObject}, {'$set':{'_id':IdObject, 'groupName':groupName, 'parentId':parentId}}, True)
            self.mdbBb[g_tableDataSourceGroupList].update({'userId':userId}, {'$addToSet':{'groupList':IdObject.__str__()}}, True)
            result['groupId'] = IdObject.__str__()
            result['groupName'] = groupName
            result['parentId'] = parentId
        except Exception as e:
            print('saveDataSourceGroup failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
            result = {'error':e.__str__()}
        return result

    def deleteDataSourceGroup(self, userId, groupId):
        result = {'error':'successful'}
        if ObjectId.is_valid(groupId):
            try:
                userId = int(userId)
                self.mdbBb[g_tableDataSourceGroupItem].remove({'_id':ObjectId(groupId)})
                self.mdbBb[g_tableDataSourceGroupList].update({'userId':userId}, {'$pull':{'groupList':groupId}})
                self.mdbBb[g_tableDataSourceGroupList].update({'default':groupId}, {'$set':{'default':''}})#如果default找到了要删除的组id，就清空
            except Exception as e:
                print(e.__str__())
                logging.error(e.__str__())
                logging.exception(e)
                result = {'error':e.__str__()}
        return result

    def saveDataSourceGroupLayout(self, userId, newGroupIdList):
        result = {'error':'successful'}
        try:
            userId = int(userId)
            self.mdbBb[g_tableDataSourceGroupList].update({'userId':userId}, {'$set':{'groupList':newGroupIdList}})
        except Exception as e:
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
            result = {'error':'failed'}
        return result

    def getDataSourceGroupInfo(self, userId):
        rt = []
        try:
            userId = int(userId)
            ret = self.mdbBb[g_tableDataSourceGroupList].find_one({'userId':userId}, {'userId':0})
            if ret:
                defaultId = ret.get('default', '')
                groupList = ret.get('groupList', [])
                if defaultId == '':
                    newId = ObjectId().__str__()
                    self.saveDataSourceGroup(userId, 'unassigned', newId, '')
                    self.mdbBb[g_tableDataSourceGroupList].update({'userId':userId}, {'$set':{'default':newId}}, True)
                    defaultId = newId
                else:
                    if defaultId not in groupList:
                        newId = ObjectId().__str__()
                        self.saveDataSourceGroup(userId, 'unassigned', newId, '')
                        self.mdbBb[g_tableDataSourceGroupList].update({'userId':userId}, {'$set':{'default':newId}}, True)
                        defaultId = newId
                for item in groupList:
                    if ObjectId.is_valid(item):
                        ret_item = self.mdbBb[g_tableDataSourceGroupItem].find_one({'_id':ObjectId(item)})
                        if ret_item:
                            default = True if defaultId == item else False
                            groupName = ret_item.get('groupName', '')
                            parentId = ret_item.get('parentId', '')
                            itemList = ret_item.get('dsList', [])
                            rt.append({'isDefault':default, 'groupId':item, 'groupName':groupName, 'parentId':parentId, 'itemList':itemList})
            else:
                newId = ObjectId().__str__()
                self.saveDataSourceGroup(userId, 'unassigned', newId, '')
                self.mdbBb[g_tableDataSourceGroupList].update({'userId':userId}, {'$set':{'default':newId}}, True)
        except Exception as e:
            print('getDataSourceGroupInfo failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
        return rt

    def getGroupInfoById(self, groupId):
        rt = {}
        cursor = None
        try:
            if ObjectId.is_valid(groupId):
                cursor = self.mdbBb[g_tableDataSourceGroupItem].find({'parentId':groupId})
        except Exception as e:
            print('getGroupInfoById failed:%s'%(e.__str__(),))
            logging.error('getGroupInfoById failed:%s'%(e.__str__(),))
        finally:
            if cursor:
                cursor.close()



    def analysisDataSourceGetByIdList(self, dsList):
        rt = []
        if isinstance(dsList, list):
            cursor = None
            try:
                dsObjList = [ObjectId(x) for x in dsList if ObjectId.is_valid(x)]
                cursor = self.mdbBb[g_tableDataSource].find({'_id':{'$in':dsObjList}})
                for item in cursor:
                    if item is not None and len(list(item.keys())) > 0:
                        val = item['value']
                        strNote = ''
                        if  'note' in item.keys():
                            strNote = item['note']
                        strGroupId = ''
                        if 'groupId' in item.keys():
                            strGroupId = item['groupId']
                        rt.append({'type': item['type'], 'projId':item['projId'], 'alias': item['alias'], 'id': item['_id'].__str__(), 'value':val, 'note':strNote, 'groupId':strGroupId})
            except Exception as e:
                print('analysisDataSourceGetByIdList failed')
                print(e.__str__())
                logging.error(e.__str__())
                logging.exception(e)
        return rt

    #查询一个项目最小的数据周期是多少
    def getMinPeriod(self, dbName):
        collectionList = self.getAllCollections()
        res_list = []
        if len(collectionList) > 0:
            for name in collectionList:
                if dbName in name:
                    res_list.append(name)
            for item in res_list:
                if 'm1' in item:
                    return 'm1'
                elif 'm5' in item:
                    return 'm5'
                elif 'h1' in item:
                    return 'h1'
                elif 'd1' in item:
                    return 'd1'
                elif 'month' in item:
                    return 'M1'
        return ''


    def shareLogGet(self,userId):
        shareLogList = []
        userId = int(userId)
        post = {'userId': userId}
        try:
            cursor = self.mdbBb[g_tableShareLog].find(post)
            if cursor.count() > 0:
                for item in cursor:
                    if ObjectId.is_valid(item['_id']):
                        id = item['_id'].__str__()
                    menuItemId = item.get('menuItemId')
                    # url = item['url']
                    date = item['date']
                    description = item['desc']
                    shareLogList.append({'shareLogId': id, 'userId': userId, 'menuItemId': menuItemId, 'shareDate': date, 'shareDesc': description})
            else:
                cursor = self.mdbBb[g_tableSpringLayout].find({'creatorId': userId})
                for item in cursor:
                    menuItemId = item.get('menuItemId')
                    if menuItemId.find('SHARE') != -1:
                        id = ObjectId()
                        shareLogList.append({'shareLogId': id.__str__(), 'userId': userId, 'menuItemId': menuItemId, 'shareDate': datetime.now(), 'shareDesc': ''})
                        post = {'_id': id, 'userId': userId, 'desc': '', 'date': datetime.now(), 'menuItemId': menuItemId}
                        self.mdbBb[g_tableShareLog].save(post)
            shareLogList.sort(key=lambda x:x['shareDate'],reverse=True)
        except Exception as e:
            print('shareLogGet failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
        return shareLogList

    def shareLogSave(self,userId,menuItemId,data):
        rt = {'status': 'unprocess'}
        initDesc = data.get('desc')
        mode = data.get('mode')
        userId = int(userId)
        if self.mdbBb[g_tableShareLog].find({'userId':userId}).count() == 0:
            cursor = self.mdbBb[g_tableSpringLayout].find({'creatorId': userId})
            for item in cursor:
                menuItemId = item.get('menuItemId')
                if not isinstance(menuItemId,str):
                    continue
                if menuItemId.find('SHARE') != -1:
                    id = ObjectId()
                    post = {'_id': id, 'userId': userId, 'desc': '', 'date': datetime.now(), 'menuItemId': menuItemId}
                    self.mdbBb[g_tableShareLog].save(post)
        if isinstance(userId, int) and isinstance(menuItemId, str):
            if not mode:
                post = {'_id': ObjectId(), 'userId': userId, 'desc': initDesc, 'date': datetime.now(), 'menuItemId': menuItemId}
                try:
                    self.mdbBb[g_tableShareLog].save(post)
                    rt = {'status': 'success'}
                except Exception as e:
                    print('Save ShareLog Failed')
                    print(e.__str__())
                    logging.error(e.__str__())
                    logging.exception(e)
                    rt = {'status': 'failed'}
            else:
                shareId = ObjectId(data.get('shareLogId')) if ObjectId.is_valid(data.get('shareLogId')) else None
                if shareId:
                    post = {'_id': shareId}
                    doc = {'$set': {'date': datetime.now()}}
                    try:
                        self.mdbBb[g_tableShareLog].update(post, doc)
                    except Exception as e:
                        print('shareLogSave failed')
                        rt = {'status': 'save failed'}
                    rt = {'status': 'change page success'}
        return rt

    def shareLogEdit(self, data, editMode):
        rt = {'status':'unprocess'}
        shareId = ObjectId(data.get('shareId')) if ObjectId.is_valid(data.get('shareId')) else None
        if shareId:
            menuItemId = data.get('menuItemId')
            desc = data.get('desc')
            post = {'_id': shareId}
            doc = {'$set': {'desc': desc}}
            if editMode == 0:
                try:
                    self.mdbBb[g_tableShareLog].update(post, doc)
                except Exception as e:
                    print('shareLogEdit failed')
                    rt = {'status': 'edit failed'}
                rt = {'status':'edit success'}
            else:
                try:
                    self.mdbBb[g_tableShareLog].remove(post)
                    self.mdbBb[g_tableSpringLayout].remove({'menuItemId':menuItemId})
                except Exception as e:
                    print('shareLogEdit failed')
                    print(e.__str__())
                    logging.error(e.__str__())
                    logging.exception(e)
                    rt = {'status': 'remove failed'}
                rt = {'status':'remove success'}
        return rt

    def checkDatasourceBeforeDelete(self, datasourceItemId, userId):
        checkInfo = {}
        workspaceInfoList = []
        springLayoutInfoList = []
        if ObjectId.is_valid(datasourceItemId) and userId > 0:
            if isinstance(datasourceItemId, str):
                userId = int(userId)
                workspaceList = []
                ret = self.mdbBb[g_tableWorkspaceAdditional].find_one({'userId':userId})
                if ret != None:
                    workspaceList = ret.get('workspaceOrder', [])
                for workspaceId in workspaceList:
                    mdList, dsInfoList = self.analysisGetModals(workspaceId)
                    wsname = ''
                    rt = self.mdbBb[g_tableWorkspaceItem].find_one({'_id':ObjectId(workspaceId)})
                    if rt != None:
                        wsname = rt.get('name', '')
                    try:
                        for md in mdList:
                            mdid = md.get('id')
                            op = md.get('option')
                            mdname = md.get('name')
                            mdtype = md.get('type')
                            if op != None:
                                dsList = op.get('itemDS')
                                if dsList != None:
                                    for ds in dsList:
                                        arrId = ds.get('arrId')
                                        if arrId != None:
                                            for id in arrId:
                                                if id == datasourceItemId:
                                                    workspaceInfoList.append({'workspaceName':wsname, 'modalName':mdname, 'modalType':mdtype, 'userId':userId})
                        checkInfo['workspaceInfo'] = workspaceInfoList
                    except Exception as e:
                        print('checkDatasourceBeforeDelete workspace failed')
                        print(e.__str__())
                        logging.error(e.__str__())
                        logging.exception(e)
                try:
                    dicIdText = {}
                    cur = self.mdbBb[g_tableCustomNavItem].find({})
                    if cur != None:
                        for item in cur:
                            dicIdText[item.get('_id').__str__()] = item.get('text')

                    post = {'creatorId':userId}
                    cur = self.mdbBb[g_tableSpringLayout].find(post)
                    for item in cur:
                        menuid = item.get('menuItemId')
                        layoutList = item.get('layout')
                        if layoutList != None:
                            for lay in layoutList:
                                for layout in lay:
                                    md = layout.get('modal')
                                    if md != None:
                                        mdText = md.get('modalText')
                                        points = md.get('points')
                                        mdtype = md.get('type')
                                        if points != None:
                                            for point in points:
                                                if point == datasourceItemId:
                                                    springLayoutInfoList.append({'menuName':dicIdText.get(menuid) if dicIdText.get(menuid)!=None else '', 'modalText':mdText, 'modalType':mdtype, 'creatorId':userId})
                    checkInfo['dashboardInfo'] = springLayoutInfoList
                except Exception as e:
                    print('checkDatasourceBeforeDelete springlayout failed')
                    print(e.__str__())
                    logging.error(e.__str__())
                    logging.exception(e)
        else:
            checkInfo = {'error':'datasourceId or datasourceItemId is invalid'}
        return checkInfo

    def benchmarkSaveMenu(self, data):
        if isinstance(data, dict):
            userId = int(data.get('userId')) if data.get('userId') != None else 0
            projectId = int(data.get('projectId')) if data.get('projectId') != None else 0
            benchmarkIds = data.get('benchmarkIds') if data.get('benchmarkIds') != None else []
            try:
                post = {'userId':userId, 'projectId':projectId}
                doc = {'$set':{'benchmarkIds':benchmarkIds,'userId':userId, 'projectId':projectId}}
                self.mdbBb[g_tableCustomNav].update(post, doc, upsert=True)
            except Exception as e:
                print('benchmarkSaveMenu failed')
                print(e.__str__())
                logging.error(e.__str__())
                logging.exception(e)
        return None

    def benchmarkGetBaseMenu(self, groupId=1):
        rt = []
        try:
            post = {}
            cursor = self.mdbBb[g_tableBenchmark].find(post)
            for item in cursor:
                if item.get('_id') != None and isinstance(item.get('_id'), ObjectId):
                    item.update({'id':item.get('_id').__str__()})
                    item.pop('_id')
                rt.append(item)
        except Exception as e:
            print('benchmarkGetBaseMenu failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
        return rt

    def benchmarkSaveBaseMenu(self, data):
        rt = ''
        if isinstance(data, dict):
            try:
                id = data.get('id')
                name = data.get('name') if data.get('name') != None else ''
                menuId = data.get('menuId') if data.get('menuId') != None else ''
                type = data.get('type') if data.get('type') != None else ''
                parent = data.get('parent') if data.get('parent') != None else ''
                title = data.get('title') if data.get('title') != None else ''
                description = data.get('description') if data.get('description') != None else ''
                unit = data.get('unit') if data.get('unit') != None else ''
                desc = int(data.get('desc')) if data.get('desc') != None else False
                points = data.get('points') if data.get('points') != None else []
                post = {}
                obid = None
                if id != None:
                    obid = ObjectId(id)
                else:
                    obid = ObjectId()
                post = {'_id':obid, 'name':name, 'menuId':menuId, 'type':type, 'parent':parent, 'title':title, 'description':description, 'unit':unit, 'desc':desc, 'points':points}
                self.mdbBb[g_tableBenchmark].save(post)
                if obid != None:
                    rt = obid.__str__()
            except Exception as e:
                print('benchmarkSaveBaseMenu failed')
                print(e.__str__())
                logging.error(e.__str__())
                logging.exception(e)
        return rt

    def benchmarkGetAll(self):
        arrPoints = []
        arrBenchmarks = []
        cursor = self.mdbBb[g_tableBenchmark].find()
        for benchmark in cursor:
            points = benchmark.get('points')
            for point in points:
                if(point not in arrPoints):
                    arrPoints.append(point)
            arrBenchmarks.append(benchmark)
        return arrBenchmarks, arrPoints

    def analysisGetDatasourceByItemId(self, itemId):
        rt = {}
        if isinstance(itemId, str):
            try:
                res = self.mdbBb[g_tableDataSource].find_one({'_id':ObjectId(itemId)})
                if res is not None and len(list(res.keys())) > 0:
                    val = res['value']
                    strNote = ''
                    if  'note' in res.keys():
                        strNote = res['note']
                    strGroupId = ''
                    if 'groupId' in res.keys():
                        strGroupId = res['groupId']
                    rt = {'type': res['type'], 'projId':res['projId'], 'alias': res['alias'], 'id': res['_id'].__str__(), 'value':val, 'note':strNote, 'groupId':strGroupId}
            except Exception as e:
                print('analysisGetDatasourceByItemId failed')
                print(e.__str__())
                logging.error(e.__str__())
                logging.exception(e)
        return rt

    def analysisModalMove(self, userId, srcWsId, destWsId, moveModalIdList):
        oSrcWsId = ObjectId(srcWsId)
        oDestWsId = ObjectId(destWsId)

        try:
            # 先删除
            post = {'_id': oSrcWsId}
            dic = {'$pullAll': {'modalOrder': moveModalIdList}}
            self.mdbBb[g_tableWorkspaceItem].update(post, dic)
            # 再新增
            post = {'_id': oDestWsId}
            dic = {'$push': {'modalOrder': {'$each': moveModalIdList}}}
            self.mdbBb[g_tableWorkspaceItem].update(post, dic)
        except Exception as e:
            print('analysisModalMove failed')
            print(e.__str__())
            logging(e.__str__())
            logging.exception(e)
            return {'status': 'ERROR'}
        return {'status': 'OK'}

#analysis reconstruction from 2015-07-29

    def getWikiById(self, wikiId):
        rt = {}
        try:
            if ObjectId.is_valid(wikiId):
                post = {'_id': ObjectId(wikiId)}
                cursor = self.mdbBb[g_tableWiki].find(post)
                for item in cursor:
                    rt = {'id': item.get('_id').__str__(), 'creatorId': item.get('creatorId'), 'modifyTime': item.get('modifyTime'), 'title': item.get('title'), 'content': item.get('content'), 'tagStrArr': item.get('tagStrArr'), 'tagProjectIdArr': item.get('tagProjectIdArr')}
        except Exception as e:
            print('getWikiById failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
        return rt

    def insertIntoWiki(self, wiki):
        rt = {}
        try:
            id = ObjectId()
            rt = self.mdbBb[g_tableWiki].insert({'_id': id, 'creatorId': wiki.get('creatorId'), 'modifyTime': datetime.now().strftime('%Y-%m-%d %H:%M'), 'title': wiki.get('title'), 'content': wiki.get('content'), 'enable': 1, 'tagStrArr': wiki.get('tagStrArr'), 'tagProjectIdArr': wiki.get('tagProjectIdArr')})
        except Exception as e:
            print('insertIntoWiki failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
        return rt

    def updateWiki(self, wiki):
        rt = {}
        try:
            id = ObjectId(wiki.get('id'))
            post = {'_id': id}
            doc = {'$set': {'modifyTime': datetime.now().strftime('%Y-%m-%d %H:%M'), 'title': wiki.get('title'), 'content': wiki.get('content'), 'enable': 1, 'tagStrArr': wiki.get('tagStrArr'), 'tagProjectIdArr': wiki.get('tagProjectIdArr')}}
            rt = self.mdbBb[g_tableWiki].update(post, doc)
        except Exception as e:
            print('updateWiki failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
        return rt


    def deleteWiki(self, id):
        rt = {}
        try:
            post = {'_id': ObjectId(id)}
            rt = self.mdbBb[g_tableWiki].remove(post)
        except Exception as e:
            print('deleteWiki failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
        return rt

    def getWikiByKeywordsAndProjectId(self, keywords, projectId):
        rt = []
        try:
            if len(projectId) == 1:
                post = {'tagStrArr': {'$all': keywords}, 'tagProjectIdArr': {'$all': projectId}}
            else:
                post = {'tagStrArr':{'$all': keywords},'$or': [{'tagProjectIdArr': {'$in': projectId}}, {'tagProjectIdArr': {'$size': 0}}]}
            cursor = self.mdbBb[g_tableWiki].find(post)
            for item in cursor:
                wiki = {'id': item.get('_id').__str__(), 'creatorId': item.get('creatorId'), 'modifyTime': item.get('modifyTime'), 'title': item.get('title'), 'content': item.get('content'), 'tagStrArr': item.get('tagStrArr'), 'tagProjectIdArr': item.get('tagProjectIdArr')}
                rt.append(wiki)
        except Exception as e:
            print('getWikiByKeywordsAndProjectId failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
        return rt

    def getAllWiki(self, projectIds):
        rt = []
        try:
            post = {'$or': [{'tagProjectIdArr': {'$in': projectIds}}, {'tagProjectIdArr': {'$size': 0}}]}
            cursor = self.mdbBb[g_tableWiki].find(post)
            for item in cursor:
                wiki = {'id': item.get('_id').__str__(), 'creatorId': item.get('creatorId'), 'modifyTime': item.get('modifyTime'), 'title': item.get('title'), 'content': item.get('content'), 'tagStrArr': item.get('tagStrArr'), 'tagProjectIdArr': item.get('tagProjectIdArr')}
                rt.append(wiki)
        except Exception as e:
            print('getAllWiki failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
        return rt

    def anlySync(self, userId, data):
        status1 = 0
        status2 = 0
        try:
            # import pdb; pdb.set_trace()
            # 同步 工作空间 的数据
            if 'ws' in data:
                status1 = self.anlySyncWs(userId, data['ws'])
            if 'tpl' in data:
                status2 = self.anlySyncTpl(userId, data['tpl'])
        except Exception as e:
            print('anlySync failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
            return {'status': 'ERROR'}

        if status1 == 0 and status2 == 0:
            return {'status': 'OK'}
        else:
            return {'status': 'ERROR'}


    def anlySyncWs(self, userId, data):
        #import pdb; pdb.set_trace()
        try:
            #import pdb; pdb.set_trace()
            if ('delete' in data) or ('create' in data):
                # 先做删除
                if 'delete' in data:
                    ids = []
                    for item in data['delete']:
                        ids.append(item['id'])
                    oIds = [ObjectId(x) for x in ids]

                    # 删除顺序：从外联表开始删，最后删除本表
                    # 先删除 modals
                    delModalIds = []
                    wsItemCur = self.mdbBb[g_tableWorkspaceItem].find({'_id': {'$in':oIds}})
                    if wsItemCur != None:
                        for wsItem in wsItemCur:
                            delModalIds = delModalIds + wsItem.get('modalOrder', [])
                        if len(delModalIds) > 0:
                            self.mdbBb[g_tableModal].delete_many({'_id': {'$in':[ObjectId(x) for x in delModalIds]}})

                    # 删除 workspaceItems
                    self.mdbBb[g_tableWorkspaceItem].delete_many({'_id': {'$in':oIds}})
                    # 更新 additional 表的 workspaceOrder 字段
                    post = {'userId': userId}
                    doc = {'$pull': { 'workspaceOrder': {'$in':ids}} }
                    self.mdbBb[g_tableWorkspaceAdditional].update(post, doc)

                # 新增
                if 'create' in data:
                    # 拿到 workspaceList
                    post = {'userId': userId}
                    cursor = self.mdbBb[g_tableWorkspaceAdditional].find_one(post)
                    ids = []
                    wsOrder = []
                    # 需要处理第一次的情况
                    if cursor == None:
                        self.mdbBb[g_tableWorkspaceAdditional].insert_one({'_id': ObjectId(), 'workspaceOrder': [], 'userId': userId});
                    else:
                        wsOrder = cursor['workspaceOrder']
                        wsCur = self.mdbBb[g_tableWorkspaceItem].find({'_id': {'$in': [ObjectId(x) for x in wsOrder]}}, {'_id': 1})
                        if wsCur != None:
                            for ws in wsCur:
                                ids.append(ws['_id'].__str__())

                    wsList = []
                    # 将要加入到 workspaceItem 表中的 ws id
                    addedIds = []
                    # 将要加入到 workspaceOrder 字段中的 ws id，和上者可能不一样
                    orderAddedIds = []
                    modalList = []
                    for item in data['create']:
                        # 防止重复插入
                        if item['id'] in ids:
                            continue
                        if not(item['id'] in wsOrder):
                            orderAddedIds.append(item['id'])
                        item['modalOrder'] = []
                        addedIds.append(item['id'])
                        # 将 string 类型的 id 转换为 ObjectId 类型
                        item['_id'] = ObjectId(item['id'])
                        item.pop('id')
                        for modal in item['modalList']:
                            item['modalOrder'].append(modal['id'])
                            modal['_id'] = ObjectId(modal['id'])
                            del modal['id']
                            if 'imagebin' in modal:
                                modal['imagebin'] = bytes(modal['imagebin'].encode())
                        modalList = modalList + item['modalList']
                        del item['modalList']
                        wsList.append(item)
                    # 更新 workspaceOrder 字段
                    if len(addedIds) > 0:
                        self.mdbBb[g_tableWorkspaceAdditional].update(post, {'$push': {'workspaceOrder': {'$each': orderAddedIds}}})
                    if len(wsList) > 0:
                        self.mdbBb[g_tableWorkspaceItem].insert_many(wsList)
                    if len(modalList) > 0:
                        self.mdbBb[g_tableModal].insert_many(modalList)

            # 更新
            if 'update' in data:
                # import pdb; pdb.set_trace()
                fields = {}
                for item in data['update']:
                    # 从数据库中取出需要 update 的 workspace 的数据
                    post = {'_id': ObjectId(item['id'])}
                    fields = {}

                    # 针对每个字段进行处理
                    if 'name' in item:
                        fields['name'] = item['name']
                    if 'modifyTime' in item:
                        fields['modifyTime'] = item['modifyTime']
                    if bool(fields):
                        doc = {'$set': fields}
                        self.mdbBb[g_tableWorkspaceItem].update(post, doc)

                    if 'modal' in item:
                        self.anlySyncWsModal(userId, item['id'], item['modal'])

        except Exception as e:
            print('anlySyncWs failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
            return -1
        return 0

    def anlySyncWsModal(self, userId, wsId, data):
        oWsId = ObjectId(wsId)
        try:
            #import pdb; pdb.set_trace()
            if ('delete' in data) or ('create' in data):
                # 删除
                if 'delete' in data:
                    ids = []
                    for item in data['delete']:
                        ids.append(item['id'])
                    self.mdbBb[g_tableModal].delete_many({'_id': {'$in':[ObjectId(x) for x in ids]} })
                    # 更新 additional 表的 workspaceOrder 字段
                    post = {'_id': oWsId}
                    doc = {'$pull': { 'modalOrder': {'$in':ids}} }
                    self.mdbBb[g_tableWorkspaceItem].update(post, doc)

                # 新增
                if 'create' in data:
                    # 拿到 modalIdList
                    post = {'_id': oWsId}
                    projection = {'modalOrder': 1}
                    cursor = self.mdbBb[g_tableWorkspaceItem].find_one(post, projection)
                    modalOrder = cursor.get('modalOrder', [])
                    modalCur = self.mdbBb[g_tableModal].find({'_id': {'$in': [ObjectId(x) for x in modalOrder]}}, {'_id': 1})
                    ids = []
                    for modal in modalCur:
                        ids.append(modal['_id'].__str__())

                    modalList = []
                    addedIds = []
                    orderAddedIds = []
                    for item in data['create']:
                        # 防止重复插入
                        if item['id'] in ids:
                            continue
                        addedIds.append(item['id'])
                        if not(item['id'] in modalOrder):
                            orderAddedIds.append(item['id'])
                        # 将 string 类型的 id 转换为 ObjectId 类型
                        item['_id'] = ObjectId(item['id'])
                        del item['id']
                        if 'imagebin' in item:
                            item['imagebin'] = bytes(item['imagebin'].encode())
                        modalList.append(item)
                    # 重新生成 modalOrder
                    if len(addedIds) > 0:
                        self.mdbBb[g_tableWorkspaceItem].update(post, {'$push': {'modalOrder': {'$each': orderAddedIds}}})
                    if len(modalList) > 0:
                        self.mdbBb[g_tableModal].insert_many(modalList)

            # 更新
            if 'update' in data:
                for item in data['update']:
                    # 查找 index
                    fields = {}
                    # 逐字段修改
                    if 'name' in item:
                        fields['name'] = item['name']
                    if 'modifyTime' in item:
                        fields['modifyTime'] = item['modifyTime']
                    if 'note' in item:
                        fields['note'] = item['note']
                    if 'type' in item:
                        fields['type'] = item['type']
                    if 'imagebin' in item:
                        fields['imagebin'] = bytes(item['imagebin'].encode())
                    if 'option' in item:
                        fields['option'] = item['option']
                    if bool(fields):
                        post = {'_id': ObjectId(item['id'])}
                        doc = {'$set': fields}
                        self.mdbBb[g_tableModal].update(post, doc)

        except Exception as e:
            print('anlySyncWsModal failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
            return -1
        return 0

    def anlySyncTpl(self, userId, data):
        try:
            #import pdb; pdb.set_trace()
            if ('delete' in data) or ('create' in data):
                # 先做删除
                if 'delete' in data:
                    ids = []
                    for item in data['delete']:
                        ids.append(item['id'])
                    oIds = [ObjectId(x) for x in ids]
                    # 删除顺序：从外联表开始删，最后删除本表
                    # 先删除 modals
                    delModalIds = []
                    tplItemCur = self.mdbBb[g_tableTemplateAdditional].find({'_id': {'$in':oIds}})
                    if tplItemCur != None:
                        for tplItem in tplItemCur:
                            delModalIds = delModalIds + tplItem.get('modalOrder', [])
                        if len(delModalIds) > 0:
                            self.mdbBb[g_tableModal].delete_many({'_id': {'$in':[ObjectId(x) for x in delModalIds]}})
                    # 删除 templateItem
                    self.mdbBb[g_tableTemplateAdditional].delete_many({'_id': {'$in':oIds} })

                # 新增
                if 'create' in data:
                    # 拿到 workspaceList
                    post = {'creatorId': userId}
                    # 只取 id
                    projection = {'_id': 1}
                    cursor = self.mdbBb[g_tableTemplateAdditional].find(post, projection)
                    ids = []
                    for tpl in cursor:
                        ids.append(tpl['_id'].__str__())

                    addList = []
                    modalList = []
                    for item in data['create']:
                        # 防止重复插入
                        if item['id'] in ids:
                            continue
                        item['modalOrder'] = []
                        # 将 string 类型的 id 转换为 ObjectId 类型
                        item['_id'] = ObjectId(item['id'])
                        del item['id']
                        for modal in item['modalList']:
                            item['modalOrder'].append(modal['id'])
                            modal['_id'] = ObjectId(modal['id'])
                            del modal['id']
                            if 'imagebin' in modal:
                                modal['imagebin'] = bytes(modal['imagebin'].encode())
                        modalList = modalList + item['modalList']
                        del item['modalList']
                        addList.append(item)
                    if len(addList) > 0:
                        self.mdbBb[g_tableTemplateAdditional].insert_many(addList)
                    if len(modalList) > 0:
                        self.mdbBb[g_tableModal].insert_many(modalList)

            # 更新
            if 'update' in data:
                # import pdb; pdb.set_trace()
                fields = {}
                for item in data['update']:
                    # 从数据库中取出需要 update 的 workspace 的数据
                    post = {'creatorId': userId, '_id': ObjectId(item['id'])}
                    fields = {}

                    # 针对每个字段进行处理
                    if 'name' in item:
                        fields['name'] = item['name']
                    if 'modifyTime' in item:
                        fields['modifyTime'] = item['modifyTime']
                    if bool(fields):
                        doc = {'$set': fields}
                        self.mdbBb[g_tableTemplateAdditional].update(post, doc)

                    if 'modal' in item:
                        self.anlySyncTplModal(userId, item['id'], item['modal'])

        except Exception as e:
            print('anlySyncTpl failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
            return -1
        return 0

    def anlySyncTplModal(self, userId, tplId, data):
        oTplId = ObjectId(tplId)
        try:
            #import pdb; pdb.set_trace()
            if ('delete' in data) or ('create' in data):
                # 删除
                if 'delete' in data:
                    ids = []
                    for item in data['delete']:
                        ids.append(item['id'])
                    self.mdbBb[g_tableModal].delete_many({'_id': {'$in':[ObjectId(x) for x in ids]} })
                    # 更新 additional 表的 modalOrder 字段
                    post = {'_id': oTplId}
                    doc = {'$pull': { 'modalOrder': {'$in':ids}} }
                    self.mdbBb[g_tableTemplateAdditional].update(post, doc)

                # 新增
                if 'create' in data:
                    # 拿到 modalIdList
                    post = {'_id': oTplId}
                    projection = {'modalOrder': 1}
                    cursor = self.mdbBb[g_tableTemplateAdditional].find_one(post, projection)
                    modalOrder = cursor.get('modalOrder',[])
                    modalCur = self.mdbBb[g_tableModal].find({'_id': {'$in': [ObjectId(x) for x in modalOrder]}}, {'_id': 1})
                    ids = []
                    for modal in modalCur:
                        ids.append(modal['_id'].__str__())

                    modalList = []
                    addedIds = []
                    orderAddedIds = []
                    for item in data['create']:
                        # 防止重复插入
                        if item['id'] in ids:
                            continue
                        addedIds.append(item['id'])
                        if not(item['id'] in modalOrder):
                            orderAddedIds.append(item['id'])
                        # 将 string 类型的 id 转换为 ObjectId 类型
                        item['_id'] = ObjectId(item['id'])
                        del item['id']
                        if 'imagebin' in item:
                            item['imagebin'] = bytes(item['imagebin'].encode())
                        modalList.append(item)
                    # 重新生成 modalOrder
                    if len(addedIds) > 0:
                        self.mdbBb[g_tableTemplateAdditional].update(post, {'$push': {'modalOrder': {'$each': orderAddedIds}}})
                    if len(modalList) > 0:
                        self.mdbBb[g_tableModal].insert_many(modalList)

            # 更新
            if 'update' in data:
                for item in data['update']:
                    # 查找 index
                    fields = {}
                    # 逐字段修改
                    if 'name' in item:
                        fields['name'] = item['name']
                    if 'modifyTime' in item:
                        fields['modifyTime'] = item['modifyTime']
                    if 'note' in item:
                        fields['note'] = item['note']
                    if 'type' in item:
                        fields['type'] = item['type']
                    if 'imagebin' in item:
                        fields['imagebin'] = bytes(item['imagebin'].encode())
                    if 'option' in item:
                        fields['option'] = item['option']
                    if bool(fields):
                        post = {'_id': ObjectId(item['id'])}
                        doc = {'$set': fields}
                        self.mdbBb[g_tableModal].update(post, doc)

        except Exception as e:
            print('anlySyncTplModal failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
            return -1
        return 0

    def getOrderedArrayFromCursor(self, cursor, orderList):
        curMap = {}
        orderMap = []
        for item in cursor:
            curMap[item['_id'].__str__()] = item
        for strId in orderList:
            if strId in curMap:
                orderMap.append(curMap[strId])
        return orderMap

    def analysisGetWorkspaces(self, userId, wsId=None):
        wsCur = None
        try:
            wsList = []
            dsList = []
            modalsNeedDs = []

            # 获取用户的 workspace 列表
            wsOrder = []
            findRs = self.mdbBb[g_tableWorkspaceAdditional].find_one({'userId':userId}, {'workspaceOrder': 1, '_id': 0})
            if findRs is None:
                return [], []
            wsOrder = findRs['workspaceOrder']
            wsItems = []
            modalOrder = None
            modalCur = None
            dsOwnerId = None
            wsCur = self.mdbBb[g_tableWorkspaceItem].find({'_id':{'$in':[ObjectId(x) for x in wsOrder]}})
            if wsCur:
                wsOrderedArr = self.getOrderedArrayFromCursor(wsCur, wsOrder)
                wsCur.close()
                for ws in wsOrderedArr:
                    # 根据前端需要，将 _id 转换成 id
                    ws['id'] = ws['_id'].__str__()
                    ws.pop('_id')

                    # 若不存在 templateId
                    if not ObjectId.is_valid(ws.get('templateId','')):
                        # 根据 modalOrder 的 length 设置 modalCount 字段
                        modalOrder = ws.get('modalOrder', [])
                        ws['modalCount'] = len(modalOrder)
                    # 若存在，级联 templateAdditional 表，查询 modalOrder
                    else:
                        tpl = self.mdbBb[g_tableTemplateAdditional].find_one({'_id':ObjectId(ws.get('templateId'))})
                        if tpl is None:
                            modalOrder = []
                        else:
                            modalOrder = tpl.get('modalOrder', [])
                        ws['modalCount'] = len(modalOrder)

                    ws['modalList'] = []
                    # 如果设置了 wsId，则需要继续级联 modal 表查询 modalList 的信息
                    if wsId and wsId == ws['id']:
                        # import pdb; pdb.set_trace()
                        ws['modalList'], dsList = self.analysisGetModals(ws)
                        ws['modalCount'] = -1
                    ws.pop('modalOrder')
                    wsList.append(ws)
        except Exception as e:
            print('getWorkspaces failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
            return [], []
        finally:
            if wsCur != None:
                wsCur.close()
        return wsList, dsList

    def analysisGetModals(self, data):
        modalList = []
        dsList = []
        modalsNeedDs = []
        modalCur = None
        ws = None

        try:
            if isinstance(data, dict):
                ws = data
            else:
                # 在 workspaceItem 表中，查找 workspace
                ws = self.mdbBb[g_tableWorkspaceItem].find_one({'_id': ObjectId(data)})

            if ws is None:
                return [],[]

            if not ObjectId.is_valid(ws.get('templateId','')):
                modalOrder = ws.get('modalOrder', [])
            else:
                tpl = self.mdbBb[g_tableTemplateAdditional].find_one({'_id':ObjectId(ws.get('templateId'))})
                if tpl is None:
                    modalOrder = []
                else:
                    modalOrder = tpl.get('modalOrder', [])

            # 两种情况，保留副本的引用 和 不保留副本的引用
            if ObjectId.is_valid(ws.get('templateId','')) or not(ws.get('dsOwnerId') is None):
                # 引用自模板的话，需要生成 dsList
                modalsNeedDs = modalOrder

            if len(modalOrder) > 0:
                modalCur = self.mdbBb[g_tableModal].find({'_id':{'$in':[ObjectId(x) for x in modalOrder]}})
                if modalCur.count() > 0:
                    modalOrderedArr = self.getOrderedArrayFromCursor(modalCur, modalOrder)
                    modalCur.close()
                    for modal in modalOrderedArr:
                        # 根据前端需要，将 _id 转换成 id
                        if isinstance(modal.get('_id'), ObjectId):
                            modal['id'] = modal['_id'].__str__()
                            modal.pop('_id', None)
                            # 不需要 imagebin 字段
                            modal.pop('imagebin', None)
                            # 去除遗留数据
                            # 说明：老版本会将 __observeProps 存入数据库中，新版本已经不会，
                            #       此处是为了修复老版本的遗留数据的影响，后期这行代码可以视情况去除
                            modal.pop('__observeProps', None)
                            modalList.append(modal)

            # 获取引用来自模板的工作空间中，数据源的信息
            if len(modalsNeedDs) > 0:
                ids = []
                dsOwnerId = ws.get('dsOwnerId')
                # 去重
                modalsNeedDs = list(set(modalsNeedDs))
                modalCur = self.mdbBb[g_tableModal].find({'_id':{'$in':[ObjectId(x) for x in modalsNeedDs]}})
                if modalCur.count() > 0:
                    for modal in modalCur:
                        if 'option' in modal:
                            itemDsList = modal['option'].get('itemDS', [])
                            for itemDs in itemDsList:
                                ids = ids + itemDs.get('arrId', [])
                if dsOwnerId is None:
                    for itemId in list(set(ids)):
                        dsList.append(self.analysisGetDatasourceByItemId(itemId))
                else:
                    dsList = self.analysisGetDataSourceByIdList( dsOwnerId, list(set(ids)) )

        except Exception as e:
            print('getWorkspaces failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
            return [], []
        finally:
            if modalCur != None:
                modalCur.close()
        return modalList, dsList

    def analysisGetMultiModals(self, wsIdList):
        rs = {}
        for wsId in wsIdList:
            modalList, dsList = self.analysisGetModals(wsId)
            rs[wsId] = {'modalList': modalList, 'dsInfoList': dsList}
        return rs

    def getThumbnails(self, modalIdList):
        thumbs = {}
        modalCur = None
        try:
            modalCur = self.mdbBb[g_tableModal].find({'_id':{'$in':[ObjectId(x) for x in modalIdList]}}, {'imagebin': 1, '_id': 1})
            for modal in modalCur:
                try:
                    imagebin = str(modal.get('imagebin', bytes()).decode())
                    if imagebin != '':
                        thumbs[modal['_id'].__str__()] = imagebin
                except Exception as e:
                    print( e.__str__() )
        except Exception as e:
            print('getImagebin failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
            return {}
        finally:
            if modalCur != None:
                modalCur.close()
        return thumbs

    def analysisWorkspaceSaveOrder(self, userId, idList):
        rt = True
        try:
            post = {'userId': userId}
            doc = {'$set':{'workspaceOrder':idList}}
            self.mdbBb[g_tableWorkspaceAdditional].update(post, doc)
        except Exception as e:
            print('analysisWorkspaceSaveOrder failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
            rt = False
        return rt

    def analysisModalSaveOrder(self, userId, id, idList, isTemplate=0):
        rt = True
        dbTable = None
        try:
            if isTemplate:
                post = {'creatorId': userId, '_id': ObjectId(id)}
                dbTable = g_tableTemplateAdditional
            else:
                post = {'_id': ObjectId(id)}
                dbTable = g_tableWorkspaceItem
            doc = {'$set': {'modalOrder': idList}}
            self.mdbBb[dbTable].update(post, doc)
        except Exception as e:
            print('analysisModalSaveOrder failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
            rt = False
        return rt

    def analysisGetDataSourceByIdList(self, userId, idList):
        userDsList = self.analysisDataSourceGet(userId)
        if len(userDsList) == 0:
            return []
        dsList = []
        for userDs in userDsList:
            if userDs['id'].__str__() in idList:
                dsList.append(userDs)
        return dsList

#### 温控 app 接口 ####
    # 获取所有的房间列表
    # def appTempGetRoomList(self, userId=None):
    #     buildingList = []
    #     roomList = []
    #
    #     try:
    #         # 获取所有的 buidling list
    #         buildingCursor = self.mdbBb[g_tableBuilding].find();
    #         for item in buildingCursor:
    #             item['id'] = item['_id'].__str__()
    #             del item['_id']
    #             buildingList.append(item)
    #         roomCursor = self.mdbBb[g_tableAppTempRoom].find();
    #         for item in roomCursor:
    #             item['id'] = item['_id'].__str__()
    #             del item['_id']
    #             item['buildingId'] = item['buildingId'].__str__()
    #             item['map'] = item.get('map', {})
    #             item['map']['img'] = str( item['map'].get( 'img', bytes() ).decode() )
    #             roomList.append(item)
    #
    #     except Exception as e:
    #         print('appTempGetRoomList failed')
    #         print(e.__str__())
    #         logging.error(e.__str__())
    #         logging.exception(e)
    #     return buildingList, roomList

    # 获取一个房间的详细信息
    def app_temp_get_room_detail(self, roomId):
        '''
        :param roomId: iot_group._idPrt,
               spaceId: iot_group._id, iot_thing.arrIdGrp

        :return:{'space':[], 'sensor':[], 'controller':[]}
        '''
        rt = {'space':[], 'device':[]}
        cursor = None
        try:
            if not ObjectId.is_valid(roomId):
                raise Exception('RoomId format is not correct')
            # get space info
            spaceidlist = []
            cursor = self.mdbBb[g_table_iot_group].find({'_idPrt':ObjectId(roomId)})
            for space in cursor:
                spaceidlist.append(space.get('_id'))
                rt.get('space').append({'_id':space.get('_id').__str__(), 'projId':space.get('projId'), 'name':space.get('name'),
                                        'pId':space.get('_idPrt').__str__(), 'prefix':space.get('prefix'),
                                        '_idProj':space.get('_idProj').__str__(),'type':space.get('type'), 'arrP':space.get('arrp'),
                                        'params':space.get('params')})
            if cursor:
                cursor.close()
            #get sensor info
            cursor = self.mdbBb[g_table_iot_things].find({'arrIdGrp':{'$in':[ObjectId(i) for i in spaceidlist]}})
            for sensor in cursor:
                rt.get('device').append({'_id':sensor.get('_id').__str__(), 'type':sensor.get('type'),
                                         'projId':sensor.get('projId'), 'path':sensor.get('path'),
                                         'pId':[x.__str__() for x in sensor.get('arrIdGrp')],
                                         'arrP':sensor.get('arrP'), 'name':sensor.get('name'), 'prefix':sensor.get('prefix'),
                                         'params':sensor.get('params')})
            if cursor:
                cursor.close()
            #get controller info
            cursor = self.mdbBb[g_table_iot_things].find({'arrIdGrp':ObjectId(roomId)})
            for controller in cursor:
                rt.get('device').append({'_id':controller.get('_id').__str__(), 'type':controller.get('type'),
                                         'projId':controller.get('projId'), 'path':controller.get('path'),
                                         'pId':[x.__str__() for x in controller.get('arrIdGrp')],
                                         'arrP':controller.get('arrP'), 'name':controller.get('name'), 'prefix':controller.get('prefix'),
                                         'params':controller.get('params')})
        except Exception as e:
            print('app_temp_get_room_detail error:' + e.__str__())
            logging.error('app_temp_get_room_detail error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    # 获取所有的房间列表
    # def appTempGetRealtimeVal(self, sensorIds, controllerIds):
    #     buildingList = []
    #     roomList = []
    #
    #     try:
    #         # 获取所有的 buidling list
    #         buildingCursor = self.mdbBb[g_tableBuilding].find();
    #         for item in buildingCursor:
    #             item['id'] = item['_id'].__str__()
    #             del item['_id']
    #             buildingList.append(item)
    #         roomCursor = self.mdbBb[g_tableAppTempRoom].find();
    #         for item in roomCursor:
    #             item['id'] = item['_id'].__str__()
    #             del item['_id']
    #             item['buildingId'] = item['buildingId'].__str__()
    #             roomList.append(item)
    #
    #     except Exception as e:
    #         print('appTempGetRealtimeVal failed')
    #         print(e.__str__())
    #         logging.error(e.__str__())
    #         logging.exception(e)
    #     return buildingList, roomList

    # 新增一个 building
    # def appTempCreateBuilding(self, data):
    #     try:
    #         if data is None:
    #             return {'status': 'ERROR'}
    #         self.mdbBb[g_tableBuilding].insert_one({
    #             '_id': ObjectId(data['id']) if 'id' in data else ObjectId(),
    #             'name': data.get('name', ''),
    #             'address': data.get('address', ''),
    #             'principal': data.get('principal', ''),
    #             'gps': data.get('gps', '')
    #         })
    #     except Exception as e:
    #         print('appTempCreateBuilding failed')
    #         print(e.__str__())
    #         logging.error(e.__str__())
    #         logging.exception(e)
    #         return {'status': 'ERROR'}
    #     return {'status': 'OK'}

    # def appTempSaveRoom(self, dataList):
    #     try:
    #         if dataList is None:
    #             return {'status': 'ERROR', 'msg': '数据为空！'}
    #         if not isinstance(dataList, list):
    #             dataList = [dataList]
    #
    #         for data in dataList:
    #             if data.get('buildingId') == None:
    #                 return {'status': 'ERROR', 'msg': 'building id 为空！'}
    #             if data.get('id') == None:
    #                 return {'status': 'ERROR', 'msg': 'id 为空！'}
    #
    #             roomMap = data.get('map', {})
    #             oid = ObjectId(data['id']) if 'id' in data else ObjectId()
    #             self.mdbBb[g_tableAppTempRoom].update_one({
    #                 '_id': oid
    #             }, {
    #                 '$set': {
    #                     '_id': oid,
    #                     'name': data.get('name', ''),
    #                     'floor': data.get('floor', ''),
    #                     'gatewayId': data.get('gatewayId', ''),
    #                     'buildingId': ObjectId( data.get('buildingId') ),
    #                     'map': {
    #                         'img': bytes( roomMap.get('img','').encode() ),
    #                         'width': roomMap.get('width', 0),
    #                         'height': roomMap.get('height', 0),
    #                         'x': roomMap.get('x', 0),
    #                         'y': roomMap.get('y', 0),
    #                         'scale': roomMap.get('scale', 1),
    #                         'orientation': roomMap.get('orientation', 0)
    #                     }
    #                 }
    #             }, True)
    #
    #     except Exception as e:
    #         print('appTempCreateRoom failed')
    #         print(e.__str__())
    #         logging.error(e.__str__())
    #         logging.exception(e)
    #         return {'status': 'ERROR'}
    #     return {'status': 'OK'}

    # def appTempSaveSpace(self, dataList):
    #     try:
    #         if dataList is None:
    #             return {'status': 'ERROR', 'msg': '数据为空！'}
    #
    #         if not isinstance(dataList, list):
    #             dataList = [dataList]
    #
    #         for data in dataList:
    #             if data.get('roomId') == None:
    #                 return {'status': 'ERROR', 'msg': 'room id 必须要填写'}
    #
    #             oid = ObjectId(data['id']) if 'id' in data else ObjectId()
    #             self.mdbBb[g_tableAppTempSpace].update_one({
    #                 '_id': oid
    #             }, {
    #                 '$set': {
    #                     '_id': oid,
    #                     'name': data.get('name'),
    #                     'width': data.get('width', 0),
    #                     'height': data.get('height', 0),
    #                     'path': data.get('path', []),
    #                     'x': data.get('x', 0),
    #                     'y': data.get('y', 0),
    #                     'roomId': ObjectId( data.get('roomId') ),
    #                     'wallIds': data.get('wallIds', []),
    #                     'sensorIds': data.get('sensorIds', []),
    #                     'controllerIds': data.get('controllerIds', [])
    #                 }
    #             }, True)
    #     except Exception as e:
    #         print('appTempCreateSpace failed')
    #         print(e.__str__())
    #         logging.error(e.__str__())
    #         logging.exception(e)
    #         return {'status': 'ERROR'}
    #     return {'status': 'OK'}

    # def appTempSaveSensor(self, dataList):
    #     try:
    #         if dataList is None:
    #             return {'status': 'ERROR', 'msg': '数据为空！'}
    #
    #         if not isinstance(dataList, list):
    #             dataList = [dataList]
    #
    #         for data in dataList:
    #             spaceId = data.get('spaceId')
    #             if spaceId == None:
    #                 return {'status': 'ERROR', 'msg': 'space id 必须要填写'}
    #
    #             oSpaceId = ObjectId(spaceId)
    #             oSensorId = ObjectId(data['id']) if 'id' in data else ObjectId()
    #
    #             self.mdbBb[g_tableAppTempSpace].update_one({'_id': oSpaceId}, {
    #                 '$addToSet': {'sensorIds': {'$each': [oSensorId]}}
    #             })
    #
    #             self.mdbBb[g_tableAppTempSensor].update_one({
    #                 '_id': oSensorId
    #             }, {
    #                 '$set': {
    #                     '_id': oSensorId,
    #                     'name': data.get('name', 0),
    #                     'x': data.get('x', 0),
    #                     'y': data.get('y', 0),
    #                     'spaceId': oSpaceId,
    #                     'mac': data.get('mac', ''),
    #                     'network': data.get('network', '')
    #                 }
    #             }, True)
    #
    #     except Exception as e:
    #         print('appTempCreateSensor failed')
    #         print(e.__str__())
    #         logging.error(e.__str__())
    #         logging.exception(e)
    #         return {'status': 'ERROR'}
    #     return {'status': 'OK'}

    # def appTempSaveController(self, dataList):
    #     try:
    #         if dataList is None:
    #             return {'status': 'ERROR', 'msg': '数据为空！'}
    #
    #         if not isinstance(dataList, list):
    #             dataList = [dataList]
    #
    #         for data in dataList:
    #             spaceId = data.get('spaceId')
    #             if spaceId == None:
    #                 return {'status': 'ERROR', 'msg': 'space id 必须要填写'}
    #             oSpaceId = ObjectId(spaceId)
    #
    #             oControllerId = ObjectId(data['id']) if 'id' in data else ObjectId()
    #             # 先向引用中添加
    #             self.mdbBb[g_tableAppTempSpace].update_one({'_id': oSpaceId}, {
    #                 '$addToSet': {'controllerIds': {'$each': [oControllerId]}}
    #             })
    #             # 再向表中添加
    #             self.mdbBb[g_tableAppTempController].update_one({
    #                 '_id': oControllerId
    #             }, {
    #                 '$set': {
    #                     '_id': oControllerId,
    #                     'name': data.get('name', 0),
    #                     'x': data.get('x', 0),
    #                     'y': data.get('y', 0),
    #                     'spaceId': oSpaceId,
    #                     'mac': data.get('mac', ''),
    #                     'network': data.get('network', ''),
    #                     'isLocal': data.get('isLocal', 1)
    #                 }
    #             }, True)
    #
    #     except Exception as e:
    #         print('appTempCreateController failed')
    #         print(e.__str__())
    #         logging.error(e.__str__())
    #         logging.exception(e)
    #         return {'status': 'ERROR'}
    #     return {'status': 'OK'}

    # create token
    def appTempCreateToken(self, data):
        id = ''
        try:
            parmUserId = int(data.get('userId'))
            parmElapse = int(data.get('elapse'))
            parmArrRoomIds = data.get('arrRoomIds',[])
            ret = self.mdbBb[g_tableAppTempToken].save({'userId':parmUserId, 'time':datetime.now(), 'elapse':parmElapse, 'arrRoomIds':parmArrRoomIds})
            if ret:
                id = ret.__str__()
        except Exception as e:
            print('appTempCreateToken failed: ' + e.__str__())
            logging.error('appTempCreateToken failed: ' + e.__str__())
        return id

    # relate token
    def appTempCorelateToken(self, data):
        rt = False
        try:
            tableToken = self.mdbBb[g_tableAppTempToken].find_one({'_id': ObjectId(data.get('tokenId'))})
            if tableToken:
                parmArrRoomIds = tableToken.get('arrRoomIds', [])
                for item in parmArrRoomIds:
                    self.mdbBb[g_tableAppTempUserRoom].save({'userId':int(data.get('userId')), 'roomId':ObjectId(item), 'grade':0})
                rt = True
        except Exception as e:
            print('appTempCorelateToken failed: ' + e.__str__())
            logging.error('appTempCorelateToken failed: ' + e.__str__())
        return rt

    # get token
    def appTempGetTokenInfo(self, userId):
        rt = []
        try:
            userId = int(userId)
            cursor = self.mdbBb[g_tableAppTempToken].find({'userId': userId})
            if cursor:
                for item in cursor:
                    rt.append({'_id':str(item.get('_id')), 'userId':item.get('userId'), 'time':str(item.get('time')), 'elapse':item.get('elapse'), 'arrRoomIds':item.get('arrRoomIds')})
        except Exception as e:
            print('appTempDeleteToken failed: ' + e.__str__())
            logging.error('appTempDeleteToken failed: ' + e.__str__())
        return rt

    # delete token
    def appTempDeleteToken(self, id):
        rt = False
        try:
            ret = self.mdbBb[g_tableAppTempToken].delete_one({'_id':ObjectId(id)})
            if ret.deleted_count > 0:
                rt = True
        except Exception as e:
            print('appTempDeleteToken failed: ' + e.__str__())
            logging.error('appTempDeleteToken failed: ' + e.__str__())
        return rt

    # get schedule
    def appTempGetSchedule(self, roomId):
        rt = {}
        try:
            if roomId:
                res = self.mdbBb[g_tableAppTempSchedule].find_one({'roomId': ObjectId(roomId)})
                opt = res.get('option')
                if opt:
                    for key in opt:
                        if 'arrCommand' == key:
                            for subKey in opt[key]:
                                for nextSubKey in subKey:
                                    if 'controllerId' == nextSubKey:
                                        subKey[nextSubKey] = str(subKey[nextSubKey])
                rt = {'_id':str(res.get('_id')), 'roomId':str(res.get('roomId')), 'option':opt}
        except Exception as e:
            print('appTempGetSchedule failed: ' + e.__str__())
            logging.error('appTempGetSchedule failed: ' + e.__str__())
        return rt

    # save schedule
    def appTempSaveSchedule(self, data):
        rt = ''
        try:
            srcId = data.get('_id')
            if srcId:
                parmId = ObjectId(data.get('_id'))
            else:
                parmId = ObjectId()
            parmRoomId = ObjectId(data.get('roomId'))
            parmOption = data.get('option')
            if parmOption:
                for key in parmOption:
                    if key == 'moment':
                        parmOption[key] = datetime.strptime(parmOption.get(key), '%Y-%m-%d %H:%M:%S')
                    elif key == 'lastTime':
                        parmOption[key] = datetime.strptime(parmOption.get(key), '%Y-%m-%d %H:%M:%S')
                    elif key == 'userId' or key == 'isActive':
                        parmOption[key] = int(parmOption.get(key))
                    elif key == 'repeat':
                        for subKey in parmOption[key]:
                            parmOption[key][subKey] = int(subKey)
                    elif key == 'arrCommand':
                        for subKey in parmOption[key]:
                            for nextSubKey in subKey:
                                if nextSubKey == 'controllerId':
                                    subKey[nextSubKey] = ObjectId(subKey[nextSubKey])
                                elif nextSubKey == 'switch' or nextSubKey == 'sp' or nextSubKey == 'auto':
                                    subKey[nextSubKey] = int(subKey[nextSubKey])
                                elif nextSubKey == 'temp' or nextSubKey == 'speed' or nextSubKey == 'valueL':
                                    subKey[nextSubKey] = float(subKey[nextSubKey])
            self.mdbBb[g_tableAppTempSchedule].update_one({'_id': parmId}, {'$set': {'roomId': parmRoomId, 'option': parmOption}}, True)
            rt = str(parmId)
        except Exception as e:
            print('appTempGetSchedule failed: ' + e.__str__())
            logging.error('appTempGetSchedule failed: ' + e.__str__())
        return rt

    # push message
    def appTempPushMessage(self, data):
        rt = '',
        newId = ''
        try:
            srcTime = data.get('time')
            dstTime = {}
            if srcTime:
                dstTime = datetime.strptime(srcTime, '%Y-%m-%d %H:%M:%S')
            else:
                dstTime = datetime.now()
            newId = ObjectId()
            self.mdbBb[g_tableAppTempMessage].insert_one({
                '_id':newId,
                'creatorId':int(data.get('userId', 0)),
                'type': int(data.get('type', 0)),
                'time': dstTime,
                'elapse': int(data.get('elapse', 0)),
                'content': data.get('content', {}),
                'grade': int(data.get('grade', 0))})
            rt = str(newId)
        except Exception as e:
            print('appTempPushMessage failed: ' + e.__str__())
            logging.error('appTempPushMessage failed: ' + e.__str__())
        return rt

    # corelate roomid userid
    def corelate_room_and_user(self, userId, roomId):
        rt = False
        try:
            self.mdbBb[g_tableAppTempUserRoom].update_one({'userId':int(userId), 'roomId':ObjectId(roomId), 'grade':0},
                                                          {'userId':int(userId), 'roomId':ObjectId(roomId), 'grade':0}, True)
            rt = True
        except Exception as e:
            print('corelate_room_and_user error:' + e.__str__())
            logging.error('corelate_room_and_user error:' + e.__str__())
        return rt

    # set controller
    def appTempSetController(self, data):
        try:
            prefix = data.get('prefix', '')
            attrs = data.get('attrs')
            point_name_list = []
            point_value_list = []
            for key in attrs:
                point_name_list.append(prefix+key)
                point_value_list.append(attrs.get(key))
            if point_name_list and point_value_list:
                if len(point_name_list) == len(point_value_list):
                    return point_name_list, point_value_list
        except Exception as e:
            print('appTempSetController failed: ' + e.__str__())
            logging.error('appTempSetController failed: ' + e.__str__())
        return [], []

    def appTempInsertIntoHistoryOperation(self, data, nameList, valueList):
        rt = 'failed'
        try:
            parmX = 0
            parmY = 0
            parmGps = data.get('gps', [])
            if len(parmGps) > 0:
                parmX = int(parmGps[0])
                parmY = int(parmGps[1])
            parmCtrl = {
                'prefix':data.get('prefix'),
                'projectId':data.get('projectId'),
                'attrs':data.get('attrs')
            }
            res = self.mdbBb[g_tableAppTempHistoryOperation].insert_one({
                'time':datetime.now(),
                'userId':int(data.get('userId', 0)),
                'roomId':ObjectId(data.get('roomId')) if ObjectId.is_valid(data.get('roomId')) else None,
                'spaceId':ObjectId(data.get('spaceId')) if ObjectId.is_valid(data.get('spaceId')) else None,
                'x':parmX,
                'y':parmY,
                'source':int(data.get('source', 0)),
                'option':parmCtrl,
                'controllerParams':dict(zip(nameList, valueList), **{'_id':ObjectId(data.get('controllerId'))})
            })
            rt = 'success'
        except Exception as e:
            print('appTempInsertIntoHistoryOperation failed: ' + e.__str__())
            logging.error('appTempInsertIntoHistoryOperation failed: ' + e.__str__())
        return rt


    #factory funcs
    def AddUserProject(self, userId, projId, roleId=1):
        rt = False
        try:
            if ObjectId.is_valid(projId):
                self.mdbBb[g_table_fac_user_project].save({'_id':ObjectId(), 'userId':int(userId), 'roleId':int(roleId), 'projId':projId})
                rt = True
        except Exception as e:
            print('InsertIntoUserProject failed:%s'%(e.__str__(),))
            logging.error('InsertIntoUserProject failed:%s'%(e.__str__(),))
        return rt

    def RemoveUserProject(self, userId, projId):
        rt = False
        try:
            if ObjectId.is_valid(projId):
                self.mdbBb[g_table_fac_user_project].remove({'userId':int(userId), 'projId':projId})
                rt = True
        except Exception as e:
            print('RemoveUserProject failed:%s'%(e.__str__(),))
            logging.error('RemoveUserProject failed:%s'%(e.__str__(),))
        return rt

    def GetProjlistFromTableUserProject(self, userId):
        rt = []
        cursor = None
        try:
            cursor = self.mdbBb[g_table_fac_user_project].aggregate([{'$match':{'userId':int(userId)}},
                                {"$group": {"_id": "$userId", "projList":{'$push': "$projId"}}}])
            listObj = list(cursor)
            rt = listObj[0].get('projList') if len(listObj) ==1 else []
        except Exception as e:
            print('GetProjlistFromTableUserProject failed:%s'%(e.__str__(),))
            logging.error('GetProjlistFromTableUserProject failed:%s'%(e.__str__(),))
        finally:
            if cursor:
                cursor.close()
        return rt

    def GetProjectFromIdLists(self, projIdLists):
        rt = []
        cursor = None
        try:
            if projIdLists:
                cursor = self.mdbBb[g_table_fac_project].find({'_id':{'$in':[ObjectId(x) for x in projIdLists if ObjectId.is_valid(x)]}})
                rt = list(cursor)
        except Exception as e:
            print('GetProjectFromIdLists failed:%s'%(e.__str__(),))
            logging.error('GetProjectFromIdLists failed:%s'%(e.__str__(),))
        finally:
            if cursor:
                cursor.close()
        return rt

    def GetLayersByPageId(self, pageId, isFactory):
        rt = []
        try:
            if ObjectId.is_valid(pageId):
                ret = self.mdbBb[g_table_fac_page].find_one({'_id':ObjectId(pageId)})
                if ret:
                    layerList = ret.get('layerList',[])
                    for layer in layerList:
                        if ObjectId.is_valid(layer):
                            cursor = None
                            if isFactory:
                                cursor = self.mdbBb[g_table_fac_layer].find_one({'_id':ObjectId(layer)})
                            else:
                                cursor = self.mdbBb[g_table_ob_layer].find_one({'_id':ObjectId(layer)})
                            if cursor:
                                rt.append(cursor)
            for item in rt:
                item.update({'_id':item.get('_id').__str__()})
        except Exception as e:
            print('GetLayersByPageId failed:%s'%(e.__str__(),))
            logging.error('GetLayersByPageId failed:%s'%(e.__str__(),))
        return rt

    def GetWidgetsByIds(self, widgetIds, isFactory):
        rt = []
        widgetObjs = None
        cursor = None
        template = None
        try:
            widgetObjs = [ObjectId(x) for x in widgetIds if ObjectId.is_valid(x)]
            if isFactory:
                cursor = self.mdbBb[g_table_fac_widget].find({'_id':{'$in':widgetObjs}})
            else:
                cursor = self.mdbBb[g_table_ob_widget].find({'_id':{'$in':widgetObjs}})
            rt = list(cursor)
            for item in rt:
                item.update({'_id':item.get('_id').__str__()})
                # 判断 widget 中是否包含 templateId
                if 'templateId' in item:
                    if item.get('templateId') != '':
                        # 包含 templateId，则去 template 表中查找模板，
                        # 并将模板中的 content 字段对象覆盖到 widget 的 option 字段对象中
                        template = self.GetMaterialById(item.get('templateId'), isFactory)
                        if template:
                            # merge
                            item['option'].update(template.get('content', {}))
        except Exception as e:
            print('GetWidgetsByIds failed:%s'%(e.__str__(),))
            logging.error('GetWidgetsByIds failed:%s'%(e.__str__(),))

        return rt

    def GetMaterialById(self, sid, isFactory):
        template = None
        try:
            template = self.mdbBb[g_table_fac_material].find_one({'_id': ObjectId(sid)})
        except Exception as e:
            print('GetMaterialById failed:%s'%(e.__str__(),))
            logging.error('GetMaterialById failed:%s'%(e.__str__(),))

        return template

    def AddProjSprite(self, projId, spriteIdList):
        rt = False
        try:
            if spriteIdList and ObjectId.is_valid(projId):
                self.mdbBb[g_table_fac_proj_sprite].update({'_id':ObjectId(projId)}, {'$addToSet':{'sprIds':{'$each':spriteIdList}}}, True)
                rt = True
        except Exception as e:
            print('AddProjSprite failed:%s'%(e.__str__(),))
            logging.error('AddProjSprite failed:%s'%(e.__str__(),))
        return rt

    def RemoveProjSprite(self, projId, spriteIdList):
        rt = False
        try:
            if spriteIdList and ObjectId.is_valid(projId):
                self.mdbBb[g_table_fac_proj_sprite].update({'_id':ObjectId(projId)}, {'$pull':{'sprIds':{'$in':spriteIdList}}})
                self.mdbBb[g_table_fac_sprite].remove({'_id':{'$in':[ObjectId(x) for x in spriteIdList if ObjectId.is_valid(x)]}})
                rt = True
        except Exception as e:
            print('RemoveProjSprite failed:%s'%(e.__str__(),))
            logging.error('RemoveProjSprite failed:%s'%(e.__str__(),))
        return rt

    def GetProjSprite(self, projId):
        rt = []
        cursor = None
        try:
            if ObjectId.is_valid(projId):
                spriteList = self.GetProjSpriteIdListByProjId(projId)
                spriteListObj = [ObjectId(x) for x in spriteList if ObjectId.is_valid(x)]
                cursor = self.mdbBb[g_table_fac_sprite].find({'_id':{'$in':spriteListObj}})
                for item in cursor:
                    item.update({'_id':item.get('_id').__str__()})
                    rt.append(item)
        except Exception as e:
            print('RemoveProjSprite failed:%s'%(e.__str__(),))
            logging.error('RemoveProjSprite failed:%s'%(e.__str__(),))
        finally:
            if cursor:
                cursor.close()
        return rt

    def GetProjSpriteIdListByProjId(self, projId):
        rt = []
        try:
            if ObjectId.is_valid(projId):
                ret = self.mdbBb[g_table_fac_proj_sprite].find_one({'_id':ObjectId(projId)})
                if ret:
                    rt = ret.get('sprIds', [])
        except Exception as e:
            print('GetProjSpriteByProjId failed:%s'%(e.__str__(),))
            logging.error('GetProjSpriteByProjId failed:%s'%(e.__str__(),))
        return rt

    def GetSpriteDetailByIds(self, ids):
        rt = []
        rt1=[]
        findIds=[]
        cursor = None
        try:
            idsObjs = [ObjectId(x) for x in ids if ObjectId.is_valid(x)]
            cursor = self.mdbBb[g_table_fac_sprite].find({'_id':{'$in':idsObjs}})
            if cursor:
                rt = list(cursor)
                for item in rt:
                    item.update({'_id':item.get('_id').__str__()})
                    findIds.append(item.get('_id'))#查找符合的私有素材id
                idsObjs2 = [ i for i in idsObjs if i not in findIds ]
                if idsObjs2:
                    cursor = self.mdbBb[g_table_fac_material].find({'_id':{'$in':idsObjs2}})
                    if cursor:
                        rt1 = list(cursor)
                        for item in rt1:
                            item.get('content')['_id']=item.get('_id').__str__()
                            rt.append(item.get('content'))
        except Exception as e:
            print('GetSpriteDetailByIds failed:%s'%(e.__str__(),))
            logging.error('GetSpriteDetailByIds failed:%s'%(e.__str__(),))
        finally:
            if cursor:
                cursor.close()
        return rt

    def AddProjAndPages(self, projId, pageId):
        rt = False
        try:
            if ObjectId.is_valid(projId):
                self.mdbBb[g_table_fac_navigation].update({'_id':ObjectId(projId)}, {'$addToSet':{'list':pageId}}, True)
                rt = True
        except Exception as e:
            print('AddProjAndPages failed:%s'%(e.__str__(),))
            logging.error('AddProjAndPages failed:%s'%(e.__str__(),))
        return rt

    def factoryGetProjectList(self, userId):
        rt = []
        try:
            res = self.GetProjectFromIdLists(self.GetProjlistFromTableUserProject(userId))
            for item in res:
                item.update({'_id':item.get('_id').__str__()})
            rt = res
        except Exception as e:
            print('factoryGetProjectList failed:%s'%(e.__str__(),))
            logging.error('factoryGetProjectList failed:%s'%(e.__str__(),))
        return rt

    def factoryGetProjectUser(self, projId):
        rt = []
        try:
            cursor = self.mdbBb[g_table_fac_user_project].find({'projId': projId}, {'_id': 0, 'userId': 1})
            for item in cursor:
                rt.append({'id': item['userId']})
        except Exception as e:
            print('factoryGetProjectUser failed:%s'%(e.__str__(),))
            logging.error('factoryGetProjectUser failed:%s'%(e.__str__(),))
        return rt

    def factoryUpdateProjectAuth(self, projId, userIds):
        rt = False
        try:
            # 先删除全部关系
            self.mdbBb[g_table_fac_user_project].delete_many({'projId': projId})
            # 再将新的关系插入
            self.mdbBb[g_table_fac_user_project].insert_many([{'projId': projId, 'userId': userId, 'roleId':1} for userId in userIds])
            rt = True
        except Exception as e:
            print('factoryUpdateProjectAuth failed:%s'%(e.__str__(),))
            logging.error('factoryUpdateProjectAuth failed:%s'%(e.__str__(),))
        return rt

    def GetPageInfoByIds(self, ids, isFactory=1):
        rt = []
        if isFactory == 1:
            tableName = g_table_fac_page
        else:
            tableName = g_table_ob_page
        try:
            for id in ids:
                ret = self.mdbBb[tableName].find_one({'_id':ObjectId(id)})
                if ret:
                    rt.append(ret)
        except Exception as e:
            print('GetPageInfoByIds failed:%s'%(e.__str__(),))
            logging.error('GetPageInfoByIds failed:%s'%(e.__str__(),))
        return rt

    def SaveToObNavigation(self, projId, pageIdList):
        try:
            if pageIdList:
                self.mdbBb[g_table_ob_navigation].update({'projectId':int(projId)}, {'$addToSet':{'list':{'$each':[ObjectId(x) for x in pageIdList]}}, '$set':{'projectId':int(projId)}}, True)
        except Exception as e:
            print('SaveToObNavigation failed:%s'%(e.__str__(),))
            logging.error('SaveToObNavigation failed:%s'%(e.__str__(),))
            return False
        return True

    def factoryGetPageList(self, projId, isFactory):
        rt = []
        res = None
        try:
            if isFactory:
                if ObjectId.is_valid(projId):
                    res = self.mdbBb[g_table_fac_navigation].find_one({'_id':ObjectId(projId)})
            else:
                res = self.mdbBb[g_table_ob_navigation].find_one({'projectId':int(projId)})
            if res:
                ret = res.get('list')
                if ret:
                    ret = self.GetPageInfoByIds(ret)
                    if ret:
                        for item in ret:
                            item.update({'_id':item.get('_id').__str__()})
                        rt = ret
        except Exception as e:
            print('factoryGetPageList failed:%s'%(e.__str__(),))
            logging.error('factoryGetPageList failed:%s'%(e.__str__(),))
        return rt

    def SaveToObPage(self, dataList):
        rt = True
        try:
            for item in dataList:
                self.mdbBb[g_table_ob_page].save(item)
                self.SaveToObSpringLayout(item)
        except Exception as e:
            rt = False
            print('SaveToObPage failed:%s'%(e.__str__(),))
            logging.error('SaveToObPage failed:%s'%(e.__str__(),))
        return rt

    def SaveToObSpringLayout(self, item):
        try:
            if item.get('type','') in ['EnergyScreen', 'FacReportScreen']:
                fac_springLayout_item = self.mdbBb[g_table_fac_spring_layout].find_one({'menuItemId':item.get('_id').__str__()})
                if fac_springLayout_item:
                    self.mdbBb[g_tableSpringLayout].save(fac_springLayout_item)
        except Exception as e:
            print('SaveToObSpringLayout failed:%s'%(e.__str__(),))
            logging.error('SaveToObSpringLayout failed:%s'%(e.__str__(),))

    def SaveToObLayer(self, dataList):
        rt = True
        try:
            for item in dataList:
                item['_id'] = ObjectId(item['_id'])
                self.mdbBb[g_table_ob_layer].save(item)
        except Exception as e:
            rt = False
            print('SaveToObLayer failed:%s'%(e.__str__(),))
            logging.error('SaveToObLayer failed:%s'%(e.__str__(),))
        return rt

    def SaveToObWidget(self, dataList):
        rt = True
        try:
            for item in dataList:
                item['_id'] = ObjectId(item['_id'])
                self.mdbBb[g_table_ob_widget].save(item)
        except Exception as e:
            rt = False
            print('SaveToObWidget failed:%s'%(e.__str__(),))
            logging.error('SaveToObWidget failed:%s'%(e.__str__(),))
        return rt

    def SaveWidgetToLayer(self, layerId, widgetId):
        rt = True
        try:
            if ObjectId.is_valid(layerId) and ObjectId.is_valid(widgetId):
                self.mdbBb[g_table_fac_layer].update({'_id':ObjectId(layerId)}, {'$addToSet':{'list':widgetId}}, True)
        except Exception as e:
            rt = False
            print('SaveWidgetToLayer failed:%s'%(e.__str__(),))
            logging.error('SaveWidgetToLayer failed:%s'%(e.__str__(),))
        return rt

    def factoryGetPageDetail(self, pageId, isFactory):
        rt = {}
        try:
            widgetList = []
            layerList = self.GetLayersByPageId(pageId, isFactory)
            for layer in layerList:
                # import pdb;pdb.set_trace()
                widgetList.extend(self.GetWidgetsByIds(layer.get('list',[]), isFactory))
            spriteList = []
            for widget in widgetList:
                option = widget.get('option')
                trigger = option.get('trigger') if option else None
                if trigger:
                    for key in trigger.keys():
                        if ObjectId.is_valid(trigger.get(key)):
                            spriteList.append(trigger.get(key))
            spriteList = self.GetSpriteDetailByIds(spriteList)
            rt['layers'] = layerList
            rt['widgets'] = widgetList
            rt['images'] = spriteList
            #add shot
            rt['shots'] = self.GetHistoryShotByPageId(pageId)
        except Exception as e:
            print('factoryGetPageDetail failed:%s'%(e.__str__(),))
            logging.error('factoryGetPageDetail failed:%s'%(e.__str__(),))
        return rt

    def RemoveProjectPublish(self, projectId):
        rt = True
        try:
            ret = self.mdbBb[g_table_ob_navigation].find_one({'projectId':int(projectId)})
            if ret:
                pageList = ret.get('list')
                if pageList:
                    for pageId in pageList:
                        detail = self.factoryGetPageDetail(pageId, 0)
                        if detail:
                            layers = detail.get('layers')
                            widgets = detail.get('widgets')
                            if layers:
                                self.mdbBb[g_table_ob_layer].remove({'_id':{'$in':[ObjectId(x.get('_id')) for x in layers]}})
                            if widgets:
                                self.mdbBb[g_table_ob_widget].remove({'_id':{'$in':[ObjectId(x.get('_id')) for x in widgets]}})
                self.mdbBb[g_table_ob_page].remove({'_id':{'$in':[ObjectId(x) for x in pageList]}})
                self.mdbBb[g_table_ob_navigation].remove({'projectId':int(projectId)})
        except Exception as e:
            print('RemoveProjectPublish failed:%s'%(e.__str__(),))
            logging.error('RemoveProjectPublish failed:%s'%(e.__str__(),))
        return rt

    def RemoveProjectFactory(self, projectId):
        rt = True
        try:
            if ObjectId.is_valid(projectId):
                ret = self.mdbBb[g_table_fac_navigation].find_one({'_id':ObjectId(projectId)})
                if ret:
                    pageList = ret.get('list')
                    if pageList:
                        for pageId in pageList:
                            self.mdbBb[g_table_fac_spring_layout].remove({'menuItemId':pageId})
                            detail = self.factoryGetPageDetail(pageId, 0)
                            if detail:
                                layers = detail.get('layers')
                                widgets = detail.get('widgets')
                                if layers:
                                    self.mdbBb[g_table_ob_layer].remove({'_id':{'$in':[ObjectId(x.get('_id')) for x in layers]}})
                                if widgets:
                                    self.mdbBb[g_table_ob_widget].remove({'_id':{'$in':[ObjectId(x.get('_id')) for x in widgets]}})
                    self.mdbBb[g_table_fac_page].remove({'_id':{'$in':[ObjectId(x) for x in pageList]}})
                    self.mdbBb[g_table_fac_navigation].remove({'_id':ObjectId(projectId)})
        except Exception as e:
            print('RemoveProjectPublish failed:%s'%(e.__str__(),))
            logging.error('RemoveProjectPublish failed:%s'%(e.__str__(),))
        return rt


    def GetHistoryShotByPageId(self, pageId):
        rt = []
        cursor = None
        try:
            cursor = self.mdbBb[g_table_fac_historyshot].find({'pageId':pageId},{'pageId':1,'userId':1, 'time':1, 'name':1}).sort([('time', pymongo.ASCENDING)])
            for item in cursor:
                item.update({'time':item.get('time').strftime('%Y-%m-%d %H:%M:%S'), '_id': item.get('_id').__str__()})
                rt.append(item)
        except Exception as e:
            print('GetHistoryShotByPageId failed:%s'%(e.__str__(),))
            logging.error('GetHistoryShotByPageId failed:%s'%(e.__str__(),))
        return rt

    def factoryHistoryShotSave(self, pageId, userId, time, name, content):
        rt = ''
        try:
            ret = self.mdbBb[g_table_fac_historyshot].save({'pageId':pageId,
                'userId':userId, 'time':time, 'name':name, 'content':content})
            if isinstance(ret, ObjectId):
                rt = ret.__str__()
        except Exception as e:
            print('factoryHistoryShotSave failed:%s'%(e.__str__(),))
            logging.error('factoryHistoryShotSave failed:%s'%(e.__str__(),))
        return rt

    def factoryHistoryShotEdit(self, shotId, pageId, userId, time, name, content):
        rt = True
        try:
            if ObjectId.is_valid(shotId):
                set_dict = {}
                if pageId:
                    set_dict['pageId'] = pageId
                if userId:
                    set_dict['userId'] = userId
                if time:
                    set_dict['time'] = time
                if name:
                    set_dict['name'] = name
                if content:
                    set_dict['content'] = content
                self.mdbBb[g_table_fac_historyshot].update({'_id':ObjectId(shotId)}, {'$set':set_dict})
            else:
                rt = False
        except Exception as e:
            rt = False
            print('factoryHistoryShotEdit failed:%s'%(e.__str__(),))
            logging.error('factoryHistoryShotEdit failed:%s'%(e.__str__(),))
        return rt

    def factoryHistoryShotGetDetail(self, historyShotid):
        rt = {}
        try:
            if ObjectId.is_valid(historyShotid):
                ret = self.mdbBb[g_table_fac_historyshot].find_one({'_id':ObjectId(historyShotid)})
                if ret:
                    timeObj = ret.get('time')
                    ret.update({'_id':ret.get('_id').__str__()})
                    if isinstance(timeObj, datetime):
                        ret.update({'time':timeObj.strftime('%Y-%m-%d %H:%M')})
                    rt = ret
        except Exception as e:
            print('factoryHistoryShotGetDetail failed:%s'%(e.__str__(),))
            logging.error('factoryHistoryShotGetDetail failed:%s'%(e.__str__(),))
        return rt

    def factorySave(self, projId, data):
        rt = False
        LAYER = 'layer'
        WIDGET = 'widget'
        PAGE = 'page'
        try:
            if ObjectId.is_valid(projId):
                objlist = []
                layerobj = data.get(LAYER)
                widgetobj = data.get(WIDGET)
                pageobj = data.get(PAGE)
                if pageobj:
                    objlist.append((PAGE,pageobj))
                if layerobj:
                    objlist.append((LAYER,layerobj))
                if widgetobj:
                    objlist.append((WIDGET,widgetobj))
                for item in objlist:
                    key = item[0]
                    tablename = ''
                    if key == LAYER:
                        tablename = g_table_fac_layer
                    elif key == WIDGET:
                        tablename = g_table_fac_widget
                    elif key == PAGE:
                        tablename = g_table_fac_page
                    keyList = item[1]
                    for layer in keyList:
                        k = layer.get('k')
                        id = layer.get('_id')
                        if k.upper() != 'D':
                            v = layer.get('v')
                            if v:
                                if not id:
                                    id = v.get('_id')
                                if ObjectId.is_valid(id):
                                    query = dict()
                                    query['_id'] = ObjectId(id)
                                    set_content = dict()
                                    for subkey in v.keys():
                                        if subkey == '_id':
                                            continue
                                        set_content[subkey] = v.get(subkey)
                                    if set_content:
                                        self.mdbBb[tablename].update(query, {'$set':set_content}, True)
                                    #extra insert
                                    if key == PAGE:
                                        self.AddProjAndPages(projId, id)
                                    if key == WIDGET:
                                        self.SaveWidgetToLayer(v.get('layerId'), id)
                                else:
                                    return False
                        else:
                            if ObjectId.is_valid(id):
                                oId = ObjectId(id)
                                query = {'_id': oId}
                                self.mdbBb[tablename].remove(query)
                                if key == PAGE:
                                    self.mdbBb[g_table_fac_navigation].update(query, {'$pull':{'list':id}})
                                elif key == LAYER:
                                    self.mdbBb[g_table_fac_page].update(query, {'$pull':{'layerList':id}})
                                elif key == WIDGET:
                                    self.mdbBb[g_table_fac_layer].update(query, {'$pull':{'list':id}})
                                else:...
                rt = True
        except Exception as e:
            rt = False
            print('factorySave failed:%s'%(e.__str__(),))
            logging.error('factorySave failed:%s'%(e.__str__(),))
        return rt

    def factoryMaterialSave(self, data):
        rt = True
        try:
            if type(data) == dict:
                id = data.get('_id')
                if '_id' in data and ObjectId.is_valid(id):
                    data.update({'_id':ObjectId(id)})
                    self.mdbBb[g_table_fac_material].save(data)
            else:
                rt = False
        except Exception as e:
            rt = False
            print('factoryMaterialSave failed:%s'%(e.__str__(),))
            logging.error('factoryMaterialSave failed:%s'%(e.__str__(),))
        return rt

    def factoryMaterialEdit(self, data):
        rt = True
        try:
            if type(data) == dict:
                id = data.get('_id')
                if '_id' in data and ObjectId.is_valid(id):
                    set_dict = {}
                    for key in data.keys():
                        if key == '_id':
                            continue
                        set_dict[key] = data.get(key)
                    if set_dict:
                        self.mdbBb[g_table_fac_material].update({'_id':ObjectId(id)}, {'$set':set_dict})
            else:
                rt = False
        except Exception as e:
            rt = False
            print('factoryMaterialEdit failed:%s'%(e.__str__(),))
            logging.error('factoryMaterialEdit failed:%s'%(e.__str__(),))
        return rt

    def factoryMaterialGet(self, type):
        rt = []
        cursor = None
        try:
            query = {'type': {'$regex': '^'+type+'.*$'}} if type else dict()
            cursor = self.mdbBb[g_table_fac_material].find(query)
            for item in cursor:
                item.update({'_id':item.get('_id').__str__()})
                rt.append(item)
        except Exception as e:
            print('factoryMaterialGet failed:%s'%(e.__str__(),))
            logging.error('factoryMaterialGet failed:%s'%(e.__str__(),))
        finally:
            if cursor:
                cursor.close()
        return rt

    def factoryMaterialTemplateGet(self, templateId):
        rt = {}
        try:
            rt = self.mdbBb[g_table_fac_material].find_one({'_id': ObjectId(templateId)})
            if rt:
                rt['_id'] = rt['_id'].__str__()
        except Exception as e:
            print('factoryMaterialTemplateGet failed:%s'%(e.__str__(),))
            logging.error('factoryMaterialTemplateGet failed:%s'%(e.__str__(),))
        return rt

    def factoryMaterialRemove(self, data):
        rt = True
        try:
            idobjs = [ObjectId(x) for x in data if ObjectId.is_valid(x)]
            self.mdbBb[g_table_fac_material].remove({'_id':{'$in':idobjs}})
        except Exception as e:
            rt = False
            print('factoryMaterialRemove failed:%s'%(e.__str__(),))
            logging.error('factoryMaterialRemove failed:%s'%(e.__str__(),))
        return rt

    def factoryHistoryShotRemove(self, shotId):
        rt = True
        try:
            if ObjectId.is_valid(shotId):
                self.mdbBb[g_table_fac_historyshot].remove({'_id':ObjectId(shotId)})
            else:
                rt = False
        except Exception as e:
            rt = False
            print('factoryHistoryShotRemove failed:%s'%(e.__str__(),))
            logging.error('factoryHistoryShotRemove failed:%s'%(e.__str__(),))
        return rt

    def AddToSprite(self, materialIdList):
        rt = []
        try:
            if materialIdList:
                for materialId in materialIdList:
                    if ObjectId.is_valid(materialId):
                        ret = self.mdbBb[g_table_fac_material].find_one({'_id':ObjectId(materialId)})
                        content = ret.get('content')
                        if content:
                            id = ObjectId()
                            content.update({'_id':id})
                            self.mdbBb[g_table_fac_sprite].save(content)
                            rt.append(id.__str__())
        except Exception as e:
            print('AddToSprite failed:%s'%(e.__str__(),))
            logging.error('AddToSprite failed:%s'%(e.__str__(),))
        return rt

    def FacIsProjectExist(self, proName, proZhName, proEnName):
        try:
            rt = self.mdbBb[g_table_fac_project].find_one({'$or':[{'name_en':proName},{'name_cn':proZhName}, {'name_english':proEnName}]})
            if rt:
                # 修改 项目名称重复，直接返回提示
                return True
        except Exception as e:
            return True
        return False


    def AddNewProject(self,userId, proName, proZhName, proEnName):
        id = ObjectId()
        try:
            # 修改 项目名称重复，直接返回提示
            # now_time = datetime.now()
            # sec= now_time.second
            # microsec = now_time.microsecond
            # ext = '_%d_%d_UID%d'%(sec, microsec, userId)
            # proName, proZhName, proEnName = proName+ext , proZhName+ext, proEnName+ext
            self.mdbBb[g_table_fac_project].save({'_id':id, 'name_en':proName, 'name_cn':proZhName, 'name_english':proEnName})
            self.AddUserProject(int(userId),id.__str__())
            return id.__str__()
        except Exception as e:
            print('InsertIntoUserProject failed:%s'%(e.__str__(),))
            logging.error('InsertIntoUserProject failed:%s'%(e.__str__(),))
        return None

    def RemoveProject(self, userId, projId):
        rt = True
        #TODO: 未完成
        try:
            if ObjectId.is_valid(projId):
                res = self.GetProjectFromIdLists([projId])
                for item in res:
                    if item.get('_id') == ObjectId(projId):
                        if self.RemoveProjectFactory(projId):
                            self.mdbBb[g_table_fac_project].remove(item)
                            self.RemoveUserProject(int(userId),projId)
                        else:
                            rt = False
                    else:
                        rt = False
        except Exception as e:
            print('RemoveUserProject failed:%s'%(e.__str__(),))
            logging.error('RemoveUserProject failed:%s'%(e.__str__(),))
            rt=False
        return rt

    def ModifyPageList(self, projId, pageList):
        rt = False
        try:
            if ObjectId.is_valid(projId):
                self.mdbBb[g_table_fac_navigation].update({'_id':ObjectId(projId)}, {'$set':{'list': pageList}})
                rt = True
        except Exception as e:
            print('ModifyPageList failed:%s'%(e.__str__(),))
            logging.error('ModifyPageList failed:%s'%(e.__str__(),))
        return rt

    #yan add 2016-1-5
    def searchDsItemInfo(self, userId, searchName):
        group_dict = {}
        dsId_set = set()
        try:
            rt_temp = []
            ret = self.mdbBb[g_tableDataSourceGroupList].find_one({'userId':userId})
            if ret:
                gl = ret.get('groupList')
                for item in gl:
                    gi = self.mdbBb[g_tableDataSourceGroupItem].find_one({'_id':ObjectId(item)})
                    if gi:
                        searchList = searchName.split(' ')
                        for sn in searchList:
                            cursor = None
                            try:
                                regDict = {'$regex':sn,'$options':'$i'}
                                cursor = self.mdbBb[g_tableDataSource].find({'_id':{'$in':[ObjectId(x) for x in gi.get('dsList',[])]},
                                            '$or':[{'value':regDict},{'alias':regDict},{'note':regDict}]})
                                if cursor:
                                    for ds in cursor:
                                        id = ds.get('_id').__str__()
                                        ds.update({'id':id})
                                        ds.pop('_id')
                                        if id not in dsId_set:
                                            dsId_set.add(id)
                                            rt_temp.append(ds)
                            except Exception as e:
                                print(e)
                            finally:
                                if cursor:
                                    cursor.close()
            if rt_temp:
                for item in rt_temp:
                    group_id = item.get('groupId','groupEmpty')
                    group_content = group_dict.get(group_id)
                    if not group_content:
                        if ObjectId.is_valid(group_id):
                            ret = self.mdbBb[g_tableDataSourceGroupItem].find_one({'_id':ObjectId(group_id)})
                            if ret:
                                group_dict.update({group_id:{'dsList':[item], 'groupName':ret.get('groupName')}})
                        else:
                            group_dict.update({group_id:{'dsList':[item], 'groupName':group_id}})
                    else:
                        dsList_content = group_content.get('dsList')
                        dsList_content.append(item)
        except Exception as e:
            print('searchDsItemInfo failed:%s'%(e.__str__(),))
            logging.error('searchDsItemInfo failed:%s'%(e.__str__(),))
        return group_dict

    def getDsItemsById(self, dsList):
        rt = []
        cursor = None
        dbrv = None
        try:
            for ds in dsList:
                if ObjectId.is_valid(ds):
                    dbrv = self.mdbBb[g_tableDataSource].find_one({'_id':ObjectId(ds)})
                elif ds[0] == '@':
                    ds = ds[1:].rsplit('|', 1)
                    dbrv = self.mdbBb[g_tableDataSource].find_one({'value':ds[1], 'type':4,'$or':[{'projId':int(ds[0])},{'projId':str(ds[0])}]})
                else:
                    raise Exception('The data format error')
                if dbrv:
                    dbrv.update({'id':dbrv.get('_id').__str__(), 'projId':int(dbrv.get('projId'))})
                    dbrv.pop('_id')
                    rt.append(dbrv)
        except Exception as e:
            print('getDsItemsById failed:%s'%(e.__str__(),))
            logging.error('getDsItemsById failed:%s'%(e.__str__(),))
        finally:
            if cursor:
                cursor.close()
        return rt

    def getfactoryMaterialURLByIds(self, ids):
        rt = {}
        cursor = None
        try:
            if ids:
                cursor = self.mdbBb[g_table_fac_material].find({'_id':{'$in':[ObjectId(x) for x in ids]}})
                for item in cursor:
                    rt.update({item.get('_id').__str__():item.get('url')})
        except Exception as e:
            print('getfactoryMaterialURLByIds failed:%s'%(e.__str__(),))
            logging.error('getfactoryMaterialURLByIds failed:%s'%(e.__str__(),))
        finally:
            if cursor:
                cursor.close()
        return rt

    def get_DataSource_MappingPoint_by_value(self, DataSource_Value):
        rt = {}
        try:
            if isinstance(DataSource_Value, str):
                if DataSource_Value[0] == '@':
                    DataSource_Value = DataSource_Value[1:].rsplit('|', 1)
                    rt = self.mdbBb[g_tableDataSource].find_one({'value':DataSource_Value[1], 'type':4, '$or':[{'projId':int(DataSource_Value[0])},{'projId':str(DataSource_Value[0])}]})
                    if not rt:
                        rt = {'type':4, 'params':{'mapping':{'point':DataSource_Value[1]}}, 'projId':DataSource_Value[0]}
                    if rt.get('params'):
                        params = rt.get('params')
                        if not params.get('mapping'):
                            mapping = {'point':DataSource_Value[1]}
                            rt.get('params').update({'mapping':mapping})
                    else:
                        rt = {'type':4, 'params':{'mapping':{'point':DataSource_Value[1]}}, 'projId':DataSource_Value[0]}
                else:
                    raise  Exception('The data format error')
        except Exception as e:
            print('get_DataSource_MappingPoint_by_value error:' + e.__str__())
            logging.error('get_DataSource_MappingPoint_by_value error:' + e.__str__())
        return rt

    def mapping_point_datasource(self, DataSource_list):
        rt = []
        point_value_dict = {}
        source_id_list = []
        try:
            if isinstance(DataSource_list, list):
                for datasource in DataSource_list:
                    if datasource[0] == '@':
                        point = datasource[1:].rsplit('|', 1)
                        if point[0] not in point_value_dict.keys():
                            point_value_dict.update({point[0]:[point[1]]})
                        elif point[0] in point_value_dict.keys():
                            point_value_dict.get(point[0]).append(point[1])
                    elif ObjectId.is_valid(datasource):
                        source_id_list.append(datasource)
                itemlist = self.get_datasourceiteminfo_by_sourceidlist(source_id_list)
                rt.extend(itemlist)
                for l in point_value_dict:
                    itemlist = self.get_datasourceiteminfo_by_point(l, point_value_dict.get(l))
                    rt.extend(itemlist)
            elif isinstance(DataSource_list, str):
                if ObjectId.is_valid(DataSource_list):
                    pass
                elif DataSource_list[0] == '@':
                    pass
        except Exception as e:
            print('mapping_point_datasource error:' + e.__str__())
            logging.error('mapping_point_datasource error:' + e.__str__())
        return rt

    def get_datasourceiteminfo_by_point(self, projId,  point_list):
        rt = []
        cursor = None
        try:
            cursor = self.mdbBb[g_tableDataSource].find({'value':{'$in':point_list}, 'type':4,
                                                    '$or':[{'projId':int(projId)},{'projId':str(projId)}]})
            for item in cursor:
                if item.get('params'):
                    params = item.get('params')
                    if not params.get('mapping'):
                        mapping = {'point':item.get('value')}
                        item.get('params').update({'mapping':mapping})
                    rt.append(item)
            fpl = [f.get('value') for f in rt]
            if len(rt) != len(point_list):
                for p in point_list:
                    if p not in fpl:
                        rt.append({'type':4, 'params':{'mapping':{'point':p}}, 'projId':projId})
        except Exception as e:
            print('get_datasourceiteminfo_by_point error:' + e.__str__())
            logging.error('get_datasourceiteminfo_by_point error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    def get_datasourceiteminfo_by_sourceidlist(self, SourceIdList):
        rt = []
        cursor = None
        try:
            cursor = self.mdbBb[g_tableDataSource].find({'_id':{'$in':[ObjectId(i) for i in SourceIdList]}})
            rt = list(cursor)
        except Exception as e:
            print('get_dataSourceItemInfo_by_sourceIdList error:' + e.__str__())
            logging.error('get_dataSourceItemInfo_by_sourceIdList error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    def saveThing(self, data):
        rt = True
        try:
            save_data = {}
            for key in data:
                value = data.get(key, '')
                if key == '_id':
                    value = ObjectId(value)
                if key == 'model':
                    value = ObjectId(value)
                if key == 'updateTime' or key == 'buyingTime' or key == 'activeTime' or key == 'guaranteeTime' or key == 'endTime':
                    try:
                        value = datetime.strptime(value, '%Y-%m-%d %H:%M:%S')
                    except Exception as e:
                        value = None
                save_data.update({key:value})
            if '_id' not in save_data:
                save_data.update({'_id':ObjectId()})
            self.mdbBb[g_table_asset_things].update({'_id':save_data.get('_id')}, {'$set':save_data}, True)
        except Exception as e:
            rt = False
            print('saveThing failed:%s'%(e.__str__(),))
            logging.error('saveThing failed:%s'%(e.__str__(),))
        return rt

    def saveModel(self, data):
        rt = 'Failed'
        try:
            save_data = {}
            for key in data:
                value = data.get(key, '')
                if key == '_id':
                    if ObjectId.is_valid(value):
                        value = ObjectId(value)
                    else:
                        value = ObjectId()
                save_data.update({key:value})
            if '_id' not in save_data:
                save_data.update({'_id':ObjectId()})
            dbrv = self.mdbBb[g_table_asset_model].update({'_id':save_data.get('_id')}, {'$set':save_data}, True)
            if dbrv.get('ok'):
                rt = dbrv.get('upserted').__str__()
        except Exception as e:
            print('saveModel failed:%s'%(e.__str__(),))
            logging.error('saveModel failed:%s'%(e.__str__(),))
        return rt

    def saveMaintain(self, data):
        rt = True
        try:
            save_data = {}
            for key in data:
                value = data.get(key, '')
                if key == '_id' or key == 'tId':
                    value = ObjectId(value)
                if key == 'endTime' or key == 'createTime':
                    value = datetime.strptime(value, '%Y-%m-%d %H:%M')
                save_data.update({key:value})
            if '_id' not in save_data:
                save_data.update({'_id':ObjectId()})
            self.mdbBb[g_table_asset_maintain].update({'_id':save_data.get('_id')}, {'$set':save_data}, True)
        except Exception as e:
            rt = False
            print('saveMaintain failed:%s'%(e.__str__(),))
            logging.error('saveMaintain failed:%s'%(e.__str__(),))
        return rt

    def getThingInfoList(self, groupId):
        rt = []
        cursor = None
        try:
            cursor_sub = None
            id_list = []
            thingsinfo = []
            try:
                cursor_sub = self.mdbBb[g_table_iot_things].find({'arrIdGrp':ObjectId(groupId)}, {'_id':1})
                for item in cursor_sub:
                    id_list.append(item.get('_id'))
            except Exception as e:
                pass
            finally:
                if cursor_sub:
                    cursor_sub.close()
            if id_list:
                cursor = self.mdbBb[g_table_asset_things].find({'_id':{'$in':id_list}},{'_id':1, 'name':1,
                    'type':1, 'desc':1, 'manager':1, 'updateTime':1, 'status':1, 'model':1, 'endTime':1})
                for item in cursor:
                    item.update({'_id':item.get('_id').__str__(),
                                 'model':item.get('model').__str__(),
                                 'updateTime':item.get('updateTime').strftime('%Y-%m-%d %H:%M') if item.get('updateTime') is not None else None,
                                 'endTime':item.get('endTime').strftime('%Y-%m-%d %H:%M') if item.get('endTime') is not None else None})
                    rt.append(item)
        except Exception as e:
            print('getThingInfoList failed:%s'%(e.__str__(),))
            logging.error('getThingInfoList failed:%s'%(e.__str__(),))
        finally:
            if cursor:
                cursor.close()
        return rt

    def getThingDetail(self, tId):
        rt = {}
        try:
            rt = self.mdbBb[g_table_asset_things].find_one({'_id':ObjectId(tId)})
            rt.update({'_id':rt.get('_id').__str__(),
                       'model':rt.get('model').__str__(),
                       'updateTime':rt.get('updateTime').strftime('%Y-%m-%d %H:%M:%S') if rt.get('updateTime') is not None else None,
                       'buyingTime':rt.get('buyingTime').strftime('%Y-%m-%d %H:%M:%S') if rt.get('buyingTime') is not None else None,
                       'activeTime':rt.get('activeTime').strftime('%Y-%m-%d %H:%M:%S') if rt.get('activeTime') is not None else None,
                       'guaranteeTime':rt.get('guaranteeTime').strftime('%Y-%m-%d %H:%M:%S') if rt.get('guaranteeTime') is not None else None,
                       'endTime':rt.get('endTime').strftime('%Y-%m-%d %H:%M:%S') if rt.get('endTime') is not None else None
                       })
        except Exception as e:
            print('getThingDetail failed:%s'%(e.__str__(),))
            logging.error('getThingDetail failed:%s'%(e.__str__(),))
        return rt

    def getModel(self, modelId = None):
        rt = {}
        try:
            if modelId:
                rt = self.mdbBb[g_table_asset_model].find_one({'_id':ObjectId(modelId)})
                rt.update({'_id':rt.get('_id').__str__()})
            else:
                try:
                    cursor = self.mdbBb[g_table_asset_model].find({})
                    for item in cursor:
                        rt.update({item.get('_id').__str__():item.get('name')})
                except:
                    pass
                finally:
                    if cursor:
                        cursor.close()
                return rt
        except Exception as e:
            print('getModel failed:%s'%(e.__str__(),))
            logging.error('getModel failed:%s'%(e.__str__(),))
        return rt



    def getMaintainList(self, arrThingId):
        rt = []
        cursor = None
        try:
            cursor = self.mdbBb[g_table_asset_maintain].find({'tId':{'$in':[ObjectId(x) for x in arrThingId]}})
            for item in cursor:
                item.update({'_id':item.get('_id').__str__(),
                             'tId':item.get('tId').__str__(),
                             'type':1})
                rt.append(item)
        except Exception as e:
            print('getMaintainList failed:%s'%(e.__str__(),))
            logging.error('getMaintainList failed:%s'%(e.__str__(),))
        finally:
            if cursor:
                cursor.close()
        return rt

    #iot_project
    def get_iot_project(self):
        rt = []
        cursor = None
        try:
            cursor = self.mdbBb[g_table_iot_project].find({})
            rt = [{'_id':x.get('_id').__str__(), '_idMgt':x.get('_idMgt').__str__(), 'codeName':x.get('codeName'),
                   'dictName':x.get('dictName'), 'latLng':x.get('latLng'), 'arrP':x.get('arrP'), 'type':x.get('type')} for x in cursor]
        except Exception as e:
            print('get_iot_project error:' + e.__str__())
            logging.error('get_iot_project error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    #iot_group
    def get_iot_group(self, projectId):
        rt = []
        cursor = None
        try:
            if ObjectId.is_valid(projectId):
                cursor = self.mdbBb[g_table_iot_group].find({'_idProj':ObjectId(projectId)})
                for x in cursor:
                    if not isinstance(x.get('_idPrt'), ObjectId):
                        rt.append({'_id':x.get('_id').__str__(), 'projId':x.get('projId'),  '_idProj':x.get('_idProj').__str__(),
                                   '_idPrt':x.get('_idPrt').__str__(),'prefix':x.get('prefix'), 'arrP':x.get('arrP'),
                                   'name':x.get('name'), 'type':x.get('type'),'weight':x.get('weight'), 'params':x.get('params')})
        except Exception as e:
            print('get_iot_group error:' + e.__str__())
            logging.error('get_iot_group error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    def get_iot_group_by_prtid(self, prtId):
        rt = []
        cursor = None
        try:
            if ObjectId.is_valid(prtId):
                cursor = self.mdbBb[g_table_iot_group].find({'_idPrt':ObjectId(prtId)})
                rt = [{'_id':x.get('_id').__str__(), 'projId':x.get('projId'), '_idProj':x.get('_idProj').__str__(),'_idPrt':x.get('_idPrt').__str__(),
                       'prefix':x.get('prefix'),'arrP':x.get('arrP'), 'name':x.get('name'), 'type':x.get('type'),
                       'weight':x.get('weight'), 'params':x.get('params')} for x in cursor]
        except Exception as e:
            print('get_iot_group_by_prtid error:' + e.__str__())
            logging.error('get_iot_group_by_prtid error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    #iot_thing
    def get_iot_things(self, groupId):
        rt = []
        cursor = None
        try:
            if ObjectId.is_valid(groupId):
                cursor = self.mdbBb[g_table_iot_things].find({'arrIdGrp':ObjectId(groupId)})
                rt = [{'_id':x.get('_id').__str__(), 'projId':x.get('projId'), 'arrIdGrp':[y.__str__() for y in x.get('arrIdGrp')], 'prefix':x.get('prefix'),
                       'arrP':x.get('arrP'),'path':x.get('path'), 'name':x.get('name'), 'type':x.get('type'),
                       'params':x.get('params')} for x in cursor]
        except Exception as e:
            print('get_iot_thing error:' + e.__str__())
            logging.error('get_iot_thing error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    def set_iot_things(self, data):
        rt = 'Failed'
        try:
            if ObjectId.is_valid(data.get('_id')):
                data.update({'_id':ObjectId(data.get('_id'))})
            else:
                data.update({'_id':ObjectId()})
            for key in data:
                value = data.get(key)
                if key == 'arrIdGrp':
                    vl = []
                    if isinstance(value, list):
                        for idgrp in value:
                            if ObjectId.is_valid(idgrp):
                                vl.append(ObjectId(idgrp))
                        value = vl
                data.update({key:value})
            dbrv = self.mdbBb[g_table_iot_things].update({'_id':data.get('_id')}, {'$set':data}, True)
            if dbrv.get('ok'):
                dbrv = self.mdbBb[g_table_asset_things].update({'_id':data.get('_id')}, {'$set':{'_id':data.get('_id')}}, True)
                if dbrv.get('ok'):
                    rt = data.get('_id').__str__()
        except Exception as e:
            print('set_iot_things error:' + e.__str__())
            logging.error('set_iot_things error:' + e.__str__())
        return rt

    def set_iot_groups(self, data):
        rt = 'Failed'
        try:
            if ObjectId.is_valid(data.get('_id')):
                data.update({'_id':ObjectId(data.get('_id'))})
            else:
                data.update({'_id':ObjectId()})
            for key in data:
                value = data.get(key)
                if key == '_idProj':
                    if ObjectId.is_valid(value):
                        value = ObjectId(value)
                if key == '_idPrt':
                    if isinstance(value, list):
                        value = ObjectId(value[0])
                    else:
                        if ObjectId.is_valid(value):
                            value = ObjectId(value)
                data.update({key:value})
            dbrv = self.mdbBb[g_table_iot_group].update({'_id':data.get('_id')}, {'$set':data}, True)
            if dbrv.get('ok'):
                rt = data.get('_id').__str__()
        except Exception as e:
            print('set_iot_groups error:' + e.__str__())
            logging.error('set_iot_groups error:' + e.__str__())
        return  rt

    def del_iot_things(self, tId):
        rt = False
        try:
            dbrv = self.mdbBb[g_table_asset_things].delete_many({'_id':{'$in':[ObjectId(Id) for Id in tId if ObjectId.is_valid(Id)]}})
            dbrv = self.mdbBb[g_table_iot_things].delete_many({'_id':{'$in':[ObjectId(Id) for Id in tId if ObjectId.is_valid(Id)]}})
            if dbrv.raw_result.get('ok') == 1:
                rt = True
        except Exception as e:
            print('del_iot_things error:' + e.__str__())
            logging.error('del_iot_things error:' + e.__str__())
        return rt

    def del_iot_groups(self, gTd):
        rt = False
        try:
            dbrv = self.mdbBb[g_table_iot_group].delete_many({'_id':{'$in':[ObjectId(Id) for Id in gTd if ObjectId.is_valid(Id)]}})
            if dbrv.raw_result.get('ok') == 1:
                rt = True
        except Exception as e:
            print('del_iot_groups error:' + e.__str__())
            logging.error('del_iot_groups error:' + e.__str__())
        return rt

    def get_iot_groups_things_fuzzy(self, projId, searchName = ''):
        rt = []
        cursor = None
        try:
            searchList = searchName.split(' ')
            for sn in searchList:
                regDict = {'$regex':sn,'$options':'$i'}
                cursor = self.mdbBb[g_table_iot_group].find({'projId':int(projId), '$or':[{'name':regDict}]})
                for item in cursor:
                    if isinstance(item.get('_idPrt'), ObjectId):
                        dbrv = self.mdbBb[g_table_iot_group].find_one({'_id':item.get('_idPrt')})
                        dbrv.update({'_id':dbrv.get('_id').__str__(), '_idProj':dbrv.get('_idProj').__str__(),
                                         '_idPrt':dbrv.get('_idPrt').__str__(), 'baseType':'groups'})
                        if dbrv not in rt:
                            rt.append(dbrv)
                    item.update({'_id':item.get('_id').__str__(), '_idProj':item.get('_idProj').__str__(),
                                 '_idPrt':item.get('_idPrt').__str__(), 'baseType':'groups'})
                    if item not in rt:
                        rt.append(item)
                cursor = self.mdbBb[g_table_iot_things].find({'projId':int(projId), '$or':[{'name':regDict}]})
                for item in cursor:
                    if isinstance(item.get('arrIdGrp'), list):
                        for idgrp in item.get('arrIdGrp'):
                            if isinstance(idgrp, ObjectId):
                                dbrv = self.mdbBb[g_table_iot_group].find_one({'_id':idgrp})
                                dbrv.update({'_id':dbrv.get('_id').__str__(), '_idProj':dbrv.get('_idProj').__str__(),
                                             '_idPrt':dbrv.get('_idPrt').__str__(), 'baseType':'groups'})
                                if dbrv not in rt:
                                    rt.append(dbrv)
                        grp = []
                        for g in item.get('arrIdGrp'):
                            grp.append(g.__str__())
                        item.update({'_id':item.get('_id').__str__(), 'arrIdGrp':grp, 'baseType':'things'})
                        if item not in rt:
                            rt.append(item)
        except Exception as e:
            print('get_iot_groups_things_fuzzy error:' + e.__str__())
            logging.error('get_iot_groups_things_fuzzy error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    def FacImportProject(self, userId, project, navs):
        newProjId = None
        try:
            # 将项目信息插入到 Fac_Project 表中
            newProjId = self.AddNewProject(userId, project.get('name_en'), project.get('name_cn'), project.get('name_english'))

            # 所有页面的 id 需要换成新的
            navIds = []
            for nav in navs:
                # import pdb; pdb.set_trace();
                strNavId = nav.get('_id')
                navIds.append( strNavId )
                # 字段名称换成 layerList
                if 'list' in nav:
                    nav.update({ '_id': ObjectId(strNavId), 'layerList': [str(x) for x in nav.get('list', [])] })
                    del nav['list']
                else:
                    nav.update({'_id': ObjectId(strNavId)})

                # 将页面数据列表信息插入到 Fac_Page 表中
                self.mdbBb[g_table_fac_page].update_one({'_id': nav.get('_id')}, {'$set': nav}, True)

                pageType = nav.get('type')
                # 如果是 PageSreen，则将线上的 layer 和 widget 的信息也进行复制
                if pageType == 'PageScreen':
                    # 从 ob_layer 表中拿到所有的图层信息
                    layerCursor = self.mdbBb[g_table_ob_layer].find({'_id': {'$in': [ObjectId(x) for x in nav.get('layerList')]}})
                    for layer in layerCursor:
                        # 更新插入到 fac_layer 表中
                        self.mdbBb[g_table_fac_layer].update_one({'_id': layer.get('_id')}, {'$set': layer}, True)
                        # 从 ob_widget 表中拿到所有的控件信息
                        widgetCursor = self.mdbBb[g_table_ob_widget].find({'_id': {'$in': [ObjectId(x) for x in layer.get('list')]}})
                        for widget in widgetCursor:
                            # 更新插入到 fac_widget 表中
                            self.mdbBb[g_table_fac_widget].update_one({'_id': widget.get('_id')}, {'$set': widget}, True)
                # 如果是 EnergyScreen 或 FacReportScreen，则将线上相应的信息也进行复制
                elif pageType in ['EnergyScreen', 'FacReportScreen']:
                    dashboardInfo = self.mdbBb[g_tableSpringLayout].find_one({'menuItemId': strNavId})
                    if dashboardInfo:
                        # 将数据更新插入到 g_table_fac_spring_layout 表中
                        self.mdbBb[g_table_fac_spring_layout].update_one({'menuItemId': strNavId}, {'$set': dashboardInfo}, True)

            # 将页面 id 列表信息插入到 Fac_Navigation 表中
            self.mdbBb[g_table_fac_navigation].insert_one({'_id':ObjectId(newProjId), 'list': navIds})

        except Exception as e:
            print('FacImportProject error:' + e.__str__())
            logging.error('FacImportProject error:' + e.__str__())
        return newProjId

    def appTempGetRoomsFromUserRoom(self, userId):
        rt = []
        cursor = None
        try:
            cursor = self.mdbBb[g_tableAppTempUserRoom].find({'userId':int(userId)})
            for item in cursor:
                roomId = item.get('roomId', '')
                grade = int(item.get('grade', 0))
                rt.append({'roomId':roomId.__str__() if isinstance(roomId, ObjectId) else roomId, 'grade':grade})
        except Exception as e:
            print('appTempGetRoomsFromUserRoom error:' + e.__str__())
            logging.error('appTempGetRoomsFromUserRoom error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    def appTempGetRoomListFromIOTGroup(self, roomList):
        rt = []
        cursor = None
        try:
            cursor = self.mdbBb[g_table_iot_group].find({'_id':{'$in':[ObjectId(x.get('roomId')) for x in roomList if ObjectId.is_valid(x.get('roomId'))]}})
            for item in cursor:
                roomId = item.get('_id').__str__()
                grade = 0
                for l in roomList:
                    if l.get('roomId') == roomId:
                        grade = l.get('grade')
                        break
                rt.append({'_id':roomId, '_idProj':item.get('_idProj').__str__(), 'arrP':item.get('arrP'), 'grade':grade,
                           'name':item.get('name'), '_idPrt':item.get('_idPrt').__str__(), 'prefix':item.get('prefix'),
                           'projId':item.get('projId'), 'type':item.get('type'), 'weight':item.get('weight'), 'params':item.get('params')})
        except Exception as e:
            print('appTempGetRoomListFromIOTGroup error:' + e.__str__())
            logging.error('appTempGetRoomListFromIOTGroup error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    def getLocationInfoUsers(self, data):
        rt = []
        cursor = None
        try:
            query = {}
            if 'spaceId' in data:
                query.update({'spaceId':ObjectId(data.get('spaceId'))})
            elif 'roomId' in data:
                query.update({'roomId':ObjectId(data.get('spaceId')), '$or':[{'spaceId':{'$exists':False}}, {'spaceId':None}]})
            if query:
                cursor = self.mdbBb[g_tableAppTempHistoryOperation].find(query, {'userId':1, '_id':0}).sort([('time',pymongo.DESCENDING)]).limit(5)
                rt = [x.get('userId') for x in cursor]
        except Exception as e:
            print('getLocationInfo error:' + e.__str__())
            logging.error('getLocationInfo error:' + e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    def getRoomUserList(self, roomId):
        rt = []
        cursor = None
        try:
            cursor = self.mdbBb[g_tableAppTempUserRoom].find({'roomId':ObjectId(roomId)})
            for item in cursor:
                rt.append({'userId':item.get('userId'), 'grade':item.get('grade')})
        except Exception as e:
            print('getRoomUserList error:'+e.__str__())
            logging.error('getRoomUserList error:'+e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    def setGrade(self, userId, roomId, grade=0):
        rt = False
        try:
            self.mdbBb[g_tableAppTempUserRoom].update({'userId':int(userId), 'roomId':ObjectId(roomId)}, {'$set':{'grade':grade}}, True)
            rt = True
        except Exception as e:
            print('setGrade error:'+e.__str__())
            logging.error('setGrade error:'+e.__str__())
        return rt

    def removeUserRoom(self, userId, roomId):
        rt = False
        try:
            self.mdbBb[g_tableAppTempUserRoom].remove({'userId':int(userId), 'roomId':ObjectId(roomId)})
            rt = True
        except Exception as e:
            print('removeUserRoom error:'+e.__str__())
            logging.error('removeUserRoom error:'+e.__str__())
        return rt
