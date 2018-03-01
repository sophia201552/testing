__author__ = 'woody'
import unittest
import sys, time
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app

URL = 'http://%s/getSaveSvrProjIdList' % app.config['SERVICE_URL']
pointUrl = "http://%s/point_tool/getCloudPointTable/" % app.config['SERVERIP']
itemDeleted = [235, 238, 241, 243, 253, 255, 256, 261, 265, 266, 270, 280, 294, 310, 318,101,71,76,175,315,433,402,421,447,74,425,446,462,463,134,418,466,460,457]

class Algorithm005(unittest.TestCase):
    testCaseID = 'Algorithm005'
    projectName = "付费项目"
    buzName = '部分项目虚拟点未写入'


    #case初始化,获取开始时间以及时间戳,获取写入日志句柄logger
    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))
        self.a = BeopTools()









    def Test(self):
        self.errors = []
        state = self.getSaveSvr()
        projects = self.checkState(state)

        for p in projects:
            rt = self.getPoints(p)
            status = self.checkPoints(rt)
            if status and p not in itemDeleted:
                self.errors.append("错误信息[%s]%s---项目id: %s 的SaveSvrHistory字段设置为0, 但是获取到了该项目的虚拟点, 请检查!" % (self.a.getTime(), self.testCaseID, str(p)))
            else:
                print("projid", p, '项目正常!')




        self.a.raiseError(self.errors, self.testCaseID)

    def getPoints(self, projId):
        rt = {}
        data = {"projectId":projId,"currentPage":1,"pageSize":5000,"pointType":1,"searchOrder":[["_id",-1]],"searchText":"","t_time":""}
        try:
            rt = self.a.postJsonToken(url=pointUrl, data=data, t=10)
        except Exception as e:
            self.a.writeLogError(self.logger, e.__str__())
            self.errors.append('错误信息[%s]%s---%s' % (self.a.getTime(), self.testCaseID, e.__str__()))
            self.a.raiseError(self.errors, self.testCaseID)
        return rt


    def checkPoints(self, rt):
        pointInfo = rt.get('data',{})
        if pointInfo:
            points = pointInfo.get('pointTable',[])
            if len(points):
                return True
        else:
            return False

    def getSaveSvr(self):
        rt = {}
        try:
            rt = self.a.getData(url=URL, timeout=10)
        except Exception as e:
            self.errors.append('错误信息[%s]%s---%s' % (self.a.getTime(), self.testCaseID, e.__str__()))
            self.a.raiseError(self.errors, self.testCaseID)
        return rt


    def checkState(self, rt):
        projects = []
        for info in rt:
            if info.get('SaveSvrHistory', 0):
                print("%s项目检查通过!" % info.get('name_cn'))
            else:
                projects.append(info.get('id'))
        return projects

    #用例结束后的清理工作,记录输出时间以及
    def tearDown(self):
        self.errors = []
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())





if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Algorithm005('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)


