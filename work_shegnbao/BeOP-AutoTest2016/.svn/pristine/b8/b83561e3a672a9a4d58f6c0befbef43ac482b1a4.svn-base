__author__ = 'sophia'
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


class Case057(unittest.TestCase):
    testCaseID = 'Case057'
    projectName = "上海中芯国际"
    buzName = '某时刻点值功能,分页功能,导出模板'
    now = 'None'
    url = "http://%s" % app.config['SERVERIP']
    project = (1, '上海中芯国际')
    downloadDir = app.config.get('DOWNLOAD_DIR')

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID, {'start': self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver)
        self.tools = WebDriverTools()

    def Test(self):
        driver = self.driver
        self.errors = []
        self.tools.enterProject(driver, self.project[0], self.project[1], self.errors)
        self.tools.enterModuleByUserMenu(driver, 'btnPointManager', '数据管理', '#PointManagerRealTimeData')
        self.checkExport(driver)
        self.checkPagination(driver)
        self.checkValueAtTime(driver)
        OtherTools.raiseError(self.errors)

    def checkExport(self, driver):
        a = driver.find_elements_by_css_selector('.pointManagerCloudPointUl')[1]
        sleep(3)
        a.find_elements_by_css_selector('li >a')[0].click()
        sleep(2)
        export = WebDriverWait(driver, 10).until(lambda x: x.find_element_by_css_selector('.point_template_export'))
        export.click()
        sleep(3)
        status = False
        for root, dirs, files in os.walk(self.downloadDir):
            for file in files:
                if 'cloud' in file and '.xlsx' in file:
                    status = True
                    break
        if status:
            print("下载模板成功!")
        else:
            self.errors.append('现场点导出模板导出失败')

    def checkPagination(self, driver):
        # 检查每页最大多少项的切换
        page_display = driver.find_element_by_css_selector('.widget-sdt-rows-selector > select')
        select_page_display = Select(page_display)
        select_page_display.select_by_visible_text("100")
        sleep(2)
        WebDriverWait(driver, 10).until(lambda x: x.find_element_by_css_selector('.table-body.gray-scrollbar > .table.table-bordered.table-striped > tbody > tr'))
        trs = driver.find_elements_by_css_selector('.table-body.gray-scrollbar > .table.table-bordered.table-striped > tbody > tr')
        if (len(trs) == 100):
            print('切换页面的数量成功')
        else:
            self.errors.append('数据管理---现场点切换每页最大项失败')
        table_tds=driver.find_elements_by_css_selector('.table-body.gray-scrollbar > .table.table-bordered.table-striped > tbody > tr > td')
        text1 = table_tds[0].text
        driver.find_elements_by_css_selector('.pagination > li > a')[0].click()
        sleep(4)
        WebDriverWait(driver, 20).until(lambda x: x.find_element_by_css_selector('.table-body.gray-scrollbar > .table.table-bordered.table-striped > tbody > tr > td >div > span'))
        text0 = driver.find_elements_by_css_selector('.table-body.gray-scrollbar > .table.table-bordered.table-striped > tbody > tr > td >div > span')[0].text
        if (text1 == text0):
            print('分页回到第一页不能用')
        else:
            self.errors.append('数据管理---现场点目前在第一页点击回到第一页的按钮能用了')

        driver.find_elements_by_css_selector('.pagination > li > a')[1].click()
        sleep(4)
        WebDriverWait(driver, 20).until(lambda x: x.find_element_by_css_selector('.table-body.gray-scrollbar > .table.table-bordered.table-striped > tbody > tr > td >div > span'))
        text0_0 = driver.find_elements_by_css_selector('.table-body.gray-scrollbar > .table.table-bordered.table-striped > tbody > tr > td >div > span')[0].text
        if (text1 == text0_0):
            print('分页回到上一页不能用')
        else:
            self.errors.append('数据管理---现场点目前在第一页点击回到上一页的按钮能用了')
        driver.find_elements_by_css_selector('.pagination > li > a')[3].click()
        sleep(4)
        text2 = driver.find_elements_by_css_selector('.table-body.gray-scrollbar > .table.table-bordered.table-striped > tbody > tr > td >div > span')[0].text
        if (text1 != text2):
            print('切换到第2页成功')
        else:
            self.errors.append('数据管理---现场点切换到第2页失败')
        sleep(2)
        driver.find_elements_by_css_selector('.pagination > li > a')[4].click()
        sleep(4)
        text3 = driver.find_elements_by_css_selector('.table-body.gray-scrollbar > .table.table-bordered.table-striped > tbody > tr > td >div > span')[0].text
        if (text3 != text2):
            print('切换到第3页成功')
        else:
            self.errors.append('数据管理---现场点切换到第3页失败')
        sleep(2)
        driver.find_elements_by_css_selector('.pagination > li > a')[-1].click()
        sleep(4)
        text4 = driver.find_elements_by_css_selector('.table-body.gray-scrollbar > .table.table-bordered.table-striped > tbody > tr > td >div > span')[0].text
        if (text3 != text4):
            print('切换到最后一页成功')
        else:
            self.errors.append('数据管理---现场点切换到最后一页失败')
        sleep(2)
        driver.find_elements_by_css_selector('.pagination > li > a')[1].click()
        sleep(4)
        text5 = driver.find_elements_by_css_selector('.table-body.gray-scrollbar > .table.table-bordered.table-striped > tbody > tr > td >div > span')[0].text
        if (text5 != text4):
            print('切换到从最后一页切换到上一页成功')
        else:
            self.errors.append('数据管理---现场点从最后一页切换到上一页失败')
        sleep(2)
        driver.find_elements_by_css_selector('.pagination > li > a')[0].click()
        sleep(4)
        text6 = driver.find_elements_by_css_selector('.table-body.gray-scrollbar > .table.table-bordered.table-striped > tbody > tr > td >div > span')[0].text
        if (text5 != text6):
            print('切换到第一页成功')
        else:
            self.errors.append('数据管理---现场点从最后一页切换到第一页失败')

    def checkValueAtTime(self, driver):
        name = 'OutdoorTdbin'
        driver.find_element_by_id('text_search').send_keys(name)
        driver.find_element_by_id("text_search").send_keys(Keys.ENTER)
        sleep(3)
        box = WebDriverWait(driver, 10).until(lambda x: x.find_element_by_css_selector('#dataTypeStatusBox .glyphicon.glyphicon-time'))
        box.click()
        sleep(2)
        driver.find_element_by_id('historyPointsTimeStart').clear()
        js = "$('#historyPointsTimeStart').val('2016-05-01 00:00')"
        driver.execute_script(js)
        driver.find_element_by_id('historyPointsTimeStart').click()
        #driver.find_element_by_id('historyPointsTimeStart').send_keys('2016-05-01 00:00')
        driver.find_element_by_id('historyPointsSearchConfirm').click()
        sleep(3)
        or_name = driver.find_elements_by_css_selector('.table-body.gray-scrollbar > .table.table-bordered.table-striped > tbody > tr > td')[0]
        clo_name = driver.find_elements_by_css_selector('.table-body.gray-scrollbar > .table.table-bordered.table-striped > tbody > tr > td')[1]
        value = driver.find_elements_by_css_selector('.table-body.gray-scrollbar > .table.table-bordered.table-striped > tbody > tr > td')[3]
        updatetime = driver.find_elements_by_css_selector('.table-body.gray-scrollbar > .table.table-bordered.table-striped > tbody > tr > td')[4]
        user = driver.find_elements_by_css_selector('.table-body.gray-scrollbar > .table.table-bordered.table-striped > tbody > tr > td')[5]
        if (name == or_name.text  and value.text != '' and updatetime.text == '2016-05-01 00:00' and user.text != ''):
            print('使用时间点控件查找成功')
        else:
            self.errors.append('数据管理---现场点查某时间点的历史数据控件可能点名不等,显示的时间和填入的不等,用户名为空,点值为空')

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID, {'start': self.startTime, 'end': self.now})
        os.system(r'del /s /f /q %s\*.xlsx' % self.downloadDir)


if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case057('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)
