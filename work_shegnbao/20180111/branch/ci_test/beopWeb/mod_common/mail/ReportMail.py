#coding=utf-8
from jinja2 import Environment, PackageLoader,FileSystemLoader

import os
import time
from subprocess import PIPE, Popen

import requests
from bson.objectid import ObjectId
from flask import json, jsonify, render_template, request, Flask
from beopWeb import app
import pdfkit

# env = Environment(loader=FileSystemLoader('./beopWeb/mod_common/screenCatch/templates'))

# @app.route('/sendReport', methods=['GET'])
# def sendFactoryReport():
#     option = {
#         'pageId':'148913143072607354c98715',
#         'logo':'293_logo.png',
#         'title':'test+_title',
#         'company':'175Liverpool',
#         'time':'2012-12-12'
#     }
#     sendFactoryPreviewToEmailQueue(option, ['john.yang@rnbtech.com.hk'])

def sendFactoryPreviewToEmailQueue(option, userInfoList):
    rt = False
    try:
        if isinstance(option,dict):
            pageId = option.get('pageId')
            lang = option.get('lang','zh')
            title = option.get('title','')
            if not pageId:
                raise Exception('pageId is not available')
        else:
            raise Exception('param option error: not a dict')
        stdout, stderr = getContentFromFactoryPreview(pageId,option.get('projectId'))
        # print(stdout)
        # print(stderr)
        # stdout = 'test'
        if stdout:
            html = makeEmailContentbyHTML(stdout, option, False)
            contentHTML = makeEmailContentbyHTML(stdout, option, True)
            if html:
                # userEmailAddrList = [v[1] for k,v in userInfoList.items()]
                attachment = generatePdfAttachment(contentHTML)
                if not attachment:
                    attachment = ''
                content = {}
                content.update({'msgId':ObjectId().__str__()})
                content.update({'type':'email'})
                if lang == 'zh':
                    content.update({'subject':'您收到一份关于'+ title + '的报表'})
                elif lang == 'en':
                    content.update({'subject':'Your '+ title + ' is ready'})
                content.update({'recipients':userInfoList})
                content.update({'html':html})
                content.update({
                    'attachments':[{
                        'filename':title,
                        'content_type':'application/pdf',
                        'data':attachment
                    }]
                })
                post_data = {'value':str(content), 'name':'email'}
                r = requests.post ('http://%s/mq/mqSendTask'%('beopservice.beopsmart.com',), headers={'content-type': 'application/json'}, data=json.dumps(post_data), timeout=300)
                if r.status_code == 200:
                    strJson = r.text
                    ret = json.loads(strJson)
                    if ret:
                        if ret.get('error', '') == 'ok':
                            rt = True
                        else:
                            #DiagnosisDataMethods._logger.writeLog('%s:' % (get_current_func_name()) + ' send_email error', True)
                            print('error')
                else:
                    #DiagnosisDataMethods._logger.writeLog('%s:' % (get_current_func_name()) + 'status_code is %d' % (r.status_code,), True)
                    print('error')
    except Exception as e:
        #DiagnosisDataMethods._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), True)
        print('error')
    print(rt)
    return rt

def getContentFromFactoryPreview(pageId,projectId):
    rt = None
    error = None
    try:
        pwd = os.getcwd()
        jspath = pwd + '\\beopWeb\\mod_common\\mail\\script\\getReportHtml.js'
        exepaht = pwd + '\\beopWeb\\mod_common\\mail\\script\\phantomjs'
        # #cmd = 'phantomjs %s %s' % (jspath, str(pageId))
        if (isinstance(pageId, str)):
            # cmd = ['./beopWeb/mod_common/screenCatch/script/phantomjs','./beopWeb/mod_common/screenCatch/script/getReportHtml.js',pageId]
            cmd = [exepaht,jspath,pageId,projectId.__str__()]
            print(cmd)
            content = Popen(cmd, stdout=PIPE, stderr=PIPE)
            #content.wait()
            #if content.returncode == 0:
            rt = content.stdout.read().decode()
            #else:
                #error = content.stderr.read().decode('GBK')
    except Exception as e:
        error = e.__str__()
    return rt, error

def makeEmailContentbyHTML(content, option, isContent = False):
    '''
    David 20160912
    :param content:
    :return:
    '''
    rt = None
    #tem = '<!DOCTYPE html><html><meta charset="utf-8">'
    try:
        if isinstance(content, str):
            # content = content[149:]
            lang = option.get('lang', 'zh')
            url = 'http://beop.rnbtech.com.hk/factory/preview/report/%s/0'%(str(option.get('pageId')))
            report_data = {'isContent':isContent,'logo':option.get('logo','logo_beop.png'),'datetime':option.get('time', time.strftime("%Y-%m-%d", time.localtime())),
                           'title':option.get('title',''), 'company':option.get('project','BeOP'), 'name':option.get('title',''), 'content':content, 'url':url}
            #template = env.get_template('reportEmail_theme_default.html')
            if isContent:
                rt = render_template('email/reportEmail_pdfAttach.html', report = report_data)
            else:
                if lang == 'zh':
                    rt = render_template('email/reportEmail_theme_default.html', report = report_data)
                elif lang == 'en':
                    rt = render_template('email/reportEmail_theme_default_en.html', report = report_data)
        else:
            raise Exception('content is not str')
    except Exception as e:
        pass
    return rt


def generatePdfAttachment(html):
    option = {
        'no-outline': '',
        'no-background':'',
        'footer-line':'',
        'header-line':''
    }
    try:
        # if cover_html:
        #     temp_cover_file_path = Utils.get_pdf_cover_temp_path()
        #     with open(temp_cover_file_path, 'w', encoding='utf-8') as f:
        #         f.write(cover_html)
        #     output = pdfkit.from_string(html, False, css=css, cover=temp_cover_file_path)
        #     os.remove(temp_cover_file_path)
        # else:
        output = pdfkit.from_string(html, False, options = option)
        return output
    except Exception as e:
        print('generatePdfAttachment error:' + e.__str__())
        return False

# cmd = ['./script/phantomjs','./script/getReportHtml.js','148913143072607354c98715']