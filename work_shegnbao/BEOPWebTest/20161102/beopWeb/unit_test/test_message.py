import unittest
from datetime import datetime
from beopWeb.mod_message.message import Message
from beopWeb.mod_message.messageUser import MessageUser
from bson import ObjectId
from beopWeb.mod_admin.Project import Project
from beopWeb.BEOPMySqlDBContainer import *

message = Message()
messageUser = MessageUser()
import uuid


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

    def undefined(self):
        list = [1, 2, 3, 4, 5]
        for key in list:
            uid = uuid.uuid1()
            uid = uid.hex[:10]
            msg_id = message.add_new_workflow_message_with_return_id(408,
                                                                     "测试:",
                                                                     "%s 测试诊断消息，233333." % (uid),
                                                                     {
                                                                         "id": "111111",
                                                                         "groupId": "23222222222222",
                                                                         "op": "new",
                                                                         "willReceived": [408, 1]
                                                                     })
            msg_id = message.add_new_message_with_return_id(408, "测试：诊断消息", "%s 测试诊断消息，233333." % (uid),
                                                            tags=["diagnosis"])
            messageUser.add_diagnosis_user_message([408], msg_id)

            # messageUser.mark_message_read(408, ['574263d8545cd41850101ab9'])

    def test(self):
        dtu_name = 'dajin'
        rv = BEOPMySqlDBContainer().op_db_query("beopdoengine",
                                                "SELECT id,dbname FROM dtuserver_prj WHERE dtuname= '%s' " % (
                                                    dtu_name))
        print([{key: value for key, value in zip(("id", "dtuname"), rv_item)} for rv_item in rv] if rv else [])
