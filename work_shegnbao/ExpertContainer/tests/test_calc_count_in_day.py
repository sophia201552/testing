#coding=utf-8
from tests.utils import *
from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest

@pytest.mark.p0
@pytest.mark.parametrize(("projId", "actTime", "pointName", "hours", "expected"), [
    (194, datetime(year=2017, month=12, day=4, hour=2, minute=0, second=0), "CWPOnOff03", -1, 0),
    (194, datetime(year=2017, month=12, day=4, hour=2, minute=0, second=0), "CWPOnOff05", -1, 0),
    (194, datetime(year=2017, month=12, day=4, hour=12, minute=0, second=0), "CWPOnOff04", -1, 0),
    (194, datetime(year=2017, month=12, day=4, hour=10, minute=0, second=0), "CWPOnOff02", -1, 0),
    (194, datetime(year=2017, month=12, day=4, hour=1, minute=0, second=0), "CWPOnOff03", -1, 1),
(194, datetime(year=2017, month=1, day=4, hour=9, minute=0, second=0), "CWPOnOff01", -1, 0)
])
def test_calc_count_in_day(projId, actTime, pointName, hours, expected):
    lb = LogicBase(projId, actTime)
    rt = lb.calc_count_in_day(projId, pointName, 'm5', hours)
    if expected is None:
        assert rt == expected, "count in day should be None, but get %s"%(rt,)
    else:
        assert almost_equals(expected, rt), "not equal, expected is %s, actual is %s"%(expected, rt)