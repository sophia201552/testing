__author__ = 'wuranxu'

import time
import datetime
import unittest
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app

serverip = app.config.get('SERVERIP')


class Smoke003(unittest.TestCase):
    testCaseID = 'Smoke003'
    projectName = "无项目"
    buzName = '用户登录接口验证'
    start = 0.0

    def setUp(self):
        self.start = datetime.datetime.now()
    def login(self,user,password):
        url = 'http://%s/login' % serverip
        userTemplate = {"name":"","pwd":"","agent":{}}
        userTemplate['name'] = user
        userTemplate['pwd'] = password
        try:
            loginResult = BeopTools.postData(self,url=url, data=userTemplate,t=5)
        except Exception as e:
            assert 0, e.__str__()
        return loginResult
    #testcase添加loginTest这个方法
    def Test(self):
        #正常登录
        user = 'projecttest@rnbtech.com.hk'
        password = 'h=Lp4U8+Lp'
        loginResult = self.login(user,password)
        projetcs =  loginResult['projects']
        if loginResult['status']:
            if len(projetcs) < 36:
                assert 0 , 'Fail：D019-1，登录beop网站返回的项目数量不正确实际数量大于36，返回数量为%d。'%len(projetcs)
        else:
            assert 0 ,'Fail：D019-2，登录beop网站返回状态失败，用户名：%s，密码：%s 。'%user %password

        #密码大小写差异登录
        password = 'hezhengjiuN'
        loginResult = self.login(user,password)
        if loginResult['status']:
            assert 0 , 'Fail：D019-3密码大写返回状态成功'

        #密码错误登录
        password = 'hezheng'
        loginResult = self.login(user,password)
        if loginResult['status']:
            assert 0 , 'Fail：D019-4错误的密码返回状态成功'

        #错误的用户名登陆
        user = 'zhangwuwu'
        loginResult = self.login(user,password)
        if loginResult['status']:
            assert 0 , 'Fail：D019-5错误的用户名和密码返回状态成功'
        #用户名和密码为空时

        user = ''
        password = ''
        loginResult = self.login(user,password)
        if loginResult['status']:
            assert 0 , 'Fail：D019-6错误的用户名和密码返回状态成功'

        print('登录测试通过')
        time.sleep(0.1)

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())

if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Smoke003('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)