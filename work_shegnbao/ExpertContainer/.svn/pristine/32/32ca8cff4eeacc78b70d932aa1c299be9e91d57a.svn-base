# -*- encoding=utf-8 -*-
__author__ = 'yan'

import threading
from ExpertContainer.api.utils import *
from ExpertContainer.dbAccess import mongo_operator

class MakeDiagnosisFileTimer(threading.Thread):

    _logger = LogOperator()

    def __init__(self, name, format, interval=60):
        threading.Thread.__init__(self)
        self.format = format
        self.name = name
        self.interval = interval
        self.last_act_time = None

    def run(self):
        while True:
            try:
                do = False
                now_time = datetime.now()
                if (not self.last_act_time) or (now_time - self.last_act_time).total_seconds() >= self.interval:
                    if self.format == 'm1':
                        do = True
                    if self.format == 'm5':
                        if now_time.minute % 5 == 0:
                            do = True
                    elif self.format == 'h1':
                        if now_time.minute == 0:
                            do = True
                    elif self.format == 'd1':
                        if now_time.hour == 0 and now_time.minute == 0:
                            do = True
                    if do:
                        try:
                            if mongo_operator.make_diagnosis_py_file(self.format):
                                file_list = get_diagnosis_files_by_format(self.format)
                                for moduleName in file_list:
                                    module_name = moduleName[:moduleName.rfind('.py')]
                                    work_path = get_current_directory()
                                    calcpoint_path = add_dir_to_path(work_path, 'diagnosis')
                                    mod = load_module_dynamic(module_name, add_dir_to_path(calcpoint_path, self.format))
                                    if mod:
                                        ins = None
                                        attr = getattr(mod, 'LogicAct')
                                        if attr:
                                            ins = attr(datetime.now(), self.format)
                                            ins.before_actlogic()
                                            ins.actlogic()
                                            ins.after_actlogic()
                                            if ins:
                                                del ins
                                            if module_name in sys.modules:
                                                sys.modules.pop(module_name)
                                            if os.path.exists(moduleName):
                                                os.remove(moduleName)
                        except Exception as e:
                            MakeDiagnosisFileTimer._logger.writeLog('%s-%s:'%(self.getName(), get_current_func_name())+e.__str__(), True)
                        self.last_act_time = now_time
                time.sleep(1)
            except Exception as e:
                MakeDiagnosisFileTimer._logger.writeLog('%s:'%(get_current_func_name())+e.__str__(), True)


