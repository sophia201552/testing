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

#define table names
if app.config.get('DEV_ENVIRONMENT'):
    g_tableCustomNav = 'CustomNav_copy_Dev'
    g_tableCustomNavItem = 'CustomNavItem_copy_Dev'
    g_tableSpringLayout = 'SpringLayout_Dev'
    g_tableWeather = 'WeatherStation'
    g_tableWeatherData = 'WeatherStationData'
    g_tableDataSource = 'DataSource_Dev'
    g_tableWorkspace = 'WorkSpace_Dev'
    g_tableTemplate = 'Template_Dev'
    g_tableDataSourceGroup = 'DataSourceGroup_Dev'
else:
    g_tableCustomNav = 'CustomNav_copy'
    g_tableCustomNavItem = 'CustomNavItem_copy'
    g_tableSpringLayout = 'SpringLayout'
    g_tableWeather = 'WeatherStation'
    g_tableWeatherData = 'WeatherStationData'
    g_tableDataSource = 'DataSource'
    g_tableWorkspace = 'WorkSpace'
    g_tableTemplate = 'Template'
    g_tableDataSourceGroup = 'DataSourceGroup'

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
    __instance = None
    
    def __init__(self):
        bOk = False
        try:
            self._insertLength = 0
            hostAddr = app.config.get('MONGO_SERVER_HOST')
            self.mdbConnection=pymongo.MongoClient(hostAddr,27017)
            self.mdbBb = self.mdbConnection.beopdata
            bOk = self.mdbBb.authenticate('beopweb','RNB.beop-2013')
        except Exception as e:
            print('init mongodb connection failed')
        if not bOk:
            logging.error('init mongodb connection failed')

    @classmethod
    def getInstance(self):
        if(self.__instance == None):
            self.__instance = BEOPMongoDataAccess()
        return self.__instance

    #mango get all collections from beopdata
    def getAllCollections(self):
        rt = []
        try:
            rt = self.mdbBb.collection_names()
        except Exception as e:
            print('get all collection names failed')
            logging.error(e)
            print(e)
        return rt

    def InsertTableData(self, data, mongoDBTableName):
        rt = []
        total = 0
        constMaxRowsPerOperation = 20000  #docs num for each insert
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
        return total

    #insert user data
    def InsertTableDataUser(self, data, dbName, removeExist=0):
        result = 0
        if len(dbName) > 0:
            rt = []
            timeFormatList = ['m1','m5','h1','d1','month']
            constMaxRowsPerOperation = 30000
            length = len(data)
            if length > 0:
                for format in timeFormatList:
                    mongoCollectionName = format + '_data_beopdata_' + dbName[len('beopdata_'):]
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
        return result

    #mango added to get historyData from mongoDB(so many details to pay attention to...add check methods)
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
                else:
                    if timeFormat == 'M1':
                        collectionName = 'month' + '_data_beopdata_' + dbname
                    else:
                        collectionName = timeFormat + '_data_beopdata_' + dbname
                data = []
                nameLast = ""
                temp = []
                try:
                    cursor = self.mdbBb[collectionName].find(post).sort([('pointname',pymongo.ASCENDING),('time',pymongo.ASCENDING)])
                    timeLast = None
                    valueLast = None
                    if self.mdbConnection.address[0] == 'beop.rnbtech.com.hk':#in low version,should use:self.mdbConnection.host == 'beop.rnbtech.com.hk'
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
                    elif self.mdbConnection.address[0] == '121.41.33.198':
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
                    print('get mongodb history data failed')
                if timeFormat == 'm1':
                    mtemp = startObject.minute+1
                    mi = mtemp if mtemp<60 else -1
                    if mi!=-1:
                        startObject = startObject.replace(second=0,minute=mi)
                    else:
                        startObject = startObject.replace(second=0,minute=0,hour=startObject.hour+1)
                elif timeFormat == 'm5':
                    mi = getTimeNum(startObject.minute, 5, 'minute')
                    if mi!=-1:
                        startObject = startObject.replace(second=0,minute=mi)
                    else:
                        startObject = startObject.replace(second=0,minute=0,hour=startObject.hour+1)
                elif timeFormat == 'm30':
                    mi = getTimeNum(startObject.minute, 30, 'minute')
                    if mi!=-1:
                        startObject = startObject.replace(second=0,minute=mi)
                    else:
                        startObject = startObject.replace(second=0,minute=0,hour=startObject.hour+1)
                elif timeFormat == 'h1':
                    startObject = startObject.replace(second=0,minute=0)
                elif timeFormat == 'd1':
                    startObject = startObject.replace(second=0,minute=0,hour=0)
                elif timeFormat == 'M1':
                    startObject = startObject.replace(second=0,minute=0,hour=0,day=1)
                timeStart = startObject.strftime('%Y-%m-%d %H:%M:%S')
                for item_check_index in range(len(data)):
                    if len(data[item_check_index].get('record')) > 0:
                        query_time_start = data[item_check_index].get('record')[0].get('time')
                        oj_query_time_start = datetime.strptime(query_time_start, '%Y-%m-%d %H:%M:%S')
                        if oj_query_time_start > startObject:
                            rv = self.getNearestValueByTimeAndName(dbname, data[item_check_index].get('pointname'), query_time_start, timeFormat)
                            if len(rv) > 0:
                                findTime = rv['time']
                                findName = rv['pointname']
                                findValue = rv['value']
                                if findName == data[item_check_index].get('pointname'):
                                    bNum = True
                                    try:
                                        valueConvertToFloat = float(findValue)
                                    except Exception as e:
                                        bNum = False

                                    if bNum:
                                        data[item_check_index].get('record').insert(0, dict(time=timeStart, value='%.2f'%float(valueConvertToFloat)))
                                    else:
                                        data[item_check_index].get('record').insert(0, dict(time=timeStart, value=findValue))
                for point in pointList:
                    if point not in result_name_list:
                        temp = []
                        rv = self.getNearestValueByTimeAndName(dbname, point, timeStart, timeFormat)
                        if len(rv) > 0:
                            findTime = rv['time']
                            findName = rv['pointname']
                            findValue = rv['value']
                            bNum = True
                            try:
                                valueConvertToFloat = float(findValue)
                            except Exception as e:
                                bNum = False
                            if bNum:
                                temp.append(dict(time=timeStart, value='%.2f'%float(valueConvertToFloat)))
                            else:
                                temp.append(dict(time=timeStart, value=findValue))
                            if len(temp) > 0:
                                data.append(dict(pointname=point, record=temp))
        return data

    def getNearestValueByTimeAndName(self, dbname, pointname, time, timeFormat):
        rt = {}
        if isinstance(time, str):
            timeObject = datetime.strptime(time, '%Y-%m-%d %H:%M:%S')
            post = {'pointname':{'$in':[pointname]},'time':{'$lt':timeObject}}
            collectionName = ''
            if timeFormat == 'M1':
                collectionName = 'month' + '_data_beopdata_' + dbname[len('beopdata_'):]
            else:
                collectionName = timeFormat + '_data_beopdata_' + dbname[len('beopdata_'):]
            try:
                cursor = self.mdbBb[collectionName].find(post).sort([('time',pymongo.DESCENDING)]).limit(1)
                for item in cursor:
                    findTime = item['time']
                    findName = item['pointname']
                    findValue = item['value']
                    rt = {'time':findTime.strftime('%Y-%m-%d %H:%M:%S'), 'pointname':findName, 'value':str(findValue)}
                    break
            except Exception as e:
                print('getNearestValueByTimeAndName failed')
        return rt

    #mango get data from a point at specified time
    def getHistoryDataSingleByFormat(self, dbname, pointName, time, timeFormat):
        post = {}
        post['pointname'] = dbname
        if isinstance(time,str):
            post['time'] = datetime.strptime(time, '%Y-%m-%d %H:%M:%S')
        elif isinstance(time,datetime):
            post['time'] = time
        else:
            logging.error('\'time\' parameter is invalid')
        collection_name = ''
        if timeFormat == 'M1':
            collection_name = 'month' + '_data_beopdata_' + dbname[len('beopdata_'):]
        else:
            collection_name = timeFormat + '_data_beopdata_' + dbname[len('beopdata_'):]
        try:
            rt = self.mdbBb[collection_name].find_one(post)
            if rt is None:
                logging.error('error: finding data failed')
        except Exception as e:
            print('get mongodb history data single failed')
        return [dict(time=rt['time'].strftime('%Y-%m-%d %H:%M:%S'), value=str(rt['value']))]

    #mango web_designer api for nav
    def saveTableCustomNav(self, data, id = None):
        if isinstance(data, dict):
            userId = data['userId']
            projectId = data['projectId']
            list = data['list']
            l = []
            for i in list:
                l.append(ObjectId(i))
            if id == None:
                post = {'userId':userId, 'projectId':projectId, 'list':l}
            else:
                post = {'_id':ObjectId(id), 'userId':userId, 'projectId':projectId, 'list':l}
            if isinstance(post, dict):
                try:
                    self.mdbBb[g_tableCustomNav].save(post)
                except Exception as e:
                    print('saveTableCustomNav failed')
        else:
            print('data is not dict')

    def deleteTableCustomNavByMongoId(self, id):
        post = {'_id':ObjectId(id)}
        if isinstance(post, dict):
            try:
                self.mdbBb[g_tableCustomNav].remove(post)
            except Exception as e:
                print('deleteTableCustomNavByMongoId failed')

    def deleteTableCustomNavByUserIdAndProjectId(self, userId, projectId):
        post = {'userId':userId, 'projectId':projectId}
        if isinstance(post, dict):
            try:
                self.mdbBb[g_tableCustomNav].remove(post)
            except Exception as e:
                print('deleteTableCustomNavByMongoId failed')

    def getTableCustomNavById(self, id):
        post = {'_id':ObjectId(id)}
        dic = {}
        if isinstance(post, dict):
            try:
                rv = self.mdbBb[g_tableCustomNav].find_one(post)
                dic['id'] = id
                dic['userId'] = rv['userId']
                dic['projectId'] = rv['projectId']
                l = rv['list']
                idArray = []
                for i in l:
                    idArray.append(i.__str__())
                dic['list'] = idArray
            except Exception as e:
                print('getTableCustomNavById failed')
            return dic

    def getTableCustomNavByUserIdAndProjectId(self, userId, projectId):
        post = {'userId':userId, 'projectId':projectId}
        dic = {}
        if isinstance(post, dict):
            try:
                rv = self.mdbBb[g_tableCustomNav].find_one(post)
                dic['id'] = rv['_id'].__str__()
                dic['userId'] = userId
                dic['projectId'] = projectId
                l = rv['list']
                idArray = []
                for i in l:
                    idArray.append(i.__str__())
                dic['list'] = idArray
            except Exception as e:
                print('getTableCustomNavByUserIdAndProjectId failed')
            return dic

    #mango web_designer api for nav_item
    def saveTableCustomNavItem(self, data, id = None):
        if isinstance(data, dict):
            text = data['text']
            type = data['type']
            parent = data['parent']
            if id == None:
                post = {'text':text,  'type':type, 'parent':parent}
            else:
                post = {'_id':ObjectId(id),  'text':text,  'type':type, 'parent':parent}
            if isinstance(post, dict):
                try:
                    self.mdbBb[g_tableCustomNavItem].save(post)
                except Exception as e:
                    print('saveTableCustomNavItem failed')
        else:
            print('data is not dict')

    def deleteTableCustomNavItemByMongoId(self, id):
        post = {'_id':ObjectId(id)}
        if isinstance(post, dict):
            try:
                self.mdbBb[g_tableCustomNavItem].remove(post)
            except Exception as e:
                print('deleteTableCustomNavItemByMongoId failed')

    def deleteTableCustomNavItemByTextAndType(self, text, type):
        post = {'text':text, 'type':type}
        if isinstance(post, dict):
            try:
                self.mdbBb[g_tableCustomNavItem].remove(post)
            except Exception as e:
                print('deleteTableCustomNavItemByTextAndType failed')

    def getTableCustomNavItemById(self, id):
        post = {'_id':ObjectId(id)}
        if isinstance(post, dict):
            try:
                rv = self.mdbBb[g_tableCustomNavItem].find_one(post)
            except Exception as e:
                print('getTableCustomNavItemById failed')
            return {'id':id, 'text':rv['text'], 'type':rv['type'], 'parent':rv['parent']}

    def getTableCustomNavItemByUserIdAndProjectId(self, userId, projectId):
        post = {'userId':userId, 'projectId':projectId}
        if isinstance(post, dict):
            try:
                rv = self.mdbBb[g_tableCustomNavItem].find_one(post)
            except Exception as e:
                print('getTableCustomNavItemByUserIdAndProjectId failed')
            return {'id':rv['id'].__str__(), 'text':rv['text'], 'type':rv['type'], 'parent':rv['parent']}

    def getCustomNavAllById(self, id):
        rvdata = {'list':[]}
        post = {'_id':ObjectId(id)}
        if isinstance(post, dict):
            try:
                rv = self.mdbBb[g_tableCustomNav].find_one(post)
                if rv is not None:
                    rvdata['id'] = id
                    rvdata['userId'] = rv['userId']
                    rvdata['projectId'] = rv['projectId']
                    list = rv['list']
                    itemList = []
                    for i in list:
                        rvSub = self.getTableCustomNavItemById(i.__str__())
                        if rvSub is not None:
                            itemList.append({'id':rvSub['id'].__str__(), 'text':rvSub['text'], 'type':rvSub['type'], 'parent':rvSub['parent']})
                    if len(itemList) > 0:
                        rvdata['list'] = itemList
            except Exception as e:
                print('getCustomNavAllById failed')
        return rvdata

    def getCustomNavAllByUserIdAndProjectId(self, userId, projectId):
        rvdata = {'list': []}
        if isinstance(userId, str):
            userId = int(userId)
        if isinstance(projectId, str):
            projectId = int(projectId)
        post = {'userId': userId, 'projectId': projectId}
        if isinstance(post, dict):
            try:
                rv = self.mdbBb[g_tableCustomNav].find_one(post)
                if rv != None:
                    rvdata['id'] = rv['_id'].__str__()
                    rvdata['userId'] = userId
                    rvdata['projectId'] = projectId
                    list = rv['list']
                    itemList = []
                    for i in list:
                        rvSub = self.getTableCustomNavItemById(i.__str__())
                        if rvSub is not None:
                            itemList.append({'id': rvSub['id'], 'text': rvSub['text'], 'type': rvSub['type'],
                                             'parent': rvSub['parent']})
                    if len(itemList) > 0:
                        rvdata['list'] = itemList
                else:
                    post = {'_id': ObjectId('550a8bb1199d840cf8282d6e')}
                    rv = self.mdbBb[g_tableCustomNav].find_one(post)
                    if rv != None:
                        rvdata['id'] = rv['_id'].__str__()
                        rvdata['userId'] = userId
                        rvdata['projectId'] = projectId
                        list = rv['list']
                        itemList = []
                        for i in list:
                            rvSub = self.getTableCustomNavItemById(i.__str__())
                            if rvSub is not None:
                                itemList.append({'id': rvSub['id'], 'text': rvSub['text'], 'type': rvSub['type'],
                                                 'parent': rvSub['parent']})
                        if len(itemList) > 0:
                            rvdata['list'] = itemList
            except Exception as e:
                print('getCustomNavAllByUserIdAndProjectId failed')
        return rvdata

    def getCustomNavAllByRoleAndProject(self, project_id, role_ids):
        rv = self.mdbBb[g_tableCustomNav].find_one({'projectId': int(project_id)}, {'roleNav': 1})
        if not rv:
            return [], []
        role_nav = rv.get('roleNav')
        if not role_nav:
            return [], []
        top_nav = self._getNavAllByType(role_nav, role_ids, 'nav')
        func_nav = self._getNavAllByType(role_nav, role_ids, 'funcNav')
        return top_nav, func_nav

    def _getNavAllByType(self, role_nav, role_ids, type):
        nav_id_list = []
        for role_id in role_ids:
            role_obj = role_nav.get(str(role_id))
            if role_obj:
                nav = role_obj.get(type)
                if nav:
                    nav_id_list += nav
        nav_id_list = list(set(nav_id_list))
        nav_item_list = self.mdbBb[g_tableCustomNavItem].find({'_id': {'$in': nav_id_list}})
        ret = []
        for ret_item in nav_item_list:
            ret_item['id'] = ret_item.get('_id').__str__()
            del ret_item['_id']
            if ret_item.get('parent'):
                ret_item['parent'] = ret_item.get('parent').__str__()
            ret.append(ret_item)
        return ret

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
                            if modal != None:
                                option = modal.get('option')
                                type = modal.get('type')
                                interval = modal.get('interval')
                                title = modal.get('title')
                                points = modal.get('points')
                                if points != None:
                                    if len(points) > 0:
                                        dsInfoSet |= set(points)
                                layout_item.append({'id':container_id, 'spanR':spanR, 'spanC':spanC, 'modal':{'interval':interval, 'type':type, 'points':points, 'title':title, 'option':option}})
                        layout_item_list.append(layout_item)
                    rv['layout'] = layout_item_list
                    dsl = list(dsInfoSet)
                    dsInfoList = self.analysisDataSourceGetByIdList(dsl)
                    if len(dsInfoList) > 0:
                        rv['dsInfoList'] = dsInfoList
            except Exception as e:
                print(e.__str__())
                logging.error(e.__str__())
        return rv

    def insertWeatherStation(self, weatherStationId, weatherStationName):
        post = {'id':weatherStationId,  'name':weatherStationName}
        try:
            self.mdbBb[g_tableWeather].save(post)
        except Exception as e:
            print('insertWeatherStation failed')

    def insertWeatherStationData(self, weatherStationId, weatherInfo, aqi, temp):
        tNow = datetime.now()
        post = {'id':weatherStationId, 'time':tNow,  'info':weatherInfo, 'aqi':aqi,  'temp':temp}
        try:
            self.mdbBb[g_tableWeatherData].save(post)
        except Exception as e:
            print('insertWeatherStationData failed')

    def getWeatherIdList(self):
        idList = []
        try:
            rv = self.mdbBb[g_tableWeather].find()
            for item in rv:
                idList.append(item['id'])
        except Exception as e:
            print('getWeatherIdList failed')
        return idList

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

        return rvdata

    #mango add for analysis
    def analysisDataSourceSaveMulti(self, userId, data):
        id = ''
        itemIdList = []
        if isinstance(userId, int) and isinstance(data, dict):
            bDataSourceId = False
            if 'datasourceId' in data.keys():
                bDataSourceId = True
            try:
                listArray = []
                for item in data['itemList']:
                    if 'id' not in item.keys():
                        geneId = ObjectId()
                        if 'projId' in item.keys():
                            listArray.append({'id':geneId, 'projId':int(item['projId']), 'type':int(item['type']), 'alias':str(item['alias']), 'value':str(item['value']), 'note':str(item['note']), 'groupId':str(item['groupId'])})
                        else:
                            listArray.append({'id':geneId, 'projId':-1, 'type':int(item['type']), 'alias':str(item['alias']), 'value':str(item['value']), 'note':str(item['note']), 'groupId':str(item['groupId'])})
                        val = item['value']
                        itemIdList.append({'alias':str(item['alias']), 'id':geneId.__str__(), 'value':val, 'note':str(item['note']), 'groupId':str(item['groupId'])})
                    else:
                        if 'projId' in item.keys():
                            listArray.append({'id':ObjectId(item['id']), 'projId':int(item['projId']), 'type':int(item['type']), 'alias':str(item['alias']), 'value':str(item['value']), 'note':str(item['note']), 'groupId':str(item['groupId'])})
                        else:
                            listArray.append({'id':ObjectId(item['id']), 'projId':-1, 'type':int(item['type']), 'alias':str(item['alias']), 'value':str(item['value']), 'note':str(item['note']), 'groupId':str(item['groupId'])})
                        val = item['value']
                        itemIdList.append({'alias':str(item['alias']), 'id':item['id'],  'value':val, 'note':str(item['note']), 'groupId':str(item['groupId'])})

                post = {'userId':userId}
                rv = self.mdbBb[g_tableDataSource].find_one(post)
                if rv == None:
                    if 'itemList' in data.keys():
                        save_rt = None
                        post = {'userId':userId, 'list':listArray}
                        save_rt = self.mdbBb[g_tableDataSource].save(post)
                        if isinstance(save_rt, ObjectId):
                            id = save_rt.__str__()
                else:
                    if not bDataSourceId:
                        for item in listArray:
                            post = {'userId':userId, 'list.id':item['id']}
                            doc = {}
                            rt = self.mdbBb[g_tableDataSource].find_one(post)
                            if rt == None:
                                post = {'userId':userId}
                                doc = {'$addToSet':{'list':item}}
                            else:
                                doc = {'$set':{'list.$':item}}
                            self.mdbBb[g_tableDataSource].update(post, doc)
                    else:
                        id = data['datasourceId']
                        for item in listArray:
                            post = {'userId':userId, '_id':ObjectId(data['datasourceId']), 'list.id':item['id']}
                            doc = {}
                            rt = self.mdbBb[g_tableDataSource].find_one(post)
                            if rt == None:
                                post = {'userId':userId, '_id':ObjectId(data['datasourceId'])}
                                doc = {'$addToSet':{'list':item}}
                            else:
                                doc = {'$set':{'list.$':item}}
                            self.mdbBb[g_tableDataSource].update(post, doc)
            except Exception as e:
                print('analysisDataSourceSaveMulti failed')
        return {'id':id, 'itemIdList':itemIdList}

    def analysisDataSourceSaveLayout(self, userId, data):
        rt = {'success':False}
        if isinstance(userId, int) and isinstance(data, dict):
            newItemList = []
            id = data.get('datasourceId')
            itemList = data.get('list')
            originalList = self.getListContentByIdAndUserId(id, userId)
            for ids in itemList:
                ob = self.getItemContentById(ids, originalList)
                newItemList.append(ob)
            spec = {}
            if id != None:
                spec = {'_id':ObjectId(id), 'userId':userId}
            else:
                spec = {'userId':userId}
            doc = {'$unset':{'list':{'exist':True}}}
            rt = {'success':True}
            try:
                self.mdbBb[g_tableDataSource].update(spec, doc)
                rt = {'success':True}
            except Exception as e:
                print('delete list from datasource failed')
                rt['success'] = False
            doc = {'$pushAll':{'list':newItemList}}
            try:
                self.mdbBb[g_tableDataSource].update(spec, doc)
                rt = {'success':True}
            except Exception as e:
                print('analysisDataSourceSaveLayout failed')
                rt['success'] = False
        return rt

    def analysisDataSourceRemoveSingle(self, datasourceId, datasourceItemId, userId):
        rt = {'success':True, 'deleteModal':[]}
        if isinstance(datasourceId, str) and isinstance(datasourceItemId, str):
            spec = {}
            if ObjectId.is_valid(datasourceId):
                spec = {'_id':ObjectId(datasourceId), 'userId':userId}
            else:
                spec = {'userId':userId}
            doc = {'$pull':{'list':{'id':ObjectId(datasourceItemId)}}}
            try:
                item = self.getDataSourceItemInfoById(datasourceItemId)
                if item != None:
                    if item.get('type') == 0:
                        res = self.deleteModalByAssociateDatasource(userId, datasourceItemId)
                        rt['success'] = res[0]
                        rt['deleteModal'] = res[1]
                self.mdbBb[g_tableDataSource].update(spec, doc)
            except Exception as e:
                print('analysisDataSourceRemoveSingle failed')
                rt['success'] = False
        return rt

    def analysisModalSave(self, userId, data):
        rt = {}
        if isinstance(userId, int) and isinstance(data, dict):
            try:
                if self.mdbBb[g_tableWorkspace].find_one({'userId':userId}) == None:
                    if 'workspaceId' not in data.keys() and 'id' not in data['modal'].keys() and 'workspaceName' in data.keys():
                        oj_workspaceId = ObjectId()
                        oj_modalId = ObjectId()
                        if isinstance(data['modal']['option'], dict) and 'imagebin' in data['modal'].keys():
                            self.mdbBb[g_tableWorkspace].save({'userId':userId, 'workspaceList':[{'id':oj_workspaceId, 'name':str(data['workspaceName']),
                                                            'modalList':[{'id':oj_modalId, 'name':str(data['modal']['name']), 'type':str(data['modal']['type']),
                                                            'note':str(data['modal']['note']), 'imagebin':bytes(), 'option':data['modal']['option']}]}]})
                            rt = {'workspaceId':oj_workspaceId.__str__(), 'modalId':oj_modalId.__str__()}
                else:
                    if 'workspaceId' in data.keys() and 'workspaceName' in data.keys() and 'modal' not in data.keys():
                        post = {'userId':userId, 'workspaceList.id':ObjectId(str(data['workspaceId']))}
                        doc = {'$set':{'workspaceList.$.name':str(data['workspaceName'])}}
                        self.mdbBb[g_tableWorkspace].update(post, doc)
                    else:
                        post = {'userId':userId, 'workspaceList':{'$exists':False}}
                        doc = {'workspaceList':[], 'userId':userId}
                        self.mdbBb[g_tableWorkspace].update(post, doc)
                        if 'workspaceId' not in data.keys():
                            if 'workspaceName' in data.keys():
                                post = {'userId':userId}
                                oj_workspaceId = ObjectId()
                                doc = {'$addToSet':{'workspaceList':{'id':oj_workspaceId, 'name':str(data['workspaceName']), 'modalList':[]}}}
                                rt = {'workspaceId':oj_workspaceId.__str__(), 'modalId':''}
                                self.mdbBb[g_tableWorkspace].update(post, doc)
                        else:
                            post = {'userId':userId, 'workspaceList.id':ObjectId(data['workspaceId']), 'workspaceList.modalList':{'$exists':False}}
                            doc = {'$set':{'workspaceList.$.modalList':[], 'userId':userId, 'workspaceList.$.id':ObjectId(data['workspaceId'])}}
                            self.mdbBb[g_tableWorkspace].update(post, doc)
                            if 'id' not in data['modal'].keys():
                                post = {'userId':userId, 'workspaceList.id':ObjectId(str(data['workspaceId']))}
                                oj_workspaceId = ObjectId(str(data['workspaceId']))
                                oj_modalId = ObjectId()
                                if isinstance(data['modal']['option'], dict):
                                    doc = {'$addToSet':{'workspaceList.$.modalList':{'id':oj_modalId, 'name':str(data['modal']['name']),
                                        'type':str(data['modal']['type']), 'note':str(data['modal']['note']), 'imagebin':bytes(), 'option':data['modal']['option']}}}
                                    self.mdbBb[g_tableWorkspace].update(post, doc)
                                    rt = {'workspaceId':oj_workspaceId.__str__(), 'modalId':oj_modalId.__str__()}
                            else:
                                oj_workspaceId = ObjectId(str(data['workspaceId']))
                                oj_modalId = ObjectId(str(data['modal']['id']))
                                arrayModal = self.analysisModalGet(userId)
                                index = -1
                                for item in arrayModal:
                                    if data['workspaceId'] == item['id']:
                                        modalList = item['modalList']
                                        for i in range(len(modalList)):
                                            if data['modal']['id'] == modalList[i].get('id'):
                                                index = i
                                                break
                                if index >= 0:
                                    arrayIndex = 'workspaceList.$.modalList.%d' % (index)
                                    post = {'userId':userId, 'workspaceList.id':ObjectId(data['workspaceId']), 'workspaceList.modalList.id':ObjectId(str(data['modal']['id']))}
                                    if isinstance(data['modal']['option'], dict):
                                        doc = {'$set':{  '%s.%s' % (arrayIndex, 'id'):ObjectId(str(data['modal']['id'])), '%s.%s' % (arrayIndex, 'name'):str(data['modal']['name']),
                                                    '%s.%s' % (arrayIndex, 'type'):str(data['modal']['type']), '%s.%s' % (arrayIndex, 'note'):str(data['modal']['note']), '%s.%s' % (arrayIndex, 'option'):data['modal']['option']}} #'imagebin':bytes()
                                        self.mdbBb[g_tableWorkspace].update(post, doc)
                                        rt = {'workspaceId':oj_workspaceId.__str__(), 'modalId':oj_modalId.__str__()}
            except Exception as e:
                print('analysisModalSave failed')
        return rt

    def analysisModalRemove(self, userId, workspaceId, modalId):
        rt = {'success':False}
        if isinstance(userId, int) and isinstance(workspaceId, str) and isinstance(modalId, str):
            if modalId != 'undefined':
                rt = {'success':True}
                spec = {'userId':userId, 'workspaceList.id':ObjectId(workspaceId), 'workspaceList.modalList.id':ObjectId(modalId)}
                doc = {'$pull':{'workspaceList.$.modalList':{'id':ObjectId(modalId)}}}
                try:
                    self.mdbBb[g_tableWorkspace].update(spec, doc)
                except Exception as e:
                    print('analysisModalRemove failed')
                    rt['success'] = False
        return rt

    def analysisDataSourceGet(self, userId):
        rt = []
        if isinstance(userId, int):
            post = {}
            column_dic = {}
            post = {'userId':userId}
            cursor = None
            try:
                cursor = self.mdbBb[g_tableDataSource].find(post,{'userId':0})
                for item in cursor:
                    itemList = []
                    for subItem in item['list']:
                        if subItem is not None:
                            val = subItem['value']
                            strNote = ''
                            if  'note' in subItem.keys():
                                strNote = subItem['note']
                            strGroupId = ''
                            if 'groupId' in subItem.keys():
                                strGroupId = subItem['groupId']
                            itemList.append({'type': subItem['type'], 'projId':subItem['projId'], 'alias': subItem['alias'], 'id': subItem['id'].__str__(), 'value':val, 'note':strNote, 'groupId':strGroupId})
                    rt.append({'id':item['_id'].__str__(), 'list':itemList})
            except Exception as e:
                print('analysisDataSourceGet failed')
        return rt

    def analysisModalGet(self, userId, thumbPic=1):
        wsList = []
        if isinstance(userId, int):
            post = {'userId':userId}
            column_dic = {'_id':0, 'userId':0}
            try:
                cursor = self.mdbBb[g_tableWorkspace].find(post, column_dic)
                for item in cursor:
                    workspaceList = item['workspaceList']
                    for i in workspaceList:
                        wsId = i['id']
                        wsName = i['name']
                        modalList = i['modalList']
                        mdList = []
                        for j in modalList:
                            if len(j) > 0:
                                mdNote = ''
                                mdImageBin = ''
                                mdId = j.get('id')
                                mdName = j.get('name')
                                mdType = j.get('type')
                                mdOption = j.get('option')
                                if 'note' in j.keys():
                                    mdNote = j['note']
                                if 'imagebin' in j.keys():
                                    mdImageBin = j['imagebin'].decode()
                                if thumbPic == 1:
                                    mdList.append({'id':mdId.__str__(), 'name':mdName, 'type':mdType, 'option':mdOption, 'note':mdNote, 'imagebin':str(mdImageBin)})
                                else:
                                    mdList.append({'id':mdId.__str__(), 'name':mdName, 'type':mdType, 'option':mdOption, 'note':mdNote})
                        wsList.append({'id':wsId.__str__(), 'name':i['name'], 'modalList':mdList})
            except Exception as e:
                print('analysisModalGet failed')
        return wsList

    def analysisTemplateSave(self, userId, data):
        rt = {'success':True}
        if isinstance(userId, int) and isinstance(data, dict):
            re = self.analysisTemplateRemove(userId)
            if re['success']:
                templateList = data['templateList']
                post = {'userId':userId, 'list':templateList}
                try:
                    self.mdbBb[g_tableTemplate].save(post)
                except Exception as e:
                    print('analysisTemplateSave failed')
                    rt = {'success':False}
        return rt

    def analysisTemplateRemove(self, userId):
        rt = {'success':True}
        if isinstance(userId, int):
            post = {'userId':userId}
            try:
                self.mdbBb[g_tableTemplate].remove(post)
            except Exception as e:
                print('remove template record failed')
                rt = {'success':False}
        return rt

    def analysisTemplateGet(self, userId):
        rt = []
        if isinstance(userId, int):
            post = {'userId':userId}
            try:
                cursor = self.mdbBb[g_tableTemplate].find(post)
                for item in cursor:
                    for subItem in item['list']:
                        rt.append(subItem)
            except Exception as e:
                print('analysisTemplateGet failed')
        return rt

    def analysisTemplateGet(self):
        rt = []
        try:
            cursor = self.mdbBb[g_tableTemplate].find()
            for item in cursor:
                for subItem in item['list']:
                    rt.append(subItem)
                break
        except Exception as e:
            print('analysisTemplateGet failed')
        return rt

    #call by above
    def getListContentByIdAndUserId(self, id, userId):
        if isinstance(userId, int):
            rt = {}
            post = {}
            if id != None:
                post = {'_id':ObjectId(id), 'userId':userId}
            else:
                post = {'userId':userId}
            column_dic = {'list':1,'_id':0}
            try:
                rt = self.mdbBb[g_tableDataSource].find_one(post, column_dic)
            except Exception as e:
                print('getListContentByIdAndProjId failed')
            if len(rt) > 0:
                return rt['list']
        return []

    def getItemContentById(self, itemId, itemList):
        if isinstance(itemList, list):
            for item in itemList:
                if item != None:
                    objId = item.get('id')
                    if isinstance(objId, ObjectId) and isinstance(itemId, str):
                        if objId.__str__() == itemId:
                            return item
        return {}


    def getDataSourceItemInfoByName(self, dataSourceId, alias):
        if isinstance(dataSourceId, str) and isinstance(alias, str):
            rt = {}
            post = {'_id':ObjectId(dataSourceId), 'list.alias':alias}
            column_dic = {'list.$':1,'_id':0}
            try:
                rt = self.mdbBb[g_tableDataSource].find_one(post, column_dic)
            except Exception as e:
                print('getListContentByIdAndProjId failed')
            if rt != None and len(rt['list']) == 1:
                return rt['list'][0]
        return {}

    def getDataSourceItemInfoById(self, itemId):
        if isinstance(itemId, str):
            rt = {}
            if  itemId.startswith('tempvar'):
                itemId = itemId[len('tempvar'):]
            try:
                post = {'list.id':ObjectId(itemId)}
                column_dic = {'list.$':1,'_id':0}
                rt = self.mdbBb[g_tableDataSource].find_one(post, column_dic)
            except Exception as e:
                print('getListContentByIdAndProjId failed')
            if rt != None:
                if rt.get('list') != None:
                    return rt.get('list')[0]
        return {}

    def getWorkspaceLayoutByUserIdAndWorkspaceId(self, userId, workspaceId):
        modalList = []
        if isinstance(workspaceId, str):
            post = {'userId':userId, 'workspaceList.id':ObjectId(workspaceId)}
            column_dic = {'userId': 1, '_id': 0, 'workspaceList.$':1}
            try:
                rv = self.mdbBb[g_tableWorkspace].find_one(post, column_dic)
                if isinstance(rv, dict):
                    workspaceList = rv['workspaceList']
                    if len(workspaceList) == 1:
                        modalList = workspaceList[0]['modalList']
            except Exception as e:
                print('getWorkspaceLayoutByUserIdAndWorkspaceId failed')
        return modalList

    def analysisWorkspaceSaveLayout(self, userId, workspaceId, modalList):
        rt = {'success':True}
        if isinstance(userId, int) and isinstance(workspaceId, str) and isinstance(modalList, list):
            oldList = self.getWorkspaceLayoutByUserIdAndWorkspaceId(userId, workspaceId)
            newListWithOb = []
            for newitem in modalList:
                for oldItem in oldList:
                    if newitem == oldItem['id'].__str__():
                        newListWithOb.append({'id':oldItem['id'], 'type':oldItem['type'], 'name':oldItem['name'], 'option':oldItem['option'], 'note':oldItem['note'], 'imagebin':oldItem['imagebin']})
                        break
            post = {'userId':userId, 'workspaceList.id':ObjectId(workspaceId)}
            doc = {'$unset':{'workspaceList.$.modalList':1}}
            try:
                self.mdbBb[g_tableWorkspace].update(post, doc)
                rt = {'success':True}
            except Exception as e:
                print('delete modalList from workspace failed')
                rt = {'success':False}
            post = {'userId':userId, 'workspaceList.id':ObjectId(workspaceId)}
            doc = {'$set':{'workspaceList.$.modalList':newListWithOb}}
            try:
                self.mdbBb[g_tableWorkspace].update(post, doc)
                rt = {'success':True}
            except Exception as e:
                print('insert modalList into workspace failed')
                rt = {'success':False}
        return rt

    def analysisWorkspaceRemove(self, workspaceId):
        rt = {'success':True}
        if isinstance(workspaceId, str):
            post = {'workspaceList.id':ObjectId(workspaceId)}
            doc = {'$pull':{'workspaceList':{'id':ObjectId(workspaceId)}}}
            try:
                self.mdbBb[g_tableWorkspace].update(post, doc)
            except Exception as e:
                print('analysisWorkspaceRemove failed')
                rt = {'success':False}
        return rt

    def getAliasById(self, id):
        rt = ''
        if isinstance(id, str):
            post = {'list.id':ObjectId(id)}
            column_dic = {'list.$':1,'_id':0}
            try:
                rv = self.mdbBb[g_tableDataSource].find_one(post, column_dic)
                if rv != None:
                    recordList = rv.get('list')
                    if len(recordList) == 1:
                        rt = recordList[0].get('alias')
            except Exception as e:
                print('getAliasById failed')
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
        result = 'failed'
        if len(pointName) > 0 and isinstance(pointTime, datetime):
            if dbNameMongo in self.getAllCollections():
                try:
                    rt = self.mdbBb[dbNameMongo].find_one({'time':pointTime, 'pointname':pointName})
                    if rt == None:
                        if isinstance(self.mdbBb[dbNameMongo].save({'time':pointTime, 'pointname':pointName, 'value':pointValue}), ObjectId):
                            result = 'insert'
                    else:
                        self.mdbBb[dbNameMongo].update({'time':pointTime, 'pointname':pointName},{'$set':{'time':pointTime, 'pointname':pointName, 'value':pointValue}})
                        result = 'update'
                except Exception as e:
                    result = 'failed'
        return result

    def deleteModalByAssociateDatasource(self, userId, dataSourceItemId):
        result = True
        deleteModal = []
        if isinstance(dataSourceItemId, str):
            userId = int(userId)
            wsList = self.analysisModalGet(userId)
            try:
                for ws in wsList:
                    wsid = ws.get('id')
                    mdList = ws.get('modalList')
                    for md in mdList:
                        mdid = md.get('id')
                        op = md.get('option')
                        dsList = op.get('itemDS')
                        if dsList != None:
                            if len(dsList) == 1:
                                arrId = dsList[0].get('arrId')
                                if arrId != None:
                                    if len(arrId) == 1:
                                        if arrId[0] == dataSourceItemId:
                                            rt = self.analysisModalRemove(userId, wsid, mdid)
                                            if not rt.get('success'):
                                                result = False
                                            else:
                                                deleteModal.append(mdid)
            except Exception as e:
                print(e.__str__())
                result = False
        return result, deleteModal

    def saveDataSourceGroup(self, userId, groupName, groupId, parentId):
        result = {'error':'successful'}
        if isinstance(userId, int) and isinstance(groupName, str) and isinstance(parentId, str):
            IdObject = None
            if groupId == None or groupId == '':
                IdObject = ObjectId()
            else:
                if ObjectId.is_valid(groupId):
                    IdObject = ObjectId(groupId)
            if parentId != '':
                if ObjectId.is_valid(parentId):
                    post = {'_id':IdObject, 'userId':userId, 'groupName':groupName, 'parentId':parentId}
                else:
                    result = {'error':'parentId is not valid'}
                    return result
            else:
                post = {'_id':IdObject, 'userId':userId, 'groupName':groupName, 'parentId':parentId}
            try:
                rt = self.mdbBb[g_tableDataSourceGroup].save(post)
                if isinstance(rt, ObjectId):
                    result['groupId'] = rt.__str__()
                    result['groupName'] = groupName
                    result['parentId'] = parentId
            except Exception as e:
                result = {'error':e.__str__()}
        return result

    def deleteDataSourceGroup(self, userId, groupId):
        result = {'error':'successful'}
        if isinstance(userId , int):
            post = {}
            if ObjectId.is_valid(groupId):
                post = {'_id':ObjectId(groupId), 'userId':userId}
                try:
                    self.mdbBb[g_tableDataSourceGroup].remove(post)
                except Exception as e:
                    result = {'error':e.__str__()}
        return result

    def saveDataSourceGroupLayout(self, userId, newGroupIdList):
        result = {'error':'successful'}
        if isinstance(userId, int) and isinstance(newGroupIdList, list):
            try:
                oldGroupList = self.getDataSourceGroupInfo(userId)
                if self.deleteDataSourceGroupByUserId(userId):
                    for newGroupId in newGroupIdList:
                        for oldGroupInfo in oldGroupList:
                            groupId = oldGroupInfo.get('groupId')
                            if len(groupId) > 0:
                                if groupId == newGroupId:
                                    groupName = oldGroupInfo.get('groupName')
                                    parentId = oldGroupInfo.get('parentId')
                                    self.mdbBb[g_tableDataSourceGroup].save({'_id':ObjectId(newGroupId), 'userId':userId, 'groupName':groupName, 'parentId':parentId})
                                    break
            except Exception as e:
                result = {'error':'failed'}
        return result

    def getDataSourceGroupInfo(self, userId):
        rt = []
        if isinstance(userId, int):
            post = {'userId':userId}
            try:
                cursor = self.mdbBb[g_tableDataSourceGroup].find(post, {'userId':0})
                for item in cursor:
                    groupId = ''
                    objGroupId = item.get('_id')
                    if isinstance(objGroupId, ObjectId):
                        groupId = objGroupId.__str__()
                    if ObjectId.is_valid(groupId):
                        groupName = item.get('groupName')
                        parentId = item.get('parentId')
                        assert(parentId == '' or ObjectId.is_valid(parentId))
                        rt.append({'groupId':groupId, 'groupName':groupName, 'parentId':parentId})
            except Exception as e:
                print(e.__str__())
        return rt

    def analysisDataSourceGetByIdList(self, dsList):
        rt = []
        if isinstance(dsList, list):
            itemList = []
            cursor = None
            try:
                cursor = self.mdbBb[g_tableDataSource].find({}, {'_id':0, 'userId':0})
                for item in cursor:
                    for subItem in item['list']:
                        if subItem is not None:
                            val = subItem['value']
                            strNote = ''
                            if  'note' in subItem.keys():
                                strNote = subItem['note']
                            strGroupId = ''
                            if 'groupId' in subItem.keys():
                                strGroupId = subItem['groupId']
                            itemList.append({'type': subItem['type'], 'projId':subItem['projId'], 'alias': subItem['alias'], 'id': subItem['id'].__str__(), 'value':val, 'note':strNote, 'groupId':strGroupId})
                for dsId in dsList:
                    for item in itemList:
                        if dsId == item.get('id'):
                            rt.append(item)
                            break
            except Exception as e:
                print(e.__str__())
        return rt

    def deleteDataSourceGroupByUserId(self, userId):
        userId = int(userId)

        rt = True
        post = {'userId':userId}
        try:
            self.mdbBb[g_tableDataSourceGroup].remove(post)
        except Exception as e:
            rt = False
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

    def renameCollection(self):
        collectionList = self.getAllCollections()
        for name in collectionList:
            if name.startswith('M1_'):
                newName = name.replace('M1_','month_')
                try:
                    self.mdbBb[name].rename(newName)
                except Exception as e:
                    print('rename %s error' % (name,))
                    return False
        return True

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

    def analysisModalSaveThumb(self, userId, data):
        rt = {'error':False}
        if isinstance(userId, int) and isinstance(data, dict):
            try:
                arrayModal = self.analysisModalGet(userId)
                for item in arrayModal:
                    if data['workspaceId'] == item['id']:
                        modalList = item['modalList']
                        for i in range(len(modalList)):
                            if data['modalId'] == modalList[i].get('id'):
                                arrayIndex = 'workspaceList.$.modalList.%d' % (i)
                                post = {'userId':userId, 'workspaceList.id':ObjectId(data['workspaceId']), 'workspaceList.modalList.id':ObjectId(str(data['modalId']))}
                                doc = {'$set':{arrayIndex:{'id':ObjectId(str(modalList[i].get('id'))), 'name':str(modalList[i].get('name')),
                                                       'type':str(modalList[i].get('type')), 'note':str(modalList[i].get('note')), 'option':modalList[i].get('option'),'imagebin':bytes(data['imagebin'].encode())}}}
                                self.mdbBb[g_tableWorkspace].update(post, doc)
                                break
            except Exception as e:
                print('analysisModalSaveThumb failed')
                rt = {'error':True}
        return rt