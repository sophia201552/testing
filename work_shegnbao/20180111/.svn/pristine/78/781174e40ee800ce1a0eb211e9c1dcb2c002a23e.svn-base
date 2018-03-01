''' 新版诊断 fault 服务层 '''
from mysql.connector.conversion import MySQLConverter
from beopWeb.BEOPDataAccess import BEOPDataAccess
from beopWeb.mod_admin.User import User
from beopWeb.mod_memcache.RedisManager import RedisManager

from .service import TableHelper

#define table names
DB_NAME = 'diagnosis'

class DiagnosisFaultService:
    ''' 新版诊断 fault 服务层 '''

    @classmethod
    def change_fault_enable(cls, faultIds, entityIds, enable):
        sql = 'UPDATE `{3}` SET enable = {0} WHERE (faultId = {1} AND entityId = {2}) '.format(
                enable,
                faultIds[0],
                entityIds[0],
                TableHelper.get_entity_fault_tablename()
            )
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
        except Exception as expt:
            print(' error:' + str(expt)) 
            status = False     
        
        return status

    @classmethod
    def mail_app_push(cls,faultIds, entityIds,userIds, projId,type):
        sql = 'SELECT * FROM diagnosis_push '\
                'WHERE Type = %s and FaultId in %s and ProjId = %s and EntityId in %s' % (type, str(faultIds).replace('[', '(').replace(']', ')'), projId,str(entityIds).replace('[', '(').replace(']', ')'))
        dbrv = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.op_db_query(DB_NAME, sql)
        if dbrv:
            sql = 'DELETE FROM diagnosis_push '\
                    'WHERE Type = %s and FaultId in %s and ProjId = %s and EntityId in %s' % (type, str(faultIds).replace('[', '(').replace(']', ')'), projId,str(entityIds).replace('[', '(').replace(']', ')'))
            BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update(DB_NAME, sql,())
        sql = 'INSERT INTO diagnosis_push (`FaultId`, `ProjId`, `Users`, `Type`, `EntityId`) VALUES'
        for i in range(len(faultIds)):
            userIdsStr = '"'
            for j in range(len(userIds)):
                userIdsStr += str(userIds[j])
                if j != len(userIds) - 1:
                    userIdsStr += ','
                else:
                    userIdsStr += '"'
            sql += '(' + str(faultIds[i]) + ',' + str(projId) + ',' + userIdsStr + ',' + type + ',' + str(entityIds[i]) + ')'
            if i != len(faultIds) - 1:
                sql += ','
        status = None
        try:
            rt = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update(DB_NAME, sql, ())
            if rt:
                status = True
            else:
                status = False
        except Exception as expt:
            print(' error:' + str(expt)) 
            status = False

        return status

    @classmethod
    def push_type(cls, faultId, entityId, projId):
        data = []
        sql = 'SELECT Type FROM diagnosis_push '\
                'WHERE FaultId = %s and ProjId = %s and EntityId = %s' % (faultId, projId, entityId)
        dbrv = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.op_db_query(DB_NAME, sql)
        if dbrv:
            for i in dbrv:
                data.append(i)
        return data
        

    @classmethod
    def get_faults_infos(cls, page_num, page_size, \
         grades, consequences, class_names, keywords, sort, lan, ids):
        ''' 获取设备的报警信息 '''
        converter = MySQLConverter()
        tableName = TableHelper.get_fault_tablename(lan)
        # escape string
        count_sql = '''SELECT COUNT(*)'''
        item_sql = '''
            SELECT
                f.id,
                f.name,
                f.lastModifyUser,
                f.lastModifyTime,
                f.description,
                f.isPublic,
                f.grade,
                f.faultType,
                f.faultGroup,
                f.runMode,
                f.consequence,
                f.chartTitle,
                f.className,
                f.maintainable,
                f.suggestion
        '''
        sql = '''
            FROM
                {0} f
        '''.format(
            tableName,
            )
        if len(ids) > 0:
            sql += 'WHERE f.id in ({0})'.format(','.join([str(i) for i in ids]))
        else:
            sql += 'WHERE f.id > 0'
        if len(grades) > 0:
            sql += ' AND f.grade IN (%s)' % ','.join([str(i) for i in grades])
        if len(consequences) > 0:
            sql += ' AND f.consequence IN (\'%s\')' % '\',\''.join(consequences)
        if len(class_names) > 0:
            sql += ' AND f.className IN (\'%s\')' % '\',\''.join(class_names)
        if keywords:
            sql += ' AND f.name like BINARY"%{0}%"'.format(keywords)
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
        user = User()
        userlist = user.get_user_list_info([item[2] for item in notice_result])
        usermap = {}
        for item in userlist:
            usermap[item.get('id')] = item.get('userfullname')
        for item in notice_result:
            data.append({
                'id': item[0],
                'name': item[1],
                'lastModifyUser': usermap.get(item[2], 'unknown'),
                'lastModifyTime': item[3].strftime('%Y-%m-%d %H:%M:%S'),
                'description': item[4],
                'isPublic': item[5],
                'grade': item[6],
                'faultType': item[7],
                'faultGroup': item[8],
                'runMode': item[9],
                'consequence': item[10],
                'chartTitle': item[11],
                'className': item[12],
                'maintainable': item[13],
                'suggestion': item[14]
            })
        return {
            'data': data,
            'total': notice_count[0][0]
        }    
    
    @classmethod
    def get_faults_infos_v2(cls, page_num, page_size, \
         grades, consequences, class_names, keywords, sort, lan, ids, searchType):
        ''' 获取设备的报警信息 '''
        converter = MySQLConverter()
        tableName = TableHelper.get_fault_tablename(lan)
        # escape string
        count_sql = '''SELECT COUNT(*)'''
        item_sql = '''
            SELECT
                f.id,
                f.name,
                f.lastModifyUser,
                f.lastModifyTime,
                f.description,
                f.isPublic,
                f.grade,
                f.faultType,
                f.faultGroup,
                f.runMode,
                f.consequence,
                f.chartTitle,
                f.className,
                f.maintainable,
                f.suggestion
        '''
        sql = '''
            FROM
                {0} f
        '''.format(
            tableName,
            )
        if len(ids) > 0:
            sql += 'WHERE f.id in ({0})'.format(','.join([str(i) for i in ids]))
        else:
            sql += 'WHERE f.id > 0'
        if len(grades) > 0:
            sql += ' AND f.grade IN (%s)' % ','.join([str(i) for i in grades])
        if len(consequences) > 0:
            sql += ' AND f.consequence IN (\'%s\')' % '\',\''.join(consequences)
        if len(class_names) > 0:
            sql += ' AND f.className IN (\'%s\')' % '\',\''.join(class_names)
        if keywords:
            if searchType == 'param':
                sql += ' AND f.id like BINARY"%{0}%"'.format(keywords)
            elif searchType == 'description':
                sql += ' AND f.description like BINARY"%{0}%"'.format(keywords)
            else:
                sql += ' AND f.name like BINARY"%{0}%"'.format(keywords)
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
        user = User()
        userlist = user.get_user_list_info([item[2] for item in notice_result])
        usermap = {}
        for item in userlist:
            usermap[item.get('id')] = item.get('userfullname')
        for item in notice_result:
            data.append({
                'id': item[0],
                'name': item[1],
                'lastModifyUser': usermap.get(item[2], 'unknown'),
                'lastModifyTime': item[3].strftime('%Y-%m-%d %H:%M:%S'),
                'description': item[4],
                'isPublic': item[5],
                'grade': item[6],
                'faultType': item[7],
                'faultGroup': item[8],
                'runMode': item[9],
                'consequence': item[10],
                'chartTitle': item[11],
                'className': item[12],
                'maintainable': item[13],
                'suggestion': item[14]
            })
        return {
            'data': data,
            'total': notice_count[0][0]
        }

    @classmethod
    def get_faults_class_names(cls, lang):
        data = []        
        arr = ['className', 'consequence', 'grade']
        for single in arr:
            sql = '''
                SELECT
                    {1} AS name,
                    COUNT( {1} ) AS count
                FROM
                    `{0}`
                GROUP BY
                    {1}
            '''.format(
                    TableHelper.get_fault_tablename(lang),
                    single
                )
            result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
                op_db_query(DB_NAME, sql)
            singleData = {
                'nameArr': [],
                'count': []
            }
            for r in result:
                singleData['nameArr'].append(r[0])
                singleData['count'].append(r[1])
            data.append(singleData)
        RedisManager.set('strategyFaultManageItems', data)
        return data

    @classmethod
    def get_faults_class_names_by_ids(cls, lang, ids):
        data = []        
        arr = ['className', 'consequence', 'grade']
        for single in arr:
            sql = '''
                SELECT
                    {1} AS name,
                    COUNT( {1} ) AS count
                FROM
                    `{0}`
                WHERE
                    id in ({2})
                GROUP BY
                    {1}
            '''.format(
                    TableHelper.get_fault_tablename(lang),
                    single,
                    ','.join([str(i) for i in ids])
                )
            result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
                op_db_query(DB_NAME, sql)
            singleData = {
                'nameArr': [],
                'count': []
            }
            for r in result:
                singleData['nameArr'].append(r[0])
                singleData['count'].append(r[1])
            data.append(singleData)
        return data

    @classmethod
    def add_new_fault(cls, name, description, grade, faultType, faultGroup,runMode, consequence, chartTitle, className, maintainable, isPublic, lastModifyUser, lastModifyTime, suggestion):
        result = True
        sql = '''
            insert into {0} (
                name,
                description,
                grade,
                faultType,
                faultGroup,
                runMode,
                consequence,
                chartTitle,
                className,
                maintainable,
                isPublic,
                lastModifyUser, 
                lastModifyTime,
                suggestion
            ) values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        '''.format(TableHelper.get_fault_tablename())
        last_inserted_id = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update_with_id(
            DB_NAME, sql, (name, description, grade, faultType, faultGroup,runMode, consequence, \
            chartTitle, className, maintainable, isPublic, \
            lastModifyUser, lastModifyTime, suggestion)
        )
        if last_inserted_id == -1:
            return False

        sql = '''
            insert into {0} (
                id,
                name,
                description,
                grade,
                faultType,
                faultGroup,
                runMode,
                consequence,
                chartTitle,
                className,
                maintainable,
                isPublic,
                lastModifyUser, 
                lastModifyTime,
                suggestion
            ) values({1}, %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        '''.format(TableHelper.get_fault_tablename('zh'), last_inserted_id)
        result = BEOPDataAccess.getInstance()._mysqlDBContainer.op_db_update(DB_NAME, sql,(\
            name, description, grade, faultType, faultGroup,runMode, consequence, \
            chartTitle, className, maintainable, isPublic, \
            lastModifyUser, lastModifyTime, suggestion, ))
        return result

    @classmethod
    def delete_fault(cls, id):
        # 英文标删除
        sql = '''
            DELETE FROM {1} WHERE id = {0}
        '''.format(id, TableHelper.get_fault_tablename())
        result = BEOPDataAccess.getInstance()._mysqlDBContainer.\
            op_db_update(DB_NAME, sql)
        
        # 中文表删除
        sql = '''
            DELETE FROM {1} WHERE id = {0}
        '''.format(id, TableHelper.get_fault_tablename('zh'))
        result = result and BEOPDataAccess.getInstance()._mysqlDBContainer.\
            op_db_update(DB_NAME, sql)
        return result

    @classmethod
    def get_faults_name_by_ids(cls, ids, lan):
        tableName = TableHelper.get_fault_tablename(lan)
        data = []
        sql = '''
            SELECT
                f.name
            FROM 
                {0} f
            WHERE
                f.id in ({1})
        '''.format(tableName,','.join([str(i) for i in ids]))
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql)
        for item in result:
            data.append(item[0])
        return data

    @classmethod
    def get_faults_all_by_ids(cls, ids, lan):
        tableName = TableHelper.get_fault_tablename(lan)
        data = []
        sql = '''
            SELECT
                *
            FROM 
                {0} f
            WHERE
                f.id in ({1})
        '''.format(tableName,','.join([str(i) for i in ids]))
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql)
        for item in result:
            data.append({
                'id': item[0],
                'name': item[1],
                'description': item[2],
                'suggestion': item[3],
                'grade': item[4],
                'faultType': item[5],
                'faultGroup': item[6],
                'runMode': item[7],
                'consequence': item[8],
                'chartTitle': item[9],
                'lastModifyUser': item[10],
                'lastModifyTime': item[11],
                'maintainable': item[12],
                'className': item[13],
                'isPublic': item[14],
                'engineRuleName': item[15]
            })
        return data

