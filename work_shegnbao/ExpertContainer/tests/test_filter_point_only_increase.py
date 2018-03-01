#coding=utf-8
from tests.utils import *
from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest


@pytest.mark.p0
@pytest.mark.parametrize(('projId','pointName','acttime','expected'),[
    (72,'ChAMPS01',datetime(year=2017,month=11,day=11),77.4),
    (72,'BaseChillerSysCOP_sec_svr',datetime(year=2017,month=7,day=2),6.29),
    (72,'ChAMPS01',datetime(year=2017,month=6,day=1),82.8),
    (72, 'Plant001_GroupEnergyM', datetime(year=2017, month=8, day=2, hour=1), 236629.66500000004),
    (72,'BaseChillerSysCOP_sec_svr',datetime(year=2017,month=11,day=11),6.29),
])
def test_filter_point_only_increase(projId,pointName,acttime,expected):
    lb = LogicBase(projId,acttime ,nMode=LogicBase.ONLINE_TEST_REALTIME)
    assert lb, "create instance failed"
    rt = lb.filter_point_only_increase(projId,pointName)
    assert almost_equals(expected,rt),'not equal ,actual={0},expected is {1}'.format(rt,expected)


