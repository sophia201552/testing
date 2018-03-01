#coding=utf-8

from ExpertContainer.dbAccess.BEOPDataAccess import *
from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
from tests.utils import *
import pytest

@pytest.mark.p0
@pytest.mark.parametrize(("projId", "acttime", "pointList", "runMode",'valueList'),
     [
         (1, datetime(year=2017, month=11, day=4), 'accum_test_electricity', LogicBase.ONLINE_TEST_REALTIME,[0.0,20.1,3.539999999999999,23.64]),
         ('1', datetime(year=2017, month=11, day=4), 'accum_test_electricity', LogicBase.REALTIME,[0.0,20.1,3.539999999999999,23.64]),
         ('1', datetime(year=2017, month=11, day=4), 'accum_test_electricity', LogicBase.REPAIR_HISTORY, [0.0,20.1,3.539999999999999,23.64]),
     ])
def test_correct(projId, acttime, pointList, runMode,valueList):
    lb = LogicBase(projId, acttime, nMode=runMode)
    assert lb, "create instance failed"
    lb.curCalName=pointList
    actual=lb.calc_monthly_delta_of_accum(pointList)
    assert actual is not None,'actual is None'
    assert actual in valueList,'actual is not equal to expected,actual: %s'


@pytest.mark.p0
@pytest.mark.parametrize(("projId", "acttime", "pointList", "runMode"),
     [
         (1,None,'accum_test_electricity',LogicBase.REALTIME),
     ])
def test_wrong(projId, acttime, pointList, runMode):
    lb = LogicBase(projId, acttime, nMode=runMode)
    assert lb, "create instance failed"
    lb.curCalName=pointList
    actual=lb.calc_monthly_delta_of_accum(pointList)
    assert not actual ,'actual is not None'

