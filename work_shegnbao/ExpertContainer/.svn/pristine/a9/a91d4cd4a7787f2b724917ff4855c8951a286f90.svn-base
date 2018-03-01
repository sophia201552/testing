#-*- coding: utf-8 -*-
__author__ = 'eric'

from ExpertContainer.api.utils import *
from ExpertContainer.api.LogOperator import LogOperator
from ExpertContainer.api.CalcPointFixedTime import CalcPointFixedTime


_logger = LogOperator()


def startThreadFixedTimeCalc():
    try:
        thread = CalcPointFixedTime("FixedTimeCalcThread")
        thread.setDaemon(False)
        thread.start()
        _logger.writeLog('%s:'%(get_current_func_name())+'定时计算线程启动',True)
    except Exception as e:
        _logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)

if __name__ == '__main__':
    startThreadFixedTimeCalc()