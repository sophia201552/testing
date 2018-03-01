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
class Case069(unittest.TestCase):
    testCaseID = 'Case069'
    projectName = "DemoEn09"
    buzName = '检查KPI Summary是否正常'
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
        self.checkKPISummary(driver)
        OtherTools.raiseError(self.errors)

    #检查首页
    def checkKPISummary(self,driver):
        page=['Equipment','KPI','KPI Summary']
        self.tools.enterPage(driver,page,'#indexMain', self.projectName)
        table=self.tools.openShades(driver)
        self.tools.checkNull(table,self.errors,page,'数据')
        trs=driver.find_elements_by_css_selector('.table.table-hover > tbody > tr')
        for tr in trs:
            if(tr.text!=''):
                text=tr.text
                tr.click()
                page.append(text)
                self.tools.checkCanvas(driver,self.errors,page)
                page.remove(text)


    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case069('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)