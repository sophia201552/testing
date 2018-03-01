''' 参数基类 '''

class ParamBase(object):
    ''' 参数基类 '''
    def __init__(self, data, module=None):
        self._id = data.get('_id', '')
        self.name = data.get('name', '')
        self.type = data.get('type', '')
        self.default = data.get('default', '')
        self.value = data.get('value', '')
        self.options = data.get('option', {})
        self.module = module

        self.optionRetract = "    "

    def parse(self):
        return self.getValue()

    def after(self): pass

    def getDatasourceName(self): 
        return self.value.split('|')[1]

    def getValue(self):
        value = ""
        if self.value: 
            value = self.value
        elif self.default:
            value = self.default
        else:
            raise Exception("输入参数\"" + self.name + "\"未被配置")
        return str(value)

    def getOptions(self):
        return self.options
