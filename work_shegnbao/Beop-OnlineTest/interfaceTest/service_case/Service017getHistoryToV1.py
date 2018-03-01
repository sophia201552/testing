__author__ = 'sophia'
import unittest
import sys
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import datetime, time
url_history = 'http://%s/v1/data/get_history' % app.config['SERVERIP']

data_h1 = {"dsItemIds": ["555d528694022d0754839f90"], "timeStart": "2016-07-27 14:00:00", "timeEnd": "2016-07-27 14:00:00",
        "timeFormat": "h1"}
data_m5={"dsItemIds": ["555d528694022d0754839f90"], "timeStart": "2016-07-27 14:10:00", "timeEnd": "2016-07-27 14:10:00",
        "timeFormat": "m5"}
data_m1 = {"dsItemIds": ["555d528694022d0754839f90"], "timeStart": "2016-07-27 14:22:00",
           "timeEnd": "2016-07-27 14:22:00",
           "timeFormat": "m1"}
data_d1 = {"dsItemIds": ["555d528694022d0754839f90"], "timeStart": "2016-07-27 00:00:00",
           "timeEnd": "2016-07-27 00:00:00",
           "timeFormat": "d1"}
data1 = {"dsItemIds": None, "timeStart": None, "timeEnd": None, "timeFormat": None}
data2 = {"dsItemIds": ["555d528694022d0754839f90"], "timeStart": "2016-07-27 14:00:00",
         "timeEnd": "2016-07-27 15:50:49", "timeFormat": "m6"}
data3 = {"dsItemIds": ["555d528694022d0754839f90"], "timeStart": "2016-0727 14:00:00", "timeEnd": "2016-07-27 15:50:49",
         "timeFormat": "m5"}
data4 = {"dsItemIds": ["555d528694022d0754839f90"], "timeStart": "2016-07-27 10:00:00", "timeEnd": "2016-07-27 6:50:00",
         "timeFormat": "m5"}


class Service017(unittest.TestCase):
    testCaseID = 'Service017'
    projectName = "BeopService"
    buzName = '验证analysis/startWorkspaceDataGenHistogram的升级版v1/data/get_history接口'
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
        self.getHistory()
        self.raiseError(self.errors)

    def getHistory(self):
        tool = BeopTools()
        # 验证正确的参数的返回值周期为h1
        result = self.postURL(url_history, data_h1)
        self.check(result, data_h1)
        # 验证正确的参数的返回值周期为m5
        result = self.postURL(url_history, data_m5)
        self.check(result, data_m5)
        # 验证正确的参数的返回值周期为m1
        # result = self.postURL(url_history, data_m1)
        # self.check(result, data_m1)
        # 验证正确的参数的返回值周期为d1
        result = self.postURL(url_history, data_d1)
        self.check(result, data_d1)
        # print(result)
        # 验证错误的数据
        # 参数值为空
        result = self.postURL(url_history, data1)
        self.check(result, data1, 1)
        # 周期不是m5,h1,d1,m1
        result = self.postURL(url_history, data2)
        self.check(result, data2, 2)
        # 参数的的时间格式不对
        result = self.postURL(url_history, data3)
        self.check(result, data3, 1)
        # 结束时间大于开始时间
        result = self.postURL(url_history, data4)
        self.check(result, data4, 3)

    def check(self, value, data, flag=0):
        tool = BeopTools()
        print(str(data))
        print(str(value))
        try:
            if (flag == 0):
                if (type(value) == type({}) and value['list'][0]['data'][0] != None and value['timeShaft'][0] != None):
                    print('%s接口返回的结果值是正确的%s' % (url_history, str(value['list'][0]['data'])))
                else:
                    self.errors.append("错误信息[%s]%s---请求%s接口post的参数为%s返回的值返回值应该是数值,实际是%s!" % (tool.getTime(), self.testCaseID, url_history, data,str(value)))

            elif (flag == 1):
                    if ('invalid' in value['msg']):
                        print('%s接口使用错误的参数返回的结果值是正确的%s' % (url_history, str(value['msg'])))
                    else:
                        self.errors.append("错误信息[%s]%s---请求%s接口使用错误的post的参数为%s返回的值与预期的不符,不是无效字符串的提示,实际是:%s!" % (
                        tool.getTime(), self.testCaseID, url_history, data, str(value)))
            elif (flag == 2):
                    if ('supported' in value['msg']):
                        print('%s接口使用错误的参数返回的结果值是正确的%s' % (url_history, str(value['msg'])))
                    else:
                        self.errors.append("错误信息[%s]%s---请求%s接口使用错误的post的参数为%s返回的值与预期的不符,不是周期格式不支持的提示,实际是:%s!" % (
                        tool.getTime(), self.testCaseID, url_history, data, str(value)))
            elif (flag == 3):
                if ('startTime' in value['msg']):
                    print('%s接口使用错误的参数返回的结果值是正确的%s' % (url_history, str(value['msg'])))
                else:
                    self.errors.append("错误信息[%s]%s---请求%s接口使用错误的post的参数为%s返回的值与预期的不符,不是结束时间大于开始时间的提示,实际是:%s!" % (
                    tool.getTime(), self.testCaseID, url_history, data, str(value)))
        except Exception as e:
            print(e.__str__())
            self.writeLog(e.__str__())
            self.errors.append(
                "错误信息[%s]%s---请求%s接口post的参数为%s返回的值出错%s!" % (tool.getTime(), self.testCaseID, url_history, data,e.__str__()))

    # 访问接口
    def postURL(self, url, data):
        rv = None
        tool = BeopTools()
        try:
            rv = tool.postData(url=url, data=data, t=45)
            return rv
        except Exception as e:
            print(e.__str__())
            self.writeLog(e.__str__())
            self.errors.append("错误信息[%s]%s---请求%s接口失败!" % (tool.getTime(), self.testCaseID, url))

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
    suite.addTest(Service017('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
