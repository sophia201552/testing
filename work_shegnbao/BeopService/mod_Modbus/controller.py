import re
import os
import csv
import time
import json
import logging
import struct
import requests
from bson import ObjectId
from datetime import datetime
from xlrd import open_workbook
from flask import request, jsonify
from flask import render_template
from mod_Modbus import bp_modbus, bp_terminal
from mod_Common.crc16 import crc16
from mod_Common.getpinyin import getPinyin
from mod_DataAccess.BEOPDataBufferManager import *
from mod_DataAccess.BEOPDataAccess import BEOPDataAccess,RedisManager
from mod_Common.Exceptions import InvalidPointsExcel
import hashlib

class ModbusType:
    E_MODBUS_SIGNED = 0
    E_MODBUS_UNSIGNED = 1
    E_MODBUS_BITE = 2
    E_MODBUS_LONG = 3
    E_MODBUS_LONG_INVERSE = 4
    E_MODBUS_FLOAT = 5
    E_MODBUS_FLOAT_INVERSE = 6
    E_MODBUS_DOUBLE = 7
    E_MODBUS_DOUBLE_INVERSE = 8
    E_MODBUS_STRING = 9
    E_MODBUS_STRING_INVERSE = 10
    E_MODBUS_POWERLINK = 11  # 11 争对powerLink 3 位寄存器，前两位可读，后一位只写
    E_MODBUS_HEX = 12

class OperationType:
    MODBUS_OP_ERROR = 0  # 错误
    MODBUS_OP_SEND = 1  # 发送数据
    MODBUS_OP_RECEIVE = 2  # 接收数据
    MODBUS_OP_RUN = 3  # 启动DTU
    MODBUS_OP_STOP = 4  # 停止DTU
    MODBUS_OP_COMMAND = 5  # 命令调试
    MODBUS_OP_EQUIPMENT = 6  # 设备调试
    MODBUS_OP_IMPORT = 7  # 导入点表
    MODBUS_OP_ADD = 8  # 添加点
    MODBUS_OP_COPY = 9  # 复制其他非空DTU数据
    MODBUS_OP_COVER = 10  # 覆盖其他DTU数据
    MODBUS_OP_MODIFY_PREFIX = 11  # 修改前缀  #David 20171017 修改为修改DTU信息
    MODBUS_OP_DELETE_POINT = 12  # 删除选中点
    MODBUS_OP_DELETE_DTU = 13  # 删除DTU
    MODBUS_OP_DELETE_ALL_POINT = 14  # 删除所有点
    MODBUS_OP_UPDATE = 15  # 更新DTU属性

class ErrorCode:
    CREATEDTU_ERROR = 0  # 'createDtu Error'
    CREATEDTU_FAILED_INSERT = 1  # createDtu Failed:Insert data to database Failed
    CREATEDTU_FAILED_GET_DTU_NAME = 2  # createDtu Failed:Get dtuName:%s id Failed
    CREATEDTU_FAILED_GET_MYSQL_NAME = 3  # 'createDtu Failed:Get MySql name by projId =%d Failed.' 
    CREATEDTU_FAILED_SAME_PREFIX = 4  # 'Create DTU failed: The prefix %s is already used in project %s. Please specify another prefix'
    CREATEDTU_FAILED_ERROR_POSTDATA = 5  # createDtu Failed:Get post_data Failed
    GET_PROJECT_MARK_ERROR = 6  # getProjectMark Error
    IMPORT_FILE_ERROR = 7  # Import point table failure
    GET_DTU_STATUS_ERROR = 8  # getDtuStatus Error
    GET_DTUNAME_POINTLIST_ERROR = 9  # get dtuName or get pointList error
    GET_POINT_STATUS_ERROR = 10  # getPointStatus Error 
    COPY_DTU_ERROR_INSERT = 11  # copyExistDtuToEmptyDtu Error : The insertion point table data failed
    COPY_DTU_ERROR_NO_DATA = 12  # 'copyExistDtuToEmptyDtu Error : Failed to get the point table data by dtuname'
    COPY_DTU_ERROR = 13  #
    COPY_DTU_TO_DTU_ERROR_DELETE = 14  # "copyDtuDataToOtherDtu Error: delete old point Failed!"
    COPY_DTU_TO_DTU_ERROR_INVOLVES = 15  # 'copyDtuDataToOtherDtu Error: Involves table data failed'
    COPY_DTU_TO_DTU_ERROR_NO_DATA = 16  # 'copyDtuDataToOtherDtu Error: Failed to get the point table data'
    COPY_DTU_TO_DTU_ERROR = 17
    UPDATE_DTU_INFO_ERROR = 18  # Failed to update Dtu Info
    GET_DTU_OBJECTID_ERROR = 19  # get Dtu ObjectId Error
    ADD_POINT_ERROR_SAME_POINTNAME = 20  # 'Point name already exists'
    ADD_POINT_ERROR_SAME_DTUPARAMS = 21  # 'Dtu params already exists'
    GET_DTU_POINTLIST_ERROR = 22  # "getDtuPointDataList Error:Failed to get data paging"
    DELETE_POINT_ERROR = 23  # Delete the selected point of failure
    DELETE_POINT_ERROR_ALL = 24  # deleteAllPoint Error: 
    DELETE_DTU_NODE_ERROR = 25  # 'deleteDtuNode Error: '
    DTU_OPERATION_ERROR_GET_DATA = 26  # "dtuOperationHostory Error : Failed to get data paging"
    DTU_OPERATION_ERROR_OPERATING_DATA = 27  # 'dtuOperationHostory Error : Failed to get historical operating data'
    DTU_COMMAND_DEBUG_ERROR = 28  # dtuCommandDebug Error
    START_OBIX_SEARCH_ERROR = 29  # startObixSearch Error
    GET_DTU_POINT_LIST_ERROR = 30  # getDtuPointDataList Error: Failed to get the point table
    RUN_STOP_ERROR = 31  # setRunAndStopControl ERROR
    CREATEDTU_FAILED_ERROR_PWD = 32 #check url,userName,pwd full
    PREFIX_UPDATE_ERROR = 33 # update prefixName error



# 生成dtu名
@bp_modbus.route('/api/v1/getDTUName', methods=['POST'])
def getDtuName():
    success = True
    msg = ''
    code = ''
    dtuname = ''
    try:
        post_data = request.get_json()
        if post_data:
            projId = post_data.get('projId')  # 获取项目ID
            name_cn = BEOPDataAccess.getInstance().getNamecnByProjId(projId)
            if name_cn:
                other = ''
                namelist = list(name_cn)
                for item in namelist:
                    if item >= '\u4e00' and item <= '\u9fa5':  # 获取中文首字母
                        dtuname += getPinyin(item)
                    elif ord(item) >= 65 and ord(item) <= 90:  # 获取命名驼峰格式的首字母
                        dtuname += chr(ord(item) + 32)
                    else:  # 获取前四个字母
                        other += item
                if other:
                    dtuname = other
                if dtuname:
                    if len(dtuname) >= 4:
                        dtuname = dtuname[:4]
                    dtuname = dtuname + datetime.strftime(datetime.now(), "%Y%m%d%H%M%S")[2:-6]
                    if len(dtuname) == 10:
                        rdtuname = BEOPDataAccess.getInstance().getNewCreateDtuNameByNameKey(dtuname)
                        if rdtuname:
                            print(rdtuname[-2:])
                            dtuname = ("%s%02d") % (rdtuname[:-2], int(rdtuname[-2:]) + 1)  # 如果存在，则编号+1，生成新dtuname。
                        else:
                            dtuname += "01"
                    else:
                        msg = 'getDtuName failed:Generate DTU name failed'
                        success = False
                        app.logger.error(msg)
                        print(msg)
                else:
                    msg = 'getDtuName failed:Failed to get the project name abbreviations'
                    app.logger.error(msg)
                    success = False
                    print(msg)
            else:
                msg = 'getDtuName failed: Failed to get the project name'
                app.logger.error(msg)
                success = False
                print(msg)
    except Exception as e:
        success = False
        msg = "getDtuName Error : " + e.__str__()
        app.logger.error(msg)
        print(msg)
    rv = dict(success=success , code=code , msg=msg , data=dtuname)
    return jsonify(rv)

# 创建dtu
@bp_modbus.route('/dtu/create', methods=['POST'])
@bp_terminal.route('/obix/dtu/create', methods=['POST'])
def createDtu():
    logging.info('Creating DTU: %s', request.data)
    success = True
    msg = ''
    code = ''
    pointData = []
    data = {}
    rdata = {}
    try:
        post_data = request.get_json()
        if post_data:
            projId = post_data.get('projId')  # 获取项目ID
            # dtuname = createDtuName(projId)
            dtuname = getObjectIdDtuName()
            prefix = post_data.get('prefix')
            dtuType = post_data.get('type')
            equipName = post_data.get('equipName')
            createUser = post_data.get('user')
        
            urlStr = None
            userName = None
            pwdStr = None
            serverCode = None
            dbpsw = ''
            print(dtuname, projId, prefix)
            if dtuType == 'modbus':
                serverCode = 3
            elif dtuType == 'obix':
                serverCode = 4
                # obix的url，用户名，密码
                urlStr = post_data.get('url')
                userName = post_data.get('userName') 
                pwdStr = post_data.get('pwd')
                if urlStr == None:
                    raise Exception("url is null")
                if userName == None:
                    raise Exception("userName is null")
                if pwdStr == None:
                    raise Exception("pwd is null")
                # 检查用户、url、密码
                if checkObixInfo({"obixUrl":urlStr, "obixUser":userName, "obixPsw":pwdStr}) == False:
                    code = ErrorCode.CREATEDTU_FAILED_ERROR_PWD
                    raise Exception('check url,userName,pwd full')
                # 自动搜索
                search_keys = {"obixTag":dtuname, "obixUrl":urlStr, "obixUser":userName, "obixPsw":pwdStr}
                pointData = searchObixPoint(search_keys)
                # pwdMD5 = hashlib.md5(pwdStr.encode(encoding='utf_8')).hexdigest()
                dbpsw = json.dumps({"url":urlStr, "userName":userName, "pwd":pwdStr})
            else:
                raise Exception("dtu type is error,the type must be 'modbus' or 'obix'")
            dbname = BEOPDataAccess.getInstance().getProjMysqldb(projId)
            if dbname is None:
                raise Exception('dbname is invalid')
            if BEOPDataAccess.getInstance().getProByPrefix(prefix, dbname) == 0:
                if dbname:
                    data["dtuname"] = dtuname
                    data["dbuser"] = prefix if prefix else dtuname
                    data["dbname"] = dbname
                    data["synRealTable"] = "rtdata_beopdata_" + dtuname
                    data["serverCode"] = serverCode
                    data["dtuRemark"] = "Auto Create"
                    if equipName:
                        data["equipName"] = equipName
                    if urlStr and userName and pwdStr:
                        data["dbpsw"] = dbpsw
                    success = BEOPDataAccess.getInstance().insertDataToDbByDBname(data)
                    if success:
                        # obix自动存入搜索结果
                        modify_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                        dataList = []
#                         if dtuType == 'obix' and len(pointData) > 0:
#                             pointData = eval(pointData)
#                             for item in pointData:
#                                 datapoint = {}
#                                 params = {}
#                                 # params['note'] = post_data.get('note')
#                                 params['address'] = item[1]
#                                 params['pointType'] = 'obix'
#                                 datapoint['pointName'] = item[0]
#                                 datapoint['type'] = 4
#                                 datapoint['projId'] = projId
#                                 datapoint['dtuName'] = dtuname
#                                 datapoint['create_by'] = createUser
#                                 datapoint['create_time'] = modify_time
#                                 datapoint['modify_by'] = createUser
#                                 datapoint['modify_time'] = modify_time
#                                 datapoint['params'] = params
#                                 dataList.append(datapoint)
#                             MongoConnManager.getConfigConn().insertManyPointToMongoDB(dataList)
                        dtuId = BEOPDataAccess.getInstance().getDtuIdByDtuName(dtuname)
                        if dtuId:
                            rdata['name'] = dtuname
                            rdata['id'] = dtuId
                            rdata['prefix'] = prefix
                            rdata['equipName'] = equipName
                            rdata['type'] = dtuType
                        else:
                            success = False
                            code = ErrorCode.CREATEDTU_FAILED_GET_DTU_NAME
                            msg = 'createDtu Failed:Get dtuName:%s id Failed.' % (dtuname)
                            logging.error(msg)
                    else:
                        success = False
                        code = ErrorCode.CREATEDTU_FAILED_INSERT
                        msg = 'createDtu Failed:Insert data to database Failed'
                        logging.error(msg)
                else:
                    success = False
                    code = ErrorCode.CREATEDTU_FAILED_GET_MYSQL_NAME
                    msg = 'createDtu Failed:Get MySql name by projId =%d Failed.' % (projId)
                    logging.error(msg)
            else:
                success = False
                code = ErrorCode.CREATEDTU_FAILED_SAME_PREFIX
                msg = 'Create DTU failed: The prefix %s is already used in project %s. Please specify another prefix' % (prefix, projId)
                logging.error(msg)
        else:
            success = False
            code = ErrorCode.CREATEDTU_FAILED_ERROR_POSTDATA
            msg = 'createDtu Failed:Get post_data Failed.'
            logging.error(msg)
    except Exception as e:
        success = False
        if code == '' :
            code = ErrorCode.COPY_DTU_ERROR
        msg = "createDtu Error : " + e.__str__()
        logging.error("Unhandled exception! Locals: %s", locals(), exc_info=True, stack_info=True)
    rv = dict(success=success, code=code, msg=msg, data=rdata if rdata else None)
    return jsonify(rv) 

# 生成项目标识,数据库名
@bp_terminal.route('/project', methods=['POST'])
@bp_modbus.route('/project', methods=['POST'])
def getProjectMark():
    success = True
    msg = ''
    code = ''
    name = ''
    rdata = {}
    dtuList = []
    try:
        post_data = request.get_json()
        if post_data:
            projId = post_data.get('projId')
            data = BEOPDataAccess.getInstance().getDbNmaeAndDtunameListByProId(projId)  # 获取项目标识和dtu列表
            if data:
                for item in data:
                    # 3 modbus，4 obix
                    if len(item) >= 6:
                        dtudata = {}
                        dtu_id = item[0]  # dtuid
                        dtuName = BEOPDataAccess.getInstance().getDtuNameByDtuId(dtu_id)
                        dtudata['name'] = item[1]  # dtu名
                        dtudata['id'] = dtu_id
                        dtudata['prefix'] = item[3]  #
                        dtudata['equipName'] = item[4]  #
                        if str(item[5]) == '3':
                            dtudata['type'] = 'modbus'
                        elif str(item[5]) == '4':
                            dtudata['type'] = 'obix'
                            pswJson = json.loads(item[6])
                            # obixUrl,obixUser,obixPsw
                            dtudata['obixUrl'] = pswJson['url']
                            dtudata['obixUser'] = pswJson['userName']
                            dtudata['obixPsw'] = pswJson['pwd']
                        dtudata['flag'] = MongoConnManager.getConfigConn().checkEmptyDtuByDtuName(dtuName)
                        dtuList.append(dtudata)
                    name = data[0][2]
            else:
                name = BEOPDataAccess.getInstance().getProjMysqldb(projId)
            rdata['name'] = name
            rdata['id'] = projId
            rdata['dtulist'] = dtuList
    except Exception as e:
        success = False
        code = ErrorCode.GET_PROJECT_MARK_ERROR
        msg = "getProjectMark Error : " + e.__str__()
        app.logger.error(msg)
        print(msg)
    rv = dict(success=success , code=code , msg=msg , data=rdata)
    return jsonify(rv)

# 导入已有点表
@bp_modbus.route('/points/import/', methods=['POST'])
@bp_terminal.route('/obixs/points/import/', methods=['POST'])
def importModbusPointTable():
    success = False
    code = ''
    msg = ''
    log = []
    try:
        post_data = request.get_json()
        if post_data:
            data_list = post_data.get('data')
            dtuName = post_data.get('dtuName')
            projId = post_data.get('projId')
            userName = post_data.get('user')
            time = post_data.get('time') if post_data.get('time') else None
            for item in data_list:
                print(item)
            if data_list:
                MongoConnManager.getConfigConn().deleteAllPointByDtuName(dtuName)
                success = MongoConnManager.getConfigConn().importPointToMongoDB(data_list)
                rmsg = 'Import point table success!'
                log.append(createLogData(dtuName, userName, rmsg, OperationType.MODBUS_OP_IMPORT, time))
    except Exception as e:
        success = False
        code = ErrorCode.IMPORT_FILE_ERROR
        msg = "Import point table failure" + str(e)
        log.append(createLogData(dtuName, userName, rmsg, OperationType.MODBUS_OP_ERROR, time))
    MongoConnManager.getConfigConn().insertManyLog(log, dtuName)
    rv = dict(success=success, msg=msg, code=code)
    return jsonify(rv)

@bp_modbus.route('/project/dtu/status', methods=['POST'])
def statusOfDtu():
    success = False
    msg = ''
    try:
        post_data = request.get_json()
        rt = BEOPDataAccess.getInstance().getStatusOfDtuByProjId(post_data.get('projId'))
        if rt:
            msg = 'getDtuStatus success'
            success = True
        rv = dict(success=success, data=rt, msg=msg)
    except Exception as e:
        success = False
        code = ErrorCode.GET_DTU_STATUS_ERROR
        msg = "getDtuStatus Error : " + e.__str__()
        app.logger.error(msg)
    return jsonify(rv)

@bp_modbus.route('/project/point/status', methods=['POST'])
@bp_terminal.route('/obix/dtu/point/status', methods=['POST'])
def statusOfPoint():
    success = False
    msg = ''
    rt = {}
    try:
        post_data = request.get_json()
        projId = post_data.get('projId')
        prefix = post_data.get('prefix')
        dtuId = post_data.get('dtuId')
        dtuName = BEOPDataAccess.getInstance().getDtuNameByDtuId(dtuId)
        pointNameList = MongoConnManager.getConfigConn().getPointNameByDtuName(dtuName, prefix)
        if dtuName and pointNameList:
            rt = BEOPDataAccess.getInstance().getStatusOfPointByDtuId(dtuId, pointNameList)
            if rt:
                msg = 'getPointStatus success'
                success = True
        else:
            success = False
            code = ErrorCode.GET_DTUNAME_POINTLIST_ERROR
            msg = 'get dtuName or get pointList error'
        rv = dict(success=success, data=rt, msg=msg)
    except Exception as e:
        success = False
        if code == '':
            code = ErrorCode.GET_POINT_STATUS_ERROR
        msg = "getPointStatus Error : " + e.__str__()
        app.logger.error(msg)
    return jsonify(rv)


# 空dtu从已有数据dtu中复制
@bp_modbus.route('/dtu/copy', methods=['POST'])
def copyExistDtuToEmptyDtu():
    success = False
    code = ''
    msg = ''
    log = []
    try:
        post_data = request.get_json()
        if post_data:
            userName = post_data.get('user')
            time = post_data.get('time') if post_data.get('time') else None
            dtuName = BEOPDataAccess.getInstance().getDtuNameByDtuId(post_data.get('dtuId'))
            data = MongoConnManager.getConfigConn().getModbusPointTableByDtuName(dtuName)
            if data:
                dtuTarget = BEOPDataAccess.getInstance().getDtuNameByDtuId(post_data.get('dtuTarget'))
                for item in data:
                    item['dtuName'] = dtuTarget
                if MongoConnManager.getConfigConn().insertDataToModbusPointTable(data):
                    rmsg = 'Copy point table success!'
                    log.append(createLogData(dtuTarget, userName, rmsg, OperationType.MODBUS_OP_COPY, time))
                    success = True
                else:
                    code = ErrorCode.COPY_DTU_ERROR_INSERT
                    msg = 'copyExistDtuToEmptyDtu Error : The insertion point table data failed '
                    app.logger.error(msg)
                    print(msg)
            else:
                code = ErrorCode.COPY_DTU_ERROR_NO_DATA
                msg = 'copyExistDtuToEmptyDtu Error : Failed to get the point table data'
                app.logger.error(msg)
                print(msg)
    except Exception as e:
        if code == '':
            code = ErrorCode.COPY_DTU_ERROR
        msg = str(e)
        app.logger.error(msg)
        print(msg)
    MongoConnManager.getConfigConn().insertManyLog(log, dtuTarget)
    rv = dict(success=success, code=code, msg=msg)
    return jsonify(rv)

# 将一个dtu数据复制给其他目标dtu
@bp_modbus.route('/copy/dtus', methods=['POST'])
def copyDtuDataToOtherDtu():
    success = False
    code = ''
    msg = ''
    log = []
    try:
        post_data = request.get_json()
        if post_data:
            time = post_data.get('time') if post_data.get('time') else None
            userName = post_data.get('user')
            dtuId = post_data.get('dtuId')
            targetList = post_data.get('targetList')
            dtuName = BEOPDataAccess.getInstance().getDtuNameByDtuId(dtuId)
            rdata = MongoConnManager.getConfigConn().getModbusPointTableByDtuName(dtuName)
            if rdata:
                for item in targetList:
                    targetDtu = item
                    updateList = []
                    for item in rdata:
                        if item:
                            data = {}
                            tdtuName = BEOPDataAccess.getInstance().getDtuNameByDtuId(targetDtu)
                            data['dtuName'] = tdtuName
                            data['projId'] = item.get('projId')
                            data['pointName'] = item.get('pointName')
                            data['create_by'] = item.get('create_by')
                            data['create_time'] = item.get('create_time')
                            data['modfiy_by'] = item.get('modfiy_by')
                            data['modify_tiem'] = item.get('modify_tiem')
                            data['type'] = item.get('type')
                            data['params'] = item.get('params')
                            updateList.append(data)
                    if updateList:
                        if MongoConnManager.getConfigConn().deleteAllPointByDtuName(tdtuName):
                            if MongoConnManager.getConfigConn().insertDataToModbusPointTable(updateList):
                                success = True
                            else:
                                code = ErrorCode.COPY_DTU_TO_DTU_ERROR
                                msg = 'copy from dtuId:%s data to dtuId:%s Failed!' % (dtuId, item)
                                app.logger.error(msg)
                                print(msg)
                                rv = dict(success=success, code=code, msg=msg)
                                return jsonify(rv)
                        else:
                            code = ErrorCode.COPY_DTU_TO_DTU_ERROR_DELETE
                            msg = "copyDtuDataToOtherDtu Error: delete old point Failed!"
                            app.logger.error(msg)
                            print(msg)
                    else:
                        code = ErrorCode.COPY_DTU_TO_DTU_ERROR_INVOLVES
                        msg = 'copyDtuDataToOtherDtu Error: Involves table data failed'
                        app.logger.error(msg)
                        print(msg)
                rmsg = 'Cover other point table success!'
                log.append(createLogData(dtuName, userName, rmsg, OperationType.MODBUS_OP_COVER, time))
            else:
                msg = 'copyDtuDataToOtherDtu Error: Failed to get the point table data'
                app.logger.error(msg)
                print(msg)
    except Exception as e:
        if code == '':
            code = ErrorCode.COPY_DTU_TO_DTU_ERROR
        msg = 'copyDtuDataToOtherDtu Error:' + e.__str__()
        app.logger.error(msg)
        print(msg)
    MongoConnManager.getConfigConn().insertManyLog(log, dtuName)
    rv = dict(success=success, code=code, msg=msg)
    return jsonify(rv)


# 更新DTU状态
@bp_modbus.route('/dtu/updateInfo', methods=['POST'])
def updateDtuInfo():
    success = True
    code = ''
    msg = ''
    log = []
    data = {}
    post_data = request.get_json()
    try:
        dtuName = post_data.get('dtuname')
        isOnline = post_data.get('isOnline')
        if isOnline:
            isOnlineStr = 'Online'
        else:
            isOnlineStr = 'offline'
        onlineTime = post_data.get('time')
        dtuId = BEOPDataAccess.getInstance().getDtuIdByDtuName(dtuName)
        data = {"id":dtuId, "online":isOnlineStr, "LastOnlineTime":onlineTime}
        if BEOPDataAccess.getInstance().updateDTUProjectInfoById(data):
            success = True
            msg = 'updateDtuInfo success'
        else:
            code = ErrorCode.UPDATE_DTU_INFO_ERROR
            success = False
            msg = 'Failed to update Dtu Info'
    except Exception as e:
        code = ErrorCode.UPDATE_DTU_INFO_ERROR
        msg = 'updateDtuInfo Error:' + e.__str__()
        success = False
        app.logger.error(msg)
        print(msg)
    MongoConnManager.getConfigConn().insertManyLog(log, dtuName)
    rv = dict(success=success, code=code, msg=msg)
    return jsonify(rv)

# 唯一标识
@bp_modbus.route('/dtu/generateDTU', methods=['POST'])
def getDtuObjectId():
    success = True
    code = ''
    msg = ''
    data = {}
    try:
        obid = getObjectIdDtuName()
        data = {"dtuname":str(obid)}
        msg = 'get Dtu ObjectId success'
    except Exception as e:
        msg = 'get Dtu ObjectId Error:' + e.__str__()
        success = False
        app.logger.error(msg)
        print(msg)
    rv = dict(success=success, code=code, msg=msg, data=data)
    return jsonify(rv)

def getObjectIdDtuName():
    dtuname = ObjectId()
    return str(dtuname)

# 手动添加新点
@bp_modbus.route('/dtu/addPoint', methods=['POST'])
@bp_terminal.route('/obix/dtu/updatePoint', methods=['POST'])
def manualImportNewPoint():
    success = True
    code = ''
    msg = ''
    log = []
    params = {}
    data = {}
    source_type = 5
    modify_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    post_data = request.get_json()
    # pointId 更新唯一标识
    try:
        if post_data:
            time = post_data.get('time') if post_data.get('time') else None
            userName = post_data.get('user')
            dtuName = BEOPDataAccess.getInstance().getDtuNameByDtuId(post_data.get('dtuId'))
            if post_data.get('pointType') == 'obix':
                dtupwd = BEOPDataAccess.getInstance().getDtuPwdByDtuId(post_data.get('dtuId'))
                pswJson = json.loads(dtupwd)
                # obixUrl,obixUser,obixPsw
                # 检查用户、url、密码
                if getObixValue({"obixUrl":pswJson['url'], "obixUser":pswJson['userName'], "obixPsw":pswJson['pwd'], "obixPointUrl":post_data.get('address')}) == False:
                    code = ErrorCode.CREATEDTU_FAILED_ERROR_PWD
                    raise Exception('check pointurl full')
            op_type = post_data.get('type')
            pointId = post_data.get('pointId')
            params['address'] = post_data.get('address')
            params['pointType'] = post_data.get('pointType')
            params['note'] = post_data.get('note')
            if post_data.get('pointType') == 'modbus':
                # David 20170927
                # params['note'] = post_data.get('note')
                params['dataType'] = post_data.get('dataType')
                params['dataLength'] = post_data.get('dataLength')
                params['functionCode'] = post_data.get('functionCode')
                params['refreshCycle'] = post_data.get('refreshCycle')
                params['slaveId'] = post_data.get('slaveId')
                params['multiple'] = post_data.get('multiple')
            
            data['pointName'] = post_data.get('pointName')
            data['type'] = source_type
            data['projId'] = int(post_data.get('projId'))
            data['dtuName'] = dtuName
            data['create_by'] = post_data.get('user')
            data['create_time'] = modify_time
            data['modify_by'] = post_data.get('user')
            data['modify_time'] = modify_time
            data['params'] = params
            if op_type == 'add':
                if MongoConnManager.getConfigConn().checkExistPointNameInDtu(dtuName, post_data.get('pointName')):
                    success = False
                    code = ErrorCode.ADD_POINT_ERROR_SAME_POINTNAME
                    msg = 'Point name already exists'
                elif MongoConnManager.getConfigConn().checkExistSameDtuParams(int(post_data.get('projId')), params):
                    success = False
                    code = ErrorCode.ADD_POINT_ERROR_SAME_DTUPARAMS
                    msg = 'Dtu params already exists'
                else:
                    if MongoConnManager.getConfigConn().insertNewPointToMongoDB(data) :
                        rmsg = 'Add new point success!'
                        log.append(createLogData(dtuName, userName, rmsg, OperationType.MODBUS_OP_ADD, time))
                    else:
                        success = False
            elif op_type == 'update':
                if MongoConnManager.getConfigConn().checkExistSameDtuParams(int(post_data.get('projId')), params, pointId):
                    success = False
                    code = ErrorCode.ADD_POINT_ERROR_SAME_DTUPARAMS
                    msg = 'Dtu params already exists'
                else:
                    if MongoConnManager.getConfigConn().updatePointToMongo(data, pointId):
                        rmsg = 'Update Point success'
                        log.append(createLogData(dtuName, userName, rmsg, OperationType.MODBUS_OP_UPDATE, time))
    except Exception as e:
        code = ErrorCode.CREATEDTU_FAILED_ERROR_PWD
        msg = 'manualImportNewPoint Error:' + e.__str__()
        success = False
        app.logger.error(msg)
        #print(msg)
    MongoConnManager.getConfigConn().insertManyLog(log, dtuName)
    rv = dict(success=success, code=code, msg=msg)
    return jsonify(rv)

# 导出dtu列表，
@bp_modbus.route('/dtu/list', methods=['POST'])
@bp_terminal.route('/obix/dtu/list', methods=['POST'])
def getDtuPointDataList():
    rdata = []
    success = False
    code = ''
    msg = ''
    post_data = request.get_json()
    try:
        if post_data:
            projId = post_data.get('projId')
            dtuId = post_data.get('dtuId')
            searchText = post_data.get('searchText')
            pageSize = post_data.get('pageSize')
            pageNum = post_data.get('pageNum')
            perfix = BEOPDataAccess.getInstance().getDtuPrefixByDtuId(dtuId)
            dtuName = BEOPDataAccess.getInstance().getDtuNameByDtuId(dtuId)
            if perfix:
                datalist = MongoConnManager.getConfigConn().getPointBySarchText(searchText, projId, dtuName, perfix)
                if datalist:
                    rdata = dataShowPage(datalist, pageSize, pageNum)
                    if rdata :
                        success = True
                    else:
                        code = ErrorCode.GET_DTU_POINT_LIST_ERROR
                        msg = "getDtuPointDataList Error:Failed to get data paging"
                        app.logger.error(msg)
                        print(msg)
                else:
                    code = ErrorCode.GET_DTU_POINT_LIST_ERROR
                    msg = "Failed to get the point table data"
                    app.logger.error(msg)
                    print(msg)
            else:
                code = ErrorCode.GET_DTU_POINT_LIST_ERROR
                msg = "Failed to get some prefixes"
                app.logger.error(msg)
                print(msg)
    except Exception as e:
        code = ErrorCode.GET_DTU_POINT_LIST_ERROR
        msg = "getDtuPointDataList Error:" + e.__str__()
        app.logger.error(msg)
        print(msg)
    rv = dict(success=success, code=code, msg=msg , data=rdata)
    return jsonify(rv)

# 删除选中点
@bp_modbus.route('/dtu/points/del', methods=['POST'])
@bp_terminal.route('/obix/dtu/points/del', methods=['POST'])
def deleteSelectedPoint():
    success = False
    code = ''
    msg = ''
    log = []
    post_data = request.get_json()
    try:
        if post_data:
            time = post_data.get('time') if post_data.get('time') else None
            pointId_list = post_data.get('points')
            userName = post_data.get('user')
            dtuName = BEOPDataAccess.getInstance().getDtuNameByDtuId(post_data.get('dtuId'))
            if MongoConnManager.getConfigConn().deletePointByObjId(dtuName, pointId_list):
                success = True
                rmsg = 'Delete point success!'
                log.append(createLogData(dtuName, userName, rmsg, OperationType.MODBUS_OP_DELETE_POINT, time))
            else:
                code = ErrorCode.DELETE_POINT_ERROR
                msg = 'Delete the selected point of failure'
                app.logger.error(msg)
                print(msg)
    except Exception as e:
        code = ErrorCode.DELETE_POINT_ERROR
        msg = str(e)
        success = False
    MongoConnManager.getConfigConn().insertManyLog(log, dtuName)
    rv = dict(success=success, code=code, msg=msg)
    return jsonify(rv)

# 删除所有点
@bp_modbus.route('/dtu/points/del/all', methods=['POST'])
@bp_terminal.route('/obixs/dtu/points/del/all', methods=['POST'])
def deleteAllPoint():
    success = False
    code = ''
    msg = ''
    log = []
    post_data = request.get_json()
    try:
        if post_data:
            time = post_data.get('time') if post_data.get('time') else None
            userName = post_data.get('user')
            dtuName = BEOPDataAccess.getInstance().getDtuNameByDtuId(post_data.get('dtuId'))
            if MongoConnManager.getConfigConn().deleteAllPointByDtuName(dtuName):
                success = True
                msg = 'Delete DTU success!'
                log.append(createLogData(dtuName, userName, rmsg, OperationType.MODBUS_OP_DELETE_ALL_POINT, time))
            else:
                code = ErrorCode.DELETE_POINT_ERROR_ALL
                msg = 'Delete point failed'
                app.logger.error(msg)
                print(msg)
    except Exception as e:
        code = ErrorCode.DELETE_POINT_ERROR_ALL
        msg = "deleteAllPoint Error: " + e.__str__()
        app.logger.error(msg)
        print(msg)
    MongoConnManager.getConfigConn().insertManyLog(log, dtuName)
    rv = dict(success=success, code=code, msg=msg)
    return jsonify(rv)

# 删除dtu节点
@bp_modbus.route('/dtu/del', methods=['POST'])
def deeleteDtuNode():
    success = False
    code = ''
    msg = ''
    log = []
    post_data = request.get_json()
    try:
        if post_data:
            time = post_data.get('time') if post_data.get('time') else None
            dtuId = post_data.get('dtuId')
            userName = post_data.get('user')
            dtuName = BEOPDataAccess.getInstance().getDtuNameByDtuId(dtuId)
            if MongoConnManager.getConfigConn().deleteAllPointByDtuName(dtuName):
                if BEOPDataAccess.getInstance().deleteDtuByDtuId(dtuId):
                    success = True
                    rmsg = 'Delete DTU success!'
                    log.append(createLogData(dtuName, userName, rmsg, OperationType.MODBUS_OP_DELETE_DTU, time))
                else:
                    code = ErrorCode.DELETE_DTU_NODE_ERROR
                    msg = 'Delete dtuId failed '
            else:
                code = ErrorCode.DELETE_DTU_NODE_ERROR
                msg = 'Delete point failed'
                app.logger.error(msg)
                print(msg)
    except Exception as e:
        code = ErrorCode.DELETE_DTU_NODE_ERROR
        msg = 'deleteDtuNode Error: ' + e.__str__()
        app.logger.error(msg)
        print(msg)
    MongoConnManager.getConfigConn().insertManyLog(log, dtuName)
    rv = dict(success=success, code=code, msg=msg)
    return jsonify(rv)

# 修改dtu前缀
# David 20171017 修改DTU信息
@bp_modbus.route('/dtu/prefixName/update', methods=['POST'])
def modfiyPrefixName():
    success = False
    code = ''
    msg = ''
    log = []
    post_data = request.get_json()
    try:
        if post_data:
            time = post_data.get('time') if post_data.get('time') else None
            prefix = post_data.get('prefix')
            dtuId = post_data.get('dtuId')
            user = post_data.get('user')
            projId = post_data.get('projId')

            #david 20171012
            equipName = post_data.get('equipName')
            dtuType = post_data.get('type')   # modbus or obix
            url = post_data.get('url')
            userName = post_data.get('userName')
            pwd = post_data.get('pwd')

            if projId is None:
                raise Exception('param projId is needed')
            dtuName = BEOPDataAccess.getInstance().getDtuNameByDtuId(dtuId)
            dbname = BEOPDataAccess.getInstance().getProjMysqldb(projId)
            if dbname is None:
                raise Exception('dbname is invalid')

            if dtuType == 'modbus':
                serverCode = 3
                dbpsw = ''
            elif dtuType == 'obix':
                serverCode = 4
                if url == None:
                    raise Exception("url is null")
                if userName == None:
                    raise Exception("userName is null")
                if pwd == None:
                    raise Exception("pwd is null")
                # 检查用户、url、密码
                if checkObixInfo({"obixUrl":url, "obixUser":userName, "obixPsw":pwd}) == False:
                    code = ErrorCode.CREATEDTU_FAILED_ERROR_PWD
                    raise Exception('check url,userName,pwd full')
                dbpsw = json.dumps({"url":url, "userName":userName, "pwd":pwd})

            if BEOPDataAccess.getInstance().getProByPrefix(prefix, dbname, dtuId) == 0:
                if BEOPDataAccess.getInstance().modfiyDtuPrefixByDtuId(dtuId, prefix, equipName, dbpsw, serverCode):
                    success = True
                    rmsg = 'Modify prefixes success !'
                    log.append(createLogData(dtuName, user, rmsg, OperationType.MODBUS_OP_MODIFY_PREFIX, time))
                else:
                    code = ErrorCode.PREFIX_UPDATE_ERROR
                    msg = 'Modify prefixes failure'
                    app.logger.error(msg)
                    print(msg)
            else:
                code = ErrorCode.PREFIX_UPDATE_ERROR
                msg = 'Create DTU failed: The prefix %s is already used in project %s. Please specify another prefix' % (
                prefix, projId)
                app.logger.error(msg)
                #print(msg)
    except Exception as e:
        code = ErrorCode.PREFIX_UPDATE_ERROR
        msg = str(e)
        app.logger.error(msg)
        #print(msg)
    MongoConnManager.getConfigConn().insertManyLog(log, dtuName)
    rv = dict(success=success, code=code, msg=msg)
    return jsonify(rv)

# 获取全部日志
@bp_modbus.route('/log', methods=['POST'])
def getAllLog():
    success = True
    code = ''
    msg = ''
    post_data = request.get_json()
    rdataList = []
    try:
        if post_data:
            s_time = post_data.get('startTime') if post_data.get('startTime') else None
            e_time = post_data.get('endTime') if post_data.get('endTime') else None
            dtuName = BEOPDataAccess.getInstance().getDtuNameByDtuId(post_data.get('dtuId'))
            rdataList = MongoConnManager.getConfigConn().getLogByDtuIdAndSearchText(dtuName, s_time, e_time)
    except Exception as e:
        success = False
        msg = "getAllLog Error: " + e.__str__()
        app.logger.error(msg)
        print(msg)
    rv = dict(success=success, code=code, msg=msg , data=rdataList)
    return jsonify(rv)


# obix调试
@bp_terminal.route('/obixs/debug', methods=['POST'])
def debugObixs():
    success = False
    code = ''
    msg = ''
    rdata = {}
    try:
        post_data = request.get_json()
        url = '/getObixValue'
        method = 'POST'
        rt = operationObixDeriveByHttp(url, method, post_data)
        if rt.get('success'):
            rdata = rt.get('data')    
            success = True
            msg = 'searchObixPoint success!'
    except Exception as e:
        code = ErrorCode.DTU_COMMAND_DEBUG_ERROR
        success = False
        msg = 'getObixValue Error :' + e.__str__()
        app.logger.error(msg)
        print(msg)
    rv = dict(success=success, code=code, msg=msg, data=rdata)
    return jsonify(rv)


# 设备调试
@bp_modbus.route('/dtu/debug/equipment', methods=['POST'])
def dtuEquipmentDebug():
    success = True
    code = ''
    rmsg = ''
    msg = ''
    rdata = {}
    param = []
    log = []
    datalist = []
    post_data = request.get_json()
    try:
        if post_data:
            time = post_data.get('time') if post_data.get('time') else None
            userName = post_data.get('user')
            dataShowType = int(post_data.get('dataShowType'))
            dtuName = BEOPDataAccess.getInstance().getDtuNameByDtuId(post_data.get('dtuId'))
            deviceId = (int(post_data.get('subAddress')))  # 子站地址/id
            funCode = int(post_data.get('codeType'))  # 功能码
            data_add = int(post_data.get('address'))  # 数据地址 需要转为两位16进制数
            data_length = int(post_data.get('length'))  # 长度  需要转为两位16进制数
            param.append(deviceId)  #
            param.append(funCode)  #
            param.append(data_add // 256)  # 数据地址高位
            param.append(data_add % 256)  # 数据地址地位
            param.append(data_length // 256)  # 数据长度高位
            param.append(data_length % 256)  # 数据长度地位
            command = crc16.createarray(param)  # 获取带校验码的数据
            hexcommand = [hex(item) for item in command]
            int_add = int(hexcommand[0], 16)
            str_add = hexcommand[0]
            str_data = hexListChangeHexString(hexcommand)
            dtuCmd = str_data[1:-1]  # 将16进制字符串转为字节串
            logBody = '（Send:%d，%s）,%s' % (int_add, str_add, str_data)
            log.append(createLogData(dtuName, userName, logBody, OperationType.MODBUS_OP_SEND, time))
            log.append(createLogData(dtuName, userName, logBody, OperationType.MODBUS_OP_EQUIPMENT, time))
            rt = setSendCmd(dtuName, dtuCmd, 0)
            if rt:
                if rt.get('success'):
                    start = data_add
                    end = data_add + data_length
                    rt = getAddressValue(dtuName, deviceId, funCode, start, end)
                    if rt:
                        if rt.get('success'):
                            Value = strChangeByte(rt.get('data'), start, end)
                            datalist = getPointValueByShowType(Value, dataShowType, start)
                            msg = rt.get("data")
                            strmsr = "%s Recive Data:" % (dtuName)
                            print(datetime.strftime(datetime.now(), '%Y-%m-%d %H:%M:%S') , strmsr , msg)
                            log.append(createLogData(dtuName, userName, msg, OperationType.MODBUS_OP_RECEIVE, time))
                        else:
                            code = ErrorCode.DTU_COMMAND_DEBUG_ERROR
                            msg = rt.get("msg")
                            log.append(createLogData(dtuName, userName, msg, OperationType.MODBUS_OP_ERROR, time))
                    else:
                        code = ErrorCode.DTU_COMMAND_DEBUG_ERROR
                        msg = "Failed to get point value"
                        log.append(createLogData(dtuName, userName, msg, OperationType.MODBUS_OP_ERROR, time))
                else:
                    code = ErrorCode.DTU_COMMAND_DEBUG_ERROR
                    msg = rt.get("msg")
                    log.append(createLogData(dtuName, userName, msg, OperationType.MODBUS_OP_ERROR, time))
            else:
                code = ErrorCode.DTU_COMMAND_DEBUG_ERROR
                msg = "Send the request to the device failure"
                log.append(createLogData(dtuName, userName, msg, OperationType.MODBUS_OP_ERROR, time))
    except Exception as e:
        code = ErrorCode.DTU_COMMAND_DEBUG_ERROR
        success = False
        rmsg = str(e)
        log.append(createLogData(dtuName, userName, msg, OperationType.MODBUS_OP_ERROR))
        print("dtuEquipmentDebug: ", rmsg)
    rdata['log'] = log
    rdata['datalist'] = datalist
    MongoConnManager.getConfigConn().insertManyLog(log, dtuName)
    rv = dict(success=success, code=code, msg=rmsg, data=rdata)
    return jsonify(rv)

# 命令调试
@bp_modbus.route('/dtu/debug/command', methods=['POST'])
def dtuCommandDebug():
    success = True
    code = ''
    rmsg = ''
    msg = ''
    rdata = {}
    log = []
    datalist = {}
    post_data = request.get_json()
    try:
        if post_data:
            time = post_data.get('time') if post_data.get('time') else None
            userName = post_data.get('user')
            dataShowType = int(post_data.get('dataShowType'))  #
            strcommand = post_data.get('command')
            type = post_data.get('type')
            dtuName = BEOPDataAccess.getInstance().getDtuNameByDtuId(post_data.get('dtuId'))
            command = [eval('0x' + item) for item in re.findall('[\w]+', strcommand)]
            deviceId = command[0]
            funCode = command[1]
            data_add = command[2] * 256 + command[3]
            data_length = command[4] * 256 + command[5]
            if type == 'check':
                mqcommand = crc16.createarray(command)  # 将16进制字符串转为10进制数组，进行crc校验。
            else:
                if crc16.calcrc(command) == 0:
                    mqcommand = command
                else:
                    success = False
                    rmsg = 'Debugging command error'
                    print("dtuCommandDebug Error:", rmsg)
                    log.append(createLogData(dtuName, userName, rmsg, 2))
            if success:
                hexcommand = [hex(item) for item in mqcommand]
                int_add = int(hexcommand[0], 16)
                str_add = hexcommand[0]
                str_data = hexListChangeHexString(hexcommand)
                dtuCmd = str_data[1:-1]  # 将16进制字符串转为字节串
                logBody = '（Send:%d，%s）,%s' % (int_add, str_add, str_data)
                log.append(createLogData(dtuName, userName, logBody, OperationType.MODBUS_OP_COMMAND, time))
                log.append(createLogData(dtuName, userName, logBody, OperationType.MODBUS_OP_SEND, time))
                rt = setSendCmd(dtuName, dtuCmd, 0)
                if rt:
                    if rt.get('success'):
                        start = int(data_add) + 1
                        end = data_add + data_length
                        rt = getAddressValue(dtuName, deviceId, funCode, start, end)
                        if rt:
                            if rt.get('success'):
                                Value = strChangeByte(rt.get('data'), start, end)
                                datalist = getPointValueByShowType(Value, dataShowType, start)
                                msg = rt.get("data")
                                print("Receive Data:", msg)
                                log.append(createLogData(dtuName, userName, msg, OperationType.MODBUS_OP_RECEIVE, time))
                            else:
                                code = ErrorCode.DTU_COMMAND_DEBUG_ERROR
                                msg = rt.get("msg")
                                print("dtuCommandDebug Error:", msg)
                                log.append(createLogData(dtuName, userName, msg, OperationType.MODBUS_OP_ERROR, time))
                        else:
                            code = ErrorCode.DTU_COMMAND_DEBUG_ERROR
                            msg = "Failed to get point value"
                            print("dtuCommandDebug Error:", msg)
                            log.append(createLogData(dtuName, userName, msg, OperationType.MODBUS_OP_ERROR, time))
                    else:
                        code = ErrorCode.DTU_COMMAND_DEBUG_ERROR
                        msg = rt.get("msg")
                        print("dtuCommandDebug Error:", msg)
                        log.append(createLogData(dtuName, userName, msg, OperationType.MODBUS_OP_ERROR, time))
                else:
                    code = ErrorCode.DTU_COMMAND_DEBUG_ERROR
                    msg = "Send the request to the device failure"
                    print("dtuCommandDebug Error:", msg)
                    log.append(createLogData(dtuName, userName, msg, OperationType.MODBUS_OP_ERROR, time))
    except Exception as e:
        code = ErrorCode.DTU_COMMAND_DEBUG_ERROR
        success = False
        rmsg = str(e)
        print(rmsg)
        log.append(createLogData(dtuName, userName, msg, OperationType.MODBUS_OP_ERROR, time))
    MongoConnManager.getConfigConn().insertManyLog(log, dtuName)
    rdata['log'] = log
    rdata['datalist'] = datalist
    rv = dict(success=success , msg=rmsg, code=code, data=rdata)
    return jsonify(rv)

# 历史操作
@bp_modbus.route('/history', methods=['POST'])
@bp_terminal.route('/obixs/history', methods=['POST'])
def dtuOperationHostory():
    success = True
    code = ''
    msg = ''
    rdata = {}
    try:
        post_data = request.get_json()
        if post_data:
            s_time = post_data.get('startTime')
            e_time = post_data.get('endTime')
            pageSize = post_data.get('pageSize')
            pageNum = post_data.get('pageNum')
            dtuName = BEOPDataAccess.getInstance().getDtuNameByDtuId(post_data.get('dtuId'))
            datalist = MongoConnManager.getConfigConn().getHistoryOperationMessage(dtuName, s_time, e_time)
            if datalist:
                rdata = dataShowPage(datalist, pageSize, pageNum)
                if not rdata:
                    success = False
                    msg = "dtuOperationHostory Error : Failed to get data paging"
                    app.logger.error(msg)
                    print(msg)
        else:
            success = False
            code = ErrorCode.DTU_OPERATION_ERROR_OPERATING_DATA
            msg = 'dtuOperationHostory Error : Failed to get historical operating data'
            app.logger.error(msg)
            print(msg)
    except Exception as e:
        code = ErrorCode.DTU_OPERATION_ERROR_GET_DATA
        success = False
        msg = 'dtuOperationHostory Error :' + e.__str__()
        app.logger.error(msg)
        print(msg)
    rv = dict(success=success, code=code, msg=msg, data=rdata)
    return jsonify(rv)


# obix开始搜索
@bp_terminal.route('/obix/dtu/autoSearch/start', methods=['POST'])
def startObixSearch():
    success = False
    code = ''
    msg = ''
    rdata = []
    try:
        post_data = request.get_json()
        url = '/searchObixPointAsyn'
        method = 'POST'
        rt = operationObixDeriveByHttp(url, method, post_data)
        if rt.get('success'):
            rdata = rt.get('data')    
            success = True
            msg = 'searchObixPoint success!'  
            RedisManager.set("OBIX_SEARCH_TYPE_"+post_data.get("obixTag"), 1)
    except Exception as e:
        code = ErrorCode.START_OBIX_SEARCH_ERROR
        success = False
        msg = 'startObixSearch Error :' + e.__str__()
        app.logger.error(msg)
        print(msg)
    rv = dict(success=success, code=code, msg=msg)
    return jsonify(rv)



# 查看自动搜索是否完成状态
@bp_terminal.route('/obix/dtu/autoSearch/getStatus', methods=['POST'])
def getObixSearchStatus():
    success = False
    code = ''
    msg = ''
    rdata = 0
    try:
        post_data = request.get_json()
        dtuId = post_data.get("dtuId")
        projId = post_data.get("projId")
        dtuName = BEOPDataAccess.getInstance().getDtuNameByDtuId(dtuId)
        createUser = post_data.get("user")
        modify_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        url = '/getPointASynState'
        method = 'POST'
        r_post_data = {"obixTag":dtuName}
        rt = operationObixDeriveByHttp(url, method, r_post_data)
        if rt.get('success'):
            searchData = rt.get('data')  
            if searchData:
                searchData = json.loads(searchData)
                if searchData["bSearching"] == True:
                    rdata = 1
                else:
                    rdata = 0  
                    if RedisManager.get("OBIX_SEARCH_TYPE_"+dtuName) == 1:
                        if len(searchData["pointList"]) > 0:
                            MongoConnManager.getConfigConn().deleteAllPointByDtuName(dtuName)
                            insertSearchDataSyn(searchData["pointList"], projId, dtuName, createUser, modify_time)
                        RedisManager.set("OBIX_SEARCH_TYPE_"+dtuName, 0)
            success = True
            msg = 'getObixSearchStatus success!'  
    except Exception as e:
        success = False
        msg = 'getObixSearchStatus Error :' + e.__str__()
        app.logger.error(msg)
        print(msg)
    #0: '就绪', 1: '繁忙'  
    rv = dict(success=success, code=code, msg=msg, data=rdata)
    #rv = {}
    return jsonify(rv)

# dtu运行
@bp_modbus.route('/dtu/run', methods=['POST'])
def dtuNodeRun():
    success = True
    code = ''
    msg = ''
    log = []
    try:
        post_data = request.get_json()
        if post_data:
            time = post_data.get('time') if post_data.get('time') else None
            userName = post_data.get('user')
            dtuId = post_data.get('dtuId')
            dtuName = BEOPDataAccess.getInstance().getDtuNameByDtuId(dtuId)
            serverCode = BEOPDataAccess.getInstance().getServerCodeByDtuId(dtuId)
            success = setRunAndStopControl(dtuName, 1, int(serverCode))
            if success:
                rmsg = 'start dtu success!'
                log.append(createLogData(dtuName, userName, rmsg, OperationType.MODBUS_OP_RUN, time))
            else:
                code = ErrorCode.RUN_STOP_ERROR
                success = False
                msg = "start dtu failed!"
                log.append(createLogData(dtuName, userName, msg, OperationType.MODBUS_OP_RUN, time))
                print(msg)
                app.logger.error(msg)
    except Exception as e:
        code = ErrorCode.RUN_STOP_ERROR
        msg = "dtuNodeRun Error: " + e.__str__()
        success = False
        print(msg)
        log.append(createLogData(dtuName, userName, msg, OperationType.MODBUS_OP_ERROR, time))
        app.logger.error(msg)
    MongoConnManager.getConfigConn().insertManyLog(log, dtuName)
    rv = dict(success=success, msg=msg, code=code)
    return jsonify(rv)

# dtu停止
@bp_modbus.route('/dtu/stop', methods=['POST'])
def dtuNodeStop():
    success = True
    code = ''
    msg = ''
    log = []
    try:
        post_data = request.get_json()
        if post_data:
            time = post_data.get('time') if post_data.get('time') else None
            userName = post_data.get('user')
            dtuId = post_data.get('dtuId')
            dtuName = BEOPDataAccess.getInstance().getDtuNameByDtuId(dtuId)
            serverCode = BEOPDataAccess.getInstance().getServerCodeByDtuId(dtuId)
            success = setRunAndStopControl(dtuName, 0,int(serverCode))
            if success:
                rmsg = 'stop dtu success!'
                log.append(createLogData(dtuName, userName, rmsg, OperationType.MODBUS_OP_STOP, time))  # type : 0,send ，1,Error ,2,Recevie ,3,Run ,4,Stop
            else:
                code = ErrorCode.RUN_STOP_ERROR
                success = False
                msg = " stop dtu failed!"
                log.append(createLogData(dtuName, userName, msg, OperationType.MODBUS_OP_STOP, time))
                print(msg)
                app.logger.error(msg)
    except Exception as e:
        code = ErrorCode.RUN_STOP_ERROR
        msg = "dtuNodeRun Error: " + e.__str__()
        success = False
        print(msg)
        log.append(createLogData(dtuName, userName, msg, OperationType.MODBUS_OP_ERROR, time))
        app.logger.error(msg)
    MongoConnManager.getConfigConn().insertManyLog(log, dtuName)
    rv = dict(success=success, msg=msg, code=code)
    return jsonify(rv)

# 删除dtu下所有日志
@bp_modbus.route('/dtu/log', methods=['POST'])
def deleteDtuLog():
    success = False
    code = ''
    msg = ''
    try:
        post_data = request.get_json()
        if post_data:
            dtuId = post_data.get('dtuId')
            dtuName = BEOPDataAccess.getInstance().getDtuNameByDtuId(dtuId)
            success = MongoConnManager.getConfigConn().deleteLogByDtuId(dtuName)
            if success == False:
                msg = 'deleteDtuLog Error:Delete the log failure '
                app.logger.error(msg)
                print(msg)
    except Exception as e:
        msg = 'deleteDtuLog Error: ' + e.__str__()
        app.logger.error(msg)
        print(msg)
    rv = dict(success=success, msg=msg, code=code)
    return jsonify(rv)

# 通过serverCode获取项目
@bp_modbus.route('/dtu/getall', methods=['POST'])
def getAllDtuByServerCode():
    success = True
    msg = ''
    code = ''
    rdata = []
    try:
        post_data = request.get_json()
        if post_data:
            serverCode = post_data.get('serverCode')
            rdata = BEOPDataAccess.getInstance().getAllDtuByServercode(serverCode)
            if not rdata:
                msg = 'Dtu serverCode is %s unexist! ' % (str(serverCode))
                #app.logger.error(msg)
                success = True
                #print(msg)
    except Exception as e:
        msg = "getAllDtuByServerCode Error: " + e.__str__()
        app.logger.error(msg)
        success = False
        print(msg)
    rv = dict(success=success, code=code, msg=msg, data=rdata)
    return jsonify(rv)

# 检测项目是否存在
@bp_modbus.route('/dtu/check', methods=['POST'])
def checkDtuNameIsExist():
    success = True
    msg = ''
    code = ''
    exist = True
    try:
        post_data = request.get_json()
        if post_data:
            dtuname = post_data.get('dtuName')
            dtuId = BEOPDataAccess.getInstance().getDtuIdByDtuName(dtuname)
            if not dtuId:
                exist = False
    except Exception as e:
        msg = "checkDtuNameIsExist Error: " + e.__str__()
        app.logger.error(msg)
        success = False
        print(msg)
    rdata = dict(name=dtuname, exist=exist)
    rv = dict(success=success, code=code, msg=msg, data=rdata)
    return jsonify(rv)

# 获取点表
@bp_modbus.route('/dtu/getPointTable', methods=['POST'])
def getPointTableByDtuId():
    rdata = []
    success = False
    code = ''
    msg = ''
    try:
        post_data = request.get_json()
        if post_data:
            dtuName = post_data.get('dtuName')
            prefix = BEOPDataAccess.getInstance().getDtuPrefixByDtuName(dtuName)
            rdata = MongoConnManager.getConfigConn().getPointByDtuName(dtuName, prefix)
            if rdata:
                success = True
            else:
                #code = ErrorCode.GET_DTU_POINT_LIST_ERROR
                success = True
                msg = "getDtuPointDataList Error: Failed to get the point table"
                #app.logger.error(msg)
                #print(msg)
    except Exception as e:
        code = ErrorCode.GET_DTU_POINT_LIST_ERROR
        msg = "getDtuPointDataList Error:" + e.__str__()
        app.logger.error(msg)
        print(msg)
    rv = dict(success=success, code=code, msg=msg, data=rdata)
    return jsonify(rv)


@bp_modbus.route('/dtu/export/cloud/<projectId>/<dtuId>', methods=['GET'])
@bp_terminal.route('/obixs/export/<projectId>/<dtuId>', methods=['GET'])
def exportPointDtu(projectId, dtuId):
    rdata = []
    success = False
    code = ''
    msg = ''
    try:
        dtuName = BEOPDataAccess.getInstance().getDtuNameByDtuId(dtuId)
        rdata = MongoConnManager.getConfigConn().getPointByDtuNameNoPerfix(dtuName)
        if rdata:
            success = True
        else:
            code = ErrorCode.GET_DTU_POINT_LIST_ERROR
            msg = "getDtuPointDataList Error: Failed to get the point table"
            app.logger.error(msg)
            print(msg)
    except Exception as e:
        code = ErrorCode.GET_DTU_POINT_LIST_ERROR
        msg = "exportPointDtu Error:" + e.__str__()
        app.logger.error(msg)
        print(msg)
    rv = dict(success=success, code=code, msg=msg, data=rdata)
    return jsonify(rv)


# 插入log
@bp_modbus.route('/dtu/insertlog', methods=['POST'])
def insertDtuLog():
    success = True
    msg = ''
    code = ''
    post_data = None
    try:
        post_data = request.get_json()
        if post_data:
            logdata = post_data.get('logData')
            dtuName = post_data.get('dtuname')
            if MongoConnManager.getConfigConn().insertManyLog(logdata, dtuName):  # 将log插入数据库
                success = True
            else:
                success = False
                msg = 'Insert log failure'
    except Exception:
        logging.error('Failed to insert DTU log! post_data=%s', post_data, exc_info=True, stack_info=True)
        success = False
    rv = dict(success=success, code=code, msg=msg)
    return jsonify(rv)


@bp_modbus.route('/')
def index():
    return render_template('views/dm.main.html')


# 获取在线状态
def getDTUState(dtuName):
    try:
        post_data = {}
        url = '/GetDTUState'
        method = 'POST'
        post_data['dtuname'] = dtuName
        rt = operationDeriveByHttp(url, method, post_data)
        if not rt:
            return rt
        return rt
    except Exception as e:
        print("getDTUState Error: " + e.__str__())
        app.logger.error("getDTUState Error: " + e.__str__())
        return None


# 启停DTU
def setRunAndStopControl(dtuName, runControl, serverCode):
    try:
        post_data = {}
        url = '/SetRunControl'
        method = 'POST'
        post_data['dtuname'] = dtuName
        post_data['runcontrol'] = runControl  #  0 : 停止 ；1 : 启动
        BEOPDataAccess.getInstance().setDTUFlag(dtuName, runControl)
        state = getDTUState(dtuName)
        if state:
            if state.get('success'):
                rdata = eval(state.get('data'))
                if  rdata.get('state') == 1:
                    if serverCode == 4:
                        rt = operationObixDeriveByHttp(url, method, post_data)
                        return rt.get('success')
                    else:
                        rt = operationDeriveByHttp(url, method, post_data)
                        return rt.get('success')
        else:
            return None
    except Exception as e:
        print("setRunAndStopControl Error: " + e.__str__())
        app.logger.error("setRunAndStopControl Error: " + e.__str__())
        return False

# 通知点表更新
def updatePointTable(dtuName):
    try:
        post_data = {}
        url = '/SetChangePoint'
        method = 'POST'
        post_data['dtuname'] = dtuName
        rt = operationDeriveByHttp(url, method, post_data)
        if not rt:
            return rt
        return rt
    except Exception as e:
        print("updatePointTable Error: " + e.__str__())
        app.logger.error("updatePointTable Error: " + e.__str__())
        return None

# 获取DTU值
def getAddressValue(dtuName, deviceId, funCode, start, end):
    try:
        post_data = {}
        url = '/GetAddressValue'
        method = 'POST'
        post_data['dtuname'] = dtuName
        post_data['deviceid'] = deviceId
        post_data['funcode'] = funCode
        post_data['start'] = start
        post_data['end'] = end
        print("post_data:", post_data)
        rt = operationDeriveByHttp(url, method, post_data)
        if not rt:
            return rt
        return rt
    except Exception as e:
        print("getAddressValue Error: " + e.__str__())
        app.logger.error("getAddressValue Error: " + e.__str__())
        return None

# 读写命令
def setSendCmd(dtuName, dtuCmd, write):
    try:
        post_data = {}
        url = '/SetSendCmd'
        method = 'POST'
        post_data['dtuname'] = dtuName
        post_data['dtucmd'] = dtuCmd
        post_data['write'] = write
        rt = operationDeriveByHttp(url, method, post_data)
        if not rt:
            return rt
        return rt
    except Exception as e:
        print("setSendCmd Error: " + e.__str__())
        app.logger.error("setSendCmd Error: " + e.__str__())
        return None

# 16进制转字符串
def hexListChangeHexString(hexlist):
    strList = []
    try:
        for item in hexlist:
            if len(item[2:]) == 1:
                strList.append('0' + item[2:])
            else:
                strList.append(item[2:])
        strcommand = '[' + ' '.join(strList) + ']'
        return strcommand
    except Exception as e:
        print("hexListChangeHexString Error: " + e.__str__())
        app.logger.error("hexListChangeHexString Error: " + e.__str__())
        return None

# 分页显示
def dataShowPage(datalist, pageSize, pageNum):
    pageSize = pageSize if isinstance(pageSize, int) else int(pageSize)
    pageNum = pageNum if isinstance(pageNum, int) else int(pageNum)
    data = {}
    try:
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
            data['total'] = total
            return data
    except Exception as e:
        print("dataShowPage Error: " + e.__str__())
        app.logger.error("dataShowPage Error: " + e.__str__())
        return None

# http操作设备
def operationDeriveByHttp(path, method, form):
    MODBUSSERVER_URL = app.config.get('EXPERT_MODBUSSERVER_URL')
    headers = {'content-type': 'application/json'}
    request_path = MODBUSSERVER_URL + path
    # 进行转发
    try:
        if method == 'GET':
            r = requests.get(request_path)
        elif method == 'POST':
            r = requests.post(url=request_path, headers=headers, data=json.dumps(form))
        if not r:
            return None
        return json.loads(r.text)
    except Exception as e:
        print("operationDeriveByHttp Error: " + e.__str__())
        app.logger.error("operationDeriveByHttp Error: " + e.__str__())
        return None
    
# http操作设备
def operationObixDeriveByHttp(path, method, form):
    MODBUSSERVER_URL = app.config.get('EXPERT_OBIXSERVER_URL')
    headers = {'content-type': 'application/json'}
    request_path = MODBUSSERVER_URL + path
    # 进行转发
    try:
        logging.info('Calling Obix HTTP API: method=%s, url=%s, data=%s', method, request_path, form)
        if method == 'GET':
            r = requests.get(request_path)
        elif method == 'POST':
            r = requests.post(url=request_path, headers=headers, data=json.dumps(form))
        if not r:
            logging.error('No response is returned!', stack_info=True)
            return None
        logging.info('Response ')
        return json.loads(r.text)
    except Exception:
        logging.error('Unhandled exception! locals: %s', locals(), exc_info=True, stack_info=True)
        return None

def createLogData(dtuName, user, logmsg, type, time=None):
    if not time:
        time = datetime.strftime(datetime.now(), '%Y-%m-%d %H:%M:%S')
    log = {}
    log['type'] = int(type)  # 0, send 1，Recive 2，error
    log['log'] = logmsg
    log['time'] = time
    log['userName'] = user
    log['dtuName'] = dtuName
    return log

def strChangeByte(strData, start, end):
    rdata = []
    try:
        data = json.loads("%s" % (strData))
        value = data.get('value')
        for key in range(start, end):
            if not value[str(key)]:
                rdata.append(None)
                continue
            rdata.append(bytes.fromhex(value[str(key)]))
        return rdata
    except Exception as e:
        print(e.__str__())
        return None

def getPointValueByShowType(data, showType, start):
    try:
        Flag = True
        length1 = [0, 1, 2, 12]
        length2 = [3, 4, 5, 6, 9, 10]
        length4 = [7, 8]
        rdata = {}
        for item in range(0, len(data)):
            rdata[str(start + item)] = None
        if showType in length1:
            key = start + 1
            for item in data:
                vecValue = []
                vecValue.append(item)
                rvalue = GetValueByDataTypeAndRange1(showType, vecValue)
                if rvalue:
                    rdata[str(key)] = rvalue
                key += 1
        elif showType in length2:
            key = start + 1
            while Flag:
                if len(data) >= 2:
                    vecValue = data[:2]
                    rvalue = GetValueByDataTypeAndRange1(showType, vecValue)
                    if rvalue:
                        rdata[str(key)] = rvalue
                    data = data[2:]
                    key += 2
                else:
                    vecValue = data
                    rvalue = GetValueByDataTypeAndRange1(showType, vecValue)
                    if rvalue:
                        rdata[str(key)] = rvalue
                    Flag = False
        elif showType in length4:
            key = start + 1
            while Flag:
                if len(data) >= 4:
                    vecValue = data[:4]
                    rvalue = GetValueByDataTypeAndRange1(showType, vecValue)
                    if rvalue:
                        rdata[str(key)] = rvalue
                    data = data[4:]
                    key += 4
                else:
                    vecValue = data
                    rvalue = GetValueByDataTypeAndRange1(showType, vecValue)
                    if rvalue:
                        rdata[str(key)] = rvalue
                    Flag = False
        else:
            rdata = {}
            print("Unknown data type")
    except Exception as e:
        rdata = {}
        print(e.__str__())
    return rdata

def GetValueByDataTypeAndRange1(valueType, vecValue):
    try:
        if len(vecValue) <= 0  or None in vecValue:
            return None
        if valueType == ModbusType.E_MODBUS_SIGNED:
            wValue = analyzeSigned(vecValue[0])
            if wValue == None:
                return None
            strValue = '%.2f' % wValue
            return strValue
        elif valueType == ModbusType.E_MODBUS_UNSIGNED:
            wValue = analyzeUnSigned(vecValue[0])
            if wValue == None:
                return None
            strValue = '%.2f' % wValue
            return strValue
        elif valueType == ModbusType.E_MODBUS_HEX:
            dwValue = analyzeSigned(vecValue[0])
            if dwValue == None:
                return None
            strValue = hex(dwValue)
            return strValue
        elif valueType == ModbusType.E_MODBUS_BITE:
            return None
        elif valueType == ModbusType.E_MODBUS_LONG:
            if len(vecValue) < 2:
                return None
            dwValue = analyzeLong(vecValue[0], vecValue[1])
            if dwValue == None:
                return None
            strValue = '%.2f' % dwValue
            return strValue
        elif valueType == ModbusType.E_MODBUS_LONG_INVERSE:
            if len(vecValue) < 2:
                return None
            dwValue = analyzeLongInverse(vecValue[0], vecValue[1])
            if dwValue == None:
                return None
            strValue = '%.2f' % dwValue
            return strValue
        elif valueType == ModbusType.E_MODBUS_FLOAT:
            if len(vecValue) < 2:
                return None
            dwValue = analyzeFloat(vecValue[0], vecValue[1])
            if dwValue == None:
                return None
            strValue = '%.2f' % dwValue
            return strValue
        elif valueType == ModbusType.E_MODBUS_FLOAT_INVERSE:
            if len(vecValue) < 2:
                return None
            dwValue = analyzeFloatInverse(vecValue[0], vecValue[1])
            if dwValue == None:
                return None
            strValue = '%.2f' % dwValue
            return strValue
        elif valueType == ModbusType.E_MODBUS_DOUBLE:
            if len(vecValue) < 4:
                return None
            dwValue = analyzeDouble(vecValue[0], vecValue[1], vecValue[2], vecValue[3])
            if dwValue == None:
                return None
            strValue = '%.2f' % dwValue
            return strValue
        elif valueType == ModbusType.E_MODBUS_DOUBLE_INVERSE:
            if len(vecValue) < 4:
                return None
            dwValue = analyzeDoubleInverse(vecValue[0], vecValue[1], vecValue[2], vecValue[3])
            if dwValue == None:
                return None
            strValue = '%.2f' % dwValue
            return strValue
        elif valueType == ModbusType.E_MODBUS_STRING:
            dwValue = analyzeString(vecValue)
            if dwValue == None:
                return None
            return '%s' % dwValue
        elif valueType == ModbusType.E_MODBUS_STRING_INVERSE:
            dwValue = analyzeStringInverse(vecValue)
            if dwValue == None:
                return None
            return '%s' % dwValue
        elif valueType == ModbusType.E_MODBUS_POWERLINK:
            return None
        else:
            return None
    except Exception as e:
        print(e.__str__())
        logging.error(e.__str__())
        return None

def analyzeSigned(data):
    try:
        str = bytearray(2)
        str[0] = data[1]
        str[1] = data[0]
        return struct.unpack('h', str)[0]
    except Exception as e:
        print(e.__str__())
        logging.error(e.__str__())
        return None

def analyzeUnSigned(data):
    try:
        str = bytearray(2)
        str[0] = data[1]
        str[1] = data[0]
        v2 = struct.unpack('h', str)[0]
        nFlag = (v2 >> 15) & 1
        if nFlag > 0:
            v2 = v2 + 65536
        return v2
    except Exception as e:
        print(e.__str__())
        logging.error(e.__str__())
        return None

def analyzeHex(data):
    try:
        return data
    except Exception as e:
        print(e.__str__())
        logging.error(e.__str__())
        return None

def analyzeLongInverse(data, data1):
    try:
        str = bytearray(4)
        str[0] = data1[1]
        str[1] = data1[0]
        str[2] = data[1]
        str[3] = data[0]
        return struct.unpack('l', str)[0]
    except Exception as e:
        print(e.__str__())
        logging.error(e.__str__())
        return None

def analyzeLong(data, data1):
    try:
        str = bytearray(4)
        str[0] = data[1]
        str[1] = data[0]
        str[2] = data1[1]
        str[3] = data1[0]
        return struct.unpack('l', str)[0]
    except Exception as e:
        print(e.__str__())
        logging.error(e.__str__())
        return None

def analyzeFloatInverse(data, data1):
    try:
        str = bytearray(4)
        str[0] = data1[1]
        str[1] = data1[0]
        str[2] = data[1]
        str[3] = data[0]
        return struct.unpack('f', str)[0]
    except Exception as e:
        print(e.__str__())
        logging.error(e.__str__())
        return None

def analyzeFloat(data, data1):
    try:
        str = bytearray(4)
        str[0] = data[1]
        str[1] = data[0]
        str[2] = data1[1]
        str[3] = data1[0]
        return struct.unpack('f', str)[0]
    except Exception as e:
        print(e.__str__())
        logging.error(e.__str__())
        return None

def analyzeDoubleInverse(data, data1, data2, data3):
    try:
        str = bytearray(8)
        str[0] = data3[1]
        str[1] = data3[0]
        str[2] = data2[1]
        str[3] = data2[0]
        str[4] = data1[1]
        str[5] = data1[0]
        str[6] = data[1]
        str[7] = data[0]
        return struct.unpack('d', str)[0]
    except Exception as e:
        print(e.__str__())
        logging.error(e.__str__())
        return None

def analyzeDouble(data, data1, data2, data3):
    try:
        str = bytearray(8)
        str[0] = data[1]
        str[1] = data[0]
        str[2] = data1[1]
        str[3] = data1[0]
        str[4] = data2[1]
        str[5] = data2[0]
        str[6] = data3[1]
        str[7] = data3[0]
        return struct.unpack('d', str)[0]
    except Exception as e:
        print(e.__str__())
        logging.error(e.__str__())
        return None

def analyzeStringInverse(vecValue):
    try:
        length = len(vecValue)
        str = bytearray(length * 2)
        for i in range(length):
            str[2 * i] = vecValue[length - i - 1][0]
            str[2 * i + 1] = vecValue[length - i - 1][1]
        format = '%ds' % (length * 2)
        return struct.unpack(format, str)[0]
    except Exception as e:
        print(e.__str__())
        logging.error(e.__str__())
        return None

def analyzeString(vecValue):
    try:
        length = len(vecValue)
        str = bytearray(length * 2)
        for i in range(length):
            str[2 * i] = vecValue[i][0]
            str[2 * i + 1] = vecValue[i][1]
        format = '%ds' % (length * 2)
        return struct.unpack(format, str)[0]
    except Exception as e:
        print(e.__str__())
        logging.error(e.__str__())
        return None


def createDtuName(projId):
    success = True
    msg = ''
    code = ''
    dtuname = ''
    try:
        name_cn = BEOPDataAccess.getInstance().getNamecnByProjId(projId)
        if name_cn:
            other = ''
            namelist = list(name_cn)
            for item in namelist:
                if item >= '\u4e00' and item <= '\u9fa5':  # 获取中文首字母
                    dtuname += getPinyin(item)
                elif ord(item) >= 65 and ord(item) <= 90:  # 获取命名驼峰格式的首字母
                    dtuname += chr(ord(item) + 32)
                else:  # 获取前四个字母
                    other += item
            if other:
                dtuname = other
            if dtuname:
                if len(dtuname) >= 4:
                    dtuname = dtuname[:4]
                dtuname = dtuname + datetime.strftime(datetime.now(), "%Y%m%d%H%M%S")[2:-6]
                if len(dtuname) == 10:
                    rdtuname = BEOPDataAccess.getInstance().getNewCreateDtuNameByNameKey(dtuname)
                    if rdtuname:
                        print(rdtuname[-2:])
                        dtuname = ("%s%02d") % (rdtuname[:-2], int(rdtuname[-2:]) + 1)  # 如果存在，则编号+1，生成新dtuname。
                    else:
                        dtuname += "01"
                else:
                    msg = 'getDtuName failed:Generate DTU name failed'
                    success = False
                    app.logger.error(msg)
            else:
                msg = 'getDtuName failed:Failed to get the project name abbreviations'
                app.logger.error(msg)
                success = False
        else:
            msg = 'getDtuName failed: Failed to get the project name'
            app.logger.error(msg)
    except Exception as e:
        print(e.__str__())
        logging.error(e.__str__())
        return None
    return dtuname

def checkObixInfo(post_data):
    checkUrl = '/checkObixInfo'
    method = 'POST'
    rt = operationObixDeriveByHttp(checkUrl, method, post_data)
    if rt is not None and rt.get('success'):
        return True
    return False 

def searchObixPoint(post_data):
    #searchUrl = '/searchObixPoint'
    searchUrl = '/searchObixPointAsyn'
    method = 'POST'
    rdata = ''
    rt = operationObixDeriveByHttp(searchUrl, method, post_data)
    if rt is not None and rt.get('success'):
        rdata = rt.get('data')
        RedisManager.set("OBIX_SEARCH_TYPE_"+post_data.get("obixTag"), 1)
    return rdata   

def getObixValue(post_data):
    url = '/getObixValue' 
    method = 'POST'
    rt = operationObixDeriveByHttp(url, method, post_data)
    if rt is not None and rt.get('success'):
        return True
    return False 

def insertSearchDataSyn(pointData, projId, dtuname, createUser, modify_time):
    dataList = []
    for item in pointData:
        datapoint = {}
        params = {}
        # params['note'] = post_data.get('note')
        params['address'] = item[1]
        params['pointType'] = 'obix'
        datapoint['pointName'] = item[0]
        datapoint['type'] = 4
        datapoint['projId'] = projId
        datapoint['dtuName'] = dtuname
        datapoint['create_by'] = createUser
        datapoint['create_time'] = modify_time
        datapoint['modify_by'] = createUser
        datapoint['modify_time'] = modify_time
        datapoint['params'] = params
        dataList.append(datapoint)
    MongoConnManager.getConfigConn().insertManyPointToMongoDB(dataList)
