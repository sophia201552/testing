__author__ = 'woody'
import unittest
import sys, datetime
from interfaceTest.Methods.BeopTools import *
from interfaceTest import app

projectId = 121
url = "http://%s/site/v1.0/getRealtimeOutputByProjId/" % app.config['SERVICE_URL'] + str(121)

class Algorithm001(unittest.TestCase):
    testCaseID = 'Algorithm001'
    projectName = "智能传感"
    buzName = '温控开关指令值最近停留时间'


    #case初始化,获取开始时间以及时间戳,获取写入日志句柄logger
    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))



    def Test(self):

        '测试用例主函数, 首先清空errors错误信息数组,然后获取所有计算点表，然后判断其中是否包含None的点值，如有则添加进错误信息，最后抛出异常'
        #print("%shello%s" % (RED, DEFAULTCOLOR))
        self.errors = []
        if self.getMode():
            pass
        else:
            points = self.getPointsInfo()
            self.checkPoint(points)
        BeopTools.raiseError(self.errors, self.testCaseID)

    def getMode(self):
        rv = {}
        url = 'http://114.55.252.126:5001/appTemp/room/getMode/1458b1230011458642502209'
        rv = BeopTools().getData(url=url,timeout=10)
        if str(rv.get('mode')) == '10':
            print("当前为手动模式!")
            return True
        else:
            print('当前为自动模式!')
            return False


    def getPointsInfo(self):
        a = BeopTools()
        rv = {}
        try:
            rv = a.tokenGet(url=url, timeout=10)
        except Exception as e:
            print(self.testCaseID, e.__str__())
            a.writeLogError(self.logger, e.__str__())
            if 'time out' in e.__str__():
                self.errors.append("错误信息[%s]%s---访问%s接口超时!" % (a.getTime(), self.testCaseID, url))
            else:
                self.errors.append("错误信息[%s]%s---访问%s接口失败!" % (a.getTime(), self.testCaseID, url))
            a.raiseError(self.errors, self.testCaseID)
        return rv

    def checkPoint(self, points):
        nowTime = datetime.datetime.now()
        testTime = datetime.datetime.strftime(nowTime,"%Y-%m-%d %H:%M:%S")
        for point in points:
            pointName = point.get('pointname')
            pointType = point.get('pointvalue')
            pointTime = point.get('time')
            if self.checkTime(nowTime, pointTime):
                BeopTools.writeLogInfo(self.logger, "%s---项目id: %s, 项目名称: %s, 点名: %s 数据正常!更新时间:%s " % (self.testCaseID, projectId, self.projectName, pointName, pointTime))
            else:
                print(BeopTools.getTime())
                self.errors.append("错误信息[%s]%s---项目id: %s, 项目名称: %s, 点名: %s   数据异常,超过30分钟未更新! 测试时间:%s 更新时间:%s " % (BeopTools.getTime(), self.testCaseID, projectId, self.projectName, pointName, testTime, pointTime))


    def checkTime(self, nowTime, timeStr):
        delay = (nowTime - datetime.datetime.strptime(timeStr, "%Y-%m-%d %H:%M:%S")).seconds
        if delay > 1800:
            return False
        else:
            return True

    #用例结束后的清理工作,记录输出时间以及
    def tearDown(self):
        self.errors = []
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())





if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Algorithm001('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

