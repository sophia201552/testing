__author__ = 'yan'

from beopWeb.mod_algorithm import bp_algorithm
from .cloud_algorithm import *
from beopWeb.AuthManager import AuthManager


# add folder
@bp_algorithm.route('/folder/add/', methods=['POST'])
def AddAlgorithmTemplateFolder():
    rt = False
    try:
        data = request.get_json()
        if data:
            data['createTime'] = datetime.now()
            data['creator'] = AuthManager.get_userId()
            rt = Algorithm.AddAlgorithmTemplateFolder(data)
        else:
            raise Exception('json data error')
    except Exception as e:
        strError = 'AddAlgorithmTemplateFolder failed:' + e.__str__()
        print(strError)
        logging.error(strError)
        rt = strError
    return json.dumps(rt, ensure_ascii=False)


# save template
@bp_algorithm.route('/save/', methods=['POST'])
def SaveAlgorithmTemplate():
    rt = False
    try:
        data = request.get_json()
        if data:
            data['createTime'] = datetime.now()
            data['creator'] = AuthManager.get_userId()
            rt = Algorithm.SaveAlgorithmTemplate(data)
        else:
            raise Exception('json data error')
    except Exception as e:
        strError = 'SaveAlgorithmTemplate failed:' + e.__str__()
        print(strError)
        logging.error(strError)
        rt = strError
    return json.dumps(rt, ensure_ascii=False)


# get template content
@bp_algorithm.route('/<algorithm_id>', methods=['GET'])
def GetAlgorithmTemplateContent(algorithm_id):
    rt = {}
    try:
        if ObjectId.is_valid(algorithm_id):
            rt = Algorithm.GetAlgorithmTemplateContent(algorithm_id)
        else:
            raise Exception('algorithm_id is not valid')
    except Exception as e:
        strError = 'GetAlgorithmTemplateContent failed:' + e.__str__()
        print(strError)
        logging.error(strError)
        rt = strError
    return json.dumps(rt, ensure_ascii=False)


# load template tree
@bp_algorithm.route('/folder/<parent_id>', methods=['GET', 'POST'])
def LoadTemplateTree(parent_id):
    rt = []
    try:
        if parent_id == 'null' or ObjectId.is_valid(parent_id):
            rt = Algorithm.LoadTemplateTree(parent_id)
    except Exception as e:
        strError = 'LoadTemplateTree failed:' + e.__str__()
        print(strError)
        logging.error(strError)
        rt = strError
    return json.dumps(rt, ensure_ascii=False)


# search template
@bp_algorithm.route('/search/<search_text>', methods=['GET'])
def SearchTemplate(search_text):
    rt = {}
    try:
        if search_text:
            rt = Algorithm.SearchTemplate(search_text)
        else:
            raise Exception('search_text is null')
    except Exception as e:
        strError = 'SearchTemplate failed:' + e.__str__()
        print(strError)
        logging.error(strError)
        rt = strError
    return json.dumps(rt, ensure_ascii=False)


@bp_algorithm.route('/delete/', methods=['POST'])
def delete_template():
    data = request.get_json()
    template_id = data.get('id')
    rv = Algorithm.delete_template(template_id)
    if rv and rv.get('n') >= 1:
        return Utils.beop_response_success()
    else:
        return Utils.beop_response_error()
