__author__ = 'yan'

import logging
from ExpertContainer.mod_log import log


class LogOperatorListen:
    def __init__(self, prefix=''):
        pass

    def writeLog_new(self, logText='', toFile=False, level=logging.INFO):
        self.writeLog(logText, toFile, level)

    def writeLog(self, logText='', toFile=False, level=logging.INFO):
        if level == logging.DEBUG:
            logging.debug(logText)
        elif level == logging.INFO:
            logging.info(logText)
        elif level == logging.WARN or level == logging.WARNING:
            logging.warning(logText)
        elif level == logging.ERROR:
            logging.error(logText)
        elif level == logging.CRITICAL:
            logging.critical(logText)


class LogOperatorListenStrategy:
    _logger = LogOperatorListen()

    def __init__(self, prefix=''):
        pass

    def writeLog(self, logText='', toFile=False, level=logging.INFO):
        LogOperatorListenStrategy._logger.writeLog(logText, toFile, level)
