from beopWeb.mod_common.Utils import Utils
import logging
from beopWeb.mod_memcache.RedisManager import RedisManager


class DbEntity:
    db_name = ''  # 数据库名称
    table_name = ''  # 数据库表名
    fields = ()  # 操作字段列表
    db_helper = Utils.DbHelper()  # 数据库操作帮助工具

    def __init__(self):
        # 缓存前缀
        self.CACHE_PREFIX = 'DbCache_' + self.table_name + '_'

    def get_cache(self, key):
        """
        获取缓存

        :param key: 缓存key值
        :return: 缓存的数据
        """
        return RedisManager.get(self.CACHE_PREFIX + str(key))

    def set_cache(self, key, value, time=300):
        """
        设置缓存

        :param key: 缓存key值
        :param value: 缓存的数据
        :param time: 缓存过期时间
        :return: 设置是否成功
        """
        RedisManager.set(self.CACHE_PREFIX + str(key), value)
        RedisManager.expirekey(self.CACHE_PREFIX + str(key), time)

    def delete_cache(self, key):
        """
        删除缓存

        :param key: 缓存的key值
        :return: 删除是否成功
        """
        RedisManager.delete(self.CACHE_PREFIX + str(key))

    def insert(self, data):
        """
        数据库插入数据操作

        :param data: 要插入的数据
        :return: True 更成功; False 失败
        """
        return self.db_helper.insert(self.db_name, self.table_name, data)

    def insert_with_return_id(self, data):
        """
        数据库插入数据并且返回新记录的ID

        :param data: 要插入的数据
        :return: 新记录的ID
        """
        return_id = self.db_helper.insert_with_return_id(self.db_name, self.table_name, data)
        if return_id == -1 or return_id is None:
            logging.error('数据库插入数据失败,返回ID为-1或者空:' + str(data))
        return return_id

    def delete(self, where=None):
        """
        删除数据

        :param where: 删除条件
        :return: True 更成功; False 失败
        """
        return self.db_helper.delete(self.db_name, self.table_name, where)

    def update(self, data, where=None):
        """
        更新数据

        :param data: 更新的数据
        :param where: 更新条件
        :return: True 更成功; False 失败
        """
        return self.db_helper.update(self.db_name, self.table_name, data, where)

    def query(self, fields=(), where=None, order=None, limit=None):
        """
        查询数据

        :param fields: 返回字段
        :param where: 查询条件
        :param order: 排序字段
        :param limit: 返回条数
        :return: 查询结果
        """
        return self.db_helper.query(self.db_name, self.table_name, fields, where, order, limit)

    def query_distinct(self, fields=(), where=None, order=None, limit=None):
        """
        查询数据, 去掉重复数据

        :param fields: 返回字段
        :param where: 查询条件
        :param order: 排序字段
        :param limit: 返回条数
        :return: 查询结果
        """
        return self.db_helper.query(self.db_name, self.table_name, fields, where, order, limit, is_distinct=True)

    def query_one(self, fields=(), where=None, order=None, limit=None):
        """
        查询单条数据

        :param fields: 返回字段
        :param where: 查询条件
        :param order: 排序字段
        :param limit: 返回条数
        :return: 查询结果
        """
        return self.db_helper.query_one(self.db_name, self.table_name, fields, where, order, limit)

    def count(self, where=None):
        """
        返回数据库查询结果个数

        :param where: 查询条件
        :return: 查询结果个数
        """
        return self.db_helper.count(self.db_name, self.table_name, where)
