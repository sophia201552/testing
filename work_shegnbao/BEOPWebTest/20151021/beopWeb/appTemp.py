from beopWeb import app
from beopWeb.BEOPDataAccess import *
import sys
import os
import re
import copy
from flask import Flask,request,session,g,make_response,redirect,url_for,abort,render_template,send_file,flash,json,jsonify
import mysql.connector
from datetime import datetime,timedelta
import time
import calendar
from beopWeb.BEOPDataAccess import *
from beopWeb.BEOPDataBufferManager import BEOPDataBufferManager
from os import environ, listdir, path, unlink, remove, makedirs
import csv
import requests
from beopWeb.BEOPMongoDataAccess import BEOPMongoDataAccess
from beopWeb.MongoConnManager import MongoConnManager

@app.route('/appTemperature/room/list/<userId>', methods=['GET'])
def getRoomList(userId):
    buildingList, roomList = MongoConnManager.getMongoConnByName().appTempGetRoomList()
    return json.dumps({'buildingList': buildingList, 'roomList': roomList}, ensure_ascii=False)

@app.route('/appTemperature/room/getDetail/<roomId>',methods=['GET'])
def getRoomDetail(roomId):
    rv = MongoConnManager.getMongoConnByName().appTempGetRoomDetail(roomId)
    return json.dumps(rv, ensure_ascii=False)

@app.route('/appTemperature/setTemperature',methods = ['POST'])
def setTemperature():
    return {status: 'success'}

@app.route('/appTemperature/get_realtime_value',methods=['POST'])
def getRealTemperature():
    data = request.get_json()
    sensorIds = data.get('sensors', [])
    controllerIds = data.get('controllers', [])
    # sensorIds = ['5604ec3a2e472556b4fff382']
    # controllerIds = ['5604ec9a2e472556b4fff386']
    rv = BEOPDataAccess.getInstance().appTempGetRealtimeVal(sensorIds, controllerIds)
    return json.dumps(rv, ensure_ascii=False)

# 新增一个 building 信息
# 示例数据：
# data = {
#     'id': ObjectId(),
#     'name': '展想广场',
#     'address': '展想广场1号楼',
#     'principal': '张三',
#     'gps': '0,0'
# }
# 成功返回：{'status': 'OK'}
# 失败返回：{'status': 'ERROR', 'msg': '失败信息'}
@app.route('/appTemperature/createBuilding',methods=['POST'])
def createBuilding():
    data = request.get_json()
    rv = MongoConnManager.getMongoConnByName().appTempCreateBuilding(data)
    return json.dumps(rv, ensure_ascii=False)

# 新增一个 room 信息
# 示例数据：
# data = [{
#     'id': '561df903039e403ca22a4150',
#     'name': '1103',
#     'floor': '11',
#     'gatewayId': '666',
#     'buildingId': '56177022039e404d7f2f91d7',
#     'map': {
#         'img': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB3aWR0aD0nNicgaGVpZ2h0PSc2Jz4KICA8bGluZSB4MT0nMTAlJyB5MT0nMTAlJyB4Mj0nOTAlJyB5Mj0nOTAlJyBzdHJva2Utd2lkdGg9JzEnIHN0cm9rZT0nI2U4ZThlOCcvPgogIDxsaW5lIHgxPSc5MCUnIHkxPScxMCUnIHgyPScxMCUnIHkyPSc5MCUnIHN0cm9rZS13aWR0aD0nMScgc3Ryb2tlPScjZThmMGZmJy8+ICAKPC9zdmc+',
#         'width': 1920,
#         'height': 1080,
#         'x': 0,
#         'y': 0,
#         'scale': 1,
#         'orientation': 0
#     }
# },{
#     'id': '561df903039e403ca22a4151',
#     'name': '1103',
#     'floor': '11',
#     'gatewayId': '666',
#     'buildingId': '56177022039e404d7f2f91d7',
#     'map': {
#         'img': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB3aWR0aD0nNicgaGVpZ2h0PSc2Jz4KICA8bGluZSB4MT0nMTAlJyB5MT0nMTAlJyB4Mj0nOTAlJyB5Mj0nOTAlJyBzdHJva2Utd2lkdGg9JzEnIHN0cm9rZT0nI2U4ZThlOCcvPgogIDxsaW5lIHgxPSc5MCUnIHkxPScxMCUnIHgyPScxMCUnIHkyPSc5MCUnIHN0cm9rZS13aWR0aD0nMScgc3Ryb2tlPScjZThmMGZmJy8+ICAKPC9zdmc+',
#         'width': 1920,
#         'height': 1080,
#         'x': 0,
#         'y': 0,
#         'scale': 1,
#         'orientation': 0
#     }
# }]
# 成功返回：{'status': 'OK'}
# 失败返回：{'status': 'ERROR', 'msg': '失败信息'}
@app.route('/appTemperature/saveRoom',methods=['POST'])
def saveRoom():
    data = request.get_json()
    rv = MongoConnManager.getMongoConnByName().appTempSaveRoom(data)
    return json.dumps(rv, ensure_ascii=False)

# 新增一个 space 信息
# 示例数据：
# data = [{
#     'id': '446eaa4a0011444730041600',
#     'name': '封闭空间3',
#     'path': [],
#     'width': 1920,
#     'height': 1080,
#     'x': 0,
#     'y': 0,
#     'roomId': '561786d8039e4037947115a1',
#     'wallIds': [],
#     'sensorIds': [],
#     'controllerIds': []
# }, {
#     'id': '446eaa4a0011444730041601',
#     'name': '封闭空间4',
#     'path': [],
#     'width': 1920,
#     'height': 1080,
#     'x': 0,
#     'y': 0,
#     'roomId': '561786d8039e4037947115a1',
#     'wallIds': [],
#     'sensorIds': [],
#     'controllerIds': []
# }]
# 成功返回：{'status': 'OK'}
# 失败返回：{'status': 'ERROR', 'msg': '失败信息'}
@app.route('/appTemperature/saveSpace',methods=['POST'])
def saveSpace():
    data = request.get_json()
    rv = MongoConnManager.getMongoConnByName().appTempSaveSpace(data)
    return json.dumps(rv, ensure_ascii=False)

# 新增一个 sensor 信息
# 示例数据：
# data = {
#     'id': '561787e3039e4019d87b0400',
#     'name': '2号传感器',
#     'x': 100,
#     'y': 100,
#     'spaceId': '5617879f039e401054b3a465',
#     'mac': '10-C3-7B-4B-AA-B0',
#     'network': 'CMCC'
# }
# 成功返回：{'status': 'OK'}
# 失败返回：{'status': 'ERROR', 'msg': '失败信息'}
@app.route('/appTemperature/saveSensor',methods=['POST'])
def saveSensor():
    data = request.get_json()
    
    rv = MongoConnManager.getMongoConnByName().appTempSaveSensor(data)
    return json.dumps(rv, ensure_ascii=False)

# 新增一个 controller 信息
# 示例数据：
# data = {
#     'id': '56178841039e4019a0c12401',
#     'name': '2号控制器',
#     'x': 0,
#     'y': 0,
#     'spaceId': '5617879f039e401054b3a465',
#     'mac': '10-C3-7B-4B-AA-B0',
#     'network': 'CMCC',
#     'isLocal': 1
# }
# 成功返回：{'status': 'OK'}
# 失败返回：{'status': 'ERROR', 'msg': '失败信息'}
@app.route('/appTemperature/saveController',methods=['POST'])
def saveController():
    data = request.get_json()
    rv = MongoConnManager.getMongoConnByName().appTempSaveController(data)
    return json.dumps(rv, ensure_ascii=False)

# 新增一个完整的 room 信息，包括 spaces、controllers、sensors
# 示例数据：
# data = {
#     'room': {
#         'id': '561df903039e403ca22a4150',
#         'name': '1103',
#         'floor': '11',
#         'gatewayId': '666',
#         'buildingId': '56177022039e404d7f2f91d7',
#         'map': {
#             'img': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB3aWR0aD0nNicgaGVpZ2h0PSc2Jz4KICA8bGluZSB4MT0nMTAlJyB5MT0nMTAlJyB4Mj0nOTAlJyB5Mj0nOTAlJyBzdHJva2Utd2lkdGg9JzEnIHN0cm9rZT0nI2U4ZThlOCcvPgogIDxsaW5lIHgxPSc5MCUnIHkxPScxMCUnIHgyPScxMCUnIHkyPSc5MCUnIHN0cm9rZS13aWR0aD0nMScgc3Ryb2tlPScjZThmMGZmJy8+ICAKPC9zdmc+',
#             'width': 1920,
#             'height': 1080,
#             'x': 0,
#             'y': 0,
#             'scale': 1,
#             'orientation': 0
#         }
#     },
#     'spaces': [{
#         'id': '446eaa4a0011444730041600',
#         'name': '封闭空间3',
#         'path': [],
#         'width': 1920,
#         'height': 1080,
#         'x': 0,
#         'y': 0,
#         'roomId': '561786d8039e4037947115a1',
#         'wallIds': [],
#         'sensorIds': [],
#         'controllerIds': []
#     }],
#     'controllers': [{
#         'id': '56178841039e4019a0c12401',
#         'name': '2号控制器',
#         'x': 0,
#         'y': 0,
#         'spaceId': '446eaa4a0011444730041600',
#         'mac': '10-C3-7B-4B-AA-B0',
#         'network': 'CMCC',
#         'isLocal': 1
#     }],
#     'sensors': [{
#         'id': '561787e3039e4019d87b0400',
#         'name': '2号传感器',
#         'x': 100,
#         'y': 100,
#         'spaceId': '446eaa4a0011444730041600',
#         'mac': '10-C3-7B-4B-AA-B0',
#         'network': 'CMCC'
#     }]
# }
# 成功返回：{'status': 'OK'}
# 失败返回：{'status': 'ERROR', 'msg': '失败信息'}
@app.route('/appTemperature/saveAll', methods=['POST'])
def saveAll():
    data = request.get_json()
    # save room
    room = data.get('room')
    roomRs = MongoConnManager.getMongoConnByName().appTempSaveRoom(room)
    # save spaces
    spaceList = data.get('spaces')
    spaceRs = MongoConnManager.getMongoConnByName().appTempSaveSpace(spaceList)
    # save controllers
    controllerList = data.get('controllers')
    controllerRs = MongoConnManager.getMongoConnByName().appTempSaveController(controllerList)
    # save sensors
    sensorList = data.get('sensors')
    sensorRs = MongoConnManager.getMongoConnByName().appTempSaveSensor(sensorList)
    return json.dumps({
        'room': roomRs,
        'spaces': spaceRs,
        'controllers': controllerRs,
        'sensors': sensorRs    
    }, ensure_ascii=False)