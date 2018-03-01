import csv
import requests
from collections import Counter
import os
from datetime import datetime

from flask import request, Response, redirect, url_for, jsonify
from bson import ObjectId
from xlrd import open_workbook

from beopWeb.mod_cxTool import bp_pointTool
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_admin.Project import Project
from beopWeb.mod_cxTool.PointTable import PointTable, PointTableSourceType, CloudPointType
from beopWeb.mod_admin.RealTimeData import RealTimeData
from beopWeb.mod_admin.User import User
from beopWeb.AuthManager import AuthManager
from beopWeb.BEOPMySqlDBContainer import *
from beopWeb.mod_common.Exceptions import InvalidPointsExcel
from beopWeb.models import ExcelFile
from beopWeb.MongoConnManager import MongoConnManager
from beopWeb.mod_memcache.RedisManager import RedisManager
from beopWeb.mod_cxTool.dtuserver_prj import DtuServerProject
from beopWeb.mod_common.PyChecker import check_py_string
from beopWeb.BEOPDataAccess import BEOPDataAccess


def convert_csv_to_point_dict(lines, project_id, source_type, user_id=None):
    # 解析CSV点表
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


def convert_sheet_to_virtual_point_dict(sheet, project_id):
    # 解析excel点表, 生成虚拟点列表
    keys = [sheet.cell(0, col_index).value for col_index in range(sheet.ncols)]
    dict_list = []
    for row_index in range(1, sheet.nrows):
        item = {'projId': project_id, 'alias': '',
                'groupId': '', 'type': PointTableSourceType.TYPE_CLOUD, 'note': '',
                'params': {'flag': CloudPointType.VIRTUAL_POINT}
                }
        for col_index in range(sheet.ncols):
            key = keys[col_index].strip()
            if isinstance(sheet.cell(row_index, col_index).value, float):
                value = str(int(sheet.cell(row_index, col_index).value))
            else:
                value = str(sheet.cell(row_index, col_index).value).strip()

            if key == 'name' or key == 'point':
                item['value'] = value
                continue

            if key == 'remark':
                item['alias'] = value
                continue

            if key == 'value':
                if not item.get('params'):
                    item['params'] = {}
                item.get('params')['oldValue'] = value

        dict_list.append(item)

    return dict_list


def convert_csv_to_virtual_point_dict(lines, project_id):
    # 解析csv点表, 生成虚拟点列表
    keys = lines[0]
    dict_list = []
    for line_index, line in enumerate(lines):
        if line_index == 0:
            continue
        item = {'projId': project_id, 'alias': '',
                'groupId': '', 'type': PointTableSourceType.TYPE_CLOUD, 'note': '',
                'params': {'flag': CloudPointType.VIRTUAL_POINT}
                }
        for key_index, key in enumerate(keys):
            value = line[key_index].strip()
            if key == 'point' or key == 'name':
                item['value'] = value
            elif key == 'remark':
                item['alias'] = value

            if key == 'value':
                if not item.get('params'):
                    item['params'] = {}
                item.get('params')['oldValue'] = value
        dict_list.append(item)
    return dict_list


def convert_sheet_to_point_dict(sheet, project_id, source_type, user_id=None):
    # 解析excel点表
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


@bp_pointTool.route('/cloudPoint/import/', methods=['POST'])
def pt_cloud_point_import():
    """
    导入云点
    """
    file = request.files.get('file')
    if not file:
        return Utils.beop_response_error('there is no upload file')
    project_id = int(request.form.get('projectId'))
    flag = int(request.form.get('flag')) if request.form.get('flag') is not None else None
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(msg='not login')
    # 临时保存点表
    file_path = os.path.join(os.path.abspath('.'), 'cloudPointTable', str(user_id), str(project_id))
    if not os.path.exists(file_path):
        os.makedirs(file_path, exist_ok=True)
    file.filename = datetime.now().strftime(Utils.datetime_format_full_file_name) + os.path.splitext(file.filename)[1]
    full_path = os.path.join(file_path, file.filename)
    file.save(full_path)
    # 解析xlsx或者xls点表
    try:
        dict_list = []
        if full_path.endswith('xlsx') or full_path.endswith('xls'):
            workbook = open_workbook(full_path)
            sheet = workbook.sheet_by_index(0)
            if flag == CloudPointType.MAPPING_POINT:
                dict_list = convert_sheet_to_point_dict(sheet, project_id, PointTableSourceType.TYPE_CLOUD, user_id)
            else:
                dict_list = convert_sheet_to_virtual_point_dict(sheet, project_id)
        elif full_path.endswith('csv'):
            with open(full_path, 'r', encoding='utf8') as csvfile:
                reader = csv.reader(csvfile)
                lines = []
                for line in reader:
                    if line:
                        lines.append(line)
                if flag == CloudPointType.MAPPING_POINT:
                    dict_list = convert_csv_to_point_dict(lines, project_id, PointTableSourceType.TYPE_CLOUD, user_id)
                else:
                    dict_list = convert_csv_to_virtual_point_dict(lines, project_id)
        modify_time = datetime.now().strftime(Utils.datetime_format_full)

        # get site point and calc point
        collection = MongoConnManager.getConfigConn().mdbBb['DataSourceAdditional']
        if flag == 1:
            value_return = collection.find(
                {'projId': project_id, 'type': 4, 'groupId': {'$in': [None, '']}, 'params.flag': {'$in': [0, 2]}},
                {'value': 1, '_id': 0})
        elif flag == 0:
            value_return = collection.find(
                {'projId': project_id, 'type': 4, 'groupId': {'$in': [None, '']}, 'params.flag': {'$in': [1, 2]}},
                {'value': 1, '_id': 0})
        else:
            return Utils.beop_response_error(msg='error flag')
        value_list = [d['value'] for d in value_return]
        duplicated_list = []

        for i, item in enumerate(dict_list):
            item['modify_by'] = user_id
            item['modify_time'] = modify_time
            # delete duplicated item
            if item['value'] in value_list:
                duplicated_list.append(item['value'])
                del dict_list[i]

        if duplicated_list:
            return Utils.beop_response_error(
                msg='duplicated name in site points or calc points', data={'duplicated': duplicated_list}, code='2')

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
        # 导入到数据库
        pt.import_data_to_db(dict_list, PointTableSourceType.TYPE_CLOUD)
        if flag == CloudPointType.VIRTUAL_POINT:
            rtd = RealTimeData(project_id)
            for item in dict_list:
                point_value = item.get('params').get('oldValue')
                update_data = {'pointvalue': point_value, 'pointname': item.get('value')}
                rtd.update_data(item.get('value'), update_data, CloudPointType.VIRTUAL_POINT)
        return Utils.beop_response_success(data={'duplicated': []}, code='1')
    except Exception as e:
        logging.error('导入点表' + str(e))
        return Utils.beop_response_error()


@bp_pointTool.route('/export/cloud/<project_id>/<int:point_type>', methods=['GET'])
def pt_cloud_export(project_id, point_type):
    """
    导出点表
    David modify 20161009
    :param project_id:
    :param point_type:
    :return:
    """
    project_db = Project()
    project = project_db.get_project_by_id(project_id, 'name_en')
    pt = PointTable(project_id)
    result, total = pt.get_point_table(PointTableSourceType.TYPE_CLOUD, flag=point_type)

    if not result:
        return Utils.beop_response_error()
    if CloudPointType.MAPPING_POINT == point_type:
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
    elif CloudPointType.VIRTUAL_POINT == point_type:
        rtd = RealTimeData(project_id)
        rtd_map = rtd.get_all_data_map(CloudPointType.VIRTUAL_POINT, [point.get('value') for point in result])
        excelData = ExcelFile('point', 'remark', 'value')

        for item in result:
            if rtd_map.get(item.get('value')):
                row_data = [item.get('value', 'error'), item.get('alias'),
                            rtd_map.get(item.get('value')).get('pointvalue')]
            else:
                row_data = [item.get('value', 'error'), item.get('alias'), '']

            excelData.append_row(row_data)
    else:
        return Utils.beop_response_error()
    return Response(excelData.data.xlsx,
                    headers={"Content-disposition": "attachment; filename={filename}.xlsx".format(
                        filename=project.get('name_en'))})


@bp_pointTool.route('/getCloudPointTable/', methods=['POST'])
def pt_get_cloud_point_table():
    """
    获得点列表
    """
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
    # 搜索点表
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
    # 获得实时数据
    rtd = RealTimeData(project_id)
    rtd_map = {}
    if real_time_point_list:
        rtd_map = rtd.get_all_data_map(point_flag, real_time_point_list)

    if t_time is not None:
        from beopWeb.BEOPDataAccess import BEOPDataAccess

        his = BEOPDataAccess.getInstance().get_history_data_padded(
            project_id, [point.get('value') for point in point_table], t_time, t_time, 'm5')
        if his:
            # n_point={}
            points = {}
            for item in his:
                if 'error' in item:
                    pass
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
    # 用户映射表
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

        point['commentCount'] = len(point.get('comments')) if point.get('comments') else 0
        if point.get('comments'):
            del point['comments']

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
    logging.debug('cloud points total search time ' + str(end_time - begin_time))
    return result


@bp_pointTool.route('/addCloudPoints/<int:project_id>/', methods=['POST'])
def pt_add_cloud_points(project_id):
    """
    添加云点
    :param project_id: 项目ID
    """
    user_id = AuthManager.get_userId()
    if not user_id:
        return redirect(url_for('login'))
    data = request.form
    data = data.to_dict()
    return do_test__dataManager_remove(data,project_id,user_id)



def do_test__dataManager_remove(data,project_id,user_id):
    rt = {}
    error_rt = []
    point_name_list = []
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
        if True in pt.is_conflict(point_name_list):
            return Utils.beop_response_error(msg='CONFLICT_WITH_API_NAME')
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
        'create_by': user_id,
        'create_time': datetime.now(),
        'note': '',
        'params': {
            'flag': flag
        }
    }
    # 根据云点类型不同, 更新不同的字段
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
    """
    添加云点
    :param project_id: 项目ID
    """
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
    if pt.is_conflict(value):
        return Utils.beop_response_error(msg='CONFLICT_WITH_API_NAME')
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
        'create_by': user_id,
        'create_time': datetime.now(),
        'note': '',
        'params': {
            'flag': flag
        }
    }
    # 根据云点类型不同, 更新不同的字段
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
    elif flag == CloudPointType.VIRTUAL_POINT:
        point_model['pointValue'] = request.form.get('point_value')

    result = pt.add_point(point_model)

    if result and flag == CloudPointType.VIRTUAL_POINT:
        rtd = RealTimeData(project_id)
        rtd.add_data(value, request.form.get('point_value'), flag)

    if result:
        if flag == CloudPointType.MAPPING_POINT:  # 刷新云点映射中不同点名的缓存
            allCloudToSitePoints = MongoConnManager.getConfigConn().getCloudPointSiteType(int(project_id))
            RedisManager.set_cloudpoints_site(int(project_id), allCloudToSitePoints)
        MongoConnManager.getConfigConn().InsertCloudPointOperationLog(project_id, user_id, [value], 'add',
                                                                      False)
        return Utils.beop_response_success(point_model)
    else:
        return Utils.beop_response_error()


@bp_pointTool.route('/editCloudPoint/<project_id>/', methods=['POST'])
def pt_edit_cloud_point(project_id):
    """
    编辑云点
    :param project_id: 项目ID
    """
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
    if current_point and current_point.get('value').strip() != value:
        if pt.is_conflict(value):
            return Utils.beop_response_error(msg='CONFLICT_WITH_API_NAME')
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
    # 根据云点类型不同, 更新不同的字段
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
        point_model['pointValue'] = request.form.get('point_value')
    url = '%scalcpoint/triggerOneCalculation/%s' % (app.config['EXPERT_CONTAINER_URL'], project_id)
    headers = {"content-type": 'application/json'}
    requests.get(url=url, headers=headers)
    result = pt.edit_point(request.form.get('id'), point_model)
    if result:
        if flag == CloudPointType.MAPPING_POINT:  # 刷新云点映射中不同点名的缓存
            allCloudToSitePoints = MongoConnManager.getConfigConn().getCloudPointSiteType(int(project_id))
            RedisManager.set_cloudpoints_site(int(project_id), allCloudToSitePoints)
        MongoConnManager.getConfigConn().InsertCloudPointOperationLog(project_id, user_id, [value], 'edit',
                                                                      False)
        return Utils.beop_response_success(point_model)
    else:
        return Utils.beop_response_error()


@bp_pointTool.route('/deleteCloudPoint/<project_id>/', methods=['POST'])
def pt_delete_cloud_point(project_id):
    """
    删除项目中点
    :param project_id: 项目ID
    """
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
    if not rtd.delete_data(data.get('points')):
        return Utils.beop_response_error(msg='buffer表删除失败，请立即再次调用删除接口')
    if result:
        allCloudToSitePoints = MongoConnManager.getConfigConn().getCloudPointSiteType(int(project_id))
        RedisManager.set_cloudpoints_site(int(project_id), allCloudToSitePoints)
        MongoConnManager.getConfigConn().InsertCloudPointOperationLog(
            project_id, user_id, data.get('points'), 'delete', False)
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


@bp_pointTool.route('/deleteCloudPoint/all/<int:project_id>/', methods=['POST'])
def pt_delete_cloud_point_all(project_id):
    """
    删除全部现场点
    :param project_id: 项目ID
    """
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
        MongoConnManager.getConfigConn().InsertCloudPointOperationLog(project_id, user_id, [], 'delete',
                                                                      True)
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


@bp_pointTool.route('/searchCloudPoint/<project_id>/<path:text>/', methods=['GET'])
@bp_pointTool.route('/searchCloudPoint/<project_id>/<int:current_page>/<int:page_size>/', methods=['GET'])
@bp_pointTool.route('/searchCloudPoint/<project_id>/<int:current_page>/<int:page_size>/<path:text>/', methods=['GET'])
def pt_search_cloud_point_page(project_id, current_page=1, page_size=None, text=''):
    """
    搜索云点
    :param project_id: 项目ID
    :param current_page: 当前页码
    :param page_size: 每页多少项
    :param text: 搜索关键字
    :return: 点列表
    """
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
    """
    同步现场点
    """
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
    """
    清空点表
    """
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


@bp_pointTool.route('/setPJRealityTable', methods=["POST"])
def set_pj_reality_table():
    """
    设置项目的实时数据库
    """
    req = request.get_json()
    mysqlname = req.get("mysqlname")
    projectId = req.get("projectId")
    if not projectId or not mysqlname:
        return Utils.beop_response_error()

    try:
        projectId = int(projectId)
    except Exception:
        return Utils.beop_response_error(msg="project_id is not a int")

    sql = "UPDATE project SET mysqlname=%s WHERE id=%s"
    BEOPMySqlDBContainer().op_db_update(app.config.get("DATABASE", "beopdoengine"), sql,
                                        ('beopdata_' + mysqlname, projectId))
    return Utils.beop_response_success()


@bp_pointTool.route('/setDtuRemark', methods=["POST"])
def set_dtu_remark():
    """
    设置DTU的注释信息
    :return:
    """
    req = request.get_json()
    remark = req.get("remark")
    dtu_id = req.get("id")
    dsp = DtuServerProject(dtu_id)
    rv = dsp.set_dtu_remark(remark)
    if rv:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()

def saveOpLogToMongo(req,oldValue):
    try:
        operateField=req.get("type")
        newValue=req.get("value")
        dtuId=req.get("id")
        opType="修改"
        userId = request.cookies.get("userId")
        utcTime=time.strftime("%Y-%m-%d %H:%M:%S",time.gmtime())
        dbname=BEOPDataAccess.getInstance().getDbnameByDtuId(dtuId)
        log={'opField':operateField,'oldvalue':oldValue,'newValue':newValue}
        MongoConnManager.getConfigConn().insertTerminalOpLog(dbname,dtuId,opType,userId,utcTime,log)
    except Exception as e:
        print(e.__str__())
        logging.error(e.__str__())

@bp_pointTool.route('/setDtuInfo', methods=["POST"])
def set_dtu_info():
    req = request.get_json()
    operateField = req.get("type")
    dtuId=req.get("id")
    if operateField == 'dbname':
        oldValue = BEOPDataAccess.getInstance().getDbnameByDtuId(dtuId)
        logging.info('CRITICAL! Setting dbname of DTU: %s', req)
    elif operateField == "dtuRemark":
        oldValue = BEOPDataAccess.getInstance().getDtuRemarkByDtuId(dtuId)
    elif operateField == "timeZone":
        oldValue = BEOPDataAccess.getInstance().getTimeZoneByDtuId(dtuId)
    elif operateField == "bSendData":
        oldValue = BEOPDataAccess.getInstance().getBSendDataByDtuId(dtuId)
    value = req.get('value')
    dtu_id = req.get("id")
    dsp = DtuServerProject(dtu_id)
    rv = dsp.set_dtu_info(operateField, value)
    if rv:
        saveOpLogToMongo(req,oldValue)
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


@bp_pointTool.route('/upVote/', methods=['POST'])
def pt_up_vote():
    """
    点表中的数据质量赞同投票
    """
    user_id = AuthManager.get_userId()
    if not user_id:
        return redirect(url_for('login'))
    req = request.get_json()
    point_id = req.get("pointId")

    pt = PointTable()
    pt.up_vote_point(user_id, point_id)
    point = pt.get_point_by_id(point_id)
    return Utils.beop_response_success(point)


@bp_pointTool.route('/downVote/', methods=['POST'])
def pt_down_vote():
    """
    点表中的数据质量反对投票
    """
    user_id = AuthManager.get_userId()
    if not user_id:
        return redirect(url_for('login'))
    req = request.get_json()
    point_id = req.get("pointId")
    pt = PointTable()
    pt.down_vote_point(user_id, point_id)
    point = pt.get_point_by_id(point_id)
    return Utils.beop_response_success(point)


@bp_pointTool.route('/cancelVote/', methods=['POST'])
def pt_cancel_vote():
    """
    取消点表中的数据质量投票
    """
    user_id = AuthManager.get_userId()
    if not user_id:
        return redirect(url_for('login'))
    req = request.get_json()
    point_id = req.get("pointId")
    pt = PointTable()
    pt.cancel_vote_point(user_id, point_id)
    point = pt.get_point_by_id(point_id)
    return Utils.beop_response_success(point)


@bp_pointTool.route('/comments/', methods=['POST'])
def pt_get_comments():
    """
    获取点表中的回复
    """
    user_id = AuthManager.get_userId()
    if not user_id:
        return redirect(url_for('login'))
    req = request.get_json()
    point_id = req.get("pointId")
    pt = PointTable()
    return Utils.beop_response_success(pt.get_point_comments(point_id))


@bp_pointTool.route('/comments/add/', methods=['POST'])
def pt_add_comments():
    """
    添加点表中的回复
    """
    user_id = AuthManager.get_userId()
    if not user_id:
        return redirect(url_for('login'))
    req = request.get_json()
    point_id = req.get("pointId")
    content = req.get("content")
    if not point_id or not content:
        return Utils.beop_response_error(msg="point id or content is empty.")
    pt = PointTable()
    result = pt.add_comments(point_id, user_id, content)
    if result:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


@bp_pointTool.route('/comments/delete/', methods=['POST'])
def pt_delete_comments():
    """
    删除点表中的回复
    """
    user_id = AuthManager.get_userId()
    if not user_id:
        return redirect(url_for('login'))
    req = request.get_json()
    comment_id = req.get("commentId")
    point_id = req.get("pointId")
    if not comment_id:
        return Utils.beop_response_error(msg="comment id or content is empty.")
    pt = PointTable()
    result = pt.delete_comments(point_id, comment_id)
    if result:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


@bp_pointTool.route('/versions/', methods=['POST'])
def pt_versions():
    user_id = AuthManager.get_userId()
    if not user_id:
        return redirect(url_for('login'))
    req = request.get_json()
    return Utils.beop_response_success(PointTable().get_versions(req.get("pointId")))


@bp_pointTool.route('/check/', methods=['POST'])
def check_grammar():
    """
    检查计算点python代码语法
    :return:
    """
    req = request.get_json()
    code = req.get('code')
    try:
        check_py_string(code)
    except Exception as e:
        error = {
            'lineno': e.args[0].exc_value.lineno,
            'offset': e.args[0].exc_value.offset,
            'msg': e.args[0].exc_value.msg
        }
        return Utils.beop_response_error(code=e.args[0].exc_type_name, data=error)
    return Utils.beop_response_success()


# noinspection PyShadowingNames
@bp_pointTool.route('/point/<point_info>', methods=['GET'])
def point_info(point_info):
    """
    根据ID或者name获得点的信息
    :param point_info:
    :return:
    """
    pt = PointTable()
    if ObjectId.is_valid(point_info):  # by id
        return Utils.beop_response_success(pt.get_point_by_id(point_info))
    else:  # by name
        return Utils.beop_response_success(pt.get_point_by_name(point_info, PointTableSourceType.TYPE_CLOUD))
