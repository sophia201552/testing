#-*- coding: UTF-8 -*-
__author__ = 'golding'


from beopWeb import app
from beopWeb.BEOPDataAccess import *
from beopWeb.views import *
from flask import url_for, redirect, render_template, request, json,  make_response
from datetime import datetime
import hashlib
import xml.etree.ElementTree as ET
import urllib.request
import requests
import random
import os

def wx_authorize():
    signature = request.args.get('signature')
    print('signature result:' + signature)
    timestamp = request.args.get('timestamp')
    print('timestamp result:' + timestamp)
    nonce = request.args.get('nonce')
    print('nonce result:' + nonce)
    echostr = request.args.get('echostr')
    print('echostr result:' + echostr)
    token = 'RNBtoken2013'
    list = [token, timestamp, nonce]
    list.sort()
    tmpStr = "%s%s%s" % tuple(list)
    hashcode = hashlib.sha1(tmpStr.encode(encoding='utf-8')).hexdigest()
    print('calculated result:' + hashcode)
    print('demand result:' + signature)
    if hashcode == signature:
        print('********************Authorize Success')
        return echostr
    else:
        print('*********************Authorize Failed')
        return 'ERROR'


@app.route('/wx/logout', methods=['GET','POST'])
def wx_logout():
    useridWx = request.args.get('useridWx')

    BEOPDataAccess.getInstance().logout_user(useridWx)
    if id is None:
        return render_template("wx/account.html")

@app.route('/wx/auth', methods=['GET','POST'])
def wx_login_auth():
    useridWx = request.args.get('userid')
    useridBeop = request.args.get('username')
    userpwd = request.args.get('pwd')
    id = BEOPDataAccess.getInstance().validate_user(dict(name=useridBeop,pwd=userpwd))
    if id is None:
        return render_template("wx/authfailed.html")

    BEOPDataAccess.getInstance().saveUserWxInfo(id, useridWx)
    return render_template("wx/authsuccess.html", data = id)

@app.route('/wx/sendtask', methods=['GET','POST'])
def wx_send_task():
    token= wx_request_token()
    req_url = "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=" + token
    postData = '''{
           "touser":"o44iZs8f60uT3lhALZL1rv1Jwr8M",
           "template_id":"2wy8WeFLcfa2FDXVJs_YJxKWWuQ2pRBgDBo-DzgXwNs",
           "url":"http://weixin.qq.com/download",
           "topcolor":"#FF0000",
           "data":{
                    "first": {
                       "value":"你有一条新的任务！",
                       "color":"#DD0000"
                   },
                   "keyword1": {
                       "value":"华为诊断任务",
                       "color":"#173177"
                   },
                   "keyword2":{
                       "value":"BeOP管理员",
                       "color":"#173177"
                   },
                   "keyword3": {
                       "value":"2014年1月9日",
                       "color":"#173177"
                    },
                   "remark":{
                       "value":"    所有不同的建议都列成清单，每一个新的建议，都一行。我要核对是否与你们计数相同。被执行的建议在该行打勾。总结：左工和amy写，对这些建议是否合理、是否易于操作，给出意见和反思",
                       "color":"#888888"

                   }
           }
       }'''
    #url_values = urllib.parse.urlencode(post)
    url_values = postData.encode(encoding='utf-8')
    req = urllib.request.Request(req_url, url_values)
    response = urllib.request.urlopen(req)
    html = response.read()
    sentReturnInfo = json.loads(html)
    errorMsg=sentReturnInfo['errmsg']
    return errorMsg


@app.route('/wx/oauth2', methods=['GET','POST'])
def wx_oauth2():
    usr_code = request.args.get('code')
    usr_link_state = request.args.get('state')


    #get token by user_code
    req_url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx33a6846b5985f9f0&secret=1d6c2ea363fe7a490816b9c2949d5e34&code=%s&grant_type=authorization_code" %(usr_code)
    req = urllib.request.Request(req_url)
    response = urllib.request.urlopen(req)
    userInfo= response.read().decode('utf-8')
    #print(weatherInfo)
    jsonData_userInfo = json.loads(userInfo)

    user_token = jsonData_userInfo['access_token']
    user_openid = jsonData_userInfo['openid']
    #get user id by token
    req_url2 = "https://api.weixin.qq.com/sns/userinfo?access_token=%s&openid=%s" %(user_token, user_openid)
    response2 = urllib.request.urlopen(req_url2)

    userInfoDetail = response2.read().decode('utf-8')
    jsonData_userInfoDetail = json.loads(userInfoDetail)

    userInfo = BEOPDataAccess.getInstance().getUserIdByWxOpenId(user_openid)
    usrIdInBeop = None
    if userInfo is not None:
        usrIdInBeop = userInfo['id']

    if usr_link_state=='7':
        if usrIdInBeop is None:#id
            return render_template("wx/auth.html", data= user_openid)
        else:
            return render_template("wx/account.html", data= userInfo['username'])
    elif usr_link_state=='0':#å³é®åæ°
        return render_template("wx/myfavorite.html", data= usrIdInBeop)
    elif usr_link_state=='1':#æçå¾è¡¨
        return render_template("wx/mygraph.html", data= usrIdInBeop)
    elif usr_link_state=='2':#æçæ¥æ¥
        now = datetime.now()
        dailyreport_url = "wx/%s/dailyreport/%s.html" %('hsimc',now.strftime("%Y-%m-%d"))
        return render_template(dailyreport_url, data= usrIdInBeop)
    elif usr_link_state=='3':#æçå¨æ¥
        return render_template("wx/HuaweiPlant/weeklyreport/2014-12-29.html", data= usrIdInBeop)
    elif usr_link_state=='4':#å¾å®æ
        return render_template("wx/HuaweiPlant/weeklyreport/2014-12-29.html", data= usrIdInBeop)
    elif usr_link_state=='5':#å·²å®æ
        return render_template("wx/HuaweiPlant/weeklyreport/2014-12-29.html", data= usrIdInBeop)
    elif usr_link_state=='6':#æçç»è®¡
        return render_template("wx/HuaweiPlant/weeklyreport/2014-12-29.html", data= usrIdInBeop)


@app.route('/wx/getmyfavorite', methods =['GET','POST'])
def get_myfavorite():
    useridBeop = request.args.get('userid')
    return render_template("wx/myfavorite.html", data=useridBeop)

@app.route('/wx/gettodayreport', methods=['GET','POST'])
def get_today_report():
    return render_template("wx/TodayReportChs.html")

@app.route('/wx/testmyfavorite', methods =['GET','POST'])
def test_my_graph():
    return render_template("wx/myfavorite.html", data=8)

@app.route('/wx', methods=['GET','POST'])
def wechat_auth():
  # å¾®ä¿¡è®¤è¯token
  if request.method == 'GET':
      return wx_authorize()
  else:
      print("recv msg")
      rec = request.stream.read()
      xml_rec = ET.fromstring(rec)
      msgtype = xml_rec.find('MsgType').text
      tou = xml_rec.find('ToUserName').text
      fromu = xml_rec.find('FromUserName').text
      xml_rep_img = "<xml><ToUserName><![CDATA[%s]]></ToUserName><FromUserName><![CDATA[%s]]></FromUserName><CreateTime>%s</CreateTime><MsgType><![CDATA[news]]></MsgType><ArticleCount>1</ArticleCount><Articles><item><Title><![CDATA[%s]]></Title><Description><![CDATA[%s]]></Description><PicUrl><![CDATA[%s]]></PicUrl></item></Articles><FuncFlag>1</FuncFlag></xml>"
      #å¦ææ.pngä¸­æç¤ºçå¾ææ¶æ¯
      xml_rep_mutiimg = "<xml><ToUserName><![CDATA[%s]]></ToUserName><FromUserName><![CDATA[%s]]></FromUserName><CreateTime>%s</CreateTime><MsgType><![CDATA[news]]></MsgType><ArticleCount>5</ArticleCount><Articles><item><Title><![CDATA[%s]]></Title><PicUrl><![CDATA[%s]]></PicUrl></item><item><Title><![CDATA[ä¸æµ·ä¸­è¯]]></Title><Url><![CDATA[%s]]></Url></item><item><Title><![CDATA[åäº¬çç«]]></Title><Url><![CDATA[%s]]></Url></item><item><Title><![CDATA[é¦æ¸¯åæ¶¦]]></Title><Url><![CDATA[%s]]></Url></item><item><Title><![CDATA[æ·±å³åä¸º]]></Title><Url><![CDATA[%s]]></Url></item></Articles></xml>"
      #ç¨æ·ä¸æ¦å³æ³¨æ¹å¬ä¼è´¦å·ï¼èªå¨åå¤ä»¥ä¸å¾ææ¶æ¯
      if msgtype == "event":
          eventkey = xml_rec.find('EventKey').text
          event = xml_rec.find('Event').text
          if event == "subscribe":
              return response
          elif event == "CLICK" and eventkey=="myreport":
              return response
          elif event == "CLICK" and eventkey=="myid":
              msg_title = "æçæ¥è¡¨"
              msg_imag_url = "http://beop.rnbtech.com.hk/images/wx/wxdailyreporttitle.jpg"
              responseContent = MakeResponseAuthorize(rec)
              response = make_response(responseContent)
              response.content_type='application/xml'
              return response
      else:
          return response
      return render_template("page_not_found.html",messages="beop message",comments="beop comments")


def MakeResponseAuthorize(requestFromUser):
    xml_rec = ET.fromstring(requestFromUser)
    msgtype = xml_rec.find('MsgType').text
    tou = xml_rec.find('ToUserName').text
    fromu = xml_rec.find('FromUserName').text

    #è¯»åæææéé¡¹ç®çå½æ¥æä»¶
    xml_rep_img = '''<xml><ToUserName><![CDATA[%s]]></ToUserName><FromUserName><![CDATA[%s]]></FromUserName>
                    <CreateTime>%s</CreateTime><MsgType><![CDATA[news]]></MsgType>
                    <ArticleCount>1</ArticleCount>
                    <Articles>
                        <item>
                            <Title><![CDATA[%s]]></Title>
                            <PicUrl><![CDATA[%s]]></PicUrl>
                            <Description><![CDATA[%s]]></Description>
                            <Url><![CDATA[%s]]></Url>
                        </item>
                    </Articles>
                    <FuncFlag>1</FuncFlag></xml>'''

    msg_title = "å¸å·ç»å®"
    now = datetime.now()
    bind_url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx33a6846b5985f9f0&redirect_uri=http://beop.rnbtech.com.hk/wx/oauth2&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect"
    my_imag_url = "http://images.rnbtech.com.hk/static/images/wx/wxdailyreporttitle.jpg"

    msgcontent = 'è¯·ç¹å»è¿å¥å¸å·ç»å®.'
    #getdailyreport('simc',now.strftime("%Y-%m-%d"))

    msg_imag_url = bind_url
    #ç¹å»æ¯é¡¹ï¼è½¬å°ç¸åºçurl
    responseString = xml_rep_img % (fromu,tou,str(int(time.time())),msg_title,my_imag_url, msgcontent,bind_url )
    return responseString



@app.route('/createmenu', methods=['GET'])
def createmenu():
        token= wx_request_token()
        post = '''{
            "button": [
                {"name": "æçå³æ³¨", "sub_button": [
                    {"type": "view", "name": "å³é®åæ°", "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx33a6846b5985f9f0&redirect_uri=http://beop.rnbtech.com.hk/wx/oauth2&response_type=code&scope=snsapi_userinfo&state=0#wechat_redirect"},
                    {"type": "view", "name": "è¶å¿å¾", "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx33a6846b5985f9f0&redirect_uri=http://beop.rnbtech.com.hk/wx/oauth2&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect"}]
                },
                {"name": "æçè¿è¥", "sub_button": [
                    {"type": "view", "name": "æ¯æ¥å°ç»", "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx33a6846b5985f9f0&redirect_uri=http://beop.rnbtech.com.hk/wx/oauth2&response_type=code&scope=snsapi_userinfo&state=2#wechat_redirect"},
                    {"type": "view", "name": "è¿è¥å¨æ¥", "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx33a6846b5985f9f0&redirect_uri=http://beop.rnbtech.com.hk/wx/oauth2&response_type=code&scope=snsapi_userinfo&state=3#wechat_redirect"}]
                 },
                {"name": "æçä»»å¡", "sub_button": [
                    {"type": "view", "name": "å¾å®æ", "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx33a6846b5985f9f0&redirect_uri=http://beop.rnbtech.com.hk/wx/oauth2&response_type=code&scope=snsapi_userinfo&state=4#wechat_redirect"},
                    {"type": "view", "name": "å·²å®æ", "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx33a6846b5985f9f0&redirect_uri=http://beop.rnbtech.com.hk/wx/oauth2&response_type=code&scope=snsapi_userinfo&state=5#wechat_redirect"},
                    {"type": "view", "name": "å¢éæç", "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx33a6846b5985f9f0&redirect_uri=http://beop.rnbtech.com.hk/wx/oauth2&response_type=code&scope=snsapi_userinfo&state=6#wechat_redirect"},
                    {"type": "view", "name": "è´¦å·", "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx33a6846b5985f9f0&redirect_uri=http://beop.rnbtech.com.hk/wx/oauth2&response_type=code&scope=snsapi_userinfo&state=7#wechat_redirect"}]
               }
            ]
        }'''

        url = 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=' + token

        #url_values = urllib.parse.urlencode(post)
        url_values = post.encode(encoding='utf-8')
        req = urllib.request.Request(url, url_values)
        response = urllib.request.urlopen(req)
        return response.read()


@app.route('/getmenu', methods=['get'])
def wx_getmenu():
    token = wx_request_token()
    url = 'https://api.weixin.qq.com/cgi-bin/menu/get?access_token=' + token
    response = urllib.request.urlopen(url)
    return response.read()



def wx_request_token():
    appid="wx33a6846b5985f9f0"
    secret="1d6c2ea363fe7a490816b9c2949d5e34"
    url='https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appid+'&secret='+secret
    response = urllib.request.urlopen(url)
    html = response.read()
    tokeninfo = json.loads(html)
    token=tokeninfo['access_token']
    return token


session = requests.session()
session.headers = {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:28.0) Gecko/20100101 Firefox/28.0',
                        'Accept': 'application/json, text/javascript, */*; q=0.01',
                        'Accept-Language': 'zh-cn,zh;q=0.8,en-us;q=0.5,en;q=0.3',
                        'Accept-Encoding': 'deflate',
                        'DNT': '1',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Referer': 'https://mp.weixin.qq.com/',
                        'Connection': 'keep-alive',
                        'Pragma': 'no-cache',
                        'Cache-Control': 'no-cache'
                    }

token = None


def login(username, pwd):
    """ç»å½"""
    # æ­£ç¡®ååºï¼{"base_resp":{"ret":0,"err_msg":"ok"},"redirect_url":"\/cgi-bin\/home?t=home\/index&lang=zh_CN&token=898262162"}
    global token
    pwd = hashlib.md5(pwd).hexdigest()
    url = 'https://mp.weixin.qq.com/cgi-bin/login?lang=zh_CN'
    data = {'f': 'json',
            'imgcode': '',
            'pwd': pwd,
            'username': username}

    res = session.post(url, data)

    print ('response: login' + res.text)
    j = json.loads(res.text)
    status = j['base_resp']['err_msg']
    if status == 'ok':
        token = j['redirect_url'].split('=')[-1]
        return True
    return False


def singlesend(tofakeid, content):
    """åéæ¶æ¯ç»åä¸ªäºº
    å¤æ¬¡åéæ¶æ¯å¯è½éè¦åéå¿è·³ä¿¡æ¯ï¼æªæµè¯ï¼"""
    #æ­£ç¡®ååºï¼{"base_resp":{"ret":0,"err_msg":"ok"}}
    url = 'https://mp.weixin.qq.com/cgi-bin/singlesend'
    data = {'ajax': '1',
            'content': content,
            'f': 'json',
            'imgcode': '',
            'lang': 'zh_CN',
            'random': str(random.random()),
            't': 'ajax-response',
            'tofakeid': tofakeid,
            'token': token,
            'type': '1',
    }

    res = session.post(url, data)

    print
    'response: singlesend', res.text

    j = json.loads(res.text)

    status = j['base_resp']['err_msg']

    if status == 'ok':
        return True

    return False


def masssend(content):
    """ç¾¤åæ¶æ¯"""
    #æ­£ç¡®ååºï¼{"ret":"0", "msg":"ok"}
    url = 'https://mp.weixin.qq.com/cgi-bin/masssend'
    data = {'ajax': '1',
            'city': '',
            'content': content,
            'country': '',
            'f': 'json',
            'groupid': '-1',
            'imgcode': '',
            'lang': 'zh_CN',
            'province': '',
            'random': str(random.random()),
            'sex': '0',
            'synctxnews': '0',
            'synctxweibo': '0',
            't': 'ajax-response',
            'token': token,
            'type': '1'
            }

    res = session.post(url, data)

    print
    'response: masssend', res.text

    j = json.loads(res.text)

    if j['msg'] == 'ok':
        return True

    return False


def testSendToSingle():
    res = login('username', 'password')

    print
    'response: login', res

    if not res:
        sys.exit()

    #ç¾¤å
    res = masssend('sendall')
    print
    'response: masssend', str(res)

    #åéç»åäºº
    #res=singlesend('pppppp')
    #print 'response: singlesend',str(res)
