__author__ = 'kingsley'
import requests
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import unittest
from datetime import datetime
import json
from threading import Timer
import time
serverip = app.config['SERVERIP']
url1 = 'http://%s/get_history_data_padded' % serverip
url2 = "http://%s/get_realtimedata_time" % serverip
url3 = "http://%s/getWriteToSiteData" % serverip

#realTimeUrl = "http://beopdemo.rnbtech.com.hk/analysis/startWorkspaceDataGenPieChart"
#realTimeData = {"dsItemIds": ["57072af06455142ae8ddaa42","57072af06455142ae8ddaa4c","57072af06455142ae8ddaa2f","57072af06455142ae8ddaa6e","57072af06455142ae8ddaa54","57072af06455142ae8ddaa37","57072af06455142ae8ddaa45","57072af06455142ae8ddaa41","57072af06455142ae8ddaa57","57072af06455142ae8ddaa62"]}
#tempnumber = len(realTimeData["dsItemIds"])
#cycletime = 3
class Temp001(unittest.TestCase):
    testCaseID = 'Temp001'
    projectName = '温控APP'
    buzName = '温度传感器检测'
    start = 0.0

    def setUp(self):
        self.start = datetime.now()


    def Test(self):
        if not self.isWeekend():
            self.get_realtimedata()



    def isWeekend(self):
        #获取今天是星期几
        week = datetime.now().weekday()
        if week == 5 or week == 6:
            #为周末
            return True
        else:
            return False



    def get_realtimedata(self):
        timeEnd=time.time()
        timeStart=timeEnd-86400
        timeStartStr=time.strftime("%Y-%m-%d 10:00:00", time.localtime(timeStart))
        timeEndStr=time.strftime("%Y-%m-%d 18:00:00", time.localtime(timeStart+21600))
        #pointList=['1103_SmartSensor001_SensorT','1103_SmartSensor002_SensorT','1103_SmartSensor003_SensorT','1103_SmartSensor004_SensorT','1103_SmartSensor005_SensorT','1103_SmartSensor006_SensorT','1103_SmartSensor007_SensorT','1103_SmartSensor008_SensorT','1103_SmartSensor009_SensorT','1103_SmartSensor010_SensorT']
        pointList=['jrgc0403_SmartSensor001_SensorT','jrgc0403_SmartSensor002_SensorT','jrgc0403_SmartSensor003_SensorT',
                   'jrgc0403_SmartSensor004_SensorT','jrgc0403_SmartSensor005_SensorT','jrgc0403_SmartSensor006_SensorT',
                   'jrgc0403_SmartSensor007_SensorT','jrgc0403_SmartSensor008_SensorT','jrgc0403_SmartSensor009_SensorT',
                   'jrgc0403_SmartSensor010_SensorT','jrgc0403_SmartSensor011_SensorT','jrgc0403_SmartSensor012_SensorT'
                   ,'jrgc0403_SmartSensor013_SensorT','jrgc0403_SmartSensor014_SensorT','jrgc0403_SmartSensor015_SensorT'
                   ,'jrgc0403_SmartSensor016_SensorT','jrgc0403_SmartSensor017_SensorT','jrgc0403_SmartSensor018_SensorT'
                   ,'jrgc0403_SmartSensor019_SensorT','jrgc0403_SmartSensor020_SensorT','jrgc0403_SmartSensor021_SensorT'
                   ,'jrgc0403_SmartSensor022_SensorT','jrgc0403_SmartSensor023_SensorT','jrgc0403_SmartSensor024_SensorT'
                   ,'jrgc0403_SmartSensor025_SensorT']
        projectId=121
        dataOrig1 = dict(projectId=projectId, timeStart=timeStartStr, timeEnd=timeEndStr, timeFormat='m5', pointList=pointList)
        dataOrig2=dict(proj=projectId, pointList=pointList)
        pointnumber = len(pointList)
        fucOnofflist = ['1103_FCU001_FCUOnOff','1103_FCU002_FCUOnOff','1103_FCU003_FCUOnOff','1103_FCU004_FCUOnOff']
        fucOnoffNumber = len(fucOnofflist)
        timeStartStr1=time.strftime("%Y-%m-%d 10:00:00",time.localtime(timeStart))
        timeEndStr1=time.strftime("%Y-%m-%d 18:00:00", time.localtime(timeStart+21600))
        dataOrig3 = dict(projectId=projectId, timeStart=timeStartStr1, timeEnd=timeEndStr1, timeFormat='h1', pointList=fucOnofflist)
        weekstr=time.strftime("%w", time.localtime(timeStart))
        week=int(weekstr)
        a = BeopTools()
        pointupdatetimelist = a.postData(url2,dataOrig2, 10)
        pointHistoryList=a.postData(url1,dataOrig1, 10)
        fucOnoffHistoryList = a.postData(url1,dataOrig3, 10)
        #outputlist = a.postData(url3,dict(projectId=121),10)
        temperrouttime = []
        pointvlaueerr = []
        fucOnoffHistoryErr = []
        for i in range(1,pointnumber+1):
            j = str(i).zfill(3)
            #pointname = '1103_SmartSensor%s_SensorT'%j
            pointname = 'jrgc0403_SmartSensor%s_SensorT'%j
            pointupdatetime = pointupdatetimelist.get(pointname)
            tObj = datetime.strptime(pointupdatetime, '%Y-%m-%d %H:%M:%S')
            tNow = datetime.now()
            if tNow > tObj:
                span = tNow - tObj
                if span.total_seconds() > 1*60*60:
                    temperrouttime.append(str(i))
                    continue
                else:
                    for item1 in pointHistoryList:
                        fname = item1['name']
                        hisdata = item1['history']

                        if fname==pointname:
                            value1 = ''
                            value2 = ''
                            timestart = ''
                            timeend = ''
                            cycle = 0
                            for item2 in hisdata:
                                movevalue = 0
                                value = item2['value']
                                itemtime = item2['time']
                                if cycle >= 10 :
                                    if  str(i).zfill(3) not in pointvlaueerr:
                                        pointvlaueerr.append( str(i).zfill(2))
                                    break

                                if value1 == '':
                                    value1 = value
                                    timestart = itemtime
                                    continue
                                if value1 == value:
                                    cycle = cycle + 1
                                    continue

        for m in range(1,fucOnoffNumber+1):
            n = str(m).zfill(3)
            fucOnoffpiont = '1103_FCU%s_FCUOnOff'%n
            for item3 in fucOnoffHistoryList:
                fucName = item3['name']
                fuchistory = item3['history']
                if fucName == fucOnoffpiont:
                    for fucvalue in fuchistory:
                        value = fucvalue['value']
                        itemtime = fucvalue['time']
                        if value != '1.00':
                            #fucOnoffHistoryErr.append('时间：%s,点位：%s'%(time,fucOnoffpiont))
                            if  str(m).zfill(2) not in fucOnoffHistoryErr and 0< week <=5:
                                fucOnoffHistoryErr.append( str(m).zfill(2))
                                fucOnoffHistoryErr.append(itemtime)
        fucOnoffHistoryErr = [] #开关设定值现在检测不到，开关的检测关闭。
        if temperrouttime != [] or pointvlaueerr !=[] or fucOnoffHistoryErr != []:

            assert 0 , '错误信息\n智能传感器（金融广场）测试结果如下：\n1、当前时间没有更新数据的传感器为%s. \n2、前一天连续10个采集周期（m5）没有变化数值的传感器为%s\n3、工作时间10点到18点关闭过风机为（开关暂停测试）%s' % (temperrouttime,pointvlaueerr,fucOnoffHistoryErr)




        '''
        value1=a.postData(realTimeUrl,realTimeData, 10)
        time.sleep(cycletime)
        value2 = a.postData(realTimeUrl,realTimeData, 10)
        time.sleep(cycletime)
        value3 = a.postData(realTimeUrl,realTimeData, 10)

        temperr = []
        for i in range(1,tempnumber):
            if value1 ['dsItemList'][i]['data'] == value2 ['dsItemList'][i]['data'] == value3 ['dsItemList'][i]['data'] :
                temperr.append(str(i))

            '''



    def tearDown(self):
        use1 = str((datetime.now() - self.start).seconds)
        use = use1 + "s"
        now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Temp001('Test'))
    runner = unittest.TextTestRunner()
    runner.run(suite)