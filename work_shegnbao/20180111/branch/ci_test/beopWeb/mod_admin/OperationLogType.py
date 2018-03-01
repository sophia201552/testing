'''
操作记录类型
'''

from enum import Enum


class Auto(Enum):
    def __new__(cls):
        value = len(cls.__members__) + 1
        obj = object.__new__(cls)
        obj._value_ = value
        return obj


class OperationLogType(Auto):
    # 更新用户权限记录
    UPDATE_USER_PERMISSION = ()


if __name__ == '__main__':
    # 测试
    print(OperationLogType.UPDATE_USER_PERMISSION)
    print(OperationLogType.UPDATE_USER_PERMISSION.value)
