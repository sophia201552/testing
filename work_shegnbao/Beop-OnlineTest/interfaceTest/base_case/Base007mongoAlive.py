__author__ = 'woody'
import socket
import unittest
import time
import datetime, sys, json
from interfaceTest import app
from interfaceTest.Methods.BeopTools import BeopTools
import requests

errormongo = {}
class Base007(unittest.TestCase):
    testCaseID = 'Base007'
    projectName = '不选择项目'
    buzName = '监测Mongo是否存活'
    mongo_list = app.config['MONGO_ADDR_LIST']
    errors = []



    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))
        self.a = BeopTools()

    def Test(self):
        global errormongo
        self.errors = []
        now = datetime.datetime.now()
        dumpList = []
        for addr in self.mongo_list:
            dumpMongo = self.IsOpen(addr[0], addr[1])
            if dumpMongo:
                dumpList.append(dumpMongo)
        self.a.writeLogError(self.logger, 'dumpList: %s' % ','.join(dumpList))
        if not dumpList and errormongo:
            errormongo = {}
        elif dumpList and not errormongo:
            errormongo[now] = dumpList
            dumpList = []
        else:
            if errormongo:
                dumpList = [y for y in [errormongo[x] for x in errormongo if (now-x).total_seconds()/60>2][0] if y in dumpList]
        if dumpList:
            if app.config['ENABLE_MOBILE_MESSAGE']:
                message = ', '.join(dumpList)
                MESSAGE_INFO = str({'type':'message', 'message':'尊敬的用户您好，检测到mongo--%s无响应，请及时处理，感谢使用BeOP智慧服务。【BeOP智慧服务】' % message,
                      'phone':app.config['MONGO_RECEIVER'], 'freq':4800})
                MESSAGE_DATA = {'name':'message', 'value':MESSAGE_INFO}
                MESSAGE_URL = app.config['MESSAGE_URL']
                self.sendMessage(MESSAGE_URL, MESSAGE_DATA, 10)
                self.a.writeLogError(self.logger, '\n'.join(self.errors))


    def sendMessage(self, url, data, t):
        a = BeopTools()
        a.writeLogError(self.logger, "发送短信!")
        rv = {}
        try:
            rv = a.postJsonToken(url=url, data=data, t=t)
            a.writeLogError(self.logger, "发送短信详情为%s" % (json.dumps(data, ensure_ascii=False)))
        except Exception as e:
            print(self.testCaseID, e.__str__())
            a.writeLogError(self.logger, e.__str__())
        if rv.get('error') == 'ok':
            a.writeLogError(self.logger, '短信提醒成功!')
        else:
            self.errors.append("错误信息[%s]%s---项目名:%s 发送短信失败!" % (a.getTime(), self.testCaseID, self.projectName))




    def IsOpen(self, ip, port):
        socket.setdefaulttimeout(30)
        s = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
        try:
            s.connect((ip,int(port)))
            s.shutdown(2)
            print('%s:%d is open' % (ip, port))
            return None
        except Exception as e:
            print('%s:%d is down' % (ip, port))
            print(e.__str__())
            self.a.writeLogError(self.logger, e.__str__())
            self.a.writeLogError(self.logger, '[%s]---%s %s:%s mongo数据库socket无响应，可能已宕机，请检查!' % (self.a.getTime(), self.testCaseID, ip, port))
            self.errors.append('[%s]---%s %s:%s mongo数据库socket无响应，可能已宕机，请检查!' % (self.a.getTime(), self.testCaseID, ip, port))
            return str(ip) + ':' + str(port)



    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


if __name__ == '__main__':
    while True:
        suite = unittest.TestSuite()
        suite.addTest(Base007('Test'))
        runner = unittest.TextTestRunner()
        result = runner.run(suite)

