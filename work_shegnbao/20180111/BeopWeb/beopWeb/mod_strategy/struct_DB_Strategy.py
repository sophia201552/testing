from flask import json
from bson.objectid import ObjectId


def struct_DB():
    #诊断项
    Strategy_Item = {
        # 编号
        '_id': ObjectId('565558adf18a890a2448075b'),
        # tag节点Id,
        'nodeId': ObjectId('565558adf18a890a24480752'),
        # 所属项目Id
        'projId': 293,
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
        'option': {
            # 策略自定义参数
            'config':{},
            # 是否需要更新 fault 表，0：否；1：是
            'needSyncFaultTable': 0
        },
        # 前置任务
        'preTasks': [
            # 策略 id
            ObjectId('')
        ],
        # 运行值
        'value': [{
            '_id': ObjectId(''),
            'name': 'VAV01',
            'params': {
                'faultId': {
                    '${moduleId}': {
                        '${output01Id}': 123,
                        '${output02Id}': 123
                        # ...
                    }
                },
                'equipmentId': {
                    '${module01Id}': 'equipmentId',
                    '${module02Id}': 'equipmentId',
                    # ...
                }
            },
            'list': {
                '${moduleId}': {
                    '${paramId}': 100,
                    '${paramId}': 200
                }
            }
        }, {
            '_id': ObjectId(''),
            'name': 'VAV02',
            'list': {
                '${moduleId}': {
                    '${paramId}': 100,
                    '${paramId}': 200
                }
            }
        }]
    }

    Strategy_Module = {  # 无模板引用的模块
        # 模块编号
        '_id': ObjectId('565558adf18a890a24411111'),
        # 属于哪个策略
        'strategyId': ObjectId(''),
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
                '_id': ObjectId(''),
                # 引用的模块 id
                'refModuleId': ObjectId(''),
                # 引用的变量的 id
                'refOutputId': ObjectId(''),
                # 变量名
                'name': 'point1',
                # 描述信息
                'desc': '描述信息',
                # 类型： 详细见枚举文件
                'type': 0,
                # 默认值，用户未配置value时，或value不存在时，显示的默认值
                'default': 20,
                # 显示时的坐标信息
                'loc': {
                    'x': 10,
                    'y': 20
                },
                # 模糊规则输入
                'option': {
                    # 模糊规则参数状态 0：禁用；1：启用
                    'status': 1,
                    # 别名
                    'alias': "abc",
                    # 单位
                    'unit': "℃",
                    # 0：不检查；1：检查
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
                    'terms': [{
                        # term 名称
                        'name': 'On',
                        # 图形类型
                        'type': 0,
                        # 横坐标点集合
                        'points': [1, 2, 3]
                    }]
                }
            }],
            # 输出参数
            'output': [{
                '_id': ObjectId(''),
                'name': 'point1',
                # 描述信息
                'desc': '描述信息',
                'type': 10,
                # 显示时的坐标信息
                'loc': {
                    'x': 10,
                    'y': 20
                },
                'option': {
                    # 模糊规则参数状态 0：禁用；1：启用
                    'status': 1,
                    # 模糊规则输入参数全名
                    'fullName': "abc",
                    # 建议
                    'advise': '建议打开冷机',
                    # 图表图例
                    'chart': [{
                        # 模糊规则输入参数_id
                        '_id': ObjectId(''),
                        # 0：主坐标轴；1：副坐标轴
                        'type': 0
                    }],
                    # 副坐标单位
                    'deputy': '温度(℃)',
                    # 描述，
                    'desc': '机房温度过高',
                    # 等级，1：故障；2：异常
                    'grade': 2,
                    # 主坐标单位
                    'principal': '温度(℃)',
                    # 图表标题
                    'title': '图表标题',
                    # 故障类型 ：填0-1的之间包括0,1值和2
                    'faultType': 0,
                    # 故障类型分组
                    'faultTypeGroup': [],
                    # roi扩展
                    # 故障分组
                    'group': 'Capacity',
                    # 故障影响
                    'consequence': 'Energy Waste',
                    # 故障执行人员所在组的ID
                    'targetGroup': ObjectId(''),
                    # 故障执行人员的ID
                    'targetExecutor': ObjectId(''),
                    # 计算能耗用的天的时间/h
                    'runTimeDay': 12,
                    # 计算能耗用的周的时间/h
                    'runTimeWeek': 60,
                    # 计算能耗用的月的时间/h
                    'runTimeMonth': 240,
                    # 计算能耗用的年的时间/h
                    'runTimeYear': 2400,
                    # 单位：计算能耗的时候使用
                    'unit': 'kWh',
                    # 能耗配置：计算能耗的配置
                    'energyConfig': {
                        # 方法名：计算能耗的使用方法名
                        'name': "方法A",
                        # 方法配置：计算能耗的选择某个方法需要配置的参数
                        'parameters': {
                            # 输入值/数据源/数字
                            'a': "",
                            'b': "",
                            'c': ""
                        }
                    },
                    # 运行模式 All,Cooling,Heating
                    'runMode': 'All',
                }
            }],
            'groups': [{
                'id': '',
                'loc': {},
                'type': 'consequence',
                'value': 1
            }],
            # 内容
            'content': {
                # 项目id
                'projId': 1,
                # 拼好的 rule 文本
                'rule': '',
                # 规则块数据
                'ruleBlock': [{
                    # 条件
                    'items': [{
                        # 连接符
                        'continuity': 'if',
                        # 变量
                        'name': 'a',
                        # 判断型介词
                        'judge': 'is',
                        'term': 'On'
                    }, {
                        'continuity': 'and',
                        'name': 'b',
                        'judge': 'is',
                        'term': 'On'
                    }],
                    # 结果
                    'results': [{
                        'continuity': 'then',
                        'name': 'c',
                        'judge': 'is',
                        'term': 'Big'
                    }]
                }]
            },
            # 模块的时间范围配置
            'timeRange': {
                # 0: 快速配置；1：固定周期；2：最近周期
                "type": 0,
                "option": {
                    ############
                    # 快速配置
                    # 过去24小时：last24hours
                    # 昨天（24小时）：yesterday
                    # 过去7天：last7days
                    # 上周（7天）：lastweek
                    # 过去12个月：last12months
                    "period": "yesterday",
                    ############
                    # 固定周期
                    "timeStart": "2017-01-01 00:00:00",
                    "timeEnd": "2017-01-02 00:00:00",
                    "timeFormat": 'm5',
                    ############
                    # 最近周期
                    "timeFormat": 'm5',
                    # 时间单位
                    "timeUnit": "hour",
                    # 多少个时间单位
                    "numberOfUnit": 1
                }
            }
        },
        'loc': {
            'x': 10,
            'y': 20,
            'w': 100,
            'h': 100
        }
    }

    # 模板，结构基本同一个诊断项，少了运行时状态
    Strategy_Template = {
        # 编号
        '_id': ObjectId('565558adf18a890a2448075b'),
        # 是否为组，0-否；1-是
        'isGroup': 1,
        # 属于哪个组，即父元素id
        'group': ObjectId(''),
        # 名称
        'name': '冷机1号供回水温度监测',
        # 描述
        'desc': '用神奇的高端洋气算法，对冷机1号初代机供回水温度越界问题进行监测，并发出报警',
        # 最后一次修改人
        'userId': 1,
        # 最后修改时间
        'lastTime': '2016-04-12 19:00:00',
        # 关键字，便于检索
        'keywords': ['冷机', '与非'],
        # 类型：0，诊断；1，KPI；2，计算点；
        'type': 0,
        # 策略详细配置
        'option': {}
    }

    Strategy_Template_Module = {  # 无模板引用的模块
        # 模块编号
        '_id': ObjectId('565558adf18a890a24411111'),
        # 属于哪个策略
        'strategyId': ObjectId(''),
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
                # id
                '_id': ObjectId(''),
                # 引用的模块 id
                'refModuleId': ObjectId(''),
                # 引用的变量的 id
                'refOutputId': ObjectId(''),
                # 变量名
                'name': 'point1',
                # 类型： 0，数据源；1，短信；2，邮件；10，数值；11，字符串；12，时间；13，JSON；100，引用其他模块
                'type': 0,
                # 默认值，用户未配置value时，或value不存在时，显示的默认值
                'default': 20,
                # 显示时的坐标信息
                'loc': {
                    'x': 10,
                    'y': 20
                },
                'option':{
                    # 数据源配置
                    'dataSource' :{
                        # 类型： 0，实时；1，历史；
                        'type': 0,
                        # 开始时间
                        'startTime': "2017-03-29 10:23",
                        # 结束时间
                        'endTime': "2017-03-30 10:23",
                        # 时间间隔m5/h1/d1
                        'timeFormat': "m5"
                    }
                }
            }],
            # 输出参数
            'output': [{
                '_id': ObjectId(''),
                'name': 'point1',
                'type': 10,
                # 暂不支持数据源配置
                # 'option': {
                #     # 数据源配置
                #     'dataSource': {
                #         # 类型： 0，实时；1，历史；
                #         'type': 0,
                #         # 开始时间
                #         'startTime': "2017-03-29 10:23",
                #         # 结束时间
                #         'endTime': "2017-03-30 10:23",
                #         # 时间间隔m5/h1/d1
                #         'timeFormat': "m5"
                #     }
                # }
            }],
            # 内容
            'content': {

            }
        },
        'loc': {
            'x': 10,
            'y': 20,
            'w': 100,
            'h': 100
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

    pass



a = None
b = get_realdata('@82|temp1')
c = get_realdata('@82|temp1')

def pre_main_1():
  return a
  

def main():
  if a > b :
    mailto(Golding)
  else:
    mailto(Neil)
  pass

def rt_al(parma, data):
  http.post('url', {param, data})
  pass;

pre_main_1()
main()
rt_al()
