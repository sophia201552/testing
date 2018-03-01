#测试项目图片是否丢失

__author__ = 'woody'
import time
import re
import datetime
import sys
import sqlite3
import unittest
import urllib.request
import json
import urllib.request,http.cookiejar,re, requests
import pymongo
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app

class Smoke008(unittest.TestCase):
    ExpectedStatus = 200
    testCaseID = 'Smoke008'
    projectName = "付费项目"
    buzName = '检测项目图片'
    errors = []


    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.Shhw()
        self.DemoCh01()
        self.ChangiAirport()
        self.dajin()
        self.DemoCh02()
        self.DemoCh03()
        self.DemoCh04()
        self.DemoCh05()
        self.DemoCh06()
        self.DemoEn01()
        self.DemoEn02()
        self.DemoEn03()
        self.DemoEn04()
        self.DemoEn05()
        self.DemoEn06()
        self.GalaxyMacau()
        self.gubei()
        self.hddianwang()
        self.Hkhr()
        self.hongli()
        self.hsimc()
        self.kmbusiness()
        self.kmstore()
        self.kmwd()
        self.Fault()



    def Shhw(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/shhuawei/2083989510.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'上海华为项目中图片丢失！')
        print("上海华为项目图片获取正常！")


    def DemoCh06(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/DemoCh06/2083989510.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'演示06项目中图片丢失！')
        print("演示06项目图片获取正常！")

    def DemoCh05(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/DemoChs05/35000350.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'演示05项目中图片丢失！')
        print("演示05项目图片获取正常！")
    def DemoCh04(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/DemoChs04/animation_166.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'演示04项目中图片丢失！')
        print("演示04项目图片获取正常！")
    def DemoCh03(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/DemoChs03/2143306184.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'演示03项目中图片丢失！')
        print("演示03项目图片获取正常！")

    def DemoCh02(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/DemoChs02/animation_10.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'演示02项目中图片丢失！')
        print("演示02项目图片获取正常！")
    def DemoCh01(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/DemoChs01/animation_404.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'演示01项目中图片丢失！')
        print("演示01项目图片获取正常！")
    def Szhw(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/HuaweiPlant/animation_1017991.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'深圳华为项目中图片丢失！')
        print("深圳华为项目图片获取正常！")

    def DemoEn01(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/DemoEn01/animation_642.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'英语版演示项目01中图片丢失！')
        print("英语版演示项目01图片获取正常！")
    def DemoEn02(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/DemoEn02/animation_10.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'英语版演示项目02中图片丢失！')
        print("英语版演示项目02图片获取正常！")
    def DemoEn03(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/DemoEn03/animation_1017433.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'英语版演示项目03中图片丢失！')
        print("英语版演示项目03图片获取正常！")
    def DemoEn04(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/DemoEn04/animation_166.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'英语版演示项目04中图片丢失！')
        print("英语版演示项目04图片获取正常！")
    def DemoEn05(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/DemoEn05/35000350.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'英语版演示项目05中图片丢失！')
        print("英语版演示项目05图片获取正常！")
    def DemoEn06(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/HuaweiSH/1631821205.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'英语版演示项目06中图片丢失！')
        print("英语版演示项目06图片获取正常！")
    def Hkhr(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/HuarunHK/animation_164.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'香港华润项目中图片丢失！')
        print("香港华润项目图片获取正常！")
    def Hkhr(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/HuarunHK/animation_164.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'香港华润项目中图片丢失！')
        print("香港华润项目图片获取正常！")
    def hsimc(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/hsimc/animation_17.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'上海中芯国际项目中图片丢失！')
        print("上海中芯国际项目图片获取正常！")
    def dajin(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/dajin/animation_89.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'深圳达进电子项目中图片丢失！')
        print("深圳达进电子项目图片获取正常！")
    def panda(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/panda/animation_95.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'南京熊猫电子项目中图片丢失！')
        print("南京熊猫电子项目图片获取正常！")
    def wdzzsy(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/wdzzsy/animation_414.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'郑州万达商业项目中图片丢失！')
        print("郑州万达商业项目图片获取正常！")
    def wdzzbh(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/wdzzbh/animation_410.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        self.assertEqual(self.ExpectedStatus,RealStatus,'郑州万达百货项目中图片丢失！')
        print("郑州万达百货项目图片获取正常！")
    def qdwdstore(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/qdwdstore/animation_374.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'青岛万达百货项目中图片丢失！')
        print("青岛万达百货项目图片获取正常！")
    def qdwdbusines(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/qdwdbusines/animation_384.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        self.assertEqual(self.ExpectedStatus,RealStatus,'青岛万达商业项目中图片丢失！')
        print("青岛万达商业项目图片获取正常！")

    def gubei(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/gubei/5600056.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'古北国际金融项目中图片丢失！')
        print("古北国际金融项目图片获取正常！")
    def kmwd(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/kmwd/animation_400.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'昆明万达酒店项目中图片丢失！')
        print("昆明万达酒店项目图片获取正常！")
    def kmbusiness(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/kmbusiness/animation_390.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'昆明万达商业项目中图片丢失！')
        print("昆明万达商业项目图片获取正常！")
    def kmstore(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/kmstore/animation_365.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'昆明万达百货项目中图片丢失！')
        print("昆明万达百货项目图片获取正常！")

    def zhongxin1qi(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/zhongxin1qi/animation_149.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'中兴通讯1期项目中图片丢失！')
        print("中兴通讯1期项目图片获取正常！")
    def zhongxin2qi(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/zhongxin2qi/animation_155.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'中兴通讯2期项目中图片丢失！')
        print("中兴通讯2期项目图片获取正常！")

    def hddianwang(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/hddianwang/-1580428422.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'华东电网项目中图片丢失！')
        print("华东电网项目图片获取正常！")

    def SAIC_DLZC(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/SAIC_DLZC/38200382.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'上汽工业项目中图片丢失！')
        print("上汽工业项目图片获取正常！")
    def hongli(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/hongli/34200342.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        if RealStatus == 200 or RealStatus == 502:
            print("宏力半导体项目图片获取正常！")
        else:
            assert 0,"宏力半导体项目图片丢失!"
    def ChangiAirport(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/ChangiAirport/35000350.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'某机场项目中图片丢失！')
        print("某机场项目图片获取正常！")
    def GalaxyMacau(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/GalaxyMacau/2135074627.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'银河娱乐城项目中图片丢失！')
        print("银河娱乐城项目图片获取正常！")
    def SFjiangsu(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/SFjiangsu/animation_233544.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'顺风光电项目中图片丢失！')
        print("顺风光电项目图片获取正常！")
    def TSgangsu(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/TSgangsu/800008.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'甘肃天水项目中图片丢失！')
        print("甘肃天水项目图片获取正常！")

    def KerryJingan(self):
        Url = "http://images.rnbtech.com.hk/static/images/plant/KerryJingan/animation_292750.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'静安嘉里项目中图片丢失！')
        print("静安嘉里项目图片获取正常！")

    def WorkerGroup(self):
        Url = 'http://images.rnbtech.com.hk/static/images/workflow/scenery-0.png'
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'工单菜单->项目团队->scenery-0.png图片丢失！')
        print("工单菜单->项目团队->scenery-0.png图片获取正常！")
    def Worker(self):
        Urls = []
        for i in range(1,11):
            Urls.append('http://images.rnbtech.com.hk/static/images/avatar/default/%d.png' % i)
        for url in Urls:
            result = requests.get(url)
            RealStatus = result.status_code
            time.sleep(0.1)
            item = re.compile(r'[\d]+')
            p = re.search(item,url)
            a = p.group(0)
            self.assertEqual(self.ExpectedStatus,RealStatus,'工单菜单->人员配置->%s.png图片丢失！' % a)
            print("工单菜单->人员配置->%s.png图片获取正常！" % a)
    def Fault(self):
        Urls = []
        Urls.append('http://images.rnbtech.com.hk/static/images/project_img/kmwd.jpg')
        Urls.append('http://images.rnbtech.com.hk/static/images/avatar/default/19.png')
        Urls.append('http://images.rnbtech.com.hk/static/images/avatar/default/3.png')
        Urls.append('http://images.rnbtech.com.hk/static/images/avatar/user/27488644.jpg')
        Urls.append('http://images.rnbtech.com.hk/static/images/project_img/HuarunHK.jpg')
        Urls.append('http://images.rnbtech.com.hk/static/images/project_img/kmbusiness.jpg')
        Urls.append('http://images.rnbtech.com.hk/static/images/project_img/zhognquplaza.jpg')
        for url in Urls:
            result = requests.get(url)
            RealStatus = result.status_code
            time.sleep(0.1)
            item = re.compile(r'[\w]+.(jpg|png)$')
            p = re.search(item,url)
            a = p.group(0)
            self.assertEqual(self.ExpectedStatus,RealStatus,'工单菜单->日程->%s图片丢失！' % a)
            print("工单菜单->日程->%s图片获取正常！" % a)



    def tearDown(self):
        self.errors = []
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())



















