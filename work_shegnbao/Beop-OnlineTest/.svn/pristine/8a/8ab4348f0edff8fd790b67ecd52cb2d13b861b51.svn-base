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
#from flask.globals import request



#项目ID,点名,项目名,dtu名称,引擎名称,是否判断掉线时间,持续时间
#errors = []
flag = {0:"现场点",1:"虚拟点",2:"计算点"}
#url = "http://beop.rnbtech.com.hk/point_tool/getCloudPointTable/179/1/50/ch/2"
#projectId,pointName
proj = [
        ("179","CHW_ChWFlow","嘉民"),
       ("72","com","上海华为"),
        ("100","cloud","扬州高露洁"),("73","cloud","顺风光电")
#("200","pump","天津团泊"),("201","OutdoorRH","天津光合谷"),,("203","HW","天津武清"),


        ]

params = [
            ('203','天津武清','HWP206_PumpOnOff_01','CHWP002_PumpVSDFreq'),('179','嘉民',"CHW_ChWFlow",'22FL_ChWFlow'),
            ('100','扬州高露洁','CloudCalculation1','CBDFL02DiningRoom_AHU001_RAT'),
            ('73','顺风光电','CloudCalculation1','CHourCh01'),#('186','华滋奔腾','CWP001_EnergySavingP','CWP001_PumpPower'),
            ('194','上海印钞厂','Ch001_ChCost','ChCondTempA03'),('28','中区广场','CWP001_GroupElecUseW','ChGroupPower'),
            ('293','利物浦项目','Plant001_GroupEnergyD','L29_Chiller2_System1EvaporatorPressure')
         ]




class Calc012(unittest.TestCase):
    testCaseID = 'Calc012'
    projectName = "付费项目"
    buzName = '计算点是否随时间更新'
    start = 0.0
    now = 0
    startTime = ""
    #projectId = 179
    #url = "http://beop.rnbtech.com.hk/admin/dataPointManager/search/"
    errors = []
    offline = []
    emails = app.config['CALC_TEST_EMAILS_D']
    suiteName = '点计算测试集'
    #a = BeopTools()

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.errors = []
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def nowTime(self):
        return time.strftime('%Y-%m-%d %H:%M:%S',time.localtime())

    def Test(self):
        self.checkTime()
        BeopTools.send_email(self.emails, self.suiteName, self.errors, self.testCaseID)
        BeopTools.raiseError(self.errors, self.testCaseID)
        BeopTools.writeLogError(self.logger, '\n'.join(self.errors))


    def getData(self,projId,pointName,pointType):
        a = BeopTools()
        rv = None
        url = "http://%s/point_tool/getCloudPointTable/" % app.config['SERVERIP']
        json_data = {"projectId":projId,"currentPage":1,"pageSize":50,"pointType":pointType,"searchOrder":[["_id",-1]],"searchText":pointName}

        try:
            rv = a.postJsonToken(url=url, data=json_data, t=10)
        except Exception as e:
            print(e.__str__())
            BeopTools.writeLogError(self.logger, e.__str__())
            self.errors.append("接口: %s 项目id: %s搜索'%s'计算点未得到返回结果。" % (url, projId, pointName))
        return rv

    def checkTime(self):


        pointType = 2
        for item in params:
            projId = item[0]
            projName = item[1]
            pointName = item[2]
            realPoint = item[3]
            mysqlName = "rtdata_" + str(projId)

            rv = self.getData(projId, pointName,pointType)
            if rv is not None and isinstance(rv,dict):
                try:
                    pointTable = rv['data'].get("pointTable")
                    for p in pointTable:
                        updateTime = p.get("pointTime")
                        point = p.get("value")
                        self.getTimeData(projId, projName, realPoint)
                        if updateTime:
                            update = datetime.datetime.strptime(updateTime,"%Y-%m-%d %H:%M")
                            seconds = (datetime.datetime.now() - update).seconds if datetime.datetime.now()>update else ( update-datetime.datetime.now()).seconds
                            if projId not in self.offline:
                                if seconds > 1200:
                                    self.errors.append("[%s]%s--查询到计算点20分钟内未更新.    详细信息: 项目名: %s 项目id: %s Mysql collecion: %s 点名: %s 更新时间: %s 点类型: %s\n" % (self.nowTime(), self.testCaseID, projName,projId, mysqlName, point, updateTime, flag[pointType]))
                                    BeopTools.writeLogError(self.logger, "[%s]%s--查询到计算点20分钟内未更新.    详细信息: 项目名: %s 项目id: %s Mysql collecion: %s 点名: %s 更新时间: %s 点类型: %s\n" % (self.nowTime(), self.testCaseID, projName,projId, mysqlName, point, updateTime, flag[pointType]))
                                else:
                                    print("项目id: %s %s计算点更新正常,更新时间为%s" % (projId, point, updateTime))
                            else:
                                print("%s项目掉线，跳过计算点检测!" % (projName,))
                        else:
                            self.errors.append("[%s]查询到计算点无更新时间.    详细信息: 项目名: %s 项目id: %s Mysql collecion: %s 点名: %s 更新时间: %s 点类型: %s" % (self.nowTime(), projName, projId, mysqlName, pointName, str(updateTime), flag[pointType]))


                except Exception as e:
                    BeopTools.writeLogError(self.logger, e.__str__())
                    self.errors.append("项目id: %s搜索'%s'计算点获取时间失败。" % (projId, pointName))






    def getTimeData(self,projectId,projectName,text):
        addr = "http://%s/admin/dataPointManager/search/" % app.config['SERVERIP']
        a = BeopTools()
        r = None
        updateTime = None
        data = {"projectId":projectId,"text":text,"isAdvance":False,"order":"asc","isRemark":False,"flag":0,"starred":"","item":"pointname","page_size":200,"current_page":1}
        try:
            r = a.postJsonToken(url=addr, data=data, t=10)
        except Exception as e:
            print(e.__str__())
            BeopTools.writeLogError(self.logger, e.__str__())
            self.errors.append("访问%s接口失败, %d秒内没有响应!" % (addr, 10))
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
                    update = datetime.datetime.strptime(updateTime,"%Y-%m-%d %H:%M:%S")
                    seconds = (datetime.datetime.now() - update).seconds
                    if seconds > 1800:
                        #self.errors.append("实时数据中%s超过30分钟未更新,详细信息: 项目名: %s 项目id: %s mysqlName: %s 点名: %s 更新时间: %s 点类型: %s" % (flag[pointType], projectName, projectId, mysqlName, pointName, updateTime, flag[pointType]))
                        self.offline.append(projectId)
                    else:
                        print("实时数据中%s30分钟内更新正常,详细信息: 项目名: %s 项目id: %s mysqlName: %s 点名: %s 更新时间: %s 点类型: %s" % (flag[pointType], projectName, projectId, mysqlName, pointName, updateTime, flag[pointType]))
                else:
                    self.errors.append("实时数据搜索结果中数据不正常, 详细信息: 项目名: %s 项目id: %s mysqlName: %s 点名: %s" % (projectName, projectId, mysqlName, pointName))
        else:
            self.errors.append("接口: %s 参数: %s 返回结果不正确,为%s!" % (addr, json.dumps(data), json.dumps(r)))







    def tearDown(self):
        self.errors = []
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())




if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Calc012('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
