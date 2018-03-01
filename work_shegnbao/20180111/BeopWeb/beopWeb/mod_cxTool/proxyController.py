'''
计算点服务ExpertContainer与网站服务BeOP Web分别部署在不同服务器上. 网站在调用计算点服务时, 会有浏览器上跨域问题.
另外出于https服务使用个数的考虑, 需要避免跨域.
通过将在BeOP Web上对ExpertContainer的请求进行本地代理, 从而实现避免浏览器上的跨域.
'''
__author__ = 'win7'

from beopWeb.mod_cxTool import bp_pointTool

from beopWeb.mod_common.Utils import Utils
import requests
from flask import request, json
from beopWeb import app


@bp_pointTool.route('/proxy/<path:path>', methods=['GET', 'POST'])
def proxy(path):
    '''
    计算点接口代理. 为了满足https需要, 将涉及计算点服务器的接口, 通过此接口进行代理,避免跨域的产生.
    :param path:请求计算点服务的路径
    '''
    request_path = app.config.get('EXPERT_CONTAINER_URL') + path
    if request.query_string.decode():  # 支持query_string
        request_path += '?' + request.query_string.decode()
    r = None
    # 进行转发
    if request.method == 'GET':
        r = requests.get(request_path)
    elif request.method == 'POST':
        r = requests.post(request_path, request.form)
    # 结果处理
    if not r:
        return Utils.beop_response_error(msg='not support the request.')

    try:
        return json.dumps(json.loads(r.text), ensure_ascii=False)
    except:
        return r.text
