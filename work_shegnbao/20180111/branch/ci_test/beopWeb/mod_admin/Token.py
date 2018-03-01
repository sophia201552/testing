'''
帐号相关Token
'''
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
        '''
        token类型
        '''
        INVITE = 0  # 邀请
        RESET_PASSWORD = 1  # 重置密码
        APPLY = 3  # 申请注册

    class TokenDuration:
        '''
        token有效期
        '''
        INVITE = timedelta(weeks=1)
        RESET_PASSWORD = timedelta(hours=1)
        APPLY = timedelta(hours=1)

    @staticmethod
    def generate_token(token_seed):
        '''
        生成token

        :param token_seed: token seed
        :return: token
        '''
        return generate_password_hash(str(token_seed))

    @staticmethod
    def add_token(user_id, token_seed, token_type, language=None, management = 0):
        '''
        给帐号添加token信息

        :param user_id: 用户ID
        :param token_seed: token seed
        :param token_type: token类型
        :return: token值
        '''
        if token_type is None:
            raise Exception('token type is none')
        if not token_seed:
            token_seed = datetime.now().ctime()
        token_value = Token.generate_token(token_seed)
        create_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        management_id = management if management > 0 else None
        token_info = {'userid': user_id, 'token': token_value, 'type': token_type,
                                    'createDate': create_time}
        if language:
            token_info.update({'language':language})
        if management_id and management_id > 0:
            token_info.update({'management':management_id})
        db_helper = Utils.DbHelper()
        success = db_helper.insert(Token.db_name, Token.table_name,token_info)
        if success:
            return token_value
        else:
            return None

    @staticmethod
    def query_token(fields, query):
        '''
        获得token

        :param fields: 自定义返回字段
        :param query: 查询条件
        :return: token
        '''
        db_helper = Utils.DbHelper()
        return db_helper.query_one(Token.db_name, Token.table_name, fields, query)

    @staticmethod
    def update_token(data, where=None):
        '''
        更新token

        :param data: 新token信息
        :param where: 更新条件
        :return: True 更新成功; False 更新失败
        '''
        db_helper = Utils.DbHelper()
        if 'createDate' not in data and 'createdate' not in data:
            data['createDate'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return db_helper.update(Token.db_name, Token.table_name, data, where)

    @staticmethod
    def get_token_duration(token_type):
        '''
        获取token有效期

        :param token_type: token类型
        :return: token有效期
        '''
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
        '''
        检测token是否过期

        :param user_id: 用户ID
        :param token_type: token类型
        :return: True token已经过期; False token没有过期
        '''
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
