from flask import json
from bson.objectid import ObjectId


def struct_DB():
    #诊断项
    Strategy_Item = {
        # 编号
        '_id': ObjectId('565558adf18a890a2448075b'),
        # tag节点Id,
        'nodeId': ObjectId('565558adf18a890a24480752'),
        # 名称
        'name': '冷机1号供回水温度监测',
        # 描述
        'desc': '用神奇的高端洋气算法，对冷机1号初代机供回水温度越界问题进行监测，并发出报警',
        # 修改人
        'userId': 1,
        # 最后修改时间
        'lastTime': '2016-04-12 19:00:00',
        # 关键字，便于检索
        'keywords': ['冷机', '与非', ],
        # 类型：0，诊断；1，KPI；2，计算点；
        'type': 0,
        # 运行间隔, 秒
        'interval': 60,
        # 最后运行时间
        'lastRuntime': '2016-04-12 19:00:00',
        # 状态： 0，未启用；1，启用；
        'status': 0,
        # 策略详细配置
        'option': {
            # 模块列表
            'list': [{  # 无模板引用的模块
                # 模块编号
                '_id': ObjectId('565558adf18a890a24411111'),
                # 模块调用方式：0，python代码；1，引用模板；2，远程REST服务调用；3，LaTex；4，固有控件
                'type': 0,
                # 模块名称
                'name': '模糊规则',
                # 模块描述
                'desc': '高大上的玩意儿，你猜是干嘛的',
                # 配置项，根据type类型不同，而稍有差别，但都有input、output、content
                'option': {
                    # 输入参数
                    'input': [{
                        # 变量名
                        'name': 'point1',
                        # 类型： 0，数据源；1，短信；2，邮件；10，数值；11，字符串；12，时间；13，JSON
                        'type': 0,
                        # 默认值，用户未配置value时，或value不存在时，显示的默认值
                        'default': 20,
                        # 调试值，输入参数特有，用于临时测试结果
                        'debug': '',
                        # 实际值，用户配置后才会有
                        'value': ''
                    }],
                    # 输出参数
                    'output': [],
                    # 内容
                    'content': {

                    }
                },
                'loc': {
                    'x': 10,
                    'y': 20,
                }
            }, {
                # 模块编号
                '_id': ObjectId('565558adf18a890a24411111'),
                # 引用的模板ID，
                'tempId': '',
                # 模块类型
                'type': '',
                'name': '',
                'desc': '',
                'loc': {
                    'x': 10,
                    'y': 20,
                }
            }]
        }
    }

    # 模板，结构基本同一个诊断项，少了运行时状态
    Strategy_Template = {
        # 编号
        '_id': ObjectId('565558adf18a890a2448075b'),
        # tag节点类型的ID,
        'tagId': ObjectId('565558adf18a890a24480752'),
        # 名称
        'name': '冷机1号供回水温度监测',
        # 描述
        'desc': '用神奇的高端洋气算法，对冷机1号初代机供回水温度越界问题进行监测，并发出报警',
        # 修改人
        'userId': 1,
        # 最后修改时间
        'lastTime': '2016-04-12 19:00:00',
        # 关键字，便于检索
        'keywords': ['冷机', '与非'],
        # 类型：0，诊断；1，KPI；2，计算点；
        'type': 0,
        # 策略详细配置
        'option': {
            # 模块列表
            'list': [{  # 无模板引用的模块
                # 模块编号
                '_id': ObjectId('565558adf18a890a24411111'),
                # 模块调用方式：0，python代码；1，引用模板；2，远程REST服务调用；3，LaTex；4，固有控件
                'type': 0,
                # 模块名称
                'name': '模糊规则',
                # 模块描述
                'desc': '高大上的玩意儿，你猜是干嘛的',
                # 配置项，根据type类型不同，而稍有差别，但都有input、output、content
                'option': {
                    # 输入参数
                    'input': [{
                        # 变量名
                        'name': 'point1',
                        # 类型： 0，数据源；1，短信；2，邮件；10，数值；11，字符串；12，时间；13，JSON
                        'type': 0,
                        # 默认值，用户未配置value时，或value不存在时，显示的默认值
                        'default': 20,
                        # 调试值，输入参数特有，用于临时测试结果
                        'debug': '',
                    }],
                    # 输出参数
                    'output': [],
                    # 内容
                    'content': {

                    }
                }
            }]
        }
    }

    # Log
    Strategy_Log = {
        # 自动生成
        '_id': ObjectId('565558adf18a890a33333333'),
        # 操作人
        'userId': 1,
        # 操作时间
        'time': '2016-04-12 19:00:00',
        # 操作类型：0，新增；1，修改；2，删除；3，启停
        'type': 10,
        # 操作内容
        'option': {
            'strategyId': '565558adf18a890a2448075b',
            'status': 1
        }
    }

    pass