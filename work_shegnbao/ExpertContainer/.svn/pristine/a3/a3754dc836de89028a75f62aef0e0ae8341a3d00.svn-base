#coding=utf-8
from tests.utils import *
from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest


@pytest.mark.p0
@pytest.mark.parametrize(('projId','pointName','limitChangeNum','acttime','expected'),[
    (72,'ChAMPS01',10,datetime(year=2017,month=11,day=11),77.4),
    (72,'ChAMPS01a',10,datetime(year=2017,month=11,day=11),None),
    (72,'Plant001_GroupEnergyM',140000,datetime(year=2017,month=8,day=2,hour=1),236629.66500000004),
    (72,'Plant001_GroupEnergyM',100,datetime(year=2017,month=8,day=2),236629.66500000004),
    (72,'Plant001_GroupEnergyM',200,datetime(year=2017,month=8,day=2,hour=1),119268.02083333331),
])
def test_filter_point_energy_consumption(projId,pointName,limitChangeNum,acttime,expected):
    lb = LogicBase(projId,acttime ,nMode=LogicBase.ONLINE_TEST_REALTIME)
    assert lb, "create instance failed"
    rt = lb.filter_point_energy_consumption(projId,pointName,limitChangeNum)
    if expected is not None:
        assert almost_equals(expected, rt) , 'not equal ,actual={0},expected is {1}'.format(rt,expected)
    else:
        assert rt is None,'actual={0}'.format(rt)


