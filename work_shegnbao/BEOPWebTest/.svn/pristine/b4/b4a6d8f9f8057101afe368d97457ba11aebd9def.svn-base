__author__ = 'win7'
import os
from io import BytesIO
from datetime import datetime
import logging

from flask import request, render_template, Response, session, redirect, url_for, json
import  requests
from bson import ObjectId
from beopWeb import app
from xlrd import open_workbook
import xlwt

from beopWeb.mod_cxTool import bp_pointTool
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_admin.Project import Project
from beopWeb.mod_cxTool.PointTable import PointTable, PointTableSourceType
from beopWeb.mod_cxTool.dtuserver_prj import DtuServerProject
from beopWeb.mod_cxTool.realTimeData import RealTimeData
from beopWeb.mod_admin.User import User
from beopWeb.mod_cxTool.dtusert_to_project import DtusertToProject
from beopWeb.mod_cxTool.dtuserver_prj_info import DtuServerProjectInfo
from beopWeb.mod_cxTool.dtuserver_prj_record import DtuServerProjectRecord
from beopWeb.mod_cxTool.PointTableFields import PointTableFields
from beopWeb.mod_common.Role import Role
from beopWeb.mod_admin.BeOPPermission import BeOPPermission
import re
import time


class InvalidPointsExcel(Exception):
    def __init__(self, value):
        self.value = value

    def __str__(self):
        return repr(self.value)


@bp_pointTool.route('/html/pointTable', methods=['GET'])
def get_html_point_table():
    user_id = request.cookies.get('userId', None)
    if not user_id:
        return render_template('mod_cx_tool/login.html')
    p = Project()
    projects = p.get_project_by_permission(user_id, Role.ROLE_DEBUG_TOOLS)
    return render_template('mod_cx_tool/pointTable.html', projects=projects)


@bp_pointTool.route('/html/cloudPointTable', methods=['GET'])
def get_html_cloud_point_table():
    user_id = request.cookies.get('userId', None)
    if not user_id:
        return render_template('mod_cx_tool/login.html')
    p = Project()
    projects = p.get_project_by_permission(user_id, Role.ROLE_DASHBOARD)
    return render_template('mod_cx_tool/cloudPointTable.html', projects=projects)


@bp_pointTool.route('/html/realTimeData', methods=['GET'])
def get_html_real_time_data():
    user_id = request.cookies.get('userId', None)
    if not user_id:
        return render_template('mod_cx_tool/login.html')
    p = Project()
    projects = p.get_project_by_permission(user_id, Role.ROLE_DASHBOARD)
    return render_template('mod_cx_tool/realTimeData.html', projects=projects)


@bp_pointTool.route('/html/pointMapping', methods=['GET'])
def get_html_point_mapping():
    user_id = request.cookies.get('userId', None)
    if not user_id:
        return render_template('mod_cx_tool/login.html')
    p = Project()
    projects = p.get_project_by_permission(user_id, Role.ROLE_DASHBOARD)
    return render_template('mod_cx_tool/pointMapping.html', projects=projects)


@bp_pointTool.route('/html/server', methods=['GET'])
def get_html_server():
    return render_template('mod_cx_tool/serverStatus.html')


@bp_pointTool.route('/', methods=['GET', 'POST'])
def index():
    if request.cookies.get('userId', None) is None:
        return redirect(url_for('pointTool.login'))
    else:
        return redirect(url_for('pointTool.point_table_editor'))


@bp_pointTool.route('/login', methods=['POST', 'GET'])
def login():
    error = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['pwd']
        if User.verify_user(username, password):
            user = User.query_user_by_username(username, 'id')
            session.update({'username': username, 'userid': user.get('id')})
            return redirect(url_for('pointTool.point_table_editor'))
        else:
            error = 'username or password is wrong.'
            return render_template('mod_cx_tool/login.html', error=error)
    return render_template('mod_cx_tool/login.html', error=error)


@bp_pointTool.route('/logout', methods=['GET'])
def logout():
    session.clear()
    return redirect(url_for('pointTool.index'))


@bp_pointTool.route('/editor', methods=['GET', 'POST'])
def point_table_editor():
    user_id = request.cookies.get('userId', None)
    if not user_id:
        return render_template('mod_cx_tool/login.html')
    user = User.query_user_by_id(user_id, 'userfullname', 'userpic', 'id')

    navigation_bar = [('server', '#server', 'glyphicon glyphicon-hdd', 'Servers', 'ViewServer'),
                      ('realTimeData', '#realTimeData', 'glyphicon glyphicon-dashboard', 'RealTime Data',
                       'RTDataMonitoring'),
                      ('cloudPointTableEdit', '#cloud', 'glyphicon glyphicon glyphicon-cloud', 'Cloud Point',
                       'CPProcess'),
                      ('pointTableEdit', '#pointTable', 'glyphicon glyphicon-wrench', 'Engine Point',
                       'FDataProcess;FDataConnect'),
                      ('pointMapping', '#pointMapping', 'glyphicon glyphicon-magnet', 'Point Match', 'DataConnect')]
    permission = BeOPPermission().get_permissions_by_user_id(user_id)
    return render_template('mod_cx_tool/index.html', navigation_bar=navigation_bar, permission=json.dumps(permission),
                           user=user)


def convert_sheet_to_point_dict(sheet, project_id, source_type):
    keys = [sheet.cell(0, col_index).value for col_index in range(sheet.ncols)]
    dict_list = []
    value_dic = {}  # 用来判断是否有重复的点或者空点
    fail_dict = {
        'duplicated': [],
        'empty': []
    }
    for row_index in range(1, sheet.nrows):
        item = {'projId': project_id, 'alias': '', 'groupId': '', 'type': source_type}
        param = {}
        for col_index in range(sheet.ncols):
            key = keys[col_index]
            value = sheet.cell(row_index, col_index).value.strip()
            if key == 'physicalid' or key == 'point':
                if not value:
                    fail_dict['empty'].append(str(row_index - 1))
                    continue
                if value in value_dic:
                    fail_dict['duplicated'].append(str(row_index - 1) + ' ' + str(value))
                    continue
                else:
                    value_dic[value] = True
                    item['value'] = value
                    item['alias'] = value
            else:
                param[key] = value
        item['params'] = param

        dict_list.append(item)

    if fail_dict.get('empty') or fail_dict.get('duplicated'):
        raise InvalidPointsExcel(fail_dict)
    return dict_list


def convert_sheet_to_mapping_dict(sheet):
    keys = [sheet.cell(0, col_index).value for col_index in range(sheet.ncols)]
    dict_list = []
    for row_index in range(1, sheet.nrows):
        item = {'cloud point': '', 'engine point': ''}
        for col_index in range(sheet.ncols):
            item.update({keys[col_index].strip(): sheet.cell(row_index, col_index).value.strip()})

        dict_list.append(item)

    return dict_list


def convert_data_to_point_dict(data, project_id, source_type):
    if not data:
        return False
    dict_list = []
    for data_item in data:
        item = {'projId': project_id, 'alias': '', 'groupId': '', 'type': source_type}
        param = {}
        for key, value in data_item.items():
            if key == 'physicalid' or key == 'point':
                item['value'] = value
                item['alias'] = value
            else:
                param[key] = value
        item['params'] = param
        dict_list.append(item)

    return dict_list


@bp_pointTool.route('/cloudPoint/import/', methods=['POST'])
def pt_cloud_point_import():
    file = request.files.get('file')
    if not file:
        return Utils.beop_response_error('there is no upload file')
    project_id = request.form.get('projectId')
    user_id = request.cookies.get('userId', None)
    if not user_id:
        return render_template('mod_cx_tool/login.html')
    file_path = os.path.join(os.path.abspath('.'), 'cloudPointTable', str(user_id), str(project_id))
    if not os.path.exists(file_path):
        os.makedirs(file_path, exist_ok=True)
    file.filename = datetime.now().strftime(Utils.datetime_format_full_file_name) + os.path.splitext(file.filename)[1]
    full_path = os.path.join(file_path, file.filename)
    try:
        file.save(full_path)
    except Exception as e:
        return Utils.beop_response_error('excel import failed')

    workbook = open_workbook(full_path)

    sheet = workbook.sheet_by_index(0)
    try:
        dict_list = convert_sheet_to_point_dict(sheet, project_id, PointTableSourceType.TYPE_CLOUD)
        modify_time = datetime.now().strftime(Utils.datetime_format_full)
        for item in dict_list:
            item['modify_by'] = user_id
            item['modify_time'] = modify_time
    except InvalidPointsExcel as e:
        fail_list = e.value
        msg = ''
        if fail_list.get('empty'):
            msg += '\nthere is empty row:No.' + ','.join(fail_list.get('empty')) + '\n'
        if fail_list.get('duplicated'):
            msg += '\nthere is duplicate row:\n' + '\n'.join(fail_list.get('duplicated')) + '\n'
        return Utils.beop_response_error(msg='import failed,invalid excel:' + msg)
    try:
        pt = PointTable(project_id)
        pt.import_data_to_db(dict_list, PointTableSourceType.TYPE_CLOUD)
        result = pt_get_cloud_point(project_id, 1, 50)
        return Utils.beop_response_success(result)
    except Exception as e:
        logging.error('导入点表' + str(e))
        return Utils.beop_response_error()


@bp_pointTool.route('/mapping/import/', methods=['POST'])
def pt_mapping_import():
    file = request.files.get('file')
    if not file:
        return Utils.beop_response_error('there is no upload file')
    project_id = request.form.get('projectId')
    user_id = request.cookies.get('userId', None)
    if not user_id:
        return render_template('mod_cx_tool/login.html')
    file_path = os.path.join(os.path.abspath('.'), 'mapping', str(user_id), str(project_id))
    if not os.path.exists(file_path):
        os.makedirs(file_path, exist_ok=True)
    file.filename = datetime.now().strftime(Utils.datetime_format_full_file_name) + os.path.splitext(file.filename)[1]
    full_path = os.path.join(file_path, file.filename)
    try:
        file.save(full_path)
    except Exception as e:
        return Utils.beop_response_error('excel import failed')

    workbook = open_workbook(full_path)

    sheet = workbook.sheet_by_index(0)

    try:
        dict_list = convert_sheet_to_mapping_dict(sheet)
        pt = PointTable(project_id)
        result = pt.batch_point_mapping(dict_list, user_id)
        return Utils.beop_response_success(result)
    except Exception as e:
        logging.error('导入点表' + str(e))
        return Utils.beop_response_error()


@bp_pointTool.route('/import/', methods=['POST'])
def pt_import():
    file = request.files.get('file')
    if not file:
        return Utils.beop_response_error('there is no upload file')
    project_id = request.form.get('projectId')
    user_id = request.cookies.get('userId', None)
    file_path = os.path.join(os.path.abspath('.'), 'pointTable', str(user_id), str(project_id))
    if not os.path.exists(file_path):
        os.makedirs(file_path, exist_ok=True)
    file.filename = datetime.now().strftime(Utils.datetime_format_full_file_name) + os.path.splitext(file.filename)[1]
    full_path = os.path.join(file_path, file.filename)
    file.save(full_path)

    workbook = open_workbook(full_path)

    sheet = workbook.sheet_by_index(0)
    try:
        dict_list = convert_sheet_to_point_dict(sheet, project_id, PointTableSourceType.TYPE_ENGINE)
    except InvalidPointsExcel as e:
        fail_list = e.value
        msg = ''
        if fail_list.get('empty'):
            msg += '\nthere is empty row:No.' + ','.join(fail_list.get('empty')) + '\n'
        if fail_list.get('duplicated'):
            msg += '\nthere is duplicate row:\n' + '\n'.join(fail_list.get('duplicated')) + '\n'
        return Utils.beop_response_error(msg='import failed,invalid excel:' + msg)
    pt = PointTable(project_id)
    try:
        pt.import_data_to_db(dict_list, PointTableSourceType.TYPE_ENGINE)
        point_table, point_total = pt.get_point_table(PointTableSourceType.TYPE_ENGINE, 0, 50)
        result = {
            'pointTable': point_table,
            'pointTotal': point_total
        }
        return Utils.beop_response_success(result)
    except Exception as e:
        logging.error('导入点表' + str(e))
        return Utils.beop_response_error()


@bp_pointTool.route('/import_data/', methods=['POST'])
def pt_import_data():
    rq_data = request.get_json()

    dict_list = rq_data.get('data')
    project_id = rq_data.get('projectId')
    data = convert_data_to_point_dict(dict_list, project_id, PointTableSourceType.TYPE_ENGINE)

    pt = PointTable(project_id)
    try:
        pt.import_data_to_db(data, PointTableSourceType.TYPE_ENGINE)
        point_table, point_total = pt.get_point_table(PointTableSourceType.TYPE_ENGINE, 0, 50)
        result = {
            'pointTable': point_table,
            'pointTotal': point_total
        }
        return Utils.beop_response_success(result)
    except Exception as e:
        logging.error('导入点表' + str(e))
        return Utils.beop_response_error()


@bp_pointTool.route('/export/engine/<project_id>', methods=['GET'])
def pt_export(project_id):
    # project_id = request.form.get('projectId')
    user_id = request.form.get('userId')
    project_db = Project()
    project = project_db.get_project_by_id(project_id, 'name_en')
    pt = PointTable(project_id)
    result, total = pt.get_point_table(PointTableSourceType.TYPE_ENGINE)
    workbook = xlwt.Workbook(encoding='utf-8', style_compression=0)
    sheet = workbook.add_sheet('sheet 1')
    headers = ['value', 'source', 'remark', 'Unit', 'RWProperty',
               'param1', 'param2', 'param3', 'param4', 'param5', 'param6', 'param7', 'param8', 'param9', 'param10',
               'param11', 'param12', 'param13', 'param14',
               'storecycle', 'customName', 'system', 'device', 'type']
    for ind, head in enumerate(headers):
        sheet.write(0, ind, head)

    for ind, item in enumerate(result):
        for h_ind, head in enumerate(headers):
            if head == 'value':
                sheet.write(ind + 1, h_ind, item.get(head))
            else:
                sheet.write(ind + 1, h_ind, item.get('params').get(head))
    output = BytesIO()
    workbook.save(output)

    return Response(output.getvalue(),
                    mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    headers={"Content-disposition": "attachment; filename={filename}.xls".format(
                        filename=project.get('name_en'))})


@bp_pointTool.route('/export/cloud/<project_id>', methods=['GET'])
def pt_cloud_export(project_id):
    # project_id = request.form.get('projectId')
    user_id = request.form.get('userId')
    project_db = Project()
    project = project_db.get_project_by_id(project_id, 'name_en')
    pt = PointTable(project_id)
    result, total = pt.get_point_table(PointTableSourceType.TYPE_CLOUD)
    workbook = xlwt.Workbook(encoding='utf-8', style_compression=0)
    sheet = workbook.add_sheet('sheet 1')
    headers = ['point', 'remark', 'remark_en', 'system', 'device', 'type']
    for ind, head in enumerate(headers):
        sheet.write(0, ind, head)

    for ind, item in enumerate(result):
        for h_ind, head in enumerate(headers):
            if head == 'point':
                sheet.write(ind + 1, h_ind, item.get('value', 'error'))
            else:
                if item.get('params'):
                    sheet.write(ind + 1, h_ind, str(item.get('params').get(head, '')))
                else:
                    sheet.write(ind + 1, h_ind, '')
    output = BytesIO()
    workbook.save(output)

    return Response(output.getvalue(),
                    mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    headers={"Content-disposition": "attachment; filename={filename}.xls".format(
                        filename=project.get('name_en'))})


@bp_pointTool.route('/export/mapping/<project_id>', methods=['GET'])
def pt_mapping_export(project_id):
    # project_id = request.form.get('projectId')
    user_id = request.form.get('userId')
    project_db = Project()
    project = project_db.get_project_by_id(project_id, 'name_en')
    pt = PointTable(project_id)
    result, total = pt.get_point_table(PointTableSourceType.TYPE_CLOUD)
    workbook = xlwt.Workbook(encoding='utf-8', style_compression=0)
    sheet = workbook.add_sheet('sheet 1')
    headers = ['cloud point', 'cloud point note', 'engine point', 'engine point note']
    for ind, head in enumerate(headers):
        sheet.write(0, ind, head)

    for ind, item in enumerate(result):
        for h_ind, head in enumerate(headers):
            if head == 'cloud point':
                sheet.write(ind + 1, h_ind, item.get('value'))
            elif head == 'cloud point note':
                if item.get('params'):
                    sheet.write(ind + 1, h_ind, str(item.get('params').get('remark')))
                else:
                    sheet.write(ind + 1, h_ind, None)
            elif head == 'engine point':
                if item.get('params') and item.get('params').get('mapping'):
                    sheet.write(ind + 1, h_ind, str(item.get('params').get('mapping').get('point')))
                else:
                    sheet.write(ind + 1, h_ind, None)
            elif head == 'engine point note':
                if item.get('params') and item.get('mapping'):
                    sheet.write(ind + 1, h_ind, str(item.get('params').get('mapping').get('remark')))
                else:
                    sheet.write(ind + 1, h_ind, None)
    output = BytesIO()
    workbook.save(output)

    return Response(output.getvalue(),
                    mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    headers={"Content-disposition": "attachment; filename={filename}.xls".format(
                        filename=project.get('name_en'))})


@bp_pointTool.route('/getPointTable/<project_id>/<int:current_page>/<int:page_size>/<search_text>', methods=['GET'])
def pt_get_point_table(project_id, current_page, page_size, search_text):
    pt = PointTable(project_id)
    start_num = (current_page - 1) * page_size
    if search_text == 'all':
        search_text = ''
    point_table, point_total = pt.search_point(PointTableSourceType.TYPE_ENGINE, search_text, start_num, page_size)
    dsp = DtuServerProject()
    dtu = dsp.get_dtu_server_by_project_id(project_id)
    if dtu:
        real_table = dtu.get('synRealTable')
        rtd = RealTimeData(real_table)
        all_real_data_map = rtd.get_all_data_map()
        for item in point_table:
            real_data = all_real_data_map.get(item.get('value'))
            if real_data:
                item['time'] = real_data.get('time').strftime(Utils.datetime_without_year)
                item['pointvalue'] = real_data.get('pointvalue')
    result = {
        'pointTable': point_table,
        'pointTotal': point_total,
        'dtu': dtu
    }
    return Utils.beop_response_success(result)


@bp_pointTool.route('/search/engine/', methods=['POST'])
def pt_search_in_engine_points():
    data = request.get_json()
    project_id = data.get('project_id')
    text = data.get('text')
    pt = PointTable(project_id)
    search_result, total = pt.search_point(PointTableSourceType.TYPE_ENGINE, text)
    dsp = DtuServerProject()
    dtu = dsp.get_dtu_server_by_project_id(project_id)
    if dtu:
        real_table = dtu.get('synRealTable')
        rtd = RealTimeData(real_table)
        all_real_data_map = rtd.get_all_data_map()
        for item in search_result:
            real_data = all_real_data_map.get(item.get('value'))
            if real_data:
                item['time'] = real_data.get('time').strftime(Utils.datetime_without_year)
                item['pointvalue'] = real_data.get('pointvalue')
    result = {
        'pointTable': search_result,
        'dtu': dtu,
        'total': total
    }
    return Utils.beop_response_success(result)


@bp_pointTool.route('/getCloudPointTable/<project_id>/<int:current_page>/<int:page_size>')
@bp_pointTool.route('/getCloudPointTable/<project_id>/<int:current_page>/<int:page_size>/<search_text>')
def pt_get_cloud_point_table(project_id, current_page, page_size, search_text='all'):
    return Utils.beop_response_success(pt_get_cloud_point(project_id, current_page, page_size, search_text))


@bp_pointTool.route('/getMappingPointTable/<project_id>/<int:current_page>/<int:page_size>/<mapped>/', methods=['GET'])
@bp_pointTool.route('/getMappingPointTable/<project_id>/<int:current_page>/<int:page_size>/<mapped>/<text>',
                    methods=['GET'])
def pt_get_mapping_point_table(project_id, current_page, page_size, mapped='all', text=''):
    pt = PointTable(project_id)
    start_num = (current_page - 1) * page_size
    if text:
        point_table, point_total = pt.search_point(PointTableSourceType.TYPE_CLOUD, text, start_num, page_size, mapped)
    else:
        point_table, point_total = pt.get_point_table(PointTableSourceType.TYPE_CLOUD, start_num, page_size, mapped)
    dsp = DtuServerProject()
    dtu = dsp.get_dtu_server_by_project_id(project_id)
    all_real_data_map = {}
    if dtu:
        real_table = dtu.get('synRealTable')
        rtd = RealTimeData(real_table)
        all_real_data_map = rtd.get_all_data_map()
    point_map = pt.get_point_map(PointTableSourceType.TYPE_ENGINE)
    user = User()
    user_map = user.get_all_user_map()
    for item in point_table:
        if not item.get('params') or not item.get('params').get('mapping'):
            continue
        mapping_point_name = item.get('params').get('mapping').get('point')
        if not mapping_point_name:
            clear_mapping_point(item)
        else:
            mapping_point = point_map.get(mapping_point_name)
            if mapping_point:
                if mapping_point.get('params'):
                    item.get('params')['mapping']['remark'] = mapping_point.get('params').get('remark')
                if all_real_data_map:
                    real_data = all_real_data_map.get(mapping_point_name)
                    if real_data:
                        item.get('params')['mapping']['val_time'] = real_data.get('time').strftime(
                            Utils.datetime_without_year)
                        item.get('params')['mapping']['val'] = real_data.get('pointvalue')
            else:
                clear_mapping_point(item)
        # 更新人
        user_id = item.get('params')['mapping'].get('by')
        if user_map.get(user_id):
            item.get('params')['mapping']['by'] = user_map.get(user_id).get('userfullname')
    result = {
        'pointTable': point_table,
        'pointTotal': point_total,
        'dtu': dtu
    }
    return Utils.beop_response_success(result)


def clear_mapping_point(point_item):
    if point_item and point_item.get('params') and point_item.get('params').get('mapping'):
        point_item.get('params')['mapping']['val_time'] = ''
        point_item.get('params')['mapping']['val'] = ''
        point_item.get('params')['mapping']['remark'] = ''


def pt_get_cloud_point(project_id, current_page, page_size, search_text):
    pt = PointTable(project_id)
    start_num = (current_page - 1) * page_size
    if search_text == 'all':
        search_text = ''
    point_table, point_total = pt.search_point(PointTableSourceType.TYPE_CLOUD, search_text, start_num, page_size)
    user = User()
    user_map = user.get_all_user_map()
    for point in point_table:
        if point.get('modify_by') is not None:
            user = user_map.get(int(point.get('modify_by')))
            if user:
                point['modify_by'] = user.get('userfullname')
        else:
            point['modify_by'] = ''
    result = {
        'pointTable': point_table,
        'pointTotal': point_total
    }
    return result


@bp_pointTool.route('/addCloudPoint/<project_id>/', methods=['POST'])
def pt_add_cloud_point(project_id):
    user_id = request.cookies.get('userId', None)
    if not user_id:
        return render_template('mod_cx_tool/login.html')
    value = request.form.get('value')
    if not value:
        return Utils.beop_response_error(msg='point name is empty.')
    pt = PointTable(project_id)
    if pt.is_exists(value):
        return Utils.beop_response_error(msg='this point is existed.')

    point_model = {
        'projId': project_id,
        'value': value,
        'alias': value,
        'groupId': '',
        'type': 4,
        'modify_by': user_id,
        'modify_time': time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),
        'params': {
            'remark': request.form.get('remark'),
            'remark_en': request.form.get('remark_en'),
            'system': request.form.get('system'),
            'device': request.form.get('device'),
            'type': request.form.get('type'),
        }
    }
    result = pt.add_point(point_model)
    if result:
        point_model['_id'] = str(point_model.get('_id'))
        return Utils.beop_response_success(point_model)
    else:
        return Utils.beop_response_error()


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
            'remark': request.form.get('remark'),
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


@bp_pointTool.route('/editPoint/<project_id>/', methods=['POST'])
def pt_edit_point(project_id):
    value = request.form.get('value')
    if not value:
        return Utils.beop_response_error(msg='point name is empty.')
    pt = PointTable(project_id)
    point_model = {
        'projId': project_id,
        'value': value,
        'groupId': '',
        'type': 3,
        'alias': request.form.get('alias'),
        'params': {
            'storecycle': request.form.get('storecycle'),
            'remark': request.form.get('remark'),
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
    result = pt.edit_point(request.form.get('id'), point_model)
    if result:
        point_model['_id'] = str(request.form.get('id'))
        return Utils.beop_response_success(point_model)
    else:
        return Utils.beop_response_error()


@bp_pointTool.route('/autoSave/<project_id>/', methods=['POST'])
def pt_auto_save(project_id):
    user_id = request.cookies.get('userId', None)
    if not user_id:
        return render_template('mod_cx_tool/login.html')
    data = request.get_json()
    if not data:
        return Utils.beop_response_error()
    for item in data:
        item['modify_by'] = user_id
        item['modify_time'] = datetime.now().strftime(Utils.datetime_format_full)
    pt = PointTable(project_id)
    result = pt.update_many(data)
    if result:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


@bp_pointTool.route('/mappingAutoSave/<project_id>/', methods=['POST'])
def pt_mapping_auto_save(project_id):
    user_id = request.cookies.get('userId', None)
    if not user_id:
        return render_template('mod_cx_tool/login.html')
    data = request.get_json()
    if not data:
        return Utils.beop_response_error()
    mapping_time = datetime.now().strftime(Utils.datetime_format_full)
    for item in data.values():
        if not item.get('params').get('mapping'):
            item.get('params')['mapping'] = {}
        item.get('params')['mapping']['by'] = user_id
        item.get('params')['mapping']['time'] = mapping_time
    pt = PointTable(project_id)
    result = pt.update_many(data.values())

    if result:
        dsp = DtuServerProject()
        dtu = dsp.get_dtu_server_by_project_id(project_id)
        if dtu:
            real_table = dtu.get('synRealTable')
            rtd = RealTimeData(real_table)
            all_real_data_map = rtd.get_all_data_map()
            point_map = pt.get_point_map(PointTableSourceType.TYPE_ENGINE)
            user = User()
            user_map = user.get_all_user_map()
            for item in data.values():
                del item['_id']
                if not item.get('params').get('mapping'):
                    continue
                point_name = item.get('params').get('mapping').get('point')
                if not point_name:  # 删除点名
                    clear_mapping_point(item)
                else:
                    point = point_map.get(point_name)
                    if point:
                        item.get('params')['mapping']['remark'] = point.get('params').get('remark')
                        real_data = all_real_data_map.get(point_name)
                        if real_data:
                            item.get('params')['mapping']['val_time'] = real_data.get('time').strftime(
                                Utils.datetime_without_year)
                            item.get('params')['mapping']['val'] = real_data.get('pointvalue')
                    else:
                        clear_mapping_point(item)
                if user_map.get(user_id):
                    item.get('params')['mapping']['by'] = user_map.get(user_id).get('userfullname')
        else:
            for item in data.values():
                del item['_id']

        return Utils.beop_response_success(data)
    else:
        return Utils.beop_response_error()


@bp_pointTool.route('/deleteCloudPoint/<project_id>/', methods=['POST'])
def pt_delete_cloud_point(project_id):
    point_list = request.form.getlist('point_list[]')
    if not point_list:
        return Utils.beop_response_error()
    pt = PointTable(project_id)
    result = pt.delete_points(point_list, PointTableSourceType.TYPE_CLOUD)
    if result:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


@bp_pointTool.route('/deleteEnginePoint/<project_id>/', methods=['POST'])
def pt_delete_engine_point(project_id):
    point_list = request.form.getlist('point_list[]')
    if not point_list:
        return Utils.beop_response_error()
    pt = PointTable(project_id)
    result = pt.delete_points(point_list, PointTableSourceType.TYPE_ENGINE)
    if result:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


@bp_pointTool.route('/translate_standard_point/<project_id>/', methods=['GET'])
def pt_translate_standard_point(project_id):
    pt = PointTable(project_id)
    trans_result = pt.translate_standard_point(PointTableSourceType.TYPE_CLOUD)
    if trans_result:
        point_table = pt.get_point_table(PointTableSourceType.TYPE_CLOUD)
        return Utils.beop_response_success(point_table)
    else:
        return Utils.beop_response_error()


@bp_pointTool.route('/searchCloudPoint/<project_id>/<text>/', methods=['GET'])
def pt_search_cloud_point(project_id, text):
    pt = PointTable(project_id)
    search_result, total = pt.search_point(PointTableSourceType.TYPE_CLOUD, text)
    dsp = DtuServerProject()
    dtu = dsp.get_dtu_server_by_project_id(project_id)
    if dtu:
        real_table = dtu.get('synRealTable')
        rtd = RealTimeData(real_table)
        all_real_data_map = rtd.get_all_data_map()
        for item in search_result:
            real_data = all_real_data_map.get(item.get('value'))
            if real_data:
                item['time'] = real_data.get('time').strftime(Utils.datetime_without_year)
                item['pointvalue'] = real_data.get('pointvalue')
    result = {
        'pointTable': search_result,
        'dtu': dtu,
        'total': total
    }
    return Utils.beop_response_success(result)


@bp_pointTool.route('/searchEnginePoint/<project_id>/<int:current_page>/<int:page_size>/', methods=['GET'])
@bp_pointTool.route('/searchEnginePoint/<project_id>/<int:current_page>/<int:page_size>/<text>/', methods=['GET'])
def pt_search_engine_point(project_id, current_page, page_size, text=''):
    pt = PointTable(project_id)
    start_num = (current_page - 1) * page_size
    search_result, total = pt.search_point(PointTableSourceType.TYPE_ENGINE, text, start_num, page_size)
    dsp = DtuServerProject()
    dtu = dsp.get_dtu_server_by_project_id(project_id)

    if dtu:
        real_table = dtu.get('synRealTable')
        rtd = RealTimeData(real_table)
        all_real_data_map = rtd.get_all_data_map()
        for item in search_result:
            real_data = all_real_data_map.get(item.get('value'))
            if real_data:
                item['time'] = real_data.get('time').strftime(Utils.datetime_without_year)
                item['pointvalue'] = real_data.get('pointvalue')
            else:
                item['time'] = ''
                item['pointvalue'] = ''
    result = {
        'pointTable': search_result,
        'dtu': dtu,
        'total': total
    }
    return Utils.beop_response_success(result)


@bp_pointTool.route('/searchCloudPoint/<project_id>/<int:current_page>/<int:page_size>/', methods=['GET'])
@bp_pointTool.route('/searchCloudPoint/<project_id>/<int:current_page>/<int:page_size>/<text>/', methods=['GET'])
def pt_search_cloud_point_page(project_id, current_page, page_size, text=''):
    pt = PointTable(project_id)
    start_num = (current_page - 1) * page_size
    search_result, total = pt.search_point(PointTableSourceType.TYPE_CLOUD, text, start_num, page_size)
    result = {
        'pointTable': search_result,
        'total': total
    }
    return Utils.beop_response_success(result)


@bp_pointTool.route('/searchRealDataPoint/<project_id>/<int:current_page>/<int:page_size>/', methods=['GET'])
@bp_pointTool.route('/searchRealDataPoint/<project_id>/<int:current_page>/<int:page_size>/<text>/', methods=['GET'])
def pt_search_real_data(project_id, current_page, page_size, text=''):
    pt = PointTable(project_id)
    start_num = (current_page - 1) * page_size
    search_result, total = pt.search_point(PointTableSourceType.TYPE_ENGINE, text, start_num, page_size)

    result = {
        'pointTable': search_result,
        'total': total
    }
    return Utils.beop_response_success(result)


@bp_pointTool.route('/getServerStatus/<int:current_page>/<int:page_size>/', methods=['GET'])
def get_server_status(current_page, page_size):
    p = Project()
    user_id = request.cookies.get('userId', None)
    project_map = p.get_project_map_by_permission(user_id, Role.ROLE_DEBUG_TOOLS)
    dtu_map = DtuServerProjectInfo().get_all_dtu_server_status_map()
    dtu_to_project = DtusertToProject().get_all()
    user = User()

    result_status_list = []
    for dtu_to_project_item in dtu_to_project:
        item = {}
        project = project_map.get(dtu_to_project_item.get('projectid'))
        if project:
            item.update(project)
            dtu_id = dtu_to_project_item.get('dtuprojectid')
            dtu_project_info = dtu_map.get(dtu_id)
            if dtu_project_info:
                item.update(dtu_project_info)
                r = DtuServerProjectRecord()
                last_record_info = r.get_last_records_by_dtu_id(dtu_id)
                if len(last_record_info):
                    item.update(last_record_info)
                    item['userfullname'] = user.query_user_by_id(item['user_id'], 'userfullname').get('userfullname')
            item['projectId'] = project.get('id')
            dtu_info = DtuServerProject().get_dtu_server_by_project_id(project.get('id'))
            if dtu_info:
                item.update(dtu_info)
            result_status_list.append(item)

    start_num = (current_page - 1) * page_size
    end_num = start_num + page_size
    result_list = result_status_list[start_num:end_num]

    return Utils.beop_response_success({
        'list': result_list,
        'total': len(result_status_list)
    })


@bp_pointTool.route('/getServerRecords/<dtu_id>', methods=['GET'])
def get_server_records(dtu_id):
    user_id = request.cookies.get('userId', None)
    if not user_id:
        return render_template('mod_cx_tool/login.html')
    user = User()
    r = DtuServerProjectRecord()
    record_list = r.get_records_by_dtu_id(dtu_id)
    for item in record_list:
        item['userfullname'] = user.query_user_by_id(item['user_id'], 'userfullname').get('userfullname')
    result = {
        'record_list': record_list
    }
    return Utils.beop_response_success(result)


@bp_pointTool.route('/addServerRecords/<dtu_id>', methods=['POST'])
def add_server_status(dtu_id):
    user_id = request.cookies.get('userId', None)
    if not user_id:
        return render_template('mod_cx_tool/login.html')
    rq_data = request.get_json()
    if not rq_data:
        return Utils.beop_response_success()
    info = rq_data.get('info')
    update_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
    r = DtuServerProjectRecord()
    result = r.update_record(user_id, dtu_id, info, update_time)
    if result:
        return Utils.beop_response_success({
            'update_time': update_time
        })
    else:
        return Utils.beop_response_error()


@bp_pointTool.route('/updateServerRemark/<dtu_id>', methods=['POST'])
def update_server_remark(dtu_id):
    rq_data = request.get_json()
    remark = rq_data.get('remark')
    result = DtuServerProjectInfo().update_dtu_server_status(dtu_id, {'remark': remark})
    if result:
        return Utils.beop_response_success(result)
    else:
        return Utils.beop_response_error()


@bp_pointTool.route('/pointMappingFields/<project_id>', methods=['GET'])
def point_mapping_fields(project_id):
    pt = PointTable(project_id)
    all_engine_points, engine_total = pt.get_point_table(PointTableSourceType.TYPE_ENGINE)
    all_words = {}
    for item in all_engine_points:
        point_value = item.get('value')
        point_split = pt.camel_case_split(point_value)
        word_regex = re.compile('\D+')
        for w_index, word in enumerate(point_split):
            if word_regex.match(word):
                if all_words.get(word):
                    all_words[word]['frequency'] = all_words.get(word).get('frequency') + 1
                else:
                    all_words[word] = {
                        'example': point_value,
                        'frequency': 1
                    }

    stored_fields = PointTableFields(project_id).get_fields()
    ret = all_words
    ret_list = []
    if stored_fields:
        for item in stored_fields:
            key = item.get('word')
            if all_words.get(key):
                if item.get('example') != all_words.get(key).get('example'):
                    item['example'] = all_words[key].get('example')
                if item.get('frequency') != all_words[key].get('frequency'):
                    item['frequency'] = all_words[key].get('frequency')

        ret_list = stored_fields
    else:
        for word, item in ret.items():
            item['word'] = word
            ret_list.append(item)

    ret_list.sort(key=lambda item: item.get('frequency'), reverse=True)
    return Utils.beop_response_success(ret_list)


@bp_pointTool.route('/savePointMappingFields/<project_id>', methods=['POST'])
def save_point_mapping_fields(project_id):
    rq_data = request.get_json()
    fields = rq_data.get('fields')
    result = PointTableFields(project_id).save_fields(fields)
    if result:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


@bp_pointTool.route('/autoPointMapping/<project_id>', methods=['GET'])
def auto_point_mapping(project_id):
    pt = PointTable(project_id)
    all_engine_points = pt.get_point_map(PointTableSourceType.TYPE_ENGINE)
    all_cloud_remark_map = pt.get_point_remark_map(PointTableSourceType.TYPE_CLOUD)
    all_cloud_remark_keys = all_cloud_remark_map.keys()
    ptf = PointTableFields(project_id)
    stored_fields = ptf.get_fields_map()
    engine_split_result = {}
    digit_regex = re.compile('0*(\d+)')
    result = {}

    def get_digit_score(main_list, detected_list):
        score = 0
        if not detected_list and main_list:
            return score
        for item in detected_list:
            if item not in main_list:
                return score
        main_list_str = ''.join([str(item) for item in main_list])
        detected_list_regex = '.*'.join([str(item) for item in detected_list])
        local_digit.sort()
        digit.sort()

        if re.compile(detected_list_regex).search(main_list_str):
            score = 3 * len(local_digit)
            if local_digit == digit:
                score += len(local_digit)
        else:
            if local_digit == digit:
                score = 2 * len(local_digit)
            else:
                score = len(local_digit)
        return score

    def get_remark_score(engine_remark, cloud_remark):
        score = 0
        for char in engine_remark:
            if char in cloud_remark:
                score += 1

        if score > len(cloud_remark) * 0.6:
            return score
        else:
            return 0

    for cloud_point_remark in all_cloud_remark_keys:
        all_digit_str = digit_regex.findall(cloud_point_remark)
        all_digit = []
        for digit in all_digit_str:
            int_digit = int(digit)
            if int_digit == 0:
                continue
            if int_digit not in all_digit:
                all_digit.append(int_digit)
        all_cloud_remark_map.get(cloud_point_remark)['digit'] = all_digit

    for engine_point_key, engine_item in all_engine_points.items():
        point_value = engine_item.get('value')
        point_split = pt.camel_case_split(point_value)
        trans = []  # 翻译
        digit = []  # 数字
        for word in point_split:
            if digit_regex.match(word):
                engine_digit = int(digit_regex.match(word).groups()[0])
                if engine_digit not in digit:
                    digit.append(engine_digit)
            if stored_fields.get(word) and stored_fields.get(word).get('value'):
                trans.append(stored_fields.get(word).get('value'))
        engine_split_result[point_value] = {
            'point': point_split,
            'trans': trans
        }
        engine_item_remark = ''
        if engine_item.get('params'):
            engine_item_remark = engine_item.get('params').get('remark')  # 现场点推到的标识有点名翻译出的词及注释组成

        for cloud_point_remark in all_cloud_remark_map:
            local_point = all_cloud_remark_map.get(cloud_point_remark)
            local_digit = local_point.get('digit')
            digit_score = get_digit_score(digit, local_digit)
            remark_score = get_remark_score(engine_item.get('params').get('remark'), cloud_point_remark)
            if digit_score or remark_score:
                trans_score = len(trans) * 3
                new_score = trans_score + digit_score + remark_score
                if local_point.get('score') is None or new_score > local_point.get('score'):
                    local_point['score'] = new_score
                    local_point['suggest'] = point_value
                    local_point['suggestNote'] = engine_item_remark
                    result[local_point.get('value').replace('.', '．')] = local_point
    ptf.save_suggests(pt.get_points_count(PointTableSourceType.TYPE_CLOUD), result)
    return Utils.beop_response_success()


@bp_pointTool.route('/getSuggests/<project_id>', methods=['GET'])
def get_suggests(project_id):
    ptf = PointTableFields(project_id)
    return Utils.beop_response_success(ptf.get_suggests())


@bp_pointTool.route('/submitMatchResult/<project_id>', methods=['POST'])
def submit_match_result(project_id):
    rq_data = request.get_json()
    if not rq_data:
        return Utils.beop_response_success()
    user_id = request.cookies.get('userId', None)
    pt = PointTable(project_id)
    points = pt.get_point_map(PointTableSourceType.TYPE_CLOUD)
    save_point = []
    for point_name, mapping_name in rq_data.items():
        point_name = point_name.replace('．', '.')
        point = points.get(point_name)
        if not point.get('params').get('mapping'):
            point.get('params')['mapping'] = {}
        point.get('params')['mapping']['point'] = mapping_name
        point.get('params')['mapping']['by'] = user_id
        point.get('params')['mapping']['time'] = datetime.now().strftime(Utils.datetime_format_full)
        save_point.append(point)

    result = pt.update_many(save_point)
    return Utils.beop_response_success(result)


@bp_pointTool.route('/convertToCloud', methods=['POST'])
def convert_to_cloud():
    user_id = request.cookies.get('userId', None)
    if not user_id:
        return render_template('mod_cx_tool/login.html')
    rq_data = request.get_json()
    project_id = rq_data.get('projectId')
    convert_type = rq_data.get('type')
    pt = PointTable(project_id)
    convert_point_num = pt.convert_engine_point_to_cloud_point(user_id, convert_type)
    if convert_point_num is not None:
        return Utils.beop_response_success(convert_point_num)
    else:
        return Utils.beop_response_error()


@bp_pointTool.route('/download/table/<project_id>', methods=['GET'])
def download_table(project_id):
    project_db = Project()
    project = project_db.get_project_by_id(project_id, 'name_en')
    pt = PointTable(project_id)
    result, total = pt.get_point_table(PointTableSourceType.TYPE_ENGINE)
    workbook = xlwt.Workbook(encoding='utf-8', style_compression=0)
    sheet = workbook.add_sheet('sheet 1')
    headers = ['value', 'source', 'remark', 'Unit', 'RWProperty',
               'param1', 'param2', 'param3', 'param4', 'param5', 'param6', 'param7', 'param8', 'param9', 'param10',
               'param11', 'param12', 'param13', 'param14',
               'storecycle', 'customName', 'system', 'device', 'type']
    for ind, head in enumerate(headers):
        sheet.write(0, ind, head)

    for ind, item in enumerate(result):
        for h_ind, head in enumerate(headers):
            if head == 'value':
                sheet.write(ind + 1, h_ind, item.get(head))
            else:
                value = item.get('params').get(head)
                if head == 'remark':
                    if value:
                        value = value.replace(',', ' ')
                sheet.write(ind + 1, h_ind, value)
    output = BytesIO()
    workbook.save(output)

    fileId = ObjectId().__str__()
    fileName = fileId + '.csv'
    url = app.config['BEOP_SERVICE_ADDRESS'] + '/file/uploadFile/%s'%(fileName,)
    post_file_headers = {'content-type': 'application/octet-stream'}
    post_json_headers = {'content-type': 'application/json'}
    r = None
    try:
        r = requests.post(url, headers = post_file_headers, data=output.getvalue())
        if r:
            if r.status_code == 200:
                if json.loads(r.text) == 'successful':
                    # send message into MQ
                    mqUrl = app.config['BEOP_SERVICE_ADDRESS'] + '/mq/mqSendTask'
                    mqData = "strDTUName=%s,strCmdType=file,strCmdContent=%s,strTime=%s,nID=%s,strCustom1='',strCustom2=''"%(project_id, fileName, datetime.now().strftime('%Y-%m-%d %H:%M:%S'), fileId, )
                    sendJson = json.dumps({'value':mqData, 'name':'file'})
                    rt = requests.post(mqUrl, headers = post_json_headers, data=sendJson)
                    if 200 == rt.status_code:
                        print('Send into MQ success. %s' %(sendJson, ))
                    else:
                        print('Send into MQ failed. %s' %(sendJson, ))
                        logging.error('Send into MQ failed. %s' %(sendJson, ))
    except Exception as e:
        print('download_table error:' + e.__str__())
        logging.error('download_table error:' + e.__str__())

    return Response(output.getvalue(),
                    mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    headers={"Content-disposition": "attachment; filename={filename}.xls".format(
                        filename=project.get('name_en'))})
