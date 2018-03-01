__author__ = 'sophia'

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


class Case095(unittest.TestCase):
    testCaseID = 'Case095'
    projectName = "WebFactory"
    buzName = 'Factory中数据源搜索点是否出现多个相同的点名'
    start = 0.0
    now = 'None'
    startTime = ""
    url = "http://%s" % app.config['SERVERIP']
    def setUp(self):

        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID, {'start': self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChromeFactory(self.url, self.testCaseID)
        self.driver = lg.loginFactory(self.driver)

    def Test(self):
        sleep(2)
        self.errors=[]
        driver = self.driver
        # 进入深圳华为演示用项目
        WebDriverTools.enterProjForFactory(driver,self.errors,'$("span[title=\'深圳华为演示用\']").dblclick()')
        self.search(driver)
        OtherTools.raiseError(self.errors)

    def search(self,driver):
        WebDriverTools.enterPageForFactory(driver,self.errors,'a[title="自动化测试页面(测试用勿删) - PageScreen"]','自动化测试页面')
        eles=driver.find_elements_by_css_selector('.tab-handle-text')
        for ele in eles:
            if(ele.text=='数据源'):
                ele.click()
        sleep(3)
        WebDriverTools.select(driver,'#selectPrjName','青山湖源牌')
        driver.find_element_by_id('inputDsCloudSearch').send_keys('Plant001_Eff')
        driver.find_element_by_id('inputDsCloudSearch').send_keys(Keys.ENTER)
        sleep(3)
        trs=driver.find_elements_by_css_selector('#tableDsCloud >tbody>tr')
        if len(trs)==1:
            print('搜索出来的点只有一个')
        else:
            self.errors.append('数据源中搜索出来的点有%d个'%len(trs))




    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID, {'start': self.startTime, 'end': self.now})
        self.driver.quit()


if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case095('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)