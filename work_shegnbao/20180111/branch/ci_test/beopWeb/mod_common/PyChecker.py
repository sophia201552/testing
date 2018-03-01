'''
检查python代码语法
通过编译python文件,但是不执行, 获得编译期语法错误
'''
__author__ = 'win7'

import py_compile
import os
import datetime

# 临时存放代码目录
__TEMP_CODE_PATH__ = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'temp')


def __make_tmp_file__():
    '''
    生成临时py文件

    '''
    return os.path.join(__TEMP_CODE_PATH__, str(datetime.datetime.now().timestamp())) + '.py'


def check_py_string(code):
    '''
    编译py文件,但是不执行, 从而获得编译期python语法错误

    :param code: py代码
    :return: 编译期python语法错误
    '''
    if not code:
        raise Exception('code is empty')
    os.makedirs(__TEMP_CODE_PATH__, exist_ok=True)
    tmp_file = __make_tmp_file__()
    while os.path.exists(tmp_file):
        tmp_file = __make_tmp_file__()

    with open(tmp_file, mode='w') as fp:
        fp.write(code)
    try:
        py_compile.compile(tmp_file, doraise=True)
    except py_compile.PyCompileError as e:
        raise Exception(e)
    finally:
        os.remove(tmp_file)


if __name__ == '__main__':
    code = '''def main():
        1  = d
        test = get_data_int('Accum_SCHWP1_RunHours')
        return calc_accumulate(72, 'Accum_SCHWP1_RunHours', 'freeze_pump_1_run', '2016-07-10 00:00:00','m5', 1/12.0)
    '''
    try:
        check_py_string(code)
    except Exception as e:
        print('compile error' + str(e))
