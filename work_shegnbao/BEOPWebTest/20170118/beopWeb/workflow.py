"""
Routes and views for the flask application.
"""

from beopWeb.views import *
from beopWeb.mod_common.Utils import Utils
from beopWeb.BEOPMongoDataAccess import BEOPMongoDataAccess
from beopWeb.MongoConnManager import MongoConnManager

@app.route('/workflow/transaction/getAll/<userId>')
def workflow_transaction_getAll(userId):
    return json.dumps(BEOPDataAccess.getInstance().getAllWorkflowTransaction(userId), ensure_ascii=True)


@app.route('/workflow/transaction/get/<transactionId>')
def workflow_transaction_get(transactionId):
    return json.dumps(BEOPDataAccess.getInstance().getWorkflowTransaction(transactionId), ensure_ascii=True)


@app.route('/workflow/user/executors')
def workflow_user_executors():
    return json.dumps(BEOPDataAccess.getInstance().getWorkflowUsers(), ensure_ascii=True)


@app.route('/workflow/transaction/start/', methods=['POST'])
def workflow_transaction_start():
    requestData = request.get_json()
    transId = requestData['trans_id']
    userId = requestData['user_id']
    if transId == None or userId == None:
        return 'transaction id or user id is empty.'
    else:
        result = BEOPDataAccess.getInstance().startWorkflowTransaction(transId, userId)
        return 'success' if result else 'failed'


@app.route('/workflow/transaction/restart/', methods=['POST'])
def workflow_transaction_restart():
    requestData = request.get_json()
    transId = requestData['trans_id']
    userId = requestData['user_id']
    if transId == None or userId == None:
        return 'transaction id or user id is empty.'
    else:
        result = BEOPDataAccess.getInstance().restartWorkflowTransaction(transId, userId)
        return 'success' if result else 'failed'


@app.route('/workflow/transaction/pause/', methods=['POST'])
def workflow_transaction_pause():
    requestData = request.get_json()
    transId = requestData['trans_id']
    userId = requestData['user_id']
    if transId == None or userId == None:
        return 'transaction id or user id is empty.'
    else:
        result = BEOPDataAccess.getInstance().pauseWorkflowTransaction(transId, userId)
        return 'success' if result else 'failed'


@app.route('/workflow/transaction/verified/', methods=['POST'])
def workflow_transaction_verified():
    requestData = request.get_json()
    transId = requestData['trans_id']
    userId = requestData['user_id']
    if transId == None or userId == None:
        return 'transaction id or user id is empty.'
    else:
        result = BEOPDataAccess.getInstance().verifiedWorkflowTransaction(transId, userId)
        return 'success' if result else 'failed'


@app.route('/workflow/transaction/new', methods=['POST'])
def workflow_transaction_new():
    return json.dumps(BEOPDataAccess.getInstance().workflowTransactionNew(request.get_json()), ensure_ascii=True)


@app.route('/workflow/transaction/newdiagnosealarm', methods=['POST'])
def workflow_transaction_newdiagnosealarm():
    return json.dumps(BEOPDataAccess.getInstance().workflowTransactionNewDiagnoseAlarm(request.get_json()),
                      ensure_ascii=True)


@app.route('/workflow/transaction/assign', methods=['POST'])
def workflow_transaction_assign():
    return json.dumps(BEOPDataAccess.getInstance().workflowTransactionAssign(request.get_json()), ensure_ascii=True)


# @app.route('/workflow/team/<user_id>/<group_id>')
# def workflow_team(user_id, group_id):
#     if group_id is None:
#         return 'group id is empty'
#     elif user_id is None:
#         return 'user id is empty'
#     else:
#         return json.dumps(BEOPDataAccess.getInstance().getWorkflowTeam(user_id, group_id), ensure_ascii=True)


@app.route('/workflow/team/delete', methods=['POST'])
def workflow_team_del():
    request_json = request.get_json()
    user_id = request_json.get('userID')
    role_id = request_json.get('roleID')
    project_id = request_json.get('projectID')
    if user_id is None:
        return 'user id is empty'
    elif role_id is None:
        return 'role id is empty'
    elif project_id is None:
        return 'project id is empty'
    result = BEOPDataAccess.getInstance().deleteTeamMember(user_id, role_id, project_id)
    return 'success' if result else 'failed'


@app.route('/workflow/team/getmember', methods=['POST'])
def workflow_team_getmember():
    request_data = request.get_json()
    project_id = request_data['projectID']
    role_id = request_data['roleID']
    if project_id is None or role_id is None:
        return 'error: project id or role id is empty.'
    return json.dumps(BEOPDataAccess.getInstance().getTeamMember(project_id, role_id), ensure_ascii=True)


@app.route('/workflow/team/addmember', methods=['POST'])
def workflow_team_addmember():
    return BEOPDataAccess.getInstance().addTeamMember(request.get_json())


@app.route('/workflow/profile/<user_id>')
def workflow_profile(user_id):
    return json.dumps(BEOPDataAccess.getInstance().workflowProfile(user_id), ensure_ascii=True)


@app.route('/workflow/complete/', methods=['POST'])
def workflow_complete():
    request_data = request.get_json()
    trans_id = request_data.get('trans_id')
    user_id = request_data.get('user_id')
    if trans_id is None or user_id is None:
        return 'transaction id or user id is empty.'
    else:
        result = BEOPDataAccess.getInstance().completeWorkflowTransaction(trans_id, user_id)
        return 'success' if result else 'failed'


@app.route('/workflow/transaction/notCompleted/<userId>')
def workflow_transaction_getNotCompleted(userId):
    return json.dumps(BEOPDataAccess.getInstance().getNotCompetedTransaction(userId), ensure_ascii=True)


@app.route('/workflow/transaction/setPriority', methods=['POST'])
def workflow_transaction_setPriority():
    request_json = request.get_json()
    trans_id = request_json['id']
    priority = request_json['priority']
    if trans_id is None or priority is None:
        return None
    else:
        result = BEOPDataAccess.getInstance().setTransactionPriority(trans_id, priority)
        return 'success' if result else 'failed'


@app.route('/workflow/transaction/completed/<userId>')
def workflow_transaction_getCompleted(userId):
    if userId is None:
        return None
    else:
        return json.dumps(BEOPDataAccess.getInstance().getAllCompleted(userId), ensure_ascii=True)


@app.route('/workflow/transaction/starred/<userId>')
def workflow_transaction_getStarred(userId):
    if userId is None:
        return None
    else:
        return json.dumps(BEOPDataAccess.getInstance().getAllStarred(userId), ensure_ascii=True)


@app.route('/workflow/transaction/star/', methods=['POST'])
def workflow_transaction_toggle_starred():
    request_json = request.get_json()
    trans_id = request_json.get('trans_id')
    user_id = request_json.get('user_id')
    if trans_id is None:
        return 'The transaction id is empty'
    elif user_id is None:
        return 'The user id is empty'
    else:
        result = BEOPDataAccess.getInstance().toggle_starred(trans_id, user_id)
        return 'success' if result else 'failed'


@app.route('/workflow/transaction/edit', methods=['POST'])
def workflow_transaction_edit():
    request_json = request.get_json()
    trans_id = request_json.get('transId')
    title = request_json.get('title')
    due_date = request_json.get('dueDate')
    executor_id = request_json.get('executorID')
    user_id = request_json.get('userId')
    critical = request_json.get('critical')
    detail = request_json.get('detail')
    if trans_id is None:
        return 'transaction id is empty.'
    else:
        edit_result = BEOPDataAccess.getInstance().editTransaction(trans_id, user_id, title=title, dueDate=due_date,
                                                                   executorID=executor_id, critical=critical,
                                                                   detail=detail)
        operations = BEOPDataAccess.getInstance().workflow_get_transaction_operations(trans_id)
        return jsonify(result=edit_result, operations=operations)


@app.route('/workflow/group/add/', methods=['POST'])
def workflow_group_add():
    request_json = request.get_json()
    group_name = request_json.get('name')
    user_id = request_json.get('userId')
    description = request_json.get('description')
    if group_name is None:
        return 'error: name can\'t be empty'
    elif user_id is None:
        return 'error: creator\' id can\'t be empty'
    else:
        return json.dumps(BEOPDataAccess.getInstance().addGroup(user_id, group_name, description), ensure_ascii=True)


# mango added 2014-12-15 for js main init
@app.route('/workflow/transaction/init', methods=['POST'])
def workflow_init():
    request_json = request.get_json()
    user_id = request_json.get('user_id')
    if user_id is None:
        return 'user id is empty'
    result_list = BEOPDataAccess.getInstance().workflow_get_main_page_info(user_id)
    my_dict = {'group_info': result_list}
    return json.dumps(my_dict)


# mango added 2014-12-15 for js detail reply
@app.route('/workflow/transaction/notice/<user_id>/<record_id>')
def workflow_detail_reply(user_id, record_id):
    da_instance = BEOPDataAccess.getInstance()
    record_detail = da_instance.workflow_get_status_by_transaction_id(user_id, record_id)
    reply_list = da_instance.workflow_get_transaction_reply(record_id)
    operations = da_instance.workflow_get_transaction_operations(record_id)
    status_flow = {'assign': []}
    status_flow_index = ['new', 'start', 'assign', 'complete', 'verified']
    first_start_added = False
    for item in operations:
        if item.get('op') == 'new':
            status_flow['new'] = item
            status_flow['new']['flowStatus'] = 1
            try:
                detail_obj = json.loads(item.get('detail'))
                executor_id = detail_obj.get('executor')
                if executor_id:
                    executor_profile = da_instance.getUserProfileById(executor_id)
                    status_flow['new']['executor_id'] = executor_id
                    status_flow['new']['executor_userfullname'] = executor_profile.get('fullname')
                    status_flow['new']['executor_userpic'] = 'http://images.rnbtech.com.hk' + \
                                                             str(executor_profile.get('picture'))
            except Exception as e:
                pass
        if item.get('op') == 'start' and not first_start_added:
            status_flow['start'] = item
            status_flow['start']['flowStatus'] = 1
            first_start_added = True
        if item.get('op') == 'verified':
            status_flow['verified'] = item
            status_flow['verified']['flowStatus'] = 1
        if item.get('op') == 'edit':
            try:
                detail = json.loads(item.get('detail'))
                if detail.get('assignTime'):
                    status_flow['assign'].append(detail)
            except Exception as e:
                pass

    if record_detail.get('statusId', '') == 4 or record_detail.get('statusId', '') == 5:
        for item in operations:
            if item.get('op') == 'complete':
                status_flow['complete'] = item
                status_flow['complete']['flowStatus'] = 1
                break

    if 'start' not in status_flow:
        status_flow['start'] = {"op": "start",
                                "flowStatus": 0,
                                "userfullname": record_detail.get('executorName', ''),
                                "userpic": record_detail.get('executorPic', '')}

    if 'complete' not in status_flow:
        status_flow['complete'] = {"op": "complete",
                                   "flowStatus": 0,
                                   "userfullname": record_detail.get('executorName', ''),
                                   "userpic": record_detail.get('executorPic', '')}

    if 'verified' not in status_flow:
        status_flow['verified'] = {"op": "verified",
                                   "flowStatus": 0,
                                   "userfullname": record_detail.get('creatorName', ''),
                                   "userpic": record_detail.get('creatorPic', '')}

    status_flow_result = [status_flow.get(status) for status in status_flow_index]

    is_editable = record_detail.get('executorId', None) == int(user_id)

    return jsonify(replyList=reply_list, record_detail=record_detail,
                   isEditable=is_editable, operations=operations, status_flow=status_flow_result,
                   success=True)


@app.route('/workflow/projectmember/<project_id>')
def workflow_projectmember_get(project_id):
    if project_id is None:
        return 'error: project id is empty.'
    return json.dumps(BEOPDataAccess.getInstance().getProjectMembers(project_id), ensure_ascii=True)


@app.route('/workflow/group/<user_id>/<project_id>')
def workflow_project_get(user_id, project_id):
    if project_id is None:
        return 'error: project id is empty.'
    if user_id is None:
        return 'error: user id is empty.'
    return json.dumps(BEOPDataAccess.getInstance().workflow_get_project(user_id, project_id), ensure_ascii=True)


@app.route('/workflow/group/delete/', methods=['POST'])
def workflow_project_delete():
    request_json = request.get_json()
    project_id = request_json.get('id')
    if project_id is None:
        return 'error: project id is empty.'
    result = BEOPDataAccess.getInstance().workflow_delete_project(project_id)
    return 'success' if result else 'failed'


@app.route('/workflow/transaction/delete/', methods=['POST'])
def workflow_transaction_delete():
    request_json = request.get_json()
    task_id = request_json.get('task_id')
    if task_id is None:
        return 'error: task id is empty'
    result = BEOPDataAccess.getInstance().workflow_delete_transaction(task_id)
    return 'success' if result else 'failed'


@app.route('/workflow/group/edit/', methods=['POST'])
def workflow_project_edit():
    request_json = request.get_json()
    project_id = request_json.get('id')
    project_name = request_json.get('name')
    project_desc = request_json.get('desc')
    if project_id is None:
        return 'error: project id is empty.'
    if project_name is None:
        return 'error: project name is empty'
    isOK = BEOPDataAccess.getInstance().workflow_edit_project(project_id, project_name, project_desc)
    return 'success' if isOK else 'failed'


@app.route('/workflow/transaction/add/', methods=['POST'])
def workflow_transaction_add():
    request_json = request.get_json()
    user_id = request_json.get('userId')
    due_date = request_json.get('dueDate')
    title = request_json.get('title')
    detail = request_json.get('detail')
    group_id = request_json.get('groupId')
    executor_id = request_json.get('executorId')
    critical = request_json.get('critical')
    dbName = request_json.get('dbName')
    notice_id = request_json.get('noticeId')
    if dbName is None:
        dbName = BEOPDataAccess.getInstance().getProjMysqldb(request_json.get('projectId'))

    chartPointList = request_json.get('chartPointList')
    chartQueryCircle = request_json.get('chartQueryCircle')
    chartStartTime = request_json.get('chartStartTime')
    chartEndTime = request_json.get('chartEndTime')

    if user_id is None:
        return 'error: user id is empty'
    elif due_date is None:
        return 'error: complete time is empty'
    elif title is None:
        return 'error: title is empty'
    elif group_id is None:
        return 'error: group id is empty'
    elif critical is None:
        return 'error: critical is empty'
    else:
        new_id = BEOPDataAccess.getInstance().addTransaction(user_id, due_date, title, detail, group_id, executor_id,
                                                             critical, dbName, chartPointList, chartQueryCircle,
                                                             chartStartTime, chartEndTime)
        if notice_id is not None:
            BEOPDataAccess.getInstance().updateNoticeWithTransaction(dbName, notice_id, new_id)
        return Utils.beop_response_success(new_id)


# mango added
@app.route('/workflow/transaction/insert_reply/', methods=['POST'])
def insert_one_notice_detail():
    request_json = request.get_json()
    ofTransactionId = request_json.get('ofTransactionId')
    replyUserId = request_json.get('replyUserId')
    replyTime = request_json.get('replyTime')
    detail = request_json.get('detail')

    if ofTransactionId is None:
        return 'error: ofTransactionId is empty'
    elif replyUserId is None:
        return 'error: replyUserId is empty'
    elif replyTime is None:
        return 'error: replyTime is empty'
    elif detail is None:
        return 'error: detail is empty'
    else:
        result = BEOPDataAccess.getInstance().add_transaction_reply(ofTransactionId, replyUserId, replyTime, detail)
        return 'success' if result else 'failed'


@app.route('/workflow/new_task_count/<user_id>', methods=['GET'])
def get_new_task_count(user_id):
    if user_id is None:
        return 'user id is empty'
    else:
        return json.dumps(BEOPDataAccess.getInstance().get_new_task_count(user_id), ensure_ascii=True)


@app.route('/workflow/uploadReport/<projId>/<reportName>', methods=['POST'])
def uploadReport(projId, reportName):
    rt = "successful"

    projName = BEOPDataAccess.getInstance().getProjNameById(projId)
    assert (len(projName) > 0)
    dirPath = 'beopWeb/static/projectReports/reports/' + projName + '/' + reportName
    bPathExist = os.path.exists(dirPath)
    try:
        if not bPathExist:
            os.makedirs(dirPath)
        keys = request.files.keys()
        if 'reportFile' in keys:
            f = request.files['reportFile']
            f.save(dirPath + '/' + f.filename)
    except Exception as e:
        rt = "failed"
    return rt


@app.route('/workflow/getTransactionGroupMembers/<group_id>', methods=['GET'])
def getSameGroupMembers(group_id):
    member_list = BEOPDataAccess.getInstance().getTransactionGroupMembers(group_id)
    return json.dumps(member_list, ensure_ascii=True)


@app.route('/beopWeb/autotest/uploadReport/<fname>', methods=['GET', 'POST'])
def autotestupload(fname):
    '''autotest_upload'''
    rt = "successful"
    dirPath = 'beopWeb/autotest/' + fname
    bPathExist = os.path.exists(dirPath)
    if request.method == 'POST':
        try:
            if not bPathExist:
                os.makedirs(dirPath)
            keys = request.files.keys()
            if 'file' in keys:
                f = request.files['file']
                f.save(dirPath + '/' + f.filename)
        except Exception as e:
            rt = "failed"
        return rt,
    return render_template('temp/autotest_upload.html', fname=fname)
