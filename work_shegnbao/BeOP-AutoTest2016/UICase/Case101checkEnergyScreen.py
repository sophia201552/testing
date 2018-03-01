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


class Case101(unittest.TestCase):
    testCaseID = "Case101"
    projectName = "光明乳业"
    buzName = "选中设备,点击温度趋势处的展开,有趋势图出现,更改时间查询,可以看到新的数据,点击导出有文件.点击回到地图可以"
    now = 'None'
    url = "http://%s" % app.config['SERVERIP']

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{"startTime":self.startTime})
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
        static = False
        self.error = []
        driver = self.driver
        driver.switch_to.frame(driver.find_element_by_tag_name("iframe"))
        driver.find_elements_by_css_selector(".pointList>div")[0].click()
        try:
            driver.find_element_by_css_selector("#showFMDetail").click()
            static = True
        except Exception as e:
            print(e.__str__())
            self.error.append("选中设备后，没有出现温度趋势的展开按钮！")
        if static:
            try:
                WebDriverWait(driver,5).until_not(lambda x:x.find_element_by_css_selector('#spinner'))
            except Exception as e:
                print(e.__str__())
                self.error.append("点击展开按钮后进入页面未加载完全,图片未显示出来")
            self.checkTime(driver,self.error)
        OtherTools.raiseError(self.error)
    def checkTime(self,driver,error):
        startTime = driver.find_element_by_css_selector("#iptTimeStart")
        endTime = driver.find_element_by_css_selector("#iptTimeEnd")
        button = driver.find_element_by_css_selector('.btnQueryTool.btn-success.btnQuery')
        exportbutton = driver.find_element_by_css_selector('.btnQueryTool.btn-primary.btnExport')
        startTime.click()
        try:
            driver.find_element_by_css_selector(".table-condensed>tbody>tr>td.day.active").click()
            driver.find_element_by_css_selector(".table-condensed>tbody>tr>td>span.hour.active").click()
            driver.find_element_by_css_selector(".table-condensed>tbody>tr>td>span.minute.active").click()
        except Exception as e:
            print(e.__str__())
            error.append("选中开始时间按钮有误，未选中相应按钮！")
        endTime.click()
        try:
            time = datetime.datetime.strftime(datetime.datetime.now(),'%Y-%m-%d %H:%M')
            driver.find_element_by_css_selector("#iptTimeEnd").clear()
            driver.find_element_by_css_selector("#iptTimeEnd").send_keys(time)
        except Exception as e:
            print(e.__str__())
            error.append("选中结束时间按钮有误，未选中相应按钮！")
        button.click()
        driver.implicitly_wait(3)
        stattext = driver.execute_script('var a;return a=$("#iptTimeStart").val()').split(" ")[0]
        endtext = driver.execute_script('var a;return a=$("#iptTimeEnd").val()').split(" ")[0]
        self.filename = '历史记录-%s--%s.xls'%(stattext,endtext)
        text = driver.find_element_by_css_selector(".tableDetail")
        WebDriverTools.checkNull(text,error,'温度趋势展开数据','设备展开页面')
        exportbutton.click()
        datelist = driver.find_elements_by_css_selector('.tableDetail>tbody>tr')
        WebDriverTools.checkloadexcelFile(self.filename,error,datelist)

if __name__ == "__main__":
    suit = unittest.TestSuite()
    suit.addTest(Case101('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suit)