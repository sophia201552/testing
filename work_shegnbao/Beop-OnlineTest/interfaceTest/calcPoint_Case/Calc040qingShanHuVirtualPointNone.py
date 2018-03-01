__author__ = 'sophia'
import unittest
import sys
from interfaceTest.Methods.BeopTools import *
from interfaceTest import app



class Calc040(unittest.TestCase):
    testCaseID = 'Calc040'
    projectName = "青山湖"
    buzName = '青山湖虚拟点是否为none'
    url = 'http://%s/point_tool/getCloudPointTable/' % app.config['SERVERIP']
    TIMEOUT = 10
    params =  [{'project':'青山湖','id':376,
                'point':['Plant001_COP_va','ChGroupTotal101_IceChargeCOP_va','ChGroupTotal101_CoolingCOP_va','ChGroupTotal001_MaxChEvapAppT_va',
                         'ChGroupTotal001_MaxChCondAppT_va','ChGroupTotal001_AverageChAMPS_va']}]

    #case初始化,获取开始时间以及时间戳,获取写入日志句柄logger
    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))
        self.a = BeopTools()

    def Test(self):
        self.errors = []
        self.point()
        self.a.raiseError(self.errors,self.testCaseID)

    def point(self):
        for param in self.params:
            try:
                for point in  param['point']:
                    data = {"projectId":param['id'],"currentPage":1,"pointType":1,"searchText":point,"t_time":"","pageSize":100}
                    rv = self.a.postDataExcept(url=self.url, data=data, timeout=self.TIMEOUT)
                    if rv and rv.get('success',0) and rv.get('data').get('pointTable'):
                        value=rv['data']['pointTable'][0]['pointValue']
                        if(value=='None' or value==''):
                            self.errors.append("错误信息%s接口, 参数: %s,点值为None或空" % (self.url, json.dumps(data)))
                    else:
                        self.errors.append("点%s 返回没有数据" % (json.dumps(point)))
            except Exception as e:
                print(e.__str__())
                self.errors.append('错误信息%s' % (e.__str__()))

    #用例结束后的清理工作,记录输出时间以及
    def tearDown(self):
        self.errors = []
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Calc040('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

