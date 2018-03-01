__author__ = 'woody'
import requests
from interfaceTest.Methods.BeopTools import *
from interfaceTest import app
import json
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
        ("71","test","英文演示06"),("76","test","演示06"),("72","com","上海华为"),("175","test","英文演示09"),
        ("73","cloud","顺风光电")
#("200","pump","天津团泊"),("201","OutdoorRH","天津光合谷"),,("203","HW","天津武清"),("100","cloud","扬州高露洁"),


        ]

params = [
            ('203','天津武清','HWP206_PumpOnOff_01','CHWP002_PumpVSDFreq'),('179','嘉民',"CHW_ChWFlow",'22FL_ChWFlow'),
            ('71','演示06','testfordata','A13AHU_A_13_VlvColdReg'),('76','英文演示06','testfordata','A11AHU_A_11_TempSaOut'),
            ('175','演示09','testfordata','A12FCU_A_21_Temp'),
            ('73','顺风光电','CloudCalculation1','CHourCh01'),('186','华滋奔腾','Plant001_LoadD','CWP001_PumpPower'),
            ('28','中区广场','CWP001_GroupElecUseW','ChGroupPower')
         ]
        #('100','扬州高露洁','CloudCalculation1','CBDFL02DiningRoom_AHU001_RAT'),('194','上海印钞厂','Ch001_ChCost','ChCondTempA03'),


class Calc011(unittest.TestCase):
    testCaseID = 'Calc011'
    projectName = "付费项目"
    buzName = '现场点是否随实时数据更新'
    start = 0.0
    now = 0
    startTime = ""
    #projectId = 179
    #url = "http://beop.rnbtech.com.hk/admin/dataPointManager/search/"
    errors = []
    offline = []


    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.errors = []
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):

        #a = BeopTools()
        self.checkTime()
        self.raiseError(self.errors)




    def getData(self,projId,pointName,pointType):
        a = BeopTools()
        rv = None
        url = "http://%s/point_tool/getCloudPointTable/" % app.config['SERVERIP']
        json_data = {"projectId":projId,"currentPage":1,"pageSize":50,"pointType":pointType,"searchOrder":[["_id",-1]],"searchText":pointName}
        try:
            rv = a.postJsonToken(url=url, data=json_data, t=20)
        except Exception as e:
            BeopTools.writeLogError(self.logger, e.__str__())
            print(e.__str__())
            self.errors.append("错误信息接口: %s 项目id: %s搜索'%s'点未得到返回结果。error: %s" % (url, projId, pointName, e.__str__()))
        return rv

    def checkTime(self):
        pointType = 0
        for item in params:
            projId = item[0]
            projName = item[1]
            pointName = item[3]
            realPoint = item[3]
            rv = self.getData(projId, pointName, pointType)
            if rv is not None and isinstance(rv,dict):
                try:
                    pointTable = rv['data'].get("pointTable")
                    for p in pointTable:
                        updateTime = p.get("pointTime")
                        point = p.get("value")
                        pointTime = self.getTimeData(projId, projName, realPoint)
                        mysqlName = "rtdata_" + str(projId)
                        if updateTime and updateTime!=None:
                            updateTime += ":00"
                            update = datetime.datetime.strptime(updateTime,"%Y-%m-%d %H:%M:%S")
                            seconds = abs(datetime.datetime.strptime(pointTime,"%Y-%m-%d %H:%M:%S") - update).seconds
                            offlineTime = abs(datetime.datetime.now() - datetime.datetime.strptime(pointTime,"%Y-%m-%d %H:%M:%S")).seconds
                            if offlineTime < 1800:
                                print('项目没掉线')
                                if seconds > 600:
                                    self.errors.append("错误信息请注意!!!发现 现场点已有10分钟未同步!!!.       详细信息: 项目名: %s 项目id: %s Mysql collecion: %s 点名: %s 实时数据更新时间: %s 现场点更新时间: %s 点类型: %s" % (projName, projId, mysqlName, point, pointTime, updateTime, flag[pointType]))
                                else:
                                    print("项目id: %s %s现场点同步正常,实时数据更新时间为%s 现场点更新时间为%s" % (projId, point, pointTime, updateTime))
                            else:
                                self.errors.append(
                                    "错误信息项目实时数据一直没有更新，可能是掉线或者诊断引擎出现故障!!!!请检查!!!!       详细信息: 项目名: %s 项目id: %s Mysql collecion: %s 点名: %s 实时数据更新时间: %s 现场点更新时间: %s 点类型: %s" % (
                                    projName, projId, mysqlName, point, pointTime, updateTime, flag[pointType]))
                        else:
                            self.errors.append("错误信息返回搜索结果中有现场点无更新时间.    详细信息: 项目名: %s 项目id: %s Mysql collecion: %s 点名: %s 实时数据更新时间: %s 现场点更新时间: %s 点类型: %s" % (projName, projId, mysqlName, pointName, str(pointTime), str(updateTime), flag[pointType]))


                except Exception as e:
                    BeopTools.writeLogError(self.logger, e.__str__())
                    #print(e.__str__())
                    self.errors.append("错误信息项目id: %s搜索'%s'计算点获取时间失败。" % (projId, pointName))





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
            BeopTools.writeLogError(self.logger, e.__str__())
            self.errors.append("错误信息%s接口失败,%d秒内没有响应!" % (addr, 10))
        #实时数据搜索点
        if isinstance(r,dict) and r.get("list",False):
            print("成功获取到搜索结果!")
            rv = r['list']
            rv = [x for x in rv if x.get("pointname") == text]
            for point in rv:
                pointName = point.get("pointname")
                updateTime = point.get("time")
                if updateTime:
                    updateTime += ":00"
                pointType = point.get("flag")
                value = point.get("value")
                mysqlName = "rtdata_" + str(projectId)
                if value == "null":
                    self.errors.append("错误信息实时数据搜索结果项目名: %s 项目id: %s 项目关联实时表名: %s 点名: %s 点值为null,请检查!" % (projectName, projectId, mysqlName, pointName))
                else:
                    pass


        return updateTime




    #抛出异常函数
    def raiseError(self,error):
        if error != []:
            #print("\n".join(error))
            assert 0,"\n".join(error)
        else:
            pass

    def tearDown(self):
        self.errors = []
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        ##info.append([self.testCaseID, use, now])




if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Calc011('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)




