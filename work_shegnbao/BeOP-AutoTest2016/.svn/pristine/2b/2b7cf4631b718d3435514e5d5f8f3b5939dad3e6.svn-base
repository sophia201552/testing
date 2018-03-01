__author__ = 'sophia'
import unittest
import datetime
import time
from time import sleep

from Methods.LoginTools import LoginTools
from Methods.OtherTools import OtherTools
from Methods.MemcacheTools import MemcacheTools
from Methods.WebDriverTools import WebDriverTools
from config import app
from selenium.webdriver.common.keys import Keys

class Case093(unittest.TestCase):
    testCaseID = "Case093"
    projectName = "mytest"
    buzName = "检查数据诊断诊断页面历史曲线是否显示"
    now = 'None'
    url = "http://%s" % app.config['SERVERIP']
    project = [49, "mytst项目"]

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID, {"startTime": self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver)

    def Test(self):
        driver = self.driver
        self.errors = []
        WebDriverTools.enterProject(driver, self.project[0], self.projectName, self.errors)
        sleep(3)
        self.check(driver)
        OtherTools.raiseError(self.errors)

    def check(self, driver):
        page=['数据管理,数据诊断,诊断模块历史曲线']
        WebDriverTools.enterModuleByUserMenu(driver, 'btnPointManager', '数据管理', '#dataManagerCloudMenu')
        driver.find_elements_by_css_selector('.pointManagerCloudPointUl')[3].find_elements_by_css_selector('li')[-1].click()
        sleep(5)
        lis=driver.find_elements_by_css_selector('#diagnosisFilesUl >li')
        for li in lis:
            if(li.text=='sample'):
                li.find_element_by_css_selector('span').click()
                li.find_elements_by_css_selector('ul>li')[0].find_element_by_css_selector('a').click()
                driver.find_element_by_css_selector('#generateCurve').click()
                WebDriverTools.checkCanvas(driver,self.errors,page)
                driver.find_element_by_css_selector('#diagnosisCurveDateStart').click()
                sleep(2)
                driver.find_elements_by_css_selector('.day.active')[0].click()
                sleep(2)
                driver.find_elements_by_css_selector('.hour.active')[0].click()
                sleep(2)
                driver.find_elements_by_css_selector('.minute.active')[0].click()
                sleep(2)
                driver.find_element_by_css_selector('#diagnosisCurveDateEnd').click()
                sleep(2)
                driver.find_elements_by_css_selector('.day.active')[1].click()
                sleep(2)
                driver.find_elements_by_css_selector('.hour.active')[1].click()
                sleep(2)
                driver.find_elements_by_css_selector('.minute.active')[1].click()
                sleep(2)
                driver.find_element_by_css_selector('#filterCurveConfirm').click()
                #driver.find_element_by_css_selector('.btn.btn-info.alert-button').click()
                sleep(2)
                WebDriverTools.checkCanvas(driver,self.errors,page)


    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID, {'start': self.startTime, 'end': self.now})


if __name__ == "__main__":
    suit = unittest.TestSuite()
    suit.addTest(Case093('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suit)
