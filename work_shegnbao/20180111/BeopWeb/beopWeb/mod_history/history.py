from datetime import datetime
from dateutil.relativedelta import relativedelta
from multiprocessing.dummy import Pool as ThreadPool 
import numpy as np
import pandas as pd
import json
from pandas import ExcelWriter
from bson.code import Code

from beopWeb.MongoConnManager import MongoConnManager
from beopWeb.BEOPDataAccess import BEOPDataAccess
from beopWeb.observer import do_startWorkspaceDataGenHistogram


class INVAILD_TIME_FORMAT(Exception):
    def __init__(self, timeFormat):
        self.code = 'INVAILD_TIME_FORMAT'
        self.msg = 'timeFormat shoud in [Y1, m1, d1, H1, M5], yours: ' + timeFormat


class INVALID_DSITEMID_FORMAT(Exception):
    def __init__(self, dsItemId):
        self.code = 'INVALID_DSITEMID_FORMAT'
        self.msg = 'dsItemId format shoud be "@<project_id>|<pointname>", yours: ' + dsItemId


class HistoryData:
    invalid_time_format_list = [
        'Y1',  # 1 year
        'm1',  # 1 month
        'd1',  # 1 day
        'H1',  # 1 hour
        'M5',  # 5 minutes
    ]

    def __init__(self,
                 dsItemIds,
                 timeStart=None,
                 timeEnd=None,
                 timeFormat='d1'):
        if timeFormat not in HistoryData.invalid_time_format_list:
            raise INVAILD_TIME_FORMAT(timeFormat)

        self.dsItemIds = dsItemIds  # list ["@<project_id>|<pointname>", ...]
        self.timeFormat = timeFormat
        self.timeStart = datetime.strptime(
            timeStart, '%Y-%m-%d %H:%M:%S') if timeStart else None
        self.timeEnd = datetime.strptime(
            timeEnd, '%Y-%m-%d %H:%M:%S') if timeEnd else None
        self.point_data = []
        self.time_series_real = []
        self.time_series_fetched = []
        self.mysql_container = BEOPDataAccess.getInstance(
        )._mysqlDBContainerReadOnly
        self.collection_datasourceadditional = MongoConnManager.getConfigConn(
        ).mdbBb['DataSourceAdditional']

    def parse_project_pointname(self):
        ''' parse @<project_id>|<pointname> dsItemId to point_data '''
        for dsItemId in self.dsItemIds:
            try:
                s_list = dsItemId[1:].split('|')
                self.point_data.append({
                    'project_id': int(s_list[0]),
                    'cloud_pointname': s_list[1],
                    'dsItemId': dsItemId,
                })
            except:
                raise INVALID_DSITEMID_FORMAT(dsItemId)

    def parse_real_pointname(self):
        ''' parse realpointname to point_data '''
        for point in self.point_data:
            pointname_rv = self.collection_datasourceadditional.aggregate([{
                '$match': {
                    'projId': point['project_id'],
                    'value': point['cloud_pointname'],
                    'type': 4
                }
            }, {
                '$project': {
                    '_id': 0,
                    'pointname': {
                        '$cond': {
                            'if': {
                                '$eq': ['$params.flag', 0]
                            },
                            'then': '$params.mapping.point',
                            'else': '$value'
                        }
                    }
                }
            }])
            pointname_rv = list(pointname_rv)
            point['real_pointname'] = pointname_rv[0]['pointname'] if pointname_rv else None

    def get_time_series_fetched(self, start_time, end_time):
        started = False
        prefix = []
        time_series_start_index = None
        time_series_end_index = None
        for i, time in enumerate(self.time_series_real):
            if time >= start_time and not started:
                if i == 0:
                    prefix = [self.time_series_fetched[0]]
                time_series_start_index = i
                started = True
            elif started and time >= end_time:
                time_series_end_index = i
                break
        else:
            time_series_end_index = i + 1
        return prefix + self.time_series_real[time_series_start_index:
                                              time_series_end_index]

    def parse_conn_info(self):
        ''' return dict list start_time, end_time, project_id, data_type, collection '''
        point_dict = {}
        for point in self.point_data:
            conn_info_list = BEOPDataAccess.getProjectCollection(
                point['project_id'], self.timeStart, self.timeEnd)
            point_dict[point['dsItemId']] = {}
            point_dict[point['dsItemId']]['value_list'] = []
            point_dict[point['dsItemId']]['conn_info_list'] = conn_info_list
            for conn_info in point_dict[point['dsItemId']]['conn_info_list']:
                conn_info.update(point)
        return point_dict

    def parse_time_series(self):
        if self.timeFormat == 'Y1':
            rd = relativedelta(years=1)
        elif self.timeFormat == 'm1':
            rd = relativedelta(months=1)
        elif self.timeFormat == 'd1':
            rd = relativedelta(days=1)
        elif self.timeFormat == 'H1':
            rd = relativedelta(hours=1)
        elif self.timeFormat == 'M5':
            rd = relativedelta(minutes=5)
        else:
            return TypeError('ERROR_TIMEFORMAT')

        t = self.timeStart
        while (t <= self.timeEnd):
            self.time_series_real.append(t)
            t += rd
        self.time_series_fetched = [self.timeStart - rd
                                    ] + self.time_series_real

    def get_history_data_m5(self, collection, project_id, real_pointname,
                            start_time, end_time):
        time_series = []
        if self.time_series_fetched[1] == start_time:
            need_first = True
        else:
            need_first = False
        for t in self.time_series_fetched:
            if t >= start_time and t <= end_time:
                time_series.append(t)
            elif need_first:
                time_series.append(t)
                need_first = False
        point_rv_list = list(
            collection.find({
                'pointname': real_pointname,
                'time': {
                    '$in': time_series
                }
            }, {
                '_id': 0,
                'time': 1,
                'value': 1
            }).sort('time', 1))
        time_value_dict = {
            point['time']: point['value']
            for point in point_rv_list
        }
        value_list = []
        for t in self.time_series_fetched:
            if t in time_value_dict.keys():
                value_list.append(time_value_dict[t])
            else:
                value_list.append(None)
        return value_list

    def parse_point_dict(self, point_dict):
        data = {
            'list': [],
            'timeShaft': [
                time.strftime('%Y-%m-%d %H:%M:%S')
                for time in self.time_series_real
            ]
        }
        for dsItemId, point_value_dict in point_dict.items():
            data['list'].append({
                'dsItemId': dsItemId,
                'data': point_value_dict['value_list'],
            })
        return data

    def calc_diff(self, value_list):
        a = np.array(value_list)
        diff_value_list = np.diff(a[np.not_equal(a, None)])
        is_first = True
        n = 0
        rv_list = []
        for v in value_list:
            if v is not None and not is_first:
                rv_list.append(diff_value_list[n])
                n += 1
            elif v is None:
                rv_list.append(None)
            elif is_first:
                is_first = False
        return rv_list

    def parse_timestamp(self, project_id, dt):
        sql = 'SELECT data_time_zone FROM project WHERE id = %s'
        time_zone = int(
            self.mysql_container.op_db_query_one('beopdoengine', sql,
                                                 (project_id, ))[0])
        return round(dt.timestamp() * 1000) + time_zone * 60 * 60 * 1000

    def get_history_data_v2(self, collection, project_id, real_pointname,
                            start_time, end_time):
        if self.timeFormat == 'Y1':
            time_inc = '(t.setYear(t.setYear()+1)-t.getTime())'
        elif self.timeFormat == 'm1':
            time_inc = '(t.setMonth(t.getMonth()+1)-t.getTime())'
        elif self.timeFormat == 'd1':
            time_inc = '(24*60*60*1000)'
        elif self.timeFormat == 'H1':
            time_inc = '(60*60*1000)'
        elif self.timeFormat == 'M5':
            time_inc = '(5*60*1000)'
        else:
            raise TypeError('ERROR_TIMEFORMAT')
        mapper = Code('''
            function(){{
                for (var h = 0; h <= 23; h++){{
                    for (var m = 0; m <= 59; m++){{
                        var t = this.time.getTime() + h*60*60*1000 + m*60*1000;
                        if (t >= {0} && t <= {1} && (t - {2}) % {3} == 0){{
                            emit(new Date(t) , (this.value[h] ? (this.value[h][m] ? parseFloat(this.value[h][m]) : null) : null));
                        }}
                    }}
            }}
        }}
        '''.format(
            self.parse_timestamp(project_id, start_time),
            self.parse_timestamp(project_id, end_time),
            self.parse_timestamp(project_id, start_time), time_inc))
        reducer = Code('''
                function(key, values){
                    return values[0];
                }
        ''')
        query = {
            'pointname': real_pointname,
            'time': {
                '$gte':
                start_time.replace(microsecond=0, second=0, minute=0, hour=0),
                '$lte':
                end_time.replace(microsecond=0, second=0, minute=0, hour=0)
            }
        }
        out = {'inline': 1}
        sort = {'time': 1}
        rv = collection.map_reduce(
            mapper, reducer, out=out, query=query, sort=sort)
        return [
            item['value'] for item in rv['results']
        ] if rv.get('results') else [None] * len(self.time_series_fetched)

    def get_history_data(self, data):
        value_list = []
        for conn_info in data['conn_info_list']:
            if conn_info['real_pointname'] is None:
                value_list.extend([None] * len(self.time_series_fetched))
                break
            if conn_info['data_type'] == 'm5':
                value_list.extend(
                    self.get_history_data_m5(
                        conn_info['collection'], conn_info['project_id'],
                        conn_info['real_pointname'], conn_info['start_time'],
                        conn_info['end_time']))
            elif conn_info['data_type'] == 'v2':
                value_list.extend(
                    self.get_history_data_v2(
                        conn_info['collection'], conn_info['project_id'],
                        conn_info['real_pointname'], conn_info['start_time'],
                        conn_info['end_time']))
            else:
                raise TypeError('ERROR_DATAFORMAT')
        data['value_list'] = self.calc_diff(value_list)

    def get_diff_data(self):
        # init point info and connection info
        self.parse_project_pointname()
        self.parse_time_series()
        self.parse_real_pointname()
        point_dict = self.parse_conn_info()

        # concurrent fetch data
        pool = ThreadPool(5)
        pool.map(self.get_history_data, point_dict.values())

        # parse return data
        return self.parse_point_dict(point_dict)

def write_hisdata_excel(tmp_file, dsItemIds, columnNames, timeStart, timeEnd, timeFormat):
    rv = do_startWorkspaceDataGenHistogram({
        'dsItemIds': dsItemIds,
        'timeStart': timeStart,
        'timeEnd': timeEnd,
        'timeFormat': timeFormat,
    })
    rv = json.loads(rv)
    df = pd.DataFrame({
        'time': rv['timeShaft']
    })
    data_dict = { item['dsItemId']: item['data'] for item in rv['list'] }
    for i, column_name in enumerate(columnNames):
        df[column_name] = data_dict.get(dsItemIds[i])
    writer = pd.ExcelWriter(tmp_file)
    df.to_excel(writer)
    writer.save()