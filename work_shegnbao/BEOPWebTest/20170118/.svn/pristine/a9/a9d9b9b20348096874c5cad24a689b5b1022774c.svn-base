''' 策略组态 控制器 '''

from flask import request, render_template, jsonify
from enum import Enum
from beopWeb import app
from beopWeb.mod_strategy import bp_strategy
from beopWeb.mod_strategy.strategy_model import StrategyModel
from beopWeb.mod_tag.pointTag import pointTag

LOG_TYPE = Enum('LogType', 'ADD MODIFY DELETE')

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

@bp_strategy.route('')
def main():
    ''' 网站入口 URL '''
    token = None
    if app.config.get('URL_CHECK'):
        # 拿到 token
        token = request.cookies.get('token')
    if token:
        return render_template('mod_strategy/index.html', token=token)
    else:
        return render_template('mod_strategy/index.html')


def convert_tag_to_strategy(tag, is_loaded=None):
    ''' 将 tag 的数据转换成 策略的数据 '''
    update = {
        '_id': tag['_id'],
        'name': tag['name'],
        'nodeId': tag['prt'],
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
    ''' 根据节点id获取策略列表 '''
    # 先拿 tag 数据
    tag_list = pointTag.get_thingsTree(proj_id, node_id, True, False)

    item_map = {}
    node_ids = []
    node_ids.append(node_id if node_id else str(proj_id))

    if tag_list:
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

    for item in strategy_list:
        item_node_id = item['nodeId']
        if item_node_id in item_map:
            item_map[item_node_id]['children'].append(item)
        else:
            # 根节点
            tag_list.append(item)

    return format_result(True, 'Success', tag_list)

@bp_strategy.route('/item/getAllList/<proj_id>/<node_id>', methods=['GET'])
@bp_strategy.route('/item/getAllList/<proj_id>', methods=['GET'])
def get_strategy_all_item_list(proj_id, node_id=''):
    ''' 根据节点id获取策略列表 '''
    # 先拿 tag 数据
    tag_list = pointTag.get_thingsTree(proj_id, node_id, True, True)

    item_map = {}
    node_ids = []

    node_ids.append(node_id if node_id else str(proj_id))

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
    result = StrategyModel.get_item_by_id(item_id)
    if not result:
        return format_result(False, '获取数据失败！')

    return format_result(True, 'Success', result)

# 保存测略，有策略ID为Update，没有为Insert
# post.data: struct_DB_Strategy.Strategy_Item
@bp_strategy.route('/item/save', methods=['POST'])
def save_strategy_item():
    req_json = request.get_json()

    if 'ids' in req_json:
        # 修改
        result = StrategyModel.update_items_by_ids(req_json['ids'], req_json['data'])
        if not result:
            return format_result(False, '修改数据失败！')
        # 写入LOG
        StrategyModel.log(req_json['userId'], LOG_TYPE.MODIFY, {
            'ids': req_json['ids'],
            'data': req_json['data']
        })
        return format_result(True, 'Success', {'count': result})
    else:
        # 新增
        result = StrategyModel.add_items(req_json['data'])
        if not result:
            return format_result(False, '新增数据失败！')
        # 写入LOG
        StrategyModel.log(req_json['userId'], LOG_TYPE.ADD, {
            'id': result,
            'data': req_json['data']
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
