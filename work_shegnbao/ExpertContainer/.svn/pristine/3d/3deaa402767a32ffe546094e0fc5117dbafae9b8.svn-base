#coding=utf-8
__author__ = 'angelia'

import pytest
import datetime
from ExpertContainer.logic.LogicBase import LogicBase

test_time = [datetime.datetime(year=2017, month=11, day=20, hour=10),
             datetime.datetime(year=2017, month=11, day=21, hour=10)
             ]
@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointName', 'strTime_first', 'strTime_late','expected'),[
    (72,'A11AHU_A_11_TempSaIn','2017-11-20 10:00:00',test_time[1], 3.4299999999999997),
    (72,'A11AHU_A_11_TempSaIn','2017-11-20 10:00:00',test_time[0], 0),
    (72,'A11AHU_A_11_TempSaIn01','2017-11-20 10:00:00',test_time[1], None),
])
def test_calc_subtraction_for_given_time(projId, pointName,strTime_first,strTime_late,expected):
    lb = LogicBase(projId,strTime_late ,nMode = LogicBase.REPAIR_HISTORY)
    if lb:
        rt = lb.calc_subtraction_for_given_time(projId, pointName, strTime_first)
        if expected is None and rt is None :
            return
        else:
            assert rt == expected, "actual calc subtraction given time is %s,which differs from expected %s" %(rt, expected)
    else:
        assert False, "create instance failed"


