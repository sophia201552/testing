__author__ = 'woody'
import unittest
import sys
from interfaceTest.Methods.BeopTools import *
from interfaceTest import app


'''
projectId = 194
pointName = 'Plant001_COP'
url = "http://121.41.28.69:4000/calcpoint/getdepend/%d/%s" % (projectId, pointName)
#pointName = "Ch001_ChPower_prs"
flag0 = ["PriChWTempReturn01", "CWPPower05", "PriChWPPower03", "CWPPower04", "CWPPower01", "CTPower06", "ChPower06", "CTPower01", "PriChWPOnOff05", "CTPower03", "PriChWPOnOff02", "PriChWPPower02", "ChOnOff03", "CWPPower02", "PriChWPOnOff06", "PriChWPPower04", "PriChWPPower05", "ChOnOff06", "PriChWPPower06", "ChPower02", "CTPower02", "PriChWPOnOff01", "ChPower03", "CWPPower03", "ChOnOff05", "CWPPower06", "ChPower04", "CTPower05", "ChOnOff02", "PriChWPPower01", "PriChWTempSupply01", "PriChWPOnOff03", "PriChWFlow01", "CTPower04", "ChPower01", "PriChWPOnOff04", "ChOnOff01", "ChOnOff04", "ChPower05"]
flag2 = ["CWPGroupTotal001_GroupPower", "CTGroupTotal001_GroupPower", "ChGroupTotal001_GroupPower", "Plant001_GroupPower", "Plant001_Load", "PCHWPGroupTotal001_GroupPower", "ChGroupTotal001_RunNum", "Plant001_Eff", "PCHWPGroupTotal001_RunNum"]
'''

paramsCOP = dict(
    projectId = 194,
    pointName = 'Plant001_COP',
    url = "http://%s/calcpoint/getdepend/194/Plant001_COP" % app.config['EXPERT_CONTAINER_URL'],
    flag0 = ["PriChWTempReturn01", "CWPPower05", "PriChWPPower03", "CWPPower04", "CWPPower01", "CTPower06", "ChPower06", "CTPower01", "PriChWPOnOff05", "CTPower03", "PriChWPOnOff02", "PriChWPPower02", "ChOnOff03", "CWPPower02", "PriChWPOnOff06", "PriChWPPower04", "PriChWPPower05", "ChOnOff06", "PriChWPPower06", "ChPower02", "CTPower02", "PriChWPOnOff01", "ChPower03", "CWPPower03", "ChOnOff05", "CWPPower06", "ChPower04", "CTPower05", "ChOnOff02", "PriChWPPower01", "PriChWTempSupply01", "PriChWPOnOff03", "PriChWFlow01", "CTPower04", "ChPower01", "PriChWPOnOff04", "ChOnOff01", "ChOnOff04", "ChPower05"],
    flag2 = ["CWPGroupTotal001_GroupPower", "CTGroupTotal001_GroupPower", "ChGroupTotal001_GroupPower", "Plant001_GroupPower", "Plant001_Load", "PCHWPGroupTotal001_GroupPower", "ChGroupTotal001_RunNum", "Plant001_Eff", "PCHWPGroupTotal001_RunNum"]
)

paramsChgroup = dict(
    projectId = 330,
    pointName = 'ChGroupTotal001_RunNum',
    url = 'http://%s/calcpoint/getdepend/330/ChGroupTotal001_RunNum' % app.config['EXPERT_CONTAINER_URL'],
    flag2 = [],
    flag0 = ["CH001_ChOnOff", "CH002_ChOnOff", "CH003_ChOnOff", "CH004_ChOnOff"]

)



class Calc019(unittest.TestCase):
    testCaseID = 'Calc019'
    projectName = "上海印钞厂/成都中海国际中心"
    buzName = '查看计算点依赖点'
    errors = []


    #case初始化,获取开始时间以及时间戳,获取写入日志句柄logger
    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))




    def Test(self):
        '测试用例主函数, 首先清空errors错误信息数组,然后获取所有计算点表，然后判断其中是否包含None的点值，如有则添加进错误信息，最后抛出异常'
        self.errors = []
        self.all(paramsCOP)
        #self.all(paramsChgroup)


        BeopTools.raiseError(self.errors, self.testCaseID)


    def all(self, params):
        pointData = self.getData(params)
        points = self.getDependPoint(pointData, params)
        self.compare(points, params)

    def getData(self, params):
        '获取所有依赖点表'
        #获取BeopTools类的实例
        a = BeopTools()
        #设置默认返回结果为{}
        rv = {}
        try:
            rv = a.tokenGet(url=params.get('url'), timeout=10)
        except Exception as e:
            print(e.__str__())
            a.writeLogError(self.logger, e.__str__())
            self.errors.append("错误信息[%s]%s---访问%s接口失败!" % (a.getTime(), self.testCaseID, params.get('url')))
            a.raiseError(self.errors, self.testCaseID)
        return rv




    def getDependPoint(self, rv, params):
        '找出依赖点并放入数组'
        if rv.get('error') == 0:
            points = rv.get('value', {})
            flag0_points = points.get('flag0', [])
            flag2_points = points.get('flag2', [])
            return (flag0_points, flag2_points)
        else:
            self.errors.append("错误信息[%s]%s---项目id:%s 项目名称:%s 发送get请求接口:%s 返回数据为%s !其中error不为0!" % (BeopTools.getTime(), self.testCaseID, params.get('projectId'), self.projectName, params.get('url'), json.dumps(rv)))


    def compare(self, points, params):
        '比较点是否与预期一致'
        flag0_points = points[0]
        flag2_points = points[1]
        if sorted(flag0_points) == sorted(params['flag0']) and sorted(flag2_points) == sorted(params['flag2']):
            print('依赖点测试通过')
            BeopTools.writeLogInfo(self.logger, "项目id:%s 项目名称:%s 发送get请求接口:%s 返回计算点的依赖点数组与预期的依赖点一致!" % (params.get('projectId'), self.projectName, params.get('url')))
        else:
            self.errors.append("错误信息[%s]%s---项目id:%s 项目名称:%s 发送get请求接口:%s 返回计算点的依赖点数组与预期的依赖点不符!请检查!" % (BeopTools.getTime(), self.testCaseID, params.get('projectId'), self.projectName, params.get('url')))



    #用例结束后的清理工作,记录输出时间以及
    def tearDown(self):
        self.errors = []
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())





if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Calc019('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

