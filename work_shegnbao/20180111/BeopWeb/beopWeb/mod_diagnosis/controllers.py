import os
import time
import math
import random
import base64
import logging
import json
import requests
from enum import Enum
from datetime import datetime
from beopWeb.mod_common import i18n
from beopWeb.BEOPDataAccess import BEOPDataAccess
import shutil

from flask import jsonify, render_template, request, send_from_directory
import imgkit

from beopWeb import app
from beopWeb.mod_diagnosis import bp_diagnosis
from beopWeb.mod_diagnosis.service import DiagnosisService
from beopWeb.mod_diagnosis.report_service import DiagnosisReportService
from beopWeb.mod_diagnosis.fault_service import DiagnosisFaultService
from beopWeb.mod_diagnosis.entity_fault_service import DiagnosisEntityFaultService
from beopWeb.mod_oss.ossapi import OssAPI
from beopWeb.mod_memcache.RedisManager import RedisManager
from beopWeb.mod_admin import Project
from beopWeb.mod_common.Utils import Encoder
from beopWeb.mod_diagnosis.task_service import DiagnosisTask
from beopWeb.mod_diagnosis.diagnosis_auto import DiagnosisAuto
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_diagnosis.workflow import AutoWorkflow
from beopWeb.mod_diagnosis.excel import DiagnosisExcel, DiagnosisTaskExcel


def format_result(is_success, msg='', data=None):
    """ 格式化输出结果 """
    result = None
    if is_success:
        result = {"status": 'OK'}
    else:
        result = {"status": 'ERROR'}
    if msg:
        result['msg'] = msg
    if data is not None:
        result['data'] = data
    return jsonify(result)

@bp_diagnosis.route('')
def main(strategy_id=None):
    """ 网站入口 URL """
    token = None
    # 从 URL 上拿到 project id
    project_id = request.args.get('projectId')
    if project_id is None:
        return '缺少项目ID'
    try:
        project_id = int(project_id)
    except ValueError as error:
        return '项目ID不合法'

    # 获取项目信息
    project_service = Project()
    Project.fields = Project.fields + ('data_time_zone','unit_currency','unit_system',)
    project = project_service.get_project_by_id(project_id)
    if app.config.get('URL_CHECK'):
        # 拿到 token
        token = request.cookies.get('token')
    if token:
        return render_template('mod_diagnosis/index.html', token=token, project=json.dumps(project, cls=Encoder))
    else:
        return render_template('mod_diagnosis/index.html', project=json.dumps(project, cls=Encoder))


@bp_diagnosis.route('/getEntities')
def get_entities():
    """
    获取实体列表
    request:
    {
        "projectId": 293,
        # filter 字段可选
        "filter": {
            "className": ['VAV']
        }
    }
    response:
    [{
        "id": 1,
        # 实体名称
        "name": 'L1',
        # 父实体 id，0：自己本身为顶层
        "parent": 0,
        # 实体类型，0 - Zone，1 - Equipment
        "type": 0,
        "pageId": None,
        "projectId": 293,
        # 设备类实体专属，用于标记设备的类型
        "className": None
    }]
    """
    params = request.args
    project_id = int(params.get('projectId'))
    lang = params.get('lang')
    data = DiagnosisService.get_entities(project_id, lang)
    return format_result(True, None, data)


@bp_diagnosis.route('/getEntitiesWrongQuantity')
def get_entities_wrong_quantity():
    """ 获取实体的健康率 """
    params = request.args
    project_id = int(params.get('projectId'))
    start_time = params.get('startTime')
    end_time = params.get('endTime')
    lang = params.get('lang')

    data = DiagnosisService.get_entities_wrong_quantity(project_id, start_time, end_time, lang)
    return format_result(True, None, data)


@bp_diagnosis.route('/getLastestFaults')
def get_lastest_faults():
    """
    request - GET
    {
        "projectId": 293,
        "startTime": '2017-01-01 00:00:00',
        "endTime": '2017-01-02 00:00:00'
    }
    response
    [{
        # 报警信息id
        "faultId": 1,
        # 报警信息名称
        "name": "Zone temperature setpoint too low"
    }]
    """
    params = request.args
    projectId = int(params.get('projectId'))
    startTime = params.get('startTime')
    endTime = params.get('endTime')
    entityId = params.get('entityIds', '')
    lan = params.get('lan', 'en')
    data = DiagnosisService.get_lastest_entity_faults(projectId, startTime, endTime, entityId, 20, lan)
    return format_result(True, None, data)


@bp_diagnosis.route('/getLatestFaults', methods=['POST'])
def get_latest_faults_post():
    """ 同 get_lastest_faults """
    params = request.get_json()
    projectId = int(params.get('projectId'))
    startTime = params.get('startTime')
    endTime = params.get('endTime')
    entityId = params.get('entityIds', '')
    lan = params.get('lan', 'en')
    data = DiagnosisService.get_lastest_entity_faults(projectId, startTime, endTime, entityId, 20, lan)
    return format_result(True, None, data)


@bp_diagnosis.route('/getEquipmentAvailability')
def get_equipment_availability():
    """
    获取设备的完好率
    requirement:http://192.168.1.208:8888/redmine/issues/1694
    request - GET
    {
        "projectId": 293
    }
    [{
        # 未出故障的设备
        "goodNum": 193,
        # 完好率
        "intactRate": "100.00%",
        # 设备类型
        "className": "AHU",
        # 总共的设备数目
        "totalNum": 193
    }]
    """

    params = request.args
    error = None
    gradeProjIds = [528, 539, 540, 541, 542]
    if params:
        try:
            project_id = int(params.get('projectId'))
            start_time = params.get('startTime')
            end_time = params.get('endTime')
            entityIds = params.get('entityIds')
            classNames = params.get('classNames')
            faultIds = params.get('faultIds')
            lang = params.get('lang')
            if entityIds:
                entityIds = params.get('entityIds').split(',')
            else:
                entityIds = []
            if classNames:
                classNames = params.get('classNames').split(',')
            else:
                classNames = []
            if faultIds:
                faultIds = params.get('faultIds').split(',')
            else:
                faultIds = []
            if project_id in gradeProjIds:
                data = DiagnosisService.get_grade_equipment_rate_of_health(project_id, start_time, end_time, entityIds,
                                                                           classNames, faultIds, lang)
            else:
                data = DiagnosisService.get_equipment_rate_of_health(project_id, start_time, end_time, entityIds,
                                                                     classNames , faultIds, lang)

        except Exception as e:
            print('get_equipment_availability error:' + e.__str__())
            logging.error(e.__str__())
            error = e.__str__()
    else:
        error = 'Invalid parameter'
    if error:
        return format_result(False, error)
    else:
        return format_result(True, None, data)


@bp_diagnosis.route('/getEntityFaults', methods=['POST'])
def get_entity_faults():
    """
    request - POST
    {
        "pageIndex": 0,
        "pageSize": 100,
        "projectId": 293,
        "startTime": "2017-01-01 00:00:00",
        "endTime": "2017-01-05 00:00:00",
        "entityIds": [],
        "keywords": "",
        "faultIds": [1],
        "classNames": []
    }
    response
    [{
        # 设备id
        "entityId": 3,
        # 报警信息id
        "faultId": 1,
        # notice id
        "id": 1,
        # 实体名称
        "entityName": "L1S1_VAVC1",
        # 设备所属区域名称
        "zoneName": "L1S1",
        # 报警信息
        "name": 'Zone temperature setpoint too low',
        # 报警详细描述信息
        "description": 'The zone temprature setpoint is too low,  which may lead to an uncomfortable thermal environment. Please check your room temperature setpoint',
        # 报警影响/结论
        "consequence": '',
        # 报警时间
        "time": '2017-05-16 18:36:00',
        # 报警默认级别 1：异常；2：故障
        "defaultGrade": 1,
        # 报警用户设置级别 1：异常；2：故障
        "grade": 1,
        # 报警当前所处的状态 1：发生；10：结束
        'status': 1
    }]
    """
    params = request.get_json()
    data = DiagnosisService.get_entity_faults(
        int(params.get('projectId')),
        int(params.get('pageNum', 1)),
        int(params.get('pageSize', 100)),
        params.get('startTime'),
        params.get('endTime'),
        params.get('entityIds', []),
        params.get('faultIds', []),
        params.get('classNames', []),
        params.get('keywords'),
        params.get('sort', []),
        params.get('lan', 'en')
    )
    return format_result(True, None, data)


@bp_diagnosis.route('/getEntityFaults/group', methods=['POST'])
def get_entity_faults_group():
    """
    entityFault根据某个属性聚类
    :return:
    """
    params = request.get_json()
    data = DiagnosisService.get_entity_faults(
        int(params.get('projectId')),
        int(params.get('pageNum', 1)),
        int(params.get('pageSize', 100)),
        params.get('startTime'),
        params.get('endTime'),
        params.get('entityIds', []),
        params.get('faultIds', []),
        params.get('classNames', []),
        params.get('keywords'),
        params.get('sort', []),
        params.get('lan', 'en'),
        params.get('group'),
        params.get('recursive', False)
    )
    return format_result(True, None, data)

@bp_diagnosis.route('/getEntityFaults/group/v2', methods=['POST'])
def get_entity_faults_group_v2():
    """ ＃3322
    entityFault根据某个属性聚类, 与get_entity_faults_group返回结构不同，排序不同(按最新版的排序)
    :return:
    """
    params = request.get_json()
    data = DiagnosisService.get_entity_faults_group(
        int(params.get('projectId')),
        int(params.get('pageNum', 1)),
        int(params.get('pageSize', 100)),
        params.get('startTime'),
        params.get('endTime'),
        params.get('entityIds', []),
        params.get('faultIds', []),
        params.get('classNames', []),
        params.get('keywords'),
        params.get('lan', 'en'),
        params.get('group'),
        params.get('recursive', False),
    )
    return format_result(True, None, data)

@bp_diagnosis.route('/getEntityFaults/statistics', methods=['POST'])
def get_entity_faults_statistics():
    """
    requirments:http://192.168.1.208:8888/redmine/attachments/717/%E7%97%85%E5%8E%86%E5%8D%A1%E8%AE%BE%E8%AE%A1_Abby.jpg
    :post data{
            entityIds:[931],
            projectId: int,
            lang: '',
            startTime: '', // 如果不存在的话就查询所有
            endTime: '' // 如果不存在的话就查询所有
            item: { // 需要聚类统计项目, 按设计图中可能有多种，以下仅仅是举例
            'status': {},
            'grade': {},
            'consequence': {},
            'maintainable': {},
            'faultTag': {},
            'energy':{},
            "taskStatus":{}#readmine 1983
            }
        }
    :return:
    """
    try:
        params = request.get_json()
        data = DiagnosisService.get_entity_faults_statistics(
            params.get('entityIds'),
            int(params.get('projectId')),
            params.get('lang', 'en'),
            params.get('startTime'),
            params.get('endTime'),
            params.get('item')
        )
        return format_result(True, None, data)
    except Exception as e:
        return format_result(False, None, e.__str__())


@bp_diagnosis.route('/getEntityFaultHisData')
def get_entity_fault_his_data():
    """
    request - GET
    {
        "projectId": 293,
        "faultId": 1,
        "startTime": '2017-01-01 00:00:00',
        "endTime": '2017-01-02 00:00:00',
        "timeFormat": 'h1'
    }
    response
    {
        "data": {
            "list": [],
            "timeShaft": []
        },
        "fault": [{}]
    }
    """
    params = {
        "projectId": 293,
        "faultId": 1,
        "startTime": '2017-01-01 00:00:00',
        "endTime": '2017-01-02 00:00:00',
        "timeFormat": 'h1'
    }
    return format_result(True, None, {})


@bp_diagnosis.route('/getFaults', methods=['POST'])
def get_faults():
    """
    获取报警配置信息
    request - POST
    {
        "projectId": 293,
        "entityIds": [],
        "consequence": [],
        "classNames": [],
        "startTime": '2017-01-01 00:00:00',
        "endTime": '2017-01-02 00:00:00'
    }
    response
    [{
        "grade": 2,
        "faultId": 1,
        "faultName": "流量传感器读数未变动",
        "entityId": 1,
        "entityName": "VAVC1",
        # 1：异常；2：故障
        "consequence": 0,
        # 0：禁用；1：启用
        "enable": 1
    }]
    """
    params = request.get_json()
    project_id = params.get('projectId')
    start_time = params.get('startTime')
    end_time = params.get('endTime')
    entity_ids = params.get('entityIds')
    consequence = params.get('consequence')
    class_names = params.get('classNames')
    lan = params.get('lan')
    data = DiagnosisService.get_faults(project_id, start_time, end_time, entity_ids, consequence, class_names, lan)
    return format_result(True, None, data)


@bp_diagnosis.route('/getAllFaults', methods=['POST'])
def get_all_faults():
    """
    获取报警配置信息
    request - POST
    {
        "projectId": 293,
        "pageSize": 100,
        "pageNum": 1,
        "sort":[{"key":"",order:"DESC||ASC"}]
    }
    response
    [{
        "grade": 2,
        "faultId": 1,
        "faultName": "流量传感器读数未变动",
        "entityId": 1,
        "entityName": "VAVC1",
        # 1：异常；2：故障
        "consequence": 0,
        # 0：禁用；1：启用
        "enable": 1
    }]
    """
    params = request.get_json()
    project_id = params.get('projectId')
    page_num = params.get('pageNum', 1)
    page_size = params.get('pageSize', 100)
    sort = params.get('sort', [])
    lan = params.get('lan', 'en')
    data = DiagnosisService.get_all_faults(project_id, page_num, page_size, sort, lan) 
    return format_result(True, None, data)


@bp_diagnosis.route('/addNotices', methods=['POST'])
def addNotices():
    """
    获取报警配置信息
    data =  [{
        "orderId": 0,
        "detail": "222,88",
        "energy": "0",
        "time": "2017-07-05 01:00:26",
        "faultId": 1,
        "projectId": 520,
        "status": 1,
        "project": 520,
        "entityId": 1
    }, {
        "orderId": 0,
        "detail": "222,88",
        "energy": "0",
        "time": "2017-07-05 01:00:26",
        "faultId": 1,
        "projectId": 520,
        "status": 1,
        "project": 520,
        "entityId": 1
    }]
    """

    from beopWeb.mod_diagnosis.workflow import NoAutoWorkflowConfig
    params = request.get_json()
    data = params.get('data')

    if len(data) == 0:
        return format_result(False, '无可添加数据')

    project_id = int(data[0].get('projectId'))
    for row in data:
        row.update({
            'entityId': int(row.get('entityId')),
            'faultId': int(row.get('faultId')),
            'orderId': row.get('orderId'),
            'detail': row.get('detail'),
            'time': row.get('time'),
            'energy': row.get('energy'),
            'status': row.get('status'),
            'projectId': int(project_id)
        })

    result, notice_id_list = DiagnosisService.add_notices(project_id, data)

    # rush 20180102
    try:
        if notice_id_list:
            awf = AutoWorkflow(project_id, notice_id_list)
            awf.send_workflow()
    except NoAutoWorkflowConfig:
        logging.info('No auto workflow rules configured for project %s. Skip!', project_id)
    except Exception as e:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
    return format_result(True, None, result)


@bp_diagnosis.route('/updateNoticesStatus', methods=['POST'])
def updateNoticesStatus():
    """
        更新notice表status
        {
            data:[{
                entityId,
                faultId,
            }],
            projectId
        }
    """
    params = request.get_json()
    data = params.get('data')
    if len(data) == 0:
        return format_result(False, '无可更新数据')
    project_id = int(params.get('projectId'))
    result = DiagnosisService.update_notices_status(project_id, data)
    return format_result(result, None)


@bp_diagnosis.route('/get/entityDiagnosisInfo', methods=['POST'])
def get_entity_diagnosis_info():
    """
    requirement: http://dev.rnbtech.com.hk:8888/redmine/issues/1225
    postData: projectId, startTime, endTime, language
    :return:
    """
    try:
        data = request.get_json()
        projId = data.get('projId')
        startTime = data.get('startTime')
        endTime = data.get('endTime')
        language = data.get('language', 'zh')
        if not projId or not startTime or not endTime:
            raise Exception('projId, startTime, endTime is necessary')
        data = DiagnosisService.get_entity_diagnosis_info(projId, startTime, endTime, language)
        if data:
            return format_result(True, data=data)
    except Exception as e:
        print('get_entity_diagnosis_info error:' + e.__str__())
        return format_result(False, e.__str__())
    return format_result(False)


@bp_diagnosis.route('/getGroupByEquipment', methods=['POST'])
def get_groupby_equipment():
    """ 设备聚类 """
    params = request.get_json()
    data = DiagnosisService.get_groupby_equipment(
        int(params.get('projectId')),
        int(params.get('pageNum', 1)),
        int(params.get('pageSize', 100)),
        params.get('startTime'),
        params.get('endTime'),
        params.get('entityIds', []),
        params.get('faultIds', []),
        params.get('classNames', []),
        params.get('keywords'),
        params.get('sort',[]),
        params.get('entityNames',[]),
        params.get('lang')
    )
    return format_result(True, None, data)


@bp_diagnosis.route('/getRoiInfo', methods=['POST'])
def get_roi_info():
    """ 拿到roi的信息 """
    params = request.get_json()
    data = DiagnosisService.get_roi_info(
        int(params.get('projectId')),
        int(params.get('pageNum', 1)),
        int(params.get('pageSize', 100)),
        params.get('startTime'),
        params.get('endTime'),
        params.get('entityIds', []),
        params.get('faultIds', []),
        params.get('classNames', []),
        params.get('keywords'),
        params.get('sort',[]),
        params.get('lan','en')
    )
    return format_result(True, None, data)


@bp_diagnosis.route('/saveRoiInfo', methods=['POST'])
def save_roi_info():
    """ 拿到roi的信息 """
    params = request.get_json()
    data = DiagnosisService.save_roi_info(
        int(params.get('projectId')),
        params.get('arrData')
    )
    return format_result(True, None, data)


@bp_diagnosis.route('/getFaultInfoByConsequence', methods=['GET'])
def get_fault_info_by_consequence():
    """
    获取报警修复信息，按照 consequence 分组
    request - GET
    {
        "projectId": 293,
        "startTime": '2017-01-01 00:00:00',
        "endTime": '2017-01-02 00:00:00'
    }
    response
    [{
        "consequence": 'Energy waste',
        "processed": 18,
        "total": 40
    }, {
        "consequence": 'Comfort issue',
        "processed": 6,
        "total": 20
    }, {
        "consequence": 'Equipment Health',
        "processed": 6,
        "total": 12
    }, {
        "consequence": 'Other',
        "processed": 20,
        "total": 28
    }]
    """
    params = request.args
    projectId = params.get('projectId')
    startTime = params.get('startTime')
    endTime = params.get('endTime')
    lang = params.get('lang')

    if params.get('entityIds'):
        entityIds = params.get('entityIds').split(',')
    else:
        entityIds = []
    if params.get('classNames'):
        classNames = params.get('classNames').split(',')
    else:
        classNames = []    
    if params.get('faultIds'):
        faultIds = params.get('faultIds').split(',')
    else:
        faultIds = []       
    data = DiagnosisService.get_fault_info_by_consequence(
        projectId,
        startTime,
        endTime,
        entityIds,
        classNames,
        faultIds,
        lang
    )
    return format_result(True, None, data)


@bp_diagnosis.route('/getPriorityFaults', methods=['GET'])
def get_priority_faults():
    """
    获取最新的 N 条 faults
    request - GET
    {
        "projectId": 293,
        "startTime": '2017-01-01 00:00:00',
        "endTime": '2017-01-02 00:00:00',
        # 可选
        "size": 20
    }
    response
    [{
        'name': 'PCHWP-3 frequency control fault',
        'entityNames': 'Chilled water Plant',
        'time': '2017-06-22 20:46:00'
        'consequence': '',
        'entityId': 1,
        'faultId': 2
    }]
    """
    params = request.args
    if params.get('entityIds'):
        entityIds = params.get('entityIds').split(',')
    else:
        entityIds = []  
    if params.get('classNames'):
        classNames = params.get('classNames').split(',')
    else:
        classNames = []    
    if params.get('faultIds'):
        faultIds = params.get('faultIds').split(',')
    else:
        faultIds = []           
    data = DiagnosisService.get_priority_faults(
        int(params.get('projectId')),
        params.get('startTime'),
        params.get('endTime'),
        params.get('size'),
        entityIds,
        classNames,
        faultIds,
        params.get('lan', 'en')
    )
    return format_result(True, None, data)


@bp_diagnosis.route('/getFaultsByIds', methods=['POST'])
def get_faults_by_ids():
    """
    request - POST
    {
        "ids": [],
        "lang": 'zh'|'en',
    }
    response
    [
        {
            id:2191,
            name:"Chiller status is not matched with its power",
            description:"Chiller Status is not matched with its power. please check the operating date."
        }
    ]
    """
    params = request.get_json()
    ids = params.get('ids')
    lang = params.get('lang')
    data = DiagnosisService.get_faults_by_ids(ids, lang)
    return format_result(True, None, data)

@bp_diagnosis.route('/getNoticeDetails', methods=['POST'])
def get_notice_details():
    """
    request - POST
    {
        projectId,
        faults:[{id,entityId,startTime,endTime}],
    }
    response
    [
        {
            id,
            faultId,
            entityId,
            detail
        }
    ]
    """
    params = request.get_json()
    projectId = params.get('projectId')
    faults = params.get('faults')
    data = DiagnosisService.get_notice_details(projectId, faults)
    return format_result(True, None, data)


@bp_diagnosis.route('/getFaultsInfoAndPoints', methods=['POST'])
def get_faults_info_and_points():
    """
    request - POST
    {
        "id": 111,
        "entityIds": []
        "projectId": 293,
        "startTime": '2017-01-01 00:00:00',
        "endTime": '2017-01-02 00:00:00',
    }
    response
    [
        {
            entityId:1020,
            faultId:772,
            occueTimes: 5,
            energy: 100,
            duration: '',
            times: [],
            points:[
                {
                    description:"AmperRatio(%)",
                    name:"L29_Chiller3_LoadPCT"
                },
                {
                    description:"ChPower(kW)",
                    name:"L29_Chiller3_LoadkW"
                }
            ]
        }
    ]
    """
    params = request.get_json()
    projectId = params.get('projectId')
    id = params.get('id')
    entityIds = params.get('entityIds')
    startTime = params.get('startTime')
    endTime = params.get('endTime')
    searchTime = params.get('searchTime')
    lang = params.get('lang')
    data = DiagnosisService.get_faults_info_and_points(projectId, id, entityIds, startTime, endTime, searchTime, lang)
    return format_result(True, None, data)


@bp_diagnosis.route('/captureImage', methods=['POST'])
def capture_image():
    params = request.get_json()
    html = params.get('html')
    img_name = str(math.floor(time.time()*math.pow(10, 6))) + str(math.floor(random.random()*999))
    img_folder = 'beopWeb/static/images/diagnosisCapture/'
    img_path = img_folder + img_name + '.png'

    if not os.path.exists(img_folder):
        return format_result(False, '临时目录不存在！')

    if os.path.exists(img_path):
        return format_result(True, None, {'url': img_path})

    options = {
        'format': 'jpg',
        'quality': 92
    }

    user_options = params.get('options', {})
    options.update(user_options)

    css = [
        'beopWeb/static/scripts/lib/bootstrap/css/bootstrap.min.css',
        'beopWeb/static/app/Diagnosis/themes/default/css/print.css',
        'beopWeb/static/app/Diagnosis/themes/default/css/overview.css'
    ]
    imgkit.from_string(html, img_path, options=options, css=css)
    return format_result(True, None, {'url': img_path})


@bp_diagnosis.route('/getInfoByDimensionality', methods=['GET'])
def get_info_by_dimensionality():
    """
    根据不同的维度获取数据
    request - GET
    {
        "projectId": 293,
        "startTime": '2017-01-01 00:00:00',
        "endTime": '2017-01-02 00:00:00',
        "x": 'time',
        "y": 'equipments',
        "z": 'numberOfFaults'
    }
    response
    [{
        'x': '2017-06-01',
        # 具体根据维度决定
        'y': 10|'AHU',
        # 具体根据维度决定
        'z': 20
    }]
    """
    params = request.args
    project_id = int(params.get('projectId'))#293
    start_time = params.get('startTime')#'2017-06-01 00:00:00'
    end_time = params.get('endTime')#'2017-06-21 00:00:00'
    x = params.get('x', 'time')
    y = params.get('y', 'equipments')
    z = params.get('z', 'numberOfFaults')
    entityIds = params.get('entityIds')
    classNames = params.get('classNames')
    faultIds = params.get('faultIds')
    lang = params.get('lang')

    if entityIds:
        entityIds = params.get('entityIds').split(',')
    else:
        entityIds = [] 
    if classNames:
        classNames = params.get('classNames').split(',')
    else:
        classNames = []    
    if faultIds:
        faultIds = params.get('faultIds').split(',')
    else:
        faultIds = []
    if x != 'time':
        return []

    data = []
    if y == 'equipments':
        if z == 'numberOfFaults':
            data = DiagnosisService.get_info_by_time_equipment_numberoffaults(
                project_id, start_time, end_time, entityIds, classNames, faultIds, lang)
        elif z == 'energy':
            data = DiagnosisService.get_info_by_time_equipment_energy(
                project_id, start_time, end_time, entityIds, classNames, faultIds, lang)
    elif y == 'consequence':
        if z == 'numberOfFaults':
            data = DiagnosisService.get_info_by_time_consequence_numberoffaults(
                project_id, start_time, end_time, entityIds, classNames, faultIds, lang)
        elif z == 'energy':
            data = DiagnosisService.get_info_by_time_consequence_energy(
                project_id, start_time, end_time, entityIds, classNames, faultIds, lang)

    return format_result(True, None, data)


@bp_diagnosis.route('/getEnergySavingPotentialInfo', methods=['GET'])
def get_energy_saving_potential_info():
    """
    获取页面节能潜力相关数据
    request - POST
    {
        "projectId": 293,
        "startTime": '2017-01-01 00:00:00',
        "endTime": '2017-01-02 00:00:00'
    }
    response
    [{
        "total": 100,
        "processed": 80,
        "energyList": [{
            "time": '2017-06-01',
            "energy": 321
        }]
    }]
    """
    params = request.args
    project_id = int(params.get('projectId'))#293
    start_time = params.get('startTime')#'2017-06-01 00:00:00'
    end_time = params.get('endTime')#'2017-06-21 00:00:00'
    entityIds = params.get('entityIds')
    classNames = params.get('classNames')
    faultIds = params.get('faultIds')
    lang = params.get('lang')

    if entityIds:
        entityIds = params.get('entityIds').split(',')
    else:
        entityIds = []
    if classNames:
        classNames = params.get('classNames').split(',')
    else:
        classNames = []
    if faultIds:
        faultIds = params.get('faultIds').split(',')
    else:
        faultIds = []

    data = {}
    # result = DiagnosisService.get_faults_count_by_processstatus(
    #             project_id, start_time, end_time, entityIds, classNames, faultIds)
    # data['total'] = result.get('total')
    # data['processed'] = result.get('processed')
    result = DiagnosisService.get_faults_by_fault_type(
                project_id, start_time, end_time, entityIds, classNames, faultIds, lang)
    data['faults'] = result         

    result = DiagnosisService.get_energy_by_day(
                project_id, start_time, end_time, entityIds, classNames, faultIds, lang)
    data['energyList'] = result

    return format_result(True, 'Success', data)


@bp_diagnosis.route('/getWorkOrderInfo', methods=['post'])
def get_workOrder_info():
    """
    设备聚类
    request - GET
    {
        "projectId": 293,
        "entityIds": [],
        "faultIds": []
    }
    response
    [{
        'entityid': 1,
        'faultId': 2,
        'entityName': "AHU",
        "entityParentName": entity_id_name_map.get(item[3], 'Not Found'),
        'faultName': Chiller status is not matched with its power,
        'description': "Chiller Status is not matched with its power. please check the operating date.",
        'points': [
                {
                    description:"AmperRatio(%)",
                    name:"L29_Chiller3_LoadPCT"
                },
                {
                    description:"ChPower(kW)",
                    name:"L29_Chiller3_LoadkW"
                }
            ]
    }]
    """
    params = request.get_json()
    data = DiagnosisService.get_workOrder_info(
        int(params.get('projectId')),
        params.get('ids', []),
        params.get('lang')
    )
    return format_result(True, None, data)


@bp_diagnosis.route('/saveDiagnosisCapture', methods=['POST'])
def save_diagnosis_capture():
    """
    保存图片到本地
    request = POST
    {
        images: ['base64']
    }
    """
    params = request.get_json()
    images = params.get('images')
    img_folder = 'beopWeb/static/images/diagnosisCapture'
    img_folder2 = 'BeopWeb/BeopWeb/static/images/diagnosisCapture' #调试模式
    if not os.path.exists(img_folder):
        if not os.path.exists(img_folder2):
            return format_result(False, '临时目录不存在！')
        else:
            img_folder = img_folder2
    data = []
    fils = []
    paths = []
    names = []
    for img in images: 
        missing_padding = 4 - len(img) % 4
        if missing_padding:
            img += ('=' * missing_padding)
        imgdata=base64.b64decode(img)  
        img_name = str(math.floor(time.time()*math.pow(10, 6))) + str(math.floor(random.random()*999))
        img_path = img_folder + '/' + img_name + '.jpeg'
        file=open(img_path,'wb')  
        file.write(imgdata)  
        file.close()
        fils.append(file)
        paths.append(img_path)
        names.append(img_name)
    for fp in fils:
        index = fils.index(fp)
        path = paths[index]
        name = names[index]
        oss = OssAPI('oss.aliyuncs.com', 'iIDKdO6hyMbZVYzp', 'YFiyioy9kgizMChIfHMWtVvNnvsjVM')
        uploadpath = 'static/images/diagnosisCapture/' + name + '.jpeg'
        uploadtooss = oss.put_object_from_file('beopweb', uploadpath, path)
        if uploadtooss.status == 200:
            data.append({'url': 'http://images.rnbtech.com.hk/'+uploadpath})
        os.remove(path)

    return format_result(True, None, data)


@bp_diagnosis.route('/deleteDiagnosisCapture', methods=['POST'])
def delete_diagnosis_capture():
    """
    删除截图
    request = POST
    {
        urls: ['url']
    }
    """
    params = request.get_json()
    urls = params.get('urls')
    data = []
    for url in urls:
        oss = OssAPI('oss.aliyuncs.com', 'iIDKdO6hyMbZVYzp', 'YFiyioy9kgizMChIfHMWtVvNnvsjVM')
        res = oss.delete_object('beopweb', url.replace('http://images.rnbtech.com.hk/',''))
        if res.status == 204:
            data.append(True)
        else:
            data.append(False)
        
    return format_result(True, None, data)


@bp_diagnosis.route('/setFeedback', methods=['POST'])
def set_feedback():
    """
    新增或者更新feedback
    request = POST
    {
        其中一条或多条
        _id: ObjectId(),
        name: '标题',
        summary: '总结',
        expected_time: '期望解决时间',
        option:{
            images: ['urls','url2'],
        },
        level: 1,
        owen: '提出者',
        time: '提出时间',
        condition: '筛选条件方便定位',
        status: '状态',
        handle_person: '处理人',
        handle_time: '处理时间',
        reason: '原因',
        projectId : 293,
        type: 'overview|history|spectrum|roi'
    }
    """
    params = request.get_json()
    option = params.get('option')
    feedback_type = params.get('type')
    owen = str(params.get('owen'))
    if feedback_type == 'overview' and 'images' in option:
        urls = option.get('images',[])
        img_folder = 'beopWeb/static/images/diagnosisCapture'
        img_folder2 = 'BeopWeb/BeopWeb/static/images/diagnosisCapture' #调试模式
        if not os.path.exists(img_folder):
            if not os.path.exists(img_folder2):
                return {"state": False}
            else:
                img_folder = img_folder2
        images = []
        for url in urls:
            real_url = url.replace('http://images.rnbtech.com.hk/','')
            img_name = str(math.floor(time.time()*math.pow(10, 6))) + str(math.floor(random.random()*999)) + '_' + owen
            img_path = img_folder + '/' + img_name + '.jpeg'
            oss = OssAPI('oss.aliyuncs.com', 'iIDKdO6hyMbZVYzp', 'YFiyioy9kgizMChIfHMWtVvNnvsjVM')
            res1 = oss.get_object_to_file('beopweb', real_url, img_path)
            uploadpath = 'static/images/diagnosisCaptureHistory/' + img_name + '.jpeg'
            uploadtooss = oss.put_object_from_file('beopweb', uploadpath, img_path)
            if uploadtooss.status == 200:
                images.append('http://images.rnbtech.com.hk/'+uploadpath)
                oss.delete_object('beopweb', real_url, '')
            else:
                images.append(url)
            os.remove(img_path)
        params.get('option').update({'images':images})
    data = DiagnosisService.set_feedback(params)
    return format_result(data.get('state'), None)


@bp_diagnosis.route('/getFeedback', methods=['POST'])
def get_feedback():
    """
    获取feedback
    request = POST
    {
        owen: '提出者',
        startTime: '',
        endTime: ''
    }
    response
    [{
        _id: ObjectId(),
        name: '标题',
        summary: '总结',
        expected_time: '期望解决时间',
        images: ['urls','url2'],
        level: 1,
        owen: '提出人id',
        time: '提出时间',
        condition: '筛选条件方便定位',
        status: '状态',
        handle_person: '处理人id',
        handle_time: '处理时间',
        reason: '原因',
        projectId : 293,
    }]
    """
    params = request.get_json()
    data = DiagnosisService.get_feedback(params)
    return format_result(True, None, data)


@bp_diagnosis.route('/changeFaultEnable', methods=['POST'])
def change_fault_enable():
    """
    改变启停状态
    request = POST
    {
        faultIds: [],
        entityIds: [],
        enable: 0
    }
    response
    []
    """
    params = request.get_json()
    faultIds = params.get('faultIds')
    entityIds = params.get('entityIds')
    enable = params.get('enable')
    status = DiagnosisFaultService.change_fault_enable(faultIds, entityIds, enable)
    return format_result(status, None)


@bp_diagnosis.route('/pushMailApp', methods=['POST'])
def mail_app_push():
    """
    邮件、App推送
    request = POST
    {
        startTime: '',
        endTime: '',
        projectId: '',
        lan: 'zh|en'
    }
    response
    {
        fault: [{
            name: '',
            count: num,
            averageTime: ''
        }],
        building: [{
            name: '',
            count: num
        }]
    }
    """
    params = request.get_json()
    faultIds = params.get('faultIds')
    entityIds = params.get('entityIds')
    userIds = params.get('userIds')
    projId = str(params.get('projId'))
    type = str(params.get('type'))
    status = DiagnosisFaultService.mail_app_push(faultIds, entityIds, userIds, projId, type)
    return format_result(status, None)


# 获取故障推送的类型（邮件 or app or 未推送）
@bp_diagnosis.route('/pushType', methods=['POST'])
def push_type():
    params = request.get_json()
    faultId = params.get('faultId')
    entityId = params.get('entityId')
    projId = str(params.get('projId'))
    status = DiagnosisFaultService.push_type(faultId, entityId, projId)
    return jsonify({'data':status})


@bp_diagnosis.route('/getReportTemplateSummary', methods=['POST'])
def get_report_template_summary():
    params = request.get_json()
    projectId = int(params.get('projectId'))
    startTime = params.get('startTime')
    endTime = params.get('endTime')
    lan = params.get('lan', 'zh')
    condition = params.get('condition', {})
    if params.get('useNewDiagnosis', 1) == 1:
        data = DiagnosisReportService.get_report_template_summary(projectId, startTime, endTime, lan, condition)
    else:
        data = DiagnosisReportService.get_report_template_summary_old(projectId, startTime, endTime, lan, condition)
    return format_result(True, None, data)


@bp_diagnosis.route('/getReportTemplateContent', methods=['POST'])
def get_report_template_content():
    """
    request = POST
    {
        startTime: '',
        endTime: '',
        projectId: '',
        lan: 'zh|en'
    }
    response
    [{
        entityType: '',
        units: [
            {
                faultName: '',
                time: '',
                endTime: '',
                entity: [{
                    name: '',
                    advince: '',
                }],
                points:[{
                    name: '',
                    description: '',
                    set: 0|1
                }],
                title: '',
                axis: [{name: ''}]
            }
        ]
    }]
    """
    params = request.get_json()
    projectId = int(params.get('projectId'))
    startTime = params.get('startTime')
    endTime = params.get('endTime')
    lan = params.get('lan', 'zh')
    condition = params.get('condition', {})
    if params.get('useNewDiagnosis', 1) == 1:
        data = DiagnosisReportService.get_report_template_content(\
            projectId, startTime, endTime, lan,condition)
    else:
        data = DiagnosisReportService.get_report_template_content_old(\
            projectId, startTime, endTime, lan,condition)
    return format_result(True, None, data)


@bp_diagnosis.route('/getReportTemplateAppendix', methods=['POST'])
def get_report_template_appendix():
    """
    request = POST
    {
        startTime: '',
        endTime: '',
        projectId: '',
        lan: 'zh|en'
    }
    response
    [{
        faultName: '',
        buildings: [{
            subbuilding: '',
            equiplist: []
        }]
    }]
    """
    params = request.get_json()
    projectId = int(params.get('projectId'))
    startTime = params.get('startTime')
    endTime = params.get('endTime')
    lan = params.get('lan', 'zh')
    condition = params.get('condition', {})
    if params.get('useNewDiagnosis', 1) == 1:
        data = DiagnosisReportService.get_report_template_appendix(
            projectId, startTime, endTime, lan, condition)
    else:
        data = DiagnosisReportService.get_report_template_appendix_old(
            projectId, startTime, endTime, lan, condition)
    return format_result(True, None, data)


@bp_diagnosis.route('/getFaultsInfo', methods=['POST'])
def get_faults_infos():
    """
    request - POST
    {
        "pageNum": 0,
        "pageSize": 100,
        "grades": [],
        "consequences": [],
        "keywords": '',
        "classNames": [],
        "sort": [],
        "lan": 'zh|en',
        "ids": []
    }
    response
    {
        data:[{
            'id': ,
            'name': ,
            'lastModifyUser': ,
            'lastModifyTime':
        }],
        total:num
    }
    """
    params = request.get_json()
    data = DiagnosisFaultService.get_faults_infos(
        int(params.get('pageNum', 1)),
        int(params.get('pageSize', 100)),
        params.get('grades', []),
        params.get('consequences', []),
        params.get('classNames', []),
        params.get('keywords',''),
        params.get('sort', []),
        params.get('lan', 'en'),
        params.get('ids', []),
    )
    return format_result(True, None, data)

@bp_diagnosis.route('/getFaultsInfoV2', methods=['POST'])
def get_faults_infos_v2():
    """
    request - POST
    {
        "pageNum": 0,
        "pageSize": 100,
        "grades": [],
        "consequences": [],
        "keywords": '',
        "classNames": [],
        "sort": [],
        "lan": 'zh|en',
        "ids": [],
        "searchType": ''
    }
    response
    {
        data:[{
            'id': ,
            'name': ,
            'lastModifyUser': ,
            'lastModifyTime':
        }],
        total:num
    }
    """
    params = request.get_json()
    data = DiagnosisFaultService.get_faults_infos_v2(
        int(params.get('pageNum', 1)),
        int(params.get('pageSize', 100)),
        params.get('grades', []),
        params.get('consequences', []),
        params.get('classNames', []),
        params.get('keywords',''),
        params.get('sort', []),
        params.get('lan', 'en'),
        params.get('ids', []),
        params.get('searchType', '')
    )
    return format_result(True, None, data)

@bp_diagnosis.route('/getFaultsNameByIds', methods=['POST'])
def get_faults_name_by_ids():
    """
    request - POST
    {
        faultIds: [],
        lan: 'zh'|'en'
    }
    response
    [faultNames]
    """
    params = request.get_json()
    ids = params.get('ids')
    lan = params.get('lan')
    data = DiagnosisFaultService.get_faults_name_by_ids(ids, lan)
    return format_result(True, None, data)


@bp_diagnosis.route('/getFaultsClassNames/<lan>')
def get_faults_class_names(lan='en'):
    """
    request - GET
    response
    [classNames]
    """
    faultManageItems = RedisManager.get('strategyFaultManageItems')
    if faultManageItems:
        return format_result(True, None, faultManageItems)
    else:
        params = request.args
        data = DiagnosisFaultService.get_faults_class_names(lan)
    return format_result(True, None, data)

@bp_diagnosis.route('/getFaultsClassNamesByIds/<lan>', methods=['POST'])
def get_faults_class_names_by_ids(lan='en'):
    """
    request - GET
    response
    [classNames]
    """
    params = request.get_json()
    ids = params.get('ids')
    data = DiagnosisFaultService.get_faults_class_names_by_ids(lan, ids)
    return format_result(True, None, data)

@bp_diagnosis.route('/addNewFault', methods=['POST'])
def add_new_fault():
    """
    request post
    {
        name:'',
        description:'',
        grade:'',
        faultType:'',
        faultGroup:'',
        runMode:'',
        consequence:'',
        chartTitle:'',
        className:'',
        maintainable:'',
        isPublic: 2
    }
    response
     success
    """
    params = request.get_json()
    data = DiagnosisFaultService.add_new_fault(
        params.get('name'),
        params.get('description'),
        params.get('grade'),
        params.get('faultType'),
        params.get('faultGroup'),
        params.get('runMode'),
        params.get('consequence'),
        params.get('chartTitle'),
        params.get('className'),
        params.get('maintainable'),
        params.get('isPublic'),
        params.get('lastModifyUser'),
        params.get('lastModifyTime'),
        params.get('suggestion')
    )
    return format_result(True, None, data)


@bp_diagnosis.route('/deleteFault', methods=['POST'])
def delete_fault():
    """
    request
       {
           id:''
       }
    response
       success
    """
    params = request.get_json()
    data = DiagnosisFaultService.delete_fault(
        params.get('id')
    )
    return format_result(True, None, data)


@bp_diagnosis.route('/syncEntityFaultTable', methods=['POST'])
def sync_entity_fault_table():
    """
    request
      {
        efIds: {
            '${entityId}': ['${faultId}', '${faultId}', /*...*/]
        },
        faultData: {
            '${faultId}': {
                'points': [],
                'targetGroup': '',
                'targetExecutor': '',
                'customTag': '',
                'runDay': '',
                'runWeek': '',
                'runMonth': '',
                'runYear': '',
                'unit': '',
                'axisName': '',
                'axisSet': ''
            }
        },
        strategyId: '',
        projectId: '',
        userId: ''
    }
    """
    data = request.get_json()

    strategy_id = data.get('strategyId')
    fault_data_map = data.get('faultData')
    project_id = data.get('projectId')
    user_id = data.get('userId')
    efids_map = data.get('efIds')

    exists_efid_list = DiagnosisEntityFaultService.get_entity_fault_by_strategyid(strategy_id)
    exists_efid_tuple_list = [(item.get('entityId'), item.get('faultId')) for item in exists_efid_list]

    sync_data = []
    lastest_efid_tuple_list = []
    for entity_id, fault_ids in efids_map.items():
        lastest_efid_tuple_list = lastest_efid_tuple_list + [(int(entity_id), fault_id) for fault_id in fault_ids]
        for fault_id in fault_ids:
            fault_data = fault_data_map.get(str(fault_id))
            if not fault_data:
                return format_result(False, '请求参数有误，未找到 faultId 为 %s 的数据' % fault_id)
            points = fault_data.get('points', {})
            axisSet = fault_data.get('axisSet', {})
            axisName = fault_data.get('axisName', {})
            fault_data = fault_data.copy()
            fault_data.update({
                'strategyId': strategy_id,
                'entityId': entity_id,
                'faultId': fault_id,
                'userId': user_id,
                'projectId': project_id,
                'points': points.get(entity_id, ''),
                'axisSet': axisSet.get(entity_id, ''),
                'axisName': axisName.get(entity_id, '')
            })
            sync_data.append(fault_data)

    # 筛选出需要删除的 entity_fault，即：数据库中存在，最新的数据中不存在
    ef_tuples_need_tobe_deleted = set(exists_efid_tuple_list) - set(lastest_efid_tuple_list)
    if len(ef_tuples_need_tobe_deleted) > 0:
        result = DiagnosisEntityFaultService.delete_entity_fault_by_ids(ef_tuples_need_tobe_deleted)
        if not result:
            return format_result(False, '删除 entity fault 记录时失败')

    # 执行插入和更新操作
    if len(sync_data) > 0:
        result = DiagnosisEntityFaultService.sync_entity_fault_table(sync_data)
        if not result:
            # TODO 事务回滚
            return format_result(False, '插入/更新 entity fault 记录时失败')
    return format_result(True, '同步 entity fault 表成功')


@bp_diagnosis.route('/getFaultsInfosByIds', methods=['POST'])
def get_faults_all_by_ids():
    """
    request - POST
    {
        "ids": [],
        "lan": 'zh'|'en',
    }
    response
    [
        faluts
    ]
    """
    params = request.get_json()
    ids = params.get('ids')
    lan = params.get('lan')
    data = DiagnosisFaultService.get_faults_all_by_ids(ids, lan)
    return format_result(True, None, data)


@bp_diagnosis.route('/getFaultReportGroupByGroup', methods=['POST'])
@bp_diagnosis.route('/getFaultReportGroupByGroup/<type>', methods=['POST'])
def get_faultReport_group_by_group_new(type=None):
    """
    request - POST
    {
        "projId": 528,
        "startTime": '',
        "endTime":'',
        "lan":'zh|en'
    }
    response
    [
        data:[]
    ]
    """
    post_data = request.get_json()
    projId = post_data.get('projId')
    startTime = post_data.get('startTime')
    endTime = post_data.get('endTime')
    lan = post_data.get('lan', 'en')
    data = DiagnosisReportService.get_faultReport_group_by_group_new(projId, startTime, endTime, lan)
    return format_result(True, None, data)


@bp_diagnosis.route('/notice/getRank/<projectId>', methods=['POST'])
@bp_diagnosis.route('/notice/getRank/<projectId>/<needDetail>', methods=['POST'])
def getDiagnosisNoticeRank(projectId, needDetail=False):
    """
    request - POST
    {
        "arrConsquence": [],
        "startTime": '',
        "endTime":'',
        "lan":'zh|en'
    }
    response
    [
        data:[]
    ]
    """
    post_data = request.get_json()
    arrConsquence = post_data.get('arrConsquence')
    startTime = post_data.get('startTime')
    endTime = post_data.get('endTime')
    lan = post_data.get('lan', 'en')
    isNeedDetail = needDetail == str(True)
    data = DiagnosisReportService.getDiagnosisNoticeRank(projectId, isNeedDetail, arrConsquence, startTime, endTime, lan)
    return format_result(True, None, data)


@bp_diagnosis.route('/getFaultDetails', methods=['POST'])
def get_faultDetails():
    """
    request - POST
    {
        "projId": 528,
        "startTime": '',
        "endTime":'',
        "lan":'zh|en',
        "value":'',
        "type":''
    }
    response
    [
        data:[]
    ]
    """
    post_data = request.get_json()
    value = post_data.get('value')
    type = post_data.get('type')  # fault/workhours/equipment/zone
    startTime = post_data.get('startTime')
    endTime = post_data.get('endTime')
    projId = post_data.get('projId')
    lan = post_data.get('lan', 'en')
    data = DiagnosisReportService.get_faultDetails(value, type, startTime, endTime, projId, lan)
    return format_result(True, None, data)


@bp_diagnosis.route('/addTasks/<int:project_id>', methods=['POST'])
def add_tasks(project_id):
    """
    post data:
    {
        "lang": <str>,
        "operatorId": <int>,
        data: [{
        "entityId": <int>,
        "faultId": <int>,
        "noticeId": <int>
        },
        ... ]
    }
    """
    post_data = request.get_json()
    task_list = post_data.get('data')
    lang = post_data.get('lang', 'en')
    operator_id = post_data.get('operatorId')
    is_success = True
    msg = "add success"
    rv = None
    try:
        duplicated_id_list = DiagnosisTask.add_tasks(project_id, operator_id, task_list, lang)
        if len(duplicated_id_list) == len(task_list):
            is_success = False
            msg = 'ERROR_All_NOTICE_DUPLICATED'
    except Exception as e:
        is_success = False
        msg = 'ERROR_UNKNOWN'
    return format_result(is_success, msg, data={'duplicated_id': duplicated_id_list})


@bp_diagnosis.route('/removeTasks/<int:project_id>', methods=['POST'])
def remove_tasks(project_id):
    """
    # post data:
    # {
    #     "ids": [<task_id>, ……]
    # }
    """
    post_data = request.get_json()
    task_id_list = post_data.get('ids')
    is_success = True
    msg = "删除成功"
    try:
        rv = DiagnosisTask.remove_tasks(project_id, task_id_list)
    except Exception as e:
        is_success = False
        msg = "添加失败"
    return format_result(is_success, msg)


@bp_diagnosis.route('/getTasks/<int:project_id>', methods=['POST'])
def get_tasks(project_id):
    """
    # post data:
    # {
    #     "pageNum": <int>,
    #     "pageSize": <int>,
    #     "searchText": <str>,
    #     "sort": [{
    #         "key": <str>,
    #         "order": "DESC" or "ASC"
    #     }
    #     ……
    #     ],
    #     "filter": [{
    #         "key": <str>,
    #         "value": <list>
    #     },
    #     ……
    #     ]
    # }
    """
    post_data = request.get_json()
    is_success = True
    msg = "查询成功"
    rv = None
    try:
        rv = DiagnosisTask.get_tasks(project_id, post_data)
    except Exception as e:
        is_success = False
        msg = "查询失败"
    return format_result(is_success, msg, data=rv)

@bp_diagnosis.route('/getTaskDetail/<int:task_id>', methods=['GET'])
def get_task_detail(task_id):
    is_success = True
    msg = "查询成功"
    rv = None
    try:
        rv = DiagnosisTask.get_task_detail(task_id)
    except Exception as e:
        is_success = False
        msg = "查询失败"
    return format_result(is_success, msg, data=rv)

@bp_diagnosis.route('/updateTask/<int:task_id>', methods=['POST'])
def update_task(task_id):
    '''
    post_data:
    {
        "operatorId": <int>,
        "comment": <str>,
        "data": {
            [note][priority][status][workTaskId]: <var>,
            ......
        }
    }
    '''
    post_data = request.get_json()
    is_updated = DiagnosisTask.update_task(task_id, post_data)
    try:
        if is_updated:
            is_success = True
            msg = "更新成功"
        else:
            is_success = False
            msg = "更新失败"
    except Exception as e:
        is_success = False
        msg = "更新失败"
    return format_result(is_success, msg)


@bp_diagnosis.route('/getDiagnosisPrediction/<int:project_id>', methods=['GET'])
def get_diagnosis_prediction(project_id):
    is_success = True
    data = {}
    msg = ''
    try:
        data = DiagnosisAuto.get_diagnosis_prediction(project_id)
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        msg = '500 internal error'
        is_success = False
    return format_result(is_success, msg=msg, data=data)


@bp_diagnosis.route('/setDiagnosisPrediction/<int:project_id>', methods=['POST'])
def set_diagnosis_prediction(project_id):
    """
    post_data = {
        "diagnosisPrediction": <bool>
    }
    """
    post_data = request.get_json()
    diagnosis_prediction = post_data.get('diagnosisPrediction')
    is_success = True
    msg = ''
    if diagnosis_prediction is None:
        is_success = False
        msg = 'Please input diagnosis prediction value'
        return format_result(is_success, msg=msg)
    if not isinstance(diagnosis_prediction, bool):
        is_success = False
        msg = 'Please input bool value'
        return format_result(is_success, msg=msg)
    try:
        DiagnosisAuto.set_diagnosis_prediction(project_id, diagnosis_prediction)
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        is_success = False
        msg = '500 internal error'
    return format_result(is_success, msg=msg)


@bp_diagnosis.route('/getNoticeLastTime/<int:project_id>', methods=['POST'])
def get_notice_last_time(project_id):
    """
    post_data = {
        "start": <timestamp>,
        "end": <timestamp>
    }
    return = {
        "data": {
            "latestTime": <timestamp>
        },
        "status": "OK" or "ERROR"
        "msg": if error
    }
    """
    msg = ''
    is_success = True
    post_data = request.get_json()
    start_time = post_data.get('start')
    end_time = post_data.get('end')
    data = None
    time_format = '%Y-%m-%d %H:%M:%S'
    try:
        start_time = datetime.strptime(start_time, time_format)
        end_time = datetime.strptime(end_time, time_format)
    except ValueError:
        is_success = False
        msg = 'please input right time'
        return format_result(is_success, msg=msg, data=data)
    try:
        data = DiagnosisAuto.get_notice_latest_time(project_id, start_time, end_time)
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        is_success = False
        msg = '500 internal error'
    return format_result(is_success, msg=msg, data=data)


@bp_diagnosis.route('/autoTasks/<int:project_id>', methods=['POST'])
def auto_tasks(project_id):
    """
    post_data = {
        "lang": <str>,
        "operatorId": <int>,
        "data":[
            {
                "entityId": <int>,
                "faultId": <int>,
                "noticeId": <int>
            },
            ......
        ]
    }
    return = {
        "status": "OK" or "ERROR"
        "msg": if error
    }
    """
    msg = ''
    is_success = True
    post_data = request.get_json()
    lang = post_data.get('lang')
    operator_id = post_data.get('operatorId')
    data = post_data.get('data')
    try:
        DiagnosisAuto.auto_tasks(project_id, lang, operator_id, data)
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        is_success = False
        msg = '500 internal error'
    return format_result(is_success, msg=msg)


@bp_diagnosis.route('/getDiagnosisRecoveryDetail', methods=['POST'])
def get_diagnosis_recovery_detail():
    """
    postdata:
    {
        "startTime": <date>,
        "endTime": <date>,
        "projectId": <int>,
        "lang": <str>  # en, zh
    }

    return:
    {
        "status": <str>, # OK, ERROR
        "msg": <str>, # error message
        "data":{
            "recoveredFaults": [{
                "energy": {
                    "runDay": <float>,
                    "runWeek": <float>,
                    "runMonth": <float>,
                    "runYear": <float>,
                    "runActive": <float>
                },
                "count": <int>,
                "faultName": <str>,
                "faultId": <int>,
                "faultDesc": <str>,
                "entity": [{
                        "id": <int>,
                        "name": <str>,
                        "zone": <str>,
                        "points": <str>,
                        "time": <date>,
                        "endTime": <date>,
                        "noticeId": <int>
                        },
                        ......
                    ]
                },
                ......
            ],
            "activeFaults": <同上>
        }
    }

    date格式： YYYY-mm-dd HH:MM:SS
    """
    msg = ''
    is_success = True
    data = None
    post_data = request.get_json()
    start_time = post_data.get('startTime')
    end_time = post_data.get('endTime')
    project_id = post_data.get('projectId')
    energy_factor = post_data.get('energyFactor')
    lang = post_data.get('lang')

    time_format = '%Y-%m-%d %H:%M:%S'
    try:
        start_time = datetime.strptime(start_time, time_format)
        end_time = datetime.strptime(end_time, time_format)
    except ValueError:
        is_success = False
        msg = 'please input right time'
        return format_result(is_success, msg=msg, data=data)
    try:
        data = DiagnosisAuto.get_diagnosis_recovery_detail(start_time, end_time, project_id, lang)
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        is_success = False
        msg = '500 internal error'
    return format_result(is_success, msg=msg, data=data)

@bp_diagnosis.route('/getDiagnosisDetail', methods=['POST'])
def get_diagnosis_detail():
    '''
    postdata:
    {
        "startTime": <date>,
        "endTime": <date>,
        "projectId": <int>,
        "lang": <str>  # en, zh
    }

    return:
    {
        "status": <str>, # OK, ERROR
        "msg": <str>, # error message
        "data":[
            {
                "energy": {
                    "runDay": <float>,
                    "runWeek": <float>,
                    "runMonth": <float>,
                    "runYear": <float>,
                    "runActive": <float>
                },
                "count": <int>,
                "faultName": <str>,
                "faultId": <int>,
                "faultDesc": <str>,
                "entity": [{
                        "id": <int>,
                        "name": <str>,
                        "zone": <str>,
                        "points": <str>,
                        "time": <date>,
                        "endTime": <date>,
                        "noticeId": <int>
                        },
                        ......
                    ]
            },
            ......
        ]
    }

    date格式： YYYY-mm-dd HH:MM:SS
    '''
    msg = ''
    is_success = True
    data = None
    post_data = request.get_json()
    start_time = post_data.get('startTime')
    end_time = post_data.get('endTime')
    project_id = post_data.get('projectId')
    energy_factor = post_data.get('energyFactor')
    lang = post_data.get('lang')

    time_format = '%Y-%m-%d %H:%M:%S'
    try:
        start_time = datetime.strptime(start_time, time_format)
        end_time = datetime.strptime(end_time, time_format)
    except ValueError:
        is_success = False
        msg = 'please input right time'
        return format_result(is_success, msg=msg, data=data)
    try:
        data = DiagnosisAuto.get_diagnosis_detail(start_time, end_time, project_id, lang)
    except Exception as e:
        app.logger.error("get_diagnosis_detail error. ", exc_info=True, stack_info=True)
        is_success = False
        msg = '500 internal error'
    return format_result(is_success, msg=msg, data=data)

@bp_diagnosis.route('/getTaskStats/<int:projId>', methods=['GET'])
def get_task_stats(projId):
    '''
    get args:
    startTime: %Y-%m-%d %H:%M:%S or None
    endTime: %Y-%m-%d %H:%M:%S or None

    response:
    {
        "success": <str>, # OK, ERROR
        "code": <str>, # error code
        "msg": <str>, # error message
        "data":{
            "taskCount": <int>,
            "taskCompleted": <int>,
            "taskCompletedRate": <float>
        }
    }
    '''
    debug_msg = None
    error_code = None
    try:
        startTime = request.args.get('startTime')
        endTime = request.args.get('endTime')
        try:
            startTime = datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S') if startTime else None
            endTime = datetime.strptime(endTime, '%Y-%m-%d %H:%M:%S') if startTime else None
        except ValueError:
            error_code = 'ERROR_INVALID_TIME_FORMAT'
            return Utils.beop_response_error(code=error_code)
        data = DiagnosisTask.get_task_stats(projId, startTime, endTime)
    except Exception as e:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        error_code = 'ERROR_UNKNOWN'
        debug_msg = e.__str__()
    if not error_code:
        return Utils.beop_response_success(data=data)
    else:
        return Utils.beop_response_error(code=error_code, msg=debug_msg)

@bp_diagnosis.route('/diagnosisExcel/<int:projId>', methods=['POST'])
def diagnosis_excel(projId):
    debug_msg = None
    error_code = None
    directory = None
    try:
        params = request.get_json()
        de = DiagnosisExcel(
            projId,
            params.get('startTime'),
            params.get('endTime'),
            params.get('entityIds', []),
            params.get('faultIds', []),
            params.get('classNames', []),
            params.get('keywords'),
            params.get('sort', []),
            params.get('lang', 'en'),
            params.get('group', ['faultId', 'entityId'])
        )
        directory, filename = de.diagnosis_excel()
    except Exception as e:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        error_code = 'ERROR_UNKNOWN'
        debug_msg = e.__str__()
    try:
        if not error_code:
            return send_from_directory(directory, filename, as_attachment=True)
        else:
            return Utils.beop_response_error(code=error_code, msg=debug_msg)
    finally:
        if os.path.exists(directory):
            if os.name == 'nt':
                os.system('rmdir /S /Q "{}"'.format(directory))
            else:
                shutil.rmtree(directory)

@bp_diagnosis.route('/diagnosisTaskExcel/<int:projId>', methods=['POST'])
def diagnosis_task_excel(projId):
    debug_msg = None
    error_code = None
    directory = None
    try:
        params = request.get_json()
        de = DiagnosisTaskExcel(
            projId,
            params
        )
        directory, filename = de.diagnosis_excel()
    except Exception as e:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        error_code = 'ERROR_UNKNOWN'
        debug_msg = e.__str__()
    try:
        if not error_code:
            return send_from_directory(directory, filename, as_attachment=True)
        else:
            return Utils.beop_response_error(code=error_code, msg=debug_msg)
    finally:
        if os.path.exists(directory):
            if os.name == 'nt':
                os.system('rmdir /S /Q "{}"'.format(directory))
            else:
                shutil.rmtree(directory)


# 老版诊断发送诊断邮件
@bp_diagnosis.route('/sendDiagnosisEmail', methods=['POST'])
def sendDiagnosisEmail():
    rv = {"success": True}
    try:
        data = request.get_json()
        message = data.get('message')
        faultName = message.get('FaultName') if message.get('FaultName') else '-'

        level = data.get('level')
        if not level:
            level = '-'
        projId = data.get('projId')
        mail_list = data.get('mail_list')
        png_url = data.get('url')
        project_detail = Project().query_project_language_countryCode(projId)
        lang = project_detail.get('defaultLanguage')
        countryCode = project_detail.get('countryCode')
        if lang == 'en':
            projName = 'name_en'
            alert = 'Diagnosis:' + faultName
        else:
            projName = 'name_cn'
            alert = '诊断:' + faultName
        countryConfig = BEOPDataAccess.getCountryConfigByCode(countryCode)
        project_result = Project().get_project_by_id(projId, (projName,))
        diagnosisInfo = {"message": message, "level": level, "projId": projId, "alert": alert, 'url': png_url,
                         "project": project_result.get(projName), "countryConfig": countryConfig}
        i18n.set_lang(lang)
        html = render_template('email/diagnosisEmail.html', diagnosisInfo=diagnosisInfo)
        if not Utils.EmailTool.send_email(alert, mail_list, html, countryCode=project_detail.get('countryCode'), strategy='v2'):
            raise Exception('sendDiagnosisEmail failed')
    except Exception as e:
        rv["success"] = False
        rv["msg"] = e.__str__()
        logging.error('Unhandled exception!', exc_info=True, stack_info=True)
    return json.dumps(rv)