__author__ = 'kirry'
import datetime,time
from interfaceTest import app
from interfaceTest.Methods.BeopTools import BeopTools
import unittest


class Calc042(unittest.TestCase):
    testCaseID = 'Calc042'
    projectName = ""
    buzName = '测试每个项目的原始数据的历史数据是否掉线'
    now = 'None'
    errors = []
    url = "http://%s/get_history_data_padded" % app.config['SERVERIP']
    params = [
        #{'projectId':396,"point":["Accum_watermeter_lifeuse","instant_watermeter_lifeuse"]},
        {'projectId':421,"point":["CE_Ch002_ChLeaveCondTemp","CE_CTFan009_CTFanSpeed"]},
        {'projectId':395,"point":["B1F_HeatPump01_CHW_ReturnT","B1F_HeatPump01_Heating_TSet"]},
        {'projectId':190,"point":["!DDC-BUB-L00-02:Address","!DDC-HA-L01M-01A:BATT"]},
        {'projectId':316,"point":["10F_AHU001_RADamperPositionSet","10F_VAV001_VAVBoxAirFlow"]},
        {'projectId':374,"point":["Gas_900_02_accumulatedflow","Gas_901_02_instantaneousflow"]},
        {'projectId':128,"point":["AHU0C101_RAH","AHU0C104_RoomRH_02"]},
        {'projectId':218,"point":["AirCooler001_RoomT","ScrewRack001_RefDeviationValueSet"]},
        {'projectId':18,"point":["11F_AHU1.VOLUME_F","11F_AHU2_CO2"]},
        {'projectId':373,"point":["AverageLoad1","AverageLoadInt1"]},
        {'projectId':15,"point":["6F_LSJZ_2_VlvOn_CV","6F_LSJZ_4_VlvOnFK_CV"]},
        {'projectId':316,"point":["10F_AHU001_CCReturnT","10F_AHU001_SATSet"]},
        {'projectId':376,"point":["Aqu_SecCHW_ReturnT29","Aqu_SecHWP01_ElecUse"]},
        {'projectId':318,"point":["1089","1088"]},
        {'projectId':126,"point":["1F_AHU20101_CCValvePosition","1F_AHU20101_SAFanVSDFreq"]},
        {'projectId':284,"point":["DDC_11F_nvoIO1_ui3","DDC_16_nvoIO1_ui3"]},
        {'projectId':19,"point":["2#RoomRH01","4#RoomRH01"]},
        {'projectId':194,"point":["ChAmpLmtSetPointFeedback01","ChChWTempSupplyActiveSetPoint06R"]},
        {'projectId':364,"point":["10FL_EAFan001_CO","10FL_EAFan002_CO"]},
        {'projectId':179,"point":["10FL_EAFan002_CO","11FL_EAFan002_CO"]},
        {'projectId':90,"point":["AHU00101_CCValvePosition","AHU00101_RARH"]},
        {'projectId':120,"point":["1000025","1000051"]},
        {'projectId':72,"point":["A11AHU_A_11_VlvColdReg","A11AHU_A_21_VlvColdReg"]},
    ]

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startime = self.start-datetime.timedelta(minutes = 20)
    def Test(self):
        endtime = datetime.datetime.strftime(self.start,"%Y-%m-%d %H:%M")
        if int((endtime[-1:]))>=5:
            endtime =endtime[:-1]+"5:00"
        else:
            endtime =endtime[:-1]+"0:00"
        start = datetime.datetime.strftime(self.startime,"%Y-%m-%d %H:%M")
        if int((start[-1:]))>=5:
            start =start[:-1]+"5:00"
        else:
            start =start[:-1]+"0:00"
        for param in self.params:
            projectId = param["projectId"]
            point = param["point"]
            data = {"projectId":projectId,"pointList":point,
                    "timeStart":start,"timeEnd":endtime,
                    "timeFormat":"m5","prop":{}}
            self.checkpoint(self.url,data,time=15,projectId=projectId,point=point)
    def checkpoint(self,url,data,time,projectId,point):
        rv = False
        try:
            rv = BeopTools.postJsonToken(url,data,t=time)
        except Exception as e:
            print(e.__str__())
            self.errors.append("请求接口%s超时，超时时间为15s"%url)
        if isinstance(rv,list) and rv:
            for index,r in enumerate(rv):
                r = r.get("history",False)
                if r:
                    if r.__len__() >0:
                        print("原始数据的历史数据更新中！")
                    else:
                        self.errors.append("项目%s原始点%s的历史数据掉线！"%(projectId,point[index]))
        BeopTools.raiseError(self.errors,self.testCaseID)
    def tearDown(self):
        self.offline = False
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Calc042('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
