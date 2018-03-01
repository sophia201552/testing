#coding=utf-8
from tests.utils import *
from ExpertContainer.logic.LogicBase import LogicBase
from datetime import datetime
import pytest


@pytest.mark.p0
@pytest.mark.parametrize(('projId', 'strAccumPointName', 'pointName', 'strBirthTime','fMul','value','acttime','strPricePointName'),[
    (293,'Accum_CHWP004_PumpEnergy','CHWP004_PumpPower','2016-08-09 00:00:00',1/12.0,20843.194999999912,datetime(year=2017, month=11, day=1),'CHWP004_Price'),
    (293,'Accum_CHWP004_PumpEnergy','CHWP004_PumpPower','2016-08-09 00:00:00',1/12.0,20843.194999999912,datetime(year=2017, month=10, day=31,hour=12),'CHWP004_Price'),
    (293,'Accum_CHWP004_PumpEnergy','CHWP004_PumpPower','2016-08-09 00:00:00',1/12.0,21630.163333333247,datetime(year=2017, month=11, day=2,hour=12),'CHWP004_Price'),
    (293,'Accum_CHWP004_PumpEnergy','CHWP004_PumpPower','2016-08-09 00:00:00',1/12.0,22124.32666666658,datetime(year=2017, month=11, day=2),'CHWP004_Price'),
    (293,'Accum_CHWP004_PumpEnergy','CHWP004_PumpPower','2016-08-09 00:00:00',1/12.0,21067.824999999913,datetime(year=2017, month=11, day=2),''),
    (293,'Accum_CHWP004_PumpEnergy','CHWP004_PumpPower','2016-08-09 00:00:00',1/12.0,0,datetime(year=2016, month=8, day=6),''),
    (293,'Accum_CHWP004_PumpEnergy','CHWP004_PumpPower','2016-08-09 00:00:00',1/12.0,0.39999999999999997,datetime(year=2016, month=8, day=9,hour=0),''),
    (293,'Accum_CHWP004_PumpEnergy','CHWP004_PumpPower','2016-08-09 00:00:00',1/12.0,21115.58333333325,datetime(year=2017, month=11, day=2,hour=10,minute=15),''),
])
def test_correct(projId,strAccumPointName, pointName, strBirthTime,fMul,value,acttime,strPricePointName):
    lb = LogicBase(projId, acttime, nMode = LogicBase.ONLINE_TEST_REALTIME)
    assert lb, "create instance failed"
    rt = lb.calc_accumulate(projId, strAccumPointName, pointName, strBirthTime,fMul=fMul,strPricePointName=strPricePointName)
    assert almost_equals(value,rt),'actual={0} is not equal to expected={1}'.format(rt,value)

