from flask import request, render_template, json, jsonify
from beopWeb.mod_admin import bp_admin
from beopWeb.mod_common.Utils import Utils
from .DataMananger import DataManager
from beopWeb.mod_cxTool.PointTable import PointTable, PointTableSourceType


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
        return render_template('mod_cx_tool/login.html')
    if project_id is None:
        return Utils.beop_response_error()
    dm = DataManager()
    points = dm.get_saved_points(user_id, project_id, 'points')
    return Utils.beop_response_success(points)


@bp_admin.route('/dataPointManager/loadData/<project_id>', methods=['GET'])
def data_point_manager_load_data(project_id):
    from beopWeb.BEOPDataBufferManager import BEOPDataBufferManager

    user_id = request.cookies.get('userId', None)
    if not user_id:
        return render_template('mod_cx_tool/login.html')
    if project_id is None:
        return Utils.beop_response_error()
    dm = DataManager()
    points = dm.get_saved_points(user_id, project_id, 'points')
    real_time_list = []
    if points:
        data = BEOPDataBufferManager.getInstance().getDataWithTimeByProj(project_id)
        data_list = [dict(name=k, value=v) for k, v in data.items()]
        point_list = points['points'].split(',')

        for index in range(len(data_list)):
            for name in point_list:
                if data_list[index]['name'] == name:
                    item_list = {
                        'name': data_list[index]['name'],
                        'time': data_list[index]['value'][0].strftime('%Y-%m-%d %H:%M:%S'),
                        'value': data_list[index]['value'][1],
                    }
                    real_time_list.append(item_list)

        pt = PointTable(project_id)
        points_map = pt.get_some_points_map(PointTableSourceType.TYPE_ENGINE, [item.get('name') for item in real_time_list])
        for point in real_time_list:
            if points_map.get(point.get('name')) \
                    and points_map.get(point.get('name')).get('params') \
                    and points_map.get(point.get('name')).get('params').get('remark'):
                point['remark'] = points_map.get(point.get('name')).get('params').get('remark')

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


@bp_admin.route('/dataPointManager/update/', methods=['POST'])
def data_point_manager_update():
    req_data = request.get_json()
    user_id = request.cookies.get('userId', None)
    if not user_id:
        return render_template('mod_cx_tool/login.html')
    project_id = req_data.get('projectId')
    points = req_data.get('points')
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

