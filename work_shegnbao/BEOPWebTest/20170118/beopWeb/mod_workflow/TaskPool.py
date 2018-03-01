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

    def add_task(self, task_type, content, ref_id):
        if task_type is None:
            raise Exception('task type is None')
        model = {'type': task_type, 'content': json.dumps(content), 'refId': ref_id}
        return_id = self.insert_with_return_id(model)
        model['id'] = return_id
        self.set_cache(return_id, model)
        return return_id

    def get_task_by_id(self, task_id):
        task = self.get_cache(task_id)
        if task:
            return task
        task = self.query_one(self.fields, {'id': task_id})
        self.set_cache(task_id, task)
        return task

    def is_exists_by_ref_id(self, ref_id):
        if ref_id is None:
            raise Exception('ref id is None')
        return bool(self.query_one(('id',), {'refId': ref_id}))

    def get_task_by_ref_id(self, ref_id):
        if ref_id is None:
            raise Exception('ref id is None')
        return self.query_one(self.fields, {'refId': ref_id})
