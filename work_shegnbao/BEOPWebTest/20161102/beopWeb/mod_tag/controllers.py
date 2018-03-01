__author__ = 'win7'

from flask import jsonify

from beopWeb.mod_tag import bp_tag
from beopWeb.AuthManager import AuthManager
from beopWeb.MongoConnManager import *
from beopWeb.mod_tag.pointTag import pointTag


@bp_tag.route('/syncCloudPointToThingTree/<int:projId>')
def sync_cloudPoint_to_thingTree(projId):
    '''
    David 20160818
    :param projId: int()
    :return: status 1 Ok 0 error 2 some error
    '''
    rt = {'status': 0, 'message': None}
    try:
        res = pointTag.sync_cloud_point_to_thingTree(projId)
        if res:
            rt.update({'status': 1, 'message': None})
        else:
            rt.update({'status': 0, 'message': 'None Data'})
    except Exception as e:
        print('sync_cloudPoint_to_thingTree error:' + e.__str__())
        logging.error(e.__str__())
        rt.update({'status': 0, 'message': e.__str__()})
    return jsonify(rt)


@bp_tag.route('/ThingsTree/update', methods=['POST'])
def update_thingsTree():
    '''
    David 20160818
    if request.get_json().get('_id'):
        update
    else:
        insert
    :return:
    '''
    rt = {'status': 0, 'message': None, 'id': []}
    post_data = request.get_json()
    try:
        if post_data:
            projId = post_data.get('projId')
            data = post_data.get('data')
            res = pointTag.set_thingsTree(projId, data)
            if res:
                rt.update({'status': 1, 'id': res})
            else:
                rt.update({'message': 'update error'})
        else:
            rt.update({'message': 'Invalid parameter'})
    except Exception as e:
        print('update_groupThing error:' + e.__str__())
        logging.error(e.__str__())
        rt.update({'status': 0, 'message': e.__str__()})
    return jsonify(rt)

@bp_tag.route('/ThingsTree/rename', methods = ['POST'])
def rename_thingsTree():
    '''
    David 20160922
    重名校验
    :return:
    '''
    rt = {'status':0, 'message':None, 'name':None}
    post_data = request.get_json()
    try:
        if post_data:
            projId = post_data.get('projId')
            name_new = post_data.get('name_new')
            thingsId = post_data.get('thingsId')
            name = pointTag.rename_thingsTree(projId, thingsId, name_new)
            if name:
                rt.update({'status':1, 'name':name})
            else:
                rt.update({'status':0, 'name':'rename faild'})
        else:
            rt.update({'message': 'Invalid parameter'})
    except Exception as e:
        print('rename_thingsTree error:' + e.__str__())
        logging.error(e.__str__())
        rt.update({'status':0, 'message':e.__str__()})
    return jsonify(rt)

@bp_tag.route('/ThingsTree/create', methods=['POST'])
def create_thingsTree():
    '''
    David 20160922
    重名校验
    :return:
    '''
    rt = {'status':0, 'message':None, 'id':None}
    post_data = request.get_json()
    try:
        if post_data:
            projId = post_data.get('projId')
            userId = post_data.get('userId', AuthManager.get_userId())
            thingsId = pointTag.create_new_things(projId, post_data, userId)
            if thingsId:
                rt.update({'status':1, 'id':thingsId})
            else:
                rt.update({'status':0, 'message':'create thingsTree faild'})
        else:
            rt.update({'message': 'Invalid parameter'})
    except Exception as e:
        print('create_thingsTree error:' + e.__str__())
        logging.error(e.__str__())
        rt.update({'status':0, 'message':e.__str__()})
    return jsonify(rt)

@bp_tag.route('/setTag', methods=['POST'])
def set_tag():
    '''
    David 20160818
    :return: status 1 Ok  0 error 2 some error
    '''
    rt = {'status': 0, 'message': None}
    post_data = request.get_json()
    try:
        if post_data:
            projId = post_data.get('projId')
            thingsList = post_data.get('thingsIds')
            tag = post_data.get('tagId')
            user_id = post_data.get('userId', AuthManager.get_userId())
            res = pointTag.set_tag(projId, thingsList, tag, user_id)
            if res:
                rt.update({'status': 1})
        else:
            rt.update({'status': 0, 'message': 'Invalid parameter'})
    except Exception as e:
        print('set_tag error:' + e.__str__())
        logging.error(e.__str__())
        rt.update({'status': 0, 'message': e.__str__()})
    return jsonify(rt)


@bp_tag.route('/moveThings', methods=['POST'])
def move_things():
    '''
    David 20160818
    重名校验
    :return: status 1 ok 0 error
    '''
    rt = {'status': 0, 'message': None}
    post_data = request.get_json()
    try:
        if post_data:
            projId = post_data.get('projId')
            thingsId = post_data.get('thingsId')
            Prt = post_data.get('Prt')
            if isinstance(thingsId, str):
                thingsId = [thingsId]
            if isinstance(thingsId, list):
                t_list = []
                for i in thingsId:
                    if ObjectId.is_valid(i):
                        if pointTag.name_disambiguation_by_thingsId(projId, ObjectId(i), Prt):
                            t_list.append(i)
                if t_list:
                    res = pointTag.move_things(projId, t_list, Prt)
                    if res:
                        rt.update({'status': 1})
                    else:
                        rt.update({'status': 0, 'message': 'move failed'})
                else:
                    rt.update({'status':0, 'message':'This name already exists'})
            else:
                rt.update({'status': 0, 'message': 'Invalid parameter'})
        else:
            rt.update({'status': 0, 'message': 'Invalid parameter'})
    except Exception as e:
        print('move_things error:' + e.__str__())
        logging.error(e.__str__())
    return jsonify(rt)


@bp_tag.route('/getGlobalDictionary/<lang>')
def get_globa_dictionary(lang):
    '''
    David 20160818
    :param lang:
    :return:
    '''
    rt = {'status': 0, 'message': None, 'tag': []}
    try:
        if isinstance(lang, str):
            res = pointTag.get_tag_globa_dictionary(lang)
            if res:
                rt.update({'status': 1, 'tag': res})
            else:
                rt.update({'status': 0, 'message': 'No Data'})
        else:
            rt.update({'status': 0, 'message': 'Invalid parameter'})
    except Exception as e:
        print('get_globa_dictionary error:' + e.__str__())
        logging.error(e.__str__())
    return jsonify(rt)


@bp_tag.route('/getThingTree', methods=['POST'])
def get_thing_tree():
    '''
    David 20160818
    :return:
    tree = [
        {
            '_id': 'dasfadfasd', 'name': '根节点001', 'tag': ['screw', 'chiller', 'dual'], 'arrprt': [],
            'path': '/', 'children': [{'_id': 'afsdfsafa', 'name': '子节点001', 'tag': ['screw', 'chiller', 'dual'],
                                       'path': '/根节点001/', 'arrprt': ['dasfadfasd']}]
        },
        {
            '_id': 'dghegwf', 'name': '根节点002', 'tag': ['screw', 'chiller', 'dual'], 'arrprt': [],
            'path': '/', 'children': [{'_id': 'gesdfsfaad', 'name': '子节点002', 'tag': ['screw', 'chiller', 'dual'],
                                       'path': '/根节点002/', 'arrprt': ['dghegwf']}]
        }
    ]
    '''
    rt = {'status': 0, 'message': None, 'thingTree': []}

    if request.get_json(silent=True):
        post_data = request.get_json()
    else:
        post_data = request.form
    try:
        if post_data:
            projId = post_data.get('projId')
            Prt = post_data.get('Prt') if post_data.get('Prt') else ''
            is_only_group_for_root = (post_data.get('onlyGroupForRoot') and not Prt) if post_data.get(
                'onlyGroupForRoot') else False
            res = pointTag.get_things_tree(projId, Prt, only_group=is_only_group_for_root)
            if res:
                rt.update({'status': 1, 'message': None, 'thingTree': res})
            else:
                rt.update({'status': 1, 'message': 'No Data'})
        else:
            rt.update({'status': 0, 'message': 'Invalid parameter'})
    except Exception as e:
        print('get_thing_tree error:' + e.__str__())
        logging.error(e.__str__())
    return jsonify(rt)


@bp_tag.route('/search', methods=['POST'])
def search_tag():
    '''
    David 20160818
    :return:
    '''
    rt = {'status': 0, 'message': None, 'thingsList': []}
    post_data = request.get_json()
    try:
        if post_data:
            projId = post_data.get('projId')
            searchName = post_data.get('searchName')
            path = post_data.get('path')
            lang = post_data.get('lang') if post_data.get('lang') else 'zh-CN'
            isRecursive = post_data.get('isRecursive')
            Prt = post_data.get('Prt')
            if isRecursive:
                res = pointTag.fuzzy_search(projId, searchName, path, lang)
            else:
                res = pointTag.point_search(projId, searchName, Prt)
            if res:
                rt.update({'status': 1, 'thingsList': res})
            else:
                rt.update({'status': 1, 'message': 'No Data'})
        else:
            rt.update({'status': 0, 'message': 'Invalid parameter'})
    except Exception as e:
        print('search_tag error:' + e.__str__())
        logging.error(e.__str__())
        rt.update({'status': 0, 'message': 'No Data'})
    return jsonify(rt)


@bp_tag.route('/del', methods=['POST'])
def del_things():
    '''
    David 2060906
    :return:
    '''
    rt = {'status': 0, 'message': None, 'Ids': []}
    post_data = request.get_json()
    try:
        if post_data:
            projId = post_data.get('projId')
            thingsIds = post_data.get('thingsIds') if post_data.get('thingsIds') else []
            for thingsId in thingsIds:
                res = pointTag.del_thingsTree(projId, thingsId)
                if res:
                    rt.get('Ids').append(thingsId)
            if len(rt.get('Ids')) > 0:
                rt.update({'status': 1})
            else:
                rt.update({'status': 0, 'message': 'No things is deleted'})
        else:
            rt.update({'status': 0, 'message': 'Invalid parameter'})
    except Exception as e:
        print('del_things error:' + e.__str__())
        logging.error(e.__str__())
    return jsonify(rt)

@bp_tag.route('/ThingsTree/copy', methods = ['POST'])
def copy_thingsTree():
    '''
    David 20160922
    重名校验
    :return:
    '''
    rt = {'status':0, 'message':None}
    post_data = request.get_json()
    try:
        if post_data:
            projId = post_data.get('projId')
            userId = post_data.get('userId', AuthManager.get_userId())
            Prt = post_data.get('Prt')
            arrfolder = post_data.get('arrfolder')
            if ObjectId.is_valid(Prt):
                Prt = ObjectId(Prt)
            else:
                Prt = ''
            arrf = []
            for f in arrfolder:
                if pointTag.name_disambiguation_by_thingsId(projId, ObjectId(f.get('_id')), Prt):
                    arrf.append(f)
                else:
                    name = f.get('name') + '-副本'
                    n = 1
                    while not pointTag.name_disambiguation(projId, name, Prt):
                        if name[-1] == ')' and name[-3] == '(':
                            name = name.replace(name[-2], str(n))
                        else:
                            name = name + '(%s)'%str(n)
                        n = n + 1
                    f.update({'name':name})
                    arrf.append(f)
            if pointTag.copy_thingsTree(projId, userId, Prt, arrf):
                rt.update({'status':1})
            else:
                rt.update({'status':0})
        else:
            rt.update({'status': 0, 'message': 'Invalid parameter'})
    except Exception as e:
        print('copy_thingsTree error:' + e.__str__())
        logging.error(e.__str__())
        rt.update({'status':0, 'message':e.__str__()})
    return jsonify(rt)