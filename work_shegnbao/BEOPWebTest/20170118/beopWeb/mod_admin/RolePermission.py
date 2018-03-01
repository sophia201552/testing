import logging

from beopWeb import app
from beopWeb.mod_common.DbEntity import DbEntity


class RolePermission(DbEntity):
    db_name = app.config.get('DATABASE') or 'beopdoengine'
    table_name = 'p_role_permission'
    fields = ('role', 'permissions')

    def get_role_permission(self):
        rp = self.query(self.fields)
        ret = {}
        for item in rp:
            permissions = []
            if item.get('permissions'):
                try:
                    permissions = item.get('permissions').split(',')
                    permissions = list(set([item.strip() for item in permissions]))
                except Exception as e:
                    logging.error('error:加载权限错误' + str(e))
            ret[item.get('role')] = permissions
        return ret
