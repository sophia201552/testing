# -*- encoding=utf-8 -*-
from ExpertContainer.logic.StrategyBase import *
from ExpertContainer.api.ArchiveManager import ArchiveManager
from ExpertContainer.api.globalMapping import *
from ExpertContainer.api.cacheProfile import DataManager
from ExpertContainer.api.LogOperator import LogOperatorStrategy
_logger = LogOperatorStrategy()

class LogicAct(StrategyBase):

    def actlogic(self):
        rt = None
        try:
            rt = self.action()
        except Exception as e:
            _logger.writeLog(get_file_name(__file__), '%s:'%(get_current_func_name())+e.__str__(), True)
            rt = None
        return rt

    def m151297779933114992436217310772f7af15b(self):
        def main():
            try:
                return None
            except Exception as e:
                _logger.writeLog(get_file_name(__file__), '%s:'%(get_current_func_name())+e.__str__(), True)
                return {'msg':e.__str__(), 'error':1}
        return main()

    def action(self):
        rt = True
        try:
            rt = self.m151297779933114992436217310772f7af15b()
        except Exception as e:
            _logger.writeLog(get_file_name(__file__), '%s:'%(get_current_func_name())+e.__str__(), True)
            rt = {'msg':e.__str__(), 'error':1}
        return rt
