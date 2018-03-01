'''
设置用户进入首页的默认项目. 如果设置项目A, 用户在登录后会直接进入项目A的第一个菜单.
一个用户只能设置一个默认项目.
'''
__author__ = 'win7'

from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app
from beopWeb.mod_admin.Project import Project


class FavoriteProject(DbEntity):
    db_name = app.config.get('DATABASE') or 'beopdoengine'
    table_name = 'user_favorite_project'
    fields = ('user_id', 'project_id')

    def __init__(self, user_id):
        super().__init__()
        self.user_id = user_id
        self.project_id = None

    def get_favorite_project(self):
        '''
        获取用户的默认项目
        '''
        favorite_obj = self.query_one(self.fields, where=('user_id=%s', (self.user_id,)))
        if favorite_obj:
            all_projects = Project().get_all_project_map()
            return all_projects.get(favorite_obj.get('project_id'))
        else:
            return None

    def delete_favorite_project(self):
        '''
        删除用户的默认项目配置
        '''
        return self.delete(where=('user_id=%s', (self.user_id,)))

    def set_favorite_project(self, project_id):
        '''
        设置用户的默认项目

        :param project_id: 项目ID
        :return: True 设置成功; False 设置失败
        '''
        self.project_id = project_id
        if not self.project_id:
            raise Exception('project id is empty.')

        self.delete_favorite_project()
        return self.insert({'user_id': self.user_id, 'project_id': self.project_id})
