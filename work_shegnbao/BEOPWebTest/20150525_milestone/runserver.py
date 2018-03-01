"""
This script runs the beopWeb application using a development server.
"""
import os, sys
from os import environ, listdir, path, unlink, remove, makedirs, stat
import time
import logging
from beopWeb import app
import sqlite3
from beopWeb.views import *
from beopWeb.BEOPDataAccess import *
from beopWeb.BEOPDataAccess import BEOPDataAccess
from beopWeb.BEOPSqliteAccess import *


if __name__ == '__main__':
    #prepareResource(True)
    HOST = environ.get('SERVER_HOST', 'localhost')
    now = datetime.now()

    logFileName = './log/serverlog%s.txt' % now.strftime('%Y-%m-%d-%H-%M')
    logging.basicConfig(filename=logFileName, level=logging.ERROR,format='levelname:%(levelname)s filename: %(filename)s '
                             'outputNumber: [%(lineno)d]  thread: %(threadName)s output msg: %(message)s'
                             ' - %(asctime)s', datefmt='[%d/%b/%Y %H:%M:%S]')
    app.run('0.0.0.0', 80, use_reloader=False, threaded=True, debug=True)