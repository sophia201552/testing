__author__ = 'golding'

import pika, sys, logging
from ExpertContainer import app
from ExpertContainer.dbAccess.RedisManager import RedisManager
from flask import json

class MQManager:
    @classmethod
    def RabbitMqWorkQueueSend(cls,queueName, sendVal):
        try:
            credentials = pika.PlainCredentials(app.config['MQ_USERNAME'],app.config['MQ_PASSWORD'])
            connection = pika.BlockingConnection(pika.ConnectionParameters(host=app.config['MQ_ADDRESS'], credentials = credentials))
            channel = connection.channel()
            channel.queue_declare(queue=queueName, durable=True)
            channel.basic_publish(exchange='',
                                  routing_key=queueName,
                                  body=str(sendVal),
                                  properties=pika.BasicProperties(
                                      delivery_mode=2,  # make message persistent
                                  ))
            connection.close()
            return True
        except Exception as e:
            print('RabbitMqWorkQueueSend error:' + str(e))
            logging.error('RabbitMqWorkQueueSend error:' + str(e))
            return False

    @classmethod
    def RabbitMqWorkQueueRecv(cls):
        try:
            credentials = pika.PlainCredentials(app.config['MQ_USERNAME'],app.config['MQ_PASSWORD'])
            connection = pika.BlockingConnection(pika.ConnectionParameters(host=app.config['MQ_ADDRESS'],credentials = credentials))
            channel = connection.channel()
            channel.queue_declare(queue=app.config['MQ_RECEIVE_NAME'], durable=True)

            def callback(ch, method, properties, body):
                msg = 'receive queue:'+body.decode(encoding='utf-8')
                print(msg)
                ch.basic_ack(delivery_tag = method.delivery_tag)

            channel.basic_qos(prefetch_count=1)
            channel.basic_consume(callback, queue=app.config['MQ_RECEIVE_NAME'])
            channel.start_consuming()
        except Exception as e:
            print('RabbitMqWorkQueueRecv error:' + str(type(e)))
            logging.error('RabbitMqWorkQueueRecv error:' + str(type(e)))

    @classmethod
    def triggerAutoRepairInRange(cls, jsonData):
        try:
            jsonData = json.loads(jsonData)
            projId = jsonData.get('projId')
            strLog = 'triggerAutoRepairInRange for proId:%d' % (int(projId),)
            print(strLog)
            logging.info(strLog)
            strMessageQueueName = app.config['MQ_RECEIVE_AUTO_REPAIR_NAME']
            sendData = json.dumps(jsonData, ensure_ascii=False)
            if not cls.RabbitMqWorkQueueSend(strMessageQueueName, sendData):
                strLog = 'failed triggerAutoRepairInRange for projId:%d because RabbitMqWorkQueueSend return False' % (
                int(projId),)
                print(strLog)
                logging.info(strLog)
                return False
            return True
        except Exception as e:
            print('triggerAutoRepairInRange error:' + e.__str__())
            logging.error('triggerAutoRepairInRange error:' + e.__str__())
            return False

    @classmethod
    def triggerRepairDataInRange(cls, projId,  calcObjectId):
        try:
            strLog = 'triggerRepairDataInRange for projId:%d'%(int(projId),)
            print(strLog)
            logging.info(strLog)
            bCalculationFinishSuccess = False
            strMessageQueueName = app.config['MQ_RECEIVE_PATCH_NAME']

            data = dict(projId = projId, calcObjectId = calcObjectId)
            strKey = '%s_%d'%(strMessageQueueName, int(projId))
            RedisManager.set(strKey, 1)
            jsonData = json.dumps(data,ensure_ascii=False)
            if not cls.RabbitMqWorkQueueSend(strMessageQueueName,jsonData):  #��Ϣ���ͳɹ���Ž�ȥ�ȴ�
                strLog = 'failed triggerRepairDataInRange for projId:%d because RabbitMqWorkQueueSend return False'%(int(projId),)
                print(strLog)
                logging.info(strLog)
                return False
            return True
        except Exception as e:
            print('triggerOneCalculation error:' + e.__str__())
            logging.error('triggerOneCalculation error:' + e.__str__())
            return False
        return False


    @classmethod
    def triggerWashDataInRange(cls, projId):
        try:
            strLog = 'triggerWashDataInRange for projId:%d'%(int(projId),)
            print(strLog)
            logging.info(strLog)
            strMessageQueueName = app.config['MQ_RECEIVE_WASH_DATA']
            data = dict(projId = projId)
            strKey = '%s_%d'%(strMessageQueueName, int(projId))
            RedisManager.set(strKey, 1)
            jsonData = json.dumps(data,ensure_ascii=False)
            if not cls.RabbitMqWorkQueueSend(strMessageQueueName, jsonData):
                strLog = 'failed triggerWashDataInRange for projId:%d because RabbitMqWorkQueueSend return False'%(int(projId),)
                print(strLog)
                logging.info(strLog)
                return False
            return True
        except Exception as e:
            print('triggerWashDataInRange error:' + e.__str__())
            logging.error('triggerWashDataInRange error:' + e.__str__())
            return False


    @classmethod
    def getMessageCount(cls, strQueueName):
        nCount = -1
        try:
            credentials = pika.PlainCredentials(app.config['MQ_USERNAME'],app.config['MQ_PASSWORD'])
            connection = pika.BlockingConnection(pika.ConnectionParameters(host=app.config['MQ_ADDRESS'], credentials = credentials))
            channel = connection.channel()
            rt = channel.queue_declare(strQueueName, durable=True).method.message_count
            nCount = int(rt)
        except Exception as e:
            logging.error("MQManager::getMessageCount error!")
        finally:
            if connection:
                connection.close()
        return nCount

    @classmethod
    def ackRecentMessage(cls, strQueueName):
        try:
            credentials = pika.PlainCredentials(app.config['MQ_USERNAME'],app.config['MQ_PASSWORD'])
            connection = pika.BlockingConnection(pika.ConnectionParameters(host=app.config['MQ_ADDRESS'], credentials = credentials))
            channel = connection.channel()
            channel.queue_declare(strQueueName, durable=True)
            response = channel.basic_get(queue=strQueueName)
            if response:
                channel.basic_ack(response[0].delivery_tag)
        except Exception as e:
            logging.error("MQManager::getMessageCount error!")
        finally:
            if connection:
                connection.close()