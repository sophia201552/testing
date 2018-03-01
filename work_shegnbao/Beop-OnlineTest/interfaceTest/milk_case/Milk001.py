__author__ = 'woody'
import socket
import unittest
import time
import datetime, sys, json
from interfaceTest import app
from interfaceTest.Methods.BeopTools import BeopTools
import requests
import hashlib
from urllib.parse import quote, unquote


class Milk001(unittest.TestCase):
    testCaseID = 'Milk001'
    projectName = '光明乳业'
    buzName = '监测牛奶餐车情况'
    errors = []
    user = "16175"
    username = 'test123'
    pwd = '123456'
    car = '沪B51816'
    md5 = hashlib.md5()
    md5.update(pwd.encode())
    pwdMd5 = md5.hexdigest()
    vehicleId = quote(car)
    TIMEOUT = 10
    url = "http://vip.shgps.cn/mobile/vi.aspx?customerId={}&userAccount={}&password={}&vehicleId={}".format(user, username, pwdMd5, vehicleId)

    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))
        self.tool = BeopTools()

    def Test(self):
        self.errors = []
        rv = self.getInfo()
        if rv.get('success'):
            result = rv.get('result')[0]
            for key ,value in result.items():
                if not value:
                    self.errors.append("[%s]%s--url: %s 车牌号:%s 返回结果中%s字段内容为%s" % (
                        self.tool.getTime(), self.testCaseID, self.url, self.car, key, value))
        self.tool.raiseError(self.errors, self.testCaseID)

    def getInfo(self):
        rv = {}
        try:
            rv = self.tool.getData(self.url, self.TIMEOUT)
        except Exception as e:
            self.errors.append('错误信息[%s]%s--%s' % (self.tool.getTime(), self.testCaseID, e.__str__()))
        return rv

    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())



if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Milk001('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

