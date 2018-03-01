__author__ = 'kirry'
import unittest
import sys
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import time, datetime




class Service025(unittest.TestCase):
    testCaseID = 'Service025'
    projectName = ""
    buzName = '获取特点的实时数据'
    start = 0.0
    now = 0
    startTime = ""
    errors = []
    timeout=10
    serverip = '121.41.30.108'
    url = "http://%s/get_realtimedata/72" %serverip
    data = {'pointList':['A11AHU_A_11_Season']}

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
        a = BeopTools()
        rv = False
        try:
            rv = a.postJson(self.url,self.data,self.timeout)
        except Exception as e:
            print(e.__str__())
            self.errors.append("接口请求超时，超时%s秒"%self.timeout)
        if rv and isinstance(rv,dict):
            if rv.get("A11AHU_A_11_Season",False):
                if rv["A11AHU_A_11_Season"].__len__()==3:
                    print("返回点%s数据正常"%'A11AHU_A_11_Season')
                else:
                    self.errors.append("返回点内容数据信息错误,错误数据为%s"%rv['A11AHU_A_11_Season'])
            else:
                self.errors.append("返回点数据不存在，请查看点值是否存在！")
        else:
            self.errors.append("返回数据不存在！")


    def tearDown(self):
        self.errors = []
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Service025('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
