
__author__ = 'kingsley'

import time
import datetime
import unittest
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app


teststate=1  #0调试代码，不读取实际接口，1调试代码读取实际接口
serverip = app.config.get('SERVERIP')
class Smoke002(unittest.TestCase):
    testCaseID = "Smoke002"
    projectName = "无项目"
    buzName = "analysisPort接口工作集增删改及时间统计"
    start = 0.0

    def setUp(self):
        self.start = datetime.datetime.now()

    def getAll(self):
        url ='http://%s/analysis/getAll/67/0' % serverip
        getAllResult = BeopTools.getInstance().getJson(url)
        self.assertNotEqual(getAllResult,None,'Fail：D016-01，%s获取数据失败'%url)
        return getAllResult

    def analysisOperation(self,workspaceoperation):
        url ='http://%s/analysis/anlySync/67' %serverip
        analysisResult = BeopTools.getInstance().postJson(url, workspaceoperation)
        self.assertNotEqual(analysisResult,None,'Fail：D016-2，%s接口返回数据为None'%url)
        resultstatue = analysisResult.get('status')
        if resultstatue != 'OK':
            assert 0,'Fail：D016-3，%s接口返回结果错误不等于OK'%url
        #self.assertNotEqual(analysisResult.get('status'),'OK','Fail：D008-3，%s接口返回结果错误不等于OK'%url)
        return analysisResult


    def Test(self):

        #创建一个工作集名称为“测试工作集001”
        workSpaceName = {"ws":{"create":[{"id":"76b666bd0671442378906688","name":"测试工作集001","modalList":[],"modifyTime":"2015-09-16 12:36"}]}}
        startTime = time.time()
        result1 = self.analysisOperation(workSpaceName)
        endTime = time.time()
        if result1['status'] != 'OK':
            assert 0 ,'Fail：D016-4，创建“测试工作集001”失败,返回状态不是OK！'
        usetime = endTime - startTime
        if usetime >5:
            assert 0 ,'Fail：D016-5，创建“测试工作集001”时间大于5S。'
        print('创建“测试工作集001”成功！耗时%f'%usetime)
        #修改工作集合“测试工作集001”为“测试工作集002”
        workSpaceName = {"ws":{"update":[{"id":"76b666bd0671442378906688","name":"测试工作集02","modifyTime":"2015-09-15 16:55"}]}}
        startTime = time.time()
        result2 = self.analysisOperation(workSpaceName)
        endTime = time.time()
        if result2['status'] != 'OK':
            assert 0 ,'Fail：D016-6，修改“测试工作集001”到“测试工作集002失败”，,返回状态不是OK！'
        usetime = endTime - startTime
        if usetime >5:
            assert 0 ,'Fail：D016-7，修改“测试工作集001”为“测试工作集002”时间大于5S。'
        print('修改“测试工作集001”到“测试工作集002”成功！耗时%f。'%usetime )

        #删除“测试工作集002”
        workSpaceName = {"ws":{"delete":[{"id":"76b666bd0671442378906688"}]}}
        startTime = time.time()
        result3 = self.analysisOperation(workSpaceName)
        endTime = time.time()
        if result3['status'] != 'OK':
            assert 0 ,'Fail：D016-8，删除“测试工作集002”失败,返回状态不是OK！'
        usetime = endTime - startTime
        if usetime >5:
            assert 0 ,'Fail：D016-9，删除“测试工作集002”时间大于5S。'
        print('删除“测试工作集002”成功！耗时%f。'%usetime)
        time.sleep(0.4)

    def tearDown(self):
        self.start = str((datetime.datetime.now() - self.start).seconds)
        self.start = self.start + "s"
        now = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Smoke002('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)