__author__ = 'sophia'

from time import sleep
from Methods.WebDriverTools import WebDriverTools
from Methods.MemcacheTools import MemcacheTools
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import ElementNotVisibleException
from selenium.webdriver.common.action_chains import ActionChains
import datetime, time, string, random
from Methods.LoginTools import LoginTools
from selenium.webdriver.common.keys import Keys
import unittest, os
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support.select import Select
from selenium import webdriver
from config import app

url = "http://%s" % (app.config['SERVERIP'])
url_mess="http://%s/observer#page=AllMessages" % (app.config['SERVERIP'])

class Case043(unittest.TestCase):
    testCaseID = 'Case043'
    projectName = "不针对项目"
    buzName = '消息中心-查看消息等相关操作'
    start = 0.0
    now = 'None'
    startTime = ""

    def setUp(self):

        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(url, self.testCaseID)
        self.driver = lg.login(self.driver, 'tester3')

    def Test(self):
        sleep(2)
        driver = self.driver
        self.checkIsExist(driver)
        self.enterWorkOrder(driver)
        self.deleteProject(driver)
        self.addProject(driver)
        self.checkMessage(driver)
        self.deleteMessage(driver)
        self.deleteProject(driver)

    def checkIsExist(self,driver):
        driver.get(url_mess)
        sleep(7)
        self.deleteMessage(driver)
    def enterWorkOrder(self, driver):
        # 进入工单页面
        a = WebDriverTools()
        if a.isElementPresent(driver, '#iconList'):
            # 找到用户菜单，并进入工单系统
            driver.find_element_by_id('iconList').click()
            # 获取当前窗口的句柄
            index = driver.current_window_handle
            driver.find_element_by_id("paneWorkflow").click()
            # 获取当前打开的所有的窗口句柄
            all_handles = driver.window_handles
            # 进入新打开的窗口
            for handle in all_handles:
                if handle != index:
                    driver.switch_to_window(handle)
            sleep(7)
        else:
            assert 0, "登陆Beop后找不到用户菜单!"
        sleep(2)

    def addProject(self, driver):
        # 添加项目
        sleep(3)
        driver.find_element_by_id('wf-add-taskGroup').click()
        driver.find_element_by_id('wf-group-name').send_keys('消息中心测试')
        driver.find_element_by_id('wf-group-des').send_keys('消息中心出现问题')
        driver.find_element_by_css_selector('#wf-add-group-form > div:nth-child(5) > div > span').click()
        sleep(10)
        driver.find_element_by_css_selector("div[title='sophiatest']").click()
        driver.find_element_by_id('wf-member-comfirm-btn').click()
        sleep(2)
        driver.find_element_by_css_selector('#wf-add-group-form > div:nth-child(6) > div > button').click()
        sleep(2)
        # 添加多个工单
        for i in range(1, 3):
            self.addWorkOrder(driver, i)

    def addWorkOrder(self, driver, n=1):
        # 添加工单
        sleep(3)
        driver.find_element_by_id("wf-new-task").click()
        sleep(3)
        driver.find_element_by_css_selector("input[name='title']").send_keys("工单" + str(n))
        driver.find_element_by_id("dueTime").click()
        sleep(2)
        driver.find_elements_by_xpath("//td[@class='day new']")[-1].click()
        element = driver.find_element_by_css_selector("select[name='groupId']")
        select = Select(element)
        select.select_by_visible_text("消息中心测试")
        driver.find_element_by_id('wfDetail').send_keys("消息中心工单"+ str(n))
        driver.find_element_by_css_selector("span[data-type='executor']").click()
        sleep(6)
        driver.find_element_by_css_selector("div[title='sophiatest']").click()
        driver.find_element_by_id('wf-member-comfirm-btn').click()
        sleep(4)
        driver.find_element_by_css_selector("span[data-type='verifiers']").click()
        sleep(5)
        driver.find_element_by_css_selector("div[title='sophiatest']").click()
        driver.find_element_by_id('wf-member-comfirm-btn').click()
        sleep(2)
        driver.find_element_by_id('wf-task-new-submit').click()
        sleep(2)
        #点击开始按钮
        driver.find_element_by_id('wf-detail-start').click()
        sleep(2)
        #点击完成按钮
        driver.find_element_by_id('wf-detail-complete').click()
        sleep(2)
        #点击通过按钮
        driver.find_element_by_id('wf-verify-pass').click()


    def checkMessage(self, driver):
        driver.refresh()
        sleep(10)
        text_first = driver.find_element_by_css_selector('#messageAll > a > div').text
        if (int(text_first) == 8):
            print("消息通知的数字显示正确")
        else:
            assert 0, '消息通知的数字显示不正确，请查看是否是以前的消息没有清零'

        # 获取当前的链接验证是否跳转到了正确的页面，验证点击第一条通知的链接后，消息通知的数字是否变化
        driver.find_element_by_css_selector("#messageAll>a").click()
        # 点击第一条的对勾，验证通知数量会不会少
        all=driver.find_elements_by_css_selector('.unread.markAsRead')
        driver.find_elements_by_css_selector('.unread.markAsRead')[0].click()
        sleep(6)
        text_th = driver.find_element_by_css_selector('#messageAll > a > div').text
        if (int(text_th) == 7):
            print("消息通知的数字减少1")
        else:
            assert 0, '消息通知的数字显示不正确，请查看'

        # 查看全部消息中的内容
        driver.find_element_by_id('messageShowAll').click()
        sleep(3)
        trs1 = driver.find_elements_by_class_name("col-sm-12")
        sleep(2)
        if (len(trs1)  == 8):
            print('全部消息显示数目正确')
        else:
            assert 0, '全部消息显示数目不正确，请查看'
        # 查看未读消息中的内容
        driver.find_elements_by_class_name('nav-title')[1].click()
        sleep(3)
        trs_not_read = driver.find_elements_by_class_name("col-sm-12")
        if (len(trs_not_read)  == 7):
            print("未读消息中的数目是正确的")
        else:
            assert 0, '未读消息中的数目不正确，请查看'
        driver.find_elements_by_css_selector('.message-check.message-check-item')[0].click()
        driver.find_element_by_css_selector('a[class="btn btn-default msg-mark-as-read"]').click()
        sleep(3)
        trs_not_read = driver.find_elements_by_class_name("col-sm-12")
        if (len(trs_not_read)  == 6):
            print("未读消息中的数目是正确的")
        else:
            assert 0, '未读消息中的数目不正确，请查看'
        # 查看已读消息中的数目
        driver.find_elements_by_class_name('nav-title')[2].click()
        sleep(3)
        trs_already_read = driver.find_elements_by_class_name("col-sm-12")
        if (len(trs_already_read)  == 2):
            print("已读消息中的数目是正确的")
        else:
            assert 0, '已读消息中的数目不正确，请查看'
        # 删除已读的信息
        driver.find_element_by_css_selector('input[class="message-check message-check-all"]').click()
        driver.find_element_by_css_selector('a[class="btn btn-default msg-delete"]').click()
        sleep(3)
        trs_already_read = driver.find_elements_by_class_name("col-sm-12")
        if (len(trs_already_read)  == 0):
            print("已读消息中的数目是正确的")
        else:
            assert 0, '已读消息中的数目不正确，请查看'

        # 点击全部已读后验证消息通知
        driver.find_element_by_css_selector("#messageAll>a").click()
        sleep(2)
        driver.find_element_by_css_selector('.mr5.markAsAllRead').click()
        driver.refresh()
        displayed = driver.find_element_by_css_selector('#messageAll > a > div').is_displayed()
        if (displayed == False):
            print('点击全部已读后，消息通知没有数字了')
        else:
            assert 0, '消息通知在点击全部已读后还有数字提示，请查看'

    def deleteMessage(self,driver):
        #删除全部消息
        sleep(3)
        driver.find_elements_by_class_name('nav-title')[0].click()
        sleep(2)
        driver.find_element_by_css_selector('input[class="message-check message-check-all"]').click()
        driver.find_element_by_css_selector('a[class="btn btn-default msg-delete"]').click()
        driver.back()
        sleep(5)
    def deleteProject(self, driver):
        try:
            mess_pro=driver.find_elements_by_css_selector('span[class="edit-group glyphicon glyphicon-edit fr"]')
            for m in range(len(mess_pro)):
                sleep(2)
                mess=driver.find_elements_by_css_selector('span[class="edit-group glyphicon glyphicon-edit fr"]')
                mess[0].click()
                ul=WebDriverWait(driver, 10).until(
                    lambda x: x.find_element_by_xpath("//span[@title='消息中心测试']/parent::span/parent::a/parent::div/following::ul"))
                sleep(2)
                ul.find_elements_by_tag_name('li')[1].click()
                sleep(2)
                driver.find_element_by_id('wf-event-confirm').click()
        except Exception as e:
            print(e.__str__())
            pass

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case043('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)