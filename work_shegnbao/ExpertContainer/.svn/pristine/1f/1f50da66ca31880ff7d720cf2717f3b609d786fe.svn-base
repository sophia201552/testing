import json
import requests
from ExpertContainer import app
from flask import session
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from ExpertContainer.dbAccess.RedisManager import RedisManager
from urllib.parse import urlencode


class RequestCenter:
    cross_cluster_config = {
        'cross_cluster_read': [
            # 'onlineTestCloudPoint',         # /cloudPoint/onlinetest
            # 'onlineTestCloudPoint_batch',   # /cloudPoint/onlinetest/batch
            'repairDataBatch',              # /repairData/batch
            'repairDataStatus',             # /repairData/status/<projId>
        ],
    }

    @staticmethod
    def get_cluster_by_proj_id_list(proj_id_list):
        rt = {}
        cluster_proj_map = RedisManager.get_project_cluster_map()
        if not cluster_proj_map:
            BEOPDataAccess.getInstance().update_project_cluster_map()
            cluster_proj_map = RedisManager.get_project_cluster_map()
        if proj_id_list and len(proj_id_list) > 0:
            for proj_id in proj_id_list:
                if cluster_proj_map.get(str(proj_id)):
                    rt[str(proj_id)] = cluster_proj_map.get(str(proj_id))
        else:
            rt = cluster_proj_map
        return rt

    @staticmethod
    def get_cluster_by_proj_id(proj_id):
        rt = {}
        clusterProjMap = RedisManager.get_project_cluster_map()
        if not clusterProjMap:
            BEOPDataAccess.getInstance().update_project_cluster_map()
            clusterProjMap = RedisManager.get_project_cluster_map()
        if proj_id:
            if clusterProjMap.get(str(proj_id)):
                rt = clusterProjMap.get(str(proj_id))
        return rt

    @staticmethod
    def get_endpoint_cross_cluster_type(endpoint):
        """ 与列表比对，判断是否需要跳转 """
        for cross_cluster_type in RequestCenter.cross_cluster_config:
            if endpoint in RequestCenter.cross_cluster_config[cross_cluster_type]:
                return cross_cluster_type
        return None

    @staticmethod
    def designate_request(req):
        """ 根据接口跳转到对应服务 return: redirected, result """
        if not req:
            return False, None
        try:
            if 'x-beop-designated' in req.headers:
                return False, None
            current_cluster_name = app.config.get('BEOPCLUSTER')
            cross_cluster_type = RequestCenter.get_endpoint_cross_cluster_type(req.endpoint)
            if cross_cluster_type == 'cross_cluster_read':
                app.logger.debug("Request endpoint %s hits cross_cluster_read list." % req.endpoint)
                proj_id = req.form.get('projId')
                if proj_id is None and req.form is not None:
                    proj_id = req.form.get('projectId')
                if proj_id is None and req.form is not None:
                    proj_id = req.form.get('proj_id')
                if proj_id is None and req.json is not None:
                    proj_id = req.json.get('projId')
                if proj_id is None and req.view_args is not None:
                    proj_id = req.view_args.get('projId')
                if proj_id is None:
                    app.logger.error("Failed to designate request for %s because of lack of project ID in request!",
                                     req.endpoint)
                    return False, None
                cluster_info = RequestCenter.get_cluster_by_proj_id(proj_id)
                project_cluster_name = cluster_info.get('clusterName')
                if project_cluster_name == current_cluster_name:
                    app.logger.debug("Project cluster name is the same as current cluster name: %s",
                                     current_cluster_name)
                    return False, None
                url = "http://%s%s" % (app.config.get('EXPERT_CONTAINER_URL').get(project_cluster_name), req.path)
                app.logger.debug(
                    "Project cluster name = %s, current cluster name = %s. Request endpoint %s is redirected to %s",
                    project_cluster_name, current_cluster_name, req.endpoint, url)
                rt = RequestCenter.post_request(req, url)
                return True, rt.text
        except Exception:
            app.logger.error("Failed to designate request %s!", req.endpoint, exc_info=True, stack_info=True)

        return False, None

    @staticmethod
    def post_request(req, url):
        if req.method == 'POST':
            headers = {'content-type': req.content_type, 'x-beop-designated': 'yes'}
            if req.json:
                rt = requests.post(url, data=json.dumps(req.json), headers=headers, timeout=600, cookies=req.cookies)
            if req.form:
                headers['content-type'] = "application/x-www-form-urlencoded"
                payload = urlencode(req.form)
                rt = requests.post(url, data=payload, headers=headers, timeout=600, cookies=req.cookies)
        elif req.method == 'GET':
            headers = {'x-beop-designated': 'yes'}
            rt = requests.get(url, headers=headers, timeout=600, cookies=req.cookies)
        return rt
