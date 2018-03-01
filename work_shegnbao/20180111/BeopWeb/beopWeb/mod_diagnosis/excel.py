import os
from uuid import uuid4
from collections import OrderedDict
import pandas as pd
from pandas import ExcelWriter
from beopWeb.BEOPDataAccess import BEOPDataAccess
from beopWeb.mod_diagnosis.task_service import DiagnosisTask
from beopWeb.mod_diagnosis.service import DiagnosisService


class DiagnosisExcel:
    def __init__(self, projectId, startTime, endTime, entityIds, faultIds,
                 classNames, keywords, sort, lang, group=None):
        self.projectId = projectId
        self.startTime = startTime
        self.endTime = endTime
        self.entityIds = entityIds
        self.faultIds = faultIds
        self.classNames = classNames
        self.keywords = keywords
        self.sort = sort
        self.lang = lang
        self.group = group
        self.directory = '/tmp/' + str(uuid4()) if os.name != 'nt' else os.path.join(os.getcwd(), str(uuid4()))
        self.filename = 'output.xlsx'
        self.parse_dict = {
            'consequence': {
                'name': {
                    'en': 'consequence',
                    'zh': '后果'
                },
                'field': {
                    'Other': {
                        'en': 'OTHER',
                        'zh': '其他'
                    },
                    'Equipment Health': {
                        'en': 'EQUIPMENT_HEALTH',
                        'zh': '设备健康'
                    },
                    'Comfort issue': {
                        'en': 'COMFORT',
                        'zh': '舒适度'
                    },
                    'Energy waste': {
                        'en': 'ENERGY_WASTE',
                        'zh': '能耗浪费'
                    }
                }
            },
            'faultTag': {
                'name': {
                    'en': 'Source of fault',
                    'zh': '故障来源'
                },
                'field': {
                    0: {
                        'en': 'CLOUD',
                        'zh': 'CLOUD'
                    },
                    1: {
                        'en': 'LOCAL',
                        'zh': 'LOCAL'
                    }
                }
            },
            'grade': {
                'name': {
                    'en': 'Grade',
                    'zh': '等级'
                },
                'field': {
                    0: {
                        'en': 'Note',
                        'zh': '提示'
                    },
                    1: {
                        'en': 'Alert',
                        'zh': '异常'
                    },
                    2: {
                        'en': 'Fault',
                        'zh': '故障'
                    }
                }
            },
            'taskStatus': {
                'name': {
                    'en': 'Action status',
                    'zh': '处理状态'
                },
                'field': {
                    1: {
                        'en': 'To-do',
                        'zh': '待处理'
                    },
                    2: {
                        'en': 'WIP',
                        'zh': '处理中'
                    },
                    3: {
                        'en': 'Rescinded',
                        'zh': '已撤销'
                    },
                    4: {
                        'en': 'Solved',
                        'zh': '已处理'
                    },
                    5: {
                        'en': 'New',
                        'zh': '未加入任务'
                    },
                }
            },
            'description': {
                'name': {
                    'en': 'Name',
                    'zh': '故障'
                }
            },
            'time': {
                'name': {
                    'en': 'Time',
                    'zh': '时间'
                }
            },
            'entityParentName': {
                'name': {
                    'en': 'Location',
                    'zh': '区域'
                }
            },
            'entityName': {
                'name': {
                    'en': 'Equipment',
                    'zh': '设备'
                }
            },
            'maintainable': {
                'name': {
                    'en': 'ServiceAbility',
                    'zh': '处理建议'
                },
                'field': {
                    0: {
                        'en': 'Notes',
                        'zh': '建议记录'
                    },
                    1: {
                        'en': 'Action',
                        'zh': '建议处理'
                    },
                }
            },
            'frequency': {
                'name': {
                    'en': 'Frequency',
                    'zh': '频率／7日'
                }
            }
        }

    def _get_field_raw(self, entity_fault, field_name):
        v = entity_fault['list'][0][field_name]
        return v if v else ''

    def _get_field_parsed(self, entity_fault, field_name):
        d = self.parse_dict[field_name]['field'].get(
            entity_fault['list'][0][field_name])
        return d[self.lang] if d else ''

    def _get_field_name(self, field_name):
        return self.parse_dict[field_name]['name'][self.lang]

    def make_diagnosis_excel(self, data):
        i = 0
        p_data = OrderedDict()
        for entity_fault in data['data']:
            p_data[i] = OrderedDict([
                (self._get_field_name('time'),
                 self._get_field_raw(entity_fault, 'time')),
                (self._get_field_name('grade'),
                 self._get_field_parsed(entity_fault, 'grade')),
                (self._get_field_name('description'),
                 self._get_field_raw(entity_fault, 'description')),
                (self._get_field_name('faultTag'),
                 self._get_field_parsed(entity_fault, 'faultTag')),
                (self._get_field_name('consequence'),
                 self._get_field_parsed(entity_fault, 'consequence')),
                (self._get_field_name('entityParentName'),
                 self._get_field_raw(entity_fault, 'entityParentName')),
                (self._get_field_name('entityName'),
                 self._get_field_raw(entity_fault, 'entityName')),
                (self._get_field_name('taskStatus'),
                 self._get_field_parsed(entity_fault, 'taskStatus')),
                (self._get_field_name('taskStatus'),
                 self._get_field_parsed(entity_fault, 'taskStatus')),
                (self._get_field_name('maintainable'),
                 self._get_field_parsed(entity_fault, 'maintainable')),
                (self._get_field_name('frequency'),
                 len(entity_fault['list'])),
            ])
            i += 1
        df = pd.DataFrame(pd.DataFrame(p_data).T, columns=p_data[0].keys())
        writer = ExcelWriter(os.path.join(self.directory, self.filename))
        df.to_excel(writer, 'output')
        writer.save()

    def diagnosis_excel(self):
        os.mkdir(self.directory)
        data = DiagnosisService.get_entity_faults(
            self.projectId, 0, 0, self.startTime, self.endTime,
            self.entityIds, self.faultIds, self.classNames, self.keywords,
            self.sort, self.lang, self.group)
        self.make_diagnosis_excel(data)
        return self.directory, self.filename

class DiagnosisTaskExcel:
    def __init__(self, project_id, data):
        self.project_id = project_id
        self.data = data
        self.directory = '/tmp/' + str(uuid4()) if os.name != 'nt' else os.path.join(os.getcwd(), str(uuid4()))
        self.filename = 'output.xlsx'
        self.mysql_container = BEOPDataAccess.getInstance()._mysqlDBContainerReadOnly
        self.lang = self.get_project_lang() # project language
        self.parse_dict = {
            'faultTime': {
                'name': {
                    'en': 'Time',
                    'zh': '时间'
                },
            },
            'time': {
                'name': {
                    'en': 'Joining time',
                    'zh': '加入时间'
                },
            },
            'grade': {
                'name': {
                    'en': 'Grade',
                    'zh': '等级'
                },
                'field': {
                    0: {
                        'en': 'Note',
                        'zh': '提示'
                    },
                    1: {
                        'en': 'Alert',
                        'zh': '异常'
                    },
                    2: {
                        'en': 'Fault',
                        'zh': '故障'
                    }
                }
            },
            'priority': {
                'name': {
                    'en': 'Urgency',
                    'zh': '紧急程度'
                },
                'field': {
                    0: {
                        'en': 'Immediately',
                        'zh': '立刻'
                    },
                    1: {
                        'en': 'Urgent',
                        'zh': '紧急'
                    },
                    2: {
                        'en': 'High',
                        'zh': '高'
                    },
                    3: {
                        'en': 'Ordinary',
                        'zh': '普通'
                    },
                    4: {
                        'en': 'Low',
                        'zh': '低'
                    },
                }
            },
            'consequence': {
                'name': {
                    'en': 'consequence',
                    'zh': '后果'
                },
                'field': {
                    'Other': {
                        'en': 'Other',
                        'zh': '其他'
                    },
                    'Equipment Health': {
                        'en': 'Equipment Health',
                        'zh': '设备健康'
                    },
                    'Comfort': {
                        'en': 'Comfort',
                        'zh': '舒适度'
                    },
                    'Energy Waste': {
                        'en': 'Energy Waste',
                        'zh': '能耗浪费'
                    }
                }
            },
            'parentEntityName': {
                'name': {
                    'en': 'Location',
                    'zh': '区域'
                }
            },
            'entityName': {
                'name': {
                    'en': 'Equipment',
                    'zh': '设备'
                }
            },
            'faultName': {
                'name': {
                    'en': 'Name',
                    'zh': '故障'
                }
            },
            'status': {
                'name': {
                    'en': 'Action status',
                    'zh': '处理状态'
                },
                'field': {
                    1: {
                        'en': 'To-do',
                        'zh': '待处理'
                    },
                    2: {
                        'en': 'WIP',
                        'zh': '处理中'
                    },
                    3: {
                        'en': 'Rescinded',
                        'zh': '已撤销'
                    },
                    4: {
                        'en': 'Solved',
                        'zh': '已处理'
                    },
                    5: {
                        'en': 'New',
                        'zh': '未加入任务'
                    },
                }
            },
        }
    
    def get_project_lang(self):
        query = '''
            SELECT MAX(IF(prop_name = 'defaultLanguage', prop_value, NULL)) AS language
                FROM project as p 
                LEFT OUTER JOIN project_properties AS pp ON p.id = pp.proj_id
                WHERE p.id = %s
        '''
        rv = self.mysql_container.op_db_query_one('beopdoengine', query, (self.project_id, ))
        lang = rv[0]
        return lang

    def _get_field_parsed(self, entity_fault, field_name):
        d = self.parse_dict['grade']['field'].get(
            entity_fault['list'][0][field_name])
        return d[self.lang] if d else ''

    def _get_field_name(self, field_name):
        return self.parse_dict[field_name]['name'][self.lang]

    def make_diagnosis_excel(self, data):
        i = 0
        p_data = OrderedDict()
        for item in data['items']:
            p_data[i] = OrderedDict([
                (self._get_field_name('time'),
                 item.get('time')),
                (self._get_field_name('faultTime'),
                 item.get('faultTime')),
                (self._get_field_name('grade'),
                 item.get('grade')),
                (self._get_field_name('priority'),
                 item.get('priority')),
                (self._get_field_name('consequence'),
                 item.get('consequence')),
                (self._get_field_name('parentEntityName'),
                 item.get('parentEntityName')),
                (self._get_field_name('entityName'),
                 item.get('entityName')),
                (self._get_field_name('faultName'),
                 item.get('faultName')),
                (self._get_field_name('status'),
                 item.get('status')),
            ])
            i += 1
        df = pd.DataFrame(pd.DataFrame(p_data).T, columns=p_data[0].keys())
        writer = ExcelWriter(os.path.join(self.directory, self.filename))
        df.to_excel(writer, 'output')
        writer.save()

    def diagnosis_excel(self):
        os.mkdir(self.directory)
        data = DiagnosisTask.get_tasks(self.project_id, self.data)
        self.make_diagnosis_excel(data)
        return self.directory, self.filename