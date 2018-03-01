__author__ = 'woody'
import time
import datetime
import unittest
from interfaceTest import app
from interfaceTest.Methods.BeopTools import *




#项目ID,点名,项目名,dtu名称,引擎名称,是否判断掉线时间,持续时间
#errors = []
flag = {0:"现场点",1:"虚拟点",2:"计算点"}
#url = "http://beop.rnbtech.com.hk/point_tool/getCloudPointTable/179/1/50/ch/2"
#projectId,pointName
proj = [
        ("179","CHW_ChWFlow","嘉民"),
        ("71","test","英文演示06"),("76","test","演示06"),("72","com","上海华为"),("175","test","英文演示09"),
        ("100","cloud","扬州高露洁"),("73","cloud","顺风光电")
#("200","pump","天津团泊"),("201","OutdoorRH","天津光合谷"),,("203","HW","天津武清"),


        ]


param1 = ('CWP001_EnergySavingP','CWP001_PumpOnOff','CWP001_PumpPower')
param2 = ('CWP002_EnergySavingP','CWP002_PumpOnOff','CWP002_PumpPower')
param3 = ('CWV_CWP1','CWV_onoff','ChCWV001_ValveOpenStatus','ChCWV002_ValveOpenStatus','ChCWV003_ValveOpenStatus','CWP001_PumpOnOff')
param4 = ('CWV_CWP2','CWV_onoff','ChCWV001_ValveOpenStatus','ChCWV002_ValveOpenStatus','ChCWV003_ValveOpenStatus','CWP002_PumpOnOff')


projectId = 186
mysqlName = "rt_data186"



class Calc013(unittest.TestCase):
    testCaseID = 'Calc013'
    projectName = "华滋奔腾项目"
    buzName = '管道以及节能率是否更新'
    start = 0.0
    now = 0
    startTime = ""

    #url = "http://beop.rnbtech.com.hk/admin/dataPointManager/search/"
    errors = []
    #offline = []


    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.errors = []



    def Test(self):

        #a = BeopTools()

        #self.checkValue(param1)
        #self.checkValue(param2)

        self.checkValue2(param3)
        self.checkValue2(param4)
        self.raiseError(self.errors)




    def getData(self,projId,pointName,pointType):
        a = BeopTools()
        rv = None
        url = "http://%s/point_tool/getCloudPointTable/" % app.config['SERVERIP']
        json_data = {"projectId":projId,"currentPage":1,"pageSize":50,"pointType":pointType,"searchOrder":[["_id",-1]],"searchText":pointName}


        try:
            rv = a.postJsonToken(url=url, data=json_data, t=10)
            pointTable = rv.get('data')
            pointTable = pointTable.get('pointTable')
            point = [x for x in pointTable if x.get('value') == pointName][0]
            rv = point.get("pointValue")
            t = point.get('pointTime')+':00'
            print("%s点在%s时的值为%s" % (pointName, t, rv))
        except Exception as e:
            print(e.__str__())
            self.errors.append("错误信息接口: %s 项目id: 项目名: %s %s搜索'%s'计算点未得到返回结果。" % (url, projId, self.projectName, pointName))
        return rv

    def checkValue(self,param):
        #获取计算点的值
        rv = self.getData(projectId,param[0],2)
        if rv is not None and rv != 'null' and rv:
            print("计算点点值不为None!%s点值为%s" % (param[0], rv))

        #org1 = float(self.getData(projectId,param[1],0))
        org1 = float(self.getData(projectId,param[1],0))
        org2 = float(self.getData(projectId,param[2],0))
        if org1 > 0 and org2 < 75:
           expect = (1 - org2 / 75) * 100
        else:
            expect = 0


        if float(expect) == float(rv):
            print("%s计算点按照公式求出的值与预期相符!" % param[0])
        else:
            self.errors.append("错误信息%s计算点按照公式求出的值与预期不相符!可能是数据未更新!项目名:%s 项目id: %s mysql collection:%s 预期结果:%s 实际结果:%s" % (param[0], self.projectName, projectId, mysqlName, expect, rv))
        #print(expect)


    def checkValue2(self,param):
        #获取计算点的值
        rv = self.getData(projectId,param[0],2)
        if rv is not None and rv != 'null' and rv:
            print("计算点点值不为None!%s点值为%s" % (param[0], rv))

        org1 = 0
        org1_1 = float(self.getData(projectId,param[2],0))
        org1_2 = float(self.getData(projectId,param[3],0))
        org1_3 = float(self.getData(projectId,param[4],0))
        org = float(self.getData(projectId,param[1],2))
        #org2 = float(self.getData(projectId,param[5],0))
        if (org1_1 + org1_2 + org1_3) > 0:
            org1 = 1
        else:
            org1 = 0
        if float(org) == float(org1):
            print("%s计算点按照公式求出的值与预期相符!" % param[1])
            org2 = float(self.getData(projectId,param[5],0))
            expect = 0

            '''
            if (get_data('CWV_onoff')) and (get_data('CWP001_PumpOnOff')):
                return 1
            else:
                return 0
            '''

            if org1 and org2:
               expect = 1
            else:
                expect = 0

            if float(expect) == float(rv):
                print("%s计算点按照公式求出的值与预期相符!" % param[0])
            else:
                self.errors.append("错误信息%s管道计算点值与预期不相符!可能导致华滋奔腾--运行检视--管道水流动画没有及时更新!项目名:%s 项目id: %s mysql collection:%s 预期结果:%s 实际结果:%s" % (param[0], self.projectName, projectId, mysqlName, expect, rv))
            #print(expect)
        else:
            self.errors.append("错误信息%s管道内部计算点值与预期不相符!可能导致华滋奔腾--运行检视--管道水流动画没有及时更新,请检查!项目名:%s 项目id: %s mysql collection:%s 预期结果:%s 实际结果:%s" % (param[1], self.projectName, projectId, mysqlName,  org1, org))





    #抛出异常函数
    def raiseError(self,error):
        if error != []:
            #print("\n".join(error))
            assert 0,"\n".join(error)
        else:
            pass

    def tearDown(self):
        self.errors = []
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        ##info.append([self.testCaseID, use, now])




if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Calc013('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
    #unittest.main()
