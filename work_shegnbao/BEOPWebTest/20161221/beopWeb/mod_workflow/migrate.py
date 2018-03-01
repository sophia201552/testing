__author__ = 'win7'

from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_workflow.Task import Task
from beopWeb.mod_workflow.Transaction import TransactionStatus
from bson import ObjectId
from datetime import datetime
from beopWeb.mod_workflow.TaskGroup import TaskGroup
from beopWeb.mod_workflow.Constants import TaskStatus, TaskAction


class Migrate:
    db_helper = Utils.DbHelper()

    db_name = 'workflow'

    def get_attachments(self, transId):
        old_items = self.db_helper.query(db_name=self.db_name, table='transaction_attachment',
                                         fields=['uid', 'time', 'file'],
                                         where=('transId = %s', (transId,)))
        attachments = []
        if old_items:
            for item in old_items:
                attachments.append({
                    "uid": item.get('uid'),
                    "uploadTime": item.get('time'),
                    "fileName": item.get('file'),
                    "userId": 1
                })
        return attachments

    def migrate_vacation(self):
        taskGroupId = '582880e0645514043025d72e'
        orders = self.db_helper.query(db_name=self.db_name, table='transaction',
                                      fields=['title', 'statusId', 'creatorID', 'dueDate', 'detail', 'id',
                                              'createTime', 'critical'],
                                      where=('groupId = 661',))
        deleted_count = Task().delete_tasks({"taskGroupId": taskGroupId})
        tasks = []
        for order in orders:
            members = self.get_trans_members(order.get('id'))
            task = {
                "_id": ObjectId(),
                "template": {
                    "name": "短假模版",
                    "fields": [{
                        "name": "请假天数",
                        "type": "text"
                    }],
                    "createTime": "",
                    "_id": ObjectId("5716e61de153dc21945d7baa"),
                    "type": 1
                },
                "taskGroupId": taskGroupId,
                "executor": 448 if order.get('statusId') >= TransactionStatus.COMPLETE else 1331,
                "process": {
                    "template_id": "5716e61de153dc21945d7baa",
                    "nodes": [{
                        "note": None,
                        "members": [order.get('creatorID')],
                        "arch_type": {
                            "name": "全体成员",
                            "type": ""
                        },
                        "behaviour": "2",
                        "datetime": datetime.now(),
                        "arch_id": "0",
                        "action": "complete"
                    }, {
                        "note": None,
                        "members": list(set(members.get('verifier'))),
                        "behaviour": "1",
                        "arch_id": "0",
                        "datetime": datetime.now(),
                        "arch_type": {
                            "name": "全体成员",
                            "type": ""
                        },
                        "action": TaskAction.PASS
                    }, {
                        "members": [1],
                        "note": None,
                        "arch_type": {
                            "name": "全体成员",
                            "type": ""
                        },
                        "datetime": datetime.now(),
                        "behaviour": "1",
                        "arch_id": "0",
                        "action": TaskAction.PASS
                    }, {
                        "members": [1331],
                        "behaviour": "1",
                        "arch_id": "1465266511323001aebcb536",
                        "arch_type": {
                            "name": "行政部",
                            "type": ""
                        },
                        "action": TaskAction.PASS if order.get('statusId') >= TransactionStatus.COMPLETE else ""
                    }, {
                        "members": [448],
                        "behaviour": "1",
                        "arch_id": "1465263219910001e56a9859",
                        "arch_type": {
                            "name": "行政经理",
                            "type": ""
                        },
                        "action": TaskAction.PASS if order.get('statusId') >= TransactionStatus.COMPLETE else ""
                    }],
                    "_id": ObjectId("5756331d1c9547160d98c4cd"),
                    "name": "请假流程",
                    "type": 2
                },
                "node_index": 4 if order.get('statusId') >= TransactionStatus.COMPLETE else 3,
                "fields": {
                    "title": order.get('title'),
                    "template_id": "5716e61de153dc21945d7baa",
                    "请假天数": "",
                    "dueDate": order.get('dueDate'),
                    "critical": "1",
                    "tags[]": ["14787708163980687f3efd25"],
                    "detail": order.get('detail'),
                    "_oldID": order.get('id')
                },
                "createTime": order.get('createTime'),
                "status": self.get_task_status(order.get('statusId')),
                "attachment": self.get_attachments(order.get('id')),
                "tags": ["请假"],
                "creator": order.get('creatorID')
            }
            tasks.append(task)
        Task().save_tasks(tasks)

    def get_trans_members(self, transId):
        # 1:wacther 2:verifier
        rv = {
            "wacther": [],
            "verifier": []
        }
        members = self.db_helper.query(db_name=self.db_name, table='transaction_member',
                                       fields=['userId', 'type'],
                                       where=('transId = %s', (transId,)))
        if not members:
            return rv

        for member in members:
            if member.get('type') == 1:
                rv['wacther'].append(member.get('userId'))
            elif member.get('type') == 2:
                rv['verifier'].append(member.get('userId'))
        return rv

    def get_default_process_index(self, old_status):
        if old_status < TransactionStatus.COMPLETE:
            return 1
        elif old_status >= TransactionStatus.COMPLETE:
            return 2

    def get_task_status(self, old_status):
        if old_status == TransactionStatus.NEW:
            return TaskStatus.NEW
        elif old_status < TransactionStatus.COMPLETE:
            return TaskStatus.PROCESSING
        elif old_status >= TransactionStatus.COMPLETE:
            return TaskStatus.END
        return TaskStatus.NEW

    def migrate_BEOP_DESIGN(self):
        group_id = '58257c7864551423e48ffc70'
        orders = self.db_helper.query(db_name=self.db_name, table='transaction',
                                      fields=['title', 'statusId', 'creatorID', 'dueDate', 'detail', 'id',
                                              'createTime', 'critical', 'executorID'],
                                      where=('groupId = 653',))
        deleted_count = Task().delete_tasks({"taskGroupId": group_id})
        tasks = []
        for order in orders:
            members = self.get_trans_members(order.get('id'))
            task = {
                "_id": ObjectId(),
                "status": self.get_task_status(order.get('statusId')),
                "tags": [],
                "template": {
                    "name": "一般流程",
                    "type": 1,
                    "fields": [],
                    "_id": ObjectId("56f13216e153db0248d3fb91"),
                    "createTime": ""
                },
                "creator": order.get('creatorID'),
                "attachment": self.get_attachments(order.get('id')),
                "executor": order.get('executorID'),
                "process": {
                    "template_id": "56f13216e153db0248d3fb91",
                    "name": "默认流程",
                    "type": 2,
                    "nodes": [{
                        "arch_id": "0",
                        "behaviour": "2",
                        "arch_type": {
                            "name": "全体成员",
                            "type": ""
                        },
                        "members": [order.get('creatorID')]
                    }, {
                        "arch_id": "0",
                        "behaviour": "2",
                        "arch_type": {
                            "name": "全体成员",
                            "type": ""
                        },
                        "members": order.get('executorID')
                    }, {
                        "arch_id": "0",
                        "behaviour": "1",
                        "arch_type": {
                            "name": "全体成员",
                            "type": ""
                        },
                        "members": [members.get('verifier')]
                    }],
                    "_id": ObjectId("5756331d1c9547160d98c4d0")
                },
                "fields": {
                    "title": order.get('title'),
                    "dueDate": order.get('dueDate'),
                    "detail": order.get('detail'),
                    "_oldID": order.get('id'),
                    "critical": order.get('critical'),
                    "template_id": "56f13216e153db0248d3fb91"
                },
                "taskGroupId": group_id,
                "createTime": order.get('createTime'),
                "node_index": self.get_default_process_index(order.get('statusId')),
            }
            tasks.append(task)
        Task().save_tasks(tasks)

    def migrate_test(self):
        group_id = '582593d56455142fc4093e7e'
        orders = self.db_helper.query(db_name=self.db_name, table='transaction',
                                      fields=['title', 'statusId', 'creatorID', 'dueDate', 'detail', 'id',
                                              'createTime', 'critical', 'executorID'],
                                      where=('groupId = 645',))
        deleted_count = Task().delete_tasks({"taskGroupId": group_id})
        tasks = []
        for order in orders:
            members = self.get_trans_members(order.get('id'))
            task = {
                "_id": ObjectId(),
                "status": self.get_task_status(order.get('statusId')),
                "tags": [],
                "template": {
                    "name": "一般流程",
                    "type": 1,
                    "fields": [],
                    "_id": ObjectId("56f13216e153db0248d3fb91"),
                    "createTime": ""
                },
                "creator": order.get('creatorID'),
                "attachment": self.get_attachments(order.get('id')),
                "executor": order.get('executorID'),
                "process": {
                    "template_id": "56f13216e153db0248d3fb91",
                    "name": "默认流程",
                    "type": 2,
                    "nodes": [{
                        "arch_id": "0",
                        "behaviour": "2",
                        "arch_type": {
                            "name": "全体成员",
                            "type": ""
                        },
                        "members": [order.get('creatorID')]
                    }, {
                        "arch_id": "0",
                        "behaviour": "2",
                        "arch_type": {
                            "name": "全体成员",
                            "type": ""
                        },
                        "members": [order.get('executorID')]
                    }, {
                        "arch_id": "0",
                        "behaviour": "1",
                        "arch_type": {
                            "name": "全体成员",
                            "type": ""
                        },
                        "members": [members.get('verifier')]
                    }],
                    "_id": ObjectId("5756331d1c9547160d98c4d0")
                },
                "fields": {
                    "title": order.get('title'),
                    "dueDate": order.get('dueDate'),
                    "detail": order.get('detail'),
                    "_oldID": order.get('id'),
                    "critical": order.get('critical'),
                    "template_id": "56f13216e153db0248d3fb91"
                },
                "taskGroupId": group_id,
                "createTime": order.get('createTime'),
                "node_index": self.get_default_process_index(order.get('statusId'))
            }
            tasks.append(task)
        Task().save_tasks(tasks)

    def migrate_suanfa(self):
        group_id = '5825a2ca64551446405b33fe'
        orders = self.db_helper.query(db_name=self.db_name, table='transaction',
                                      fields=['title', 'statusId', 'creatorID', 'dueDate', 'detail', 'id',
                                              'createTime', 'critical', 'executorID'],
                                      where=('groupId = 729',))
        deleted_count = Task().delete_tasks({"taskGroupId": group_id})
        tasks = []
        for order in orders:
            members = self.get_trans_members(order.get('id'))
            task = {
                "_id": ObjectId(),
                "status": self.get_task_status(order.get('statusId')),
                "tags": [],
                "template": {
                    "name": "一般流程",
                    "type": 1,
                    "fields": [],
                    "_id": ObjectId("56f13216e153db0248d3fb91"),
                    "createTime": ""
                },
                "creator": order.get('creatorID'),
                "attachment": self.get_attachments(order.get('id')),
                "executor": order.get('executorID'),
                "process": {
                    "template_id": "56f13216e153db0248d3fb91",
                    "name": "默认流程",
                    "type": 2,
                    "nodes": [{
                        "arch_id": "0",
                        "behaviour": "2",
                        "arch_type": {
                            "name": "全体成员",
                            "type": ""
                        },
                        "members": [order.get('creatorID')]
                    }, {
                        "arch_id": "0",
                        "behaviour": "2",
                        "arch_type": {
                            "name": "全体成员",
                            "type": ""
                        },
                        "members": order.get('executorID')
                    }, {
                        "arch_id": "0",
                        "behaviour": "1",
                        "arch_type": {
                            "name": "全体成员",
                            "type": ""
                        },
                        "members": [members.get('verifier')]
                    }],
                    "_id": ObjectId("5756331d1c9547160d98c4d0")
                },
                "fields": {
                    "title": order.get('title'),
                    "dueDate": order.get('dueDate'),
                    "detail": order.get('detail'),
                    "_oldID": order.get('id'),
                    "critical": order.get('critical'),
                    "template_id": "56f13216e153db0248d3fb91"
                },
                "taskGroupId": group_id,
                "createTime": order.get('createTime'),
                "node_index": self.get_default_process_index(order.get('statusId'))
            }
            tasks.append(task)
        Task().save_tasks(tasks)

    def migrate_huawei(self):
        group_id = '5825b4b864551407cc5306ff'
        orders = self.db_helper.query(db_name=self.db_name, table='transaction',
                                      fields=['title', 'statusId', 'creatorID', 'dueDate', 'detail', 'id',
                                              'createTime', 'critical', 'executorID'],
                                      where=('groupId = 3994',))
        deleted_count = Task().delete_tasks({"taskGroupId": group_id})
        tasks = []
        for order in orders:
            members = self.get_trans_members(order.get('id'))
            task = {
                "_id": ObjectId(),
                "status": self.get_task_status(order.get('statusId')),
                "tags": [],
                "template": {
                    "name": "一般流程",
                    "type": 1,
                    "fields": [],
                    "_id": ObjectId("56f13216e153db0248d3fb91"),
                    "createTime": ""
                },
                "creator": order.get('creatorID'),
                "attachment": self.get_attachments(order.get('id')),
                "executor": order.get('executorID'),
                "process": {
                    "template_id": "56f13216e153db0248d3fb91",
                    "name": "默认流程",
                    "type": 2,
                    "nodes": [{
                        "arch_id": "0",
                        "behaviour": "2",
                        "arch_type": {
                            "name": "全体成员",
                            "type": ""
                        },
                        "members": [order.get('creatorID')],
                        "action": TaskAction.PASS
                    }, {
                        "arch_id": "0",
                        "behaviour": "2",
                        "arch_type": {
                            "name": "全体成员",
                            "type": ""
                        },
                        "members": [order.get('executorID')],
                        "action": TaskAction.COMPLETE if self.get_default_process_index(
                            order.get('statusId')) == 2 else ""
                    }, {
                        "arch_id": "0",
                        "behaviour": "1",
                        "arch_type": {
                            "name": "全体成员",
                            "type": ""
                        },
                        "members": list(set(members.get('verifier'))),
                        "action": TaskAction.PASS if self.get_task_status(
                            order.get('statusId')) == TaskStatus.END else ""
                    }],
                    "_id": ObjectId("5825abbfe153dc2d844ac662")
                },
                "fields": {
                    "title": order.get('title'),
                    "dueDate": order.get('dueDate'),
                    "detail": order.get('detail'),
                    "_oldID": order.get('id'),
                    "critical": order.get('critical'),
                    "template_id": "56f13216e153db0248d3fb91"
                },
                "taskGroupId": group_id,
                "createTime": order.get('createTime'),
                "node_index": self.get_default_process_index(order.get('statusId'))
            }
            tasks.append(task)
        Task().save_tasks(tasks)

    def migrate_default_tasks(self, new_group_id, old_group_id):
        orders = self.db_helper.query(db_name=self.db_name, table='transaction',
                                      fields=['title', 'statusId', 'creatorID', 'dueDate', 'detail', 'id',
                                              'createTime', 'critical', 'executorID'],
                                      where=('groupId = %s' % old_group_id,))
        deleted_count = Task().delete_tasks({"taskGroupId": new_group_id})
        tasks = []
        for order in orders:
            members = self.get_trans_members(order.get('id'))
            task = {
                "_id": ObjectId(),
                "status": self.get_task_status(order.get('statusId')),
                "tags": [],
                "template": {
                    "name": "一般流程",
                    "type": 1,
                    "fields": [],
                    "_id": ObjectId("56f13216e153db0248d3fb91"),
                    "createTime": ""
                },
                "creator": order.get('creatorID'),
                "attachment": self.get_attachments(order.get('id')),
                "executor": order.get('executorID'),
                "process": {
                    "template_id": "56f13216e153db0248d3fb91",
                    "name": "默认流程",
                    "type": 2,
                    "nodes": [{
                        "arch_id": "0",
                        "behaviour": "2",
                        "arch_type": {
                            "name": "全体成员",
                            "type": ""
                        },
                        "members": [order.get('creatorID')]
                    }, {
                        "arch_id": "0",
                        "behaviour": "2",
                        "arch_type": {
                            "name": "全体成员",
                            "type": ""
                        },
                        "members": [order.get('executorID')]
                    }, {
                        "arch_id": "0",
                        "behaviour": "1",
                        "arch_type": {
                            "name": "全体成员",
                            "type": ""
                        },
                        "members": [members.get('verifier')]
                    }],
                    "_id": ObjectId("5756331d1c9547160d98c4d0")
                },
                "fields": {
                    "title": order.get('title'),
                    "dueDate": order.get('dueDate'),
                    "detail": order.get('detail'),
                    "critical": order.get('critical'),
                    "template_id": "56f13216e153db0248d3fb91"
                },
                "oldFields": order,
                "taskGroupId": str(new_group_id),
                "createTime": order.get('createTime'),
                "node_index": self.get_default_process_index(order.get('statusId'))
            }
            tasks.append(task)
        Task().save_tasks(tasks)

    def migrate_shengbao_groups(self):
        team_id = '57562c541c9547160d98c4cc'
        default_process_id = "56f13216e153db0248d3fb91"
        tg = TaskGroup()
        deleted_tg_count = tg.delete({'team_id': team_id, 'process': {'$in': [default_process_id]}})
        deleted_task_count = Task().delete_tasks({"oldFields": {'$exists': True}})

        old_groups = self.db_helper.query(db_name=self.db_name, table='transaction_group',
                                          fields=['id', 'name', 'creatorId', 'description', 'pic',
                                                  'createTime', 'type'], where=('id!=%s or id!=%s', (661, 645)))
        for old_group in old_groups:
            members = self.db_helper.query(db_name=self.db_name, table='transaction_group_user',
                                           fields=('userId',), where=('groupId=%s', (old_group.get('id'),)))

            new_group = {
                "_id": ObjectId(),
                "createTime": old_group.get('createTime'),
                "creator": old_group.get('creatorId'),
                "name": old_group.get('name'),
                "desc": old_group.get('description'),
                "team_id": team_id,
                "arch": [],
                "oldMembers": list(set([member.get('userId') for member in members])),
                "process": [default_process_id]
            }

            group_id = tg.save_task_group(new_group)
            try:
                self.migrate_default_tasks(group_id, old_group.get('id'))
            except Exception as e:
                print(e)
