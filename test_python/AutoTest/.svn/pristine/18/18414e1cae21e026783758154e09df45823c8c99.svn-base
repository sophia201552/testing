__author__ = 'sophia'
from Methods.LoginTools import LoginTools
from Methods.OtherTools import OtherTools
from Methods.MemcacheTools import MemcacheTools
import unittest
import datetime, time
from Methods.WebDriverTools import WebDriverTools
from config import app
from time import sleep
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
class Case074(unittest.TestCase):
    testCaseID = 'Case074'
    projectName = "DemoEn09"
    buzName = '检查Diagnosis-Diagnosis overview是否正常'
    now = 'None'
    url = "http://%s" % app.config['SERVERIP']
    project = (175,'DemoEn09')
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
        self.tools.enterProject(driver, self.project[0], self.project[1], self.errors)
        sleep(3)
        self.check(driver)
        OtherTools.raiseError(self.errors)

    #检查首页
    def check(self,driver):
        page=['Equipment','Diagnosis','Diagnosis overview']
        self.tools.enterPage(driver,page,'#indexMain', self.projectName)
        self.tools.checkSliderForCanvas(driver,self.errors,page,'ol.carousel-indicators > li')
        ele=driver.find_element_by_css_selector('#table1')
        self.tools.checkNull(ele,self.errors,page,'Faults ranking')
        # self.tools.checkFaultsRanking(driver,self.errors,page,'#sumTable')
        ele=driver.find_element_by_css_selector('.LZone')
        self.tools.checkNull(ele,self.errors,page,'Real time data')
        ele=driver.find_element_by_css_selector('#divContainer_1448524191101')
        self.tools.checkNull(ele,self.errors,page,'左上')
        self.tools.checkDiagnosticsSummary(driver,self.errors,page,'#accordion > div')

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case074('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)