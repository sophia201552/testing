__author__ = 'sophia'
import unittest
import datetime, time
import sys
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app

url_history='http://%s/v1/data/get_history_at_time' % app.config['SERVERIP']
class Service016(unittest.TestCase):
    testCaseID = 'Service016'
    projectName = "BeopService"
    buzName = '获取某个时间点的历史数据接口v1/data/get_history_at_time'
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
        self.getHistoryAtTime()
        self.raiseError(self.errors)

    def getHistoryAtTime(self):
        #验证周期为h1返回值该时间点有值
        self.check('OutdoorTdbin','2016-06-30 11:00:00',True)
        # 验证周期为m5返回值该时间点有值
        self.check('OutdoorTdbin','2016-06-30 11:10:00',True)
        #验证周期为d1返回值该时间点有值
        self.check('OutdoorTdbin', '2016-06-30 00:00:00',True)
        # 验证周期为d1,bSearchRecent为False,该时间点没有历史数据
        #check('OutdoorTdbin', '2016-05-21 00:00:00',errors,False,flag=2)
        # 验证周期为d1,bSearchRecent为False,该时间点有历史数据
        self.check('OutdoorTdbin','2016-05-20 00:00:00',False)
        #验证参数id不存在的
        self.check('test_123_history_day', '2016-07-21 00:00:00',True,2,11111)
        # 验证点不存在
        self.check('test_123_data_no_point', '2016-07-21 00:00:00',True,2)
        #验证时间格式不对
        self.check('test_123_history_day', '20160721 00:00:00',True,3)


    #0表示正确的参数,1表示错误的参数,
    def check( self,point,point_time,bSearchRecent,flag=0,id=1):
        url_history='http://%s/v1/data/get_history_at_time' % app.config['SERVERIP']
        data={'projId': id, 'pointList': [point], 'time': point_time, 'bSearchRecent': bSearchRecent}
        try:
            value=BeopTools().postJsonToken(url=url_history, data=data, t=10)
            print(str(value)+str(data))
            if(flag==0):
                if(type(value)==type([]) and type(value[0])==type(21.93)):
                    print('%s接口返回的结果值是正确的%s'%(url_history,value[0]))
                else:
                    self.errors.append("请求%s接口post参数%s返回值和预期的不一致,预期有值,实际:%s!" % ( url_history,data,str(value)))
            elif(flag==2):
                if (type(value) == type([]) or  None in value):
                    print('%s接口返回的结果值是正确的%s' % (url_history, str(value)))
                else:
                    self.errors.append("请求%s接口post参数%s返回值和预期的不一致,预期:{},实际:%s!" % (
                     url_history, data, str(value)))
            elif(flag==3):
                if ('format' in value):
                    print('%s接口%s返回的结果值是正确的%s' % (url_history,data, str(value)))
                else:
                    self.errors.append("请求%s接口post参数%s返回值和预期的不一致,预期:%s,实际:%s!" % (
                     url_history, data, 'time format should be %Y-%m-%d %H:%M:%S',str(value)))
        except Exception as e:
            print(e.__str__())
            self.errors.append('错误内容'+e.__str__())



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

if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Service016('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
