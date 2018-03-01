__author__ = 'woody'
import unittest
import sys, time
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app

projectIdList = [203,201,200,194,190,186,179,132,128,126,121,119,116,115,102,100,96,94,84,82,81,
                 72,284,281,19,18,1]

URL = 'http://%s/getSaveSvrProjIdList' % app.config['SERVICE_URL']

class Algorithm004(unittest.TestCase):
    testCaseID = 'Algorithm004'
    projectName = "付费项目"
    buzName = '虚拟点未写入SaveSvrHistory字段是否为0'


    #case初始化,获取开始时间以及时间戳,获取写入日志句柄logger
    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))
        self.a = BeopTools()









    def Test(self):
        self.errors = []
        rt = self.getSaveSvr()
        self.checkState(rt)
        self.a.raiseError(self.errors, self.testCaseID)

    def getSaveSvr(self):
        rt = {}
        try:
            rt = self.a.getData(url=URL, timeout=10)
        except Exception as e:
            self.a.writeLogError(self.logger, e.__str__())
            self.errors.append('错误信息[%s]%s---%s' % (self.a.getTime(), self.testCaseID, e.__str__()))
            self.a.raiseError(self.errors, self.testCaseID)
        return rt


    def checkState(self, rt):
        for info in rt:
            if int(info.get('id')) in projectIdList:
                print("%s项目为待检查!" % info.get('name_cn'))
                if info.get('SaveSvrHistory', 0):
                    print("%s项目检查通过!" % info.get('name_cn'))
                else:
                    self.errors.append('错误信息[%s]%s---项目id: %s 项目名称: %s SaveSvrHistory字段为0!请检查!' % (self.a.getTime(), self.testCaseID, str(info.get('id')), info.get('name_cn')))

    #用例结束后的清理工作,记录输出时间以及
    def tearDown(self):
        self.errors = []
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())





if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Algorithm004('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)


