import json
import re
import os
import base64
from datetime import datetime, timedelta
import requests
from beopWeb import app
from beopWeb.BEOPDataAccess import BEOPDataAccess
from beopWeb.mod_diagnosis.service import TableHelper
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_diagnosis.task_service import DiagnosisTask
from beopWeb.mod_diagnosis.service import DiagnosisService
from beopWeb.observer import do_startWorkspaceDataGenHistogram
from beopWeb.mod_common.echart.Echart import generate_echart_to_disk


class NoAutoWorkflowConfig(Exception):
    def __init__(self):
        self.code = 'ERROR_NO_AUTO_WORKFLOW_CONFIG'
        self.msg = 'No auto workflow config'


class WorkflowConfigFormatError(Exception):
    def __init__(self):
        self.code = 'ERROR_WORKFLOW_CONFIG_FORMAT_ERROR' 


class CanNotFindLang(Exception):
    def __init__(self):
        self.code = 'ERROR_CAN_NOT_FIND_LANG' 


class CanNotSendDataToWorkflowAPI(Exception):
    def __init__(self):
        self.code = 'ERROR_CAN_NOT_SEND_DATA_TO_WORKFLOW_API' 

class CanNotGetWorkOrderImage(Exception):
    def __init__(self):
        self.code = 'ERROR_CAN_NOT_GET_WORKORDER_IMAGE' 


class AutoWorkflow:
    AUTOWORKFLOW_CONFIG_VP_NAME = 'TaskAutoGenConfig'
    OPERATOR_ID = 2 # beop, for add task
    CHART_TIME_DELTA = timedelta(hours=1)
    DUE_DATE_DELTA = timedelta(days=2)
    
    def __init__(self, project_id, notice_id_list):
        self.project_id = project_id
        self.notice_id_list = notice_id_list
        self.mysql_container = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly
        self.lang = self.get_project_lang() # project language
    
    def get_project_lang(self):
        query = '''
            SELECT MAX(IF(prop_name = 'defaultLanguage', prop_value, NULL)) AS language
                FROM project as p 
                LEFT OUTER JOIN project_properties AS pp ON p.id = pp.proj_id
                WHERE p.id = %s
        '''
        rv = self.mysql_container.op_db_query_one('beopdoengine', query, (self.project_id, ))
        try:
            lang = rv[0]
        except (IndexError, TypeError):
            raise CanNotFindLang
        return lang
    
    def get_config(self):
        config = BEOPDataAccess().get_realtime_data(self.project_id, [AutoWorkflow.AUTOWORKFLOW_CONFIG_VP_NAME])
        if not config or config[0]['value'] == 'Null':
            raise NoAutoWorkflowConfig
        configs = json.loads(config[0]['value'])
        return configs
    
    def get_data(self):
        mysql_container = self.mysql_container
        query = '''
            SELECT
                n.id,
                n.time,
                n.grade,
                f.name,
                ef.faultTag as sourceOfFault,
                f.consequence,
                e.location,
                e.name AS equipment,
                f.maintainable as serviceAbillty,
                (SELECT COUNT(*) FROM {}
                    WHERE
                    (entityId, faultId) = (select entityId, faultId from {} where id in ({})))
                    AS frequency,
                f.id AS faultId,
                e.id AS entityId,
                e.className AS equipmentType,
                f.description,
                ef.points
            FROM
                {} n
                LEFT JOIN {} ef ON ef.entityId = n.entityId AND ef.faultId = n.faultId
                LEFT JOIN {} e ON e.id = n.entityId
                LEFT JOIN {} f ON f.id = n.faultId
            WHERE
                n.projectId = %s
                AND n.id IN ({})
        '''.format( 
            TableHelper.get_notice_tablename(self.project_id),
            TableHelper.get_notice_tablename(self.project_id),
            ','.join(['%s'] * len(self.notice_id_list)),
            TableHelper.get_notice_tablename(self.project_id),
            TableHelper.get_entity_fault_tablename(self.project_id, self.lang),
            TableHelper.get_entity_tablename(self.project_id, self.lang),
            TableHelper.get_fault_tablename(self.lang),
            ','.join(['%s'] * len(self.notice_id_list))
        )

        params = tuple(self.notice_id_list) + (self.project_id, ) + tuple(self.notice_id_list)
        data = mysql_container.op_db_query('diagnosis', query, params, dictionary=True)
        return data
    
    def parse_string(self, s):
        return s.replace("\\", "\\\\")
    
    def need_send(self, data, filters):
        try:
            for item in data:
                if not self.notice_id_list:
                    return
                for key, attr in filters.items():
                    if attr['type'] == 'regex':
                        r = re.search(self.parse_string(attr['value']), str(item.get(key)))
                        if not r or not r.group():
                            continue
                    elif attr['type'] == 'range':
                        v_list = attr['value'].split('|')
                        if len(v_list) != 2:
                            raise WorkflowConfigFormatError
                        if not (v_list[0] <= str(item.get(key)) <= v_list[1]):
                            continue
                    self.notice_id_list.remove(item['id'])
                    yield item
            return
        except KeyError:
            raise WorkflowConfigFormatError
            
    def get_user_info(self, username):
        mysql_container = self.mysql_container
        image_path_prefix = Utils.IMG_SERVER_DOMAIN
        query_userinfo = '''
            SELECT id, userfullname, useremail, CONCAT("{}", userpic) AS userpic FROM user
            WHERE username = %s
        '''.format(image_path_prefix)
        userinfo = mysql_container.op_db_query_one('beopdoengine', query_userinfo, (username, ), dictionary=True)
        return userinfo
    
    def get_image_data(self, notice_id, chart_data):
        data = None
        try:
            name_description_mapping = { point.split(',')[0]: point.split(',')[1] for point in chart_data.get('chartPointList').split('|') }
            histogram_payload = {
                "dsItemIds": [ '@'+str(self.project_id)+'|'+point for point in name_description_mapping.keys() ],
                "timeStart": chart_data.get('chartStartTime'),
                "timeEnd": chart_data.get('chartEndTime'),
                "timeFormat": chart_data.get('chartQueryCircle')
            }
            histogram_data = json.loads(do_startWorkspaceDataGenHistogram(histogram_payload))
            series_list = []

            for name, description in name_description_mapping.items():
                for item in histogram_data['list']:
                    if item['dsItemId'].split('|')[1] == name:
                        series_list.append({
                            'name': name,
                            'type': 'line',
                            'data': item['data'],
                        })
                        break
                else:
                    raise CanNotGetWorkOrderImage
        
            data = {
                'xAxis': {'data': histogram_data['timeShaft']},
                'yAxis': {},
                'series': series_list,
            }
        except:
            raise CanNotGetWorkOrderImage
        return data

    def parse_b_string(self, s):
        return "data:image/png;base64," + str(s.decode('utf8'))

    def get_image(self, notice_id, chart_data):
        data = self.get_image_data(notice_id, chart_data)
        path = generate_echart_to_disk(data)
        with open(path, 'rb') as image:
            b_string = base64.b64encode(image.read())
        image_data = self.parse_b_string(b_string)
        os.remove(path)
        return image_data

    def get_user_id_list_by_name_list(self, name_list):
        sql = '''
            SELECT id FROM user WHERE username IN ({})
        '''.format(','.join(['%s'] * len(name_list)))
        user_id_list = list(self.mysql_container.op_db_query('beopdoengine', sql, name_list))
        user_id_list = [ user_id[0] for user_id in user_id_list]
        return user_id_list
            
    def parse_workflow_data(self, group, item):
        due_date = datetime.now() + AutoWorkflow.DUE_DATE_DELTA
        chart_data = {
            'projectId': self.project_id,
            'chartEndTime': (item.get('time') + AutoWorkflow.CHART_TIME_DELTA).strftime('%Y-%m-%d %H:%M:%S'),
            'chartPointList': item.get('points'),
            'chartQueryCircle': 'm5',
            'chartStartTime': (item.get('time') - AutoWorkflow.CHART_TIME_DELTA).strftime('%Y-%m-%d %H:%M:%S')
        }
        workflow_data = {
            'attachment': [],
            'taskGroupId': group.get('groupId'),
            'fields': {
                'charts': chart_data,
                'critical': str(item.get('grade')),
                'detail': 'Equipment: {}\n'\
                          'Name: {}\n'\
                          'Description: {}\n'\
                          'Time: {}\n'.format(
                                        item.get('equipment'),
                                        item.get('name'),
                                        item.get('description'),
                                        str(item.get('time')),
                                    ),
                'diagnosisEquipmentName': item.get('equipment'),
                'diagnosisZone': item.get('location'),
                'dueDate': due_date.strftime('%Y-%m-%d'),
                'noticeId': item.get('id'),
                'pendingFiles': [],
                'title': item.get('name'),
                'type': 5,
            },
            'processMember': {
                "0": [ self.get_user_info(group.get('executor')) ],
                "1": [ self.get_user_info(uid) for uid in group.get('verifier') ],
            },
            'image': self.get_image(item.get('id'), chart_data),
            'userId': 2,
            'watchers': self.get_user_id_list_by_name_list(group.get('cc'))
        }
        return workflow_data

    def send_data(self, data):
        headers = {
            'content-type': 'application/json',
            'token': app.config.get('TOKEN_WHITE_LIST')[0]
        }
        # sb code
        url = 'http://127.0.0.1/workflow/task/save/'
        try:
            r = requests.post(url, headers=headers, data=json.dumps(data), timeout=600)
        except:
            raise CanNotSendDataToWorkflowAPI        
            
    def add_task(self, item):
        data = [{
            'entityId': item.get('entityId'),
            'faultId': item.get('faultId'),
            'noticeId': item.get('id'),
        }]
        DiagnosisTask.add_tasks(self.project_id, AutoWorkflow.OPERATOR_ID, data, self.lang)
        
    def send_workflow(self):
        configs = self.get_config()
        for config in configs:
            data = self.get_data()
            if config.get('filter'):
                for item in self.need_send(data, config['filter']):
                    self.add_task(item)
                    workflow_data = self.parse_workflow_data(config.get('group'), item)
                    self.send_data(workflow_data)
            else:
                raise WorkflowConfigFormatError