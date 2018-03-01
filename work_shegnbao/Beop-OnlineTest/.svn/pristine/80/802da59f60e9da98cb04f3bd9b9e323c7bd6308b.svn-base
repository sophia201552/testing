__author__ = 'woody'
import logging, time
from interfaceTest import app
import os


def log(func):
    def wrapper(*args, **kw):
        try:
            return func(*args, **kw)
        except Exception as e:
            Log.writeLogError(app.config['CSS_ERROR'], func.__name__ + e.__str__())
            raise Exception("%s函数出错!详情: " % func.__name__ + e.__str__())
    return wrapper




class Log:

    def __init__(self):
        pass

    #初始化log日志文件,文件名作为参数传进来,返回一个logger
    @classmethod
    def _init_log(self, logName):
        '返回日志文件句柄'
        log = logName.replace('/', '\\')
        dirName = os.path.split(log)[0]
        if os.path.exists(dirName):
            pass
        else:
            os.mkdir(dirName)
        handler = logging.FileHandler(log, encoding='utf-8')
        logger = logging.getLogger()
        #修复1个bug,往多个log里写日志因为handlers太多
        if len(logger.handlers):
            logger.handlers = []
        logger.addHandler(handler)
        logger.setLevel(logging.ERROR)
        return logger


    #调用logger写入错误信息至log日志中
    @classmethod
    def writeLogError(self, logName, text):
        '填入error'
        try:
            text + ''
        except:
            raise TypeError('输入日志信息不为str,请检查!')
        logger = self._init_log(logName)
        logger.error('[%s]---' % time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) + '' + text)

    @classmethod
    def writeLogInfo(self, logName, text):
        '填入info'
        try:
            text + ''
        except:
            raise TypeError('输入日志信息不为str,请检查!')
        logger = self._init_log(logName)
        logger.setLevel(logging.INFO)
        logger.info('[%s]---' % time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) + '' + text)


