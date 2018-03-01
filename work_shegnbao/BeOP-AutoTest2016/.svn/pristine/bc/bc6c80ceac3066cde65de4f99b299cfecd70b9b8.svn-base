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
class Case063(unittest.TestCase):
    testCaseID = 'Case063'
    projectName = "175LiverpoolStreet"
    buzName = '检查Operation Summary--Energy Overview页面是否正常'
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
        self.checkOperationSummary(driver)
        OtherTools.raiseError(self.errors)

    #检查Operation Summary目录下的页面
    def checkOperationSummary(self,driver):
        page=['Operation Summary','Energy Overview']
        self.tools.enterPage(driver,page,'#paneCenter', self.projectName)
        self.tools.checkSliderForCanvas(driver,self.errors,page,'ol.carousel-indicators > li')
        self.tools.checkSystemSwitching(driver,self.errors,page,'.left-area','.btn-group.locOpM > button')
        buttons=['.calcBtn.btn.btn-success','.calcBtn.btn.btn-default','.calcBtn.btn.btn-default']
        right_text='.legendZone'
        self.tools.checkEnergyUseStatistics(driver,self.errors,page,buttons,right_text)
        driver.find_element_by_css_selector('.moreButton').click()
        leftCtn=WebDriverWait(driver, 10).until(lambda x: x.find_element_by_css_selector('#leftCtn'))
        if('Daily KPI Report' in leftCtn.text):
            print('点击morebutton可以跳转到Issues Classification Report报表')
        else:
            self.errors.append('点击%s页面里面的button按钮没有跳转到报表页面'%('--'.join(page)))


    def tearDown(self):
        if ("Exception" or "AssertionError" in str([x[1] for x in self._outcome.errors if x[1]!=None])) or self.errors:
            WebDriverTools.get_pic(self.driver, self.testCaseID)
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case063('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)