from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb import app
from datetime import datetime


class RecordType:
    START = 'start'
    PAUSE = 'pause'
    COMPLETE = 'complete'
    RESTART = 'restart'
    NEW = 'new'
    EDIT = 'edit'
    FORWARD = 'forward'
    VERIFIED = 'verified'
    NOT_PASS = 'not_pass'
    REPLY = 'reply'
    DELETE = 'delete'
    CLOSE = 'close'
    DELETE_REPLY = 'delete_reply'


class Record(DbEntity):
    db_name = app.config.get('WORKFLOW_DATABASE', 'workflow')
    table_name = 'operation_record'
    fields = ('id', 'opTime', 'userId', 'op', 'title', 'detail', 'linkToTransactionId')

    def get_records_by_trans_id(self, trans_id):
        return self.query(self.fields, where=('linkToTransactionId=%s', (trans_id,)), order=["opTime DESC"])

    def get_notify_records_by_user_id(self, user_id, last_msg_id):
        sql = '''select t.title,o.userId,o.opTime,o.linkToTransactionId,o.op,o.id from operation_record o
                  left join transaction t on t.id = linkToTransactionId
                  where (op='new' or op='reply') and executorId=%s '''
        param = [user_id]
        if last_msg_id:
            sql += ' and o.id>%s'
            param.append(last_msg_id)
        else:
            sql += ' and opTime>%s and opTime<%s'
            param.append(datetime.strftime(datetime.today(), '%Y-%m-%d 00:00:00'))
            param.append(datetime.strftime(datetime.today(), '%Y-%m-%d 23:59:59'))

        sql += ' order by o.id desc'

        result = self.db_helper.db.op_db_query(self.db_name, sql, param)

        return [{'title': item[0], 'userId': item[1], 'opTime': item[2], 'linkToTransactionId': item[3], 'op': item[4],
                 'id': item[5]} for item in result]

    def add_records(self, user_id, trans_id, data, record_type):
        if record_type is None:
            raise Exception('操作类型不能为空')
        if trans_id is None:
            raise Exception('trans id 不能为空')
        data['linkToTransactionId'] = trans_id
        data['opTime'] = datetime.now()
        data['op'] = record_type
        data['userId'] = user_id
        return self.insert_with_return_id(data)

    def add_records_edit(self, user_id, trans_id, data, record_type):
        if record_type is None:
            raise Exception('操作类型不能为空')
        if trans_id is None:
            raise Exception('trans id 不能为空')
        data['linkToTransactionId'] = trans_id
        data['opTime'] = datetime.now()
        data['op'] = record_type
        data['userId'] = user_id
        return self.insert_with_return_id(data)
