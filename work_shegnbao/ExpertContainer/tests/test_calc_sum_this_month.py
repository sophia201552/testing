#coding=utf-8
from tests.utils import *
from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest

testdata=[
    (72, 'A11AHU_A_11_TempSaIn',1/12.0, 'h1',1308.3708333333343),
    (72, 'A11AHU_A_11_TempSaIn',1/12.0, 'd1',63.20916666666666),
    (72, 'A11AHU_A_11_TempSaIn',1/12.0, 'm5',None),
    (-1, 'A11AHU_A_11_TempSaIn',1/12.0, 'd1',None),
]
@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointName', 'constant', 'timeFormat','expected'),testdata)
def test_calc_sum_year(projId, pointName, constant, timeFormat,expected):
    lb = LogicBase(projId, datetime(year=2017,month=8,day=31), nMode = LogicBase.REPAIR_HISTORY)
    assert lb, "create instance failed"
    rt = lb.calc_sum_this_month(projId, pointName, constant, timeFormat)
    if expected is None:
        assert rt == expected, "calc_sum_this_month should be None, but get %s"%(rt,)
    else:
        assert almost_equals(expected, rt), "not equal, expected is %s, actual is %s"%(expected, rt)


