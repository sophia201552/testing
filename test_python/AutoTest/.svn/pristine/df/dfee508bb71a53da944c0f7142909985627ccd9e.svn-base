__author__ = 'woody'
from Methods.WebDriverTools import WebDriverTools
from Methods.MemcacheTools import MemcacheTools
import datetime, time
from Methods.LoginTools import LoginTools
from config import app
from selenium.webdriver.common.keys import Keys
import unittest





points = {'Outdoor':'AutoTest1','Amp':'AutoTest2','Enter':'AutoTest3','Err':'AutoTest4','Auto':'AutoTest5'}


class Case022(unittest.TestCase):
    testCaseID = 'Case022'
    projectName = "不针对项目"
    buzName = '数据源中数据点的搜索功能'
    start = 0.0
    now = 'None'
    startTime = ""
    L = []
    url = "http://%s" % app.config['SERVERIP']
    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url,self.testCaseID)
        self.driver = lg.login(self.driver, 'tester1')

    def Test(self):
        driver = self.driver
        a = WebDriverTools()
        driver = self.driver
        time.sleep(4)
        self.EnterDataAnalysis(driver)
        self.Search(driver)





    def EnterDataAnalysis(self,driver):
        a = WebDriverTools()
        if a.isElementPresent(driver,'#iconList'):
            driver.find_element_by_id("iconList").click()
        else:
            assert 0,"用户登陆后未找到用户菜单!"
        driver.find_element_by_id('btnDataAnalys').click()
        a.waitSpinner(driver,'用户菜单--数据分析')
        time.sleep(2)



    def Search(self,driver):
        for key in points.keys():
            self.L.append(key)
        L = self.L
        try:
            for i in range(len(L)):
                driver.find_element_by_id("inputDsMineSearch").clear()
                driver.find_element_by_id("inputDsMineSearch").send_keys(L[i])
                driver.find_element_by_id("inputDsMineSearch").send_keys(Keys.ENTER)
                time.sleep(1)
                #获取数据组名字
                groups = driver.find_elements_by_css_selector("#treeMine li")
                if len(groups) >= 1:
                    print("数据组搜索成功!")
                else:
                    assert 0,"搜索数据点失败，结果无任何数据组!"
                time.sleep(1)
                if len(driver.find_elements_by_css_selector("#treeMine li")) >= 1:
                    print("搜索成功!")
                else:
                    assert 0,"数据分析->数据源搜索功能->数据组中无对应数据点!"
        except Exception as e:
            print(e)
            assert 0,"数据源搜索功能异常!"

    '''def ChangeGroupName(self,driver):
        #清空搜索条件
        driver.find_element_by_id("inputDsSearch").clear()
        driver.find_element_by_id("inputDsSearch").send_keys(Keys.ENTER)
        sleep(2)
        eles = driver.find_elements_by_css_selector(".showName")
        for ele in eles:
            ele.click()
            sleep(1)
            ele.find_element_by_css_selector("")'''


    def tearDown(self):
        self.driver.quit()
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})


