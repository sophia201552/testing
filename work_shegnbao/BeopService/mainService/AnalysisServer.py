__author__ = 'David'

from flask import Flask, request, json
from ctypes import *
from ctypes import cdll
from mainService import app
import logging

@app.route('/')
def hello_world():
    return 'BEOPService is running!'

@app.route('/analysis/get_pointList_from_s3db', methods=['POST'])
def get_pointList_from_s3db():
    #data = request.get_json()
    try:
        dllname = app.config.get('DLL_NAME')
        dll = cdll.LoadLibrary(dllname)
        dll.SystemAndPointConfig.restype = c_char_p
        szPara = create_string_buffer(json.dumps({"pathConfig": app.config.get('DLL_CONFIG_PATH')}).encode(encoding="utf-8"))
        strResult = dll.SystemAndPointConfig(szPara)
    except Exception as e:
        print('get_pointList_from_s3db error:' + e.__str__())
        app.logger.error('get_pointList_from_s3db error:' + e)
    return c_char_p(strResult).value.decode()

@app.route('/analysis/generalRegressor', methods=['POST'])
def generalRegressor():
    try:
        dllname = app.config.get('DLL_NAME')
        dll = cdll.LoadLibrary(dllname)
        dll.GeneralPredictor.restype = c_char_p
        szPara = create_string_buffer(json.dumps(request.get_json()).encode(encoding="utf-8"))
        strResult = dll.GeneralRegressor(szPara)
    except Exception as e:
        print('generalRegressor error:' + e.__str__())
        app.logger.error('generalRegressor error:' + e)
    return c_char_p(strResult).value.decode()

@app.route('/analysis/generalPredictor', methods=['POST'])
def generalPredictor():
    try:
        dllname = app.config.get('DLL_NAME')
        dll = cdll.LoadLibrary(dllname)
        dll.GeneralPredictor.restype = c_char_p
        szPara = create_string_buffer(json.dumps(request.get_json()).encode(encoding="utf-8"))
        strResult = dll.GeneralPredictor(szPara)
    except Exception as e:
        print('generalPredictor error:' + e.__str__())
        app.logger.error('generalPredictor error:' + e)
    return c_char_p(strResult).value.decode()

@app.route('/analysis/startWorkspaceDataGenCluster', methods=['POST'])
def startWorkspaceDataGenCluster():
    try:
        data = request.get_json()
        dllname = app.config.get('DLL_NAME')
        options = data.get('options')
        dll = cdll.LoadLibrary(dllname)
        dll.DataAnalysis.restype = c_char_p
        szPara = create_string_buffer(json.dumps(options).encode(encoding="utf-8"))
        strResult = dll.DataAnalysis(szPara)
    except Exception as e:
        print('startWorkspaceDataGenCluster error:' + e.__str__())
        app.logger.error('startWorkspaceDataGenCluster error:' + e)
    return c_char_p(strResult).value.decode()

