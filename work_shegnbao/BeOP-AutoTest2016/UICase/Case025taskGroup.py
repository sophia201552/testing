__author__ = 'woody'

from Methods.WebDriverTools import WebDriverTools
from Methods.MemcacheTools import MemcacheTools
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import ElementNotVisibleException
from selenium.webdriver.common.action_chains import ActionChains
import datetime, time, string, random
from Methods.LoginTools import LoginTools
from config import app
from selenium.webdriver.common.keys import Keys
import unittest, os
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support.select import Select
from selenium import webdriver
from time import sleep

class Case025(unittest.TestCase):
    testCaseID = 'Case025'
    projectName = "不针对项目"
    buzName = '任务组增删改操作'
    start = 0.0
    now = 'None'
    startTime = ""
    url = "http://%s" % app.config['SERVERIP']
    errors = []
    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver, 'woody')

    def Test(self):
        self.errors[:] = []
        driver = self.driver
        a = WebDriverTools()
        driver = self.driver
        time.sleep(4)
        str1 = self.random_str(5)
        str2 = self.random_str(6)
        #进入工单

        self.EnterWorkOrder(driver)

        #添加任务组
        self.NewGroup(driver,str1)

        #进入刚添加的任务组
        self.FindAndEditGroup(driver,str1)

        #编辑任务组
        self.EditGroup(driver,str2)
        sleep(6)
        self.Compare(driver,str2)
        sleep(2)
        self.FindAndDelGroup(driver,str2)



    def EnterWorkOrder(self,driver):
        a = WebDriverTools()
        if a.isElementPresent(driver,'#iconList'):
            #找到用户菜单，并进入工单系统
            driver.find_element_by_id('iconList').click()
            driver.find_element_by_id("paneWorkflow").click()
            #a.find_spinner(driver,time.time(),project='点击用户菜单进入工单',timeout='23')
            sleep(7)
        else:
            assert 0,"登陆Beop后找不到用户菜单!"
        sleep(3)
        handles = driver.window_handles
        now_handle = driver.current_window_handle
        a.switchWindow(driver,now_handle,handles)

    def NewGroup(self,driver,GroupName):
        #点击添加任务组按钮
        #先进入项目页面
        WebDriverTools.clickEle(driver, '#wf-main-project-hash a', self.testCaseID, self.projectName, '我的工单--项目', self.errors)
        #driver.find_elements_by_css_selector('').click()
        group = len(driver.find_elements_by_css_selector('.fl.group-name'))
        #driver.execute_script("$('#wf-add-taskGroup').click()")
        #print(driver.find_element_by_css_selector("#wf-add-taskGroup").is_displayed())
        driver.find_element_by_css_selector("#wf-add-taskGroup").click()
        #输入任务组信息
        driver.find_element_by_css_selector("input[id='wf-group-name']").clear()
        driver.find_element_by_css_selector("input[id='wf-group-name']").send_keys(GroupName)
        driver.find_element_by_css_selector("textarea[id='wf-group-des']").clear()
        driver.find_element_by_css_selector("textarea[id='wf-group-des']").send_keys("该任务组新建出来测试工单是否能够\n输入正确的描述")
        #选择成员
        driver.find_element_by_css_selector(".glyphicon.glyphicon-edit.wf-people-add").click()
        sleep(2)
        #选择所有
        members = driver.find_elements_by_class_name("avatar-icon")
        if members == []:
            assert 0,'工单->创建任务组时没有看到成员!'
        for i in range(0,5):
            members[i].click()
        driver.find_element_by_css_selector("#wf-member-comfirm-btn").click()
        sleep(1)
        driver.find_element_by_css_selector("button[type='submit']").click()
        sleep(5)

        group_new = len(driver.find_elements_by_css_selector('.fl.group-name'))
        if group_new != group:
            print("创建任务组成功!")
        else:
            assert 0,"工单->任务->任务组创建失败!"

    def FindAndEditGroup(self,driver,GroupName):
        a = None
        groups = driver.find_elements_by_css_selector('.fl.group-name')
        if groups == []:
            assert 0,"任务组数量为0,请检查!"
        for group in groups:
            if group.find_element_by_css_selector(" span").get_attribute('title') == GroupName:
                #a = group.find_element_by_xpath("../span[2]")
                a = group.find_element_by_xpath("../../span")
                a.click()
                break
        a.find_element_by_xpath("../../ul/li[1]").click()
        sleep(3)

    def FindAndDelGroup(self,driver,GroupName):
        a = None
        groups = driver.find_elements_by_css_selector('.fl.group-name')
        if groups == []:
            assert 0,"任务组数量为0,请检查!"
        for group in groups:
            if group.find_element_by_css_selector(" span").get_attribute('title') == GroupName:
                #a = group.find_element_by_xpath("../span[2]")
                a = group.find_element_by_xpath("../../span")
                a.click()
                break
        a.find_element_by_xpath("../../ul/li[2]").click()
        try:
            WebDriverWait(driver, 15, 1, (ElementNotVisibleException)).\
                                until_not(lambda x: x.find_element_by_id("wf-event-confirm").is_displayed())
            sleep(2)
        except Exception:
            assert 0, "Case031删除任务组时spinner加载时间超过15秒！"

        try:
            driver.find_element_by_css_selector('#wf-event-confirm').click()
            sleep(4)
            if len(driver.find_elements_by_css_selector('.fl.group-name')) == len(groups):
                assert 0,"工单->任务->删除新增加的任务组失败!"
        except Exception as e:
            print(e)
            assert 0,"工单->任务->删除新增加的任务组失败!"
        sleep(2)
        new_groups = driver.find_elements_by_css_selector('.fl.group-name')
        g = []
        for x in new_groups:
            g.append(x)
        if GroupName in g:
            assert 0,"工单->任务->删除新增加的任务组失败!"
        else:
            print("工单->任务->删除新增加的任务组成功!")


    def EditGroup(self,driver,GroupName):
        driver.find_element_by_css_selector("input[id='wf-group-name']").clear()
        driver.find_element_by_css_selector("input[id='wf-group-name']").send_keys(GroupName)
        driver.find_element_by_css_selector("textarea[id='wf-group-des']").clear()
        driver.find_element_by_css_selector("textarea[id='wf-group-des']").send_keys("修改内容")
        #选择成员
        driver.find_element_by_css_selector(".glyphicon.glyphicon-edit.wf-people-add").click()
        sleep(2)
        #选择所有
        members = driver.find_elements_by_class_name("avatar-icon")
        if members == []:
            assert 0,'工单->编辑任务组时没有看到成员!'
        for i in range(len(members)):
            members[i].click()
            if i == 2:
                break
        driver.find_element_by_css_selector("#wf-member-comfirm-btn").click()
        sleep(1)
        driver.find_element_by_css_selector("button[type='submit']").click()
        sleep(3)



    def Compare(self,driver,GroupName):
        NewGroup = driver.find_elements_by_css_selector('.fl.group-name')
        Name = []
        for e in NewGroup:
            Name.append(e.text)

        if GroupName in Name:
            print('修改成功')
        else:
            assert 0,"修改任务组信息失败，任务组名字未修改!"


    def random_str(self, randomlength=8):
        a = list(string.ascii_letters)
        random.shuffle(a)
        return ''.join(a[:randomlength])

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})


if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case025('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)
