__author__ = 'sophia'
import unittest
import sys
from interfaceTest.Methods.BeopTools import *
from interfaceTest import app



class Calc028(unittest.TestCase):
    testCaseID = 'Calc028'
    projectName = "早巡项目"
    buzName = '检查计算点中是否是None'
    url = 'http://%s/point_tool/getCloudPointTable/' % app.config['SERVERIP']
    TIMEOUT = 30
    params =  app.config['CHECK_PROJECT']
    emails = app.config['CALC028_EMAILS']
    specialProject = [194,203]

    #case初始化,获取开始时间以及时间戳,获取写入日志句柄logger
    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))
        self.a = BeopTools()

    def Test(self):
        self.errors = []
        self.point()
        self.project=[]
        #self.a.raiseError(self.errors, self.testCaseID)
        for error in self.errors:
            if('项目' in error):
                p=error.split('项目')[0]
                self.project.append(p)
        s='  ||  '.join(list(set(self.project)))+'这些项目中计算点为None具体的点请看下列内容\n'

        if(self.project):
            self.a.raiseError(self.errors, self.testCaseID)
            #BeopTools.send_email(self.emails, self.testCaseID, [s]+self.errors, self.testCaseID)

    def point(self):
        for param in self.params:
            try:
                data = {"projectId":param[0],"currentPage":1,"pointType":2,"searchText":' ',"t_time":"","pageSize":10000}
                rv = self.a.postDataExcept(url=self.url, data=data, timeout=self.TIMEOUT)
                if rv and rv.get('success',0):
                    print('检查%s项目'%param[1])
                    values=rv['data']['pointTable']
                    if not self.checkPoint(values):
                        continue
                    n=0
                    for value in values:
                        if(value.get('pointValue',0)=='None') and "test" not in value.get("value").lower():
                            if(n==0):
                                self.errors.append('错误信息%s项目:'%param[1])
                            n=n+1
                            self.errors.append("错误信息%s" % value['value'])
                else:
                    self.errors.append("错误信息%s接口, 参数: %s 返回预期success为true实际为%s" % (self.url, json.dumps(data), json.dumps(rv.get('success'))))
            except Exception as e:
                print(e.__str__())
                self.errors.append('错误信息%s' % (e.__str__()))
    def checkPoint(self,data):
        num = 0
        if data[0].get("projId") in self.specialProject:
            for i in data:
                if i.get('pointValue',0)=='None':
                    num += 1
            result = num/(data.__len__())>0.5
            return result
        else:
            return True




    #用例结束后的清理工作,记录输出时间以及
    def tearDown(self):
        self.errors = []
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Calc028('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

