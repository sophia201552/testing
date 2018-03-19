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
class Case067(unittest.TestCase):
    testCaseID = 'Case067'
    projectName = "175LiverpoolStreet"
    buzName = '检查Plant页面是否正常'
    now = 'None'
    url = "http://%s" % app.config['SERVERIP']
    project = (293,'175LiverpoolStreet')
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
        self.checkDiagnosis(driver)
        OtherTools.raiseError(self.errors)

    #检查Operation Summary目录下的页面
    def checkDiagnosis(self,driver):
        pages=[['Plant','Chilled Water Schematic'],['Plant','Ch001'],['Plant','Ch002'],['Plant','Ch003'],
               ['Plant','PCHWP'],['Plant','CWP'],['Plant','STG1 Hot Water Schematic'],['Plant','STG2 Hot Water Schematic']]
        for page in pages:
            self.tools.enterPage(driver,page,'#indexMain', self.projectName)
            self.tools.checkMadeByFactroyPage(driver,self.errors,page,'文字')



    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case067('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)