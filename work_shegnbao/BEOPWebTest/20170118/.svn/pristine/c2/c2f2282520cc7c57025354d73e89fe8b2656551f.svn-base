from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app


class DtusertToProject(DbEntity):
    db_name = app.config.get('DATABASE', 'beopdoengine')
    table_name = 'dtusert_to_project'
    fields = ('dtuprojectid', 'projectid')

    def get_all(self):
        return self.query(self.fields)

    def get_map(self):
        all_result = self.query_one(self.fields)
        return {item.get('dtuprojectid'): item for item in all_result}

    def get_by_dtu(self, dtu):
        return self.query_one(self.fields, where=('dtuprojectid=%s', (dtu,)))
