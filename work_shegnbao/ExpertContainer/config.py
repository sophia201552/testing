﻿__author__ = 'golding'


class Config:
    LOGGER = 'debug'

    USERNAME = 'expert'
    PASSWORD = 'RNBbeop2013'
    HOST = 'rds6cde6w8oeo390pw8io.mysql.rds.aliyuncs.com'
    DB_POOL_NAME = 'ContainerDBPool'
    INIT_CONNECTIONS_POOL = 2

    MYSQL_SERVER_READ_USERNAME = 'expert'
    MYSQL_SERVER_READ_PASSWORD = 'RNBbeop2013'
    MYSQL_SERVER_READ = 'rds8961fe732pz9uw7jso.mysql.rds.aliyuncs.com'
    MYSQL_SERVER_READ_POOLNAME = 'ContainerDBPoolReadOnly'
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 2

    USE_ALI_PUBLIC = True

    DATABASE = 'beopdoengine'
    DATABASE_BUFFER = 'beopdatabuffer'

    MAX_REPAIRHISTORY_THREAD_NUM = 1
    POST_HEADER = {'content-type': 'application/json', 'algorithm': 'rnbtech2015'}

    RECIPIENTS_LIST = ['golding.gu@rnbtech.com.hk']

    # CONFIG_MONGO_ADDR = '120.55.113.116'
    # CONFIG_MONGO_PORT = 27018
    CONFIG_MONGO_ADDR = '101.37.90.188'
    CONFIG_MONGO_PORT = 27020
    MONGO_HEARTBEAT_REQUIRED = False
    MONGO_HEARTBEAT_INTERVAL = 180
    MONGO_CONFIG_REPLICA_SET = None
    MONGO_CONFIG_READ_PREFERENCE = None

    # INTERNAL_CONFIG_ADDR = '10.168.154.6:27018'
    # INTERNET_CONFIG_ADDR = '120.55.113.116:27018'
    INTERNAL_CONFIG_ADDR = '10.30.202.244:27020'
    INTERNET_CONFIG_ADDR = '101.37.90.188:27020'

    ERRORLOG_MONGO_ADDR = '120.26.121.79'
    ERRORLOG_MONGO_PORT = 27018

    MEMCACHE_KEY_PROJECT_LIST = 'projectInfoList'
    MEMCACHE_KEY_PREFIX = 'expert'

    # 这里替换为连接的实例host和port
    REDIS_HOST = '10.171.218.113'
    REDIS_PORT = 6379
    # 这里替换为实例id和实例password
    REDIS_PWD = '4280d8fd8087452e:RNBbeop2013'

    SYS_USER = 'projecttest@rnbtech.com.hk'
    SYS_PASSWORD = 'Rnbtech1103'

    REPAIR_DATA_KEY_NAME = 'repair_data'
    BEOPWEB_ADDR = 'beop.rnbtech.com.hk'

    MQ_RECEIVE_TRIGGER_NAME = 'calculationTrigger0'
    MQ_RECEIVE_FORCE_NAME = 'ForceCalculation'
    MQ_RECEIVE_PATCH_NAME = 'CalculationPatch0'
    MQ_RECEIVE_PATCH_BY_SYS_NAME = 'CalculationPatchBySys0'
    MQ_RECEIVE_DIAGNOSIS_NAME = 'triggerDiagnosis0'
    MQ_RECEIVE_ALARM_NAME = 'AlarmDataQueue0'
    MQ_RECEIVE_EXPORT_HISTORY_DATA = 'ExportHistoryData'
    MQ_RECEIVE_AUTO_REPAIR_NAME = 'CalculationAutoRepair'
    MQ_RECEIVE_TAKENAKA_ROUTE = 'mqtt-takenaka-data'
    MQ_MYSQL_CROSS_CLUSTER_WRITE = 'MySqlCrossClusterWrite'
    MQ_ALGO_CROSS_CLUSTER_NOTICE = 'AlgoCrossClusterNotice'

    MQ_ADDRESS = '120.26.63.126'
    BEOP_SERVER_ADDR = '121.41.30.108'
    MQ_USERNAME = 'beopweb'
    MQ_PASSWORD = 'RNB.beop-2013'

    LOGGING_LEVEL = 0
    M5FORMAT = 'm5_data_'
    V2FORMAT = 'v2_data_'
    AUTO_REPAIR_MAX_PROCESS_NUM = 6
    REPAIR_DIVIDE = 2
    WEATHER_DB_IP = '101.37.90.188:27018'

    # ALGOSVC1_ADDRESS = '114.55.252.126:5111'
    ALGOSVC2_ADDRESS = '121.40.140.32:5111'
    # ALGOSVC3_ADDRESS = '121.40.140.32:5123'

    ONLINE_TEST_ADDRESS = '121.40.197.63:9001'

    MYSQL_GLOBAL_WRITE = dict(
        aliyun_cn=dict(HOST='rds6cde6w8oeo390pw8io.mysql.rds.aliyuncs.com', USERNAME='beopweb', PASSWORD='rnbtechrd'),
        azure_cn=dict(HOST='datam.mysqldb.chinacloudapi.cn', USERNAME='datam%beopweb', PASSWORD='Rnbtech1103'),
        azure_us=dict(HOST='52.168.75.2', USERNAME='root', PASSWORD='RNB.beop-2013')
    )

    IS_DEV_ENV = False
    CROSS_CLUSTER_REQ_DESIGNATION = True

    EXPERT_CONTAINER_URL = dict(
        aliyun_cn='121.41.28.69:4000',
        azure_cn='42.159.234.15:4000',
        azure_us='40.71.228.119:4000')

    BEOPWEB_HTTPAPI_USERNAME = 'woody.wu@rnbtech.com.hk'
    BEOPWEB_HTTPAPI_PASSWORD = 'wuranxu312'
    BEOPWEB_SECRET_TOKEN = 'eyJhbGciOiJIUzI1NiIsImV4cCI6MT'

    GLOBALIZATION = {
        'AU': {
            'logoFileName': 'logo_adopt.png',
            'tradeMark': 'AdOPT',
            'mailSender': ("AdOPT Service", "adopt.cloud@rnbtech.com.hk"),
            'domainName': "industrytech.smartbeop.com"
        },
        'WW': {
            'logoFileName': 'logo_beop.png',
            'tradeMark': 'BeOP',
            'mailSender': ("BeOP Service", "beop.cloud@rnbtech.com.hk"),
            'domainName': 'beop.rnbtech.com.hk'
        }
    }


class DevelopmentConfig(Config):
    LOGGING_LEVEL = 0
    HOST = 'rds6cde6w8oeo390pw8io.mysql.rds.aliyuncs.com'
    MQ_ADDRESS = '120.26.63.126'

    # CONFIG_MONGO_ADDR = '120.55.113.116'
    CONFIG_MONGO_ADDR = '101.37.90.188'

    # INTERNAL_CONFIG_ADDR = '10.168.154.6:27018'
    # INTERNET_CONFIG_ADDR = '120.55.113.116:27018'
    INTERNAL_CONFIG_ADDR = '10.30.202.244:27020'
    INTERNET_CONFIG_ADDR = '101.37.90.188:27020'

    INIT_CONNECTIONS_POOL = None
    MYSQL_SERVER_READ = 'rds8961fe732pz9uw7jso.mysql.rds.aliyuncs.com'
    MYSQL_SERVER_READ_CONNECTIONS_POOL = None
    USE_ALI_PUBLIC = True
    BEOP_SERVER_ADDR = '121.41.30.108'

    REDIS_HOST = 'beopdemo.rnbtech.com.hk'
    REDIS_PORT = 6379
    # 这里替换为实例id和实例password
    REDIS_PWD = 'beopweb:rnbtechrd'

    MONGO_CONFIG_REPLICA_SET = 'rsconfig'
    MONGO_CONFIG_READ_PREFERENCE = 'nearest'

    IS_DEV_ENV = True

class ProductionConfig(Config):
    LOGGER = 'prod'
    LOGGING_LEVEL = 2
    HOST = 'rds6cde6w8oeo390pw8i.mysql.rds.aliyuncs.com'
    USERNAME = 'expert'
    PASSWORD = 'RNBbeop2013'

    # CONFIG_MONGO_ADDR = '10.168.154.6'
    CONFIG_MONGO_ADDR = '10.30.202.244'
    CONFIG_MONGO_PORT = 27020

    # INTERNAL_CONFIG_ADDR = '10.168.154.6:27018'
    # INTERNET_CONFIG_ADDR = '120.55.113.116:27018'
    INTERNAL_CONFIG_ADDR = '10.30.202.244:27020'
    INTERNET_CONFIG_ADDR = '101.37.90.188:27020'

    ERRORLOG_MONGO_ADDR = '10.51.27.31'
    MYSQL_SERVER_READ_USERNAME = 'expert'
    MYSQL_SERVER_READ_PASSWORD = 'RNBbeop2013'
    MYSQL_SERVER_READ = 'rds8961fe732pz9uw7js.mysql.rds.aliyuncs.com'
    USE_ALI_PUBLIC = False
    MQ_ADDRESS = '10.175.203.4'
    BEOP_SERVER_ADDR = '10.168.177.189'
    WEATHER_DB_IP = '10.30.202.244:27018'


class TestingConfig(Config):
    USERNAME = 'root'
    PASSWORD = 'rnbtechrd'
    INIT_CONNECTIONS_POOL = None
    HOST = '192.168.1.222'
    DB_POOL_NAME = 'ContainerDBPool'

    MYSQL_SERVER_READ = '192.168.1.222'
    MYSQL_SERVER_READ_USERNAME = 'root'
    MYSQL_SERVER_READ_PASSWORD = 'rnbtechrd'
    MYSQL_SERVER_READ_CONNECTIONS_POOL = None
    MYSQL_SERVER_READ_POOLNAME = 'ContainerDBPoolReadOnly'

    USE_ALI_PUBLIC = False  # 为true的话，使用外网的地址，否则使用内网地址

    DATABASE = 'beopdoengine'
    DATABASE_BUFFER = 'beopdatabuffer'

    MAX_REPAIRHISTORY_THREAD_NUM = 1
    POST_HEADER = {'content-type': 'application/json', 'algorithm': 'rnbtech2015'}

    RECIPIENTS_LIST = ['golding.gu@rnbtech.com.hk']

    CONFIG_MONGO_ADDR = '192.168.1.222'
    CONFIG_MONGO_PORT = 27017
    MONGO_HEARTBEAT_REQUIRED = False
    MONGO_HEARTBEAT_INTERVAL = 180

    INTERNAL_CONFIG_ADDR = '192.168.1.222:27017'
    INTERNET_CONFIG_ADDR = '192.168.1.222:27017'

    ERRORLOG_MONGO_ADDR = '192.168.1.222'
    ERRORLOG_MONGO_PORT = 27017

    MEMCACHE_KEY_PROJECT_LIST = 'projectInfoList'
    MEMCACHE_KEY_PREFIX = 'expert'

    # 这里替换为连接的实例host和port
    REDIS_HOST = '192.168.1.222'
    REDIS_PORT = 6379
    # 这里替换为实例id和实例password
    REDIS_PWD = 'beopweb:rnbtechrd'
    # 这里替换为连接的实例host和port

    SYS_USER = 'projecttest@rnbtech.com.hk'
    SYS_PASSWORD = 'Rnbtech1103'

    REPAIR_DATA_KEY_NAME = 'repair_data'
    BEOPWEB_ADDR = '192.168.1.221:1080'

    MQ_RECEIVE_TRIGGER_NAME = 'calculationTrigger0'
    MQ_RECEIVE_FORCE_NAME = 'ForceCalculation'
    MQ_RECEIVE_PATCH_NAME = 'CalculationPatch0'
    MQ_RECEIVE_PATCH_BY_SYS_NAME = 'CalculationPatchBySys0'
    MQ_RECEIVE_DIAGNOSIS_NAME = 'triggerDiagnosis0'
    MQ_RECEIVE_ALARM_NAME = 'AlarmDataQueue0'
    MQ_RECEIVE_EXPORT_HISTORY_DATA = 'ExportHistoryData'
    MQ_RECEIVE_AUTO_REPAIR_NAME = 'CalculationAutoRepair'
    MQ_ADDRESS = '192.168.1.222'
    BEOP_SERVER_ADDR = '192.168.1.221:5009'
    MQ_USERNAME = 'beopweb'
    MQ_PASSWORD = 'RNB.beop-2013'

    LOGGING_LEVEL = 0
    M5FORMAT = 'm5_data_'
    V2FORMAT = 'v2_data_'
    AUTO_REPAIR_MAX_PROCESS_NUM = 6
    WEATHER_DB_IP = '192.168.1.222:27107'

    IS_DEV_ENV = True


class StandbyConfig(Config):
    LOGGING_LEVEL = 2
    USERNAME = 'root'
    PASSWORD = 'RNB.beop-2013'
    HOST = '10.174.142.0'
    INIT_CONNECTIONS_POOL = 2

    SYS_USER = 'projecttest'
    SYS_PASSWORD = 'Rnbtech1103'
    MYSQL_SERVER_READ_USERNAME = 'root'
    MYSQL_SERVER_READ_PASSWORD = 'RNB.beop-2013'
    MYSQL_SERVER_READ = '10.174.142.0'
    MYSQL_SERVER_READ_POOLNAME = 'ContainerDBPoolReadOnly'
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 5

    REDIS_HOST = '4280d8fd8087452e.redis.rds.aliyuncs.com'

    BEOPWEB_ADDR = '10.174.142.0'

    MQ_ADDRESS = '10.47.192.139'

    CONFIG_MONGO_ADDR = '10.51.5.163'
    CONFIG_MONGO_PORT = 37018

    INTERNAL_CONFIG_ADDR = '10.168.154.6:27018'
    INTERNET_CONFIG_ADDR = '120.55.113.116:27018'

    USE_ALI_PUBLIC = False
    RECIPIENTS_LIST = ['golding.gu@rnbtech.com.hk']

    BEOP_SERVER_ADDR = '10.24.150.106:5000'
    MEMCACHE_KEY_PREFIX = 'standby'


class StandbyPublicConfig(Config):
    LOGGING_LEVEL = 2
    USERNAME = 'root'
    PASSWORD = 'RNB.beop-2013'
    HOST = '139.196.7.223'
    INIT_CONNECTIONS_POOL = 2

    SYS_USER = 'projecttest'
    SYS_PASSWORD = 'Rnbtech1103'
    MYSQL_SERVER_READ_USERNAME = 'root'
    MYSQL_SERVER_READ_PASSWORD = 'RNB.beop-2013'
    MYSQL_SERVER_READ = '139.196.7.223'
    MYSQL_SERVER_READ_POOLNAME = 'ContainerDBPoolReadOnly'
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 5

    REDIS_HOST = '4280d8fd8087452e.redis.rds.aliyuncs.com'

    BEOPWEB_ADDR = '139.196.7.223'

    MQ_ADDRESS = '139.224.46.62'

    CONFIG_MONGO_ADDR = '120.26.132.207'
    CONFIG_MONGO_PORT = 37018

    INTERNAL_CONFIG_ADDR = '10.168.154.6:27018'
    INTERNET_CONFIG_ADDR = '120.55.113.116:27018'

    ERRORLOG_MONGO_ADDR = '59.110.61.171'
    ERRORLOG_MONGO_PORT = 27018

    USE_ALI_PUBLIC = True
    RECIPIENTS_LIST = ['golding.gu@rnbtech.com.hk']

    BEOP_SERVER_ADDR = '139.196.243.32:5000'
    MEMCACHE_KEY_PREFIX = 'standby'


class Azure(Config):
    LOGGER = 'prod'
    LOGGING_LEVEL = 2

    HOST = 'datam.mysqldb.chinacloudapi.cn'
    USERNAME = 'datam%expert'
    PASSWORD = 'Rnbtech1103'
    INIT_CONNECTIONS_POOL = None

    MYSQL_SERVER_READ = 'datamslave.mysqldb.chinacloudapi.cn'
    MYSQL_SERVER_READ_USERNAME = 'datamslave%expert'
    MYSQL_SERVER_READ_PASSWORD = 'Rnbtech1103'
    MYSQL_SERVER_READ_CONNECTIONS_POOL = None

    # CONFIG_MONGO_ADDR = '120.55.113.116'
    # CONFIG_MONGO_PORT = 27018
    CONFIG_MONGO_ADDR = '101.37.90.188'
    CONFIG_MONGO_PORT = 27020
    MONGO_HEARTBEAT_REQUIRED = True
    MONGO_CONFIG_REPLICA_SET = 'rsconfig'
    MONGO_CONFIG_READ_PREFERENCE = 'nearest'

    # INTERNAL_CONFIG_ADDR = '10.168.154.6:27018'
    # INTERNET_CONFIG_ADDR = '120.55.113.116:27018'
    INTERNAL_CONFIG_ADDR = '101.37.90.188:27020'
    INTERNET_CONFIG_ADDR = '101.37.90.188:27020'

    ERRORLOG_MONGO_ADDR = '120.26.121.79'
    ERRORLOG_MONGO_PORT = 27018

    USE_ALI_PUBLIC = True
    MQ_ADDRESS = '10.0.0.8'
    BEOP_SERVER_ADDR = '10.0.0.6:5009'
    WEATHER_DB_IP = '101.37.90.188:27018'
    REDIS_HOST = 'rnbtech.redis.cache.chinacloudapi.cn'
    REDIS_PORT = 6379
    # 这里替换为实例id和实例password
    REDIS_PWD = 'Ny/HnFe7nBUR18t+aeatzbOEQJMX1skGB//Rns2aw6o='

    BEOPWEB_ADDR = '10.0.0.13'


class AzureUS(Config):
    LOGGER = 'prod'
    LOGGING_LEVEL = 2

    HOST = '10.0.0.13'
    USERNAME = 'root'
    PASSWORD = 'RNB.beop-2013'
    INIT_CONNECTIONS_POOL = None

    MYSQL_SERVER_READ = '10.0.0.12'
    MYSQL_SERVER_READ_USERNAME = 'root'
    MYSQL_SERVER_READ_PASSWORD = 'RNB.beop-2013'
    MYSQL_SERVER_READ_CONNECTIONS_POOL = None

    # CONFIG_MONGO_ADDR = '120.55.113.116'
    # CONFIG_MONGO_PORT = 27018
    CONFIG_MONGO_ADDR = '101.37.90.188:27020'
    CONFIG_MONGO_PORT = 27020
    MONGO_HEARTBEAT_REQUIRED = False
    MONGO_CONFIG_REPLICA_SET = 'rsconfig'
    MONGO_CONFIG_READ_PREFERENCE = 'nearest'

    # INTERNAL_CONFIG_ADDR = '120.55.113.116:27018'
    # INTERNET_CONFIG_ADDR = '120.55.113.116:27018'
    INTERNAL_CONFIG_ADDR = '101.37.90.188:27020'
    INTERNET_CONFIG_ADDR = '101.37.90.188:27020'

    # 不使用errorlog
    ERRORLOG_MONGO_ADDR = '120.26.121.79'
    ERRORLOG_MONGO_PORT = 27018

    USE_ALI_PUBLIC = True
    MQ_ADDRESS = '10.0.0.14'
    BEOP_SERVER_ADDR = '10.0.0.7:5009'
    WEATHER_DB_IP = '10.0.0.11:27019'
    REDIS_HOST = 'usredis.redis.cache.windows.net'
    REDIS_PORT = 6379
    # 这里替换为实例id和实例password
    REDIS_PWD = 'X+0rTyQymbjT7G26/mQzXj3PZvrUkYB73oagFnHnFfs='

    BEOPWEB_ADDR = '10.0.0.6'
    REPAIR_DIVIDE = 1


config = {
    'development': DevelopmentConfig(),
    'aliyun_cn': ProductionConfig(),
    'default': DevelopmentConfig(),
    'test': TestingConfig(),
    'standbypublic': StandbyPublicConfig(),
    'standby': StandbyConfig(),
    'azure_cn': Azure(),
    'azure_us': AzureUS()
}