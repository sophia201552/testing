__author__ = 'sophia'
import time
import datetime
import unittest
from interfaceTest.Methods.BeopTools import *
from interfaceTest import app
projectId = 1
serverip = app.config['SERVERIP']
get_url = "http://%s/point_tool/getCloudPointTable/" % serverip
edit_url = "http://%s/point_tool/editCloudPoint/%d/" % (serverip,projectId)
test_url = "http://121.41.28.69:4000/cloudPoint/onlinetest"
t=10

class Calc002(unittest.TestCase):
    testCaseID = 'Calc002'
    projectName = "上海中芯国际"
    buzName = '数据管理--修改计算点,并验证常量计算点值是否正确'
    start = 0.0
    now = 0
    startTime = ""

    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())

    def Test(self):
        self.alterPoint()

    def alterPoint(self):
        a = BeopTools()
        data={"projectId":1,"currentPage":1,"pointType":2,"searchText":"","t_time":"","pageSize":100}
        try:
            get_data = a.postJsonToken(get_url,data=data, t=t)
        except Exception as e:
            print(e.__str__())
            assert 0,"错误信息访问%s接口出现问题,延时超过%d秒" % (edit_url, t)
        want_to_alter = get_data['data']['pointTable'][-1]
        id = want_to_alter['_id']
        moduleName = want_to_alter['params']['moduleName']
        logic = want_to_alter['params']['logic']
        value = want_to_alter['value']
        point_edit_before = {'remark': '', 'remark_en': "", 'id': id, 'value': value, 'flag': 2, 'format': 'm5',
                             'logic': logic, 'moduleName': moduleName}
        point_edit_after = { 'id': id, 'value':'wwww', 'flag': 2,
                            'alias':'w', 'moduleName':'calcpoint_1_wwww'}
        try:
            pf = a.postForm(url=edit_url, data=point_edit_after, t=10)
        except Exception as e:
            print(e.__str__())
            assert 0,"错误信息访问%s接口出现问题,延时超过%d秒" % (edit_url, t)
        try:
            pf1 = a.postForm(url=edit_url, data=point_edit_before, t=10)
        except Exception as e:
            print(e.__str__())
            assert 0,"错误信息访问%s接口出现问题,延时超过%d秒" % (edit_url, t)
        if pf.get("success") :
            print("编辑成功")
        else:
            assert 0,'错误信息编辑功能失败请查看还是原来的内容%s' % logic



    def tearDown(self):
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        #info.append([self.testCaseID, use, now])


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Calc002('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
    #unittest.main()
