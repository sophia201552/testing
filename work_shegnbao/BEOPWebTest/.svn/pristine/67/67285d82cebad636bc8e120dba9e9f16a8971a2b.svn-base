import logging
from flask import Flask
from flask.ext.compress import Compress

app = Flask(__name__, static_folder='static')

app.config.from_object(__name__)
app.config.update(dict(

    Condition='20160330',  # 0: Dev, DB offline；  1: Dev, DB online；  10: Test；   '年-月-日'：Product
    DATABASE='beopdoengine',
    PROJECT_DATABASE='beopdata',
    WORKFLOW_DATABASE='workflow',
    TABLE_OP='operation_record',
    DB_POOL_NAME='BEOPDBPool',
    MAIL_SERVER='smtp.rnbtech.com.hk',
    MAIL_USERNAME='beop.cloud@rnbtech.com.hk',
    MAIL_PASSWORD='beop123456',
    MAIL_DEFAULT_SENDER=("BeOP数据诊断优化平台", "beop.cloud@rnbtech.com.hk"),
    MAIL_DEBUG=0,
    FTP_PATH='d:/FTP/beopsoft-release',
    S3DB_DIR_CLOUD='s3db/',
    DLL_CONFIG_PATH='beopWeb/lib/config',

    GZIP_ENABLE=True,
    SITE_DOMAIN='beopdemo.rnbtech.com.hk',
    DEV_ENVIRONMENT=False,

    ASSETS_JS_FILTER='rjsmin',
    ASSETS_CSS_FILTER='cssmin',

    DLLSERVER_ADDRESS='http://120.26.141.37:5000',
    BEOP_SERVICE_ADDRESS='http://120.26.141.37:5000',
    ASSETS_DEBUG=False,
    USE_ALI_PUBLIC=False,  # 为true的话，使用外网的地址，否则使用内网地址
    URL_CHECK=True,  # 是否启动url的token校验
    PERMISSION_CHECK=True,  # 是否进行权限检查

    TOKEN_EXPIRATION=10800,  # 3小时： 60 * 60 * 3
    TOKEN_WHITE_LIST=['eyJhbGciOiJIUzI1NiIsImV4cCI6MT'],  # 无需tonken验证
    MEMCACHE_HOSTLIST=['beopdemo.rnbtech.com.hk:11211'],
    OS_TYPE=0,

    INTERNAL_CONFIG_ADDR='10.168.154.6:27018',
    INTERNET_CONFIG_ADDR='120.55.113.116:27018'
))

# Release
if isinstance(app.config.get('Condition'), str):
    app.config.update(dict(
        SITE_DOMAIN='beop.rnbtech.com.hk',
        USERNAME='beopweb',
        PASSWORD='rnbtechrd',
        INIT_CONNECTIONS_POOL=10,
        HOST='rds6cde6w8oeo390pw8i.mysql.rds.aliyuncs.com',
        MYSQL_SERVER_READ='rds8961fe732pz9uw7js.mysql.rds.aliyuncs.com',
        MYSQL_SERVER_READ_USERNAME='beopweb',
        MYSQL_SERVER_READ_PASSWORD='rnbtechrd',
        MYSQL_SERVER_READ_CONNECTIONS_POOL=20,
        MYSQL_SERVER_READ_POOLNAME='BEOPDBReadOnlyPool',
        DLLSERVER_ADDRESS='http://10.51.26.71:5000',
        BEOP_SERVICE_ADDRESS='http://10.51.26.71:5000',
        MEMCACHE_HOSTLIST=['10.252.166.76:11211'],
        OS_TYPE=1
    ))
# Dev 内网数据库
elif app.config['Condition'] == 0:
    app.config.update(dict(
        DEV_ENVIRONMENT=False,
        PERMISSION_CHECK=False,  # 是否进行权限检查

        USERNAME='beopweb2',
        PASSWORD='rnbtechrd',
        MYSQL_SERVER_READ_USERNAME='beopweb2',
        MYSQL_SERVER_READ_PASSWORD='rnbtechrd',

        INIT_CONNECTIONS_POOL=2,
        HOST='192.168.1.208',
        MYSQL_SERVER_READ='192.168.1.208',
        MYSQL_SERVER_READ_CONNECTIONS_POOL=2,
        MYSQL_SERVER_READ_POOLNAME='BEOPDBReadOnlyPool',
        MONGO_SERVER_HOST='192.168.1.208:27017',

        ASSETS_DEBUG=True,
        USE_ALI_PUBLIC=True,
        URL_CHECK=False,
        MEMCACHE_HOSTLIST=['192.168.1.208:11211']
    ))

# Dev 外网数据库
elif app.config['Condition'] == 1:
    app.config.update(dict(
        PERMISSION_CHECK=False,  # 是否进行权限检查

        SITE_DOMAIN='beop.rnbtech.com.hk',
        USERNAME='beopweb',
        PASSWORD='rnbtechrd',
        INIT_CONNECTIONS_POOL=2,
        HOST='rds6cde6w8oeo390pw8io.mysql.rds.aliyuncs.com',
        MYSQL_SERVER_READ='rds8961fe732pz9uw7jso.mysql.rds.aliyuncs.com',

        MYSQL_SERVER_READ_USERNAME='beopweb',
        MYSQL_SERVER_READ_PASSWORD='rnbtechrd',
        MYSQL_SERVER_READ_CONNECTIONS_POOL=2,
        MYSQL_SERVER_READ_POOLNAME='BEOPDBReadOnlyPool',
        # MEMCACHE_HOSTLIST=['beopdemo.rnbtech.com.hk:11211'],
        MEMCACHE_HOSTLIST=['192.168.1.208:11210'],

        ASSETS_DEBUG=True,
        USE_ALI_PUBLIC=True,
        URL_CHECK=False
    ))

# Test
elif app.config['Condition'] == 10:
    app.config.update(dict(
        PERMISSION_CHECK=False,  # 是否进行权限检查
        USERNAME='beopweb',
        PASSWORD='rnbtechrd',
        INIT_CONNECTIONS_POOL=3,
        HOST='192.168.1.208',

        MYSQL_SERVER_READ='192.168.1.208',
        MYSQL_SERVER_READ_USERNAME='beopweb',
        MYSQL_SERVER_READ_PASSWORD='rnbtechrd',
        MYSQL_SERVER_READ_CONNECTIONS_POOL=7,
        MYSQL_SERVER_READ_POOLNAME='BEOPDBReadOnlyPool',
        MONGO_SERVER_HOST='192.168.1.208:27017',
        MEMCACHE_HOSTLIST=['192.168.1.208:11211'],
    ))

# Demo
elif app.config['Condition'] == 3:
    app.config.update(dict(
        SITE_DOMAIN='beop.rnbtech.com.hk',
        USERNAME='beopweb2',
        PASSWORD='rnbtechrd',
        INIT_CONNECTIONS_POOL=2,
        HOST='rds6cde6w8oeo390pw8i.mysql.rds.aliyuncs.com',
        MYSQL_SERVER_READ='rds8961fe732pz9uw7js.mysql.rds.aliyuncs.com',
        MYSQL_SERVER_READ_USERNAME='beopweb2',
        MYSQL_SERVER_READ_PASSWORD='rnbtechrd',
        MYSQL_SERVER_READ_CONNECTIONS_POOL=2,
        MYSQL_SERVER_READ_POOLNAME='BEOPDBReadOnlyPool',
        DLLSERVER_ADDRESS='http://10.51.26.71:5000',
        BEOP_SERVICE_ADDRESS='http://10.51.26.71:5000',
        MEMCACHE_HOSTLIST=['10.117.29.45:11211']
    ))

# Online beopen of US
elif app.config['Condition'] == 4:
    app.config.update(dict(
        SITE_DOMAIN='beopen.rnbtech.com.hk',
        USERNAME='beopweb2',
        PASSWORD='rnbtechrd',
        INIT_CONNECTIONS_POOL=3,
        HOST='rds6cde6w8oeo390pw8i0.mysql.rds.aliyuncs.com',
        MYSQL_SERVER_READ='rds8961fe732pz9uw7js0.mysql.rds.aliyuncs.com',
        MYSQL_SERVER_READ_USERNAME='beopweb2',
        MYSQL_SERVER_READ_PASSWORD='rnbtechrd',
        MYSQL_SERVER_READ_CONNECTIONS_POOL=3,
        MYSQL_SERVER_READ_POOLNAME='BEOPDBReadOnlyPool',
        USE_ALI_PUBLIC=True,
        MEMCACHE_HOSTLIST=['beopdemo.rnbtech.com.hk:11211']
    ))

# Online Japan
elif app.config['Condition'] == 5:
    app.config.update(dict(
        SITE_DOMAIN='beop.rnbtech.com.hk',
        USERNAME='beopweb',
        PASSWORD='rnbtechrd',
        INIT_CONNECTIONS_POOL=2,
        HOST='rds7n4949y4dwgh0q88y.mysql.rds.aliyuncs.com',
        # HOST = '10.162.105.118',

        # MYSQL_SERVER_READ='rdsdxu3bb6q36ks8iu58.mysql.rds.aliyuncs.com',
        MYSQL_SERVER_READ='121.40.197.63',
        MYSQL_SERVER_READ_USERNAME='beopweb',
        MYSQL_SERVER_READ_PASSWORD='rnbtechrd',
        MYSQL_SERVER_READ_CONNECTIONS_POOL=2,
        MYSQL_SERVER_READ_POOLNAME='BEOPDBReadOnlyPool',
    ))

app.config.from_envvar('FLASKR_SETTINGS', silent=True)

if app.config.get('GZIP_ENABLE'): Compress(app)

import beopWeb.views
import beopWeb.appDashboard
import beopWeb.spring
import beopWeb.factory
import beopWeb.observer
import beopWeb.diagnosis
import beopWeb.workflow
import beopWeb.sqlite_op

from beopWeb.mod_admin import bp_admin
from beopWeb.mod_workflow import bp_workflow
from beopWeb.mod_report import bp_report
from beopWeb.mod_cxTool import bp_pointTool
from beopWeb.mod_iot import bp_iot
from beopWeb.mod_asset import bp_asset
from beopWeb.mod_patrol import bp_patrol
from beopWeb.mod_temperature import bp_temp
from beopWeb.mod_workflow_process import bp_workflow_process
from beopWeb.mod_message import bp_message

app.register_blueprint(bp_admin)
app.register_blueprint(bp_workflow)
app.register_blueprint(bp_report)
app.register_blueprint(bp_pointTool)
app.register_blueprint(bp_iot)
app.register_blueprint(bp_asset)
app.register_blueprint(bp_patrol)
app.register_blueprint(bp_temp)
app.register_blueprint(bp_workflow_process)
app.register_blueprint(bp_message)

import beopWeb.bundle
