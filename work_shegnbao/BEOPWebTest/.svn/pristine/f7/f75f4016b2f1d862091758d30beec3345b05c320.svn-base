from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app


class DtuServerProject(DbEntity):
    db_name = app.config.get('DATABASE', 'beopdoengine')
    table_name = 'dtuserver_prj'
    fields = ('id', 'dtuname', 'dbip', 'dbuser', 'dbname', 'dbpsw', 'dtuRemark', 'bSendData', 'nSendType',
              'nSendDataInterval', 'bSendEmail', 'nLastSendHour', 'nReSendType', 'synRealTable', 'bDTUProject')

    def get_dtu_server_by_project_id(self, project_id):
        dtu = self.get_cache(project_id)
        if not dtu:
            dtu = self.query_one(self.fields,
                                 where=('id=(select dtuprojectid from dtusert_to_project where projectid=%s)',
                                        (project_id,)))
            self.set_cache(project_id, dtu)
        return dtu
