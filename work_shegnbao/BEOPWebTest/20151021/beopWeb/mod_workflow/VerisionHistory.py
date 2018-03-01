from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app


class VersionHistory(DbEntity):
    db_name = 'beopdoengine'
    table_name = 'beop_version_history'
    fields = ('id', 'userId', 'log', 'version')

    # 得到当前版本
    def get_current_version(self):
        # limit 设置了1
        sql = "SELECT id,userId,log,version FROM beop_version_history order by id DESC limit 1"
        search_result = self.query(self.fields, order=["id DESC"], limit=[0, 1])
        if search_result:
            return search_result
        else:
            return False

    # 得到准确的一个版本
    def get_accurate_verison(self, version_id):
        search_result = self.query_one(self.fields, where=('id=%s', [version_id]))
        if search_result:
            return search_result
        else:
            return False

    def get_version_history(self):
        # limit 设置了100
        search_result = self.query(self.fields, limit=[0, 100])
        if search_result:
            # 这里反序
            search_result.reverse()
            return search_result
        else:
            return False

    def add_version_history(self, user_id, data):
        insert = {
            "userId": user_id,
            "log": data.get("html"),
            "version": data.get("title_version")
        }
        return_id = self.insert_with_return_id(insert)
        if return_id:
            return return_id
        else:
            return False

    def update_version_history(self, user_id, version_id, data):
        update = {
            "log": data.get('html'),
            "version": data.get('title_version')
        }
        result = self.update(update, where=('userId=%s and id=%s', (user_id, version_id)))
        if result:
            return True
        else:
            return False
