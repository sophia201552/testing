'''
Created on 8th July,2015

@author: Markdorian
'''
from setting import info
import sqlite3
from selenium import webdriver
from setting import info
import sqlite3
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from Methods.JsonMethods import *
from xlrd import open_workbook
import unittest, types, os, random, string, time, requests
from Methods.DriverWaitTime import DriverWaitTime
from Methods.BeopTools import *
from requests import adapters
from setting import *
tag = 'Beop Login Page Chinese tag'
urltest = 'http://192.168.1.208/'
urlonline = 'http://beop.rnbtech.com.hk'
urldemo = 'http://beopdemo.rnbtech.com.hk/'
username = 'kingsley.he@rnbtech.com.hk'
password = 'hezhengjun'
# FileName:BaseModel.py
class BaseLogin():
    vi = ['视图:图标平铺', '视图:图标导航模式靠右']

    def __init__(self):
        pass

    @classmethod
    def random_str(self, randomlength=8):
        a = list(string.ascii_letters)
        random.shuffle(a)
        return ''.join(a[:randomlength])

    @classmethod
    def mkdir(self, path):
        path = path.strip()
        path = path.rstrip("\\")
        isExists = os.path.exists(path)
        if not isExists:
            print('Directory creation succeeds')
            os.makedirs(path)
            return True
        else:
            print('Directory exists already!')
            return False

    @classmethod
    def map_view(self, ls):
        ds = {}
        for l in range(len(ls)):
            ds[ls[l]] = self.vi[l]
        return ds

    @classmethod
    def icon_how_present(self, driver, projectName, locs=[]):
        ds = self.map_view(locs)
        for k in sorted(ds.keys()):
            try:
                gl = driver.find_element_by_css_selector(k)
                a = True
            except:
                a = False
            if a == True:
                return (gl, ds.get(gl))
            else:
                continue
        return None

    @classmethod
    def icon_view_login(self, driver, projectName, icon_locator=[]):
        getele = self.icon_how_present(driver, projectName, icon_locator)
        try:
            getele[0].click()
            icon_time = DriverWaitTime()
            icon_time.calculateTime(driver, 'spinnerMask', projectName)
        except Exception:
            assert 0, projectName + ':' + getele[1] + '-点击图标后登陆失败'

    @classmethod
    def accounts_list(self, excelpath):
        data = open_workbook(excelpath)
        # shxrange = range(data.nsheets)
        sheetnames = data._sheet_names
        sname = sheetnames[0]
        accounts = {}
        if sname in sheetnames:
            sheet = data.sheet_by_name(sname)
            row_n = sheet.nrows
            # col_n=sheet.ncols
            result = {}
            for i in range(1, row_n):
                row = sheet.row_values(i)
                temp = {}
                temp[row[1]] = row[2]
                accounts[row[0]] = temp
        return accounts

    @classmethod
    def get_xid(self, imbeded_id, url, paramdic={}):
        xid = ''
        t = JsonMethods().http_post(url, paramdic, 20)
        for k in t.keys():
            if k == imbeded_id:
                xid = t.get(k)
                break
        return xid

    def InitialChrome(self, url,case):
        while 1:
            self.driver = webdriver.Chrome()
            try:
                self.base_url = url
                driver = self.driver
                driver.get(self.base_url)
                break
            except Exception:
                self.driver.refresh()
                t = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
                event = "连接服务器出错，尝试刷新重新连接！"
                logg = '\n' + case + " %s %s\n" % (t,event)
                log.append(logg)
                time.sleep(20)
                continue
        driver.implicitly_wait(8)
        self.driver.maximize_window()
        driver.set_page_load_timeout(20)
        driverwait = WebDriverWait(driver, 35)
        time.sleep(5)
        #等待页面加载完成
        driverwait.until(lambda dr: dr.find_element_by_css_selector("#indexMain").is_displayed())
        time.sleep(3)
        return driver


    def loginrem(self):
        driver = self.driver
        driver.find_element_by_id("txtName").clear()
        driver.find_element_by_id("txtName").send_keys("woody.wu@rnbtech.com.hk")
        driver.find_element_by_id("txtPwd").clear()
        driver.find_element_by_id("txtPwd").send_keys("wuranxu")
        driver.find_element_by_id("cbRememberPwd").click()
        driver.find_element_by_id("btnLogin").click()
        a = BeopTools()
        cur_time = time.time()
        a.find_spinner(driver, cur_time, project='登陆页面', timeout='23', name='spinner')
        time.sleep(5)
        return driver


    def loginwuranxu(self):
        driver = self.driver
        driver.find_element_by_id("txtName").clear()
        driver.find_element_by_id("txtName").send_keys("woody.wu@rnbtech.com.hk")
        driver.find_element_by_id("txtPwd").clear()
        driver.find_element_by_id("txtPwd").send_keys("wuranxu")
        driver.find_element_by_id("btnLogin").click()
        a = BeopTools()
        cur_time = time.time()
        a.find_spinner(driver, cur_time, project='登陆页面', timeout='23', name='spinner')
        time.sleep(1)
        return driver
    def logintester(self):
        driver = self.driver
        driver.find_element_by_id("txtName").clear()
        driver.find_element_by_id("txtName").send_keys("619434176@qq.com")
        driver.find_element_by_id("txtPwd").clear()
        driver.find_element_by_id("txtPwd").send_keys("wuranxu")
        driver.find_element_by_id("btnLogin").click()
        a = BeopTools()
        cur_time = time.time()
        a.find_spinner(driver, cur_time, project='登陆页面', timeout='23', name='spinner')
        time.sleep(1)
        return driver



    def login_test(self,username,password):
        driver = self.driver
        driver.find_element_by_id("txtName").clear()
        driver.find_element_by_id("txtName").send_keys(username)
        driver.find_element_by_id("txtPwd").clear()
        driver.find_element_by_id("txtPwd").send_keys(password)
        driver.find_element_by_id("btnLogin").click()
        a = BeopTools()
        cur_time = time.time()
        a.find_spinner(driver, cur_time, project='登陆页面', timeout='23', name='spinner')
        time.sleep(2)
        ele = driver.find_element_by_id("paneUser")
        if ele:
            print("用户%s登陆成功" % ele.text)
        else:
            driver.get_screenshot_as_file(r'.\ErrorPicture\%s.png' % time.strftime("%Y-%m-%d %H-%M-%S", time.localtime()))
            assert 0,"用户%s登陆失败，请检查账号密码是否正确!" % ele.text
        return driver


    def login(self):

        driver = self.driver
        driver.find_element_by_id("txtName").clear()
        driver.find_element_by_id("txtName").send_keys(username)
        driver.find_element_by_id("txtPwd").clear()
        driver.find_element_by_id("txtPwd").send_keys(password)
        driver.find_element_by_id("btnLogin").click()
        a = BeopTools()
        cur_time = time.time()
        a.find_spinner(driver, cur_time, project='登陆页面', timeout='23',name='spinner')
        time.sleep(10)
        return driver


    def loginAdmin(self):
        driver = self.driver
        driver.find_element_by_id("txtName").clear()
        driver.find_element_by_id("txtName").send_keys("admin")
        driver.find_element_by_id("txtPwd").clear()
        driver.find_element_by_id("txtPwd").send_keys("Golding")
        driver.find_element_by_id("btnLogin").click()
        a = BeopTools()
        cur_time = time.time()
        a.find_spinner(driver, cur_time, project='登陆页面', timeout='23',name='spinner')
        time.sleep(1)
        return driver

    def loginInitial_Chrome(self,case):
        self.driver = webdriver.Chrome()
        while 1:
            try:
                self.base_url = urlonline
                self.driver.get(self.base_url)
                break
            except Exception:
                self.driver.refresh()
                t = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
                event = "连接服务器出错，尝试刷新重新连接！"
                logg = '\n' + case + " %s %s\n" % (t,event)
                log.append(logg)
                time.sleep(20)
                continue
        time.sleep(2)
        self.driver.maximize_window()
        self.driver.implicitly_wait(8)
        driver = self.driver
        driver.set_page_load_timeout(20)

        driverwait = WebDriverWait(driver, 35)
        time.sleep(5)
        #等待页面加载完成
        driverwait.until(lambda dr: dr.find_element_by_css_selector("#indexMain").is_displayed())
        time.sleep(3)



        '''# Wait for Language semaphore caret element is presented
        driverwait.until(lambda dr: dr.find_element(
            By.CSS_SELECTOR, '#divLanguage>a').is_displayed())
        time.sleep(3)
        driver.find_element(
            By.CSS_SELECTOR, '#divLanguage>a>span').click()
        # Select Chinese Language
        driver.find_element(
            By.CSS_SELECTOR, '#selectLanguage > li:nth-child(1) > a').click()
        time.sleep(3)'''


    def logintags(self):
        driver = self.driver
        hometags = {"aHome": "首页", "aHomeCases": "客户案列", "aHomeMobile":
            "移动版", "aHomeCompany": "R&B Tech", "aProductDownload": "下载支持"}

        for k in sorted(hometags.keys()):
            tag = driver.find_element_by_css_selector(
                '#ulLogin.nav.nav-pills.navbar-right li[id="' + k + '"] a')
            if tag.text is None:
                picname = self.random_str(8)
                self.mkdir('C:\\Snapshots')
                driver.get_screenshot_as_file(
                    'C:\\Snapshots\\' + picname + '.png')
                assert 0, 'Case101' + tag + '-' + \
                          hometags.get(k) + ' lost'
            else:
                print('-%s' % tag.text)

        titleoriginal = '能源引导者'
        titlenow = driver.find_element_by_css_selector(
            'div[id="navHomeLogo"] h5').text
        if titlenow is None or titlenow is "":
            picname = self.random_str(8)
            driver.get_screenshot_as_file('C:\\Snapshots\\' + picname + '.png')
            assert 0, tag + '-' + titleoriginal + ' lost '
        else:
            print('title:%s' % titlenow)
        hovermixed = {"login-optimization": "优化控制", "login-diagnostic": "运行诊断",
                      "login-transaction": "事件监控", "login-team": "团队管理", "login-mulitPlatform": "多平台管理"}
        icontexts = driver.find_elements_by_css_selector(
            'div[id="rowLogin"] .login-feature-title')
        if len(icontexts) > 0:
            for h in sorted(hovermixed.keys()):
                icon = driver.find_element_by_css_selector(
                    'div[id="rowLogin"] .' + h + ' .login-feature-title')
                if icon.text is None:
                    picname = self.random_str(8)
                    driver.get_screenshot_as_file(
                        'C:\\Snapshots\\' + picname + '.png')
                    assert 0, 'Icon text description-' + \
                              hovermixed.get(h) + '加载失败(图标或字体丢失)'
                else:
                    print('-%s' % icon.text)

    @classmethod
    def login_defaultpage_load(self, driver, case_num, itemproject, iddicids):
        if len(iddicids.keys()) > 0:
            for x in sorted(iddicids.keys()):
                driver.find_element_by_css_selector('#ulPages .caret').click()
                time.sleep(3)
                try:
                    option = driver.find_element_by_css_selector("#" + x)
                    a = True
                except:
                    a = False
                if a == True:
                    option.click()
                    ins = DriverWaitTime()
                    ins.calculateTime(
                        driver, 'spinnerMask', itemproject + ">" + iddicids.get(x))
                    break
                else:
                    continue
                    '''BaseLogin.mkdir("C:\\Snapshots")
                    picname = BaseLogin.random_str(3)
                    driver.get_screenshot_as_file(
                        'C:\\Snapshots\\' + iddicids.get(x) + picname + '.png')
                    assert 0, case_num + itemproject + 'System Surveillance--' + \
                              print(iddicids.get(x)) + \
                              "--item doesn't exist any more"'''

    # Login Item via clicking on Icon
    @classmethod
    def login_item(self, driver, case_numer, itemname, iconlocator):
        BaseLogin.tag_load_via_click(driver, case_numer, itemname, None, iconlocator)

    # Data Analysis tag-loading
    @classmethod
    def tag_load_via_click(self, driver, case_number, itemname, tagname, taglocator):
        try:
            driver.find_element_by_css_selector(taglocator).click()
            dn = DriverWaitTime()
            if tagname is None:
                dn.calculateTime(driver, 'spinnerMask', itemname + ":")
            else:
                dn.calculateTime(driver, 'spinnerMask', itemname + ">" + tagname)
        except Exception:
            picname = BaseLogin.random_str(3)
            driver.get_screenshot_as_file(
                'C:\\Snapshots\\' + tagname + picname + '.png')
            assert 0, case_number + itemname + \
                      tagname + \
                      'loading fails on' + itemname

    @classmethod
    def get_texts_or_icons(self, case_numer, driver, itemname, tagname, locator_without_key, textdicts):
        for k in sorted(textdicts.keys()):
            if '""' in locator_without_key:
                splittexts = locator_without_key.split('""')
                locator = splittexts[0] + '"' + k + '"' + splittexts[1]
                icontext = driver.find_element_by_css_selector(locator)
            if '""' not in locator_without_key:
                icontext = driver.find_element_by_css_selector(locator_without_key + k)

            if icontext is not None:
                if isinstance(icontext.text, str):
                    if icontext.text is None:
                        picname = BaseLogin.random_str(3)
                        driver.get_screenshot_as_file(
                            'C:\\Snapshots\\' + 'Data-Analysis-' + '-' + textdicts.get(k) + picname + '.png')
                        assert 0, case_numer + itemname + tagname + '-text: ' + \
                                  textdicts.get(k) + ' lost'
                    else:
                        print(icontext.text)

            else:
                assert 0, case_numer + itemname + tagname + '-text: ' + \
                          textdicts.get(k) + ' lost'

    def loginInner(self, uname, pw):
        driver = self.driver
        driver.find_element_by_id("txtName").clear()
        driver.find_element_by_id("txtName").send_keys(uname)
        driver.find_element_by_id("txtPwd").clear()
        driver.find_element_by_id("txtPwd").send_keys(pw)
        driver.find_element_by_id("btnLogin").click()
        return driver

    def account_audit(self, user_name, pw):
        driver = self.loginInner(user_name, pw)
        # Calculate time for login
        a = DriverWaitTime()
        a.calculateTime(self.driver, 'spinner', 'For Login')
        return driver

    def account_audit2(self, user_name, pw):
        driver = self.loginInner(user_name, pw)
        startTime = time.time()
        try:
            icons = driver.find_elements_by_css_selector('div[id="projectsCard"] .media-body.info')
            i = True
        except:
            i = False
        if i == False:
            try:
                icons = driver.find_elements_by_css_selector('div[id="paneSelector"] .media-body.info')
            except Exception:
                assert 0, username + '登录后看不到项目图标'
        if len(icons) > 0:
            endTime = time.time()
            pass
        else:
            assert 0, username + '登录失败'
        return (driver, endTime - startTime)

    def loginnow(self):
        try:
            driver = self.driver
            driver.find_element_by_id("txtName").clear()
            driver.find_element_by_id("txtName").send_keys(username)
            driver.find_element_by_id("txtPwd").clear()
            driver.find_element_by_id("txtPwd").send_keys(password)
            driver.find_element_by_id("btnLogin").click()
            # Calculate time for login
            a = BeopTools()
            a.find_spinner(driver, time.time(), '登陆Beop', '23', 'spinner')
            time.sleep(5)
            return driver
        except Exception:
            self.driver.quit()
        '''try:
            project_icons = driver.find_elements_by_css_selector('div[id="projectsCard"] .media-object')
            if len(project_icons) > 0:
                pass
            else:
                assert 0, '登录后该用户-' + username + '-看不到项目，可能是未进入地图导航模式！'
        except Exception:
            assert 0, '登录后该用户-' + username + '-看不到项目，可能是未进入地图导航模式！'
        '''
        

