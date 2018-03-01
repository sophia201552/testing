from beopWeb import app
from beopWeb.mod_admin.User import User
from .TransactionGroup import TransactionGroup
from beopWeb.mod_admin.User import User
from beopWeb.mod_common.Utils import *
from datetime import datetime
from .Transaction import Transaction
from .TransactionMember import TransactionMember


class TransactionEmail():
    record_detail_prefix_cn = {
        "verifiers": "审核人",
        "executor": "执行人",
        "watchers": "相关人员",
        "creator": "创建人",
        "detail": "工单详情",
        "critical": "紧急程度",
        "title": "标题",
        "dueDate": "截止时间",
        "groupid": "任务组",
        "critical_level": {
            "0": "一般",
            "1": "严重",
            "2": "紧急"
        }
    }
    # Tips start--------------------------------------------------------------
    # 创建新的任务-》执行人，审核人
    # 编辑任务-》所有人
    # 更改任务状态-》创建人，审核人，相关人员
    # 回复工单信息 -》审核人，执行人
    # Tips end--------------------------------------------------------------


    # 完成，任务通过，任务不通过
    def send_status_email(self, trans, tm, trans_id, user_id, status, status_subject):
        verifiers_id_list = []
        watchers_id_list = []
        verifiers = tm.get_verifier(trans_id)
        executor_id = trans.get('executorID')
        creator_id = trans.get('creatorID')
        watchers = tm.get_watcher(trans_id)
        datetime_now = datetime.now().strftime('%y-%m-%d %I:%M:%S %p')
        # 审核人的id
        for verifiers_get_by_tans in verifiers:
            verifiers_id_list.append(verifiers_get_by_tans.get('userId'))
        # 相关人员的id
        for watchers_get_by_tans in watchers:
            watchers_id_list.append(watchers_get_by_tans.get('userId'))

        user = User()
        verifiers_email_list = []
        watchers_email_list = []

        executor_user_info = user.query_user_by_id(executor_id, 'useremail', 'userfullname')
        creator_user_info = user.query_user_by_id(creator_id, 'useremail', 'userfullname')
        creator_email = creator_user_info.get('useremail')
        executor_email = executor_user_info.get('useremali')

        # 不给执行人发送邮件
        # 判断审核人员是否和执行人重复
        for verifiers_id in verifiers_id_list:
            if verifiers_id is None or verifiers_id == executor_id:
                continue
            else:
                verifiers_email_list.append(user.query_user_by_id(verifiers_id, 'useremail').get('useremail'))
        # 判断相关人员是否和执行人重复
        for watchers_id in watchers_id_list:
            if watchers_id is None or watchers_id == executor_id:
                continue
            else:
                watchers_email_list.append(user.query_user_by_id(watchers_id, 'useremail').get('useremail'))
        pass_verify_config_map = {
            "time": datetime_now,
            "user": executor_user_info.get('userfullname'),
            "operation": status,
            "id": trans_id,
            "title": trans.get('title'),
            "detail": trans.get('detail')
        }
        # 给创建者发邮件
        is_one_person = False
        if executor_id == creator_id:
            is_one_person = True
        # 判断执行人和创建人是否是同一个人
        if not is_one_person:
            creator_email_list = [creator_user_info.get('useremail')]
            for creator_email in creator_email_list:
                if creator_email is not None:
                    try:
                        email_html = render_template('email/workflowStatusEmail.html', configMap=pass_verify_config_map)
                        Utils.EmailTool.send_email(status_subject, creator_email, email_html)
                    except Exception as e:
                        continue
        # 给执行人发邮件
        # 强行转化为数组便于continue操作
        if not is_one_person:
            executor_email_list = [executor_email]
            for executor_email_each in executor_email_list:
                if executor_email_each is not None:
                    try:
                        email_html = render_template('email/workflowStatusEmail.html', configMap=pass_verify_config_map)
                        Utils.EmailTool.send_email(status_subject, executor_email_each, email_html)
                    except Exception as e:
                        continue

        # 给审核人发邮件
        for verifiers_email in verifiers_email_list:
            # 如果审核人的邮件和创建人或执行人相同
            if not verifiers_email or verifiers_email is None or verifiers_email == creator_email or verifiers_email == executor_email:
                continue
            else:
                try:
                    email_html = render_template('email/workflowStatusEmail.html', configMap=pass_verify_config_map)
                    Utils.EmailTool.send_email(status_subject, verifiers_email, email_html)
                except Exception as e:
                    continue
        # 给相关人员发邮件
        for watchers_email in watchers_email_list:
            # 如果相关人员的邮件和创建人或者执行人或者审核人相同
            if not watchers_email or watchers_email is None or watchers_email == creator_email or watchers_email == executor_email or watchers_email in verifiers_email_list:
                continue
            else:
                try:
                    email_html = render_template('email/workflowStatusEmail.html', configMap=pass_verify_config_map)
                    Utils.EmailTool.send_email(status_subject, watchers_email, email_html)
                except Exception as e:
                    continue
        return True

    # 新建工单
    # 创建完工单会给审核人发送邮件 开始了状态
    def send_new_email(self, trans_id, request_json, new_email_subject):
        # 只会发送执行人和审核人
        user = User()
        verifier_email_list = []
        date_time_now = datetime.now().strftime('%y-%m-%d %I:%M:%S %p')
        # 执行者邮箱列表
        user_id = request_json.get('userId')
        due_date = request_json.get('dueDate')
        title = request_json.get('title')
        detail = request_json.get('detail')
        executor_list = request_json.get('executor[]')
        verifier_list = request_json.get('verifiers[]') if request_json.get('verifiers[]') else [user_id]
        critical = request_json.get('critical')
        executor = executor_list[0]
        executor_info = user.query_user_by_id(int(executor), 'useremail', 'userfullname')
        creator_info = user.query_user_by_id(int(user_id), 'userfullname', 'useremail')
        creator_email = creator_info.get('useremail')
        executor_email = executor_info.get('useremail')

        executor_config_map = {
            "executorName": executor_info.get('userfullname'),
            "creatorName": creator_info.get('userfullname'),
            "createTime": date_time_now,
            "critical": self.record_detail_prefix_cn.get("critical_level").get(critical),
            "id": trans_id,
            "title": title,
            "detail": detail,
            "due_date": due_date
        }

        is_one_person = False
        if executor_email == creator_email:
            is_one_person = True
        # 不为None 而且 不为空字符串
        # 如果创建人和执行人是同一个人就不发送邮件给执行人
        # 强行转化为数组便于continue操作
        if not is_one_person:
            executor_email_list = [executor_email]
            for executor_email_each in executor_email_list:
                if executor_email is not None and not not executor_email_each:
                    try:
                        email_html = render_template('email/workflowEmail.html', configMap=executor_config_map)
                        Utils.EmailTool.send_email(new_email_subject, executor_email_each, email_html)
                    except Exception as e:
                        continue
        # 审核人的邮箱列表
        for verifier in verifier_list:
            verifier_info = user.query_user_by_id(int(verifier), 'useremail')
            verifier_email_list.append(verifier_info.get('useremail'))
        verifier_config_map = {
            "time": date_time_now,
            'user': executor_info.get('userfullname'),
            "operation": "start",
            "id": trans_id,
            "title": title,
            "detail": detail
        }
        for verifier_mail in verifier_email_list:
            # 如果是空或者和执行人，创建人的邮箱重复
            if verifier_mail is None or not verifier_mail or verifier_mail == executor_email or verifier_mail == creator_email:
                continue
            try:
                email_html = render_template('email/workflowStatusEmail.html', configMap=verifier_config_map)
                Utils.EmailTool.send_email(new_email_subject, verifier_mail, email_html)
            except Exception as e:
                continue
        return True

    def get_current_record_detail(self, record_detail):

        try:
            current_record_detail = []
            if record_detail is None:
                return False
            for record_list in record_detail:
                if record_list == "verifiers" or record_list == "watchers":
                    current_list = record_detail.get(record_list)
                    new_user_list = []
                    old_user_list = []
                    for new_user in current_list.get("new"):
                        new_user_list.append(new_user.get("userfullname"))
                    for old_user in current_list.get("old"):
                        old_user_list.append(old_user.get("userfullname"))
                    current_record_detail.append({
                        "type": self.record_detail_prefix_cn.get(record_list),
                        "new": ','.join(new_user_list),
                        "old": ','.join(old_user_list)
                    })
                elif record_list == "executor":
                    current_list = record_detail.get(record_list)
                    current_record_detail.append({
                        "type": self.record_detail_prefix_cn.get(record_list),
                        "new": current_list.get("new"),
                        "old": current_list.get("old")
                    })
                elif record_list == "groupid":
                    current_list = record_detail.get(record_list)
                    trans_group = TransactionGroup()
                    new_group_info = trans_group.get_trans_group_by_id(int(current_list.get("new")))
                    old_group_info = trans_group.get_trans_group_by_id(int(current_list.get("old")))
                    current_record_detail.append({
                        "type": self.record_detail_prefix_cn.get(record_list),
                        "new": new_group_info.get("name"),
                        "old": old_group_info.get("name"),
                    })
                elif record_list == "critical":
                    current_list = record_detail.get(record_list)
                    current_record_detail.append({
                        "type": self.record_detail_prefix_cn.get(record_list),
                        "new": self.record_detail_prefix_cn.get("critical_level").get(
                            current_list.get("new")) or self.record_detail_prefix_cn.get("critical_level").get(
                            str(current_list.get("new"))),
                        "old": self.record_detail_prefix_cn.get("critical_level").get(
                            current_list.get("old")) or self.record_detail_prefix_cn.get("critical_level").get(
                            str(current_list.get("old")))
                    })
                else:
                    current_list = record_detail.get(record_list)
                    current_record_detail.append({
                        "type": self.record_detail_prefix_cn.get(record_list),
                        "new": current_list.get("new"),
                        "old": current_list.get("old"),
                    })
        except Exception as e:
            return False
        return current_record_detail

    def is_add_or_remove(self, old_user_list, new_user_list):
        result = {}
        for old_user in old_user_list:
            if old_user not in new_user_list:
                result["remove"] = []
                result.get("remove").append(old_user)
        for new_user in new_user_list:
            if new_user not in old_user_list:
                result["add"] = []
                result.get("add").append(new_user)
        # 没有添加也没有删除
        if len(result):
            return result
        else:
            return False

    # 编辑工单
    def send_edit_email(self, executor_old, verifier_id_db_list, watcher_id_db_list, request_json, record_detail,
                        edit_email_subject):
        # 所有人都发
        current_record_detail = self.get_current_record_detail(record_detail)
        if not current_record_detail:
            return False
        user = User()
        user_name = ''
        user_id = request_json.get('userId')
        creator_id = request_json.get('creator')
        user_info = user.query_user_by_id(user_id, 'userfullname')
        if user_info is not None:
            user_name = user_info.get('userfullname')
        edit_config_map = {
            "reply_time": datetime.now().strftime('%y-%m-%d %I:%M:%S %p'),
            "reply_user": user_name,
            "record_detail": current_record_detail,
            "id": request_json.get('transId'),
            "title": request_json.get('title'),
            "detail": request_json.get('detail')
        }
        # 新的用户
        new_verifier_list = request_json.get('verifiers[]') if request_json.get('verifiers[]') else [user_id]
        new_watcher_list = request_json.get('watchers[]')
        new_executor_id_list = request_json.get('executor[]')
        # 老的用户
        old_verifier_list = verifier_id_db_list
        old_watcher_list = watcher_id_db_list
        old_executor_id_list = [str(executor_old.get("id"))]
        old_executor_email = user.query_user_by_id(old_executor_id_list[0], 'useremail').get('useremail')
        new_executor_email = user.query_user_by_id(new_executor_id_list[0], 'useremail').get("useremail")

        # 当前用户
        current_verifier_list = []
        current_watcher_list = []
        current_executor_list = []
        # 老用户和新用户相加去重复
        if len(old_verifier_list + new_verifier_list) is not 0:
            current_verifier_list = set(old_verifier_list + new_verifier_list)
        if len(old_watcher_list + new_watcher_list) is not 0:
            current_watcher_list = set(old_watcher_list + new_watcher_list)
        if len(old_executor_id_list + new_executor_id_list) is not 0:
            current_executor_list = set(old_executor_id_list + new_executor_id_list)
        # 读取邮件
        watchers_email_list = []
        verifiers_email_list = []
        executor_email_list = []
        for verifier_id_list in current_verifier_list:
            if int(verifier_id_list) == user_id:
                continue
            else:
                verifier_user_email = user.query_user_by_id(verifier_id_list, 'useremail').get('useremail')
                if verifier_user_email is None or not verifier_user_email:
                    continue
                else:
                    verifiers_email_list.append(verifier_user_email)
        for watcher_id_list in current_watcher_list:
            if int(watcher_id_list) == user_id:
                continue
            else:
                watcher_user_email = user.query_user_by_id(watcher_id_list, 'useremail').get('useremail')
                if watcher_user_email is None or not watcher_user_email:
                    continue
                else:
                    watchers_email_list.append(watcher_user_email)
        # 执行人有可能更改不同的 所以2个都要发
        for executor_id_list in current_executor_list:
            if int(executor_id_list) == user_id:
                continue
            else:
                executor_user_email = user.query_user_by_id(executor_id_list, 'useremail').get('useremail')
                if executor_user_email is None or not executor_user_email:
                    continue
                else:
                    executor_email_list.append(executor_user_email)

        creator_email_list = [user.query_user_by_id(creator_id, 'useremail').get('useremail')]

        # 发送邮件
        # 先给执行人和创建人发送
        for executor_email in executor_email_list:
            try:
                email_html = render_template('email/workflowEditEmail.html', configMap=edit_config_map)
                Utils.EmailTool.send_email(edit_email_subject, executor_email, email_html)
            except Exception as e:
                continue
        for creator_email in creator_email_list:
            if creator_email is not None and not not creator_email_list:
                try:
                    email_html = render_template('email/workflowEditEmail.html', configMap=edit_config_map)
                    Utils.EmailTool.send_email(edit_email_subject, creator_email, email_html)
                except Exception as e:
                    continue

        # 然后全部发送审核人的
        for verifier_mail in verifiers_email_list:
            # 如果和创建者或执行人(新老)重复
            if verifier_mail == old_executor_email or verifier_mail == new_executor_email or verifier_mail == \
                    creator_email_list[0]:
                continue
            else:
                try:
                    email_html = render_template('email/workflowEditEmail.html', configMap=edit_config_map)
                    Utils.EmailTool.send_email(edit_email_subject, verifier_mail, email_html)
                except Exception as e:
                    continue
        # 然后判断审核人和相关人员是否重复
        for watcher_mail in watchers_email_list:
            # 如果和审核人、创建者或执行人（新老）重复
            if watcher_mail in verifiers_email_list or watcher_mail == old_executor_email or watcher_mail == \
                    new_executor_email[0] or watcher_mail == creator_email_list:
                continue
            else:
                try:
                    email_html = render_template('email/workflowEditEmail.html', configMap=edit_config_map)
                    Utils.EmailTool.send_email(edit_email_subject, watcher_mail, email_html)
                except Exception as e:
                    continue
        return True

    def send_replay_email(self, req_data, trans_id, detail, replay_email_subject):
        trans = Transaction()
        transaction_info = trans.get_transaction_by_id(trans_id)
        datetime_now = datetime.now().strftime('%y-%m-%d %I:%M:%S %p')
        tm = TransactionMember()
        transaction_members = tm.get_verifier(trans_id)
        verifier_id_list = []
        verifier_executor_user_info_list = []
        for member in transaction_members:
            verifier_id_list.append(member.get('userId'))
        user = User()
        user_id = req_data.get('userId')
        reply_user_info = user.query_user_by_id(user_id, 'userfullname')
        # 检查是否是本人添加
        for verifier_id in verifier_id_list:
            if verifier_id == user_id:
                continue
            else:
                verifier_executor_user_info_list.append(user.query_user_by_id(verifier_id, 'useremail'))
                # 添加执行人
        executor_user_info = user.query_user_by_id(transaction_info.get('executorID'), 'useremail')
        verifier_executor_user_info_list.append(executor_user_info.get('useremail'))
        replay_config_map = {
            "reply_time": datetime_now,
            "reply_user": reply_user_info.get('userfullname'),
            "reply_detail": detail,
            "id": trans_id,
            "title": transaction_info.get('title'),
            "detail": transaction_info.get('detail')
        }
        for verifier_executor_mail in verifier_executor_user_info_list:
            if verifier_executor_mail is None or not verifier_executor_mail:
                continue
            try:
                email_html = render_template('email/workflowReplyEmail.html', configMap=replay_config_map)
                Utils.EmailTool.send_email(replay_email_subject, verifier_executor_mail, email_html)
            except Exception as e:
                return Utils.beop_response_error(e)
                # end
