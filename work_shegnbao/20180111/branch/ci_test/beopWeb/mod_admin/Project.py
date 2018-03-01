'''
项目类
'''
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
              'weather_station_id', 'pic', 'is_advance', 'logo', 'time_format')

    def get_all_project(self):
        '''
        获取数据库中所有项目的信息

        :return: 查询到底所有项目数据
        '''
        return self.query(self.fields)

    def get_project_by_db_name(self, db_name):
        '''
        根据项目的实时数据DB名来获取项目信息

        :param db_name: 实时数据存放的DB名, 既project表中的mysqlname字段
        :return: mysqlname字段为参数db_name值的项目信息
        '''
        return self.query_one(self.fields, where=('mysqlname=%s', (db_name,)))

    def get_project_by_code(self, code):
        '''
        根据项目代码获取项目信息

        :param code: 项目代码, 既project表中的name_en字段
        :return: name_en字段为参数code值的项目信息
        '''
        return self.query_one(self.fields, where=('name_en=%s', (code,)))

    def get_all_project_map(self):
        '''
        获取项目的映射表

        :return: 返回所有的项目的以项目ID为key值, 以项目信息为value的映射表
        '''
        projects = self.get_all_project()
        return {project.get('id'): project for project in projects}

    def get_auth_projects_by_user_id(self, user_id):
        '''
        获取用户被授权的项目列表

        :param user_id: 用户ID
        :return: 用户被授权的项目列表
        '''
        sql = 'select distinct ' + ','.join(['p.' + x for x in self.fields]) + \
              ' from user_role ur ' \
              'left join role_project rp on ur.roleId = rp.id ' \
              'left join project p on p.id = rp.projectId where ur.userId = %s'
        rv = Project.db.op_db_query(Project.db_name, sql, (user_id,))
        return [{key: value for key, value in zip(self.fields, project)} for project in rv]

    @staticmethod
    def set_delete_flag_by_project_id(project_id):
        '''
        设置项目被删除. 通过设置项目表project中的is_delete来删除项目.

        :param project_id: 被删除项目的项目ID
        :return: 是否设置删除成功
        '''
        sql = 'update ' + Project.table_name + ' set is_delete = 1 where id=%s'
        return Project.db.op_db_update(Project.db_name, sql, (project_id,))

    @staticmethod
    def get_projects_by_user_id(user_id, *obj):
        '''
        获取用户被授权的项目列表, 可自定义返回字段

        :param user_id: 用户ID
        :param obj: 返回项目列表的自定义字段
        :return: 项目列表
        '''
        sql = 'select distinct ' + ','.join(['p.' + x for x in obj]) + \
              ' from user_role ur ' \
              'left join role_project rp on ur.roleId = rp.id ' \
              'left join project p on p.id = rp.projectId where ur.userId = %s'
        rv = Project.db.op_db_query(Project.db_name, sql, (user_id,))
        return [{key: value for key, value in zip(obj, project)} for project in rv]

    def get_project_by_id(self, project_id, fields=None):
        '''
        根据项目ID获取项目, 可自定义返回字段

        :param project_id: 项目ID
        :param fields: 返回项目的自定义字段
        :return: 项目信息
        '''
        if not fields:
            fields = self.fields
        return self.query_one(fields, where=('id=%s', (project_id,)))

    @staticmethod
    def get_all_user_id_list_by_project_id(project_id):
        '''
        根据项目ID获取所有此项目授权的用户ID信息

        :param project_id: 项目ID
        :return: 授权项目ID对应项目的所有用户ID列表
        '''
        sql = "select  distinct userId from user_role ur left join role_project rp on ur.roleId = rp.id where rp.projectId = %s"
        rv = Project.db.op_db_query(Project.db_name, sql, [project_id])
        return [rv_item[0] for rv_item in rv] if rv else []

    @staticmethod
    def get_mysql_table_name(project_id):
        '''
        根据项目ID获取实时数据库名称, 既project表中mysqlname字段

        :param project_id: 项目ID
        :return: 项目ID对应项目的实时数据库名称
        '''
        sql = "select mysqlname from project where id=%s"
        rv = Project.db.op_db_query_one(Project.db_name, sql, [project_id])
        return rv[0] if rv else None
