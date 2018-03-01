from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app


class DtuServerProject(DbEntity):
    db_name = app.config.get('DATABASE', 'beopdoengine')
    table_name = 'dtuserver_prj'
    fields = ('id', 'dtuname', 'dbip', 'dbuser', 'dbname', 'dbpsw', 'dtuRemark', 'bSendData', 'nSendType',
              'nSendDataInterval', 'bSendEmail', 'nLastSendHour', 'nReSendType', 'synRealTable', 'bDTUProject')

    def __init__(self, dtu_id=None):
        super().__init__()
        self.id = dtu_id

    def get_dtu_server_by_project_id(self, project_id):
        dtu = self.get_cache(project_id)
        if not dtu:
            dtu = self.query_one(self.fields,
                                 where=('id=(select dtuprojectid from dtusert_to_project where projectid=%s)',
                                        (project_id,)))
            self.set_cache(project_id, dtu)
        return dtu

    def get_by_dtu_name(self, dtu_name):
        return self.query_one(self.fields, where=('dtuname=%s', (dtu_name,)))

    def set_dtu_remark(self, remark):
        if not self.id:
            raise Exception('dtu id 不能为空')
        return self.update({'dtuRemark': remark}, where=('id = %s', (self.id,)))
