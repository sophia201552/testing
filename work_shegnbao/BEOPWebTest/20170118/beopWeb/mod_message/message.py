from beopWeb.MongoConnManager import MongoConnManager, g_table_workflow_message
from .messageUser import MessageUser
from bson import ObjectId
from pymongo import ReturnDocument
from datetime import datetime, timedelta
from beopWeb.mod_admin import User
from beopWeb.mod_workflow.Task import Task
from beopWeb.mod_common.DateUtils import DateUtils
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_workflow.Activity import ActivityTimeType, ActivityType
import logging


class MessageType:
    ALLOW_TYPE = ["workflow", "diagnosis", "project", "versionHistory", "custom"]
    WORKFLOW = "workflow",
    DIAGNOSIS = "diagnosis"
    PROJECT = "project"
    VERSION_HISTORY = "versionHistory",
    USER_CUSTOM = "custom"


class Message:
    default_message = {
        'type': '0',  # 0 工单消息, 1: 版本消息
        'sender': {
            'id': 0,
            'type': '0'  # 0:人发送, 1:系统发送
        },
        'time': "",  # 消息时间
        'title': '',  # 消息标题
        'content': '',  # 消息内容
        'comments': [],
        'tags': [],  # 消息标签

        # extra message item
        # "workflow":{}
    }

    default_comments = {
        'userId': "",
        'message': 'TEXT',
        'time': ""
    }

    default_workflow_message_item = {
        "id": None,
        "op": None,
        "groupId": None,
        "optime": None,
        "willReceived": []
    }

    def __init__(self):
        self.db = MongoConnManager.getConfigConn().mdbBb[g_table_workflow_message]

    def __wrapper_message__(self, message_list, wrap_task_info=True):
        if isinstance(message_list, list):
            task_db = Task()
            for message_item in message_list:

                # task wrap by Task()
                if wrap_task_info:
                    task = message_item.get("task")
                    task_info = []
                    if task and isinstance(task, dict):
                        task_id = task.get("id")
                        if task_id:
                            try:
                                task_id = Utils.get_object_id(task_id)
                                task_info = task_db.get_task_by_id(task_id)
                                task_db.wrap_task_list([task_info])
                            except Exception as e:
                                logging.error(e)
                    message_item["taskInfo"] = task_info

                # sender
                sender = message_item.get("sender")
                if sender and isinstance(sender, dict):
                    sender_id = sender.get("id")
                    if sender_id:
                        sender["senderInfo"] = User.query_user_by_id(sender_id, 'userfullname', 'useremail', 'userpic',
                                                                     'id')

                # comments
                comments = message_item.get("comments")
                if comments and isinstance(comments, list):
                    for comment_item in comments:
                        comment_id = comment_item.get("userId")
                        if comment_id:
                            comment_item["userInfo"] = User.query_user_by_id(comment_id, 'userfullname', 'useremail',
                                                                             'userpic',
                                                                             'id')
        else:
            return False

    # 添加一条完整的消息
    def add_message_with_return_id(self, message):
        result = self.db.insert_one(message)
        if result:
            return result.inserted_id
        else:
            return False

    # 添加一条新的消息 通用的方法
    def add_new_message_with_return_id(self, user_id, title, content, isMachine=False, tags=None):
        message = self.default_message.copy()
        message.update(
                {"content": content, "sender": {"id": user_id, "type": 0 if isMachine else 1},
                 "time": datetime.now(),
                 "title": title, "tags": tags if isinstance(tags, list) else []})
        return self.add_message_with_return_id(message)

    # 添加一条诊断消息
    def add_new_diagnosis_message_with_return_id(self, sender_id, title, content, projectId, isMachine=False):
        message = self.default_message.copy()
        message.update({"content": content,
                        "sender": {"id": sender_id[0] if isinstance(sender_id, list) else sender_id,
                                   "type": 0 if isMachine else 1},
                        "time": datetime.now(),
                        "_projectId": projectId,
                        "title": title, "tags": ["diagnosis"]})
        return self.add_message_with_return_id(message)

    # 添加工单的具体一条动态
    def add_new_workflow_message_with_return_id(self, sender_id, title, content, workflow_info, isMachine=False):
        if not isinstance(workflow_info, dict):
            return False

        workflow_id = workflow_info.get("id", "")
        workflow_group_id = workflow_info.get("groupId", "")

        if not workflow_id:
            return False

        workflow_op = workflow_info.get("op", "")
        willReceived = workflow_info.get("willReceived", [])
        message = self.default_message.copy()
        workflow_item = self.default_workflow_message_item.copy()

        # update message body
        message.update(
                {"content": content,
                 "sender": {"id": sender_id[0] if isinstance(sender_id, list) else sender_id,
                            "type": 0 if isMachine else 1},
                 "time": datetime.now(),
                 "title": title, "tags": ["workflow", "activity"]})

        # update message workflow item
        workflow_item.update({
            "id": workflow_id,
            "op": workflow_op if workflow_op else None,
            "groupId": workflow_group_id,
            "optime": datetime.now(),
            "willReceived": willReceived
        })

        message["task"] = workflow_item
        return self.add_message_with_return_id(message)

    # 通过message_id_list 获取 具体的消息
    def get_user_message_by_id(self, message_id_list, tags=None):
        if tags and isinstance(tags, list):
            msg_list = self.db.find({"$and": [{"_id": {"$in": message_id_list}}, {"tags": {"$in": tags}}]})
        else:
            msg_list = self.db.find({"_id": {"$in": message_id_list}})
        msg_list = [item for item in msg_list]
        self.__wrapper_message__(msg_list)
        return msg_list

    # 通用的得到用户消息
    def query_user_message(self, use_id, msg_type=None, page_size=20, page_num=1, tags=None):
        mu = MessageUser()

        msg_list, count = mu.query_user_msgId_list(use_id, page_size, page_num, msg_type=msg_type, tags=tags)

        for msg_item in msg_list:
            message = self.db.find_one({"_id": ObjectId(msg_item.get("msgId"))})
            if message:
                wrapper_message = message.copy()
                self.__wrapper_message__([wrapper_message], wrap_task_info=False)
                msg_item["messageInfo"] = wrapper_message
        return msg_list, count

    # activity
    def __get_activity_latest_duration(self, now):
        return {
            "start": (now - timedelta(days=int(now.strftime("%w")))).strftime("%Y-%m-%d 00:00:00"),
            "end": (now + timedelta(days=6 - (int(now.strftime("%w"))))).strftime("%Y-%m-%d 23:59:59")
        }

    def __get_activity_time_range(self, activity_time_type):
        model = {
            ActivityTimeType.TODAY: DateUtils.get_today_duration,
            ActivityTimeType.THIS_WEEK: DateUtils.get_weekly_duration,
            ActivityTimeType.YESTERDAY: DateUtils.get_yesterday_duration,
            ActivityTimeType.THIS_MONTH: DateUtils.get_monthly_duration,
            ActivityTimeType.LATEST_COMPLETED: self.__get_activity_latest_duration,
            ActivityTimeType.LATEST_CREATED: self.__get_activity_latest_duration
        }
        result = model.get(activity_time_type)
        return result(datetime.now()) if result else None

    def __getActivities(self, user_id, activity_time_type, time_range, page, limit):
        # activity list query
        query = {"$and": [{"task.willReceived": {"$in": [user_id]}},
                          {"$and":
                              [
                                  {"time": {
                                      "$gte": datetime.strptime(time_range.get("start"), "%Y-%m-%d %H:%M:%S")}},
                                  {"time": {"$lte": datetime.strptime(time_range.get("end"), "%Y-%m-%d %H:%M:%S")}}
                              ]
                          }
                          ]}
        if activity_time_type == ActivityTimeType.LATEST_COMPLETED:
            query.get("$and").append({"task.op": ActivityType.COMPLETE})

        elif activity_time_type == ActivityTimeType.LATEST_CREATED:
            query.get("$and").append({"task.op": ActivityType.NEW})

        count = self.db.count(query)
        result = self.db.find(query, projection={"tags": 0, "type": 0}).skip((page - 1) * limit).limit(limit)

        return count, result

    def __get_if_none_then_type(self, type):
        if type == ActivityTimeType.TODAY:
            return ActivityTimeType.YESTERDAY
        elif type == ActivityTimeType.YESTERDAY:
            return ActivityTimeType.THIS_WEEK
        elif type == ActivityTimeType.THIS_WEEK:
            return ActivityTimeType.THIS_MONTH

    # 根据用户id获得他所能看到的所有的动态
    def get_user_activity(self, user_id, activity_time_type, page=1, limit=10):

        back_up_activity_type = None
        # time range of time type
        activity_time_type = str(activity_time_type)
        time_range = self.__get_activity_time_range(activity_time_type)
        # check time type
        if not time_range:
            err_msg = "activity type isn\'t supposed : " + str(activity_time_type)
            return [], 0, err_msg, back_up_activity_type
        err_msg = None

        count, result = self.__getActivities(user_id, activity_time_type, time_range, page, limit)
        result = [item for item in result]

        if str(page) == '1':

            # 如果获取不到数据再次获取一次
            if not count and not result and activity_time_type != ActivityTimeType.LATEST_COMPLETED and activity_time_type != ActivityTimeType.LATEST_CREATED:
                activity_time_type = self.__get_if_none_then_type(activity_time_type)
                back_up_activity_type = activity_time_type
                time_range = self.__get_activity_time_range(activity_time_type)

                # check time type
                if not time_range:
                    err_msg = "activity type isn\'t supposed : " + str(activity_time_type)
                    return [], 0, err_msg, back_up_activity_type

                count, result = self.__getActivities(user_id, activity_time_type, time_range, page, limit)
                result = [item for item in result]

        # 最终返回结果
        if result and count:
            self.__wrapper_message__(result, wrap_task_info=True)
            return result, count, err_msg, back_up_activity_type
        else:
            return [], 0, err_msg, back_up_activity_type

    # 动态当中的具体某一天添加评论，评论动态，而不是工单
    def add_activity_comment(self, user_id, msg_id, content):
        msg_id = Utils.get_object_id(msg_id)
        query = {"$and": [{
            "_id": msg_id
        }, {
            "task.willReceived": {"$in": [user_id]}
        }]}
        comment = self.default_comments.copy()
        comment.update({
            "userId": user_id,
            "message": content,
            "time": datetime.now()
        })
        update_doc = {
            "$push": {"comments": comment}
        }
        result = self.db.find_one_and_update(query, update_doc, return_document=ReturnDocument.AFTER)
        return result if result else False

    # 通过工单id得到所有的动态
    def get_task_activity_by_id(self, task_id):
        if not task_id:
            return []

        # find where tags in [workflow,activity]
        query = {"$and": [{"task.id": Utils.get_object_id(task_id)}, {"tags": {"$in": ["workflow", "activity"]}}]}

        rv = self.db.find(query)
        rv = [item for item in rv] if rv else []
        self.__wrapper_message__(rv, wrap_task_info=False)
        return rv

    # 删除所有相关任务组的信息
    def delete_all_msg_by_taskGroupId(self, task_group_id):
        if task_group_id:
            if isinstance(task_group_id, list):
                for item in task_group_id:
                    self.db.delete_many({"groupId": Utils.get_object_id(item)})
            else:
                self.db.delete_many({"groupId": Utils.get_object_id(task_group_id)})
