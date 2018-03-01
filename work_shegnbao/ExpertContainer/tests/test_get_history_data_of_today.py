#coding=utf-8

from ExpertContainer.logic.LogicBase import LogicBase
import datetime
import pytest
from ExpertContainer.dbAccess.BEOPDataAccess import BEOPDataAccess
from tests.utils import *
@pytest.mark.p0
@pytest.mark.parametrize(('point'),[
    ('VAV_J_54_13_Air Flow'),
    ('BaseChillerSysCOP_sec_svr'),
    ('Max_OUTDOORTemp_W'),
])
def test_huawei_point(point):
    endTime = datetime.datetime(year=2017,month=7,day=20,hour=23).replace(second=0,minute=0)
    start_time=endTime.strftime('%Y-%m-%d 00:00:00')
    prj_id=72
    lb = LogicBase(prj_id, endTime)
    assert lb, "create instance LogicBase failed"
    actual=lb.get_history_data_of_today(prj_id, point)
    expected=BEOPDataAccess.getInstance().get_history_data_padded(prj_id, [point], start_time, endTime.strftime('%Y-%m-%d %H:00:00'), "h1")
    assert_result_equal_getHistoryDataOfToday(actual, expected)


@pytest.mark.p0
@pytest.mark.parametrize(('point','prjId','endTime'),[
    ('Max_OUTDOORTemp_W',-1,datetime.datetime.now().replace(second=0,minute=0)),
    ('Max_OUTDOORTemp_W1111',72,datetime.datetime.now().replace(second=0,minute=0)),
    (['Max_OUTDOORTemp_W'],72,datetime.datetime.now().strftime('%Y-%m-%d %H:00')),
])
def test_huawei_wrong(point,prjId,endTime):
    lb = LogicBase(prjId, endTime)
    assert lb, "create instance LogicBase failed"
    actual=lb.get_history_data_of_today(prjId, point)
    assert not actual,'acutal is not None with wrong data:point:%s, project_id:%s,endTime:%s'%(point,prjId,endTime)


