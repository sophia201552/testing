__author__ = 'sophia'

import datetime
import string
import time
import unittest, random
from time import sleep
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from Methods.LoginTools import LoginTools
from Methods.MemcacheTools import MemcacheTools
from Methods.WebDriverTools import WebDriverTools
from config import app
from selenium.webdriver.support.select import Select
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException

from selenium.webdriver.support.select import Select
# url = 'http://beop.rnbtech.com.hk'
url = "http://%s" % app.config['SERVERIP']
projName = "深圳华为演示用"
content1 = '一号冷机'
content2 = '二号冷机'


class Case041(unittest.TestCase):
    testCaseID = 'Case041'
    projectName = "WebFactory"
    buzName = 'Factory修改页面文本内容'
    start = 0.0
    now = 'None'
    startTime = ""

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID, {'start': self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChromeFactory(url, self.testCaseID)
        self.driver = lg.loginFactory(self.driver)

    def Test(self):
        sleep(2)
        driver = self.driver
        #driver.implicitly_wait(10)
        # 进入深圳华为演示用项目
        self.enterProj(driver)

        self.revise(driver, content2)
        self.verify(driver)
        self.driver.get(url + '/factory')
        self.enterProj(driver)
        self.revise(driver, content1)

    def enterProj(self, driver):
        sleep(4)
        projs = driver.find_elements_by_css_selector(".proText")
        if projs != []:
            # for p in projs:
            #     if projName in p.text :
            #         p.click()
            #         break
            js='$("span[title=\'深圳华为演示用\']").dblclick()'
            driver.execute_script(js)
        else:
            assert 0, "深圳华为演示用项目页左侧未找到项目!"
        sleep(2)

    def revise(self, driver, content1):
        # 修改页面内容
        sleep(2)
        # 进入到水系统测试页面
        try:
            page = WebDriverWait(driver, 5).until(
                lambda x: x.find_element_by_css_selector('a[title="自动化测试页面(测试用勿删) - PageScreen"]'))
            # page = driver.find_element_by_css_selector('a[title="自动化测试页面(测试用勿删) - PageScreen"]')
        except:
            self.driver.get_screenshot_as_file(
                r'.\ErrorPicture\%s\%s.png' % (self.testCaseID, time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0, '没有自动化测试页面'
        ActionChains(driver).double_click(page).perform()
        sleep(5)
        # 找到要修改的内容
        try:
            a = driver.find_element_by_id('146571063713060811c48dc8')
            ActionChains(driver).move_to_element(a).click().perform()
        except:
            print('需要修改的内容可能已经被删除')
        sleep(3)
        # 点击修改按钮
        a = WebDriverWait(driver, 10).until(
                lambda x: x.find_element_by_css_selector(".btnEditTxt.glyphicon.glyphicon-edit"))
        a.click()
        sleep(2)
        # 把内容定位到iframe里面
        driver.switch_to.frame("ueditor_0")
        sleep(4)
        driver.execute_script("document.getElementsByTagName('p')[0].innerHTML='" + content2 + "';")
        driver.switch_to_default_content()
        driver.find_element_by_id('btnSaveContent').click()
        sleep(2)
        # 保存
        driver.find_element_by_id('lkSync').click()
        # 发布页面
        driver.find_element_by_id('userAccount').click()
        driver.find_element_by_id('lkRelease').click()
        sleep(3)
        driver.find_element_by_id('inputPwd').send_keys('wuranxu312')
        driver.find_element_by_id('inputMsg').send_keys('123')
        driver.find_element_by_id('btnSubmit').click()
        WebDriverTools.waitElement(driver, '.btn.btn-info.alert-button', self.testCaseID,timeout=20)
        driver.find_element_by_css_selector('.btn.btn-info.alert-button').click()
        time.sleep(2)

    def verify(self, driver):
        # 跳到深圳华为演示用
        a = WebDriverTools()
        driver.get(url)
        WebDriverTools.waitElement(driver, 'div[project-id="189"]', self.testCaseID, timeout=20)
        WebDriverTools.enterProject(driver, 189, self.projectName)
        sleep(4)
        # 找到自动化测试页面
        driver.find_element_by_css_selector('a[pageid="14657106306886085c210bff"]').click()
        # 找到修改后的内容
        sleep(5)
        text = driver.find_element_by_id('146571063713060811c48dc8').text
        if (text == '一号冷机'):
            print('修改成功')
        else:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0, '修改失败'

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID, {'start': self.startTime, 'end': self.now})
        self.driver.quit()


if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case041('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)