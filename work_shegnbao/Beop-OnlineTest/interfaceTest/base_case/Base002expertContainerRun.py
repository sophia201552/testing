__author__ = 'woody'

import requests
from interfaceTest.Methods.BeopTools import *
import unittest, sys
from interfaceTest import app
from datetime import datetime
import json


class Base002(unittest.TestCase):
    testCaseID = 'Base002'
    projectName = "ExpertContainer"
    buzName = 'ExpertContainer'
    start = 0.0


    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))


    def Test(self):
        error = []
        ip = app.config['EXPERT_CONTAINER_URLS']
        a = BeopTools()
        for i in ip:
            rv = False
            url = "http://%s" %i
            try:
                rv = requests.get(url,timeout=30)
            except Exception:
                error.append("错误信息算法容器%s接口异常，请检查！"%i)
            if rv:
                if rv.text == "ExpertContainer is running!":
                    print(rv.text)
                else:
                    error.append("错误信息算法容器%s异常关闭，请检查！"%i)
        a.raiseError(error,self.testCaseID)


        


    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())



if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Base002('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)