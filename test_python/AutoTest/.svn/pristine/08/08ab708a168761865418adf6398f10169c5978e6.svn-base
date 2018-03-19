__author__ = 'Murphy'
import unittest
import datetime, time
from Methods.LoginTools import LoginTools
from Methods.MemcacheTools import MemcacheTools
from Methods.WebDriverTools import WebDriverTools
from config import app
from time import sleep
import poplib


class Case083(unittest.TestCase):
    testCaseID = "Case083"
    projectName = ""
    buzName = "工单邮件检查"
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

        self.email1 = 'workordertest01@rnbtech.com.hk'
        self.email2 = 'workordertest02@rnbtech.com.hk'
        self.email3 = 'workordertest03@rnbtech.com.hk'
        self.password =  'Rnbtech1103'
        self.pop3Server = 'pop3.mxhichina.com'
        self.mailCount1 = 0
        self.mailCount2 = 0
        self.mailCount3 = 0

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

    def Test(self):
        driver = self.driver
        time.sleep(1)

        self.CheckEMailFirst()
        self.EnterWorkOrder(driver)
        self.AddWorkOrder(driver)
        self.CheckEMailSecond()

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

    def AddWorkOrder(self, driver):
        a = WebDriverTools()
        if a.isElementPresent(driver, '#wf-main-task-hash'):
            driver.find_element_by_id('wf-main-task-hash').click()
            sleep(2)

            driver.find_element_by_id('wf-new-task').click()
            sleep(2)

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
            driver.find_element_by_xpath("//div[@class='wf-search-result scrollbar']/div[11]").click()
            driver.find_element_by_xpath("//div[@class='wf-search-result scrollbar']/div[12]").click()
            driver.find_element_by_xpath("//div[@class='wf-search-result scrollbar']/div[13]").click()
            driver.find_element_by_id('wf-member-comfirm-btn').click()
            sleep(1)

            driver.find_element_by_xpath("//div[@id='taskProcess']/div[2]/div/div/span[1]").click()
            sleep(1)
            driver.find_element_by_xpath("//div[@class='wf-search-result scrollbar']/div[12]").click()
            driver.find_element_by_id('wf-member-comfirm-btn').click()
            sleep(1)

            driver.find_element_by_xpath("//div[@id='taskProcess']/div[3]/div/div/span[1]").click()
            sleep(1)
            driver.find_element_by_xpath("//div[@class='wf-search-result scrollbar']/div[13]").click()
            driver.find_element_by_id('wf-member-comfirm-btn').click()
            sleep(1)

            driver.find_element_by_id('taskSave').click()
            sleep(3)

    def CheckEMailFirst(self):
        self.mailCount1 = self.GetEmailCount(self.email1, self.password)
        self.mailCount2 = self.GetEmailCount(self.email2, self.password)
        self.mailCount3 = self.GetEmailCount(self.email3, self.password)
        sleep(2)

    def CheckEMailSecond(self):
        sleep(10)
        mailCountAfter1 = self.GetEmailCount(self.email1, self.password)
        mailCountAfter2 = self.GetEmailCount(self.email2, self.password)
        mailCountAfter3 = self.GetEmailCount(self.email3, self.password)
        if self.mailCount1 < mailCountAfter1:
            assert 1, "账号1发邮件成功!"
        else:
            assert 0, "账号1发邮件失败!"
        if self.mailCount2 < mailCountAfter2:
            assert 1, "账号2发邮件成功!"
        else:
            assert 0, "账号2发邮件失败!"
        if self.mailCount3 < mailCountAfter3:
            assert 1, "账号3发邮件成功!"
        else:
            assert 0, "账号3发邮件失败!"

    def GetEmailCount(self, mailAddr, mailPwd):
        server = poplib.POP3(self.pop3Server)
        server.set_debuglevel(1)
        print(server.getwelcome().decode('utf-8'))
        server.user(mailAddr)
        server.pass_(mailPwd)
        print('Messages: %s. Size: %s' % server.stat())
        resp, mails, octets = server.list()
        print(mails)
        #self.mailCount1 = len(mails)
        server.quit()
        return len(mails)


if __name__ == "__main__":
    suit = unittest.TestSuite()
    suit.addTest(Case083('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suit)
