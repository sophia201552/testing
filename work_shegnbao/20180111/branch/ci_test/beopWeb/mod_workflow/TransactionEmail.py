from flask import session

from beopWeb.mod_admin.User import User
from beopWeb.mod_common.Utils import *
from beopWeb.mod_common import I18n
from .TransactionAttachmentController import AttachmentType


class TransactionEmailUtils:
    emailSubjectPrefix = '-'


class TransactionEmail:
    # 新建工单
    # 创建完工单会给审核人发送邮件 开始了状态
    # 发送给执行人和审核人和相关人员
    def send_task_email(self, task_id, request_json, pending_files, email_type='NEW'):
        '''
        发送工单邮件

        :param task_id: 工单ID
        :param request_json: 邮件参数
        :param pending_files: 附件列表
        :param email_type: 邮件类型
        :return: True 发送成功; False 发送失败
        '''
        user = User()

        date_time_now = datetime.now().strftime(Utils.datetime_format_full)
        user_id = request_json.get('userId')
        due_date = request_json.get('dueDate')
        title = request_json.get('title')
        detail = request_json.get('detail')
        executor_list = request_json.get('executor')
        watcher_list = request_json.get("watchers") if request_json.get("watchers") else []
        critical = request_json.get('critical')

        if isinstance(executor_list, (int, str)):
            executor = executor_list
        else:
            executor = executor_list[0]
        executor_info = user.query_user_by_id(int(executor), 'useremail', 'userfullname')
        creator_info = user.query_user_by_id(int(user_id), 'userfullname', 'useremail')
        creator_email = creator_info.get('useremail')
        executor_email = executor_info.get('useremail')
        i18n = I18n()
        i18n.set_lang(session.get('language'))
        for file in pending_files:
            uid = file.get('uid')
            name = file.get('fileName')
            file["url"] = Utils.IMG_SERVER_DOMAIN + AttachmentType.attachment_path + uid \
                          + AttachmentType.file_name_prefix + name

        email_tip = i18n.trans("send_" + email_type + "_email", creator=creator_info.get('userfullname'))
        executor_config_map = {
            "creatorName": creator_info.get('userfullname'),
            "createTime": date_time_now,
            "executorName": executor_info.get('userfullname'),
            "critical": i18n.trans("critical_level_" + str(critical)),
            "id": task_id,
            "title": title,
            "detail": detail,
            "due_date": due_date,
            "domain": app.config.get('SITE_DOMAIN'),
            "pendingFiles": pending_files,
            "tip": email_tip,
            "faultImage": request_json.get('faultImage'),
            'zone': request_json.get('zone'),
            'equipment': request_json.get('equipment')
        }

        executor_email_subject = email_tip + str(task_id)[-6:] + TransactionEmailUtils.emailSubjectPrefix + title
        if executor_email:
            try:
                email_html = render_template('email/workflowEmail.html', configMap=executor_config_map,
                                             trans=i18n.trans)
                Utils.EmailTool.send_email(executor_email_subject, executor_email, email_html)
            except Exception as e:
                pass
        # 相关人员的邮箱列表
        watcher_info_list = []
        for watcher in watcher_list:
            if watcher is not None:
                watcher_info = user.query_user_by_id(int(watcher), 'useremail')
                if watcher_info and watcher_info.get('useremail'):
                    watcher_info_list.append(watcher_info.get('useremail'))
        if email_type == 'DELETE':
            email_tip = i18n.trans("send_" + email_type + "_email", creator=creator_info.get('userfullname'))
        else:
            email_tip = i18n.trans("send_WATCHER_email", executor=executor_info.get('userfullname'),
                                   creator=creator_info.get('userfullname'))
        watcher_email_map = {
            "executorName": executor_info.get('userfullname'),
            "creatorName": creator_info.get('userfullname'),
            "createTime": date_time_now,
            "critical": i18n.trans("critical_level_" + str(critical)),
            "id": task_id,
            "title": title,
            "detail": detail,
            "due_date": due_date,
            "domain": app.config.get('SITE_DOMAIN'),
            "pendingFiles": pending_files,
            "tip": email_tip,
            "faultImage": request_json.get('faultImage'),
            'zone': request_json.get('zone'),
            'equipment': request_json.get('equipment')
        }

        watcher_email_subject = email_tip + TransactionEmailUtils.emailSubjectPrefix + title
        for watcher in list(set(watcher_info_list)):
            # 如果是空或者和执行人，创建人的邮箱重复
            if not watcher or watcher == executor_email or watcher == creator_email:
                continue
            try:
                email_html = render_template('email/workflowEmail.html', configMap=watcher_email_map, trans=i18n.trans)
                Utils.EmailTool.send_email(watcher_email_subject, watcher, email_html)
            except Exception as e:
                continue
        return True
