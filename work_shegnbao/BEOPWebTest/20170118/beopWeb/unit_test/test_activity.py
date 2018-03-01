import unittest
from datetime import datetime, date
from beopWeb.mod_message.message import Message
from beopWeb.mod_workflow.Task import Task

M = Message()
task = Task()


class Activity_test(unittest.TestCase):
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
                'userId': 68,
                'message': '用户对动态的评论内容',
                'time': datetime.now()
            }
        ],
        'tags': ["Node", "vuex", "React"]  # 消息标签
    }

    def add_activity(self):
        return M.add_new_workflow_message_with_return_id(1, "测试消息", "测试消息内容", {
            "teamId": 1,
            "id": 1,
            "op": "not_verify",
            "groupId": 1,
            "willReceived": [1, 408]
        })

    def undefined_2(self):
        M.add_activity_comment(1, "5732d7c9545cd40b7cfb8e3b", "TEST")

    def undefined_3(self):
        rv = M.get_task_activity_by_id("3305")
        print(rv)

    def test(self):
        rv = task.add_task_comment_by_id("56fd22656455142390d812a6", 1, "test comment")
        print(rv)
