from bson import ObjectId
from ExpertContainer.api.utils import *
from ExpertContainer.dbAccess import mongo_operator
from ExpertContainer.mod_log.FileLogger import FileLogger
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from ExpertContainer.api.ArchiveManager import ArchiveManager
from ExpertContainer.dbAccess.MongoConnManager import MongoConnManager
from ExpertContainer.logic.LogicBase import LogicBase
from ExpertContainer.dbAccess.RedisManager import RedisManager


class AutoRepairTask:
    def __init__(self, projId, timeFrom, timeTo, pointList):
        try:
            pointListStr = pointList.strip('\'[]')
            self.pointList = re.split('\,\s*', pointListStr)
            self.timeFrom = timeFrom
            self.timeTo = timeTo
            self.strProjectId = projId
            self.strCalcObjId = ObjectId().__str__()
            self.strTimeFormat = 'm5'
            self.id = ObjectId().__str__()
            autoRepairDict = ArchiveManager.getAutoRepairInfo()
            for i in range(1, app.config.get('AUTO_REPAIR_MAX_PROCESS_NUM') + 1):
                key = 'autoRepair' + str(i) + '_status'
                self._logger = FileLogger(key + '.log')
                if autoRepairDict.get(key) and autoRepairDict.get(key) == 'free':
                    self.strProcessName = key
                    dic = {"pointList": self.pointList, "timeFrom": self.timeFrom, "timeTo": self.timeTo}
                    ArchiveManager.writeAutoRepair(self.strProcessName, dic)
                    break
            print('*******************************' + self.strProcessName)

        except Exception as e:
            self._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), logging.ERROR)
            print(e.__str__())

    def dealOneAutoRepairTask(self):
        rt = True
        try:
            if self.pointList and self.timeFrom and self.timeTo and self.strProjectId:
                timeFromObj = datetime.strptime(self.timeFrom, standard_time_format)
                timeToObj = datetime.strptime(self.timeTo, standard_time_format)
                content_dic = mongo_operator.get_content_by_name_list(self.pointList, self.strProjectId)
                if content_dic:
                    r, msg, obid = mongo_operator.make_repairhistory_py_file(content_dic, int(self.strProjectId),
                                                                             self.strCalcObjId)
                    if r:
                        timelist = get_timelist_by_time_range(timeFromObj, timeToObj, self.strTimeFormat)
                        if timelist:
                            module_name = "calcpoint_%s_%s" % (self.strProjectId, self.strCalcObjId)

                            if timelist:
                                self.runRepair(module_name, timelist)

                                self._logger.writeLog('repair:%s,projid:%s,timerange:[%s-%s],timeformat:%s' % (
                                    str(self.pointList), self.strProjectId, self.timeFrom, self.timeTo,
                                    self.strTimeFormat), logging.INFO)
                            return True
                        else:
                            self._logger.writeLog(msg, logging.ERROR)
                            rt = False
                else:
                    strErr = "can't find content in datasource,please check"
                    self._logger.writeLog(strErr, logging.ERROR)
                    rt = False

        except Exception as e:
            self._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), logging.ERROR)
            print(e.__str__())
            rt = False
        return rt

    def runRepair(self, strModuleName, timelist):
        try:
            import_string = 'calctemp.repairhistory.%s' % (strModuleName)
            path = get_repairhistory_path() + "/" + strModuleName
            if not path in sys.modules:
                __import__(import_string)
            module = sys.modules[import_string]
            if module:
                attr = getattr(module, 'LogicAct', 2)  # from mongo data
                if attr:
                    conMongodb = MongoConnManager.getHisConnTuple(self.strProjectId)
                    collectionName = BEOPDataAccess.getInstance().GetCollectionNameById(int(self.strProjectId))
                    cloudSitePointsAll = mongo_operator.getCloudPointSiteType(
                        self.strProjectId)  # get cloud sitepoint maps

                    timeIndex = 0
                    timeLength = len(timelist)
                    for timepoint in timelist:
                        now_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                        RedisManager.set_autoRepair_heartbeat_time(self.strProcessName + 'heartbeat', now_time)
                        timeIndex += 1
                        ins = attr(self.strProjectId, timepoint, None, LogicBase.REPAIR_HISTORY)
                        ins.set_obid(self.strCalcObjId)
                        ins.set_mongo_conn(conMongodb, collectionName)
                        t1 = datetime.now()

                        ins.initCloudSitePoints(cloudSitePointsAll)
                        ins.before_actlogic()
                        ins.actlogic()
                        tdelta = datetime.now() - t1
                        print('%s finished(%d/%d),cost %d seconds' % (
                            self.strProjectId, timeIndex, timeLength, int(tdelta.total_seconds()),))
                        if int(tdelta.total_seconds()) >= 60 * 15:
                            self._logger.writeLog('Error: %s finished(%d/%d),cost %d seconds' % (
                                self.strProjectId, timeIndex, timeLength, int(tdelta.total_seconds())), logging.ERROR)
                        elif int(tdelta.total_seconds()) >= 30:
                            self._logger.writeLog('Warning: %s finished(%d/%d),cost %d seconds' % (
                                self.strProjectId, timeIndex, timeLength, int(tdelta.total_seconds())), logging.WARN)
                        ins.after_actlogic()
                        if ins:
                            del ins
                    ArchiveManager.clearAutoRepair(self.strProcessName)
                    if os.path.exists(path + '.py'):
                        os.remove(path + '.py')
                    if import_string in sys.modules:
                        sys.modules.pop(import_string)
        except Exception as e:
            ArchiveManager.clearAutoRepair(self.strProcessName)
            self._logger.writeLog('%s:' % (get_current_func_name()) + e.__str__(), logging.ERROR)
            if os.path.exists(path + '.py'):
                os.remove(path + '.py')
            if import_string in sys.modules:
                sys.modules.pop(import_string)


if __name__ == '__main__':
    if len(sys.argv) == 5:
        taskobj = AutoRepairTask(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
        taskobj.dealOneAutoRepairTask()
    else:
        print('args need be two: projId and calcObjId')
