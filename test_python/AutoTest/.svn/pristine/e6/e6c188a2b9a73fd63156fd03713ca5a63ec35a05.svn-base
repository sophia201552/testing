__author__ = 'woody'
from Methods.LoginTools import LoginTools
from Methods.OtherTools import OtherTools
from Methods.MemcacheTools import MemcacheTools
import unittest
import datetime, time
from Methods.WebDriverTools import WebDriverTools
from config import app
from time import sleep
from selenium.webdriver.support.wait import WebDriverWait
import os
from selenium.webdriver.support.select import Select
from selenium.webdriver.common.keys import Keys
import re


class Case060(unittest.TestCase):
    testCaseID = 'Case060'
    projectName = "新加坡Bugis+项目"
    buzName = '报表等页面是否正常加载'
    now = 'None'
    url = app.config['SERVERIP']

    urls = (
        ('设备信息 - 诊断实时信息','http://%s/externalChainPage/57e75192391e44123022d873' % url,['#dropdownBtn','.MZone.main-container','.LZone.main-container'],),
        ('设备信息 - 诊断历史信息','http://%s/externalChainPage/57e750f8391e44123022d862' % url,['#dropdownBtn','.MZone.main-container','.LZone.main-container'],),
        ('设备分析 - KPI管理','http://%s/externalChainPage/57e7516c391e44123022d86e' % url,['#accordion','#ru-chart','#rd-board'],),
        ('能耗管理 - 能耗查询','http://%s/externalChainPage/57e7511d391e44123022d865' % url,['.left-wrap','.right-wrap'],),
        ('能耗管理 - 能耗分析','http://%s/externalChainPage/57e7513a391e44123022d868' % url,['.left-wrap','.right-wrap'],),
        ('能耗管理 - 能耗排名','http://%s/externalChainPage/57e75152391e44123022d86b' % url,['.left-wrap','.right-wrap'],),
        ('报表管理 - KPI日报','http://%s/externalChainPage/57f0e4b8b2312e12dc0a426c' % url,['.pdf_text','#reportWrap'],),
        ('报表管理 - 运行日报','http://%s/externalChainPage/57f0e4c5b2312e12dc0a426e' % url,['.pdf_text','#reportWrap'],),
        #('报表管理 - 能耗日报','http://%s/externalChainPage/57f0e4d7b2312e12dc0a4270' % url,['.pdf_text','#reportWrap'],)

    )

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID, {'start': self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome('http://'+self.url, self.testCaseID)
        self.tools = WebDriverTools()

    def Test(self):
        TIMEOUT = 60
        driver = self.driver
        self.errors = []
        for item in self.urls:
            name = item[0]
            url = item[1]
            elements = item[2]
            driver.get(url)
            try:
                for ele in elements:
                    WebDriverTools.waitElement(driver, ele, self.testCaseID, timeout=TIMEOUT)
                    WebDriverTools.waitElementNotFound(driver, '.spinnerMask', self.testCaseID, timeout=TIMEOUT)
            except Exception as e:
                WebDriverTools.get_pic(driver, self.testCaseID)
                self.errors.append('项目名: %s 页面名称: %s 页面地址: %s 错误推断: 该页面无法正常加载 详细信息: %s' % (self.projectName, name, url, e.__str__()))
            time.sleep(2)
        OtherTools.raiseError(self.errors)


    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID, {'start': self.startTime, 'end': self.now})


if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case060('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)
