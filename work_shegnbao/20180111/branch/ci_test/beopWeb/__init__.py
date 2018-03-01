﻿import os
import logging
from flask import Flask
# socket io
from flask_socketio import SocketIO
# compress
from flask_compress import Compress
from config import config
import sys

app = Flask(__name__, static_folder='static')
socketio = SocketIO(app, async_mode='eventlet')

strEnv = os.getenv('BEOPWEB_CONFIG')
if not strEnv:
    print('BEOPWEB_CONFIG environment variable not found, please add it.')
    strEnv = 'default'

strRunConfig = strEnv
bNeedPacking = False
if len(sys.argv) >= 2:
    param = sys.argv[1:]
    if 'pack' in param:
        bNeedPacking = True
    if ('production' not in param) and ('development' in strEnv):
        strRunConfig = 'developmentlocal'
else:
    if strEnv.find('development') >= 0:
        strRunConfig = 'developmentlocal'

if config.get(strRunConfig) is None:
    strRunConfig = 'default'

print('server started as %s' % (strRunConfig))
app.config.from_object(config[strRunConfig])
# David 20170801  数据集名称
app.config['BEOPCLUSTER'] = strRunConfig

app.config['ASSETS_PACKING'] = bNeedPacking
if bNeedPacking:
    app.config['ASSETS_DEBUG'] = False

if app.config.get('GZIP_ENABLE'): Compress(app)

import beopWeb.views
import beopWeb.appDashboard
import beopWeb.spring
import beopWeb.observer
import beopWeb.diagnosis
import beopWeb.sqlite_op
import beopWeb.benchmark
import beopWeb.fileManager

from beopWeb.mod_admin import bp_admin
from beopWeb.mod_workflow import bp_workflow
from beopWeb.mod_report import bp_report
from beopWeb.mod_cxTool import bp_pointTool
from beopWeb.mod_iot import bp_iot
from beopWeb.mod_asset import bp_asset
from beopWeb.mod_patrol import bp_patrol
from beopWeb.mod_temperature import bp_temp
from beopWeb.mod_message import bp_message
from beopWeb.mod_algorithm import bp_algorithm
from beopWeb.mod_cloudDiagnosis import bp_cloudDiagnosis
from beopWeb.mod_appCommon import bp_appCommon
from beopWeb.mod_tag import bp_tag
from beopWeb.mod_TaskScheduler import bp_taskScheduler
from beopWeb.mod_factory import bp_factory
from beopWeb.mod_logistics import bp_logistics
from beopWeb.mod_bill import bp_bill
from beopWeb.mod_strategy import bp_strategy
from beopWeb.mod_modbus import bp_modbus,bp_terminal
from beopWeb.mod_dataTask import bp_dataTask
from beopWeb.mod_diagnosis import bp_diagnosis
from beopWeb.mod_energy import bp_energy
from beopWeb.mod_thermalComfort import bp_thermalComfort


app.register_blueprint(bp_admin)
app.register_blueprint(bp_workflow)
app.register_blueprint(bp_report)
app.register_blueprint(bp_pointTool)
app.register_blueprint(bp_iot)
app.register_blueprint(bp_asset)
app.register_blueprint(bp_patrol)
app.register_blueprint(bp_temp)
app.register_blueprint(bp_message)
app.register_blueprint(bp_algorithm)
app.register_blueprint(bp_cloudDiagnosis)
app.register_blueprint(bp_appCommon)
app.register_blueprint(bp_tag)
app.register_blueprint(bp_taskScheduler)
app.register_blueprint(bp_factory)
app.register_blueprint(bp_logistics)
app.register_blueprint(bp_bill)
app.register_blueprint(bp_strategy)
app.register_blueprint(bp_modbus)
app.register_blueprint(bp_dataTask)
app.register_blueprint(bp_diagnosis)
app.register_blueprint(bp_energy)
app.register_blueprint(bp_thermalComfort)
app.register_blueprint(bp_terminal)
import beopWeb.bundle