from flask import request, json
from datetime import datetime
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

    trans_result = trans.get_working(user_id, start_num, page_size, order)
    all_user_map = User().get_all_user_map()
    trans_group = TransactionGroup()
    star = Star()
    for item in trans_result:
        user = all_user_map.get(item.get('executorID'))
        item['executorName'] = user.get('userfullname') if user else ''
        group = trans_group.get_trans_group_by_id(item.get('groupid'))
        item['groupName'] = group.get('name')
        item['star'] = star.is_starred(user_id, item.get('id'))

    result['records'] = trans_result
    return Utils.beop_response_success(result)


@bp_workflow.route('/group/transaction/<group_id>/<user_id>/<int:page_num>/<int:page_size>', methods=['GET', 'POST'])
def trans_in_group(group_id, user_id, page_num, page_size):
    result = {
        'total': 0,
        'records': []
    }
    start_num = (page_num - 1) * page_size
    trans = Transaction()
    count = trans.get_count_by_group_id(group_id)
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

    trans_result = trans.get_by_group_id(group_id, start_num, page_size, order)

    all_user_map = User().get_all_user_map()
    trans_group = TransactionGroup()
    star = Star()
    for item in trans_result:
        user = all_user_map.get(item.get('executorID'))
        item['executorName'] = user.get('userfullname') if user else ''
        group = trans_group.get_trans_group_by_id(item.get('groupid'))
        item['groupName'] = group.get('name')
        item['star'] = star.is_starred(user_id, item.get('id'))
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
            m_time_list.append(datetime.strptime(time, Utils.datetime_format_full).strftime('%H:%M'))
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
    verifier_list = request_json.get('verifiers[]') if request_json.get('verifiers[]') else [user_id]
    watcher_list = request_json.get('watchers[]')
    tags_list = request_json.get('tagNames[]')
    critical = request_json.get('critical')

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
    elif verifier_list is None:
        error_msg = 'verifier  is not selected'

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
        'chartEndTime': end_time
    }
    trans_id = trans.add_trans(model)

    # 添加或取消收藏
    collection = request_json.get('collection')
    star = Star()
    if collection == '1':
        star.set_star(user_id, trans_id)
    else:
        star.remove_star(user_id, trans_id)

    # 添加相关人员
    tm = TransactionMember()
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
    # start 新建工单任务
    te = TransactionEmail()
    new_email_subject = "新工单"
    send_new_email_result = te.send_new_email(trans_id, request_json, new_email_subject)
    # end
    return Utils.beop_response_success(trans_id)


@bp_workflow.route('/transaction/update/', methods=['POST'])
def update_transaction():
    request_json = request.get_json()
    user_id = request_json.get('userId')
    trans_id = request_json.get('transId')
    trans = Transaction()
    old_trans = trans.get_transaction_by_id(trans_id)
    is_creator = False
    if str(old_trans.get('creatorID')) == str(user_id):
        is_creator = True
    if is_creator:
        due_date = request_json.get('dueDate')
        title = request_json.get('title')
        detail = request_json.get('detail')
        group_id = request_json.get('groupId')
        executor_list = request_json.get('executor[]')
        verifier_list = request_json.get('verifiers[]') if request_json.get('verifiers[]') else [user_id]
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
            'critical': critical
        }
    else:
        executor_list = request_json.get('executor[]')
        tags_list = request_json.get('tags[]')
        model = {
            'executorID': executor_list[0]
        }

    result = trans.update_trans(trans_id, model)

    # 更新相关人员
    tm = TransactionMember()
    user_map = User().get_all_user_map()
    if is_creator:
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
        tm.update_verifier(trans_id, verifier_list)

    if tags_list:
        tt = TransactionTag()
        tt.update_tag_by_trans_id(trans_id, tags_list)

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
    if is_creator:
        if verifier_list:
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
    record.add_records_edit(user_id, trans_id, {'detail': json.dumps(record_detail)}, RecordType.EDIT)
    if result:
        # start 编辑工单详情后发送邮件
        edit_email_subject = '修改工单任务'
        send_email = TransactionEmail()
        send_email_result = send_email.send_edit_email(user_map.get(old_trans.get('executorID')), verifier_id_db_list,
                                                       watcher_id_db_list, request_json, record_detail,
                                                       edit_email_subject)
        # end
        return Utils.beop_response_success(trans_id)
    else:
        return Utils.beop_response_error()


@bp_workflow.route('/transaction/<trans_id>', methods=['POST'])
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
    trans = Transaction()
    count = trans.get_count_by_text(user_id, text)
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

    trans = Transaction()
    trans_result = trans.get_transaction_by_text(user_id, text, start_num, page_size, order)

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
        result = trans_db.update_trans(trans_id, {'statusId': TransactionStatus.VERIFIED})
    else:
        result = trans_db.update_trans(trans_id, {'statusId': TransactionStatus.COMPLETE})
    # start 工单完成发送邮件
    te = TransactionEmail()
    status = "complete"
    status_subject = "完成任务"
    send_complete_email = te.send_status_email(trans, tm, trans_id, user_id, status, status_subject)
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
    if tm.is_all_verify_pass(trans_id) == 1:
        trans_db.update_trans(trans_id, {'statusId': TransactionStatus.VERIFIED})
    elif tm.is_all_verify_pass(trans_id) == 2:
        trans_db.update_trans(trans_id, {'statusId': TransactionStatus.NOT_PASS})

    if result:
        # 记录添加信息
        record = Record()
        record.add_records(user_id, trans_id, {'detail': json.dumps({'op': 'verified'})},
                           RecordType.VERIFIED)
        # start 工单通过 发邮件
        trans = trans_db.get_transaction_by_id(trans_id)
        te = TransactionEmail()
        status = "pass_verify"
        status_subject = "任务通过"
        send_pass_verify_email = te.send_status_email(trans, tm, trans_id, user_id, status, status_subject)
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

    # 记录添加信息
    record = Record()
    record.add_records(user_id, trans_id, {'detail': json.dumps({'op': 'not_pass'})},
                       RecordType.NOT_PASS)

    if result:
        trans_db = Transaction()
        trans_db.update_trans(trans_id, {'statusId': TransactionStatus.NOT_PASS})
        # start 工单不通过 发邮件
        trans = trans_db.get_transaction_by_id(trans_id)
        te = TransactionEmail()
        status = "not_pass_verify"
        status_subject = "任务不通过"
        send_not_pass_verify_email = te.send_status_email(trans, tm, trans_id, user_id, status, status_subject)
        # end
        return Utils.beop_response_success(trans_id)
    else:
        return Utils.beop_response_error()
