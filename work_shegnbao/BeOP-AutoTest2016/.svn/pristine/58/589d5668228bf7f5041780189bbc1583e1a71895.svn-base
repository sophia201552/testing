__author__ = 'Murphy'
import unittest
import datetime, time
from Methods.LoginTools import LoginTools
from Methods.MemcacheTools import MemcacheTools
from Methods.WebDriverTools import WebDriverTools
from Methods.OtherTools import OtherTools
from config import app
from time import sleep
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.wait import WebDriverWait

class Case098(unittest.TestCase):
    testCaseID = "Case098"
    projectName = ""
    buzName = "添加数据源后标题栏消失"
    now = 'None'
    url = "http://%s" % app.config['SERVERIP']
    project = (72, '上海华为', ['设备', '系统诊断', '系统诊断'], '#indexMain')

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{"startTime":self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver)
        self.tools = WebDriverTools()

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

    def Test(self):
        driver = self.driver
        self.errors = []

        self.tools.enterProject(driver, self.project[0], self.project[1], self.errors)
        sleep(3)

        self.tools.enterPage(driver, self.project[2], self.project[3], self.project[1], timeout=180)
        sleep(3)

        self.ReappearFunction(driver)

        OtherTools.raiseError(self.errors)

    def ReappearFunction(self, driver):
        action = ActionChains(driver)
        can = driver.find_element_by_xpath('//div[@id="floorCt"]')
        action.move_to_element(can).click()
        action.move_by_offset(180, 60)
        action.move_by_offset(30, 30).click().perform()
        #sleep(5)
        #WebDriverWait(driver, 20).until(lambda x: x.find_element_by_css_selector('#selectGroup'))
        driver.find_element_by_css_selector(".lkAddToDS").click()
        sleep(3)
        driver.find_element_by_id("selectGroup").click()
        driver.find_element_by_xpath('//option[@value="57b11417833c97391d022d79"]').click()
        sleep(3)
        driver.find_element_by_id("btnImportJump").click()
        sleep(3)

        driver.find_element_by_xpath('//a[@pageid="148057159498150889cba340"]').click()
        sleep(3)
        title = driver.find_element_by_id("scrollPages")
        if title.size['height'] < 80:
            self.errors.append('数据点加入数据分析，然后去点菜单的时候点不开！')


if __name__ == "__main__":
    suit = unittest.TestSuite()
    suit.addTest(Case098('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suit)
