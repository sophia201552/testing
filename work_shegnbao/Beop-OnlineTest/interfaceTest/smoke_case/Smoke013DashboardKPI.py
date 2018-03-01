__author__ = 'wuranxu'

import re
import datetime, sys
import time
from interfaceTest import app
from interfaceTest.Methods.BeopTools import *
import unittest
serverip = app.config['SERVERIP']
class Smoke013(unittest.TestCase):
    url = 'http://%s' % serverip
    #url = 'http://beop.rnbtech.com.hk'
    testCaseID = 'Smoke013'

    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))



    def Test(self):
        #创建一个KPI仪表盘
        data = {"creatorId":404,"menuItemId":"55d18c5a833c975b9bdbe87f",
                "layout":[[{"id":"1442900539003","spanC":3,"spanR":2,
                            "modal":{"type":"ModalKPIChart","title":"Test","link":"55d18c5a833c975b9bdbe881",
                                     "wikiId":"5600ea74833c973f7144d78d","popId":"ddd","points":[],
                                     "option":{"chartName":"test","chartLowerLimit":0,"chartUpperLimit":20,
                                               "referenceCondition":0,"referenceConditionName":"Equal To (=)",
                                               "referenceConditionVal":222,"dataCycleMode":0,
                                               "dataCycleModeName":"Monthly","warnMode":1,"warnModeName":"From History",
                                               "isShowRC":None,"isShowRCName":"","warnLowerLimit":None,
                                               "warnUpperLimit":None,"warnTimeMode":0,
                                               "warnTimeModeName":"From User Input","historyValUsage":1,
                                               "historyValUsageName":"Use As Upper Limit","warnTimeRangeStart":"2015-07-01",
                                               "preWarnMode":0,"preWarnModeName":"From User Input","preGreaterThan":1,
                                               "preLessThan":2,"preWarnTimeMode":0,"preWarnTimeModeName":"From User Input",
                                               "preHistoryValUsage":0,"preHistoryValUsageName":"Use As Lower Limit",
                                               "preWarnTimeRangeStart":""},"interval":60000}}]],
                "id":"55b49d3b94022d08a8f17349"}

        str = ['Test','ModalKPIChart',3,2,'1442900539003',"5600ea74833c973f7144d78d","ddd","test",0,"55b49d3b94022d08a8f17349","55d18c5a833c975b9bdbe881"]
        #判断返回状态
        status = BeopTools.postJson(self,url=self.url+'/spring/saveLayout',data=data)
        if status == 'success':
            print("dashboard->创建KPI仪表盘成功!")
        else:
            assert 0,"dashboard->创建KPI仪表盘模块失败,返回状态不为success!"

        #发送get请求,获取该模块的title等信息进行比对
        r = BeopTools.getJson(self,self.url+'/spring/get/55d18c5a833c975b9bdbe87f/404')
        L = []
        type = r['layout'][0][0]['modal']['type']
        L.append(type)
        title = r['layout'][0][0]['modal']['title']
        L.append(title)
        spanC = r['layout'][0][0]['spanC']
        L.append(spanC)
        spanR = r['layout'][0][0]['spanR']
        L.append(spanR)
        layoutID = r['layout'][0][0]['id']
        L.append(layoutID)
        link = r['layout'][0][0]['modal']['link']
        L.append(link)
        wikiId = r['layout'][0][0]['modal']['wikiId']
        L.append(wikiId)
        popId = r['layout'][0][0]['modal']['popId']
        L.append(popId)
        chartName = r['layout'][0][0]['modal']['option']['chartName']
        L.append(chartName)
        chartLowerLimit = r['layout'][0][0]['modal']['option']['chartLowerLimit']
        L.append(chartLowerLimit)
        ID = r['id']
        L.append(ID)
        a = set(str)
        b = set(L)

        #判断创建的KPI仪表盘get的信息是否与输入的信息一致
        if a.union(b) == a:
            print("dashboard->成功获取到新建的KPI仪表盘模块!")
        else:
            assert 0,"dashboard->获取新建的KPI仪表盘模块与输入信息不一致!"
        m = len(r['layout'][0])
        if m > 0:
            print("dashboard新建KPI仪表盘后模块数量为%d" % m)
        else:
            assert 0,"dashboard新建KPI仪表盘后模块数量为0!"


        #更新创建的仪表盘信息
        str2 = ['TestChange','ModalKPIChart',3,2,'1442900539003',"5600ea74833c973f7144d78d","hello","test_rename",10,"55b49d3b94022d08a8f17349","55d18c5a833c975b9bdbe881"]
        data2 = {"creatorId":404,"menuItemId":"55d18c5a833c975b9bdbe87f",
                "layout":[[{"id":"1442900539003","spanC":3,"spanR":2,
                            "modal":{"type":"ModalKPIChart","title":"TestChange","link":"55d18c5a833c975b9bdbe881",
                                     "wikiId":"5600ea74833c973f7144d78d","popId":"hello","points":[],
                                     "option":{"chartName":"test_rename","chartLowerLimit":10,"chartUpperLimit":20,
                                               "referenceCondition":0,"referenceConditionName":"Equal To (=)",
                                               "referenceConditionVal":222,"dataCycleMode":0,
                                               "dataCycleModeName":"Monthly","warnMode":1,"warnModeName":"From History",
                                               "isShowRC":None,"isShowRCName":"","warnLowerLimit":None,
                                               "warnUpperLimit":None,"warnTimeMode":0,
                                               "warnTimeModeName":"From User Input","historyValUsage":1,
                                               "historyValUsageName":"Use As Upper Limit","warnTimeRangeStart":"2015-07-01",
                                               "preWarnMode":0,"preWarnModeName":"From User Input","preGreaterThan":1,
                                               "preLessThan":2,"preWarnTimeMode":0,"preWarnTimeModeName":"From User Input",
                                               "preHistoryValUsage":0,"preHistoryValUsageName":"Use As Lower Limit",
                                               "preWarnTimeRangeStart":""},"interval":60000}}]],
                "id":"55b49d3b94022d08a8f17349"}
        #判断返回状态
        status2 = BeopTools.postJson(self,url=self.url+'/spring/saveLayout',data=data2)
        if status2 == 'success':
            print("dashboard->更新KPI仪表盘成功!")
        else:
            assert 0,"dashboard->更新KPI仪表盘模块失败,返回状态不为success!"

        #发送get请求,获取该模块的title等信息进行比对
        r2 = BeopTools.getJson(self,self.url+'/spring/get/55d18c5a833c975b9bdbe87f/404')
        L2 = []
        type2 = r2['layout'][0][0]['modal']['type']
        L2.append(type2)
        title2 = r2['layout'][0][0]['modal']['title']
        L2.append(title2)
        spanC2 = r2['layout'][0][0]['spanC']
        L2.append(spanC2)
        spanR2 = r2['layout'][0][0]['spanR']
        L2.append(spanR2)
        layoutID2 = r2['layout'][0][0]['id']
        L2.append(layoutID2)
        link2 = r2['layout'][0][0]['modal']['link']
        L2.append(link2)
        wikiId2 = r2['layout'][0][0]['modal']['wikiId']
        L2.append(wikiId2)
        popId2 = r2['layout'][0][0]['modal']['popId']
        L2.append(popId2)
        chartName2 = r2['layout'][0][0]['modal']['option']['chartName']
        L2.append(chartName2)
        chartLowerLimit2 = r2['layout'][0][0]['modal']['option']['chartLowerLimit']
        L2.append(chartLowerLimit2)
        ID2 = r2['id']
        L2.append(ID2)
        a2 = set(str2)
        b2 = set(L2)

        #判断创建的KPI仪表盘get的信息是否与输入的信息一致
        if a2.union(b2) == a2:
            print("dashboard->成功获取到更新后的KPI仪表盘模块!")
        else:
            assert 0,"dashboard->获取更新后的KPI仪表盘模块与输入信息不一致!"
        m2 = len(r2['layout'][0])
        if m2 > 0:
            print("dashboard新建KPI仪表盘后模块数量为%d" % m)
        else:
            assert 0,"dashboard新建KPI仪表盘后模块数量为0!"










        #删除dashboard接口测试
        delete = {"creatorId":404,"menuItemId":"55d18c5a833c975b9bdbe87f","layout":[[]],"id":"55b49d3b94022d08a8f17349"}
        s = BeopTools().postJson(url=self.url+'/spring/saveLayout',data=delete)
        if s == 'success':
            print("dashboard->删除新创建的KPI仪表盘成功!")
        else:
            assert 0,"dashboard->删除新创建的KPI仪表盘模块失败,返回状态不为success!"

        #发送get请求验证该模块是否有被删除
        r2 = BeopTools().getJson(self.url + '/spring/get/55d18c5a833c975b9bdbe87f/404')
        m2 = len(r2['layout'][0])
        if m2 == m - 1:
            print("dashboard删除新建KPI仪表盘后模块数量为%d" % m2)
        else:
            assert 0,"dashboard删除新建KPI仪表盘后模块数量不为%d!" % m2

    def tearDown(self):
        self.errors = []
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())



if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Smoke013('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)