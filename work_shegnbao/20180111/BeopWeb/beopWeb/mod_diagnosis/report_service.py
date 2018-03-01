"""策略组态 数据处理层"""
import time
from datetime import datetime, timedelta
from mysql.connector.conversion import MySQLConverter
from beopWeb.BEOPDataAccess import BEOPDataAccess
from beopWeb.MongoConnManager import MongoConnManager
from beopWeb.mod_admin.User import User
import requests
from flask import json, jsonify, make_response, request, send_file
from .service import TableHelper

#define table names
DB_NAME = 'diagnosis'
TABLE_DIAGNOSIS_NOTICE = 'diagnosis_%s_notice'
TABLE_DIAGNOSIS_ENUM = 'diagnosis_enum'

class DiagnosisReportService:
    ''' 新版诊断 数据处理类 '''

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
            wrong = cls._calc_entity_total(id_map, wrong_entities, child)
            value['wrong'] += wrong
        return value['wrong']

    @classmethod
    def get_report_template_summary(cls, projectId, startTime, endTime, lan, condition):
        faultTable = TableHelper.get_fault_tablename(lan)
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
        '''.format(TableHelper.get_notice_tablename(projectId), endTime, startTime, faultTable, conditionStr)


        sql2 = '''
            SELECT
                temp.entityId,
                count(temp.entityId) as count
            FROM
                (
                    SELECT
                        n.entityId as entityId
                    FROM
                        {0} n
                    WHERE
                        n.time >= "{1}"
                    AND n.time <= "{2}"
                    AND projectId = {3}
                    {4}
                    GROUP BY n.entityId,n.faultId) temp
            GROUP BY temp.entityId
        '''.format(TableHelper.get_notice_tablename(projectId), startTime, endTime, projectId, conditionStr)
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
        '''.format(TableHelper.get_entity_tablename(projectId, lan), projectId, conditionStr)
        
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
                averageTime = math.ceil(item.get("time")/count/60/60) #显示小时
                averageTime_Min = math.ceil(item.get("time")/count/60) #显示分钟
                # data['fault'].append({
                #     "name": name,
                #     "count": count,
                #     "averageTime": averageTime
                # })
                data_fault.append([count,name,averageTime,averageTime_Min])

            data_fault.sort(reverse=True)
            for item in data_fault:
                data['fault'].append({
                    "name": item[1],
                    "count": item[0],
                    "averageTime": item[2],
                    "averageTime_Min":item[3]
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
            for entity_id, value in id_map.items():
                cls._calc_entity_total(id_map, wrong_entities, entity_id)
            result3 = []
            result4 = []
            def getChildren(childrenStr):
                if childrenStr=='':
                    return []
                arr = []
                rs = childrenStr.split(',')
                for childId in rs:
                    if int(childId) in id_map:
                        arr.append(id_map[int(childId)]['children'])
                childrenArr = ','.join(arr).split(',')
                childrenArr = list(set(childrenArr))
                rs.extend(getChildren(','.join(childrenArr)))
                rs = list(set(rs))
                return rs

            for entity_id, value in id_map.items():
                if value['type'] == 0 and value['parent'] == 0 and value['wrong'] is not 0:
                    children = getChildren(value['children'])
                    total = value['wrong']
                    if entity_id in wrong_entities:
                        total += wrong_entities.get(entity_id, 0)
                    result4.append([total, value['name'], children])

            result4.sort(reverse=True)
            for item in result4:
                sql = '''
                    SELECT
                        f.name
                    FROM
                        {0} n
                    LEFT JOIN `{3}` f ON n.faultId = f.id
                    WHERE n.time <= "{1}"
                    AND n.time >= "{2}"
                    AND n.entityId in ({5})
                    {4}
                    LIMIT 0,5
                '''.format(TableHelper.get_notice_tablename(projectId), endTime, startTime, faultTable, conditionStr, ','.join(item[2]))
                result = BEOPDataAccess.getInstance()._mysqlDBContainer.\
                op_db_query(DB_NAME, sql)
                faults = []
                for r in result:
                    faults.append(r[0])
                result3.append({'name': item[1],
                                'count': item[0],
                                'faults': ','.join(faults)})
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
            BuildingName as name, 
            count(*) AS number,
            selectlab,
            GROUP_CONCAT(name) AS faultName
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
                averageTime = math.ceil(item.get("time")/count/60/60) #显示小时
                averageTime_Min = math.ceil(item.get("time")/count/60) #显示分钟
                data_fault.append([count, name, averageTime,averageTime_Min])

            data_fault.sort(reverse=True)
            for item in data_fault:
                data['fault'].append({
                    "name": item[1],
                    "count": item[0],
                    "averageTime": item[2],
                    "averageTime_Min":item[3]
                })

            result2 = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
                op_db_query(DB_NAME, sql2)
            result3 = []
            for item in result2:
                faultsArr = item[3].split(',')
                if len(faultsArr)>5:
                    faultsArr = faultsArr[0:5]
                result3.append({'name': item[0],
                                'count': item[1],
                                'faults': ','.join(faultsArr)})

            data['building'] = result3
        except Exception:
                print(' error:' + str(item[0]))
        return data

    @classmethod
    def get_report_template_content(cls, projectId, startTime, endTime, lan, condition):
        faultTable = TableHelper.get_fault_tablename(lan)
        classNameDefault = '其他'
        if lan == 'en':
            classNameDefault = 'Other'
        conditionStr = DiagnosisReportService.generateConditionStr(condition)

        sql = '''
            SELECT
                n.time,
                IFNULL(n.endTime,%s) as endTime,
                IFNULL(e.className,%s) as className,
                GROUP_CONCAT(e.`Name`) AS entityName,
                f.`Name` AS faultName,
                f.description,
                f.chartTitle,            
                ef.points,
                ef.axisName,
                ef.axisSet,
                n.id,
                n.faultId,
                n.entityId,
                f.suggestion,
                e.location,
                n.detail
            FROM
                {0} n
            LEFT JOIN {1} ef ON ef.entityId = n.entityId
            AND ef.faultId = n.faultId
            LEFT JOIN {2} e ON e.id = n.entityId
            LEFT JOIN {3} f ON f.id = n.faultId
            WHERE
               n.time >= %s
            AND n.time <= %s
            {4}
            GROUP BY
                f. NAME
            ORDER BY
                e.className
        '''.format(
            TableHelper.get_notice_tablename(projectId),
            TableHelper.get_entity_fault_tablename(projectId, lan),
            TableHelper.get_entity_tablename(projectId, lan),
            faultTable,
            conditionStr
        )
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
                        'name': '@' + str(projectId) + '|' + val.split(',')[0],
                        'description': val.split(',')[1],
                        'set': setArr[index]
                    })
                for name in item[8].split('|'):
                    axisNameArr.append({'name':name})

            if type(item[1]) == type(''):
                e_Time = datetime.strptime(item[1], "%Y-%m-%d %H:%M:%S")
            else:
                e_Time = item[1]
            if (e_Time- item[0]).total_seconds()>3*60*60:   # 取数据超过3个小时的时候处理一下,画图时间不用取太长,也避免太长
                e_Time = (item[0]+timedelta(hours=3)).strftime("%Y-%m-%d %H:%M:%S")
            else:
                e_Time = e_Time.strftime("%Y-%m-%d %H:%M:%S")
            s_Time = item[0].strftime("%Y-%m-%d %H:%M:%S")
            entityNameArr = item[3].split(',')[0:6]
            entityArr = []
            location = item[14]
            faultDescription = item[5]
            faultSuggestion = item[13]
            def str2Json(string):
                try:
                    return json.loads(string)
                except Exception:
                    return {}
            noticeDetailJson = str2Json(item[15])
            
            for k,v in noticeDetailJson.items():
                faultDescription = faultDescription.replace('{'+str(k)+'}',str(v))
                faultSuggestion = faultSuggestion.replace('{'+str(k)+'}',str(v))
            for index,name in enumerate(entityNameArr):
                if index == 0:
                    if lan == 'zh':
                        advince = faultDescription + faultSuggestion
                    else:
                        advince = faultDescription + ' ' + faultSuggestion
                else:
                    advince = ''
                entityArr.append({
                    'name': name,
                    'advince': advince,
                    'location': location
                })
            if item[2] in entityTypeArr:
                for single in data:
                    if single['entityType'] == item[2]:
                        single['units'].append({
                            'faultName': item[4],
                            'time': s_Time,
                            'endTime': e_Time,
                            'entity': entityArr,
                            'points': pointResult,
                            'title': item[6],
                            'axis': axisNameArr,
                            'noticeId': item[10],
                            'faultId': item[11],
                            'entityId': item[12]
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
                            'entity': entityArr,
                            'points': pointResult,
                            'title': item[6],
                            'axis': axisNameArr,
                            'noticeId': item[10],
                            'faultId': item[11],
                            'entityId': item[12]
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
                IFNULL(e.entityType,%s) as className,
                GROUP_CONCAT(e.`Name`) AS entityName,
                f.`Name` AS faultName,
                f.description,
                f.chartTitle,            
                f.points,
                f.axisName,
                f.axisSet,
                n.id,
                n.faultId
            FROM
                {0}_diagnosis_notices n
            LEFT JOIN {0}_diagnosis_faults f ON f.id = n.FaultId
            LEFT JOIN {0}_diagnosis_equipments e ON f.EquipmentId = e.Id
            LEFT JOIN {0}_diagnosis_zones z ON z.id = e.ZoneId
            WHERE n.time >= %s
            AND n.time <= %s
            {1}
            GROUP BY
                f.`Name`
            ORDER BY
                e.entityType
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
            entityNameArr = item[3].split(',')[0:6]
            entityArr = []
            for index,name in enumerate(entityNameArr):
                if index == 0:
                    advince = item[5]
                else:
                    advince = ''
                entityArr.append({
                    'name': name,
                    'advince': advince,
                })
            if item[2] in entityTypeArr:
                for single in data:
                    if single['entityType'] == item[2]:
                        single['units'].append({
                            'faultName': item[4],
                            'time': s_Time,
                            'endTime': e_Time,
                            'entity': entityArr,
                            'points': pointResult,
                            'title': item[6],
                            'axis': axisNameArr,
                            'noticeId': item[10],
                            'faultId': item[11]
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
                    'entity': entityArr,
                    'points': pointResult,
                    'title': item[6],
                    'axis': axisNameArr,
                    'noticeId': item[10],
                    'faultId': item[11]
                })
                data.append(single)
        return data

    @classmethod
    def get_report_template_appendix(cls, projectId, startTime, endTime, lan, condition):
        data = []
        conditionStr = DiagnosisReportService.generateConditionStr(condition)
        faultTable = TableHelper.get_fault_tablename(lan)
        sql1 = '''
            SELECT
                GROUP_CONCAT(n.entityId),
                f.name as faultname,
                f.id,
				GROUP_CONCAT(e.`name`) as entityname,
				e.location
            FROM
                {0} n
            LEFT JOIN {1} f ON f.id = n.faultId
			LEFT JOIN {5} e on e.id = n.entityId
            WHERE n.time <= "{2}"
            AND n.time >= "{3}"
            {4}
            GROUP BY n.faultId, e.location
            ORDER BY e.className, f.name
        '''.format(
            TableHelper.get_notice_tablename(projectId),
            faultTable,
            endTime,
            startTime,
            conditionStr,
            TableHelper.get_entity_tablename(projectId, lan),
        )
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
            f.EquipmentId,
            f.`Name` AS faultname,
            f.id,
            e.`Name` AS entityname,
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
            ORDER BY e.SubsystemName, f.`Name`
            '''.format(dbname, endTime, startTime, conditionStr)
        result1 = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
                op_db_query(DB_NAME, sql1)
        result2 = {}
        for item in result1:
            if item[1] in result2:
                if item[4] in result2[item[1]]:
                    result2[item[1]][item[4]].append(item[3])
                else:
                    result2[item[1]][item[4]] = [item[3]]
            else:
                result2[item[1]] = {
                    item[4]: [item[3]]
                }
        for faultName in result2:
            buildings = []
            for subbuilding in result2[faultName]:
                equiplist = list(set(result2[faultName][subbuilding]))
                buildings.append({
                    'subbuilding': subbuilding,
                    'equiplist': equiplist
                })
            data.append({
                "faultName": faultName,
                "buildings":buildings
            })
        return data

    @classmethod
    def generateConditionStr(cls,condition):
        conditionStr = ''
        if condition:
            for ck,cv in  condition.items():
                if type(cv) == type([]):
                    conditionStr += ' AND %s in %s ' %(ck,tuple(cv))
                else:
                    conditionStr += ' AND %s = "%s" ' %(ck,str(cv))
        return conditionStr

    @classmethod
    def get_faultReport_group_by_group_new(cls, projId, startTime, endTime, lan):
        #update by /diagnosis/getFaultReportGroupByGroup
        data = []
        noticeTable = TableHelper.get_notice_tablename(projId)
        faultTable = TableHelper.get_fault_tablename(lan)
        classNameDefault = '其他'
        if lan == 'en':
            classNameDefault ='Other'
        strGroupBy = "GROUP BY f.Name"
        strSort = ''
        if type == "consequence":
            strGroupBy = "GROUP BY f.Consequence, f.name"
            strSort = 'ORDER BY f.FaultType DESC,n.Energy DESC'
        sql = '''
            SELECT
                f.name AS FaultName,
                f.description,
                group_concat(e.id) AS EquipmentId,
                group_concat(e.name) AS EquipmentName,
                ef.targetGroup,
                ef.targetExecutor,
                CASE WHEN ef.grade IS NULL THEN f.grade ELSE ef.grade END AS grade,
                f.consequence,
                n.orderId,
                SUM(IF(`orderId` <> "0", 1, 0)) AS CLOSED,
                SUM(IF(`orderId` = "0", 1, 0)) AS WIP,
                n.time,
                f.faultType,
                n.energy,
                ef.runYear,
                n.energy * ef.runYear
            FROM
                {0} n
            LEFT JOIN {1} f ON n.faultId = f.id
            LEFT JOIN {7} e ON n.entityId = e.id
            LEFT JOIN {8} ef ON ef.faultId = n.faultId AND ef.entityId = n.entityId
            WHERE
                n.time <= '{2}'
            AND n.time >= '{3}'
            AND n.projectId = {4} 
            {5}
            {6}
        '''.format(
                noticeTable,
                faultTable,
                endTime,
                startTime,
                projId,
                strGroupBy,
                strSort,
                TableHelper.get_entity_tablename(projId, lan),
                TableHelper.get_entity_fault_tablename(projId, lan)
            )
        try:
            dbrv = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
                op_db_query(DB_NAME, sql)
            if dbrv:
                group_dict = {}
                user = User()
                userlist = user.get_user_list_info(list(set([item[5] for item in dbrv])))
                usermap = {}
                for item in userlist:
                    usermap[item.get('id')] = item.get('userfullname')
                for item in dbrv:
                    try:
                        strGroupId = item[4]
                        grade = item[6] #UserFaultGrade
                        newEquipmentId = ','.join(list(set(item[2].split(','))))
                        newEquipmentName = ','.join(list(set(item[3].split(','))))
                        if strGroupId in group_dict.keys():
                            group_dict.get(strGroupId).get('list').append({'OrderId': item[8], 'FaultName':item[0], 'Grade':grade,
                                                                        'Desc':item[1],'EquipmentName':newEquipmentName,
                                                                        'Status':[int(item[9]),int(item[10])], 'ExecuterId':item[5],
                                                                        'ExecuterName':usermap.get(item[5], 'unknown'), 'EquipmentId':newEquipmentId,
                                                                        'Target':cls.get_target_by_equipment(newEquipmentName, newEquipmentId),
                                                                        'Consequence':item[7], 'FaultType':item[12], 'Energy':item[13],
                                                                        'YearEnergy': float(item[15])})
                            group_dict.get(strGroupId).update({'YearEnergy': group_dict.get(strGroupId).get('YearEnergy') + float(item[15])})
                        else:
                            group_dict.update({strGroupId:{'GroupName':strGroupId, 'GroupId':strGroupId, 'YearEnergy': float(item[15]),
                                                        'list':[{'OrderId': item[8],'FaultName':item[0], 'Grade':grade, 'Desc':item[1],
                                                                    'Status':[int(item[9]),int(item[10])], 'ExecuterId':item[5],
                                                                    'ExecuterName':usermap.get(item[5], 'unknown'), 'EquipmentId':newEquipmentId,
                                                                    'EquipmentName':newEquipmentName,
                                                                    'Target':cls.get_target_by_equipment(newEquipmentName, newEquipmentId),
                                                                    'Consequence':item[7], 'FaultType':item[12], 'Energy':item[13],
                                                                    'YearEnergy': float(item[15])}]}})
                    except Exception as e:
                        print('get_faultReport_group_by_group_new error:' + e.__str__())
                        pass
                if group_dict:

                    for key in group_dict.keys():
                        data.append(group_dict.get(key))
        except Exception as e:
            print('get_faultReport_group_by_group_new error:' + e.__str__())
            logging.error(e.__str__())
        return data

    @classmethod
    def get_target_by_equipment(cls, EquipmentName, EquipmentId):
        rt = ''
        headers = {'content-type': 'application/json'}
        url = 'http://121.40.140.32:5111/equipmentTarget/getTarget'
        try:
            if isinstance(EquipmentId, str) and isinstance(EquipmentName, str):
                EquipmentId_list = EquipmentId.split(',')
                EquipmentName_list = EquipmentName.split(',')
            else:
                EquipmentId_list = [int(EquipmentId)]
                EquipmentName_list = [EquipmentName]
            post_data = {'target':{}}
            for i in range(len(EquipmentId_list)):
                try:
                    post_data.get('target').update({EquipmentName_list[i]:EquipmentId_list[i]})
                except Exception as e:
                    pass
            if post_data.get('target'):
                res = requests.post(url, json.dumps(post_data), headers=headers, timeout=30)
                if res.status_code == 200:
                    rt = json.loads(res.text).get('target')
        except Exception as e:
            raise Exception(e.__str__())
        return rt

    @classmethod
    def getDiagnosisNoticeRank(cls, projectId, needDetail, arrConsquence, startTime, endTime, lan):
        rt = {}
        noticeTable = TableHelper.get_notice_tablename(projectId)
        faultTable = TableHelper.get_fault_tablename(lan)
        try:
            sql = '''
                SELECT
                    f.consequence,
                    f.name,
                    f.description,
                    ef.points,
                    CASE WHEN ef.grade IS NULL THEN f.grade ELSE ef.grade END AS grade,
                    e.name,
                    GROUP_CONCAT(f.id),
                    SUM(
                        n.energy * TIMESTAMPDIFF(
                            SECOND,
                            n.time,
                            CASE
                        WHEN n.endTime IS NULL THEN
                            TIME('{0}')
                        ELSE
                            n.EndTime
                        END
                        )
                    )
                FROM
                    {1} n
                LEFT JOIN {2} f ON n.faultId = f.id
                LEFT JOIN {6} e ON n.entityId = e.id
                LEFT JOIN {7} ef ON ef.faultId = n.faultId AND ef.entityId = n.entityId
                WHERE
                    n.time <= '{0}'
                AND n.time >= '{3}'
                AND f.consequence IN {4}
                AND n.projectId = {5} 
                GROUP BY
                    f.name,
                    e.name
                ORDER BY
                    grade DESC,
                    n.energy DESC,
                    n.time DESC
            '''.format(
                    endTime,
                    noticeTable,
                    faultTable,
                    startTime,
                    str(arrConsquence).replace('[', '(').replace(']', ')'),
                    projectId,
                    TableHelper.get_entity_tablename(projectId, lan),
                    TableHelper.get_entity_fault_tablename(projectId, lan)
                )
            dbrv = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
                op_db_query(DB_NAME, sql)
            fault_dict = {}
            for item in dbrv:
                faultId_list = list(set(item[6].split(',')))
                if item[0] in rt.keys():
                    rt.get(item[0]).append({'Fault': item[1], 'Equipment': item[5], 'Desc': item[2], 'FaultId': faultId_list, 'Energy': item[7] / (60 * 60)})
                else:
                    rt.update({item[0]: [{'Fault': item[1], 'Equipment': item[5], 'Desc': item[2], 'FaultId': faultId_list, 'Energy': item[7] / (60 * 60)}]})
                for i in faultId_list:
                    fault_dict.update({i: []})
            if needDetail and dbrv:
                sql = '''
                    SELECT
                        f.id,
                        n.id,
                        n.time,
                        ef.points,
                        CASE WHEN ef.grade IS NULL THEN f.grade ELSE ef.grade END AS grade,
                        n.endTime,
                        n.energy,
                        TIMESTAMPDIFF(
                            SECOND,
                            n.time,
                            CASE
                        WHEN n.endTime IS NULL THEN
                            DATE("{0}")
                        ELSE
                            n.endTime
                        END
                        )
                    FROM
                        {1} AS n
                    LEFT JOIN {2} AS f ON n.faultId = f.id
                    LEFT JOIN {6} ef ON ef.faultId = n.faultId AND ef.entityId = n.entityId
                    WHERE
                        n.time <= "{0}"
                    AND n.time >= "{3}"
                    AND f.id IN {4}
                    AND n.projectId = {5} 
                    ORDER BY
                        grade DESC,
                        n.energy DESC,
                        n.time DESC
                '''.format(
                        endTime,
                        noticeTable,
                        faultTable,
                        startTime,
                        str(list(fault_dict.keys())).replace('[', '(').replace(']', ')'),
                        projectId,
                        TableHelper.get_entity_fault_tablename(projectId, lan)
                    )
                dbrv = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
                    op_db_query(DB_NAME, sql)
                for item in dbrv:
                    fault_dict.get(str(item[0])).append({'NoticeId': item[1], 'Time': item[2].strftime('%Y-%m-%d %H:%M') if item[2] else None,
                                                            'Points': item[3], 'Grade': item[4],
                                                            'EndTime': item[5].strftime('%Y-%m-%d %H:%M') if item[5] else None,
                                                            'Energy': (float(item[6]) * item[7]) / (60 * 60)})
                for key in rt.keys():
                    value = rt.get(key)
                    for v in value:
                        f_list = v.get('FaultId')
                        v.update({'Detail': []})
                        for f in f_list:
                            v.get('Detail').extend(fault_dict.get(f))
        except Exception as e:
            print('getDiagnosisNoticeRank error:' + e.__str__())
            logging.error(e.__str__())
        return rt
    
    @classmethod
    def get_faultDetails(cls, value, type, startTime, endTime, projId, lan):
        data = []
        noticeTable = TableHelper.get_notice_tablename(projId)
        faultTable = TableHelper.get_fault_tablename(lan)

        type_index = {'fault':0, 'workhours':0, 'equipment':3, 'zone':-1}
        type_key = {'fault':('FaultId', 'FaultName', 'Description', 'EquipmentId', 'EquipmentName', 'ZoneId', 'SubBuildingName'),
                    'workhours':('FaultId', 'FaultName', 'Description','EquipmentId', 'EquipmentName', 'ZoneId', 'SubBuildingName'),
                    'equipment':('EquipmentId', 'EquipmentName', 'ZoneId', 'SubBuildingName'),
                    'zone':('ZoneId', 'SubBuildingName')}

        try:
            zoneSql = '''
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
                GROUP BY
                    e1.id
            '''.format(TableHelper.get_entity_tablename(projId, lan), projId)
            zone_result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
                op_db_query(DB_NAME, zoneSql)
            zone_map = {}
            for item in zone_result:
                zone_map[item[0]] = {
                    'id': item[0],
                    'children': item[1],
                    'count': item[2],
                    'type': item[3],
                    'parent': item[4],
                    'name': item[5]
                }
            def getChildren(childrenStr):
                if childrenStr=='' or childrenStr == None:
                    return []
                arr = []
                rs = childrenStr.split(',')
                for childId in rs:
                    if int(childId) in zone_map:
                        if zone_map[int(childId)]['children'] != None:
                            arr.append(zone_map[int(childId)]['children'])
                        
                childrenArr = ','.join(arr).split(',')
                childrenArr = list(set(childrenArr))
                rs.extend(getChildren(','.join(childrenArr)))
                rs = list(set(rs))
                return rs
            def getZoneList(id):
                rs = []
                if int(id) in zone_map:
                    rs.append(id)
                    item = zone_map[id]
                    if item.get('parent') == 0:
                        rs.append(0)
                        return rs
                    else:
                        rs.extend(getZoneList(item.get('parent')))
                # rs = list(set(rs))
                newRs = []
                for id in rs:
                    if id not in newRs:
                        newRs.append(id)
                return newRs
            equipmentIds = []
            if type == 'equipment' or type == 'zone':
                for zone_map_id in zone_map:
                    item = zone_map[zone_map_id]
                    if value is None:
                        equipmentIds = getChildren(item.get('children'))
                    elif item.get('name') == value:
                        equipmentIds.append(str(item.get('id')))
                        equipmentIds.extend(getChildren(item.get('children')))
            equipmentIds = ','.join(list(set(equipmentIds)))
            type_value = {'fault':'f.name = "{0}"'.format(value), 'workhours':'f.name = "{0}"'.format(value), 'equipment':'e.id in ({0})'.format(equipmentIds), 'zone':'e.id in ({0})'.format(equipmentIds)}
            
            strSQL = None
            if type_value.get(type):
                if type == 'workhours':
                    work_times = cls.get_work_hours(startTime, endTime)
                    strTime_list = []
                    for item in work_times:
                        strTime_list.append('(n.time >= "%s" AND n.time <= "%s")' % (item[0].strftime('%Y-%m-%d %H:%M:%S'),
                                                                                    item[1].strftime('%Y-%m-%d %H:%M:%S')))
                    if strTime_list:
                        strSQL = '''
                            SELECT
                                f.id,
                                f.name,
                                f.description,
                                e.id,
                                e.Name AS EquipmentName,
                                n.id AS Id2,
                                n.time,
                                n.endTime,
                                ef.points,
                                n.energy * ef.runYear * u.Factor
                            FROM
                                {0} n
                            LEFT JOIN {1} f ON n.faultId = f.id
                            LEFT JOIN {3} e ON n.entityId = e.id
                            LEFT JOIN {4} ef ON ef.faultId = n.faultId AND ef.entityId = n.entityId
                            LEFT JOIN unitconversion AS u ON ef.unit = u.NewUnit
                            WHERE
                                {2}
                            AND (
                        '''.format(
                            noticeTable,
                            faultTable,
                            type_value.get(type),
                            TableHelper.get_entity_tablename(projId, lan),
                            TableHelper.get_entity_fault_tablename(projId, lan)
                        )
                        for strTime in strTime_list:
                            strSQL = strSQL + strTime + ' OR '
                        strSQL = strSQL[:-3] + ') ORDER BY f.id'
                else:
                    strSQL = '''
                        SELECT
                            f.id,
                            f.name,
                            f.description,
                            e.id,
                            e.name AS EquipmentName,
                            n.id AS Id2,
                            n.time,
                            n.endTime,
                            ef.points,
                            n.energy * ef.runYear * u.Factor
                        FROM
                            {0} n
                        LEFT JOIN {1} f ON n.faultId = f.id
                        LEFT JOIN {6} e ON n.entityId = e.id
                        LEFT JOIN {7} ef ON ef.faultId = n.faultId AND ef.entityId = n.entityId
                        LEFT JOIN unitconversion AS u ON ef.unit = u.NewUnit
                        WHERE
                            {2}
                        AND n.time <= "{3}"
                        AND n.time >= "{4}"
                        AND n.projectId = {5}
                        ORDER BY
                            f.id
                    '''.format(
                            noticeTable,
                            faultTable,
                            type_value.get(type),
                            endTime,
                            startTime,
                            projId,
                            TableHelper.get_entity_tablename(projId, lan),
                            TableHelper.get_entity_fault_tablename(projId, lan)
                        )
            else:
                raise Exception('Invalid parameter')

            dbrv = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
                op_db_query(DB_NAME, strSQL)
            if dbrv:
                fault_dict = {}
                n = type_index.get(type)
                keys = type_key.get(type)
                energy_dict = {}
                for item in dbrv:
                    try:
                        energy = float(item[9]) if item[9] else 0
                        fault_dict_k = None
                        zoneId = None
                        zoneList = getZoneList(item[3])
                        if len(zoneList)>2:
                            zoneId = zoneList[len(zoneList)-3]
                        elif len(zoneList)>1:
                            zoneId = zoneList[len(zoneList)-2]
                        if n == -1:
                            fault_dict_k = zoneId
                        else:
                            fault_dict_k = item[n]
                        if fault_dict_k in fault_dict.keys():
                            fault_dict.get(fault_dict_k).get('arrNoticeTime').append({'NoticeId': item[5], 'FaultId': item[0],
                                                                                'FaultName': item[1], 'EquipmentId': item[3],
                                                                                'EquipmentName': item[4], 'Points': item[8],
                                                                                'Description': item[2],
                                                                                'EndTime': item[7].strftime('%Y-%m-%d %H:%M:%S') \
                                                                                if isinstance(item[7], datetime) else item[7],
                                                                                'Time': item[6].strftime('%Y-%m-%d %H:%M:%S')})
                            # 不要管字段名，字段名 什么的 都是浮云
                            # 计算节能量
                            if energy > 0:
                                energy_dict.get(fault_dict_k).append(energy)
                            if energy_dict.get(fault_dict_k):
                                sumEnergy = sum(energy_dict.get(fault_dict_k)) / len(energy_dict.get(fault_dict_k))
                            else:
                                sumEnergy = 0
                            fault_dict.get(fault_dict_k).update({'sumEnergy': sumEnergy})
                        else:
                            fault_dict.update({fault_dict_k:{'arrNoticeTime':[{'NoticeId': item[5], 'FaultId': item[0],
                                                                        'FaultName': item[1], 'EquipmentId': item[3],
                                                                        'EquipmentName': item[4], 'Points': item[8],
                                                                        'Description': item[2],
                                                                        'EndTime': item[7].strftime('%Y-%m-%d %H:%M:%S') \
                                                                        if isinstance(item[7], datetime) else item[7],
                                                                        'Time': item[6].strftime('%Y-%m-%d %H:%M:%S')}], 'sumEnergy': energy}})
                            if energy == 0:
                                energy_dict.update({fault_dict_k: []})
                            else:
                                energy_dict.update({fault_dict_k: [energy]})
                            if n == -1:
                                fault_dict.get(fault_dict_k).update({'ZoneId':zoneId})
                                fault_dict.get(fault_dict_k).update({'SubBuildingName':zone_map[zoneId].get('name')})
                            else:
                                k = n
                                for i in keys:
                                    v = None
                                    if i == 'ZoneId':
                                        v = zoneId
                                    elif i == 'SubBuildingName':
                                        if zoneId and zone_map[zoneId]:
                                            v = zone_map[zoneId].get('name')
                                    else:
                                        v = item[k]
                                        k = k + 1
                                    fault_dict.get(fault_dict_k).update({i:v})
                                    
                    except Exception as e:
                        print('get_faultDetails error:' + e.__str__())
                flist = list(fault_dict.keys())
                flist.sort()
                for i in flist:
                    data.append(fault_dict.get(i))
        except Exception as e:
            print('get_faultDetails error:' + e.__str__())
            logging.error(e.__str__())
            data = []
        return data
    
    @classmethod
    def get_work_hours(cls, startTime, endTime):
        rt = []
        try:
            startTime = datetime.strptime(startTime, '%Y-%m-%d %H:%M:%S')
            endTime = datetime.strptime(endTime, '%Y-%m-%d %H:%M:%S')
            bdate = startTime.date()
            strbdate = bdate.strftime('%Y-%m-%d')
            btime = datetime.strptime(strbdate + ' 08:00:00', '%Y-%m-%d %H:%M:%S')
            etime = datetime.strptime(strbdate + ' 18:00:00', '%Y-%m-%d %H:%M:%S')
            if btime<= startTime:
                btime = startTime
            while etime <= endTime:
                rt.append((btime, etime))
                bdate = bdate + timedelta(days = 1)
                strbdate = bdate.strftime('%Y-%m-%d')
                btime = datetime.strptime(strbdate + ' 08:00:00', '%Y-%m-%d %H:%M:%S')
                etime = datetime.strptime(strbdate + ' 18:00:00', '%Y-%m-%d %H:%M:%S')
            if btime <= endTime:
                rt.append((btime, endTime))
        except Exception as e:
            print('get_work_hours error:' + e.__str__())
            logging.error(e.__str__())
        return rt