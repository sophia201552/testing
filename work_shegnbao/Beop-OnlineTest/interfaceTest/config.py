﻿__author__ = 'woody'

import getpass, os

# 公用配置,个人配置可以在父类基础上丰富
class BaseConfig:
    # kingsley用户名
    USERNAME = 'kingsley.he@rnbtech.com.hk'
    # kingsley密码
    PASSWORD = 'king1103beop'

    # 服务器ip，默认为国服
    SERVERIP = 'beop.rnbtech.com.hk'
    SERVERIPS = ['114.55.250.52:9001','42.159.147.163','13.92.83.50','139.219.190.67']
    # SERVERIP = 'beopdemo.rnbtech.com.hk'
    # 用例运行时间
    RUNTIME = [10]
    # condition,为1则是运作模式，为0是调试模式
    CONDITION = 1

    THREADNUMBER = 4
    # demo服务器ip，用于特定case专测demo或208
    SERVERIPDEMO = 'beopdemo.rnbtech.com.hk'
    # 208服务器ip，用于特定case专测demo或208
    SERVER208 = '192.168.1.208'

    # dev服务器
    DEV_SERVER = 'dev.rnbtech.com.hk'

    # BeopServiceUrl
    SERVICE_URL = "121.41.30.108"

    # ExpertContainer地址
    EXPERT_CONTAINER_URL = '121.41.28.69'
    EXPERT_CONTAINER_URLS = ['121.41.28.69',"42.159.234.15:4000","40.71.228.119:4000","121.41.28.69:4000"]

    # 能源算法服务器
    ALGORITHM_URL = '114.55.252.126:5111'
    # MQ地址
    MSGQUEEN_URL = '120.26.63.126'

    # Mongo地址
    MONGO_ADDR_LIST = [
        ('120.55.113.116', 27017),
        ('120.55.113.116', 27018),
        ('120.55.185.72', 27017),
        ('120.26.121.79', 27017),
        ('101.37.90.188', 27017),
        ('101.37.37.192', 27017),
        ('101.37.90.188', 27018),
        ("42.159.229.152",27017),
        ("52.168.30.86",27017)
        #('120.26.121.79', 27019),
    ]

    # Message地址
    MESSAGE_URL = 'http://121.41.30.108/mq/mqSendTask'
    TASK_RECEIVER = ["13917547764","18601679872","17000060357","18017764776"]

    MONGO_MAPPED = {
        '120.55.113.116:27017': 'Free历史数据库',
        '120.55.113.116:27018': 'Config数据库',
        '120.55.185.72:27017': 'huawei历史数据库'
    }

    SERVERIP_ALL = {
        "阿里云国服":"cn1.smartbeop.com",
        "微软云国服":"cn2.smartbeop.com",
        "微软云美服":"us2.smartbeop.com"
    }

    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    MYSQL_ADDR = 'qtc.smartbeop.com'

    MYSQL_PORT = 3306

    MYSQL_USERNAME = 'qtc'

    MYSQL_PWD = 'rnbtech'

    MYSQL_NAME = 'mail_message'

    SERVER_LIST = {
        '114.55.250.52:9001':'114.55.250.52',
        '192.168.1.208': '测试服务器',
        'beop.rnbtech.com.hk': '国服',
        'beopdemo.rnbtech.com.hk': 'demo服务器',
        'beopdemo.rnbtech.com.hk:5000': 'demo备用服务器'
    }

    '收邮件的地址配置'
    # 回归测试邮件配置
    MAIL_SERVER = 'smtp.rnbtech.com.hk'
    PROJECTTEST_ACCOUNT = 'projecttest@rnbtech.com.hk'
    PROJECTTEST_PWD = 'h=Lp4U8+Lp'
    # 测试华为报表是否收到邮件配置:
    EMAIL_REPORT = 'sophia1992110@163.com'
    EMAIL_REPORT_PASSWORD = '123456sophia'
    EMAIL_REPORT_POP3_SERVER = 'pop.163.com'
    MAIL_DELAY = 30
    # 测试工单邮件是否收到配置:
    EMAIL_WORKFLOW = ['sophia1990529@163.com', 'sophia1993219@163.com', 'sophia19911124@163.com']
    EMAIL_WORKFLOW_PASSWORD = '123456sophia'
    EMAIL_WORKFLOW_POP3_SERVER = 'pop.163.com'
    #光明邮件账号配置
    NAME="BrightDTM@163.com"
    PWD="BrightDTM2017"
    USERID="2739"


    '邮箱'
    # 自动化测试报告收件人邮箱
    PUBLIC_EMAILS = [ 'kruz.qian@rnbtech.com.hk','irene.shen@rnbtech.com.hk','Angelia.chen@rnbtech.com.hk',
                     "sophia.zhao@rnbtech.com.hk","Kirry.gao@rnbtech.com.hk"]
    #后台测试邮件组
    TEST_GROUP_RESET_EMAILS = ["Kirry.gao@rnbtech.com.hk","may.chen@rnbtech.com.hk"]


    # 测试组邮箱
    TEST_GROUP_EMAILS = ["Angelia.chen@rnbtech.com.hk","sophia.zhao@rnbtech.com.hk","Kirry.gao@rnbtech.com.hk"]
    #TEST_GROUP_EMAILS = ["Kirry.gao@rnbtech.com.hk"]


    #光明项目原始数据是否更新
    TEST_FOR_GUANGMING = ["Kirry.gao@rnbtech.com.hk","tony.nie@rnbtech.com.hk"]

    # 智能传感收件人
    SMART_EMAILS = [ "Kirry.gao@rnbtech.com.hk",'sophia.zhao@rnbtech.com.hk']

    # 算法测试用例收件人
    ALGORITHM_EMAILS = ["Kirry.gao@rnbtech.com.hk",'sophia.zhao@rnbtech.com.hk']

    # service用例出错收件人
    SERVICE_ERROR_EMAILS = [ "Angelia.chen@rnbtech.com.hk", "sophia.zhao@rnbtech.com.hk", 'david.chen@rnbtech.com.hk']
    # SERVICE_ERROR_EMAILS = ["Angelia.chen@rnbtech.com.hk"]

    # 项目掉线收件人#沈丽
    PROJECT_EMAILS = [ 'sophia.zhao@rnbtech.com.hk']

    # 点计算测试集A收件人#严 顾
    CALC_TEST_EMAILS_A = ['13304965@qq.com', '12343403@qq.com',
                          'Angelia.chen@rnbtech.com.hk', 'sophia.zhao@rnbtech.com.hk', '95255214@qq.com']

    # 点计算测试集B收件人#晨 顾
    CALC_TEST_EMAILS_B = ['13304965@qq.com', '12343403@qq.com',
                          'Angelia.chen@rnbtech.com.hk', 'sophia.zhao@rnbtech.com.hk', 'eric.wang@rnbtech.com.hk']

    # 点计算测试集C收件人
    CALC_TEST_EMAILS_C = ['315028435@qq.com', '523705863@qq.com', 'sophia.zhao@rnbtech.com.hk']

    # 点计算测试集D收件人
    CALC_TEST_EMAILS_D = ['13304965@qq.com', '12343403@qq.com',
                          'Angelia.chen@rnbtech.com.hk', 'sophia.zhao@rnbtech.com.hk', 'rikan.li@rnbtech.com.hk']


    # 基础测试集收件人#大为,顾博
    BASE_TEST_EMAILS = ['mango.yan@rnbtech.com.hk', 'sophia.zhao@rnbtech.com.hk',
                        'david.chen@rnbtech.com.hk','Kirry.gao@rnbtech.com.hk','angelia.chen@rnbtech.com.hk','tony.nie@rnbtech.com.hk']

    # 产品组
    PRODUCTION_EMAILS = ['kruz.qian@rnbtech.com.hk', 'irene.shen@rnbtech.com.hk', 'sophia.zhao@rnbtech.com.hk']

    # 后台组
    BACKEND_EMAILS = ['95255214@qq.com', 'eric.wang@rnbtech.com.hk',
                      'sophia.zhao@rnbtech.com.hk']

    # 巡更邮件组#大为 顾
    PATROL_EMAILS = ['david.chen@rnbtech.com.hk',  '12343403@qq.com',
                     'sophia.zhao@rnbtech.com.hk']

    # 资产管理#晨
    ASSET_EMAILS = ['eric.wang@rnbtech.com.hk',  'sophia.zhao@rnbtech.com.hk']

    # Container收件人#晨 顾
    CONTAINER_EMAILS = ['eric.wang@rnbtech.com.hk', '12343403@qq.com', ]

    # smoke测试集收件人
    SMOKE_EMAILS = ['13304965@qq.com', 'sophia.zhao@rnbtech.com.hk', '12343403@qq.com', 'kruz.qian@rnbtech.com.hk',
                     'irene.shen@rnbtech.com.hk', '523705863@qq.com', '343942059@qq.com',
                    'Angelia.chen@rnbtech.com.hk']

    # temp收件人
    TEMP_EMAILS = ['13304965@qq.com', '12343403@qq.com', 'kruz.qian@rnbtech.com.hk',
                   "glennwu@rnbtech.com.hk", 'irene.shen@rnbtech.com.hk', '343942059@qq.com',
                   'Angelia.chen@rnbtech.com.hk', "wayne.ma@rnbtech.com.hk", "sophia.zhao@rnbtech.com.hk"]

    # benchamark收件人
    BENCHMARK_EMAILS = ['sophia.zhao@rnbtech.com.hk', 'david.chen@rnbtech.com.hk']

    # 工单测试集收件人#顾
    WORKFLOW_EMAILS = ['sophia.zhao@rnbtech.com.hk', ]

    # 天气预报接口收件人#马逸平,sopia
    WEATHER_EMAILS = ['sophia.zhao@rnbtech.com.hk', 'myp318@126.com']

    # Calc025原始点和计算点虚拟点重名
    CALC025_EMAILS = ['sophia.zhao@rnbtech.com.hk', 'irene.shen@rnbtech.com.hk',
                      'amy.zhou@rnbtech.com.hk']  # 'myp318@126.com','irene.shen@rnbtech.com.hk'

    # Calc028计算点是否为none
    CALC028_EMAILS = ['sophia.zhao@rnbtech.com.hk', 'irene.shen@rnbtech.com.hk',
                      '12343403@qq.com']  # 'irene.shen@rnbtech.com.hk'

    # Calc027计算点是否为发生超过10倍的震幅
    CALC027_EMAILS = ['sophia.zhao@rnbtech.com.hk', 'myp318@126.com']  # ,'irene.shen@rnbtech.com.hk'

    # message received
    MONGO_RECEIVER = ['13916955112', '17000060357', '13816877930', '18601679872', '18516600716', '18701970149', '18017764776']

    LIVERPOOL_RECEIVER = ['18520497773', '18516600716']

    SQL_RECEIVER = ['18516600716', '17000060357', '13916955112', '18701970149', '18701970149', '18017764776',"13917547764"]

    MYSQL_INFO = [
        ('rds8961fe732pz9uw7jso.mysql.rds.aliyuncs.com', 3306, 'devtest', 'Rnbtech1103'),
                  ("52.168.75.2",3306,"root","RNB.beop-2013"),
                  ("13.82.182.126",3306,"root","RNB.beop-2013"),
                  #("139.219.232.82",3306,"datamlave%beopweb","Rnbtech1103"),
                  ("52.168.75.2",3306,"root","RNB.beop-2013"),
                  ]

    '接口测试用例大全'
    ALL_CASE = [
         'Base002','Base003', 'Base004', 'Base005', 'Base006', 'Base007', 'Base009', 'Base010', 'Base011',
        'Base013',  'Base016', 'Base017', 'Base018', #'Base019','Base008', 

        'Algorithm001', 'Algorithm004', 'Algorithm005', 'Algorithm006',

        'Calc006', 'Calc001', 'Calc002', 'Calc005','Calc008', 'Calc011', 'Calc013',
        'Calc014', 'Calc015','Calc016', 'Calc018', 'Calc019','Calc020', 'Calc021', 'Calc022', 'Calc023', 'Calc024',
        'Calc025', 'Calc026', 'Calc027', 'Calc028', 'Calc040','Calc041','Calc042',

        'Service001', 'Service002', 'Service003', 'Service004', 'Service005', 'Service006',  'Service010',
        'Service011', 'Service012', 'Service013', 'Service014', 'Service015', 'Service016', 'Service017', 'Service018',
        'Service019', 'Service020','Service022','Service023','Service025','Service026',

        'Smoke002', 'Smoke003', 'Smoke004', 'Smoke007', 'Smoke008', 'Smoke015',
         'Smoke017','Smoke019', 'Smoke020', 'Smoke021', 'Smoke022', 'Smoke023', 'Smoke025', 'Smoke026',
         'Smoke028', 'Smoke029', 'Smoke030', 'Smoke031', 'Smoke032','Smoke042',

        'Patrol001', 'Patrol002', 'Patrol003', 'Patrol004', 'Patrol005',

        'Benchmark001', 'Benchmark002', 'Benchmark003',

        'WorkFlow001','WorkFlow002', 'WorkFlow003',

        'GM001','GM002','GM003','GM004','GM005','GM006',

        'Asset002','Asset003'
    ]
    # 'Base002', 'Base012', 'Base014','Base015' 'Algorithm002', 'Calc012','Calc017','Smoke009','Smoke012', 'Smoke013', 'Smoke016', 'Smoke024', 'Temp001','Temp002'
    #  'WorkFlow004','Asset001','Base001', 'Smoke018',  'Smoke005','Smoke001','Smoke016',
    #'Service007','Service021', 'Calc007','Calc009','Expert001',  'Calc010', 'Smoke006', 'Smoke010','Smoke027',
    # caseList
    IMPORT_CASE_LIST = [
        ('interfaceTest.base_case.Base001beopConnections', 'Base001'),
        ('interfaceTest.base_case.Base002expertContainerRun', 'Base002'),
        ('interfaceTest.base_case.Base003login', 'Base003'),
        ('interfaceTest.base_case.Base004databaseDelay', 'Base004'),
        ('interfaceTest.base_case.Base005isBeopServiceExisted', 'Base005'),
        ('interfaceTest.base_case.Base006checkMailIsSent', 'Base006'),
        ('interfaceTest.base_case.Base007mongoAlive', 'Base007'),
        ('interfaceTest.base_case.Base008mysqlname', 'Base008'),
        ('interfaceTest.base_case.Base009compareCollectionName', 'Base009'),
        ('interfaceTest.base_case.Base010rabbitmqWarning', 'Base010'),
        ('interfaceTest.base_case.Base011beopAlive', 'Base011'),
        ('interfaceTest.base_case.Base012checkDataDiagnosis', 'Base012'),
        ('interfaceTest.base_case.Base013rabbitmqForCalculationPatch', 'Base013'),
        ('interfaceTest.base_case.Base014checkBeopOpen', 'Base014'),
        ('interfaceTest.base_case.Base015checkProjectState', 'Base015'),
        ('interfaceTest.base_case.Base016checkCalcThreads', 'Base016'),
        ('interfaceTest.base_case.Base017mailQueueCount', 'Base017'),
        ('interfaceTest.base_case.Base018rabbitmqWarningForCalculationTrigger0', 'Base018'),
        ('interfaceTest.base_case.Base019checkDevAlive', 'Base019'),
        ('interfaceTest.base_case.Base021checkVirtualpointsWriter', 'Base021'),
        ('interfaceTest.base_case.Base023checkmecacheContent', 'Base023'),
        ('interfaceTest.base_case.Base024checkRealTimeforGuangming', 'Base024'),
        ('interfaceTest.base_case.Base025taskmonitor', 'Base025'),
        ('interfaceTest.base_case.Base026checkallQueueLenght', 'Base026'),
        ('interfaceTest.base_case.Base027checkemailfilesize', 'Base027'),
        ('interfaceTest.base_case.Base028mysqlValidata', 'Base028'),
        ( 'interfaceTest.base_case.Base029mysqlforguangming', 'Base029'),
        ('interfaceTest.algorithm_case.Algorithm001', 'Algorithm001'),
        ('interfaceTest.algorithm_case.Algorithm002', 'Algorithm002'),
        ('interfaceTest.algorithm_case.Algorithm004', 'Algorithm004'),
        ('interfaceTest.algorithm_case.Algorithm005', 'Algorithm005'),
        ('interfaceTest.algorithm_case.Algorithm006', 'Algorithm006'),
        ('interfaceTest.calcPoint_Case.Calc006calcPointUpdateTime', 'Calc006'),
        ('interfaceTest.calcPoint_Case.Calc001addDelPoint', 'Calc001'),
        ('interfaceTest.calcPoint_Case.Calc002editPoint', 'Calc002'),
        ('interfaceTest.calcPoint_Case.Calc003API14to26', 'Calc003'),
        ('interfaceTest.calcPoint_Case.Calc004API01to13', 'Calc004'),
        ('interfaceTest.calcPoint_Case.Calc005addHistoryData', 'Calc005'),
        ('interfaceTest.calcPoint_Case.Calc007delPointData', 'Calc007'),
        ('interfaceTest.calcPoint_Case.Calc008isServiceExisted', 'Calc008'),
        ('interfaceTest.calcPoint_Case.Calc009editPointFormula', 'Calc009'),
        ('interfaceTest.calcPoint_Case.Calc010coverHistoryData', 'Calc010'),
        ('interfaceTest.calcPoint_Case.Calc011isSync', 'Calc011'),
        ('interfaceTest.calcPoint_Case.Calc012getPointTime', 'Calc012'),
        ('interfaceTest.calcPoint_Case.Calc013hzbtCheck', 'Calc013'),
        ('interfaceTest.calcPoint_Case.Calc014rabbitmqWarning', 'Calc014'),
        ('interfaceTest.calcPoint_Case.Calc015hzbtHistory', 'Calc015'),
        ('interfaceTest.calcPoint_Case.Calc016realTimeUpdate', 'Calc016'),
        ('interfaceTest.calcPoint_Case.Calc017pointValueCompare', 'Calc017'),
        ('interfaceTest.calcPoint_Case.Calc018valueIsNone', 'Calc018'),
        ('interfaceTest.calcPoint_Case.Calc019dependPoint', 'Calc019'),
        ('interfaceTest.calcPoint_Case.Calc020mailQueueCount', 'Calc020'),
        ('interfaceTest.calcPoint_Case.Calc021checkErrorLogCount', 'Calc021'),
        ('interfaceTest.calcPoint_Case.Calc022samePoints', 'Calc022'),
        ('interfaceTest.calcPoint_Case.Calc023changePumpState', 'Calc023'),
        ('interfaceTest.calcPoint_Case.Calc024liverpoolPoints', 'Calc024'),
        ('interfaceTest.calcPoint_Case.Calc025comparePointsNames', 'Calc025'),
        ('interfaceTest.calcPoint_Case.Calc026CheckMutation', 'Calc026'),
        ('interfaceTest.calcPoint_Case.Calc027hehuangyaoye', 'Calc027'),
        ('interfaceTest.calcPoint_Case.Calc028checkPointIsNoneForAllProject', 'Calc028'),
        ('interfaceTest.calcPoint_Case.Calc040qingShanHuVirtualPointNone', 'Calc040'),
        ('interfaceTest.calcPoint_Case.Calc041greenslopesCal', 'Calc041'),
        ('interfaceTest.calcPoint_Case.Calc042checkrealhistorydataipdate', 'Calc042'),
        ('interfaceTest.calcPoint_Case.Calc043checkhistorydataAtTime', 'Calc043'),
        ('interfaceTest.calcPoint_Case.Calc044checkhistoryCumulant', 'Calc044'),
        ('interfaceTest.service_case.Service001getHistoryData', 'Service001'),
        ('interfaceTest.service_case.Service002getDiagnosisAll', 'Service002'),
        ('interfaceTest.service_case.Service003getDiagnosisNotice', 'Service003'),
        ('interfaceTest.service_case.Service004realtimedataFromSite', 'Service004'),
        ('interfaceTest.service_case.Service005getDTUinfo', 'Service005'),
        ('interfaceTest.service_case.Service006updateDTUProjectByName', 'Service006'),
        ('interfaceTest.service_case.Service007sendHistoryDataToMongo', 'Service007'),
        ('interfaceTest.service_case.Service010getRealTimeData', 'Service010'),
        ('interfaceTest.service_case.Service011getWeatherData', 'Service011'),
        ('interfaceTest.service_case.Service012getDiagnosisFault', 'Service012'),
        ('interfaceTest.service_case.Service013getDiagnosisEquipment', 'Service013'),
        ('interfaceTest.service_case.Service014getDiagnosisZone', 'Service014'),
        ('interfaceTest.service_case.Service015getActiveOrder', 'Service015'),
        ('interfaceTest.service_case.Service016getHistoryAtTimeToV1', 'Service016'),
        ('interfaceTest.service_case.Service017getHistoryToV1', 'Service017'),
        ('interfaceTest.service_case.Service018getRealTimeToV1', 'Service018'),
        ('interfaceTest.service_case.Service019realtimedataFromSiteToV1', 'Service019'),
        ('interfaceTest.service_case.Service020getFaultRealTimeToV2', 'Service020'),
        ('interfaceTest.service_case.Service021getFaultHistoryToV2', 'Service021'),
        ('interfaceTest.service_case.Service022operateDataTaskConfig', 'Service022'),
        ('interfaceTest.service_case.Service023getProjectStatus', 'Service023'),
        ('interfaceTest.service_case.Service024ProjectStatusHistory', 'Service024'),
        ('interfaceTest.service_case.Service025getPointdata', 'Service025'),
        ('interfaceTest.service_case.Service026getHistoryAtMoment', 'Service026'),
        ('interfaceTest.asset_case.Asset001', 'Asset001'),
        ('interfaceTest.asset_case.Asset002', 'Asset002'),
        ('interfaceTest.asset_case.Asset003', 'Asset003'),
        ('interfaceTest.expertContainer_case.ExpertContainer001', 'Expert001'),
        ('interfaceTest.smoke_case.Smoke001checkGetHistoryDataForDHM', 'Smoke001'),
        ('interfaceTest.smoke_case.Smoke002AnalysisPortWorkspace', 'Smoke002'),
        ('interfaceTest.smoke_case.Smoke003login', 'Smoke003'),
        ('interfaceTest.smoke_case.Smoke004Projectpng', 'Smoke004'),
        ('interfaceTest.smoke_case.Smoke005ProjectPoint', 'Smoke005'),
        ('interfaceTest.smoke_case.Smoke006report', 'Smoke006'),
        ('interfaceTest.smoke_case.Smoke007DashboardKPI', 'Smoke007'),
        ('interfaceTest.smoke_case.Smoke008Projectpng', 'Smoke008'),
        ('interfaceTest.smoke_case.Smoke009ProjectPoint', 'Smoke009'),
        ('interfaceTest.smoke_case.Smoke010report', 'Smoke010'),
        ('interfaceTest.smoke_case.Smoke011dashboard_point', 'Smoke011'),
        ('interfaceTest.smoke_case.Smoke012ChangeGroupName', 'Smoke012'),
        ('interfaceTest.smoke_case.Smoke013DashboardKPI', 'Smoke013'),
        ('interfaceTest.smoke_case.Smoke014DashboardUnion', 'Smoke014'),
        ('interfaceTest.smoke_case.Smoke015diagnosis', 'Smoke015'),
        ('interfaceTest.smoke_case.Smoke016databaseDelay', 'Smoke016'),
        ('interfaceTest.smoke_case.Smoke017DataAnalysis', 'Smoke017'),
        ('interfaceTest.smoke_case.Smoke018Memcache', 'Smoke018'),
        ('interfaceTest.smoke_case.Smoke019get_realtimedata', 'Smoke019'),
        ('interfaceTest.smoke_case.Smoke020getRealtimeFault', 'Smoke020'),
        ('interfaceTest.smoke_case.Smoke021get_plant', 'Smoke021'),
        ('interfaceTest.smoke_case.Smoke022realTime', 'Smoke022'),
        ('interfaceTest.smoke_case.Smoke023isBeopServiceExisted', 'Smoke023'),
        ('interfaceTest.smoke_case.Smoke024check_mongo_connect', 'Smoke024'),
        ('interfaceTest.smoke_case.Smoke025Analysis', 'Smoke025'),
        ('interfaceTest.smoke_case.Smoke026shyccPoint', 'Smoke026'),
        ('interfaceTest.smoke_case.Smoke027calcAPIdocument', 'Smoke027'),
        ('interfaceTest.smoke_case.Smoke028get_plant_delay', 'Smoke028'),
        ('interfaceTest.smoke_case.Smoke029getFaultHistoryToV2', 'Smoke029'),
        ('interfaceTest.smoke_case.Smoke030ossPicture', 'Smoke030'),
        ('interfaceTest.smoke_case.Smoke031diagnosisCopy', 'Smoke031'),
        ('interfaceTest.smoke_case.Smoke032startWorkspaceDataGenHistogram', 'Smoke032'),
        ('interfaceTest.smoke_case.Smoke042checkTimeOutForSetRealtimedataFromSite', 'Smoke042'),
        ('interfaceTest.patrol_case.Patrol001point', 'Patrol001'),
        ('interfaceTest.patrol_case.Patrol002path', 'Patrol002'),
        ('interfaceTest.patrol_case.Patrol003executor', 'Patrol003'),
        ('interfaceTest.patrol_case.Patrol004task', 'Patrol004'),
        ('interfaceTest.patrol_case.Patrol005KaiNeng', 'Patrol005'),
        ('interfaceTest.temp_case.Temp001HistoryData', 'Temp001'),
        ('interfaceTest.temp_case.Temp002', 'Temp002'),
        ('interfaceTest.benchmark_case.Benchmark001', 'Benchmark001'),
        ('interfaceTest.benchmark_case.Benchmark002', 'Benchmark002'),
        ('interfaceTest.benchmark_case.Benchmark003', 'Benchmark003'),
        ('interfaceTest.workflow.Workflow001newWorkAndEditDelete', 'WorkFlow001'),
        ('interfaceTest.workflow.Workflow002getWork', 'WorkFlow002'),
        ('interfaceTest.workflow.Workflow003newGroupAndEditDelete', 'WorkFlow003'),
        ('interfaceTest.workflow.Workflow004checkMailIsSent', 'WorkFlow004'),
        ('interfaceTest.guangming_case.GM001', 'GM001'),
        ('interfaceTest.guangming_case.GM002', 'GM002'),
        ('interfaceTest.guangming_case.GM003', 'GM003'),
        ('interfaceTest.guangming_case.GM004', 'GM004'),
        ('interfaceTest.guangming_case.GM005', 'GM005'),
        ('interfaceTest.guangming_case.GM006', 'GM006'),
        ('interfaceTest.Autorepair.Autorepair001', 'Autorepair001'),
        ('interfaceTest.Autorepair.Autorepair002', 'Autorepair002'),
        ('interfaceTest.healthMaintenance.maint001rushredis', 'Maint001'),
    ]

    SCREENWASH = {
        "Algorithm001SW":2,"Algorithm002SW":2,"Algorithm004SW":2,"Algorithm005SW":2,"Algorithm006SW":2,
        "Base001SW":2,"Base002SW":3,"Base003SW":2,"Base004SW":3,"Base005SW":2,"Base006SW":2,
        "Base007SW":2,"Base008SW":2,"Base009SW":2,"Base010SW":2,"Base011SW":2,"Base012SW":2,
        "Base013SW":2,"Base014SW":2,"Base015SW":2,"Base016SW":2,"Base017SW":2,"Base018SW":2,
        "Base019SW":2,"Base020SW":2,"Base021SW":3,"Base022SW":2,"Base023SW":2,"Base024SW":2,
        "Base025SW":2,"Base026SW":3,"Base027SW":1,"Base028SW":2,"Base029SW":3,
        "Benchmark001SW":2,"Benchmark002SW":2,"Benchmark003SW":2,
        "Calc001SW":2,"Calc002SW":2,"Calc003SW":2,"Calc004SW":2,"Calc005SW":2,"Calc006SW":2,
        "Calc007SW":2,"Calc008SW":2,"Calc009SW":2,"Calc010SW":2,"Calc011SW":2,"Calc012SW":2,
        "Calc013SW":2,"Calc014SW":2,"Calc015SW":2,"Calc016SW":2,"Calc017SW":2,"Calc018SW":2,
        "Calc019SW":2,"Calc020SW":2,"Calc021SW":2,"Calc022SW":2,"Calc023SW":2,"Calc024SW":2,
        "Calc025SW":2,"Calc026SW":2,"Calc027SW":2,"Calc028SW":2,"Calc029SW":2,"Calc030SW":2,
        "Calc031SW":2,"Calc032SW":2,"Calc033SW":2,"Calc034SW":2,"Calc035SW":2,"Calc036SW":2,
        "Calc037SW":2,"Calc038SW":2,"Calc039SW":2,"Calc040SW":2,"Calc041SW":2,"Calc042SW":2,
        "Calc043SW":2,"Calc044SW":2,
        "maint001SW":2,
        "Milk001SW":2,
        "Patrol001SW":2,"Patrol002SW":2,"Patrol003SW":2,"Patrol004SW":2,"Patrol005SW":2,
        "Service006SW":2,"Service007SW":2,"Service008SW":2,"Service009SW":2,"Service010SW":2,
        "Service011SW":2,"Service012SW":2,"Service013SW":2,"Service014SW":2,"Service015SW":2,
        "Service016SW":2,"Service017SW":2,"Service018SW":2,"Service019SW":2,"Service020SW":2,
        "Service021SW":2,"Service022SW":2,"Service023SW":2,"Service024SW":2,"Service025SW":2,
        "Service026SW":2,
    }

    SUITE_BASE_CASES = ['Base002', 'Base003','Base004', 'Base005', 'Base007', 'Base008', 'Base010', 'Base011', 'Base013',
                        'Base014', 'Base017','Base018',"Base021","Base023","Base025",'Base026',"Base027","Calc044"#'Base016','Base019'
                        ]
    SUITE_AUTOR_CASE = [
        "Calc043"#"Autorepair001","Autorepair002",
    ]

    SUITE_MAINT_CASE = [
        "Maint001"
    ]
    TEST_MAINT_EMAIL = ["Kirry.gao@rnbtech.com.hk"]

    SUITE_BASE_ONLY = ['Base006']
    SUITE_BASE_GUAANGMING = ["Base024","Base028","Base029"]
    SUITE_ALGORITHM_CASES = []
    SUITE_SMART_CASES = []
    SUITE_CALC_CASES_A = []
    SUITE_DATA_CASES = []
    SUITE_CALC_CASES_D = []
    SUITE_CALC_CASES_B = []
    SUITE_CALC_CASES_C = []
    SUITE_SERVICE_CASES = []
    # SUITE_SERVICE_CASES = ['Service002']


    SUITE_PATROL_CASES = []
    SUITE_ASSET_CASES = []
    SUITE_EXPERT_CASES = []
    SUITE_SMOKE_CASES = []
    SUITE_TEMP_CASES = []

    SUITE_BENCHMARK_CASES = []

    SUITE_WORKFLOW_CASES = []  # 'WorkFlow001',,'WorkFlow004','WorkFlow003'

    # memcache address
    MEMCACHE_ADDR = '192.168.1.223:5008'

    # 测试套件
    SUITES = ['suite_data', 'suite_calc', 'suite_smart', 'suite_algorithm', 'suite_base', 'suite_service',
              'suite_patrol', 'suite_expert', 'suite_temp']

    # SUITES = ['suite_smoke']

    ENABLE_MOBILE_MESSAGE = False

    IMAGE_URL = 'http://images.rnbtech.com.hk/static/images'
    OSS_PIC = [

        '/add_new_project.png',
        '/ballsline.gif',
        '/bubbles.png',
        '/bubbles2.png',
        '/bubbles3.png',
        '/cb_checked_yellow.png',
        '/cb_unchecked_white.png',
        '/down.png',
        '/favicon.ico',
        '/file.png',
        '/file_empty.png',
        '/icon_gold.png',
        '/icon_silver.png',
        '/item_checked.png',
        '/loading-dark.gif',
        '/loading-white.gif',
        '/logo_beop.png',
        '/logo_beop_white.png',
        '/logo_white.png',
        '/map_marker_offline.png',
        '/map_marker_online.png',
        '/map_panel-btns.png',
        '/meterpan.png',
        '/meterpointer.png',
        '/pdf_download.png',
        '/plant_icon.png',
        '/projectIcon.png',
        '/projectManager_border.png',
        '/projectManager_shadow.png',
        '/reportRoute.png',
        '/reportType.png',
        '/user_default.jpg',
        '/word_download.png',
        '/analysis/blank.jpg',
        '/analysis/dock_bottom.png',
        '/analysis/dock_bottom_sel.png',
        '/analysis/dock_fill.png',
        '/analysis/dock_fill_sel.png',
        '/analysis/dock_left.png',
        '/analysis/dock_left_sel.png',
        '/analysis/dock_right.png',
        '/analysis/dock_right_sel.png',
        '/analysis/dock_top.png',
        '/analysis/dock_top_sel.png',
        '/analysis/pin.png',
        '/analysis/pin1.png',
        '/analysis/templateImg/templateImg.png',
        '/analysis/templateImg/templateImg_for_dark.png',
        '/analysis/templateImg/template_common.png',
        '/analysis/templateImg/template_common_dark.png',
        '/analysis/templateImg/template_proj.png',
        '/analysis/templateImg/template_proj_dark.png',
        '/audit/audit_balance.svg',
        '/audit/audit_chart.svg',
        '/audit/audit_flash.svg',
        '/audit/audit_lamp.svg',
        '/audit/audit_setting.svg',
        '/avatar/default/1.png',
        '/avatar/default/10.png',
        '/avatar/default/11.png',
        '/avatar/default/12.png',
        '/avatar/default/13.png',
        '/avatar/default/14.png',
        '/avatar/default/15.png',
        '/avatar/default/16.png',
        '/avatar/default/17.png',
        '/avatar/default/18.png',
        '/avatar/default/19.png',
        '/avatar/default/2.png',
        '/avatar/default/20.png',
        '/avatar/default/21.png',
        '/avatar/default/22.png',
        '/avatar/default/23.png',
        '/avatar/default/3.png',
        '/avatar/default/4.png',
        '/avatar/default/5.png',
        '/avatar/default/6.png',
        '/avatar/default/7.png',
        '/avatar/default/8.png',
        '/avatar/default/9.png',
        # '/cbre/login_bg.jpg',
        # '/cbre/login_interval.png',
        # '/cbre/login_logo.png',
        # '/cbre/login_logo_develop.png',
        '/custom/jajl/bg.jpg',
        '/custom/jajl/icon01.png',
        '/custom/jajl/icon02.png',
        '/custom/jajl/icon03.png',
        '/dashboard/htmlModal/coldMachi.png',
        '/dashboard/htmlModal/highLight.png',
        '/dashboard/htmlModal/main.jpg',
        '/dashboard/htmlModal/total.png',
        '/dataSource/filter_icon.png',
        '/dataSource/filter_icon2.png',
        '/dataSource/filter_icon3.png',
        '/dataSource/formula_add_hover.png',
        '/dataSource/formula_add_normal.png',
        '/dataSource/group_head_normal.png',
        '/dataSource/group_head_normal_white.png',
        '/dataSource/group_head_sel.png',
        '/dataSource/group_head_sel_white.png',
        '/dataSource/group_item_del.png',
        '/dataSource/group_item_del_hover.png',
        '/dataSource/item_edit.png',
        '/dataSource/item_edit_hover.png',
        '/diagnosis/ChangiAirport/T1.png',
        '/diagnosis/DemoEnergyPlatform/0.png',
        '/diagnosis/GalaxyMacau/floor.png',
        '/diagnosis/HuarunHK/0.png',
        # '/diagnosisEngine/ball.png',
        # '/diagnosisEngine/recogSpinnerBg.png',
        # '/diagnosisEngine/recogSpinner_color.png',
        # '/diagnosisEngine/recogSpinner_grey.png',
        '/download/icon01.png',
        '/download/icon02.png',
        '/download/icon03.png',
        '/download/icon04.png',
        '/download/light_rep.png',
        '/download/mobile_rep.png',
        '/download/rep.jpg',
        '/download/spr.png',
        '/download/spr_24.png',
        '/error/bg.jpg',
        '/error/chrome.png',
        '/error/cp.png',
        '/factory/factory.jpg',
        '/factory/widget/pop_1.png',
        '/factory/widget/pop_2.png',
        '/home/arrow.png',
        '/home/backData.png',
        '/home/backDataEn.png',
        '/home/computer.png',
        '/home/computer1.png',
        '/home/down.png',
        '/home/down1.png',
        '/home/index_bg.jpg',
        '/home/moon.png',
        '/home/operA.png',
        '/home/operB.png',
        '/home/playData1.jpg',
        '/home/playDataEn1.jpg',
        '/home/proManager.png',
        '/home/proManagerB.png',
        '/home/report.jpg',
        '/home/report01.jpg',
        '/home/report02.jpg',
        '/home/report03.jpg',
        '/home/report04.jpg',
        '/home/reportEn.jpg',
        '/home/reportEn01.jpg',
        '/home/reportEn02.jpg',
        '/home/reportEn03.jpg',
        '/home/reportEn04.jpg',
        '/home/rotateBig.png',
        '/home/rotateSmall.png',
        '/home/sectionF.jpg',
        '/home/sectionTwo.jpg',
        '/home/sectionTwo1.png',
        '/home/sectionTwo2.png',
        '/home/sectionTwo3.png',
        '/home/sectionTwoEn1.png',
        '/home/sectionTwoEn2.png',
        '/home/sectionTwoEn3.png',
        '/home/trackOrder.png',
        '/home/trackOrder1.png',
        '/home/trackOrder2.png',
        '/home/trackOrder3.png',
        '/home/trackOrder4.png',
        '/home/trackOrder5.png',
        '/home/trackOrderEn5.png',
        '/home/whitedot.png',
        '/home/yellowDot.png',
        '/menu/Analysis-dark.svg',
        '/menu/Analysis-default.svg',
        '/menu/Diagnosis-dark.svg',
        '/menu/Diagnosis-default.svg',
        '/menu/DropDownList-dark.svg',
        '/menu/DropDownList-default.svg',
        '/menu/Energy-dark.svg',
        '/menu/Energy-default.svg',
        '/menu/home-dark.svg',
        '/menu/home-default.svg',
        '/menu/Observer-dark.svg',
        '/menu/Observer-default.svg',
        '/menu/Report-dark.svg',
        '/menu/Report-default.svg',
        # '/projectRongXin/rect.png',
        '/project_img/ChangiAirport.jpg',
        '/project_img/dajin.jpg',
        '/project_img/default.jpg',
        '/project_img/default_150407.png',
        '/project_img/GalaxyMacau.jpg',
        '/project_img/gubei.jpg',
        '/project_img/hddianwang.jpg',
        '/project_img/hongli.jpg',
        '/project_img/hsimc.jpg',
        '/project_img/huahong.jpg',
        '/project_img/HuarunHK.jpg',
        '/project_img/HuaweiPlant.jpg',
        '/project_img/huidefeng.jpg',
        '/project_img/kmbusiness.jpg',
        '/project_img/kmstore.jpg',
        '/project_img/kmwd.jpg',
        '/project_img/lijunbj.jpg',
        '/project_img/panda.jpg',
        '/project_img/qdwdbusines.jpg',
        '/project_img/qdwdstore.jpg',
        '/project_img/qiyetiandi.jpg',
        '/project_img/report.png',
        '/project_img/SAIC_DLZC.jpg',
        '/project_img/wdzzbh.jpg',
        '/project_img/wdzzsy.jpg',
        '/project_img/zhognquplaza.jpg',
        '/project_img/zhonghuan.jpg',
        '/project_img/zhongxin1qi.jpg',
        '/project_img/zhongxin2qi.jpg',
        '/proj_model/model1.png',
        '/proj_model/model2.png',
        '/spring/entities/modalCarbonFootprint.jpg',
        '/spring/entities/modalCo2SaveTotal.png',
        '/spring/entities/modalCoalSaveTotal.png',
        '/spring/entities/modalEnergySaveRate.png',
        '/workflow/emptyActivitys.gif',
        '/workflow/ic0.png',
        '/workflow/ic1.png',
        '/workflow/ic2.png',
        '/workflow/ic3.png',
        '/workflow/processNext.png',
        '/workflow/processNexts.png',
        '/workflow/scenery-0.png',
        '/workflow/scenery-1.png',
        '/workflow/scenery-2.png',
        '/workflow/scenery-3.png',
        '/workflow/scenery-4.png',
        '/workflow/scenery-5.png',
        '/workflow/scenery-6.png',
        '/workflow/wf-complete.png',
        '/workflow/wf-verified.png',
        '/wx/nextday.png',
        '/wx/prevday.png',
        '/wx/wxdailyreporttitle.jpg',
        '/ztree/line_conn.gif',
        '/ztree/loading.gif',
        '/ztree/zTreeStandard.gif',
        '/ztree/zTreeStandard.png',
        '/ztree/diy/1_close.png',
        '/ztree/diy/1_open.png',
        '/ztree/diy/2.png',
        '/ztree/diy/3.png',
        '/ztree/diy/4.png',
        '/ztree/diy/5.png',
        '/ztree/diy/6.png',
        '/ztree/diy/7.png',
        '/ztree/diy/8.png',
        '/ztree/diy/9.png'
    ]

    CHECK_PROJECT = [(72, '上海华为'), (203, '天津武清商务区赛达广场'), (200, '天津团泊农业示范园'), (201, '天津光合谷'),
                     (5, '梅赛德斯奔驰文化中心'), (100, '高露洁'), (90, '顺风光电1号'), (102, '杭州妇产医院'),
                     (80, '世纪商贸'), (179, 'Goodman嘉民'),  (19, '上汽工业'), (364, '某办公楼'),
                     (284, '上实大厦'), (126, '国家会展中心'),  (376, '青山湖'),  (373, '中电熊猫云平台'),
                      (18, '香港华润'), (281, '西克裕灌'),
                     (76, '中文演示06'), (175, '演示09'), (128, '苏州天弘科技有限公司'), (281, '西克裕灌'), (393, '人民广场来福士'),
                     (373, '中电熊猫云平台'),(396, '开能'), (190, '新濠天地'), (15, '华东电网调度中心大楼'),(318, '金钟广场'),(194, '上海印钞厂'), #, (303, '荣信钢铁高压变频'),(28, '中区广场'), (374, '和黄药业'),(83, '成都时代8号'),(421, 'Greenslopes'),(293,'liverpoolst'), (395, '皇家艾美'),(316, '企业天地3号楼'), (186, '上海华滋奔腾'),
                     ]

    VIP_PROJECTS = [
        (72, '上海华为', 'beopdata_shhuawei', 'beopdata_shhuawei'),
        (17, '深圳华为', 'beopdata_huawei45678', 'beopdata_huawei45678'),
        (82, '深圳华为G区', 'beopdata_huaweig1234', 'beopdata_huaweig1234'),
        (80, '世纪商贸', 'beopdata_sismbms01', 'beopdata_sismbms01'),
        (18, '香港华润', 'beopdata_hkhuarun', 'beopdata_hkhuarun'),
        (94, '玉兰大剧院', 'beopdata_dgyulan1234', 'beopdata_dgyulan1234'),
        (100, '扬州高露洁', 'beopdata_yzgaolujie1', 'beopdata_yzgaolujie1'),
        (19, '上汽工业', 'beopdata_sq123456789', 'beopdata_sq123456789'),
        (81, '成都时代1号', 'beopdata_chengdutms1', 'beopdata_chengdutms1'),
        (102, '杭州妇产科医院', 'beopdata_hzfckyy_yjl', 'beopdata_hzfckyy_yjl'),
        (179, '嘉民', 'beopdata_hongkong_go', 'beopdata_hongkong_go'),
        (194, '上海印钞厂', 'beopdata_shycc123456', 'beopdata_shycc123456'),
        (126, '国家会展中心', 'beopdata_guozhanhuiz', 'beopdata_guozhanhuiz'),
        (200, '天津团泊现代农业园地', 'beopdata_tuanbo', 'beopdata_tuanbo'),
        (201, '天津光合谷温泉度假区', 'beopdata_jjjjjjjjjjjjj', 'beopdata_jjjjjjjjjjjjj'),
        (203, '天津武清商务区国际企业区', 'beopdata_tianjinswq1', 'beopdata_tianjinswq1'),
        (293, 'Liverpoolst', 'beopdata_qantas', 'beopdata_qantas')

    ]


class DevelopmentConfig(BaseConfig):
    def initEmail(self, USERNAME):
        # 自动化测试报告收件人邮箱
        self.PUBLIC_EMAILS = [USERNAME]
        # 测试组邮箱
        self.TEST_GROUP_EMAILS = [USERNAME]
        # 智能传感收件人
        self.SMART_EMAILS = [USERNAME]
        # 算法测试用例收件人
        self.ALGORITHM_EMAILS = [USERNAME]
        # service用例出错收件人
        self.SERVICE_ERROR_EMAILS = [USERNAME]
        # 项目掉线收件人
        self.PROJECT_EMAILS = [USERNAME]
        # 点计算测试集收件人
        self.CALC_TEST_EMAILS = [USERNAME]
        # 基础测试集收件人
        self.BASE_TEST_EMAILS = [USERNAME]
        # 产品组
        self.PRODUCTION_EMAILS = [USERNAME]
        # 后台组
        self.BACKEND_EMAILS = [USERNAME]
        # 巡更邮件组
        self.PATROL_EMAILS = [USERNAME]
        # 资产管理
        self.ASSET_EMAILS = [USERNAME]
        # Container收件人
        self.CONTAINER_EMAILS = [USERNAME]
        # smoke测试集收件人
        self.SMOKE_EMAILS = [USERNAME]
        # temp收件人
        self.TEMP_EMAILS = [USERNAME]
        # benchamark收件人
        self.BENCHMARK_EMAILS = [USERNAME]
        # 工单测试集收件人
        self.WORKFLOW_EMAILS = [USERNAME]

    # all email list set to yourself
    ENABLE_MOBILE_MESSAGE = True


#


# 赵庆凯配置
class sophiaConfig(DevelopmentConfig):
    def __init__(self):
        self.initEmail("sophia.zhao@rnbtech.com.hk")




# 陈婷婷配置
class angeliaConfig(DevelopmentConfig):
    def __init__(self):
        self.initEmail("angelia.chen@rnbtech.com.hk")


# woody小号配置
class tester1Config(DevelopmentConfig):
    def __init__(self):
        self.initEmail("619434176@qq.com")


# woody小号2配置
class tester2Config(DevelopmentConfig):
    def __init__(self):
        self.initEmail("1613687333@qq.com")


# sophia小号配置
class tester3Config(DevelopmentConfig):
    def __init__(self):
        self.initEmail('sophia201552@163.com')


# 顾博
class goldingConfig(DevelopmentConfig):
    def __init__(self):
        self.initEmail('12343403@qq.com')


class ProductionConfig(DevelopmentConfig):
    ENABLE_MOBILE_MESSAGE = True
#kirry配置
class kirrysConfig(DevelopmentConfig):
    def __init__(self):
        self.initEmail('Kirry.gao@rnbtech.com.hk')

# 配置集
user_conf = {
    'BaseConfig': kirrysConfig(),
    'development_sophia': sophiaConfig(),
    'development_angelia': angeliaConfig(),
    'development_tester1': tester1Config(),
    'development_tester2': tester2Config(),
    'development_tester3': tester3Config(),
    'development_golding': goldingConfig(),
    'production': ProductionConfig(),
   'development_kirrys': kirrysConfig(),
    'default': DevelopmentConfig()
}
