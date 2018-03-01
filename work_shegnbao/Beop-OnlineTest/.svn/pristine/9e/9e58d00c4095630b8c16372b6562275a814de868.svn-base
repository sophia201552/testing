__author__ = 'woody'
from interfaceTest.Methods.BeopTools import *
from interfaceTest import app
import time
import datetime
import re
import unittest
import pymysql
#from flask.globals import request
import sys

#项目ID,点名,项目名,dtu名称,引擎名称,是否判断掉线时间,持续时间
#errors = []
url = "http://%s/diagnosis/notice/get/" % app.config['SERVICE_URL']
wrongId = [-1,0,32428903572,"wefgwf"]
projId = [71,72,76]



class Service003(unittest.TestCase):
    testCaseID = 'Service003'
    projectName = "BeopService"
    buzName = '获取诊断消息接口diagnosis/notice/get/<projectId>'
    start = 0.0
    now = 0
    startTime = ""
    errors = []

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def writeLog(self, text):
        #logger = self.init_log()
        self.logger.info('[%s]---' % time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) + '' + text)


    def Test(self):
        self.errors = []
        self.checkTrueNotice()
        self.checkWrongNotice()
        self.raiseError(self.errors)



    def getNotice(self,projectId):
        tool = BeopTools()
        rv = None
        try:
            rv = tool.tokenGet(url=url+str(projectId),timeout=30)
            #print(rv)
        except Exception as e:
            print(e.__str__())
            self.writeLog(e.__str__())
            self.errors.append("错误信息[%s]%s---请求%s接口失败,未返回到数据!" % (BeopTools.getTime(), self.testCaseID, url,))
        return rv


    def checkTrueNotice(self):

        for i in projId:
            rv = self.getNotice(i)
            if isinstance(rv,list) and rv:
                #如果同时获取到了信息的时间，状态后，有则为真，无则为假，再判断里面有没有假的notice，有的话说明那条丢失了时间
                r = False if (False in [True for x in rv if (x.get("time") and x.get("status"))]) else True
                if r:
                    print("项目id %s %s接口返回数据中时间、状态字段未丢失!" % (i, url+str(i)))
                else:
                    self.errors.append("错误信息[%s]%s---项目id %s %s接口返回数据中有时间或状态字段丢失!" % (BeopTools.getTime(), self.testCaseID, i, url+str(i)))


    def checkWrongNotice(self):

        for x in wrongId:
            rv = self.getNotice(x)
            if rv == []:
                print("发送错误的项目id %s %s接口返回结果正常!" % (x, url+str(x)))
            else:
                self.errors.append("错误信息[%s]%s---发送错误的项目id %s %s接口返回结果不正常,应为[]!" % (BeopTools.getTime(), self.testCaseID, x, url+str(x)))




    #抛出异常函数
    def raiseError(self,error):

        if error != []:
            #print("\n".join(error))
            assert 0,"\n".join(error)
        else:
            pass
        self.errors = []


    def tearDown(self):
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.errors = []




if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Service003('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
    #unittest.main()
