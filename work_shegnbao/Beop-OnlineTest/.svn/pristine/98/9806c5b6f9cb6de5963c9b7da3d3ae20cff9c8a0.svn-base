__author__ = 'woody'

from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import json
import time
import datetime
import unittest
import sys
# 项目ID,点名,项目名,dtu名称,引擎名称,是否判断掉线时间,持续时间
url = "http://%s/get_history_data_padded" % app.config['SERVICE_URL']
# test_url = "http://192.168.1.208:5006/get_history_data_padded"

# 错误的数据1-5
test_data_1 = {
    "projectId": None,
    "pointList": None,
    "timeStart": None,
    "timeEnd": None,
    "timeFormat": None
}

test_data_2 = {
    "projectId": 40000,
    "pointList": ['OutdoorTdbin'],
    "timeStart": "2016-06-08 15:15:00",
    "timeEnd": "2016-06-09 15:15:00",
    "timeFormat": 'm5'
}

test_data_3 = {
    "projectId": 1,
    "pointList": ['OutdoorTdbin'],
    "timeStart": "2016-06-08 15:15:00",
    "timeEnd": "2016-06-07 15:15:00",
    "timeFormat": 'm5'
}

test_data_4 = {
    "projectId": 1,
    "pointList": ['Outdooin'],
    "timeStart": "2016-06-08 15:15:00",
    "timeEnd": "2016-06-09 15:15:00",
    "timeFormat": 'm5'
}

test_data_5 = {
    "projectId": 1,
    "pointList": ['OutdoorTdbin'],
    "timeStart": "2016-06-08 15:15:00",
    "timeEnd": "2016-06-09 15:15:00",
    "timeFormat": 'm22'
}

test_data = []
test_data.append(test_data_1)
test_data.append(test_data_2)
test_data.append(test_data_3)
test_data.append(test_data_4)
test_data.append(test_data_5)

data = {
    "projectId": 1,
    "pointList": ['OutdoorTdbin'],
    "timeStart": "2016-07-08 15:15:00",
    "timeEnd": "2016-07-09 15:15:00",
    "timeFormat": 'm5'
}

data_correct = {
    "pointList": ["Ch003_ChRemoteMode_F", "Ch001_ChEvapPressure_F", "Ch003_ChCondAppT", "Ch003_ChOnOff",
                  "CWP004_PumpFlow",
                  "Ch003_ChStartupTime_01", "Ch003_ChStartupTime_02", "Ch003_ChOILSupplyT_F", "Ch001_ChEvapAppT",
                  "Ch001_ChOILSupplyP_F", "Ch002_ChEnterEvapTemp_F_rev", "CWPGroupTotal001_GroupPower",
                  "Ch003_ChCondPressure_F02", "Ch003_ChGasExhaustTemp_01", "Ch003_ChGasExhaustTemp_02",
                  "CWP004_Current",
                  "Ch003_ChStartupTime_F01", "Ch003_ChEvapSatuTemp_F", "CT011_CTOnOff", "Ch003_ChCondPressure_02",
                  "Plant001_Eff", "CHW001_ChWFlow", "Ch002_ChOILT_F", "Ch001_ChEvapSatuTemp_F",
                  "Ch002_ChGasExhaustTemp_F",
                  "CSRoom01_PAU0M0201_OAFanVSDCurrent", "CHWP002_PumpOnOff", "GKQ06_PAU0M0206_OAFanVSDCurrent",
                  "PDRoom_AHU0A0302_SAFanVSDCurrent", "CHWP003_Current", "CHWP004_PumpOnOff", "Ch002_ChLeaveEvapTemp",
                  "FXRoom02_PAU0M0202_OAFanVSDCurrent", "Ch002_ChEnterCondTemp_F_rev", "Ch002_ChOILP_F",
                  "Ch001_ChOILP_F",
                  "Ch003_ChLeaveEvapTemp", "Ch001_ChChWTempSupplySetPoint_F", "CT002_CTOnOff", "Ch001_ChCondSatuTemp_F",
                  "Ch003_ChCondSatuTemp_F", "Ch003_ChCondSatuTemp_01", "CHWPGroupTotal001_GroupPower",
                  "Ch003_ChGasSucTemp_02", "CT007_CTOnOff", "Ch003_ChGasSucTemp_01", "CWP002_PumpPower",
                  "Ch002_ChOILSupplyP_F", "Ch003_ChOnOff_F", "CHWP003_PumpPower", "Ch001_ChRfgSupplyT_F",
                  "CT006_CTOnOff",
                  "JSRoom07_PAU0M0207_OAFanVSDCurrent", "Ch003_ChAMPS_02", "Ch003_ChAMPS_01",
                  "F3_2Q_AHU_SAFanVSDCurrent",
                  "Ch001_ChLeaveEvapTemp", "CWP001_PumpFlow", "Ch003_ChEvapSatuTemp_02", "Ch003_ChErr_F",
                  "Ch003_ChEvapSatuTemp_01", "DDRoom05_PAU0M0205_OAFanVSDCurrent", "Ch003_ChMode_F",
                  "Ch003_ChEvapPressure_02", "Ch003_ChOILSupplyP_01", "Ch003_ChOILSupplyP_F", "Ch003_ChOILSupplyP_02",
                  "CWP001_Current", "CWP002_PumpOnOff", "Ch001_ChOILSupplyT_F", "CHWP002_PumpPower",
                  "Ch002_ChLeaveCondTemp", "Ch001_ChAMPS_F", "Ch002_ChRfgSupplyT_F", "Ch001_ChRemoteMode_F",
                  "Ch001_ChCondSatuTemp", "Ch003_ChOILSupplyT_01", "Ch002_ChCondSatuTemp",
                  "Ch001_ChLeaveEvapTemp_F_rev",
                  "CHW_ChWSupplyT", "CWP003_Current", "Ch002_ChCondPressure_F", "Ch003_ChLeaveEvapTemp_F_rev",
                  "Ch003_ChLeaveCondTemp", "Ch001_ChErr_F", "Ch003_ChAMPS_F02", "CHWP001_PumpFlow",
                  "CHWPGroupTotal001_GroupCost", "Ch003_ChOILP_F", "CHWP004_PumpPower", "Ch002_ChEvapSatuTemp",
                  "Ch003_ChRfgSupplyT_F", "Plant001_Load", "CHWP001_PumpOnOff", "Ch002_ChErr_F", "Ch001_ChAMPS",
                  "Ch001_ChLeaveCondTemp_F_rev", "Ch001_ChMode_F", "Ch003_ChOILP_01", "Ch003_ChCondSatuTemp_02",
                  "Ch003_ChOILP_02", "CT009_CTOnOff", "Ch002_ChLeaveEvapTemp_F_rev", "CHWP003_PumpFlow",
                  "CHWP004_Current",
                  "Ch003_ChCondSatuTemp", "DDRoom04_PAU0M0204_OAFanVSDCurrent", "Ch001_ChOILT_F",
                  "ChGroup001_GroupPower",
                  "Ch002_ChEvapSatuTemp_F", "Ch002_ChEvapPressure_F", "Plant001_GroupPower", "CWP004_PumpPower",
                  "CWP001_PumpOnOff", "CT010_CTOnOff", "CHWPGroupTotal001_RunNum", "F3_1Q_AHU0A0301_SAFanVSDCurrent",
                  "Ch002_ChRemoteMode_F", "CHW_ChWReturnT", "CHWP003_PumpOnOff", "CHWP004_PumpFlow", "CHWP002_Current",
                  "Ch003_ChCondPressure_01", "Ch002_ChGasSucTemp_F", "CWP001_PumpPower", "Ch002_ChLeaveCondTemp_F_rev",
                  "Ch003_ChGasExhaustTemp_F02", "Ch002_ChChWTempSupplySetPoint_F", "Ch003_ChPower", "Ch001_ChCondAppT",
                  "Ch003_ChOILT_F", "CT012_CTOnOff", "Ch001_ChGasExhaustTemp_F", "Ch001_ChCondPressure_F",
                  "CT003_CTOnOff",
                  "Ch001_ChEnterEvapTemp_F_rev", "Ch001_ChOnOff_F", "CHWP002_PumpFlow", "CT005_CTOnOff",
                  "Ch001_ChLeaveCondTemp", "Plant001_ElecPrice", "CHWP001_Current", "Ch003_ChChWTempSupplySetPoint_F",
                  "CT004_CTOnOff", "Ch002_ChAMPS", "Ch001_ChOnOff", "Ch002_ChOnOff_F", "HistoryTime", "Ch003_ChOILT_01",
                  "Ch003_ChOILT_02", "CWP004_PumpOnOff", "Ch003_ChRfgSupplyT_01", "Ch003_ChGasSucTemp_F02",
                  "CWP003_PumpFlow", "CWP002_Current", "HJRoom_PAU_OAFanVSDCurrent", "CT001_CTOnOff",
                  "Ch003_ChOILSupplyT_02", "Ch001_ChEnterCondTemp_F_rev", "Ch001_ChGasSucTemp_F",
                  "MHRoom03_PAU0M0203_OAFanVSDCurrent", "CWPGroupTotal001_GroupCost", "Ch003_ChRfgSupplyT_02",
                  "Ch001_ChPower", "Ch002_ChEvapAppT", "Ch002_ChOILSupplyT_F", "Ch003_ChEnterCondTemp_F_rev",
                  "Ch003_ChEvapAppT", "Ch002_ChPower", "Ch003_ChEvapPressure_01", "CHWP001_PumpPower",
                  "Ch003_ChEvapSatuTemp", "ChGroup001_GroupCost", "Ch003_ChSwitchCompressorR", "CWP002_PumpFlow",
                  "Ch002_ChMode_F", "Ch003_ChLeaveCondTemp_F_rev", "Ch003_ChEnterEvapTemp_F_rev",
                  "Ch003_ChEvapPressure_F02", "CWP003_PumpPower", "CWP003_PumpOnOff", "CT008_CTOnOff",
                  "Ch001_ChEvapSatuTemp", "Ch002_ChCondSatuTemp_F", "Ch002_ChCondAppT", "Ch002_ChAMPS_F",
                  "Ch002_ChOnOff"],
    "timeEnd": "2016-07-18 10:59:00", "timeStart": "2016-07-18 10:00:00", "TOKEN": "DataCalcProcess", "projectId": 96,
    "timeFormat": "h1"}


class Service001(unittest.TestCase):
    testCaseID = 'Service001'
    projectName = "BeopService"
    buzName = '历史数据接口get_history_data_padded'
    start = 0.0
    now = 0
    startTime = ""
    errors = []

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def writeLog(self, text):
        # logger = self.init_log()
        self.logger.info('[%s]---' % time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) + '' + text)

    def getTime(self):
        return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

    def Test(self):
        self.errors = []
        self.sendTrueJson(data)
        self.runInvaildFormat(test_data)
        self.raiseError(self.errors)

    def sendTrueJson(self, data):
        rv = None
        tool = BeopTools()
        try:
            rv = tool.postJsonToken(url=url, data=data, t=10)
            # print(rv)
        except Exception as e:
            print(e.__str__())
            self.writeLog(e.__str__())
            self.errors.append(
                "错误信息[%s]%s---发送Json数据%s请求%s接口失败!" % (self.getTime(), self.testCaseID, json.dumps(data), url))

        if rv:
            if isinstance(rv, list):
                if rv[0].get("name") in data['pointList'] and rv[0].get("history"):
                    print("发送json %s获取%s接口数据成功!" % (json.dumps(data), url))
                else:
                    self.errors.append("错误信息[%s]%s---发送Json %s请求%s接口失败,未返回点值!返回结果为%s!" % (
                    self.getTime(), self.testCaseID, json.dumps(data), url, json.dumps(rv)))
            elif isinstance(rv, dict):
                if rv.get("info") == "none":
                    self.errors.append("错误信息[%s]%s---发送Json %s请求%s接口失败,未返回点值!返回结果为%s!" % (
                    self.getTime(), self.testCaseID, json.dumps(data), url, json.dumps(rv)))
                else:
                    print("获取接口成功!")
            else:
                pass
        else:
            self.errors.append(
                "错误信息[%s]%s---发送Json %s请求%s接口失败!返回数据为空!" % (self.getTime(), self.testCaseID, json.dumps(data), url))
        try:
            rv = tool.postJsonToken(url=url, data=data_correct, t=10)
            if rv:
                if (rv[0]['history'][0]['time'] == "2016-07-18 10:00:00" and rv[0]['history'][0]['value']=='326.85'):
                    print('返回的时间是正确的')
                else:
                    self.errors.append(
                        "错误信息[%s]%s---发送Json数据%s请求%s接口,预期结果时间为:'2016-07-18 10:59:00',值为326.85,实际结果的时间为%s,值为%s!" % (
                            self.getTime(), self.testCaseID, json.dumps(data_correct), url,
                            rv[0]['history'][0]['time'],rv[0]['history'][0]['value']))
            else:
                except_result = [
                    {'history': [{'value': '326.85', 'error': False, 'time': '2016-07-18 10:00:00'}], 'std': 0.0,
                     'median': 326.85, 'name': 'CHW001_ChWFlow', 'avg': 326.85, 'min': 326.85, 'max': 326.85}]
                self.errors.append("错误信息[%s]%s---发送Json数据%s请求%s接口,预期返回结果类似%s,实际返回的结果为%s!" % (
                    self.getTime(), self.testCaseID, json.dumps(data_correct), url, str(except_result), str(rv)))
        except Exception as e:
            print(e.__str__())
            self.writeLog(e.__str__())
            self.errors.append("错误信息[%s]%s---发送Json数据%s请求%s接口出错,为%s!" % (
                self.getTime(), self.testCaseID, json.dumps(data_correct), url, e.__str__()))


    def runInvaildFormat(self, datas):
        # global errors
        rv = []
        tool = BeopTools()
        for data in datas:
            try:
                rv = tool.postJsonToken(url=url, data=data, t=10)
            except Exception as e:
                print(e.__str__())
                self.writeLog(e.__str__())
                if '200' not in e.__str__():
                    self.errors.append(
                        "错误信息[%s]%s---发送Json数据%s请求%s接口失败!" % (self.getTime(), self.testCaseID, json.dumps(data), url))
            if rv and isinstance(rv, list):
                if rv == []:
                    print("返回数据正确,test成功!")
                else:
                    if rv[0].get('error'):
                        print("返回数据正确,test成功!")
                    else:
                        self.errors.append("错误信息[%s]%s---发送错误Json: %s给%s返回的结果为%s." % (
                            self.getTime(), self.testCaseID, json.dumps(data), url, json.dumps(rv)))

    # 抛出异常函数
    def raiseError(self, error):
        if error != []:
            assert 0, "\n".join(error)

    def tearDown(self):
        self.errors = []
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Service001('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
