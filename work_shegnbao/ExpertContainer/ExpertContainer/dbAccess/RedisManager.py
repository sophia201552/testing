__author__ = 'golding'
#!/usr/bin/env python
#-*- coding: utf-8 -*-
import redis
from ExpertContainer import app

from ExpertContainer.api.LogOperator import LogOperator
from ExpertContainer.api.utils import *
import pickle
import json


class RedisManager:
    _mem_rtdata = {}
    _logger = LogOperator()
    try:
        host = app.config['REDIS_HOST']
        port = app.config['REDIS_PORT']
        pwd = app.config['REDIS_PWD']
        #连接时通过password参数指定AUTH信息，由user,pwd通过":"拼接而成
        _rm = redis.StrictRedis(host=host, port=port, password=pwd)
        #_rm = redis.StrictRedis(host='localhost', port=6379, db=0)
    except Exception as e:
        print(e)

    @classmethod
    def queryKeys(cls, strQuery):
        return RedisManager._rm.keys(strQuery)

    @classmethod
    def get(self, key):
        value = None
        try:
            rt = RedisManager._rm.get(key)
            if rt:
                value = json.loads(rt.decode())
        except Exception as e:
            RedisManager._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return value

    @classmethod
    def set(self, key, value):
        rt = False
        try:
            rt = RedisManager._rm.set(key, json.dumps(value ,ensure_ascii=False, cls=CJsonEncoder))
        except Exception as e:
            RedisManager._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @classmethod
    def delete(self, key):
        rt = False
        try:
            rt = RedisManager._rm.delete(key)
        except Exception as e:
            RedisManager._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @classmethod
    def set_repair_info(cls, moduleName, format, timeStamp, repairResult, finishFlag, finishPercent):
        rt = False
        moduleName = get_path_by_format(format) + '/' + moduleName
        try:
            info = {'time':timeStamp, 'value':repairResult}
            v = cls._rm.hgetall(app.config['MEMCACHE_KEY_PREFIX']+app.config['REPAIR_DATA_KEY_NAME'])
            if v:
                c = v.get(moduleName)
                if c:
                    c.update(dict(flag=finishFlag, percent=finishPercent, modify=datetime.now().strftime(standard_time_format)))
                    i = c.get('info')
                    if i:
                        i.append(info)
                    else:
                        c.update({'info':[info]})
                else:
                    v = {moduleName:dict(info=[info], flag=finishFlag, percent=finishPercent, modify=datetime.now().strftime(standard_time_format))}
            else:
                v = {moduleName:dict(info=[info], flag=finishFlag, percent=finishPercent, modify=datetime.now().strftime(standard_time_format))}
            rt = cls._rm.hmset(app.config['MEMCACHE_KEY_PREFIX']+app.config['REPAIR_DATA_KEY_NAME'], v)
        except Exception as e:
            RedisManager._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @classmethod
    def get_repair_info(cls, moduleName, format, with_key):
        rt = None
        moduleName = get_path_by_format(format) + '/' + moduleName
        try:
            v = cls._rm.hgetall(app.config['MEMCACHE_KEY_PREFIX']+ app.config['REPAIR_DATA_KEY_NAME'])
            if v:
                if not with_key:
                    rt = v.get(moduleName) if v else None
                else:
                    rt = {moduleName:v.get(moduleName)}
        except Exception as e:
            RedisManager._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @classmethod
    def delete_repair_info(cls, moduleName, format):
        rt = None
        moduleName = get_path_by_format(format) + '/' + moduleName
        try:
            v = cls._rm.hgetall(app.config['MEMCACHE_KEY_PREFIX']+app.config['REPAIR_DATA_KEY_NAME'])
            if v:
                if moduleName in v:
                    v.pop(moduleName)
                    rt = cls._rm.hmset(app.config['MEMCACHE_KEY_PREFIX']+app.config['REPAIR_DATA_KEY_NAME'], v)
        except Exception as e:
            RedisManager._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
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
            RedisManager._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
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
    def get_table_list(cls):
        return cls.get(app.config['MEMCACHE_KEY_PREFIX']+ 'tableList')

    @classmethod
    def set_table_list(cls, info):
        return cls.set(app.config['MEMCACHE_KEY_PREFIX']+ 'tableList', info)

    @classmethod
    def get_weather_updatetime(cls, projId):
        return cls.get(app.config['MEMCACHE_KEY_PREFIX']+ 'weatherupdatetime%s'%str(projId))

    @classmethod
    def set_weather_updatetime(cls, projId, tt):
        return cls.set(app.config['MEMCACHE_KEY_PREFIX']+'weatherupdatetime%s'%str(projId), tt)


    @classmethod
    def get_weather_info_by_cityid(cls, cityId):
        return cls.get(app.config['MEMCACHE_KEY_PREFIX']+ 'weatherinfo%s'%str(cityId))

    @classmethod
    def set_weather_info_by_cityid(cls, cityId, tt):
        return cls.set(app.config['MEMCACHE_KEY_PREFIX']+'weatherinfo%s'%str(cityId), tt)

    @classmethod
    def get_weather_updatetime_by_cityid(cls, cityId):
        return cls.get(app.config['MEMCACHE_KEY_PREFIX']+ 'weatherupdatetime%s'%str(cityId))

    @classmethod
    def set_weather_updatetime_by_cityid(cls, cityId, tt):
        return cls.set(app.config['MEMCACHE_KEY_PREFIX']+'weatherupdatetime%s'%str(cityId), tt)


    @classmethod
    def get_weather_info(cls, projId):
        return cls.get(app.config['MEMCACHE_KEY_PREFIX']+ 'weatherinfo%s'%str(projId))

    @classmethod
    def set_weather_info(cls, projId, tt):
        return cls.set(app.config['MEMCACHE_KEY_PREFIX']+'weatherinfo%s'%str(projId), tt)

    @classmethod
    def get_calculation_trigger_flag(cls, projId):
        return cls.get(app.config['MEMCACHE_KEY_PREFIX']+ 'calculationTrigger_%d'%(int(projId)))

    @classmethod
    def set_calculation_trigger_flag(cls, projId, strFlag):
        return cls.set(app.config['MEMCACHE_KEY_PREFIX']+ 'calculationTrigger_%d'%(int(projId)), strFlag)

    @classmethod
    def hash_set(cls, taskId, itemValue, keyName=None, value=None):
        try:
            if itemValue!=None:
                if isinstance(itemValue, dict):
                    cls._rm.hset('expert_ExportData', taskId, json.dumps(itemValue, ensure_ascii=False, cls=CJsonEncoder))
            else:
                if keyName!=None and value!=None:
                    redis_data = cls._rm.hget('expert_ExportData', taskId)
                    if redis_data:
                        temp = json.loads(redis_data.decode(encoding='utf-8'))
                        if temp:
                            temp.update({keyName:value})
                            cls._rm.hset('expert_ExportData', taskId, json.dumps(temp, ensure_ascii=False, cls=CJsonEncoder))
        except Exception as e:
            RedisManager._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)

    @classmethod
    def hash_get(cls, taskId, keyName=None):
        rt = None
        try:
            if cls._rm.hexists('expert_ExportData', taskId):
                redis_data = cls._rm.hget('expert_ExportData', taskId)
                if redis_data:
                    temp = json.loads(redis_data.decode(encoding='utf-8'))
                    if temp:
                        if keyName == None:
                            rt = temp
                        else:
                            rt = temp.get(keyName)
        except Exception as e:
            RedisManager._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt


    @classmethod
    def hash_get_all(cls):
        rt = None
        try:
            redis_data = cls._rm.hgetall('expert_ExportData')
            if redis_data:
                rt = redis_data
        except Exception as e:
            RedisManager._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @classmethod
    def hash_delete_task(cls, taskId):
        rt = None
        try:
            if cls._rm.hexists('expert_ExportData', taskId):
                cls._rm.hdel('expert_ExportData', taskId)
        except Exception as e:
            RedisManager._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt


    @classmethod
    def get_alarm_flag(cls, projId):
        return cls.get(app.config['MEMCACHE_KEY_PREFIX']+ 'alarmdata_%d'%(int(projId)))


    @classmethod
    def set_alarm_flag(cls, projId, strFlag):
        return cls.set(app.config['MEMCACHE_KEY_PREFIX']+ 'alarmdata_%d'%(int(projId)), strFlag)
    
    @classmethod
    def get_alarm_real_result(cls, projId):
        return cls.get(app.config['MEMCACHE_KEY_PREFIX']+ 'expertAlarmReal_%d'%(int(projId)))

    @classmethod
    def set_alarm_real_result(cls, projId, strFlag):
        return cls.set(app.config['MEMCACHE_KEY_PREFIX']+ 'expertAlarmReal_%d'%(int(projId)), strFlag)

    @classmethod
    def get_heartbeat_time(cls, strKey):
        return cls.get(app.config['MEMCACHE_KEY_PREFIX']+ strKey)

    @classmethod
    def set_autoRepair_heartbeat_time(cls, strKey, strTime):
        return cls.set(strKey, strTime)

    @classmethod
    def set_heartbeat_time(cls, strKey, strTime):
        return cls.set(app.config['MEMCACHE_KEY_PREFIX']+ strKey, strTime)

    @classmethod
    def get_cloudpoints_site(cls, projId):
        strKey = app.config['MEMCACHE_KEY_PREFIX']+'cloudpoints_%d'%(int(projId))
        return cls.get(strKey)

    @classmethod
    def setProjectDiagnosisStatus(cls, projId, info):
        curInfo = cls.getProjectDiagnosisStatus(projId)
        curModueInfo = curInfo.get('moduleStatus')
        if curInfo is None:
            return cls.set(app.config['MEMCACHE_KEY_PREFIX'] + 'diagStatus%d'%(int(projId)), info)
        newModueInfo = info.get('moduleStatus')
        if newModueInfo and curModueInfo:
            for k,v in newModueInfo.items():
                oneModuleStatus = curModueInfo.get(k)
                if oneModuleStatus:
                    tCostLast = oneModuleStatus.get('timeCost')
                    if tCostLast:
                        tCostNew = v.get('timeCost')
                        if tCostNew<=1:
                            newModueInfo[k]['timeCost'] = tCostLast
        info['moduleStatus'] = newModueInfo
        return cls.set(app.config['MEMCACHE_KEY_PREFIX'] + 'diagStatus%d'%(int(projId)), info)

    @classmethod
    def setProjectDiagnosisStatusOnlyModules(cls, projId, modulesInfo):
        curInfo = cls.getProjectDiagnosisStatus(projId)
        if curInfo is None:
            newInfo  = dict(projectActTime= datetime.now(), projectActCostSeconds=0, moduleStatus=modulesInfo)
            return cls.set(app.config['MEMCACHE_KEY_PREFIX'] + 'diagStatus%d'%(int(projId)), newInfo)
        curModueInfo = curInfo.get('moduleStatus')
        if curModueInfo:
            curModueInfo.update(modulesInfo)
            curInfo['moduleStatus'] = curModueInfo
        else:
            curInfo['moduleStatus'] = modulesInfo
        return cls.set(app.config['MEMCACHE_KEY_PREFIX'] + 'diagStatus%d'%(int(projId)), curInfo)

    @classmethod
    def getProjectDiagnosisStatus(cls, projId):
        strKey = app.config['MEMCACHE_KEY_PREFIX'] + 'diagStatus%d'%(int(projId))
        return cls.get(strKey)

    @classmethod
    def get_project_cluster_map(cls):
        return cls.get(app.config['MEMCACHE_KEY_PREFIX'] + 'projectClusterMap')

    @classmethod
    def get_cluster_project_map(cls):
        return cls.get(app.config['MEMCACHE_KEY_PREFIX'] + 'clusterProjectMap')
