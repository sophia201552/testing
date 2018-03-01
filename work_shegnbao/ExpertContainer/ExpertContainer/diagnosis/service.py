import time
from collections import OrderedDict
from datetime import datetime, timedelta
from ExpertContainer import app

from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from ExpertContainer.dbAccess.MongoConnManager import MongoConnManager
from ExpertContainer.dbAccess.RedisManager import RedisManager

#define table names
DB_NAME = 'diagnosis'

class TableHelper:
    ''' 诊断表帮助类 '''
    @staticmethod
    def get_entity_tablename(project_id=None):
        if project_id and int(project_id) == 293:
            return 'diagnosis_entity_old'
        return 'diagnosis_entity'

    @staticmethod
    def get_entity_fault_tablename(project_id=None):
        if project_id and int(project_id) == 293:
            return 'diagnosis_entity_fault_old'
        return 'diagnosis_entity_fault'

    @staticmethod
    def get_fault_tablename(lang='en'):
        if lang != 'en':
            return 'diagnosis_fault_zh'
        return 'diagnosis_fault'

    @staticmethod
    def get_notice_tablename(project_id=None):
        ''' 根据项目id，获取对应的 notice 表名称 '''
        if project_id and int(project_id) == 293:
            return 'diagnosis_%s_notice_old' % project_id
        return 'diagnosis_%s_notice' % project_id


class DiagnosisService:
    ''' 新版诊断 数据处理类 '''

    @classmethod
    def statistics_equipment_intact_rate_pandect_v2(cls, project_id, start_time, end_time, entity_ids, class_names, fault_ids):
        '''
        david 20170921
        获取设备健康率
        '''
        rt = []
        res = {'status': 0, 'data': [], 'message': None}
        notice_table_name = TableHelper.get_notice_tablename(project_id)
        sensor = 'Sensor'
        system_dict, equipment_system = cls.get_equipment_all(project_id)
        time_part_sql = []
        number_of_realpoint_count = None

        if start_time:
            time_part_sql.append('n.time >= \'%s\'' % start_time)
        if end_time:
            time_part_sql.append('n.time <= \'%s\'' % end_time)
        if system_dict and equipment_system:
            strSQL = 'SELECT n.id, n.entityId, e.`name`, f.faultType FROM {0} AS n '\
                     'LEFT JOIN {1} AS e ON n.entityId = e.id '\
                     'LEFT JOIN {2} AS f ON n.faultId = f.id'.format(
                         notice_table_name,
                         TableHelper.get_entity_tablename(project_id),
                         TableHelper.get_fault_tablename()
                     )
            if len(time_part_sql) > 0:
                strSQL = strSQL + ' WHERE ' + ' AND '.join(time_part_sql)
            if len(entity_ids) > 0:
                strSQL += ' AND n.entityId IN (%s)' % ','.join([str(i) for i in entity_ids]) 
            if len(fault_ids) > 0:
                strSQL += ' AND n.faultId IN (%s)' % ','.join([str(i) for i in fault_ids])
            if len(class_names) > 0:
                strSQL += ' AND e.className IN (\'%s\')' % '\',\''.join(class_names)
            strSQL = (strSQL + ' GROUP BY n.entityId , n.faultId').format(notice_table_name, )
            dbrv = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.op_db_query(DB_NAME, strSQL)

            number_of_realpoint_count = cls.get_realpoint_count(project_id)
            system_dict.update({
                sensor: {
                    'abnormalNum': 0,
                    'className': sensor,
                    'equipments': [1] * number_of_realpoint_count
                }
            })

            if dbrv:
                for item in dbrv:
                    try:
                        faultType = float(item[3])
                        if faultType == 2:
                            system_dict[sensor]['abnormalNum'] += 1
                        elif faultType <= 1 and faultType > 0:
                            classname = equipment_system.get(item[1])
                            if classname:
                                system_dict[classname]['abnormalNum'] += faultType
                                Equipment_faultType = system_dict.get(classname).get('Equipment_faultType')
                                if item[1] in Equipment_faultType.keys():
                                    if faultType > Equipment_faultType.get(item[1]):
                                        Equipment_faultType.update({item[1]: faultType})
                                else:
                                    Equipment_faultType.update({item[1]: faultType})
                    except Exception:
                        print('get_equipment_rate_of_health data error:' + str(item[0]))
                l = list(system_dict.keys())
                l.sort()
                for keys in l:
                    sys = system_dict.get(keys)
                    Equipment_faultType = sys.get('Equipment_faultType')
                    totalNum = len(sys.get('equipments'))
                    if keys == sensor:
                        goodNum = totalNum - sys.get('abnormalNum')
                    else:
                        goodNum = totalNum - sum([Equipment_faultType.get(x) for x in Equipment_faultType.keys()])
                    rt.append({'className': '其它' if sys.get('className') == '' else sys.get('className'),
                               'intactRate': cls.computing_intact_rate(goodNum, totalNum),
                               'goodNum': goodNum, 'totalNum': totalNum})
                res.update({'status': 1, 'data': rt})
            else:
                res.update({'message': 'No data'})
        else:
            res.update({'message': 'project error'})
        return res


    @classmethod
    def get_equipment_all(cls, project_id):
        '''
        david 20170921
        获取 所有设备信息(新版诊断)
        '''
        system_dict = {}
        equipment_system = {}
        strSQL = 'SELECT id, `name`, className FROM {1} '\
                 'WHERE projectId = {0} AND className IS NOT NULL '\
                 'AND className <> "传感器" AND className <> "Sensor"'.format(project_id, TableHelper.get_entity_tablename(project_id))
        dbrv = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.op_db_query(DB_NAME, strSQL)
        if dbrv:
            for item in dbrv:
                try:
                    className = item[2]
                    equipmentName = item[1]
                    equipmentId = item[0]
                    equipment_system.update({equipmentId: className})
                    if className in system_dict.keys():
                        system_dict.get(className).get('equipments').append({'equipmentId': equipmentId,
                                                                             'equipmentName': equipmentName})
                        system_dict[className]['totalNum'] += 1
                    else:
                        system_dict.update({className:{'className': className, 'equipments': [{'equipmentId': equipmentId,
                                                                                               'equipmentName': equipmentName}],
                                                       'totalNum': 1, 'abnormalNum': 0,
                                                       'Equipment_faultType': {}}})
                except Exception:
                    print('get_equipment_all data error:' + str(item[0]))
        return system_dict, equipment_system


    @classmethod
    def computing_intact_rate(cls, goodNum, totalNum):
        return '%0.2f' % ((goodNum / totalNum) * 100,) + '%'


    @classmethod
    def get_realpoint_count(cls, projId):
        rt = None
        dbAccess = BEOPDataAccess.getInstance()
        mysqlname = dbAccess.getProjMysqldb(projId)
        sql = 'SELECT COUNT(*) FROM rtdata_%s where flag = 0' % mysqlname
        dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query_one(app.config['DATABASE'], sql, ())
        if dbrv:
            rt = int(dbrv[0])
        return rt
