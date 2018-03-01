__author__ = 'kirry'
import unittest,os
import datetime, time
from Methods.LoginTools import LoginTools
from Methods.MemcacheTools import MemcacheTools
from Methods.WebDriverTools import WebDriverTools
from Methods.OtherTools import OtherTools
from config import app
from time import sleep
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.wait import WebDriverWait


class Case103(unittest.TestCase):
    testCaseID = "Case103"
    projectName = "光明乳业"
    buzName = "数据统计,页面数据正常"
    now = 'None'
    url = "http://%s" % app.config['SERVERIP']

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver,'guangming')
        self.tools = WebDriverTools()

    def tearDown(self):
        if ("Exception" or "AssertionError" in str([x[1] for x in self._outcome.errors if x[1]!=None])) or self.errors:
            WebDriverTools.get_pic(self.driver, self.testCaseID)
        os.remove(os.path.join(app.config['DOWNLOAD_DIR'],self.filename))
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

    def Test(self):
        tools =WebDriverTools()
        self.error = []
        driver = self.driver
        tools.enterPage(driver,['数据统计'],assertResult=None,projName=self.projectName,)
        driver.switch_to.frame(driver.find_element_by_tag_name("iframe"))
        ele = driver.find_element_by_css_selector(".navLeft")
        tools.checkNull(ele,self.error,'数据分析—>左侧列表按钮数据','数据统计')
        driver.find_elements_by_css_selector(".pointList>div")[0].click()
        self.checkTime(driver,self.error)
        OtherTools.raiseError(self.error)


    def checkTime(self,driver,error):
        startTime = driver.find_element_by_css_selector("#iptTimeStart")
        endTime = driver.find_element_by_css_selector("#iptTimeEnd")
        button = driver.find_element_by_css_selector('.btnQueryTool.btn-success')
        exportbutton = driver.find_element_by_css_selector('.btnQueryTool.btn-primary')
        startTime.click()
        try:
            time = datetime.datetime.strftime(datetime.datetime.now()-datetime.timedelta(days=2),'%Y-%m-%d %H:%M')
            driver.find_element_by_css_selector("#iptTimeStart").clear()
            driver.find_element_by_css_selector("#iptTimeStart").send_keys(time)
        except Exception as e:
            print(e.__str__())
            error.append("输入开始时间有误！")
        endTime.click()
        try:
            time = datetime.datetime.strftime(datetime.datetime.now(),'%Y-%m-%d %H:%M')
            driver.find_element_by_css_selector("#iptTimeEnd").clear()
            driver.find_element_by_css_selector("#iptTimeEnd").send_keys(time)
        except Exception as e:
            print(e.__str__())
            error.append("输入结束时间有误！")
        button.click()
        driver.implicitly_wait(3)
        stattext = driver.execute_script('var a;return a=$("#iptTimeStart").val()').split(" ")[0]
        endtext = driver.execute_script('var a;return a=$("#iptTimeEnd").val()').split(" ")[0]
        self.filename = '数据分析-%s--%s.xls'%(stattext,endtext)
        text = driver.find_element_by_css_selector(".divStatisticTable")
        WebDriverTools.checkNull(text,error,'设备信息','数据分析')
        WebDriverWait(driver,5).until_not(lambda x:x.find_element_by_css_selector("#spinner"))
        exportbutton.click()
        datelist = driver.find_elements_by_css_selector('.tableDetail>tbody>tr')
        WebDriverTools.checkloadexcelFile(self.filename,error,datelist)

if __name__ == "__main__":
    suit = unittest.TestSuite()
    suit.addTest(Case103('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suit)