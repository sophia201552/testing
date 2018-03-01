__author__ = 'win7'
from beopWeb.MongoConnManager import MongoConnManager, g_table_workflow_task
from beopWeb.mod_workflow.TaskGroup import TaskGroup
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_admin.User import User
from beopWeb.mod_workflow.Team import Team
from datetime import datetime
from bson import ObjectId
import logging
from beopWeb.mod_workflow.TransactionEmail import TransactionEmail
from beopWeb.diagnosis import set_diagnosis_feedBack
from beopWeb.mod_workflow.Constants import TaskType, FeedBackStatus
from beopWeb.mod_workflow.Constants import TaskStatus, TaskAction, NodeBehaviour
from beopWeb.mod_common.Exceptions import NotExists


class Task:
    default_attachment = {
        "name": None,
        "userId": None,
        "uid": None
    }
    default_projection = {}

    def __init__(self, task_id=None):
        self.db = MongoConnManager.getConfigConn().mdbBb[g_table_workflow_task]
        self.task_id = Utils.get_object_id(task_id) if task_id else None

    def get_task_by_id(self, task_id):
        self.task_id = Utils.get_object_id(task_id)
        return self.get_task()

    def get_task(self):
        task = self.get_raw_task()
        if not task:
            return None
        process = task.get('process')
        team = None
        if task.get('teamId'):
            team = Team().get_team_by_id(task.get('teamId'))
        if process and process.get('nodes'):
            for node in process.get('nodes'):
                if node.get('archType') == 4 and len(node.get('members')) == 0 and team:  # 全体人员
                    for arch in team.get('arch'):
                        node['members'] += arch.get('members')
                    members_map = {member.get('id'): member
                                   for member in node.get('members') if isinstance(member, dict)}
                    node['members'] = [item for item in members_map.values()]
                    continue

                if node.get('members') and len(node.get('members')) > 0:
                    node['members'] = User().get_user_list_info(node['members'])
                else:
                    arch_list = TaskGroup().get_group_arch_by_id(task.get('taskGroupId'), node.get('arch_id'))
                    node['members'] = User().get_user_list_info(arch_list)
        if task.get('watchers'):
            task['watchersInfo'] = User().get_user_list_info(task.get('watchers'))

        if task.get('creator'):
            task['creatorInfo'] = User().get_user_by_id(task.get('creator'))

        if task.get('executor'):
            task['executorInfo'] = User().get_user_by_id(task.get('executor'))
        return task

    def get_raw_task(self):
        return self.db.find_one({'_id': self.task_id})

    def change_current_node_member(self, members):
        task = self.get_raw_task()
        if not task:
            raise NotExists()
        process = task.get('process')
        if not process:
            return False
        nodes = process.get('nodes')
        node_index = task.get('node_index')
        current_node = nodes[node_index]

        current_node['members'] = members
        task['executor'] = members[0]

        return self.update_task(task)

    def finish_task(self):
        task = self.get_raw_task()
        if not task:
            return False
        task['status'] = TaskStatus.END
        task['finishTime'] = datetime.now()
        return self.update_task(task)

    def task_action(self, user_id, action, next_user_id=None, note=None):
        task = self.get_raw_task()
        if not task:
            return False
        process = task.get('process')
        if not process:
            return False
        nodes = process.get('nodes')
        node_index = task.get('node_index')
        current_node = nodes[node_index]
        current_node['note'] = note
        current_node['datetime'] = datetime.now()
        current_node['action'] = action
        next_node = None
        if action == TaskAction.NO_PASS:
            task['status'] = TaskStatus.NOT_PASS
            del task['node_index']
        else:
            next_node_index = node_index + 1

            if next_node_index >= len(nodes):
                task['status'] = TaskStatus.END
                del task['node_index']
            else:
                task['status'] = TaskStatus.PROCESSING
                if next_user_id:
                    next_node = nodes[next_node_index]
                    next_node['members'] = [next_user_id]
                    task['executor'] = next_user_id
                task['node_index'] = next_node_index

        task_id = self.save_task(task)
        if task_id:
            try:
                te = TransactionEmail()
                email_option = {
                    'executor': next_user_id,
                    'watchers': task.get('watchers'),
                    'userId': task.get('creator'),
                    'title': task['fields'].get('title'),
                    'detail': task['fields'].get('detail'),
                    'dueDate': task['fields'].get('dueDate')
                }
                email_type = 'NEW'
                if action == TaskAction.NO_PASS:  # 不通过情况
                    email_option['executor'] = task.get('creator')
                    email_type = 'NO_PASS'
                    self.make_diagnosis_feedback(task, FeedBackStatus.DONE)
                else:
                    if next_node:  # 流程没有结束
                        if str(next_node.get('behaviour')) == str(NodeBehaviour.EXECUTE):
                            email_type = 'EXECUTE'
                        elif str(next_node.get('behaviour')) == str(NodeBehaviour.VERIFY):
                            email_type = 'VERIFY'
                        self.make_diagnosis_feedback(task, FeedBackStatus.PROCESSING)
                    else:  # 流程结束
                        email_option['executor'] = task.get('creator')
                        email_type = 'PASS'
                        self.make_diagnosis_feedback(task, FeedBackStatus.DONE)
                te.send_task_email(task_id, email_option, task.get('attachment'), email_type=email_type)
            except Exception as e:
                logging.error("新建工单发送邮件失败" + e.__str__())

        return task_id

    def make_diagnosis_feedback(self, task, status):
        if not task:
            return
        if task.get('fields').get('type') == TaskType.FEEDBACK:
            try:
                fault_id = task.get('fields').get('faultId')
                project_id = task.get('fields').get('charts').get('projectId')
                start_time = task.get('fields').get('charts').get('chartStartTime')
                end_time = task.get('fields').get('charts').get('chartEndTime')
                set_diagnosis_feedBack(project_id, fault_id, str(task.get('_id')), status, start_time, end_time)
            except Exception as e:
                logging.error('Task make_diagnosis_feedback 反馈状态设置失败:' + str(e))
                pass

    def update_task(self, task):
        try:
            del task['_id']
        except Exception as e:
            pass
        return self.db.update_one({'_id': self.task_id}, {'$set': task})

    def save_task(self, task):
        return self.db.save(task)

    def save_tasks(self, tasks):
        return self.db.insert_many(tasks)

    def delete_task(self):
        return self.db.delete_one({'_id': self.task_id}).deleted_count

    def delete_tasks(self, filter):
        return self.db.delete_many(filter).deleted_count

    def delete_one_task(self):
        return self.db.update_one({'_id': self.task_id}, {"$set": {"_isDelete": True}})

    def get_tasks(self, task_status, user_id, offset, size):
        return self.get_tasks_by_status(task_status, user_id, offset, size)

    def get_working_tasks(self, user_id, offset, size):
        return self.get_tasks_by_status({'$lte': TaskStatus.PROCESSING}, user_id, offset, size)

    def get_joined_tasks(self, user_id, offset, size):
        return self.get_user_all_tasks(user_id, offset, size)

    def get_history_complete_tasks(self, user_id, offset, size):
        return self.get_tasks_by_status({'$lte': TaskStatus.END}, user_id, offset, size)

    def get_user_all_tasks(self, user_id, offset, size):
        cursor = self.db.find({"process.nodes.members": {"$in": [user_id]}})
        return cursor.count(), [item for item in cursor] if cursor else []

    def get_tasks_by_status(self, status_statement, user_id, offset, size):
        tg = TaskGroup()
        user_id = int(user_id)
        query_ids = tg.get_arch_ids_by_user_id(user_id)
        query_ids.append(user_id)

        document_filter = {'executor': {'$in': query_ids}}
        document_filter.update({'status': status_statement})

        cursor = self.db.find(document_filter)
        total = cursor.count()
        result = cursor.skip(offset).limit(size)
        return total, [item for item in result]

    def wrap_task_list(self, task_list):
        if not task_list:
            return []
        tg = TaskGroup()
        all_user_map = User().get_all_user_map()
        for item in task_list:
            if isinstance(item.get('executor'), int):
                executor = ''
                if isinstance(item.get('executor'), list):
                    if len(item.get('executor')) > 0:
                        executor = all_user_map.get(item.get('executor')[0])
                else:
                    executor = all_user_map.get(item.get('executor'))
                item['executor'] = executor.get('userfullname') if executor else ''

            creator = all_user_map.get(item.get('creator'))
            if creator:
                item['creator'] = creator.get('userfullname', '')
                item["creatorInfo"] = creator

            item["isRead"] = 1
            item["statusId"] = item.get("status")
            if item.get('process'):
                item["processName"] = item.get('process').get('name')
            # 用户星标也暂时设置为false
            item['star'] = False
            if item['fields']:
                item['title'] = item.get('fields').get('title')
                item['dueDate'] = item.get('fields').get('dueDate')

            if item.get('template'):
                del item['template']

            group = tg.get_task_group_by_id(item.get('taskGroupId'))
            if group:
                item['groupName'] = group.get('name')

    def task_count_by_group_id(self, user_id, group_id):
        return self.db.count({"taskGroupId": group_id,
                              "_isDelete": {"$ne": True},
                              "$or": [{"creator": user_id}, {"watchers": user_id},
                                      {"process.nodes.members": {"$in": [user_id]}}]
                              })

    def get_by_group_id(self, user_id, group_id, page_num, page_size):
        db = self.db.find(
            {"taskGroupId": group_id, "_isDelete": {"$ne": True},
             "$or": [{"creator": user_id}, {"watchers": user_id},
                     {"process.nodes.members": {"$in": [user_id]}}]},
            sort=[('_id', -1)])
        result = db.skip(page_size * (page_num - 1)).limit(page_size)
        return [item for item in result], db.count()

    # 通过一个 group_id_list 去拿到所有的 task 和对应的数量,并进行分页
    def get_by_group_id_list(self, user_id, group_id_list, page_num, page_size):
        return self.task_filter(
            {"taskGroupId": {"$in": group_id_list},
             "$or": [{"process.nodes.members": {"$in": [user_id]}}, {"creator": user_id},
                     {"watchers": user_id}],
             "_isDelete": {"$ne": True}}, None, page_num,
            page_size)

    def task_filter(self, task_filter, task_projection=None, page_num=None, page_size=None, order=None):
        if task_filter.get('createTime') is not None:
            task_filter['createTime'].update(
                {'$gt': datetime.strptime(task_filter['createTime']['$gt'], '%Y-%m-%d %H:%M:%S'),
                 '$lt': datetime.strptime(task_filter['createTime']['$lt'], '%Y-%m-%d %H:%M:%S')})
        if not task_filter:
            return [], 0
        if task_projection:
            result = self.db.find(task_filter, task_projection, sort=[('createTime', -1)])
        else:
            if order:
                tup = (order[0], order[1])
                result = self.db.find(task_filter, sort=[tup])
            else:
                result = self.db.find(task_filter, sort=[('createTime', -1)])
        if page_size:
            result = result.skip(page_size * (page_num - 1)).limit(page_size)
        count = result.count()

        task_list = [item for item in result]
        all_user_map = User().get_all_user_map()
        for task in task_list:
            executor = task.get('executor')
            if executor:
                if isinstance(executor, list):
                    if len(task.get('executor')) > 0:
                        executor = all_user_map.get(task.get('executor')[0])
                else:
                    executor = all_user_map.get(task.get('executor'))
                task['executor'] = executor.get('userfullname') if executor else ''

        return task_list, count

    def task_group_filter(self, rq_data, user_id):
        filter = rq_data.get('filter')
        page = rq_data.get('page')
        limit = rq_data.get("limit")
        group_id = rq_data.get("groupId")
        all_filter = {}
        for key in filter:
            if key == "creator":
                value = filter.get(key)
                if value == "1":
                    all_filter["creator"] = user_id
                else:
                    all_filter["creator"] = {"$ne": user_id}
            elif key == "status":
                all_filter["status"] = filter.get(key)
            elif key == "urgency":
                all_filter["fields.critical"] = filter.get(key)
            elif key == "tag":
                pass
            elif key == "dueDate":
                pass
        if group_id:
            all_filter["taskGroupId"] = group_id

        result = self.db.find(all_filter).skip(limit * (page - 1)).limit(limit)
        count = self.db.count(all_filter)
        result = [item for item in result]
        return result, count

    def get_task_by_name_team_id(self, user_id, tag_name, page_num, page_size):
        tm = Team()
        total_count = 0
        result = []

        # find team by user id
        team = tm.get_team_by_user_id(user_id)
        if team:
            tg = TaskGroup()

            # find group list by team id
            group_list = tg.get_task_group_by_team_id(team.get('_id'))
            group_list = [item for item in group_list]

            team_id_list = []

            for group in group_list:
                team_id_list.append(str(group.get("_id")))

            # find task by all group_id_list
            db_query = {"taskGroupId": {"$in": team_id_list}, "tags": {"$in": [tag_name]},
                        "process.nodes.members": user_id}

            result = self.db.find(db_query, sort=[('_id', -1)]).skip(page_size * (page_num - 1)).limit(page_size)
            result = [item for item in result]
            total_count = self.db.count(db_query)

            if result and total_count:
                return result, total_count
            else:
                return [], 0
        else:
            return result, total_count

    def get_all_willReceived_user_id_list_by_id(self, task_id=None, exit_task=None):
        rv = None
        if task_id:
            task_id = Utils.get_object_id(task_id)
            rv = [self.db.find_one({"_id": task_id})]

        if exit_task:
            rv = exit_task

        result = []

        if rv:
            for item in rv:
                creator = item.get("creator", None)
                executor = item.get("executor", None)
                executor = executor[0] if isinstance(executor, list) else executor

                result.append(creator)
                result.append(executor)

                process = item.get("process")
                if process and isinstance(process, dict):
                    nodes = process.get("nodes")
                    if nodes and isinstance(nodes, dict):
                        for node in nodes:
                            members = node.get("members", [])
                            result.append(members)

        return list(set(result))

    # add task comment by task id
    def add_comment_by_task_id(self, task_id, user_id, content):
        task_id = Utils.get_object_id(task_id)
        self.db.find_one_and_update({"_id": task_id}, {
            "$push": {"comment":
                {
                    "id": ObjectId(),
                    "userId": user_id,
                    "content": content,
                    "time": datetime.now()
                }
            }
        }, upsert=True)
        return True

    # get task comment by task id
    def get_comment_by_task_id(self, task_id):
        task_id = Utils.get_object_id(task_id)
        rv = self.db.find_one({"_id": task_id}, projection={"comment": 1})
        if rv:
            comment = rv.get("comment", [])
            if comment:
                all_user_map = User().get_all_user_map()
                for item in comment:
                    user_id = item.get("userId", None)
                    if user_id:
                        item["userInfo"] = all_user_map.get(user_id)
            else:
                rv["comment"] = []
        return rv if rv else []

    def remove_comment_by_task_id_comment_id(self, task_id, comment_id):
        task_id = Utils.get_object_id(task_id)
        comment_id = Utils.get_object_id(comment_id)

        rv = self.db.find_one({"_id": task_id}, projection={"comment": 1})

        if rv:
            task_comment = rv.get("comment", None)
            if task_comment:
                for index, comment_item in enumerate(task_comment):
                    comment_item_id = comment_item.get("id", None)
                    if comment_item_id and str(comment_item_id) == str(comment_id):
                        del task_comment[index]

            self.db.find_one_and_update({"_id": task_id}, {"$set": {"comment": task_comment}}, upsert=True)

    def mark_task_as_delete_by_taskGroupId(self, group_id_list):
        if not group_id_list:
            return False
        if isinstance(group_id_list, list):
            for group_id_item in group_id_list:
                if group_id_item:
                    self.db.update_one({"taskGroupId": str(group_id_item)}, {"$set": {"_isDelete": True}})
        else:
            self.db.update_one({"taskGroupId": str(group_id_list)}, {"$set": {"_isDelete": True}})
