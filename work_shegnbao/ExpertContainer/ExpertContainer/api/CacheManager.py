# -*- encoding=utf-8 -*-
__author__ = 'yan'

import threading
from ExpertContainer.api.api import HistoryDataMethods, RealtimeDataMethods
from ExpertContainer.api.utils import *
from ExpertContainer.dbAccess import mongo_operator
from ExpertContainer.api.errorLog import errorLog
from ExpertContainer.api.ArchiveManager import ArchiveManager
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
import traceback

class CacheManager:
    def __init__(self,):
        self.history_cache = {}

    def isEmpty(self):
        return False if self.history_cache else True

    def get_real(self, point_name):
        return self.read_cache(None, point_name)

    def write_cache(self,  time_point, point_name, val):
        rt = False
        try:
            self.cacheId_value = self.history_cache
            if self.cacheId_value is None:
                self.cacheId_value = {}

            self.cacheId_value[point_name] = val
            rt = True
        except:
            pass
        return rt

    def read_cache(self,  time_point, point_name):
        rt = None
        try:
            self.cacheId_value = self.history_cache
            if self.cacheId_value:
                rt = self.cacheId_value.get(point_name)
        except:
            pass
        return rt

    def remove_history_cache(self):
        self.history_cache.clear()
        rt = True
        return rt
