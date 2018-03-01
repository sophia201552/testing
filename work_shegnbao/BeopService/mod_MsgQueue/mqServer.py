from flask import Flask, request, jsonify
import threading, time
import pika, sys, logging
from mainService import app
from mod_MsgQueue import bp_mq


@bp_mq.route('/mqSendTask', methods=['POST'])
def mqSendTask():
    try:
        data = request.get_json()
        if data:
            queue_name = data.get('name')
            value = data.get('value')
            if not RabbitMqWorkQueueSend(queue_name, value):
                return jsonify(error='failed')
    except Exception as e:
        print('mqSendTask error:' + e.__str__())
        app.logger.error('mqSendTask error:' + e.__str__())
    return jsonify(error='ok')

def RabbitMqWorkQueueSend(queueName, sendVal):
    try:
        credentials = pika.PlainCredentials(app.config['MQ_USERNAME'],app.config['MQ_PASSWORD'])
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=app.config['MQ_ADDRESS'], credentials = credentials))
        channel = connection.channel()
        channel.queue_declare(queue=queueName, durable=True)
        channel.basic_publish(exchange='',
                              routing_key=queueName,
                              body=str(sendVal),
                              properties=pika.BasicProperties(
                                 delivery_mode = 2,  # make message persistent
                                  ))
        connection.close()
        return True
    except Exception as e:
        print('RabbitMqWorkQueueSend error:' + str(e))
        app.logger.error('RabbitMqWorkQueueSend error:' + str(e))
        return False
    return False

def RabbitMqWorkQueueRecv():
    try:
        credentials = pika.PlainCredentials(app.config['MQ_USERNAME'],app.config['MQ_PASSWORD'])
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=app.config['MQ_ADDRESS'],credentials = credentials))
        channel = connection.channel()
        channel.queue_declare(queue=app.config['MQ_RECEIVE_NAME'], durable=True)
        def callback(ch,method,properties,body):
            msg = 'receive queue:'+body.decode(encoding='utf-8')
            print(msg)
            ch.basic_ack(delivery_tag = method.delivery_tag)
        channel.basic_qos(prefetch_count = 1)
        channel.basic_consume(callback,queue = app.config['MQ_RECEIVE_NAME'])
        channel.start_consuming()
    except Exception as e:
        print('RabbitMqWorkQueueRecv error:' + str(type(e)))
        app.logger.error('RabbitMqWorkQueueRecv error:' + str(type(e)))

class initRecv(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)

    def run(self):
        RabbitMqWorkQueueRecv()
