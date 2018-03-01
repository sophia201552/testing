__author__ = 'win7'

from beopWeb.MongoConnManager import MongoConnManager, g_table_workflow_template
from beopWeb.mod_common.Utils import Utils


class Template:
    def __init__(self, template_id):
        if not template_id:
            template_id = '56f13216e153db0248d3fb91'
        self.id = template_id
        self.db = MongoConnManager.getConfigConn().mdbBb[g_table_workflow_template]

    def get_template(self):
        return self.db.find_one({'_id': Utils.get_object_id(self.id)})
