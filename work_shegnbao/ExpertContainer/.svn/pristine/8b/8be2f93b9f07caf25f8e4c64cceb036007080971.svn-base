
import sys

import resolver 

def createLegend(data):
    content = resolver.parse(data)
    return content

''' TODO:
    1. output.type与input.type类型不同，output是字符串型
    2. input/output._id, 考虑时间戳，数组、短
    3. type中区分数据源输入、输出
'''
# 模糊规则
testData = {
    "modules": [{ 
        "_id" : "14878544533172622165c820", 
        "strategyId" : "14878544324822625c640f5a", 
        "option" : {
            "input" : [
                {
                    "_id" : "1487854463435262bd3995c9", 
                    "name" : "a", 
                    "default" : "@293|L9S2_VAVC3_CtlTemp", 
                    "type":1,
                    'option':{
                        'check':0,
                        'enabled':1,
                        'min': 0,
                        'max': 100,
                        'terms':[{'check':False,'name':"rr",'type':"0",'points':[5,10,15]}]
                    }
                }, 
                {
                    "_id" : "148785447104026213353028", 
                    "name" : "b", 
                    "default" : "@293|L9S2_VAVC2_CtlTemp", 
                    "type":1,
                    'option':{
                        'check':0,
                        'enabled':1,
                        'min': 0,
                        'max': 100,
                        'terms':[{'check':False,'name':"rr",'type':"0",'points':[5,10,15]}]
                    }
                }
            ], 
            "content" : {
                "projId": 101,
                "rule" : '''
Engine: VAV
InputVariable: a
  enabled: true
  range: 0.000 1.000
  term: Off Triangle 0.000 0.000 0.500
  term: On Triangle 0.500 1.000 1.000
InputVariable: b
  enabled: true
  range: 0.000 1.000
  term: Cooling Triangle 0.000 0.000 0.500
  term: Heating Triangle 0.500 1.000 1.000
  term: Off Triangle 0.250 0.500 0.750
###############################################################################################################  
OutputVariable: c
  enabled: true
  range: 0.000 1.000
  accumulation: Maximum
  defuzzifier: Centroid 200
  default: 0.000
  lock-previous: false
  lock-range: false
  term: Small Gaussian 0.000 0.300
  term: Big Gaussian 1.000 0.300
RuleBlock: Rules
  enabled: true
  conjunction: Minimum
  disjunction: Maximum
  activation: Minimum
  rule: if a is On and b is not Cooling then c is Small
  rule: if a is On and b is not Heating then c is Big

                '''
            }, 
            "output" : [
                {
                    "_id" : "1487854481976262eabe1f31", 
                    "name" : "c", 
                    'type':31,
                    'option':{
                        'advise':"a",
                        'chart':[{'name':"@293|ChGroupTotal001_MaxChEvapAppT_va", 'type':"0"}],
                        'deputy':"kw",
                        'desc':"gjn",
                        'grade':1,
                        'name':"a",
                        'principal':"kw",
                        'title':"vx",
                        'troubleType':0
                    }
                }
            ]
        }, 
        "name" : "Python", 
        "desc" : "高大上的玩意儿，你猜是干嘛的", 
        "type" : 107
    }],
    "strategy":{
        "_id":"148817854970126289438543",
        "name":"test_big",
        "nodeId":"293",
        "status":0,
        "trigger":[],
        "type":0,
        "value":[{
            "_id":"1488178798793262a2dd0cbe",
            "list":{
                "14878544533172622165c820":{
                    "a":"@293|L9S2_VAVC3_CtlTemp",
                    "b":"@293|L9S2_VAVC1_CtlTemp"
                }
            },
            "name":"Aaaa"
        }]
    }
}




testData1 = {
    "modules": [{ 
        "_id" : "14878544533172622165c820", 
        "strategyId" : "14878544324822625c640f5a", 
        "option" : {
            "input" : [
                {
                    "_id" : "1487854463435262bd3995c9", 
                    "name" : "a", 
                    "default" : "@293|L9S2_VAVC3_CtlTemp", 
                    "type" : 0, 
                }, 
                {
                    "_id" : "148785447104026213353028", 
                    "name" : "b", 
                    "default" : "@293|L9S2_VAVC3_CtlTemp", 
                    "type" : 0, 
                }
            ], 
            "content" : {
                "code" : "c = a + b\nd = a - b\n"
            }, 
            "output" : [
                {
                    "_id" : "1487854481976262eabe1f31", 
                    "name" : "c", 
                    "type" : 30, 
                }, 
                {
                    "_id" : "148785450338626228e843b2", 
                    "name" : "d", 
                    "type" : 30, 
                }
            ]
        }, 
        "name" : "Python", 
        "desc" : "高大上的玩意儿，你猜是干嘛的", 
        "type" : 1
    },
    { 
        "_id" : "1487854454712262a5876048", 
        "strategyId" : "14878544324822625c640f5a", 
        "option" : {
            "input" : [
                {
                    "_id" : "14878545504862628ac24f9b", 
                    "name" : "e", 
                    "refOutputId" : "1487854520305262d3a76191", 
                    "default" : 0, 
                    "type" : 100, 
                    "refModuleId" : "14878544561502622de94756", 
                }, 
                {
                    "_id" : "14878545654552628d25f008", 
                    "name" : "c", 
                    "refOutputId" : "1487854481976262eabe1f31", 
                    "default" : 0, 
                    "type" : 100, 
                    "refModuleId" : "14878544533172622165c820", 
                }
            ], 
            "content" : {
                "code" : "f = e + c"
            }, 
            "output" : [
                {
                    "_id" : "1487854554437262196e5f6e", 
                    "name" : "f", 
                    "type" : 30, 
                }
            ]
        }, 
        "name" : "Python", 
        "desc" : "高大上的玩意儿，你猜是干嘛的", 
        "type" : 1
    },
    { 
        "_id" : "14878544561502622de94756", 
        "strategyId" : "14878544324822625c640f5a", 
        "option" : {
            "input" : [
                {
                    "_id" : "1487854515275262b8b44c4c", 
                    "name" : "d", 
                    "refOutputId" : "148785450338626228e843b2", 
                    "default" : 0, 
                    "type" : 100, 
                    "refModuleId" : "14878544533172622165c820", 
                }
            ], 
            "content" : {
                "code" : "e = 122\nb = 2\ne=d*e"
            }, 
            "output" : [
                {
                    "_id" : "1487854520305262d3a76191", 
                    "name" : "e", 
                    "type" : 30, 
                }
            ]
        }, 
        "name" : "Python", 
        "desc" : "高大上的玩意儿，你猜是干嘛的", 
        "type" : 1
    }],
    "strategy":{
        "_id":"148817854970126289438543",
        "name":"test_big",
        "nodeId":"293",
        "status":0,
        "trigger":[],
        "type":0,
        "value":[{
            "_id":"1488178798793262a2dd0cbe",
            "list":{
                "14878544533172622165c820":{
                    "a":"@293|L9S2_VAVC3_CtlTemp",
                    "b":"@293|L9S2_VAVC1_CtlTemp"
                },
                "14881785714842627c4c3c9b":{
                    "e":"@293|L9S1_VAVC6_CtlTemp"
                }
            },
            "name":"Aaaa"
        }]
    }
}

createLegend(testData)

# def main():
#     a = 0
#     b = 0
#     def m_0():
#         return a + b

#     output_m_0 = m_0()
#     c = output_m_0['c'] if 'c' in output_m_0 else output_m_0
#     def m_1():

#     output_m_1 = m_1()