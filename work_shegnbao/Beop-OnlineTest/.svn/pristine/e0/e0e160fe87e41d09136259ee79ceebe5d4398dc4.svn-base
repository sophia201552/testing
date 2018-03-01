__author__ = 'kirry'
import socket
import unittest
import time
import datetime, sys, json,ssl
from interfaceTest import app
from interfaceTest.Methods.BeopTools import BeopTools
from pymongo import MongoClient
import pymysql,requests

class Base025(unittest.TestCase):
    testCaseID = 'Base025'
    projectName = ''
    buzName = "监测task是否掉线"
    url  = ["121.41.30.108","42.159.234.15:5009"]
            #"40.71.228.119:5009"]
    MessageUrl = app.config['MESSAGE_URL']






    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))
        self.a = BeopTools()


    def Test(self):
        error = []
        now = datetime.datetime.now()
        for ul in self.url:
            url = "http://"+ul+"/task/getHeartbeat/TestPoint"
            rv = self.getData(url)
            getdata = datetime.datetime.strptime(rv,"%Y-%m-%d %H:%M:%S")
            deltimes = (now - getdata).total_seconds()/60 if now>getdata else (getdata-now).total_seconds()/60
            if deltimes>10:
                error.append("地址%s中的更新时间为%s,和当前时间相差超过10分钟，可能task服务停了"%(ul,rv))
            else:
                print(url,rv)
            if error:
                MESSAGE_INFO = str({'type':'message', 'message':'尊敬的用户您好，检测到%s中的task服务可能停止，请及时处理，感谢使用BeOP智慧服务。【BeOP智慧服务】'%ul ,
                          'phone':app.config['TASK_RECEIVER'], 'freq':4800})
                MESSAGE_DATA = {'name':'message', 'value':MESSAGE_INFO}
                self.sendMessage(self.MessageUrl, MESSAGE_DATA, 10)
            error = []
        self.a.raiseError(error,self.testCaseID)

    def getData(self,url):
        header = {"content-type":"application/json"}
        try:
            rv = requests.get(url,headers= header)
        except Exception as e:
            assert 0,"请求接口%s错误，错误信息为%s"%(url,e.__str__())
        return json.loads(rv.text)


    def sendMessage(self, url, data, t):
        a = BeopTools()
        a.writeLogError(self.logger, "发送短信!")
        rv = {}
        try:
            rv = a.postJsonToken(url=url, data=data, t=t)
            a.writeLogError(self.logger, "发送短信详情为%s" % (json.dumps(data, ensure_ascii=False)))
        except Exception as e:
            print(self.testCaseID, e.__str__())
            a.writeLogError(self.logger, e.__str__())



    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

if __name__ == "__main__":
    while True:
        suite = unittest.TestSuite()
        suite.addTest(Base025('Test'))
        runner = unittest.TextTestRunner()
        result = runner.run(suite)
        time.sleep(10)