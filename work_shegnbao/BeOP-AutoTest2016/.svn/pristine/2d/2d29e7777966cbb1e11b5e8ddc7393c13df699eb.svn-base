__author__ = 'woody'
import datetime
import string
import time
import unittest, random
from time import sleep

from Methods.LoginTools import LoginTools
from Methods.MemcacheTools import MemcacheTools
from Methods.WebDriverTools import WebDriverTools
from config import app


class Case033(unittest.TestCase):
    testCaseID = 'Case033'
    projectName = "不针对项目"
    buzName = '工单的标签的增删改等操作'
    start = 0.0
    now = 'None'
    startTime = ""
    orderNum = 0
    url = "http://%s" % app.config['SERVERIP']



    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver, 'woody')

    def Test(self):
        driver = self.driver
        time.sleep(4)
        #driver.implicitly_wait(8)
        #进入工单
        self.EnterWorkOrder(driver)
        #进入我的标签
        self.newMylabel(driver)
        self.editMylabel(driver)
        self.delMylabel(driver)



    def EnterWorkOrder(self,driver):
        a = WebDriverTools()
        if a.isElementPresent(driver,'#iconList'):
            #找到用户菜单，并进入工单系统
            driver.find_element_by_id('iconList').click()
            driver.find_element_by_id("paneWorkflow").click()
            sleep(7)
        else:
            assert 0,"登陆Beop后找不到用户菜单!"
        sleep(2)
        handles = driver.window_handles
        now_handle = driver.current_window_handle
        a.switchWindow(driver, now_handle, handles)

    def newMylabel(self,driver):
        #点击我的标签
        driver.find_element_by_id("wf-my-labelTitle").click()
        sleep(2)
        #获取当前标签个数
        labels = driver.find_elements_by_css_selector(".wf-label-li")
        len1 = len(labels)
        #进入编辑标签界面
        driver.find_element_by_id("wf-label-edit").click()
        sleep(1)
        #增加一个标签
        driver.find_element_by_id("wf-label-plus").click()
        sleep(3)
        s = self.random_str(randomlength=6)
        driver.find_elements_by_css_selector(".wf-label-li")[-1].find_element_by_tag_name("input").send_keys(s)
        #修改完毕后保存
        driver.find_element_by_id("wf-label-edit").click()
        sleep(3)
        len2 = len(driver.find_elements_by_css_selector(".wf-label-li"))
        if len2 == len1:
            assert 0,"%s--%s--%s--我的工单--我的标签新增失败!" % (self.testCaseID,self.projectName,self.buzName)
        sleep(2)



    def editMylabel(self,driver):
        edit = "edit"
        #修改新增加的标签名字
        driver.find_element_by_id("wf-label-edit").click()
        sleep(1)
        driver.find_elements_by_css_selector(".wf-label-li")[-1].find_element_by_tag_name("input").clear()
        driver.find_elements_by_css_selector(".wf-label-li")[-1].find_element_by_tag_name("input").send_keys(edit)
        sleep(1)
        driver.find_element_by_id("wf-label-edit").click()
        sleep(3)
        new_name = driver.find_elements_by_css_selector(".wf-label-li")[-1].text
        if new_name == edit:
            print("修改新增标签的名字成功!")
        else:
            assert 0,"%s--%s--%s--我的工单--我的标签新增后改名失败!" % (self.testCaseID, self.projectName, self.buzName)
        sleep(2)




    def delMylabel(self,driver):
        driver.find_element_by_id("wf-label-edit").click()
        sleep(1)
        l1 = len(driver.find_elements_by_css_selector(".wf-label-li"))
        #删除新增的标签
        driver.find_elements_by_css_selector(".glyphicon.glyphicon-remove.wf-label-delete")[-1].click()
        sleep(2)
        driver.find_element_by_id("wf-label-edit").click()
        sleep(1)
        l2 = len(driver.find_elements_by_css_selector(".wf-label-li"))
        if l1 == l2:
            assert 0,"%s--%s--%s--我的工单--我的标签新增标签后删除该标签失败!" % (self.testCaseID,self.projectName,self.buzName)
        sleep(2)



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



