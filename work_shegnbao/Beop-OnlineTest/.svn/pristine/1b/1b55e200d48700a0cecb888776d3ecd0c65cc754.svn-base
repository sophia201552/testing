__author__ = 'woody'

import time
import re
import datetime, sys
import sqlite3
import sqlite3
import unittest
import urllib.request
import json
import urllib.request,http.cookiejar,re
import pymongo
from interfaceTest.Methods.BeopTools import *
from interfaceTest import app


serverip = app.config['SERVERIP']
test_data = {'71':'英文版演示项目06诊断页面','72':'上海华为诊断页面','76':'演示项目06诊断页面','18':'香港华润诊断页面'}
test_url = "http://%s/diagnosis/getStruct/" % serverip
class Smoke015(unittest.TestCase):
    testCaseID = 'Smoke015'
    projectName = '上海华为、中英文演示06、香港华润'
    buzName = '诊断耗时'
    data = test_data


    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def pending(self,item,cost):
        url = test_url + item
        data = self.data
        headers = {'content-type': 'application/json', 'token':'eyJhbGciOiJIUzI1NiIsImV4cCI6MT'}
        r = None
        try:
            r = requests.get(url, timeout=cost, headers=headers)
        except Exception as e:
            print(e)
            assert 0,"%s请求时间超过%d秒!" % (data[item], cost)
        try:
            text = json.loads(r.text)
            if text['equipments'] != []:
                pass
        except Exception as e:
            print(e)
            assert 0,"%s请求设备信息为空!" % (data[item])


        if r.status_code != 200:
            assert 0,"请求%s返回状态不为200!实际为" % (data[item], r.status_code)
        else:
            pass


    def Test(self):
        for key in self.data.keys():
            self.pending(key,15)
            time.sleep(2)

    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())



if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Smoke015('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)


