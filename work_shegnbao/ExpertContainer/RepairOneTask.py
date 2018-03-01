# -*- encoding=utf-8 -*-

from ExpertContainer.api.utils import *
from ExpertContainer.dbAccess import mongo_operator
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from ExpertContainer.api.ArchiveManager import ArchiveManager
from ExpertContainer.logic.LogicBase import LogicBase
from ExpertContainer.dbAccess.MongoConnManager import MongoConnManager

__author__ = 'Administrator'


class RepairTask:
    def __init__(self, strProjectId, strCalcObjId):
        self.nameList = []
        self.total = -1
        self.cur_num = -1
        self.percent = '0%'
        self.strProjectId = strProjectId
        self.strCalcObjId = strCalcObjId
        self.timeFrom = None
        self.timeTo = None
        self.strTimeFormat = ''
        self.timeActStart = None
        self.strUserId = ''
        self.strUserName = ''
        self.repairInfo = {}
        self.bInited = False
        self.initRepairInfoFromRedis()

    def __str__(self):
        return '{' + ', '.join(['%s=%s' % item for item in self.__dict__.items()]) + '}'

    def initRepairInfoFromRedis(self,):
        repairInfo = ArchiveManager.get_repair_info(self.strProjectId, self.strCalcObjId)
        if repairInfo:
            self.nameList = repairInfo.get('point_list')
            self.cur_num = repairInfo.get('cur_num')
            self.total = repairInfo.get('total')
            self.timeFrom = repairInfo.get('time_from')
            self.timeTo = repairInfo.get('time_to')
            self.timeActStart = repairInfo.get('act_start')
            self.strTimeFormat = repairInfo.get('format')
            self.strUserName = repairInfo.get('user_name')
            self.strUserId = repairInfo.get('user_id')
            self.bInited = True
        else:
            logging.error('init failed for key not exist(%s, %s)', self.strProjectId, self.strCalcObjId)

    def dealOneRepairTask(self,):
        if not self.bInited:
            logging.warning('The task object has not been initialized yet.')
            return False
        try:
            rt = False
            if not self.nameList:   # is nameList is None , then patch all calculation points for this project
                logging.info('nameList not provided. Repair all calculation points!')
                self.nameList = mongo_operator.get_point_list_by_project_id(self.strProjectId)
            timeFromObj = datetime.strptime(self.timeFrom, standard_time_format)
            timeToObj = datetime.strptime(self.timeTo, standard_time_format)
            content_dic = mongo_operator.get_content_by_name_list(self.nameList, self.strProjectId)
            if content_dic:
                logging.info('Content found from data source!')
                r, msg, obid = mongo_operator.make_repairhistory_py_file(
                    content_dic, int(self.strProjectId), self.strCalcObjId)
                if r:
                    logging.info('Repair history py file made: obid=%s, msg=%s', obid, msg)
                    timelist = get_timelist_by_time_range(timeFromObj, timeToObj, self.strTimeFormat)
                    if timelist:
                        module_name = "calcpoint_%s_%s" % (self.strProjectId, self.strCalcObjId)
                        self.runRepair(module_name, timelist)
                        logging.info('dealOneRepairTask finished successfully! %s', self)
                        return True
                    else:
                        logging.info('Timelist is none! %s', msg)
                        rt = False
                else:
                    logging.error('Failed to repair history py file!')
            else:
                logging.error('Cannot find content in datasource!')
                rt = False
        except:
            logging.error('Failed to repair %s!', self, exc_info=True, stack_info=True)
            rt = False
        return rt

    def runRepair(self, strModuleName, timelist):
        path = None
        import_string = 'calctemp.repairhistory.%s' % strModuleName
        try:
            path = get_repairhistory_path() + "/" + strModuleName
            if path not in sys.modules:
                __import__(import_string)
            the_module = sys.modules[import_string]
            if the_module:
                attr = getattr(the_module, 'LogicAct', 2)  # from mongo data
                if attr:
                    bQuitByCanceled = False
                    # add mongo instance first, by golding
                    conMongodb = MongoConnManager.getHisConnTuple(self.strProjectId)
                    collectionName = BEOPDataAccess.getInstance().GetCollectionNameById(int(self.strProjectId))
                    # get cloud sitepoint maps
                    cloudSitePointsAll = mongo_operator.getCloudPointSiteType(self.strProjectId)

                    nxx = 0
                    nxxLength = len(timelist)
                    for timepoint in timelist:
                        nxx += 1
                        timepoint_processed = False
                        for i in range(0, 5):
                            try:
                                bCanceled = ArchiveManager.get_repair_is_canceled(self.strProjectId, self.strCalcObjId)
                                if bCanceled:
                                    if os.path.exists(path+'.py'):
                                        os.remove(path+'.py')
                                    if import_string in sys.modules:
                                        sys.modules.pop(import_string)
                                    bQuitByCanceled = True
                                    logging.info('canceled by user')
                                    break

                                ins = attr(self.strProjectId, timepoint, None, LogicBase.REPAIR_HISTORY)
                                ins.set_obid(self.strCalcObjId)
                                ins.set_mongo_conn(conMongodb, collectionName)
                                t1 = datetime.now()

                                ins.initCloudSitePoints(cloudSitePointsAll)
                                ins.before_actlogic()
                                ins.actlogic()
                                tdelta = datetime.now()-t1
                                logging.info('%s finished(%d/%d),cost %d seconds',
                                            self.strProjectId, nxx, nxxLength, int(tdelta.total_seconds()))
                                ins.after_actlogic()
                                num = ArchiveManager.step_repair(self.strProjectId, self.strCalcObjId, self.total)
                                if ins:
                                    del ins
                                if num == self.total:
                                    if os.path.exists(path+'.py'):
                                        os.remove(path+'.py')
                                    if import_string in sys.modules:
                                        sys.modules.pop(import_string)
                                timepoint_processed = True
                            except:
                                logging.error(
                                    "Unhandled exception while processing %s - %s. Retry after 3 seconds...",
                                    strModuleName, timepoint, exc_info=True, stack_info=True)
                            if timepoint_processed:
                                break
                            time.sleep(3)
                        if bQuitByCanceled:
                            break
                        if not timepoint_processed:
                            logging.error("Failed to process %s - %s after retries. Skip", strModuleName, timepoint)

                    if bQuitByCanceled:
                        ArchiveManager.step_repair_finish(self.strProjectId, self.strCalcObjId, 0)
                    else:
                        ArchiveManager.step_repair_finish(self.strProjectId, self.strCalcObjId, 1)
        except Exception:
            logging.error('Unhandled exception in RepairCalc process.', exc_info=True, stack_info=True)
            if path is not None and os.path.exists(path + '.py'):
                os.remove(path + '.py')
            if import_string in sys.modules:
                sys.modules.pop(import_string)


if __name__ == '__main__':
    logging.info('Repair task started: %s', sys.argv)
    if len(sys.argv) == 3:
        taskobj = RepairTask(sys.argv[1], sys.argv[2])
        logging.info('RepairTask intialized: %s', taskobj)
        taskobj.dealOneRepairTask()
        logging.info('RepairTask ended successfully.')
    else:
        logging.error('Missing arguments! At least 2 arguments needed!')
