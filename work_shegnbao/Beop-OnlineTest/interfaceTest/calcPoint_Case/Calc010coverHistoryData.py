__author__ = 'woody'
import requests
from interfaceTest.Methods.BeopTools import *
from interfaceTest import app
import json
import time
import datetime
import re
from urllib.parse import urlencode
import unittest
import pymysql


projectId = 1
#项目ID,点名,项目名,dtu名称,引擎名称,是否判断掉线时间,持续时间
errors = []
serverip = app.config['SERVERIP']
edit_url = "http://%s/point_tool/editCloudPoint/%d/" % (serverip, projectId)
point = "woodyHistoryData"
add_url = 'http://%s/repairData/batch' % app.config['EXPERT_CONTAINER_URL']
t = 10




class Calc010(unittest.TestCase):
    testCaseID = 'Calc010'
    projectName = "上海中芯国际"
    buzName = '已有计算点修改公式后补历史数据'
    start = 0.0
    now = 0
    startTime = ""
    projectId = 1


    def setUp(self):
        self.start = datetime.datetime.now()
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())


    def Test(self):
        '''
        1.修改woodyHistoryData点的公式为get_data("OutdoorTdbin")并补历史数据；
        2.取刚补好的历史数据并存入valuesBefore;
        3.修改woodyHistoryData点的公式为get_data("ChAMPS01")并补历史数据;
        4.取刚补好的历史数据并存入valuesAfter并与valuesBefore比较，如果不相等，说明修改点后补数据成功。


        :return:
        '''
        global errors
        a = BeopTools()
        t = self.getTime()
        self.editPoint(point,"get_data('OutdoorTdbin')")
        self.addHistoryData(t)
        #先取历史数据,没有则补全,有也补全一遍
        result = self.getHistoryData(point,t)
        if result:
            print("补全历史数据成功!")
        #修改公式点之前的历史数据

        valuesBefore = [(x.get("value",None),x.get('time',None),x.get("error",None)) for x in result[0]['history']]

        #修改该公式点
        r = self.editPoint(point,"get_data('ChAMPS01')")

        #修改点之后再补历史数据
        if r:
            try:
                self.addHistoryData(t)
                rlt = self.getHistoryData(point,t)
                valuesAfter = [(x.get("value",None),x.get('time',None),x.get("error",None)) for x in rlt[0]['history']]
            except Exception as e:
                print(e.__str__())
                errors.append("错误信息调用%s接口补数据出错!点名: %s, 公式名: get_data('ChAMPS01')" % (add_url, point))

        else:
            errors.append("错误信息调用%s接口编辑点出错!点名: %s, 公式名: get_data('ChAMPS01')" % (edit_url, point))
        valueB, valueA = [], []
        try:
            if valuesAfter:
                pass
        except Exception as e:
            print(e.__str__())
            errors.append("错误信息调用%s接口编辑点后补数据出错!点名: %s, 公式名: get_data('ChAMPS01')" % (edit_url, point))


        for (b,a) in zip(valuesBefore, valuesAfter):
            valueB.append(b[0])
            valueA.append(a[0])
        if valueB != valueA:
            print("修改成功!")
        else:
            errors.append("错误信息调用%s接口修改点公式后补数据后取到的历史数据与之前一致!点名: %s, 之前的公式名: get_data('OutdoorTdbin') 现在的公式名: get_data('ChAMPS01')" % (edit_url, point))





        #抛出整个case中遇到的错误
        errors2 = errors
        errors = []
        self.raiseError(errors2)



    def editPoint(self,point,formula):
        global errors
        a = BeopTools()
        form = {
                    "remark":"cannot be delete",
                    "remark_en":"",
                    "id":"5776214e833c971621cc34f4",
                    "flag":2,
                    "value":point,
                    "format":"m5",
                    "logic":formula,
                    "moduleName":"calcpoint_1_woodyHistoryData"
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




    def getTime(self):
        date = datetime.datetime.now()
        startTime = date - datetime.timedelta(days=2)
        endTime = date - datetime.timedelta(days=1)
        startTime = datetime.datetime.strftime(startTime,'%Y-%m-%d %H:00:00')
        endTime = datetime.datetime.strftime(endTime,'%Y-%m-%d %H:00:00')
        return (startTime, endTime)


    #获取历史数据
    def getHistoryData(self,point,Strftime):
        global errors
        #得到该点最近更新时间
        a = BeopTools()
        pointList = [point]
        data = {'proj':1,"pointList":pointList}
        startTime = Strftime[0]
        endTime = Strftime[1]
        data = dict(projectId=1, timeStart=startTime, timeEnd=endTime, timeFormat='m5', pointList=pointList)
        getHisUrl = 'http://%s/get_history_data_padded'%app.config['SERVERIP']
        value = a.postData(url=getHisUrl,data=data,t=10)
        if isinstance(value,dict):
            if value.get("msg",False) == "no history data":
                #如果没拿到历史数据,补历史
                f = self.addHistoryData(Strftime)
                if f:
                    print("补历史数据成功!")
                else:
                    errors.append("错误信息%s点补历史数据失败!" % point)
                    return False
        else:
            return value

    #补历史数据方法
    def addHistoryData(self,strTime):
        r = False
        global errors
        url = 'http://121.41.28.69:4000/repairData/batch'
        #url = 'http://127.0.0.1:4000/repairData/batch'
        data = {
                'list':'["%s"]' % point,
                'timeFrom':strTime[0],
                'timeTo': strTime[1],
                'projId':1,
                'format':'m5'
        }
        data = urlencode(data,encoding="utf-8")
        a = BeopTools()
        try:
            a.postForm(url=url,data=data,t=60)
            time.sleep(15)
            r = True
        except Exception as e:
            errors.append("错误信息调用%s接口补数据失败!" % url)
            self.raiseError(errors)
        return r

    #抛出异常函数
    def raiseError(self,error):
        if error != []:
            #print("\n".join(error))
            assert 0,"\n".join(error)
        else:
            pass


    def tearDown(self):
        global errors
        errors = []
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        print("本次用例执行时间为%s" % use)
        self.now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        #info.append([self.testCaseID, use, now])




if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Calc010('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)
    #unittest.main()
