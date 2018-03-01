__author__ = 'yanguanwei'
import requests
from interfaceTest.Methods.BeopTools import *
from interfaceTest import app
import unittest
from datetime import datetime
import json
from bson import ObjectId
serverip = app.config['SERVERIP']
urls = []

urls.append("http://%s/asset/saveThing" % serverip)
urls.append("http://%s/asset/saveModel" % serverip)
urls.append("http://%s/asset/getThingInfoList" % serverip)
urls.append("http://%s/asset/getThingDetail/" % serverip)
urls.append("http://%s/asset/getModel/" % serverip)
urls.append("http://%s/asset/getMaintainList" % serverip)
urls.append("http://%s/asset/getAllModel" % serverip)
urls.append("http://%s/iot/search" % serverip)
#urls.append("http://%s/asset/getDiagnosisList" % serverip)

class Smoke024(unittest.TestCase):
    testCaseID = 'Smoke024'
    projectName = '不选择项目'
    buzName = '资产管理接口'
    start = 0.0

    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.go()



    def go(self):
        thing_id = ObjectId()
        model_id = ObjectId()
        request_thing = {
            "_id": thing_id.__str__(),
            "desc": '功率非常高的发动机_mango',
            "manager": '王管理_mango',
            "other": '_mango',
            "lang": [300, 200, 100],

            "updateTime": '2016-02-03 10:10',
            "status": 0,

            "brand": 'DELL_mango',
            "model": model_id.__str__(),

            "sn": 'TWAG-MAM2-GLVV-12K9-HMA6-PAXL_mango',

            "urlImg": '/static/images/plant_icon.png',
            "urlQRCode": 'http://baike.baidu.com/pic/QRCode/10336647/0/b13fd480df4a95e89123d997?fr=lemma&ct=single',

            "supplier": '张大饼_mango',
            "buyer": '李采购_mango',
            "price": '88888$',
            "buyingTime": '2013-02-03 10:10',
            "guaranteeTime": '2116-03-02',
            "activeTime": '2016-03-02 10:10',
        }
        request_model = {
        "_id": model_id.__str__(),
        "name": "发动机_mango",
        "attr": {
            "功率": "800000Hz",
            "颜色": "红",
            "三级缓存": "10M",
            "硬盘容量": "1000T"
                }
        }
        tool = BeopTools()
        resultList = []
        result1 = tool.postData(urls[0],request_thing,t=15)
        resultList.append(result1)
        result2 = tool.postData(urls[1],request_model,t=15)
        resultList.append(result2)
        result3 = tool.getData(urls[2],t=15)
        resultList.append(result3)
        result4 = tool.getData(urls[3]+thing_id.__str__(),t=15)
        resultList.append(result4)
        result5 = tool.getData(urls[4]+model_id.__str__(),t=15)
        resultList.append(result5)
        result6 = tool.getData(urls[5],t=15)
        resultList.append(result6)
        result7 = tool.getData(urls[6],t=15)
        resultList.append(result7)
        result8 = tool.getData(urls[7],t=15)
        resultList.append(result8)

        rt = []
        for index, res in enumerate(resultList):
            if not res:
                rt.append('接口%s返回空'%(urls[index]))
                assert 0,'接口%s返回空'%(urls[index])
        print(rt)

    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())



if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Smoke024('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)