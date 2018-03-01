"""策略组态 数据处理层"""
from datetime import datetime, timedelta
from mysql.connector.conversion import MySQLConverter
from beopWeb import app
from beopWeb.BEOPDataAccess import BEOPDataAccess
from beopWeb.MongoConnManager import MongoConnManager
import time
from beopWeb.mod_memcache.RedisManager import RedisManager

#define table names
DB_NAME = 'diagnosis'
TABLE_DIAGNOSIS_ENTITY = 'diagnosis_entity'
TABLE_DIAGNOSIS_FAULT = 'diagnosis_fault'
TABLE_DIAGNOSIS_FAULT_ZH = 'diagnosis_fault_zh'
TABLE_DIAGNOSIS_ENTITY_FAULT = 'diagnosis_entity_fault'
TABLE_DIAGNOSIS_NOTICE = 'diagnosis_%s_notice'
TABLE_DIAGNOSIS_ENUM = 'diagnosis_enum'

def contains_chinese(str):
    return all('\u4e00' <= char <= '\u9fff' for char in str)

class DiagnosisService:
    ''' 新版诊断 数据处理类 '''

    @classmethod
    def get_notice_table_name(cls, project_id):
        ''' 根据项目id，获取对应的 notice 表名称 '''
        return TABLE_DIAGNOSIS_NOTICE % project_id

    @classmethod
    def _calc_entity_total(cls, id_map, wrong_entities, entity_id):
        ''' 计算 entity 的出错数量 '''
        if entity_id not in id_map:
            return 0
        value = id_map[entity_id]
        if 'wrong' in value:
            return value['wrong']
        value['wrong'] = 0
        for child in value['children'].split(','):
            child = int(child)
            if child in wrong_entities:
                value['wrong'] += wrong_entities[child]
            else:
                wrong = cls._calc_entity_total(id_map, wrong_entities, child)
                value['wrong'] += wrong
        return value['wrong']

    @classmethod
    def _format_points_str(cls, points_str):
        ''' 对 entity_fault 表的 points 字符串格式进行格式化处理 '''
        if points_str is None or points_str == '':
            return []
        arr = points_str.split('|')
        data = []
        for value in arr:
            item = value.split(',')
            data.append({
                'name': item[0],
                'description': item[1]
            })
        return data

    @classmethod 
    def get_entities(cls, project_id):
        ''' 获取某个项目的所有 entities '''
        # 获取 entities
        sql = '''
            SELECT
                id,
                name,
                parent,
                type,
                pageId,
                projectId,
                className
            FROM {0}
            WHERE projectId=%s
        '''.format(TABLE_DIAGNOSIS_ENTITY)
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql, (project_id,))
        entities = []
        for item in result:
            entities.append({
                'id': item[0],
                'name': item[1],
                'parent': item[2],
                'type': item[3],
                'pageId': item[4],
                'projectId': item[5],
                'className': item[6]
            })
        return entities

    @classmethod
    def get_entities_wrong_quantity(cls, project_id, start_time, end_time):
        ''' 获取某个项目的所有 entities 的健康率 '''
        # 统计指定时间段内，出现故障的entity_id
        sql = '''
            SELECT
                n.entityId
            FROM
                {0} n
            WHERE
                n.time >= %s
            AND n.time <= %s
            AND projectId = %s
        '''.format(cls.get_notice_table_name(project_id))
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql, (start_time, end_time, project_id))
        wrong_entities = {}
        for item in result:
            if item[0] in wrong_entities:
                wrong_entities[item[0]] = wrong_entities[item[0]] + 1
            else:
                wrong_entities[item[0]] = 1

        # 统计 entity 数量
        sql = '''
            SELECT
                e1.id,
                GROUP_CONCAT(e2.id ORDER BY e2.id) children,
                COUNT(e2.parent) count
            FROM
                {0} e1
            LEFT JOIN {0} e2 ON e2.parent = e1.id
            WHERE
                e1.projectId=%s
            AND e2.parent <> 0
            GROUP BY
                e1.id
        '''.format(TABLE_DIAGNOSIS_ENTITY)
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql, (project_id,))
        id_map = {}
        for item in result:
            id_map[item[0]] = {
                'id': item[0],
                'children': item[1],
                'count': item[2]
            }
        for entity_id in id_map:
            cls._calc_entity_total(id_map, wrong_entities, entity_id)

        result = []
        for entity_id, value in id_map.items():
            result.append({
                'id': entity_id,
                'wrongQuantity': value['wrong']
            })
        # 给设备加上错误信息
        for entity_id, value in wrong_entities.items():
            result.append({
                'id': entity_id,
                'wrongQuantity': value
            })
        return result

    @classmethod
    def get_lastest_entity_faults(cls, project_id, start_time, end_time, number=6):
        ''' 获取最新的错误列表，具体数目由 number 决定 '''
        sql = '''
            SELECT DISTINCT
                f.id,
                f.name
            FROM
                diagnosis_fault f
            LEFT JOIN {0} n ON n.faultId = f.id
            WHERE
            n.time >= %s
            AND n.time <= %s
            AND n.grade=2
            ORDER BY n.time DESC
            LIMIT %s
        '''.format(cls.get_notice_table_name(project_id))
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql, (start_time, end_time, number))
        data = []
        for item in result:
            data.append({
                'faultId': item[0],
                'name': item[1]
            })
        return data

    @classmethod
    def get_equipment_availability(cls, pzroject_id):
        ''' 获取设备完好率数据 '''

    @classmethod
    def get_entity_faults(cls, project_id, page_num, page_size, \
        start_time, end_time, entity_ids, fault_ids, class_names, keywords, sort):
        ''' 获取设备的报警信息 '''
        converter = MySQLConverter()
        # escape string
        entity_ids = [converter.escape(i) for i in entity_ids]
        fault_ids = [converter.escape(i) for i in fault_ids]
        count_sql = '''SELECT COUNT(*)'''
        item_sql = '''
            SELECT
                n.id,
                n.entityId,
                n.faultId,
                n.time,
                n.status,
                e.name AS entityName,
                e.parent AS entityParent,
                f.name,
                f.description,
                f.consequence,
                CASE
                WHEN ef.grade IS NOT NULL THEN
                    ef.grade
                ELSE
                    f.grade
                END AS grade,
                ef.points 
        '''
        sql = '''
             FROM
                {0} n
            RIGHT JOIN diagnosis_entity_fault ef ON ef.entityId = n.entityId
            AND ef.faultId = n.faultId
            RIGHT JOIN diagnosis_entity e ON e.id = n.entityId
            RIGHT JOIN diagnosis_fault f ON f.id = n.faultId
            WHERE
                n.projectId = %s
            AND n.time >= %s
            AND n.time <= %s
        '''.format(cls.get_notice_table_name(project_id))
        if len(entity_ids) > 0:
            sql += ' AND n.entityId IN (%s)' % ','.join([str(i) for i in entity_ids])
        if len(fault_ids) > 0:
            sql += ' AND n.faultId IN (%s)' % ','.join([str(i) for i in fault_ids])
        if len(class_names) > 0:
            sql += ' AND e.className IN (\'%s\')' % '\',\''.join(class_names)
        if keywords:
            sql += ' AND (e.NAME like "%{0}%" OR f.NAME like "%{0}%" OR n.time like "%{0}%" OR f.consequence like "%{0}%")'.format(keywords)
        for item in sort:
            if sort.index(item) == 0:
                sql += ' ORDER BY {0} {1}'.format(item['key'],item['order'])
            else:
                sql += ' ,{0} {1}'.format(item['key'],item['order'])
        limt_sql = ' LIMIT {0},{1}'.format((page_num-1)*page_size, page_size)
        notice_count = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, count_sql+sql, (project_id, start_time, end_time))
        notice_result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, item_sql+sql+limt_sql, (project_id, start_time, end_time))
        if len(notice_result) == 0:
            return {
                'data':[],
                'total': 0
            }
        entity_parent_ids = []
        for item in notice_result:
            if item[6] not in entity_parent_ids:
                entity_parent_ids.append(item[6])
        sql = '''
            SELECT
                id,
                name
            FROM
                diagnosis_entity
            WHERE
                projectId = %s
            AND id IN ({0})
        '''.format(','.join([str(i) for i in entity_parent_ids]))
        entity_query_result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql, (project_id, ))
        entity_id_name_map = {}
        for item in entity_query_result:
            entity_id_name_map[item[0]] = item[1]
        data = []
        for item in notice_result:
            data.append({
                    "id": item[0],
                    "entityId": item[1],
                    "faultId": item[2],
                    "time": item[3].strftime('%Y-%m-%d %H:%M'),
                    "status": item[4],
                    "entityName": item[5],
                    "entityParentName": entity_id_name_map.get(item[6], 'Not Found'),
                    "name": item[7],
                    "description": item[8],
                    "consequence": item[9],
                    "grade": item[10],
                    "points": cls._format_points_str(item[11])
                })
        return {
            'data': data,
            'total': notice_count[0][0]
        }

    @classmethod
    def get_faults(cls, project_id, start_time, end_time, \
        entity_ids, consequence, class_names):
        ''' 获取 fault 列表 '''
        if entity_ids is None: entity_ids = []
        if consequence is None: consequence = []
        if class_names is None: class_names = []
        converter = MySQLConverter()
        sql = '''
            SELECT
                n.faultId,
                f.`name` AS faultName,
                f.description,
                n.grade,
                n.entityId,
                e.`name` AS entityName,
                f.consequence,
                ef.`enable`
            FROM
                diagnosis_%s_notice n
            RIGHT JOIN diagnosis_entity_fault ef ON n.faultId = ef.faultId
            AND n.entityId = ef.entityId
            RIGHT JOIN diagnosis_fault f ON f.id = n.faultId
            RIGHT JOIN diagnosis_entity e ON e.id = n.entityId
            WHERE
                n.time >= %s
            AND n.time <= %s
        '''
        if len(entity_ids) > 0:
            sql += ' AND n.entityId IN (%s)' % converter.escape(','.join([str(i) for i in entity_ids]))
        if len(consequence) > 0:
            sql += ' AND f.consequence IN (\'%s\')' % '\',\''.join([converter.escape(str(i)) for i in consequence])
        if len(class_names) > 0:
            sql += ' AND e.className IN (\'%s\')' % '\',\''.join([converter.escape(class_names) for i in consequence])
        sql += ' GROUP BY n.faultId'
        result =  BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql, (project_id, start_time, end_time))
        data = []
        for item in result:
            data.append({
                "faultId": item[0],
                "faultName": item[1],
                "description": item[2],
                "grade": item[3],
                "entityId": item[4],
                "entityName": item[5],
                "consequence": item[6],
                "enable": item[7]
            })
        return data

    @classmethod
    def get_all_faults(cls, project_id, page_num, page_size, sort):
        ''' 获取 fault 列表 '''
        count_sql = '''SELECT COUNT(*)'''
        item_sql = '''
            SELECT
                n.faultId,
                f.`name` AS faultName,
                f.description,
                n.grade,
                n.entityId,
                e.`name` AS entityName,
                f.consequence,
                ef.`enable`
        '''
        sql = '''
             
            FROM
                {0} n
            RIGHT JOIN diagnosis_entity_fault ef ON n.faultId = ef.faultId
            AND n.entityId = ef.entityId
            RIGHT JOIN diagnosis_fault f ON f.id = n.faultId
            RIGHT JOIN diagnosis_entity e ON e.id = n.entityId
            GROUP BY n.faultId
        '''.format(cls.get_notice_table_name(project_id))
        for item in sort:
            if sort.index(item) == 0:
                sql += ' ORDER BY {0} {1}'.format(item['key'],item['order'])
            else:
                sql += ' ,{0} {1}'.format(item['key'],item['order'])
        limt_sql = ' LIMIT {0},{1}'.format((page_num-1)*page_size, page_size)
        count = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, count_sql+sql)
        result =  BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, item_sql+sql+limt_sql)
        data = []
        for item in result:
            data.append({
                "faultId": item[0],
                "faultName": item[1],
                "description": item[2],
                "grade": item[3],
                "entityId": item[4],
                "entityName": item[5],
                "consequence": item[6],
                "enable": item[7]
            })
        return {
            "data": data,
            "total": count[0][0]
        }

    @classmethod
    def get_entity_fault_his_data(cls, fault_id):
        ''' 获取单条 fault 的详细数据 '''

    @classmethod
    def get_fault_consequence(cls, project_id):
        ''' 获取报警影响的分类信息 '''

    @classmethod
    def get_equipment_rate_of_health(cls, project_id, start_time, end_time, entity_ids, class_names, fault_ids):
        '''
        david 20170612
        获取设备健康率
        '''
        rt = []
        notice_table_name = cls.get_notice_table_name(project_id)
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
                     'LEFT JOIN diagnosis_entity AS e ON n.entityId = e.id '\
                     'LEFT JOIN diagnosis_fault AS f ON n.faultId = f.id'
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
            if dbrv:
                sensor_dict = {}
                for item in dbrv:
                    try:
                        faultType = float(item[3])
                        if faultType == 2:
                            if sensor not in sensor_dict.keys():
                                if number_of_realpoint_count is None:
                                    number_of_realpoint_count = cls.get_realpoint_count(project_id)
                                sensor_dict.update({sensor: {'abnormalNum': 0, 'className': sensor,
                                                             'equipments': [1] * number_of_realpoint_count}})
                            sensor_dict[sensor]['abnormalNum'] += 1
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
                system_dict.update(sensor_dict)
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
                    rt.append({'className': sys.get('className'),
                               'intactRate': cls.computing_intact_rate(goodNum, totalNum),
                               'goodNum': goodNum, 'totalNum': totalNum})
        return rt

    @classmethod
    def get_equipment_all(cls, project_id):
        '''
        david 20170612
        获取 所有设备信息
        '''
        system_dict = {}
        equipment_system = {}
        strSQL = 'SELECT id, `name`, className FROM diagnosis_entity '\
                 'WHERE projectId = {0} AND type =1 AND className IS NOT NULL '\
                 'AND className <> "传感器" AND className <> "Sensor"'.format(project_id)
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
    def get_dateTime_now_accurate_to_5m(cls):
        datetime_now = datetime.now()
        min_now = datetime_now.minute
        min_format = str(min_now // 5 * 5)
        if len(min_format) == 1:
            min_format = '0' + min_format
        return min_format

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

    @classmethod
    def get_entity_fault_enable(cls, ef_ids):
        formatted_ids = []
        if len(ef_ids) == 0:
            return []
        for row in ef_ids:
            formatted_ids.append('%s%s' % (row[0], row[1]))
        converter = MySQLConverter()
        sql = '''
            SELECT
                entityId,
                faultId,
                `enable`
            FROM
                diagnosis_entity_fault
            WHERE 1=1
        '''
        if len(ef_ids) > 0:
            sql += ' AND CONCAT(entityId, faultId) in (\'%s\')' % \
                '\',\''.join([converter.escape(i) for i in formatted_ids])
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly\
            .op_db_query(DB_NAME, sql)

        data = []
        for row in result:
            data.append({
                'entityId': row[0],
                'faultId': row[1],
                'enable': row[2]
            })
        return data

    @classmethod
    def transform_to_new_fault_id(cls, project_id, old_fault_ids):
        converter = MySQLConverter()
        # 根据 project_id 拿到 mysqlname
        sql = '''
            SELECT
                mysqlname
            FROM
                project
            WHERE
                id = %s
        '''
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly\
            .op_db_query('beopdoengine', sql, (project_id,))

        mysqlname = result[0][0]
        old_fault_table_name = mysqlname + '_diagnosis_faults'

        sql = '''
            SELECT
                Id,
                `Name`,
                Description
            FROM
                {0}
            WHERE
                Id in ({1})
        '''.format(
            old_fault_table_name,
            converter.escape(','.join([str(i) for i in old_fault_ids]))
        )
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly\
            .op_db_query(DB_NAME, sql)

        # 判断中英文，用 description 进行判断
        lang = 'zh' if contains_chinese(result[0][2]) else 'en'
        fault_table_name = TABLE_DIAGNOSIS_FAULT if lang == 'en' else TABLE_DIAGNOSIS_FAULT_ZH
        end_symbol = '.' if lang == 'en' else '。'

        old_fault_map = {}
        for row in result:
            old_fault_map[row[2] + end_symbol] = row

        sql = '''
            SELECT
                id,
                name,
                description
            FROM
                {0}
            WHERE
                description IN ('{1}')
        '''.format(
            fault_table_name,
            '\',\''.join([i for i in list(old_fault_map)])
        )
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly\
            .op_db_query(DB_NAME, sql)

        fault_reflect_map = {}
        for row in result:
            old_fault = old_fault_map[row[2]]
            if old_fault[0] in fault_reflect_map:
                continue
            fault_reflect_map[old_fault[0]] = row[0]
        return fault_reflect_map

    @classmethod
    def get_lastest_notice_by_entityid_and_faultid(cls, project_id, ef_ids):
        ''' 根据 entityIds 和 faultIds 获取最新的一条 notice '''
        converter = MySQLConverter()
        sql = '''
            SELECT
                id,
                endTime,
                CONCAT(entityId, faultId)
            FROM
                {0}
            WHERE
                id IN (
                    SELECT MAX(id) FROM {0}
                    WHERE
                        CONCAT(entityId, faultId) in ('{1}')
                    GROUP BY entityId, faultId 
                )
        '''.format(
            cls.get_notice_table_name(project_id),
            '\',\''.join([
                converter.escape('%s%s'%(entityId, faultId)) for entityId, faultId in ef_ids
            ])
        )
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql)
        data = []
        for row in result:
            data.append({
                'id': row[0],
                'endTime': row[1],
                'efid': row[2]
            })
        return data

    @classmethod
    def add_notices(cls, project_id, data):
        rt = True
        result_status = []

        try:
            dbAccess = BEOPDataAccess.getInstance()
            ef_ids = []
            fault_ids = []
            for item in data:
                fault_ids.append(item['faultId'])
            # 老 fault id 转换为新 fault id
            fault_reflect_map = cls.transform_to_new_fault_id(project_id, fault_ids)
            for item in data:
                item['faultId'] = fault_reflect_map.get(item['faultId'])
                if not item['faultId'] is None:
                    ef_ids.append([item['entityId'], item['faultId']])

            entity_fault_enable = cls.get_entity_fault_enable(ef_ids)

            prepared_data = []
            table_name = cls.get_notice_table_name(project_id)
            # detect if notice table exists
            sql = '''
                SELECT
                    COUNT(*)
                FROM
                    information_schema.`TABLES`
                WHERE
                    TABLE_SCHEMA = 'diagnosis'
                AND TABLE_NAME = %s
            '''
            result = dbAccess._mysqlDBContainerReadOnly\
                .op_db_query(DB_NAME, sql, (table_name,))

            if result[0][0] == 0:
                # create table
                sql = '''
                    CREATE TABLE `{0}` (
                    `id`  int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'id' ,
                    `entityId`  int(11) NOT NULL COMMENT 'entity id' ,
                    `faultId`  int(11) NOT NULL COMMENT 'fault id' ,
                    `orderId`  varchar(24) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '对应的工单id' ,
                    `detail`  text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '故障详情' ,
                    `time`  datetime NULL DEFAULT NULL COMMENT '发生时间' ,
                    `energy`  float(12,2) NULL DEFAULT NULL COMMENT '对应当前故障的能耗' ,
                    `status`  tinyint(4) NULL DEFAULT NULL COMMENT '故障状态\r\n1 - 发生\r\n10 - 结束' ,
                    `projectId`  int(11) NULL DEFAULT NULL COMMENT '项目id' ,
                    `checkTime`  datetime NULL DEFAULT NULL COMMENT '用户解决时间' ,
                    `endTime`  datetime NULL DEFAULT NULL COMMENT '结束时间' ,
                    `operator`  int(11) NULL DEFAULT NULL COMMENT '工单处理人' ,
                    `grade`  tinyint(4) NULL DEFAULT NULL COMMENT '报警级别，0：异常；1：故障' ,
                    `feedBackId`  varchar(24) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '反馈记录id' ,
                    `imported`  tinyint(4) NULL DEFAULT 0 ,
                    PRIMARY KEY (`id`)
                    )
                    ENGINE=InnoDB
                    DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
                    AUTO_INCREMENT=57140
                    ROW_FORMAT=COMPACT;
                '''.format(table_name)
                dbAccess._mysqlDBContainer.op_db_update(DB_NAME, sql)

            # query `enable` column of entity_fault
            for item in data:
                if item['faultId'] is None:
                    result_status.append({'status': 'ERROR', 'msg': '未找到对应的 fault 记录，不允许写入！'})
                    continue
                enable = None
                for row in entity_fault_enable:
                    if item['entityId'] == row['entityId'] and \
                        item['faultId'] == row['faultId']:
                        enable = row['enable']
                if enable is None:
                    result_status.append({'status': 'ERROR', 'msg': '未查到 enable 数据，不允许写入！'})
                    continue
                if enable == 0:
                    result_status.append({'status': 'ERROR', 'msg': 'enable 为 0，不允许写入！'})
                    continue
                prepared_data.append(item)

            if len(prepared_data) > 0:
                lastest_notices = cls.get_lastest_notice_by_entityid_and_faultid(project_id, ef_ids)
                insert_data = []
                update_notice_ids = []
                lastest_notices_map = {}
                for item in lastest_notices:
                    lastest_notices_map[item.get('efid')] = item
                for item in prepared_data:
                    notice = lastest_notices_map.get('%s%s'%(item.get('entityId'), item.get('faultId')))
                    if notice and notice.get('endTime') is None:
                        update_notice_ids.append(notice.get('id'))
                    insert_data.append(item)

                if len(update_notice_ids) > 0:
                    # 获取时区数据
                    time_zone = dbAccess.get_project_time_zone_by_id(project_id)
                    time_zone = 8 if time_zone is None else time_zone
                    # 计算出项目所在地的时间
                    project_time = (datetime.utcnow() + timedelta(hours=time_zone))\
                        .strftime('%Y-%m-%d %H:%M:%S')
                    sql = '''
                        UPDATE {0}
                        SET endTime = %s
                        WHERE
                            id IN (%s)
                    '''.format(table_name)

                    rt = dbAccess._mysqlDBContainer\
                        .op_db_update(
                            DB_NAME,
                            sql,
                            (project_time, ','.join([str(x) for x in update_notice_ids]))
                        )
                    if rt:
                        result_status.append({'status': 'OK', 'msg': 'Success to update %s records.' % len(insert_data)})
                    else:
                        result_status.append({'status': 'ERROR', 'msg': 'Failed to update notices endTime.'})

                if len(insert_data) > 0:
                    sql = '''
                        INSERT INTO {0}
                            (projectId, faultId, entityId, grade, orderId, detail, time, energy, status, imported)
                            VALUES(%(projectId)s, %(faultId)s, %(entityId)s,
                            (
                                SELECT 
                                    CASE ef.grade WHEN NULL THEN f.grade ELSE ef.grade END AS grade
                                FROM diagnosis_entity_fault ef 
                                LEFT JOIN diagnosis_fault f ON ef.faultId = f.id
                                WHERE ef.faultId=%(faultId)s AND ef.entityId=%(entityId)s
                            ), %(orderId)s, %(detail)s, %(time)s, %(energy)s, %(status)s, 0)
                    '''.format(table_name)

                    rt = dbAccess._mysqlDBContainer\
                        .op_db_update_many(
                            DB_NAME,
                            sql,
                            insert_data
                        )
                    if rt:
                        result_status.append({'status': 'OK', 'msg': 'Success to insert %s records.' % len(insert_data)})
                    else:
                        result_status.append({'status': 'ERROR', 'msg': 'Failed to insert notices.'})
        except Exception as error:
            print('add_notices Error: ' + error.__str__())
            result_status.append({'status': 'ERROR', 'msg': error.__str__()})
        return result_status

    @classmethod
    def get_groupby_equipment(cls, project_id, page_num, page_size, \
        start_time, end_time, entity_ids, fault_ids, class_names, keywords, sort):
        ''' 获取设备的信息 在聚类'''
        converter = MySQLConverter()
        # escape string
        entity_ids = [converter.escape(i) for i in entity_ids]
        fault_ids = [converter.escape(i) for i in fault_ids]
        count_sql = '''
            SELECT
                COUNT(*)
            FROM
                (
                    SELECT
                        entityId
                    FROM
                        {0} n
                    LEFT JOIN diagnosis_entity e ON e.id = n.entityId
                    WHERE
                        time >= "{1}"
                    AND time <= "{2}"
        '''.format(cls.get_notice_table_name(project_id), start_time, end_time)
        sql = '''
            SELECT
                e.id,
                e.`name`,
                n.time,
                n.endTime,
                n.energy,
                f.`name`,
                ef.unit,
                ef.elecPrice,
                n.grade,
                n.faultId,
                n.id
            FROM
                {0} n
            LEFT JOIN diagnosis_entity_fault ef ON ef.entityId = n.entityId
            AND ef.faultId = n.faultId
            LEFT JOIN diagnosis_entity e ON e.id = n.entityId
            LEFT JOIN diagnosis_fault f ON f.id = n.faultId
            LEFT JOIN unitconversion u ON ef.unit = u.NewUnit
            WHERE
                n.time >= %s
            AND n.time <= %s
            AND n.entityId IN (
                SELECT
                    entityId
                FROM
                    (
                        SELECT
                            entityId
                        FROM
                            {0}
                        WHERE
                            time >= "{1}"
                        AND time <= "{2}"
        '''.format(cls.get_notice_table_name(project_id), start_time, end_time)
        if len(entity_ids) > 0:
            temp = ' AND entityId IN (%s)' % ','.join([str(i) for i in entity_ids])
            sql += temp
            count_sql += temp
        sql += '''
                        GROUP BY
                            entityId
                        LIMIT {0},{1}
                    ) tmp
            )
        '''.format((page_num-1)*page_size, page_size)
        if len(fault_ids) > 0:
            temp = ' AND n.faultId IN (%s)' % ','.join([str(i) for i in fault_ids])
            sql += temp
            count_sql += temp
        if len(class_names) > 0:
            temp = ' AND e.className IN (\'%s\')' % '\',\''.join(class_names)
            sql += temp
            count_sql += temp
        if keywords:
            temp = ' AND (e.name like "%{0}%")'.format(keywords)
            sql += temp
            count_sql += temp
            
        for item in sort:
            if sort.index(item) == 0:
                sql += ' ORDER BY {0} {1}'.format(item['key'],item['order'])
            else:
                sql += ' ,{0} {1}'.format(item['key'],item['order'])
        if len(sort) == 0:
            sql += ' ORDER BY e.`name`, f.`name`'
        count_sql += '''
                GROUP BY
                    entityId
            ) tmp
        '''
        count = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, count_sql)
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql, (start_time, end_time))
        if len(result) == 0:
            return {
                'data':[],
                'total': 0
            } 
        data = []
        nameArr = []
        for item in result:
            name = item[1]
            endTime = item[3]
            if endTime:
                endTime = endTime.strftime("%Y-%m-%d %H:%M:%S")
            json = {
                'entityId': item[0],
                'entityName': item[1],
                'time': item[2].strftime("%Y-%m-%d %H:%M:%S"),
                'endTime': endTime,
                'energy': item[4],
                'faultName': item[5],
                'unit': item[6],
                'elecPrice': item[7],
                'grade': item[8],
                'faultId': item[9],
                'id': item[10]
            }
            if name in nameArr: 
                for single in data:
                    if name == single['name']:
                        single['arrNoticeTime'].append(json)
            else:
                nameArr.append(name)
                arr = {}
                arr['name'] = name
                arr['id'] = item[0]
                arr['arrNoticeTime'] = [json]
                data.append(arr)
        return {
            'data': data,
            'total': count[0][0]
        }

    @classmethod
    def get_roi_info(cls, project_id, page_num, page_size, \
        start_time, end_time, entity_ids, fault_ids, class_names, keywords, sort):
        ''' 获取roi信息'''
        converter = MySQLConverter()
        # escape string
        entity_ids = [converter.escape(i) for i in entity_ids]
        fault_ids = [converter.escape(i) for i in fault_ids]
        converter = MySQLConverter()
        count_sql = '''
            SELECT COUNT(*)
            FROM (
                SELECT f.id
            
        '''
        count_sql_end = '''
            ) temp
        '''
        item_sql = '''
            SELECT
                e.id AS equipmentId,
                e.NAME AS equipmentName,
                n.time,
                n.energy,
                n.grade,
                f.NAME AS faultName,
                f.id AS faultId,
                f.faultGroup,
                ef.unit,
                ef.hr,
                ef.hrPrice,
                ef.elecPrice,
                ef.laborCost,
                f.runDay,
                f.runWeek,
                f.runMonth,
                f.runYear,
                u.Factor
        '''
        sql = '''
             
            FROM
                diagnosis_fault f
            LEFT JOIN (
                SELECT
                projectId,
                    faultId,
                    avg(IF(energy <> 0, energy, NULL)) AS energy,
                    time,
                    grade
                FROM
                    {0} n
                WHERE
                    Time >= %s
                AND Time <= %s
                GROUP BY
                    id
            ) n ON n.faultId = f.id
            LEFT JOIN diagnosis_entity_fault ef ON f.id = ef.faultId
            LEFT JOIN diagnosis_entity e ON e.id = ef.entityId
            LEFT JOIN unitconversion u ON ef.unit = u.NewUnit
            WHERE
                n.projectId = %s
            AND n.time >= %s
            AND n.time <= %s
        '''.format(cls.get_notice_table_name(project_id))
        if len(entity_ids) > 0:
            sql += ' AND n.entityId IN (%s)' % ','.join([str(i) for i in entity_ids])
        if len(fault_ids) > 0:
            sql += ' AND n.faultId IN (%s)' % ','.join([str(i) for i in fault_ids])
        if len(class_names) > 0:
            sql += ' AND e.className IN (\'%s\')' % '\',\''.join(class_names)
        if keywords:
            sql += ' AND (e.NAME like "%{0}%" OR f.NAME like "%{0}%" OR f.faultGroup like "%{0}%")'.format(keywords)
        sql += ' GROUP BY f.id'
        for item in sort:
            if sort.index(item) == 0:
                sql += ' ORDER BY {0} {1}'.format(item['key'],item['order'])
            else:
                sql += ' ,{0} {1}'.format(item['key'],item['order'])
        if len(sort) == 0:
            sql += ' ORDER BY e.`name`, f.`name`'
        limt_sql = ' LIMIT {0},{1}'.format((page_num-1)*page_size, page_size)
        count = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, count_sql+sql+count_sql_end, (start_time, end_time, project_id, start_time, end_time))
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, item_sql+sql+limt_sql, (start_time, end_time, project_id, start_time, end_time))
        if len(result) == 0:
            return {
                'data':[],
                'total': 0
            }
        data = []
        for item in result:
            data.append({
                'equipmentId': item[0],
                'equipmentName': item[1],
                'time': item[2].strftime('%Y-%m-%d %H:%M:%S'),
                'energy': item[3],
                'grade': item[4],
                'faultName': item[5],
                'faultId': item[6],
                'group': item[7],
                'unit': item[8],
                'hr': float(item[9]) if item[9] else item[9],
                'hrPrice': float(item[10]) if item[10] else item[10],
                'elecPrice': item[11],
                'laborCost': float(item[12]) if item[12] else item[12],
                'runDay': item[13],
                'runWeek': item[14],
                'runMonth': item[15],
                'runYear': item[16],
                'factor': item[17],
            })
        return {
            'data':data,
            'total': count[0][0]
        }

    @classmethod
    def save_roi_info( cls,project_id, dataArr):
        ''' 保存roi信息'''
        try:
            for item in dataArr:
                rt = False
                faultId = item.get('faultId')
                equipmentId = item.get('equipmentId')
                hrPrice = 'null' if item.get('hrPrice') == '--' else item.get('hrPrice')
                hr = 'null' if item.get('hr') == '--' else item.get('hr')
                laborCost = 'null' if item.get('laborCost') == '--' else item.get('laborCost')
                elecPrice = 'null' if item.get('powerPrice') == '--' else item.get('powerPrice')
                sql = '''
                    UPDATE diagnosis_entity_fault
                    SET hrPrice = {0}, hr = {1}, laborCost = {2}, elecPrice = {3}
                    WHERE
                        faultId = {4}
                    And entityId = {5}
                '''.format(hrPrice, hr, laborCost, elecPrice, faultId, equipmentId)
                result = BEOPDataAccess.getInstance()._mysqlDBContainer.\
                op_db_update(DB_NAME, sql)
                if result:
                    rt = True
            rt = {'data': rt}
        except Exception as e:
            print('saveRoiInfo error:' + e.__str__())
        return rt

    @classmethod
    def get_fault_info_by_consequence(cls, project_id, start_time, end_time):
        ''' 获取报警修复信息，按照 consequence 分组 '''
        sql = '''
            SELECT DISTINCT
                f.id,
                f.name
            FROM
                diagnosis_fault f
            LEFT JOIN {0} n ON n.faultId = f.id
            WHERE
            n.time >= %s
            AND n.time <= %s
            AND n.grade=2
            ORDER BY n.time DESC
            LIMIT %s
        '''.format(cls.get_notice_table_name(project_id))
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql, (start_time, end_time, number))
        data = []
        for item in result:
            data.append({
                'faultId': item[0],
                'name': item[1]
            })
        return data

    @classmethod
    def get_priority_faults(cls, project_id, start_time, end_time, number=20, entity_ids=[], class_names=[], fault_ids=[]):
        ''' 获取最新的错误列表，具体数目由 number 决定 '''
        number = 20 if number is None else number
        sql = '''
            SELECT
                n.time,
                f.`name`,
                f.`consequence`,
                GROUP_CONCAT(e.`name`),
                n.entityId,
                n.faultId,
                e.className
            FROM
                diagnosis_fault f
            LEFT JOIN {0} n ON n.faultId = f.id
            LEFT JOIN diagnosis_entity e ON n.entityId = e.id
            WHERE
                n.time >= %s
            AND n.time <= %s
            AND n.grade = 2
            AND n.projectId = %s
            AND e.projectId = %s            
        '''.format(cls.get_notice_table_name(project_id))
        if len(entity_ids) > 0:
            sql += ' AND n.entityId IN (%s)' % ','.join([str(i) for i in entity_ids])
        if len(fault_ids) > 0:
            sql += ' AND n.faultId IN (%s)' % ','.join([str(i) for i in fault_ids])
        if len(class_names) > 0:
            sql += ' AND e.className IN (\'%s\')' % '\',\''.join(class_names)     
        group_sort_limit_sql = '''
            GROUP BY f.id
            ORDER BY
                n.time DESC
            LIMIT %s
        '''   
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql+group_sort_limit_sql, (start_time, end_time, project_id, project_id, number))
        data = []
        for item in result:
            data.append({
                'time': item[0].strftime('%Y-%m-%d %H:%M'),
                'name': item[1],
                'consequence': item[2],
                'entityNames': item[3],
                'entityId': item[4],
                'faultId': item[5],
                'className': 'Other' if item[6] is None else item[6]
            })
        return data

    @classmethod
    def get_faults_by_ids(cls, ids, lang):
        '''根据ids 和语言获取faults'''
        tableName = 'diagnosis_fault_zh' if lang == 'zh' else 'diagnosis_fault'
        idsStr = '(' + ','.join(str(id) for id in ids) + ')'
        sql = '''
            SELECT
                id,
                name,
                description
            FROM
                {0}
            WHERE
                id IN {1}
            '''.format(tableName, idsStr)
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql)
        data = []
        for item in result:
            data.append({
                'id': item[0],
                'name': item[1],
                'description': item[2]
            })
        return data

    @classmethod
    def get_faults_info_and_points(cls, projectId, id, entityIds, startTime, endTime):
        '''根据 faultId 和 entityIds 查询 3 个数值 + points'''
        tableName = 'diagnosis_'+str(projectId)+'_notice'
        idsStr = '(' + ','.join(str(id) for id in entityIds) + ')'
        sql = '''
                SELECT
                    n.faultId,
                    n.entityId,
                    n.time,
	                n.endTime,
                    ef.points,
                    n.energy,
                    ef.elecPrice
                FROM
                    {0} n
                LEFT JOIN diagnosis_entity_fault ef ON ef.faultId = n.faultId
                AND ef.entityId = n.entityId
                WHERE
                    n.faultId = {1}
                AND n.entityId IN {2}
                AND n.time >= '{3}'
                AND n.time <= '{4}'
                ORDER BY n.time DESC
            '''.format(tableName, id, idsStr, startTime, endTime)
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql)
        data = []
        length = len(result)
        if length == 0:
            return data
        durationSec = 0
        energy = 0.0
        timeArr = []
        for item in result:
            startT = item[2]
            timeArr.append(startT.strftime('%Y-%m-%d %H:%M:%S'))
            startSec = time.mktime(startT.timetuple())
            endSec = time.mktime(item[3].timetuple()) if item[3] else round(time.time(),0)
            ds = int(endSec) - int(startSec)
            durationSec += ds
            energy += float(item[5])*round(ds/60/60,2)
        item = result[0]
        fontArr = item[4].split('|') if item[4] else []
        points = []
        for v in fontArr:
            point = v.split(',')
            points.append({
                'name': point[0],
                'description': point[1]
            })
        data.append({
            'entityId':item[1],
            'faultId':item[0],
            'times': timeArr,
            'occueTimes': length,
            'energy': energy,
            'duration': durationSec/60,
            'points': points,
            'elecPrice': item[6]
        })
        return data

    @classmethod
    def get_fault_info_by_consequence(cls, projectId, startTime, endTime, entity_ids, class_names, fault_ids):
        tableName = 'diagnosis_'+str(projectId)+'_notice'
        sql = '''
            SELECT
                f.consequence,
                n.endTime
            FROM
                {0} n
            LEFT JOIN diagnosis_fault f ON n.faultId = f.id
            LEFT JOIN diagnosis_entity AS e ON n.entityId = e.id
            WHERE
                n.time >= '{1}'
            AND n.time <= '{2}'
        '''.format(tableName, startTime, endTime)
        if len(entity_ids) > 0:
            sql += ' AND n.entityId IN (%s)' % ','.join([str(i) for i in entity_ids])
        if len(fault_ids) > 0:
            sql += ' AND n.faultId IN (%s)' % ','.join([str(i) for i in fault_ids])
        if len(class_names) > 0:
            sql += ' AND e.className IN (\'%s\')' % '\',\''.join(class_names)        
        sql += ' ORDER BY f.consequence DESC'    
        info = {
            'Comfort issue':{
                'consequence': 'Comfort issue',
                "processed": 0,
                "total": 0
            },
            'Energy waste':{
                'consequence': 'Energy waste',
                "processed": 0,
                "total": 0
            },
            'Equipment Health':{
                'consequence': 'Equipment Health',
                "processed": 0,
                "total": 0
            },
            'Other':{
                'consequence': 'Other',
                "processed": 0,
                "total": 0
            }
        }
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql)
        for item in result:
            consequenceName = item[0]
            endTime = item[1]
            info[consequenceName]['total'] += 1
            if endTime:
                info[consequenceName]['processed'] += 1
        data = []
        for key in info:
            data.append(info[key])
        return data

    @classmethod
    def get_info_by_time_equipment_numberoffaults(cls, project_id, start_time, end_time, entity_Ids, class_names, fault_ids):
        sql = '''
            SELECT
                e.className,
                SUM(1) AS number,
                DATE_FORMAT(n.time, '%Y-%m-%d') AS formatDate
            FROM
                {0} n
            LEFT JOIN diagnosis_entity e ON n.entityId = e.id
            WHERE
                n.time >= %s
            AND n.time <= %s
        '''.format(cls.get_notice_table_name(project_id))
        if len(entity_Ids) > 0:
            sql += ' AND n.entityId IN (%s)' % ','.join([str(i) for i in entity_Ids])
        if len(fault_ids) > 0:
            sql += ' AND n.faultId IN (%s)' % ','.join([str(i) for i in fault_ids])
        if len(class_names) > 0:
            sql += ' AND e.className IN (\'%s\')' % '\',\''.join(class_names)     
        group_sort_sql = '''
            GROUP BY
                formatDate,
                e.className
            ORDER BY
                n.time ASC
        '''    
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql+group_sort_sql, (start_time, end_time))
        data = []
        for item in result:
            data.append({
                'x': item[2],
                'y': item[0],
                'z': int(item[1])
            })
        return data

    @classmethod
    def get_info_by_time_consequence_numberoffaults(cls, project_id, start_time, end_time, entity_Ids, class_names, fault_ids):
        sql = '''
            SELECT
                f.consequence,
                SUM(1) AS number,
                DATE_FORMAT(n.time, '%Y-%m-%d') AS formatDate
            FROM
                {0} n
            LEFT JOIN diagnosis_fault f ON n.faultId = f.id
            LEFT JOIN diagnosis_entity e ON n.entityId = e.id
            WHERE
                n.time >= %s
            AND n.time <= %s            
        '''.format(cls.get_notice_table_name(project_id))
        if len(entity_Ids) > 0:
            sql += ' AND n.entityId IN (%s)' % ','.join([str(i) for i in entity_Ids])
        if len(fault_ids) > 0:
            sql += ' AND n.faultId IN (%s)' % ','.join([str(i) for i in fault_ids])
        if len(class_names) > 0:
            sql += ' AND e.className IN (\'%s\')' % '\',\''.join(class_names)     
        group_sort_sql = '''
            GROUP BY
                formatDate,
                f.consequence
            ORDER BY
                n.time ASC
        '''   
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql+group_sort_sql, (start_time, end_time))
        data = []
        for item in result:
            data.append({
                'x': item[2],
                'y': item[0],
                'z': int(item[1])
            })
        return data

    @classmethod
    def get_info_by_time_equipment_energy(cls, project_id, start_time, end_time, entity_Ids, class_names, fault_ids):
        sql = '''
            SELECT
                e.className,
                SUM(n.energy*TIMESTAMPDIFF(HOUR, n.time, n.endTime)) as sumOfEnergy,
                DATE_FORMAT(n.time, '%Y-%m-%d') AS formatDate
            FROM
                {0} n
            LEFT JOIN diagnosis_entity e ON n.entityId = e.id
            WHERE
                n.time >= %s
            AND n.time <= %s
        '''.format(cls.get_notice_table_name(project_id))
        if len(entity_Ids) > 0:
            sql += ' AND n.entityId IN (%s)' % ','.join([str(i) for i in entity_Ids])
        if len(fault_ids) > 0:
            sql += ' AND n.faultId IN (%s)' % ','.join([str(i) for i in fault_ids])
        if len(class_names) > 0:
            sql += ' AND e.className IN (\'%s\')' % '\',\''.join(class_names)    
        group_sort_sql = '''
            GROUP BY
                formatDate,
                e.className
            ORDER BY
                n.time ASC
        '''
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql+group_sort_sql, (start_time, end_time))
        data = []
        for item in result:
            data.append({
                'x': item[2],
                'y': item[0],
                'z': item[1]
            })
        return data

    @classmethod
    def get_info_by_time_consequence_energy(cls, project_id, start_time, end_time, entity_Ids, class_names, fault_ids):
        sql = '''
            SELECT
                f.consequence,
                SUM(n.energy*TIMESTAMPDIFF(HOUR, n.time, n.endTime)) as sumOfEnergy,
                DATE_FORMAT(n.time, '%Y-%m-%d') AS formatDate
            FROM
                {0} n
            LEFT JOIN diagnosis_fault f ON n.faultId = f.id
            LEFT JOIN diagnosis_entity e ON n.entityId = e.id
            WHERE
                n.time >= %s
            AND n.time <= %s
        '''.format(cls.get_notice_table_name(project_id))
        if len(entity_Ids) > 0:
            sql += ' AND n.entityId IN (%s)' % ','.join([str(i) for i in entity_Ids])
        if len(fault_ids) > 0:
            sql += ' AND n.faultId IN (%s)' % ','.join([str(i) for i in fault_ids])
        if len(class_names) > 0:
            sql += ' AND e.className IN (\'%s\')' % '\',\''.join(class_names)    
        group_sort_sql = '''
            GROUP BY
                formatDate,
                f.consequence
            ORDER BY
                n.time ASC
        '''
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql+group_sort_sql, (start_time, end_time))
        data = []
        for item in result:
            data.append({
                'x': item[2],
                'y': item[0],
                'z': item[1]
            })
        return data

    @classmethod
    def get_faults_count_by_processstatus(cls, project_id, start_time, end_time, entity_Ids, class_names, fault_ids):
        sql = '''
            SELECT
                COUNT(n.id),
                COUNT(n.endTime)
            FROM
                {0} n  
            LEFT JOIN diagnosis_entity e ON n.entityId = e.id   
            WHERE
                n.time >= %s
            AND n.time <= %s
        '''.format(cls.get_notice_table_name(project_id))
        if len(entity_Ids) > 0:
            sql += ' AND n.entityId IN (%s)' % ','.join([str(i) for i in entity_Ids])
        if len(fault_ids) > 0:
            sql += ' AND n.faultId IN (%s)' % ','.join([str(i) for i in fault_ids])
        if len(class_names) > 0:
            sql += ' AND e.className IN (\'%s\')' % '\',\''.join(class_names)    
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql, (start_time, end_time))
        return {
            'total': result[0][0],
            'processed': result[0][1]
        }

    @classmethod
    def get_faults_by_fault_type(cls, project_id, start_time, end_time, entity_Ids, class_names, fault_ids):
        ''' 获取 fault 列表 '''
        sql = '''
            SELECT
                n.faultId,
                f.faultType
            FROM
                {0} n  
            LEFT JOIN diagnosis_entity e ON n.entityId = e.id   
            RIGHT JOIN diagnosis_fault f ON f.id = n.faultId
            WHERE
                n.time >= %s
            AND n.time <= %s
        '''.format(cls.get_notice_table_name(project_id))
        if len(entity_Ids) > 0:
            sql += ' AND n.entityId IN (%s)' % ','.join([str(i) for i in entity_Ids])
        if len(fault_ids) > 0:
            sql += ' AND n.faultId IN (%s)' % ','.join([str(i) for i in fault_ids])
        if len(class_names) > 0:
            sql += ' AND e.className IN (\'%s\')' % '\',\''.join(class_names)    
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql, (start_time, end_time))
        data = []
        for item in result:
            data.append({
                "faultId": item[0],
                "faultType": item[1]
            })
        return data

    @classmethod
    def get_energy_by_day(cls, project_id, start_time, end_time, entity_Ids, class_names, fault_ids):
        sql = '''
            SELECT
                SUM(n.energy*TIMESTAMPDIFF(HOUR, n.time, n.endTime)) as sumOfEnergy,
                DATE_FORMAT(n.time, '%Y-%m-%d') AS formatDate
            FROM
                {0} n
            LEFT JOIN diagnosis_entity AS e ON n.entityId = e.id   
            WHERE
                n.time >= %s
            AND n.time <= %s            
        '''.format(cls.get_notice_table_name(project_id))
        if len(entity_Ids) > 0:
            sql += ' AND n.entityId IN (%s)' % ','.join([str(i) for i in entity_Ids])
        if len(fault_ids) > 0:
            sql += ' AND n.faultId IN (%s)' % ','.join([str(i) for i in fault_ids])
        if len(class_names) > 0:
            sql += ' AND e.className IN (\'%s\')' % '\',\''.join(class_names)    
        group_sort_sql = '''
            GROUP BY
                formatDate
            ORDER BY
                n.time ASC
        '''
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql+group_sort_sql, (start_time, end_time))
        data = []
        for item in result:
            data.append({
                'time': item[1],
                'energy': item[0]
            })
        return data

    @classmethod    
    def get_workOrder_info(cls, project_id,ids):
        converter = MySQLConverter()
        # escape string
        sql = '''
            SELECT
                n.entityId,
                n.faultId,
                e.name as entityName,
                e.parent AS entityParent,
                f.name as faultName,                
                f.description,
                ef.points,
                n.time
            FROM
                {0} n
            LEFT JOIN diagnosis_entity_fault ef ON ef.entityId = n.entityId and ef.faultId = n.faultId
            LEFT JOIN diagnosis_entity e ON e.id = n.entityId
            LEFT JOIN diagnosis_fault f ON f.id = n.faultId
        '''.format(cls.get_notice_table_name(project_id))
        if len(ids) > 0:
            sql += 'WHERE n.id IN (%s)' % ','.join([str(i) for i in ids])
        sql += ' ORDER BY n.time'
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
        op_db_query(DB_NAME, sql)
        if len(result) == 0:
            return []
        entity_parent_ids = []
        for item in result:
            if item[3] not in entity_parent_ids:
                entity_parent_ids.append(item[3])
        sql = '''
            SELECT
                id,
                name
            FROM
                diagnosis_entity
            WHERE
                projectId = %s
            AND id IN ({0})
        '''.format(','.join([str(i) for i in entity_parent_ids]))
        entity_query_result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql, (project_id, ))
        entity_id_name_map = {}
        for item in entity_query_result:
            entity_id_name_map[item[0]] = item[1]
        data = []
        for item in result:
            data.append({
                'entityid': item[0],
                'faultId': item[1],
                'entityName': item[2],
                "entityParentName": entity_id_name_map.get(item[3], 'Not Found'),
                'faultName': item[4],
                'description': item[5],
                'points': cls._format_points_str(item[6]),
                'time': item[7].strftime('%Y-%m-%d %H:%M:%S')
            })
        return data   

    @classmethod
    def set_feedback(cls, feedback):
        feedback = dict({'status' : 0, 'handle_person' : None, 'handle_time' : None, 'reason' : None},**feedback)
        rt = MongoConnManager.getConfigConn().setFeedback(feedback)
        return rt

    @classmethod
    def get_feedback(cls, condition):
        rt = MongoConnManager.getConfigConn().getFeedback(condition)
        return rt
    
    @classmethod
    def change_fault_enable(cls, faultIds, entityIds, enable):
        sql = 'UPDATE `diagnosis_entity_fault` SET enable = {0} WHERE (faultId = {1} AND entityId = {2}) '.format(enable,faultIds[0],entityIds[0])
        for i in range(len(faultIds)-1):
            index = i+1
            faultId = faultIds[index]
            entityId = entityIds[index]
            sql += 'OR (faultId = {0} AND entityId = {1}) '.format(faultId, entityId)
        status = None
        try:
            result = BEOPDataAccess.getInstance()._mysqlDBContainer.\
                op_db_update(DB_NAME, sql)
            status = True
        except Exception:
            print(' error:' + str(item[0])) 
            status = False     
        
        return status

    @classmethod
    def get_faults_infos(cls, page_num, page_size, \
         grades, consequences, class_names, keywords, sort, lan):
        ''' 获取设备的报警信息 '''
        converter = MySQLConverter()
        tableName = TABLE_DIAGNOSIS_FAULT if lan == 'zh' else TABLE_DIAGNOSIS_FAULT_ZH
        # escape string
        count_sql = '''SELECT COUNT(*)'''
        item_sql = '''
            SELECT
                f.id,
                f.name,
                f.lastModifyUser,
                f.lastModifyTime,
                f.description,
                f.isPublic
        '''
        sql = '''
            FROM
                {0} f
            WHERE
                f.id > 0
        '''.format(tableName)
        if len(grades) > 0:
            sql += ' AND f.grade IN (%s)' % ','.join([str(i) for i in grades])
        if len(consequences) > 0:
            sql += ' AND f.consequence IN (\'%s\')' % '\',\''.join(consequences)
        if len(class_names) > 0:
            sql += ' AND f.className IN (\'%s\')' % '\',\''.join(class_names)
        if keywords:
            sql += ' AND f.name like "%{0}%"'.format(keywords)
        for item in sort:
            if sort.index(item) == 0:
                sql += ' ORDER BY {0} {1}'.format(item['key'],item['order'])
            else:
                sql += ' ,{0} {1}'.format(item['key'],item['order'])
        limt_sql = ' LIMIT {0},{1}'.format((page_num-1)*page_size, page_size)
        notice_count = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, count_sql+sql)
        notice_result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, item_sql+sql+limt_sql)
        if len(notice_result) == 0:
            return {
                'data':[],
                'total': 0
            }
        data = []
        for item in notice_result:
            data.append({
                'id': item[0],
                'name': item[1],
                'lastModifyUser': item[2],
                'lastModifyTime': item[3].strftime('%Y-%m-%d %H:%M:%S'),
                'description': item[4],
                'isPublic': item[5]
            })
        return {
            'data': data,
            'total': notice_count[0][0]
        }

    @classmethod
    def get_faults_class_names(cls):
        sql = '''
            SELECT
                className
            FROM
                `diagnosis_fault_zh`
            GROUP BY
                className
        '''
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql)
        data = []
        for item in result:
            data.append(item[0])
        RedisManager.set('strategyClassName', data)
        return data