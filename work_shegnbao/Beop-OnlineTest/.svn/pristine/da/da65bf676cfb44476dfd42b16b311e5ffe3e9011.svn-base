__author__ = 'kirry'
import socket
import unittest
import time
import datetime, sys, json,ssl
from interfaceTest import app
from interfaceTest.Methods.BeopTools import BeopTools
from pymongo import MongoClient
import pymysql
from pymysql.cursors import Cursor
status = Cursor
status._defer_warnings = True

class Base024(unittest.TestCase):
    testCaseID = 'Base024'
    projectName = ''
    buzName = "检查光明项目的mongo数据是否更新"
    sqlIp = "118.178.93.236"
    sqlname = "root"
    sqlPasswd = "RNBtech1103"
    sqlPoint = 3306
    sqldata = "bdtm2"
    sqltable = ["t_data_realtime_fixed","t_data_realtime_fridge"]
    settime = None




    def setUp(self):
        self.error = []
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))
        self.a = BeopTools()


    def Test(self):
        a = BeopTools()
        now = datetime.datetime.now()
        if not self.settime:
            self.settime = now
        timedel = (now - self.settime).total_seconds()/3600
        if timedel>2 or timedel == 0:
            for sqltable in self.sqltable:
                num = []
                sql = u'''SELECT ID,identifying,gpstime,updatetime FROM %s WHERE gpstime AND updatetime'''%sqltable
                data = self.connectMysql(sql)[0]
                if data:
                    now = datetime.datetime.now()
                    for i in data:
                        id = i[0]
                        identifying = i[1]
                        gpstime = i[2]
                        compareTime = i[3]
                        deltime = (compareTime-now).total_seconds()/60 if compareTime>now else (now-compareTime).total_seconds()/60
                        comparetime = 10 if "t_data_realtime_fixed" == sqltable else 40
                        if deltime>comparetime:
                            num.append("%s   %s   %s   %s"%(id,identifying,gpstime,datetime.datetime.strftime(compareTime,"%Y-%m-%d %H:%M:%S")))
                    if num:
                        percentage = num.__len__()/data.__len__()
                        if percentage > 0.5:
                            self.error.append("光明项目数据库表%s中实时数据%s分钟内没有更新，见下表：\n%s"%(sqltable,comparetime,"\n".join(num)))
                        else:
                            print("数据百分比正常！")
                    else:
                        print("所有数据正常！")
                else:
                    self.error.append("数据库中数据为空！")
            a.raiseError(self.error,self.testCaseID)
        else:
            print("时间未到！")



    def connectMysql(self,sql):
        datas = []
        cur,conn = False,False
        try:
            conn = pymysql.Connection(user=self.sqlname, passwd=self.sqlPasswd,
                     host=self.sqlIp,port=self.sqlPoint, db=self.sqldata,charset='utf8')
            cur = conn.cursor()
            cur.execute(sql)
            datas.append(cur.fetchall())
        except Exception as e:
            assert 0,"错误信息为：%s"%e.__str__()
        finally:
            if conn:
                if cur:
                    cur.close()
                conn.close()
        return datas







    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

if __name__ == "__main__":
    suite = unittest.TestSuite()
    suite.addTest(Base024('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)