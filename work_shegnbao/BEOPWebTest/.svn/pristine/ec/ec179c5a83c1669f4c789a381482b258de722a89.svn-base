from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app


class VersionHistory(DbEntity):
    db_name = 'beopdoengine'
    table_name = 'beop_version_history'
    fields = ('id', 'userId', 'log', 'version', 'owners')

    # 得到当前版本
    def get_current_version(self):
        # limit 设置了1
        search_result = self.query(self.fields, order=["id DESC"], limit=[0, 1])
        if search_result:
            return search_result
        else:
            return False

    # 得到准确的一个版本
    def get_accurate_version(self, version_id):
        search_result = self.query_one(self.fields, where=('id=%s', [version_id]))
        if search_result:
            return search_result
        else:
            return False

    def delete_version_history(self, version_id):
        result = self.delete(where=('id=%s', [version_id]))
        if result:
            return True
        else:
            return False

    def get_version_history(self, user_id):

        ver = app.config.get('VERSION')
        if ver and not self.get_version(ver):
            self.add_new_version(ver)

        return self.get_latest_version(20, user_id)

    def get_version(self, version):
        return self.query(self.fields, where=('version=%s', [version]))

    def get_latest_version(self, num, user_id):
        from beopWeb.BEOPDataAccess import BEOPDataAccess
        # TODO 这里需要改进
        result = self.query(self.fields, limit=[0, num], order=["id DESC"])
        if user_id == 1:
            return result
        projectId_list = [str(project.get('id')) for project in BEOPDataAccess.getInstance().getProject(user_id)]
        remove_item = []
        for item in result:
            owners = item.get('owners')
            if not owners:
                remove_item.append(item)
            else:
                # 用户的项目ID列表里面是否在 该条版本信息的 owners 里面
                isOwners = False
                for owners_id in eval(owners):
                    if owners_id in projectId_list:
                        isOwners = True
                if not isOwners:
                    remove_item.append(item)
                continue
        # 移除
        for item in remove_item:
            if item in result:
                result.remove(item)
        return result

    def add_new_version(self, ver):
        insert_admin_id = 1
        return self.add_version_history(insert_admin_id, {
            "html": "",
            "title_version": ver
        })

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

    def update_version_owners(self, version_id, owners):
        return self.update({
            "owners": owners
        }, where=('id=%s', [version_id]))

    def get_code_version(self):
        ver = app.config.get('VERSION', 'dev')
        return [{'version': ver}]

