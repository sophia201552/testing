__author__ = 'woody'
import datetime
import time
import unittest, json
from Methods.LoginTools import LoginTools
from Methods.MemcacheTools import MemcacheTools
from Methods.WebDriverTools import WebDriverTools
from Methods.OtherTools import OtherTools
from selenium.webdriver.common.keys import Keys
from config import app


class Case054(unittest.TestCase):
    testCaseID = 'Case054'
    projectName= "不选择项目"
    buzName = '全屏功能'
    start = 0.0
    now = 'None'
    startTime = ""
    url = 'http://' + app.config['SERVERIP']
    errors = []

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver)


    def Test(self):
        self.errors = []
        driver = self.driver
        #最大化后获取浏览器尺寸
        max_window_size = self.getSize(driver)
        self.fullScreen(driver)
        self.wait()
        #全屏后size
        full_screen_size = self.getSize(driver)
        if self.compare(max_window_size, full_screen_size):
            self.errors.append("浏览器最大化与全屏时size一致，均为%s!请检查全屏功能是否正常!" % (json.dumps(full_screen_size)))


        #退出全屏是否一致
        driver.find_element_by_css_selector('.form-control.project-media-searchBox').send_keys(Keys.ESCAPE)
        self.wait()
        quit_full_screen = self.getSize(driver)


        if self.compare(full_screen_size, max_window_size):
            self.errors.append("浏览器全屏时与退出全屏后size一致，均为%s!请检查全屏功能是否正常!" % (json.dumps(full_screen_size)))

        #设置size
        driver.set_window_size(900, 1000)
        self.wait()
        set_size = self.getSize(driver)

        #再次全屏
        self.fullScreen(driver)
        self.wait()
        full_again = self.getSize(driver)
        if not self.compare(full_again, full_screen_size) or self.compare(full_again, set_size):
            self.errors.append("设置浏览器大小后全屏出现异常!请检查全屏功能是否正常!")
        print("浏览器最大化: %s,全屏: %s , 退出全屏: %s, 浏览器手动设置大小: %s, 二次全屏:%s " %
              (json.dumps(max_window_size), json.dumps(full_screen_size), json.dumps(quit_full_screen), json.dumps(set_size), json.dumps(full_again))
              )
        OtherTools.raiseError(self.errors)


    def wait(self):
        time.sleep(1.5)

    def fullScreen(self, driver):
        #点击全屏按钮
        WebDriverTools.clickEle(driver, '#iconList', self.testCaseID, self.projectName, '用户菜单', self.errors)
        WebDriverTools.clickEle(driver, '#btnFullScreen', self.testCaseID, self.projectName, '用户菜单-全屏按钮', self.errors)


    def compare(self, a, b):
        if a == b:
            return True
        else:
            return False


    def getSize(self, driver):
        return driver.get_window_size()





    def tearDown(self):
        self.driver.quit()
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})



if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case054('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)
