import copy


class Config:
    LOGGER = 'debug'
    BEOP_PHONE = '(+86)021-60129688'
    USERNAME = 'devfront'
    PASSWORD = 'Rnbtech1103'
    INIT_CONNECTIONS_POOL = 5
    HOST = 'rds6cde6w8oeo390pw8io.mysql.rds.aliyuncs.com'
    MYSQL_SERVER_READ = 'rr-bp1qro1e54e4h3be0o.mysql.rds.aliyuncs.com'
    MYSQL_SERVER_READ_USERNAME = 'devfront'
    MYSQL_SERVER_READ_PASSWORD = 'Rnbtech1103'
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 5
    MYSQL_SERVER_READ_POOLNAME = 'BEOPDBReadOnlyPool'
    MYSQL_GMRY_HOST = '118.178.93.236'
    MYSQL_GMRY_PORT = 3306
    MYSQL_GMRY_USERNAME = 'root'
    MYSQL_GMRY_PASSWORD = 'RNBtech1103'
    MYSQL_GMRY_POOL_NAME = None
    MYSQL_GMRY_POOL_SIZE = None

    DATABASE = 'beopdoengine'
    PROJECT_DATABASE = 'beopdata'
    WORKFLOW_DATABASE = 'workflow'
    TABLE_OP = 'operation_record'
    DB_POOL_NAME = 'BEOPDBPool'
    MAIL_SERVER = 'smtp.rnbtech.com.hk'
    MAIL_USERNAME = 'beop.cloud@rnbtech.com.hk'
    MAIL_PASSWORD = 'beop123456'
    MAIL_DEFAULT_SENDER = ("BeOP Service", "beop.cloud@rnbtech.com.hk")
    MAIL_DEBUG = 0
    MAIL_TASK_POST_HEADER = {'content-type': 'application/json', 'algorithm': 'rnbtech2015'}
    FTP_PATH = 'd:/FTP/beopsoft-release'
    S3DB_DIR_CLOUD = 's3db/'
    DLL_CONFIG_PATH = 'beopWeb/lib/config'

    GZIP_ENABLE = True
    SITE_DOMAIN = 'beop.rnbtech.com.hk'  # 用于邮件中的链接等地方,如果部署在其他域名下请覆盖此配置

    ASSETS_JS_FILTER = 'rjsmin'
    ASSETS_CSS_FILTER = 'cssmin'

    DLLSERVER_ADDRESS = 'https://beopservice.beopsmart.com'
    BEOP_SERVICE_ADDRESS = 'https://beopservice.beopsmart.com'
    ASSETS_DEBUG = False
    ASSETS_PACKING = False
    USE_ALI_PUBLIC = False  # 为true的话，使用外网的地址，否则使用内网地址
    URL_CHECK = True  # 是否启动url的token校验
    CROSS_CLUSTER_REQ_DESIGNATION = False  # 是否启用跨集群请求调度
    CROSS_CLUSTER_REDIRECT = False  # 是否启用跨集群客户端重定向`
    MYSQL_GLOBAL_WRITE_ENABLED = False  # 是否启用跨集群数据库写入
    MYSQL_GLOBAL_WRITE = dict(
        aliyun_cn=dict(HOST='rds6cde6w8oeo390pw8io.mysql.rds.aliyuncs.com', USERNAME='beopweb', PASSWORD='rnbtechrd'),
        azure_cn=dict(HOST='datam.mysqldb.chinacloudapi.cn', USERNAME='datam%beopweb', PASSWORD='Rnbtech1103'),
        azure_us=dict(HOST='52.168.75.2', USERNAME='root', PASSWORD='RNB.beop-2013')
    )

    TOKEN_EXPIRATION = 10800  # 3小时： 60 * 60 * 3
    TOKEN_WHITE_LIST = ['eyJhbGciOiJIUzI1NiIsImV4cCI6MT']  # 无需tonken验证
    MEMCACHE_HOSTLIST = ['beopdemo.rnbtech.com.hk:11211']
    OS_TYPE = 0,

    MONGO_USERNAME = 'beopweb'
    MONGO_PASSWORD = 'RNB.beop-2013'
    # INTERNAL_CONFIG_ADDR = '10.168.154.6:27018'
    INTERNAL_CONFIG_ADDR = '10.30.202.244:27020'
    INTERNET_CONFIG_ADDR = '101.37.90.188:27020'
    MONGO_CONFIG_REPLICA_SET = None
    MONGO_CONFIG_READ_PREFERENCE = None
    MONGO_USE_ONLINE = False
    # 是否保持MongoDB连接的heartbeat，此设置为Azure云特别设置，非Azure云部署请保持False
    MONGO_HEARTBEAT_REQUIRED = False
    MONGO_HEARTBEAT_INTERVAL = 180

    TEMPERATURE_APP_SERVICE_ADDRESS = 'http://47.97.9.47:5123'  # 温控策略接口
    EXPERT_CONTAINER_URL = 'http://121.41.28.69/'  # 算法容器接口
    DIAGNOSIS_ENGINE_ADDRESS = 'http://114.55.252.126:5101'  # 算法容器接口
    ALGOSVC1_ADDRESS = 'http://121.40.140.32:5111'  # benchmark
    ALGOSVC2_ADDRESS = 'http://121.40.140.32:5111'  # diagnosis
    ALGOSVC3_ADDRESS = 'http://47.97.9.47:5123'  # strategy
    VERSION = 'build'

    MEMCACHE_KEY_PREFIX = 'expert'
    # 这里替换为连接的实例host和port
    REDIS_HOST = '192.168.1.208'
    REDIS_PORT = 6379
    # 这里替换为实例id和实例password
    REDIS_PWD = 'beopweb:rnbtechrd'

    # websocket secret key
    SECRET_KEY = 'beopweb-websocket'
    WEATHER_DB_IP = '101.37.90.188:27018'

    # IP归属地查询
    # 0：禁用，1：淘宝，2：新浪，3：IP-API
    IP_QUERY_TYPE = 1

    IS_DEV_CONFIG = False
    BEOPCLUSTER_ALIAS = None

    GLOBALIZATION = {
        'AU': {
            'logoFileName': 'logo_adopt.png',
            'tradeMark': 'AdOPT',
            'mailSender': ("AdOPT Service", "adopt.cloud@rnbtech.com.hk"),
            'domainName': "industrytech.rnbadopt.com"
        },
        'WW': {
            'logoFileName': 'logo_beop.png',
            'tradeMark': 'BeOP',
            'mailSender': ("BeOP Service", "beop.cloud@rnbtech.com.hk"),
            'domainName': 'beop.rnbtech.com.hk'
        }
    }
    COUNTRY_DEFAULT_LANGUAGE = {
        "WW": 'zh',
        "CN": "zh",
        'AU': 'en',
        'FR': 'en',
        'JP': 'en',
        'US': 'en'
    }

    BEOP_SERVER_TIMEZONE = 8

    PROJ_PROPS_META = {
        'mobileSupported': {'isSystemProp': True},
        'diagnosisPrediction': {'isSystemProp': True},
        'defaultLanguage': {'isSystemProp': True},
        'healthConfig': {'isSystemProp': True}
    }

    BEOPWEB_ADDR_LIST = ["http://cn1.smartbeop.com",'http://cn2.smartbeop.com',"http://us2.smartbeop.com"]


class TestConfig(Config):
    USERNAME = 'root'
    PASSWORD = 'rnbtechrd'
    INIT_CONNECTIONS_POOL = None
    HOST = '192.168.1.222'
    MYSQL_SERVER_READ = '192.168.1.222'
    MYSQL_SERVER_READ_USERNAME = 'root'
    MYSQL_SERVER_READ_PASSWORD = 'rnbtechrd'
    MYSQL_SERVER_READ_CONNECTIONS_POOL = None
    MYSQL_SERVER_READ_POOLNAME = 'BEOPDBReadOnlyPool'
    DLLSERVER_ADDRESS = '192.168.1.221:3080'

    MEMCACHE_HOSTLIST = ['10.252.166.76:11211']
    OS_TYPE = 1
    ASSETS_DEBUG = True
    VERSION = 'Release20160728'

    MONGO_USE_ONLINE = True
    INTERNET_CONFIG_ADDR = '192.168.1.222:27017'
    INTERNAL_CONFIG_ADDR = '192.168.1.222:27017'
    MONGO_SERVER_HOST = '192.168.1.222:27017'
    MONGO_USERNAME = 'beopweb'
    MONGO_PASSWORD = 'RNB.beop-2013'

    # 目前跨集群读数据有连接池问题，暂时先关闭
    CROSS_CLUSTER_REQ_DESIGNATION = False
    CROSS_CLUSTER_REDIRECT = False
    MYSQL_GLOBAL_WRITE_ENABLED = False

    MEMCACHE_KEY_PREFIX = 'expert'
    # 这里替换为连接的实例host和port
    REDIS_HOST = '192.168.1.222'
    REDIS_PORT = 6379
    # 这里替换为实例id和实例password
    REDIS_PWD = 'beopweb:rnbtechrd'
    WEATHER_DB_IP = '101.37.90.188:27018'

    BEOP_SERVICE_ADDRESS = 'http://192.168.1.221:5009'
    EXPERT_CONTAINER_URL = 'http://192.168.1.221:4000/'


class ProductionConfig(Config):
    LOGGER = 'prod'

    USERNAME = 'beopweb'
    PASSWORD = 'rnbtechrd'
    INIT_CONNECTIONS_POOL = None
    HOST = 'rds6cde6w8oeo390pw8i.mysql.rds.aliyuncs.com'
    MYSQL_SERVER_READ = 'beoprdsslave2.mysql.rds.aliyuncs.com'
    MYSQL_SERVER_READ_USERNAME = 'beopweb'
    MYSQL_SERVER_READ_PASSWORD = 'rnbtechrd'
    MYSQL_SERVER_READ_CONNECTIONS_POOL = None
    MYSQL_SERVER_READ_POOLNAME = 'BEOPDBReadOnlyPool'
    MYSQL_GMRY_HOST = '10.26.234.201'
    MYSQL_GMRY_POOL_NAME = 'beop_gmry'
    MYSQL_GMRY_POOL_SIZE = 2

    DLLSERVER_ADDRESS = 'http://10.168.177.189'
    BEOP_SERVICE_ADDRESS = 'http://10.168.177.189'
    MEMCACHE_HOSTLIST = ['10.252.166.76:11211']
    OS_TYPE = 1
    ASSETS_DEBUG = False
    VERSION = 'Release20160728'

    MONGO_USE_ONLINE = True

    CROSS_CLUSTER_REQ_DESIGNATION = True
    CROSS_CLUSTER_REDIRECT = False
    MYSQL_GLOBAL_WRITE_ENABLED = True

    MEMCACHE_KEY_PREFIX = 'expert'
    # 这里替换为连接的实例host和port
    REDIS_HOST = '10.171.218.113'
    REDIS_PORT = 6379
    # 这里替换为实例id和实例password
    REDIS_PWD = '4280d8fd8087452e:RNBbeop2013'
    WEATHER_DB_IP = '10.30.202.244:27018'

    MAIL_PORT = 587


class DevelopmentLocalConfig(Config):
    USERNAME = 'beopweb2'
    PASSWORD = 'rnbtechrd'
    MYSQL_SERVER_READ_USERNAME = 'beopweb2'
    MYSQL_SERVER_READ_PASSWORD = 'rnbtechrd'

    INIT_CONNECTIONS_POOL = 3
    HOST = '192.168.1.208'
    MYSQL_SERVER_READ = '192.168.1.208'
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 3
    MYSQL_SERVER_READ_POOLNAME = 'BEOPDBReadOnlyPool'

    MONGO_USERNAME = 'beopweb'
    MONGO_PASSWORD = 'RNB.beop-2013'
    MONGO_USE_ONLINE = False
    MONGO_SERVER_HOST = '192.168.1.208:27017'

    ASSETS_DEBUG = True
    USE_ALI_PUBLIC = True
    IS_DEV_CONFIG = True
    BEOPCLUSTER_ALIAS = 'aliyun_cn'
    URL_CHECK = True
    CROSS_CLUSTER_REQ_DESIGNATION = False
    MEMCACHE_HOSTLIST = ['192.168.1.208:11211']


class DevelopmentOnlineConfig(Config):
    USERNAME = 'devfront'
    PASSWORD = 'Rnbtech1103'
    INIT_CONNECTIONS_POOL = None
    HOST = 'rds6cde6w8oeo390pw8io.mysql.rds.aliyuncs.com'
    MYSQL_SERVER_READ = 'rr-bp1qro1e54e4h3be0o.mysql.rds.aliyuncs.com'

    MYSQL_SERVER_READ_USERNAME = 'devfront'
    MYSQL_SERVER_READ_PASSWORD = 'Rnbtech1103'
    MYSQL_SERVER_READ_CONNECTIONS_POOL = None
    MYSQL_SERVER_READ_POOLNAME = 'BEOPDBReadOnlyPool'
    # MEMCACHE_HOSTLIST=['beopdemo.rnbtech.com.hk:11211'],
    MEMCACHE_HOSTLIST = ['192.168.1.208:11210']

    MONGO_USERNAME = ''  # do not modify!
    MONGO_PASSWORD = 'RNB.beop-2013'
    MONGO_USE_ONLINE = True
    # INTERNAL_CONFIG_ADDR = '10.168.154.6:27018'
    # INTERNET_CONFIG_ADDR = '120.55.113.116:27018'
    INTERNAL_CONFIG_ADDR = '10.30.202.244:27020'
    INTERNET_CONFIG_ADDR = '101.37.90.188:27020'

    REDIS_HOST = 'beopdemo.rnbtech.com.hk'
    REDIS_PORT = 6379
    # 这里替换为实例id和实例password
    REDIS_PWD = 'beopweb:rnbtechrd'

    ASSETS_DEBUG = True
    USE_ALI_PUBLIC = True
    URL_CHECK = True
    ASSETS_PACKING = False
    BEOPCLUSTER_ALIAS = 'aliyun_cn'
    IS_DEV_CONFIG = True


class DevelopmentConfig_rikan(DevelopmentOnlineConfig):
    USERNAME = 'rikan'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL = 2
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 2


class DevelopmentConfig_golding(DevelopmentOnlineConfig):
    USERNAME = 'golding'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL = 2
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 2


class DevelopmentConfig_mango(DevelopmentOnlineConfig):
    USERNAME = 'mango'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL = 2
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 2


class DevelopmentConfig_angelia(DevelopmentOnlineConfig):
    USERNAME = 'angelia'
    MONGO_USERNAME = 'beopweb'


class DevelopmentConfig_murphy(DevelopmentOnlineConfig):
    USERNAME = 'murphy'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL = 2
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 2


class DevelopmentConfig_neil(DevelopmentOnlineConfig):
    USERNAME = 'neil'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL = 2
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 2


class DevelopmentConfig_john(DevelopmentOnlineConfig):
    USERNAME = 'john'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL = 2
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 2


class DevelopmentConfig_vicky(DevelopmentOnlineConfig):
    USERNAME = 'vicky'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL = 2
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 2


class DevelopmentConfig_owen(DevelopmentOnlineConfig):
    USERNAME = 'owen'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL = 2
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 2


class DevelopmentConfig_peter(DevelopmentOnlineConfig):
    USERNAME = 'peter'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL = 2
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 2


class DevelopmentConfig_david(DevelopmentOnlineConfig):
    USERNAME = 'david'
    MONGO_USERNAME = USERNAME
    # MONGO_SERVER_HOST='192.168.1.208:27017',
    INIT_CONNECTIONS_POOL = 2
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 2


class DevelopmentConfig_lily(DevelopmentOnlineConfig):
    USERNAME = 'lily'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL = 2
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 2


class DevelopmentConfig_woody(DevelopmentOnlineConfig):
    USERNAME = 'woody'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL = 2
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 2


class DevelopmentConfig_will(DevelopmentOnlineConfig):
    USERNAME = 'will'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL = 2
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 2


class DevelopmentConfig_carol(DevelopmentOnlineConfig):
    USERNAME = 'carol'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL = 2
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 2


class DevelopmentConfig_may(DevelopmentOnlineConfig):
    LOGGER = 'devtest'
    # CROSS_CLUSTER_REQ_DESIGNATION = True
    USERNAME = 'may'
    MONGO_USERNAME = USERNAME
    MYSQL_SERVER_READ_CONNECTIONS_POOL = None
    INIT_CONNECTIONS_POOL = None


class DevelopmentConfig_tony(DevelopmentOnlineConfig):
    LOGGER = 'devtest'
    MONGO_USERNAME = 'beopweb'
    USERNAME = 'may'
    INIT_CONNECTIONS_POOL = None
    MYSQL_SERVER_READ_USERNAME = USERNAME
    MYSQL_SERVER_READ_CONNECTIONS_POOL = None
    MONGO_CONFIG_REPLICA_SET = 'rsconfig'
    MONGO_CONFIG_READ_PREFERENCE = 'nearest'


class CrossClusterConfig_tony(DevelopmentOnlineConfig):
    CROSS_CLUSTER_REQ_DESIGNATION = True
    CROSS_CLUSTER_REDIRECT = False
    BEOPCLUSTER_ALIAS = 'aliyun_cn'
    MONGO_USERNAME = 'beopweb'
    MONGO_PASSWORD = 'RNB.beop-2013'
    MYSQL_GLOBAL_WRITE_ENABLED = True
    MYSQL_GLOBAL_WRITE = dict(
        aliyun_cn=dict(HOST='rds6cde6w8oeo390pw8io.mysql.rds.aliyuncs.com', USERNAME='beopweb', PASSWORD='rnbtechrd'),
        azure_cn=dict(HOST='datam.mysqldb.chinacloudapi.cn', USERNAME='datam%beopweb', PASSWORD='Rnbtech1103'),
        azure_us=dict(HOST='52.168.75.2', USERNAME='root', PASSWORD='RNB.beop-2013')
    )


class DevelopmentConfig_eric(DevelopmentOnlineConfig):
    USERNAME = 'eric'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL = 2
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 2


class DevelopmentConfig_bill(DevelopmentOnlineConfig):
    USERNAME = 'bill'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL = 2
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 2


class DevelopmentConfig_lefi(DevelopmentOnlineConfig):
    USERNAME = 'lefi'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL = 2
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 2


class DevelopmentConfig_vivian(DevelopmentOnlineConfig):
    USERNAME = 'vivian'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL = 2
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 2


class DevelopmentConfig_caoweifeng(DevelopmentOnlineConfig):
    USERNAME = 'caoweifeng'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL = 2
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 2


class DevelopmentConfig_daikon(DevelopmentOnlineConfig):
    USERNAME = 'daikon'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL = 2
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 2


class DevelopmentConfig_rush(DevelopmentOnlineConfig):
    USERNAME = 'rush'
    MONGO_USERNAME = USERNAME
    PASSWORD = 'Rnbtech1103'
    INIT_CONNECTIONS_POOL = 2
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 2


class TestingOfficeConfig(Config):
    USERNAME = 'beopweb'
    PASSWORD = 'rnbtechrd'
    INIT_CONNECTIONS_POOL = 2
    HOST = '192.168.1.208'

    MYSQL_SERVER_READ = '192.168.1.208'
    MYSQL_SERVER_READ_USERNAME = 'beopweb'
    MYSQL_SERVER_READ_PASSWORD = 'rnbtechrd'
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 2
    MYSQL_SERVER_READ_POOLNAME = 'BEOPDBReadOnlyPool'
    MONGO_SERVER_HOST = '192.168.1.208:27017'
    MEMCACHE_HOSTLIST = ['192.168.1.208:11211']
    MONGO_USE_ONLINE = False


class DemoConfig(Config):
    SITE_DOMAIN = 'beopdemo.rnbtech.com.hk'
    GLOBALIZATION = copy.deepcopy(Config.GLOBALIZATION)
    GLOBALIZATION['WW']['domainName'] = SITE_DOMAIN
    USERNAME = 'beopweb'
    PASSWORD = 'RNB.beop-2013'
    INIT_CONNECTIONS_POOL = 2
    HOST = 'rds6cde6w8oeo390pw8i.mysql.rds.aliyuncs.com'
    MYSQL_SERVER_READ = 'rds8961fe732pz9uw7js.mysql.rds.aliyuncs.com'
    MYSQL_SERVER_READ_USERNAME = 'beopweb'
    MYSQL_SERVER_READ_PASSWORD = 'rnbtechrd'
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 2
    MYSQL_SERVER_READ_POOLNAME = 'BEOPDBReadOnlyPool'
    DLLSERVER_ADDRESS = 'http://10.168.177.189'
    BEOP_SERVICE_ADDRESS = 'http://10.168.177.189'
    MEMCACHE_HOSTLIST = ['10.117.29.45:11211']

    MONGO_USE_ONLINE = True
    # 这里替换为连接的实例host和port
    REDIS_HOST = '10.171.218.113'
    REDIS_PORT = 6379
    # 这里替换为实例id和实例password
    REDIS_PWD = '4280d8fd8087452e:RNBbeop2013'
    ASSETS_DEBUG = False
    ASSETS_PACKING = True


class StandbyConfig(Config):

    USERNAME = 'root'
    PASSWORD = 'RNB.beop-2013'
    HOST = '10.174.142.0'
    INIT_CONNECTIONS_POOL = 2

    SITE_DOMAIN = 'beop.rnbtech.com.hk'
    GLOBALIZATION = copy.deepcopy(Config.GLOBALIZATION)
    GLOBALIZATION['WW']['domainName'] = SITE_DOMAIN

    MYSQL_SERVER_READ_USERNAME = 'root'
    MYSQL_SERVER_READ_PASSWORD = 'RNB.beop-2013'
    MYSQL_SERVER_READ = '10.174.142.0'
    MYSQL_SERVER_READ_POOLNAME = 'ContainerDBPoolReadOnly'
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 2

    BEOP_SERVICE_ADDR = '10.24.150.106'

    CONFIG_MONGO_ADDR = '10.51.5.163'
    CONFIG_MONGO_PORT = 37018

    USE_ALI_PUBLIC = False
    RECIPIENTS_LIST = ['golding.gu@rnbtech.com.hk']

    ASSETS_DEBUG = False
    ASSETS_PACKING = True
    OS_TYPE = 1

    DLLSERVER_ADDRESS = 'http://10.168.177.189'
    BEOP_SERVICE_ADDRESS = 'http://10.168.177.189'
    MEMCACHE_HOSTLIST = ['127.0.0.1:11211']
    EXPERT_CONTAINER_URL = 'http://121.41.28.69/'
    DIAGNOSIS_ENGINE_ADDRESS = 'http://10.24.150.106:5101'
    INTERNAL_CONFIG_ADDR = '10.51.5.163:37018'
    INTERNET_CONFIG_ADDR = '10.51.5.163:37018'
    MEMCACHE_KEY_PREFIX = 'standby'
    # 这里替换为连接的实例host和port
    REDIS_HOST = '4280d8fd8087452e.redis.rds.aliyuncs.com'
    REDIS_PORT = 6379
    # 这里替换为实例id和实例password
    REDIS_PWD = '4280d8fd8087452e:RNBbeop2013'

    MONGO_USE_ONLINE = True


class DemoUSConfig(Config):
    SITE_DOMAIN = 'beopen.rnbtech.com.hk'
    GLOBALIZATION = copy.deepcopy(Config.GLOBALIZATION)
    GLOBALIZATION['WW']['domainName'] = SITE_DOMAIN
    USERNAME = 'beopweb2'
    PASSWORD = 'rnbtechrd'
    INIT_CONNECTIONS_POOL = 3
    HOST = 'rds6cde6w8oeo390pw8i0.mysql.rds.aliyuncs.com'
    MYSQL_SERVER_READ = 'rds8961fe732pz9uw7js0.mysql.rds.aliyuncs.com'
    MYSQL_SERVER_READ_USERNAME = 'beopweb2'
    MYSQL_SERVER_READ_PASSWORD = 'rnbtechrd'
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 2
    MYSQL_SERVER_READ_POOLNAME = 'BEOPDBReadOnlyPool'
    USE_ALI_PUBLIC = True
    MEMCACHE_HOSTLIST = ['beopdemo.rnbtech.com.hk:11211']
    MONGO_USE_ONLINE = True
    # 这里替换为连接的实例host和port
    REDIS_HOST = 'beopdemo.rnbtech.com.hk'
    REDIS_PORT = 6379
    # 这里替换为实例id和实例password
    REDIS_PWD = 'beopweb:rnbtechrd'


class DemoJPConfig(Config):
    USERNAME = 'beopweb'
    PASSWORD = 'rnbtechrd'
    INIT_CONNECTIONS_POOL = 2
    HOST = 'rds7n4949y4dwgh0q88y.mysql.rds.aliyuncs.com'
    # HOST = '10.162.105.118',

    # MYSQL_SERVER_READ='rdsdxu3bb6q36ks8iu58.mysql.rds.aliyuncs.com',
    MYSQL_SERVER_READ = '121.40.197.63'
    MYSQL_SERVER_READ_USERNAME = 'beopweb'
    MYSQL_SERVER_READ_PASSWORD = 'rnbtechrd'
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 5
    MYSQL_SERVER_READ_POOLNAME = 'BEOPDBReadOnlyPool'
    MONGO_USE_ONLINE = True


class AzureProduction(Config):
    LOGGER = 'prod'
    SITE_DOMAIN = 'beopazure.rnbtech.com.hk'
    GLOBALIZATION = copy.deepcopy(Config.GLOBALIZATION)
    GLOBALIZATION['WW']['domainName'] = SITE_DOMAIN

    HOST = 'datam.mysqldb.chinacloudapi.cn'
    USERNAME = 'datam%beopweb'
    PASSWORD = 'Rnbtech1103'
    INIT_CONNECTIONS_POOL = None

    MYSQL_SERVER_READ = 'datamslave.mysqldb.chinacloudapi.cn'
    MYSQL_SERVER_READ_USERNAME = 'datamslave%beopweb'
    MYSQL_SERVER_READ_PASSWORD = 'Rnbtech1103'
    MYSQL_SERVER_READ_CONNECTIONS_POOL = None
    MYSQL_SERVER_READ_POOLNAME = 'BEOPDBReadOnlyPool'

    CROSS_CLUSTER_REQ_DESIGNATION = True
    CROSS_CLUSTER_REDIRECT = False
    MYSQL_GLOBAL_WRITE_ENABLED = True

    MONGO_USERNAME = 'beopweb'
    MONGO_PASSWORD = 'RNB.beop-2013'
    USE_ALI_PUBLIC = True
    MEMCACHE_HOSTLIST = ['beopdemo.rnbtech.com.hk:11211']
    MONGO_USE_ONLINE = True
    MONGO_HEARTBEAT_REQUIRED = True
    MONGO_HEARTBEAT_INTERVAL = 180
    MONGO_CONFIG_REPLICA_SET = 'rsconfig'
    MONGO_CONFIG_READ_PREFERENCE = 'nearest'
    # 这里替换为连接的实例host和port
    REDIS_HOST = 'rnbtech.redis.cache.chinacloudapi.cn'
    REDIS_PORT = 6379
    # 这里替换为实例id和实例password
    REDIS_PWD = 'Ny/HnFe7nBUR18t+aeatzbOEQJMX1skGB//Rns2aw6o='

    DLLSERVER_ADDRESS = 'http://10.0.0.6:5009/'
    BEOP_SERVICE_ADDRESS = 'http://10.0.0.6:5009/'
    EXPERT_CONTAINER_URL = 'http://42.159.234.15:4000/'
    WEATHER_DB_IP = '101.37.90.188:27018'

    BEOP_SERVER_TIMEZONE = 8


class AzureUSProduction(Config):
    LOGGER = 'prod'
    SITE_DOMAIN = 'us2.smartbeop.com'
    GLOBALIZATION = copy.deepcopy(Config.GLOBALIZATION)
    GLOBALIZATION['WW']['domainName'] = SITE_DOMAIN

    HOST = '10.0.0.13'
    USERNAME = 'root'
    PASSWORD = 'RNB.beop-2013'
    INIT_CONNECTIONS_POOL = None

    MYSQL_SERVER_READ = '10.0.0.12'
    MYSQL_SERVER_READ_USERNAME = 'root'
    MYSQL_SERVER_READ_PASSWORD = 'RNB.beop-2013'
    MYSQL_SERVER_READ_CONNECTIONS_POOL = None
    MYSQL_SERVER_READ_POOLNAME = 'BEOPDBReadOnlyPool'

    CROSS_CLUSTER_REQ_DESIGNATION = True
    CROSS_CLUSTER_REDIRECT = False
    MYSQL_GLOBAL_WRITE_ENABLED = True

    MONGO_USERNAME = 'beopweb'
    MONGO_PASSWORD = 'RNB.beop-2013'
    USE_ALI_PUBLIC = True
    MEMCACHE_HOSTLIST = ['beopdemo.rnbtech.com.hk:11211']
    MONGO_USE_ONLINE = True
    MONGO_HEARTBEAT_REQUIRED = True
    MONGO_HEARTBEAT_INTERVAL = 180
    MONGO_CONFIG_REPLICA_SET = 'rsconfig'
    MONGO_CONFIG_READ_PREFERENCE = 'nearest'
    # 这里替换为连接的实例host和port
    REDIS_HOST = 'usredis.redis.cache.windows.net'
    REDIS_PORT = 6379
    # 这里替换为实例id和实例password
    REDIS_PWD = 'X+0rTyQymbjT7G26/mQzXj3PZvrUkYB73oagFnHnFfs='

    DLLSERVER_ADDRESS = 'http://10.0.0.7:5009/'
    BEOP_SERVICE_ADDRESS = 'http://10.0.0.7:5009/'
    EXPERT_CONTAINER_URL = 'http://40.71.228.119:4000/'
    WEATHER_DB_IP = '10.0.0.11:27018'

    BEOP_SERVER_TIMEZONE = -5


config = {
    'aliyun_cn': ProductionConfig(),
    'default': DevelopmentLocalConfig(),
    "test": TestConfig(),
    'testing': TestingOfficeConfig(),
    'standby': StandbyConfig(),
    'aliyun_demo': DemoConfig(),
    'beopdemous': DemoUSConfig(),
    'beopdemojp': DemoJPConfig(),
    'azure_cn': AzureProduction(),
    'azure_us': AzureUSProduction(),
    'developmentlocal': DevelopmentLocalConfig(),
    'development_rikan': DevelopmentConfig_rikan(),
    'development_golding': DevelopmentConfig_golding(),
    'development_mango': DevelopmentConfig_mango(),
    'development_angelia': DevelopmentConfig_angelia(),
    'development_murphy': DevelopmentConfig_murphy(),
    'development_neil': DevelopmentConfig_neil(),
    'development_john': DevelopmentConfig_john(),
    'development_owen': DevelopmentConfig_owen(),
    'development_peter': DevelopmentConfig_peter(),
    'development_david': DevelopmentConfig_david(),
    'development_lily': DevelopmentConfig_lily(),
    'development_woody': DevelopmentConfig_woody(),
    'development_will': DevelopmentConfig_will(),
    'development_carol': DevelopmentConfig_carol(),
    'development_may': DevelopmentConfig_may(),
    'development_eric': DevelopmentConfig_eric(),
    'development_bill': DevelopmentConfig_bill(),
    'development_lefi': DevelopmentConfig_lefi(),
    'development_vicky': DevelopmentConfig_vicky(),
    'development_vivian': DevelopmentConfig_vivian(),
    'development_daikon': DevelopmentConfig_vivian(),
    'development_caoweifeng': DevelopmentConfig_caoweifeng(),
    'development_rush': DevelopmentConfig_rush(),
    'crosscluster_tony': CrossClusterConfig_tony(),
    'development_tony': DevelopmentConfig_tony()
}
