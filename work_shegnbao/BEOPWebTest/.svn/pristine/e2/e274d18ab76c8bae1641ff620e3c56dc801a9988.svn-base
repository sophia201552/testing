import re

from .UserRoleGroup import UserRoleGroup
from beopWeb.mod_common.Exceptions import NoGrantedToPermissionGroup, NoDefinedPermissionGroup


class BeOPPermission:
    # 用户角色组表
    userGroupTable = {
        1: {
            'name': 'BeOP User Roles',
            'roles': ['BSCode', 'BSData', 'BSDocument', 'DTUser', 'DataOperator', 'DTSever', 'WFUser',
                      'WFManager', 'WFAdmin', 'PWikiUser', 'WikiAdmin', 'BGeneralUser', 'BEngineer', 'BManager',
                      'BAdmin', 'BRoot']
        },
        2: {
            'name': 'Direct Customer User Roles',
            'roles': ['DCROnly', 'DCDataAnalyst', 'DCEngineer', 'DCAdmin']
        },
        3: {
            'name': 'Shakedown Test Customer User Roles',
            'roles': ['SCROnly', 'SCDataAnalyst', 'SCWFEngineer', 'SCDEngineer', 'SCManager', 'SCAdmin']
        }
    }

    # 角色权限表
    rawRoleTable = {
        1: {
            'name': 'BSCode',
            'permission': ['CodeMaintenance', 'ServerMaintenance', 'PostCode']
        },
        2: {
            'name': 'BSData',
            'permission': ['FDataConnect', 'ADataConnect']
        },
        3: {
            'name': 'BSDocument',
            'permission': ['OSSManagement', 'WFFileManagement']
        },
        4: {
            'name': 'DTUser',
            'permission': ['RTDataMonitoring', 'FDataProcess', 'DataConnect']
        },
        5: {
            'name': 'DataOperator',
            'permission': ['CPProcess', 'DTUser']
        },
        6: {
            'name': 'DTSever',
            'permission': ['SetServer', 'ViewServer', 'CoreManagement', 'RWSonsite', 'DataOperator', 'DTUser']
        },
        7: {
            'name': 'WFUser',
            'permission': ['CPage', 'DPage', 'Epage']
        },
        8: {
            'name': 'WFManager',
            'permission': ['APProject', 'CreateProject', 'DeleteProject', 'WFUser']
        },
        9: {
            'name': 'WFAdmin',
            'permission': ['WFRManagement', 'RRublishProject', 'WFManger']
        },
        10: {
            'name': 'PWikiUser',
            'permission': ['RWikiOProject', 'WWikiOProject']
        },
        11: {
            'name': 'WikiAdmin',
            'permission': ['BWikiRead', 'BWikiWrite', 'PWikiUser']
        },
        12: {
            'name': 'BGeneralUser',
            'permission': ['RDashboard', 'WorkOrder', 'PWikiUser', 'RReport', 'DReport', 'ReportPushSet']
        },
        13: {
            'name': 'BEngineer',
            'permission': ['DAnalysis', 'MShare', 'RTDataView', 'DBWrite', 'Html Write Value', 'RReport', 'DReport',
                           'ReportPushSet', 'PWikiUser', 'BGeneralUser', 'WFUser', 'TeamSet']
        },
        14: {
            'name': 'BManager',
            'permission': ['SOPermissions', 'MOAccount', 'StandardSet', 'InviteUser', 'Benchmark',
                           'ProjectVSet', 'PWikiUser', 'BEngineer']
        },
        15: {
            'name': 'BAdmin',
            'permission': ['WikiAdmin', 'BManager']
        },
        16: {
            'name': 'DCROnly',
            'permission': ['RDashboard']
        },
        17: {
            'name': 'DCDataAnalyst',
            'permission': ['DAnalysis', 'MShare', 'RTDataView', 'DCROnly', 'RReport', 'DReport', 'ReportPushSet',
                           'Benchmark', 'ProjectVSet', 'WorkOrder', 'PWikiUser']
        },
        18: {
            'name': 'DCEngineer',
            'permission': ['DBWrite', 'DCDataAnalyst']
        },
        19: {
            'name': 'DCAdmin',
            'permission': ['TeamSet', 'SOPermissions', 'MOAccount', 'RReport', 'DReport', 'ReportPushSet', 'Benchmark',
                           'ProjectVSet', 'StandardSet', 'DCEngineer', 'DCGrant']
        },
        20: {
            'name': 'SCROnly',
            'permission': ['RDashboard']
        },
        21: {
            'name': 'SCDataAnalyst',
            'permission': ['DAnalysis', 'MShare', 'RTDataView', 'SCROnly', 'RReport', 'DReport', 'ReportPushSet',
                           'Benchmark', 'ProjectVSet', 'WorkOrder', 'PWikiUser']
        },
        22: {
            'name': 'SCWFEngineer',
            'permission': ['DBWrite', 'WFUser', 'SCDataAnalyst']
        },
        23: {
            'name': 'SCDEngineer',
            'permission': ['BSData', 'DTSever']
        },
        24: {
            'name': 'SCManager',
            'permission': ['TeamSet', 'SOPermissions', 'MOAccount', 'Benchmark', 'ProjectVSet', 'SCDataAnalyst',
                           'SCWFEngineer', 'SCDEngineer']
        },
        25: {
            'name': 'SCAdmin',
            'permission': ['StandardSet', 'InviteUser', 'SCManager', 'WFManager', 'SCGrant']
        },
        26: {
            'name': 'PManager',
            'permission': ['TeamSet']
        },
        27: {
            'name': 'PRoot',
            'permission': ['PGrant']
        }

    }
    # 权限资源信息
    permissionTable = {
        'CodeMaintenance': {
            'name': '代码维护',
            'resource': {
                'include': [],
                'exclude': []
            }
        },
        'ServerMaintenance': {
            'name': '服务器维护',
            'resource': {
                'include': [],
                'exclude': []
            }
        },
        'PostCode': {
            'name': '代码发布',
            'resource': {
                'include': [],
                'exclude': []
            }
        },
        'RDashboard': {
            'name': '网站dashboard权限',
            'resource': {
                'include': ['/spring/get/.*', '/analysis/startWorkspaceDataGenHistogram'],
                'exclude': []
            }
        },
        'WorkOrder': {
            'name': '工单',
            'resource': {
                'include': ['/workflow/.*'],
                'exclude': []
            }
        },
        'RWikiOProject': {
            'name': '读取项目wiki的权限',
            'resource': {
                'include': ['/getAllWiki/.*'],
                'exclude': []
            }
        },
        'WWikiOProject': {
            'name': '写项目wiki的权限',
            'resource': {
                'include': ['/createWiki.*'],
                'exclude': []
            }
        }
    }

    def get_permission_by_role(self, role):
        return self.permissionTable.get(role, {})

    def __init__(self):
        # 原始角色权限表
        self._rawRoleTable = {self.rawRoleTable[item_id].get('name'): self.rawRoleTable[item_id].get('permission') for
                              item_id in
                              self.rawRoleTable}
        self.roleTable = self._get_role_table()

        self._get_group_permission_table()

    def is_role(self, name):
        return name in self._rawRoleTable

    def _get_group_permission_table(self):
        for group_id, group_role in self.userGroupTable.items():
            roles = group_role.get('roles', [])
            for role in roles:
                if not group_role.get('permission'):
                    group_role['permission'] = {}
                role_to_permission = []
                for role_name in self.roleTable.get(role, []):
                    if self.get_permission_by_role(role_name):
                        role_to_permission.append(self.get_permission_by_role(role_name))
                group_role['permission'][role] = role_to_permission

    def _get_role_table(self):
        role_table = {}

        def get_permissions_from_role(name, result=[]):
            _permissions = self._rawRoleTable.get(name)
            for item in _permissions:
                if self.is_role(item):
                    get_permissions_from_role(item, result)
                else:
                    if item not in result:
                        result.append(item)
            return result

        for role, permissions in self._rawRoleTable.items():
            final_permissions = []
            for permission in permissions:
                if self.is_role(permission):
                    get_permissions_from_role(permission, final_permissions)
                else:
                    if permission not in final_permissions:
                        final_permissions.append(permission)

            role_table[role] = final_permissions
        return role_table

    def get_group_by_user_id(self, user_id):
        # 根据user_id获取角色组信息
        urg = UserRoleGroup()
        if urg.get_role_group_id(user_id) is None:
            raise NoGrantedToPermissionGroup()
        role_group_ids = urg.get_role_group_id(user_id)
        role_groups = []
        for role_group_id in role_group_ids:
            if role_group_id not in self.userGroupTable:
                raise NoDefinedPermissionGroup()
            role_groups.append(self.userGroupTable.get(role_group_id))
        return role_groups

    def get_permissions_by_user_id(self, user_id):
        # 根据user_id获取用户权限
        urg = UserRoleGroup()
        if urg.get_role_group_id(user_id) is None:
            raise NoGrantedToPermissionGroup()
        role_group_ids = urg.get_role_group_id(user_id)
        permission_list = []
        for role_group_id in role_group_ids:
            if role_group_id not in self.rawRoleTable:
                continue
            user_group_role = self.rawRoleTable.get(role_group_id)
            if user_group_role.get('name'):
                permission_list += self.roleTable.get(user_group_role.get('name'))
        ret = {}
        permission_list = list(set(permission_list))
        for permission in permission_list:
            ret[permission.strip()] = True
        return ret

    def check_permission(self, user_id, url_rule):
        user_role_groups = self.get_group_by_user_id(user_id)
        has_permission = False
        for user_group in user_role_groups:
            for role_name, permission_list in user_group.get('permission').items():
                for permission in permission_list:
                    permission_resource = permission.get('resource')
                    if not permission_resource:
                        continue
                    include = permission_resource.get('include', [])
                    for include_item in include:
                        regex = re.compile(include_item)
                        if regex.match(url_rule):
                            has_permission = True
                            return has_permission
        return has_permission
