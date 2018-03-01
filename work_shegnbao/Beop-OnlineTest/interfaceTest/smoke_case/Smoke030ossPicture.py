__author__ = 'woody'
import unittest
import time
import datetime, sys, json
from interfaceTest import app
from interfaceTest.Methods.BeopTools import BeopTools
import requests

class Smoke030(unittest.TestCase):
    testCaseID = 'Smoke030'
    projectName = '不针对项目'
    buzName = 'oss图片检查'
    errors = []
    url = app.config['IMAGE_URL']



    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))
        self.a = BeopTools()

    def Test(self):
        rv = {}
        self.errors = []
        pictureList = app.config['OSS_PIC']
        for pic in pictureList:
            status = 404
            try:
                rv = requests.get(url=self.url+pic, timeout=10)
                status = rv.status_code
            except Exception as e:
                print(e.__str__())
                self.a.writeLogError(self.logger, "访问%s接口出错!" % (self.url+pic))
                self.errors.append('错误信息[%s]%s---访问%s接口出错!' % (self.a.getTime(), self.testCaseID, self.url+pic))
            if status != 200:
                self.errors.append('错误信息[%s]%s---访问%s接口返回状态码不为200!可能是图片已丢失,请检查!' % (self.a.getTime(), self.testCaseID, self.url+pic))
            else:
                print(self.url+pic,'文件存在!')
        self.a.raiseError(self.errors, self.testCaseID)

    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())



if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Smoke030('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

