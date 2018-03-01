__author__ = 'win7'
from datetime import datetime
import logging

from beopWeb.mod_common.DbEntity import DbEntity
from beopWeb.BEOPMySqlDBContainer import BEOPMySqlDBContainer
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_admin.Project import Project
from beopWeb import app


class RealTimeData(DbEntity):
    db_name = 'beopdatabuffer'
    raw_db_name = app.config.get('DATABASE')
    fields = ('time', 'pointname', 'pointvalue', 'flag')

    def __init__(self, project_id=None, db_name=None):
        super().__init__()
        self.project_id = project_id
        if db_name:
            rt_project_db_name = db_name
        else:
            rt_project_db_name = Project.get_mysql_table_name(self.project_id)

        self.rtdata_table_name = 'rtdata_%s' % self.project_id
        self.rtdata_vpoint_table_name = 'rtdata_%s_vpoint' % self.project_id
        self.rtdata_raw = 'rtdata_' + str(rt_project_db_name)
        self.table_name = self.get_real_time_data_db_name()
        self.alarm_rtdata_table_name = 'alarm_rtdata_%s' % self.project_id

    def get_real_time_data_db_name(self):
        return '(select time, pointname, pointvalue, flag from %s UNION all select time, pointname, pointvalue, flag from %s) realtimeTable ' % (
            self.rtdata_table_name, self.rtdata_vpoint_table_name)

    def _real_time_data_list_handle(self, data_list):
        ret = []
        if not data_list:
            return ret
        # 数据是否已经封装成了dict形式
        is_data_wrapped = isinstance(data_list[0], dict)

        def data_filter(d_key, d_value):
            if isinstance(d_value, datetime):  # 时间格式化,去掉秒
                return d_value.strftime(Utils.datetime_without_second)
            # 如果数据中是null或者none统一为none
            if d_key == 'pointvalue' and (str(d_value).lower() == 'null' or str(d_value).lower() == 'none'):
                return 'None'
            return d_value

        for data in data_list:
            ret_item = {}
            if is_data_wrapped:
                for key, value in data.items():
                    ret_item[key.strip()] = data_filter(key, value)
            else:
                for key, value in zip(self.fields, data):
                    ret_item[key.strip()] = data_filter(key, value)
            ret.append(ret_item)

        return ret

    def search_raw(self, text, flag, offset, num, order):
        return self.search(text, flag, offset, num, order, self.raw_db_name, self.rtdata_raw)

    def search(self, text, flag, offset, num, order, db_name=None, table_name=None):
        if not order:
            order = 'pointname asc'

        if flag is None:
            flag = ' 1=1 '
        else:
            if int(flag) == 0:
                flag = ' (flag=0 or flag is NULL) '
            else:
                flag = ' flag=' + str(flag)

        if not table_name:
            table_name = self.table_name

        if not db_name:
            db_name = self.db_name

        db = BEOPMySqlDBContainer()
        count_sql = 'select count(pointname) from ' + table_name

        if text:
            count_sql += ' WHERE pointname REGEXP "%s"' % Utils.handle_mysql_search_text(text)

        if text:
            count_sql += " AND " + flag
        else:
            count_sql += " WHERE " + flag

        count_rv = db.op_db_query(db_name, count_sql)
        count = count_rv[0][0] if count_rv else 0
        if not count:
            return [], 0

        sql = 'select ' + ','.join(self.fields) + ' from ' + table_name

        if text:
            sql += ' WHERE pointname REGEXP %s'
        if flag:
            if text:
                sql += " AND" + flag
            else:
                sql += " WHERE" + flag

        sql += ' order by ' + order + ' limit %s,%s'

        if text:
            rv = db.op_db_query(db_name, sql,
                                (Utils.handle_mysql_search_text(text), offset, num))
        else:
            rv = db.op_db_query(db_name, sql, (offset, num))

        return self._real_time_data_list_handle(rv), count

    def getBufferRTDataListWithFlagByProj(self):
        rt = {}
        try:
            dbname = 'beopdatabuffer'
            tableName = 'rtdata_%s' % (self.project_id,)
            tableName_vpoint = 'rtdata_%s_vpoint' % (self.project_id,)
            q = 'select time, pointname, pointvalue,flag from %s UNION all select time, pointname, pointvalue,flag from %s' % (
                tableName, tableName_vpoint)

            db = BEOPMySqlDBContainer()
            rvQuery = db.op_db_query(dbname, q, ())
            rt = [dict(time=x[0], pointname=x[1], pointvalue=x[2], flag=x[3]) for x in rvQuery]
            return rt
        except Exception as e:
            print('getBufferRTDataByProj error:' + e.__str__())
            logging.error(e)
        return rt

    def advance_search_raw(self, text, flag=None, offset=None, num=None, order=None):
        return self.advance_search(text, flag, offset, num, order, self.raw_db_name, self.rtdata_raw)

    def advance_search(self, text, flag, offset=None, num=None, order=None, db_name=None, table_name=None):
        if not order:
            order = 'pointname asc'

        if not text:
            text = ' 1=1 '

        if flag is None:
            flag = ' 1=1 '
        else:
            if int(flag) == 0:
                flag = ' (flag=0 or flag is NULL) '
            else:
                flag = ' flag=' + str(flag)

        if not table_name:
            table_name = self.table_name

        if not db_name:
            db_name = self.db_name

        db = BEOPMySqlDBContainer()
        count_sql = 'select count(pointname) from ' + table_name
        count_sql += ' where %s' % text + ' AND ' + flag

        count_rv = db.op_db_query(db_name, count_sql)
        count = count_rv[0][0] if count_rv else 0
        if not count:
            return [], 0
        sql = 'select ' + ','.join(self.fields) + ' from ' + table_name
        sql += ' where ' + text + ' AND ' + flag + ' '
        if offset:
            sql += ' order by ' + order + ' limit ' + str(offset) + ',' + str(num) + ''

        rv = db.op_db_query(db_name, sql)

        return self._real_time_data_list_handle(rv), count

    def is_exist(self, point_name):
        return bool(self.get_by_name(point_name))

    def get_by_name(self, point_name):
        if point_name:
            point_name = point_name.strip()
        return self.query_one(self.fields, where=('pointname = %s', [point_name]))

    def update_data(self, point_name, update_model, flag=None):
        logging.info('修改实时点：' + str(update_model))
        from beopWeb.mod_cxTool.PointTable import CloudPointType

        if flag is not None:
            if flag == CloudPointType.CALC_POINT or flag == CloudPointType.MAPPING_POINT:
                return self.db_helper.update(self.db_name, self.rtdata_table_name, update_model,
                                             ("pointname = %s and flag = %s", (point_name, flag)))
            elif flag == CloudPointType.VIRTUAL_POINT:
                return self.db_helper.update(self.db_name, self.rtdata_vpoint_table_name, update_model,
                                             ("pointname = %s and flag = %s", (point_name, flag)))
        else:
            result_rt = self.db_helper.update(self.db_name, self.rtdata_table_name, update_model,
                                              ("pointname = %s", (point_name,)))
            result_rp = self.db_helper.update(self.db_name, self.rtdata_vpoint_table_name, update_model,
                                              ("pointname = %s", (point_name,)))
            return result_rt & result_rp

    def add_data(self, point_name, point_value, flag, time=None):
        if not time:
            time = datetime.now()
        if self.is_exist(point_name):
            logging.info('添加实时点错误，已存在该点,DB:' + self.table_name + ',point:' + point_name)
            return False
        data_model = {
            'pointname': point_name,
            'pointvalue': point_value,
            'time': time,
            'flag': int(flag) if flag is not None else 0
        }
        logging.info('添加实时点：' + str(data_model))
        from beopWeb.mod_cxTool.PointTable import CloudPointType

        if flag is not None:
            if flag == CloudPointType.CALC_POINT or flag == CloudPointType.MAPPING_POINT:
                return self.db_helper.insert(self.db_name, self.rtdata_table_name, data_model)
            elif flag == CloudPointType.VIRTUAL_POINT:
                return self.db_helper.insert(self.db_name, self.rtdata_vpoint_table_name, data_model)
        else:
            return False

    def delete_data(self, point_name):
        if not point_name:
            return False
        else:
            if isinstance(point_name, str):
                point_name = point_name.strip()
        logging.info('删除实时点：' + str(point_name))

        where = None
        if isinstance(point_name, str):
            where = ('pointname = %s', (point_name,))
        elif isinstance(point_name, list) or isinstance(point_name, tuple):
            where = ('pointname in (%s)' % ','.join(["'" + item + "'" for item in point_name]),)
        if where:
            result_rt = self.db_helper.delete(self.db_name, self.rtdata_table_name, where)
            result_vp = self.db_helper.delete(self.db_name, self.rtdata_vpoint_table_name, where)
            return result_rt & result_vp
        else:
            return False

    def delete_data_all(self):
        logging.info('删除所有现场实时点')
        where = 'flag=0'
        result_rt = self.db_helper.delete(self.db_name, self.rtdata_table_name, where)
        result_vp = self.db_helper.delete(self.db_name, self.rtdata_vpoint_table_name, where)
        return result_rt & result_vp

    def get_all_data(self, point_type=None, point_list=None, storage_source=None):
        from beopWeb.mod_cxTool.PointTable import CloudPointType
        from beopWeb.mod_cxTool.PointTable import StorageSourceType

        if storage_source is None:
            storage_source = StorageSourceType.BUFFER

        where = None
        if point_list:
            where = ' pointname in ('
            where += ','.join(['"' + point_name + '"' for point_name in point_list if point_name])
            where += ')'
        rv = []
        table = self.table_name
        if storage_source == StorageSourceType.BUFFER:
            db_name = self.db_name
            if point_type == CloudPointType.VIRTUAL_POINT:
                table = self.rtdata_vpoint_table_name
            elif point_type == CloudPointType.MAPPING_POINT or point_type == CloudPointType.CALC_POINT:
                table = self.rtdata_table_name
        else:
            db_name = self.raw_db_name
            table = self.rtdata_raw

        rv = self.db_helper.query(db_name, table, self.fields, where=(where,))
        return self._real_time_data_list_handle(rv)

    def get_all_data_map(self, point_flag=None, point_list=None, storage_source=None):
        if point_flag is not None:
            point_flag = int(point_flag)
        all_data = self.get_all_data(point_flag, point_list, storage_source)
        return {item.get('pointname').strip(): item for item in all_data}

    def get_alarm_data(self, alarm_id_list):
        '''
           alarm_result.update({'alarm_id':alarm_1.get('alarm_id')
                                             , 'pointName':str(alarm_1.get('point'))
                                             , 'alarm_result':result_temp
                                             ,'alarm_time':data_temp.get('timeAt')
                                             ,'alarm_type':1})
        '''
        rt = {}
        try:
            dbname = 'beopdatabuffer'
            tableName = 'alarm_rtdata_%s' % (self.project_id,)
            str_condition = '1 = 1'
            if alarm_id_list:
                condition = ('alarm_id in (%s)' % ','.join(["'" + item + "'" for item in alarm_id_list]),)
                str_condition = condition[0]
            q = 'select alarm_id, pointName, alarm_result,alarm_time,alarm_type from %s where %s ' % (
                tableName, str_condition,)
            db = BEOPMySqlDBContainer()
            rvQuery = db.op_db_query(dbname, q, ())
            # rt = [dict(alarm_id=x[0], pointname=x[1], alarm_result=x[2],alarm_time=x[3],alarm_type=x[4]) for x in rvQuery]
            for x in rvQuery:
                rt[str(x[0])] = dict(alarm_id=x[0], pointname=x[1], alarm_result=x[2], alarm_time=x[3], alarm_type=x[4])
            return rt
        except Exception as e:
            print('getBufferRTDataByProj error:' + e.__str__())
            logging.error(e)
        return rt