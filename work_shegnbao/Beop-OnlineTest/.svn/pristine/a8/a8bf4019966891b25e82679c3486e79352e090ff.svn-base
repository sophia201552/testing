__author__ = 'sophia'
import unittest
import sys
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import time, datetime




class Service024(unittest.TestCase):
    testCaseID = 'Service024'
    projectName = "BeopService"
    buzName = '验证该接口获取dtu掉线上线历史,如果没有传时间,就返回本月历史'
    start = 0.0
    now = 0
    startTime = ""
    errors = []
    timeout=10
    timeStart = (datetime.datetime.now()-datetime.timedelta(days=1)).strftime("%Y-%m-%d 00:00:00")
    timeEnd = datetime.datetime.now().strftime("%Y-%m-%d 00:00:00")
    data=[(72,[],"",""),(72,["shhwtrane"],timeStart,timeEnd)]

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.errors = []
        for i in self.data:
            self.getExisted(i)
        BeopTools.raiseError(self.errors, self.testCaseID)

    # 使用正确的获取到接口数据
    def getExisted(self,i):
        url = "http://%s/project/status/history/" % (app.config['SERVERIP'])
        data={"ptojectId":i[0],"dtu":i[1],"startTime":i[2],"endTime":i[3]}
        try:
            rv = BeopTools.postDataExcept(url=url,data=data,timeout=self.timeout)
            if rv.get("success",0):
                print("返回结果中有数据!" )
                data=rv.get("data",0)
                if data:
                    print("data里面有值")
                else:
                    self.errors.append("错误信息访问%s接口,返回结果为%s!" % ( self.url, str(data)))
            else:
                self.errors.append("错误信息访问%s接口,返回结果为%s!" % (self.url,str(rv)))
        except Exception as e:
            print(e.__str__())
            BeopTools.writeLogError(self.logger,e.__str__())
            self.errors.append("错误信息%s" % (e.__str__()))


    def tearDown(self):
        self.errors = []
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Service024('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
