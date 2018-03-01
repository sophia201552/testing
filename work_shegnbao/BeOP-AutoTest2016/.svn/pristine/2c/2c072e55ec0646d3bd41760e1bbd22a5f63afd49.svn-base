__author__ = 'Murphy'
import unittest
import datetime, time
from Methods.LoginTools import LoginTools
from Methods.MemcacheTools import MemcacheTools
from Methods.WebDriverTools import WebDriverTools
from Methods.OtherTools import OtherTools
from config import app
from time import sleep

class Case087(unittest.TestCase):
    testCaseID = "Case087"
    projectName = "上海世贸皇家艾美"
    buzName = "能耗值查询"
    now = 'None'
    url = "http://%s" % app.config['SERVERIP']
    project = (395, 'shsmhjam', ['能源管理'], '#indexMain')

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
        self.GetEnergyValue(driver)

        OtherTools.raiseError(self.errors)
        print('上海世贸皇家艾美酒店，检查负值，测试完成！')

    def GetEnergyValue(self, driver):
        strTodayTotalEnergy = driver.find_element_by_xpath("//div[@id='threeItem1']/div/div/p[1]/span").text
        strEnergy0 = driver.find_element_by_xpath("//div[@id='legendData00']/div[2]/div[3]/span").text
        strEnergy1 = driver.find_element_by_xpath("//div[@id='legendData01']/div[2]/div[3]/span").text
        strEnergy2 = driver.find_element_by_xpath("//div[@id='legendData02']/div[2]/div[3]/span").text
        strEnergy3 = driver.find_element_by_xpath("//div[@id='legendData03']/div[2]/div[3]/span").text
        strEnergy4 = driver.find_element_by_xpath("//div[@id='legendData04']/div[2]/div[3]/span").text
        strEnergy5 = driver.find_element_by_xpath("//div[@id='legendData05']/div[2]/div[3]/span").text
        strEnergy6 = driver.find_element_by_xpath("//div[@id='legendData06']/div[2]/div[3]/span").text
        strEnergy7 = driver.find_element_by_xpath("//div[@id='legendData07']/div[2]/div[3]/span").text
        strEnergy8 = driver.find_element_by_xpath("//div[@id='legendData08']/div[2]/div[3]/span").text
        strEnergy9 = driver.find_element_by_xpath("//div[@id='legendData09']/div[2]/div[3]/span").text
        strEnergy10 = driver.find_element_by_xpath("//div[@id='legendData10']/div[2]/div[3]/span").text
        strEnergy11 = driver.find_element_by_xpath("//div[@id='legendData11']/div[2]/div[3]/span").text
        strEnergy12 = driver.find_element_by_xpath("//div[@id='legendData12']/div[2]/div[3]/span").text
        strEnergy13 = driver.find_element_by_xpath("//div[@id='legendData13']/div[2]/div[3]/span").text
        strEnergy14 = driver.find_element_by_xpath("//div[@id='legendData14']/div[2]/div[3]/span").text
        strLastDayEnergy = driver.find_element_by_id('lastDayEnergyValue').text

        todayTotalEnergy = self.ParseEnergyValue(strTodayTotalEnergy)
        energy0 = self.ParseEnergyValue(strEnergy0)
        energy1 = self.ParseEnergyValue(strEnergy1)
        energy2 = self.ParseEnergyValue(strEnergy2)
        energy3 = self.ParseEnergyValue(strEnergy3)
        energy4 = self.ParseEnergyValue(strEnergy4)
        energy5 = self.ParseEnergyValue(strEnergy5)
        energy6 = self.ParseEnergyValue(strEnergy6)
        energy7 = self.ParseEnergyValue(strEnergy7)
        energy8 = self.ParseEnergyValue(strEnergy8)
        energy9 = self.ParseEnergyValue(strEnergy9)
        energy10 = self.ParseEnergyValue(strEnergy10)
        energy11 = self.ParseEnergyValue(strEnergy11)
        energy12 = self.ParseEnergyValue(strEnergy12)
        energy13 = self.ParseEnergyValue(strEnergy13)
        energy14 = self.ParseEnergyValue(strEnergy14)
        lastDayEnergy = self.ParseEnergyValue(strLastDayEnergy)

        self.CheckValue(todayTotalEnergy)
        self.CheckValue(energy0)
        self.CheckValue(energy1)
        self.CheckValue(energy2)
        self.CheckValue(energy3)
        self.CheckValue(energy4)
        self.CheckValue(energy5)
        self.CheckValue(energy6)
        self.CheckValue(energy7)
        self.CheckValue(energy8)
        self.CheckValue(energy9)
        self.CheckValue(energy10)
        self.CheckValue(energy11)
        self.CheckValue(energy12)
        self.CheckValue(energy13)
        self.CheckValue(energy14)
        self.CheckValue(lastDayEnergy)

        sleep(3)

    def ParseEnergyValue(self, value):
        if 'NaN'in value or "None" in value or "Null" in value:
            return False
        else:
            value = str(value)
            value = value.replace(',', '')
            value = value.replace(' ', '')
            value = value.replace('kWh', '')
            if value=="0.0":
                return 0
            else:
                return int(value)

    def CheckValue(self, value):
        if value:
            if value < 0:
                self.errors.append('数值：' + str(value) + ' 小于0！')
        else:
            self.errors.append('数值：' + str(value) + ' 返回数据values为空！')


if __name__ == "__main__":
    suit = unittest.TestSuite()
    suit.addTest(Case087('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suit)
