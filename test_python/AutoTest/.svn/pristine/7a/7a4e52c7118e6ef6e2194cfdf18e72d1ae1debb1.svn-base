__author__ = 'sophia'


from time import sleep
from Methods.LoginTools import LoginTools
from Methods.MemcacheTools import MemcacheTools
from Methods.OtherTools import OtherTools
from Methods.Log import Log
from Methods.WebDriverTools import WebDriverTools
import unittest
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.select import Select
from config import app
import datetime, time
from selenium.webdriver.support.wait import WebDriverWait

projName = "深圳华为演示用"
class Case042(unittest.TestCase):
    testCaseID = 'Case042'
    projectName = "WebFactory"
    buzName = 'Factory新建,修改,删除页面'
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
        driver = self.driver
        self.enterProj(driver)
        self.newPage(driver)
        self.verifyNewPage(driver)
        self.enterFactory(driver)
        self.enterProj(driver)
        self.editPage(driver)
        self.verifyEditPage(driver)
        self.enterFactory(driver)
        self.enterProj(driver)
        self.deletePage(driver)
        self.verifyDeletePage(driver)

    def enterFactory(self,driver):
        driver.get(self.url+"/factory")
        sleep(3)

    def enterProj(self,driver):
        projs = WebDriverWait(driver, 15).until(lambda x: x.find_elements_by_css_selector(".proText"))
        if projs != []:
            # for p in projs:
            #     if projName in p.text:
            #         js=''
            #         break
            js='$("span[title=\'深圳华为演示用\']").dblclick()'
            driver.execute_script(js)
        else:
            assert 0,"深圳华为演示用项目页左侧未找到项目!"
        sleep(2)

    def newPage(self,driver):
        sleep(2)
        #进入到最后一个页面
        try:
            page = driver.find_element_by_css_selector('#treeControl>li:last-child')
        except:
            assert 0,'目录页面为空'
        ActionChains(driver).double_click(page).perform()
        sleep(3)
        #进入页面管理
        tabs = driver.find_elements_by_css_selector('.tab-handle.disable-selection')
        tabs[1].click()
        #填写页面信息
        sleep(2)
        driver.find_element_by_id('addPage').click()
        driver.find_element_by_id('inputPageName').clear()
        driver.find_element_by_id('inputPageName').send_keys('冷凝温度')
        page_type = driver.find_element_by_id('selectPageType')
        select_page_type = Select(page_type)
        select_page_type.select_by_visible_text("Page")
        driver.find_element_by_id('inputPageWidth').clear()
        driver.find_element_by_id('inputPageWidth').send_keys('1360')
        driver.find_element_by_id('inputPageHeight').clear()
        driver.find_element_by_id('inputPageHeight').send_keys('655')
        page_display = driver.find_element_by_id('selectPageDisplay')
        select_page_display = Select(page_display)
        select_page_display.select_by_visible_text("拉伸")
        driver.find_element_by_id('btnOk').click()
        sleep(3)
        #发布页面
        driver.find_element_by_id('userAccount').click()
        driver.find_element_by_id('lkRelease').click()
        WebDriverTools.waitElement(driver,'#inputPwd',self.testCaseID)
        driver.find_element_by_id('inputPwd').send_keys('Rnbtech1103')
        driver.find_element_by_id('inputMsg').send_keys('123')
        driver.find_element_by_id('btnSubmit').click()
        WebDriverTools.waitElement(driver,'div.infoBox-footer > button',self.testCaseID,timeout=20)
        driver.find_element_by_css_selector('div.infoBox-footer > button').click()
        time.sleep(2)

    def verifyNewPage(self,driver):
        #跳到深圳华为演示用
        driver.get(self.url)
        WebDriverTools.alert(driver)
        WebDriverTools.waitElement(driver, 'div[project-id="189"]',self.testCaseID, timeout=20)
        WebDriverTools.enterProject(driver, 189, self.projectName)
        sleep(5)
        navs = driver.find_element_by_id('ulPages').find_elements_by_class_name('nav-btn-text')
        texts =[]
        #比较页面标题内容
        for nav in navs:
            texts.append(nav.text)
        if("冷凝温度" in texts):
            print('新建成功')
        else:
            assert 0,'新建失败'

    def editPage(self,driver):
        sleep(5)
        #进入到最后一个页面
        try:
            page = driver.find_element_by_css_selector('#treeControl>li:last-child')
        except:
            assert 0,'目录页面为空'
        ActionChains(driver).double_click(page).perform()
        sleep(3)
        #进入页面管理
        tabs = driver.find_elements_by_css_selector('.tab-handle.disable-selection')
        tabs[1].click()
        #找到刚才新建的页面
        try:
            ActionChains(driver).move_to_element(driver.find_element_by_css_selector('a[title="冷凝温度 - PageScreen"]')).double_click().perform()
        except:
            assert 0,'新建的页面不存在或者丢失'
        #再次进入页面管理
        tabs = driver.find_elements_by_css_selector('.tab-handle.disable-selection')
        tabs[1].click()
        #修改页面信息
        sleep(2)
        driver.find_element_by_id('editPage').click()
        s=driver.find_element_by_id('inputPageName')
        s.clear()
        s.send_keys("传感器分析")
        is_enabled = driver.find_element_by_id('selectPageType').is_enabled()
        if(is_enabled ==   False):
            print('不可编辑页面类型')
        else:
            assert 0,'页面类型在编辑时能操作'
        driver.find_element_by_id('inputPageWidth').clear()
        driver.find_element_by_id('inputPageWidth').send_keys('1250')
        driver.find_element_by_id('inputPageHeight').clear()
        driver.find_element_by_id('inputPageHeight').send_keys('600')
        page_display = driver.find_element_by_id('selectPageDisplay')
        select_page_display = Select(page_display)
        select_page_display.select_by_visible_text("居中")
        driver.find_element_by_id('btnOk').click()
        sleep(3)
        #保存
        driver.find_element_by_id('lkSync').click()
        #发布页面
        driver.find_element_by_id('userAccount').click()
        driver.find_element_by_id('lkRelease').click()
        sleep(3)
        driver.find_element_by_id('inputPwd').send_keys('Rnbtech1103')
        driver.find_element_by_id('inputMsg').send_keys('123')
        driver.find_element_by_id('btnSubmit').click()
        WebDriverTools.waitElement(driver, '.btn.btn-info.alert-button', self.testCaseID,timeout=20)
        driver.find_element_by_css_selector('.btn.btn-info.alert-button').click()

    def verifyEditPage(self,driver):
        #跳到深圳华为演示用
        driver.get(self.url)
        WebDriverTools.alert(driver)
        WebDriverTools.waitElement(driver, 'div[project-id="189"]', self.testCaseID,timeout=20)
        driver.find_element_by_css_selector('div[project-id="189"]').click()
        sleep(5)
        navs = driver.find_element_by_id('ulPages').find_elements_by_class_name('nav-btn-text')
        texts =[]
        #比较页面标题内容
        for nav in navs:
            texts.append(nav.text)
        if("传感器分析" in texts):
            print('修改成功')
        else:
            assert 0,'修改factory新发布的页面名称失败！'

    def deletePage(self,driver):
        sleep(5)
        #进入到最后一个页面
        try:
            page = driver.find_element_by_css_selector('#treeControl>li:last-child')
        except:
            assert 0,'目录页面为空'
        ActionChains(driver).double_click(page).perform()
        sleep(3)
        #进入页面管理
        tabs = driver.find_elements_by_css_selector('.tab-handle.disable-selection')
        tabs[1].click()
        #找到刚才修改后的页面
        try:
            alters=driver.find_elements_by_css_selector('a[title="传感器分析 - PageScreen"]')
        except:
            assert 0,'修改的页面不存在或者丢失'
        #删除页面信息
        sleep(2)
        for a in range(len(alters)):
            alters[a].click()
            driver.find_element_by_id('delGroupPage').click()
            #driver.find_element_by_class_name('infoBox-footer').find_elements_by_tag_name('button')[0].click()
            driver.find_elements_by_css_selector('.btn.btn-info.alert-button')[0].click()
        pages = driver.find_elements_by_css_selector(".level0.tree-page-hover")
        for p in range(len(pages)):
            if('传感器分析' in pages[p].text):
                assert 0,'factory页面删除失败'
            else:
                print("factory删除页面成功!")
        driver.find_element_by_id('userAccount').click()
        driver.find_element_by_id('lkRelease').click()
        sleep(3)
        offs=driver.find_elements_by_css_selector('#treeNavOffline>li')
        for o in range(len(offs)):
            if('传感器分析' in offs[o].text or '冷凝' in offs[o].text):
                 offs[o].find_element_by_css_selector('span.button.chk.checkbox_true_full').click()
        onlies=driver.find_elements_by_css_selector('#treeNavOnline>li')
        for o in range(len(onlies)):
            if('传感器分析' in onlies[o].text or '冷凝' in onlies[o].text):
                 is_true=onlies[o].find_element_by_css_selector('span:nth-child(2)').get_attribute('class')
                 if ('true' in is_true):
                        onlies[o].find_element_by_css_selector('span:nth-child(2)').click()
                 else:
                        pass
        driver.find_element_by_id('inputPwd').send_keys('Rnbtech1103')
        driver.find_element_by_id('inputMsg').send_keys('123')
        driver.find_element_by_id('btnSubmit').click()
        sleep(3)
        driver.find_element_by_css_selector('div.infoBox-footer > button').click()

    def verifyDeletePage(self,driver):
        #跳到深圳华为演示用
        driver.get(self.url)
        sleep(2)
        WebDriverTools.alert(driver)
        self.driver.find_element_by_css_selector('div[project-id="189"]').click()
        sleep(4)
        navs = driver.find_element_by_id('ulPages').find_elements_by_class_name('nav-btn-text')
        texts =[]
        #比较页面标题内容
        for nav in navs:
            texts.append(nav.text)
        if("传感器分析" not in texts or '冷凝' in texts):
            print('线上项目删除页面成功')
        else:
            assert 0,'线上项目删除页面失败'

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})


if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case042('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)