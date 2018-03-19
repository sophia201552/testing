__author__ = 'woody'
from Methods.LoginTools import LoginTools
from Methods.OtherTools import OtherTools
from Methods.MemcacheTools import MemcacheTools
import unittest
import datetime, time
from Methods.WebDriverTools import WebDriverTools
from config import app
from time import sleep
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support.select import Select


class Case061(unittest.TestCase):
    testCaseID = 'Case061'
    projectName = "梅赛德斯奔驰"
    buzName = '奔驰文化中心--保洁部门巡更报表检测'
    now = 'None'
    url = "http://%s" % app.config['SERVERIP']
    projectEle = 120
    pageList = ['巡更管理','巡更系统']
    department = ['奔驰文化中心-安保','奔驰文化中心-保洁','奔驰文化中心-工程']

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID, {'start': self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver)

    def Test(self):
        driver = self.driver
        self.errors = []
        WebDriverTools.enterProject(driver, self.projectEle, self.projectName, self.errors)
        WebDriverTools.enterPage(driver, self.pageList, '#paneCenter', self.projectName,timeout=60)
        for index, d in enumerate(self.department):
            self.enterDepartment(driver, index, d)
            sleep(2)
        if len(self.errors) >= 5:
            OtherTools.raiseError(self.errors)

    def checkReport(self, driver, department):
        #进入巡更报表页面
        items = driver.find_elements_by_css_selector('.list-group-item-heading')
        for item in items:
            if item.text == '巡更报表':
                item.click()
                break
        sleep(3)
        WebDriverTools.waitElementNotFound(driver, '.spinnerMask', self.testCaseID,timeout=30)
        #搜索所有报表里有红×的部分

        trs = driver.find_elements_by_css_selector('thead tr')
        if len(trs) == 1:
            self.errors.append('项目名: {} 巡更部门: {} 未找到报表记录！'.format(self.projectName, department))
            WebDriverTools.get_pic(driver, self.testCaseID)
        reds = driver.find_elements_by_css_selector('.xugengbad.glyphicon.glyphicon-remove')
        if reds:
            WebDriverTools.get_pic(driver, self.testCaseID)    
        #找到所有红叉的巡更班次以及日期
        for red in reds:
            dt = red.find_element_by_xpath('..').get_attribute('data-day')
            name = red.find_element_by_xpath('../../td[1]').text
            if '测试' in name:
                pass
            else:
                self.errors.append('项目名: {} 巡更部门: {} 日期: {} 巡更任务: {} 显示红叉!请检查!'.format(self.projectName, department, dt, name))

        driver.switch_to_default_content()



    def enterDepartment(self, driver, index, department):
        WebDriverTools.waitElementNotFound(driver, '.spinnerMask', self.testCaseID)
        links = driver.find_elements_by_css_selector('li a')
        for link in links:
            if link.text == department:
                link.click()
                break
        WebDriverTools.waitElementNotFound(driver, '.spinnerMask', self.testCaseID)
        sleep(2)
        WebDriverTools.switchToIframe(driver, self.testCaseID, '-'.join(self.pageList), index)
        self.checkReport(driver, department)



    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID, {'start': self.startTime, 'end': self.now})


if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case061('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)
