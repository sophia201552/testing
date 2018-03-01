__author__ = 'woody'
import unittest
import time
import datetime, sys, json
from interfaceTest import app
from interfaceTest.Methods.BeopTools import BeopTools
import requests

class Smoke028(unittest.TestCase):
    testCaseID = 'Smoke028'
    projectName = '企业天地三号楼'
    buzName = '获取诊断pagescreen页面内容'
    errors = []
    url = 'http://%s/get_plant_pagedetails/316/1' % app.config['SERVERIP']



    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))
        self.a = BeopTools()

    def Test(self):
        rv = {}
        self.errors = []
        try:
            rv = self.a.tokenGet(url=self.url, timeout=3)
        except Exception as e:
            print(e.__str__())
            self.a.writeLogError(self.logger, e.__str__())
            self.errors.append('错误信息[%s]%s---%s' % (self.a.getTime(), self.testCaseID, e.__str__()))
            self.a.raiseError(self.errors, self.testCaseID)
        if rv:
            navItems = rv.get('navItems',[])
            if navItems:
                for x in navItems:
                    if x.get('type') == 'PageScreen':
                        if x.get('layerList'):
                            self.errors.append('错误信息[%s]%s---%s layerList属性不应存在于PageScreen' % (self.a.getTime(),self.testCaseID,x['text']))
                        if x.get('option'):
                            self.errors.append('错误信息[%s]%s---%s option属性不应存在于PageScreen' % (self.a.getTime(),self.testCaseID,x['text']))
        self.a.raiseError(self.errors, self.testCaseID)




    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())



if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Smoke028('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

