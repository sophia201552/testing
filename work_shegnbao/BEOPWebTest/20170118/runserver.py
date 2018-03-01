"""
This script runs the beopWeb application using a development server.
"""
from beopWeb import app
import logging
from datetime import datetime

if __name__ == '__main__':
    logFileName = './log/serverlog%s.txt' % datetime.now().strftime('%Y-%m-%d-%H-%M')
    logging.basicConfig(filename=logFileName, level=logging.DEBUG,
                        format='%(asctime)s --- levelname:%(levelname)s filename: %(filename)s funcName:%(funcName)s '
                               'outputNumber: [%(lineno)d]  thread: %(threadName)s output msg: %(message)s',
                        datefmt='[%Y-%m-%d %H:%M:%S]')
    #socketio.run(app, '0.0.0.0', 80, use_reloader=False, debug=True)
    app.run('0.0.0.0', 80, use_reloader=False, threaded=True, debug=True)
