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


# 查询用户的Tag
@bp_workflow.route('/tag/user/<user_id>', methods=['GET'])
def users_tag(user_id):
    if user_id is None:
        return Utils.beop_response_error()
    tag = Tag()
    tags = tag.get_by_user_id(user_id)
    return Utils.beop_response_success(tags)


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


# 查询一个Tag对应的工单
@bp_workflow.route('/tag/trans/<user_id>/<tag_id>/<int:page_num>/<int:page_size>', methods=['POST'])
def trans_tag(user_id, tag_id, page_num, page_size):
    result = {
        'total': 0,
        'records': []
    }

    start_num = (page_num - 1) * page_size
    trans_tag = TransactionTag()
    count = trans_tag.get_trans_count_by_id(tag_id)
    if not count:
        return Utils.beop_response_success(result)

    result['total'] = count

    order_property = None
    asc = None
    order = []
    if request.method == 'POST':
        try:
            rq_data = request.get_json()
            order_property = rq_data.get('orderProperty')
            asc = rq_data.get('asc')
            if order_property is not None and asc is not None:
                order = [order_property, 'ASC' if asc else 'DESC']
        except Exception as e:
            pass

    trans = Transaction()
    trans_result = trans.get_transaction_by_tag(tag_id, start_num, page_size, order)

    all_user_map = User().get_all_user_map()
    trans_group = TransactionGroup()
    # 收藏切换
    star = Star()
    for item in trans_result:
        user = all_user_map.get(item.get('executorID'))
        item['executorName'] = user.get('userfullname') if user else ''
        group = trans_group.get_trans_group_by_id(item.get('groupid'))
        item['groupName'] = group.get('name')
        item['star'] = star.is_starred(user_id, item.get('id'))
    result['records'] = trans_result
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
