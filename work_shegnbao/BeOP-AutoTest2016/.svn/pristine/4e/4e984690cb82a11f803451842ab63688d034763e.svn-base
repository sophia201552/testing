__author__ = 'woody'
import datetime
import time
import unittest
from time import sleep

from Methods.LoginTools import LoginTools
from Methods.MemcacheTools import MemcacheTools
from Methods.WebDriverTools import WebDriverTools
from config import app
from selenium.webdriver.support.select import Select
from selenium.webdriver.support.wait import WebDriverWait
from Methods.OtherTools import OtherTools



class Case032(unittest.TestCase):
    testCaseID = 'Case032'
    projectName = "英文演示06项目"
    buzName = '诊断故障推送工单功能'
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
        self.errors = []
        sleep(2)
        driver = self.driver
        a = WebDriverTools()
        #进入演示06首页
        #driver.find_element_by_id("project-71-HuaweiSH-undefined").click()
        #a.waitSpinner(driver,"英文演示06-某研发中心")
        #a.enterPage(driver, ['Diagnosis', 'System diagnosis'], '.badge', self.projectName)
        #a.waitSpinner(driver,"英文演示06-某研发中心--Diagnosis--System diagnosis")
        #sleep(2)
        WebDriverTools.enterProject(driver, 71, self.projectName, self.errors)
        WebDriverTools.enterPage(driver, ['Diagnosis', 'System diagnosis'], '.badge', self.projectName)
        WebDriverTools.waitElementNotFound(driver, '.spinnerMask', self.testCaseID, timeout=20)
        text = self.createWork(driver)
        self.isCreated(driver, text)

    def createWork(self,driver):
        a = WebDriverTools()
        #for i in range(1,4):
            #floor = driver.find_element_by_id("building_"+str(i))
            #floor.click()
        text = None
        detail = driver.find_elements_by_css_selector("#subList_72 .div-nav-row.subBuilding")
        for d in detail:
            if d.find_element_by_css_selector(".badge.warningCount").text != "":
                d.find_element_by_css_selector("span:nth-child(1)").click()
                sleep(5)
                break



        #打开诊断日志，创建工单
        try:
            driver.find_element_by_css_selector("#btnWarningLog").click()
        except Exception as e:
            print(e.__str__())
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,"%s--%s项目--系统诊断页没有诊断信息！" % (self.testCaseID, self.projectName)

        sleep(1)
        fault = driver.find_elements_by_css_selector("#divPaneNoticeItem > div")
        faultNum = len(fault)
        print("%s--%s诊断页面故障个数为%d" % (self.testCaseID,self.projectName,faultNum))

        if faultNum:
            try:
                for f in fault:
                    if f.find_element_by_css_selector("div span:nth-last-child(2)").get_attribute("title") == "Create workflow order":
                        f.find_element_by_css_selector("div span:nth-last-child(2)").click()
                        sleep(3)
                        break
            except Exception as e:
                print(e.__str__())
                assert 0,"点击%s--%s诊断页面第一个故障时失败。" % (self.testCaseID,self.projectName)
        else:
            assert 0,"%s--%s诊断页面没有诊断内容!" % (self.testCaseID,self.projectName)
        '''
        if faultNum:
            try:
                for f in fault:
                    if f.find_element_by_css_selector("div span:nth-last-child(1)").get_attribute("title") != "Show workflow order":
                        f.find_element_by_css_selector("div span:nth-last-child(1)").click()
                        sleep(3)
                        break
            except Exception as e:
                print(e.__str__())
                assert 0,"点击%s--%s诊断页面第一个故障时失败。" % (self.testCaseID,self.projectName)
         '''

        try:
            WebDriverWait(driver, 10).until(lambda x: x.find_element_by_css_selector(".mb20.wf-table.wf-detail-table"))
        except Exception as e:
            print(e.__str__())
            a.get_pic(driver, self.testCaseID)
            assert 0,"%s--%s诊断页面创建诊断工单失败!未找到工单创建窗口!" % (self.testCaseID,self.projectName)


        #创建工单页面
        text = driver.find_element_by_css_selector('.mb20.wf-table.wf-detail-table tbody>tr td:nth-child(2) input').get_attribute('value')
        print(text)
        try:
            sleep(2)
            edit = driver.find_elements_by_css_selector(".input-group-addon .caret")
            for i in range(len(edit)):
                edit = driver.find_elements_by_css_selector(".input-group-addon .caret")
                edit[i].click()
                sleep(2)
                self.chooseMem(driver,['吴冉旭'])
                #确认
                #driver.find_element_by_css_selector("#workflow-insert-submit-btn").click()
                driver.find_element_by_css_selector("#wf-member-comfirm-btn").click()
                sleep(2)
            driver.find_element_by_css_selector("#workflow-insert-submit-btn").click()
            sleep(10)
            #WebDriverTools.waitElementNotFound(driver, '.spinnerMask', self.testCaseID, timeout=20)
        except Exception as e:
            print(e.__str__())
            WebDriverTools.get_pic(driver, self.testCaseID)
            assert 0,"%s--%s诊断页面创建诊断工单异常,请查看截图!" % (self.testCaseID, self.projectName)
        return text


    def isCreated(self,driver, text):
        #进入用户菜单
        WebDriverTools.clickEle(driver, "#iconList", self.testCaseID, self.projectName, '用户菜单', self.errors)
        #driver.find_element_by_css_selector("#iconList").click()
        try:
            WebDriverWait(driver,10).until(lambda x: x.find_element_by_id("paneWorkflow").is_displayed())
            #进入我的工单
            driver.find_element_by_css_selector("#paneWorkflow").click()
        except Exception as e:
            WebDriverTools.get_pic(driver, self.testCaseID)
            self.errors.append('英文演示06项目--诊断条目--新建工单后点击用户菜单失效, 可能是诊断发送工单失效!请查看截图验证！')
            OtherTools.raiseError(self.errors)
        WebDriverTools.waitSpinner(driver, '我的工单')
        now_handle = driver.current_window_handle
        handles = driver.window_handles
        WebDriverTools.switchWindow(driver, now_handle, handles)
        #进入我的工单
        driver.find_element_by_css_selector('li[data-param=createdBy] a').click()
        time.sleep(10)
        WebDriverTools.waitElement(driver, '.ellipsis.ellipsis_wf_title_name', self.testCaseID)
        #workerList = driver.find_elements_by_css_selector('.ellipsis.ellipsis_wf_title_name')
        rv = [driver.find_elements_by_css_selector('div.ellipsis.ellipsis_wf_title_name')[0].text, driver.find_elements_by_css_selector('.ellipsis.ellipsis_wf_title_name')[1].text]
        if text in rv:
            print('生成工单成功!')
        else:
            WebDriverTools.get_pic(driver, self.testCaseID)
            assert 0, "CaseID: %s 项目名: %s 诊断故障生成工单后--进入工单未找到该故障!!" % (self.testCaseID, self.projectName, )

    def chooseMem(self,driver,id):
        sleep(4)
        members = driver.find_elements_by_css_selector(".wf-member")
        if len(members) == 0:
            assert 0,self.testCaseID+"--"+self.projectName+"--"+"诊断页面创建工单后选择人员页面为空!"
        try:
            for m in members:
                if m.text in id:
                    m.click()
        except Exception as e:
            print(e.__str__())
            assert 0,self.testCaseID+"--"+self.projectName+"--"+"诊断页面创建工单后选择人员页面为空!"

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case032('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)