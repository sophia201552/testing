__author__ = 'yan'

from ExpertContainer.api.utils import get_current_func_name
from ExpertContainer.api.LogOperator import LogOperator
import sys
from ExpertContainer.api.utils import *
from ExpertContainer.api.ArchiveManager import ArchiveManager
from ExpertContainer.dbAccess.ConfigMongoDBAccess import ConfigMongoDBAccess
from ExpertContainer.api.cacheProfile import DataManager
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from ExpertContainer.dbAccess.MongoConnManager import MongoConnManager
from ExpertContainer.api.DependAnalyst import DependAnalyst
from ExpertContainer.dbAccess import mongo_operator, mongo_errorlog_operator
from ExpertContainer.logic.LogicBase import LogicBase
from ExpertContainer.api.CalPointManager import CalPointManager
import socket
from ExpertContainer.api.errorLog import errorLog
from ExpertContainer.dbAccess.RedisManager import RedisManager
from ExpertContainer.api.LogOperatorListen import LogOperatorListen
import threading


_logger = None
strProcessName = 'DiagCalcQueue_1'

def callback(ch, method, properties, body):
    projId = None

    try:
        ArchiveManager.iAmLive(strProcessName)
        msgb=body.decode(encoding='utf-8')
        msg = json.loads(msgb)
        if msg:
            # bCalculatedJustNow =False
            # bNewProject = False
            projId=int(msg.get('projId'))
            bBusy =  ArchiveManager.get_diagnosis_trigger_busy(projId)
            if bBusy:
                 tUpdateLast = ArchiveManager.get_diagnosis_trigger_timeUpdate(int(projId))
                 if tUpdateLast is not None and (datetime.now() - tUpdateLast).total_seconds()<15*60:
                     _logger.writeLog('项目%d诊断有其他任务正在处理，放弃'%(int(projId),),True)
                     ch.basic_ack(delivery_tag = method.delivery_tag)
                     return True

            _logger.writeLog('==================开始执行项目%d诊断模块'%(int(projId),),True)
            t0 = datetime.now()
            ArchiveManager.set_diagnosis_trigger_busy(projId,True)
            ArchiveManager.set_diagnosis_trigger_timeUpdate(int(projId), datetime.now())
            _logger.writeLog('开始--生成项目%d诊断文件'%(int(projId),),True)
            if CalPointManager.make_diagnosis_py_file_by_projId(projId):
                _logger.writeLog('完成--生成项目%d诊断文件'%(int(projId),),True)
                file_name = "diagnosis_"+str(projId)+".py"
                path = get_diagnosis_path_real()
                full_path = path+"/"+file_name
                module_name = full_path[:full_path.rfind('.py')]
                mod = load_module_dynamic(module_name, path)
                if mod:
                    ins = None
                    attr = getattr(mod, 'LogicAct')
                    if attr:
                        ins = attr(projId, datetime.now(), None, LogicBase.REALTIME)
                        _logger.writeLog('预处理 - 项目%d诊断'%(int(projId),),True)
                        ins.before_actlogic_diagnosis()
                        _logger.writeLog('处理 - 项目%d诊断'%(int(projId),),True)
                        ins.actlogic()
                        _logger.writeLog('后处理 - 项目%d诊断'%(int(projId),),True)
                        ins.after_actlogic()
                        if ins:
                            del ins
                        if module_name in sys.modules:
                            sys.modules.pop(module_name)
                        if os.path.exists(full_path):
                            os.remove(full_path)

            ArchiveManager.set_diagnosis_trigger_busy(projId, False)
            ArchiveManager.set_diagnosis_trigger_queued(projId,False)
        mongo_errorlog_operator.flush_logData_into_db(projId,'diag')
        ArchiveManager.clear_error_log(projId,'diag')
        tCostAll =  (datetime.now()-t0).total_seconds()
        _logger.writeLog('==================项目诊断%d消息消费完毕:成功, 耗时%d秒'%(projId, int(tCostAll)),True)
        ch.basic_ack(delivery_tag = method.delivery_tag)
        return True
    except SyntaxError as e:
        if projId is not None:
            ArchiveManager.set_diagnosis_trigger_busy(projId, False)
            ArchiveManager.set_diagnosis_trigger_queued(projId,False)
            strModuleName = getPointNameInLogicFileByLine(e.filename, e.lineno)
            errorLog.writeLog(projId,e.__str__() + ' code: '+e.text, True,strModuleName,'diag')
            mongo_errorlog_operator.flush_logData_into_db(projId,'diag')
            ArchiveManager.clear_error_log(projId,'diag')
        ch.basic_ack(delivery_tag = method.delivery_tag)
        return True
    except Exception as e:
        if projId is not None:
            ArchiveManager.set_diagnosis_trigger_busy(projId, False)
            ArchiveManager.set_diagnosis_trigger_queued(projId,False)
            _logger.writeLog('项目诊断%s意外错误:'%(projId)+e.__str__(), True)
        ch.basic_ack(delivery_tag = method.delivery_tag)
        return True


def runConsume():
    while True:
        try:
            _logger.writeLog('消息处理进程启动', True)
            credentials = pika.PlainCredentials(app.config['MQ_USERNAME'],app.config['MQ_PASSWORD'])
            connection = pika.BlockingConnection(pika.ConnectionParameters(host=app.config['MQ_ADDRESS'],credentials = credentials))
            channel = connection.channel()
            channel.queue_declare(queue=app.config['MQ_RECEIVE_DIAGNOSIS_NAME'], durable=True)

            channel.basic_qos(prefetch_count=1)
            channel.basic_consume(callback, queue=app.config['MQ_RECEIVE_DIAGNOSIS_NAME'])
            channel.start_consuming()
        except Exception as e:
            _logger.writeLog('消息处理进程意外中止error:'+e.__str__(), True)
            time.sleep(15)



def heartbeat_router():
    try:
        while True:
            now_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            RedisManager.set_heartbeat_time("heartbeat_diag", now_time)
            time.sleep(10)
    except Exception as e:
        print(e)


if __name__ == '__main__':
    strProcessName = sys.argv[1] if len(sys.argv)>1 else 'DiagnosisCalcQueue_1'
    if strProcessName == 'test':
        strProcessName = 'DiagnosisCalcQueue-test'
    myname = socket.getfqdn(socket.gethostname())
    _logger = LogOperatorListen(strProcessName+'_'+myname)
    t = threading.Thread(target=heartbeat_router, name='heartbeat_diag', daemon=True)
    t.start()
    runConsume()
