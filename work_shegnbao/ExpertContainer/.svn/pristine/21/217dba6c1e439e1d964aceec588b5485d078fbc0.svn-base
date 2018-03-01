__author__ = 'yan'

from ExpertContainer.api.utils import *
from ExpertContainer.api.LogOperatorListen import LogOperatorListen
from ExpertContainer.logic.LogicBase import LogicBase
import socket, traceback, sys

_logger = None
strProcessName = 'DataTaskConsumer_1'

def callback(ch, method, properties, body):
    try:
        msgb = body.decode(encoding='utf-8')
        msg = json.loads(msgb)
        if msg:
            projId = msg.get('projId')
            type = msg.get('type')
            param = msg.get('param')
            lb = LogicBase(projId, datetime.now())
            if type == 0:#数据补齐
                if isinstance(param, dict):
                    pointList = param.get('pointList')
                    patchTimeMinute = param.get('patchTimeMinute')
                    et = datetime.now()
                    st = et - timedelta(minutes=patchTimeMinute)
                    lb.patch_data_sharp_clock_in_time_range(projId, pointList,
                                 st.strftime(standard_time_format), et.strftime(standard_time_format))
            elif type == 1:#气象数据更新
                if isinstance(param, dict):
                    r = None
                    apiType = param.get('apiType')#'byId' or 'byName'
                    code = param.get('code')
                    ptName = param.get('ptName')
                    if apiType == 'byId':
                        r = lb.weather_get_by_cityid(code)
                    elif apiType == 'byName':
                        r = lb.weather_get_by_cityname(code)
                    if r:
                        lb.set_data(projId, ptName, json.dumps(r ,ensure_ascii=False), 1)
            elif type == 2:#发送报表
                pass#todo
            elif type == 3:#生成随机演示数
                pass#todo
            elif type == 4:#数据镜像
                if isinstance(param, list):
                    lb.copy_data_to_other_project(param)
    except Exception as e:
        _logger.writeLog('%s:' % (
        get_current_func_name()) + '消费意外:内容=%s,错误=%s'%(str(msg), e.__str__()), True)
    finally:
        ch.basic_ack(delivery_tag = method.delivery_tag)
        return True
    return True

def runConsume():
    try:
        credentials = pika.PlainCredentials(app.config['MQ_USERNAME'],app.config['MQ_PASSWORD'])
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=app.config['MQ_ADDRESS'],credentials = credentials))
        channel = connection.channel()
        channel.queue_declare(queue='DataTaskQueue', durable=True)

        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(callback, queue='DataTaskQueue')
        channel.start_consuming()
    except Exception as e:
        _logger.writeLog('消息处理进程意外中止'+e.__str__(), True)
        traceback.print_stack()

if __name__ == '__main__':
    strProcessName = sys.argv[1] if len(sys.argv) > 1 else 'DataTaskConsumer_1'
    if strProcessName == 'test':
        strProcessName = 'DataTaskConsumer-test'
    myname = socket.getfqdn(socket.gethostname())
    _logger = LogOperatorListen(strProcessName+'_'+myname)
    runConsume()
