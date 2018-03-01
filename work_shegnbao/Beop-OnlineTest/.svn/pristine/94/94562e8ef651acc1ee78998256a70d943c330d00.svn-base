__author__ = 'kingsley'
import requests
from Methods.BeopTools import *
import unittest
from setting import serverip
from datetime import datetime
import json
from threading import Timer
import time
realTimeUrl = "http://beopdemo.rnbtech.com.hk/analysis/startWorkspaceDataGenPieChart"
realTimeData = {"dsItemIds": ["570cb514833c9744f43db72b","570cb525833c9744f3b83253","570cb52b833c9744f3b83254","570cb530833c9744f43db72c"]}


class AHUOnoff(unittest.TestCase):
    testCaseID = 'AHUOnoff'
    projectName = '温控APP'
    buzName = '空调开关检测'
    start = 0.0

    def setUp(self):
        self.start = datetime.now()


    def Test(self):
        self.get_realtimedata()


    def get_realtimedata(self):

         a = BeopTools()
         value=a.postData(realTimeUrl,realTimeData, 10)
         nowtime = time.strftime('%Y-%m-%d %H',time.localtime(time.time()))
         week=int(time.strftime("%w"))
         hour=int(time.strftime("%H"))
         if week <= 5 and hour >= 10 and hour <= 18 :

            onofflist = value ['dsItemList']
            AHU01 = onofflist[0]['data']
            AHU02 = onofflist[1]['data']
            AHU03 = onofflist[2]['data']
            AHU04 = onofflist[3]['data']
            AHUOff = []
            if AHU01 != '1' :
                AHUOff.append("AHU01")
            if AHU02 != '1' :
                AHUOff.append("AHU02")
            if AHU03 != '1' :
                AHUOff.append("AHU03")
            if AHU04 != '1' :
                AHUOff.append("AHU04")
            if AHUOff != []:
                assert 0 , "当前工作时间内，风机%s没有开启，请检查！" % AHUOff

    def tearDown(self):
        use1 = str((datetime.now() - self.start).seconds)
        use = use1 + "s"
        now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
