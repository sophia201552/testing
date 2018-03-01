__author__ = 'sophia'
import unittest
import sys
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import datetime, time, requests

class Service015(unittest.TestCase):
    testCaseID = 'Service015'
    projectName = "BeopService"
    buzName = '获取诊断order接口diagnosis/order/get/'
    start = 0.0
    now = 0
    startTime = ""
    errors = []

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def getTime(self):
        return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

    def Test(self):
        self.errors = []
        self.getActiveOrder()
        self.raiseError(self.errors)

    def getActiveOrder(self):
        tool = BeopTools()
        url = "http://%s/diagnosis/order/get/" % app.config['SERVICE_URL']
        projId = '72'
        starttime = '2016-06-10 12:00:00'
        endtime = '2016-06-10 13:00:00'
        url1 = url + projId + '/' + starttime + '/' + endtime
        result = self.getActiveOrderData(url1)
        if (result.status_code == 200):
            print('访问%s接口成功' % (url1))
        else:
            self.errors.append("错误信息[%s]%s---请求%s接口失败,返回status_code为%d!" % (tool.getTime(), self.testCaseID, url1,result.status_code))
        # # 使用错误的url,结束时间>开始时间
        # endtime = '2016-06-10 10:00:00'
        # url2 = url + projId + '/' + starttime + '/' + endtime
        # result = self.getActiveOrderData(url2)
        # self.errorInfo(result,url2)
        # #使用错误的url,时间格式不正确
        # starttime='2016-0610'
        # endtime = '2016-06-10'
        # url3 = url + projId + '/' + starttime + '/' + endtime
        # result = self.getActiveOrderData(url3)
        # self.errorInfo(result,url3)


    def errorInfo(self, result, url):
        tool = BeopTools()
        if (result.status_code == 404):
            print('访问错误的url%s接口成功' % (url))
        else:
            self.errors.append("错误信息[%s]%s---请求错误的url%s接口返回status_code不是404,实际是:%s!" % (tool.getTime(), self.testCaseID, url,str(result.status_code)))

    # 访问接口
    def getActiveOrderData(self, url):
        rv = None
        tool = BeopTools()
        try:
            rv = requests.get(url=url, timeout=15)
        except Exception as e:
            print(e.__str__())
            self.writeLog(e.__str__())
            self.errors.append("错误信息[%s]%s---请求%s接口失败!" % (tool.getTime(), self.testCaseID, url))
        return rv

    # 写log
    def writeLog(self, text):
        self.logger.info('[%s]---' % time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) + '' + text)

    # 抛出异常函数
    def raiseError(self, error):
        if error != []:
            # print("\n".join(error))
            assert 0, "\n".join(error)
        else:
            pass

    def tearDown(self):
        self.errors = []
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Service015('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
    # unittest.main()
