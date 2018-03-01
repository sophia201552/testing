from flask import json
from bson.objectid import ObjectId


def struct_DB():
    Patrol_Point = {                #巡更点
        '_id': ObjectId(''),        #巡更点ID //索引
        'name': '',                 #巡更点名称
        'codeQR': '',               #二维码内容, sha1('_id'+当前插入/更新时间)  //索引
        'type': 0,                  #类型（0：设备，1：地点）
        'content': '',              #要求，一段文字
        'lastTime': '',             #最后巡更时间
        'userId': '',               #更新者
        'updateTime': '',           #更新时间
        'projId': ''
    }

    Patrol_Path = {                 #巡更路线
        '_id': ObjectId(''),        #路线ID
        'name': '',                 #路线名
        'path': ['', ''],           #巡更点顺序，数组内容：巡更点ID, 字符串，非ObjectId
        'userId': '',               #更新者
        'updateTime': '',           #更新时间
        'elapse': 0,                #该巡更路线走完预计耗时多久， 单位分钟
        'status': 1,                #0:无效 1:有效 默认有效
        #'interval': 0
        'projId': ''
    }

    Patrol_Executor = {             #巡更人员
        '_id': ObjectId(''),        #人员ID
        'code': '',                 #工号
        'name': '',                 #名称
        'sex': 0,                   #性别 0:女 1:男 (内涵)
        'department': '',           #所属部门， 字符串
        'status': 1,                #状态，默认1， 0:注销 1:在岗
        'projId': ''
    }

    Patrol_Mission = {              #任务
        '_id': ObjectId(''),        #任务ID
        'projId': '',               #项目ID
        'startTime': '',            #开始计算周期的时间
        'interval': 1,              #工作周期，单位天
        'option':{                    #
            'pathId':{              #路径ID
                    '09:00': ['executorId'],    #计划开始时间：执行人数组，数组对应
                    '16:00': ['executorId'],
                },
        }
    }

    Patrol_MissionLog = {           #巡更记录
        '_id': ObjectId(''),        #记录ID
        'planTime': '9:00',         #计划时间，对应 Patrol_mission.data.pathId.[time]的time
        'startTime': '',            #巡更开始时间
        'endTime': '',              #巡更结束时间
        'executorId': '',           #执行人ID
        'state': 1,                 #状态 0:未完成 1:完成 2:延误
        'pathId': '',               #巡更路线路线ID
        'path':[{                   #路线详情
                '_id': '',          #巡更点ID
                'time': '',         #巡更点检查时间
                'msg': '',          #信息
                'error': 0,         #是否有问题，状态 0:无异常 1:异常
                'arrPic':['']       #图片URL
            }],                      
        'projId': ''
    }



    #====手机本地存储================

    pass