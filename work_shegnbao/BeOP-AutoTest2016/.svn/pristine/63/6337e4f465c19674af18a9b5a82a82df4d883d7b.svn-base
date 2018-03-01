__author__ = 'woody'
from Methods.LoginTools import LoginTools
from Methods.OtherTools import OtherTools
from Methods.MemcacheTools import MemcacheTools
import unittest
import datetime, time
from Methods.WebDriverTools import WebDriverTools
from config import app
from time import sleep
from selenium.webdriver.support.wait import WebDriverWait
import os
from selenium.webdriver.support.select import Select
from selenium.webdriver.common.keys import Keys
import re


class Case055(unittest.TestCase):
    testCaseID = 'Case055'
    projectName = "上海中芯国际"
    buzName = '数据管理点表搜索功能'
    now = 'None'
    url = 'http://' + app.config['SERVERIP']
    location_id = 1
    searchContent = (
                     ('CarrierOnOff', '0', 1),
                     ('0', '1', 2),
                     ('onoff', '4', 4)
                    )


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
        WebDriverTools.enterProject(driver, self.location_id, self.projectName, self.errors)
        WebDriverTools.enterModuleByUserMenu(driver, 'btnPointManager', '数据管理', '#dataManagerContainer')
        for thing in self.searchContent:
            self.searchWithPoint(driver, thing[0], thing[1], thing[2])
        self.searchWithPointValue(driver, 0, 1, '2', 2)
        yesterday = datetime.datetime.strftime(datetime.datetime.now() - datetime.timedelta(days=30), '%Y-%m-%d %H:%M')
        today = datetime.datetime.strftime(datetime.datetime.now(), '%Y-%m-%d %H:%M')
        self.searchWithDateRate(driver, yesterday, today, '3', 3)
        OtherTools.raiseError(self.errors)

    @classmethod
    def resetSearch(self, driver):
        # 搜索之前清空搜索结果
        driver.find_element_by_css_selector('#filterBox input').clear()
        time.sleep(2)
        driver.find_element_by_css_selector('#filterConfirm').click()
        time.sleep(3)




    def searchWithPoint(self, driver, content, value, index):
        WebDriverTools.select(driver, '.pageSizeSelect.form-control', '1000')
        self.searchWithValue(driver, value)
        self.resetSearch(driver)
        #先获取点名
        points = [td.text for td in driver.find_elements_by_css_selector("#tableWatch tbody tr td:nth-child(%d)" % index)]
        #pointsLength = len(points)
        pointsLength = int(driver.find_element_by_css_selector('.widget-sdt-total-num').text)
        #搜索开关点
        driver.find_element_by_css_selector('#filterBox input').send_keys(content)
        driver.find_element_by_css_selector('#filterConfirm').click()
        time.sleep(3)
        WebDriverTools.waitElementNotFound(driver, '.spinnerMask', self.testCaseID)
        pointsNow = [td.text for td in driver.find_elements_by_css_selector("#tableWatch tbody tr td:nth-child(%d)" % index)]
        pointsNowNum = int(driver.find_element_by_css_selector('.widget-sdt-total-num').text)
        if pointsNowNum < pointsLength:
            for point in pointsNow:
                if content.lower() not in point.lower():
                    WebDriverTools.get_pic(driver, self.testCaseID)
                    self.errors.append('项目名: %s 错误信息: 原始数据中搜索%s结果中包含了不存在的点! 点名为: %s' % (
                    self.projectName, content, point))
        else:
            self.errors.append('项目名: %s 错误信息: 原始数据中搜索%s时点的个数没有变化! 搜索之前点的个数: %d 搜索之后点的个数 %d'
                               % (self.projectName, content, pointsLength, len(pointsNow)))

    def searchWithValue(self, driver, value):
        #切换成点值搜索
        Select(driver.find_element_by_css_selector('#filterType')).select_by_value(value)
        #self.resetSearch(driver)


    def searchWithPointValue(self, driver, min, max, value, index):
        self.searchWithValue(driver, value)
        self.resetSearch(driver)
        #先获取点名
        points = [td.text for td in driver.find_elements_by_css_selector("#tableWatch tbody tr td:nth-child(%d)" % index)]
        pointsLength = len(points)
        #搜索开关点
        driver.find_element_by_css_selector('#filterMin').send_keys(min)
        driver.find_element_by_css_selector('#filterMax').send_keys(max)
        driver.find_element_by_css_selector('#filterConfirm').click()
        time.sleep(3)
        WebDriverTools.waitElementNotFound(driver, '.spinnerMask', self.testCaseID)
        pointsNow = [td.text for td in driver.find_elements_by_css_selector("#tableWatch tbody tr td:nth-child(%d)" % index)]
        if len(pointsNow) > pointsLength:
            for point in pointsNow:
                if not (min <= float(point)<= max):
                    WebDriverTools.get_pic(driver, self.testCaseID)
                    self.errors.append('项目名: %s 错误信息: 原始数据中搜索点值范围%s~%s结果中包含了不存在的点! 点名为: %s' % (
                    self.projectName, min, max, point))
        else:
            self.errors.append('项目名: %s 错误信息: 原始数据中搜索点值范围%s~%s时点的个数没有变化! 搜索之前点的个数: %d 搜索之后点的个数 %d'
                               % (self.projectName, min, max, pointsLength, len(pointsNow)))


    def searchWithDateRate(self, driver, dateStart, dateEnd, value, index):
        self.searchWithValue(driver, value)
        self.resetSearch(driver)
        # 先获取点名
        points = [td.text for td in driver.find_elements_by_css_selector("#tableWatch tbody tr td:nth-child(%d)" % index)]
        pointsLength = len(points)
        # 搜索开关点
        driver.find_element_by_css_selector('#pointDateStart').send_keys(dateStart)
        driver.find_element_by_css_selector('#pointDateEnd').send_keys(dateEnd)
        driver.find_element_by_css_selector('#filterConfirm').click()
        time.sleep(3)
        WebDriverTools.waitElementNotFound(driver, '.spinnerMask', self.testCaseID)
        pointsNow = [td.text for td in
                     driver.find_elements_by_css_selector("#tableWatch tbody tr td:nth-child(%d)" % index)]
        if len(pointsNow) > pointsLength:
            for point in pointsNow:
                if not (datetime.datetime.strptime(dateStart, '%Y-%m-%d %H:%M') <= (datetime.datetime.strptime(point, '%Y-%m-%d %H:%M') if point != '' else datetime.datetime.now() - datetime.timedelta(days=200)) <= datetime.datetime.strptime(dateEnd, '%Y-%m-%d %H:%M')):
                    WebDriverTools.get_pic(driver, self.testCaseID)
                    self.errors.append('项目名: %s 错误信息: 原始数据中搜索时间范围%s~%s结果中包含了不存在的点! 点名为: %s' % (
                        self.projectName, dateStart, dateEnd, point))
        else:
            self.errors.append('项目名: %s 错误信息: 原始数据中搜索时间范围%s~%s时点的个数没有变化! 搜索之前点的个数: %d 搜索之后点的个数 %d'
                               % (self.projectName, dateStart, dateEnd, pointsLength, len(pointsNow)))

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID, {'start': self.startTime, 'end': self.now})


if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case055('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)
