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

    def diagnosis_test(self):
        def main():
            try:
                if self.get_data(49,'A11AHU_A_11_PressSaOut') > 0:
                    return True
                else:
                    return False
                return None
            except Exception as e:
                errorLog.writeLog(49,'diagnosis_test:'+e.__str__(),True,'diagnosis_test')
                self.log_str('%s'%(e.__str__(),))
                return None, e.__str__()
        return main()

    def action(self):
        rt = True
        try:
            name_list=[]
            value_list=[]
            timeAct_list=[]
            timeCost_list=[]
            tStart = time.time()
            tTimeAct = datetime.now()
            self.curCalName = 'diagnosis_test'
            temp = self.diagnosis_test()
            if isinstance(temp, tuple):
                self.log_str(temp[1])
            name_list.append('diagnosis_test')
            value_list.append(temp[0] if isinstance(temp,tuple) else temp)
            timeCost_list.append(round(time.time()-tStart,1))
            timeAct_list.append(tTimeAct)
            if name_list and value_list:
                self.save_fault_result(49, name_list, value_list,timeAct_list, timeCost_list)
        except Exception as e:
            errorLog.writeLog(49,'%s in %s:'%(get_current_func_name(), __name__[__name__.rfind('/')+1:])+e.__str__(),True)
            self.log_str('%s'%(e.__str__(),))
            rt = False
        return rt, self.debugInfo

