__author__ = 'sophia'
import unittest
import sys
from interfaceTest.Methods.BeopTools import *
from interfaceTest import app



class Calc025(unittest.TestCase):
    testCaseID = 'Calc025'
    projectName = "付费项目"
    buzName = '查询维护项目中原始点,计算点,算法点名字是否有重复'
    test_data =app.config['CHECK_PROJECT']
    org_url = 'http://%s/admin/dataPointManager/search/' % app.config['SERVERIP']
    url = 'http://%s/point_tool/getCloudPointTable/' % app.config['SERVERIP']
    TIMEOUT = 30
    emails = app.config['CALC025_EMAILS']
    #case初始化,获取开始时间以及时间戳,获取写入日志句柄logger
    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))
        self.a = BeopTools()


    def Test(self):
        self.errors = []
        self.compare()
        self.project=[]
        #self.a.raiseError(self.errors, self.testCaseID)
        for error in self.errors:
            if('项目' in error):
                p=error.split('项目')[0]
                self.project.append(p)
        s='  ||  '.join(list(set(self.project)))+'这些项目中原始数据,虚拟点,计算点,两两之间可能重名.具体的点请看下列内容\n'

        if(self.project):
            self.a.raiseError(self.errors, self.testCaseID)
            #BeopTools.send_email(self.emails, self.testCaseID, [s]+self.errors, self.testCaseID)

    def compare(self):
        try:
            self.test_data.remove((76, '中文演示06'))
            self.test_data.remove((175, '演示09'))
            for item in self.test_data:
                print('比较%s项目的点'%item[1])
                origPoints = self.getOrigPoints(item[0])
                algPoints = self.getAlgPoints(item[0])
                calPoints = self.getCalPoints(item[0])
                error_point=''
                for point in origPoints:
                    if point in algPoints or point in calPoints:
                        error_point=error_point+'\n'+point
                for point in algPoints:
                    if point  in calPoints:
                        error_point=error_point+'\n'+point
                if(error_point and error_point!='\n'):
                    self.errors.append('错误信息%s项目:'%item[1])
                    self.errors.append('错误信息%s' % ( error_point))
        except Exception as e:
            self.errors.append('错误信息[%s]%s---%s' % (self.a.getTime(), self.testCaseID, e.__str__()))

    def getOrigPoints(self, projId):
        data = {"projectId":projId,"current_page":1,"page_size":"50000","text":"","isAdvance":False,"order":None,"flag":0}
        points = []
        rv = {}
        try:
            rv = self.a.postDataExcept(url=self.org_url, data=data, timeout=self.TIMEOUT)
            pointList = rv.get('list',[])
            if pointList:
                for point in pointList:
                    points.append(point.get('pointname'))
        except Exception as e:
            self.errors.append('错误信息[%s]%s---%s' % (self.a.getTime(), self.testCaseID, e.__str__()))
        return points

    def getAlgPoints(self, projId):
        data = {"projectId":projId,"currentPage":1,"pageSize":50000,"pointType":1,"searchOrder":[["_id",-1]],"searchText":"","t_time":""}
        rv = {}
        points = []

        try:
            rv = self.a.postDataExcept(url=self.url, data=data, timeout=self.TIMEOUT)
            pointTable = rv['data']['pointTable']
            if pointTable:
                for point in pointTable:
                    points.append(point.get('value'))
        except Exception as e:
            self.errors.append('错误信息[%s]%s---%s' % (self.a.getTime(), self.testCaseID, e.__str__()))
        return points

    def getCalPoints(self, projId):
        data = {"projectId":projId,"currentPage":1,"pageSize":50000,"pointType":2,"searchOrder":[["_id",-1]],"searchText":"","t_time":""}
        rv = {}
        points = []

        try:
            rv = self.a.postDataExcept(url=self.url, data=data,timeout=self.TIMEOUT)
            pointTable = rv['data']['pointTable']
            if pointTable:
                for point in pointTable:
                    points.append(point.get('value'))
        except Exception as e:
            self.errors.append('错误信息[%s]%s---%s' % (self.a.getTime(), self.testCaseID,e.__str__()))
        return points











    #用例结束后的清理工作,记录输出时间以及
    def tearDown(self):
        self.errors = []
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Calc025('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

