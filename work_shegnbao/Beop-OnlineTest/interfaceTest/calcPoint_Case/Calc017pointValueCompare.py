__author__ = 'woody'
import unittest
from interfaceTest import app
import datetime as date
from interfaceTest.Methods.BeopTools import *
#项目ID,点名,项目名,dtu名称,引擎名称,是否判断掉线时间,持续时间


url = "http://%s/get_history_data_padded_reduce" % app.config['SERVERIP']
projectId = 179
pointName = "Ch001_ChPower_prs"



class Calc017(unittest.TestCase):
    testCaseID = 'Calc017'
    projectName = "嘉民"
    buzName = 'm5,h1,d1历史数据最后一条是否相等'
    start = 0.0
    now = ""
    startTime = ""
    errors = []

    def setUp(self):
        self.start = date.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))


    def Test(self):
        self.errors = []
        timeShaft_m5 = self.getM5Time
        timeShaft_h1 = self.getH1Time
        timeShaft_d1 = self.getD1Time
        timeShaft_M1 = self.getMonthTime
        timeOrig = self.getLastHistoryData(timeShaft_m5[0], timeShaft_m5[1], 'm5', projectId, 'Ch002_ChEnterCondTemp')
        if timeOrig is not None:
            print('现场数据没掉线!')
            m5_get_data_time = BeopTools.getTime()
            m5_last_data = self.getLastHistoryData(timeShaft_m5[0], timeShaft_m5[1], 'm5')
            h1_get_data_time = BeopTools.getTime()
            h1_last_data = self.getLastHistoryData(timeShaft_h1[0], timeShaft_h1[1], 'h1')
            d1_get_data_time = BeopTools.getTime()
            d1_last_data = self.getLastHistoryData(timeShaft_d1[0], timeShaft_d1[1], 'd1')
            M1_get_data_time = BeopTools.getTime()
            M1_last_data = self.getLastHistoryData(timeShaft_M1[0], timeShaft_M1[1], 'M1')
            if m5_last_data == h1_last_data == m5_last_data == d1_last_data == M1_last_data:
                print("[%s]%s---%s项目 %s点 m5,h1,d1,M1表中最后存储的历史数据一致!   \nm5数据读取时间: %s m5时间段 :[%s~%s] ,返回点值数组最后一个数据: %s   \nh1数据读取时间: %s h1时间段 :[%s~%s] ,返回点值数组最后一个数据: %s   \nd1数据读取时间: %s d1时间段 :[%s~%s] ,返回点值数组最后一个数据: %s   \nM1数据读取时间: %s M1时间段 :[%s~%s] ,返回点值数组最后一个数据: %s"

                                   % (BeopTools.getTime(), self.testCaseID, self.projectName, pointName, m5_get_data_time, timeShaft_m5[0], timeShaft_m5[1], m5_last_data, h1_get_data_time, timeShaft_h1[0], timeShaft_h1[1], h1_last_data, d1_get_data_time, timeShaft_d1[0], timeShaft_d1[1], d1_last_data,  M1_get_data_time, timeShaft_M1[0], timeShaft_M1[1], M1_last_data))
            else:
                BeopTools.writeLogError(self.logger, "错误信息[%s]%s---%s项目 %s点 m5,h1,d1,M1表中最后存储的历史数据不一致!   m5时间:%s,点值:%s   h1时间:%s,点值:%s   d1时间:%s,点值:%s   M1时间:%s,点值:%s  " % (BeopTools.getTime(), self.testCaseID, self.projectName, pointName, timeShaft_m5[1], m5_last_data, timeShaft_h1[1], h1_last_data, timeShaft_d1[1], d1_last_data, timeShaft_M1[1], M1_last_data))
                self.errors.append("错误信息[%s]%s---%s项目 %s点 m5,h1,d1,M1表中最后存储的历史数据不一致!   \nm5数据读取时间: %s m5时间段 :[%s~%s] ,返回点值数组最后一个数据: %s   \nh1数据读取时间: %s h1时间段 :[%s~%s] ,返回点值数组最后一个数据: %s   \nd1数据读取时间: %s d1时间段 :[%s~%s] ,返回点值数组最后一个数据: %s   \nM1数据读取时间: %s M1时间段 :[%s~%s] ,返回点值数组最后一个数据: %s"

                                   % (BeopTools.getTime(), self.testCaseID, self.projectName, pointName, m5_get_data_time, timeShaft_m5[0], timeShaft_m5[1], m5_last_data, h1_get_data_time, timeShaft_h1[0], timeShaft_h1[1], h1_last_data, d1_get_data_time, timeShaft_d1[0], timeShaft_d1[1], d1_last_data,  M1_get_data_time, timeShaft_M1[0], timeShaft_M1[1], M1_last_data))
        else:
            self.errors.append('错误信息[%s]%s---%s项目现场数据未更新，不检测其m5,h1,d1,M1表中最后存储的历史数据是否一致!' % (BeopTools.getTime(), self.testCaseID, self.projectName))
        BeopTools.raiseError(self.errors, self.testCaseID)

    @property
    def getH1Time(self):
        timeNowStr = time.strftime("%Y-%m-%d %H:00:00", time.localtime())
        timeNowStamp = date.datetime.strptime(timeNowStr, "%Y-%m-%d %H:%M:%S")
        timeStart = timeNowStamp - date.timedelta(seconds=3600)
        timeStartStr = date.datetime.strftime(timeStart, "%Y-%m-%d %H:%M:%S")
        #timeStart = date.datetime.now() - date.timedelta(seconds=600)
        return (timeStartStr, timeNowStr)


    @property
    def getM5Time(self):
        timeNowStr = time.strftime("%Y-%m-%d %H:%M:00", time.localtime())
        minute = timeNowStr[:-3]
        m5_min = minute[-1]
        if 0 < int(m5_min) < 5:
            m5_end = minute[:-1] + "0:00"
        elif 5 < int(m5_min) < 10:
            m5_end = minute[:-1] + "5:00"
        else:
            m5_end = minute + ":00"



        timeNowStamp = date.datetime.strptime(m5_end, "%Y-%m-%d %H:%M:%S")
        timeStart = timeNowStamp - date.timedelta(seconds=900)
        timeStartStr = date.datetime.strftime(timeStart, "%Y-%m-%d %H:%M:%S")
        #timeStart = date.datetime.now() - date.timedelta(seconds=600)
        return (timeStartStr, m5_end)

    @property
    def getD1Time(self):
        timeNowStr = time.strftime("%Y-%m-%d 00:00:00", time.localtime())
        timeNowStamp = date.datetime.strptime(timeNowStr, "%Y-%m-%d %H:%M:%S")
        timeStart = timeNowStamp - date.timedelta(days=1)
        timeStartStr = date.datetime.strftime(timeStart, "%Y-%m-%d %H:%M:%S")
        #timeStart = date.datetime.now() - date.timedelta(seconds=600)
        return (timeStartStr, timeNowStr)

    @property
    def getMonthTime(self):
        timeNowStr = time.strftime("%Y-%m-01 00:00:00", time.localtime())
        year = int(timeNowStr[0:4])
        month = int(timeNowStr[5:7])
        if month == 1:
            year -= 1
            month = 12
            timeStart = "%s-12-01 00:00:00" % str(year)
        elif 1 < month <= 10:
            month = month - 1
            timeStart = "%s-0%s-01 00:00:00" % (str(year), str(month))
        else:
            timeStart = "%s-%s-01 00:00:00" % (str(year), str(month))

        return (timeStart, timeNowStr)

    def getLastHistoryData(self, timeStart, timeEnd, timeFormat, projId=projectId, ptName=pointName):
        data = {
                "projectId":projId, "pointList":[ptName],
                "timeStart":timeStart,
                "timeEnd":timeEnd,
                "timeFormat":timeFormat
                }
        rt = []
        a = BeopTools()
        try:
            rt = a.postJsonToken(url=url, data=data, t=10)
        except Exception as e:
            print(e.__str__())
            a.writeLogError(self.logger, e.__str__())
            self.errors.append("错误信息[%s]%s---发送json数据:%s 访问接口:%s失败!" % (a.getTime(), self.testCaseID, json.dumps(data), url))

        values_dict = rt.get('data',{})
        values = values_dict.get(ptName, [])


        if isinstance(values, list) and values:
            return values[-1]
        else:
            self.errors.append("错误信息[%s]%s---发送json数据:%s 访问接口:%s返回的值为%s!" % (a.getTime(), self.testCaseID, json.dumps(data), url, json.dumps(rt)))
            return None



    def tearDown(self):
        use1 = str((date.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        ##info.append([self.testCaseID, use, now])




if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Calc017('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
    #unittest.main()
