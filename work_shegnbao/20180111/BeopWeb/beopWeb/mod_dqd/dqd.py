import logging
import re

from pandas import ExcelFile

from beopWeb.BEOPDataAccess import BEOPDataAccess
from beopWeb.MongoConnManager import MongoConnManager


class UnknownSheetKeyException(Exception):
    pass


class InvalidExcelFormat(Exception):
    pass


class DQD:
    def __init__(self, projId):
        self.projId = projId
        self.mysql_container = BEOPDataAccess.getInstance()._mysqlDBContainer
        self.cloud_point_collection = MongoConnManager.getConfigConn().mdbBb[
            'cloudPoint']
        self.data_source_collection = MongoConnManager.getConfigConn().mdbBb[
            'DataSourceAdditional']
        self.dbname = 'beopdoengine'
        self.dtu_table_name = 'dtuserver_prj'
        self.mysql_field = {
            'originalPointName': {
                'mapping': 'rt.pointname',
                'cast': str
            },
            'realtimeValue': {
                'mapping': 'rt.pointvalue',
                'cast': int
            },
            'realtimeValueUpdateTime': {
                'mapping': 'rt.time',
                'cast': str
            },
            'dtuName': {
                'mapping': 'rt.dtuname',
                'cast': str
            },
            'dtuDisplayName': {
                'mapping': 'rt.dtuname',
                'cast': str
            },
            'exchangerDisplayName': {
                'mapping': 'rt.exchangerdisplayname',
                'cast': str
            },
            'updateTimePointName': {
                'mapping': 'rt.updatetimepointname',
                'cast': str
            }
        }
        self.mongo_datasource_field = {
            'sitePointName': 'value',
            'pointAnnotation': 'alias'
        }

    def convert_set_dict(self, point_dict):
        set_dict = {}
        for k, v in point_dict.items():
            set_dict['attrP.dataattr.' + k] = v
        return set_dict

    def get_rtdata_table(self):
        get_mysql_name = '''
            SELECT mysqlname FROM project WHERE id = %s
        '''
        rt = self.mysql_container.op_db_query_one(self.dbname, get_mysql_name,
                                                  (self.projId, ))
        return 'rtdata_' + rt[0]

    def config_get(self,
                   pageIndex=0,
                   pageSize=None,
                   searchKeyName=None,
                   searchType=None,
                   searchPattern='',
                   fieldsConfigured=None,
                   sortKeyName=None,
                   sortOrder='ASC'):
        # concat mysql condition query
        condition = ''
        condition_list = []
        if searchKeyName in self.mysql_field.keys():
            if searchType == 'regex' and searchPattern:
                condition += self.mysql_field[searchKeyName]['mapping'] + ' REGEXP ' + '%s' + ' '
                condition_list.append(searchPattern)
            elif searchType == 'range' and searchPattern:
                range_value = searchPattern.split('|')
                condition += self.mysql_field[searchKeyName]['mapping'] + ' BETWEEN ' + '%s' + ' and ' + '%s' + ' '
                condition_list.append(self.mysql_field[searchKeyName]['cast'](
                    range_value[0]))
                condition_list.append(self.mysql_field[searchKeyName]['cast'](
                    range_value[1]))

        # concat mysql sort query
        sort = ''
        if sortKeyName in self.mysql_field.keys():
            sort += 'ORDER BY ' + sortKeyName + ' ' + sortOrder

        # concat mysql where
        where = 'WHERE pointname NOT LIKE "time_update%" '  # pre-defined rule
        if condition or sort:
            where += 'AND ' + condition + sort

        # query mysql rtdata table
        get_rtdata = '''
            SELECT rt.pointname as originalPointName, rt.pointvalue as realtimeValue,
                   rt.time as realtimeValueUpdateTime, rt.dtuname as dtuName, dtu.dtuRemark as dtuDisplayName,
                   rt.exchangerdisplayname as exchangerDisplayName, rt.updatetimepointname as updateTimePointName
            FROM {} rt LEFT JOIN dtuserver_prj dtu ON dtu.dtuname = rt.dtuname {}
        '''.format(self.get_rtdata_table(), where)
        if condition_list:
            mysql_rv = self.mysql_container.op_db_query(
                self.dbname,
                get_rtdata,
                tuple(condition_list),
                dictionary=True)
        else:
            mysql_rv = self.mysql_container.op_db_query(
                self.dbname, get_rtdata, dictionary=True)

        # hash mysql return
        mysql_rv_dict = { item['originalPointName']: item for item in mysql_rv }

        # init mongo aggregate
        rt_name_list = [point['originalPointName'] for point in mysql_rv]
        aggregate_query = [{
            '$match': {
                'params.mapping.point': {
                    '$in': rt_name_list
                },
                'projId': self.projId,
                'type': 4
            }
        }, {
            '$lookup': {
                'from': 'cloudPoint',
                'localField': 'value',
                'foreignField': 'name',
                'as': 'cloudPoint'
            }
        }, {
            '$project': {
                'rt_name': '$params.mapping.point',
                'alias': 1,
                'cloud_name': '$value',
                'cloudPoint': {
                    '$filter': {
                        'input': '$cloudPoint',
                        'as': 'cloudPoint_field',
                        'cond': {
                            '$and': [{
                                '$eq':
                                ['$$cloudPoint_field.projId', self.projId]
                            }]
                        }
                    }
                }
            }
        }, {
            '$match': {
                'cloudPoint': {
                    '$gt': []
                }
            }
        }, {
            '$project': {
                'rt_name': 1,
                'alias': 1,
                'cloud_name': 1,
                'attrP': {
                    '$arrayElemAt': ['$cloudPoint.attrP', 0]
                },
                'tag': {
                    '$arrayElemAt': ['$cloudPoint.tag', 0]
                },
            }
        }, {
            '$skip': int(pageSize) * (int(pageIndex) - 1)
        }, {
            '$limit': int(pageSize)
        }]

        # add mongo search key condition
        if searchKeyName in self.mongo_datasource_field.keys():
            if searchType == 'regex':
                regex = re.compile(searchPattern, re.IGNORECASE)
                aggregate_query[0]['$match'].update({
                    self.mongo_datasource_field[searchKeyName]:
                    regex
                })
            elif searchType == 'range':
                range_value = searchPattern.split('|')
                aggregate_query[0]['$match'].update({
                    self.mongo_datasource_field[searchKeyName]: {
                        '$gte': range_value[0],
                        '$lte': range_value[1]
                    }
                })

        # add tag filter
        if searchKeyName == 'tag':
            if searchType == 'regex':
                regex = re.compile(searchPattern, re.IGNORECASE)
                aggregate_query.insert(-2, {
                    '$match': {
                        'tag': {
                            '$elemMatch': {
                                '$regex': regex
                            }
                        }
                    }
                })
            elif searchType == 'list':
                aggregate_query.insert(-2, {
                    '$match': {
                        'tag': {
                            '$all': searchPattern.split(',')
                        }
                    }
                })

        # add field filter
        if fieldsConfigured:
            field_pairs = fieldsConfigured.split(',')
            for field_pair in field_pairs:
                pair = field_pair.split('|')
                field_key = pair[0]
                field_value = pair[1]
                if field_value == '1':
                    aggregate_query.insert(-2, {
                        '$match': {
                            'attrP.dataattr.' + field_key: {
                                '$gt': ''
                            }
                        }
                    })
                elif field_value == '0':
                    aggregate_query.insert(
                        -2, {
                            "$match": {
                                "$or": [{
                                    "attrP.dataattr.condition": {
                                        "$exists": 0
                                    }
                                }, {
                                    "attrP.dataattr.condition": {
                                        "$in": [None, ""]
                                    }
                                }]
                            }
                        })
                else:
                    continue

        # add mongo sort
        if sortKeyName in self.mongo_datasource_field.keys():
            mongo_sort_order = 1 if sortOrder == 'ASC' else -1
            aggregate_query.append({'$sort': {sortKeyName: mongo_sort_order}})

        # count query
        aggregate_query_count = aggregate_query[:-2] + [{
            '$group': {
                '_id': None,
                'count': {
                    '$sum': 1
                }
            }
        }]

        # query mongo aggregate
        mongo_rv = list(self.data_source_collection.aggregate(aggregate_query))
        count_rv = list(
            self.data_source_collection.aggregate(aggregate_query_count))
        count = count_rv[0]['count'] if count_rv else 0

        # return data
        configs = []
        for point_mongo in mongo_rv:
            point_mysql = mysql_rv_dict[point_mongo.get('rt_name')]
            configs.append({
                'originalPointName':
                point_mysql.get('originalPointName'),
                'sitePointName':
                point_mongo.get('cloud_name'),
                'pointAnnotation':
                point_mongo.get('alias'),
                'realtimeValue':
                point_mysql.get('realtimeValue'),
                'realtimeValueUpdateTime':
                point_mysql.get('realtimeValueUpdateTime'),
                'dtuName':
                point_mysql.get('dtuName'),
                'dtuDisplayName':
                point_mysql.get('dtuDisplayName'),
                'exchangerDisplayName':
                point_mysql.get('exchangerDisplayName'),
                'updateTimePointName':
                point_mysql.get('updateTimePointName'),
                'tag':
                point_mongo.get('tag')
                if point_mongo.get('tag') else [],
                'rule':
                point_mongo['attrP']['dataattr']
                if point_mongo.get('attrP')
                and point_mongo['attrP'].get('dataattr') else {}
            })
        data = {'total': count, 'configs': configs}
        return data

    def config_post(self, configs):
        details = []
        rt_point_list = list(configs.keys())
        cloud_point_list = list(
            self.data_source_collection.find({
                'params.mapping.point': {
                    '$in': rt_point_list
                },
                'type': 4,
                'projId': self.projId
            }, {
                '_id': 0,
                'value': 1,
                'params.mapping.point': 1
            }))
        for point_name, point_dict in configs.items():
            try:
                for cloud_point in cloud_point_list:
                    if cloud_point['params']['mapping']['point'] == point_name:
                        self.cloud_point_collection.update_one(
                            {
                                'name': cloud_point['value']
                            }, {
                                '$set': self.convert_set_dict(point_dict),
                                '$addToSet': {
                                    'tag': 'DataAttr'
                                }
                            })
            except Exception as e:
                logging.error(e.__str__)
                details.append({
                    'originalPointName': point_name,
                    'errorCode': 'ERROR: Unknown',
                    'debugMsg': e.__str__
                })

        return details

    def exchanger_data_upload(self, file_path):
        xls = ExcelFile(file_path)
        df = xls.parse(xls.sheet_names[0])
        data = df.transpose().to_dict()
        update_sql = '''
            UPDATE {} SET dtuname=%s, exchangerdisplayname=%s, updatetimepointname=%s
            WHERE pointname=%s
        '''.format(self.get_rtdata_table())
        try:
            for row in data.values():
                self.mysql_container.op_db_update(
                    self.dbname, update_sql,
                    (row['DTU'], row['exchanger'], row['time_updatePoint'],
                     row['Pointname']))
        except KeyError:
            raise InvalidExcelFormat
