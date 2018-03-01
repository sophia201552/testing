# -*- encoding=utf-8 -*-
from ExpertContainer.api.Singleton import Singleton
import logging
from ExpertContainer.mod_log import log

__author__ = 'yan'


class LogOperator(Singleton):

    def __init__(self):
        pass

    def writeLog(self, logText='', toFile=False):
        if logText is None:
            return
        logText = str(logText)
        logTextLower = logText.lower()
        if 'error' in logTextLower or 'fail' in logTextLower:
            logging.error(logText)
        else:
            logging.info(logText)


class LogOperatorStrategy(Singleton):
    _logger = LogOperator()

    def __init__(self):
        pass

    def writeLog(self, prefix='N/A', logText='', toFile=False):
        LogOperatorStrategy._logger.writeLog("[ %s ] %s", prefix, logText, toFile)