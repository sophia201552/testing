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
from Methods.OtherTools import OtherTools


class Case028(unittest.TestCase):
    url = "http://%s" % app.config['SERVERIP']
    testCaseID = 'Case028'
    projectName = "不针对项目"
    buzName = '项目搜索功能'
    start = 0.0
    now = 'None'
    startTime = ""
    itemCount = 3
    total = 37

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver)


    def Test(self):
        sleep(2)
        driver = self.driver
        self.search(driver)

    def search(self, driver):
        a = WebDriverTools()
        if a.isElementPresent(driver, ".input-group.clearfix"):
            print("搜索框存在!")
        else:
            WebDriverTools.get_pic(driver, self.testCaseID)
            assert 0, self.testCaseID + self.buzName + "--登陆Beop后没有找到搜索框!"
        driver.find_element_by_css_selector(".form-control.project-media-searchBox").clear()
        # 搜索关键字huawei，应该出现至少3个结果
        driver.find_element_by_css_selector(".form-control.project-media-searchBox").send_keys("huawei")
        driver.find_element_by_css_selector("#advanceSearch-btn-1").click()
        sleep(4)
        items = driver.find_elements_by_css_selector(".project-media-result.clearfix.scrollbar .nav li")
        if len(items) >= self.itemCount:
            print("搜索正常!华为项目个数不小于3!")
        else:
            WebDriverTools.get_pic(driver, self.testCaseID)
            assert 0, self.testCaseID + self.buzName + "--搜索功能异常,搜索huawei关键字，出现的项目个数小于3个!请检查!"


        #撤销搜索
        if a.isElementPresent(driver, ".glyphicon-remove.project-media-searchBox-clear"):
            print("撤销搜索按钮存在!")
        else:
            assert 0, self.testCaseID + self.buzName + "--登陆Beop--搜索huawei后没有找到撤销搜索的按钮!"
        driver.find_element_by_css_selector(".glyphicon-remove.project-media-searchBox-clear").click()
        if a.isElementPresent(driver, ".project-media-container"):
            print("撤销搜索按钮项目存在!")
        else:
            WebDriverTools.get_pic(driver, self.testCaseID)
            assert 0, self.testCaseID + self.buzName + "--登陆Beop--搜索huawei--撤销搜索后没有找到项目!"
        sleep(4)
        all = driver.find_elements_by_css_selector(".project-media-container .media.effect")
        if len(all) >= self.total:
            print("搜索正常!项目个数不小于%d!" % self.total)
        else:
            WebDriverTools.get_pic(driver, self.testCaseID)
            assert 0, self.testCaseID + self.buzName + "--搜索功能异常,搜索huawei关键字，出现的项目个数小于%d个!请检查!" % self.total

        #搜索不存在的项目
        driver.find_element_by_css_selector(".form-control.project-media-searchBox").send_keys(OtherTools.random_str(9))
        driver.find_element_by_css_selector("#advanceSearch-btn-1").click()
        sleep(4)
        items = driver.find_elements_by_css_selector(".project-media-result.clearfix.scrollbar .nav li")
        if len(items):
            WebDriverTools.get_pic(driver, self.testCaseID)
            assert 0, self.testCaseID + self.buzName + "--搜索功能异常,搜索随机关键字，出现的项目个数不为0!请检查!"

        #搜索中文项目
        driver.find_element_by_css_selector(".form-control.project-media-searchBox").clear()
        driver.find_element_by_css_selector(".form-control.project-media-searchBox").send_keys("玉兰大剧院")
        driver.find_element_by_css_selector("#advanceSearch-btn-1").click()
        sleep(4)
        items = driver.find_elements_by_css_selector(".project-media-result.clearfix.scrollbar .nav li")
        if len(items) != 1:
            WebDriverTools.get_pic(driver, self.testCaseID)
            assert 0, self.testCaseID + self.buzName + "--搜索功能异常,搜索\"玉兰大剧院\"，出现的项目个数不为1!请检查!"






    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID, {'start': self.startTime, 'end': self.now})

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case028('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)