__author__ = 'may'
import psutil
import random
import traceback
import platform
import subprocess
from ExpertContainer.api.utils import *
from ExpertContainer.mod_log.FileLogger import FileLogger
from ExpertContainer.api.ArchiveManager import ArchiveManager
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess


def getLinuxRunningProcessCount():
    count = 0
    command = 'ps -ef|grep python3.4'
    resp = os.popen(command)
    for item in resp.readlines():
        if 'AutoRepairOneTask' in item:
            count += 1
    return count // app.config.get('REPAIR_DIVIDE', 1)


def getWindowsRuningProcessCount():
    # 获取系统的全部进程
    pids = psutil.pids()
    l = []
    for pid in pids:
        # 查看单个进程
        p = psutil.Process(pid)

        if 'python' in p.name().lower():
            l.append(p.name())
    return len(l)


def callback(ch, method, properties, body):
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
        time.sleep(random.uniform(0, 5))
        # 服务器
        strPlatform = platform.system().lower()
        if strPlatform == 'windows':
            count = getWindowsRuningProcessCount()
        else:
            count = getLinuxRunningProcessCount()

        # 控制python进程最多6个
        if count < app.config['AUTO_REPAIR_MAX_PROCESS_NUM']:
            try:
                msgb = body.decode(encoding='utf-8')
                msg = eval(msgb)
                if msg:
                    projId = msg.get('projId')
                    pointList = msg.get('pointList')
                    timeFrom = msg.get('timeFrom')
                    timeTo = msg.get('timeTo')
                    if BEOPDataAccess.is_belong_to_local_cluster(int(projId)):
                        logging.info('收到一条自动补项目%s历史消息,开始处理', projId)
                        logging.info('项目%s自动补历史消息消费进程启动', projId)
                        if strPlatform == 'windows':
                            strCommand = "python %s/AutoRepairOneTask.py %s %s %s %s" % (
                                get_current_directory(), projId, '"' + timeFrom + '"', '"' + timeTo + '"',
                                '"' + pointList + '"')
                            subprocess.Popen(strCommand, creationflags=subprocess.CREATE_NEW_CONSOLE)
                        else:
                            strCommand = "python3.4 %s/AutoRepairOneTask.py %s %s %s %s" % (
                                get_current_directory(), projId, '"' + timeFrom + '"', '"' + timeTo + '"',
                                '"' + pointList + '"')
                            subprocess.Popen(strCommand, shell=True)
                    ch.basic_ack(delivery_tag=method.delivery_tag)
            except Exception as e:
                logging.error("Failed to consume message: %s", body, exc_info=True, stack_info=True)
                ch.basic_ack(delivery_tag=method.delivery_tag)
        else:
            mq_nack()
    except Exception:
        logging.error("callback exception", exc_info=True, stack_info=True)
        mq_nack()


def runConsume():
    while True:
        try:
            logging.info('==========自动补数消息处理进程启动========')
            credentials = pika.PlainCredentials(app.config['MQ_USERNAME'], app.config['MQ_PASSWORD'])
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(host=app.config['MQ_ADDRESS'], credentials=credentials))
            channel = connection.channel()
            channel.queue_declare(queue=app.config['MQ_RECEIVE_AUTO_REPAIR_NAME'], durable=True)
            channel.basic_qos(prefetch_count=1)
            channel.basic_consume(callback, queue=app.config['MQ_RECEIVE_AUTO_REPAIR_NAME'], no_ack=False)
            channel.start_consuming()
        except Exception:
            logging.error('消息处理进程意外中止', exc_info=True, stack_info=True)
            time.sleep(10)


if __name__ == '__main__':
    strProcessName = sys.argv[1] if len(sys.argv) > 1 else 'autoRepair1'
    if strProcessName == 'test':
        strProcessName = 'autoRepair-test'
    # 串成一个完整的域名
    for i in range(1, app.config['AUTO_REPAIR_MAX_PROCESS_NUM'] + 1):
        key = 'autoRepair' + str(i) + '_status'
        ArchiveManager.clearAutoRepair(key)
    runConsume()
