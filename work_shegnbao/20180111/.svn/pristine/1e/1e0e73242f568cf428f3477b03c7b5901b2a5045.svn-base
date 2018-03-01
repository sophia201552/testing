''' 新版诊断 entity_fault 服务层 '''
from mysql.connector.conversion import MySQLConverter
from beopWeb.BEOPDataAccess import BEOPDataAccess

from .service import TableHelper

DB_NAME = 'diagnosis'

class DiagnosisEntityFaultService:
    ''' 新版诊断 entity_fault 服务层 '''

    @classmethod
    def get_entity_fault_by_strategyid(cls, strategy_id):
        sql = '''
            SELECT
                ef.entityId,
                ef.faultId
            FROM
                {0} ef
            WHERE
                ef.strategyId = %s
        '''.format(
                TableHelper.get_entity_fault_tablename()
            )
        result = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly.\
            op_db_query(DB_NAME, sql, (strategy_id,))
        data = []
        for item in result:
            data.append({
                'entityId': item[0],
                'faultId': item[1]
            })
        return data

    @classmethod
    def delete_entity_fault_by_ids(cls, entity_fault_ids=[]):
        deleted_len = len(entity_fault_ids)

        sql = '''
            DELETE FROM {0}
            WHERE CONCAT(entityId, ',', faultId) IN (\'{1}\')
            LIMIT {2}
        '''.format(
            TableHelper.get_entity_fault_tablename(),
            '\',\''.join(['%s,%s' % tuple(x) for x in entity_fault_ids]),
            deleted_len
        )
        result = BEOPDataAccess.getInstance()._mysqlDBContainer.\
            op_db_update(DB_NAME, sql)
        return result

    @classmethod
    def sync_entity_fault_table(cls, data):
        insert_data = []

        for item in data:
            item['points'] = item.get('points')
            item['customTag'] = ','.join(item.get('customTag'))
            item['targetGroup'] = '' if item.get('targetGroup') is None else item.get('targetGroup')
            item['targetExecutor'] = -1 if item.get('targetExecutor') is None else item.get('targetExecutor')
            item['faultTag'] = 0 if item.get('faultTag') is None else item.get('faultTag')
            insert_data.append(
                "({entityId}, {faultId}, '{strategyId}', {projectId}, '{points}', {userId}, \
                '{targetGroup}', '{targetExecutor}', {runTimeDay}, {runTimeWeek}, {runTimeMonth}, \
                {runTimeYear}, '{unit}', '{axisName}', '{axisSet}', {faultTag}, '{customTag}')".format(**item)
            )

        sql = '''
            INSERT INTO {0} (
                entityId,
                faultId,
                strategyId,
                projectId,
                points,
                userId,
                targetGroup,
                targetExecutor,
                runDay,
                runWeek,
                runMonth,
                runYear,
                unit,
                axisName,
                axisSet,
                faultTag,
                customTag
            )
            VALUES
                {1}
            ON DUPLICATE KEY UPDATE
                strategyId = VALUES(strategyId),
                projectId = VALUES(projectId),
                points = VALUES(points),
                userId = VALUES(userId),
                targetGroup = VALUES(targetGroup),
                targetExecutor = VALUES(targetExecutor),
                runDay = VALUES(runDay),
                runWeek = VALUES(runWeek),
                runMonth = VALUES(runMonth),
                runYear = VALUES(runYear),
                unit = VALUES(unit),
                axisName = VALUES(axisName),
                axisSet = VALUES(axisSet),
                faultTag = VALUES(faultTag),
                customTag = VALUES(customTag)
        '''.format(
            TableHelper.get_entity_fault_tablename(),
            ','.join(insert_data)
        )

        result = BEOPDataAccess.getInstance()._mysqlDBContainer.\
            op_db_update(DB_NAME, sql)
        
        return result
