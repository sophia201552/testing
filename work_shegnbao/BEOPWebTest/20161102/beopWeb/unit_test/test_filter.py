import unittest
from beopWeb.mod_workflow.Task import Task
from bson import ObjectId
from datetime import datetime, timedelta

task = Task()


class WorkflowTestCase(unittest.TestCase):
    # 待我处理的工单
    def test(self):
        result, count = task.task_filter(
                {"$and": [
                    {"process.nodes.members": 1},
                    {"creator": {"$nin": [1]}},
                    {"fields.critical": "2"},
                    # {"$and": [
                    #     {"createTime": {"$gte": datetime.now() - timedelta(days=60)}},
                    #     {"createTime": {"$lte": datetime.now()}}
                    # ]}
                    {"$and": [
                        {"createTime": {"$gte": datetime.strptime("2016-03-08 14:00:41", "%Y-%m-%d %H:%M:%S")}},
                        {"createTime": {"$lte": datetime.strptime("2016-05-08 14:00:41", "%Y-%m-%d %H:%M:%S")}}
                    ]}
                ]
                }
        )
        print(count)
