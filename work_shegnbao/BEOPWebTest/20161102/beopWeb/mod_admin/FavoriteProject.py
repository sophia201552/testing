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
        favorite_obj = self.query_one(self.fields, where=('user_id=%s', (self.user_id,)))
        if favorite_obj:
            all_projects = Project().get_all_project_map()
            return all_projects.get(favorite_obj.get('project_id'))
        else:
            return None

    def delete_favorite_project(self):
        return self.delete(where=('user_id=%s', (self.user_id,)))

    def set_favorite_project(self, project_id=None):
        self.project_id = project_id
        if not self.project_id:
            raise Exception('project id is empty.')

        self.delete_favorite_project()
        return self.insert({'user_id': self.user_id, 'project_id': self.project_id})
