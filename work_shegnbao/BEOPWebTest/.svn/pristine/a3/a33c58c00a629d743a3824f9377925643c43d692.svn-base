__author__ = 'liqian'

from beopWeb.mod_common.Utils import Utils
from beopWeb import app
from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb.mod_workflow.TransactionMember import TransactionMember


class TransactionStatus:
    NEW = 0
    COMPLETE = 4
    VERIFIED = 5
    NOT_PASS = 6


class Transaction(DbEntity):
    db_name = app.config.get('WORKFLOW_DATABASE') or 'workflow'
    table_name = 'transaction'
    fields = ('id', 'title', 'detail', 'dueDate', 'creatorID', 'executorID', 'statusId', 'groupid', 'assignTime',
              'priority', 'dbName', 'chartPointList', 'chartQueryCircle', 'chartStartTime', 'chartEndTime',
              'createTime', 'critical')
    default_order = ('id', 'DESC')

    def get_trans_permission(self, trans_id, user_id):
        if not trans_id or not user_id:
            return 0
        trans = self.get_transaction_by_id(trans_id)
        if not trans:
            return 0
        is_executor = trans.get('executorID') == user_id
        is_creator = trans.get('creatorID') == user_id
        tm = TransactionMember()
        is_watcher = tm.is_watcher(user_id, trans_id)
        is_verifier = tm.is_verifier(user_id, trans_id)
        return int(is_creator) * 8 + int(is_executor) * 4 + int(is_verifier) * 2 + int(is_watcher) * 1

    def add_trans(self, data):
        trans_id = self.insert_with_return_id(data)
        self.get_transaction_by_id(trans_id)
        return trans_id

    def delete_trans(self, trans_id):
        result = self.delete(where=('id=%s', (trans_id,)))
        if result:
            self.delete_cache(trans_id)
        return result

    def update_trans(self, trans_id, data):
        result = self.update(data, where=('id=%s', (trans_id,)))
        if result:
            self.delete_cache(trans_id)
            self.get_transaction_by_id(trans_id)
        return result

    def get_transaction_by_id(self, transaction_id):
        trans = self.get_cache(transaction_id)
        if trans is not None:
            return trans

        trans = self.query_one(self.fields, where=('id=%s', (transaction_id,)))
        self.set_cache(transaction_id, trans)
        return trans

    @staticmethod
    def get_my_created_transaction(creator_id, where=None):
        sql = '''SELECT t.id id,
                    t.executorID executorID,
                    u1.userfullname executorName,
                    t.title title, t.dueDate dueDate,
                    t.statusId statusId, ts.value statusName,
                    t.groupId groupId, t.createTime createTime,
                    t.creatorID creatorID,
                    u2.userfullname creatorName,
                    tg.name groupName, t.critical critical
                    FROM workflow.transaction t
                    LEFT JOIN beopdoengine.user u1 ON t.executorID = u1.id
                    LEFT JOIN beopdoengine.user u2 ON t.creatorID = u2.id
                    LEFT JOIN workflow.transaction_status ts ON ts.id = t.statusId
                    LEFT JOIN workflow.transaction_group tg ON tg.id = t.groupid '''
        if not where:
            where = {'t.creatorID': creator_id}
        else:
            where['t.creatorID'] = creator_id

        where = ('=%s and '.join(where.keys()) + '=%s ', list(where.values()))
        sql += " WHERE %s" % where[0]

        rv = Utils.DbHelper().db.op_db_query(Transaction.db_name, sql, where[1] if where and len(where) > 1 else ())
        fields = ['id', 'executorID', 'executorName',
                  'title', 'dueDate', 'statusId',
                  'statusName', 'groupId', 'createTime',
                  'creatorID', 'creatorName', 'groupName',
                  'critical']
        return [{key: value for key, value in zip(fields, item)} for item in rv]

    def get_user_transaction_by_between(self, user_id, start='', end=''):
        # 获取用户某段时间的新工单
        return self.query(self.fields,
                          ("assignTime >= %s and assignTime <= %s and executorID = %s and statusId<4",
                           [start, end, user_id]))

    def get_star_by(self, user_id, start_num, offset, order=('id', 'DESC')):
        order = order if order else self.default_order
        return self.query(self.fields,
                          where=('id in (select transaction_id from user_star where user_id=%s)', (user_id,)),
                          limit=(start_num, offset), order=order)

    def get_count_star_by(self, user_id):
        return self.count(where=('id in (select transaction_id from user_star where user_id=%s)', (user_id,)))

    def get_finished_by(self, user_id, start_num, offset, order=('id', 'DESC')):
        order = order if order else self.default_order
        return self.query(self.fields,
                          where=('executorID=%s and statusId=' + str(TransactionStatus.VERIFIED), (user_id,)),
                          limit=(start_num, offset), order=order)

    def get_count_finished_by(self, user_id):
        return self.count(where=('executorID=%s and statusId=' + str(TransactionStatus.VERIFIED), (user_id,)))

    def get_create_by(self, user_id, start_num, offset, order=('id', 'DESC')):
        order = order if order else self.default_order
        return self.query(self.fields, where=('creatorID=%s', (user_id,)), limit=(start_num, offset), order=order)

    def get_count_create_by(self, user_id):
        return self.count(where=('creatorID=%s', (user_id,)))

    def get_working(self, user_id, start_num, offset, order=('id', 'DESC')):
        order = order if order else self.default_order
        return self.query(self.fields,
                          where=('executorID=%s and statusId!=' + str(TransactionStatus.VERIFIED), (user_id,)),
                          limit=(start_num, offset), order=order)

    def get_count_working(self, user_id):
        return self.count(where=('executorID=%s and statusId!=' + str(TransactionStatus.VERIFIED), (user_id,)))

    def get_by_group_id(self, group_id, start_num, offset, order=('id', 'DESC')):
        order = order if order else self.default_order
        return self.query(self.fields, where=('groupid=%s', (group_id,)), limit=(start_num, offset), order=order)

    def get_count_by_group_id(self, group_id):
        return self.count(where=('groupid=%s', (group_id,)))

    def get_join_by(self, user_id, start_num, offset, order=('id', 'DESC')):
        order = order if order else self.default_order
        return self.query(self.fields, where=(
            'id in (select transId from transaction_member where userId=%s)',
            (user_id,)), limit=(start_num, offset), order=order)

    def get_count_join_by(self, user_id):
        return self.count(where=('id in (select transId from transaction_member where userId=%s)', (user_id,)))

    def get_transaction_by_text(self, user_id, text, start_num, offset, order=('id', 'DESC')):
        order = order if order else self.default_order
        sql_text = '%' + text + '%'
        return self.query(self.fields,
                          where=('(executorID=%s or creatorID=%s) and (title like %s or detail like %s or id like %s)',
                                 (user_id, user_id, sql_text, sql_text, sql_text)),
                          limit=(start_num, offset), order=order)

    def get_count_by_text(self, user_id, text):
        sql_text = '%' + text + '%'
        return self.count(where=(
            '(executorID=%s or creatorID=%s) and (title like %s or detail like %s or id like %s)',
            (user_id, user_id, sql_text, sql_text, sql_text)))

    def get_transaction_by_tag(self, tag_id, start_num, offset, order=('id', 'DESC')):
        order = order if order else self.default_order
        return self.query(self.fields,
                          where=('id in (select transId from transaction_tag where tagId=%s)',
                                 (tag_id,)),
                          limit=(start_num, offset), order=order)
