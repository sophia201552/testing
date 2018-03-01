__author__ = 'woody'

import time
import datetime
import unittest
import sys
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
#项目ID,点名,项目名,dtu名称,引擎名称,是否判断掉线时间,持续时间

url = "http://%s/diagnosis/getAll/" % app.config['SERVICE_URL']
existId = [72,76,71]
wrongId = ['haha',-1,100000000,True,None]


class Service002(unittest.TestCase):
    testCaseID = 'Service002'
    projectName = "BeopService"
    buzName = '获取诊断接口diagnosis/getAll/<projectId>'
    start = 0.0
    now = 0
    startTime = ""
    errors = []

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))



    def writeLog(self, text):
        #logger = self.init_log()
        self.logger.info('[%s]---' % time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) + '' + text)

    def getTime(self):
        return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

    def Test(self):
        self.errors = []
        #先获取正确的数据
        self.getExisted()
        #self.getWrong()
        self.raiseError(self.errors)


    def getDiagnosisData(self,projectId):
        rv = None
        tool = BeopTools()

        try:
            rv = tool.tokenGet(url=url+str(projectId), timeout=60)
            #print(rv)
        except Exception as e:
            print(e.__str__())
            self.writeLog(e.__str__())
            self.errors.append("错误信息[%s]%s---%s!" % (tool.getTime(), self.testCaseID, e.__str__(), ))
            BeopTools.raiseError(self.errors, self.testCaseID)
        return rv


    def getExisted(self):
        for projId in existId:
            rv = self.getDiagnosisData(projId)
            #print("获取到了项目id为%s的诊断数据!" % projId)
            if isinstance(rv,dict) and rv:
                equipments = rv.get("equipments",[])
                faults = rv.get("faults",[])
                notices = rv.get("notices",[])
                zones = rv.get("zones",[])
                if equipments or faults or notices or zones:
                    print("projectId为%s返回结果中有数据!" % projId)
                    print("项目id:%s equipments个数为%d." % (projId, len(equipments)))
                    print("项目id:%s faults个数为%d." % (projId, len(faults)))
                    print("项目id:%s notices个数为%d." % (projId, len(notices)))
                    print("项目id:%s zones个数为%d." % (projId, len(zones)))
                else:
                    self.errors.append("错误信息[%s]%s---访问%s接口,projectId为%s返回结果equipments,faults,notices,zones中均无数据!" % (BeopTools.getTime(), self.testCaseID, url+str(projId), projId))
            else:
                self.errors.append("错误信息[%s]%s---访问%s接口,projectId为%s,返回结果不为dict!" % (BeopTools.getTime(), self.testCaseID, url+str(projId), projId))


    def getWrong(self):
        for projId in wrongId:
            rv = self.getDiagnosisData(projId)
            #print("获取到了项目id为%s的诊断数据!" % projId)
            if isinstance(rv,dict) and rv:
                equipments = rv.get("equipments",[])
                faults = rv.get("faults",[])
                notices = rv.get("notices",[])
                zones = rv.get("zones",[])
                if equipments or faults or notices or zones:
                    self.errors.append("错误信息[%s]%s---访问%s接口,projectId为%s返回结果equipments,faults,notices,zones中不该出现数据!" % (BeopTools.getTime(), self.testCaseID, url+str(projId), projId))
                else:
                    print("projectId为%s返回结果无数据!" % projId)
                    #errors.append("访问%s接口,projectId为%s返回结果equipments,faults,notices,zones中均无数据!" % (url+str(projId), projId))
            else:
                self.errors.append("错误信息[%s]%s---访问%s接口,projectId为%s,返回结果为None!" % (BeopTools.getTime(),  self.testCaseID, url+str(projId), projId))






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
    suite.addTest(Service002('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
    #unittest.main()
