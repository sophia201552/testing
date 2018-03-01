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
class Case048(unittest.TestCase):
    testCaseID = 'Case048'
    projectName = "上海华为"
    buzName = 'dashboard是否有数据'
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
        sleep(3)
        self.checkKPI(driver)
        self.checkEnergy(driver)

    def checkKPI(self,driver):
        page=['设备','KPI管理','KPI 汇总']
        self.tools.enterPage(driver,page,'#testCss', self.projectName)
        table=self.tools.openShades(driver)
        self.tools.checkNull(table,self.errors,page,'左侧导航数据')
        tr=WebDriverWait(driver, 10).until(lambda x: x.find_elements_by_css_selector('table.table.table-hover.table-hvac> tbody > tr'))
        tr[1].click()
        self.tools.checkPageCanvas(driver,[page],self.errors)
        #检查KPI标准设置
        page=['设备','KPI管理','KPI标准设置']
        self.tools.enterPage(driver,page,'#testCss', self.projectName)
        table=self.tools.openShades(driver)
        self.tools.checkNull(table,self.errors,page,'数据')

        # #检查达标率查询页面
        page=['设备','KPI管理','达标率查询']
        self.tools.enterPage(driver,page,'#paneCenter', self.projectName)
        ele=WebDriverWait(driver, 20).until(lambda x: x.find_element_by_css_selector('#accordion'))
        self.tools.checkNull(ele,self.errors,page,'左边数据')
        self.tools.checkPageCanvas(driver,[page],self.errors)

        page=['总览']
        self.tools.enterPage(driver,page,'#indexMain', self.projectName)

        driver.refresh()
        # #检查HVAC页面是否加载出来
        # page=[['设备','KPI管理','HVAC','昨今COP对比（kW/kW）'],['设备','KPI管理','HVAC','周最大趋近温度（℃）'],['设备','KPI管理','HVAC','一次供水温度（℃）'],
        #       ['设备','KPI管理','HVAC','一次回水温度（℃）'],['设备','KPI管理','HVAC','负载率（%）'],['设备','KPI管理','HVAC','板换供水温度（℃）'],
        #       ['设备','KPI管理','HVAC','每日最大蓄冰率'],['设备','KPI管理','HVAC','二次泵压差']]
        # for i in range(1,8):
        #     page.append(['设备','KPI管理','HVAC','蒸发温度0%d'%i] )
        #     page.append(['设备','KPI管理','HVAC','冷凝温度0%d'%i] )
        # self.tools.checkPageCanvas(driver,page,self.errors)

    def checkEnergy(self,driver):
        page=['设备','能效分析','能耗概览']
        self.tools.enterPage(driver,page,'#paneCenter', self.projectName)
        ele=driver.find_element_by_id('paneCenter')
        self.tools.checkNull(ele,self.errors,page,'数据')
        self.tools.checkPageCanvas(driver,[page],self.errors)
        page=[['设备','运行概况','冰蓄冷概览'],['设备','运行概况','冷水机组'],['设备','运行概况','冷冻水泵'],['运行概况','设备运行参数','冷却侧设备']]
        self.tools.checkPageCanvas(driver,page,self.errors)


    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case048('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)
