__author__ = 'sophia'
import unittest
import sys
from interfaceTest import app
import datetime, time
from interfaceTest.Methods.BeopTools import BeopTools
import re

urls = "http://%s/get_realtimedata" % app.config['SERVERIP']
existId = [{"pointList": ["ShowOutdoor_Weather"], "proj": 293}]
url_temp = 'http://www.weatherzone.com.au/nsw/sydney/sydney'


class Service011(unittest.TestCase):
    testCaseID = 'Service011'
    projectName = "BeopService"
    buzName = '获取dashboard天气接口getWeatherData'
    start = 0.0
    now = 0
    startTime = ""
    errors = []
    suiteName = 'Service测试集'
    emails = app.config['WEATHER_EMAILS']

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def getTime(self):
        return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

    def Test(self):
        self.errors = []
        self.getExisted(urls)
        self.raiseError(self.errors)
        # BeopTools.send_email(self.emails, self.suiteName, self.errors, self.testCaseID)

    # 使用id获取到接口数据
    def getExisted(self,url):
        tool = BeopTools()
        try:
            for projId in existId:
                rv = None
                rv = self.getDiagnosisData(projId,url)
                temp = tool.getDataText(url=url_temp, timeout=10)
                pat = r'<span(.+)</span>'
                result = re.findall(pat, temp)
                rv_temp = ""
                if (result):
                    for weather in result:
                        if 'class="tempnow"' in weather:
                            rv_temp1 = weather.split(">")[1]
                            rv_temp = rv_temp1.split("&")[0]
                print(rv_temp)
                rv = eval(rv[0]['value'])
                if abs(float(rv['tmp']) - float(rv_temp)) <= 5:
                    print("projectId为%s返回结果中有数据为%s!温度值相差不大" % (projId, str(rv)))
                else:
                    self.errors.append(
                        "错误信息[%s]%s---访问%s接口,使用正确的projectId为%s利物浦项目返回温度%s,访问%s,返回温度%s" % (
                            tool.getTime(), self.testCaseID, url + str(projId), projId, str(rv['tmp']), url_temp,
                            str(rv_temp)))
        except Exception as e:
            print(e.__str__())
            self.writeLog(e.__str__())
            self.errors.append(
                "错误信息[%s]%s---getExisted method error:%s!" % (tool.getTime(), self.testCaseID, e.__str__()))

    # 访问接口
    def getDiagnosisData(self, projectId,url):
        rv = None
        tool = BeopTools()
        try:
            rv = tool.postData(url=url, data=projectId, t=30)
            # print(rv)
        except Exception as e:
            print(e.__str__())
            self.writeLog(e.__str__())
            self.errors.append(
                "错误信息[%s]%s---请求%s接口失败,未返回到数据!" % (tool.getTime(), self.testCaseID, url + str(projectId)))
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
        ##info.append([self.testCaseID, use, now])


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Service011('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
