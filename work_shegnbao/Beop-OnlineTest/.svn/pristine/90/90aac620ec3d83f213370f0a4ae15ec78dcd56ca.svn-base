__author__ = 'golding'

from interfaceTest.config import user_conf
import os
from flask import Flask

app = Flask(__name__)



#默认配置
strEnv = os.getenv('BEOPWEB_CONFIG')
if not strEnv:
    print('BEOPWEB_CONFIG environment variable not found, please add it.')
    strEnv = 'default'
strRunConfig = strEnv
if user_conf.get(strRunConfig) is not None:
    app.config.from_object(user_conf[strRunConfig])
else:
    print('user %s\'s config is not found' % strEnv)
    app.config.from_object(user_conf['default'])

