__author__ = 'wuranxu'
from Methods.WebDriverTools import WebDriverTools
from Methods.MemcacheTools import MemcacheTools
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.action_chains import ActionChains
import datetime, time
from Methods.LoginTools import LoginTools
from config import app
from selenium.webdriver.common.keys import Keys
import unittest



#该case用来测试数据源相关操作

class Case012(unittest.TestCase):
    url = "http://%s" % app.config['SERVERIP']
    testCaseID = 'Case012'
    projectName = "上海华为项目"
    buzName = '测试数据分析->数据源相关操作'
    start = 0.0
    now = 'None'
    startTime = ""
    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver)
    def Test(self):
        a = WebDriverTools()
        driver = self.driver
        #driver.implicitly_wait(8)
        time.sleep(4)
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
        #获取未添加数据组时数据组数量
        groupNum = driver.find_elements_by_css_selector("#treeMine li")
        if groupNum != []:
            print("数据分析界面右侧数据组的数量为%d" % len(groupNum))
        else:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,"数据分析界面右侧数据组的数量为0,请检查unassigned组是否消失!"
        time.sleep(2)
        #在添加组的输入框中输入'AutoTest'
        try:
            driver.find_element_by_id("inputAddGroup").clear()
            driver.find_element_by_id("inputAddGroup").send_keys("AutoTest")
        except Exception:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,'找不到数据分析界面右侧的添加数据组输入框!'
        #模拟键盘操作回车键达到修改数据组的目的
        driver.find_element_by_id("inputAddGroup").send_keys(Keys.ENTER)
        time.sleep(8)
        #添加之后获取数据组数量
        groupNum2 = driver.find_elements_by_css_selector("#treeMine li")
        if len(groupNum) + 1 == len(groupNum2):
            print("数据分析->添加数据组成功!")
        else:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,"数据分析->添加数据组失败!(等待时间8秒)"
        '''#点击新添加的组并修改其名字
        newGroupEle = driver.find_element_by_css_selector("#treeMine li:nth-last-child(2)")
        ActionChains(driver).move_to_element(newGroupEle).perform()
        newGroupEle.find_element_by_css_selector(".button.edit").click()
        time.sleep(1)
        driver.find_element_by_css_selector("#treeMine li:nth-last-child(2) a span:nth-child(2)").clear()
        driver.find_element_by_css_selector("#treeMine li:nth-last-child(2) a span:nth-child(2)").send_keys("test")
        time.sleep(1)
        driver.find_element_by_css_selector("#treeMine li:nth-last-child(2)").send_keys(Keys.ENTER)
        time.sleep(3)'''
        '''driver.find_element_by_css_selector("#dataSrcPanel ul:nth-last-child(2)").click()
        time.sleep(1)
        driver.find_element_by_css_selector("#dataSrcPanel ul:nth-last-child(2) span.glyphicon.glyphicon-pencil.panel-heading-btn.grow.dsEditGroupName").click()
        time.sleep(1)
        driver.find_element_by_css_selector("#dataSrcPanel ul:nth-last-child(2) .dsTreeHeader .inputEditGroup").clear()
        driver.find_element_by_css_selector("#dataSrcPanel ul:nth-last-child(2) .dsTreeHeader .inputEditGroup").send_keys("test")
        driver.find_element_by_css_selector("#dataSrcPanel ul:nth-last-child(2) .btn.btn-default.btn-sm").click()
        time.sleep(3)
        #判断数据组名是否修改成功
        new_name = driver.find_element_by_css_selector("#treeMine li:nth-last-child(2) a span:nth-child(2)").text
        if new_name == 'test':
            print("数据组名修改成功!")
        else:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,"数据分析->修改新添加的数据组名失败!(等待时间3秒)"
        '''
        #添加数据元素
        dataGroup = driver.find_element_by_css_selector("#treeMine li:nth-last-child(1)")
        getId = dataGroup.get_attribute("id")
        print(getId)
        ActionChains(driver).move_to_element(dataGroup).perform()
        dataGroup.find_element_by_css_selector("#addBtnPage_"+getId).click()
        #a.find_spinner(driver,time.time(),'点击添加数据源按钮后进入项目数据点界面','23')
        time.sleep(5)
        ele = driver.find_element_by_id('dataSrcPrjName')
        Num = ele.get_attribute('value')
        if Num == '72':
            print("上海华为->数据分析->添加数据源后成功进入上海华为数据点页面!")
        else:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,'上海华为->数据分析->添加数据源后进入上海华为数据点页面失败!'
        #在数据点搜索框搜索outdoor
        driver.find_element_by_id("dataSrcPtSearch").clear()
        driver.find_element_by_id("dataSrcPtSearch").send_keys("outdoor")
        driver.find_element_by_id("btnSearch").click()
        time.sleep(5)
        points = driver.find_elements_by_css_selector(".indexContent tbody tr")
        if points == []:
            assert 0,self.testCaseID + " 添加数据点到数据组--搜索outdoor没有找到点！"
        else:
            pass
        time.sleep(5)
        for point in points:
            point.click()
        time.sleep(3)
        driver.find_element_by_id("btnAddDataSrc").click()
        time.sleep(6)
        eles = driver.find_elements_by_css_selector("#treeMine li:nth-last-child(1) ul li")
        if len(eles) == len(points):
            print("上海华为outdoor相关数据点全部加入到了新增数据组!")
        else:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,"在添加上海华为outdoor有关数据点时,未能全部添加到数据组中!"
        #删除数据组
        driver.find_element_by_css_selector("#treeMine li:nth-last-child(1)>span").click()
        time.sleep(3)
        n = driver.find_element_by_css_selector('#treeMine li:nth-last-child(1)')
        ActionChains(driver).move_to_element(n).perform()
        dataGroup.find_element_by_css_selector(".button.remove").click()
        time.sleep(1)
        sure = [x for x in driver.find_elements_by_css_selector(".btn.btn-info.alert-button") if x.text == '确认']
        sure[0].click()
        #river.find_elements_by_css_selector(".btn.btn-info.alert-button")[0].click()
        time.sleep(3)
        #ActionChains(driver).double_click(dataGroup).perform()
        groupNum3 = driver.find_elements_by_css_selector("#treeMine li")
        if len(groupNum) == len(groupNum3):
            print("上海华为->数据分析->删除新增数据组成功!")
        else:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,'上海华为->数据分析->删除新增数据组失败!(耗时5秒)'

    def tearDown(self):
        self.driver.quit()
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})



if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case012('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)