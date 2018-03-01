__author__ = 'liqian'
from beopWeb.mod_common.Utils import Utils
from beopWeb import app


class Transaction:
    db_name = app.config.get('WORKFLOW_DATABASE') or 'workflow'
    table_name = 'transaction'

    @staticmethod
    def get_transaction_by_id(transaction_id, *fields):
        sql = 'SELECT ' + ','.join(fields) + \
              ' from ' + Transaction.table_name + \
              ' where id=%s'
        rv = Utils.DbHelper().db.op_db_query_one(Transaction.db_name, sql, (transaction_id,))
        return {key: value for key, value in zip(fields, rv)}

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


