__author__ = 'woody'
import datetime
import string
import time
import unittest, random
from time import sleep
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from Methods.LoginTools import LoginTools
from Methods.MemcacheTools import MemcacheTools
from Methods.WebDriverTools import WebDriverTools
from config import app
from selenium.webdriver.support.select import Select
from selenium import webdriver



class Case040(unittest.TestCase):
    testCaseID = 'Case040'
    projectName = "不针对项目"
    buzName = '1613687333@qq.com账号找回密码'
    start = 0.0
    now = 'None'
    startTime = ""
    url = "http://%s" % app.config.get('SERVERIP')
    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID, {'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(self.url, self.testCaseID)


    def Test(self):
        a = WebDriverTools()
        driver = self.driver
        time.sleep(4)

        #点击忘记密码，进入密码找回页面进行操作

        driver.find_element_by_css_selector("#btnForgetPwd").click()
        sleep(2)
        driver.find_element_by_css_selector("#inputEmail").clear()
        driver.find_element_by_css_selector("#inputEmail").send_keys("1613687333@qq.com")

        #点击确定发送邮件
        driver.find_element_by_css_selector("#passwordResetBtn").click()
        a.waitSpinner(driver,'Beop登录页--忘记密码--输入邮箱后点击确定按钮')
        #此处获取不到提示信息
        sleep(0.3)
        try:
            if  a.isElementPresent(driver,'.pull-left.message'):
                pass
            else:
                assert 0,"忘记密码--输入邮件--点击确定按钮后没有弹出提示信息!"
        except Exception as e:
            print(e)
            assert 0,"忘记密码--输入邮件--点击确定按钮后没有弹出提示信息!"
        driver.close()

        self.CheckEmail()








    def CheckEmail(self):
        try:
            dr = webdriver.Chrome()
            dr.get("http://mail.qq.com")
        except Exception as e:
            assert 0,"打开mail.qq.com失败！"
        dr.maximize_window()
        #点击切换到账号密码登陆
        time.sleep(5)
        dr.switch_to_frame("login_frame")
        dr.find_element_by_id("switcher_plogin").click()
        time.sleep(5)
        dr.implicitly_wait(8)
        ele = dr.find_elements_by_class_name("inputOuter")
        time.sleep(5)
        dr.find_element_by_css_selector("#uinArea>div>input").send_keys("1613687333@qq.com")
        dr.find_element_by_css_selector("#pwdArea>div>input").send_keys("wuranxu993312")
        dr.find_element_by_id("login_button").click()
        time.sleep(2)
        x = WebDriverTools()
        flag = 0
        while (flag < 5):
            if x.isElementPresent(dr,'#useraddr'):
                sleep(2)
                dr.switch_to_frame("mainFrame")
                break
            else:
                dr.find_element_by_id("login_button").click()
                time.sleep(4)
            flag += 1
        WebDriverWait(dr,10).until(lambda x : x.find_element_by_css_selector("li[class='mailinfo1 t_left2'] >div>a"))
        dr.find_element_by_css_selector("li[class='mailinfo1 t_left2'] >div>a").click()
        WebDriverWait(dr,10).until(lambda x : x.find_elements_by_css_selector(".toarea table"))
        #进入第一封邮件
        dr.find_elements_by_css_selector(".toarea table")[0].click()

        sleep(3)

        url = ''
        eles = dr.find_elements_by_css_selector(".contentEditable a")
        for ele in eles:
            if ele.text is not None and "reset_pwd_email" in ele.text:
                print("find register url!")
                url = ele.text
        time.sleep(10)
        #driver = webdriver.Chrome()
        #time.sleep(15)
        dr.maximize_window()
        try:
            dr.get(url)
        except Exception:
            dr.close()
            assert 0,"没有找到重置密码的邮件!"
        time.sleep(10)

        try:
            WebDriverWait(dr,8).until(lambda x:x.find_element_by_id("inputPassword1"))
        except Exception as e:
            print(e)
            dr.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
            assert 0,"邀请用户注册->用户打开邮件后未进入到注册页面,因为页面中没有找到密码输入框!(等待10秒)"
            dr.close()

        dr.find_element_by_css_selector("#inputPassword1").clear()
        dr.find_element_by_css_selector("#inputPassword1").send_keys("wuranxuA312")
        dr.find_element_by_css_selector("#inputPassword2").clear()
        dr.find_element_by_css_selector("#inputPassword2").send_keys("wuranxuA312")
        dr.execute_script("$('#submitBtn').click()")
        sleep(10)
        #dr.close()
        self.loginBeop(dr)




    def loginBeop(self,driver):
        lg = LoginTools()
        self.driver = lg.login(driver, 'tester2')
        driver2 = self.driver
        b = WebDriverTools()
        if b.isElementPresent(driver2,'#iconList'):
            if driver2.find_element_by_id("iconList"):
                #driver2.get_screenshot_as_file(r'.\ErrorPicture\%s\%s.png' % (self.testCaseID,time.strftime("%Y-%m-%d %H-%M-%S", time.localtime())))
                print("找回密码成功!")
        else:
            assert 0,'点击忘记密码后重新设置密码后登陆失败!'




    def tearDown(self):
        if ("Exception" or "AssertionError" in str([x[1] for x in self._outcome.errors if x[1]!=None])):
            WebDriverTools.get_pic(self.driver, self.testCaseID)
        self.driver.quit()
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})


if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case040('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)