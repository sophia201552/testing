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





class Case035(unittest.TestCase):
    testCaseID = 'Case035'
    projectName = "WebFactory"
    buzName = 'Factory发布新项目'
    start = 0.0
    now = 'None'
    startTime = ""
    url = "http://%s/factory" % app.config['SERVERIP']
    projName = "TestProj"

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChromeFactory(self.url, self.testCaseID)
        self.driver = lg.loginFactory(self.driver)

    def Test(self):
        sleep(2)
        driver = self.driver
        self.enterProj(driver,"测试factory发布")
        self.release(driver)
        self.check(driver)
        self.delProj(driver)


    def enterProj(self,driver,projName):
        projs = driver.find_elements_by_css_selector(".proText")
        if projs != []:
            for p in projs:
                if p.text == projName:
                    p.click()
                    break

        else:
            assert 0,"factory项目页左侧未找到项目!"
        sleep(1)

    def release(self,driver):
        a = WebDriverTools()
        #进入用户菜单
        driver.find_element_by_css_selector("#userAccount").click()
        #发布项目
        driver.find_element_by_css_selector("#lkRelease").click()
        WebDriverWait(driver, 10).until(lambda x: x.find_element_by_css_selector(".btn.btn-default.directRelease"))
        sleep(2)
        driver.find_element_by_css_selector(".btn.btn-default.directRelease").click()
        sleep(2)
        driver.find_element_by_css_selector("#relPass").clear()
        driver.find_element_by_css_selector("#relPass").send_keys("wuranxu")
        driver.find_element_by_css_selector(".btn.btn-default.directRelease").click()
        sleep(2)
        if a.isElementPresent(driver,".btn.btn-info.alert-button"):
            sure = [x for x in driver.find_elements_by_css_selector(".btn.btn-info.alert-button") if x.text == '确认']
            sure[0].click()
            #driver.find_element_by_css_selector(".btn.btn-info.alert-button").click()
        else:
            assert 0,"factory--点击发布项目后没有发布成功的对话框!"




    def check(self,driver):
        name = []
        flag = 0
        driver.get(self.url)
        WebDriverWait(driver, 15).until(lambda x: x.find_elements_by_css_selector("#iconList"))
        projs = driver.find_elements_by_css_selector(".project-media-container div")
        for p in projs:
            name.append(p.get_attribute("id"))
        for x in name:
            if "测试factory发布" in x:
                flag = 1
            else:
                pass
        if flag:
            print("项目发布成功!")
        else:
            assert 0,"factory--项目发布失败!"

    def delProj(self,driver):
        driver.find_element_by_css_selector("#iconList").click()
        #进入后台管理
        driver.find_element_by_css_selector("#btnMemberManage").click()
        sleep(6)
        #进入项目权限管理
        driver.find_element_by_css_selector("#manageTab li:nth-child(2)").click()
        sleep(2)
        values = driver.find_elements_by_tag_name("option")
        for v in values:
            c = v.text
            if "测试factory发布" in c:
                value = v.get_attribute("value")
                Select(driver.find_element_by_css_selector("#selectProject")).select_by_value(value)
                sleep(4)
                #点击删除该项目
                x = driver.find_element_by_id(value).find_element_by_css_selector(".proList .btn.btn-default.delCon.fr")
                if x.is_displayed():
                    x.click()
                else:
                    pass
                sleep(3)
                driver.find_element_by_css_selector("article[data-projectid='%s'] .modal-dialog .btn.btn-primary" % value).click()


            else:
                print(c)

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID, {'start': self.startTime, 'end': self.now})