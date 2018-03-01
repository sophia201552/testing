__author__ = 'sophia'
import unittest
import sys
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import time, datetime


class Service026(unittest.TestCase):
    testCaseID = 'Service026'
    projectName = ""
    buzName = '测试/data/get_history/at_moment接口'
    start = 0.0
    now = 0
    startTime = ""
    errors = []
    timeout = 10
    url = "http://%s/data/get_history/at_moment" %  app.config['SERVERIP']

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.errors = []
        #检测3个点在2个时间点,3个点都是只有一个时间点有数据的情况
        self.check(['@190|WeekFaultStatisticNum', '@190|WeekFaultStatisticNumDetail', '@190|WeekFaultStatisticEnergy'], [ '2017-03-26 23:55:00', '2017-04-02 23:55:00'], 'm5')
        #检测4个点在2个时间点,前3个点只有一个时间点有数据,第4个点在两个时间点都有数据
        self.check(['@190|WeekFaultStatisticNum', '@190|WeekFaultStatisticNumDetail', '@190|WeekFaultStatisticEnergy','@190|Equip_IntactRate'], [ '2017-03-26 23:55:00', '2017-04-02 23:55:00'], 'm5')
        #检测4个点在1个时间点,前3个点在该时间点没有数据,第4个点在该时间点有数据
        self.check(['@190|WeekFaultStatisticNum', '@190|WeekFaultStatisticNumDetail', '@190|WeekFaultStatisticEnergy','@190|Equip_IntactRate'], [ '2017-03-26 23:55:00'], 'm5')
        #检测1个点在1个时间点没有数据
        self.check(['@190|WeekFaultStatisticNum'], [ '2017-03-26 23:55:00'], 'm5')
        #检测1个点在2个时间点都没有数据
        self.check(['@190|WeekFaultStatisticNum'], [ '2017-03-26 23:55:00','2017-03-26 23:55:00'], 'm5')
        #检测1个点使用h1时间格式
        self.check(['@190|WeekFaultStatisticNum'], [ '2017-03-26 23:00:00','2017-04-02 23:00:00'], 'h1')
        #检测4个点在2个时间点,前3个点只有一个时间点有数据,第4个点在两个时间点都有数据,时间格式为h1
        self.check(['@190|WeekFaultStatisticNum', '@190|WeekFaultStatisticNumDetail', '@190|WeekFaultStatisticEnergy','@190|Equip_IntactRate'], [ '2017-03-26 23:00:00','2017-04-02 23:00:00'], 'h1')
        #检测4个点在2个时间点,前3个点只有一个时间点有数据,第4个点在两个时间点都有数据,时间格式为d1
        self.check(['@190|WeekFaultStatisticNum', '@190|WeekFaultStatisticNumDetail', '@190|WeekFaultStatisticEnergy','@190|Equip_IntactRate'], [ '2017-03-26 00:00:00','2017-04-02 00:00:00'], 'd1')
        #检查空的参数情况
        self.check([], [], '',0)
        #检查用错误的时间格式是否有数据返回
        self.check(['@190|WeekFaultStatisticNum'], [ '2017-04-02 00:00:00'], 'ss',0)
        #使用错误的时间格式
        self.check(['@190|WeekFaultStatisticNum'], [ '2017-04-'], 'm5',0)









        BeopTools.raiseError(self.errors, self.testCaseID)

    def check(self,arrDs,arrMoment,format,flag=1):
        try:
            rv = False
            data = [{ 'arrDs':arrDs, 'arrMoment': arrMoment,'format': format}]#'@190|Equip_IntactRate'
            rv = BeopTools().postJsonToken(self.url, data, self.timeout)
            if rv and isinstance(rv, list):
                rv=rv[0]
                return_arrMoment=rv.get("arrMoment",[])
                return_list=rv.get("list",[])
                if len(return_list)==len(arrDs):
                    print("返回的数据和点的个数一致")
                else:
                    self.errors.append("返回的数据个数和点的个数不一致,点为{},返回的数据为{}".format(arrDs,return_list))
                for l in return_list:
                    return_data=l.get('data',[])
                    ds=l.get('ds','')
                    if len(return_data)==len(arrMoment):
                        print("返回的数据个数和对应的时间点个数一致")
                        if(flag==0):
                            for rd in return_data:
                                if rd==[] or rd==None:
                                    print("使用错误的参数返回的为[]或者是None")
                                else:
                                    self.errors.append("使用{}参数返回的值不为[]或None".format(data))
                    else:
                        self.errors.append("返回的数据个数和对应的时间点个数不一致时间点为{},返回的数据为{}".format(arrMoment,return_data))
            else:
                self.errors.append("返回的数据为空！")
        except Exception as e:
            print(e.__str__())
            self.errors.append(e.__str__())

    def tearDown(self):
        self.errors = []
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Service026('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
