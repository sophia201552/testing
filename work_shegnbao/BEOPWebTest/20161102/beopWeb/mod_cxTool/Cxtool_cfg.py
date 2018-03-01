from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app


class CxToolCfg(DbEntity):
    db_name = app.config.get('DATABASE', 'beopdoengine')
    table_name = 'cxtool_cfg'
    fields = ('projectId', 'host', 'port')

    def get_config(self, project_id):
        value = self.get_cache(project_id)
        if value is None:
            config = self.query_one(self.fields, where=('projectId=%s', (project_id,)))
            if config is None:
                return False
            host = config.get('host')
            port = config.get('port')
            value = host + ':' + str(port)
            self.set_cache(project_id, value)
        return value
