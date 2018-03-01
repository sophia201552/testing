from datetime import datetime
from functools import wraps

from flask import request, json, abort

from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_workflow import bp_workflow
from beopWeb.mod_admin.User import User
from .Reply import Reply
from .Transaction import Transaction
from .TransactionGroup import TransactionGroup
from .Record import Record, RecordType
from beopWeb.mod_admin.Project import Project
from .TransactionMember import TransactionMember, TransactionMemberStatus
from .Transaction import TransactionStatus
from .TransactionTag import TransactionTag
from .Tag import Tag
from .Star import Star
from .TransactionEmail import TransactionEmail
from .TransactionAttachment import TransactionAttachment
from beopWeb.AuthManager import AuthManager


def check_workflow_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user_id = AuthManager.get_userId()
        trans_id = kwargs.get('trans_id')
        if Transaction().is_trans_accessible(trans_id, user_id) > 0:
            return f(*args, **kwargs)
        return abort(401)

    return decorated


@bp_workflow.route('/transaction/star/<user_id>/<int:page_num>/<int:page_size>', methods=['GET', 'POST'])
def transaction_star_by(user_id, page_num, page_size):
    result = {
        'total': 0,
        'records': []
    }

    start_num = (page_num - 1) * page_size
    trans = Transaction()
    count = trans.get_count_star_by(user_id)
    if not count:
        return Utils.beop_response_success(result)

    result['total'] = count

    order_property = None
    asc = None
    order = []
    if request.method == 'POST':
        try:
            rq_data = request.get_json()
            order_property = rq_data.get('orderProperty')
            asc = rq_data.get('asc')
            if order_property is not None and asc is not None:
                order = [order_property, 'ASC' if asc else 'DESC']
        except Exception as e:
            pass

    trans_result = trans.get_star_by(user_id, start_num, page_size, order)
    all_user_map = User().get_all_user_map()
    trans_group = TransactionGroup()
    star_db = Star()
    for item in trans_result:
        user = all_user_map.get(item.get('executorID'))
        item['executorName'] = user.get('userfullname') if user else ''
        group = trans_group.get_trans_group_by_id(item.get('groupid'))
        item['groupName'] = group.get('name')
        item['star'] = star_db.is_starred(user_id, item.get('id'))
    result['records'] = trans_result
    return Utils.beop_response_success(result)


@bp_workflow.route('/transaction/finished_by/<user_id>/<int:page_num>/<int:page_size>', methods=['GET', 'POST'])
def transaction_finished_by(user_id, page_num, page_size):
    result = {
        'total': 0,
        'records': []
    }

    start_num = (page_num - 1) * page_size
    trans = Transaction()
    count = trans.get_count_finished_by(user_id)
    if not count:
        return Utils.beop_response_success(result)

    result['total'] = count

    order_property = None
    asc = None
    order = []
    if request.method == 'POST':
        try:
            rq_data = request.get_json()
            order_property = rq_data.get('orderProperty')
            asc = rq_data.get('asc')
            if order_property is not None and asc is not None:
                order = [order_property, 'ASC' if asc else 'DESC']
        except Exception as e:
            pass

    trans_result = trans.get_finished_by(user_id, start_num, page_size, order)
    all_user_map = User().get_all_user_map()
    trans_group = TransactionGroup()
    star_db = Star()
    for item in trans_result:
        user = all_user_map.get(item.get('executorID'))
        item['executorName'] = user.get('userfullname') if user else ''
        group = trans_group.get_trans_group_by_id(item.get('groupid'))
        item['groupName'] = group.get('name')
        item['star'] = star_db.is_starred(user_id, item.get('id'))
        creator_id = item.get('creatorID')
        if creator_id is not None and int(creator_id) in all_user_map:
            item["creator_info"] = all_user_map[creator_id]
    result['records'] = trans_result
    return Utils.beop_response_success(result)


@bp_workflow.route('/transaction/joined_by/<user_id>/<int:page_num>/<int:page_size>', methods=['GET', 'POST'])
def transaction_joined_by(user_id, page_num, page_size):
    result = {
        'total': 0,
        'records': []
    }

    start_num = (page_num - 1) * page_size
    trans = Transaction()
    count = trans.get_count_join_by(user_id)
    if not count:
        return Utils.beop_response_success(result)

    order_property = None
    asc = None
    order = []
    if request.method == 'POST':
        try:
            rq_data = request.get_json()
            order_property = rq_data.get('orderProperty')
            asc = rq_data.get('asc')
            if order_property is not None and asc is not None:
                order = [order_property, 'ASC' if asc else 'DESC']
        except Exception as e:
            pass

    result['total'] = count
    trans_result = trans.get_join_by(user_id, start_num, page_size, order)
    all_user_map = User().get_all_user_map()
    trans_group = TransactionGroup()
    star = Star()
    for item in trans_result:
        user = all_user_map.get(item.get('executorID'))
        item['executorName'] = user.get('userfullname') if user else ''
        group = trans_group.get_trans_group_by_id(item.get('groupid'))
        item['groupName'] = group.get('name')
        item['star'] = star.is_starred(user_id, item.get('id'))
        creator_id = item.get('creatorID')
        if creator_id is not None and int(creator_id) in all_user_map:
            item["creator_info"] = all_user_map[creator_id]
    result['records'] = trans_result
    return Utils.beop_response_success(result)


@bp_workflow.route('/transaction/created_by/<user_id>/<int:page_num>/<int:page_size>', methods=['GET', 'POST'])
def transaction_created_by(user_id, page_num, page_size):
    result = {
        'total': 0,
        'records': []
    }

    start_num = (page_num - 1) * page_size
    trans = Transaction()
    count = trans.get_count_create_by(user_id)
    if not count:
        return Utils.beop_response_success(result)
    result['total'] = count

    order_property = None
    asc = None
    order = []
    if request.method == 'POST':
        try:
            rq_data = request.get_json()
            order_property = rq_data.get('orderProperty')
            asc = rq_data.get('asc')
            if order_property is not None and asc is not None:
                order = [order_property, 'ASC' if asc else 'DESC']
        except Exception as e:
            pass

    trans_result = trans.get_create_by(user_id, start_num, page_size, order)
    all_user_map = User().get_all_user_map()
    trans_group = TransactionGroup()
    star = Star()
    for item in trans_result:
        user = all_user_map.get(item.get('executorID'))
        item['executorName'] = user.get('userfullname') if user else ''
        group = trans_group.get_trans_group_by_id(item.get('groupid'))
        item['groupName'] = group.get('name')
        item['star'] = star.is_starred(user_id, item.get('id'))
        creator_id = item.get('creatorID')
        if creator_id is not None and int(creator_id) in all_user_map:
            item["creator_info"] = all_user_map[creator_id]
    result['records'] = trans_result
    return Utils.beop_response_success(result)


@bp_workflow.route('/transaction/working/<user_id>/<int:page_num>/<int:page_size>', methods=['GET', 'POST'])
def transaction_working(user_id, page_num, page_size):
    result = {
        'total': 0,
        'records': []
    }

    start_num = (page_num - 1) * page_size
    trans = Transaction()
    count = trans.get_count_working(user_id)
    if not count:
        return Utils.beop_response_success(result)
    result['total'] = count

    order = []
    if request.method == 'POST':
        try:
            rq_data = request.get_json()
            order_property = rq_data.get('orderProperty')
            asc = rq_data.get('asc')
            if order_property is not None and asc is not None:
                order = [order_property, 'ASC' if asc else 'DESC']
        except Exception as e:
            pass

    trans_result = trans.get_working(user_id, start_num, page_size, order)
    user = User()
    all_user_map = user.get_all_user_map()
    trans_group = TransactionGroup()
    star = Star()
    for item in trans_result:
        user = all_user_map.get(item.get('executorID'))
        item['executorName'] = user.get('userfullname') if user else ''
        group = trans_group.get_trans_group_by_id(item.get('groupid'))
        item['groupName'] = group.get('name')
        item['star'] = star.is_starred(user_id, item.get('id'))
        creator_id = item.get('creatorID')
        if creator_id is not None and int(creator_id) in all_user_map:
            item["creator_info"] = all_user_map[creator_id]
    result['records'] = trans_result
    return Utils.beop_response_success(result)


@bp_workflow.route('/group/transaction/<group_id>/<user_id>/<int:page_num>/<int:page_size>', methods=['GET', 'POST'])
def trans_in_group(group_id, user_id, page_num, page_size):
    user_id = AuthManager.get_userId()
    result = {
        'total': 0,
        'records': []
    }
    start_num = (page_num - 1) * page_size
    trans = Transaction()
    count = trans.get_count_by_group_id(user_id, group_id)
    if not count:
        return Utils.beop_response_success(result)
    result['total'] = count

    order_property = None
    asc = None
    order = []
    if request.method == 'POST':
        try:
            rq_data = request.get_json()
            order_property = rq_data.get('orderProperty')
            asc = rq_data.get('asc')
            if order_property is not None and asc is not None:
                order = [order_property, 'ASC' if asc else 'DESC']
        except Exception as e:
            pass

    trans_result = trans.get_by_group_id(user_id, group_id, start_num, page_size, order)

    all_user_map = User().get_all_user_map()
    trans_group = TransactionGroup()
    star = Star()
    for item in trans_result:
        user = all_user_map.get(item.get('executorID'))
        item['executorName'] = user.get('userfullname') if user else ''
        group = trans_group.get_trans_group_by_id(item.get('groupid'))
        item['groupName'] = group.get('name')
        item['star'] = star.is_starred(user_id, item.get('id'))
        creator_user_id = item.get("creatorID")
        if creator_user_id:
            item["creator_info"] = User().query_user_by_id(creator_user_id, 'useremail', 'userfullname', 'username',
                                                           'userpic', 'id')
    result['records'] = trans_result
    return Utils.beop_response_success(result)


@bp_workflow.route('/transaction/fault_curve_data/<trans_id>', methods=['GET'])
@bp_workflow.route('/transaction/fault_curve_data/', defaults={'trans_id': ''}, methods=['POST'])
def get_fault_curve_data(trans_id):
    from beopWeb.BEOPDataAccess import BEOPDataAccess

    data_access = BEOPDataAccess.getInstance()

    if request.method == 'GET':
        transaction = Transaction()
        rq_data = transaction.get_transaction_by_id(trans_id)
        if rq_data is None:
            return Utils.beop_response_error(msg='can\' find the records by trans id :' + str(trans_id))
        db_name = rq_data.get('dbName')
        prj = Project()
        project = prj.get_project_by_db_name(db_name)
        project_id = project.get('id')
    else:
        rq_data = request.get_json()
        project_id = rq_data.get('projectId')

    point_list = rq_data.get('chartPointList')
    circle = rq_data.get('chartQueryCircle')
    start_time = rq_data.get('chartStartTime')
    end_time = rq_data.get('chartEndTime')

    if isinstance(start_time, datetime):
        start_time = start_time.strftime(Utils.datetime_format_full)

    if isinstance(end_time, datetime):
        end_time = end_time.strftime(Utils.datetime_format_full)

    list_value, list_time, list_description = [], [], []
    if point_list:
        list_value, list_time, list_description = data_access.workflow_get_fault_curve_data(project_id, point_list,
                                                                                            circle,
                                                                                            start_time, end_time)
    list_time_result = []
    for item in list_time:
        item_list = item.split(',')
        m_time_list = []
        for time in item_list:
            m_time_list.append(datetime.strptime(time, Utils.datetime_format_full).strftime('%Y-%m-%d %H:%M'))
        list_time_result.append(','.join(m_time_list))
    return Utils.beop_response_success({'value': list_value, 'time': list_time_result, 'description': list_description})


@bp_workflow.route('/transaction/star/<user_id>/<trans_id>', methods=['GET'])
def transaction_toggle_starred(user_id, trans_id):
    if trans_id is None:
        return 'The transaction id is empty'
    elif user_id is None:
        return 'The user id is empty'

    star = Star()
    star.toggle_star(user_id, trans_id)
    return "success"


@bp_workflow.route('/transaction/new/', methods=['POST'])
def add_transaction():
    request_json = request.get_json()
    user_id = request_json.get('userId')
    due_date = request_json.get('dueDate')
    title = request_json.get('title')
    detail = request_json.get('detail')
    group_id = request_json.get('groupId')
    executor_list = request_json.get('executor[]')
    verifier_list = request_json.get('verifiers[]') if request_json.get('verifiers[]') else None
    watcher_list = request_json.get('watchers[]')
    tags_list = request_json.get('tags[]')
    critical = request_json.get('critical')

    notice_id = request_json.get('noticeId')

    db_name = request_json.get('dbName')
    project_id = request_json.get('projectId')
    if db_name is None and project_id is not None:
        db_name = Project().get_project_by_id(project_id, 'mysqlname').get('mysqlname')

    point_list = request_json.get('chartPointList')
    query_circle = request_json.get('chartQueryCircle')
    start_time = request_json.get('chartStartTime')
    end_time = request_json.get('chartEndTime')

    error_msg = ''
    if user_id is None:
        error_msg = 'error: user id is empty'
    elif not due_date:
        error_msg = 'error: complete time is empty'
    elif title is None:
        error_msg = 'error: title is empty'
    elif group_id is None:
        error_msg = 'error: group id is empty'
    elif critical is None:
        error_msg = 'error: critical is empty'
    elif executor_list is None:
        error_msg = 'executor is not selected'

    if error_msg:
        return Utils.beop_response_error(msg=error_msg)

    trans = Transaction()
    model = {
        'title': title,
        'detail': detail,
        'dueDate': due_date,
        'creatorID': user_id,
        'executorID': executor_list[0],
        'groupid': group_id,
        'assignTime': datetime.now(),
        'createTime': datetime.now(),
        'critical': critical,
        'dbName': db_name,
        'chartPointList': point_list,
        'chartQueryCircle': query_circle,
        'chartStartTime': start_time,
        'chartEndTime': end_time,
        "lastUpdateTime": datetime.now(),
        "isRead": 0
    }
    trans_id = trans.add_trans(model)

    if notice_id is not None:
        from beopWeb.BEOPDataAccess import BEOPDataAccess

        BEOPDataAccess.getInstance().updateNoticeWithTransaction(db_name, notice_id, trans_id)

    # 添加或取消收藏
    collection = request_json.get('collection')
    star = Star()
    if collection == '1':
        star.set_star(user_id, trans_id)
    else:
        star.remove_star(user_id, trans_id)

    # 添加相关人员
    tm = TransactionMember()
    if verifier_list is not None:
        for verifier_id in verifier_list:
            tm.add_verifier(trans_id, verifier_id)

    if watcher_list:
        for watcher_id in watcher_list:
            tm.add_watcher(trans_id, watcher_id)
    # 添加标签
    if tags_list:
        tt = TransactionTag()
        for tag_id in tags_list:
            tt.add_tag_to_trans(tag_id, trans_id)
    # 记录添加信息
    record = Record()
    record.add_records(user_id, trans_id, {'detail': json.dumps({'title': title, 'executor': model.get('executorID')})},
                       RecordType.NEW)
    pending_files = request_json.get('pendingFiles')
    if pending_files:
        tm = TransactionAttachment()
        tm.update_new_task_attachment(pending_files, trans_id, user_id)
    # start 新建工单任务
    try:
        te = TransactionEmail()
        te.send_new_email(trans_id, request_json, pending_files)
    except Exception as e:
        pass
    # end
    return Utils.beop_response_success(trans_id)


@bp_workflow.route('/transaction/update/', methods=['POST'])
def update_transaction():
    request_json = request.get_json()
    user_id = request_json.get('userId')
    trans_id = request_json.get('transId')
    trans = Transaction()
    old_trans = trans.get_transaction_by_id(trans_id)

    due_date = request_json.get('dueDate')
    title = request_json.get('title')
    detail = request_json.get('detail')
    group_id = request_json.get('groupId')
    executor_list = request_json.get('executor[]')
    verifier_list = request_json.get('verifiers[]') if request_json.get('verifiers[]') else None
    watcher_list = request_json.get('watchers[]')
    tags_list = request_json.get('tags[]')
    critical = request_json.get('critical')

    error_msg = ''
    if user_id is None:
        error_msg = 'error: user id is empty'
    elif due_date is None:
        error_msg = 'error: complete time is empty'
    elif title is None:
        error_msg = 'error: title is empty'
    elif group_id is None:
        error_msg = 'error: group id is empty'
    elif critical is None:
        error_msg = 'error: critical is empty'

    if error_msg:
        return Utils.beop_response_error(msg=error_msg)

    model = {
        'title': title,
        'detail': detail,
        'dueDate': due_date,
        'executorID': executor_list[0],
        'groupid': group_id,
        'critical': critical,
        "isRead": 0
    }

    # 更新相关人员
    tm = TransactionMember()
    user_map = User().get_all_user_map()

    watcher_db_list = tm.get_watcher(trans_id)
    watcher_id_db_list = []
    if watcher_db_list:
        old_trans['watchers'] = []
        for watcher in watcher_db_list:
            if user_map.get(int(watcher.get('userId'))):
                old_trans['watchers'].append(user_map.get(int(watcher.get('userId'))))
                watcher_id_db_list.append(str(watcher.get('userId')))

    verifier_db_list = tm.get_verifier(trans_id)
    verifier_id_db_list = []
    if verifier_db_list:
        old_trans['verifiers'] = []
        for verifier in verifier_db_list:
            if user_map.get(int(verifier.get('userId'))):
                old_trans['verifiers'].append(user_map.get(int(verifier.get('userId'))))
                verifier_id_db_list.append(str(verifier.get('userId')))

    tm.update_watcher(trans_id, watcher_list)
    if verifier_list is not None:
        tm.update_verifier(trans_id, verifier_list)
    tt = TransactionTag()
    if tags_list:
        tt.update_tag_by_trans_id(trans_id, tags_list)
    else:
        old_tag_list = tt.get_tag_by_trans_id(trans_id)
        if old_tag_list:
            for item in old_tag_list:
                tt.delete_tag_from_trans(trans_id, item.get("tagId"))

    # 收藏切换
    # 添加或取消收藏
    collection = request_json.get('collection')
    star = Star()
    if collection == '1':
        if not star.is_starred(user_id, trans_id):
            star.set_star(user_id, trans_id)
    elif collection == "0":
        if star.is_starred(user_id, trans_id):
            star.remove_star(user_id, trans_id)
    # 记录添加信息
    record = Record()
    record_detail = {}

    if verifier_list is not None:
        if sorted(verifier_list) != sorted(verifier_id_db_list):
            record_detail['verifiers'] = {
                "new": [user_map.get(int(verifier_id)) for verifier_id in verifier_list if
                        user_map.get(int(verifier_id))],
                "old": old_trans.get('verifiers')
            }

    if watcher_list:
        if sorted(watcher_list) != sorted(watcher_id_db_list):
            record_detail['watchers'] = {
                "new": [user_map.get(int(watcher_id)) for watcher_id in watcher_list if
                        user_map.get(int(watcher_id))],
                "old": old_trans.get('watchers')
            }

    if title != old_trans.get('title'):
        record_detail['title'] = {
            "new": title,
            "old": old_trans.get('title')
        }

    if detail != old_trans.get('detail'):
        record_detail['detail'] = {
            "new": model.get('detail'),
            "old": old_trans.get('detail')
        }

    if int(critical) != int(old_trans.get('critical')):
        record_detail['critical'] = {
            "new": model.get('critical'),
            "old": old_trans.get('critical')
        }

    if due_date != old_trans.get('dueDate').strftime('%Y-%m-%d'):
        record_detail['dueDate'] = {
            "new": due_date,
            "old": old_trans.get('dueDate').strftime('%Y-%m-%d')
        }

    if int(group_id) != int(old_trans.get('groupid')):
        record_detail['groupid'] = {
            "new": group_id,
            "old": old_trans.get('groupid')
        }

    if int(model.get('executorID')) != int(old_trans.get('executorID')):
        old_trans['executor'] = user_map.get(old_trans.get('executorID')).get('userfullname')
        new_executor = user_map.get(int(model.get('executorID'))).get('userfullname')
        record_detail['executor'] = {
            "new": new_executor,
            "old": old_trans['executor']
        }
    if len(record_detail) > 0:
        record.add_records_edit(user_id, trans_id, {'detail': json.dumps(record_detail)}, RecordType.EDIT)
        if trans.update_trans(trans_id, model):
            # start 编辑工单详情后发送邮件
            try:
                send_email = TransactionEmail()
                send_email.send_edit_email(user_map.get(old_trans.get('executorID')), verifier_id_db_list,
                                           watcher_id_db_list, request_json, record_detail)
            except Exception as e:
                pass
            # end
            return Utils.beop_response_success(trans_id)
        else:
            return Utils.beop_response_error()
    else:
        return Utils.beop_response_success(trans_id)


@bp_workflow.route('/transaction/<trans_id>', methods=['POST'])
@check_workflow_auth
def get_trans(trans_id):
    rq_data = request.get_json()
    user_id = rq_data.get('user_id')
    if not user_id:
        return Utils.beop_response_error()
    if not trans_id:
        return Utils.beop_response_error()

    transaction = Transaction()
    trans = transaction.get_transaction_by_id(trans_id)
    if not trans:
        return Utils.beop_response_error(msg='can not find this task, task id is ' + trans_id, code=404)
    trans['createTime'] = trans.get('createTime').strftime(Utils.datetime_format_full) if trans.get(
        'createTime') else ''
    trans['dueDate'] = trans.get('dueDate').strftime(Utils.datetime_format_date) if trans.get('dueDate') else ''
    tg = TransactionGroup()
    group = tg.get_trans_group_by_id(trans.get('groupid'))
    trans['groupName'] = group.get('name')
    user = User()
    user_map = user.get_all_user_map()
    trans['executor'] = user_map.get(trans.get('executorID'))
    trans['creator'] = user_map.get(trans.get('creatorID'))

    tm = TransactionMember()
    watcher_db_list = tm.get_watcher(trans_id)
    watchers = [user_map.get(int(watcher_db.get('userId'))) for watcher_db in watcher_db_list if
                user_map.get(int(watcher_db.get('userId')))]

    trans_tag = TransactionTag()
    tag_list = trans_tag.get_tag_by_trans_id(trans_id)
    tag_db = Tag()
    tag_result = []
    for tag in tag_list:
        tag_result.append(tag_db.get_by_id(tag.get('tagId')))

    trans['tags'] = tag_result
    trans['watchers'] = watchers

    verifier_db_list = tm.get_verifier(trans_id)
    trans['verifiers'] = [user_map.get(int(verifier_db.get('userId'))) for verifier_db in verifier_db_list if
                          user_map.get(int(verifier_db.get('userId')))]
    trans['verifiers_status'] = {verifier_db.get('userId'): verifier_db.get('status') for verifier_db in
                                 verifier_db_list}
    trans['permission'] = transaction.get_trans_permission(trans_id, user_id)
    star = Star()
    trans['star'] = star.is_starred(user_id, trans.get('id'))
    return Utils.beop_response_success(trans)


@bp_workflow.route('/transaction/updateStatus', methods=['POST'])
def update_trans_status():
    rq_data = request.get_json()
    trans_id = rq_data.get("transId")
    user_id = rq_data.get("userId")
    if not trans_id or not user_id:
        return Utils.beop_response_error()
    else:
        transaction = Transaction()
        result = transaction.update_trans(trans_id, {"isRead": 1})
        if result:
            return Utils.beop_response_success()
        else:
            return Utils.beop_response_error()


@bp_workflow.route('/transaction/waitMeToVerifier/<int:user_id>/<int:page_num>/<int:page_size>',
                   methods=['POST', 'GET'])
def wait_me_to_verifier(user_id, page_num, page_size):
    result = {
        'total': 0,
        'records': []
    }

    start_num = (page_num - 1) * page_size
    tm = TransactionMember()
    count = tm.get_count_user_wait_verifier(user_id)
    if not count:
        return Utils.beop_response_success(result)
    trans_id_list = tm.get_user_wait_verifier(user_id)
    if not trans_id_list:
        return Utils.beop_response_success(result)
    result['total'] = count
    order = []
    order_property = None
    asc = None
    order = []
    if request.method == 'POST':
        try:
            rq_data = request.get_json()
            order_property = rq_data.get('orderProperty')
            asc = rq_data.get('asc')
            if order_property is not None and asc is not None:
                order = [order_property, 'ASC' if asc else 'DESC']
        except Exception as e:
            pass
    trans = Transaction()
    trans_result = trans.get_wait_me_to_verifier(trans_id_list, start_num, page_size, order)
    if not trans_result:
        return Utils.beop_response_success(result)
    all_user_map = User().get_all_user_map()
    trans_group = TransactionGroup()
    star = Star()
    for item in trans_result:
        user = all_user_map.get(item.get('executorID'))
        item['executorName'] = user.get('userfullname') if user else ''
        group = trans_group.get_trans_group_by_id(item.get('groupid'))
        item['groupName'] = group.get('name')
        item['star'] = star.is_starred(user_id, item.get('id'))
        creator_id = item.get('creatorID')
        if creator_id is not None and int(creator_id) in all_user_map:
            item["creator_info"] = all_user_map[creator_id]
    result['records'] = trans_result
    return Utils.beop_response_success(result)


@bp_workflow.route('/transaction/delete/<trans_id>', methods=['POST'])
def delete_trans(trans_id):
    rq_data = request.get_json()
    user_id = rq_data.get('user_id')
    if not user_id:
        return Utils.beop_response_error()
    if not trans_id:
        return Utils.beop_response_error()

    transaction = Transaction()
    trans = transaction.get_transaction_by_id(trans_id)
    if not trans:
        return Utils.beop_response_error(msg='can not find this task, task id is ' + trans_id)
    permission = transaction.get_trans_permission(trans_id, user_id)
    if permission < 8:
        return Utils.beop_response_error(code=304)
    result = transaction.delete_trans(trans_id)

    if result:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


@bp_workflow.route('/transaction/get_reply/<trans_id>', methods=['GET'])
def get_trans_reply(trans_id):
    if not trans_id:
        return Utils.beop_response_error()
    reply = Reply()
    all_user = User().get_all_user_map()
    reply_list = reply.get_by_trans_id(trans_id)
    for item in reply_list:
        reply_user_id = item.get('replyUserId')
        if reply_user_id:
            reply_user = all_user.get(reply_user_id)
            if reply_user:
                item['userfullname'] = reply_user.get('userfullname')
                item['userpic'] = reply_user.get('userpic')
                item['useremail'] = reply_user.get('useremail')
        item['replyTime'] = item.get('replyTime').strftime(Utils.datetime_format_full)
    return Utils.beop_response_success(reply_list)


@bp_workflow.route('/transaction/get_progress/<trans_id>', methods=['GET'])
def get_trans_progress(trans_id):
    if not trans_id:
        return Utils.beop_response_error()
    record = Record()
    progress = record.get_records_by_trans_id(trans_id)
    if progress:
        all_user = User().get_all_user_map()
        for item in progress:
            user_id = item.get('userId')
            user = all_user.get(user_id)
            if user:
                item['userfullname'] = user.get('userfullname')
                item['userpic'] = user.get('userpic')
                item['useremail'] = user.get('useremail')
            item['opTime'] = item.get('opTime').strftime(Utils.datetime_format_full)

    return Utils.beop_response_success(progress)


@bp_workflow.route('/transaction/search/<int:page_num>/<int:page_size>', methods=['POST'])
def trans_search(page_num, page_size):
    rq_data = request.get_json()
    text = rq_data.get('text')
    user_id = rq_data.get('userId')

    result = {
        'total': 0,
        'records': []
    }

    start_num = (page_num - 1) * page_size

    order = []
    if request.method == 'POST':
        try:
            rq_data = request.get_json()
            order_property = rq_data.get('orderProperty')
            asc = rq_data.get('asc')
            if order_property is not None and asc is not None:
                order = [order_property, 'ASC' if asc else 'DESC']
        except Exception as e:
            pass

    trans = Transaction()
    trans_result = trans.get_transaction_by_text(user_id, text, start_num, page_size, order)

    count = len(trans_result)
    if not count:
        return Utils.beop_response_success(result)

    result['total'] = count

    all_user_map = User().get_all_user_map()
    trans_group = TransactionGroup()
    for item in trans_result:
        user = all_user_map.get(item.get('executorID'))
        item['executorName'] = user.get('userfullname') if user else ''
        group = trans_group.get_trans_group_by_id(item.get('groupid'))
        item['groupName'] = group.get('name')
    result['records'] = trans_result
    return Utils.beop_response_success(result)


@bp_workflow.route('/transaction/complete/', methods=['POST'])
def trans_complete():
    request_json = request.get_json()
    user_id = request_json.get('userId')
    trans_id = request_json.get('transId')
    db_name = request_json.get('dbName')
    project_id = request_json.get('projectId')
    if db_name is None and project_id is not None:
        db_name = Project().get_project_by_id(project_id, 'mysqlname').get('mysqlname')
    if not user_id or not trans_id:
        return Utils.beop_response_error()
    trans_db = Transaction()
    trans = trans_db.get_transaction_by_id(trans_id)
    if not trans:
        return Utils.beop_response_error()
    tm = TransactionMember()
    verifiers = tm.get_verifier(trans_id)
    if not verifiers:
        # 如果没有审核人直接通过
        result = trans_db.update_trans(trans_id, {'statusId': TransactionStatus.DEFAULT_VERIFIED})
    else:
        result = trans_db.update_trans(trans_id, {'statusId': TransactionStatus.COMPLETE})
    # start 工单完成发送邮件
    try:
        te = TransactionEmail()
        status = "complete"
        send_complete_email = te.send_status_email(trans, tm, trans_id, user_id, status)
    except Exception as e:
        pass
    # end
    if result:
        record = Record()
        record.add_records(user_id, trans_id,
                           {},
                           RecordType.COMPLETE)
        return Utils.beop_response_success(trans_id)
    else:
        return Utils.beop_response_error()


@bp_workflow.route('/transaction/pass_verify/', methods=['POST'])
def pass_verify():
    rq_data = request.get_json()
    user_id = rq_data.get('userId')
    trans_id = rq_data.get('transId')
    tm = TransactionMember()
    if not tm.is_verifier(user_id, trans_id):
        return Utils.beop_response_error(code=403)
    result = tm.update_verifier_status(user_id, trans_id, TransactionMemberStatus.PASS)
    trans_db = Transaction()
    # 需要判断是完成通过还是结束通过
    status_id = int(trans_db.get_transaction_by_id(trans_id).get('statusId'))
    if tm.is_all_verify_pass(trans_id) == 1:
        if status_id == TransactionStatus.END or status_id == TransactionStatus.END_VERIFIED or status_id == TransactionStatus.END_NOT_PASS:
            trans_db.update_trans(trans_id, {'statusId': TransactionStatus.END_VERIFIED})
        elif status_id == TransactionStatus.COMPLETE or status_id == TransactionStatus.DEFAULT_NOT_PASS or status_id == TransactionStatus.DEFAULT_VERIFIED:
            trans_db.update_trans(trans_id, {'statusId': TransactionStatus.DEFAULT_VERIFIED})
    elif tm.is_all_verify_pass(trans_id) == 2:
        if status_id == TransactionStatus.END or status_id == TransactionStatus.END_VERIFIED or status_id == TransactionStatus.END_NOT_PASS:
            trans_db.update_trans(trans_id, {'statusId': TransactionStatus.END_NOT_PASS})
        elif status_id == TransactionStatus.COMPLETE or status_id == TransactionStatus.DEFAULT_NOT_PASS or status_id == TransactionStatus.DEFAULT_VERIFIED:
            trans_db.update_trans(trans_id, {'statusId': TransactionStatus.DEFAULT_NOT_PASS})

    if result:
        # 记录添加信息
        record = Record()
        record.add_records(user_id, trans_id, {'detail': json.dumps({'op': 'verified'})},
                           RecordType.VERIFIED)
        # start 工单通过 发邮件
        try:
            trans = trans_db.get_transaction_by_id(trans_id)
            te = TransactionEmail()
            status = "pass_verify"
            send_pass_verify_email = te.send_status_email(trans, tm, trans_id, user_id, status)
        except Exception as e:
            pass
        # end
        return Utils.beop_response_success(trans_id)
    else:
        return Utils.beop_response_error()


@bp_workflow.route('/transaction/not_pass_verify/', methods=['POST'])
def not_pass_verify():
    rq_data = request.get_json()
    user_id = rq_data.get('userId')
    trans_id = rq_data.get('transId')
    tm = TransactionMember()
    if not tm.is_verifier(user_id, trans_id):
        return Utils.beop_response_error(code=403)
    result = tm.update_verifier_status(user_id, trans_id, TransactionMemberStatus.NOT_PASS)
    if result:
        trans_db = Transaction()
        # 需要判断是完成通过还是结束通过
        status_id = int(trans_db.get_transaction_by_id(trans_id).get('statusId'))
        is_all_verify_pass = tm.is_all_verify_pass(trans_id)
        if is_all_verify_pass == 1:
            if status_id == TransactionStatus.END or status_id == TransactionStatus.END_VERIFIED or status_id == TransactionStatus.END_NOT_PASS:
                trans_db.update_trans(trans_id, {'statusId': TransactionStatus.END_VERIFIED})
            elif status_id == TransactionStatus.COMPLETE or status_id == TransactionStatus.DEFAULT_NOT_PASS or status_id == TransactionStatus.DEFAULT_VERIFIED:
                trans_db.update_trans(trans_id, {'statusId': TransactionStatus.DEFAULT_VERIFIED})
        elif is_all_verify_pass >= 2:
            if status_id == TransactionStatus.END or status_id == TransactionStatus.END_VERIFIED or status_id == TransactionStatus.END_NOT_PASS:
                trans_db.update_trans(trans_id, {'statusId': TransactionStatus.END_NOT_PASS})
            elif status_id == TransactionStatus.COMPLETE or status_id == TransactionStatus.DEFAULT_NOT_PASS or status_id == TransactionStatus.DEFAULT_VERIFIED:
                trans_db.update_trans(trans_id, {'statusId': TransactionStatus.DEFAULT_NOT_PASS})
                # 记录添加信息
        record = Record()
        record.add_records(user_id, trans_id, {'detail': json.dumps({'op': 'not_pass'})},
                           RecordType.NOT_PASS)

        # start 工单不通过 发邮件
        try:
            trans = trans_db.get_transaction_by_id(trans_id)
            te = TransactionEmail()
            status = "not_pass_verify"
            send_not_pass_verify_email = te.send_status_email(trans, tm, trans_id, user_id, status)
        except Exception as e:
            pass
        # end
        return Utils.beop_response_success(trans_id)
    else:
        return Utils.beop_response_error()


# 获取已经创建的工单任务（没有开始）
@bp_workflow.route('/transaction/get_new_created/<int:user_id>/<int:page_num>/<int:page_size>', methods=['GET', 'POST'])
def get_new_created(user_id, page_num, page_size):
    result = {
        'total': 0,
        'records': []
    }

    start_num = (page_num - 1) * page_size
    trans = Transaction()
    count = trans.get_count_new_created(user_id)
    if not count:
        return Utils.beop_response_success(result)
    result['total'] = count

    order = []
    order_property = None
    asc = None
    order = []
    if request.method == 'POST':
        try:
            rq_data = request.get_json()
            order_property = rq_data.get('orderProperty')
            asc = rq_data.get('asc')
            if order_property is not None and asc is not None:
                order = [order_property, 'ASC' if asc else 'DESC']
        except Exception as e:
            pass
    trans_result = trans.get_new_created(user_id, start_num, page_size, order)
    all_user_map = User().get_all_user_map()
    trans_group = TransactionGroup()
    star = Star()
    for item in trans_result:
        user = all_user_map.get(item.get('executorID'))
        item['executorName'] = user.get('userfullname') if user else ''
        group = trans_group.get_trans_group_by_id(item.get('groupid'))
        item['groupName'] = group.get('name')
        item['star'] = star.is_starred(user_id, item.get('id'))
        creator_id = item.get('creatorID')
        if creator_id is not None and int(creator_id) in all_user_map:
            item["creator_info"] = all_user_map[creator_id]
    result['records'] = trans_result
    return Utils.beop_response_success(result)


#  得到进行中的工单
@bp_workflow.route('/transaction/get_started_trans/<int:user_id>/<int:page_num>/<int:page_size>',
                   methods=['GET', 'POST'])
def get_started_trans(user_id, page_num, page_size):
    result = {
        'total': 0,
        'records': []
    }

    start_num = (page_num - 1) * page_size
    trans = Transaction()
    count = trans.get_count_started_trans(user_id)
    if not count:
        return Utils.beop_response_success(result)
    result['total'] = count

    order = []
    order_property = None
    asc = None
    order = []
    if request.method == 'POST':
        try:
            rq_data = request.get_json()
            order_property = rq_data.get('orderProperty')
            asc = rq_data.get('asc')
            if order_property is not None and asc is not None:
                order = [order_property, 'ASC' if asc else 'DESC']
        except Exception as e:
            pass
    trans_result = trans.get_started_trans(user_id, start_num, page_size, order)
    all_user_map = User().get_all_user_map()
    trans_group = TransactionGroup()
    star = Star()
    for item in trans_result:
        user = all_user_map.get(item.get('executorID'))
        item['executorName'] = user.get('userfullname') if user else ''
        group = trans_group.get_trans_group_by_id(item.get('groupid'))
        item['groupName'] = group.get('name')
        item['star'] = star.is_starred(user_id, item.get('id'))
        creator_id = item.get('creatorID')
        if creator_id is not None and int(creator_id) in all_user_map:
            item["creator_info"] = all_user_map[creator_id]
    result['records'] = trans_result
    return Utils.beop_response_success(result)


#  得到待审核中的工单
@bp_workflow.route('/transaction/get_wait_verify_trans/<int:user_id>/<int:page_num>/<int:page_size>',
                   methods=['GET', 'POST'])
def get_wait_verify_trans(user_id, page_num, page_size):
    result = {
        'total': 0,
        'records': []
    }

    start_num = (page_num - 1) * page_size
    trans = Transaction()
    count = trans.get_count_wait_verify_trans(user_id)
    if not count:
        return Utils.beop_response_success(result)
    result['total'] = count

    order = []
    order_property = None
    asc = None
    order = []
    if request.method == 'POST':
        try:
            rq_data = request.get_json()
            order_property = rq_data.get('orderProperty')
            asc = rq_data.get('asc')
            if order_property is not None and asc is not None:
                order = [order_property, 'ASC' if asc else 'DESC']
        except Exception as e:
            pass
    trans_result = trans.get_wait_verify_trans(user_id, start_num, page_size, order)
    all_user_map = User().get_all_user_map()
    trans_group = TransactionGroup()
    star = Star()
    for item in trans_result:
        user = all_user_map.get(item.get('executorID'))
        item['executorName'] = user.get('userfullname') if user else ''
        group = trans_group.get_trans_group_by_id(item.get('groupid'))
        item['groupName'] = group.get('name')
        item['star'] = star.is_starred(user_id, item.get('id'))
        creator_id = item.get('creatorID')
        if creator_id is not None and int(creator_id) in all_user_map:
            item["creator_info"] = all_user_map[creator_id]
    result['records'] = trans_result
    return Utils.beop_response_success(result)




    # 开始任务


@bp_workflow.route('/transaction/start_trans/<int:user_id>/<int:trans_id>', methods=['POST'])
def start_trans(user_id, trans_id):
    if not user_id or not trans_id:
        return Utils.beop_response_error(code=403)
    trans = Transaction()
    result = trans.start_trans(trans_id)
    if result:
        # 记录添加信息
        record = Record()
        record_detail = {
            'op': 'start'
        }
        record.add_records(user_id, trans_id,
                           {'detail': json.dumps(record_detail)},
                           RecordType.START)
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


# 转发，更新执行人员
@bp_workflow.route('/transaction/update_executor/<int:user_id>/<int:trans_id>', methods=['POST'])
def update_executor(user_id, trans_id):
    if not user_id or not trans_id:
        return Utils.beop_response_error(code=403)
    rq_data = request.get_json()
    current_executor = rq_data.get("new")
    old_executor = rq_data.get('old')
    # 判断新老是否重复
    # if int(current_executor) == int(old_executor):
    #  return Utils.beop_response_error(msg='new executor is not different from old executor')
    trans = Transaction()
    result = 1
    result *= trans.update_executor(trans_id, current_executor.get('id'))

    # 转发成功,把之前执行人加到相关人员
    if result:
        TransactionMember().add_watcher(trans_id, user_id)

    current_status = trans.get_transaction_by_id(trans_id).get('statusId')

    # 只有在 新开始 审核不通过 和 开始后 可以转发
    if current_status == TransactionStatus.NEW \
            or current_status == TransactionStatus.DEFAULT_NOT_PASS \
            or current_status == TransactionStatus.END_NOT_PASS \
            or current_status == TransactionStatus.START:
        result *= trans.update_trans(trans_id, {
            "statusId": TransactionStatus.NEW,
            "isRead": 0
        })
        # 转发之后需要重置审核人的状态
        result *= TransactionMember().restore_verifier_satus(trans_id)
    else:
        return Utils.beop_response_error(code=403)
    if result:
        # 记录添加信息
        record = Record()
        record_detail = {
            'executor': {
                'new': current_executor.get('userfullname'),
                'old': old_executor.get('userfullname')
            }
        }
        record.add_records(user_id, trans_id,
                           {'detail': json.dumps(record_detail)},
                           RecordType.FORWARD)
        # 转发后发送邮件
        try:
            tm = TransactionEmail()
            tm.send_forward_email(user_id, trans_id, old_executor, current_executor)
        except Exception as e:
            pass

        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


@bp_workflow.route('/transaction/close_task/<user_id>/<trans_id>', methods=['POST'])
def close_task(user_id, trans_id):
    if not user_id or not trans_id:
        return Utils.beop_response_error(code=403)
    trans = Transaction()
    result = trans.close_task(trans_id)
    if result:
        # 记录添加信息
        record = Record()
        record_detail = {
            'op': 'close'
        }
        record.add_records(user_id, trans_id,
                           {'detail': json.dumps(record_detail)},
                           RecordType.CLOSE)
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()
        # 获取停止后验证通过的工单


@bp_workflow.route('/transaction/get_stop_verified/<int:user_id>/<int:page_num>/<int:page_size>',
                   methods=['GET', 'POST'])
def get_stop_verified(user_id, page_num, page_size):
    result = {
        'total': 0,
        'records': []
    }

    start_num = (page_num - 1) * page_size
    trans = Transaction()
    count = trans.get_count_stop_verified(user_id)
    if not count:
        return Utils.beop_response_success(result)
    result['total'] = count

    order = []
    order_property = None
    asc = None
    order = []
    if request.method == 'POST':
        try:
            rq_data = request.get_json()
            order_property = rq_data.get('orderProperty')
            asc = rq_data.get('asc')
            if order_property is not None and asc is not None:
                order = [order_property, 'ASC' if asc else 'DESC']
        except Exception as e:
            pass
    trans_result = trans.get_stop_verified_task(user_id, start_num, page_size, order)
    all_user_map = User().get_all_user_map()
    trans_group = TransactionGroup()
    star = Star()
    for item in trans_result:
        user = all_user_map.get(item.get('executorID'))
        item['executorName'] = user.get('userfullname') if user else ''
        group = trans_group.get_trans_group_by_id(item.get('groupid'))
        item['groupName'] = group.get('name')
        item['star'] = star.is_starred(user_id, item.get('id'))
        creator_id = item.get('creatorID')
        if creator_id is not None and int(creator_id) in all_user_map:
            item["creator_info"] = all_user_map[creator_id]
    result['records'] = trans_result
    return Utils.beop_response_success(result)


    # 获取完成后验证通过的工单


@bp_workflow.route('/transaction/get_complete_verified/<int:user_id>/<int:page_num>/<int:page_size>',
                   methods=['GET', 'POST'])
def get_complete_verified(user_id, page_num, page_size):
    result = {
        'total': 0,
        'records': []
    }

    start_num = (page_num - 1) * page_size
    trans = Transaction()
    count = trans.get_count_complete_verified(user_id)
    if not count:
        return Utils.beop_response_success(result)
    result['total'] = count

    order = []
    order_property = None
    asc = None
    order = []
    if request.method == 'POST':
        try:
            rq_data = request.get_json()
            order_property = rq_data.get('orderProperty')
            asc = rq_data.get('asc')
            if order_property is not None and asc is not None:
                order = [order_property, 'ASC' if asc else 'DESC']
        except Exception as e:
            pass
    trans_result = trans.get_complete_verified_task(user_id, start_num, page_size, order)
    all_user_map = User().get_all_user_map()
    trans_group = TransactionGroup()
    star = Star()
    for item in trans_result:
        user = all_user_map.get(item.get('executorID'))
        item['executorName'] = user.get('userfullname') if user else ''
        group = trans_group.get_trans_group_by_id(item.get('groupid'))
        item['groupName'] = group.get('name')
        item['star'] = star.is_starred(user_id, item.get('id'))
        creator_id = item.get('creatorID')
        if creator_id is not None and int(creator_id) in all_user_map:
            item["creator_info"] = all_user_map[creator_id]
    result['records'] = trans_result
    return Utils.beop_response_success(result)


@bp_workflow.route('/transaction/filter/<int:user_id>', methods=['POST'])
def transaction_filter(user_id):
    if not user_id:
        return Utils.beop_response_error(403)
    rq_data = request.get_json()
    filter = rq_data.get('filter')
    page = rq_data.get('page')
    limit = rq_data.get("limit")
    order = rq_data.get("order")
    ta = Transaction()
    result = {}
    user = User()
    all_user_map = user.get_all_user_map()
    trans_group = TransactionGroup()
    star = Star()
    trans_result, count = ta.get_working_filter(user_id, page, limit, filter,
                                                order=[order.get("orderProperty"), order.get("asc")])
    for item in trans_result:
        user = all_user_map.get(item.get('executorID'))
        item['executorName'] = user.get('userfullname') if user else ''
        group = trans_group.get_trans_group_by_id(item.get('groupid'))
        item['groupName'] = group.get('name')
        item['star'] = star.is_starred(user_id, item.get('id'))
        creator_id = item.get('creatorID')
        if creator_id is not None and int(creator_id) in all_user_map:
            item["creator_info"] = all_user_map[creator_id]
    result['records'] = trans_result
    result["total"] = count
    return Utils.beop_response_success(result)
