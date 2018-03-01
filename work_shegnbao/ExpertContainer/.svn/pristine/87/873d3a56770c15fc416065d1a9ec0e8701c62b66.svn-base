# -*- encoding=utf-8 -*-

__author__ = 'yan'
from ExpertContainer.api.LogOperator import LogOperator
import threading
from ExpertContainer.api.utils import *
from ExpertContainer import app
from ExpertContainer.dbAccess.RedisManager import RedisManager

class ArchiveManager:

    _Logger = LogOperator()

    RedisManager.set(app.config['MEMCACHE_KEY_PREFIX']+'median', {})
    RedisManager.set(app.config['MEMCACHE_KEY_PREFIX']+'repairInfo', {})
    RedisManager.set(app.config['MEMCACHE_KEY_PREFIX']+'group',{})

    _errStr=app.config['MEMCACHE_KEY_PREFIX']+'calcPointErrCount'
    RedisManager.set(app.config['MEMCACHE_KEY_PREFIX']+'hisdata',{})
    RedisManager.set(app.config['MEMCACHE_KEY_PREFIX']+'calculationTrigger',{})
    RedisManager.set(app.config['MEMCACHE_KEY_PREFIX']+'calculationPatch',{})
    RedisManager.set(app.config['MEMCACHE_KEY_PREFIX']+'calcTime',{})
    RedisManager.set(app.config['MEMCACHE_KEY_PREFIX']+'repairThread',{})
    RedisManager.set(app.config['MEMCACHE_KEY_PREFIX']+'StopFlag',{})
    RedisManager.set(app.config['MEMCACHE_KEY_PREFIX']+'washData', {})


    @classmethod
    def init_mem(cls):
        RedisManager.set(app.config['MEMCACHE_KEY_PREFIX']+'median', {})
        RedisManager.set(app.config['MEMCACHE_KEY_PREFIX']+'repairInfo', {})

    @classmethod
    def get_diagnosis_trigger_timeUpdate(cls,projId):
        rt=None
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+'realDiagInfo_%d'%(int(projId))
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
                return datetime.strptime(timeUpdate, standard_time_format)
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
            rt = datetime.now()-timedelta(days=1)
        return rt

    @classmethod
    def set_diagnosis_trigger_timeUpdate(cls,projId, timeUpdate):
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+'realDiagInfo_%d'%(int(projId))
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
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)



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
                return datetime.strptime(timeUpdate, standard_time_format)
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
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
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)


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
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)

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
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return rt

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
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)

    @classmethod
    def get_diagnosis_trigger_busy(cls,projId):
        rt=0
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+'diagnosisTrigger_%d'%(int(projId))
            info = RedisManager.get(strKey)
            if info is None:
                cls.set_calc_trigger_busy(projId, True)
                return False
            else:
                bBusy =  info.get('busy',None)
                if bBusy is None:
                    return False
                return bBusy
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return rt

    @classmethod
    def get_diagnosis_trigger_timeQueued(cls,projId):
        rt=None
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+'diagnosisTrigger_%d'%(int(projId))
            info = RedisManager.get(strKey)
            if info is None:
                tDefault = datetime.now()-timedelta(days=1)
                return tDefault
            else:
                timeQueued =  info.get('timeQueued',None)
                if timeQueued is None:
                    tDefault = datetime.now()-timedelta(days=1)
                    return tDefault
                return datetime.strptime(timeQueued, standard_time_format)
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return rt

    @classmethod
    def get_diagnosis_trigger_timeUpdate(cls,projId):
        rt=None
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+'diagnosisTrigger_%d'%(int(projId))
            info = RedisManager.get(strKey)
            if info is None:
                tDefault = datetime.now()-timedelta(days=1)
                cls.set_diagnosis_trigger_timeUpdate(projId, tDefault)
                return tDefault
            else:
                timeUpdate =  info['timeUpdate']
                if timeUpdate is None:
                    tDefault = datetime.now()-timedelta(days=1)
                    return tDefault
                return datetime.strptime(timeUpdate, standard_time_format)
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return rt

    @classmethod
    def set_diagnosis_trigger_timeUpdate(cls,projId, timeUpdate):
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+'diagnosisTrigger_%d'%(int(projId))
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
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)


    @classmethod
    def up_calc_patch_cache(cls,projId,flag=0):
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+ 'calculationPatch'
            content=RedisManager.get(strKey)
            if content is not None:
                content[projId]=flag
                RedisManager.set(strKey,content)
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)

    @classmethod
    def read_calc_patch_cache(cls,projId):
        rt=''
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+ 'calculationPatch'
            content=RedisManager.get(strKey)
            if content is not None:
                rt = content.get(projId)
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return rt

    @classmethod
    def up_hisdata_buffer_cache(cls,projId,hisdata_dic):
        try:
            content=RedisManager.get(app.config['MEMCACHE_KEY_PREFIX']+'hisdata')
            if content is not None:
                if hisdata_dic:
                    hisdata = content.get(projId)
                    if hisdata:
                        hisdata.update(**hisdata_dic)
                    else:
                        hisdata = hisdata_dic
                    content.update({projId:hisdata})
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)

    @classmethod
    def get_hisdata_buffer_cache(cls, projId):
        rt = {}
        try:
            content=RedisManager.get(app.config['MEMCACHE_KEY_PREFIX']+'hisdata')
            if content is not None:
                rt = content.get(projId)
        except Exception as e:
            ArchiveManager._Logger.writeLog(int(projId),'%s:'%(get_current_func_name())+e.__str__(), True)
        return rt

    @classmethod
    def get_hisdata_buffer(cls, projId, pointList):
        rt = {}
        try:
            hisdata = cls.get_hisdata_buffer_cache(projId)
            if hisdata:
                for point in pointList:
                    value = hisdata.get(point)
                    if value is not None:
                        rt[point] = value
                    else:
                        ArchiveManager._Logger.writeLog('项目%d中%s:'%(int(projId),get_current_func_name(),)+'获取点%s的历史BUFFER数据失败'%(point,), True)
            else:
                ArchiveManager._Logger.writeLog('项目%d中%s:'%(int(projId),get_current_func_name(),)+'获取项目ID=%s的数据在历史缓存中不存在'%(projId,), True)
        except Exception as e:
            ArchiveManager._Logger.writeLog('项目%d中%s:'%(int(projId),get_current_func_name())+e.__str__(), True)
        return rt

    @classmethod
    def add_group(cls, projId):
        try:
            content = RedisManager.get(app.config['MEMCACHE_KEY_PREFIX']+'group')
            if content is not None:
                if projId not in content:
                    c = {str(projId):{'A':set(),'B':set()}}
                    content.update(**c)
                    RedisManager.set('group', content)
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)

    @classmethod
    def write_group(cls, projId, pointName, bDepend):
        rt = False
        try:
            flag = 'B' if bDepend else 'A'
            f = RedisManager.get(app.config['MEMCACHE_KEY_PREFIX']+'group')
            if f is not None:
                c = f.get(str(projId))
                if c:
                    g = c.get(flag)
                    g.add(pointName)
                    if flag == 'A':
                        g_b = c.get('B')
                        if g_b:
                            g_b.discard(pointName)
                    if flag == 'B':
                        g_a = c.get('A')
                        if g_a:
                            g_a.discard(pointName)
                RedisManager.set('group', f)
                rt = True
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return rt

    @classmethod
    def read_nondepend_group(cls, projId):
        rt = []
        try:
            f = RedisManager.get(app.config['MEMCACHE_KEY_PREFIX']+'group')
            if f is not None:
                c = f.get(str(projId))
                if c:
                    g = c.get('A')
                    rt = list(g)
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return rt

    @classmethod
    def read_depend_group(cls, projId):
        rt = []
        try:
            f = RedisManager.get(app.config['MEMCACHE_KEY_PREFIX']+'group')
            if f is not None:
                c = f.get(str(projId))
                if c:
                    g = c.get('B')
                    rt = list(g)
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return rt

    @classmethod
    def writeAutoRepair(cls, processName, dic):
        rt = False
        try:
            strKey = processName
            f = RedisManager.get(strKey)
            if f is None:
                f = {}
            f = dic
            RedisManager.set(strKey, f)
            rt = True
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @classmethod
    def clearAutoRepair(cls, processName):
        rt = []
        try:
            strKey = processName
            info = RedisManager.get(strKey)
            if info != 'free':
                RedisManager.set(strKey, 'free')
            rt.append({strKey: info})

        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @classmethod
    def getAutoRepairInfo(cls):
        rt = {}
        try:
            autoRepairIdList = RedisManager.queryKeys('autoRepair*_status')
            for key in autoRepairIdList:
                key = key.decode('utf-8')
                rt[key] = RedisManager.get(key)
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @classmethod
    def write_repair(cls, projId,  obid,  dic):
        rt = False
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+'repairInfo_%d_%s'%(int(projId), obid)
            f = RedisManager.get(strKey)
            if f is None:
                f={}
            f = dic
            RedisManager.set(strKey, f)
            rt = True
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return rt

    @classmethod
    def get_repair_info(cls, projId, obid):
        rt = None
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+'repairInfo_%d_%s'%(int(projId), obid)

            f = RedisManager.get(strKey)
            if f is not None:
                return f

        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return rt

    @classmethod
    def get_repair_is_canceled(cls, projId, obid):
        rt = False
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+'repairInfo_%d_%s'%(int(projId), obid)

            f = RedisManager.get(strKey)
            if f is not None:
                iscanceled = f.get('cancel')
                if iscanceled:
                    return iscanceled==1

        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return rt

    @classmethod
    def cancel_repair(cls, projId, obid):
        rt = 0
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+'repairInfo_%d_%s'%(int(projId), obid)

            f = RedisManager.get(strKey)
            if f is not None:
                f['cancel'] = 1
                f['percent'] = '已取消'
                RedisManager.set(strKey, f)

        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return rt

    @classmethod
    def step_repair_finish(cls, projId, obid, finishType):
        rt = 0
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+'repairInfo_%d_%s'%(int(projId), obid)

            info = RedisManager.get(strKey)
            if info is not None:
                if finishType==1:
                    info['percent'] = '已完成'
                    info['cur_num'] = info.get('total')
                else:
                    info['percent'] = '已取消'
                RedisManager.set(strKey, info)

        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return rt

    @classmethod
    def reset_repair(cls, projId, obid):
        rt = 0
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+'repairInfo_%d_%s'%(int(projId), obid)

            info = RedisManager.get(strKey)
            if info is not None:
                info['percent'] = '0%'
                info['cur_num'] = 0

            RedisManager.set(strKey, info)

        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return rt

    @classmethod
    def step_repair(cls, projId,  obid, total):
        rt = 0
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+'repairInfo_%d_%s'%(int(projId), obid)

            info = RedisManager.get(strKey)
            if info is not None:
                num = info.get('cur_num')
                if num is not None:
                    if num < total:
                        num += 1
                        strTimeNow = datetime.now().strftime(standard_time_format)
                        info.update(dict(cur_num=num, percent='%.2f%%'%(num/total*100), updateTime=strTimeNow))
                        RedisManager.set(strKey, info)
                        rt = num
            else:
                ArchiveManager._Logger.writeLog('ERROR in %s: Redis key %s get None'%(get_current_func_name(), strKey)+ '', True)
                info = {}
                info['cur_num'] = 1
                info['percent'] = '%.2f%%'%(1/total*100.0)
                RedisManager.set(strKey, info)

        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return rt

    @classmethod
    def remove_repair(cls, projId,  obid):
        rt = None
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+'repairInfo_%d_%s'%(int(projId), obid)
            f = RedisManager.get(strKey)
            if f is not None:
                if obid in f:
                    rt = f.pop(obid)
                    RedisManager.set(strKey, f)
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return rt

    @classmethod
    def get_repair_info_by_project_id(cls, project_id):
        rt = {}
        try:
            obids = RedisManager.queryKeys(app.config['MEMCACHE_KEY_PREFIX']+'repairInfo_%d_*'%(int(project_id)))
            for strKey in obids:
                strKey = strKey.decode()
                obid = strKey[strKey.rfind('_')+1:]
                info = RedisManager.get(strKey)
                rt[obid] = info

        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return rt

    @classmethod
    def clear_repair(cls, project_id):
        rt = []
        try:
            obids = RedisManager.queryKeys(app.config['MEMCACHE_KEY_PREFIX']+'repairInfo_%d_*'%(int(project_id)))
            for strKey in obids:
                strKey = strKey.decode()
                obid = strKey[strKey.rfind('_')+1:]
                info = RedisManager.get(strKey)
                if info is not None:
                    RedisManager.delete(strKey)
                rt.append({obid: info})

        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return rt

    @classmethod
    def get_obid_by_project_id_and_user_id(cls, project_id, user_id):
        rt = []
        try:
            obids = RedisManager.queryKeys(app.config['MEMCACHE_KEY_PREFIX']+'repairInfo_%d_*'%(int(project_id)))
            for strKey in obids:
                obid = strKey[strKey.rfind('_')+1:]
                info = RedisManager.get(strKey)
                userId = info.get('user_id')
                if user_id == userId:
                    rt.append(obid)
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return rt

    @classmethod
    def add_error_count(cls,projId,err_count):
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+"%s_%s"%(cls._errStr,projId)
            err=RedisManager.get(strKey)
            if err is not None:
                err['count']+=err_count
            else:
                s_time=datetime.now().strftime(standard_time_format)
                err={'count':err_count,'fromTime':s_time}
            RedisManager.set(strKey, err)
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)

    @classmethod
    def read_error_count(cls,projId):
        rt = {}
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+"%s_%s"%(cls._errStr,projId)
            err=RedisManager.get(strKey)
            if err is not None:
                #c = err['count']
                rt=err
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return rt

    @classmethod
    def reload_error_count(cls,projId,err_count,t_time):
        rt=False
        try:
            if isinstance(err_count, int):
                err=RedisManager.get(app.config['MEMCACHE_KEY_PREFIX']+"%s_%s"%(cls._errStr,projId))
                if err is not None:
                    err['count']=err_count
                    err['fromTime']=t_time
                    RedisManager.set(app.config['MEMCACHE_KEY_PREFIX']+"%s_%s"%(cls._errStr,projId),err)
                    rt=True
            else:
                raise Exception("err_count must be int")
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return rt

    @classmethod
    def clear_error_count(cls,projId):
        rt = False
        try:
            err=RedisManager.get(app.config['MEMCACHE_KEY_PREFIX']+"%s_%s"%(cls._errStr,projId))
            if err is not None:
                RedisManager.delete(app.config['MEMCACHE_KEY_PREFIX']+"%s_%s"%(cls._errStr,projId))
                rt = True
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return rt

    @classmethod
    def add_error_log(cls,projId,t_time,content,point_name,type=''):

        #projId str
        try:
            strKeyName = app.config['MEMCACHE_KEY_PREFIX']+'errorlog%d'%(int(projId))
            if type=='diag':
                strKeyName = app.config['MEMCACHE_KEY_PREFIX']+'errorlog_diag%d'%(int(projId))
            errorlist = RedisManager.get(strKeyName)
            if errorlist is not None and isinstance(errorlist, list):
                errorlist.append({'projId':projId,'data':content,'logtime':t_time,'pointName':point_name})
                RedisManager.set(strKeyName, errorlist)
            else:
                RedisManager.set(strKeyName, [{'projId':projId,'data':content,'logtime':t_time,'pointName':point_name}])
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)

    @classmethod
    def read_error_log(cls, projId, type=''):
        rt = []

        try:
            strKeyName = app.config['MEMCACHE_KEY_PREFIX'] + 'errorlog%d' % (int(projId))
            if type == 'diag':
                strKeyName = app.config['MEMCACHE_KEY_PREFIX'] + 'errorlog_diag%d' % (int(projId))
            kvalue = RedisManager.get(strKeyName)
            rt = kvalue if kvalue is not None else []
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @classmethod
    def clear_error_log(cls, projId, type=''):
        rt = False

        try:
            strKeyName = app.config['MEMCACHE_KEY_PREFIX'] + 'errorlog%d' % (int(projId))
            if type == 'diag':
                strKeyName = app.config['MEMCACHE_KEY_PREFIX'] + 'errorlog_diag%d' % (int(projId))
            RedisManager.set(strKeyName, [])
            rt = True
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @classmethod
    def iAmLive(cls, strName):
        rt = False
        try:
            RedisManager.set(app.config['MEMCACHE_KEY_PREFIX'] + 'iamlive%s' % (strName,), datetime.now())
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @classmethod
    def getIsLive(cls, strName, nDiedSeconds):
        rt = False
        try:
            lastLiveTime = RedisManager.get(app.config['MEMCACHE_KEY_PREFIX'] + 'iamlive%s' % (strName,))
            if lastLiveTime is None:
                return False
            lastLiveTime = datetime.strptime(lastLiveTime, standard_time_format)
            tDelta = datetime.now() - lastLiveTime
            if tDelta.seconds > nDiedSeconds:
                return False
            else:
                return True
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt

    @classmethod
    def get_thread_objs(cls, obid):
        rt = []
        try:
            threaddict=RedisManager.get(app.config['MEMCACHE_KEY_PREFIX']+'repairThread')
            if threaddict is not None:
                rt=threaddict.get(obid, [])
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return rt

    @classmethod
    def set_thread_obj(cls, obid, obj):
        rt = False
        try:
            threaddict=RedisManager.get(app.config['MEMCACHE_KEY_PREFIX']+'repairThread')
            if threaddict is not None:
                threaddict.update({obid:[obj]})
                RedisManager.set(app.config['MEMCACHE_KEY_PREFIX']+'repairThread', threaddict)
                rt = True
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return rt

    @classmethod
    def pop_member(cls, obid):
        rt = False
        try:
            threaddict=RedisManager.get(app.config['MEMCACHE_KEY_PREFIX']+'repairThread')
            if obid in threaddict and threaddict is not None:
                threaddict.pop(obid)
                RedisManager.set(app.config['MEMCACHE_KEY_PREFIX']+'repairThread', threaddict)
                rt = True
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return rt

    @classmethod
    def set_diagnosis_trigger_queued(cls,projId, bQueued):
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+'diagnosisTrigger_%d'%(int(projId))
            info = RedisManager.get(strKey)
            if info is None:
                RedisManager.set(strKey,dict(timeUpdate = datetime.now()-timedelta(days=1), queued = bQueued))
            else:
                if bQueued is not None:
                    info['queued'] = bQueued
                    info['timeQueued'] = datetime.now()
                else:
                    info['queued'] = 0

                RedisManager.set(strKey,info)
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)

    @classmethod
    def get_diagnosis_trigger_queued(cls,projId):
        rt=0
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+'diagnosisTrigger_%d'%(int(projId))
            info = RedisManager.get(strKey)
            if info is None:
                cls.set_calc_trigger_busy(projId, True)
                return False
            else:
                bQueued =  info.get('queued', None)
                if bQueued is None:
                    return False
                return bQueued
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return rt


    @classmethod
    def set_calc_trigger_queued(cls,projId, bQueued):
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+'realCalInfo_%d'%(int(projId))
            info = RedisManager.get(strKey)
            if info is None:
                RedisManager.set(strKey,dict(timeUpdate = datetime.now()-timedelta(days=1), queued = bQueued))
            else:
                if bQueued is not None:
                    info['queued'] = bQueued
                else:
                    info['queued'] = 0

                RedisManager.set(strKey,info)
        except Exception as e:
            return False

    @classmethod
    def get_calc_trigger_queued(cls,projId):
        rt=0
        try:
            strKey = app.config['MEMCACHE_KEY_PREFIX']+'realCalInfo_%d'%(int(projId))
            info = RedisManager.get(strKey)
            if info is None:
                cls.set_calc_trigger_busy(projId, True)
                return False
            else:
                bQueued =  info.get('queued', None)
                if bQueued is None:
                    return False
                return bQueued
        except Exception as e:
            return False
        return rt


    @classmethod
    def write_wash_data(cls, projId, userId, points, methods, total, startTime, filter_method, pulse, status=0):
        rt = False
        try:
            key = app.config['MEMCACHE_KEY_PREFIX']+'washData_{}'.format(projId)
            num = app.config['MEMCACHE_KEY_PREFIX'] + 'washData_{}_total'.format(projId)
            # cls.set_wash_status(projId, status)
            cache = RedisManager.get(key) if RedisManager.get(key) else {}
            cache.update(dict(user=userId, points=points,
                              methods=methods, startTime=startTime,
                              filter=filter_method, pulse=pulse
                              ))
            RedisManager.set(num, total)
            rt = RedisManager.set(key, cache)
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt


    @classmethod
    def write_complete_num(cls, projId, com=1, endTime=None):
        rt = False
        try:
            complete = app.config['MEMCACHE_KEY_PREFIX'] + 'washData_{}_cmp'.format(projId)
            com_num = RedisManager.get(complete) if RedisManager.get(complete) else 0
            if com == -1:  # 初始化完成数
                rt = RedisManager.set(complete, 0)
            else:
                rt = RedisManager.set(complete, com_num+com)
            et = app.config['MEMCACHE_KEY_PREFIX'] + 'washData_{}_et'.format(projId)
            if endTime:
                cls.set_wash_status(projId, 2)
            RedisManager.set(et, endTime)
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt


    @classmethod
    def get_wash_data(cls, projId):
        rt = None
        try:
            key = app.config['MEMCACHE_KEY_PREFIX'] + 'washData_{}'.format(projId)
            total = app.config['MEMCACHE_KEY_PREFIX'] + 'washData_{}_total'.format(projId)
            complete = app.config['MEMCACHE_KEY_PREFIX'] + 'washData_{}_cmp'.format(projId)
            et = app.config['MEMCACHE_KEY_PREFIX'] + 'washData_{}_et'.format(projId)
            status = app.config['MEMCACHE_KEY_PREFIX'] + 'washData_{}_status'.format(projId)
            endTime = RedisManager.get(et)
            complete = RedisManager.get(complete) if RedisManager.get(complete) is not None else 0
            total = RedisManager.get(total) if RedisManager.get(total) is not None else 0
            rate = "{:.2f}%".format(complete / total * 100) if complete > 0 else "0.00%"
            rt = RedisManager.get(key)
            status = RedisManager.get(status)
            if endTime:  # 如果任务完成, 则把进度设置为100%
                rate = "100.00%"
            rt.update(dict(process=rate, endTime=endTime, status=status))
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:' % (get_current_func_name())+e.__str__(), True)
        return rt


    @classmethod
    def get_wash_status(cls, project_id):
        rt = None
        try:
            rt = RedisManager.get(app.config['MEMCACHE_KEY_PREFIX']+'washData_{}_status'.format(project_id))
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return rt


    @classmethod
    def set_wash_status(cls, projId, status=0):
        rt = False
        try:
            key = app.config['MEMCACHE_KEY_PREFIX'] + 'washData_{}_status'.format(projId)
            rt = RedisManager.set(key, status)
        except Exception as e:
            ArchiveManager._Logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        return rt