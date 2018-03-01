from flask import request, json, jsonify
import logging, uuid
from beopWeb import app
from beopWeb.mod_logistics import bp_logistics
from beopWeb.MongoConnManager import *
from beopWeb.BEOPDataAccess import *
from beopWeb.AuthManager import AuthManager
from beopWeb.mod_logistics.logistics import Logistics
from beopWeb.mod_logistics.logistics import Point
from beopWeb.mod_logistics.logistics import ExcleFileEx
from beopWeb.models import ExcelFile
from flask import request, json, jsonify, make_response, send_file, Response
from io import StringIO
import xlwt
import xlrd


@app.route('/logistics')
def logistics():
    """Renders the home page."""
    return render_template('indexLogisticsPlantform.html', title='BeOP')



# 获取固定点、移动点列表，包含起止时间设置，固定点/移动点, 根据用户token信息
# endTime < startTime 则为隔天
# return_ = {
#     "data": [{
#         "_id": "",
#         "name": "三轮车1号"
#         "startTime": "09:00",
#         "endTime": "23:00",
#         "upperTemp": "",
#         "lowerTemp": "",
#     }]
# }
@bp_logistics.route('/thing/getList', methods=['GET'])
@bp_logistics.route('/thing/getList/<type>', methods=['GET'])
def getThingList(type=None):
    rs = None
    try:
        targetUserId = request.cookies.get('targetUserId')
        if targetUserId:
            userId = targetUserId
            if not Logistics.user_sublist(userId):
                return json.jsonify(data=rs)
        else:
            userId = AuthManager.get_userId()
        parentDictFixed, parentDictVeh = Logistics.getParentListByVirtualPoints(userId)
        fixedPointsInfo = []
        vehiclePointsInfo = []
        if str(type) == '0':
            # 获取固定点信息
            fixedPointsInfo = Logistics.getFixedPointsInfo(parentDictFixed.get('groups'))
        elif str(type) == '1':
            # 获取奶车点信息
            vehiclePointsInfo = Logistics.getVehiclePointsInfo(parentDictVeh.get('groups'))
        else:
            # 返回全部固定/奶车点
            fixedPointsInfo = Logistics.getFixedPointsInfo(parentDictFixed.get('groups'))
            vehiclePointsInfo = Logistics.getVehiclePointsInfo(parentDictVeh.get('groups'))

        rtFixed, rtVehicle = [], []
        # 0: id, 1: name, 2: upperTemp, 3: lowerTemp, 4: parentid, 5: updateTime, 6: startTime, 7: endTime
        for line in fixedPointsInfo:
            rtFixed.append(
                dict(
                    _id=line[0],
                    name=line[1],
                    startTime=line[6],
                    endTime=line[7],
                    upperTemp=line[2],
                    lowerTemp=line[3],
                    parentid=line[4],
                    updateTime=line[5]
                )
            )
        rs = dict(warehouses=rtFixed)
        # 0: id, 1: name, 2: parentid, 3: updateTime, 4: upperTemp, 5: lowerTemp, 6: startTime, 7: endTime
        for line in vehiclePointsInfo:
            rtVehicle.append(
                dict(
                    _id=line[0],
                    name=line[1],
                    startTime=line[6],
                    endTime=line[7],
                    upperTemp=line[4],
                    lowerTemp=line[5],
                    parentid=line[2],
                    updateTime=line[3]
                )
            )
        rs.update({'transporters': rtVehicle})
    except Exception as e:
        logging.error('getThingList error: % s' % e.__str__())
    return jsonify(data=rs)
    rs = {
        "data": [{
            "_id": "201",
            "name": "我是小仓库1号",
            "startTime": "09:00",
            "endTime": "03:00",
            "upperTemp": "30",
            "lowerTemp": "20",
        }, {
            "_id": "202",
            "name": "我是小仓库2号",
            "startTime": "09:00",
            "endTime": "23:00",
            "upperTemp": "20",
            "lowerTemp": "10",
        }, {
            "_id": "203",
            "name": "我是小仓库3号",
            "startTime": "09:00",
            "endTime": "13:00",
            "upperTemp": "25",
            "lowerTemp": "25",
        }]
    }




    rs = {
        "data": [{
            "_id": "101",
            "name": "我是三轮车1号",
            "startTime": "09:00",
            "endTime": "03:00",
            "upperTemp": "30",
            "lowerTemp": "20",
        }, {
            "_id": "102",
            "name": "我是三轮车2号",
            "startTime": "09:00",
            "endTime": "21:00",
            "upperTemp": "20",
            "lowerTemp": "10",
        }, {
            "_id": "103",
            "name": "我是三轮车3号",
            "startTime": "19:00",
            "endTime": "13:00",
            "upperTemp": "22",
            "lowerTemp": "33",
        }]
    }


# 根据token中当前登录用户，获取起对应的固定点、移动点实时数据用于地图显示
# return: {
#     "warehouses":[{
#         "_id": "12312",
#         "name": "我是小仓库一号",
#         "temp": 23,
#         "gps": [255, 213, 0]
#     }],
#     "transporters":[{
#         "_id": "12312",
#         "name": "我是三轮车一号",
#         "temp": 23,
#         "gps": [255, 213, 0],
#         "dir": 0         #车头朝向，角度
#     }],
# }
@bp_logistics.route('/thing/getDataList', methods=['GET'])
def getThingRealData():
    # userId = AuthManager.get_userId()
    # userId = 2711  #测试数据用户id
    rs = None
    try:
        rtWarehouses = []
        rtTransporters = []
        rv_fixed_list = Logistics.getFixedPoints()
        # 0: id, 1: name, 2: temp, 3: humidity, 4: alarm, 5: online, 6: gpstime, 7: updateTime
        for line in rv_fixed_list:
            rtWarehouses.append(
                dict(
                    _id=line[0],
                    name=line[1],
                    option={
                        "temp": line[2] if line[2] is not None or line[2] != "" else None,
                        "humidity": line[3],
                        "alarm": line[4],
                        "online": line[5],
                        "gpstime": line[6],
                        "updateTime": line[7],
                        "doorstatus": line[8],
                        "comstatus": line[9],
                        "workhours": line[10]
                    }
                )

            )
        rv_transporters = Logistics.getVehiclePoints()
        f = lambda x: float(x) if x is not None else x
        # 0: id, 1: name, 2: temp, 3: lat, 4: lng, 5: speed, 6: status, 7: mileage, 8: area, 9: gpstime, 10: updateTime, 11: dir
        for line in rv_transporters:
            rtTransporters.append(
                dict(
                    _id=line[0],
                    name=line[1],
                    option={
                        "temp": line[2] if line[2] is not None or line[2] != "" else None,
                        "mileage": line[7],
                        "status": line[6],
                        "area": line[8],
                        "gps": list(map(f, [line[3], line[4]])),
                        "speed": line[5],
                        "gpstime": line[9],
                        "updateTime": line[10],
                        "dir": line[11]
                    }
                )

            )
        rs = dict(warehouses=rtWarehouses, transporters=rtTransporters)
    except Exception as e:
        logging.error('getThingRealData error: %s' % e.__str__())
    return jsonify(data=rs)




    rs = {
        "warehouses":[{
            "_id": "101",
            "temp": 18,
            "gps": [255, 213, 0]
        }, {
            "_id": "102",
            "temp": 19,
            "gps": [255, 213, 0]
        }, {
            "_id": "103",
            "temp": 23,
            "gps": [255, 213, 0]
        }],
        "transporters":[{
            "_id": "201",
            "temp": 23,
            "gps": [255, 213, 0],
            "dir": 0  # 车头朝向，角度
        }, {
            "_id": "202",
            "temp": 15,
            "gps": [255, 213, 0],
            "dir": 0  # 车头朝向，角度
        }, {
            "_id": "203",
            "temp": 23,
            "gps": [255, 213, 0],
            "dir": 0  # 车头朝向，角度
        }, ],
    }


# 根据ID获取移动点/固定点详情 
# type: 0：固定点 1，移动点
# return: {                       #固定点
#     "_id": "12312",
#     "name": "我是小仓库一号",
#     "option": {
#         "temp": 23,             #温度
#         "gps": [255, 213, 0],   #GPS
#         "humidity": 32,         #湿度
#         "alarm": 1,             #报警 0：不报， 1：报警 2硬件报警
#         "online": 1,            #在线状态 0：离线， 1：在线
#         "running": 1,           #压缩机运行状态： 0：停机， 1：运行
#         "time": "20170702 19:00:00"               #数据刷新时间
#     }
# }
# {                               #移动点
#     "_id": "12312",
#     "name": "我是三轮车一号",
#     "option": {
#         "temp": 23,             #温度
#         "gps": [255, 213, 0],   #GPS
#         "speed": 20,            #速度
#         "alarm": 1,             #报警 0：不报， 1：报警 2硬件报警
#         "ignition": 1,          #点火 0：熄火， 1：点火
#         "running": 1,           #运行状态： 0：停车， 1：运行
#         "time": "20170702 19:00:00"               #数据刷新时间
#     }
# }
@bp_logistics.route('/thing/getDetail/<thingId>/<type>', methods=['GET'])
def getThingDetail(thingId, type):
    rs = None
    try:
        if(str(type) == '0'):                
            rv_fixed_list = Logistics.getFixedPoints(str(thingId))
            # 0: id, 1: name, 2: temp, 3: humidity, 4: alarm, 5: online, 6: gpstime, 7: updateTime
            for line in rv_fixed_list:
                rs = dict(
                        _id=line[0],
                        name=line[1],
                        option={
                            "temp": line[2] if line[2] is not None or line[2] != "" else None,
                            "humidity": line[3],
                            "alarm": line[4],
                            "online": line[5],
                            "gpstime": line[6],
                            "updateTime": line[7],
                            "doorstatus": line[8],
                            "comstatus": line[9],
                            "workhours": line[10]
                        }
                    )
        elif(str(type) == '1'):
            rv_transporters = Logistics.getVehiclePoints(str(thingId))
            f = lambda x: float(x) if x is not None else x
            # 0: id, 1: name, 2: temp, 3: lat, 4: lng, 5: speed, 6: status, 7: mileage, 8: area, 9: gpstime, 10: updateTime, 11: dir
            for line in rv_transporters:
                rs = dict(
                        _id=line[0],
                        name=line[1],
                        option={
                            "temp": line[2] if line[2] is not None or line[2] != "" else None,
                            "mileage": line[7],
                            "status": line[6],
                            "area": line[8],
                            "gps": list(map(f, [line[3], line[4]])),
                            "speed": line[5],
                            "gpstime": line[9],
                            "updateTime": line[10],
                            "dir": line[11]
                        }
                    )
    except Exception as e:
        logging.error('getThingRealData error: %s' % e.__str__())
    return jsonify(data=rs)

    if type:
        rs = {  # 移动点
            "_id": "12312",
            "name": "我是三轮车一号",
            "option": {
                "temp": 23,  # 温度
                "gps": [255, 213, 0],  # GPS
                "speed": 20,  # 速度
                "alarm": 1,  # 报警 0：不报， 1：报警
                "ignition": 1,  # 点火 0：熄火， 1：点火
                "running": 1,  # 运行状态： 0：停车， 1：运行
                "time": "20170702 19:00:00"  # 数据刷新时间
            }
        }
    else:
        rs = {  # 移动点
            "_id": "12312",
            "name": "我是三轮车一号",
            "option": {
                "temp": 23,  # 温度
                "gps": [255, 213, 0],  # GPS
                "speed": 20,  # 速度
                "alarm": 1,  # 报警 0：不报， 1：报警
                "ignition": 1,  # 点火 0：熄火， 1：点火
                "running": 1,  # 运行状态： 0：停车， 1：运行
                "time": "20170702 19:00:00"  # 数据刷新时间
            }
        }
    return jsonify(data=rs)


# 导出历史 Excel，通用
# postData = {
#     "head": ["id","区域", "设备标识", "报警次数", "温度采集次数", "温度合格次数", "温度合格率", "数据采集次数", "非正常次数", "压缩机工作时长", "冷库开门次数"],
#     "data":[["101","区域1", "设备标识1", "1", "2", "3", "4", "5", "6", "7", "8"]]
# }
@bp_logistics.route('/export/excel/', methods=['POST'])
@bp_logistics.route('/export/excel/<int:needDetail>', methods=['POST'])
def exportExcel(needDetail=0):
    rt = None
    try:
        data = request.get_json()
        rowNameList = data.get("head")
        valueList = data.get("data")
        projectId = data.get("projId")
        startTime = data.get("begTime")
        endTime = data.get("endTime")
        type = int(data.get("type"))
        filepath,filename = getfilepath()
        if needDetail == 0:
            ExcleFileEx.write_excel(rowNameList, valueList, filepath)
            rt = "/static/projectReports/reports/"+filename
            #rt = make_response(send_file(filepath))
        elif needDetail ==1:
            #ExcleFileEx.write_excel(rowNameList, valueList, filepath)
            ExcleFileEx.write_excel_detail(projectId,rowNameList, valueList, filepath,type,startTime,endTime)
            rt = "/static/projectReports/reports/"+filename
            #rt = make_response(send_file(filepath))
        #rt.headers["Content-Disposition"] = "attachment; filename=%s;"%filename
        elif needDetail ==2:
            ExcleFileEx.write_excel_new(rowNameList, valueList, filepath)
            rt = "/static/projectReports/reports/"+filename
        elif needDetail ==3:
            ExcleFileEx.write_excel_strategyValue(rowNameList, valueList, filepath)
            rt = "/static/projectReports/reports/"+filename
    except Exception as e:
        print('download_file_of_historyFault error:' + e.__str__())
        logging.error(e.__str__())
        #rt = make_response(send_file(filepath))
    return rt

def getfilepath():
    rt = None
    file_name = None
    try:
        path = os.getcwd()
        filepath = path + '/beopWeb/static/projectReports/reports'
        if not os.path.exists(filepath):
            os.makedirs(filepath)
        file_name = ObjectId().__str__() + '.xls'
        filepath = filepath + '/' + file_name.__str__()
        rt = filepath
    except Exception as e:
        print('make_excel_file error:' + e.__str__())
        logging.error(e.__str__())
    return rt,file_name

def make_file_name(projId, startTime):
    rt = None
    try:
        startTime = datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S')
        if startTime < datetime.now():
            startTime = startTime.strftime('%Y-%m-%d')
            rt = str(projId) + '-' + startTime + '.xlsx'
    except Exception as e:
        print('make_file_name error:' + e.__str__())
        logging.error(e.__str__())
    return rt

@bp_logistics.route('/import/excel', methods=['POST'])
def importExcel():
    rt = None
    post_file = request.files.getlist('file')
    try:
        if post_file:
            dirPath = os.path.abspath('.') + '/temp'
            if not os.path.exists(dirPath):
                os.makedirs(dirPath)
            for file in post_file:
                if file.filename.split('.')[-1] == 'xls':
                    filefullpath = dirPath + '/' + ObjectId().__str__() + '.xls'
                    file.save(filefullpath)
                    data = read_excel(filefullpath)
                    if data:
                        rt = data
    except Exception as e:
        print('read_excel error' + e.__str__())
        logging.error(e.__str__())
        raise Exception('read excel error')
    return jsonify(rt)

def read_excel(filepath):
    data = {}
    try:
        # open excel
        datafile = xlrd.open_workbook(filepath)
        # get sheets
        nsheets = datafile.nsheets
        for sheetIndex in range(nsheets):
            sh = datafile.sheet_by_index(sheetIndex)
            #行数
            nrows = sh.nrows
            if nrows > 1:
                row0_data = sh.row_values(0)
                if '参数组名称' in row0_data:
                    for l in row0_data:
                        data.update({l: []})
                for x in range(1, nrows):
                    row_data = sh.row_values(x)
                    if len(row0_data) > 1:
                        for index in range(len(row0_data)):
                            data.get(row0_data[index]).append(row_data[index])
    except Exception as e:
        print('read_excel error' + e.__str__())
        logging.error(e.__str__())
        raise Exception('read excel error')
    return data
# 获取统计表格
# TODO： 考虑合并
# type 0:固定 1:移动
# ==============================
# 注意，移动点、固定点返回数据结构不同
#      id需传回
# ==============================
# return = {
#     "head": ["_id", "区域", "设备标识", "报警次数", "温度采集次数", "温度合格次数", "温度合格率", "数据采集次数", "非正常次数", "压缩机工作时长", "冷库开门次数"],
#     "data":[["_id", "区域1", "设备标识1", "1", "2", "3", "4", "5", "6", "7", "8"]]
# }
@bp_logistics.route('/thing/getStatisticalList/<type>', methods=['POST'])
def getThingStatisticalList(type):
    rs = None
    try:
        targetUserId = request.cookies.get('targetUserId')
        if targetUserId:
            userId = targetUserId
            if not Logistics.user_sublist(userId):
                return json.jsonify(rs)
        else:
            userId = AuthManager.get_userId()
        data = request.get_json()
        startTime = data.get('startTime')
        endTime = data.get('endTime')
        projId = data.get('projId')
        # 返回全部奶车点
        parentDictFixed, parentDictVeh = Logistics.getParentListByVirtualPoints(userId)
        # 获取该用户能看到的设备id以及合格率的点
        # parentidList = parentDict.get('groups')
        if str(type) == '1':
            vehiclePointsInfo = Logistics.getVehiclePointsInfo(parentDictVeh.get('groups'))
            # 移动点的rate点表
            vehiclePointsList = [str(veh[0]) + '_RATE' for veh in vehiclePointsInfo]
            # 获取查询时间和项目id
            warehouse, transporter = Logistics.getHisRate(projId, [], vehiclePointsList, startTime, endTime)
            rs = transporter
        elif str(type) == '0':
            fixedPointsInfo = Logistics.getFixedPointsInfo(parentDictFixed.get('groups'))
            fixedPointsList = [str(fix[0]) + '_RATE' for fix in fixedPointsInfo]
            warehouse, transporter = Logistics.getHisRate(projId, fixedPointsList, [], startTime, endTime)
            # 返回数据
            rs = warehouse
        else:
            return jsonify(dict(error=1, msg='wrong type, please check your url!'))
    except Exception as e:
        logging.error("getStatisticalReport error: %s" % e.__str__())
    return jsonify(rs)

    '''
    if type:
        rs = {
            "head": ["_id", "区域", "设备标识", "块信息", "温度", "速度", "方向", "车辆状态", "点火状态", "信号获取时间", "GPS时间"],
            "data": [
                ["201", "区域1", "设备标识1", "块信息1", "1", "2", "3", "4", "5", "6", "7"],
                ["202", "区域1", "设备标识1", "块信息1", "1", "2", "3", "4", "5", "6", "7"],
                ["203", "区域1", "设备标识1", "块信息1", "1", "2", "3", "4", "5", "6", "7"]
            ]
        }
    else:
        rs = {
            "head": ["_id", "区域", "设备标识", "报警次数", "温度采集次数", "温度合格次数", "温度合格率", "数据采集次数", "非正常次数", "压缩机工作时长", "冷库开门次数"],
            "data": [
                ["101", "区域1", "设备标识1", "1", "2", "3", "4", "5", "6", "7", "8"],
                ["102", "区域1", "设备标识2", "1", "2", "3", "4", "5", "6", "7", "8"],
                ["103", "区域1", "设备标识3", "1", "2", "3", "4", "5", "6", "7", "8"],
            ]
        }
    return jsonify(rs)
    '''


@bp_logistics.route('/thing/getStatisticalList/month/<type>', methods=['POST'])
def getThingStatisticalListMonth(type):
    rs = None
    try:
        targetUserId = request.cookies.get('targetUserId')
        if targetUserId:
            userId = targetUserId
            if not Logistics.user_sublist(userId):
                return json.jsonify(rs)
        else:
            userId = AuthManager.get_userId()
        data = request.get_json()
        startTime = data.get('startTime')
        endTime = data.get('endTime')
        projId = data.get('projId')
        # 返回全部奶车点
        parentDictFixed, parentDictVeh = Logistics.getParentListByVirtualPoints(userId)
        # 获取该用户能看到的设备id以及合格率的点
        # parentidList = parentDict.get('groups')
        if str(type) == '1':
            vehiclePointsInfo = Logistics.getVehiclePointsInfo(parentDictVeh.get('groups'))
            # 移动点的rate点表
            vehiclePointsList = [str(veh[0]) + '_RATEM' for veh in vehiclePointsInfo]
            # 获取查询时间和项目id
            warehouse, transporter = Logistics.getHisRate(projId, [], vehiclePointsList, startTime, endTime)
            rs = transporter
        elif str(type) == '0':
            fixedPointsInfo = Logistics.getFixedPointsInfo(parentDictFixed.get('groups'))
            fixedPointsList = [str(fix[0]) + '_RATEM' for fix in fixedPointsInfo]
            warehouse, transporter = Logistics.getHisRate(projId, fixedPointsList, [], startTime, endTime)
            # 返回数据
            rs = warehouse
        else:
            return jsonify(dict(error=1, msg='wrong type, please check your url!'))
    except Exception as e:
        logging.error("getStatisticalReport error: %s" % e.__str__())
    return jsonify(rs)


# 设置起止时间，固定点/移动点，多条
# ==============================
# 注意，数据库预留更新时间字段，满足以后回溯等需求扩展
# ==============================
# return_ = {
#     "data": [{
#         "_id": "",
#         "startTime": "09:00",
#         "endTime": "23:00",
#         "upperTemp": "",
#         "lowerTemp": "",
#     }]
# }
@bp_logistics.route('/config/save/<type>', methods=['POST'])
def saveConfigList(type):
    rv = {'error':1, 'status': False}
    try:
        dataList = request.get_json()
        for data in dataList:
            _id = data.get('id')
            lowerTemp = data.get('lowerTemp')
            upperTemp = data.get('upperTemp')
            endTime = data.get('endTime')
            startTime = data.get('startTime')
            if not(id and lowerTemp and upperTemp and endTime and startTime):
                rv.update({'msg': 'params null or error, please check it!'})
                return json.jsonify(rv)
            state = False
            if int(type) == 0:
                # 保存固定点信息
                state = Logistics.updateFixedInfo(_id, lowerTemp, upperTemp, endTime, startTime)
            elif int(type) == 1:
                # 保存移动点信息
                state = Logistics.updateVehInfo(_id, lowerTemp, upperTemp, endTime, startTime)
            else:
                return jsonify({'error':1, 'msg': 'wrong type value for /config/save/<type>, please check it!', 'status': False})
            if state:
                rv.update({'error': 0, 'status': True})
            else:
                rv.update({'msg':'update data failed!'})
    except Exception as e:
        logging.error('saveConfigList error: %s' % e.__str__())
    return jsonify(rv)


# 获取历史 统计表格， 报表用
# postData = {
#     "startTime": "",
#     "endTime": ""
# }
# return_ = {
#     "warehouse": {
#         "head": ["序号", "合格率", "设备标识", "设备区域", "采集总次数", "温度合格次数", "合格率"],
#         "data": [
#             ["111", "1", "2", "3", "4", "5", "6"],
#             ["222", "1", "2", "3", "4", "5", "6"],
#         ]
#     },
#     "transporter": {
#         "head": ["序号", "合格率", "设备标识", "设备块", "设备分组", "采集总次数", "温度合格次数"],
#         "data": [
#             ["122", "1", "2", "3", "4", "5", "6"],
#             ["122", "1", "2", "3", "4", "5", "6"],
#             ["122", "1", "2", "3", "4", "5", "6"],
#             ["122", "1", "2", "3", "4", "5", "6"]
#         ]
#     }
# }
@bp_logistics.route('/report/getStatisticalList/', methods=['POST'])
def getStatisticalReport():
    rs = {
            "warehouse": {
                "head": ['序号', '设备区域', '块信息', '设备标识', '采集总次数', '温度合格次数', '工作合格率', '采集时间'],
                "data": []
            },
            "transporter": {
                "head": ['序号', '设备区域', '块信息', '设备标识', '采集总次数', '温度合格次数', '工作合格率', '采集时间'],
                "data": []
            }
    }
    try:
        targetUserId = request.cookies.get('targetUserId')
        if targetUserId:
            userId = targetUserId
            if not Logistics.user_sublist(userId):
                return json.jsonify(rs)
        else:
            userId = AuthManager.get_userId()
        # userId = 2711  #测试数据用户id
        data = request.get_json()
        startTime = data.get('startTime')
        endTime = data.get('endTime')
        projId = data.get('projId')
        # 返回全部固定/奶车点
        parentDictFixed, parentDictVeh = Logistics.getParentListByVirtualPoints(userId)
        # 获取该用户能看到的设备id以及合格率的点
        # parentidList = parentDict.get('groups')
        fixedPointsInfo = Logistics.getFixedPointsInfo(parentDictFixed.get('groups'))
        vehiclePointsInfo = Logistics.getVehiclePointsInfo(parentDictVeh.get('groups'))
        # 移动/固定点的rate点表
        fixedPointsList = [str(fix[0]) + '_RATE' for fix in fixedPointsInfo]
        vehiclePointsList = [str(veh[0]) + '_RATE' for veh in vehiclePointsInfo]
        # 获取查询时间和项目id
        warehouse, transporter = Logistics.getHisRate(projId, fixedPointsList, vehiclePointsList, startTime, endTime)
        # 返回数据
        rs.update(
            {
                'warehouse': warehouse,
                'transporter': transporter
             }
        )
    except Exception as e:
        logging.error("getStatisticalReport error: %s" % e.__str__())
    return jsonify(rs)


    '''
    rs = {
        "warehouse": {
            "head": ["序号", "合格率", "设备标识", "设备区域", "采集总次数", "温度合格次数", "合格率"],
            "data": [
                ["101", "1", "2", "3", "4", "5", "6"],
                ["102", "1", "2", "3", "4", "5", "6"],
            ]
        },
        "transporter": {
            "head": ["序号", "合格率", "设备标识", "设备块", "设备分组", "采集总次数", "温度合格次数"],
            "data": [
                ["201", "1", "2", "3", "4", "5", "6"],
                ["202", "1", "2", "3", "4", "5", "6"],
                ["203", "1", "2", "3", "4", "5", "6"],
                ["204", "1", "2", "3", "4", "5", "6"]
            ]
        }
    }'''


@bp_logistics.route('/report/getStatisticalList/month', methods=['POST'])
def getStatisticalMonthReport():
    rs = {
            "warehouse": {
                "head": ['序号', '设备区域', '块信息', '设备标识', '采集总次数', '温度合格次数', '工作合格率', '采集时间'],
                "data": []
            },
            "transporter": {
                "head": ['序号', '设备区域', '块信息', '设备标识', '采集总次数', '温度合格次数', '工作合格率', '采集时间'],
                "data": []
            }
    }
    try:
        targetUserId = request.cookies.get('targetUserId')
        if targetUserId:
            userId = targetUserId
            if not Logistics.user_sublist(userId):
                return json.jsonify(rs)
        else:
            userId = AuthManager.get_userId()
        # userId = 2711  #测试数据用户id
        data = request.get_json()
        startTime = data.get('startTime')
        endTime = data.get('endTime')
        projId = data.get('projId')
        # 返回全部固定/奶车点
        parentDictFixed, parentDictVeh = Logistics.getParentListByVirtualPoints(userId)
        # 获取该用户能看到的设备id以及合格率的点
        # parentidList = parentDict.get('groups')
        fixedPointsInfo = Logistics.getFixedPointsInfo(parentDictFixed.get('groups'))
        vehiclePointsInfo = Logistics.getVehiclePointsInfo(parentDictVeh.get('groups'))
        # 移动/固定点的rate点表
        fixedPointsList = [str(fix[0]) + '_RATEM' for fix in fixedPointsInfo]
        vehiclePointsList = [str(veh[0]) + '_RATEM' for veh in vehiclePointsInfo]
        # 获取查询时间和项目id
        warehouse, transporter = Logistics.getHisRate(projId, fixedPointsList, vehiclePointsList, startTime, endTime)
        # 返回数据
        rs.update(
            {
                'warehouse': warehouse,
                'transporter': transporter
             }
        )
    except Exception as e:
        logging.error("getStatisticalReport error: %s" % e.__str__())
    return jsonify(rs)
    