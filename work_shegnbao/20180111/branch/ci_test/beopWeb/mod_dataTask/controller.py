__author__ = 'win7'

import logging
from beopWeb.mod_dataTask import bp_dataTask
from flask import request, json
from .dbOperator import *
from bson import ObjectId

#以下的全部接口只是对mongo配置表的DataTaskConfig表进行数据的操作，不与后台具体的生产和消费程序打交道
@bp_dataTask.route('/new/<int:projId>', methods=['post'])
def NewDataTask(projId):
    """
    新建一个任务：
    type:任务的类型，0是定时补数，1是更新天气，2是发送报表，3是产生随机数，4是项目数据拷贝
    status:任务的开关状态
    period:任务的执行周期
    mode:任务的模式，appoint是制定时刻运行,periodic是周期性的运行
    schedule:当mode是appoint的时候有效，是一个列表，每个项是"HH:MM"格式的字符串
    param:与type对应的参数。
          当type=0的时候，{'pointList':['点名1','点名2'......] or None, 'patchTimeMinute':当前时间往前推的分钟数}
          当type=1的时候，{'apiType':'byId' or 'byName','code':'城市代码字符串','ptName':'点名字符串'}
          当type=2的时候，待定
          当type=3的时候，待定
          当type=4的时候，[projId1,projId2,projId3......]
    :param projId:path参数，需要传进来项目的ID
    :return:dict('msg'= 信息字符串，出错的时候为出错信息，否则为ok,'status' = False or True，出错为False,'data' = 正常返回的是数据的id，否则是None)
    """
    result = {'status':False, 'msg':'failed', 'data':None}
    try:
        data = request.get_json()
        if data:
            schedule = []
            type = int(data.get('type', 0))
            status = bool(data.get('status', False))
            period = int(data.get('period', 5))#单位为分钟，默认5
            mode = data.get('mode')
            if (mode is None) or (mode not in ('appoint', 'periodic')):
                raise Exception('mode must be appoint or periodic')
            if mode == 'appoint':
                schedule = data.get('schedule', [])
                if not schedule:
                    raise Exception('schedule must contain at least one time string(like 8:00, 16:30) when mode is appoint')
            if type == 0:#定时补数
                try:
                    #每几分钟补多久，补哪些点(param.pointList, param.patchTimeMinute)，如果点不指定默认为全部
                    #param的结构{'pointList':[] or None, 'patchTimeMinute':当前时间往前推的分钟数}
                    param = data.get('param')
                    if param is None or (not isinstance(param, dict)):
                        raise Exception('param field must in request and object type')
                    if not ('pointList' in param and 'patchTimeMinute' in param):
                        raise Exception('pointList and patchTimeMinute must be included')
                except Exception as e:
                    raise Exception('type = 0 , ' + str(e))
            elif type == 1:#更新天气
                try:
                    param = data.get('param')
                    if param is None or (not isinstance(param, dict)):
                        raise Exception('param field must in request and object type')
                    #气象数据类型（api Type1, Type2,...)，城市代号，虚拟点名
                    apiType = param.get('apiType')
                    if apiType is None:
                        raise Exception('apiType must be included in param')
                    if not isinstance(apiType, str):
                        raise Exception('apiType must be byId or byName')
                    code = param.get('code')
                    if code is None:
                        raise Exception('code must be included in param')
                    if not isinstance(code, str):
                        raise Exception('code must be string')
                    vpoint = param.get('ptName')
                    if vpoint is None:
                        raise Exception('ptName must be included in param')
                    if not isinstance(vpoint, str):
                        raise Exception('ptName must be string')
                except Exception as e:
                    raise Exception('type = 1 , ' + str(e))
            elif type == 2:#发送报表
                try:
                    param = data.get('param')
                    if not isinstance(param, list):
                        raise Exception('param must be a list')
                except Exception as e:
                    raise Exception('type = 2 , ' + str(e))
            elif type == 3:#随机数
                try:
                    param = data.get('param')
                    if not isinstance(param, dict):
                        raise Exception('param must be a object')
                    if 'pointname' not in param\
                        or 'array' not in param:
                            raise Exception('pointname,array must be in param')
                except Exception as e:
                    raise Exception('type = 3 , ' + str(e))
            elif type == 4:#项目数据拷贝
                try:
                    param = data.get('param')
                    if not isinstance(param, list):
                        raise Exception('param must be a list')
                    else:
                        if len(param) == 0:
                            raise Exception('array must contain at least one item')
                except Exception as e:
                    raise Exception('type = 4 , ' + str(e))
            else:
                raise Exception('type is invalid')
            item = {'type':type, 'status':status, 'period':period, 'param':param, 'mode':mode, 'schedule':schedule}
            id = dataTaskDBOperator.insert(projId, item)
            if ObjectId.is_valid(id):
                result['msg'] = 'ok'
                result['status'] = True
                result['data'] = id.__str__()
    except Exception as e:
        print('interface DataTaskNew error:' + e.__str__())
        logging.error('interface DataTaskNew error:' + e.__str__())
        result['msg'] = e.__str__()
        result['status'] = False
        result['data'] = None
    return json.dumps(result, ensure_ascii=False)

@bp_dataTask.route('/delete/<int:projId>', methods=['post'])
def DeleteDataTask(projId):
    """
    删除一个或多个任务：
    type:可选参数，如果传的话，就将对应的type的数据全部删除
    ids:可选参数，如果列表有id的话，就删除对应列表中的全部id
    :param projId: 项目的id
    :return: dict('msg'= 信息字符串，出错的时候为出错信息，否则为ok,'status' = False or True，出错为False)
    """
    result = {'status':False, 'msg':'failed'}
    try:
        data = request.get_json()
        ids = data.get('ids', [])
        type = data.get('type')
        if type is not None:
            type = int(type)
        rt = dataTaskDBOperator.delete(projId, type, ids)
        if rt:
            result['msg'] = 'ok'
            result['status'] = True
    except Exception as e:
        print('interface DataTaskDelete error:' + e.__str__())
        logging.error('interface DataTaskDelete error:' + e.__str__())
        result['msg'] = e.__str__()
        result['status'] = False
    return json.dumps(result, ensure_ascii=False)

@bp_dataTask.route('/edit/<int:projId>', methods=['post'])
def EditDataTask(projId):
    """
    修改任务的信息：
    参数同/new/<int:projId>接口
    :param projId:项目id
    :return: dict('msg'= 信息字符串，出错的时候为出错信息，否则为ok,'status' = False or True，出错为False)
    """
    result = {'status':False, 'msg':'failed'}
    try:
        data = request.get_json()
        if data:
            id = data.get('id')
            query = {'projId':projId, '_id':ObjectId(id)}
            update = {}
            if ObjectId.is_valid(id):
                type = data.get('type')
                if type is not None:
                    update.update({'type':int(type)})
                status = data.get('status')
                if status is not None:
                    update.update({'status': bool(status)})
                period = data.get('period')
                if period is not None:
                    update.update({'period': int(period)})
                mode = data.get('mode')
                schedule = []
                if mode is not None:
                    if mode not in ('appoint', 'periodic'):
                        raise Exception('mode must be appoint or periodic')
                    update.update({'mode': mode})
                    if mode == 'appoint':
                        schedule = data.get('schedule', [])
                        if not schedule:
                            raise Exception(
                                'schedule must contain at least one time string(like 8:00, 16:30) when mode is appoint')
                update.update({'schedule':schedule})
                param = data.get('param')
                if param is not None:
                    if type is not None:
                        if type == 0:  # 定时补数
                            try:
                                # 每几分钟补多久，补哪些点(param.pointList, param.patchTimeMinute)，如果点不指定默认为全部
                                # param的结构{'pointList':[] or None, 'patchTimeMinute':当前时间往前推的分钟数}
                                param = data.get('param')
                                if param is None or (not isinstance(param, dict)):
                                    raise Exception('param field must in request and object type')
                                if not ('pointList' in param and 'patchTimeMinute' in param):
                                    raise Exception('pointList and patchTimeMinute must be included')
                                update.update({'param': param})
                            except Exception as e:
                                raise Exception('type = 0 , ' + str(e))
                        elif type == 1:  # 更新天气
                            try:
                                param = data.get('param')
                                if param is None or (not isinstance(param, dict)):
                                    raise Exception('param field must in request and object type')
                                # 气象数据类型（api Type1, Type2,...)，城市代号，虚拟点名
                                apiType = param.get('apiType')
                                if apiType is None:
                                    raise Exception('apiType must be included in param')
                                if not isinstance(apiType, str):
                                    raise Exception('apiType must be byId or byName')
                                code = param.get('code')
                                if code is None:
                                    raise Exception('code must be included in param')
                                if not isinstance(code, str):
                                    raise Exception('code must be string')
                                vpoint = param.get('ptName')
                                if vpoint is None:
                                    raise Exception('ptName must be included in param')
                                if not isinstance(vpoint, str):
                                    raise Exception('ptName must be string')
                                update.update({'param': param})
                            except Exception as e:
                                raise Exception('type = 1 , ' + str(e))
                        elif type == 2:  # 发送报表
                            try:
                                param = data.get('param')
                                if not isinstance(param, list):
                                    raise Exception('param must be a list')
                                update.update({'param': param})
                            except Exception as e:
                                raise Exception('type = 2 , ' + str(e))
                        elif type == 3:  # 随机数
                            try:
                                param = data.get('param')
                                if not isinstance(param, dict):
                                    raise Exception('param must be a object')
                                if 'pointname' not in param \
                                        or 'array' not in param:
                                    raise Exception('pointname,array must be in param')
                                update.update({'param': param})
                            except Exception as e:
                                raise Exception('type = 3 , ' + str(e))
                        elif type == 4:  # 项目数据拷贝
                            try:
                                param = data.get('param')
                                if not isinstance(param, list):
                                    raise Exception('param must be a list')
                                else:
                                    if len(param) == 0:
                                        raise Exception('array must contain at least one item')
                                update.update({'param': param})
                            except Exception as e:
                                raise Exception('type = 4 , ' + str(e))
                        else:
                            raise Exception('type is invalid')
                    else:
                        raise Exception('param and type must be bound')
                rt = dataTaskDBOperator.update(query, update)
                if rt:
                    result['msg'] = 'ok'
                    result['status'] = True
            else:
                raise Exception('id is invalid')
    except Exception as e:
        print('interface EditDataTask error:' + e.__str__())
        logging.error('interface EditDataTask error:' + e.__str__())
        result['msg'] = e.__str__()
        result['status'] = False
    return json.dumps(result, ensure_ascii=False)

@bp_dataTask.route('/get/<int:projId>', methods=['post'])
def GetDataTask(projId):
    """
    获取任务的详细信息：
    type:可选参数，如果传的话，就将对应的type的数据全部返回
    ids:可选参数，如果列表有id的话，就返回对应列表中的全部id的数据
    :param projId:项目id
    :return: dict('msg'= 信息字符串，出错的时候为出错信息，否则为ok,'status' = False or True，出错为False,'data' = 正常返回的是id所对应的数据库中的全部信息，否则是None)
    """
    result = {'status':False, 'msg':'failed', 'data':None}
    try:
        data = request.get_json()
        ids = data.get('ids', [])
        type = data.get('type')
        if type is not None:
            type = int(type)
        rt = dataTaskDBOperator.get(projId, type, ids)
        if rt:
            result['msg'] = 'ok'
            result['status'] = True
            result['data'] = rt
    except Exception as e:
        print('interface GetDataTask error:' + e.__str__())
        logging.error('interface GetDataTask error:' + e.__str__())
        result['msg'] = e.__str__()
        result['status'] = False
        result['data'] = None
    return json.dumps(result, ensure_ascii=False)

