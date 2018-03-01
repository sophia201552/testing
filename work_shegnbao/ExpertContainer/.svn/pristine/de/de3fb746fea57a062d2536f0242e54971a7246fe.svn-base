__author__ = 'yan'

from ExpertContainer.api.utils import *
from ExpertContainer.api.LogOperator import LogOperator
from ExpertContainer.dbAccess import mongo_operator
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
import sys, time, threading

_logger = None
strProcessName = 'PatchQueryNull_1'

def callback(ch, method, properties, body):
    try:
        msgb = body.decode(encoding='utf-8')
        msg = json.loads(msgb)
        if msg:

            projId = msg.get('projId')
            collectionname = msg.get('collectionname')
            format = msg.get('period')
            lost_list = msg.get('lost', [])
            if len(lost_list)>1000:
                _logger.writeLog('====补数列表项目:%s超过1000条，恶意补数，忽略！'%(projId,), True)
                ch.basic_ack(delivery_tag = method.delivery_tag)
                return True

            _logger.writeLog('====开始补数项目:%s, lostPointList:count %d'%(projId, len(lost_list)), True)

            for item in lost_list:
                pointlist = item.get('pointlist')
                timeat = item.get('time')
                timeatObj = datetime.strptime(timeat, standard_time_format)
                connList = MongoConnManager.getHisConnTuple(projId)
                conn = None
                for connItem in connList:
                    st = connItem[1]
                    et = connItem[2]
                    if timeatObj <= et and timeatObj >= st:
                        conn = connItem[0]
                        break
                if conn:
                    count, rt_mapping = conn.patch_data_sharp_clock_with_value(collectionname, pointlist, timeatObj)
                    if count:
                        if count > 0:
                            _logger.writeLog('%s:' % (
                                get_current_func_name()) + '补数成功[projId:%s,collectionname:%s,insertlist:%s,time:%s,count:%s]' % \
                                             (projId, collectionname, str(rt_mapping), timeat, count), True)
    except Exception as e:
        _logger.writeLog('%s:' % (
        get_current_func_name()) + '消费意外[projId:%s,collectionname:%s,format:%s,pointlist:%s,time:%s]' % \
                                 (projId, collectionname, format, pointlist, timeat) + '  ' + e.__str__(), True)
    finally:
        _logger.writeLog('====完成补数项目', True)
        ch.basic_ack(delivery_tag = method.delivery_tag)
        return True
    return True

def runConsume():
    try:
        _logger.writeLog('%s:'%(get_current_func_name())+'历史数据查询补数队列监听任务启动',True)
        credentials = pika.PlainCredentials(app.config['MQ_USERNAME'],app.config['MQ_PASSWORD'])
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=app.config['MQ_ADDRESS'],credentials = credentials))
        channel = connection.channel()
        channel.queue_declare(queue='PatchQueryNullData', durable=True)

        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(callback, queue='PatchQueryNullData')
        channel.start_consuming()
    except Exception as e:
        _logger.writeLog('消息处理进程意外中止'+e.__str__(), True)
        traceback.print_stack()

def heartbeat_router():
    try:
        while True:
            now_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            RedisManager.set_heartbeat_time("heartbeat_patchlostdata", now_time)
            time.sleep(10)
    except Exception as e:
        print(e)

if __name__ == '__main__':
    strProcessName = sys.argv[1] if len(sys.argv) > 1 else 'PatchQueryNull_1'
    myname = socket.getfqdn(socket.gethostname())
    _logger = LogOperatorListen(strProcessName+'_'+myname)
    t = threading.Thread(target=heartbeat_router, name='heartbeat_patchlostdata', daemon=True)
    t.start()
    runConsume()

