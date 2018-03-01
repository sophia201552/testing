__author__ = 'yan'

from ExpertContainer.api.LogOperator import LogOperator
from ExpertContainer.api.utils import *
from ExpertContainer.api.api import DiagnosisDataMethods
from ExpertContainer import app
import requests, json
from ExpertContainer.dbAccess import mongo_operator


class DiagnosisBase:

    _Logger = LogOperator()

    def __init__(self, projId, buildingName, subBuildingName, pageId=None):
        try:
            if projId and buildingName and subBuildingName:
                self._projId = projId
                self._buildingName = buildingName
                self._subBuildingName = subBuildingName
                self._pageId = pageId
            else:
                raise Exception('invalid param of construct function')
        except Exception as e:
            DiagnosisBase._Logger.writeLog('%s in %s:'%(get_current_func_name(), __name__[__name__.rfind('/')+1:])+e.__str__(),True)

    def get_active_enable(self, starttime, endtime):
        return DiagnosisDataMethods.get_active_enable(self._projId, starttime, endtime)

    def get_active_fault(self, starttime, endtime):
        return DiagnosisDataMethods.get_active_fault(self._projId, starttime, endtime)

    def get_active_limit(self, starttime, endtime):
        return DiagnosisDataMethods.get_active_limit(self._projId, starttime, endtime)

    def get_active_order(self, starttime, endtime):
        return DiagnosisDataMethods.get_active_order(self._projId, starttime, endtime)

    def get_diagnosis_all(self):
        return DiagnosisDataMethods.get_diagnosis_all(self._projId)

    def get_diagnosis_notice(self):
        return DiagnosisDataMethods.get_diagnosis_notice(self._projId)

    def get_diagnosis_fault(self):
        return DiagnosisDataMethods.get_diagnosis_fault(self._projId)

    def get_diagnosis_equipment(self):
        return DiagnosisDataMethods.get_diagnosis_equipment(self._projId)

    def get_diagnosis_zone(self):
        return DiagnosisDataMethods.get_diagnosis_zone(self._projId)

    def add_diagnosis_equipment(self, modalTextId, subSystemName, systemId, zoneId, name, systemName, id):
        if not self._pageId:
            self._pageId = self.get_page_id(self._subBuildingName)
        assert self._pageId, 'pageId of %s not found'%(self._subBuildingName)
        return DiagnosisDataMethods.add_diagnosis_equipment(self._projId, modalTextId, subSystemName, systemId, zoneId, name, systemName, self._pageId, id)

    def add_diagnosis_zone(self, campusId, buildingId, subBuildingId, id, campusName):
        if not self._pageId:
            self._pageId = self.get_page_id(self._subBuildingName)
        assert self._pageId, 'pageId not found'%(self._subBuildingName)
        return DiagnosisDataMethods.add_diagnosis_zone(self._projId, campusId, buildingId, self._subBuildingName, subBuildingId, self._pageId, id, self._buildingName, campusName)

    def add_diagnosis_notice(self, FaultID, issueTime, Detail ):
        return DiagnosisDataMethods.add_diagnosis_notice(self._projId, FaultID, issueTime, Detail )

    def add_diagnosis_notice(self, faultName, faultDescription, energy, alarmGrade= DiagnosisDataMethods.Grade.warning, bindPoints=[], timeInterval=None):
        rt = None
        try:
            if not self._pageId:
                self._pageId = self.get_page_id(self._subBuildingName)
            assert self._pageId is not None, 'pageId not found %s'%(self._subBuildingName)
            rt = DiagnosisDataMethods.add_diagnosis_notice(self._projId, self._buildingName, self._subBuildingName, self._pageId, faultName, faultDescription, energy, alarmGrade, bindPoints, timeInterval)
        except Exception as e:
            DiagnosisBase._Logger.writeLog('%s in %s:'%(get_current_func_name(), __name__[__name__.rfind('/')+1:])+e.__str__(),True)
        return rt

    def add_diagnosis_notice_multi(self, noticeList=[]):
        return DiagnosisDataMethods.add_diagnosis_notice_multi(self._projId, noticeList)

    def add_diagnosis_fault(self, userModifyTime, userFaultGrade, id, userFaultDelay, parentId, description, equipmentId, userEnable, points, name, defaultGrade):
        return DiagnosisDataMethods.add_diagnosis_fault(self._projId, userModifyTime, userFaultGrade, id, userFaultDelay, parentId, description, equipmentId, userEnable, points, name, defaultGrade)

    def add_diagnosis_fault_multi(self, faultList=[]):
        return DiagnosisDataMethods.add_diagnosis_fault_multi(self._projId, faultList)

    def add_diagnosis_equipment_multi(self, equipmentList=[]):
        return DiagnosisDataMethods.add_diagnosis_equipment_multi(self._projId, equipmentList)

    def add_diagnosis_zone_multi(self, zoneList=[]):
        return DiagnosisDataMethods.add_diagnosis_zone_multi(self._projId, zoneList)

    def update_fault_noticeId(self, dic={}):
        return DiagnosisDataMethods.update_fault_noticeId(self._projId, dic)

    def reset_diagnosis_table(self, suffix):
        return DiagnosisDataMethods.reset_diagnosis_table(self._projId, suffix)

    def init_all_diagnosis_tables(self):
        return DiagnosisDataMethods.init_all_diagnosis_tables(self._projId)

    def diagnosis_add_fault_to_kpi(self, faultId, faultMoney, kpiName1, kpiName2, kpiName3):
        return DiagnosisDataMethods.diagnosis_add_fault_to_kpi(self._projId, faultId, faultMoney, kpiName1, kpiName2, kpiName3)

    def get_pageId_by_pageName_from_s3db(self, pageName):
        rt = None
        try:
            url = 'http://%s/s3db/get_pageid_by_name/%s/%s'%(app.config['BEOPWEB_ADDR'], self._projId, pageName)
            r = requests.get(url, headers={'token': app.config.get('BEOPWEB_SECRET_TOKEN')})
            if r.status_code == 200:
                ret = json.loads(r.text)
                if ret:
                    arr = ret.get('pageid', [])
                    if arr:
                        temp = [x.get('id') for x in arr]
                        if len(temp) >= 1:
                            rt = temp[0]
        except Exception as e:
            DiagnosisBase._Logger.writeLog('%s in %s:'%(get_current_func_name(), __name__[__name__.rfind('/')+1:])+e.__str__(),True)
        return rt

    def get_pageId_by_pageName_from_factory(self, pageName):
        rt = None
        try:
             rt = mongo_operator.get_page_id_by_name(self._projId, pageName)
        except Exception as e:
            DiagnosisBase._Logger.writeLog('%s in %s:'%(get_current_func_name(), __name__[__name__.rfind('/')+1:])+e.__str__(),True)
        return rt

    def get_page_id(self, pageName):
        rt = None
        try:
            rt = self.get_pageId_by_pageName_from_factory(pageName)
            if not rt:
                rt = self.get_pageId_by_pageName_from_s3db(pageName)
        except Exception as e:
            DiagnosisBase._Logger.writeLog('%s in %s:'%(get_current_func_name(), __name__[__name__.rfind('/')+1:])+e.__str__(),True)
        return rt

    @staticmethod
    def send_message_by_email(userIdList, strSubject, strContent):
        if len(userIdList)>0 and isinstance(userIdList[0], int):
            return DiagnosisDataMethods.send_message_by_email(userIdList, strSubject, strContent)
        elif  len(userIdList)>0 and isinstance(userIdList[0], str) and userIdList[0].find('@')>0:
            return DiagnosisDataMethods.send_message_by_email_by_name(userIdList, strSubject, strContent)

    @staticmethod
    def send_message_by_app(userIdList, strSubject, strContent):
        return DiagnosisDataMethods.send_message_by_app(userIdList, strSubject, strContent)

    @staticmethod
    def send_message_by_mobile(userIdList, strContent):
        return DiagnosisDataMethods.send_message_by_mobile(userIdList, strContent)

    @staticmethod
    def send_message_by_phonenum(phoneNumList, strContent):
        return DiagnosisDataMethods.send_message_by_mobile_number(phoneNumList, strContent)

    def send_alarm_simple(self, strAlarmName, strAlarmDetail):
        return self.add_diagnosis_notice(strAlarmName, strAlarmDetail, 0)