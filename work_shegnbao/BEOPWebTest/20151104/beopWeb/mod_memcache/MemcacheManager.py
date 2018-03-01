__author__ = 'David'

from beopWeb import app
from beopWeb.mod_memcache import memcache
import logging

#hostlist = ['beop.rnbtech.com.hk:11211']
hostlist = app.config.get('MEMCACHE_HOSTLIST')

class MemcacheManager:

    @classmethod
    def set(self, key, value):
        rt = False
        try:
            mc = memcache.Client(hostlist, debug=0)
            rt = mc.set(key, value)
        except Exception as e:
            print(e.__str__())
            logging.error(e)
        return rt

    @classmethod
    def get(self, key):
        rt = None
        try:
            mc = memcache.Client(hostlist, debug=0)
            rt = mc.get(key)
        except Exception as e:
            print(e.__str__())
            logging.error(e)
        return rt

    @classmethod
    def delete(self, key):
        rt = False
        try:
            mc = memcache.Client(hostlist, debug=0)
            rt = mc.delete(key)
        except Exception as e:
            print(e.__str__())
            logging.error(e)
        return rt
