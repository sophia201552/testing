"""
The flask application package.
"""

from flask import Flask
from flask.ext.compress import Compress

app = Flask(__name__)

app.config.from_object(__name__)
app.config.update(dict(
    DEBUG=True,
    DATABASE='beopdoengine',
    PROJECT_DATABASE='beopdata',
    WORKFLOW_DATABASE='workflow',
    TABLE_OP='operation_record',
    DB_POOL_NAME='BEOPDBPool',
    MAIL_SERVER='smtp.rnbtech.com.hk',
    MAIL_USERNAME='beop.cloud@rnbtech.com.hk',
    MAIL_PASSWORD='beop123456',
    MAIL_DEFAULT_SENDER=("BeOP数据诊断优化平台", "beop.cloud@rnbtech.com.hk"),
    FTP_PATH='d:/FTP/beopsoft-release',
    S3DB_DIR_CLOUD='s3db/',
    DLL_CONFIG_PATH='beopWeb/lib/config',

    GZIP_ENABLE=True,
    SITE_DOMAIN='beop.rnbtech.com.hk',
    DEV_ENVIRONMENT=False,
    USERNAME='beopweb',
    PASSWORD='rnbtechrd',
    INIT_CONNECTIONS_POOL=10,
    HOST='114.215.172.232',
    #HOST='192.168.1.208',
    MONGO_SERVER_HOST='beop.rnbtech.com.hk'  # 121.41.33.198
))
app.config.from_envvar('FLASKR_SETTINGS', silent=True)

if app.config.get('GZIP_ENABLE'):
    Compress(app)

import beopWeb.views
import beopWeb.spring
import beopWeb.factory
import beopWeb.observer
import beopWeb.diagnosis
import beopWeb.workflow
import beopWeb.sqlite_op

from beopWeb.mod_admin.controllers import bp_admin
from beopWeb.mod_workflow.controllers import bp_workflow

app.register_blueprint(bp_admin)
app.register_blueprint(bp_workflow)