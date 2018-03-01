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

    def get_all_project_map(self):
        projects = self.get_all_project()
        return {project.get('id'): project for project in projects}

    def get_auth_projects_by_user_id(self, user_id):
        sql = 'select distinct ' + ','.join(['p.' + x for x in self.fields]) + \
              ' from user_role ur ' \
              'left join role_project rp on ur.roleId = rp.id ' \
              'left join project p on p.id = rp.projectId where ur.userId = %s'
        rv = Project.db.op_db_query(Project.db_name, sql, (user_id,))
        return [{key: value for key, value in zip(self.fields, project)} for project in rv]

    @staticmethod
    def get_projects_by_user_id(user_id, *obj):
        sql = 'select distinct ' + ','.join(['p.' + x for x in obj]) + \
              ' from user_role ur ' \
              'left join role_project rp on ur.roleId = rp.id ' \
              'left join project p on p.id = rp.projectId where ur.userId = %s'
        rv = Project.db.op_db_query(Project.db_name, sql, (user_id,))
        return [{key: value for key, value in zip(obj, project)} for project in rv]

    def get_project_by_id(self, project_id, fields=None):
        if not fields:
            fields = self.fields
        return self.query_one(fields, where=('id=%s', (project_id,)))

    @staticmethod
    def get_project_by_permission(user_id, function):
        sql = 'select distinct projectId, name_cn, name_en from role_function rf ' \
              'left join role_project rp on rf.role_project_id = rp.id, project p ' \
              'where rf.role_project_id in ( select roleId from user_role where userid = %s) ' \
              'and rf.function = %s and p.id = projectid order by projectid'

        rv = Project.db.op_db_query(Project.db_name, sql, (user_id, function,))
        rv_list = []
        for item in rv:
            rv_dict = {'id': item[0], 'name_cn': item[1], 'name_en': item[2]}
            rv_list.append(rv_dict)
        return rv_list

    @staticmethod
    def get_project_map_by_permission(user_id, function):
        projects = Project.get_project_by_permission(user_id, function)
        return {project.get('id'): project for project in projects}
