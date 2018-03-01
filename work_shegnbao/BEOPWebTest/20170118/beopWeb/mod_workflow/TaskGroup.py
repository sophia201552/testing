__author__ = 'win7'
from beopWeb.MongoConnManager import MongoConnManager, g_table_workflow_task_group
from bson import ObjectId
from .Team import Team
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_admin.User import User
from datetime import datetime
from beopWeb.mod_workflow.Constants import FieldType


class TaskGroup:
    def __init__(self):
        self.db = MongoConnManager.getConfigConn().mdbBb[g_table_workflow_task_group]

    def delete(self, doc):
        return self.db.delete_many(doc).deleted_count

    def get_one_by_filter(self, filter):
        return self.db.find_one(filter)

    def get_task_group_by_user_id(self, user_id, group_id=None):
        # 如果是删除的任务组不给显示出来
        found_team = Team().get_raw_team_by_user_id(user_id)

        if group_id:
            query = {'_id': Utils.get_object_id(group_id)}
        else:
            query = {'$or': [{"arch.members": user_id}, {'creator': user_id}, {'oldMembers': user_id},
                             {'type': FieldType.DEFAULT}],
                     "_isDelete": {"$ne": True}, "team_id": str(found_team.get('_id'))}
        groups = self.db.find(query)
        ret = []
        # 检查是否有默认组
        has_default_group = False
        for group in groups:
            if group.get('type') == FieldType.DEFAULT:
                has_default_group = True
            ret.append(group)
        if not has_default_group:
            ret.append(self.get_default_group(str(found_team.get('_id'))))
        return ret

    def mark_task_group_delete_by_teamId(self, team_id):
        self.db.update_many({"team_id": str(team_id)}, {"$set": {"_isDelete": True}})

    def get_task_group_count_by_user_id(self, user_id):
        return self.db.count({"arch.members": user_id})

    def get_group_name_by_id(self, id):
        if not id:
            return ""
        result = self.db.find_one({"_id": Utils.get_object_id(id)})
        return result.get('name', '') if result else ""

    def get_raw_group_by_id(self, group_id):
        if not group_id:
            return None
        return self.db.find_one({"_id": Utils.get_object_id(group_id)})

    def get_task_group_by_id(self, id):
        if not id or not ObjectId.is_valid(id):
            return None
        result = self.db.find_one({"_id": ObjectId(id)})
        if result:
            user = User()
            team_id = result.get("team_id")
            team = Team()
            creator_id = result.get("creator")
            result["creator"] = user.query_user_by_id(creator_id, 'userfullname', 'useremail', 'id', 'userpic')
            process = result.get("process")

            # process 获取当前任务组的process详情和process对于的arch所有的成员
            current_process, all_arch_member = team.get_process_and_all_archMembers_by_team_id_by_process_id_list(
                team_id, process)
            result["process"] = current_process
            result["archAll"] = all_arch_member

            # process member
            user_map = User().get_all_user_map()
            process = result.get("process")
            for key in process:
                nodes = key.get('nodes')
                for node in nodes:
                    if not node or not node.get('members'):
                        continue
                    members_detail = []
                    for member_id in node.get('members'):
                        members_detail.append(user_map.get(member_id))
                    node['members'] = members_detail

            # now arch members 获取当前任务组已经选择的arch member
            if result.get('arch'):
                for arch_item in result.get('arch'):
                    members = arch_item.get("members")
                    if not members:
                        continue
                    members_detail = []
                    for member_id in arch_item.get('members'):
                        members_detail.append(user_map.get(member_id))
                    arch_item['members'] = members_detail
                result["_id"] = str(result.get('_id'))
            return result
        else:
            return None

    def save_task_group(self, data):
        group = self.db.save(data)
        return group if group else None

    def get_group_arch_by_id(self, group_id, arch_id):
        if not group_id:
            return []
        group = self.db.find_one({'_id': Utils.get_object_id(group_id)})
        if group:
            for arch in group.get('arch'):
                if arch.get('id') == arch_id:
                    return arch.get('members')
        return []

    def get_arch_ids_by_user_id(self, user_id):
        user_id = int(user_id)
        result = self.db.find({'arch.members': user_id})
        result = [item for item in result]
        arch_ids = []
        for item in result:
            arch_list = item.get('arch')
            for arch in arch_list:
                if user_id in arch.get('members'):
                    arch_ids.append(arch.get('id'))
        return arch_ids

    def edit_task_group(self, id, data):
        group = self.db.update_one({"_id": ObjectId(id)}, {"$set": data})
        return True if group.modified_count == 1 else False

    def delete_task_group(self, id, user_id):
        task_group = self.db.find_one({"_id": ObjectId(id)})
        msg = ""
        if task_group:
            creator = task_group.get("creator")
            if creator and str(creator) == str(user_id):
                # TODO 任务组删除后 *假装删除* 相关的所有工单
                result = self.db.update_one({"_id": ObjectId(id)}, {"$set": {"_isDelete": True}}, upsert=True)
                if result:
                    try:
                        from beopWeb.mod_workflow.Task import Task
                        from beopWeb.mod_message.message import Message

                        task = Task()
                        message = Message()
                        task.mark_task_as_delete_by_taskGroupId(id)
                        message.delete_all_msg_by_taskGroupId(id)
                    except Exception as e:
                        # 如果报错就回复没有删除的状态
                        self.db.update_one({"_id": ObjectId(id)}, {"$unset": {'_isDelete': 1}})
                        msg = "set task group delete  failed"
                        return False, msg
                    return True, msg
                else:
                    msg = "delete task group failed"
                    return False, msg
            else:
                msg = 'you do not have permission!'
                return False, msg
        else:
            msg = "task group is not exits"
            return False, msg

    def quite_all_team_group(self, team_id, user_id):
        if not team_id or not user_id:
            return False

        return self.db.update_many({'team_id': Utils.get_object_id(team_id)}, {'$pull': {'arch': {'members': user_id}}})

    def quite_group(self, group_id, user_id):
        if not group_id or not user_id:
            return False

        return self.db.update_many({'_id': Utils.get_object_id(group_id)}, {{'$pull': {"arch": {'members': user_id}}}})

    def get_task_group_by_team_id(self, team_id):
        return self.db.find({"team_id": team_id})

    def get_default_group(self, team_id):
        default_group = self.db.find_one({'type': FieldType.DEFAULT, "team_id": team_id})
        if not default_group:
            team = Team()
            found_team = team.get_team_by_id(team_id)
            default_process = team.get_default_process(found_team)
            default_group = {
                "_id": ObjectId(),
                "createTime": datetime.now(),
                "creator": 1,
                "team_id": team_id,
                "arch": [],
                "type": FieldType.DEFAULT,
                "process": [default_process.get('_id')] if default_process else []
            }
            self.save_task_group(default_group)
        return default_group
