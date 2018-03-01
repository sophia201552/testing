#coding=utf-8
from tests.utils import *
from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest

testdata=[
    (1, 'TestOnOff',  1300, 1300.0, datetime(year=2017, month=11, day=1)),
    (1, 'TestFreq', 1456,  29120.0, datetime(year=2017, month=11, day=1)),
]
@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'point_name', 'rated_power','value','acttime'),testdata)
def test_correct(projId, point_name, rated_power,value,acttime):
    lb = LogicBase(projId, acttime, nMode = LogicBase.ONLINE_TEST_REALTIME)
    assert lb, "create instance failed"
    rt = lb.calc_power_by_run(projId, point_name, rated_power)
    assert almost_equals(value,rt),'actual={0} is not equal to expected={1}'.format(rt,value)


@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'point_name', 'rated_power','acttime'),[
    (1,None,100,datetime(year=2017, month=11, day=1)),
])
def test_wrong(projId, point_name,  rated_power,acttime):
    lb = LogicBase(projId, acttime, nMode = LogicBase.ONLINE_TEST_REALTIME)
    assert lb, "create instance failed"
    rt = lb.calc_power_by_run(projId, point_name, rated_power)
    assert not rt,'actual is not None'