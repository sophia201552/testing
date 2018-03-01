"""
This script runs the beopWeb application using a development server.
"""
from beopWeb import app
import logging.handlers

if __name__ == '__main__':
    #socketio.run(app, '0.0.0.0', 80, use_reloader=False, debug=True)
    app.run('0.0.0.0', 80, use_reloader=False, threaded=True, debug=True)
