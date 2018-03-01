__author__ = 'sophia'

import datetime
import string
import time
import unittest, random
from time import sleep
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from Methods.LoginTools import LoginTools
from Methods.MemcacheTools import MemcacheTools
from Methods.WebDriverTools import WebDriverTools
from config import app
from selenium.webdriver.support.select import Select




class Case039(unittest.TestCase):
    testCaseID = 'Case039'
    projectName = "梅赛德斯"
    buzName = '巡更人员增删改'
    start = 0.0
    now = 'None'
    startTime = ""
    # itemCount = 3
    # total = 37
    url = "http://%s" % app.config['SERVERIP']

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.loginPatrol(self.driver, self.url)

    def Test(self):
        sleep(2)
        driver = self.driver
        self.newExecutor(driver)
        self.editExecutor(driver)
        self.deleteExecutor(driver)

    def newExecutor(self, driver):
        #进入巡更人员页面
        sleep(7)
        WebDriverTools.waitElementNotFound(driver, '.spinnerMask', caseID=self.testCaseID,timeout=15)
        driver.find_element_by_css_selector('#listNav a:nth-child(3)').click()
        time.sleep(4)
        data_before = driver.find_elements_by_css_selector('#patroPersonList >div')
        #查看新建按钮是否存在
        a = WebDriverTools()
        flag = a.isElementPresent(driver,"#addPersons")
        if(flag):
            driver.find_element_by_css_selector('#addPersons').click()
        else:
            assert 0,'新建按钮不存在'
        #新建巡更人员
        driver.find_element_by_css_selector('.perCodeCon').send_keys('--')
        driver.find_element_by_css_selector('.perNameCon').send_keys('李四')
        element = driver.find_element_by_css_selector('.perSexCon')
        select = Select(element)
        select.select_by_visible_text("男")
        time.sleep(2)
        driver.find_element_by_css_selector('.perDepartCon').send_keys('保安部')
        driver.find_element_by_css_selector('#btnAdd').click()
        time.sleep(2)
        data_after = driver.find_elements_by_css_selector('#patroPersonList >div')
        if(len(data_after)-len(data_before) != 1):
            WebDriverTools.get_pic(driver, self.testCaseID)
            assert 0,'新建巡更人员失败'
        else:
            executor = data_after[-1]
            code = executor.find_element_by_css_selector('div:nth-child(1) > lable').text
            name = executor.find_element_by_css_selector('div:nth-child(2) > lable').text
            sex = executor.find_element_by_css_selector('div:nth-child(3) > lable').text
            depart = executor.find_element_by_css_selector('div:nth-child(4) > lable').text
            if(code !='--' or name != '李四' or sex !='男' or depart!='保安部'):
                assert 0,'新建的巡更人员的信息不一致，请检查'
            else:
                print('新建巡更人员成功')

    #编辑巡更人员
    def editExecutor(self,driver):
        #获取刚才新建的巡更人员
        executor = driver.find_elements_by_css_selector('#patroPersonList >div')[-1]
        #选中该巡更人员
        executor.click()
        #driver.find_elements_by_css_selector('#changePerson')[0].click()
        #查看编辑巡更人员按钮是否存在
        a = WebDriverTools()
        flag = a.isElementPresent(driver,'#changePerson')
        if(flag):
            driver.find_element_by_css_selector('#changePerson').click()
        else:
            assert 0 ,'编辑巡更人员按钮不存在'
        #编辑巡更人员信息
        sleep(2)
        driver.find_element_by_css_selector('.perCodeCon').clear()
        driver.find_element_by_css_selector('.perCodeCon').send_keys('12')
        driver.find_element_by_css_selector('.perNameCon').clear()
        driver.find_element_by_css_selector('.perNameCon').send_keys('张三')
        element = driver.find_element_by_css_selector('.perSexCon')
        select = Select(element)
        select.select_by_visible_text("女")
        time.sleep(2)
        driver.find_element_by_css_selector('.perDepartCon').clear()
        driver.find_element_by_css_selector('.perDepartCon').send_keys('保洁部')
        driver.find_element_by_css_selector('#btnAdd').click()
        time.sleep(2)
        #验证编辑后的巡更人员是否一致
        executor_after = driver.find_elements_by_css_selector('#patroPersonList >div')[-1]
        code = executor_after.find_element_by_css_selector('div:nth-child(1) > lable').text
        name = executor_after.find_element_by_css_selector('div:nth-child(2) > lable').text
        sex = executor_after.find_element_by_css_selector('div:nth-child(3) > lable').text
        depart = executor_after.find_element_by_css_selector('div:nth-child(4) > lable').text
        if(code !='12' or name != '张三' or sex !='女' or depart!='保洁部'):
            assert 0,'编辑后的巡更人员的信息不一致，请检查'
        else:
            print('编辑巡更人员信息成功')
    def deleteExecutor(self,driver):
        #获取刚才新建的巡更人员
        executors_before = driver.find_elements_by_css_selector('#patroPersonList >div')
        #选中该巡更人员
        executor = executors_before[-1]
        #查看删除巡更人员按钮是否存在
        a = WebDriverTools()
        flag = a.isElementPresent(driver,'#deletePerson')
        if(flag):
            driver.find_elements_by_css_selector('#deletePerson')[0].click()
        else:
            assert  0,'删除巡更人员按钮不存在'
        flag2 = a.isElementPresent(driver,".infoBox-footer")
        if(flag2):
            sure = [x for x in driver.find_elements_by_css_selector(".btn.btn-info.alert-button") if x.text == '确认']
            sure[0].click()
        else:
            assert 0,'点击删除巡更人员按钮，没有出现弹框'
        sleep(2)
        executors_after = driver.find_elements_by_css_selector('#patroPersonList >div')
        if(len(executors_before)-len(executors_after) != 1):
            assert 0,'删除巡更人员失败'
        else:
            print('删除巡更人员成功')

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})


if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case039('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)