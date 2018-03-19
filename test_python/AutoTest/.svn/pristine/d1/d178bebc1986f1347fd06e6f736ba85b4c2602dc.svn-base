__author__ = 'woody'

from Methods.WebDriverTools import WebDriverTools
from Methods.MemcacheTools import MemcacheTools
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import ElementNotVisibleException
from selenium.webdriver.common.action_chains import ActionChains
import datetime, time, string, random
from Methods.LoginTools import LoginTools
from config import app
from selenium.webdriver.common.keys import Keys
import unittest, os
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support.select import Select
from selenium import webdriver
from time import sleep




class Case029(unittest.TestCase):
    testCaseID = 'Case029'
    projectName = "上海华为项目"
    buzName = '诊断页面是否能正常加载'
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
        sleep(3)
        driver = self.driver
        a = WebDriverTools()
        #进入上海华为诊断页面
        WebDriverTools.enterProject(driver, 72, self.projectName)
        WebDriverTools.enterPage(driver, ['设备','系统诊断','系统诊断'], '#btnStickyPost', self.projectName, timeout=30)
        sleep(2)
        try:
            driver.find_element_by_id("btnStickyPost")
            driver.find_element_by_id("btnNoticeConfig")
            driver.find_element_by_id("btnNoticeHistory")
            driver.find_element_by_id("btnWarningLog")
        except Exception:
            assert 0,self.testCaseID + self.buzName + "--进入上海诊断页面后右上角诊断工具栏有部件丢失!"


        #通过canvas数量判断页面是否加载完毕
        try:
            canvas = driver.find_elements_by_tag_name("canvas")
            if len(canvas) >= 2:
                print("canvas数量正常!")
            else:
                assert 0,"canvas数量不正常,少于2个!"
        except Exception:
            assert 0,"canvas数量不正常,少于2个!"

        #判断上面白框有没出现
        white = driver.find_element_by_css_selector(".modal-body.clearfix canvas")
        style1 = white.get_attribute("style")
        print(style1)
        #进入2F/2B
        try:
            driver.find_element_by_css_selector("#building_2").click()
            sleep(1)
            driver.find_element_by_css_selector(".div-nav-box2 #navFloor-202").click()
            sleep(5)
        except Exception:
            assert 0,self.testCaseID + self.buzName + "--进入上海诊断页面后左侧楼层无法选择!"




        ActionChains(driver).move_to_element(white).perform()
        style2 = white.get_attribute("style")
        print(style2)
        if style1 != style2:
            assert 0,"%s-%s-%s进入诊断页面后，页面上方有白框!" % (self.testCaseID,self.projectName,self.buzName)




    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID, {'start': self.startTime, 'end': self.now})

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case029('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)