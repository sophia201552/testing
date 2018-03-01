__author__ = 'win7'

from beopWeb.BEOPMongoDataAccess import g_pointTableFields
from beopWeb.MongoConnManager import MongoConnManager


class PointTableFields:
    def __init__(self, project_id):
        self.db = MongoConnManager.getConfigConn().mdbBb[g_pointTableFields]
        self.project_id = project_id

    def get_fields(self):
        project = self.db.find_one({'projId': self.project_id})
        if project:
            return project.get('fields')
        else:
            return {}

    def get_fields_map(self):
        project = self.db.find_one({'projId': self.project_id})
        if project:
            return {item.get('word'): item for item in project.get('fields')}
        else:
            return {}

    def save_fields(self, fields):
        return self.db.update_one({'projId': self.project_id}, {'$set': {'fields': fields}}, upsert=True)

    def save_suggests(self, total_num, suggests):
        return self.db.update_one({'projId': self.project_id},
                                  {'$set': {'suggests': suggests, 'total': total_num, 'matched': len(suggests)}},
                                  upsert=True)

    def get_suggests(self):
        project = self.db.find_one({'projId': self.project_id}, {'_id': False})
        return {'total': project.get('total'), 'matched': project.get('matched'),
                'suggests': project.get('suggests')} if project else {}
