__author__ = 'sophia'
import unittest
import sys
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import time, datetime
import requests

class Base014(unittest.TestCase):
    testCaseID = 'Base014'
    projectName = ""
    buzName = '监测国服是否可以连接'
    start = 0.0
    now = 0
    startTime = ""
    errors = []
    timeout=10
    url = "http://%s/static/views/js/i18n/zh.js?_=1481616729338" % app.config['SERVERIP']

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
            rv = requests.get(self.url, headers=headers,timeout=15)
            if rv.status_code==200:
                print("国服连接成功" )
            else:
                self.errors.append(
                    "错误信息[%s]%s---国服连接失败status_code为%d!" % (BeopTools.getTime(),self.testCaseID,rv.status_code))
        except Exception as e:
            print(e.__str__())
            BeopTools.writeLogError(self.logger,e.__str__())
            self.errors.append("错误信息[%s]%s---国服连接失败:%s.超时15s" % (BeopTools.getTime(),self.testCaseID, e.__str__()))

    def tearDown(self):
        self.errors = []
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Base014('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
