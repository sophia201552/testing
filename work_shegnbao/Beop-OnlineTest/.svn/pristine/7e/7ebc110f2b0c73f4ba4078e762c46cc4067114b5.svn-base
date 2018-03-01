__author__ = 'woody'
import unittest
import sys
from interfaceTest.Methods.BeopTools import *
from interfaceTest import app



class Calc023(unittest.TestCase):
    testCaseID = 'Calc023'
    projectName = "Mytest"
    buzName = '查询原始点是否与算法点重复'
    errors = []
    projId = 49
    url = 'http://%s/set_realtimedata_from_site' % app.config['SERVICE_URL']
    TIMEOUT = 10

    #case初始化,获取开始时间以及时间戳,获取写入日志句柄logger
    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))
        self.a = BeopTools()



    def Test(self):
        self.errors = []
        self.getState(self.projId, self.projectName, 0)
        self.getState(self.projId, self.projectName, 1)
        self.a.raiseError(self.errors, self.testCaseID)


    def getState(self, projId, projName, value):
        data = {"projId": projId, "value": [value], "point": ["Pump402_PumpOnOff"]}
        rv = {}
        try:
            rv = self.a.postJsonToken(url=self.url, data=data, t=self.TIMEOUT)
        except Exception as e:
            self.errors.append('[%s]%s---' % (self.a.getTime(), self.testCaseID) + e.__str__())
            self.a.writeLogError(self.logger, e.__str__())
            self.a.raiseError(self.errors, self.testCaseID)
        if rv.get('state'):
            print('修改成功!')
            self.getRealTime(projId, 'Pump402_PumpOnOff',value)

        else:
            self.errors.append('错误信息[%s]%s---调用%s接口发送%s数据返回state不为1!' % (self.a.getTime(), self.testCaseID, self.url, json.dumps(data)))

    def getRealTime(self, projId, pointName, value):
        rv = None
        url = "http://%s/point_tool/getCloudPointTable/" % app.config['SERVERIP']
        json_data = {"projectId": projId, "currentPage": 1, "pageSize": 50, "pointType": 0,
                     "searchOrder": [["_id", -1]], "searchText": pointName}
        try:
            rv = self.a.postJsonToken(url=url, data=json_data, t=self.TIMEOUT)
        except Exception as e:
            print(e.__str__())
            self.errors.append("错误信息[%s]%s---接口: %s 项目id: %s搜索'%s'现场点未得到返回结果。" % (self.a.getTime(), self.testCaseID,url, projId, pointName))
        data = rv.get('data',{})
        points = data.get('pointTable',[{}])[0]
        if points:
            if value == int(points['pointValue']):
                print('测试通过!')
            else:
                self.errors.append("错误信息[%s]%s---%s开关泵状态更新失败,可能导致天津团泊--手动输入--开关页面中的开关泵功能失效，请检查。预期结果: %s, 实际结果:%s" % (BeopTools.getTime(), self.testCaseID, pointName, value, int(points['pointValue'])))
        else:
            self.errors.append("错误信息[%s]%s---接口: %s 项目id: %s搜索'%s'现场点未返回点表!" % (self.a.getTime(), self.testCaseID, url, projId, pointName))


    #用例结束后的清理工作,记录输出时间以及
    def tearDown(self):
        self.errors = []
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())





if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Calc023('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

