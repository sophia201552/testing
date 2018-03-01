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
from selenium.webdriver.support.select import Select
from selenium import webdriver


class Case056(unittest.TestCase):
    testCaseID = 'Case056'
    projectName = "上海中芯国际"
    buzName = '原始数据界面查看历史,刷新,收藏,分页功能'
    now = 'None'
    url = "http://%s" % app.config['SERVERIP']
    project = (1, '上海中芯国际')

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
        self.checkHistory(driver)
        self.checkPagination(driver)
        self.checkCollection(driver)
        OtherTools.raiseError(self.errors)

    def checkHistory(self, driver):
        page_display = driver.find_element_by_id('filterSort')
        select_page_display = Select(page_display)
        select_page_display.select_by_visible_text("时间从近到远排序")
        sleep(3)
        starttime = driver.find_elements_by_css_selector('.ellipsis')[2].text
        starttime = datetime.datetime.strptime(starttime, "%Y-%m-%d %H:%M")
        tr = driver.find_elements_by_css_selector('.table.table-bordered.table-striped')[1].find_elements_by_css_selector("tbody > tr")[0]
        text = tr.text
        tr.click()
        jionCurve = WebDriverWait(driver, 15).until(lambda x: x.find_element_by_id('joinCurve'))
        jionCurve.click()
        try:
            WebDriverWait(driver, 15).until_not(lambda x: x.find_elements_by_class_name('spinner'))
            print('历史曲线显示出来')
        except Exception as e:
            self.errors.append('历史曲线没有显示出来')
        sure = [x for x in driver.find_elements_by_css_selector(".btn.btn-info.alert-button") if x.text == '确认']
        if sure:
            sure[0].click()
        else:
            text_hist = WebDriverWait(driver, 15).until(lambda x: x.find_element_by_css_selector('#hcPointTree_2_span'))
            text_hist = text_hist.text
            if (text_hist in text):
                print('历史曲线界面的左侧的导航有点名')
            else:
                self.errors.append('数据管理--原始数据查看历史弹框中左侧的点名不存在')
        driver.find_elements_by_css_selector('.close')[-1].click()
        sleep(120)
        driver.find_element_by_id('pointRefresh').click()
        sleep(2)
        overtime = driver.find_elements_by_css_selector('.ellipsis')[2].text
        overtime = datetime.datetime.strptime(overtime, "%Y-%m-%d %H:%M")
        print(starttime, overtime)
        if (overtime - starttime):
            print('刷新按钮管用')
        else:
            self.errors.append('数据管理原始数据刷新按钮不管用')

    def checkCollection(self, driver):
        #global grede
        try:
            tr = driver.find_elements_by_css_selector('.table.table-bordered.table-striped')[1].find_elements_by_css_selector("tbody > tr")[0]
            isMonitoring = WebDriverWait(driver, 15).until(lambda x: x.find_element_by_id('isMonitoring'))
        except Exception as e:
            print(e.__str__())
            self.errors.append("checkCollection error:%s" % (e.__str__()))
        #overtime = driver.find_elements_by_css_selector('#tableWatch > tbody > tr > td')
        trs = driver.find_elements_by_css_selector('.table.table-bordered.table-striped')[1].find_elements_by_css_selector("tbody > tr")
        tr =trs[0]
        score = tr.find_elements_by_css_selector("td")[0]
        st = score.text
        WebDriverWait(tr, 15).until(lambda x: x.find_element_by_css_selector("span"))
        select = tr.find_element_by_css_selector("span >span")
        if('glyphicon-star-empty'  in select.get_attribute('class')):
            select.click()
        sleep(2)
        isMonitoring.click()
        sleep(4)
        overtime = driver.find_elements_by_css_selector('.table.table-bordered.table-striped')[1].find_elements_by_css_selector("tbody > tr >td")
        if st in overtime[0].text:
            print("数据信息收藏添加成功！")
        else:
            self.errors.append("数据信息收藏添加失败！")
        sleep(2)
        driver.refresh()
        button = driver.find_element_by_id('isMonitoring')
        driver.execute_script("$('#searchPoint').val('"+st+"')" )
        driver.execute_script("$('#filterConfirm').click()")
        sleep(3)
        trs = driver.find_elements_by_css_selector('.table.table-bordered.table-striped')[1].find_elements_by_css_selector("tbody > tr")
        for i in trs:
            grede =  i.find_elements_by_css_selector("td")[0].text
            if grede == st:
                i.find_elements_by_css_selector("td")[-1].find_element_by_css_selector("span >span").click()
        sleep(2)
        button.click()
        sleep(2)
        delele =driver.find_elements_by_css_selector('.table.table-bordered.table-striped')[1].find_element_by_css_selector("tbody")
        if st not in delele.text:
            print("数据信息收藏删除成功")
        else:
            WebDriverTools.get_pic(driver, self.testCaseID)
            self.errors.append("数据信息收藏删除失败")



    def checkPagination(self, driver):
        # 检查每页最大多少项的切换
        page_display = driver.find_element_by_css_selector('.pageSizeSelect.form-control')
        select_page_display = Select(page_display)
        select_page_display.select_by_visible_text("100")
        sleep(2)

        trs = driver.find_elements_by_css_selector('.table.table-bordered.table-striped')[1].find_elements_by_css_selector("tbody > tr")
        if (len(trs) <= 100):
            print('切换页面的数量成功')
        else:
            self.errors.append('数据管理---原始数据切换每页最大项失败')
        if len(driver.find_elements_by_css_selector('#dataManagePagination > li > a')) > 8:
            text1 = driver.find_elements_by_css_selector('.table.table-bordered.table-striped')[1].find_elements_by_css_selector("tbody > tr >td")[0].text
            driver.find_elements_by_css_selector('#dataManagePagination > li > a')[0].click()
            sleep(2)
            text0 = driver.find_elements_by_css_selector('.table.table-bordered.table-striped')[1].find_elements_by_css_selector("tbody > tr >td")[0].text
            if (text1 == text0):
                print('分页回到第一页不能用')
            else:
                self.errors.append('数据管理---原始数据目前在第一页点击回到第一页的按钮能用了')

            driver.find_elements_by_css_selector('#dataManagePagination > li >a')[1].click()
            sleep(2)
            text0_0 = driver.find_elements_by_css_selector('.table.table-bordered.table-striped')[1].find_elements_by_css_selector("tbody > tr >td")[0].text
            if (text1 == text0_0):
                print('分页回到上一页不能用')
            else:
                self.errors.append('数据管理---原始数据目前在第一页点击回到上一页的按钮能用了')
            driver.find_elements_by_css_selector('#dataManagePagination > li >a')[3].click()
            sleep(2)
            text2 = driver.find_elements_by_css_selector('.table.table-bordered.table-striped')[1].find_elements_by_css_selector("tbody > tr >td")[0].text
            if (text1 != text2):
                print('切换到第2页成功')
            else:
                self.errors.append('数据管理---原始数据切换到第2页失败')
            driver.find_element_by_css_selector('#dataManagePagination > li.next >a').click()
            sleep(2)
            text3 =driver.find_elements_by_css_selector('.table.table-bordered.table-striped')[1].find_elements_by_css_selector("tbody > tr >td")[0].text
            if (text3 != text2):
                print('切换到第3页成功')
            else:
                self.errors.append('数据管理---原始数据切换到第3页失败')
            driver.find_element_by_css_selector('#dataManagePagination > li.last >a').click()
            sleep(2)
            text4 = driver.find_elements_by_css_selector('.table.table-bordered.table-striped')[1].find_elements_by_css_selector("tbody > tr >td")[0].text
            if (text3 != text4):
                print('切换到最后一页成功')
            else:
                self.errors.append('数据管理---原始数据切换到最后一页失败')
            driver.find_elements_by_css_selector('#dataManagePagination > li >a')[1].click()
            sleep(2)
            text5 = driver.find_elements_by_css_selector('.table.table-bordered.table-striped')[1].find_elements_by_css_selector("tbody > tr >td")[0].text
            if (text5 != text4):
                print('切换到从最后一页切换到上一页成功')
            else:
                self.errors.append('数据管理---原始数据从最后一页切换到上一页失败')
            driver.find_elements_by_css_selector('#dataManagePagination > li > a')[0].click()
            sleep(2)
            text6 = driver.find_elements_by_css_selector('.table.table-bordered.table-striped')[1].find_elements_by_css_selector("tbody > tr >td")[0].text
            if (text5 != text6):
                print('切换到第一页成功')
            else:
                self.errors.append('数据管理---原始数据从最后一页切换到第一页失败')

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID, {'start': self.startTime, 'end': self.now})


if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case056('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)
