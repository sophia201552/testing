from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app


class TransactionTag(DbEntity):
    db_name = app.config.get('WORKFLOW_DATABASE', 'workflow')
    table_name = 'transaction_tag'
    fields = ('id', 'transId', 'tagId')

    def add_tag_to_trans(self, tag_id, trans_id):
        model = {'transId': trans_id, 'tagId': tag_id}
        return self.insert_with_return_id(model)

    def delete_tag_from_trans(self, trans_id, tag_id):
        return self.delete(where=('transId=%s and tagId=%s', (trans_id, tag_id)))

    def empty_trans_tag(self, trans_id):
        return self.delete(where=('transId=%s', (trans_id,)))

    def get_trans_by_tag_id(self, tag_id):
        return self.query(self.fields, where=('tagId=%s', (tag_id,)))

    def get_tag_by_trans_id(self, trans_id):
        return self.query(self.fields, where=('transId=%s', (trans_id,)))

    def update_tag_by_trans_id(self, trans_id, tag_list):
        empty_result = self.empty_trans_tag(trans_id)
        if not empty_result:
            return False
        add_result = True

        error_msg = ''
        if tag_list is None:
            error_msg = 'error: tag_list is empty'
            return error_msg
        else:
            for item in tag_list:
                add_result &= self.add_tag_to_trans(item, trans_id)
        return add_result

    def get_trans_count_by_id(self, tag_id):
        return self.count(where=('tagId=%s', (tag_id,)))
