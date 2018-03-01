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


class Case058(unittest.TestCase):
    testCaseID = 'Case058'
    projectName = "上海来福士项目"
    buzName = '报表等页面是否正常加载'
    now = 'None'
    url = app.config['SERVERIP']

    urls = (
        ('设备信息 - 诊断实时信息','http://%s/externalChainPage/57e233829f421018989aa7ea' % url,['#dropdownBtn','.MZone.main-container','.LZone.main-container'],),
        ('设备信息 - 诊断历史信息','http://%s/externalChainPage/57e233a79f421018989aa7ef' % url,['#dropdownBtn','.MZone.main-container','.LZone.main-container'],),
        ('设备分析 - KPI管理','http://%s/externalChainPage/57e0d0e446136e3708480df1' % url,['#accordion','#ru-chart','#rd-board'],),
        ('能耗管理 - 能耗查询','http://%s/externalChainPage/57e233b89f421018989aa7f2' % url,['.left-wrap','.right-wrap'],),
        ('能耗管理 - 能耗分析','http://%s/externalChainPage/57e22da39f42100d2c7c5b95' % url,['.left-wrap','.right-wrap'],),
        ('能耗管理 - 能耗排名','http://%s/externalChainPage/57e233d79f421018989aa7f5' % url,['.left-wrap','.right-wrap'],),
        ('报表管理 - KPI日报','http://%s/externalChainPage/57e9e4b09f42100e0c00aabf' % url,['.pdf_text','#reportWrap'],),
        ('报表管理 - 运行日报','http://%s/externalChainPage/57e9e4c39f42100e0c00aac2' % url,['.pdf_text','#reportWrap'],),
        ('报表管理 - 能耗日报','http://%s/externalChainPage/57e9e4d19f42100e0c00aac5' % url,['.pdf_text','#reportWrap'],)

    )

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID, {'start': self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome('http://'+self.url, self.testCaseID)
        self.tools = WebDriverTools()

    def Test(self):
        TIMEOUT = 20
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
            WebDriverTools.alert(driver)
        OtherTools.raiseError(self.errors)


    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID, {'start': self.startTime, 'end': self.now})


if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case058('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)
