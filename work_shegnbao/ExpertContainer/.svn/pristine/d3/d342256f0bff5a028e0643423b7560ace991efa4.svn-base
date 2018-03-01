''' 输入类参数基类 '''
from .ParamBase import ParamBase
from ..EnumBook import EnumParamType

class ParamInput(ParamBase):
    def __init__(self, data, module):
        ParamBase.__init__(self, data, module)
        self.refModuleId = data.get('refModuleId', '')
        self.refOutputId = data.get('refOutputId', '')
        self.debugValue = None

    def parse(self):
        #若有调试值，则优先使用
        if self.debugValue:
            return str(self.debugValue)
        if self.type == EnumParamType.STRING.value:
            return '\'' + self.getValue() + '\''
        return self.getValue()
