# -*- encoding=utf-8 -*-
__author__ = 'yan'

import sys
sys.path.append("..")
from ExpertContainer.api.LogOperator import LogOperatorStrategy
from ExpertContainer.api.utils import get_file_name, get_current_func_name
from strategy.Timer import CronTab

_logger = LogOperatorStrategy()

def startThreadScanStrategy():
    try:
        _logger.writeLog(get_file_name(__file__), '%s:' % (get_current_func_name()) + '扫描策略线程启动')
        thread = CronTab("ThreadScanStrategy_interval_60", 60)
        thread.setDaemon(False)
        thread.start()
    except Exception as e:
        _logger.writeLog(get_file_name(__file__), '%s:'%(get_current_func_name())+e.__str__(), True)

if __name__ == '__main__':
    startThreadScanStrategy()