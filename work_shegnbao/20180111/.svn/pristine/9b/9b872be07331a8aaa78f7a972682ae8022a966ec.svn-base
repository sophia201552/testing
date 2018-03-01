import os
import csv
import time
import json
import requests
from bson import ObjectId
from xlrd import open_workbook
from datetime import datetime
from flask import request,jsonify
from flask import render_template
from flask import Response
from beopWeb.mod_modbus import bp_modbus
from beopWeb.mod_modbus import bp_terminal
from beopWeb.mod_common.Utils import Utils
from beopWeb.AuthManager import AuthManager
from beopWeb.mod_cxTool.dtuserver_prj import DtuServerProject
from beopWeb.mod_common.Exceptions import InvalidPointsExcel
from beopWeb.mod_admin import User
from beopWeb import app
from beopWeb.mod_admin.Project import Project
from beopWeb.models import ExcelFile


#解析csv文件
def convertCsvFileToPointDict(lines, project_id, source_type, user_id,dtuName):
    keys = lines[0]  # 获取表头信息
    dict_list = []
    value_dic = {}   # 用来判断是否有重复的点或者空点
    fail_dict = {
        'duplicated': [],
        'empty': []
    }
    for line_index, line in enumerate(lines): #enumerate的作用是同时需要index和value，
        if line_index == 0:
            continue
        item = {'projId': project_id, 'pointName': '', 'create_by': user_id,'create_time':datetime.strftime(datetime.now(), '%Y-%m-%d %H:%M:%S'),'type': source_type,'dtuName':dtuName}
        params = {}
        for key_index, key in enumerate(keys):
            value = line[key_index].strip() #删除空字符
            if key == 'physicalid' or key == 'pointName':
                if not value:
                    fail_dict['empty'].append(str(line_index))
                    continue
                if value in value_dic:
                    fail_dict['duplicated'].append(str(line_index) + ' ' + value)
                    continue
                else:
                    item['pointName'] = value
                    value_dic[value] = True
            elif key == 'note' or key == 'remark':
                params['note'] = value
            elif key == 'pointType':
                params[key] = value
            elif key == 'slaveId':
                params[key] = value
            elif key == 'address':
                params[key] = value
            elif key == 'functionCode':
                params[key] = value
            elif key == 'multiple':
                params[key] = value
            elif key == 'dataType':
                params[key] = value
            elif key == 'dataLength':
                params[key] = value
            elif key == 'refreshCycle':
                params[key] = value
            else:
                return []
        item['params'] = params
        dict_list.append(item)
    if fail_dict.get('empty') or fail_dict.get('duplicated'):
        raise InvalidPointsExcel(fail_dict)
    return dict_list

#解析Excel文件
def convertExcelSheetToPointDict(sheet, project_id, source_type,user_id,dtuName):
    keys = [sheet.cell(0, col_index).value for col_index in range(sheet.ncols)] #将列名传入list中：sheet.cell（row_index,col_index）通过坐标获取值。
    dict_list = []
    value_dic = {}  # 用来判断是否有重复的点或者空点
    fail_dict = {
        'duplicated': [],
        'empty': []
    }
    for row_index in range(1, sheet.nrows):  # 读行索引
        item = {'projId': project_id, 'pointName': '', 'create_by': user_id, 'create_time':datetime.strftime(datetime.now(), '%Y-%m-%d %H:%M:%S'),'type': source_type,'dtuName':dtuName}
        params = {}
        for col_index in range(sheet.ncols): #遍历列数,获取列索引
            key = keys[col_index]             #得到列名
            value = sheet.cell(row_index, col_index).value      #sheet.cell（row_index,col_index).value通过坐标获取值
            if key == 'physicalid' or key == 'pointName':
                if not value:
                    fail_dict['empty'].append(str(row_index - 1))
                    continue
                if value in value_dic:
                    fail_dict['duplicated'].append(str(row_index - 1) + ' ' + value)
                    continue
                else:
                    value_dic[value] = True
                    item['pointName'] = value
                continue
            elif key == 'note' or key == 'remark':
                params['note'] = value
            elif key == 'pointType':
                params[key] = value
            elif key == 'slaveId':
                params[key] = value
            elif key == 'address':
                params[key] = value
            elif key == 'functionCode':
                params[key] = value
            elif key == 'multiple':
                params[key] = value
            elif key == 'dataType':
                params[key] = value
            elif key == 'dataLength':
                params[key] = value
            elif key == 'refreshCycle':
                params[key] = value
            else:
                return []
        item['params'] = params
        dict_list.append(item)
    if fail_dict.get('empty') or fail_dict.get('duplicated'):
        raise InvalidPointsExcel(fail_dict)
    return dict_list

#生成dtu名
@bp_modbus.route('/api/v1/getDTUName', methods=['POST'])
def getDTUName():
    try:
        path = request.path
        form = request.get_json()
        method = request.method
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
    except Exception as e:
        rv = dict(success = False,msg = e.__str__(),code = '',data = {})
    return jsonify(rv)

#创建dtu
@bp_modbus.route('/dtu/create',methods = ['POST'])
@bp_terminal.route('/obix/dtu/create',methods = ['POST'])
def createDtu():
    try:
        path = request.path
        form = request.get_json()
        method = request.method
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
    except Exception as e:
        rv = dict(success = False,msg = e.__str__(),code = '',data = {})
    return jsonify(rv)

#生成项目标识,数据库名
@bp_modbus.route('/project', methods=['POST'])
@bp_terminal.route('/project', methods=['POST'])
def getprodata():
    try:
        form = request.get_json() #form = None
        path = request.path
        method = request.method
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
    except Exception as e:
        rv = dict(success=False, msg=e.__str__(), code='', data={})
    return jsonify(rv)

#导入已有点表
@bp_modbus.route('/points/import/',methods = ['POST'])
@bp_terminal.route('/obixs/points/import/', methods=['POST'])
def importModbusPointTable():
    msg = ''
    form = {}
    source_type = 5
    success = True
    user_id = AuthManager.get_userId()
    dtuName = request.form.get('dtuName')
    print("dtuName: ",dtuName)
    if dtuName:
        project_id = int(request.form.get('projId'))
        if not user_id:
            return Utils.beop_response_error(msg='not login')
        file = request.files.get('file')            # 接收点表文件
        if not file:
            return Utils.beop_response_error('there is no upload file')
        file_path = os.path.join(os.path.abspath('.'), 'ModbusPointTable', str(user_id), str(project_id))
        if not os.path.exists(file_path):
            os.makedirs(file_path, exist_ok=True)
        file.filename = datetime.now().strftime(Utils.datetime_format_full_file_name) + os.path.splitext(file.filename)[1]
        full_path = os.path.join(file_path, file.filename)
        file.save(full_path)
        path = request.path
        method = request.method
        query_string = request.query_string
        try:
            userName = getUserNameByUserId(user_id)
            dict_list = []
            if full_path.endswith('xlsx') or full_path.endswith('xls'):
                workbook = open_workbook(full_path)
                sheet = workbook.sheet_by_index(0)
                dict_list = convertExcelSheetToPointDict(sheet, project_id, source_type, userName,dtuName)
            elif full_path.endswith('csv'):
                with open(full_path, 'r', encoding='utf8') as csvfile:
                    reader = csv.reader(csvfile)
                    lines = []
                    for line in reader:
                        if line:
                            lines.append(line)
                dict_list = convertCsvFileToPointDict(lines, project_id, source_type, userName,dtuName)
            modify_time = datetime.now().strftime(Utils.datetime_format_full)
            if dict_list:
                for item in dict_list:
                    item['modify_by'] = userName
                    item['modify_time'] = modify_time
                form['data'] = dict_list
                form['user'] = userName
                form['dtuName'] = dtuName
                rt = gotoBeopServiceProcess(path, method, form, query_string)
                if not rt.get('success'):
                    msg = rt.get('msg')
            else:
                msg = 'Analysis file failed: The file is empty or format error'
                success = False
        except InvalidPointsExcel as e:
            fail_list = e
            if fail_list.args[0].get('empty'):
                msg += '\nthere is empty row:No.' + ','.join(fail_list.args[0].get('empty')) + '\n'
            if fail_list.args[0].get('duplicated'):
                msg += '\nthere is duplicate row:\n' + '\n'.join(fail_list.args[0].get('duplicated')) + '\n'
            msg = 'import failed,invalid excel:' + msg
            success = False
    else:
        success = False
        msg = "Didn't find the DTU name!"
    rv = dict(success = success,msg = msg,code = '')
    return jsonify(rv)

#空dtu从已有数据dtu中复制
@bp_modbus.route('/dtu/copy',methods = ['POST'])
def copyExistDtuToEmptyDtu():
    try:
        path = request.path
        form = request.get_json()
        form['user'] = getUserNameByUserId(AuthManager.get_userId())
        method = request.method
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
    except Exception as e:
        rv = dict(success = False,msg = e.__str__(),code = '',data = {})
    return jsonify(rv)

#将一个dtu数据复制给其他目标dtu
@bp_modbus.route('/copy/dtus',methods = ['POST'])
def copyDtuDataToOtherDtu():
    try:
        path = request.path
        form = request.get_json()
        form['user'] = getUserNameByUserId(AuthManager.get_userId())
        method = request.method
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
    except Exception as e:
        rv = dict(success=False, msg=e.__str__(), code='', data={})
    return jsonify(rv)

#手动添加新点
@bp_modbus.route('/dtu/addPoint',methods = ['POST'])
@bp_terminal.route('/obix/dtu/updatePoint',methods = ['POST'])
def manualImportNewPoint():
    try:
        user_id = AuthManager.get_userId()
        if not user_id:
            return Utils.beop_response_error(msg='not login')
        path = request.path
        form = request.get_json()
        form['user'] = getUserNameByUserId(AuthManager.get_userId())
        method = request.method
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
    except Exception as e:
        rv = dict(success=False, msg=e.__str__(), code='', data={})
    return jsonify(rv)

#导出dtu列表
@bp_modbus.route('/dtu/list',methods = ['POST'])
@bp_terminal.route('/obix/dtu/list', methods=['POST'])
def getDtuPointDataList():
    try:
        path = request.path
        form = request.get_json()
        method = request.method
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
    except Exception as e:
        rv = dict(success=False, msg=e.__str__(), code='', data={})
    return jsonify(rv)

#删除选中dtu
@bp_modbus.route('/dtu/points/del',methods = ['POST'])
@bp_terminal.route('/obix/dtu/points/del', methods=['POST'])
def deleteSelectedPoint():
    try:
        path = request.path
        form = request.get_json()
        form['user'] = getUserNameByUserId(AuthManager.get_userId())
        method = request.method
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
    except Exception as e:
        rv = dict(success=False, msg=e.__str__(), code='', data={})
    return jsonify(rv)



#删除选中的点
@bp_modbus.route('/dtu/points/del/all',methods = ['POST'])
@bp_terminal.route('/obixs/dtu/points/del/all', methods=['POST'])
def deleteAllPoint():
    try:
        path = request.path
        form = request.get_json()
        form['user'] = getUserNameByUserId(AuthManager.get_userId())
        method = request.method
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
    except Exception as e:
        rv = dict(success=False, msg=e.__str__(), code='', data={})
    return jsonify(rv)

#删除dtu节点
@bp_modbus.route('/dtu/del',methods = ['POST'])
def deeleteDtuNode():
    try:
        form = request.get_json()
        path = request.path
        method = request.method
        form['user'] = getUserNameByUserId(AuthManager.get_userId())
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
    except Exception as e:
        rv = dict(success=False, msg=e.__str__(), code='', data={})
    return jsonify(rv)

#修改dtu前缀
@bp_modbus.route('/dtu/prefixName/update',methods = ['POST'])
def modfiyPrefixName():
    try:
        path = request.path
        form = request.get_json()
        form['user'] = getUserNameByUserId(AuthManager.get_userId())
        method = request.method
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
    except Exception as e:
        rv = dict(success = False,msg = e.__str__(),code = '',data = {})
    return jsonify(rv)

#获取全部日志
@bp_modbus.route('/log',methods = ['POST'])
def getAllLog():
    try:
        path = request.path
        form = request.get_json()
        method = request.method
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
    except Exception as e:
        rv = dict(success = False,msg = e.__str__(),code = '',data = {})
    return jsonify(rv)

#设备调试
@bp_modbus.route('/dtu/debug/equipment',methods = ['POST'])
def dtuEquipmentDebug():
    try:
        path = request.path
        form = request.get_json()
        form['user'] = getUserNameByUserId(AuthManager.get_userId())
        method = request.method
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
    except Exception as e:
        rv = dict(success = False,msg = e.__str__(),code = '',data = {})
    return jsonify(rv)

#命令调试
@bp_modbus.route('/dtu/debug/command',methods = ['POST'])
def dtuCommandDebug():
    try:
        path = request.path
        form = request.get_json()
        form['user'] = getUserNameByUserId(AuthManager.get_userId())
        method = request.method
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
    except Exception as e:
        rv = dict(success = False,msg = e.__str__(),code = '',data = {})
    return jsonify(rv)

#历史操作
@bp_modbus.route('/history',methods = ['POST'])
@bp_terminal.route('/obixs/history', methods=['POST'])
def dtuOperationHostory():
    try:
        path = request.path
        method = request.method
        form = request.get_json()
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
    except Exception as e:
        rv = dict(success = False,msg = e.__str__(),code = '',data = {})
    return jsonify(rv)

#obix开始搜索
@bp_terminal.route('/obix/dtu/autoSearch/start', methods=['POST'])
def startObixSearch():
    try:
        path = request.path
        method = request.method
        form = request.get_json()
        form['user'] = getUserNameByUserId(AuthManager.get_userId())
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
    except Exception as e:
        rv = dict(success = False,msg = e.__str__(),code = '',data = {})
    return jsonify(rv)

#查看自动搜索是否完成状态
@bp_terminal.route('/obix/dtu/autoSearch/getStatus', methods=['POST'])
def getObixSearchStatus():
    try:
        path = request.path
        method = request.method
        form = request.get_json()
        form['user'] = getUserNameByUserId(AuthManager.get_userId())
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
    except Exception as e:
        rv = dict(success = False,msg = e.__str__(),code = '',data = {})
    return jsonify(rv)


#obix调试
@bp_terminal.route('/obixs/debug', methods=['POST'])
def debugObixs():
    try:
        path = request.path
        method = request.method
        form = request.get_json()
        form['user'] = getUserNameByUserId(AuthManager.get_userId())
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
    except Exception as e:
        rv = dict(success = False,msg = e.__str__(),code = '',data = {})
    return jsonify(rv)

#dtu运行
@bp_modbus.route('/dtu/run',methods = ['POST'])
def dtuNodeRun():
    try:
        path = request.path
        method = request.method
        form = request.get_json()
        form['user'] = getUserNameByUserId(AuthManager.get_userId())
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
    except Exception as e:
        rv = dict(success = False,msg = e.__str__(),code = '',data = {})
    return jsonify(rv)

#dtu停止
@bp_modbus.route('/dtu/stop',methods = ['POST'])
def dtuNodeStop():
    try:
        path = request.path
        method = request.method
        form = request.get_json()
        form['user'] = getUserNameByUserId(AuthManager.get_userId())
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
    except Exception as e:
        rv = dict(success = False,msg = e.__str__(),code = '',data = {})
    return jsonify(rv)

#删除dtu日志
@bp_modbus.route('/dtu/log')
def deleteDtuLog():
    try:
        form = request.get_json()
        path = request.path
        method = request.method
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
    except Exception as e:
        rv = dict(success = False,msg = e.__str__(),code = '',data = {})
    return jsonify(rv)

#获取全部dtu的接口
@bp_modbus.route('/dtu/getall',methods = ['POST'])
def getAllDtuByServerCode():
    try:
        path = request.path
        form = request.get_json()
        method = request.method
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
    except Exception as e:
        rv = dict(success = False,msg = e.__str__(),code = '',data = {})
    return jsonify(rv)

#检测指定dtu是否存在
@bp_modbus.route('/dtu/check',methods = ['POST'])
def checkDtunameIsExist():
    try:
        path = request.path
        form = request.get_json()
        method = request.method
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
    except Exception as e:
        rv = dict(success = False,msg = e.__str__(),code = '',data = {})
    return jsonify(rv)

#获取点表
@bp_modbus.route('/dtu/getPointTable',methods = ['POST'])
def getPointTable():
    try:
        form = request.get_json()
        path = request.path
        method = request.method
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
    except Exception as e:
        rv = dict(success=False, msg=e.__str__(), code='', data={})
    return jsonify(rv)

@bp_modbus.route('/dtu/insertlog',methods = ['POST'])
def insertDebugLog():
    try:
        path = request.path
        form = request.get_json()
        form['userName'] = "admin"
        method = request.method
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
    except Exception as e:
        rv = dict(success=False, msg=e.__str__(), code='', data={})
    return jsonify(rv)

@bp_modbus.route('/project/dtu/status',methods = ['POST'])
def statusOfDtu():
    try:
        path = request.path
        form = request.get_json()
        method = request.method
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
    except Exception as e:
        rv = dict(success=False, msg=e.__str__(), code='', data={})
    return jsonify(rv)   

@bp_modbus.route('/project/point/status',methods = ['POST'])
@bp_terminal.route('/obix/dtu/point/status', methods=['POST'])
def statusOfPoint():
    try:
        path = request.path
        form = request.get_json()
        method = request.method
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
    except Exception as e:
        rv = dict(success=False, msg=e.__str__(), code='', data={})
    return jsonify(rv)   

@bp_modbus.route('/dtu/export/cloud/<projectId>/<dtuId>',methods = ['GET'])
def exportPointDtu(projectId,dtuId):
    try:
        path = request.path
        form = None
        method = request.method
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
        project_db = Project()
        project = project_db.get_project_by_id(projectId, 'name_en')
        excelData = ExcelFile('pointName', 'pointType', 'remark','slaveId','address','functionCode'
                              ,'multiple','dataType','dataLength','refreshCycle')
        rt_data = rv['data']
        for item in rt_data:
            row_data = []
            row_data.append(item.get('pointName'))
            row_data.append(item.get('pointType'))
            row_data.append(item.get('note'))
            row_data.append(item.get('slaveId'))
            row_data.append(item.get('address'))
            row_data.append(item.get('functionCode'))
            row_data.append(item.get('multiple'))
            row_data.append(item.get('dataType'))
            row_data.append(item.get('dataLength'))
            row_data.append(item.get('refreshCycle'))

            excelData.append_row(row_data)
    except Exception as e:
        return Utils.beop_response_error()
    return Response(excelData.data.xlsx,
                    headers={"Content-disposition": "attachment; filename={filename}.xlsx".format(
                        filename=project.get('name_en'))})
    
@bp_terminal.route('/obixs/export/<projectId>/<dtuId>',methods = ['GET'])
def exportObixPointDtu(projectId,dtuId):
    try:
        path = request.path
        form = None
        method = request.method
        query_string = request.query_string
        rv = gotoBeopServiceProcess(path, method, form, query_string)
        project_db = Project()
        project = project_db.get_project_by_id(projectId, 'name_en')
        excelData = ExcelFile('pointName', 'pointType', 'remark','address')
        rt_data = rv['data']
        for item in rt_data:
            row_data = []
            row_data.append(item.get('pointName'))
            row_data.append(item.get('pointType'))
            row_data.append(item.get('note'))
            row_data.append(item.get('address'))
            excelData.append_row(row_data)
    except Exception as e:
        return Utils.beop_response_error()
    return Response(excelData.data.xlsx,
                    headers={"Content-disposition": "attachment; filename={filename}.xlsx".format(
                        filename=project.get('name_en'))})



@bp_modbus.route('/')
def index():
    return render_template('views/dm.main.html')

#16进制转字符串
def hexListChangeHexString(hexlist):
    strList = []
    for item in hexlist:
        if len(item[2:]) == 1:
            strList.append('0' + item[2:])
        else:
            strList.append(item[2:])
    strcommand =  '['+' '.join(strList)+']'
    return strcommand

#分页显示
def dataShowPage(datalist,pageSize,pageNum):
    pageSize = pageSize if isinstance(pageSize, int) else int(pageSize)
    pageNum = pageNum if isinstance(pageNum, int) else int(pageNum)
    data = {}
    if datalist:
        total = len(datalist)
        pagetotal = total // pageSize
        if total % int(pageSize) > 0:
            pagetotal += 1
        if pageNum > pagetotal:
            dtulist = []
        elif pageNum == pagetotal:
            start = (pageNum - 1) * pageSize
            dtulist = datalist[start:]
        else:
            start = (pageNum - 1) * pageSize
            end = pageNum * pageSize
            dtulist = datalist[start:end]
        data['list'] = dtulist
        data['total'] = pagetotal
        return data

#转BeopService处理
def gotoBeopServiceProcess(path,method,form,query_string):
    EXPERT_CONTAINER_URL = app.config.get('BEOP_SERVICE_ADDRESS')
    headers = {'content-type': 'application/json'}
    request_path = EXPERT_CONTAINER_URL + path
    if query_string.decode():  # 支持query_string
        request_path += '?' + query_string.decode()
    r = None
    # 进行转发
    if method == 'GET':
        r = requests.get(request_path)
    elif method == 'POST':
        r = requests.post(url = request_path,headers = headers,data = json.dumps(form))
    # 结果处理
    if not r:
        return Utils.beop_response_error(msg='not support the request.')
    try:
        return json.loads(r.text)
    except:
        return r.text

#获取用户名
def getUserNameByUserId(userId):
    user = User()
    return user.get_user_by_id(userId).get('username')

