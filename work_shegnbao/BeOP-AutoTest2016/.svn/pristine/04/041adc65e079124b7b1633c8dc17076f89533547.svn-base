__author__ = 'sophia'

import datetime
import time
import unittest
from time import sleep
from Methods.LoginTools import LoginTools
from Methods.MemcacheTools import MemcacheTools
from config import app
from Methods.OtherTools import OtherTools

class Case077(unittest.TestCase):
    testCaseID = 'Case077'
    projectName = "WebFactory"
    buzName = '查看Factory修改项目中项目类型和标识是否正确'
    start = 0.0
    now = 'None'
    startTime = ""
    url = "http://%s" % app.config['SERVERIP']

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID, {'start': self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChromeFactory(self.url, self.testCaseID)
        self.driver = lg.loginFactory(self.driver)

    def Test(self):
        self.errors = []
        sleep(2)
        driver = self.driver
        eles=driver.find_elements_by_css_selector('.proText.bindPro')
        for ele in eles:
            name=ele.get_attribute('title')
            if(name=='myTest'):
                driver.execute_script("$('#editPro578ee02c833c9764bcc8db29').click()")
                sleep(3)
                driver.execute_script("$('#addOnlinePro').click()")
                sleep(2)
                text=driver.execute_script("a=$('.form-group.col-md-12').text();return a")
                if('项目类型和标识' in text and '真实项目' in text and '虚拟项目' in text and 'undefined' not in text):
                    print('项目类型显示正确')
                else:
                    self.errors.append('factory修改项目中项目类型和标识显示不正确,可能为undefined')

        OtherTools.raiseError(self.errors)


    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID, {'start': self.startTime, 'end': self.now})
        self.driver.quit()


if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case077('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)
