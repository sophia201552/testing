__author__ = 'sophia'
from Methods.LoginTools import LoginTools
from Methods.OtherTools import OtherTools
from Methods.MemcacheTools import MemcacheTools
import unittest
import datetime, time
from Methods.WebDriverTools import WebDriverTools
from config import app
from time import sleep
from selenium.webdriver.support.wait import WebDriverWait
class Case050(unittest.TestCase):
    testCaseID = 'Case050'
    projectName = "上海华为"
    buzName = '查看更多,查看日报点击是否连接'
    now = 'None'
    url = "http://%s" % app.config['SERVERIP']
    project = (72,'上海华为')
    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID, {'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver)
        self.tools = WebDriverTools()

    def Test(self):
        driver = self.driver
        self.errors = []
        self.tools.enterProject(driver, self.project[0], self.project[1], self.errors)
        self.check(driver)
        OtherTools.raiseError(self.errors)

    def check(self,driver):
        sleep(3)
        # lis=driver.find_elements_by_css_selector('ol.carousel-indicators > li')
        # eles=['kpiSpan','','energyShape','runSpan']
        # link=['KPI运行','','费用汇总','运行汇总']
        # #lis.remove(lis[1])
        # for index,li in enumerate(lis):
        #     if index != 0 and index != 2:
        #         driver.back()
        #     if index == 1:
        #         button = None
        #     else:
        #         button = True
        #     if button:
        #         lis = driver.find_elements_by_css_selector('ol.carousel-indicators > li')
        #         lis[index].click()
        #         sleep(1)
        #         if index == 2:
        #             driver.execute_script("$('.energyShape').click()")
        #         else:
        #             button = driver.find_element_by_class_name(eles[index])
        #             button.click()
        #         report=WebDriverWait(driver, 10).until(lambda x: x.find_element_by_css_selector('#report-unit-1-1'))
        #         if( link[index] in report.text):
        #             print('点击查看更多跳转成功')
        #         else:
        #             self.errors.append('点击%s查看更多跳转失败!' %link[index])
        page=['设备','能效分析','能耗概览']
        self.tools.enterPage(driver,page,'#paneCenter', self.projectName)
        button=WebDriverWait(driver, 10).until(lambda x: x.find_element_by_class_name('moreButton'))
        button.click()
        text=driver.find_element_by_css_selector('.list-group-item.ellipsis.active').text
        if('能耗及费用日报'== text):
            print('点击查看更多跳转成功')
        else:
            self.errors.append('点击查看日报跳转失败')


    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case050('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)