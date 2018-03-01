__author__ = 'woody'
'''
    created on 2016/04/12
'''
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


class Case037(unittest.TestCase):
    testCaseID = 'Case037'
    projectName = "梅赛德斯"
    buzName = '巡更点增删改操作'
    start = 0.0
    now = 'None'
    startTime = ""
    url = "http://%s" % app.config['SERVERIP']

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.loginPatrol(self.driver, self.url)



    def Test(self):
        driver = self.driver
        time.sleep(10)
        self.newPoint(driver)
        self.editPoint(driver)
        self.delPoint(driver)


    #新建巡更点
    def newPoint(self,driver):
        a = WebDriverTools()
        #获取当前巡更点个数
        now_points = driver.find_elements_by_css_selector("#tablePoints tbody tr")
        #新建巡更点
        button = a.isElementPresent(driver,"#btnAddpoint")
        WebDriverTools.waitElementNotFound(driver, '.spinnerMask', self.testCaseID, 100)
        if button:
            driver.find_element_by_css_selector("#btnAddpoint").click()
        else:
            assert 0,"进入%s/patrol页面没有找到新建巡更点按钮!" % self.url
        sleep(1)
        #输入巡更点名称，选择巡更类型，输入巡更要求，点击添加按钮
        driver.find_element_by_css_selector(".form-control.pointName").send_keys("AutoTestPoint")
        Select(driver.find_element_by_css_selector(".form-control.pointType")).select_by_value("1")
        driver.find_element_by_tag_name("textarea").send_keys("No requirement!")
        driver.find_element_by_css_selector("#btnSave").click()
        #等待2秒
        sleep(2)
        #对比是否新加了巡更点
        new_points = driver.find_elements_by_css_selector("#tablePoints tbody tr")
        if len(now_points) < len(new_points):
            print("巡更点添加成功!")
        else:
            assert 0,"巡更页面--巡更点添加失败，因为点个数没有变化!"

    #编辑巡更点
    def editPoint(self,driver):
        a = WebDriverTools()
        #获取当前巡更点个数
        now_points = driver.find_elements_by_css_selector("#tablePoints tbody tr")
        #找到刚才的巡更点
        point = now_points[-1]
        #选中该巡更点之后进行编辑
        point.click()
        driver.find_element_by_css_selector("#btnEditpoint").click()
        #a.find_spinner(driver,cur_time=time.time(),project="编辑巡更点")
        sleep(10)
        WebDriverTools.waitElement(driver, '.form-control.pointName', self.testCaseID, 15)
        driver.find_element_by_css_selector(".form-control.pointName").clear()
        driver.find_element_by_css_selector(".form-control.pointName").send_keys("自动化测试巡更点")
        Select(driver.find_element_by_css_selector(".form-control.pointType")).select_by_value("1")
        driver.find_element_by_tag_name("textarea").clear()
        driver.find_element_by_tag_name("textarea").send_keys("可以修改!")
        driver.find_element_by_css_selector("#btnSave").click()
        #等待2秒
        sleep(2)

    #验证该点是否编辑成功
    def verify(self,driver):
        point = driver.find_elements_by_css_selector("#tablePoints tbody tr")[-1]
        tdType = point.find_element_by_css_selector(".tdType").get_attribute("data-type")
        tdName = point.find_element_by_css_selector(".tdName").text
        tdContent = point.find_element_by_css_selector(".tdContent").text
        if tdType == "1" and tdName == "自动化测试巡更点" and tdContent == "可以修改":
            print("巡更点编辑成功!")
        else:
            assert 0,"新建的巡更点编辑失败!"





    def delPoint(self,driver):
        points = driver.find_elements_by_css_selector("#tablePoints tbody tr")
        #points[-1].click()
        #点击删除按钮
        driver.find_element_by_css_selector("#btnRemove").click()
        c = WebDriverTools.isElementPresent(driver,".infoBox-footer")
        if c:
            sure = [x for x in driver.find_elements_by_css_selector(".btn.btn-info.alert-button") if x.text == '确认']
            sure[0].click()
        else:
            assert 0,"选中新建的巡更点后，删除该巡更点时没有弹出对话框!"
        sleep(3)
        points2 = driver.find_elements_by_css_selector("#tablePoints tbody tr")
        a = len(points) - len(points2)
        if a:
            print("删除巡更点成功!")
        else:
            assert 0,"删除新建巡更点失败!"

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})




if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case037('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)
