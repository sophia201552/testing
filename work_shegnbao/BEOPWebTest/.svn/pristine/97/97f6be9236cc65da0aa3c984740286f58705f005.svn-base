from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app


class TransactionMemberType:
    WATCHER = 1
    VERIFIER = 2

    str_WATCHER = 'WATCHER'
    str_VERIFIER = 'VERIFIER'


class TransactionMemberStatus:
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
        self.delete_cache(trans_id)
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
        self.delete_cache(trans_id)
        if user_id_list:
            for user_id in user_id_list:
                result.append(self.add_verifier(trans_id, int(user_id)))
        return result

    def add_watcher(self, trans_id, user_id):
        model = {'transId': trans_id, 'userId': user_id, 'type': TransactionMemberType.WATCHER, 'status': 0}
        members = self.get_cache(trans_id)
        if members is None or members.get(TransactionMemberType.str_WATCHER) is None:
            if members is None:
                members = {}
            members[TransactionMemberType.str_WATCHER] = {}

        return_id = self.insert_with_return_id(model)
        members[TransactionMemberType.str_WATCHER].update({user_id: model})
        self.set_cache(trans_id, members)
        return return_id

    def add_verifier(self, trans_id, user_id):
        model = {'transId': trans_id, 'userId': user_id, 'type': TransactionMemberType.VERIFIER, 'status': 0}
        members = self.get_cache(trans_id)
        if members is None or members.get(TransactionMemberType.str_VERIFIER) is None:
            if members is None:
                members = {}
            members[TransactionMemberType.str_VERIFIER] = {}

        return_id = self.insert_with_return_id(model)
        members[TransactionMemberType.str_VERIFIER].update({user_id: model})
        self.set_cache(trans_id, members)
        return return_id

    def get_watcher(self, trans_id):
        members = self.get_cache(trans_id)
        if members is None or members.get(TransactionMemberType.str_WATCHER) is None:
            if members is None:
                members = {}
            members[TransactionMemberType.str_WATCHER] = {}
            result = self.query(self.fields,
                                where=('transId=%s and type=' + str(TransactionMemberType.WATCHER),
                                       (trans_id,)))
            for member in result:
                members[TransactionMemberType.str_WATCHER].update({member.get('userId'): member})
            self.set_cache(trans_id, members)
            return result
        else:
            return list(members.get(TransactionMemberType.str_WATCHER).values())

    def get_verifier(self, trans_id):
        members = self.get_cache(trans_id)
        if members is None or members.get(TransactionMemberType.str_VERIFIER) is None:
            if members is None:
                members = {}
            members[TransactionMemberType.str_VERIFIER] = {}
            result = self.query(self.fields,
                                where=('transId=%s and type=' + str(TransactionMemberType.VERIFIER),
                                       (trans_id,)))
            for member in result:
                members[TransactionMemberType.str_VERIFIER].update({member.get('userId'): member})
            self.set_cache(trans_id, members)
            return result
        else:
            return list(members.get(TransactionMemberType.str_VERIFIER).values())

    def is_all_verify_pass(self, trans_id):
        members = self.get_cache(trans_id)
        verifiers = members.get(TransactionMemberType.str_VERIFIER)
        result = 1
        for user_id, verifier in verifiers.items():
            result *= verifier.get('status')
        # 0有人没有验证, 1 全部通过验证,2 有验证不通过
        return result

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
        members = self.get_cache(trans_id)
        verifiers = members.get(TransactionMemberType.str_VERIFIER)
        verifier = verifiers.get(int(user_id))
        if not verifier:
            verifier = verifiers.get(str(user_id))
        verifier['status'] = status
        self.set_cache(trans_id, members)
        return result

    def delete_trans_member(self, tm_id):
        return self.delete(where=('id=%s', (tm_id,)))
