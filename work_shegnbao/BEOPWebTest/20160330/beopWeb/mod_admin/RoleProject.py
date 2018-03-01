__author__ = ''

from beopWeb import app
from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb.mod_common.Role import Role


class RoleProject(DbEntity):
    UserList = []
    db_name = app.config.get('DATABASE') or 'beopdoengine'
    table_name = 'role_function'
    fields = ('role_project_id', 'function')

    def del_role_function(self, function, role_project_id):
        return self.delete(where=('role_project_id=%s and function=%s', (role_project_id, function)))

    def insert_role_function(self, function, role_project_id):
        return self.insert({'function': function, 'role_project_id': role_project_id})

    def query_permission_by_role_id(self, role_project_id):
        return self.query("function", where=('role_project_id=%s', (role_project_id,)))

    def query_permission_by_user_id(self, user_id, pro_id):
        sql = '''SELECT distinct function from role_function r
                  LEFT JOIN user_role u on r.role_project_id = u.roleId
                  LEFT JOIN role_project p on r.role_project_id = p.id
                  where u.userId = %s and p.projectId=%s'''
        result = self.db_helper.db.op_db_query(RoleProject.db_name, sql, (user_id, pro_id))
        result_dict = {Role.ROLE_DASHBOARD: "", Role.ROLE_MENU: "", Role.ROLE_DEBUG_TOOLS: ""}
        for item in result:
            if item[0] == Role.ROLE_DASHBOARD:
                result_dict[Role.ROLE_DASHBOARD] = Role.ROLE_DASHBOARD
            elif item[0] == Role.ROLE_MENU:
                result_dict[Role.ROLE_MENU] = Role.ROLE_MENU
            elif item[0] == Role.ROLE_DEBUG_TOOLS:
                result_dict[Role.ROLE_DEBUG_TOOLS] = Role.ROLE_DEBUG_TOOLS
        return result_dict

