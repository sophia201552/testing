import unittest
from datetime import datetime
from beopWeb.mod_message.message import Message
from beopWeb.mod_message.messageUser import MessageUser
from bson import ObjectId


class UtilsCase(unittest.TestCase):
    message = {
        'type': '0',  # 0 工单消息, 1: 版本消息
        'sender': {
            'id': 408,
            'type': '0'  # 0:人发送, 1:系统发送
        },
        'time': datetime.now(),  # 消息时间
        'title': '消息标题~~',  # 消息标题
        'content': '消息内容~~',  # 消息内容
        'comments': [  # 评论
            {
                'user': 68,
                'message': 'TEXT',
                'time': datetime.now()
            }
        ],
        'tags': ["Node", "vuex", "vue"]  # 消息标签
    }

    userMessage = {
        'userId': 68,  # 用户Id
        'message': [
            {
                'msgId': '',  # 消息Id
                'isRead': 0  # 是否已读
            }
        ]
    }

    def test(self):
        message = Message()
        messageUser = MessageUser()

        user_id_list = [68, 408, 1]

        msg_id = message.add_message_with_return_id(self.message)
        assert isinstance(msg_id, ObjectId)
        print("添加消息成功")

        messageUser.add_user_message(68, msg_id)
        messageUser.add_user_group_message(user_id_list, msg_id)
        print("给消息需要通知到的用户更新message成功")

        messageUser.mark_message_read(68, msg_id)
        print("给需要通知到的用户更新已读成功")
