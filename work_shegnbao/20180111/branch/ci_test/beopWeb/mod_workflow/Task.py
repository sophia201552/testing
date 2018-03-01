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
from beopWeb.mod_workflow.Constants import ArchType


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
        '''
        根据工单ID获取工单

        :param task_id: 工单ID
        :return: 工单信息
        '''
        self.task_id = Utils.get_object_id(task_id)
        return self.get_task()

    def get_task(self):
        '''
        获取工单详细信息

        :return: 工单详细信息
        '''
        task = self.get_raw_task()
        if not task:
            return None
        process = task.get('process')
        team = None
        if task.get('teamId'):
            team = Team().get_team_by_id(task.get('teamId'))
        if process and process.get('nodes'):
            raw_processes = team.get('process')
            raw_process = None
            for p in raw_processes:
                if p.get('_id') == process.get('_id'):
                    raw_process = p

            for node_index, node in enumerate(process.get('nodes')):
                try:
                    if node_index >= task.get('node_index') and raw_process:
                        node['candidate'] = User().get_user_list_info(
                            raw_process.get('nodes')[task.get('node_index')].get('members'))
                except Exception as e:
                    logging.error('查询工单节点候选人员失败:' + str(e))
                if node.get('archType') == ArchType.ALL_MEMBERS and len(node.get('members')) == 0 and team:  # 全体人员
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

    def get_raw_task(self, fault_image=False):
        '''
        获取原始工单信息; 参数fault_image在邮件中会用到, 页面无需使用.

        :param fault_image: 是否返回故障曲线image
        :return:
        '''
        query = {'_id': self.task_id}
        if fault_image:
            projection = None
        else:
            projection = {'faultImage': False}

        return self.db.find_one(query, projection)

    def change_current_node_member(self, members):
        '''
        修改当前任务执行节点人员

        :param members: 人员列表
        :return: True 更新成功; False 更新失败
        '''
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
        '''
        完成任务

        :return: True 更新成功; False 更新失败
        '''
        task = self.get_raw_task()
        if not task:
            return False
        task['status'] = TaskStatus.END
        task['finishTime'] = datetime.now()
        return self.update_task(task)

    def task_action(self, user_id, action, next_user_id=None, note=None):
        '''
        处理工单动作

        :param user_id: 操作者ID
        :param action: 处理动作
        :param next_user_id: 下一个节点用户ID
        :param note: 注释
        :return: 工单ID 处理成功; False 处理失败
        '''
        task = self.get_raw_task(fault_image=True)
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
                    'dueDate': task['fields'].get('dueDate'),
                    'faultImage': task.get('faultImage'),
                    'zone': task['fields'].get('diagnosisZone'),
                    'equipment': task['fields'].get('diagnosisEquipmentName')
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
        '''
        设置诊断反馈状态

        :param task: 诊断任务
        :param status: 状态
        '''
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
        '''
        保存工单信息

        :param task: 工单信息
        :return: mongodb更新返回
        '''
        return self.db.save(task)

    def save_tasks(self, tasks):
        '''
        保存工单列表信息

        :param tasks: 工单列表
        :return: mongodb更新返回
        '''
        return self.db.insert_many(tasks)

    def delete_task(self):
        '''
        删除工单信息

        :return: mongodb更新返回
        '''
        return self.db.delete_one({'_id': self.task_id}).deleted_count

    def delete_tasks(self, filter):
        '''
        删除多个工单

        :param filter: 删除条件
        :return: mongodb更新返回
        '''
        return self.db.delete_many(filter).deleted_count

    def delete_one_task(self):
        '''
        删除一个工单

        :return: mongodb更新返回
        '''
        return self.db.update_one({'_id': self.task_id}, {"$set": {"_isDelete": True}})

    def wrap_task_list(self, task_list):
        '''

        :param task_list:
        :return:
        '''
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
                # 创建人信息
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
            # 工单组信息
            group = tg.get_task_group_by_id(item.get('taskGroupId'))
            if group:
                item['groupName'] = group.get('name')

    def task_filter(self, task_filter, task_projection=None, page_num=None, page_size=None, order=None):
        '''
        工单筛选

        :param task_filter: 筛选条件
        :param task_projection: 返回内容
        :param page_num: 第几页
        :param page_size: 每页多少项
        :param order: 排序
        :return: 工单列表
        '''
        if task_filter.get('createTime') is not None:
            task_filter['createTime'].update(
                {'$gt': datetime.strptime(task_filter['createTime']['$gt'], '%Y-%m-%d %H:%M:%S'),
                 '$lt': datetime.strptime(task_filter['createTime']['$lt'], '%Y-%m-%d %H:%M:%S')})
        if not task_filter:
            return [], 0

        if not task_projection:
            task_projection = {'faultImage': False}
        else:
            task_projection.update({'faultImage': False})

        if order:
            tup = (order[0], order[1])
            result = self.db.find(task_filter, task_projection, sort=[tup])
        else:
            result = self.db.find(task_filter, task_projection, sort=[('createTime', -1)])

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
                task['executorInfo'] = executor

        return task_list, count

    def get_all_willReceived_user_id_list_by_id(self, task_id=None, exit_task=None):
        '''
        获取工单中的消息接收者

        :param task_id: 工单ID
        :param exit_task: 工单信息 可选
        :return: 接收者ID列表
        '''
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
        '''
        添加工单评论

        :param task_id: 工单ID
        :param user_id: 添加人ID
        :param content: 评论内容
        :return: True 添加成功; False 添加失败
        '''
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
        '''
        获取工单的评论

        :param task_id: 工单ID
        :return: 评论列表
        '''
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
        '''
        删除工单评论

        :param task_id: 工单ID
        :param comment_id: 评论ID
        :return: True 删除成功; False 删除失败
        '''
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
        '''
        删除一个组的工单

        :param group_id_list: 工单组ID列表
        :return: True 删除成功; False 删除失败
        '''
        if not group_id_list:
            return False
        if isinstance(group_id_list, list):
            for group_id_item in group_id_list:
                if group_id_item:
                    self.db.update_one({"taskGroupId": str(group_id_item)}, {"$set": {"_isDelete": True}})
        else:
            self.db.update_one({"taskGroupId": str(group_id_list)}, {"$set": {"_isDelete": True}})
