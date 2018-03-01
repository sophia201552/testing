from flask import request, jsonify, render_template
import logging
from beopWeb import app
from beopWeb.mod_cloudDiagnosis import bp_cloudDiagnosis
from beopWeb.mod_cloudDiagnosis.cloudDiagnosis import *
from beopWeb.mod_common.Utils import Utils


@bp_cloudDiagnosis.route('/saveCustomDiagnosis', methods=['POST'])
def save_customDiagnosis():
    data = request.get_json()
    try:
        if isinstance(data, list):
            rt = CloudDiagnosis.save_cloudDiagnosis_customDiagnosis_list(data)
        else:
            rt = CloudDiagnosis.save_cloudDiagnosis_customDiagnosis(data)
    except Exception as e:
        return Utils.beop_response_error(msg=str(e))
    if rt:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(msg='save diagnosis failed')


@bp_cloudDiagnosis.route('/saveCustomDiagnosis/many', methods=['POST'])
def save_customDiagnosis_many():
    data = request.get_json()
    rt = CloudDiagnosis.save_cloudDiagnosis_customDiagnosis_many(data)
    if rt:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(msg='save diagnosis failed')


@bp_cloudDiagnosis.route('/copyCustomDiagnosis', methods=['POST'])
def copy_customDiagnosis():
    req_data = request.get_json()
    rt = CloudDiagnosis.copy_cloudDiagnosis_customDiagnosis(req_data.get('diagnosisIds'), req_data.get('parent_id'))
    if rt:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(msg='copy diagnosis failed')


@bp_cloudDiagnosis.route('/removeCustomDiagnosis', methods=['POST'])
def remove_customDiagnosis():
    data = request.get_json()
    IdList = data.get('IdList')
    rt = None
    try:
        rt = CloudDiagnosis.remove_cloudDiagnosis_customDiagnosis(IdList)
    except Exception as e:
        print('remove_customDiagnosis error:' + e.__str__())
        logging.error('remove_customDiagnosis error:' + e.__str__())
    return Utils.beop_response_success(rt)


@bp_cloudDiagnosis.route('/getCustomDiagnosis', methods=['POST'])
def get_customDiagnosis():
    data = request.get_json()
    filter = data.get('filter', {})
    rt = []
    try:
        rt = CloudDiagnosis.get_cloudDiagnosis_customDiagnosis(filter)
    except Exception as e:
        print('get_customDiagnosis error:' + e.__str__())
        logging.error('get_customDiagnosis error:' + e.__str__())
    return Utils.beop_response_success(rt)


@bp_cloudDiagnosis.route('/getCustomDiagnosis/tree', methods=['POST'])
def get_customDiagnosis_tree():
    rt = []
    data = request.get_json()
    data_filter = None
    if data:
        data_filter = data.get('filter', {})
    if not data_filter:
        data_filter = {key: request.form.get(key) for key in request.form}
    try:
        rt = CloudDiagnosis.get_cloudDiagnosis_customDiagnosis_tree(data_filter)
    except Exception as e:
        print('get_customDiagnosis error:' + e.__str__())
        logging.error('get_customDiagnosis error:' + e.__str__())
    return Utils.beop_response_success(rt)
