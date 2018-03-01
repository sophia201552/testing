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
errors = []
flag = {0:"映射点",1:"算法点",2:"计算点"}




class Calc007(unittest.TestCase):
    testCaseID = 'Calc007'
    projectName = "上海中芯国际"
    buzName = '删除历史数据'
    start = 0.0
    projectId = 1
    pointName = "woodyTest2"

    url = "http://%s/clearData/%s/%s" % (app.config['EXPERT_CONTAINER_URL'], projectId, pointName)


    def setUp(self):
        self.start = datetime.datetime.now()




    def Test(self):
        global errors
        a = BeopTools()
        r = a.tokenGet(url=self.url,timeout=10)
        t = self.getTime()
        result = self.getHistoryData(self.pointName,t)
        print("ii")
        #抛出整个case中遇到的错误
        errors2 = errors
        errors = []
        self.raiseError(errors2)



    #获取历史数据
    def getHistoryData(self,point,Strftime):
        global errors
        #得到该点最近更新时间
        a = BeopTools()
        pointList = [point]
        data = {'proj':1,"pointList":pointList}
        startTime = Strftime[0]
        endTime = Strftime[1]
        data = dict(projectId=1, timeStart=startTime, timeEnd=endTime, timeFormat='m5', pointList=pointList)
        getHisUrl = 'http://%s/get_history_data_padded'%app.config['SERVERIP']
        value = a.postData(url=getHisUrl,data=data,t=10)
        if isinstance(value,dict):
            if value.get("msg",False) == "no history data":
                return None
            else:
                errors.append("错误信息新添加计算点后拿到了历史数据!")
        else:
            return value

    def getTime(self):
        date = datetime.datetime.now()
        startTime = date - datetime.timedelta(days=2)
        endTime = date - datetime.timedelta(days=1)
        startTime = datetime.datetime.strftime(startTime,'%Y-%m-%d %H:00:00')
        endTime = datetime.datetime.strftime(endTime,'%Y-%m-%d %H:00:00')
        return (startTime, endTime)


    #抛出异常函数
    def raiseError(self,error):
        if error != []:
            #print("\n".join(error))
            assert 0,"\n".join(error)
        else:
            pass

    def tearDown(self):
        global errors
        errors = []
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())





if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Calc007('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
    #unittest.main()
