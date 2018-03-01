import logging
import os

from flask import request

from beopWeb.mod_tag import bp_tag
from beopWeb.AuthManager import AuthManager
from beopWeb.mod_tag.pointTag import pointTag
from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_tag.fakeData import tagTree
from beopWeb.mod_tag.PointMatch import CStringMatch
from beopWeb.mod_tag.TagDict import TagDict


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
            projId = post_data.get('projId')
            names = post_data.get('name')
            if len(names) == len(keywords):
                for n in range(len(names)):
                    groupId = pointTag.create_group_by_keywords(projId, prt, keywords[n], names[n])
                    if groupId:
                        groupId_list.append(groupId)
            else:
                error = 'Invalid parameter'
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('create_group_by_keywords error:' + e.__str__())
        logging.error(e.__Str__())
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
        'projId': <int>,      # （必填）项目Id
        'arrTag': <list>      # （必填）设备Tag列表
    }
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            arrTag = post_data.get('arrTag')
            res = pointTag.set_tag(projId, arrTag)
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
    post_data = {'projId': <int>,     # （必填）项目Id
                 'attrP': <dict>,     # （必填）设备属性列表
                 'Id': <str>}         # （必填）设备Id
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            attrP = post_data.get('attrP')
            Id = post_data.get('Id')
            rt = pointTag.set_tagAttrP(projId, attrP, Id)
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


@bp_tag.route('/delTag', methods=['POST'])
def del_tag_from_thing_or_group():
    '''
    David 20161216
    删除Tag
    post_data = {
        'projId': <int>,        # （必填）项目Id
        'Ids': <list>,          # （必填）设备Id列表
        'tag': <str>,           # （必填）tag名称
    }
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            Ids = post_data.get('Ids')
            tagName = post_data.get('tag')
            res = pointTag.del_tag(projId, Ids, tagName)
            if not res:
                error = 'Delete Failed'
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
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            thingsId = post_data.get('thingsId')
            prt = post_data.get('Prt') if post_data.get('Prt') else ''
            if isinstance(thingsId, str):
                thingsId = [thingsId]
            if isinstance(thingsId, list):
                error = pointTag.move_things(projId, thingsId, prt)
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
            if post_data.get('tags'):
                res = pointTag.get_ThingsTree_Tag(projId, prt, post_data.get('tags'), searchText, limit, skip)
            else:
                res = pointTag.get_thingTree_detail(projId, prt, searchText, limit, skip)
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
            limit = post_data.get('limit')
            skip = post_data.get('skip')
            rt = pointTag.search(projId, name=name, keywords=keywords, prt=prt, tag=tag, limit=limit, skip=skip)
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
            pointTag.del_group(projId, groupId)
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
            rt = pointTag.get_ThingsTree_Tag(projId, prt, tags, limit, skip)
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


@bp_tag.route('/dict/')
def get_tag_dict():
    '''
    tag分组字典
    :return:
    '''
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
                               "pointCount": pointTag.get_count_from_dataSource(projId)}
        else:
            error = 'Invalid parameter'
    except Exception as e:
        print('get_sync_progress error:' + e.__str__())
        logging.error(e.__str__())
        error = e.__str__()
    if not error:
        return Utils.beop_response_success(currentProgress)
    else:
        return Utils.beop_response_success(msg=error)


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


@bp_tag.route('/formatPainter', methods=['POST'])
def format_painter():
    '''
    David 20170117
    格式刷
    post_data = {
        'projId': <int>,        # （必填）项目Id
        'sample': <str>,        # （必填）样本目录的Id
        'target': <str>         # （必填）目标目录的Id
    }
    '''
    post_data = request.get_json()
    error = None
    try:
        if post_data:
            projId = post_data.get('projId')
            sample_groupId = post_data.get('sample')
            target_groupId = post_data.get('target')
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


@bp_tag.route('/test')
def test():
    pointTag.test()
    return Utils.beop_response_success()
