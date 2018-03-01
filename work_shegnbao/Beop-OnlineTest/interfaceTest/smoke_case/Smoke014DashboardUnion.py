__author__ = 'Woody'

import unittest
import datetime
import time, sys
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app

serverip = app.config.get('SERVERIP')

class Smoke014(unittest.TestCase):
    url = 'http://' + serverip
    testCaseID = 'Smoke014'


    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        data = {"creatorId":404,"menuItemId":"55d18c5a833c975b9bdbe87f",
                "layout":[
                    [
                        {"id":"1444461241875","isNotRender":None,"modal":
                            {"desc":None,"dsChartCog":None,"interval":None,"link":None,"modalText":None,"modalTextUrl":None,
                             "option":
                                 {"subChartIds":[
                                     {"id":"1444461246211"},
                                     {"id":"1444461246491"},
                                     {"id":"1444462837460"},
                                     {"id":"1444462868692"},
                                     {"id":"1444462926349"}]},
                             "points":None,"popId":None,"title":"test",
                             "type":"ModalMix","wikiId":None},"spanC":12,"spanR":3},
                        {"id":"1444462837460","isNotRender":True,
                         "modal":{
                             "desc":None,"dsChartCog":None,"interval":5,
                             "link":"5575390a94022d0ee495e7b4","modalText":None,
                             "modalTextUrl":None,"option":None,
                             "points":["561723011c954771780ab17e","56172b9f1c954771780ab186"],
                             "popId":None,"title":"test1",
                             "type":"ModalRealtimePieEnegBrkd",
                             "wikiId":"5618c13a833c9709d7afa842"},
                         "spanC":6,"spanR":6},
                        {"id":"1444462926349","spanC":6,"spanR":6,
                         "modal":{
                             "type":"ModalRealtimeLineOutdoor",
                             "title":"test2","points":[
                             "55de7d54323f0d0fdcdf0d4f","55de7d54323f0d0fdcdf0d51"],
                             "StartTime":"","EndTime":"","dsChartCog":None,"interval":5,
                             "link":"55ac9f6d94022d07f8e38229","wikiId":"5618c166833c9709d5f04908"},
                         "isNotRender":True}]],
                "id":"55b49d3b94022d08a8f17349"}

        str = ['test','test1','test2','ModalMix','ModalRealtimePieEnegBrkd','ModalRealtimeLineOutdoor',
               None,'5575390a94022d0ee495e7b4','55ac9f6d94022d07f8e38229',12,6,6,6,6,3,"55b49d3b94022d08a8f17349",
               '1444461241875','1444462837460','1444462926349','5618c13a833c9709d7afa842','5618c166833c9709d5f04908']
        #判断返回状态
        status = BeopTools().postJson(url=self.url+'/spring/saveLayout',data=data)
        if status == 'success':
            print("dashboard->创建组合图模块成功!")
        else:
            assert 0,"dashboard->创建组合图模块失败,返回状态不为success!"
        #发送get请求,获取该模块的title等信息进行比对
        r = BeopTools.getJson(self,self.url+'/spring/get/55d18c5a833c975b9bdbe87f/404')
        L = []
        #类型
        type1 = r['layout'][0][0]['modal']['type']
        L.append(type1)
        type2 = r['layout'][0][1]['modal']['type']
        L.append(type2)
        type3 = r['layout'][0][2]['modal']['type']
        L.append(type3)
        #标题
        title1 = r['layout'][0][0]['modal']['title']
        L.append(title1)
        title2 = r['layout'][0][1]['modal']['title']
        L.append(title2)
        title3 = r['layout'][0][2]['modal']['title']
        L.append(title3)
        spanC1 = r['layout'][0][0]['spanC']
        L.append(spanC1)
        spanC2 = r['layout'][0][1]['spanC']
        L.append(spanC2)
        spanC3 = r['layout'][0][2]['spanC']
        L.append(spanC3)
        spanR1 = r['layout'][0][0]['spanR']
        L.append(spanR1)
        spanR2 = r['layout'][0][1]['spanR']
        L.append(spanR2)
        spanR3 = r['layout'][0][2]['spanR']
        L.append(spanR3)

        layoutID1 = r['layout'][0][0]['id']
        L.append(layoutID1)
        layoutID2 = r['layout'][0][1]['id']
        L.append(layoutID2)
        layoutID3 = r['layout'][0][2]['id']
        L.append(layoutID3)

        link1 = r['layout'][0][0]['modal']['link']
        L.append(link1)
        link2 = r['layout'][0][1]['modal']['link']
        L.append(link2)
        link3 = r['layout'][0][2]['modal']['link']
        L.append(link3)

        wikiId1 = r['layout'][0][0]['modal']['wikiId']
        L.append(wikiId1)
        wikiId2 = r['layout'][0][1]['modal']['wikiId']
        L.append(wikiId2)
        wikiId3 = r['layout'][0][2]['modal']['wikiId']
        L.append(wikiId3)
        ID = r['id']
        L.append(ID)
        a = set(str)
        b = set(L)

        #判断创建的组合图get的信息是否与输入的信息一致
        if a.union(b) == a:
            print("dashboard->成功获取到新建的组合图模块!")
        else:
            assert 0,"dashboard->获取新建的组合图模块与输入信息不一致!"
        m = len(r['layout'][0])
        if m > 0:
            print("dashboard新建组合图后总的模块数量为%d" % m)
        else:
            assert 0,"dashboard新建组合图后模块数量为0!"

        #更新dashboard信息
        str2 = ['testchange1','testchange2','testchange3','ModalMix','ModalRealtimeBarSub','ModalRealtimeLineOutdoor',
               None,'5575390a94022d0ee495e7b4','55ac9f6d94022d07f8e38229',12,6,6,6,6,6,"55b49d3b94022d08a8f17349",
               '1444461241875','1444466659760','1444462926349','5618c13a833c9709d7afa842','5618c166833c9709d5f04908']
        data2 = {"creatorId":404,"menuItemId":"55d18c5a833c975b9bdbe87f",
                 "layout":[
                     [{"id":"1444461241875","isNotRender":None,
                       "modal":{
                           "desc":None,"dsChartCog":None,"interval":None,"link":None,"modalText":None,
                           "modalTextUrl":None,"option":{"subChartIds":[
                           {"id":"1444461246211"},
                           {"id":"1444461246491"},
                           {"id":"1444462837460"},
                           {"id":"1444462868692"},
                           {"id":"1444462926349"},
                           {"id":"1444466659760"}]},
                           "points":None,"popId":None,"title":"testchange1",
                           "type":"ModalMix","wikiId":None},"spanC":12,"spanR":6},
                      {"id":"1444462926349","isNotRender":True,
                       "modal":{"desc":None,"dsChartCog":None,"interval":5,
                                "link":"55ac9f6d94022d07f8e38229",
                                "modalText":None,"modalTextUrl":None,
                                "option":None,
                                "points":["55de7d54323f0d0fdcdf0d4f","55de7d54323f0d0fdcdf0d51"],
                                "popId":None,"title":"testchange2","type":"ModalRealtimeLineOutdoor",
                                "wikiId":"5618c166833c9709d5f04908"},"spanC":6,"spanR":6},
                      {"id":"1444466659760","isNotRender":True,
                       "modal":{"desc":None,"dsChartCog":None,"interval":5,
                                "link":None,"modalText":None,"modalTextUrl":None,
                                "option":None,"points":["56164b8a1c954771780ab17c","56172aba1c954771780ab181"],
                                "popId":None,"title":"testchange3","type":"ModalRealtimeBarSub","wikiId":None},
                       "spanC":6,"spanR":6}]],
                 "id":"55b49d3b94022d08a8f17349"
        }
        #判断更新后返回状态
        status2 = BeopTools().postJson(url=self.url+'/spring/saveLayout',data=data2)
        if status2 == 'success':
            print("dashboard->创建组合图模块成功!")
        else:
            assert 0,"dashboard->创建组合图模块失败,返回状态不为success!"
        #发送get请求,更新后获取该模块的title等信息进行比对
        r2 = BeopTools().getJson(self.url+'/spring/get/55d18c5a833c975b9bdbe87f/404')
        L2 = []
        #类型
        dtype1 = r2['layout'][0][0]['modal']['type']
        L2.append(dtype1)
        dtype2 = r2['layout'][0][1]['modal']['type']
        L2.append(dtype2)
        dtype3 = r2['layout'][0][2]['modal']['type']
        L2.append(dtype3)
        #标题
        dtitle1 = r2['layout'][0][0]['modal']['title']
        L2.append(dtitle1)
        dtitle2 = r2['layout'][0][1]['modal']['title']
        L2.append(dtitle2)
        dtitle3 = r2['layout'][0][2]['modal']['title']
        L2.append(dtitle3)
        dspanC1 = r2['layout'][0][0]['spanC']
        L2.append(dspanC1)
        dspanC2 = r2['layout'][0][1]['spanC']
        L2.append(dspanC2)
        dspanC3 = r2['layout'][0][2]['spanC']
        L2.append(dspanC3)
        dspanR1 = r2['layout'][0][0]['spanR']
        L2.append(dspanR1)
        dspanR2 = r2['layout'][0][1]['spanR']
        L2.append(dspanR2)
        dspanR3 = r2['layout'][0][2]['spanR']
        L2.append(dspanR3)

        dlayoutID1 = r2['layout'][0][0]['id']
        L2.append(dlayoutID1)
        dlayoutID2 = r2['layout'][0][1]['id']
        L2.append(dlayoutID2)
        dlayoutID3 = r2['layout'][0][2]['id']
        L2.append(dlayoutID3)

        dlink1 = r2['layout'][0][0]['modal']['link']
        L2.append(dlink1)
        dlink2 = r2['layout'][0][1]['modal']['link']
        L2.append(dlink2)
        dlink3 = r2['layout'][0][2]['modal']['link']
        L2.append(dlink3)

        dwikiId1 = r2['layout'][0][0]['modal']['wikiId']
        L2.append(dwikiId1)
        dwikiId2 = r2['layout'][0][1]['modal']['wikiId']
        L2.append(dwikiId2)
        dwikiId3 = r2['layout'][0][2]['modal']['wikiId']
        L2.append(dwikiId3)
        ID2 = r2['id']
        L2.append(ID2)
        a2 = set(str2)
        b2 = set(L2)
        #判断创建的组合图get的信息是否与输入的信息一致
        if a2.union(b2) == a2:
            print("dashboard->成功获取到更新后的组合图模块!")
        else:
            assert 0,"dashboard->获取更新后的组合图模块与输入信息不一致!"
        m2 = len(r['layout'][0])
        if m2 > 0:
            print("dashboard更新组合图后总的模块数量为%d" % m)
        else:
            assert 0,"dashboard更新组合图后模块数量为0!"

        #删除dashboard接口测试
        delete = {"creatorId": 404, "menuItemId": "55d18c5a833c975b9bdbe87f",
                  "layout": [[{"id": "1444462926349", "isNotRender": True, "modal":
                      {"desc": None, "dsChartCog": None, "interval": 5, "link": "55ac9f6d94022d07f8e38229",
                       "modalText": None, "modalTextUrl": None, "option": None,
                       "points": ["55de7d54323f0d0fdcdf0d4f", "55de7d54323f0d0fdcdf0d51"],
                       "popId": None, "title": "", "type": "ModalRealtimeLineOutdoor",
                       "wikiId": "5618c166833c9709d5f04908"}, "spanC": 6, "spanR": 6},
                              {"id": "1444466659760", "isNotRender": True, "modal":
                                  {"desc": None, "dsChartCog": None, "interval": 5, "link": None, "modalText": None,
                                   "modalTextUrl": None, "option": None,
                                   "points": ["56164b8a1c954771780ab17c", "56172aba1c954771780ab181"],
                                   "popId": None, "title": "", "type": "ModalRealtimeBarSub", "wikiId": None},
                               "spanC": 6, "spanR": 6}]],
                  "id": "55b49d3b94022d08a8f17349"}
        s = BeopTools().postJson(url=self.url+'/spring/saveLayout',data=delete)
        if s == 'success':
            print("dashboard->删除组合图模板成功!")
        else:
            assert 0,"dashboard->删除组合图模块失败,返回状态不为success!"

        #发送get请求验证该模块是否有被删除
        r3 = BeopTools().getJson(self.url+'/spring/get/55d18c5a833c975b9bdbe87f/404')
        m3 = len(r3['layout'][0])
        if m3 == m - 1:
            print("dashboard删除新建KPI仪表盘后模块数量为0")
        else:
            assert 0,"dashboard删除新建KPI仪表盘后模块数量不为0!"

    def tearDown(self):
        self.errors = []
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())



if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Smoke014('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)