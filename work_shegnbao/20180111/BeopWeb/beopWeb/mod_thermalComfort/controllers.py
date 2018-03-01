import os, time, math, random
import logging, json, requests
from enum import Enum

from flask import jsonify, render_template, request
import imgkit

from beopWeb import app
from beopWeb.mod_thermalComfort import bp_thermalComfort
from beopWeb.mod_thermalComfort.service import ThermalComfortService
from beopWeb.models import isAllCloudPointName
from beopWeb.BEOPDataAccess import BEOPDataAccess

def format_result(is_success, msg='', data=None):
    ''' 格式化输出结果 '''
    result = None
    if is_success:
        result = {"status": 'OK'}
    else:
        result = {"status": 'ERROR'}
    if msg:
        result['msg'] = msg
    if data != None:
        result['data'] = data
    return jsonify(result)

@bp_thermalComfort.route('')
def main(strategy_id=None):
    ''' 网站入口 URL '''
    token = None
    # 从 URL 上拿到 project id
    project_id = request.args.get('projectId')
    if project_id is None:
        return '缺少项目ID'
    try:
        project_id = int(project_id)
    except ValueError as error:
        return '项目ID不合法'

    if app.config.get('URL_CHECK'):
        # 拿到 token
        token = request.cookies.get('token')
    if token:
        return render_template('mod_thermalComfort/thermalComfort.html', token=token, projId=project_id)
    else:
        return render_template('mod_thermalComfort/thermalComfort.html', projId=project_id)

# 拿到所有的配置信息
@bp_thermalComfort.route('/getConfigInfo', methods=['POST'])
def get_thermal_comfort_configInfo():
    data = []
    params = request.get_json()
    if params:
        project_id = params.get('projectId')
        data = ThermalComfortService.get_thermal_comfort_configInfo(project_id)
    return format_result(True, None, data)

@bp_thermalComfort.route('/calc/<timeAt>', methods=['GET'])
def calc_thermal_comfort(timeAt):
    rt = False
    try:
        info = ThermalComfortService.get_thermal_comfort_configInfo()
        for item in info:
            projId = item.get('_id')
            dsList = []
            entityList = item.get('entity')
            for entity in entityList:
                sensor_arr = entity.get('arrSensor')
                dsList.extend([x.get('ds') for x in sensor_arr if x.get('ds') and x.get('ds').startswith('@')])
                dsList.extend([x.get('dsSet') for x in sensor_arr if x.get('dsSet') and x.get('dsSet').startswith('@')])
            dsList = list(set(dsList))
            arrRealtime = {}
            preFilterInfo = isAllCloudPointName(dsList)
            if preFilterInfo is not None and len(preFilterInfo) >= 2:
                projIdInPoint = preFilterInfo[0]
                pointNameList = preFilterInfo[1]
                rt = BEOPDataAccess.getInstance().get_realtime_data(projIdInPoint, pointNameList)
                for d in rt:
                    pname = d.get('name')
                    pvalue = d.get('value')
                    arrRealtime.update({'@%s|%s' % (projIdInPoint, pname):pvalue})
            set_name_list = []
            set_value_list = []
            for entity in entityList:
                over_hot_count = 0
                under_cold_count = 0
                #entity_id = entity.get('id')
                prefix = entity.get('prefix')
                if prefix:
                    over_hot_name = prefix + '_overHot'
                    over_cold_name = prefix + '_underCold'
                    sensor_arr = entity.get('arrSensor')
                    for sensor in sensor_arr:
                        value_set = arrRealtime.get(sensor.get('dsSet'))
                        value_real = arrRealtime.get(sensor.get('ds'))
                        try:
                            value_set = float(value_set)
                        except Exception:
                            value_set = 23
                        upper_limit = float(value_set) + sensor.get('upper')
                        lower_limit = float(value_set) + sensor.get('lower')
                        if float(value_real) > upper_limit:
                            over_hot_count += 1
                        if float(value_real) < lower_limit:
                            under_cold_count += 1
                    set_name_list.append(over_hot_name)
                    set_name_list.append(over_cold_name)
                    set_value_list.append(over_hot_count)
                    set_value_list.append(under_cold_count)
            if set_name_list and set_value_list and len(set_name_list) == len(set_value_list):
                realRt = False
                hisRt = False
                data = {'projId':projId, 'point':set_name_list, 'value':set_value_list}
                headers = {'content-type': 'application/json'}
                rtPost = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/set_mutile_realtimedata_by_projid',
                                       headers=headers, data=json.dumps(data))
                if rtPost.status_code == 200:
                    rv = json.loads(rtPost.text)
                    if isinstance(rv, dict):
                        if rv.get('state') == 1:
                            realRt = True
                data = []
                for index in range(len(set_name_list)):
                    data.append({'projId':projId, 'pointName':set_name_list[index], 'pointValue':set_value_list[index], 'timeAt':timeAt})
                data = {'setList':data}
                rtPost = requests.post(app.config.get('BEOP_SERVICE_ADDRESS') + '/save/setHistoryDataMul',
                                       headers=headers, data=json.dumps(data))
                if rtPost.status_code == 200:
                    hisRt = True
                rt = realRt and hisRt
    except Exception as e:
        print(e)
    return json.dumps(rt, ensure_ascii=False)