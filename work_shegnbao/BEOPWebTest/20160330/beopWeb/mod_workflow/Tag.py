from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app


class TagType:
    SYSTEM = 0
    CUSTOMISE = 1


class Tag(DbEntity):
    db_name = app.config.get('WORKFLOW_DATABASE', 'workflow')
    table_name = 'tag'
    fields = ('id', 'name', 'color', 'userId', 'type')

    def add_tag(self, data):
        tag_id = self.insert_with_return_id(data)
        self.get_by_id(tag_id)
        return tag_id

    def get_by_id(self, tag_id):
        tag = self.get_cache(tag_id)
        if tag is None:
            tag = self.query_one(self.fields, where=('id=%s', [tag_id]))
            self.set_cache(tag.get('id'), tag)
        return tag

    def get_by_user_id(self, user_id):
        return self.query(self.fields, where=('userId=%s', [user_id]))

    def delete_by_id(self, tag_id):
        result = self.delete(where=('id=%s', [tag_id]))
        if result:
            self.delete_cache(tag_id)
        return result

    def update_by_id(self, tag_id, data):
        result = self.update(data, where=('id=%s', [tag_id]))
        if result:
            tag = self.get_cache(tag_id)
            if tag:
                tag.update(data)
                self.set_cache(tag.get('id'), tag)
        return result
