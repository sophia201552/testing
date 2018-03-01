__author__ = 'woody'
import unittest
import sys
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import time, datetime
import requests

class Base016(unittest.TestCase):
    testCaseID = 'Base016'
    projectName = ""
    buzName = '监测Redis缓存中算法容器线程更新时间'
    start = 0.0
    now = 0
    startTime = ""
    errors = []
    TIMEOUT = 10
    DELAY = 5
    url = "http://%s/memcache/getMemValue/" % app.config['SERVERIP']
    strServer = 'expert'
    checkInfo = [
        # {'key': strServer + 'heartbeat_patchlostdata', 'name': '计算后台-补缺数进程'},
        {'key': strServer + 'heartbeat_patchlostdata', 'name': '计算后台-补缺数进程'},
        #{'key': strServer + 'heartbeat_patchlostdata', 'name': '计算后台-补缺数进程'},
        {'key': strServer + 'heartbeat_diag', 'name': '计算后台-诊断进程'},
        {'key': strServer + 'heartbeat_real', 'name': '计算后台-实时计算'},
        {'key': strServer + 'heartbeat_alarm', 'name': '计算后台-报警扫描进程'},
        {'key': strServer + 'heartbeat_force', 'name': '计算后台-强制实时计算进程'},
        {'key': strServer + 'heartbeat_fix', 'name': '计算后台-定点触发计算或诊断的扫描进程'},
    ]




    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.errors = []
        for x in self.checkInfo:
            threadName = x.get('key')
            strfTime = self.getTime(threadName,self.url)
            self.checkTime(threadName, strfTime,self.url)
        BeopTools.raiseError(self.errors, self.testCaseID)

    def getTime(self, threadName,url):
        try:
            r = BeopTools.tokenGet(url=url+threadName, timeout=self.TIMEOUT)
            return r
        except Exception as e:
            self.errors.append("错误信息[%s]%s--获取Redis %s value失败!可能是接口超时引起,详细信息:%s" % (BeopTools.getTime(), self.testCaseID, threadName, e.__str__()))
            return None


    def checkTime(self, threadName, strfTime,url):
        now_time = datetime.datetime.now()
        if strfTime:
            threadTime = datetime.datetime.strptime(strfTime, "%Y-%m-%d %H:%M:%S")
            delay = abs(now_time - threadTime).seconds / 60.0
            if delay > float(self.DELAY):
                self.errors.append("错误信息[%s]%s--Redis中%s线程更新时间超过5分钟,为%s" % (BeopTools.getTime(), self.testCaseID, threadName, strfTime))


    def tearDown(self):
        self.errors = []
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Base016('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
