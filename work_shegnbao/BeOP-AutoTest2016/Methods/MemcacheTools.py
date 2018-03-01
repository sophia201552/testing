__author__ = 'woody'
import memcache
from config import app
from Methods.Log import Log


class MemcacheTools:

    hostlist = app.config['MEMCACHE_LOCAL']
    logName = app.config['MEMCACHE_LOG']
    def __init__(self):
        pass

    #设置memcache 用例开始/结束时间
    @classmethod
    def setMemTime(self, key, value, time=0):
        rt = False
        try:
            mc = memcache.Client(self.hostlist, debug=0)
            rt = mc.set(key, value, time=time)
        except Exception as e:
            Log.writeLogError(self.logName, e.__str__())
        return rt

    #获取memcache 用例运行时间
    @classmethod
    def getMemTime(self, key):
        rt = None
        try:
            mc = memcache.Client(self.hostlist, debug=0)
            rt = mc.get(key)
        except Exception as e:
            print(e.__str__())
            Log.writeLogError(self.logName, e.__str__())
        return rt


    #清空掉memcache里的case运行时间记录
    @classmethod
    def delMemTime(self,keys):
        rt = False
        try:
            mc = memcache.Client(self.hostlist,debug=0)
            rt = mc.delete_multi(keys)
        except Exception as e:
            Log.writeLogError(self.logName, e.__str__())
        return rt
