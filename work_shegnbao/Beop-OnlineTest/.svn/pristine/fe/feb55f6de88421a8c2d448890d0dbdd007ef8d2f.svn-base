__author__ = 'sophia'

import json
import time
import datetime
import unittest
import sys
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app

class Service010(unittest.TestCase):
    testCaseID = 'Service010'
    projectName = "BeopService"
    buzName = '实时接口get_realtimedata'
    start = 0.0
    now = 0
    startTime = ""
    errors = []
    timeout = 15
    url = "http://%s/get_realtimedata" % app.config['SERVICE_URL']
    data = [{"TOKEN": "autotest", "proj": 120},
            {'pointList': ['OUTDOOR_TEMP', 'OUTDOOR_HUMIDITY'], 'proj': 72, 'TOKEN': '72CalRealTimeWetTemp'},
            {"TOKEN": "autotest", "proj": 203},{"TOKEN": "autotest", "proj": 102},{"TOKEN": "autotest", "proj": 186},
            {"TOKEN": "autotest", "proj": 5},{"TOKEN": "autotest", "proj": 100},{"TOKEN": "autotest", "proj": 90},
            {"TOKEN": "autotest", "proj": 80},{"TOKEN": "autotest", "proj": 179},{"TOKEN": "autotest", "proj": 194},
            {"TOKEN": "autotest", "proj": 364},{"TOKEN": "autotest", "proj": 19},{"TOKEN": "autotest", "proj": 284},
            {"TOKEN": "autotest", "proj": 126},{"TOKEN": "autotest", "proj": 318},{"TOKEN": "autotest", "proj": 376},
            {"TOKEN": "autotest", "proj": 316},{"TOKEN": "autotest", "proj": 373},{"TOKEN": "autotest", "proj": 293},
            {"TOKEN": "autotest", "proj": 18},{"TOKEN": "autotest", "proj": 281},{"TOKEN": "autotest", "proj": 293},
            {"TOKEN": "autotest", "proj": 303},{"TOKEN": "autotest", "proj": 28},
            ]
    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.errors = []
        self.getExisted()
        BeopTools.raiseError(self.errors, self.testCaseID)

    def getExisted(self):
        try:
            for d in  self.data:
                rv = BeopTools.postDataExcept(url=self.url, data=d,timeout=self.timeout)
                except_result="[{'value': '0', 'name': 'o-Device-550_AV-1143'}]"
                if(rv==[]):
                     self.errors.append("错误信息[%s]%s---访问%s接口,使用参数%s,预期返回结果类似为:%s,实际返回结果为%s!" % (BeopTools.getTime(),self.testCaseID, self.url, d,except_result,str(rv)))
                else:
                    if isinstance(rv,list) and 'name'  in rv[0].keys():
                        print('返回值为正确的')
                    else:
                        self.errors.append("错误信息[%s]%s---访问%s接口,使用参数%s,预期返回结果类似为:%s,实际返回结果为%s!" % (BeopTools.getTime(),self.testCaseID, self.url, d,except_result,str(rv)))

        except Exception as e:
            print(e.__str__())
            BeopTools.writeLogError(self.logger,e.__str__())
            self.errors.append("错误信息[%s]%s---getExisted method errror:%s" % (BeopTools.getTime(),self.testCaseID, e.__str__()))

    def tearDown(self):
        self.errors = []
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Service010('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
    # unittest.main()
