"""
Routes and views for the flask application.
"""

from beopWeb import app
from beopWeb.BEOPDataAccess import *
from flask import request, url_for, redirect, render_template, json, jsonify
from datetime import datetime, timedelta
import time
import subprocess
import mysql.connector

@app.route('/factory')
def factory():
    """Renders the factory page."""
    return render_template('indexFactory.html',
        title='Factory Page',)


@app.route('/factory/publish', methods=['POST'])
def factoryPublish(projectId):
    data = request.get_json()
    sourceId = data.get('sourceId')
    targetId = data.get('targetId')
    type = data.get('type')

    #TODO
    return jsonify('success')


@app.route('/factory/getProjectList/<userId>', methods=['GET'])
def factoryGetProjectList(userId):
    #TODO
    data = [{"_id": 1, "lastReceivedTime": "2015-11-03 17:34:12", "latlng": "31.213228,121.607895", "name_cn": "aaaaa", "name_en": "hsimc", "name_english": "Simc", "online": "Online", "pic": "hsimc.jpg"}, 
        {"_id": 2, "lastReceivedTime": "2015-11-03 17:34:12", "latlng": "22.7104921,113.4565704", "name_cn": "bbb", "name_en": "dajin", "name_english": "Dajin Electronic Technology", "online": "Online", "pic": "dajin.jpg"}, 
        {"_id": 3, "lastReceivedTime": "2015-11-03 17:34:12", "latlng": "32.045339,118.807922", "name_cn": "ccc", "name_en": "panda", "name_english": "CEC PANDA", "online": "Online", "pic": "panda.jpg"}, 
        {"_id": 4, "lastReceivedTime": "2015-11-03 17:34:12", "latlng": "34.7466185,113.6023368", "name_cn": "ddd", "name_en": "wdzzsy", "name_english": "Wanda Zhengzhou (Commercial)", "online": "Online", "pic": "wdzzsy.jpg"}, 
        {"_id": 5, "lastReceivedTime": "2015-11-03 17:33:37", "latlng": "34.7466185,113.6009823", "name_cn": "333", "name_en": "wdzzbh", "name_english": "Wanda Zhengzhou (Shopping Mall)", "online": "Online", "pic": "wdzzbh.jpg"}, 
        {"_id": 6, "lastReceivedTime": "2015-11-03 17:34:11", "latlng": "36.0879814,120.3799618", "name_cn": "ccc", "name_en": "qdwdstore", "name_english": "Wanda Qingdao (Shopping Mall)", "online": "Online", "pic": "qdwdstore.jpg"}, 
     ]
    return jsonify(data)


@app.route('/factory/getPageList/<projId>', methods=['GET'])
def factoryGetPageList(projId):
    data = [
        {"_id": "5562c5ed94022d0decfe67cc", "isHide": False, "layerList": ["55layerd94022d0decfe67c0", "55layerd94022d0decfe67c1", "55layerd94022d0decfe67c2", "55layerd94022d0decfe67c4"], "text": "test1", "type": "PainterScreen"}, 
        {"_id": "5565563994022d0c643faa52", "isHide": False, "layerList": ["55layerd94022d0decfe67c3"], "parent": "5565563994022d0c643faa4e", "text": "KPI", "type": "PainterScreen"}, 
        #以上两个为 PainterScreen
        
        {"_id": "5565563994022d0c643faa4e", "isHide": False, "text": "KPI", "type": "DropDownList"}, 
        {"_id": "557ab5f394022d0c94f3c4cd", "isHide": False, "parent": "5565563994022d0c643faa4e", "reportFolder": "123123", "reportType": "0", "text": "123123", "type": "DropDownList"}, 
        {"_id": "5565563994022d0c643faa53", "isHide": False, "parent": "557ab5f394022d0c94f3c4cd", "text": "COP", "type": "EnergyScreen"}, 
        {"_id": "557ab5f394022d0c94f3c4ca", "isHide": False, "parent": "557ab5f394022d0c94f3c4cd", "text": "123123", "type": "EnergyScreen"}, 
        {"_id": "557ab5f394022d0c94f3c4cc", "isHide": False, "parent": "5565563994022d0c643faa4e", "reportFolder": "KPIReport", "reportType": "0", "text": "123123", "type": "ReportScreen"}, 
        {"_id": "5565563994022d0c643faa4f", "isHide": False, "reportFolder": "yy", "reportType": "0", "text": "123123", "type": "DropDownList"}, 
        {"_id": "557ce79b94022d07c0bcd5da", "isHide": False, "parent": "5565563994022d0c643faa4f", "reportFolder": "123123", "reportType": "0", "text": "123123", "type": "EnergyScreen"}, 
        {"_id": "557ce79b94022d07c0bcd5db", "isHide": False, "parent": "5565563994022d0c643faa4f", "reportFolder": "123123", "reportType": "0", "text": "123123", "type": "EnergyScreen"}, 
        {"_id": "55c1da2e94022d02d044e20a", "isHide": False, "parent": "5565563994022d0c643faa4f", "reportFolder": "123123", "reportType": "0", "text": "123123", "type": "DropDownList"}, 
        {"_id": "55c1da2e94022d02d044e20b", "isHide": False, "parent": "55c1da2e94022d02d044e20a", "reportFolder": "CostReport", "reportType": "0", "text": "123123", "type": "ReportScreen"}, 
        {"_id": "55c1da2e94022d02d044e20c", "isHide": False, "parent": "55c1da2e94022d02d044e20a", "reportFolder": "MonthPatternReport", "reportType": "1", "text": "123123", "type": "ReportScreen"}, 
        {"_id": "557ab5f394022d0c94f3c4c9", "isHide": False, "text": "123123", "type": "DropDownList"}, 
        {"_id": "5562c5ee94022d0decfe67ce", "isHide": False, "parent": "557ab5f394022d0c94f3c4c9", "text": "123123", "type": "EnergyScreen"}, 
        {"_id": "55ae44e494022d01e8bc0252", "isHide": False, "parent": "557ab5f394022d0c94f3c4c9", "reportFolder": "123123", "reportType": "0", "text": "123123", "type": "DropDownList"}, 
        {"_id": "557ab5f394022d0c94f3c4cf", "isHide": False, "parent": "55ae44e494022d01e8bc0252", "text": "123123", "type": "EnergyScreen"}, 
        {"_id": "55ae44e494022d01e8bc024f", "isHide": False, "parent": "55ae44e494022d01e8bc0252", "text": "123123", "type": "EnergyScreen"}, 
        {"_id": "55ae44e494022d01e8bc0250", "isHide": False, "parent": "55ae44e494022d01e8bc0252", "text": "123123", "type": "EnergyScreen"}, 
        {"_id": "55ae44e494022d01e8bc0251", "isHide": False, "parent": "557ab5f394022d0c94f3c4c9", "reportFolder": "123123", "reportType": "0", "text": "123123", "type": "DropDownList"}, 
        {"_id": "55c1dba694022d02d044e3e1", "isHide": False, "parent": "55ae44e494022d01e8bc0251", "reportFolder": "DailyReport", "reportType": "0", "text": "123123", "type": "ReportScreen"}, 
        {"_id": "55c1dba694022d02d044e3e2", "isHide": False, "parent": "55ae44e494022d01e8bc0251", "reportFolder": "RunReport", "reportType": "0", "text": "123123", "type": "ReportScreen"}, 
        {"_id": "557e2f5394022d07c0bcd5de", "isHide": False, "text": "334234", "type": "AnalysisScreen"}, 
        {"_id": "557eaf0094022d0f5831ac7c", "isHide": True, "text": "234234", "type": "DropDownList"}, 
        {"_id": "55b7319494022d08a8f432d7", "isHide": True, "parent": "557eaf0094022d0f5831ac7c", "text": "123123", "type": "DiagnosisScreen"}, 
        {"_id": "55b7319494022d08a8f432d8", "isHide": True, "parent": "557eaf0094022d0f5831ac7c", "reportFolder": "DiagnosisReport", "reportType": "1", "text": "123123", "type": "ReportScreen"}, 
        {"_id": "5565563994022d0c643faa50", "isHide": True, "parent": "5565563994022d0c643faa4e", "reportFolder": "KPIReport", "reportType": "0", "text": "123123", "type": "ReportScreen"}, 
        {"_id": "557ce79b94022d07c0bcd5d9", "isHide": True, "parent": "5565563994022d0c643faa4f", "reportFolder": "123123", "reportType": "0", "text": "123123", "type": "EnergyScreen"}, 
        {"_id": "557fd62094022d0f70a0ddb5", "isHide": True, "parent": "5565563994022d0c643faa4f", "reportFolder": "CostReport", "reportType": "0", "text": "123123", "type": "ReportScreen"}, 
        {"_id": "557fd62094022d0f70a0ddb6", "isHide": True, "parent": "5565563994022d0c643faa4f", "reportFolder": "123123", "reportType": "0", "text": "123123", "type": "EnergyScreen"}, 
        {"_id": "557ab5f394022d0c94f3c4ce", "isHide": True, "parent": "557ab5f394022d0c94f3c4c9", "text": "123123", "type": "EnergyScreen"}]
    return jsonify(data)


@app.route('/factory/getPageDetail/<projId>', methods=['GET'])
def factoryGetPageDetail(projId):
    

    data = {
        "layers": [{
                "_id": "55layerd94022d0decfe67c0",
                #"pageId": "5562c5ed94022d0decfe67cc", #无需返回
                "type": "html", #"html", "canvas", "bg", "3d"
                "isHide": False,
                "list": ["55widget94022d0decfe67c0", "55widget94022d0decfe67c1", "55widget94022d0decfe67c2", "55widget94022d0decfe67c3"], #widget ids
                "option": { }
            },
            {
                "_id": "55layerd94022d0decfe67c1",
                #"pageId": "5562c5ed94022d0decfe67cc",
                "type": "canvas",
                "isHide": False,
                "list": [], #widget ids
                "option": { }
            },
            {
                "_id": "55layerd94022d0decfe67c2",
                #"pageId": "5562c5ed94022d0decfe67cc",
                "type": "canvas",
                "isHide": True,
                "list": [], #widget ids
                "option": { }
            },
            {
                "_id": "55layerd94022d0decfe67c3",
                #"pageId": "5562c5ed94022d0decfe67cc",
                "type": "canvas",
                "isHide": False,
                "list": [], #widget ids
                "option": { }
            },
            {
                "_id": "55layerd94022d0decfe67c4",
                #"pageId": "5562c5ed94022d0decfe67cc",
                "type": "bg",
                "isHide": False,
                "list": [], #widget ids
                "option": { 
                    "type": "html", # "color" "html" "image"
                    "display": "stretched", # "tiled" "stretched" "centered"
                    "option": "<div style='width: 100%; height: 100%; background-color: green;'>"   
                }
            },],
        "widgets": [
            #layer html
            {
                "_id": "55widget94022d0decfe67c0",
                "layerId": "55layerd94022d0decfe67c0",
                "type": "ButtonHtml", #用时前面加 "ModelWeb"
                "x": "1", #html控件 坐标单位为%
                "y": "1",
                "w": "60", #单位px
                "h": "20",
                "option": { 
                    "class": "btnStyleTemplate01",
                    "style": "color: #333; padding: 2px;" #css 高级选项, 覆盖"class"
                }
            },
            {
                "_id": "55widget94022d0decfe67c1",
                "layerId": "55layerd94022d0decfe67c0",
                "type": "TextHtml",
                "x": "1",
                "y": "30",
                "w": "100",
                "h": "200",
                "option": { 
                    "class": "textStyleTemplate01",
                    "style": "color: #333; padding: 2px;" #css 高级选项, 覆盖"class"    
                }
            },
            {
                "_id": "55widget94022d0decfe67c2",
                "layerId": "55layerd94022d0decfe67c0",
                "type": "HtmlContainer",
                "x": "20",
                "y": "1",
                "w": "300",
                "h": "300",
                "option": { 
                    "content": "<div style='width: 100%; height: 50%; background-color: darkred;'><%55bf521c1c9547073463af8e%></div>",
                    "idDs": ["55bf521c1c9547073463af8e"],    #方便查找、方便全文替换
                }
            },
            {
                "_id": "55widget94022d0decfe67c3",
                "layerId": "55layerd94022d0decfe67c0",
                "type": "ScreenContainer",
                "x": "50",
                "y": "1",
                "w": "500",
                "h": "500",
                "option": {
                    "_id" : "55ae44e494022d01e8bc0250"    #菜单Id
                }
            },


            #layer canvas 1
            {
                "_id": "55widget94022d0decfe67c4",
                "layerId": "55layerd94022d0decfe67c1",
                "type": "Image",
                "x": "60",   #canvas 单位px
                "y": "60",
                "w": "60",
                "h": "60",
                "option": {
                   
                }
            },
            {
                "_id": "55widget94022d0decfe67c4",
                "layerId": "55layerd94022d0decfe67c1",
                "type": "Image",
                "x": "120",
                "y": "120",
                "w": "60",
                "h": "60",
                "option": {
                   
                }
            },

            #layer canvas 1
            {
                "_id": "55widget94022d0decfe67c5",
                "layerId": "55layerd94022d0decfe67c2",
                "type": "Pipeline",
                "x": "180",
                "y": "180",
                "w": "60",
                "h": "60",
                "option": { 
                
                }
            }
        ],

        "dictImages": {
            
        }
    },
    #TODO
    return jsonify(data)


@app.route('/factory/historyShot/save', methods=['POST'])
def factoryHistoryShotSave():
    {
        "pageId": "",
        "userId": "",
        "time": "",
        "name": "",
        "content": { }
    }

    #TODO
    return jsonify({"_id": "historyShotSave333332d8"})


@app.route('/factory/historyShot/getDetail/<historyShotid>', methods=['GET'])
def factoryHistoryShotGetDetail(historyShotid):
    data = [{
            "_id": "",
            "pageId": "",
            "userId": "",
            "time": "",
            "name": "",
            "content": { }
        }]

    #TODO
    return jsonify(data)


@app.route('/factory/save', methods=['POST'])
def factorySave():
    #TODO
    return
