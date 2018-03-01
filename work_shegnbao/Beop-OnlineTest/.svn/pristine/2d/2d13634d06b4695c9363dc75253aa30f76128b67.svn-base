__author__ = 'sophia'

from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest import app
import sys
import unittest
import time
from datetime import datetime


class WorkFlow001(unittest.TestCase):
    testCaseID = 'WorkFlow001'
    projectName = "不针对项目"
    buzName = '测试工单增加修改删除接口,工单开始,完成,审核接口'
    timeout = 15
    serverip = app.config['SERVERIP']
    userId = "2265"
    url_new = "http://%s/workflow/task/save/" % (serverip)
    url_update = "http://%s/workflow/transaction/update/" % (serverip)
    url_delete = "http://%s/workflow/task/delete/" % (serverip)
    url_start = 'http://%s/workflow/transaction/start_trans/%s/' % (serverip, userId)
    url_complete = 'http://%s/workflow/transaction/complete/' % (serverip)
    url_pass = 'http://%s/workflow/transaction/pass_verify/' % (serverip)

    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.errors = []
        self.workFlow()
        BeopTools.raiseError(self.errors, self.testCaseID)

    def workFlow(self):
        try:
            # 新建工单
            new_data = {
            "fields": {"taskGroup": "58287f9b645514043025d43b", "process": "14810297660380683bc2c9a0", "title": "1841",
                       "dueDate": "2016-12-26", "critical": "0", "template_id": "56f13216e153db0248d3fb91",
                       "detail": "1841", "addedUsers[]": ["1747", "1747"]}, "processMember": {
            "1481029766038068bcdccb36": [{"id": 1747, "username": "sophia201552@163.com",
                                          "userpic": "http://images.rnbtech.com.hk/static/images/avatar/default/20.png",
                                          "userfullname": "sophiatest", "useremail": "sophia201552@163.com"}],
            "14810297660380685ec49e2e": [{"id": 1747, "username": "sophia201552@163.com",
                                          "userpic": "http://images.rnbtech.com.hk/static/images/avatar/default/20.png",
                                          "userfullname": "sophiatest", "useremail": "sophia201552@163.com"}]},
            "watchers": [], "tags": [], "attachment": []}
            rv = BeopTools.postJsonToken(url=self.url_new, data=new_data, t=self.timeout)
            work_id = ""
            if (isinstance(rv, dict) and rv.get('success')):
                work_id = rv['data']
                print('使用正确的参数返回值正确%s' % str(rv))
            else:
                self.errors.append("错误信息[%s]%s--- 调用%s接口使用%s参数返回值success不为True,为%s!" % (
                    BeopTools.getTime(), self.testCaseID, self.url_new, new_data, str(rv)))
                return
            # # 更新工单
            # update_data = {"dueDate": str(datetime.now().date()), "title": "更新工单", "groupId": "2992", "collection": "0",
            #                "critical": "0", "detail": "更新工单", "creator": self.userId, "executor[]": [self.userId],
            #                "verifiers[]": ['2427'], "watchers[]": ['2428'], "userId": int(self.userId),
            #                "transId": work_id}
            # rv = BeopTools.postDataExcept(url=self.url_update, data=update_data, timeout=self.timeout)
            #
            # if (isinstance(rv, dict) and rv.get('success')):
            #     print('使用正确的参数返回值正确%s' % str(rv))
            # else:
            #     self.errors.append("错误信息[%s]%s--- 调用%s接口使用%s参数返回值success不为True,为%s!" % (
            #         BeopTools.getTime(), self.testCaseID, self.url_update + str(work_id), update_data, str(rv)))
            #
            # # 开始工单
            # start_data = {"user_id": int(self.userId)}
            # rv = BeopTools.postDataExcept(url=self.url_start + str(work_id), data=start_data, timeout=self.timeout)
            # if (isinstance(rv, dict) and rv.get('success')):
            #     print('使用正确的参数返回值正确%s' % str(rv))
            # else:
            #     self.errors.append("错误信息[%s]%s--- 调用%s接口使用%s参数返回值success不为True,为%s!" % (
            #         BeopTools.getTime(), self.testCaseID, self.url_start + str(work_id), new_data, str(rv)))
            #
            # # 完成工单
            # complete_data = {"userId": int(self.userId), "transId": work_id}
            # rv = BeopTools.postDataExcept(url=self.url_complete, data=complete_data, timeout=self.timeout)
            # if (isinstance(rv, dict) and rv.get('success')):
            #     print('使用正确的参数返回值正确%s' % str(rv))
            # else:
            #     self.errors.append("错误信息[%s]%s--- 调用%s接口使用%s参数返回值success不为True,为%s!" % (
            #         BeopTools.getTime(), self.testCaseID, self.url_complete, new_data, str(rv)))
            #
            # # 审核工单
            # pass_data = {"userId": 2427, "transId": work_id}
            # rv = BeopTools.postDataExcept(url=self.url_pass, data=pass_data, timeout=self.timeout)
            # if (isinstance(rv, dict) and rv.get('success')):
            #     print('使用正确的参数返回值正确%s' % str(rv))
            # else:
            #     self.errors.append("错误信息[%s]%s--- 调用%s接口使用%s参数返回值success不为True,为%s!" % (
            #         BeopTools.getTime(), self.testCaseID, self.url_pass, new_data, str(rv)))

            # 删除工单
            rv = BeopTools.tokenGet(url=self.url_delete + str(work_id), timeout=self.timeout)
            if (isinstance(rv, dict) and rv.get('success')):
                print('使用正确的参数返回值正确%s' % str(rv))
            else:
                self.errors.append("错误信息[%s]%s--- 调用%s接口使用%s参数返回值success不为True,为%s!" % (
                    BeopTools.getTime(), self.testCaseID, self.url_delete + str(work_id), new_data, str(rv)))


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
    suite.addTest(WorkFlow001('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
