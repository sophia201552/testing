from flask import request, json, jsonify, render_template
from beopWeb import app
from beopWeb.mod_patrol import bp_patrol
from beopWeb.MongoConnManager import *
from beopWeb.BEOPDataAccess import  *
from datetime import datetime
import logging
from bson.objectid import ObjectId
from .patrol import *


@app.route('/patrol')
def patrol():
    return render_template('indexPatrol.html', title='BEOP Patrol')


@app.route('/patrolApp')
def patrolApp():
    return render_template('indexPatrolApp.html', title='BEOP Patrol')

#获取当前项目所有巡更点列表
#返回:
#data = [{
#    '_id': 'ccaa8c432621452077258001',
#    'name': 'XXX_01',
#    'codeQR': 'b99463d58a5c8372e6adbdca867428961641cb51',
#    'type': 0,
#    'content': '检查1111111111111',
#    'lastTime': '2014-02-20 19:31',
#    'arrPaths': [{'_id':'', 'name': '11'}, {'_id':'', 'name': '22'}],
#    #相关线路数，path表中查出
#}]
@bp_patrol.route('/point/getList/<projId>', methods=['GET'])
def getPointList(projId):
    rt = []
    try:
        rt = Patrol.get_patrol_point_list(projId)
    except Exception as e:
        print('getPointList error:' + e.__str__())
        logging.error('getPointList error:' + e.__str__())
    return jsonify(data = rt)


#保存巡更点
#若'_id'存在，则为更新，无创建人ID；不存在，为插入，会带创建人ID
#修改时间自动生成
@bp_patrol.route('/point/save/<projId>', methods=['POST'])
def savePoint(projId):
    pointId = ''
    data = request.get_json()
    if data:
        pointId = Patrol.savePoint(projId, data)
    return jsonify(data=pointId)


#根据ID删除巡更点，传projId以作确认
@bp_patrol.route('/point/remove/<projId>/<pointId>', methods=['POST'])
def removePoint(projId, pointId):
    return jsonify(data=Patrol.removePoint(projId, pointId))


#根据巡更点ID 获取相关巡更路径
#返回:
#data = [{
#    '_id': '22228c432621452077258001',
#    'name': 'D3通关捷径',
#    'path': [{'_id':'ccaa8c432621452077258001', 'name': '奈非天'},
#        {'_id':'ccaa8c432621452077258002', 'name': '赫拉迪姆'},
#        {'_id':'ccaa8c432621452077258003', 'name': '英普瑞斯'}] #关联point表查出
#}]
@bp_patrol.route('/path/getListByPointId/<projId>/<pointId>', methods=['GET'])
def getPaths(projId, pointId):
    rt = []
    try:
        rt = Patrol.get_patrol_path_by_pointId(projId, pointId)
    except Exception as e:
        print('getPaths error:' + e.__str__())
        logging.error('getPaths error:' + e.__str__())
    return jsonify(data = rt)


#获取当前项目所有巡更路径
#返回:
#data = [{
#    '_id': '22228c432621452077258001',
#    'name': 'D3通关捷径',
#    'elapse': 120,
#    'status': 1,
#    'path': [{'_id':'ccaa8c432621452077258001', 'name': '奈非天'},
#        {'_id':'ccaa8c432621452077258002', 'name': '赫拉迪姆'},
#        {'_id':'ccaa8c432621452077258003', 'name': '英普瑞斯'}]
#}]
@bp_patrol.route('/path/getAll/<projId>', methods=['GET'])
def getPathAll(projId):
    rt = []
    try:
        rt = Patrol.get_patrol_path_by_projId(projId)
    except Exception as e:
        print('getPathAll error:' + e.__str__())
        logging.error('getPathAll error:' + e.__str__())
    return jsonify(data = rt)


#保存巡更路径
@bp_patrol.route('/path/save/<projId>', methods=['POST'])
def savePath(projId):
    pathId = ''
    data = request.get_json()
    if data:
        pathId = Patrol.savePath(projId, data)
    return jsonify(data=pathId)


#根据ID删除巡更路径，传projId以作确认
@bp_patrol.route('/path/remove/<projId>/<pathId>', methods=['GET'])
def removePath(projId, pathId):
    return jsonify(data=Patrol.removePath(projId, pathId))

#获取当前项目所有操作人员
#返回:
#data = [{
#    '_id': '1caa8c432621452077258001',
#    'code': '001',
#    'name': '张大饼',
#    'sex': 1,
#    'department': '运维',
#    'status': 1
#}]
@bp_patrol.route('/executor/getList/<projId>', methods=['GET'])
def getExecutorList(projId):
    rt = []
    try:
        rt = Patrol.get_patrol_executor_list_by_projId(projId)
    except Exception as e:
        print('getExecutorList error:' + e.__str__())
        logging.error('getExecutorList error:' + e.__str__())
    return jsonify(data = rt)


#保存操作人员
#若'_id'存在，则为更新；不存在，为插入
@bp_patrol.route('/executor/save/<projId>', methods=['POST'])
def saveExecutor(projId):
    executorId = ''
    data = request.get_json()
    if data:
        executorId = Patrol.saveExecutor(projId, data)
    return jsonify(data=executorId)


#根据ID删除操作人员，传projId以作确认
@bp_patrol.route('/executor/remove/<projId>/<executorId>', methods=['POST'])
def removeExecutor(projId, executorId):
    return jsonify(data=Patrol.removeExecutor(projId, executorId))


#获取任务
@bp_patrol.route('/mission/get/<projId>', methods=['GET'])
def getMission(projId):
    rt = []
    try:
        rt = Patrol.get_patrol_mission_list_by_projId(projId)
    except Exception as e:
        print('getMission error:' + e.__str__())
        logging.error('getMission error:' + e.__str__())
    return jsonify(data = rt)


#保存任务
@bp_patrol.route('/mission/save/<projId>', methods=['POST'])
def saveMission(projId):
    data = request.get_json()
    rt = ''
    try:
        rt = Patrol.save_patrol_mission(projId, data)
    except Exception as e:
        print('saveMission error:' + e.__str__())
        logging.error('saveMission error:' + e.__str__())
    return jsonify(data='missionId')


#获取起止时间范围内的任务报表，按巡更路径聚类
#注意已做出巡更计划，但没有响应巡更记录的情况,标记为未完成
#返回:
#data = {
#    'time': ['2016-02-02', '2016-02-03', '2016-02-04', '2016-02-05'], #精确到天
#    'data': [{
#        'pathId': '22228c432621452077258003', #巡更路线ID
#        'name': '路线1', #巡更路线名称
#        'data': [0,1,0,1],
#        #数组中每个元素代表当天的完成情况，由当天所有该巡更路线的status取逻辑与，并与巡更计划比对得出结果 0:未完成，1:完成
#        time字段有几天就有几条数据
#    }]
#}
@bp_patrol.route('/report/getBaseOnMission/<projId>/<startTime>/<endTime>', methods=['GET'])
def getReportBaseOnMission(projId, startTime, endTime):
    rt = {}
    try:
        rt = Patrol.get_patrol_report_baseon_path(projId, startTime, endTime)
    except Exception as e:
        print('getReportBaseOnMission error:' + e.__str__())
        logging.error('getReportBaseOnMission error:' + e.__str__())
    return jsonify(rt)


#获取起止时间范围内的任务报表，按巡更人员聚类
#注意已做出巡更计划，但没有响应巡更记录的情况,标记为未完成
#返回:
#data = {
#    'time': ['2016-02-02', '2016-02-03', '2016-02-04', '2016-02-05'], #精确到天
#    'data': [{
#        'userId': '22228c432621452077258003', #巡更人员ID
#        'name': '王大饼1', #巡更人员名称
#        'percent': 50, #完成百分比，由每天每个计划任务
#        'data': [0,1,0,1],
#        #数组中每个元素代表当天的完成情况，由当天所有该巡更人员的status取“逻辑与”，并与巡更计划比对得出结果 0:未完成，1:完成
#        time字段有几天就有几条数据
#    }]
#}
@bp_patrol.route('/report/getBaseOnMan/<projId>/<startTime>/<endTime>', methods=['GET'])
def getReportBaseOnMan(projId, startTime, endTime):
    rt = {}
    try:
        rt = Patrol.get_patrol_report_baseon_man(projId, startTime, endTime)
    except Exception as e:
        print('getReportBaseOnMan error:' + e.__str__())
        logging.error('getReportBaseOnMan error:' + e.__str__())
    return jsonify(data = rt)


#获取某巡更线路指定时间范围内计划完成情况
#注意已做出巡更计划，但没有响应巡更记录的情况，返回空
#返回:
#data = [{
#    'pathId': '11118c432621452077258003',
#    'executorId': '22228c432621452077258003',
#    'pathName': '路径1',
#    'executorName': '人员1',
#    'startTime': '20150201 19:00',
#    'endTime': '20150201 21:00',
#    'data': [{'巡更点1': '20150201 19:00'}, {'巡更点2': '20150201 19:30'}]
#}]
@bp_patrol.route('/log/getByPathId/<projId>/<pathId>/<startTime>/<endTime>', methods=['GET'])
def getLogByPathId(projId, pathId, startTime, endTime):
    data = [{
        'pathId': '11118c432621452077258003',
        'executorId': '22228c432621452077258003',
        'pathName': '路径1',
        'executorName': '人员1',   
        'startTime': '20150201 19:00',
        'endTime': '20150201 21:00',
        'data': [{'巡更点1': '20150201 19:00'}, {'巡更点2': '20150201 19:30'}]
    },{
        'pathId': '11118c432621452077258003',
        'executorId': '22228c432621452077258003',
        'pathName': '路径2',
        'executorName': '人员2',
        'startTime': '20150203 19:00',
        'endTime': '20150204 21:00',
        'data': [{'巡更点1': '20150201 19:00'}, {'巡更点2': '20150201 19:30'}]
    }]
    rt = []
    try:
        rt = Patrol.get_patrol_log_by_pathId(projId, pathId, startTime, endTime)
    except Exception as e:
        print('getLogByPathId error:' + e.__str__())
        logging.error('getLogByPathId error:' + e.__str__())
    return jsonify(data = rt)


#获取某巡更人员指定时间范围内计划完成情况
#注意已做出巡更计划，但没有响应巡更记录的情况，返回空
#data = [{
#    'pathId': '11118c432621452077258003',
#    'executorId': '22228c432621452077258003',
#    'pathName': '路径1',
#    'executorName': '人员1',
#    'startTime': '20150201 19:00',
#    'endTime': '20150201 21:00',
#    'data': [{'巡更点1': '20150201 19:00'}, {'巡更点2': '20150201 19:30'}]
#}]
@bp_patrol.route('/log/getByExecutorId/<projId>/<executorId>/<startTime>/<endTime>', methods=['GET'])
def getLogByExecutorId(projId, executorId, startTime, endTime):
    data = [{
        'pathId': '11118c432621452077258003',
        'executorId': '22228c432621452077258003',
        'pathName': '路径1',
        'executorName': '人员1',   
        'startTime': '20150201 19:00',
        'endTime': '20150201 21:00',
        'data': [{'巡更点1': '20150201 19:00', 'error':0, 'msg':None, 'arrPic':None}, {'巡更点2': '20150201 19:30', 'error':0, 'msg':None, 'arrPic':None}]
    },{
        'pathId': '11118c432621452077258003',
        'executorId': '22228c432621452077258003',
        'pathName': '路径2',
        'executorName': '人员2',   
        'startTime': '20150203 19:00',
        'endTime': '20150204 21:00',
        'data': [{'巡更点1': '20150201 19:00'}, {'巡更点2': '20150201 19:30'}]
    }]
    rt = []
    try:
        rt = Patrol.get_patrol_log_by_executorId(projId, executorId, startTime, endTime)
    except Exception as e:
        print('getLogByExecutorId error:' + e.__str__())
        logging.error('getLogByExecutorId error:' + e.__str__())
    return jsonify(data = rt)


#手机上传用
#批量保存历史记录
@bp_patrol.route('/log/saveMulti', methods=['POST'])
def saveLogMulti():
    arrData = request.get_json()
    #step1: postData是数组，数组中每个元素都需需要分别保存
    #_id = arrData[0].get('_id')
    planTime = arrData[0].get('planTime')
    startTime = arrData[0].get('startTime')
    endTime = arrData[0].get('endTime')
    executorId = arrData[0].get('executorId')
    state = arrData[0].get('state')
    pathId = arrData[0].get('pathId')
    path = arrData[0].get('path')          
    projId = arrData[0].get('projId')

    #step2:
    #更新point表最后巡更时间字段
    rt = []
    try:
        for data in arrData:
            executorId = Patrol.save_patrol_missionlog(data)
            for pid in data.get('path'):
                pointId = Patrol.savePoint(data.get('projId'), {'_id':pid.get('_id')})
            rt.append(executorId)
    except Exception as e:
        print('saveLogMulti error:' + e.__str__())
        logging.error('saveLogMulti error:' + e.__str__())
    return jsonify(data=rt)
