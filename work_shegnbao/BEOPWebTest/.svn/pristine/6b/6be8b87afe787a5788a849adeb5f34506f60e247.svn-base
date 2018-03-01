__author__ = 'win7'
from io import StringIO
import csv

from flask import request, render_template, Response, session, redirect, url_for, jsonify
from bson import ObjectId
from xlrd import open_workbook

from beopWeb.mod_cxTool import bp_pointTool
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_admin.Project import Project
from beopWeb.mod_cxTool.PointTable import PointTable, PointTableSourceType, CloudPointType
from beopWeb.mod_admin.RealTimeData import RealTimeData
from beopWeb.mod_admin.User import User
from beopWeb.mod_common.Role import Role
from beopWeb.mod_admin.BeOPPermission import BeOPPermission
from beopWeb.AuthManager import AuthManager
from beopWeb.BEOPMySqlDBContainer import *
from beopWeb.mod_common.Exceptions import InvalidPointsExcel
from collections import Counter
from beopWeb.models import ExcelFile
from beopWeb.MongoConnManager import MongoConnManager
from beopWeb.mod_memcache.RedisManager import RedisManager
from beopWeb.mod_cxTool.dtuserver_prj import DtuServerProject


@bp_pointTool.route('/html/pointTable', methods=['GET'])
def get_html_point_table():
    user_id = AuthManager.get_userId()
    if not user_id:
        return redirect(url_for('login'))
    p = Project()
    projects = p.get_project_by_permission(user_id, Role.ROLE_DEBUG_TOOLS)
    return render_template('mod_cx_tool/pointTable.html', projects=projects)


@bp_pointTool.route('/html/cloudPointTable', methods=['GET'])
def get_html_cloud_point_table():
    user_id = AuthManager.get_userId()
    if not user_id:
        return redirect(url_for('login'))
    p = Project()
    projects = p.get_project_by_permission(user_id, Role.ROLE_DASHBOARD)
    return render_template('mod_cx_tool/cloudPointTable.html', projects=projects)


@bp_pointTool.route('/html/pointTemplate', methods=['GET'])
def get_html_point_template():
    user_id = AuthManager.get_userId()
    if not user_id:
        return redirect(url_for('login'))
    p = Project()
    projects = p.get_project_by_permission(user_id, Role.ROLE_DASHBOARD)
    return render_template('mod_cx_tool/pointTemplate.html', projects=projects)


@bp_pointTool.route('/html/realTimeData', methods=['GET'])
def get_html_real_time_data():
    user_id = AuthManager.get_userId()
    if not user_id:
        return redirect(url_for('login'))
    p = Project()
    projects = p.get_project_by_permission(user_id, Role.ROLE_DASHBOARD)
    return render_template('mod_cx_tool/realTimeData.html', projects=projects)


@bp_pointTool.route('/html/pointMapping', methods=['GET'])
def get_html_point_mapping():
    user_id = AuthManager.get_userId()
    if not user_id:
        return redirect(url_for('login'))
    p = Project()
    projects = p.get_project_by_permission(user_id, Role.ROLE_DASHBOARD)
    return render_template('mod_cx_tool/pointMapping.html', projects=projects)


@bp_pointTool.route('/html/server', methods=['GET'])
def get_html_server():
    return render_template('mod_cx_tool/serverStatus.html')


@bp_pointTool.route('/', methods=['GET', 'POST'])
def index():
    user_id = AuthManager.get_userId()
    if not user_id:
        return redirect(url_for('login'))
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
    user_id = AuthManager.get_userId()
    if not user_id:
        return redirect(url_for('login'))
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


def convert_csv_to_point_dict(lines, project_id, source_type, user_id=None):
    keys = lines[0]
    dict_list = []
    value_dic = {}  # 用来判断是否有重复的点或者空点
    fail_dict = {
        'duplicated': [],
        'empty': []
    }
    for line_index, line in enumerate(lines):
        if line_index == 0:
            continue
        item = {'projId': project_id, 'alias': '', 'groupId': '', 'type': source_type, 'note': ''}
        param = {}
        value = ''
        for key_index, key in enumerate(keys):
            value = line[key_index].strip()
            if key == 'physicalid' or key == 'point':
                if not value:
                    fail_dict['empty'].append(str(line_index))
                    continue
                if value in value_dic:
                    fail_dict['duplicated'].append(str(line_index) + ' ' + value)
                    continue
                else:
                    value_dic[value] = True
                    item['value'] = value
                    item['alias'] = value
            elif key == 'note' or key == 'remark':
                item['alias'] = value
            elif key == 'mapping':
                param[key] = {
                    'point': value.strip(),
                    'time': datetime.now(),
                    'by': user_id
                }
            else:
                if key == 'flag':
                    param['flag'] = int(value)
                else:
                    param[key] = value

        if param.get('flag') is None:
            param['flag'] = 0

        item['params'] = param
        dict_list.append(item)

    if fail_dict.get('empty') or fail_dict.get('duplicated'):
        raise InvalidPointsExcel(fail_dict)
    return dict_list


def convert_sheet_to_point_dict(sheet, project_id, source_type, user_id=None):
    keys = [sheet.cell(0, col_index).value for col_index in range(sheet.ncols)]
    dict_list = []
    value_dic = {}  # 用来判断是否有重复的点或者空点
    fail_dict = {
        'duplicated': [],
        'empty': []
    }
    for row_index in range(1, sheet.nrows):
        item = {'projId': project_id, 'alias': '', 'groupId': '', 'type': source_type, 'note': ''}
        param = {}
        for col_index in range(sheet.ncols):
            key = keys[col_index]
            value = ''
            if isinstance(sheet.cell(row_index, col_index).value, float):
                value = str(int(sheet.cell(row_index, col_index).value))
            else:
                value = str(sheet.cell(row_index, col_index).value).strip()

            if key == 'physicalid' or key == 'point' or key == 'value':
                if not value:
                    fail_dict['empty'].append(str(row_index - 1))
                    continue
                if value in value_dic:
                    fail_dict['duplicated'].append(str(row_index - 1) + ' ' + value)
                    continue
                else:
                    value_dic[value] = True
                    item['value'] = value
                    item['alias'] = value
                continue

            if key == 'remark' or key == 'note':
                item['alias'] = value
                continue

            if key == 'mapping':
                if not item.get('params'):
                    item['params'] = {}
                item.get('params')['mapping'] = {
                    'point': value.strip(),
                    'time': datetime.now(),
                    'by': user_id
                }
            else:
                if key == 'flag':
                    param['flag'] = int(value)
                else:
                    param[key] = value

        if param.get('flag') is None:
            param['flag'] = 0
        if not item.get('params'):
            item['params'] = {}
        item.get('params').update(param)

        dict_list.append(item)

    if fail_dict.get('empty') or fail_dict.get('duplicated'):
        raise InvalidPointsExcel(fail_dict)
    return dict_list


# def convert_sheet_to_mapping_dict(sheet):
#     keys = [sheet.cell(0, col_index).value for col_index in range(sheet.ncols)]
#     dict_list = []
#     for row_index in range(1, sheet.nrows):
#         item = {'cloud point': '', 'engine point': ''}
#         for col_index in range(sheet.ncols):
#             item.update({keys[col_index].strip(): sheet.cell(row_index, col_index).value.strip()})
#
#         dict_list.append(item)
#
#     return dict_list
#
#
# def convert_data_to_point_dict(data, project_id, source_type):
#     if not data:
#         return False
#     dict_list = []
#     for data_item in data:
#         item = {'projId': project_id, 'alias': '', 'groupId': '', 'type': source_type}
#         param = {}
#         for key, value in data_item.items():
#             if key == 'physicalid' or key == 'point':
#                 item['value'] = value
#                 item['alias'] = value
#             else:
#                 param[key] = value
#         item['params'] = param
#         dict_list.append(item)
#
#     return dict_list


@bp_pointTool.route('/cloudPoint/import/', methods=['POST'])
def pt_cloud_point_import():
    file = request.files.get('file')
    if not file:
        return Utils.beop_response_error('there is no upload file')
    project_id = request.form.get('projectId')
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(msg='not login')
    file_path = os.path.join(os.path.abspath('.'), 'cloudPointTable', str(user_id), str(project_id))
    if not os.path.exists(file_path):
        os.makedirs(file_path, exist_ok=True)
    file.filename = datetime.now().strftime(Utils.datetime_format_full_file_name) + os.path.splitext(file.filename)[1]
    full_path = os.path.join(file_path, file.filename)
    file.save(full_path)
    #    def detect_file_encoding(file_bytes, encoding):
    #        try:
    #            return file_bytes.decode(encoding)
    #        except:
    #            return None
    #
    #    encoding_list = ['gbk', 'gb2312', 'utf8']
    #    try:
    #        with io.open(full_path, 'w', encoding='utf8') as f:
    #            file_bytes = file.read()
    #            file_str = None
    #            for encoding in encoding_list:
    #                detect_result = detect_file_encoding(file_bytes, encoding)
    #                if detect_result is not None:
    #                    file_str = detect_result
    #                    break
    #            f.write(file_str)
    #    except Exception as e:
    #        logging.error(e)
    #        return Utils.beop_response_error('excel import failed')

    try:
        dict_list = []
        if full_path.endswith('xlsx') or full_path.endswith('xls'):
            workbook = open_workbook(full_path)
            sheet = workbook.sheet_by_index(0)
            dict_list = convert_sheet_to_point_dict(sheet, project_id, PointTableSourceType.TYPE_CLOUD, user_id)
        elif full_path.endswith('csv'):
            with open(full_path, 'r', encoding='utf8') as csvfile:
                reader = csv.reader(csvfile)
                lines = []
                for line in reader:
                    if line:
                        lines.append(line)
                dict_list = convert_csv_to_point_dict(lines, project_id, PointTableSourceType.TYPE_CLOUD, user_id)

        modify_time = datetime.now().strftime(Utils.datetime_format_full)
        for item in dict_list:
            item['modify_by'] = user_id
            item['modify_time'] = modify_time
    except InvalidPointsExcel as e:
        fail_list = e
        msg = ''
        if fail_list.args[0].get('empty'):
            msg += '\nthere is empty row:No.' + ','.join(fail_list.args[0].get('empty')) + '\n'
        if fail_list.args[0].get('duplicated'):
            msg += '\nthere is duplicate row:\n' + '\n'.join(fail_list.args[0].get('duplicated')) + '\n'
        return Utils.beop_response_error(msg='import failed,invalid excel:' + msg)
    try:
        pt = PointTable(project_id)
        pt.import_data_to_db(dict_list, PointTableSourceType.TYPE_CLOUD)
        return Utils.beop_response_success()
    except Exception as e:
        logging.error('导入点表' + str(e))
        return Utils.beop_response_error()


@bp_pointTool.route('/export/cloud/<project_id>', methods=['GET'])
def pt_cloud_export(project_id):
    '''
    David modify 20161009
    :param project_id:
    :return:
    '''
    project_db = Project()
    project = project_db.get_project_by_id(project_id, 'name_en')
    pt = PointTable(project_id)
    result, total = pt.get_point_table(PointTableSourceType.TYPE_CLOUD, flag=CloudPointType.MAPPING_POINT)
    # headers = ['point', 'mapping', 'remark']
    # csv_list = [headers]
    # for ind, item in enumerate(result):
    #    row_data = []
    #    for h_ind, head in enumerate(headers):
    #        if head == 'point':
    #            row_data.append(item.get('value', 'error'))
    #        elif head == 'mapping' and item.get('params') and item.get('params').get('mapping'):
    #            row_data.append(str(item.get('params').get('mapping').get('point')))
    #        elif head == 'remark':
    #            row_data.append(str(item.get('alias')))
    #    csv_list.append(row_data)
    # si = StringIO()
    # cw = csv.writer(si)
    # cw.writerows(csv_list)

    if result:
        excelData = ExcelFile('point', 'mapping', 'remark')
        for item in result:
            row_data = [item.get('value', 'error')]
            if item.get('params'):
                if item.get('params').get('mapping'):
                    row_data.append(item.get('params').get('mapping').get('point'))
                else:
                    row_data.append(None)
            else:
                row_data.append(None)
            row_data.append(item.get('alias'))
            excelData.append_row(row_data)
        return Response(excelData.data.xlsx,
                        headers={"Content-disposition": "attachment; filename={filename}.xlsx".format(
                            filename=project.get('name_en'))})
    return Utils.beop_response_error()


@bp_pointTool.route('/export/mapping/<project_id>', methods=['GET'])
def pt_mapping_export(project_id):
    project_db = Project()
    project = project_db.get_project_by_id(project_id, 'name_en')
    pt = PointTable(project_id)
    result, total = pt.get_point_table(PointTableSourceType.TYPE_CLOUD)
    headers = ['cloud point', 'cloud point note', 'engine point', 'engine point note']
    csv_list = [headers]

    for ind, item in enumerate(result):
        row_data = []
        for h_ind, head in enumerate(headers):
            if head == 'cloud point':
                row_data.append(item.get('value'))
            elif head == 'cloud point note':
                if item.get('params'):
                    row_data.append(str(item.get('alias')))
                else:
                    row_data.append('')
            elif head == 'engine point':
                if item.get('params') and item.get('params').get('mapping'):
                    row_data.append(str(item.get('params').get('mapping').get('point')))
                else:
                    row_data.append('')
            elif head == 'engine point note':
                if item.get('params') and item.get('mapping'):
                    row_data.append(str(item.get('params').get('mapping').get('remark')))
                else:
                    row_data.append('')
        csv_list.append(row_data)

    si = StringIO()
    cw = csv.writer(si)
    cw.writerows(csv_list)
    response = Response(si.getvalue(), mimetype="text/csv",
                        headers={"Content-disposition": "attachment; filename={filename}.csv".format(
                            filename=project.get('name_en'))})

    return response


@bp_pointTool.route('/getCloudPointTable/', methods=['POST'])
def pt_get_cloud_point_table():
    data = request.get_json()
    project_id = data.get('projectId')
    current_page = data.get('currentPage')
    page_size = data.get('pageSize')
    search_text = data.get('searchText')
    search_order = data.get('searchOrder')
    point_type = data.get('pointType')
    t_time = data.get('t_time')
    if not t_time:
        t_time = None
    result = pt_get_cloud_point(project_id, current_page, page_size, search_text, point_type, search_order, t_time)

    return Utils.beop_response_success(result)


def clear_mapping_point(point_item):
    if point_item and point_item.get('params') and point_item.get('params').get('mapping'):
        point_item.get('params')['mapping']['val_time'] = ''
        point_item.get('params')['mapping']['val'] = ''
        point_item.get('params')['mapping']['remark'] = ''


def pt_get_cloud_point(project_id, current_page, page_size, search_text='', point_flag=None, search_order=None,
                       t_time=None):
    try:
        project_id = int(project_id)
    except ValueError:
        return {
            'pointTable': [],
            'pointTotal': 0
        }

    begin_time = datetime.now()

    pt = PointTable(project_id)
    start_num = (current_page - 1) * page_size

    point_table, point_total = pt.search_point(PointTableSourceType.TYPE_CLOUD, search_text, order=search_order,
                                               start_num=start_num, page_size=page_size, point_flag=point_flag)
    if not point_total:
        return {
            'pointTable': [],
            'pointTotal': 0
        }

    real_time_point_list = []
    if point_flag == CloudPointType.MAPPING_POINT:
        for point in point_table:
            if point.get('params') and point.get('params').get('mapping'):
                real_time_point_list.append(point.get('params').get('mapping').get('point'))
    else:
        for point in point_table:
            real_time_point_list.append(point.get('value'))

    rtd = RealTimeData(project_id)
    rtd_map = {}
    if real_time_point_list:
        rtd_map = rtd.get_all_data_map(point_flag, real_time_point_list)

    if t_time is not None:
        from beopWeb.BEOPDataAccess import BEOPDataAccess

        his = BEOPDataAccess.getInstance().get_history_data_padded(project_id,
                                                                   [point.get('value') for point in point_table],
                                                                   t_time, t_time, 'm5')
        if his:
            # n_point={}
            points = {}
            for item in his:
                if 'error' in item:
                    rt = None
                else:
                    if 'history' in item:
                        h = item.get('history', [])
                        n = item.get('name').strip()
                        if h and len(h) > 0:
                            if point_flag is not None:
                                point_flag = int(point_flag)

                            points[n] = {'pointvalue': h[0].get('value'), 'time': h[0].get('time')[0:-3],
                                         'pointname': n,
                                         'flag': point_flag}
                        else:
                            points[n] = 'None'
                            # n_point.append(point)
            rtd_map = points

    user = User()
    user_map = user.get_all_user_map()
    for point in point_table:
        if point.get('modify_by') is not None:
            try:
                user = user_map.get(int(point.get('modify_by')))
                if user:
                    point['modify_by'] = user.get('userfullname')
                params = point.get('params')

                # 云点实时值
                map_point_name = None
                if params and not params.get('flag'):
                    if params.get('mapping'):
                        map_point_name = params.get('mapping').get('point').strip()
                else:
                    map_point_name = point.get('value').strip()
                if map_point_name and rtd_map.get(map_point_name):
                    point['pointValue'] = rtd_map.get(map_point_name).get('pointvalue')
                    point['pointTime'] = rtd_map.get(map_point_name).get('time')
            except:
                point['modify_by'] = point.get('modify_by')
        else:
            point['modify_by'] = ''

    result = {
        'pointTable': point_table,
        'pointTotal': point_total
    }

    if t_time is not None:
        point_table_temp = []
        point_total_temp = 0
        for point in point_table:
            if point.get('pointTime') is not None:
                point_table_temp.append(point)
                point_total_temp = point_total_temp + 1
        result = {
            'pointTable': point_table_temp,
            'pointTotal': point_total_temp
        }
    end_time = datetime.now()
    logging.info('cloud points total search time ' + str(end_time - begin_time))
    return result


@bp_pointTool.route('/addCloudPoints/<int:project_id>/', methods=['POST'])
def pt_add_cloud_points(project_id):
    rt = {}
    error_rt = []
    point_name_list = []
    user_id = AuthManager.get_userId()
    if not user_id:
        return redirect(url_for('login'))
    data = request.form
    data = data.to_dict()
    logic = data.get('logic')
    pt = PointTable(project_id)
    if logic:
        for x in logic.split('def main_')[1:]:
            point_name = x.split(':')[0].replace('()', '')
            data['value'] = point_name

            point_name_list.append(point_name)
            if pt.is_exists(point_name, PointTableSourceType.TYPE_CLOUD, point_id=None):
                error_rt.append(point_name)

        # 判断批量代码中是否有重复点名
        x = dict(Counter(point_name_list))
        k_list = [str(k) for k, v in x.items() if v > 1]
        error_rt = error_rt + k_list

        if len(error_rt) > 0:
            return Utils.beop_response_error(data=error_rt, msg='EXISTS_CLOUD_POINT')

        for x in logic.split('def main_')[1:]:
            point_name = x.split(':')[0].replace('()', '')
            module_name = "calcpoint_%s_%s" % (project_id, point_name,)
            x = x.replace(point_name, 'def main', 1)
            data['logic'] = x
            data['moduleName'] = module_name
            data['value'] = point_name
            rt[point_name] = pt_add_cloud_point_do(project_id, user_id, data)
        if len(rt) > 0:
            allCloudToSitePoints = MongoConnManager.getConfigConn().getCloudPointSiteType(int(project_id))
            RedisManager.set_cloudpoints_site(int(project_id), allCloudToSitePoints)
            return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(msg='CODE_IS_EMTPY')


def pt_add_cloud_point_do(project_id, user_id, data):
    value = data.get('value')
    if not value or not value.strip():
        return Utils.beop_response_error(msg='point name is empty.')
    value = value.strip()
    pt = PointTable(project_id)

    flag = int(data.get('flag')) if data.get('flag') else CloudPointType.MAPPING_POINT

    point_model = {
        'projId': project_id,
        'value': value,
        'alias': data.get('alias'),
        'groupId': '',
        'type': PointTableSourceType.TYPE_CLOUD,
        'modify_by': user_id,
        'modify_time': datetime.now(),
        'note': '',
        'params': {
            'flag': flag
        }
    }

    if flag == CloudPointType.CALC_POINT:
        point_model.get('params').update({
            'logic': data.get('logic'),
            'isDelete': False,
            'format': data.get('format'),
            'moduleName': data.get('moduleName')
        })
    elif flag == CloudPointType.MAPPING_POINT:
        point_model.get('params').update({
            'mapping': {
                'point': data.get('mapping'),
                'by': user_id,
                'time': datetime.now()
            }
        })

    result = pt.add_point(point_model)

    if result and flag == CloudPointType.VIRTUAL_POINT:
        rtd = RealTimeData(project_id)
        rtd.add_data(value, data.get('point_value'), flag)

    if result:
        return point_model
    else:
        return {}


@bp_pointTool.route('/addCloudPoint/<int:project_id>/', methods=['POST'])
def pt_add_cloud_point(project_id):
    user_id = AuthManager.get_userId()
    if not user_id:
        return redirect(url_for('login'))
    value = request.form.get('value')
    if not value or not value.strip():
        return Utils.beop_response_error(msg='point name is empty.')
    value = value.strip()
    pt = PointTable(project_id)

    flag = int(request.form.get('flag')) if request.form.get('flag') else CloudPointType.MAPPING_POINT

    is_exists = pt.is_exists(value, PointTableSourceType.TYPE_CLOUD, point_id=None)
    if is_exists:
        return Utils.beop_response_error(msg='EXISTS_CLOUD_POINT')

    point_model = {
        'projId': project_id,
        'value': value,
        'alias': request.form.get('alias'),
        'groupId': '',
        'type': PointTableSourceType.TYPE_CLOUD,
        'modify_by': user_id,
        'modify_time': datetime.now(),
        'note': '',
        'params': {
            'flag': flag
        }
    }

    if flag == CloudPointType.CALC_POINT:
        point_model.get('params').update({
            'logic': request.form.get('logic'),
            'isDelete': False,
            'format': request.form.get('format'),
            'moduleName': request.form.get('moduleName')
        })
    elif flag == CloudPointType.MAPPING_POINT:
        point_model.get('params').update({
            'mapping': {
                'point': request.form.get('mapping'),
                'by': user_id,
                'time': datetime.now()
            }
        })

    result = pt.add_point(point_model)

    if result and flag == CloudPointType.VIRTUAL_POINT:
        rtd = RealTimeData(project_id)
        rtd.add_data(value, request.form.get('point_value'), flag)

    if result:
        if flag == CloudPointType.MAPPING_POINT:  # 刷新云点映射中不同点名的缓存
            allCloudToSitePoints = MongoConnManager.getConfigConn().getCloudPointSiteType(int(project_id))
            RedisManager.set_cloudpoints_site(int(project_id), allCloudToSitePoints)
        return Utils.beop_response_success(point_model)
    else:
        return Utils.beop_response_error()


@bp_pointTool.route('/editCloudPoint/<project_id>/', methods=['POST'])
def pt_edit_cloud_point(project_id):
    user_id = AuthManager.get_userId()
    if not user_id:
        return redirect(url_for('login'))
    value = request.form.get('value')

    if not value:
        return Utils.beop_response_error(msg='point name is empty.')

    point_id = request.form.get('id')

    flag = int(request.form.get('flag')) if request.form.get('flag') else CloudPointType.MAPPING_POINT

    value = value.strip()
    pt = PointTable(project_id)
    current_point = pt.get_point_by_id(point_id)
    if current_point.get('value').strip() != value:
        is_exists = pt.is_exists(value, PointTableSourceType.TYPE_CLOUD, point_id)
        if is_exists:
            return Utils.beop_response_error(msg='EXISTS_CLOUD_POINT')

    point_model = {
        '_id': ObjectId(request.form.get('id')),
        'projId': int(project_id),
        'value': value,
        'alias': request.form.get('alias'),
        'note': '',
        'groupId': '',
        'type': PointTableSourceType.TYPE_CLOUD,
        'modify_by': user_id,
        'modify_time': datetime.now(),
        'params': {
            'flag': flag
        }
    }

    if flag == CloudPointType.CALC_POINT:
        point_model.get('params').update({
            'logic': request.form.get('logic'),
            'isDelete': False,
            'name': request.form.get('name'),
            'format': request.form.get('format'),
            'moduleName': request.form.get('moduleName')
        })
    elif flag == CloudPointType.MAPPING_POINT:
        point_model.get('params').update({
            'mapping': {
                'point': request.form.get('mapping'),
                'by': user_id,
                'time': datetime.now()
            }
        })
    elif flag == CloudPointType.VIRTUAL_POINT:
        rtd = RealTimeData(project_id)
        old_name = request.form.get('oldName')
        if old_name:
            old_name = old_name.strip()
        update_data = {'pointvalue': request.form.get('point_value')}
        if value != old_name:
            update_data['pointname'] = value.strip()
        rtd.update_data(old_name, update_data, CloudPointType.VIRTUAL_POINT)

    result = pt.edit_point(request.form.get('id'), point_model)
    if result:
        if flag == CloudPointType.MAPPING_POINT:  # 刷新云点映射中不同点名的缓存
            allCloudToSitePoints = MongoConnManager.getConfigConn().getCloudPointSiteType(int(project_id))
            RedisManager.set_cloudpoints_site(int(project_id), allCloudToSitePoints)
        return Utils.beop_response_success(point_model)
    else:
        return Utils.beop_response_error()


@bp_pointTool.route('/autoSave/<project_id>/', methods=['POST'])
def pt_auto_save(project_id):
    user_id = AuthManager.get_userId()
    if not user_id:
        return redirect(url_for('login'))
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


@bp_pointTool.route('/deleteCloudPoint/<project_id>/', methods=['POST'])
def pt_delete_cloud_point(project_id):
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(msg='not login')

    data = request.get_json()
    if not data:
        if not data.get('points'):
            return Utils.beop_response_error()
        if not data.get('pointIds'):
            return Utils.beop_response_error()

    logging.warning(msg=str(user_id) + ' request to delete points ' + str(data.get('points')))

    pt = PointTable(project_id)
    id_list = data.get('pointIds')
    obid_list = [ObjectId(item) for item in id_list]
    result = pt.delete_points(obid_list, PointTableSourceType.TYPE_CLOUD)

    rtd = RealTimeData(project_id)
    rtd.delete_data(data.get('points'))
    if result:
        allCloudToSitePoints = MongoConnManager.getConfigConn().getCloudPointSiteType(int(project_id))
        RedisManager.set_cloudpoints_site(int(project_id), allCloudToSitePoints)
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


@bp_pointTool.route('/deleteCloudPoint/all/<int:project_id>/', methods=['POST'])
def pt_delete_cloud_point_all(project_id):
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(msg='not login')
    logging.warning(msg=str(user_id) + ' request to delete all points in project %s' % (str(project_id),))
    pt = PointTable(project_id)
    result = pt.delete_all_scene()

    rtd = RealTimeData(project_id)
    rtd.delete_data_all()
    if result:
        allCloudToSitePoints = MongoConnManager.getConfigConn().getCloudPointSiteType(int(project_id))
        RedisManager.set_cloudpoints_site(int(project_id), allCloudToSitePoints)
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


@bp_pointTool.route('/searchCloudPoint/<project_id>/<path:text>/', methods=['GET'])
@bp_pointTool.route('/searchCloudPoint/<project_id>/<int:current_page>/<int:page_size>/', methods=['GET'])
@bp_pointTool.route('/searchCloudPoint/<project_id>/<int:current_page>/<int:page_size>/<path:text>/', methods=['GET'])
def pt_search_cloud_point_page(project_id, current_page=1, page_size=None, text=''):
    pt = PointTable(project_id)
    start_num = None
    if page_size:
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


@bp_pointTool.route('/convertToCloud', methods=['POST'])
def convert_to_cloud():
    user_id = AuthManager.get_userId()
    if not user_id:
        return redirect(url_for('login'))
    rq_data = request.get_json()
    project_id = rq_data.get('projectId')
    convert_type = rq_data.get('type')
    pt = PointTable(project_id)
    convert_point_num = pt.convert_engine_point_to_cloud_point(user_id, convert_type)
    if convert_point_num is not None:
        return Utils.beop_response_success(convert_point_num)
    else:
        return Utils.beop_response_error()


@bp_pointTool.route('/get/objectid/<num>', methods=['GET'])
def get_objectId(num):
    rt = []
    try:
        for x in range(int(num)):
            rt.append(ObjectId().__str__())
    except Exception as e:
        print('get_objectId error:' + e.__str__())
        logging.error('get_objectId error:' + e.__str__())
    return jsonify(data=rt)


@bp_pointTool.route('/syncCloudPoint', methods=['POST'])
def sync_cloud_point():
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(msg='not login')
    post_data = request.get_json()
    project_id = post_data.get('projectId')
    if not project_id:
        return Utils.beop_response_error(msg='no project id')
    pt = PointTable(project_id)
    result = pt.sync_cloud_points(user_id)
    allCloudToSitePoints = MongoConnManager.getConfigConn().getCloudPointSiteType(int(project_id))
    RedisManager.set_cloudpoints_site(int(project_id), allCloudToSitePoints)
    return Utils.beop_response_success(result)


@bp_pointTool.route('/clearCloudPoints/', methods=['POST'])
def clear_cloud_points():
    user_id = AuthManager.get_userId()
    if not user_id:
        return redirect(url_for('login'))
    post_data = request.get_json()
    project_id = post_data.get('projectId')
    flag = post_data.get('flag')
    if not project_id:
        return Utils.beop_response_error(msg='no project id')
    pt = PointTable(project_id)
    pt.clear_cloud_points(flag)
    allCloudToSitePoints = MongoConnManager.getConfigConn().getCloudPointSiteType(int(project_id))
    RedisManager.set_cloudpoints_site(int(project_id), allCloudToSitePoints)
    return Utils.beop_response_success()


@bp_pointTool.route('/dataSyncCheck/<project_id>', methods=["GET"])
def project_data_synchronization_check(project_id):
    try:
        project_id = int(project_id)
    except Exception as e:
        return Utils.beop_response_error(msg="project_id is not a int")

    sql = "SELECT mysqlname FROM project WHERE id=%s" % (project_id)
    rv = BEOPMySqlDBContainer().op_db_query(app.config.get("DATABASE", "beopdoengine"), sql)
    return Utils.beop_response_success({"dataSync": True if rv else False})


@bp_pointTool.route('/setPJRealityTable', methods=["POST"])
def set_pj_reality_table():
    req = request.get_json()
    mysqlname = req.get("mysqlname")
    projectId = req.get("projectId")
    if not projectId or not mysqlname:
        return Utils.beop_response_error()

    try:
        projectId = int(projectId)
    except Exception as e:
        return Utils.beop_response_error(msg="project_id is not a int")

    sql = "UPDATE project SET mysqlname=%s WHERE id=%s"
    BEOPMySqlDBContainer().op_db_update(app.config.get("DATABASE", "beopdoengine"), sql,
                                        ('beopdata_' + mysqlname, projectId))
    return Utils.beop_response_success()


@bp_pointTool.route('/setDtuRemark', methods=["POST"])
def set_dtu_remark():
    req = request.get_json()
    remark = req.get("remark")
    id = req.get("id")
    dsp = DtuServerProject(id)
    rv = dsp.set_dtu_remark(remark)
    if rv:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()
