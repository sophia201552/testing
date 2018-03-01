__author__ = 'woody'

from Methods.WebDriverTools import WebDriverTools
from Methods.MemcacheTools import MemcacheTools
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import ElementNotVisibleException
from selenium.webdriver.common.action_chains import ActionChains
import datetime, time, string, random
from Methods.LoginTools import LoginTools
from config import app
from selenium.webdriver.common.keys import Keys
import unittest, os
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support.select import Select
from selenium import webdriver
from time import sleep


class Case027(unittest.TestCase):
    testCaseID = 'Case027'
    projectName = "不针对项目"
    buzName = '工单的创建修改等操作'
    start = 0.0
    now = 'None'
    startTime = ""
    orderNum = 0
    url = "http://%s" % app.config['SERVERIP']

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver, 'woody')

    def Test(self):
        driver = self.driver
        a = WebDriverTools()
        driver = self.driver
        time.sleep(4)
        #driver.implicitly_wait(8)
        #进入工单
        self.EnterWorkOrder(driver)
        #添加工单
        self.createOrder(driver)
        #验证工单是否添加成功
        self.verifyOrder(driver)
        #编辑工单
        self.editOrder(driver)
        #验证工单是否修改成功
        sleep(4)
        self.verifyChange(driver)
        self.deleteOrder(driver)
        self.verifyItem(driver)

    def EnterWorkOrder(self,driver):
        a = WebDriverTools()
        if a.isElementPresent(driver,'#iconList'):
            #找到用户菜单，并进入工单系统
            driver.find_element_by_id('iconList').click()
            driver.find_element_by_id("paneWorkflow").click()
            #a.find_spinner(driver,time.time(),project='点击用户菜单进入工单',timeout='23')
            sleep(7)
        else:
            assert 0,"登陆Beop后找不到用户菜单!"
        sleep(2)
        handles = driver.window_handles
        now_handle = driver.current_window_handle
        a.switchWindow(driver,now_handle,handles)


    def createOrder(self,driver):
        sleep(1)
        a = WebDriverTools()
        #添加任务
        driver.find_element_by_css_selector("#wf-new-task").click()
        sleep(3)
        if a.isElementPresent(driver,'#wfDetail'):
            print("工单页面加载成功!")
        else:
            WebDriverTools.get_pic(driver, self.testCaseID)
            assert 0,"点击添加任务按钮1秒后,没有弹出工单内容编辑框!"
        #输入工单标题
        driver.find_element_by_css_selector(".mb30.wf-table.wf-detail-table tbody>tr td:nth-child(2)>input").clear()
        driver.find_element_by_css_selector(".mb30.wf-table.wf-detail-table tbody>tr td:nth-child(2)>input").send_keys("工单标题测试-orderTitleTest")
        #输入截止日期
        driver.find_element_by_css_selector("#dueTime").click()
        driver.find_element_by_css_selector(".table-condensed tbody tr:nth-child(6)>td").click()
        #选择任务组
        Select(driver.find_element_by_css_selector(".mb30.wf-table.wf-detail-table #wf-group-type")).select_by_value("4830")
        #选择紧急程度 value 为0
        Select(driver.find_element_by_id("wf-detail-critical")).select_by_value("0")
        sleep(3)
        #编辑工单详情
        driver.find_element_by_css_selector("#wfDetail").clear()
        driver.find_element_by_css_selector("#wfDetail").send_keys("测试工单的使用,确认工单能创建!")
        #选择执行人 找到所有
        edit = driver.find_elements_by_css_selector(".glyphicon.glyphicon-edit.wf-add-user")
        edit[0].click()
        sleep(1)
        self.chooseMem(driver,['陈婷婷02'])
        #确认
        driver.find_element_by_css_selector("#wf-member-comfirm-btn").click()
        sleep(1)
        edit[1].click()
        sleep(1)
        self.chooseMem(driver,['陈婷婷02'])
        sleep(2)
        driver.find_element_by_css_selector("#wf-member-comfirm-btn").click()
        sleep(1)
        edit[2].click()
        sleep(1)
        self.chooseMem(driver,['陈婷婷02'])
        driver.find_element_by_css_selector("#wf-member-comfirm-btn").click()
        Select(driver.find_element_by_css_selector("#labelName")).select_by_value("10")
        sleep(1)
        driver.find_element_by_css_selector("#wf-task-new-submit").click()
        a.waitSpinner(driver,self.testCaseID+"--添加工单 ")


    def verifyOrder(self,driver):
        #验证工单是否创建成功
        rv = [x for x in driver.find_elements_by_css_selector("#wf-task-groups li") if x.text == '自动化测试2']
        if rv:
            rv[0].click()
        else:
            assert 0, "工单中未找到'自动化测试专用工单'!"
        tds = driver.find_elements_by_css_selector("#wf-task-table tbody tr td")
        self.orderNum = int(len(tds) / 9)
        if tds != []:
            print("创建工单成功!")
        else:
            assert 0,self.testCaseID + " 创建工单失败,未找到创建后的工单!"
        #进入工单
        driver.find_element_by_css_selector("#wf-task-table tbody>tr").click()


    def verifyChange(self,driver):
        sleep(4)
        original = ["Test Change!","工单标题测试modified"]
        text = []
        m = 0
        while m < 4:
            a = WebDriverTools.isElementPresent(driver,".wf-task-detail")
            if a:
                break
            else:
                m = m + 1
                sleep(2)
        if m < 4:
            print("4次之内找到该元素!")
        else:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,"创建工单--编辑工单内容--编辑后并保存后工单详情在8秒之内未找到！详见截图!"
        text.append(driver.find_element_by_css_selector(".wf-task-detail").text)
        text.append(driver.find_element_by_css_selector("#wf-detail-form table tbody tr:nth-child(3) td:nth-child(2)").text)
        if text == original:
            print("编辑成功!")
        else:
            assert 0,"创建工单--编辑工单内容--编辑后内容未修改!"

    def editOrder(self,driver):
        a = WebDriverTools()
        #修改工单
        sleep(3)
        driver.find_element_by_css_selector("#wf-detail-edit").click()

        driver.find_element_by_css_selector("#wfName").clear()
        driver.find_element_by_css_selector("#wfName").send_keys("工单标题测试modified")
        driver.find_element_by_css_selector("#dueTime").clear()
        try:
            driver.find_element_by_css_selector("#dueTime").send_keys(str(datetime.datetime.now()).split(' ')[0])
        except Exception as e:
            assert 0,"创建工单后编辑该工单的截止时间时出错！"
        sleep(3)
        driver.find_element_by_css_selector("#wfDetail").clear()
        driver.find_element_by_css_selector("#wfDetail").send_keys("Test Change!")
        driver.find_element_by_css_selector("#wf-detail-save").click()
        a.waitSpinner(driver, self.testCaseID+" 编辑工单内容之后选择保存!")
        sleep(4)

    def deleteOrder(self,driver):
        sleep(3)
        driver.find_element_by_css_selector("#wf-detail-edit").click()
        driver.find_element_by_css_selector("#wf-detail-delete").click()
        sleep(1)
        driver.find_element_by_css_selector("#wf-event-confirm").click()
        sleep(3)

    def verifyItem(self,driver):
        sleep(2)
        #验证工单是否删除成功
        #选中自动化测试专用工单

        rv = [x for x in driver.find_elements_by_css_selector("#wf-task-groups li") if x.text == '自动化测试2']
        if rv:
            rv[0].click()
        else:
            assert 0, "工单中未找到'自动化测试专用工单'!"
        sleep(3)
        tds = driver.find_elements_by_css_selector("#wf-task-table tbody>tr td")
        if self.orderNum == 1:
            print("删除后应该还剩下1个td")
            if len(tds) == 1:
                print("删除工单成功!")
            else:
                WebDriverTools.get_pic(driver, self.testCaseID)
                assert 0,self.testCaseID + " 创建工单--修改后删除该工单失败!"
        else:
            print("删除之前工单不止1个")
            num = int(len(tds) / 9)
            if num + 1 == self.orderNum:
                print("删除工单成功!")
            else:
                WebDriverTools.get_pic(driver, self.testCaseID)
                assert 0,self.testCaseID + " 创建工单--修改后删除该工单失败!"

        #进入工单



    def chooseMem(self,driver,id):
        sleep(2)
        members = driver.find_elements_by_css_selector(".wf-member")
        for m in members:
            if m.text in id:
                m.click()



    def random_str(self, randomlength=8):
        a = list(string.ascii_letters)
        random.shuffle(a)
        return ''.join(a[:randomlength])

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})


if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case027('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)

