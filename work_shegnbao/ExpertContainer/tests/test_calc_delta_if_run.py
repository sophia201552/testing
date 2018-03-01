#coding=utf-8
from tests.utils import *
from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest

testdata=[
    ((1,'TestOnOff','TestFreq','TestRatePower',-760.0,datetime(year=2017, month=11, day=1))),
    (1,'TestFreq','TestRatePower','TestOnOff',-20.0,datetime(year=2017, month=11, day=1)),
]
@pytest.mark.p1
@pytest.mark.parametrize(('projId',  'a_point_name', 'b_point_name', 'run_point_name','value','acttime'),testdata)
def test_correct(projId,  a_point_name, b_point_name, run_point_name,value,acttime):
    lb = LogicBase(projId, acttime, nMode = LogicBase.ONLINE_TEST_REALTIME)
    assert lb, "create instance failed"
    rt = lb.calc_delta_if_run(projId,  a_point_name, b_point_name, run_point_name)
    assert almost_equals(value,rt),'actual={0} is not equal to expected={1}'.format(rt,value)


testdatawrong=[(-1,'TestOnOff','TestFreq','TestRatePower',datetime(year=2017, month=11, day=1))]
@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'a_point_name', 'b_point_name', 'run_point_name','acttime'),testdatawrong)
def test_wrong(projId, a_point_name, b_point_name, run_point_name,acttime):
    lb = LogicBase(projId, acttime, nMode = LogicBase.ONLINE_TEST_REALTIME)
    assert lb, "create instance failed"
    rt = lb.calc_delta_if_run(projId,  a_point_name, b_point_name, run_point_name)
    assert not rt,'actual is not None'

