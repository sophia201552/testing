__author__ = 'sophia'
import unittest
import datetime
import time
from time import sleep

from Methods.LoginTools import LoginTools
from Methods.OtherTools import OtherTools
from Methods.MemcacheTools import MemcacheTools
from Methods.WebDriverTools import WebDriverTools
from config import app
from selenium.webdriver.common.keys import Keys

class Case084(unittest.TestCase):
    testCaseID = "Case084"
    projectName = "中芯国际"
    buzName = "检查数据诊断诊断页面,增删改"
    now = 'None'
    url = "http://%s" % app.config['SERVERIP']
    project = [1, "上海中芯国际"]

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID, {"startTime": self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver)

    def Test(self):
        driver = self.driver
        self.errors = []
        WebDriverTools.enterProject(driver, self.project[0], self.projectName, self.errors)
        sleep(3)
        self.check(driver)
        OtherTools.raiseError(self.errors)

    def check(self, driver):
        WebDriverTools.enterModuleByUserMenu(driver, 'btnPointManager', '数据管理', '#dataManagerCloudMenu')
        sleep(3)
        driver.find_elements_by_css_selector('.pointManagerCloudPointUl')[3].find_elements_by_css_selector('li')[-1].click()
        sleep(5)
        lis=driver.find_elements_by_css_selector('#diagnosisFilesUl >li')
        for li in lis:
            if(li.text=='pageauto'):
                li.find_element_by_tag_name('a').click()
                # driver.execute_script("$('.button.remove').click()")
                driver.execute_script("$('span[title=\"删除\"]').click()")
                sleep(2)
                driver.execute_script("$('.infoBox-footer >button')[0].click()")
        sleep(5)
        be_len = driver.execute_script("be_len=$('#diagnosisFilesUl >li').length;return be_len;")
        driver.execute_script("$('#diagnosisFileAdd').click()")
        driver.execute_script("$('#import_from_template').click()")
        sleep(3)
        driver.execute_script("$('#templateTreeMenu >li>span')[0].click()")
        sleep(3)
        driver.execute_script("$('#templateTreeMenu >li>ul>li>a')[0].click()")
        sleep(3)
        driver.execute_script("$('#templateImportConfirm').click()")
        driver.execute_script("$(\"#diagnosisModuleName\").val('pageauto')")
        driver.execute_script("$('#diagnosisConfirm').click()")
        sleep(2)
        driver.execute_script("$('.infoBox-footer >button').click()")
        sleep(5)
        af_len = driver.execute_script("af_len=$('#diagnosisFilesUl >li').length;return af_len;")
        af_name = driver.execute_script("be_name=$('#diagnosisFilesUl >li').last().text();return be_name;")
        if (af_len - be_len == 1):
            print('新建诊断页面成功')
        else:
            self.errors.append('新建诊断页面失败')
        if (af_name=='pageauto'):
            print('编辑诊断页面成功')
        else:
            self.errors.append('编辑诊断页面失败')

        # driver.execute_script("$('.button.remove').click()")
        driver.execute_script("$('span[title=\"删除\"]').click()")
        sleep(2)
        driver.execute_script("$('.infoBox-footer >button')[0].click()")
        sleep(5)
        delete_len = driver.execute_script("delete_len=$('#diagnosisFilesUl >li').length;return delete_len;")
        if (delete_len == be_len):
            print('删除诊断页面成功')
        else:
            self.errors.append('删除诊断页面失败')

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID, {'start': self.startTime, 'end': self.now})


if __name__ == "__main__":
    suit = unittest.TestSuite()
    suit.addTest(Case084('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suit)
