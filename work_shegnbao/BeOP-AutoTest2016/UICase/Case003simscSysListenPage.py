'''
Created on July 20th,2015

@author: Markdorian
'''


from Methods.OldTools import OldTools
import unittest,time
import datetime
from Methods.MemcacheTools import MemcacheTools
from Methods.LoginTools import LoginTools

class Case003(unittest.TestCase):
    testCaseID = 'Case003'
    projectName = '上海中芯国际'
    buzName = '系统监控'
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
        itemproject = 'Shanghai Huawei'
        # Login Item by clicking on Icon
        ls=['div[id="project-1-hsimc-undefined"]', 'div[project-id="1"]']
        time.sleep(2)
        OldTools.icon_view_login(driver,self.projectName,ls)
        # System Surveillance-drop down lists
        #div[id="scrollPages"] .dropdown-menu li a
        iddics = {"page-50000183": "主界面", "page-10000161": "系统总览", "page-10000163": "设备总览",
            "page-10000157": "热水系统", "page-124": "冷机参数",
            "page-40000179": "变频器参数", "page-50000184": "实时电量"}
        OldTools.login_defaultpage_load(driver, self.testCaseID, self.projectName+self.buzName, iddics)



    def tearDown(self):
        self.driver.quit()
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})


