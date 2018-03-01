from flask import request, render_template, json, jsonify
from beopWeb.mod_admin import bp_admin
from beopWeb.mod_common.Utils import Utils
from .DataMananger import DataManager
from beopWeb.AuthManager import AuthManager
from beopWeb.mod_cxTool.PointTable import PointTable, PointTableSourceType, StorageSourceType
from beopWeb.mod_admin.RealTimeData import RealTimeData


@bp_admin.route('/dataManager/load/<user_id>/<project_id>', methods=['GET'])
def data_manager_load(user_id, project_id):
    if user_id is None or project_id is None:
        return Utils.beop_response_error()
    dm = DataManager()
    points = dm.get_saved_points(user_id, project_id, 'points')
    return Utils.beop_response_success(points)


@bp_admin.route('/dataPointManager/load/<project_id>', methods=['GET'])
def data_point_manager_load(project_id):
    user_id = request.cookies.get('userId', None)
    if not user_id:
        return Utils.beop_response_error()
    if project_id is None:
        return Utils.beop_response_error()
    dm = DataManager()
    points = dm.get_saved_points(user_id, project_id, 'points')
    return Utils.beop_response_success(points)


@bp_admin.route('/dataPointManager/loadData/<project_id>', methods=['GET'])
def data_point_manager_load_data(project_id):
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(msg='not login')
    if project_id is None:
        return Utils.beop_response_error()
    dm = DataManager()
    # 用户收藏的点
    saved_points = dm.get_saved_points(user_id, project_id, 'points')
    real_time_list = []
    if saved_points:
        point_list = list(set(saved_points['points'].split(',')))
        points = RealTimeData(project_id).get_all_data_map(point_list=point_list, storage_source=StorageSourceType.RAW)

        for point_name in point_list:
            if points.get(point_name):
                real_time_list.append({
                    'name': points.get(point_name).get('pointname'),
                    'time': points.get(point_name).get('time'),
                    'value': points.get(point_name).get('pointvalue')
                })

        # 获取实时点对应云点中的注释信息
        pt = PointTable(project_id)
        points_map = pt.get_some_points_map(PointTableSourceType.TYPE_ENGINE,
                                            [item.get('name') for item in real_time_list])
        for point in real_time_list:
            if points_map.get(point.get('name')) and points_map.get(point.get('name')).get('alias'):
                point['alias'] = points_map.get(point.get('name')).get('alias')

    result = {
        'list': real_time_list
    }
    return json.dumps(result, ensure_ascii=False)


@bp_admin.route('/dataManager/update/', methods=['POST'])
def data_manager_update():
    req_data = request.get_json()
    user_id = req_data.get('userId')
    project_id = req_data.get('projectId')
    points = req_data.get('points')
    points = ','.join(list(set(points.split(','))))
    if user_id is None or project_id is None:
        return Utils.beop_response_error()
    dm = DataManager()
    saved_points = dm.get_saved_points(user_id, project_id, 'points')
    if not saved_points:
        success = dm.insert_points(user_id, project_id, points)
    else:
        success = dm.update_points(user_id, project_id, points)

    if success:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


@bp_admin.route('/dataPointManager/search/', methods=['POST'])
def data_point_manager_search():
    req_data = request.get_json()
    result = {
        'total': 0,
        'list': []
    }
    if not req_data:
        return json.dumps(result, ensure_ascii=False)

    project_id = req_data.get('projectId')
    try:
        if project_id is not None:
            project_id = int(project_id)
    except:
        return json.dumps(result, ensure_ascii=False)

    search_text = req_data.get('text')

    is_advance = req_data.get('isAdvance')
    order = req_data.get('order')
    is_remark = req_data.get('isRemark')
    flag = req_data.get('flag')
    db_name = req_data.get('dbname')

    page_size = int(req_data.get('page_size'))
    start_num = (int(req_data.get('current_page')) - 1) * page_size

    rtd = None
    pt = None

    if project_id:
        pt = PointTable(project_id)

    if project_id is not None:
        rtd = RealTimeData(project_id)
    elif db_name is not None:
        rtd = RealTimeData(db_name=db_name)

    if not rtd:
        return Utils.beop_response_error('get real-time db failed.')

    if is_remark and search_text:  # 根据注释搜索,注释在云点中,先从云点中取到符合的点表
        pt_search_list, total_count = pt.search_point_in_remark(PointTableSourceType.TYPE_CLOUD, search_text)
        if total_count:
            rtd_search_text = '1=1 and pointname in ('
            rtd_search_text += ','.join(['"' + item.get('value') + '"' for item in pt_search_list])
            rtd_search_text += ')'

            search_list, total_count = rtd.advance_search_raw(rtd_search_text, flag, start_num, page_size, order)
        else:
            search_list = []
    else:
        if is_advance:
            search_list, total_count = rtd.advance_search_raw(search_text, flag, start_num, page_size, order)
        else:
            search_list, total_count = rtd.search_raw(search_text, flag, start_num, page_size, order)
    if pt:
        points_map = pt.get_some_points_map(PointTableSourceType.TYPE_CLOUD,
                                            [item.get('pointname') for item in search_list])
        for point in search_list:
            if points_map.get(point.get('pointname')) and points_map.get(point.get('pointname')).get('alias'):
                point['alias'] = points_map.get(point.get('pointname')).get('alias')

    result = {
        'total': total_count,
        'list': search_list
    }

    return json.dumps(result, ensure_ascii=False)
