__author__ = 'Eric'

from ExpertContainer.api.utils import *
from ExpertContainer.api.LogOperator import LogOperator
from ExpertContainer.dbAccess import mongo_operator, mongo_errorlog_operator
from ExpertContainer.api.utils import *
from ExpertContainer.api.ArchiveManager import ArchiveManager
from ExpertContainer.dbAccess.ConfigMongoDBAccess import ConfigMongoDBAccess
from ExpertContainer.api.cacheProfile import DataManager
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from ExpertContainer.dbAccess.MongoConnManager import MongoConnManager
from ExpertContainer.api.CalPointManager import CalPointManager
from ExpertContainer.mqAccess.MQManager import MQManager
from ExpertContainer.api.LogOperatorListen import LogOperatorListen
from ExpertContainer.logic.LogicBase import LogicBase
from ExpertContainer.dbAccess.RedisManager import RedisManager
import socket
import traceback
import sys
import threading

_logger = None
strProcessName = 'ForceCalcQueue_1'


def callback(ch, method, properties, body):
    projId = None
    ArchiveManager.iAmLive(strProcessName)
    try:
        if app.config['LOGGING_LEVEL']<=0:
            print('call back msg'+body.decode(encoding='utf-8'))

        msgb=body.decode(encoding='utf-8')
        msg = json.loads(msgb)
        if msg:
            bCalculatedJustNow =True
            bNewProject = False
            projId=int(msg.get('projId'))

            timeUpdate = msg.get('timeUpdate')  # 这批数据的现场时间
            timeSite = None
            try:
                timeSite = datetime.strptime(timeUpdate, standard_time_format).replace(second=0)
            except Exception:
                timeSite = datetime.now().replace(second=0)

            actTimeStart = datetime.now()
            tCost0 = tCost01 = tCost02 = tCost03 = tCost1 = tCost2 = tCost3 = tCost4 = tCost5 = tCost6 = tCost7 = -1
            actTimeInfo = {}
            if projId==121:
                t =  ArchiveManager.get_calc_trigger_timeUpdate(projId)
                if t is not None:
                    if (datetime.now() - t)<timedelta(seconds=30):
                        ch.basic_ack(delivery_tag = method.delivery_tag)
                        return True

            ArchiveManager.set_calc_trigger_busy(projId,True)

            ismakefile= CalPointManager.make_calcpoint_py_file_by_projId(strProcessName, projId)
            if ismakefile[0]:
                moduleName = ismakefile[1]
                if moduleName!='':

                    if app.config['LOGGING_LEVEL']<=0:
                        _logger.writeLog('写入现场点数据进buffer：项目%s'%(projId,),True)
                    BEOPDataAccess.getInstance().clearOverdueDataInBufferTable(projId)
                    allSitePointsValues = DataManager.set_realdata_flag_0(projId)
                    if app.config['LOGGING_LEVEL']<=0:
                        _logger.writeLog('写入现场点数据进buffer成功：项目%s'%(projId,),True)

                    module_name = moduleName[:moduleName.rfind('.py')]
                    work_path = get_current_directory()
                    calcpoint_path = add_dir_to_path(work_path, 'calcpoint')
                    format=ismakefile[2]
                    mod = load_module_dynamic(module_name, add_dir_to_path(calcpoint_path, format))

                    if app.config['LOGGING_LEVEL']<=0:
                        _logger.writeLog('load_module_dynamic 成功：项目%s'%(projId,),True)
                    if mod:
                        ins = None
                        attr = getattr(mod, 'LogicAct')
                        if attr:
                            ins = attr(projId, datetime.now(), format, LogicBase.REALTIME) #realtime
                            if app.config['LOGGING_LEVEL']<=0:
                                _logger.writeLog('实例化 成功：项目%s'%(projId,),True)

                            cloudSitePointsAll = mongo_operator.getCloudPointSiteType(projId)
                            ins.initCloudSitePoints(cloudSitePointsAll)

                            ins.initDataCacheByValueLists(allSitePointsValues) #实时计算时将前面读到的原始现场数据准备到这里，避免再次读取原始现场数据库

                            tCost0 = (datetime.now()-actTimeStart).seconds
                            ins.before_actlogic()
                            tCost01 = (datetime.now()-actTimeStart).seconds
                            ins.actlogic()
                            tCost02 = (datetime.now()-actTimeStart).seconds
                            ins.after_actlogic()
                            tCost03 = (datetime.now()-actTimeStart).seconds
                            if app.config['LOGGING_LEVEL']<=0:
                                _logger.writeLog('执行计算逻辑成功：项目%s'%(projId,),True)

                            ArchiveManager.set_calc_trigger_timeUpdate(projId, datetime.now())
                            tCost1 = (datetime.now()-actTimeStart).seconds
                            if ins:
                                del ins
                            tCost2 = (datetime.now()-actTimeStart).seconds
                            if module_name in sys.modules:
                                sys.modules.pop(module_name)
                            tCost3 = (datetime.now()-actTimeStart).seconds
                            if os.path.exists(moduleName):
                                os.remove(moduleName)
                            tCost4 = (datetime.now()-actTimeStart).seconds
                        else:
                            _logger.writeLog('ERROR：getattr failed'%(),True)
                    else:
                        _logger.writeLog('ERROR：load_module_dynamic failed'%(),True)

                    mongo_errorlog_operator.flush_logData_into_db(projId)
                    tCost5 = (datetime.now()-actTimeStart).seconds
                    ArchiveManager.clear_error_log(projId)
                    tCost6 = (datetime.now()-actTimeStart).seconds
                else:
                    DataManager.set_realdata_flag_0(projId)
                    ArchiveManager.set_calc_trigger_timeUpdate(projId, datetime.now())
                    _logger.writeLog('Project %d calculation point empty'%(int(projId)),True)
            ArchiveManager.set_calc_trigger_busy(projId, False)
            tCost7 = (datetime.now()-actTimeStart).seconds

        if tCost7>30.0:
            _logger.writeLog('ERROR: 项目%s计算耗时过长: %d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d'%(projId,tCost0,tCost01, tCost02, tCost03, tCost1,tCost2,tCost3,tCost4,tCost5,tCost6,tCost7),True)
        else:
            _logger.writeLog('项目%s消息接受并消费完毕:成功, 总耗时:%d'%(projId,tCost7),True)
        #计算完毕，将计算标志置0
        RedisManager.set_calculation_trigger_flag(projId, '0')
        ch.basic_ack(delivery_tag = method.delivery_tag)
        return True
    except SyntaxError as e:
        if projId is not None:
            ArchiveManager.set_calc_trigger_busy(projId, False)
        syntaxErrPointName = getPointNameInLogicFileByLine(e.filename, e.lineno)
        mongo_errorlog_operator.insertPointLog(projId, syntaxErrPointName, '语法错误: %s'%(e.text))
        _logger.writeLog('ERROR:项目%s消息消费完毕，语法意外:'%(projId)+e.__str__(), True)
        ch.basic_ack(delivery_tag = method.delivery_tag)
        return True
    except Exception as e:
        if projId is not None:
            ArchiveManager.set_calc_trigger_busy(projId, False)
        _logger.writeLog('项目%s消息消费完毕:意外:'%(projId)+e.__str__(), True)
        traceback.print_stack()
        ch.basic_ack(delivery_tag = method.delivery_tag)
        return True

def runConsume():
    try:
        _logger.writeLog('%s:'%(get_current_func_name())+'计算点立即执行队列监听线程启动',True)
        credentials = pika.PlainCredentials(app.config['MQ_USERNAME'],app.config['MQ_PASSWORD'])
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=app.config['MQ_ADDRESS'],credentials = credentials))
        channel = connection.channel()
        channel.queue_declare(queue=app.config['MQ_RECEIVE_FORCE_NAME'], durable=True)

        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(callback, queue=app.config['MQ_RECEIVE_FORCE_NAME'])
        channel.start_consuming()
    except Exception as e:
        _logger.writeLog('消息处理进程意外中止'+e.__str__(), True)
        #traceback.print_stack()


def heartbeat_router():
    try:
        while True:
            now_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            RedisManager.set_heartbeat_time("heartbeat_force", now_time)
            time.sleep(10)
    except Exception as e:
        print(e)


if __name__ == '__main__':
    strProcessName = sys.argv[1] if len(sys.argv)>1 else 'ForceCalcQueue_1'
    if strProcessName == 'test':
        strProcessName = 'ForceCalcQueue-test'
    myname = socket.getfqdn(socket.gethostname())
    _logger = LogOperatorListen(strProcessName+'_'+myname)
    t = threading.Thread(target=heartbeat_router, name='heartbeat_force', daemon=True)
    t.start()
    runConsume()
