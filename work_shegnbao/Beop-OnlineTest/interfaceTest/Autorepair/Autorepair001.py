__author__ = 'kirry'

from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import sys
import unittest,pika
import time,datetime


class Autorepair001(unittest.TestCase):
    testCaseID = 'Autorepair001'
    projectName = "不针对项目"
    buzName = '消息队列不堵塞'
    username = "beopweb"
    pwd = "RNB.beop-2013"
    host = "120.26.63.126"
    queueName = "CalculationAutoRepair"
    maxLen = 300

    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))
        #user = ["may.chen@rnbtech.com.hk","golding.gu@rnbtech.com.hk","Kirry.gao@rnbtech.com.hk"]
        self.user = ["Kirry.gao@rnbtech.com.hk"]

    def Test(self):
        a = BeopTools()
        error = []
        conn = None
        rv = None
        try:
            credentials = pika.PlainCredentials(self.username,self.pwd)
            conn = pika.BlockingConnection(pika.ConnectionParameters(host=self.host, credentials=credentials))
            channel = conn.channel()
            count = channel.queue_declare(self.queueName, durable=True).method.message_count
            rv = count
        except Exception as e:
            print(e.__str__())
            error.append("错误信息MQ连接失败!请检查!")
        finally:
            if conn:
                conn.close()

        now = datetime.datetime.now().strftime("%H:%M")
        if rv:
            if int(now.split(":")[0])>= 4 and int(now.split(":")[0])<5 and int(now.split(":")[1]):
                if rv > 500:
                    error.append("%s队列在%s,数量为%s条，超过500条！"%(self.queueName,now,rv))
            else:
                if rv >100:
                    error.append("%s队列在%s,数量为%s条，超过100条！"%(self.queueName,now,rv))
        a.raiseError(error,self.testCaseID)





    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Autorepair001('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
