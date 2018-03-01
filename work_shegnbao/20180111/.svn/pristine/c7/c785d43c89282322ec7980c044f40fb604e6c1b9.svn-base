from flask import json
from bson.objectid import ObjectId


def struct_DB():
    #诊断项
    Strategy_Item = {
        # 编号
        '_id': ObjectId('565558adf18a890a2448075b'),
        # 父节点 id,
        'parentId': ObjectId('565558adf18a890a24480752'),
        # 所属项目Id
        'projId': 293,
        # 名称
        'name': '冷机1号供回水温度监测',
        # 描述
        'desc': '用神奇的高端洋气算法，对冷机1号初代机供回水温度越界问题进行监测，并发出报警',
        # 创建人
        'creatorId': 1,
        # 创建时间
        'createTime': '2017-01-01 00:00:00',
        # 最后修改人
        'lastModifierId': 1,
        # 最后修改时间
        'lastModifyTime': '2016-04-12 19:00:00',
        # 关键字，便于检索
        'keywords': ['冷机', '与非', ],
        # 类型：0，诊断；1，数据分析；
        'type': 0,
        # 触发器，用于配置策略何时执行
        'trigger': [{
            # 触发周期，one，仅一次；day，按天执行；week，按周执行；month，按月执行
            'type': "day",
            'options': {
                # 周期内确切的执行时间
                'time': "15:00",
                # 周期间隔，比如为1，那就是1天（或周或月）执行一次；若为2，那就是2天（或周或月）执行一次
                'step': 1
            }
        }],
        # 最后运行时间
        'lastRuntime': '2016-04-12 19:00:00',
        # 状态： 0，未启用；1，启用；
        'status': 0,
        # 策略其他配置
        'options': {
            # 策略自定义参数
            'config':{}
        },
        # 前置任务
        'preTasks': [
            # 策略 id
            ObjectId('')
        ]
    }

    # 模块的输入输出
    Strategy_Module_Input_Output = {
        'series1': [],
        'series2': [],
        # ...
    }

    # 模块
    Strategy_Module = {
        # 编号
        '_id': '565558adf18a890a2448075b',
        # 模块属于哪个策略,
        'strategyId': '565558adf18a890a24480752',
        # 模块名称
        'name': '冷机1号供回水温度监测',
        # 模块类型
        'type': '',
        # 当前模块的所有输出模块
        'outputs': [{
            '_id': '其它模块的id'
            # TODO 提供和下游模块的关系
        }],
        # 模块的配置信息，根据模块类型不同，这一块的数据结构也不同
        'options': {},
        # 横坐标
        'x': 0,
        # 纵坐标
        'y': 0
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
        'data': {
            'strategyId': '565558adf18a890a2448075b',
            'status': 1
        }
    }

    # 项目配置表
    Strategy_ProjectConfig = {
        # 自动生成
        '_id': ObjectId('565558adf18a890a33333333'),
        # 项目id
        'projId': 49,
        # 配置信息
        'config': {
            '${key}': '${value}'
        }
    }

    ##################### 诊断模块 options 定义 ######################
    # 数据源模块
    {
        'type': 'realtime/history',
        # 参数模板
        'params': [{
            'name': 'a',
            'description': '',
            'sample': '',
            'tags': []
        }, {
            # ...b
        }],
        # 当前选中的参数组
        'activedGroup': 'group id',
        # 参数组配置数据
        'groups': [{
            '_id': ObjectId(''),
            'name': 'group1',
            'data': {
                'a': '@xxx'
                # ...
            }
        }, {
            '_id': ObjectId(''),
            'name': 'group1',
            'data': {
                'a': '@xxx'
                # ...
            }
        }]
    }

    # 模糊集合模块
    {
        # 参数模板
        'params': [{
            # 参数名称
            'name': '',
            # 类型： 详细见枚举文件
            'type': 0,
            # 别名
            'alias': 'CHWEnterRestartTemp',
            # 模糊规则参数状态 0：禁用；1：启用
            'status': 1,
            # 单位
            'unit': "℃",
            # 是否进行参数检查。0-否；1-是
            'check': 0,
            # 0：禁用；1：启用
            'enabled': 1,
            # 最小值
            'min': 0,
            # 最大值
            'max': 5,
            # 精度
            'precision': 0,
            # 类型
            'type': 0,
            # terms
            'terms': [{
                # term 名称
                'name': 'On',
                # 图形类型
                'type': 0,
                # 横坐标点集合
                'points': [1, 2, 3]
            }]
        }, {
            # ...
        }]
    }

    # 诊断输出项模块
    {
        'params': [{
            # 参数名称
            'name': '',
            'chart': [{
                # 对应输入参数名称
                'name': "HighPressureCommonAlarm",
                # 0-主轴；1-次轴
                'type': 0
            }, {
                'name': "ChOnOff",
                'type': 1
            }],
            'energyConfig': {},
            'faultId': 698,
            'faultTypeGroup': ["ChGroup_Pressure"],
            'runDay': 12,
            'runMonth': 240,
            'runWeek': 60,
            'runYear':2400,
            'status': 1,
            'targetExecutor': None,
            'targetGroup': None,
            'unit':"kWh"
        }, {
            # ...
        }]
    }

    # 逻辑分析模块
    {
        # 规则 - 以文本形式（第二版的时候去掉，这里只是为了兼容第一版）
        'rule': '',
        # 规则 - 以对象形式
        'ruleBlock': [{
            'items': [{
                # 连接符
                'continuity': 'if/and',
                # 主语 - 对应输入参数名称
                'name': '',
                # 谓语
                'judge': 'is/is not',
                # 宾语
                'term': 'On'
            }],
            'results': [{
                'continuity': 'then',
                'name': '',
                'judge': '',
                'term': ''
            }]
        }]
    }

    # Test&Score
    {
        'dataset': {
            'mode': 'datasource|selected dataset',
            'options': {
                # datasource
                'startTime': '',
                'endTime': '',

                # selected dataset
                'data': []
            }
        },
        # 方法
        'methods': [{
            'type': '逻辑判断',
            'enable': 0|1,
            'options': {}
        }, ]
    }

    # 诊断输出模块
    

    ##################### 数据分析模块 options 定义 ######################
    # 数据源模块
    {
        'type': 'realtime/history',
        # 参数模板
        'params': [{
            'name': 'a',
            'description': '',
            'sample': '',
            'tags': []
        }, {
            # ...b
        }],
        # 当前选中的参数组
        'activedGroup': 'group id',
        # 参数组配置数据
        'groups': [{
            '_id': ObjectId(''),
            'name': 'group1',
            'data': {
                'a': '@xxx'
                # ...
            }
        }, {
            '_id': ObjectId(''),
            'name': 'group1',
            'data': {
                'a': '@xxx'
                # ...
            }
        }]
    }

    # SVM 模块
    {
        # 名称
        'name': '',
        'svmType': {
            'type': 'SVM',
            'cost': 1,
            'epsilon': 1,
        },
        'kernel': {
            'type': 'linear/poly/rbf/sigmoid',
        },
        'options': {
            'cvSplitRatio': 0.2,
            # 因变量
            'independenVariables': []
            # 自变量
            'dependenVariables': []
        }
    }
    # 相关性分析模块
    {
        'dataset': {
            'mode': 'datasource|selected dataset',
            'options': {
                # datasource
                'startTime': '',
                'endTime': '',

                # selected dataset
                'data': []
            }
        },
        # 模型
        'model': 'SVM'
    }

    # 预测模块
    {
        'dataset': {
            'mode': 'datasource',
            'options': {
                # datasource
                'startTime': '',
                'endTime': '',

                # selected dataset
                'data': []
            }
        },
        # 方法
        'methods': ['SVM']
    }

    # 数据源输出模块
    {
        # 输出的数据源的名称
        'name': '',
        # 输出的数据源的类型
        'type': 'virtual point/calculate point'
    }

    # 散点图模块 - 展示模块（延后）