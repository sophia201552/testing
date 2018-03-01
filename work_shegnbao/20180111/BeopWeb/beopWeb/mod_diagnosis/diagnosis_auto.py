from datetime import datetime

from beopWeb.mod_admin import Project
from beopWeb.mod_diagnosis.service import TableHelper
from beopWeb.BEOPDataAccess import BEOPDataAccess
from beopWeb.mod_diagnosis.task_service import DiagnosisTask


class DiagnosisAuto:
    @staticmethod
    def get_diagnosis_prediction(project_id):
        data = {}
        rv = Project().get_project_properties(project_id, includeSystemProps=True)
        if 'diagnosisPrediction' in rv and rv['diagnosisPrediction'] == 'True':
            data['diagnosisPrediction'] = True
        else:
            data['diagnosisPrediction'] = False
        return data

    @staticmethod
    def set_diagnosis_prediction(project_id, diagnosis_prediction):
        Project().set_project_properties(project_id, {'diagnosisPrediction': diagnosis_prediction})
        return

    @staticmethod
    def get_notice_latest_time(project_id, start_time, end_time):
        notice_table_name = TableHelper.get_notice_tablename(project_id)
        container = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly
        find_notice_time= '''
            SELECT MAX(id) AS id, entityId, faultId, MAX(time) AS latestTime FROM {}
                WHERE time >= %s AND time < %s  GROUP BY entityId, faultId
        '''.format(notice_table_name)
        rv = container.op_db_query('diagnosis', find_notice_time, (start_time, end_time))
        data = []
        for item in rv:
            data.append({
                'noticeId': item[0],
                'entityId': item[1],
                'faultId': item[2],
                'latestTime': item[3] if not item[3] else item[3].strftime('%Y-%m-%d %H:%M:%S'),
            })
        return data

    @staticmethod
    def auto_tasks(project_id, lang, operator_id, data):
        duplicated = DiagnosisTask.add_tasks(project_id, operator_id, data, lang, status=10)
        task_id_list = DiagnosisTask.get_task_id_by_notice_id(project_id, duplicated['duplicated_id'])
        update_data = {
            'operatorId': operator_id,
            'data': {
                'status': 10,
            }
        }
        for task_id in task_id_list:
            DiagnosisTask.update_task(task_id, update_data)
        return

    @staticmethod
    def get_diagnosis_recovery_detail(start_time, end_time, project_id, lang):
        notice_table_name = TableHelper.get_notice_tablename(project_id)
        fault_table_name = TableHelper.get_fault_tablename(lang=lang)
        find_notice = '''
            SELECT n.id as noticeId, n.entityId, n.faultId, n.time, n.energy, n.endTime, t.status, o.operatorId,
                   ef.points, ef.runDay, ef.runWeek, ef.runMonth, ef.runYear, f.name as faultName, f.description as faultDesc,
                   e.name as entityName, e.location as zone FROM {} n
                LEFT JOIN diagnosis_task t ON t.projectId = n.projectId and t.noticeId = n.id
                LEFT JOIN diagnosis_task_operation o ON o.taskId = t.id
                LEFT JOIN {} f ON f.id = n.faultId
                LEFT JOIN diagnosis_entity e ON n.entityId = e.id
                LEFT JOIN diagnosis_entity_fault ef ON ef.entityId = e.id and ef.faultId = f.id
            WHERE n.time >= %s and n.time < %s
        '''.format(notice_table_name, fault_table_name)
        container = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly
        rv = container.op_db_query('diagnosis', find_notice, (start_time, end_time), dictionary=True)
        fault_groups = {}
        for row in rv:
            if row['status'] == 10 and row['operatorId'] == 2:
                recoverd = True
            else:
                recoverd = False
            if fault_groups.get((recoverd, row['faultId'])) is None:
                fault_groups[(recoverd, row['faultId'])] = []
            fault_groups[(recoverd, row['faultId'])].append(row)

        recoverd_fault_list = []
        active_fault_list = []
        for key, groups in fault_groups.items():
            energy = {
                'runDay': 0,
                'runWeek': 0,
                'runMonth': 0,
                'runYear': 0,
                'runActive': 0
            }
            entity = []

            for group in groups:
                if group['energy']:
                    energy['runDay'] += (group['runDay'] * group['energy'])
                    energy['runWeek'] += (group['runWeek'] * group['energy'])
                    energy['runMonth'] += (group['runMonth'] * group['energy'])
                    energy['runYear'] += (group['runYear'] * group['energy'])
                    energy['runActive'] += ((end_time - start_time).seconds // 3600 * group['energy'])
                entity.append({
                    'id': group['entityId'],
                    'name': group['entityName'],
                    'zone': group['zone'],
                    'points': group['points'],
                    'time': group['time'] if not group['time'] else group['time'].strftime('%Y-%m-%d %H:%M:%S'),
                    'endTime': group['endTime'] if not group['endTime'] else group['endTime'].strftime('%Y-%m-%d %H:%M:%S'),
                    'noticeId': group['noticeId']
                })
            
            item = {
                'energy': energy,
                'count': len(groups),
                'faultName': groups[0]['faultName'],
                'faultId': groups[0]['faultId'],
                'faultDesc': groups[0]['faultDesc'],
                'entity': entity
            }
            recoverd = key[0]
            if recoverd:
                recoverd_fault_list.append(item)
            else:
                active_fault_list.append(item)

        return {
            'recoveredFaults': recoverd_fault_list,
            'activeFaults': active_fault_list
        }

    def get_diagnosis_detail(start_time, end_time, project_id, lang):
        notice_table_name = TableHelper.get_notice_tablename(project_id)
        fault_table_name = TableHelper.get_fault_tablename(lang=lang)
        find_notice = '''
            SELECT n.id as noticeId, n.entityId, n.faultId, n.time, n.energy, n.endTime,
                   ef.points, ef.runDay, ef.runWeek, ef.runMonth, ef.runYear, f.name as faultName, f.description as faultDesc,
                   e.name as entityName, e.location as zone FROM {} n
                LEFT JOIN diagnosis_task t ON t.projectId = n.projectId and t.noticeId = n.id
                LEFT JOIN diagnosis_task_operation o ON o.taskId = t.id
                LEFT JOIN {} f ON f.id = n.faultId
                LEFT JOIN diagnosis_entity e ON n.entityId = e.id
                LEFT JOIN diagnosis_entity_fault ef ON ef.entityId = e.id and ef.faultId = f.id
            WHERE n.time >= %s and n.time <= %s
        '''.format(notice_table_name, fault_table_name)
        container = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly
        rv = container.op_db_query('diagnosis', find_notice, (start_time, end_time), dictionary=True)
        fault_groups = {}
        for row in rv:
            if fault_groups.get(row['faultId']) is None:
                fault_groups[row['faultId']] = []
            fault_groups[row['faultId']].append(row)

        fault_list = []
        for groups in fault_groups.values():
            energy = {
                'runDay': 0,
                'runWeek': 0,
                'runMonth': 0,
                'runYear': 0,
                'runActive': 0
            }
            entity = []

            for group in groups:
                if group['energy']:
                    energy['runDay'] += (group['runDay'] * group['energy'])
                    energy['runWeek'] += (group['runWeek'] * group['energy'])
                    energy['runMonth'] += (group['runMonth'] * group['energy'])
                    energy['runYear'] += (group['runYear'] * group['energy'])
                    if not group['endTime']:
                        continue
                    energy['runActive'] += ((group['endTime'] - group['time']).seconds / 3600 * group['energy'])
                entity.append({
                    'id': group['entityId'],
                    'name': group['entityName'],
                    'zone': group['zone'],
                    'points': group['points'],
                    'time': group['time'] if not group['time'] else group['time'].strftime('%Y-%m-%d %H:%M:%S'),
                    'endTime': group['endTime'] if not group['endTime'] else group['endTime'].strftime('%Y-%m-%d %H:%M:%S'),
                    'noticeId': group['noticeId']
                })
            
            item = {
                'energy': energy,
                'count': len(groups),
                'faultName': groups[0]['faultName'],
                'faultId': groups[0]['faultId'],
                'faultDesc': groups[0]['faultDesc'],
                'entity': entity
            }
            fault_list.append(item)

        return fault_list


        