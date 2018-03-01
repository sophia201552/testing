__author__ = 'yan'

from ExpertContainer.dbAccess import mongo_operator
from ExpertContainer.api.utils import *
from ExpertContainer.api.ArchiveManager import ArchiveManager
from ExpertContainer.api.cacheProfile import DataManager
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from ExpertContainer.api.CalPointManager import CalPointManager
from ExpertContainer.logic.LogicBase import LogicBase
from ExpertContainer.dbAccess.RedisManager import RedisManager
import sys
import threading


strProcessName = 'RealCalcQueue_1'


def callback(ch, method, _, body):
    projId = None
    ArchiveManager.iAmLive(strProcessName)
    try:
        msgb = body.decode(encoding='utf-8')
        logging.debug('callback msg: %s', msgb)
        msg = json.loads(msgb)
        tCost0 = tCost01 = tCost02 = tCost03 = tCost1 = tCost2 = tCost3 = tCost4 = tCost5 = tCost6 = tCost7 = -1
        if msg:
            bCalculatedJustNow = False
            bNewProject = False
            projId = int(msg.get('projId'))
            if not BEOPDataAccess.is_belong_to_local_cluster(projId):
                logging.warning('项目%s不属于该当前集群，忽略', projId)
                ch.basic_ack(delivery_tag=method.delivery_tag)
                return True

            timeUpdate = msg.get('timeUpdate')  # 这批数据的现场时间
            logging.info('====项目%d消息实时计算开始, 现场时间%s====', projId, timeUpdate)

            try:
                timeSite = datetime.strptime(timeUpdate, standard_time_format).replace(second=0)
            except Exception:
                timeSite = datetime.now().replace(second=0)
                logging.info('timeSite error: ' + str(timeSite) + 'projId: ' + str(projId))
            actTimeStart = datetime.now()

            t = ArchiveManager.get_calc_trigger_timeUpdate(projId)
            nMinCalculationSeconds = 30
            if t is None:
                bNewProject = True
            else:
                if (datetime.now() - t) < timedelta(seconds=nMinCalculationSeconds):
                    bCalculatedJustNow = True

            if not bNewProject:
                if bCalculatedJustNow:
                    logging.warning('项目%s在%s秒内计算过，放弃', projId, nMinCalculationSeconds)
                    ArchiveManager.set_calc_trigger_busy(projId, False)
                    ArchiveManager.set_calc_trigger_queued(projId, False)
                    ch.basic_ack(delivery_tag=method.delivery_tag)
                    return True

            # 查看计算标识，为0且占用时间不超过5分钟则计算
            bBusy = ArchiveManager.get_calc_trigger_busy(projId)
            if bBusy:
                if (datetime.now() - t) < timedelta(seconds=60 * 5):
                    logging.warning('项目%s当前被其他请求处理占用中，放弃', projId)
                    ArchiveManager.set_calc_trigger_busy(projId, False)
                    ArchiveManager.set_calc_trigger_queued(projId, False)
                    ch.basic_ack(delivery_tag=method.delivery_tag)
                    return True
                else:
                    logging.warning('项目%s当前被其他请求处理占用，但是超时，强制进入计算', projId)

            ArchiveManager.set_calc_trigger_busy(projId, True)

            ismakefile = CalPointManager.make_calcpoint_py_file_by_projId(strProcessName, projId)
            if ismakefile[0]:
                moduleName = ismakefile[1]
                if moduleName != '':
                    logging.debug('写入现场点数据进buffer：项目%s', projId)
                    BEOPDataAccess.getInstance().clearOverdueDataInBufferTable(projId)
                    allSitePointsValues = DataManager.set_realdata_flag_0(projId)
                    logging.debug('写入现场点数据进buffer成功：项目%s', projId)
                    module_name = moduleName[:moduleName.rfind('.py')]
                    work_path = get_current_directory()
                    calcpoint_path = add_dir_to_path(work_path, 'calcpoint')
                    format = ismakefile[2]
                    try:
                        mod = load_module_dynamic(module_name, add_dir_to_path(calcpoint_path, format))
                    except:
                        ch.basic_ack(delivery_tag=method.delivery_tag)
                        logging.error('计算点生成文件有错误，项目：' + str(projId))
                        return True
                    logging.debug('load_module_dynamic成功：项目%s', projId)
                    if mod:
                        attr = getattr(mod, 'LogicAct')
                        if attr:
                            ins = attr(projId, timeSite, format, LogicBase.REALTIME)  # realtime
                            logging.debug('实例化 成功：项目%s', projId)

                            cloudSitePointsAll = mongo_operator.getCloudPointSiteType(projId)
                            ins.initCloudSitePoints(cloudSitePointsAll)

                            # 实时计算时将前面读到的原始现场数据准备到这里，避免再次读取原始现场数据库
                            ins.initDataCacheByValueLists(allSitePointsValues)

                            tCost0 = (datetime.now() - actTimeStart).seconds
                            ins.before_actlogic()
                            tCost01 = (datetime.now() - actTimeStart).seconds
                            ins.actlogic()
                            tCost02 = (datetime.now() - actTimeStart).seconds
                            ins.after_actlogic()
                            tCost03 = (datetime.now() - actTimeStart).seconds
                            logging.debug('执行计算逻辑成功：项目%s', projId)

                            ArchiveManager.set_calc_trigger_timeUpdate(projId, datetime.now())
                            tCost1 = (datetime.now() - actTimeStart).seconds
                            if ins:
                                del ins
                            tCost2 = (datetime.now() - actTimeStart).seconds
                            if module_name in sys.modules:
                                sys.modules.pop(module_name)
                            tCost3 = (datetime.now() - actTimeStart).seconds
                            if os.path.exists(moduleName):
                                os.remove(moduleName)
                            tCost4 = (datetime.now() - actTimeStart).seconds
                        else:
                            logging.error('getattr失败')
                    else:
                        logging.error('load_module_dynamic失败! module_name=%s, calcpoint_path=%s, format=%s',
                                      module_name, calcpoint_path, format)

                    tCost5 = (datetime.now()-actTimeStart).seconds
                    ArchiveManager.clear_error_log(projId)
                    tCost6 = (datetime.now()-actTimeStart).seconds
                else:
                    DataManager.set_realdata_flag_0(projId)
                    ArchiveManager.set_calc_trigger_timeUpdate(projId, datetime.now())
                    logging.info('项目%s计算点为空', projId)

            ArchiveManager.set_calc_trigger_busy(projId, False)
            ArchiveManager.set_calc_trigger_queued(projId, False)
            tCost7 = (datetime.now()-actTimeStart).seconds

        if tCost7 > 30.0:
            logging.warning(
                '项目%s计算耗时过长: %d,%d,%d,%d,%d,%d,%d,%d,%d,%d,%d',
                projId, tCost0, tCost01, tCost02, tCost03, tCost1, tCost2, tCost3, tCost4, tCost5, tCost6, tCost7)

        logging.info('====项目%s消息实时计算完毕:成功, 总耗时:%s====', projId, tCost7)
        # 计算完毕，将计算标志置0
        RedisManager.set_calculation_trigger_flag(projId, '0')
        ch.basic_ack(delivery_tag=method.delivery_tag)
        return True
    except SyntaxError as e:
        if projId is not None:
            ArchiveManager.set_calc_trigger_busy(projId, False)
            ArchiveManager.set_calc_trigger_queued(projId, False)
        syntaxErrPointName = getPointNameInLogicFileByLine(e.filename, e.lineno)
        logging.error('项目%s消息消费完毕，点名: %s, 语法错误: %s', projId, syntaxErrPointName, e.text)
        ch.basic_ack(delivery_tag=method.delivery_tag)
        return True
    except:
        if projId is not None:
            ArchiveManager.set_calc_trigger_busy(projId, False)
            ArchiveManager.set_calc_trigger_queued(projId, False)
        logging.error('项目%s消息消费完毕，发生错误！', projId, exc_info=True, stack_info=True)
        ch.basic_ack(delivery_tag=method.delivery_tag)
        return True


def runConsume():
    while True:
        try:
            logging.info('********点计算主进程重启********')
            credentials = pika.PlainCredentials(app.config['MQ_USERNAME'], app.config['MQ_PASSWORD'])
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(host=app.config['MQ_ADDRESS'], credentials=credentials))
            channel = connection.channel()
            channel.queue_declare(queue=app.config['MQ_RECEIVE_TRIGGER_NAME'], durable=True)

            channel.basic_qos(prefetch_count=1)
            channel.basic_consume(callback, queue=app.config['MQ_RECEIVE_TRIGGER_NAME'])
            channel.start_consuming()
        except Exception:
            logging.error('消息处理进程意外中止!', exc_info=True, stack_info=True)
            time.sleep(30)


def heartbeat_router():
    try:
        while True:
            now_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            RedisManager.set_heartbeat_time("heartbeat_real", now_time)
            time.sleep(10)
    except Exception:
        logging.error('Failed to heartbeat router!', exc_info=True, stack_info=True)


if __name__ == '__main__':
    strProcessName = sys.argv[1] if len(sys.argv) > 1 else 'RealCalcQueue_1'
    if strProcessName == 'test':
        strProcessName = 'RealCalcQueue-test'
    t = threading.Thread(target=heartbeat_router, name='heartbeat_real', daemon=True)
    t.start()
    runConsume()
