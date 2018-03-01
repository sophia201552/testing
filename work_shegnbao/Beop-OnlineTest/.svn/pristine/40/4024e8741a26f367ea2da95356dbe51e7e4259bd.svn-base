__author__ = 'sophia'
import requests
from interfaceTest.Methods.BeopTools import *
from interfaceTest import app
import json
import time
import datetime
import re
import unittest
import pika



class Base010(unittest.TestCase):
    testCaseID = 'Base010'
    projectName = "RabbitMessageQueue"
    buzName = 'mq中diagnosis数量'
    start = 0.0
    now = 0
    startTime = ""
    username = "guest"
    pwd = "RNBbeop2013"
    host = app.config['MSGQUEEN_URL']
    queueName = "triggerDiagnosis0"
    maxLen = 200


    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.errors = []



    def Test(self):
        connection = None
        #远程连接MQ
        try:
            credentials = pika.PlainCredentials(self.username, self.pwd)
            #连接mq
            connection = pika.BlockingConnection(pika.ConnectionParameters(host=self.host, credentials=credentials))
            channel = connection.channel()
            rt = channel.queue_declare(self.queueName, durable=True).method.message_count
            if int(rt) > self.maxLen:
                print("MQ中的%s任务超过了%d条!" % (self.queueName, self.maxLen))
                self.errors.append("错误信息%s的RabbitMQ中的%s任务数量为%d条,超过了%d条!请注意!" % (self.host,self.queueName, int(rt), self.maxLen))
            else:
                print("MQ中的%s任务正常,为%d条!" % (self.queueName, int(rt)))
        except Exception as e:
            print(e.__str__())
            self.errors.append("错误信息MQ连接失败!请检查!")
        finally:
            if connection:
                connection.close()

        self.raiseError(self.errors)

    #抛出异常函数
    def raiseError(self,error):
        if error != []:
            assert 0,"\n".join(error)
        else:
            pass

    def tearDown(self):
        self.errors = []
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())



if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Base010('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
    unittest.main()
