from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app


class TransactionMemberType:
    WATCHER = 1
    VERIFIER = 2

    str_WATCHER = 'WATCHER'
    str_VERIFIER = 'VERIFIER'


class TransactionMemberStatus:
    NOT_VERIFIER = 0
    PASS = 1
    NOT_PASS = 2


class TransactionMember(DbEntity):
    db_name = app.config.get('WORKFLOW_DATABASE', 'workflow')
    table_name = 'transaction_member'
    fields = ('id', 'transId', 'userId', 'type', 'status')

    def update_watcher(self, trans_id, user_id_list):
        delete_result = self.delete(where=('transId=%s and type=' + str(TransactionMemberType.WATCHER), (trans_id,)))
        if not delete_result:
            return False
        result = []
        if user_id_list:
            for user_id in user_id_list:
                result.append(self.add_watcher(trans_id, user_id))
        return result

    def update_verifier(self, trans_id, user_id_list):
        delete_result = self.delete(
            where=('transId=%s and type=' + str(TransactionMemberType.VERIFIER), (trans_id,)))
        if not delete_result:
            return False
        result = []
        if user_id_list:
            for user_id in user_id_list:
                result.append(self.add_verifier(trans_id, int(user_id)))
        return result

    def add_watcher(self, trans_id, user_id):
        watcher = self.query(self.fields,
                             where=('transId=%s and userId=%s and type=%s',
                                    (trans_id, user_id, TransactionMemberType.WATCHER)))
        if not watcher:
            model = {'transId': trans_id, 'userId': user_id, 'type': TransactionMemberType.WATCHER, 'status': 0}
            return self.insert_with_return_id(model)
        else:
            return -1

    def add_verifier(self, trans_id, user_id):
        model = {'transId': trans_id, 'userId': user_id, 'type': TransactionMemberType.VERIFIER, 'status': 0}
        return self.insert_with_return_id(model)

    def get_watcher(self, trans_id):
        result = self.query(self.fields,
                            where=('transId=%s and type=' + str(TransactionMemberType.WATCHER),
                                   (trans_id,)))
        return result

    def get_verifier(self, trans_id):
        result = self.query(self.fields,
                            where=('transId=%s and type=' + str(TransactionMemberType.VERIFIER),
                                   (trans_id,)))
        return result

    def is_all_verify_pass(self, trans_id):
        verifiers = self.get_verifier(trans_id)
        if verifiers:
            result = 1
            for verifier in verifiers:
                result *= verifier.get('status')
            # 0有人没有验证, 1 全部通过验证,2 有验证不通过
            return result
        return True

    def is_watcher(self, user_id, trans_id):
        watchers = self.get_watcher(trans_id)
        for watcher in watchers:
            if str(watcher.get('userId')) == str(user_id):
                return True
        return False

    def is_verifier(self, user_id, trans_id):
        verifiers = self.get_verifier(trans_id)
        for verifier in verifiers:
            if str(verifier.get('userId')) == str(user_id):
                return True
        return False

    def update_verifier_status(self, user_id, trans_id, status):
        result = self.update({'status': status},
                             where=(
                                 'transId=%s and userId=%s and type=' + str(TransactionMemberType.VERIFIER),
                                 (trans_id, user_id)))
        if not result:
            return False
        return result

    def delete_trans_member(self, tm_id):
        return self.delete(where=('id=%s', (tm_id,)))

    def restore_verifier_satus(self, trans_id):
        result = self.update({'status': 0},
                             where=(
                                 'transId=%s and type=%s',
                                 (trans_id, TransactionMemberType.VERIFIER)))
        if result:
            return True
        else:
            return False

    def get_user_wait_verifier(self, user_id):
        return self.query('transId', where=('userId=%s and type=%s and status=%s',
                                            [user_id, TransactionMemberType.VERIFIER,
                                             TransactionMemberStatus.NOT_VERIFIER]))

    def get_count_user_wait_verifier(self, user_id):
        return self.count(where=('userId=%s and type=%s and status=%s',
                                 [user_id, TransactionMemberType.VERIFIER,
                                  TransactionMemberStatus.NOT_VERIFIER]))
