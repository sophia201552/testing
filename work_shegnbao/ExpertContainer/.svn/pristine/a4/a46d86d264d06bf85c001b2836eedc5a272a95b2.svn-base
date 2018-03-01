''' 模块基类 '''
import re
from .param import factory
from . import RETRACT_SIZE, INPUTS_RESULT_VAR_NAME
import json

class ModuleBase(object):
    ''' 模块基类 '''

    def __init__(self, data=None, option=None):
        #数据
        self.store = data
        self._id = None
        self.name = None
        self.option = option
        self.arrInput = None
        self.arrOutput = None
        self.content = None
        self.dictValue = None

        #代码拼接
        self.arrCode = None
        self.retract = None #代码所需的缩进，快捷方式
        self.arrResult = []

        #配置
        self.optionRetractLevel = 1 #代码缩进级别，每+1表示多两个空格

        # 0:生产 1：调试
        self.runningOption = {}

        self.breakdownData()

    def breakdownData(self):
        ''' 初始化类参数 '''
        option = self.store.get("option", {})

        self._id = self.store.get('_id', "")
        self.name = self.store.get('name', "")
        self.content = option.get('content', [])
        self.dictValue = self.store.get("dictValue")

        self.arrInput, self.arrOutput = [], []
        arr_org_input = option.get('input', [])

        for item in arr_org_input:
            item["value"] = self.dictValue.get(item['_id'], "")
            entity = factory.new(item.get("type"))(item, self)
            self.arrInput.append(entity)
        arr_org_output = option.get('output', [])
        for item in arr_org_output:
            self.arrOutput.append(factory.new(item.get("type"))(item))

    def parse(self, option=None):
        ''' 转译方法，转译代码块分为header、body、footer三个部分，方便重用、复写 '''
        option = {} if option is None else option
        if option:
            self.runningOption = option
        self.arrCode = []
        self.retract = self.getRetract()

        #调试输入值，赋值
        dict_debugger = self.runningOption.get("dictDebugger", {})
        for item in self.arrInput:
            value = dict_debugger.get(item._id)
            if not value is None:
                item.debugValue = value

        self.createHeader()
        self.createBody()
        self.createFooter()
        return ''.join(self.arrCode)

    def createHeaderPrivateParams(self):
        ''' 创建模块头部私有变量代码 '''
        # 私有变量赋值, TODO: 合并请求
        arrPrivate = list(filter(lambda input: not input.refModuleId, self.arrInput))
        arrVar, arrRequest = [], []
        i, length = 0, len(list(arrPrivate))

        if length == 0:
            return

        strCode = self.content.get("code", '')
        input_map = {}
        while i < length:
            input = arrPrivate[i]
            #若参数没有被使用, 并且被使用的参数都不是该参数的反射应用, 则插入取值请求
            # print(re.findall("[\s([,]" + input.name + "[\$\s)\],]", strCode + ' '))
            # countNameExist = len(re.findall("[\s([,]" + input.name + "[\$\s)\],]", strCode + ' '))
            arrVar.append(input.name)
            input.value = self.dictValue.get(input._id, "")
            arrRequest.append(input.parse())
            input_map[input._id] = input.name
            if i < length - 1:
                arrVar.append(",")
                arrRequest.append(",")
            i += 1
        str_temp = "".join(arrVar)
        if str_temp:
            self.arrCode.append(self.getRetract(self.optionRetractLevel + 1))
            self.arrCode.append(str_temp)
            self.arrCode.append(" = ")
            str_temp = "".join(arrRequest)
            self.arrCode.append(str_temp)
            self.arrCode.append("\n")

        # 将私有的输入参数放入数组中，以便最后进行输出
        self.arrCode.append(self.getRetract(self.optionRetractLevel + 1))
        self.arrCode.append(INPUTS_RESULT_VAR_NAME + '.update({\n')
        code_arr = []
        retract = self.getRetract(self.optionRetractLevel + 2)
        for key, value in input_map.items():
            code_arr.append(retract + '"%s": %s' % (key, value))
        self.arrCode.append(',\n'.join(code_arr))
        self.arrCode.append('\n' + self.getRetract(self.optionRetractLevel + 1) + '})\n')

    def createHeader(self):
        ''' 创建模块代码头部 '''
        # 用户不应自行书写 main函数
        # 生成 def funXXXX(a, b):
        # 方法名funXXXX: fun + mod._id
        # 参数: input.name
        arr_public = list(filter(lambda input: input.refModuleId, self.arrInput))
        self.arrCode.append(self.retract + "def fun" + self._id + "(")
        arr_method_param_input_name = []
        i, length = 0, len(list(arr_public))
        while i < length:
            input_public = arr_public[i]
            arr_method_param_input_name.append(input_public.name)
            if i < length - 1:
                arr_method_param_input_name.append(",")
            i += 1
        str_temp = "".join(arr_method_param_input_name)
        if str_temp: self.arrCode.append(str_temp)
        self.arrCode.append("): \n")

        self.createHeaderPrivateParams()

    def createBody(self):
        ''' 创建模块代码主体 '''
        retract = self.getRetract(self.optionRetractLevel + 1)
        strCode = self.content.get("code")
        if not strCode: return
        self.arrCode.append(retract)
        strCode = strCode.replace("\n", "\n" + retract)

        # 处理输入输出参数的反射 例.@name .@dsnam
        arrAtParam = re.findall('[\s([,]\w+[.][@].*name', strCode)
        if len(arrAtParam):
            for item in arrAtParam:
                item = item.strip()
                paramName, paramAttr = item.split('.@')
                for input in self.arrInput + self.arrOutput:
                    if input.name == paramName:
                        newStrn = ''
                        if paramAttr == 'name':
                            newStr = input.name
                        elif paramAttr == 'dsname':
                            newStr = input.getDatasourceName()
                        strCode = strCode.replace(item, '"' + newStr + '"')

        # TODO: 高效遍历
        # 处理@console

        # 处理@debugger
        # TODO：断点细致处理, 例显示当前时刻变量等
        strCode.replace("@debugger", "raise Exception(\"此路是我开，此树是我栽。要从门前过，打断点做毛？\")")

        # 处理@watch

        self.arrCode.append(strCode)
        self.arrCode.append("\n")


    def createFooter(self):
        ''' 创建模块代码尾部 '''
        # 用户在编写python模块时，不应自己书写main函数的return， 但可支持子函数return
        # return c, d
        # c、d 均为输出参数， 注意参数顺序
        self.arrCode.append(self.getRetract(self.optionRetractLevel + 1) + "return ")
        arrValue, arrPublicId = [], []
        i, length = 0, len(self.arrOutput)
        while i < length:
            output = self.arrOutput[i]
            if output.isPassed:
                arrValue.append(output.name)
                arrPublicId.append("var" + output._id)
                self.arrResult.append(output._id)
                if i < length - 1:
                    arrValue.append(",")
                    arrPublicId.append(",")
            i += 1
        strTemp = "".join(arrValue)
        if strTemp: self.arrCode.append(strTemp)
        self.arrCode.append(" \n")

        self.arrCode.append(self.retract)
        # 若有外部变量引用该模块返回值，则先赋值
        arrPublic = list(filter(lambda input: input.refModuleId, self.arrInput))
        arrMethodParamInput = []
        i, length = 0, len(list(arrPublic))
        while i < length:
            inputPublic = arrPublic[i]
            arrMethodParamInput.append("var" + inputPublic._id)
            if i < length - 1:
                arrMethodParamInput.append(",")
            i += 1
        strTemp = "".join(arrPublicId)
        if strTemp: self.arrCode.append(strTemp + " = ")

        # 方法执行 funXXXX(varOOOO), funXXXX()
        self.arrCode.append("fun" + self._id + "(")
        strTemp = "".join(arrMethodParamInput)
        if strTemp: self.arrCode.append(strTemp)
        self.arrCode.append(") \n")


    def getResultArray(self):
        ''' 获取结果数组 '''
        arr = []
        for result in self.arrResult:
            arr.append("\"")
            arr.append(result)
            arr.append("\": var")
            arr.append(result)
            arr.append(",")
        return arr


    def getRetract(self, level = None):
        ''' 获取缩进 '''
        arrRetract = []
        if not level:
            level = self.optionRetractLevel
        while level > 0:
            arrRetract.append(' '*RETRACT_SIZE)
            level -= 1
        return ''.join(arrRetract)


    #执行过程中事件，例：@debugger, @console等
    def execEventInProcess(self, type, message):
        pass
