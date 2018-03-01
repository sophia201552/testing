#测试项目图片是否丢失

__author__ = 'woody'
import time
import unittest
import re
import requests
from interfaceTest import app
import datetime


class Smoke004(unittest.TestCase):
    testCaseID = "Smoke004"
    projectName = "无项目"
    buzName = "验证图片是否存在"
    start = 0.0
    ExpectedStatus = 200
    def setUp(self):
        self.start = datetime.datetime.now()
    def Test(self):
        self.checkPic()

    def checkPic(self):
    #shhw
        Url = "http://images.rnbtech.com.hk/static/images/plant/shhuawei/2083989510.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'上海华为项目中图片丢失！')
        print("上海华为项目图片获取正常！")


    #DemoCh06
        Url = "http://images.rnbtech.com.hk/static/images/plant/DemoCh06/2083989510.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'演示06项目中图片丢失！')
        print("演示06项目图片获取正常！")

    # DemoCh05
        Url = "http://images.rnbtech.com.hk/static/images/plant/DemoChs05/35000350.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'演示05项目中图片丢失！')
        print("演示05项目图片获取正常！")

    #DemoCh04
        Url = "http://images.rnbtech.com.hk/static/images/plant/DemoChs04/animation_166.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'演示04项目中图片丢失！')
        print("演示04项目图片获取正常！")

    # DemoCh03
        Url = "http://images.rnbtech.com.hk/static/images/plant/DemoChs03/2143306184.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'演示03项目中图片丢失！')
        print("演示03项目图片获取正常！")

    #DemoCh02
        Url = "http://images.rnbtech.com.hk/static/images/plant/DemoChs02/animation_10.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'演示02项目中图片丢失！')
        print("演示02项目图片获取正常！")
    # DemoCh01
        Url = "http://images.rnbtech.com.hk/static/images/plant/DemoChs01/animation_404.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'演示01项目中图片丢失！')
        print("演示01项目图片获取正常！")
    # Szhw
        Url = "http://images.rnbtech.com.hk/static/images/plant/HuaweiPlant/animation_1017991.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'深圳华为项目中图片丢失！')
        print("深圳华为项目图片获取正常！")

    # DemoEn01
        Url = "http://images.rnbtech.com.hk/static/images/plant/DemoEn01/animation_642.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'英语版演示项目01中图片丢失！')
        print("英语版演示项目01图片获取正常！")
    #DemoEn02
        Url = "http://images.rnbtech.com.hk/static/images/plant/DemoEn02/animation_10.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'英语版演示项目02中图片丢失！')
        print("英语版演示项目02图片获取正常！")
    # DemoEn03
        Url = "http://images.rnbtech.com.hk/static/images/plant/DemoEn03/animation_1017433.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'英语版演示项目03中图片丢失！')
        print("英语版演示项目03图片获取正常！")
    #DemoEn04
        Url = "http://images.rnbtech.com.hk/static/images/plant/DemoEn04/animation_166.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'英语版演示项目04中图片丢失！')
        print("英语版演示项目04图片获取正常！")
    #DemoEn05
        Url = "http://images.rnbtech.com.hk/static/images/plant/DemoEn05/35000350.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'英语版演示项目05中图片丢失！')
        print("英语版演示项目05图片获取正常！")
    # DemoEn06
        Url = "http://images.rnbtech.com.hk/static/images/plant/HuaweiSH/1631821205.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'英语版演示项目06中图片丢失！')
        print("英语版演示项目06图片获取正常！")
    # Hkhr
        Url = "http://images.rnbtech.com.hk/static/images/plant/HuarunHK/animation_164.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'香港华润项目中图片丢失！')
        print("香港华润项目图片获取正常！")
    # Hkhr
        Url = "http://images.rnbtech.com.hk/static/images/plant/HuarunHK/animation_164.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'香港华润项目中图片丢失！')
        print("香港华润项目图片获取正常！")
    # hsimc
        Url = "http://images.rnbtech.com.hk/static/images/plant/hsimc/animation_17.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'上海中芯国际项目中图片丢失！')
        print("上海中芯国际项目图片获取正常！")
    # dajin
        Url = "http://images.rnbtech.com.hk/static/images/plant/dajin/animation_89.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'深圳达进电子项目中图片丢失！')
        print("深圳达进电子项目图片获取正常！")
    #panda
        Url = "http://images.rnbtech.com.hk/static/images/plant/panda/animation_95.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'南京熊猫电子项目中图片丢失！')
        print("南京熊猫电子项目图片获取正常！")
    # wdzzsy
        Url = "http://images.rnbtech.com.hk/static/images/plant/wdzzsy/animation_414.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'郑州万达商业项目中图片丢失！')
        print("郑州万达商业项目图片获取正常！")
    # wdzzbh
        Url = "http://images.rnbtech.com.hk/static/images/plant/wdzzbh/animation_410.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        self.assertEqual(self.ExpectedStatus,RealStatus,'郑州万达百货项目中图片丢失！')
        print("郑州万达百货项目图片获取正常！")
    # qdwdstore
        Url = "http://images.rnbtech.com.hk/static/images/plant/qdwdstore/animation_374.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'青岛万达百货项目中图片丢失！')
        print("青岛万达百货项目图片获取正常！")
    # qdwdbusines
        Url = "http://images.rnbtech.com.hk/static/images/plant/qdwdbusines/animation_384.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        self.assertEqual(self.ExpectedStatus,RealStatus,'青岛万达商业项目中图片丢失！')
        print("青岛万达商业项目图片获取正常！")

    # gubei
        Url = "http://images.rnbtech.com.hk/static/images/plant/gubei/5600056.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'古北国际金融项目中图片丢失！')
        print("古北国际金融项目图片获取正常！")
    # kmwd
        Url = "http://images.rnbtech.com.hk/static/images/plant/kmwd/animation_400.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'昆明万达酒店项目中图片丢失！')
        print("昆明万达酒店项目图片获取正常！")
    #kmbusiness
        Url = "http://images.rnbtech.com.hk/static/images/plant/kmbusiness/animation_390.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'昆明万达商业项目中图片丢失！')
        print("昆明万达商业项目图片获取正常！")
    # kmstore
        Url = "http://images.rnbtech.com.hk/static/images/plant/kmstore/animation_365.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'昆明万达百货项目中图片丢失！')
        print("昆明万达百货项目图片获取正常！")

    #zhongxin1qi
        Url = "http://images.rnbtech.com.hk/static/images/plant/zhongxin1qi/animation_149.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'中兴通讯1期项目中图片丢失！')
        print("中兴通讯1期项目图片获取正常！")
    #zhongxin2qi
        Url = "http://images.rnbtech.com.hk/static/images/plant/zhongxin2qi/animation_155.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'中兴通讯2期项目中图片丢失！')
        print("中兴通讯2期项目图片获取正常！")

    # hddianwang
        Url = "http://images.rnbtech.com.hk/static/images/plant/hddianwang/-1580428422.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'华东电网项目中图片丢失！')
        print("华东电网项目图片获取正常！")

    # SAIC_DLZC
        Url = "http://images.rnbtech.com.hk/static/images/plant/SAIC_DLZC/38200382.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'上汽工业项目中图片丢失！')
        print("上汽工业项目图片获取正常！")
    # hongli
        Url = "http://images.rnbtech.com.hk/static/images/plant/hongli/34200342.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        if RealStatus == 200 or RealStatus == 502:
            print("宏力半导体项目图片获取正常！")
        else:
            assert 0,"宏力半导体项目图片丢失!"
    # ChangiAirport
        Url = "http://images.rnbtech.com.hk/static/images/plant/ChangiAirport/35000350.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'某机场项目中图片丢失！')
        print("某机场项目图片获取正常！")
    # GalaxyMacau
        Url = "http://images.rnbtech.com.hk/static/images/plant/GalaxyMacau/2135074627.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'银河娱乐城项目中图片丢失！')
        print("银河娱乐城项目图片获取正常！")
    # SFjiangsu
        Url = "http://images.rnbtech.com.hk/static/images/plant/SFjiangsu/animation_233544.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'顺风光电项目中图片丢失！')
        print("顺风光电项目图片获取正常！")
    # TSgangsu
        Url = "http://images.rnbtech.com.hk/static/images/plant/TSgangsu/800008.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'甘肃天水项目中图片丢失！')
        print("甘肃天水项目图片获取正常！")

    # KerryJingan
        Url = "http://images.rnbtech.com.hk/static/images/plant/KerryJingan/animation_292750.png"
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'静安嘉里项目中图片丢失！')
        print("静安嘉里项目图片获取正常！")

    # WorkerGroup
        Url = 'http://images.rnbtech.com.hk/static/images/workflow/scenery-0.png'
        result = requests.get(Url)
        RealStatus = result.status_code
        time.sleep(0.1)
        self.assertEqual(self.ExpectedStatus,RealStatus,'工单菜单->项目团队->scenery-0.png图片丢失！')
        print("工单菜单->项目团队->scenery-0.png图片获取正常！")
    #Worker
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
    # Fault
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
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Smoke004('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

















