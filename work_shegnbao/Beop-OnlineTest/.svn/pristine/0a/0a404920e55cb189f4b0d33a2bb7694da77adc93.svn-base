__author__ = 'woody'
import socket
import unittest
import time, pymysql
import datetime, sys, json
from interfaceTest import app
from interfaceTest.Methods.BeopTools import BeopTools
import requests

class Base009(unittest.TestCase):
    testCaseID = 'Base009'
    projectName = '付费项目'
    buzName = '监测重点项目数据库表名是否改变'
    projectInfo = app.config['VIP_PROJECTS']
    errors = []
    errorId = []

    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))
        self.a = BeopTools()

    @classmethod
    def getInfoFromMysql(self,mysqlConfig):
        conn = None
        # 执行sql语句
        sql = "select id, name_cn, mysqlname, collectionname from project "
        result = None
        try:
            conn = pymysql.Connect(host=mysqlConfig[0], port=mysqlConfig[1], user=mysqlConfig[2], password=mysqlConfig[3], charset='UTF8', db='beopdoengine')
            cur = conn.cursor()
            cur.execute(sql)
            result = cur.fetchall()
            return result
        except Exception as e:
            print(e.__str__())
            self.errors.append("错误信息[%s]%s---连接国服mysql出错,请检查!" % (BeopTools.getTime(), self.testCaseID, ))
        finally:
            if conn:
                conn.close()



    @classmethod
    def addGroup(self, errorId, item):
        if item not in errorId:
            errorId.append(item)


    def Test(self):
        #与数据库与预期表名不一致的项目Id
        self.errors, self.errorId = [], []
        #获取mysql中的项目信息
        mysqlConfig = app.config['MYSQL_INFO']
        for i in mysqlConfig:
            infoList = self.getInfoFromMysql(i)
        #比对
            try:
                for proj in self.projectInfo:
                    _id = proj[0]
                    name_cn = proj[1]
                    mysqlname = proj[2]
                    collectionname = proj[3]
                    #遍历sql语句查询到的项目信息
                    for info in infoList:
                        if info[0] == int(_id) and info[1] == name_cn:
                            if info[2] == mysqlname:
                                print('id: %d, name_cn: %s, mysqlname: %s 与国服数据库获取一致!' % (int(_id), name_cn, mysqlname))
                            else:
                                self.addGroup(self.errorId, str(_id))
                                self.errors.append('错误信息[%s]%s---数据库中获取到的mysqlname与实际不一致,可能是实时表遭到误操作,请检查! '
                                                   '详细信息: 项目id: %d, name_cn:%s mysqlname:%s,数据库中获取到的mysqlname为%s' %
                                                   (self.a.getTime(), self.testCaseID, int(_id), name_cn, mysqlname, info[2]))

                            if info[3] == collectionname:
                                print('id: %d, name_cn: %s, collectionname: %s 与国服数据库获取一致!' % (int(_id), name_cn, collectionname))
                            else:
                                self.addGroup(self.errorId, str(_id))
                                self.errors.append('错误信息[%s]%s---国服数据库获取到的mysqlname与实际不一致,可能是实时表遭到误操作,请检查! '
                                                   '详细信息: 项目id: %d, name_cn:%s mysqlname:%s,memcache获取到的mysqlname为%s' %
                                                   (self.a.getTime(), self.testCaseID, int(_id), name_cn, collectionname, info[3]))

            except Exception as e:
                self.a.writeLogError(self.logger, e.__str__())
                self.errors.append('错误信息[%s]%s---%s' % (self.a.getTime(), self.testCaseID, e.__str__()))
            ids = ' '.join(self.errorId)
            MESSAGE_URL = app.config['MESSAGE_URL']
            MESSAGE_INFO = str(
                {'type': 'message', 'message': '尊敬的用户您好，%s的mysql或collectionname已被更改有待您检查，感谢使用BeOP智慧服务。【BeOP智慧服务】' % ids,
                 'phone': app.config['SQL_RECEIVER'], 'freq': 3600})
            MESSAGE_DATA = {'name': 'message', 'value': MESSAGE_INFO}
            if self.errorId:
                BeopTools.writeLogError(self.logger, '\n'.join(self.errors))
                self.sendMessage(MESSAGE_URL, MESSAGE_DATA, 10)
            else:
                BeopTools.writeLogError(self.logger, '错误个数为0!')
                print('不发短信')

        self.a.raiseError(self.errors, self.testCaseID)

    def sendMessage(self, url, data, t):
        a = BeopTools()
        a.writeLogError(self.logger, "发送短信!")
        rv = {}
        try:
            rv = a.postJsonToken(url=url, data=data, t=t)
            a.writeLogError(self.logger, "发送短信详情为%s" % (json.dumps(data, ensure_ascii=False)))
        except Exception as e:
            a.writeLogError(self.logger, e.__str__())
        if rv.get('error') == 'ok':
            a.writeLogError(self.logger, '短信提醒成功!')
        else:
            self.errors.append("错误信息[%s]%s---项目名:%s 发送短信失败!" % (a.getTime(), self.testCaseID, self.projectName))

    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())



if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Base009('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

