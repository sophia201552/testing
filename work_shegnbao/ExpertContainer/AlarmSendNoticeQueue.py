__author__ = 'Eric'
import requests
from ExpertContainer import app
from ExpertContainer.api.utils import *
from ExpertContainer.dbAccess import mongo_operator
from ExpertContainer.api.utils import *
from ExpertContainer.api.ArchiveManager import ArchiveManager
from ExpertContainer.dbAccess.ConfigMongoDBAccess import ConfigMongoDBAccess
from ExpertContainer.api.cacheProfile import DataManager
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from ExpertContainer.dbAccess.MongoConnManager import MongoConnManager
from ExpertContainer.api.CalPointManager import CalPointManager
from ExpertContainer.mqAccess.MQManager import MQManager
from ExpertContainer.api.LogOperatorListen import LogOperatorListen
from ExpertContainer.logic.LogicBase import LogicBase
from ExpertContainer.dbAccess.RedisManager import RedisManager
from ExpertContainer.api.api import DiagnosisDataMethods, RealtimeDataMethods, DataAlarmInfo
from jinja2 import Environment, PackageLoader, FileSystemLoader, Template
from datetime import datetime, timedelta
import socket
import sys, threading
import platform, logging


strProcessName = 'AlarmDataQueue_1'
# 报警结果 ： 1正常 0低于低限 -1 低于低低限 2高于高限 3 高于高高限
alarmTypeCN = {
    -1: ["低低限报警", "lowlow"],
    0: ["低限报警", "low"],
    1: ["正常", ""],
    2: ["高限报警", "high"],
    3: ["高高限报警", "highhigh"]
}


def process_alarm(msg):
    """
    msg = {
        "projId": 1,
        "alarm_result_list": {
            "TEST789": {
                "alarm_id": "5806dc51b264a9163c29968e",
                "alarm_time": "2016-11-08 19:12:00", "pointName": "TEST789", "mTime": 0,
                "alarm_result": 3, "_id": 0, "lowlow": 10
                "highhigh": 200, "grade": 3, "low": 50, "alarm_type": 2, "high": 100, "pointValue": 210,
                "msg": "报警信息测试:当前值高于高高限", "advice": "建议进行高高限处理",
            }
        }
    }
    """
    logging.info('Sending alarm: %s', msg)

    if msg:
        projId = int(msg.get('projId'))
        alarm_result = msg.get('alarm_result_list')
        if projId and alarm_result:
            actTime = datetime.now().strftime(standard_time_format)
            idlist = [str(alarm_result[key].get('alarm_id')) for key in alarm_result.keys()]
            alarmtitl = '数据值异常告警'
            if idlist:
                rt = RealtimeDataMethods.get_alarm_name_list(projId, idlist)
                if rt:
                    # 获取项目名称
                    projectinfo = RedisManager.get_project_info_list()
                    projname = ''
                    if projectinfo:
                        for item in projectinfo:
                            if item.get('id') == projId:
                                projname = item.get('name_cn')
                                break
                    countryConfig = BEOPDataAccess.getInstance().getCountryConfigByProjId(projId)
                    tradeMark = countryConfig.get('tradeMark')
                    tradeMark = 'BeOP' if tradeMark is None else tradeMark

                    for key in rt:
                        strName = get_alarm_strname(alarm_result[key].get('alarm_result'),
                                                    key, alarm_result[key].get('alarm_type'))
                        needAlarm = bool_needAlarm(projId, strName, alarm_result[key])
                        if needAlarm:
                            alarmmsg_str = '项目%s中%s数据值异常告警' % (projId, str(key),)
                            alarm_result_re = alarm_result[key].get('alarm_result')
                            atime = alarm_result[key].get('alarm_time')
                            type = alarm_result[key].get('alarm_type')
                            lowlow = alarm_result[key].get('lowlow')
                            highhigh = alarm_result[key].get('highhigh')
                            high = alarm_result[key].get('high')
                            low = alarm_result[key].get('low')
                            advice = alarm_result[key].get('advice')
                            pointValue = alarm_result[key].get('pointValue')
                            msg = alarm_result[key].get('msg')
                            grade = alarm_result[key].get('grade')
                            aliasStr = mongo_operator.get_alias_by_name_and_projId(str(key), projId)
                            if aliasStr:
                                aliasStr = "/" + aliasStr

                            if rt[key].get('mail'):
                                print(alarmmsg_str + ' EMAIL 通知')

                                alarmmsg = {
                                    'email': str(rt[key].get('mailName')), 'alarmTime': atime,
                                    'type': type, 'countryConfig': countryConfig, 'pointName': str(key)}
                                if lowlow is not None:
                                    alarmmsg.update({'lowlow': lowlow})
                                if highhigh is not None:
                                    alarmmsg.update({'highhigh': highhigh})
                                if low is not None:
                                    alarmmsg.update({'low': low})
                                if high is not None:
                                    alarmmsg.update({'high': high})
                                if msg is not None:
                                    alarmmsg.update({'alarmMsg': msg})
                                if advice is not None:
                                    alarmmsg.update({'alarmAdvice': advice})
                                if grade is not None:
                                    alarmmsg.update({'alarmGrade': grade})
                                if pointValue is not None:
                                    alarmmsg.update({'value': pointValue})
                                if projname:
                                    alarmmsg.update({'project': projname})
                                else:
                                    projname = get_projInfo_by_id(projId)
                                    alarmmsg.update({'project': projname})

                                path = getMouldPath()
                                loader = FileSystemLoader(path)
                                env = Environment(loader=loader)
                                template = env.get_template('dataAlarmEmail.html')
                                resultHTML = template.render(alarm=alarmmsg)

                                # golding modifed
                                userList = rt[key].get('mail')
                                for uidOrName in userList:
                                    if isUserNeedSend(projId, uidOrName, SysMsgType.ALARM, SysMsgWayType.EMAIL,
                                                      strName, alarm_result[key].get('interval')):
                                        DiagnosisDataMethods.send_message_by_email(
                                            [uidOrName], alarmtitl, resultHTML)
                                        # 存入发送记录
                                        DataAlarmInfo.saveSysMsgSentUserData(
                                            projId, uidOrName, SysMsgType.ALARM,
                                            SysMsgWayType.EMAIL, strName, {}, actTime, 'ExpertContainer')
                            # should modify
                            alarmType_str = alarmTypeCN.get(alarm_result_re)[0]
                            alarmLimitValue = alarm_result[key].get(alarmTypeCN.get(alarm_result_re)[1])
                            userAppList = rt[key].get('app')
                            for uidOrName in userAppList:
                                if isUserNeedSend(projId, uidOrName, SysMsgType.ALARM, SysMsgWayType.APP, strName,
                                                  alarm_result[key].get('interval')):
                                    if pointValue is not None:
                                        pointValue = round(float(pointValue), 2)
                                        pointValueStr = str(pointValue)
                                    else:
                                        pointValueStr = "空"
                                    if type == 1:
                                        alarmmsg = "您的项目【%s】的【< %s%s >】发生状态报警，请及时进行确认和处理。" \
                                                   % (projname, key, aliasStr,)
                                    elif type == 2:
                                        alarmmsg = "您的项目【%s】的【< %s%s >】当前值为：%s，触发了%s,报警限值为%s，" \
                                                   "请及时进行确认和处理。" % (
                                                       projname, key, aliasStr, pointValueStr,
                                                       alarmType_str, alarmLimitValue,)
                                    DiagnosisDataMethods.send_message_by_app([uidOrName], alarmtitl, alarmmsg)
                                    DataAlarmInfo.saveSysMsgSentUserData(
                                        projId, uidOrName, SysMsgType.ALARM,
                                        SysMsgWayType.APP, strName, {}, actTime, 'ExpertContainer')

                            userMobileList = rt[key].get('sms')
                            for uidOrName in userMobileList:
                                if isUserNeedSend(projId, uidOrName, SysMsgType.ALARM, SysMsgWayType.SMS, strName,
                                                  alarm_result[key].get('interval')):
                                    if pointValue is not None:
                                        pointValue = round(float(pointValue), 2)
                                        pointValueStr = str(pointValue)
                                    else:
                                        pointValueStr = "空"
                                    if type == 1:
                                        alarmmsg = "项目【%s】的【%s】发生状态报警，请及时处理。【%s智慧服务】" \
                                                   % (projname, key, tradeMark)
                                    elif type == 2:
                                        alarmmsg = "项目【%s】的【%s】当前值为%s，触发了限值为%s的%s，请及时处理。" \
                                                   "【%s智慧服务】" % (
                                                       projname, key, pointValueStr, alarmLimitValue,
                                                       alarmType_str, tradeMark)
                                    DiagnosisDataMethods.send_message_by_mobile([uidOrName], alarmmsg)
                                    DataAlarmInfo.saveSysMsgSentUserData(projId, uidOrName, SysMsgType.ALARM,
                                                                         SysMsgWayType.SMS, strName, {}, actTime,
                                                                         'ExpertContainer')
                            userWebsetList = rt[key].get('website')
                            for uidOrName in userWebsetList:
                                if isinstance(uidOrName, int):
                                    id = uidOrName
                                else:
                                    id = BEOPDataAccess.getInstance().get_userId_by_name(uidOrName)
                                if isUserNeedSend(projId, uidOrName, SysMsgType.ALARM, SysMsgWayType.WEB,
                                                  strName, alarm_result[key].get('interval')):
                                    if pointValue is not None:
                                        pointValue = round(float(pointValue), 2)
                                        pointValueStr = str(pointValue)
                                    else:
                                        pointValueStr = "空"
                                    if type == 1:
                                        alarmmsg = "您的项目【%s】的【< %s%s >】点数值报警，请及时进行确认和处理。" \
                                                   % (projname, key, aliasStr,)
                                    elif type == 2:
                                        alarmmsg = "您的项目【%s】的【< %s%s >】当前值为：%s，触发了%s,报警限值为%s，" \
                                                   "请及时进行确认和处理。" % (
                                                       projname, key, aliasStr, pointValueStr,
                                                       alarmType_str, alarmLimitValue,)
                                    # 调用网站推送方法
                                    postData = {
                                        "receiver": [id],
                                        "message": [{
                                            "title": alarmtitl,
                                            "content": alarmmsg
                                        }],
                                        "userId": 1,
                                        "tags": ['alarm']
                                    }
                                    r = requests.post(
                                        url='http://%s/message/api/v1/sendUserMsg/alarm' % (
                                            app.config['BEOPWEB_ADDR']),
                                        headers={"content-type": "application/json",
                                                 "token": app.config.get('BEOPWEB_SECRET_TOKEN')},
                                        data=json.dumps(postData))
                                    if r.status_code != 200:
                                        logging.warning('Push message failed! Status code: %s', r.status_code)
                                    DataAlarmInfo.saveSysMsgSentUserData(
                                        projId, uidOrName, SysMsgType.ALARM, SysMsgWayType.WEB,
                                        strName, {}, actTime, 'ExpertContainer')


def callback(ch, method, properties, body):
    projId = None
    ArchiveManager.iAmLive(strProcessName)
    try:
        logging.debug('callback msg: %s', body)
        msgb = body.decode(encoding='utf-8')
        msg = json.loads(msgb)
        process_alarm(msg)
        ch.basic_ack(delivery_tag=method.delivery_tag)
        return True
    except Exception:
        logging.error('项目%s消息消费完毕:意外!', projId, exc_info=True, stack_info=True)
        ch.basic_ack(delivery_tag=method.delivery_tag)
        return True


def getMouldPath():
    try:
        sysstr = platform.system()
        if sysstr == 'Windows':
            path = os.getcwd()
            path += os.sep + 'ExpertContainer' + os.sep + 'templates' + os.sep + 'email' + os.sep
        else:
            path = '/home/beop/ExpertContainer/ExpertContainer/templates/email/'
        return path
    except Exception:
        logging.error('Failed to get mould path!', exc_info=True, stack_info=True)
        return '/home/beop/ExpertContainer/ExpertContainer/templates/email/'


def isUserNeedSend(projId, uIdOrName, alarmType, wayType, strName, interval):
    bNeed = True
    last_time = DataAlarmInfo.getLastSysMsgSentUserTime(projId, uIdOrName, alarmType, wayType, strName)
    if last_time:
        tmObj = datetime.strptime(last_time, standard_time_format)
        tmNow = datetime.now()
        interval_temp = 0
        if interval:
            if int(interval) == 1:
                interval_temp = 1
            elif int(interval) == 2:
                interval_temp = 4
            elif int(interval) == 3:
                interval_temp = 8
            elif int(interval) == 4:
                interval_temp = 24
        if isinstance(interval_temp, int):
            tm_temp = tmObj + timedelta(hours=interval_temp)
            if tm_temp > tmNow:
                bNeed = False
        if interval_temp == 0:
            return False
    return bNeed


def get_history_duration(projId, alarm_id_list, s_time, e_time):
    BEOPDataAccess.getInstance().get_alarm_history(projId, alarm_id_list, s_time, e_time)


def get_alarm_strname(alarm_result, strkey, type):
    strName = ''
    strName_flag = None
    if alarm_result == -1:
        strName_flag = '_LL'
    elif alarm_result == 0:
        strName_flag = '_L'
    elif alarm_result == 2:
        strName_flag = '_H'
    elif alarm_result == 3:
        strName_flag = '_HH'
    if type == 1:
        strName_flag = '_F'
    if strName_flag:
        strName = strkey + strName_flag
    return strName


def get_last_send_time_list(projId, uidOrName, strName):
    DataAlarmInfo.getLastSysMsgSentUserTime(projId, uidOrName, SysMsgType.ALARM, SysMsgWayType.EMAIL, strName)


def get_projInfo_by_id(projId):
    rt = DataAlarmInfo.get_projInfo_by_id(projId)
    return rt


def bool_needAlarm(projId, strName, alarm_result):
    rt = False
    try:
        duration = alarm_result.get('duration')
        isSilent = alarm_result.get('isSilent')
        if isSilent:
            start_t = alarm_result.get('silentTime_s').split(':')
            end_t = alarm_result.get('silentTime_e').split(':')
            tmNow = datetime.now()

            start_date = datetime.now()
            end_date = datetime.now()
            if isinstance(start_t[1], str) and isinstance(start_t[0], str):
                if isinstance(end_t[1], str) and isinstance(end_t[0], str):
                    start_date = datetime.now().replace(
                        minute=int(start_t[1]), second=0, microsecond=0, hour=int(start_t[0]))
                    end_date = datetime.now().replace(
                        minute=int(end_t[1]), second=0, microsecond=0, hour=int(end_t[0]))
            else:
                return False
            # 如果结束时间的小时值小于开始时间，结束时间为第二天的小时值
            if start_date > end_date:
                end_date = end_date + timedelta(days=1)
            if start_date < tmNow < end_date:
                return False

        if duration:
            isalarm = RedisManager.get_alarm_flag(projId)
            if not isalarm:
                isalarm = {strName: datetime.now().strftime(standard_time_format)}
                RedisManager.set_alarm_flag(projId, isalarm)
                rt = False
            else:
                if isalarm.get(strName):
                    tmObj = datetime.strptime(isalarm.get(strName), standard_time_format)
                    tmNow = datetime.now()
                    tm_temp = tmObj + timedelta(minutes=int(duration))
                    if tm_temp <= tmNow:
                        rt = True
                else:
                    isalarm[strName] = datetime.now().strftime(standard_time_format)
                    RedisManager.set_alarm_flag(projId, isalarm)
                    rt = False
        else:
            rt = True
    except Exception:
        logging.error('Failed to determine whether alarm is needed!', exc_info=True, stack_info=True)
        return False
    return rt


def runConsume():
    try:
        logging.info('报警队列监听线程启动')
        credentials = pika.PlainCredentials(app.config['MQ_USERNAME'], app.config['MQ_PASSWORD'])
        connection = pika.BlockingConnection(pika.ConnectionParameters(
            host=app.config['MQ_ADDRESS'], credentials=credentials))
        channel = connection.channel()
        channel.queue_declare(queue=app.config['MQ_RECEIVE_ALARM_NAME'], durable=True)
        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(callback, queue=app.config['MQ_RECEIVE_ALARM_NAME'])
        channel.start_consuming()
    except Exception:
        logging.error('消息处理进程意外中止', exc_info=True, stack_info=True)


def heartbeat_router():
    try:
        while True:
            now_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            RedisManager.set_heartbeat_time("heartbeat_alarm", now_time)
            time.sleep(10)
    except Exception:
        logging.error('Failed to heartbeat router!', exc_info=True, stack_info=True)


if __name__ == '__main__':
    strProcessName = sys.argv[1] if len(sys.argv) > 1 else 'AlarmDataQueue_1'
    if strProcessName == 'test':
        strProcessName = 'AlarmDataQueue-test'
    myname = socket.getfqdn(socket.gethostname())
    t = threading.Thread(target=heartbeat_router, name='heartbeat_alarm', daemon=True)
    t.start()
    runConsume()
