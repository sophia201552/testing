''' 策略组态 控制器 '''
from enum import Enum
from flask import request, render_template, jsonify, json
import requests
from beopWeb import app
from beopWeb.mod_strategy import bp_strategy
from beopWeb.mod_strategy.strategy_model import StrategyModel
from beopWeb.mod_tag.pointTag import pointTag
from beopWeb.mod_admin.User import User
from .updater import Updater

LOG_TYPE = Enum('LogType', 'ADD MODIFY DELETE')
STRATEGY_FIELDS_CHANGED_WHICH_NEED_TO_BE_NOTICE = \
    ['type', 'preTasks', 'value', 'trigger', 'status', 'option']
CALC_UPDATER = Updater()

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

def is_need_notice_strategy_changed(data):
    ''' 判断策略的更新是否需要通知算法服务器 '''
    data = {} if data is None else data
    for item in STRATEGY_FIELDS_CHANGED_WHICH_NEED_TO_BE_NOTICE:
        if item in data:
            return True
    return False

@bp_strategy.route('')
@bp_strategy.route('/app')
@bp_strategy.route('/painter/<strategy_id>')
@bp_strategy.route('/faultManage')
def main(strategy_id=None):
    ''' 网站入口 URL '''
    token = None
    if app.config.get('URL_CHECK'):
        # 拿到 token
        token = request.cookies.get('token')
    proj_id = None
    result = None
    if strategy_id:
        result = StrategyModel.get_item_by_id(strategy_id)
        if result:
            proj_id = result['strategy'].get('projId', None)
    if token:
        return render_template('mod_strategy/index.html', token=token, projId=proj_id)
    else:
        return render_template('mod_strategy/index.html', projId=proj_id)

def convert_tag_to_strategy(tag, is_loaded=None):
    ''' 将 tag 的数据转换成 策略的数据 '''
    update = {
        '_id': tag['_id'],
        'name': tag['name'],
        'nodeId': tag.get('prt'),
        'children': tag.get('children', []),
        'isParent': True
    }
    if not is_loaded is None:
        update['isLoaded'] = is_loaded

    tag.clear()
    tag.update(update)

    return tag

# 根据项目ID，获取该项目下策略概要信息列表
# return.data: [{
#         # 编号
#         '_id': '565558adf18a890a2448075b',
#         # tag节点Id,
#         'nodeId': '565558adf18a890a24480752',
#         # 名称
#         'name': '冷机1号供回水温度监测',
#         # 描述
#         'desc': '用神奇的高端洋气算法，对冷机1号初代机供回水温度越界问题进行监测，并发出报警',
#         # 修改人
#         'userId': 1,
#         # 最后修改时间
#         'lastTime': '2016-04-12 19:00:00',
#         # 关键字，便于检索
#         'keywords': ['冷机', '与非', ],
#         # 类型：0，诊断；1，KPI；2，计算点；
#         'type': 0,
#         # 运行间隔, 秒
#         'interval': 60,
#         # 最后运行时间
#         'lastRuntime': '2016-04-12 19:00:00',
#         # 状态： 0，未启用；1，启用；
#         'status': 0,
#     }]
@bp_strategy.route('/item/getList/<proj_id>/<node_id>', methods=['GET'])
@bp_strategy.route('/item/getList/<proj_id>', methods=['GET'])
def get_strategy_item_list(proj_id, node_id=''):
    ''' 根据项目id/节点id获取策略列表（仅直接子策略，不包含子策略） '''
    # 先拿 tag 数据
    tag_list = pointTag.get_thingsTree(proj_id, node_id, True, False)

    item_map = {}
    node_ids = []
    node_ids.append(node_id if node_id else str(proj_id))

    if tag_list:
        tag_list = tag_list[1:]
        for item in tag_list:
            node_ids.append(item['_id'])
            item_map[item['_id']] = item
            children = item.get('children', [])
            for child in children:
                child = convert_tag_to_strategy(child)
            convert_tag_to_strategy(item)

    # 再拿 策略数据
    strategy_list = StrategyModel.get_items_by_node_ids(node_ids)

    if strategy_list is None:
        return format_result(False, '获取数据失败！')

    user = User()
    userlist = user.get_user_list_info([item['userId'] for item in strategy_list])
    usermap = {}
    for item in userlist:
        usermap[item.get('id')] = item.get('username')

    for item in strategy_list:
        item_node_id = item['nodeId']
        item['userFullName'] = usermap[item['userId']]
        if item_node_id in item_map:
            item_map[item_node_id]['children'].append(item)
        else:
            # 根节点
            tag_list.append(item)

    return format_result(True, 'Success', tag_list)

@bp_strategy.route('/item/getAllList/<proj_id>/<node_id>', methods=['GET'])
@bp_strategy.route('/item/getAllList/<proj_id>', methods=['GET'])
def get_strategy_all_item_list(proj_id, node_id='', isFlat=False):
    ''' 根据项目id/节点id获取策略列表（包含所有子策略） '''
    # 先拿 tag 数据
    tag_list = pointTag.get_thingsTree(proj_id, node_id, True, True)

    item_map = {}
    node_ids = []

    node_ids.append(node_id if node_id else str(proj_id))

    if tag_list:
        tag_list = tag_list[1:]
    f_tag_list = [] if not tag_list else tag_list[:]
    while len(f_tag_list) > 0:
        item = convert_tag_to_strategy(f_tag_list.pop(0), True)
        item_map[item['_id']] = item
        node_ids.append(item['_id'])
        if len(item['children']) > 0:
            f_tag_list = f_tag_list + item['children']

    # 再拿 策略数据
    strategy_list = StrategyModel.get_items_by_node_ids(node_ids)

    if strategy_list is None:
        return format_result(False, '获取数据失败！')

    user = User()
    userlist = user.get_user_list_info([item['userId'] for item in strategy_list])
    usermap = {}
    for item in userlist:
        usermap[item.get('id')] = item.get('userfullname')
    for item in strategy_list:
        item['userFullName'] = usermap.get(item['userId'], 'Get Failed')

    if isFlat:
        return format_result(True, 'Success', strategy_list)

    for item in strategy_list:
        item_node_id = item['nodeId']
        if item_node_id in item_map:
            item_map[item_node_id]['children'].append(item)
        else:
            # 根节点
            tag_list.append(item)

    return format_result(True, 'Success', tag_list)


# 根据策略ID，获取策略详情
# return.data: struct_DB_Strategy.Strategy_Item
@bp_strategy.route('/item/get/<item_id>', methods=['GET'])
def get_strategy_item(item_id):
    ''' 根据策略ID，获取策略详情 '''
    result = StrategyModel.get_item_by_id(item_id)
    if not result:
        return format_result(False, '获取数据失败！')

    return format_result(True, 'Success', result)

# 保存测略，有策略ID为Update，没有为Insert
# post.data: struct_DB_Strategy.Strategy_Item
@bp_strategy.route('/item/save', methods=['POST'])
def save_strategy_item():
    req_json = request.get_json()
    data = req_json.get('data')
    ids = req_json.get('ids')
    proj_id = req_json.get('projId')

    if not ids is None:
        # 修改
        result = StrategyModel.update_items_by_ids(req_json['ids'], data)
        if not result:
            return format_result(False, '修改数据失败！')

        # 写入LOG
        StrategyModel.log(req_json['userId'], LOG_TYPE.MODIFY, {
            'ids': req_json['ids'],
            'data': data
        })

        if is_need_notice_strategy_changed(data):
            # 通知算法服务器更新
            CALC_UPDATER.update_diagnosis_strategy(proj_id, {
                'type': 'update',
                'strategyIdList': ids,
                'fields': 'all'
            })
        return format_result(True, 'Success', {'count': result})
    else:
        # 新增
        result = StrategyModel.add_items(data)
        if not result:
            return format_result(False, '新增数据失败！')

        # 写入LOG
        StrategyModel.log(req_json['userId'], LOG_TYPE.ADD, {
            'id': result,
            'data': data
        })

        return format_result(True, 'Success', {'_id': result})

@bp_strategy.route('/modules/sync', methods=['POST'])
def sync_strategy_item():
    ''' 策略模块数据同步 '''
    req_json = request.get_json()
    modules = req_json.get('modules')
    del_ids = []
    add_modules = []
    flag = True
    result = None

    if modules:
        # 更新模块信息
        for item in modules:
            kind = item.get('k')
            if kind == 'D':
                del_ids.append(item.get('_id'))
            elif kind == 'N':
                add_modules.append(item.get('v'))
            elif kind == 'E':
                result = StrategyModel.update_module_by_id(item.get('_id'), item.get('v'))
                if not result:
                    flag = False

    if len(del_ids) > 0:
        result = StrategyModel.del_modules_by_ids(del_ids)
        if not result:
            flag = False

    if len(add_modules) > 0:
        result = StrategyModel.add_modules(add_modules)
        if not result:
            flag = False

    return format_result(flag, 'Success' if flag else 'Fail')

# 根据策略ID，删除策略
# post.data: null
@bp_strategy.route('/item/remove', methods=['POST'])
def remove_strategy_item():
    ''' 删除一个策略项 '''
    req_json = request.get_json()
    # 1、更新到数据库
    result = StrategyModel.del_items_by_ids(req_json['ids'])

    if not result:
        return format_result(False, '删除数据失败！')

    # 2、写入LOG
    StrategyModel.log(req_json['userId'], LOG_TYPE.DELETE, {
        'ids': req_json['ids']
    })

    # 3、通知算法服务器更新
    CALC_UPDATER.update_diagnosis_strategy(req_json['projId'], {
        'strategyIdList': req_json['ids'],
        'type': 'delete'
    })

    return format_result(True, 'Success', {'count': result})


# 根据用户ID，获取模板概要信息列表
# return.data[{
#         # 编号
#         '_id': ObjectId('565558adf18a890a2448075b'),
#         # tag节点类型的Id,
#         'tagId': ObjectId('565558adf18a890a24480752'),
#         # 名称
#         'name': '冷机1号供回水温度监测',
#         # 描述
#         'desc': '用神奇的高端洋气算法，对冷机1号初代机供回水温度越界问题进行监测，并发出报警',
#         # 修改人
#         'userId': 1,
#         # 最后修改时间
#         'lastTime': '2016-04-12 19:00:00',
#         # 关键字，便于检索
#         'keywords': ['冷机', '与非'],
#         # 类型：0，诊断；1，KPI；2，计算点；
#         'type': 0,
#     }]
@bp_strategy.route('/template/group', methods=['GET'])
@bp_strategy.route('/template/group/<group_id>', methods=['GET'])
def get_template_by_group(group_id=''):
    ''' 根据组 id 获取该组下的模板列表 '''
    result = StrategyModel.get_templates_by_group(group_id)

    if result is None:
        return format_result(False, '获取模板列表失败')

    return format_result(True, 'Success', {'data': result})


# 根据模板ID，获取模板详情
# return.data: struct_DB_Strategy.Strategy_Template
@bp_strategy.route('/template/<tpl_id>', methods=['GET'])
def get_template_by_id(tpl_id):
    ''' 根据模板 id 获取模板的详细信息 '''
    result = StrategyModel.get_template_by_id(tpl_id)

    if result is None:
        return format_result(False, '获取模板信息失败')

    return format_result(True, 'Success', {'data': result})


# 保存模板，有ID为Update，没有为Insert
# post.data: struct_DB_Strategy.Strategy_Template
@bp_strategy.route('/template/save', methods=['POST'])
def saveStrategyTemplate():
    # 1、更新到数据库
    # 2、写入LOG
    return format_result(True, 'Success', {'_id': '565558adf18a890a2448075b'})


# 根据模板ID，删除模板
# post.data: struct_DB_Strategy.Strategy_Template
@bp_strategy.route('/template/remove/<templateId>', methods=['POST'])
def removeStrategyTemplate(templateId):
    # 1、更新到数据库
    # 2、写入LOG
    return format_result(True, 'Success', {'_id': '565558adf18a890a2448075b'})


@bp_strategy.route('/doSomething/<src_node_id>/<dest_node_id>', methods=['GET'])
def do_something(src_node_id, dest_node_id):
    ''' 做一些事儿 '''
    result = StrategyModel.doSomething(src_node_id, dest_node_id)
    return format_result(result)


# 调试接口
@bp_strategy.route('/run', methods=['POST'])
def runStrategy():
    ''' 调试接口 '''
    result = ''
    headers = {'content-type': 'application/json'}
    url = app.config['EXPERT_CONTAINER_URL'] + 'api/strategy/debug'
    try:
        post_data = request.get_json()
        res = requests.post(url, json.dumps(post_data), headers=headers, timeout=90)
        if res.status_code == 200:
            result = res.text
    except Exception as e:
        raise Exception(e.__str__())
    return result

@bp_strategy.route('/diagnosis', methods=['POST'])
def run_diagnosis():
    data = request.get_json()
    # 拿 策略数据
    strategy_list = StrategyModel.get_full_items_by_ids(data['ids'])

    if strategy_list is None:
        return format_result(False, '获取数据失败！')

    return format_result(True, 'Success', strategy_list)


@bp_strategy.route('/diagnosis/<proj_id>', methods=['POST'])
def run_diagnosis_by_proj_id(proj_id):
    # 先拿 tag 数据
    tag_list = pointTag.get_thingsTree(proj_id, '', True, True)

    node_ids = []
    node_ids.append(str(proj_id))

    while len(tag_list) > 0:
        item = tag_list.pop(0)
        node_ids.append(item['_id'])

    # 再拿 策略数据
    strategy_list = StrategyModel.get_items_by_node_ids(node_ids)

    if strategy_list is None:
        return format_result(False, '获取数据失败！')

    strategy_map = {}
    for strategy in strategy_list:
        str_id = str(strategy['_id'])
        strategy_map[str_id] = strategy

    # 查找 modules
    result = StrategyModel.get_modules_by_strategy_ids(list(strategy_map.keys()))

    for module in result:
        strategy = strategy_map[module['_id']]
        if strategy:
            strategy['modules'] = module['items']

    return format_result(True, 'Success', list(strategy_map.values()))

@bp_strategy.route('/saveProjConfig', methods=['POST'])
def save_proj_config():
    ''' 保存项目级别配置 '''
    params = request.get_json()

    result = StrategyModel.save_proj_config(int(params['projId']), params['config'])
    if result is None:
        return format_result(False, '保存项目配置失败！')

    # 通知算法服务器更新
    CALC_UPDATER.update_diagnosis_config({
        'projectId': int(params['projId'])
    })
    return format_result(True, 'Success', result)


@bp_strategy.route('/getProjConfig/<proj_id>', methods=['GET'])
def get_proj_config(proj_id):
    ''' 获取项目级别配置 '''
    config = StrategyModel.get_proj_config(int(proj_id))

    if config is None:
        return format_result(False, '获取项目配置失败！')
    return format_result(True, 'Success', config)

@bp_strategy.route('/updateDiagnosis', methods=['post'])
def update_diagtable():
    ''' 更新诊断表 '''
    data = request.get_json()
    update_result, create_result = CALC_UPDATER.update_diagtable(data)
    if update_result is None or create_result is None:
        return format_result(False, 'Fail')
    return format_result(True, 'Success', {'update': update_result, 'create': create_result})

@bp_strategy.route('/updateFaultTable', methods=['post'])
def update_fault_table():
    ''' 更新 Fault 表 '''
    data = request.get_json()
    result = CALC_UPDATER.update_fault_table(data)
    if not result:
        return format_result(False, '更新 Fault 表时出错', {'msg': result})
    # 更新 needSync
    result = StrategyModel.update_items_by_ids(data.get('strategyIdList', []), {
        'option.needSyncFaultTable': 0
    })
    if not result:
        return format_result(False, '更新策略 Fault 表状态时出错')
    return format_result(True, '更新成功')
