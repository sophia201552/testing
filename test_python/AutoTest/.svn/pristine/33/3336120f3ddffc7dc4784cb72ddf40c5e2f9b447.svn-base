__author__ = 'wuranxu'
from Methods.WebDriverTools import WebDriverTools
from Methods.MemcacheTools import MemcacheTools
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.action_chains import ActionChains
import datetime, time, string, random
from Methods.LoginTools import LoginTools
from config import app
from selenium.webdriver.common.keys import Keys
import unittest
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support.select import Select
from selenium import webdriver
from Methods.WebDriverTools import WebDriverTools



class Case023(unittest.TestCase):
    testCaseID = 'Case023'
    projectName = "上海中芯国际项目"
    buzName = '能耗统计页面dashboard点添加到数据分析'
    start = 0.0
    now = 'None'
    startTime = ""
    url = "http://%s" % app.config['SERVERIP']
    project = (1,'上海中芯国际')
    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver, 'tester1')

    def Alert(self,driver):
        try:
            driver.switch_to_alert().accept()
        except Exception:
            pass

    def random_str(self, randomlength=8):
        a = list(string.ascii_letters)
        random.shuffle(a)
        return ''.join(a[:randomlength])

    def Test(self):
        #进入上海华为首页
        a = WebDriverTools()
        driver = self.driver
        time.sleep(2)
        self.errors = []
        #进入上海华为总览页面
        a.enterProject(driver, self.project[0], self.project[1], self.errors)
        driver.find_element_by_css_selector("a[pageid='555c41277ddcf3353c3eb403']").click()
        a.waitSpinner(driver,'上海中芯国际项目->能耗统计页面')
        time.sleep(3)
        #添加数据点到数据分析
        dash = driver.find_elements_by_css_selector(".springContainer")
        fullsee = dash[0]
        ActionChains(driver).move_to_element(fullsee).perform()
        fullsee.find_element_by_css_selector("a[title='Add to datasource']").click()
        time.sleep(6)
        group_name = self.random_str(7)
        ele = a.isElementPresent(driver,"#inputNewGroup")
        if ele:
            driver.find_element_by_id("inputNewGroup").send_keys(group_name)
        else:
            assert 0,"上海中芯国际项目->进入能耗统计页面->dashboard添加数据点到数据分析->新建数据组的输入框等待6秒后还没出现."
        driver.find_element_by_id("btnImportJump").click()

        '''try:
            x = driver.switch_to_alert().text
            if "导出失败" in x:
                assert 0,"MyTest->测试组预留2->dashboard添加数据点到数据分析->点击确定按钮后弹出\"导出失败\"对话框！"
            driver.switch_to_alert().accept()
        except Exception as e:
            if "导出失败" in e.__str__():
                assert 0,e.__str__()
            else:
            #driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
                assert 0,'MyTest->测试组预留2->dashboard添加数据点到数据分析->点击确定按钮3秒后没有弹出alert对话框！'
        '''
        a.waitSpinner(driver,'上海中芯国际项目->进入能耗统计页面->dashboard添加数据点->进入数据分析')
        time.sleep(5)
        driver.find_element_by_css_selector("#treeMine li:nth-last-child(2)>span").click()
        addGroup = driver.find_element_by_css_selector("#treeMine li:nth-last-child(2)")
        points = addGroup.find_elements_by_css_selector(" ul li")
        text = addGroup.find_element_by_css_selector(" ul>li>ul>li a span:nth-child(2)").text
        if len(points) == 1:
            print("添加到数据分析成功，点名为%s" % text)
        else:
            assert 0,"上海中芯国际项目->进入能耗统计页面->dashboard数据点添加到数据分析->数据组中未找到该点!"



        '''for group in all_group:
            name = group.text
            if name == group_name:
                #group.click()
                points1 = group.find_element_by_xpath("..")
                points2 = points1.find_element_by_xpath("..")
                time.sleep(1)
                point3 = points2.find_element_by_css_selector(".showName")

                points_name = point3.text
                if points_name == point_name:
                    print("添加到数据分析成功!")
                else:
                    driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
                    assert 0,"MyTest->测试组预留2->dashboard数据点添加到数据分析->数据组中未找到该点!"
        '''

    def tearDown(self):
        self.driver.quit()
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case023('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)