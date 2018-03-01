'''
Created on August 13th,2015

@author: Markdorian
'''
import time
from selenium import webdriver
# info
import sqlite3
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import datetime
import unittest
from Methods.MemcacheTools import MemcacheTools
from Methods.WebDriverTools import WebDriverTools
from Methods.LoginTools import LoginTools
from Methods.OldTools import OldTools
from selenium.common.exceptions import NoSuchElementException










# Validation login and logout,ready to expand for robust case
class Case006(unittest.TestCase):
    testCaseID = 'Case006'
    projectName = '不针对项目'
    buzName = '批量用户登录:消耗时间'
    start = 0.0
    now = 'None'
    startTime = ""
    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})



    def Test(self):
        accounts = OldTools.accounts_list("C:\\useraccount\\worklist.xlsx")
        for key in sorted(accounts.keys()):
            temp = accounts.get(key)
            for k in sorted(temp.keys()):
                lg = LoginTools()
                driver = lg.loginInitial_Chrome(self.testCaseID)
                #(driver,time_consumption[1])
                x = OldTools.account_audit2(driver, k, temp.get(k))
                driver=x[0]
                print('用户:'+k+'登陆，消耗: %f' % x[1])
                time.sleep(1.2)
                # dropdown list location
                try:
                    delta=driver.find_element_by_css_selector('#iconList')
                except Exception:
                    assert 0,'找不到用户菜单按钮'
                if delta is not None:
                    delta.click()
                    time.sleep(2)

                try:
                    logout = driver.find_element_by_id('btnLogout')
                    logout.click()
                    wait = WebDriverWait(driver, 30).until(
                        lambda dr: dr.find_element_by_css_selector('#divLanguage>a'))
                    if wait:
                        pass
                    else:
                        assert 0, '注销失败'
                except Exception:
                    assert 0, '用户注销失败'
                driver.quit()

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})


if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case006('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)