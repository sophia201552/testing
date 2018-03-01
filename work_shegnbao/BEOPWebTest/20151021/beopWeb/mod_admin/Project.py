__author__ = 'liqian'

from beopWeb.BEOPMySqlDBContainer import BEOPMySqlDBContainer
from beopWeb import app
from beopWeb.mod_common.DbEntity import DbEntity


class Project(DbEntity):
    UserList = []
    db_name = app.config.get('DATABASE') or 'beopdoengine'
    table_name = 'project'
    db = BEOPMySqlDBContainer()
    fields = ('id', 'name_en', 'name_cn', 's3dbname', 'mysqlname', 'update_time', 'latlng', 'address', 'name_english',
              'weather_station_id', 'pic')

    def get_all_project(self):
        return self.query(self.fields)

    def get_project_by_db_name(self, db_name):
        return self.query_one(self.fields, where=('mysqlname=%s', (db_name,)))

    @staticmethod
    def get_projects_by_user_id(user_id, *obj):
        sql = 'select distinct ' + ','.join(['p.' + x for x in obj]) + \
              ' from user_role ur ' \
              'left join role_project rp on ur.roleId = rp.id ' \
              'left join project p on p.id = rp.projectId where ur.userId = %s'
        rv = Project.db.op_db_query(Project.db_name, sql, (user_id,))
        return [{key: value for key, value in zip(obj, project)} for project in rv]

    def get_project_by_id(self, project_id, fields):
        return self.query_one(fields, where=('id=%s', (project_id,)))
