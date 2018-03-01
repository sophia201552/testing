__author__ = 'kingsley'
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import datetime, time
import unittest
from datetime import datetime
import json
from threading import Timer
import time

url = "http://%s/get_realtimedata_time" % app.config['SERVERIP']
data = {'proj':121, 'pointList':['1103_SmartSensor001_SensorT','1103_SmartSensor002_SensorT','1103_SmartSensor003_SensorT','1103_SmartSensor004_SensorT','1103_SmartSensor005_SensorT','1103_SmartSensor006_SensorT','1103_SmartSensor007_SensorT','1103_SmartSensor008_SensorT','1103_SmartSensor009_SensorT','1103_SmartSensor010_SensorT']}
pointnumber = len(data['pointList'])

#realTimeUrl = "http://beopdemo.rnbtech.com.hk/analysis/startWorkspaceDataGenPieChart"
#realTimeData = {"dsItemIds": ["57072af06455142ae8ddaa42","57072af06455142ae8ddaa4c","57072af06455142ae8ddaa2f","57072af06455142ae8ddaa6e","57072af06455142ae8ddaa54","57072af06455142ae8ddaa37","57072af06455142ae8ddaa45","57072af06455142ae8ddaa41","57072af06455142ae8ddaa57","57072af06455142ae8ddaa62"]}
#tempnumber = len(realTimeData["dsItemIds"])
#cycletime = 3

class Temp001(unittest.TestCase):
    testCaseID = 'Temp001'
    projectName = '温控APP'
    buzName = '温度传感器检测'


    def setUp(self):
        self.start = datetime.now()


    def Test(self):
        self.get_realtimedata()

    def get_realtimedata(self):
        a = BeopTools()
        pointupdatetimelist=a.postData(url,data, 10)
        temperr = []
        for i in range(1,pointnumber):
            pointupdatetime = pointupdatetimelist.get('1103_SmartSensor00%s_SensorT' % i)
            tObj = datetime.strptime(pointupdatetime, '%Y-%m-%d %H:%M:%S')
            tNow = datetime.now()
            if tNow > tObj:
                span = tNow - tObj
                if span.total_seconds() > 1*60*60:
                    temperr.append(str(i))
        if temperr != []:
            assert 0 , '错误信息有温度传感器没有及时更新数据，有问题传感器编号为%s' % json.dumps(temperr, ensure_ascii=False)




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
