__author__ = 'Murphy'
import unittest
import datetime, time
from Methods.LoginTools import LoginTools
from Methods.MemcacheTools import MemcacheTools
from Methods.WebDriverTools import WebDriverTools
from Methods.OtherTools import OtherTools
from config import app
from time import sleep

class Case086(unittest.TestCase):
    testCaseID = "Case086"
    projectName = "MercedesBenz"
    buzName = "用电总览"
    now = 'None'
    url = "http://%s" % app.config['SERVERIP']
    project = (120, 'MercedesBenz', ['总降系统', '用电总览'], '#indexMain')
    page = ['总降系统', '用电总览']

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{"startTime":self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url,self.testCaseID)
        self.driver = lg.login(self.driver)
        self.tools = WebDriverTools()

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

    def Test(self):
        driver = self.driver
        self.errors = []
        self.tools.enterProject(driver, self.project[0], self.project[1], self.errors)
        sleep(3)

        self.tools.enterPage(driver, self.project[2], self.project[3], self.project[1], timeout=180)
        sleep(3)

        self.tools.checkCanvas(driver, self.errors, self.page)

        OtherTools.raiseError(self.errors)
        print('上海梅赛德斯奔驰，系统总降-用电总览，测试完成！')


if __name__ == "__main__":
    suit = unittest.TestSuite()
    suit.addTest(Case086('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suit)
