from .ParamInput import ParamInput

class ParamInputDatasource(ParamInput):
    def isFormula(self):
        return self.options.get('type') == 4

    def parse(self):
        if not self.refModuleId:
            #若有调试值，则优先使用
            if not self.debugValue is None:
                return str(self.debugValue)
            else:
                value = self.getValue()
                if value is None or value == 'None':
                    return 'None'
                    #raise Exception('参数 %s 没有赋值' % self.name)
                arr = value.replace('|', '@').split('@')
                return 'get_data(%s, "%s")'%(arr[1], arr[2])
