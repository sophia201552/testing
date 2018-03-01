from flask import json
from bson.objectid import ObjectId


def struct_DB():
    DiagEngine_Thing = {            #诊断对象表，对象一般为设备
        '_id': ObjectId(''),        #编号
        'name': '',                 #名称
        'type': 'CT',               #类型，参照IOT
        'srcPageId': '',            #对应Factory中pageScreen的ID，用于加载诊断底图
        'dictVariable': {           #变量字典，标识诊断中用到的变量
            'xxx': 'xxxxxxxxx'      #变量名: 数据源ID， 若数据源ID为空，则表示配对失败
        },                          
        'dictAlgorithm': {          #诊断字典，记录该诊断对象中所应用的策略
            'id': {                 #诊断ID
                'status': 0,        #运行状态， 0:停止 1:运行
            }                       
        },                          
        'projId': 222,              #该对象所属项目，索引

        'equipmentId': '',          #20160524: 记录diagnosis_equipments表中对应ID
    }

    DiagEngine_Template = {         #诊断模板表
        '_id': ObjectId(''),        #编号
        'name': '',                 #名称
        'type': '',                 #类型，参照IOT，索引
        'srcPageId': '',            #对应Factory中pageScreen的ID，用于加载诊断底图
        'dictVariable': {           #变量字典，标识诊断中用到的变量
            'xxx': ''               #变量名: 数据源ID， 若数据源ID为空，则表示配对失败
        },
        'dictAlgorithm': {          #诊断字典，记录该诊断对象中所应用的策略
            'id': {                 #诊断ID
            }                       
        },  
        'creatorId': '',            #创建者ID
        'timeLastModify': '',       #最后修改时间
    }

    DiagEngine_Algorithm = {        #算法表
        '_id': ObjectId(''),        #编号
        'creatorId': 1,             #创建者ID
        'timeLastModify': '',       #最后修改时间
        'content': '',              #算法内容，为python代码段，可为空
        'src': '',                  #远程算法地址，为空则取content内容
        'status': 1                 #状态，0:失效，1：生效
    }