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
class Case076(unittest.TestCase):
    testCaseID = 'Case076'
    projectName = "上海华为"
    buzName = '上海华为首页'
    now = 'None'
    url = "http://%s" % app.config['SERVERIP']
    project = (72, '上海华为')
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
        page=['首页']
        eles=driver.find_elements_by_css_selector('.col-xs-6')
        for ele in eles:
            self.tools.checkNull(ele,self.errors,page,'过冷过热区域汇总')

        eles=driver.find_elements_by_css_selector('.hwInfo')
        for ele in eles:
            if(ele.text!=''):
                self.tools.checkNull(ele,self.errors,page,'设备完好率或工单统计')

        ele=driver.find_elements_by_css_selector('.dashboardCtn')[-1]
        self.tools.checkNull(ele,self.errors,page,'优先处理故障列表')

        eles=driver.find_elements_by_css_selector('.rowList')
        for index,ele in enumerate(eles):
            ele.click()
            try:
                sleep(5)
                table=WebDriverWait(driver, 20).until(lambda x: x.find_element_by_class_name('diagnosisTable'))
                sleep(2)
                self.tools.checkNull(table,self.errors,page,'优先处理故障列表第%d个弹框'%index)
                print('优先处理故障列表点击出现了弹框')
            except Exception as e:
                print('上海华为优先处理故障')
                self.errors.append('上海华为首页优先处理故障列表第%d个弹框没有出现' %index)
            sleep(5)
            close=driver.find_element_by_css_selector('.btn.btn-primary')
            close.click()
            sleep(2)


    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

if __name__ == "__main__":

    suite = unittest.TestSuite()
    suite.addTest(Case076('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)
