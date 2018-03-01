__author__ = 'Murphy'
import unittest
import datetime, time
from Methods.LoginTools import LoginTools
from Methods.MemcacheTools import MemcacheTools
from Methods.WebDriverTools import WebDriverTools
from Methods.OtherTools import OtherTools
from config import app
from time import sleep


class Case097(unittest.TestCase):
    testCaseID = "Case097"
    projectName = ""
    buzName = "计算点批量导入"
    now = 'None'
    url = "http://%s" % app.config['SERVERIP']
    project = (49, 'myTest', [], '#indexMain')
    prePoint = ""

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.prePoint = time.strftime("Point%Y%m%d%H%M%S", time.localtime())
        MemcacheTools.setMemTime(self.testCaseID,{"startTime":self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver)
        self.tools = WebDriverTools()

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

    def Test(self):
        driver = self.driver
        self.errors = []
        self.tools.enterProject(driver, self.project[0], self.project[1], self.errors)
        sleep(3)

        self.enterDataManage(driver)
        sleep(3)

        self.CheckFunction(driver)
        sleep(1)

        costTime = (datetime.datetime.now() - self.start).seconds
        if costTime > 300:
            self.errors.append('批量添加20个点用时 ' + str(costTime) + '秒，用时过长！')

        OtherTools.raiseError(self.errors)

    #进入数据管理,计算点页面
    def enterDataManage(self, driver):
        self.tools.clickEle(driver, '#iconList', self.testCaseID, self.projectName, '用户菜单', self.errors)
        self.tools.clickEle(driver, '#btnPointManager', self.testCaseID, self.projectName, '数据管理', self.errors)

    def CheckFunction(self, driver):
        driver.find_element_by_xpath("//ul[@id='dataManagerCloudMenu']/li[2]/ul/li[3]/a").click()
        sleep(3)

        driver.find_element_by_id("point_add").click()
        sleep(1)

        driver.find_element_by_class_name("multiple").click()
        sleep(1)

        # set focus
        driver.find_element_by_id("codeMirrorBox").click()
        sleep(1)

        code = "def main_" + self.prePoint + "_01():vr = calc_weekly_delta_of_accum(\"Ch004_ChElecUse\")if vr==None:return 0else:return vr" \
             "def main_" + self.prePoint + "_02():vr = calc_weekly_delta_of_accum(\"Ch004_ChElecUse\")if vr==None:return 0else:return vr" \
             "def main_" + self.prePoint + "_03():vr = calc_weekly_delta_of_accum(\"Ch004_ChElecUse\")if vr==None:return 0else:return vr" \
             "def main_" + self.prePoint + "_04():vr = calc_weekly_delta_of_accum(\"Ch004_ChElecUse\")if vr==None:return 0else:return vr" \
             "def main_" + self.prePoint + "_05():vr = calc_weekly_delta_of_accum(\"Ch004_ChElecUse\")if vr==None:return 0else:return vr" \
             "def main_" + self.prePoint + "_06():vr = calc_weekly_delta_of_accum(\"Ch004_ChElecUse\")if vr==None:return 0else:return vr" \
             "def main_" + self.prePoint + "_07():vr = calc_weekly_delta_of_accum(\"Ch004_ChElecUse\")if vr==None:return 0else:return vr" \
             "def main_" + self.prePoint + "_08():vr = calc_weekly_delta_of_accum(\"Ch004_ChElecUse\")if vr==None:return 0else:return vr" \
             "def main_" + self.prePoint + "_09():vr = calc_weekly_delta_of_accum(\"Ch004_ChElecUse\")if vr==None:return 0else:return vr" \
             "def main_" + self.prePoint + "_10():vr = calc_weekly_delta_of_accum(\"Ch004_ChElecUse\")if vr==None:return 0else:return vr" \
             "def main_" + self.prePoint + "_11():vr = calc_weekly_delta_of_accum(\"Ch004_ChElecUse\")if vr==None:return 0else:return vr" \
             "def main_" + self.prePoint + "_12():vr = calc_weekly_delta_of_accum(\"Ch004_ChElecUse\")if vr==None:return 0else:return vr" \
             "def main_" + self.prePoint + "_13():vr = calc_weekly_delta_of_accum(\"Ch004_ChElecUse\")if vr==None:return 0else:return vr" \
             "def main_" + self.prePoint + "_14():vr = calc_weekly_delta_of_accum(\"Ch004_ChElecUse\")if vr==None:return 0else:return vr" \
             "def main_" + self.prePoint + "_15():vr = calc_weekly_delta_of_accum(\"Ch004_ChElecUse\")if vr==None:return 0else:return vr" \
             "def main_" + self.prePoint + "_16():vr = calc_weekly_delta_of_accum(\"Ch004_ChElecUse\")if vr==None:return 0else:return vr" \
             "def main_" + self.prePoint + "_17():vr = calc_weekly_delta_of_accum(\"Ch004_ChElecUse\")if vr==None:return 0else:return vr" \
             "def main_" + self.prePoint + "_18():vr = calc_weekly_delta_of_accum(\"Ch004_ChElecUse\")if vr==None:return 0else:return vr" \
             "def main_" + self.prePoint + "_19():vr = calc_weekly_delta_of_accum(\"Ch004_ChElecUse\")if vr==None:return 0else:return vr" \
             "def main_" + self.prePoint + "_20():vr = calc_weekly_delta_of_accum(\"Ch004_ChElecUse\")if vr==None:return 0else:return vr"
        driver.switch_to_active_element().send_keys(code)
        sleep(3)

        driver.find_element_by_id("calcPointConfirm").click()


if __name__ == "__main__":
    suit = unittest.TestSuite()
    suit.addTest(Case097('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suit)
