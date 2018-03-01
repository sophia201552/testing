#coding=utf-8
from tests.utils import *
from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest

@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointList', 'timeStr', 'expected'),[
    (72,['ChAMPS01', 'VAV_J_54_13_Air Flow'], '2017-08-01 00:00:00', [90.1, 42.14]),
    (72,['ChAMPS01', 'VAV_J_54_13_Air Flow'], '2017-07-01 00:00:00', [80.8, 40.26]),
    (72,['ChAMPS01', 'VAV_J_54_13_Air Flow'], '2017-07-02 00:05:00', [80.3, 40.72]),
    (72, ['ChAMPS01', 'VAV_J_54_13_Air Flow'], '2017-08-02 00:05:00', [87.3, 42.26]),
])
def test_get_data_at_time(projId, pointList, timeStr, expected):
    lb = LogicBase(projId, datetime.now())
    rt = lb.get_data_at_time(projId, pointList, timeStr)
    assert_equal_result(expected, rt)
