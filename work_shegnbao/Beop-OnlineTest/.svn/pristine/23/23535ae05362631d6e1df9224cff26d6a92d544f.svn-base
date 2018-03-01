__author__ = 'wuranxu'
import requests
from interfaceTest.Methods.BeopTools import *
import unittest, sys
from interfaceTest import app
from datetime import datetime
import json


serverip = app.config['SERVERIP']
realTimeUrl = "http://%s/get_realtimedata" % serverip
realTimeData = {"proj": 72,
                "pointList": ["freeze_pump_3_run", "freeze_pump_2_run", "freeze_pump_1_run", "glycol_pump_4_run",
                              "glycol_pump_3_run", "glycol_pump_6_run", "glycol_pump_5_run", "freeze_pump_3_run1",
                              "freeze_pump_2_run1", "freeze_pump_1_run1", "freeze_pump_3_run2", "freeze_pump_2_run2",
                              "freeze_pump_1_run2", "freeze_pump_2_run3", "glycol_pump_2_run", "glycol_pump_1_run",
                              "freeze_pump_1_run3", "IceTankpng3_svr", "IceTankpng4_svr", "ChOnOff01",
                              "freeze_pump_5_fault2", "freeze_pump_6_fault2", "ChOnOff02", "ChOnOff03", "ChOnOff04",
                              "ChOnOff05", "ChOnOff06", "ChOnOff07", "Ti12", "Ti15", "Ti19", "Ti7", "Ti13", "Ti11",
                              "Fi5", "Fi3", "Ti20", "Ti21", "Fi2", "Fi4", "Ti14", "SCHWP02_VSDFreq", "SCHWP04_VSDFreq",
                              "SCHWP05_VSDFreq", "SCHWP06_VSDFreq", "SCHWP07_VSDFreq", "SCHWP08_VSDFreq",
                              "SCHWP09_VSDFreq", "SCHWP10_VSDFreq", "SCHWP01_VSDFreq", "ICE_V2b_POSITION",
                              "ICE_V11_POSITION", "ICE_V8_POSITION", "Ti3", "Ti4", "ICE_V0_POSITION",
                              "ICE_V16_POSITION", "ICE_V7_POSITION", "Ti9", "ICE_V1a_POSITION", "ICE_V1b_POSITION",
                              "ICE_V5_POSITION", "ICE_V14_POSITION", "ICE_V10_POSITION", "ICE_V9_POSITION", "Fi1",
                              "Ti16", "Pi_P6", "ICE_V12_POSITION", "ICE_V13_POSITION", "Pi2", "ICE_V15_POSITION",
                              "Ti10", "Pi_P1", "Ti8", "SCHWP03_VSDFreq", "Ti5", "PCHWP03_VSDFreq", "PCHWP09_VSDFreq",
                              "Pi1", "Ti6", "Pi_P4", "Pi_P3", "ICE_V3_POSITION", "Fi4_instantaneous_ice",
                              "Fi3_instantaneous_ice", "Fi2_instantaneous_ice", "Ti23", "Ti36", "Ti1", "Ti2", "Ti22",
                              "Ti18", "ICE_V4_POSITION", "PCHWP02_VSDFreq", "Pi4", "Fi1_instantaneous_ice", "Ti17",
                              "SCHWP11_VSDFreq", "totel_ice", "ICE_V2a_POSITION", "PCHWP08_VSDFreq", "PCHWP01_VSDFreq",
                              "Fi5_instantaneous_ice", "IceTankRatio_svr", "Pi3", "PCHWPPower02_svr",
                              "PCHWPPower01_svr", "PCHWPPower04_svr", "PCHWPPower03_svr", "PCHWPPower09_svr",
                              "PCHWPPower08_svr", "SCHWPPower01_svr", "SCHWPPower02_svr", "SCHWPPower03_svr",
                              "SCHWPPower04_svr", "SCHWPPower05_svr", "SCHWPPower07_svr", "SCHWPPower08_svr",
                              "SCHWPPower09_svr", "SCHWPPower10_svr", "SCHWPPower11_svr", "ChPower01_svr",
                              "ChPower03_svr", "ChPower04_svr", "ChPower05_svr", "ChPower06_svr", "ChPower07_svr",
                              "ChPower02_svr", "PCHWP04_VSDFreq", "Pi_P2", "SCHWPPower06_svr"]}


class Smoke019(unittest.TestCase):
    testCaseID = 'Smoke019'
    projectName = '上海华为项目'
    buzName = '系统诊断页面实时数据接口'
    start = 0.0

    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))


    def Test(self):
        self.get_realtimedata()



    def get_realtimedata(self):
        a = BeopTools()
        value = a.postData(realTimeUrl,realTimeData, 10)
        if len(value) > 0:
            pass
        else:
            assert 0,"上海华为--系统诊断get_realtimedata接口返回数量为0"
        try:
            for i in range(len(value)):
                for key in value[i].keys():
                    if value[i][key] == None or value[i][key] == "":
                        assert 0,"上海华为--系统诊断get_realtimedata接口%s内容为空,请检查!" % value[i][key]
        except Exception as e:
            assert 0,"上海华为--系统诊断get_realtimedata接口查询失败，请检查!"

        print("ok")


    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())



if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Smoke019('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)