__author__ = 'woody'
from flask import Flask
import getpass
import os
import sys
import platform
app = Flask(__name__)
#公用配置,个人配置可以在父类基础上丰富
class Base:
    #kingsley用户名
    USERNAME = 'projecttest@rnbtech.com.hk'
    #kingsley密码
    PASSWORD = 'Rnbtech1103'
    #当前PC下载目录
    DOWNLOAD_DIR = r'C:\Users\%s\Downloads' % getpass.getuser()
    #user
    USER = "{}{}{}".format(platform.system(), platform.win32_ver()[0], getpass.getuser())
    #服务器ip，默认为国服
    SERVERIP = 'beop.rnbtech.com.hk'
    #SERVERIP = "192.168.1.208"
    # SERVERIP = 'beopdemo.rnbtech.com.hk'

    #用例运行时间
    RUNTIME = [7,20]
    #condition,为1则是运作模式，为0是调试模式
    CONDITION = 0
    #线程的个数
    THREADNUMBER=4
    #浏览器
    BROWSER = 'chrome'

    #浏览器对应类名
    BROWSER_CONFIG = {
        'default': 'Chrome',
        'chrome': 'Chrome',
        'firefox': 'Firefox',
        'ie': 'Ie',
        'safari': 'Safari',
        'edge': 'Edge'

    }
    #demo服务器ip，用于特定case专测demo或208
    # SERVERIPDEMO = 'beopdemo.rnbtech.com.hk'
    #208服务器ip，用于特定case专测demo或208
    SERVER208 = '192.168.1.208'

    MACHINE = '<strong>{} {} {} {}</strong>'.format(platform.system(), platform.win32_ver()[0], platform.win32_ver()[1],platform.win32_ver()[-1])
    BROWSER_VERSION = []

    BROWSER_LIST = ['Chrome']#, 'Firefox'
    #自动化测试报告收件人邮箱
    PUBLIC_EMAILS = ['kingsley.he@rnbtech.com.hk',
                    'woody.wu@rnbtech.com.hk','irene.shen@rnbtech.com.hk',
                    '523705863@qq.com','343942059@qq.com','Angelia.chen@rnbtech.com.hk',
                     "sophia.zhao@rnbtech.com.hk",]#'12343403@qq.com','rikan.li@rnbtech.com.hk'，'kruz.qian@rnbtech.com.hk',

    #测试组邮箱
    TEST_GROUP_EMAILS = ['woody.wu@rnbtech.com.hk',"Angelia.chen@rnbtech.com.hk","1281056983@qq.com","Kirry.gao@rnbtech.com.hk","523705863@qq.com","kingsley.he@rnbtech.com.hk"]
    #TEST_GROUP_EMAILS = ["1281056983@qq.com", 'woody.wu@rnbtech.com.hk']


    POP3_SERVER = 'pop3.rnbtech.com.hk'

    MEMCACHE_LOCAL = ['192.168.1.223']

    BASE_DIR = os.path.abspath(os.path.dirname(__file__))

    MEMCACHE_LOG = os.path.join(BASE_DIR, 'Log\\memcacheLog.txt')

    WEBDRIVERTOOLS_LOG = os.path.join(BASE_DIR, 'Log\\WebDriverLog.txt')

    LOGINTOOLS_LOG = os.path.join(BASE_DIR, 'Log\\LoginTools.txt')

    OTHERTOOLS_LOG = os.path.join(BASE_DIR, 'Log\\OtherTools.txt')

    DRIVER_PATH = os.path.join(BASE_DIR, 'Driver\\chromedriver.exe')

    CSS_ERROR = os.path.join(BASE_DIR, 'Log\\cssError.txt')

    CSS_PAGE = os.path.join(BASE_DIR, 'Pages')

    PROJECTTEST_ACCOUNT = 'projecttest@rnbtech.com.hk'

    PROJECTTEST_PWD = 'Rnbtech1103'
    MAIL_SERVER = 'smtp.rnbtech.com.hk'

    SERVER_LIST = {
                    '192.168.1.208': '测试服务器',
                    'beop.rnbtech.com.hk': '国服',
                    'beopdemo.rnbtech.com.hk': 'demo服务器',
                    'beopdemo.rnbtech.com.hk:5000': 'demo备用服务器'
                }
    MONGO_USERNAME = 'beopweb'

    MONGO_PASSWORD = 'RNB.beop-2013'

    MONGO_ADDR = '192.168.1.208:27017'


    #所有case列表
    ALL_CASE = ['Case001', 'Case002','Case003','Case004','Case005','Case006','Case007','Case008','Case009','Case010',
                 'Case011','Case013','Case014','Case015','Case016','Case018','Case019',
                 'Case020','Case021','Case023','Case024','Case026','Case028','Case029',
                 'Case030','Case031','Case032','Case034','Case036','Case037',
                 'Case039','Case040','Case042','Case045','Case046','Case047','Case048', 'Case050','Case054','Case055','Case056','Case057',
                 'Case058','Case059','Case060','Case062','Case063','Case064','Case065','Case066','Case067','Case068','Case069',
                 'Case070','Case071','Case072','Case073','Case074','Case075','Case076','Case077','Case081','Case082','Case084',
                 'Case086','Case087','Case089','Case094','Case095','Case096','Case097','Case098','Case099','Case100','Case101','Case102'
                ,'Case103'
                ]
                #,'Case017',#'Case025','Case027','Case033','Case043','Case044','Case051','Case049','Case052','Case053','Case085','Case061',,'Case012'
    #ALL_CASE = ['Case004']
    IMPORT_CASE_LIST = [
                         ('UICase.Case001huarunDiagnosis','Case001'),
                         ('UICase.Case002szhuaweiSystemListenPage', 'Case002'),
                         ('UICase.Case003simscSysListenPage', 'Case003'),
                         ('UICase.Case004userLoginAndOut', 'Case004'),
                         ('UICase.Case005huaweiIcon', 'Case005'),
                         ('UICase.Case006loginUseTime', 'Case006'),
                         ('UICase.Case007mapRedPoint', 'Case007'),
                         ('UICase.Case008addPointToDataSource', 'Case008'),
                         ('UICase.Case009dataAnalysisPages', 'Case009'),
                         ('UICase.Case010dataAnalysisWorkSpace', 'Case010'),
                         ('UICase.Case011dataAnalysisTemplate', 'Case011'),
                         ('UICase.Case012dataSouceGroup', 'Case012'),
                         ('UICase.Case013userInfo', 'Case013'),
                         ('UICase.Case014dataSourceNotes', 'Case014'),
                         ('UICase.Case015dataAnalysisPic', 'Case015'),
                         ('UICase.Case016userPasswordError', 'Case016'),
                         ('UICase.Case017wiki', 'Case017'),
                         ('UICase.Case018navigateMode', 'Case018'),
                         ('UICase.Case019smiscDashboardJump', 'Case019'),
                         ('UICase.Case020dataSourceScroll', 'Case020'),
                         ('UICase.Case021InvitePeople', 'Case021'),
                         ('UICase.Case022dataSourceSearch', 'Case022'),
                         ('UICase.Case023dashboardPointAddToDS', 'Case023'),
                         ('UICase.Case024reportCheck', 'Case024'),
                         ('UICase.Case025taskGroup', 'Case025'),
                         ('UICase.Case026dashboardData', 'Case026'),
                         ('UICase.Case027workFlowEdit', 'Case027'),
                         ('UICase.Case028itemSearch', 'Case028'),
                         ('UICase.Case029huaweiDiagnosisPage', 'Case029'),
                         ('UICase.Case030indexPageCheck', 'Case030'),
                         ('UICase.Case031huaweiDataPointLost', 'Case031'),
                         ('UICase.Case032diagnosisCreateWorkFlow', 'Case032'),
                         ('UICase.Case033workFlowTag', 'Case033'),
                         ('UICase.Case034factoryCreateItem', 'Case034'),
                         ('UICase.Case036functionRecord', 'Case036'),
                         ('UICase.Case037patrolPoint', 'Case037'),
                         ('UICase.Case039patrolPeople', 'Case039'),
                         ('UICase.Case040forgetPassword', 'Case040'),
                         ('UICase.Case041factoryEditPage', 'Case041'),
                         ('UICase.Case042factoryPageDelete', 'Case042'),
                         ('UICase.Case043messageCenter', 'Case043'),
                         ('UICase.Case044diagnosisCostTime', 'Case044'),
                         ('UICase.Case045cloudPointOutput', 'Case045'),
                         ('UICase.Case046leftAndRightDisagnosisCount', 'Case046'),
                         ('UICase.Case047shareReportLink', 'Case047'),
                         ('UICase.Case048checkHWDashboard', 'Case048'),
                         ('UICase.Case049appPageJump', 'Case049'),
                         ('UICase.Case050clickMoreButton', 'Case050'),
                         ('UICase.Case051reportCheck', 'Case051'),
                         ('UICase.Case052reportCheck', 'Case052'),
                         ('UICase.Case053reportCheck', 'Case053'),
                         ('UICase.Case054fullScreen', 'Case054'),
                         ('UICase.Case055searchPoints', 'Case055'),
                         ('UICase.Case056originalData','Case056'),
                         ('UICase.Case057livePoint','Case057'),
                         ('UICase.Case058shLFSPage','Case058'),
						 ('UICase.Case059cnLFSPage','Case059'),
						 ('UICase.Case060BugisPage','Case060'),
						 ('UICase.Case061patrolLog','Case061'),
                         ('UICase.Case062liverpoolIndexPage','Case062'),
                         ('UICase.Case063liverpoolstEnergyOverviewPage','Case063'),
                         ('UICase.Case064liverpoolstDiagnosisOverviewPage','Case064'),
                         ('UICase.Case065liverpoolstKPIOverviewPage','Case065'),
                         ('UICase.Case066liverpoolstDiagnosisPage','Case066'),
                         ('UICase.Case067liverpoolstPlantPage','Case067'),
						 ('UICase.Case068demo09IndexPage','Case068'),
						 ('UICase.Case069demo09KPISummary','Case069'),
						 ('UICase.Case070demo09EnergyCostOverview','Case070'),
						 ('UICase.Case071demo09IceStorageSystemOverview','Case071'),
						 ('UICase.Case072demo09Equipments','Case072'),
						 ('UICase.Case073demo09SystemDiagnosis','Case073'),
						 ('UICase.Case074demo09DiagnosisOverview','Case074'),
                         ('UICase.Case075jinzhongIndexpage','Case075'),
                         ('UICase.Case076checkHWIndex','Case076'),
                         ('UICase.Case077factoryProjectType','Case077'),
                         ('UICase.Case081beopProjectType','Case081'),
                         ('UICase.Case082checkdisagnosisfolder','Case082'),
                         ('UICase.Case084checkdisagnosisNewPage','Case084'),
                         ('UICase.Case085importData','Case085'),
                         ('UICase.Case086MercedesEnergyOverview','Case086'),
                         ('UICase.Case087ShsmhjamQueryEnergyVal','Case087'),
                         ('UICase.Case088huaweiDiagnosisOverviewPage','Case088'),
                         ('UICase.Case089diagnosisFeedBack','Case089'),
                         # ('UICase.Case090diagnosisFeedBackNew', 'Case090'),
                         ('UICase.Case093checkdisagnosisHistory','Case093'),
                         ('UICase.Case094ShhuaweiKpiHvacCheck','Case094'),
                         ('UICase.Case095factorySearch','Case095'),
                         ('UICase.Case096MytestexportTime','Case096'),
                         ('UICase.Case097BatchAddCalcPoint','Case097'),
                         ('UICase.Case098AddDataSourceTitleDisappear','Case098'),
                         ('UICase.Case099checkguangmingReport','Case099'),
                         ('UICase.Case100checkGuangMingIndex','Case100'),
                         ('UICase.Case101checkEnergyScreen','Case101'),
                         ('UICase.Case102checkGuangMingHistoryPath','Case102'),
                         ('UICase.Case103dataStatistics','Case103'),
                        ]


#帮主配置
class kingsley(Base):
    USERNAME = 'kingsley.he@rnbtech.com.hk'
    PASSWORD = 'king1103beop'

#赵庆凯配置
class sophia(Base):
    USERNAME = "sophia.zhao@rnbtech.com.hk"
    PASSWORD = "zhao_123456"


#吴冉旭配置
class woody(Base):
    USERNAME = "woody.wu@rnbtech.com.hk"
    PASSWORD = "wuranxu312"


#陈婷婷配置
class angelia(Base):
    USERNAME = "woody.wu@rnbtech.com.hk"
    PASSWORD = "wuranxu312"


#woody小号配置
class tester1(Base):
    USERNAME = "619434176@qq.com"
    PASSWORD = "wuranxu312"

#woody小号2配置
class tester2(Base):
    USERNAME = "1613687333@qq.com"
    PASSWORD = "wuranxuA312"


#sophia小号配置
class tester3(Base):
    USERNAME = 'sophia201552@163.com'
    PASSWORD = 'zhao_123456'

class tester4(Base):
    USERNAME = 'wuranxu@126.com'
    PASSWORD = 'RNBbeop2013'
class guangming(Base):
    USERNAME = 'BrightDTM@163.com'
    PASSWORD = 'BrightDTM2017'

#配置集
user_conf = {
    'default':Base(),
    'kingsley':kingsley(),
    'sophia':sophia(),
    'woody':woody(),
    'angelia':angelia(),
    'tester1':tester1(),
    'tester2':tester2(),
    'tester3':tester3(),
    'tester4':tester4(),
    'guangming':guangming()
}

#默认配置
app.config.from_object(user_conf['default'])
