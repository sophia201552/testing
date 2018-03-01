__author__ = 'David'

from flask import request, json
import logging, time, sys, inspect
from mainService import app

def judgement_RequestTime(timeB, timeE, data = '', timeL = 10):
    try:
        ISOTIMEFORMAT='%Y-%m-%d %X'
        timeN = time.strftime(ISOTIMEFORMAT, time.localtime())
        rt = timeE - timeB
        if rt >= timeL:
            print(timeN + str(request.path) + ':Request time was too long')
            print('********' + str(data) + ':' + str(rt))
        return rt
    except Exception as e:
        print('judgement_RequestTime:' + e.__str__())
        app.logger.error('judgement_RequestTime:' + e.__str__())
        return -1

def get_current_directory():
    if sys.path:
        work_path = sys.path[0]
        return work_path
    return ''

def get_current_func_name():
    return inspect.stack()[1][3]