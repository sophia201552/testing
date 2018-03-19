'''
Created on 2015年6月4日

@author: Markdorian
'''


from selenium import webdriver
import sqlite3
import unittest
import time, datetime
from Methods.LoginTools import LoginTools
from Methods.WebDriverTools import WebDriverTools
from Methods.OldTools import OldTools
from Methods.MemcacheTools import MemcacheTools
tag1='HuarunHK'

class Case001(unittest.TestCase):
    testCaseID='Case001'
    projectName='香港华润'
    buzName='数据分析页'
    start = 0.0
    now = 'None'
    startTime = ""
    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.loginInitial_Chrome(self.testCaseID)
        self.driver = lg.loginnow(self.driver)

    def Test(self):
        driver = self.driver
        ls=['div[id="project-18-HuarunHK-undefined"]', 'div[project-id="18"]']
        OldTools.icon_view_login(driver, self.projectName, ls)
        try:
            driver.find_element_by_css_selector('#ulPages > li:nth-child(3) > a > span.nav-btn-text').click()
        except Exception as e:
            assert 0, tag1 + '-Webpage is not available,maybe loading fails,please check it'




    def tearDown(self):
        self.driver.quit()
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})


if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case001('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)