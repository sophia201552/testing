__author__ = 'sophia'

from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import sys
import unittest
import time


class Asset001(unittest.TestCase):
    testCaseID = 'Asset001'
    projectName = "不针对项目"
    buzName = 'Asset接口测试'
    timeout = 15
    serverip = '192.168.1.160'
    # serverip = app.config['SERVERIP']
    url_add = "http://%s/asset/maintainRecords/add" % (serverip)
    url_delete = "http://%s/asset/maintainRecords/del" % (serverip)
    data_add_correct=[('4566','测试',"2016-08-08 05:00:00",[{"name":"12","url":"http://beop.rnbtech.com.hk/","time":"45667","user":"7888"},{}]),
                     ("may","ceshi","2016-08-08 05:25:00",[{"name":"","url":"","time":"","user":""},{}])]
    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.errors = []
        self.correctAdd(self.data_add_correct)
        self.correctDelete()
        self.errorAdd()
        self.errorDelete()
        BeopTools.raiseError(self.errors, self.testCaseID)


    #使用正确的参数添加
    def correctAdd(self,correctadd):
        for i in range(len(correctadd)):
            correct_add={"operator":correctadd[i][0],"cost":"","content":correctadd[i][1],"thing_id":"57620aa2833c9728b8bfe00e","startTime":correctadd[i][2],"attachments":correctadd[i][3]}
            return_add= BeopTools.postDataExcept(url=self.url_add, data=correct_add,timeout=self.timeout,testCaseID=self.testCaseID)
            if (isinstance(return_add,dict) and return_add.get('success') ==True ):
                print('%s添加维修记录成功' % self.url_add)
            else:
                self.errors.append("错误信息[%s]%s---请求%s接口使用参数%s添加维修记录失败返回值%s" % (BeopTools.getTime(), self.testCaseID,self.url_add, correct_add, str(return_add)))

    #使用正确的参数删除
    def correctDelete(self):
        data_delete_correct={'_id':'57ac1cab5e8fb31548209628'}
        return_delete= BeopTools.postDataExcept(url=self.url_delete, data=data_delete_correct,timeout=self.timeout,testCaseID=self.testCaseID)
        if (isinstance(return_delete,dict) and return_delete.get('success') ==True ):
            print('%s删除维修记录成功' % self.url_delete)
        else:
            self.errors.append("错误信息[%s]%s---请求%s接口使用参数%s删除维修记录失败返回值%s" % (BeopTools.getTime(), self.testCaseID,self.url_delete, data_delete_correct, str(return_delete)))


    #使用错误的参数添加
    def errorAdd(self):
        error_add={}
        return_add= BeopTools.postDataExcept(url=self.url_add, data=error_add,timeout=self.timeout,testCaseID=self.testCaseID)
        if (isinstance(return_add,dict) and return_add.get('success') ==False ):
            print('%s空的参数{}添加维修记录没有成功' % self.url_add)
        else:
           self.errors.append( "错误信息[%s]%s---请求%s接口使用参数%s添加维修记录成功了返回值%s" % (BeopTools.getTime(), self.testCaseID,self.url_add, error_add, str(return_add)))

    #使用错误的参数删除
    def errorDelete(self):
        error_delete={'_id':None}
        return_delete= BeopTools.postDataExcept(url=self.url_delete, data=error_delete,timeout=self.timeout,testCaseID=self.testCaseID)
        if (isinstance(return_delete,dict) and return_delete.get('success') ==False ):
            print('%s空的_id删除维修记录没有成功' % self.url_delete)
        else:
            self.errors.append( "错误信息[%s]%s---请求%s接口使用参数%s删除维修记录成功了返回值%s" % (BeopTools.getTime(), self.testCaseID,self.url_delete, error_delete, str(return_delete)))



    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Asset001('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
