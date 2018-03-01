__author__ = 'woody'
import unittest
import sys, datetime
from interfaceTest.Methods.BeopTools import *
from interfaceTest import app

projectId = 121
url = "http://%s/admin/dataPointManager/search/" % app.config['SERVERIP']
data = {
    "projectId":121,"current_page":1,"page_size":"100",
     "text":"jrgc sensor","isAdvance":False,"order":None,"isRemark":False,
     "flag":0

}

calc_data = {"projectId":121,"currentPage":1,
             "pageSize":500,"pointType":2,
             "searchOrder":[["_id",-1]],
             "searchText":"jrgc","t_time":""
            }

calc_url = "http://%s/point_tool/getCloudPointTable/" % app.config['SERVERIP']

TIMEOUT = 10
STAND_LINE = 20
MESSAGE_URL = 'http://120.26.141.37:5000/mq/mqSendTask'
MESSAGE_INFO = str({'type':'message', 'message':'尊敬的用户您好，金融广场传感器温度数据30分钟内未更新，不更新点个数大于20个，问题分析为现场硬件问题，感谢使用BeOP智慧服务。【BeOP智慧服务】',
      'phone':['18516600716','13661531840','18512136510','15821050813'], 'freq':96000})
MESSAGE_DATA = {'name':'message', 'value':MESSAGE_INFO}


MESSAGE_INFO_OFFLINE = str({'type':'message', 'message':'尊敬的用户您好，金融广场温度数据30分钟内未更新，现场数据掉线，问题分析为现场硬件问题，感谢使用BeOP智慧服务。【BeOP智慧服务】',
      'phone':['18516600716','13661531840','18512136510','15821050813'], 'freq':96000})

MESSAGE_DATA_OFFLINE = {'name':'message', 'value':MESSAGE_INFO_OFFLINE}


MESSAGE_BACKEND_INFO = str({'type':'message', 'message':'尊敬的用户您好，金融广场计算点数据30分钟内未更新，问题分析为研发后台问题，感谢使用BeOP智慧服务。【BeOP智慧服务】',
      'phone':['18516600716','15821050813','13916955112','17000060357'], 'freq':96000})
MESSAGE_BACKEND = {'name':'message', 'value':MESSAGE_BACKEND_INFO}




class Algorithm002(unittest.TestCase):
    testCaseID = 'Algorithm002'
    projectName = "金融广场"
    buzName = ''
    errors = []


    #case初始化,获取开始时间以及时间戳,获取写入日志句柄logger
    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        c = sys.path[0]
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def isWeekend(self):
        #获取今天是星期几
        week = datetime.datetime.now().weekday()
        if week == 5 or week == 6:
            #为周末
            return True
        else:
            return False


    def Test(self):
        status = (datetime.datetime.now().hour, 0)
        while 1:
            a = BeopTools()
            rv = {}
            self.errors = []
            online = self.checkProjOnline()
            points = self.getPointsInfo(url, data)
            isWeekend = self.isWeekend()
            offlinePoints = self.checkPoint(points)

            #后台计算点
            calcPoints = self.getPointsInfo(calc_url, calc_data)
            offlineCalcPoints = self.checkCalcPoint(calcPoints)

            if not isWeekend:
            	if datetime.datetime.now().hour > 7 and datetime.datetime.now().hour <18:
	                if online:
	                    if offlinePoints >= 20:
	                        if self.check(status):
	                            self.sendMessage(url=MESSAGE_URL, data=MESSAGE_DATA, t=TIMEOUT)
	                            status = (datetime.datetime.now().hour, 1)
	                    else:
	                        if offlineCalcPoints > 0:
	                            if self.check(status):
	                                self.sendMessage(url=MESSAGE_URL, data=MESSAGE_BACKEND, t=TIMEOUT)
	                                status = (datetime.datetime.now().hour, 1)
	                else:
	                    if self.check(status):
	                        self.sendMessage(url=MESSAGE_URL, data=MESSAGE_DATA_OFFLINE, t=TIMEOUT)
	                        status = (datetime.datetime.now().hour, 1)
            time.sleep(300)

    @classmethod
    def check(self, status):
        if status[0] != datetime.datetime.now().hour or status[1] != 1:
            return True
        else:
            return False




    def getPointsInfo(self, test_url, test_data):
        a = BeopTools()
        rv = {}
        try:
            rv = a.postJsonToken(url=test_url, data=test_data, t=TIMEOUT)
        except Exception as e:
            print(self.testCaseID, e.__str__())
            a.writeLogError(self.logger, e.__str__())
            self.errors.append("错误信息[%s]%s---访问%s接口失败!" % (a.getTime(), self.testCaseID, url))
            a.raiseError(self.errors, self.testCaseID)
        return rv

    def sendMessage(self, url, data, t):
        a = BeopTools()
        a.writeLogError(self.logger, "发送短信!")
        rv = {}
        try:
            rv = a.postJsonToken(url=url, data=data, t=t)
            a.writeLogError(self.logger, "发送短信详情为%s" % (json.dumps(data, ensure_ascii=False)))
        except Exception as e:
            print(self.testCaseID, e.__str__())
            a.writeLogError(self.logger, e.__str__())
        if rv.get('error') == 'ok':
            a.writeLogError(self.logger, '短信提醒成功!')
        else:
            self.errors.append("错误信息[%s]%s---项目名:%s 发送短信失败!" % (a.getTime(), self.testCaseID, self.projectName))



    def checkPoint(self, points):
        offlinePoint = 0
        pointsInfo = points.get('list',[])
        nowTime = datetime.datetime.now()
        testTime = datetime.datetime.strftime(nowTime,"%Y-%m-%d %H:%M:%S")
        for point in pointsInfo:
            pointName = point.get('pointname')
            #pointType = point.get('flag')
            pointTime = point.get('time')
            if self.checkTime(nowTime, pointTime):
                BeopTools.writeLogError(self.logger, "%s---项目id: %s, 项目名称:%s, 点名:%s 数据正常!更新时间:%s 测试时间:%s" % (self.testCaseID, projectId, self.projectName, pointName, pointTime, testTime))
            else:
                #print(BeopTools.getTime())
                BeopTools.writeLogError(self.logger, "%s---项目id: %s, 项目名称:%s, 点名:%s 数据不正常!更新时间:%s 测试时间:%s" % (self.testCaseID, projectId, self.projectName, pointName, pointTime, testTime))
                #self.errors.append("错误信息[%s]%s---项目id: %s, 项目名称:%s, 点名:%s 数据异常,超过10分钟未更新! 测试时间:%s 更新时间:%s " % (BeopTools.getTime(), self.testCaseID, projectId, self.projectName, pointName, testTime, pointTime))
                offlinePoint += 1
        return offlinePoint

    def checkCalcPoint(self, points):
        offline = 0
        pointTable = points['data']['pointTable']
        nowTime = datetime.datetime.now()
        testTime = datetime.datetime.strftime(nowTime,"%Y-%m-%d %H:%M:%S")
        try:
            for point in pointTable:
                pointName = point['value']
                pointTime = point['pointTime']
                if self.checkTime(nowTime, pointTime):
                    BeopTools.writeLogError(self.logger, "%s---项目id: %s, 项目名称:%s, 点名:%s 计算点数据正常!更新时间:%s 测试时间:%s" % (self.testCaseID, projectId, self.projectName, pointName, pointTime, testTime))
                else:
                    BeopTools.writeLogError(self.logger, "%s---项目id: %s, 项目名称:%s, 点名:%s 计算点数据不正常!更新时间:%s 测试时间:%s" % (self.testCaseID, projectId, self.projectName, pointName, pointTime, testTime))
                    offline += 1
        except Exception as e:
            print(e.__str__())
        return offline




    def checkProjOnline(self):
        test_data = {
            "projectId":121,"current_page":1,"page_size":"100",
             "text":"jrgc","isAdvance":False,"order":None,"isRemark":False,
             "flag":0

        }
        a = BeopTools()
        rv = {}
        count = 0
        try:
            rv = a.postJsonToken(url=url, data=test_data, t=TIMEOUT)
        except Exception as e:
            print(self.testCaseID, e.__str__())
            a.writeLogError(self.logger, e.__str__())
            self.errors.append("错误信息[%s]%s---访问%s接口失败!" % (a.getTime(), self.testCaseID, url))
            a.raiseError(self.errors, self.testCaseID)
        pointsList = rv.get('list')
        nowTime = datetime.datetime.now()
        testTime = datetime.datetime.strftime(nowTime,"%Y-%m-%d %H:%M:%S")
        for point in pointsList:
            pointName = point.get('pointname')
            #pointType = point.get('flag')
            pointTime = point.get('time')
            if self.checkTime(nowTime, pointTime):
                pass
                #BeopTools.writeLogInfo(self.logger, "%s---项目id: %s, 项目名称:%s, 点名:%s 数据正常!更新时间:%s 测试时间:%s" % (self.testCaseID, projectId, self.projectName, pointName, pointTime, testTime))
            else:
                count += 1
                a.writeLogError(self.logger, "[%s]%s---项目id: %s, 项目名称:%s, 点名:%s 数据异常,超过30分钟未更新! 测试时间:%s 更新时间:%s " % (BeopTools.getTime(), self.testCaseID, projectId, self.projectName, pointName, testTime, pointTime))

        if count > 50:
            print("金融广场现场掉线!")
            a.writeLogError(self.logger, "[%s]%s---金融广场掉线。" % (a.getTime(), self.testCaseID))
            return False
        else:
            return True

    def checkTime(self, nowTime, timeStr):
        if len(timeStr) < 19:
            timeGet = timeStr + ':00'
        else:
            timeGet = timeStr
        delay = abs(nowTime - datetime.datetime.strptime(timeGet, "%Y-%m-%d %H:%M:%S")).seconds
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
    suite.addTest(Algorithm002('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)


