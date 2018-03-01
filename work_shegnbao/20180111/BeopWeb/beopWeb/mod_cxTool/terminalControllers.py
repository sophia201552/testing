from beopWeb import app
from beopWeb.mod_common.Utils import Utils
import logging
from beopWeb.AuthManager import AuthManager
from flask import request
from beopWeb.mod_cxTool.dtuserver_prj import DtuServerProject
from beopWeb.BEOPDataAccess import BEOPDataAccess
from beopWeb.BEOPMongoDataAccess import BEOPMongoDataAccess
from beopWeb.MongoConnManager import MongoConnManager
from datetime import datetime


def get_terminal_list():
    rt = []
    sql = """
            select
                dp.id, dp.dbname, dp.dtuname, dp.dtuRemark, dp.timeZone, dp.bSendData, dp.serverCode,
                dpi.online, dpi.LastOnlineTime, dpi.LastReceivedTime, dpi.ReceivePointCount,
                p.id as projectid
            from dtuserver_prj as dp
            left join dtuserver_prj_info as dpi on dp.id = dpi.id
            left join project as p on p.mysqlname = dp.dbname
            where dp.dbname != '' and dp.dbname is not null
            order by dp.dbname;
          """
    try:
        rv = Utils.DbHelper().db.op_db_query(app.config['DATABASE'], sql)
        fields = ['id', 'dbname', 'dtuname', 'dtuRemark', 'timeZone', 'bSendData', 'serverCode',
                  'online', 'LastOnlineTime', 'LastReceivedTime', 'ReceivePointCount', 'projectid']
        rt = [{key: value for key, value in zip(fields, item)} for item in rv]
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
    return rt


def get_terminal_list_by_userId(userId):
    rt = []
    sql = """
        select
            dp.id, dp.dbname, dp.dtuname, dp.dtuRemark, dp.timeZone, dp.bSendData, dp.serverCode,
            dpi.online, dpi.LastOnlineTime, dpi.LastReceivedTime, dpi.ReceivePointCount,
            p.id as projectid
        from dtuserver_prj as dp
        left join dtuserver_prj_info as dpi on dp.id = dpi.id
        left join project as p on p.mysqlname = dp.dbname
        left join role_project as rp on p.id = rp.projectId
        left join user_role as ur on ur.roleId = rp.id
        where ur.userid = %s and p.mysqlname != '' and p.mysqlname is not null
        order by dp.dbname;
          """ % userId
    try:
        rv = Utils.DbHelper().db.op_db_query(app.config['DATABASE'], sql)
        fields = ['id', 'dbname', 'dtuname', 'dtuRemark', 'timeZone', 'bSendData', 'serverCode',
                  'online', 'LastOnlineTime', 'LastReceivedTime', 'ReceivePointCount', 'projectid']
        rt = [{key: value for key, value in zip(fields, item)} for item in rv]
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
    return rt


def get_terminal_dtuInfo_by_dtuId(dtuId):
    strSQL = """
        select
            dp.id, dp.dbname, dp.dtuname, dp.dtuRemark, dp.timeZone, dp.bSendData, dp.serverCode,
            dpi.online, dpi.LastOnlineTime, dpi.LastReceivedTime, dpi.ReceivePointCount,
            group_concat(p.id) as projects
        from dtuserver_prj as dp
        left join dtuserver_prj_info as dpi on dp.id = dpi.id
        left join project as p on dp.dbname = p.mysqlname
        where dp.id = %s
        group by dp.id;
    """ % dtuId
    dbrv = Utils.DbHelper().db.op_db_query_one(app.config['DATABASE'], strSQL)
    fields = ['id', 'dbname', 'dtuname', 'dtuRemark', 'timeZone', 'bSendData', 'serverCode',
              'online', 'LastOnlineTime', 'LastReceivedTime', 'ReceivePointCount', 'projects']
    rt = {key: value for key, value in zip(fields, dbrv)}
    return rt


def is_terminal_admin(userId):
    """
    Check whether user is in terminal admin. (roleGroupId = 2 or 9)
    2 => 数据接入组
    9 => 工程部
    :param userId:
    :return:
    """
    rt = False
    sql = "select count(*) as cou from p_role_group_user where userId = %s and roleGroupId in (2, 9)" % userId
    try:
        rv = Utils.DbHelper().db.op_db_query(app.config['DATABASE'], sql)
        for item in rv:
            if item[0] > 0:
                return True
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
    return rt        


@app.route('/terminal/list_dtu', methods=['GET'])
@app.route('/terminal/list_dtu/<type>', methods=['GET'])
def get_list_dtu(type=0):
    """
    获取终端列表
    type: 查询类型
    :return: type == 0 -> 无视项目权限返回所有DTU列表; type != 0 -> 仅返回和项目绑定且当前用户有权限的项目的DTU
    """
    user_id = AuthManager.get_userId()
    if is_terminal_admin(user_id):
        type = 0
    if type == 0:
        return Utils.beop_response_success(get_terminal_list())
    
    return Utils.beop_response_success(get_terminal_list_by_userId(str(user_id)))


@app.route('/terminal/dtu_info/get', methods=['POST'])
def get_dtu_info():
    error = None
    rt = {}
    post_data = request.get_json()
    if post_data:
        try:
            dtuId = post_data.get('dtuId')
            if dtuId is not None:
                rt = get_terminal_dtuInfo_by_dtuId(dtuId)
            else:
                raise Exception('No DTU found for DTU ID %s' % dtuId)
        except Exception as e:
            error = e.__str__()
            logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
    else:
        error = 'Invalid parameter'
    if error:
        return Utils.beop_response_error(msg=error)
    else:
        return Utils.beop_response_success(rt)


@app.route('/terminal/getHistory', methods=['POST'])
def getHistoryDataOfDtu():
    rtdata = {}
    user_id = AuthManager.get_userId()
    data = request.get_json()
    dtuId = data.get('dtuId')
    if not dtuId:
        return Utils.beop_response_error(msg='no dtuId post')
    
    pointList = data.get('pointList')
    if not pointList:
        return Utils.beop_response_error(msg='no pointList post')
    
    timeStartText = data.get('timeStart')
    timeStart = datetime.strptime(timeStartText, "%Y-%m-%d %H:%M:%S")
    if not timeStart:
        return Utils.beop_response_error(msg='no start time post')

    timeEndText = data.get('timeEnd')
    timeEnd = datetime.strptime(timeEndText, "%Y-%m-%d %H:%M:%S")
    if not timeEnd:
        return Utils.beop_response_error(msg='no end time post')
    
    timeFormat = data.get('timeFormat')
    if not timeFormat:
        return Utils.beop_response_error(msg='no timeFormat post')
    
    dtuName = data.get('dtuName')
    if not dtuName:
        return Utils.beop_response_error(msg='no dtuName post')
    try:
        dbname = BEOPDataAccess.getInstance().getDbnameByDtuId(dtuId)
        projId = BEOPDataAccess.getInstance().getProjIdBySqlname(dbname)
        rtdata = BEOPDataAccess.getInstance().get_history_data_padded(
            projId, pointList, timeStartText, timeEndText, timeFormat, False, dbname)
    except Exception as e:
        Utils.beop_response_error(msg=e.__str__())
    return Utils.beop_response_success(rtdata)


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
    except Exception:
        logging.error('Unhandled exception! Locals: %s', locals(), exc_info=True, stack_info=True)
    return Utils.beop_response_success(get_terminal_list())
