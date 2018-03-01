# -*- encoding=utf-8 -*-
__author__ = 'golding'
import time
import requests,json
from requests.exceptions import ConnectTimeout
from suds.client import Client
from ExpertContainer import app


class HttpTestTool:
    @classmethod
    def postJson(cls, url, data,t=30):
        headers = {'content-type': 'application/json', 'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
        try:
            cur_time = time.time()
            r = requests.post(url, data = json.dumps(data), headers=headers,timeout=t)
            used = time.time() - cur_time
            test=json.dumps(data)
            j=data
            i=j
        except Exception as e:
            print('postJson error: ' + e.__str__())
            return dict(error=1,msg = "发送数据%s 读取%s接口出错" % (json.dumps(data), url))
        if used > t:
            return dict(error=1,msg = "本次发送post数据%s 读取%s接口超时!" % (json.dumps(data), url))
        else:
            pass
        strJson = r.text
        rv = None
        try:
            rv = json.loads(strJson)
            return dict(error=0,msg = rv)
        except Exception as e:
            return dict(error=1,msg = e.__str__())

    @classmethod
    def getJson(cls, url, timeout=30):
        headers = {'content-type': 'application/json', 'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
        try:
            cur_time = time.time()
            r = requests.get(url, headers=headers,timeout=timeout)
            used = time.time() - cur_time
        except:
            return dict(error=1,msg="读取%s接口超时" % url)
        if used > 15:
            assert dict(error=1,msg = "本次发送get请求读取%s接口超时!" % url)
        else:
            pass

        strJson = r.text
        rv = None
        try:
            rv = json.loads(strJson)
            return rv
        except:
            return None

    @classmethod
    def postForm(cls, url, data, t=30):
        info = {
            "name": app.config.get('BEOPWEB_HTTPAPI_USERNAME'),
            "pwd": app.config.get('BEOPWEB_HTTPAPI_PASSWORD'),
            "agent": {"screen": "1920 x 1080", "browser": "Chrome", "browserVersion": "52.0.2729.4", "mobile": False,
                      "os": "Windows", "osVersion": "NT 4.0", "cookies": True}, "loginCode": "", 'noRecord': 1}
        headersJson = {'content-type': 'application/json', 'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
        headers = {'content-type': 'application/x-www-form-urlencoded', 'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
        login = requests.post("http://%s/login" % app.config['BEOPWEB_ADDR'], data=json.dumps(info),
                              headers=headersJson)
        token = login.cookies._cookies['%s' % app.config['BEOPWEB_ADDR']]['/']['token'].value
        cookies = {'userId': '404', 'token': token}
        try:
            r = requests.post(url, data=data, headers=headers, timeout=t, cookies=cookies)
        except ConnectTimeout as e:
            #print(e.__str__())
            return dict(error=1,msg = "发送数据%s 读取%s接口超时(超过%f秒!)" % (json.dumps(data), url,t))
        except Exception as e:
            print(e.__str__())
            return dict(error=1,msg = "发送数据%s 读取%s接口出错!" % (json.dumps(data), url))

        if r.status_code != 200:
            return dict(error=1,msg = "本次post请求发送数据%s 读取%s接口返回状态码不为200!" % (json.dumps(data), url))
        else:
            pass
        strJson = r.text
        rv = None
        try:
            rv = json.loads(strJson)
            return rv
        except:
            return dict(error=1,msg = "发送post请求%s接口返回的数据为空！" % url)

    @classmethod
    def postJsonWithCookie(cls, url, data,t=30):
        info = {
            "name": app.config.get('BEOPWEB_HTTPAPI_USERNAME'),
            "pwd": app.config.get('BEOPWEB_HTTPAPI_PASSWORD'),
            "agent": {"screen": "1920 x 1080", "browser": "Chrome", "browserVersion": "52.0.2729.4", "mobile": False,
                      "os": "Windows", "osVersion": "NT 4.0", "cookies": True}, "loginCode": "", 'noRecord': 1}
        headersJson = {'content-type': 'application/json', 'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
        headers = {'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
        login = requests.post("http://%s/login" % app.config['BEOPWEB_ADDR'],data=json.dumps(info),headers=headersJson)
        status = json.loads(login.text)
        if status.get('status') == True:
            token = login.cookies._cookies['%s' % app.config['BEOPWEB_ADDR']]['/']['token'].value
            cookies = {'userId':'404','token':token}
        else:
            cookies = {}
        try:
            r = requests.post(url,headers=headersJson,data=json.dumps(data),timeout=t,cookies=cookies)
        except ConnectTimeout as e:
            #print(e.__str__())
            return dict(error=1,msg = "发送数据%s 读取%s接口超时(超过%f秒!)" % (json.dumps(data), url,t))
        except Exception as e:
            print(e.__str__())
            return dict(error=1,msg = "发送数据%s 读取%s接口出错%s!" % (json.dumps(data), url,e.__str__()))
        if r.status_code != 200:
            return dict(error=1,msg = "本次post请求发送数据%s 读取%s接口返回状态码不为200!status_code:%s,错误内容: %s" % (json.dumps(data), url,str(r.status_code), json.dumps(r.text, ensure_ascii=False)))
        else:
            pass
        strJson = r.text
        rv = None
        try:
            rv = json.loads(strJson)
            return rv
        except:
            return dict(error=1,msg = "发送post请求%s接口返回的数据为空！" % url)

    @classmethod
    def getWithCookie(cls,url,timeout):
        info = {
            "name": app.config.get('BEOPWEB_HTTPAPI_USERNAME'),
            "pwd": app.config.get('BEOPWEB_HTTPAPI_PASSWORD'),
            "agent": {"screen": "1920 x 1080", "browser": "Chrome", "browserVersion": "52.0.2729.4", "mobile": False,
                      "os": "Windows", "osVersion": "NT 4.0", "cookies": True}, "loginCode": "", 'noRecord': 1}
        headersJson = {'content-type': 'application/json', 'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
        headers = {'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
        login = requests.post("http://%s/login" % app.config['BEOPWEB_ADDR'],data=json.dumps(info),headers=headersJson)
        status = json.loads(login.text)
        if status.get('status') == True:
            token = login.cookies._cookies['%s' % app.config['BEOPWEB_ADDR']]['/']['token'].value
            cookies = {'userId':'404','token':token}
        else:
            cookies = {}
        try:
            r = requests.get(url, headers=headers,timeout=timeout,cookies=cookies)
        except Exception as e:
            print(e.__str__())
            if 'timeout' in e.__str__():
                return dict(error=1, msg="读取%s接口超时,超过%.2f秒!" % (url, timeout))
            else:
                return dict(error=1, msg="读取%s接口出错!" % (url, ))

        if r.status_code != 200:
            return dict(error=1, msg="本次发送get请求%s接口返回状态不为200!" % url)
        else:
            print("本次发送get请求%s接口数据成功!" % url)

        strJson = r.text
        rv = None
        try:
            rv = json.loads(strJson)
            return rv
        except:
            return dict(error=1, msg="请求%s接口返回的数据为空！" % url)

    @classmethod
    def getDataText(cls, url,timeout):
        r=None
        headers = {'content-type': 'application/json', 'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
        try:
            r = requests.get(url, headers=headers, timeout=timeout)
        except Exception as e:
            print(e.__str__())
            return dict(error=1, msg="读取%s接口超时,超过%d秒!" % (url,timeout))
        if r.status_code != 200:
            return dict(error=1, msg="本次发送get请求%s接口返回状态不为200!" % url)
        else:
            print("本次发送get请求%s接口数据成功!" % url)
        return r.text

    @classmethod
    def postDataFiles(cls, url, files, timeout):
        headers = {'token': app.config.get('BEOPWEB_SECRET_TOKEN')}
        try:
            r = requests.post(url=url, files=files, headers=headers, timeout=timeout)
        except Exception as e:
            print(e.__str__())
            return dict(error=1, msg="读取%s接口超时,超过%d秒!" % (url, timeout))
        if r.status_code != 200:
            return dict(error=1, msg="本次发送get请求%s接口返回状态不为200!" % url)

        strJson = r.text
        rv = None
        try:
            rv = json.loads(strJson)
            return rv
        except:
            return dict(error=1, msg="请求%s接口返回的数据为空！" % url)

    @staticmethod
    def invoke_web_service(url, method, params):
        rt = None
        try:
            client = Client(url)
        except Exception as e:
            raise Exception(e.__str__())
        if hasattr(client, 'service'):
            if hasattr(client.service, method):
                try:
                    rt = getattr(client.service, method)(params)
                except Exception as e:
                    raise Exception(e.__str__())
            else:
                raise Exception('Method error') 
        else:
            raise Exception('Service error')
        return rt

    @staticmethod
    def get_web_service_info(url):
        rt = {}
        try:
            client = Client(url)
            method_obj = client.wsdl.services[0].ports[0].methods
        except Exception as e:
            raise Exception(e.__str__())
        for item in method_obj:
            method_name = item.__str__()
            method = method_obj[method_name]
            input_params = method.binding.input
            rt.update({method_name: {'name': input_params.param_defs(method)[0][1].name.__str__(),
                                     'type': input_params.param_defs(method)[0][1].type}})
        return rt
