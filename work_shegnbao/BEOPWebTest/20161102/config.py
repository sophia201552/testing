__author__ = 'golding'

class Config:

    USERNAME='devfront'
    PASSWORD='Rnbtech1103'
    INIT_CONNECTIONS_POOL=2
    HOST='rds6cde6w8oeo390pw8io.mysql.rds.aliyuncs.com'
    MYSQL_SERVER_READ='rr-bp1qro1e54e4h3be0o.mysql.rds.aliyuncs.com'
    MYSQL_SERVER_READ_USERNAME='devfront'
    MYSQL_SERVER_READ_PASSWORD='Rnbtech1103'
    MYSQL_SERVER_READ_CONNECTIONS_POOL=2
    MYSQL_SERVER_READ_POOLNAME='BEOPDBReadOnlyPool'

    DATABASE='beopdoengine'
    PROJECT_DATABASE='beopdata'
    WORKFLOW_DATABASE='workflow'
    TABLE_OP='operation_record'
    DB_POOL_NAME='BEOPDBPool'
    MAIL_SERVER='smtp.rnbtech.com.hk'
    MAIL_USERNAME='beop.cloud@rnbtech.com.hk'
    MAIL_PASSWORD='beop123456'
    MAIL_DEFAULT_SENDER=("BeOP Service", "beop.cloud@rnbtech.com.hk")
    MAIL_DEBUG=0
    FTP_PATH='d:/FTP/beopsoft-release'
    S3DB_DIR_CLOUD='s3db/'
    DLL_CONFIG_PATH='beopWeb/lib/config'

    GZIP_ENABLE=True
    SITE_DOMAIN='beop.rnbtech.com.hk'  # 用于邮件中的链接等地方,如果部署在其他域名下请覆盖此配置

    ASSETS_JS_FILTER='rjsmin'
    ASSETS_CSS_FILTER='cssmin'

    DLLSERVER_ADDRESS='http://120.26.141.37:5000'
    BEOP_SERVICE_ADDRESS='http://120.26.141.37:5000'
    ASSETS_DEBUG=False
    ASSETS_PACKING=False
    USE_ALI_PUBLIC=False  # 为true的话，使用外网的地址，否则使用内网地址
    URL_CHECK=True  # 是否启动url的token校验

    TOKEN_EXPIRATION=10800  # 3小时： 60 * 60 * 3
    TOKEN_WHITE_LIST=['eyJhbGciOiJIUzI1NiIsImV4cCI6MT']  # 无需tonken验证
    MEMCACHE_HOSTLIST=['beopdemo.rnbtech.com.hk:11211']
    OS_TYPE=0,

    MONGO_USERNAME = 'beopweb'
    MONGO_PASSWORD = 'RNB.beop-2013'
    INTERNAL_CONFIG_ADDR='10.168.154.6:27018'
    INTERNET_CONFIG_ADDR='120.55.113.116:27018'
    MONGO_USE_ONLINE = False

    TEMPERATURE_APP_SERVICE_ADDRESS='http://121.40.188.158:5001'  # 温控策略接口
    EXPERT_CONTAINER_URL='http://121.40.101.67:4000/'  # 算法容器接口
    DIAGNOSIS_ENGINE_ADDRESS='http://121.40.188.158:5101'  # 算法容器接口
    VERSION = 'build'


    MEMCACHE_KEY_PREFIX = 'expert'
    #这里替换为连接的实例host和port
    REDIS_HOST = '192.168.1.208'
    REDIS_PORT = 6379
    #这里替换为实例id和实例password
    REDIS_USER = 'beopweb'
    REDIS_PWD = 'RNB.beop-2013'


class ProductionConfig(Config):
    USERNAME='beopweb'
    PASSWORD='rnbtechrd'
    INIT_CONNECTIONS_POOL=2
    HOST='rds6cde6w8oeo390pw8i.mysql.rds.aliyuncs.com'
    MYSQL_SERVER_READ='rds8961fe732pz9uw7js.mysql.rds.aliyuncs.com'
    MYSQL_SERVER_READ_USERNAME='beopweb'
    MYSQL_SERVER_READ_PASSWORD='rnbtechrd'
    MYSQL_SERVER_READ_CONNECTIONS_POOL=2
    MYSQL_SERVER_READ_POOLNAME='BEOPDBReadOnlyPool'
    DLLSERVER_ADDRESS='http://10.51.26.71:5000'
    BEOP_SERVICE_ADDRESS='http://10.51.26.71:5000'
    MEMCACHE_HOSTLIST=['10.252.166.76:11211']
    OS_TYPE=1
    ASSETS_DEBUG=False
    VERSION = 'Release20160728'

    MONGO_USE_ONLINE = True

    MEMCACHE_KEY_PREFIX = 'expert'
    #这里替换为连接的实例host和port
    REDIS_HOST = '10.171.218.113'
    REDIS_PORT = 6379
    #这里替换为实例id和实例password
    REDIS_USER = '4280d8fd8087452e'
    REDIS_PWD = 'RNBbeop2013'

class DevelopmentLocalConfig(Config):
    USERNAME='beopweb2'
    PASSWORD='rnbtechrd'
    MYSQL_SERVER_READ_USERNAME='beopweb2'
    MYSQL_SERVER_READ_PASSWORD='rnbtechrd'

    INIT_CONNECTIONS_POOL=3
    HOST='192.168.1.208'
    MYSQL_SERVER_READ='192.168.1.208'
    MYSQL_SERVER_READ_CONNECTIONS_POOL=3
    MYSQL_SERVER_READ_POOLNAME='BEOPDBReadOnlyPool'

    MONGO_USERNAME = 'beopweb'
    MONGO_PASSWORD = 'RNB.beop-2013'
    MONGO_USE_ONLINE = False
    MONGO_SERVER_HOST='192.168.1.208:27017'

    ASSETS_DEBUG=True
    USE_ALI_PUBLIC=True
    URL_CHECK=True
    MEMCACHE_HOSTLIST=['192.168.1.208:11211']

class DevelopmentOnlineConfig(Config):
    USERNAME='devfront'
    PASSWORD='Rnbtech1103'
    INIT_CONNECTIONS_POOL=2
    HOST='rds6cde6w8oeo390pw8io.mysql.rds.aliyuncs.com'
    MYSQL_SERVER_READ='rr-bp1qro1e54e4h3be0o.mysql.rds.aliyuncs.com'

    MYSQL_SERVER_READ_USERNAME='devfront'
    MYSQL_SERVER_READ_PASSWORD='Rnbtech1103'
    MYSQL_SERVER_READ_CONNECTIONS_POOL=2
    MYSQL_SERVER_READ_POOLNAME='BEOPDBReadOnlyPool'
    # MEMCACHE_HOSTLIST=['beopdemo.rnbtech.com.hk:11211'],
    MEMCACHE_HOSTLIST=['192.168.1.208:11210']

    MONGO_USERNAME = '' #do not modify!
    MONGO_PASSWORD = 'Rnbtech1103'
    MONGO_USE_ONLINE = True
    INTERNAL_CONFIG_ADDR='10.168.154.6:27018'
    INTERNET_CONFIG_ADDR='120.55.113.116:27018'

    REDIS_HOST = 'beopdemo.rnbtech.com.hk'
    REDIS_PORT = 6379
    #这里替换为实例id和实例password
    REDIS_USER = 'beopweb'
    REDIS_PWD = 'rnbtechrd'

    ASSETS_DEBUG=True
    USE_ALI_PUBLIC=True
    URL_CHECK=True

    ASSETS_PACKING = False


class DevelopmentConfig_rikan(DevelopmentOnlineConfig):
    USERNAME = 'rikan'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL=2
    MYSQL_SERVER_READ_CONNECTIONS_POOL=5

class DevelopmentConfig_golding(DevelopmentOnlineConfig):
    USERNAME = 'golding'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL=2
    MYSQL_SERVER_READ_CONNECTIONS_POOL=5

class DevelopmentConfig_mango(DevelopmentOnlineConfig):
    USERNAME = 'mango'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL=2
    MYSQL_SERVER_READ_CONNECTIONS_POOL=5

class DevelopmentConfig_murphy(DevelopmentOnlineConfig):
    USERNAME = 'murphy'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL=2
    MYSQL_SERVER_READ_CONNECTIONS_POOL=5

class DevelopmentConfig_neil(DevelopmentOnlineConfig):
    USERNAME = 'neil'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL=2
    MYSQL_SERVER_READ_CONNECTIONS_POOL=5

class DevelopmentConfig_john(DevelopmentOnlineConfig):
    USERNAME = 'john'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL=2
    MYSQL_SERVER_READ_CONNECTIONS_POOL=5

class DevelopmentConfig_vicky(DevelopmentOnlineConfig):
    USERNAME = 'vicky'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL=2
    MYSQL_SERVER_READ_CONNECTIONS_POOL=5

class DevelopmentConfig_owen(DevelopmentOnlineConfig):
    USERNAME = 'owen'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL=2
    MYSQL_SERVER_READ_CONNECTIONS_POOL=5

class DevelopmentConfig_peter(DevelopmentOnlineConfig):
    USERNAME = 'peter'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL=2
    MYSQL_SERVER_READ_CONNECTIONS_POOL=5

class DevelopmentConfig_david(DevelopmentOnlineConfig):
    USERNAME = 'david'
    MONGO_USERNAME = USERNAME
    #MONGO_SERVER_HOST='192.168.1.208:27017',
    INIT_CONNECTIONS_POOL=2
    MYSQL_SERVER_READ_CONNECTIONS_POOL=5

class DevelopmentConfig_lily(DevelopmentOnlineConfig):
    USERNAME = 'lily'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL=2
    MYSQL_SERVER_READ_CONNECTIONS_POOL=5

class DevelopmentConfig_woody(DevelopmentOnlineConfig):
    USERNAME = 'woody'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL=2
    MYSQL_SERVER_READ_CONNECTIONS_POOL=5

class DevelopmentConfig_will(DevelopmentOnlineConfig):
    USERNAME = 'will'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL=2
    MYSQL_SERVER_READ_CONNECTIONS_POOL=5

class DevelopmentConfig_carol(DevelopmentOnlineConfig):
    USERNAME = 'carol'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL=2
    MYSQL_SERVER_READ_CONNECTIONS_POOL=5

class DevelopmentConfig_may(DevelopmentOnlineConfig):
    USERNAME = 'may'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL=2
    MYSQL_SERVER_READ_CONNECTIONS_POOL=5

class DevelopmentConfig_eric(DevelopmentOnlineConfig):
    USERNAME = 'eric'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL=2
    MYSQL_SERVER_READ_CONNECTIONS_POOL=5

class DevelopmentConfig_bill(DevelopmentOnlineConfig):
    USERNAME = 'bill'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL=2
    MYSQL_SERVER_READ_CONNECTIONS_POOL=5

class DevelopmentConfig_lefi(DevelopmentOnlineConfig):
    USERNAME = 'lefi'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL=2
    MYSQL_SERVER_READ_CONNECTIONS_POOL=5

class DevelopmentConfig_vicky(DevelopmentOnlineConfig):
    USERNAME = 'vicky'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL=2
    MYSQL_SERVER_READ_CONNECTIONS_POOL=5

class DevelopmentConfig_vivian(DevelopmentOnlineConfig):
    USERNAME = 'vivian'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL=2
    MYSQL_SERVER_READ_CONNECTIONS_POOL=5

class DevelopmentConfig_caoweifeng(DevelopmentOnlineConfig):
    USERNAME = 'caoweifeng'
    MONGO_USERNAME = USERNAME
    INIT_CONNECTIONS_POOL=2
    MYSQL_SERVER_READ_CONNECTIONS_POOL=5


class TestingOfficeConfig(Config):
    USERNAME='beopweb'
    PASSWORD='rnbtechrd'
    INIT_CONNECTIONS_POOL=3
    HOST='192.168.1.208'

    MYSQL_SERVER_READ='192.168.1.208'
    MYSQL_SERVER_READ_USERNAME='beopweb'
    MYSQL_SERVER_READ_PASSWORD='rnbtechrd'
    MYSQL_SERVER_READ_CONNECTIONS_POOL=7
    MYSQL_SERVER_READ_POOLNAME='BEOPDBReadOnlyPool'
    MONGO_SERVER_HOST='192.168.1.208:27017'
    MEMCACHE_HOSTLIST=['192.168.1.208:11211']
    MONGO_USE_ONLINE = False


class DemoConfig(Config):
    SITE_DOMAIN='beopdemo.rnbtech.com.hk'
    USERNAME='beopweb2'
    PASSWORD='rnbtechrd'
    INIT_CONNECTIONS_POOL=2
    HOST='rds6cde6w8oeo390pw8i.mysql.rds.aliyuncs.com'
    MYSQL_SERVER_READ='rds8961fe732pz9uw7js.mysql.rds.aliyuncs.com'
    MYSQL_SERVER_READ_USERNAME='beopweb2'
    MYSQL_SERVER_READ_PASSWORD='rnbtechrd'
    MYSQL_SERVER_READ_CONNECTIONS_POOL=2
    MYSQL_SERVER_READ_POOLNAME='BEOPDBReadOnlyPool'
    DLLSERVER_ADDRESS='http://10.51.26.71:5000'
    BEOP_SERVICE_ADDRESS='http://10.51.26.71:5000'
    MEMCACHE_HOSTLIST=['10.117.29.45:11211']

    MONGO_USE_ONLINE = True
    #这里替换为连接的实例host和port
    REDIS_HOST = '4280d8fd8087452e.redis.rds.aliyuncs.com'
    REDIS_PORT = 6379
    #这里替换为实例id和实例password
    REDIS_USER = '4280d8fd8087452e'
    REDIS_PWD = 'RNBbeop2013'
    ASSETS_DEBUG = False
    ASSETS_PACKING = True

class StandbyConfig(Config):

    USERNAME = 'root'
    PASSWORD = 'RNB.beop-2013'
    HOST = '10.174.142.0'
    INIT_CONNECTIONS_POOL = 2

    SITE_DOMAIN='beop.rnbtech.com.hk'

    MYSQL_SERVER_READ_USERNAME = 'root'
    MYSQL_SERVER_READ_PASSWORD = 'RNB.beop-2013'
    MYSQL_SERVER_READ = '10.174.142.0'
    MYSQL_SERVER_READ_POOLNAME = 'ContainerDBPoolReadOnly'
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 2

    BEOP_SERVICE_ADDR = '10.24.150.106'

    CONFIG_MONGO_ADDR = '10.46.20.123'
    CONFIG_MONGO_PORT = 27018

    MYSQL_SERVER_READ = '10.174.142.0'
    USE_ALI_PUBLIC = False
    RECIPIENTS_LIST = ['golding.gu@rnbtech.com.hk']

    ASSETS_DEBUG = False
    ASSETS_PACKING = True
    OS_TYPE=1

    DLLSERVER_ADDRESS='http://10.24.150.106:5001'
    BEOP_SERVICE_ADDRESS = 'http://10.24.150.106:5000'
    MEMCACHE_HOSTLIST=['127.0.0.1:11211']
    EXPERT_CONTAINER_URL='http://139.196.243.32:4000/'
    DIAGNOSIS_ENGINE_ADDRESS='http://10.24.150.106:5101'
    INTERNAL_CONFIG_ADDR='10.46.20.123:27018'
    INTERNET_CONFIG_ADDR='10.46.20.123:27018'
    MEMCACHE_KEY_PREFIX = 'standby'
    #这里替换为连接的实例host和port
    REDIS_HOST = '4280d8fd8087452e.redis.rds.aliyuncs.com'
    REDIS_PORT = 6379
    #这里替换为实例id和实例password
    REDIS_USER = '4280d8fd8087452e'
    REDIS_PWD = 'RNBbeop2013'

    MONGO_USE_ONLINE = True


class DemoUSConfig(Config):
    SITE_DOMAIN='beopen.rnbtech.com.hk'
    USERNAME='beopweb2'
    PASSWORD='rnbtechrd'
    INIT_CONNECTIONS_POOL=3
    HOST='rds6cde6w8oeo390pw8i0.mysql.rds.aliyuncs.com'
    MYSQL_SERVER_READ='rds8961fe732pz9uw7js0.mysql.rds.aliyuncs.com'
    MYSQL_SERVER_READ_USERNAME='beopweb2'
    MYSQL_SERVER_READ_PASSWORD='rnbtechrd'
    MYSQL_SERVER_READ_CONNECTIONS_POOL=3
    MYSQL_SERVER_READ_POOLNAME='BEOPDBReadOnlyPool'
    USE_ALI_PUBLIC=True
    MEMCACHE_HOSTLIST=['beopdemo.rnbtech.com.hk:11211']
    MONGO_USE_ONLINE = True



class DemoJPConfig(Config):
    USERNAME='beopweb'
    PASSWORD='rnbtechrd'
    INIT_CONNECTIONS_POOL=2
    HOST='rds7n4949y4dwgh0q88y.mysql.rds.aliyuncs.com'
    # HOST = '10.162.105.118',

    # MYSQL_SERVER_READ='rdsdxu3bb6q36ks8iu58.mysql.rds.aliyuncs.com',
    MYSQL_SERVER_READ='121.40.197.63'
    MYSQL_SERVER_READ_USERNAME='beopweb'
    MYSQL_SERVER_READ_PASSWORD='rnbtechrd'
    MYSQL_SERVER_READ_CONNECTIONS_POOL=2
    MYSQL_SERVER_READ_POOLNAME='BEOPDBReadOnlyPool'
    MONGO_USE_ONLINE = True


config={
    'production': ProductionConfig(),
    'default': DevelopmentLocalConfig(),
    'testing': TestingOfficeConfig(),
    'standby': StandbyConfig(),
    'beopdemo': DemoConfig,
    'beopdemous':DemoUSConfig,
    'beopdemojp':DemoJPConfig,
    'developmentlocal': DevelopmentLocalConfig(),
    'development_rikan': DevelopmentConfig_rikan(),
    'development_golding': DevelopmentConfig_golding(),
    'development_mango': DevelopmentConfig_mango(),
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
    'development_caoweifeng': DevelopmentConfig_caoweifeng(),
    }
