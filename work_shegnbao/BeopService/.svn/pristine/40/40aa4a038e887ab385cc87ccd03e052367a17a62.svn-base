__author__ = 'David'

from mainService import app
from mod_memcache import memcache
import logging

#hostlist = ['beop.rnbtech.com.hk:11211']
hostlist = app.config.get('MEMCACHE_HOSTLIST')

class MemcacheManager:

    mc = memcache.Client(hostlist, debug=0)

    @classmethod
    def set(self, key, value):
        rt = False
        try:
            rt = MemcacheManager.mc.set(key, value)
        except Exception as e:
            print('MemcacheManager::set error:' + e.__str__())
            app.logger.error('MemcacheManager::set error:' + e.__str__())
        return rt

    @classmethod
    def get(self, key):
        rt = None
        try:
            rt = MemcacheManager.mc.get(key)
        except Exception as e:
            print('MemcacheManager::get error:' + e.__str__())
            app.logger.error('MemcacheManager::get error:' + e.__str__())
        return rt

    @classmethod
    def delete(self, key):
        rt = False
        try:
            rt = MemcacheManager.mc.delete(key)
        except Exception as e:
            print('MemcacheManager::delete error:' + e.__str__())
            app.logger.error('MemcacheManager::delete error:' + e.__str__())
        return rt

