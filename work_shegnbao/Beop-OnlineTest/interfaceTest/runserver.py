import sys, os
sys.path.append(os.path.split(sys.path[0])[0])
from interfaceTest.runCase import run
import datetime
from datetime import timedelta
from functools import update_wrapper
from flask import Flask, abort
from flask import make_response, request, current_app, json
import logging
from interfaceTest import app
from interfaceTest.Methods.BeopTools import BeopTools
from interfaceTest.base_case.Base015checkProjectState import Base015

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
    return 'running'

@app.route("/runAtTask", methods=['POST'])
@crossdomain(origin='*')
def runAtTask():
    data = request.get_json()
    caseList = data.get('case', [])
    if not caseList:
        return json.jsonify(msg='The params you give are not list or None for testcases.Please check your params are right or not!')
    else:
        try:
            run(caseList)
        except Exception as e:
            print(e.__str__())
            logging.error('runAtTask error:' + e.__str__())
            return json.jsonify({'caseList':caseList, 'info':e.__str__(), 'result':False})
        return json.jsonify({'caseList':caseList, 'result':True})


@app.route("/checkCaseNeedSend/", methods=['POST'])
def getCaseInfo():
    data = request.get_json()
    CaseID = data.get('CaseID')
    delay = data.get('delay')
    rv = BeopTools.checkCaseNeedSend(CaseID, delay)
    if rv:
        return json.jsonify(rt=True)
    else:
        return json.jsonify(rt=False)

@app.route("/setCase/<CaseID>", methods=['GET'])
def setCase(CaseID):
    try:
        conn = BeopTools.getMysqlConn(app.config['MYSQL_NAME'])
        BeopTools.setCase(conn, CaseID)
        return json.jsonify(rt=True)
    except Exception as e:
        logging.error('setCase error:' + e.__str__())
        return json.jsonify(rt=False, msg=e.__str__())


@app.route("/projectStatus",methods=['GET'])
def getProjectStatus():
    a = Base015()
    rv = a.Test()
    return json.dumps(rv, ensure_ascii=False)


if __name__ == '__main__':
    logFileName = './log/runserverLog%s.txt' % datetime.datetime.now().strftime('%Y-%m-%d-%H-%M')
    logging.basicConfig(filename=logFileName, level=logging.ERROR,
                        format='%(asctime)s --- levelname:%(levelname)s filename: %(filename)s funcName:%(funcName)s '
                               'outputNumber: [%(lineno)d]  thread: %(threadName)s output msg: %(message)s',
                        datefmt='[%Y-%m-%d %H:%M:%S]')
    app.run('0.0.0.0', 9001, threaded=False)

