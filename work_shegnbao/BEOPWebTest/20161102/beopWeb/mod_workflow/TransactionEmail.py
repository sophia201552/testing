from  datetime import *
from datetime import datetime

from .TransactionGroup import TransactionGroup
from beopWeb.mod_admin.User import User
from beopWeb.mod_common.Utils import *
from .Transaction import Transaction, TransactionStatus
from .TransactionMember import TransactionMember
from .TransactionAttachmentController import AttachmentType


class TransactionEmailUtils:
    emailSubjectPrefix = '-'


class TransactionEmail():
    # Tips start--------------------------------------------------------------
    # 创建新的任务-》执行人，审核人
    # 编辑任务-》所有人
    # 更改任务状态-》创建人，审核人，相关人员
    # 回复工单信息 -》审核人，执行人
    # 转发工单任务->审核人，执行人
    # Tips end--------------------------------------------------------------

    def get_trans_info(self, trans_id):
        user = User()
        tr = Transaction()
        trans = tr.get_transaction_by_id(trans_id)
        trans_info = {}
        if trans:
            trans_info["creatorName"] = user.query_user_by_id(trans.get('creatorID'), 'userfullname').get(
                "userfullname")
            if isinstance(trans.get("createTime"), datetime):
                trans_info["createTime"] = trans.get("createTime").strftime(Utils.datetime_format_full)
            else:
                trans_info["createTime"] = trans.get("createTime")

            trans_info["executorName"] = user.query_user_by_id(trans.get('executorID'), 'userfullname').get(
                "userfullname")
            trans_info["critical"] = trans.get("critical")
            trans_info["title"] = trans.get("title")
            trans_info["detail"] = trans.get("detail")
            if isinstance(trans.get("dueDate"), datetime):
                trans_info["due_date"] = trans.get("dueDate").strftime(Utils.datetime_format_date)
            else:
                trans_info["due_date"] = trans.get("dueDate")

        return trans_info

    # 完成，任务通过，任务不通过
    def get_send_status_email_subject(self, i18n, status, user_email, verifier_email_list, trans_title, trans_id,
                                      user_name):
        if status == 'complete':
            if user_email in verifier_email_list:
                return str(i18n.trans('complete_email_subject_need_verify')) + user_name + i18n.trans(
                    "action_status_" + str(status)) + str(
                    trans_id) + TransactionEmailUtils.emailSubjectPrefix + trans_title
            else:
                return user_name + str(
                    i18n.trans(
                        "action_status_" + str(trans_id) + str(status))) + str(i18n.trans('work_order')) \
                       + TransactionEmailUtils.emailSubjectPrefix + trans_title
        else:
            return user_name + i18n.trans("action_status_" + str(status)) + str(trans_id) + str(
                i18n.trans('work_order')) \
                   + TransactionEmailUtils.emailSubjectPrefix + trans_title

    # 发送状态邮件
    # 审核人，创建人，相关人员，执行人，不给操作本人发送邮件
    def send_status_email(self, trans, tm, trans_id, user_id, status):
        verifiers_id_list = []
        watchers_id_list = []
        tr = Transaction()
        verifiers = tm.get_verifier(trans_id)
        executor_id = trans.get('executorID')
        creator_id = trans.get('creatorID')
        watchers = tm.get_watcher(trans_id)
        datetime_now = datetime.now().strftime('%Y-%m-%d %I:%M:%S %p')
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
        user_info = user.query_user_by_id(int(user_id), 'useremail', 'userfullname')
        creator_email = creator_user_info.get('useremail')
        executor_email = executor_user_info.get('useremail')

        # 不给本人发送邮件
        # 判断审核人员是否和本人重复
        for verifiers_id in verifiers_id_list:
            if verifiers_id is None or int(verifiers_id) == int(user_id):
                continue
            else:
                verifiers_email_list.append(user.query_user_by_id(verifiers_id, 'useremail').get('useremail'))
        # 判断相关人员是否和本人重复
        for watchers_id in watchers_id_list:
            if watchers_id is None or int(watchers_id) == int(user_id):
                continue
            else:
                watchers_email_list.append(user.query_user_by_id(watchers_id, 'useremail').get('useremail'))
        trans_title = trans.get('title')
        user_name = user_info.get('userfullname')
        config_map = {
            "time": datetime_now,
            "user": user_name,
            "operation": status,
            "id": trans_id,
            "title": trans_title,
            "detail": trans.get('detail'),
            "domain": app.config.get('SITE_DOMAIN')
        }
        config_map["trans_info"] = self.get_trans_info(trans_id)
        # 给创建者发邮件
        is_one_person = False
        if int(executor_id) == int(creator_id):
            is_one_person = True
        # 判断执行人和创建人是否是同一个人
        if not is_one_person:
            if creator_email is not None:
                try:
                    status_subject = self.get_send_status_email_subject(i18n, status, creator_email,
                                                                        verifiers_email_list, trans_title, trans_id,
                                                                        user_name)
                    email_html = render_template('email/workflowStatusEmail.html', configMap=config_map,
                                                 trans=i18n.trans)
                    Utils.EmailTool.send_email(status_subject, creator_email, email_html)
                except Exception as e:
                    logging.error(e)
            if executor_email is not None:
                try:
                    status_subject = self.get_send_status_email_subject(i18n, status, executor_email,
                                                                        verifiers_email_list, trans_title, trans_id,
                                                                        user_name)
                    email_html = render_template('email/workflowStatusEmail.html', configMap=config_map,
                                                 trans=i18n.trans)
                    Utils.EmailTool.send_email(status_subject, executor_email, email_html)
                except Exception as e:
                    logging.error(e)
        else:
            if executor_email is not None:
                try:
                    status_subject = self.get_send_status_email_subject(i18n, status, executor_email,
                                                                        verifiers_email_list, trans_title, trans_id,
                                                                        user_name)
                    email_html = render_template('email/workflowStatusEmail.html', configMap=config_map,
                                                 trans=i18n.trans)
                    Utils.EmailTool.send_email(status_subject, executor_email, email_html)
                except Exception as e:
                    logging.error(e)

        # 给审核人发邮件
        for verifiers_email in verifiers_email_list:
            # 如果审核人的邮件和创建人或执行人相同
            if not verifiers_email or verifiers_email is None or verifiers_email == creator_email or verifiers_email == executor_email:
                continue
            else:
                try:
                    status_subject = self.get_send_status_email_subject(i18n, status, verifiers_email,
                                                                        verifiers_email_list, trans_title, trans_id,
                                                                        user_name)
                    email_html = render_template('email/workflowStatusEmail.html', configMap=config_map,
                                                 trans=i18n.trans)
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
                    status_subject = self.get_send_status_email_subject(i18n, status, watchers_email,
                                                                        verifiers_email_list, trans_title, trans_id,
                                                                        user_name)
                    email_html = render_template('email/workflowStatusEmail.html', configMap=config_map,
                                                 trans=i18n.trans)
                    Utils.EmailTool.send_email(status_subject, watchers_email, email_html)
                except Exception as e:
                    logging.error(e)
                    continue
        return True

    # 新建工单
    # 创建完工单会给审核人发送邮件 开始了状态
    # 发送给执行人和审核人和相关人员
    def send_new_email(self, trans_id, request_json, pending_files):
        user = User()
        email_list = []
        user_id = request_json.get('userId')
        due_date = request_json.get('dueDate')
        title = request_json.get('title')
        detail = request_json.get('detail')
        executor_list = request_json.get('executor[]')
        verifier_list = request_json.get('verifiers[]') if request_json.get('verifiers[]') else [user_id]
        watcher_list = request_json.get("watchers[]") if request_json.get("watchers[]") else []
        critical = request_json.get('critical')
        executor = executor_list[0]
        executor_info = user.query_user_by_id(int(executor), 'useremail', 'userfullname')
        creator_info = user.query_user_by_id(int(user_id), 'userfullname', 'useremail')
        creator_email = creator_info.get('useremail')
        executor_email = executor_info.get('useremail')

        email_sent_list = []
        now = datetime.now()
        for file in pending_files:
            uid = file.get('uid')
            name = file.get('fileName')
            file[
                "url"] = Utils.IMG_SERVER_DOMAIN + AttachmentType.attachment_path + uid + AttachmentType.file_name_prefix + name
        executor_config_map = {
            "executorName": executor_info.get('userfullname'),
            "creatorName": creator_info.get('userfullname'),
            "createTime": now,
            "critical": i18n.trans("critical_level_" + str(critical)),
            "id": trans_id,
            "title": title,
            "detail": detail,
            "due_date": due_date,
            "domain": app.config.get('SITE_DOMAIN'),
            "pendingFiles": pending_files
        }

        new_email_subject = str(i18n.trans("send_new_email", new_user=creator_info.get('userfullname'),
                                           id=trans_id)) + TransactionEmailUtils.emailSubjectPrefix + title
        if executor_email is not None and not not executor_email:
            try:
                email_html = render_template('email/workflowEmail.html', configMap=executor_config_map,
                                             trans=i18n.trans)
                Utils.EmailTool.send_email(new_email_subject, executor_email, email_html)
                email_sent_list.append(executor_email)
            except Exception as e:
                logging.error(e)
        # 审核人和相关人员的邮箱列表
        receiver_list = verifier_list + watcher_list
        receiver_list = list(set(receiver_list))
        for receiver in receiver_list:
            if receiver is not None:
                verifier_info = user.query_user_by_id(int(receiver), 'useremail')
                email_list.append(verifier_info.get('useremail'))

        verifier_config_map = {
            "time": now,
            'user': executor_info.get('userfullname'),
            "operation": "start",
            "id": trans_id,
            "title": title,
            "detail": detail,
            "domain": app.config.get('SITE_DOMAIN'),
            "trans_info": self.get_trans_info(trans_id)
        }
        for receiver_mail in list(set(email_list)):
            # 如果是空或者已经发送过有了
            if not receiver_mail or receiver_mail in email_sent_list:
                continue
            try:
                email_html = render_template('email/workflowStatusEmail.html', configMap=verifier_config_map,
                                             trans=i18n.trans)
                Utils.EmailTool.send_email(new_email_subject, receiver_mail, email_html)
                email_sent_list.append(executor_email)
            except Exception as e:
                logging.error(e)
                continue
        return True

    def get_current_record_detail(self, record_detail, lang):
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
                        "type": i18n.trans(record_list),
                        "new": ','.join(new_user_list),
                        "old": ','.join(old_user_list)
                    })
                elif record_list == "executor":
                    current_list = record_detail.get(record_list)
                    current_record_detail.append({
                        "type": i18n.trans(record_list),
                        "new": current_list.get("new"),
                        "old": current_list.get("old")
                    })
                elif record_list == "groupid":
                    current_list = record_detail.get(record_list)
                    trans_group = TransactionGroup()
                    new_group_info = trans_group.get_trans_group_by_id(int(current_list.get("new")))
                    old_group_info = trans_group.get_trans_group_by_id(int(current_list.get("old")))
                    current_record_detail.append({
                        "type": i18n.trans("task_group"),
                        "new": new_group_info.get("name"),
                        "old": old_group_info.get("name"),
                    })
                elif record_list == "critical":
                    current_list = record_detail.get(record_list)
                    current_record_detail.append({
                        "type": i18n.trans("critical_level"),
                        "new": i18n.trans("critical_level_" + str(current_list.get("new"))),
                        "old": i18n.trans("critical_level_" + str(current_list.get("old")))
                    })
                else:
                    current_list = record_detail.get(record_list)
                    current_record_detail.append({
                        "type": i18n.trans(record_list),
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
    # 审核人，创建人，相关人员，执行人
    def send_edit_email(self, executor_old, verifier_id_db_list, watcher_id_db_list, request_json, record_detail):
        # 所有人都发
        current_record_detail = self.get_current_record_detail(record_detail, lang)
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
            "reply_time": datetime.now().strftime('%Y-%m-%d %I:%M:%S %p'),
            "edit_user": user_name,
            "record_detail": current_record_detail,
            "id": request_json.get('transId'),
            "title": request_json.get('title'),
            "detail": request_json.get('detail'),
            "domain": app.config.get('SITE_DOMAIN')
        }
        # 新的用户
        new_verifier_list = request_json.get('verifiers[]') if request_json.get('verifiers[]') else [user_id]
        new_watcher_list = request_json.get('watchers[]') if request_json.get('watchers[]') else []
        new_executor_id_list = request_json.get('executor[]') if request_json.get('executor[]') else []
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

        creator_email = user.query_user_by_id(creator_id, 'useremail').get('useremail')
        edit_email_subject = str(i18n.trans(
            "edit_email_subject", id=request_json.get('transId'),
            edit_user=user_name)) + TransactionEmailUtils.emailSubjectPrefix + request_json.get('title')
        edit_config_map["trans_info"] = self.get_trans_info(request_json.get('transId'))
        # 发送邮件
        # 先给执行人和创建人发送
        if executor_email_list is not None:
            for executor_email in executor_email_list:
                try:
                    email_html = render_template('email/workflowEditEmail.html', configMap=edit_config_map,
                                                 trans=i18n.trans)
                    Utils.EmailTool.send_email(edit_email_subject, executor_email, email_html)
                except Exception as e:
                    continue
        if creator_email is not None:
            if int(creator_id) != int(user_id):
                try:
                    email_html = render_template('email/workflowEditEmail.html', configMap=edit_config_map,
                                                 trans=i18n.trans)
                    Utils.EmailTool.send_email(edit_email_subject, creator_email, email_html)
                except Exception as e:
                    pass

        # 然后全部发送审核人的
        if verifiers_email_list is not None:
            for verifier_mail in verifiers_email_list:
                # 如果和创建者或执行人(新老)重复
                if verifier_mail == old_executor_email or verifier_mail == new_executor_email or verifier_mail == creator_email:
                    continue
                else:
                    try:
                        email_html = render_template('email/workflowEditEmail.html', configMap=edit_config_map,
                                                     trans=i18n.trans)
                        Utils.EmailTool.send_email(edit_email_subject, verifier_mail, email_html)
                    except Exception as e:
                        continue
        # 然后判断审核人和相关人员是否重复
        if watchers_email_list is not None:
            for watcher_mail in watchers_email_list:
                # 如果和审核人、创建者或执行人（新老）重复
                if watcher_mail in verifiers_email_list or watcher_mail == old_executor_email or watcher_mail == new_executor_email or watcher_mail == creator_email:
                    continue
                else:
                    try:
                        email_html = render_template('email/workflowEditEmail.html', configMap=edit_config_map,
                                                     trans=i18n.trans)
                        Utils.EmailTool.send_email(edit_email_subject, watcher_mail, email_html)
                    except Exception as e:
                        continue
        return True

    # 回复工单任务
    # 审核人，创建人，相关人员，执行人
    def send_replay_email(self, req_data, trans_id, detail):
        trans = Transaction()
        transaction_info = trans.get_transaction_by_id(trans_id)
        datetime_now = datetime.now().strftime('%Y-%m-%d %I:%M:%S %p')
        tm = TransactionMember()
        transaction_members = tm.get_verifier(trans_id)
        watchers_members = tm.get_watcher(trans_id)
        transaction_members += watchers_members
        all_user_info_list = []
        user = User()
        user_id = req_data.get('userId')
        reply_user_info = user.query_user_by_id(user_id, 'userfullname')
        creator_user_info = user.query_user_by_id(transaction_info.get('creatorID'), 'userfullname', 'useremail')
        replay_email_subject = i18n.trans("replay_email_subject", reply_user=reply_user_info.get(
            'userfullname'), id=trans_id) + TransactionEmailUtils.emailSubjectPrefix + transaction_info.get('title')
        # 检查是否是本人添加
        for verifier_id in transaction_members:
            id = verifier_id.get('userId')
            all_user_info_list.append(user.query_user_by_id(id, 'useremail').get('useremail'))
        # 添加执行人
        executor_user_email = user.query_user_by_id(transaction_info.get('executorID'), 'useremail').get('useremail')
        all_user_info_list.append(executor_user_email)
        # 创建人
        all_user_info_list.append(creator_user_info.get('useremail'))

        replay_config_map = {
            "reply_time": datetime_now,
            "reply_user": reply_user_info.get('userfullname'),
            "reply_detail": detail,
            "id": trans_id,
            "title": transaction_info.get('title'),
            "detail": transaction_info.get('detail'),
            "domain": app.config.get('SITE_DOMAIN')
        }
        replay_config_map["trans_info"] = self.get_trans_info(trans_id)

        all_user_info_list = list(set(all_user_info_list))
        for verifier_executor_mail in all_user_info_list:
            if verifier_executor_mail is None or not verifier_executor_mail:
                continue
            try:
                email_html = render_template('email/workflowReplyEmail.html', configMap=replay_config_map,
                                             trans=i18n.trans)
                Utils.EmailTool.send_email(replay_email_subject, verifier_executor_mail, email_html)
            except Exception as e:
                return Utils.beop_response_error(e)

    # 转发工单任务发送邮件
    # 审核人，创建人，相关人员，执行人
    def send_forward_email(self, user_id, trans_id, old_executor, current_executor):
        tm = TransactionMember()
        trans = Transaction()
        verifiers = tm.get_verifier(trans_id)
        watchers = tm.get_watcher(trans_id)
        user = User()
        old_executor_info = user.query_user_by_id(old_executor.get('id'), 'userfullname', 'useremail')
        current_executor_info = user.query_user_by_id(current_executor.get('id'), 'userfullname', 'useremail')
        user_info = user.query_user_by_id(user_id, 'userfullname')

        old_executor_email = old_executor_info.get('useremail')
        current_executor_email = current_executor_info.get('useremail')

        verifiers_email_list = []
        for verifiers_id in verifiers:
            verifiers_email_list.append(user.query_user_by_id(verifiers_id.get('userId'), 'useremail').get('useremail'))

        watcher_email_list = []
        for watch_id in watchers:
            watcher_email_list.append(user.query_user_by_id(watch_id.get('userId'), 'useremail').get('useremail'))

        trans_info = trans.get_transaction_by_id(trans_id)
        forward_config_map = {
            "reply_time": datetime.now().strftime('%Y-%m-%d %I:%M:%S %p'),
            "edit_user": user_info.get('userfullname'),
            "record_detail": [
                {
                    "type": i18n.trans("executor"),
                    "new": current_executor_info.get('userfullname'),
                    "old": old_executor_info.get('userfullname')
                }
            ]
            ,
            "id": trans_id,
            "title": trans_info.get('title'),
            "detail": trans_info.get('detail'),
            "domain": app.config.get('SITE_DOMAIN')
        }

        forward_config_map["trans_info"] = self.get_trans_info(trans_id)
        send_forward_email_subject = str(
            i18n.trans("send_forward_email_subject", forward_user=user_info.get('userfullname'),
                       id=trans_id)) + TransactionEmailUtils.emailSubjectPrefix + trans_info.get(
            'title')
        if old_executor_email == current_executor_email:
            if old_executor_email is not None:
                try:
                    email_html = render_template('email/workflowEditEmail.html', configMap=forward_config_map,
                                                 trans=i18n.trans)
                    Utils.EmailTool.send_email(send_forward_email_subject, old_executor_email, email_html)
                except Exception as e:
                    pass
        else:
            all_executor_email = []
            all_executor_email.append(old_executor_email)
            all_executor_email.append(current_executor_email)
            for all_email in all_executor_email:
                if all_email is None or not all_email:
                    continue
                else:
                    try:
                        email_html = render_template('email/workflowEditEmail.html', configMap=forward_config_map,
                                                     trans=i18n.trans)
                        Utils.EmailTool.send_email(send_forward_email_subject, all_email, email_html)
                    except Exception as e:
                        continue
        for verifiers_email in verifiers_email_list:
            if verifiers_email is None or not verifiers_email or verifiers_email == current_executor_email or verifiers_email == old_executor_email:
                continue
            else:
                try:
                    email_html = render_template('email/workflowEditEmail.html', configMap=forward_config_map,
                                                 trans=i18n.trans)
                    Utils.EmailTool.send_email(send_forward_email_subject, verifiers_email, email_html)
                except Exception as e:
                    continue
        for watchers_email in watcher_email_list:
            if watchers_email is None or not watchers_email or watchers_email == current_executor_email or watchers_email == old_executor_email or watchers_email in verifiers_email_list:
                continue
            else:
                try:
                    email_html = render_template('email/workflowEditEmail.html', configMap=forward_config_map,
                                                 trans=i18n.trans)
                    Utils.EmailTool.send_email(send_forward_email_subject, watchers_email, email_html)
                except Exception as e:
                    continue
        return True

    def get_week_duration_by_date(self, date):
        day_num_in_week = int(date.strftime('%w'))
        start_day = date
        if day_num_in_week > 1:
            start_day = date - timedelta(days=(day_num_in_week - 1))
        end_day = date + timedelta(days=7 - day_num_in_week)
        return {
            "now": {
                "start_time": start_day,
                "end_time": end_day,
            },
            "prev": {
                "start_time": start_day - timedelta(days=7),
                "end_time": end_day - timedelta(days=7)
            }
        }

    def get_week_in_year_num(self, date):
        return int(date.strftime('%U'))

    def get_user_trans_by_id_duration(self, user_id, duration):
        ts = Transaction()
        prev = ts.get_user_trans_by_prev_duration(user_id, duration.get('prev'))
        now = ts.get_user_trans_by_now_duration(user_id, duration.get('now'))
        return prev, now

    def send_week_report(self, user_info):
        user = User()
        user_id = user_info.get('id')
        user_email = user_info.get('useremail')
        if not user_email or user_email is None:
            return False
        date = datetime.now()
        duration = self.get_week_duration_by_date(date)
        now_duration = duration.get('now')
        prev_trans_list, now_trans_list = self.get_user_trans_by_id_duration(user_id, duration)
        if not len(prev_trans_list) and not len(now_trans_list):
            return False
        complete_task_amount = 0
        delays_task_amount = 0
        new_task_amount = 0
        tg = TransactionGroup()
        model = {
            "domain": app.config.get('SITE_DOMAIN'),
            "executorInfo": user_info,
            "createTime": date.strftime('%Y-%m-%d %I:%M:%S %p'),
            "time": {
                "startTime": {
                    "month": now_duration.get('start_time').strftime('%m'),
                    "date": now_duration.get('start_time').strftime('%d')
                },
                "endTime": {
                    "month": now_duration.get('end_time').strftime('%m'),
                    "date": now_duration.get('end_time').strftime('%d')
                },
                "year": date.strftime('%Y'),
                "weekNumber": int(date.strftime('%U'))
            },
            "taskAmount": {
                "total": len(now_trans_list) + len(prev_trans_list),
            },
            "task": {
                "prev_task": [],
                "now_task": []
            }
        }
        for now_trans in now_trans_list:
            creator_id = now_trans.get('creatorID')
            if creator_id:
                now_trans['creatorInfo'] = user.query_user_by_id(creator_id, 'userfullname', 'useremail')
            group_id = now_trans.get('groupid')
            now_trans['groupInfo'] = tg.get_trans_group_by_id(group_id)
            model.get('task').get('now_task').append(now_trans)
            new_task_amount += 1

        for prev_trans in prev_trans_list:
            status_id = int(prev_trans.get('statusId'))
            creator_id = prev_trans.get('creatorID')
            if creator_id:
                prev_trans['creatorInfo'] = user.query_user_by_id(creator_id, 'userfullname', 'useremail')
            group_id = prev_trans.get('groupid')
            prev_trans['groupInfo'] = tg.get_trans_group_by_id(group_id)
            model.get('task').get('prev_task').append(prev_trans)
            if status_id == TransactionStatus.DEFAULT_VERIFIED or status_id == TransactionStatus.END_VERIFIED:
                complete_task_amount += 1
                continue
            else:
                delays_task_amount += 1
        taskAmount = model.get('taskAmount')
        taskAmount['completeTaskAmount'] = complete_task_amount
        taskAmount['delaysTaskAmount'] = delays_task_amount
        taskAmount['newTaskAmount'] = new_task_amount
        subject = i18n.trans("email_report_subject")
        try:
            email_html = render_template('email/workflowWeeklyReportEmail.html', configMap=model, trans=i18n.trans)
            Utils.EmailTool.send_email(subject, user_email, email_html)
        except Exception as e:
            print(e)
            return False
        return True
