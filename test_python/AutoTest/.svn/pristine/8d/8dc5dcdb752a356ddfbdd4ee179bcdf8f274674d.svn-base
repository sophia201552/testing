__author__ = 'sophia'
import unittest
import datetime, time
from Methods.LoginTools import LoginTools
from Methods.MemcacheTools import MemcacheTools
from Methods.WebDriverTools import WebDriverTools
from Methods.OtherTools import OtherTools
from config import app
from time import sleep
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.wait import WebDriverWait
class Case102(unittest.TestCase):
    testCaseID = "Case102"
    projectName = "光明乳业"
    buzName = "选中一个点,点击轨迹回放,有轨迹曲线,切换日期,拖拽控件处时间也应该变,回到地图是否可用"
    now = 'None'
    url = "http://%s" % app.config['SERVERIP']

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{"startTime":self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver,user="guangming")
        self.tools = WebDriverTools()


    def Test(self):
        driver = self.driver
        self.errors = []
        self.check(driver)
        OtherTools.raiseError(self.errors)

    def check(self,driver):
        page=["光明首页"]
        WebDriverTools.switchToIframe(driver,self.testCaseID,pageName=page)
        driver.find_element_by_css_selector("#movePointBtn").click()
        sleep(2)
        driver.find_element_by_css_selector("#navPoint_20020000000001").click()
        sleep(2)
        driver.find_element_by_css_selector("div[_id='20020000000001']>.dataContainer>button").click()
        self.checkPath(driver)
        yes=datetime.datetime.now()-datetime.timedelta(days=1)
        start=datetime.datetime.strftime(yes, '%Y-%m-%d 00:00')
        end=datetime.datetime.strftime(yes, '%Y-%m-%d 23:59')
        driver.execute_script("$('.startTime >input').attr('value','"+start+"')")
        driver.execute_script("$('.endTime>input').attr('value','"+end+"')")
        driver.execute_script("$('.selectBtn.btn.btn-success').click()")
        start_down=driver.find_element_by_css_selector(".currentStartDate").text
        end_down=driver.find_element_by_css_selector(".currentEndDate").text
        if(start==start_down and end==end_down):
            print("时间正确")
        else:
            self.errors.append("切换日期,拖拽控件处的时间没有改变")
        self.checkPath(driver)
        driver.find_element_by_css_selector(".backMap.btn.btn-primary").click()
        try:
            driver.find_element_by_css_selector("div[_id='20020000000001']")
            print('转回到地图了')
        except Exception as e:
            self.errors.append("点击回到地图没有返回到地图页面")

    def checkPath(self,driver):
        try:
            path=driver.find_element_by_css_selector("svg>path")
            print("历史轨迹路线出来了")
        except Exception as e:
            self.errors.append("9L1423这个移动点的历史轨迹路线没有出来")



    def tearDown(self):
        if ("Exception" or "AssertionError" in str([x[1] for x in self._outcome.errors if x[1]!=None])) or self.errors:
            WebDriverTools.get_pic(self.driver, self.testCaseID)
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})
if __name__ == "__main__":
    suit = unittest.TestSuite()
    suit.addTest(Case102('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suit)
