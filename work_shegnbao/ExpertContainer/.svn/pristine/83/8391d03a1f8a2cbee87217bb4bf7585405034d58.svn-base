# -*- encoding=utf-8 -*-
__author__ = 'yan'
import threading
from ExpertContainer.api.LogOperator import LogOperator
from ExpertContainer.api.utils import *
from ExpertContainer.api.ArchiveManager import ArchiveManager
from ExpertContainer.dbAccess.MongoConnManager import MongoConnManager
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from bson import ObjectId
from ExpertContainer.logic.LogicBase import LogicBase
from ExpertContainer.dbAccess import mongo_operator

#响应网页补数据请求的线程，每个线程负责一段时间，一批点
class RepairHistoryTimer(threading.Thread):

    _Logger = LogOperator()

    def __init__(self, moduleName, name, timelist, total, obid, projId):

        threading.Thread.__init__(self)
        self.moduleName = moduleName
        self.name = name
        self.timelist = timelist
        self.total = int(total)
        self.obid = obid
        self.projId = int(projId)
        self.event = threading.Event()
        self.reset_event()



    def reset_event(self):
        self.event.clear()

    def set_event(self):
        self.event.set()