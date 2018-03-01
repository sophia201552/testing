__author__ = 'sophia'
import unittest
import sys
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import time, datetime
import requests
import json
class Algorithm006(unittest.TestCase):
    testCaseID = 'Algorithm006'
    projectName = ""
    buzName = '监测算法服务器是否可以连接'
    start = 0.0
    now = 0
    startTime = ""
    timeout = 10
    url = "http://%s/correlationanalysis/analysis/analysisModel" % app.config['ALGORITHM_URL']
    p={'x':{'x1':[5,4],'x2':[1.55,2.55],'x3':[0.2,0.7]},'y':[0.2,1.2]}
    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.errors = []
        self.getExisted()
        BeopTools.raiseError(self.errors, self.testCaseID)

    # 使用正确的获取到接口数据
    def getExisted(self):
        try:
            headers = {'content-type': 'application/json', 'token':'eyJhbGciOiJIUzI1NiIsImV4cCI6MT'}
            rv = requests.post(self.url,data=json.dumps(self.p) ,headers=headers,timeout=600)
            if rv.status_code==200:
                print("%s连接成功" % self.url)
            else:
                self.errors.append(
                    "错误信息[%s]%s---%s连接失败status_code为%d!" % (BeopTools.getTime(),self.testCaseID,self.url, rv.status_code))
        except Exception as e:
            print(e.__str__())
            BeopTools.writeLogError(self.logger,e.__str__())
            self.errors.append("错误信息[%s]%s---%s连接失败:%s.超时600s" % (BeopTools.getTime(),self.testCaseID, self.url, e.__str__()))

    def tearDown(self):
        self.errors = []
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Algorithm006('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
