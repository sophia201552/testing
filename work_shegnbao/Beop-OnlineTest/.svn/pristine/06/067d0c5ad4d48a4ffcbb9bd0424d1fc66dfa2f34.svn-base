__author__ = 'woody'
import time
import datetime
import unittest
#from flask.globals import request
import pika
from interfaceTest.Methods.BeopTools import *
from interfaceTest import app
import sys


class Base017(unittest.TestCase):
    testCaseID = 'Base017'
    projectName = "RabbitMailQueue"
    buzName = 'mq mail队列计算点个数'
    start = 0.0
    now = 0
    startTime = ""
    username = "beopweb"
    pwd = "RNB.beop-2013"
    host = "120.26.63.126"
    queueName = "email"
    maxLen = 300


    #case初始化,获取开始时间以及时间戳,获取写入日志句柄logger
    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))



    def Test(self):
        self.errors = []
        a = BeopTools()
        connection = None
        rv = []
        #远程连接MQ
        try:
            credentials = pika.PlainCredentials(self.username,self.pwd)
            #连接mq
            connection = pika.BlockingConnection(pika.ConnectionParameters(host=self.host, credentials=credentials))
            channel = connection.channel()
            for i in range(0,5):
                count = channel.queue_declare(self.queueName, durable=True).method.message_count
                rv.append(count)
                time.sleep(9.8)
            print(rv)
            if rv[-1]:
                print("MQ email队列中还有任务没有完成!")
                if rv[-1] == rv[-2] == rv[-3]:
                    self.errors.append("错误信息[%s]%s---MQ最近30秒内获取3次email队列数量没有发生变化,且都不为0!均为%d条!" % (a.getTime(), self.testCaseID, rv[-1]))
                else:
                    a.writeLogInfo(self.logger, "MQ email队列中还有任务没有完成!但数量在变化!")
            else:
                a.writeLogInfo(self.logger, "MQ email队列任务为空!")
        except Exception as e:
            print(e.__str__())
            self.errors.append("错误信息MQ连接失败!请检查!")
        finally:
            if connection:
                connection.close()
        a.raiseError(self.errors, self.testCaseID)


    #用例结束后的清理工作,记录输出时间以及
    def tearDown(self):
        self.errors = []
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())





if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Base017('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
