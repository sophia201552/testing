__author__ = 'liqian'
from beopWeb.mod_common.Utils import Utils
from beopWeb import app


class StaticsRoles:
    db_name = app.config.get('WORKFLOW_DATABASE') or 'workflow'
    table_name = 'statics_roles'

    @staticmethod
    def get_all_roles(*fields):
        return Utils.DbHelper().query(StaticsRoles.db_name, StaticsRoles.table_name, fields)