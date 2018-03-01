__author__ = 'woody'
import requests
from interfaceTest.Methods.BeopTools import *
import unittest, sys
from interfaceTest import app
from datetime import datetime
import json


karry = {"proj": 77,"pointList": ["SCHW001_SecChWSupplyT", "SCHW002_SecChWSupplyT","OUTDOOR_TEMP","OUTDOOR_HUMIDITY" ]}
hospital = {"proj": 102,"pointList": ["OutdoorDryBulbT", "CHW001_ChWDP", "AHU00501_RAH", "AHU006W_RAH"]}
trade = {"proj": 80,"pointList": ["01BF_Boiler001_SupplyT", "02BF_HX015_HXSecReturnT", "16F_Z02FPTU0008_SpaceTemp", "02BF_CO_15"]}
cinema = {"proj": 94,"pointList": ["OutdoorTdbin","OutdoorWetTemp","PriChWTempReturn01","CWTempReturn"]}
star = {"proj": 84,"pointList": ["Business_CWReturnT","Office_CWReturnT","Plant001_GroupPower","Business_ChWSupplyT"]}
#sf10 = {"proj":73,"pointList": []}
sf1 = {"proj":90,"pointList": ["AHU00101_RAT","AHU00103_RARH","CHW_ChWReturnT","CW_CWReturnT"]}
colgate = {"proj":100,"pointList":["TB1_SCHW001_SecChWSupplyT","CW001_CWReturnT","CBDOffice_OAFan001_SAT","Plant001_GroupPower"]}
time8 = {"proj": 83,"pointList":["C6002_points_HotTemp","C6002_points_RTemp","C6004_points_nvoNVBT_HW","C6004_points_nvoNVBT_HW"]}
jiangyin = {"proj": 96,"pointList":["CHW_ChWSupplyT","CHW_ChWReturnT","CHW_ChWSupplyP","CTS_CWReturnT"]}
shangqi = {"proj": 19,"pointList":["AHUAirTSupplyDLZC17","AHUAirRHSupplyDLZC17","AHUAirTReturnDLZC07","AHUAirRHReturnDLZC07"]}
time1 = {"proj": 81,"pointList":["Ch_ChWSupplyT01","CT_CWReturnT","CT_CWSupplyT","RF_CT001_CWSupplyT"]}
shHuawei = {"proj":72,"pointList":["OUTDOOR_TEMP","A13AHU_A_23_TempSaIn","A31AHU_A_51_TempSaIn","SHW_SecHWSupplyT_09"]}
szHuawei = {"proj":17,"pointList":["Outdoor_Temp","Outdoor_WebTemp","ChChWTempSupplySetPoint02","ChChWTempSupplySetPoint01"]}
huarun = {"proj":18,"pointList":["SupplyCW_T_CH2","SupplyCW_T_CH13","SupplyCW_T_CH8","SupplyCW_T_CH7"]}






#静安嘉里
karryPoint = ["SCHW001_SecChWSupplyT","SCHW002_SecChWSupplyT","SCHW003_SecChWSupplyP","SCHW004_SecChWSupplyP"]
karryProj = {"proj": 77,"projName":"静安嘉里"}
#妇产科医院
hospitalPoint = ["OutdoorDryBulbT", "CHW001_ChWDP", "AHU00501_RAH", "AHU006W_RAH"]
hospitalProj = {"proj": 102,"projName":"杭州妇产科医院"}
#世纪商贸
tradePoint = ["01BF_Boiler001_SupplyT", "02BF_HX015_HXSecReturnT", "16F_Z02FPTU0008_SpaceTemp", "02BF_CO_15"]
tradeProj =  {"proj": 80,"projName":"世纪商贸"}
#玉兰大剧院
cinemaPoint = ["OutdoorTdbin","OutdoorWetTemp","PriChWTempReturn01","CWTempReturn"]
cinemaProj = {"proj": 94,"projName":"玉兰大剧院"}
#深圳星河发展中心
starPoint = ["Business_CWReturnT","Office_CWReturnT","Plant001_GroupPower","Business_ChWSupplyT"]
starProj = {"proj": 84,"projName":"深圳星河发展中心"}
'''#顺风光电10号厂房
sf10Point = []
sf10Proj = {"proj": 73,"projName":"顺风光电10号厂房"}'''
#顺风光电1号厂房
sf1Point = ["AHU00101_RAT","AHU00103_RARH","CHW_CHWReturnT","CW_CWReturnT"]
sf1Proj = {"proj": 90,"projName":"顺风光电1号厂房"}
#扬州高露洁
colgatePoint = ["TB1_SCHW001_SecChWSupplyT","CW001_CWReturnT","CBDOffice_OAFan001_SAT","Plant001_GroupPower"]
colgateProj = {"proj": 100,"projName":"扬州高露洁"}
#成都时代8号
time8Point = ["C6002_points_HotTemp","C6002_points_RTEMP","C6004_points_nvonVST_HW","C6004_points_nvonVBT_HW"]
time8Proj = {"proj": 83,"projName":"成都时代广场8号"}
#江阴长电
jiangyinPoint = ["CHW_CHWsupplyT","CHW_CHWReturnT","CHW_CHWSupplyP","CTS_CWReturnT"]
jiangyinProj = {"proj": 96,"projName":"江阴长电"}
#安亭上汽
shangqiPoint = ["AHUairTsupplyDLZC17","AHUairRHsupplyDLZC17","AHUairTreturnDLZC07","AHUairRHreturnDLZC07"]
shangqiProj = {"proj": 19,"projName":"安亭上汽"}
#成都时代1号
time1Point = ["ch_CHWsupplyT01","CT_CWReturnT","CT_CWSupplyT","RF_CT001_CWSupplyT"]
time1Proj = {"proj": 81,"projName":"成都时代广场1号"}
#上海华为
shHuaweiPoint = ["OUTDOOR_TEMP"]
shHuaweiProj = {"proj":72,"projName":"上海华为"}




data_proj = []
data_proj.append(karry)
data_proj.append(hospital)
data_proj.append(trade)
data_proj.append(star)
data_proj.append(colgate)
data_proj.append(time8)
data_proj.append(shangqi)
data_proj.append(jiangyin)
data_proj.append(sf1)
data_proj.append(cinema)
data_proj.append(time1)
data_proj.append(shHuawei)
data_proj.append(huarun)
data_proj.append(szHuawei)


serverip = app.config['SERVERIP']
url = "http://" + serverip + "/get_realtimedata"
url_his = 'http://%s/get_history_data_padded' % serverip
class Smoke022(unittest.TestCase):
    testCaseID = 'Smoke022'
    projectName = '不选择项目'
    buzName = '重要项目实时/历史数据监测'
    start = 0.0

    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        for data in data_proj:
            self.get_now_data(data)








        '''#静安嘉里
        self.checkNewestData(name=karryProj["projName"],projectID=karryProj['proj'],pointList=karryPoint)
        self.checkHistoryData(name=karryProj["projName"],projectID=karryProj['proj'],pointList=karryPoint)
        #杭州妇产科医院
        self.checkNewestData(name=hospitalProj["projName"],projectID=hospitalProj['proj'],pointList=hospitalPoint)
        self.checkHistoryData(name=hospitalProj["projName"],projectID=hospitalProj['proj'],pointList=hospitalPoint)
        #世纪商贸
        self.checkNewestData(name=tradeProj["projName"],projectID=tradeProj['proj'],pointList=tradePoint)
        self.checkHistoryData(name=tradeProj["projName"],projectID=tradeProj['proj'],pointList=tradePoint)
        #玉兰大剧院
        self.checkNewestData(name=cinemaProj["projName"],projectID=cinemaProj['proj'],pointList=cinemaPoint)
        self.checkHistoryData(name=cinemaProj["projName"],projectID=cinemaProj['proj'],pointList=cinemaPoint)
        #深圳星河
        self.checkNewestData(name=starProj["projName"],projectID=starProj['proj'],pointList=starPoint)
        self.checkHistoryData(name=starProj["projName"],projectID=starProj['proj'],pointList=starPoint)
        #扬州高露洁
        self.checkNewestData(name=colgateProj["projName"],projectID=colgateProj['proj'],pointList=colgatePoint)
        self.checkHistoryData(name=colgateProj["projName"],projectID=colgateProj['proj'],pointList=colgatePoint)
        #成都时代广场8号
        self.checkNewestData(name=time8Proj["projName"],projectID=time8Proj['proj'],pointList=time8Point)
        self.checkHistoryData(name=time8Proj["projName"],projectID=time8Proj['proj'],pointList=time8Point)
        #顺风光电1号
        self.checkNewestData(name=sf1Proj["projName"],projectID=sf1Proj['proj'],pointList=sf1Point)
        self.checkHistoryData(name=sf1Proj["projName"],projectID=sf1Proj['proj'],pointList=sf1Point)
        #江阴长电
        self.checkNewestData(name=jiangyinProj["projName"],projectID=jiangyinProj['proj'],pointList=jiangyinPoint)
        self.checkHistoryData(name=jiangyinProj["projName"],projectID=jiangyinProj['proj'],pointList=jiangyinPoint)
        #成都时代广场1号
        self.checkNewestData(name=time1Proj["projName"],projectID=time1Proj['proj'],pointList=time1Point)
        self.checkHistoryData(name=time1Proj["projName"],projectID=time1Proj['proj'],pointList=time1Point)
        #安亭上汽
        #self.checkNewestData(name=shangqiProj["projName"],projectID=shangqiProj['proj'],pointList=shangqiPoint)
        self.checkHistoryData(name=shangqiProj["projName"],projectID=shangqiProj['proj'],pointList=shangqiPoint)


        self.checkNewestData(name=shHuaweiProj["projName"],projectID=shHuaweiProj['proj'],pointList=shHuaweiPoint)
        self.checkHistoryData(name=shHuaweiProj["projName"],projectID=shHuaweiProj['proj'],pointList=shHuaweiPoint)'''


    def get_now_data(self,data):
        a = BeopTools()
        value = a.postData(url,data=data,t=10)
        try:
            for x in value:
                for key in x.keys():
                    if key == "value":
                        if x.get(key) == None or x.get(key) == "":
                            assert 0,"项目id为%s的%s实时数据为空!" % (data["proj"],x.get("name"))
                            #print("项目id为%s的%s实时数据为空!" % (data["proj"],x.get("name")))
                        else:
                            print(str(data["proj"]) +"--" + x["name"] + "实时数据值:" + x["value"])
        except Exception as e:
            print(e.__str__())
            if "为空" in e.__str__():
                assert 0,e
            else:
                assert 0,"项目id为%s获取实时数据失败!" % data["proj"]

    def checkNewestData(self,name,projectID,pointList):
        #获取10-15分钟之前的数据
        start = time.time() - 1500
        end = time.time() - 1200
        startTime = time.strftime('%Y-%m-%d %H:%M:00',time.localtime(start))
        endTime = time.strftime('%Y-%m-%d %H:%M:00',time.localtime(end))
        data = dict(projectId=projectID, timeStart=startTime, timeEnd=endTime, timeFormat='m1', pointList=pointList)
        rv = BeopTools.getInstance().postData(url_his, data)
        #比较返回数据点个数
        resultData = []

        try:
            for item in rv:
                projName = item['name']
                resultData.append(projName)
                for l in item["history"]:
                    if l["value"] == None or l["value"] == "":
                        assert 0,"%s项目--%s数据点--%s数据为空!"  % (name,projName,l['time'])


        except Exception as e:
            print(e.__str__())
            assert 0,"%s项目获取20-25分钟前数据异常!提示无历史数据!" % name
        for i in range(len(rv)):
            value = rv[i]["history"][0]["value"]
            l = []
            l2 = []
            m = len(rv[i]["history"])
            for x in range(m):
                l.append(rv[i]["history"][x]["value"])
            for j in l:
                if j not in l2:
                    l2.append(j)
            if len(l2) == 1:
                assert 0,"%s项目--%s数据点--最近20-25分钟数据重复，均为%s!"  % (name,rv[i]['name'],value)





        try:
            for p in pointList:
                if p in resultData:
                    pass
                else:
                    assert 0,"%s项目中的%s点没有获取到20-25分钟之前的数据!" % (name,p)
                    #print("%s项目中的%s点没有获取到5-10分钟之前的数据!" % (name,p))
        except Exception as e:
            assert 0,"%s项目获取20-25分钟前数据异常!" % name

    def checkHistoryData(self,name,projectID,pointList):
        #获取3小时之前的分钟和小时数据，看有无遗漏
        start = time.time() - 7200
        end = time.time()
        startTime = time.strftime('%Y-%m-%d %H:00:00',time.localtime(start))
        endTime = time.strftime('%Y-%m-%d %H:00:00',time.localtime(end))
        dataM = dict(projectId=projectID, timeStart=startTime, timeEnd=endTime, timeFormat='m1', pointList=pointList)
        dataH = dict(projectId=projectID, timeStart=startTime, timeEnd=endTime, timeFormat='h1', pointList=pointList)
        rvM = BeopTools.getInstance().postData(url_his, dataM)
        rvH = BeopTools.getInstance().postData(url_his, dataH)

        resultDataM = []
        resultDataH = []
        try:
            for item in rvM:
                projName = item.get("name")
                resultDataM.append(projName)
                for l in item["history"]:
                    if l["value"] == None or l["value"] == "":
                        assert 0,"%s项目--%s数据点--%s数据为空!"  % (name,projName,l['time'])
                    else:
                        #print("%s项目--%s数据点--%s数据获取成功!"  % (name,projName,l['time']))
                        pass
        except Exception as e:
            print(e.__str__())
            #assert 0, "%s项目获取三小时内分钟数据异常!" % name
            print("%s项目获取三小时内分钟数据异常!" % name)
        try:
            for p in pointList:
                if p in resultDataM:
                    #print("%s项目中的%s点获取三小时内的数据成功!" % (name,p))
                    pass
                else:
                    assert 0,"%s项目中的%s点没有获取到三小时内分钟数据!" % (name,p)
        except Exception as e:
            assert 0,"%s项目获取三小时内分钟数据异常!" % name
            #print("%s项目获取三小时内数据异常!" % name)

        try:
            for item in rvM:
                projName = item.get("name")
                resultDataH.append(projName)
                for l in item["history"]:
                    if l["value"] == None or l["value"] == "":
                        assert 0,"%s项目--%s数据点--%s分钟数据为空!"  % (name,projName,l['time'])
                    else:
                        #print("%s项目--%s数据点--%s分钟数据获取成功!"  % (name,projName,l['time']))
                        pass
        except Exception as e:
            print(e.__str__())
            assert 0,"%s项目获取三小时内分钟数据异常!" % name
            #print("%s项目获取三小时内数据异常!" % name)

        try:
            for p in pointList:
                if p in resultDataH:
                    #print("%s项目中的%s点获取三小时内的数据成功!" % (name,p))
                    pass
                else:
                    print("%s项目中的%s点没有获取到3小时内小时数据!" % (name,p))
                    #assert 0,"%s项目中的%s点没有获取到3小时内小时数据!" % (name,p)
        except Exception as e:
            assert 0,"%s项目获取3小时内小时数据异常!" % name

        #数据对比
        checkM = []
        checkH = []
        for item in rvM:
            for l in item["history"]:
                if l['time'].split(":")[1] == '00' and l['time'].split(":")[2] == "00":
                    checkM.append(dict(pro=name,point=item['name'],time=l['time'],data=l['value']))

        for item in rvH:
            for l in item["history"]:
                if l['time'].split(":")[1] == '00' and l['time'].split(":")[2] == "00":
                    checkH.append(dict(pro=name,point=item['name'],time=l['time'],data=l['value']))



        for x in checkH:
            for y in checkH:
                if x['point'] == y['point'] and x['time'] != y['time']:
                    xTime = x['time'].split(" ")[1].split(":")[0]
                    yTime = y['time'].split(" ")[1].split(":")[0]
                    ab = abs(int(xTime) - int(yTime))
                    if x['data'] == y['data'] and ab == 1:
                        assert 0,"%s--%s数据点--%s时间的小时数据与%s时间的小时数据相同，均为%s!" % (x["pro"],x['point'],x['time'],y['time'],x['data'])
                    else:
                        print("%s--%s数据点--%s时间的小时数据与%s时间的小时数据不同，分别为%s和%s!" % (x["pro"],x['point'],x['time'],y['time'],x['data'],y['data']))

        for x in checkM:
            for y in checkM:
                if x['point'] == y['point'] and x['time'] != y['time']:
                    xTime = x['time'].split(" ")[1].split(":")[0]
                    yTime = y['time'].split(" ")[1].split(":")[0]
                    ab = abs(int(xTime) - int(yTime))
                    if x['data'] == y['data'] and ab == 1:
                        assert 0,"%s--%s数据点--%s时间的分钟数据与%s时间的小时数据相同，均为%s!" % (x["pro"],x['point'],x['time'],y['time'],x['data'])
                    else:
                        print("%s--%s数据点--%s时间的分钟数据与%s时间的小时数据不同，分别为%s和%s!" % (x["pro"],x['point'],x['time'],y['time'],x['data'],y['data']))














    def checkProjectPoint(self,pointList,projectID,projectName):

        historyValue=[]
        timeStart= time.time()-7200
        timeEnd = time.time()
        timeStartStr = time.strftime('%Y-%m-%d %H:00:00',time.localtime(timeStart))
        timeEndStr = time.strftime('%Y-%m-%d %H:00:00',time.localtime(timeEnd))
        dataOrig = dict(projectId=projectID, timeStart=timeStartStr, timeEnd=timeEnd, timeFormat='h1', pointList=pointList)
        data_real_time = dict(projectId=projectID, timeStart=timeThreeMinStr, timeEnd=timeTwoMinStr, timeFormat='m1', pointList=pointList)
        value = []
        rv = BeopTools.getInstance().postData(url_his, dataOrig)
        rv_now = BeopTools.getInstance().postData(url_his, data_real_time)
        value.append(rv)
        value.append(rv_now)
        #self.assertIsNotNone(rv, '%sget_history_data_padded接口查询OutdoorTdbin返回None'%projectName)
        #self.assertGreater(len(rv),0, '%sget_history_data_padded接口查询OutdoorTdbin返回点值清单为空'%projectName)
        for rv in value:
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
                    assert 0, ('%s获取%s点的三个小时的历史数据点值相等，该项目数据传输可能中断。'%(projectName,pointList[0]))
                else:
                    print('success,%s数据稳定'%projectName)
        time.sleep(0.5)






    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())



if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Smoke022('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)