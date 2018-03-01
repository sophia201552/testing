__author__ = 'win7'
from beopWeb.MongoConnManager import MongoConnManager, g_table_workflow_task


class Task:
    def __init__(self):
        self.db = MongoConnManager.getConfigConn().mdbBb[g_table_workflow_task]

    def save_task(self, task):
        return self.db.save(task)
