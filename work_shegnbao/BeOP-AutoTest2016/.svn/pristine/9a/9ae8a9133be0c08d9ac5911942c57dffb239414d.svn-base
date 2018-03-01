__author__ = 'woody'
from Methods.WebDriverTools import WebDriverTools
from Methods.MemcacheTools import MemcacheTools
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import ElementNotVisibleException
from selenium.webdriver.common.action_chains import ActionChains
import datetime, time, string, random
from Methods.LoginTools import LoginTools
from config import app
from selenium.webdriver.common.keys import Keys
import unittest, os
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support.select import Select
from selenium import webdriver
from time import sleep




class Case030(unittest.TestCase):
    testCaseID = 'Case030'
    projectName = "不针对项目"
    buzName = '登陆后版本信息等元素检查'
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
        self.driver = lg.login(self.driver)

    def Test(self):
        sleep(2)
        driver = self.driver
        #driver.implicitly_wait(8)
        self.findThings(driver,".project-media-panel.fl .nav li","地图搜索组件",4,0)
        sleep(1)
        #版本历史信息下线 20161207版本
        #self.findThings(driver,".map-beop-version-history","版本历史信息",0,0)
        #sleep(3)
        #driver.find_element_by_css_selector(".map-beop-version-history").click()
        #暂时屏蔽了版本信息详情
        #sleep(3)
        #self.findThings(driver,"#versionHistory-container .panel-body","版本历史信息详情",0,0)





    def findThings(self,driver,ele,name,amount,text):
        m = []
        try:
            m = driver.find_elements_by_css_selector(ele)
        except Exception as e:
            print(e.__str__())
            assert 0,"%s-%s-用户登陆后没有找到%s组件!" % (self.testCaseID,self.buzName,name)
        if len(m) > amount:
            print("%s-%s-用户登陆后找到%s组件,数量正常,为%d个!" % (self.testCaseID,self.buzName,name,len(m)))
        else:
            self.driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,"%s-%s-用户登陆后未找到%s组件,数量不正常,应大于%d个，为%d个!" % (self.testCaseID,self.buzName,name,amount,len(m))
        '''
        if text:
            for x in m:
                if x.text == "":
                    assert 0,"%s-%s-用户登陆后找到%s组件,但是里面无内容!" % (self.testCaseID,self.buzName,name)
                else:
                    print(x.text)
        else:
            pass
        '''

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID, {'start': self.startTime, 'end': self.now})

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case030('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)