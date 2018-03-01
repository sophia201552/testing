__author__ = 'kirry'

import datetime
import time
import unittest
from time import sleep
from selenium.webdriver.common.keys import Keys
from Methods.LoginTools import LoginTools
from Methods.MemcacheTools import MemcacheTools
from Methods.WebDriverTools import WebDriverTools
from config import app
from Methods.OtherTools import OtherTools


class Case096(unittest.TestCase):
    testCaseID = 'Case096'
    projectName = "DemoEng09"
    buzName = '导出数据验证时间参数是否传递正常'
    start = 0.0
    now = 'None'
    startTime = ""
    url = "http://%s" % app.config['SERVERIP']
    def setUp(self):

        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID, {'start': self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver)

    def Test(self):
        sleep(2)
        self.errors=[]
        driver = self.driver
        # 进入demoEng09导出数据页面
        WebDriverTools.enterProject(driver,"175","demoEng09",self.errors)
        WebDriverTools.enterModuleByUserMenu(driver,"btnPointManager","数据管理","#dataManagerCloudMenu")
        self.checkexport(driver)
        OtherTools.raiseError(self.errors)

    def checkexport(self,driver):
        eles = driver.find_element_by_id('PointManagerExportData')
        eles.click()
        sleep(3)
        inputele1 = driver.find_element_by_id("batchHistoryTimeStart")
        inputele2 =driver.find_element_by_id("batchHistoryTimeEnd")
        buttonele = driver.find_element_by_id("exportData")
        startTime = datetime.datetime.strftime(datetime.datetime.now()-datetime.timedelta(days = 1),"%d/%m/%Y %H:%M")
        endTime = datetime.datetime.strftime(datetime.datetime.now(),"%d/%m/%Y %H:%M")
        inputele1.clear()
        inputele1.send_keys(startTime)
        inputele2.clear()
        inputele2.send_keys(endTime)
        buttonele.click()
        sleep(2)
        try:
            text = driver.find_elements_by_css_selector('body > div')[-1].text
            if "Invalid Date" in text:
                self.errors.append("%s中点击导出数据按钮后，确认消息中时间值有误"%self.projectName)
            else:
                print("弹出框内的数据正常")
            driver.find_elements_by_css_selector('body > div > div > button')[0].click()
        except:
            self.errors.append("数据管理页面中选取好时间后，点击导出数据，系统未弹出确认信息！")
        sleep(3)
        try:
            text = driver.find_elements_by_css_selector('body > div')[-1].text
            if "请求失败"in text:
                self.errors.append("导出数据请求失败！")
            else:
                print("导出数据成功！")
        except:
            self.errors.append("导出数据后未给出导出结果提示信息！")




    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID, {'start': self.startTime, 'end': self.now})
        self.driver.quit()


if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case096('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)