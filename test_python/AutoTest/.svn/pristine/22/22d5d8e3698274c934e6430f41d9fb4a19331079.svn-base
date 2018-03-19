__author__ = 'Murphy'
import unittest
import datetime, time
from Methods.LoginTools import LoginTools
from Methods.MemcacheTools import MemcacheTools
from Methods.WebDriverTools import WebDriverTools
from config import app
from time import sleep


class Case079(unittest.TestCase):
    testCaseID = "Case079"
    projectName = ""
    buzName = "工单项目检查"
    now = 'None'
    url = "http://%s" % app.config['SERVERIP']

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startDT = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startDate = self.startDT.split(" ")[0]
        self.startTime = self.startDT.split(" ")[1]

        MemcacheTools.setMemTime(self.testCaseID,{"startTime":self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url,self.testCaseID)
        self.driver = lg.login(self.driver)

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

    def Test(self):
        driver = self.driver
        time.sleep(1)

        self.EnterWorkOrder(driver)
        self.WorkOderOperation(driver)
        sleep(3)

    def EnterWorkOrder(self, driver):
        a = WebDriverTools()
        if a.isElementPresent(driver, '#iconList'):
            driver.find_element_by_id('iconList').click()
            driver.find_element_by_id("paneWorkflow").click()
            sleep(3)
        else:
            assert 0,"登陆Beop后找不到用户菜单!"
        handles = driver.window_handles
        now_handle = driver.current_window_handle
        a.switchWindow(driver,now_handle,handles)
        sleep(1)

    def WorkOderOperation(self, driver):
        a = WebDriverTools()
        if a.isElementPresent(driver, '#wf-new-task'):
            driver.find_element_by_id('wf-new-task').click()
            sleep(1)

            driver.find_element_by_id('taskTitle').send_keys('testWorkOrder_' + self.startTime)
            driver.find_element_by_id('taskDueTime').send_keys(self.startDate)
            driver.find_element_by_id('wfDetail').send_keys('Detail_' + self.startDT)

            driver.find_element_by_id('wf-labelNames').click()
            sleep(1)

            driver.find_element_by_xpath("//select[@id='wf-labelNames']/option[2]").click()
            sleep(1)

            driver.find_element_by_id('wfWatchersAdd').click()
            sleep(1)

            # relative people
            driver.find_element_by_xpath("//div[@class='wf-search-result scrollbar']/div[8]").click()
            driver.find_element_by_id('wf-member-comfirm-btn').click()
            sleep(1)

            driver.find_element_by_xpath("//div[@id='taskProcess']/div[2]/div/div/span[1]").click()
            sleep(1)
            driver.find_element_by_xpath("//div[@class='wf-search-result scrollbar']/div[8]").click()
            driver.find_element_by_id('wf-member-comfirm-btn').click()
            sleep(1)

            driver.find_element_by_xpath("//div[@id='taskProcess']/div[3]/div/div/span[1]").click()
            sleep(1)
            driver.find_element_by_xpath("//div[@class='wf-search-result scrollbar']/div[8]").click()
            driver.find_element_by_id('wf-member-comfirm-btn').click()
            sleep(1)

            driver.find_element_by_id('taskSave').click()
            sleep(1)


if __name__ == "__main__":
    suit = unittest.TestSuite()
    suit.addTest(Case079('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suit)
