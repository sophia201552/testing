__author__ = 'woody'
import datetime
import time
import unittest
from time import sleep

from Methods.LoginTools import LoginTools
from Methods.MemcacheTools import MemcacheTools
from Methods.WebDriverTools import WebDriverTools
from config import app


class Case031(unittest.TestCase):
    testCaseID = 'Case031'
    projectName = "上海华为项目"
    buzName = '监测首页数据点是否丢失'
    start = 0.0
    now = 'None'
    startTime = ""
    url = "http://%s" % app.config['SERVERIP']
    errors = []

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver)


    def Test(self):
        self.errors[:] = []
        sleep(4)
        driver = self.driver
        #a = WebDriverTools()
        #进入上海华为首页
        #driver.find_element_by_id("project-72-shhuawei-undefined").click()
        #a.waitSpinner(driver, "上海华为")
        #sleep(2)
        #开始监测首页data-id
        WebDriverTools.enterProject(driver, 72, self.projectName, self.errors)
        self.checkId(driver,"新总览")

        #监测KPI页面
        #self.EnterPage(driver,"#ulPages li:nth-child(2) .caret","li[class='dropdown open']>ul li:nth-child(2)")
        WebDriverTools.enterPage(driver, ['设备','KPI管理','KPI 汇总'], projName=self.projectName, timeout=30)
        self.checkId(driver,"设备--KPI管理-KPI 汇总")

        #监测能耗统计页面
        #driver.find_element_by_id('navHomeLogo').click()
        #WebDriverTools.enterProject(driver, 'project-72-shhuawei-undefined', self.projectName, self.errors)
        WebDriverTools.enterPage(driver, ['设备','能效分析','能耗概览'], projName=self.projectName, timeout=30)
        self.checkId(driver,"设备--能效分析-能耗概览")





    def checkId(self,driver,page):
        ele = driver.find_elements_by_tag_name("a")
        n = 0
        if len(ele) == 0:
            pass
        else:
            for e in ele:
                if e.get_attribute("data-id") == "undefined":
                    n += 1
                else:
                    pass
        if n:
            assert 0,"%s-%s-%s页面数据点丢失，个数为%d" % (self.testCaseID,self.buzName,page,n)
        else:
            print("%s-%s-%s页面数据点正常!" % (self.testCaseID,self.buzName,page))


    def EnterPage(self,driver,ele1,ele2):
        a = WebDriverTools()
        driver.find_element_by_css_selector(ele1).click()
        sleep(1)
        driver.find_element_by_css_selector(ele2).click()
        sleep(7)






    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case031('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)