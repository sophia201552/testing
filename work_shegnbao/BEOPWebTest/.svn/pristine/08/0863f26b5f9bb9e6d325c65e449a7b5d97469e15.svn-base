from beopWeb import app
from beopWeb.BEOPDataAccess import *

from flask import request,json, jsonify, make_response
from beopWeb.BEOPDataAccess import *

from beopWeb.mod_temperature import bp_temp
from beopWeb.MongoConnManager import *
from beopWeb.AuthManager import AuthManager
from datetime import datetime
import logging, requests
from bson.objectid import ObjectId
from flask_cors import cross_origin
from beopWeb.BEOPDataBufferManager import BEOPDataBufferManager
from beopWeb.observer import getOneItemDataPointName

#根据地图定位，设定该位置相关参数
#PostData: {
#   'gps': [100, 100, 0],   #'x, y, z' z默认为0
#   'userId': 72,           #用户

#20160323
#   'prefix': '1103_FCU001_',           #前缀
#   'projectId': '',
#   'attrs': {   #个数随机，请用prefix+attr.key拼起标准点名，例1103_FCU001_FCUOnOffSet，调用/set_to_site_by_projname接口
#       'FCUOnOffSet': 0,
#       'FCUValvePositionDSet': 33,
#       ...
#   }

#   'controllerId': ''  controllerId ObjectId  #临时字段
#   'roomId':''	     roomId ObjectId  #临时字段
#   'spaceId':''	spaceId ObjectId #临时字段
#}
@bp_temp.route('/temp/set',methods = ['POST'])
def setTemperature():
    #step1: 调用左工接口，取得需要控制的Controllers及其设定值
    #TODO: 暂时跳过第一步，前端直接写controllers数值


    #step2: 调用'/setControllers'接口，设定相关controller

#    rt = 'success'
#    try:
#        data = request.get_json()
#        if data:
#            projId = int(data.get('projectId', 0))
#            nameList, valueList = MongoConnManager.getConfigConn().appTempSetController(data)
#            if (not nameList) or (not valueList):
#                raise Exception('nameList or valueList is []')
#            rv = BEOPDataBufferManager.getInstance().setMutilDataToSiteById(projId, nameList, valueList)
#            if 'error' in rv:
#                rt = 'failed'
#            else:
#                #step3: 向AppTemp_History_Operation表中写入一条记录
#                rt = MongoConnManager.getConfigConn().appTempInsertIntoHistoryOperation(data, nameList, valueList)
    rt = None
    try:
        data = request.get_json()
        roomId = data.get('roomId')
        headers = {'content-type': 'application/json'}
        url = app.config.get('TEMPERATURE_APP_SERVICE_ADDRESS') + '/appTemp/location/setInfo/' + str(roomId)
        res = requests.post(url = url, headers = headers, data=json.dumps(data))
        rt = json.loads(res.text)
    except Exception as e:
        print('setController failed: ' + e.__str__())
        logging.error('setController failed: ' + e.__str__())
    return json.dumps(rt, ensure_ascii=False)

@bp_temp.route('/insertHistoryOperation',methods = ['POST'])
def insert_history_operation():
#    {
#        'gps':[],
#        'time':''
#        'userId':0,
#        'roomId':'',
#        'spaceId':'',
#        'source':0,    #  0:设置控制器,  1:算法控制,  2:保存日程表,  3:切换模式,  4:用户某点设定温度
#        'option':{}
#        'controlerParams'[]
#    }
    rt = False
    try:
        data = request.get_json()
        #nameList, valueList = MongoConnManager.getConfigConn().appTempSetController(data)
        rt = MongoConnManager.getConfigConn().appTempInsertIntoHistoryOperation(data)
    except Exception as e:
        print('insert_history_operation error:' + e.__str__())
        logging.error('insert_history_operation error:' + e.__str__())
    return jsonify(data=rt)

#设置某几个controller的参数

#==原
#PostData: [{
#   '_id': ''               #controllerId
#   'temp': 33,             #温度，可能不传
#   'speed': 33,            #风速，可能不传
#   'switch': 1,            #启停，可能不传
#   'sp': 1,                #季节模式，可能不传
#   'valueP': 33,           #阀位，可能不传
#   'autp': 1,              #手自动，可能不传
#}]

#20160323改
#[{
#    '_id': '',               #controllerId
#    'prefix': '1103_FCU001_',           #前缀
#    'projectId': '',
#    'attrs': {   #个数随机，请用prefix+attr.key拼起标准点名，例1103_FCU001_FCUOnOffSet，调用/set_to_site_by_projname接口
#        'FCUOnOffSet': 0,
#        'FCUValvePositionDSet': 33,
#        ...
#    }
#}]


@bp_temp.route('/setControllers', methods=['POST'])
def setControllers():
    rt = 'success'
    try:
        data = request.get_json()
        if data:
            for item in data:
                projId = int(item.get('projectId', 0))
                nameList, valueList = MongoConnManager.getConfigConn().appTempSetController(item)
                if (not nameList) or (not valueList):
                    raise Exception('nameList or valueList is []')
                rv = BEOPDataBufferManager.getInstance().setMutilDataToSiteById(projId, nameList, valueList)
                if 'error' in rv:
                    rt = 'failed'
        else:
            rt = 'failed'
    except Exception as e:
        print('setController failed: ' + e.__str__())
        logging.error('setController failed: ' + e.__str__())
    return jsonify(data = rt)



#点击地图后，根据坐标获取 周围最近5个编辑者信息 + 当前点温度
#PostData: {
#   'gps': [100, 100, 0],   #'x, y, z' z默认为0 暂时不用
#   'sapceId'/'roomId':ObjectId(XXXXXXX)
#}
#retrun: {
#   'temp': 24.5,暂时不返回
#   'list': [{
#       'userId': 1,
#       'name': '三胖',
#       'temp': 23.4,                温度设定值
#       'urlImg': 'xxx/xxx/123.jpg'  用户头像
#       'gps': [10,10,0]             用户所在位置
#   }]
#}
@bp_temp.route('/location/getInfo/<roomId>', methods=['POST'])
def getLocationInfo(roomId):
    rt = []
    temp = None
    sensorId = None
    try:
        data = request.get_json()
        if data:
            arrTempOption = MongoConnManager.getConfigConn().getLocationInfoUsers(data)
            arrUserId = []
            for tempOption in arrTempOption:
                arrUserId.append(tempOption.get('userId'))

            if arrUserId:
                userInfoList = BEOPDataAccess.getInstance().getUsersInfoForAppTemp(arrUserId)
                
            for item in arrTempOption:    
                for user in userInfoList:
                    if(item.get('userId') == user[0]):
                        rt.append({
                            'userId': user[0], 
                            'name': user[1], 
                            'urlImg': user[2],
                            'gps': item.get('gps'), 
                            'time': item.get('time'), 
                            'temp': item.get('option', {}).get('temp')
                        })

            pd = json.dumps({'gps':data.get('gps'), 'userId':data.get('userId')})
            url = app.config.get('TEMPERATURE_APP_SERVICE_ADDRESS') + '/appTemp/location/getInfo/' + str(roomId)
            headers = {'content-type': 'application/json'}
            res = requests.post(url=url, headers=headers, data=pd)
            temp = json.loads(res.text).get('temp')
            sensorId = json.loads(res.text).get('sensorId')
    except Exception as e:
        print('getLocationInfo failed: ' + e.__str__())
        logging.error('getLocationInfo failed: ' + e.__str__())
    return jsonify(list=rt, temp=temp, sensorId=sensorId)


#获取该用户可以查看的房间列表
#从APPTemp_UserRoom中取出用户对应的roomId列表，再根据列表从IOT_Group表中取出rooms
#roomList = [{
#    '_id': "56d93948fa172311e0a5810b",
#    '_idProj': "aaaaaaaaabaaf32fbc300001",
#    'arrP': {},
#    'name': "空间2",
#    'pId': "ddddddddddddf32fbc300001",
#    'prefix': "ee",
#    'projId': 1,
#    'type': "GroupRoom",
#    'weight': 0,
#    'params': {
#        'gatewayId': '',
#        'map': {
#            'width': 1000,	    #长
#            'height': 1000,	    #宽
#            'scale': 1000,	    #比例尺 1:1000
#            'orientation': '',	#方向（偏转角度）
#            'gps': [100,100,100],	        #GPS
#            'img': '',	        #地图图片,可URL可二进制
#        }
#    }
#}]
@bp_temp.route('/room/getlist/all', methods=['GET'])
@bp_temp.route('/room/getlist/<userId>', methods=['GET'])
def getRoomList(userId = None):
    roomList = []
    rooms  = MongoConnManager.getConfigConn().appTempGetRoomsFromUserRoom(userId)
    if rooms:
        roomList = MongoConnManager.getConfigConn().appTempGetRoomListFromIOTGroup(rooms, userId)
    return jsonify({'roomList': roomList})


#获取房间具体信息
#return: {
#    'space': [{
#        '_id': "56d93948fa172311e0a5111b",
#        '_idProj': "aaaaaaaaabaaf32fbc300001",
#        'arrP': {},
#        'name': "空间1",
#        'pId': "ddddddddddddf32fbc300001",      #roomId
#        'prefix': "space1",
#        'projId': 1,
#        'type': "GroupSpace",
#        'weight': 0,
#        'params': {
#            'arrWallIds': '56d93948fa17232220a5111b',	#墙ID	Array
#            'path': [],	        #边框	Object
#            'x': 100,	        #x	
#            'y': 100,	        #y	
#            'width': 500,	    #长	    temp 以后用path代替
#            'height': 500,	    #宽		temp 以后用path代替
#        }
#    }],
#    'sensor': [{
#        '_id': "ccccccccccccf32fbc300005",
#        'arrP': ["ChPower06_svr", "ChOnOff", "ChAMPS06"],
#        'name': "传感器2",
#        'pId': ["56d93948fa172311e0a5111b"], #spaceId
#        'path': "",
#        'prefix': "",
#        'projId': 1,
#        'type': "SensorTemp",
#        'params': {
#            'gatewayId': '',	#网关ID
#            'endpoint': 0,	    #传感类型
#            'cId': 'ccccccccccccf32fbc300005',	        #对应controllerId
#            'gps': [150, 150],	        #坐标
#            'mac': '',	        #MAC
#            'address': '',	    #networkAddress
#        }
#    }],
#    'controller': [{
#        '_id': "ccccccccccccf32fbc300005",
#        'arrP': ["ChPower06_svr", "ChOnOff", "ChAMPS06"],
#        'name': "传感器1",
#        'pId': ["56d93948fa172311e0a5810b"], #roomId
#        'path': "",
#        'prefix': "",
#        'projId': 1,
#        'type': "ControllerFCU",
#        'params': {
#            'gatewayId': '', 	#网关ID
#            'type': 0, 	    #1：路由 0：控制器
#            'gps': [200, 200], 	        #坐标
#            'mac': '', 	        #MAC
#            'address': '', 	    #networkAddress
#        }
#    }]
#}
#逻辑变动，改为从IOT系列表中获取数据。
#返回结果参照IOT标准格式，但多出option，作为其他属性容器
@bp_temp.route('/room/getDetail/<roomId>',methods=['GET'])
def getRoomDetail(roomId):
    rv = {
        'space': [{  #iot_group
            '_id': "56e92eccae440b170c754d1a",    #space_id
            '_idProj': "aaaaaaaaabaaf32fbc300001",
            'arrP': {},
            'name': "空间1",
            '_idPrt': "ddddddddddddf32fbc300001",      #roomId
            'prefix': "space1",
            'projId': 1,
            'type': "GroupSpace",
            'weight': 0,
            'params': {
                'arrWallIds': '56d93948fa17232220a5111b',	#墙ID	Array
                'path': [],	        #边框	Object
                'x': 100,	        #x	
                'y': 100,	        #y	
                'width': 500,	    #长	    temp 以后用path代替
                'height': 500,	    #宽		temp 以后用path代替
            }
        }],
        'sensor': [{      #iot_thing
            '_id': "ccccccccccccf32fbc300005",
            'arrP': ["ChPower06_svr", "ChOnOff", "ChAMPS06"],
            'name': "传感器2",
            'pId': ["56e92eccae440b170c754d1a"], #spaceId
            'path': "",
            'prefix': "",
            'projId': 1,
            'type': "SensorTemp",
            'params': {
                'gatewayId': '',	#网关ID
                'endpoint': 0,	    #传感类型
                'cId': 'ccccccccccccf32fbc300005',	        #对应controllerId
                'gps': [150, 150],	        #坐标
                'mac': '',	        #MAC
                'address': '',	    #networkAddress
            }
        }],
        'controller': [{    #iot_thing
            '_id': "ccccccccccccf32fbc300005",
            'arrP': ["ChPower06_svr", "ChOnOff", "ChAMPS06"],
            'name': "传感器1",
            'pId': ["ddddddddddddf32fbc300001"], #roomId
            'path': "",
            'prefix': "",
            'projId': 1,
            'type': "ControllerFCU",
            'params': {
                'gatewayId': '', 	#网关ID
                'type': 0, 	    #1：路由 0：控制器
                'gps': [200, 200], 	        #坐标
                'mac': '', 	        #MAC
                'address': '', 	    #networkAddress
            }
        }]
    }
    rt = {}
    try:
        rt = MongoConnManager.getConfigConn().app_temp_get_room_detail(roomId)
    except Exception as e:
        print('getRoomDetail error:' + e.__str__())
        logging.error('getRoomDetail error:' + e.__str__())
    return jsonify(data = rt)


#@bp_temp.route('/get_realtime_value',methods=['POST'])
#def getRealTemperature():
#    data = request.get_json()
#    sensorIds = data.get('sensors', [])
#    controllerIds = data.get('controllers', [])
#    # sensorIds = ['5604ec3a2e472556b4fff382']
#    # controllerIds = ['5604ec9a2e472556b4fff386']
#    rv = BEOPDataAccess.getInstance().appTempGetRealtimeVal(sensorIds, controllerIds)
#    return json.dumps(rv, ensure_ascii=False)


## 新增一个 building 信息
## 示例数据：
## data = {
##     'id': ObjectId(),
##     'name': '展想广场',
##     'address': '展想广场1号楼',
##     'principal': '张三',
##     'gps': '0,0'
## }
## 成功返回：{'status': 'OK'}
## 失败返回：{'status': 'ERROR', 'msg': '失败信息'}
#@bp_temp.route('/createBuilding',methods=['POST'])
#def createBuilding():
#    data = request.get_json()
#    rv = MongoConnManager.getConfigConn().appTempCreateBuilding(data)
#    return json.dumps(rv, ensure_ascii=False)


## 新增room
## 示例数据：
## data = [{
##     'id': '561df903039e403ca22a4150',
##     'name': '1103',
##     'floor': '11',
##     'gatewayId': '666',
##     'buildingId': '56177022039e404d7f2f91d7',
##     'map': {
##         'img': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB3aWR0aD0nNicgaGVpZ2h0PSc2Jz4KICA8bGluZSB4MT0nMTAlJyB5MT0nMTAlJyB4Mj0nOTAlJyB5Mj0nOTAlJyBzdHJva2Utd2lkdGg9JzEnIHN0cm9rZT0nI2U4ZThlOCcvPgogIDxsaW5lIHgxPSc5MCUnIHkxPScxMCUnIHgyPScxMCUnIHkyPSc5MCUnIHN0cm9rZS13aWR0aD0nMScgc3Ryb2tlPScjZThmMGZmJy8+ICAKPC9zdmc+',
##         'width': 1920,
##         'height': 1080,
##         'x': 0,
##         'y': 0,
##         'scale': 1,
##         'orientation': 0
##     }
## }]
## 成功返回：{'status': 'OK'}
## 失败返回：{'status': 'ERROR', 'msg': '失败信息'}
#@bp_temp.route('/saveRoom',methods=['POST'])
#def saveRoom():
#    data = request.get_json()
#    rv = MongoConnManager.getConfigConn().appTempSaveRoom(data)
#    return json.dumps(rv, ensure_ascii=False)


## 新增封闭空间
## 示例数据：
## data = [{
##     'id': '446eaa4a0011444730041600',
##     'name': '封闭空间3',
##     'path': [],
##     'width': 1920,
##     'height': 1080,
##     'x': 0,
##     'y': 0,
##     'roomId': '561786d8039e4037947115a1',
##     'wallIds': [],
##     'sensorIds': [],
##     'controllerIds': []
## }]
## 成功返回：{'status': 'OK'}
## 失败返回：{'status': 'ERROR', 'msg': '失败信息'}
#@bp_temp.route('/saveSpace',methods=['POST'])
#def saveSpace():
#    data = request.get_json()
#    rv = MongoConnManager.getConfigConn().appTempSaveSpace(data)
#    return json.dumps(rv, ensure_ascii=False)


## 新增sensor
## 示例数据：
## data = {
##     'id': '561787e3039e4019d87b0400',
##     'name': '2号传感器',
##     'x': 100,
##     'y': 100,
##     'spaceId': '5617879f039e401054b3a465',
##     'mac': '10-C3-7B-4B-AA-B0',
##     'network': 'CMCC'
## }
## 成功返回：{'status': 'OK'}
## 失败返回：{'status': 'ERROR', 'msg': '失败信息'}
#@bp_temp.route('/saveSensor',methods=['POST'])
#def saveSensor():
#    data = request.get_json()
    
#    rv = MongoConnManager.getConfigConn().appTempSaveSensor(data)
#    return json.dumps(rv, ensure_ascii=False)


## 新增controller
## 示例数据：
## data = {
##     'id': '56178841039e4019a0c12401',
##     'name': '2号控制器',
##     'x': 0,
##     'y': 0,
##     'spaceId': '5617879f039e401054b3a465',
##     'mac': '10-C3-7B-4B-AA-B0',
##     'network': 'CMCC',
##     'isLocal': 1
## }
## 成功返回：{'status': 'OK'}
## 失败返回：{'status': 'ERROR', 'msg': '失败信息'}
#@bp_temp.route('/saveController',methods=['POST'])
#def saveController():
#    data = request.get_json()
#    rv = MongoConnManager.getConfigConn().appTempSaveController(data)
#    return json.dumps(rv, ensure_ascii=False)


## 批量保存接口，新增一个完整的 room 信息，包括 spaces、controllers、sensors
## 示例数据：
## data = {
##     'room': {
##         'id': '561df903039e403ca22a4150',
##         'name': '1103',
##         'floor': '11',
##         'gatewayId': '666',
##         'buildingId': '56177022039e404d7f2f91d7',
##         'map': {
##             'img': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB3aWR0aD0nNicgaGVpZ2h0PSc2Jz4KICA8bGluZSB4MT0nMTAlJyB5MT0nMTAlJyB4Mj0nOTAlJyB5Mj0nOTAlJyBzdHJva2Utd2lkdGg9JzEnIHN0cm9rZT0nI2U4ZThlOCcvPgogIDxsaW5lIHgxPSc5MCUnIHkxPScxMCUnIHgyPScxMCUnIHkyPSc5MCUnIHN0cm9rZS13aWR0aD0nMScgc3Ryb2tlPScjZThmMGZmJy8+ICAKPC9zdmc+',
##             'width': 1920,
##             'height': 1080,
##             'x': 0,
##             'y': 0,
##             'scale': 1,
##             'orientation': 0
##         }
##     },
##     'spaces': [{
##         'id': '446eaa4a0011444730041600',
##         'name': '封闭空间3',
##         'path': [],
##         'width': 1920,
##         'height': 1080,
##         'x': 0,
##         'y': 0,
##         'roomId': '561786d8039e4037947115a1',
##         'wallIds': [],
##         'sensorIds': [],
##         'controllerIds': []
##     }],
##     'controllers': [{
##         'id': '56178841039e4019a0c12401',
##         'name': '2号控制器',
##         'x': 0,
##         'y': 0,
##         'spaceId': '446eaa4a0011444730041600',
##         'mac': '10-C3-7B-4B-AA-B0',
##         'network': 'CMCC',
##         'isLocal': 1
##     }],
##     'sensors': [{
##         'id': '561787e3039e4019d87b0400',
##         'name': '2号传感器',
##         'x': 100,
##         'y': 100,
##         'spaceId': '446eaa4a0011444730041600',
##         'mac': '10-C3-7B-4B-AA-B0',
##         'network': 'CMCC'
##     }]
## }
## 成功返回：{'status': 'OK'}
## 失败返回：{'status': 'ERROR', 'msg': '失败信息'}
#@bp_temp.route('/saveAll', methods=['POST'])
#def saveAll():
#    data = request.get_json()
#    # save room
#    room = data.get('room')
#    roomRs = MongoConnManager.getConfigConn().appTempSaveRoom(room)
#    # save spaces
#    spaceList = data.get('spaces')
#    spaceRs = MongoConnManager.getConfigConn().appTempSaveSpace(spaceList)
#    # save controllers
#    controllerList = data.get('controllers')
#    controllerRs = MongoConnManager.getConfigConn().appTempSaveController(controllerList)
#    # save sensors
#    sensorList = data.get('sensors') 
#    sensorRs = MongoConnManager.getConfigConn().appTempSaveSensor(sensorList)
#    return json.dumps({
#        'room': roomRs,
#        'spaces': spaceRs,
#        'controllers': controllerRs,
#        'sensors': sensorRs    
#    }, ensure_ascii=False)


#生成一个包含几个房间ID的token，用于关联房间时验证
#postData: {
#   'userId': 2,         生成者ID
#   'elapse': 7,         过期时间，单位天
#   'arrRoomIds': ['', '', ''],     关联房间ID
#}
# time字段 自动补充为当前时间
@bp_temp.route('/token/create', methods=['POST'])
def createToken():
    rv = ''
    try:
        data = request.get_json()
        if data:
            rv = MongoConnManager.getConfigConn().appTempCreateToken(data)
            if not rv:
                print('createToken create failed.')
                logging.error('createToken create failed.')
    except Exception as e:
        print('createToken failed:' + e.__str__())
        logging.error('createToken failed:' + e.__str__())
    return json.dumps(rv, ensure_ascii=False)

#关联token中包含的房间
#postData: {
#   'tokenId': '',       生成者ID
#   'userId': 7,         用户ID
#}
#根据tokenId找到AppTemp_Token中对应的arrRoomId后，把房间与用户在APPTemp_UserRoom中绑定
@bp_temp.route('/token/corelateRoom', methods=['POST'])
def corelateByToken():
    rv = ''
    try:
        data = request.get_json()
        if data:
            rv = MongoConnManager.getConfigConn().appTempCorelateToken(data)
            if not rv:
                print('corelateByToken failed')
                logging.error('corelateByToken failed')
    except Exception as e:
        print('corelateByToken failed: ' + e.__str__())
        logging.error('corelateByToken failed: ' + e.__str__())
    return json.dumps(rv, ensure_ascii=False)

#room关联到user
@bp_temp.route('/room/corelateUser', methods=['POST'])
def corelateUserByRoomId():
    rt = False
    try:
        data = request.get_json()
        if data:
            userId = data.get('userId')
            roomId = data.get('roomId')
            rt = MongoConnManager.getConfigConn().corelate_room_and_user(userId, roomId)
    except Exception as e:
        print('corelateUserByRoomId error:' +e.__str__())
        logging.error('corelateUserByRoomId error:' +e.__str__())
    return jsonify(data=rt)

#根据用户ID，获取对应的二维码列表
#data: [{
#    '_id':'446eaa4a0011444730041600',	#
#   'time':'20160317 09:00',	#	生成时间
#   'elapse':'6',	#	过期时间
#   'arrRooms':['roomName1','roomName1']
#}]
@bp_temp.route('/token/getListByUserId', methods=['GET'])
def getTokenListByUserId():
    #第一步，根据李乾接口，获取当前登录用户ID
    userId = AuthManager.get_userId()

    #第二步，根据用户ID获取对应的二维码列表
    rt = MongoConnManager.getConfigConn().appTempGetTokenInfo(userId)

    #第三部，自动删除超时二维码
    
    data = [{
        '_id':'446eaa4a0011444730041600',	#
	    'time':'2016-03-17 09:00',	#	生成时间
	    'elapse':'6',	#	过期时间
	    'arrRooms':['roomName1','roomName1']
    },{
        '_id':'446eaa4a0011444730041601',	#
	    'time':'2016-03-13 09:00',	#	生成时间
	    'elapse':'20',	#	过期时间
	    'arrRooms':['roomName2']
    }]
    return jsonify({'data': rt});


#删除token
@bp_temp.route('/token/remove/<tokenId>', methods=['GET'])
def removeToken(tokenId):
    rt = MongoConnManager.getConfigConn().appTempDeleteToken(tokenId)
    rtTokenId = ''
    if rt:
        rtTokenId = tokenId
    return jsonify({'tokenId': rtTokenId});


#获取日程表
@bp_temp.route('/schedule/get/<roomId>', methods=['GET'])
def getSchedule(roomId):
    rv = ''
    try:
        rv = MongoConnManager.getConfigConn().appTempGetSchedule(roomId)
        if not rv:
            print('getSchedule failed')
            logging.error('getSchedule failed')
    except Exception as e:
        print('getSchedule failed: ' + e.__str__())
        logging.error('getSchedule failed: ' + e.__str__())
    return json.dumps(rv, ensure_ascii=False)


#新增日程
#postData: {
#}
@bp_temp.route('/schedule/save', methods=['POST'])
def saveSchedule():
    rv = ''
    try:
        data = request.get_json()
        if data:
            rv = MongoConnManager.getConfigConn().appTempSaveSchedule(data)
            if not rv:
                print('getSchedule failed')
                logging.error('getSchedule failed')
    except Exception as e:
        print('getSchedule failed: ' + e.__str__())
        logging.error('getSchedule failed: ' + e.__str__())
    return json.dumps(rv, ensure_ascii=False)


#推送数据
#postData: {
#   'userId': 3,     发起人
#   'type': 0,       暂时支持广播
#   'grade': 2,
#   'content': 'xx'  内容
#}
@bp_temp.route('/message/push', methods=['POST'])
def pushMessage():
    rv = ''
    try:
        data = request.get_json()
        if data:
            rv = MongoConnManager.getConfigConn().appTempPushMessage(data)
            if not rv:
                print('pushMessage failed')
                logging.error('pushMessage failed')
    except Exception as e:
        print('pushMessage failed: ' + e.__str__())
        logging.error('pushMessage failed: ' + e.__str__())
    return json.dumps(rv, ensure_ascii=False)


#根据房间获取相关人员信息
#returnData: 
#{
#    'roomId': 'xxxxx',     
#    'list': [{
#        'userId': 22,
#        'grade': 20, #权限
#        'name': '用户1',  
#        'img': '' #头像URL
#    }]
#}
@bp_temp.route('/room/getUserList/<roomId>', methods=['GET'])
def getRoomUserList(roomId):
    rt = []
    try:
        if ObjectId.is_valid(roomId):
            userInfoList = MongoConnManager.getConfigConn().getRoomUserList(roomId)
            userIdList = [x.get('userId') for x in userInfoList]
            if userIdList:
                userInfoListMysql = BEOPDataAccess.getInstance().getUsersInfoForAppTemp(userIdList)
                for item in userInfoListMysql:
                    grade = 0
                    for info in userInfoList:
                        if info.get('userId') == item[0]:
                            grade = info.get('grade')
                            break
                    rt.append({'userId':item[0], 'name':item[1], 'img':item[2], 'grade':grade})
    except Exception as e:
        print('interface getRoomUserList error:'+e.__str__())
        logging.error('interface getRoomUserList error:'+e.__str__())
    return jsonify(roomId=roomId, list=rt)


#修改用户在对应房间的权限 APPTemp_UserRoom
#postData: {
#   'roomId': 'xxxxx',     
#   'userId': 0,       
#   'grade': 10,  0:普通 10：管理员 20：物业
#}
@bp_temp.route('/room/setUserGrade', methods=['POST'])
def setUserGrade():
    rt = False
    try:
        data = request.get_json()
        if data:
            roomId = data.get('roomId')
            userId = data.get('userId')
            grade = data.get('grade')
            rt = MongoConnManager.getConfigConn().setGrade(userId, roomId, grade)
    except Exception as e:
        print('interface setUserGrade error:'+e.__str__())
        logging.error('interface setUserGrade error:'+e.__str__())
    return jsonify(data=rt)

#删除用户关系
@bp_temp.route('/room/removeUser/<userId>/<roomId>', methods=['GET'])
def removeUserRoom(userId, roomId):
    rt = False
    try:
        rt = MongoConnManager.getConfigConn().removeUserRoom(userId, roomId)
    except Exception as e:
        print('interface removeUserRoom error:'+e.__str__())
        logging.error('interface removeUserRoom error:'+e.__str__())
    return jsonify(data=rt)

@bp_temp.route('/room/update/<roomId>', methods=['GET'])
def updateInfo(roomId):
    # rt = []
    # try:
    #     data = request.get_json()
    #     if data:
    #         userIdList = MongoConnManager.getConfigConn().getLocationInfoUsers(data)
    #         if userIdList:
    #             userInfoList = BEOPDataAccess.getInstance().getUsersInfoForAppTemp(userIdList)
    #             for item in userInfoList:
    #                 rt.append({'userId':item[0], 'name':item[1], 'urlImg':item[2]})
    # except Exception as e:
    #     print('getLocationInfo failed: ' + e.__str__())
    #     logging.error('getLocationInfo failed: ' + e.__str__())
    # return jsonify(list=rt)
    rt = []
    try:
        url = app.config.get('TEMPERATURE_APP_SERVICE_ADDRESS') + '/appTemp/room/update/' + str(roomId)
        rt = requests.get(url, timeout = 600)
        rt = rt.text
    except Exception as e:
        print('getLocationInfo failed: ' + e.__str__())
        logging.error('getLocationInfo failed: ' + e.__str__())
    return rt

@bp_temp.route('/room/mode/<roomId>/<modeId>', methods=['GET'])
@bp_temp.route('/room/mode/<roomId>/<modeId>/<src>', methods=['GET'])
#src = 0:通知算法   1：通知数据库
def setModeByroomId(roomId, modeId, src = 0):
    rt = None
    if int(src) == 1:
        MongoConnManager.getConfigConn().mdbBb['IOT_Group'].update({'_id': ObjectId(roomId)}, {'$set' : {'params.mode': modeId}})
        return json.dumps(True)
    else:
        try:
            url = app.config.get('TEMPERATURE_APP_SERVICE_ADDRESS') + '/appTemp/room/mode/' + str(roomId) + '/' + str(modeId)
            rt = requests.get(url, timeout = 600)
            rt = rt.text
        except Exception as e:
            print('setModeByroomId error:' + e.__str__())
            logging.error('setModeByroomId error:' + e.__str__())
    return rt

#保存房间管理密码
@bp_temp.route('/room/setRoomPassword/<roomId>', methods=['POST'])
def setRoomPassword(roomId):
    rt = False
    rq = request.get_json()
    password = rq.get('password', None)
    try:
        sql = {}
        if password != None: sql['params.password'] = password;
        MongoConnManager.getConfigConn().mdbBb['IOT_Group'].update({'_id': ObjectId(roomId)}, {'$set' : sql})
        rt = True
    except Exception as e:
        print('setRoomPassword error:' + e.__str__())
        logging.error('setRoomPassword error:' + e.__str__())
    return json.dumps(rt)

#算法调用，保存房间当前设置的模式、预制温度
#postData: {         #mode和tempSet可只传一个
#    'mode': 1,      #房间模式
#    'tempSet': 1    #房间预设温度
#}
@bp_temp.route('/room/setStatus/<roomId>/<src>', methods=['POST'])
def setStatusByRoomId(roomId, src):
    rt = False
    rq = request.get_json()
    mode = rq.get('mode', None)
    tempSet = rq.get('tempSet', None)
    try:
        if int(src) == 1:
            sql = {}
            if mode != None: sql['params.mode'] = mode;
            if tempSet != None: sql['params.tempSet'] = tempSet;

            MongoConnManager.getConfigConn().mdbBb['IOT_Group'].update({'_id': ObjectId(roomId)}, {'$set' : sql})
            rt = True
    except Exception as e:
        print('setStatusByRoomId error:' + e.__str__())
        logging.error('setStatusByRoomId error:' + e.__str__())
    return json.dumps(rt)

@bp_temp.route('/room/getRealtimeData/<roomId>', methods=['POST'])
@cross_origin(origins='*')
def getRealtimeData(roomId):
    data = request.get_json()
    arrRealtime = []
    params = None
    try:
        # 获取实时数据
        #headers = {'content-type': 'application/json'}
        #url = request.host_url + 'analysis/startWorkspaceDataGenPieChart'
        #rt = requests.post(url, data=json.dumps(data), headers=headers,timeout=600)
        #rt = rt.text
        if data:
            itemIdList = data.get('dsItemIds')
            dataSouceId = data.get('dataSourceId')
            arrRealtime = []
            requestProj = {}
            ptNameToID = {}
            for item in itemIdList:
                rtInfo = getOneItemDataPointName(dataSouceId, item)
                if rtInfo is None:
                    arrRealtime.append(dict(dsItemId=item, data='EquationCalculationNotSupoorted'))
                    print('getOneItemDataPointName return None: %s'% (item,))
                    continue
                (projId, ptName) = rtInfo
                if projId in requestProj.keys():
                    requestProj[projId].append(ptName)
                else:
                    requestProj[projId] = [ptName]

                strKey = '%d_%s'%(int(projId), ptName)
                if strKey in ptNameToID:
                    ptNameToID[strKey].append(item)
                else:
                    ptNameToID[strKey] = [item]
            for k,v in requestProj.items():
                rvdata = BEOPDataAccess.getInstance().getBufferRTDataByProj(k, v)
                for rvk, rvv in rvdata.items():
                    strKey = '%d_%s'%(int(k), rvk)
                    #print('got data:'+ strKey)
                    if strKey in ptNameToID.keys():
                        for idItem in ptNameToID.get(strKey):
                            arrRealtime.append(dict(dsItemId=idItem, data=rvv))
        # 获取房间模式mode/当前温度设定/密码
        params = MongoConnManager.getConfigConn().get_room_params_by_id(roomId)
    except Exception as e:
        print('getRealtimeData error:' + e.__str__())
        logging.error('getRealtimeData error:' + e.__str__())
    return jsonify(data=arrRealtime, params=params)