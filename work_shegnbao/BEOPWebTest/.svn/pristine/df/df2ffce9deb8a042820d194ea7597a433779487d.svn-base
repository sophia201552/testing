__author__ = 'win7'
from beopWeb.MongoConnManager import MongoConnManager, g_table_workflow_team
from bson.objectid import ObjectId
from beopWeb.mod_admin.User import User
from beopWeb.mod_common.Utils import Utils
from datetime import datetime
from beopWeb.mod_common.Exceptions import *


class TeamMemberType:
    SUPER_ADMIN = 1
    ADMIN = 2
    MEMBER = 3


class FieldType:
    DEFAULT = 1
    CUSTOM = 2


class Team:
    def __init__(self):
        self.db = MongoConnManager.getConfigConn().mdbBb[g_table_workflow_team]

    def __create_default_tags(self):
        return [
            {
                'type': FieldType.DEFAULT,
                'name': 'fault'
            },
            {
                'type': FieldType.DEFAULT,
                'name': 'maintain'
            }
        ]

    def __create_default_process(self):
        return [
            {
                'name': 'Fault',
                'type': FieldType.DEFAULT,
                "template_id": "56d65435fecfda0318f63176",
                "nodes": [{
                    "behaviour": 1,
                    "arch_id": '6',
                    "node_type": 1
                }, {
                    "behaviour": 1,
                    "arch_id": '3',
                    "node_type": 1
                }]
            }
        ]

    def __wrap_custom_field(self, field_list):
        if not field_list or not isinstance(field_list, list):
            return []
        ret = []
        for item in field_list:
            if isinstance(item, dict):
                item.update({'type': FieldType.CUSTOM})
            elif isinstance(item, str):
                item = {
                    'name': item,
                    'type': FieldType.CUSTOM
                }
            ret.append(item)
        return ret

    # 给一个对象添加object_id,并且删除原来的id
    def __wrap_with_object_id(self, item):
        if not item or not isinstance(item, dict):
            return item
        item['_id'] = ObjectId()
        if item['id'] is not None:
            del item['id']

    # 处理团队数据
    def __wrap_team(self, team):
        if not team:
            return {}
        team['_id'] = str(team['_id'])
        # 团队架构中人员
        for arch_item in team.get('arch'):
            arch_item['members'] = Utils.user_id_list_to_detail(arch_item.get('members'))

        # 流程中的人员
        for process in team.get('process'):
            if process.get('nodes'):
                for node in process.get('nodes'):
                    if isinstance(node, dict):  # 防止保存了不合法类型的node
                        node['members'] = Utils.user_id_list_to_detail(node.get('members'))

        return team

    def __create_default_arch(self):
        return []

    def edit_team(self, name, desc, tags, team_arch, process, creator, team_id):
        if not name or not creator:
            raise InvalidTeam('名称或者创建人为空')

        # 标签
        if isinstance(tags, list):
            tags = self.__wrap_custom_field(tags)
        else:
            raise InvalidTeam('非法的标签')

        # 创建人
        user = User().query_user_by_id(creator, 'id')
        if not user:
            raise InvalidTeam('创建人不存在')

        # 工作流
        if isinstance(process, list):
            process = self.__wrap_custom_field(process)
            # 把 process 人物 详情对象 数组 转化为 人物 id 数组
            for process_item in process:
                is_new_process = process_item.get('isNewProcess')
                if is_new_process:
                    process_item['_id'] = ObjectId()
                    process_item.pop("isNewProcess")
                process_item['template_id'] = '56f13216e153db0248d3fb91'
                nodes = process_item.get('nodes')

                for node in nodes:
                    if node:
                        if node.get("_id"):
                            del node["_id"]
                        node['members'] = [member.get('id') for member in node.get('members') if member]
                    else:
                        node = {'members': []}
        else:
            raise InvalidTeam('非法的工作流')

        # 团队架构
        if not team_arch:
            team_arch = []
        else:
            # 把 team_arch 人物 详情对象 数组 转化为 人物 id 数组
            for arch_item in team_arch:
                if arch_item.get('members'):
                    arch_item['members'] = [member.get('id') for member in arch_item.get('members')]
                else:
                    arch_item['members'] = []

        team_result = {
            'name': name.strip(),
            'desc': desc.strip(),
            'tags': tags,
            'arch': team_arch,
            'creator': creator,
            'createTime': datetime.now(),
            'process': process
        }

        team = Team()
        return team.update_team(team_id, creator, team_result)

    def create_team(self, name, desc, tags, team_arch, process, creator):
        if not name or not creator:
            raise InvalidTeam('名称或者创建人为空')

        # 标签
        if isinstance(tags, list):
            tags = self.__wrap_custom_field(tags)
        else:
            raise InvalidTeam('非法的标签')

        # 创建人
        user = User().query_user_by_id(creator, 'id')
        if not user:
            raise InvalidTeam('创建人不存在')

        # 工作流
        if isinstance(process, list):
            process = self.__wrap_custom_field(process)
            # 把 process 人物 详情对象 数组 转化为 人物 id 数组
            for key in process:
                nodes = key.get('nodes')
                for node in nodes:
                    if node.get("_id"):
                        del node["_id"]
                    members = node.get('members')
                    if members:
                        members_list = []
                        for member in members:
                            members_list.append(member.get('id'))
                        node['members'] = members_list
        else:
            raise InvalidTeam('非法的工作流')

        # 团队架构
        if not team_arch:
            team_arch = []
        else:
            # 把 team_arch 人物 详情对象 数组 转化为 人物 id 数组
            for key in team_arch:
                members = key.get('members')
                if members:
                    members_list = []
                    for member in members:
                        members_list.append(member.get('id'))
                    key['members'] = members_list
                else:
                    key['members'] = []

        team = {
            'name': name.strip(),
            'desc': desc.strip() if desc else '',
            'tags': tags,
            'arch': team_arch,
            'creator': int(creator),
            'createTime': datetime.now(),
            'process': process
        }

        return self.db.insert_one(team)

    def get_process(self, team, process_id):
        if not team or not team.get('process'):
            return None
        for process in team.get('process'):
            if process_id == str(process.get('_id')):
                return process

    def save_team(self, team_id, team):
        pass

    def get_team_by_id(self, team_id):
        return self.__wrap_team(self.db.find_one({'_id': Utils.get_object_id(team_id)}))

    def get_team_by_user_id(self, user_id):
        # TODO 我们假装删除的team是找不到的
        return self.__wrap_team(self.db.find_one({'arch.members': user_id, "_isDelete": {"$ne": True}}))

    def get_team_user_title(self, user_id, team):
        if not team or not user_id:
            return -1, 0
        arch = team.get('arch')
        for item in arch:
            for member in item.get('members'):
                if user_id == member.get('id'):
                    return item.get('type'), item.get('name')
        return -1, 0

    def get_team_super_admin(self):
        pass

    def get_team_admin(self):
        pass

    def is_tag_in_team(self, tag_name):
        pass

    def user_has_team(self, user_id):
        return bool(self.db.find_one({'arch.members': int(user_id), "_isDelete": {"$ne": True}}))

    def exit_team(self, team_id, user_id):
        pass

    def is_team_member(self, user_id, team, member_type):
        return user_id in self.get_member_map_from_arch(team, member_type)

    def get_member_map_from_arch(self, team, member_type):
        member_list = self.get_member_list_from_arch(team, member_type)
        return {user.get('id'): user for user in member_list}

    def get_member_list_from_arch(self, team, member_type):
        arch = team.get('arch')
        member_list = []
        if not arch:
            return member_list
        for item in arch:
            if str(item.get('type')) == str(member_type):
                member_list += item.get('members')
        return member_list

    def delete_team(self, team_id, user_id):
        if not team_id or not user_id:
            return False
        team = self.get_team_by_id(team_id)
        if not team:
            return False

        if not self.is_team_member(user_id, team, TeamMemberType.SUPER_ADMIN):
            raise NoPermission('only super admin can delete the team.')
        # TODO 假装删除
        from beopWeb.mod_workflow.TaskGroup import TaskGroup
        from beopWeb.mod_workflow.Task import Task
        from beopWeb.mod_message import Message

        task = Task()
        tg = TaskGroup()
        message = Message()
        task_group_id_list = tg.get_task_group_by_team_id(team_id)

        if task_group_id_list:
            task_group_id_list = [item for item in task_group_id_list]
            task_group_id_list = [item.get("_id") for item in task_group_id_list]

        tg.mark_task_group_delete_by_teamId(team_id)
        task.mark_task_as_delete_by_taskGroupId(task_group_id_list)
        message.delete_all_msg_by_taskGroupId(task_group_id_list)
        self.db.update_one({'_id': Utils.get_object_id(team_id)}, {"$set": {"_isDelete": True}}, upsert=True)
        return True
        # return self.db.remove({'_id': Utils.get_object_id(team_id)})

    def quite_team(self, team_id, user_id):
        if not team_id or not user_id:
            return False

        return self.db.update_many({'_id': Utils.get_object_id(team_id)}, {"$pull": {'arch': {'members': user_id}}})

    def update_team(self, team_id, user_id, new_team):
        if not team_id or not user_id:
            return False
        team = self.get_team_by_id(team_id)
        if not team:
            return False

        if not self.is_team_member(user_id, team, TeamMemberType.SUPER_ADMIN) \
                and not self.is_team_member(user_id, team, TeamMemberType.ADMIN):
            raise NoPermission('only admin can update the team.')
        team.update(new_team)
        del team["_id"]
        return self.db.update_one({'_id': Utils.get_object_id(team_id)}, {"$set": team})

    # 获取任务组里面 process
    # process all arch members 获取当前任务组所在process 所有的arch member
    def get_process_and_all_archMembers_by_team_id_by_process_id_list(self, team_id, process_id_list):
        team = self.db.find_one({"_id": ObjectId(team_id)})
        result = []
        utils = Utils()
        all_arch_member = []
        if team:
            process = team.get('process')
            for process_item in process:
                if process_item.get('_id') in process_id_list:
                    result.append(process_item)
                    for node in process_item.get('nodes'):
                        all_arch_member.append(self.get_member_by_arch_id_in_team(utils, team, node.get("arch_id")))
            return result, all_arch_member
        else:
            return result, all_arch_member

    def get_member_by_arch_id_in_team(self, utils, team, arch_id):
        for key in team.get("arch"):
            if key.get("id") == arch_id:
                arch = key.copy()
                arch["members"] = utils.user_id_list_to_detail(key.get("members"))
                return arch

    def get_team_all_user_id_list_by_team_id(self, team_id):
        user_id_list = []
        if not isinstance(team_id, ObjectId):
            team_id = ObjectId(str(team_id))
            result = self.db.find_one({"_id": team_id})
            if result:
                arch = result.get("arch")
                for arch_item in arch:
                    user_id_list += arch_item.get("members")
        return user_id_list

    def get_user_exclude_team_group(self, result):
        rv = []
        for user_info in result:
            data = self.db.find_one({"arch.members": {"$in": [user_info.get('id')]}, "_isDelete": {"$ne": True}})
            if data is None:
                rv.append(user_info)
        return rv
