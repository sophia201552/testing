# -*- encoding=utf-8 -*-
__author__ = 'yan'

from datetime import datetime

from ExpertContainer.dbAccess.ConfigMongoDBAccess import ConfigMongoDBAccess
from ExpertContainer import app
from ExpertContainer.api.LogOperator import LogOperator
from ExpertContainer.api.ArchiveManager import ArchiveManager
import logging


class errorLog:
    _logger = LogOperator()

    @classmethod
    def writeLog(cls, projId, logText, toFile, point_name='', type=''):
        logging.error("<point_name=%s><type=%s> %s", point_name, type, logText)

        if point_name == '':
            pass
        elif type == 'diag':
            ArchiveManager.add_error_log(projId, datetime.now(), logText, point_name, type)
        else:
            ArchiveManager.add_error_log(projId, datetime.now(), logText, point_name)
