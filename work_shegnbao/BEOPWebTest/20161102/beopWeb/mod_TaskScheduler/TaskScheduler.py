import logging
from datetime import datetime, timedelta
from bson import ObjectId

from beopWeb.MongoConnManager import *

class TaskScheduler:

    def __init__(self):
        pass

    @classmethod
    def get_workflowtask_with_fieldtype_is_four(cls):
        rt = []
        cursor = None
        try:
            cnn = MongoConnManager.getConfigConn()
            cursor = cnn.mdbBb['WorkflowTask'].find({'status':-1, 'fields.type':4})
            for item in cursor:
                try:
                    fields = item.get('fields')
                    if 'effectiveDate' in fields.keys() and 'maintainCycle' in fields.keys() and 'reminderDay' in fields.keys():
                        maintenance_start = datetime.strptime(fields.get('effectiveDate'), '%Y-%m-%d')
                        while maintenance_start < datetime.now().replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days = int(fields.get('reminderDay'))):
                            maintenance_start = maintenance_start + timedelta(days = int(fields.get('maintainCycle') if int(fields.get('maintainCycle')) >=1 else 1))
                        if maintenance_start == datetime.now().replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days = int(fields.get('reminderDay'))):
                            nextServiceDates = maintenance_start + timedelta(days = int(fields.get('reminderDay'))) + timedelta(days = int(fields.get('maintainCycle')))
                            fields.update({'nextServiceDates':nextServiceDates})
                            rt.append(item)
                except Exception as e:
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
    def set_workflowtask_fieldtype_zero(cls, workflowtasklist):
        rt = False
        try:
            for item in workflowtasklist:
                item.update({'_id':ObjectId(), 'status':0})
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
            cursor = cnn.mdbBb['TaskScheduler'].find({'status':1}, sort = [('executiontime', 1)], limit = 2)
            for item in cursor:
                cycle = item.get('cycle')
                if item.get('executiontime') < datetime.now() - timedelta(days=1):
                    if int(cycle) <= 0:
                        item.update({'cycle':1})
                    while item.get('executiontime') < datetime.now() - timedelta(days=1):
                        executiontime = item.get('executiontime')
                        item.update({'executiontime':executiontime + timedelta(days = int(cycle))})
                    dbrv = cnn.mdbBb['TaskScheduler'].update({'_id':item.get('_id')}, item, True)
                    if dbrv.get('ok'):
                        return cls.get_task()
                    else:
                        raise Exception('update database faild')
                else:
                    item.update({'_id':item.get('_id').__str__(), 'executiontime':item.get('executiontime').strftime('%Y-%m-%d %H:%M:%S')})
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
                    task = cnn.mdbBb['TaskScheduler'].find_one({'_id':ObjectId(i)})
                    exe_time = task.get('executiontime') + timedelta(days = int(task.get('cycle')))
                    dbrv = cnn.mdbBb['TaskScheduler'].update({'_id':ObjectId(i)}, {'$set':{'executiontime':exe_time}})
                    if dbrv.get('ok'):
                        rt = True
                    else:
                        raise Exception('update database faild')
        except Exception as e:
            print('update_task_executiontime error:' + e.__str__())
            logging.error(e.__str__())
            raise Exception(e.__str__())
        return rt

