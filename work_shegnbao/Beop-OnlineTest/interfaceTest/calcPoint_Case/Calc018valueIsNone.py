__author__ = 'woody'
import unittest

from interfaceTest import app
from interfaceTest.Methods.BeopTools import BeopTools
import time, sys
#项目ID,点名,项目名,dtu名称,引擎名称,是否判断掉线时间,持续时间
'316项目的CHWPGroup_RunNum 不能为None'

url = "http://%s/point_tool/getCloudPointTable/" % app.config['SERVERIP']
projectId = (194, 316)
#pointName = "Ch001_ChPower_prs"
proj = {194:'上海印钞厂',316:'企业天地三号楼'}


class Calc018(unittest.TestCase):
    testCaseID = 'Calc018'
    projectName = "上海印钞厂/企业天地三号楼"
    buzName = '计算点点值是否为None'
    errors = []

    #case初始化,获取开始时间以及时间戳,获取写入日志句柄logger
    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))



    #测试用例主函数, 首先清空errors错误信息数组,然后获取所有计算点表，然后判断其中是否包含None的点值，如有则添加进错误信息，最后抛出异常
    def Test(self):
        self.errors = []
        for projId in projectId:
            if projId == 316:
                pointTable =self.getCalcPointsValues(projId, text='CHWPGroup_RunNum')
            else:
                pointTable =self.getCalcPointsValues(projId)
            self.listNonePoint(pointTable, projId)

        BeopTools.raiseError(self.errors, self.testCaseID)


    #获取所有计算点表
    def getCalcPointsValues(self, projectId, text=""):
        a = BeopTools()
        data = {"projectId":projectId,"currentPage":1,"pageSize":10000,"pointType":2,"searchOrder":[["_id",-1]],"searchText":text,"t_time":""}

        rv = None
        try:
            rv = a.postJsonToken(url=url, data=data, t=15)
        except Exception as e:
            print(e.__str__())
            a.writeLogError(self.logger, e.__str__())
            self.errors.append("错误信息[%s]%s---项目名称: %s 项目id: %s 调用%s接口失败!" % (a.getTime(), self.testCaseID, proj[projectId], projectId, url))
            a.raiseError(self.errors, self.testCaseID)
        pointData = rv.get('data', {})
        pointTable = pointData.get("pointTable", [])
        return pointTable

    #筛选为None的计算点值
    def listNonePoint(self, pointTable, projid):
        for point in pointTable:
            pointName = point.get('value')
            pointValue = point.get('pointValue')
            params = point.get('params')
            logic = params.get('logic')
            if 'None' in pointValue:
                self.errors.append("错误信息[%s]%s---计算点值为None!请检查!  项目名称: %s 项目id: %s 计算点名: %s 计算点点值: %s 计算点公式: %s" % (BeopTools.getTime(), self.testCaseID, proj[projid], projid, pointName, pointValue, logic))
            else:
                BeopTools.writeLogInfo(self.logger, "%s---项目名称: %s 项目id: %s 计算点名: %s 计算点点值: %s 计算点公式: %s" % (self.testCaseID, proj[projid], projid, pointName, pointValue, logic))


    #用例结束后的清理工作,记录输出时间以及
    def tearDown(self):
        self.errors = []
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())





if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Calc018('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

