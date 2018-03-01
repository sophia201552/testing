__author__ = 'woody'
import requests
from interfaceTest.Methods.BeopTools import *
from interfaceTest import app
import json
import time
import datetime
import unittest




#项目ID,点名,项目名,dtu名称,引擎名称,是否判断掉线时间,持续时间
serverip = app.config['SERVERIP']
class Calc001(unittest.TestCase):
    testCaseID = 'Calc001'
    projectName = "上海中芯国际"
    buzName = '数据管理--新增/删除计算点'
    errors = []
    projectId = 1
    serverUrl = "http://%s/point_tool/addCloudPoint/%d/" % ( serverip,projectId)
    delUrl ='http://%s/point_tool/deleteCloudPoint/1/'%serverip
    pointUrl = "http://%s/point_tool/getCloudPointTable/%d/1/50/all/2" % ( serverip,projectId)
    data = {'remark': 'woody', 'remark_en': "", 'id': "", 'value': 'woody' + str(BeopTools.random_str(4)), 'flag': 2,
            'format': 'm5', 'logic': '22', 'moduleName': 'calcpoint_1_woody'}
    editUrl='http://%s/point_tool/editCloudPoint/%d/'% (serverip,projectId)

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())


    def Test(self):
        self.errors = []
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

        #添加相同计算点看是否会有报错
        self.addSamePoint()

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
        if not t.get("success") and 'EXISTS_CLOUD_POINT' in t.get("msg"):
            print("添加重复计算点提示点已存在!")
        else:
            self.errors.append("错误信息添加重复计算点没有提示出错!")

    #删除点
    def delPoint(self,pointList):
        global errors
        rv = {}
        a = BeopTools()
        try:
            rv= a.postJsonToken(url=self.delUrl,data=pointList,t=10)
            #print("ok")
        except Exception as e:
            print(e.__str__())
            self.errors.append("错误信息删除新建计算点失败!")
        if rv.get("success",False):
            print("删除新建计算点成功!")
        else:
            self.errors.append("错误信息删除新建计算点失败!")

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




if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Calc001('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

