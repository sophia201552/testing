__author__ = 'sophia'
import unittest
import sys
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import time, datetime
import json



class Smoke029(unittest.TestCase):
    testCaseID = 'Smoke029'
    projectName = ""
    buzName = '测试获取诊断fault接口v2/fault/getHistory/'
    start = 0.0
    now = 0
    startTime = ""
    errors = []
    timeout=10
    serverip=app.config['SERVERIP']
    url = "http://%s/v2/fault/getHistory" % serverip
    exist = {'projId':303,'timeFrom':"2017-11-15 00:00:00",'timeTo':"2017-11-30 00:00:00"}
    wrong = [(None,None,None),(303,'2017-','2017-08-25 00:00:00'),(303,'2017-08-25 00:00:00','2017-08-24 00:00:00')]

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.errors = []
        self.getExisted()
        self.getWrong()
        BeopTools.raiseError(self.errors, self.testCaseID)

    # 使用正确的获取到接口数据
    def getExisted(self):
        try:
            rv = json.loads(BeopTools.postDataExcept(url=self.url, data=self.exist,timeout=self.timeout,testCaseID=self.testCaseID))
            if  rv :
                for r in rv:
                    if 'grade' in r.keys() and 'problem' in r.keys():
                        print("返回结果中有数据!" )
                    else:
                        self.errors.append("错误信息[%s]%s---访问%s接口,使用正确的参数%s返回结果中没有grade和problem属性返回为%s!" % (BeopTools.getTime(),self.testCaseID, self.url, self.exist,str(r)))
            else:
                self.errors.append("错误信息[%s]%s---访问%s接口,使用正确的参数%s返回结果为%s!" % (BeopTools.getTime(),self.testCaseID, self.url, self.exist,str(rv)))
        except Exception as e:
            print(e.__str__())
            BeopTools.writeLogError(self.logger,e.__str__())
            self.errors.append("错误信息[%s]%s---getExisted method errror:%s" % (BeopTools.getTime(),self.testCaseID, e.__str__()))

    # 使用错误的获取到接口的数据
    def getWrong(self):
        try:
            for w in self.wrong:
                data={'projId':w[0],'timeFrom':w[1],'timeTo':w[2]}
                rv = json.loads(BeopTools.postDataExcept(url=self.url, data=data,timeout=self.timeout,testCaseID=self.testCaseID))
                if not rv:
                    print("返回结果中无数据!")
                else:
                    self.errors.append(
                        "错误信息[%s]%s---访问%s接口,使用错误的参数%s返回结果为%s!" % (BeopTools.getTime(), self.testCaseID,self.url, data,str(rv)))
        except Exception as e:
            print(e.__str__())
            BeopTools.writeLogError(self.logger,e.__str__())
            self.errors.append("错误信息[%s]%s---getWrong method error:%s" % (BeopTools.getTime(),self.testCaseID, e.__str__()))



    def tearDown(self):
        self.errors = []
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Smoke029('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
