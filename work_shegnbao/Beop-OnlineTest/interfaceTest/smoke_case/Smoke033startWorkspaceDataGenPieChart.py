__author__ = 'kirry'
import unittest
import sys
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import time, datetime
import json



class Smoke033(unittest.TestCase):
    testCaseID = 'Smoke033'
    projectName = "无"
    buzName = 'analysis/startWorkspaceDataGenPieChart接口是否返回数据'
    start = 0.0
    now = 0
    startTime = ""
    errors = []
    timeout = 10
    serverip = app.config['SERVERIP']
    url = 'http://%s/analysis/startWorkspaceDataGenPieChart'%app.config['SERVERIP']
    data = {"dsItemIds":["565ffa99833c9764643fd57e","565ffa99833c9764643fd57f","5642fc24833c977b797d1bfb",
                         "564470c8833c977b61b4f3a2","5642fc24833c977b797d1bfc","564470c8833c977b61b4f3a4",
                         "@457|Plant001_Eff","@457|Plant001_Load","@457|ChGroupTotal001_AverageChAMPS",
                         "58b531fe833c972db88b766b","58b52efc833c972db733e142","58b7de1c833c9723ba508628",
                         "@457|R_F_CHW_SupplyT","@457|R_F_CHW_ReturnT01","@457|R_F_CW_ReturnT","@457|R_F_CW_SupplyT",
                         "@457|R_F_CT05_LeaveT","@457|R_F_CT05_EnterT","@457|R_F_CT06_LeaveT","@457|R_F_CT06_EnterT",
                         "@457|ChGroup001_RunNum","@457|CHWPGroup001_RunNum","@457|CWPGroup001_RunNum","@457|CTGroup001_RunNum"]}

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

    def Test(self):
        self.errors = []
        rv = False
        try:
            rv = BeopTools.postJsonToken(self,url=self.url,data=self.data,t=self.timeout)
        except Exception as e:
            self.errors.append("错误信息[%s]%s---接口:%s 数据:%s         异常信息: %s" % (BeopTools.getTime(), self.testCaseID,
                                        self.url, json.dumps(self.data), e.__str__()))
        if rv:
            dslist = rv.get('dsItemList',False)
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
                        self.errors.append('访问接口%s,预期返回有数据,data字段中值为空'%self.url)
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
        suite.addTest(Smoke033('Test'))
        runner = unittest.TextTestRunner()
        result = runner.run(suite)
        i+=1
