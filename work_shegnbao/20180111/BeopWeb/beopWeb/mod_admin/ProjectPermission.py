'''
项目中用户的分组设置
一个项目可有多个分组, 一个用户可属于多个分组. 分组可以单独设置项目配置如菜单显示等.
涉及数据库表:
role_project 项目的分组信息
user_role    用户-分组对应关系
'''

__author__ = 'RNBtech'

from beopWeb.BEOPMySqlDBContainer import BEOPMySqlDBContainer
from beopWeb import app
from .User import User
from datetime import datetime


class ProjectPermission:
    db_name = app.config.get('DATABASE') or 'beopdoengine'
    db = BEOPMySqlDBContainer()

    @staticmethod
    def get_permission(user_id, *obj):
        '''
        获取用户的项目信息及项目中的分组信息

        :param user_id: 用户ID
        :param obj: 返回的字段
        :return: 用户被授权的项目及分组信息
        '''
        if user_id and user_id != 1:
            sql = '''select p.id AS projectId, p.name_cn AS projectName, p.name_english AS projectName_en,
                  rp.id AS roleId, rp.roleName AS roleName,
                  u.id AS userId, u.userfullname AS username, u.userpic AS userpic
                  from role_project rp
                  left join project p on rp.projectId = p.id
                  left join user_role ur on rp.id = ur.roleId
                  left join user u on u.id = ur.userid '''
            user_id_list_db = User.get_users_flat_by_supervisor(user_id, 'id')
            user_id_list = [str(x.get('id')) for x in user_id_list_db]
            sql += ' where ur.userid in (' + ','.join(user_id_list) + ') and p.is_delete = 0'
            rv = ProjectPermission.db.op_db_query(ProjectPermission.db_name, sql)
        else:  # 查询所有
            sql = '''select p.id AS projectId, p.name_cn AS projectName, p.name_english AS projectName_en,
                  rp.id AS roleId, rp.roleName AS roleName,
                  u.id AS userId, u.userfullname AS username, u.userpic AS userpic
                  from project p
                  left join role_project rp on rp.projectId = p.id
                  left join user_role ur on rp.id = ur.roleId
                  left join user u on u.id = ur.userid'''
            sql += ' where p.is_delete = 0 '
            rv = ProjectPermission.db.op_db_query(ProjectPermission.db_name, sql)
        return [{key: value for key, value in zip(obj, permission)} for permission in rv]

    @staticmethod
    def insert_role_user(user_id, role_id, assignBy, assignTime=None):
        '''
        添加一个用户到项目分组中

        :param user_id:用户ID
        :param role_id:分组ID
        :param assignBy:分配人
        :param assignTime:分配时间
        :return: True 添加成功; False 添加失败
        '''
        if not assignTime:
            assignTime = datetime.now()
        sql = 'insert into `user_role` (userId,roleId,assignBy,assignTime) values(%s,%s,%s,%s)'
        return ProjectPermission.db.op_db_update(ProjectPermission.db_name, sql,
                                                 (user_id, role_id, assignBy, assignTime))

    @staticmethod
    def delete_role_user(role_id, user_id):
        '''
        从一个分组中删除一个用户

        :param role_id: 分组ID
        :param user_id: 用户ID
        :return: True 删除成功; False 删除失败
        '''
        sql = 'delete from user_role where roleId =%s and userId =%s'
        return ProjectPermission.db.op_db_update(ProjectPermission.db_name, sql, (role_id, user_id))

    @staticmethod
    def delete_project_role(role_id):
        '''
        删除一个项目分组

        :param role_id: 项目分组ID
        :return: True 删除成功; False 删除失败
        '''
        sql = 'delete from role_project where id=%s'
        return ProjectPermission.db.op_db_update(ProjectPermission.db_name, sql, (role_id,))

    @staticmethod
    def insert_project_role(project_id, role_name):
        '''
        给项目添加分组

        :param project_id: 项目ID
        :param role_name: 分组名称
        :return: (添加是否成功, 分组信息)
        '''
        sql = 'insert into `role_project`(roleName, projectId) values(%s,%s)'
        insert_success = ProjectPermission.db.op_db_update(ProjectPermission.db_name, sql, (role_name, project_id))
        if insert_success:
            query_sql = 'select id, roleName, projectId, level from role_project where roleName=%s and projectId=%s'
            inserted = ProjectPermission.db.op_db_query_one(ProjectPermission.db_name, query_sql,
                                                            (role_name, project_id))
            if inserted:
                return True, {'id': inserted[0], 'roleName': inserted[1], 'projectId': inserted[2],
                              'level': inserted[3]}
            else:
                return False, None
        else:
            return False, None

    @staticmethod
    def get_project_role(user_id, *obj):
        '''
        获取用户的授权的项目的分组信息

        :param user_id: 用户ID
        :param obj: 返回字段
        :return: 分组信息列表
        '''
        sql = 'select distinct p.id as projectId,p.name_cn as projectName,role_p.id as roleId,role_p.roleName as roleName from role_project role_p,project p where role_p.projectId in ( ' + \
              ' select distinct r_p.projectId FROM role_project r_p, user_role u_r WHERE r_p.id = u_r.roleId AND u_r.userId = %s ) and p.id = role_p.projectId '
        rv = ProjectPermission.db.op_db_query(ProjectPermission.db_name, sql, (user_id,))
        return [{key: value for key, value in zip(obj, result)} for result in rv]

    @staticmethod
    def userProjRecords(user_id, *obj):
        '''
        用户项目分组记录

        :param user_id: 用户ID
        :param obj: 自定义返回字段
        :return: 用户项目分组列表
        '''
        sql = 'select z.projectId,z.projectName,z.roleName,t.username as assignBy,z.assignTime from ' + \
              '(select distinct p.id as projectId,p.name_cn as projectName,role_p.roleName as roleName,u.assignBy as assignBy,u.assignTime as assignTime ' + \
              'from role_project role_p,project p,user_role u where role_p.projectId in ' + \
              '( select distinct r_p.projectId FROM role_project r_p, user_role u_r WHERE r_p.id = u_r.roleId AND u_r.userId = %s ) ' + \
              'and p.id = role_p.projectId and role_p.id = u.roleId and u.userId = %s) z ' + \
              'LEFT JOIN user t ' + \
              'on t.id = z.assignBy'
        rv = ProjectPermission.db.op_db_query(ProjectPermission.db_name, sql, (user_id, user_id,))
        return [{key: value for key, value in zip(obj, result)} for result in rv]

    @staticmethod
    def get_role_user(user_id, *obj):
        '''
        获取用户角色列表

        :param user_id: 用户ID
        :param obj: 自定义返回字段
        :return: 用户角色列表
        '''
        sql = 'SELECT u.id, u.userfullname, ur.roleId from user_role ur,user u where ur.roleId in( ' + \
              'SELECT DISTINCT role_p.id FROM role_project role_p WHERE role_p.projectId IN (' + \
              'SELECT DISTINCT r_p.projectId FROM role_project r_p, user_role u_r WHERE r_p.id = u_r.roleId AND u_r.userId =%s )) and ur.userId = u.id '
        rv = ProjectPermission.db.op_db_query(ProjectPermission.db_name, sql, (user_id,))
        return [{key: value for key, value in zip(obj, result)} for result in rv]
