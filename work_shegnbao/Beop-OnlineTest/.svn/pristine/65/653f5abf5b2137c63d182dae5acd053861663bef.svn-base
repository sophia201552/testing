__author__ = 'woody'

import unittest, json

import datetime, time
import sys
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
#项目ID,点名,项目名,dtu名称,引擎名称,是否判断掉线时间,持续时间


#ip = 'http://192.168.1.208:5000'
#url = ip + '/site/v1.0/sendHistoryDataToMongo'
ip = "http://%s" % app.config['SERVICE_URL']
url = ip + "/site/v1.0/sendHistoryDataToMongo"




class Service007(unittest.TestCase):
    testCaseID = 'Service007'
    projectName = "BeopService"
    buzName = '发送历史数据到mongo功能/site/v1.0/sendHistoryDataToMongo'
    errors = []

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))


    def Test(self):
        self.errors = []
        self.sendData(11)
        self.checkHistoryData(11)
        BeopTools.raiseError(self.errors, self.testCaseID)


    def sendData(self, value):
        rt = False
        a = BeopTools()
        test_data = {
                        "dtuName": "panda",
                        "protocol":"beop",
                        "pointNameList":['ADT'],
                        "pointValueList":[value],
                        "time":"2016-07-19 00:00:00",
                        "timeFormat":"m1",
                        "length":1,
                    }

        try:
            rt = a.postJsonToken(url=url, data=test_data, t=10)
        except Exception as e:
            print(e.__str__())
            a.writeLogError(self.logger, e.__str__())
            self.errors.append("错误信息[%s]%s---发送json数据:%s 访问接口:%s失败!" % (a.getTime(), self.testCaseID, json.dumps(test_data), url))
        print(rt)


    def checkHistoryData(self, value):
        url = ip + "/get_history_data_padded"
        data = {
                "projectId":3,"pointList":["ADT"],
                "timeStart":"2016-07-19 00:00:00",
                "timeEnd":"2016-07-19 00:00:00",
                "timeFormat":"m1"
                }
        rt = []
        a = BeopTools()
        try:
            rt = a.postJsonToken(url=url, data=data, t=10)
        except Exception as e:
            print(e.__str__())
            a.writeLogError(self.logger, e.__str__())
            self.errors.append("错误信息[%s]%s---发送json数据:%s 访问接口:%s失败!" % (a.getTime(), self.testCaseID, json.dumps(data), url))
        if rt == [value]:
            print("sendDataToMongo验证成功!")
        else:
            self.errors.append("错误信息[%s]%s---发送数据到mongo之后没有获取到对应的历史数据!点名:ADT 项目:南京熊猫电子" % (a.getTime(), self.testCaseID))
        #print(rt)


    def tearDown(self):
        self.errors = []
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())





if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Service007('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

