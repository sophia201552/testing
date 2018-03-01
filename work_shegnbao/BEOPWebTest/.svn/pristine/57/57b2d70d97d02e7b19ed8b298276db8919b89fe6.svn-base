__author__ = 'win7'
from flask import request, render_template, Response

from beopWeb.mod_cxTool import bp_pointTool
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_admin.Project import Project
from xlrd import open_workbook
import xlwt
import os
from io import BytesIO
from datetime import datetime
from beopWeb.mod_cxTool.PointTable import PointTable
import logging


@bp_pointTool.route('/', methods=['GET'])
def index():
    p = Project()
    projects = p.get_all_project()
    return render_template('mod_cx_tool/index.html', projects=projects)


def convert_sheet_to_point_dict(sheet, project_id):
    keys = [sheet.cell(0, col_index).value for col_index in range(sheet.ncols)]
    dict_list = []
    for row_index in range(1, sheet.nrows):
        item = {'projId': project_id, 'alias': '', 'groupId': '', 'type': 3}
        param = {}
        for col_index in range(sheet.ncols):
            key = keys[col_index]
            value = sheet.cell(row_index, col_index).value
            if key == 'value':
                item['value'] = value
            elif key == 'note':
                item['note'] = value
            else:
                param[key] = value
        item['params'] = param

        dict_list.append(item)
    return dict_list


@bp_pointTool.route('/import/', methods=['POST'])
def pt_import():
    file = request.files.get('file')
    if not file:
        return Utils.beop_response_error('没有上传文件')
    project_id = request.form.get('projectId')
    user_id = request.form.get('userId')
    file_path = os.path.join(os.path.abspath('.'), 'pointTable', user_id, project_id)
    if not os.path.exists(file_path):
        os.makedirs(file_path, exist_ok=True)
    file.filename = datetime.now().strftime('%Y-%M-%d %H-%m-%S') + os.path.splitext(file.filename)[1]
    full_path = os.path.join(file_path, file.filename)
    file.save(full_path)

    workbook = open_workbook(full_path)

    sheet = workbook.sheet_by_index(0)
    dict_list = convert_sheet_to_point_dict(sheet, project_id)
    pt = PointTable(project_id)
    try:
        result = pt.import_data_to_db(dict_list)
        return Utils.beop_response_success(result)
    except Exception as e:
        logging.error('导入点表' + str(e))
        return Utils.beop_response_error()


@bp_pointTool.route('/export/<project_id>', methods=['GET'])
def pt_export(project_id):
    # project_id = request.form.get('projectId')
    user_id = request.form.get('userId')
    project_db = Project()
    project = project_db.get_project_by_id(project_id, 'name_en')
    pt = PointTable(project_id)
    result = pt.get_point_table()
    workbook = xlwt.Workbook(encoding='utf-8', style_compression=0)
    sheet = workbook.add_sheet('sheet 1')
    headers = ['value', 'source', 'note', 'Unit', 'RWProperty',
               'param1', 'param2', 'param3', 'param4', 'param5', 'param6', 'param7', 'param8', 'param9', 'param10',
               'param11', 'param12', 'param13', 'param14',
               'storecycle', 'customName', 'system', 'device', 'type']
    for ind, head in enumerate(headers):
        sheet.write(0, ind, head)

    for ind, item in enumerate(result):
        for h_ind, head in enumerate(headers):
            if head in ['value', 'note']:
                sheet.write(ind + 1, h_ind, item.get(head))
            else:
                sheet.write(ind + 1, h_ind, item.get('params').get(head))
    output = BytesIO()
    workbook.save(output)

    return Response(output.getvalue(),
                    mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    headers={"Content-disposition": "attachment; filename={filename}.xls".format(
                        filename=project.get('name_en'))})


@bp_pointTool.route('/getPointTable/<project_id>/', methods=['GET'])
def pt_get_point_table(project_id):
    pt = PointTable(project_id)
    result = pt.get_point_table()
    return Utils.beop_response_success(result)


@bp_pointTool.route('/addPoint/<project_id>/', methods=['POST'])
def pt_add_point(project_id):
    value = request.form.get('value')
    if not value:
        return Utils.beop_response_error(msg='point name is empty.')
    pt = PointTable(project_id)
    if pt.is_exists(value):
        return Utils.beop_response_error(msg='this point is existed.')

    point_model = {
        'projId': project_id,
        'value': value,
        'groupId': '',
        'type': 3,
        'alias': request.form.get('alias'),
        'params': {
            'storecycle': request.form.get('storecycle'),
            'note': request.form.get('note'),
            'RWProperty': request.form.get('RWProperty'),
            'device': request.form.get('device'),
            'customName': request.form.get('customName'),
            'system': request.form.get('system'),
            'source': request.form.get('source'),
            'Unit': request.form.get('Unit'),
            'type': request.form.get('type'),
            'param1': request.form.get('param1'),
            'param2': request.form.get('param2'),
            'param3': request.form.get('param3'),
            'param4': request.form.get('param4'),
            'param5': request.form.get('param5'),
            'param6': request.form.get('param6'),
            'param7': request.form.get('param7'),
            'param8': request.form.get('param8'),
            'param9': request.form.get('param9'),
            'param10': request.form.get('param10'),
            'param11': request.form.get('param11'),
            'param12': request.form.get('param12'),
            'param13': request.form.get('param13'),
            'param14': request.form.get('param14'),
        }
    }
    result = pt.add_point(point_model)
    if result:
        point_model['_id'] = str(point_model.get('_id'))
        return Utils.beop_response_success(point_model)
    else:
        return Utils.beop_response_error()


@bp_pointTool.route('/deletePoint/<project_id>/', methods=['POST'])
def pt_delete_point(project_id):
    point_list = request.form.getlist('point_list[]')
    if not point_list:
        return Utils.beop_response_error()
    pt = PointTable(project_id)
    result = pt.delete_points(point_list)
    if result:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()
