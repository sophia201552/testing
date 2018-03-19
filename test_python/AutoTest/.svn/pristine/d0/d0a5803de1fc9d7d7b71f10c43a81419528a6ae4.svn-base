__author__ = 'woody'
'''
    created on 2016/04/12
'''
import datetime
import string
import time
import unittest, random
from time import sleep
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from Methods.LoginTools import LoginTools
from Methods.MemcacheTools import MemcacheTools
from Methods.WebDriverTools import WebDriverTools
from config import app
from selenium.webdriver.support.select import Select


class Case038(unittest.TestCase):
    testCaseID = 'Case038'
    projectName = "梅赛德斯"
    buzName = '巡更路线增删改操作'
    start = 0.0
    now = 'None'
    startTime = ""
    point = {1:"1#厕所",2:"1F 咖哩屋",3:"15#电梯厅",4:"5#厕所"}
    url = "http://%s" % app.config['SERVERIP']

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url,self.testCaseID)
        self.driver = lg.loginPatrol(self.driver, self.url)



    def Test(self):
        driver = self.driver
        time.sleep(4)
        self.newPath(driver)


    #新建巡更路线
    def newPath(self,driver):
        a = WebDriverTools()
        #进入巡更路线页面
        driver.find_element_by_css_selector("#listNav a:nth-child(2)").click()


        #获取当前巡更路线个数
        now_path = driver.find_elements_by_css_selector("#patroPathList .pathCon.clearfix")
        #新建巡更点
        button = a.isElementPresent(driver,"#addPath")
        if button:
            driver.find_element_by_css_selector("#addPath").click()
        else:
            assert 0,"进入%s/patrol页面没有找到新建巡更路线按钮!" % self.url
        sleep(5)
        #输入巡更路线名称，选择计划时间，输入巡更时间范围，配置巡更点
        driver.find_element_by_css_selector("#pathName").send_keys("AutoTestPath")
        driver.find_element_by_css_selector("#pathTime").clear()
        driver.find_element_by_css_selector("#pathTime").send_keys("30")
        driver.find_element_by_css_selector("#groomTime").clear()
        driver.find_element_by_css_selector("#groomTime").send_keys("30")
        for x in range(0,len(list(self.point.keys()))-1):
            driver.find_element_by_css_selector("#btnAddDict").click()
        inputs = driver.find_elements_by_css_selector(".selectCopy")
        for i in range(0,len(inputs)):
            point_name = self.point.get(list(self.point.keys())[i])
            inputs[i].clear()
            inputs[i].send_keys(point_name)
            '''inputs[i].click()
            pts = driver.find_elements_by_css_selector(".optionCopy")
            for p in pts:
                if p.get_attribute("value") == point_name:
                    p.click()
                    break

            sleep(3)'''
        sleep(3)
        driver.find_elements_by_css_selector(".label.label-success")[0].click()
        driver.find_element_by_css_selector("#pathOK").click()


        #等待2秒
        sleep(2)
        #对比是否新加了巡更路线
        new_path = driver.find_elements_by_css_selector("#patroPathList .pathCon.clearfix")
        if len(new_path) - len(now_path) == 1:
            print("巡更路线添加成功!")
        else:
            assert 0,"巡更页面--巡更路线添加失败，因为路线个数没有变化!"

    #编辑巡更路线
    def editPath(self,driver):
        a = WebDriverTools()
        #获取当前巡更点个数
        now_points = driver.find_elements_by_css_selector("#tablePoints tbody tr")
        #找到刚才的巡更点
        point = now_points[-1]
        #选中该巡更点之后进行编辑
        point.click()
        driver.find_element_by_css_selector("#btnEditpoint").click()
        #a.find_spinner(driver,cur_time=time.time(),project="编辑巡更点")
        sleep(3)
        driver.find_element_by_css_selector(".form-control.pointName").clear()
        driver.find_element_by_css_selector(".form-control.pointName").send_keys("自动化测试巡更点")
        Select(driver.find_element_by_css_selector(".form-control.pointType")).select_by_value("1")
        driver.find_element_by_tag_name("textarea").clear()
        driver.find_element_by_tag_name("textarea").send_keys("可以修改!")
        driver.find_element_by_css_selector("#btnSave").click()
        #等待2秒
        sleep(2)

    #验证该点是否编辑成功
    def verify(self,driver):
        point = driver.find_elements_by_css_selector("#tablePoints tbody tr")[-1]
        tdType = point.find_element_by_css_selector(".tdType").get_attribute("data-type")
        tdName = point.find_element_by_css_selector(".tdName").text
        tdContent = point.find_element_by_css_selector(".tdContent").text
        if tdType == "1" and tdName == "自动化测试巡更点" and tdContent == "可以修改":
            print("巡更点编辑成功!")
        else:
            assert 0,"新建的巡更点编辑失败!"





    def delPath(self,driver):
        points = driver.find_elements_by_css_selector("#tablePoints tbody tr")
        #points[-1].click()
        #点击删除按钮
        driver.find_element_by_css_selector("#btnRemove").click()
        c = WebDriverTools.isElementPresent(driver,".infoBox-footer")
        if c:
            sure = [x for x in driver.find_elements_by_css_selector(".btn.btn-info.alert-button") if x.text == '确认']
            sure[0].click()
        else:
            assert 0,"选中新建的巡更点后，删除该巡更点时没有弹出对话框!"
        sleep(3)
        points2 = driver.find_elements_by_css_selector("#tablePoints tbody tr")
        a = len(points) - len(points2)
        if a:
            print("删除巡更点成功!")
        else:
            assert 0,"删除新建巡更点失败!"

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})




