__author__ = 'woody'
import requests,sys
from interfaceTest.Methods.BeopTools import *
import unittest
from interfaceTest import app
from datetime import datetime
import json
import memcache
projCount = 103
mapCount = 92
serverip = app.config['SERVERIP']
projUrl = "http://" + serverip + "/updateProjectInfo"
projMapUrl = "http://" + serverip + "/projectMap/update"
showUrl = "http://" + serverip + "/memcache/show"
mc = memcache.Client(['beopdemo.rnbtech.com.hk:11211'], debug=0)
#demo  memcache少项目ID
ids = [85,89,91,95,96,66,67,68,69,70,"89","91"]
for x in range(129,600):
    ids.append(x)


class Smoke018(unittest.TestCase):
    testCaseID = 'Smoke018'
    projectName = '不选择项目'
    buzName = 'Memcache项目以及地图判断'
    start = 0.0
    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))


    def Test(self):
        self.verify()
        self.getMapInfo()
        self.memcacheShow()




    def getMapInfo(self):
        a = BeopTools()
        value = a.getData(url=projMapUrl,timeout=10)
        if value == True:
            pass
        else:
            assert 0,"memcache %s接口返回不为True，请检查!" % projMapUrl

    def getProjectInfo(self):
        a = BeopTools()
        value = a.getData(url=projMapUrl,timeout=10)
        if value == True:
            pass
        else:
            assert 0,"memcache %s接口返回不为True，请检查!" % projUrl


    def memcacheShow(self):
        a = BeopTools()
        Map = None
        Project = None
        value = a.getData(url=showUrl,timeout=10)
        try:
            if 'projectLocateMap' in value.keys():
                pass
            if 'projectInfoList' in value.keys():
                pass
        except Exception as e:
            print(e)
            assert 0,"memcache/show接口里没有projectLocateMap或projectInfoList信息!"

    def verify(self):
        value_info = mc.get('projectInfoList')
        if len(value_info) < projCount:
            assert 0,"demo--memcache的项目信息丢失，少于103个!"

        for value in value_info:
            for key in value.keys():
                if value[key] == "" or value[key] == None:
                    x = value['id']
                    if int(x) in ids:
                        pass
                    else:
                        assert 0,"id为%s的项目中%s丢失内容!" % (value['id'],key)

        value_map = mc.get("projectLocateMap")
        if "addrList" in value_map:
            projectLocateLength = len(value_map['addrList'])
            if projectLocateLength == 3:
                pass
            else:
                assert 0,"addrList" + "ip个数不为3个!"
        else:
            assert 0,"memcache中mapInfo没有找到addrList信息!"

        if "mongoInstance" in value_map:
            for key in value_map['mongoInstance'][1].keys():
                if value_map['mongoInstance'][1][key] is not None:
                    pass
                else:
                    assert 0,"mongoInstance[1]中的" + value_map['mongoInstance'][1][key]  + "为空!"
        else:
            assert 0,"memcache中mapInfo没有找到mongoInstance信息!"



        try:
            projMap = value_map["projectLocate"]
            a = projMap[1]
            b = projMap[2]
            if len(projMap) < 92:
                assert 0,"项目地图坐标少于92个，请检查!"
            else:
                pass
            for project in projMap:
                for key in projMap[project][0].keys():
                    if projMap[project][0][key] is None:
                        assert 0,"mongo地图坐标中" + projMap[project][key] + '丢失!'
                    else:
                        pass

        except Exception as e:
            assert 0,"memcache没有项目坐标信息!"



    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())



if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Smoke018('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)