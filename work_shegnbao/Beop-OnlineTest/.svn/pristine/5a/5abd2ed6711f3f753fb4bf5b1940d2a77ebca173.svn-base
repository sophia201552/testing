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
errors = []
flag = {0:"现场点",1:"虚拟点",2:"计算点"}

params = [
            ('203','天津武清','HWP206_PumpOnOff_01','CHWP002_PumpVSDFreq',2),('179','嘉民',"CHW_ChWFlow",'22FL_ChWFlow',2),
            ('71','演示06','testfordata','A13AHU_A_13_VlvColdReg',2),
            ('175','演示09','testfordata','A12FCU_A_21_Temp',2),
            ('186','华滋奔腾','CWP001_EnergySavingP','CWP001_PumpPower',2),
            ('121','智能传感','jrgc0403_SmartSensor025_SensorT','jrgc0403_SmartSensor025_SensorT',0),
            ('194','上海印钞厂','ChGroupTotal001_GroupEnergyW','ChGroupPowerTotal',2),
         ]
#('100','扬州高露洁','CloudCalculation1','CBDFL02DiningRoom_AHU001_RAT',2),('76','英文演示06','testfordata','A11AHU_A_11_TempSaOut',2),

class Calc016(unittest.TestCase):
    testCaseID = 'Calc016'
    projectName = "付费项目"
    buzName = '现场点是否随时间更新'
    start = 0.0
    now = 0
    startTime = ""
    url = "http://%s/admin/dataPointManager/search/" % app.config['SERVERIP']
    errors = []

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.errors = []
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))


    def Test(self):
        #嘉民
        for item in params:
            result = self.getTimeData(projectId=item[0], projectName=item[1], text=item[3])
            if result:
                self.getData(item[0], item[1], item[2], item[4])


        #抛出整个case中遇到的错误

        self.raiseError(self.errors)






    def getTimeData(self,projectId,projectName,text):

        a = BeopTools()
        r = None
        data = {
            "projectId":projectId,"current_page":1,"page_size":"50","text":text,"isAdvance":False,"order":None,"isRemark":False,"flag":None
        }
        try:
            r = a.postJsonToken(url=self.url, data=data, t=15)
        except Exception as e:
            BeopTools.writeLogError(self.logger, e.__str__())
            self.errors.append("错误信息%s接口失败,%d秒内没有响应!" % (self.url, 10))
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
                    if datetime.datetime.now() >update:
                        seconds = (datetime.datetime.now() - update).seconds
                    else:
                        seconds = (update-datetime.datetime.now()).seconds
                    if seconds > 1800:
                        print(seconds)
                        self.errors.append("错误信息实时数据中%s超过30分钟未更新.    详细信息: 项目名: %s 项目id: %s mysqlName: %s 点名: %s 更新时间: %s 点类型: %s" % (flag[pointType], projectName, projectId, mysqlName, pointName, updateTime, flag[pointType]))
                        return False
                    else:
                        print("实时数据中%s30分钟内更新正常.    详细信息: 项目名: %s 项目id: %s mysqlName: %s 点名: %s 更新时间: %s 点类型: %s" % (flag[pointType], projectName, projectId, mysqlName, pointName, updateTime, flag[pointType]))
                        return True
                else:
                    self.errors.append("错误信息实时数据搜索结果中数据不正常.    详细信息: 项目名: %s 项目id: %s mysqlName: %s 点名: %s" % (projectName, projectId, mysqlName, pointName))
                    return False
        else:
            self.errors.append("错误信息%s接口, 参数: %s 返回结果不正确,为%s!" % (self.url, json.dumps(data), json.dumps(r)))
            return False

    def get_history_data(self, projId, projName, pointName, timeStart, timeEnd):
        rt = None
        a = BeopTools()
        data = {
                "projectId":str(projId),
                "pointList":["%s" % pointName],
                "timeStart":timeStart,
                "timeEnd":timeEnd,
                "timeFormat":"m1"
                }
        url = "http://%s/get_history_data_padded_reduce"%app.config['SERVERIP']
        try:
            rt = a.postJsonToken(url, data, 10)
        except Exception as e:
            BeopTools.writeLogError(self.logger, e.__str__())
            self.errors.append("错误信息访问%s接口失败,请检查!" % (url, ))
        if rt and isinstance(rt, dict):
            value = rt.get('data')
            if value:
                value = value.get(pointName,[])
                if len(value):
                    #value = value[-1]
                    return value
            else:
                self.errors.append("错误信息%s点在%s~%s没有获取到历史数据!" % (pointName, timeStart, timeEnd))

            #print(rt)

        else:
            self.errors.append("错误信息访问接口:%s 参数:%s 返回结果不正确!为%s" % (url, json.dumps(data), json.dumps(rt)))
        #print(value)
        return []




    #获取计算点实时数据
    def getData(self,projId,projName,pointName,pointType):
        a = BeopTools()
        rv = None
        t = ''
        t_start = ''
        time_org = ''
        #url = "http://beop.rnbtech.com.hk/point_tool/getCloudPointTable/%s/1/50/%s/%s" % (projId, pointName, pointType)
        url = "http://%s/point_tool/getCloudPointTable/" % app.config['SERVERIP']
        json_data = {"projectId":projId,"currentPage":1,"pageSize":50,"pointType":pointType,"searchOrder":[["_id",-1]],"searchText":pointName}


        try:
            rv = a.postJsonToken(url=url, data=json_data, t=10)
            pointTable = rv.get('data')
            pointTable = pointTable.get('pointTable')
            point = [x for x in pointTable if x.get('value') == pointName][0]
            rv = point.get("pointValue")
            time_org = point.get('pointTime')
            t = time_org +':00'
            now_time = datetime.datetime.strftime(datetime.datetime.now(),"%Y-%m-%d %H:%M:%S")
            now_time = now_time[:-3]
            t2 = datetime.datetime.strptime(t, "%Y-%m-%d %H:%M:%S")
            seconds = (datetime.datetime.now() - t2).seconds
            #获取五分钟时间点
            if 5 < int(now_time[-1:]) <= 9:
                now_time = now_time[:-1] + "5"
            elif 0 < int(now_time[-1:]) < 5:
                now_time = now_time[:-1] + "0"
            else:
                pass
            t = now_time + ":00"
            t_start = datetime.datetime.strptime(t, "%Y-%m-%d %H:%M:%S") - datetime.timedelta(seconds=600)
            t_start = datetime.datetime.strftime(t_start, "%Y-%m-%d %H:%M:%S")
            t_now = point.get('pointTime') + ":00"
            print("计算点实时数据在更新: %s项目 %s点 最近更新时间为%s" % (projName, pointName, t_now))
            rv_his = self.get_history_data(projId, projName, pointName, t_start, t)
            if rv_his != []:
                print("项目id %s 项目名 %s %s点 %s~%s历史数据为" % (projId, projName, pointName, t_start, t) + json.dumps(rv_his))
            if seconds > 1200:
                self.errors.append("错误信息%s项目 %s点 已超过10分钟未更新!最近更新时间为%s" % (projName, pointName, t_now))
            if seconds > 1200 and rv_his != []:
                self.errors.append("错误信息%s项目 %s点 已超过10分钟未更新!最近更新时间为%s!但其%s~%s点历史数据在更新!" % (projName, pointName, t_now, t_start, t,  ))
            if seconds < 1200 and rv_his == []:
                self.errors.append("错误信息%s项目 %s点 10分钟内在更新!最近更新时间为%s!但其%s~%s点历史数据未更新!" % (projName, pointName, t_now, t_start, t,  ))


            #print("%s点在%s时的值为%s" % (pointName, t, rv_his))




        except Exception as e:
            BeopTools.writeLogError(self.logger, e.__str__())
            self.errors.append("错误信息接口: %s 项目id: %s 项目名: %s 搜索'%s'计算点未得到返回结果。error: %s " % (url, projId, projName, pointName, e.__str__()))
        return (rv, time_org)



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
    suite.addTest(Calc016('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
    #unittest.main()
