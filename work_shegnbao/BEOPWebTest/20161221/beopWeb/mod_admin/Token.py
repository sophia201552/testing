__author__ = 'liqian'
from beopWeb.mod_common.Utils import *
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta
from beopWeb import app


class Token:
    db_name = app.config.get('DATABASE') or 'beopdoengine'
    table_name = 'token'

    class TokenNotFound(Exception):
        def __init__(self, user_id=None, token_type=None, token_value=None):
            message = 'token is not found, userId: %s, toke type: %s, token value: %s ' % (
                user_id, token_type, token_value)
            super(Token.TokenNotFound, self).__init__(message)
            self.userId = user_id
            self.tokenType = token_type
            self.tokenValue = token_value

    class TokenType:
        INVITE = 0
        RESET_PASSWORD = 1
        APPLY = 3

    class TokenDuration:
        INVITE = timedelta(weeks=1)
        RESET_PASSWORD = timedelta(hours=1)
        APPLY = timedelta(hours=1)

    @staticmethod
    def generate_token(token_seed):
        return generate_password_hash(str(token_seed))

    @staticmethod
    def add_token(user_id, token_seed, token_type):
        if token_type is None:
            raise Exception('token type is none')
        if not token_seed:
            token_seed = datetime.now().ctime()
        token_value = Token.generate_token(token_seed)
        create_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        db_helper = Utils.DbHelper()
        success = db_helper.insert(Token.db_name, Token.table_name,
                                   {'userid': user_id, 'token': token_value, 'type': token_type,
                                    'createDate': create_time})
        if success:
            return token_value
        else:
            return None

    @staticmethod
    def query_token(fields, query):
        db_helper = Utils.DbHelper()
        return db_helper.query_one(Token.db_name, Token.table_name, fields, query)

    @staticmethod
    def update_token(data, where=None):
        db_helper = Utils.DbHelper()
        if 'createDate' not in data and 'createdate' not in data:
            data['createDate'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return db_helper.update(Token.db_name, Token.table_name, data, where)

    @staticmethod
    def get_token_duration(token_type):
        if token_type == Token.TokenType.INVITE:
            return Token.TokenDuration.INVITE
        elif token_type == Token.TokenType.APPLY:
            return Token.TokenDuration.APPLY
        elif token_type == Token.TokenType.RESET_PASSWORD:
            return Token.TokenDuration.RESET_PASSWORD
        else:
            return None

    @staticmethod
    def is_token_expired(user_id, token_type):
        if token_type is None:
            raise Exception('token type is None')
        token_duration = Token.get_token_duration(token_type)
        if not token_duration:
            raise Exception('token type ' + token_type + ' is not defined')

        token = Token.query_token(('createDate',), {'userId': user_id, 'type': token_type})
        if not token:
            raise Token.TokenNotFound(user_id, token_type)
        else:
            token_create_date = token.get('createDate')
            return token_create_date + token_duration < datetime.now()




