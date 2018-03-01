__author__ = 'woody'
import unittest
import sys
from interfaceTest.Methods.BeopTools import *
from interfaceTest import app



class Calc022(unittest.TestCase):
    testCaseID = 'Calc022'
    projectName = "天津光合谷、天津团泊、智能传感"
    buzName = '查询原始点是否与算法点重复'
    errors = []
    test_data = (
        (200,'天津团泊'),
        (201,'天津光合谷'),
        (121,'智能传感')
    )
    org_url = 'http://%s/admin/dataPointManager/search/' % app.config['SERVERIP']
    alg_url = 'http://%s/point_tool/getCloudPointTable/' % app.config['SERVERIP']
    TIMEOUT = 20

    #case初始化,获取开始时间以及时间戳,获取写入日志句柄logger
    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))
        self.a = BeopTools()



    def Test(self):
        self.errors = []
        samePoints = []
        for item in self.test_data:
            algPoints = self.getAlgPoints(item[0], item[1])
            orgPoints = self.getOrigPointsName(item[0], item[1])
            for point in algPoints:
                if point in orgPoints:
                    self.errors.append('错误信息[%s]%s---%s项目中虚拟点%s与原始点重复!' % (self.a.getTime(), self.testCaseID, item[1], point))
        BeopTools.raiseError(self.errors, self.testCaseID)


    def getOrigPointsName(self, projId, projName):
        data = {"projectId":projId,"current_page":1,"page_size":"50000","text":"","isAdvance":False,"order":None,"flag":0}
        points = []
        rv = {}
        try:
            rv = self.a.postJsonToken(url=self.org_url, data=data, t=self.TIMEOUT)
        except Exception as e:
            self.errors.append('[%s]%s---' % (self.a.getTime(), self.testCaseID) + e.__str__())
            self.a.writeLogError(self.logger, e.__str__())
            self.a.raiseError(self.errors, self.testCaseID)
        try:
            pointList = rv.get('list',[])
            if pointList:
                for point in pointList:
                    points.append(point.get('pointname'))
            else:
                assert 0, "错误信息[%s]%s---未获取到%s的原始数据!" % (self.a.getTime(), self.testCaseID, projName)
        except Exception as e:
            self.errors.append(e.__str__())
        return points

    def getAlgPoints(self, projId, projName):
        data = {"projectId": projId, "currentPage": 1, "pageSize": 50000, "pointType": 1, "searchOrder": [["_id", -1]],
         "searchText": "", "t_time": ""}
        rv = {}
        points = []

        try:
            rv = self.a.postJsonToken(url=self.alg_url, data=data, t=self.TIMEOUT)
        except Exception as e:
            self.errors.append('[%s]%s---' % (self.a.getTime(), self.testCaseID) + e.__str__())
            self.a.writeLogError(self.logger, e.__str__())
            self.a.raiseError(self.errors, self.testCaseID)
        try:
            pointTable = rv['data']['pointTable']
            if pointTable:
                for point in pointTable:
                    points.append(point.get('value'))
        except Exception as e:
            self.errors.append('错误信息[%s]%s---' % (self.a.getTime(), self.testCaseID) + e.__str__())
        return points




    #用例结束后的清理工作,记录输出时间以及
    def tearDown(self):
        self.errors = []
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())





if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Calc022('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

