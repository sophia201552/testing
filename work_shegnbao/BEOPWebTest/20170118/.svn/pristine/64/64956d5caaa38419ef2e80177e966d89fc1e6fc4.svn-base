from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app


class DtuServerProjectInfo(DbEntity):
    db_name = app.config.get('DATABASE', 'beopdoengine')
    table_name = 'dtuserver_prj_info'
    fields = ('id', 'online', 'dberr', 'LostCount', 'LostMinute',
              'UnReceiveMinute', 'ReceivePointCount', 'LostPackageCount',
              'StartTime', 'LastOnlineTime', 'LastReceivedTime', 'FileRec', 'FileSend',
              'RecHistoryCount', 'NeedHistroyCount', 'remark')

    def get_all_dtu_server_status(self):
        return self.query(self.fields)

    def get_all_dtu_server_status_map(self):
        all_status = self.get_all_dtu_server_status()
        return {item.get('id'): item for item in all_status}

    def update_dtu_server_status(self, dtu_id, data):
        return self.update(data, where=('id=%s', (dtu_id,)))
