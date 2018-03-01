__author__ = 'win7'
from beopWeb.mod_workflow import bp_workflow
from flask import request
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_workflow_process.Process import *
from beopWeb.mod_workflow_process.Order import *
from beopWeb.AuthManager import *

# 根据所选流程加载工单模版,用来发起工单的内容填写
@bp_workflow.route('/load', methods=['POST'])
def workflow_load():
    process_id = None
    template = Process.workflowProcessGetTemplate(process_id)
    return Utils.beop_response_success(template)


# 发起工单
@bp_workflow.route('/new', methods=['POST'])
def workflow_new():
    rt = ''
    data = request.get_json()
    if data:
        process_id = data.get('processId')
        rt = Order.new_order(process_id)
    return Utils.beop_response_success(data) if data else Utils.beop_response_error()

# 工单动作
@bp_workflow.route('/action', methods=['POST'])
def workflow_action():
    rt = False
    data = request.get_json()
    if data:
        work_order_id = data.get('orderId')
        executorId = data.get('executorId', 0)
        userid = AuthManager.get_userId()
        #if userid == int(executorId):
        if 1:
            note = data.get('note', '')
            action = data.get('action')
            node_index = data.get('node_index', '-1')
            rt = Order.order_action(work_order_id, action, executorId, note, node_index)
    return Utils.beop_response_success(rt) if rt else Utils.beop_response_error()

# 获取工单当前的状态
@bp_workflow.route('/status/<orderId>', methods=['GET'])
def workflow_status(orderId):
    rt = {}
    if ObjectId.is_valid(orderId):
        rt = Order.order_status(orderId)
    return Utils.beop_response_success(rt) if rt else Utils.beop_response_error()

# 关闭工单:发起人主动关闭工单
@bp_workflow.route('/close', methods=['POST'])
def workflow_close():
    pass


# 工单搜索
@bp_workflow.route('/search/<text>', methods=['POST'])
def workflow_search(text):
    pass


# 工单筛选
@bp_workflow.route('/filter/', methods=['POST'])
def workflow_filter():
    pass
