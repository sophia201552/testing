# -*- encoding=utf-8 -*-
__author__ = 'yan'

import sys
sys.path.append("..")
import threading, time
from datetime import datetime
from ExpertContainer.api.LogOperator import LogOperatorStrategy
from ExpertContainer.api.utils import get_file_name, get_current_func_name
from strategy.Interface import Interface


class CronTab(threading.Thread):

    _logger = LogOperatorStrategy()

    def __init__(self, name, interval=60):
        threading.Thread.__init__(self)
        self.name = name
        self.interval = interval
        self.last_act_time = None

    def run(self):
        while True:
            try:
                do = False
                now_time = datetime.now()
                if self.last_act_time is None:
                    do = True
                else:
                    if self.interval == 60:
                        if now_time.minute != self.last_act_time.minute:
                            do = True
                    elif self.interval == 60*5:
                        if now_time.minute % 5 == 0:
                            do = True
                    elif self.interval == 60*60:
                        if now_time.hour != self.last_act_time.hour:
                            do = True
                    elif self.interval == 60*60*24:
                        if now_time.day != self.last_act_time.day:
                            do = True
                if do:
                    try:
                        item = Interface.get_strategy_item_datasource('148705643027726230c8b216')#todo test use
                        Interface.put_strategy_into_message_queue(item)
                        CronTab._logger.writeLog(get_file_name(__file__),
                                                 '%s-%s:' % (self.getName(), get_current_func_name()) + '148705643027726230c8b216的算法放入队列',
                                                 False)
                    except Exception as e:
                        CronTab._logger.writeLog(get_file_name(__file__), '%s-%s:'%(self.getName(), get_current_func_name())+e.__str__(), True)
                    self.last_act_time = now_time
                time.sleep(1)
            except Exception as e:
                CronTab._logger.writeLog(get_file_name(__file__), '%s-%s:'%(self.getName(), get_current_func_name())+e.__str__(), True)


