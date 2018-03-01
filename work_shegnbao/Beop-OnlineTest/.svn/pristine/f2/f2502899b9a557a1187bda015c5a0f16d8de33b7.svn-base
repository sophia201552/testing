__autor__ = "kirry"


import unittest
import time,os
import pymysql
from interfaceTest import app
from interfaceTest.Methods.BeopTools import BeopTools


class Base028(unittest.TestCase):
    testCaseID = 'Base028'
    projectName = ''
    buzName = "检查国服，阿里，微软数据库数据是否同步"
    sqlIp = [
        {"rds8961fe732pz9uw7js.mysql.rds.aliyuncs.com":["devfront","Rnbtech1103"]},
        {"datam.mysqldb.chinacloudapi.cn":["datam%beopweb","Rnbtech1103"]},
        {"13.82.182.126":["beopweb","Rnbtech1103"]},
    ]
    tablename = ["diagnosis_fault","diagnosis_fault_zh","diagnosis_entity_fault",]




    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.a = BeopTools()
        self.error = []

    def Test(self):
        analysisData = {}
        for ip in self.sqlIp:
            data = {}
            for table in self.tablename:
                sql = '''SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS t WHERE t.TABLE_NAME = '{0}' UNION SELECT MAX(id) FROM {0}'''.format(table) if table not in ["diagnosis_entity_fault"] else '''SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS t WHERE t.TABLE_NAME = '{0}' UNION SELECT MAX(entityId) FROM {0}'''.format(table)
                kk = self.getMysqldata(sql,list(ip.keys())[0],list(ip.values())[0][0],list(ip.values())[0][-1])
                data[table] = kk
            analysisData[list(ip.keys())[0]] = data

        comparedata = analysisData["rds8961fe732pz9uw7js.mysql.rds.aliyuncs.com"]

        for ay in analysisData:

            if ay not in ["rr-bp1qro1e54e4h3be0o.mysql.rds.aliyuncs.com"]:

                for info in analysisData[ay]:

                     for index,i in enumerate(zip(analysisData[ay][info],comparedata[info])):

                         if index>0:
                             if set(i).__len__()>1:
                                 self.error.append("ip为%s的数据库中的%s表最后一行数据的id和国服数据库id不一致！"%(ay,info))
                             else:
                                 print("ip为%s的数据库中的%s表最后一行数据的列数和国服数据库正常！"%(ay,info))
                         else:
                             if set(i).__len__()>1:
                                 self.error.append("ip为%s的数据库中的%s表最后一行数据的列数和国服数据库列数不一致！"%(ay,info))
                             else:
                                 print("ip为%s的数据库中的%s表最后一行数据的id和国服数据库正常！"%(ay,info))
        BeopTools.raiseError(self.error,self.testCaseID)






    def getMysqldata(self,sql,sqlip,sqlname,sqlpasswd):
        print("*******数据库请求查询中......")
        datas = []
        conn,cur = False,False
        try:
            conn = pymysql.Connection(user=sqlname, passwd=sqlpasswd,
                     host=sqlip, db='diagnosis',charset='utf8',read_timeout = 20,connect_timeout=300)
            cur = conn.cursor()
            cur.execute(sql)
            datas.append(cur.fetchall())
        except Exception as e:
            print(sql)
            assert 0,"读取数据库%s数据错误信息为：%s"%(sqlip,e.__str__())
        finally:
            if conn:
                if cur:
                    cur.close()
                conn.close()
        return [datas[0][0][0],datas[0][1][0]]



    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

if __name__ == '__main__':
    suit = unittest.TestSuite()
    suit.addTest(Base028("Test"))
    runner = unittest.TextTestRunner()
    runner.run(suit)