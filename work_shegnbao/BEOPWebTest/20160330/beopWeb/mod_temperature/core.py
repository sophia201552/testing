from flask import request,json, jsonify


#1.根据坐标设置温度 
#route('/appTemp/location/setInfo/<roomId>', "POST")
#PostData:
#{
#   'gps': [100, 100, 0],   #'x, y, z' z默认为0
#   'userId': 72,           #用户
#   'temp': 33,             #温度，可能不传
#   'speed': 33,            #风速，可能不传
#   'switch': 1,            #启停，可能不传
#   'sp': 1,                #季节模式，可能不传
#   'valueP': 33,           #阀位，可能不传
#   'autp': 1,              #手自动，可能不传
#}

#调用官网接口'/appTemperature/setController =====================================
##PostData: 
#[{
#    '_id': '',               #controllerId
#    'prefix': '1103_FCU001_',           #前缀
#    'projectId': '',
#    'attrs': {   #个数随机，请用prefix+attr.key拼起标准点名，例1103_FCU001_FCUOnOffSet，调用/set_to_site_by_projname接口
#        'FCUOnOffSet': 0,
#        'FCUValvePositionDSet': 33,
#        ...
#    }
#}]



#2.根据坐标显示温度 =======================================================
#route('/appTemp/location/getInfo/<roomId>', "POST")
#PostData: {
#   'gps': [100, 100, 0],   #'x, y, z' z默认为0
#   'userId': 72,           #用户
#   'controllerId': ''  controllerId ObjectId  #临时字段
#}
#return: 
#{
#    "temp": 23, #温度
#    "humidity": 23, #湿度
#    "speed": 3 #风速
#}


#3.运行模式 ===============================================================
#route('/appTemp/room/mode/<roomId>/<modeId>', "POST")


#4.日程 ===================================================================
#调用接口/appTemperature/schedule/get/<roomId> 可获取到全部日程格式如下：
#今后可能会需要支持按周期重复，例如工作日生效。
#{
#    "_id": "56f1f37bf7732b0a387e1c35",
#    "roomId": "1458b1230011458642502209",
#    "option": [
#        {
#            "arrCommand": [
#                {
#                    "controllerId": "7b6167a20011458643184120",
#                    "switch": "1"
#                },
#                {
#                    "controllerId": "6a4d791f0011458643184888",
#                    "switch": "1"
#                }
#            ],
#            "lastTime": "2016-03-23 09:38:03",
#            "moment": "08:37",
#            "userId": 1
#        }
#        {
#            "arrCommand": [
#                {
#                    "controllerId": "7b6167a20011458643184120",
#                    "switch": "1"
#                },
#                {
#                    "controllerId": "6a4d791f0011458643184888",
#                    "switch": "1"
#                },
#                {
#                    "controllerId": "76ade2d20011458643189832",
#                    "switch": "1"
#                },
#                {
#                    "controllerId": "8f48cb4b0011458643190704",
#                    "switch": "1"
#                }
#            ],
#            "lastTime": "2016-03-24 16:58:43",
#            "moment": "16:58",
#            "userId": 1
#        }
#    ],
#}


#5.通知项目更新 ===================================================================
#route('/appTemp/room/update/<roomId>', "POST")

#调用官网接口 /appTemperature/room/getDetail/<roomId>
#{
#    "data": {
#        "device": [
#            {
#                "_id": "fe2b105e0011458643144937",
#                "arrP": {
#                    "SensorT": "56f1175c833c974099b296d4"
#                },
#                "name": "1103_SmartSensor010_",
#                "pId": [
#                    "4bd01ca70011458642519561"
#                ],
#                "params": {
#                    "address": "",
#                    "cId": "7b6167a20011458643184120",
#                    "endpoint": 0,
#                    "gatewayId": "",
#                    "gps": [
#                        674,
#                        64
#                    ],
#                    "mac": ""
#                },
#                "path": "",
#                "prefix": "1103_SmartSensor010_",
#                "projId": 121,
#                "type": "SensorTemp"
#            },
#            {
#                "_id": "bfd1aac10011458643147328",
#                "arrP": {
#                    "SensorT": "56f1175c833c974099b296c3"
#                },
#                "name": "1103_SmartSensor006_",
#                "pId": [
#                    "d03a73860011458642527000"
#                ],
#                "params": {
#                    "address": "",
#                    "cId": "7b6167a20011458643184120",
#                    "endpoint": 0,
#                    "gatewayId": "",
#                    "gps": [
#                        1150,
#                        51
#                    ],
#                    "mac": ""
#                },
#                "path": "",
#                "prefix": "1103_SmartSensor006_",
#                "projId": 121,
#                "type": "SensorTemp"
#            },
#            {
#                "_id": "0e24e0570011458643167016",
#                "arrP": {
#                    "SensorT": "56f1175c833c974099b296c9"
#                },
#                "name": "1103_SmartSensor005_",
#                "pId": [
#                    "cceac6c80011458642532825"
#                ],
#                "params": {
#                    "address": "",
#                    "cId": "8f48cb4b0011458643190704",
#                    "endpoint": 0,
#                    "gatewayId": "",
#                    "gps": [
#                        407,
#                        817
#                    ],
#                    "mac": ""
#                },
#                "path": "",
#                "prefix": "1103_SmartSensor005_",
#                "projId": 121,
#                "type": "SensorTemp"
#            },
#            {
#                "_id": "40dc91f20011458643138217",
#                "arrP": {
#                    "SensorT": "56f1175c833c974099b296d6"
#                },
#                "name": "1103_SmartSensor003_",
#                "pId": [
#                    "1458b1230011458642502209"
#                ],
#                "params": {
#                    "address": "",
#                    "cId": "76ade2d20011458643189832",
#                    "endpoint": 0,
#                    "gatewayId": "",
#                    "gps": [
#                        64,
#                        40
#                    ],
#                    "mac": ""
#                },
#                "path": "",
#                "prefix": "1103_SmartSensor003_",
#                "projId": 121,
#                "type": "SensorTemp"
#            },
#            {
#                "_id": "7b6167a20011458643184120",
#                "arrP": {
#                    "FCUAutoMode": "56f1175c833c974099b296cc",
#                    "FCUOnOffSet": "56f1175c833c974099b296d9",
#                    "FCUSpeedDSet": "56f1175c833c974099b296da",
#                    "FCUTSet": "56f1175c833c974099b296cd",
#                    "FCUValvePositionDSet": "56f1175c833c974099b296d8"
#                },
#                "name": "1103_FCU001_",
#                "pId": [
#                    "1458b1230011458642502209"
#                ],
#                "params": {
#                    "address": "",
#                    "gatewayId": "",
#                    "gps": [
#                        435,
#                        685
#                    ],
#                    "mac": "",
#                    "type": 0
#                },
#                "path": "",
#                "prefix": "1103_FCU001_",
#                "projId": 121,
#                "type": "ControllerFCU"
#            },
#            {
#                "_id": "442c51ef0011458643141138",
#                "arrP": {
#                    "SensorT": "56f1175c833c974099b296cb"
#                },
#                "name": "1103_SmartSensor004",
#                "pId": [
#                    "1458b1230011458642502209"
#                ],
#                "params": {
#                    "address": "",
#                    "cId": "8f48cb4b0011458643190704",
#                    "endpoint": 0,
#                    "gatewayId": "",
#                    "gps": [
#                        500,
#                        72
#                    ],
#                    "mac": ""
#                },
#                "path": "",
#                "prefix": "1103_SmartSensor004_",
#                "projId": 121,
#                "type": "SensorTemp"
#            },
#            {
#                "_id": "6a4d791f0011458643184888",
#                "arrP": {
#                    "FCUAutoMode": "56f1175c833c974099b296d1",
#                    "FCUOnOffSet": "56f1175c833c974099b296d7",
#                    "FCUSpeedDSet": "56f1175c833c974099b296ce",
#                    "FCUTSet": "56f1175c833c974099b296cf",
#                    "FCUValvePositionDSet": "56f1175c833c974099b296c5"
#                },
#                "name": "1103_FCU002_",
#                "pId": [
#                    "1458b1230011458642502209"
#                ],
#                "params": {
#                    "address": "",
#                    "gatewayId": "",
#                    "gps": [
#                        433,
#                        735
#                    ],
#                    "mac": "",
#                    "type": 0
#                },
#                "path": "",
#                "prefix": "1103_FCU002_",
#                "projId": 121,
#                "type": "ControllerFCU"
#            },
#            {
#                "_id": "76ade2d20011458643189832",
#                "arrP": {
#                    "FCUAutoMode": "56f1175c833c974099b296c4",
#                    "FCUOnOffSet": "56f1175c833c974099b296bf",
#                    "FCUSpeedDSet": "56f1175c833c974099b296c7",
#                    "FCUTSet": "56f1175c833c974099b296db",
#                    "FCUValvePositionDSet": "56f1175c833c974099b296ca"
#                },
#                "name": "1103_FCU004_",
#                "pId": [
#                    "1458b1230011458642502209"
#                ],
#                "params": {
#                    "address": "",
#                    "gatewayId": "",
#                    "gps": [
#                        192,
#                        818
#                    ],
#                    "mac": "",
#                    "type": 0
#                },
#                "path": "",
#                "prefix": "1103_FCU004_",
#                "projId": 121,
#                "type": "ControllerFCU"
#            },
#            {
#                "_id": "8f48cb4b0011458643190704",
#                "arrP": {
#                    "FCUAutoMode": "56f1175c833c974099b296d5",
#                    "FCUOnOffSet": "56f1175c833c974099b296d3",
#                    "FCUSpeedDSet": "56f1175c833c974099b296be",
#                    "FCUTSet": "56f1175c833c974099b296c6",
#                    "FCUValvePositionDSet": "56f1175c833c974099b296c1"
#                },
#                "name": "1103_FCU003_",
#                "pId": [
#                    "1458b1230011458642502209"
#                ],
#                "params": {
#                    "address": "",
#                    "gatewayId": "",
#                    "gps": [
#                        230,
#                        818
#                    ],
#                    "mac": "",
#                    "type": 0
#                },
#                "path": "",
#                "prefix": "1103_FCU003_",
#                "projId": 121,
#                "type": "ControllerFCU"
#            },
#            {
#                "_id": "8fdae1830011458643150152",
#                "arrP": {
#                    "SensorT": "56f1175c833c974099b296d2"
#                },
#                "name": "1103_SmartSensor009_",
#                "pId": [
#                    "1458b1230011458642502209"
#                ],
#                "params": {
#                    "address": "",
#                    "cId": "6a4d791f0011458643184888",
#                    "endpoint": 0,
#                    "gatewayId": "",
#                    "gps": [
#                        1223,
#                        89
#                    ],
#                    "mac": ""
#                },
#                "path": "",
#                "prefix": "1103_SmartSensor009_",
#                "projId": 121,
#                "type": "SensorTemp"
#            },
#            {
#                "_id": "2a4eee4a0011458643152984",
#                "arrP": {
#                    "SensorT": "56f1175c833c974099b296c0"
#                },
#                "name": "1103_SmartSensor002_",
#                "pId": [
#                    "1458b1230011458642502209"
#                ],
#                "params": {
#                    "address": "",
#                    "cId": "6a4d791f0011458643184888",
#                    "endpoint": 0,
#                    "gatewayId": "",
#                    "gps": [
#                        804,
#                        396
#                    ],
#                    "mac": ""
#                },
#                "path": "",
#                "prefix": "1103_SmartSensor002_",
#                "projId": 121,
#                "type": "SensorTemp"
#            },
#            {
#                "_id": "641c8bc20011458643156352",
#                "arrP": {
#                    "SensorT": "56f1175c833c974099b296d0"
#                },
#                "name": "1103_SmartSensor008_",
#                "pId": [
#                    "1458b1230011458642502209"
#                ],
#                "params": {
#                    "address": "",
#                    "cId": "6a4d791f0011458643184888",
#                    "endpoint": 0,
#                    "gatewayId": "",
#                    "gps": [
#                        1260,
#                        598
#                    ],
#                    "mac": ""
#                },
#                "path": "",
#                "prefix": "1103_SmartSensor008_",
#                "projId": 121,
#                "type": "SensorTemp"
#            },
#            {
#                "_id": "52a0b2e70011458643164816",
#                "arrP": {
#                    "SensorT": "56f1175c833c974099b296c2"
#                },
#                "name": "1103_SmartSensor001_",
#                "pId": [
#                    "1458b1230011458642502209"
#                ],
#                "params": {
#                    "address": "",
#                    "cId": "76ade2d20011458643189832",
#                    "endpoint": 0,
#                    "gatewayId": "",
#                    "gps": [
#                        69,
#                        432
#                    ],
#                    "mac": ""
#                },
#                "path": "",
#                "prefix": "1103_SmartSensor001_",
#                "projId": 121,
#                "type": "SensorTemp"
#            },
#            {
#                "_id": "6ea62c140011458643179168",
#                "arrP": {
#                    "SensorT": "56f1175c833c974099b296c8"
#                },
#                "name": "1103_SmartSensor007_",
#                "pId": [
#                    "1458b1230011458642502209"
#                ],
#                "params": {
#                    "address": "",
#                    "cId": "76ade2d20011458643189832",
#                    "endpoint": 0,
#                    "gatewayId": "",
#                    "gps": [
#                        61,
#                        312
#                    ],
#                    "mac": ""
#                },
#                "path": "",
#                "prefix": "1103_SmartSensor007_",
#                "projId": 121,
#                "type": "SensorTemp"
#            }
#        ],
#        "space": [
#            {
#                "_id": "4bd01ca70011458642519561",
#                "_idProj": "aaaaaaaaabaaf32fbc300001",
#                "arrP": null,
#                "name": "Glen",
#                "pId": "1458b1230011458642502209",
#                "params": {
#                    "arrWallIds": [],
#                    "height": 224,
#                    "path": [],
#                    "width": 269,
#                    "x": 637,
#                    "y": 14
#                },
#                "prefix": "",
#                "projId": 121,
#                "type": "GroupSpace"
#            },
#            {
#                "_id": "d03a73860011458642527000",
#                "_idProj": "aaaaaaaaabaaf32fbc300001",
#                "arrP": null,
#                "name": "Charls",
#                "pId": "1458b1230011458642502209",
#                "params": {
#                    "arrWallIds": [],
#                    "height": 224,
#                    "path": [],
#                    "width": 276,
#                    "x": 915,
#                    "y": 13
#                },
#                "prefix": "",
#                "projId": 121,
#                "type": "GroupSpace"
#            },
#            {
#                "_id": "cceac6c80011458642532825",
#                "_idProj": "aaaaaaaaabaaf32fbc300001",
#                "arrP": null,

#                "name": "会议室",
#                "pId": "1458b1230011458642502209",
#                "params": {
#                    "arrWallIds": [],
#                    "height": 199,
#                    "path": [],
#                    "width": 307,
#                    "x": 165,
#                    "y": 644
#                },
#                "prefix": "",
#                "projId": 121,
#                "type": "GroupSpace"
#            }
#        ]
#    }
#}
