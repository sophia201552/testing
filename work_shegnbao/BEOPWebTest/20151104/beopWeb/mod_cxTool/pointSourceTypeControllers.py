__author__ = 'win7'
from flask import request, render_template, Response

from beopWeb.mod_cxTool import bp_pointTool
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_cxTool.PointSourceType import PointSourceType


@bp_pointTool.route('/pointSourceType/add/', methods=['POST'])
def pst_add_point_type():
    name = request.form.get('name')
    p = PointSourceType()
    if p.is_exist(name):
        return Utils.beop_response_error(msg='点来源类型已经存在')
    name = str.strip(name)
    model = {
        'name': name,
        'params': {
            'param1': request.form.get('param1'),
            'param2': request.form.get('param2'),
            'param3': request.form.get('param3'),
            'param4': request.form.get('param4'),
            'param5': request.form.get('param5'),
            'param6': request.form.get('param6'),
            'param7': request.form.get('param7'),
            'param8': request.form.get('param8'),
            'param9': request.form.get('param9'),
            'param10': request.form.get('param10')

        }
    }

    inserted_id = p.add(model)
    if inserted_id:
        model['_id'] = str(inserted_id)
        return Utils.beop_response_success(model)
    else:
        return Utils.beop_response_error()


@bp_pointTool.route('/pointSourceType/update/', methods=['POST'])
def pst_update_point_type():
    p = PointSourceType()
    name = request.form.get('name')
    if not name:
        return Utils.beop_response_error(msg='名称不能为空')
    name = str.strip(name)
    model = {
        'name': name,
        'params': {
            'param1': request.form.get('param1'),
            'param2': request.form.get('param2'),
            'param3': request.form.get('param3'),
            'param4': request.form.get('param4'),
            'param5': request.form.get('param5'),
            'param6': request.form.get('param6'),
            'param7': request.form.get('param7'),
            'param8': request.form.get('param8'),
            'param9': request.form.get('param9'),
            'param10': request.form.get('param10')

        }
    }
    result = p.update(name, model)
    if result:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


@bp_pointTool.route('/pointSourceType/getAll/', methods=['GET'])
def pst_get_all():
    p = PointSourceType()
    return Utils.beop_response_success(p.get_name_params_map())


@bp_pointTool.route('/pointSourceType/delete/', methods=['POST'])
def pst_delete():
    name = request.form.get('name')
    if not name:
        return Utils.beop_response_error()
    p = PointSourceType()
    result = p.delete(name)
    if result:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()
