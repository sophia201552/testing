from beopWeb.mod_message import *
from flask import request, json, abort
from bson import ObjectId
from beopWeb.AuthManager import AuthManager
from .message import Message
from .messageUser import MessageUser
from beopWeb.mod_common.Utils import Utils


# 通过用户id获得消息列表
@bp_message.route('/getLatest', methods=["GET", "POST"])
def get_message_by_user_id():
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error()

    limit = 20
    page = 1

    if request.method == "POST":
        rq_data = request.get_json()
        limit = rq_data.get("limit")
        page = rq_data.get("page")

    message = Message()
    result = message.get_user_latest_message(user_id, limit, page)

    return Utils.beop_response_success(result)


# 用户已读
@bp_message.route('/markAsRead', methods=["POST"])
def mark_user_message_as_read():
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error()

    rq_data = request.get_json()
    msg_id = rq_data.get("msgId")
    user_id = rq_data.get("userId")

    mu = MessageUser()
    result = mu.mark_message_read(user_id, msg_id)

    if result:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()
