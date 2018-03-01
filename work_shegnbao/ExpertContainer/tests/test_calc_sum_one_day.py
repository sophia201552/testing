#coding=utf-8

from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from tests.utils import *

@pytest.mark.p0
@pytest.mark.parametrize(("projId", "strTime", "pointName", "expected"), [
    (72, '2017-08-02 13:00:00', "VAV_A_11_03_RoomTemp_realdr", 28800.0),
    (72, '2017-08-01 13:00:00', "VAV_A_11_03_RoomTemp_realdr", None),
])
def test_calc_sum_one_day(projId, strTime, pointName, expected):
    lb = LogicBase(projId, datetime.now())
    rt = lb.calc_sum_one_day(projId, pointName, 1, 'm5', strTime)
    if expected is None:
        assert rt == expected, "sum one day should be None, but get %s"%(rt,)
    else:
        assert almost_equals(expected, rt), "not equal, expected is %s, actual is %s"%(expected, rt)