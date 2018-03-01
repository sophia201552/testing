__author__ = 'win7'
from beopWeb.MongoConnManager import MongoConnManager, g_table_workflow_task_group


class TaskGroup:
    def __init__(self):
        self.db = MongoConnManager.getConfigConn().mdbBb[g_table_workflow_task_group]

    def get_task_group_by_user_id(self, user_id):
        groups = self.db.find({"arch.members": user_id})
        return [item for item in groups]

    def save_task_group(self, data):
        group = self.db.save(data)
        return True if group else False
