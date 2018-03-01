__author__ = 'golding'
#!/usr/bin/env python
#-*- coding: utf-8 -*-
import redis
from beopWeb import app
import json
from datetime import datetime, date
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
        # David 20170721 由于需要兼容 Azure 的Redis服务，所以做出改动
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
            logging.error('RedisManager get %s:' % ( e.__str__()))
        return value

    @classmethod
    def expirekey(self, key, expireSeconds):
        rt = False
        try:
            rt = RedisManager._rm.expire(key, expireSeconds)
        except Exception as e:
            print('ERROR expirekey ' + e.__str__())
        return rt

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
    def set_calculation_trigger_flag(cls, projId, strFlag):
        return cls.set(app.config['MEMCACHE_KEY_PREFIX']+ 'calculationTrigger_%d'%(int(projId)), strFlag)


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
    def get_weather_updatetime_by_pid(cls, projId):
        strKey = app.config['MEMCACHE_KEY_PREFIX']+'weatherupdatetime%d'%(int(projId))
        return  cls.get(strKey)

    @classmethod
    def set_weather_updatetime_by_pid(cls,projId, info):
        strKey = app.config['MEMCACHE_KEY_PREFIX']+'weatherupdatetime%d'%(int(projId))
        return cls.set(strKey, info)

    @classmethod
    def get_weather_info_by_pid(cls, projId):
        strKey = app.config['MEMCACHE_KEY_PREFIX']+'weatherinfo%d'%(int(projId))
        return  cls.get(strKey)

    @classmethod
    def set_weather_info_by_pid(cls,projId, info):
        strKey = app.config['MEMCACHE_KEY_PREFIX']+'weatherinfo%d'%(int(projId))
        return cls.set(strKey, info)

    @classmethod
    def get_weather_updatetime_by_cityname(cls, strCityName):
        strKey = app.config['MEMCACHE_KEY_PREFIX']+'weatherupdatetime%s'%(str(strCityName))
        return  cls.get(strKey)

    @classmethod
    def set_weather_updatetime_by_cityname(cls,strCityName, info):
        strKey = app.config['MEMCACHE_KEY_PREFIX']+'weatherupdatetime%s'%(str(strCityName))
        return cls.set(strKey, info)

    @classmethod
    def get_weather_info_by_cityname(cls, strCityName):
        strKey = app.config['MEMCACHE_KEY_PREFIX']+'weatherinfo%s'%(str(strCityName))
        return  cls.get(strKey)

    @classmethod
    def set_weather_info_by_cityname(cls,strCityName, info):
        strKey = app.config['MEMCACHE_KEY_PREFIX']+'weatherinfo%s'%(str(strCityName))
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
    def get_calc_settings(cls, projId):
        return cls.get(app.config['MEMCACHE_KEY_PREFIX']+ 'calcSettings_%d'%(int(projId)))

    @classmethod
    def set_Calc_settings(cls, projId, info):
        return cls.set(app.config['MEMCACHE_KEY_PREFIX']+ 'calcSettings_%d'%(int(projId)), info)
    
    @classmethod
    def get_alarm_flag(cls, projId):
        return cls.get(app.config['MEMCACHE_KEY_PREFIX']+ 'alarmdata_%d'%(int(projId)))


    @classmethod
    def set_alarm_flag(cls, projId, strFlag):
        return cls.set(app.config['MEMCACHE_KEY_PREFIX']+ 'alarmdata_%d'%(int(projId)), strFlag)
    
    @classmethod
    def get_alarm_real_result(cls, projId):
        return cls.get(app.config['MEMCACHE_KEY_PREFIX']+ 'expertAlarmReal_%d'%(int(projId)))
