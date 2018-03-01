__author__ = 'woody'
import requests
from interfaceTest.Methods.BeopTools import *
import json
from interfaceTest import app
import time
import datetime
import re
import unittest
import pymysql




class Calc024(unittest.TestCase):
    testCaseID = 'Calc024'
    projectName = "liverpool项目"
    buzName = '现场数据是否随时间更新'
    start = 0.0
    now = 0
    startTime = ""
    errors = []
    offline = False
    projId = 293
    points = ('L1S1_AHU1_returnAirTemp',
            'L1S1_AHU1_supplyAirTemp',
            'L1S2_AHU2_returnAirTemp',
            'L1S2_AHU2_supplyAirTemp',
            'L1S2_AHU2_staticPressure',
            'L2S1_AHU1_returnAirTemp',
            'L2S1_AHU1_supplyAirTemp',
            'L2S1_AHU1_staticPressure',
            'L2S2_AHU2_returnAirTemp',
            'L2S2_AHU2_supplyAirTemp',
            'L2S2_AHU2_staticPressure',
            'L29_CHWP3_DP',
            'L29_HWP1_DP',
            'L3S1_AHU1_returnAirTemp',
            'L3S1_AHU1_supplyAirTemp',
            'L3S1_AHU1_staticPressure',
            'L29_CHWP4_DP',
            'L3S2_AHU2_returnAirTemp',
            'L3S2_AHU2_supplyAirTemp',
            'L3S2_AHU2_staticPressure',
            'L4S1_AHU1_returnAirTemp',
            'L4S1_AHU1_supplyAirTemp',
            'L4S1_AHU1_staticPressure',
            'L4S2_AHU2_returnAirTemp',
            'L4S2_AHU2_supplyAirTemp',
            'L4S2_AHU2_staticPressure',
            'L5S1_AHU1_returnAirTemp',
            'L5S1_AHU1_supplyAirTemp',
            'L5S1_AHU1_staticPressure',
            'L5S2_AHU2_returnAirTemp',
            'L5S2_AHU2_supplyAirTemp',
            'L5S2_AHU2_staticPressure',
            'L6S1_AHU1_returnAirTemp',
            'L6S1_AHU1_supplyAirTemp',
            'L6S1_AHU1_staticPressure',
            'L6S2_AHU2_returnAirTemp',
            'L6S2_AHU2_supplyAirTemp',
            'L6S2_AHU2_staticPressure',
            'L7S1_AHU1_returnAirTemp',
            'L7S1_AHU1_supplyAirTemp',
            'L7S1_AHU1_staticPressure',
            'L7S2_AHU2_returnAirTemp',
            'L7S2_AHU2_supplyAirTemp',
            'L7S2_AHU2_staticPressure',
            'L8S1_AHU1_returnAirTemp',
            'L8S1_AHU1_supplyAirTemp',
            'L8S1_AHU1_staticPressure',
            'L8S2_AHU2_returnAirTemp',
            'L8S2_AHU2_supplyAirTemp',
            'L8S2_AHU2_staticPressure',
            'L9S1_AHU1_returnAirTemp',
            'L9S1_AHU1_supplyAirTemp',
            'L9S1_AHU1_staticPressure',
            'L9S2_AHU2_returnAirTemp',
            'L9S2_AHU2_supplyAirTemp',
            'L9S2_AHU2_staticPressure',
            'L10S1_AHU1_returnAirTemp',
            'L10S1_AHU1_supplyAirTemp',
            'L10S1_AHU1_staticPressure',
            'L10S2_AHU2_returnAirTemp',
            'L10S2_AHU2_supplyAirTemp',
            'L10S2_AHU2_staticPressure',
            'L11S1_AHU1_returnAirTemp',
            'L11S1_AHU1_supplyAirTemp',
            'L11S1_AHU1_staticPressure',
            'L11S2_AHU2_returnAirTemp',
            'L11S2_AHU2_supplyAirTemp',
            'L11S2_AHU2_staticPressure',
            'L12S1_AHU1_returnAirTemp',
            'L12S1_AHU1_supplyAirTemp',
            'L12S1_AHU1_staticPressure',
            'L13S1_AHU1_returnAirTemp',
            'L13S1_AHU1_supplyAirTemp',
            'L13S1_AHU1_staticPressure',
            'L13S2_AHU2_returnAirTemp',
            'L13S2_AHU2_supplyAirTemp',
            'L13S2_AHU2_staticPressure',
            'L14S1_AHU1_returnAirTemp',
            'L14S1_AHU1_supplyAirTemp',
            'L14S1_AHU1_staticPressure',
            'L14S2_AHU2_returnAirTemp',
            'L14S2_AHU2_supplyAirTemp',
            'L14S2_AHU2_staticPressure',
            'L15S1_AHU1A_returnAirTemp',
            'L15S1_AHU1A_supplyAirTemp',
            'L15S1_AHU1A_staticPressure',
            'L15S2_AHU2A_returnAirTemp',
            'L15S2_AHU2A_supplyAirTemp',
            'L15S2_AHU2A_staticPressure',
            'L15S1_AHU1B_returnAirTemp',
            'L15S1_AHU1B_supplyAirTemp',
            'L15S1_AHU1B_staticPressure',
            'L15S2_AHU2B_returnAirTemp',
            'L15S2_AHU2B_supplyAirTemp',
            'L15S2_AHU2B_staticPressure',
            'L16S1_AHU1A_returnAirTemp',
            'L16S1_AHU1A_supplyAirTemp',
            'L16S1_AHU1A_staticPressure',
            'L16S2_AHU2A_returnAirTemp',
            'L16S2_AHU2A_supplyAirTemp',
            'L16S2_AHU2A_staticPressure',
            'L16S1_AHU1B_returnAirTemp',
            'L16S1_AHU1B_supplyAirTemp',
            'L16S1_AHU1B_staticPressure',
            'L16S2_AHU2B_returnAirTemp',
            'L16S2_AHU2B_supplyAirTemp',
            'L16S2_AHU2B_staticPressure')


    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.errors = []
        self.offline = 0
        MESSAGE_URL = app.config['MESSAGE_URL']
        MESSAGE_INFO = str(
            {'type': 'message', 'message': '尊敬的用户您好，因检测到利物浦现场可能掉线，故作通知，感谢使用BeOP智慧服务。【BeOP智慧服务】',
             'phone': app.config['LIVERPOOL_RECEIVER'], 'freq': 3600})
        MESSAGE_DATA = {'name': 'message', 'value': MESSAGE_INFO}
        self.checkTime()
        if self.errors:
            BeopTools.writeLogError(self.logger, '\n'.join(self.errors))
            if self.offline > 30:
                self.sendMessage(MESSAGE_URL, MESSAGE_DATA, 10)
        else:
            BeopTools.writeLogError(self.logger, '错误个数为0!')
            print('不发短信')


    def checkTime(self):
        pointType = 0
        for point in self.points:
            rv = self.getTimeData(self.projId, self.projectName, point)







    def getTimeData(self,projectId,projectName,text):
        addr = "http://%s/admin/dataPointManager/search/" % app.config['SERVERIP']
        a = BeopTools()
        r = None
        updateTime = None
        data = {
            "projectId":projectId,"current_page":1,"page_size":"50","text":text,"isAdvance":False,"order":None,"isRemark":False,"flag":None
        }
        try:
            r = a.postJsonToken(url=addr, data=data, t=10)
        except Exception as e:
            print(e.__str__())
            self.errors.append("错误信息%s接口失败,%d秒内没有响应!" % (addr, 10))
        #实时数据搜索点
        if isinstance(r,dict) and r.get("list",False):
            print("成功获取到搜索结果!")
            rv = r['list']
            rv = [x for x in rv if x.get("pointname") == text]
            for point in rv:
                pointName = point.get("pointname",None)
                updateTime = point.get("time",None)
                pointType = point.get("flag",None)
                value = point.get("value",None)
                mysqlName = "rtdata_" + str(projectId)
                if pointName and updateTime and pointType>=0 and value != "null":
                    updateTime += ":00"
                    update = datetime.datetime.strptime(updateTime,"%Y-%m-%d %H:%M:%S")
                    update = update - datetime.timedelta(hours=3)
                    updateTime = datetime.datetime.strftime(update,"%Y-%m-%d %H:%M:%S")
                    seconds = (datetime.datetime.now() - update).seconds
                    if seconds > 1800:
                        self.offline += 1
                        self.errors.append("实时数据中现场点30分钟内未更新,详细信息: 项目名: %s 项目id: %s mysqlName: %s 点名: %s 更新时间: %s 点类型: 现场点" % ( projectName, projectId, mysqlName, pointName, updateTime))
                    else:
                        print("实时数据中现场点30分钟内更新正常,详细信息: 项目名: %s 项目id: %s mysqlName: %s 点名: %s 更新时间: %s 点类型: 现场点" % ( projectName, projectId, mysqlName, pointName, updateTime))
                else:
                    self.errors.append("错误信息实时数据搜索结果中数据不正常, 详细信息: 项目名: %s 项目id: %s mysqlName: %s 点名: %s" % (projectName, projectId, mysqlName, pointName))
        else:
            self.errors.append("错误信息[%s]%s---接口:%s 参数:%s 返回结果不正确,为%s!" % (BeopTools.getTime(), self.testCaseID, addr, json.dumps(data), json.dumps(r)))

    def sendMessage(self, url, data, t):
        a = BeopTools()
        a.writeLogError(self.logger, "发送短信!")
        rv = {}
        try:
            rv = a.postJsonToken(url=url, data=data, t=t)
            a.writeLogError(self.logger, "发送短信详情为%s" % (json.dumps(data, ensure_ascii=False)))
        except Exception as e:
            a.writeLogError(self.logger, e.__str__())
        if rv.get('error') == 'ok':
            a.writeLogError(self.logger, '短信提醒成功!')
        else:
            self.errors.append("错误信息[%s]%s---项目名:%s 发送短信失败!" % (a.getTime(), self.testCaseID, self.projectName))



    def tearDown(self):
        self.offline = False
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())





if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Calc024('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

