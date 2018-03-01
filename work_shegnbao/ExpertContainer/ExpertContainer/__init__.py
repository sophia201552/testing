# -*- encoding=utf-8 -*-
from flask import Flask
import sys
import threading
import logging
from config import config
import os
from ExpertContainer.mod_log import log

_experts = {'d1': [], 'h1': [], 'm1': [], 'm5': []}

app = Flask(__name__, static_folder='ExportData')
log.RequestID(app)

strEnvironment = os.getenv('FLASK_CONFIG') or 'production'
logging.info('server started as %s', strEnvironment)
app.config.from_object(config[strEnvironment])
app.config['BEOPCLUSTER'] = strEnvironment

app.logger.handlers = []
app.logger.propagate = True
logging.root.handlers = []
selected_logger = logging.getLogger(app.config.get('LOGGER', 'prod'))
for handler in selected_logger.handlers:
    logging.root.addHandler(handler)
logging.root.setLevel(selected_logger.level)
selected_logger.handlers = []

logging.info("===== ExpertContainer HTTP Service starting with config %s =====", strEnvironment)
logging.info("Registering blueprints...")
from .api import expertcontainer as expert_blueprint
app.register_blueprint(expert_blueprint)
logging.info("===== Initialization Done =====")
