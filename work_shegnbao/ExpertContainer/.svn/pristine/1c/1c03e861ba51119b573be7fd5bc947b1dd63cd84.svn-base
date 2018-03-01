# -*- encoding=utf-8 -*-
__author__ = 'eric'

import threading
from ExpertContainer.api.LogOperator import LogOperator
from ExpertContainer.dbAccess import mongo_operator
from datetime import datetime
from ExpertContainer.api.utils import *
from ExpertContainer.dbAccess.ConfigMongoDBAccess import ConfigMongoDBAccess
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from ExpertContainer.api.views import *
from ExpertContainer.mqAccess.MQManager import MQManager

#c
class CalcPointFixedTime(threading.Thread):

    _logger = LogOperator()

    def __init__(self,name):
        threading.Thread.__init__(self)
        self.name = name

    def run(self):
        while True:
            try:
                projsSetting=mongo_operator.get_data_manage_setting()
                for item in projsSetting:
                    data = dict(projId = item.get("projId"),pointList = None, bWaitForFinish = False, timeUpdate= datetime.now().strftime('%Y-%m-%d %H:%M:%S') )
                    nProjId = int(item.get("projId"))
                    if BEOPDataAccess.is_belong_to_local_cluster(nProjId):
                        jsonData = json.dumps(data,ensure_ascii=False)
                        if item.get("triggerReal") and item.get("triggerReal").get('fixed_time'):
                            bBusy = ArchiveManager.get_calc_trigger_busy(nProjId)
                            t =  ArchiveManager.get_calc_trigger_timeUpdate(nProjId)
                            if bBusy and ((datetime.now() - t)<timedelta(seconds=60*15)):
                                CalcPointFixedTime._logger.writeLog('项目%s计算正忙，触发忽略'%(item.get("projId"),),True)
                            else:
                                MQManager.RabbitMqWorkQueueSend(app.config['MQ_RECEIVE_TRIGGER_NAME'],jsonData)
                                CalcPointFixedTime._logger.writeLog('项目%s触发一次计算'%(item.get("projId"),),True)

                        if item.get("triggerDiagnosis") and item.get("triggerDiagnosis").get('fixed_time'):
                            bBusy = ArchiveManager.get_diagnosis_trigger_busy(nProjId)
                            bQueued = ArchiveManager.get_diagnosis_trigger_queued(nProjId)
                            t =  ArchiveManager.get_diagnosis_trigger_timeUpdate(nProjId)
                            tQueued = ArchiveManager.get_diagnosis_trigger_timeQueued(nProjId)
                            bCalculationTimeout = ((datetime.now() - t)>timedelta(seconds=60*60))
                            bQueuedTimeout = ((datetime.now() - tQueued)>timedelta(seconds=60*60))
                            if bBusy and not bCalculationTimeout:
                                CalcPointFixedTime._logger.writeLog('项目%d诊断正忙，触发忽略'%(nProjId,),True)
                            elif bQueued and not bQueuedTimeout:
                                CalcPointFixedTime._logger.writeLog('项目%d诊断已经排队中，触发忽略'%(nProjId,),True)
                            else:
                                MQManager.RabbitMqWorkQueueSend(app.config['MQ_RECEIVE_DIAGNOSIS_NAME'],jsonData)
                                ArchiveManager.set_diagnosis_trigger_queued(nProjId,True)
                                CalcPointFixedTime._logger.writeLog('项目%d触发一次诊断'%(nProjId,),True)



                time.sleep(60)
                RedisManager.set_heartbeat_time('heartbeat_fix', datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
            except Exception as e:
                CalcPointFixedTime._logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
                traceback.print_stack()
