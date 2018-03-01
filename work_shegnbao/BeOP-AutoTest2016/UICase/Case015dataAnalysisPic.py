__author__ = 'wuranxu'
from Methods.WebDriverTools import WebDriverTools
from Methods.MemcacheTools import MemcacheTools
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.action_chains import ActionChains
import datetime, time, string, random
from Methods.LoginTools import LoginTools
from config import app
from selenium.webdriver.common.keys import Keys
import unittest
from selenium.webdriver.support.wait import WebDriverWait
from selenium.common.exceptions import NoSuchElementException
url = "http://%s" % app.config['SERVERIP']
#url = 'http://beop.rnbtech.com.hk'
#该case用来验证数据分析中，添加了自选图形之后切换界面自选图形不自动失去焦点

class Case015(unittest.TestCase):
    testCaseID = 'Case015'
    projectName = "深圳华为项目"
    buzName = '测试数据分析->自选图形'
    start = 0.0
    now = 'None'
    startTime = ""
    errors = []
    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(url,self.testCaseID)
        self.driver = lg.login(self.driver)


    def Test(self):
        a = WebDriverTools()
        driver = self.driver
        time.sleep(2)
        a.enterProject(driver, 17, self.projectName, self.errors)
        time.sleep(1)
        driver.find_element_by_id('iconList').click()
        driver.find_element_by_id('btnDataAnalys').click()
        a.waitSpinner(driver, '数据分析')
        driver.find_element_by_css_selector(".breadcrumb>li>a").click()
        time.sleep(1.5)
        driver.find_elements_by_css_selector(".wsCtn")[0].click()
        a.click_image(driver)
        a.waitSpinner(driver, "数据分析->工作集->工作空间->左侧第一个工作空间")
        time.sleep(1.5)
        driver.find_element_by_id("graphSelsect").click()
        time.sleep(0.5)
        driver.find_element_by_css_selector("span[class~='glyphicon-arrow-right']").click()
        time.sleep(0.8)
        color = driver.find_elements_by_css_selector("div[class='colorList'] span")
        try:
            color[4].click()
        except:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,"数据分析->无法选择自选图形的样式(箭头,方块和圆圈)!"

        time.sleep(0.5)
        driver.find_element_by_css_selector(".breadcrumb>li>a").click()
        time.sleep(1)
        driver.find_elements_by_css_selector(".wsCtn")[0].click()
        time.sleep(1)
        a.click_image(driver)
        time.sleep(5)
        condition = a.isElementPresent(driver,"#graphSelsect")
        try:
            driver.find_element_by_id("graphSelsect").click()
        except Exception:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,'数据分析->选择自选图形之后切换slider->自选图形丢失！'
        time.sleep(1.5)
        #driver.find_element_by_css_selector("i[class~='icon-arrow-right']").click()
        time.sleep(0.5)
        driver.find_element_by_css_selector("div[class='colorList'] span:nth-child(5)").click()
        time.sleep(30)
        driver.find_element_by_css_selector(".breadcrumb>li>a").click()
        time.sleep(0.5)
        try:
            driver.find_elements_by_css_selector(".wsCtn")[0].click()
        except Exception:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,"深圳华为->数据分析中，添加了自选图形之后切换界面自选图形不自动失去焦点导致工作集视图下仍然处于画图模式!"

    def tearDown(self):
        self.driver.quit()
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

