#测试项目数据点是否正常
__author__ = 'kingsley'

import time
import datetime

import unittest
import urllib.request
import json
import urllib.request,http.cookiejar,re, sys
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app

urlGetReal = 'http://%s/get_realtimedata' % app.config['SERVERIP']
urlGetHistory = 'http://%s/get_history_data_padded' % app.config['SERVERIP']
urlGetReal_updatetime = 'http://%s/get_realtimedata_time' % app.config['SERVERIP']


class Smoke009(unittest.TestCase):
    testCaseID = 'Smoke009'
    projectName = '所有项目'
    buzName = '检测项目数据稳定性'

    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def checkProjectPoint(self,pointList,projectID,projectName,failID):

        historyValue=[]
        timeStart= time.time()-7200
        timeEnd = time.time()
        timeStartStr = time.strftime('%Y-%m-%d %H:00:00',time.localtime(timeStart))
        timeEndStr = time.strftime('%Y-%m-%d %H:00:00',time.localtime(timeEnd))
        dataOrig = dict(projectId=projectID, timeStart=timeStartStr, timeEnd=timeEndStr, timeFormat='h1', pointList=pointList)
        rv = BeopTools.getInstance().postJson(urlGetHistory, dataOrig)
        self.assertIsNotNone(rv, '%sget_history_data_padded接口查询OutdoorTdbin返回None'%projectName)
        self.assertGreater(len(rv),0, '%sget_history_data_padded接口查询OutdoorTdbin返回点值清单为空'%projectName)
        for item in rv:
            fname = item['name']
            hisdata = item['history']
            for hisitem in hisdata:
                iserror = hisitem['error']
                ptime = hisitem['time']
                value = hisitem['value']
                if (fname==pointList[0]):
                    historyValue.append(value)

            print ('%s查询%s获取的历史数据1为%s，历史数据2为%s，历史数据3为%s'%(projectName,pointList[0],historyValue[0],historyValue[1],historyValue[2]))
            if historyValue[0]==historyValue[1]==historyValue[2]:
                assert 0, ('fail,ID:%s,%s获取%s点的三个小时的历史数据点值相等，该项目数据传输可能中断。'%(failID,projectName,pointList[0]))
            else:
                print('success,%s数据稳定'%projectName)
        time.sleep(0.5)

    def kmwdstore(self):
        pointList = ["OutdoorTdbin"]
        projectID = 12
        projectName='昆明万达百货'
        failID='P004001'
        self.checkProjectPoint(pointList,projectID,projectName,failID)

    def kmwdhotel(self):
        pointList = ["OutdoorTdbin"]
        projectID = 10
        projectName='昆明万达酒店'
        failID='P004002'
        self.checkProjectPoint(pointList,projectID,projectName,failID)

    def kmbusiness(self):
        pointList = ["OutdoorTdbin"]
        projectID = 11
        projectName='昆明万达大商业'
        failID='P004003'
        self.checkProjectPoint(pointList,projectID,projectName,failID)

    def wdzzbh(self):
        pointList = ["OutdoorTdbin"]
        projectID = 5
        projectName='郑州万达百货'
        failID='P004004'
        self.checkProjectPoint(pointList,projectID,projectName,failID)


    def wdzzsy(self):

        pointList = ["PriChWFlow01"]
        projectID = 4
        projectName='郑州万达大商业'
        failID='P004005'
        self.checkProjectPoint(pointList,projectID,projectName,failID)

    def qdwdbusines(self):
        pointList = ["OutdoorTdbin"]
        projectID = 8
        projectName='青岛万达商业'
        failID='P004006'
        self.checkProjectPoint(pointList,projectID,projectName,failID)


    def panda(self):
        pointList = ["OutdoorTdbin"]
        projectID = 3
        projectName='南京熊猫电子'
        failID='P004007'
        self.checkProjectPoint(pointList,projectID,projectName,failID)

    def dajin(self):
        pointList = ["OutdoorTdbin"]
        projectID = 2
        projectName='深圳达进电子'
        failID='P004008'
        self.checkProjectPoint(pointList,projectID,projectName,failID)


    def HuarunHK(self):
        pointList = ["LLZ_EAST.SUPPLY_T"]
        projectID = 18
        projectName='香港华润'
        failID='P004009'
        self.checkProjectPoint(pointList,projectID,projectName,failID)

    def HuaweiPlant(self):
        pointList = ["Outdoor_Temp"]
        projectID = 17
        projectName='深圳华为'
        failID='P004010'
        self.checkProjectPoint(pointList,projectID,projectName,failID)

    def gubei(self):
        pointList = ["OutdoorTdbin"]
        projectID = 7
        projectName='古北国际金融'
        failID='P004011'
        self.checkProjectPoint(pointList,projectID,projectName,failID)

    def hddianwang(self):
        pointList = ["Outdoor_temp"]
        projectID = 15
        projectName='华东电网'
        failID='P004012'
        self.checkProjectPoint(pointList,projectID,projectName,failID)

    def zhongxin1qi(self):
        pointList = ["OutdoorTdbin"]
        projectID = 14
        projectName='中兴通讯1期'
        failID='P004013'
        self.checkProjectPoint(pointList,projectID,projectName,failID)

    def zhongxin2qi(self):
        pointList = ["OutdoorTdbin"]
        projectID = 13
        projectName='中兴通讯2期'
        failID='P004014'
        self.checkProjectPoint(pointList,projectID,projectName,failID)

    def hongli(self):
        pointList = ["Outdoor_Temp_UPPC"]
        projectID = 27
        projectName='宏利半导体'
        failID='P004015'
        self.checkProjectPoint(pointList,projectID,projectName,failID)

    def hsimc(self):
        pointList = ["OutdoorTdbin"]
        projectID = 1
        projectName='中芯国际'
        failID='P004016'
        self.checkProjectPoint(pointList,projectID,projectName,failID)

    def shhuaweiTR(self):
        pointList = ["OUTDOOR_TEMP"]
        projectID = 72
        projectName='上海华为特灵'
        failID='P004017'
        self.checkProjectPoint(pointList,projectID,projectName,failID)

    def shhuaweiHN1(self):
        pointList = ["A31AHU_A_41_TempSaIn"]
        projectID = 72
        projectName='上海华为霍尼1'
        failID='P004018'
        self.checkProjectPoint(pointList,projectID,projectName,failID)

    def shhuaweiHN2(self):

        pointList = ["A34AHU_A_44_TempSaIn"]
        projectID = 72
        projectName='上海华为霍尼2'
        failID='P004019'
        self.checkProjectPoint(pointList,projectID,projectName,failID)

    def shhuaweiHY(self):
        pointList = ["Ti1"]
        projectID = 72
        projectName='上海华为华源系统'
        failID='P004020'
        self.checkProjectPoint(pointList,projectID,projectName,failID)

    def SAIC_DLZC(self):
        pointList = ["AirConditionCoolWaterFlowDLZC01"]
        projectID = 19
        projectName='上汽工业'
        failID='P004021'
        self.checkProjectPoint(pointList,projectID,projectName,failID)

    def qdwdstore(self):
        pointList = ["OutdoorTdbin"]
        projectID = 6
        projectName='青岛万达百货'
        failID='P004022'
        self.checkProjectPoint(pointList,projectID,projectName,failID)

    #david 2016-03-23 temp add
    @classmethod
    def shhuawei_realdata_updatetime(self):
        pointList = ["HX101_HXSecSupplyT_01", "SHW_SecHWReturnT_12"]
        projId = 72
        projName = 'shhuawei'
        self.check_realdata_updatetime(projId, projName, pointList)

    @staticmethod
    def check_realdata_updatetime(projId, projName, pointList, timeout=10*60):
        '''
        :param projId:
        :param projName:
        :param pointList:
        :param timeout:
        :return: True if (datetime.now() - pointupdatetime) <= timeout else False
        '''
        try:
            data = {'proj':projId, 'pointList':pointList}
            time_now = datetime.datetime.now()
            rv = BeopTools.getInstance().postJson(urlGetReal_updatetime, data)
            if isinstance(rv, dict):
                for pname in rv.keys():
                    putime = datetime.datetime.strptime(rv.get(pname), '%Y-%m-%d %H:%M:%S')
                    tt = time_now - putime
                    if int(tt.days * 24 * 3600 + tt.seconds) <= timeout:
                        pass
                    else:
                        assert 0, ('proj:%s point:%s More than %s minutes not updated'%(projName, pname, timeout//60))
        except Exception as e:
            print('check_realdata_updatetime error:' + e.__str__())


    def tearDown(self):
        self.errors = []
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

