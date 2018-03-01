#coding=utf-8
import datetime
import threading
import time
import unittest, os
from time import sleep
import sys
sys.path.append(r'F:\BEOP-AutoTest2016\UICase')
from Methods.MailTools import MailTools
from Methods.Log import Log
from jinja2 import Environment,PackageLoader
from Methods.TestResultTools import MyTestResult
from config import app
from Methods.WebDriverTools import WebDriverTools
from Methods.OtherTools import OtherTools
import threadpool
#动态变量,动态导入
caseList = app.config['IMPORT_CASE_LIST']
names = locals()
for x in caseList:
    module = x[0]
    case = x[1]
    names[x[1]] = __import__(x[0], fromlist=([x[1]]))

class runCase:
    suffix = '通过'
    cost = 0
    Result2 = []
    Failed = 0
    ReportResultAll = {}
    failCase = []
    failInfo = []
    all_case = app.config['ALL_CASE']
    reportPath = app.config['BASE_DIR']
    browserList = app.config['BROWSER_LIST']
    logName = os.path.join(reportPath, 'Log\\runCase.txt')

    def __init__(self):
        self.reportPath = self.reportPath.replace('/', '\\')


    @classmethod
    def suite(self, caseList):
        print(time.ctime(), "%s任务开始!" % caseList)
        runner = unittest.TextTestRunner(resultclass=MyTestResult)
        suite = unittest.TestSuite()
        suite.addTest(eval(caseList+'.'+caseList)('Test'))
        testResult =runner.run(suite)
        failures = testResult.failures
        self.failInfo += failures
        successes = testResult.successes
        if len(failures)> 0 :
            print('%s failures: %d ' % (caseList, len(failures)))
        if failures != []:
            for x in failures:
                self.failCase.append(x[0].testCaseID)
        self.writeReport(successes, failures, self.failCase)
        print('%s 结束！' % caseList)

    @classmethod
    def writeReport(self, successes, failures, failCase):
        reportResult = {}
        failcount = 0
        successcount = 0
        for item in successes:
            now_ID = item[0].testCaseID
            if now_ID in reportResult.keys() or now_ID in failCase:
                try:
                    reportResult.pop(now_ID)
                except Exception as e:
                    pass
            reportResult[str(item[0].testCaseID)] = {'success_count': 0,
                                                     'success_list': [],
                                                     'fail_str': '',
                                                     'testCaseID': item[0].testCaseID,
                                                     'projectName': item[0].projectName,
                                                     'buzName': item[0].buzName,
                                                     'startTime': item[0].startTime,
                                                     'now': item[0].now,
                                                     'usetime': item[0].start,
                                                     'pic': '无'
                                                     }
            successcount += 1
            reportResult[str(item[0].testCaseID)]['success_count'] += 1
            reportResult[str(item[0].testCaseID)]['success_list'].append(item)
        for item in failures:
            now_ID = item[0].testCaseID
            if now_ID in reportResult.keys():
                try:
                    reportResult.pop(now_ID)
                except Exception as e:
                    pass
            filename, objId = OtherTools.generateFile(item[0].testCaseID, item[0].startTime, item[0].now)
            reportResult[item[0].testCaseID] = {'fail_count': 0,
                                                'fail_list': [],
                                                'fail_str': '',
                                                'testCaseID': item[0].testCaseID,
                                                'projectName': item[0].projectName,
                                                'buzName': item[0].buzName,
                                                'startTime': item[0].startTime,
                                                'now': item[0].now,
                                                'usetime': item[0].start,
                                                'pic':'<a href="http://140.207.49.230:5008/getPic/{}">{}点击查看</a>'.format(objId, filename) if filename else '无'
                                                }
            failcount += 1
            reportResult[str(item[0].testCaseID)]['fail_count'] += 1
            reportResult[str(item[0].testCaseID)]['fail_list'].append(item)
            reportResult[str(item[0].testCaseID)]['fail_str'] += str(item[1])

        number1, number2 = [], []
        number3, number4 = [], []
        rank1, rank2 = [], []
        ranked = []
        for case in successes:
            if str(case) not in reportResult:
                number1.append(reportResult[str(case[0].testCaseID)])
        for x in number1:
            if x not in number3:
                number3.append(x)
            else:
                pass

        for case in failures:
            if str(case) not in reportResult:
                number2.append(reportResult[str(case[0].testCaseID)])
        for x in number2:
            if x not in number4:
                number4.append(x)
            else:
                pass

        for i in number3:
            rank1.append(i['testCaseID'])
        for i in number4:
            rank2.append(i['testCaseID'])
        rank5 = []
        for x in rank2:
            if x not in rank5:
                rank5.append(x)

        for i in range(0, successcount):
            del successes[0]
        for i in range(0, failcount):
            del failures[0]

        failmount = len(rank5)
        successcount = len(list(set(rank1)))
        rank3 = list(set(rank1)) + list(set(rank2))
        ranked = sorted(rank3)
        self.Result2 += ranked
        self.ReportResultAll.update(reportResult)
        result = []
        for y in range(0, len(ranked)):
            result.append(reportResult[ranked[y]])

        result2 = []
        for x in result:
            if x not in result2:
                result2.append(x)
            else:
                pass

        self.Failed += failmount


    @classmethod
    def killBrowser(self):
        os.system(r'taskkill /F /IM chrome.exe')
        os.system(r'taskkill /F /IM chromedriver.exe')

    @classmethod
    def Go(self, threadNumber):
        runCase.killBrowser()
        self.suffix = "通过"
        print("自动化测试任务开始!")
        begin = time.time()
        startTime = time.strftime('%Y-%m-%d %H:%M:%S')
        pool =threadpool.ThreadPool(threadNumber)
        requests = threadpool.makeRequests(self.suite,args_list=self.all_case)
        [pool.putRequest(req) for req in requests]
        pool.wait()
        Result2 = sorted(self.Result2)
        result3 = []
        for y in range(0,len(Result2)):
            result3.append(self.ReportResultAll[Result2[y]])

        final_result = []
        for x in result3:
            if x not in final_result:
                final_result.append(x)
            else:
                pass

        env = Environment(loader=PackageLoader(__name__, 'templates',encoding='utf-8'))
        template = env.get_template('template.html')
        resultHTML = template.render(reportStruct=final_result)
        nowtime = time.strftime("%Y-%m-%d %H.%M.%S", time.localtime())
        with open('%s\TestReport\自动化测试报告%s.html' % (self.reportPath, nowtime) ,'wb') as file:
            file.write(resultHTML.encode())
        if self.Failed:
            suffix = '未通过,失败%d个/%d个' % (self.Failed, len(final_result))
        else:
            suffix = '通过,%d个' % (len(final_result))
        cost = (time.time() - begin) / 60
        web = app.config['SERVER_LIST']
        serverip = app.config['SERVERIP']
        test_mails = app.config.get('TEST_GROUP_EMAILS')
        public_mails = app.config.get('PUBLIC_EMAILS')
        while True:
            try:
                if web[app.config['SERVERIP']] == "国服":
                    if app.config.get('CONDITION'):
                        MailTools.send_mail(public_mails, web[serverip]+'-回归测试 '+'('+suffix+') '+startTime+' 历时'+str(int(cost))+'分钟', cost, resultHTML)
                        break
                    else:
                        MailTools.send_mail(test_mails, web[serverip]+'-回归测试 '+'('+suffix+') '+startTime+' 历时'+str(int(cost))+'分钟', cost, resultHTML)
                        break
                else:
                    print("Test server is not beop.rnbtech.com.hk")
                    MailTools.send_mail(test_mails, web[serverip]+'-回归测试 '+'('+suffix+') '+startTime+' 历时'+str(int(cost))+'分钟', cost, resultHTML)
                    break
            except Exception as e:
                Log.writeLogError(self.logName, e.__str__())
                break

        self.Failed = 0
        self.ReportResultAll = {}
        self.Result2 = []
        self.failCase = []




if __name__ == "__main__":
    runTime = app.config['RUNTIME']
    threadNumber = app.config['THREADNUMBER']
    for browser in app.config['BROWSER_LIST']:
        WebDriverTools.getBrowserVersion(browser)
    while 1:
        try:
            if datetime.datetime.now().hour in runTime:
                print("Run Go!")
                a = runCase()
                a.Go(threadNumber)
                print(datetime.datetime.now(),"Done! sleep 1 hour!")
                sleep(60*60)
                print(datetime.datetime.now(),"Have slept 1 hour,continue while!")
                continue
            else:
                print(datetime.datetime.now(),"sleep 60s")
                sleep(60)
                print(datetime.datetime.now(),"Have slept 60s ,continue while!")
                continue
        except Exception as e:
            Log.writeLogError(runCase.logName, e.__str__())
            print(e.__str__())
            break







