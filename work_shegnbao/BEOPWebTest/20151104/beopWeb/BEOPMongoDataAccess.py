__author__ = 'mango'

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
    g_tableBuilding = 'Building'
    g_tableAppTempRoom = 'AppTemp_Room'
    g_tableAppTempSpace = 'AppTemp_Space'
    g_tableAppTempSensor = 'AppTemp_Sensor'
    g_tableAppTempWall = 'AppTemp_Wall'
    g_tableAppTempController = 'AppTemp_Controller'
    g_tableAppTempGateway = 'AppTemp_Gateway'

    # 点表
    g_pointTable = 'PointTable_Dev'
    g_pointSourceType = 'PointSourceType_Dev'

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
    g_tableBuilding = 'Building'
    g_tableAppTempRoom = 'AppTemp_Room'
    g_tableAppTempSpace = 'AppTemp_Space'
    g_tableAppTempSensor = 'AppTemp_Sensor'
    g_tableAppTempWall = 'AppTemp_Wall'
    g_tableAppTempController = 'AppTemp_Controller'
    g_tableAppTempGateway = 'AppTemp_Gateway'

    # 点表
    g_pointTable = 'PointTable'
    g_pointSourceType = 'PointSourceType'

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

    def __init__(self, hostAddr):
        bOk = False
        try:
            self.mdbConnection = None
            self._insertLength = 0
            self._hostAddr = hostAddr
            self._pageTypeMapping = []
            self.mdbConnection = pymongo.MongoClient(host=hostAddr,port=27017,socketKeepAlive=True)
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
                    mongoCollectionName = 'm1' + '_data_beopdata_' + dbName[len('beopdata_'):]
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
                if dbname.find('beopdata_') >= 0:
                    if timeFormat == 'M1':
                        collectionName = 'month' + '_data_beopdata_' + dbname[len('beopdata_'):]
                    else:
                        collectionName = timeFormat + '_data_beopdata_' + dbname[len('beopdata_'):]
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

    def getHistoryDataByFormatAggregate(self,dbname, pointList, timeStart, timeEnd, timeFormat):
        if timeFormat == 'm1':
            return self.getHistoryDataByFormat(dbname, pointList, timeStart, timeEnd, timeFormat)
        startObject = datetime.strptime(timeStart, '%Y-%m-%d %H:%M:%S')
        endObject = datetime.strptime(timeEnd, '%Y-%m-%d %H:%M:%S')
        data = []
        if isinstance(pointList, list):
            length = len(pointList)
            result_name_list = []
            if length > 0:
                collectionName = 'm1' + '_data_beopdata_' + dbname[len('beopdata_'):]
                data = []
                nameLast = ""
                temp = []
                try:
                    pipeList = []
                    pipe1 = {'$match':{'pointname':{'$in':pointList},'time':{'$gte':startObject,'$lte':endObject}}}
                    pipe2 = {'$project':{'_id':0,
                                         'pointname':1,
                                         'value':1,
                                         'time':1,
                                         'year':{'$year':'$time'},
                                         'month':{'$month':'$time'},
                                         'day':{'$dayOfMonth':'$time'},
                                         'hour':{'$hour':'$time'},
                                         'minute':{'$minute':'$time'},
                                         'second':{'$second':'$time'}}}
                    pipe3 = {}
                    if timeFormat == 'm5':
                        pipe3 = {'$match':{'minute':{'$mod':[5,0]}}}
                    elif timeFormat == 'h1':
                        pipe3 = {'$match':{'minute':0, 'second':0}}
                    elif timeFormat == 'd1':
                        pipe3 = {'$match':{'hour':0, 'minute':0, 'second':0}}
                    elif timeFormat == 'M1':
                        pipe3 = {'$match':{'day':1, 'hour':0, 'minute':0, 'second':0}}
                    pipe4 = {'$sort':{'pointname':1, 'time':1}}
                    pipeList.append(pipe1)
                    pipeList.append(pipe2)
                    pipeList.append(pipe3)
                    pipeList.append(pipe4)
                    cursor = self.mdbBb[collectionName].aggregate(pipeline=pipeList,batchSize=600, useCursor=True)
                    timeLast = None
                    valueLast = None
                    for item in cursor:
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
                    print('getHistoryDataByFormatAggregate failed')
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
                self.mdbBb[g_tableSpringLayout].save(post)
            except Exception as e:
                print('saveSpringLayout failed')
                print(e.__str__())
                logging.error(e.__str__())
                logging.exception(e)
        else:
            print('data is not dict')

    def springGetMenu(self, menuId):
        rv = {}
        if isinstance(menuId, str):
            post = {}
            layout_item = []
            dsInfoSet = set()
            rv['dsInfoList'] = []
            post = {'menuItemId':menuId}
            try:
                ret = self.mdbBb[g_tableSpringLayout].find_one(post)
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
        if isinstance(userId, int) and isinstance(data, dict):
            try:
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
        if isinstance(userId, int):
            try:
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

    def standardizeUserDataByFormat(self, data, timeFormat):
        retData = []
        if len(data) > 0 and len(timeFormat) > 0:
            lastTime = None
            for item in data:
                if len(item) == 3:
                    insertName = item[1]
                    insertValue = item[2]
                    if timeFormat == 'm1':
                        insertTime = item[0].replace(second=0)
                    elif timeFormat == 'm5':
                        insertTime = item[0].replace(minute=getNearestIntByNum(item[0].minute, 5),second=0)
                    elif timeFormat == 'm30':
                        insertTime = item[0].replace(minute=getNearestIntByNum(item[0].minute, 30),second=0)
                    elif timeFormat == 'h1':
                        insertTime = item[0].replace(minute=0,second=0)
                    elif timeFormat == 'd1':
                        insertTime = item[0].replace(hour=0,minute=0,second=0)
                    elif timeFormat == 'month':
                        insertTime = item[0].replace(hour=0,minute=0,second=0)
                    retData.append((insertTime, insertName, insertValue))
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
        if isinstance(userId, int) and isinstance(groupName, str) and isinstance(parentId, str):
            IdObject = None
            if not ObjectId.is_valid(groupId):
                IdObject = ObjectId()
            else:
                IdObject = ObjectId(groupId)
            try:
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
        if isinstance(userId , int):
            post = {}
            if ObjectId.is_valid(groupId):
                try:
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
        if isinstance(userId, int) and isinstance(newGroupIdList, list):
            try:
                ret = self.mdbBb[g_tableDataSourceGroupList].find_one({'userId':userId})
                if ret:
                    if len(ret.get('groupList', [])) != len(newGroupIdList):
                        result = {'error':'failed'}
                        return result
                self.mdbBb[g_tableDataSourceGroupList].update({'userId':userId}, {'$set':{'groupList':newGroupIdList}})
            except Exception as e:
                print(e.__str__())
                logging.error(e.__str__())
                logging.exception(e)
                result = {'error':'failed'}
        return result

    def getDataSourceGroupInfo(self, userId):
        rt = []
        if isinstance(userId, int):
            try:
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

    def getMinPeriod(self, dbName):
        collectionList = self.getAllCollections()
        res_list = []
        if len(collectionList) > 0:
            for name in collectionList:
                if dbName[len('beopdata_'):] in name:
                    res_list.append(name[:name.find('_beopdata_')])
            if 'm1' in res_list:
                return 'm1'
            elif 'm5' in res_list:
                return 'm5'
            elif 'h1' in res_list:
                return 'h1'
            elif 'd1' in res_list:
                return 'd1'
            elif 'month' in res_list:
                return 'M1'
        return ''

    def getInsertLength(self):
        return self._insertLength

    def rollback_insert_data(self, dbName, pointList, startTime, endTime):
        result = True
        if len(pointList) > 0:
            timeFormatList = ['m1','m5','h1','d1','month']
            post = {'pointname':{'$in':pointList},'time':{'$gte':startTime,'$lte':endTime}}
            try:
                for timeFormat in timeFormatList:
                    collectionName = timeFormat + '_data_beopdata_' + dbName[len('beopdata_'):]
                    self.mdbBb[collectionName].remove(post)
            except Exception as e:
                result = False
        return result

    def shareLogGet(self,userId):
        shareLogList = []
        if isinstance(userId, int):
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

    def genHisRouteTable(self):
        cl =  self.getAllCollections()
        hisList = []
        for item in cl:
            if '_data_beopdata_' in item:
                hisList.append(item)
        setHisList = set(hisList)
        setNoneHisList = set(cl) - setHisList - set(['system.indexes'])
        noneHisList = list(setNoneHisList)
        clExclude = []
        for name in list(hisList):
            if 'wdzzsy' in name or 'wdzzbh' in name or 'qdwdstore12' in name or \
                'qdwdbusines' in name or 'kmwd2345678' in name or 'kmbusiness6' in name or\
                'beopdata_kmstore5678' in name or 'huawei' in name or 'hkhuarun' in name:
                clExclude.append(name)
        setExcludeList = set(clExclude)
        his208 = clExclude
        his67 = list(setHisList-setExcludeList)
        return noneHisList, his208, his67

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
                    if not(wsId is None) and wsId == ws['id']:
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
    def appTempGetRoomList(self, userId=None):
        buildingList = []
        roomList = []

        try:
            # 获取所有的 buidling list
            buildingCursor = self.mdbBb[g_tableBuilding].find();
            for item in buildingCursor:
                item['id'] = item['_id'].__str__()
                del item['_id']
                buildingList.append(item)
            roomCursor = self.mdbBb[g_tableAppTempRoom].find();
            for item in roomCursor:
                item['id'] = item['_id'].__str__()
                del item['_id']
                item['buildingId'] = item['buildingId'].__str__()
                item['map'] = item.get('map', {})
                item['map']['img'] = str( item['map'].get( 'img', bytes() ).decode() )
                roomList.append(item)

        except Exception as e:
            print('appTempGetRoomList failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
        return buildingList, roomList

    # 获取一个房间的详细信息
    def appTempGetRoomDetail(self, roomId):
        o_roomId = ObjectId(roomId)

        spaces = []
        spaceSensorIds = []
        spaceControllerIds = []
        spaceWallIds = []
        walls = []
        sensors = []
        controllers = []

        try:
            # 获取指定 room 的 spaces list
            cursor = self.mdbBb[g_tableAppTempSpace].find({'roomId': o_roomId});
            for item in cursor:
                item['id'] = item['_id'].__str__()
                del item['_id']

                spaceWallIds = spaceWallIds + item.get('wallIds', [])
                spaceSensorIds = spaceSensorIds + item.get('sensorIds', [])
                spaceControllerIds = spaceControllerIds + item.get('controllerIds', [])

                # ObjectId 处理
                item['roomId'] = item['roomId'].__str__()
                item['wallIds'] = [x.__str__() for x in item.get('wallIds', [])]
                item['sensorIds'] = [x.__str__() for x in item.get('sensorIds', [])]
                item['controllerIds'] = [x.__str__() for x in item.get('controllerIds', [])]
                spaces.append(item)
            cursor.close()
            # walls
            cursor = self.mdbBb[g_tableAppTempWall].find({'_id': {'$in': spaceWallIds}});
            for item in cursor:
                item['id'] = item['_id'].__str__()
                del item['_id']
                walls.append(item)
            cursor.close()
            # sensors
            cursor = self.mdbBb[g_tableAppTempSensor].find({'_id': {'$in': spaceSensorIds}});
            for item in cursor:
                item['id'] = item['_id'].__str__()
                item['spaceId'] = item['spaceId'].__str__()
                del item['_id']
                sensors.append(item)
            cursor.close()
            # controllers
            cursor = self.mdbBb[g_tableAppTempController].find({'_id': {'$in': spaceControllerIds}});
            for item in cursor:
                item['id'] = item['_id'].__str__()
                item['spaceId'] = item['spaceId'].__str__()
                del item['_id']
                controllers.append(item)
            cursor.close()

        except Exception as e:
            print('appTempGetRoomDetail failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
        return {'spaces': spaces, 'walls': walls, 'sensors': sensors, 'controllers': controllers}

    # 获取所有的房间列表
    def appTempGetRealtimeVal(self, sensorIds, controllerIds):
        buildingList = []
        roomList = []

        try:
            # 获取所有的 buidling list
            buildingCursor = self.mdbBb[g_tableBuilding].find();
            for item in buildingCursor:
                item['id'] = item['_id'].__str__()
                del item['_id']
                buildingList.append(item)
            roomCursor = self.mdbBb[g_tableAppTempRoom].find();
            for item in roomCursor:
                item['id'] = item['_id'].__str__()
                del item['_id']
                item['buildingId'] = item['buildingId'].__str__()
                roomList.append(item)

        except Exception as e:
            print('appTempGetRealtimeVal failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
        return buildingList, roomList

    # 新增一个 building
    def appTempCreateBuilding(self, data):
        try:
            if data is None:
                return {'status': 'ERROR'}
            self.mdbBb[g_tableBuilding].insert_one({
                '_id': ObjectId(data['id']) if 'id' in data else ObjectId(),
                'name': data.get('name', ''),
                'address': data.get('address', ''),
                'principal': data.get('principal', ''),
                'gps': data.get('gps', '')
            })
        except Exception as e:
            print('appTempCreateBuilding failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
            return {'status': 'ERROR'}
        return {'status': 'OK'}

    def appTempSaveRoom(self, dataList):
        try:
            if dataList is None:
                return {'status': 'ERROR', 'msg': '数据为空！'}
            if not isinstance(dataList, list):
                dataList = [dataList]

            for data in dataList:
                if data.get('buildingId') == None:
                    return {'status': 'ERROR', 'msg': 'building id 为空！'}
                if data.get('id') == None:
                    return {'status': 'ERROR', 'msg': 'id 为空！'}

                roomMap = data.get('map', {})
                oid = ObjectId(data['id']) if 'id' in data else ObjectId()
                self.mdbBb[g_tableAppTempRoom].update_one({
                    '_id': oid    
                }, {
                    '$set': {
                        '_id': oid,
                        'name': data.get('name', ''),
                        'floor': data.get('floor', ''),
                        'gatewayId': data.get('gatewayId', ''),
                        'buildingId': ObjectId( data.get('buildingId') ),
                        'map': {
                            'img': bytes( roomMap.get('img','').encode() ),
                            'width': roomMap.get('width', 0),
                            'height': roomMap.get('height', 0),
                            'x': roomMap.get('x', 0),
                            'y': roomMap.get('y', 0),
                            'scale': roomMap.get('scale', 1),
                            'orientation': roomMap.get('orientation', 0)
                        }
                    }
                }, True)

        except Exception as e:
            print('appTempCreateRoom failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
            return {'status': 'ERROR'}
        return {'status': 'OK'}

    def appTempSaveSpace(self, dataList):
        try:
            if dataList is None:
                return {'status': 'ERROR', 'msg': '数据为空！'}

            if not isinstance(dataList, list):
                dataList = [dataList]

            for data in dataList:
                if data.get('roomId') == None:
                    return {'status': 'ERROR', 'msg': 'room id 必须要填写'}
                
                oid = ObjectId(data['id']) if 'id' in data else ObjectId()
                self.mdbBb[g_tableAppTempSpace].update_one({
                    '_id': oid    
                }, {
                    '$set': {
                        '_id': oid,
                        'name': data.get('name'),
                        'width': data.get('width', 0),
                        'height': data.get('height', 0),
                        'path': data.get('path', []),
                        'x': data.get('x', 0),
                        'y': data.get('y', 0),
                        'roomId': ObjectId( data.get('roomId') ),
                        'wallIds': data.get('wallIds', []),
                        'sensorIds': data.get('sensorIds', []),
                        'controllerIds': data.get('controllerIds', [])
                    }
                }, True)
        except Exception as e:
            print('appTempCreateSpace failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
            return {'status': 'ERROR'}
        return {'status': 'OK'}

    def appTempSaveSensor(self, dataList):
        try:
            if dataList is None:
                return {'status': 'ERROR', 'msg': '数据为空！'}

            if not isinstance(dataList, list):
                dataList = [dataList]

            for data in dataList:
                spaceId = data.get('spaceId')
                if spaceId == None:
                    return {'status': 'ERROR', 'msg': 'space id 必须要填写'}

                oSpaceId = ObjectId(spaceId)
                oSensorId = ObjectId(data['id']) if 'id' in data else ObjectId()
                
                self.mdbBb[g_tableAppTempSpace].update_one({'_id': oSpaceId}, {
                    '$addToSet': {'sensorIds': {'$each': [oSensorId]}}
                })

                self.mdbBb[g_tableAppTempSensor].update_one({
                    '_id': oSensorId    
                }, {
                    '$set': {
                        '_id': oSensorId,
                        'name': data.get('name', 0),
                        'x': data.get('x', 0),
                        'y': data.get('y', 0),
                        'spaceId': oSpaceId,
                        'mac': data.get('mac', ''),
                        'network': data.get('network', '')
                    }
                }, True)

        except Exception as e:
            print('appTempCreateSensor failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
            return {'status': 'ERROR'}
        return {'status': 'OK'}

    def appTempSaveController(self, dataList):
        try:
            if dataList is None:
                return {'status': 'ERROR', 'msg': '数据为空！'}

            if not isinstance(dataList, list):
                dataList = [dataList]

            for data in dataList:
                spaceId = data.get('spaceId')
                if spaceId == None:
                    return {'status': 'ERROR', 'msg': 'space id 必须要填写'}
                oSpaceId = ObjectId(spaceId)

                oControllerId = ObjectId(data['id']) if 'id' in data else ObjectId()
                # 先向引用中添加
                self.mdbBb[g_tableAppTempSpace].update_one({'_id': oSpaceId}, {
                    '$addToSet': {'controllerIds': {'$each': [oControllerId]}}
                })
                # 再向表中添加
                self.mdbBb[g_tableAppTempController].update_one({
                    '_id': oControllerId    
                }, {
                    '$set': {
                        '_id': oControllerId,
                        'name': data.get('name', 0),
                        'x': data.get('x', 0),
                        'y': data.get('y', 0),
                        'spaceId': oSpaceId,
                        'mac': data.get('mac', ''),
                        'network': data.get('network', ''),
                        'isLocal': data.get('isLocal', 1)
                    }
                }, True)

        except Exception as e:
            print('appTempCreateController failed')
            print(e.__str__())
            logging.error(e.__str__())
            logging.exception(e)
            return {'status': 'ERROR'}
        return {'status': 'OK'}