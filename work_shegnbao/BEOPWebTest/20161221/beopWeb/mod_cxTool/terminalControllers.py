from beopWeb import app
from beopWeb.mod_common.Utils import Utils
import logging
from beopWeb.AuthManager import AuthManager
from flask import request
from beopWeb.mod_cxTool.dtuserver_prj import DtuServerProject


def get_terminal_list():
    rt = []
    sql = """select t.id, t.dbname, t.dtuname, t.dtuRemark, a.online, a.LastOnlineTime, a.LastReceivedTime,
                  a.ReceivePointCount, t.timeZone, t.bSendData, t.serverCode
                  from dtuserver_prj t left join dtuserver_prj_info a
                  on t.id = a.id
                  order by t.dtuRemark"""
    try:
        rv = Utils.DbHelper().db.op_db_query(app.config['DATABASE'], sql)
        fields = ['id', 'dbname', 'dtuname',
                  'dtuRemark', 'online', 'LastOnlineTime',
                  'LastReceivedTime', 'ReceivePointCount', 'timeZone',
                  'bSendData', 'serverCode']
        rt = [{key: value for key, value in zip(fields, item)} for item in rv]
    except Exception as e:
        logging.error('获取终端列表错误:' + str(e))
        print('获取终端列表错误:' + str(e))
    return rt


@app.route('/terminal/list_dtu', methods=['GET'])
def get_list_dtu():
    """
    获取终端列表
    :return: 返回所有终端的列表
    """

    return Utils.beop_response_success(get_terminal_list())


@app.route('/terminal/updateDB', methods=['POST'])
def update_db():
    """
    更新终端的db
    :return:更新后的终端列表
    """
    user_id = AuthManager.get_userId()
    if not user_id:
        return Utils.beop_response_error(code=403)

    data = request.get_json()

    if not data.get('dbName'):
        return Utils.beop_response_error(msg='db name can not be empty')

    if not data.get('dtuIDs') or not isinstance(data.get('dtuIDs'), list):
        return Utils.beop_response_error(msg='dtu id can\'t be empty, must be a list.')

    dsp = DtuServerProject()
    try:
        for dtu_id in data.get('dtuIDs'):
            dsp.update({'dbname': data.get('dbName')}, where=('id=%s', (dtu_id,)))
    except Exception as e:
        logging.error('更新终端db出错:' + str(e))
    return Utils.beop_response_success(get_terminal_list())
