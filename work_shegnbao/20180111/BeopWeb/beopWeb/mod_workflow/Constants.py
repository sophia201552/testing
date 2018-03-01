__author__ = 'win7'


# 工单类型 4: 预防性维护, 5: 诊断工单, 6: 反馈工单
class TaskType:
    PREVENTIVE_MAINTENANCE = 4
    DIAGNOSIS = 5
    FEEDBACK = 6


# FeedBack 0: 未反馈 1: 等待处理 2: 执行中 3: 完成
class FeedBackStatus:
    NOT_FEEDBACK = 0
    WAIT = 1
    PROCESSING = 2
    DONE = 3


# 工单状态
class TaskStatus:
    NEW = 0  # 新建
    PROCESSING = 1  # 进行
    END = 2  # 结束
    NOT_PASS = 3  # 未通过


# 工单操作
class TaskAction:
    PASS = 'pass'  # 审核通过
    COMPLETE = 'complete'  # 执行完成
    NO_PASS = 'noPass'  # 审核不通过


# 团队成员类型
class TeamMemberType:
    SUPER_ADMIN = 1  # 超级管理员
    ADMIN = 2  # 管理员
    MEMBER = 3  # 成员


# 字段定义
class FieldType:
    DEFAULT = 1  # 默认字段
    CUSTOM = 2  # 自定义字段


# 组织架构单元类型
class ArchType:
    SUPER_ADMIN = 1
    ADMIN = 2
    MEMBER = 3
    ALL_MEMBERS = 4
    SPECIFIED_MEMBERS = 5

# 节点动作类型
class NodeBehaviour:
    VERIFY = 1  # 审核节点
    EXECUTE = 2  # 执行节点


# 模版映射表
class TemplateMap:
    DEFAULT_TEMPLATE_ID = '56f13216e153db0248d3fb91'
