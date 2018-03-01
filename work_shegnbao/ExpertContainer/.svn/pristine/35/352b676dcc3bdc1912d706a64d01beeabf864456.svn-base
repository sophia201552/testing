#coding=utf-8

from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from tests.utils import *

@pytest.mark.p0
@pytest.mark.parametrize(("projId", "actTime", "pointName", "nMode", "expected"), [
    (72, datetime(year=2017, month=8, day=2, hour=13, minute=0, second=0), "VAV_A_11_03_RoomTemp_realdr", LogicBase.REPAIR_HISTORY, 15700),
    (72, datetime(year=2017, month=8, day=2, hour=12, minute=55, second=0), "VAV_A_11_03_RoomTemp_realdr", LogicBase.REPAIR_HISTORY, 15600),
    (72, datetime(year=2017, month=8, day=2, hour=12, minute=50, second=0), "VAV_A_11_03_RoomTemp_realdr", LogicBase.REPAIR_HISTORY, 15500),
    (72, datetime(year=2017, month=8, day=2, hour=12, minute=45, second=0), "VAV_A_11_03_RoomTemp_realdr", LogicBase.REPAIR_HISTORY, 15400),
    (72, datetime(year=2017, month=8, day=1, hour=13, minute=0, second=0), "VAV_A_11_03_RoomTemp_realdr", LogicBase.REPAIR_HISTORY, None),
])
def test_calc_sum_day(projId, actTime, pointName, nMode, expected):
    lb = LogicBase(projId, actTime, nMode=nMode)
    rt = lb.calc_sum_day(projId, pointName, 1, 'm5')
    if expected is None:
        assert rt == expected, "sum day should be None, but get %s"%(rt,)
    else:
        assert almost_equals(expected, rt), "not equal, expected is %s, actual is %s"%(expected, rt)