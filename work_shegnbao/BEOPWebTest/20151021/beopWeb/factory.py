"""
Routes and views for the flask application.
"""

from beopWeb import app
from beopWeb.BEOPDataAccess import *
from flask import request, url_for, redirect, render_template, json
from datetime import datetime, timedelta
import time
import subprocess
import mysql.connector



_logicProc = dict()

@app.route('/factory')
def factory():
    """Renders the home page."""
    return render_template('indexFactory.html',
        title='Factory Page',
        year=datetime.now().year,)


@app.route('/loginFactory')
def loginFactory():
    return redirect(url_for('static',filename='views/factory/login.html'))


@app.route('/strategyConfigParams')
def strategyConfigParams():
    return redirect(url_for('static',filename='views/factory/strategy/strategyConfigParams.html'))


@app.route('/strategyScreen')
def strategyScreen():
    return redirect(url_for('static',filename='views/factory/strategy/strategyScreen.html'))


@app.route('/strategyView')
def strategyView():
    return redirect(url_for('static',filename='views/factory/strategy/strategyView.html'))


@app.route('/testDialog')
def testDialog():
    return redirect(url_for('static',filename='views/factory/strategy/testDialog.html'))


@app.route('/strategyConfigParamDialog')
def strategyConfigParamDialog():
    return redirect(url_for('static',filename='views/factory/strategy/strategyConfigParamDialog.html'))


@app.route('/strategyChart')
def strategyChart():
    return redirect(url_for('static',filename='views/factory/strategy/strategyChart.html'))


@app.route('/get_logic_config', methods=['GET'])
def get_logic_config():
    rv = BEOPDataAccess.getInstance().getLogicConfig()
    return json.dumps(rv)


@app.route('/get_logic_config/<name>', methods=['GET'])
def get_logic_config_by_name(name):
    rv = BEOPDataAccess.getInstance().getLogicConfig(name)
    return json.dumps(rv)


@app.route('/set_logic_config', methods=['POST'])
def set_logic_config():
    rv = BEOPDataAccess.getInstance().setLogicConfig(request.get_json())
    return rv


@app.route('/get_logic_status/<name>', methods=['GET'])
def get_logic_status(name):
    rv = BEOPDataAccess.getInstance().getLogicStatus(name)
    return json.dumps(rv)


@app.route('/get_logic_status_all', methods=['GET'])
def get_logic_status_all():
    rv = BEOPDataAccess.getInstance().getLogicStatus(None)
    return json.dumps(rv)


@app.route('/set_logic_status', methods=['POST'])
def set_logic_status():
    rv = BEOPDataAccess.getInstance().setLogicStatus(request.get_json())
    return rv


@app.route('/get_logic_param/<name>', methods=['GET'])
def get_logic_param(name):
    rv = BEOPDataAccess.getInstance().getLogicParam(name)
    return json.dumps(rv)


@app.route('/set_logic_param', methods=['POST'])
def set_logic_param():
    rv = BEOPDataAccess.getInstance().setLogicParam(request.get_json())
    return rv


@app.route('/get_logic_runtimeparam/<name>', methods=['GET'])
def get_logic_runtimeparam(name):
    rv = BEOPDataAccess.getInstance().getLogicRuntimeParam(name)
    return json.dumps(rv)


@app.route('/set_logic_runtimeparam', methods=['POST'])
def set_logic_runtimeparam():
    rv = BEOPDataAccess.getInstance().setLogicRuntimeParam(request.get_json())
    return rv


@app.route('/get_logic_log/<name>', methods=['GET'])
def get_logic_log(name):
    rv = BEOPDataAccess.getInstance().getLogicLog(name)
    return json.dumps(rv)


@app.route('/set_logic_log', methods=['POST'])
def set_logic_log():
    rv = BEOPDataAccess.getInstance().setLogicLog(request.get_json())
    return rv


@app.route('/start_logic/<name>')
def start_logic(name):
    print('startLogic')
    c = BEOPDataAccess.getInstance().getLogicConfig(name)
    if len(c) > 0:
        u = c[0].get('logicurl')
    else:
        return 'error: logic not found'
    if u:
        rv = startLogicBg(name,u)
        if rv == 'success':
            BEOPDataAccess.getInstance().setLogicRunStatus(name,'running')
    else:
        return 'error: logic file not found'

    return json.dumps(rv)


@app.route('/stop_logic/<name>')
def stop_logic(name):
    rv = stopLogic(name)
    return json.dumps(rv)


def stopLogic(name):
    print('startLogic')
    c = BEOPDataAccess.getInstance().getLogicConfig(name)
    if len(c) > 0:
        u = c[0].get('logicurl')
    else:
        return 'error: logic not found'
    if u:
        rv = stopLogicBg(name,u)
        if rv == 'success':
            BEOPDataAccess.getInstance().setLogicRunStatus(name,'stop')
    else:
        return 'error: logic file not found'
    return rv
    

def startLogicBg(name,path):
    print('startLogicBg')
    global _logicProc
    p = _logicProc.get(name)
    if p:
        if p.poll() is None:
            return 'error: logic is already running'
    try:
        p = subprocess.Popen(path)
    except:
        return 'error: starting logic failed'
    time.sleep(1)
    if p.poll():
        return 'error: logic stopped'
    _logicProc[name] = p
    return 'success'


def stopLogicBg(name,path):
    print('stopLogicBg')
    global _logicProc
    p = _logicProc.get(name)
    if p:
        try:
            p.terminate()
        except:
            return 'error: terminating logic failed'
        time.sleep(1)
        if p.poll() is None:
            return 'error: terminating logic failed'
    else:
        return 'error: logic is not running'
    return 'success'
