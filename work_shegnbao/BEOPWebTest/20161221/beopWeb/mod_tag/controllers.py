from flask import jsonify, request
import logging
from bson import ObjectId

from beopWeb.mod_tag import bp_tag
from beopWeb.AuthManager import AuthManager
from beopWeb.mod_tag.pointTag import pointTag
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_tag.Constants import KeyWordType


@bp_tag.route('/syncCloudPointToThingTree/<int:projId>')
def sync_cloudPoint_to_thingTree(projId):
    '''
    David 20160818
    :param projId: int()
    :return: status 1 Ok 0 error 2 some error
    '''
    error = None
    try:
        res = pointTag.sync_cloud_point_to_thingTree(projId)
        if not res:
            error = 'Sync Failed'
    except Exception as e:
        print('sync_cloudPoint_to_thingTree error:' + e.__str__())
        logging.error(e.__str__())
        return Utils.beop_response_error(msg=e.__str__())
    if not error:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error(msg='None Data')


# @bp_tag.route('/ThingsTree/update', methods=['POST'])
# def update_thingsTree():
#     '''
#     David 20160818
#     David 20161215 Drop use /tag/groupTree/create
#     '''
#     rt = {'status': 0, 'message': None, 'id': []}
#     post_data = request.get_json()
#     try:
#         if post_data:
#             projId = post_data.get('projId')
#             data = post_data.get('data')
#             res = pointTag.set_thingsTree(projId, data)
#             if res:
#                 rt.update({'status': 1, 'id': res})
#             else:
#                 rt.update({'message': 'update error'})
#         else:
#             rt.update({'message': 'Invalid parameter'})
#     except Exception as e:
#         print('update_groupThing error:' + e.__str__())
#         logging.error(e.__str__())
#         rt.update({'status': 0, 'message': e.__str__()})
#     return jsonify(rt)


@bp_tag.route('/groupTree/create', methods=['POST'])
def create_groupTree():
    '''
    David 20160818
    groupData = {'_id': ObjectId(), 'name': 'New001', 'prt': ObjectId() or None,
                 'type': 'group', 'rule': []}
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            name = post_data.get('name')
            prt = post_data.get('Prt')
            rule = post_data.get('rule')
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('create_groupTree error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/groupTree/set', methods=['POST'])
def set_groupTree():
    '''
    David 20161215
    post_data = {'groupId': '58524b55ae440a50741fd4df', 'modif': {'name': }}
    '''
    data = {'_id': '585237abae440a50741fd4dd', 'name': 'New001',
            'prt': '58524abcae440a50741fd4de', 'rule': [], 'type': 'group',
            'tag': {'tag001': {'name': 'tag001', 'id': '58524b55ae440a50741fd4df',
                               'icon': None, 'attrP': []}}}
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            groupId = post_data.get('groupId')
            modif = post_data.get('modif')
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('set_groupTree error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(data=data)
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/groupTree/matchThings', methods=['POST'])
def match_things_by_groupRule():
    '''
    David 20161215
    '''
    data = {'ThingsList': [{'_id': '58539d13ae440a1fb42cd40a', 'name': 'Things001', 'type': 'thing'},
                           {'_id': '58539dbbae440a1fb42cd40b', 'name': 'Things002', 'type': 'thing'}],
            'limit': 500, 'skip': 0, 'count': 2}
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            rule = post_data.get('rule')
            prt = post_data.get('Prt')
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('match_things_by_groupRule error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(data=data)
    else:
        return Utils.beop_response_error(msg=error)


# @bp_tag.route('/ThingsTree/rename', methods=['POST'])
# def rename_thingsTree():
#     '''
#     David 20160922
#     重名校验
#     :return:
#     '''
#     rt = {'status': 0, 'message': None, 'name': None}
#     post_data = request.get_json()
#     try:
#         if post_data:
#             projId = post_data.get('projId')
#             name_new = post_data.get('name_new')
#             thingsId = post_data.get('thingsId')
#             name = pointTag.rename_thingsTree(projId, thingsId, name_new)
#             if name:
#                 rt.update({'status': 1, 'name': name})
#             else:
#                 rt.update({'status': 0, 'name': 'rename faild'})
#         else:
#             rt.update({'message': 'Invalid parameter'})
#     except Exception as e:
#         print('rename_thingsTree error:' + e.__str__())
#         logging.error(e.__str__())
#         rt.update({'status': 0, 'message': e.__str__()})
#     return jsonify(rt)


# @bp_tag.route('/ThingsTree/create', methods=['POST'])
# def create_thingsTree():
#     '''
#     David 20160922
#     重名校验
#     :return:
#     '''
#     rt = {'status': 0, 'message': None, 'id': None}
#     post_data = request.get_json()
#     try:
#         if post_data:
#             projId = post_data.get('projId')
#             userId = post_data.get('userId', AuthManager.get_userId())
#             thingsId = pointTag.create_new_things(projId, post_data, userId)
#             if thingsId:
#                 rt.update({'status': 1, 'id': thingsId})
#             else:
#                 rt.update({'status': 0, 'message': 'create thingsTree faild'})
#         else:
#             rt.update({'message': 'Invalid parameter'})
#     except Exception as e:
#         print('create_thingsTree error:' + e.__str__())
#         logging.error(e.__str__())
#         rt.update({'status': 0, 'message': e.__str__()})
#     return jsonify(rt)


@bp_tag.route('/setTag', methods=['POST'])
def set_tag():
    '''
    David 20160818
    :return: status 1 Ok  0 error 2 some error
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            thingsList = post_data.get('thingsIds')
            tag = post_data.get('tagId')
            user_id = post_data.get('userId', AuthManager.get_userId())
            res = pointTag.set_tag(projId, thingsList, tag, user_id)
            if not res:
                error = 'Set tag failed'
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('set_tag error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/setTagAttrP', methods=['POST'])
def set_TagAttribute():
    '''
    David 20161216
    post_data = {'projId': 72, 'attrP': [{'tag001': [{}, {}]}]
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            attrP = post_data.get('attrP')
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('set_TagAttribute error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/delTag', methods=['POST'])
def del_tag_from_thing_or_group():
    '''
    David 20161216
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            Id = post_data.get('Id')
            tagName = post_data.get('tag')
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('del_tag_from_thing_or_group error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/moveThings', methods=['POST'])
def move_things():
    '''
    David 20160818
    David 20161215 变更：只支持点的移动
    重名校验
    :return: status 1 ok 0 error
    '''
    post_data = request.get_json()
    error = None
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
                    if not res:
                        error = 'move failed'
                else:
                    error = 'This name already exists'
            else:
                error = 'Invalid parameter'
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('move_things error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/getGlobalDictionary/<lang>')
def get_globa_dictionary(lang):
    '''
    David 20160818
    :param lang:
    :return:
    '''
    error = None
    try:
        if isinstance(lang, str):
            res = pointTag.get_tag_globa_dictionary(lang)
            if not res:
                error = 'No Data'
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('get_globa_dictionary error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(data=res)
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/getThingTree', methods=['POST'])
def get_thing_tree():
    '''
    David 20160818
    :return:
    tree = [
        {
            '_id': 'dasfadfasd', 'name': '根节点001', 'tag': ['screw', 'chiller', 'dual'],
            'children': [{'_id': 'afsdfsafa', 'name': '子节点001', 'tag': ['screw', 'chiller', 'dual'],
                          'kewwords': []}]
        },
        {
            '_id': 'dghegwf', 'name': '根节点002', 'tag': ['screw', 'chiller', 'dual'],
            'children': [{'_id': 'gesdfsfaad', 'name': '子节点002', 'tag': ['screw', 'chiller', 'dual'],
                          'kewwords': []}]
        }
    ]
    '''
    if request.get_json(silent=True):
        post_data = request.get_json()
    else:
        post_data = request.form
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            Prt = post_data.get('Prt') if post_data.get('Prt') else ''
            limit = post_data.get('limit')
            skip = post_data.get('skip')
            is_only_group_for_root = (post_data.get('onlyGroupForRoot') and not Prt) if post_data.get(
                'onlyGroupForRoot') else False
            res = pointTag.get_things_tree(projId, Prt, only_group=is_only_group_for_root)
            if not res:
                error = 'No Data'
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('get_thing_tree error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(data=res)
    else:
        return Utils.beop_response_error(msg=error)


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


# @bp_tag.route('/ThingsTree/copy', methods=['POST'])
# def copy_thingsTree():
#     '''
#     David 20160922
#     重名校验
#     :return:
#     '''
#     rt = {'status': 0, 'message': None}
#     post_data = request.get_json()
#     try:
#         if post_data:
#             projId = post_data.get('projId')
#             userId = post_data.get('userId', AuthManager.get_userId())
#             Prt = post_data.get('Prt')
#             arrfolder = post_data.get('arrfolder')
#             if ObjectId.is_valid(Prt):
#                 Prt = ObjectId(Prt)
#             else:
#                 Prt = ''
#             arrf = []
#             for f in arrfolder:
#                 if pointTag.name_disambiguation_by_thingsId(projId, ObjectId(f.get('_id')), Prt):
#                     arrf.append(f)
#                 else:
#                     name = f.get('name') + '-副本'
#                     n = 1
#                     while not pointTag.name_disambiguation(projId, name, Prt):
#                         if name[-1] == ')' and name[-3] == '(':
#                             name = name.replace(name[-2], str(n))
#                         else:
#                             name = name + '(%s)' % str(n)
#                         n = n + 1
#                     f.update({'name': name})
#                     arrf.append(f)
#             if pointTag.copy_thingsTree(projId, userId, Prt, arrf):
#                 rt.update({'status': 1})
#             else:
#                 rt.update({'status': 0})
#         else:
#             rt.update({'status': 0, 'message': 'Invalid parameter'})
#     except Exception as e:
#         print('copy_thingsTree error:' + e.__str__())
#         logging.error(e.__str__())
#         rt.update({'status': 0, 'message': e.__str__()})
#     return jsonify(rt)


@bp_tag.route('/ThingsName/keywords/get', methods=['POST'])
def get_keywords():
    data = [
        {
            'key': 'CH',
            'type': KeyWordType.TAG,
            'count': 200
        },
        {
            'key': 'AHU',
            'type': KeyWordType.TAG,
            'count': 200
        },
        {
            'key': 'VAV',
            'type': KeyWordType.TAG,
            'count': 200
        },
        {
            'key': 'Room',
            'type': KeyWordType.TAG,
            'count': 200
        },
        {
            'key': 'Flow',
            'type': KeyWordType.TAG,
            'count': 200
        },
        {
            'key': 'Accum',
            'type': KeyWordType.TAG,
            'count': 200
        },
        {
            'key': 'Temp',
            'type': KeyWordType.TAG,
            'count': 200
        },
        {
            'key': 'Ti',
            'type': KeyWordType.TAG,
            'count': 200
        },
        {
            'key': 'FCU',
            'type': KeyWordType.TAG,
            'count': 200
        },
        {
            'key': 'A',
            'type': KeyWordType.NORMAL,
            'count': 100
        },
        {
            'key': 'B',
            'type': KeyWordType.NORMAL,
            'count': 100
        },
        {
            'key': 'C',
            'type': KeyWordType.NORMAL,
            'count': 100
        },
        {
            'key': 'D',
            'type': KeyWordType.NORMAL,
            'count': 100
        },
        {
            'key': 'E',
            'type': KeyWordType.NORMAL,
            'count': 100
        },
        {
            'key': 'H',
            'type': KeyWordType.NORMAL,
            'count': 100
        },
        {
            'key': 'Eff',
            'type': KeyWordType.NORMAL,
            'count': 100
        },
        {
            'key': 'Max',
            'type': KeyWordType.NORMAL,
            'count': 100
        },
        {
            'key': 'Sp',
            'type': KeyWordType.NORMAL,
            'count': 100
        },
        {
            'key': 'Reg',
            'type': KeyWordType.NORMAL,
            'count': 100
        },
        {
            'key': 'VF',
            'type': KeyWordType.NORMAL,
            'count': 100
        }]
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            prt = post_data.get('Prt') if post_data.get('Prt') else None
            if projId:
                rt = pointTag.get_keywords(projId, prt=prt)
            else:
                error = 'Invalid parameter'
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('get_keywords error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/getCommon', methods=['POST'])
def getCommon():
    '''
    David 20161216
    '''
    data = {'personal': [{'_id': '5856956035a2ee2868483962', 'name': 'tag001'},
                         {'_id': '5856956035a2ee2868483963', 'name': 'tag002'}],
            'public': [{'_id': '5856956035a2ee2868483962', 'name': 'tag001'},
                       {'_id': '5856956035a2ee2868483963', 'name': 'tag001'}]}
    error = None
    post_data = request.get_json()
    try:
        if post_data:
            projId = post_data.get('projId')
            prt = post_data.get('Prt')
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('getCommon error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(data=data)
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/getThingsTree/Tag')
def get_ThingsTree_Tag():
    '''
    David 20161216
    '''
    data = {'tag001': {'count': 2, 'limit': 50, 'skip': 1,
                       'thingsList': [{'_id': '5856956035a2ee2868483964', 'name': 'things001'},
                                      {'_id': '5856956035a2ee2868483965', 'name': 'things002'}]},
            'tag002': {'count': 2, 'limit': 50, 'skip': 1,
                       'thingsList': [{'_id': '5856956035a2ee2868483964', 'name': 'things001'},
                                      {'_id': '5856956035a2ee2868483965', 'name': 'things002'}]}}
    error = None
    post_data = request.get_json()
    try:
        if post_data:
            projId = post_data.get('projId')
            limit = post_data.get('limit')
            skip = post_data.get('skip')
            prt = post_data.get('Prt')
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('get_ThingsTree_Tag error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        Utils.beop_response_success(data=data)
    else:
        Utils.beop_response_error(msg=error)


@bp_tag.route('/dict/')
def get_tag_dict():
    '''
    tag分组字典
    :return:
    '''
    tag_dict = [
        {
            'groupNm': '冷机系列',
            'tags': [
                {
                    'name': 'CH',
                    'title': '冷机',
                    'icon': 'icon-shujutubiao02'
                },
                {
                    'name': 'CHW',
                    'title': '冷冻水泵',
                    'icon': 'icon-shujutubiao03'
                },
                {
                    'name': 'ABC',
                    'title': '旁通阀',
                    'icon': 'icon-shujuguanlisvg34'
                },
                {
                    'name': 'CDE',
                    'title': '板换',
                    'icon': 'icon-shujuguanlisvg81'
                },
                {
                    'name': 'CDG',
                    'title': '集水盘',
                    'icon': 'icon-shujuguanlisvg33'
                },
                {
                    'name': 'AHU',
                    'title': '空调箱',
                    'icon': 'icon-shujutubiao25'
                }

            ]
        },
        {
            'groupNm': '温度',
            'tags': [
                {
                    'name': 'PT',
                    'title': '相对温度',
                    'icon': 'icon-shujutubiao10'
                },
                {
                    'name': 'T',
                    'title': '温度',
                    'icon': 'icon-shujutubiao24'
                },
                {
                    'name': 'TT',
                    'title': '趋近温度',
                    'icon': 'icon-shujuguanlisvg31'
                },
                {
                    'name': 'LT',
                    'title': '露点温度',
                    'icon': 'icon-shujuguanlisvg52'
                },
                {
                    'name': 'GT',
                    'title': '干球温度',
                    'icon': 'icon-shujuguanlisvg54'
                },
                {
                    'name': 'WC',
                    'title': '温差',
                    'icon': 'icon-shujuguanlisvg55'
                },
                {
                    'name': 'RT',
                    'title': '溶液温度',
                    'icon': 'icon-shujuguanlisvg76'
                },
                {
                    'name': 'ST',
                    'title': '湿球温度',
                    'icon': 'icon-shujuguanlisvg801'
                }
            ]
        },
        {
            'groupNm': '热泵',
            'tags': [
                {
                    'name': 'ground',
                    'title': 'ground'
                },
                {
                    'name': 'source',
                    'title': 'source'
                },
                {
                    'name': 'heat',
                    'title': 'heat'
                },
                {
                    'name': 'pump',
                    'title': 'pump'
                },
                {
                    'name': 'condenser',
                    'title': 'condenser'
                },
                {
                    'name': 'flow',
                    'title': 'flow'
                },
                {
                    'name': 'supply',
                    'title': 'supply'
                },
                {
                    'name': 'evaporator',
                    'title': 'evaporator'
                }
            ]
        },
        {
            'groupNm': '空调箱',
            'tags': [
                {
                    'name': 'electricity',
                    'title': 'electricity'
                },
                {
                    'name': 'heating',
                    'title': 'heating'
                },
                {
                    'name': 'status',
                    'title': 'status'
                },
                {
                    'name': 'error',
                    'title': 'error',
                    'icon': 'icon-shujuguanlisvg67'
                },
                {
                    'name': 'reset',
                    'title': 'reset'
                },
                {
                    'name': 'low',
                    'title': 'low'
                },
                {
                    'name': 'temperature',
                    'title': 'temperature'
                },
                {
                    'name': 'mixed',
                    'title': 'mixed'
                }
            ]
        }
    ]
    return Utils.beop_response_success(tag_dict)


@bp_tag.route('/hot/', methods=['POST'])
def get_tag_hot():
    '''
    项目常用tag
    :return:
    '''
    rq = request.get_json()
    project_id = rq.get('projectId')
    hot = [
        {
            'name': 'T',
            'title': '温度',
            'icon': 'icon-shujutubiao24'
        },
        {
            'name': 'TT',
            'title': '趋近温度',
            'icon': 'icon-shujuguanlisvg31'
        },
        {
            'name': 'LT',
            'title': '露点温度',
            'icon': 'icon-shujuguanlisvg52'
        }, {
            'name': 'ABC',
            'title': '旁通阀',
            'icon': 'icon-shujuguanlisvg34'
        },
        {
            'name': 'CDE',
            'title': '板换',
            'icon': 'icon-shujuguanlisvg81'
        },
        {
            'name': 'CDG',
            'title': '集水盘',
            'icon': 'icon-shujuguanlisvg33'
        },
        {
            'name': 'HF',
            'title': '回风',
            'icon': 'icon-shujuguanlisvg721'
        },
        {
            'name': 'XF',
            'title': '新风',
            'icon': 'icon-shujuguanlisvg97'
        }
    ]
    return Utils.beop_response_success(hot)
