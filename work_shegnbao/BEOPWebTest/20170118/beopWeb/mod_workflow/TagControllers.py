__author__ = 'liqian'

from flask import request

from beopWeb.mod_common.Utils import Utils
from beopWeb.mod_workflow import bp_workflow
from .Transaction import Transaction
from .Tag import Tag
from .TransactionTag import TransactionTag
from beopWeb.mod_admin.User import User
from .TransactionGroup import TransactionGroup
from .Star import Star
from beopWeb.AuthManager import AuthManager
from beopWeb.mod_workflow.Team import Team
from beopWeb.mod_workflow.Task import Task


# 查询用户的Tag
@bp_workflow.route('/tag/user/<user_id>', methods=['GET'])
def users_tag(user_id):
    if user_id is None:
        return Utils.beop_response_error()
    tag = Tag()
    tags = tag.get_by_user_id(user_id)
    return Utils.beop_response_success(tags)


@bp_workflow.route('/tags/', methods=['GET'])
def get_tags():
    user_id = AuthManager.get_userId()
    team = Team()
    found_team = team.get_team_by_user_id(user_id)
    return Utils.beop_response_success(found_team.get('tags'))


# 查询一个工单保存过的Tag
@bp_workflow.route('/trans/tag/<trans_id>', methods=['GET'])
def tag_trans(trans_id):
    if trans_id is None:
        return Utils.beop_response_error()
    trans_tag = TransactionTag()
    trans_tag_result = trans_tag.get_tag_by_trans_id(trans_id)
    tag = Tag()
    result = []
    for item in trans_tag_result:
        tag_item = tag.get_by_id(item.get('tagId'))
        if tag_item:
            result.append(tag_item)

    return Utils.beop_response_success(result)


# 用户删除一个Tag
@bp_workflow.route('/user/tag/delete/<user_id>/<tag_id>', methods=['get'])
def user_tag_delete(user_id, tag_id):
    if tag_id is None:
        return Utils.beop_response_error()
    result = Tag().delete_by_id(tag_id)
    tag = Tag()
    tags = tag.get_by_user_id(user_id)
    if result:
        return Utils.beop_response_success(tags)
    else:
        return Utils.beop_response_error()


# 用户添加Tag
@bp_workflow.route('/user/tag/add/<user_id>', methods=['POST'])
def user_tag_add(user_id):
    if not user_id:
        return Utils.beop_response_error(msg=' user_id invalid')
    result = 1
    tag = Tag()
    add_list = request.get_json()
    for item in add_list:
        name = item.get('name')
        color = item.get('color')
        if name is None:
            return Utils.beop_response_error()
        model = {
            'name': name,
            'color': color,
            'userId': user_id,
        }
        result *= tag.add_tag(model)
    if result:
        tags = tag.get_by_user_id(user_id)
        return Utils.beop_response_success(tags)
    else:
        return Utils.beop_response_error()


# 用户修改Tag
@bp_workflow.route('/user/tag/update/<user_id>', methods=['POST'])
def user_tag_update(user_id):
    if not user_id:
        return Utils.beop_response_error(msg=' user_id invalid')
    result = 1
    tag = Tag()
    update_list = request.get_json()
    for item in update_list:
        tag_id = item.get('id')
        name = item.get('name')
        color = item.get('color')
        tag_result = tag.get_by_id(tag_id)
        if tag_result.get('userId') != int(user_id):
            return Utils.beop_response_error(msg='invalid modify')
        if name is None:
            return Utils.beop_response_error()
        result *= tag.update_by_id(tag_id, {'name': name, 'color': color})
    if result:
        tag_result_new = tag.get_by_user_id(user_id)
        return Utils.beop_response_success(tag_result_new)
    else:
        return Utils.beop_response_error()


# 用户删除一个工单上的Tag
@bp_workflow.route('/tag/delete/<trans_id>/<tag_id>', methods=['GET'])
def trans_tag_delete(trans_id, tag_id):
    if tag_id is None:
        return Utils.beop_response_error()
    result = TransactionTag().delete_tag_from_trans(trans_id, tag_id)
    if result:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()


# 用户添加一个工单上的Tag
@bp_workflow.route('/tag/add/<trans_id>/<tag_id>', methods=['GET'])
def trans_tag_add(trans_id, tag_id):
    if tag_id is None:
        return Utils.beop_response_error()
    result = TransactionTag().add_tag_to_trans(tag_id, trans_id)
    if result:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()
