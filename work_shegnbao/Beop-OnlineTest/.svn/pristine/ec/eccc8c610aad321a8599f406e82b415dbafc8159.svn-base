#测试上海华为项目界面dashboard
__author__ = 'Woody'
#creator on 2015-08-24
import time
import unittest, sys
import json
from interfaceTest.Methods.BeopTools import *
from interfaceTest import app

serverip = app.config['SERVERIP']


Info = {'error': "no history data", 'msg': "no history data"}
class Smoke011(unittest.TestCase):
    testCaseID = 'Smoke011'
    projectName = '上海华为'
    buzName = '总览页面dashboard读取历史数据耗时'


    x = BeopTools()
    #当前时间
    cur_time = x.strtime()
    #一小时时间
    cur_time2 = x.his_timeH()
    #12小时时间
    cur_time3 = x.his_timeH2()
    #半年时间
    his_time1 = x.his_timeY()
    #一个月时间时间
    his_time2 = x.his_timeM()
    #一周时间
    his_time3 = x.his_timeW()
    #一天时间
    his_timeD = x.his_timeD()
    d = {
         '55b7349c94022d08a8f43694':'冷源系统COP',
         '559128e094022d1170e2de6a':'蒸发器趋近温度',
         '5591290694022d1170e2de72':'冷凝器趋近温度',
         '55c1872c1c954703e0c9b3fc':'机房能耗'
        }

    his_url = 'http://%s/analysis/startWorkspaceDataGenHistogram' % serverip

    cur_url = 'http://%s/analysis/startWorkspaceDataGenPieChart' % serverip




    #机房能耗url
    url = 'http://%s/analysis/startWorkspaceDataGenHistogram' % serverip
    #实时数据,1个点
    cur_data = {"dsItemIds":["55bf521c1c9547073463af8e","55bf3e811c9547073463aee0","55bf543e1c9547073463af9b",
                             "55bef0b01c95470aa8311108","55bf3e811c9547073463aee2","55bf3e811c9547073463aee1",
                             "55bf3e811c9547073463aedd","55bf3e811c9547073463aede","55bf3e811c9547073463aedf",
                             "55b7349c94022d08a8f43694","559128e094022d1170e2de6a","5591290694022d1170e2de72",
                             "55c1872c1c954703e0c9b3fc"]}








    his_data1 = {
                    "dsItemIds":["5591290694022d1170e2de72"],
                    "timeStart":his_time1,
                    "timeEnd":cur_time,
                    "timeFormat":"d1"
                }


    his_data2 = {   "dsItemIds":["55b7349c94022d08a8f43694"],
                    "timeStart":his_time2,
                    "timeEnd":cur_time,
                    "timeFormat":"m5"
                }


    his_data3 = [
                    {"dsItemIds":["559128e094022d1170e2de6a"],
                    "timeStart":his_time3,
                    "timeEnd":cur_time,
                    "timeFormat":"m5"}
                ]
    cost_data = {"dsItemIds":["55c1872c1c954703e0c9b3fc"],
                 "timeStart":his_timeD,
                 "timeEnd":cur_time,"timeFormat":"m5"}
    #实时数据，7个点(上个小时1分钟数据)
    cost_data2 = {"dsItemIds":["559128e094022d1170e2de63","559128e094022d1170e2de64","559128e094022d1170e2de65",
                              "559128e094022d1170e2de66","559128e094022d1170e2de67","559128e094022d1170e2de68",
                              "559128e094022d1170e2de69"],
                              "timeStart":cur_time2,"timeEnd":cur_time,
                              "timeFormat":"m1"}
    #实时数据，7个点(半天5分钟数据)
    cost_data3 = {"dsItemIds":["559128e094022d1170e2de63","559128e094022d1170e2de64","559128e094022d1170e2de65",
                              "559128e094022d1170e2de66","559128e094022d1170e2de67","559128e094022d1170e2de68",
                              "559128e094022d1170e2de69"],
                              "timeStart":cur_time3,"timeEnd":cur_time,
                              "timeFormat":"m5"}
    #实时数据，7个点(一周1小时数据)
    cost_data4 = {"dsItemIds":["559128e094022d1170e2de63","559128e094022d1170e2de64","559128e094022d1170e2de65",
                              "559128e094022d1170e2de66","559128e094022d1170e2de67","559128e094022d1170e2de68",
                              "559128e094022d1170e2de69"],
                              "timeStart":his_time3,"timeEnd":cur_time,
                              "timeFormat":"h1"}
    #实时数据,7个点(一个月1天数据)
    cost_data5 = {"dsItemIds":["559128e094022d1170e2de63","559128e094022d1170e2de64","559128e094022d1170e2de65",
                              "559128e094022d1170e2de66","559128e094022d1170e2de67","559128e094022d1170e2de68",
                              "559128e094022d1170e2de69"],
                              "timeStart":his_time2,"timeEnd":cur_time,
                              "timeFormat":"d1"}
    #实时数据,7个点(半年1个月数据)
    cost_data6 = {"dsItemIds":["559128e094022d1170e2de63","559128e094022d1170e2de64","559128e094022d1170e2de65",
                              "559128e094022d1170e2de66","559128e094022d1170e2de67","559128e094022d1170e2de68",
                              "559128e094022d1170e2de69"],
                              "timeStart":his_time1,"timeEnd":cur_time,
                              "timeFormat":"M1"}

#返回[]
    wrong_data1 = {"dsItemIds":["55e65603833c976713fa2e7f"],
                              "timeStart":'2015-11-30 00:00:00',"timeEnd":'2015-12-07 23:59:59',
                              "timeFormat":"m1"}

#返回[]
    wrong_data2 = {"dsItemIds":["55e65603833c976713fa2e7f"],
                                    "timeStart":"2015-12-07 00:00:00",
                                    "timeEnd":"2015-12-07 23:59:59","timeFormat":"m1"}

#返回[]
    wrong_data3 = {"dsItemIds":["55ee6248833c97057362d58e"],
                                    "timeStart":"2015-11-22 00:00:00",
                                    "timeEnd":"2015-12-07 23:59:59","timeFormat":"m5"}

#返回[]
    wrong_data4 = {"dsItemIds":["55ee6248833c97057362d58e"],
                                    "timeStart":"2015-12-07 00:00:00",
                                    "timeEnd":"2015-12-07 23:59:59","timeFormat":"m5"}
#返回[]
    wrong_data5 = {"dsItemIds":["55d19424833c975b9bdbe8cd"],
                                    "timeStart":"2014-01-07 00:00:00",
                                    "timeEnd":"2015-12-07 23:59:59","timeFormat":"m5"}
#返回正常数据
    right_data = {"dsItemIds":["55d19424833c975b9bdbe8cd"],
                                    "timeStart":"2015-12-07 00:00:00",
                                    "timeEnd":"2015-12-07 23:59:59","timeFormat":"m1"}

#返回[]
    wrong_data6 = {"dsItemIds":["55e65603833c976713fa2e7f","55ee6248833c97057362d58e"],
                                    "timeStart":"2015-10-05 00:00:00",
                                    "timeEnd":"2019-12-07 23:59:59","timeFormat":"h1"}

#返回2个[]
    wrong_data7 = {"dsItemIds":["55e65603833c976713fa2e7f","55ee6248833c97057362d58e"],
                                    "timeStart":"2015-12-07 00:00:00",
                                    "timeEnd":"2015-12-07 23:59:59","timeFormat":"m1"}

#返回[]+正常数据
    data1 = {"dsItemIds":["55e65603833c976713fa2e7f","55d19424833c975b9bdbe8cd"],
                                    "timeStart":"2014-12-07 00:00:00",
                                    "timeEnd":"2015-12-07 23:59:59","timeFormat":"M1"}

#返回[]+正常数据

    data2 = {"dsItemIds":["55e65603833c976713fa2e7f","55d19424833c975b9bdbe8cd"],
                                    "timeStart":"2015-12-07 00:00:00",
                                    "timeEnd":"2015-12-07 23:59:59","timeFormat":"m5"}

#返回[]
    wrong_data8 = {"dsItemIds":["55ee6248833c97057362d58e","55d19424833c975b9bdbe8cd"],
                                    "timeStart":"2013-10-07 00:00:00",
                                    "timeEnd":"2015-12-07 23:59:59","timeFormat":"d1"}

#返回[]+正常数据
    data3 = {"dsItemIds":["55ee6248833c97057362d58e","55d19424833c975b9bdbe8cd"],
                                    "timeStart":"2015-09-07 00:00:00",
                                    "timeEnd":"2015-12-07 23:59:59","timeFormat":"M1"}

#返回[]
    wrong_data9 = {"dsItemIds":["55ee6248833c97057362d58e","55d19424833c975b9bdbe8cd","55e65603833c976713fa2e7f"],
                                    "timeStart":"20115-09-07 00:00:00",
                                    "timeEnd":"20150-12-07 23:59:59","timeFormat":"M1"}

#返回正常数据+[]
    data4 = {"dsItemIds":["55ee6248833c97057362d58e","55d19424833c975b9bdbe8cd","55e65603833c976713fa2e7f"],
                                    "timeStart":"2015-12-07 00:00:00",
                                    "timeEnd":"2015-12-07 23:59:59","timeFormat":"m1"}
    data5 = {"dsItemIds":["55ee6248833c97057362d58e","55d19424833c975b9bdbe8cd","55e65603833c976713fa2e7f"],
                                    "timeStart":"2015-12-07 00:00:00",
                                    "timeEnd":"2015-12-07 23:59:59","timeFormat":"m5"}
    data6 = {"dsItemIds":["55ee6248833c97057362d58e","55d19424833c975b9bdbe8cd","55e65603833c976713fa2e7f"],
                                    "timeStart":"2015-12-07 00:00:00",
                                    "timeEnd":"2015-12-07 23:59:59","timeFormat":"h1"}
    data7 = {"dsItemIds":["55ee6248833c97057362d58e","55d19424833c975b9bdbe8cd","55e65603833c976713fa2e7f"],
                                    "timeStart":"2015-11-07 00:00:00",
                                    "timeEnd":"2015-12-07 23:59:59","timeFormat":"d1"}
    data8 = {"dsItemIds":["55ee6248833c97057362d58e","55d19424833c975b9bdbe8cd","55e65603833c976713fa2e7f"],
                                    "timeStart":"2015-08-07 00:00:00",
                                    "timeEnd":"2015-12-07 00:00:00","timeFormat":"M1"}


    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))


    def Test(self):
        self.GenHistogram()
        self.GenHistogramMulti1()
        self.GenPieChart()
        self.getWrongData()



    #测试获取实时数据接口
    def GenPieChart(self):
        text = BeopTools.postJson(self,self.cur_url,self.cur_data,t=20)
        a = text['dsItemList']
        for i in a:
            self.assertIsNotNone(i['data'],"上海华为->总览页面->dsItemID为%s内数据为空!" % i['dsItemId'])
        print("上海华为总览页面dsItemID为%s实时数据正常!" % i['dsItemId'])


    #测试获取历史数据接口
    def GenHistogramMulti1(self):
        headers = {'content-type': 'application/json', 'token':'eyJhbGciOiJIUzI1NiIsImV4cCI6MT'}
        try:
            r =requests.post(self.his_url,json=self.his_data1,timeout=20,headers=headers)
        except Exception:
            assert 0,"上海华为->总览界面->请求%s数据超时(超过20秒)!" % self.his_url
        self.assertEqual(r.status_code,200,"接口%s,参数:%s,status_code:%s" %(self.his_url,str(self.his_data1),str(r.status_code)))
        text = json.loads(r.text)
        a = text['list'][0]
        self.assertIsNotNone(a['data'],"上海华为->总览界面->%s数据为空!" % self.d[a['dsItemId']])
        print('上海华为->总览界面->%s数据正常!'% self.d[a['dsItemId']])


        try:
            r =requests.post(self.his_url,json=self.his_data2,timeout=20,headers=headers)
        except Exception:
            assert 0,"上海华为->总览界面->请求%s一个月的小时数据超时(超过20秒)!" % self.his_url
        self.assertEqual(r.status_code,200,"接口%s,参数:%s,status_code:%s" %(self.his_url,str(self.his_data1),str(r.status_code)))
        text = json.loads(r.text)
        if "error" in text.keys():
            print("ok")
        else:
            assert 0,"请求小时历史数据超过时间周期未给出提示!"





    def GenHistogram(self):
        text = BeopTools.postJson(self,self.url,self.cost_data,t=20)
        a = text['list'][0]
        self.assertIsNotNone(a['data'],"上海华为->总览页面->%s数据为空!" % self.d[a['dsItemId']])
        print("上海华为总览页面%s实时数据正常!" % self.d[a['dsItemId']])
        headers = {'content-type': 'application/json', 'token':'eyJhbGciOiJIUzI1NiIsImV4cCI6MT'}
        try:
            r =requests.post(self.url,json=self.cost_data2,timeout=20,headers=headers)
        except Exception:
            assert 0,"上海华为->KPI管理->KPI详情->趋近温度->各冷机蒸发器趋近温度（℃）页面请求一小时的1分钟数据超时(超过20秒)!"
        self.assertEqual(r.status_code,200,"上海华为总览界面历史数据返回数据出错!")
        text = json.loads(r.text)
        a = text['list'][0]
        self.assertIsNotNone(a['data'],"上海华为->KPI管理->KPI详情->趋近温度->各冷机蒸发器趋近温度（℃）页面请求一小时的1分钟数据为空!")
        print("上海华为->KPI管理->KPI详情->趋近温度->各冷机蒸发器趋近温度（℃）页面历史数据正常!")

        try:
            r =requests.post(self.url,json=self.cost_data3,timeout=20,headers=headers)
        except Exception:
            assert 0,"上海华为->KPI管理->KPI详情->趋近温度->各冷机蒸发器趋近温度（℃）页面请求半天的5分钟数据超时(超过20秒)!"
        self.assertEqual(r.status_code,200,"接口%s,参数:%s,status_code:%s" %(self.his_url,str(self.his_data1),str(r.status_code)))
        text = json.loads(r.text)
        a = text['list'][0]
        self.assertIsNotNone(a['data'],"上海华为->KPI管理->KPI详情->趋近温度->各冷机蒸发器趋近温度（℃）页面请求半天的5分钟数据为空!")
        print("上海华为->KPI管理->KPI详情->趋近温度->各冷机蒸发器趋近温度（℃）页面历史数据正常!")

        try:
            r =requests.post(self.url,json=self.cost_data4,timeout=20,headers=headers)
        except Exception:
            assert 0,"上海华为->KPI管理->KPI详情->趋近温度->各冷机蒸发器趋近温度（℃）页面请求一周的1小时数据超时(超过20秒)!"
        self.assertEqual(r.status_code,200,"接口%s,参数:%s,status_code:%s" %(self.his_url,str(self.his_data1),str(r.status_code)))
        text = json.loads(r.text)
        a = text['list'][0]
        self.assertIsNotNone(a['data'],"上海华为->KPI管理->KPI详情->趋近温度->各冷机蒸发器趋近温度（℃）页面请求一周的1小时数据为空!")
        print("上海华为->KPI管理->KPI详情->趋近温度->各冷机蒸发器趋近温度（℃）页面历史数据正常!")

        try:
            r =requests.post(self.url,json=self.cost_data5,timeout=20,headers=headers)
        except Exception:
            assert 0,"上海华为->KPI管理->KPI详情->趋近温度->各冷机蒸发器趋近温度（℃）页面请求一个月的1天数据超时(超过20秒)!"
        self.assertEqual(r.status_code,200,"接口%s,参数:%s,status_code:%s" %(self.his_url,str(self.his_data1),str(r.status_code)))
        text = json.loads(r.text)
        a = text['list'][0]
        self.assertIsNotNone(a['data'],"上海华为->KPI管理->KPI详情->趋近温度->各冷机蒸发器趋近温度（℃）页面请求一个月的1天数据为空!")
        print("上海华为->KPI管理->KPI详情->趋近温度->各冷机蒸发器趋近温度（℃）页面历史数据正常!")

        try:
            r =requests.post(self.url,json=self.cost_data6,timeout=20,headers=headers)
        except Exception:
            assert 0,"上海华为->KPI管理->KPI详情->趋近温度->各冷机蒸发器趋近温度（℃）页面请求半年的1个月数据超时(超过20秒)!"
        self.assertEqual(r.status_code,200,"接口%s,参数:%s,status_code:%s" %(self.his_url,str(self.his_data1),str(r.status_code)))
        text = json.loads(r.text)
        a = text['list'][0]
        self.assertIsNotNone(a['data'],"上海华为->KPI管理->KPI详情->趋近温度->各冷机蒸发器趋近温度（℃）页面请求半年的1个月数据为空!")
        print("上海华为->KPI管理->KPI详情->趋近温度->各冷机蒸发器趋近温度（℃）页面历史数据正常!")



    def getWrongData(self):

        a = BeopTools()
        wrongData = []
        rightData = []
        Data = []
        for i in range(1,10):
            data = eval("self.wrong_data" + str(i))
            wrongData.append(data)
        for i in range(1,9):
            data = eval("self.data" + str(i))
            Data.append(data)
        rightData.append(self.right_data)
        resultW,resultR,resultD = [],[],[]

        for data in wrongData:
            self.Run(self.url,data,resultW)
        for data in rightData:
            self.Run(self.url,data,resultR)
        for data in Data:
            self.Run(self.url,data,resultD)
        self.check(resultD,error=0,none=8)
        self.check(resultR,error=0,none=0)
        self.check(resultW,error=5,none=4)
        time.sleep(1)





    def Run(self,url,data,result):
        a = BeopTools()
        r = a.postData(url,data,30)
        result.append(r)

    def check(self,data,error,none):
        e = 0
        n = 0
        for x in data:
            if 'error' in x.keys():
                e += 1
            else:
                if x["list"][0]["data"] == []:
                    n += 1
        if e == error and n == none:
            print("结果正常")
        else:
            assert 0,"请求历史数据与预期结果不符合，请查看代码并检查!"




    def tearDown(self):
        self.errors = []
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())



if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Smoke011('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
