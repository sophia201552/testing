__author__ = 'liqian'

from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app
from flask import json


class UserSettingType:
    replied = 'replied'
    expired_soon = 'expired_soon'
    assign_task_finished = 'assign_task_finished'
    assign_task_started = 'assign_task_started'
    assign_task_paused = 'assign_task_paused'
    assign_task_replied = 'assign_task_replied'

class UserSetting(DbEntity):
    db_name = app.config.get('WORKFLOW_DATABASE', 'workflow')
    table_name = 'user_settings'

    def insert_user_settings(self, user_id, settings):
        return self.insert({'userID': user_id, 'settings': json.dumps(settings)})

    def get_user_settings(self, user_id, setting_item):
        user_setting = self.get_all_user_settings(user_id)
        return user_setting.get(setting_item, None)

    def get_all_user_settings(self, user_id):
        user_setting = self.query_one('settings', {'userID': user_id})
        return json.loads(user_setting.get('settings')) if user_setting and user_setting.get('settings') else {}

    def insert_or_update_user_settings(self, user_id, settings):
        old_settings = self.get_all_user_settings(user_id)
        if not old_settings:
            return self.insert_user_settings(user_id, settings)
        else:
            return self.update({'settings': json.dumps(settings)}, {'userID': user_id})







