from beopWeb.mod_factory import bp_factory
from beopWeb.BEOPDataAccess import *
from flask import request, url_for, redirect, render_template, json, jsonify
from datetime import datetime, timedelta
import time
from beopWeb.mod_memcache.RedisManager import RedisManager
import copy


def pretreatBeforeReturn(data=None, msg='', code=True):
    if code: code = 1
    else: code = 0
    return jsonify({
        'data': data,
        'code': code,
        'msg': msg,
    })


# 根据项目ID，获取该项目下策略概要信息列表
# return.data: [{
#         # 编号
#         '_id': '565558adf18a890a2448075b',
#         # tag节点Id,
#         'nodeId': '565558adf18a890a24480752',
#         # 名称
#         'name': '冷机1号供回水温度监测',
#         # 描述
#         'desc': '用神奇的高端洋气算法，对冷机1号初代机供回水温度越界问题进行监测，并发出报警',
#         # 修改人
#         'userId': 1,
#         # 最后修改时间
#         'lastTime': '2016-04-12 19:00:00',
#         # 关键字，便于检索
#         'keywords': ['冷机', '与非', ],
#         # 类型：0，诊断；1，KPI；2，计算点；
#         'type': 0,
#         # 运行间隔, 秒
#         'interval': 60,
#         # 最后运行时间
#         'lastRuntime': '2016-04-12 19:00:00',
#         # 状态： 0，未启用；1，启用；
#         'status': 0,
#     }]
@bp_factory.route('/strategy/item/getList/<projId>', methods=['GET'])
def getStrategyItemList(projId):
    rt = [{
        # 编号
        '_id': '565558adf18a890a2448075b',
        # tag节点Id,
        'nodeId': '565558adf18a890a24480752',
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
    }]

    return pretreatBeforeReturn({'data': rt})


# 根据策略ID，获取策略详情
# return.data: struct_DB_Strategy.Strategy_Item
@bp_factory.route('/strategy/item/get/<strategyId>', methods=['GET'])
def getStrategyItem(strategyId):
    rt = {
        # 编号
        '_id': '565558adf18a890a2448075b',
        # tag节点Id,
        'nodeId': '565558adf18a890a24480752',
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
                        'name': 'temp1',
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
            }]
        }
    }

    return pretreatBeforeReturn({'data': rt})


# 保存测略，有策略ID为Update，没有为Insert
# post.data: struct_DB_Strategy.Strategy_Item
@bp_factory.route('/strategy/item/save', methods=['POST'])
def saveStrategyItem():
    # 1、更新到数据库
    # 2、写入LOG
    return pretreatBeforeReturn({'_id': '565558adf18a890a2448075b'})


# 根据策略ID，删除策略
# post.data: null
@bp_factory.route('/strategy/item/remove/<strategyId>', methods=['POST'])
def removeStrategyItem(strategyId):
    # 1、更新到数据库
    # 2、写入LOG
    return pretreatBeforeReturn({'_id': '565558adf18a890a2448075b'})


# 根据诊断ID列表，批量设置设备启停状态，0停用，1启用
# postData: {'arrStrategyItem': ['565558adf18a890a2448075b', '565558adf18a890a2448075a', '565558adf18a890a2448075c'], 'status': 0}
@bp_factory.route('/strategy/item/setStatus', methods=['POST'])
def setStrategyItemsStatus():
    # 1、更新到数据库
    # 2、写入LOG
    return pretreatBeforeReturn({'status': True})


# 根据用户ID，获取模板概要信息列表
# return.data[{
#         # 编号
#         '_id': ObjectId('565558adf18a890a2448075b'),
#         # tag节点类型的Id,
#         'tagId': ObjectId('565558adf18a890a24480752'),
#         # 名称
#         'name': '冷机1号供回水温度监测',
#         # 描述
#         'desc': '用神奇的高端洋气算法，对冷机1号初代机供回水温度越界问题进行监测，并发出报警',
#         # 修改人
#         'userId': 1,
#         # 最后修改时间
#         'lastTime': '2016-04-12 19:00:00',
#         # 关键字，便于检索
#         'keywords': ['冷机', '与非'],
#         # 类型：0，诊断；1，KPI；2，计算点；
#         'type': 0,
#     }]
@bp_factory.route('/strategy/template/getList/<userId>', methods=['GET'])
def getStrategyTemplateList(userId):
    rt = [{
        # 编号
        '_id': '565558adf18a890a2448075b',
        # tag节点类型的Id,
        'tagId': '565558adf18a890a24480752',
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
    }]

    return pretreatBeforeReturn({'data': rt})


# 根据模板ID，获取模板详情
# return.data: struct_DB_Strategy.Strategy_Template
@bp_factory.route('/strategy/template/get/<templateId>', methods=['POST'])
def getStrategyTemplate(templateId):
    rt = {}

    return pretreatBeforeReturn({'data': rt})


# 保存模板，有ID为Update，没有为Insert
# post.data: struct_DB_Strategy.Strategy_Template
@bp_factory.route('/strategy/template/save', methods=['POST'])
def saveStrategyTemplate():
    # 1、更新到数据库
    # 2、写入LOG
    return pretreatBeforeReturn({'_id': '565558adf18a890a2448075b'})


# 根据模板ID，删除模板
# post.data: struct_DB_Strategy.Strategy_Template
@bp_factory.route('/strategy/template/remove/<templateId>', methods=['POST'])
def removeStrategyTemplate(templateId):
    # 1、更新到数据库
    # 2、写入LOG
    return pretreatBeforeReturn({'_id': '565558adf18a890a2448075b'})