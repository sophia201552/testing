__author__ = 'Nomand'
import uuid
import logging
from datetime import datetime
from flask import request, json
from beopWeb.mod_workflow import bp_workflow
from beopWeb.mod_oss.ossapi import OssAPI
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_admin.User import User
from beopWeb.mod_workflow.TransactionAttachment import TransactionAttachment
from beopWeb.AuthManager import AuthManager


class AttachmentType:
    file_name_prefix = '-'
    attachment_path = '/workflow/attachment/'
    fileNotAllowType = []


@bp_workflow.route('/attachment/upload', methods=['POST'])
def upload():
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(code=403)

    def upload_to_oss(file_name, stream, uid):
        oss = OssAPI(Utils.OSS_HOST, Utils.OSS_ACCESS_ID, Utils.OSS_SECRET_ACCESS_KEY)
        file_path = 'workflow/attachment/' + uid + AttachmentType.file_name_prefix + file_name
        return oss.put_object_from_fp('beopweb', file_path, stream), file_path

    rq_data = request.form
    task_id = rq_data.get('taskId')
    rv = []
    file_list = request.files.getlist("file")

    ta = TransactionAttachment()
    time = datetime.now()
    for index, stream in enumerate(file_list):
        try:
            filename = stream.filename.rsplit("/")[0]
            if filename.split('.')[-1] in AttachmentType.fileNotAllowType:
                return Utils.beop_response_error('file type is ' + filename.split('.')[-1] + ' not allow !')

            uid = uuid.uuid1()
            uid = uid.hex[:10]
            res, file_path = upload_to_oss(filename, stream, uid)
            if res.status == 200:
                if task_id:  # 如果要绑定到某工单
                    if not ta.add_upload_new_file(task_id, user_id, filename, uid, time):
                        logging.error("工单上传文件添加到数据库失败")
                        return Utils.beop_response_error('insert to database failed !')

                rv.append({
                    "fileName": filename,
                    "uid": uid,
                    "url": Utils.IMG_SERVER_DOMAIN + '/' + file_path,
                    "uploadTime": time,
                    "userId": user_id
                })

            else:
                logging.error("工单上传文件到oss失败，request status isn\'t 200")
                return Utils.beop_response_error('upload to aly oss failed, request status isn\'t 200 ! ')
        except Exception as e:
            logging.error("工单添加附件失败:" + str(e))
            return Utils.beop_response_error('upload to aly oss catch error!')

    return Utils.beop_response_success(rv)


@bp_workflow.route('/attachment/getFiles/<taskId>', methods=['GET'])
def get_files_by_transId(taskId):
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(code=403)
    tac = TransactionAttachment()
    user = User()
    rv = tac.get_attachment_by_task_id(taskId)

    for item in rv:
        item["userInfo"] = user.query_user_by_id(item.get('userId'), 'userfullname', 'useremail')
        item["url"] = Utils.IMG_SERVER_DOMAIN + AttachmentType.attachment_path + item.get(
            "uid", "") + AttachmentType.file_name_prefix + item.get("fileName", "")

    return Utils.beop_response_success(rv)


@bp_workflow.route('/attachment/delete', methods=['POST'])
def delete_file():
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(code=403)

    def delete_file_oss(file_name):
        oss = OssAPI(Utils.OSS_HOST, Utils.OSS_ACCESS_ID, Utils.OSS_SECRET_ACCESS_KEY)
        return oss.delete_object('beopweb', 'workflow/attachment/' + file_name)

    rq_data = request.get_json()
    taskId = rq_data.get('taskId')
    file_name = rq_data.get('fileName')
    file_uid = rq_data.get('uid')
    file_full_name = str(file_uid) + AttachmentType.file_name_prefix + file_name
    if not user_id or not file_name:
        return Utils.beop_response_error(code=403)
    res = delete_file_oss(file_full_name)
    if res.status == 204:
        tac = TransactionAttachment()
        if taskId:
            result = tac.delete_attachment(taskId, file_uid, file_name)
        else:
            return Utils.beop_response_success()
    else:
        return Utils.beop_response_error('at delete files from oss failed')
    if result:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error('at delete files info from database failed')


@bp_workflow.route('/attachment/deleteByName', methods=['POST'])
def delete_file_by_name():
    def delete_file_oss(file_name):
        oss = OssAPI(Utils.OSS_HOST, Utils.OSS_ACCESS_ID, Utils.OSS_SECRET_ACCESS_KEY)
        return oss.delete_object('beopweb', 'workflow/attachment/' + file_name)

    rq_data = request.get_json()
    file_name = rq_data.get('name')
    file_uid = rq_data.get('uid')
    if file_name is None or file_uid is None:
        return Utils.beop_response_error(403)
    file_full_name = file_uid + AttachmentType.file_name_prefix + file_name
    res = delete_file_oss(file_full_name)
    if res.status == 204:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error('at delete files from oss failed')


@bp_workflow.route('/attachment/download', methods=['POST'])
def download():
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(code=403)
    rq_data = request.get_json()
    file_name = rq_data.get('fileName')
    file_uid = rq_data.get('fileUid')
    taskId = rq_data.get('taskId')
    if file_uid and file_name and user_id:
        tac = TransactionAttachment()
        result = tac.is_user_hasOwn_file(user_id, taskId, file_name, file_uid)
        if result:
            file_full_name = file_uid + AttachmentType.file_name_prefix + file_name
            return Utils.beop_response_success({
                "url": Utils.IMG_SERVER_DOMAIN + AttachmentType.attachment_path + file_full_name
            })
        else:
            return Utils.beop_response_error()
    else:
        return Utils.beop_response_error()
