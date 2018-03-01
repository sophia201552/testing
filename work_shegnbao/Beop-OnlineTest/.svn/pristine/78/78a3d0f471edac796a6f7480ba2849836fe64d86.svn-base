__author__ = 'kingsley'

import time
import datetime
import unittest
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app

class Smoke001(unittest.TestCase):
    testCaseID = 'Smoke001'
    projectName = '上海华为'
    buzName = '判断历史数据中时分天的数据是否一致'
    start = 0.0

    def setUp(self):
        self.start = datetime.datetime.now()

    #测试5分钟的数据
    def Test(self):
        #url = 'http://beop.rnbtech.com.hk:5001/get_history_data_padded'
        url = 'http://%s/get_history_data_padded' % app.config.get('SERVICE_URL')
        timeEnd=time.time()
        timeStart=timeEnd-604800
        timeStartStr=time.strftime("%Y-%m-%d 00:00:00", time.localtime(timeStart))
        timeEndStr=time.strftime("%Y-%m-%d 00:00:00", time.localtime(timeEnd))
        pointList=["OutdoorTdbin", "OutdoorWetTemp", "OutdoorRH"]
        projectId=4
        dataOrig = dict(projectId=projectId, timeStart=timeStartStr, timeEnd=timeEndStr, timeFormat='m5', pointList=pointList)
        rvM = BeopTools.getInstance().postJson(url, dataOrig)
        self.assertIsNotNone(rvM, 'get_history_data_padded接口查询5分钟数据，返回None')
        self.assertGreater(len(rvM),0, 'get_history_data_padded接口查询5分钟数据，返回点值清单为空')

        dataOrig = dict(projectId=projectId, timeStart=timeStartStr, timeEnd=timeEndStr, timeFormat='h1', pointList=pointList)
        rvH = BeopTools.getInstance().postJson(url, dataOrig)
        self.assertIsNotNone(rvH, 'get_history_data_padded接口查询小时数据返回None')
        self.assertGreater(len(rvH),0, 'get_history_data_padded接口查询小时数据返回点值清单为空')

        dataOrig = dict(projectId=projectId, timeStart=timeStartStr, timeEnd=timeEndStr, timeFormat='d1', pointList=pointList)
        rvD = BeopTools.getInstance().postJson(url, dataOrig)
        self.assertIsNotNone(rvD, 'get_history_data_padded接口查询天数据返回None')
        self.assertGreater(len(rvD),0, 'get_history_data_padded接口查询天小时数据返回点值清单为空')

        for item1 in rvM:
            fname = item1['name']
            hisdata = item1['history']
            if fname=='OutdoorTdbin':
                OutdoorTdbinDataM=hisdata
            if fname=='OutdoorWetTemp':
                OutdoorWetTempDataM=hisdata
            if fname=='OutdoorRH':
                OutdoorWetTempDataM=hisdata
        for item in rvH:
            fname = item['name']
            hisdata = item['history']
            if fname=='OutdoorTdbin':
                OutdoorTdbinDataH=hisdata
            if fname=='OutdoorWetTemp':
                OutdoorWetTempDataH=hisdata
            if fname=='OutdoorRH':
                OutdoorWetTempDataH=hisdata

        for item in rvD:
            fname = item['name']
            hisdata = item['history']
            if fname=='OutdoorTdbin':
                OutdoorTdbinDataD=hisdata
            if fname=='OutdoorWetTemp':
                OutdoorWetTempDataD=hisdata
            if fname=='OutdoorRH':
                OutdoorWetTempDataD=hisdata


        for item in OutdoorTdbinDataD:
            daytime=item['time']
            dayvlaue=item['value']
            for item in OutdoorTdbinDataM:
                minutetime=item['time']
                minutevlaue=item['value']
                if daytime==minutetime:
                    if dayvlaue != minutevlaue:
                        assert 0,"郑州万达商业--OutdoorTdbinData--%s时刻天数据里面的值%s和分钟里面的值%s不一致" % (minutetime,dayvlaue,minutevlaue)
        for item in OutdoorTdbinDataH:
            hourtime=item['time']
            hourvlaue=item['value']
            for item in OutdoorTdbinDataM:
                minutetime=item['time']
                minutevlaue=item['value']
                if hourtime==minutetime:
                    if hourvlaue != minutevlaue:
                        assert 0,'郑州万达商业--OutdoorTdbinData--%s时刻小时数据里面的值%s和分钟里面的值%s不一致'%(hourtime,hourvlaue,minutevlaue)
        print('endtest')

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())



if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Smoke001('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)