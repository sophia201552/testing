from flask import request, json

from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_workflow import bp_workflow
from beopWeb.AuthManager import AuthManager
from .Task import Task
from beopWeb.mod_message import Message
from beopWeb.mod_message import MessageUser


@bp_workflow.route('/task/filter', methods=['POST'])
def task_type_filter():
    '''
    获取工单列表
    '''
    user_id = AuthManager.get_userId()

    if not user_id:
        return Utils.beop_response_error(403)

    rq_data = request.get_json()
    pageNumber = rq_data.get("pageNumber", None)
    pageSize = rq_data.get("pageSize", None)
    query = None
    if not rq_data.get('query'):
        return Utils.beop_response_error(msg='query is empty')
    if isinstance(rq_data.get('query'), str):
        query = json.loads(rq_data.get("query"), encoding="application/json")
    elif isinstance(rq_data.get('query'), dict):
        query = rq_data.get('query')

    tk = Task()
    result = {}

    order = []
    try:
        order_property = rq_data.get('orderProperty')
        asc = rq_data.get('asc')
        if order_property is not None and asc is not None:
            order = [order_property, 1 if asc else -1]
    except Exception as e:
        pass

    trans_result, total = tk.task_filter(task_filter=query, page_num=pageNumber,
                                         page_size=pageSize, order=order)
    tk.wrap_task_list(trans_result)
    result['records'] = trans_result
    result["total"] = total
    return Utils.beop_response_success(result)


@bp_workflow.route('/task/delete', methods=['POST'])
def task_delete():
    '''
    删除工单
    '''
    user_id = AuthManager.get_userId()

    if not user_id:
        return Utils.beop_response_error(403)

    rq_data = request.get_json()
    task_id = rq_data.get('id')

    tk = Task(task_id)
    delete_count = tk.delete_task()
    if delete_count:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


@bp_workflow.route('/task/comment/get/<task_id>', methods=["GET"])
def get_task_comment(task_id):
    '''
    获取工单评论
    :param task_id: 工单ID
    '''
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(code=403)

    if not task_id:
        return Utils.beop_response_error(code=404)

    task = Task()
    rv = task.get_comment_by_task_id(task_id)
    return Utils.beop_response_success(rv)


@bp_workflow.route('/task/comment/add', methods=["POST"])
def add_task_comment():
    '''
    添加工单评论
    '''
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(code=403)

    rq_data = request.get_json()
    task_id = rq_data.get("taskId")
    if not task_id:
        return Utils.beop_response_error(code=404)

    content = rq_data.get("content")

    task = Task()
    task.add_comment_by_task_id(task_id, user_id, content)

    # add message
    message = Message()
    message_user = MessageUser()
    willReceived = Task().get_all_willReceived_user_id_list_by_id(task_id=task_id)
    msg_id = message.add_new_workflow_message_with_return_id(user_id, 'Reply', content, {
        "id": task_id,
        "op": "reply",
        "willReceived": willReceived
    })
    if msg_id:
        message_user.add_workflow_users_message(willReceived, msg_id)

    return Utils.beop_response_success()


@bp_workflow.route('/task/comment/delete', methods=["POST"])
def remove_task_comment():
    '''
    删除工单评论
    '''
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(code=403)

    rq_data = request.get_json()

    comment_id = rq_data.get("commentId")
    task_id = rq_data.get("taskId")
    if not comment_id or not task_id:
        return Utils.beop_response_error(code=404)

    task = Task()
    task.remove_comment_by_task_id_comment_id(task_id, comment_id)

    return Utils.beop_response_success()
