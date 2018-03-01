''' 策略组态枚举类 '''
from enum import Enum

class EnumParamType(Enum):
    ''' 策略输入输出类型 '''
    INPUT_DATA_SOURCE = 0
    INPUT_DIAGNOSIS_FUZZYRULE = 1
    EMAIL = 2
    INPUT_HISTORY_DATA_SOURCE = 3
    NUMBER = 10
    STRING = 11
    TIME = 12
    JSON = 13
    MESSAGE = 14
    INPUT_REF = 100

    OUTPUT_DATA_SOURCE = 30
    OUTPUT_DIAGNOSIS = 31
