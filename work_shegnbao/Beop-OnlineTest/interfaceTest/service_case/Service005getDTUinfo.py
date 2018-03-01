__author__ = 'woody'
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import json
import time
import datetime
import unittest
import sys

#项目ID,点名,项目名,dtu名称,引擎名称,是否判断掉线时间,持续时间



#url = 'http://192.168.1.208:5000/site/v1.0/getDTUProjectByServerCode'
url = "http://%s/site/v1.0/getDTUProjectByServerCode" % app.config['SERVICE_URL']




class Service005(unittest.TestCase):
    testCaseID = 'Service005'
    projectName = "BeopService"
    buzName = '通过serverCode获取项目信息/site/v1.0/getDTUProjectByServerCode'
    start = 0.0
    now = 0
    startTime = ""
    errors = []

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))


    def Test(self):
        self.errors = []
        self.rightData()
        self.wrongData()
        self.invalid()
        self.missParam()
        BeopTools.raiseError(self.errors, self.testCaseID)



    def wrongData(self):
        a = BeopTools()
        code = [-1,2342,'23']
        for i in code:
            data = {"serverCode":i}
            rt = self.getDTUProjectByServerCode(data)
            try:
                if [] == rt.get('dtuList',[]):
                    print("发送错误的serverCode未拿到dtuList，用例运行成功!")
            except Exception as e:
                a.writeLogError(self.logger, e.__str__())
                print(e.__str__())
                self.errors.append("错误信息[%s]%s---发送json数据:%s至%s接口返回数据中有不正确的数据。请查看详情: %s" % (a.getTime(), self.testCaseID, json.dumps(data), url, json.dumps(rt)))

    def invalid(self):
        a = BeopTools()
        data = {'ewfwe':None}
        rt = self.getDTUProjectByServerCode(data)
        if rt.get('dtuList',[]):
            self.errors.append("错误信息[%s]%s---发送json数据:%s至%s接口返回数据中有不正确的数据。请查看详情: %s" % (a.getTime(), self.testCaseID, json.dumps(data), url, json.dumps(rt)))
        else:
            print("发送错误数据返回了空的dtuList,用例通过")



    def rightData(self):
        a = BeopTools()
        code = [0,1]
        for i in code:
            data = {"serverCode":i}
            rt = self.getDTUProjectByServerCode(data)
            try:
                for dtu in rt.get('dtuList',[None]):
                    if dtu.get('RTBName') and dtu.get('serverCode',None) is not None and dtu.get('dtuName') and dtu.get('timeZone'):
                        print("%s--表名:%s dtuName:%s" % (self.testCaseID, dtu.get('RTBName'), dtu.get('dtuName')))
            except Exception as e:
                a.writeLogError(self.logger, e.__str__())
                print(e.__str__())
                self.errors.append("错误信息[%s]%s---发送json数据:%s至%s接口返回数据中有不正确的数据。请查看详情: %s" % (a.getTime(), self.testCaseID, json.dumps(data), url, json.dumps(rt)))



    def getDTUProjectByServerCode(self, data):

        #data = {'serverCode':code}
        rt = None
        a = BeopTools()
        try:
            rt = a.postJsonToken(url=url, data=data, t=10)
        except Exception as e:
            a.writeLogError(self.logger, e.__str__())
            print(e.__str__())
            self.errors.append("错误信息[%s]%s---发送json数据%s访问%s接口出错!" % (a.getTime(), self.testCaseID, json.dumps(data), url))
        return rt

    def missParam(self):
        a = BeopTools()
        data = 2
        rt = self.getDTUProjectByServerCode(data)
        if rt.get('dtuList',[]):
            self.errors.append("错误信息[%s]%s---发送json数据:%s至%s接口返回数据中有不正确的数据。请查看详情: %s" % (a.getTime(), self.testCaseID, json.dumps(data), url, json.dumps(rt)))
        else:
            print("发送错误数据返回了空的dtuList,用例通过. message:%s" % (rt.get('message'), ))

    def tearDown(self):
        self.errors = []
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        ##info.append([self.testCaseID, use, now])




if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Service005('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
