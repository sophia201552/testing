"""
Routes and views for the flask application.
"""

from beopWeb import app
from beopWeb.BEOPDataAccess import *
from flask import request, url_for, redirect, render_template, json
from datetime import datetime, timedelta
import time
import subprocess
from beopWeb.BEOPMongoDataAccess import BEOPMongoDataAccess

@app.route('/spring/getPlant', methods=['POST'])
def springGetPlant(projectId):
    data = {
        'points': ['aaa', 'bbb', 'ccc']
        
        }
    return json.dumps(data, ensure_ascii=False)

#mango add web designer api
@app.route('/spring/get/<menuId>', methods=['GET'])
def springGetMenu(menuId):
    return json.dumps(BEOPMongoDataAccess.getInstance().springGetMenu(menuId), ensure_ascii=False)

@app.route('/spring/saveLayout', methods=['POST'])
def saveSpringLayout():
    data = request.get_json()
    assert(isinstance(data, dict))
    BEOPMongoDataAccess.getInstance().saveSpringLayout(data)
    return json.dumps('success')

#@app.route('/spring/modal/update/<menuId>', methods=['POST'])
#def springModalUpdate(menuId, json=None):
#    if json == None:
#        json = request.get_json()
#        assert(isinstance(json, dict))
#    return BEOPMongoDataAccess.getInstance().springModalUpdate(menuId, json)

#@app.route('/spring/layout/update/<menuId>', methods=['POST'])
#def springLayoutUpdate(menuId, json=None):
#    if json == None:
#       json = request.get_json()
#       assert(isinstance(json, dict))
#    return BEOPMongoDataAccess.getInstance().springLayoutUpdate(menuId, json)