__author__ = 'wuranxu'

from Methods.WebDriverTools import WebDriverTools
from Methods.MemcacheTools import MemcacheTools
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.action_chains import ActionChains
import datetime, time
from Methods.LoginTools import LoginTools
from config import app
import unittest
url = "http://%s" % app.config['SERVERIP']
#url = "http://beop.rnbtech.com.hk"
#该case用来验证数据分析工作集合的增删改等操作


class Case011(unittest.TestCase):
    testCaseID = 'Case011'
    projectName = "上海华为项目"
    buzName = '测试数据分析模板相关操作'
    start = 0.0
    now = 'None'
    startTime = ""
    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(url,self.testCaseID)
        self.driver = lg.login(self.driver)

    def Test(self):
        a = WebDriverTools()
        driver = self.driver
        #driver.implicitly_wait(8)
        time.sleep(6)
        #从上海华为项目进入数据分析界面并计算加载时间
        if driver.find_element_by_css_selector(".glyphicon.glyphicon-list").is_displayed():
            try:
                WebDriverTools.enterProject(driver, 72, self.projectName)
                WebDriverTools.enterModuleByUserMenu(driver, 'btnDataAnalys', '数据分析', '.breadcrumb')
                time.sleep(1)
            except NoSuchElementException:
                WebDriverTools.get_pic(driver, self.testCaseID)
                assert 0,"登录后没有进入导航模式,地图加载失败!"
        else:
            WebDriverTools.enterProject(driver, '#project-72-shhuawei-undefined', self.projectName)
            WebDriverTools.enterModuleByUserMenu(driver, 'btnDataAnalys', '数据分析', '.breadcrumb')
            time.sleep(1)
        time.sleep(1)
        driver.find_element_by_css_selector(".breadcrumb>li>a").click()


        #测试上海华为->数据分析->工作集->工作空间->"放大镜"按钮的预览功能
        '''driver.find_element_by_id("btnPreview").click()
        time.sleep(0.5)
        try:
            driver.switch_to_alert().accept()
        except Exception:
            assert 0,"上海华为->数据分析->工作集->工作空间->不选择工作空间后点击放大镜按钮未弹出提示框!"
        #选中工作空间->上海华为数据分析
        driver.find_element_by_css_selector("#anlsPane div[class~='fromTemplate'] .check-cb").click()
        driver.find_element_by_id("btnPreview").click()'''




        #测试模板功能
        WebDriverTools.clickEle(driver, '#btnShowTemplate', self.testCaseID, self.projectName, '数据分析--工作集--模板')
        #driver.find_element_by_id("btnShowTemplate").click()
        time.sleep(2)
        tem = driver.find_elements_by_css_selector("#anlsPane div[class~='template']")
        if tem == []:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,'数据分析->工作集->进入模板界面，模板丢失!'
        else:
            print("模板数量为%d" % (len(tem)-1))
        #点击添加模板按钮
        driver.find_element_by_css_selector(".glyphicon.glyphicon-plus").click()
        time.sleep(1)
        try:
            driver.switch_to_alert().send_keys("TemplateTest")
            driver.switch_to_alert().accept()
        except Exception:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,"数据分析->工作集->进入模板界面后点击添加模板按钮未能弹出对话框!"
        time.sleep(4)
        tem1 = driver.find_elements_by_css_selector("#anlsPane div[class~='template']")
        if len(tem) + 1 == len(tem1):
            print("数据分析->工作集->进入模板页面->添加新模板成功!")
        else:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,"数据分析->工作集->进入模板页面->添加新模板失败!"
        ActionChains(driver).move_to_element(driver.find_element_by_css_selector("#anlsPane div:nth-last-child(2)")).perform()
        time.sleep(1)
        driver.find_element_by_css_selector("#anlsPane div:nth-last-child(2) h3 span:nth-child(2)").click()
        driver.find_element_by_css_selector("#anlsPane div:nth-last-child(2) h3>div input").clear()
        driver.find_element_by_css_selector("#anlsPane div:nth-last-child(2) h3>div input").send_keys("TestChange")
        driver.find_element_by_css_selector("#anlsPane div:nth-last-child(2) h3>div button").click()
        time.sleep(2)
        ActionChains(driver).move_to_element(driver.find_element_by_css_selector("#anlsPane div:nth-last-child(2)")).perform()
        time.sleep(1)
        driver.find_element_by_css_selector("#anlsPane div:nth-last-child(2) .divTemplateBtnGroup span:nth-child(2)").click()
        time.sleep(2)
        #driver.switch_to_alert().accept()
        try:
            sure = [x for x in driver.find_elements_by_css_selector(".btn.btn-info.alert-button") if x.text == '确认']
            sure[0].click()
            #driver.find_elements_by_css_selector(".btn.btn-info.alert-button")[0].click()
        except Exception as e:
            assert 0,"数据分析--删除新建的模板时没有弹出是否删除该模板的提示窗口"
        tem2 = driver.find_elements_by_css_selector("#anlsPane div[class~='template']")
        if len(tem) == len(tem2):
            print("数据分析->工作集->进入模板页面->添加新模板->删除该模块成功!")
        else:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,"数据分析->工作集->进入模板页面->添加新模板->删除该模块失败!"

    def tearDown(self):
        self.driver.quit()
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

if __name__ == "__main__":
    while 1:
        suite = unittest.TestSuite()
        suite.addTest(Case011('Test'))
        runner = unittest.TextTestRunner()
        runner.run(suite)
        time.sleep(10)