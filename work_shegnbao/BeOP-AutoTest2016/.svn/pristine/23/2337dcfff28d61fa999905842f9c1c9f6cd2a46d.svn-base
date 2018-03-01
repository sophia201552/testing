'''
Created on 8th July,2015

@author: Markdorian
'''

from selenium import webdriver
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.options import Options
from xlrd import open_workbook
import unittest, types, os, random, string, time, requests
from requests import adapters
from Methods.WebDriverTools import WebDriverTools
from config import app, user_conf
from Methods.Log import Log
from Methods.common import Chrome
from Methods.common import DriverMethods
from Methods.common import Action
import sys


url = 'http://%s' % app.config['SERVERIP']
username = app.config['USERNAME']
password = app.config['PASSWORD']
chromePath = app.config['DRIVER_PATH']

class LoginTools:
    logName = app.config['LOGINTOOLS_LOG']
    browserName = app.config['BROWSER'].lower()
    browserConfig = app.config['BROWSER_CONFIG']
    browser = browserConfig.get(browserName)

    @classmethod
    def initial(self, url, testCaseID):
        lg = LoginTools()
        driver = lg.InitialChrome(url, testCaseID)
        driver = lg.login(driver)
        methods = DriverMethods(driver)
        action = Action(driver)
        return methods, action

    def InitialChromeFactory(self, url, case):
        driver = None
        if self.browser:
            print('用例: {}指定浏览器为{}'.format(case, self.browser))
            driverStr = 'webdriver.{}()'.format(self.browser)
        else:
            print('用例: {}未指定浏览器，默认为Chrome'.format(case))
            driverStr = 'webdriver.Chrome()'
        try:
            driver = eval(driverStr)
            base_url = url + "/factory"
            driver.get(base_url)
        except Exception as e:
            Log.writeLogError(self.logName, 'funcname: InitialChromeFactory' + e.__str__())
            if driver:
                try:
                    WebDriverTools.get_pic(driver, case)
                    driver.close()
                except Exception as e:
                    Log.writeLogError(self.logName, 'funcname: InitialChromeFactory' + e.__str__())
        if driver:
            try:
                driver.maximize_window()
                driver.implicitly_wait(8)
            except Exception as e:
                Log.writeLogError(self.logName, 'funcname: InitialChromeFactory' + e.__str__())
                WebDriverTools.get_pic(driver, case)
                time.sleep(5)
            driverwait = WebDriverWait(driver, 35)
            time.sleep(5)
            #等待页面加载完成
            try:
                driverwait.until(lambda dr: dr.find_element_by_css_selector("#login").is_displayed())
                time.sleep(3)
            except Exception as e:
                assert 0,"连接%s后登陆按钮35秒内没有加载出来!" % self.base_url
            return driver
        else:
            assert 0, "用例" + case + "执行失败!"

    def loginFactory(self, driver,user='default'):
        app.config.from_object(user_conf[user])
        driver.find_element_by_id("userName").clear()
        driver.find_element_by_id("userName").send_keys(app.config['USERNAME'])
        driver.find_element_by_id("userPass").clear()
        driver.find_element_by_id("userPass").send_keys(app.config['PASSWORD'])
        driver.find_element_by_id("login").click()
        time.sleep(5)
        return driver

    def InitialChrome2(self, url, case):
        url = 'http://' + app.config['SERVERIP']
        driver = None
        if self.browser:
            print('用例: {}指定浏览器为{}'.format(case, self.browser))
            driverStr = 'webdriver.{}()'.format(self.browser)
        else:
            print('用例: {}未指定浏览器，默认为Chrome'.format(case))
            driverStr = 'webdriver.Chrome()'
        try:
            driver = eval(driverStr)
            self.base_url = url
        except Exception as e:
            Log.writeLogError(self.logName, 'webdriver.Chrome() error:' + e.__str__())
            if driver:
                try:
                    WebDriverTools.get_pic(driver, case)
                    driver.close()
                    driver = None
                except Exception as e:
                    Log.writeLogError(self.logName, 'funcname: InitialChrome' + e.__str__())
        if driver:
            try:
                driver.get(self.base_url)
                driver.implicitly_wait(8)
                driver.maximize_window()
            except Exception as e:
                Log.writeLogError(self.logName, 'funcname: InitialChrome' + e.__str__())
                if driver:
                    WebDriverTools.get_pic(driver, case)
            time.sleep(3)
            return driver
        else:
            assert 0, "用例" + case + "执行失败!"

    def InitialChrome(self, url, case):
        #option = Options()
        #option.binary_location = r'C:\Users\woody\AppData\Local\Google\Chrome\Application'
        url = 'http://' + app.config['SERVERIP']
        driver = None
        if self.browser:
            pass
            print('用例: {}指定浏览器为{}'.format(case, self.browser))
            driverStr = 'WebDriver.{}()'.format(self.browser)
        else:
            print('用例: {}未指定浏览器，默认为Chrome'.format(case))
            driverStr = 'WebDriver()'
        try:
            driver = Chrome()
            #driver = eval(driverStr)
            self.base_url = url
        except Exception as e:
            Log.writeLogError(self.logName, 'webdriver.Chrome() error:' + e.__str__())
            if driver:
                try:
                    WebDriverTools.get_pic(driver, case)
                    driver.close()
                    driver = None
                except Exception as e:
                    Log.writeLogError(self.logName, 'funcname: InitialChrome' + e.__str__())
        if driver:
            try:
                driver.get(self.base_url)
                driver.implicitly_wait(8)
                driver.maximize_window()
            except Exception as e:
                Log.writeLogError(self.logName, 'funcname: InitialChrome' + e.__str__())
                if driver:
                    WebDriverTools.get_pic(driver, case)
            time.sleep(3)
            return driver
        else:
            assert 0, "用例" + case + "执行失败!"

    def InitialFirefox(self, url, case):
        profileDir = r"C:\Users\woody\AppData\Roaming\Mozilla\Firefox\Profiles\e34lhn08.default"
        ff_profile = webdriver.FirefoxProfile(profileDir)
        driver = None
        try:
            driver = webdriver.Firefox(firefox_profile=ff_profile)
            driver.get(url)
            driver.implicitly_wait(8)
        except Exception:
            driver.close()
            driver = None
            time.sleep(5)
        try:
            driver.maximize_window()
        except Exception as e:
            Log.writeLogError(self.logName, "funcname: InitialFirefox" + e.__str__())
        if driver:
            try:
                driver.maximize_window()
            except Exception as e:
                Log.writeLogError(self.logName, "funcname: InitialFirefox" + e.__str__())
                if driver:
                    WebDriverTools.get_pic(driver, case)
                time.sleep(5)
            return driver
        else:
            assert 0, "用例" + case + "执行失败!"


    def loginrem(self, driver):
        app.config.from_object(user_conf['woody'])
        driver.find_element_by_id("txtName").clear()
        driver.find_element_by_id("txtName").send_keys(app.config['USERNAME'])
        driver.find_element_by_id("txtPwd").clear()
        driver.find_element_by_id("txtPwd").send_keys(app.config['PASSWORD'])
        driver.find_element_by_id("cbRememberPwd").click()
        driver.find_element_by_id("btnLogin").click()
        WebDriverTools.waitSpinner(driver, '登陆页面', 'spinner')
        time.sleep(5)
        return driver




    def login_test(self, driver, username, password):
        driver.find_element_by_id("txtName").clear()
        driver.find_element_by_id("txtName").send_keys(username)
        driver.find_element_by_id("txtPwd").clear()
        driver.find_element_by_id("txtPwd").send_keys(password)
        driver.find_element_by_id("btnLogin").click()
        WebDriverTools.waitSpinner(driver, '登陆页面', 'spinner')
        time.sleep(2)
        ele = driver.find_element_by_id("paneUser")
        if ele:
            print("用户%s登陆成功" % ele.text)
        else:
            WebDriverTools.get_pic(driver, 'func_login_test')
            assert 0,"用户%s登陆失败，请检查账号密码是否正确!" % ele.text
        return driver


    def login2(self, browser, user='default'):
        app.config.from_object(user_conf[user])
        driver = DriverMethods(browser)
        USERNAME = app.config['USERNAME']
        PASSWORD = app.config['PASSWORD']
        try:
            driver.clear('#txtName')
            driver.send('#txtName', USERNAME)
            driver.clear('#txtPwd')
            driver.send('#txtPwd', PASSWORD)
            driver.click("#btnLogin")
            '''driver.find_element_by_id("txtName").clear()
            driver.find_element_by_id("txtName").send_keys(USERNAME)
            driver.find_element_by_id("txtPwd").clear()
            driver.find_element_by_id("txtPwd").send_keys(PASSWORD)
            driver.find_element_by_id("btnLogin").click()'''
        except Exception as e:
            Log.writeLogError(self.logName, "funcname: login" + e.__str__())
            WebDriverTools.get_pic(driver, 'func_login')
        #WebDriverTools.waitSpinner(driver.driver, '登陆页面', 'spinner', timeout=23)
        time.sleep(3)
        ele = False
        try:
            ele = driver.display("Beop首页", 'logo')
        except:
            pass
        if ele:
            print("用户%s登陆成功" % app.config['USERNAME'])
        else:
            WebDriverTools.get_pic(driver, 'func_login')
            assert 0,"用户%s 密码%s登陆失败，请检查账号密码是否正确!" % (USERNAME, PASSWORD)
        return driver

    def login(self, browser, user='default'):
        driver = DriverMethods(browser)
        app.config.from_object(user_conf[user])
        USERNAME = app.config['USERNAME']
        PASSWORD = app.config['PASSWORD']
        try:
            driver.clear('登录页面', '用户名输入框')
            driver.send('登录页面', '用户名输入框', USERNAME)
            driver.clear('登录页面', '密码输入框')
            driver.send('登录页面', '密码输入框', PASSWORD)
            driver.click('登录页面', '登录按钮')
            '''driver.find_element_by_id("txtName").clear()
            driver.find_element_by_id("txtName").send_keys(USERNAME)
            driver.find_element_by_id("txtPwd").clear()
            driver.find_element_by_id("txtPwd").send_keys(PASSWORD)
            driver.find_element_by_id("btnLogin").click()'''
        except Exception as e:
            Log.writeLogError(self.logName, "funcname: login" + e.__str__())
            WebDriverTools.get_pic(driver, 'func_login')
        #WebDriverTools.waitSpinner(driver, '登陆页面', 'spinner', timeout=23)
        time.sleep(3)
        ele = False
        try:
            ele = driver.display("Beop首页", 'logo')
        except:
            pass
        if ele:
            print("用户%s登陆成功" % app.config['USERNAME'])
        else:
            WebDriverTools.get_pic(driver, 'func_login')
            assert 0,"用户%s 密码%s登陆失败，请检查账号密码是否正确!" % (USERNAME, PASSWORD)
        return browser


    def loginPatrol(self, driver, url, user='default'):
        app.config.from_object(user_conf[user])
        try:
            driver.find_element_by_id("txtName").clear()
            driver.find_element_by_id("txtName").send_keys(app.config['USERNAME'])
            driver.find_element_by_id("txtPwd").clear()
            driver.find_element_by_id("txtPwd").send_keys(app.config['PASSWORD'])
            driver.find_element_by_id("btnLogin").click()
        except Exception as e:
            Log.writeLogError(self.logName, e.__str__())
            WebDriverTools.get_pic(driver, 'func_loginPatrol')
        WebDriverTools.waitSpinner(driver, '登陆页面', 'spinner')
        time.sleep(2)
        driver.get(url+"/patrol?projectId=72")
        time.sleep(15)
        return driver


    def loginInitial_Chrome(self, case):
        if self.browser:
            print('用例: {}指定浏览器为{}'.format(case, self.browser))
            driverStr = 'webdriver.{}()'.format(self.browser)
        else:
            print('用例: {}未指定浏览器，默认为Chrome'.format(case))
            driverStr = 'webdriver.Chrome()'
        driver = None
        url = 'http://' + app.config['SERVERIP']
        try:
            driver = eval(driverStr)
            driver.get(url)
        except Exception as e:
            Log.writeLogError(self.logName, "funcname: loginInitial_Chrome" + e.__str__())
            if driver:
                WebDriverTools.get_pic(driver, 'func_loginInitial_Chrome')
                driver.close()
                driver = None
        if driver:
            try:
                driver.implicitly_wait(8)
                driver.maximize_window()
            except Exception as e:
                Log.writeLogError(self.logName, case + '---' + e.__str__())
                WebDriverTools.get_pic(driver, 'func_loginInitial_Chrome')

            driverwait = WebDriverWait(driver, 35)
            time.sleep(5)
            try:
                #等待页面加载完成
                driverwait.until(lambda dr: dr.find_element_by_css_selector("#indexMain").is_displayed())
            except Exception:
                WebDriverTools.get_pic(driver, 'func_loginInitial_Chrome')
                assert 0,"打开beop,等待35秒后还没找到登陆窗口!"
            time.sleep(3)
            return driver
        else:
            assert 0, "用例" + case + "执行失败!"

    @classmethod
    def loginInner(self, driver, uname, pw):
        driver.find_element_by_id("txtName").clear()
        driver.find_element_by_id("txtName").send_keys(uname)
        driver.find_element_by_id("txtPwd").clear()
        driver.find_element_by_id("txtPwd").send_keys(pw)
        driver.find_element_by_id("btnLogin").click()
        return driver



    def loginnow(self, driver):
        try:
            driver.find_element_by_id("txtName").clear()
            driver.find_element_by_id("txtName").send_keys(username)
            driver.find_element_by_id("txtPwd").clear()
            driver.find_element_by_id("txtPwd").send_keys(password)
            driver.find_element_by_id("btnLogin").click()
            # Calculate time for login
            WebDriverTools.waitSpinner(driver, 'Beop首页', 'spinner')
            time.sleep(2)
            return driver
        except Exception as e:
            Log.writeLogError(self.logName, e.__str__())
            driver.quit()


