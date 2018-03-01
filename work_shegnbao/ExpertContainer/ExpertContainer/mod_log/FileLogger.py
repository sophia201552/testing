# -*- coding:utf-8 -*-
"""
该文件仍在完善
该类为处理log日志的封装类，分文件夹来管理，文件夹以天为单位自动创建，
创建该类的对象，会在程序运行目录下，创建以个“log”文件夹，然后在该
文件夹下创建“2017-01-01”格式的文件夹，每天一个。在该文件夹下写入
全部的log文件，并可以设置文件切分的大小，程序会自动分割等大小的文件。
"""

import sys
import os
import datetime
import logging
import logging.handlers
import threading
from ExpertContainer.mod_log import log


class FileLogger:
    def __init__(self, filename='', dirName='log'):
        pass

    def writeLog(self, strlog='', level=logging.INFO):
        if level == logging.DEBUG:
            logging.debug(strlog)
        elif level == logging.INFO:
            logging.info(strlog)
        elif level == logging.WARN or level == logging.WARNING:
            logging.warning(strlog)
        elif level == logging.ERROR:
            logging.error(strlog)
        elif level == logging.CRITICAL:
            logging.critical(strlog)
