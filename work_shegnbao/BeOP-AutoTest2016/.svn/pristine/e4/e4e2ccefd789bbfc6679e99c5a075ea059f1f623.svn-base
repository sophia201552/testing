__author__ = 'woody'
from Methods.LoginTools import LoginTools
import unittest
import datetime, time
from Methods.WebDriverTools import WebDriverTools
from config import app
from selenium.webdriver.support.wait import WebDriverWait
from selenium.common.exceptions import ElementNotVisibleException
from Methods.MemcacheTools import MemcacheTools
from Methods.OtherTools import OtherTools
url = "http://%s" % app.config['SERVERIP']

projects = {'project-28-zhognquplaza-undefined':{'name':'中区广场',
                                                 'pageName':['系统总览'],
                                                  'pagecss':'#indexMain',
                                                 'method':"lambda x: len(x.find_elements_by_tag_name('p')) > 30",
                                                  'mode':1
                                                 },
            'project-284-shangshidasha-undefined':{'name':'上实大厦',
                                                   'pageName':['系统诊断','系统诊断'],
                                                   'pagecss':'#btnWarningLog',
                                                   'method':"lambda x: x.find_element_by_id('btnNoticeConfig')",
                                                    'mode':0
                                                   },
            'project-318-jinzhongguangchang-undefined':{'name':'金钟广场',
                                                   'pageName':['系统诊断','系统诊断'],
                                                   'pagecss':'#btnWarningLog',
                                                   'method':"lambda x: x.find_element_by_id('btnNoticeConfig')",
                                                    'mode':0
                                                   },
            'project-120-mercedes-undefined': {
                                                'name':'梅赛德斯奔驰',
                                                'pageName':['系统诊断'],
                                                'pagecss':'#btnWarningLog',
                                                'method':"lambda x: x.find_element_by_id('divObserverCanvas').is_displayed()",
                                                'mode':1
                                                },
            'project-194-SHyinchaochang-undefined': {
                'name': '上海印钞厂',
                'pageName': ['系统诊断'],
                'pagecss': '#btnWarningLog',
                'method': "lambda x: x.find_element_by_id('divObserverCanvas').is_displayed()",
                'mode': 1
            },
            'project-100-YangzhouColgate-undefined': {
                'name': '扬州高露洁',
                'pageName': ['系统诊断','系统诊断'],
                'pagecss': '#btnWarningLog',
                'method': "lambda x: x.find_element_by_id('divObserverCanvas').is_displayed()",
                'mode': 1
            },
            'project-90-changsfgd02-undefined': {
                'name': '顺风光电1号',
                'pageName': ['系统诊断', '系统诊断'],
                'pagecss': '#btnWarningLog',
                'method': "lambda x: x.find_element_by_id('divObserverCanvas').is_displayed()",
                'mode': 1
            },
            'project-179-goodmanHK-undefined': {
                'name': '嘉民',
                'pageName': ['Diagnosis'],
                'pagecss': '#btnWarningLog',
                'method': "lambda x: x.find_element_by_id('divObserverCanvas').is_displayed()",
                'mode': 1
            },
            'project-364-moubangonglou-undefined': {
                'name': '某办公楼',
                'pageName': ['Diagnosis'],
                'pagecss': '#btnWarningLog',
                'method': "lambda x: x.find_element_by_id('divObserverCanvas').is_displayed()",
                'mode': 1
            },
            'project-126-NCECShanghai-undefined': {
                'name': '国家会展中心',
                'pageName': ['系统诊断'],
                'pagecss': '#btnWarningLog',
                'method': "lambda x: x.find_element_by_id('divObserverCanvas').is_displayed()",
                'mode': 1
            },
            'project-293-liverpoolst-undefined': {
                'name': '利物浦',
                'pageName': ['Diagnosis'],
                'pagecss': '#btnWarningLog',
                'method': "lambda x: x.find_element_by_id('divObserverCanvas').is_displayed()",
                'mode': 1
            },
            'project-316-QYTD03-undefined': {
                'name': '企业天地三号楼',
                'pageName': ['系统诊断'],
                'pagecss': '#btnWarningLog',
                'method': "lambda x: x.find_element_by_id('divObserverCanvas').is_displayed()",
                'mode': 1
            }

            }





class Case044(unittest.TestCase):
    testCaseID = 'Case044'
    projectName = "付费项目"
    buzName = '系统诊断是否加载正常'
    now = 'None'
    errors = []


    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        MemcacheTools.setMemTime(self.testCaseID, {'start':self.startTime})
        lg = LoginTools()
        self.driver = lg.InitialChrome(url, self.testCaseID)
        self.driver = lg.login(self.driver)
        self.a = WebDriverTools()



    def Test(self):
        self.errors = []
        driver = self.driver
        for key, value in projects.items():
            projId = key
            projName = value.get('name')
            pageName = value.get('pageName')
            pageCss = value.get('pagecss')
            method = value.get('method')
            mode = value.get('mode')
            self.EnterProject(driver, projId, projName)
            self.EnterPage(driver, projName, pageName, pageCss, method, mode)
        OtherTools.raiseError(self.errors)





    def EnterProject(self, driver, projId, projName):
        time.sleep(1)
        driver.find_element_by_id("navHomeLogo").click()
        try:
            WebDriverWait(driver, 10).until(lambda x: x.find_element_by_id(projId))
        except:
            self.errors.append("登陆后等待10秒未找到元素%s" % (projId, ))
        driver.find_element_by_id(projId).click()
        WebDriverTools.waitElementNotFound(driver, '.spinnerMask', self.testCaseID, timeout=120)
        #self.a.waitSpinner(driver, projName, timeout=120)

    def EnterPage(self, driver, projName, pageName, pageCss, method, mode=1):
        '''if len(pageCss):
            for p in pageCss:
                driver.find_element_by_css_selector(p).click()
                time.sleep(1)
        else:
            driver.find_element_by_css_selector(pageCss[0]).click()'''
        lis = driver.find_elements_by_css_selector('#ulPages>li')
        for index, page in enumerate(pageName):
            for li in lis:
                if (li.text == page):
                    li.click()
                    if index == len(pageName) - 1:
                        break
                    else:
                        ul = WebDriverWait(li, 10).until(lambda x: x.find_element_by_css_selector('ul'))
                        if ul:
                            lis = ul.find_elements_by_css_selector('li')
        #time.sleep(2)
        if mode == 0:
            time.sleep(10)
            try:
                spinner = WebDriverWait(driver, 8, 1,(ElementNotVisibleException)).until_not(lambda x: x.find_element_by_class_name('spinnerMask').is_displayed())
                print("spinner加载完毕")
            except Exception as e:
                WebDriverTools.get_pic(driver, projName)
                print(e.__str__())
                spinner = False
            try:
                element = WebDriverWait(driver, 15).until(eval(method))
            except Exception as e:
                print(e.__str__())
                element = False
            if spinner and element:
                print("%s项目%s页面加载时间在15秒之内！" % (projName, '--'.join(pageName)))
            else:
                WebDriverTools.get_pic(driver, self.testCaseID)
                self.errors.append("%s项目%s页面加载时间超过10秒!请优化!" % (projName, '--'.join(pageName)))

        else:
            use = self.a.waitSpinner(driver, projName+'--'.join(pageName), timeout=60)
            use = str(use)[:4]
            try:
                element = WebDriverWait(driver, 10).until(eval(method))
            except Exception as e:
                print(e.__str__())
                element = False
            if float(use) < 15 and element:
                print("%s项目%s页面加载时间在15秒之内,加载时间为%s秒！" % (projName, '--'.join(pageName), use))
            elif float(use) > 15:
                WebDriverTools.get_pic(driver, self.testCaseID)
                self.errors.append("%s项目%s页面加载时间超过15秒!加载时间为%s秒,请优化!" % (projName, '--'.join(pageName), use))
        '''
        try:
            spinner = WebDriverWait(driver, 8, 1,(ElementNotVisibleException)).until_not(lambda x: x.find_element_by_class_name('spinnerMask').is_displayed())
            print("spinner加载完毕")
        except Exception as e:
            print(e.__str__())
            spinner = False
        try:
            element = WebDriverWait(driver, 8).until(eval(method))
        except Exception as e:
            print(e.__str__())
            element = False
        print('spinner:', spinner, 'element:', element)
        if spinner and element:
            print("%s项目%s页面加载时间在10秒之内" % (projName, pageName))
        else:
            self.errors.append("%s项目%s页面加载时间超过10秒!请优化!" % (projName, pageName))
        '''


    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime()).split(" ")[-1]
        self.driver.quit()
        MemcacheTools.setMemTime(self.testCaseID,{'start':self.startTime,'end':self.now})



if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Case044('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)
