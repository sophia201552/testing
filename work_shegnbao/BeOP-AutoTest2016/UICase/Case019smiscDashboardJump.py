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



class Case019(unittest.TestCase):
    url = "http://%s" % app.config['SERVERIP']
    testCaseID = 'Case019'
    projectName = "上海中芯国际项目"
    buzName = '能耗统计页面dashboard超链接跳转'
    start = 0.0
    now = 'None'
    startTime = ""
    errors = []
    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver)


    def Test(self):
        self.errors = []
        driver = self.driver
        #进入上海华为首页
        a = WebDriverTools()
        driver = self.driver
        time.sleep(4)
        #driver.implicitly_wait(8)
        a.enterProject(driver, 1, '上海中芯国际项目', self.errors)
        time.sleep(2)


        #进入中芯国际--能耗统计页面
        driver.find_element_by_css_selector("a[pageid='555c41277ddcf3353c3eb403']").click()
        a.waitSpinner(driver,'上海中芯国际项目->能耗统计页面')
        time.sleep(1.9)
        dash = driver.find_elements_by_css_selector(".springContainer")
        if dash:
            fullsee = dash[0]
        else:
            assert 0, "进入中芯国际项目--能耗统计页面后没有找到dashboard!"
        ActionChains(driver).move_to_element(fullsee).perform()
        driver.find_element_by_css_selector("a[title='Link to 关键参数监测']").click()
        #a.find_spinner(driver,time.time(),'MyTest项目->测试组预留2页面->点击进入测试报表1-1页面','23')
        time.sleep(5)
        url = driver.current_url
        if "564ed099833c9710b996ae4a" in url:
            print("成功切换到测试报表1-1页面")
        else:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,'上海中芯国际项目->能耗统计页面->点击dashboard超链接进入关键参数监测页面失败,请检查!'

    def tearDown(self):
        self.driver.quit()
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case019('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)

