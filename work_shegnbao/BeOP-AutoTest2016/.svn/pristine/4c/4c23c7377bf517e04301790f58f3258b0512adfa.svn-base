from runCaseForDiagnosis import runCase
import datetime
from datetime import timedelta
from functools import update_wrapper
from flask import Flask, abort
from flask import make_response, request, current_app, json
import logging
from Methods.OtherTools import OtherTools
from config import app
import os
#from checkProjectState import CaseP040
from Methods.BEOPMongoDataAccess import BEOPMongoDataAccess
from bson import ObjectId
def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, str):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, str):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)

    return decorator

@app.route('/', methods=['GET'])
def hello():
    return 'hello'

@app.route("/regression/", methods=['POST'])
@crossdomain(origin='*')
def regressionTest():
    data = request.get_json()
    caseList = data.get('case', [])
    url = data.get('url') if data.get('url') else 'beop.rnbtech.com.hk'

    if not caseList:
        return json.jsonify(error=1, msg='The params you give are not list or None for testcases.Please check your params are right or not!',)
    else:
        try:
            os.system(r'taskkill /F /IM chrome.exe')
            os.system(r'taskkill /F /IM chromedriver.exe')
            obj = runCase()
            obj.suite('manual_{}'.format(','.join(caseList)), caseList=caseList, url=url)
            result = obj.report()
            print(result[1])
            return json.dumps(result[1], ensure_ascii=False)
        except Exception as e:
            print(e.__str__())
            logging.error('regressionTest error:' + e.__str__())
            return json.jsonify(error=1, msg='There is an error in Beop-AutoTest for UI! Please check your log!',content='')

@app.route("/getImage/<caseId>/<filename>", methods=['GET'])
@crossdomain(origin='*')
def getImage(caseId, filename):
    bs = OtherTools.getBs64(caseId, filename)
    if filename:
        return "<img src='data:image/png;base64,{}' />".format(bs)
    else:
        return "<h1>服务器上未获取到错误截图!</h1>"

@app.route("/savePic", methods=['POST'])
@crossdomain(origin='*')
def savePic():
    data = request.get_json()
    caseId = data.get('caseId')
    filename = data.get('filename')
    machine = data.get('machine')
    bsPic = data.get('bsPic')
    a =BEOPMongoDataAccess(app.config['MONGO_ADDR'])
    return a.mdbBb['AutoTestPic'].insert_one({'caseId': caseId, 'filename': filename, 'machine': machine, 'bsPic': bsPic}).inserted_id.__str__()

@app.route("/getPic/<objId>", methods=['GET'])
@crossdomain(origin='*')
def getPic(objId):
    a =BEOPMongoDataAccess(app.config['MONGO_ADDR'])
    cursor = a.mdbBb['AutoTestPic'].find({'_id': ObjectId(objId)})
    for x in cursor:
        return "<img src='data:image/png;base64,{}' />".format(x.get('bsPic'))

'''
@app.route("/projectStatus",methods=['GET'])
def getProjectStatus():
    a = CaseP040()
    rv = a.Test()
    return json.dumps(rv, ensure_ascii=False)
'''


if __name__ == '__main__':
    logFileName = './log/runserverLog%s.txt' % datetime.datetime.now().strftime('%Y-%m-%d-%H-%M')
    logging.basicConfig(filename=logFileName, level=logging.ERROR,
                        format='%(asctime)s --- levelname:%(levelname)s filename: %(filename)s funcName:%(funcName)s '
                               'outputNumber: [%(lineno)d]  thread: %(threadName)s output msg: %(message)s',
                        datefmt='[%Y-%m-%d %H:%M:%S]')
    app.run('0.0.0.0', 5008, threaded=False)

