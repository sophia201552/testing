from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app


class ReportEmailSetting(DbEntity):
    db_name = 'beopdoengine'
    table_name = 'report_email_setting'
    fields = ('id', 'userId', 'nickname', 'sex', 'mail1', 'mail2', 'mail3', 'reportSetting', 'projectId')

    def get_all_report_email_setting(self, user_id):
        if not user_id:
            return False
        # 这里的 limt 我不知道多少 先写了一个100，应该写为最大？
        search_result = self.query(self.fields, where=('userId=%s', [user_id]), limit=[0, 100])
        if not search_result:
            return False
        search_result_one = search_result[0]
        result = {
            'sex': search_result_one.get('sex'),
            'nickname': search_result_one.get('nickname'),
            'mail1': search_result_one.get('mail1'),
            'mail2': search_result_one.get('mail2'),
            'mail3': search_result_one.get('mail3'),
            'data': []
        }
        for key in search_result:
            result.get('data').append({
                'projectId': key.get('projectId'),
                'navItemIdList': key.get('reportSetting')
            })
        return result

    def add_report_email_setting(self, user_id, data):
        report_setting = data.get("data")
        email = data.get('email')
        sex = data.get('sex')
        name = data.get('name')
        mail1 = email.get('email1')
        mail2 = email.get('email2')
        mail3 = email.get('email3')
        if not mail1:
            mail1 = ''
        elif not mail2:
            mail2 = ''
        elif not mail3:
            mail3 = ''
        result = 1
        for key in report_setting:
            result *= self.insert_with_return_id({
                'userId': user_id,
                'nickname': name,
                'sex': sex,
                'mail1': mail1,
                'mail2': mail2,
                'mail3': mail3,
                'reportSetting': key.get('navItemIdList'),
                'projectId': key.get('projectId')
            })
        if result:
            return True
        else:
            return False

    def delete_report_email_setting(self, user_id):
        result = self.delete(where=('userId=%s', [user_id]))
        return result

    def update_report_email_setting(self, user_id, data):
        if self.is_exist_report_email_setting(user_id):
            if self.delete_report_email_setting(user_id):
                return self.add_report_email_setting(user_id, data)
            else:
                return False
        else:
            return self.add_report_email_setting(user_id, data)

    def is_exist_report_email_setting(self, user_id):
        result = self.query_one(self.fields, where=('userId=%s', [user_id]))
        if result:
            return True
        else:
            return False

    # 通过 project id 来查找 需要发送 邮件的信息
    def get_all_settings_by_id(self, project_id):
        if not project_id:
            return False
            # 这里的 limt 我不知道多少 先写了一个100，应该写为最大？
        search_result = self.query(self.fields, where=('projectId=%s', [project_id]), limit=[0, 100])
        result = search_result
        if result:
            return result
        else:
            return False
