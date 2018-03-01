from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb.mod_admin.User import User
from .ReportEmailProject import ReportEmailProject


class ReportEmailUser(DbEntity):
    db_name = 'beopdoengine'
    table_name = 'reportemail_user'
    fields = ('id', 'userId', 'name', 'mail1', 'mail2', 'mail3')

    def get_all_report_email_setting(self, user_id):
        rs = ReportEmailProject()

        user_info = self.get_user_info(user_id)

        if user_info:
            user = User()
            user_sex = user.query_user_by_id(user_id, 'usersex').get("usersex")
            project_id_list = rs.get_user_project_list(user_id)
            current_project_id = []
            if project_id_list:
                for project_id in project_id_list:
                    current_project_id.append(project_id.get("projectId"))
            else:
                current_project_id = []
            result = {
                "projectId": current_project_id,
                "name": user_info.get("name"),
                "mail1": user_info.get("mail1"),
                "mail2": user_info.get("mail2"),
                "mail3": user_info.get("mail3"),
                "sex": user_sex
            }
            return result
        else:
            return False

    def update_report_email_setting(self, user_id, data):
        rs = ReportEmailProject()
        result = 1
        project_id_list = data.get("projectIdList")
        if rs.is_exist_user_projectId(user_id):
            if rs.delete_user_project(user_id):
                result *= rs.add_user_project(user_id, project_id_list)
                result *= self.update_user_info(user_id, {
                    "userId": user_id,
                    "name": data.get("name"),
                    "mail1": data.get("email").get("email1"),
                    "mail2": data.get("email").get("email2"),
                    "mail3": data.get("email").get("email3")
                })
            else:
                return False
        else:
            result *= rs.update_user_projectId_list(user_id, project_id_list)
            length = self.count(where=("userId=%s", [user_id]))
            model = {
                "userId": user_id,
                "name": data.get("name"),
                "mail1": data.get("email").get("email1"),
                "mail2": data.get("email").get("email2"),
                "mail3": data.get("email").get("email3")
            }
            if length == 0:
                result *= self.insert(model)
            else:
                result *= self.update(model, where=("userId=%s", [user_id]))
        if result:
            return True
        else:
            return False

    def get_user_info(self, user_id):
        result = self.query_one(self.fields, where=("userId=%s", [user_id]))
        if result:
            return result
        else:
            return False

    def update_user_info(self, user_id, data):
        result = self.update(data, where=("userId=%s", [user_id]))
        if result:
            return True
        else:
            return False

    def set_user_info(self, data):
        result = self.insert_with_return_id(data)
        if result:
            return True
        else:
            return False

    def get_all_settings_by_id(self, project_id):
        if not project_id:
            return False
        rep = ReportEmailProject()
        user = User()
        result = []
        search_user_result = rep.get_email_setting_user(int(project_id))
        if search_user_result:
            for user_info in search_user_result:
                user_id = int(user_info.get('userId'))
                # 如果id为1或者不存在就pass
                if user_id != 1 or user_id is not None:
                    try:
                        each_user = self.query_one(self.fields, where=('userId=%s', [user_id]))
                        each_user['sex'] = user.query_user_by_id(user_id, 'usersex').get('usersex')
                        result.append(each_user)
                    except Exception as e:
                        pass
        else:
            return False
        if result:
            return result
        else:
            return False
