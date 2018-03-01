# -*- encoding=utf-8 -*-
__author__ = 'yan'

import threading
from ExpertContainer.api.utils import *
from ExpertContainer.mqAccess.MQManager import MQManager
from ExpertContainer.dbAccess import mongo_operator


def is_hour_minute_match(tmObject, timeAtString):
    if isinstance(timeAtString, str):
        try:
            s = timeAtString.split(':')
            hour = int(s[0])
            minute = int(s[1])
            if tmObject.hour == hour and tmObject.minute == minute:
                return True
        except:
            return False
    return False

def put_item_to_mq(item):
    if item:
        jsonData = json.dumps(item, ensure_ascii=False)
        if jsonData:
            if not MQManager.RabbitMqWorkQueueSend('DataTaskQueue', jsonData):
                raise Exception('put %s into mq failed' % (str(item),))
                LogOperator().writeLog('%s:' % (get_current_func_name()) + str(item), False)

class IdContainer:

    _dic = {}

    @classmethod
    def get(cls, id):
        return IdContainer._dic.get(id)

    @classmethod
    def set(cls, id):
        IdContainer._dic.update({id:datetime.now()})

    @classmethod
    def is_in(cls, id):
        return id in IdContainer._dic

    @classmethod
    def delete(cls, id):
        if IdContainer.is_in(id):
            IdContainer._dic.pop(id)

    @classmethod
    def is_need_run_periodic(cls, id, period):
        t_now = datetime.now()
        t_last = IdContainer.get(id)
        if t_last is None:
            IdContainer.set(id)
            return True
        else:
            span = (t_now - t_last).total_seconds()
            if span >= period*60:
                IdContainer.set(id)
                return True
        return False

    @classmethod
    def is_need_run_appoint(cls, id, tstring):
        t_last = IdContainer.get(id)
        t_now = datetime.now()
        if t_last is None:
            if is_hour_minute_match(t_now, tstring):
                IdContainer.set(id)
                return True
        else:
            if t_now.day == t_last.day:
                if t_now.hour != t_last.hour \
                        or t_now.minute != t_last.minute:
                    if is_hour_minute_match(t_now, tstring):
                        IdContainer.set(id)
                        return True
            else:
                if is_hour_minute_match(t_now, tstring):
                    IdContainer.set(id)
                    return True
        return False

class DataTaskThread(threading.Thread):

    def __init__(self, name, func, params, interval=60):
        threading.Thread.__init__(self)
        self.name = name
        self.func = func
        self.params = params
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
                    if (now_time - self.last_act_time).total_seconds() >= self.interval:
                        do = True
                if do:
                    try:
                        self.func(*self.params)
                    except Exception as e:
                        LogOperator().writeLog('%s:'%(get_current_func_name()) + e.__str__(), True)
                    self.last_act_time = now_time
                time.sleep(1)
            except Exception as e:
                LogOperator().writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)

class DataTaskLogic:

    @staticmethod
    def DataTaskLogic(*args, **kargs):
        try:
            all = mongo_operator.get_data_task_all()
            for item in all:
                id = item.get('_id').__str__()
                item.update({'_id':id})
                period = item.get('period')
                status = item.get('status')
                mode = item.get('mode')
                schedule = item.get('schedule')
                if status:
                    if mode == 'periodic':
                        if IdContainer.is_need_run_periodic(id, period):
                            put_item_to_mq(item)
                    elif mode == 'appoint':
                        for t in schedule:
                            if IdContainer.is_need_run_appoint(id, t):
                                put_item_to_mq(item)
                else:
                    IdContainer.delete(id)
        except Exception as e:
            LogOperator().writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)


def startThreadTask():
    try:
        LogOperator().writeLog('%s:' % (get_current_func_name()) + '定时任务扫描启动', False)
        thread = DataTaskThread("ThreadDataTask", DataTaskLogic.DataTaskLogic, (), 60)
        thread.setDaemon(False)
        thread.start()
    except Exception as e:
        LogOperator().writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)



if __name__ == '__main__':
    startThreadTask()