from beopWeb.mod_TaskScheduler import bp_taskScheduler
from beopWeb.mod_TaskScheduler.TaskScheduler import TaskScheduler

import logging
from flask import jsonify, request


@bp_taskScheduler.route('/setworkflowtaskremind')
def set_workflow_task_remind():
    """
    David 20160802
    发送维保工单并记录维修记录
    :return:
    """
    rt = {'status': 0, 'message': None}
    try:
        workflowList = TaskScheduler.get_workflowtask_with_fieldtype_is_four()
        if workflowList:
            res = TaskScheduler.set_workflowtask_fieldtype_zero(workflowList)
            if res:
                rt.update({'status': 1, 'message': None})
            else:
                rt.update({'status': 0, 'message': 'Set remind error'})
        else:
            rt.update({'status': 0, 'message': 'No Task Scheduller Workflow'})
    except Exception as e:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        rt.update({'status': 0, 'message': e.__str__()})
    return jsonify(rt)


@bp_taskScheduler.route('/gettask')
def get_task():
    """
    David 20160805
    获取计划任务
    :return:
    """
    rt = {'status': 0, 'message': None, 'taskList': []}
    try:
        lis = TaskScheduler.get_task()
        if lis:
            rt.update({'status': 1, 'taskList': lis})
        else:
            rt.update({'status': 0, 'message': 'No task scheduler'})
    except Exception as e:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        rt.update({'status': 0, 'message': e.__str__()})
    return jsonify(rt)


@bp_taskScheduler.route('/updatetaskexecutiontime', methods=['POST'])
def update_task_executiontime():
    """
    David 20160809
    :return:
    """
    rt = {'status': 0, 'message': None}
    post_data = request.get_json()
    try:
        if post_data:
            taskId = post_data.get('id', [])
            res = TaskScheduler.update_task_executiontime(taskId)
            if res:
                rt.update({'status': 1})
            else:
                rt.update({'status': 0, 'message': 'Update failed'})
    except Exception as e:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        rt.update({'status': 0, 'message': e.__str__()})
    return jsonify(rt)
