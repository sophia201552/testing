__author__ = 'sophia'
import unittest
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import datetime, time, json
import sys
t = 20
url = "http://%s/v1/data/get_realtime" % app.config['SERVERIP']

data = dict(proj='1', pointList=['OutdoorTdbin'])
wrong_data = dict(proj='1', pointList=[''])


class Service018(unittest.TestCase):
    testCaseID = 'Service018'
    projectName = "BeopService"
    buzName = '验证实时接口get_realtimedata升级为v1/data/get_realtime'
    start = 0.0
    now = 0
    startTime = ""
    errors = []

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def writeLog(self, text):
        self.logger.info('[%s]---' % time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) + '' + text)

    def Test(self):
        self.errors = []
        self.getRealtimeData()
        self.raiseError()

    def getRealtimeData(self):
        tool = BeopTools()
        try:
            rv = self.postRealTime(data)
            print(str(rv))
            if (type(float(rv[0]['value'])) == type(1.0) and rv[0]['name'] == 'OutdoorTdbin'):
                print('%s接口返回值正确' % url)
            else:
                self.errors.append("错误信息[%s]%s---%s接口返回点名或者点值的数据为空" % (tool.getTime(), self.testCaseID, url))
            rv = self.postRealTime(wrong_data)
            print(str(rv))
            if (rv[0]['name'] == '' and rv[0]['value']=='Null'):
                print('用错误的参数返回的结果是正确的')
            else:
                self.errors.append(
                    "错误信息[%s]%s---用参数%s获取%s接口返回的结果不是[]" % (tool.getTime(), self.testCaseID, wrong_data, url))
        except Exception as e:
            print(e.__str__())
            self.writeLog(e.__str__())
            self.errors.append(
                "错误信息[%s]%s---验证用参数%s获取%s接口返回的数据出错,返回值可能是[]" % (tool.getTime(), self.testCaseID, data, url))


    def postRealTime(self, data):
        rv = None
        tool = BeopTools()
        try:
            rv = tool.postData(url=url, data=data, t=t)
            return rv
        except Exception as e:
            print(e.__str__())
            self.writeLog(e.__str__())
            self.errors.append(
                "错误信息[%s]%s---发送Json数据%s请求%s接口失败!" % (tool.getTime(), self.testCaseID, json.dumps(data), url))

    # 抛出异常值
    def raiseError(self):
        if self.errors != []:
            assert 0, "\n".join(self.errors)
        else:
            pass

    def tearDown(self):
        self.errors = []
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
