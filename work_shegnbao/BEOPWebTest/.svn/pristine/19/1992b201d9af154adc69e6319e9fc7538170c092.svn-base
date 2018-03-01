import unittest

from beopWeb.mod_admin.BeOPPermission import BeOPPermission, UserRoleGroup


class BeOPPermissionTestCase(unittest.TestCase):
    def setUp(self):
        self.permission = BeOPPermission()
        self.userRoleGroup = UserRoleGroup()

    def test_get_role_group_id_by_user_id(self):
        result = self.userRoleGroup.get_role_group_id(68)
        assert len(result) > 0
