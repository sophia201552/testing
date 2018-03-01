#coding=utf-8
__author__ = 'angelia'

import pytest
from tests.utils import *
from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime

data_time = [datetime(year=2017, month=12, day=14, hour = 11),
             datetime(year=2017, month=12, day=14, hour = 10),
             ]

@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointName', 'acttime', 'expected'),[
     (49, ['test_last_hour'], data_time[0], 5.072),
     (49, ['test_last_hour'], data_time[1], 0.0),
     (49, ['test_last_hour','test_alarm'], data_time[0], 18.3498),
     (49, 1, data_time[1], None),
])
def test_calc_avg_of_last_hour_nozero(projId, pointName, acttime, expected):
    lb = LogicBase(projId, acttime, nMode = LogicBase.REPAIR_HISTORY)
    assert lb, "create instance failed"
    rt = lb.calc_avg_of_last_hour_nozero(projId, pointName)
    if expected is None and rt is None:
        assert expected == rt, 'actual result is %s,which differs from expected %s' %(rt, expected)
    else:
        assert almost_equals(expected, rt), 'actual result is %s,which differs from expected %s' %(rt, expected)


