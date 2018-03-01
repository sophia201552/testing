"""策略组态 数据处理层"""
import math
import time
import logging
import os
import copy
from bson import ObjectId
from datetime import datetime, timedelta
from collections import OrderedDict
import pandas as pd
from pandas import ExcelWriter
from beopWeb.mod_tag.pointTag import pointTag
from mysql.connector.conversion import MySQLConverter
from beopWeb import app
from beopWeb.BEOPDataAccess import BEOPDataAccess
from beopWeb.MongoConnManager import MongoConnManager
from beopWeb.mod_memcache.RedisManager import RedisManager
from beopWeb.mod_admin.User import User
from beopWeb.mod_admin.Project import Project

# define table names
DB_NAME = 'diagnosis'


class TableHelper:
    """ 诊断表帮助类 """

    @staticmethod
    def get_entity_tablename(project_id=None, lang='en'):
        if not project_id:
            return 'diagnosis_entity'

        project_id = int(project_id)
        if project_id == 647:
            return 'diagnosis_entity_647_en' if lang == 'en' else 'diagnosis_entity'
        else:
            return 'diagnosis_entity'

    @staticmethod
    def get_entity_fault_tablename(project_id=None, lang='en'):
        if not project_id:
            return 'diagnosis_entity_fault'

        project_id = int(project_id)
        if project_id == 647:
            return 'diagnosis_entity_fault_647_en' if lang == 'en' else 'diagnosis_entity_fault'
        else:
            return 'diagnosis_entity_fault'

    @staticmethod
    def get_fault_tablename(lang='en'):
        if lang != 'en':
            return 'diagnosis_fault_zh'
        return 'diagnosis_fault'

    @staticmethod
    def get_notice_tablename(project_id=None, lang='en'):
        """ 根据项目id，获取对应的 notice 表名称 """
        return 'diagnosis_%s_notice' % project_id

    @staticmethod
    def get_notice_tablename_old(project_id=None):
        """ 根据项目id，获取对应的 notice 表名称 """
        container = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly
        find_table_prefix = """
            SELECT mysqlname from project where id = %s
        """
        table_prefix = container.op_db_query_one(
            'beopdoengine', find_table_prefix, (project_id, ))[0]
        notice_table_name = table_prefix + '_diagnosis_notices'
        return notice_table_name


def contains_chinese(str):
    return all('\u4e00' <= char <= '\u9fff' for char in str)


def checkInvalidNoticeEndTime(projectId):
    try:
        if projectId is None:
            logging.error('projectId is None!')
            return

        sql = '''SELECT entityId, faultId, endTime, COUNT(*) ''' \
              '''FROM diagnosis_%s_notice ''' \
              '''WHERE endTime IS NOT NULL AND endTime > '2017-12-01' ''' \
              '''GROUP BY entityId, faultId, endTime ''' \
              '''HAVING COUNT(*) > 1''' % projectId
        logging.info('Checking invalid notice end time with SQL: %s', sql)
        result_set = BEOPDataAccess.getInstance(
        )._mysqlDBContainerReadOnly.op_db_query(DB_NAME, sql)
        if len(result_set) > 0:
            logging.error('Invalid notice end times found! %s', result_set)
    except Exception:
        logging.error(
            'Unhandled exception! Locals: %s',
            locals(),
            exc_info=True,
            stack_info=True)


class DiagnosisService:
    """ 新版诊断 数据处理类 """

    @classmethod
    def _calc_entity_total(cls, id_map, wrong_entities, entity_id):
        """ 计算 entity 的出错数量 """
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
    def _format_points_str(cls, points_str):
        """ 对 entity_fault 表的 points 字符串格式进行格式化处理 """
        if points_str is None or points_str == '':
            return []
        arr = points_str.split('|')
        data = []
        for value in arr:
            item = value.split(',')
            data.append({'name': item[0], 'description': item[1]})
        return data

    @classmethod
    def get_entities(cls, project_id, lang):
        """ 获取某个项目的所有 entities """
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
        '''.format(TableHelper.get_entity_tablename(project_id, lang))
        result = BEOPDataAccess.getInstance(
        )._mysqlDBContainerReadOnly.op_db_query(DB_NAME, sql, (project_id, ))
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
    def get_entities_wrong_quantity(cls, project_id, start_time, end_time,
                                    lang):
        """ 获取某个项目的所有 entities 的健康率 """
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
            GROUP BY n.entityId, n.faultId
        '''.format(TableHelper.get_notice_tablename(project_id))
        result = BEOPDataAccess.getInstance(
        )._mysqlDBContainerReadOnly.op_db_query(
            DB_NAME, sql, (start_time, end_time, project_id))
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
        '''.format(TableHelper.get_entity_tablename(project_id, lang))
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
            total = value['wrong']
            if entity_id in wrong_entities:
                total += wrong_entities.get(entity_id, 0)
            result.append({'id': entity_id, 'wrongQuantity': total})
        # 给设备加上错误信息
        for entity_id, value in wrong_entities.items():
            if entity_id not in id_map:
                result.append({'id': entity_id, 'wrongQuantity': value})
        return result

    @classmethod
    def get_lastest_entity_faults(cls,
                                  project_id,
                                  start_time,
                                  end_time,
                                  entityId,
                                  number=20,
                                  lan='en'):
        """ 获取最新的错误列表，具体数目由 number 决定 """
        entityIdSql = ''
        if (entityId):
            entityIdSql = 'AND n.entityId IN (' + entityId + ')'
        sql = '''
            SELECT DISTINCT
                f.id,
                f.name
            FROM
                {1} f
            LEFT JOIN {0} n ON n.faultId = f.id
            WHERE
            n.time >= %s
            AND n.time <= %s
             {2}
            ORDER BY n.grade DESC, n.time DESC
            LIMIT %s
        '''.format(
            TableHelper.get_notice_tablename(project_id),
            TableHelper.get_fault_tablename(lan), entityIdSql)
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql, (start_time, end_time, number))
        data = []
        for item in result:
            data.append({'faultId': item[0], 'name': item[1]})
        return data

    @classmethod
    def get_equipment_availability(cls, pzroject_id):
        """ 获取设备完好率数据 """
        pass

    @classmethod
    def get_entity_faults_group(cls, project_id, page_num, page_size, \
                          start_time, end_time, entity_ids, fault_ids, class_names, keywords, lan, group,
                          recursive=False):
        """ ＃3322获取设备的报警信息 按faultId聚类 """
        converter = MySQLConverter()
        # escape string
        default_weight = 0.5
        notice_weight_map = {}
        entity_ids = [converter.escape(i) for i in entity_ids]
        fault_ids = [converter.escape(i) for i in fault_ids]
        readOnlyContainer = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly
        # 3134 cursive 为 true 时，需要接口将请求参数中entityIds 中每个 entityId 以及其的所有子孙的设备发生的故障搜索出来
        if recursive and entity_ids:
            def getChildEntityIds(parentIds, entity_ids):
                getChildEntitySql = '''
                        SELECT
                            id
                        FROM
                           {0}
                        WHERE
                           parent in {1}
                    '''.format(
                    TableHelper.get_entity_tablename(project_id, lan),
                    str(parentIds).replace('[', '(').replace(']', ')')
                )
                childEntityIds = readOnlyContainer.op_db_query(DB_NAME, getChildEntitySql)
                if childEntityIds:
                    childEntityIdsList = [idTuple[0] for idTuple in childEntityIds]
                    entity_ids += childEntityIdsList
                    getChildEntityIds(childEntityIdsList, entity_ids)
            getChildEntityIds(copy.deepcopy(entity_ids), entity_ids)
        # 3134 end
        # 计算权重所需的查询
        select_noticeId_faultWeight_sql = """
                   SELECT
                       n.id,
                       e.tagId,
                       CASE WHEN f.faulttype=2.0 THEN 0.2 ELSE f.faulttype END
               """
        # 计算total所需查询
        count_sql = '''SELECT COUNT(*)'''
        # 详情所需查询
        item_sql = '''
                SELECT
                    n.id,
                    n.entityId,
                    n.faultId,
                    n.time as time,
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
                    ef.points,
                    ef.faultTag,
                    f.maintainable,
                    t.status AS taskStatus,
                    n.endTime,
                    e.location
            '''
        sql = '''
                 FROM
                    {0} n
                LEFT JOIN {2} ef ON ef.entityId = n.entityId
                AND ef.faultId = n.faultId
                LEFT JOIN {1} e ON e.id = n.entityId
                LEFT JOIN {3} f ON f.id = n.faultId
                LEFT JOIN diagnosis_task t
                ON t.entityId = n.entityId
                AND t.noticeId = n.id
                AND t.time = (
                    select
                        max(time)
                    from
                        diagnosis_task
                    WHERE
                        entityId = n.entityId
                    AND
                        noticeId = n.id
                    )
                WHERE
                    n.projectId = {4}
            '''.format(
            TableHelper.get_notice_tablename(project_id),
            TableHelper.get_entity_tablename(project_id, lan),
            TableHelper.get_entity_fault_tablename(project_id, lan),
            TableHelper.get_fault_tablename(lan), project_id)
        if start_time:
            sql += ''' AND n.time >= "{0}"'''.format(start_time)
        if end_time:
            sql += ''' AND n.time <= "{0}"'''.format(end_time)
        if len(entity_ids) > 0:
            sql += ' AND n.entityId IN (%s)' % ','.join(
                [str(i) for i in entity_ids])
        if len(fault_ids) > 0:
            sql += ' AND n.faultId IN (%s)' % ','.join(
                [str(i) for i in fault_ids])
        if len(class_names) > 0:
            sensor_name = 'Sensor' if lan == 'en' else '传感器'
            include_sensor = False
            if sensor_name in class_names:
                class_names.remove(sensor_name)
                include_sensor = True
            if include_sensor is False:
                sql += ' AND e.className IN (\'%s\')' % '\',\''.join(
                    class_names)
            elif len(class_names) == 0:
                sql += ' AND f.faultType = 2'
            else:
                sql += ' AND (f.faultType = 2 OR e.className IN (\'%s\'))' % '\',\''.join(
                    class_names)
        noticeIdFaultWeightResult = BEOPDataAccess.getInstance(
        )._mysqlDBContainerReadOnly.op_db_query(
            DB_NAME, select_noticeId_faultWeight_sql + sql)
        noticeId_faultWeight_map = {}
        noticeId_tagId_map = {}
        for item in noticeIdFaultWeightResult:
            noticeId_faultWeight_map[item[0]] = item[2]
            noticeId_tagId_map[item[0]] = item[1]
        tagIds = [value for index, value in noticeId_tagId_map.items()]
        tagIds = list(set(tagIds))
        tagId_equip_weight_map = pointTag.get_equip(
            [ObjectId(item) for item in tagIds], project_id, default_weight)
        not_found_tagIds = []
        # 计算权重（设备权重*故障权重）
        for noticeId, faultWeight in noticeId_faultWeight_map.items():
            tagId = noticeId_tagId_map.get(noticeId)
            if ObjectId(tagId) not in tagId_equip_weight_map:
                entityWeight = default_weight
                not_found_tagIds.append(str(tagId))
            else:
                entityWeight = tagId_equip_weight_map[ObjectId(tagId)]
            notice_weight_map[noticeId] = faultWeight * entityWeight
        if not_found_tagIds:
            not_found_tagIds = list(set(not_found_tagIds))
            logging.error('cloudPoint表中找不到tagId:' + str(not_found_tagIds) + '但存在于diagnosis_entity表中')
        noticeObjOrdered = sorted(
            notice_weight_map.items(), key=lambda e: e[1], reverse=True)
        noticeIdOrderIds = [notice[0] for notice in noticeObjOrdered]
        sort_sql = """
                    ORDER BY
                        FIELD(n.id, %s),
                        f.grade DESC,
                        time DESC """ % str(noticeIdOrderIds).replace(
            '[', '').replace(']', '')

        if keywords:
            sql += ' AND (e.NAME like BINARY"%{0}%" OR f.NAME like BINARY"%{0}%" OR n.time like BINARY"%{0}%" OR f.consequence like BINARY"%{0}%")'.format(
                keywords)

        notice_result = readOnlyContainer.op_db_query(DB_NAME, item_sql + sql + sort_sql)
        if len(notice_result) == 0:
            return {'data': [], 'total': 0}

        def outputFormat(item):
            return {
                "faultId": item[2],
                "faultName": item[7],
                "entityNum": len(faultId_entity_map[item[2]]),  # 故障设备数量
                "time": len(faultId_notice_map[item[2]]),  # 故障发生总次数
                "grade": item[10],
                "consequence": item[9],  # 有枚举
                "faultTag": item[12],
            }

        data = []
        faultId_entity_map = {}
        faultId_notice_map = {}

        for item in notice_result:
            if item[2] not in faultId_entity_map:
                faultId_entity_map[item[2]] = []
            if item[1] not in faultId_entity_map[item[2]]:
                faultId_entity_map[item[2]].append(item[1])
            if item[2] not in faultId_notice_map:
                faultId_notice_map[item[2]] = []
            if item[0] not in faultId_notice_map[item[2]]:
                faultId_notice_map[item[2]].append(item[0])
        keys = []
        for item in notice_result:
            key_list = []
            if 'faultId' in group:
                key_list.append(item[2])
            if 'entityId' in group:
                key_list.append(item[1])
            key = '_'.join([str(item) for item in key_list])
            if key not in keys:
                data.append(outputFormat(item))
                keys.append(key)

        return {'data': data[((page_num - 1) * page_size): (page_num * page_size)], 'total': len(keys)}

    @classmethod
    def get_entity_faults(cls, project_id, page_num, page_size, \
                          start_time, end_time, entity_ids, fault_ids, class_names, keywords, sort, lan, group=None, recursive=False):
        """ 获取设备的报警信息 """
        converter = MySQLConverter()
        # escape string
        group_result = []
        entity_ids = [converter.escape(i) for i in entity_ids]
        fault_ids = [converter.escape(i) for i in fault_ids]
        readOnlyContainer = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly
        # 3134 cursive 为 true 时，需要接口将请求参数中entityIds 中每个 entityId 以及其的所有子孙的设备发生的故障搜索出来
        if recursive and entity_ids:
            def getChildEntityIds(parentIds, entity_ids):
                getChildEntitySql = '''
                    SELECT
                        id
                    FROM
                       {0}
                    WHERE
                       parent in {1}
                '''.format(
                    TableHelper.get_entity_tablename(project_id, lan),
                    str(parentIds).replace('[','(').replace(']',')')
                )
                childEntityIds = readOnlyContainer.op_db_query(DB_NAME, getChildEntitySql)
                if childEntityIds:
                    childEntityIdsList = [idTuple[0] for idTuple in childEntityIds]
                    entity_ids += childEntityIdsList
                    getChildEntityIds(childEntityIdsList, entity_ids)
            getChildEntityIds(copy.deepcopy(entity_ids),entity_ids)
        count_sql = '''SELECT COUNT(*)'''
        item_sql = '''
            SELECT
                n.id,
                n.entityId,
                n.faultId,
                n.time as time,
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
                ef.points,
                ef.faultTag,
                f.maintainable,
                t.status AS taskStatus,
                n.endTime,
                e.location
        '''
        sql = '''
             FROM
                {0} n
            LEFT JOIN {2} ef ON ef.entityId = n.entityId
            AND ef.faultId = n.faultId
            LEFT JOIN {1} e ON e.id = n.entityId
            LEFT JOIN {3} f ON f.id = n.faultId
            LEFT JOIN diagnosis_task t
            ON t.entityId = n.entityId
            AND t.noticeId = n.id
            AND t.time = (
                select
                    max(time)
                from
                    diagnosis_task
                WHERE
                    entityId = n.entityId
                AND
                    noticeId = n.id
                )
            WHERE
                n.projectId = {4}
        '''.format(
            TableHelper.get_notice_tablename(project_id),
            TableHelper.get_entity_tablename(project_id, lan),
            TableHelper.get_entity_fault_tablename(project_id, lan),
            TableHelper.get_fault_tablename(lan), project_id)
        if start_time:
            sql += ''' AND n.time >= "{0}"'''.format(start_time)
        if end_time:
            sql += ''' AND n.time <= "{0}"'''.format(end_time)
        if len(entity_ids) > 0:
            sql += ' AND n.entityId IN (%s)' % ','.join(
                [str(i) for i in entity_ids])
        if len(fault_ids) > 0:
            sql += ' AND n.faultId IN (%s)' % ','.join(
                [str(i) for i in fault_ids])
        if len(class_names) > 0:
            sensor_name = 'Sensor' if lan == 'en' else '传感器'
            include_sensor = False
            if sensor_name in class_names:
                class_names.remove(sensor_name)
                include_sensor = True
            if include_sensor is False:
                sql += ' AND e.className IN (\'%s\')' % '\',\''.join(
                    class_names)
            elif len(class_names) == 0:
                sql += ' AND f.faultType = 2'
            else:
                sql += ' AND (f.faultType = 2 OR e.className IN (\'%s\'))' % '\',\''.join(
                    class_names)
        sort_sql = ''

        for item in sort:
            if sort.index(item) == 0:
                sort_sql = ' ORDER BY {0} {1}'.format(
                    item['key'], item['order'])
            else:
                sort_sql += ' ,{0} {1}'.format(item['key'], item['order'])

        if keywords:
            sql += ' AND (e.NAME like BINARY"%{0}%" OR f.NAME like BINARY"%{0}%" OR n.time like BINARY"%{0}%" OR f.consequence like BINARY"%{0}%")'.format(
                keywords)
        if page_size:
            limt_sql = ' LIMIT {0},{1}'.format((page_num - 1) * page_size,
                                               page_size)
        else:
            limt_sql = ''
        if group:
            group_by_list = []
            if 'faultId' in group:
                group_by_list.append('n.faultId')
            if 'entityId' in group:
                group_by_list.append('n.entityId')
            if group_by_list:
                group_str = ','.join(group_by_list)
                group_count_sql = ' GROUP  BY ' + group_str
                result_count = len(
                    readOnlyContainer.op_db_query(
                        DB_NAME, count_sql + sql + group_count_sql))
                group_sql = 'SELECT group_concat(n.id), ' + group_str + ' ,max(n.time) AS time, count(*) as `count` '
                group_result = readOnlyContainer.op_db_query(
                    DB_NAME,
                    group_sql + sql + group_count_sql + sort_sql + limt_sql)
                noticeIdList = []
                for i in group_result:
                    if i[0]:
                        noticeIdList.extend(i[0].split(','))
                if noticeIdList:
                    sql += 'AND n.id in %s' % (str(noticeIdList).replace(
                        '[', '(').replace(']', ')'), )
        else:
            result_count = readOnlyContainer.op_db_query(
                DB_NAME, count_sql + sql)[0][0]
        if group:
            # 分组里面按逆序排列
            sort_list_sql = ' ORDER BY time DESC'
            notice_result = readOnlyContainer.op_db_query(
                DB_NAME, item_sql + sql + sort_list_sql)
        else:
            notice_result = readOnlyContainer.op_db_query(
                DB_NAME, item_sql + sql + sort_sql + limt_sql)
        if len(notice_result) == 0:
            return {'data': [], 'total': 0}
        entity_parent_ids = []
        for item in notice_result:
            if item[6] not in entity_parent_ids:
                entity_parent_ids.append(item[6])
        sql = '''
            SELECT
                id,
                name
            FROM
                {1}
            WHERE
                projectId = %s
            AND id IN ({0})
        '''.format(','.join([str(i) for i in entity_parent_ids]),
                   TableHelper.get_entity_tablename(project_id, lan))
        entity_query_result = readOnlyContainer.op_db_query(
            DB_NAME, sql, (project_id, ))
        entity_id_name_map = {}
        for item in entity_query_result:
            entity_id_name_map[item[0]] = item[1]
        def outputFormat(item):
            if item[15]:
                endTime = item[15].strftime('%Y-%m-%d %H:%M')
            else:
                endTime = ''
            return {
                "id": item[0],
                "entityId": item[1],
                "faultId": item[2],
                "time": item[3].strftime('%Y-%m-%d %H:%M'),
                "status": item[4],
                "entityName": item[5],
                "entityParentName": item[16] if item[16] else '-', #readmine 2927 内容为location，因前端需要改的地方太多
                "location": item[16] if item[16] else '-',
                "name": item[7],
                "description": item[8],
                "consequence": item[9],
                "grade": item[10],
                "points": cls._format_points_str(item[11]),
                "faultTag": item[12],
                "maintainable": item[13],
                "taskStatus": item[14],
                "endTime": endTime
            }

        data = []
        if group:
            faultId_list_map = {}
            for item in notice_result:
                key_list = []
                if 'faultId' in group:
                    key_list.append(item[2])
                if 'entityId' in group:
                    key_list.append(item[1])
                key = '_'.join([str(item) for item in key_list])
                if key in faultId_list_map:
                    faultId_list_map[key].append(outputFormat(item))
                else:
                    faultId_list_map[key] = [outputFormat(item)]
            for group_item in group_result:
                data_item = {"time": group_item[-1]}
                keyList = []
                if 'faultId' in group:
                    keyList.append(group_item[group.index("faultId") + 1])
                    data_item["faultId"] = group_item[group.index("faultId")
                                                      + 1]
                if 'entityId' in group:
                    keyList.append(group_item[group.index("entityId") + 1])
                    data_item['entityId'] = group_item[group.index("entityId")
                                                       + 1]
                data_item['list'] = faultId_list_map.get(
                    '_'.join([str(item) for item in keyList]))
                data.append(data_item)
        else:
            for item in notice_result:
                data.append(outputFormat(item))
        return {'data': data, 'total': result_count}

    @classmethod
    def get_entity_faults_statistics(cls, entityIds, projectId, lan, startTime,
                                     endTime, items):
        """
        :param entityIds:
        :param projectId:
        :param lan:
        :param startTime:
        :param endTime:
        :param items:
        :return: {
            status:[{content:0,num:0}], //content：属性值,num:数量
            consequence:[{content:0,num:0}]
        }
        """
        rv = {}

        def output(item, sqlStr):
            rv[item] = []
            itemResult = BEOPDataAccess.getInstance(
            )._mysqlDBContainerReadOnly.op_db_query(DB_NAME, sqlStr)
            for i in itemResult:
                if i[0]:
                    rv[item].append({"content": i[1], "num": i[0]})

        zone = BEOPDataAccess.getInstance(
        )._mysqlDBContainerReadOnly.op_db_query(
            'beopdoengine',
            'SELECT data_time_zone FROM project where id= %s' % (projectId, ))
        timeNow = datetime.utcnow() + timedelta(hours=zone[0][0])
        selectSql = '''
            SELECT count(distinct(n.faultId)),
        '''
        sql = '''
            FROM
                {0} n
            LEFT JOIN {2} ef ON ef.entityId = n.entityId
            AND ef.faultId = n.faultId
            LEFT JOIN {1} e ON e.id = n.entityId
            LEFT JOIN {3} f ON f.id = n.faultId
            LEFT JOIN unitconversion u ON ef.unit = u.NewUnit
            LEFT JOIN diagnosis_task t ON t.entityId = n.entityId AND t.noticeId = n.id
            WHERE
                n.projectId = {4}
            '''.format(
            TableHelper.get_notice_tablename(projectId),
            TableHelper.get_entity_tablename(projectId, lan),
            TableHelper.get_entity_fault_tablename(projectId, lan),
            TableHelper.get_fault_tablename(lan), projectId)
        if entityIds:
            sql += ' AND n.entityId in %s' % (
                str(entityIds).replace('[', '(').replace(']', ')'), )
        if startTime:
            sql += ' AND n.time >= "%s"' % (startTime, )
        if endTime:
            sql += ' AND n.time <= "%s"' % (endTime, )
        if 'faultTag' in items:
            sqlStr = selectSql + ' ef.faultTag ' + sql + ' GROUP By ef.faultTag'
            output('faultTag', sqlStr)
        if 'status' in items:
            sqlStr = selectSql + ' n.status ' + sql + ' GROUP By n.status'
            output('status', sqlStr)
        if 'grade' in items:
            sqlStr = selectSql + ' n.grade ' + sql + ' GROUP By n.grade'
            output('grade', sqlStr)
        if 'consequence' in items:
            sqlStr = selectSql + ' f.consequence ' + sql + ' GROUP By f.consequence'
            output('consequence', sqlStr)
        if 'maintainable' in items:
            sqlStr = selectSql + ' f.maintainable ' + sql + ' GROUP By f.maintainable'
            output('maintainable', sqlStr)
        if 'taskStatus' in items:
            sqlStr = selectSql + ' t.status ' + sql + ' GROUP BY t.status'
            output('taskStatus', sqlStr)
        if 'energy' in items:
            rv['energy'] = []
            sqlStr = 'SELECT n.energy, CASE WHEN u.Factor is NULL THEN 1 ELSE u.Factor END, n.time, n.endTime ' + sql
            energyList = {}
            energyQueryResult = BEOPDataAccess.getInstance(
            )._mysqlDBContainerReadOnly.op_db_query(DB_NAME, sqlStr)
            for i in energyQueryResult:
                if i[1] and i[2]:
                    if i[3]:
                        seconds = (i[3] - i[2]).seconds
                    else:
                        seconds = (timeNow - i[2]).seconds
                    energy = round(i[1] * i[0] * seconds / (60 * 60), 2)
                    if energy in energyList:
                        energyList[energy] += 1
                    else:
                        energyList[energy] = 1
            for e, v in energyList.items():
                rv['energy'].append({"content": e, "num": v})
        return rv

    @classmethod
    def get_faults(cls, project_id, start_time, end_time, entity_ids,
                   consequence, class_names, lan):
        """ 获取 fault 列表 """
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
                {0} n
            RIGHT JOIN {2} ef ON n.faultId = ef.faultId
            AND n.entityId = ef.entityId
            RIGHT JOIN {3} f ON f.id = n.faultId
            RIGHT JOIN {1} e ON e.id = n.entityId
            WHERE
                n.time >= %s
            AND n.time <= %s
        '''.format(
            TableHelper.get_notice_tablename(project_id),
            TableHelper.get_entity_tablename(project_id, lan),
            TableHelper.get_entity_fault_tablename(project_id, lan),
            TableHelper.get_fault_tablename(lan))
        if len(entity_ids) > 0:
            sql += ' AND n.entityId IN (%s)' % converter.escape(
                ','.join([str(i) for i in entity_ids]))
        if len(consequence) > 0:
            sql += ' AND f.consequence IN (\'%s\')' % '\',\''.join(
                [converter.escape(str(i)) for i in consequence])
        if len(class_names) > 0:
            sql += ' AND e.className IN (\'%s\')' % '\',\''.join(
                [converter.escape(class_names) for i in consequence])
        sql += ' GROUP BY n.faultId'
        result = BEOPDataAccess.getInstance(
        )._mysqlDBContainerReadOnly.op_db_query(DB_NAME, sql,
                                                (start_time, end_time))
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
    def get_all_faults(cls, project_id, page_num, page_size, sort, lan):
        """ 获取 fault 列表 """
        count_sql = '''
            SELECT
                COUNT(*)
            FROM
                (
                    SELECT
                        COUNT(*)
                    FROM
                        {0} n
                    GROUP BY
                        n.faultId
                ) t
        '''.format(TableHelper.get_notice_tablename(project_id))
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
            LEFT JOIN {2} ef ON n.faultId = ef.faultId
            AND n.entityId = ef.entityId
            LEFT JOIN {3} f ON f.id = n.faultId
            LEFT JOIN {1} e ON e.id = n.entityId
            GROUP BY n.faultId
        '''.format(
            TableHelper.get_notice_tablename(project_id),
            TableHelper.get_entity_tablename(project_id, lan),
            TableHelper.get_entity_fault_tablename(project_id, lan),
            TableHelper.get_fault_tablename(lan))
        for item in sort:
            if sort.index(item) == 0:
                sql += ' ORDER BY {0} {1}'.format(item['key'], item['order'])
            else:
                sql += ' ,{0} {1}'.format(item['key'], item['order'])
        limt_sql = ' LIMIT {0},{1}'.format((page_num - 1) * page_size,
                                           page_size)
        count = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, count_sql)
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
        return {"data": data, "total": count[0]}

    @classmethod
    def get_entity_fault_his_data(cls, fault_id):
        """ 获取单条 fault 的详细数据 """
        pass

    @classmethod
    def get_fault_consequence(cls, project_id):
        """ 获取报警影响的分类信息 """
        pass

    @classmethod
    def get_grade_equipment_rate_of_health(cls, project_id, start_time,
                                           end_time, entity_ids, class_names,
                                           fault_ids, lang):
        """
        获取设备健康率(分等级)
        :param project_id:
        :param start_time:
        :param end_time:
        :param entity_ids:
        :param class_names:
        :param fault_ids:
        :param lang:
        :return:
        """
        rt = []
        notice_table_name = TableHelper.get_notice_tablename(project_id)
        sensor = 'Sensor' if lang == 'en' else '传感器'
        class_equipment_dict = {}
        system_dict, equipment_system = cls.get_equipment_all(project_id, lang)
        time_n_sql = []
        time_t_sql = []
        if start_time:
            time_n_sql.append('n.time >= \'%s\'' % start_time)
            time_t_sql.append('t.time >= \'%s\'' % start_time)
        if end_time:
            time_n_sql.append('n.time <= \'%s\'' % end_time)
            time_t_sql.append('t.time <= \'%s\'' % end_time)
        time_t_sql_str = ''
        where_sql = ''
        where_end_sql = ''
        if len(time_n_sql) > 0:
            where_sql += ' WHERE ' + ' AND '.join(time_n_sql)
        if len(time_t_sql) > 0:
            time_t_sql_str += ' AND ' + ' AND '.join(time_t_sql)
        if len(entity_ids) > 0:
            where_sql += ' AND n.entityId IN (%s)' % ','.join(
                [str(i) for i in entity_ids])
        if len(fault_ids) > 0:
            where_sql += ' AND n.faultId IN (%s)' % ','.join(
                [str(i) for i in fault_ids])
        if len(class_names) > 0:
            where_end_sql += ' WHERE e.className IN (\'%s\')' % '\',\''.join(
                class_names)
        where_sql += ' GROUP BY n.entityId , n.faultId'
        if system_dict and equipment_system:
            strSQL = '''
            SELECT
                dn.id,
                b.entityId,
                e.`name`,
                f.faultType,
                t.id
            FROM
            (
                SELECT
                    n.entityId,
                    n.faultId,
                    max(n.time) AS time
                FROM
                    {0} AS n
                {3}
            ) AS b
            LEFT JOIN {0} AS dn
            ON dn.entityId = b.entityId and dn.faultId = b.faultId and dn.time = b.time
            LEFT JOIN
                {1} AS e
            ON b.entityId = e.id
            LEFT JOIN
                {2} AS f
            ON b.faultId = f.id
            LEFT JOIN diagnosis_task AS t
            ON t.noticeId = dn.id
            and t.entityId = e.id
            and t.faultId = f.id
            and t.status = 10
            {4}{5}'''.format(notice_table_name,
                             TableHelper.get_entity_tablename(
                                 project_id, lang),
                             TableHelper.get_fault_tablename(), where_sql,
                             time_t_sql_str, where_end_sql)

            dbrv = BEOPDataAccess.getInstance(
            )._mysqlDBContainerReadOnly.op_db_query(DB_NAME, strSQL)

            number_of_realpoint_count = cls.get_realpoint_count(project_id)
            system_dict.update({
                sensor: {
                    'abnormalNum': 0,
                    'className': sensor,
                    'equipments': [1] * number_of_realpoint_count
                }
            })
            healthConfig = Project().get_project_health_config(project_id)

            if dbrv:
                entity_id_faultType = {}
                for item in dbrv:
                    try:
                        #task表中处理完成的去掉
                        if item[4]:
                            continue
                        faultType = float(item[3])
                        if faultType == 2:
                            system_dict[sensor]['abnormalNum'] += 1
                        elif faultType <= 1 and faultType > 0:
                            if item[1] in entity_id_faultType:
                                entity_id_faultType[item[1]].append(item[3])
                            else:
                                entity_id_faultType[item[1]] = [item[3]]
                    except Exception:
                        print('get_equipment_rate_of_health data error:' +
                              str(item[0]))
                #计算每个entity得分
                for entity_id, faultTypeList in entity_id_faultType.items():
                    # 等级i发生的故障数
                    deductPointsList = []
                    for faultType in faultTypeList:
                        for grade, gradeValue in healthConfig.items():
                            lowLine = gradeValue.get('lowline')
                            highLine = gradeValue.get('highline')
                            if lowLine < faultType <= highLine:
                                # 等级i的权重
                                weight = gradeValue.get('qi')
                                # 等级i的故障数计分上限
                                scoreMax = 1 if int(grade) == 1 else 10
                                # 等级i的扣分D
                                gradeDeductPoints = min(1, 1 / scoreMax)
                                # 扣分 等级i的权重*等级i的扣分
                                deductPoints = weight * gradeDeductPoints
                                deductPointsList.append(deductPoints)
                                break
                    totalDeductPoint = sum(deductPointsList)
                    entity_score = 1 - totalDeductPoint
                    # 计算classname得分
                    classname = equipment_system.get(entity_id)
                    if classname:
                        if classname in class_equipment_dict:
                            class_equipment_dict[classname].append(
                                max(0, entity_score))
                        else:
                            class_equipment_dict[classname] = [
                                max(0, entity_score)
                            ]
            l = list(system_dict.keys())
            l.sort()
            for key in l:
                sys = system_dict.get(key)

                totalNum = len(sys.get('equipments'))
                if key == sensor:
                    goodNum = totalNum - sys.get('abnormalNum')
                    intactRate = cls.computing_intact_rate(goodNum, totalNum)
                else:
                    if class_equipment_dict.get(key):
                        intactRate = (
                            sum(class_equipment_dict.get(key)) + totalNum -
                            len(class_equipment_dict.get(key))) / totalNum
                    else:
                        intactRate = 1
                    goodNum = round(totalNum * float(intactRate), 1)
                    #防止出现健康率不为1，goodNum和totalNum相等的情况
                    if 0.9 < intactRate < 1 and goodNum == totalNum:
                        goodNum -= 0.1
                    rate = intactRate * 100
                    if rate < 99:
                        rate = math.ceil(rate)
                    else:
                        rate = math.floor(rate)
                    intactRate = '%f' % rate + '%'
                rt.append({
                    'className': sys.get('className'),
                    'intactRate': intactRate,
                    'goodNum': goodNum,
                    'totalNum': totalNum
                })
        return rt

    @classmethod
    def get_equipment_rate_of_health(cls, project_id, start_time, end_time,
                                     entity_ids, class_names, fault_ids, lang):
        '''
        david 20170612
        获取设备健康率
        '''
        rt = []
        notice_table_name = TableHelper.get_notice_tablename(project_id)
        sensor = 'Sensor' if lang == 'en' else '传感器'
        system_dict, equipment_system = cls.get_equipment_all(project_id, lang)
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
                         TableHelper.get_entity_tablename(project_id, lang),
                         TableHelper.get_fault_tablename()
                     )
            if len(time_part_sql) > 0:
                strSQL = strSQL + ' WHERE ' + ' AND '.join(time_part_sql)
            if len(entity_ids) > 0:
                strSQL += ' AND n.entityId IN (%s)' % ','.join(
                    [str(i) for i in entity_ids])
            if len(fault_ids) > 0:
                strSQL += ' AND n.faultId IN (%s)' % ','.join(
                    [str(i) for i in fault_ids])
            if len(class_names) > 0:
                strSQL += ' AND e.className IN (\'%s\')' % '\',\''.join(
                    class_names)
            strSQL = (strSQL + ' GROUP BY n.entityId , n.faultId').format(
                notice_table_name, )
            dbrv = BEOPDataAccess.getInstance(
            )._mysqlDBContainerReadOnly.op_db_query(DB_NAME, strSQL)

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
                                system_dict[classname][
                                    'abnormalNum'] += faultType
                                Equipment_faultType = system_dict.get(
                                    classname).get('Equipment_faultType')
                                if item[1] in Equipment_faultType.keys():
                                    if faultType > Equipment_faultType.get(
                                            item[1]):
                                        Equipment_faultType.update({
                                            item[1]:
                                            faultType
                                        })
                                else:
                                    Equipment_faultType.update({
                                        item[1]:
                                        faultType
                                    })
                    except Exception:
                        print('get_equipment_rate_of_health data error:' +
                              str(item[0]))

            l = list(system_dict.keys())
            l.sort()
            for keys in l:
                sys = system_dict.get(keys)
                Equipment_faultType = sys.get('Equipment_faultType')
                totalNum = len(sys.get('equipments'))
                if keys == sensor:
                    goodNum = totalNum - sys.get('abnormalNum')
                else:
                    goodNum = totalNum - sum([
                        Equipment_faultType.get(x)
                        for x in Equipment_faultType.keys()
                    ])
                rt.append({
                    'className':
                    sys.get('className'),
                    'intactRate':
                    cls.computing_intact_rate(goodNum, totalNum),
                    'goodNum':
                    goodNum,
                    'totalNum':
                    totalNum
                })
        return rt

    @classmethod
    def get_equipment_all(cls, project_id, lang):
        '''
        david 20170612
        获取 所有设备信息
        '''
        system_dict = {}
        equipment_system = {}
        strSQL = 'SELECT id, `name`, className FROM {1} '\
                 'WHERE projectId = {0} AND className IS NOT NULL '\
                 'AND className <> "传感器" AND className <> "Sensor"'.format(
                        project_id,
                        TableHelper.get_entity_tablename(project_id, lang)
                    )
        dbrv = BEOPDataAccess.getInstance(
        )._mysqlDBContainerReadOnly.op_db_query(DB_NAME, strSQL)
        if dbrv:
            for item in dbrv:
                try:
                    className = item[2]
                    equipmentName = item[1]
                    equipmentId = item[0]
                    equipment_system.update({equipmentId: className})
                    if className in system_dict.keys():
                        system_dict.get(className).get('equipments').append({
                            'equipmentId':
                            equipmentId,
                            'equipmentName':
                            equipmentName
                        })
                        system_dict[className]['totalNum'] += 1
                    else:
                        system_dict.update({
                            className: {
                                'className':
                                className,
                                'equipments': [{
                                    'equipmentId': equipmentId,
                                    'equipmentName': equipmentName
                                }],
                                'totalNum':
                                1,
                                'abnormalNum':
                                0,
                                'Equipment_faultType': {}
                            }
                        })
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
        rate = goodNum / totalNum * 100
        if rate < 99:
            rate = math.ceil(rate)
        else:
            rate = math.floor(rate)
        return '%f' % rate + '%'

    @classmethod
    def get_realpoint_count(cls, projId):
        rt = None
        dbAccess = BEOPDataAccess.getInstance()
        mysqlname = dbAccess.getProjMysqldb(projId)
        sql = 'SELECT COUNT(*) FROM rtdata_%s where flag = 0' % mysqlname
        dbrv = dbAccess._mysqlDBContainerReadOnly.op_db_query_one(
            app.config['DATABASE'], sql, ())
        if dbrv:
            rt = int(dbrv[0])
        return rt

    @classmethod
    def get_entity_fault_enable(cls, ef_ids):
        formatted_ids = []
        if len(ef_ids) == 0:
            return []
        for row in ef_ids:
            formatted_ids.append('%s,%s' % (row[0], row[1]))
        converter = MySQLConverter()
        sql = '''
            SELECT
                entityId,
                faultId,
                `enable`
            FROM
                {0}
            WHERE 1=1
        '''.format(TableHelper.get_entity_fault_tablename()  # 这里不需要考虑国际化
                   )
        if len(ef_ids) > 0:
            sql += ' AND CONCAT(entityId, \',\', faultId) in (\'%s\')' % \
                '\',\''.join([
                    converter.escape(i) for i in formatted_ids
                ])
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
    def get_lastest_notice_by_efids(cls, project_id, ef_ids):
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
                        CONCAT(entityId, ',', faultId) in ('{1}')
                    GROUP BY entityId, faultId 
                )
        '''.format(
            TableHelper.get_notice_tablename(project_id), '\',\''.join([
                converter.escape('%s,%s' % (entityId, faultId))
                for entityId, faultId in ef_ids
            ]))
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql)
        data = []
        for row in result:
            data.append({'id': row[0], 'endTime': row[1], 'efid': row[2]})
        return data

    @classmethod
    def get_tasks_inprocess_by_efids(cls, ef_ids):
        converter = MySQLConverter()
        sql = '''
            SELECT
                entityId,
                faultId
            FROM
                diagnosis_task
            WHERE
                CONCAT(entityId, ',', faultId) in ('{0}')
            AND (status = 2 OR status = 1)
        '''.format('\',\''.join([
            converter.escape('%s,%s' % (entityId, faultId))
            for entityId, faultId in ef_ids
        ]))
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql)
        data = []
        for row in result:
            data.append('%s,%s' % (row[0], row[1]))
        return data

    @classmethod
    def filter_by_task(cls, data):
        ef_ids = []
        new_data = []
        removed_data = []

        for item in data:
            ef_ids.append([item['entityId'], item['faultId']])
        tasks_inprocess = cls.get_tasks_inprocess_by_efids(ef_ids)
        deleteArr = []
        for i, item in enumerate(data):
            ef_id_str = '%s,%s' % (item['entityId'], item['faultId'])
            if ef_id_str in tasks_inprocess:
                removed_data.append(data[i])
                deleteArr.append(i)
                # del data[i]
            else:
                new_data.append(data[i])
        deleteArr.sort(reverse=True)
        for item in deleteArr:
            del data[item]
        return new_data, removed_data

    @classmethod
    def add_notices(cls, project_id, data):
        rt = True
        result_status = []

        last_id_list = []
        try:
            data, removed_data = cls.filter_by_task(data)
            # 更新 result_status
            for item in removed_data:
                result_status.append({
                    'status':
                    'OK',
                    'msg':
                    '相应故障（entityId: %s, faultId: %s）已在任务池中，跳过添加' %
                    (item.get('entityId'), item.get('faultId'))
                })
            if not data:
                return result_status, None

            dbAccess = BEOPDataAccess.getInstance()
            ef_ids = []
            for item in data:
                ef_ids.append([item['entityId'], item['faultId']])

            entity_fault_enable = cls.get_entity_fault_enable(ef_ids)

            prepared_data = []
            table_name = TableHelper.get_notice_tablename(project_id)
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
            result = dbAccess._mysqlDBContainerReadOnly.op_db_query(
                DB_NAME, sql, (table_name, ))

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
                    result_status.append({
                        'status': 'ERROR',
                        'msg': '未找到对应的 fault 记录，不允许写入！'
                    })
                    continue
                enable = None
                for row in entity_fault_enable:
                    if item['entityId'] == row['entityId'] and item['faultId'] == row['faultId']:
                        enable = row['enable']
                if enable is None:
                    result_status.append({
                        'status': 'ERROR',
                        'msg': '未查到 enable 数据，不允许写入！'
                    })
                    continue
                if enable == 0:
                    result_status.append({
                        'status': 'ERROR',
                        'msg': 'enable 为 0，不允许写入！'
                    })
                    continue
                prepared_data.append(item)

            if len(prepared_data) > 0:
                lastest_notices = cls.get_lastest_notice_by_efids(
                    project_id, ef_ids)
                insert_data = []
                update_notice_ids = []
                lastest_notices_map = {}
                for item in lastest_notices:
                    lastest_notices_map[item.get('efid')] = item
                for item in prepared_data:
                    notice = lastest_notices_map.get('%s%s' %
                                                     (item.get('entityId'),
                                                      item.get('faultId')))
                    if notice and notice.get('endTime') is None:
                        update_notice_ids.append(notice.get('id'))
                    insert_data.append(item)

                if len(update_notice_ids) > 0:
                    # 获取时区数据
                    time_zone = dbAccess.get_project_time_zone_by_id(
                        project_id)
                    time_zone = 8 if time_zone is None else time_zone
                    # 计算出项目所在地的时间
                    project_time = (
                        datetime.utcnow() + timedelta(hours=time_zone)
                    ).strftime('%Y-%m-%d %H:%M:%S')
                    sql = '''
                        UPDATE {0}
                        SET
                            endTime = date_add(`time`, INTERVAL 1 HOUR),
                            status = 10
                        WHERE
                            id IN ({2})
                    '''.format(table_name, project_time,
                               ','.join([str(x) for x in update_notice_ids]))

                    rt = dbAccess._mysqlDBContainer.op_db_update(DB_NAME, sql)
                    if rt:
                        result_status.append({
                            'status':
                            'OK',
                            'msg':
                            'Success to update %s records.' % len(insert_data)
                        })
                    else:
                        result_status.append({
                            'status':
                            'ERROR',
                            'msg':
                            'Failed to update notices endTime.'
                        })

                if len(insert_data) > 0:
                    sql = '''
                        INSERT INTO {0}
                            (projectId, faultId, entityId, grade, orderId, detail, time, energy, status, imported)
                            VALUES(%(projectId)s, %(faultId)s, %(entityId)s,
                            (
                                SELECT 
                                    CASE WHEN ef.grade IS NULL THEN f.grade ELSE ef.grade END AS grade
                                FROM {1} ef 
                                LEFT JOIN {2} f ON ef.faultId = f.id
                                WHERE ef.faultId=%(faultId)s AND ef.entityId=%(entityId)s
                            ), %(orderId)s, %(detail)s, %(time)s, %(energy)s, %(status)s, 0)
                    '''.format(
                        table_name,
                        TableHelper.get_entity_fault_tablename(
                            project_id),  # 这里暂不考虑国际化
                        TableHelper.get_fault_tablename())

                    rt_list = []
                    for data in insert_data:
                        last_id = dbAccess._mysqlDBContainer.op_db_update_with_id(
                            DB_NAME, sql, data)
                        last_id_list.append(last_id)

                    if all(last_id for rt in rt_list):
                        result_status.append({
                            'status':
                            'OK',
                            'msg':
                            'Success to insert %s records.' % len(insert_data)
                        })
                    else:
                        result_status.append({
                            'status': 'ERROR',
                            'msg': 'Failed to insert notices.'
                        })
        except Exception as error:
            logging.error(
                'Unhandled exception! Locals: %s',
                locals(),
                exc_info=True,
                stack_info=True)
            result_status.append({'status': 'ERROR', 'msg': error.__str__()})
        finally:
            checkInvalidNoticeEndTime(project_id)
        return result_status, last_id_list

    @classmethod
    def update_notices_status(cls, project_id, data):
        result = True
        try:
            data, removed_data = cls.filter_by_task(data)
            if not data:
                return True

            table_name = TableHelper.get_notice_tablename(project_id)
            dbAccess = BEOPDataAccess.getInstance()

            # 获取时区数据
            time_zone = dbAccess.get_project_time_zone_by_id(project_id)
            time_zone = 8 if time_zone is None else time_zone
            # 计算出项目所在地的时间
            project_time = (datetime.utcnow() + timedelta(hours=time_zone)
                            ).strftime('%Y-%m-%d %H:%M:%S')

            # 来自Amy的需求：如果对当前(entity, fault)发现多条状态为1的notice，
            # 将最近的一条的endTime设置为当前时间，
            # 将其他的endTime设置成`time`加一小时
            sql_template = '''
                UPDATE {0} SET
                    status = 10,
                    endTime = (CASE
                        WHEN
                            id != (
                                SELECT inter.id FROM (
                                    SELECT id FROM {0}
                                    WHERE entityId = {2} AND faultId = {3} ORDER BY id DESC LIMIT 1
                                ) AS inter
                            )
                        THEN date_add(`time`, INTERVAL 1 HOUR)
                        ELSE '{1}'
                        END
                    )
                WHERE entityId = {2} AND faultId = {3} AND endTime IS NULL;
            '''
            for i in range(len(data)):
                sql = sql_template.format(table_name, project_time,
                                          data[i].get("entityId"),
                                          data[i].get("faultId"))
                rt = dbAccess._mysqlDBContainer.op_db_update(DB_NAME, sql)
                if not rt:
                    result = False
        except Exception:
            logging.error(
                'Unhandled exception! Locals: %s',
                locals(),
                exc_info=True,
                stack_info=True)
            result = False
        finally:
            checkInvalidNoticeEndTime(project_id)

        return result

    @classmethod
    def get_entity_diagnosis_info(cls, projId, startTime, endTime, language):
        # 试用于新版诊断
        def dataFormat(dataDict):
            result = []
            for prop, val in dataDict.items():
                result.append({prop: val})
            return result

        strSql = '''
            SELECT
                f.entityId,
                f.customTag,
                de.className,
                de.`name` AS equipName,
                df.`name` AS faultName,
                df.suggestion,
                df.description,
                f.points,
                dn.time,
                f.axisName,
                f.axisSet,
                f.faultId
            FROM
                %s f
            LEFT JOIN %s df ON df.id = f.faultId
            LEFT JOIN %s de ON de.id = f.entityId
            LEFT JOIN (
                SELECT
                    id,
                    entityId,
                    faultId,
                    MAX(time) as time
                FROM
                    %s
                WHERE
                    time >= "%s" and time <= "%s"
                GROUP BY
                    entityId, faultId
            )as dn ON dn.entityId = f.entityId AND dn.faultId = f.faultId
            WHERE f.projectId = %d AND f.customTag IS NOT NULL
            ORDER BY f.customTag, de.className, equipName
        ''' % (TableHelper.get_entity_fault_tablename(projId, language),
               TableHelper.get_fault_tablename(language),
               TableHelper.get_entity_tablename(projId, language),
               TableHelper.get_notice_tablename(projId), startTime, endTime,
               int(projId))
        resultDict = OrderedDict()
        diagnosisInfo = BEOPDataAccess.getInstance(
        )._mysqlDBContainerReadOnly.op_db_query(DB_NAME, strSql)
        for item in diagnosisInfo:
            customTag = item[1]
            className = item[2]
            equipName = item[3]
            faultName = item[4]
            faultStatus = 0
            # points
            if item[7]:
                if customTag not in resultDict:
                    resultDict.update({customTag: OrderedDict()})
                if className not in resultDict[customTag]:
                    resultDict[customTag].update({className: OrderedDict()})
                if equipName not in resultDict[customTag][className]:
                    resultDict[customTag][className].update({equipName: []})
                # time
                if item[8]:
                    diagnosisTimeObj = item[8]
                    faultStatus = 1
                else:
                    diagnosisTimeObj = datetime.strptime(
                        endTime, '%Y-%m-%d %H:%M:%S') + timedelta(hours=-3)
                diagnosisTimeObj_5min = diagnosisTimeObj.replace(
                    minute=(int(diagnosisTimeObj.minute / 5) * 5),
                    second=0,
                    microsecond=0)
                diagnosisTimeStr = datetime.strftime(diagnosisTimeObj_5min,
                                                     '%Y-%m-%d %H:%M:%S')
                resultDict[customTag][className][equipName].append({
                    "setValue":
                    '-',
                    "realValue":
                    '-',
                    "points":
                    item[7],
                    "time":
                    diagnosisTimeStr,
                    "name":
                    faultName,
                    "description":
                    item[6],
                    "suggestion":
                    item[5],
                    "faultStatus":
                    faultStatus,
                    "axisName":
                    item[9],
                    "axisSet":
                    item[10],
                    "entityId":
                    item[0],
                    "faultId":
                    item[11]
                })
        for k, v in resultDict.items():
            for key, value in v.items():
                v[key] = dataFormat(value)
            resultDict[k] = dataFormat(v)
        result = dataFormat(resultDict)
        return result

    @classmethod
    def get_groupby_equipment(cls, project_id, page_num, page_size, start_time,
                              end_time, entity_ids, fault_ids, class_names,
                              keywords, sort, entityNames, lang):
        """ 获取设备的信息 在聚类 """
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
                        n.entityId
                    FROM
                        {0} n
                    WHERE
                        time >= "{1}"
                    AND time <= "{2}"
        '''.format(
            TableHelper.get_notice_tablename(project_id), start_time, end_time)
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
                n.id,
                e.location
            FROM
                {0} n
            LEFT JOIN {4} ef ON ef.entityId = n.entityId
            AND ef.faultId = n.faultId
            LEFT JOIN {3} e ON e.id = n.entityId
            LEFT JOIN {5} f ON f.id = n.faultId
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
        '''.format(
            TableHelper.get_notice_tablename(project_id), start_time, end_time,
            TableHelper.get_entity_tablename(project_id, lang),
            TableHelper.get_entity_fault_tablename(project_id, lang),
            TableHelper.get_fault_tablename())
        if len(entity_ids) > 0:
            temp = ' AND entityId IN (%s)' % ','.join(
                [str(i) for i in entity_ids])
            sql += temp
            count_sql += temp
        sql += '''
                        GROUP BY
                            entityId
                        LIMIT {0},{1}
                    ) tmp
            )
        '''.format((page_num - 1) * page_size, page_size)
        if len(fault_ids) > 0:
            temp = ' AND n.faultId IN (%s)' % ','.join(
                [str(i) for i in fault_ids])
            sql += temp
            count_sql += temp
        if len(class_names) > 0:
            temp = ' AND e.className IN (\'%s\')' % '\',\''.join(class_names)
            sql += temp
            count_sql += temp
        if keywords:
            temp = ' AND (e.name like BINARY"%{0}%")'.format(keywords)
            sql += temp
            count_sql += temp
        if len(entityNames) > 0:
            temp = ' AND e.name IN (\'%s\')' % '\',\''.join(entityNames)
            sql += temp
            count_sql += temp
        for item in sort:
            if sort.index(item) == 0:
                sql += ' ORDER BY {0} {1}'.format(item['key'], item['order'])
            else:
                sql += ' ,{0} {1}'.format(item['key'], item['order'])
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
            return {'data': [], 'total': 0}
        data = []
        idArr = []
        for item in result:
            entityId = item[0]
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
            if entityId in idArr:
                for single in data:
                    if entityId == single['id']:
                        single['arrNoticeTime'].append(json)
            else:
                idArr.append(entityId)
                arr = {}
                arr['name'] = item[1]
                arr['id'] = entityId
                arr['arrNoticeTime'] = [json]
                arr['parentName'] = item[11] if item[11] else '-' #2947 location
                arr['location'] = item[11] if item[11] else '-'
                data.append(arr)
        return {'data': data, 'total': count[0][0]}

    @classmethod
    def get_roi_info(cls, project_id, page_num, page_size, \
                     start_time, end_time, entity_ids, fault_ids, class_names, keywords, sort, lan):
        """ 获取roi信息 """
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
                ef.runDay,
                ef.runWeek,
                ef.runMonth,
                ef.runYear,
                u.Factor
        '''
        sql = '''
             
            FROM
                {3} f
            LEFT JOIN (
                SELECT
                projectId,
                    faultId,
                    entityId,
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
            LEFT JOIN {2} ef ON f.id = ef.faultId
            LEFT JOIN {1} e ON e.id = ef.entityId
            LEFT JOIN unitconversion u ON ef.unit = u.NewUnit
            WHERE
                n.projectId = %s
            AND n.time >= %s
            AND n.time <= %s
        '''.format(
            TableHelper.get_notice_tablename(project_id),
            TableHelper.get_entity_tablename(project_id, lan),
            TableHelper.get_entity_fault_tablename(project_id),
            TableHelper.get_fault_tablename(lan))
        if len(entity_ids) > 0:
            sql += ' AND n.entityId IN (%s)' % ','.join(
                [str(i) for i in entity_ids])
        if len(fault_ids) > 0:
            sql += ' AND n.faultId IN (%s)' % ','.join(
                [str(i) for i in fault_ids])
        if len(class_names) > 0:
            sql += ' AND e.className IN (\'%s\')' % '\',\''.join(class_names)
        if keywords:
            sql += ' AND (e.NAME like BINARY"%{0}%" OR f.NAME like BINARY"%{0}%" OR f.faultGroup like BINARY"%{0}%")'.format(
                keywords)
        sql += ' GROUP BY f.id'
        for item in sort:
            if sort.index(item) == 0:
                sql += ' ORDER BY {0} {1}'.format(item['key'], item['order'])
            else:
                sql += ' ,{0} {1}'.format(item['key'], item['order'])
        if len(sort) == 0:
            sql += ' ORDER BY e.`name`, f.`name`'
        limt_sql = ' LIMIT {0},{1}'.format((page_num - 1) * page_size,
                                           page_size)
        count = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, count_sql+sql+count_sql_end, (start_time, end_time, project_id, start_time, end_time))
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, item_sql+sql+limt_sql, (start_time, end_time, project_id, start_time, end_time))
        if len(result) == 0:
            return {'data': [], 'total': 0}
        data = []
        for item in result:
            data.append({
                'equipmentId':
                item[0],
                'equipmentName':
                item[1],
                'time':
                item[2].strftime('%Y-%m-%d %H:%M:%S'),
                'energy':
                item[3],
                'grade':
                item[4],
                'faultName':
                item[5],
                'faultId':
                item[6],
                'group':
                item[7],
                'unit':
                item[8],
                'hr':
                float(item[9]) if item[9] else item[9],
                'hrPrice':
                float(item[10]) if item[10] else item[10],
                'elecPrice':
                item[11],
                'laborCost':
                float(item[12]) if item[12] else item[12],
                'runDay':
                item[13],
                'runWeek':
                item[14],
                'runMonth':
                item[15],
                'runYear':
                item[16],
                'factor':
                item[17],
            })
        return {'data': data, 'total': count[0][0]}

    @classmethod
    def save_roi_info(cls, project_id, dataArr):
        ''' 保存roi信息'''
        try:
            for item in dataArr:
                rt = False
                faultId = item.get('faultId')
                equipmentId = item.get('equipmentId')
                hrPrice = 'null' if item.get('hrPrice') == '--' else item.get(
                    'hrPrice')
                hr = 'null' if item.get('hr') == '--' else item.get('hr')
                laborCost = 'null' if item.get(
                    'laborCost') == '--' else item.get('laborCost')
                elecPrice = 'null' if item.get(
                    'powerPrice') == '--' else item.get('powerPrice')
                sql = '''
                    UPDATE {6}
                    SET hrPrice = {0}, hr = {1}, laborCost = {2}, elecPrice = {3}
                    WHERE
                        faultId = {4}
                    And entityId = {5}
                '''.format(hrPrice, hr, laborCost, elecPrice, faultId,
                           equipmentId,
                           TableHelper.get_entity_fault_tablename(project_id))
                result = BEOPDataAccess.getInstance()._mysqlDBContainer.\
                op_db_update(DB_NAME, sql)
                if result:
                    rt = True
            rt = {'data': rt}
        except Exception as e:
            print('saveRoiInfo error:' + e.__str__())
        return rt

    @classmethod
    def get_priority_faults(cls,
                            project_id,
                            start_time,
                            end_time,
                            number=20,
                            entity_ids=[],
                            class_names=[],
                            fault_ids=[],
                            lan='en'):
        """ 获取最新的错误列表，具体数目由 number 决定 """
        default_weight = 0.5
        number = 20 if number is None else number
        notice_weight_map = {}
        select_noticeId_faultWeight_sql = """
            SELECT
                n.id,
                e.tagId,
                CASE WHEN f.faulttype=2.0 THEN 0.2 ELSE f.faulttype END
        """
        selectSql = '''
            SELECT
                n.time,
                f.`name`,
                f.`consequence`,
                e.id,
                n.faultId,
                e.className,
                n.id,
                f.grade,
                e.parent,
                e.tagId,
                e.location,
                e.name
        '''
        from_where_sql = '''
            FROM
                {0} n
            LEFT JOIN {2} f ON n.faultId = f.id
            LEFT JOIN {1} e ON n.entityId = e.id
            WHERE
                n.time >= "{3}"
            AND n.time <= "{4}"
            AND e.projectId = "{5}"
        '''.format(
            TableHelper.get_notice_tablename(project_id),
            TableHelper.get_entity_tablename(project_id, lan),
            TableHelper.get_fault_tablename(lan), start_time, end_time,
            project_id)
        if len(entity_ids) > 0:
            from_where_sql += ' AND n.entityId IN (%s)' % ','.join(
                [str(i) for i in entity_ids])
        if len(fault_ids) > 0:
            from_where_sql += ' AND n.faultId IN (%s)' % ','.join(
                [str(i) for i in fault_ids])
        if len(class_names) > 0:
            from_where_sql += ' AND e.className IN (\'%s\')' % '\',\''.join(
                class_names)
        noticeIdFaultWeightResult = BEOPDataAccess.getInstance(
        )._mysqlDBContainerReadOnly.op_db_query(
            DB_NAME, select_noticeId_faultWeight_sql + from_where_sql)
        noticeId_faultWeight_map = {}
        noticeId_tagId_map = {}
        for item in noticeIdFaultWeightResult:
            noticeId_faultWeight_map[item[0]] = item[2]
            noticeId_tagId_map[item[0]] = item[1]
        tagIds = [value for index, value in noticeId_tagId_map.items()]
        tagIds = list(set(tagIds))
        tagId_equip_weight_map = pointTag.get_equip(
            [ObjectId(item) for item in tagIds], project_id, default_weight)
        not_found_tagIds = []
        # 计算权重（设备权重*故障权重）
        for noticeId, faultWeight in noticeId_faultWeight_map.items():
            tagId = noticeId_tagId_map.get(noticeId)
            if ObjectId(tagId) not in tagId_equip_weight_map:
                entityWeight = default_weight
                not_found_tagIds.append(str(tagId))
            else:
                entityWeight = tagId_equip_weight_map[ObjectId(tagId)]
            notice_weight_map[noticeId] = faultWeight * entityWeight
        if  not_found_tagIds:
            not_found_tagIds = list(set(not_found_tagIds))
            logging.error('cloudPoint表中找不到tagId:' + str(not_found_tagIds) + '但存在于diagnosis_entity表中')
        noticeObjOrdered = sorted(
            notice_weight_map.items(), key=lambda e: e[1], reverse=True)
        noticeIdOrderIds = [notice[0] for notice in noticeObjOrdered]
        order_sql = """
                             ORDER BY
                                 FIELD(n.id, %s),
                                 f.grade DESC,
                                 time DESC """ % str(noticeIdOrderIds).replace('[', '').replace(']', '')

        result = BEOPDataAccess.getInstance(
        )._mysqlDBContainerReadOnly.op_db_query(
            DB_NAME, selectSql + from_where_sql + order_sql)

        data = []
        faultIdDetailMap = {}
        resultFaultIds = []
        for item in result:
            if item[10]:
                entityShowName = item[10] + ' / ' + item[11]
            else:
                entityShowName = item[11]
            if item[4] not in resultFaultIds:
                resultFaultIds.append(item[4])
                faultIdDetailMap[item[4]] = {
                    'noticeId': [str(item[6])],
                    'time': item[0].strftime('%Y-%m-%d %H:%M'),
                    'name': item[1],
                    'consequence': item[2],
                    'entityNames': [entityShowName],
                    'entityId': [str(item[3])],
                    'faultId': item[4],
                    'className': 'Other' if item[5] is None else item[6],
                    'grade': item[7]
                }
            else:
                faultIdDetailMap[item[4]]['noticeId'].append(str(item[6]))
                faultIdDetailMap[item[4]]['entityNames'].append(entityShowName)
                faultIdDetailMap[item[4]]['entityId'].append(str(item[3]))
        resultFaultIds = resultFaultIds[0:number]
        for faultId in resultFaultIds:
            detail = faultIdDetailMap.get(faultId)
            detail['noticeId'] = ','.join(list(set(detail['noticeId'])))
            detail['entityNames'] = ','.join(list(set(detail['entityNames'])))
            detail['entityId'] = ','.join(list(set(detail['entityId'])))
            data.append(faultIdDetailMap.get(faultId))
        return data

    @classmethod
    def get_faults_by_ids(cls, ids, lang):
        """ 根据ids 和语言获取faults """
        tableName = TableHelper.get_fault_tablename(lang)
        idsStr = '(' + ','.join(str(id) for id in ids) + ')'
        sql = '''
            SELECT
                id,
                name,
                description,
                suggestion
            FROM
                {0}
            WHERE
                id IN {1}
            '''.format(tableName, idsStr)
        result = BEOPDataAccess.getInstance(
        )._mysqlDBContainerReadOnly.op_db_query(DB_NAME, sql)
        data = []
        for item in result:
            data.append({
                'id': item[0],
                'name': item[1],
                'description': item[2],
                'suggestion': item[3]
            })
        return data

    @classmethod
    def get_notice_details(cls,projectId,faults):
        tableName = TableHelper.get_notice_tablename(projectId)
        whereStr = ' OR '.join('(faultId='+str(fault['id'])+' AND entityId='+str(fault['entityId'])+' AND time >= "'+fault['startTime']+'" AND time <= "'+fault['endTime']+'")' for fault in faults)
        sql = '''
            SELECT
                id,
                faultId,
                entityId,
                detail
            FROM
                {0}
            WHERE
                {1}
            '''.format(tableName, whereStr)
        result = BEOPDataAccess.getInstance(
        )._mysqlDBContainerReadOnly.op_db_query(DB_NAME, sql)
        data = []
        for item in result:
            data.append({
                'id':item[0],
                'faultId':item[1],
                'entityId':item[2],
                'detail':item[3]
            })
        return data
    
    @classmethod
    def get_faults_info_and_points(cls, projectId, id, entityIds, startTime,
                                   endTime, searchTime, lang):
        """ 根据 faultId 和 entityIds 查询 3 个数值 + points """
        tableName = TableHelper.get_notice_tablename(projectId)
        idsStr = '(' + ','.join(str(id) for id in entityIds) + ')'
        timeStr = ''
        if searchTime:
            timeStr = "AND (n.endTime is Null or n.endTime >= '" + searchTime + "')"
        else:
            searchTime = endTime
        sql = '''
                SELECT
                    n.faultId,
                    n.entityId,
                    n.time,
                    n.endTime,
                    ef.points,
                    n.energy,
                    ef.elecPrice,
                    e.name
                FROM
                    {0} n
                LEFT JOIN {5} ef ON ef.faultId = n.faultId
                AND ef.entityId = n.entityId
                LEFT JOIN {7} e ON e.id = n.entityId
                WHERE
                    n.faultId = {1}
                AND n.entityId IN {2}
                AND n.time >= '{3}'
                AND n.time <= '{4}'
                {6}
                ORDER BY n.time DESC
            '''.format(tableName, id, idsStr, startTime, searchTime,
                       TableHelper.get_entity_fault_tablename(projectId, lang),
                       timeStr,
                       TableHelper.get_entity_tablename(projectId, lang))
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.op_db_query(DB_NAME, sql)
        data = []
        length = len(result)
        if length == 0:
            return data
        durationSec = 0
        energy = 0.0
        timeArr = []
        endArr = []
        for item in result:
            startT = item[2]
            endT = item[3]
            timeArr.append(startT.strftime('%Y-%m-%d %H:%M:%S'))
            endArr.append(endT.strftime('%Y-%m-%d %H:%M:%S') if endT else None)
            startSec = time.mktime(startT.timetuple())
            endSec = time.mktime(item[3].timetuple()) if item[3] else round(
                time.time(), 0)
            ds = int(endSec) - int(startSec)
            durationSec += ds
            if item[5]:
                energy += float(item[5]) * round(ds / 60 / 60, 2)
        item = result[0]
        fontArr = item[4].split('|') if item[4] else []
        points = []
        for v in fontArr:
            point = v.split(',')
            points.append({'name': point[0], 'description': point[1]})
        data.append({
            'entityId': item[1],
            'faultId': item[0],
            'times': timeArr,
            'endTimes': endArr,
            'occueTimes': length,
            'energy': energy,
            'duration': durationSec / 60,
            'points': points,
            'elecPrice': item[6],
            'entityName': item[7]
        })
        return data

    @classmethod
    def get_fault_info_by_consequence(cls, projectId, startTime, endTime,
                                      entity_ids, class_names, fault_ids,
                                      lang):
        tableName = TableHelper.get_notice_tablename(projectId)
        sql = '''
            SELECT
                f.consequence,
                n.endTime
            FROM
                {0} n
            LEFT JOIN {4} f ON n.faultId = f.id
            LEFT JOIN {3} AS e ON n.entityId = e.id
            WHERE
                n.time >= '{1}'
            AND n.time <= '{2}'
        '''.format(tableName, startTime, endTime,
                   TableHelper.get_entity_tablename(projectId, lang),
                   TableHelper.get_fault_tablename(lang))
        if len(entity_ids) > 0:
            sql += ' AND n.entityId IN (%s)' % ','.join(
                [str(i) for i in entity_ids])
        if len(fault_ids) > 0:
            sql += ' AND n.faultId IN (%s)' % ','.join(
                [str(i) for i in fault_ids])
        if len(class_names) > 0:
            sql += ' AND e.className IN (\'%s\')' % '\',\''.join(class_names)
        sql += ' ORDER BY f.consequence DESC'
        info = {
            'Comfort issue': {
                'consequence': 'Comfort issue',
                "processed": 0,
                "total": 0
            },
            'Energy waste': {
                'consequence': 'Energy waste',
                "processed": 0,
                "total": 0
            },
            'Equipment Health': {
                'consequence': 'Equipment Health',
                "processed": 0,
                "total": 0
            },
            'Other': {
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
    def get_info_by_time_equipment_numberoffaults(
            cls, project_id, start_time, end_time, entity_Ids, class_names,
            fault_ids, lang):
        sql = '''
            SELECT
                e.className,
                SUM(1) AS number,
                DATE_FORMAT(n.time, '%Y-%m-%d') AS formatDate
            FROM
                {0} n
            LEFT JOIN {1} e ON n.entityId = e.id
            WHERE
                n.time >= %s
            AND n.time <= %s
        '''.format(
            TableHelper.get_notice_tablename(project_id),
            TableHelper.get_entity_tablename(project_id, lang))
        if len(entity_Ids) > 0:
            sql += ' AND n.entityId IN (%s)' % ','.join(
                [str(i) for i in entity_Ids])
        if len(fault_ids) > 0:
            sql += ' AND n.faultId IN (%s)' % ','.join(
                [str(i) for i in fault_ids])
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
            data.append({'x': item[2], 'y': item[0], 'z': int(item[1])})
        return data

    @classmethod
    def get_info_by_time_consequence_numberoffaults(
            cls, project_id, start_time, end_time, entity_Ids, class_names,
            fault_ids, lang):
        sql = '''
            SELECT
                f.consequence,
                SUM(1) AS number,
                DATE_FORMAT(n.time, '%Y-%m-%d') AS formatDate
            FROM
                {0} n
            LEFT JOIN {2} f ON n.faultId = f.id
            LEFT JOIN {1} e ON n.entityId = e.id
            WHERE
                n.time >= %s
            AND n.time <= %s            
        '''.format(
            TableHelper.get_notice_tablename(project_id),
            TableHelper.get_entity_tablename(project_id, lang),
            TableHelper.get_fault_tablename(lang))
        if len(entity_Ids) > 0:
            sql += ' AND n.entityId IN (%s)' % ','.join(
                [str(i) for i in entity_Ids])
        if len(fault_ids) > 0:
            sql += ' AND n.faultId IN (%s)' % ','.join(
                [str(i) for i in fault_ids])
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
            data.append({'x': item[2], 'y': item[0], 'z': int(item[1])})
        return data

    @classmethod
    def get_info_by_time_equipment_energy(cls, project_id, start_time,
                                          end_time, entity_Ids, class_names,
                                          fault_ids, lang):
        sql = '''
            SELECT
                e.className,
                SUM(n.energy*TIMESTAMPDIFF(HOUR, n.time, n.endTime)) as sumOfEnergy,
                DATE_FORMAT(n.time, '%Y-%m-%d') AS formatDate
            FROM
                {0} n
            LEFT JOIN {1} e ON n.entityId = e.id
            WHERE
                n.time >= %s
            AND n.time <= %s
        '''.format(
            TableHelper.get_notice_tablename(project_id),
            TableHelper.get_entity_tablename(project_id, lang))
        if len(entity_Ids) > 0:
            sql += ' AND n.entityId IN (%s)' % ','.join(
                [str(i) for i in entity_Ids])
        if len(fault_ids) > 0:
            sql += ' AND n.faultId IN (%s)' % ','.join(
                [str(i) for i in fault_ids])
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
            data.append({'x': item[2], 'y': item[0], 'z': item[1]})
        return data

    @classmethod
    def get_info_by_time_consequence_energy(cls, project_id, start_time,
                                            end_time, entity_Ids, class_names,
                                            fault_ids, lang):
        sql = '''
            SELECT
                f.consequence,
                SUM(n.energy*TIMESTAMPDIFF(HOUR, n.time, n.endTime)) as sumOfEnergy,
                DATE_FORMAT(n.time, '%Y-%m-%d') AS formatDate
            FROM
                {0} n
            LEFT JOIN {2} f ON n.faultId = f.id
            LEFT JOIN {1} e ON n.entityId = e.id
            WHERE
                n.time >= %s
            AND n.time <= %s
        '''.format(
            TableHelper.get_notice_tablename(project_id),
            TableHelper.get_entity_tablename(project_id, lang),
            TableHelper.get_fault_tablename(lang))
        if len(entity_Ids) > 0:
            sql += ' AND n.entityId IN (%s)' % ','.join(
                [str(i) for i in entity_Ids])
        if len(fault_ids) > 0:
            sql += ' AND n.faultId IN (%s)' % ','.join(
                [str(i) for i in fault_ids])
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
            data.append({'x': item[2], 'y': item[0], 'z': item[1]})
        return data

    @classmethod
    def get_faults_count_by_processstatus(cls, project_id, start_time,
                                          end_time, entity_Ids, class_names,
                                          fault_ids, lang):
        sql = '''
            SELECT
                COUNT(n.id),
                COUNT(n.endTime)
            FROM
                {0} n  
            LEFT JOIN {1} e ON n.entityId = e.id   
            WHERE
                n.time >= %s
            AND n.time <= %s
        '''.format(
            TableHelper.get_notice_tablename(project_id),
            TableHelper.get_entity_tablename(project_id, lang))
        if len(entity_Ids) > 0:
            sql += ' AND n.entityId IN (%s)' % ','.join(
                [str(i) for i in entity_Ids])
        if len(fault_ids) > 0:
            sql += ' AND n.faultId IN (%s)' % ','.join(
                [str(i) for i in fault_ids])
        if len(class_names) > 0:
            sql += ' AND e.className IN (\'%s\')' % '\',\''.join(class_names)
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql, (start_time, end_time))
        return {'total': result[0][0], 'processed': result[0][1]}

    @classmethod
    def get_faults_by_fault_type(cls, project_id, start_time, end_time,
                                 entity_Ids, class_names, fault_ids, lang):
        ''' 获取 fault 列表 '''
        sql = '''
            SELECT
                n.faultId,
                f.faultType
            FROM
                {0} n  
            LEFT JOIN {1} e ON n.entityId = e.id   
            RIGHT JOIN {2} f ON f.id = n.faultId
            WHERE
                n.time >= %s
            AND n.time <= %s
        '''.format(
            TableHelper.get_notice_tablename(project_id),
            TableHelper.get_entity_tablename(project_id, lang),
            TableHelper.get_fault_tablename())
        if len(entity_Ids) > 0:
            sql += ' AND n.entityId IN (%s)' % ','.join(
                [str(i) for i in entity_Ids])
        if len(fault_ids) > 0:
            sql += ' AND n.faultId IN (%s)' % ','.join(
                [str(i) for i in fault_ids])
        if len(class_names) > 0:
            sql += ' AND e.className IN (\'%s\')' % '\',\''.join(class_names)
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql, (start_time, end_time))
        data = []
        for item in result:
            data.append({"faultId": item[0], "faultType": item[1]})
        return data

    @classmethod
    def get_energy_by_day(cls, project_id, start_time, end_time, entity_Ids,
                          class_names, fault_ids, lang):
        sql = '''
            SELECT
                SUM(n.energy*TIMESTAMPDIFF(HOUR, n.time, n.endTime)) as sumOfEnergy,
                DATE_FORMAT(n.time, '%Y-%m-%d') AS formatDate
            FROM
                {0} n
            LEFT JOIN {1} AS e ON n.entityId = e.id   
            WHERE
                n.time >= %s
            AND n.time <= %s            
        '''.format(
            TableHelper.get_notice_tablename(project_id),
            TableHelper.get_entity_tablename(project_id, lang))
        if len(entity_Ids) > 0:
            sql += ' AND n.entityId IN (%s)' % ','.join(
                [str(i) for i in entity_Ids])
        if len(fault_ids) > 0:
            sql += ' AND n.faultId IN (%s)' % ','.join(
                [str(i) for i in fault_ids])
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
            data.append({'time': item[1], 'energy': item[0]})
        return data

    @classmethod
    def get_workOrder_info(cls, project_id, ids, lang):
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
                n.time,
                e.location
            FROM
                {0} n
            LEFT JOIN {2} ef ON ef.entityId = n.entityId and ef.faultId = n.faultId
            LEFT JOIN {1} e ON e.id = n.entityId
            LEFT JOIN {3} f ON f.id = n.faultId
        '''.format(
            TableHelper.get_notice_tablename(project_id),
            TableHelper.get_entity_tablename(project_id, lang),
            TableHelper.get_entity_fault_tablename(project_id, lang),
            TableHelper.get_fault_tablename(lang))
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
                {1}
            WHERE
                projectId = %s
            AND id IN ({0})
        '''.format(','.join([str(i) for i in entity_parent_ids]),
                   TableHelper.get_entity_tablename(project_id, lang))
        entity_query_result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql, (project_id, ))
        entity_id_name_map = {}
        for item in entity_query_result:
            entity_id_name_map[item[0]] = item[1]
        data = []
        for item in result:
            data.append({
                'entityid':
                item[0],
                'faultId':
                item[1],
                'entityName':
                item[2],
                "entityParentName":
                item[8], # 2947 前端改动太大名称不改内容改为 location
                "location":
                item[8],
                'faultName':
                item[4],
                'description':
                item[5],
                'points':
                cls._format_points_str(item[6]),
                'time':
                item[7].strftime('%Y-%m-%d %H:%M:%S')
            })
        return data

    @classmethod
    def set_feedback(cls, feedback):
        feedback = dict({
            'status': 0,
            'handle_person': None,
            'handle_time': None,
            'reason': None
        }, **feedback)
        rt = MongoConnManager.getConfigConn().setFeedback(feedback)
        return rt

    @classmethod
    def get_feedback(cls, condition):
        rt = MongoConnManager.getConfigConn().getFeedback(condition)
        return rt

    @classmethod
    def make_diagnosis_excel(cls, data):
        import uuid
        directory, filename = '/tmp/' + str(uuid.uuid4()), 'output.xlsx'
        os.makedirs(directory)
        return directory, filename

