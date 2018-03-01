# -*- encoding=utf-8 -*-
__author__ = 'Eric'
import threading
import json
import traceback

import pika

from ExpertContainer.api import *
from ExpertContainer.api.utils import *
from ExpertContainer.api.ArchiveManager import ArchiveManager
from ExpertContainer.dbAccess.ConfigMongoDBAccess import ConfigMongoDBAccess
from ExpertContainer.api.cacheProfile import DataManager
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from ExpertContainer.dbAccess.MongoConnManager import MongoConnManager
from ExpertContainer.api.DependAnalyst import DependAnalyst
from ExpertContainer.dbAccess import mongo_operator

class MsgClearListenThread(threading.Thread):
    _logger = LogOperator()

    def __init__(self, name, nameMessageQueue):
        threading.Thread.__init__(self)
        self.name = name
        self.nameMessageQueue = nameMessageQueue

    
    def callback(self,ch, method, properties, body):
        projId = None
        try:
            print('消除消息 %s'%(body.decode(encoding='utf-8')))
            ch.basic_ack(delivery_tag = method.delivery_tag)
            return True

        except Exception as e:

            ch.basic_ack(delivery_tag = method.delivery_tag)
            return True

    def run(self):
        try:
            credentials = pika.PlainCredentials(app.config['MQ_USERNAME'],app.config['MQ_PASSWORD'])
            connection = pika.BlockingConnection(pika.ConnectionParameters(host=app.config['MQ_ADDRESS'],credentials = credentials))
            channel = connection.channel()
            channel.queue_declare(queue=self.nameMessageQueue, durable=True)

            channel.basic_qos(prefetch_count=1)
            channel.basic_consume(self.callback, queue=self.nameMessageQueue)
            channel.start_consuming()
        except Exception as e:
            MsgClearListenThread._logger.writeLog('消息处理进程意外中止'+e.__str__(), True)
            traceback.print_stack()