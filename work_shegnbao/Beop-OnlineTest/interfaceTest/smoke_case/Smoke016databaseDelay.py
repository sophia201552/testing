__author__ = 'woody'
from interfaceTest.Methods.BeopTools import *
import requests, sys
from time import sleep
import unittest
import json
from interfaceTest import app

serverip = app.config['SERVERIP']
class Smoke016(unittest.TestCase):
    testCaseID = 'Smoke016'


    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        url = "http://"+serverip+'/get_realtimedata_delay'
        dataShhw = json.dumps({'projId':'17'})
        headers = {'content-type': 'application/json', 'token':'eyJhbGciOiJIUzI1NiIsImV4cCI6MT'}
        try:
            r = requests.post(url=url,data=dataShhw,timeout=15,headers=headers)
        except Exception as e:
            print(e)
            assert 0,"获取"+url+"接口请求超时,超过15秒!"
        if r.status_code != 200:
            assert 0,"获取"+url+"接口返回状态不为200!"
        else:
            pass
        c = json.loads(r.text)
        if c['delaySeconds'] > float(15):
            assert 0,"主从数据库显示延迟时间超过15.0秒!"
        else:
            print(c['info']+' '+str(c['delaySeconds']))



    def tearDown(self):
        self.errors = []
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())



if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Smoke016('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)


