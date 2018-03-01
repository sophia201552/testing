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
class Case070(unittest.TestCase):
    testCaseID = 'Case070'
    projectName = "DemoEn09"
    buzName = '检查Energy&cost overview是否正常'
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
        self.checkOverview(driver)
        OtherTools.raiseError(self.errors)

    #检查首页
    def checkOverview(self,driver):
        page=['Equipment','Energy&Cost','Energy&cost overview']
        self.tools.enterPage(driver,page,'#indexMain', self.projectName)
        buttons=['#btnDay','#btnWeek','#btnMonth']
        self.tools.checkEnergyUseStatistics(driver,self.errors,page,buttons,".legendZone")
        container=driver.find_element_by_css_selector('#divContainer_1448517799227')
        self.tools.checkNull(container,self.errors,page,'页面左上部分')
        self.tools.checkSliderForCanvas(driver,self.errors,page,'ol.carousel-indicators > li')
        buttons=['#btnCost0','#btnCost1']
        self.tools.checkSummary(driver,self.errors,page,buttons,'.statiZone')
        driver.find_element_by_css_selector('.moreButton').click()
        text=driver.find_element_by_css_selector('.list-group-item.ellipsis.active').text
        if(text =='Cost report'):
            print('点击button可以跳转到正确报表')
        else:
            self.errors.append('点击%s页面more按钮没有跳转到报表页面' %'--'.join(page))
    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case070('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)