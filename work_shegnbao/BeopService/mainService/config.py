﻿__author__ = 'golding'


class Config:
    """
    Base class for all configurations.
    """
    LOGGER = 'debug'
    DATABASE = 'beopdoengine'
    DB_POOL_NAME = 'BEOPDBPool'
    USERNAME = 'beopweb2'
    PASSWORD = 'rnbtechrd'
    INIT_CONNECTIONS_POOL = None
    HOST = 'rds6cde6w8oeo390pw8io.mysql.rds.aliyuncs.com'
    MYSQL_SERVER_READ = 'rds6cde6w8oeo390pw8io.mysql.rds.aliyuncs.com'
    MYSQL_SERVER_READ_USERNAME = 'beopservice'
    MYSQL_SERVER_READ_PASSWORD = 'rnbtechrd'
    MYSQL_SERVER_READ_CONNECTIONS_POOL = None
    MYSQL_SERVER_READ_POOLNAME = 'BEOPDBReadOnlyPool'

    LOCAL_MONGO_SERVER = '192.168.1.208:27017'
    MONGO_CONNECTION_PORT = 27017
    MONGO_HEARTBEAT_REQUIRED = False
    MONGO_HEARTBEAT_INTERVAL = 180
    DLL_CONFIG_PATH = 'lib/config'
    DLL_NAME = 'lib/DataAnalysis.dll'
    USE_ALI_PUBLIC = True
    TOKEN_WHITE_LIST = ['boardtest']
    MAIL_SERVER = 'smtp.rnbtech.com.hk'
    MAIL_USERNAME = 'beop.cloud@rnbtech.com.hk'
    MAIL_PASSWORD = 'beop123456'
    MAIL_DEFAULT_SENDER = ("BeOP数据诊断优化平台", "beop.cloud@rnbtech.com.hk")
    MAIL_DEBUG = 0
    MQ_SEND_NAME_LIST = ['file', 'message', 'email', 'notify', 'update_data']
    MQ_RECEIVE_NAME = 'receive'
    MQ_ADDRESS = '10.175.203.4'
    MQ_USERNAME = 'beopweb'
    MQ_PASSWORD = 'RNB.beop-2013'

    MEMCACHE_KEY_PREFIX = 'expert'
    DATABASE_BUFFER = 'beopdatabuffer'

    REFRESH_REDIS_AT_STARTUP = True

    REDIS_HOST = '192.168.1.208'
    REDIS_PORT = 6379
    # 这里替换为实例id和实例password
    REDIS_PWD = 'beopweb:rnbtechrd'

    INTERNET_CONFIG_ADDR = '120.55.113.116:27018'
    INTERNAL_CONFIG_ADDR = '10.168.154.6:27018'
    V2FORMAT = 'v2_data_'

    WEATHER_DB_IP = '101.37.90.188:27018'

    EXPERT_MODBUSSERVER_URL = 'http://121.41.63.75:5001'
    EXPERT_OBIXSERVER_URL = 'http://121.41.63.75:5002'

    LOG_LEVEL = 'DEBUG'
    SVN_REPO_URL = 'https://dev.rnbtech.com.hk:4443/svn/beop/BEOPToolServer/BeopService'

    BEOPWEB_LOGIN_USERNAME = 'projecttest@rnbtech.com.hk'
    BEOPWEB_LOGIN_PASSWORD = 'Rnbtech1103'
    BEOPWEB_SECRET_TOKEN = 'eyJhbGciOiJIUzI1NiIsImV4cCI6MT'


class TestConfig(Config):
    DATABASE = 'beopdoengine'
    DB_POOL_NAME = 'BEOPDBPool'
    USERNAME = 'root'
    PASSWORD = 'rnbtechrd'
    INIT_CONNECTIONS_POOL = None
    HOST = '192.168.1.222'
    MYSQL_SERVER_READ = '192.168.1.222'
    MYSQL_SERVER_READ_USERNAME = 'root'
    MYSQL_SERVER_READ_PASSWORD = 'rnbtechrd'
    MYSQL_SERVER_READ_CONNECTIONS_POOL = None
    MYSQL_SERVER_READ_POOLNAME = 'BEOPDBReadOnlyPool'
    LOCAL_MONGO_SERVER = 'localhost:27017'
    MONGO_CONNECTION_PORT = 27017
    DLL_CONFIG_PATH = 'lib/config'
    DLL_NAME = 'lib/DataAnalysis.dll'
    USE_ALI_PUBLIC = True
    TOKEN_WHITE_LIST = ['boardtest']
    MAIL_SERVER = 'smtp.rnbtech.com.hk'
    MAIL_USERNAME = 'beop.cloud@rnbtech.com.hk'
    MAIL_PASSWORD = 'beop123456'
    MAIL_DEFAULT_SENDER = ("BeOP数据诊断优化平台", "beop.cloud@rnbtech.com.hk")
    MAIL_DEBUG = 0
    MQ_SEND_NAME_LIST = ['file', 'message', 'email', 'notify', 'update_data']
    MQ_RECEIVE_NAME = 'receive'


    MEMCACHE_KEY_PREFIX = 'expert'
    DATABASE_BUFFER = 'beopdatabuffer'

    REDIS_HOST = '192.168.1.222'
    REDIS_PORT = 6379
    REDIS_PWD = 'beopweb:rnbtechrd'

    V2FORMAT = 'v2_data_'

    WEATHER_DB_IP = '101.37.90.188:27018'

    EXPERT_MODBUSSERVER_URL = 'http://121.41.63.75:5001'
    EXPERT_OBIXSERVER_URL = 'http://121.41.63.75:5002'

    MQ_ADDRESS = '192.168.1.222'
    MQ_USERNAME = 'beopweb'
    MQ_PASSWORD = 'RNB.beop-2013'

    INTERNET_CONFIG_ADDR = '192.168.1.222:27017'
    INTERNAL_CONFIG_ADDR = '192.168.1.222:27017'

class DevelopmentConfig(Config):
    MQ_ADDRESS = '120.26.63.126'    # 公网
    USE_ALI_PUBLIC = True
    MONGO_HEARTBEAT_REQUIRED = False


class DevelopmentConfig_may(DevelopmentConfig):
    REDIS_HOST = 'beopdemo.rnbtech.com.hk'
    REDIS_PORT = 6379
    # 这里替换为实例id和实例password
    REDIS_PWD = 'beopweb:rnbtechrd'
    REFRESH_REDIS_AT_STARTUP = False


class DevelopmentConfig_tony(DevelopmentConfig):
    REDIS_HOST = 'beopdemo.rnbtech.com.hk'
    REDIS_PORT = 6379
    # 这里替换为实例id和实例password
    REDIS_PWD = 'beopweb:rnbtechrd'
    REFRESH_REDIS_AT_STARTUP = False


class DevelopmentConfig_rush(DevelopmentConfig):
    REDIS_HOST = 'beopdemo.rnbtech.com.hk'
    REDIS_PORT = 6379
    # 这里替换为实例id和实例password
    REDIS_PWD = 'beopweb:rnbtechrd'
    REFRESH_REDIS_AT_STARTUP = False

class ProductionConfig(Config):
    LOGGER = 'prod'

    DATABASE = 'beopdoengine'
    DB_POOL_NAME = 'BEOPDBPool'
    USERNAME = 'beopservice'
    PASSWORD = 'rnbtechrd'

    INIT_CONNECTIONS_POOL = 2
    HOST = 'rds6cde6w8oeo390pw8i.mysql.rds.aliyuncs.com'
    MYSQL_SERVER_READ = 'rds8961fe732pz9uw7js.mysql.rds.aliyuncs.com'
    MYSQL_SERVER_READ_USERNAME = 'beopservice'
    MYSQL_SERVER_READ_PASSWORD = 'rnbtechrd'
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 2
    MYSQL_SERVER_READ_POOLNAME = 'BEOPDBReadOnlyPool'

    DLL_CONFIG_PATH = 'lib/config'
    DLL_NAME = 'lib/DataAnalysis.dll'
    USE_ALI_PUBLIC = False

    TOKEN_WHITE_LIST = ['boardtest']
    INTERNAL_CONFIG_ADDR = '10.168.154.6:27018'
    MQ_ADDRESS = '10.175.203.4'

    DATABASE_BUFFER = 'beopdatabuffer'

    MEMCACHE_KEY_PREFIX = 'expert'
    # 这里替换为连接的实例host和port
    REDIS_HOST = '10.171.218.113'
    REDIS_PORT = 6379
    # 这里替换为实例id和实例password
    REDIS_PWD = '4280d8fd8087452e:RNBbeop2013'

    WEATHER_DB_IP = '10.30.202.244:27018'


class StandbyConfig(Config):
    USERNAME = 'beopservice'
    PASSWORD = 'rnbtechrd'
    INIT_CONNECTIONS_POOL = 5
    HOST = '10.174.142.0'
    MYSQL_SERVER_READ = '10.174.142.0'

    MYSQL_SERVER_READ_USERNAME = 'beopservice'
    MYSQL_SERVER_READ_PASSWORD = 'rnbtechrd'
    MYSQL_SERVER_READ_CONNECTIONS_POOL = 5
    MYSQL_SERVER_READ_POOLNAME = 'BEOPDBReadOnlyPool'

    LOCAL_MONGO_SERVER = '10.51.5.163:37017'
    MONGO_CONNECTION_PORT = 37017

    DLL_CONFIG_PATH = 'lib/config'
    DLL_NAME = 'lib/DataAnalysis.dll'
    USE_ALI_PUBLIC = True

    TOKEN_WHITE_LIST = ['boardtest']
    INTERNAL_CONFIG_ADDR = '10.168.154.6:27018'

    MQ_SEND_NAME_LIST = ['file', 'message', 'email', 'diagnosis_notice']
    MQ_RECEIVE_NAME = 'receive'
    MQ_ADDRESS = '10.47.192.139'
    MQ_USERNAME = 'beopweb'
    MQ_PASSWORD = 'RNB.beop-2013'
    DATABASE_BUFFER = 'beopdatabuffer'

    MEMCACHE_KEY_PREFIX = 'standby'
    # 这里替换为连接的实例host和port
    REDIS_HOST = '4280d8fd8087452e.redis.rds.aliyuncs.com'
    REDIS_PORT = 6379
    # 这里替换为实例id和实例password
    REDIS_PWD = '4280d8fd8087452e:RNBbeop2013'


class Azure(Config):
    LOGGER = 'prod'
    DATABASE = 'beopdoengine'

    HOST = 'datam.mysqldb.chinacloudapi.cn'
    USERNAME = 'datam%service'
    PASSWORD = 'Rnbtech1103'
    DB_POOL_NAME = 'BEOPDBPool'
    INIT_CONNECTIONS_POOL = None

    MYSQL_SERVER_READ = 'datamslave.mysqldb.chinacloudapi.cn'
    MYSQL_SERVER_READ_USERNAME = 'datamslave%service'
    MYSQL_SERVER_READ_PASSWORD = 'Rnbtech1103'
    MYSQL_SERVER_READ_CONNECTIONS_POOL = None
    MYSQL_SERVER_READ_POOLNAME = 'BEOPDBReadOnlyPool'

    DLL_CONFIG_PATH = 'lib/config'
    DLL_NAME = 'lib/DataAnalysis.dll'
    USE_ALI_PUBLIC = True

    TOKEN_WHITE_LIST = ['boardtest']
    INTERNAL_CONFIG_ADDR = '120:55:113:116:27018'
    MQ_ADDRESS = '10.0.0.8'
    MQ_USERNAME = 'beopweb'
    MQ_PASSWORD = 'RNB.beop-2013'

    DATABASE_BUFFER = 'beopdatabuffer'

    MEMCACHE_KEY_PREFIX = 'expert'
    # 这里替换为连接的实例host和port
    REDIS_HOST = 'rnbtech.redis.cache.chinacloudapi.cn'
    REDIS_PORT = 6379
    # 这里替换为实例id和实例password
    REDIS_PWD = 'Ny/HnFe7nBUR18t+aeatzbOEQJMX1skGB//Rns2aw6o='
    MONGO_HEARTBEAT_REQUIRED = True

    WEATHER_DB_IP = '101.37.90.188:27018'
    
    EXPERT_MODBUSSERVER_URL = 'http://42.159.251.169:5001'
    EXPERT_OBIXSERVER_URL = 'http://42.159.251.169:5002'


class AzureUS(Config):
    LOGGER = 'prod'
    DATABASE = 'beopdoengine'

    HOST = '10.0.0.13'
    USERNAME = 'root'
    PASSWORD = 'RNB.beop-2013'
    DB_POOL_NAME = 'BEOPDBPool'
    INIT_CONNECTIONS_POOL = None

    MYSQL_SERVER_READ = '10.0.0.12'
    MYSQL_SERVER_READ_USERNAME = 'root'
    MYSQL_SERVER_READ_PASSWORD = 'RNB.beop-2013'
    MYSQL_SERVER_READ_CONNECTIONS_POOL = None
    MYSQL_SERVER_READ_POOLNAME = 'BEOPDBReadOnlyPool'

    DLL_CONFIG_PATH = 'lib/config'
    DLL_NAME = 'lib/DataAnalysis.dll'
    USE_ALI_PUBLIC = True

    TOKEN_WHITE_LIST = ['boardtest']
    INTERNAL_CONFIG_ADDR = '120.55.113.116:27018'
    MQ_ADDRESS = '10.0.0.14'
    MQ_USERNAME = 'beopweb'
    MQ_PASSWORD = 'RNB.beop-2013'

    DATABASE_BUFFER = 'beopdatabuffer'

    MEMCACHE_KEY_PREFIX = 'expert'
    # 这里替换为连接的实例host和port
    REDIS_HOST = 'usredis.redis.cache.windows.net'
    REDIS_PORT = 6379
    # 这里替换为实例id和实例password
    REDIS_PWD = 'X+0rTyQymbjT7G26/mQzXj3PZvrUkYB73oagFnHnFfs='
    MONGO_HEARTBEAT_REQUIRED = True

    WEATHER_DB_IP = '10.0.0.11:27019'
    EXPERT_MODBUSSERVER_URL = 'http://10.0.0.5:5001'
    EXPERT_OBIXSERVER_URL = 'http://10.0.0.5:5002'


Config = {
    "default": Config(),
    "test": TestConfig(),
    "development": DevelopmentConfig(),
    "aliyun_cn": ProductionConfig(),
    "standby": StandbyConfig(),
    "azure_cn": Azure(),
    "azure_us": AzureUS(),
    'development_tony': DevelopmentConfig_tony(),
    'development_rush': DevelopmentConfig_rush(),
    'development_may': DevelopmentConfig_may()
}