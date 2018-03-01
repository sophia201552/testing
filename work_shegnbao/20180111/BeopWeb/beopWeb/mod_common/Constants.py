__author__ = 'win7'


class Constants:
    '''
    常量
    '''
    # log string
    # Tag相关
    LOG_TAG_INSERT_TABLE = 'User: {user_id}, Project: {project_id}. starting import tag table'
    LOG_TAG_REMOVE_FILE_FAILED = 'User: {user_id}, Project: {project_id}. Remove tag point table file failed.'
    LOG_TAG_CONVERT_FAILED = 'User: {user_id}, Project: {project_id}. convert tag table failed. {e}'

    # DB相关
    REAL_TIME_DB_PREFIX = 'rtdata_'
    # 时间相关
    DEFAULT_DISPLAY_TIME_FORMAT_EN = '%b %d, %Y %H:%M:%S'
    DEFAULT_DISPLAY_TIME_FORMAT_ZH = '%Y-%m-%d %H:%M:%S'

    DEFAULT_DISPLAY_TIME_FORMAT_SHORT_EN = '%b %d, %Y'
    DEFAULT_DISPLAY_TIME_FORMAT_SHORT_ZH = '%Y-%m-%d'
