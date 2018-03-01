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
            errorLog.writeLog(49,'%s in %s:'%(get_current_func_name(), __name__[__name__.rfind('/')+1:])+e.__str__(),True)
            rt = None

        return rt

    def copy_realdata_test1(self):
        def main():
            try:
                return self.get_data(49,'copy_realdata_test')+20000
            except Exception as e:
                errorLog.writeLog(49,':'+e.__str__(),True,'')
                self.log_str('%s'%(e.__str__(),))
                return None, e.__str__()
        return main()

    def copy_realdata_test(self):
        def main():
            try:
                return self.get_data(49,'H14AHU_H_14_TempSaIn') + self.get_data(49,'H14AHU_H_14_VlvColdReg')
            except Exception as e:
                errorLog.writeLog(49,':'+e.__str__(),True,'')
                self.log_str('%s'%(e.__str__(),))
                return None, e.__str__()
        return main()

    def action(self):
        rt = None
        try:
            self.curCalName = 'copy_realdata_test'
            temp = self.copy_realdata_test()
            if temp is not None and not isinstance(temp, tuple):
                rt = temp
                self.cacheManager.write_cache( self.get_act_time().strftime(standard_time_format), 'copy_realdata_test', temp)
            elif isinstance(temp, tuple):
                rt = None 
                self.debugInfo.append('ERROR when calculating copy_realdata_test ' + temp[1])
            self.curCalName = 'copy_realdata_test1'
            temp = self.copy_realdata_test1()
            if temp is not None and not isinstance(temp, tuple):
                rt = temp
                self.cacheManager.write_cache( self.get_act_time().strftime(standard_time_format), 'copy_realdata_test1', temp)
            elif isinstance(temp, tuple):
                rt = None 
                self.debugInfo.append('ERROR when calculating copy_realdata_test1 ' + temp[1])
            self.log_str('finally calculate point copy_realdata_test1, got result: %s'%(str(temp)))
            return rt, self.debugInfo
        except Exception as e:
            errorLog.writeLog(49,'%s in %s:'%(get_current_func_name(), __name__[__name__.rfind('/')+1:])+e.__str__(),True)
            self.log_str('%s'%(e.__str__(),))
            rt = False
        return rt, self.debugInfo

