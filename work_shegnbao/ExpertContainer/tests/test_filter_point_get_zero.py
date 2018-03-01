#coding=utf-8
from tests.utils import *
from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest


@pytest.mark.p0
@pytest.mark.parametrize(('projId','pointName','acttime','expected','mode'),[
    (72,'ChAMPS01',datetime(year=2017,month=11,day=11),None,LogicBase.ONLINE_TEST_REALTIME),
    (72, 'BaseChillerSysCOP_sec_svr', datetime(year=2017, month=11, day=11), 6.29,LogicBase.ONLINE_TEST_REALTIME),
    (72, 'BaseChillerSysCOP_sec_svr', datetime(year=2017, month=11, day=6,hour=16), 1.0,LogicBase.REPAIR_HISTORY),
])
def test_filter_point_gt_zero(projId,pointName,acttime,expected,mode):
    lb = LogicBase(projId,acttime ,nMode=mode)
    assert lb, "create instance failed"
    lb.before_actlogic()
    rt = lb.filter_point_gt_zero(projId,pointName)
    lb.after_actlogic()
    if expected is not None:
        assert almost_equals(expected, rt) , 'not equal ,actual={0},expected is {1}'.format(rt,expected)
    else:
        assert rt is None,'actual={0}'.format(rt)


