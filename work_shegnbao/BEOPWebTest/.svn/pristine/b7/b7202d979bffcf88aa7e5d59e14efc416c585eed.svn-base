"""
The flask application package.
"""

from flask import Flask


app = Flask(__name__)

app.config.from_object(__name__)
app.config.update(dict(
    DEBUG=True,
    DATABASE='beopdoengine',
    PROJECT_DATABASE='beopdata',
    WORKFLOW_DATABASE='workflow',
    TABLE_INPUT='realtimedata_input',
    TABLE_OUTPUT='realtimedata_input',
    TABLE_CONFIG='logic_config',
    TABLE_STATUS='logic_status',
    TABLE_PARAM='logic_parameter',
    TABLE_RUNTIMEPARAM='logic_runtimeparam_1',
    TABLE_LOG='logic_log_1',
    TABLE_OP='operation_record',
    USERNAME='beopweb',
    PASSWORD='rnbtechrd',
    DATABASE_RECONNECT_INTERVAL=7200,
    DB_POOL_NAME='BEOPDBPool',
    MAIL_SERVER='smtp.rnbtech.com.hk',
    MAIL_USERNAME='beop.cloud@rnbtech.com.hk',
    MAIL_PASSWORD='beop123456',
    DEFAULT_MAIL_SENDER='beop.cloud@rnbtech.com.hk',
    MAIL_DEFAULT_SENDER='beop.cloud@rnbtech.com.hk',
    INIT_CONNECTIONS_POOL=10,
    FTP_PATH='d:/FTP/beopsoft-release',
    S3DB_DIR_LOCAL='d:/rnbtech/beopgatewaycore/',
    S3DB_DIR_CLOUD='s3db/',
    DLL_CONFIG_PATH='beopWeb/lib/config',
    MONGO_SERVER_HOST='121.41.33.198',
    PROJECT_CONFIG_DATABASE='Wanda_Qingdao_Business.s3db',
    GZIP_ENABLE=True,  # HOTS='10.162.105.118',
    SITE_DOMAIN='beop.rnbtech.com.hk',
    # HOST='192.168.1.230',
    HOST='114.215.172.232',
    # HOST='218.244.141.238',
    # HOST='localhost',
    #TABLE_OUTPUT='realtimedata_output', # for SAIC only
))
app.config.from_envvar('FLASKR_SETTINGS', silent=True)

try:
    from flask.ext.compress import Compress

    if app.config.get('GZIP_ENABLE'):
        Compress(app)
except ImportError:
    print("-----------can't import flask.ext.compress.-----------")

import beopWeb.views
import beopWeb.spring
import beopWeb.factory
import beopWeb.observer
import beopWeb.diagnosis
import beopWeb.workflow
import beopWeb.sqlite_op

from beopWeb.mod_admin.controllers import bp_admin

app.register_blueprint(bp_admin)