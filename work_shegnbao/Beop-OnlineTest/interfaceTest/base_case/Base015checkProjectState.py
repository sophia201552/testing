__author__ = 'woody'
import csv
import requests
from interfaceTest.Methods.BeopTools import *
import json
import time
import datetime
import re
import unittest


serverip = "beop.rnbtech.com.hk"
# 项目ID,点名,项目名,dtu名称,引擎名称,是否判断掉线时间,持续时间
searchUrl = "http://%s/admin/dataPointManager/search/" % serverip

errors = []
class Base015(unittest.TestCase):
    testCaseID = 'Base015'
    projectName = "All"
    buzName = 'checkProjectInfo'
    start = 0.0


    def setUp(self):
        self.start = datetime.datetime.now()

    def Test(self):
        global errors
        offProj = []
        # 读取csv中项目信息
        with open(r"C:\beop\dtu.csv", 'r', encoding='utf-8') as file:
            reader = csv.reader(file)
            errors = []
            for line in reader:
                mark = None
                projID = line[0]
                point = line[1]
                projName = line[2]
                dtuName = line[3]
                engine = line[4]
                condition = line[5]
                try:
                    mark = line[6]
                except:
                    pass
                if int(condition):
                    rv = self.searchTime(projID, point, projName, dtuName, engine)
                    result = self.check(rv, projID, projName, dtuName, engine)
                    if result and mark:
                        r = self.searchTime(projID, mark, projName, dtuName, engine)
                        self.checkPoint(r, projID, projName, dtuName, engine, mark)
                else:
                    pass
                    #print("不处理!")

            errors2 = errors
            print(errors2)
        return errors2
		#return offProj

    def searchTime(self, projId, point, projName, dtuName, engine):
        global errors
        a = BeopTools()
        data = {
                "projectId":int(projId),"current_page":1,
                "page_size":"50","text":point,
                "isAdvance":False,"order":None,
                "isRemark":False,"flag":None
                }
        try:
            rv = a.postJsonToken(url=searchUrl, data=data, t=10)
            if rv.get("total",0) >= 1:
                rv = rv.get("list",None)
                rv = [x for x in rv if x.get("pointname") == point]

            else:
                errors.append("调用%s接口获取%s项目%s点数据失败!" % (searchUrl, projName, point))
                rv = None
        except Exception as e:
            print(e.__str__())
            errors.append("调用%s接口获取%s项目%s点数据失败!" % (searchUrl, projName, point))
            #self.raiseError(errors)
            return None
        return rv

    def check(self, rv, projId, projName, dtuName, engine):
        updateTime = self.updateTime(rv)
        dataTime = self.dataTime(rv)
        if updateTime is not None:
            updateTime += ":00"


        if updateTime is not None and dataTime is not None:
            return self.calc(projId, projName, dtuName, updateTime, dataTime, engine)
        else:
            if updateTime is None:
                errors.append("调用%s接口未获取到%s项目%s点更新时间!" % (searchUrl, projName, dtuName))
            if dataTime is None:
                errors.append("调用%s接口未获取到%s项目%s点数据更新时间!" % (searchUrl, projName, dtuName))
            return False

    def checkPoint(self, rv, projId, projName, dtuName, engine, mark):
        updateTime = self.updateTime(rv)
        point = self.dataTime(rv)
        if updateTime is not None:
            updateTime += ":00"
        updatePoint = int(point.split('/')[0])
        total = int(point.split('/')[1])
        if updatePoint < 5:
            errors.append("项目id: %s, 项目名称: %s 掉线DTU名称: %s %s点数据更新点个数为%s, 总个数为%s!" % (projId, projName, dtuName, mark, updatePoint, total))
        if updateTime is not None:
            result = self.calc(projId, projName, dtuName, updateTime, updateTime, engine)
            if result:
                return True
            else:
                return False
        else:
            if updateTime is None:
                errors.append("调用%s接口未获取到%s项目%s点更新时间!" % (searchUrl, projName, point))
            return False



    def updatePoints(self, projId, point, projName, dtuName, engine):
        global errors
        a = BeopTools()
        data = {
                "projectId":int(projId),"current_page":1,
                "page_size":"50","text":point,
                "isAdvance":False,"order":None,
                "isRemark":False,"flag":None
                }
        try:
            rv = a.postJsonToken(url=searchUrl, data=data, t=10)
            if rv.get("total",0) >= 1:
                rv = rv.get("list",None)
                rv = [x for x in rv if x.get("pointname") == point]

            else:
                errors.append("调用%s接口获取%s项目%s点数据失败!" % (searchUrl, projName, point))
                rv = None
        except Exception as e:
            print(e.__str__())
            errors.append("调用%s接口获取%s项目%s点数据失败!" % (searchUrl, projName, point))
            #self.raiseError(errors)
            return None
        updateTime = self.updateTime(rv)
        dataTime = self.dataTime(rv)
        if updateTime is not None:
            updateTime += ":00"


        if updateTime is not None and dataTime is not None:
            self.calc(projId, projName, dtuName, updateTime, dataTime, engine)
        else:
            if updateTime is None:
                errors.append("调用%s接口未获取到%s项目%s点更新时间!" % (searchUrl, projName, point))

            if dataTime is None:
                errors.append("调用%s接口未获取到%s项目%s点数据更新时间!" % (searchUrl, projName, point))

    def updateTime(self,rv):
        if isinstance(rv, list) and rv is not None:
            try:
                value = rv[0].get("time",None)
                if value:
                    return value
                else:
                    return None
            except Exception as e:
                print(e.__str__())
                return None
        else:
            return None

    def dataTime(self,rv):
        if isinstance(rv, list) and rv is not None:
            try:
                value = rv[0].get("pointvalue",None)
                if value:
                    return value
                else:
                    return None
            except Exception as e:
                print(e.__str__())
                return None
        else:
            return None




    def calc(self, projID, projName, dtuName, updateTime, dataTime, engine):
        global errors
        nowTime = datetime.datetime.timestamp(datetime.datetime.now())
        try:
            # t1 = time.strptime(updateTime,'%Y-%m-%d %H:%M:%S')
            t1 = datetime.datetime.strptime(updateTime, '%Y-%m-%d %H:%M:%S')
            # t2 = time.strptime(dataTime,'%Y-%m-%d %H:%M:%S')
            t2 = datetime.datetime.strptime(dataTime, '%Y-%m-%d %H:%M:%S')
            # update1 = float(time.mktime(t1))
            update1 = datetime.datetime.timestamp(t1)
            # data1 = float(time.mktime(t2))
            data1 = datetime.datetime.timestamp(t2)
            update = nowTime - update1
            data = nowTime - data1
            update = update / 60
            data = data / 60
            if update > 30.0:
                if update < 60.0:
                    error = "项目id: %s 项目名称: %s 掉线DTU名称: %s 掉线时间: %s 持续时间: %.2f分钟" % (
                    projID, projName, dtuName, updateTime, update)
                else:
                    update = update / 60
                    error = "项目id: %s 项目名称: %s 掉线DTU名称: %s 掉线时间: %s 持续时间: %.2f小时" % (
                    projID, projName, dtuName, updateTime, update)
                if error[:15] not in ' '.join(errors):
                    errors.append(error)
                return False
            else:
                if data > 30.0:
                    if projID == "212":
                        pass
                    else:
                        error = "项目id: %s 项目名称: %s 异常DTU名称: %s 异常引擎名称: %s 数据异常时间: %s 持续时间: %.2f分钟" % (
                        projID, projName, dtuName, engine, dataTime, data)
                        errors.append(error)
                    return False
                else:
                    pass
                    print("项目id: %s, 项目名称: %s, DTU名称: %s 引擎名称: %s 数据正常!" % (projID, projName, dtuName, engine))
                    return True


        except Exception as e:
            print(e.__str__())




    def tearDown(self):
        use1 = str((datetime.datetime.now() - self.start).seconds)
        use = use1 + "s"
        now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        # info.append([self.testCaseID, use, now])


if __name__ == '__main__':
    a = CaseP040()
    a.Test()
