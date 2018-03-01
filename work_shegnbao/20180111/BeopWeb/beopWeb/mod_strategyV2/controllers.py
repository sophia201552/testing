from enum import Enum
from flask import request, render_template, json
import requests
from beopWeb import app
from beopWeb.mod_strategyV2 import bp_strategyV2
from beopWeb.mod_strategyV2.service import StrategyService
from beopWeb.mod_admin.User import User
from beopWeb.mod_admin.Project import Project
from beopWeb.mod_common.Utils import Encoder

LOG_TYPE = Enum('LogType', 'ADD MODIFY DELETE')

def format_result(is_success, msg='', data=None):
    """ 格式化输出结果 """
    if is_success:
        result = {"status": 'OK'}
    else:
        result = {"status": 'ERROR'}
    if msg:
        result['msg'] = msg
    if data is not None:
        result['data'] = data
    return json.dumps(result, cls=Encoder)

@bp_strategyV2.route('')
@bp_strategyV2.route('/')
@bp_strategyV2.route('/home')
@bp_strategyV2.route('/painter/<strategy_id>')
def main(strategy_id=None):
    """ 网站入口 URL """
    token = None
    if app.config.get('URL_CHECK'):
        # 拿到 token
        token = request.cookies.get('token', None)
    proj_id = None
    if strategy_id:
        result = StrategyService.get_item_by_id(strategy_id)
        if result:
            proj_id = result['strategy'].get('projId', None)
    return render_template('app.html', token=token, projId=proj_id)


# 根据项目ID，获取该项目下策略概要信息列表
# RESPONSE
# [{
#     # 编号
#     '_id': '565558adf18a890a2448075b',
#     # tag节点Id,
#     'nodeId': '565558adf18a890a24480752',
#     # 名称
#     'name': '冷机1号供回水温度监测',
#     # 描述
#     'desc': '用神奇的高端洋气算法，对冷机1号初代机供回水温度越界问题进行监测，并发出报警',
#     # 修改人
#     'userId': 1,
#     # 最后修改时间
#     'lastTime': '2016-04-12 19:00:00',
#     # 关键字，便于检索
#     'keywords': ['冷机', '与非', ],
#     # 类型：0，诊断；1，KPI；2，计算点；
#     'type': 0,
#     # 运行间隔, 秒
#     'interval': 60,
#     # 最后运行时间
#     'lastRuntime': '2016-04-12 19:00:00',
#     # 状态： 0，未启用；1，启用；
#     'status': 0,
# }]
@bp_strategyV2.route('/getList/<proj_id>/<node_id>', methods=['GET'])
@bp_strategyV2.route('/getList/<proj_id>', methods=['GET'])
def get_strategy_item_list(proj_id, node_id=''):
    """ 根据项目id/节点id获取策略列表（仅直接子策略，不包含子策略） """
    strategy_list = StrategyService.get_items_by_parent_id(proj_id, node_id)

    if strategy_list is None:
        return format_result(False, '获取数据失败！')

    user = User()
    userlist = user.get_user_list_info([item['creatorId'] for item in strategy_list])
    usermap = {}
    for item in userlist:
        usermap[item.get('id')] = item.get('username')

    for item in strategy_list:
        item.update({
            'modifierFullName': usermap[item['creatorId']]
        })
    return format_result(True, '获取数据成功', strategy_list)


# 根据策略ID，获取策略详情
# return.data: struct_DB_Strategy.Strategy_Item
@bp_strategyV2.route('/getItem/<item_id>', methods=['GET'])
def get_strategy_item(item_id):
    """ 根据策略ID，获取策略详情 """
    result = StrategyService.get_item_by_id(item_id)
    if result is None:
        return format_result(False, '获取数据失败！')

    return format_result(True, '获取数据成功', result)


# 保存测略，有策略ID为Update，没有为Insert
# post.data: struct_DB_Strategy.Strategy_Item
@bp_strategyV2.route('/saveItem', methods=['POST'])
def save_strategy_item():
    req_json = request.get_json()
    data = req_json.get('data')
    ids = req_json.get('ids')

    if ids is not None:
        # 修改
        result = StrategyService.update_items_by_ids(req_json['ids'], data)
        if result is None:
            return format_result(False, '修改数据失败！')

        # 写入LOG
        StrategyService.log(data['creatorId'], LOG_TYPE.MODIFY, {
            'ids': req_json['ids'],
            'data': data
        })

        return format_result(True, '修改数据成功！', {'count': result})
    else:
        # 新增
        result = StrategyService.add_items(data)
        if result is None:
            return format_result(False, '新增数据失败！')

        # 写入LOG
        StrategyService.log(data['creatorId'], LOG_TYPE.ADD, {
            'id': result,
            'data': data
        })
        user = User()
        userlist = user.get_user_list_info([data['creatorId']])
        usermap = {}
        for item in userlist:
            usermap[item.get('id')] = item.get('username')
        data.update({
            'modifierFullName': usermap[data['creatorId']]
        })
        return format_result(True, '新增数据成功！', {'_id': result, 'data': data})


# 根据策略ID，删除策略
# post.data: null
@bp_strategyV2.route('/removeItem', methods=['POST'])
def remove_strategy_item():
    """ 删除一个策略项 """
    req_json = request.get_json()
    # 1、更新到数据库
    result = StrategyService.del_items_by_ids(req_json['ids'])

    if result is None:
        return format_result(False, '删除数据失败！')

    # 2、写入LOG
    StrategyService.log(req_json['userId'], LOG_TYPE.DELETE, {
        'ids': req_json['ids']
    })

    return format_result(True, '删除数据成功！', {'count': result})


@bp_strategyV2.route('/searchItem', methods=['POST'])
def search_strategy_item():
    """ 搜索策略项 """
    req_json = request.get_json()
    search_text = req_json.get('searchText')
    proj_id = req_json.get('projId')

    result = StrategyService.search_items_by_name(proj_id, search_text)
    if result is None:
        return format_result(False, '查询数据失败！')
    return format_result(True, '查询数据成功', result)


@bp_strategyV2.route('/modules/sync', methods=['POST'])
def sync_strategy_item():
    """ 策略模块数据同步 """
    req_json = request.get_json()
    modules = req_json.get('modules')
    del_ids = []
    add_modules = []
    flag = True

    if modules:
        # 更新模块信息
        for item in modules:
            kind = item.get('k')
            if kind == 'D':
                del_ids.append(item.get('_id'))
            elif kind == 'N':
                add_modules.append(item.get('v'))
            elif kind == 'E':
                result = StrategyService.update_module_by_id(item.get('_id'), item.get('v'))
                if not result:
                    flag = False

    if len(del_ids) > 0:
        result = StrategyService.del_modules_by_ids(del_ids)
        if not result:
            flag = False

    if len(add_modules) > 0:
        result = StrategyService.add_modules(add_modules)
        if not result:
            flag = False

    return format_result(flag, 'Success' if flag else 'Fail')


@bp_strategyV2.route('/publistItem', methods=['POST'])
def publish_strategy_item():
    """ 发布策略"""
    req_json = request.get_json()
    ids = req_json.get('ids')
    if not isinstance(ids, list):
        ids = [ids]
    data = StrategyService.get_item_by_ids(ids)
    modified_count, upserted_count, no_matched_count = \
        StrategyService.publish_items_by_ids(data['strategy'], data['modules'])

    if modified_count + upserted_count + no_matched_count == len(data['strategy']) + len(data['modules']):
        # 执行到此, 数据发布成功, 更新服务器数据
        StrategyService.update_items_by_ids(ids, {
            'syncStatus': 1
        })

        # 发布成功后，判断一下是否有数据质量检测
        dqd_module = None
        for module in data.get('modules', []):
            if module.get('type') == 206:
                dqd_module = module
                break
        if dqd_module:
            strategy = next(filter(lambda x: str(x.get('_id')) == str(dqd_module.get('strategyId')), data.get('strategy', [])), {})
            # 拼接出 Run Config
            properties = Project().get_project_properties(strategy.get('projId'))
            run_config = {
                'projectID': strategy.get('projId'),
                'RunCommand': strategy.get('status'),
                'timeBetweenCycles': 300,
                'language': properties.get('defaultLanguage', 'zh')
            }
            # 通知算法服务器
            print('模拟通知算法服务器: 数据监测模块')
            pass

        return format_result(True, '发布数据成功!', data)

    else:
        return format_result(False, '发布数据失败!')


# 模板 新建文件或者文件夹
# postData
# {
# id: ObjectId(''),
# name: '',
# isParent: '',
# parent: '',
# createTime: '',
# lastTime: '',
# desc: '',
# tagArr: '',
# grade: 'strategyTemplate', //策略模板 widgetTemplate控件模板
# creatorId: appConfig.user.id,
# imgUrl:
#     'https://beopweb.oss-cn-hangzhou.aliyuncs.com//static/images/avatar/default/4.png'
# }
# rs
# {
#     status:'OK'
# }
@bp_strategyV2.route('/addNewFile', methods=['POST'])
def add_new_file():
    req_json = request.get_json()
    data = req_json.get('data')
    result = StrategyService.add_new_file(data)
    if result is None:
        return format_result(False, '新增失败')
    return format_result(True, '新增成功！', {'id': result})


# 获取模板树
# rs
# {
#     data:[{
#         name:'',
#         isParent: 0,
#         parent: '',
#         userId:'',
#         lastTime:'', 
#         desc:''
#     }],
#     status:'OK'
# }
@bp_strategyV2.route('/getTemplateTree', methods=['GET'])
def get_template_tree():
    result = StrategyService.get_template_tree()
    if result is None:
        return format_result(False, '查询失败')
    return format_result(True, '查询成功！',  result)


# 筛选条件
# postData
# {
#     selectedIds: '',   //当前选中的文件/文件夹
#     grade: '',     //所选级别
#     source: '',    //所选来源
#     tags: [],       //所选tags
#     key:''         //关键字搜索 
#     user:1         //当前用户id
# }
# rs
# {
#     id: '',//本身的id
#     group:'',//父元素的id
#     isGroup:0,//是否是父元素
#     name:'',
#     desc:'',
#     user:'',
#     imgUrl:'',
#     comment: '',
#     download:'',
#     favorites:''
# }
@bp_strategyV2.route('/getTemplates', methods=['POST'])
def get_templates():
    params = request.get_json()
    selectedIds = params.get('selectedIds')
    grade = params.get('grade')
    source = params.get('source')
    tags = params.get('tags')
    key = params.get('key')
    user = params.get('user')
    result = StrategyService.get_templates(selectedIds, grade, source, tags, key, user)

    userlist = User().get_user_list_info([item['creatorId'] for item in result])
    usermap = {}
    for item in userlist:
        usermap[item.get('id')] = item.get('username')

    for item in result:
        item.update({
            'modifierFullName': usermap[item['creatorId']]
        })
    if result is None:
        return format_result(False, '查询失败')
    return format_result(True, '查询成功！', result)


# 删除模板
@bp_strategyV2.route('/deleteTemplate', methods=['POST'])
def delete_template():
    params = request.get_json()
    templateId = params.get('templateId')
    result = StrategyService.delete_template(templateId)
    if result is None:
        return format_result(False, '删除失败')
    return format_result(True, '删除成功！')


# 导出模板
# postData
# modules [{},{}]
# strategyInfo {}
@bp_strategyV2.route('/exportTemplate', methods=['POST'])
def export_template():
    params = request.get_json()
    modules = params.get('modules')
    strategyInfo = params.get('strategyInfo')
    result = StrategyService.export_template(modules, strategyInfo)
    if result is None:
        return format_result(False, '导出失败')
    return format_result(True, '导出成功！')


# updateTemplate
# postData
# {
#     id: '',
#     info:{
#       更改的字段:''
#     }
# }
@bp_strategyV2.route('/updateTemplate', methods=['POST'])
def update_template():
    params = request.get_json()
    templateId = params.get('id')
    info = params.get('info')
    result = StrategyService.update_template(templateId, info)
    if result is None:
        return format_result(False, '更新失败')
    return format_result(True, '更新成功！')


# 根据模板生成新的策略
# postData
# data {}
# modules []
@bp_strategyV2.route('/copyTemplateAddNew', methods=['POST'])
def copy_template_add_new():
    params = request.get_json()
    data = params.get('data')
    modules = params.get('modules')
    result = StrategyService.copy_template_add_new(data, modules)
    user = User()
    userlist = user.get_user_list_info([data['creatorId']])
    usermap = {}
    for item in userlist:
        usermap[item.get('id')] = item.get('username')
    data.update({
        'modifierFullName': usermap[data['creatorId']]
    })
    if result is None:
        return format_result(False, '复制模板新的策略失败')
    return format_result(True, '复制模板新的策略成功！', data)


# 解析excel文件
@bp_strategyV2.route('/readExcelFile', methods=['POST'])
def temp_save_excel():
    post_file = request.files.getlist('file')
    data = StrategyService.temp_save_excel(post_file)
    if data is None:
        return format_result(False, '解析excel文件失败')
    return format_result(True, '解析excel文件成功', data)


# 生成log文件
@bp_strategyV2.route('/writeErrorLog', methods=['POST'])
def write_error_log():
    params = request.get_json()
    data = StrategyService.whrite_error_log(params)
    if data is None:
        return format_result(False, '写入log文件失败')
    return format_result(True, '', data)


# 读取log文件
@bp_strategyV2.route('/readErrorLog', methods=['POST'])
def read_error_log():
    params = request.get_json()
    data = StrategyService.read_error_log(params)
    if data is None:
        return format_result(False, '读取log文件失败')
    return format_result(True, '', data)


# 生成excel文件
@bp_strategyV2.route('/exportDataExcel', methods=['POST'])
def export_dataMonitoring_excel():
    try:
        data = request.get_json()
        rowNameList = data.get("head")
        valueList = data.get("data")
        filename = StrategyService.write_excel_type1(rowNameList, valueList)
        rt = format_result(True, '', '/static/projectReports/reports/' + filename)
        if filename is None:
            rt = format_result(False, '生成Excel文件失败')
    except Exception:
        rt = format_result(False, '生成Excel文件失败')
    return rt


# 导入数据监测excel文件
@bp_strategyV2.route('/readDataMonitoringExcel/<int:projId>', methods=['POST'])
def read_dataMonitoring_excel(projId):
    post_file = request.files.getlist('file')
    data = StrategyService.save_excel_dataMonitoring(projId, post_file)
    if data is None:
        return format_result(False, '解析excel文件失败')
    return format_result(True, '解析excel文件成功', data)

# 生成数据源参数配置excel文件
@bp_strategyV2.route('/exportDataSourceExcel', methods=['POST'])
def export_dataSource_excel():
    try:
        data = request.get_json()
        rowNameList = data.get("head")
        valueList = data.get("data")
        filename = StrategyService.write_excel_type1(rowNameList, valueList)
        rt = format_result(True, '', '/static/projectReports/reports/' + filename)
        if filename is None:
            rt = format_result(False, '生成Excel文件失败')
    except Exception:
        rt = format_result(False, '生成Excel文件失败')
    return rt

# 导入数据源参数配置excel文件
@bp_strategyV2.route('/readDataSourceExcel', methods=['POST'])
def read_dataSource_excel():
    post_file = request.files.getlist('file')
    data = StrategyService.read_excel_dataSource(post_file)
    if data is None:
        return format_result(False, '解析excel文件失败')
    return format_result(True, '解析excel文件成功', data)

