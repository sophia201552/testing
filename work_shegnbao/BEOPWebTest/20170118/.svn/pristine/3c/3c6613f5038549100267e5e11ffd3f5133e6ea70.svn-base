__author__ = 'liqian'
from beopWeb import app
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_common.DbEntity import DbEntity


class StaticRelate(DbEntity):
    db_name = app.config.get('WORKFLOW_DATABASE') or 'workflow'
    table_name = 'statics_relate'

    @staticmethod
    def get_group_id_by_user_id(user_id):
        db_helper = Utils.DbHelper()
        group_id_list = db_helper.query(StaticRelate.db_name, StaticRelate.table_name, ['projectid'],
                                        {'userid': user_id})
        return list(set([item.get('projectid') for item in group_id_list]))

    @staticmethod
    def get_group_by_user_id(user_id, *fields):
        sql = 'SELECT distinct ' + ','.join(fields) + \
              ' from transaction_group_user tgu left join transaction_group tg on groupId = tg.id where userid=%s or tg.creatorid=%s'
        rv = Utils.DbHelper().db.op_db_query(StaticRelate.db_name, sql, (user_id, user_id))
        return [{key: value for key, value in zip(fields, group)} for group in rv]

    def get_group_user_id_by_user_id(self, user_id):
        sql = '''select distinct userid
                  from transaction_group_user
                  where groupId in (select groupId from transaction_group_user where userid =%s union select id groupId from transaction_group where creatorId =%s)'''
        rv = Utils.DbHelper().db.op_db_query(StaticRelate.db_name, sql, (user_id, user_id,))
        result = [item[0] for item in rv]
        result.append(int(user_id))
        return result

    @staticmethod
    def get_user_in_group(group_id, *fields):
        sql = 'SELECT ' + ','.join(fields) + \
              ' from transaction_group_user as sr left join beopdoengine.user u on userid = u.id where groupid=%s'
        rv = Utils.DbHelper().db.op_db_query(StaticRelate.db_name, sql, (group_id,))
        return [
            {key: value for key, value in zip(fields, group)} for group in rv]
