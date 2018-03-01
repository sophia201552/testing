__author__ = 'woody'
import unittest
import sys, time, json
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app

URL = 'http://%s/appTemperature/room/getRealtimeData/574d224c1c95471dde8ed2c1' % app.config['SERVERIP']
DATA = {"dsItemIds":["57660fb9833c97250a3d1fef","57660fb9833c97250a3d202c","57660fb9833c97250a3d2032",
                     "57660fb9833c97250a3d2003","57660fb9833c97250a3d2029","57660fb9833c97250a3d2020",
                     "57660fb9833c97250a3d2017","57660fb9833c97250a3d201a","57660fb9833c97250a3d201b",
                     "57660fb9833c97250a3d2010","57660fb9833c97250a3d202a","57660fb9833c97250a3d2015",
                     "57660fb9833c97250a3d200a","57660fb9833c97250a3d2008","57660fb9833c97250a3d201d",
                     "57660fb9833c97250a3d201c","57660fb9833c97250a3d1ff8","57660fb9833c97250a3d202f",
                     "57660fb9833c97250a3d2021","57660fb9833c97250a3d1fed","57660fb9833c97250a3d1ff3",
                     "57660fb9833c97250a3d1ff6"]}

expect = {'data': {"dsItemList": [
                                        {"dsItemId": "57660fb9833c97250a3d201d", "data": "Null"},
                                        {"dsItemId": "57660fb9833c97250a3d201a", "data": "30.24"},
                                        {"dsItemId": "57660fb9833c97250a3d2008", "data": "1"},
                                        {"dsItemId": "57660fb9833c97250a3d1fed", "data": "1"},
                                        {"dsItemId": "57660fb9833c97250a3d1ff6", "data": "Null"},
                                        {"dsItemId": "57660fb9833c97250a3d201b", "data": "26.62"},
                                        {"dsItemId": "57660fb9833c97250a3d202c", "data": "27.19"},
                                        {"dsItemId": "57660fb9833c97250a3d2020", "data": "30.24"},
                                        {"dsItemId": "57660fb9833c97250a3d2010", "data": "25.28"},
                                        {"dsItemId": "57660fb9833c97250a3d1fef", "data": "27.38"},
                                        {"dsItemId": "57660fb9833c97250a3d2015", "data": "Null"},
                                        {"dsItemId": "57660fb9833c97250a3d2003", "data": "28.14"},
                                        {"dsItemId": "57660fb9833c97250a3d202a", "data": "1"},
                                        {"dsItemId": "57660fb9833c97250a3d1ff8", "data": "1"},
                                        {"dsItemId": "57660fb9833c97250a3d201c", "data": "Null"},
                                        {"dsItemId": "57660fb9833c97250a3d2029", "data": "28.72"},
                                        {"dsItemId": "57660fb9833c97250a3d200a", "data": "Null"},
                                        {"dsItemId": "57660fb9833c97250a3d2021", "data": "Null"},
                                        {"dsItemId": "57660fb9833c97250a3d2017", "data": "31.58"},
                                        {"dsItemId": "57660fb9833c97250a3d1ff3", "data": "Null"},
                                        {"dsItemId": "57660fb9833c97250a3d2032", "data": "24.13"},
                                        {"dsItemId": "57660fb9833c97250a3d202f", "data": "Null"}]},
                'mode': '2'}


class Temp002(unittest.TestCase):
    testCaseID = 'Temp002'
    projectName = "APPTemp项目"
    buzName = '房间温度数据'
    errors = []
    errorStr = "错误信息提出人: 顾博 Case编号: Temp002 Case测试功能: 房间温度数据是否与预期一致 Case判断方式: 获取/appTemperature/room/getRealtimeData/574d224c1c95471dde8ed2c1 \
        	接口中的温度点id，与预期温度点id比对，看是否相同 Case作用: 保障房间温度点不被改动"

    #case初始化,获取开始时间以及时间戳,获取写入日志句柄logger
    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))
        self.a = BeopTools()



    def Test(self):
        self.errors = []

        #获取各个点的数据
        pointsData = self.getPoints()

        #比对各个点数据
        self.checkData(pointsData)

        #抛出本次用例发生的所有与预期不符的错误
        if self.errors:
            self.errors.append(self.errorStr)
        self.a.raiseError(self.errors, self.testCaseID)

    def checkData(self, pointsData):
        #print(pointsData.get('data'), type(pointsData.get('data')))
        different = []
        data = None
        try:
            data = pointsData.get('data')
            #mode = pointsData.get('mode')
            expectData = expect.get('data')['dsItemList']
            for item in data:
                rv = False
                dsItemId = item.get('dsItemId')
                #itemData = item.get('data')
                for d in expectData:
                    if d.get('dsItemId') == dsItemId:
                        rv = True
                        break
                if rv:
                    print(dsItemId, "与预期数据一致!")
                else:
                    different.append(dsItemId)
            #if mode == expect.get('mode'):
                #print('运行模式mode与预期一致!')
            #else:
                #self.errors.append('错误信息[%s]%s---%s接口返回的数据中mode模式与预期不一致!' % (self.a.getTime(), self.testCaseID, URL))
        except Exception as e:
            #print(e.__str__())
            self.a.writeLogError(self.logger, e.__str__())
            self.errors.append("错误信息[%s]%s---%s接口返回数据%s与预期数据比对时出错,请检查!详情: %s" % (self.a.getTime(), self.testCaseID, URL, json.dumps(data), e.__str__()))


        if different:
            self.errors.append("错误信息[%s]%s---%s接口返回的数据中如下点 %s与预期不一致!请检查!" % (self.a.getTime(), self.testCaseID, URL, json.dumps(different)))


    def getPoints(self):
        rt = {}
        try:
            rt = self.a.postJsonToken(url=URL, data=DATA, t=10)
        except Exception as e:
            self.a.writeLogError(self.logger, e.__str__())
            assert 0, "错误信息[%s]%s---发送json数据%s请求%s接口出错!%s" % (self.a.getTime(), self.testCaseID, json.dumps(DATA, ensure_ascii=False), URL, e.__str__())
        return rt

    #用例结束后的清理工作,记录输出时间以及
    def tearDown(self):
        self.errors = []
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())





if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Temp002('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)


