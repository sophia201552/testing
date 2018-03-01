import sys,os
print(os.path.split(sys.path[0])[0])
sys.path.append(os.path.split(sys.path[0])[0])
import smtplib
import email.mime.multipart
import email.mime.text
from email.header import Header
import threading, logging
import unittest, time, datetime, requests
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import json
import memcache
from threading import Lock
#动态变量,动态导入
caseList = app.config['IMPORT_CASE_LIST']
names = locals()
for x in caseList:
    module = x[0]
    case = x[1]
    names[x[1]] = __import__(x[0], fromlist=([x[1]]))


lock = Lock()
runningstate = 0  #0调试模式，邮件发给我测试组，1运行模式，邮件发给所有
base_mails = app.config['BASE_TEST_EMAILS']
autopair_mails = app.config['TEST_GROUP_RESET_EMAILS']
guangming_mail = app.config["TEST_FOR_GUANGMING"]
production_emails = app.config['PRODUCTION_EMAILS']
maint_mail = app.config["TEST_MAINT_EMAIL"]
runmode = 0  # 0:debug, 1:release
m = 1
#case执行次数计数器
count = 1
failure = 0
success = 0
dictionary = {
              'suite_smoke':'冒烟测试集',
              "suite_base":"基础测试集",
              "suite_data":"实时数据测试集",
              "suite_service":"beopService测试集",
              'suite_smart':'智能传感测试集',
              'suite_algorithm':'算法测试集',
              'suite_calc':'点计算测试集',
              'suite_patrol':'巡更测试集',
              'suite_asset':'资产管理测试集',
              'suite_expert':'ExpertContainer测试集',
              'suite_temp':'温控自动化测试集',
              'suite_base_only':'基础测试集',
              'suite_benchmark':'benchmark测试集',
              'suite_workflow':'工单测试集',
              'suite_calc_a':'点计算测试集',
              'suite_calc_b':'点计算测试集',
              'suite_calc_c':'点计算测试集',
              'suite_calc_d':'点计算测试集',
              'suite_base_e':'补数测试集',
              'suite_base_gaungming':"光明原始数据测试集",
              "suite_base_maint":"Maintenance功能集"
         }


screenwash = app.config["SCREENWASH"]
recoderro = []

calc_mail_a = app.config['CALC_TEST_EMAILS_A']
calc_mail_b = app.config['CALC_TEST_EMAILS_B']
calc_mail_c = app.config['CALC_TEST_EMAILS_C']
calc_mail_d = app.config['CALC_TEST_EMAILS_D']
project_online_mail = app.config['PROJECT_EMAILS']
smart_mail = app.config['SMART_EMAILS']
algorithm_mail = app.config['ALGORITHM_EMAILS']
service_mail = app.config['SERVICE_ERROR_EMAILS']
patrol_mail = app.config['PATROL_EMAILS']
asset_mail = app.config['ASSET_EMAILS']
container_mail = app.config['CONTAINER_EMAILS']
smoke_mail = app.config['SMOKE_EMAILS']
#smoke_mail = ['woody.wu@rnbtech.com.hk']
sophia_mail = ['sophia.zhao@rnbtech.com.hk']
temp_mail = app.config['TEMP_EMAILS']
benchmark_mail=app.config['BENCHMARK_EMAILS']
workflow_mail=app.config['WORKFLOW_EMAILS']

suite_base_cases = app.config['SUITE_BASE_CASES']
suit_autopair_cases = app.config["SUITE_AUTOR_CASE"]
suite_algorithm_cases = app.config['SUITE_ALGORITHM_CASES']
suite_smart_cases = app.config['SUITE_SMART_CASES']
suite_calc_cases_a = app.config['SUITE_CALC_CASES_A']
suite_calc_cases_b = app.config['SUITE_CALC_CASES_B']
suite_calc_cases_c = app.config['SUITE_CALC_CASES_C']
suite_calc_cases_d = app.config['SUITE_CALC_CASES_D']
suite_data_cases = app.config['SUITE_DATA_CASES']
suite_service_cases = app.config['SUITE_SERVICE_CASES']
suite_patrol_cases = app.config['SUITE_PATROL_CASES']
suite_asset_cases = app.config['SUITE_ASSET_CASES']
suite_expert_cases = app.config['SUITE_EXPERT_CASES']
suite_smoke_cases = app.config['SUITE_SMOKE_CASES']
suite_temp_cases = app.config['SUITE_TEMP_CASES']
suite_base_only = app.config['SUITE_BASE_ONLY']
suite_base_guangming = app.config["SUITE_BASE_GUAANGMING"]
suite_benchmark_cases = app.config['SUITE_BENCHMARK_CASES']
suite_workflow_cases = app.config['SUITE_WORKFLOW_CASES']
suit_maint_case = app.config["SUITE_MAINT_CASE"]
mailDelay = app.config['MAIL_DELAY']

def logg(logName):
    log = logName.replace('/', '\\')
    dirName = os.path.split(log)[0]
    if os.path.exists(dirName):
        pass
    else:
        os.mkdir(dirName)
    handler = logging.FileHandler(log, encoding='utf-8')
    logger = logging.getLogger()
    logger.handlers = []
    logger.addHandler(handler)
    logger.setLevel(logging.ERROR)
    return logger



def sendmail(reciepents, title, body=None):
    msg = email.mime.multipart.MIMEMultipart()
    MAIL_SERVER = 'smtp.rnbtech.com.hk'
    MAIL_USERNAME = 'projecttest@rnbtech.com.hk'
    MAIL_PASSWORD = 'Rnbtech1103'
    DEFAULT_MAIL_SENDER = '%s<projecttest@rnbtech.com.hk>' % (Header('BeOP后台自动化测试','utf-8'))
    MAIL_DEFAULT_SENDER = 'projecttest@rnbtech.com.hk'
    msg['from'] = DEFAULT_MAIL_SENDER
    msg['to'] = ';'.join(reciepents)
    msg['subject'] = title
    sendtime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(time.time()))
    msg['date'] = sendtime
    content = '''
        你好，
                这是一封自动发送的邮件，原因是自动化测试发现了您的问题，请参考：

    '''
    content = content + body
    content = content + '''

       R&B 研发部
    ''' + str(sendtime)
    txt = email.mime.text.MIMEText(content)
    msg.attach(txt)

    smtp = smtplib
    smtp = smtplib.SMTP()
    smtp.connect(MAIL_SERVER, 25)
    smtp.login(MAIL_USERNAME, MAIL_PASSWORD)
    smtp.sendmail(DEFAULT_MAIL_SENDER, reciepents, str(msg))
    smtp.quit()




def runSuite(suiteName, suite_base_cases, emails, delay):
    while 1:
        startTime = BeopTools.getTime()
        now_time = int(time.strftime("%Y%m%d %H%M%S", time.localtime()).split(' ')[1])
        try:
            print("%s测试集开始任务,写入开始时间至Memcache!" % suiteName)
            # BeopTools.setMemTime(suiteName, {'delay':delay, 'startTime':startTime})
            suite = unittest.TestSuite()
            if suiteName == 'suite_smart':
                if int(now_time) > 70000 and int(now_time) < 190000:
                    for case in suite_base_cases:
                        suite.addTest(eval(case + '.' + case)('Test'))
            elif suiteName == "suite_temp":
                if datetime.datetime.now().hour == 9:
                    for case in suite_base_cases:
                        suite.addTest(eval(case + '.' + case)('Test'))
            elif suiteName == 'suite_base_only':
                if datetime.datetime.now().hour == 6 and datetime.datetime.now().minute == 30:
                    for case in suite_base_cases:
                        suite.addTest(eval(case + '.' + case)('Test'))
            elif suiteName == "suite_base_e":
                for case in suite_base_cases:
                    suite.addTest(eval(case+"."+case)("Test"))
            else:
                for case in suite_base_cases:
                    if case == 'Smoke006' and datetime.datetime.now().hour < 8:
                        pass
                    else:
                        suite.addTest(eval(case + '.' + case)('Test'))
            case_forward(suite,suiteName,emails)
        except Exception as e:
            print(suiteName, e.__str__())
        print("%s测试集结束任务,写入结束时间至Memcache!" % suiteName)
        BeopTools.setMemTime(suiteName, {'delay':delay, 'startTime':startTime, 'endTime':BeopTools.getTime()})
        time.sleep(delay)


def case_forward(suite,suiteName,emails):
    url = "http://%s" % app.config['SERVERIP']
    global m,failure,success
    runner = unittest.TextTestRunner()
    testResult = runner.run(suite)
    failures = testResult.failures
    successes = testResult.testsRun - len(failures)
    failure += len(failures)
    success += successes

    for ff in failures:
        CaseID = ff[0].testCaseID
        strAllResult = ''
        logger = logg('%s/error.txt' % sys.path[0])
        logger.error("[%s]---错误case个数为%d!" % (BeopTools.getTime(), len(failures)))
        logger.error("[%s]---" % BeopTools.getTime() + ff[1])
        if suiteName == 'suite_temp' or suiteName == 'suite_calc':
            j = BeopTools.ErrorInfoPraNew(ff[1])
        elif suiteName == 'suite_smoke':
            j = BeopTools.ErrorInfo(ff[1])
        elif suiteName == "suite_base_e":
            j = BeopTools.ErrorInfoAuto(ff[1]).strip()
        elif suiteName == "suite_base_gaungming":
            try:
                j = ff[0].error[0]
            except:
               j = BeopTools.ErrorInfoAuto(ff[1]).strip()
        else:
            if CaseID == 'Calc044':
                j = BeopTools.ErrorInfoAuto(ff[1]).strip()
                if "may.chen@rnbtech.com.hk" not in base_mails:
                    base_mails.append("may.chen@rnbtech.com.hk")
            else:
                j = BeopTools.ErrorInfoAuto(ff[1])
        if j == '':
            j = BeopTools.ErrorInfoAuto(ff[1])
        if screenwash.get(CaseID+"SW",0)>0:
            status = screeningWasher(CaseID,j)
        else:
            status = True
        strAllResult = strAllResult + '\n=======================\n' + j
        now_time = int(time.strftime("%Y%m%d %H%M%S", time.localtime()).split(' ')[1])
        if len(emails) and status:
            try:
                #if BeopTools.checkCaseNeedSend(CaseID, mailDelay):
                    #conn = BeopTools.getMysqlConn(app.config['MYSQL_NAME'])
                    #BeopTools.setCase(conn, CaseID)
                sendmail(emails, '国服-接口测试->%s->%s' % (dictionary[suiteName],CaseID), strAllResult)
                logger.error("[%s]---发送邮件成功!" % BeopTools.getTime())
            except Exception as e:
                logger.error('发送邮件出错,请检查!' + e.__str__())
            time.sleep(10)
        else:
            logger.error("[%s]---邮箱为空!" % BeopTools.getTime())


def screeningWasher(CaseId,fails):
    allData = globals()
    CaseId = CaseId+"SW"
    if fails in recoderro:
        if screenwash[CaseId]-1:
            screenwash[CaseId]-=1
            return False
        else:
            screenwash[CaseId] = allData[CaseId]
            return True
    else:
        recoderro.append(fails)
        allData[CaseId] = screenwash[CaseId]
        return False

def run(caseList):
    try:
        suite = unittest.TestSuite()
        for c in caseList:
            suite.addTest(eval(c + '.' + c)('Test'))
        runner = unittest.TextTestRunner()
        testResult = runner.run(suite)
        failures = testResult.failures
        for ff in failures:
            j = BeopTools.ErrorInfoPraNew(ff[1])
            if j == '':
                j = BeopTools.ErrorInfo(ff[1])
            raise Exception(j)
    except Exception as e:
        raise Exception(e.__str__())

def work():
    global count
    nowTime = time.strftime("%Y-%m-%d %H%M%S", time.localtime()).split(' ')[1]
    print("BEOP后台自动化测试任务开始!")
    begin = time.time()
    startTime = time.strftime('%Y-%m-%d %H:%M:%S')
    threads = []
    #守护线程
    #t0 = threading.Thread(target=protect)
    #t0.setDaemon(True)

    t1 = threading.Thread(target=runSuite,args=("suite_base", suite_base_cases, base_mails,60))
    # t2 = threading.Thread(target=runSuite,args=("suite_algorithm", suite_algorithm_cases, algorithm_mail, 3600))
    # t3 = threading.Thread(target=runSuite,args=("suite_smart", suite_smart_cases, smart_mail, 600))
    # t4 = threading.Thread(target=runSuite,args=("suite_calc_a", suite_calc_cases_a, calc_mail_a, 900))
    # t5 = threading.Thread(target=runSuite,args=("suite_data", suite_data_cases, project_online_mail, 1800))
    # t6 = threading.Thread(target=runSuite,args=("suite_service", suite_service_cases, service_mail, 7200))
    # t7 = threading.Thread(target=runSuite,args=("suite_patrol", suite_patrol_cases, patrol_mail, 7200))
    #t8 = threading.Thread(target=runSuite,args=("suite_asset", suite_asset_cases, asset_mail, 3600))
    # t9 = threading.Thread(target=runSuite,args=("suite_expert", suite_expert_cases, container_mail, 3600))
    # t10 = threading.Thread(target=runSuite,args=("suite_smoke", suite_smoke_cases, smoke_mail, 3600))
    # t11 = threading.Thread(target=runSuite,args=("suite_temp", suite_temp_cases, temp_mail, 3600))
    t12 = threading.Thread(target=runSuite,args=("suite_base_only", suite_base_only, base_mails, 60))
    # t13 = threading.Thread(target=runSuite,args=("suite_benchmark", suite_benchmark_cases, benchmark_mail, 600))
    # t14 = threading.Thread(target=runSuite,args=("suite_workflow", suite_workflow_cases, workflow_mail, 3600))
    # t15 = threading.Thread(target=runSuite, args=("suite_calc_b", suite_calc_cases_b, calc_mail_b, 3600))
    # t16 = threading.Thread(target=runSuite, args=("suite_calc_c", suite_calc_cases_c, calc_mail_c, 3600))
    # t17 = threading.Thread(target=runSuite, args=("suite_calc_d", suite_calc_cases_d, calc_mail_d, 3600))
    t18 = threading.Thread(target=runSuite, args=("suite_base_e", suit_autopair_cases, autopair_mails, 60))
    t19 = threading.Thread(target=runSuite,args=("suite_base_gaungming", suite_base_guangming, guangming_mail, 60))
    t20 = threading.Thread(target=runSuite,args=("suite_base_maint", suit_maint_case, guangming_mail, 60))
    for i in range(21):
        try:
            t = eval('t'+str(i))
            threads.append(t)
        except:
            #print("线程t"+str(i)+"不存在!")
            pass



    length = len(threads)




    start = time.time()
    for i in range(length):
        threads[i].start()
    for i in range(length):
        threads[i].join()











if __name__ == "__main__":
    work()

