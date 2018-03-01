'''
操作记录
'''

from beopWeb.MongoConnManager import MongoConnManager
from beopWeb.BEOPMongoDataAccess import g_table_operation_log
from datetime import datetime
from beopWeb.mod_admin.OperationLogType import OperationLogType


class LogLevel:
    '''
    log等级
    '''
    debug = 1
    info = 2
    warn = 3
    error = 4


class OperationLog:
    @classmethod
    def _log(cls, level, msg, log_type, user_id=None):
        if not isinstance(log_type, OperationLogType):
            raise TypeError('not exists type: ' + str(log_type))
        db = MongoConnManager.getConfigConn().mdbBb[g_table_operation_log]
        db.insert({'user': user_id, 'msg': msg, 'level': level, 'type': log_type.value, 'time': datetime.now()})

    @staticmethod
    def info(msg, log_type, user_id=None):
        '''
        操作记录info信息

        :param msg: 记录信息
        :param log_type: 记录类型, 在OperationLogType文件中定义, 如权限操作类型
        :param user_id: 操作人
        '''
        OperationLog._log(LogLevel.info, msg, log_type, user_id)

    @staticmethod
    def warn(msg, log_type, user_id=None):
        '''
        操作记录warn信息

        :param msg: 记录信息
        :param log_type: 记录类型, 在OperationLogType文件中定义, 如权限操作类型
        :param user_id: 操作人
        '''
        OperationLog._log(LogLevel.warn, msg, log_type, user_id)

    @staticmethod
    def error(msg, log_type, user_id=None):
        '''
        操作记录error信息

        :param msg: 记录信息
        :param log_type: 记录类型, 在OperationLogType文件中定义, 如权限操作类型
        :param user_id: 操作人
        '''
        OperationLog._log(LogLevel.error, msg, log_type, user_id)

    @staticmethod
    def debug(msg, log_type, user_id=None):
        '''
        操作记录debug信息

        :param msg: 记录信息
        :param log_type: 记录类型, 在OperationLogType文件中定义, 如权限操作类型
        :param user_id: 操作人
        '''
        OperationLog._log(LogLevel.debug, msg, log_type, user_id)


if __name__ == '__main__':
    OperationLog.info('测试info', OperationLogType.UPDATE_USER_PERMISSION)
    OperationLog.warn('测试warn', OperationLogType.UPDATE_USER_PERMISSION)
    OperationLog.error('测试error', OperationLogType.UPDATE_USER_PERMISSION)
    OperationLog.debug('测试debug', OperationLogType.UPDATE_USER_PERMISSION)
