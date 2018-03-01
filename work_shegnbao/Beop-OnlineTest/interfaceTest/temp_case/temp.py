import sys, io, string, random, time
from setting import info
import sqlite3

from setting import serverip
import sqlite3
from email.header import Header
import smtplib
import email.mime.multipart
import email.mime.text
import threading
from CaseP003_Projectpng import *
from CaseP004_ProjectPoint import *
from CaseP005_report import *
from CaseP006_dashboard_point import *
from CaseP007_ChangeGroupName import *
from CaseP008_DataAnalysisTime import *
from CaseP009_datapointImage import *
from CaseP010_Beop6 import *
from CaseP011_DashboardKPI import *
from CaseP012_DashboardUnion import *
from CaseP013_diagnosis import *
from CaseP015DataAnalysis import *
from CaseP014databaseDelay import *
from CaseP016Memcache import *
from CaseP017get_realtimedata import *
from CaseP018getRealtimeFault import *
from CaseP019get_plant import *
from CaseU012 import *
from CaseU028 import *
from CaseD006checkGetHistoryDataForDHM import *
from CaseD016AnalysisPortWorkspace import *
from CaseD019login import *
from CaseP020realTime import *
from CaseP021BeopServiceIsExisted import *
from CaseP022_asset_managent import *
from TempChange import *
from AHUOnoff import *
from HistoryData import *
serverip='beop.rnbtech.com.hk'
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
              "suite_memcache":"memcache测试集","suite_base":"基础测试集","suite_data":"实时数据测试集","suite_temp":"温控自动化测试" }
def sendmail(reciepents, title, body=None):
    msg = email.mime.multipart.MIMEMultipart()
    MAIL_SERVER = 'smtp.rnbtech.com.hk'
    MAIL_USERNAME = 'beop.cloud@rnbtech.com.hk'
    MAIL_PASSWORD = 'beop123456'
    DEFAULT_MAIL_SENDER = '%s<beop.cloud@rnbtech.com.hk>' % (Header('BeOP温控APP自动化测试','utf-8'))
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
                sendmail(emails[i],'%s(不通过)' % dictionary[suiteName], '连接%s没有反应，退出测试，请检查网站是否正常' % url)
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
            j = BeopTools.ErrorInfoLong(ff[1])
            strAllResult = strAllResult + '\n=======================\n' + j
            now_time = int(time.strftime("%Y%m%d %H%M%S", time.localtime()).split(' ')[1])
            if  int(now_time) > 80000 and int(now_time) < 230000:
                if len(failures) > 0:
                    if len(emails) > 0:
                        for i in range(len(emails)):
                            
                            sendmail(emails[i], '%s(不通过)' % dictionary[suiteName], strAllResult)
                            pass
                            # print(rv)

            elif m:
                if len(failures) > 0:
                    if len(emails) > 0:
                        for i in range(len(emails)):
                            sendmail(emails[i],'%s' % dictionary[suiteName], strAllResult)
                            pass
                            # print(rv)
                m = 0
            else:
                pass






    else:
        if len(emails) > 0:
            for i in range(len(emails)):
                sendmail(emails[i], '%s' % dictionary[suiteName], '连接%s没有反应，退出测试，请检查网站是否正常' % url)




def worker2():
    global count
    print("第%s次自动化测试任务开始!" % count)
    suite_time = unittest.TestSuite()
    suite_front = unittest.TestSuite()
    suite_back = unittest.TestSuite()
    suite_point = unittest.TestSuite()
    suite_image = unittest.TestSuite()
    suite_Shreport = unittest.TestSuite()
    suite_Szreport = unittest.TestSuite()
    suite_dashboard = unittest.TestSuite()
    suite_groupname = unittest.TestSuite()
    suite_DataAnalysis = unittest.TestSuite()
    suite_test = unittest.TestSuite()
    suite_kpi = unittest.TestSuite()
    suite_hk = unittest.TestSuite()
    suite_report = unittest.TestSuite()
    suite_diagnosis = unittest.TestSuite()
    suite_delay = unittest.TestSuite()
    suite_memcache = unittest.TestSuite()
    suite_data = unittest.TestSuite()
    suite_base = unittest.TestSuite()
    suite_temp = unittest.TestSuite()
    # 测试项目报表
    if datetime.now().hour > 8 and datetime.now().hour < 20:
        suite_Shreport.addTest(Report('Shhw'))
        suite_Szreport.addTest(Report('Szhw'))
        suite_report.addTest(Report('DemoChs06'))
        suite_report.addTest(Report('DemoEn06'))
    # 检查项目图片
    suite_image.addTest(GetImage('Shhw'))
    suite_image.addTest(GetImage("DemoCh02"))
    suite_image.addTest(GetImage("DemoCh04"))
    suite_image.addTest(GetImage("DemoCh05"))
    suite_image.addTest(GetImage("DemoCh06"))
    suite_image.addTest(GetImage("DemoCh01"))
    suite_image.addTest(GetImage("DemoEn01"))
    suite_image.addTest(GetImage("DemoCh03"))
    suite_image.addTest(GetImage("DemoEn03"))
    suite_image.addTest(GetImage("DemoEn02"))
    suite_image.addTest(GetImage("DemoEn04"))
    suite_image.addTest(GetImage("DemoEn05"))
    suite_image.addTest(GetImage("DemoEn06"))
    suite_image.addTest(GetImage("Szhw"))
    suite_image.addTest(GetImage("Hkhr"))
    suite_image.addTest(GetImage("hsimc"))
    suite_image.addTest(GetImage("dajin"))
    suite_image.addTest(GetImage("panda"))
    suite_image.addTest(GetImage("wdzzsy"))
    suite_image.addTest(GetImage("wdzzbh"))
    suite_image.addTest(GetImage("qdwdstore"))
    suite_image.addTest(GetImage("qdwdbusines"))
    suite_image.addTest(GetImage("gubei"))
    suite_image.addTest(GetImage("kmwd"))
    suite_image.addTest(GetImage("kmbusiness"))
    suite_image.addTest(GetImage("kmstore"))
    suite_image.addTest(GetImage("zhongxin1qi"))
    suite_image.addTest(GetImage("zhongxin2qi"))
    suite_image.addTest(GetImage("hddianwang"))
    suite_image.addTest(GetImage("SAIC_DLZC"))
    suite_image.addTest(GetImage("hongli"))
    suite_image.addTest(GetImage("ChangiAirport"))
    suite_image.addTest(GetImage("GalaxyMacau"))
    suite_image.addTest(GetImage("SFjiangsu"))
    suite_image.addTest(GetImage("TSgangsu"))
    suite_image.addTest(GetImage("KerryJingan"))
    suite_image.addTest(GetImage("Worker"))
    suite_image.addTest(GetImage("WorkerGroup"))
    suite_image.addTest(GetImage("Fault"))

    # caseP004 验证项目数据稳定性
    suite_point.addTest(checkProjectPoint("kmwdstore"))
    suite_point.addTest(checkProjectPoint("kmwdhotel"))
    # suite_point.addTest(checkProjectPoint("kmbusiness"))
    # suite_point.addTest(checkProjectPoint("wdzzbh"))
    suite_point.addTest(checkProjectPoint("wdzzsy"))
    suite_point.addTest(checkProjectPoint("qdwdbusines"))
    suite_point.addTest(checkProjectPoint("qdwdstore"))
    suite_point.addTest(checkProjectPoint("panda"))
    # suite_point.addTest(checkProjectPoint("dajin"))
    suite_point.addTest(checkProjectPoint("HuarunHK"))
    suite_point.addTest(checkProjectPoint("HuaweiPlant"))
    suite_point.addTest(checkProjectPoint("gubei"))
    suite_point.addTest(checkProjectPoint("hddianwang"))
    suite_point.addTest(checkProjectPoint("zhongxin1qi"))
    # suite_point.addTest(checkProjectPoint("zhongxin2qi"))
    suite_point.addTest(checkProjectPoint("hongli"))
    suite_point.addTest(checkProjectPoint("hsimc"))
    suite_point.addTest(checkProjectPoint("shhuaweiTR"))
    suite_point.addTest(checkProjectPoint("shhuaweiHN1"))
    suite_point.addTest(checkProjectPoint("shhuaweiHN2"))
    suite_point.addTest(checkProjectPoint("shhuaweiHY"))
    suite_point.addTest(checkProjectPoint("SAIC_DLZC"))
    # 检测上海华为总览页面dashboard内容是否存在
    suite_dashboard.addTest(ShhwTestPointData('GenPieChart'))
    suite_dashboard.addTest(ShhwTestPointData('GenHistogramMulti1'))
    suite_dashboard.addTest(ShhwTestPointData('GenHistogram'))
    suite_dashboard.addTest(ShhwTestPointData("getWrongData"))
    #测试修改数据组名
    
    #suite_groupname.addTest(DataSource('TestDataSource'))
    #测试数据分析界面加载时间
    #suite_DataAnalysis.addTest(CostTime('UseTime'))

    #测试dashboard界面KPI仪表盘
    suite_kpi.addTest(DashboardTest("Test"))
    suite_dashboard.addTest(DashboardUnion("Test"))

    #测试港服
    suite_hk.addTest(BeopHk('Test'))

    #系统诊断
    suite_diagnosis.addTest(Diagnosis("DiagnosisLoadingTime"))

    suite_delay.addTest(DataBaseDelay("Test"))

    suite_DataAnalysis.addTest(CaseP015("Test"))

    suite_diagnosis.addTest(CaseP017("Test"))
    suite_diagnosis.addTest(CaseP018("Test"))
    suite_diagnosis.addTest(CaseP019("Test"))

    #memcache
    suite_memcache.addTest(CaseP016("Test"))

    #suite_base.addTest(BenchmarkPort("Update"))
    #suite_base.addTest(checkGetHistoryDataForDHM('checkGetHistoryDataForDHM'))
    #suite_base.addTest(AnalysisPortWorkspace("analysisWorkspaceTest"))
    #suite_base.addTest(login("loginTest"))
    #suite_base.addTest(Case012("get_pic"))
    #suite_base.addTest(AHUOnoff("Test"))
    #suite_base.addTest(TempChange("Test"))
    #suite_base.addTest(CaseP022("Test"))
    suite_temp.addTest(historyData("Test"))
    '''if runmode:
        #case_forward(suite_dashboard,'suite_dashboard',emails=['woody.wu@rnbtech.com.hk'])
        #case_forward(suite_Shreport,'suite_Shreport',emails=['woody.wu@rnbtech.com.hk'])
        #case_forward(suite_Szreport,'suite_Szreport',emails=['woody.wu@rnbtech.com.hk'])
        #case_forward(suite_report,'suite_report',emails=['woody.wu@rnbtech.com.hk'])
        case_forward(suite_kpi,'suite_kpi',emails=['woody.wu@rnbtech.com.hk'])
        #case_forward(suite_diagnosis,'suite_diagnosis',emails=['woody.wu@rnbtech.com.hk'])
        #case_forward(suite_diagnosis,'suite_diagnosis',emails=['woody.wu@rnbtech.com.hk'])





    else:

        case_forward(suite_dashboard,'suite_dashboard',emails=['kingsley.he@rnbtech.com.hk','12343403@qq.com','kruz.qian@rnbtech.com.hk','woody.wu@rnbtech.com.hk','irene.shen@rnbtech.com.hk','523705863@qq.com','343942059@qq.com','Angelia.chen@rnbtech.com.hk'])
        case_forward(suite_Shreport,'suite_Shreport',emails=['kingsley.he@rnbtech.com.hk','12343403@qq.com','kruz.qian@rnbtech.com.hk','woody.wu@rnbtech.com.hk','irene.shen@rnbtech.com.hk','523705863@qq.com','343942059@qq.com','Angelia.chen@rnbtech.com.hk'])
        case_forward(suite_Szreport,'suite_Szreport',emails=['kingsley.he@rnbtech.com.hk','12343403@qq.com','kruz.qian@rnbtech.com.hk','woody.wu@rnbtech.com.hk','irene.shen@rnbtech.com.hk','523705863@qq.com','343942059@qq.com','Angelia.chen@rnbtech.com.hk'])
        case_forward(suite_report,'suite_report',emails=['kingsley.he@rnbtech.com.hk','12343403@qq.com','kruz.qian@rnbtech.com.hk','woody.wu@rnbtech.com.hk','irene.shen@rnbtech.com.hk','523705863@qq.com','343942059@qq.com','Angelia.chen@rnbtech.com.hk'])
        case_forward(suite_kpi,'suite_kpi',emails=['kingsley.he@rnbtech.com.hk','12343403@qq.com','kruz.qian@rnbtech.com.hk','woody.wu@rnbtech.com.hk','irene.shen@rnbtech.com.hk','523705863@qq.com','343942059@qq.com','Angelia.chen@rnbtech.com.hk'])
        case_forward(suite_diagnosis,'suite_diagnosis',emails=['kingsley.he@rnbtech.com.hk','12343403@qq.com','kruz.qian@rnbtech.com.hk','woody.wu@rnbtech.com.hk','irene.shen@rnbtech.com.hk','523705863@qq.com','343942059@qq.com','Angelia.chen@rnbtech.com.hk'])
        case_forward(suite_image,'suite_image',emails=['kingsley.he@rnbtech.com.hk','12343403@qq.com','kruz.qian@rnbtech.com.hk','woody.wu@rnbtech.com.hk','irene.shen@rnbtech.com.hk','523705863@qq.com','343942059@qq.com','Angelia.chen@rnbtech.com.hk'])
        case_forward(suite_delay,'suite_delay',emails=['kingsley.he@rnbtech.com.hk','12343403@qq.com','kruz.qian@rnbtech.com.hk','woody.wu@rnbtech.com.hk','irene.shen@rnbtech.com.hk','523705863@qq.com','343942059@qq.com','Angelia.chen@rnbtech.com.hk'])
        case_forward(suite_DataAnalysis,'suite_DataAnalysis',emails=['kingsley.he@rnbtech.com.hk','12343403@qq.com','kruz.qian@rnbtech.com.hk','woody.wu@rnbtech.com.hk','irene.shen@rnbtech.com.hk','523705863@qq.com','343942059@qq.com','Angelia.chen@rnbtech.com.hk'])
        case_forward(suite_memcache,'suite_memcache',emails=['kingsley.he@rnbtech.com.hk','12343403@qq.com','kruz.qian@rnbtech.com.hk','woody.wu@rnbtech.com.hk','irene.shen@rnbtech.com.hk','523705863@qq.com','343942059@qq.com','Angelia.chen@rnbtech.com.hk'])

        #suite_point.addTest(checkProjectPoint("kmwdstore"))
        #case_forward(suite_point,emails=['kingsley.he@rnbtech.com.hk'])'''
    print("基础测试集自动化测试任务开始!")
    begin = time.time()
    startTime = time.strftime('%Y-%m-%d %H:%M:%S')
    '''threads = []
    t1 = threading.Thread(target=case_forward,args=(suite_dashboard,"suite_dashboard",['kingsley.he@rnbtech.com.hk','12343403@qq.com','kruz.qian@rnbtech.com.hk','woody.wu@rnbtech.com.hk','irene.shen@rnbtech.com.hk','523705863@qq.com','343942059@qq.com','Angelia.chen@rnbtech.com.hk']))
    t2 = threading.Thread(target=case_forward,args=(suite_Shreport,"suite_Shreport",['kingsley.he@rnbtech.com.hk','12343403@qq.com','kruz.qian@rnbtech.com.hk','woody.wu@rnbtech.com.hk','irene.shen@rnbtech.com.hk','523705863@qq.com','343942059@qq.com','Angelia.chen@rnbtech.com.hk']))
    t3 = threading.Thread(target=case_forward,args=(suite_Szreport,"suite_Szreport",['kingsley.he@rnbtech.com.hk','12343403@qq.com','kruz.qian@rnbtech.com.hk','woody.wu@rnbtech.com.hk','irene.shen@rnbtech.com.hk','523705863@qq.com','343942059@qq.com','Angelia.chen@rnbtech.com.hk']))
    t4 = threading.Thread(target=case_forward,args=(suite_report,"suite_report",['kingsley.he@rnbtech.com.hk','12343403@qq.com','kruz.qian@rnbtech.com.hk','woody.wu@rnbtech.com.hk','irene.shen@rnbtech.com.hk','523705863@qq.com','343942059@qq.com','Angelia.chen@rnbtech.com.hk']))
    t5 = threading.Thread(target=case_forward,args=(suite_kpi,"suite_kpi",['kingsley.he@rnbtech.com.hk','12343403@qq.com','kruz.qian@rnbtech.com.hk','woody.wu@rnbtech.com.hk','irene.shen@rnbtech.com.hk','523705863@qq.com','343942059@qq.com','Angelia.chen@rnbtech.com.hk']))
    t6 = threading.Thread(target=case_forward,args=(suite_diagnosis,"suite_diagnosis",['kingsley.he@rnbtech.com.hk','12343403@qq.com','kruz.qian@rnbtech.com.hk','woody.wu@rnbtech.com.hk','irene.shen@rnbtech.com.hk','523705863@qq.com','343942059@qq.com','Angelia.chen@rnbtech.com.hk']))
    t7 = threading.Thread(target=case_forward,args=(suite_image,"suite_image",['kingsley.he@rnbtech.com.hk','12343403@qq.com','kruz.qian@rnbtech.com.hk','woody.wu@rnbtech.com.hk','irene.shen@rnbtech.com.hk','523705863@qq.com','343942059@qq.com','Angelia.chen@rnbtech.com.hk']))
    t8 = threading.Thread(target=case_forward,args=(suite_delay,"suite_delay",['kingsley.he@rnbtech.com.hk','12343403@qq.com','kruz.qian@rnbtech.com.hk','woody.wu@rnbtech.com.hk','irene.shen@rnbtech.com.hk','523705863@qq.com','343942059@qq.com','Angelia.chen@rnbtech.com.hk']))
    t9 = threading.Thread(target=case_forward,args=(suite_DataAnalysis,"suite_DataAnalysis",['kingsley.he@rnbtech.com.hk','12343403@qq.com','kruz.qian@rnbtech.com.hk','woody.wu@rnbtech.com.hk','irene.shen@rnbtech.com.hk','523705863@qq.com','343942059@qq.com','Angelia.chen@rnbtech.com.hk']))
    t10 = threading.Thread(target=case_forward,args=(suite_memcache,"suite_memcache",['kingsley.he@rnbtech.com.hk','12343403@qq.com','kruz.qian@rnbtech.com.hk','woody.wu@rnbtech.com.hk','irene.shen@rnbtech.com.hk','523705863@qq.com','343942059@qq.com','Angelia.chen@rnbtech.com.hk']))
    t11 = threading.Thread(target=case_forward,args=(suite_base,"suite_base",['kingsley.he@rnbtech.com.hk','12343403@qq.com','kruz.qian@rnbtech.com.hk','woody.wu@rnbtech.com.hk','irene.shen@rnbtech.com.hk','523705863@qq.com','343942059@qq.com','Angelia.chen@rnbtech.com.hk']))
    t12 = threading.Thread(target=case_forward,args=(suite_data,"suite_data",['kingsley.he@rnbtech.com.hk','12343403@qq.com','kruz.qian@rnbtech.com.hk','woody.wu@rnbtech.com.hk','irene.shen@rnbtech.com.hk','523705863@qq.com','343942059@qq.com','Angelia.chen@rnbtech.com.hk']))

    #t12 = threading.Thread(target=BaseRun3)
    #t4 = threading.Thread(target=worker2)
    threads.append(t1)
    threads.append(t2)
    threads.append(t3)
    threads.append(t4)
    threads.append(t5)
    threads.append(t6)
    threads.append(t7)
    threads.append(t8)
    threads.append(t9)
    threads.append(t10)
    threads.append(t11)
    threads.append(t12)
    length = len(threads)




    start = time.time()
    for i in range(length):
        threads[i].start()
    for i in range(length):
        threads[i].join()
    '''
    case_forward(suite_temp,'suite_temp',emails=['kingsley.he@rnbtech.com.hk','12343403@qq.com','kruz.qian@rnbtech.com.hk','woody.wu@rnbtech.com.hk',"glennwu@rnbtech.com.hk",'irene.shen@rnbtech.com.hk','343942059@qq.com','Angelia.chen@rnbtech.com.hk',"wayne.ma@rnbtech.com.hk","sophia.zhao@rnbtech.com.hk"])
                                                
    #case_forward(suite_temp,'suite_temp',emails=['kingsley.he@rnbtech.com.hk',"woody.wu@rnbtech.com.hk"])
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
        if datetime.now().hour == 9:
            worker2()
            time.sleep(60*60)
        else:
            time.sleep(60)
 



