__author__ = 'Murphy'
import unittest
import datetime, time
from Methods.LoginTools import LoginTools
from Methods.MemcacheTools import MemcacheTools
from Methods.WebDriverTools import WebDriverTools
from config import app
from time import sleep

class Case078(unittest.TestCase):
    testCaseID = "Case078"
    projectName = ""
    buzName = "工单检查"
    now = 'None'
    url = "http://%s" % app.config['SERVERIP']

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
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

        #self.EnterWorkItem(driver)
        #sleep(3)

        self.AddWorkItem(driver)
        sleep(3)

    def EnterWorkOrder(self,driver):
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
        sleep(3)

    def EnterWorkItem(self,driver):
        a = WebDriverTools()
        if a.isElementPresent(driver, '#wf-main-project-hash'):
            driver.find_element_by_id('wf-main-project-hash').click()
            sleep(2)
            if a.isElementPresent(driver, '#wf-task-groups'):
                driver.find_element_by_xpath("//span[@title='【bug】BEOP WEB测试组']").click()
                sleep(1)
                if a.isElementPresent(driver, '#wf-task-table'):
                    table = driver.find_element_by_id('wf-task-table')
                    tbody = table.find_element_by_tag_name('tbody')
                    tr = tbody.find_element_by_tag_name('tr')
                    tr.click()
                else:
                    assert 0, "找不到对应工单名!"
        sleep(1)
        # check
        if a.isElementPresent(driver, '#workflow-task'):
            assert 1, "已打开对应工单!"
        else:
            assert 0, "未打开对应工单!"


    def AddWorkItem(self, driver):
        a = WebDriverTools()
        if a.isElementPresent(driver, '#wf-main-project-hash'):
            driver.find_element_by_id('wf-main-project-hash').click()
            sleep(2)
            driver.find_element_by_id("wf-add-taskGroup").click()
            sleep(2)
            driver.find_element_by_id('wf-group-name').send_keys('test' + self.startTime)
            driver.find_element_by_id('wf-group-des').send_keys('content' + self.startTime)

            #div = driver.find_element_by_class_name('checkbox')
            #div.find_element_by_tag_name('input').click()

            div = driver.find_element_by_xpath("//div[@class='checkbox col-sm-3'][1]/label/input")
            div.click()

            sleep(2)
            driver.find_element_by_xpath("//button[@title='保存']").click()

        sleep(2)
        strFind = "//li[@data-desc='content" + self.startTime + "']"
        li = driver.find_element_by_xpath(strFind)
        if li:
            assert 1, "项目添加成功!"
        else:
            assert 0, "项目添加失败!"



if __name__ == "__main__":
    suit = unittest.TestSuite()
    suit.addTest(Case078('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suit)
