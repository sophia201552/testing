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

#该case测试用户信息界面

class Case013(unittest.TestCase):
    testCaseID = 'Case013'
    projectName = "不针对项目"
    buzName = '测试登录后用户信息界面相关操作'
    start = 0.0
    now = 'None'
    startTime = ""
    url = "http://%s" % app.config['SERVERIP']
    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)
        self.driver = lg.login(self.driver, 'tester4')

    def random_str(self, randomlength=8):
        a = list(string.ascii_letters)
        random.shuffle(a)
        return ''.join(a[:randomlength])
    def Test(self):
        a = WebDriverTools()
        driver = self.driver
        TestName = self.random_str(4)
        #driver.implicitly_wait(8)
        time.sleep(10)
        #进入用户信息界面
        c = a.isElementPresent(driver,'#iconList')
        try:
            if c:
                driver.find_element_by_id("iconList").click()
        except Exception as e:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,"登陆Beop后用户菜单按钮消失！"
        time.sleep(2)
        driver.find_element_by_id("paneUser").click()
        time.sleep(2)
        user = driver.find_element_by_id("useName").text
        print("当前登录用户名为%s" % user)
        #修改当前登录用户名
        #driver.find_element_by_id("editName").click()
        time.sleep(0.2)
        driver.find_element_by_id("editInput").clear()
        driver.find_element_by_id("editInput").send_keys(TestName)
        sex = driver.find_elements_by_css_selector("input[name='userSex']")
        #选择性别
        sex[0].click()
        driver.find_element_by_id("confrimEditName").click()
        #a.find_spinner(driver,time.time(),'进入用户菜单->修改用户名','23')
        #判断是否进行过修改
        time.sleep(2)
        user_now = driver.find_element_by_id("useName").text
        print(TestName)
        if user_now == TestName:
            print("用户信息->修改用户名成功!")
        else:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,'用户信息->修改用户名失败!'
        #将用户名还原
        time.sleep(1.8)
        #driver.find_element_by_id("editName").click()
        driver.find_element_by_id("editInput").clear()
        driver.find_element_by_id("editInput").send_keys("AutoTester")
        driver.find_element_by_id("confrimEditName").click()
        time.sleep(2)
        #查询用户今天的登录记录
        t = time.strftime("%Y-%m-%d %H-%M-%S" , time.localtime())
        today = t.split(' ')[0]
        driver.find_element_by_css_selector("a[data-shown='operationRecords']").click()
        time.sleep(1)
        driver.find_element_by_id("txtLogDateStart").send_keys(today)
        driver.find_element_by_id("txtLogDateEnd").send_keys(today)
        time.sleep(2)
        driver.find_element_by_id("searchRecord").click()
        time.sleep(4)
        record=WebDriverWait(driver, 15).until(lambda x: x.find_elements_by_css_selector("#allRecordTable tr"))
        # record = driver.find_elements_by_css_selector("#allRecord tr")
        if len(record):
            print("用户登陆信息为%d条!" % len(record))
        else:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s' % (self.testCaseID,time.strftime("%Y-%m-%d %H:%M:%S.png", time.localtime())))
            assert 0,"用户信息->查询今日登录信息无结果,请检查!"
        time.sleep(2)
        #修改用户密码
        driver.find_element_by_css_selector("a[data-shown='loginPwd']").click()
        time.sleep(1)
        driver.find_element_by_id("editOldPwd").clear()
        driver.find_element_by_id("editOldPwd").send_keys("RNBbeop2013")
        driver.find_element_by_id("editNewPwd").clear()
        driver.find_element_by_id("editNewPwd").send_keys("wuranxu312")
        driver.find_element_by_id("editCheckNewPwd").clear()
        driver.find_element_by_id("editCheckNewPwd").send_keys("wuranxu312")
        driver.find_element_by_id("submitResetPwd").click()
        time.sleep(0.3)
        if a.isElementPresent(driver,'.alert-msg'):
            print(driver.find_element_by_css_selector('.alert-msg').text)
        else:
            assert 0,"用户619434176@qq.com修改密码后未弹出修改成功提示!请检查密码是否修改失败!"


        driver.find_element_by_css_selector('#iconList.dropdown').click()
        time.sleep(4)
        driver.find_element_by_id("btnLogout").click()
        WebDriverTools.waitElement(driver, '#txtName', self.testCaseID)
        try:
            driver.find_element_by_id("txtName").clear()
            driver.find_element_by_id("txtName").send_keys("wuranxu@126.com")
            driver.find_element_by_id("txtPwd").clear()
            driver.find_element_by_id("txtPwd").send_keys("wuranxu312")
            driver.find_element_by_id("btnLogin").click()
            a.waitSpinner(driver,'修改密码之后登陆','spinner')
            time.sleep(1)
            print("修改成功")
        except Exception:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s' % (self.testCaseID,time.strftime("%Y-%m-%d %H.%M.%S", time.localtime())))
            assert 0,"登陆失败,修改密码失败!"
        WebDriverWait(driver,8).until(lambda x:x.find_element_by_id("iconList"))
        time.sleep(20)
        t = a.isElementPresent(driver,'#iconList')
        try:
            if t:
                driver.find_element_by_id("iconList").click()
        except Exception:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,"修改密码--注销之后再次登陆失败！"
        time.sleep(0.8)
        driver.find_element_by_id("paneUser").click()
        time.sleep(1.5)
        driver.find_element_by_css_selector("a[data-shown='loginPwd']").click()
        time.sleep(2)
        try:
            driver.find_element_by_id("editOldPwd").clear()
            driver.find_element_by_id("editOldPwd").send_keys("wuranxu312")
            driver.find_element_by_id("editNewPwd").clear()
            driver.find_element_by_id("editNewPwd").send_keys("RNBbeop2013")
            driver.find_element_by_id("editCheckNewPwd").clear()
            driver.find_element_by_id("editCheckNewPwd").send_keys("RNBbeop2013")
            driver.find_element_by_id("submitResetPwd").click()
        except Exception:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,"修改密码--注销之后再次修改密码--失败！"
        time.sleep(4)






    def tearDown(self):
        self.driver.quit()
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case013('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)