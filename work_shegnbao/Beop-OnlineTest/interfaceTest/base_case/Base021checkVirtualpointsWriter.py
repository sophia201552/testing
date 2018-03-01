__author__ = 'kirry'

import requests,time
from interfaceTest.Methods.BeopTools import BeopTools
import unittest, sys
from datetime import datetime
import json
import random

class Base021(unittest.TestCase):
    testCaseID = 'Base021'
    projectName = "虚拟点写入数值"
    buzName = '虚拟点写入数值是否正常'
    start = 0.0
    url = "https://beopservice.beopsmart.com/set_mutile_realtimedata_by_projid"



    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))


    def Test(self):
        self.error = []
        num = random.randint(1,100)
        self.__value = "test_%s"%num
        self.a = BeopTools()
        data = {"TOKEN": "SHHWKPI", "point": ["test_kirry"], "projId":1, "value": [self.__value]}
        try:
            rv = self.a.postJsonToken(self.url,data)
        except Exception as e:
            assert 0,"请求%s接口30s后超时,!"%(self.url)
        if rv:
            status = rv.get("state")
            if status:
                print("请求接口返回数据正常！")
            else:
                self.error.append("修改虚拟点值失败！")
            self.checkdata(status)
        else:
            self.error.append("请求接口%s成功，返回数据为空！"%self.url)


    def checkdata(self,status):
        url = "http://beop.rnbtech.com.hk/point_tool/getCloudPointTable/"
        data = {"projectId":1,"currentPage":1,"pointType":1,"searchText":"test_kirry","t_time":"","pageSize":100}
        try:
            rv = self.a.postJsonToken(url,data)
        except Exception as e:
            assert 0,"请求%s接口超时,超时信息为%s"%(url,e.__str__())
        if rv:
            pointValue = [i["pointValue"] for i in rv["data"]["pointTable"]][0]
            if status:
                if pointValue == self.__value:
                    print("请求接口修改数据成功！")
                else:
                    self.error.append('请求修改虚拟点值接口后，该点的数据没有改变！')
            else:
                if pointValue == self.__value:
                    self.error.append('请求修改虚拟点值接口返回state为0时，但是该点的数据改变了！')
                else:
                    print("修改失败，数据不变")






    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())



if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Base021('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)