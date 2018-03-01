__author__ = 'Nomand'
from beopWeb.mod_common.DbEntity import DbEntity


class TransactionAttachment(DbEntity):
    db_name = 'workflow'
    table_name = 'transaction_attachment'
    fields = ('id', 'transId', 'userId', 'file', 'time', 'uid')

    def update_new_task_attachment(self, pending_files, trans_id, user_id):
        for file in pending_files:
            file_name = file.get('fileName')
            uid = file.get('uid')
            rv = self.update({
                "transId": trans_id
            }, where=('file=%s and uid=%s and userId=%s', [file_name, uid, user_id]))
            if not rv:
                return False
        return True

    def upload_new_file(self, trans_id, user_id, file, time, uid):
        model = {
            "transId": trans_id if trans_id else 0,
            "userId": user_id,
            'file': file,
            'time': time,
            'uid': uid
        }
        result = self.insert(model)
        return True if result else False

    def get_files_by_transId_and_userId(self, trans_id, user_id):
        return self.query(self.fields, where=('transId=%s and userId=%s', [trans_id, user_id]))

    def get_files_by_transId(self, trans_id):
        return self.query(self.fields, where=('transId=%s', [trans_id]))

    def delete_file(self, trans_id, user_id, file_name, file_uid):
        return self.delete(
                where=('transId=%s and userId=%s and file=%s and uid=%s', [trans_id, user_id, file_name, file_uid]))

    def is_user_hasOwn_file(self, user_id, trans_id, file_name, file_uid):
        count = self.count(
                where=('userId=%s and transId=%s and file=%s and uid=%s', [user_id, trans_id, file_name, file_uid]))
        return True if count == 1 else False
