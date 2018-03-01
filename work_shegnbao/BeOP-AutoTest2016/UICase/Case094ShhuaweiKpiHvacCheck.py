__author__ = 'Murphy'
import unittest
import datetime, time
from Methods.LoginTools import LoginTools
from Methods.MemcacheTools import MemcacheTools
from Methods.WebDriverTools import WebDriverTools
from Methods.OtherTools import OtherTools
from config import app
from time import sleep

class Case094(unittest.TestCase):
    testCaseID = "Case094"
    projectName = "上海华为"
    buzName = "HVAC检查"
    now = 'None'
    url = "http://%s" % app.config['SERVERIP']
    project = (72, '上海华为', ['设备', 'KPI管理', 'KPI 汇总'], '#indexMain')
    page = ['设备', 'KPI管理', 'KPI 汇总']

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{"startTime":self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url,self.testCaseID)
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

        self.tools.enterPage(driver, self.project[2], self.project[3], self.project[1], timeout=180)
        sleep(3)

        self.tools.checkCanvas(driver, self.errors, self.page)
        sleep(3)

        driver.find_element_by_xpath("//div[@id='testCss']/div[1]/table/tbody/tr[1]").click()
        sleep(3)

        # 冷源系统COP
        rowCop = driver.find_element_by_xpath("//table[@class='table table-hover table-hvac']/tbody/tr[2]")
        col1 = rowCop.find_element_by_xpath("td[2]").text
        col2 = rowCop.find_element_by_xpath("td[3]").text
        col3 = rowCop.find_element_by_xpath("td[4]").text
        self.CheckFormula1(col1, col2, col3, '冷源系统COP')

        # 基载主机COP
        rowCop = driver.find_element_by_xpath("//table[@class='table table-hover table-hvac']/tbody/tr[4]")
        col1 = rowCop.find_element_by_xpath("td[2]").text
        col2 = rowCop.find_element_by_xpath("td[3]").text
        col3 = rowCop.find_element_by_xpath("td[4]").text
        self.CheckFormula1(col1, col2, col3, '基载主机COP')

        # 蒸发趋近温度
        rowCop = driver.find_element_by_xpath("//table[@class='table table-hover table-hvac']/tbody/tr[6]")
        col1 = rowCop.find_element_by_xpath("td[2]").text
        col2 = rowCop.find_element_by_xpath("td[3]").text
        col3 = rowCop.find_element_by_xpath("td[4]").text
        self.CheckFormula1(col1, col2, col3, '蒸发趋近温度')

        # 冷凝趋近温度
        rowCop = driver.find_element_by_xpath("//table[@class='table table-hover table-hvac']/tbody/tr[8]")
        col1 = rowCop.find_element_by_xpath("td[2]").text
        col2 = rowCop.find_element_by_xpath("td[3]").text
        col3 = rowCop.find_element_by_xpath("td[4]").text
        self.CheckFormula1(col1, col2, col3, '冷凝趋近温度')

        # 供水温度
        rowCop = driver.find_element_by_xpath("//table[@class='table table-hover table-hvac']/tbody/tr[10]")
        col1 = rowCop.find_element_by_xpath("td[2]").text
        col2 = rowCop.find_element_by_xpath("td[3]").text
        col3 = rowCop.find_element_by_xpath("td[4]").text
        self.CheckFormula2(col1, col2, col3, '供水温度')

        # 回水温度
        rowCop = driver.find_element_by_xpath("//table[@class='table table-hover table-hvac']/tbody/tr[12]")
        col1 = rowCop.find_element_by_xpath("td[2]").text
        col2 = rowCop.find_element_by_xpath("td[3]").text
        col3 = rowCop.find_element_by_xpath("td[4]").text
        self.CheckFormula2(col1, col2, col3, '回水温度')

        # 负载率
        rowCop = driver.find_element_by_xpath("//table[@class='table table-hover table-hvac']/tbody/tr[14]")
        col1 = rowCop.find_element_by_xpath("td[2]").text
        col2 = rowCop.find_element_by_xpath("td[3]").text
        col3 = rowCop.find_element_by_xpath("td[4]").text
        self.CheckFormula1(col1, col2, col3, '负载率')

        # 板换1供水温度
        rowCop = driver.find_element_by_xpath("//table[@class='table table-hover table-hvac']/tbody/tr[16]")
        col1 = rowCop.find_element_by_xpath("td[2]").text
        col2 = rowCop.find_element_by_xpath("td[3]").text
        col3 = rowCop.find_element_by_xpath("td[4]").text
        self.CheckFormula2(col1, col2, col3, '板换1供水温度')

        # 板换2供水温度
        rowCop = driver.find_element_by_xpath("//table[@class='table table-hover table-hvac']/tbody/tr[18]")
        col1 = rowCop.find_element_by_xpath("td[2]").text
        col2 = rowCop.find_element_by_xpath("td[3]").text
        col3 = rowCop.find_element_by_xpath("td[4]").text
        self.CheckFormula2(col1, col2, col3, '板换2供水温度')

        # 板换3供水温度
        rowCop = driver.find_element_by_xpath("//table[@class='table table-hover table-hvac']/tbody/tr[20]")
        col1 = rowCop.find_element_by_xpath("td[2]").text
        col2 = rowCop.find_element_by_xpath("td[3]").text
        col3 = rowCop.find_element_by_xpath("td[4]").text
        self.CheckFormula2(col1, col2, col3, '板换3供水温度')

        # 板换4供水温度
        rowCop = driver.find_element_by_xpath("//table[@class='table table-hover table-hvac']/tbody/tr[22]")
        col1 = rowCop.find_element_by_xpath("td[2]").text
        col2 = rowCop.find_element_by_xpath("td[3]").text
        col3 = rowCop.find_element_by_xpath("td[4]").text
        self.CheckFormula2(col1, col2, col3, '板换4供水温度')

        OtherTools.raiseError(self.errors)
        print('上海华为HVAC测试完成！')

    def CheckFormula1(self, value1, value2, text, name):
        fValue1 = float(value1)
        value2 = str(value2)
        value2 = value2.replace('kW/kW', '')
        value2 = value2.replace('℃', '')
        value2 = value2.replace('%', '')
        flag = value2[0]
        fValue2 = float(value2[1:])
        text = str(text)
        bCheck = False

        if ('<' == flag):
            if fValue1 < fValue2:
                bCheck = True
        elif ('>' == flag):
            if fValue1 > fValue2:
                bCheck = True
        else:
            self.errors.append('计算符号错误！')

        self.CheckResult(bCheck, text, name)

    def CheckFormula2(self, value1, value2, text, name):
        nValue1 = float(value1)
        value2 = str(value2)
        value2 = value2.replace('kW/kW', '')
        value2 = value2.replace('℃', '')
        value2 = value2.replace('%', '')
        arr = value2.split('-')
        fLow = float(arr[0])
        fHigh = float(arr[1])
        text = str(text)
        bCheck = False

        if (nValue1 >= fLow and nValue1 <= fHigh):
            bCheck = True

        self.CheckResult(bCheck, text, name)

    def CheckResult(self, bCheck, text, name):
        tag1 = '达   标'
        tag2 = '不达标'
        tag3 = '未开启'
        tag4 = '无   效'
        ret = True
        if bCheck == True and text == tag2:
            self.errors.append(name + '考核结果错误！')
            ret = False
        if bCheck == False and text == tag1:
            self.errors.append(name + '考核结果错误！')
            ret = False
        return ret


if __name__ == "__main__":
    suit = unittest.TestSuite()
    suit.addTest(Case094('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suit)
