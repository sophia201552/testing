from beopWeb.mod_pointTag import bp_pointTag

import logging
from flask import jsonify, request
from bson import ObjectId

@bp_pointTag.route('/syncCloudPointToThingTree/<projId>')
def sync_cloudPoint_to_thingTree(projId):
    '''
    David 20160818
    :param projId: int()
    :return: status 1 Ok 0 error
    '''
    rt = {'status':0, 'message':None}
    try:
        pass
    except Exception as e:
        print('sync_cloudPoint_to_thingTree error:' + e.__str__())
        logging.error(e.__str__())
        rt.update({'status':0, 'message':e.__str__()})
    return jsonify(rt)

@bp_pointTag.route('/groupThing/update', methods = ['POST'])
def update_groupThing():
    '''
    David 20160818
    if request.get_json().get('_id'):
        update
    else:
        insert
    :return:
    '''
    rt = {'status':0, 'message':None, 'ids':[]}
    post_data = request.get_json()
    try:
        if post_data:
            pass
        else:
            rt.update({'message':'Invalid parameter'})
    except Exception as e:
        print('update_groupThing error:' + e.__str__())
        logging.error(e.__str__())
        rt.update({'status':0, 'message':e.__str__()})
    return jsonify({'status':0, 'message':None, 'ids':[ObjectId().__str__(), ObjectId().__str__()]})

@bp_pointTag.route('/setTag', methods = ['POST'])
def set_tag():
    '''
    David 20160818
    :return: status 1 Ok  0 error 2 some error
    '''
    rt = {'status':0, 'message':None, 'things':[]}
    post_data = request.get_json()
    try:
        if post_data:
            pass
        else:
            rt.update({'status':0, 'message':'Invalid parameter'})
    except Exception as e:
        print('set_tag error:' + e.__str__())
        logging.error(e.__str__())
        rt.update({'status':0, 'message':None, 'things':[]})
    return jsonify(rt)

@bp_pointTag.route('/moveThings', methods = ['POST'])
def move_things():
    '''
    David 20160818
    :return: status 1 ok 0 error
    '''
    rt = {'status':0, 'message':None}
    post_data = request.get_json()
    try:
        if post_data:
            pass
        else:
            rt.update({'status':0, 'message':'Invalid parameter'})
    except Exception as e:
        print('move_things error:' + e.__str__())
        logging.error(e.__str__())
    return jsonify(rt)

@bp_pointTag.route('/getGlobalDictionary/<lang>')
def get_globa_dictionary(lang):
    '''
    David 20160818
    :param lang:
    :return:
    '''
    from .pointTag import tagGlobalDictionary_Ch
    rt = {'status':0, 'message':None, 'tag':[]}
    post_data = request.get_json()
    try:
        if post_data:
            pass
        else:
            rt.update({'status':0, 'message':'Invalid parameter'})
    except Exception as e:
        print('get_globa_dictionary error:' + e.__str__())
        logging.error(e.__str__())
    return jsonify(rt.get('tag').append(tagGlobalDictionary_Ch))

@bp_pointTag.route('/getThingTree', methods = ['POST'])
def get_thing_tree():
    '''
    David 20160818
    :return:
    '''
    rt = {'status':0, 'message':None, 'thingTree':[]}
    tree = [
            {
                '_id':'dasfadfasd','name':'根节点001', 'tag':['screw', 'chiller' ,'dual'], 'arrprt':[],
                'path':'/', 'children':[{'_id':'afsdfsafa','name':'子节点001', 'tag':['screw', 'chiller' ,'dual'],
                'path':'/根节点001/', 'arrprt':['dasfadfasd']}]
            },
            {
                '_id':'dghegwf','name':'根节点002', 'tag':['screw', 'chiller' ,'dual'], 'arrprt':[],
                'path':'/', 'children':[{'_id':'gesdfsfaad','name':'子节点002', 'tag':['screw', 'chiller' ,'dual'],
                'path':'/根节点002/', 'arrprt':['dghegwf']}]
            }
    ]
    post_data = request.get_json()
    try:
        if post_data:
            pass
        else:
            rt.update({'status':0, 'message':'Invalid parameter'})
    except Exception as e:
        print('get_thing_tree error:' + e.__str__())
        logging.error(e.__str__())
    return jsonify(rt.update({'thingsTree':tree}))

@bp_pointTag.route('/search', methods = ['POST'])
def search_tag():
    '''
    David 20160818
    :return:
    '''
    rt = {'status':0, 'message':None}
    post_data = request.get_json()
    try:
        if post_data:
            pass
    except Exception as e:
        print('search_tag error:' + e.__str__())
        logging.error(e.__str__())
    return jsonify(rt)