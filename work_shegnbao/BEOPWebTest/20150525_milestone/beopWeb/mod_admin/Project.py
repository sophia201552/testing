__author__ = 'liqian'

from beopWeb.BEOPMySqlDBContainer import BEOPMySqlDBContainer
from beopWeb import app


class Project:
    UserList = []
    db_name = app.config.get('DATABASE') or 'beopdoengine'
    table_name = 'project'
    db = BEOPMySqlDBContainer()

    def __init__(self):
        pass

    @staticmethod
    def get_project(**obj):
        pass

    @staticmethod
    def get_projects_by_user_id(user_id, *obj):
        sql = 'select distinct ' + ','.join(['p.' + x for x in obj]) + \
              ' from user_role ur left join role_project rp on ur.roleId = rp.id left join project p on p.id = rp.projectId where ur.userId = %s'
        rv = Project.db.op_db_query(Project.db_name, sql, (user_id,))
        return [{key: value for key, value in zip(obj, project)} for project in rv]

