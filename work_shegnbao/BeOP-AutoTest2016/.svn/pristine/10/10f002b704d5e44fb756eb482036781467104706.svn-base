__author__ = 'woody'
import datetime
import string
import time
import unittest, random
from time import sleep
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from Methods.LoginTools import LoginTools
from Methods.MemcacheTools import MemcacheTools
from Methods.WebDriverTools import WebDriverTools
from config import app
from selenium.webdriver.support.select import Select


class Case036(unittest.TestCase):
    testCaseID = 'Case036'
    projectName = "梅赛德斯奔驰项目"
    buzName = '项目操作记录测试'
    start = 0.0
    now = 'None'
    startTime = ""
    url = "http://%s" % app.config['SERVERIP']

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver)

    def Test(self):
        a = WebDriverTools()
        driver = self.driver
        time.sleep(4)
        #driver.implicitly_wait(8)
        WebDriverTools.enterProject(driver, 120, self.projectName)

        #打开用户操作记录
        driver.find_element_by_css_selector("#iconList").click()
        sleep(1)
        b = a.isElementPresent(driver, "#btnOperatingRecord")
        if b:
            driver.find_element_by_css_selector("#btnOperatingRecord").click()
        else:
            assert 0,"%s--%s--进入项目后没有找到操作记录按钮!" % (self.projectName,self.buzName)
        self.check(driver,"操作记录窗口",[".modal-content","#btnLogPre","#datePickerLog","#btnLogNext","#tableOperatingRecord",".modal-content .close"])
        sleep(2)
        #关闭窗口
        driver.find_element_by_css_selector("#dialogContent .close").click()
        sleep(2)
        #再次进入操作记录
        driver.find_element_by_css_selector("#iconList").click()
        driver.find_element_by_css_selector("#btnOperatingRecord").click()
        sleep(2)
        self.check2(driver,"再次打开操作记录窗口时",["#dialogContent","#btnLogPre","#datePickerLog","#btnLogNext","#tableOperatingRecord"])





    def check(self, driver, name, eles):
        try:
            for ele in eles:
                driver.find_element_by_css_selector(ele)
            print("操作记录组件正常!")
        except Exception as e:
            print(e.__str__())
            assert 0,name + "--组件丢失请检查!"


    def check2(self, driver, name, eles):
        try:
            for ele in eles:
                a = driver.find_element_by_css_selector(ele).is_displayed()
                if a:
                    print("操作记录组件正常!")
                else:
                    assert 0,name + "--组件丢失请检查!"
        except Exception as e:
            print(e.__str__())
            assert 0,name + "--组件丢失请检查!"




    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case036('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)

