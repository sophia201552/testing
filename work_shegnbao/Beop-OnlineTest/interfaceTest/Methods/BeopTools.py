__author__ = 'rdg'

import json
import time
import re
import os
from threading import Thread
import string
import random
import logging, sys
import requests
import memcache
from requests.exceptions import *
import poplib
import email.mime.multipart
from email.header import Header
import email.mime.text
import smtplib
import datetime
import pymysql
from interfaceTest import app
hostlist = ['192.168.1.223']
database = app.config['MYSQL_NAME']


class BeopTools:
    __instance = None
    def __init__(self):
        pass

    @classmethod
    def getMysqlConn(self, database):
        host = app.config['MYSQL_ADDR']
        userName = app.config['MYSQL_USERNAME']
        pwd = app.config['MYSQL_PWD']
        port = app.config['MYSQL_PORT']
        try:
            conn = pymysql.connect(host=host, port=port, user=userName, password=pwd, database=database, charset='utf8')
            return conn
        except Exception as e:
            logging.error('func name: getMysqlConn error {}'.format(e.__str__()))
            return None

    @classmethod
    def getCaseInfo(self, conn, CaseID, content='*'):
        try:
            cursor = conn.cursor()
            sql = 'SELECT {0} FROM CaseInfo WHERE CaseID=%s'.format(content)
            cursor.execute(sql, CaseID)
            return cursor.fetchall()
        except Exception as e:
            logging.error('func name: getCaseLastRunTime error {}'.format(e.__str__()))
        finally:
            if conn:
                conn.close()

    @classmethod
    def setCase(self, conn, CaseID):
        try:
            cursor = conn.cursor()
            sql = 'UPDATE CaseInfo SET FaultTime=FaultTime+1,LastNoticeTime=%s WHERE CaseID=%s'
            cursor.execute(sql, (datetime.datetime.now().isoformat(), CaseID))
            conn.commit()
        except Exception as e:
            logging.error('func name: getCaseLastRunTime error {}'.format(e.__str__()))
        finally:
            if conn:
                conn.close()

    @classmethod
    def checkCaseNeedSend(self, CaseID, delay=30):
        conn = self.getMysqlConn(database)
        NoticeTime = self.getCaseInfo(conn, CaseID, 'LastNoticeTime')[0][0]
        if NoticeTime:
            #说明获取到了上次异常时间
            now = datetime.datetime.now()
            minute = (now - NoticeTime).seconds / 60.0 + (now - NoticeTime).days * 24 * 3600.0
            #上次报错时间小于delay
            if minute < float(delay):
                return False
        return True




    #设置memcache 用例开始/结束时间
    @classmethod
    def setMemTime(cls, key, value, time=0):
        rt = False
        try:
            mc = memcache.Client(hostlist, debug=0)
            rt = mc.set(key, value, time=time)
        except Exception as e:
            print(str(e))
        return rt

    #获取memcache 用例运行时间
    @classmethod
    def getMemTime(self, key):
        rt = None
        try:
            mc = memcache.Client(hostlist, debug=0)
            rt = mc.get(key)
        except Exception as e:
            print(e.__str__())
        return rt


    #清空掉memcache里的case运行时间记录
    @classmethod
    def delMemTime(cls,keys):
        rt = False
        try:
            mc = memcache.Client(hostlist,debug=0)
            rt = mc.delete_multi(keys)
        except Exception as e:
            print(e.__str__())
        return rt



    #初始化log日志文件,文件名作为参数传进来,返回一个logger
    @classmethod
    def init_log(self, logName):
        log = logName.replace('/', '\\')
        dirName = os.path.split(log)[0]
        if os.path.exists(dirName):
            pass
        else:
            os.mkdir(dirName)
        handler = logging.FileHandler(log, encoding='utf-8')
        logger = logging.getLogger()
        logger.handlers = []
        logger.addHandler(handler)
        logger.setLevel(logging.ERROR)
        return logger


    #调用logger写入错误信息至log日志中
    @classmethod
    def writeLogError(self, logger, text):
        #logger = self.init_log()
        logger.error('[%s]---' % time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) + '' + text)

    @classmethod
    def writeLogInfo(self, logger, text):
        logger.info('[%s]---' % time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) + '' + text)

    #抛出异常错误
    @classmethod
    def raiseError(self, error, testCaseID):
        if error != []:
            # conn = self.getMysqlConn(database)
            # self.setCase(conn, testCaseID)
            assert 0,"\n".join(error)


    @classmethod
    def sendmail(self, reciepents, title, body=None):
        msg = email.mime.multipart.MIMEMultipart()
        MAIL_SERVER = 'smtp.rnbtech.com.hk'
        MAIL_USERNAME = 'projecttest@rnbtech.com.hk'
        MAIL_PASSWORD = 'h=Lp4U8+Lp'
        DEFAULT_MAIL_SENDER = '%s<projecttest@rnbtech.com.hk>' % (Header('BeOP后台自动化测试', 'utf-8'))
        MAIL_DEFAULT_SENDER = 'projecttest@rnbtech.com.hk'
        msg['from'] = DEFAULT_MAIL_SENDER
        msg['to'] = ';'.join(reciepents)
        msg['subject'] = title
        sendtime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        msg['date'] = sendtime
        content = '''
            你好，
                    这是一封自动发送的邮件，原因是自动化测试发现了您的问题，请参考：

        '''
        content = content + "\n" + body
        content = content + '''

           R&B 研发部
        ''' + str(sendtime)
        txt = email.mime.text.MIMEText(content)
        msg.attach(txt)

        smtp = smtplib.SMTP()
        smtp.connect(MAIL_SERVER, 25)
        smtp.login(MAIL_USERNAME, MAIL_PASSWORD)
        smtp.sendmail(DEFAULT_MAIL_SENDER, reciepents, str(msg))
        smtp.quit()

    #调用BeopTools.getTime 获取当前时间字符串
    @classmethod
    def getTime(self):
        return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())		

    @classmethod
    def send_email(self, reciepents, suite, info, testCaseID):
        title = '国服-接口测试->%s' % suite
        if info:
            conn = BeopTools.getMysqlConn(database)
            BeopTools.setCase(conn, testCaseID)
            infoStr = '\n'.join(info)
            self.sendmail(reciepents, title, infoStr)


    #获取错误信息
    @staticmethod
    def catchErrorInfo(error):
        info = []
        pat = re.compile("\\n(.+)Error:(.+)")
        m = re.findall(pat,error)
        for e in m:
            info.append(e[0] + "Error: " + e[1])
        return "\n".join(info)


    #给BeopTools创建一个实例并返回
    @classmethod
    def getInstance(self):
        if(self.__instance == None):
            self.__instance = BeopTools()
        return self.__instance


    #发送Json数据post方法
    def postJson(self, url, data,t=30):
        headers = {'content-type': 'application/json', 'token':'eyJhbGciOiJIUzI1NiIsImV4cCI6MT'}
        try:
            cur_time = time.time()
            r = requests.post(url, data = json.dumps(data), headers=headers,timeout=t)
            used = time.time() - cur_time
            test=json.dumps(data)
            j=data
            i=j
        except:
            assert 0,"错误信息发送数据%s 读取%s接口出错" % (json.dumps(data), url)
        if used > 15:
            assert 0,"错误信息本次发送post数据%s 读取%s接口超时!" % (json.dumps(data), url)
        else:
            pass
        strJson = r.text
        rv = None
        try:
            rv = json.loads(strJson)
            return rv
        except:
            return None


    #获取随机字母字符串(randomlength为字符串长度, 其中字母不重复)
    @classmethod
    def random_str(self, randomlength=8):
        a = list(string.ascii_letters)
        random.shuffle(a)
        return ''.join(a[:randomlength])


    #获取Json数据
    def getJson(self, url):
        headers = {'content-type': 'application/json', 'token':'eyJhbGciOiJIUzI1NiIsImV4cCI6MT'}
        try:
            cur_time = time.time()
            r = requests.get(url, headers=headers,timeout=15)
            used = time.time() - cur_time
        except:
            assert 0,"错误信息读取%s接口超时" % url
        if used > 15:
            assert 0,"错误信息本次发送get请求读取%s接口超时!" % url
        else:
            pass

        strJson = r.text
        rv = None
        try:
            rv = json.loads(strJson)
            return rv
        except:
            return None





    #发送表单数据
    def postForm(self, url, data,t=30):
        # info = {"name":"woody.wu@rnbtech.com.hk","pwd":"wuranxu312","agent":{"screen":"1920 x 1080","browser":"Chrome","browserVersion":"52.0.2729.4","mobile":False,"os":"Windows","osVersion":"NT 4.0","cookies":True},"loginCode":"",'noRecord':1}
        # headersJson = {'content-type': 'application/json','token':'eyJhbGciOiJIUzI1NiIsImV4cCI6MT'}
        headers = {'content-type': 'application/x-www-form-urlencoded','token':'eyJhbGciOiJIUzI1NiIsImV4cCI6MT'}
        # login = requests.post("http://beop.rnbtech.com.hk/login",data=json.dumps(info),headers=headersJson)
        # token = login.cookies._cookies['beop.rnbtech.com.hk']['/']['token'].value
        # cookies = {'userId':'404','token':token}
        try:
            r = requests.post(url, data=data, headers=headers, timeout=t)
        except ConnectTimeout as e:
            #print(e.__str__())
            assert 0, "错误信息发送数据%s 读取%s接口超时(超过%f秒!)" % (json.dumps(data), url,t)
        except Exception as e:
            print(e.__str__())
            assert 0, "错误信息发送数据%s 读取%s接口出错!" % (json.dumps(data), url)

        if r.status_code != 200:
            assert 0, "错误信息本次post请求发送数据%s 读取%s接口返回状态码不为200!" % (json.dumps(data), url)
        else:
            pass
        strJson = r.text
        rv = None
        try:
            rv = json.loads(strJson)
            return rv
        except:
            assert 0,"错误信息发送post请求%s接口返回的数据为空！" % url



    #发送带token的json数据(目前用这个方法)
    @classmethod
    def postJsonToken(self, url, data,t=30,name="projecttest@rnbtech.com.hk",pwd="h=Lp4U8+Lp",userid="2265"):
        # info = {"name":name,"pwd":pwd,"agent":{"screen":"1920 x 1080","browser":"Chrome","browserVersion":"52.0.2729.4","mobile":False,"os":"Windows","osVersion":"NT 4.0","cookies":True},"loginCode":"", 'noRecord':1}
        headersJson = {'content-type': 'application/json','token':'eyJhbGciOiJIUzI1NiIsImV4cCI6MT'}
        headers = {'token':'eyJhbGciOiJIUzI1NiIsImV4cCI6MT'}
        # login = requests.post("http://beop.rnbtech.com.hk/login",data=json.dumps(info),headers=headersJson)
        # status = json.loads(login.text)
        # if status.get('status') == True:
        #     token = login.cookies._cookies['beop.rnbtech.com.hk']['/']['token'].value
        #     cookies = {'userId':userid,'token':token}
        # else:
        #     cookies = {}
        try:
            r = requests.post(url,headers=headersJson,data=json.dumps(data),timeout=t)
        except ConnectTimeout as e:
            #print(e.__str__())
            assert 0,"错误信息发送数据%s 读取%s接口超时(超过%f秒!)" % (json.dumps(data), url,t)
        except Exception as e:
            print(e.__str__())
            assert 0, "错误信息发送数据%s 读取%s接口出错%s!" % (json.dumps(data), url,e.__str__())
        if r.status_code != 200:
            assert 0, "错误信息本次post请求发送数据%s 读取%s接口返回状态码不为200!status_code:%s,错误内容: %s" % (json.dumps(data), url,str(r.status_code), json.dumps(r.text, ensure_ascii=False))
        else:
            pass
        strJson = r.text
        rv = None
        try:
            rv = json.loads(strJson)
            return rv
        except:
            assert 0,"错误信息发送post请求%s接口返回的数据为空！" % url


    #带token的get请求
    @classmethod
    def tokenGet(self,url,timeout,name="projecttest@rnbtech.com.hk",pwd="h=Lp4U8+Lp",userid="2265"):
        # info = {"name":name,"pwd":pwd,"agent":{"screen":"1920 x 1080","browser":"Chrome","browserVersion":"52.0.2729.4","mobile":False,"os":"Windows","osVersion":"NT 4.0","cookies":True},"loginCode":"",'noRecord':1}
        # headersJson = {'content-type': 'application/json','token':'eyJhbGciOiJIUzI1NiIsImV4cCI6MT'}
        headers = {'token':'eyJhbGciOiJIUzI1NiIsImV4cCI6MT'}
        # login = requests.post("http://beop.rnbtech.com.hk/login",data=json.dumps(info),headers=headersJson)
        # status = json.loads(login.text)
        # if status.get('status') == True:
        #     token = login.cookies._cookies['beop.rnbtech.com.hk']['/']['token'].value
        #     cookies = {'userId':userid,'token':token}
        # else:
        #     cookies = {}
        try:
            r = requests.get(url, headers=headers,timeout=timeout)
        except Exception as e:
            print(e.__str__())
            if 'timeout' in e.__str__():
                assert 0,"错误信息读取%s接口超时,超过%.2f秒!" % (url, timeout)
            else:
                assert 0,"错误信息读取%s接口出错!" % (url, )

        if r.status_code != 200:
            assert 0,"错误信息本次发送get请求%s接口返回状态不为200!" % url
        else:
            print("本次发送get请求%s接口数据成功!" % url)

        strJson = r.text
        rv = None
        try:
            rv = json.loads(strJson)
            return rv
        except:
            assert 0,"请求%s接口返回的数据为空！" % url


    #kirry新建getsession请求
    @classmethod
    def getToken(self,url,name,passwd,loginUrl,timeout):
        header = {"content-type":"application/json"}
        data = {"name": name,"pwd": passwd}
        session = requests.session()
        session.post(loginUrl,json.dumps(data),headers = header)
        try:
            rv = session.get(url,timeout = timeout)
        except:
            assert 0,"请求接口%s失败!"%url
        if rv.status_code != 200:
            assert 0,"请求接口%s返回状态码不为200！"%url
        else:
            return json.loads(rv.text)

    #kirry新建postsession请求
    @classmethod
    def postToken(self,url,Data,name,passwd,loginUrl,timeout):
        header = {"content-type":"application/json"}
        data = {"name": name,"pwd": passwd}
        session = requests.session()
        session.post(loginUrl,json.dumps(data),headers = header)
        try:
            rv = session.post(url,json.dumps(Data),timeout = timeout)
        except:
            assert 0,"请求接口%s失败!"%url
        if rv.status_code != 200:
            assert 0,"请求接口%s返回状态码不为200！"%url
        else:
            return json.loads(rv.text)




    #发送json数据方法(旧方法)
    def postData(self, url, data,t=30):

        headers = {'content-type': 'application/json', 'token':'eyJhbGciOiJIUzI1NiIsImV4cCI6MT'}
        try:
            r = requests.post(url, data = json.dumps(data), headers=headers,timeout=t)
            test=json.dumps(data)
            j=data
            i=j
        except ConnectTimeout as e:
            #print(e.__str__())
            assert 0,"错误信息发送数据%s 读取%s接口超时(超过%f秒!)" % (json.dumps(data), url, t)
        if r.status_code != 200:
            assert 0,"错误信息本次发送post请求读取%s接口参数:%s返回状态码不为200为%s!" % (url,json.dumps(data),str(r.status_code))
        else:
            pass
        strJson = r.text
        rv = None
        try:
            rv = json.loads(strJson)
            return rv
        except:
            assert 0,"错误信息发送post请求%s接口返回的数据为空！" % url


    #获取Json数据方法(旧方法)
    def getData(self,url,timeout):
        headers = {'content-type': 'application/json', 'token':'eyJhbGciOiJIUzI1NiIsImV4cCI6MT'}
        try:
            r = requests.get(url, headers=headers,timeout=timeout)
        except Exception:
            assert 0,"错误信息读取%s接口超时,超过%d秒!" % (url, timeout)
        if r.status_code != 200:
            assert 0,"错误信息本次发送get请求%s接口返回状态不为200!" % url
        else:
            print("本次发送get请求%s接口数据成功!" % url)

        strJson = r.text
        rv = None
        try:
            rv = json.loads(strJson)
            return rv
        except:
            assert 0,"错误信息请求%s接口返回的数据为空！" % url

    @classmethod
    def getDataText(self, url, timeout):
        r=None
        headers = {'content-type': 'application/json', 'token': 'eyJhbGciOiJIUzI1NiIsImV4cCI6MT',
                   'User-Agent': 'User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36'
                   }
        try:
            r = requests.get(url, headers=headers, timeout=timeout)
        except Exception as e:
            print(e.__str__())
            assert 0,"错误信息读取%s接口超时,超过%d秒!" % (url,timeout)
        if r.status_code != 200:
            assert 0,"错误信息本次发送get请求%s接口返回状态不为200,为%s!" % (url,r.status_code)
        else:
            print("本次发送get请求%s接口数据成功!" % url)
        return r.text


    #读取实时数据数据点
    def get_realtimedata(serverip,proj,pointList):

        urlget = 'http://%s/get_realtimedata' %serverip
        rvget = None
        try:
            dataOrig = dict(proj=proj, pointList=pointList)
            rvget = BeopTools.getInstance().postJson(urlget, dataOrig)
        except:
            assert 0,'错误信息http://%s/get_realtimedata接口获取数据失败'%serverip

        return  rvget


    #设置实时数据点
    def set_realtimedata(serverip,projId,pointList,valueList):

        urlget = 'http://%s/set_mutile_realtimedata_by_projid' %serverip
        rvset = None
        try:
            dataOrig = dict(projId=projId, point=pointList,value=valueList)
            rvset = BeopTools.getInstance().postJson(urlget, dataOrig)
        except:
            assert 0,'错误信息http://%s/set_realtimedata接口获取数据失败'%serverip

        return  rvset

    #返回
    def strtime(self):
        return time.strftime('%Y-%m-%d %H:%M:%S',time.localtime())

    #返回上个月时间
    def his_timeM(self):
        #计算上个月的时间
        a = time.time() - 60*60*24*30
        return time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(a))
    def his_timeY(self):
        #计算半年前的时间
        a = time.time() - 60*60*24*182
        return time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(a))
    def his_timeW(self):
        #计算一周的时间
        a = time.time() - 60*60*24*7
        return time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(a))
    def his_timeH(self):
        #计算一小时的时间
        a = time.time() - 60*60
        return time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(a))
    def his_timeH2(self):
        #计算12小时的时间
        a = time.time() - 60*60*12
        return time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(a))
    def his_timeD(self):
        #计算一天的时间
        a = time.time() - 60*60*24
        return time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(a))



    #获取AssertionError信息
    @classmethod
    def ErrorInfo(self,failure):
        pat = re.compile('AssertionError:(.+)\\n$')
        m = re.search(pat, failure)
        if(m is None):
            return self.ErrorInfoPraNew(failure)
        else:
            return m.group(0)

    #帮主温控app错误信息
    @staticmethod
    def ErrorInfoLong(failure):
        pat = re.compile('AssertionError:(.+)\\n\\n(.+)\\n(.+)\\n(.+)\\n(.+)\\n$')
        m = re.search(pat,failure)
        return m.group(0)



    #获取错误信息(语句中不能带有\n)
    @classmethod
    def ErrorInfoPraNew(self, failure):
        pat = re.compile('AssertionError: 错误信息(.+)', re.S)
        m = re.findall(pat,failure)
        return '\n\n'.join(m)

    @classmethod
    def ErrorInfoPra(self, failure):
        pat = re.compile('错误信息(.+)')
        m = re.findall(pat,failure)
        return '\n\n'.join(m)

    @classmethod
    def ErrorInfoAuto(self,failure):
        pat = re.compile(r"(?<=AssertionError:)(.+\n)+")
        m = re.findall(pat,failure)
        return "\n".join(m)


    @classmethod
    def postDataExcept(self, url, data,timeout,testCaseID='000'):
        try:
            result = BeopTools.postData(self,url=url, data=data, t=timeout)
            return result
        except Exception as e:
            print(e.__str__())
            assert 0,e.__str__()

    @classmethod
    def getDataExcept(self, url,timeout,testCaseID='000'):
        try:
            result = BeopTools.getData(self,url=url, timeout=timeout)
            return result
        except Exception as e:
            print(e.__str__())
            assert 0,e.__str__()

    @classmethod
    def postDataFiles(self, url,files,timeout):
        headers = {'token':'eyJhbGciOiJIUzI1NiIsImV4cCI6MT'}
        try:
            r = requests.post(url=url, files=files,headers=headers, timeout=timeout)
        except Exception as e:
            print(e.__str__())
            assert 0,"读取%s接口超时,超过%d秒!" % (url,timeout)
        if r.status_code != 200:
            assert 0,"本次发送get请求%s接口返回状态不为200!" % url
        else:
            print("本次发送get请求%s接口数据成功!" % url)
        strJson = r.text
        rv = None
        try:
            rv = json.loads(strJson)
            return rv
        except:
            assert 0,"请求%s接口返回的数据为空！" % url


    @classmethod
    def receiveMail(self,email,password,pop3_server):
        try:
            # 连接到POP3服务器:
            server = poplib.POP3(pop3_server)
            # 身份认证:
            server.user(email)
            server.pass_(password)
            resp, mails, octets = server.list()
            forth_message = server.retr(len(mails))
            third_message = server.retr(len(mails)-1)
            two_message = server.retr(len(mails)-2)
            one_message = server.retr(len(mails)-3)
            server.quit()
            four_message=[forth_message,third_message,two_message,one_message]
            return four_message
        except Exception as e:
            print(e.__str__())
            assert 0,'receiveMail error:'+e.__str__()

    @classmethod
    def sendMessage(self,errors, url, data, t, testCaseID):
        rv = {}
        try:
            conn = self.getMysqlConn(database)
            self.setCase(conn, testCaseID)
            rv = self.postJsonToken(url=url, data=data, t=t)
        except Exception as e:
            errors.append(e.__str__())
        if rv.get('error') == 'ok':
            print('短信提醒成功!')
        else:
            errors.append("错误信息[%s]%s---发送短信失败!" % (self.getTime(), testCaseID))


