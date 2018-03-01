__author__ = 'woody'
import requests
from interfaceTest.Methods.BeopTools import *
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

param1 = ('CWP001_EnergySavingP','CWP001_PumpOnOff','CWP001_PumpPower')
param2 = ('CWP002_EnergySavingP','CWP002_PumpOnOff','CWP002_PumpPower')
param3 = ('CWV_CWP1','CWV_onoff','ChCWV001_ValveOpenStatus','ChCWV002_ValveOpenStatus','ChCWV003_ValveOpenStatus','CWP001_PumpOnOff')
param4 = ('CWV_CWP2','CWV_onoff','ChCWV001_ValveOpenStatus','ChCWV002_ValveOpenStatus','ChCWV003_ValveOpenStatus','CWP002_PumpOnOff')


projectId = 186
mysqlName = "rt_data186"



class Calc015(unittest.TestCase):
    testCaseID = 'Calc015'
    projectName = "华滋奔腾项目"
    buzName = '实时数据点计算'
    start = 0.0
    now = 0
    startTime = ""

    #url = "http://beop.rnbtech.com.hk/admin/dataPointManager/search/"
    errors = []
    #offline = []


    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.errors = []



    def Test(self):
        #self.get_history_data(projectId,param1[2],'2016-07-18 15:30:00')
        #a = BeopTools()

        self.checkValue(param1)
        self.checkValue(param2)

        self.checkValue2(param3)
        self.checkValue2(param4)
        self.raiseError(self.errors)


    def get_real_data(self, projId, pointName):
        rt = None
        a = BeopTools()
        data = {'proj':projId,'pointList':['%s' % pointName]}
        url = "http://%s/get_realtimedata" % app.config['SERVERIP']
        try:
            rt = a.postJsonToken(url, data, 10)
        except Exception as e:
            print(e.__str__())
            self.errors.append("错误信息访问%s接口失败,请检查!" % (url, ))
        if rt is not None and isinstance(rt, list):
            value = rt[0].get('value')
        else:
            self.errors.append("错误信息访问%s接口失败,返回结果不为list,请检查!" % (url, ))
            return None
        if value is not None:
            return value
        else:
            return None

    def get_history_data(self,projId,pointName, timeStart, timeEnd):
        rt = None
        a = BeopTools()
        data = {
                "projectId":str(projId),
                "pointList":["%s" % pointName],
                "timeStart":timeStart,
                "timeEnd":timeEnd,
                "timeFormat":"m1"
                }
        url = "http://%s/get_history_data_padded_reduce" % app.config['SERVERIP']
        try:
            rt = a.postJsonToken(url, data, 10)
        except Exception as e:
            print(e.__str__())
            self.errors.append("错误信息访问%s接口失败,请检查!" % (url, ))
        if rt and isinstance(rt, dict):
            value = rt.get('data')
            if value:
                value = value.get(pointName,[])
                if len(value):
                    value = value[-1]
                    return value
            else:
                self.errors.append("错误信息%s点在%s~%s没有获取到历史数据!" % (pointName, timeStart, timeEnd))

            #print(rt)

        else:
            self.errors.append("错误信息访问%s接口返回结果不为dict或为None!" % (url, ))
        #print(value)
        return None




    #获取计算点实时数据
    def getData(self,projId,pointName,pointType):
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
            t2 = datetime.datetime.strptime(t, "%Y-%m-%d %H:%M:%S")
            seconds = (datetime.datetime.now() - t2).seconds
            if 5 < int(time_org[-1:]) <= 9:
                time_org = time_org[:-1] + "5"
            elif 0 < int(time_org[-1:]) < 5:
                time_org = time_org[:-1] + "0"
            else:
                pass
            t = time_org + ":00"
            t_start = datetime.datetime.strptime(t, "%Y-%m-%d %H:%M:%S") - datetime.timedelta(seconds=600)
            t_start = datetime.datetime.strftime(t_start, "%Y-%m-%d %H:%M:%S")

            rv_his = self.get_history_data(projectId, pointName, t_start, t)
            if seconds > 900:
                self.errors.append("%s项目 %s点 已超过15分钟未更新!最近更新时间为%s" % (self.projectName, pointName, t2))
            print("%s点在%s时的值为%s" % (pointName, t, rv_his))

        except Exception as e:
            print(e.__str__())
            self.errors.append("错误信息接口: %s 项目id: 项目名: %s %s搜索'%s'计算点未得到返回结果。" % (url, projId, self.projectName, pointName))
        return (rv, time_org)

    def checkValue(self,param):
        #获取计算点的值
        r = self.get_real_data(projectId,param[0])
        rv = float(r)

        '''
        获取历史数据
        org1 = float(self.get_history_data(projectId,param[1], t_start, t))
        org2 = float(self.get_history_data(projectId,param[2], t_start, t))
        '''
        try:
            org1 =float(self.get_real_data(projectId, param[1]))
            org2 =float(self.get_real_data(projectId, param[2]))
        except Exception as e:
            print(e.__str__())

        if org1 > 0 and org2 < 75:
           expect = (1 - org2 / 75) * 100
        else:
            expect = 0

        #expect = round(expect, 2)
        if abs(expect - float(rv) <= 0.01):
            print("%s计算点按照公式求出的值与预期相符!" % param[0])
        else:
            self.errors.append("错误信息%s计算点按照公式求出的值与预期不相符!可能是数据未更新!时间戳: %s 项目名:%s 项目id: %s mysql collection:%s 预期结果:%s 实际结果:%s" % (param[0], t, self.projectName, projectId, mysqlName, expect, rv))
        #print(expect)


    def checkValue2(self,param):
        #获取计算点的值
        r = self.get_real_data(projectId,param[0])
        rv = float(r)
        #点值时间
        #t = r[1]


        org1 = 0
        '''
        历史数据
        org1_1 = float(self.get_history_data(projectId, param[2], t_start, t))
        org1_2 = float(self.get_history_data(projectId, param[3], t_start, t))
        org1_3 = float(self.get_history_data(projectId, param[4], t_start, t))
        '''

        org1_1 = float(self.get_real_data(projectId, param[2]))
        org1_2 = float(self.get_real_data(projectId, param[3]))
        org1_3 = float(self.get_real_data(projectId, param[4]))

        org = float(self.get_real_data(projectId,param[1]))
        #org2 = float(self.getData(projectId,param[5],0))
        if (org1_1 + org1_2 + org1_3) > 0:
            org1 = 1
        else:
            org1 = 0
        if abs(org - org1) <= 0.01:
            print("%s计算点按照公式求出的值与预期相符!" % param[1])
            org2 = float(self.get_real_data(projectId, param[5]))
            expect = 0

            '''
            if (get_data('CWV_onoff')) and (get_data('CWP001_PumpOnOff')):
                return 1
            else:
                return 0
            '''

            if org1 and org2:
               expect = 1
            else:
                expect = 0

            #expect = round(expect, 2)
            if abs(expect - float(rv)) <= 0.01:
                print("%s计算点按照公式求出的值与预期相符!" % param[0])
            else:
                self.errors.append("错误信息%s管道计算点值与预期不相符!可能导致嘉民--运行检视--管道水流动画没有及时更新!时间戳: %s 项目名:%s 项目id: %s mysql collection:%s 预期结果:%s 实际结果:%s" % (param[0], t, self.projectName, projectId, mysqlName, expect, rv))
            #print(expect)
        else:
            self.errors.append("错误信息%s管道内部计算点值与预期不相符!可能导致嘉民--运行检视--管道水流动画没有及时更新,请检查!时间戳:%s 项目名:%s 项目id: %s mysql collection:%s 预期结果:%s 实际结果:%s" % (param[1], t, self.projectName, projectId, mysqlName,  org1, org))





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
    suite.addTest(Calc015('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

    #unittest.main()
