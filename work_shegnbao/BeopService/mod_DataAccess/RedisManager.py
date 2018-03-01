__author__ = 'golding'
#!/usr/bin/env python
#-*- coding: utf-8 -*-
import redis
from mainService import app
import json
from datetime import datetime, date,timedelta
import time


import json
import logging

class CJsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, date):
            return obj.strftime('%Y-%m-%d')
        else:
            return json.JSONEncoder.default(self, obj)


class RedisManager:

    _mem_rtdata = {}

    try:
        host = app.config.get('REDIS_HOST')
        port = app.config.get('REDIS_PORT')
        pwd = app.config.get('REDIS_PWD')
        #连接时通过password参数指定AUTH信息，由user,pwd通过":"拼接而成
        _rm = redis.StrictRedis(host=host, port=port, password=pwd)
        #_rm = redis.StrictRedis(host='localhost', port=6379, db=0)
    except Exception as e:
        print('ERROR init redis connection ' + e.__str__())

    @classmethod
    def get(self, key):
        value = None
        try: 
            rt = RedisManager._rm.get(key)
            if rt:
                value = json.loads(rt.decode())
        except Exception as e:
            app.logger.error('RedisManager get %s:' % ( e.__str__()))
        return value

    @classmethod
    def set(self, key, value):
        rt = False
        try:
            rt = RedisManager._rm.set(key, json.dumps(value ,ensure_ascii=False, cls=CJsonEncoder))
        except Exception as e:
            print('ERROR set ' + e.__str__())
        return rt

    @classmethod
    def delete(self, key):
        rt = False
        try:
            rt = RedisManager._rm.delete(key)
        except Exception as e:
            print('ERROR delete ' + e.__str__())
        return rt

    @classmethod
    def get_project_list(cls):
        rt = set()
        try:
            mm = RedisManager.get(app.config['MEMCACHE_KEY_PREFIX']+app.config['MEMCACHE_KEY_PROJECT_LIST'])
            if mm:
                for item in mm:
                    rt.add(int(item.get('id')))
        except Exception as e:
            print('ERROR get_project_list ' + e.__str__())
        return list(rt)

    @classmethod
    def get_project_info_list(cls):
        return cls.get(app.config['MEMCACHE_KEY_PREFIX']+ 'projectInfoList')

    @classmethod
    def set_project_info_list(cls, info):
        return cls.set(app.config['MEMCACHE_KEY_PREFIX']+ 'projectInfoList', info)

    @classmethod
    def get_project_locate_map(cls):
        return cls.get(app.config['MEMCACHE_KEY_PREFIX']+ 'projectLocateMap')

    @classmethod
    def set_project_locate_map(cls, info):
        return cls.set(app.config['MEMCACHE_KEY_PREFIX']+ 'projectLocateMap', info)

    @classmethod
    def get_dtuserver_list(cls):
        return cls.get(app.config['MEMCACHE_KEY_PREFIX']+ 'dtuserverList')

    @classmethod
    def set_dtuserver_list(cls, info):
        return cls.set(app.config['MEMCACHE_KEY_PREFIX']+ 'dtuserverList', info)

    @classmethod
    def get_dtuserver_info_list(cls):
        return cls.get(app.config['MEMCACHE_KEY_PREFIX']+ 'dtuserverInfoList')

    @classmethod
    def set_dtuserver_info_list(cls, info):
        return cls.set(app.config['MEMCACHE_KEY_PREFIX']+ 'dtuserverInfoList', info)

    @classmethod
    def get_calculation_trigger_flag(cls, projId):
        return cls.get(app.config['MEMCACHE_KEY_PREFIX']+ 'calculationTrigger_%d'%(int(projId)))

    @classmethod
    def get_calc_trigger_busy(cls,projId):
        rt=0
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+'realCalInfo_%d'%(int(projId))
            info = RedisManager.get(strKey)
            if info is None:
                cls.set_calc_trigger_busy(projId, False)
                return False
            else:
                bBusy =  info.get('busy',None)
                if bBusy is None:
                    return False
                return bBusy
        except Exception as e:
            app.logger.error('%s:' + e.__str__(), True)
        return rt

    @classmethod
    def get_calc_trigger_timeUpdate(cls,projId):
        rt=None
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+'realCalInfo_%d'%(int(projId))
            info = RedisManager.get(strKey)
            if info is None:
                tDefault = datetime.now()-timedelta(days=1)
                cls.set_calc_trigger_timeUpdate(projId, tDefault)
                return tDefault
            else:
                timeUpdate =  info['timeUpdate']
                if timeUpdate is None:
                    tDefault = datetime.now()-timedelta(days=1)
                    return tDefault
                return datetime.strptime(timeUpdate, '%Y-%m-%d %H:%M:%S')
        except Exception as e:
            app.logger.error('get_calc_trigger_timeUpdate error :%s:'+e.__str__(), True)
            rt = datetime.now()-timedelta(days=1)
        return rt

    @classmethod
    def set_calc_trigger_timeUpdate(cls,projId, timeUpdate):
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+'realCalInfo_%d'%(int(projId))
            info = RedisManager.get(strKey)
            if info is None:
                RedisManager.set(strKey,dict(timeUpdate = datetime.now(), busy = 0))
            else:
                if timeUpdate is not None:
                    info['timeUpdate'] = timeUpdate
                else:
                    info['timeUpdate'] =  datetime.now()

                RedisManager.set(strKey,info)
        except Exception as e:
            return False

    @classmethod
    def set_calc_trigger_busy(cls,projId, bBusy):
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+'realCalInfo_%d'%(int(projId))
            info = RedisManager.get(strKey)
            if info is None:
                RedisManager.set(strKey,dict(timeUpdate = datetime.now()-timedelta(days=1), busy = bBusy))
            else:
                if bBusy is not None:
                    info['busy'] = bBusy
                else:
                    info['busy'] = 0

                RedisManager.set(strKey,info)
        except Exception as e:
            return False


    @classmethod
    def set_diagnosis_trigger_busy(cls,projId, bBusy):
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+'diagnosisTrigger_%d'%(int(projId))
            info = RedisManager.get(strKey)
            if info is None:
                RedisManager.set(strKey,dict(timeUpdate = datetime.now()-timedelta(days=1), busy = bBusy))
            else:
                if bBusy is not None:
                    info['busy'] = bBusy
                else:
                    info['busy'] = 0

                RedisManager.set(strKey,info)
        except Exception as e:
            return False

    @classmethod
    def set_calculation_trigger_flag(cls, projId, strFlag):
        return cls.set(app.config['MEMCACHE_KEY_PREFIX']+ 'calculationTrigger_%d'%(int(projId)), strFlag)

    @classmethod
    def get_calculation_force_flag(cls, projId):
        return cls.get(app.config['MEMCACHE_KEY_PREFIX']+ 'ForceCalculation_%d'%(int(projId)))

    @classmethod
    def set_calculation_force_flag(cls, projId, strFlag):
        return cls.set(app.config['MEMCACHE_KEY_PREFIX']+ 'ForceCalculation_%d'%(int(projId)), strFlag)
    
    @classmethod
    def get_table_list(cls):
        return cls.get(app.config['MEMCACHE_KEY_PREFIX']+ 'tableList')

    @classmethod
    def set_table_list(cls, info):
        return cls.set(app.config['MEMCACHE_KEY_PREFIX']+ 'tableList', info)

    @classmethod
    def get_diagnosis_lastupdated_time(cls, projId):
        strTime =  cls.get(app.config['MEMCACHE_KEY_PREFIX']+ 'diagnosis_lastupdated%d'%(int(projId)) )
        if strTime is None:
            return time.time()
        return float(strTime)

    @classmethod
    def set_diagnosis_lastupdated_time(cls,projId, tUpdate):
        #strTime = tUpdate.strftime('%Y-%m-%d %H:%M:%S')
        return cls.set(app.config['MEMCACHE_KEY_PREFIX']+ 'diagnosis_lastupdated%d'%(int(projId)), tUpdate)


    @classmethod
    def get_diagnosis_zones(cls, projId):
        strKey =app.config['MEMCACHE_KEY_PREFIX']+ 'diagnosis_zones%d'%(int(projId))
        return  cls.get(strKey)

    @classmethod
    def set_diagnosis_zones(cls,projId, info):
        strKey =app.config['MEMCACHE_KEY_PREFIX']+ 'diagnosis_zones%d'%(int(projId))
        return cls.set(strKey, info)

    @classmethod
    def get_diagnosis_equipments(cls, projId):
        strKey = app.config['MEMCACHE_KEY_PREFIX']+'diagnosis_equipments%d'%(int(projId))
        return  cls.get(strKey)

    @classmethod
    def set_diagnosis_equipments(cls,projId, info):
        strKey =app.config['MEMCACHE_KEY_PREFIX']+ 'diagnosis_equipments%d'%(int(projId))
        return cls.set(strKey, info)


    @classmethod
    def get_diagnosis_faults(cls, projId):
        strKey = app.config['MEMCACHE_KEY_PREFIX']+'diagnosis_faults%d'%(int(projId))
        return  cls.get(strKey)

    @classmethod
    def set_diagnosis_faults(cls,projId, info):
        strKey = app.config['MEMCACHE_KEY_PREFIX']+'diagnosis_faults%d'%(int(projId))
        return cls.set(strKey, info)

    @classmethod
    def get_diagnosis_notices(cls, projId):
        strKey = app.config['MEMCACHE_KEY_PREFIX']+'diagnosis_notices%d'%(int(projId))
        return  cls.get(strKey)

    @classmethod
    def set_diagnosis_notices(cls,projId, info):
        strKey = app.config['MEMCACHE_KEY_PREFIX']+'diagnosis_notices%d'%(int(projId))
        return cls.set(strKey, info)

    @classmethod
    def get_cloudpoints_site(cls, projId):
        strKey = app.config['MEMCACHE_KEY_PREFIX']+'cloudpoints_%d'%(int(projId))
        return cls.get(strKey)

    @classmethod
    def set_cloudpoints_site(cls, projId, info):
        strKey = app.config['MEMCACHE_KEY_PREFIX']+'cloudpoints_%d'%(int(projId))
        return cls.set(strKey, info)

    @classmethod
    def set_calc_trigger_queued(cls,projId, bQueued):
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+'realCalInfo_%d'%(int(projId))
            info = RedisManager.get(strKey)
            if info is None:
                tUpdate = datetime.now()- timedelta(days=1)
                RedisManager.set(strKey,dict(timeUpdate = tUpdate, queued = bQueued, timeQueued = datetime.now()))
            else:
                if bQueued is not None:
                    info['queued'] = bQueued
                else:
                    info['queued'] = 0
                info['timeQueued'] = datetime.now()

                RedisManager.set(strKey,info)
        except Exception as e:
            return False

    @classmethod
    def get_calc_trigger_queued(cls,projId):
        rt=(False, '2016-01-01 00:00:00')
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+'realCalInfo_%d'%(int(projId))
            info = RedisManager.get(strKey)
            if info is None:
                cls.set_calc_trigger_queued(projId, False)
                return (False, '2016-01-01 00:00:00')
            else:
                bQueued =  info.get('queued', None)
                strQueuedTime = info.get('timeQueued', '2016-01-01 00:00:00')
                if bQueued is None:
                    return (False,strQueuedTime)
                return (bQueued,strQueuedTime)
        except Exception as e:
            return False
        return rt

    @classmethod
    def set_heartbeat_time(cls, strKey, strTime):
        return cls.set(app.config['MEMCACHE_KEY_PREFIX']+ strKey, strTime)

    @classmethod
    def get_heartbeat_time(cls, strKey):
        return cls.get(app.config['MEMCACHE_KEY_PREFIX']+ strKey)

    @classmethod
    def getProjectDiagnosisStatus(cls, projId):
        strKey = app.config['MEMCACHE_KEY_PREFIX'] + 'diagStatus%d'%(int(projId))
        return cls.get(strKey)

    @classmethod
    def set_task_heartbeat_time(cls, threadName, time):
        rt = True
        try:
            strKey = 'BEOPTask'
            info = RedisManager.get(strKey)
            if info is None:
                info = {threadName:datetime.strptime(time, '%Y-%m-%d %H:%M:%S')}
            else:
                info.update(**{threadName:datetime.strptime(time, '%Y-%m-%d %H:%M:%S')})
            RedisManager.set(strKey,info)
        except:
            rt = False
        return rt

    @classmethod
    def get_task_heartbeat_time(cls, threadName):
        rt = None
        try:
            strKey = 'BEOPTask'
            info = RedisManager.get(strKey)
            if info:
                for key in info:
                    if key == threadName:
                        rt = info.get(threadName)
                        break
        except Exception as e:
            app.logger.error('RedisManager get_task_heartbeat_time %s:' % (e.__str__()))
        return rt

    @classmethod
    def get_cluster_project_map(cls):
        return cls.get(app.config['MEMCACHE_KEY_PREFIX'] + 'clusterProjectMap')
