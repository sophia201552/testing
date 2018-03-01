__author__ = 'woody'
import socket
import unittest
import time
import datetime, sys, json
from interfaceTest import app
from interfaceTest.Methods.BeopTools import BeopTools
import requests

class Base008(unittest.TestCase):
    testCaseID = 'Base008'
    projectName = '付费项目'
    buzName = '监测重点项目Mysqlname是否改变'
    projectInfo = app.config['VIP_PROJECTS']
    errors = []
    ip = app.config['SERVERIPS']
    errorId = []

    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))
        self.a = BeopTools()

    @classmethod
    def addGroup(self, errorId, item):
        if item not in errorId:
            errorId.append(item)


    def Test(self):
        self.errors, self.errorId = [], []
        rvs = []
        for i in self.ip:
            url = 'http://%s/memcache/show' % i
            rt = self.a.getDataText(url=url, timeout=60)
            rvs.append(json.loads(rt))
        for rv in rvs:
            try:
                infoList = rv.get('projectInfoList',[])
                for proj in self.projectInfo:
                    _id = proj[0]
                    name_cn = proj[1]
                    mysqlname = proj[2]
                    collectionname = proj[3]
                    for info in infoList:
                        if info.get('id') == int(_id) and info.get('name_cn') == name_cn:
                            if info.get('mysqlname') == mysqlname:
                                print('id: %d, name_cn: %s, mysqlname: %s 与memcache获取一致!' % (int(_id), name_cn, mysqlname))
                            else:
                                self.addGroup(self.errorId, str(_id))
                                self.errors.append('错误信息[%s]%s---memcache获取到的mysqlname与实际不一致,可能是实时表遭到误操作,请检查! '
                                                   '详细信息: 项目id: %d, name_cn:%s mysqlname:%s,memcache获取到的mysqlname为%s' %
                                                   (self.a.getTime(), self.testCaseID, int(_id), name_cn, mysqlname, info.get('mysqlname')))

                            if info.get('collectionname') == collectionname:
                                print('id: %d, name_cn: %s, collectionname: %s 与memcache获取一致!' % (int(_id), name_cn, collectionname))
                            else:
                                self.addGroup(self.errorId, str(_id))
                                self.errors.append('错误信息[%s]%s---memcache获取到的mysqlname与实际不一致,可能是实时表遭到误操作,请检查! '
                                                   '详细信息: 项目id: %d, name_cn:%s mysqlname:%s,memcache获取到的mysqlname为%s' %
                                                   (self.a.getTime(), self.testCaseID, int(_id), name_cn, collectionname, info.get('collectionname')))

            except Exception as e:
                self.a.writeLogError(self.logger, e.__str__())
                self.errors.append('错误信息[%s]%s---%s' % (self.a.getTime(), self.testCaseID, e.__str__()))
            ids = ' '.join(self.errorId)
            MESSAGE_URL = app.config['MESSAGE_URL']
            MESSAGE_INFO = str(
                {'type': 'message', 'message': '尊敬的用户您好，%s的mysql或collectionname已被更改有待您检查，感谢使用BeOP智慧服务。【BeOP智慧服务】' % ids,
                 'phone': app.config['SQL_RECEIVER'], 'freq': 60})
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
    suite.addTest(Base008('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

