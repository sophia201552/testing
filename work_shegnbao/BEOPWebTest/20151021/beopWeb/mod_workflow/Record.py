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
    VERIFIED = 'verified'
    NOT_PASS = 'not_pass'
    REPLY = 'reply'
    DELETE = 'delete'



class Record(DbEntity):
    db_name = app.config.get('WORKFLOW_DATABASE', 'workflow')
    table_name = 'operation_record'
    fields = ('id', 'opTime', 'userId', 'op', 'title', 'detail', 'linkToTransactionId')

    def get_records_by_trans_id(self, trans_id):
        records = self.get_cache(trans_id)
        if not records:
            records = self.query(self.fields, where=('linkToTransactionId=%s', (trans_id,)), order=["opTime DESC"])
            self.set_cache(trans_id, records)
        return records

    def add_records(self, user_id, trans_id, data, record_type):
        if record_type is None:
            raise Exception('操作类型不能为空')
        if trans_id is None:
            raise Exception('trans id 不能为空')
        records = self.get_cache(trans_id)
        if not records:
            records = []
        data['linkToTransactionId'] = trans_id
        data['opTime'] = datetime.now()
        data['op'] = record_type
        data['userId'] = user_id
        inserted_id = self.insert_with_return_id(data)
        data['id'] = inserted_id
        records.append(data)
        records = sorted(records, key=lambda x: x.get('opTime'), reverse=True)
        self.set_cache(trans_id, records)
        return inserted_id

    def add_records_edit(self, user_id, trans_id, data, record_type):
        if record_type is None:
            raise Exception('操作类型不能为空')
        if trans_id is None:
            raise Exception('trans id 不能为空')
        records = self.get_cache(trans_id)
        if not records:
            records = []
        data['linkToTransactionId'] = trans_id
        data['opTime'] = datetime.now()
        data['op'] = record_type
        data['userId'] = user_id
        inserted_id = self.insert_with_return_id(data)
        data['id'] = inserted_id
        records.append(data)
        records = sorted(records, key=lambda x: x.get('opTime'), reverse=True)
        self.set_cache(trans_id, records)
        return inserted_id
