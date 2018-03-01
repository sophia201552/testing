''' 策略组态 控制器 '''
from enum import Enum
from flask import request, render_template, json
import requests
from beopWeb import app
from beopWeb.mod_strategyV2 import bp_strategyV2
from beopWeb.mod_strategyV2.service import StrategyService
from beopWeb.mod_admin.User import User
from beopWeb.mod_common.Utils import Encoder

LOG_TYPE = Enum('LogType', 'ADD MODIFY DELETE')

def format_result(is_success, msg='', data=None):
    ''' 格式化输出结果 '''
    result = None
    if is_success:
        result = {"status": 'OK'}
    else:
        result = {"status": 'ERROR'}
    if msg:
        result['msg'] = msg
    if data != None:
        result['data'] = data
    return json.dumps(result, cls=Encoder)

# 根据模块id，获取模块的数据信息
# REQUEST
# mid - 模块id
# RESPONSE
# {
#     # 编号
#     '_id': '565558adf18a890a2448075b',
#     # 模块属于哪个策略,
#     'strategyId': '565558adf18a890a24480752',
#     # 模块名称
#     'name': '冷机1号供回水温度监测',
#     # 模块类型
#     'type': '',
#     # 当前模块的所有输入模块
#     'inputs': ['其它模块的id', ...],
#     # 当前模块的所有输出模块
#     'outputs': ['其它模块的id', ...],
#     # 模块的配置信息，根据模块类型不同，这一块的数据结构也不同
#     'options': {},
#     # 横坐标
#     'x': 0,
#     # 纵坐标
#     'y': 0
# }
@bp_strategyV2.route('/module/get', methods=['GET'])
def module_get():
    module_id = request.args.get('mid')
    return format_result(True, '', None)

# 根据模块id，执行相应的模块并返回结果
# REQUEST
# mid - 模块id
# inputData - 
# {
#     series1: [],
#     series2: [],
#     ...
# }
# RESPONSE
# {
#     series1: [],
#     series2: [],
#     ...
# }
@bp_strategyV2.route('/module/run', methods=['POST'])
def module_run():
    params = request.get_json()
    module_id = params.get('mid')

    return format_result(True, '', None)

# 根据策略id，执行并返回结果 - 可第二期做
# REQUEST
# sid - 策略id
# inputData - 
# {
#     series1: [],
#     series2: [],
#     ...
# }
# RESPONSE
# {
#     series1: [],
#     series2: [],
#     ...
# }
@bp_strategyV2.route('/strategy/run', methods=['POST'])
def strategy_run():
    params = request.get_json()
    strategy_id = params.get('sid')

    return format_result(True, '', None)