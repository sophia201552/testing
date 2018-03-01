__author__ = 'kirry'
import socket
import unittest
import time
import datetime, sys, json,ssl
import pika
from interfaceTest import app
from interfaceTest.Methods.BeopTools import BeopTools

class Base026(unittest.TestCase):
    testCaseID = 'Base026'
    projectName = ''
    buzName = "检查队列的消息数量"
    uesrname = "beopweb"
    passwd = "RNB.beop-2013"
    url  = ["42.159.232.185","120.26.63.126"]#"40.87.70.194",
    mqname = ["MySqlCrossClusterWrite","AlgoCrossClusterNotice","updateThirdDataRealAndHistory"]






    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))
        self.a = BeopTools()
        self.error = []


    def Test(self):
        for ul in self.url:
            for name in self.mqname:
                num = self.getCounts(ul,name)
                if num>10:
                    self.error.append("%s中的队列%s的消息数量为%s!"%(ul,name,num))
                else:
                    print("正常信息，%s中的队列%s的消息数量为%s!"%(ul,name,num))
        self.a.raiseError(self.error,self.testCaseID)



    def getCounts(self,host,mqName):
        connection = False
        try:
            credentials = pika.PlainCredentials(self.uesrname,self.passwd)
            connection = pika.BlockingConnection(pika.ConnectionParameters(host=host, credentials=credentials))
            channel = connection.channel()
            counts = channel.queue_declare(mqName, durable=True).method.message_count
            return counts
        except Exception as e:
            print(e.__str__())
            assert 0,"%s连接%s队列失败！"%(host,mqName)
        finally:
            if connection:
                connection.close()


    def tearDown(self):
        self.error = []
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

if __name__ == "__main__":
    while True:
        suite = unittest.TestSuite()
        suite.addTest(Base026('Test'))
        runner = unittest.TextTestRunner()
        result = runner.run(suite)
        time.sleep(10)