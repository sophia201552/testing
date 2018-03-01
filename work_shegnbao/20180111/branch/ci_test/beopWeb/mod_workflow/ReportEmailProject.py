'''
报表推送项目配置信息
'''
from beopWeb.mod_common.DbEntity import DbEntity


class ReportEmailProject(DbEntity):
    db_name = 'beopdoengine'
    table_name = 'reportemail_project'
    fields = ('userId', 'projectId')

    def get_user_project_list(self, user_id):
        '''
        根据用户ID获取推送配置信息

        :param user_id: 用户ID
        :return: 项目推送配置信息
        '''
        result = self.query(self.fields, where=('userId=%s', [user_id]), limit=[0, 100])
        if result:
            return result
        else:
            return False

    def get_project_settings_by_id(self, project_id):
        '''
        根据项目ID获取推送配置信息

        :param project_id: 项目ID
        :return: 项目推送配置信息
        '''
        result = self.query(self.fields, where=('projectId=%s', [project_id]), limit=[0, 100])
        if result:
            return result
        else:
            return False

    def delete_user_project(self, user_id):
        '''
        根据用户ID删除项目推送信息

        :param user_id: 用户ID
        :return: True 删除成功; False 删除失败
        '''
        result = self.delete(where=("userId=%s", [user_id]))
        if result:
            return True
        else:
            return False

    def add_user_project(self, user_id, project_id_list):
        '''
        添加用户项目推送

        :param user_id: 用户ID
        :param project_id_list: 项目ID列表
        :return: True 添加成功; False 添加失败
        '''
        result = 1
        for id in eval(project_id_list):
            result *= self.insert({
                "userId": user_id,
                "projectId": int(id)
            })
        if result == 1:
            return True
        else:
            return False

    def is_exist_user_projectId(self, user_id):
        '''
        检测用户是否配置过项目推送

        :param user_id: 用户ID
        :return: True 配置过; False 没有配置过
        '''
        result = self.count(where=("userId=%s", [user_id]))
        if result:
            return True
        else:
            return False

    def update_user_projectId_list(self, user_id, project_id_list):
        '''
        更新用户的项目配置

        :param user_id: 用户ID
        :param project_id_list: 项目ID列表
        :return: True 更新成功; False 更新失败
        '''
        if self.delete_user_project(user_id):
            return self.add_user_project(user_id, project_id_list)
        else:
            return -1

    def get_email_setting_user(self, project_id):
        '''
        根据项目ID获取项目推送设置

        :param project_id: 项目ID
        :return: 项目推送设置列表
        '''
        if not project_id:
            return False
        else:
            result = self.query(self.fields, where=('projectId=%s', [project_id]), limit=[0, 100])
            if result:
                return result
            else:
                return False
