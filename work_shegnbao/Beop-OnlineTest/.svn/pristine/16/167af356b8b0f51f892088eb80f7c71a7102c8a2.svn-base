__author__ = 'sophia'

from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import sys
import unittest
import time


class Patrol002(unittest.TestCase):
    testCaseID = 'Patrol002'
    projectName = "巡更系统"
    buzName = '巡更路线测试增删改'
    timeout = 60
    serverip = app.config['SERVERIP']
    projectId = 76
    url_getList = "http://%s/patrol/path/getAll/%d" % (serverip, projectId)
    url_save = "http://%s/patrol/path/save/%d" % (serverip, projectId)
    url_remove = "http://%s/patrol/path/remove/%d/" % (serverip, projectId)
    url_check = "http://%s/patrol/path/getListByPointId/%d/" % (serverip, projectId)

    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.errors = []
        self.point()
        BeopTools.raiseError(self.errors, self.testCaseID)

    def point(self):
        # 验证获取巡更路线的接口
        data_get = BeopTools.getDataExcept(url=self.url_getList,timeout=self.timeout,testCaseID=self.testCaseID)
        id=''
        if (data_get is not None):
            print('%s获取巡更路线成功' % self.url_getList)
        else:
            assert 0,"错误信息[%s]%s---请求%s接口获取巡更路线的值为空,返回为%s" % (BeopTools.getTime(), self.testCaseID, self.url_getList,data_get)


        # 验证新建巡更路线的接口
        test_data_new ={"name":"111","elapse":30,"timeRange":"-60 +60","status":1,"path":["56e22ff1ae440a05d0ea2162"]}
        data_save = BeopTools.postDataExcept(url=self.url_save, data=test_data_new,timeout=self.timeout,testCaseID=self.testCaseID)
        if (data_save != None and data_save.get('data') != ''):
            if(len(data_get['data'])!=0):
                id=data_get['data'][-1]['_id']
            else:
                id=data_get['data']['_id']
            print('%s新建巡更路线成功' % self.url_save)
        else:
            assert 0,"错误信息[%s]%s---请求%s接口使用参数%s新建巡更路线失败返回值%s" % (BeopTools.getTime(), self.testCaseID, self.url_save,test_data_new, data_save)


        # 验证编辑巡更路线的接口
        test_data_edit = {"_id":id,"name":"3333","elapse":30,"timeRange":"-60 +60","path":["56e22ff1ae440a05d0ea2162"]}
        data_edit = BeopTools.postDataExcept(url=self.url_save, data=test_data_edit,timeout=self.timeout,testCaseID=self.testCaseID)
        if (data_edit != None and data_edit.get('data') != ''):
            print('%s编辑巡更路线成功' % self.url_save)
        else:
            assert 0, "错误信息[%s]%s---请求%s接口使用参数%s编辑巡更路线失败返回值%s" % (BeopTools.getTime(), self.testCaseID,self.url_save, test_data_edit, data_edit)


        # 验证删除巡更路线接口
        test_data_delete={"_id":id,"status":0}
        data_delete = BeopTools.postDataExcept(url=self.url_remove+test_data_delete['_id'], data=test_data_delete,timeout=self.timeout,testCaseID=self.testCaseID)
        if (data_delete.get('data') ==True ):
            print('%s删除巡更路线成功' % self.url_remove)
        else:
            assert 0,"错误信息[%s]%s---请求%s接口使用参数%s删除巡更路线失败返回值%s" % (BeopTools.getTime(), self.testCaseID, self.url_remove+test_data_delete['_id'],test_data_delete, data_delete)




    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Patrol002('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
