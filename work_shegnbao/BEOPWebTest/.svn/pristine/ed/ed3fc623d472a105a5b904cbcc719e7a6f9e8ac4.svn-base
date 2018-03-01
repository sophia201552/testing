from flask import request, json, jsonify

import logging, uuid

from beopWeb import app
from beopWeb.mod_asset import bp_asset
from beopWeb.MongoConnManager import *
from beopWeb.BEOPDataAccess import  *
from beopWeb.mod_admin.Upload import *



@app.route('/asset')
def asset():
    """Renders the home page."""
    return render_template('indexAsset.html',
                           title='BEOP Energy Leader')



@bp_asset.route('/getThingInfoList/<groupId>', methods=['GET'])
def getThingInfoList(groupId):
    rt = []
    if groupId:
        rt = MongoConnManager.getConfigConn().getThingInfoList(groupId)
    #return json.dumps(rt, ensure_ascii = False)
    return jsonify(data = rt)



@bp_asset.route('/getThingDetail/<tId>', methods=['GET'])
def getThingDetail(tId):
    rt = MongoConnManager.getConfigConn().getThingDetail(tId)
    #return json.dumps(rt, ensure_ascii = False)
    return jsonify(data = rt)

@bp_asset.route('/getModel/<modelId>', methods=['GET'])
def getModel(modelId):
    rt = MongoConnManager.getConfigConn().getModel(modelId)
    #return json.dumps(rt, ensure_ascii = False)
    return jsonify(data = rt)

@bp_asset.route('/getMaintainList', methods=['POST'])
def getMaintainList():
    rt = []
    data = request.get_json()
    if data:
        arrThingId = data.get('arrTId')
        if isinstance(arrThingId, list):
            mList = MongoConnManager.getConfigConn().getMaintainList(arrThingId)
            for item in mList:
                maintaininfo = BEOPDataAccess.getInstance().get_maintain_from_transaction(item.get('transactionId'))
                item.update(maintaininfo)
                rt.append(item)
    #return json.dumps(rt, ensure_ascii = False)
    return jsonify(data = rt)


@bp_asset.route('/getDiagnosisList', methods=['POST'])
def getDiagnosisList():
    requestdata = request.get_json()
    arrThingId = requestdata.get('arrTId')

    data = [{
        "_id": "111151137ddcf32fbc302221",
        "tId": "111151137ddcf32fbc302111",
        "grade": 0,
        "time": "2015-02-01 15:00",
        "name": "外壳破损",
        "status": 2
    },{
        "_id": "111151137ddcf32fbc302221",
        "tId": "111151137ddcf32fbc302111",
        "grade": 0,
        "time": "2015-02-01 15:00",
        "name": "外壳破损",
        "status": 2
    },{
        "_id": "111151137ddcf32fbc302221",
        "tId": "111151137ddcf32fbc302111",
        "grade": 0,
        "time": "2015-02-01 15:00",
        "name": "外壳破损",
        "status": 2
    },]
    return jsonify({"data": data})

#@bp_asset.route('/getRelativeFileList', methods=['GET'])
#def getMaintainInfo():
#    data = {}
#    return jsonify({"data": data})

@bp_asset.route('/saveThing', methods=['POST'])
def saveThing():
    rt = False
    data = request.get_json()
    if data:
        rt = MongoConnManager.getConfigConn().saveThing(data)
    #return json.dumps(rt, ensure_ascii = False)
    return jsonify(data = rt)

@bp_asset.route('/saveModel', methods=['POST'])
def saveModel():
    rt = False
    data = request.get_json()
    if data:
        rt = MongoConnManager.getConfigConn().saveModel(data)
    #return json.dumps(rt, ensure_ascii = False)
    return jsonify(data = rt)

@bp_asset.route('/getAllModel', methods=['GET'])
def getAllModel():
    rt = MongoConnManager.getConfigConn().getModel()
    return  jsonify(data = rt)

@bp_asset.route('/uploadfile', methods = ['POST'])
def uploadefile():
    rt = []
    files = request.files.getlist("file[]")
    tid = request.form['_id']
    try:
        for file in files:
            path = 'assets/equipment/'
            file_name_split = file.filename.rsplit('.', 1)
            file_name_split[0] = tid
            file.filename = '.'.join(file_name_split)
            rv = Upload.upload_file_to_oss(path, file.filename, file)
            if rv.status == 200:
                rt.append(path + file.filename)
    except Exception as e:
        print('uploadefile error:' + e.__str__())
        logging.error('uploadefile error:' + e.__str__())
    return jsonify(data = rt)