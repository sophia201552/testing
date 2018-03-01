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


#url = "http://beop.rnbtech.com.hk"
#该case用来验证数据分析各个页面是否丢失


class Case014(unittest.TestCase):
    testCaseID = 'Case014'
    projectName = '上海华为'
    buzName = '测试数据分析便签功能'
    start = 0.0
    now = 'None'
    startTime = ""
    url = "http://%s" % app.config['SERVERIP']
    errors = []

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver)

    def click_image(self):
        driver = self.driver
        #e元素为第一个图的标题，默认为untitled
        e = driver.find_element_by_css_selector("#divWSPane>div>h4.divPageTitle")
        #将鼠标移动到e元素上方30px的地方并点击，达到进入该图表的功能
        ActionChains(driver).move_to_element_with_offset(e,0,30).click().perform()


    def Test(self):
        a = WebDriverTools()
        driver = self.driver
        #driver.implicitly_wait(8)
        time.sleep(4)
        #从上海华为项目进入数据分析界面并计算加载时间
        a.enterProject(driver, 72, self.projectName, self.errors)
        time.sleep(1)
        #a.enterPage(driver, ['数据分析'], ".breadcrumb>li>a", self.projectName)
        WebDriverTools.enterModuleByUserMenu(driver, 'btnDataAnalys', '数据分析', '.breadcrumb')
        time.sleep(5)
         #进入工作集，选择第一个工作空间
        try:
            driver.find_element_by_css_selector(".breadcrumb>li>a").click()
        except:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,"%s数据分析点击工作集失败！!" % self.projectName
        WebDriverTools.waitElement(driver, '#anlsPane > div:nth-child(1)', self.testCaseID)
        #选择第一个工作集进入
        try:
            driver.find_element_by_css_selector("#anlsPane > div:nth-child(1)").click()
        except:
            WebDriverTools.get_pic(driver, self.testCaseID)
            assert 0,"%s数据分析点击工作集第一个工作空间失败！!" %self.projectName
        #现在工作空间集合中的第二个图像
        try:
            e = driver.find_element_by_css_selector("#divWSPane div:nth-child(2)>h4.divPageTitle")
            ActionChains(driver).move_to_element_with_offset(e,0,30).click().perform()

        except:
            WebDriverTools.get_pic(driver, self.testCaseID)
            assert 0,"%s数据点击分析工作集第一个工作空间的第二个图像失败！" %self.projectName
        #创建note
        time.sleep(2)
        try:
            driver.find_element_by_css_selector("#btnCreateNote").click()

        except:
            WebDriverTools.get_pic(driver, self.testCaseID)
            assert 0,"%s数据分析点击工作集第一个工作空间第二个图表上创建note失败！" %self.projectName
        #进入编辑
        time.sleep(4)
        try:
            elements = driver.find_elements_by_css_selector(".divText.gray-scrollbar")
            elements[-1].click()
        except Exception as fault:
            print(fault.__str__())
            WebDriverTools.get_pic(driver, self.testCaseID)
            assert 0,"%s数据分析点击工作集第一个工作空间第二个图表上的note进入编辑失败！" %self.projectName
        #编辑文本
        time.sleep(2)
        try:
            e = driver.find_element_by_xpath("//iframe[contains(@id,'ueditor')]")
            driver.switch_to_frame(e)
            driver.execute_script("document.getElementsByTagName('body')[0].innerHTML = '你好测试便签的输入'")
            time.sleep(1)
            driver.switch_to_frame(None)
            driver.find_element_by_css_selector(".btn.btn-primary").click()
            time.sleep(1)
        except:
            WebDriverTools.get_pic(driver, self.testCaseID)
            assert  0,"%s数据分析工作集第一个工作空间第二个图表上编辑note失败！" %self.projectName
        #验证输入的note是否保存，切换到总览页面再切换回来，note应该还在

        WebDriverTools.enterModuleByUserMenu(driver, 'btnDataAnalys', '数据分析', '.breadcrumb')
        #driver.find_element_by_css_selector("#ulPages li:nth-child(5) .nav-btn-a").click()
        #a.waitSpinner(driver, "上海华为项目--数据分析")
        time.sleep(1)
        g= driver.find_element_by_css_selector("#divWSPane div:nth-child(2)>h4.divPageTitle")
        ActionChains(driver).move_to_element_with_offset(g,0,30).click().perform()
        time.sleep(1)
        k = driver.find_elements_by_css_selector(".divText.gray-scrollbar")

        noteText = k[-1].text
        if noteText!='你好测试便签的输入':
            WebDriverTools.get_pic(driver, self.testCaseID)
            assert 0,"%s->数据分析工作集第一个工作空间第二个图表上创建的note文本和保存前不一致！" %self.projectName
         #关闭note
        time.sleep(2)
        try:
            ele2 = driver.find_elements_by_css_selector(".divText.gray-scrollbar")
            ActionChains(driver).move_to_element(ele2[-1]).perform()
            time.sleep(0.6)
            #driver.switch_to_alert().accept()
            ele3 = driver.find_elements_by_css_selector(".glyphicon.pinIcon.grow")
            ele3[-1].click()
            sure = [x for x in driver.find_elements_by_css_selector(".btn.btn-info.alert-button") if x.text == '确认']
            sure[0].click()
            #driver.find_elements_by_css_selector(".btn.btn-info.alert-button")[0].click()
            time.sleep(1)
        except Exception as fault:
            print(fault.__str__())
            WebDriverTools.get_pic(driver, self.testCaseID)
            assert 0,"%s->数据分析工作集第一个工作空间第二个图表上关闭note失败！" %self.projectName

        time.sleep(65)





    def tearDown(self):
        self.driver.quit()
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})


if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case014('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)