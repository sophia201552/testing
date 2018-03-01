import os
import uuid
import logging.config
import flask
from flask import request
from itsdangerous import TimedJSONWebSignatureSerializer as authSerializer, SignatureExpired, BadSignature


def generate_request_id():
    new_id = str(uuid.uuid4())
    return new_id


def get_request_id():
    return request.environ.get("FLASK_REQUEST_ID")


class RequestIdFilter(logging.Filter):
    def filter(self, record):
        record.request_id = get_request_id() if flask.has_request_context() else '00000000-0000-0000-0000-000000000000'
        return True


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


class ModuleFilter(logging.Filter):
    def filter(self, record):
        env = os.getenv('BEOPWEB_CONFIG')
        if env and 'development' in env and record.name != 'werkzeug':
            return True
        return 'www' in record.pathname or 'BeopWeb' in record.pathname


SECRET_KEY = 'beop.rnbtech.com.hk'


def get_user_id():
    try:
        token = request.cookies.get('token', None)
        if token:
            s = authSerializer(SECRET_KEY)
            data = s.loads(token)
            userId_token = data.get('userId')
            return userId_token
    except SignatureExpired:
        return 'SIGEXPIRED'
    except BadSignature:
        return 'SIGINVALID'
    except Exception:
        return 'Cannot get user ID from token!'


class UserIdFilter(logging.Filter):
    def filter(self, record):
        record.user_id = get_user_id() if flask.has_request_context() else 'N/A'
        return True


LOG_CONFIG = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'request_id': {
            '()': RequestIdFilter,
        },
        'user_id': {
            '()': UserIdFilter,
        },
        'module': {
            '()': ModuleFilter
        }
    },
    'formatters': {
        'default': {
            'format': '''[ %(asctime)s %(levelname)7s %(request_id)36s %(process)6s ] [ user=%(user_id)s '''
                      '''file=%(filename)s line=%(lineno)d func=%(funcName)s thread=%(threadName)s ] %(message)s''',
        },
        'debug': {
            'format': '%(message)s'
        }
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'level': 'DEBUG',
            'filters': ['request_id', 'user_id', 'module'],
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
            'filename': './log/app.log',
            'mode': 'a',
            'encoding': 'utf-8',
            'level': 'INFO',
            'formatter': 'default',
            'filters': ['request_id', 'user_id', 'module'],
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


def unhandled_exception(locals):
    logging.error('Unhandled exception! Locals: %s', locals, exc_info=True, stack_info=True)
