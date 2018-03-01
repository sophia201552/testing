__author__ = 'kirry'
import unittest,requests
import sys, time,json,datetime
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app

waitTime = None
class Maint001(unittest.TestCase):
    testCaseID = 'Maint001'
    projectName = ""
    buzName = '刷新redis接口'
    errors = []
    serverip = app.config["SERVERIP_ALL"]


    #case初始化,获取开始时间以及时间戳,获取写入日志句柄logger
    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))




    def Test(self):
        global waitTime
        a = BeopTools()
        now = datetime.datetime.now()
        if waitTime:
            deltime = (now-waitTime).total_seconds()/60>10
            if deltime:
                url = ["/projectClusterMap/update","/projectMap/update","/updateProjectInfo"]
            else:
                url = ["/projectClusterMap/update","/projectMap/update"]
        else:
            waitTime = now
            url = ["/projectClusterMap/update","/projectMap/update","/updateProjectInfo"]
        for serverip in self.serverip:
            urls = ["http://"+self.serverip[serverip]+i for i in url]
            for ul in urls:
                rv = self.getRequest(ul,self.serverip[serverip])
                if "true" in rv.lower():
                    print("刷新接口%s正常！"%ul)
                else:
                    print("再次刷新接口%s"%ul)
                    self.getRequest(ul,self.serverip[serverip])





    def getRequest(self,url,ip):
        session = requests.Session()
        urllogin = 'http://%s/login'%ip
        data = {"name": "projecttest@rnbtech.com.hk","pwd": "h=Lp4U8+Lp"}
        header = {"content-type":"application/json"}
        session.post(urllogin,json.dumps(data),headers = header)
        try:
            rv = session.get(url,headers=header,timeout=60)
        except Exception as e:
            return "False"
        return rv.text




    #用例结束后的清理工作,记录输出时间以及
    def tearDown(self):
        self.errors = []
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())





if __name__ == '__main__':
    while True:
        suite = unittest.TestSuite()
        suite.addTest(Maint001('Test'))
        runner = unittest.TextTestRunner()
        result = runner.run(suite)
        time.sleep(60)

