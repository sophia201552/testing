__author__ = 'woody'
import unittest
import datetime
import time
from time import sleep
import os
from Methods.LoginTools import LoginTools
from Methods.OtherTools import OtherTools
from Methods.MemcacheTools import MemcacheTools
from Methods.WebDriverTools import WebDriverTools
from config import app
from selenium.webdriver.common.keys import Keys
import zipfile


class Case089(unittest.TestCase):
    testCaseID = "Case089"
    projectName = "英文演示06项目"
    buzName = "诊断项目反馈功能"
    now = 'None'
    url = "http://%s" % app.config['SERVERIP']
    projectId = 71
    errors = []

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID, {"startTime": self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver)

    def Test(self):
        driver = self.driver
        self.errors = []
        self.enterDiagnosis(driver)
        faultName, faultContent = self.openFeedBack(driver)
        self.createFeedBack(driver, faultName, faultContent)
        self.checkWorkFlow(driver, faultName)
        OtherTools.raiseError(self.errors)

    def enterDiagnosis(self, driver):
        WebDriverTools.enterProject(driver, self.projectId, self.projectName, self.errors)
        WebDriverTools.enterPage(driver, ['Diagnosis', 'System diagnosis'], '.badge', self.projectName)
        WebDriverTools.waitElementNotFound(driver, '.spinnerMask', self.testCaseID, timeout=20)

    def openFeedBack(self, driver):
        tool = WebDriverTools()
        detail = driver.find_elements_by_css_selector("#subList_72 .div-nav-row.subBuilding")
        if detail:
            for d in detail:
                if d.find_element_by_css_selector(".badge.warningCount").text != "":
                    d.find_element_by_css_selector("span:nth-child(1)").click()
                    sleep(5)
                    break
        else:
            self.errors.append('{}: {}--诊断页面没有楼层信息，请检查！请参考截图!'.format(self.testCaseID, self.projectName))
            tool.get_pic(driver, self.testCaseID)
            OtherTools.raiseError(self.errors)
        # 打开诊断日志，创建工单
        try:
            driver.find_element_by_css_selector("#btnWarningLog").click()
        except Exception as e:
            tool.get_pic(driver, self.testCaseID)
            self.errors.append("%s--%s项目--系统诊断页没有诊断日志！" % (self.testCaseID, self.projectName))
        sleep(1)
        fault = driver.find_elements_by_css_selector("#divPaneNoticeItem > div")
        faultNum = len(fault)
        print("%s--%s诊断页面故障个数为%d" % (self.testCaseID, self.projectName, faultNum))
        faultName, faultContent = None, None
        if faultNum:
            try:
                for f in fault:
                    p = f.find_elements_by_tag_name('p')
                    faultName = p[0].text
                    faultContent = p[1].text
                    if f.find_element_by_css_selector("div span:nth-last-child(1)").get_attribute(
                            "title") == "feedback":
                        f.find_element_by_css_selector("div span:nth-last-child(1)").click()
                        sleep(3)
                        break
            except Exception as e:
                self.errors.append("点击%s--%s诊断页面第一个故障时失败。详细信息: %s" % (self.testCaseID, self.projectName, e.__str__()))
        else:
            tool.get_pic(driver, self.testCaseID)
            self.errors.append("%s--%s诊断页面没有诊断内容!" % (self.testCaseID, self.projectName))
        print('诊断故障名: {} 故障内容: {}'.format(faultName, faultContent))
        return faultName, faultContent

    def createFeedBack(self, driver, faultName, faultContent):
        WebDriverTools.waitElement(driver, '#temp_user_comments_form', self.testCaseID)
        try:
            title = driver.find_element_by_css_selector('#feedbackTitle').text
            content = driver.find_element_by_css_selector('#feedbackDetail').text
            if not (faultName in title and faultContent in content):
                WebDriverTools.get_pic(driver, self.testCaseID)
                self.errors.append('{}: {}--诊断反馈标题或内容与右侧展示不一致!请检查'.format(self.testCaseID, self.projectName))
            driver.find_element_by_css_selector('#commentsContent').clear()
            driver.find_element_by_css_selector('#commentsContent').send_keys('test for feedback')
            WebDriverTools.waitElement(driver, '#temp_user_comments_form canvas', self.testCaseID)
            WebDriverTools.clickElementsByText(driver, '.btn.btn-primary', '确认')
        except Exception as e:
            WebDriverTools.get_pic(driver, self.testCaseID)
            self.errors.append('{}: {}--创建诊断反馈出错, 详细信息: {}'.format(self.testCaseID, self.projectName, e.__str__()))
            OtherTools.raiseError(self.errors)
        WebDriverTools.clickElementsByText(driver, '.btn.btn-info.alert-button', '确认')


    def checkWorkFlow(self, driver, title):
        #进入用户菜单
        WebDriverTools.clickEle(driver, "#iconList", self.testCaseID, self.projectName, '用户菜单', self.errors)
        try:
            time.sleep(5)
            WebDriverTools.waitElement(driver, '#paneWorkflow', self.testCaseID)
            #进入我的工单
            driver.find_element_by_css_selector("#paneWorkflow").click()
        except Exception as e:
            WebDriverTools.get_pic(driver, self.testCaseID)
            self.errors.append('{}--诊断条目--新建诊断反馈工单后点击用户菜单失效, 可能是诊断发送工单失效!请查看截图验证！'.format(self.testCaseID))
            OtherTools.raiseError(self.errors)
        WebDriverTools.waitSpinner(driver, '我的工单')
        now_handle = driver.current_window_handle
        handles = driver.window_handles
        WebDriverTools.switchWindow(driver, now_handle, handles)
        #进入我的工单
        driver.find_element_by_css_selector('li[data-param=createdBy] a').click()
        time.sleep(10)
        #WebDriverTools.waitElement(driver, '.ellipsis.ellipsis_wf_title_name', self.testCaseID)
        #workerList = driver.find_elements_by_css_selector('.ellipsis.ellipsis_wf_title_name')
        rv = [driver.find_elements_by_css_selector('div.ellipsis.ellipsis_wf_title_name')[0].text, driver.find_elements_by_css_selector('.ellipsis.ellipsis_wf_title_name')[1].text]
        if title in ' '.join(rv):
            print('生成工单成功!')
        else:
            WebDriverTools.get_pic(driver, self.testCaseID)
            assert 0, "CaseID: %s 项目名: %s 诊断故障生成工单后--进入工单未找到该故障!!" % (self.testCaseID, self.projectName, )


    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID, {'start': self.startTime, 'end': self.now})


if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case089('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)
