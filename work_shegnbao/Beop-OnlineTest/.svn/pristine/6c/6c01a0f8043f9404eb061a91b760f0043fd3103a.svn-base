__author__ = 'woody'

import unittest, json
import sys
from interfaceTest import app
from interfaceTest.Methods.BeopTools import BeopTools
import datetime
import time
#项目ID,点名,项目名,dtu名称,引擎名称,是否判断掉线时间,持续时间



#url = 'http://192.168.1.208:5000/site/v1.0/updateDTUProjectByName'
url = "http://%s/site/v1.0/updateDTUProjectByName" % app.config['SERVICE_URL']




class Service006(unittest.TestCase):
    testCaseID = 'Service006'
    projectName = "BeopService"
    buzName = '通过名字更新dtu信息/site/v1.0/updateDTUProjectByName'
    start = 0.0
    now = ""
    startTime = ""
    errors = []

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))


    def Test(self):
        self.errors = []
        self.updateDtuInfo()
        BeopTools.raiseError(self.errors, self.testCaseID)


    def updateDtuInfo(self):
        a = BeopTools()
        rt = None
        RTBName = a.random_str(8)
        data = {'dtuName':'newtest001', 'RTBName':RTBName, 'timeZone':'afda', 'serverCode':1000}
        try:
            rt = a.postJsonToken(url=url, data=data, t=10)
        except Exception as e:
            print(e.__str__())
            a.writeLogError(self.logger, e.__str__())
            self.errors.append("错误信息[%s]%s---发送json数据%s到%s接口出错!" % (a.getTime(), self.testCaseID, data, url))
        try:
            if rt.get('status'):
                print("修改成功!")
                self.check(RTBName)
            else:
                raise "错误信息[%s]%s---发送json数据%s到%s接口status为0,可能发生了某个错误!" % (a.getTime(), self.testCaseID, data, url)
                #self.errors.append()
        except Exception as e:
            print(e.__str__())
            a.writeLogError(self.logger, e.__str__())
            self.errors.append(e.__str__())


    def check(self, RTBName):
        a = BeopTools()
        rt = None
        #url = 'http://192.168.1.208:5000/site/v1.0/getDTUProjectByServerCode'
        url = "http://121.41.30.108/site/v1.0/getDTUProjectByServerCode"
        try:
            rt = a.postJsonToken(url=url, data={'serverCode':1000}, t=10)
        except Exception as e:
            print(e.__str__())
            a.writeLogError(self.logger, e.__str__())
            self.errors.append("错误信息[%s]%s---发送json数据%s到%s接口出错!" % (a.getTime(), self.testCaseID, json.dumps({'serverCode':1000}), url))

        dtuInfo = rt.get('dtuList',[])
        if len(dtuInfo):
            print("获取到了相关信息!")
            dtuName = dtuInfo[0].get('dtuName')
            RTB = dtuInfo[0].get('RTBName')
            serverCode = dtuInfo[0].get('serverCode')
            if RTBName == RTB and serverCode == 1000:
                print("更新dtu信息成功!")
            else:
                self.errors.append("错误信息[%s]%s---发送{'serverCode':1000}数据到%s接口获取到的dtu信息与预期不符，详情为:%s" % (a.getTime(), self.testCaseID, url, json.dumps(rt)))
        else:
            self.errors.append("错误信息[%s]%s---发送{'serverCode':1000}数据到%s接口获取到的dtu为[]!" % (a.getTime(), self.testCaseID, url, ))



    def tearDown(self):
        self.errors = []
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())





if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Service006('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

