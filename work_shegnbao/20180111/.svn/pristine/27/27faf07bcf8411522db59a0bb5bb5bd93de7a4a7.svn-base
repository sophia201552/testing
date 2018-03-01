''' 诊断历史 控制器 '''
import os, time, math, random, base64
import logging
from enum import Enum

from flask import jsonify, render_template, request
import imgkit

from beopWeb import app
from beopWeb.mod_diagnosis import bp_diagnosis
from beopWeb.mod_diagnosis.service import DiagnosisService
from beopWeb.mod_diagnosis.report_service import DiagnosisReportService
from beopWeb.mod_oss.ossapi import OssAPI
from beopWeb.mod_memcache.RedisManager import RedisManager


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

@bp_diagnosis.route('')
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
        return render_template('mod_diagnosis/index.html', token=token, projId=project_id)
    else:
        return render_template('mod_diagnosis/index.html', projId=project_id)

'''
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
'''
@bp_diagnosis.route('/getEntities')
def get_entities():
    ''' 获取实体列表 '''
    params = request.args
    project_id = int(params.get('projectId'))
    data = DiagnosisService.get_entities(project_id)
    return format_result(True, None, data)

@bp_diagnosis.route('/getEntitiesWrongQuantity')
def get_entities_wrong_quantity():
    ''' 获取实体的健康率 '''
    params = request.args
    project_id = int(params.get('projectId'))
    start_time = params.get('startTime')
    end_time = params.get('endTime')
    data = DiagnosisService.get_entities_wrong_quantity(project_id, start_time, end_time)
    return format_result(True, None, data)

'''
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
'''
@bp_diagnosis.route('/getLastestFaults')
def get_lastest_faults():
    params = request.args
    projectId = int(params.get('projectId'))
    startTime = params.get('startTime')
    endTime = params.get('endTime')

    data = DiagnosisService.get_lastest_entity_faults(projectId, startTime, endTime)
    return format_result(True, None, data)

'''
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
'''
@bp_diagnosis.route('/getEquipmentAvailability')
def get_equipment_availability():
    ''' 获取设备的完好率 '''
    params = request.args
    error = None
    if params:
        try:
            project_id = int(params.get('projectId'))
            start_time = params.get('startTime')
            end_time = params.get('endTime')
            entityIds = params.get('entityIds')
            classNames = params.get('classNames')
            faultIds = params.get('faultIds')
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
            data = DiagnosisService.get_equipment_rate_of_health(project_id, start_time, end_time, entityIds, classNames, faultIds )
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

'''
request - POST
{
    "pageIndex": 0,
    "pageSize": 100,
    "projectId": 293,
    "startTime": '2017-01-01 00:00:00',
    "endTime": '2017-01-05 00:00:00',
    "entityIds": [],
    "keywords": '',
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
'''
@bp_diagnosis.route('/getEntityFaults', methods=['POST'])
def get_entity_faults():
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
        params.get('sort', [])
    )
    return format_result(True, None, data)

'''
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
'''
@bp_diagnosis.route('/getEntityFaultHisData')
def get_entity_fault_his_data():
    #params = request.get_json()
    params = {
        "projectId": 293,
        "faultId": 1,
        "startTime": '2017-01-01 00:00:00',
        "endTime": '2017-01-02 00:00:00',
        "timeFormat": 'h1'
    }
    return format_result(True, None, {})

'''
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
'''
@bp_diagnosis.route('/getFaults', methods=['POST'])
def get_faults():
    ''' 获取报警配置信息 '''
    params = request.get_json()
    project_id = params.get('projectId')
    start_time = params.get('startTime')
    end_time = params.get('endTime')
    entity_ids = params.get('entityIds')
    consequence = params.get('consequence')
    class_names = params.get('classNames')
    data = DiagnosisService.get_faults(project_id, start_time, end_time, entity_ids, consequence, class_names)
    return format_result(True, None, data)

'''
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
'''
@bp_diagnosis.route('/getAllFaults', methods=['POST'])
def get_all_faults():
    ''' 获取报警配置信息 '''
    params = request.get_json()
    project_id = params.get('projectId')
    page_num = params.get('pageNum', 1)
    page_size = params.get('pageSize', 100)
    sort = params.get('sort', [])
    data = DiagnosisService.get_all_faults(project_id, page_num, page_size, sort) 
    return format_result(True, None, data)

'''{'data':[
    {
        entityId,
        faultId,
        orderId,
        detail,
        time,
        energy,
        status,
        projectId
    },{
        entityId,
        faultId,
        orderId,
        detail,
        time,
        energy,
        status,
        projectId
    }
]}'''
@bp_diagnosis.route('/addNotices', methods=['POST'])
def addNotices():
    ''' 获取报警配置信息 '''
    params = request.get_json()
    data = params.get('data')
    # data =  [{
    #     'orderId': 0,
    #     'detail': '222,88',
    #     'energy': '0',
    #     'time': '2017-07-05 01:00:26',
    #     'faultId': 774507976739308,
    #     'projectId': 520,
    #     'status': 1,
    #     'project': 520,
    #     'entityId': 1380
    # }, {
    #     'orderId': 0,
    #     'detail': '222,88',
    #     'energy': '0',
    #     'time': '2017-07-05 01:00:26',
    #     'faultId': 774507976739309,
    #     'projectId': 520,
    #     'status': 1,
    #     'project': 520,
    #     'entityId': 1380
    # }]

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

    result = DiagnosisService.add_notices(project_id, data)
    return format_result(True, None, result)

@bp_diagnosis.route('/getGroupByEquipment', methods=['POST'])
def get_groupby_equipment():
    ''' 设备聚类 '''
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
        params.get('sort',[])
    )
    return format_result(True, None, data)

@bp_diagnosis.route('/getRoiInfo', methods=['POST'])
def get_roi_info():
    ''' 拿到roi的信息 '''
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
        params.get('sort',[])
    )
    return format_result(True, None, data)
@bp_diagnosis.route('/saveRoiInfo', methods=['POST'])
def save_roi_info():
    ''' 拿到roi的信息 '''
    params = request.get_json()
    data = DiagnosisService.save_roi_info(
        int(params.get('projectId')),
        params.get('arrData')
    )
    return format_result(True, None, data)

'''
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
'''
@bp_diagnosis.route('/getFaultInfoByConsequence', methods=['GET'])
def get_fault_info_by_consequence():
    ''' 获取报警修复信息，按照 consequence 分组 '''
    params = request.args
    projectId = params.get('projectId')
    startTime = params.get('startTime')
    endTime = params.get('endTime')
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
        faultIds
    )
    return format_result(True, None, data)

'''
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
'''
@bp_diagnosis.route('/getPriorityFaults', methods=['GET'])
def get_priority_faults():
    ''' 获取报警修复信息，按照 consequence 分组 '''
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
        faultIds
    )
    return format_result(True, None, data)


'''
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
'''
@bp_diagnosis.route('/getFaultsByIds', methods=['POST'])
def get_faults_by_ids():
    params = request.get_json()
    ids = params.get('ids')
    lang = params.get('lang')
    data = DiagnosisService.get_faults_by_ids(ids, lang)
    return format_result(True, None, data)

'''
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
'''
@bp_diagnosis.route('/getFaultsInfoAndPoints', methods=['POST'])
def get_faults_info_and_points():

    params = request.get_json()
    projectId = params.get('projectId')
    id = params.get('id')
    entityIds = params.get('entityIds')
    startTime = params.get('startTime')
    endTime = params.get('endTime')
    data = DiagnosisService.get_faults_info_and_points(projectId, id, entityIds, startTime, endTime)
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

'''
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
'''
@bp_diagnosis.route('/getInfoByDimensionality', methods=['GET'])
def get_info_by_dimensionality():
    ''' 根据不同的维度获取数据 '''
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
                project_id, start_time, end_time, entityIds, classNames, faultIds)
        elif z == 'energy':
            data = DiagnosisService.get_info_by_time_equipment_energy(
                project_id, start_time, end_time, entityIds, classNames, faultIds)
    elif y == 'consequence':
        if z == 'numberOfFaults':
            data = DiagnosisService.get_info_by_time_consequence_numberoffaults(
                project_id, start_time, end_time, entityIds, classNames, faultIds)
        elif z == 'energy':
            data = DiagnosisService.get_info_by_time_consequence_energy(
                project_id, start_time, end_time, entityIds, classNames, faultIds)

    return format_result(True, None, data)


'''
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
'''
@bp_diagnosis.route('/getEnergySavingPotentialInfo', methods=['GET'])
def get_energy_saving_potential_info():
    ''' 获取页面节能潜力相关数据 '''
    params = request.args
    project_id = int(params.get('projectId'))#293
    start_time = params.get('startTime')#'2017-06-01 00:00:00'
    end_time = params.get('endTime')#'2017-06-21 00:00:00'
    entityIds = params.get('entityIds')
    classNames = params.get('classNames')
    faultIds = params.get('faultIds')
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
                project_id, start_time, end_time, entityIds, classNames, faultIds)
    data['faults'] = result         

    result = DiagnosisService.get_energy_by_day(
                project_id, start_time, end_time, entityIds, classNames, faultIds)
    data['energyList'] = result

    return format_result(True, 'Success', data)
'''
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
'''
@bp_diagnosis.route('/getWorkOrderInfo', methods=['post'])
def get_workOrder_info():
    ''' 设备聚类 '''
    params = request.get_json()
    data = DiagnosisService.get_workOrder_info(
        int(params.get('projectId')),
        params.get('ids', [])
    )
    return format_result(True, None, data)

'''
request = POST
{
    images: ['base64']
}
'''
@bp_diagnosis.route('/saveDiagnosisCapture', methods=['POST'])
def save_diagnosis_capture():
    ''' 保存图片到本地 '''
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
            img += ('='* missing_padding)
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

'''
request = POST
{
    urls: ['url']
}
'''
@bp_diagnosis.route('/deleteDiagnosisCapture', methods=['POST'])
def delete_diagnosis_capture():
    ''' 删除截图 '''
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

'''
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
'''
@bp_diagnosis.route('/setFeedback', methods=['POST'])
def set_feedback():
    ''' 新增或者更新feedback '''
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

'''request = POST
{
    owen: '提出者',
    startTime: '',
    endTime: ''
}
'''
'''response
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
'''
@bp_diagnosis.route('/getFeedback', methods=['POST'])
def get_feedback():
    ''' 获取feedback '''
    params = request.get_json()
    data = DiagnosisService.get_feedback(params)
    return format_result(True, None, data)

'''request = POST
{
    faultIds: [],
    entityIds: [],
    enable: 0
}
'''
'''response
[]
'''
@bp_diagnosis.route('/changeFaultEnable', methods=['POST'])
def change_fault_enable():
    ''' 改变启停状态 '''
    params = request.get_json()
    faultIds = params.get('faultIds')
    entityIds = params.get('entityIds')
    enable = params.get('enable')
    status = DiagnosisService.change_fault_enable(faultIds, entityIds, enable)
    return format_result(status, None)

'''request = POST
{
    startTime: '',
    endTime: '',
    projectId: '',
    lan: 'zh|en'
}
'''
'''response
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
'''
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

'''request = POST
{
    startTime: '',
    endTime: '',
    projectId: '',
    lan: 'zh|en'
}
'''
'''response
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
'''
@bp_diagnosis.route('/getReportTemplateContent', methods=['POST'])
def get_report_template_content():
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

'''request = POST
{
    startTime: '',
    endTime: '',
    projectId: '',
    lan: 'zh|en'
}
'''
'''response
[{
    faultName: '',
    buildings: [{
        subbuilding: '',
        equiplist: []
    }]
}]
'''
@bp_diagnosis.route('/getReportTemplateAppendix', methods=['POST'])
def get_report_template_appendix():
    params = request.get_json()
    projectId = int(params.get('projectId'))
    startTime = params.get('startTime')
    endTime = params.get('endTime')
    lan = params.get('lan', 'zh')
    condition = params.get('condition', {})
    if params.get('useNewDiagnosis', 1) == 1:
        data = DiagnosisReportService.get_report_template_appendix(\
            projectId, startTime, endTime, lan, condition)
    else:
        data = DiagnosisReportService.get_report_template_appendix_old(\
            projectId, startTime, endTime, lan, condition)
    return format_result(True, None, data)

'''
request - POST
{
    "pageNum": 0,
    "pageSize": 100,
    "grades": [],
    "consequences": [],
    "keywords": '',
    "classNames": [],
    "sort": [],
    "lan": 'zh|en'
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
'''
@bp_diagnosis.route('/getFaultsInfo', methods=['POST'])
def get_faults_infos():
    params = request.get_json()
    data = DiagnosisService.get_faults_infos(
        int(params.get('pageNum', 1)),
        int(params.get('pageSize', 100)),
        params.get('grades', []),
        params.get('consequences', []),
        params.get('classNames', []),
        params.get('keywords',''),
        params.get('sort', []),
        params.get('lan', 'en'),
    )
    return format_result(True, None, data)

'''
request - GET
response
[classNames]
'''
@bp_diagnosis.route('/getFaultsClassNames')
def get_faults_class_names():
    classNameArr = RedisManager.get('strategyClassName')
    if classNameArr:
        return format_result(True, None, classNameArr)
    else:
        params = request.args
        data = DiagnosisService.get_faults_class_names()
        return format_result(True, None, data)
