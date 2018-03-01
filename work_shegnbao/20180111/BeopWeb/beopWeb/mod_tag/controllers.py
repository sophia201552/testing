import logging
import os

from flask import request

from flask import json

from beopWeb.mod_tag import bp_tag
from beopWeb.mod_tag.pointTag import pointTag
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_tag.fakeData import tagTree
from beopWeb.mod_tag.PointMatch import CStringMatch
from beopWeb.mod_tag.TagDict import TagDict, TagDictV2
from beopWeb.mod_tag.FormatPainter import FormatPainter
from beopWeb.mod_tag.TagV2 import Tag


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
        else:
            rt = pointTag.del_invalidGroup(projId)
            if rt:
                if not rt.raw_result.get('ok'):
                    logging.error('Delete invalidGroup error: projId ' + str(projId))
    except Exception as e:
        print('sync_cloudPoint_to_thingTree error:' + e.__str__())
        logging.error(e.__str__())
        return Utils.beop_response_error(msg=e.__str__())
    if not error:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/syncCloudPointToThingTree/V2/<int:ProjId>')
def sync_cloudPoint_to_thingTree_V2(projId):
    '''
    David
    1. 导入数据，dataSource 导入 cloudPoint
    2. 增量导入数据
    3. 删除cloudPoint多余数据
    4. 删除cloudPoint错误数据（暂时注释）
    '''
    error = None
    try:
        pass
    except Exception as e:
        print('sync_cloudPoint_to_thingTree_V2 error:' + e.__str__())
        logging.error(e.__str__())



@bp_tag.route('/groupTree/', methods=['POST'])
def get_groupTree():
    '''
    获取Tree数据
    '''

    rq = request.get_json()
    is_all = rq.get('isAll')
    tags = rq.get('tags')

    if is_all:
        ret = []

        def get_all_item(root):
            for r_item in root:
                if r_item.get('children'):
                    get_all_item(r_item.get('children'))
                if tags:
                    if r_item.get('tags', []):
                        for tag in r_item.get('tags', []):
                            if tag.get('name') in tags:
                                ret.append(r_item)
                else:
                    ret.append(r_item)

        get_all_item(tagTree)
        return Utils.beop_response_success(ret)
    parent_id = rq.get('Prt')
    if not parent_id:
        return Utils.beop_response_success(tagTree)

    def query_by_prt_id(tree_items):
        for item in tree_items:
            if item.get('_id') == parent_id:
                return item.get('children', [])
            if item.get('children'):
                ret = query_by_prt_id(item.get('children'))
                if ret:
                    return ret

    return Utils.beop_response_success(query_by_prt_id(tagTree))


@bp_tag.route('/groupTree/save', methods=['POST'])
def create_groupTree():
    '''
    David 20160818
    创建目录
    David 20161227 modif 保存目录
    post_data = {'projId': <int>,          # （必填）项目Id
                 'groupId': <str>,         # （可选）编辑目录的Id
                 'Prt': <str>,             # （可选）上级目录的Id
                 'rules': <str>,           # （可选）目录匹配点的规则
                 'folderName': <str>,      # （可选）目录名称
                 'hasSubFolder': <boole>,  # （可选）是否有子目录
                 'subFolderPrefix': <str>  # （可选）子目录命名规则
                 }
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            groupId = post_data.get('groupId')
            prt = post_data.get('Prt')  # prt如果这个默认为'', 下面edit会把这一项目放到最外层
            rules = post_data.get('rules') if post_data.get('rules') else []
            folderName = post_data.get('folderName')
            hasSubFolder = post_data.get('hasSubFolder')
            subFolderPrefix = post_data.get('subFolderPrefix') if post_data.get('subFolderPrefix') else None
            if groupId:
                error = pointTag.edit_new_group(projId, groupId, prt=prt, rules=rules,
                                                folderName=folderName, subFolderPrefix=subFolderPrefix)
                gId = groupId
            else:
                if not prt:
                    prt = ''
                error, gId = pointTag.create_new_group(projId, prt, folderName, rules, hasSubFolder, subFolderPrefix)
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('create_groupTree error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(gId)
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/groupTree/createByKeywords', methods=['POST'])
def create_group_by_keywords():
    '''
    David 20170109
    更具关键字创建目录
    post_data = {
        'keywords': <list>,     # （必填）选取的关键字的二维数组
        'Prt': <str>,          # （选填）上级目录的Id
        'parent': <str>         # （选填）上级目录的Id
        'projId': <int>,       # （必填）项目Id
        'name': <list>          # （必填）创建目录的名称列表
    }
    '''
    post_data = request.get_json()
    error = None
    groupId_list = []
    try:
        if post_data:
            keywords = post_data.get('keywords')
            prt = post_data.get('Prt')
            parent = post_data.get('parent')
            projId = post_data.get('projId')
            names = post_data.get('name')
            if len(names) == len(keywords):
                for n in range(len(names)):
                    groupId = pointTag.create_group_by_keywords(projId, prt, keywords[n], names[n], parent)
                    if groupId:
                        groupId_list.append(groupId)
            else:
                error = 'Invalid parameter'
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('create_group_by_keywords error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(groupId_list)
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/groupTree/getSubFolderName', methods=['POST'])
def get_SubFolderName():
    '''
    David 20161229
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            prt = post_data.get('Prt') if post_data.get('Prt') else None
            rules = post_data.get('rules') if post_data.get('rules') else []
            subFolderPrefix = post_data.get('subFolderPrefix') if post_data.get('subFolderPrefix') else None
            res = pointTag.get_subFolderName(projId, prt, rules, subFolderPrefix)
            if not res:
                error = 'ERROR'
    except Exception as e:
        print('get_SubFolderName error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(res)
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/groupTree/matchThings', methods=['POST'])
def match_things_by_groupRule():
    '''
    David 20161215
    更具规则匹配点
    post_data = {
        'projId': <int>,          # （必填）项目Id
        'Prt': <str>,             # （必填）上级目录的Id
        'limit': <int>,           # （选填）每页返回的数量
        'skip': <int>,            # （选填）页数
        'rules': <str>,           # （必填）匹配点的规则
    }
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            prt = post_data.get('Prt')
            limit = post_data.get('limit') if post_data.get('limit') else None
            skip = post_data.get('skip') if post_data.get('skip') else None
            rules = post_data.get('rules')
            rt = pointTag.match_things_by_groupRule(projId, rules, prt, limit, skip)
            not_match_count = pointTag.get_not_match_count(projId, rules, prt)
            if rt:
                rt['notMatchCount'] = not_match_count
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('match_things_by_groupRule error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/groupTree/notMatchThings', methods=['POST'])
def not_match_things_by_groupRule():
    '''
    返回不匹配规则的点
    post_data = {
        'projId': <int>,          # （必填）项目Id
        'Prt': <str>,             # （必填）上级目录的Id
        'limit': <int>,           # （选填）每页返回的数量
        'skip': <int>,            # （选填）页数
        'rules': <str>,           # （必填）匹配点的规则
    }
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            prt = post_data.get('Prt')
            limit = post_data.get('limit') if post_data.get('limit') else None
            skip = post_data.get('skip') if post_data.get('skip') else None
            rules = post_data.get('rules')
            rt = pointTag.not_match_things_by_groupRule(projId, rules, prt, limit, skip)
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('match_things_by_groupRule error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/setTag', methods=['POST'])
def set_tag():
    '''
    David 20160818
    :return: status 1 Ok  0 error 2 some error
    设置Tag
    post_data = {
        'projId': <int>,        # （必填）项目Id
        'arrTag': <list>,       # （必填）设备Tag列表
        'inheritable': <boole>  # （选填）可以继承
    }
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            arrTag = post_data.get('arrTag')
            inheritable = post_data.get('inheritable')
            res = pointTag.set_tag(projId, arrTag, inheritable)
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
    设置设备属性
    post_data = {'projId': <int>,       # （必填）项目Id
                 'attrP': <dict>,       # （必填）设备属性列表
                 'Id': <str>},          # （必填）设备Id
                 'inheritable': <boole> # （选填）可以继承
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            attrP = post_data.get('attrP')
            Id = post_data.get('Id')
            inheritable = post_data.get('inheritable')
            rt = pointTag.set_tagAttrP(projId, attrP, Id, inheritable)
            if not rt:
                error = 'Set tag attribute failed'
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


# @bp_tag.route('/delTag', methods=['POST'])
# def del_tag_from_thing_or_group():
#     '''
#     David 20161216
#     删除Tag
#     post_data = {
#         'projId': <int>,        # （必填）项目Id
#         'Ids': <list>,          # （必填）设备Id列表
#         'tag': <str>,           # （必填）tag名称
#         'inheritable': <boole>  # （选填）可以继承
#     }
#     '''
#     post_data = request.get_json()
#     error = None
#     try:
#         if post_data:
#             projId = post_data.get('projId')
#             Ids = post_data.get('Ids')
#             tagName = post_data.get('tag')
#             inheritable = post_data.get('inheritable')
#             res = pointTag.del_tag(projId, Ids, tagName, inheritable)
#             if not res:
#                 error = 'Delete Failed'
#         else:
#             error = 'Invalid parameter'
#     except Exception as e:
#         print('del_tag_from_thing_or_group error:' + e.__str__())
#         logging.error(e.__str__())
#         error = e.__str__()
#     if not error:
#         return Utils.beop_response_success()
#     else:
#         return Utils.beop_response_error(msg=error)

@bp_tag.route('/delTag', methods=['POST'])
def del_tag_from_thing_or_group_v2():
    '''
    rush 20171024
    删除Tag
    post_data = {
        'projId': <int>,        # （必填）项目Id
        'Ids': <list>,          # （必填）设备Id列表
        'tag': <str>,           # （必填）tag名称
        'inheritable': <boole>  # （选填）可以继承
    }
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            Ids = post_data.get('Ids')
            tagName = post_data.get('tag')
            inheritable = post_data.get('inheritable')
            pointTag.del_tag_v2(projId, Ids, tagName, inheritable)
        else:
            error = 'Invalid parameter'
    except Exception as e:
        logging.error('del_tag_from_thing_or_group error:' + e.__str__())
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
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            thingsId = post_data.get('thingsId')
            groupId = post_data.get('groupId')
            groupName = post_data.get('groupName')
            prt = post_data.get('Prt') if post_data.get('Prt') else ''
            if isinstance(thingsId, str):
                thingsId = [thingsId]
            if isinstance(thingsId, list):
                error = pointTag.move_things(projId, thingsId, prt)
            if groupId and groupName:
                if isinstance(groupId, str):
                    groupId = [groupId]
                if isinstance(groupName, str):
                    groupName = [groupName]
                if isinstance(groupId, list) and isinstance(groupName, list):
                    error = pointTag.move_groups(projId, groupId, groupName, prt)
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


@bp_tag.route('/getThingTree', methods=['POST'])
def get_thing_tree():
    '''
    David 20160818
    :return:
    '''
    projId = None
    try:
        post_data = request.get_json()
        if not post_data:
            raise Exception()
        projId = post_data.get('projId')
        prt = post_data.get('Prt', None)
        isOnlyGroup = post_data.get('isOnlyGroup')
        # for Peter
        isAll = post_data.get('isAll') if post_data.get('isAll') else None
    except Exception:
        if request.form:
            projId = request.form.get('projId')
            prt = request.form.get('Prt', None)
            isOnlyGroup = request.form.get('isOnlyGroup') == 'true'
            # for Peter
            isAll = request.form.get('isAll') if request.form.get('isAll') else None
    if not projId:
        return Utils.beop_response_error(msg='invalid parameters.')
    error = None
    try:
        res = pointTag.get_thingsTree(projId, prt, isOnlyGroup, isAll)
        if not res:
            error = 'No Data'
    except Exception as e:
        print('get_thing_tree error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(data=res)
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/thingTree/detail', methods=['POST'])
def get_thingTree_detail():
    '''
    David 20170103
    '''
    post_data = request.get_json()
    error = None
    res = None
    try:
        if post_data:
            projId = post_data.get('projId')
            prt = post_data.get('Prt') if post_data.get('Prt') else ''
            limit = post_data.get('limit') if post_data.get('limit') else None
            skip = post_data.get('skip') if post_data.get('skip') else None
            searchText = post_data.get('searchText') if post_data.get('searchText') else None
            hasTag = post_data.get('hasTag')    # 1: 已标记   2：未标记
            isAll = post_data.get('isAll')
            if post_data.get('tags'):
                res = pointTag.get_ThingsTree_Tag(projId, prt, post_data.get('tags'), searchText, limit, skip)
            else:
                res = pointTag.get_thingTree_detail_new(projId, prt, searchText, hasTag, limit, skip, isAll)
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('get_thingTree_detail error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(res)
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/search', methods=['POST'])
def search_tag():
    '''
    David 20170110
    搜索
    '''
    error = None
    post_data = request.get_json()
    try:
        if post_data:
            projId = post_data.get('projId')
            name = post_data.get('name')
            keywords = post_data.get('keywords')
            prt = post_data.get('Prt')
            tag = post_data.get('tag')
            hasTag = post_data.get('hasTag')    # 1: 已标记   2：未标记
            limit = post_data.get('limit')
            skip = post_data.get('skip')
            rt = pointTag.search(projId, name=name, keywords=keywords, prt=prt, tag=tag,
                                 limit=limit, skip=skip, hasTag=hasTag)
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('search_tag error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/del', methods=['POST'])
def del_things():
    '''
    David
    删除目录接口
    post_data = {
        'projId': <int>,        #（必填）项目Id
        'groupId': <str>,       #（必填）需要删除的目录Id
    }
    '''
    error = None
    post_data = request.get_json()
    try:
        if post_data:
            projId = post_data.get('projId')
            groupId = post_data.get('groupId')
            pointTag.del_group_new(projId, groupId)
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('del_things error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/ThingsName/keywords/get', methods=['POST'])
def get_keywords():
    '''
    David
    获取things关键字
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            prt = post_data.get('Prt') if post_data.get('Prt') else ''
            limit = post_data.get('limit')
            if projId:
                rt = pointTag.get_keywords(projId, prt=prt, limit=limit)
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


@bp_tag.route('/keywords/regenerate/<int:projId>', methods=['GET'])
def regenerate_the_keywords(projId):
    '''
    David 20161223
    重新生成关键字
    '''
    error = None
    try:
        pass
    except Exception as e:
        print('regenerate_the_keywords error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/getThings/keywords', methods=['POST'])
def get_things_by_keywords():
    '''
    David 20161222
    根据给出的关键字，获得things列表
    post_data = {
        'projId': <int>,        # （必填）项目Id
        'keywords': <list>,     # （必填）关键字列表
        'Prt': <str>,           # （选填）上级目录Id
        'limit': <int>,         # （选填）每页返回数量
        'skip': <int>,          # （选填）当前页数
    }
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            keywords = post_data.get('keywords')
            prt = post_data.get('Prt') if post_data.get('Prt') else None
            limit = post_data.get('limit') if post_data.get('limit') else None
            skip = post_data.get('skip') if limit else None
            rt = pointTag.get_thingsList_by_keywords(projId, keywords, prt, limit, skip)
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('get_things_by_keywords error:' + e.__str__())
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
    获取系统推荐Tag 接口
    '''
    error = None
    post_data = request.get_json()
    try:
        if post_data:
            projId = post_data.get('projId')
            data = pointTag.get_common(projId)
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('getCommon error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(data)
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/getThingsTree/Tag', methods=['POST'])
def get_ThingsTree_Tag():
    '''
    David 20161216
    '''
    error = None
    post_data = request.get_json()
    try:
        if post_data:
            projId = post_data.get('projId')
            limit = post_data.get('limit') if post_data.get('limit') else None
            skip = post_data.get('skip') if post_data.get('skip') else None
            prt = post_data.get('Prt') if post_data.get('Prt') else ''
            tags = post_data.get('tags')
            rt = pointTag.get_ThingsTree_Tag(projId, prt, tags, '', limit, skip)
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('get_ThingsTree_Tag error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(msg=error)


'''
@bp_tag.route('/dict/')
def get_tag_dict():
    storage = TagDict.get_list()
    tag_group = []
    tag_map = {}

    for item in storage:
        tag_type = item.get('type')
        if not tag_type:
            tag_type = 'other'
        if not tag_map.get(tag_type):
            tag_map[tag_type] = []
        tag_map[tag_type].append(item)
    for tag_group_name in tag_map:
        tag_group.append({
            'groupNm': tag_group_name,
            'tags': tag_map.get(tag_group_name)
        })
    return Utils.beop_response_success(tag_group)
'''

@bp_tag.route('/dict', methods=['GET'])
@bp_tag.route('/dict/<name>', methods=['GET'])
def tag_dict_get(name=None):
    '''
    获取tag信息
    tagdict = {'_id': ObjectId(),
               'name': <str>,
               'en': <str>,
               'zh': <str>,
               'en_alias': <str>,
               'type': <str>,
               'attrInputs': [],
               'attrPoints': []}
    '''
    error = None
    tagdict = TagDictV2()

    tag_list = tagdict.tag_get(name)

    if tag_list == []:
        error = 'Name not found'
        return Utils.beop_response_error(msg=error)

    tag_group = []
    tag_map = {}

    for item in tag_list:
        tag_type = item.get('type')
        if not tag_type:
            tag_type = 'other'
        if not tag_map.get(tag_type):
            tag_map[tag_type] = []
        tag_map[tag_type].append(item)
    for tag_group_name in tag_map:
        tag_group.append({
            'groupNm': tag_group_name,
            'tags': tag_map.get(tag_group_name)
        })
    return Utils.beop_response_success(tag_group)

@bp_tag.route('/dict', methods=['POST'])
def tag_dict_build():
    '''
    提交tag信息
    postdata = {'name': <str>,
                'en': <str>,
                'zh': <str>,
                'en_alias': <str>,
                'type': <str>,
                'attrInputs': [],
                'attrPoints': []}
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            tagdict = TagDictV2()
            tagdict.tag_post(post_data)
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('tag_dict_create error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error(msg=error)

@bp_tag.route('/dict/<name>', methods=['DELETE'])
def tag_dict_delete(name):
    error = None
    is_deleted = False
    try:
        tagdict = TagDictV2()
        is_deleted = tagdict.tag_delete(name)
        if not is_deleted:
            error = 'Nothing to delete'
    except Exception as e:
        print('tag_dict_delete error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error(msg=error)

@bp_tag.route('/syncProgress/', methods=['POST'])
def get_sync_progress():
    '''
    同步进度返回
    :return:
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            currentProgress = {"progress": pointTag.get_count_from_cloutPoint(projId),
                               "pointCount": pointTag.get_count_from_dataSource(projId),
                               "hasTasg": pointTag.judge_tags_from_cloutPoint(projId)}
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('get_sync_progress error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(currentProgress)
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/pointAutoMatch/', methods=['POST'])
def point_auto_match():
    '''
    自动分析Tag
    :return:
    '''
    rq = request.get_json()
    equipment = rq.get('equipment')
    point_list = rq.get('pointList')

    CSMatch = CStringMatch(ch_list=point_list)
    cwd = os.path.dirname(os.path.realpath(__file__))
    CSMatch.ReadEquipmentStandardPoint(equipment, cwd + '/etag.xlsx')
    result = CSMatch.Match(equipment)
    ret = {}
    if result:
        for item in result:
            point = item[0][0]
            ret[point] = {
                'synonym': item[0][1],
                'score': item[0][2],
                'tags': item[1]
            }
    return Utils.beop_response_success(ret)


# @bp_tag.route('/V2.0/pointAutoMatch', methods=['POST'])
# def V2_point_auto_match():
#     '''
#     自动分析Tag
#     '''
#     post_data = request.get_json()
#     rt = {}
#     try:
#         Retain1 = post_data.get('Retain1', '')
#         point_list = post_data.get('pointList', [])
#         Alist, BList, Clist = CGA.getInstance().MatchStringList(point_list,Retain1)
#         for index, i in enumerate(Alist):
#             point = point_list[index]
#             rt[point] = {'synonym': BList[index],
#                          'score': i,
#                          'tags': Clist[index]}
#     except Exception as e:
#         print('V2_point_auto_match error:' + e.__str__())
#         logging.error(e.__str__())
#         return Utils.beop_response_error(msg=e.__str__())
#     return Utils.beop_response_success(rt)


@bp_tag.route('/formatPainter', methods=['POST'])
def format_painter():
    '''
    David 20170117
    格式刷
    post_data = {
        'projId': <int>,        # （必填）项目Id
        'sample': <str>,        # （必填）样本目录的Id
        'target': <list>         # （必填）目标目录的Id
    }
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            sample_groupId = post_data.get('sample')
            target_groupId = post_data.get('target')
            if not isinstance(target_groupId, list):
                target_groupId = [target_groupId]
            rt = pointTag.format_painter_v2(projId, sample_groupId, target_groupId)
            if not rt:
                error = 'ERROR'
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('format_painter error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/groupTree/createByThingsList', methods=['POST'])
def create_group_by_thingsList():
    '''
    David 20170118
    更具点列表创建目录
    post_data = {
        'projId': <int>,            # （必填）项目Id
        'Prt': <str>,               # （选填）上级菜单Id
        'ThingsList': <list>,       # （必填）选中的点列表
        'FolderName': <str>         # （必填）文件夹名称
    }
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            prt = post_data.get('Prt') if post_data.get('Prt') else ''
            thingsList = post_data.get('ThingsList')
            folderName = post_data.get('FolderName')
            error, gId = pointTag.create_new_group(projId, prt, folderName, [], 2, None)
            if not error and gId:
                pointTag.move_things(projId, thingsList, gId)
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('create_group_by_thingsList error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(gId)
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/equipmentIcons')
def equipment_icons():
    import configparser

    config = configparser.ConfigParser()
    locale_file_path = os.path.join(os.path.dirname(__file__), 'tag.ini')
    try:
        with open(locale_file_path, encoding='utf-8') as config_file:
            config.read_file(config_file)
        return Utils.beop_response_success(dict(config.items('icon')))
    except Exception as e:
        logging.error(e)
        return Utils.beop_response_error(str(e))


@bp_tag.route('/equipmentInputs/<equip>')
def equipment_inputs(equip):
    file_path = os.path.join(os.path.dirname(__file__), 'equipments', '%s.json' % equip.lower())
    try:
        equip_json = json.load(open(file_path, "r", encoding='utf8'))
        return Utils.beop_response_success(equip_json.get('attrInputs'))
    except Exception as e:
        return Utils.beop_response_error(msg=e.__str__())


@bp_tag.route('/project/state/<int:projId>')
def get_project_state(projId):
    error = None
    try:
        rt = pointTag.get_proj_state(projId)
    except Exception as e:
        print('get_project_state error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if error:
        return Utils.beop_response_error(msg=error)
    else:
        return Utils.beop_response_success(rt)


@bp_tag.route('/get_offLinePoint/equipment', methods=['POST'])
def get_offLinePoint_by_equipment():
    '''
    David 20170330
    post_data {}
    '''
    error = None
    post_data = request.get_json()
    try:
        if post_data:
            projId = post_data.get('projId')
            equ_tag = post_data.get('tag')
            attrP = post_data.get('attrP')
            filterRatio = float(post_data.get('filterRatio'))
            offlineDeadband = int(post_data.get('offlineDeadband'))
            rt = pointTag.get_offLinePoint_by_equipment(projId, attrP, equ_tag, offlineDeadband, filterRatio)
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('get_offLinePoint_by_equipment error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if error:
        return Utils.beop_response_error(msg=error)
    else:
        return Utils.beop_response_success(rt)


@bp_tag.route('/search/tagAnalysis', methods=['POST'])
def search_tagAnalysis():
    '''
    David 20170417
    更具Tag和关键字进行搜索
    post_data = {
        'projId': int        # 项目ID
        'tag': list          # tag
        'searchName': list   # 点名
        'isTree': 1 / 0      #1： 树状结构  0：列表结构
    }
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            tag = post_data.get('tag', [])
            searchName = post_data.get('searchName', [])
            isTree = post_data.get('isTree')
            limit = post_data.get('limit', 0)
            skip = post_data.get('skip', 1)
            rt = pointTag.search_tagAnalysis(projId, tag, searchName, isTree, limit, skip)
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('search_tagAnalysis error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if error:
        return Utils.beop_response_error(msg=error)
    else:
        return Utils.beop_response_success(rt)

@bp_tag.route('/getThingTreeNew', methods=['POST'])
def get_thing_tree_new():
    '''
    Bill 20170511
    :return:
    '''
    projId = None
    try:
        post_data = request.get_json()
        if not post_data:
            raise Exception()
        projId = post_data.get('projId')
        prt = post_data.get('Prt') if post_data.get('Prt') else ''
        isOnlyGroup = post_data.get('isOnlyGroup')
        # for Peter
        isAll = post_data.get('isAll') if post_data.get('isAll') else None
    except:
        if request.form:
            projId = request.form.get('projId')
            prt = request.form.get('Prt') if request.form.get('Prt') else None
            isOnlyGroup = request.form.get('isOnlyGroup') == 'true'
            # for Peter
            isAll = request.form.get('isAll') if request.form.get('isAll') else None
    if not projId:
        return Utils.beop_response_error(msg='invalid parameters.')
    error = None
    try:
        res = pointTag.get_thingsTreeNew(projId, prt, isOnlyGroup, isAll)
        if not res:
            error = 'No Data'
    except Exception as e:
        print('get_thing_tree error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(data=res)
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/getPointNameByTag',methods = ['POST'])
def get_pointName_by_specialTag():
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            tagList = post_data.get('tagList', [])
            atr = post_data.get('atr', {})
            rt = pointTag.get_pointName_by_specialTag(projId, tagList, atr)
            if not rt:
                error = 'No Data'
        else:
            error = 'invalid parameters'
    except Exception as e:
        print('get_pointName_by_specialTag error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(msg = error)

@bp_tag.route('/getPointAttrByName',methods = ['POST'])
def get_pointAttr_by_pointName():
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            pointList = post_data.get('pointList')
            rt = pointTag.get_pointAttr_by_pointName(projId,pointList)
            if not rt:
                error = 'No Data'
        else:
            error = 'invalid parameters'
    except Exception as e:
        print('get_pointAttr_by_pointName error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(msg = error)


@bp_tag.route('/get_tags/ByGroups', methods=['POST'])
def get_tag_by_groups():
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            groupId = post_data.get('groupId')
            isALL = post_data.get('isAll')
            rt = pointTag.get_tag_by_groups(projId, groupId, isALL)
            if not rt:
                error = 'No Data'
        else:
            error = 'invalid parameters'
    except Exception as e:
        print('get_tag_by_groups error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/del_tags/ByGroups', methods=['POST'])
def del_tag_by_group():
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            groupId = post_data.get('groupId')
            tags = post_data.get('tags', [])
            rt = pointTag.del_tags_by_groups(projId, groupId, tags)
            if not rt:
                error = 'Failed'
    except Exception as e:
        print('del_tag_by_group error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/equipment/sync/<projId>')
def sync_equipment(projId):
    error = None
    try:
        pointTag.sync_equipment_for_520(projId)
    except Exception as e:
        print('sync_equipment error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if error:
        return Utils.beop_response_error(msg=error)
    else:
        return Utils.beop_response_success()


@bp_tag.route('/delInvalidGroup/<int:projId>')
def del_invalidGroup(projId):
    error = None
    try:
        rt = pointTag.del_invalidGroup(projId)
        if rt:
            if not rt.raw_result.get('ok'):
                error = 'ERROR'
        else:
            error = 'ERROR'
    except Exception as e:
        print('del_invalidGroup error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if error:
        return Utils.beop_response_error(msg=error)
    else:
        return Utils.beop_response_success()


@bp_tag.route('/test', methods=['POST'])
def test():
    post_data = request.get_json()
    pointName = post_data.get('pointName')
    rt = pointTag.analysis_keywords(pointName)
    return Utils.beop_response_success(rt)

@bp_tag.route('/dataTransfer', methods=['POST'])
def tag_transfer():
    '''
    rush 20170919
    projId int
    lang(zh, eng) str
    '''
    error = None
    try:
        post_data = request.get_json()
        projId = post_data.get('projId')
        lang = post_data.get('lang')
        equipment_list = pointTag.get_equipment()
        tag_tree = pointTag.import_tag(equipment_list, projId, lang)
        pointTag.export_tag(tag_tree, lang)
        pointTag.export_tag_mongo(projId, tag_tree)
    except Exception as e:
        print('tag_transfer error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if error:
        return Utils.beop_response_error(msg=error)
    else:
        return Utils.beop_response_success()

@bp_tag.route('/energyConfig/<int:projId>', methods=['POST'])
def energy_config(projId):
    device_list = pointTag.get_device_energy(projId)
    pointTag.energy_config(device_list)
    return Utils.beop_response_success()

@bp_tag.route('/tempConfig/<int:projId>', methods=['POST'])
def temperature_config(projId):
    device_list = pointTag.get_device_temperature(projId)
    pointTag.temperature_config(device_list)
    return Utils.beop_response_success()

@bp_tag.route('/energyConfig/<int:projId>', methods=['GET'])
@bp_tag.route('/energyConfig/<int:projId>/<int:energyType>', methods=['GET'])
def energy_config_get(projId,energyType = 0):
    rt = pointTag.energy_config_get(projId,energyType)
    return Utils.beop_response_success(rt)

@bp_tag.route('/tempConfig/<int:projId>', methods=['GET'])
def temperature_config_get(projId):
    rt = pointTag.temperature_config_get(projId)
    return Utils.beop_response_success(rt)

@bp_tag.route('/pointAutoMatchV2', methods=['POST'])
def point_auto_match_v2():
    '''
    自动分析Tag, 并打上
    post_data = [{'name': tag_name,
                  'id': ObjectId}]
    '''
    post_data = request.get_json()
    error = None
    if post_data:
        pointTag.point_auto_match_v2(post_data)
    else:
        error = 'Invalid parameter'
    return Utils.beop_response_success()

@bp_tag.route('/pointAutoMatchV3', methods=['POST'])
def point_auto_match_v3():
    '''
    rush 20170822
    自动分析Tag, 并打上
    post_data = {"group": group_id}
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            group_id = post_data.get('group')
            pointTag.auto_tag_v3(group_id)
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

@bp_tag.route('/delTagV2', methods=['POST'])
def del_tag_v2():
    '''
    Rush 20170821
    删除Tag
    post_data = {
        "projId": <int>, # 弃用
        "Ids": ["595c9dbf833c971da75662df", "595c9dbf833c971da75662de"],
        "tag": "a_tag_name"
        "inheritable": true # 是否继承
    }
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            ids = post_data.get('Ids')
            tag = post_data.get('tag')
            inheritable = post_data.get('inheritable')
            pointTag.del_tag_v2(ids, tag, inheritable)
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('del_tag error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error(msg=error)

@bp_tag.route('/setTagAttrPV2', methods=['POST'])
def set_TagAttribute_v2():
    '''
    rush 20170823
    设置设备属性
    post_data = {
        "projId": <project id>, # 弃用
        "attrP":{ # 属性字典
            "floor":{
                "Number":"1"}},
        "Id":"591d362a833c9712a2d9534a", # 节点id
        "inheritable":true # 是否继承
    }
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            attr_dict = post_data.get('attrP')
            a_id = post_data.get('Id')
            inheritable = post_data.get('inheritable')
            pointTag.set_tagAttrP_v2(attr_dict, a_id, inheritable)
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

@bp_tag.route('/moveThingsV2', methods=['POST'])
def move_things_v2():
    '''
    David 20160818
    David 20161215 变更：只支持点的移动
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            thingsId = post_data.get('thingsId')
            groupId = post_data.get('groupId')
            groupName = post_data.get('groupName')
            prt = post_data.get('Prt') if post_data.get('Prt') else ''
            if isinstance(thingsId, str):
                thingsId = [thingsId]
            if isinstance(thingsId, list):
                error = pointTag.move_things(projId, thingsId, prt)
            if groupId and groupName:
                if isinstance(groupId, str):
                    groupId = [groupId]
                if isinstance(groupName, str):
                    groupName = [groupName]
                if isinstance(groupId, list) and isinstance(groupName, list):
                    error = pointTag.move_groups(projId, groupId, groupName, prt)
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

@bp_tag.route('/getAll', methods=['POST'])
def get_all_list():
    '''
    David 20170828
    return: 返回所有
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            prt = post_data.get('Prt', '')
            searchText = post_data.get('searchText')
            limit = post_data.get('limit')
            skip = post_data.get('skip')
            rt = pointTag.get_all_list(projId, prt, limit, skip, searchText)
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('get_all_list error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/getEquipmentInfoByprojId', methods=['POST'])
def get_equipment_info_by_projId():
    '''
    David 20170907
    return:
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId_list = post_data.get('projId')
            if isinstance(projId_list, int):
                projId_list = [projId_list]
            elif isinstance(projId_list, str):
                projId_list = [int(projId_list)]
            elif isinstance(projId_list, list):
                pass
            else:
                error = 'Invalid parameter'
            rt = pointTag.get_equipment_info_by_projId(projId_list)
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('get_equipment_info_by_projId error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(msg=error)

@bp_tag.route('/getHasTagNum', methods=['POST'])
def get_hasTag_num():
    '''
    David 20170908
    return:
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId_list = post_data.get('projId')
            if isinstance(projId_list, int):
                projId_list = [projId_list]
            elif isinstance(projId_list, str):
                projId_list = [int(projId_list)]
            elif isinstance(projId_list, list):
                pass
            else:
                error = 'Invalid parameter'
            rt = pointTag.get_hasTag_num(projId_list)
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('get_hasTag_num error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/setTagAttrP/batch', methods=['POST'])
def set_tagAttrP_batch():
    '''
    David 20170912
    post_data: {
        'projId': projId,
        'tag': 'Chiller',
        'inheritable': True,
        'modif_list': [{'Id': "599bfdc7421aa9c42bf35ddb",
                        'attribute': {
                            '设备编号': '001'
                        }}]
    }
    return:
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            ok_list = []
            fail_list = []
            projId = post_data.get('projId')
            tag = post_data.get('tag')
            modif_list = post_data.get('modif_list')
            inheritable = post_data.get('inheritable')
            for mm in modif_list:
                res = pointTag.set_tagAttrP_batch(projId, tag, mm, inheritable)
                if res:
                    ok_list.append(mm.get('Id'))
                else:
                    fail_list.append(mm.get('Id'))
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('set_tagAttrP_batch error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success({'okList': ok_list, 'failList': fail_list})
    else:
        return Utils.beop_response_error(msg=error)


@bp_tag.route('/getDetails/editAttribute', methods=['POST'])
def get_details_by_editAttribute():
    '''
    David 20170913
    post_data = {
        "projId": 49,
        "Prt": ''
    }
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            prt = post_data.get('Prt', '')
            tag = post_data.get('tag')
            limit = post_data.get('limit')
            skip = post_data.get('skip')
            searchText = post_data.get('searchText')
            is_all = post_data.get('isAll')
            rt = pointTag.get_details_by_editAttribute(projId, prt, limit, skip, tag, searchText, is_all)
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('get_details_by_editAttribute error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(msg=error)

@bp_tag.route('/getTags/editAttribute', methods=['POST'])
def get_tags_by_editAttribute():
    '''
    David 20170913
    post_data = {
        "projId": 72,
        "Prt": ""
    }
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            prt = post_data.get('Prt')
            is_all = post_data.get('isAll')
            rt = pointTag.get_tags_by_editAttribute(projId, prt, is_all)
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('get_tags_by_editAttribute error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(rt)
    else:
        return Utils.beop_response_error(msg=error)

@bp_tag.route('/formatPainterV2', methods=['POST'])
def format_painter_v2():
    '''
    rush 20171128
    格式刷
    post_data = {
        'projId': <int>,        # （必填）项目Id
        'sample': <list>,        # （必填）样本目录的Id
        'target': <list>         # （必填）目标目录的Id
    }
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            sample_groupId = post_data.get('sample')
            target_groupId = post_data.get('target')
            if not isinstance(sample_groupId, list):
                sample_groupId = [sample_groupId]
            if not isinstance(target_groupId, list):
                target_groupId = [target_groupId]
            fp = FormatPainter(projId, sample_groupId, target_groupId)
            fp.format_painter()
        else:
            error = 'Invalid parameter'
    except Exception as e:
        logging.error('format_painter error:' + e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error(msg=error)

@bp_tag.route('/setTagV2', methods=['POST'])
@Utils.response_wrapper
def set_tag_v2():
    post_data = request.get_json()
    t = Tag()
    data = t.set_tag(**post_data)
    return data

@bp_tag.route('/pointAutoMatchV4', methods=['POST'])
@Utils.response_wrapper
def point_auto_match_v4():
    '''
    自动分析Tag
    post data
    {"group": "5a7d2eb8421aa954d1340398", "projectId": 49}
    :return:
    '''
    r = request.get_json()
    group = r.get('group')
    project_id = r.get('projectId')
    pointTag.auto_tag_v4(group, project_id)

@bp_tag.route('/pointAutoGroup/<int:project_id>', methods=['POST'])
@Utils.response_wrapper
def point_auto_group(project_id):
    '''
    自动group Tag
    :return:
    '''
    pointTag.point_auto_group(project_id)