__author__ = 'murphy'
import unittest
import sys
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import time, datetime
from enum import Enum

class OperateType(Enum):
    taskAdd = 1
    taskDel = 2
    taskEdit = 3
    taskGet = 4

class Service022(unittest.TestCase):
    testCaseID = 'Service022'
    projectName = ""
    buzName = 'Mongo表DataTaskConfig接口用例测试'
    start = 0.0
    now = 0
    startTime = ""
    errors = []
    projId = 0
    serverIp = app.config['SERVERIP']

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def tearDown(self):
        self.errors = []
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

    def Test(self):
        self.errors = []
        self.TestAddInterface()
        self.TestDeleteAndEditInterface()

        BeopTools.raiseError(self.errors, self.testCaseID)

    def TaskOperation(self, opType, postData):
        strUrl = ""
        strOpTypeName = ""
        if OperateType.taskAdd == opType:
            strUrl = "http://%s/dataTask/new/%d" % (self.serverIp, self.projId)
            strOpTypeName = "新建"
        elif OperateType.taskDel == opType:
            strUrl = "http://%s/dataTask/delete/%d" % (self.serverIp, self.projId)
            strOpTypeName = "删除"
        elif OperateType.taskEdit == opType:
            strUrl = "http://%s/dataTask/edit/%d" % (self.serverIp, self.projId)
            strOpTypeName = "修改"
        elif OperateType.taskGet == opType:
            strUrl = "http://%s/dataTask/get/%d" % (self.serverIp, self.projId)
            strOpTypeName = "获取"
        else:
            self.errors.append("接口传参错误！")
            return None
        try:
            rv = BeopTools.postDataExcept(url=strUrl, data=postData, timeout=3000, testCaseID=self.testCaseID)
            if rv.get('status'):
                print("%s成功！" % strOpTypeName)
            else:
                self.errors.append("错误信息[%s]%s---访问%s接口,返回结果为%s!" % (BeopTools.getTime(), self.testCaseID, strUrl, str(rv)))
        except Exception as e:
            print(e.__str__())
            BeopTools.writeLogError(self.logger, e.__str__())
            self.errors.append("错误信息[%s]%s---%s 调用时异常:%s" % (BeopTools.getTime(), self.testCaseID, strOpTypeName, e.__str__()))
        time.sleep(1)
        return rv

    def TestAddInterface(self):
        postDataAdd1 = {
            'type': 0,
            'status': 0,
            'period': 3,
            'mode': 'appoint',
            'schedule': ['01:00', '02:00'],
            'param': {'pointList': ['name1', 'name1'], 'patchTimeMinute': 6}
        }
        postDataAdd2 = {
            'type': 1,
            'status': 0,
            'period': 6,
            'mode': 'appoint',
            'schedule': ['03:00', '04:00'],
            'param': {'apiType': 'byId', 'code': '11', 'ptName': 'name3'}
        }
        postDataAdd3 = {
            'type': 4,
            'status': 0,
            'period': 9,
            'mode': 'periodic',
            'schedule': ['05:00', '06:00'],
            'param': [21, 22, 23]
        }
        resAdd1 = self.TaskOperation(OperateType.taskAdd, postDataAdd1)
        resAdd2 = self.TaskOperation(OperateType.taskAdd, postDataAdd2)
        resAdd3 = self.TaskOperation(OperateType.taskAdd, postDataAdd3)

        postDataGet1 = {'ids': [resAdd1.get('data')]}
        resGet1 = self.TaskOperation(OperateType.taskGet, postDataGet1)
        if not resGet1.get('status'):
            self.errors.append("新增后获取%s:数据失败！" % resAdd1.get('data'))

        postDataGet2 = {'ids': [resAdd2.get('data')]}
        resGet2 = self.TaskOperation(OperateType.taskGet, postDataGet2)
        if not resGet2.get('status'):
            self.errors.append("新增后获取%s:数据失败！" % resAdd1.get('data'))

        postDataGet3 = {'ids': [resAdd3.get('data')]}
        resGet3 = self.TaskOperation(OperateType.taskGet, postDataGet3)
        if not resGet3.get('status'):
            self.errors.append("新增后获取%s:数据失败！" % resAdd1.get('data'))

    def TestDeleteAndEditInterface(self):
        postDataAdd = {
            'type': 0,
            'status': 0,
            'period': 11,
            'mode': 'appoint',
            'schedule': ['07:00', '08:00'],
            'param': {'pointList': ['name4', 'name5'], 'patchTimeMinute': 11}
        }
        resAdd = self.TaskOperation(OperateType.taskAdd, postDataAdd)
        strAddId = resAdd.get('data')
        if not resAdd.get('status'):
            self.errors.append("新增%s:数据失败！" % strAddId)

        postDataEdit = {
            'id': strAddId,
            'type': 0,
            'status': 1,
            'period': 15,
            'mode': 'appoint',
            'schedule': ['09:00', '10:00'],
            'param': {'pointList': ['name6', 'name7'], 'patchTimeMinute': 12}
        }
        resEdit = self.TaskOperation(OperateType.taskEdit, postDataEdit)
        if not resEdit.get('status'):
            self.errors.append("编辑%s:数据失败！" % resEdit.get('data'))

        postDataDel = {'ids': [strAddId]}
        resDel = self.TaskOperation(OperateType.taskDel, postDataDel)
        if not resDel.get('status'):
            self.errors.append("删除%s:数据失败！" % resDel.get('data'))


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Service022('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
