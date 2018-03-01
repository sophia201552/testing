import requests, os.path, xlrd, logging
from flask import request, json, jsonify
from datetime import datetime, timedelta
from bson import ObjectId
from beopWeb.models import ExcelFile
from beopWeb import app
from datetime import date
from beopWeb.BEOPDataAccess import *
from beopWeb.MongoConnManager import MongoConnManager
from datetime import timedelta
from flask import Response
g_table_benchmark_config = 'Benchmark_Config'
g_table_benchmark_model = 'Benchmark_Model'


# 保存benchmark配置
@app.route('/benchmark/config/save', methods=['POST'])
def benchmarSaveConfig():
    rt = False
    try:
        data = request.get_json()
        data['_id'] = ObjectId(data.get('_id'))
        cursor = MongoConnManager.getConfigConn().mdbBb[g_table_benchmark_config].update({'_id': data.get('_id')}, {'$set': data}, True)
        rt = True
    except Exception as e:
        print('BenchmarSaveConfig error:' + e.__str__())
        logging.error('BenchmarSaveConfig error:' + e.__str__())
    return json.dumps(rt)


# 获取某项目的benchmark配置
# {
#     'point':{
#         "57359511833c975a02891bb1": {
#             'power':'578eeae8833c9764bcc8db57',
#             'energy':'578eeae8833c9764bcc8db56',
#             'model': ['578eeae8833c9764bcc8db56'],  #20160809修改， model字典 --> modelId数组
#         }
#     },
#     'cost':[{'time':'19:00','cost':'20'}],
# }
@app.route('/benchmark/config/get/<projectId>', methods=['GET'])
def benchmarGetConfig(projectId):
    rt = {}
    cursor = None
    try:
        cursor = MongoConnManager.getConfigConn().mdbBb[g_table_benchmark_config].find_one({'_id': ObjectId(projectId)})
        rt['point'] = cursor.get('point')
        rt['cost'] = cursor.get('cost')
    except Exception as e:
        print('getBenchmarkConfig error:' + e.__str__())
        logging.error('getBenchmarkConfig error:' + e.__str__())
    finally:
        if cursor:
            cursor = None
    return json.dumps(rt)


# 根据线上projId数组，获取对应项配置
# postData: {
#    arrProjId: [27,22,21]   #线上projId的数组
#    nodeName: '1号冷机' #20160811 新增，节点名称，用于获取不同项目的同名节点（耗性能 暂缓）
#    type: 'Thing'  #Group/Thing/Project
# }
# return: {
#    21:{
#        '_id':'57359511833c975a02891bb1',
#        'power':'57359511833c975a02891bbc',
#        'energy':'57395fb5645514190490d341',
#        'model': ['57395fb5645514190490d341'],  #20160809 修改返回model对象->返回model id的数组
#        'name': '扬州1',
#        'projId': 21
#    },
# }
@app.route('/benchmark/config/getDetails', methods=['POST'])
def benchmarGetConfigDetails():
    rt = {}
    data = request.get_json()
    nodeName = data.get('nodeName');
    type = data.get('type')
    try:
        sql = {'projId': {'$in': data.get('arrProjId')}}
        if type != 'Project':
            sql['name'] = nodeName
        arrIot = MongoConnManager.getConfigConn().mdbBb['IOT_' + type].find(sql)
        for itemIot in arrIot:
            project = itemIot
            itemId = itemIot.get('_id')
            if type != 'Project':
                project = MongoConnManager.getConfigConn().mdbBb['IOT_Project'].find_one({'projId': itemIot.get('projId')})
            itemConfig = MongoConnManager.getConfigConn().mdbBb[g_table_benchmark_config].find_one({'_id': project.get('_id')})
            if itemConfig is None: continue
            item = itemConfig.get('point').get(str(itemId))
            if item is None: continue

            rt[itemIot.get('projId')] = {
                '_id': str(itemId),
                'power': item.get('power'),
                'energy': item.get('energy'),
                'summary': item.get('summary'),
                'model': item.get('model'),
                'name': project.get('dictName').get('cn'),
                'projId': itemIot.get('projId')
            }
            itemConfig = None
    except Exception as e:
        print('BenchmarGetConfigDetails error:' + e.__str__())
        logging.error('BenchmarGetConfigDetails error:' + e.__str__())
    return json.dumps(rt)


# 20160809新增
# 根据节点id数组，获取对应项的model配置
# return: [
#    {              
#        "_id": ''  #modelId
#        "idNode": ''  #节点ID
#        "interval": "d", #新增 模型时间类型 d:天, M:月, y:年
#        "name": "",       #新增 模型名称
#        "creatorId": "",  #新增 模型最后编辑者
#        "startTime": '',  #新增 模型参数的起止时间
#        "endTime": '',    #新增 模型参数的起止时间
#        "type" :'', #模型类型，算法返回
#        "model":'', #模型，算法返回
#        "info":'',  #描述，算法返回
#        "params":[{                #20160809 合并params和relate字段， 原字典改为数组
#            'name':'温度',
#            'point':'55890f8594022d0344b59ec2',
#            'pName': 'x1'
#        }],
#    }
# ]
@app.route('/benchmark/config/getModelsByNodeId/<idNode>', methods=['GET'])
def benchmarGetConfigModels(idNode):
    rt = []
    cursor = None
    try:
        cursor = MongoConnManager.getConfigConn().mdbBb[g_table_benchmark_model].find({'idNode': ObjectId(idNode)})
        for item in cursor:
            item['_id'] = str(item['_id'])
            item['idNode'] = str(item['idNode'])
            rt.append(item)
    except Exception as e:
        print('benchmarGetConfigModels error:' + e.__str__())
        logging.error('benchmarGetConfigModels error:' + e.__str__())
    finally:
        if cursor:
            cursor = None
    return json.dumps(rt)


# 20160809新增
# 删除model
@app.route('/benchmark/config/removeModel/<idModel>', methods=['GET'])
def benchmarkRemoveModel(idModel):
    rt = False
    try:
        ret = MongoConnManager.getConfigConn().mdbBb[g_table_benchmark_model].delete_one({'_id': ObjectId(idModel)})
        if ret.deleted_count > 0:
            rt = True
    except Exception as e:
        print('benchmarGetConfigModels error:' + e.__str__())
        logging.error('benchmarGetConfigModels error:' + e.__str__())
    return json.dumps(rt)


# 相关性分析接口（即能耗跟哪些因子有关）
# 算法服务route('/correlationanalysis/analysis/relationalysis', "POST")
# postData: {
#   'y': [188,200,....],
#   'x': {'x1': [200,200,....],'x2': [100,300,...],...,'xn': [1888,2000,....]},
# }
# return: {'x1': 0.8, 'x2': 0.6, ....,'xm': 0.3}   返回相关因子的及相关系数
@app.route('/analysis/model/execRelationAnalysis', methods=['POST'])
def analysisExecRelationAnalysis():
    try:
        headers = {'content-type': 'application/json'}
        data = request.get_json()
        rt = requests.post('http://121.40.188.158:5111/correlationanalysis/analysis/relationalysis', data=json.dumps(data), headers=headers)
    except Exception as e:
        print('analysisExecRelationAnalysis error:' + e.__str__())
        logging.error('analysisExecRelationAnalysis error:' + e.__str__())
    return json.dumps(rt.text)


# 根据输入数据，进行回归，得出回归结果（用户输入关联因子x0,x1x2…的值及y，然后回归，依据回归公式，重新带入输入数据，得出预测的y1，并返回）
# route('/correlationanalysis/analysis/modelpredictdata', "POST")
# postData: {
#   'y': [188,200,....],
#   'x': {'x1': [200,200,....],'x2': [100,300,...],...,'xn': [1888,2000,....]},
# }
# return: [p1,p2,....]预测值列表
@app.route('/analysis/model/analysisRegression', methods=['POST'])
def analysisRegression():
    try:
        headers = {'content-type': 'application/json'}
        data = request.get_json()
        rt = requests.post('http://121.40.188.158:5111/correlationanalysis/analysis/modelpredictdata', data=json.dumps(data), headers=headers)
    except Exception as e:
        print('analysisRegression error:' + e.__str__())
        logging.error('analysisRegression error:' + e.__str__())
    return json.dumps(rt.text)


# 导出模型（建立能耗分析模型，给出能耗y与关联因子x0,x1x2…的关系式并给出相关信息或注释）
# 算法服务route('/correlationanalysis/analysis/analysisModel', "POST")
# postData: {
#   'y': [188,200,....],
#   'x': {'x1': [200,200,....],'x2': [100,300,...],...,'xn': [1888,2000,....]},
# }
# return: {'modeltype':‘type’, ‘model’：‘modelstring’，‘info’：{'R2': 09,....}}模型类型及模型系数
@app.route('/analysis/model/get', methods=['POST'])
def analysisGetModel():
    rt = {'status': 0, 'message': 'Timeout, try again!', 'data': None}
    try:
        headers = {'content-type': 'application/json'}
        data = request.get_json()
        rt = requests.post('http://121.40.188.158:5111/correlationanalysis/analysis/analysisModel', data=json.dumps(data), headers=headers, timeout=60)
        if rt and rt.text:
            rt = rt.text
    except Exception as e:
        print('analysisGetModel error:' + e.__str__())
        logging.error('analysisGetModel error:' + e.__str__())
    return json.dumps(rt)


# 保存model
# postData: {   
#    #20160809
#    "_id": '57395fb5645514190490d323',    #修改 日期 -> id, 该字段若有则update，无则insert
#    "idNode": '57395fb5645514190490d323',  #节点id,
#    'projectId': '57395fb5645514190490d323',
#    "interval": "d",  #新增 模型时间类型 d:天, M:月, y:年
#    "name": "",       #新增 模型名称
#    "creatorId": "",  #新增 模型最后编辑者
#    "startTime": '',  #新增 模型参数的起止时间
#    "endTime": '',    #新增 模型参数的起止时间
#    "type" :'', #模型类型，算法返回
#    "model":'', #模型，算法返回
#    "info":'',  #描述，算法返回
#    "params":[{                #20160809 合并params和relate字段， 原字典改为数组
#        'name':'温度',
#        'point':'55890f8594022d0344b59ec2',
#        'pName': 'x1'
#    }],
# }
@app.route('/analysis/model/save', methods=['POST'])
def benchmarSaveModel():
    rt = False
    data = request.get_json()
    try:
        if data.get('_id') is None:
            data['_id'] = ObjectId()
        else: 
            data['_id'] = ObjectId(data['_id'])
        data['idNode'] = ObjectId(data['idNode'])

        cursor = MongoConnManager.getConfigConn().mdbBb[g_table_benchmark_model].update({'_id': data['_id']}, {'$set': data}, True)

        # if not cursor.get('updatedExisting'):
        #    path = 'point.'+ str(data['idNode']) + '.model'
        #    point = MongoConnManager.getConfigConn().mdbBb[g_table_benchmark_config].find_one({'_id': ObjectId(data['projectId'])}, { 'point' : 1 })
        #    arrModel = point.get('point').get(str(data['idNode'])).get('model')
        #    if not arrModel: arrModel = []
        #    arrModel.append(str(data['_id']))
        #    MongoConnManager.getConfigConn().mdbBb[g_table_benchmark_config].update({'_id': ObjectId(data['projectId'])}, {'$set': {'point.'+ str(data['idNode']) + '.model' : arrModel}})

    except Exception as e:
        print('BenchmarSaveConfig error:' + e.__str__())
        logging.error('BenchmarSaveConfig error:' + e.__str__())
    return json.dumps({'id': str(data['_id'])})


# 根据模型运算结果（用户可输入关联因子x0,x1x2…的值，然后自动得出能耗y,此项可用来预测能耗）
# 基准vs实际（根据模型计算基准值，比如5月建了模型，6月份进行节能改造，7月份想核算节能量，这时就可以将7月份的关联因子x0,x1x2…输入之前建立的模型自动算出当前月份的能耗基准值）
# 算法服务route('/correlationanalysis/analysis/analysispredict', "POST")
# postData: {
#   'modeltype': ‘type’,
#   ‘model’：‘modelstring’, 
#   'x': {'x1': [200,200,....],'x2': [100,300,...],...,'xn': [1888,2000,....]},
# }
# return: [p1,p2,....]预测值列表
@app.route('/analysis/model/exec', methods=['POST'])
def analysisExecuteModel():
    try:
        headers = {'content-type': 'application/json'}
        data = request.get_json()
        rt = requests.post('http://121.40.188.158:5111/correlationanalysis/analysis/analysispredict', data=json.dumps(data), headers=headers)
    except Exception as e:
        print('analysisExecuteModel error:' + e.__str__())
        logging.error('analysisExecuteModel error:' + e.__str__())
    return json.dumps(rt.text)


# 20160809 新增
# 获取诊断信息列表
# return:
# [{
#    'name': '房间温度偏热',
#    'cost': 2600,
#    'energy': 30000,
#    'detail': '由于没有冷饮，导致房间温度偏热，设备无法正常运行。'
# }]
@app.route('/benchmark/diagnosis/get/<projectId>', methods=['GET'])
def benchmarkGetdiagnosis(projectId):
    '''
    David 20160811
    :param projectId:
    :return:
    '''
    rt = {'status': 0, 'message': None, 'data': None}
    timeNow = datetime.now()
    elec = 1
    try:
        projectId = int(projectId)
        dbAccess = BEOPDataAccess.getInstance()
        dbname = dbAccess.getProjMysqldb(projectId)
        timeStart = timeNow.strftime('%Y-%m-%d %H:%M:%S')
        timeEnd = (timeNow - timedelta(weeks=1)).strftime('%Y-%m-%d %H:%M:%S')
        if dbname:
            strSQL = "SELECT f.Name, f.Description, SUM(n.c) FROM %s_diagnosis_faults as f " \
                     "INNER JOIN (SELECT FaultId, SUM(Energy * TIMESTAMPDIFF(HOUR, Time, EndTime)) as c "\
                     "FROM `%s_diagnosis_notices` " \
                     "where Time <= '%s' and Time >= '%s' group by FaultId ) as n on f.Id = n.FaultId " \
                     "GROUP BY f.Name ORDER BY SUM(n.c) DESC" % (dbname, dbname, timeStart, timeEnd)
            res = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
            if res:
                lis = []
                for i in res:
                    lis.append({'name': i[0], 'coust': int(i[2]) * elec, 'energy': int(i[2]), 'detail': i[1]})
                rt.update({'status': 1, 'data': lis})
            else:
                rt.update({'status': 1, 'message': 'No Data', 'data': []})
        else:
            rt.update({'status': 0, 'message': 'projectId error'})
    except Exception as e:
        print('benchmarkGetdiagnosis error:' + e.__str__())
        logging.error(e.__str__())
        rt.update({'status': 0, 'message': e.__str__()})
    return jsonify(rt)


# 20160809 新增
# 获取若解决诊断，当天的增量曲线
# postData: {
#    'arrFault': ['房间温度偏热', ''],
#    'startTime': '',
#    'endTime': '',
#    'interval': 'd1',
#    'projectId': 72,
# }
# return: 
# [20,30,50]  #返回为增量
@app.route('/benchmark/diagnosis/getPredict', methods=['POST'])
def benchmarkGetdiagnosisPredict():
    rt = {'status': 0, 'message': None, 'data': None}
    post_data = request.get_json()
    try:
        if post_data:
            projId = int(post_data.get('projectId'))
            startTime = datetime.strptime(post_data.get('startTime'), '%Y-%m-%d %H:%M:%S')
            endTime = datetime.strptime(post_data.get('endTime'), '%Y-%m-%d %H:%M:%S')
            faultList = post_data.get('arrFault')
            dbAccess = BEOPDataAccess.getInstance()
            dbname = dbAccess.getProjMysqldb(projId)
            if dbname:
                strSQL = "SELECT n.Energy, n.Time FROM %s_diagnosis_faults AS f INNER JOIN " \
                         "(SELECT FaultId, Energy, Time  FROM %s_diagnosis_notices WHERE Time <= '%s' AND Time >= '%s' ) as n ON f.Id = n.FaultId " \
                         "WHERE f.`name` in (%s)" % (dbname, dbname, endTime, startTime, str(faultList).replace('[', '').replace(']', ''))
                res = dbAccess._mysqlDBContainerReadOnly.op_db_query('diagnosis', strSQL, ())
                if res:
                    lis = format_predict(res, startTime, endTime)
                    rt.update({'status': 1, 'data': lis})
                else:
                    rt.update({'status': 1, 'message': 'No data'})
            else:
                rt.update({'status': 0, 'message': 'projId error'})
        else:
            rt.update({'status': 0, 'message': 'invalid parameter'})
    except Exception as e:
        print('benchmarkGetdiagnosisPredict error:' + e.__str__())
        logging.error(e.__str__())
        rt.update({'status': 0, 'message': e.__str__(), 'data': []})
    return jsonify(rt)


def format_predict(arr, startTime, endTime):
    rt = []
    try:
        startTime = startTime.replace(hour=0, minute=0, second=0, microsecond=0)
        endTime = endTime.replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)
        rt = [0] * int((endTime - startTime).days)
        for item in arr:
            try:
                if not isinstance(item[1], datetime):
                    item[1] = datetime.strptime(item[1], '%Y-%m-%d %H:%M:%S')
                if isinstance(item[1], datetime):
                    ptime = item[1]
                    cdays = (ptime - startTime).days
                    rt[cdays] = int(rt[cdays]) + int(item[0])
            except Exception as e:
                logging.error(e.__str__())
    except Exception as e:
        print('format_predict error:' + e.__str__())
        logging.error(e.__str__())
        raise Exception(e.__str__())
    return rt


#20160809 新增
#计算相似日
#算法路由: '/correlationanalysis/analysis/similarday', "POST"
#postData: {
#	'basedate'	 ''						  #基准时间
#   'startTime': ‘2016-07-01 00:00:00’,   #筛选范围，开始时间
#   'endTime': '', 						  #筛选范围，结束时间
#   'type': 'd1',                         #筛选间隔，预留字段，暂时只支持d1
#   'x': [‘1470287485908984a8400a43’,x2,x3,.....xn], #datasourceIDList
#}
#return: [{ 'time': '','value':[p1,p2,....],'error':[d1,d2,...], 'totalerror': 'd',},....,{ 'time': '','value':[p1,p2,....],'error':[d1,d2,...], 'totalerror': 'd',}]
#返回排序后的相似日列表, value 相似日数据，error 对应的分项误差及 total 总误差
@app.route('/analysis/calcSimilarDays', methods=['POST'])
def analysisCalcSimilarDays():
    try:
        headers = {'content-type': 'application/json'}
        data = request.get_json()
        rt = requests.post('http://121.40.188.158:5111/correlationanalysis/analysis/similarday', data=json.dumps(data), headers=headers)
    except Exception as e:
        print('analysisCalcSimilarDays error:' + e.__str__())
        logging.error('analysisCalcSimilarDays error:' + e.__str__())
    return json.dumps(rt.text)


#20160809 新增
#导入Excel历史数据用于显示，预测
#postData: excel
#return: {
#    'data': {
#        '列名1': [20,25],
#        '列名2': [30,22],
#    },
#    'time': ['xxxx', 'xxxxx']
#}
@app.route('/benchmark/importHistoryData', methods=['POST'])
def benchmarkImportHistoryData():
    rt = {'status': 0, 'message': None, 'data': {}, 'time': []}
    post_file = request.files.getlist('file')
    try:
        if post_file:
            dirPath = os.path.abspath('.') + '/temp'
            if not os.path.exists(dirPath):
                os.makedirs(dirPath)
            for file in post_file:
                if file.filename.split('.')[-1] == 'xlsx':
                    filefullpath = dirPath + '/' + ObjectId().__str__() + '.xlsx'
                    file.save(filefullpath)
                    data = read_excel(filefullpath)
                    if data:
                        rt.get('time').extend(float_to_datestr(data.get('time')))
                        del data['time']
                        for key in data.keys():
                            if key not in rt.get('data').keys():
                                rt.get('data').update({key: data.get(key)})
                            else:
                                rt.get('data').get(key).extend(data.get(key))
                        rt.update({'status': 1})
                else:
                    raise Exception('The file format is not correct')
        else:
            rt.update({'status': 0, 'message': 'No files'})
    except Exception as e:
        print('benchmarkImportHistoryData error:' + e.__str__())
        logging.error('benchmarkImportHistoryData error:' + e.__str__())

        rt.update({'status': 0, 'message': e.__str__(), 'data': None, 'time': []})
    return jsonify(rt)


@app.route('/benchmark/export/emptyFile', methods=['POST'])
def generateEmptyXlsx():
    '''
    woody added at 20161230
    :param: {
                'timeStart': '2016-11-15 12:00:00',
                'timeEnd': '2016-12-15 13:00:00',
                'timeFormat': 'h1', (or d1, M1)
                'pointList': ['pointName1','pointName2']
            }
    :return:
    '''
    timeStart = request.form['timeStart']
    timeEnd = request.form['timeEnd']
    timeFormat = request.form['timeFormat']
    pointList = request.form['pointList'].split(',')
    timeList = []
    pointsLength = len(pointList)
    try:
        if timeFormat == 'h1':
            startTime = datetime.strptime(timeStart, '%Y-%m-%d %H:00:00')
            endTime = datetime.strptime(timeEnd, '%Y-%m-%d %H:00:00')
            if endTime < startTime:
                endTime, startTime = startTime, endTime
            hour = int((endTime - startTime).seconds / 3600)
            hour += (endTime - startTime).days * 24
            for i in range(0, int(hour)+1):
                timeList.append(datetime.strftime(startTime+timedelta(hours=i), "%Y-%m-%d %H:00:00"))
        elif timeFormat == 'M1':
            startTime = datetime.strptime(timeStart, '%Y-%m-%d %H:%M:00')
            endTime = datetime.strptime(timeEnd, '%Y-%m-%d %H:%M:00')
            if endTime < startTime:
                endTime, startTime = startTime, endTime
            startTimeYear = startTime.year
            startTimeMonth = startTime.month
            endTimeYear = endTime.year
            endTimeMonth = endTime.month
            absYear = endTimeYear - startTimeYear
            for i in range(0, absYear+1):
                if i == 0:
                    for k in range(0, 13-startTimeMonth):
                        timeList.append(datetime.strftime(date(year=startTimeYear+i, month=k+startTimeMonth, day=1), "%Y-%m-%d 00:00:00"))
                elif i == absYear:
                    for k in range(1, endTimeMonth+1):
                        timeList.append(datetime.strftime(date(year=startTimeYear+i, month=k, day=1), "%Y-%m-%d 00:00:00"))
                else:
                    for k in range(1, 13):
                        timeList.append(datetime.strftime(date(year=startTimeYear + i, month=k, day=1),"%Y-%m-%d 00:00:00"))
        elif timeFormat == 'd1':
            startTime = datetime.strptime(timeStart, '%Y-%m-%d %H:%M:00')
            endTime = datetime.strptime(timeEnd, '%Y-%m-%d %H:%M:00')
            if endTime < startTime:
                endTime, startTime = startTime, endTime
            d1 = int((endTime - startTime).days)
            for i in range(0, int(d1)+1):
                timeList.append(datetime.strftime(startTime+timedelta(days=i), "%Y-%m-%d %H:%M:00"))
        else:
            return json.dumps({'error':1, 'msg':'error time format'})
    except Exception as e:
        logging.error('funcname: generateEmptyXlsx error: %s' % e.__str__())
        return json.dumps({'error':1, 'msg':'error time params'})

    excelData = ExcelFile()
    try:
        head = []
        head.append('Time')
        for p in pointList:
            head.append(p)
        excelData.append_row(head)
        for t in timeList:
            row_data = []
            row_data.append(t)
            for x in range(0, pointsLength):
                row_data.append('')
            excelData.append_row(row_data)
    except Exception as e:
        logging.error('funcname: generateEmptyXlsx error: %s' % e.__str__())
        return json.dumps({'error':1, 'msg':'error time params'})
    return Response(excelData.data.xlsx,
                        headers={"Content-disposition": "attachment; filename={filename}.xlsx".format(
                            filename='templateForPoints')})








def read_excel(filepath):
    data = {}
    try:
        # open excel
        datafile = xlrd.open_workbook(filepath)
        # get sheets
        nsheets = datafile.nsheets
        for sheetIndex in range(nsheets):
            sh = datafile.sheet_by_index(sheetIndex)
            #行数
            nrows = sh.nrows
            if nrows > 1:
                row0_data = sh.row_values(0)
                if 'time' in row0_data:
                    for l in row0_data:
                        data.update({l: []})
                for x in range(1, nrows):
                    row_data = sh.row_values(x)
                    if len(row0_data) > 1:
                        for index in range(len(row0_data)):
                            data.get(row0_data[index]).append(row_data[index])
    except Exception as e:
        print('read_excel error' + e.__str__())
        logging.error(e.__str__())
        raise Exception('read excel error')
    return data


def float_to_datestr(timeList):
    rt = []
    try:
        if isinstance(timeList, list):
            for tl in timeList:
                try:
                    if isinstance(tl, float):
                        t0 = xlrd.xldate_as_tuple(tl, 0)
                        datetime0 = datetime(year=t0[0], month=t0[1], day=t0[2], hour=t0[3], minute=t0[4], second=t0[5])
                        rt.append(datetime0.strftime('%Y-%m-%d %H:%M:%S'))
                    elif isinstance(tl, str):
                        rt.append(datetime.strptime(tl, '%Y-%m-%d %H:%M:%S').strftime('%Y-%m-%d %H:%M:%S'))
                    elif isinstance(tl, datetime):
                        rt.append(tl.strftime('%Y-%m-%d %H:%M:%S'))
                except Exception as e:
                    logging.error(e.__str__())
    except Exception as e:
        print('float_to_datestr error:' + e.__str__())
        logging.error(e.__str__())
    return rt
