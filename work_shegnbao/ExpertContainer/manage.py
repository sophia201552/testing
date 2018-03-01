__author__ = 'golding'

import os
from ExpertContainer import app

if __name__ == '__main__':
    app.run('0.0.0.0', 4000, use_reloader=False, threaded=True, debug=True)
