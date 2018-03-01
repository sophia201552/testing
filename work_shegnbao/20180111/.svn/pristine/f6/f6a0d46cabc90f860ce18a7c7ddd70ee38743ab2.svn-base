import json
import requests
import logging
import flask
from beopWeb import app
from beopWeb.BEOPDataAccess import BEOPDataAccess
from beopWeb.mod_memcache.RedisManager import RedisManager

class RequestCenter:
    cross_cluster_config = {
        'cross_cluster_read': {
            # disable to make Miami project faster
            # 'admin.data_point_manager_search',
            # 'dashboard_get_weather',
            # 'startWorkspaceDataGenHistogramMulti',
            # 'startWorkspaceDataGenPieChart': {'fallback': True},
            # 'startWorkspaceDataGenHistogram',
            # 'startWorkspaceDataGenPattern',
            # 'startWorkspaceDataGenHistogramIncrement',
            # 'startWorkspaceDataGenHistogramIncrement_v2',
            # 'startWorkspaceDataGenHistogramIncrement',

            # 'temp.getRealtimeData',
            # disable to make Miami project faster
            # 'pointTool.pt_get_cloud_point_table',
            # POST json: /point_tool/addCloudPoint/<project_id>/
            'pointTool.pt_add_cloud_point': {'fallback': False},
            # POST json: /point_tool/editCloudPoint/<project_id>/
            'pointTool.pt_edit_cloud_point': {'fallback': False},
            # POST json: /point_tool/deleteCloudPoint/<project_id>/
            'pointTool.pt_delete_cloud_point': {'fallback': False},
            # POST json: /get_realtimedata { proj: <projId> }
            'get_realtimedata': {'fallback': False},
            # POST json: /v1/data/get_realtime { proj: <projId> }
            'get_realtime_api': {'fallback': False},
            # 'set_realtimedata_from_site',
            # 'get_history_data_raw',
            # 'get_history_data_at_moment',
            # 'get_history_data',
            # 'get_history_data_padded',
            # 'get_history_data_padded_reduce',
            # 'get_history_data',
            # 'updateDiagnosisFaultMulti111',     # diagnosis/notice/getTop5/<projId>

            # POST json: /project/status { projectId: <projid> }
            'get_project_dtu_status': {'fallback': False},
            # POST json: /diagnosis_v2/getNoticeLastTime/<int:project_id>
            'diagnosis.get_notice_last_time': {'fallback': True},
            # POST form: /terminal/project { projId: <projId> }
            'terminal.getprodata': {'fallback': False},
            # POST form: /modbus/project { projId: <projId> }
            'modbus.getprodata': {'fallback': False},
            # POST form: /terminal/obix/dtu/createDtu { projId: <projId> }
            'terminal.createDtu': {'fallback': False},
            # POST form: /modbus/dtu/createDtu { projId: <projId> }
            'modbus.createDtu': {'fallback': False},
            # POST form: /modbus/dtu/copy { dtuId: <dtuId> }
            'modbus.copyExistDtuToEmptyDtu': {'fallback': False},
            # POST json: /modbus/dtu/del { projId: <projId> }
            'modbus.deeleteDtuNode': {'fallback': False},
            # POST json: /modbus/project/dtu/status { projId: <projId> }
            'modbus.statusOfDtu': {'fallback': False},
            # POST json: /terminal/project/point/status { projId: <projId> }
            'terminal.statusOfPoint': {'fallback': False},
            # POST json: /modbus/obix/dtu/point/status { projId: <projId> }
            'modbus.statusOfPoint': {'fallback': False},
            # POST json: /terminal/dtu/addPoint { projId: <projId> }
            'terminal.manualImportNewPoint': {'fallback': False},
            # POST json: /modbus/obix/dtu/updatePoint { projId: <projId> }
            'modbus.manualImportNewPoint': {'fallback': False},
            # POST json: /terminal/obix/dtu/list { projId: <projId> }
            'terminal.getDtuPointDataList': {'fallback': False},
            # POST json: /modbus/dtu/list { projId: <projId> }
            'modbus.getDtuPointDataList': {'fallback': False},
            # GET /modbus/dtu/export/cloud/<projectId>/<dtuId>
            'modbus.exportPointDtu': {'fallback': False, 'client_redir': True},
            # GET /terminal/obixs/export/<projectId>/<dtuId>
            'terminal.exportObixPointDtu': {'fallback': False, 'client_redir': True},
            # POST json: /modbus/dtu/prefixName/update { projId: <projId> }
            'modbus.modfiyPrefixName': {'fallback': False},
            # POST json: /terminal/obixs/history { dtuId: <dtuId> }
            'terminal.dtuOperationHostory': {'fallback': False},
            # POST json: /modbus/history { dtuId: <dtuId> }
            'modbus.dtuOperationHostory': {'fallback': False},
            # POST json: /modbus/log { dtuId: <dtuId> }
            'modbus.getAllLog': {'fallback': False},
            # POST json: /terminal/obixs/points/import { dtuName: <dtuName> }
            'terminal.importModbusPointTable': {'fallback': False},
            # POST json: /modbus/points/import { dtuName: <dtuName> }
            'modbus.importModbusPointTable': {'fallback': False},
            # POST json: /terminal/obix/dtu/points/del { dtuId: <dtuId> }
            'terminal.deleteSelectedPoint': {'fallback': False},
            # POST json: /modbus/dtu/points/del { dtuId: <dtuId> }
            'modbus.deleteSelectedPoint': {'fallback': False},
            # POST json: /terminal/obixs/dtu/points/del/all { projId: <projId> }
            'terminal.deleteAllPoint': {'fallback': False},
            # POST json: /modbus/dtu/points/del/all { dtuId: <dtuId> }
            'modbus.deleteAllPoint': {'fallback': False},
            # POST json: /terminal/obix/dtu/autoSearch/getStatus { projId: <projId> }
            'terminal.getObixSearchStatus': {'fallback': False},
            # POST json: /terminal/obix/dtu/autoSearch/start { dtuId: <dtuId> }
            'terminal.startObixSearch': {'fallback': False},
            # POST json: /terminal/obixs/debug { projId: <projId> }
            'terminal.debugObixs': {'fallback': False},
            # POST json: /modbus/dtu/run { projId: <projId> }
            'modbus.dtuNodeRun': {'fallback': False},
            # POST json: /modbus/dtu/stop { projId: <projId> }
            'modbus.dtuNodeStop': {'fallback': False},
            # POST json: /terminal/get/dtu_info { dtuId: <dtuId> }
            'get_dtu_info': {'fallback': True},
            # POST json: /admin/checkDbName { dbName: <dbName>, clusterId: <clusterId> }
            'admin.check_project_mark_value': {'fallback': True},
            # POST json: /sitedata/clear {
            'clear_sitedata': {'fallback': True}
        }
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
    def get_cluster_by_id(id):
        dbrv = BEOPDataAccess.getInstance().get_cluster_config_by_id(id)
        cluster_info = {
            'id': dbrv[0][0],
            'clusterName': dbrv[0][1],
            'beopwebHttp': dbrv[0][2],
            'beopwebHttps': dbrv[0][3]
        }
        return cluster_info

    @staticmethod
    def get_endpoint_cross_cluster_type(endpoint):
        """ 与列表比对，判断是否需要跳转 """
        for cross_cluster_type in RequestCenter.cross_cluster_config:
            if endpoint in RequestCenter.cross_cluster_config[cross_cluster_type]:
                return cross_cluster_type, RequestCenter.cross_cluster_config[cross_cluster_type][endpoint]
        return None, None

    @staticmethod
    def _guess_field_value_from_request(req, field_name_aliases):
        for field_name in field_name_aliases:
            field_value = req.form.get(field_name)
            if field_value is None and req.form is not None:
                field_value = req.form.get(field_name)
            if field_value is None and req.view_args is not None:
                field_value = req.view_args.get(field_name)
            try:
                if field_value is None and (req.method == 'POST' or req.method == 'PUT'):
                    field_value = req.json.get(field_name)
            except Exception:
                logging.error('Failed to guess field value as JSON with name %s from request! Method=%s, Data=%s',
                              field_name, req.method, req.data)
            if field_value is not None:
                return field_value
        return None

    @staticmethod
    def _guess_proj_id_from_request(req):
        proj_id = RequestCenter._guess_field_value_from_request(
            req, ['proj', 'projId', 'proj_id', 'projectId', 'project_id'])
        return proj_id

    @staticmethod
    def _guess_dtu_id_from_request(req):
        dtu_id = RequestCenter._guess_field_value_from_request(req, ['dtuId'])
        return dtu_id

    @staticmethod
    def designate_request(req):
        """ return: redirected, result """
        if not req:
            return False, None
        try:
            if 'x-beop-designated' in req.headers:
                return False, None
            if req.endpoint == 'static':
                return False, None

            current_cluster_name = app.config.get('BEOPCLUSTER')
            cross_cluster_type, cross_cluster_options = RequestCenter.get_endpoint_cross_cluster_type(req.endpoint)
            if cross_cluster_type == 'cross_cluster_read':
                try:
                    logging.debug("Request endpoint %s hits cross_cluster_read list." % req.endpoint)
                    proj_id = RequestCenter._guess_proj_id_from_request(req)
                    if proj_id is not None:
                        cluster_info = RequestCenter.get_cluster_by_proj_id(proj_id)
                    else:
                        dtu_id = RequestCenter._guess_dtu_id_from_request(req)
                        if dtu_id is not None:
                            cluster_config_id = (dtu_id / 1000000) + 1
                            cluster_info = RequestCenter.get_cluster_by_id(cluster_config_id)
                        else:
                            cluster_info = None
                    if cluster_info is None:
                        raise Exception('Failed to find cluster info from request!')
                    project_cluster_name = cluster_info.get('clusterName')
                    beopwebHttp = cluster_info.get("beopwebHttp")
                    if project_cluster_name is None:
                        logging.debug('Project does not have a cluster config. Non-existing project?')
                        return False, None
                    if project_cluster_name == current_cluster_name:
                        logging.debug("Project cluster name is the same as current cluster name: %s",
                                      current_cluster_name)
                        return False, None
                    if not beopwebHttp:
                        raise Exception('not beopwebHttp')
                    url = "http://%s%s" % (beopwebHttp, req.path)
                    log_msg = \
                        "Project cluster name = %s, current cluster name = %s. " \
                        "Request endpoint %s is redirected to %s" % \
                        (project_cluster_name, current_cluster_name, req.endpoint, url)
                    if '_us' in project_cluster_name:
                        logging.info(log_msg)
                    else:
                        logging.debug(log_msg)

                    if cross_cluster_options.get('client_redir'):
                        response = flask.redirect(url)
                        return True, response

                    rt = RequestCenter.post_request(req, url)
                    return True, rt.text
                except Exception:
                    logging.error("Failed to designate request %s (%s) for %s!",
                                  req.endpoint, req.path, req.data, exc_info=True, stack_info=True)
                    if cross_cluster_options is not None and cross_cluster_options.get('fallback'):
                        return False, None
                    else:
                        return True, "{'success': false, 'code', -1:, msg: 'Failed to designate %s'}" % req.endpoint
            if req.endpoint == 'admin.check_project_mark_value':
                cluster_config = BEOPDataAccess.getInstance().get_all_enabled_cluster_config()
                rt = None
                for cluster_info in cluster_config:
                    try:
                        url = "http://%s%s" % (cluster_info[2], req.path)
                        logging.debug("Sending extra requests to %s", url)
                        response = RequestCenter.post_request(req, url)
                        response_json = json.loads(response.text)
                        if rt is None:
                            rt = response_json
                            if not rt.get("data"):
                                rt["data"] = dict(valid=False)
                        else:
                            if response_json.get("data") and response_json.get("data").get("valid"):
                                rt["data"] = response_json["data"]
                    except Exception:
                        logging.error("Failed to call %s to cluster %s!",
                                      req.endpoint, cluster_info[2], exc_info=True, stack_info=True)
                return True, json.dumps(rt)
            if req.endpoint == 'get_project_status':
                cluster_config = BEOPDataAccess.getInstance().get_all_enabled_cluster_config()
                rt = None
                for cluster_info in cluster_config:
                    try:
                        url = "http://%s%s" % (cluster_info[2], req.path)
                        logging.debug("Sending extra requests to %s", url)
                        response = RequestCenter.post_request(req, url)
                        response_json = json.loads(response.text)
                        if not response_json.get("data") or not response_json.get("data").get("projects"):
                            continue
                        if rt is None:
                            rt = response_json
                            continue
                        projects = response_json.get("data").get("projects")
                        for project in projects:
                            if len(project) > 1:
                                rt["data"]["projects"].append(project)
                    except Exception:
                        logging.error("Failed to call %s to cluster %s! Locals: %s",
                                      req.endpoint, cluster_info[2], locals(), exc_info=True, stack_info=True)
                return True, json.dumps(rt)
            if req.endpoint == 'get_list_dtu':
                cluster_config = BEOPDataAccess.getInstance().get_all_enabled_cluster_config()
                rt = None
                for cluster_info in cluster_config:
                    try:
                        handleFlag = None
                        temp_cluster_name = cluster_info[1]
                        url = "http://%s%s" % (cluster_info[2], req.path)
                        logging.debug("Sending extra requests to %s", url)
                        response = RequestCenter.post_request(req, url)
                        response_json = json.loads(response.text)
                        if not response_json.get("data") or len(response_json.get("data")) == 0:
                            continue
                        if rt is None:
                            rt = response_json
                            continue
                        rt["data"] += response_json.get("data")
                    except Exception:
                        logging.error("Failed to call %s to cluster %s! Locals: %s",
                                      req.endpoint, cluster_info[2], locals(), exc_info=True, stack_info=True)
                return True, json.dumps(rt)
        except Exception:
            logging.error("Failed to designate request %s for %s!",
                          req.endpoint, req.data, exc_info=True, stack_info=True)

        return False, None

    @staticmethod
    def post_request(req, url):
        secret_token = app.config.get('TOKEN_WHITE_LIST')[0]
        if req.method == 'POST':
            headers = {'content-type': req.content_type, 'token': secret_token, 'x-beop-designated': 'yes'}
            if req.json:
                rt = requests.post(url, data=json.dumps(req.json), headers=headers, timeout=600, cookies=req.cookies)
            elif req.form:
                form_data = {}
                for item in req.form:
                    form_data[item] = req.form[item]
                if req.files:
                    headers.pop('content-type')
                    file_data = {}
                    for item in req.files:
                        file = req.files[item]
                        file_data[file.name] = (file.filename, file.stream.read())
                    rt = requests.post(
                        url, data=form_data, files=file_data, headers=headers, timeout=600, cookies=req.cookies)
                else:
                    rt = requests.post(url, data=form_data, headers=headers, timeout=600, cookies=req.cookies)
            else:
                raise Exception("Cannot find post data from req! req.data: %s", req.data)
        elif req.method == 'GET':
            headers = {'token': secret_token, 'x-beop-designated': 'yes'}
            rt = requests.get(url, headers=headers, timeout=600, cookies=req.cookies)
        else:
            raise Exception('Unsupported method: %s', req.method)
        return rt


    @staticmethod
    def judgeProjectBelongCluster(rt, dtuInfoList, temp_cluster_name, handleFlag):
        try:
            projectIdList=[]
            for dtu in dtuInfoList:
                projectIdList.append(dtu.get("projectId"))
            cluster_info_dict = RequestCenter.get_cluster_by_proj_id_list(projectIdList)
            for dtu in dtuInfoList:
                projectId = dtu.get("projectId")
                if cluster_info_dict.get(str(projectId)) is not None:
                    project_cluster_name = cluster_info_dict[str(projectId)].get('clusterName')
                    if handleFlag is None and project_cluster_name != temp_cluster_name:
                        rt["data"].remove(dtu)
                    elif handleFlag is not None and project_cluster_name == temp_cluster_name:
                        dtu.pop("projectId")
                        rt["data"].append(dtu)
                    else:
                        pass
                else:
                    if handleFlag is None:
                        rt["data"].remove(dtu)
        except Exception as e:
            logging.error("ERROR:Failed to judge clusterName of project because of :%s" %(e.__str__()))
        return rt