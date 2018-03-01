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
class Case071(unittest.TestCase):
    testCaseID = 'Case071'
    projectName = "DemoEn09"
    buzName = '检查Ice storage system overview是否正常'
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
        page=['Equipment','Operation','Ice storage system overview']
        self.tools.enterPage(driver,page,'#indexMain', self.projectName)
        self.tools.checkCanvas(driver,self.errors,page)
        lis=driver.find_elements_by_css_selector('#accordion >li')
        self.tools.checkHoverData(driver,self.errors,lis,page,'hover')
        self.tools.checkSliderForCanvas(driver,self.errors,page,'ol.carousel-indicators > li')



    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case071('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)