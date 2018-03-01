__autor__ = "kirry"

import poplib
import email
from email.parser import Parser
from email.header import decode_header
from email.utils import parseaddr
import socket
import unittest
import time,os
import datetime, sys, json,ssl
import pika
from interfaceTest import app
from interfaceTest.Methods.BeopTools import BeopTools
poplib._MAXLINE = 204800


class Base027(unittest.TestCase):
    testCaseID = 'Base027'
    projectName = ''
    buzName = "检查推送邮件附件大小"
    uesrname = "kirry.gao@rnbtech.com.hk"
    passwd = "Beop518518"
    serverip = "pop3.rnbtech.com.hk"
    filepath = os.path.abspath(".")
    eveyday = ["Your Daily Priority Faults Report is ready"]
    Tuesday = ["Your Weekly Diagnosis Report is ready","Your Weekly Consequence Classification Report is ready",
               "Your Weekly Issues Classification Report is ready"
               ]



    def setUp(self):
        self.startTime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime())
        self.startTimeStamp = time.time()
        self.a = BeopTools()
        self.error = []

    def Test(self):
        now = datetime.datetime.now()
        if now.hour in [7,]:
            self.reserverEmail()
        else:
            print("等待时间是%s"%now.strftime("%Y-%m-%d %H:%M:%S"))


    def reserverEmail(self):
        now = datetime.datetime.now()
        server = False
        try:
            server = poplib.POP3(self.serverip)
            server.user(self.uesrname)
            server.pass_(self.passwd)
            resp,mails,otets = server.list()
            index = len(mails)
            for i in sorted(list(range(1,index)),reverse = True):
                resps,lines,octets = server.retr(i)
                msg_content = "\n".join([line.decode("utf-8") for line in lines])
                msg = Parser().parsestr(msg_content)
                subject = decode_header(msg.get("Subject"))[0]
                if subject[-1]:
                    subject = subject[0].decode(subject[-1])
                else:
                    subject = subject[0]
                try:
                    time = decode_header(msg.get("Date"))[0]
                except:
                    time = [lines[3].decode("utf-8").strip(),""]
                if subject == 'Your Daily Priority Faults Report is ready':
                    print(subject)
                if time[-1]:
                    times = time[0].decode(subject[-1])
                else:
                    times = time[0]
                try:
                    times = datetime.datetime.strptime(times,"%a, %d %b %Y %H:%M:%S %z")
                except:
                    times = datetime.datetime.strptime(times,"%Y-%m-%d %H:%M:%S")
                times = datetime.datetime.strptime(datetime.datetime.strftime(times,"%Y-%m-%d %H:%M:%S"),"%Y-%m-%d %H:%M:%S")
                deltimes = (now - times).total_seconds()/60 if now>times else (times - now).total_seconds()/60
                if deltimes>360:
                    print("6小时内的邮件检查完毕！")
                    break
                if subject in self.eveyday or subject in self.Tuesday:
                    if deltimes<300:
                        self.getEmailFile(msg,self.filepath)
                    else:
                        break
        except Exception as e:
            assert 0,"发送邮件错误，错误信息：%s"%e.__str__()
        finally:
            if server:
                server.quit()



    def getEmailFile(self,msg,base_save_path):
        file_name = False
        for part in msg.walk():
            file_name = part.get_filename()
            if file_name:
                filename = os.path.join(self.filepath,file_name)
                data = part.get_payload(decode="utf-8")
                with open(filename,"wb") as f:
                    f.write(data)
                print("success")
        if file_name:
            size = int(os.path.getsize(file_name)/1024)
            if size<5:
                assert 0,"%s报表邮件推送附件大小小于5k，为%sk"%(file_name,size)
            else:
                print("%s附件正常！"%file_name)
        return None





    def tearDown(self):
        self.error = []
        CaseUseTime = time.time() - self.startTimeStamp
        CaseUseTime = str('%.2f秒' % CaseUseTime)
        print("本次用例执行时间为%s" % CaseUseTime)
        self.endTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())

if __name__ == "__main__":
    while True:
        suite = unittest.TestSuite()
        suite.addTest(Base027('Test'))
        runner = unittest.TextTestRunner()
        result = runner.run(suite)
        time.sleep(10)
