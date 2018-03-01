__author__ = 'win7'
from beopWeb.MongoConnManager import MongoConnManager, g_table_workflow_team
from bson.objectid import ObjectId
from beopWeb.mod_admin.User import User
from beopWeb.mod_common.Utils import Utils
from datetime import datetime
from beopWeb.mod_common.Exceptions import *
from beopWeb.mod_workflow.Constants import TeamMemberType, FieldType, ArchType, NodeBehaviour, TemplateMap


class Team:
    def __init__(self):
        self.db = MongoConnManager.getConfigConn().mdbBb[g_table_workflow_team]

    # 默认团队Tags
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

    # 默认流程信息
    def get_default_process_model(self):
        return {
            '_id': ObjectId(),
            'type': FieldType.DEFAULT,
            "template_id": TemplateMap.DEFAULT_TEMPLATE_ID,
            "nodes": [{
                "behaviour": NodeBehaviour.EXECUTE,
                "arch_type": ArchType.ALL_MEMBERS
            }, {
                "behaviour": NodeBehaviour.VERIFY,
                "arch_type": ArchType.ALL_MEMBERS
            }]
        }

    # 封装团队字段
    def __wrap_custom_field(self, field_list):
        if not field_list or not isinstance(field_list, list):
            return []
        ret = []
        for item in field_list:
            if isinstance(item, str):
                item = {
                    'name': item,
                    'type': FieldType.CUSTOM
                }
            if isinstance(item, dict) and item.get('type') is None:
                item.update({'type': FieldType.CUSTOM})
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
        user_map = User().get_all_user_map()
        arch_map = {}
        all_members = []
        # 团队架构中人员
        for arch_item in team.get('arch'):
            members_detail = []
            for member_id in arch_item.get('members'):
                members_detail.append(user_map.get(member_id))
            arch_item['members'] = members_detail
            all_members += members_detail
            if arch_item.get('id'):
                arch_map[arch_item.get('id')] = members_detail

        all_members_map = {}
        for member in all_members:
            if not member:
                continue
            all_members_map[member.get('id')] = member
        all_members = list(all_members_map.values())

        # 流程中的人员
        for process in team.get('process'):
            if not process.get('nodes'):
                continue

            for node in process.get('nodes'):
                if not node or not isinstance(node, dict):
                    continue
                if not node.get('members'):
                    if node.get('archType') == 4:  # 全体人员
                        node['members'] = all_members
                    else:
                        node['members'] = arch_map.get(node.get('arch_id'))
                else:
                    if node.get('archType') == 4:
                        node['members'] = all_members
                    else:
                        members_detail = []
                        for member_id in node.get('members', []):
                            members_detail.append(user_map.get(member_id))
                        node['members'] = members_detail

        return team

    def __create_default_arch(self):
        return []

    def edit_team(self, name, desc, tags, team_arch, process, creator, team_id):
        if not name or not creator:
            raise InvalidTeam('Name or Creator is empty.')

        # 标签
        if isinstance(tags, list):
            tags = self.__wrap_custom_field(tags)

        # 创建人
        user = User().query_user_by_id(creator, 'id')
        if not user:
            raise InvalidTeam('Creator is not existed.')

        # 工作流
        if isinstance(process, list):
            process = self.__wrap_custom_field(process)
            # 把 process 人物 详情对象 数组 转化为 人物 id 数组
            for process_item in process:
                if not process_item.get('template_id'):
                    process_item['template_id'] = TemplateMap.DEFAULT_TEMPLATE_ID
                nodes = process_item.get('nodes')

                for node in nodes:
                    if not node or not node.get('members'):
                        continue
                    node['members'] = [member.get('id') if (member and isinstance(member, dict)) else member for member
                                       in node.get('members')]
        else:
            raise InvalidTeam('invalid process.')

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
            raise InvalidTeam('Name or Creator is empty.')

        # 标签
        if isinstance(tags, list):
            tags = self.__wrap_custom_field(tags)

        # 创建人
        user = User().query_user_by_id(creator, 'id')
        if not user:
            raise InvalidTeam('Creator is not existed.')

        # 工作流
        if isinstance(process, list):
            process = self.__wrap_custom_field(process)
            # 把 process 人物 详情对象 数组 转化为 人物 id 数组
            for key in process:
                nodes = key.get('nodes')
                for node in nodes:
                    if not node.get('members'):
                        continue
                    members_list = []
                    for member in node.get('members'):
                        members_list.append(int(member.get('id')))
                    node['members'] = members_list
        else:
            raise InvalidTeam('Invalid process.')

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
                        members_list.append(int(member.get('id')))
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
        '''
        获取团队流程

        :param team: 团队信息
        :param process_id: 流程ID
        :return: 流程信息
        '''
        for process in team.get('process'):
            if process_id == str(process.get('_id')):
                return process

    def get_default_process(self, team):
        '''
        获取默认流程

        :param team: 团队信息
        :return: 默认流程信息
        '''
        for process in team.get('process'):
            if process.get('type') == FieldType.DEFAULT:
                return process
        return {}

    def add_process(self, team_id, process):
        '''
        添加流程

        :param team_id: 团队ID
        :param process: 流程信息
        :return: 添加的流程
        '''
        self.db.update_one({'_id': Utils.get_object_id(team_id)}, {'$push': {'process': process}})
        return process

    def get_team_by_id(self, team_id):
        '''
        根据ID获取团队信息

        :param team_id: 团队ID
        :return: 团队信息
        '''
        return self.__wrap_team(self.db.find_one({'_id': Utils.get_object_id(team_id)}))

    def get_raw_team_by_id(self, team_id):
        '''
        根据ID获取原始团队信息

        :param team_id: 团队ID
        :return: 原始团队信息
        '''
        return self.db.find_one({'_id': Utils.get_object_id(team_id)})

    def get_team_by_user_id(self, user_id):
        '''
        根据用户ID获取用户所在团队

        :param user_id: 用户ID
        :return: 团队信息
        '''
        # TODO 我们假装删除的team是找不到的
        return self.__wrap_team(self.db.find_one({'arch.members': user_id}))

    def get_raw_team_by_user_id(self, user_id):
        '''
        根据用户信息获取用户所在团队原始信息

        :param user_id: 用户ID
        :return: 团队信息
        '''
        return self.db.find_one({'arch.members': user_id})

    def get_team_user_title(self, user_id, team):
        '''
        获取用户在团队中的组的名称及类型

        :param user_id: 用户ID
        :param team: 团队信息
        :return: 组类型及组名称
        '''
        if not team or not user_id:
            return -1, 0
        arch = team.get('arch')
        for item in arch:
            for member in item.get('members'):
                if not member:
                    continue
                if user_id == member.get('id'):
                    return item.get('type'), item.get('name')
        return -1, 0

    def user_has_team(self, user_id):
        '''
        检测用户是否拥有团队

        :param user_id: 用户ID
        :return: True 用户在某个团队中; False 用户不在某个团队中
        '''
        return bool(self.db.find_one({'arch.members': int(user_id), "_isDelete": {"$ne": True}}))

    def is_team_member(self, user_id, team, member_type):
        '''
        检测用户是否为团队某组成员

        :param user_id: 用户ID
        :param team: 团队信息
        :param member_type: 组类型
        :return: True 是团队某组成员; False 不是团队某组成员
        '''
        return user_id in self.get_member_map_from_arch(team, member_type)

    def get_member_map_from_arch(self, team, member_type):
        '''
        从团队中获取用户映射

        :param team: 团队
        :param member_type: 成员类型
        :return: 用户信息映射
        '''
        member_list = self.get_member_list_from_arch(team, member_type)
        return {user.get('id'): user for user in member_list}

    def get_member_list_from_arch(self, team, member_type):
        '''
        获取用户列表

        :param team: 团队信息
        :param member_type: 用户类型
        :return: 用户列表
        '''
        arch = team.get('arch')
        member_list = []
        if not arch:
            return member_list
        for item in arch:
            if str(item.get('type')) == str(member_type):
                member_list += item.get('members')
        return member_list

    def delete_team(self, team_id, user_id):
        '''
        删除一个团队. 需要根据user_id判断是否有权限删除.

        :param team_id: 团队ID
        :param user_id: 操作者ID
        :return: True 删除成功; False 删除失败
        '''
        if not team_id or not user_id:
            return False
        team = self.get_team_by_id(team_id)
        if not team:
            return False

        if not self.is_team_member(user_id, team, TeamMemberType.SUPER_ADMIN):
            raise NoPermission('only super admin can delete the team.')

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
        self.db.update_one({'_id': Utils.get_object_id(team_id)}, {"$set": {"_isDelete": True}})
        return True

    def quite_team(self, team_id, user_id):
        '''
        退出一个团队. 将用户的ID从团队中删除

        :param team_id: 团队ID
        :param user_id: 用户ID
        :return: mongodb操作结果
        '''
        if not team_id or not user_id:
            return False
        team = self.get_raw_team_by_id(team_id)
        for arch in team.get('arch'):
            try:
                arch.get('members').remove(user_id)
            except Exception as e:
                pass

        return self.db.update_many({'_id': Utils.get_object_id(team_id)}, {"$set": {'arch': team.get('arch')}})

    def update_team(self, team_id, user_id, new_team):
        '''
        更新团队信息

        :param team_id: 团队ID
        :param user_id: 操作者ID
        :param new_team: 新的团队信息
        :return: mongodb操作结果
        '''
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
        all_arch_member = []
        if not team:
            return result, all_arch_member

        process = team.get('process')
        for process_item in process:
            if process_id_list and process_item.get('_id') in process_id_list:
                result.append(process_item)
                for node in process_item.get('nodes'):
                    all_arch_member.append(self.get_member_by_arch_id_in_team(team, node.get("arch_id")))
        return result, all_arch_member

    def get_member_by_arch_id_in_team(self, team, arch_id):
        '''
        根据团队人员结构ID获取成员

        :param team: 团队信息
        :param arch_id: 人员结构ID
        :return: 成员列表
        '''
        user_map = User().get_all_user_map()
        for key in team.get("arch"):
            if key.get("id") == arch_id:
                arch = key.copy()

                members_detail = []
                for member_id in arch.get('members'):
                    members_detail.append(user_map.get(member_id))
                arch['members'] = members_detail
                return arch

    def get_all_user_ids_by_team_id(self, team_id):
        '''
        获取所有的团队成员

        :param team_id: 团队ID
        :return: 成员列表
        '''
        ids = []
        if not isinstance(team_id, ObjectId):
            team_id = ObjectId(str(team_id))
        team = self.db.find_one({"_id": team_id})
        if not team:
            return ids
        arch = team.get("arch")
        for arch_item in arch:
            ids += arch_item.get("members")
        return list(set(ids))
