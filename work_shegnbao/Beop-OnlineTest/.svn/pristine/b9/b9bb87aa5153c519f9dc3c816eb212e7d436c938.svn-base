__author__ = 'sophia'

from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import sys
import unittest
import time
from datetime import datetime


class WorkFlow003(unittest.TestCase):
    testCaseID = 'WorkFlow003'
    projectName = "不针对项目"
    buzName = '测试工单增加修改删除项目接口'
    timeout = 15
    serverip = app.config['SERVERIP']
    url_new = "http://%s/workflow/taskGroup/new" % (serverip)
    url_update="http://%s/workflow/taskGroupProcess/edit" % (serverip)
    url_delete="http://%s/workflow/group/delete/" % (serverip)
    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.errors = []
        self.workFlow()
        BeopTools.raiseError(self.errors, self.testCaseID)

    def workFlow(self):
        new_data = {"creator":2265,"name":"test","desc":"test","team_id":"583aee586455143634ed8665","createTime":"","process":[],"arch":[]}
        try:
            rv = BeopTools.postJsonToken(url=self.url_new, data=new_data, t=self.timeout)
            work_id = ""
            if (isinstance(rv, dict) and rv.get('success')):
                work_id = rv['data']['groupId']
                print('使用正确的参数返回值正确%s' % str(rv))
            else:
                self.errors.append("错误信息[%s]%s--- 调用%s接口使用%s参数返回值success不为True,为%s!" % (BeopTools.getTime(), self.testCaseID, self.url_new, new_data, str(rv)))
                return

            update_data = {"data":{"desc":"6666任然仍然若若若若","name":"12445664444","team_id":"583aee586455143634ed8665",
                                   "createTime":self.startTime,"arch":[],"process":["1482905774886001b020cb16"]},"id":work_id}

            rv = BeopTools.postJsonToken(url=self.url_update, data=update_data, t=self.timeout)
            #
            if (isinstance(rv, dict) and rv.get('success')):
                print('使用正确的参数返回值正确%s' % str(rv))
            else:
                self.errors.append("错误信息[%s]%s--- 调用%s接口使用%s参数返回值success不为True,为%s!" % (BeopTools.getTime(), self.testCaseID, self.url_update+str(work_id)+'/2411', update_data, str(rv)))

            rv = BeopTools.postJsonToken(url=self.url_delete+str(work_id)+'/2265',data='', t=self.timeout)
            if (isinstance(rv, dict) and rv.get('success')):
                print('使用正确的参数返回值正确%s' % str(rv))
            else:
                self.errors.append("错误信息[%s]%s--- 调用%s接口使用返回值success不为True,为%s!" % (BeopTools.getTime(), self.testCaseID, self.url_delete+str(work_id)+'/2411',  str(rv)))

        except Exception as e:
            print(e.__str__())
            BeopTools.writeLogError(self.logger, e.__str__())
            assert 0, "错误信息[%s]%s---workFlow method error:%s!" % (BeopTools.getTime(), self.testCaseID, e.__str__())

    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(WorkFlow003('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
