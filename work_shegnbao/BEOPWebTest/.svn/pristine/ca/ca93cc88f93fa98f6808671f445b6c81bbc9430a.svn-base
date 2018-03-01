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
            for key in process:
                nodes = key.get('nodes')

                for node in nodes:
                    if node:
                        node['members'] = [member.get('id') for member in node.get('members') if member]
                    else:
                        node['members'] = []
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
            'desc': desc.strip(),
            'tags': tags,
            'arch': team_arch,
            'creator': int(creator),
            'createTime': datetime.now(),
            'process': process
        }

        return self.db.insert_one(team)

    def get_process(self, team, process_id):
        for process in team.get('process'):
            if process_id == process.get('_id'):
                return process

    def save_team(self, team_id, team):
        pass

    def get_team_by_id(self, team_id):
        return self.__wrap_team(self.db.find_one({'_id': Utils.get_object_id(team_id)}))

    def get_team_by_user_id(self, user_id):
        return self.__wrap_team(self.db.find_one({'arch.members': user_id}))

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

        pass

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

        return self.db.remove({'_id': Utils.get_object_id(team_id)})

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
