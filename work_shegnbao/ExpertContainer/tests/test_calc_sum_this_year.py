#coding=utf-8
__author__ = 'angelia'

from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest

@pytest.mark.p0
@pytest.mark.parametrize(("projId", "actTime", "pointName", "expected"), [
    (72, datetime.strptime('2017-02-02 13:00:00', '%Y-%m-%d %H:%M:%S'), "ChAMPS01", 4748.4),
    (72, datetime.strptime('2016-02-02 13:00:00', '%Y-%m-%d %H:%M:%S'), "ChAMPS01", None),
])
def test_calc_sum_this_year(projId, actTime, pointName, expected):
    lb = LogicBase(projId, actTime)
    if lb:
        rt = lb.calc_sum_this_year(projId, pointName, 2)
        if expected is None:
            assert rt == expected, "calc sum of this year is None,but got %s"%(rt,)
        else:
            assert rt == expected, "calc sun of this year:actual result is %s, which differs from expected %s"%(rt, expected)
    else:
        assert False, "failed to connect logic base"