﻿__author__ = 'David'

import os
import sys
import logging
from flask import Flask
from mainService.config import Config
from mainService.log import *

app = Flask(__name__, static_folder='static')
log.RequestID(app)

strEnvironment = os.getenv('FLASK_CONFIG', 'default')

app.config.from_object(Config[strEnvironment])
app.config['BEOPCLUSTER'] = strEnvironment

app.logger.handlers = []
app.logger.propagate = True

logging.root.handlers = []
selected_logger = logging.getLogger(app.config.get('LOGGER', 'prod'))
for handler in selected_logger.handlers:
    logging.root.addHandler(handler)
logging.root.setLevel(selected_logger.level)
selected_logger.handlers = []

logging.info("====== server started as %s ======", strEnvironment)
logging.info("Root logger is equipped with %s" % [handler.__class__.__name__ for handler in logging.root.handlers])
app.logger.info('*** TEST app.logger [ OK ] ***')

try:
    if app.config.get("REFRESH_REDIS_AT_STARTUP"):
        logging.info("Importing BEOPDataAccess...")
        from mod_DataAccess.BEOPDataAccess import BEOPDataAccess
        logging.info("Importing RedisManager...")
        from mod_DataAccess.RedisManager import RedisManager

        logging.info("Redis server: %s:%s", app.config.get("REDIS_HOST"), app.config.get("REDIS_PORT"))
        logging.info("Updating table list in Redis...")
        RedisManager.set_table_list( BEOPDataAccess.getInstance().getAllMysqlTableNames())
        logging.info("Table list updated!")
        logging.info("Updating DTU information...")
        RedisManager.set_dtuserver_list(BEOPDataAccess.getInstance().getDTUProjectList())
        RedisManager.set_dtuserver_info_list(BEOPDataAccess.getInstance().getDTUProjectInfoList())
        logging.info("DTU inforamtion updated!")
    else:
        logging.info("REFRESH_REDIS_AT_STARTUP is not set, skip updating redis at startup.")

    # Initialize WEB APIs
    logging.info("Registering WEB APIs...")
    import mainService.Views
    import mainService.AnalysisServer
    import mainService.DataServer
    import mainService.DiagnosisServer

    logging.info("Registering blueprints...")
    from mod_DTU import bp_dtu
    from mod_MsgQueue import bp_mq
    from mod_Modbus import bp_modbus,bp_terminal
    from mod_weather import bp_weather

    app.register_blueprint(bp_dtu)
    app.register_blueprint(bp_mq)
    app.register_blueprint(bp_modbus)
    app.register_blueprint(bp_terminal)
    app.register_blueprint(bp_weather)
    logging.info("Blueprints registered.")
    logging.info("====== server initialization finished successfully ======")
except Exception:
    logging.error("Failed to initialize BeopService", exc_info=True, stack_info=True)
    raise Exception("Failed to initialize BeopService!").with_traceback(sys.exc_info()[2])
