__author__ = 'sophia'
import unittest
import sys
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import time, datetime




class Service020(unittest.TestCase):
    testCaseID = 'Service020'
    projectName = "BeopService"
    buzName = '获取诊断fault接口v2/fault/getRealtime'
    start = 0.0
    now = 0
    startTime = ""
    timeout=10
    errors = []
    url = "http://%s/v2/fault/getRealtime" % app.config['SERVICE_URL']
    exist = [{'projId':303}]
    wrong = [{'projId':-1}]

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.errors = []
        self.getExisted()
        self.getWrong()
        BeopTools.raiseError(self.errors, self.testCaseID)

    # 使用正确的id获取到接口数据
    def getExisted(self):
        try:

            for projId in self.exist:
                rv = BeopTools.postDataExcept(url=self.url, data=projId,timeout=self.timeout)

                if rv!=[]:
                    print("projectId为%s返回结果中有数据!" % projId)
                else:
                    self.errors.append(
                        "错误信息[%s]%s---访问%s接口,使用正确的参数%s返回结果为%s!" % (BeopTools.getTime(),self.testCaseID, self.url, projId,str(rv)))
        except Exception as e:
            print(e.__str__())
            BeopTools.writeLogError(self.logger,e.__str__())
            self.errors.append("错误信息[%s]%s---getExisted method errror:%s" % (BeopTools.getTime(),self.testCaseID, e.__str__()))

    # 使用错误的id获取到接口的数据
    def getWrong(self):
        try:

            for projId in self.wrong:
                rv = BeopTools.postDataExcept(url=self.url, data=projId,timeout=self.timeout)

                if rv == None or rv==[]:
                    print("projectId为%s使用错误的id返回结果中无数据!" % projId)
                else:
                    self.errors.append(
                        "错误信息[%s]%s---访问%s接口,使用错误的参数%s返回结果为%s!" % (BeopTools.getTime(), self.testCaseID,self.url, projId,str(rv)))
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
    suite.addTest(Service020('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
