__author__ = 'yan'

import platform
import socket
import threading
import traceback

from ExpertContainer.api.ArchiveManager import ArchiveManager
from ExpertContainer.api.LogOperatorListen import LogOperatorListen
from ExpertContainer.api.utils import *
from ExpertContainer.dbAccess.RedisManager import RedisManager
_logger = None
strProcessName = 'WashQueue_1'
import subprocess


def heartbeat_router():
    try:
        while True:
            now_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            RedisManager.set_heartbeat_time("heartbeat_wash", now_time)
            time.sleep(10)
    except Exception as e:
        print(str(e))


def isTaskInProcessing(projId):
    status = ArchiveManager.get_wash_status(projId)
    if status == 1:
        # 进行中
        return True, status
    elif status == 2:
        # 已完成
        return False, status
    elif status == 0:
        # 未开始
        return False, status
    else:
        # 意外错误或者手动关闭
        return False, status


def callback(ch, method, properties, body):

    ArchiveManager.iAmLive(strProcessName)

    msgb=body.decode(encoding='utf-8')
    msg = json.loads(msgb)
    if msg:
        _logger.writeLog('收到一条数据清洗任务, 项目%s, 开始处理' % (msg.get('projId'), ),True)

        infoProcessing = isTaskInProcessing(msg.get('projId'))

        if infoProcessing[0] == False:
            _logger.writeLog('项目%s数据清洗任务消费进程启动'%(msg.get('projId'),),True)
            if platform.system()=='Windows':
                ArchiveManager.set_wash_status(int(msg.get('projId')), 1)
                strCommand = "python %s/WashDataTask.py %s" % (get_current_directory(), msg.get('projId'))
                subprocess.Popen(strCommand, creationflags=subprocess.CREATE_NEW_CONSOLE)
                _logger.writeLog('项目%s数据清洗任务消费进程已完成' % (msg.get('projId'),), True)
            else:
                strCommand = "python3.4 %s/WashDataTask.py %s" % (get_current_directory(), msg.get('projId'))
                subprocess.Popen(strCommand, shell=True)
                _logger.writeLog('项目%s数据清洗任务消费进程已完成' % (msg.get('projId'),), True)
        else:
            _logger.writeLog('项目%s数据清洗任务已经正在处理，放弃'%(msg.get('projId'),),True)
        ch.basic_ack(delivery_tag = method.delivery_tag) # 开始处理了就确认掉
    return True


def runConsume():
    while True:
        try:
            _logger.writeLog('==========数据清洗消息处理进程启动========', True)
            credentials = pika.PlainCredentials(app.config['MQ_USERNAME'],app.config['MQ_PASSWORD'])
            connection = pika.BlockingConnection(pika.ConnectionParameters(host=app.config['MQ_ADDRESS'],credentials = credentials))
            channel = connection.channel()
            channel.queue_declare(queue=app.config['MQ_RECEIVE_WASH_DATA'], durable=True)
            channel.basic_qos(prefetch_count=1)
            channel.basic_consume(callback, queue=app.config['MQ_RECEIVE_WASH_DATA'], no_ack = False)
            channel.start_consuming()
        except Exception as e:
            traceback.print_stack()
            _logger.writeLog('===========数据清洗消息处理进程意外中止%s:'%(e.__str__()), True)
            time.sleep(10)


if __name__ == '__main__':
    strProcessName = sys.argv[1] if len(sys.argv)>1 else 'washData'
    myname = socket.getfqdn(socket.gethostname())
    _logger = LogOperatorListen(strProcessName+'_'+myname)
    t = threading.Thread(target=heartbeat_router, name='heartbeat_wash', daemon=True)
    t.start()
    runConsume()


