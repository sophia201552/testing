__author__ = 'wuranxu'
"""
    思路:
    1.将3个项目的冰蓄冷定位元素存放到一个dict中；
    2.进入冰蓄冷页面后，等待30秒(港服45秒)，如果还有spinner在加载的话，找到其标题并抛出异常；
    3.如果spinner都加载完毕了再通过canvas个数来判断是否有冒气泡的情况(个数为2的时候是冒气泡，为1是无内容，为0是全文字)；
    4.如果spinner在加载再判断当前时间是否是0点到1点之间，如果不是的话，抛出异常；
    5.再添加接口测试，测试数据是否有变化；

"""

from time import sleep
from pprint import pprint
from Methods.WebDriverTools import WebDriverTools
from Methods.MemcacheTools import MemcacheTools
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import ElementNotVisibleException
from selenium.webdriver.common.action_chains import ActionChains
import datetime, time, string, unittest
from config import app
from Methods.LoginTools import LoginTools



projects = {72:{'name':'上海华为','location':[['设备','运行概况','冰蓄冷概览'],None]},
              71:{'name':'英文版演示项目06','location':[['Operation','Ice storage system overview'], None]},
              76:{'name':'演示06-某研发中心','location':[['运行概况','冰蓄冷概览'],None]},
         }

class Case026(unittest.TestCase):
    url = 'http://' + app.config['SERVERIP']
    testCaseID = 'Case026'
    projectName = '国服上海华为、演示06、英文演示06项目'
    buzName = '测试冰蓄冷页面dashboard内容是否缺失'
    start = 0.0
    now = 'None'
    startTime = ""
    errors = []
    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver)


    def Test(self):
        self.errors = []
        driver = self.driver
        a = WebDriverTools()
        driver = self.driver
        time.sleep(5)
        for key in projects.keys():
            self.EnterItem(driver,key)
            self.EnterIce(driver, projects[key]['name'], projects[key]['location'][0], projects[key]['location'][1])
            self.Check(driver,projects[key]['name'])
            time.sleep(5)




    def EnterItem(self,driver,project):
        sleep(2)
        a = WebDriverTools()
        a.enterProject(driver,project,projects[project]['name'],self.errors)




    def EnterIce(self, driver, projName, pageName, expect):
        #a = WebDriverTools()
        WebDriverTools.enterPage(driver,pageName,projName=projName)
        #driver.find_element_by_css_selector(ele1).click()
        #sleep(2)
        #driver.find_element_by_css_selector(ele2).click()



    def Check(self,driver,project):
        self.spinner(driver,project)
        self.bubble(driver,project)





    def spinner(self,driver,project):
        sleep(30)
        text = 0
        spinners = driver.find_elements_by_css_selector('.spinner')
        if spinners == []:
            print("所有项目加载完毕!")
        else:
            for s in spinners:
                #content = s.find_element_by_xpath('../../div[1]/h3').text
                #text = text + content + " "
                text = len(spinners)
                sleep(1.5)
        now = time.strftime('%Y-%m-%d %H%M%S',time.localtime())
        now = float(now.split(' ')[1])
        if text > 0:
            if now > float(0) and now < float(10000):
                print("此时正在补数据!")
            else:
                driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
                assert 0,self.testCaseID + project + '--冰蓄冷运行--' + str(text) + "个dashboard一直在加载spinner!"
        else:
            pass


    def bubble(self,driver,project):
        condition = []
        m = 0
        t = 0
        dashboards = driver.find_elements_by_css_selector(".panel-body.springContent")
        for d in dashboards:
            canvas = d.find_elements_by_tag_name('canvas')
            if len(canvas) > 2:
                pprint(d.text)
            elif len(canvas) == 0:

                #这个时候确定是文字类dashboard
                #首先判断当前dashboard，其次判断是否切换
                actitles = d.find_elements_by_css_selector("div[class~='acTittle']")
                for actitle in actitles:
                    ActionChains(driver).move_to_element(actitle).perform()
                    sleep(2)
                    try:
                        now_content = d.text
                    except Exception:
                        driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
                        assert 0,project + 'dashboard文本获取失败!'
                    if now_content != '':
                        if '--'in now_content or 'NaN' in now_content:
                            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
                            assert 0,project + 'dashboard文本获取数据失败，显示为NaN或者--!'
                    #切换到之后的面板
            elif len(canvas) == 1:
                t += 1
                sleep(1)
            else:
                #content = d.find_element_by_xpath('../div[1]/h3').text
                m += 1
                sleep(1.5)
        if m != 0:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,self.testCaseID + '--' + project + '--冰蓄冷运行--' + str(m) + "个dashboard数据一直在冒泡!" + str(t) + "个dashboard内容为空!"

        else:
            print("冰蓄冷数据正常!")


    def tearDown(self):
        self.driver.quit()
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})


if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case026('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)