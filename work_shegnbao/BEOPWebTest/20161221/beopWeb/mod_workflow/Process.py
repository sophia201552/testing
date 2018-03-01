__author__ = 'win7'
from beopWeb.MongoConnManager import MongoConnManager, g_table_workflow_process
from bson import ObjectId


# TODO 这个文件暂时没有被用到

class Task:
    def __init__(self):
        self.db = MongoConnManager.getConfigConn().mdbBb[g_table_workflow_process]

    def save_process(self, process):
        return self.db.save(process)

    def get_process_by_id(self, id):
        result = self.db.find({"_id": ObjectId(id)})
        if result:
            result = [item for item in result]
            return result
        else:
            return []
