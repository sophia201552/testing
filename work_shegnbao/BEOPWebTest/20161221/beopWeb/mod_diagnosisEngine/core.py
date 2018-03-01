from flask import request,json, jsonify


#1. 开启/关闭，thing的某算法
#route('/diagnosisEngine/switchAlgorithmStatusOfThing/<projectId>/<equipmentId>/<algorithmId>/<status>', "POST")
#20160524: 
#status=0, postData: {}
#status=1, postData:{
#    templateId: '',
#    dictVariable: {
#        'xxx': ''               #变量名: 数据源ID， 若数据源ID为空，则表示配对失败
#    },
#}
#return: 'success'


#2. 辨识点，根据传入项目、传入的预制类型，将项目中的点按照预置分类返回
#route('/diagnosisEngine/classifyPoints', "POST")
#postData: {
#   'projId': 666,
#   'arrClass': ['Ch', 'CT', 'VAVBox', 'Other'],
#}
#return: {'Ch': 50, 'CT': 20, 'VAVBox':100, 'Other': 200}  数字表示该类型的数据源个数


#3. 将传入的数据源、模板中的变量进行配对
#route('/diagnosisEngine/matchPoints', "POST")
#postData: {
#   'type': 'CT',
#   'arrVariable': ['CTRemoteMode', 'CTAutoMode', 'CTOnOff', 'CTReturnT'],
#   'arrClass': [{'_id': 'aaaa8c432621452077258001', 'name': '可爱的数据源1', 'note': '我是可爱的数据源'}, {...}],
#}
#return: {'CTRemoteMode':'aaaa8c432621452077258001', 'CTOnOff':'aaaa8c432621452077258002'} 只返回配对成功的变量