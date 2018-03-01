__author__ = 'woody'
import time
import datetime
import unittest
from interfaceTest.Methods.BeopTools import *
from interfaceTest import app
projectId = 1
serverip = app.config['SERVERIP']
#get_url = "http://%s/point_tool/getCloudPointTable/1/1/50/all/2" % serverip
edit_url = "http://%s/point_tool/editCloudPoint/%d/" % (serverip, projectId)
test_url = "http://%s/cloudPoint/onlinetest" % app.config['EXPERT_CONTAINER_URL']
t=10
point = "woodyNoDel"
errors = []


class Calc009(unittest.TestCase):
    testCaseID = 'Calc009'
    projectName = "上海中芯国际"
    buzName = '数据管理--修改计算点公式'
    start = 0.0
    now = 0
    startTime = ""




    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())

    def Test(self):
        '''
            验证点：
            1.woodyNoDel点首先被修改为常量，调用get_data("woodyNoDel")，看这个公式返回是否为被修改的常量；
            2.再次修改woodyNoDel为get_avg_data_of_last_hour("OutdoorTdbin")，并获取这个值，修改后调用get_data("woodyNoDel")
            看是否与该值一致。
        :return:
        '''
        global errors
        FORMULA = "2"
        formula = "get_avg_data_of_last_hour('OutdoorTdbin')"
        get_avg_value = self.onlineTest("woodyNoDel",'get_data("OutdoorTdbin")')
        self.check(point,FORMULA)
        self.check_variable(point,formula)
        errors2 = errors
        errors = []
        self.raiseError(errors2)



#检查常量公式的值
    def check(self,point,FORMULA):
        rlt = self.editPoint(point,FORMULA)
        if rlt:
            print("编辑点成功!")
            rv = self.onlineTest(point,"get_data('woodyNoDel')")
            if rv == FORMULA:
                print("修改点成功!")
            else:
                errors.append("错误信息调用%s接口获取修改后的点值与预期不符失败!点名: %s, 公式名: %s 预期结果: %s 实际结果: %s " % (test_url, point, FORMULA, FORMULA, rv))


#检查变量公式的值
    def check_variable(self,point,formula):
        value = self.onlineTest(point,formula)
        rlt = self.editPoint(point,formula)
        if rlt:
            print("编辑点成功!")
            rv = self.onlineTest(point,"get_data('woodyNoDel')")
            if rv == value:
                print("修改点成功!")
            else:
                errors.append("错误信息调用%s接口获取修改后的点值与预期不符失败!点名: %s, 公式名: %s 预期结果: %s 实际结果: %s " % (test_url, point, formula, value, rv))


#编辑点的公式内容
    def editPoint(self,point,formula):
        global errors
        a = BeopTools()
        form = {
                    "remark":"",
                    "remark_en":"",
                    "id":"5775e93c833c971621cc349e",
                    "flag":2,
                    "value":point,
                    "format":"m5",
                    "logic":formula,
                    "moduleName":"calcpoint_1_woodyNoDel"
        }
        try:
            r = a.postForm(url=edit_url,data=form,t=t)
        except Exception as e:
            print(e.__str__())
            errors.append("错误信息调用%s接口编辑点出错!点名: %s, 公式名: %s" % (edit_url, point, formula))
        try:
            if r.get("success",False):
                return True
            else:
                errors.append("错误信息调用%s接口编辑点失败!点名: %s, 公式名: %s" % (edit_url, point, formula))
        except Exception as e:
            print(e.__str__())
            errors.append("错误信息调用%s接口编辑点失败!点名: %s, 公式名: %s" % (edit_url, point, formula))
            return False


#在线测试拿到值
    def onlineTest(self,point,formula):
        global errors
        a = BeopTools()
        form = {
            "content":formula,
            "projId":1,
            "pointName":point,
            "moduleName":"calcpoint_1_%s" % point,
            "writeToReal":1
        }
        try:
            r = a.postForm(url=test_url,data=form,t=t)
        except Exception as e:
            print(e.__str__())
            errors.append("错误信息调用%s接口出错!点名: %s, 公式名: %s" % (test_url, point, formula))
            errors2 = errors
            errors = []
            #因为测试接口很重要，直接抛出异常!
            self.raiseError(errors2)
        if r.get("value",None):
            return r.get("value")
        else:
            errors.append("错误信息调用%s接口没有得到返回值!点名: %s, 公式名: %s" % (test_url, point, formula))
            return None
        #print(r.text)




    #抛出异常函数
    def raiseError(self,error):
        if error != []:
            #print("\n".join(error))
            assert 0,"\n".join(error)
        else:
            pass

    def tearDown(self):
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        #info.append([self.testCaseID, use, now])
        print("%s结束,开始时间为: %s 结束时间为%s " % (self.testCaseID, self.startTime, self.now))


if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Calc009('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
    #unittest.main()
