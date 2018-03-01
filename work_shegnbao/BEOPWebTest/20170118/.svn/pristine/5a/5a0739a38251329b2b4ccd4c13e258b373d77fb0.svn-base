from flask import request, jsonify, render_template
from beopWeb import app
from beopWeb.mod_diagnosisEngine import bp_diagnosisEngine
from beopWeb.mod_diagnosisEngine.diagnosisEngine import *
import logging, requests



@app.route('/diagnosisEngine')
def diagnosis():
    return render_template('indexDiagnosisEngine.html', title='BEOP Diagnosis Engine')


#保存Thing（批量）
#postData: [{                    #诊断对象表，对象一般为设备
#    '_id': ObjectId(''),        #编号   (有ID为update,无ID为insert)
#    'name': '',                 #名称
#    'type': 'CT',               #类型，参照IOT
#    'srcPageId': '',            #对应Factory中pageScreen的ID，用于加载诊断底图
#    'dictVariable': {           #变量字典，标识诊断中用到的变量
#        'xxx': 'xxxxxxxxx'      #变量名: 数据源ID， 若数据源ID为空，则表示配对失败
#    },                          
#    'dictAlgorithm': {          #诊断字典，记录该诊断对象中所应用的策略
#        'id': {                 #诊断ID
#            'status': 0,        #运行状态， 0:停止 1:运行
#        }                       
#    },                          
#    'projId': 222,              #该对象所属项目，索引
#},
#{...}] 数组
@bp_diagnosisEngine.route('/saveThings', methods=['POST'])
def saveThings():
    rt = []
    datalist = request.get_json()
    try:
        if datalist:
            for data in datalist:
                if isinstance(data, dict):
                    eid = diagnosisEngine.set_diagengine_thing_into_equipment(data.get('name'), data.get('srcPageId'), data.get('projId'))
                    if eid:
                        data.update({'equipmentId':eid})
                    _id = diagnosisEngine.update_diagengine_thing(data)
                    rt.append(_id)
    #20160524: 插入diagnosis_equipments表中
    except Exception as e:
        print('mod_diagnosisEngine.saveThing error:' + e.__str__())
        logging.error('mod_diagnosisEngine.saveThing error:' + e.__str__())
    return jsonify(data = rt)


#根据ID删除Thing
#postData: ['xxxxxxxxxxx', 'wwwwwwwwwwww']
@bp_diagnosisEngine.route('/removeThing', methods=['POST'])
def removeThing():
    rt = False
    data = request.get_json()
    try:
        if data:
            if isinstance(data, str):
                data = [data]
            if isinstance(data, list):
                rt = diagnosisEngine.remove_diagengine_thing(data)
    #20160524: 删除diagnosis_equipments表中数据
    except Exception as e:
        print('mod_diagnosisEngine.removeThing:' + e.__str__())
        logging.error('mod_diagnosisEngine.removeThing:' + e.__str__())
    return jsonify(data = rt)


#根据projectId，查找Thing列表
#return: {data: [[{            
#    '_id': 'ccaa8c432621452077258001',        #编号
#    'name': '可爱的冷却塔',                 #名称
#    'type': 'CT',               #类型，参照IOT
#    'srcPageId': '1464244498949262b4664eca',            #对应Factory中pageScreen的ID，用于加载诊断底图
#    'dictVariable': {           #变量字典，标识诊断中用到的变量
#        'CTRemoteMode': 'aaaa8c432621452077258001',     #变量名: 数据源ID， 若数据源ID为空，则表示配对失败
#        'CTAutoMode': 'aaaa8c432621452077258002',
#        'CTOnOff': '',
#        'CTReturnT': 'aaaa8c432621452077258003',
#    },                          
#    'dictAlgorithm': {          #诊断字典，记录该诊断对象中所应用的策略
#        'bbaa8c432621452077258003': {                 #诊断ID
#            'status': 1,        #运行状态， 0:停止 1:运行
#        }                       
#    },                          
#    'projId': 666,              #该对象所属项目，索引
#},{...}]}
@bp_diagnosisEngine.route('/getThingListByProjId/<projId>', methods=['GET'])
def getThingListByProjId(projId):
    rt = []
    try:
        rt = diagnosisEngine.get_diagengine_thing(projId)
    except Exception as e:
        print('mod_diagnosisEngine.getThingListByProjId error:' + e.__str__())
        logging.error('mod_diagnosisEngine.getThingListByProjId error:' + e.__str__())
    return jsonify(data = rt)


#保存模板
#postData: {                     #诊断模板表
#    '_id': ObjectId(''),        #编号   (有ID为update,无ID为insert)
#    'name': '',                 #名称
#    'type': '',                 #类型，参照IOT，索引
#    'srcPageId': '',            #对应Factory中pageScreen的ID，用于加载诊断底图
#    'dictVariable': {           #变量字典，标识诊断中用到的变量
#        'xxx': ''               #变量名: 数据源ID， 若数据源ID为空，则表示配对失败
#    },
#    'dictAlgorithm': {          #诊断字典，记录该诊断对象中所应用的策略
#        'id': {                 #诊断ID
#        }                       
#    },  
#    'creatorId': '',            #创建者ID
#    'timeLastModify': '',       #最后修改时间
#}
@bp_diagnosisEngine.route('/saveTemplate', methods=['POST'])
def saveTemplate():
    rt = None
    data = request.get_json()
    try:
        if data:
            if isinstance(data, dict):
                rt = diagnosisEngine.update_diagengine_template(data)
    except Exception as e:
        print('mod_diagnosisEngine.saveTemplate error:' + e.__str__())
        logging.error('mod_diagnosisEngine.saveTemplate error:' + e.__str__())
    return jsonify(data = rt)


#删除模板
#postData: None
@bp_diagnosisEngine.route('/removeTemplate', methods=['POST'])
def removeTemplate():
    data = request.get_json()
    try:
        if data:
            if isinstance(data, str):
                data = [data]
            if isinstance(data, list):
                rt = diagnosisEngine.remove_diagengine_template(data)
    except Exception as e:
        print('mod_diagnosisEngine.removeTemplate error:' + e.__str__())
        logging.error('mod_diagnosisEngine.removeTemplate error:' + e.__str__())
    return jsonify(data = rt)


#获取模板列表
#return: {data: [[{            
#    '_id': 'ccaa8c432621452077258001',        #编号
#    'name': '可爱的冷却塔',                 #名称
#    'type': 'CT',               #类型，参照IOT
#    'srcPageId': '1464244498949262b4664eca',            #对应Factory中pageScreen的ID，用于加载诊断底图
#    'dictVariable': {           #变量字典，标识诊断中用到的变量
#        'CTRemoteMode': '',     #变量名: 数据源ID， 若数据源ID为空，则表示配对失败
#        'CTAutoMode': '',
#        'CTOnOff': '',
#        'CTReturnT': '',
#    },                          
#    'dictAlgorithm': {          #诊断字典，记录该诊断对象中所应用的策略
#        'bbaa8c432621452077258003': {                 #诊断ID
#        }                       
#    },                          
#    'projId': 666,              #该对象所属项目，索引
#},{...}]}
@bp_diagnosisEngine.route('/getTemplateList', methods=['GET'])
def getTemplateList():
    rt = []
    try:
        rt = diagnosisEngine.get_diagengine_template()
    except Exception as e:
        print('mod_diagnosisEngine.getTemplateList error:' + e.__str__())
        logging.error('mod_diagnosisEngine.getTemplateList error:' + e.__str__())
    return jsonify(data = rt)


#保存算法
#postData: {        #算法表
#    '_id': ObjectId(''),        #编号   (有ID为update,无ID为insert)
#    'creatorId': 1,             #创建者ID
#    'timeLastModify': '',       #最后修改时间
#    'content': '',              #算法内容，为python代码段，可为空
#    'src': '',                  #远程算法地址，为空则取content内容
#    'status': 1                 #状态，0:失效，1：生效
#}
@bp_diagnosisEngine.route('/saveAlgorithm', methods=['POST'])
def saveAlgorithm():
    rt = None
    data = request.get_json()
    try:
        if data:
            if isinstance(data, dict):
                rt = diagnosisEngine.update_diagengine_Algorithm(data)
    except Exception as e:
        print('mod_diagnosisEngine.saveAlgorithm error:' + e.__str__())
        logging.error('mod_diagnosisEngine.saveAlgorithm error:' + e.__str__())
    return jsonify(data = rt)


#删除算法，status改为0
#postData: None
@bp_diagnosisEngine.route('/removeAlgorithm', methods=['POST'])
def removeAlgorithm(projId):
    rt = None
    data = request.get_json()
    try:
        if data:
            if isinstance(data, str):
                data = [data]
            if isinstance(data, list):
                rt = diagnosisEngine.remove_diagengine_Algorithm(data)
    except Exception as e:
        print('mod_diagnosisEngine.removeAlgorithm error:' + e.__str__())
        logging.error('mod_diagnosisEngine.removeAlgorithm error:' + e.__str__())
    return jsonify(data = rt)


#根据id数组获取算法
#return: {data: [{        #算法表
#    '_id': ObjectId('bbaa8c432621452077258004'),        #编号
#    'creatorId': 1,             #创建者ID
#    'timeLastModify': '2016-05-04 14:40',       #最后修改时间
#    'content': 'def main(): pass',              #算法内容，为python代码段，可为空
#    'src': '',                  #远程算法地址，为空则取content内容
#    'status': 1                 #状态，0:失效，1：生效
#},{...}]}
@bp_diagnosisEngine.route('/getAlgorithmByIds', methods=['POST'])
def getAlgorithmByIds():
    rt = []
    data = request.get_json()
    try:
        if data:
            if isinstance(data, list):
                rt = diagnosisEngine.get_diagengine_Algorithm_by_IdList(data)
    except Exception as e:
        print('mod_diagnosisEngine.getAlgorithmByIds error:' + e.__str__())
        logging.error('mod_diagnosisEngine.getAlgorithmByIds error:' + e.__str__())
    return jsonify(data = rt)


#开启/关闭，thing的某算法
#postData: None
@bp_diagnosisEngine.route('/switchAlgorithmStatusOfThing/<projectId>/<equipmentId>/<algorithmId>/<status>', methods=['POST'])
def switchAlgorithmStatusOfThing(thingId, algorithmId, status):
    #1、改写DiagEngine_Thing.dictAlgorithm[algorithmId].status字段为传入值
    #2、调用算法组同名接口 #20160524: 传入相应requestData
    rt = None
    data = request.get_json()
    try:
        rt = diagnosisEngine.switch_algorithm_status_of_thing(thingId, algorithmId, status, data)
    except Exception as e:
        print('mod_diagnosisEngine.switchAlgorithmStatusOfThing error:' + e.__str__())
        logging.error('mod_diagnosisEngine.switchAlgorithmStatusOfThing error:' + e.__str__())
    return jsonify(data = rt)


#获取thing在某时间段内的报警发生情况
@bp_diagnosisEngine.route('/getNoticeOccurrenceStatistics/<thingId>/<startTime>/<endTime>/<format>', methods=['GET'])
def getNoticeOccurrenceStatistics(thingId, startTime, endTime, format):
    rt = []
    try:
        rt = diagnosisEngine.get_notice_occurrence_statistics(thingId, startTime, endTime, format)
    except Exception as e:
        print('mod_diagnosisEngine.getNoticeOccurrenceStatistics error:' + e.__str__())
        logging.error('mod_diagnosisEngine.getNoticeOccurrenceStatistics error:' + e.__str__())
    return jsonify(data = rt)


#辨识点，根据传入项目、传入的预制类型，将项目中的点按照预置分类返回
#postData: {
#   'projId': 666,
#   'arrClass': ['Ch', 'CT', 'VAVBox', 'Other'],
#}
#return: {'Ch': 50, 'CT': 20, 'VAVBox':100, 'Other': 200}  数字表示该类型的数据源个数
@bp_diagnosisEngine.route('/classifyPoints', methods=['POST'])
def classifyPoints():
    data = request.get_json()
    #step1: postData是数组，数组中每个元素都需需要分别保存
    #step1: 调用算法组同名接口
    rt = None
    try:
        headers = {'content-type': 'application/json'}
        url = app.config.get('DIAGNOSIS_ENGINE_ADDRESS') + '/diagnosisEngine/classifyPoints'
        rt = requests.post(url, headers = headers, data = json.dumps(data))
        return rt.content
    except Exception as e:
        print('mod_diagnosisEngine.mod_diagnosisEngine error:' + e.__str__())
        logging.error(('mod_diagnosisEngine.mod_diagnosisEngine error:' + e.__str__()))
    #rt= {'Ch': 50, 'CT': 20, 'VAVBox':100, 'Other': 200}
    return rt

#将传入的数据源、模板中的变量进行配对
#postData: {
#   'type': 'CT',
#   'arrVariable': ['CTRemoteMode', 'CTAutoMode', 'CTOnOff', 'CTReturnT'],
#   'arrClass': [{'_id': 'aaaa8c432621452077258001', 'name': '可爱的数据源1', 'note': '我是可爱的数据源'}, {...}],
#}
#return: {'CTRemoteMode':'aaaa8c432621452077258001', 'CTOnOff':'aaaa8c432621452077258002'} 只返回配对成功的变量
@bp_diagnosisEngine.route('/matchPoints', methods=['POST'])
def matchPointsAndUpdate():
    #1、调用算法组同名接口
    #2、配对成功，写入DiagEngine_Thing
    #3、返回配对结果，用于前端显示
    data = request.get_json()
    rt = '{}'
    try:
        headers = {'content-type': 'application/json'}
        url = app.config.get('DIAGNOSIS_ENGINE_ADDRESS') + '/diagnosisEngine/matchPoints'
        res = requests.post(url, headers = headers, data = json.dumps(data))
        #rt = json.dumps(res.text)
        #if isinstance(rt, dict):
        #    diagnosisEngine.update_dictVariable_in_diagEngine_thing(thingId, rt)
        rt = res.text
        # if isinstance(rt, dict):
        #     insertdata = {'_id':thingId, 'dictVariable':rt}
        #     diagnosisEngine.update_diagengine_thing(insertdata)
    except Exception as e:
        print('mod_diagnosisEngine.matchPoints error:' + e.__str__())
        logging.error('mod_diagnosisEngine.matchPoints error:' + e.__str__())
        rt = '{}'
    #rt= {'CTRemoteMode':'aaaa8c432621452077258001', 'CTOnOff':'aaaa8c432621452077258002'}
    return rt