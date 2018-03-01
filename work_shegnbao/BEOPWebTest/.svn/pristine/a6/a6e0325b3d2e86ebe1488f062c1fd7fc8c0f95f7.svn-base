from beopWeb.mod_admin import bp_admin
from beopWeb.mod_common.Utils import Utils
from .DataMananger import DataManager
from flask import request


@bp_admin.route('/dataManager/load/<user_id>/<project_id>', methods=['GET'])
def data_manager_load(user_id, project_id):
    if user_id is None or project_id is None:
        return Utils.beop_response_error()
    dm = DataManager()
    points = dm.get_saved_points(user_id, project_id, 'points')
    return Utils.beop_response_success(points)


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
