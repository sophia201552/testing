#coding=utf-8

from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from tests.utils import *

@pytest.mark.p0
@pytest.mark.parametrize(("projId", "actTime", "pointName", "expected"), [
    (72, datetime.strptime('2017-08-08 13:00:00', '%Y-%m-%d %H:%M:%S'), "VAV_A_11_03_RoomTemp_realdr", 44500),
    (72, datetime.strptime('2017-08-16 13:00:00', '%Y-%m-%d %H:%M:%S'), "VAV_A_11_03_RoomTemp_realdr", 73000),
])
def test_calc_sum_this_week(projId, actTime, pointName, expected):
    #有些时刻的值竟然是0,注意是当前周，案例来说，应该是实时的时间
    lb = LogicBase(projId, actTime)
    rt = lb.calc_sum_this_week(projId, pointName, 1, 'm5')
    if expected is None:
        assert rt == expected, "sum this week should be None, but get %s"%(rt,)
    else:
        assert almost_equals(expected, rt), "not equal, expected is %s, actual is %s"%(expected, rt)