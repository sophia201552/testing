''' 模糊规则模块 '''
import json
from .ModuleBase import ModuleBase
from ExpertContainer import app

class ModuleFuzzyRule(ModuleBase):
    """description of class"""

    # {
    #     "projectID": 101, # 项目
    #     "equipDict": { # 策略所有诊断块
    #         "diag1": {
    #             "occtimesCheck": 5, # 多少次诊断结果故障，报出错误
    #             "occtimes": 3, # 连续出故障多少次，默认首次传0，之后从接口返回值中拿到
    #             "algorithmType": "Fuzzylite",  # 算法类型（模糊规则）
    #             "algorithmName": "ruleName",  # 算法模块 id（唯一性），和 "userRule" 中的 key 对应
    #             "pointMap": {
    #                 "realPoint": "realPoint"  # 输入的数据源
    #             }
    #         }
    #     },
    #     "pointInfo": {
    #         "realPoint": {
    #             "pointType": 1,
    #             "seriesCheck": 1, # 0：不检查；1：检查
    #             "precision": 5, # 精度，相对精度/绝对精度（使用 % 进行区分）
    #             "maxValue": 10,  # 最大值
    #             "minValue": 0  # 最小值
    #         }
    #     },
    #     "hisdataDict": { # 序列检查数据个数，需要有地方进行配置
    #         # 当前时间往前推，5*n（n为序列检查数据个数），间隔m5
    #         "realPoint": [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10 ]
    #     },
    #     "rtdataDict": { # 所有点的实时值
    #         "realPoint": 9
    #     },
    #     "userRule": { # 配置的规则
    #         "ruleName": "Engine: ruleName\r\nInputVariable: realPoint\r\n  enabled: true\r\n  range: 0.000 10.000\r\n  term: Off Triangle 0.000 0.000 0.500\r\n  term: Big Triangle 0.500 10.000 10.000\r\n\r\nOutputVariable: fault\r\n  enabled: true\r\n  range: 0.000 1.000\r\n  accumulation: Maximum\r\n  defuzzifier: Centroid\r\n  default: 0.000\r\n  lock-previous: false\r\n  lock-range: false\r\n  term: Small Gaussian 0.000 0.300\r\n  term: Big Gaussian 1.000 0.300\r\n\r\n\r\nRuleBlock: Rules\r\n  enabled: true\r\n  conjunction: Minimum\r\n  disjunction: Maximum\r\n  activation: Minimum\r\n\r\n  rule: if realPoint is Big then fault is Big\r\n"
    #     }
    # }

    def __init__(self, data=None, option=None):
        ModuleBase.__init__(self, data, option)
        self.arrStrCode = []


    def fillPostData(self):
        dictPointMap = {}
        dictPointInfo = {}
        dictHisdataDict = {}
        dictRtdataDict = {}
        dictFormula = {}
        for input in self.arrInput:
            option = input.options
            name = input.name
            arr = input.getValue().split('|')
            value = arr[1] if len(arr) == 2 else arr[0]
            dictPointMap[name] = value
            if input.isFormula():
                dictFormula[name] = input.options.get('formulaConfig')
            dictPointInfo[value] = {
                "pointType": 1,
                "seriesCheck": 1,              # 0：不检查；1：检查
                "precision": option.get("precision", 2),
                "maxValue": option.get("max"),  # 最大值
                "minValue": option.get("min")  # 最小值
            }
            dictHisdataDict[value] = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10 ]
            dictRtdataDict[value] = "<%" + input.name + "%>"

        postData = {
            "projectID": self.content.get("projId"),
            "formulaDict": dictFormula,
            "equipDict": { },
            "pointInfo": dictPointInfo,
            "hisdataDict": dictHisdataDict,
            "rtdataDict": dictRtdataDict,
            "userRule": { # 配置的规则
                "ruleName": self.content.get("rule", "")
            }
        }

        postData["equipDict"][self.name] = {
            "occtimesCheck": 1, # 多少次诊断结果故障，报出错误
            "occtimes": 0, # 连续出故障多少次，默认首次传0，之后从接口返回值中拿到
            "algorithmType": "Fuzzylite",  # 算法类型（模糊规则）
            "algorithmName": "ruleName",  # 算法模块 id（唯一性），和 "userRule" 中的 key 对应
            "pointMap": dictPointMap
        }

        #将字符串替换为变量名，以便运行
        strPostData = json.dumps(postData)
        for input in self.arrInput:
            strPostData = strPostData.replace("\"<%" + input.name + "%>\"", input.name)

        return strPostData


    def createRequestCode(self):
        strRequest = """
>rt = ""
>headers = {"content-type": "application/json"}
>url = "http://""" + app.config.get("ALGOSVC2_ADDRESS") + """/diagnosisStrategy/diagnosis"
>import requests, json
>postData = "<%postData%>"
>res = requests.post(url, json.dumps(postData), headers=headers, timeout=60)
>if res.status_code == 200:
>    rt = res.text
>return rt"""

        return strRequest.replace("\"<%postData%>\"", self.fillPostData())


    def createBody(self):
        retract = self.getRetract(self.optionRetractLevel + 1)
        self.arrCode.append(retract)
        strCode = self.createRequestCode()
        strCode = strCode.replace("\n>", "\n" + retract)
        self.arrCode.append(strCode)
        self.arrCode.append("\n")


    def createFooter(self):
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

        self.arrCode.append(self.retract)
        self.arrCode.append("diag" + self._id + " = ")
        self.arrCode.append("fun" + self._id + "(")
        strTemp = "".join(arrMethodParamInput)
        if strTemp: self.arrCode.append(strTemp)
        self.arrCode.append(") \n")

    def getResultArray(self):
        arr = []
        arr.append("\"mod")
        arr.append(self._id)
        arr.append("\": diag")
        arr.append(self._id)
        arr.append(",")
        return arr