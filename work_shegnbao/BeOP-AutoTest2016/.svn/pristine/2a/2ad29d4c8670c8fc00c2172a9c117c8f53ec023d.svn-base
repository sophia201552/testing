__author__ = 'woody'
import unittest
import datetime
import time
from time import sleep
import os
from Methods.LoginTools import LoginTools
from Methods.OtherTools import OtherTools
from Methods.MemcacheTools import MemcacheTools
from Methods.WebDriverTools import WebDriverTools
from config import app
from selenium.webdriver.common.keys import Keys
import zipfile

class Case085(unittest.TestCase):
    testCaseID = "Case085"
    projectName = "MyTest项目"
    buzName = "数据管理--导出/导入数据"
    now = 'None'
    url = "http://%s" % app.config['SERVERIP']
    projectId = 49
    errors = []
    dataPoints = ['Outdoor_Tb','qunlou_Ch01_Cond_LeaveT']
    downloadDir = app.config.get('DOWNLOAD_DIR')
    fileList = []

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID, {"startTime": self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver)

    def Test(self):
        driver = self.driver
        self.errors = []
        WebDriverTools.enterProject(driver, self.projectId, self.projectName, self.errors)
        WebDriverTools.enterModuleByUserMenu(driver, 'btnPointManager', '数据管理', '#PointManagerExportData')
        self.outPutData(driver)
        filename = self.checkZip(driver)
        self.fileList.append(filename)
        if self.checkDownload(filename):
            print('下载文件成功!现在开始解压!')
            self.unzip(filename)
        else:
            self.errors.append('{}--{}导出{}1天数据后下载该zip失败!'.format(self.testCaseID, self.projectName, self.dataPoints))
        self.importData(driver)
        self.remove(self.fileList)
        self.checkImport(driver)
        OtherTools.raiseError(self.errors)

    def checkImport(self, driver):
        try:
            driver.find_element_by_css_selector('#btnConfirmUpload').click()
            WebDriverTools.waitElement(driver, '.btn.btn-info.alert-button', self.testCaseID)
            #点击确认按钮
            driver.find_element_by_css_selector('.btn.btn-info.alert-button').click()
        except Exception as e:
            WebDriverTools.get_pic(driver, self.testCaseID)
            self.errors.append('{}:{}--导入数据选择好文件后导入数据失败!详细信息:{}'.format(self.testCaseID, self.projectName,e.__str__()))


    @classmethod
    def outPutData(self, driver):
        WebDriverTools.clickEle(driver, '#PointManagerExportData', self.testCaseID, self.projectName, '数据管理--导出数据', self.errors)
        WebDriverTools.waitElement(driver, '#exportData', self.testCaseID)
        #选择好点
        points = driver.find_elements_by_css_selector('.table.table-bordered.table-striped tbody tr')
        for p in points:
            if p.find_element_by_css_selector('td:nth-child(2)').get_attribute('title') in self.dataPoints:
                p.find_element_by_css_selector('td:nth-child(1) div input').click()

        #输入开始,结束时间
        endTime = datetime.datetime.strftime(datetime.datetime.now().date(), "%Y-%m-%d 00:00")
        startTime = datetime.datetime.strftime(datetime.datetime.now().date()-datetime.timedelta(days=1), "%Y-%m-%d 00:00")
        driver.find_element_by_css_selector('#batchHistoryTimeStart').send_keys(startTime)
        driver.find_element_by_css_selector('#batchHistoryTimeEnd').send_keys(endTime)
        driver.find_element_by_css_selector("#exportData").click()
        WebDriverTools.clickElementsByText(driver, '.btn.btn-info.alert-button', '确认')
        time.sleep(1)
        WebDriverTools.waitElementNotFound(driver, '.spinnerMask', self.testCaseID)

    @classmethod
    def unzip(self, filename):
        self.fileList.append('temp.csv')
        z = zipfile.ZipFile(r'{}\{}'.format(self.downloadDir, filename), 'r')
        with open(r'{}\temp.csv'.format(self.downloadDir), 'wb+') as file:
            file.write(z.read(z.namelist()[0]))

    def importData(self, driver):
        WebDriverTools.clickEle(driver, '#PointManagerImportData', self.testCaseID, self.projectName, "导入数据", self.errors)
        time.sleep(2)
        WebDriverTools.waitElement(driver, "#btnUploadCSV", self.testCaseID)
        driver.find_element_by_css_selector("#btnUploadCSV").click()
        os.system(r'%s\Other\%s.exe' % (app.config['BASE_DIR'], self.testCaseID))
        time.sleep(5)
        WebDriverTools.waitElement(driver, '#spUploadInfo', self.testCaseID)
        info = driver.find_element_by_css_selector("#spUploadInfo").text
        if "上传成功" in info:
            print("导入数据成功!")
        else:
            WebDriverTools.get_pic(driver, self.testCaseID)
            self.errors.append('{}--{}导出{}1天数据后上传该csv失败!'.format(self.testCaseID, self.projectName, self.dataPoints))



    def checkZip(self, driver):
        #获取次数
        checkTimeMax = 300
        checkTime = 0
        #获取文件名
        fileName = driver.find_element_by_css_selector('#exportDataListTBody tr:nth-child(1) td:nth-child(6)').text

        while 1:
            if checkTime < checkTimeMax:
                progress = driver.find_element_by_css_selector('#exportDataListTBody tr:nth-child(1) td:nth-child(7)').text
                if int(progress[:-1]) == 100:
                    break
                else:
                    print('当前导出数据进度为{}'.format(progress))
                    checkTime += 1
                    time.sleep(1)
            else:
                WebDriverTools.get_pic(driver, self.testCaseID)
                self.errors.append('{}--{}导出{}1天数据花费超过5分钟!'.format(self.testCaseID, self.projectName, self.dataPoints))
                self.remove(self.fileList)
                OtherTools.raiseError(self.errors)
        driver.find_element_by_css_selector('#exportDataListTBody tr:nth-child(1) td:nth-child(6) a').click()
        #等待下载完毕
        time.sleep(5)
        driver.find_element_by_css_selector('.close').click()
        time.sleep(3)
        return fileName

    def checkDownload(self, filename):
        for root, dirs, files in os.walk(self.downloadDir):
            for file in files:
                if filename in file:
                    return True
        return False

    def remove(self, fileList):
        for file in fileList:
            try:
                os.remove(r'{}\{}'.format(self.downloadDir, file))
            except:
                pass


    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID, {'start': self.startTime, 'end': self.now})


if __name__ == "__main__":
    suit = unittest.TestSuite()
    suit.addTest(Case085('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suit)


