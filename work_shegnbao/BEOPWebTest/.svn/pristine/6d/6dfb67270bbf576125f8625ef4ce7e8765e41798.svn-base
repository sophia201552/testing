__author__ = 'win7'
from beopWeb.MongoConnManager import MongoConnManager, g_table_workflow_task
from beopWeb.mod_workflow.TaskGroup import TaskGroup
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_admin.User import User
from beopWeb.mod_workflow.Team import Team
from datetime import datetime
from bson import ObjectId


class TaskStatus:
    NEW = 0
    PROCESSING = 1
    END = 2


class TaskAction:
    PASS = 'pass'
    COMPLETE = 'complete'
    NO_PASS = 'noPass'


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
        if task:
            process = task.get('process')
            if process and process.get('nodes'):
                for node in process.get('nodes'):
                    if node.get('members') and len(node.get('members')) > 0:
                        node['members'] = User().get_user_list_info(node['members'])
                    else:
                        arch_list = TaskGroup().get_group_arch_by_id(task.get('taskGroupId'), node.get('arch_id'))
                        node['members'] = User().get_user_list_info(arch_list)
        return task

    def get_raw_task(self):
        return self.db.find_one({'_id': self.task_id})

    def task_action(self, action, next_user_id=None, note=None):
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

        if action == TaskAction.NO_PASS:
            task['status'] = TaskStatus.END
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

        return self.update_task(task)

    def update_task(self, task):
        try:
            del task['_id']
        except Exception as e:
            pass
        return self.db.update_one({'_id': self.task_id}, {'$set': task})

    def save_task(self, task):
        return self.db.save(task)

    def get_tasks(self, task_status, user_id, offset, size):
        return self.get_tasks_by_status(task_status, user_id, offset, size)

    def get_working_tasks(self, user_id, offset, size):
        return self.get_tasks_by_status({'$lte': TaskStatus.PROCESSING}, user_id, offset, size)

    def get_joined_tasks(self, user_id, offset, size):
        return self.get_user_all_tasks(user_id, offset, size)

    def get_history_complete_tasks(self, user_id, offset, size):
        return self.get_tasks_by_status({'$lte': TaskStatus.END}, user_id, offset, size)

    def get_user_all_tasks(self, user_id, offset, size):
        result = self.db.find({"process.nodes.members": {"$in": [user_id]}})
        return [item for item in result] if result else []

    def delete_task(self):
        return self.db.delete_one({'_id': self.task_id}).deleted_count

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
                item["creator_info"] = creator

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

    def task_count_by_group_id(self, group_id):
        return self.db.count({"taskGroupId": group_id})

    def get_by_group_id(self, group_id, page_num, page_size):
        result = self.db.find({"taskGroupId": group_id}).skip(page_size * (page_num - 1)).limit(page_size)
        return [item for item in result]

    # 通过一个 group_id_list 去拿到所有的 task 和对应的数量,并进行分页
    def get_by_group_id_list(self, group_id_list, page_num, page_size):
        return self.task_filter({"taskGroupId": {"$in": group_id_list}, "_isDelete": {"$ne": True}}, None, page_num,
                                page_size)

    def task_filter(self, task_filter, task_projection=None, page_num=None, page_size=None):
        if task_projection:
            result = self.db.find(task_filter, task_projection)
        else:
            result = self.db.find(task_filter)
        if page_size:
            result = result.skip(page_size * (page_num - 1)).limit(page_size)
        count = self.db.count(task_filter)

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
            db_query = {"taskGroupId": {"$in": team_id_list}, "tags": {"$in": [tag_name]}}

            result = self.db.find(db_query).skip(page_size * (page_num - 1)).limit(page_size)
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
        if group_id_list:
            if (isinstance(group_id_list, list)):
                for group_id_item in group_id_list:
                    self.db.update_many({"taskGroupId": str(group_id_item)}, {"$set": {"_isDelete": True}}, upsert=True)
            else:
                self.db.update_one({"taskGroupId": str(group_id_list)}, {"$set": {"_isDelete": True}}, upsert=True)
