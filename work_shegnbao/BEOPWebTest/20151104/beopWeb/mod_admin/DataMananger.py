from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app


class DataManager(DbEntity):
    db_name = app.config.get('DATABASE', 'beopdoengine')
    table_name = 'user_data_manager'

    def get_saved_points(self, user_id, project_id, *fields):
        return self.query_one(fields, {'user_id': user_id, 'project_id': project_id})

    def insert_points(self, user_id, project_id, points):
        return self.insert({'user_id': user_id, 'project_id': project_id, 'points': points})

    def update_points(self, user_id, project_id, points):
        return self.update({'points': points}, {'user_id': user_id, 'project_id': project_id})
