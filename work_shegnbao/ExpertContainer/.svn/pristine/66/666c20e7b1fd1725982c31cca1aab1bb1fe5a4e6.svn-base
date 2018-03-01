#coding=utf-8
from tests.utils import *
from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest

testdata=[
    (72, 'A11AHU_A_11_TempSaIn',1/12.0, 2016,509.65500000000094),
    (72, 'A11AHU_A_11_TempSaIn1',1/12.0, 2016,None),
    (-1, 'A11AHU_A_11_TempSaIn',1/12.0, 2016,None),
]
@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointName', 'constant', 'iyear','expected'),testdata)
def test_calc_sum_year(projId, pointName, constant, iyear,expected):
    lb = LogicBase(projId, datetime.now(), nMode = LogicBase.REPAIR_HISTORY)
    assert lb, "create instance failed"
    rt = lb.calc_sum_year(projId, pointName, constant, iyear)
    if expected is None:
        assert rt == expected, "sum_year should be None, but get %s"%(rt,)
    else:
        assert almost_equals(expected, rt), "not equal, expected is %s, actual is %s"%(expected, rt)


