__author__ = 'sophia'
import time
import datetime
import unittest

from interfaceTest.Methods.BeopTools import *
from interfaceTest import app


class Calc041(unittest.TestCase):
    testCaseID = 'Calc041'
    projectName = "greenslopes项目"
    buzName = '计算点(累计量)查看是否递增'
    start = 0.0
    now = 0
    startTime = ""
    errors = []
    projId = 421
    points = ['Accum_ChGroup_GroupEnergy','Accum_PCHWPGroup_GroupEnergy','Accum_SCHWPGroup_GroupEnergy','Accum_CWPGroup_GroupEnergy','Accum_CTFanGroup_GroupEnergy']


    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.errors = []
        self.offline = 0
        self.checkHistoryData( self.points)
        if self.errors:
            BeopTools.writeLogError(self.logger, '\n'.join(self.errors))
            BeopTools.raiseError(self.errors, self.testCaseID)
        else:
            BeopTools.writeLogError(self.logger, '错误个数为0!')



    def checkHistoryData(self,point):
        addr = "http://%s/get_history_data_padded_reduce" % app.config['SERVERIP']
        a = BeopTools()
        r = None
        timeStart = (self.start - datetime.timedelta(hours=1)).strftime("%Y-%m-%d %H:00:00")
        timeEnd = self.start.strftime("%Y-%m-%d %H:00:00")
        
        data = {
            "pointList":point,
            "projectId":self.projId,
            "prop":{},
            "timeEnd":timeEnd,
            "timeFormat":"h1",
            "timeStart":timeStart
        }
        try:
            rt = a.postJsonToken(url=addr, data=data, t=20)
        except Exception as e:
            print(e.__str__())
            self.errors.append("错误信息%s接口失败,%d秒内没有响应!" % (addr, 20))
        if rt and isinstance(rt, dict):
            pointNames = rt.get('data',False)
            timeStamp=rt.get('timeStamp')
            if pointNames:
                for point in pointNames:
                    values=pointNames[point]
                    if(values):
                        # for index in range(1,len(values)-1):
                        v=values[1]-values[0]
                        if v<=0 or v>values[0]*10:
                            self.errors.append("错误信息%s点在%s~%s点值发生突变或者一直没有递增!" % (point, timeStamp[0], timeStamp[1]))
                        # break
            else:
                self.errors.append("错误信息%s点在%s~%s没有历史数据"% (point, timeStart, timeEnd))
        else:
            self.errors.append("错误信息%s点在%s~%s没有数据!" % (point, timeStart, timeEnd))

    def tearDown(self):
        self.offline = False
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Calc041('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

