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
class Case088(unittest.TestCase):
    testCaseID = 'Case088'
    projectName = "上海华为"
    buzName = '检查Diagnosis Overview页面是否正常'
    now = 'None'
    url = "http://%s" % app.config['SERVERIP']
    project = (72,'上海华为')
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
        self.checkOperationSummary(driver)
        OtherTools.raiseError(self.errors)

    #检查诊断概览
    def checkOperationSummary(self,driver):
        page=['设备','系统诊断','诊断概览']
        self.tools.enterPage(driver,page,'#indexMain', self.projectName)
        self.tools.checkSliderForCanvas(driver,self.errors,page,'ol.carousel-indicators > li')
        self.tools.checkFaultsRankingList(driver,self.errors,page,'.MZone>.titleText>span','.mTableZone')
        Diagnosis=driver.find_element_by_css_selector('#screenZoom')
        self.tools.checkNull(Diagnosis,self.errors,page,'左上角部分')
        Diagnosis=driver.find_element_by_css_selector('.LZone')
        self.tools.checkNull(Diagnosis,self.errors,page,'左下角部分')
        self.tools.checkDiagnosticsSummary(driver,self.errors,page,'#accordion>.panel.panel-default',isChecked=True)


    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case088('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)