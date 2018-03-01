from flask import request, json, jsonify, render_template
from beopWeb import app
from beopWeb.mod_energy import bp_energy
from datetime import datetime
from beopWeb.MongoConnManager import *
from bson import ObjectId
g_table_energy_management_config = 'EnergyManagement_Config'

@app.route('/energy')
def energy_management():
    """Renders the home page."""
    token = None
    project_id = request.args.get('projectId')
    if project_id is None:
        return '缺少项目ID'
    try:
        project_id = int(project_id)
    except ValueError as error:
        return '项目ID不合法'

    if app.config.get('URL_CHECK'):
        # 拿到 token
        token = request.cookies.get('token')

    if token:
        return render_template('indexEnergyManagement.html', token=token, projId=project_id, title='BeOP')
    else:
        return render_template('indexEnergyManagement.html', projId=project_id, title='BeOP')


@bp_energy.route('/getConfigInfo', methods=['POST'])
def get_energy_config():
    rt = {'success':False}
    cursor = None
    data = request.get_json()
    projectId = data.get('projectId')
    entityId = data.get('entityId')
    arrEntityId = []
    if not isinstance(entityId,list):
        arrEntityId = [entityId]
    else:
        arrEntityId = entityId
    arrEntityId = [int(item) for item in arrEntityId]
    try:
        cursor = MongoConnManager.getConfigConn().mdbBb[g_table_energy_management_config].find({'projectId': int(projectId),'entityId':{'$in':arrEntityId}})
        if cursor:
            ll = list(cursor)
            rt = {'success':True,'data':[]}
            for entity in arrEntityId:
                entity_store = {}
                entity_store['entityId'] = entity
                rt['data'].append(entity_store)
                for item in ll:
                    if (item.get('entityId') == entity):
                        entity_store.update({
                            '_id':item.get('_id').__str__(),
                            'projectId':item.get('projectId'),
                            'cost':item.get('cost'),
                            'power':item.get('power'),
                            'energy':item.get('energy'),
                            'detail':item.get('detail',[]),
                            'children':item.get('children',[])
                        })
                        break
    except Exception as e:
        print('getEnergyConfig error:' + e.__str__())
        logging.error('getEnergyConfig error:' + e.__str__())
    finally:
        if cursor:
            cursor = None
    return json.dumps(rt)


@bp_energy.route('/updateConfigInfo', methods=['POST'])
def update_energy_config():
    rt = {'success':False}
    cursor = None
    data = request.get_json()
    data.update({
        'entityId':int(data.get('entityId')),
        'projectId':int(data.get('projectId'))
        })
    try:
        cursor = MongoConnManager.getConfigConn().mdbBb[g_table_energy_management_config].update({'entityId': data.get('entityId'),'projectId':data.get('projectId')}, {'$set': data}, True)
        if cursor:
            rt = {'success':True,'id':cursor.get('upserted').__str__()}
    except Exception as e:
        print('getEnergyConfig error:' + e.__str__())
        logging.error('getEnergyConfig error:' + e.__str__())
    finally:
        if cursor:
            cursor = None
    return json.dumps(rt)