import sys
import os
import uuid
import logging.config
import flask
from flask import request


def generate_request_id():
    new_id = str(uuid.uuid4())
    return new_id


def get_request_id():
    return request.environ.get("FLASK_REQUEST_ID")


class RequestID(object):
    def __init__(self, app, header_name="X-Request-ID", generator_func=generate_request_id):
        self.app = app.wsgi_app
        self._header_name = header_name
        self._flask_header_name = header_name.upper().replace("-", "_")
        self._generator_func = generator_func
        # Change your app wsgi_app
        app.wsgi_app = self

    def __call__(self, environ, start_response):
        header_key = "HTTP_{0}".format(self._flask_header_name)
        environ.setdefault(header_key, self._generator_func())
        req_id = environ[header_key]
        environ["FLASK_REQUEST_ID"] = req_id

        def new_start_response(status, response_headers, exc_info=None):
            response_headers.append((self._header_name, req_id))
            return start_response(status, response_headers, exc_info)

        return self.app(environ, new_start_response)


def _get_log_file_name():
    if len(sys.argv) > 0:
        try:
            log_file_name = os.path.basename(sys.argv[0])
            log_file_name = log_file_name.replace('.py', '')
            if log_file_name != 'gunicorn':
                return log_file_name + '.app.log'
        except Exception:
            pass
    return 'app.log'


class RequestIdFilter(logging.Filter):
    def filter(self, record):
        record.request_id = get_request_id() if flask.has_request_context() else '00000000-0000-0000-0000-000000000000'
        return True


class ModuleFilter(logging.Filter):
    def filter(self, record):
        return 'ExpertContainer' in record.pathname


LOG_CONFIG = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'request_id': {
            '()': RequestIdFilter,
        },
        'module': {
            '()': ModuleFilter
        }
    },
    'formatters': {
        'default': {
            'format': '''[ %(asctime)s %(levelname)7s %(request_id)36s %(process)6s ] [ '''
                      '''file=%(filename)s line=%(lineno)d func=%(funcName)s thread=%(threadName)s ] %(message)s''',
        },
        'debug': {
            'format': '%(message)s'
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'level': 'DEBUG',
            'filters': ['request_id', 'module'],
            'formatter': 'default'
        },
        'console-debug': {
            'class': 'logging.StreamHandler',
            'level': 'DEBUG',
            'filters': ['module'],
            'formatter': 'debug',
        },
        'file': {
            'class': 'logging.FileHandler',
            'filename': './log/' + _get_log_file_name(),
            'mode': 'a',
            'encoding': 'utf-8',
            'level': 'INFO',
            'formatter': 'default',
            'filters': ['request_id', 'module'],
        },
    },
    'loggers': {
        'debug': {
            'handlers': ['console-debug'],
            'level': 'DEBUG',
        },
        'devtest': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
        },
        'prod': {
            'handlers': ['file'],
            'level': 'INFO',
        },
    }
}

logging.config.dictConfig(LOG_CONFIG)