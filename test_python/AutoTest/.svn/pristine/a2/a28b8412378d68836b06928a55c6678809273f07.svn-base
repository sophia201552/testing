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

url = "http://%s" % app.config['SERVERIP']
#url = "http://beop.rnbtech.com.hk"

class Case017(unittest.TestCase):
    testCaseID = 'Case017'
    projectName = "不针对项目"
    buzName = '测试wiki页面的相关操作'
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
        driver = self.driver
        time.sleep(4)
        #driver.implicitly_wait(8)
        # 点击用户菜单，进入wiki
        driver.find_element_by_id("iconList").click()
        driver.find_element_by_id("btnWikiManage").click()
        #等待wiki页面加载,而后判断wiki数量
        time.sleep(2)
        try:
            driver.switch_to_alert().accept()
        except Exception:
            print("页面中存在wiki")
        WikiElement = driver.find_elements_by_css_selector("div[class~='divWiki'] .row")
        print('wiki数量为%d' % len(WikiElement))
        #创建一个wiki
        driver.find_element_by_id("mngCreateWiki").click()
        time.sleep(0.8)
        #不输入任何东西点击确认按钮
        driver.find_element_by_id("confirm").click()
        time.sleep(1.2)
        try:
            sure = [x for x in driver.find_elements_by_css_selector(".btn.btn-info.alert-button") if x.text == '确认']
            sure[0].click()
            #driver.find_element_by_css_selector(".btn.btn-info.alert-button").click()
            #driver.switch_to_alert().accept()
        except Exception:
            assert 0,'首页->进入wiki界面->点击添加按钮->不输入任何数据点击确认后没有弹出提示!'
        time.sleep(0.5)
        #添加title,tag等内容
        driver.find_element_by_id("wikiTitle").clear()
        driver.find_element_by_id("wikiTitle").send_keys("WikiTest")
        driver.find_element_by_css_selector("#tagStr>li>span").click()
        driver.find_element_by_css_selector("#tagStr input").send_keys("tagTest")
        driver.find_element_by_css_selector("#tagProject>li>span").click()
        driver.find_element_by_css_selector("#tagProject select").click()
        driver.find_element_by_css_selector("#tagProject select option:nth-child(2)").click()
        #进入编辑器frame
        e = driver.find_element_by_xpath("//iframe[contains(@id,'ueditor')]")
        driver.switch_to_frame(e)
        driver.execute_script("document.getElementsByTagName('body')[0].innerHTML = '你好测试wiki的输入'")
        time.sleep(1)
        driver.switch_to_frame(None)
        driver.find_element_by_id("confirm").click()
        time.sleep(3)
        WikiElement2 = driver.find_elements_by_css_selector("div[class~='divWiki'] .row")
        if len(WikiElement) == len(WikiElement2) - 1:
            print("添加wiki后wiki总数量为%d" % len(WikiElement2))
        else:
            assert 0,'首页->wiki->添加wiki失败'
        title = driver.find_element_by_css_selector("div[class='divWiki gray-scrollbar'] div:nth-last-child(1) div:nth-child(2)").text
        tag = driver.find_element_by_css_selector("div[class='divWiki gray-scrollbar'] div:nth-last-child(1) div:nth-child(3) span").text
        project = driver.find_element_by_css_selector("div[class='divWiki gray-scrollbar'] div:nth-last-child(1) div:nth-child(4) span").text
        if title == 'WikiTest'and tag == 'tagTest' and project == '上海中芯国际':
            print("title,tag,project显示正常!")
        else:
            assert 0,'首页->wiki->wiki list->新增的wiki中Title,tag,project显示与wiki编辑时不一致!'
        #删除新增加的wiki
        time.sleep(2)

        e = driver.find_element_by_css_selector("div[class='divWiki gray-scrollbar'] div:nth-last-child(1) .col-xs-2")
        x = driver.find_elements_by_css_selector(".glyphicon.glyphicon-remove.grow")
        ActionChains(driver).move_to_element(e).perform()
        x[-1].click()
        time.sleep(1)
        #driver.switch_to_alert().accept()
        try:
            sure = [x for x in driver.find_elements_by_css_selector(".btn.btn-info.alert-button") if x.text == '确认']
            sure[0].click()
            #driver.find_elements_by_css_selector(".btn.btn-info.alert-button")[0].click()
        except Exception as e:
            assert 0,"创建WIKI--编辑后删除该WIKI时没有弹出是否删除的提示窗口"
        time.sleep(3)
        WikiElement3 = driver.find_elements_by_css_selector("div[class~='divWiki'] .row")
        if len(WikiElement3) == len(WikiElement):
            print("删除wiki后wiki总数量为%d" % len(WikiElement3))
        else:
            assert 0,'首页->wiki->删除新增加的wiki失败!'

    def tearDown(self):
        self.driver.quit()
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})





if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case017('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)


