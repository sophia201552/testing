from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app


class RealTimeData(DbEntity):
    db_name = app.config.get('DATABASE', 'beopdoengine')
    fields = ('time', 'pointname', 'pointvalue')

    def __init__(self, table_name):
        super().__init__()
        self.table_name = table_name

    def get_all_data(self):
        all_data = self.get_cache('all')
        if not all_data:
            all_data = self.query(self.fields)
            self.set_cache('all', all_data, timeout=60)
        return all_data

    def get_all_data_map(self):
        all_data = self.get_all_data()
        return {item.get('pointname'): item for item in all_data}
