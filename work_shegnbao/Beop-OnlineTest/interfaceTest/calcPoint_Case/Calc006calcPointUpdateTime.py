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
            ('203','天津武清','CHWP002_PumpVSDFreq','',0),
            ('203','天津武清','HWP206_PumpOnOff_01','CHWP002_PumpVSDFreq',2),
            ('179','嘉民',"CHW_ChWFlow",'22FL_ChWFlow',2),
            ('179','嘉民',"22FL_ChWFlow",'',0),
            ('71','演示06','testfordata','Water_Tank011',2),
            #('71','演示06','Water_Tank011','',0),
            # ('76','英文演示06','testfordata','A11AHU_A_11_TempSaOut',2),
            #('76','英文演示06','A11AHU_A_11_TempSaOut','',0),
            ('175','演示09','testfordata','A12FCU_A_21_Temp',2),
            #('175','演示09','A12FCU_A_21_Temp','',0),
            ('100','扬州高露洁','CloudCalculation1','CBDFL02DiningRoom_AHU001_RAT',2),
            ('100','扬州高露洁','CBDFL02DiningRoom_AHU001_RAT','',0),
            # ('186','华滋奔腾','CWP001_EnergySavingP','CWP001_PumpPower',2),
            # ('186','华滋奔腾','CHW001_ChWReturnP','',0),
            ('121','智能传感','jrgc0403_SmartSensor025_SensorT','',0),
            ('194','上海印钞厂','ChCondTempA03', '',0),
            ('28','中区广场','ChGroupPower','',0),
            ('293','利物浦项目','Plant001_GroupEnergyD','L29_Chiller2_System1EvaporatorPressure',2),
            ('293','利物浦项目','L29_Chiller2_System1EvaporatorPressure','',0)
         ]

class Calc006(unittest.TestCase):
    testCaseID = 'Calc006'
    projectName = "付费项目"
    buzName = '历史数据以及实时数据是否有更新'
    start = 0.0
    now = 0
    startTime = ""
    url = "http://%s/admin/dataPointManager/search/" % app.config['SERVERIP']
    errors = []

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.errors = []

    def nowTime(self):
        return time.strftime('%Y-%m-%d %H:%M:%S',time.localtime())

    def Test(self):
        #嘉民
        for item in params:
            #self.getTimeData(projectId=item[0], projectName=item[1], text=item[3])
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
            r = a.postJsonToken(url=self.url, data=data, t=20)
        except Exception as e:
            print(e.__str__())
            self.errors.append("[%s]%s---错误信息请求%s接口失败,%s秒内没有响应!" % (BeopTools.getTime(), self.testCaseID, self.url, str(10)))
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
                    seconds = (datetime.datetime.now() - update).seconds
                    if seconds > 1800:
                        self.errors.append("错误信息[%s]%s---实时数据中%s超过30分钟未更新.    详细信息: 项目名: %s 项目id: %s mysqlName: %s 点名: %s 更新时间: %s 点类型: %s" % (self.nowTime(), self.testCaseID, flag[pointType], projectName, projectId, mysqlName, pointName, updateTime, flag[pointType]))
                    else:
                        print("错误信息实时数据中%s30分钟内更新正常.    详细信息: 项目名: %s 项目id: %s mysqlName: %s 点名: %s 更新时间: %s 点类型: %s" % (flag[pointType], projectName, projectId, mysqlName, pointName, updateTime, flag[pointType]))
                else:
                    self.errors.append("错误信息[%s]%s---实时数据搜索结果中数据不正常.    详细信息: 项目名: %s 项目id: %s mysqlName: %s 点名: %s" % (BeopTools.getTime(), self.testCaseID, projectName, projectId, mysqlName, pointName))
        else:
            self.errors.append("错误信息[%s]%s---接口:%s 参数:%s返回结果不正确,为%s!" % (BeopTools.getTime(), self.testCaseID, self.url, json.dumps(data), json.dumps(r)))

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
            rt = a.postJsonToken(url, data, 20)
        except Exception as e:
            print(e.__str__())
            self.errors.append("错误信息[%s]%s---访问%s接口失败,请检查!" % (BeopTools.getTime(), self.testCaseID, url, ))
        if rt and isinstance(rt, dict):
            value = rt.get('data')
            if value:
                value = value.get(pointName,[])
                if len(value):
                    #value = value[-1]
                    return value
            else:
                #self.errors.append("错误信息%s项目 %s点在%s~%s没有获取到历史数据!" % (projName, pointName, timeStart, timeEnd))
                print("错误信息[%s]%s---%s项目 %s点在%s~%s没有获取到历史数据!" % (self.nowTime(), self.testCaseID, projName, pointName, timeStart, timeEnd))
            #print(rt)

        else:
            self.errors.append("错误信息[%s]%s---接口:%s 参数:%s 返回结果不正确!为%s" % (BeopTools.nowTime(), self.testCaseID, self.url, json.dumps(data), json.dumps(rt)))
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
        url = "http://%s/point_tool/getCloudPointTable/"%app.config['SERVERIP']
        json_data = {"projectId":projId,"currentPage":1,"pageSize":50,"pointType":pointType,"searchOrder":[["_id",-1]],"searchText":pointName,"t_time":""}


        try:
            rv = a.postJsonToken(url=url, data=json_data, t=20)
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
            t_start = datetime.datetime.strptime(t, "%Y-%m-%d %H:%M:%S") - datetime.timedelta(seconds=900)
            t_start = datetime.datetime.strftime(t_start, "%Y-%m-%d %H:%M:%S")
            t_now = point.get('pointTime') + ":00"
            print("实时数据在更新: %s项目 %s点 最近更新时间为%s" % (projName, pointName, t_now))
            rv_his = self.get_history_data(projId, projName, pointName, t_start, t)
            if projId=='293':
                seconds = (t2-datetime.datetime.now()).seconds
                seconds=seconds-60*60*3
            if rv_his != []:
                print("项目id %s 项目名 %s %s点 %s~%s历史数据为" % (projId, projName, pointName, t_start, t) + json.dumps(rv_his))
            if seconds > 600 and rv_his == []:
                #self.errors.append("错误信息%s项目 %s点 已超过10分钟未更新!最近更新时间为%s!但其%s~%s点历史数据在更新!" % (projName, pointName, t_now, t_start, t,  ))
                print("项目掉线!")
            else:
                if seconds <= 600 and rv_his == []:
                    self.errors.append("错误信息[%s]%s---%s项目 %s点 实时数据10分钟内在更新!最近更新时间为%s!但其%s~%s历史数据没有更新,请检查!" % (self.nowTime(), self.testCaseID, projName, pointName, t_now, t_start, t,  ))
                if seconds > 900 and rv_his != []:
                    self.errors.append("错误信息[%s]%s---%s项目 %s点 已超过15分钟未更新!最近更新时间为%s!但其%s~%s历史数据在更新!" % (self.nowTime(), self.testCaseID, projName, pointName, t_now, t_start, t,  ))
                else:
                    if seconds > 900:
                        self.errors.append("错误信息[%s]%s---%s项目 %s点 已超过15分钟未更新!最近更新时间为%s" % (self.nowTime(), self.testCaseID, projName, pointName, t_now))

            #print("%s点在%s时的值为%s" % (pointName, t, rv_his))




        except Exception as e:
            print(e.__str__())
            self.errors.append("错误信息[%s]%s---接口: %s 项目id: %s 项目名: %s 搜索'%s'点未得到返回结果。" % (BeopTools.getTime(), self.testCaseID, url, projId, projName, pointName))
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




if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Calc006('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
    #unittest.main()
