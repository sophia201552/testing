__author__ = 'kirry'
import unittest
import sys
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import time, datetime
import json



class Smoke043(unittest.TestCase):
    testCaseID = 'Smoke043'
    projectName = "无"
    buzName = 'analysis/startWorkspaceDataGenHistogram接口是否返回数据'
    start = 0.0
    now = 0
    startTime = ""
    errors = []
    timeout = 10
    serverip = app.config['SERVERIP']
    url = 'http://%s/analysis/startWorkspaceDataGenHistogram'%app.config['SERVERIP']
    data = {'timeEnd': '2016-10-12 13:55:12', 'timeStart': '2016-10-11 13:55:12',
            'timeFormat': 'm5', 'dsItemIds': ['57661a38833c97250a3d20d1', '57661a38833c97250a3d20d2',
            '57661a38833c97250a3d20d3', '57661a38833c97250a3d20d4', '57661a38833c97250a3d20d5',
            '57661a38833c97250a3d20d6', '57661a38833c97250a3d20d7', '57661a38833c97250a3d20d8',
            '57661a38833c97250a3d20d9', '57661a38833c97250a3d20da']}
    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

    def Test(self):
        self.errors = []
        rv = False
        try:
            rv = BeopTools.postJsonToken(url=self.url,data=self.data,t=self.timeout)
        except Exception as e:
            self.errors.append("错误信息[%s]%s---接口:%s 数据:%s         异常信息: %s" % (BeopTools.getTime(), self.testCaseID,
                                        self.url, json.dumps(self.data), e.__str__()))
        if rv:
            dslist = rv.get('list',False)
            if dslist:
                if dslist.__len__() == self.data.get('dsItemIds').__len__():
                    print("接口%s返回数据数量正常！"%self.url)
                else:
                    self.errors.append("接口返回数据数量错误正常数量为%s,错误数量为%s"%(self.data.get('dsItemIds').__len__(),dslist.__len__()))
                for ds in dslist:
                    data = ds.get('data',False)
                    if data:
                        if 'null' in ds or "Null" in data:
                            self.errors.append('访问接口%s,获取%s点值错误，为null!'%(self.url,ds.get("dsItemId")))
                        else:
                            print('访问接口%s,预期返回有数据,data字段中正常'%self.url)
                    else:
                        self.errors.append('访问接口%s,预期返回有数据,data列表中值为空'%self.url)
        BeopTools.raiseError(self.errors, self.testCaseID)





    def tearDown(self):
        self.errors = []
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


if __name__ == '__main__':
    i=0
    while i<10:
        suite = unittest.TestSuite()
        suite.addTest(Smoke043('Test'))
        runner = unittest.TextTestRunner()
        result = runner.run(suite)
        i+=1
