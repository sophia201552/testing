from jinja2 import Environment, PackageLoader,FileSystemLoader

import os
import time
import logging
from subprocess import PIPE, Popen

import requests
from bson.objectid import ObjectId
from flask import json, jsonify, render_template, request, Flask
from beopWeb import app
import pdfkit
import base64


def sendFactoryPreviewToEmailQueue(option, userInfoList):
    rt = False
    try:
        if isinstance(option,dict):
            pageId = option.get('pageId')
            url = option.get('url')
            lang = option.get('lang','zh')
            title = option.get('title','')
            if not url:
                raise Exception('url is not available')
        else:
            raise Exception('param option error: not a dict')
        stdout, stderr = getContentFromFactoryPreview(url,option.get('projectId'))
        if stdout:
            html = makeEmailContentbyHTML(stdout, option, False)
            if html:
                if len(stdout) < 100:
                    print('pdf not data')
                    return False
                attachment = stdout
                attachment = attachment[:-1]
                attachmentNew = base64.b64decode(attachment)
                if not attachmentNew:
                    attachmentNew = ''
                content = {}
                content.update({'msgId': ObjectId().__str__()})
                content.update({'type': 'email'})
                if lang == 'zh':
                    content.update({'subject': '您收到一份关于' + title + '的报表'})
                elif lang == 'en':
                    content.update({'subject': 'Your ' + title + ' is ready'})
                content.update({'recipients': userInfoList})
                content.update({'html': html})
                content.update({
                    'attachments': [{
                        'filename': title,
                        'content_type': 'application/pdf',
                        'data': attachmentNew
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
                            print('error')
                else:
                    print('error')
    except Exception as e:
        print('error')
    print(rt)
    return rt


def getContentFromFactoryPreview(url,projectId):
    rt = None
    error = None
    try:
        pwd = os.getcwd()
        jspath = pwd + '\\beopWeb\\mod_common\\mail\\script\\headless.js'
        exepaht = pwd + '\\beopWeb\\mod_common\\mail\\script\\phantomjs'
        if isinstance(url, str):
            cmd = ['node',jspath,'http://beop.rnbtech.com.hk/factory/preview/reportWrap/'+url]
            print(cmd)
            content = Popen(cmd, stdout=PIPE, stderr=PIPE)
            rt = content.stdout.read().decode()
    except Exception as e:
        error = e.__str__()
    return rt, error


def makeEmailContentbyHTML(content, option, isContent=False):
    """
    David 20160912
    :param content:
    :param option:
    :param isContent:
    :return:
    """
    rt = None
    try:
        if isinstance(content, str):
            lang = option.get('lang', 'zh')
            url = 'http://beop.rnbtech.com.hk/factory/preview/report/%s/1?projectId=%s' % (
                option.get('pageId'), option.get('projectId', ''))
            report_data = {
                'isContent': isContent,
                'logo': option.get('logo', 'logo_beop.png'),
                'datetime': option.get('time', time.strftime("%Y-%m-%d", time.localtime())),
                'title': option.get('title', ''),
                'company': option.get('project', 'BeOP'),
                'name': option.get('title', ''),
                'content': content,
                'url': url
            }
            if isContent:
                rt = render_template('email/reportEmail_pdfAttach.html', report=report_data)
            else:
                if lang == 'zh':
                    rt = render_template('email/reportEmail_theme_default.html', report=report_data)
                elif lang == 'en':
                    rt = render_template('email/reportEmail_theme_default_en.html', report=report_data)
        else:
            raise Exception('content is not str')
    except Exception:
        logging.error('Unhandled exception! option=%s, isContent=%s', option, isContent)
    return rt


def generatePdfAttachment(html):
    option = {
        'no-outline': '',
        'no-background': '',
        'footer-line': '',
        'header-line': ''
    }
    try:
        output = pdfkit.from_string(html, False, options=option)
        return output
    except Exception as e:
        print('generatePdfAttachment error:' + e.__str__())
        return False
