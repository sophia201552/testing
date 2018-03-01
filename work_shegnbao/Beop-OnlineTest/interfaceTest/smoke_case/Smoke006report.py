# 测试华为项目报表是否存在
__author__ = 'woody'
import unittest
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import datetime
import requests
import re
import time
serverip = app.config.get('SERVERIP')
class Smoke006(unittest.TestCase):
    Expected = []
    ExpectedStatus = 200
    testCaseID = 'Smoke006'
    projectName = '2个华为及演示项目'
    buzName = '报告内容是否存在'

    def setUp(self):
        self.start = datetime.datetime.now()

    def Test(self):
        if datetime.datetime.now().day > 5:
            if 8 <= datetime.datetime.now().hour <= 22:
                self.DemoChs06()
                self.DemoEn06()
                self.Shhw()
                #self.Szhw()

    def SplitDate(self):
        Today = datetime.date.today()
        yestday = Today - datetime.timedelta(days=1)
        L = str(Today).split('-')
        self.Date = str(yestday)
        self.year = L[0]
        self.month = L[1]
        self.Date2 = str(Today)
        L2 = str(Today).split("-")


        if int(self.month) < 10:
            if int(self.month) == 1:
                self.month2 = "12"
                self.year2 = str(int(self.year) - 1)
            else:
                self.month2 = '0' + str(int(self.month) - 1)
                self.year2 = self.year

    def Shhw(self):
        urls, urls2 = [], []
        ID = "report-unit-1-1"
        ReportName = {
            'KPIReport': 'KPI日报',
            'CostReport': '能耗及费用报表',
            'MonthPatternReport': '能效分析月报',
            'DailyReport': '日常抄表',
            'RunReport': '运行报表',
            'DiagnosisReport': '诊断报表',
            'getReportList': '报告列表',
            'getReport': '报告'
        }
        self.SplitDate()
        #报表list判断
        Rname = ['KPIReport', 'CostReport', 'MonthPatternReport', 'DailyReport', 'RunReport', 'DiagnosisReport']
        Rdate = [self.Date, self.Date, self.year2 + '-' + self.month2, self.Date, self.Date,
                 self.year2 + '-' + self.month2]
        headers = {'content-type': 'application/json', 'token':'eyJhbGciOiJIUzI1NiIsImV4cCI6MT'}
        for i in range(6):
            urls.append('http://' + serverip + '/report/getReportList/shhuawei/%s/%s' % (Rname[i], Rdate[i]))
            urls2.append('http://' + serverip + '/report/getReport/shhuawei/%s/%s' % (Rname[i], Rdate[i]))
        for url in urls:
            name = str(url).split("/")
            result = BeopTools.getJson(self, url)
            r = requests.get(url,headers=headers)
            RealStatus = r.status_code
            if result == None:
                assert 0, '上海华为项目->%s->%s为空！' % (ReportName[name[6]], ReportName[name[4]])
            #self.assertIsNotNone(result,'上海华为项目->%s->%s为空！'% (ReportName[name[6]],ReportName[name[4]]))
            if RealStatus != self.ExpectedStatus:
                assert 0, '上海华为项目->%s->%s获取失败！' % (ReportName[name[6]], ReportName[name[4]])
            #self.assertEqual(self.ExpectedStatus,RealStatus,'上海华为项目->%s->%s获取失败！'% (ReportName[name[6]],ReportName[name[4]]))
            print("上海华为项目->%s->%s获取成功!" % (ReportName[name[6]], ReportName[name[4]]))
        a = 0
        for url in urls2:
            name = str(url).split("/")
            r = requests.get(url,headers=headers)
            RealStatus = r.status_code
            if self.ExpectedStatus != RealStatus:
                assert 0, '上海华为项目->%s->%s获取失败！' % (ReportName[name[6]], ReportName[name[4]])
            #self.assertEqual(self.ExpectedStatus,RealStatus,'上海华为项目->%s->%s获取失败！'% (ReportName[name[6]],ReportName[name[4]]))
            txt = r.text
            m = re.search(ID, r.text)
            if m:
                print("上海华为项目->%s->%s获取成功!" % (ReportName[name[6]], ReportName[name[4]]))
            else:
                assert 0, "上海华为项目->%s->%s获取失败!" % (ReportName[name[6]], ReportName[name[4]])
            a = a + 1

    def Szhw(self):
        urls, urls2 = [], []
        ID = "report-unit-1-1"
        ReportName = {
            '1': '能效分析',
            '2': '设备诊断',
            '3': '控制诊断',
            '4': '系统缺陷诊断',
            '5': 'KPI运营评估',
            'default': '运营日报',
            'getReportList': '报告列表',
            'getReport': '报告'
        }
        self.SplitDate()
        #报表list判断
        Rname = ['1', '2', '3', '4', '5', 'default']
        Rdate = [self.year2 + '-' + self.month2, self.year2 + '-' + self.month2, self.year2 + '-' + self.month2,
                 self.year2 + '-' + self.month2, self.year2 + '-' + self.month2, self.Date]
        headers = {'content-type': 'application/json', 'token':'eyJhbGciOiJIUzI1NiIsImV4cCI6MT'}
        for i in range(6):
            urls.append('http://' + serverip + '/report/getReportList/HuaweiPlant/%s/%s' % (Rname[i], Rdate[i]))
            urls2.append('http://' + serverip + '/report/getReport/HuaweiPlant/%s/%s' % (Rname[i], Rdate[i]))
        for url in urls:
            name = str(url).split("/")
            result = BeopTools.getJson(self, url)
            r = requests.get(url,headers=headers)
            RealStatus = r.status_code
            if result == None:
                assert 0, '深圳华为项目->%s->%s为空！' % (ReportName[name[6]], ReportName[name[4]])
            #self.assertIsNotNone(result,'深圳华为项目->%s->%s为空！'% (ReportName[name[6]],ReportName[name[4]]))
            if self.ExpectedStatus != RealStatus:
                assert 0, '深圳华为项目->%s->%s获取失败！' % (ReportName[name[6]], ReportName[name[4]])
            #self.assertEqual(self.ExpectedStatus,RealStatus,'深圳华为项目->%s->%s获取失败！'% (ReportName[name[6]],ReportName[name[4]]))
            print("深圳华为项目->%s->%s获取成功!" % (ReportName[name[6]], ReportName[name[4]]))
        a = 0
        for url in urls2:
            name = str(url).split("/")
            r = requests.get(url,headers=headers)
            RealStatus = r.status_code
            if self.ExpectedStatus != RealStatus:
                assert 0, '深圳华为项目->%s->%s获取失败！' % (ReportName[name[6]], ReportName[name[4]])
            #self.assertEqual(self.ExpectedStatus,RealStatus,'深圳华为项目->%s->%s获取失败！'% (ReportName[name[6]],ReportName[name[4]]))
            m = re.search(ID, r.text)
            if m:
                print("深圳华为项目->%s->%s获取成功!" % (ReportName[name[6]], ReportName[name[4]]))
            else:
                assert 0, "深圳华为项目->%s->%s获取失败!" % (ReportName[name[6]], ReportName[name[4]])
            a = a + 1

    def DemoChs03(self):
        urls, urls2 = [], []
        ID = "report-unit-1-1"
        ReportName = {
            '1': '能效诊断',
            '2': '设备诊断',
            '3': '控制诊断',
            '4': '系统缺陷诊断',
            '5': 'KPI考核',
            'default': '运营报表',
            'getReportList': '报告列表',
            'getReport': '报告'
        }
        self.SplitDate()
        #报表list判断
        Rname = ['1', '2', '3', '4', '5', 'default']
        Rdate = [self.year + '-' + self.month2, self.year + '-' + self.month2, self.year + '-' + self.month2,
                 self.year + '-' + self.month2, self.year + '-' + self.month2, self.Date]
        headers = {'content-type': 'application/json', 'token':'eyJhbGciOiJIUzI1NiIsImV4cCI6MT'}
        for i in range(6):
            urls.append('http://' + serverip + '/report/getReportList/DemoChs03/%s/%s' % (Rname[i], Rdate[i]))
            urls2.append('http://' + serverip + '/report/getReport/DemoChs03/%s/%s' % (Rname[i], Rdate[i]))
        for url in urls:
            name = str(url).split("/")
            result = BeopTools.getJson(self, url)
            r = requests.get(url,headers=headers)
            RealStatus = r.status_code
            if result == None:
                assert 0, '演示03-某研发中心项目->%s->%s为空！' % (ReportName[name[6]], ReportName[name[4]])
            #self.assertIsNotNone(result,'深圳华为项目->%s->%s为空！'% (ReportName[name[6]],ReportName[name[4]]))
            if self.ExpectedStatus != RealStatus:
                assert 0, '演示03-某研发中心项目->%s->%s获取失败！' % (ReportName[name[6]], ReportName[name[4]])
            #self.assertEqual(self.ExpectedStatus,RealStatus,'深圳华为项目->%s->%s获取失败！'% (ReportName[name[6]],ReportName[name[4]]))
            print("演示03-某研发中心项目->%s->%s获取成功!" % (ReportName[name[6]], ReportName[name[4]]))
        a = 0
        for url in urls2:
            name = str(url).split("/")
            r = requests.get(url,headers=headers)
            RealStatus = r.status_code
            if self.ExpectedStatus != RealStatus:
                assert 0, '演示03-某研发中心项目->%s->%s获取失败！' % (ReportName[name[6]], ReportName[name[4]])
            #self.assertEqual(self.ExpectedStatus,RealStatus,'深圳华为项目->%s->%s获取失败！'% (ReportName[name[6]],ReportName[name[4]]))
            m = re.search(ID, r.text)
            if m:
                print("演示03-某研发中心项目->%s->%s获取成功!" % (ReportName[name[6]], ReportName[name[4]]))
            else:
                assert 0, "演示03-某研发中心项目->%s->%s获取失败!" % (ReportName[name[6]], ReportName[name[4]])
            a = a + 1


    def DemoChs04(self):
        urls, urls2 = [], []
        ID = "report-unit-1-1"
        ReportName = {
            'default': '运营报表',
            'getReportList': '报告列表',
            'getReport': '报告'
        }
        self.SplitDate()
        #报表list判断
        Rname = ['default']
        Rdate = [self.year + '-' + self.month2]
        headers = {'content-type': 'application/json', 'token':'eyJhbGciOiJIUzI1NiIsImV4cCI6MT'}
        urls.append('http://' + serverip + '/report/getReportList/DemoChs04/%s/%s' % (Rname[0], Rdate[0]))
        urls2.append('http://' + serverip + '/report/getReport/DemoChs04/%s/%s' % (Rname[0], Rdate[0]))
        for url in urls:
            name = str(url).split("/")
            result = BeopTools.getJson(self, url)
            r = requests.get(url,headers=headers)
            RealStatus = r.status_code
            if result == None:
                assert 0, '演示04-某办公楼项目->%s->%s为空！' % (ReportName[name[6]], ReportName[name[4]])
            #self.assertIsNotNone(result,'深圳华为项目->%s->%s为空！'% (ReportName[name[6]],ReportName[name[4]]))
            if self.ExpectedStatus != RealStatus:
                assert 0, '演示04-某办公楼项目->%s->%s获取失败！' % (ReportName[name[6]], ReportName[name[4]])
            #self.assertEqual(self.ExpectedStatus,RealStatus,'深圳华为项目->%s->%s获取失败！'% (ReportName[name[6]],ReportName[name[4]]))
            print("演示04-某办公楼项目->%s->%s获取成功!" % (ReportName[name[6]], ReportName[name[4]]))
        a = 0
        for url in urls2:
            name = str(url).split("/")
            r = requests.get(url,headers=headers)
            RealStatus = r.status_code
            if self.ExpectedStatus != RealStatus:
                assert 0, '演示04-某办公楼项目->%s->%s获取失败！' % (ReportName[name[6]], ReportName[name[4]])
            #self.assertEqual(self.ExpectedStatus,RealStatus,'深圳华为项目->%s->%s获取失败！'% (ReportName[name[6]],ReportName[name[4]]))
            m = re.search(ID, r.text)
            if m:
                print("演示04-某办公楼项目->%s->%s获取成功!" % (ReportName[name[6]], ReportName[name[4]]))
            else:
                assert 0, "演示04-某办公楼项目->%s->%s获取失败!" % (ReportName[name[6]], ReportName[name[4]])
            a = a + 1

    def DemoChs06(self):
        urls, urls2 = [], []
        ID = "report-unit-1-1"
        ReportName = {
            'KPIReport': 'KPI日报',
            'CostReport': '能耗及费用报表',
            'MonthPatternReport': '能效分析月报',
            'DailyReport': '日常抄表',
            'RunReport': '运行报表',
            'DiagnosisReport': '诊断报表',
            'getReportList': '报告列表',
            'getReport': '报告'
        }
        self.SplitDate()
        #报表list判断
        Rname = ['KPIReport', 'CostReport', 'MonthPatternReport', 'DailyReport', 'RunReport', 'DiagnosisReport']
        Rdate = [self.Date, self.Date, self.year2 + '-' + self.month2, self.Date, self.Date,
                 self.year2 + '-' + self.month2]
        headers = {'content-type': 'application/json', 'token':'eyJhbGciOiJIUzI1NiIsImV4cCI6MT'}
        for i in range(6):
            urls.append('http://' + serverip + '/report/getReportList/DemoCh06/%s/%s' % (Rname[i], Rdate[i]))
            urls2.append('http://' + serverip + '/report/getReport/DemoCh06/%s/%s' % (Rname[i], Rdate[i]))
        for url in urls:
            name = str(url).split("/")
            result = BeopTools.getJson(self, url)
            r = requests.get(url,headers=headers)
            RealStatus = r.status_code
            if result == None:
                assert 0, '演示06-某研发中心项目->%s->%s为空！' % (ReportName[name[6]], ReportName[name[4]])
            #self.assertIsNotNone(result,'深圳华为项目->%s->%s为空！'% (ReportName[name[6]],ReportName[name[4]]))
            if self.ExpectedStatus != RealStatus:
                assert 0, '演示06-某研发中心项目->%s->%s获取失败！' % (ReportName[name[6]], ReportName[name[4]])
            #self.assertEqual(self.ExpectedStatus,RealStatus,'深圳华为项目->%s->%s获取失败！'% (ReportName[name[6]],ReportName[name[4]]))
            print("演示06-某研发中心项目->%s->%s获取成功!" % (ReportName[name[6]], ReportName[name[4]]))
        a = 0
        for url in urls2:
            name = str(url).split("/")
            r = requests.get(url,headers=headers)
            RealStatus = r.status_code
            if self.ExpectedStatus != RealStatus:
                assert 0, '演示06-某研发中心项目->%s->%s获取失败！' % (ReportName[name[6]], ReportName[name[4]])
            #self.assertEqual(self.ExpectedStatus,RealStatus,'深圳华为项目->%s->%s获取失败！'% (ReportName[name[6]],ReportName[name[4]]))
            m = re.search(ID, r.text)
            if m:
                print("演示06-某研发中心项目->%s->%s获取成功!" % (ReportName[name[6]], ReportName[name[4]]))
            else:
                assert 0, "演示06-某研发中心项目->%s->%s获取失败!" % (ReportName[name[6]], ReportName[name[4]])
            a = a + 1


    #def DemoEn03(self):


    def DemoEn06(self):
        urls, urls2 = [], []
        ID = "report-unit-1-1"
        ReportName = {
            'KPIReport': 'KPIReport',
            'RunReport': 'Operation Report',
            'getReportList': '报告列表',
            'getReport': '报告'
        }
        self.SplitDate()
        #报表list判断
        Rname = ['KPIReport', 'RunReport']
        Rdate = [self.Date, self.Date]
        headers = {'content-type': 'application/json', 'token':'eyJhbGciOiJIUzI1NiIsImV4cCI6MT'}
        for i in range(2):
            urls.append('http://' + serverip + '/report/getReportList/HuaweiSH/%s/%s' % (Rname[i], Rdate[i]))
            urls2.append('http://' + serverip + '/report/getReport/HuaweiSH/%s/%s' % (Rname[i], Rdate[i]))
        for url in urls:
            name = str(url).split("/")
            result = BeopTools.getJson(self, url)
            r = requests.get(url,headers=headers)
            RealStatus = r.status_code
            if result == None:
                assert 0, '英语版演示项目06->%s->%s为空！' % (ReportName[name[6]], ReportName[name[4]])
            #self.assertIsNotNone(result,'深圳华为项目->%s->%s为空！'% (ReportName[name[6]],ReportName[name[4]]))
            if self.ExpectedStatus != RealStatus:
                assert 0, '英语版演示项目06->%s->%s获取失败！' % (ReportName[name[6]], ReportName[name[4]])
            #self.assertEqual(self.ExpectedStatus,RealStatus,'深圳华为项目->%s->%s获取失败！'% (ReportName[name[6]],ReportName[name[4]]))
            print("英语版演示项目06->%s->%s获取成功!" % (ReportName[name[6]], ReportName[name[4]]))
        a = 0
        for url in urls2:
            name = str(url).split("/")
            r = requests.get(url,headers=headers)
            RealStatus = r.status_code
            if self.ExpectedStatus != RealStatus:
                assert 0, '英语版演示项目06->%s->%s获取失败！' % (ReportName[name[6]], ReportName[name[4]])
            #self.assertEqual(self.ExpectedStatus,RealStatus,'深圳华为项目->%s->%s获取失败！'% (ReportName[name[6]],ReportName[name[4]]))
            m = re.search(ID, r.text)
            if m:
                print("英语版演示项目06->%s->%s获取成功!" % (ReportName[name[6]], ReportName[name[4]]))
            else:
                assert 0, "英语版演示项目06->%s->%s获取失败!" % (ReportName[name[6]], ReportName[name[4]])
            a = a + 1


    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Smoke006('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)