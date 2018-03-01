#coding=utf-8
from tests.utils import *
from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest


@pytest.mark.p0
@pytest.mark.parametrize(('projId','expected'),[
    (72,None),
    (49,238897),
])
def test_filter_point_only_increase(projId,expected):
    lb = LogicBase(projId,datetime.now())
    assert lb, "create instance failed"
    rt = lb.get_fault_notice_count()
    if expected is not None:
        assert rt>=expected,'not equal,actutal={0},expected={1}'.format(rt,expected)
    else:
        assert rt is None,'acutal is {0}'.format(rt)


