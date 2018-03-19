from selenium import webdriver
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from xlrd import open_workbook
import unittest, types, os, random, string, time, requests
from requests import adapters
from Methods.WebDriverTools import WebDriverTools
from config import app, user_conf
from Methods.Log import Log
from Methods.LoginTools import LoginTools
import sys

class OldTools:

    vi = ['视图:图标平铺', '视图:图标导航模式靠右']

    def __init__(self):
        pass


    '''
    @classmethod
    def get_xid(self, imbeded_id, url, paramdic={}):
        xid = ''
        t = JsonMethods().http_post(url, paramdic, 20)
        for k in t.keys():
            if k == imbeded_id:
                xid = t.get(k)
                break
        return xid'''

    @classmethod
    def logintags(self, driver):
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
                    option = driver.find_element_by_css_selector("li[pageid='%s']" % x.split("-")[-1])
                    a = True
                except:
                    a = False
                if a == True:
                    option.click()
                    self.calculateTime(
                        driver, 'spinnerMask', itemproject + ">" + iddicids.get(x))
                    break
                else:
                    continue


    #计算网页加载时间
    @classmethod
    def calculate(self,driver,rotatingBar):
        driverWait = WebDriverWait(driver, 300)
        flag = len(driver.find_elements(By.CLASS_NAME, rotatingBar)) > 0
        if flag:
            startTime = time.time()
            print('time begin:')
        else:
            assert 0, 'No time to wait'
        ss = (driver.find_elements(By.CLASS_NAME, rotatingBar))
        spinerCount = len(ss)
        if spinerCount> 0:
            semaphore = driverWait.until(lambda dr: len(dr.find_elements(By.CLASS_NAME, rotatingBar))==0)
            if semaphore:
                endTime = time.time()
                print("start: %f, end :%f, All time for loading Page is: %f" % (startTime, endTime, endTime - startTime))
                #assert 0, "start: %f, end :%f, All time for loading is: %f" % (startTime, endTime, endTime - startTime,)
            else:
                assert 0,'Spinner is still running out of the maximum waiting time,please check API invocation'

    @classmethod
    def calculateTime(self, driver, loadingFlag, tagName):
        driverWait = WebDriverWait(driver, 90)
        flag = len(driver.find_elements(By.CLASS_NAME, loadingFlag)) > 0
        if flag:
            startTime = time.time()
            #print('start: %f,time begin:' % startTime)
        else:
            pass
        ss = (driver.find_elements(By.CLASS_NAME, loadingFlag))
        spinerCount = len(ss)
        if spinerCount > 0:
            try:
                semaphore = driverWait.until(
                    lambda dr: len(dr.find_elements(By.CLASS_NAME, loadingFlag)) == 0)
                if semaphore:
                    endTime = time.time()
                    #print('end: %f,time end:' % endTime)
                    print("start: %f, end :%f, Time taken for loading Page-%s is: %f" %
                          (startTime, endTime, tagName, endTime - startTime))

                    #assert 0, "start: %f, end :%f, All time for loading is: %f" % (startTime, endTime, endTime - startTime,)
                else:
                    assert 0, tagName+':页面等待时间过长(超过1分30秒)'
            except Exception:
                assert 0, tagName+':页面等待时间过长(超过1分30秒)'

    # Data Analysis tag-loading
    @classmethod
    def tag_load_via_click(self, driver, case_number, itemname, tagname, taglocator):
        try:
            #driver.find_element_by_css_selector(taglocator).click()
            WebDriverTools.enterModuleByUserMenu(driver, 'btnDataAnalys', '数据分析', '.breadcrumb')
            if tagname is None:
                self.calculateTime(driver, 'spinnerMask', itemname + ":")
            else:
                self.calculateTime(driver, 'spinnerMask', itemname + ">" + tagname)
        except Exception:
            picname = OldTools.random_str(3)
            driver.get_screenshot_as_file(
                'C:\\Snapshots\\' + tagname + picname + '.png')
            assert 0, case_number + itemname + \
                      tagname + \
                      'loading fails on' + itemname


    # Login Item via clicking on Icon
    @classmethod
    def login_item(self, driver, case_numer, itemname, iconlocator):
        self.tag_load_via_click(driver, case_numer, itemname, None, iconlocator)


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
                        picname = self.random_str(3)
                        driver.get_screenshot_as_file(
                            'C:\\Snapshots\\' + 'Data-Analysis-' + '-' + textdicts.get(k) + picname + '.png')
                        assert 0, case_numer + itemname + tagname + '-text: ' + \
                                  textdicts.get(k) + ' lost'
                    else:
                        print(icontext.text)

            else:
                assert 0, case_numer + itemname + tagname + '-text: ' + \
                          textdicts.get(k) + ' lost'

    @classmethod
    def account_audit(self, driver, user_name, pw):
        browser = LoginTools.loginInner(driver, user_name, pw)
        # Calculate time for login
        self.calculateTime(browser, 'spinner', 'For Login')
        return browser

    @classmethod
    def account_audit2(self, driver, user_name, pw):
        driver = LoginTools.loginInner(driver, user_name, pw)
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
                assert 0, user_name + '登录后看不到项目图标'
        if len(icons) > 0:
            endTime = time.time()
        else:
            assert 0, user_name + '登录失败'
        return (driver, endTime - startTime)


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
            print('Directory creation succeed')
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
            icon_time = WebDriverTools()
            icon_time.calculate(driver, 'spinnerMask')
        except Exception:
            assert 0, projectName + ':' + getele[1] + '-点击图标后登陆失败'


    @classmethod
    def accounts_list(self, excelpath):
        data = open_workbook(excelpath)
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
    def xlsx(self, excelpath):
        data = open_workbook(excelpath)
        sheetnames = data._sheet_names
        sname = sheetnames[0]
        rv = []
        if sname in sheetnames:
            sheet = data.sheet_by_name(sname)
            row_n = sheet.nrows
            for i in range(1, row_n):
                row = sheet.row_values(i)
                rv.append(row)
        return rv