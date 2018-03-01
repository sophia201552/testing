''' 解析器入口 '''
import traceback
from .FactoryModule import factory
from .EnumBook import EnumModuleType
from .module import RETRACT_SIZE, INPUTS_RESULT_VAR_NAME

def parse(data, value_id=None, option=None):
    ''' 解析入口函数 '''
    option = {} if option is None else option
    try:
        return get_content(data, value_id, option)
    except Exception as expt:
        exec_exception_process(expt)

def exec_exception_process(expt):
    ''' 异常处理 '''
    print(expt)
    print(traceback.format_exc())

def generate_queue(dict_mod, mod_ids=None, arr_queue=None):
    ''' 生成模块处理队列 '''
    arr_queue = [] if arr_queue is None else arr_queue
    mod_ids = list(dict_mod.keys()) if mod_ids is None else mod_ids
    mod_ref_inputs_in_same_strategy = []

    arr_temp = []
    for key in dict_mod:
        if key in mod_ids:
            item = dict_mod[key]
            # 输入参数引用的所有模块，都不在剩余模块列表中
            mod_ref_inputs_in_same_strategy = list(filter(
                lambda input:
                input.refModuleId and input.refModuleId in mod_ids, item.arrInput
            ))
            # 为 0 说明是策略的直接输入
            if len(mod_ref_inputs_in_same_strategy) == 0:
                arr_temp.append(item)
    arr_queue.append(arr_temp)
    for item in arr_temp:
        mod_ids.remove(item._id)
    if len(mod_ids) > 0:
        return generate_queue(dict_mod, mod_ids, arr_queue)
    return arr_queue

def generate_traverse_queue_handler(queue):
    ''' 生成 遍历队列 的柯里化方法 '''
    def exec_fn(callback):
        ''' 具体的执行方法 '''
        for arr in queue:
            for mod in arr:
                callback(mod)
    return exec_fn

def exec_mod_parse(mod, option):
    ''' 执行模块解析，返回解析好的代码 '''
    return mod.parse(option)

def exec_output_after(mod):
    ''' 执行输出代码处理，返回处理后的代码 '''
    arr_code = []
    for output in mod.arrOutput:
        arr_code.append(output.after())
    return arr_code

def exec_get_result(mod):
    ''' 获取模块输出结果 '''
    return mod.getResultArray()

def should_ignore_module(mod):
    ''' 模块是否需要被忽略 '''
    mod_type = mod.get('type', '')
    if mod_type == EnumModuleType.HISTORICAL_CURVE.value or mod_type == EnumModuleType.TABLE.value\
        or mod_type == EnumModuleType.THREE_DIMENSIONS_VIEW.value:
        return True
    return False

# TODO: 处理输出过程中的@console, 注意调试、生产环境中的不同处理
# TODO: 策略的批量处理
# option = {
#     "mode": 1, 暂时不用
#     "dictValue": {}
# }
def get_content(data, value_id=None, option=None):
    ''' 获取生成的策略代码 '''
    option = {} if option == None else option
    dict_value = None
    dict_mod = {}

    # MAIN: 预处理模块内容
    mods = data.get("modules", [])

    # TODO: 多组数据的批处理
    # TODO: 特定组的调试
    # 初始化 value 字典
    arr_value = data.get("strategy", {}).get("value", [])
    for value in arr_value:
        if value.get('_id') == value_id:
            dict_value = value.get("list", {})
            break
    if dict_value is None:
        raise Exception('未找到指定的参数数组')

    # 初始化 module 字典
    for mod in mods:
        if should_ignore_module(mod):
            continue
        # 添加 dictValue 字段
        mod["dictValue"] = dict_value.get(mod.get("_id"), {})
        mod = factory.new(mod.get('type'))(mod)
        dict_mod[mod._id] = mod

    # MAIN: 排序处理队列
    arr_queue = generate_queue(dict_mod)

    # 拼接代码开始
    arr_code = ["def main():\n"]
    # 输入参数存放地
    arr_code.append(' ' * RETRACT_SIZE + INPUTS_RESULT_VAR_NAME + " = {}\n")

    # MAIN: 生成模块模块
    traverse_queue = generate_traverse_queue_handler(arr_queue)
    traverse_queue(lambda mod: arr_code.append(exec_mod_parse(mod, option)))

    # MAIN: 执行输出模块结尾附加操作，例，写入数据源等
    # TODO：合并处理
    traverse_queue(lambda mod: arr_code.extend(exec_output_after(mod)))

    # MAIN: 合成返回结果
    arr_result = []
    traverse_queue(lambda mod: arr_result.extend(exec_get_result(mod)))
    arr_result.pop()
    result = "{\"rs\": {" + "".join(arr_result) + "}, \"console\": {}, \"watch\": {}, \
\"input\": json.dumps("+ INPUTS_RESULT_VAR_NAME +")}"
    arr_code.append("    return " + result)

    # arrCode.append("\nmain()")
    str_code = "".join(filter(lambda str: str, arr_code))

    # 打印调试
    print(str_code)

    return str_code
