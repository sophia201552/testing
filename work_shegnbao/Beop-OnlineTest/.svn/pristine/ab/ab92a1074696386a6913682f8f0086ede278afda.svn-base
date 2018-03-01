__author__ = 'sophia'
import unittest
import sys
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import time, datetime
import json



class Smoke031(unittest.TestCase):
    testCaseID = 'Smoke031'
    projectName = ""
    buzName = '测试获取诊断复制接口'
    start = 0.0
    now = 0
    startTime = ""
    errors = []
    timeout=10
    serverip=app.config['SERVERIP']
    url_copy = "http://%s/cloudDiagnosis/copyCustomDiagnosis" % serverip
    url_delete = "http://%s/cloudDiagnosis/removeCustomDiagnosis" % serverip
    exist = ['57d21f51833c9720ec52a661']
    wrong = [None]

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.errors = []
        self.getExisted()
        self.getWrong()
        BeopTools.raiseError(self.errors, self.testCaseID)

    # 使用正确的获取到接口数据
    def getExisted(self):
        try:
            data={"diagnosisIds":self.exist,"parent_id":-1}
            rv = BeopTools.postDataExcept(url=self.url_copy, data=data,timeout=self.timeout)
            id=''
            if  rv['success']:
                id=rv['data'][0]['_id']
                print("返回结果中有数据!" )
            else:
                self.errors.append("错误信息[%s]%s---访问%s接口,使用正确的参数%s返回结果为%s!" % (BeopTools.getTime(),self.testCaseID, self.url_copy, self.exist,str(rv)))
            data={"IdList":[id]}
            rv = BeopTools.postDataExcept(url=self.url_delete, data=data,timeout=self.timeout)
            if rv['success']:
                print('删除成功')
            else:
                self.errors.append("错误信息[%s]%s---访问%s接口,使用正确的参数%s返回结果为%s!" % (BeopTools.getTime(),self.testCaseID, self.url_delete, data,str(rv)))
        except Exception as e:
            print(e.__str__())
            BeopTools.writeLogError(self.logger,e.__str__())
            self.errors.append("错误信息[%s]%s---getExisted method errror:%s" % (BeopTools.getTime(),self.testCaseID, e.__str__()))

    # 使用错误的获取到接口的数据
    def getWrong(self):
        try:
            data={"IdList":self.wrong}
            rv = BeopTools.postDataExcept(url=self.url_copy, data=data,timeout=self.timeout)
            if not rv['success']:
                print("返回结果中无数据!")
            else:
                self.errors.append(
                    "错误信息[%s]%s---访问%s接口,使用错误的参数%s返回结果为%s!" % (BeopTools.getTime(), self.testCaseID,self.url_copy, self.wrong,str(rv)))
        except Exception as e:
            print(e.__str__())
            BeopTools.writeLogError(self.logger,e.__str__())
            self.errors.append("错误信息[%s]%s---getWrong method error:%s" % (BeopTools.getTime(),self.testCaseID, e.__str__()))



    def tearDown(self):
        self.errors = []
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Smoke031('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
