from flask import request, json, jsonify

import logging, uuid

from beopWeb import app
from beopWeb.mod_asset import bp_asset
from beopWeb.MongoConnManager import *
from beopWeb.BEOPDataAccess import *
from beopWeb.mod_admin.Upload import *
from beopWeb.AuthManager import AuthManager
from .Asset import *


@app.route('/asset')
def asset():
    """Renders the home page."""
    return render_template('indexAsset.html',
                           title='BEOP Energy Leader')

@app.route('/assetApp')
def assetApp():
    """Renders the home page."""
    return render_template('indexAssetApp.html',
                           title='BEOP Energy Leader')

# 20160606 改为POST请求，根据请求字段返回对应属性
# PostData: {
#    'arrKey': ['status', 'desc', ...]
# }
@bp_asset.route('/getThingInfoList/<groupId>', methods=['POST'])
def getThingInfoList(groupId):
    rt = []
    data = request.get_json()
    if groupId:
        if data:
            arrKey = data.get('arrKey', [])
            rt = MongoConnManager.getConfigConn().getThingInfoList(groupId, arrKey)
        else:
            rt = MongoConnManager.getConfigConn().getThingInfoList(groupId)
    # return json.dumps(rt, ensure_ascii = False)
    return jsonify(data=rt)


@bp_asset.route('/getThingDetail/<tId>', methods=['GET'])
def getThingDetail(tId):
    rt = MongoConnManager.getConfigConn().getThingDetail(tId)
    # return json.dumps(rt, ensure_ascii = False)
    return jsonify(data=rt)


@bp_asset.route('/getModel/<modelId>', methods=['GET'])
def getModel(modelId):
    rt = MongoConnManager.getConfigConn().getModel(modelId)
    # return json.dumps(rt, ensure_ascii = False)
    return jsonify(data=rt)


@bp_asset.route('/getMaintainList', methods=['POST'])
def getMaintainList():
    rt = []
    data = request.get_json()
    if data:
        arrThingId = data.get('arrTId')
        if isinstance(arrThingId, list):
            mList = MongoConnManager.getConfigConn().getMaintainList(arrThingId)
            for item in mList:
                maintaininfo = BEOPDataAccess.getInstance().get_maintain_from_transaction(item.get('transactionId'))
                item.update(maintaininfo)
                rt.append(item)
    # return json.dumps(rt, ensure_ascii = False)
    return jsonify(data=rt)


@bp_asset.route('/getDiagnosisList', methods=['POST'])
def getDiagnosisList():
    requestdata = request.get_json()
    arrThingId = requestdata.get('arrTId')

    data = [{
        "_id": "111151137ddcf32fbc302221",
        "tId": "111151137ddcf32fbc302111",
        "grade": 0,
        "time": "2015-02-01 15:00",
        "name": "外壳破损",
        "status": 2
    }, {
        "_id": "111151137ddcf32fbc302221",
        "tId": "111151137ddcf32fbc302111",
        "grade": 0,
        "time": "2015-02-01 15:00",
        "name": "外壳破损",
        "status": 2
    }, {
        "_id": "111151137ddcf32fbc302221",
        "tId": "111151137ddcf32fbc302111",
        "grade": 0,
        "time": "2015-02-01 15:00",
        "name": "外壳破损",
        "status": 2
    }, ]
    return jsonify({"data": data})


# @bp_asset.route('/getRelativeFileList', methods=['GET'])
# def getMaintainInfo():
#    data = {}
#    return jsonify({"data": data})

@bp_asset.route('/saveThing', methods=['POST'])
def saveThing():
    rt = False
    data = request.get_json()
    if data:
        rt = MongoConnManager.getConfigConn().saveThing(data)
    # return json.dumps(rt, ensure_ascii = False)
    return jsonify(data=rt)


# 20160606, 保存model后，向Asset_ProjectConfig表中增加记录
@bp_asset.route('/saveModel/<projId>', methods=['POST'])
def saveModel(projId):
    rt = False
    data = request.get_json()
    if data:
        rt = MongoConnManager.getConfigConn().saveModel(data)
        if ObjectId.is_valid(rt):
            res = MongoConnManager.getConfigConn().update_iot_config_to_projConfig(projId, rt, data.get('class', None))
            if not res:
                rt = False
    # return json.dumps(rt, ensure_ascii = False)
    return jsonify(data=rt)


@bp_asset.route('/getAllModel', methods=['GET'])
def getAllModel():
    rt = MongoConnManager.getConfigConn().getModel()
    return jsonify(data=rt)


@bp_asset.route('/getModelListByType/<Type>', methods=['GET'])
def getModelListByType(Type):
    rt = MongoConnManager.getConfigConn().get_model_list_by_type(Type)
    return jsonify(data=rt)


# 20160606 从Asset_ProjectConfig表中，根据IOT类名、项目ID获取对应的Model数组，并从Asset_Model表中返回相应数据，内容参照getAllModel
@bp_asset.route('/getModelList/<projId>/<className>', methods=['GET'])
def getModelList(projId, className):
    rt = MongoConnManager.getConfigConn().get_modelList_by_class(projId, className)
    return jsonify(data=rt)


@bp_asset.route('/uploadfile', methods=['POST'])
def uploadefile():
    rt = []
    files = request.files.getlist("file[]")
    tid = request.form['_id']
    try:
        for file in files:
            path = 'assets/equipment/'
            file_name_split = file.filename.rsplit('.', 1)
            file_name_split[0] = tid
            file.filename = '.'.join(file_name_split)
            rv = Upload.upload_file_to_oss(path, file.filename, file)
            if rv.status == 200:
                rt.append(path + file.filename)
    except Exception as e:
        print('uploadefile error:' + e.__str__())
        logging.error('uploadefile error:' + e.__str__())
    return jsonify(data=rt)


@bp_asset.route('/getPartInfoList/<group_id>')
def get_partInfo_list(group_id):
    '''
    David 20160812
    :return:
    '''
    rt = {'status': 0, 'message': None, 'partInfoList': []}
    try:
        lis = Asset.get_part_info_list(group_id)
        if lis:
            rt.update({'status': 1, 'partInfoList': lis})
        else:
            rt.update({'status': 1, 'message': 'No Data'})
    except Exception as e:
        print('get_partInfo_list error:' + e.__str__())
        logging.error(e.__str__())
        rt.update({'status': 0, 'message': e.__str__()})
    return jsonify(rt)


@bp_asset.route('/inventory/in', methods=['POST'])
def putin_inventory():
    '''
    David 20160812
    :return:
    '''
    rt = {'status': 0, 'message': None, 'idList': []}
    post_data = request.get_json()
    try:
        if isinstance(post_data, dict):
            post_data = [post_data]
        if isinstance(post_data, list):
            userId = int(post_data[0].get('userId', AuthManager.get_userId()))
            for data in post_data:
                item_id = Asset.putin_inventory(data, userId)
                rt.get('idList').append(item_id)
            rt.update({'status': 1})
        else:
            rt.update({'status': 0, 'message': 'Parameter is invalid'})
    except Exception as e:
        print('putin_inventory error:' + e.__str__())
        logging.error(e.__str__())
        rt.update({'status': 0, 'message': e.__str__()})
    return jsonify(rt)


@bp_asset.route('/inventory/out', methods=['POST'])
def putout_inventory():
    '''
    David 20160812
    :return:
    '''
    rt = {'status': 0, 'message': None, 'idList': []}
    post_data = request.get_json()
    try:
        if isinstance(post_data, dict):
            post_data = [post_data]
        if isinstance(post_data, list):
            userId = int(post_data[0].get('userId', AuthManager.get_userId()))
            for data in post_data:
                item_id = Asset.putout_inventory(data, userId)
                rt.get('idList').append(item_id)
            rt.update({'status': 1})
        else:
            rt.update({'status': 0, 'message': 'Parameter is invalid'})
    except Exception as e:
        print('putout_inventory error:' + e.__str__())
        logging.error(e.__str__())
        rt.update({'status': 0, 'message': e.__str__()})
    return jsonify(rt)


@bp_asset.route('/inventory/list', methods=['POST'])
def get_inventory_list_by_id():
    '''
    David 20160812
    :return:
    '''
    rt = {'status': 0, 'message': None, 'inv_list': []}
    post_data = request.get_json()
    try:
        if post_data:
            part_id = post_data.get('part_id')
            startTime = datetime.strptime(post_data.get('startTime'), '%Y-%m-%d %H:%M:%S')
            endTime = datetime.strptime(post_data.get('endTime'), '%Y-%m-%d %H:%M:%S')
            lis = Asset.get_inventory_list_by_id(part_id, startTime, endTime)
            rt.update({'status': 1, 'inv_list': lis})
    except Exception as e:
        print('get_inventory_list_by_id error:' + e.__str__())
        logging.error(e.__str__())
        rt.update({'status': 0, 'message': e.__str__()})
    return jsonify(rt)


@app.route('/asset/maintainRecords/add', methods=['POST'])
def add_maintainRecords():
    rt = False
    try:
        '''
        {
        thing_id:'', #关联的设备id
        startTime:datetime, #开始时间
        endTime:datetime, #结束时间
        operator:'',#负责人
        cost:float, #成本
        content:'', #工作内容
        attachments:[{name:'' #附件名称, url:'' #附件地址, time:'' #上传时间, user:''#上传人},{}], #附件
        }
        '''
        data = request.get_json()
        if data:
            user_id = AuthManager.get_userId()
            createTiem = datetime.now()
            data.update({'creator': user_id, 'createTime': createTiem})
            rt = MongoConnManager.getConfigConn().set_maintainRecords(data)
    except Exception as e:
        print('add_maintainRecords error:' + e.__str__())
        logging.error(e)
    if rt:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(rt)


@app.route('/asset/maintainRecords/list', methods=['POST'])
def get_maintainRecords_by_id():
    try:
        rt = None
        data = request.get_json()
        thing_id = data.get('thing_id')
        if not thing_id:
            raise Exception('thing_id is none')
        start_time = data.get('startTime')
        if not start_time:
            raise Exception('startTime is none')
        end_time = data.get('endTime')
        if not end_time:
            raise Exception('endTime is none')
        
        page_size = int(data.get('pageSize'))
        current_page = int(data.get('pageNum'))
        
        offset = (current_page - 1) * page_size
        
        start_timeObj = datetime.strptime(start_time, Utils.datetime_format_full)
        end_timeObj = datetime.strptime(end_time, Utils.datetime_format_full)
        start_time_t=datetime.strftime(start_timeObj,Utils.datetime_format_full)
        end_time_t=datetime.strftime(end_timeObj,Utils.datetime_format_full)
        rt = MongoConnManager.getConfigConn().get_maintainRecords_by_id(thing_id,start_time_t, end_time_t,offset, page_size)
    except Exception as e:
        print('get_maintainRecords_by_id error:' + e.__str__())
        logging.error(e)
    if rt:
        return Utils.beop_response_success(rt)


@app.route('/asset/maintainRecords/del', methods=['POST'])
def del_maintainRecords_by_id():
    rt = False
    try:
        data = request.get_json()
        if data:
            obid = data.get('_id')
            if not obid:
                raise Exception('_id is none')
            rt = MongoConnManager.getConfigConn().del_maintainRecords_by_id(obid)
    except Exception as e:
        print('del_maintainRecords_by_id error:' + e.__str__())
        logging.error(e)
    if rt:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(rt)


@app.route('/asset/savePart', methods=['POST'])
def save_part():
    rt = False
    '''
    {
    _id:ObjectId(),
    name:'', #名称
    model:'', #型号
    spec:'', #规格
    brand:'', #品牌,
    supplier:'', #供应商,
    unit: '', #单位,
    qty: int, #数量,
    price: float, #单价,
    alarmValue:int, #库存警戒值,
    remark:'', #备注
    attachments:[{name:'' #附件名称, url:'' #附件地址, time:'' #上传时间, user:''#上传人},{}],#附件 
    executors:[],#执行人ids
    verifiers:[], #审核人ids
    watchers:[], #相关人员ids
    createTime:datetime, #创建时间
    images:[]#图片地址列表
    }
    '''
    try:
        data = request.get_json()
        if data:
            createTiem = datetime.now()
            data.update({'createTime': createTiem})
            rt = MongoConnManager.getConfigConn().save_part(data)
    except Exception as e:
        print('save_part error:' + e.__str__())
        logging.error(e)
    if rt:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(rt)
    
    

@app.route('/asset/getPartDetail/<part_id>', methods=['GET'])   
def get_PartDetail(part_id):
    rt = {}
    try:
        rt = MongoConnManager.getConfigConn().get_PartDetail(part_id)
    except Exception as e:
        print('get_PartDetail error:' + e.__str__())
        logging.error(e)
    if rt:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(rt)
