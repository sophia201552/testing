# -*- encoding=utf-8 -*-

__author__ = 'yan'

from functools import update_wrapper
from math import floor, ceil

from flask import json, request, make_response
from bson import ObjectId

from ExpertContainer.api import globalMapping, apiHelpMapping
from ExpertContainer.dbAccess.RedisManager import RedisManager
from ExpertContainer.logic.LogicBase import *

from ExpertContainer.api.ArchiveManager import ArchiveManager
from ExpertContainer.dbAccess import mongo_operator
from ExpertContainer.api.cacheProfile import DataManager
from ExpertContainer.api.errorLog import errorLog
from ExpertContainer.api.api import RealtimeDataMethods
from ExpertContainer.api.api import HistoryDataMethods
from ExpertContainer.api.CalPointManager import  CalPointManager
from ExpertContainer.api.DependAnalyst import DependAnalyst
from ExpertContainer.mqAccess.MQManager import MQManager
import platform
import subprocess
from strategy.Interface import Interface
from strategy.resolver.Resolver import parse
from strategy.generate_strategy_file import StrategyFile
from ExpertContainer.api.api import DiagnosisDataMethods
from ExpertContainer.logic.LogicBase import LogicBase
from ExpertContainer.api.RequestCenter import RequestCenter
from copy import deepcopy

_Logger = LogOperator()

def findNameInHelpMapping(strName):
    for item in apiHelpMapping.helpMapping_list:
        if strName== item['name']:
            return True
    return False

def func_list_task():
    rt = []
    try:
        temp = RedisManager.hash_get_all()
        if temp:
            for taskId in temp:
                content = temp.get(taskId)
                if content:
                    content = content.decode(encoding='utf-8')
                    if isinstance(content, str):
                        content = json.loads(content)
                    if 'stop' in content:
                        content.pop('stop')
                    rt.append(content)
        if rt:
            rt = sorted(rt, key=lambda item:ObjectId(item.get('taskId')).generation_time, reverse=True)
    except Exception as e:
        print('func_list_task error:' + e.__str__())
        logging.error('func_list_task error:' + e.__str__())
    return rt


def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, str):
        headers = ', '.join(x.upper() for x in headers)
    else:
        headers = 'content-type, token'
    if not isinstance(origin, str):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            try:
                if automatic_options and request.method == 'OPTIONS':
                    resp = app.make_default_options_response()
                else:
                    view_result = f(*args, **kwargs)
                    if f.__name__ == before_request.__name__ and view_result is None:
                        return None
                    resp = make_response(view_result)
                if not attach_to_all and request.method != 'OPTIONS':
                    return resp

                h = resp.headers

                h['Access-Control-Allow-Origin'] = origin
                h['Access-Control-Allow-Methods'] = get_methods()
                h['Access-Control-Max-Age'] = str(max_age)
                if headers is not None:
                    h['Access-Control-Allow-Headers'] = headers
                return resp
            except Exception:
                logging.error('Failed to decorate crossdomain!', stack_info=True, exc_info=True)

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)

    return decorator


@app.before_request
@crossdomain(origin='*')
def before_request():
    if app.config.get('CROSS_CLUSTER_REQ_DESIGNATION'):
        redirected, result = RequestCenter.designate_request(request)
        if redirected and result:
            return result


@app.route('/')
@crossdomain(origin='*')
def index():
    return 'ExpertContainer is running!'

#在beopweb中没有引用的地方，直接注释起来
# #获取补数信息
# @app.route('/repairData/getInfo/<object_id>', methods=['GET'])
# @crossdomain(origin='*')
# def repairDataGetInfo(object_id):
#     rt = None
#     try:
#         if ObjectId.is_valid(object_id):
#             info = ArchiveManager.read_repair(object_id)
#             if info:
#                 rt = info.get('percent')
#     except Exception as e:
#         _Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
#     return json.dumps(rt, ensure_ascii = False)

#获取一个项目计算点缺数的接口
@app.route('/calcpoint/findLostInfo/<int:projId>/<startStrTime>/<endStrTime>', methods=['GET'])
def calacPointFindLostInfo(projId, startStrTime, endStrTime):
    rt = {'error': False, 'data': [], 'msg': ''}
    lost = {}
    try:
        timeFormat = 'm5'
        pointList = mongo_operator.get_point_list_by_project_id(projId)
        startTime = datetime.strptime(startStrTime, '%Y-%m-%d %H:%M:%S')
        endTime = datetime.strptime(endStrTime, '%Y-%m-%d %H:%M:%S')
        lostTime = {}
        startIndex = 0

        # 获取该项目中起止时间dtu是否全部掉线，过滤极端情况
        getTimeReq = requests.get('http://' + app.config.get(
            'BEOP_SERVER_ADDR') + '/project/dtu/getAllDtuIsOffline/' + str(
            projId) + '/' + startStrTime + '/' + endStrTime,
                                  headers={"Content-Type": "application/json"})
        if getTimeReq.status_code == 200:
            isAllOffline = json.loads(getTimeReq.text)
            if isAllOffline.get('data'):
                return json.dumps(rt)
        # 返回格式转变
        def get_sorted_list(str_time_list):
            datetime_list = [datetime.strptime(x, '%Y-%m-%d %H:%M:%S') for x in str_time_list]
            datetime_list.sort()
            return [x.strftime('%Y-%m-%d %H:%M:%S') for x in datetime_list]

        def addToLostTime(timeStr, value):
            if lostTime.get(timeStr):
                lostTime[timeStr].append(value)
            else:
                lostTime[timeStr] = [value]

        while startIndex <= len(pointList):
            curList = pointList[startIndex:startIndex + 100]
            startIndex += 100
            curStartTime = startTime
            while curStartTime < endTime:
                curStrStartTime = datetime.strftime(curStartTime, '%Y-%m-%d %H:%M:%S')
                curEndTime = curStartTime + timedelta(days=1)
                curStrEndTime = datetime.strftime(curEndTime, '%Y-%m-%d %H:%M:%S')
                curStartTime = curEndTime
                if endTime > curEndTime:
                    historyData = BEOPDataAccess.getInstance().get_history_data_padded(projId, curList, curStrStartTime,
                                                                                       curStrEndTime, timeFormat, False)
                else:
                    historyData = BEOPDataAccess.getInstance().get_history_data_padded(projId, curList, curStrStartTime,
                                                                                       endStrTime, timeFormat, False)
                historyNameList = []
                # 除整个时间段都丢失的点（get_history_data_padded接口没有返回的点）保存在lost里面
                for item in historyData:
                    historys = item.get('history')
                    name = item.get('name')
                    if historys:
                        historyNameList.append(name)
                        for history in historys:
                            if history.get('error'):
                                if lost.get(name):
                                    lost[name].append(history.get('time'))
                                else:
                                    lost[name] = [history.get('time')]
                for pointName in curList:
                    if pointName not in historyNameList:
                        # 整个时间段都丢失的点
                        addToLostTime(curStrStartTime + '_' + curStrEndTime, pointName)
        for key, value in lost.items():
            lastTime = ''
            # 时间列表排序
            timeList = get_sorted_list(value)
            for index, time in enumerate(timeList):
                if len(timeList) == 1:
                    addToLostTime(time + '_' + time, key)
                else:
                    if not lastTime:
                        lastTime = time
                        continuousTime = time
                    else:
                        if (datetime.strptime(time, '%Y-%m-%d %H:%M:%S') - datetime.strptime(lastTime,
                                                                                             '%Y-%m-%d %H:%M:%S')).seconds == 300:
                            lastTime = time
                            if index == len(timeList) - 1:
                                addToLostTime(continuousTime + '_' + time, key)
                        else:
                            addToLostTime(continuousTime + '_' + lastTime, key)
                            lastTime = time
                            continuousTime = time
                            if index == len(timeList) - 1:
                                addToLostTime(time + '_' + time, key)
        for key, value in lostTime.items():
            rt['data'].append({'startTime': key.split('_')[0], 'endTime': key.split('_')[1], 'pointList': value})

    except Exception as e:
        print(e)
        rt['error'] = True
        rt['msg'] = e.__str__()
        _Logger.writeLog('%s:'%(get_current_func_name()) + e.__str__(), True)
    return json.dumps(rt)

#自动批量补历史数据接口
@app.route('/autoRepairData/batch', methods=['post'])
@crossdomain(origin='*')
def autoRepairDataBatch():
    data = request.form
    return do_autoRepairDataBatch(data)
def do_autoRepairDataBatch(data):
    rt = {'error': True, 'msg': ''}
    try:
        projId = None
        if data:
            projId = data.get('projId')
            pointList = data.get('pointList', '[]')
            timeFrom = data.get('timeFrom')
            timeTo = data.get('timeTo')
            jsonData = {
                'pointList': pointList,
                'timeFrom': timeFrom,
                'timeTo': timeTo,
                'projId': projId
            }
            for i in range(0, 5):
                if MQManager.triggerAutoRepairInRange(json.dumps(jsonData)):
                    rt['error'] = False
                    break
                time.sleep(10)

    except Exception as e:
        if (projId is not None):
            rt = {'error': True, 'msg': e.__str__()}
            errorLog.writeLog(int(projId), '%s:' % (get_current_func_name()) + e.__str__(), True)
        return json.dumps('%s:' % (get_current_func_name()) + e.__str__(), ensure_ascii=False)
    return json.dumps(rt, ensure_ascii=False)

# 补历史数据的接口-------批量
@app.route('/repairData/batch', methods=['POST'])
@crossdomain(origin='*')
def repairDataBatch():
    logging.info('Repairing data in batch: %s', dict(request.form.items()) if request.form is not None else None)
    rt = {"status": False}
    projId = None
    try:
        data = request.form
        if data:
            try:
                projId = data.get('projId')
                if not projId:
                    raise Exception('param projId is none')
                nameList = json.loads(data.get('list'))
                userId = data.get('userId')
                if not userId:
                    raise Exception('Error: param userId is none')
                timeFrom = data.get('timeFrom')
                if not timeFrom:
                    raise Exception('param timeFrom is none')
                timeTo = data.get('timeTo')
                if not timeTo:
                    raise Exception('param timeTo is none')
                format = data.get('format')
                if not format:
                    raise Exception('param format is none')
                all = data.get('all', False)
                rt = do_repairDataBatch(projId, nameList, userId, timeFrom, timeTo, format, all)
            except Exception as e:
                logging.error('Failed to schedule repair task for project %s with data %s', projId, data)
                rt = {"status": False, "msg": e.__str__()}
    except Exception as e:
        logging.error('Failed to schedule repair task: %s', request.form)
        return json.dumps('%s:' % (get_current_func_name()) + e.__str__(), ensure_ascii=False)
    return json.dumps(rt, ensure_ascii=False)

def do_repairDataBatch(projId, nameList, userId, timeFrom, timeTo, format, all):
    if all in ['true', 'True']:
        nameList = mongo_operator.get_point_list_by_project_id(projId)

    str_obid = ObjectId().__str__()

    # noinspection PyDictCreation
    dic = {}
    dic['total'] = 0
    dic['cur_num'] = 0
    dic['percent'] = '排队中'
    dic['project_id'] = int(projId)
    dic['user_id'] = int(userId) if userId is not None else -1
    userName = BEOPDataAccess.getInstance().getUserNameById(userId)
    dic['user_name'] = userName
    dic['point_list'] = nameList
    dic['time_from'] = timeFrom
    dic['time_to'] = timeTo
    dic['format'] = format
    timelist = get_timelist_by_time_range(datetime.strptime(timeFrom, standard_time_format),
                                          datetime.strptime(timeTo, standard_time_format),
                                          format)
    if timelist:
        length = len(timelist)
        dic['total'] = length
    dic['act_start'] = datetime.now().strftime(standard_time_format)
    if MQManager.triggerRepairDataInRange(projId, str_obid):
        rt = {"status": True, "msg": "", "data": str_obid}
        ArchiveManager.write_repair(projId, str_obid, dic)
    else:
        rt = {"status": False, "msg": "MQ error"}
    return rt

def do_online_test(projId, logic_content, point_name, module_name, write_to_real):
    calResult = None
    calInfo = []
    projList = RedisManager.get(app.config['MEMCACHE_KEY_PREFIX'] + app.config['MEMCACHE_KEY_PROJECT_LIST'])
    if projList:
        mysql_name = ''
        for item in projList:
            if item.get('id') == projId:
                mysql_name = item.get('mysqlname')
                break
        if mysql_name:
            if logic_content:
                v, msg = mongo_operator.make_onlinetest_py_file(logic_content, projId, point_name)
                if v:
                    import_string = 'calctemp.calcpointOnlinetest.%s' % (module_name)
                    __import__(import_string)
                    ins = None
                    attr = getattr(sys.modules[import_string], 'LogicAct')
                    timeAct = BEOPDataAccess.getInstance().getMaxTimeInSitePoints(projId)
                    if attr:
                        ins = attr(projId, timeAct if timeAct is not None else datetime.now(), None,
                                   LogicBase.ONLINE_TEST_REALTIME)  # realtime
                    else:
                        raise Exception('Load module %s failed' % (import_string,))

                    needPoints = mongo_operator.get_rely_info(projId, point_name, logic_content)

                    # 初始化云点现场点映射关系
                    cloudSitePointsAll = mongo_operator.getCloudPointSiteType(projId)
                    ins.initCloudSitePoints(cloudSitePointsAll)

                    needValues = BEOPDataAccess.getInstance().getAllPointTimeValueList(projId)
                    ins.initDataCacheByValueLists(needValues)

                    ins.before_actlogic()
                    rt = ins.actlogic()
                    ins.after_actlogic()
                    if rt is not None:
                        calResult = rt[0]
                        calInfo = rt[1]
                    if import_string in sys.modules:
                        sys.modules.pop(import_string)

                    if write_to_real:
                        RealtimeDataMethods.set_realtime_data(projId, [point_name], [str(rt[0])], 2, [timeAct])
                    if ins:
                        del ins
                else:
                    raise Exception('%s:' % (get_current_func_name()) + msg)
            else:
                raise Exception('%s:' % (get_current_func_name()) + 'missing param "content"')
        else:
            raise Exception('projId=%s, mysqlname is None in memcache' % (projId,))
    else:
        raise Exception('memcache is None')
    return calResult, calInfo

#在线测试

@app.route('/cloudPoint/onlinetest', methods=['POST'])
@crossdomain(origin='*')
def onlineTestCloudPoint():
    rt = None
    calResult = None
    calInfo = []
    import_string = ""
    projId=None
    try:
        data = request.form
        if data:
            logic_content = data.get('content')
            if not logic_content:
                raise Exception("param content is none")
            projId = data.get('projId')
            if not projId:
                raise Exception("param projId is none")
            projId = int(projId)
            point_name = data.get('pointName')

            if not point_name:
                raise Exception("param pointName is none")
            module_name = data.get('moduleName')

            if not module_name:
                raise Exception("param moduleName is none")
            write_to_real = int(data.get('writeToReal', 0))
            calResult, calInfo = do_online_test(projId, logic_content, point_name, module_name, write_to_real)
    except SyntaxError as e:
        if(projId is not None):
            errorLog.writeLog(int(projId),'%s:'%(get_current_func_name())+e.__str__(), True)

        if import_string in sys.modules:
            sys.modules.pop(import_string)
        strPointName = getPointNameInLogicFileByLine( e.filename, e.lineno)
        msg = "错误类型:" + e.__str__()
        if "(" in msg and ")" in msg:
            msg = msg[:msg.find('(')]
            msg += ";错误内容:" + e.text
        msg += ";相关点:" + strPointName
        return json.dumps({'error':1,'value':'%s'%(msg)}, ensure_ascii=False)
    except Exception as e:
        if(projId is not None):
            errorLog.writeLog(int(projId),'%s:'%(get_current_func_name())+e.__str__(), True)
        if import_string in sys.modules:
            sys.modules.pop(import_string)
        msg = "错误类型:" + e.__str__()
        if "(" in msg and ")" in msg:
            msg = msg[:msg.find('(')]

            msg += ";错误内容:" + e.text
        return json.dumps({'error':1,'value':'%s'%(msg)}, ensure_ascii=False)
    finally:
        if projId is not None and point_name is not None:
            file_name = "calcpoint_"+str(projId)+"_%s.py"%(point_name)
            path = get_onlinetest_path()
            full_path = path+"/"+file_name
            if os.path.exists(full_path):
                os.remove(full_path)
    return json.dumps({'error':0,'value':calResult, 'process':calInfo}, ensure_ascii=False)

#在线测试----诊断
@app.route('/diagnosis/onlinetest', methods=['POST'])
@crossdomain(origin='*')
def onlineTestDiagnosis():
    rt = None
    import_string = ""
    projId=None
    calInfo = None
    try:
        data = request.form
        if data:
            moduleName = data.get('moduleName')
            if not moduleName:
                raise Exception("param moduleName is none")
            projId = data.get('projId')
            if not projId:
                raise Exception("param projId is none")
            projId = int(projId)
            content = data.get('content')
            if not content:
                raise Exception("param content is none")
            projList = RedisManager.get(app.config['MEMCACHE_KEY_PREFIX']+app.config['MEMCACHE_KEY_PROJECT_LIST'])
            if projList:
                mysql_name = ''
                for item in projList:
                    if item.get('id') == projId:
                        mysql_name = item.get('mysqlname')
                        break
                if mysql_name:
                    calResult, calInfo = do_diagnosis_onlinetest(projId, content, moduleName)
                else:
                    raise Exception('projId=%s, mysqlname is None in memcache' % (projId,))
            else:
                raise Exception('memcache is None')
    except SyntaxError as e:
        nLineNo = 32
        strError = e.__str__()
        if(projId is not None):
            errorLog.writeLog(int(projId),'%s:'%(get_current_func_name())+e.__str__(), True)
            nLineNoIndex =  strError.find('line')
            if nLineNoIndex>0:
                nEnd = strError.find(')', nLineNoIndex)
                nLineNo = int(strError[nLineNoIndex+4:nEnd])
        if import_string in sys.modules:
            sys.modules.pop(import_string)
        msg = "错误类型:" + e.__str__()
        if "(" in msg and ")" in msg:
            msg = msg[:msg.find('(')]
        msg += ";syntax error: Line: %d"%(nLineNo-32)
        return json.dumps({'error':1,'value':'%s'%(msg)}, ensure_ascii=False)
    except Exception as e:
        strError = e.__str__()
        if(projId is not None):
            errorLog.writeLog(int(projId),'%s:'%(get_current_func_name())+e.__str__(), True)
        if import_string in sys.modules:
            sys.modules.pop(import_string)
        msg = "错误类型:" + e.__str__()
        if "(" in msg and ")" in msg:
            msg = msg[:msg.find('(')]
        msg += ";错误内容:" + e.__str__()
        return json.dumps({'error':1,'value':'%s'%(msg)}, ensure_ascii=False)
    finally:
        if projId is not None and moduleName is not None:
            file_name = "diagnosistest_"+str(projId)+"_%s.py"%(moduleName)
            path = get_diagnosistest_path()
            full_path = path+"/"+file_name
            if os.path.exists(full_path):
                os.remove(full_path)
    return json.dumps({'error':0,'process':calInfo}, ensure_ascii=False)

def do_diagnosis_onlinetest(projId, content, moduleName):
    calResult = None
    calInfo = None
    if content:
        v, msg = mongo_operator.make_diagnosistest_py_file(moduleName, content, projId)
        if v:
            import_string = 'diagnosistemp.diagnosistest.diagnosistest_%s_%s' % (projId, moduleName)
            __import__(import_string)
            ins = None
            attr = getattr(sys.modules[import_string], 'LogicAct')
            if attr:
                ins = attr(projId, datetime.now(), None, LogicBase.ONLINE_TEST_REALTIME)
            else:
                raise Exception('Load module %s failed' % (import_string,))
            ins.before_actlogic_diagnosis()
            rt = ins.actlogic()
            if rt is not None:
                calResult = rt[0]
                calInfo = rt[1]
            ins.after_actlogic()
            if import_string in sys.modules:
                sys.modules.pop(import_string)

            if ins:
                del ins
        else:
            raise Exception('%s:' % (get_current_func_name()) + msg)
    else:
        raise Exception('%s:' % (get_current_func_name()) + 'missing param "content"')
    return calResult, calInfo



#停止历史数据补数线程
@app.route('/repairData/stop', methods=['POST'])
@crossdomain(origin='*')
def repairDataStop():
    data = request.form
    return do_repairDataStop(data)

def do_repairDataStop(data):
    try:
        #data = request.get_json()
        obid=data.get('obId')
        if not obid:
            raise Exception('obId is none')
        projId = data.get('projId')
        if not projId:
            raise Exception('projId is none')
        whoStop = data.get('userId')
        if not whoStop:
            raise Exception('userId is none')

        if ObjectId.is_valid(obid):
            ArchiveManager.cancel_repair(projId, obid)
            return json.dumps({'success':True, 'msg':'成功停止补数 by %s'%(whoStop)}, ensure_ascii=False)
        else:
            return json.dumps({'success':False, 'msg':'没有补数的信息'}, ensure_ascii=False)
    except Exception as e:
        print('%s:'%(get_current_func_name())+e.__str__())
        _Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return json.dumps({'success':False, 'msg':e.__str__()}, ensure_ascii=False)
    return json.dumps({'success':True, 'msg':''}, ensure_ascii=False)

#根据projId获取补数的信息
@app.route('/repairData/clearRecord/<projId>', methods=['GET'])
@crossdomain(origin='*')
def repairdata_clear_record(projId):
    info_list = []
    try:
        info_list = do_repairdata_clear_record(projId)
    except Exception as e:
        _Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
    return json.dumps(info_list, ensure_ascii = False)

def do_repairdata_clear_record(projId):
    rt = ArchiveManager.clear_repair(int(projId))
    return rt

#根据projId获取补数的信息
@app.route('/repairData/status/<projId>', methods=['GET'])
@crossdomain(origin='*')
def repairDataStatus(projId):
    return do_repairDataStatus(projId)

def do_repairDataStatus(projId):
    info_list = []
    try:
        info_list = ArchiveManager.get_repair_info_by_project_id(int(projId))
    except Exception as e:
        _Logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
    return json.dumps(info_list, ensure_ascii=False)
#查询某次补数任务里某个点的所有补数结果
@app.route('/repairData/view/<obid>/<pointName>', methods=['GET'])
@crossdomain(origin='*')
def repair_view_result(obid, pointName):
    rt = False
    try:
        #利用BEOPDataAccess里增加接口，实现读取beopdatabuffer.temprepair_<projId>_obid表的内容（该内容是一个obid补数的所有结果）
        #返回结构为 dict(timeList=[], dataList=[])
        #coding here
        rt = True
    except Exception as e:
        _Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return json.dumps({'error':True,'value':'%s:'%(get_current_func_name())+e.__str__()}, ensure_ascii=False)
    return json.dumps({'error': not rt,'value':''}, ensure_ascii=False)

#读取某个项目所有的补数请求的状态和相关数据信息
#返回结构为 {obid: {name:'',projId:2, pointList:[], timeFrom:'', timeTo:'', timeFormat:'', percentage:'82.5%',timeSpent:'450',}}
@app.route('/repairData/process/getAllStatus/<projId>', methods=['GET'])
@crossdomain(origin='*')
def repair_process_get_all_status(projId):
    rt = False
    try:
        #所有信息均利用memcache保存，每个任务结束时要把信息写入到beopdatabuffer.repairrecord表里（表结构参考接口返回要求）
        #读取时先去memcache取，取不到的话从mysql刷进memcache
        #coding here
        rt = True
    except Exception as e:
        _Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        return json.dumps({'error':True,'value':'%s:'%(get_current_func_name())+e.__str__()}, ensure_ascii=False)
    return json.dumps({'error': not rt,'value':''}, ensure_ascii=False)


@app.route('/api', methods=['GET'])
@crossdomain(origin='*')
def getAPINameList():
    rt = [x.get('name') for x in globalMapping.mapping_list]
    rt = [x for x in rt if 'set_data' not in x]
    return json.dumps(rt, ensure_ascii=False)

@app.route('/apiTree', methods=['GET'])
@crossdomain(origin='*')
def getAPITreeList():
    language = request.args.get('lang')
    rt = do_getAPITreeList(language)
    return rt

def do_getAPITreeList(language):
    rt = {}
    mapping=deepcopy(apiHelpMapping.helpMapping_list)
    if language == 'zh':
        rt = mapping
        for item in mapping_list:
            if not findNameInHelpMapping(item['name']):
                rt.append(dict(name= item['name'],add_id=0,api_type='未分类',dis_cription='no documents till now', sample=item['name']+'()'))
    elif language == 'en':
        rt = apiHelpMapping.helpMapping_list_en
    return json.dumps(rt, ensure_ascii=False)

@app.route('/apiTree/en', methods=['GET'])
@crossdomain(origin='*')
def getAPITreeEnList():
    rt= do_getAPITreeEnList()
    return json.dumps(rt, ensure_ascii=False)
def do_getAPITreeEnList():
    mapping = deepcopy(apiHelpMapping.helpMapping_list_en)
    rt = mapping
    for item in mapping_list:
        if not findNameInHelpMapping(item['name']):
            rt.append(dict(name=item['name'], add_id=0, api_type='unsorted', dis_cription='no documents till now',sample=item['name'] + '()'))
    return rt
#删除数据
@app.route('/clearData/<projId>', methods=['post'])
@crossdomain(origin='*')
def clearHistoryData(projId):
    rt = False
    try:
        data = request.form
        if data:
            pointList=data.get('pointList')
            rt = True if RealtimeDataMethods.delete_point_from_mysql(projId,pointList) else False
    except Exception as e:
        if(projId is not None):
            errorLog.writeLog(int(projId),'%s:'%(get_current_func_name())+e.__str__(), True)
        return json.dumps({'error':1,'value':'%s:'%(get_current_func_name())+e.__str__()}, ensure_ascii=False)
    return json.dumps({'error':int(False),'value':'delete %s successful'%(str(pointList),)}, ensure_ascii=False)

#删除数据
@app.route('/clearData/all/<int:projId>', methods=['post'])
@crossdomain(origin='*')
def clearHistoryDataAll(projId):
    rt = False
    try:
        rt = True if RealtimeDataMethods.delete_point_from_mysql_all(projId) else False
    except Exception as e:
        if(projId is not None):
            errorLog.writeLog(int(projId),'%s:'%(get_current_func_name())+e.__str__(), True)
        return json.dumps({'error':1,'value':'%s:'%(get_current_func_name())+e.__str__()}, ensure_ascii=False)
    return json.dumps({'error':int(False),'value':'delete %s successful'%(str(projId),)}, ensure_ascii=False)


#查询计算点错误数量
# @app.route('api/errcount', methods=['post'])
# @crossdomain(origin='*')
# def readErrorCount():
#     rt={}
#     try:
#         data=request.form
#         if data:
#             projId = data.get('projId')
#             if not timeFrom:
#                 raise Exception('param projId is none')
#             rt=ArchiveManager.read_error_count(projId)
#             return rt
#     except Exception as e:
#         _Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
#     return json.dumps({'error':int(False),'value':'delete %s successful'%(str(pointList),)}, ensure_ascii=False)

@app.route('/getLostPointTime', methods=['POST'])
@crossdomain(origin='*')
def repairLostData():
    rt = []
    try:
        data = request.get_json()
        if data:
            projId = int(data.get('projId'))
            timeFrom = data.get('timeFrom')
            timeTo = data.get('timeTo')
            start = datetime.strptime(timeFrom, standard_time_format)
            end = datetime.strptime(timeTo, standard_time_format)
            project = mongo_operator.get_one_project_calc_point_from_projects(projId)
            if project:
                project_content_dict = project.get(projId)
                if project_content_dict:
                    for timeFormat in project_content_dict:
                        if timeFormat in ['m1','m5','h1','d1','M1']:
                            format_content_list = project_content_dict.get(timeFormat)
                            name_list = [x.get('name')[x.get('name').find('_',len('calcpoint_'))+1:] for x in format_content_list]
                            hisdata = HistoryDataMethods.get_history_data(projId,name_list,timeFrom, timeTo, timeFormat)
                            for item in hisdata:
                                lostTime = []
                                subLostTime = []
                                if 'error' in item:
                                    subLostTime = get_query_day_time_list(start, end, timeFormat)
                                    if subLostTime:
                                        lostTime.append(subLostTime)
                                    for ptName in name_list:
                                        rt.append({'pointName':ptName, 'lostTimeList':lostTime, 'timeFormat':timeFormat})
                                    break
                                name = item.get('name')
                                history = item.get('history')
                                for h in history:
                                    if h.get('error'):
                                        subLostTime.append(h.get('time'))
                                    else:
                                        if subLostTime:
                                            lostTime.append(subLostTime)
                                            subLostTime = []
                                if subLostTime:
                                    lostTime.append(subLostTime)
                                if lostTime:
                                    rt.append({'pointName':name, 'lostTimeList':lostTime, 'timeFormat':timeFormat})
    except Exception as e:
        _Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
    return json.dumps(rt, ensure_ascii=False)

@app.route('/calcpoint/calcAllReal', methods=['POST'])
@crossdomain(origin='*')
def calc_project_calcpoint():
    data = request.form
    return do_calc_project_calcpoint(data)

def do_calc_project_calcpoint(data):
    rt = {}
    try:
        #data=request.get_json()
        if data:
            timeformat = data.get('format','m5')
            projId = data.get('projId')
            if not projId:
                raise Exception("param projId is none")
            projId = int(projId)

            #triggerOneCalculation(projId,None,True)
            b = mongo_operator.make_calcpoint_py_file_for_output(timeformat,int(projId))
            if b:
                module_name = get_calcpoint_output_path()+"/calcpoint_%s"%(projId,)
                mod = load_module_dynamic(module_name, get_calcpoint_output_path())
                if mod:
                    ins = None
                    attr = getattr(mod, 'LogicAct')
                    if attr:
                        ins = attr(projId, datetime.now(),None,LogicBase.REALTIME)
                        ins.before_actlogic()
                        nl, vl = ins.actlogic()
                        ins.after_actlogic()
                        temp_dic = dict(zip(nl, vl))
                        rt.update(**temp_dic)
                        if ins:
                            del ins
                        if module_name in sys.modules:
                            sys.modules.pop(module_name)
                        moduleName = module_name + '.py'
                        if os.path.exists(moduleName):
                            os.remove(moduleName)
    except SyntaxError as e:
        _Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        strPointName = getPointNameInLogicFileByLine( e.filename, e.lineno)
        rt  = dict(name=strPointName, msg= 'Syntax error, calculation stopped! code: %s'%(e.text))
    except Exception as e:
        _Logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)
        rt  = dict(error=1, msg= 'error:%s in code: %s'%(e.msg, e.text))
    return json.dumps(rt, ensure_ascii=False)

@app.route('/calcpoint/triggerOneCalculation/<projId>', methods=['GET'])
@crossdomain(origin='*')
def triggerOneCalc(projId):
    if projId:
        triggerOneCalculation(projId, None, False)
    return json.dumps({"success": True})


def triggerOneCalculation(projId, pointList, bWaitForFinish=True, dataTime=None):
    try:
        if app.config['LOGGING_LEVEL']<=0:
            strLog = 'triggerOneCalculation for projId:%d'%(int(projId),)
            print(strLog)
            logging.info(strLog)
        bCalculationFinishSuccess = False
        #strMessageQueueName = 'calculationTrigger0'
        if dataTime is None:
            dataTime = datetime.now()
        data = dict(projId = projId, pointList = pointList, bWaitForFinish = bWaitForFinish, timeUpdate= dataTime.strftime('%Y-%m-%d %H:%M:%S') )
        strKey = 'calculationTrigger_%d'%(int(projId))
        RedisManager.set_calculation_trigger_flag(projId, '1')
        jsonData = json.dumps(data,ensure_ascii=False)
        if not MQManager.RabbitMqWorkQueueSend(app.config['MQ_RECEIVE_TRIGGER_NAME'],jsonData):  #消息发送成功后才进去等待
            return False

        if not bWaitForFinish:
            return True

        nCount = 0

        while nCount<5:
            time.sleep(2)
            if RedisManager.get_calculation_trigger_flag(projId)=='0':
                bCalculationFinishSuccess = True
                break
            nCount +=1

        if not bCalculationFinishSuccess:
            RedisManager.set_calculation_trigger_flag(projId, '0') #恢复memcache键,防止由于后台意外导致永远死锁不计算
        return bCalculationFinishSuccess

    except Exception as e:
        print('triggerOneCalculation error:' + e.__str__())
        logging.error('triggerOneCalculation error:' + e.__str__())
        return False
    return bCalculationFinishSuccess


@app.route('/calcpoint/clearflag/', methods=['GET'])
@crossdomain(origin='*')
def calc_clearflag():
    for projId in range(1000):
        ArchiveManager.set_calc_trigger_cache(projId,0)

#在线测试--历史
@app.route('/cloudPoint/history/onlinetest', methods=['POST'])
@crossdomain(origin='*')
def onlineTestCloudPointHistory():
    rt = None
    calResult = None
    calInfo = []
    import_string = ""
    projId=None
    timeObj = None
    try:
        data = request.form
        if data:
            projList = RedisManager.get(app.config['MEMCACHE_KEY_PREFIX']+app.config['MEMCACHE_KEY_PROJECT_LIST'])
            if projList:
                logic_content = data.get('content')
                if not logic_content:
                    raise Exception("param content is none")
                projId = data.get('projId')
                if not projId:
                    raise Exception("param projId is none")
                projId = int(projId)
                point_name = data.get('pointName')
                if not point_name:
                    raise Exception("param pointName is none")
                module_name = data.get('moduleName')
                if not module_name:
                    raise Exception("param moduleName is none")
                timeAt = data.get('timeAt')
                if not timeAt:
                    raise Exception("param timeAt is none")
                timeObj = datetime.strptime(timeAt, standard_time_format)
                mysql_name = ''
                for item in projList:
                    if item.get('id') == projId:
                        mysql_name = item.get('mysqlname')
                        break
                if mysql_name:
                    calResult, calInfo = do_onlinetest_history(projId, logic_content, point_name, module_name, timeObj)
                else:
                    raise Exception('projId=%s, mysqlname is None in memcache'%(projId,))
            else:
                raise Exception('memcache is None')
    except Exception as e:
        if(projId is not None):
            errorLog.writeLog(int(projId),'%s:'%(get_current_func_name())+e.__str__(), True)
        if import_string in sys.modules:
            sys.modules.pop(import_string)
        msg = "错误类型:" + e.__str__()
        if "(" in msg and ")" in msg:
            msg = msg[:msg.find('(')]
        msg += ";错误内容:" + e.text
        return json.dumps({'error':1,'value':'%s'%(msg)}, ensure_ascii=False)
    finally:
        if projId is not None and point_name is not None:
            file_name = "calcpoint_"+str(projId)+"_%s.py"%(point_name)
            path = get_onlinetest_path()
            full_path = path+"/"+file_name
            if os.path.exists(full_path):
                os.remove(full_path)
    return json.dumps({'error':0,'value':calResult, 'process':calInfo}, ensure_ascii=False)

def do_onlinetest_history(projId, logic_content, point_name, module_name, timeObj):
    calResult = None
    calInfo = []
    if logic_content:
        v, msg = mongo_operator.make_onlinetest_py_file(logic_content, projId, point_name)
        if v:
            import_string = 'calctemp.calcpointOnlinetest.%s' % (module_name)
            __import__(import_string)
            ins = None
            attr = getattr(sys.modules[import_string], 'LogicAct')
            if attr:
                ins = attr(projId, timeObj, None, LogicBase.ONLINE_TEST_HISTORY)
            else:
                raise Exception('Load module %s failed' % (import_string,))

            conMongodb = MongoConnManager.getHisConnTuple(int(projId))
            collectionName = BEOPDataAccess.getInstance().GetCollectionNameById(int(projId))
            ins.set_mongo_conn(conMongodb, collectionName)

            # 初始化云点现场点映射关系
            cloudSitePointsAll = mongo_operator.getCloudPointSiteType(projId)
            ins.initCloudSitePoints(cloudSitePointsAll)

            ins.initDataCacheFromRealtimeData()
            ins.before_actlogic()
            rt = ins.actlogic()
            ins.after_actlogic()
            if rt is not None:
                calResult = rt[0]
                calInfo = rt[1]
            if import_string in sys.modules:
                sys.modules.pop(import_string)

            if ins:
                del ins
        else:
            raise Exception('%s:' % (get_current_func_name()) + msg)
    else:
        raise Exception('%s:' % (get_current_func_name()) + 'missing param "content"')
    return calResult, calInfo

@app.route('/calcpoint/getdepend/<projId>/<pointname>', methods=['GET'])
@crossdomain(origin='*')
def get_depend(projId, pointname):
    return do_get_depend(projId, pointname)


def do_get_depend(projId, pointname):
    rt = []
    try:
        if pointname == ',':
            rt = mongo_operator.get_rely_info_by_pointlist(int(projId), None)
        elif pointname.find(',') > 0:
            pointNameList = pointname.split(',')
            rt = mongo_operator.get_rely_info_by_pointlist(int(projId), pointNameList)
        elif len(pointname) > 0:
            rt = mongo_operator.get_rely_info(int(projId), pointname)
        values = BEOPDataAccess.getInstance().getAllPointTimeValueList(int(projId))
        rt['flag0'] = [x for x in rt['flag0'] if x in values['nameList']]
        rt['flag2'] = [x for x in rt['flag2'] if x in values['nameList']]
    except Exception as e:
        return json.dumps({'error': 1, 'value': e.__str__()}, ensure_ascii=False)
    return json.dumps({'error': 0, 'value': rt}, ensure_ascii=False)

#批量在线测试
@app.route('/cloudPoint/onlinetest/batch',methods=['POST'])
@crossdomain(origin='*')
def onlineTestCloudPoint_batch():
    try:
        rt={}
        data = request.form
        logic_content = data.get('content')
        if not logic_content:
            raise Exception("param content is none")
        projId = data.get('projId')
        if not projId:
            raise Exception("param projId is none")
        projId = int(projId)
        error_count = do_batch_encapsule(projId, logic_content, rt)
    except Exception as e:
        return json.dumps({'error':1,'value':e.__str__()}, ensure_ascii=False)
    return json.dumps({'error':error_count,'value':rt}, ensure_ascii=False)


def onlineTestCloudPoint_batch_do(data):
    rt = None
    calResult = None
    calInfo = []
    import_string = ""
    projId=None
    try:
        if data:
            projList = RedisManager.get(app.config['MEMCACHE_KEY_PREFIX']+app.config['MEMCACHE_KEY_PROJECT_LIST'])
            if projList:
                logic_content = data.get('content')
                if not logic_content:
                    raise Exception("param content is none")
                projId = data.get('projId')
                if not projId:
                    raise Exception("param projId is none")
                projId = int(projId)
                point_name = data.get('pointName')

                if not point_name:
                    raise Exception("param pointName is none")
                module_name = data.get('moduleName')

                if not module_name:
                    raise Exception("param moduleName is none")
                write_to_real = int(data.get('writeToReal', 0))
                mysql_name = ''
                for item in projList:
                    if item.get('id') == projId:
                        mysql_name = item.get('mysqlname')
                        break
                if mysql_name:
                    if logic_content:
                        v, msg = mongo_operator.make_onlinetest_py_file(logic_content, projId, point_name)
                        if v:
                            import_string = 'calctemp.calcpointOnlinetest.%s'%(module_name)
                            __import__(import_string)
                            ins = None
                            timeAct = BEOPDataAccess.getInstance().getMaxTimeInSitePoints(projId)
                            attr = getattr(sys.modules[import_string], 'LogicAct')
                            if attr:
                                ins = attr(projId, timeAct, None, LogicBase.ONLINE_TEST_REALTIME) #realtime
                            else:
                                raise Exception('Load module %s failed'%(import_string,))

                            needPoints = mongo_operator.get_rely_info(projId, point_name,logic_content)

                            cloudSitePointsAll = mongo_operator.getCloudPointSiteType(projId)
                            ins.initCloudSitePoints(cloudSitePointsAll)

                            needValues = BEOPDataAccess.getInstance().getAllPointTimeValueList(projId)

                            ins.initDataCacheByValueLists(needValues)

                            ins.before_actlogic()
                            rt = ins.actlogic()
                            ins.after_actlogic()
                            if rt is not None:
                                calResult = rt[0]
                                calInfo = rt[1]
                            if import_string in sys.modules:
                                sys.modules.pop(import_string)


                            if write_to_real:
                                RealtimeDataMethods.set_realtime_data(projId,[point_name],[str(rt[0])],2, [timeAct])
                            if ins:
                                del ins
                        else:
                            raise Exception('%s:'%(get_current_func_name())+msg)
                    else:
                        raise Exception('%s:'%(get_current_func_name())+'missing param "content"')
                else:
                    raise Exception('projId=%s, mysqlname is None in memcache'%(projId,))
            else:
                raise Exception('memcache is None')
    except Exception as e:
        if(projId is not None):
            errorLog.writeLog(int(projId),'%s:'%(get_current_func_name())+e.__str__(), True)
        if import_string in sys.modules:
            sys.modules.pop(import_string)
        msg = "错误类型:" + e.__str__()
        return {'error':1,'value':'%s'%(msg)}
    finally:
        if projId is not None and point_name is not None:
            file_name = "calcpoint_"+str(projId)+"_%s.py"%(point_name)
            path = get_onlinetest_path()
            full_path = path+"/"+file_name
            if os.path.exists(full_path):
                os.remove(full_path)
    return {'error':0,'value':calResult, 'process':calInfo}

def do_batch_encapsule(projId, logic_content, rt):
    error_count = 0
    for x in logic_content.split('def main_')[1:]:
        point_name = x.split(':')[0].replace('()', '')
        module_name = "calcpoint_%s_%s" % (projId, point_name,)
        x = x.replace(point_name, 'def main', 1)
        data = {'moduleName': module_name, 'content': x, 'projId': projId, 'pointName': point_name}
        r = onlineTestCloudPoint_batch_do(data)
        rt[point_name] = r
        if r.get('error') == 1:
            error_count += 1
    return error_count

@app.route('/updateProjectInfo', methods=['GET'])
@crossdomain(origin='*')
def update_ProjectInfo():
    if BEOPDataAccess.getInstance().UpdateProjectInfo():
        return json.dumps(True, ensure_ascii=False)
    return json.dumps(False, ensure_ascii=False)


@app.route('/projectMap/update', methods=['GET'])
@crossdomain(origin='*')
def updateProjectLocateMap():
    if BEOPDataAccess.getInstance().UpdateProjectLocateMap():
        return json.dumps(True, ensure_ascii=False)
    return json.dumps(False, ensure_ascii=False)

@app.route('/v2/diagnosis/get/moduleStatus/<projId>',methods=['GET'])
@crossdomain(origin='*')
def v2_diagnosis_get_moduleStatus(projId):
    rt = {}
    try:
        projId = int(projId)
        rt = RedisManager.getProjectDiagnosisStatus(projId)
    except Exception as e:
        errorLog.writeLog(projId, '%s:' % (get_current_func_name()) + e.__str__(), True)
    return json.dumps(rt, ensure_ascii=False)

@app.route('/diagnosis/get/moduleStatus/<projId>',methods=['GET'])
@crossdomain(origin='*')
def diagnosis_get_moduleStatus(projId):
    rt = {}
    try:
        projId = int(projId)
        name_list = mongo_operator.get_diagnosis_module_name_list(projId)
        aTime = datetime.now().replace(second=0)
        connList = MongoConnManager.getHisConnTuple(projId)
        conn = None
        #len_temp = 50
        for connItem in connList:
            st = connItem[1]
            et = connItem[2]
            if aTime <= et and aTime >= st:
                conn = connItem[0]
                break
        if conn:
            if name_list:
                rt = conn.getFaultClassify(projId, name_list)
    except Exception as e:
        errorLog.writeLog(projId, '%s:' % (get_current_func_name()) + e.__str__(), True)
    return json.dumps(rt, ensure_ascii=False)

@app.route('/diagnosis/get/moduleStatus/single',methods=['POST'])
@crossdomain(origin='*')
def diagnosis_get_moduleStatus_single():
    data = request.form
    return do_diagnosis_get_moduleStatus_single(data)
def do_diagnosis_get_moduleStatus_single(data):
    rt = {}
    try:
        # data=request.get_json()
        projId = data.get('projId')
        if not projId:
            raise Exception('no projId')
        diagname = data.get('diagname')
        if not diagname:
            raise Exception('no diagname')
        diagObid = data.get('diagObid')
        if not diagObid:
            raise Exception('no diagObid')
        s_time = data.get('s_time')
        if not s_time:
            raise Exception('no s_time')
        e_time = data.get('e_time')
        if not e_time:
            raise Exception('no e_time')
        formatTime = data.get('dateFormat')
        if not formatTime:
            formatTime = 'm5'

        s_timeObj = datetime.strptime(s_time, standard_time_format)
        e_timeObj = datetime.strptime(e_time, standard_time_format)

        aTime = datetime.now().replace(second=0)
        connList = MongoConnManager.getHisConnTuple(projId)
        conn = None
        for connItem in connList:
            st = connItem[1]
            et = connItem[2]
            if aTime <= et and aTime >= st:
                conn = connItem[0]
                break
        if conn:
            rt = conn.getHisFault_by_name(projId, diagname, s_timeObj, e_timeObj)

        if rt:
            rt.update({'bindPoints': {}})

            logic = mongo_operator.get_diagnosis_module_logic(diagObid)
            if logic:
                if 'FaultNotice' in logic and 'bindPoints' in logic:
                    temp = ((logic.split('FaultNotice'))[1].split('bindPoints'))[1]
                    bindPoints = temp[temp.index('[') + 1:temp.index(']')] + ','
                    if bindPoints:
                        bindPoints_list = list(eval(bindPoints))
                        if len(bindPoints_list) > 0:
                            hisdata = BEOPDataAccess.getInstance().get_history_data_padded_reduce(projId, bindPoints_list,s_time, e_time, formatTime)
                            rt['bindPoints'] = hisdata
    except Exception as e:
        errorLog.writeLog(projId, '%s:' % (get_current_func_name()) + e.__str__(), True)
    return json.dumps(rt, ensure_ascii=False)

@app.route('/alarm/history',methods=['POST'])
@crossdomain(origin='*')
def getAlarmHistory():
    try:
        rt = {}
        data = request.form
        #data=request.get_json()
        projId = data.get('projId')
        if not projId:
            raise Exception('no projId')
        alarm_id_list = json.loads(data.get('alarm_id'))
        if not alarm_id_list:
            raise Exception('no alarm_id_list')
        s_time = data.get('s_time')
        if not s_time:
            raise Exception('no s_time')
        e_time = data.get('e_time')
        if not e_time:
            raise Exception('no e_time')

        rt = BEOPDataAccess.getInstance().get_alarm_history(projId, alarm_id_list,s_time,e_time)
        if rt:
            for item in rt:
                if item.get('alarm_time'):
                    item.update({'alarm_time':item.get('alarm_time').strftime(standard_time_format)})
                if item.get('mTime'):
                    item.update({'mTime':item.get('mTime').strftime(standard_time_format)})
                if item.get('_id'):
                    item.pop('_id')
    except Exception as e:
        errorLog.writeLog(projId, '%s:' % (get_current_func_name()) + e.__str__(), True)
    return json.dumps(rt, ensure_ascii=False)

@app.route('/dataManage/exportData/task/new', methods=['POST'])
@crossdomain(origin='*')
def put_export_data_into_mq():
    rv = {"error": True, "msg": '', "data": ''}
    try:
        data = request.form
        mutable_data = {}
        for key in data:
            mutable_data[key] = data.get(key)
        if mutable_data:
            mutable_data['flag'] = int(mutable_data.get('flag', '-1'))
            mutable_data['points'] = json.loads(mutable_data.get('points', '[]'))
            mutable_data['projId'] = int(mutable_data['projId'])
            mutable_data['userId'] = int(mutable_data['userId'])

            startTime = mutable_data['startTime']
            endTime = mutable_data['endTime']
            rt = str(ObjectId())
            mutable_data.update({'taskId': rt})
        rv = do_put_export_data_into_mq(mutable_data['flag'], mutable_data['points'], mutable_data['projId'], mutable_data['userId'], mutable_data['format'], startTime, endTime, rt, rv)
    except Exception as e:
        print('put_export_data_into_mq error:' + e.__str__())
        logging.error('put_export_data_into_mq error:' + e.__str__())
        return json.dumps(rv , ensure_ascii=False)
    rv['error'] = False
    return json.dumps(rv , ensure_ascii=False)

def do_put_export_data_into_mq(flag, points, projId, userId, format, startTime, endTime, rt, rv):
    rv['msg'] = rt
    userName = BEOPDataAccess.getInstance().getUserNameById(userId)

    csvFileName = rt[-4:] + '_' + startTime.replace('-', '').replace(':', '').replace(' ', '') + \
                  '_' + endTime.replace('-', '').replace(':', '').replace(' ', '') + '_' + format + '.csv'
    zipFileName = csvFileName.replace('.csv', '.zip')
    content = {'taskId': rt, 'projId': projId,
                                   'taskStartTime': '',
                                   'taskEndTime': '', 'points': points, 'format': format,
                                   'userId':userId, 'userName': userName, 'flag': flag,
                                   'startTime': startTime, 'endTime': endTime, 'status': 0, 'progress': 0,
                                   'stop': 0,
                                   'file': {'name':zipFileName,'link':os.path.join('/ExportData', zipFileName)}}
    RedisManager.hash_set(rt, content)
    if platform.system()=='Windows':
        strCommand = "python %s/ExportHistoryDataTask.py %s"%(get_current_directory(), rt)
        subprocess.Popen(strCommand, creationflags=subprocess.CREATE_NEW_CONSOLE)
    else:
        strCommand = "python3 %s/ExportHistoryDataTask.py %s"%(get_current_directory(), rt)
        subprocess.Popen(strCommand,shell=True)
    rv['error'] = False
    return rv


@app.route('/dataManage/exportData/tasks', methods=['POST'])
@crossdomain(origin='*')
def list_export_task():
    data = request.form
    return do_list_export_task(data)

def do_list_export_task(data):
    rt = []
    try:
        if data:
            projId = int(data.get('projId'))
            temp = RedisManager.hash_get_all()
            if temp:
                for taskId in temp:
                    content = temp.get(taskId)
                    if content:
                        content = content.decode(encoding='utf-8')
                        if isinstance(content, str):
                            content = json.loads(content)
                        if content.get('projId') == projId:
                            if 'stop' in content:
                                content.pop('stop')
                            rt.append(content)
            if rt:
                rt = sorted(rt, key=lambda item: ObjectId(item.get('taskId')).generation_time, reverse=True)
    except Exception as e:
        print('list_export_task error:' + e.__str__())
        logging.error('list_export_task error:' + e.__str__())
    return json.dumps(rt, ensure_ascii=False)

@app.route('/dataManage/exportData/file/delete', methods=['POST'])
@crossdomain(origin='*')
def delete_export_files():
    data = request.form
    return do_delete_export_files(data)

def do_delete_export_files(data):
    try:
        if data:
            mutable_data = {}
            mutable_data['projId'] = data.get('projId')
            mutable_data['fileName'] = json.loads(data.get('fileName'))

            projId = mutable_data.get('projId')
            fileName = mutable_data.get('fileName')
            if isinstance(fileName, list):
                if fileName and projId:
                    dir = os.path.join(get_current_directory(), 'ExportData')
                    files = os.listdir(dir)
                    for file in fileName:
                        if '_%s_' % (projId) in file and file in files:
                            deleteFullPath = os.path.join(dir, file)
                            if os.path.exists(deleteFullPath):
                                os.remove(deleteFullPath)
                    return json.dumps({'success': True, 'msg': 'ok'})
    except Exception as e:
        print('delete_export_files error:' + e.__str__())
        logging.error('delete_export_files error:' + e.__str__())
        return json.dumps({'success': False, 'msg': e.__str__()})
    return json.dumps({'success': False, 'msg': ''})

@app.route('/dataManage/exportData/task/stop', methods=['POST'])
@crossdomain(origin='*')
def stop_export_task():
    try:
        data = request.form
        if data:
            force = 0
            taskId = data.get('taskId', None)
            strforce = data.get('force', 'false')
            return do_stop_export_task(force, taskId, strforce)
    except Exception as e:
        print('stop_export_task error:' + e.__str__())
        logging.error('stop_export_task error:' + e.__str__())
        return json.dumps({'success': False, 'msg': e.__str__()})


def do_stop_export_task(force, taskId, strforce):
    if strforce.lower() == 'true':
        force = 1
    temp = RedisManager.hash_get_all()
    if temp:
        if taskId:
            if force == 1:
                rt = func_list_task()
                if rt:
                    content = temp.get(taskId.encode(encoding='utf-8'))
                    if content:
                        content = content.decode(encoding='utf-8')
                        if isinstance(content, str):
                            content = json.loads(content)
                            if content.get('status') == 0:
                                if content.get('stop') == 1:
                                    RedisManager.hash_delete_task(taskId)
                                else:
                                    RedisManager.hash_set(taskId, None, 'stop', 1)
                                return json.dumps({'success': True, 'msg': 'ok'})
                            else:
                                RedisManager.hash_delete_task(taskId)
                                return json.dumps({'success': False, 'msg': 'task status is 1'})
        else:
            return json.dumps({'success': False, 'msg': 'task is not found'})
    return json.dumps({'success': False, 'msg': ''})

@app.route('/dataManage/exportData/task/clear', methods=['POST'])
@crossdomain(origin='*')
def clear_export_task():
    data = request.form
    return do_clear_export_task(data)

def do_clear_export_task(data):
    try:
        if data:
            projId = int(data.get('projId'))
            clear_task = data.get('taskId', None)
            force = 0
            strforce = data.get('force', 'false')
            if strforce.lower() == 'true':
                force = 1
            temp = RedisManager.hash_get_all()
            if temp:
                if clear_task == None:
                    for taskId in temp:
                        content = temp.get(taskId)
                        if content:
                            content = content.decode(encoding='utf-8')
                            if isinstance(content, str):
                                content = json.loads(content)
                            if content.get('projId') == projId:
                                if force == 1:
                                    RedisManager.hash_delete_task(taskId)
                                else:
                                    if content.get('status') == 1:
                                        RedisManager.hash_delete_task(taskId)
                else:
                    content = temp.get(clear_task.encode(encoding='utf-8'))
                    if content:
                        content = content.decode(encoding='utf-8')
                        if isinstance(content, str):
                            content = json.loads(content)
                        if content.get('projId') == projId:
                            if force == 1:
                                RedisManager.hash_delete_task(clear_task)
                            else:
                                if content.get('status') == 1:
                                    RedisManager.hash_delete_task(clear_task)
            return json.dumps({'success': True, 'msg': 'ok'})
    except Exception as e:
        print('clear_export_task error:' + e.__str__())
        logging.error('clear_export_task error:' + e.__str__())
        return json.dumps({'success': False, 'msg': e.__str__()})
    return json.dumps({'success': False, 'msg': ''})

@app.route('/mq/count/<strQueueName>', methods=['GET'])
@crossdomain(origin='*')
def query_mq_message_count(strQueueName):
    try:
        nCount = MQManager.getMessageCount(strQueueName)
        return json.dumps({'success': True, 'msg': 'ok', 'count': nCount})
    except Exception as e:
        print('clear_export_task error:' + e.__str__())
        logging.error('clear_export_task error:' + e.__str__())
        return json.dumps({'success': False, 'msg': e.__str__()})
    return json.dumps({'success': False, 'msg': ''})



#查找calc中的api
@app.route('/api/findInCalcModule', methods=['POST'])
@crossdomain(origin='*')
def find_api_in_calc():
    data = request.get_json()
    return do_find_api_in_calc(data)

def do_find_api_in_calc(data):
    rv = {}
    try:
        if data:
            projList = data.get('projIdList')
            apiName = data.get('apiName')
            data = mongo_operator.find_api_in_calc_module(projList, apiName)
            rv.update(
                {
                    'error': 0,
                    'data': data,
                    'msg': 'ok'
                }
            )
        else:
            rv.update({'msg': 'Wrong params, please check it!', 'error': 1, 'data': []})
    except Exception as e:
        rv.update({'msg': e.__str__(), 'error': 1, 'data': []})
        logging.error('find_api_in_calc:' + e.__str__())
    return json.dumps(rv)

#查找diagnosis中的api
@app.route('/api/findInDiagModule', methods=['POST'])
@crossdomain(origin='*')
def find_api_in_diagnosis():
    rv = {}
    try:
        data = request.get_json()
        projList = data.get('projIdList')
        apiName = data.get('apiName')
        rt = mongo_operator.find_api_in_diagnosis_module(projList, apiName)
        rv.update(
            {
                'error': 0,
                'data': rt,
                'msg': 'ok'
            }
        )
    except Exception as e:
        rv.update({'msg': e.__str__(), 'error': 1, 'data': []})
        logging.error('find_api_in_diagnosis error:' + e.__str__())
    return json.dumps(rv)


# 查找返回策略执行结果(调试模式)
@app.route('/api/strategy/debug', methods=['POST'])
@crossdomain(origin='*')
def strategy_debug():
    try:
        data = request.get_json()
        strategy_id = data.get('strategy_id')
        module_name = 'm' + str(round(time.time() * 1000)) + strategy_id
        projId = int(data.get('projId', 0))
        info = Interface.get_strategy_item_modules(strategy_id)
        modules = info.get('data')
        code = parse(modules, data.get('valueId'), data.get('option'))
        # code = StrategyFile.beautyCode(code)
        if StrategyFile.generate_file_strategy(projId, strategy_id, module_name, code):
            rt = StrategyFile.run(projId, strategy_id)
            return json.dumps(rt, ensure_ascii=False)
    except Exception as e:
        logging.error('strategy_debug error:' + e.__str__())
        return json.dumps({'error':1, "msg":e.__str__()}, ensure_ascii=False)


@app.route('/api/renameModule/calc', methods=['POST'])
@crossdomain(origin='*')
def reNameApiInCalc():
    data = request.get_json()
    return do_reNameApiInCalc(data)

def do_reNameApiInCalc(data):
    rt = {'msg': None, 'error': 1}
    try:
        apiName = data.get('apiName')
        newName = data.get('newName')
        # 获取api替换的信息
        rv = mongo_operator.find_calc_api_and_rename(apiName, newName)
        if rv:
            rt.update({'error': 0, 'data': rv})
        else:
            rt.update({"msg": "api '{}' not found in mongoDB".format(apiName), 'error': 0, 'data': rv})
    except Exception as e:
        logging.error('reNameApiInCalc error: {}'.format(e.__str__()))
        rt.update({'msg': e.__str__()})
    return json.dumps(rt, ensure_ascii=False)

@app.route('/api/renameCalcRealTimeData', methods=['POST'])
@crossdomain(origin='*')
def setCalcRealTimeData():
    rt = {'error': 1, 'msg': ''}
    try:
        data = request.get_json()
        orginName = data.get('orginName')
        newName = data.get('newName')
        projId = data.get('projId')
        flag = data.get('flag')
        if projId and orginName and newName and flag:
            status = do_setCalcRealTimeData(projId, orginName, newName, int(flag))
            if status:
                rt.update(dict(error=0))
    except Exception as e:
        logging.error('setCalcRealTimeData error: {}'.format(e.__str__()))
        rt.update(dict(msg=e.__str__()))
    return json.dumps(rt)

def do_setCalcRealTimeData(projId, orginName, newName, flag):
    return BEOPDataAccess.getInstance().updateRealtimeDataBufferMini(projId, orginName, newName, flag)

@app.route('/point/wash/', methods=['POST'])
@crossdomain(origin='*')
def mongo_data_wash():
    '''
        json = {
                userId: int, //请求人ID
                projId: int,// 项目ID
                points:[], //点列表
                methods:[], //清洗方法,对应的编号      1. 电表数据过滤(只能递增)
                                                    2. 脉冲数据过滤
                                                    3. 负数过滤
                filter: 1   //清洗过滤方式, 1, 2, 3分别为 去掉/保持/平均
                pulse: "",  //脉冲最大允许值, 如果是其他过滤方式可不填
        }
    '''
    rt = {'error': 1, 'msg': ''}
    try:
        data = request.get_json()
        user_id = int(data.get('userId'))
        projId = int(data.get('projId'))
        points = data.get('points', [])
        methods = data.get('methods', [])
        filter_method = data.get('filter', 1)
        pulse = float(data.get('pulse'))
        # 过滤掉没有提供脉冲范围的情况
        if 2 in methods:
            if not pulse:
                raise Exception("params wrong")
        if points and methods:
            now_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            obj = BEOPDataAccess.getInstance()
            total = obj.get_total_wash(projId, points)
            user_name = obj.getUserNameById(user_id)
            ArchiveManager.write_wash_data(projId, user_name, points, methods, total, now_time, filter_method, pulse)
            mq_rv = MQManager.triggerWashDataInRange(projId)
            if not mq_rv:
                raise Exception("数据清洗任务进入消息队列失败!")
            rt.update(dict(error=0))
    except Exception as e:
        logging.error('mongo_data_wash error: {}'.format(e.__str__()))
        rt.update(dict(msg=e.__str__()))
    return json.dumps(rt)


# 获取数据清洗状态
@app.route('/point/wash/status/<projectID>', methods=['GET'])
@crossdomain(origin='*')
def get_wash_status(projectID):  # TODO 从Redis读取数据清洗状态
    rt = {'error': 1, 'msg': ""}
    try:
        data = ArchiveManager.get_wash_data(projectID)
        rt.update(dict(data=data, error=0))
    except Exception as e:
        logging.error("get_wash_status error: {}".format(str(e)))
        rt.update(dict(msg=str(e)))
    return json.dumps(rt, ensure_ascii=False)


#报警触发
@app.route('/alarm/touch', methods=['POST'])
@crossdomain(origin='*')
def touchAlarm():
    rt = False
    try:
        #data = request.get_json()
        data = request.form
        projId = data.get('projId')
        if not projId:
            raise Exception('no projId')
        porjId = int(projId)
        lb = LogicBase(porjId,datetime.now())
        cloudSitePointsAll = mongo_operator.getCloudPointSiteType(porjId)
        lb.initCloudSitePoints(cloudSitePointsAll)
        allSitePointsValues = DataManager.set_realdata_flag_0(porjId)
        lb.initDataCacheByValueLists(allSitePointsValues)
        lb.alarm_data_realvalues(porjId)
        rt = {'msg': 'success','error':0}
    except Exception as e:
        logging.error('touch alarm error: {}'.format(e.__str__()))
        rt = {'msg': e.__str__(),'error':1}
    return json.dumps(dict(rt))

@app.route('/PushMessage/touch',methods=['post'])
def PushMessage():
    try:
        post_data = request.get_json()
        reportId = post_data.get('reportId')
        report_url = post_data.get('url')
        if not reportId or not report_url:
            raise Exception('params error')
        pushDate = datetime.now().strftime('%Y-%m-%d')
        rv = True
        data = {
            'message': {
                'type': 'report',
                'projectId': '293',
                'reportId': reportId,
                'reportDetail': {
                    'id': reportId,
                    'period': 'day',
                    'periodStartTime': 0,
                    'reportName': "Prioty Faults"
                },
                'reportDate': pushDate,
                'isFactory': True,
            },
            'title': 'Daily Priority Faults Report',
            'alert': 'Your report is ready',
            'userId_list': [65, 1589, 2398, 456],
            'projId_list': [],
            'registration_id': []
        }
        url = 'https://www.smartbeop.com/appCommon/sendMessage'
        lb = LogicBase(293, datetime.now())
        res = lb.http_post_json_with_cookie(url, data, t=30)
        if res.get('state') != 1:
            rv = False
            DiagnosisDataMethods.send_message_by_email(['kruz.qian@rnbtech.com.hk','may.chen@rnbtech.com.hk'], 'app推送出现问题', json.dumps(data))
        try:
            x = lb.send_web_report(['kirry.gao@rnbtech.com.hk',
                                    'david@industry-tech.com.au', 'andrew.dentonburke@ap.jll.com',
                                    'kruz.qian@rnbtech.com.hk', 'may.chen@rnbtech.com.hk',
                                    'john.yang@rnbtech.com.hk', 'angelia.chen@rnbtech.com.hk'],
                                   'Daily Priority Faults Report', report_url)
        except Exception as e:
            rv = False
            DiagnosisDataMethods.send_message_by_email(['kruz.qian@rnbtech.com.hk', 'may.chen@rnbtech.com.hk'],
                                                       'web推送出现问题', 'id:1493719857290442599435a8 date:' + pushDate)
            logging.error('touch web push error: {}'.format(e.__str__()))
            print(e)
    except Exception as e:
        logging.error('touch app Push error: {}'.format(e.__str__()))
        print(e)
    return json.dumps(rv)

@app.route('/PushDiagnosisMessage/touch',methods=['post'])
def PushDiagnosisMessage():
    try:
        post_data = request.get_json()
        url = post_data.get('url')
        projId = post_data.get('projId')
        pushDate = datetime.now().strftime('%Y-%m-%d')
        rv = True
        lb = LogicBase(projId, datetime.now())
        try:
            x = lb.send_web_report(
                                   ['david@industry-tech.com.au', 'andrew.dentonburke@ap.jll.com','Guy.Goodwin@centuria.com.au',
                                   'angelia.chen@rnbtech.com.hk','kruz.qian@rnbtech.com.hk','russell.ma@rnbtech.com.hk','kirry.gao@rnbtech.com.hk',
                                    ],
                                   'Weekly Diagnosis Report', url)
        except Exception as e:
            rv = False
            DiagnosisDataMethods.send_message_by_email(['kruz.qian@rnbtech.com.hk', 'angelia.chen@rnbtech.com.hk','john.yang@rnbtech.com.hk'],
                                                       'web推送出现问题', 'id:' + url + 'date:' + pushDate)
            logging.error('touch web push error: {}'.format(e.__str__()))
            print(e)
    except Exception as e:
        logging.error('touch app Push error: {}'.format(e.__str__()))
        print(e)
    return json.dumps(rv)

@app.route('/sendEmailReport', methods=['post'])
def sendEmailReport():
    try:
        data = request.get_json()
        projId = data.get('projId')
        emailList = data.get('emailList')
        title = data.get('title')
        url = data.get('url')

        rv = do_sendEmailReport(projId, emailList, title, url)
    except Exception as e:
        rv = False
        DiagnosisDataMethods.send_message_by_email(['may.chen@rnbtech.com.hk', 'john.yang@rnbtech.com.hk'],
                                                   'web推送出现问题', 'url:' + url)
        logging.error('touch web push error: {}'.format(e.__str__()))
        print(e)
    return json.dumps(rv)

#@todo
def do_sendEmailReport(projId, emailList, title, url):
    if not projId or not url or not emailList or not title:
        raise Exception('params error')
    lb = LogicBase(projId, datetime.now())
    x = lb.send_web_report(emailList, title, url)

    rv = True
    return rv