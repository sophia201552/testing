'''
工单日程
'''
from flask import request, json, Response

from beopWeb.mod_workflow import bp_workflow
from .Scheduler import Scheduler
from .TaskPool import TaskPool, SchedulerTaskType
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_admin.User import User

# 添加任务到日程中
@bp_workflow.route('/plan/addTaskToScheduler', methods=['POST'])
def plan_add_task_to_scheduler():
    req = request.get_json()
    user_id = req.get('userId')
    task_id = req.get('taskId')
    title = req.get('title')
    start_time = req.get('startTime')
    end_time = req.get('endTime')
    scheduler = Scheduler()
    if user_id is None or task_id is None:
        return Utils.beop_response_error()
    if scheduler.add_scheduler(title, user_id, start_time, end_time, task_id):
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


# 添加故障到日程中
@bp_workflow.route('/plan/addNoticeToScheduler', methods=['POST'])
def plan_add_notice_to_scheduler():
    req = request.get_json()
    user_id = req.get('userId')
    notice = req.get('notice')
    fault = notice.get('fault')
    start_time = req.get('startTime')
    notice_id = notice.get('id')
    color = req.get('color')
    task_pool = TaskPool()

    scheduler = Scheduler()

    if not task_pool.is_exists_by_ref_id(notice_id):
        task_id = task_pool.add_task(SchedulerTaskType.notice, notice, notice_id)
    else:
        task = task_pool.get_task_by_ref_id(notice_id)
        task_id = task.get('id')
    if task_id:
        add_id = scheduler.add_scheduler(fault.get('name'), user_id, start_time, None, task_id, color)
        if add_id is not None:
            return Utils.beop_response_success({'id': add_id})
    return Utils.beop_response_error()


# 列出任务列表
@bp_workflow.route('/plan/listTasks', methods=['POST'])
def plan_list_tasks():
    user_id = request.form.get('userId')
    group_id = request.form.get('groupId')
    start = request.form.get('start')
    end = request.form.get('end')
    if not start or not end:
        return Utils.beop_response_error()
    scheduler = Scheduler()
    if user_id:
        # result = scheduler.get_user_scheduler_by_between(user_id, start, end)
        result = scheduler.get_scheduler_by_between(start, end)
    elif group_id:
        result = scheduler.get_group_scheduler_by_between(group_id, start, end)
    else:
        return Utils.beop_response_error()
    task_pool_db = TaskPool()
    user_db = User()
    user_map = user_db.get_all_user_map()
    event_list = []
    for item in result:
        task = task_pool_db.get_task_by_id(item.get('taskId'))

        event_list.append({'id': item.get('id'), 'start': item.get('startTime'), 'end': item.get('endTime'),
                           'title': item.get('title'),
                           'color': item.get('color'), 'content': json.loads(task.get('content')),
                           'isMine': str(item.get('userId')) == str(user_id),
                           'username': user_map.get(item.get('userId')).get('userfullname'),
                           'textColor': '#FFF' if str(item.get('userId')) == str(user_id) else '#f5fb9b',
                           'editable': str(item.get('userId')) == str(user_id),
                           'allDay': True,
                           'noticeId': task.get('refId')})
    return Response(json.dumps(event_list), mimetype='application/json')


# 从日程中删除任务
@bp_workflow.route('/plan/delScheduledTask', methods=['POST'])
def plan_del_scheduled_task():
    req = request.get_json()
    schedule_id = req.get('scheduleId')
    if schedule_id is None:
        return Utils.beop_response_error()
    scheduler = Scheduler()
    if scheduler.del_scheduler(schedule_id):
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


# 更新加入日程的任务
@bp_workflow.route('/plan/updateScheduledTask', methods=['POST'])
def plan_update_scheduled_task():
    req = request.get_json()
    schedule_id = req.get('scheduleId')
    event = req.get('event')
    if schedule_id is None:
        return Utils.beop_response_error()
    scheduler = Scheduler()
    if scheduler.update_scheduler(schedule_id, event):
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()
