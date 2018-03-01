__author__ = 'kirry'
import socket
import unittest
import time
import datetime, sys, json,ssl
from interfaceTest import app
from interfaceTest.Methods.BeopTools import BeopTools
import json
import pymysql

class Base023(unittest.TestCase):
    testCaseID = "Base023"
    projectName = '无'
    url = "http://%s/memcache/show"
    urlupdata = "http://%s/projectMap/update"
    ip = app.config["SERVERIP_ALL"]





    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))
        self.a = BeopTools()
    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

    def Test(self):
        self.error = []
        for ip in self.ip:
            url = self.url%self.ip[ip]
            rv = self.getData(url)
            if rv and isinstance(rv,dict):
                projectInfoList = rv.get("projectInfoList").__len__()
                if projectInfoList>10:
                    print("%s的mecache中的projectInfoList数据正常！"%ip)
                else:
                    self.error.append("%s的mecache中的projectInfoList的长度小于10，为%s"%(ip,projectInfoList))
                projectLocateMap = rv.get("projectLocateMap")
                addlistNum = projectLocateMap.get("addrList").__len__()
                mongoInstanceNum = projectLocateMap.get("mongoInstance").__len__()
                projectLocateNum = projectLocateMap.get("projectLocate").__len__()
                if addlistNum == 8:
                    print("%s中的addlist数量正常！"%ip)
                else:
                    self.error.append("%s的mecache中的projectLocateMap下的addlist的长度不等于8，为%s"%(ip,addlistNum))
                if mongoInstanceNum == 7:
                    print("%s中的mongoInstance数量正常！"%ip)
                else:
                    self.error.append("%s的mecache中的projectLocateMap下的mongoInstance的长度不等于8，为%s"%(ip,mongoInstanceNum))
                if projectLocateNum > 10:
                    print("%s中的mongoInstance数量正常！"%ip)
                else:
                    self.error.append("%s的mecache中的projectInfoList的长度小于于10，为%s"%(ip,projectLocateNum))
                if self.error:
                    self.flushRedis(self.ip[ip])
        BeopTools.raiseError(self.error,self.testCaseID)







    def getData(self,url):
        try:
            rv = BeopTools.getDataText(url,timeout=600)
        except:
            assert 0,"请求接口%s超时60s！"%url
        rv = json.loads(rv)
        return rv

    def flushRedis(self,ip):
        num = 0
        url = self.urlupdata%ip
        while num < 3:
            a = json.dumps(self.getData(url))
            if "true" in a.lower():
                print("刷新%s的redis缓存成功！"%ip)
                break
            else:
                print("刷新失败，重新刷新%s第%s次！"%(num+1,ip))
            num-=1




if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Base023('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

