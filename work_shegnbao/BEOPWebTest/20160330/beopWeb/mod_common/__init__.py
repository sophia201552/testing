__author__ = 'liqian'
from beopWeb import app
from beopWeb.mod_common.I18n import I18n

i18n = I18n()

# 在jinja中使用I18n trans
@app.context_processor
def i18n_processor():
    def trans(msg_key, **args):
        return i18n.trans(msg_key, **args)

    return dict(trans=trans)
