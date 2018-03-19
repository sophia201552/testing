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


class Case018(unittest.TestCase):
    url = "http://%s" % app.config['SERVERIP']
    testCaseID = 'Case018'
    projectName = "不针对项目"
    buzName = '测试项目列表模式与地图导航模式的切换'
    start = 0.0
    now = 'None'
    startTime = ""
    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url,self.testCaseID)
        self.driver = lg.login(self.driver)

    def Test(self):
        #判断此时处于地图模式还是导航模式
        driver = self.driver
        #driver.implicitly_wait(8)
        mode = {}
        mode[list] = '.glyphicon.glyphicon-list'
        mode[map] = '.glyphicon.glyphicon-map-marker'
        tool = WebDriverTools()
        time.sleep(5)
        a = tool.isElementPresent(driver, mode[list])
        if a:
            #此时处于地图模式
            try:
                driver.find_element_by_css_selector(mode[list]).click()
            except Exception:
                driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
                assert 0,'从地图模式进入列表模式失败!'
            time.sleep(5)
            #此时进入了列表模式
            if driver.find_element_by_id("btnMapSelector").is_displayed():
                print("用户登陆->从地图模式切换到列表模式成功!")
            else:
                WebDriverTools.get_pic(driver, self.testCaseID)
                assert 0,'用户登陆->从地图模式切换到列表模式失败,列表模式失败!'
                driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
                assert 0,'用户登陆->从地图模式切换到列表模式失败,列表模式不该!'
                driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
                assert 0,'用户登陆->从地图模式切换到列表模式失败,列表模式失败!'
            #切换回地图模式
            time.sleep(5)
            try:
                driver.find_element_by_css_selector(mode[map]).click()
            except Exception:
                WebDriverTools.get_pic(driver, self.testCaseID)
                assert 0,'从列表模式进入地图模式失败!'
            time.sleep(5)
            if driver.find_element_by_css_selector(mode[list]).is_displayed():
                print("用户登陆->从地图模式切换到列表模式->从列表模式切换回地图模式成功!")
            else:
                driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
                assert 0,'用户登陆->从地图模式切换到列表模式->从列表模式切换回地图模式失败!'
        else:
            #此时处于列表模式
            try:
                driver.find_element_by_css_selector(mode[map]).click()
            except Exception:
                driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
                assert 0,'从列表模式进入地图模式失败!'
            time.sleep(5)
            #此时进入了地图模式
            if driver.find_element_by_css_selector(mode[list]).is_displayed():
                print("用户登陆->从列表模式切换到地图模式成功!")
            else:
                driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
                assert 0,'用户登陆->从列表模式切换到地图模式失败!'
            #切换回列表模式
            try:
                driver.find_element_by_css_selector(mode[list]).click()
            except Exception:
                driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
                assert 0,'从地图模式进入列表模式失败!'
            time.sleep(5)
            if driver.find_element_by_id("btnMapSelector").is_displayed():
                print("用户登陆->从列表模式切换到地图模式->从地图模式切换回列表模式成功!")
            else:
                driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
                assert 0,'用户登陆->从列表模式切换到地图模式->从地图模式切换回列表模式失败!'

    def tearDown(self):
        self.driver.quit()
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})


if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case018('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)
