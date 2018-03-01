#coding=utf-8
__author__ = 'angelia'

import pytest
import datetime
from ExpertContainer.logic.LogicBase import LogicBase

test_time = [datetime.datetime(year=2017, month=11, day=20, hour=10, minute = 12, second = 12),
             datetime.datetime(year=2017, month=11, day=21),
             datetime.datetime(year=2017, month=11, day=21, hour=10),
             datetime.datetime(year=2017, month=11, day=21, hour=10, minute = 10, second = 12),
             datetime.datetime(year=2017, month=11, day=21, hour=10, minute = 12, second = 12),
             datetime.datetime(year=2017, month=8, day=1, hour=10, minute = 12, second = 12),

             ]
@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointName', 'timeFormat', 'acttime','expected'),[
    (72,'Day_Load','m1',test_time[3], 13.487052185),
    (72,'Day_Load','m5',test_time[4], 13.487052185),
    (72,'Day_Load','h1',test_time[2], 13.524407880),
    (72,'Day_Load','d1',test_time[1], 5.42111206),
    (72,'Day_Load','d1',test_time[0], None),
    (72,'Day_Load','d1',test_time[5], None),
    (72,'base_freeze_pump_3_fault','d1',test_time[1], 0),
])
def test_calc_compare_same_time_diff_day(projId, pointName, timeFormat, acttime,expected):
    lb = LogicBase(projId, acttime ,nMode = LogicBase.REPAIR_HISTORY)
    if lb:
        rt = lb.calc_compare_same_time_diff_day(projId, pointName, timeFormat)
        if expected is None and rt is None :
            return
        else:
            assert abs(rt - expected) <= 0.00001, 'actual calc subtraction given time is %s,which differs from expected %s' %(rt, expected)
    else:
        assert False, 'create instance failed'


