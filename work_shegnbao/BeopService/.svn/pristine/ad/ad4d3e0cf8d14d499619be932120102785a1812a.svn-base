__author__ = 'David'

from mainService import app
from mod_Common.Utils import Utils


class StaticRelate:
    db_name = app.config.get('WORKFLOW_DATABASE') or 'workflow'
    table_name = 'statics_relate'

    @staticmethod
    def get_group_id_by_user_id(user_id):
        db_helper = Utils.DbHelper()
        group_id_list = db_helper.query(StaticRelate.db_name, StaticRelate.table_name, ['projectid'],
                                        {'userid': user_id})
        return list(set(group_id_list))

    @staticmethod
    def get_group_by_user_id(user_id, *fields):
        sql = 'SELECT distinct ' + ','.join(fields) + \
              ' from ' + StaticRelate.table_name + \
              ' left join transaction_group transaction_group on projectid = transaction_group.id where userid=%s'
        rv = Utils.DbHelper().db.op_db_query(StaticRelate.db_name, sql, (user_id,))
        return [{key: value for key, value in zip(fields, group)} for group in rv]

    @staticmethod
    def get_user_in_group(group_id, *fields):
        sql = 'SELECT ' + ','.join(fields) + \
              ' from ' + StaticRelate.table_name + ' as sr ' \
                                                   'left join statics_roles r on sr.roleid = r.id , ' \
                                                   'beopdoengine.user u ' \
                                                   'where userid = u.id and projectid=%s'
        rv = Utils.DbHelper().db.op_db_query(StaticRelate.db_name, sql, (group_id,))
        return [
            {key: 'http://images.rnbtech.com.hk' + value if key == 'userpic' else value for key, value in zip(fields, group)}
            for group in rv]

    @staticmethod
    def get_user_in_group_and_role(group_id, role_id, *fields):
        sql = 'SELECT ' + ','.join(fields) + \
              ' from ' + StaticRelate.table_name + ' as sr ' \
                                                   'left join statics_roles r on sr.roleid = r.id , ' \
                                                   'beopdoengine.user u ' \
                                                   'where userid = u.id and projectid=%s and roleid=%s'
        rv = Utils.DbHelper().db.op_db_query(StaticRelate.db_name, sql, (group_id, role_id))
        return [{key: value for key, value in zip(fields, group)} for group in rv]