'''
项目类
'''
__author__ = 'liqian'

import json
import logging
from beopWeb.BEOPMySqlDBContainer import BEOPMySqlDBContainer
from beopWeb import app
from beopWeb.mod_common.DbEntity import DbEntity


class Project(DbEntity):
    UserList = []
    db_name = app.config.get('DATABASE') or 'beopdoengine'
    table_name = 'project'
    db = BEOPMySqlDBContainer()
    fields = ('id', 'name_en', 'name_cn', 's3dbname', 'mysqlname', 'update_time', 'latlng', 'address', 'name_english',
              'weather_station_id', 'pic', 'is_advance', 'logo', 'time_format','i18n')

    def get_all_project(self):
        """
        获取数据库中所有项目的信息

        :return: 查询到底所有项目数据
        """
        return self.query(self.fields)

    def get_project_by_db_name(self, db_name):
        """
        根据项目的实时数据DB名来获取项目信息

        :param db_name: 实时数据存放的DB名, 既project表中的mysqlname字段
        :return: mysqlname字段为参数db_name值的项目信息
        """
        return self.query_one(self.fields, where=('mysqlname=%s', (db_name,)))

    def get_project_by_code(self, code):
        """
        根据项目代码获取项目信息

        :param code: 项目代码, 既project表中的name_en字段
        :return: name_en字段为参数code值的项目信息
        """
        return self.query_one(self.fields, where=('name_en=%s', (code,)))

    def get_all_project_map(self):
        """
        获取项目的映射表

        :return: 返回所有的项目的以项目ID为key值, 以项目信息为value的映射表
        """
        projects = self.get_all_project()
        return {project.get('id'): project for project in projects}

    def get_auth_projects_by_user_id(self, user_id):
        """
        获取用户被授权的项目列表

        :param user_id: 用户ID
        :return: 用户被授权的项目列表
        """
        sql = 'select distinct ' + ','.join(['p.' + x for x in self.fields]) + \
              ' from user_role ur ' \
              'left join role_project rp on ur.roleId = rp.id ' \
              'left join project p on p.id = rp.projectId where ur.userId = %s'
        rv = Project.db.op_db_query(Project.db_name, sql, (user_id,))
        return [{key: value for key, value in zip(self.fields, project)} for project in rv]

    @staticmethod
    def set_delete_flag_by_project_id(project_id):
        """
        设置项目被删除. 通过设置项目表project中的is_delete来删除项目.

        :param project_id: 被删除项目的项目ID
        :return: 是否设置删除成功
        """
        sql = 'update ' + Project.table_name + ' set is_delete = 1 where id=%s'
        return Project.db.op_db_update(Project.db_name, sql, (project_id,))

    @staticmethod
    def get_project_health_config(projId):
        """
        获取项目健康率配置
        :param projId:
        :return:
        """
        try:
            rv = {}
            sql = 'select prop_value from project_properties where proj_id = %s AND prop_name="healthConfig"' % str(projId)
            dbrv = Project.db.op_db_query(Project.db_name, sql)
            if not dbrv:
                sql_default_config = 'select prop_value from project_properties where proj_id = "0" AND prop_name="healthConfig"'
                dbrv = Project.db.op_db_query(Project.db_name, sql_default_config)
            return json.loads(dbrv[0][0])
        except Exception as e:
            print('get_project_health_config error: ' + e.__str__())
            return {}

    @staticmethod
    def get_project_detail_by_projId(projId):
        """
        获取项目的详细信息
        :param projId:
        :return:
        """
        try:
            rv = {}
            projProps = Project.get_project_properties(projId, includeProjId=False)
            rv.update(projProps)
            if "area" not in rv:
                rv["area"] = ''
            if "insertTime" not in rv:
                rv["insertTime"] = ''
            if "source" not in rv:
                rv["source"] = ''
            if "system" not in rv:
                rv["system"] = ''
            if "type" not in rv:
                rv["type"] = ''
            projSql = "select name_cn, name_en, address, pic from project where id=%s" % str(projId)
            proj_dbrv = Project.db.op_db_query(Project.db_name, projSql)
            for item in proj_dbrv:
                rv["name_cn"] = item[0]
                rv["name_en"] = item[1]
                rv["address"] = item[2]
                rv["pic"] = item[3]
            return rv
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
            return {}

    @staticmethod
    def get_project_category_count_by_projIds(projIds):
        """
        获取传入的项目列表中种类的数量
        :param projIds:
        :return: {
            "office_building": 12,
            "factory": 10,
            "hotel": 5,
            "market": 3
            }
        """
        rv = {}
        type_count = {}
        sql = 'select prop_value from project_properties where proj_id in %s and prop_name="type"' % (str(projIds).replace('[', '(').replace(']', ')'))
        dbrv = Project.db.op_db_query(Project.db_name, sql)
        for item in dbrv:
            if item[0]:
                firstType = item[0].split(',')[0]
                if firstType in type_count:
                    type_count[firstType] += 1
                else:
                    type_count[firstType] = 1
        first_four = sorted(type_count.items(), key=lambda a_tuple: a_tuple[1], reverse=True)[0:4]
        return {item[0]:item[1] for item in first_four}

    @staticmethod
    def get_projects_total_area(projIds):
        """
        获取项目列表的总面积
        :param projIds:
        :return:
        """
        rv = 0
        sql = 'select prop_value from project_properties where proj_id in %s and prop_name="area"' % (str(projIds).replace('[', '(').replace(']', ')'))
        dbrv = Project.db.op_db_query(Project.db_name, sql)
        for item in dbrv:
            if item[0]:
                rv += int(item[0])
        return rv

    @staticmethod
    def get_projects_by_user_id(user_id, *obj):
        """
        获取用户被授权的项目列表, 可自定义返回字段

        :param user_id: 用户ID
        :param obj: 返回项目列表的自定义字段
        :return: 项目列表
        """
        sql = 'select distinct ' + ','.join(['p.' + x for x in obj]) + \
              ' from user_role ur ' \
              'left join role_project rp on ur.roleId = rp.id ' \
              'left join project p on p.id = rp.projectId where ur.userId = %s'
        rv = Project.db.op_db_query(Project.db_name, sql, (user_id,))
        return [{key: value for key, value in zip(obj, project)} for project in rv]

    def get_project_by_id(self, project_id, fields=None):
        """
        根据项目ID获取项目, 可自定义返回字段

        :param project_id: 项目ID
        :param fields: 返回项目的自定义字段
        :return: 项目信息
        """
        if not fields:
            fields = self.fields
        return self.query_one(fields, where=('id=%s', (project_id,)))

    def get_active_project_ids(self):
        id_dict = self.query(['id'], where=('is_delete = 0',))
        result = [item.get('id') for item in id_dict]
        return result

    @staticmethod
    def get_all_user_id_list_by_project_id(project_id):
        """
        根据项目ID获取所有此项目授权的用户ID信息

        :param project_id: 项目ID
        :return: 授权项目ID对应项目的所有用户ID列表
        """
        sql = "select  distinct userId from user_role ur left join role_project rp on ur.roleId = rp.id where rp.projectId = %s"
        rv = Project.db.op_db_query(Project.db_name, sql, [project_id])
        return [rv_item[0] for rv_item in rv] if rv else []

    @staticmethod
    def get_mysql_table_name(project_id):
        """
        根据项目ID获取实时数据库名称, 既project表中mysqlname字段

        :param project_id: 项目ID
        :return: 项目ID对应项目的实时数据库名称
        """
        sql = "select mysqlname from project where id=%s"
        rv = Project.db.op_db_query_one(Project.db_name, sql, [project_id])
        return rv[0] if rv else None

    @staticmethod
    def get_project_properties(projId, **kwargs):
        includeProjId = kwargs.get('includeProjId', True)
        includeSystemProperties = kwargs.get('includeSystemProps', False)
        projPropsMeta = app.config.get('PROJ_PROPS_META')
        dictRet = {}
        try:
            sql = 'select prop_name, prop_value from project_properties where proj_id = %d;' % (int(projId))
            dbrv = Project.db.op_db_query(Project.db_name, sql)
            for item in dbrv:
                propName = item[0]
                propValue = item[1]
                propMeta = projPropsMeta.get(propName, {})
                isSystemProp = propMeta.get('isSystemProp')
                if includeSystemProperties or not isSystemProp:
                    dictRet[propName] = propValue
            if includeProjId:
                dictRet['proj_id'] = projId
        except Exception:
            logging.error("Failed to get properties for project %s", projId, exc_info=True, stack_info=True)
        return dictRet

    @staticmethod
    def get_projects_properties(proj_ids, **kwargs):
        includeSystemProperties = kwargs.get('includeSystemProps', False)
        projPropsMeta = app.config.get('PROJ_PROPS_META')
        dictRet = {}
        try:
            proj_ids_text = ', '.join([str(proj_id) for proj_id in proj_ids])
            sql = 'select proj_id, prop_name, prop_value from project_properties where proj_id in (%s);' % proj_ids_text
            dbrv = Project.db.op_db_query(Project.db_name, sql)
            for row in dbrv:
                proj_id = row[0]
                if not dictRet.get(proj_id):
                    dictRet[proj_id] = {}
                propName = row[1]
                propValue = row[2]
                propMeta = projPropsMeta.get(propName, {})
                isSystemProp = propMeta.get('isSystemProp')
                if includeSystemProperties or not isSystemProp:
                    dictRet[proj_id][propName] = propValue
        except Exception:
            logging.error("Unhandled exception! Locals: %s", locals(), exc_info=True, stack_info=True)
        return dictRet

    @staticmethod
    def query_project_language_countryCode(projId):
        rv = {"defaultLanguage": None, "countryCode": None}
        try:
            sql = '''
                SELECT
                     prop_name,
                     prop_value
                FROM project_properties
                WHERE proj_id = %s and prop_name in ("defaultLanguage", "country_name_twoletter")
            ''' % (projId,)
            dbrv = Project.db.op_db_query(Project.db_name, sql)
            for item in dbrv:
                if item[0] == 'country_name_twoletter':
                    rv['countryCode'] = item[1]
                elif item[0] ==  'defaultLanguage':
                    rv['defaultLanguage'] = item[1]
            if not rv['defaultLanguage']:
                if rv['countryCode']:
                    rv['defaultLanguage'] = app.config('country_language_map').get(rv['countryCode'], 'zh')
                else:
                    get_default_language_sql = '''
                        SELECT
                             prop_value
                        FROM
                             project_properties
                        WHERE
                             proj_id=0
                        AND
                            prop_name="defaultLanguage"
                    '''
                    defaultLanguageRv = Project.db.op_db_query(Project.db_name, get_default_language_sql)
                    if defaultLanguageRv and defaultLanguageRv[0]:
                        rv['defaultLanguage'] = defaultLanguageRv[0][0]
            if not rv["countryCode"]:
                rv["countryCode"] = 'WW'
            return rv
        except Exception:
            logging.error("Unhandled exception! Local:%s", locals(), exc_info=True, stack_info=True)

    @staticmethod
    def set_project_properties(projId, dictData):
        rv = False
        try:
            projId = int(projId)
            sql = ''
            arrDelKey = []
            if dictData:
                condition = ''
                cnt = 0
                for key in dictData:
                    if dictData[key]:
                        temp = ''
                        if cnt > 0:
                            temp += ','
                        temp += '(%d, "%s", "%s")' % (projId, str(key), str(dictData[key]))
                        condition += temp
                        cnt += 1
                    else:
                        arrDelKey.append(str(key))
                if len(condition) > 0:
                    sql = 'replace into project_properties(proj_id, prop_name, prop_value) values' + condition + ';'
            else:
                sql = 'delete from project_properties where proj_id = %d;' % (projId)

            if len(sql) > 0:
                rv = Project.db.op_db_update(Project.db_name, sql)

            if len(arrDelKey) > 0:
                sql = ''
                condition = '('
                cnt = 0
                for key in arrDelKey:
                    if cnt > 0:
                        condition += ','
                    condition += '"%s"' % (str(key))
                    cnt += 1
                condition += ')'
                sql = 'delete from project_properties where prop_name in %s and proj_id = %d;' % (condition, projId)
                rv = Project.db.op_db_update(Project.db_name, sql)
        except Exception:
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
        return rv
