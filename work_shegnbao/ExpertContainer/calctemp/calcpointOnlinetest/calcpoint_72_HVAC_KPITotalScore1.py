# -*- encoding=utf-8 -*-
from ExpertContainer.logic.LogicBase import *
from ExpertContainer.api.ArchiveManager import ArchiveManager
from ExpertContainer.api.globalMapping import *
from ExpertContainer.api.cacheProfile import DataManager
from ExpertContainer.api.errorLog import errorLog
_logger = LogOperator()

class LogicAct(LogicBase):

    def actlogic(self):
        rt = None
        try:
            rt = self.action()
        except Exception as e:
            errorLog.writeLog(72,'%s in %s:'%(get_current_func_name(), __name__[__name__.rfind('/')+1:])+e.__str__(),True)
            rt = None

        return rt

    def HVAC_KPITotalScore1(self):
        def main():
            try:
                pointlist = ['Ti13_MR','Ti11_MR','Ti10_MR','Ti9_MR','Ti8_MR','Ti7_MR','IceTankRatio_svr_MR','RealTimeCoolingCOP_svr_MR','BaseChillerSysCOP_sec_svr_MR','ChApprCondTemp_svr_MR','ChApprEvapTemp_svr_MR','AverageChAMPS_svr_MR','Pi_P_MR','MeetRoom_VIPCO2_MR','MeetRoom_NorCO2_MR','VAV_RoomTemp_MR']
                d = self.get_data(72,pointlist)
                self.log_str(str(d))
                s = 0
                for i in range(len(pointlist)):
                    if d[i]>80:
                        s+=1
                return s/0.16
            except Exception as e:
                errorLog.writeLog(72,':'+e.__str__(),True,'')
                self.log_str('%s'%(e.__str__(),))
                return None, e.__str__()
        return main()

    def action(self):
        rt = None
        try:
            self.curCalName = 'HVAC_KPITotalScore1'
            temp = self.HVAC_KPITotalScore1()
            if temp is not None and not isinstance(temp, tuple):
                rt = temp
                self.cacheManager.write_cache( self.get_act_time().strftime(standard_time_format), 'HVAC_KPITotalScore1', temp)
            elif isinstance(temp, tuple):
                rt = None 
                self.debugInfo.append('ERROR when calculating HVAC_KPITotalScore1 ' + temp[1])
            self.log_str('finally calculate point HVAC_KPITotalScore1, got result: %s'%(str(temp)))
            return rt, self.debugInfo
        except Exception as e:
            errorLog.writeLog(72,'%s in %s:'%(get_current_func_name(), __name__[__name__.rfind('/')+1:])+e.__str__(),True)
            self.log_str('%s'%(e.__str__(),))
            rt = False
        return rt, self.debugInfo

