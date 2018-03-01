from beopWeb.mod_message import *
from flask import request, json, abort
from bson import ObjectId
from beopWeb.AuthManager import AuthManager
from .message import Message, MessageType
from .messageUser import MessageUser
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_admin.User import User
import logging


# 通过用户id获得消息列表
@bp_message.route('/queryUserMessage', methods=["GET", "POST"])
def get_message_by_user_id():
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(code=403)

    params = {}

    if request.method == "GET":
        params = request.args

    elif request.method == "POST":
        params = request.get_json()

    msg_type = params.get("type", None)
    page_size = params.get("limit", 10)
    page_num = params.get("page", 1)
    tags = params.get("tags", None)

    message = Message()
    result, count = message.query_user_message(user_id, msg_type=msg_type, page_size=page_size, page_num=page_num,
                                               tags=tags)

    all_user_map = User().get_all_user_map()
    for item in result:
        item_message = item.get("message")
        if item_message and isinstance(item_message, dict):
            sender = item_message.get("sender")
            if sender and isinstance(sender, dict):
                sender_id = sender.get("id")
                if sender_id:
                    item_message["senderInfo"] = all_user_map.get(int(sender_id))

    return Utils.beop_response_success({
        "message": result,
        "totalCount": count
    })


# 用户已读
@bp_message.route('/markAsRead', methods=["POST"])
def mark_user_message_as_read():
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(code=403)

    rq_data = request.get_json()
    msg_id_list = rq_data.get("msgIdList")

    if not msg_id_list:
        return Utils.beop_response_error()

    mu = MessageUser()
    result = mu.mark_message_read(user_id, msg_id_list if isinstance(msg_id_list, list) else [msg_id_list])

    if result:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


# 用户所有消息已读
@bp_message.route("/markAllAsRead", methods=["POST"])
def mark_all_as_read():
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(code=403)
    mu = MessageUser()

    mu.mark_all_message_read(user_id)

    return Utils.beop_response_success()


# 删除用户某条消息
@bp_message.route('/deleteUserMsg', methods=["POST"])
def delete_user_msg():
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(code=403)

    rq_data = request.get_json()
    msg_id_list = rq_data.get("msgIdList")

    if not msg_id_list:
        return Utils.beop_response_error()

    mu = MessageUser()
    rv = mu.delete_user_msg_by_msg_id_list(user_id, msg_id_list)
    if rv:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


# 删除用户所有消息
@bp_message.route('/deleteUserAllMsg', methods=["POST"])
def delete_user_all_msg():
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(code=403)

    mu = MessageUser()
    rv = mu.delete_user_all_msg(user_id)
    if rv:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


# 给某个人发送消息
@bp_message.route('/sendUserMsg/<message_type>', methods=["POST"])
def send_diagnosis_message_to_user(message_type):
    if not message_type:
        return Utils.beop_response_error(msg="You need a msg_type")
    if MessageType.ALLOW_TYPE.index(message_type) == -1:
        return Utils.beop_response_error(msg="msg_type isn\'t supposed : %s" % (message_type))

    rq_data = request.get_json()
    will_received_user_id_list = rq_data.get("receiver", [])
    user_id = rq_data.get('userId')
    if not user_id:
        return Utils.beop_response_error(msg="user_id不可为空")

    # convert message_list
    message_list = rq_data.get("message", [])
    if not message_list:
        title = rq_data.get("title", None)
        content = rq_data.get("content", None)
        message_list.append({"title": title, "content": content})

    m = Message()
    mu = MessageUser()

    try:

        # 诊断消息
        if message_type == MessageType.DIAGNOSIS:
            project_id = rq_data.get('projectId')
            if not project_id:
                return Utils.beop_response_error(msg="发送诊断消息需要提供projectId字段")
            for message_item in message_list:
                msg_id = m.add_new_diagnosis_message_with_return_id(user_id, message_item.get('title'),
                                                                    message_item.get("content"), project_id)
                mu.add_diagnosis_user_message(will_received_user_id_list, msg_id, project_id)

        # 用户自定消息
        elif message_type == MessageType.USER_CUSTOM:
            tags = rq_data.get("tags")
            if not tags:
                return Utils.beop_response_error(msg="发送诊断消息需要提供自定义的tags字段")

            for message_item in message_list:
                msg_id = m.add_new_message_with_return_id(user_id, message_item.get('title'),
                                                          message_item.get("content"), tags=tags)
                mu.add_many_user_message(will_received_user_id_list, msg_id, tags)
        # 报警消息
        elif message_type == MessageType.AlARM:
            tags = rq_data.get("tags")
            for message_item in message_list:
                msg_id = m.add_new_message_with_return_id(user_id, message_item.get('title'),
                                                          message_item.get('content'), tags=tags)
                mu.add_many_user_message(will_received_user_id_list, msg_id, tags)

        # 暂时其他的都 pass 掉
        else:
            pass
    except Exception as e:
        logging.error("消息中心添加诊断消息失败" + str(e))
        return Utils.beop_response_error(msg="消息中心添加诊断消息失败")

    return Utils.beop_response_success()


# 给一个项目的发送消息
@bp_message.route('/sendProjectMessage', methods=["POST"])
def send_message_to_project_users():
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(code=403)

    rq_data = request.get_json()

    title = rq_data.get("title")
    isMachine = rq_data.get("isMachine")
    content = rq_data.get("content", None)
    project_id = rq_data.get("projectId", None)

    if not content or not project_id or not title:
        return Utils.beop_response_error(msg="You should provide message content and message project id !")

    m = Message()
    mu = MessageUser()

    if isinstance(content, list):
        try:
            for content_item in content:
                title = content_item
                msg_id = m.add_new_message_with_return_id(user_id, title, content_item, isMachine)
                if msg_id:
                    mu.add_project_users_message(project_id, msg_id)
        except Exception as e:
            logging.error("添加项目消息失败" + str(e))
            pass

    return Utils.beop_response_success()


# 给一个团队的发送消息
@bp_message.route('/sendTeamMessage', methods=["POST"])
def send_message_to_team_users():
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(code=403)

    rq_data = request.get_json()
    title = rq_data.get("title")
    content = rq_data.get("content")
    isMachine = rq_data.get("isMachine")
    team_id = rq_data.get("teamId")

    if not content or not team_id or not title:
        return Utils.beop_response_error(msg="You should provide message content and message team id !")

    m = Message()
    mu = MessageUser()

    if isinstance(content, list):
        try:
            for content_item in content:
                title = content_item
                msg_id = m.add_new_message_with_return_id(user_id, title, content_item, isMachine)
                if msg_id:
                    mu.add_project_users_message(team_id, msg_id)
        except Exception as e:
            logging.error("添加团队消息失败" + str(e))
            pass

    return Utils.beop_response_success()
