#coding=utf-8
from tests.utils import *
from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest

testdata=[
    (293, 'CHWP004_PumpPower','CHWP004_Price',1/12.0, 'm5', datetime(year=2017, month=11, day=1),LogicBase.ONLINE_TEST_REALTIME,1.92),
    (293, 'CHWP004_PumpPower','CHWP004_Price',1/12.0, 'm5', datetime(year=2017, month=11, day=1,hour=12),LogicBase.ONLINE_TEST_REALTIME,561.0800000000005),
    (293, 'CHWP004_PumpPower','CHWP004_Price',1/12.0, 'm5', datetime(year=2017, month=11, day=1,hour=12),LogicBase.REPAIR_HISTORY,562.8800000000006),
    (293, 'CHWP004_PumpPower','CHWP004_Price',1/12.0, 'h1', datetime(year=2017, month=11, day=1,hour=12),LogicBase.REPAIR_HISTORY,47.67999999999999),
    (293, 'CHWP004_PumpPower','CHWP004_Price',1/12.0, 'm1', datetime(year=2017, month=11, day=1,hour=0,minute=20),LogicBase.REPAIR_HISTORY,4.3999999999999995),
]
@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointName', 'strPricePointName', 'constant', 'timeFormat','acttime','mode','expected'),testdata)
def test_correct(projId, pointName, strPricePointName, constant, timeFormat,acttime,mode,expected):
    lb = LogicBase(projId, acttime, nMode = mode)
    assert lb, "create instance failed"
    rt = lb.calc_sum_cost_day(projId, pointName, strPricePointName, constant, timeFormat)
    assert almost_equals(expected,rt),'actual={0} is not equal to expected={1}'.format(rt,expected)


@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'pointName', 'strPricePointName', 'constant', 'timeFormat','acttime'),[
    (293, None, None, 1 / 12.0, 'm5', datetime(year=2017, month=11, day=1)),
    (293, 'CHWP004_PumpPower','CHWP004_Price', 1 / 12.0, 'm5', "2017-11-01 00:00:00"),
    (293, 'CHWP004_PumpPower1','CHWP004_Price', 1 / 12.0, 'm5', datetime(year=2017, month=11, day=1)),
])
def test_wrong(projId, pointName, strPricePointName, constant, timeFormat,acttime):
    lb = LogicBase(projId, acttime, nMode = LogicBase.ONLINE_TEST_REALTIME)
    assert lb, "create instance failed"
    rt = lb.calc_sum_cost_day(projId, pointName, strPricePointName, constant, timeFormat)
    assert not rt,'actual is not None'