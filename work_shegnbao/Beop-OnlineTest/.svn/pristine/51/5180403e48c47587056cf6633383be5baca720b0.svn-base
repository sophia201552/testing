__author__ = 'kirry'
import socket
import unittest
import time
import datetime, sys, json,ssl
from interfaceTest import app
from interfaceTest.Methods.BeopTools import BeopTools
import pymongo
from pymongo import MongoClient
import pymysql

class Base021(unittest.TestCase):
    testCaseID = 'Base021'
    projectName = '上海华为'
    buzName = "检查一个对于分流v2格式历史数据"
    mongoIp = ['120.55.185.72','101.37.37.192']
    mysqlIp = "rr-bp1qro1e54e4h3be0o.mysql.rds.aliyuncs.com"
    sqlname = "devfront"
    sqlPasswd = "Rnbtech1103"
    mogoPoint = 27017
    usename = "beopweb"
    passwd = "RNB.beop-2013"
    url = ["http://beop.rnbtech.com.hk/get_history_data_padded","http://121.41.30.108/get_history_data_padded"]
    pointName = ["StarterInputPowerConsumptionOwnerCH1"]



    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))
        self.a = BeopTools()


    def Test(self):
        error = []
        times = self.connectionPysql()
        statuss = ["itTime","gtTime","behandTime"]
        for status in statuss:
            usetime = self.getTimes(times,status)
            if status == "itTime":
                data = {"projectId":72,"pointList":self.pointName,
                    "timeStart":usetime[1],"timeEnd":usetime[0],
                    "timeFormat":"m1"}

                post = {"pointname":{"$in":self.pointName},"time":{"$lte":datetime.datetime.strptime(usetime[0],"%Y-%m-%d %H:%M:%S"),
                                                                   "$gte":datetime.datetime.strptime(usetime[1],"%Y-%m-%d %H:%M:%S")}}
                mongodata = self.connectmongo(self.mongoIp[0],post)
                for url in self.url:
                    rv = self.getData(data,url)
                    rv = [{"pointname":r["pointname"],"time":r["time"],"value":float(r["value"])} for r in rv]
                    compare = [mongo for mongo in mongodata if mongo not in rv]
                    if compare:
                        error.append("接口%s取分流时间前的数据，和mongo数据库%s中的数据不一致,mongo数据库中%s,接口返回没有！"%(url,self.mongoIp[0],str(compare)))
                    else:
                        print("取分流前数据正常！")



            elif status == "gtTime":

                data = {"projectId":72,"pointList":self.pointName,
                    "timeStart":times.strftime("%Y-%m-%d %H:%M:%S"),"timeEnd":(times+datetime.timedelta(minutes=10)).strftime("%Y-%m-%d %H:%M:%S"),
                    "timeFormat":"m1"}

                post = {"pointname":{"$in":self.pointName},"time":{"$lte":datetime.datetime.strptime(usetime[1],"%Y-%m-%d %H:%M:%S"),
                                                                   "$gte":datetime.datetime.strptime(usetime[0],"%Y-%m-%d %H:%M:%S")}}
                mongodata = self.connectmongo(self.mongoIp[1],post,mode="v2")
                mongoTime = times.strftime("%Y-%m-%d")
                hour =times.hour
                values = mongodata[0]['value']
                mongodata = []
                checknum = lambda x:"%s"%x if len(str(x))>1 else "0%s"%x
                values = [values[val] for val in values if int(val)<= hour][0]
                for key in values:
                    if int(key)<=10:
                        value = {"pointname":self.pointName[0],"time":(mongoTime+" "+"%s:%s:00"%(hour,checknum(int(key)))),"value":float(values[key])}
                        mongodata.append(value)
                for url in self.url:
                    rv = self.getData(data,url)
                    rv = [{"pointname":r["pointname"],"time":r["time"],"value":float(r["value"])} for r in rv]
                    compare = [mongo for mongo in mongodata if mongo not in rv]
                    if compare:
                        error.append("接口%s取分流时间后的数据，和mongo数据库%s中的数据不一致,mongo数据库中%s,接口返回没有！"%(url,self.mongoIp[1],str(compare)))
                    else:
                        print("取分流后数据正常！")


            else:
                beginTime = times.replace(hour=0, minute=0, second=0, microsecond=0)
                endtime = times.replace(hour=0, minute=0, second=0, microsecond=0)+datetime.timedelta(days = 1)
                data = {"projectId":72,"pointList":self.pointName,
                    "timeStart":usetime[0],"timeEnd":usetime[1],
                    "timeFormat":"m1"}
                post1 = {"pointname":{"$in":self.pointName},"time":{"$lte":times,
                                                                   "$gte":datetime.datetime.strptime(usetime[0],"%Y-%m-%d %H:%M:%S")}}
                post2 = {"pointname":{"$in":self.pointName},"time":{"$lt":endtime,
                                                                   "$gte":beginTime}}
                mongodata1 = self.connectmongo(self.mongoIp[0],post1)
                mongodata2 = self.connectmongo(self.mongoIp[1],post2,"v2")
                hour = times.hour
                mongoTime = times.strftime("%Y-%m-%d")
                values = mongodata2[0]["value"][str(hour)]
                checknum = lambda x:"%s"%x if len(str(x))>1 else "0%s"%x
                mongodata2 = []
                for key in values:
                    if int(key)<=10:
                        value = {"pointname":self.pointName[0],"time":(mongoTime+" "+"%s:%s:00"%(hour,checknum(int(key)))),"value":float(values[key])}
                        mongodata2.append(value)
                mongodata = mongodata1+mongodata2
                for url in self.url:
                    rv = self.getData(data,url)
                    rv = [{"pointname":r["pointname"],"time":r["time"],"value":float(r["value"])} for r in rv]
                    compare = [mongo for mongo in mongodata if mongo not in rv]
                    if compare:
                        error.append("接口%s取跨分流时间的数据，和mongo数据库%s中的数据不一致,数据库中的%s接口没有返回！"%(url,self.mongoIp[0],str(compare)))
                    else:
                        print("取跨分流时间数据正常！")




    def connectmongo(self,host,post,mode="m5"):
        connectionName = "%s_data_beopdata_shhuawei"%mode
        try:
            conn = MongoClient(host=host,port=self.mogoPoint)
        except Exception as e:
            assert 0,"请求mongo数据库链接失败，错误原因：%s"%e
        db = conn.beopdata
        db.authenticate(self.usename,self.passwd)
        if mode == "m5":
            datas = db[connectionName].find(post)
        else:
            datas = db[connectionName].find(post).sort([('pointname', pymongo.ASCENDING), ('time', pymongo.ASCENDING)])
        redata = []
        for item in datas:
            if mode != "v2":
                del item["_id"],item["tt"]
            else:
                del item["_id"]
            item["time"] = datetime.datetime.strftime(item["time"],"%Y-%m-%d %H:%M")+":00"
            redata.append(item)
        conn.close()
        return redata


    def connectionPysql(self):
        try:
            conn = pymysql.connect(user=self.sqlname, passwd=self.sqlPasswd,
                     host=self.mysqlIp, db='beopdoengine',charset='utf8')
        except Exception as e:
            assert 0,"链接MySQL数据库失败，错误信息为%s"%e
        cur = conn.cursor()
        cur.execute(r"select hisdata_structure_v2_from_time from project where id = 72")
        usetime = cur.fetchall()
        cur.close()
        conn.close()
        return usetime[0][0]



    def getTimes(self,time,status):
        timedict = {"itTime":(time-datetime.timedelta(minutes = 10),
                                  time-datetime.timedelta(minutes = 30)),
                    "gtTime":(time.replace(hour=0, minute=0, second=0, microsecond=0),
                                time.replace(hour=0, minute=0, second=0, microsecond=0)),
                    "behandTime":(time-datetime.timedelta(minutes = 10),
                                  time+datetime.timedelta(minutes = 10)
                                  )
                    }
        return [datetime.datetime.strftime(status,"%Y-%m-%d %H:%M")+":00" for status in timedict.get(status)]


    def getData(self,data,url):
        a = BeopTools()
        try:
            rv = a.postJsonToken(url,data)
        except:
            assert 0,"请求%s接口超时！"%url
        rv = rv[0].get("history","")
        datas = []
        if isinstance(rv,list):
            for history in rv:
                del history['error']
                history["pointname"] = self.pointName[0]
                datas.append(history)
        return datas




    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Base021('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)