__author__ = 'kirry'
from Methods.LoginTools import LoginTools
from Methods.OtherTools import OtherTools
from Methods.MemcacheTools import MemcacheTools
import unittest
import datetime, time
from Methods.WebDriverTools import WebDriverTools
from config import app
from time import sleep
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains

class Case075(unittest.TestCase):
    testCaseID = "Case075"
    projectName = "金钟广场"
    buzName = "检查页面首页是否正常"
    now = 'None'
    url = "http://%s" % app.config['SERVERIP']
    project = [318,"金钟广场"]
    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{"startTime":self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url,self.testCaseID)
        self.driver = lg.login(self.driver)
    def Test(self):
        driver = self.driver
        self.erro = []
        WebDriverTools.enterProject(driver,self.project[0],self.projectName,self.erro)
        sleep(3)
        self.checkIndex(driver)
        OtherTools.raiseError(self.erro)
    def checkIndex(self,driver):
        WebDriverTools.checkWeather(driver,self.erro,[self.project[1]])
        lis = driver.find_elements_by_css_selector("#kipList01 > div")
        WebDriverTools.checkHoverData(driver, self.erro, lis, [self.project[1]], "KPI显示鼠标放上去")
    #检查slider下边的值
        ele = driver.find_element_by_id("paneEnergyInfo")
        WebDriverTools.checkNull(ele,self.erro,[self.project[1]],"今日机房总耗能数")
        ele = driver.find_element_by_id("paneEffectInfo")
        WebDriverTools.checkNull(ele,self.erro,['金钟广场'],"当前机房能耗")
        lst = driver.find_elements_by_css_selector("ol.carousel-indicators > li")
        for index,eles in enumerate(lst):
            if index != 2:
                eles.click()
            sleep(10)
            countain = driver.find_elements_by_css_selector(".report-content.clearfix")
            WebDriverTools.checkNull(countain[index], self.erro, [self.projectName], "第%d个slider处"%(index+1))
            if index != 0:
                button = driver.find_element_by_css_selector(".item.active > .carousel-caption > .runRept >button")
                button.click()
                leftcsn = WebDriverWait(driver,10).until(lambda x : x.find_element_by_id("leftCtn"))
                if "运行报表"  in leftcsn.text:
                    print("点击更多按钮跳转到运行报表页面")
                    sleep(2)
                    driver.back()
                    sleep(3)
                    driver.find_elements_by_css_selector("ol.carousel-indicators > li")[2].click()
                    sleep(2)
                else:
                    self.erro.append('点击home页面slider里面的button按钮没有跳转到报表页面')
    def tearDown(self):
        if ("Exception" or "AssertionError" in str([x[1] for x in self._outcome.errors if x[1]!=None])) or self.erro:
            WebDriverTools.get_pic(self.driver, self.testCaseID)
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})
if __name__ == "__main__":
    suit = unittest.TestSuite()
    suit.addTest(Case075('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suit)












