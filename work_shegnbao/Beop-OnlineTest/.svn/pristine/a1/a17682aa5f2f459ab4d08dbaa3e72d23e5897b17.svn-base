__author__ = 'sophia'
import unittest
import sys
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import time, datetime

url = "http://%s/diagnosis/equipment/get/" % app.config['SERVICE_URL']
existId = [72, 76, 71]
wrongId = ['haha', -1, 100000000, True, None]


class Service013(unittest.TestCase):
    testCaseID = 'Service013'
    projectName = "BeopService"
    buzName = '获取诊断equipment接口diagnosis/equipment/get/'
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
        self.getExisted()
        self.getWrong()
        self.raiseError(self.errors)

    # 使用正确的id获取到接口数据
    def getExisted(self):
        tool = BeopTools()
        for projId in existId:
            rv = self.getDiagnosisData(projId)
            try:
                if rv!=[]:
                    length = len(rv)
                    print("projectId为%s返回结果中有数据!" % projId)
                    print("项目id:%s 返回的数据个数为%d." % (projId, length))
                else:
                    self.errors.append(
                        "错误信息[%s]%s---访问%s接口,使用正确的projectId为%s返回结果无数据结果为%s!" % (tool.getTime(),self.testCaseID, url + str(projId), projId,str(rv)))
            except Exception as e:
                print(e.__str__())
                self.writeLog(e.__str__())
                self.errors.append("错误信息[%s]%s---请求%s接口,返回的数据出错可能为空.!" % (tool.getTime(),self.testCaseID, url))

    # 使用错误的id获取到接口的数据
    def getWrong(self):
        tool = BeopTools()
        for projId in wrongId:
            rv = self.getDiagnosisData(projId)
            try:
                if rv == []:
                    length = len(rv)
                    print("projectId为%s使用错误的id返回结果中无数据!" % projId)
                    print("项目id:%s 返回的数据个数为%d." % (projId, length))
                else:
                    self.errors.append(
                        "错误信息[%s]%s---访问%s接口,使用错误的projectId为%s返回结果有数据,结果为%s!" % (tool.getTime(),self.testCaseID, url + str(projId), projId,str(rv)))
            except Exception as e:
                print(e.__str__())
                self.writeLog(e.__str__())
                self.errors.append("错误信息[%s]%s---请求%s接口,返回的数据出错.!" % (tool.getTime(),self.testCaseID, url))

    # 访问接口
    def getDiagnosisData(self, projectId):
        rv = None
        tool = BeopTools()
        try:
            rv = tool.tokenGet(url=url + str(projectId), timeout=45)
            # print(rv)
        except Exception as e:
            print(e.__str__())
            self.writeLog(e.__str__())
            self.errors.append("错误信息[%s]%s---请求%s接口失败,未返回到数据!" % (tool.getTime(),self.testCaseID,url))
        return rv

    # 写log
    def writeLog(self, text):
        self.logger.info('[%s]---' % time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) + '' + text)

    # 抛出异常函数
    def raiseError(self, error):
        if error != []:
            assert 0, "\n".join(error)
        else:
            pass

    def tearDown(self):
        self.errors = []
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

