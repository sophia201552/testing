import unittest
from beopWeb.mod_admin.FavoriteProject import FavoriteProject


class UtilsCase(unittest.TestCase):
    test_user_id = 1
    test_project_id_1 = 1
    test_project_id_2 = 2

    # 设置
    def test_set_favorite(self):
        fp = FavoriteProject(self.test_user_id)
        fp.set_favorite_project(self.test_project_id_1)
        assert fp.get_favorite_project().get('id') == self.test_project_id_1

    # 删除
    def test_delete_favorite(self):
        fp = FavoriteProject(self.test_user_id)
        fp.delete_favorite_project()
        assert not fp.get_favorite_project()

    # 多次设置
    def test_set_favorite_twice(self):
        fp = FavoriteProject(self.test_user_id)
        fp.set_favorite_project(self.test_project_id_1)
        assert fp.get_favorite_project().get('id') == self.test_project_id_1

        fp.set_favorite_project(self.test_project_id_2)
        assert fp.get_favorite_project().get('id') == self.test_project_id_2
