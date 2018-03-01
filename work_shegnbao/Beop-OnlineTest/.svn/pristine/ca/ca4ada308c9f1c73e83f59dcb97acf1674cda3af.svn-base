__author__ = 'woody'
import socket
import unittest
import time
import datetime, sys, json
from interfaceTest import app
from interfaceTest.Methods.BeopTools import BeopTools
import requests

class Base011(unittest.TestCase):
    testCaseID = 'Base011'
    projectName = '不选择项目'
    buzName = '监测beop网站是否存活'
    addr = ['http://121.40.89.20']
    #mongo_list = app.config['MONGO_ADDR_LIST']
    errors = []



    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.logger = BeopTools.init_log(r'%s\log\%s.txt' % (sys.path[0], self.testCaseID))
        self.a = BeopTools()

    def Test(self):
        self.errors = []
        dumpList = []
        for ip in self.addr:
            dumpMongo = self.IsOpen(ip)
            if dumpMongo:
                dumpList.append(dumpMongo)
        self.a.writeLogError(self.logger, 'dumpList: %s' % ','.join(dumpList))
        if dumpList:
            if app.config['ENABLE_MOBILE_MESSAGE']:
                message = ', '.join(dumpList)
                MESSAGE_INFO = str({'type':'message', 'message':'尊敬的用户您好，检测到国服服务器--%s无响应，请及时处理，感谢使用BeOP智慧服务。【BeOP智慧服务】' % message,
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




    def IsOpen(self, ip):
        errorNum = 0
        for i in range(0, 3):
            try:
                r = BeopTools.getDataText(ip, timeout=30)
                if r.find('txtName'):
                    pass
                else:
                    self.errors.append('国服%s服务器打开网站后没有找到登陆窗口!请注意!' % (ip))
            except Exception as e:
                errorNum += 1
                time.sleep(10)
                if errorNum > 2:
                    self.errors.append('国服%s服务器无响应,请注意!' % (ip))
                    self.a.writeLogError(self.logger, e.__str__())
                    self.a.writeLogError(self.logger, '[%s]---%s国服%s服务器无响应，可能已宕机，请检查!' % (self.a.getTime(), self.testCaseID, ip, ))
                    return ip
        return None



    def tearDown(self):
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())



if __name__ == '__main__':
    suite = unittest.TestSuite()
    suite.addTest(Base011('Test'))
    runner = unittest.TextTestRunner()
    result = runner.run(suite)

