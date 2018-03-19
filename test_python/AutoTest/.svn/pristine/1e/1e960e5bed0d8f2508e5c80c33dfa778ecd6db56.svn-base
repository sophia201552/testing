#coding=utf-8
'''
Created on August 18th,2015

@author: Markdorian
'''

from selenium import webdriver
# info
import sqlite3
import unittest
import time
from Methods.MemcacheTools import MemcacheTools
from Methods.OldTools import OldTools
from Methods.LoginTools import LoginTools
import datetime

# -*- coding:utf8 -*-

class Case007(unittest.TestCase):
    testCaseID='Case007'
    projectName='不针对项目'
    buzName='地图加载:红色圆点显示'
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
        ls = ['div[id="project-72-shhuawei-undefined"]', 'div[project-id="72"]']
        t = OldTools.icon_how_present(driver,self.projectName,ls)
        if t[1]=='视图:图标导航模式靠右':
            try:
                lo = driver.find_elements_by_css_selector('div[id="map-canvas"] .map-marker')
            except Exception:
                assert 0,'地图上没有点显示'
            if len(lo) > 2:
                pass
            else:
                assert 0,'地图上没有点显示'

    def tearDown(self):
        self.driver.quit()
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case007('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)