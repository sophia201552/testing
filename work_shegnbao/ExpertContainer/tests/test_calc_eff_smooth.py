#coding=utf-8
__author__ = 'angelia'

import pytest
import datetime
from ExpertContainer.logic.LogicBase import LogicBase

test_time = [datetime.datetime(year=2017, month=11, day=20, hour=10),
             datetime.datetime(year=2017, month=11, day=21, hour=10),
             datetime.datetime(year=2017, month=11, day=21)
             ]
@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'LoadPointName', 'powerPointName', 'strTime_late','expected'),[
    (72,'Day_Load','Day_Power',test_time[0], 1.674997),#11959.235833331943,   20031.679166667163
    (72,'Day_Load','Day_Power',test_time[1], 1.519117),#13576.651666667312    20624.525000002235
    (72,'Day_Load01','Day_Power',test_time[1], None),
    (72,'KPI_Ti7_score','Day_Power',test_time[2], None),
])
def test_calc_eff_smooth(projId, LoadPointName, powerPointName, strTime_late,expected):
    lb = LogicBase(projId,strTime_late ,nMode = LogicBase.REPAIR_HISTORY)
    if lb:
        rt = lb.calc_eff_smooth(projId, LoadPointName, powerPointName)
        if expected is None and rt is None :
            return
        else:
            assert abs(rt - expected) <= 0.001, 'actual calc subtraction given time is %s,which differs from expected %s' %(rt, expected)
    else:
        assert False, 'create instance failed'


