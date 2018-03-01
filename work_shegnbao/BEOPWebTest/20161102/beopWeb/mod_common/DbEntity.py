__author__ = 'liqian'
from beopWeb.mod_common.Utils import Utils
import logging
from beopWeb.mod_memcache.RedisManager import RedisManager


class DbEntity:
    db_name = ''
    table_name = ''
    fields = ()
    db_helper = Utils.DbHelper()

    def __init__(self):
        self.CACHE_PREFIX = 'DbCache_' + self.table_name + '_'

    def get_cache(self, key):
        return RedisManager.get(self.CACHE_PREFIX + str(key))

    def set_cache(self, key, value, time=300):
        RedisManager.set(self.CACHE_PREFIX + str(key), value)
        RedisManager.expirekey(self.CACHE_PREFIX + str(key), time)

    def delete_cache(self, key):
        RedisManager.delete(self.CACHE_PREFIX + str(key))

    def insert(self, data):
        return self.db_helper.insert(self.db_name, self.table_name, data)

    def insert_with_return_id(self, data):
        return_id = self.db_helper.insert_with_return_id(self.db_name, self.table_name, data)
        if return_id == -1 or return_id is None:
            logging.error('数据库插入数据失败,返回ID为-1或者空:' + str(data))
        return return_id

    def delete(self, where=None):
        return self.db_helper.delete(self.db_name, self.table_name, where)

    def update(self, data, where=None):
        return self.db_helper.update(self.db_name, self.table_name, data, where)

    def query(self, fields=(), where=None, order=None, limit=None):
        return self.db_helper.query(self.db_name, self.table_name, fields, where, order, limit)

    def query_distinct(self, fields=(), where=None, order=None, limit=None):
        return self.db_helper.query(self.db_name, self.table_name, fields, where, order, limit, is_distinct=True)

    def query_one(self, fields=(), where=None, order=None, limit=None):
        return self.db_helper.query_one(self.db_name, self.table_name, fields, where, order, limit)

    def count(self, where=None):
        return self.db_helper.count(self.db_name, self.table_name, where)
