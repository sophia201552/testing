__author__ = 'liqian'
import logging

from flask import session

from beopWeb import app
from beopWeb.mod_common.I18n import I18n

i18n = I18n()


# 在jinja中使用I18n trans
@app.context_processor
def i18n_processor():
    def trans(msg_key, **args):
        try:
            # if session.get('language') and session.get('language') != i18n.lang:
            #     i18n.set_lang(session.get('language'))
            if not i18n.lang:
                i18n.set_lang(session.get('language'))
            return i18n.trans(msg_key, **args)
        except Exception as e:
            logging.error(str(e))
            return msg_key

    def trans_time(time):
        try:
            # if session.get('language') and session.get('language') != i18n.lang:
            #     i18n.set_lang(session.get('language'))
            if not i18n.lang:
                i18n.set_lang(session.get('language'))
            return i18n.trans_time(time)
        except Exception as e:
            logging.error('时间转换错误' + str(e))
            return time

    return dict(trans=trans, trans_time=trans_time)
