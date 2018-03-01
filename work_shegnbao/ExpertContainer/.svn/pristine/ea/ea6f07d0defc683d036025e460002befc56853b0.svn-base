import os
import sys
from datetime import datetime
from ExpertContainer.api.utils import add_head_strategy
from ExpertContainer.api.utils import add_body_strategy
from ExpertContainer.api.utils import add_action_strategy
from ExpertContainer.api.utils import get_strategy_file_path
from ExpertContainer.api.utils import get_current_func_name
from ExpertContainer.api.LogOperator import LogOperatorStrategy
from ExpertContainer.api.cacheProfile import DataManager
from ExpertContainer.dbAccess import mongo_operator
from ExpertContainer.logic.LogicBase import LogicBase
import re
class StrategyFile(object):

    @classmethod
    def beautyCode(cls, code):
        lines = code.split('\n')
        new_lines = []
        for line in lines:
            if line.find('@') != -1:
                #此处是云点
                com = re.compile(r'@(\d+)\|')
                cloud = re.findall(com, line)
                if cloud:
                    for i in cloud:
                        line = line.replace('@%s|' % i, '')
            new_lines.append(line)
        return '\n'.join(new_lines)


    @classmethod
    def generate_file_strategy(cls, projId, item_name, module_name, code, input=None, output=None):
        filename = 'strategy_' + item_name + '.py'
        try:
            path = get_strategy_file_path()
            add_head_strategy(os.path.join(path, filename))
            add_body_strategy(os.path.join(path, filename), code, module_name, projId)
            add_action_strategy(os.path.join(path, filename), [module_name])
        except Exception as e:
            LogOperatorStrategy().writeLog('%s:' % (
                get_current_func_name()) + e.__str__(), True)
            return False
        return True

    @classmethod
    def run_bak(cls, projId, strategy_id):
        import_string = 'strategy_execute_file.strategy_' + strategy_id
        __import__(import_string)
        ins = None
        attr = getattr(sys.modules[import_string], 'LogicAct')
        if attr:
            ins = attr(projId, datetime.now(), None, LogicBase.ONLINE_TEST_REALTIME)  # todo
        else:
            raise Exception('Load module %s failed' % (import_string,))
        result = ins.actlogic()
        if import_string in sys.modules:
            sys.modules.pop(import_string)
        if ins:
            del ins
        return result

    @classmethod
    def run(cls, projId, strategy_id):
        import_string = 'strategy_execute_file.strategy_' + strategy_id
        __import__(import_string)
        ins = None
        attr = getattr(sys.modules[import_string], 'LogicAct')
        if attr:
            ins = attr(projId, datetime.now(), None, LogicBase.REALTIME)  # todo
            allSitePointsValues = DataManager.set_realdata_flag_0(projId)  # todo
            cloudSitePointsAll = mongo_operator.getCloudPointSiteType(projId)  # todo
            ins.initCloudSitePoints(cloudSitePointsAll)
            ins.initDataCacheByValueLists(allSitePointsValues)
        else:
            raise Exception('Load module %s failed' % (import_string,))
        ins.before_actlogic_diagnosis()
        rv = ins.actlogic()
        ins.after_actlogic()
        if import_string in sys.modules:
            sys.modules.pop(import_string)
        if ins:
            del ins
        return rv