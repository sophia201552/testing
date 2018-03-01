__author__ = 'kirry'
import datetime,time
from interfaceTest import app
from interfaceTest.Methods.BeopTools import BeopTools
import unittest

checkTimes = None
class Calc043(unittest.TestCase):
    testCaseID = 'Calc043'
    projectName = "TWS"
    buzName = '检查前一天的历史数据是否为空'
    now = 'None'
    url = "http://%s/v1/data/get_history_at_time" % app.config['SERVERIP']


    def setUp(self):
        self.start = datetime.datetime.now()
        self.startime = self.start-datetime.timedelta(minutes = 20)
    def Test(self):
        global checkTimes
        self.errors = []
        a = BeopTools()
        now = datetime.datetime.now()
        if  not checkTimes or (now-checkTimes).seconds/60>60:
            checkTimes = now
            needTime = datetime.datetime.strftime(now - datetime.timedelta(hours = 1),"%Y-%m-%d %H:%M")
            checkTime = []
            checkTime.append(needTime[:-1]+"0:00")
            checkTime.append(needTime[:-1]+'5:00')
            checkTime.append(needTime[:-2]+str((int(needTime[-2:])+10))[:-1]+"0:00")
            for i in checkTime:
                data = {"pointList":["Weatherdata"],"projId":457,"bSearchNearest":True,"time":i}
                try:
                    rv = a.postJsonToken(url = self.url,data = data)
                except Exception as e:
                    print(e.__str__())
                    assert 0,"%s接口请求超时！"%self.url
                if "null" not in rv and rv:
                    print("返回数据正常！")
                else:
                    self.errors.append("检查%s项目，%s点当前时间点的上一个小时的历史数据为空！"%(self.projectName,"Weatherdata"))
            if len(self.errors)>3:
                a.raiseError([self.errors[0]],self.testCaseID)
            self.errors.clear()



    def tearDown(self):
        self.errors = []
        self.offline = False
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

if __name__ == '__main__':

    suite = unittest.TestSuite()
    suite.addTest(Calc043('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
