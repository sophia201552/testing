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
from selenium.webdriver.common.action_chains import ActionChains
class Case081(unittest.TestCase):
    testCaseID = 'Case081'
    projectName = "175LiverpoolStreet"
    buzName = '检查首页页面是否正常'
    now = 'None'
    url = "http://%s" % app.config['SERVERIP']
    project = (293,'175LiverpoolStreet')
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
        self.tools.enterModuleByUserMenu(driver, 'btnMemberManage', '后台管理', '#manageTab')
        sleep(3)
        driver.find_elements_by_css_selector('#manageTab >li')[1].click()
        sleep(5)
        driver.execute_script("$('.btn.btn-default.modify-btn').click()")
        sleep(5)
        text=driver.execute_script("a=$('.form-group.col-md-12').text();return a")
        if('项目类型和标识' in text and '真实项目' in text and '虚拟项目' in text and 'undefined' not in text):
            print('项目类型显示正确')
        else:
            self.errors.append('factory修改项目中项目类型和标识显示不正确,可能为undefined')
        OtherTools.raiseError(self.errors)



    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case081('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)