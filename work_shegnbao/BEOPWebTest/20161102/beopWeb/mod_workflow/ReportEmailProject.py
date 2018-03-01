from beopWeb.mod_common.DbEntity import DbEntity


class ReportEmailProject(DbEntity):
    db_name = 'beopdoengine'
    table_name = 'reportemail_project'
    fields = ('userId', 'projectId')

    def get_user_project_list(self, user_id):
        result = self.query(self.fields, where=('userId=%s', [user_id]), limit=[0, 100])
        if result:
            return result
        else:
            return False

    def get_project_settings_by_id(self, project_id):
        result = self.query(self.fields, where=('projectId=%s', [project_id]), limit=[0, 100])
        if result:
            return result
        else:
            return False

    def delete_user_project(self, user_id):
        result = self.delete(where=("userId=%s", [user_id]))
        if result:
            return True
        else:
            return False

    def add_user_project(self, user_id, project_id_list):
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
        result = self.count(where=("userId=%s", [user_id]))
        if result:
            return True
        else:
            return False

    def update_user_projectId_list(self, user_id, project_id_list):
        if self.delete_user_project(user_id):
            return self.add_user_project(user_id, project_id_list)
        else:
            return -1

    def get_email_setting_user(self, project_id):
        if not project_id:
            return False
        else:
            result = self.query(self.fields, where=('projectId=%s', [project_id]), limit=[0, 100])
            if result:
                return result
            else:
                return False
