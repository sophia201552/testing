__author__ = 'wuranxu'

import xml.dom.minidom
from Methods.WebDriverTools import WebDriverTools
from Methods.LoginTools import LoginTools
from Methods.MemcacheTools import MemcacheTools
import datetime, time

from Methods.LoginTools import *

dom = xml.dom.minidom.parse(r"%s\Other\UserInfo.xml" % app.config['BASE_DIR'])
root = dom.documentElement
ele = root.getElementsByTagName('login')
num = len(ele)
user = []
pwd = []
url = "http://%s" % app.config['SERVERIP']

for i in range(0,num):
    user.append(ele[i].getAttribute('username'))
    pwd.append(ele[i].getAttribute('password'))

class Case016(unittest.TestCase):
    testCaseID = 'Case016'
    projectName = "不针对项目"
    buzName = '测试登陆时出现密码错误的问题并计算登陆时间'
    start = 0.0
    now = 'None'
    startTime = ""
    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})


    def Test(self):
        for x in range(0, num):
            lg = LoginTools()
            self.driver = lg.InitialChrome(url, self.testCaseID)
            self.driver = lg.login_test(self.driver, user[x], pwd[x])
            time.sleep(1)
            self.driver.quit()


    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})





if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case016('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)