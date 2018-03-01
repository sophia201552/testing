from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app


class RealTimeData(DbEntity):
    db_name = app.config.get('DATABASE', 'beopdoengine')
    fields = ('time', 'pointname', 'pointvalue')

    def __init__(self, table_name):
        super().__init__()
        self.table_name = table_name

    def get_all_data(self):
        return self.query(self.fields)

    def get_all_data_map(self):
        all_data = self.get_all_data()
        return {item.get('pointname'): item for item in all_data}
