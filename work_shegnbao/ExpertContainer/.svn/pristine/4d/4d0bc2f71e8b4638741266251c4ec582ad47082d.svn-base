#coding=utf-8
__author__ = 'angelia'

from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest
from tests.utils import *

@pytest.mark.p0
@pytest.mark.parametrize(("projId", "actTime", "pointName", "expected"), [
    (72, datetime.strptime('2018-02-02 13:00:00', '%Y-%m-%d %H:%M:%S'), "ChAMPS02", 32567.7),
    (72, datetime.strptime('2017-02-02 13:00:00', '%Y-%m-%d %H:%M:%S'), "ChAMPS02", 0),
    (72, datetime.strptime('2017-02-02 13:00:00', '%Y-%m-%d %H:%M:%S'), "ChAMPS03", None),
])
def test_calc_sum_last_year(projId, actTime, pointName, expected):
    lb = LogicBase(projId, actTime)
    if lb:
        rt = lb.calc_sum_last_year(projId, pointName, 1)
        if expected is None:
            assert rt == expected, "calc sum of this year is None,but got %s"%(rt,)
        else:
            assert almost_equals(expected, rt), "calc sun of this year:actual result is %s, which differs from expected %s"%(rt, expected)
    else:
        assert False, "failed to connect logic base"