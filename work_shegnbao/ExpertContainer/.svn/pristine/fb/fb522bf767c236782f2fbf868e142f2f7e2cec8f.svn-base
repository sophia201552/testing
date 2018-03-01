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
from ExpertContainer import app
from requests.exceptions import *


class BeopTools:

    __instance = None
    def __init__(self):
        pass


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
        #修复1个bug,往多个log里写日志因为handlers太多
        if len(logger.handlers):
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

    # 抛出异常错误
    @classmethod
    def raiseError(self,error):
        if error != []:
            #print("\n".join(error))
            assert 0,"\n".join(error)
        else:
            pass



    # 调用BeopTools.getTime 获取当前时间字符串
    @classmethod
    def getTime(self):
        return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())


    # 获取错误信息
    @classmethod
    def catchErrorInfo(error):
        info = []
        pat = re.compile("\\n(.+)Error:(.+)")
        m = re.findall(pat,error)
        for e in m:
            info.append(e[0] + "Error: " + e[1])
        return "\n".join(info)


    # 给BeopTools创建一个实例并返回
    @classmethod
    def getInstance(self):
        if(self.__instance == None):
            self.__instance = BeopTools()
        return self.__instance


    # 发送Json数据post方法
    def postJson(self, url, data,t=30):
        headers = {'content-type': 'application/json', 'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
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


    # 获取随机字母字符串(randomlength为字符串长度, 其中字母不重复)
    @classmethod
    def random_str(self, randomlength=8):
        a = list(string.ascii_letters)
        random.shuffle(a)
        return ''.join(a[:randomlength])


    #获取Json数据
    def getJson(self, url):
        headers = {'content-type': 'application/json', 'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
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

    # 发送表单数据
    def postForm(self, url, data,t=30):
        info = {
            "name": app.config.get('BEOPWEB_HTTPAPI_USERNAME'),
            "pwd": app.config.get('BEOPWEB_HTTPAPI_PASSWORD'),
            "agent": {
                "screen": "1920 x 1080", "browser": "Chrome", "browserVersion": "52.0.2729.4",
                "mobile": False, "os": "Windows", "osVersion": "NT 4.0", "cookies": True
            },
            "loginCode": ""
        }
        headersJson = {'content-type': 'application/json', 'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
        headers = {'content-type': 'application/x-www-form-urlencoded', 'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
        login = requests.post("http://%s/login" % app.config['BEOPWEB_ADDR'], data=json.dumps(info),
                              headers=headersJson)
        token = login.cookies._cookies['%s' % app.config['BEOPWEB_ADDR']]['/']['token'].value
        cookies = {'userId': '404', 'token': token}
        try:
            r = requests.post(url, data=data, headers=headers, timeout=t, cookies=cookies)
        except ConnectTimeout as e:
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

    # 发送带token的json数据(目前用这个方法)
    def postJsonToken(self, url, data,t=30):
        info = {
            "name": app.config.get('BEOPWEB_HTTPAPI_USERNAME'),
            "pwd": app.config.get('BEOPWEB_HTTPAPI_PASSWORD'),
            "agent": {
                "screen": "1920 x 1080", "browser": "Chrome", "browserVersion": "52.0.2729.4",
                "mobile": False, "os": "Windows", "osVersion": "NT 4.0", "cookies": True
            },
            "loginCode": ""
        }
        headersJson = {'content-type': 'application/json', 'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
        headers = {'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
        login = requests.post("http://%s/login" % app.config['BEOPWEB_ADDR'], data=json.dumps(info),
                              headers=headersJson)
        token = login.cookies._cookies['%s' % app.config['BEOPWEB_ADDR']]['/']['token'].value
        cookies = {'userId': '404', 'token': token}
        try:
            r = requests.post(url,headers=headersJson,data=json.dumps(data),timeout=t,cookies=cookies)
        except ConnectTimeout as e:
            assert 0,"错误信息发送数据%s 读取%s接口超时(超过%f秒!)" % (json.dumps(data), url,t)
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

    # 带token的get请求
    def tokenGet(self,url,timeout):
        info = {
            "name": app.config.get('BEOPWEB_HTTPAPI_USERNAME'),
            "pwd": app.config.get('BEOPWEB_HTTPAPI_PASSWORD'),
            "agent": {
                "screen": "1920 x 1080", "browser": "Chrome", "browserVersion": "52.0.2729.4",
                "mobile": False, "os": "Windows", "osVersion": "NT 4.0", "cookies": True
            },
            "loginCode": ""
        }
        headersJson = {'content-type': 'application/json', 'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
        headers = {'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
        login = requests.post("http://%s/login" % app.config['BEOPWEB_ADDR'], data=json.dumps(info),
                              headers=headersJson)
        token = login.cookies._cookies['%s' % app.config['BEOPWEB_ADDR']]['/']['token'].value
        cookies = {'userId': '404', 'token': token}
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

    # 发送json数据方法(旧方法)
    def postData(self, url, data, t=30):
        headers = {'content-type': 'application/json', 'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
        try:
            r = requests.post(url, data=json.dumps(data), headers=headers, timeout=t)
            test = json.dumps(data)
            j = data
            i = j
        except ConnectTimeout as e:
            assert 0, "错误信息发送数据%s 读取%s接口超时(超过%f秒!)" % (json.dumps(data), url, t)
        if r.status_code != 200:
            assert 0, "错误信息本次发送post请求读取%s接口返回状态码不为200!" % url
        else:
            pass
        strJson = r.text
        rv = None
        try:
            rv = json.loads(strJson)
            return rv
        except:
            assert 0, "错误信息发送post请求%s接口返回的数据为空！" % url

    # 获取Json数据方法(旧方法)
    def getData(self, url, timeout):
        headers = {'content-type': 'application/json', 'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
        try:
            r = requests.get(url, headers=headers, timeout=timeout)
        except Exception:
            assert 0, "错误信息读取%s接口超时,超过%d秒!" % (url, timeout)
        if r.status_code != 200:
            assert 0, "错误信息本次发送get请求%s接口返回状态不为200!" % url
        else:
            print("本次发送get请求%s接口数据成功!" % url)

        strJson = r.text
        rv = None
        try:
            rv = json.loads(strJson)
            return rv
        except:
            assert 0, "错误信息请求%s接口返回的数据为空！" % url

    @classmethod
    def getDataText(self, url, timeout):
        r = None
        headers = {'content-type': 'application/json', 'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
        try:
            r = requests.get(url, headers=headers, timeout=timeout)
        except Exception as e:
            print(e.__str__())
            assert 0, "错误信息读取%s接口超时,超过%d秒!" % (url, timeout)
        if r.status_code != 200:
            assert 0, "错误信息本次发送get请求%s接口返回状态不为200!" % url
        else:
            print("本次发送get请求%s接口数据成功!" % url)
        return r.text

    # 读取实时数据数据点
    def get_realtimedata(serverip, proj, pointList):

        urlget = 'http://%s/get_realtimedata' % serverip
        rvget = None
        try:
            dataOrig = dict(proj=proj, pointList=pointList)
            rvget = BeopTools.getInstance().postJson(urlget, dataOrig)
        except:
            assert 0, '错误信息http://%s/get_realtimedata接口获取数据失败' % serverip
        return rvget

    # 设置实时数据点
    def set_realtimedata(serverip, projId, pointList, valueList):

        urlget = 'http://%s/set_mutile_realtimedata_by_projid' % serverip
        rvset = None
        try:
            dataOrig = dict(projId=projId, point=pointList, value=valueList)
            rvset = BeopTools.getInstance().postJson(urlget, dataOrig)
        except:
            assert 0, '错误信息http://%s/set_realtimedata接口获取数据失败' % serverip

        return rvset

    # 返回
    def strtime(self):
        return time.strftime('%Y-%m-%d %H:%M:%S',time.localtime())

    # 返回上个月时间
    def his_timeM(self):
        # 计算上个月的时间
        a = time.time() - 60*60*24*30
        return time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(a))

    def his_timeY(self):
        # 计算半年前的时间
        a = time.time() - 60 * 60 * 24 * 182
        return time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(a))

    def his_timeW(self):
        # 计算一周的时间
        a = time.time() - 60 * 60 * 24 * 7
        return time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(a))

    def his_timeH(self):
        # 计算一小时的时间
        a = time.time() - 60 * 60
        return time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(a))

    def his_timeH2(self):
        # 计算12小时的时间
        a = time.time() - 60 * 60 * 12
        return time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(a))

    def his_timeD(self):
        # 计算一天的时间
        a = time.time() - 60 * 60 * 24
        return time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(a))

    # 获取AssertionError信息
    def ErrorInfo(failure):
        pat = re.compile('AssertionError:(.+)\\n$')
        m = re.search(pat, failure)
        return m.group(0)

    # 帮主温控app错误信息
    def ErrorInfoLong(failure):
        pat = re.compile('AssertionError:(.+)\\n\\n(.+)\\n(.+)\\n(.+)\\n(.+)\\n$')
        m = re.search(pat, failure)
        return m.group(0)

    # 获取错误信息(语句中不能带有\n)
    @classmethod
    def ErrorInfoPraNew(self, failure):
        pat = re.compile('AssertionError: 错误信息(.+)', re.S)
        m = re.findall(pat, failure)
        return '\n\n'.join(m)

    @classmethod
    def ErrorInfoPra(self, failure):
        pat = re.compile('错误信息(.+)')
        m = re.findall(pat,failure)
        return '\n\n'.join(m)

    @classmethod
    def postDataExcept(self, url, data,timeout,testCaseID):
        try:
            result = BeopTools.postData(self,url=url, data=data, t=timeout)
            return result
        except Exception as e:
            print(e.__str__())
            assert 0,"错误信息[%s]%s---发送数据: %s ,访问 %s接口失败." % (BeopTools.getTime(), json.dumps(data), testCaseID, url)

    @classmethod
    def getDataExcept(self, url,timeout,testCaseID):
        try:
            result = BeopTools.getData(self,url=url, timeout=timeout)
            return result
        except Exception as e:
            print(e.__str__())
            assert 0,"错误信息[%s]%s---访问%s接口失败." % (BeopTools.getTime(), testCaseID, url)

    @classmethod
    def postDataFiles(self, url,files,timeout):
        headers = {'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
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


class Task(Thread):
    def getName(self):
        return self.name
