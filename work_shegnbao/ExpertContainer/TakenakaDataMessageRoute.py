import socket
from ExpertContainer.api.utils import *
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
import paho.mqtt.client as mqtt
import json
from dateutil.parser import parse


strProcessName = 'TakenakaDataRoute_1'
messageCount = None
icount = 0
datajson = {"pointName":[], "pointValue":[], "t_time":[], "projectKey": "takenaka"}


def on_publish(mqttc, obj, mid):    
    pass


def sendDataByMqttTopic(strPayLoad):
    mqttc = mqtt.Client(client_id="clientId", clean_session=True, userdata=None)
    mqttc.username_pw_set(app.config['MQ_USERNAME'], app.config['MQ_PASSWORD'])   
    mqttc.connect(app.config['MQ_ADDRESS'], 1883, 60)
    mqttc.subscribe("MQTTDataUpload", 0)
    mqttc.publish("MQTTDataUpload", strPayLoad, 0, False)    
    mqttc.disconnect() 


def callback(ch, method, properties, body):
    global icount
    global datajson
    projId = None
    icount = icount + 1
    doneflag = 0
    try:
        msgb = body.decode(encoding='utf-8')
        doneflag = 1
        if '&' in msgb:
            datajson = exchangePayload(msgb, datajson)
            doneflag = 2
            if icount >= 100:
                sendDataByMqttTopic(json.dumps(datajson))
                logging.info("传输数据：%s个点", icount)
                logging.debug(datajson)
                icount = 0
                datajson = {"pointName":[], "pointValue":[], "t_time":[], "projectKey":"takenaka"}
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception:
        logging.error('项目%s消息消费完毕:意外:', projId, exc_info=True, stack_info=True)
        if doneflag != 1:
            ch.basic_ack(delivery_tag=method.delivery_tag)
        return True


def exchangePayload(strPayload, datajson):
    # strpayload = '''topic=takenaka.co.jp/HigashiKanto_Office/Chiba/-/-/Electricity/Electricity/-/1L-1-13/Electricity_Inst/R&publisher=asahi-kiki&unit=kw&value=1.15&datetime=2017-08-01T15:20:15.082'''
    dictpay = ''
    strp = strPayload.split('&')
    topic = ""
    pointValue = ""
    t_time = ""
    for item in strp:
        if 'topic=' in item:
            topic = item.replace("topic=", "")
        if 'value=' in item:
            pointValue = item.replace("value=", "")
        if 'datetime=' in item:
            t_time = item.replace("datetime=", "")
            if t_time.endswith('09:00'):
                t_time = t_time[0:len(t_time) - 6]
    actTimeStr = (parse(t_time).replace(second=0)).strftime('%Y-%m-%d %H:%M:%S')
    pointName = BEOPDataAccess.getInstance().getTakenakaPointName(topic)
    if pointName:
        datajson["pointName"].append(pointName)
        datajson["pointValue"].append(pointValue)
        datajson["t_time"].append(actTimeStr)
    return datajson


def runConsume():
    try:
        logging.info('竹中消息路由队列监听线程启动')
        credentials = pika.PlainCredentials(app.config['MQ_USERNAME'], app.config['MQ_PASSWORD'])
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=app.config['MQ_ADDRESS'], credentials=credentials))
        channel = connection.channel()
        channel.queue_declare(queue=app.config['MQ_RECEIVE_TAKENAKA_ROUTE'], durable=True)

        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(callback, queue=app.config['MQ_RECEIVE_TAKENAKA_ROUTE'])
        channel.start_consuming()
    except Exception:
        logging.error('消息处理进程意外中止', exc_info=True, stack_info=True)


if __name__ == '__main__':
    strProcessName = sys.argv[1] if len(sys.argv) > 1 else 'TakenakaDataRoute_1'
    messageCount = 0
    myname = socket.getfqdn(socket.gethostname())
    runConsume()