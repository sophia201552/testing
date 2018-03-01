__author__ = 'woody'
import requests
from interfaceTest.Methods.BeopTools import *
from interfaceTest import app
import json
import time
import datetime
import re
import unittest
from urllib.parse import urlencode
import pymysql


serverip = app.config['SERVERIP']

class Calc005(unittest.TestCase):
    testCaseID = 'Calc005'
    projectName = "上海中芯国际"
    buzName = '新增计算点补历史数据'
    start = 0.0
    now = 0
    startTime = ""
    projectId = 1
    serverUrl = "http://%s/point_tool/addCloudPoint/%d/" % (serverip,projectId)
    data = {'remark':'woody','remark_en':"",'id':"",'value':'woody'+str(BeopTools.random_str(4)),'flag':2,'format':'m5','logic':'22','moduleName':'calcpoint_1_woody'}
    pointUrl = "http://%s/point_tool/getCloudPointTable/%d/1/50/all/2" % (serverip,projectId)
    delUrl = "http://%s/point_tool/deleteCloudPoint/%d/" % (serverip,projectId)
    errors=[]

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())

    def Test(self):
        a = BeopTools()
        #调用新建计算点的接口新建计算点
        try:
            t = a.postForm(url=self.serverUrl,data=self.data,t=10)
        except Exception as e:
            print(e.__str__())
            self.errors.append("错误信息发送Post请求%s接口出错!" % self.serverUrl)
        point = self.data.get("value")
        _id=t.get('data').get('_id')
        pointList = {"points":[point],"pointIds":[_id]}

        #先取历史数据
        t = self.getTime()
        result = self.getHistoryData(self.data.get("value"),t)
        if not result:
            print("新生成的计算点没有历史数据!")

        #补历史数据
        self.addHistoryData(t)

        #再次取历史数据
        result = self.getHistoryData(self.data.get("value"),t)

        vals = []
        #补足后应该都为常量
        if result is not None:
            try:
                for item in result[0].get("history"):
                    vals.append(item['value'])
                vals = [x for x in vals if x != vals[0]]
                print(vals)
            except Exception as e:
                print(e.__str__())
                self.errors.append("错误信息补数据后未取到历史数据，可能是接口阻塞引起.")

            if vals != []:
                self.errors.append("错误信息补常量的历史数据时,出现了变化的历史数据!")
            else:
                print("补数据成功!")
        else:
            self.errors.append("错误信息%s点补数据后仍未取到历史数据!" % self.data.get("value"))
        #调用删除点接口并验证是否删除成功
        self.delPoint(pointList)
        self.raiseError(self.errors)

    #添加相同点判断是否有报错
    def addSamePoint(self):
        a = BeopTools()
        try:
            t = a.postForm(url=self.serverUrl,data=self.data,t=10)
        except Exception as e:
            print(e.__str__())
            self.errors.append("错误信息发送Post请求%s接口出错!" % self.serverUrl)
        if not t.get("success") and 'existed' in t.get("msg"):
            print("添加重复计算点提示点已存在!")
        else:
            self.errors.append("错误信息添加重复计算点没有提示出错!")

    #获取计算点表信息
    def getPoints(self,point):
        a = BeopTools()
        #flag
        m = False
        rv=None
        try:
            rv = a.tokenGet(url=self.pointUrl,timeout=10)
            #从获取的data中寻找该点名是否存在
            if rv.get('data',False):
                table = rv['data'].get('pointTable',False)
                if table:
                    for p in table:
                        if p.get("alias",False):
                            #print("找到点名")
                            if p['alias'] == point:
                                m = True
                                print("新建点名为%s" % p['alias'])
                            else:
                                pass
                        else:
                            self.errors.append("错误信息有未命名的计算点存在,详细内容为%s" % json.dumps(p))
                else:
                    self.errors.append("错误信息调用%s接口未获取到pointTable!" % self.pointUrl)
        except Exception as e:
            print(e.__str__)
            self.errors.append("错误信息发送Get请求%s接口出错!" % self.pointUrl)
        return m


 #删除点
    def delPoint(self,pointList):
        rv = {}
        a = BeopTools()
        try:
            rv= a.postJsonToken(url=self.delUrl,data=pointList,t=10)
        except Exception as e:
            print(e.__str__())
            self.errors.append("错误信息删除新建计算点失败!")
        if rv.get("success",False):
            print("删除新建计算点成功!")
        else:
            self.errors.append("错误信息删除新建计算点失败!")


    def getTime(self):
        date = datetime.datetime.now()
        startTime = date - datetime.timedelta(days=2)
        endTime = date - datetime.timedelta(days=1)
        startTime = datetime.datetime.strftime(startTime,'%Y-%m-%d %H:00:00')
        endTime = datetime.datetime.strftime(endTime,'%Y-%m-%d %H:00:00')
        return (startTime, endTime)


    #获取历史数据
    def getHistoryData(self,point,Strftime):
        #得到该点最近更新时间
        a = BeopTools()
        pointList = [point]
        data = {'proj':1,"pointList":pointList}
        startTime = Strftime[0]
        endTime = Strftime[1]
        data = dict(projectId=1, timeStart=startTime, timeEnd=endTime, timeFormat='m5', pointList=pointList)
        getHisUrl = 'http://beop.rnbtech.com.hk/get_history_data_padded'
        value = a.postData(url=getHisUrl,data=data,t=10)
        if isinstance(value,dict):
            if value.get("msg",False) == "no history data":
                return None
            else:
                self.errors.append("错误信息新添加计算点后拿到了历史数据!")
        else:
            return value

    #补历史数据方法
    def addHistoryData(self,strTime):
        url = 'http://121.41.28.69:4000/repairData/batch'
        data = {
                'list':'["%s"]' % self.data.get("value"),
                 'timeFrom': strTime[0],
                'timeTo': strTime[1],
                'projId': 1,
                'format': 'm5',
                'userId':2265,
                'all':False
        }
        payload = urlencode(data,encoding="utf-8")
        a = BeopTools()
        try:
            rv = a.postForm(url=url,data=payload,t=60)
            time.sleep(30)
        except Exception as e:
            self.errors.append("错误信息补数据失败!")
            self.raiseError(self.errors)


    #抛出异常函数
    def raiseError(self,error):
        if error != []:
            #print("\n".join(error))
            assert 0,"\n".join(error)
        else:
            pass


    def tearDown(self):
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        #info.append([self.testCaseID, use, now])




if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Calc005('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
    #unittest.main()
