'''
自定义异常
'''
# 没有该权限
class NoPermission(Exception):
    pass


# 未授权权限组
class NoGrantedToPermissionGroup(Exception):
    pass


# 没有定义的权限组
class NoDefinedPermissionGroup(Exception):
    pass


# 用户名密码错误
class NamePwdFailed(Exception):
    pass


# 帐号超期
class AccountExpired(Exception):
    pass


# 不合法的ObjectId
class invalidObjectID(Exception):
    pass


# 不合法的工单团队
class InvalidTeam(Exception):
    pass


# 不合法的点表Excel
class InvalidPointsExcel(Exception):
    pass


# 不合法的参数
class InvalidParams(Exception):
    pass


# 不存在指定的item
class NotExists(Exception):
    pass
