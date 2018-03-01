from beopWeb.mod_admin.User import User
from beopWeb.mod_common.Utils import *
from beopWeb.mod_common import I18n
from beopWeb.BEOPDataAccess import BEOPDataAccess
from .TransactionAttachmentController import AttachmentType


class TransactionEmailUtils:
    emailSubjectPrefix = '-'


class TransactionEmail:
    # 新建工单
    # 创建完工单会给审核人发送邮件 开始了状态
    # 发送给执行人和审核人和相关人员
    @staticmethod
    def send_task_email(task_id, request_json, pending_files, email_type='NEW', lang=None):
        """
        发送工单邮件

        :param task_id: 工单ID
        :param request_json: 邮件参数
        :param pending_files: 附件列表
        :param email_type: 邮件类型
        :param lang: 邮件语言
        :return: True 发送成功; False 发送失败
        """
        user = User()

        date_time_now = datetime.now().strftime(Utils.datetime_format_full)
        user_id = request_json.get('userId')
        due_date = request_json.get('dueDate')
        title = request_json.get('title')
        detail = request_json.get('detail')
        executor_list = request_json.get('executor')
        executor_oldList = request_json.get('oldexecutor') if request_json.get('oldexecutor') else ''
        watcher_list = request_json.get("watchers") if request_json.get("watchers") else []
        critical = request_json.get('critical')

        if isinstance(executor_list, (int, str)):
            executor = executor_list
        else:
            executor = executor_list[0]
        if isinstance(executor_oldList, (int, str)):
            executor_old = executor_oldList
        else:
            executor_old = executor_oldList[0]
        if executor_old == '':
            executor_oldinfo = {'useremail': '', 'userfullname': ''}
        else:
            executor_oldinfo = user.query_user_by_id(int(executor_old), 'useremail', 'userfullname')
        executor_info = user.query_user_by_id(int(executor), 'useremail', 'userfullname', 'country')
        if not executor_info:
            return False
        creator_info = user.query_user_by_id(int(user_id), 'userfullname', 'useremail')
        creator_email = creator_info.get('useremail')
        executor_email = executor_info.get('useremail')
        executor_country_code = executor_info.get('country')
        if not executor_country_code:
            executor_country_code = 'WW'
        executor_country_config = BEOPDataAccess.getCountryConfigByCode(executor_country_code)
        i18n = I18n()
        if lang:
            language = lang
        else:
            language = app.config.get("COUNTRY_DEFAULT_LANGUAGE").get(executor_country_code)
        i18n.set_lang(language)
        for file in pending_files:
            uid = file.get('uid')
            name = file.get('fileName')
            file["url"] = "%s%s%s%s%s" % (
                Utils.IMG_SERVER_DOMAIN, AttachmentType.attachment_path, uid, AttachmentType.file_name_prefix, name)
        executors = '－'
        if executor_old == '':
            if email_type == 'Escalation':
                escalateExecutorList = request_json.get('escalateExecutorList')
                executorNames = []
                for executorId in escalateExecutorList:
                    exec_info = user.query_user_by_id(executorId, 'userfullname')
                    executorNames.append(exec_info.get('userfullname'))
                if executorNames:
                    executors = ','.join(executorNames)
                email_tip = i18n.trans("send_" + email_type + "_email", executor=executors)

            else:
                email_tip = i18n.trans("send_" + email_type + "_email", creator=creator_info.get('userfullname'))
        else:
            email_type = 'edit'
            email_tip = i18n.trans(email_type + "_email" + "_subject", edit_user=executor_oldinfo.get('userfullname'))
        domain = app.config.get('SITE_DOMAIN')
        domainName = executor_country_config.get('domainName')
        domain = domain if domainName is None else domainName
        executor_config_map = {
            "platform": executor_country_config.get('tradeMark'),
            "logo": 'static/images/%s' % executor_country_config.get('logoFileName'),
            "creatorName": creator_info.get('userfullname'),
            "createTime": date_time_now,
            "executorName": executor_info.get('userfullname'),
            "fullname": executor_info.get('userfullname'),
            "critical": i18n.trans("critical_level_" + str(critical)),
            "id": task_id,
            "title": title,
            "detail": detail,
            "due_date": due_date,
            "domain": domain,
            "pendingFiles": pending_files,
            "tip": email_tip,
            "faultImage": request_json.get('faultImage'),
            'zone': request_json.get('zone'),
            'equipment': request_json.get('equipment')
        }
        if email_type == 'Escalation':
            executor_config_map['executorName'] = executors
            executor_email_subject = request_json.get('escalateTitle')
        else:
            executor_email_subject = i18n.trans("workflow") + ':' + title
        if executor_email:
            try:
                email_html = render_template('email/workflowEmail.html',
                                             configMap=executor_config_map, trans=i18n.trans)
                Utils.EmailTool.send_email(executor_email_subject, executor_email, email_html,
                                           countryCode=executor_country_code, strategy='v2')
            except Exception:
                logging.error('Failed to render email %s!', executor_email_subject, exc_info=True, stack_info=True)
        # 相关人员的邮箱列表
        watcher_detail_map = {}
        for watcher in watcher_list:
            if watcher is not None:
                watcher_info = user.query_user_by_id(int(watcher), 'useremail', 'country', 'userfullname')
                if watcher_info and watcher_info.get('useremail') and watcher_info.get('country'):
                    watcher_email = watcher_info.get('useremail')
                    watcher_detail_map[watcher_email] = {"country": watcher_info.get('country'),
                                                         "fullname": watcher_info.get('userfullname')}
                else:
                    return False
        domain = app.config.get('SITE_DOMAIN')
        watcher_email_map = {
            "executorName": executor_info.get('userfullname'),
            "creatorName": creator_info.get('userfullname'),
            "createTime": date_time_now,
            "id": task_id,
            "title": title,
            "detail": detail,
            "due_date": due_date,
            "pendingFiles": pending_files,
            "faultImage": request_json.get('faultImage'),
            'zone': request_json.get('zone'),
            'equipment': request_json.get('equipment')
        }

        for watcher, detail in watcher_detail_map.items():
            # 如果是空或者和执行人，创建人的邮箱重复
            if not watcher or watcher == executor_email or watcher == creator_email:
                continue
            try:
                country = detail.get('country')
                if not country:
                    country = 'WW'
                if lang:
                    language = lang
                else:
                    language = app.config.get("COUNTRY_DEFAULT_LANGUAGE").get(country)
                i18n.set_lang(language)
                if email_type == 'DELETE':
                    email_tip = i18n.trans("send_" + email_type + "_email", creator=creator_info.get('userfullname'))
                else:
                    email_tip = i18n.trans("send_WATCHER_email", executor=executor_info.get('userfullname'),
                                           creator=creator_info.get('userfullname'))
                watcher_email_subject = i18n.trans("workflow") + ':' + title
                watcher_country_config = BEOPDataAccess.getCountryConfigByCode(country)
                watcher_email_map["tip"] = email_tip
                watcher_email_map['critical'] = i18n.trans("critical_level_" + str(critical))
                watcher_email_map["fullname"] = detail.get('fullname')
                watcher_email_map['platform'] = watcher_country_config.get('tradeMark')
                domainName = watcher_country_config.get('domainName')
                domain = domain if domainName is None else domainName
                watcher_email_map["domain"] = domain
                watcher_email_map['logo'] = 'static/images/%s' % watcher_country_config.get('logoFileName')
                email_html = render_template('email/workflowEmail.html', configMap=watcher_email_map, trans=i18n.trans)
                Utils.EmailTool.send_email(watcher_email_subject, watcher, email_html,
                                           countryCode=country, strategy='v2')
            except Exception:
                logging.error('Unhandled exception! watcher=%s, detail=%s'
                              'task_id=%s, request_json=%s, pending_files=%s, email_type=%s, lang=%s',
                              watcher, detail, task_id, request_json, pending_files, email_type, lang)
                continue
        return True