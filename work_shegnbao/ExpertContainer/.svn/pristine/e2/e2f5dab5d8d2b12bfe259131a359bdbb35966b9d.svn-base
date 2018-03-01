#coding=utf-8

from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from tests.utils import *


@pytest.mark.p0
@pytest.mark.parametrize(("projId", "actTime", "pointName", "expectedValue","timeFormat"), [
    (72, datetime(year=2017, month=7, day=18, hour=18, minute=40, second=30), "ChAMPS01", 448.6, 'm1'),
    (72, datetime(year=2017, month=7, day=19, hour=18, minute=40, second=30), "ChAMPS01", 99.7, 'm1',),
    (72, datetime(year=2017, month=7, day=20, hour=18, minute=40, second=30), "ChAMPS01", 96.4, 'm1'),
    (72, datetime(year=2017, month=7, day=21, hour=18, minute=40, second=30), "ChAMPS01", 94.8, 'm1'),
    (72, datetime(year=2017, month=7, day=18, hour=19, minute=40, second=30), "ChAMPS01", 94.8, 'm5'),
    (72, datetime(year=2017, month=7, day=19, hour=19, minute=40, second=30), "ChAMPS01", 97.3, 'm5',),
    (72, datetime(year=2017, month=7, day=20, hour=19, minute=40, second=30), "ChAMPS01", 94.7, 'm5'),
    (72, datetime(year=2017, month=7, day=21, hour=19, minute=40, second=30), "ChAMPS01", 94.6, 'm5'),
    (72, datetime(year=2017, month=7, day=18, hour=20, minute=40, second=30), "ChAMPS01", 94.0, 'h1'),
    (72, datetime(year=2017, month=7, day=19, hour=20, minute=40, second=30), "ChAMPS01", 94.5, 'h1',),
    (72, datetime(year=2017, month=7, day=20, hour=20, minute=40, second=30), "ChAMPS01", 93.6, 'h1'),
    (72, datetime(year=2017, month=7, day=21, hour=20, minute=40, second=30), "ChAMPS01", 94.3, 'h1'),
    (72, datetime(year=2017, month=7, day=18, hour=21, minute=40, second=30), "ChAMPS99", None, 'm1'),
    (72, datetime(year=2017, month=7, day=19, hour=22, minute=40, second=30), "ChAMPS99", None, 'm5',),
    (72, datetime(year=2017, month=7, day=20, hour=23, minute=40, second=30), "ChAMPS99", None, 'h1'),
])
def test_calc_max_in_day(projId, actTime, pointName, expectedValue, timeFormat):
    lb = LogicBase(projId, actTime)
    rt = lb.calc_max_in_day(projId, pointName, timeFormat)
    if expectedValue is None:
        assert rt == expectedValue, "max in day should be None, but get %s"%(rt,)
    else:
        assert almost_equals(expectedValue, rt), "not equal, expected is %s, actual is %s"%(expectedValue, rt)

