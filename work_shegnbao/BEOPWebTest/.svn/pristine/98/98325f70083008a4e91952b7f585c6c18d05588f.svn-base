import logging
from datetime import datetime, timedelta
from bson import ObjectId

from beopWeb.MongoConnManager import MongoConnManager


class TaskScheduler:

    def __init__(self):
        pass

    @classmethod
    def get_workflowtask_with_fieldtype_is_four(cls):
        # workflowTask 查询 status 等于-1 fields.type = 4
        rt = []
        cursor = None
        try:
            cnn = MongoConnManager.getConfigConn()
            cursor = cnn.mdbBb['WorkflowTask'].find({'status': -1, 'fields.type': 4})
            for item in cursor:
                try:
                    fields = item.get('fields')
                    exeTime, nextExeTime = cls.get_exetime(int(fields.get('maintainCycle')), fields.get('effectiveDate'), int(fields.get('reminderDay')))
                    if exeTime.date() == (datetime.now() + timedelta(int(fields.get('reminderDay')))).date():
                        item.get('fields').update({'nextServiceDates': nextExeTime})
                        rt.append(item)
                except Exception as e:
                    print(e.__str__())
                    logging.error(e.__str__())
        except Exception as e:
            print('get_workflowtask_with_fieldtype_is_four error:' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def get_exetime(cls, maintainCycle, effectiveDate, reminderDay):
        # maintainCycle: 4-每两周 0-每月 1-每季度 2-每半年 3-每年
        nowdate = datetime.now()
        if isinstance(effectiveDate, str):
            effectiveDate = datetime.strptime(effectiveDate, '%Y-%m-%d')
        # 维护周期的开始时间
        exeTime = effectiveDate
        if maintainCycle == 0:
            while exeTime.date() < (nowdate + timedelta(days=int(reminderDay))).date():
                if exeTime.month < 12:
                    exeTime = exeTime.replace(month=exeTime.month + 1)
                else:
                    exeTime = exeTime.replace(year=exeTime.year + 1, month=1)
            if exeTime.month < 12:
                nextServiceDates = exeTime.replace(month=exeTime.month + 1)
            else:
                nextServiceDates = exeTime.replace(year=exeTime.year + 1, month=1)
        elif maintainCycle == 1:
            while exeTime.date() < (nowdate + timedelta(days=int(reminderDay))).date():
                if exeTime.month < 10:
                    exeTime = exeTime.replace(month=exeTime.month + 3)
                else:
                    n = exeTime.month + 3 - 12
                    exeTime = exeTime.replace(year=exeTime.year + 1, month=n)
            if exeTime.month < 10:
                nextServiceDates = exeTime.replace(month=exeTime.month + 3)
            else:
                n = exeTime.month + 3 - 12
                nextServiceDates = exeTime.replace(year=exeTime.year + 1, month=n)
        elif maintainCycle == 2:
            while exeTime.date() < (nowdate + timedelta(days=int(reminderDay))).date():
                if exeTime.month < 7:
                    exeTime = exeTime.replace(month=exeTime.month + 6)
                else:
                    n = exeTime.month + 6 - 12
                    exeTime = exeTime.replace(year=exeTime.year + 1, month=n)
            if exeTime.month < 7:
                nextServiceDates = exeTime.replace(month=exeTime.month + 6)
            else:
                n = exeTime.month + 6 - 12
                nextServiceDates = exeTime.replace(year=exeTime.year + 1, month=n)
        elif maintainCycle == 3:
            while exeTime.date() < (nowdate + timedelta(days=int(reminderDay))).date():
                exeTime = exeTime.replace(year=exeTime.year + 1)
                nextServiceDates = exeTime.replace(year=exeTime.year + 1)
        elif maintainCycle == 4:
            while exeTime.date() < (nowdate + timedelta(days=int(reminderDay))).date():
                exeTime += timedelta(weeks=2)
                nextServiceDates = exeTime + timedelta(weeks=2)
        return exeTime, nextServiceDates

    @classmethod
    def set_workflowtask_fieldtype_zero(cls, workflowtasklist):
        rt = False
        try:
            for item in workflowtasklist:
                item.update({'_id': ObjectId(), 'status': 0, 'createTime': datetime.now()})
            cnn = MongoConnManager.getConfigConn()
            cnn.mdbBb['WorkflowTask'].insert_many(workflowtasklist)
            rt = True
        except Exception as e:
            print('set_workflowtask_fieldtype_zero error:' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        return rt

    @classmethod
    def get_task(cls):
        rt = []
        cursor = None
        try:
            cnn = MongoConnManager.getConfigConn()
            cursor = cnn.mdbBb['TaskScheduler'].find({'status': 1}, sort=[('executiontime', 1)], limit=2)
            for item in cursor:
                cycle = item.get('cycle')
                if item.get('executiontime') < datetime.now() - timedelta(days=1):
                    if int(cycle) <= 0:
                        item.update({'cycle': 1})
                    while item.get('executiontime') < datetime.now() - timedelta(days=1):
                        executiontime = item.get('executiontime')
                        item.update({'executiontime': executiontime + timedelta(days=int(cycle))})
                    dbrv = cnn.mdbBb['TaskScheduler'].update({'_id': item.get('_id')}, item, True)
                    if dbrv.get('ok'):
                        return cls.get_task()
                    else:
                        raise Exception('update database faild')
                else:
                    item.update({'_id': item.get('_id').__str__(), 'executiontime': item.get('executiontime').strftime('%Y-%m-%d %H:%M:%S')})
                    rt.append(item)
        except Exception as e:
            print('get_task error:' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        finally:
            if cursor:
                cursor.close()
        return rt

    @classmethod
    def update_task_executiontime(cls, taskId):
        rt = False
        try:
            cnn = MongoConnManager.getConfigConn()
            if isinstance(taskId, str):
                taskId = [taskId]
            for i in taskId:
                if ObjectId.is_valid(i):
                    task = cnn.mdbBb['TaskScheduler'].find_one({'_id': ObjectId(i)})
                    exe_time = task.get('executiontime') + timedelta(days=int(task.get('cycle')))
                    dbrv = cnn.mdbBb['TaskScheduler'].update({'_id': ObjectId(i)}, {'$set': {'executiontime': exe_time}})
                    if dbrv.get('ok'):
                        rt = True
                    else:
                        raise Exception('update database faild')
        except Exception as e:
            print('update_task_executiontime error:' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        return rt

