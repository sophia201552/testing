import re
import logging
from bson.objectid import ObjectId
from beopWeb.BEOPMongoDataAccess import g_tableModbusSource
from beopWeb.MongoConnManager import MongoConnManager
from beopWeb.mod_common.Utils import Utils
from datetime import datetime

class modbuspointtable():
    def __init__(self, project_id=None):
        self.db = MongoConnManager.getConfigConn().mdbBb[g_tableModbusSource]
        self.project_id = int(project_id) if project_id else None

    # 将点表导入数据库
    def importPointToMongoDB(self, dict_list, source_type = None):
        if not source_type:
            source_type = 5
        dtuId = dict_list[0].get('dtuId')
        existed_points_map = self.getPointMap(dtuId,source_type)  # 找到已经存在的点表
        update_list = []
        insert_list = []
        try:
            for data_item in dict_list:
                if not data_item.get('pointName'):
                    continue
                self.handleProjectId(data_item)
                data_item['pointName'] = self.replaceInvalidCharsInpointName(data_item.get('pointName'))
                if existed_points_map.get(data_item.get('pointName')):
                    existed_point = existed_points_map.get(data_item.get('pointName'))
                    existed_point_params = existed_point.get('params')
                    data_item_params = data_item.get('params')
                    existed_point_params.update(data_item_params)
                    existed_point.update(data_item)
                    existed_point['params'] = existed_point_params
                    update_list.append(existed_point)
                else:
                    insert_list.append(data_item)
                    existed_points_map[data_item.get('pointName')] = data_item
            if update_list:
                self.update_many(update_list)
                logging.info('Modbus点表更新:' + str(update_list))
            if insert_list:
                self.db.insert_many(insert_list)
                logging.info('Modbus点表新增:' + str(insert_list))
            return True
        except Exception as e:
            print('Modbus点表更新错误,项目:' + str(self.project_id) + ' ' + str(e))
            logging.error('Modbus点表更新错误,项目:' + str(self.project_id) + ' ' + str(e))
            return False

    # 获取点的映射
    def getPointMap(self,dtuId,source_type=None):
        query = {'projId': self.project_id,'dtuId':dtuId}
        if source_type:
            query['type'] = source_type
        cursor = self.db.find(query, projection={'dtuId': False, 'type': False})
        return {item.get('pointName'): item for item in cursor}

    # 将projId转为int类型
    def handleProjectId(self, point):
        if point and point.get('projId') and not isinstance(point.get('projId'), int):
            point['projId'] = int(point.get('projId'))

    # 将不合法pointName改写：
    def replaceInvalidCharsInpointName(self, point_name):
        if not point_name:
            return None
        point_name = point_name.strip()
        if Utils.CLOUD_POINT_NAME_START_WITH_NUM.match(point_name):
            point_name = Utils.CLOUD_POINT_NAME_NUMBER_PREFIX + point_name
        # 将不合法字符进行替换
        handled_name = re.sub(Utils.CLOUD_POINT_NAME_NOT_VALID_CHAR, Utils.CLOUD_POINT_NAME_REFILL, point_name)
        # 处理多个不合法字符被转化时候连续出现过多的下划线
        more_pattern = re.compile(Utils.CLOUD_POINT_NAME_REFILL + '{2,}')
        return re.sub(more_pattern, Utils.CLOUD_POINT_NAME_REFILL, handled_name)

    # 获取dtuid对应的数据
    def getDtuDataByDtuId(self, dtuId):
        dtuId = dtuId if isinstance(dtuId, str) else str(dtuId)
        try:
            query = {"dtuId": dtuId}
            cursor = self.db.find(query, projection={'dtuId': False, 'modify_tiem': False, 'modfiy_by': False})  # 查找
            total = cursor.count()
            if total > 0:
                return cursor
        except Exception as e:
            print(e.__str__())
            return None

    #导出DTU点表数据
    def exportDtuPointTableByDtuId(self,dtuId):
        dtuId = dtuId if isinstance(dtuId, str) else str(dtuId)
        query = {"dtuId": dtuId}
        cursor = self.db.find(query, projection={'dtuId': False,})  # 查找
        total = cursor.count()
        if total > 0:
            datalsit = []
            try:
                for item in cursor:
                    if item:
                        data = {}
                        data['projId'] = item.get('projId')
                        data['pointName'] = item.get('pointName')
                        data['create_by'] = item.get('create_by')
                        data['create_time'] = item.get('create_time')
                        data['modfiy_by'] = item.get('modfiy_by')
                        data['modify_tiem'] = item.get('modify_tiem')
                        data['type'] = item.get('type')
                        data['params'] = item.get('params')
                        datalsit.append(data)
                return datalsit
            except Exception as e:
                return None

    #导入数据到目标dtu中去
    def importDtuPointTableByDtuId(self,datalist,dtuId):
        dtuId = dtuId if isinstance(dtuId, str) else str(dtuId)
        updateList = []
        try:
            for item in datalist:
                if item:
                    data = {}
                    data['dtuId'] = dtuId
                    data['projId'] = item.get('projId')
                    data['pointName'] = item.get('pointName')
                    data['create_by'] = item.get('create_by')
                    data['create_time'] = item.get('create_time')
                    data['modfiy_by'] = item.get('modfiy_by')
                    data['modify_tiem'] = item.get('modify_tiem')
                    data['type'] = item.get('type')
                    data['params'] = item.get('params')
                    updateList.append(data)
            flag,msg = self.deleteAllPoint(dtuId)
            if flag:
                self.db.insert_many(updateList)
            return self.checkEmptyDtuByDtuId(dtuId)
        except Exception as e:
            return False

    #将目标dtu拷贝的空dtu中
    def copyDataToImportDtu(self,targetDtu,dtuId):
        dtuId = dtuId if isinstance(dtuId, str) else str(dtuId)
        msg = ''
        success = True
        try:
            rvdata = self.exportDtuPointTableByDtuId(dtuId)
            if rvdata:
                for item in rvdata:
                    item['dtuId'] = targetDtu
            self.db.insert_many(rvdata)
            cur = self.db.find({'dtuId':targetDtu})
            total = cur.count()
            if total > 0:
                return success, msg
            success = False
            msg = 'target dtu no data'
            return success ,msg
        except Exception as e:
            success = False
            msg = str(e)
            return success ,msg

    #更新多条同一dtu下的点表
    def update_many(self, data_list):
        try:
            for item in data_list:
                item['_id'] = ObjectId(item.get('_id'))
                self.handleProjectId(item)
                self.db.update_one({'_id': item.get('_id')}, {'$set': item}, upsert=True)
            return True
        except Exception as e:
            logging.error('point table auto save error' + str(e))
            return False

    #插入新点到数据库中
    def insertNewPointToMongoDB(self,data):
        if data:
            self.handleProjectId(data)
            self.db.insert(data)
            if self.checkExistPointNameInDtu(data.get('dtuId'),data.get('pointName')):
                msg = ''
                success  = True
                return success ,msg
            msg = 'insert point data Failed'
            success = False
            return success, msg
        return False ,'no data'

    #根据名字中含有的关键字来查找dtu点,并且按时间先后顺序得到curse
    def queryPointBySarchText(self,searchText,projId,dtuId,perfix):
        dtuId = dtuId if isinstance(dtuId, str) else str(dtuId)
        projId = projId if isinstance(projId,int) else int(projId)
        datalist = []
        try:
            if searchText:
                query = {'projId':projId,'dtuId':dtuId,'pointName': {'$regex': searchText, '$options': 'i'}}
            else:
                query = {'projId':projId,'dtuId':dtuId}

            rank = [('modify_time', -1)]
            cur = self.db.find(query).sort(rank)
            for item in cur:
                data = {}
                params = item.get('params')
                data['pointName'] = perfix +'_' +item.get('pointName')
                data['dataLength'] = params.get('dataLength')
                data['dataType'] = params.get('dataType')
                data['functionCode'] = params.get('functionCode')
                data['pointType'] = params.get('pointType')
                data['address'] = params.get('address')
                data['note'] = params.get('note')
                data['refreshCycle'] = params.get('refreshCycle')
                data['slaveId'] = params.get('slaveId')
                data['multiple'] = params.get('multiple')
                data['pointId'] = str(item.get('_id'))
                datalist.append(data)
            return datalist
        except Exception as e:
            print(e.__str__())
            return None

    #获取页面显示数据
    def getDtuDataPage(self,datalist,pageSize,pageNum):
        pageSize = pageSize if isinstance(pageSize,int) else int(pageSize)
        pageNum = pageNum if isinstance(pageNum,int) else int(pageNum)
        data = {}
        if datalist:
            total = len(datalist)
            pagetotal = total // pageSize
            if total % int(pageSize) > 0:
                pagetotal += 1
            if pageNum > pagetotal:
                dtulist = []
            elif pageNum == pagetotal:
                start = (pageNum - 1) * pageSize
                dtulist = datalist[start:]
            else:
                start = (pageNum - 1) * pageSize
                end = pageNum * pageSize
                dtulist = datalist[start:end]
            data['list'] = dtulist
            data['total'] = total
            return data

    #检测数据库是否为空
    def  checkEmptyDtuByDtuId(self,dtuId):
        dtuId = dtuId if isinstance(dtuId,str) else str(dtuId)
        query = {'dtuId':dtuId}
        cur = self.db.find(query)
        if cur.count() > 0:
            return True
        return False

    #检测dtu设备下是否已经存在点名
    def checkExistPointNameInDtu(self,dtuId,pointName):
        dtuId = dtuId if isinstance(dtuId, str) else str(dtuId)
        pointName = pointName if isinstance(pointName, str) else str(pointName)
        query = {'pointName': pointName, 'dtuId': dtuId}
        cur = self.db.find(query)
        if cur.count() > 0:
            return True
        return False

    #根据点ID删除集合。
    def deletePointById(self,dtuId,pointId_list):
        dtuId = dtuId if isinstance(dtuId, str) else str(dtuId)
        try:
            objectId_list = [ObjectId(item) for item in pointId_list]
            query = {'dtuId':dtuId,'_id': {'$in': objectId_list}}
            self.db.delete_many(query)
            if self.db.find(query).count() > 0:
                return False ,'delete point failed'
            return True, ''
        except Exception as e:
            msg = str(e)
            return False,msg

    #删除dtu下的所有点
    def deleteAllPoint(self,dtuId):
        dtuId = dtuId if isinstance(dtuId, str) else str(dtuId)
        try:
            query = {'dtuId':dtuId}
            self.db.delete_many(query)
            if self.db.find(query).count() > 0:
                return False, 'delete all point failed'
            return True, ''
        except Exception as e:
            msg = str(e)
            return False, msg


