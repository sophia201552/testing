#coding=utf-8
__author__ = 'angelia'

from ExpertContainer.logic.LogicBase import LogicBase
from ExpertContainer.api.api import  HistoryDataMethods
import datetime
import pytest

#check raw point
@pytest.mark.p0
def test_get_last_update_delta_minutes_of_this_point_raw():
    pointName = 'ChAMPS01'
    projId = 72
    now_time = datetime.datetime.now()
    lb = LogicBase(projId, now_time, nMode= LogicBase.REPAIR_HISTORY)
    assert lb, "create instance logic base failed"
    rv = HistoryDataMethods.get_last_update_time_value(projId, pointName, now_time)
    assert rv, "%s got no recent update time" % pointName
    if rv is not None and isinstance(rv, tuple) and len(rv) >= 2 and rv[0] is not None:
        differ_calc =  (now_time - rv[0]).total_seconds() / 60.0
    else:
        differ_calc = 100000000
    differ = lb.get_last_update_delta_minutes_of_this_point(pointName)
    assert differ_calc == differ, "%s: the point %s recent update delta minutes differ is %s,but got %s" %(projId, pointName, differ_calc, differ)

#check site point
@pytest.mark.p0
def test_get_last_update_delta_minutes_of_this_point_site():
    pointName = 'VAV_J_54_13_Air'
    projId = 72
    now_time = datetime.datetime.now()
    lb = LogicBase(projId, now_time, nMode= LogicBase.REPAIR_HISTORY)
    assert lb, "create instance logic base failed"
    rv = HistoryDataMethods.get_last_update_time_value(projId, pointName, now_time)
    assert rv, "%s got no recent update time" % pointName
    if rv is not None and isinstance(rv, tuple) and len(rv) >= 2 and rv[0] is not None:
        differ_calc =  (now_time - rv[0]).total_seconds() / 60.0
    else:
        differ_calc = 100000000
    differ = lb.get_last_update_delta_minutes_of_this_point(pointName)
    assert differ_calc == differ, "%s: the point %s recent update delta minutes differ is %s,but got %s" %(projId, pointName, differ_calc, differ)

#check virtual point
def test_get_last_update_delta_minutes_of_this_point_virtual():
    pointName = 'BaseChillerSysCOP_sec_svr'
    projId = 72
    now_time = datetime.datetime.now()
    lb = LogicBase(projId, now_time, nMode= LogicBase.REPAIR_HISTORY)
    assert lb, "create instance logic base failed"
    rv = HistoryDataMethods.get_last_update_time_value(projId, pointName, now_time)
    assert rv, "%s got no recent update time" % pointName
    if rv is not None and isinstance(rv, tuple) and len(rv) >= 2 and rv[0] is not None:
        differ_calc =  (now_time - rv[0]).total_seconds() / 60.0
    else:
        differ_calc = 100000000
    differ = lb.get_last_update_delta_minutes_of_this_point(pointName)
    assert differ_calc == differ, "%s: the point %s recent update delta minutes differ is %s,but got %s" %(projId, pointName, differ_calc, differ)

#check calc point
def test_get_last_update_delta_minutes_of_this_point_calc():
    pointName = 'Max_OUTDOORTemp_W'
    projId = 72
    now_time = datetime.datetime.now()
    lb = LogicBase(projId, now_time)
    assert lb, "create instance logic base failed"
    rv = HistoryDataMethods.get_last_update_time_value(projId, pointName, now_time)
    assert rv, "%s got no recent update time" % pointName
    if rv is not None and isinstance(rv, tuple) and len(rv) >= 2 and rv[0] is not None:
        differ_calc =  (now_time - rv[0]).total_seconds() / 60.0
    else:
        differ_calc = 100000000
    differ = lb.get_last_update_delta_minutes_of_this_point(pointName)
    assert differ_calc == differ, "%s: the point %s recent update delta minutes differ is %s,but got %s" %(projId, pointName, differ_calc, differ)