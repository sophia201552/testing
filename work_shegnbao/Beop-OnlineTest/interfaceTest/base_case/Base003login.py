__author__ = 'wuranxu'

import time
import datetime
import unittest, sys, json
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app


TIMEOUT = 60

class Base003(unittest.TestCase):
    testCaseID = 'Base003'
    projectName = "无项目"
    buzName = '用户登录接口验证'
    start = 0.0
    serverip = app.config.get('SERVERIPS')

    def setUp(self):
        self.errors = []
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))
        self.a = BeopTools()

    def login(self,user,password):
        Result = []
        for ul in self.serverip:
            url = 'http://%s/login' % ul
            userTemplate = {"name":"","pwd":"","agent":{}}
            userTemplate['name'] = user
            userTemplate['pwd'] = password
            try:
                loginResult = BeopTools.getInstance().postData(url, userTemplate,t=TIMEOUT)
            except Exception as e:
                assert 0, '错误信息发送%s数据访问%s接口失败! 可能导致用户无法登陆!timeout: %ss' % (json.dumps(userTemplate), url, TIMEOUT)
            Result.append(loginResult)
        return Result
    #testcase添加loginTest这个方法
    def Test(self):
        a = BeopTools()
        #正常登录
        user = 'projecttest@rnbtech.com.hk'
        password = 'h=Lp4U8+Lp'
        loginResult = self.login(user,password)
        for i in loginResult:
            projetcs =  i['projects']
            ip = i ["ip"]
            if i['status']:
                if len(projetcs) < 36:
                    self.errors.append('错误信息Fail：D019-1，登录%s网站返回的项目数量不正确实际数量大于36，返回数量为%d。'%(ip,len(projetcs)))
            else:
                self.errors.append('错误信息Fail：D019-2，登录%s网站返回状态失败，用户名：%s，密码：%s 。'% (ip,user, password))

        #密码大小写差异登录
        password = 'hezhengjiuN'
        loginResult = self.login(user,password)
        for index,i in enumerate(loginResult):
            if i['status']:
                self.errors.append('错误信息Fail：登录%s网站，D019-3密码大写返回状态成功'%self.serverip[index])

        #密码错误登录
        password = 'hezheng'
        loginResult = self.login(user,password)
        for index,i in enumerate(loginResult):
            if i['status']:
                self.errors.append('错误信息Fail：登录%s网站,D019-4错误的密码返回状态成功'%self.serverip[index])

        #错误的用户名登陆
        user = 'zhangwuwu'
        loginResult = self.login(user,password)
        for index,i in enumerate(loginResult):
            if i['status']:
                self.errors.append( '错误信息Fail：登录%s网站,D019-5错误的用户名和密码返回状态成功'%self.serverip[index])
        #用户名和密码为空时

        user = ''
        password = ''
        loginResult = self.login(user,password)
        for index,i in enumerate(loginResult):
            if i['status']:
                self.errors.append('错误信息Fail：登录%s网站,D019-6错误的用户名和密码返回状态成功'%self.serverip[index])

        if self.errors:
            a.raiseError(self.errors,self.testCaseID)
        else:
            print('登录测试通过')

        time.sleep(0.1)

    def tearDown(self):
        self.errors = []
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

if __name__ == '__main__':
    while True:
        suite = unittest.TestSuite()
        suite.addTest(Base003('Test'))
        runner = unittest.TextTestRunner()
        result = runner.run(suite)