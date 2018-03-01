#coding=utf-8
from flask import request, json, jsonify
import logging, requests

from beopWeb import app
from beopWeb.mod_appCommon import bp_appCommon, pushService
from beopWeb.BEOPDataAccess import  *
from datetime import datetime

@bp_appCommon.route('/getVersion/<name>/<version>', methods=['GET'])
def getVersion(name, version):
    dbAccess = BEOPDataAccess.getInstance()
    strSQL = 'SELECT * FROM version WHERE name="%s" and version<>"%s"'%(name, version)
    rt = dbAccess._mysqlDBContainerReadOnly.op_db_query_one('beopdoengine', strSQL, ())
    data = {}
    if len(rt) > 0:
        data = {
                'name': rt[0],
                'version': rt[1],
                'time': rt[2],
                'url': rt[3],
                'detail': rt[4],
                'detail_en': rt[5]
            }

    return jsonify(data)

@bp_appCommon.route('/sendMessage', methods=['POST'])
def sendMessage(post_data=None):
    '''
    post_data = {'message':'', 'title':'', 'alert':None
                 'userId_list':[], 'projId_list':[], 'registration_id':[]}
    '''
    return pushService.sendMessage()


@bp_appCommon.route('/pushNotification/updateMessage/<userId>/<status>', methods=['POST'])
def updateMessage(userId,status):
    data = request.get_json()
    try:
        for i in range (len(data)):
            data[i] = str(data[i])
        strMsgIdList = ','.join(data)
        dbAccess = BEOPDataAccess.getInstance()
        if int(status) == 1:
            strSQL = 'UPDATE pushnotification_client SET receive_time=NOW(),status= %s WHERE user_id=%s and msg_id in (%s)'%(status,userId,strMsgIdList)
        elif int(status) == 2:
            strSQL = 'UPDATE pushnotification_client SET read_time=NOW(),status= %s WHERE user_id=%s and msg_id in (%s)'%(status,userId,strMsgIdList)
        dbAccess._mysqlDBContainer.op_db_update('beopdoengine', strSQL, ())
        rt = {'success':True}
    except Exception as e:
        print('updateMessage error:' + e.__str__())
        rt = {'success':False,'error':e.__str__()}
    return jsonify(rt)


@bp_appCommon.route('/pushNotification/getMessageList', methods=['POST'])
def getMessageList():
    data = request.get_json()
    try:
        arr_sql_client_filter = []
        str_sql_client_filter = ''
        filter = data.get('filter',{})
        userId = filter.get('userId',-1)
        type = filter.get('type','')
        status = filter.get('status',-1)
        if userId != -1:
            arr_sql_client_filter.append('user_id =' + str(userId))
        if type:
            arr_sql_client_filter.append('type ="' + str(type) +'"')
        if status != -1:
            arr_sql_client_filter.append('status =' + str(status))
        if len(arr_sql_client_filter) > 0:
            str_sql_client_filter = 'WHERE ' + ' and '.join(arr_sql_client_filter)

        start = data.get('start',0)
        limit = data.get('limit',10)
        order = data.get('asc',True)
        if order == True:
            order = 'ASC'
        else:
            order = 'DESC'
        dbAccess = BEOPDataAccess.getInstance()

        strSQL_for_client = 'SELECT * FROM pushnotification_client %s ORDER BY msg_id %s LIMIT %s , %s '%(str_sql_client_filter,order,start,limit)
        list_client = dbAccess._mysqlDBContainerReadOnly.op_db_query('beopdoengine', strSQL_for_client, ())
        # strSQL_for_total = 'SELECT COUNT(msg_id) FROM pushnotification_client %s'%(str_sql_client_filter)
        # total = dbAccess._mysqlDBContainerReadOnly.op_db_query_one('beopdoengine', strSQL_for_total, ())[0]
        msgList = []
        msgIdList = []
        msgListNew = []
        if len(list_client) > 0:
            for i in range(len(list_client)):
                msgIdList.append(str(list_client[i][1]))
                msgList.append({
                    'userId':list_client[i][0],
                    'msgId':list_client[i][1],
                    'status':list_client[i][3],
                    'readTime':list_client[i][4],
                    'receiveTime':list_client[i][5],
                    'type':list_client[i][2]
                })
                if msgList[i]['status'] == 0:
                    msgList[i]['receiveTime'] = datetime.now()
                    msgListNew.append(str(list_client[i][1]))
            strMsgIdList = ','.join(msgIdList)
            strSQL_for_server = 'SELECT * FROM pushnotification_server WHERE id IN (%s) ORDER BY id %s'%(strMsgIdList,order)
            list_server = dbAccess._mysqlDBContainerReadOnly.op_db_query('beopdoengine', strSQL_for_server, ())
            for i in range(len(list_server)):
                msg = list_server[i]
                if msg[0]== msgList[i].get('msgId'):
                    msgList[i].update({'title':msg[1],'alert':msg[2],'option':json.loads(msg[4]),'createTime':datetime.strftime(msg[5],'%x %X')})
                else:
                    del msgList[i]
            if len(msgListNew) > 0 and userId != -1:
                strSQL_for_receive = 'UPDATE pushnotification_client SET receive_time=NOW(),status= 1 WHERE user_id=%s and msg_id in (%s)'%(userId,','.join(msgListNew))
                dbAccess._mysqlDBContainer.op_db_update('beopdoengine', strSQL_for_receive, ())
        rt = {'success':True, 'data': msgList}
    except Exception as e:
        print('getMessageList error:' + e.__str__())
        rt = {'success':False,'error':e.__str__()}
    # data = [
    #     {
    #     'id':1,
    #     'title':'推送工单标题',
    #     'alert':'推送工单描述',
    #     'type':'workflow',
    #     'option':{
    #         'id':'58afa86c645514b8a889d383'
    #     },
    #     'createTime':'2012-12-12 12:12:12'
    #     },
    #     {
    #     'id':2,
    #     'title':'推送报表标题',
    #     'alert':'推送报表描述',
    #     'type':'report',
    #     'option':{
    #             'projectId':'179',
    #             'reportId':'14679582018300734a519759',
    #             'reportDetail':{
    #                 'id': "14679582018300734a519759",
    #                 'period':'day',
    #                 'periodStartTime': 0,
    #                 'reportName':"Daily Reading "
    #             },
    #             'reportDate':'2017-01-17',
    #             'isFactory':True,
    #     },
    #     'createTime':'2012-12-12 12:12:12'
    #     },
    #     {
    #     'id':3,
    #     'title':'推送Dashboard标题',
    #     'alert':'推送Dashboard描述',
    #     'type':'dashboard',
    #     'option':{
    #             'id':'5681fa7e833c971cf222a747',
    #             'projectId':72,
    #             'name':'华为总览'
    #         },
    #     'createTime':'2012-12-12 12:12:12'
    #     },
    #     {
    #     'id':4,
    #     'title':'设备警报提醒',
    #     'alert':'设备警报提醒描述描述描述',
    #     'type':'default',
    #     'option':{},
    #     'createTime':'2012-12-12 12:12:12'
    #     }
    # ]
    return jsonify(rt)


@bp_appCommon.route('/pushNotification/deleteMessage/<userId>', methods=['POST'])
def delMessage(userId): 
    arrMsgId = request.get_json()
    try:
        strMsgIdList = ','.join(arrMsgId)
        dbAccess = BEOPDataAccess.getInstance()
        strSQL = 'DELETE FROM pushnotification_client WHERE user_id=%s and msg_id in (%s)'%(userId,strMsgIdList)
        rv = dbAccess._mysqlDBContainer.op_db_update('beopdoengine', strSQL, ())
        rt = {'success':rv}
    except Exception as e:
        print('deleteMessage error:' + e.__str__())
        rt = {'success':False,'error':e.__str__()}
    return jsonify(rt)

@bp_appCommon.route('/pushNotification/getNewMessageNum/<userId>', methods=['GET'])
def getNewMessageNum(userId):
    try:
        dbAccess = BEOPDataAccess.getInstance()
        strSQL = 'SELECT count(msg_id) FROM pushnotification_client WHERE user_id="%s" and status<>2'%(userId)
        rt = dbAccess._mysqlDBContainerReadOnly.op_db_query_one('beopdoengine', strSQL, ())
        rt = {'success':True,'data':rt[0]}
    except Exception as e:
        print('getNewMessageNum error:' + e.__str__())
        rt = {'success':False,'error':e.__str__()}
    return jsonify(rt)

@bp_appCommon.route('/pushNotification/insertMessage', methods=['POST'])
def inserMessage_url():
    msg = request.get_json()
    return insertMessage(msg)

def insertMessage(msg):
    dbAccess = BEOPDataAccess.getInstance()
    try:
        tplOption = msg.get('option',{})
        strOption = json.dumps(tplOption)
        type = tplOption.get('type','default')
        userIdList = msg.get('userId',[])
        if isinstance(userIdList, list) :
            for i in range(len(userIdList)):
                msg['userId'][i] = str(msg['userId'][i])
            arrUserId = '/'.join(msg['userId'])
        else :
            arrUserId = '-1'
        pushMode = msg.get('pushMode',1)
        strSQL_for_server = 'INSERT INTO pushnotification_server (title,alert,type,`option`,create_time,user_list,push_mode) \
                  VALUES ("%s","%s","%s",\'%s\',NOW(),"%s",%s)'%(msg['title'],msg['alert'],type,strOption,arrUserId,pushMode)
        # strSQL_for_server = 'INSERT INTO pushnotification_server (title,alert,type,`option`,create_time,user_list,push_mode) VALUES ("test","BeOP","workflow",\'{"id": "58afa86c645514b8a889d383", "type": "workflow"}\',NOW(),"1560",1)'
        msg_id = dbAccess._mysqlDBContainer.op_db_update_with_id('beopdoengine', strSQL_for_server, ())
        strSQL_for_client = 'INSERT INTO pushnotification_client (user_id,msg_id,status,type) VALUES  '
        rv = False
        if isinstance(userIdList, list) :
            for i in range(len(userIdList)):
                strSQL_for_client = strSQL_for_client + '(%s,%s,0,"%s")'%(userIdList[i],msg_id,type)
                if(i != len(userIdList) - 1):
                    strSQL_for_client  = strSQL_for_client + ' ,'
            rv = dbAccess._mysqlDBContainer.op_db_update('beopdoengine', strSQL_for_client, ())
        rt = {'success':rv,'msg_id':msg_id}
    except Exception as e:
        print('inserMessage error:' + e.__str__())
        rt = {'success':False,'error':e.__str__()}
    return jsonify(rt)