'''
数据管理功能中原始数据页面. 用户进行点的收藏功能. 用户收藏点根据不同项目进行保存.
'''
from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app


class DataManager(DbEntity):
    db_name = app.config.get('DATABASE', 'beopdoengine')
    table_name = 'user_data_manager'

    def get_saved_points(self, user_id, project_id, *fields):
        '''获取用户某项目收藏的点

        :param user_id: 用户ID
        :param project_id: 项目ID
        :param fields: 自定义返回字段
        :return: 收藏点的信息
        '''
        return self.query_one(fields, {'user_id': user_id, 'project_id': project_id})

    def insert_points(self, user_id, project_id, points):
        '''插入新的用户在某项目收藏的点

        :param user_id: 用户ID
        :param project_id: 项目ID
        :param points: 点列表
        :return: True 插入成功; False 插入失败
        '''
        return self.insert({'user_id': user_id, 'project_id': project_id, 'points': points})

    def update_points(self, user_id, project_id, points):
        '''更新用户在某项目收藏的点

        :param user_id: 用户ID
        :param project_id: 项目ID
        :param points: 点列表
        :return: True 更新成功; False 更新失败
        '''
        return self.update({'points': points}, {'user_id': user_id, 'project_id': project_id})
