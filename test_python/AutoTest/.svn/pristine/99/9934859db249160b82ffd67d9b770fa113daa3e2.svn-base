__author__ = 'wuranxu'

#2015-09-22

from Methods.WebDriverTools import WebDriverTools
from Methods.MemcacheTools import MemcacheTools
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.action_chains import ActionChains
import datetime, time, string, random
from Methods.LoginTools import LoginTools
from config import app
from selenium.webdriver.common.keys import Keys
from Methods.OtherTools import OtherTools
import unittest
from selenium.webdriver.support.wait import WebDriverWait


url = "http://%s" % app.config['SERVERIP']

class Case020(unittest.TestCase):
    testCaseID = 'Case020'
    projectName = "上海华为项目"
    buzName = '数据分析->数据源滚动条'
    start = 0.0
    now = 'None'
    startTime = ""
    errors = []
    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        OtherTools.setBrowser(lg, 'Firefox')
        self.driver = lg.InitialChrome(url,self.testCaseID)
        self.driver = lg.login(self.driver)


    def Test(self):
        self.errors = []
        driver = self.driver
        #进入上海华为首页
        a = WebDriverTools()
        driver = self.driver
        time.sleep(4)
        a.enterProject(driver, 72, '上海华为', self.errors)
        time.sleep(0.8)
        #进入上海华为总览页面
        #driver.find_element_by_css_selector("#ulPages li:nth-child(5) .nav-btn-a").click()
        #a.waitSpinner(driver, '上海华为项目->数据分析界面')
        WebDriverTools.enterModuleByUserMenu(driver, 'btnDataAnalys', '数据分析', '.breadcrumb')
        time.sleep(2)
        DataGroup = driver.find_elements_by_css_selector("#treeMine li")
        print("当前数据组数量为%d" % len(DataGroup))
        if len(DataGroup) > 23:
            try:
                DataGroup[-1].click()
                time.sleep(1)
            except Exception:
                driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
                assert 0,"上海华为->数据分析->当数据组数量超过23个的时候没有提供滚动条!"
        else:
            num = 24 - len(DataGroup)
            for x in range(0,num):
                driver.find_element_by_css_selector("#inputAddGroup").send_keys('TestAddGroup'+str(x))
                driver.find_element_by_css_selector("#inputAddGroup").send_keys(Keys.ENTER)
                time.sleep(1)
            now_group = driver.find_elements_by_css_selector("#treeMine li")
            print("添加数据组后数据组数量为%d" % len(now_group))
            try:
                now_group[-1].click()
                time.sleep(1)
            except Exception:
                driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
                assert 0,"上海华为->数据分析->当数据组数量超过23个的时候没有提供滚动条!"


    def tearDown(self):
        self.driver.quit()
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})


if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case020('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)


