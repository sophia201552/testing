from datetime import datetime

from beopWeb import app
from beopWeb.mod_common.Utils import Utils
from beopWeb.BEOPDataAccess import BEOPDataAccess
from beopWeb.mod_diagnosis.service import TableHelper

class DiagnosisTask():
    @staticmethod
    def add_tasks(project_id, operator_id, data, lang, status=1):
        container = BEOPDataAccess.getInstance()._mysqlDBContainer
        insert_task = '''
            INSERT INTO diagnosis_task (entityId, faultId, noticeId, projectId, time, status, note) 
                    VALUES (%s, %s, %s, %s, NOW(), %s, (
                        SELECT concat(description, ' ', suggestion) FROM {} WHERE id = %s
                    ))
        '''.format(TableHelper.get_fault_tablename(lang))
        update_operation = """
            INSERT INTO diagnosis_task_operation
            (taskId, time, detail, operatorId)
            VALUES
            (LAST_INSERT_ID(), NOW(), %s, %s)
        """
        find_duplicated = """
            SELECT IF(status <> 3, 1, 0) FROM diagnosis_task WHERE projectId = %s AND noticeId = %s ORDER BY id
        """
        detail = str([{'to': 1, 'from': 0, 'type': 'CREATE'}])
        duplicated_notice_id_list = []
        for item in data:
            is_duplicated = container.op_db_query('diagnosis', find_duplicated, 
                                                      (project_id, item.get('noticeId')))
            if not is_duplicated or not is_duplicated[-1][0]:
                container.op_db_update('diagnosis', insert_task, (
                                    item.get('entityId'),
                                    item.get('faultId'),
                                    item.get('noticeId'),
                                    project_id,
                                    status,
                                    item.get('faultId'),
                ))
                container.op_db_update('diagnosis', update_operation, (
                                    detail,
                                    operator_id,
                ))
            else:
                duplicated_notice_id_list.append(item.get('noticeId'))
        return duplicated_notice_id_list

    @staticmethod
    def remove_tasks(project_id, task_id_list):
        container = BEOPDataAccess.getInstance()._mysqlDBContainer
        FIND_NOTICE_ID = """
            SELECT noticeId from diagnosis_task WHERE id = %s
        """
        DELETE_QUERY = """
            DELETE FROM diagnosis_task WHERE id = %s
        """
        notice_id_list = []
        for task_id in task_id_list:
            notice_id_list.append(container.op_db_query('diagnosis', FIND_NOTICE_ID, (task_id, ))[0][0])
            container.op_db_update('diagnosis', DELETE_QUERY, (task_id, ))
        
        GET_NOTICE_STATUS = """
            SELECT status from {} where id = %s
        """.format(TableHelper.get_notice_tablename(project_id))
        for notice_id in notice_id_list:
            status = container.op_db_query('diagnosis', GET_NOTICE_STATUS, (notice_id, ))[0][0]
            if status == 2:
                CHANGE_STATUS = """
                    UPDATE {} SET status = 1 where id = %s
                """.format(TableHelper.get_notice_tablename(project_id))
                container.op_db_update('diagnosis', CHANGE_STATUS, (notice_id, ))

    @staticmethod
    def get_tasks(project_id, data):
        def parse_range_string(s):
            return "'" + s + "'"
        container = BEOPDataAccess.getInstance()._mysqlDBContainer

        fault_table = TableHelper.get_fault_tablename(data.get('lang'))
        filter_data = data.get('filter')
        if filter_data:
            filter_list = []
            for f in data.get('filter'):
                if f.get('type', 'inlist') == 'inlist':
                    filter_list.append('t.' + f.get('key') + ' IN (' + ', '.join([ str(v) for v in f.get('value')]) + ')')
                elif f.get('type') == 'range':
                    filter_list.append('t.' + f.get('key') + ' BETWEEN ' + parse_range_string(f.get('value').split('|')[0])
                                                           + ' AND ' + parse_range_string(f.get('value').split('|')[1]))
            filter_str = 'AND ' + ' AND '.join(filter_list)
        else:
            filter_str = ''
        if data.get('sort'):
            order_str = 'ORDER BY ' + ', '.join( [ 't.' + x['key'] + ' ' + x['order'] for x in data.get('sort') ] )
        else:
            order_str = ''
        pageNum = data.get('pageNum')
        pageSize = data.get('pageSize')
        if pageNum and pageSize:
            limit_str = ' LIMIT {}, {}'.format((pageNum-1)*pageSize, pageSize)
        else:
            limit_str = ''
        FIND_TASK = """
            SELECT t.id, t.entityId, e.name, e.location, t.faultId, f.name, f.consequence,
            n.grade, t.time, t.endTime, t.workTaskId, t.priority, t.status, n.time
            FROM diagnosis_task t 
            INNER JOIN {} n ON t.noticeId = n.id 
            INNER JOIN diagnosis_entity e ON t.entityId = e.id
            INNER JOIN {} f ON t.faultId = f.id
            WHERE f.name like '%{}%' AND t.projectId = {} {}
            {}
            {}
        """.format(
            TableHelper.get_notice_tablename(project_id),
            fault_table,
            data.get('searchText', ''),
            project_id,
            filter_str,
            order_str,            
            limit_str
        )

        mysql_return = container.op_db_query('diagnosis', FIND_TASK)
        return_list = []
        for l in mysql_return:
            return_list.append(
                {
                    'id': l[0],
                    'entityId': l[1],
                    'entityName': l[2],
                    'parentEntityName': l[3] if l[3] else '-', #readmine 2947 location
                    'location': l[3] if l[3] else '-',
                    'faultId': l[4],
                    'faultName': l[5],
                    'consequence': l[6],
                    'grade': l[7],
                    'time': l[8] if not l[8] else l[8].strftime('%Y-%m-%d %H:%M:%S'),
                    'endTime': l[9] if not l[9] else l[9].strftime('%Y-%m-%d %H:%M:%S'),
                    'workTaskId': l[10],
                    'priority': l[11],
                    'status': l[12],
                    'faultTime': l[13] if not l[13] else l[13].strftime('%Y-%m-%d %H:%M:%S'),
                }
            )
        return_dict = {
            'total': len(mysql_return),
            'items': return_list
        }
        return return_dict

    @staticmethod
    def get_task_detail(task_id):
        container = BEOPDataAccess.getInstance()._mysqlDBContainer
        FIND_TASK = """
            SELECT id, noticeId, entityId, faultId, time, endTime, workTaskId, priority, status, note
            FROM diagnosis_task where id = %s
        """
        task_return = container.op_db_query_one('diagnosis', FIND_TASK, (task_id, ))
       
        task_data = {
            'id': task_return[0],
            'noticeId': task_return[1],
            'entityId': task_return[2],
            'faultId': task_return[3],
            'time': task_return[4] if not task_return[4] else task_return[4].strftime('%Y-%m-%d %H:%M:%S'),
            'endTime': task_return[5] if not task_return[5] else task_return[5].strftime('%Y-%m-%d %H:%M:%S'),
            'workTaskId': task_return[6],
            'priority': task_return[7],
            'status': task_return[8],
            'note': task_return[9],
            'operations':[]
        }
        FIND_OPERATIONS = """
            SELECT id, taskId, time, detail, operatorId, comment
            FROM diagnosis_task_operation where taskId = %s
        """
        operations = container.op_db_query('diagnosis', FIND_OPERATIONS, (task_id, ))

        FIND_OPERATOR = """
            SELECT username, userpic FROM user where id = %s
        """
        for op in operations:
            if op[4]:
                operator = container.op_db_query_one('beopdoengine', FIND_OPERATOR, (op[4], ))[0]
                avator = Utils.IMG_SERVER_DOMAIN + container.op_db_query_one('beopdoengine', FIND_OPERATOR, (op[4], ))[1]
            else:
                operator = None
                avator = None
            task_data['operations'].append({
                'id': op[0],
                'taskId': op[1],
                'time': op[2] if not op[2] else op[2].strftime('%Y-%m-%d %H:%M:%S'),
                'detail': op[3],
                'operator': operator,
                'avator': avator,
                'comment': op[5]
            })

        return task_data

    @staticmethod
    def update_task(task_id, data):
        container = BEOPDataAccess.getInstance()._mysqlDBContainer
        FIND_TASK = """
            SELECT note, priority, status, workTaskId, projectId, noticeId from diagnosis_task where id = %s
        """
        field_before = container.op_db_query_one('diagnosis', FIND_TASK, (task_id, ))
        if not field_before:
            app.logger.INFO('task id=', task_id, 'not found')

        detail = []
        UPDATE_TASK = """
            UPDATE diagnosis_task
            SET {}=%s
            WHERE id=%s
        """
        UPDATE_ENDTIME = """
            UPDATE diagnosis_task
            SET endtime=%s
            WHERE id=%s
        """
        project_id = field_before[4]
        notice_id = field_before[5]
        UPDATE_NOTICE = """
            UPDATE {}
            SET status=10
            where id=%s
        """.format(TableHelper.get_notice_tablename(project_id))
        for key, value in data.get('data').items():
            if key == 'note' and field_before[0] != value:
                detail.append({
                    'type': 'CHANGE_NOTE',
                    'from': field_before[0],
                    'to': value
                })
                container.op_db_update('diagnosis', UPDATE_TASK.format(key), (value, task_id))
            elif key == 'priority' and field_before[1] != value:
                detail.append({
                    'type': 'CHANGE_PRIORITY',
                    'from': field_before[1],
                    'to': value
                })
                container.op_db_update('diagnosis', UPDATE_TASK.format(key), (value, task_id))
            elif key == 'status' and field_before[2] != value:
                detail.append({
                    'type': 'CHANGE_STATUS',
                    'from': field_before[2],
                    'to': value
                })
                container.op_db_update('diagnosis', UPDATE_TASK.format(key), (value, task_id))
                if value == 10:
                    endtime = datetime.now()
                    container.op_db_update('diagnosis', UPDATE_ENDTIME, (endtime, task_id))
                    container.op_db_update('diagnosis', UPDATE_NOTICE, (notice_id, ))
            elif key == 'workTaskId' and field_before[3] != value:
                detail.append({
                    'type': 'CHANGE_WORKTASKID',
                    'from': field_before[3],
                    'to': value
                })
                container.op_db_update('diagnosis', UPDATE_TASK.format(key), (value, task_id))
        if not detail and not data.get('comment'):
            return False
        UPDATE_OPERATION = """
            INSERT INTO diagnosis_task_operation
            (taskId, time, detail, operatorId, comment)
            VALUES
            (%s, %s, %s, %s, %s)
        """
        operation_data = [
            task_id,
            datetime.now(),
            str(detail),
            data['operatorId'],
            data.get('comment')
        ]
        container.op_db_update('diagnosis', UPDATE_OPERATION, operation_data)
        return True

    @staticmethod
    def get_task_id_by_notice_id(project_id, notice_id_list):
        task_id_list = []
        container = BEOPDataAccess.getInstance()._mysqlDBContainer
        find_task_id = '''
            SELECT id from diagnosis_task WHERE noticeid = %s and projectId = %s
        '''
        for notice_id in notice_id_list:
            task_id = container.op_db_query_one('diagnosis', find_task_id, (notice_id, project_id))[0]
            task_id_list.append(task_id)
        return task_id_list
            
    @staticmethod
    def get_task_stats(projId, startTime=None, endTime=None):
        container = BEOPDataAccess.getInstance()._mysqlDBContainer

        # task count
        task_count_condition = ['projectId=%s']
        task_count_condition_list = [projId, ]
        if startTime:
            task_count_condition.append('time >= %s')
            task_count_condition_list.append(startTime)
        if endTime:
            task_count_condition.append('time <= %s')
            task_count_condition_list.append(endTime)
        task_count_where = ''
        if task_count_condition:
            task_count_where = ' WHERE ' + ' AND '.join(task_count_condition)
        query_task_count = '''
            SELECT COUNT(*) as taskCount FROM diagnosis_task {}
        '''.format(task_count_where)
        task_count = container.op_db_query_one('diagnosis', query_task_count, tuple(task_count_condition_list))[0]

        # task completed count
        task_completed_count_condition = task_count_condition[:] + ['status=10']
        task_completed_count_where = ''
        if task_completed_count_condition:
            task_completed_count_where = ' WHERE ' + ' AND '.join(task_completed_count_condition)
        query_task_completed_count = '''
            SELECT COUNT(*) as taskCount FROM diagnosis_task {}
        '''.format(task_completed_count_where)
        task_completed_count = container.op_db_query_one('diagnosis', query_task_completed_count, tuple(task_count_condition_list))[0]
        task_completed_rate = task_completed_count/task_count if task_count > 0 else None
        return {'taskCount': task_count,
                'taskCompleted': task_completed_count,
                'taskCompletedRate': task_completed_rate}
        