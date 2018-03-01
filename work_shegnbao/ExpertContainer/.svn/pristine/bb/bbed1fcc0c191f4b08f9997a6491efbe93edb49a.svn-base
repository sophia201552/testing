__author__ = 'Administrator'
from ExpertContainer import app
from ExpertContainer.dbAccess.ConfigMongoDBAccess import ConfigMongoDBAccess
from ExpertContainer.dbAccess.ErrorLogMongoDataAccess import ErrorLogMongoDataAccess


if app.config.get('BEOPCLUSTER') != 'aliyun_cn':
    configIP = app.config['INTERNET_CONFIG_ADDR']
else:
    configIP = app.config['INTERNAL_CONFIG_ADDR']
if ':' in configIP:
    addrArr = configIP.split(':')
    if len(addrArr) == 2:
        hostAddr = str(addrArr[0])
        port = int(addrArr[1])
        mongo_operator = ConfigMongoDBAccess(hostAddr, port)
else:
    raise Exception("Connect to mongodb %s failed" % configIP)

if app.config['ERRORLOG_MONGO_ADDR']:
    mongo_errorlog_operator = ErrorLogMongoDataAccess(app.config['ERRORLOG_MONGO_ADDR'], app.config['ERRORLOG_MONGO_PORT'])