#coding=utf-8

from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from tests.utils import *

@pytest.mark.p0
@pytest.mark.parametrize(("projId", "actTime", "pointName", "expected"), [
    (72, datetime.strptime('2017-08-03 13:00:00', "%Y-%m-%d %H:%M:%S"), "VAV_A_11_03_RoomTemp_realdr", 28800.0),
    (72, datetime.strptime('2017-08-02 13:00:00', "%Y-%m-%d %H:%M:%S"), "VAV_A_11_03_RoomTemp_realdr", None),
])
def test_calc_sum_last_day(projId, actTime, pointName, expected):
    lb = LogicBase(projId, actTime)
    rt = lb.calc_sum_last_day(projId, pointName, 1, 'm5')
    if expected is None:
        assert rt == expected, "sum last day should be None, but get %s"%(rt,)
    else:
        assert almost_equals(expected, rt), "not equal, expected is %s, actual is %s"%(expected, rt)