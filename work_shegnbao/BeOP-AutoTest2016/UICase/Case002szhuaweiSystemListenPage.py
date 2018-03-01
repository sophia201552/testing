'''
Created on 2015-06-16
@author: Markdorian
'''
import unittest
import time
import datetime
from Methods.MemcacheTools import MemcacheTools
from Methods.LoginTools import LoginTools
from Methods.WebDriverTools import WebDriverTools
from Methods.OldTools import OldTools
from Methods.OtherTools import OtherTools
tag1='Huawei Subtags-System Surveillance'

class Case002(unittest.TestCase):
    testCaseID='Case002'
    projectName='深圳华为'
    buzName='系统监控'
    start = 0.0
    now = 'None'
    startTime = ""
    browserName = 'Firefox'
    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        # OtherTools.setBrowser(lg, self.browserName)
        self.driver = lg.loginInitial_Chrome(self.testCaseID)
        self.driver = lg.loginnow(self.driver)
        #WebDriverTools.getBrowserVersion(self.driver, self.browserName)

    def pageload(self, pageid=[]):
        driver = self.driver
        
        driver.find_element_by_css_selector('#ulPages .caret').click()
        time.sleep(5)
        try:
            if len(pageid) > 0:
                for x in pageid:
                    driver.find_element_by_id(x).click()
                    WebDriverTools().getInstance().calculateTime(
                        driver, 'spinnerMask',tag1)
        except Exception:
            assert 0, tag1+'loading fail,please check it,thank you '

    def Test(self):
        a = WebDriverTools()
        driver = self.driver
        ls=['div[id="project-17-HuaweiPlant-undefined"]', 'div[project-id="17"]']
        OldTools.icon_view_login(driver,self.projectName,ls)
        time.sleep(3)
        '''iddics = {"#page-200000360": "运行诊断", "#page-210000364": "系统概况",
                  "#page-210000365": "Cold W-System", "#page-210000366": "First Cold-S", "#page-210000367":"Second Cold-S"}
        if len(iddics.keys()) > 0:
            for x in sorted(iddics.keys()):
                driver.find_element_by_css_selector('#ulPages .caret').click()
                time.sleep(5)
                try:
                    driver.find_element_by_css_selector(x).click()
                    ins = DriverWaitTime()
                    ins.calculateTime(driver, 'spinnerMask',tag1+">"+iddics.get(x))
                except Exception:
                    tag1+'Huawei System Surveillance--'+iddics.get(x)+'--loading fail,please check it,thank you '''''
        try:
            sv=driver.find_elements_by_css_selector('#ulObserverScreenList.dropdown-menu li a')
        except Exception:
            assert 0,self.projectName+'-'+self.buzName+'页面不存在'
        index = 2
        if len(sv) > 0:
            for i in range(2,len(sv)):
                try:
                    driver.find_element_by_css_selector('#ulPages .caret').click()
                except Exception:
                    assert 0,self.projectName+'-'+self.buzName+'点击下拉页面无效'
                try:
                    driver.find_elements_by_css_selector('#ulObserverScreenList.dropdown-menu li a')[i].click()
                    #a.find_spinner(driver,cur_time=time.time(),project=self.projectName,timeout="23")
                    time.sleep(3)
                    #index += 1
                except Exception:
                    assert 0,self.projectName+'-'+self.buzName+'-'+sv[i].text+'点击无效'


    def tearDown(self):
        self.driver.quit()
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case002('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)