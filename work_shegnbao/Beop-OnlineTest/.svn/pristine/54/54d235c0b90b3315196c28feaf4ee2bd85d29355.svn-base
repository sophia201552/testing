__author__ = 'woody'

import pymongo
import unittest
from interfaceTest import app
from interfaceTest.Methods.BeopTools import BeopTools
import sys, time, datetime
class Smoke024(unittest.TestCase):
    testCaseID = 'Smoke024'


    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))

    def Test(self):
        self.ConnectMongo("120.55.113.116",27017)
        self.ConnectMongo("120.55.113.116",27018)
        self.ConnectMongo("120.55.185.72",27017)


    def ConnectMongo(self,ip,port):
        try:
            conn = pymongo.MongoClient(host=ip,port=port)
            db = conn.beopdata
            result = db.authenticate("beopweb","RNB.beop-2013")
            if result:
                rt = db.collection_names()
                if len(rt):
                    print("%s:%s mongo数据库表个数为%d" % (ip,port,len(rt)))
                else:
                    assert 0,"错误信息连接mongo数据库 %s:%s失败,数据表个数为%d!" % (ip,port,len(rt))
                for table in rt:
                    print(table)
                db.logout()
                conn.close()
            else:
                assert 0,"错误信息连接mongo数据库 %s:%s失败" % (ip,port)
        except Exception as e:
            print(e)
            assert 0,"连接mongo数据库 %s:%s失败" % (ip,port)

    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())



if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Smoke024('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)