import smtplib
import email.mime.multipart
import email.mime.text
import threading

from algorithm_case.Algorithm001 import *
from algorithm_case.Algorithm002 import *
from algorithm_case.Algorithm004 import *
from algorithm_case.Algorithm005 import *
from Methods.BeopTools import *
#serverip='beop.rnbtech.com.hk'
runningstate=0  #0调试模式，邮件发给我测试组，1运行模式，邮件发给所有

runmode = 0  # 0:debug, 1:release
m = 1
#case执行次数计数器
count = 1
failure = 0
success = 0
dictionary = {'suite_time':'消耗时间测试集','suite_front':'前端测试集','suite_back':'后端测试集',
              'suite_point':'项目数据点测试集','suite_image':'项目图片测试集','suite_Shreport':'上海华为项目报告测试集',
              'suite_dashboard':'上海华为项目dashboard测试集','suite_test':'通用测试集','suite_DataAnalysis':'数据分析测试集',
              'suite_groupname':'数据组名测试集','suite_Szreport':'深圳华为项目报告测试集','suite_kpi':'KPI仪表盘模板',
              "suite_hk":'测试港服接口','suite_report':'演示项目报表','suite_diagnosis':'系统诊断测试集','suite_delay':'主从数据库延迟测试集',
              "suite_memcache":"memcache测试集","suite_base":"基础测试集","suite_data":"实时数据测试集","suite_mongo":"mongo数据库测试集" ,
              "suite_service":"beopService测试集",'suite_smart':'智能传感测试集','suite_algorithm':'算法测试集'}
def sendmail(reciepents, title, body=None):
    msg = email.mime.multipart.MIMEMultipart()
    MAIL_SERVER = 'smtp.rnbtech.com.hk'
    MAIL_USERNAME = 'beop.cloud@rnbtech.com.hk'
    MAIL_PASSWORD = 'beop123456'
    DEFAULT_MAIL_SENDER = 'beop.cloud@rnbtech.com.hk'
    MAIL_DEFAULT_SENDER = 'beop.cloud@rnbtech.com.hk'

    msg['from'] = DEFAULT_MAIL_SENDER
    msg['to'] = reciepents
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



def case_forward(suite,suiteName,emails=['']):
    url = "http://beop.rnbtech.com.hk"
    global m,failure,success
    try:
        onlinestatue = requests.get(url).status_code
    except:
        if len(emails) > 0:
            for i in range(len(emails)):
                sendmail(emails[i],'国服-接口测试->%s' % dictionary[suiteName], '连接%s没有反应，退出测试，请检查网站是否正常' % url)
                pass
    if onlinestatue == 200:
        runner = unittest.TextTestRunner()
        testResult = runner.run(suite)
        failures = testResult.failures
        successes = testResult.testsRun - len(failures)
        failure += len(failures)
        success += successes
        for ff in failures:
            strAllResult = ''
            j = BeopTools.ErrorInfoPra(ff[1])
            strAllResult = strAllResult + '\n=======================\n' + j
            now_time = int(time.strftime("%Y%m%d %H%M%S", time.localtime()).split(' ')[1])
            if  int(now_time) > 10000 and int(now_time) < 230000:
                if len(failures) > 0:
                    if len(emails) > 0:
                        for i in range(len(emails)):
                            sendmail(emails[i], '国服-接口测试->%s' % dictionary[suiteName], strAllResult)
                            pass
                            # print(rv)

            elif m:
                if len(failures) > 0:
                    if len(emails) > 0:
                        for i in range(len(emails)):
                            sendmail(emails[i],'国服-接口测试->%s' % dictionary[suiteName], strAllResult)
                            pass
                            # print(rv)
                m = 0
            else:
                pass






    else:
        if len(emails) > 0:
            for i in range(len(emails)):
                sendmail(emails[i], 'BeOP Test->%s' % dictionary[suiteName], '连接%s没有反应，退出测试，请检查网站是否正常' % url)


def case_forward2(suite,suiteName,emails=['']):
    url = "http://beop.rnbtech.com.hk"
    global m,failure,success
    try:
        onlinestatue = requests.get(url).status_code
    except:
        if len(emails) > 0:
            for i in range(len(emails)):
                sendmail(emails[i],'国服-接口测试->%s' % dictionary[suiteName], '连接%s没有反应，退出测试，请检查网站是否正常' % url)
                pass
    if onlinestatue == 200:
        runner = unittest.TextTestRunner()
        testResult = runner.run(suite)
        failures = testResult.failures
        successes = testResult.testsRun - len(failures)
        failure += len(failures)
        success += successes
        strAllResult = ''
        for ff in failures:
            j = BeopTools.ErrorInfoPra(ff[1])
            strAllResult = strAllResult + '\n=======================\n' + j
            now_time = int(time.strftime("%Y%m%d %H%M%S", time.localtime()).split(' ')[1])
            if  int(now_time) > 80000 and int(now_time) < 230000:
                if len(failures) > 0:
                    if len(emails) > 0:
                        for i in range(len(emails)):
                            
                            sendmail(emails[i], '国服-接口测试->%s' % dictionary[suiteName], strAllResult)
                            pass
                            # print(rv)

            elif m:
                if len(failures) > 0:
                    if len(emails) > 0:
                        for i in range(len(emails)):
                            sendmail(emails[i],'国服-接口测试->%s' % dictionary[suiteName], strAllResult)
                            pass
                            # print(rv)
                m = 0
            else:
                pass






    else:
        if len(emails) > 0:
            for i in range(len(emails)):
                sendmail(emails[i], 'BeOP Test->%s' % dictionary[suiteName], '连接%s没有反应，退出测试，请检查网站是否正常' % url)

def worker2():
    global count
    print("第%s次自动化测试任务开始!" % count)

    suite_smart = unittest.TestSuite()
    suite_algorithm = unittest.TestSuite()
    nowTime = time.strftime("%Y-%m-%d %H%M%S", time.localtime()).split(' ')[1]
    if 70000 < int(nowTime) < 190000:
        suite_smart.addTest(Algorithm001('Test'))
        suite_smart.addTest(Algorithm002('Test'))
    if int(datetime.datetime.now().minute) == 17:
        suite_algorithm.addTest(Algorithm004('Test'))
        suite_algorithm.addTest(Algorithm005('Test'))
    #print("基础测试集自动化测试任务开始!")
    begin = time.time()
    startTime = time.strftime('%Y-%m-%d %H:%M:%S')
    threads = []
    t1 = threading.Thread(target=case_forward,args=(suite_smart,"suite_smart",['woody.wu@rnbtech.com.hk','674631105@qq.com']))
    t2 = threading.Thread(target=case_forward,args=(suite_algorithm,"suite_algorithm",['315028435@qq.com, 1042585235@qq.com','woody.wu@rnbtech.com.hk']))
    #t1 = threading.Thread(target=case_forward,args=(suite_smart,"suite_smart",['woody.wu@rnbtech.com.hk']))

    #t12 = threading.Thread(target=BaseRun3)
    #t4 = threading.Thread(target=worker2)
    threads.append(t1)
    threads.append(t2)

    length = len(threads)




    start = time.time()
    for i in range(length):
        threads[i].start()
    for i in range(length):
        threads[i].join()





    print("第%s次自动化测试任务结束!" % count)
    print("截止目前运行总错误case数为%d\n" % failure)
    print("截止目前运行总成功case数为%d\n" % success)
    cost = time.time() - begin
    print("耗时" + str(cost))
    #计数器加1


    count += 1
    result = {'成功':success,'失败':failure}
    return result









if __name__ == "__main__":
    while 1:
        worker2()
        print(time.ctime())
        time.sleep(60*15)
            

