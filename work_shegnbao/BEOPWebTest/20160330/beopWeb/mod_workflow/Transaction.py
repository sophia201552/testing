__author__ = 'liqian'

from datetime import datetime

from beopWeb.mod_common.Utils import Utils
from beopWeb import app
from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb.mod_workflow.TransactionMember import TransactionMember
from .Activity import Activity
from .Record import Record
from beopWeb.mod_admin.User import User
from beopWeb.mod_workflow.UserMsgReadHistory import UserMsgReadHistory
from beopWeb.mod_workflow.TransactionGroupUser import TransactionGroupUser
from beopWeb.mod_workflow.TransactionGroup import TransactionGroup


class TransactionStatus:
    # 新创建
    NEW = 0
    # 进行中
    START = 1
    # 点击结束 已经停止了
    END = 2
    # 完成
    COMPLETE = 3
    # 停止后验证通过
    END_VERIFIED = 6
    # 停止后验证不通过
    END_NOT_PASS = 4
    # 完成验证通过
    DEFAULT_VERIFIED = 5
    # 完成验证不通过
    DEFAULT_NOT_PASS = 7
    # 关闭任务，创建人才能关闭任务
    CLOSED = 8


class Transaction(DbEntity):
    db_name = app.config.get('WORKFLOW_DATABASE') or 'workflow'
    table_name = 'transaction'
    fields = (
        'id', 'title', 'detail', 'dueDate', 'creatorID', 'executorID', 'statusId', 'groupid', 'assignTime',
        'completeTime',
        'priority', 'dbName', 'chartPointList', 'chartQueryCircle', 'chartStartTime', 'chartEndTime',
        'createTime', 'critical', 'lastUpdateTime', 'isRead')
    default_order = ('id', 'DESC')

    def get_trans_permission(self, trans_id, user_id):
        if not trans_id or not user_id:
            return 0
        trans = self.get_transaction_by_id(trans_id)
        if not trans:
            return 0
        trans_id = str(trans_id)
        user_id = str(user_id)
        is_executor = str(trans.get('executorID')) == user_id
        is_creator = str(trans.get('creatorID')) == user_id
        tm = TransactionMember()
        is_watcher = tm.is_watcher(user_id, trans_id)
        is_verifier = tm.is_verifier(user_id, trans_id)
        return int(is_creator) * 8 + int(is_executor) * 4 + int(is_verifier) * 2 + int(is_watcher) * 1

    def is_trans_accessible(self, trans_id, user_id):
        if self.get_trans_permission(trans_id, user_id) != 0:
            return True
        trans = Transaction().get_transaction_by_id(trans_id)
        if not trans:
            return False
        return TransactionGroupUser().is_user_in_group(user_id, trans.get('groupid'))

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
        data["lastUpdateTime"] = datetime.now()
        result = self.update(data, where=('id=%s', (trans_id,)))
        if result:
            self.delete_cache(trans_id)

        return result if result else False

    def get_transaction_by_id(self, transaction_id):
        trans = self.get_cache(transaction_id)
        if not trans:
            trans = self.query_one(self.fields, where=('id=%s', (transaction_id,)))
            self.set_cache(transaction_id, trans)
        return trans if trans else False

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
                          ("assignTime >= %s and assignTime <= %s and executorID = %s and statusId =0 and isRead =0",
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
                          where=('(statusId=%s or statusId=%s )and executorID=%s',
                                 [TransactionStatus.DEFAULT_VERIFIED, TransactionStatus.END_VERIFIED, user_id]),
                          limit=(start_num, offset), order=order)

    def get_count_finished_by(self, user_id):
        return self.count(where=(
            '(statusId=%s or statusId=%s ) and executorID=%s',
            [
                TransactionStatus.END_VERIFIED,
                TransactionStatus.DEFAULT_VERIFIED,
                user_id
            ]
        ))

    def get_create_by(self, user_id, start_num, offset, order=('id', 'DESC')):
        order = order if order else self.default_order
        return self.query(self.fields, where=('creatorID=%s', (user_id,)), limit=(start_num, offset), order=order)

    def get_count_create_by(self, user_id):
        return self.count(where=('creatorID=%s', (user_id,)))

    def get_working(self, user_id, start_num, offset, order=('id', 'DESC')):
        order = order if order else self.default_order
        user_id = int(user_id)
        return self.query_distinct(self.fields, where=(
            'statusId <= %s and (id in '
            '(SELECT DISTINCT  transId FROM transaction_member WHERE userId=%s) or executorID=%s or creatorID=%s)',
            (TransactionStatus.COMPLETE, user_id, user_id, user_id)),
                                   order=(order[0], order[1]),
                                   limit=(start_num, offset))

    def get_working_filter(self, user_id, start_num, offset, filter, order=('id', 'DESC')):
        order = order if order else self.default_order
        user_id = int(user_id)
        activity = Activity()
        sql = 'SELECT * FROM `transaction` WHERE '
        param_list = []
        for type in filter:
            param = filter.get(type)
            if isinstance(param, dict):
                pass
            else:
                param = int(param)
            if type == "group":
                sql += " groupId =%s and "
                param_list.append(param)
            if type == "tags":
                sql += " id in (select transId from transaction_tag where tagId=%s) and "
                param_list.append(param)
            elif type == 'creator':
                if param == 1:
                    sql += ' creatorID=%s and ' % (user_id)
                elif param == 2:
                    sql += " creatorID!=%s and " % (user_id)
            elif type == "urgency":
                if param == 1:
                    sql += " critical=%s and "
                    param_list.append(param)
                elif param == 2:
                    sql += " critical=%s and "
                    param_list.append(param)
                elif param == 3:
                    sql += " critical=%s and "
                    param_list.append(param)
            elif type == "status":
                sql += " statusId=%s and "
                param_list.append(param)
            elif type == "dueDate":
                start_time = ""
                end_time = ""
                if isinstance(param, dict):
                    start_time = datetime.strptime(param.get('startTime'), '%Y-%m-%d').strftime("%Y-%m-%d 00:00:00")
                    end_time = datetime.strptime(param.get("endTime"), '%Y-%m-%d').strftime("%Y-%m-%d 23:59:59")
                else:
                    date_now = datetime.now()
                    if param == 1:
                        time_duration = activity.get_today_duration(date_now)
                    elif param == 2:
                        time_duration = activity.get_tomorrow_duration(date_now)
                    elif param == 3:
                        time_duration = activity.get_weekly_duration(date_now)
                    elif param == 4:
                        time_duration = activity.get_monthly_duration(date_now)
                    else:
                        time_duration = activity.get_monthly_duration(date_now)
                    start_time = time_duration.get('start')
                    end_time = time_duration.get('end')
                sql += " dueDate >=%s and dueDate <=%s and "
                param_list.append(start_time)
                param_list.append(end_time)
        all_count_param_list = []
        all_param_list = []
        if filter.get('status') is None:
            sql += ' (id in ' \
                   '(SELECT DISTINCT  transId FROM transaction_member WHERE userId=%s)  or executorID=%s or creatorID=%s) '
            all_count_param_list = param_list + [user_id, user_id, user_id]
            all_param_list = param_list + [user_id, user_id, user_id, order[0], order[1], start_num, offset]
        else:
            sql += ' id in ' \
                   '(SELECT DISTINCT  transId FROM transaction_member WHERE userId=%s) and executorID=%s '
            all_count_param_list = param_list + [user_id, user_id]
            all_param_list = param_list + [user_id, user_id, order[0], order[1], start_num, offset]
        count_sql = sql.replace("*", "COUNT(*)")

        count = self.db_helper.db.op_db_query(self.db_name, count_sql, all_count_param_list)
        rv = self.db_helper.db.op_db_query(self.db_name, sql + "ORDER BY %s %s LIMIT %s , %s ",
                                           all_param_list)
        if rv:
            return [{key: value for key, value in zip(self.fields, rv_item)} for rv_item in rv], count[0]
        else:
            return [], count[0]

    def get_count_working(self, user_id):
        user_id = int(user_id)
        return self.count(where=(
            'statusId <= %s and (id in '
            '(SELECT DISTINCT  transId FROM transaction_member WHERE userId=%s) or executorID=%s or creatorID=%s)',
            (TransactionStatus.COMPLETE, user_id, user_id, user_id)))

    def get_by_group_id(self, user_id, group_id, start_num, offset, order=('id', 'DESC')):
        order = order if order else self.default_order
        return self.query(self.fields, where=(
            ''' groupid=%s and (creatorId=%s or executorID=%s) or id in (select tm.transId from TRANSACTION_MEMBER tm left join TRANSACTION t on tm.transId = t.id where userId=%s and groupId=%s)''',
            (group_id, user_id, user_id, user_id, group_id)), limit=(start_num, offset), order=order)

    def get_count_by_group_id(self, user_id, group_id):
        tg = TransactionGroup()
        is_creator = tg.is_creator(user_id, group_id)
        if is_creator:
            return self.count(where=('groupid=%s', (group_id,)))
        else:
            return self.count(where=(
                ''' groupid=%s and (creatorId=%s or executorID=%s) or id in (select tm.transId from TRANSACTION_MEMBER tm left join TRANSACTION t on tm.transId = t.id where userId=%s and groupId=%s)''',
                (group_id, user_id, user_id, user_id, group_id)))

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
        return self.query_distinct(self.fields,
                                   where=('(id in (select transId from transaction_member where userId=%s) '
                                          'or (executorID=%s or creatorID=%s)) '
                                          'and (title like %s or detail like %s or id like %s)',
                                          (user_id, user_id, user_id, sql_text, sql_text, sql_text)),
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

    # 得到新创建的工单
    def get_new_created(self, user_id, start_num, offset, order={"id", "DESC"}):
        order = order if order else self.default_order
        return self.query(self.fields,
                          where=('statusId=%s and executorID=%s', [TransactionStatus.NEW, user_id]),
                          limit=(start_num, offset), order=order)

    def get_count_new_created(self, user_id):
        return self.count(where=('statusId=%s and executorID=%s', [TransactionStatus.NEW, user_id]))

        # 得到进行中的工单

    def get_started_trans(self, user_id, start_num, offset, order={"id", "DESC"}):
        order = order if order else self.default_order
        return self.query(self.fields,
                          where=(
                              '(statusId=%s or statusId=%s or statusId=%s) and executorID=%s',
                              [TransactionStatus.START, TransactionStatus.DEFAULT_NOT_PASS,
                               TransactionStatus.END_NOT_PASS, user_id]),
                          limit=(start_num, offset), order=order)

    def get_count_started_trans(self, use_id):
        return self.count(where=('executorID=%s and statusId=%s', [use_id, TransactionStatus.START]))

        # 得到完成了，等待验证的工单

    def get_wait_verify_trans(self, user_id, start_num, offset, order={"id", "DESC"}):
        order = order if order else self.default_order
        return self.query(self.fields,
                          where=('(statusId=%s or statusId=%s) and executorID=%s',
                                 [TransactionStatus.COMPLETE, TransactionStatus.END, user_id]),
                          limit=(start_num, offset), order=order)

    def get_count_wait_verify_trans(self, user_id):
        return self.count(
            where=(
                '(statusId=%s or statusId=%s) and executorID=%s',
                [TransactionStatus.COMPLETE, TransactionStatus.END, user_id]))

    # 开始工单任务
    def start_trans(self, trans_id):
        return self.update_trans(trans_id, {
            "isRead": 1,
            "statusId": TransactionStatus.START
        })

    # 更新执行人员
    def update_executor(self, trans_id, executor_id):
        # 转发完之后设置 statusId为0
        result = self.update_trans(trans_id, {
            "executorId": executor_id,
            "statusId": TransactionStatus.START
        })
        return bool(result)

    # 关闭任务
    def close_task(self, trans_id):
        result = self.update_trans(trans_id, {
            "statusId": TransactionStatus.CLOSED
        })
        return bool(result)

    def get_count_stop_verified(self, user_id):
        return self.count(where=('statusId=%s and executorID=%s', [TransactionStatus.CLOSED, user_id]))

    def get_stop_verified_task(self, user_id, start_num, offset, order=('id', 'DESC')):
        order = order if order else self.default_order
        return self.query(self.fields,
                          where=('statusId=%s and executorID=%s',
                                 [TransactionStatus.CLOSED, user_id]),
                          limit=(start_num, offset), order=order)

    def get_count_complete_verified(self, user_id):
        return self.count(where=('statusId=%s and executorID=%s', [TransactionStatus.DEFAULT_VERIFIED, user_id]))

    def get_complete_verified_task(self, user_id, start_num, offset, order=('id', 'DESC')):
        order = order if order else self.default_order
        return self.query(self.fields,
                          where=('statusId=%s and executorID=%s',
                                 [TransactionStatus.DEFAULT_VERIFIED, user_id]),
                          limit=(start_num, offset), order=order)

    def get_wait_me_to_verifier(self, id_list, start_num, offset, order={"id", "DESC"}):
        order = order if order else self.default_order
        param = []
        for id in id_list:
            param.append(id.get("transId"))
        sql = 'id in (%s) and (statusId=%s or statusId=%s)' % (','.join(
            map(lambda x: '%s', param)), TransactionStatus.END, TransactionStatus.COMPLETE)
        return self.query(self.fields, where=(sql, param), limit=(start_num, offset), order=order)

    def get_user_trans_by_prev_duration(self, user_id, duration):
        return self.query(self.fields,
                          where=(
                              'executorID=%s and dueDate>=%s and dueDate<=%s',
                              [user_id, duration.get('start_time').strftime("%Y-%m-%d 00:00:00"),
                               duration.get('end_time').strftime("%Y-%m-%d 00:00:00")]))

    def get_user_trans_by_now_duration(self, user_id, duration):
        start_time = duration.get('start_time').strftime("%Y-%m-%d 00:00:00")
        end_time = duration.get('end_time').strftime("%Y-%m-%d 00:00:00")
        return self.query_distinct(self.fields,
                                   where=('executorID= %s and createTime >= %s and ( dueDate <= %s OR dueDate >=%s )',
                                          (user_id, start_time, end_time, end_time)))

    def trans_remind(self, user_id):
        record = Record()
        lastMsgRead = UserMsgReadHistory(user_id)

        progress = record.get_notify_records_by_user_id(user_id, lastMsgRead.get_last_msg_id())
        if progress and progress[0]:
            lastMsgRead.update_last_msg_id(progress[0].get('id'))
        if progress:
            all_user = User().get_all_user_map()
            for item in progress:
                item['transTitle'] = item.get('title')
                user_id = item.get('userId')
                user = all_user.get(user_id)
                if user:
                    item['userfullname'] = user.get('userfullname')
                    item['userpic'] = user.get('userpic')
                    item['useremail'] = user.get('useremail')
                item['opTime'] = item.get('opTime').strftime(Utils.datetime_format_full)
            return progress
        else:
            return []
