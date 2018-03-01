__author__ = 'sophia'
from Methods.LoginTools import LoginTools
from Methods.OtherTools import OtherTools
from Methods.MemcacheTools import MemcacheTools
import unittest
import datetime, time
from Methods.WebDriverTools import WebDriverTools
from config import app
from time import sleep
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
class Case068(unittest.TestCase):
    testCaseID = 'Case068'
    projectName = "DemoEn09"
    buzName = '检查首页页面是否正常'
    now = 'None'
    url = "http://%s" % app.config['SERVERIP']
    project = (175,'DemoEn09')
    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID, {'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver)
        self.tools = WebDriverTools()

    def Test(self):
        driver = self.driver
        self.errors = []
        self.tools.enterProject(driver, self.project[0], self.project[1], self.errors)
        sleep(3)
        self.checkOverview(driver)
        OtherTools.raiseError(self.errors)

    #检查首页
    def checkOverview(self,driver):
        page=['Overview']
        jump_pages=['KPI Report','','Cost report','Operation Report']
        mores=['.kpiShape','','.energyShape','.runShape']
        #检查slider
        lis=driver.find_elements_by_css_selector('ol.carousel-indicators > li')
        for index,li in enumerate(lis):
            lis[index].click()
            sleep(3)
            if(index!=1):
                if(index==3):
                    container=driver.find_elements_by_css_selector('.reportText')[index-1]
                elif index==2:
                    container=driver.find_element_by_css_selector('.item.active>.carousel-caption>.energyAnas>.reportText')
                else:
                    container=driver.find_elements_by_css_selector('.reportText')[index]
                self.tools.checkNull(container,self.errors,page,'第%d个slider处' % (index+1))
            if(index==0):
                self.tools.checkCanvas(driver,self.errors,page)
            if(index==1):
                self.tools.checkCanvas(driver,self.errors,page)
                container=driver.find_element_by_css_selector('.item.active > .carousel-caption')
                self.tools.checkNull(container,self.errors,page,'第%d个slider处'%(index+1))
            if(index!=1):
                button="$(\'%s\').click()"%(mores[index])
                driver.execute_script(button)
                leftCtn=WebDriverWait(driver, 10).until(lambda x: x.find_element_by_css_selector('#reportNavList'))
                text=driver.find_element_by_css_selector('.list-group-item.ellipsis.active').text
                if(text ==jump_pages[index]):
                    print('点击button可以跳转到正确报表')
                    sleep(2)
                    driver.back()
                    sleep(2)
                    lis=driver.find_elements_by_css_selector('ol.carousel-indicators > li')
                else:
                    self.errors.append('点击home页面slider里面的button按钮没有跳转到报表页面')
        #检查页面右侧KPI
        lis=driver.find_elements_by_css_selector('.kpi-detail-item-box')
        self.tools.checkHoverData(driver,self.errors,lis,page,'KPI显示鼠标放上去')

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case068('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)