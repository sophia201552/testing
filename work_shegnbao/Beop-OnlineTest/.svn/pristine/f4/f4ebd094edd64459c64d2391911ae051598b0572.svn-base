__author__ = 'woody'
import json
import time
import datetime
import unittest
from interfaceTest import app
from interfaceTest.Methods.BeopTools import BeopTools

errors = []
url = "http://%s/cloudPoint/onlinetest" % app.config['EXPERT_CONTAINER_URL']

class Calc004(unittest.TestCase):
    testCaseID = 'Calc004'
    projectName = "上海中芯国际"
    buzName = '数据管理--API01-13'
    start = 0.0
    now = 0
    startTime = ""


    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())


    def Test(self):
        global errors
        expected_result = self.getHistoryData('OutdoorTdbin')
        self.check_data(expected_result)
        self.check_avg_data(expected_result)
        self.calc_max(['OutdoorTdbin',"OutdoorWetTemp"])
        self.calc_min(['OutdoorTdbin',"OutdoorWetTemp"])
        self.raiseError(errors)






    #get_avg_data_of_last_hour
    def check_data(self,expected_result):
        global errors
        last_hour_data_result = self.calc("get_history_data_of_last_hour(1,'OutdoorTdbin')")
        expected_result1 = expected_result[0]
        expected_result2 = expected_result[1]
        if self.compare(last_hour_data_result,expected_result1) or self.compare(last_hour_data_result,expected_result2):
            print("通过")
        else:
            errors.append("错误信息get_history_data_of_last_hour(1,'OutdoorTdbin')返回结果与取到的历史数据结果不一致!")

    def check_avg_data(self,expected_result):
        global errors
        get_avg = self.calc("get_avg_data_of_last_hour(1,'OutdoorTdbin')")
        expected_result1 = expected_result[0]
        expected_result2 = expected_result[1]
        #avg_a = self.get_avg_data_of_list(last_hour_data_result)
        avg_b1 = self.get_avg_data_of_list(expected_result1)
        avg_b2 = self.get_avg_data_of_list(expected_result2)
        if float(get_avg) == avg_b1 or float(get_avg) == avg_b2:
            print("get_avg_data_of_last_hour(1,'OutdoorTdbin')公式计算正常!")
        else:
            errors.append("错误信息get_avg_data_of_last_hour(1,'OutdoorTdbin')返回结果与计算出的结果不一致!")

    #get_status_timeratio_of_last_hour
    def check_status_timeratio(self):
        global errors
        pass


    #calc_power_by_run
    def calc_power(self):
        global errors
        value = self.calc("calc_power_by_run(1,'',A float number)")
        pass

    #calc_max_in_points
    def calc_max(self,pointList):
        global errors
        points = json.dumps(pointList)
        value = self.calc("calc_max_in_points(1,%s)" % points)
        c = self.check_max(pointList)
        if c == value:
            print("calc_max_in_points公式计算出的点与预期结果相同.")
        else:
            errors.append("错误信息calc_max_in_points公式计算出的点与预期结果不同,应为%f,实为%f." % (c, value))


    def calc_realtime_data(self,point):
        return self.calc("get_data(1,'%s')" % point)


    def check_max(self,pointList):
        return max([self.calc_realtime_data(x) for x in pointList])



    #calc_min_in_points
    def calc_min(self,pointList):
        global errors
        points = json.dumps(pointList)
        value = self.calc("calc_min_in_points(1,%s)" % points)
        c = self.check_min(pointList)
        if c == value:
            print("calc_min_in_points公式计算出的点与预期结果相同.")
        else:
            errors.append("错误信息calc_min_in_points公式计算出的点与预期结果不同,应为%f,实为%f." % (c, value))


    def check_min(self,pointList):
        return min([self.calc_realtime_data(x) for x in pointList])







    def compare(self,L1,L2):
        m = True
        if len(L1) == len(L2):
            for i in range(len(L1)):
                if float(L1[i]) == float(L2[i]):
                    pass
                else:
                    #print(L1[i],L2[i])
                    m = False
        return m

    #获取指定点位上个小时的值
    def calc(self,calc):
        global errors
        data = {
            'content':calc,
            'projId':'1',
            'pointName':'woodyTest',
            'moduleName':'calcpoint_1_woodyTest',
            'writeToReal':'1'
        }
        a = BeopTools()
        try:
            result = a.postForm(url=url,data=data,t=2000)
        except Exception as e:
            print(e.__str__())
            assert 0,"错误信息造访Expert Container失败!"

        if result.get("value",False):
            rv = result['value']
            print(rv)
            if rv == "null":
                errors.append("错误信息计算点公式%s返回null!" % calc)
        else:
            errors.append("错误信息计算点公式%s返回结果没有value!返回结果为%s!" % (calc, json.dumps(result)))
        return rv

    def getHistoryData(self,point):

        #得到该点最近更新时间
        a = BeopTools()
        realTimeUrl = "http://%s/get_realtimedata_time" % serverip
        pointList = [point]
        data = {'proj':1,"pointList":pointList}
        try:
            t = a.postData(url=realTimeUrl,data=data,t=10)
        except Exception as e:
            assert 0,"错误信息读取%s接口失败!" % realTimeUrl
        updateTime = t.get(point)
        minute = updateTime[14:16]
        oversize = int(minute) % 5
        if oversize:
            minute = int(minute) - oversize
            if minute < 10:
                minute = "0" + str(minute)
            else:
                minute = str(minute)
        else:
            pass
        m5_now = updateTime.split(":")[0] + ":" + minute + ":" + "00"
        delta = datetime.datetime.strptime(m5_now,'%Y-%m-%d %H:%M:%S')
        m5_now2 = delta + datetime.timedelta(minutes=5)
        m5_his = delta - datetime.timedelta(hours=1)
        m5_his =  datetime.datetime.strftime(m5_his,'%Y-%m-%d %H:%M:%S')
        m5_his2 = m5_now2 - datetime.timedelta(hours=1)
        m5_his2 =  datetime.datetime.strftime(m5_his2,'%Y-%m-%d %H:%M:%S')
        m5_now2 =  datetime.datetime.strftime(m5_now2,'%Y-%m-%d %H:%M:%S')

        data = dict(projectId=1, timeStart=m5_his, timeEnd=m5_now, timeFormat='m5', pointList=pointList)
        data2 = dict(projectId=1, timeStart=m5_his2, timeEnd=m5_now2, timeFormat='m5', pointList=pointList)
        getHisUrl = 'http://beop.rnbtech.com.hk/get_history_data_padded'
        value = a.postData(url=getHisUrl,data=data,t=10)
        value2 = a.postData(url=getHisUrl,data=data2,t=10)
        #找到对应的时间
        v = []
        v2 = []
        values = value[0]['history']
        values2 = value2[0]['history']
        for i in values:
            v.append(i.get('value'))

        for i in values2:
            v2.append(i.get('value'))

        return (v,v2)


    def get_avg_data_of_list(self,L):
        L = [float(x) for x in L]
        #y = sum(L)
        #z = len(L)
        return sum(L) / len(L)


    def raiseError(self,error):
        if error != []:
            #print("\n".join(error))
            assert 0,"\n".join(error)
        else:
            pass



    def tearDown(self):
        global errors
        errors = []
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        #info.append([self.testCaseID, use, now])




if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Calc004('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
    #unittest.main()
