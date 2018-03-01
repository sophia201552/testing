__author__ = 'sophia'

from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import sys
import unittest
import time
import datetime

class Patrol005(unittest.TestCase):
    testCaseID = 'Patrol005'
    projectName = "开能"
    buzName = '巡更路线更新时间检查'
    timeout = 15
    serverip = app.config['SERVERIP']
    projectId = 396
    pathId='57fcb487833c972bef140d3e'
    pTime=datetime.datetime.now().date()
    url= "http://{}/patrol/kaineng/log/getByPathId/{}/{}/{}" .format(serverip,projectId,pathId,pTime)

    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.errors = []
        self.point()
        BeopTools.raiseError(self.errors, self.testCaseID)

    def point(self):
        # 验证获取巡更路线的接口
        data_get = BeopTools.tokenGet(url=self.url,timeout=self.timeout)
        if (data_get!=[]):
            print('%s获取巡更路线成功' % self.url)
        else:
            assert 0,"错误信息巡更路线的值没有更新返回结果为[]"




    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Patrol005('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
