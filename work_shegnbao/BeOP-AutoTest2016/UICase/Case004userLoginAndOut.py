'''
Created on 2015年3月12日

@author: Anthony
'''
import time
from selenium import webdriver
# info
import sqlite3
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import unittest
import datetime
from Methods.MemcacheTools import MemcacheTools
from Methods.OldTools import OldTools
from Methods.LoginTools import LoginTools
from Methods.WebDriverTools import WebDriverTools
# Validation login and logout
class Case004(unittest.TestCase):
    testCaseID = 'Case004'
    projectName = '不针对项目'
    buzName = '用户名检验,并注销用户'
    start = 0.0
    now = 'None'
    startTime = ""
    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.loginInitial_Chrome(self.testCaseID)
        accounts = {}
        accounts['projecttest@rnbtech.com.hk'] = 'Rnbtech1103'
        for key in sorted(accounts.keys()):
            self.driver = OldTools.account_audit(self.driver, key, accounts.get(key))

    def Test(self):
        driver = self.driver
        ls=['div[id="project-1-hsimc-undefined"]', 'div[project-id="1"]']
        OldTools.icon_view_login(driver,self.projectName,ls)

        try:
            driver.find_element_by_css_selector('#iconList.dropdown').click()
            user = driver.find_element_by_id('paneUser')
        except Exception:
            assert 0, '登录用户名显示失败'
        name = user.text
        namenow = "AutoTester"
        if name == namenow:
            pass
        else:
            WebDriverTools.get_pic(driver, self.testCaseID)
            assert 0, '登录用户与显示的用户不一致'
        #dropdown list location
        try:
            logout = driver.find_element_by_id('btnLogout')
            logout.click()
            wait = WebDriverWait(driver, 20).until(lambda dr: dr.find_element_by_css_selector('#divLanguage>a'))
            if wait:
                pass
            else:
                assert 0, '注销失败'
        except Exception:
            assert 0, '用户登录失败'

    def tearDown(self):
        self.driver.quit()
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case004('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)