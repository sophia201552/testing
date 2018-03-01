__author__ = 'win7'

from beopWeb import app
from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb.mod_common.Role import Role
import re


class RoleGroup(DbEntity):
    db_name = app.config.get('DATABASE') or 'beopdoengine'
    table_name = 'p_role_group'
    fields = ('id', 'name', 'roles')

    def get_roles_by_id(self, group_id):
        result = self.query(self.fields, where=('id=%s', (group_id,)))
        roles_list = []
        for item in result:
            if item.get('roles'):
                roles_list += item.get('roles').split(',')
        return list(set([item for item in roles_list]))
