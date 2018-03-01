'''
任务池
'''

from flask import json

from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app


class SchedulerTaskType:
    notice = 1
    workflow = 2


class TaskPool(DbEntity):
    db_name = app.config.get('WORKFLOW_DATABASE', 'workflow')
    table_name = 'task_pool'
    fields = ('id', 'type', 'content', 'refId')

    def add_task(self, task_type, content, ref_id=None):
        '''
        向任务池中添加一个任务

        :param task_type: 任务类型
        :param content: 任务内容
        :param ref_id: 任务ID
        :return: 任务池中的ID
        '''
        if task_type is None:
            raise Exception('task type is None')
        model = {'type': task_type, 'content': json.dumps(content), 'refId': ref_id}
        return_id = self.insert_with_return_id(model)
        model['id'] = return_id
        self.set_cache(return_id, model)
        return return_id

    def get_task_by_id(self, task_id):
        '''
        获取任务池中任务

        :param task_id: 任务池中的ID
        :return: 任务信息
        '''
        task = self.get_cache(task_id)
        if task:
            return task
        task = self.query_one(self.fields, {'id': task_id})
        self.set_cache(task_id, task)
        return task

    def is_exists_by_ref_id(self, ref_id):
        '''
        检查任务在任务池中存在

        :param ref_id: 引用任务ID
        :return: True 存在; False 不存在
        '''

        if ref_id is None:
            raise Exception('ref id is None')
        return bool(self.query_one(('id',), {'refId': ref_id}))

    def get_task_by_ref_id(self, ref_id):
        '''
        获取任务池中任务

        :param ref_id: 引用任务的ID
        :return: 任务信息
        '''
        if ref_id is None:
            raise Exception('ref id is None')
        return self.query_one(self.fields, {'refId': ref_id})
