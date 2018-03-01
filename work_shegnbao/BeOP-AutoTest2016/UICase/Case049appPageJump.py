__author__ = 'murphy'
from Methods.LoginTools import LoginTools
from Methods.OtherTools import OtherTools
from Methods.MemcacheTools import MemcacheTools
import unittest
import datetime, time
from Methods.WebDriverTools import WebDriverTools
from config import app
from time import sleep
from selenium.webdriver.support.wait import WebDriverWait
from selenium.common.exceptions import ElementNotVisibleException
from selenium.webdriver.common.keys import Keys

class Case049(unittest.TestCase):
    testCaseID = 'Case049'
    projectName = "上海华为"
    buzName = 'AppPageJump'
    now = 'None'
    errors = []
    url = "http://%s" % app.config['SERVERIP']

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID, {'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver)
        self.tools = WebDriverTools()

    def Test(self):
        driver = self.driver
        self.errors = []
        self.tools.enterProject(driver, 72, self.projectName, self.errors)
        self.check(driver)

    def check(self, driver):
        self.EnterOverview(driver)

        self.EnterOperAsse(driver)
        self.EnterOverview(driver)

        self.EnterAsseSub(driver)
        self.EnterOverview(driver)

        self.EnterEnergy(driver)
        self.EnterOverview(driver)

        self.EnterMonitor(driver)
        self.EnterOverview(driver)

        self.EnterDiag(driver)
        self.EnterOverview(driver)

    def EnterOverview(self, driver):
        #driver.find_element_by_css_selector("#ulPages li:nth-child(7) .caret").click()
        WebDriverTools.enterPage(driver, ['移动端','总览'], '#appTest', self.projectName)
        #sleep(1)
        #driver.find_element_by_xpath("//li[@pageid='5681fa7e833c971cf222a747']").click()
        sleep(2)
        try:
            pageOver = driver.find_element_by_id("appTest")
            if not pageOver:
                assert 0, 'APP打开总览失败'
        except Exception as e:
            assert 0, 'APP打开总览失败'

    def EnterOperAsse(self, driver):
        driver.find_elements_by_css_selector(".divMonitorInfo").click()
        sleep(1)
        try:
            pageKpi = driver.find_element_by_id("appKpi")
            if not pageKpi:
                assert 0, 'APP打开运营评估失败'
        except Exception as e:
            assert 0, 'APP打开运营评估失败'

    def EnterAsseSub(self, driver):
        driver.find_element_by_class_name("btnFont3").click()
        sleep(1)
        try:
            pageOver = driver.find_element_by_id("testCss")
            if not pageOver:
                assert 0, 'APP打开评估分项失败'
        except Exception as e:
            assert 0, 'APP打开评估分项失败'

    def EnterEnergy(self, driver):
        driver.find_element_by_class_name("btnFont4").click()
        sleep(1)
        try:
            pageOver = driver.find_element_by_id("paneCenter")
            if not pageOver:
                assert 0, 'APP打开能耗失败'
        except Exception as e:
            assert 0, 'APP打开能耗失败'

    def EnterMonitor(self, driver):
        driver.find_element_by_class_name("btnFont5").click()
        sleep(1)
        try:
            pageOver = driver.find_element_by_id("paneCenter")
            if not pageOver:
                assert 0, 'APP打开监测失败'
        except Exception as e:
            assert 0, 'APP打开监测失败'

    def EnterDiag(self, driver):
        driver.find_element_by_class_name("btnFont6").click()
        sleep(1)
        try:
            pageOver = driver.find_element_by_id("paneCenter")
            if not pageOver:
                assert 0, 'APP打开诊断失败'
        except Exception as e:
            assert 0, 'APP打开诊断失败'

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})



if __name__ == "__main__":
    a = 0
    while(a < 5):
        suite = unittest.TestSuite()
        suite.addTest(Case049('Test'))
        runner = unittest.TextTestRunner()
        runner.run(suite)
        a += 1