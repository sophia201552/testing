"""策略组态 数据处理层"""
from datetime import datetime, timedelta
from mysql.connector.conversion import MySQLConverter
from beopWeb.BEOPDataAccess import BEOPDataAccess
from beopWeb.MongoConnManager import MongoConnManager
import time

#define table names
DB_NAME = 'diagnosis'
TABLE_DIAGNOSIS_ENTITY = 'diagnosis_entity'
TABLE_DIAGNOSIS_FAULT = 'diagnosis_fault'
TABLE_DIAGNOSIS_FAULT_ZH = 'diagnosis_fault_zh'
TABLE_DIAGNOSIS_ENTITY_FAULT = 'diagnosis_entity_fault'
TABLE_DIAGNOSIS_NOTICE = 'diagnosis_%s_notice'
TABLE_DIAGNOSIS_ENUM = 'diagnosis_enum'

class DiagnosisReportService:
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
    def get_report_template_summary(cls, projectId, startTime, endTime, lan, condition):
        faultTable = TABLE_DIAGNOSIS_FAULT_ZH
        if lan == 'en':
            faultTable = TABLE_DIAGNOSIS_FAULT
        data = {
            "fault": [],
            "building": []
        }
        conditionStr = DiagnosisReportService.generateConditionStr(condition)
        sql = '''
            SELECT
                f.id,
                f.name,
                n.time,
                n.endTime,
                count(*) as occNum
            FROM
                {0} n
            LEFT JOIN `{3}` f ON n.faultId = f.id
            WHERE n.time <= "{1}"
            AND n.time >= "{2}"
            {4}
            GROUP BY n.entityId,n.faultId
            ORDER BY f.name DESC
        '''.format(cls.get_notice_table_name(projectId), endTime, startTime, faultTable, conditionStr)
        sql2 = '''
            SELECT
                n.entityId,
	            COUNT(n.entityId) AS count
            FROM
                {0} n
            WHERE
                n.time >= "{1}"
            AND n.time <= "{2}"
            AND projectId = {3}
            {4}
            GROUP BY n.entityId
        '''.format(cls.get_notice_table_name(projectId), startTime, endTime, projectId, conditionStr)
        sql3 = '''
            SELECT
                e1.id,
                GROUP_CONCAT(e2.id ORDER BY e2.id) children,
                COUNT(e2.parent) count,
                e1.type,
                e1.parent,
                e1.name
            FROM
                {0} e1
            LEFT JOIN {0} e2 ON e2.parent = e1.id
            WHERE
                e1.projectId={1}
            AND e2.parent <> 0
            {2}
            GROUP BY
                e1.id
        '''.format(TABLE_DIAGNOSIS_ENTITY, projectId,conditionStr)
        
        try:
            result = BEOPDataAccess.getInstance()._mysqlDBContainer.\
                op_db_query(DB_NAME, sql)
            itemObj = {}
            for item in result:
                name = item[1]
                start = time.mktime(item[2].timetuple())
                end = time.mktime(item[3].timetuple()) if item[3] else time.mktime(datetime.strptime(endTime,'%Y-%m-%d %H:%M:%S').timetuple())
                occNum = item[4]
                if itemObj.get(name) is None:
                    itemObj[name] = {
                        "count": 1,
                        "time": end - start,
                        "occNum":occNum

                    }
                else:
                    count = itemObj.get(name).get('count')+1
                    timeS = itemObj.get(name).get('time') + end - start
                    occNumS = itemObj.get(name).get('occNum') + occNum
                    itemObj.get(name).update({
                        "count": count,
                        "time": timeS,
                        "occNum":occNumS
                    })
            data_fault = []
            for name, item in itemObj.items():
                count = item.get("count")
                occNum = item.get("occNum")
                import math
                averageTime = math.ceil(item.get("time")/occNum/60/60) #显示小时
                # data['fault'].append({
                #     "name": name,
                #     "count": count,
                #     "averageTime": averageTime
                # })
                data_fault.append([count,name,averageTime])

            data_fault.sort(reverse=True)
            for item in data_fault:
                data['fault'].append({
                    "name": item[1],
                    "count": item[0],
                    "averageTime": item[2]
                })

            result2 = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
                op_db_query(DB_NAME, sql2)
            wrong_entities = {}
            for item in result2:
                wrong_entities[item[0]] = item[1]

            result3 = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
                op_db_query(DB_NAME, sql3)
            id_map = {}
            for item in result3:
                id_map[item[0]] = {
                    'id': item[0],
                    'children': item[1],
                    'count': item[2],
                    'type': item[3],
                    'parent': item[4],
                    'name': item[5]
                }
            for entity_id in id_map:
                cls._calc_entity_total(id_map, wrong_entities, entity_id)

            result3 = []
            result4 = []
            for entity_id, value in id_map.items():
                if value['type'] == 0 and value['parent'] == 0 and value['wrong'] is not 0:
                    result4.append([value['wrong'],value['name']])

            result4.sort(reverse=True)
            for item in result4:
                result3.append({'name': item[1],
                                'count': item[0]})
            # 给设备加上错误信息
            # for entity_id, value in wrong_entities.items():
            #     result3.append({
            #         'id': entity_id,
            #         'wrongQuantity': value
            #     })
            data['building'] = result3
        except Exception:
            print(' error:' + str(item[0]))
        return data

    @classmethod
    def get_report_template_summary_old(cls, projectId, startTime, endTime, lan, condition):
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)

        conditionStr = DiagnosisReportService.generateConditionStr(condition)

        data = {
            "fault": [],
            "building": []
        }
        sql = '''
            SELECT
                f.id,
                f.name,
                n.time,
                n.endTime,
                count(f.id) as occNum
            FROM
                {0}_diagnosis_notices n
            LEFT JOIN {0}_diagnosis_faults f ON n.faultId = f.id
            WHERE n.time <= "{1}"
            AND n.time >= "{2}"
            {3}
            GROUP BY f.EquipmentId,f.`Name`
            ORDER BY count(*) DESC
        '''.format(dbname, endTime, startTime, conditionStr)
        sql2 = '''
            SELECT
            BuildingName as name, count(*) AS number,selectlab
            FROM
            (
                SELECT
                    z.BuildingName,
                    f. NAME,
                    n.time,
                    n.endTime,
                    CONCAT(f.EquipmentId,f.`Name`) as selectlab
                FROM
                    {0}_diagnosis_notices n
                LEFT JOIN {0}_diagnosis_faults f ON n.faultId = f.id
                LEFT JOIN {0}_diagnosis_equipments e ON f.EquipmentId = e.Id
                LEFT JOIN {0}_diagnosis_zones z ON z.id = e.ZoneId
                WHERE
                    n.time >= "{1}"
                AND n.time <= "{2}"
                {3}
                                    GROUP BY
                                                    f.EquipmentId,
                                                    f.`Name`
            ) temp
            where BuildingName is not NULL
            GROUP BY
                BuildingName
            order by count(selectlab) desc 
        '''.format(dbname, startTime, endTime, conditionStr)

        try:
            result = BEOPDataAccess.getInstance()._mysqlDBContainer.\
                op_db_query(DB_NAME, sql)
            itemObj = {}
            for item in result:
                name = item[1]
                start = time.mktime(item[2].timetuple())
                end = time.mktime(item[3].timetuple()) if item[3] else time.mktime(datetime.strptime(endTime,'%Y-%m-%d %H:%M:%S').timetuple())
                occNum = item[4]
                if itemObj.get(name) is None:
                    itemObj[name] = {
                        "count": 1,
                        "time": end - start,
                        "occNum":occNum

                    }
                else:
                    count = itemObj.get(name).get('count')+1
                    timeS = itemObj.get(name).get('time') + end - start
                    occNumS = itemObj.get(name).get('occNum') + occNum
                    itemObj.get(name).update({
                        "count": count,
                        "time": timeS,
                        "occNum":occNumS
                    })
            data_fault = []
            for name, item in itemObj.items():
                count = item.get("count")
                occNum = item.get("occNum")
                import math
                averageTime = math.ceil(item.get("time")/occNum/60/60) #显示小时
                data_fault.append([count, name, averageTime])   

            data_fault.sort(reverse=True)
            for item in data_fault:
                data['fault'].append({
                    "name": item[1],
                    "count": item[0],
                    "averageTime": item[2]
                })

            result2 = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
                op_db_query(DB_NAME, sql2)
            result3 = []
            for item in result2:
                result3.append({'name': item[0],
                                'count': item[1]})

            data['building'] = result3
        except Exception:
                print(' error:' + str(item[0]))
        return data

    @classmethod
    def get_report_template_content(cls, projectId, startTime, endTime, lan, condition):
        faultTable = TABLE_DIAGNOSIS_FAULT_ZH
        classNameDefault = '其他'
        if lan == 'en':
            faultTable = TABLE_DIAGNOSIS_FAULT
            classNameDefault ='Other'
        conditionStr = DiagnosisReportService.generateConditionStr(condition)

        sql = '''
            SELECT
                n.time,
                IFNULL(n.endTime,%s) as endTime,
                IFNULL(e.className,%s) as className,
                e. NAME AS entityName,
                f. NAME AS faultName,
                f.description,
                f.chartTitle,
                ef.points,
                ef.axisName,
                ef.axisSet
            FROM
                {0} n
            LEFT JOIN diagnosis_entity_fault ef ON ef.entityId = n.entityId
            AND ef.faultId = n.faultId
            LEFT JOIN diagnosis_entity e ON e.id = n.entityId
            LEFT JOIN {1} f ON f.id = n.faultId
            WHERE
               n.time >= %s
            AND n.time <= %s
            {2}
            GROUP BY
                f. NAME
            ORDER BY
                e.className
        '''.format(cls.get_notice_table_name(projectId), faultTable,conditionStr)
        result = BEOPDataAccess.getInstance()._mysqlDBContainer.\
                op_db_query(DB_NAME, sql, (endTime,classNameDefault,startTime, endTime))
        data = []
        entityTypeArr = []
        for item in result:
            pointResult = []
            axisNameArr = []
            if item[7]:
                pointArr = item[7].split('|')
                setArr = item[9].split('|')
                for index,val in enumerate(pointArr):
                    pointResult.append({
                        'name': '@' + str(projectId) +'|'+ val.split(',')[0],
                        'description': val.split(',')[1],
                        'set': setArr[index]
                    })
                for name in item[8].split('|'):
                    axisNameArr.append({'name':name})


            if type(item[1])==type(''):
                e_Time = datetime.strptime(item[1],"%Y-%m-%d %H:%M:%S")
            else:
                e_Time = item[1]
            if (e_Time- item[0]).total_seconds()>3*60*60:#取数据超过3个小时的时候处理一下,画图时间不用取太长,也避免太长
                e_Time = (item[0]+timedelta(hours=3)).strftime("%Y-%m-%d %H:%M:%S")
            else:
                e_Time = e_Time.strftime("%Y-%m-%d %H:%M:%S")
            s_Time = item[0].strftime("%Y-%m-%d %H:%M:%S")

            if item[2] in entityTypeArr:
                for single in data:
                    if single['entityType'] == item[2]:
                        single['units'].append({
                            'faultName': item[4],
                            'time': s_Time,
                            'endTime': e_Time,
                            'entity': [{
                                'name': item[3],
                                'advince': item[5],
                            }],
                            'points': pointResult,
                            'title': item[6],
                            'axis': axisNameArr
                        })
            else:
                entityTypeArr.append(item[2])
                single = {
                    'entityType': item[2],
                    'units': []
                }
                single['units'].append({
                            'faultName': item[4],
                            'time': s_Time,
                            'endTime': e_Time,
                            'entity': [{
                                'name': item[3],
                                'advince': item[5],
                            }],
                            'points': pointResult,
                            'title': item[6],
                            'axis': axisNameArr
                        })
                data.append(single)
        return data

    @classmethod
    def get_report_template_content_old(cls, projectId, startTime, endTime, lan,condition):
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        classNameDefault = '其他'
        if lan == 'en':
            classNameDefault ='Other'

        conditionStr = DiagnosisReportService.generateConditionStr(condition)
        sql = '''
            SELECT
                n.time,
                IFNULL(n.endTime,%s) as endTime,
                IFNULL(e.SubSystemName,%s) as className,
                e.`Name` AS entityName,
                f.`Name` AS faultName,
                f.description,
                f.chartTitle,
                f.points,
                f.axisName,
                f.axisSet
            FROM
                {0}_diagnosis_notices n
            LEFT JOIN {0}_diagnosis_faults f ON f.id = n.FaultId
            LEFT JOIN {0}_diagnosis_equipments e ON f.EquipmentId = e.Id
            LEFT JOIN {0}_diagnosis_zones z ON z.id = e.ZoneId
            WHERE n.time >= %s
            AND n.time <= %s
            {1}
            GROUP BY
                f. NAME
            ORDER BY
                e.SubSystemName
        '''.format(dbname,conditionStr)
        result = BEOPDataAccess.getInstance()._mysqlDBContainer.\
                op_db_query(DB_NAME, sql, (endTime,classNameDefault,startTime, endTime))
        data = []
        entityTypeArr = []
        for item in result:
            pointResult = []
            axisNameArr = []
            if item[7]:
                pointArr = item[7].split('|')
                setArr = item[9].split('|')
                for index,val in enumerate(pointArr):
                    pointResult.append({
                        'name': '@' + str(projectId) +'|'+ val.split(',')[0],
                        'description': val.split(',')[1],
                        'set': setArr[index]
                    })
                for name in item[8].split('|'):
                    axisNameArr.append({'name':name})


            if type(item[1])==type(''):
                e_Time = datetime.strptime(item[1],"%Y-%m-%d %H:%M:%S")
            else:
                e_Time = item[1]
            if (e_Time- item[0]).total_seconds()>3*60*60:#取数据超过3个小时的时候处理一下,画图时间不用取太长,也避免太长
                e_Time = (item[0]+timedelta(hours=3)).strftime("%Y-%m-%d %H:%M:%S")
            else:
                e_Time = e_Time.strftime("%Y-%m-%d %H:%M:%S")
            s_Time = item[0].strftime("%Y-%m-%d %H:%M:%S")

            if item[2] in entityTypeArr:
                for single in data:
                    if single['entityType'] == item[2]:
                        single['units'].append({
                            'faultName': item[4],
                            'time': s_Time,
                            'endTime': e_Time,
                            'entity': [{
                                'name': item[3],
                                'advince': item[5],
                            }],
                            'points': pointResult,
                            'title': item[6],
                            'axis': axisNameArr
                        })
            else:
                entityTypeArr.append(item[2])
                single = {
                    'entityType': item[2],
                    'units': []
                }
                single['units'].append({
                    'faultName': item[4],
                    'time': s_Time,
                    'endTime': e_Time,
                    'entity': [{
                        'name': item[3],
                        'advince': item[5],
                    }],
                    'points': pointResult,
                    'title': item[6],
                    'axis': axisNameArr
                })
                data.append(single)
        return data

    @classmethod
    def get_report_template_appendix(cls, projectId, startTime, endTime, lan, condition):
        data = []
        conditionStr = DiagnosisReportService.generateConditionStr(condition)
        faultTable = TABLE_DIAGNOSIS_FAULT_ZH
        if lan == 'en':
            faultTable = TABLE_DIAGNOSIS_FAULT
        sql1 = '''
            SELECT
                GROUP_CONCAT(n.entityId),
                f.name as faultname,
                f.id,
				GROUP_CONCAT(e.`name`) as entityname,
				e2.`name` as parentname
            FROM
                {0} n
            LEFT JOIN {1} f ON f.id = n.faultId
			LEFT JOIN diagnosis_entity e on e.id = n.entityId
			LEFT JOIN diagnosis_entity e2 ON e.parent = e2.id
            WHERE n.time <= "{2}"
            AND n.time >= "{3}"
            {4}
            GROUP BY n.faultId,e2.`name`
        '''.format(cls.get_notice_table_name(projectId), faultTable, endTime, startTime,conditionStr)
        result1 = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
                op_db_query(DB_NAME, sql1)

        result ={}
        for item in result1:
            equiplist = list(set(item[3].split(',')))
            if item[1] in result:
                result[item[1]].append({'subbuilding': item[4],
                                                  'equiplist': equiplist})
            else:
                result[item[1]] = [{'subbuilding': item[4],
                                                  'equiplist': equiplist}]
        for k in result:
            data.append({
                "faultName": k,
                "buildings":result[k]
            })
        return data

    @classmethod
    def get_report_template_appendix_old(cls, projectId, startTime, endTime, lan, condition):
        data = []
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        conditionStr = DiagnosisReportService.generateConditionStr(condition)
        sql1 = '''
            SELECT
            GROUP_CONCAT(f.EquipmentId),
            f.`Name` AS faultname,
            f.id,
            GROUP_CONCAT(e.`Name`) AS entityname,
            z.SubBuildingName AS parentname
            FROM
                {0}_diagnosis_notices n
            LEFT JOIN {0}_diagnosis_faults f ON n.faultId = f.id
            LEFT JOIN {0}_diagnosis_equipments e ON f.EquipmentId = e.Id
            LEFT JOIN {0}_diagnosis_zones z ON z.id = e.ZoneId
            WHERE
                n.time <= "{1}"
            AND n.time >= "{2}"
            {3}
            GROUP BY
                z.SubBuildingName, f.`Name`
            '''.format(dbname, endTime, startTime, conditionStr)
        result1 = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
                op_db_query(DB_NAME, sql1)

        result ={}
        for item in result1:
            equiplist = list(set(item[3].split(',')))
            if item[1] in result:
                result[item[1]].append({
                    'subbuilding': item[4],
                    'equiplist': equiplist
                })
            else:
                result[item[1]] = [{
                    'subbuilding': item[4],
                    'equiplist': equiplist
                }]
        for k in result:
            data.append({
                "faultName": k,
                "buildings":result[k]
            })
        return data

    @classmethod
    def generateConditionStr(cls,condition):
        conditionStr = ''
        if condition:
            for ck,cv in  condition.items():
                conditionStr += ' AND %s = "%s" ' %(ck,str(cv))
        return conditionStr
