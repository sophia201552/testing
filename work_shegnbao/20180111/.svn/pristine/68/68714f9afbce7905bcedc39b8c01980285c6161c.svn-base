''' 处理算法服务器更新 '''
from concurrent.futures import ThreadPoolExecutor
import json
import requests

CALC_REMOTE_URL = 'http://121.40.140.32:5123'  #'http://192.168.1.32:5123'

class Updater(object):
    ''' 算法服务器更新器 '''
    def __init__(self, max_workers=20, timeout=350):
        self.excutor = ThreadPoolExecutor(max_workers=max_workers)
        self.timeout = timeout

    def request_async(self, *args, **kwargs):
        ''' 异步发送请求 '''
        self.excutor.submit(requests.post, *args, **kwargs)

    def update_diagnosis_strategy(self, proj_id, data):
        ''' 策略变动，通知算法服务器更新 '''
        headers = {'content-type': 'application/json'}
        self.request_async(CALC_REMOTE_URL+'/diagnosis/update/strategy/'+str(proj_id),
                           json.dumps(data), headers=headers, timeout=300)

    def update_diagnosis_project(self, proj_id):
        ''' 项目变动，通知算法服务器更新 '''
        headers = {'content-type': 'application/json'}
        self.request_async(CALC_REMOTE_URL+'/diagnosis/update/project/'+str(proj_id),
                           headers=headers, timeout=300)

    def update_diagnosis_config(self, data):
        ''' 项目配置变动 '''
        headers = {'content-type': 'application/json'}
        self.request_async(CALC_REMOTE_URL+'/diagnosis/update/config',
                           json.dumps(data), headers=headers, timeout=300)

    def update_diagtable(self, data):
        ''' 通知算法服务器，更新诊断表 '''
        update_result = None
        create_result = None
        proj_id = data.get("projId")
        headers = {'content-type': 'application/json'}
        try:
            # 创建项目的诊断表
            update_res = requests.post(CALC_REMOTE_URL + '/diagnosis/create/diagtable/' + \
                str(proj_id), headers=headers, timeout=300)
            if update_res.status_code == 200:
                update_result = update_res.text
                # 更新策略对应的诊断表
                create_res = requests.post(CALC_REMOTE_URL + '/diagnosis/update/diagtable',
                                           json.dumps(data), headers=headers, timeout=300)
                if create_res.status_code == 200:
                    create_result = create_res.text
        except Exception as expt:
            print('Error in method "update_diagtable": ' + expt.__str__())
        return update_result, create_result

    def update_fault_table(self, data):
        ''' 通知算法服务器，更新 fault 表 '''
        update_result = None
        headers = {'content-type': 'application/json'}
        try:
            update_res = requests.post(CALC_REMOTE_URL + '/diagnosis/update/diagtable',
                                       json.dumps(data), headers=headers, timeout=300)
            if update_res.status_code == 200:
                update_result = update_res.text
        except Exception as expt:
            print('Error in method "update_fault_table": ' + expt.__str__())
        return update_result
