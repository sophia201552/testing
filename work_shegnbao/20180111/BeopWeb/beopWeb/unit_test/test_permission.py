import unittest

from beopWeb.mod_admin.BeOPPermission import BeOPPermission, UserRoleGroup


class BeOPPermissionTestCase(unittest.TestCase):
    def setUp(self):
        self.userRoleGroup = UserRoleGroup()

    @staticmethod
    def test_get_role_group_id_by_user_id():
        result = UserRoleGroup.get_role_group(68)
        assert len(result) > 0

    @staticmethod
    def test_get_user_permission():
        result = BeOPPermission.get_permissions_by_user_id(68)
        assert len(result) > 0
