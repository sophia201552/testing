__author__ = 'woody'
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




class Case034(unittest.TestCase):
    testCaseID = 'Case034'
    projectName = "WebFactory"
    buzName = 'Factory新建项目等操作'
    start = 0.0
    now = 'None'
    startTime = ""
    url = "http://%s" % app.config['SERVERIP']

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChromeFactory(self.url, self.testCaseID)
        self.driver = lg.loginFactory(self.driver)

    def Test(self):
        sleep(2)
        projName = "UITest" + str(datetime.datetime.now())
        driver = self.driver
        projs = driver.find_element_by_css_selector("#projectList")
        if(projName in projs.text):
            self.delProj(driver,1)
        self.newProj(driver,projName)
        self.checkProj(driver,projName)
        self.newPage(driver,projName)
        self.checkPage(driver,projName)
        self.delPage(driver,projName)
        sleep(2)
        self.checkPage2(driver,projName)
        self.delProj(driver,projName)

    def newProj(self,driver,projName):
        a = WebDriverTools()
        self.projNum1 = len(driver.find_elements_by_css_selector("#projectList div"))
        a.clickEle(driver, "#addPro", self.testCaseID, self.projectName, page='factory--新建项目')
        #driver.find_element_by_css_selector("#addPro").click()
        sleep(2)
        try:
            #等待新建项目对话框出现
            WebDriverWait(driver, 10).until(lambda x: x.find_element_by_css_selector(".proName"))
        except Exception as e:
            assert 0,"进入factory后点击新建项目按钮，等待10秒仍未弹出新建项目对话框!"
        #清空项目名称输入框
        sleep(1)
        driver.find_element_by_css_selector(".proName").clear()
        #输入TestProj
        driver.find_element_by_css_selector(".proName").send_keys(projName)
        #点击新增按钮
        driver.find_element_by_css_selector("#addNewPro").click()
        sleep(4)
        try:
            wrongAlert=driver.find_element_by_css_selector("#addProj > div.modal-dialog > div > div.modal-body > div.wrongAlert")
            wrong=wrongAlert.text
            if('exists' in wrong):
                assert  0,'已经存在TestProj项目，可能是没有删除掉该项目'
            else:
                print('没有已经存在的项目')
        except:
            print('没有已经存在的项目')
        sleep(5)
        js='$("span[title=\'%s\']").dblclick()' % projName
        driver.execute_script(js)
        try:
            #等待新建项目对话框出现
            WebDriverWait(driver, 15).until(lambda x: x.find_element_by_css_selector(".icon-circle-arrow-right"))
        except Exception as e:
            print(e.__str__())
            WebDriverTools.get_pic(driver, self.testCaseID)
            assert 0,"进入factory后点击新建项目按钮，等待10秒后页面右上角没有出现'页面管理'!"

    def checkProj(self,driver,projName):
        #返回factory首页查看是否建立了该项目
        sleep(2)
        driver.find_element_by_css_selector("#lkProjectLogo").click()
        sleep(2)
        names = []
        self.projNum2 = len(driver.find_elements_by_css_selector("#projectList div"))
        if self.projNum2 > self.projNum1:
            print("项目建立成功!")
        else:
            assert 0,"新建factory项目后项目个数没有增加，请检查!"
        proj = driver.find_elements_by_css_selector(".proText")
        if proj == []:
            assert 0,"新建项目后没有找到项目名!"
        else:
            for p in proj:
                names.append(p.text)
        if projName in names:
            print("新建项目成功!")
        else:
            assert 0,"新建项目失败!"






    def newPage(self,driver,projName):
        a = WebDriverTools()
        #进入所建立的项目
        projs = driver.find_elements_by_css_selector(".proText")
        if projs != []:
            # for p in projs:
            #     if p.text == projName:
            #         # p.click()
            js='$("span[title=\'%s\']").dblclick()' % projName
            driver.execute_script(js)
        else:
            assert 0,"factory项目页左侧未找到项目!"
        #a.find_spinner(driver,cur_time=time.time(),project="进入factory中新添加的项目",timeout="15")
        sleep(2)
        try:
            WebDriverWait(driver, 15).until(lambda x: x.find_element_by_css_selector(".icon-circle-arrow-right"))
        except Exception as e:
            WebDriverTools.get_pic(driver, self.driver)
            assert 0,"factory进入新添加的项目，等待10秒后页面右上角没有出现'页面管理'!"
        driver.find_element_by_css_selector("#addPage").click()
        sleep(2)
        x = a.isElementPresent(driver,"#inputPageName")
        if x:
            print("输入框存在!")
        else:
            assert 0,"在新加的项目中添加页面时没有找到输入页面名字的输入框!"
        driver.find_element_by_css_selector("#inputPageName").clear()
        driver.find_element_by_css_selector("#inputPageName").send_keys("NewPage")
        #确认新建页面
        driver.find_element_by_css_selector("#btnOk").click()
        sleep(3)
        #保存该页面
        driver.find_element_by_css_selector("#lkSync").click()
        sleep(3)

    def checkPage(self,driver,projName):
        a = WebDriverTools()
        driver.find_element_by_css_selector("#lkProjectLogo").click()
        sleep(2)
        #进入所建立的项目
        projs = driver.find_elements_by_css_selector(".proText")
        if projs != []:
            # for p in projs:
            #     if p.text == projName:
            #         p.click()
            js='$("span[title=\'%s\']").dblclick()' % projName
            driver.execute_script(js)
        else:
            assert 0,"factory项目页左侧未找到项目!"
        #a.find_spinner(driver,cur_time=time.time(),project="进入factory中新添加的项目",timeout="15")
        sleep(2)
        pages = driver.find_elements_by_css_selector("#treeControl li")
        if len(pages) == 1:
            print("添加页面成功!")
        else:
            WebDriverTools.get_pic(driver, self.testCaseID)
            assert 0,"factory--新建项目后添加页面失败!"
    def delPage(self,driver,projName):
        pages = driver.find_elements_by_css_selector("#treeControl li")
        pages[0].click()
        #删除该页面
        driver.find_element_by_css_selector("#delGroupPage").click()
        sleep(2)
        sure = [x for x in driver.find_elements_by_css_selector(".btn.btn-info.alert-button") if x.text == '确认' or x.text == 'OK']
        sure[0].click()
        #driver.find_elements_by_css_selector(".btn.btn-info.alert-button")[0].click()

    def checkPage2(self,driver,projName):
        a = WebDriverTools()
        driver.find_element_by_css_selector("#lkProjectLogo").click()
        sleep(2)
        #进入所建立的项目
        projs = driver.find_elements_by_css_selector(".proText")
        if projs != []:
            # for p in projs:
            #     if p.text == projName:
            #         p.click()
            js='$("span[title=\'%s\']").dblclick()' % projName
            driver.execute_script(js)
        else:
            WebDriverTools.get_pic(driver, self.testCaseID)
            assert 0,"factory项目页左侧未找到项目!"
        #a.find_spinner(driver,cur_time=time.time(),project="进入factory中新添加的项目",timeout="15")
        sleep(2)
        pages = driver.find_elements_by_css_selector("#treeControl li")
        if len(pages) == 0:
            print("删除页面成功!")
        else:
            assert 0,"factory--新建项目后添加页面再删除时失败!"
    def delProj(self,driver,projName,flag=0):
        if(flag==1):
            pass
        else:
            driver.find_element_by_css_selector("#lkProjectLogo").click()
        projs = driver.find_elements_by_css_selector(".proText")
        proj1 = len(projs)
        if projs != []:
            '''for p in projs:
                if p.text == projName:
                    x = projs.index(p)
                    #driver.find_element_by_xpath("../span[4]").click()

                    #删除项目
                    target = driver.find_elements_by_css_selector("#projectList div")[x]
                    sleep(1)
                    projectId = "deletePro_" + target.get_attribute('projectid')
                    ActionChains(driver).move_to_element(p).perform()
                    sleep(3)
                    driver.execute_script("$('#%s').click()" % projectId)
                    #driver.find_element_by_id("deletePro_"+projectId).click()
                    #target.find_element_by_css_selector(".spanBox .glyphicon.glyphicon-remove-sign.deletePro").click()
                    sleep(3)
                    driver.find_element_by_css_selector(".btn.btn-default.directRemove").click()
                    driver.find_element_by_css_selector("#removePass").clear()
                    driver.find_element_by_css_selector("#removePass").send_keys("Rnbtech1103")
                    sleep(1)
                    driver.find_element_by_css_selector(".btn.btn-default.directRemove").click()
                    break'''
            projectId = "deletePro_" + driver.find_element_by_css_selector("#projectList div:nth-last-child(1)").get_attribute("projectid")
            #删除项目
            #target = driver.find_elements_by_css_selector("#projectList div")[x]
            #sleep(1)
            #projectId = "deletePro_" + target.get_attribute('projectid')
            ActionChains(driver).move_to_element(driver.find_element_by_css_selector("#projectList div:nth-last-child(1)")).perform()
            sleep(3)
            driver.execute_script("$('#%s').click()" % projectId)
            #driver.find_element_by_id("deletePro_"+projectId).click()
            #target.find_element_by_css_selector(".spanBox .glyphicon.glyphicon-remove-sign.deletePro").click()
            sleep(3)
            driver.find_element_by_css_selector(".btn.btn-default.directRemove").click()
            driver.find_element_by_css_selector("#removePass").clear()
            driver.find_element_by_css_selector("#removePass").send_keys("Rnbtech1103")
            sleep(1)
            driver.find_element_by_css_selector(".btn.btn-default.directRemove").click()
        else:
            assert 0,"factory项目页左侧未找到项目!"
        sleep(5)
        projs2 = driver.find_elements_by_css_selector(".proText")
        if len(projs2) < proj1:
            print("删除项目成功!")
        else:
            assert 0,"factory删除项目失败!"

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})



if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case034('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)
