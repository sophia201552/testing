__author__ = 'yan'

from ExpertContainer.api.utils import *
import threading
import socket
import pika

from ExpertContainer.api import *
from ExpertContainer.api.utils import *
from ExpertContainer.api.ArchiveManager import ArchiveManager
from ExpertContainer.dbAccess.ConfigMongoDBAccess import ConfigMongoDBAccess
from ExpertContainer.api.cacheProfile import DataManager
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from ExpertContainer.dbAccess.MongoConnManager import MongoConnManager
from ExpertContainer.api.DependAnalyst import DependAnalyst
from ExpertContainer.api.CalPointManager import CalPointManager
from ExpertContainer.dbAccess.RedisManager import RedisManager
import platform

strProcessName = 'RepairCalcQueue_1'
import subprocess
from subprocess import CalledProcessError


def heartbeat_router():
    try:
        while True:
            now_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            RedisManager.set_heartbeat_time("heartbeat_repair", now_time)
            time.sleep(10)
    except Exception:
        logging.error("Failed to heartbeat router!", exc_info=True)


def getRunningProcessCount():
    count = 0
    strPlatform = platform.system().lower()
    command = 'ps -ef | grep python' if strPlatform == 'windows' else 'ps -ef | grep python3.4'
    resp = os.popen(command)
    for item in resp.readlines():
        if 'RepairOneTask' in item and 'Auto' not in item:
            count += 1
    return count // app.config.get('REPAIR_DIVIDE', 1)


def isTaskInProcessing(projId, obid):
    info = ArchiveManager.get_repair_info_by_project_id(projId)
    needPatchObidList = []
    thread_arr = []
    for k,v in info.items():
        if k != obid:
            continue
        percent = v.get('percent')
        if percent is None:
            return False
        elif percent == '排队中':
            return False
        elif percent == '已取消' or percent == '已完成':
            return True
        try:
            fPercent = float(percent[:-1])
        except Exception:
            return False
        updateTime = v.get('updateTime')

        if updateTime is None:
            continue
        tUpdate = datetime.strptime(updateTime, standard_time_format)

        nSecondsSpan = (datetime.now()-tUpdate).total_seconds()

        curNum = v.get('cur_num')
        tFrom = datetime.strptime(v.get('time_from'), standard_time_format)
        tTo = datetime.strptime(v.get('time_to'), standard_time_format)
        tFormat = v.get('format')
        needTList = []
        tRealStart = tFrom
        if tFormat == 'm5':
            tRealStart = tFrom + timedelta(minutes=(curNum - 1) * 5)

        return (tRealStart.strftime(standard_time_format), v.get('total'))

    return False


def callback(ch, method, _, body):
    def mq_nack():
        timeNow = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        nack_success = False
        for i in range(0, 5):
            try:
                ch.basic_nack(delivery_tag=method.delivery_tag)
                logging.info('消息队列nack时间: %s', timeNow)
                nack_success = True
                break
            except Exception:
                time.sleep(3)
        if not nack_success:
            logging.error("消息队列nack出错: %s" % timeNow)
        time.sleep(5)
    try:
        logging.info('手动补数进入callback: %s', body)
        strPlatform = platform.system().lower()
        ArchiveManager.iAmLive(strProcessName)
        count = getRunningProcessCount()
        if count < 12:
            try:
                msgb = body.decode(encoding='utf-8')
                msg = json.loads(msgb)
                if msg:
                    projId = msg.get('projId')
                    if BEOPDataAccess.is_belong_to_local_cluster(int(projId)):
                        logging.info('收到一条手动补项目%s历史消息(id:%s),开始处理', projId, msg.get('calcObjectId'))
                        infoProcessing = isTaskInProcessing(int(projId), msg.get('calcObjectId'))
                        if not infoProcessing:
                            logging.info('项目%s手动补历史消息消费进程启动', projId)
                            if strPlatform == 'windows':
                                strCommand = "python %s/RepairOneTask.py %s %s" % (
                                    get_current_directory(), projId, msg.get('calcObjectId'))
                                subprocess.Popen(strCommand, creationflags=subprocess.CREATE_NEW_CONSOLE)
                            else:
                                strCommand = 'python3.4 %s/RepairOneTask.py %s %s' % (
                                    get_current_directory(), projId, msg.get('calcObjectId'))
                                logging.info('Launching command: %s', strCommand)
                                try:
                                    a = subprocess.Popen(strCommand, shell=True, close_fds=True)
                                    logging.info('Repair task launched successfully. PID: %s!', a.pid)
                                except:
                                    logging.error('Failed to repair data!', exc_info=True, stack_info=True)
                        else:
                            logging.info('项目%s手动补历史消息已经处理完毕，放弃', projId)
                    else:
                        logging.warning('项目%s不属于当前集群，跳过!', projId)
                    ch.basic_ack(delivery_tag=method.delivery_tag)  # 开始处理了就确认掉
            except:
                logging.error("Failed to consume message: %s", body, exc_info=True, stack_info=True)
                ch.basic_ack(delivery_tag=method.delivery_tag)
        else:
            mq_nack()
    except Exception:
        logging.error("callback exception", exc_info=True, stack_info=True)
        mq_nack()
    return True


def runConsume():
    while True:
        try:
            logging.info('==========补数消息处理进程启动========')
            credentials = pika.PlainCredentials(app.config['MQ_USERNAME'], app.config['MQ_PASSWORD'])
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(host=app.config['MQ_ADDRESS'], credentials=credentials))
            channel = connection.channel()
            channel.queue_declare(queue=app.config['MQ_RECEIVE_PATCH_NAME'], durable=True)

            channel.basic_qos(prefetch_count=1)
            channel.basic_consume(callback, queue=app.config['MQ_RECEIVE_PATCH_NAME'], no_ack=False)
            channel.start_consuming()
        except Exception:
            logging.error('消息处理进程意外中止', exc_info=True, stack_info=True)
            time.sleep(10)


if __name__ == '__main__':
    strProcessName = sys.argv[1] if len(sys.argv) > 1 else 'RepairCalcQueue_1'
    if strProcessName == 'test':
        strProcessName = 'RepairCalcQueue-test'
    if strProcessName == 'patch':
        pass

    myname = socket.getfqdn(socket.gethostname())
    t = threading.Thread(target=heartbeat_router, name='heartbeat_repair', daemon=True)
    t.start()
    runConsume()
