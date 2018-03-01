__author__ = 'Nomand'
import uuid
from datetime import datetime
from flask import request, json
from beopWeb.mod_workflow import bp_workflow
from beopWeb.mod_oss.ossapi import OssAPI
from beopWeb.mod_common.Utils import Utils
from .TransactionAttachment import TransactionAttachment
from beopWeb.mod_admin.User import User


class AttachmentType:
    file_name_prefix = '-'
    attachment_path = '/workflow/attachment/'
    fileNotAllowType = []


@bp_workflow.route('/attachment/upload', methods=['POST'])
def upload():
    def upload_to_oss(filename, stream, uid):
        oss = OssAPI(Utils.OSS_HOST, Utils.OSS_ACCESS_ID, Utils.OSS_SECRET_ACCESS_KEY)
        return oss.put_object_from_fp('beopweb',
                                      'workflow/attachment/' + uid + AttachmentType.file_name_prefix + filename, stream)

    rq_data = request.form
    file_id_list = rq_data.get("file_ids")
    file_id_list = file_id_list.split(',')
    trans_id = rq_data.get('transId')
    user_id = rq_data.get('userId')
    rv = []
    if not user_id:
        return Utils.beop_response_error('attachment upload need trans_id and user_id !')
    file_list = request.files.getlist("file")
    ta = TransactionAttachment()
    time = datetime.now()
    for index, stream in enumerate(file_list):
        try:
            filename = stream.filename.rsplit("/")[0]
            if filename.split('.')[-1] in AttachmentType.fileNotAllowType:
                return Utils.beop_response_error('file type is ' + filename.split('.')[-1] + ' not allow !')
            uid = uuid.uuid1()
            uid = uid.hex[:5]
            res = upload_to_oss(filename, stream, uid)
            if res.status == 200:
                result = ta.upload_new_file(trans_id, user_id, filename, time, uid)
                if not result:
                    return Utils.beop_response_error('insert to database failed !')
                if not trans_id:
                    rv.append({
                        "fileName": filename,
                        "uid": uid,
                        "fileId": file_id_list[index]
                    })
            else:
                return Utils.beop_response_error('upload to aly oss failed, request status isn\'t 200 ! ')
        except Exception as e:
            print(e)
            return Utils.beop_response_error('upload to aly oss catch error!')

    if trans_id:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_success(rv)


@bp_workflow.route('/attachment/getFiles/<int:trans_id>', methods=['GET'])
def get_files_by_transId(trans_id):
    tac = TransactionAttachment()
    user = User()
    rv = tac.get_files_by_transId(trans_id)
    for item in rv:
        item["userInfo"] = user.query_user_by_id(item.get('userId'), 'userfullname', 'useremail')
    return Utils.beop_response_success(rv)


@bp_workflow.route('/attachment/delete', methods=['POST'])
def delete_file():
    def delete_file_oss(file_name, trans_id, user_id):
        oss = OssAPI(Utils.OSS_HOST, Utils.OSS_ACCESS_ID, Utils.OSS_SECRET_ACCESS_KEY)
        return oss.delete_object('beopweb', 'workflow/attachment/' + file_name)

    rq_data = request.get_json()
    user_id = rq_data.get('userId')
    trans_id = rq_data.get('transId')
    file_name = rq_data.get('fileName')
    file_uid = rq_data.get('uid')
    file_full_name = file_uid + AttachmentType.file_name_prefix + file_name
    if not user_id or not trans_id or not file_name:
        return Utils.beop_response_error()
    res = delete_file_oss(file_full_name, trans_id, user_id)
    if res.status == 204:
        tac = TransactionAttachment()
        result = tac.delete_file(trans_id, user_id, file_name, file_uid)
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
    rq_data = request.get_json()
    file_name = rq_data.get('fileName')
    file_uid = rq_data.get('fileUid')
    user_id = rq_data.get('userId')
    trans_id = rq_data.get('transId')
    if file_uid and file_name and user_id:
        tac = TransactionAttachment()
        result = tac.is_user_hasOwn_file(user_id, trans_id, file_name, file_uid)
        if result:
            file_full_name = file_uid + AttachmentType.file_name_prefix + file_name
            return Utils.beop_response_success({
                "url": Utils.IMG_SERVER_DOMAIN + AttachmentType.attachment_path + file_full_name
            })
        else:
            return Utils.beop_response_error()
    else:
        return Utils.beop_response_error()
